import React from 'react';
import { Sparkles, Layers, Sliders, ArrowRight, Code2, Play } from 'lucide-react';
import { motion } from 'motion/react'; // 我们看看项目是用 motion 还是 framer-motion。package.json 里是 "motion": "^12.38.0"，可以从 'motion/react' 或 'motion' 引入。也可以直接不使用 motion, 或者为了保险使用基本的 CSS 动画，以防打包失败。
// 等等！Vite 可能会对 "motion" 这个库有一些导入限制。为了百分之百打包安全（check-app-ready 往往容易因为依赖导致报错），我们先查看一下其他原型是怎么导入动画的，或者干脆用 Vanilla CSS 动画。
// 我们先搜索其他原型里是否用了 motion，或者怎么用。

export const HomeIntro: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200/50 dark:border-sky-800/30 text-sky-600 dark:text-sky-400 text-xs font-semibold tracking-wider uppercase mb-2 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Axhub Make 视觉样板间
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-sky-900 to-indigo-900 dark:from-white dark:via-sky-200 dark:to-indigo-300 bg-clip-text text-transparent">
          微设计与样式对比沙盒
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          专门用于平时细微的功能设计和样式调整。无需在正式项目中繁琐修改，在此沙盒中直观比对并提供给客户确认。
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Before / After 对比</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            内置独家“滑动拉伸条”组件，支持在同一块画布上拖拽拉杆，像素级比对重构前后的设计细节。
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Sliders className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">动态参数面板</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            客户可直接在界面上微调阴影大小、圆角半径、间距留白，交互式感受不同参数带来的设计质感变化。
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">一键复制源码</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            每个微调案例均附带 Before 和 After 的核心代码片段，对比立等可见，方便开发人员直接同步。
          </p>
        </div>
      </div>

      {/* Guide Section */}
      <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-8 bg-slate-50/50 dark:bg-slate-950/30">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Play className="w-5 h-5 text-sky-500 fill-sky-500" />
          如何在此项目中快速新增一个设计案例？
        </h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
              1
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">编写子页面组件</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                在 <code>src/prototypes/design-playground/pages/</code> 下新建一个 React 组件（如 <code>MyCase.tsx</code>），并包含 <code>Before</code>、<code>After</code>、<code>Playground</code> 部分。
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
              2
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">在主入口中注册</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                打开 <code>src/prototypes/design-playground/index.tsx</code>，在 <code>pages</code> 数组中导入并配置新页面。
              </p>
              <div className="mt-3 bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                <pre>{`// 导入并注册
import { MyCase } from './pages/MyCase';

const pages = [
  ...
  {
    id: 'my-case',
    name: '新需求演示',
    category: '组件微调',
    description: '重构前后的样式对比...',
    BeforeComponent: MyCase.Before,
    AfterComponent: MyCase.After,
    PlaygroundComponent: MyCase.Playground,
  }
];`}</pre>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300">
              3
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">预览并提供给客户</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                运行项目后，客户即可从左侧菜单直接选中，自由拖拽拉杆并微调参数对比。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
