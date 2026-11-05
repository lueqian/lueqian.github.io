# 变更日志 (CHANGELOG)

本文档记录 Axhub 原型系统及各业务模块的重要迭代与安全脱敏变更。

---

## [2026-11-05] - 专项处置原型规范化与标识脱敏

### 1. 业务与展示重命名
- **系统定名统一**：专项处置相关原型前端展示、卡片描述及入口文档统一更名为 **「广州TG群组管控系统」**。
- **注释与描述脱敏**：清理了原型组件及页面顶部描述中的特定历史定制单位标识，统一调整为通用规范的业务描述。

### 2. 目录结构与路由路径重构
- **目录重命名**：将 `src/prototypes/eagle_datastory_TGManagementForGuangZhouGuoAn` 重构重命名为 `src/prototypes/eagle_datastory_TGManagementForGuangZhou`。
- **入口元信息刷新**：更新 `scripts/generate-dist-html.js` 原型字典，重新扫描并同步 `.axhub/make/entries.json` 与 `.axhub/make/sidebar-tree.json`。
- **全站导航适配**：全量重新生成整站门户 `dist/index.html`，卡片链接同步映射至 `./prototypes/eagle_datastory_TGManagementForGuangZhou.html`，确保内外部跳转链路畅通无阻。

### 3. 公共文档与发布同步
- 同步更新根目录 `README.md` 平台原型总览清单中的对外跳转链接与标题。
- 确保部署至 GitHub Pages 的线上版本与本地工程代码 100% 保持一致。

---

## [2026-11-05] - GitHub Pages 自动化发布流水线建设

### 新增功能
- 新增 GitHub Actions 全站自动构建与静态发布工作流（`.github/workflows/deploy.yml`）。
- 新增整站原型静态导航门户自动生成机制，以「蓝鹰一体化系统」为主系统置顶展示，聚合全站所有原型模块。
- 静态构建流程补齐全量运行时依赖，确保纯静态托管环境下无 404 及白屏问题。
