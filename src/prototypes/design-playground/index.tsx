/**
 * @name 设计演示沙盒
 *
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Layers, 
  Sliders, 
  BookOpen, 
  Code2, 
  Sun, 
  Moon, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Check, 
  FolderKanban, 
  Menu,
  X
} from 'lucide-react';
import './style.css';

import { PlaygroundPage } from './types';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { HomeIntro } from './pages/HomeIntro';
import { ShadowCardBefore, ShadowCardAfter, ShadowCardPlayground } from './pages/ShadowCard';
import { FormSpacingBefore, FormSpacingAfter, FormSpacingPlayground } from './pages/FormSpacing';
import { ArticleCardBefore, ArticleCardAfter, ArticleCardPlayground } from './pages/ArticleCard';

export default function DesignPlayground() {
  const [currentId, setCurrentId] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<'preview' | 'compare' | 'spec' | 'code'>('preview');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [copiedBefore, setCopiedBefore] = useState<boolean>(false);
  const [copiedAfter, setCopiedAfter] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // 1. 定义内置设计子页面
  const pages: PlaygroundPage[] = [
    {
      id: 'shadow-card',
      name: '卡片多重软阴影微调',
      category: '样式与质感',
      description: `### 需求背景与痛点
客户反馈原系统卡片界面“呆板生硬”、“廉价感重”。
经分析，主要是因为之前的卡片使用了**单层重黑色投影** (\`rgba(0,0,0,0.4)\`)，且缺乏卡片边框高光细节，在深色背景下层级难以区分。

### 重构设计方案
1. **多重软投影**：拆分为三层投影，第一层小模糊度负责贴近阴影，第二层中等模糊度负责主形体，第三层大模糊度负责弥散，共同渲染出真实的空气呼吸感。
2. **毛玻璃材质**：背景使用 \`rgba(255,255,255,0.7)\` 并结合 \`backdrop-blur-xl\`，能隐约透出底色。
3. **微细高光白边**：卡片上边缘使用 \`1px solid rgba(255,255,255,0.4)\`，营造立体雕刻感。`,
      beforeCode: `/* 优化前：单层生硬粗暴投影 */
.card-before {
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
}`,
      afterCode: `/* 优化后：三层软阴影 + 玻璃拟态 + 微白边 */
.card-after {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  box-shadow: 
    0 4px 6px -2px rgba(0, 0, 0, 0.03), 
    0 12px 30px -4px rgba(0, 0, 0, 0.08), 
    0 20px 40px -8px rgba(0, 0, 0, 0.04);
}`,
      BeforeComponent: ShadowCardBefore,
      AfterComponent: ShadowCardAfter,
      PlaygroundComponent: ShadowCardPlayground
    },
    {
      id: 'form-spacing',
      name: '表单呼吸感间距微调',
      category: '信息与布局',
      description: `### 需求背景与痛点
客服反馈“新建提取任务”的表单界面拥挤，容易漏看必填项，且在点击和出错时反馈极其模糊，导致输入焦虑。
经分析，之前设计为了追求高信息密度，导致**行间距仅 8px，输入框几乎贴合**，无对齐呼吸线。

