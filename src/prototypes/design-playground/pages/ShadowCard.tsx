import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Settings, Info } from 'lucide-react';

// 卡片内部公共内容
const CardContent: React.FC = () => (
  <div className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
        AI 引擎已启用
      </div>
      <span className="text-[10px] text-slate-400 font-mono">v2.4.1</span>
    </div>
    
    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
      售后诉求一键智能提取
    </h4>
    
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
      自动解析售后工单与对话，智能提取用户核心痛点并进行标签化分类，支持多触点舆情联动分析，准确率高达 95.8%。
    </p>
    
    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div>
        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">解析耗时</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">1.2s</span>
      </div>
      <div>
        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">准确率</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">95.8%</span>
      </div>
      <div>
        <span className="block text-[10px] text-slate-400 uppercase tracking-wider">覆盖率</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">99.4%</span>
      </div>
    </div>
    
    <button className="w-full mt-6 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
      进入提取面板
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
);

// 1. Before Component (修改前)
// 特点：普通生硬的重黑色阴影，无圆角微调，无边框高光
export const ShadowCardBefore: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-[#f1f5f9] dark:bg-[#0f172a]">
      <div 
        className="w-[360px] bg-white dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 shadow-xl"
        style={{
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.4)'
        }}
      >
        <CardContent />
      </div>
    </div>
  );
};

// 2. After Component (优化后)
// 特点：多层软投影，毛玻璃质感，精致微白边
export const ShadowCardAfter: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div 
        className="w-[360px] bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/5 shadow-2xl"
        style={{
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 20px 40px -8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <CardContent />
      </div>
    </div>
  );
};

// 3. Playground Component (可交互微调)
export const ShadowCardPlayground: React.FC = () => {
  const [blur, setBlur] = useState<number>(30);
  const [opacity, setOpacity] = useState<number>(8);
  const [radius, setRadius] = useState<number>(16);
  const [useGlass, setUseGlass] = useState<boolean>(true);
  const [showBorder, setShowBorder] = useState<boolean>(true);

  // 动态生成多层软阴影
  const getShadowStyle = () => {
    const op = opacity / 100;
    return `0 4px ${Math.round(blur * 0.3)}px -2px rgba(0,0,0,${(op * 0.6).toFixed(3)}), 
            0 12px ${blur}px -4px rgba(0,0,0,${op.toFixed(3)}), 
            0 20px ${Math.round(blur * 1.3)}px -8px rgba(0,0,0,${(op * 0.5).toFixed(3)})`;
  };

  return (
    <div className="w-full grid lg:grid-cols-12 gap-6 min-h-[500px]">
      {/* 调整面板 */}
      <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-4 h-4 text-sky-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">卡片样式微调参数</h4>
          </div>

          {/* 模糊度 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">阴影模糊度 (Blur)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{blur}px</span>
            </div>
            <input 
              type="range" min="5" max="80" value={blur} 
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 透明度 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">阴影不透明度 (Opacity)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{opacity}%</span>
            </div>
            <input 
              type="range" min="2" max="30" value={opacity} 
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 圆角 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">圆角半径 (Border Radius)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{radius}px</span>
            </div>
            <input 
              type="range" min="0" max="32" value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 开关选项 */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <span>启用毛玻璃材质 (Backdrop Blur)</span>
              <input 
                type="checkbox" checked={useGlass} 
                onChange={(e) => setUseGlass(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <span>微细高光白边 (Light Border)</span>
              <input 
                type="checkbox" checked={showBorder} 
                onChange={(e) => setShowBorder(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex gap-2">
          <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span><b>设计点拨</b>：硬投影会给用户廉价生硬感；使用多重软阴影叠合可以营造层级跃迁感；微细白边在深浅背景中都能提供极佳的分界线。</span>
        </div>
      </div>

      {/* 实时预览区 */}
      <div className="lg:col-span-8 flex items-center justify-center p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 relative min-h-[400px]">
        {/* 背景格线装饰，凸显阴影和半透明效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none rounded-2xl"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div 
          className="w-[360px] relative z-10 transition-all duration-200"
          style={{
            borderRadius: `${radius}px`,
            backgroundColor: useGlass ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
            backdropFilter: useGlass ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: useGlass ? 'blur(16px)' : 'none',
            border: showBorder 
              ? (useGlass ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(226, 232, 240, 0.8)') 
              : 'none',
            boxShadow: getShadowStyle()
          }}
        >
          {/* 在深色模式下，需要适配卡片内背景颜色 */}
          <div className="dark:hidden">
            <CardContent />
          </div>
          <div 
            className="hidden dark:block transition-all duration-200"
            style={{
              borderRadius: `${radius}px`,
              backgroundColor: useGlass ? 'rgba(15, 23, 42, 0.75)' : '#0f172a',
              border: showBorder 
                ? (useGlass ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(51, 65, 85, 0.8)') 
                : 'none',
            }}
          >
            <CardContent />
          </div>
        </div>
      </div>
    </div>
  );
};
