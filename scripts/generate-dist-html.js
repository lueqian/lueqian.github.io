#!/usr/bin/env node

/**
 * 为 dist 目录下的所有 JS 文件生成对应的 HTML 文件
 * 使用 html-template.html 模板，用于构建后直接访问
 * 同时在 dist 根目录生成整站导航门户 index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(workspaceRoot, 'dist');
const adminDir = path.resolve(workspaceRoot, 'admin');
const templatePath = path.join(adminDir, 'html-template.html');

let generatedCount = 0;

// 检查模板是否存在
if (!fs.existsSync(templatePath)) {
  console.error('错误: html-template.html 模板不存在，请先构建 prototype-admin');
  console.error('路径:', templatePath);
  process.exit(1);
}

// 检查 dist 目录是否存在
if (!fs.existsSync(distDir)) {
  console.log('dist 目录不存在，跳过 HTML 生成');
  process.exit(0);
}

const template = fs.readFileSync(templatePath, 'utf8');

/**
 * 递归遍历目录，为每个 JS 文件生成 HTML
 */
function generateHtmlForDirectory(dir, baseDir = distDir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      // 递归处理子目录
      generateHtmlForDirectory(itemPath, baseDir);
    } else if (item.name.endsWith('.js') && !item.name.includes('.worker')) {
      // 为 JS 文件生成 HTML
      const relativePath = path.relative(baseDir, itemPath);
      const jsName = relativePath.replace('.js', '');
      const htmlPath = path.join(dir, item.name.replace('.js', '.html'));

      // 根据路径生成标题
      let title = 'Preview';
      if (jsName.startsWith('components/')) {
        const name = jsName.replace('components/', '');
        title = `Element: ${name}`;
      } else if (jsName.startsWith('prototypes/')) {
        const name = jsName.replace('prototypes/', '');
        title = `Page: ${name}`;
      }

      // 计算 JS 文件的相对路径（从 HTML 的位置）
      const jsFileName = `./${item.name}`;

      // 计算 bootstrap JS 的相对路径
      const relativeDir = path.relative(baseDir, dir);
      const depth = relativeDir ? relativeDir.split(path.sep).length : 0;
      const bootstrapPath = depth > 0
        ? '../'.repeat(depth) + 'assets/html-template-bootstrap.js'
        : './assets/html-template-bootstrap.js';

      // 替换模板变量
      let html = template.replace('{{TITLE}}', title);
      html = html.replace('{{ENTRY}}', jsFileName);
      html = html.replace('{{BOOTSTRAP_PATH}}', bootstrapPath);

      // 写入 HTML 文件
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log(`生成: ${relativePath.replace('.js', '.html')}`);
      generatedCount++;
    }
  }
}

console.log('\n开始为 dist 目录生成 HTML 文件...\n');

generateHtmlForDirectory(distDir);

console.log(`\n完成！共生成 ${generatedCount} 个 HTML 文件。`);
console.log('模板文件: admin/html-template.html\n');

// 复制 admin/assets 下的所有资源（包括 chunks、字体、css、bootstrap 等）到 dist/assets
const srcAssetsDir = path.join(adminDir, 'assets');
const destAssetsDir = path.join(distDir, 'assets');

if (fs.existsSync(srcAssetsDir)) {
  if (!fs.existsSync(destAssetsDir)) {
    fs.mkdirSync(destAssetsDir, { recursive: true });
  }
  fs.cpSync(srcAssetsDir, destAssetsDir, { recursive: true });
  console.log('✓ admin/assets 资源库 (包含 chunks 及全量依赖) 已完整同步到 dist/assets');
} else {
  console.warn('⚠ admin/assets 目录不存在，请先检查 prototype-admin 构建产物');
}

/**
 * 原型元信息字典（提供更易读的中文标题与业务描述）
 */
