import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');

// 命令行参数解析
const args = process.argv.slice(2);
const isDistMode = args.includes('--dist');
const isSourceMode = args.includes('--source') || (!isDistMode && !args.includes('--dist'));

// 解析 --prototype 或 -p 参数
let targetPrototype = null;
const protoIdx = args.findIndex((arg) => arg === '--prototype' || arg === '-p');
if (protoIdx !== -1 && args[protoIdx + 1] && !args[protoIdx + 1].startsWith('-')) {
  targetPrototype = args[protoIdx + 1];
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

let outputFileName = '';
if (targetPrototype) {
  outputFileName = isDistMode
    ? `${targetPrototype}-dist-${timestamp}.zip`
    : `${targetPrototype}-full-source-${timestamp}.zip`;
} else {
  outputFileName = isDistMode
    ? `axhub-release-dist-${timestamp}.zip`
    : `axhub-clean-source-${timestamp}.zip`;
}

const outputPath = path.join(workspaceRoot, outputFileName);
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
  console.log('\n==================================================');
  console.log(`✅ 打包完成！`);
  console.log(`📦 输出文件: ${outputFileName}`);
  console.log(`📏 文件大小: ${sizeMB} MB`);
  console.log(`📁 存放路径: ${outputPath}`);
  console.log('==================================================\n');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

const JUNK_ENTRY_PATTERNS = [
  /(?:^|[\\/])\.DS_Store$/i,
  /(?:^|[\\/])\._.*$/i,
  /(?:^|[\\/])Thumbs\.db$/i,
  /(?:^|[\\/])ehthumbs\.db$/i,
  /(?:^|[\\/])desktop\.ini$/i,
  /(?:^|[\\/])__MACOSX(?:\/|$)/i,
];

function filterCleanZipEntry(entry) {
  const normalized = (entry.name || '').replace(/\\/g, '/');
  if (JUNK_ENTRY_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }
  return entry;
}

/**
 * 递归收集目录下的代码文件
 */
function collectCodeFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(collectCodeFiles(full));
    } else if (/\.(tsx?|jsx?|vue|css|json)$/.test(item.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * 自动静态分析目标原型所依赖的公共模块 (@/common/*)
 */
function scanCommonDependencies(prototypeName) {
  const protoDir = path.join(workspaceRoot, 'src', 'prototypes', prototypeName);
  if (!fs.existsSync(protoDir)) return [];

  const files = collectCodeFiles(protoDir);
  const commonDeps = new Set();
  const importRegex = /(?:import|from)\s+[\x27"]@\/common\/([^/\x27"]+)[^\x27"]*[\x27"]/g;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      commonDeps.add(match[1]);
    }
  }
  return Array.from(commonDeps);
}

