#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import extract from 'extract-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');

const DEFAULT_ONEDRIVE_DIR = '/Users/lueqian/Library/CloudStorage/OneDrive-个人/202604 DataStory/（2） 工作留痕/Axhub每周备份';

// 命令行参数解析
const args = process.argv.slice(2);
let zipPath = null;
const zipIdx = args.findIndex((arg) => arg === '--zip' || arg === '-z' || arg === '--file' || arg === '-f');
if (zipIdx !== -1 && args[zipIdx + 1] && !args[zipIdx + 1].startsWith('-')) {
  zipPath = args[zipIdx + 1];
} else if (args[0] && !args[0].startsWith('-')) {
  zipPath = args[0];
}

/**
 * 自动寻找最新的备份包
 */
function findLatestBackup() {
  const searchDirs = [workspaceRoot];
  if (fs.existsSync(DEFAULT_ONEDRIVE_DIR)) {
    searchDirs.unshift(DEFAULT_ONEDRIVE_DIR);
  }

  for (const dir of searchDirs) {
    try {
      const files = fs.readdirSync(dir)
        .filter((f) => f.startsWith('Axhub-FullBackup-') && f.endsWith('.zip'))
        .map((f) => ({
          name: f,
          full: path.join(dir, f),
          mtime: fs.statSync(path.join(dir, f)).mtimeMs,
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (files.length > 0) {
        return files[0].full;
      }
    } catch {}
  }
  return null;
}

async function runRestore() {
  console.log(`\n==================================================`);
  console.log(`🔄 开始执行 Axhub 灾难自愈与恢复流程`);
  console.log(`==================================================`);

  let targetZip = zipPath;
  if (!targetZip) {
    console.log(`🔍 未指定备份文件，正在自动检索最新备份包...`);
    targetZip = findLatestBackup();
  }

  if (!targetZip || !fs.existsSync(targetZip)) {
    console.error(`❌ 错误: 未找到有效的备份压缩包！`);
    console.error(`   用法: node scripts/restore-from-backup.mjs --zip <备份文件路径.zip>`);
    process.exit(1);
  }

  console.log(`📦 确认备份源: ${targetZip}`);

  // 1. 解压备份到工作区
  console.log(`\n[1/4] 正在解压备份文件到工作区...`);
  try {
    await extract(targetZip, { dir: workspaceRoot });
    console.log(`   ✓ 解压完成！所有源码、定制平台与原型资产已复位。`);
  } catch (err) {
    console.error(`❌ 解压失败:`, err);
    process.exit(1);
  }

  // 2. 检查并读取元数据
  const manifestPath = path.join(workspaceRoot, 'backup-manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log(`\n📋 备份版本档案:`);
      console.log(`   - 备份时间: ${manifest.backupDate}`);
      console.log(`   - 原型项目: ${manifest.prototypes.map((p) => p.displayName).join(', ')}`);
      console.log(`   - 公共套件: ${manifest.commonModules.join(', ')}`);
    } catch {}
  }

  // 3. 自动安装依赖
  console.log(`\n[2/4] 正在重新构建 node_modules 纯净依赖...`);
  try {
    const hasPnpm = Boolean(execSync('which pnpm || echo ""', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim());
    if (hasPnpm) {
      console.log(`   ✓ 执行 pnpm install...`);
      execSync('pnpm install', { cwd: workspaceRoot, stdio: 'inherit' });
    } else {
      console.log(`   ✓ 执行 npm install...`);
      execSync('npm install', { cwd: workspaceRoot, stdio: 'inherit' });
    }
    console.log(`   ✓ 依赖安装成功！`);
  } catch (err) {
    console.error(`❌ 依赖安装失败:`, err.message);
    process.exit(1);
  }

  // 4. 同步内部 Vendor 资产
  console.log(`\n[3/4] 正在同步 Vendor 运行时...`);
  try {
    execSync('pnpm vendor:sync || npm run vendor:sync', { cwd: workspaceRoot, stdio: 'inherit' });
    console.log(`   ✓ Vendor 同步就绪！`);
  } catch (err) {
    console.warn(`⚠️ Vendor 同步警告:`, err.message);
  }

  // 5. 校验与自检完成
  console.log('\n==================================================');
  console.log(`✅ Axhub 灾难自愈恢复全部完成！`);
  console.log(`🚀 您可以随时运行以下命令启动服务:`);
  console.log(`   pnpm dev`);
  console.log(`🌐 默认访问地址: http://localhost:51720`);
  console.log('==================================================\n');
}

runRestore().catch((e) => {
  console.error('恢复失败:', e);
  process.exit(1);
});