const PROTOTYPE_META = {
  '蓝鹰一体化系统': {
    title: '蓝鹰一体化系统',
    desc: '面向超管和值班人员的一体化智控舆情及事件处置系统原型，涵盖源头防控、跨租户协同流转、研判处置与全景看板。',
    badge: '核心主系统',
    isPrimary: true,
  },
  'cross-tenant-flow': {
    title: '跨租户全流程业务协同',
    desc: '省厅、总队与基层单位跨租户任务流转、权限隔离与数据交互配置演示。',
    badge: '业务协同',
  },
  'gov_control_platform': {
    title: '政务智控协同平台',
    desc: '涉外舆情监测预警与跨部门管控指挥调度系统。',
    badge: '管控指挥',
  },
  'eagle_datastory_TGManagementForGuangZhou': {
    title: '广州TG群组管控系统',
    desc: 'Telegram 重点群组监控、采集限额风控校验及专项处置工单管理。',
    badge: '专项处置',
  },
  'DataStory_Backend_Management_System': {
    title: '数据故事后端管理系统',
    desc: '采集任务配置、信源额度分配与智能推荐规则后台系统。',
    badge: '后台管理',
  },
  'eagle_datastory': {
    title: '鹰眼数据故事平台',
    desc: '全景舆情事件追踪、态势演化与数据看板原型。',
    badge: '数据平台',
  },
  'eagle_datastory_formemecoin': {
    title: 'MemeCoin 专项监测平台',
    desc: '特定虚拟货币与海外社交媒体舆情挖掘分析系统。',
    badge: '专项分析',
  },
  'design-playground': {
    title: '设计规范演练场',
    desc: '通用组件库、视觉规范与交互模式展示沙盒。',
    badge: '设计规范',
  },
};

/**
 * 在 dist 根目录生成整站导航门户 index.html
 */