// 针对单一原型进行专项独立导出
if (targetPrototype) {
  const protoDir = path.join(workspaceRoot, 'src', 'prototypes', targetPrototype);
  if (!fs.existsSync(protoDir)) {
    console.error(`❌ 错误: 原型目录不存在: src/prototypes/${targetPrototype}`);
    process.exit(1);
  }

  console.log(`\n🚀 开始打包 [原型专项独立包: ${targetPrototype}] (${isDistMode ? 'Dist 静态版' : '完整自包含源码工程'})...`);

  // 1. 扫描该原型代码引用的所有公共模块
  const detectedCommonDeps = scanCommonDependencies(targetPrototype);
  console.log(`🔍 自动检测到原型依赖的公共模块:`, detectedCommonDeps.length > 0 ? detectedCommonDeps.join(', ') : '无');

  if (isDistMode) {
    // 静态产物模式
    const distDir = path.join(workspaceRoot, 'dist');
    const protoDistHtml = path.join(distDir, 'prototypes', `${targetPrototype}.html`);
    const protoDistJs = path.join(distDir, 'prototypes', `${targetPrototype}.js`);

    if (!fs.existsSync(distDir)) {
      console.error(`❌ 错误: dist 目录不存在！请先运行构建命令: ENTRY_KEY=prototypes/${targetPrototype} pnpm build`);
      process.exit(1);
    }

    archive.directory(distDir, 'dist', filterCleanZipEntry);
    const windowsServiceDir = path.join(workspaceRoot, 'windows-service');
    if (fs.existsSync(windowsServiceDir)) {
      archive.directory(windowsServiceDir, 'windows-service', filterCleanZipEntry);
    }

    const distStartBat = `@echo off
chcp 65001 >nul
title ${targetPrototype} - 原型静态服务
echo ===================================================
echo              ${targetPrototype} - 静态演示服务
echo ===================================================
echo.
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 正在使用 Python 启动 HTTP 静态服务器 (端口 51720)...
    start http://localhost:51720/dist/prototypes/${encodeURIComponent(targetPrototype)}.html
    python -m http.server 51720
    goto END
)
where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 正在使用 npx serve 启动静态服务器 (端口 51720)...
    start http://localhost:51720/dist/prototypes/${encodeURIComponent(targetPrototype)}.html
    npx serve -l 51720
    goto END
)
echo 警告: 未在当前电脑找到 Python 或 Node.js，请确保目标电脑已安装至少一种运行环境。
pause
:END
`;
    archive.append(distStartBat, { name: '启动局域网服务.bat' });

  } else {
    // 完整自包含源码模式：打包可直接在新电脑运行的精简专属工程
    console.log(`📦 正在收集必要模块清单:`);

    // ① 原型主体目录 (必须包含全部场景、组件、样式、SVG架构图)
    console.log(`   ✓ [核心原型] src/prototypes/${targetPrototype}`);
    archive.directory(protoDir, `src/prototypes/${targetPrototype}`, filterCleanZipEntry);

    // ② 必须包含的公共模块 (特别是新场景强依赖的 Annotation 批注套件以及基础 Common)
    const commonDir = path.join(workspaceRoot, 'src', 'common');
    if (fs.existsSync(commonDir)) {
      console.log(`   ✓ [公共套件] src/common (包含 Annotation 批注套件及底层 Shim)`);
      archive.directory(commonDir, 'src/common', filterCleanZipEntry);
    }

    // ③ 收集该原型相关的业务规格文档与培训资料
    const docsDir = path.join(workspaceRoot, 'src', 'docs');
    if (fs.existsSync(docsDir)) {
      const docEntries = fs.readdirSync(docsDir, { withFileTypes: true });
      for (const entry of docEntries) {
        if (entry.isFile()) {
          const name = entry.name;
          // 匹配目标原型名称相关的文档，或者通用指导手册
          if (name.includes(targetPrototype) || name.includes('场景') || name.includes('跨租户') || name.includes('操作手册') || name.includes('指南')) {
            console.log(`   ✓ [业务文档] src/docs/${name}`);
            archive.file(path.join(docsDir, name), { name: `src/docs/${name}` });
          }
        }
      }
    }

    // ④ 页面可消费的数据表 (如果存在)
    const databaseDir = path.join(workspaceRoot, 'src', 'database');
    if (fs.existsSync(databaseDir)) {
      console.log(`   ✓ [数据资产] src/database`);
      archive.directory(databaseDir, 'src/database', filterCleanZipEntry);
    }

    // ⑤ 主题配置 (如果存在)
    const themesDir = path.join(workspaceRoot, 'src', 'themes');
    if (fs.existsSync(themesDir)) {
      console.log(`   ✓ [主题配置] src/themes`);
      archive.directory(themesDir, 'src/themes', filterCleanZipEntry);
    }

    // ⑥ 基础工程文件与脚手架 (package.json, vite.config.ts, vite-plugins, scripts, vendor 等)
    const rootIncludes = [
      'package.json',
      'pnpm-lock.yaml',
      'vite.config.ts',
      'tsconfig.json',
      'tsconfig.typecheck.json',
      'tailwind.config.js',
      'AGENTS.md',
      'CLAUDE.md',
      'README.md',
    ];
    for (const f of rootIncludes) {
      const full = path.join(workspaceRoot, f);
      if (fs.existsSync(full)) {
        archive.file(full, { name: f });
      }
    }

    // 基础系统与构建目录
    const dirsToInclude = ['vite-plugins', 'scripts', 'vendor', 'rules', 'skills'];
    for (const d of dirsToInclude) {
      const full = path.join(workspaceRoot, d);
      if (fs.existsSync(full)) {
        console.log(`   ✓ [工程基础] ${d}/`);
        archive.directory(full, d, filterCleanZipEntry);
      }
    }

    // 包含 src 根目录下的类型声明文件
    const srcViteEnv = path.join(workspaceRoot, 'src', 'vite-env.d.ts');
    if (fs.existsSync(srcViteEnv)) {
      archive.file(srcViteEnv, { name: 'src/vite-env.d.ts' });
    }

    // ⑦ 生成新电脑一键运行批处理脚本
    const devStartBat = `@echo off
chcp 65001 >nul
title ${targetPrototype} - 开发与预览服务

echo ===================================================
echo              ${targetPrototype} - 开发预览服务
echo ===================================================
echo.

if not exist node_modules (
    echo [提示] 检测到当前电脑尚未安装依赖，正在自动执行安装...
    where pnpm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        call pnpm install
    ) else (
        where npm >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            call npm install
        ) else (
            echo [错误] 未检测到 Node.js / pnpm / npm 环境，请先安装 Node.js！
            pause
            exit /b 1
        )
    )
)

echo.
echo [启动中] 正在启动 Vite 开发服务...
echo 启动成功后，浏览器将自动或可手动访问:
echo http://localhost:51720/prototypes/${encodeURIComponent(targetPrototype)}?axhubDisplayName=${encodeURIComponent(targetPrototype)}
echo.

where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    call pnpm run dev
) else (
    call npm run dev
)
pause
`;
    archive.append(devStartBat, { name: '一键启动服务(Windows).bat' });

    const devStartSh = `#!/usr/bin/env bash
set -e
echo "==================================================="
echo "             ${targetPrototype} - 开发预览服务"
echo "==================================================="

if [ ! -d "node_modules" ]; then
    echo "[提示] 检测到尚未安装依赖，正在自动安装..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
fi

echo ""
echo "[启动中] 正在启动服务..."
echo "访问地址: http://localhost:51720/prototypes/${encodeURIComponent(targetPrototype)}"
echo ""

if command -v pnpm &> /dev/null; then
    pnpm run dev
else
    npm run dev
fi
`;
    archive.append(devStartSh, { name: '启动服务(Mac-Linux).sh' });
  }

} else if (isDistMode) {
  console.log('🚀 开始打包 [静态构建产物包 (Dist Release)]...');

  const distDir = path.join(workspaceRoot, 'dist');
  const windowsServiceDir = path.join(workspaceRoot, 'windows-service');

  if (!fs.existsSync(distDir)) {
    console.error('❌ 错误: dist 目录不存在！请先运行 `pnpm build` 进行构建。');
    process.exit(1);
  }

  // 1. 添加 dist 目录（过滤 .DS_Store 等跨平台垃圾文件）
  archive.directory(distDir, 'dist', filterCleanZipEntry);
  
  // 2. 添加 windows-service 部署工具箱（过滤 .DS_Store 等）
  if (fs.existsSync(windowsServiceDir)) {
    archive.directory(windowsServiceDir, 'windows-service', filterCleanZipEntry);
  }

  // 3. 生成一个针对静态 dist 简易服务启动的 bat
  const distStartBatContent = `@echo off
chcp 65001 >nul
title Axhub 原型服务 (Dist 静态版)

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

} else {
  console.log('🚀 开始打包 [全局精简源码包 (Clean Source)]...');

  // 黑名单过滤列表 (跳过 node_modules, .git, 临时构建文件等)
  const excludePatterns = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/temp/**',
    '**/.DS_Store',
    '**/.DS_Store?*',
    '**/._*',
    '**/__MACOSX/**',
    '**/Thumbs.db',
    '**/ehthumbs.db',
    '**/desktop.ini',
    '*.timestamp-*.mjs',
    '**/*.timestamp-*.mjs',
    '*.timestamp-*.js',
    '**/*.timestamp-*.js',
    '*.zip'
  ];

  archive.glob('**/*', {
    cwd: workspaceRoot,
    ignore: excludePatterns,
    dot: true
  });
}

archive.finalize();
