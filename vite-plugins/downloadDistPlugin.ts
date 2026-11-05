import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

import { buildAttachmentContentDisposition } from './utils/contentDisposition';
import { getRequestPathname } from './utils/httpUtils';
import { filterCleanZipEntry } from './utils/zipUtils';

export function downloadDistPlugin(): Plugin {
  return {
    name: 'download-dist-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const pathname = getRequestPathname(req);
        if (req.method !== 'GET' || pathname !== '/api/download-dist') {
          return next();
        }

        try {
          const projectRoot = process.cwd();
          const distDir = path.resolve(projectRoot, 'dist');

          if (!fs.existsSync(distDir)) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Dist directory not found' }));
            return;
          }

          let projectName = 'project';
          try {
            const pkgPath = path.resolve(projectRoot, 'package.json');
            if (fs.existsSync(pkgPath)) {
              const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
              projectName = pkg.name || 'project';
            }
          } catch (error) {
            console.warn('Failed to read project name from package.json:', error);
          }

          const archive = archiver('zip', { zlib: { level: 9 } });

          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Disposition', buildAttachmentContentDisposition(`${projectName}-service-release.zip`));

          archive.on('warning', (warning: any) => {
            console.warn('[download-dist-plugin] ZIP warning:', warning);
          });

          archive.on('error', (error: any) => {
            console.error('[download-dist-plugin] ZIP error:', error);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: `Failed to create zip: ${error.message}` }));
              return;
            }
            res.destroy(error);
          });

          archive.pipe(res);

          // 1. 打包 dist 目录产物（自动剔除 .DS_Store 等跨平台系统垃圾文件）
          archive.directory(distDir, 'dist', filterCleanZipEntry);

          // 2. 打包 windows-service 脚本工具（自动剔除 .DS_Store 等）
          const windowsServiceDir = path.resolve(projectRoot, 'windows-service');
          if (fs.existsSync(windowsServiceDir)) {
            archive.directory(windowsServiceDir, 'windows-service', filterCleanZipEntry);
          }

          // 3. 注入一键启动批处理脚本
          const distStartBatContent = `@echo off
chcp 65001 >nul
title Axhub 原型局域网共享服务 (Dist 静态版)

echo ===================================================
echo              蓝鹰一体化系统 - 原型静态服务
echo ===================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 正在使用 Python 启动 HTTP 静态服务器...
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        set IP=%%a
        set IP=!IP:~1!
        echo 本局域网访问地址: http://!IP!:51720/dist/
    )
    python -m http.server 51720
    goto END
)

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 正在使用 npx serve 启动静态服务器...
    npx serve -l 51720
    goto END
)

echo 警告: 未在当前电脑找到 Python 或 Node.js，请确保目标电脑已安装至少一种环境。
pause

:END
`;
          archive.append(distStartBatContent, { name: '启动局域网服务.bat' });

          void archive.finalize();
        } catch (error: any) {
          console.error('Download dist error:', error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
        }
      });
    },
  };
}