function generateDistPortal() {
  const prototypesDir = path.join(distDir, 'prototypes');
  const items = [];

  if (fs.existsSync(prototypesDir)) {
    const files = fs.readdirSync(prototypesDir);
    for (const file of files) {
      if (file.endsWith('.html')) {
        const rawName = file.replace('.html', '');
        const meta = PROTOTYPE_META[rawName] || {
          title: rawName,
          desc: `原型文件: prototypes/${file}`,
          badge: '原型演示',
        };
        items.push({
          rawName,
          file,
          title: meta.title,
          desc: meta.desc,
          badge: meta.badge,
          isPrimary: Boolean(meta.isPrimary),
        });
      }
    }
  }

  // 排序：核心主系统置顶，其余按标题字母排序
  items.sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.title.localeCompare(b.title, 'zh-CN');
  });

  const primaryItem = items.find((i) => i.isPrimary) || items[0];

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>蓝鹰一体化系统 · 原型演示站</title>
  <style>
    :root {
      --primary: #1d4ed8;
      --primary-hover: #1e40af;
      --primary-light: #eff6ff;
      --bg: #0b1329;
      --card-bg: rgba(18, 30, 58, 0.75);
      --card-border: rgba(59, 130, 246, 0.25);
      --card-hover-border: rgba(96, 165, 250, 0.6);
      --text-main: #f8fafc;
      --text-sub: #94a3b8;
      --accent: #38bdf8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0b1329 100%);
      color: var(--text-main);
      min-height: 100vh;
      padding: 32px 20px 60px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* 顶部导航与标题 */
    header {
      text-align: center;
      margin-bottom: 40px;
      padding: 20px 0;
    }

    .logo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(30, 58, 138, 0.5);
      border: 1px solid rgba(96, 165, 250, 0.3);
      color: var(--accent);
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 16px;
      backdrop-filter: blur(8px);
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 40%, #93c5fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 15px;
      color: var(--text-sub);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* 核心主系统 Hero 卡片 */
    ${primaryItem ? `
    .hero-card {
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.55) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1px solid rgba(96, 165, 250, 0.45);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 40px rgba(59, 130, 246, 0.15);
      backdrop-filter: blur(12px);
    }

    .hero-card::after {
      content: "";
      position: absolute;
      top: -50%;
      right: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .hero-tag {
      background: #2563eb;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .hero-title {
      font-size: 26px;
      font-weight: 700;
      color: #ffffff;
    }

    .hero-desc {
      font-size: 15px;
      color: #cbd5e1;
      line-height: 1.7;
      max-width: 820px;
    }

    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      text-decoration: none;
      font-size: 14px;
      padding: 12px 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
    }
    ` : ''}

    /* 原型列表区域 */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-input {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 8px 14px;
      color: #f8fafc;
      font-size: 13px;
      outline: none;
      width: 240px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: #38bdf8;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
      backdrop-filter: blur(8px);
    }

    .card:hover {
      border-color: var(--card-hover-border);
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    .card-top {
      margin-bottom: 16px;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .card-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.25);
    }

    .card-title {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .card-desc {
      font-size: 13px;
      color: var(--text-sub);
      line-height: 1.6;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .card-btn {
      flex: 1;
      text-align: center;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .card-btn-open {
      background: rgba(59, 130, 246, 0.18);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .card-btn-open:hover {
      background: #2563eb;
      color: #fff;
      border-color: #2563eb;
    }

    .card-btn-blank {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      flex: 0 0 auto;
      padding: 8px 14px;
    }

    .card-btn-blank:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }

    footer {
      text-align: center;
      margin-top: 60px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #64748b;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo-badge">
        <span>🦅</span>
        <span>蓝鹰一体化智控系统 · 原型站点</span>
      </div>
      <h1>蓝鹰一体化智控系统</h1>
      <p class="subtitle">面向公安超管和值班人员的一体化智控舆情及事件处置系统原型，支持跨租户流转、源头防控与协同处置全景演示。</p>
    </header>

    ${primaryItem ? `
    <div class="hero-card">
      <div class="hero-header">
        <span class="hero-tag">🌟 核心主系统原型</span>
        <span style="font-size: 13px; color: #94a3b8;">路径: prototypes/${primaryItem.file}</span>
      </div>
      <div class="hero-title">${primaryItem.title}</div>
      <div class="hero-desc">${primaryItem.desc}</div>
      <div class="hero-actions">
        <a href="./prototypes/${primaryItem.file}" class="btn-primary">
          <span>立即体验主系统</span>
          <span>→</span>
        </a>
        <a href="./prototypes/${primaryItem.file}" target="_blank" class="btn-secondary">
          <span>新标签页全屏打开</span>
          <span>↗</span>
        </a>
      </div>
    </div>
    ` : ''}

    <div class="section-header">
      <div class="section-title">
        <span>📂</span>
        <span>全部原型与模块列表 (${items.length})</span>
      </div>
      <input type="text" id="searchInput" class="search-input" placeholder="按原型名称筛选..." oninput="filterCards()">
    </div>

    <div class="grid" id="cardGrid">
      ${items.map((item) => `
      <div class="card" data-title="${item.title.toLowerCase()}" data-name="${item.rawName.toLowerCase()}">
        <div class="card-top">
          <div class="card-meta">
            <span class="card-badge">${item.badge}</span>
            <span style="font-size: 12px; color: #64748b;">prototypes/${item.file}</span>
          </div>
          <div class="card-title">${item.title}</div>
          <div class="card-desc">${item.desc}</div>
        </div>
        <div class="card-actions">
          <a href="./prototypes/${item.file}" class="card-btn card-btn-open">打开原型</a>
          <a href="./prototypes/${item.file}" target="_blank" class="card-btn card-btn-blank" title="在新标签页中打开">↗</a>
        </div>
      </div>
      `).join('\n')}
    </div>

    <footer>
      蓝鹰一体化系统 · GitHub Pages 自动化发布流水线构建
    </footer>
  </div>

  <script>
    function filterCards() {
      const query = document.getElementById('searchInput').value.trim().toLowerCase();
      const cards = document.querySelectorAll('#cardGrid .card');
      cards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        const name = card.getAttribute('data-name') || '';
        if (title.includes(query) || name.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
`;

  const distIndexPath = path.join(distDir, 'index.html');
  fs.writeFileSync(distIndexPath, html, 'utf8');
  console.log(`✓ 已生成整站导航门户: ${distIndexPath} (聚合 ${items.length} 个原型)`);
}

generateDistPortal();