### 重构设计方案
1. **合理增加间距**：将行间距提升至 16px - 24px，输入框内边距增加到 10px，增加整体界面的呼吸感。
2. **装饰前缀图标**：在输入框内侧添加小巧灰调 Icon，帮助大脑快速识别输入项性质。
3. **发光聚焦状态**：输入框被聚焦时，增加外发光阴影过渡 (\`box-shadow 0.2s\`)，明确输入主体。`,
      beforeCode: `<!-- 优化前：极低间距与无动效输入框 -->
<div class="mb-2">
  <label class="block text-xs mb-0.5">任务名称</label>
  <input class="w-full px-2 py-1 text-xs border border-slate-300 rounded-none focus:outline-none" />
</div>`,
      afterCode: `<!-- 优化后：行距 16px，大内距输入框，带 Prefix Icon 与 4px 外发光 -->
<div class="space-y-1.5">
  <label class="block text-xs font-semibold text-slate-700">任务名称</label>
  <div class="relative">
    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><AlignLeft class="w-4 h-4" /></span>
    <input class="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200" />
  </div>
</div>`,
      BeforeComponent: FormSpacingBefore,
      AfterComponent: FormSpacingAfter,
      PlaygroundComponent: FormSpacingPlayground
    },
    {
      id: 'article-card',
      name: '内容卡片多风格重构',
      category: '信息与布局',
      description: `### 需求背景与痛点
根据客户上传的截图，原内容卡片排版非常呆板且简陋。
特别是“提交单位”、“提交用户”与“提交时间”这三个重要元数据，使用了**深直角背景框、粗糙的加粗字**进行长条展示，割裂了标题与正文的视线过渡。页面整体只有生硬的一根灰色线条来区分卡片，毫无气感。

### 重构设计方案
为给客户最丰富、精致的改版参考，我们设计了以下三种迥异但均极具高级感的形式：
1. **清新雅致风格 (Style A)**：运用淡淡的翡翠绿微弱渐变、圆润卡片圆角和极淡的软阴影。将元数据重新精炼，使用小巧的翠绿底色图标横向排版，极显呼吸感。
2. **科技风深邃风格 (Style B)**：专为数据可视化或后台控制台设计。采用深邃的 Slate 900 玻璃拟态面板，配以细密的浅蓝网格线和发光左侧呼吸条。元数据全部使用等宽 Monospace 英文字体，充满数字科技色彩。
3. **极简画廊风格 (Style C)**：极具包豪斯和杂志人文美学。完全去除多余的边框和填充，依靠精致的字号、字体线高及粗黑分割线形成强烈的对比，突出内容本体。`,
      beforeCode: `<!-- 优化前：单调长条灰色底框标签，排版混乱 -->
<div class="py-4 border-b">
  <h4>自主上报舆情及系统反应延迟</h4>
  <div class="flex gap-2 mb-3">
    <span class="bg-slate-100 border px-2 py-0.5 text-xs">提交单位：总队</span>
    <span class="bg-slate-100 border px-2 py-0.5 text-xs">提交用户：总队账号</span>
    <span class="bg-slate-100 border px-2 py-0.5 text-xs">提交时间：2026-06-11 15:44:41</span>
  </div>
  <p>今日上午10时起，下属支队陆续上报关于系统核心业务页面加载缓慢的问题...</p>
</div>`,
      afterCode: `<!-- 优化后：清新风 (Style A) 翠绿淡雅多层阴影排版 -->
<div class="bg-gradient-to-br from-white to-emerald-50 border border-slate-200/60 p-6 rounded-2xl shadow-sm">
  <div class="flex justify-between items-start">
    <h4 class="font-bold text-slate-800">自主上报舆情及系统反应延迟</h4>
    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px]">待编报</span>
  </div>
  <p class="text-xs text-slate-500 leading-relaxed mt-2 mb-5">今日上午10时起...</p>
  <div class="flex gap-4 pt-3.5 border-t text-[11px] text-slate-400">
    <span class="flex items-center gap-1"><Building2 class="text-emerald-500/70" />单位：<strong>总队</strong></span>
    <span class="flex items-center gap-1"><User class="text-emerald-500/70" />报送人：<strong>总队账号</strong></span>
    <span class="flex items-center gap-1 ml-auto"><Clock />2026-06-11 15:44:41</span>
  </div>
</div>`,
      BeforeComponent: ArticleCardBefore,
      AfterComponent: ArticleCardAfter,
      PlaygroundComponent: ArticleCardPlayground
    }
  ];

  const currentPage = pages.find(p => p.id === currentId);

  // 2. 复制控制
  const handleCopy = (text: string, isBefore: boolean) => {
    navigator.clipboard.writeText(text);
    if (isBefore) {
      setCopiedBefore(true);
      setTimeout(() => setCopiedBefore(false), 2000);
    } else {
      setCopiedAfter(true);
      setTimeout(() => setCopiedAfter(false), 2000);
    }
  };

  // 3. 渲染页面内容
  const renderCanvasContent = () => {
    if (currentId === 'home' || !currentPage) {
      return <HomeIntro />;
    }

    switch (activeTab) {
      case 'preview':
        const Playground = currentPage.PlaygroundComponent;
        return <Playground />;
      case 'compare':
        return <BeforeAfterSlider Before={currentPage.BeforeComponent} After={currentPage.AfterComponent} />;
      case 'spec':
        return (
          <div className="p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm max-w-3xl mx-auto prose dark:prose-invert">
            {currentPage.description.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">{paragraph.replace('### ', '')}</h3>;
              }
              if (paragraph.startsWith('#### ')) {
                return <h4 key={index} className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">{paragraph.replace('#### ', '')}</h4>;
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                return (
                  <ol key={index} className="list-decimal pl-5 space-y-1.5 text-sm text-slate-600 dark:text-slate-350">
                    {paragraph.split('\n').map((li, i) => (
                      <li key={i}>{li.replace(/^\d+\.\s+/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={index} className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mb-4">
                  {paragraph.split('`').map((part, i) => i % 2 === 1 ? <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs text-rose-500 dark:text-rose-400">{part}</code> : part)}
                </p>
              );
            })}
          </div>
        );
      case 'code':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before Code */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col h-[450px]">
              <div className="flex justify-between items-center px-4 py-3 bg-slate-100/50 dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-850">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Before (重构前核心代码)</span>
                <button 
                  onClick={() => handleCopy(currentPage.beforeCode || '', true)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {copiedBefore ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-auto flex-1 custom-scrollbar">
                <code>{currentPage.beforeCode}</code>
              </pre>
            </div>

            {/* After Code */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-850 overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col h-[450px]">
              <div className="flex justify-between items-center px-4 py-3 bg-sky-500/10 dark:bg-sky-500/5 border-b border-slate-200/80 dark:border-slate-850">
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  After (优化后推荐代码)
                </span>
                <button 
                  onClick={() => handleCopy(currentPage.afterCode || '', false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {copiedAfter ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-auto flex-1 custom-scrollbar">
                <code>{currentPage.afterCode}</code>
              </pre>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 4. 分组处理菜单
  const categories = Array.from(new Set(pages.map(p => p.category)));

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200 font-sans">
        
        {/* Sidebar - Left */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-850 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shrink-0 z-30">
          <div className="p-6 border-b border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <FolderKanban className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                Design Sandbox
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
            {/* 首页入口 */}
            <button
              onClick={() => {
                setCurrentId('home');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentId === 'home'
                  ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400'
                  : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              <Home className="w-4 h-4" />
              工作台首页
            </button>

            {/* 各分类项 */}
            {categories.map(cat => (
              <div key={cat} className="space-y-1.5">
                <span className="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {cat}
                </span>
                <div className="space-y-1">
                  {pages
                    .filter(p => p.category === cat)
                    .map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentId(p.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          currentId === p.id
                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-bold'
                            : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span>{p.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${currentId === p.id ? 'translate-x-0.5' : ''} transition-transform`} />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">v1.0.0</span>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Mobile Menu & Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 md:hidden flex justify-start">
            <aside className="w-64 bg-white dark:bg-slate-900 h-full border-r border-slate-200 dark:border-slate-850 flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-slate-850 flex justify-between items-center">
                <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  Design Sandbox
                </span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => {
                    setCurrentId('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentId === 'home'
                      ? 'bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400'
                      : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  工作台首页
                </button>
                {categories.map(cat => (
                  <div key={cat} className="space-y-1.5">
                    <span className="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {cat}
                    </span>
                    <div className="space-y-1">
                      {pages
                        .filter(p => p.category === cat)
                        .map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setCurrentId(p.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                              currentId === p.id
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-bold'
                                : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            <span>{p.name}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-200 dark:border-slate-850 flex justify-between">
                <button 
                  onClick={() => {
                    setIsDark(!isDark);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-slate-150 dark:hover:bg-slate-850 text-slate-500 flex items-center gap-2 text-xs"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? '浅色模式' : '深色模式'}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Area - Right */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-slate-200/80 dark:border-slate-850 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-slate-400 dark:text-slate-600 text-xs font-medium">参考展示</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {currentId === 'home' ? '欢迎首页' : currentPage?.name}
                </span>
              </div>
            </div>

            {/* Top Toolbar */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-850 text-[10px] text-slate-500 dark:text-slate-400 font-semibold border border-slate-200/50 dark:border-slate-800/50">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                客户端连接就绪
              </span>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </header>

          {/* Sub Header for Page Tabs */}
          {currentId !== 'home' && currentPage && (
            <div className="h-12 border-b border-slate-200/80 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 px-6 flex items-center justify-between shrink-0">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'preview'
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  效果预览
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'compare'
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Before/After 对比
                </button>
                <button
                  onClick={() => setActiveTab('spec')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'spec'
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  设计说明
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'code'
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  代码片段
                </button>
              </div>
            </div>
          )}

          {/* Canvas Main Area */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
            {renderCanvasContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
