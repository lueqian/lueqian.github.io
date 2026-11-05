#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 项目根目录自愈清理器：
 * 在 dev / build 启动前静默清除异常中断留下的 Vite 时间戳快照、根目录及 dist 目录的 .DS_Store 等临时垃圾文件
 */
function cleanRootJunk() {
  try {
    const entries = fs.readdirSync(appRoot, { withFileTypes: true });
    for (const entry of entries) {
      // 1. 清理 Vite / Vitest 异常退出残留的时间戳快照
      if (entry.isFile() && entry.name.includes('.timestamp-')) {
        try {
          fs.unlinkSync(path.join(appRoot, entry.name));
        } catch {}
      }
      // 2. 清理根目录 .DS_Store
      if (entry.isFile() && entry.name === '.DS_Store') {
        try {
          fs.unlinkSync(path.join(appRoot, entry.name));
        } catch {}
      }
      // 3. 清理根目录下临时过渡目录 temp / tmp 内部的垃圾（保留目录骨架与 .gitkeep）
      if (entry.isDirectory() && (entry.name === 'temp' || entry.name === 'tmp')) {
        try {
          const tempPath = path.join(appRoot, entry.name);
          const subEntries = fs.readdirSync(tempPath);
          for (const sub of subEntries) {
            if (sub !== '.gitkeep') {
              fs.rmSync(path.join(tempPath, sub), { recursive: true, force: true });
            }
          }
        } catch {}
      }
    }

    // 4. 清理 dist/.DS_Store 避免影响打包
    const distDsStore = path.join(appRoot, 'dist', '.DS_Store');
    if (fs.existsSync(distDsStore)) {
      try {
        fs.unlinkSync(distDsStore);
      } catch {}
    }
  } catch {
    // 静默跳过，绝不阻断正常开发与构建流程
  }
}

cleanRootJunk();
