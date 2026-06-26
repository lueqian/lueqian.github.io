import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Clock, 
  Cpu, 
  Leaf, 
  Compass, 
  Settings, 
  Info, 
  CornerDownRight, 
  ArrowUpRight 
} from 'lucide-react';

// 数据定义
const mockArticle = {
  title: '自主上报舆情及系统反应延迟',
  content: '今日上午10时起，下属支队陆续上报关于系统核心业务页面加载缓慢的问题，部分地区出现请求超时（HTTP 504）。经初步排查，为数据库连接池满载所致，已紧急优化连接池配置，目前系统响应速度已恢复正常。下一步将持续监控流量并进行读写分离改造。',
  department: '总队',
  user: '总队账号',
  time: '2026-06-11 15:44:41'
};

// 1. Before Component (修改前 - 生硬且简陋)
export const ArticleCardBefore: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="w-full max-w-xl text-left font-sans">
        <div className="text-xs text-slate-500 mb-4 pb-2 border-b border-slate-100 dark:border-slate-850 flex gap-4">
          <span className="font-bold border-b-2 border-blue-600 pb-2">待编报</span>
          <span className="pb-2">待入刊</span>
          <span className="pb-2">全部</span>
        </div>

        {/* 原始生硬卡片 1 */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-base font-bold text-black dark:text-white mb-2">{mockArticle.title}</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交单位：{mockArticle.department}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交用户：{mockArticle.user}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交时间：{mockArticle.time}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{mockArticle.content}</p>
        </div>

        {/* 原始生硬卡片 2 */}
        <div className="py-4 border-b border-slate-200 dark:border-slate-800 opacity-60">
          <h4 className="text-base font-bold text-black dark:text-white mb-2">自主上报报送</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交单位：总队
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交用户：总队账号
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-350">
              提交时间：2026-06-11 15:20:49
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">自主上报报送内容15点20分</p>
        </div>
      </div>
    </div>
  );
};

// 2. After Component (优化后 - 并排展示三种风格)
export const ArticleCardAfter: React.FC = () => {
  return (
    <div className="w-full space-y-8 p-2">
      {/* 风格一：清新自然风 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Style A : 清新雅致风格</span>
        </div>
        <div className="w-full max-w-xl bg-gradient-to-br from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/10 border border-slate-200/60 dark:border-emerald-900/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none transition-transform group-hover:scale-120"></div>
          <div className="flex justify-between items-start gap-4 mb-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {mockArticle.title}
            </h4>
            <span className="flex-none px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              待编报
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-5">
            {mockArticle.content}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-500/70" />
              单位：<strong className="text-slate-600 dark:text-slate-350">{mockArticle.department}</strong>
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-500/70" />
              报送人：<strong className="text-slate-600 dark:text-slate-350">{mockArticle.user}</strong>
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {mockArticle.time}
            </span>
          </div>
        </div>
      </div>

      {/* 风格二：科技感数字风 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Cpu className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Style B : 科技风深邃风格</span>
        </div>
        <div className="w-full max-w-xl bg-slate-900/90 dark:bg-slate-900 border border-sky-500/20 dark:border-sky-500/10 p-6 rounded-xl shadow-lg relative overflow-hidden group">
          {/* 科技感网格背景装饰 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
          {/* 左侧蓝色科技呼吸条 */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 via-indigo-500 to-transparent"></div>
          
          <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
            <h4 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors tracking-wide pl-2">
              {mockArticle.title}
            </h4>
            <span className="flex-none px-2 py-0.5 rounded-sm bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[9px] uppercase tracking-widest font-bold">
              SYS::PENDING
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-5 relative z-10 pl-2 font-mono">
            {mockArticle.content}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3.5 border-t border-slate-800 text-[10px] text-slate-500 font-mono pl-2 relative z-10">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-500" />
              DEP:: {mockArticle.department}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-sky-500" />
              UID:: {mockArticle.user}
            </span>
            <span className="flex items-center gap-1 ml-auto text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              {mockArticle.time}
            </span>
          </div>
        </div>
      </div>

      {/* 风格三：极简画廊卡片 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 px-1">
          <Compass className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Style C : 极简人文卡片</span>
        </div>
        <div className="w-full max-w-xl bg-white dark:bg-slate-950 border-b-2 border-slate-900 dark:border-white p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-baseline gap-4 mb-4">
            <h4 className="text-base font-medium text-slate-900 dark:text-white group-hover:underline underline-offset-4 decoration-1 decoration-slate-400">
              {mockArticle.title}
            </h4>
            <span className="flex-none text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              / PENDING
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-6 font-serif">
            {mockArticle.content}
          </p>

          <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-900 text-[11px] text-slate-400 dark:text-slate-500">
            <div className="flex gap-3">
              <span>{mockArticle.department}</span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span>{mockArticle.user}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px]">
              {mockArticle.time}
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Playground Component (可交互微调面板)
export const ArticleCardPlayground: React.FC = () => {
  const [styleType, setStyleType] = useState<'fresh' | 'tech' | 'minimal'>('fresh');
  const [radius, setRadius] = useState<number>(16);
  const [padding, setPadding] = useState<number>(24);
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [shadowDepth, setShadowDepth] = useState<'none' | 'sm' | 'md' | 'lg'>('md');

  // 获取阴影类名
  const getShadowClass = () => {
    switch (shadowDepth) {
      case 'none': return 'shadow-none';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-xl';
    }
  };

  return (
    <div className="w-full grid lg:grid-cols-12 gap-6 min-h-[580px]">
      {/* 调整控制面板 */}
      <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Settings className="w-4 h-4 text-sky-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">卡片定制工作台</h4>
          </div>

          {/* 风格选择 */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">选择卡片视觉基调</span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {
                  setStyleType('fresh');
                  setRadius(16);
                  setShadowDepth('md');
                }}
                className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  styleType === 'fresh' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                清新风
              </button>
              <button 
                onClick={() => {
                  setStyleType('tech');
                  setRadius(8);
                  setShadowDepth('lg');
                }}
                className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  styleType === 'tech' 
                    ? 'bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                科技风
              </button>
              <button 
                onClick={() => {
                  setStyleType('minimal');
                  setRadius(0);
                  setShadowDepth('none');
                }}
                className={`py-2 px-1 text-xs font-bold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  styleType === 'minimal' 
                    ? 'bg-slate-900/10 dark:bg-white/10 border-slate-900 dark:border-white text-slate-900 dark:text-white' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                极简风
              </button>
            </div>
          </div>

          {/* 圆角半径 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">圆角半径 (Border Radius)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{radius}px</span>
            </div>
            <input 
              type="range" min="0" max="28" value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 内边距 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">内边距 (Padding)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{padding}px</span>
            </div>
            <input 
              type="range" min="12" max="32" value={padding} 
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 投影深浅 */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">投影深度 (Shadow)</span>
            <div className="grid grid-cols-4 gap-1.5">
              {['none', 'sm', 'md', 'lg'].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setShadowDepth(depth as any)}
                  className={`py-1 text-xs rounded-lg border font-mono uppercase text-[10px] ${
                    shadowDepth === depth 
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold' 
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {depth}
                </button>
              ))}
            </div>
          </div>

          {/* 图标显示开关 */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <span>展示元数据前缀图标 (Metadata Icons)</span>
              <input 
                type="checkbox" checked={showIcons} 
                onChange={(e) => setShowIcons(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex gap-2">
          <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span><b>排版建议</b>：在元数据较多时，不要让标签背景过于抢戏（如原版深灰色长条标签），可改用文字颜色层次配合小微标或小图标来建立轻量的视觉秩序。</span>
        </div>
      </div>

      {/* 实时预览 */}
      <div className="lg:col-span-8 flex items-center justify-center p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 relative">
        
        {/* 清新风渲染 */}
        {styleType === 'fresh' && (
          <div 
            className={`w-full max-w-lg bg-gradient-to-br from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/10 border border-slate-250/60 dark:border-emerald-900/30 transition-all duration-200 relative overflow-hidden group ${getShadowClass()}`}
            style={{
              borderRadius: `${radius}px`,
              padding: `${padding}px`
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <h4 className="text-base font-bold text-slate-850 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {mockArticle.title}
              </h4>
              <span className="flex-none px-2.5 py-0.5 rounded-full bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold">
                待编报
              </span>
            </div>

            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-5">
              {mockArticle.content}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                {showIcons && <Building2 className="w-3.5 h-3.5 text-emerald-500/70" />}
                单位：<strong className="text-slate-650 dark:text-slate-350">{mockArticle.department}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                {showIcons && <User className="w-3.5 h-3.5 text-emerald-500/70" />}
                报送人：<strong className="text-slate-650 dark:text-slate-350">{mockArticle.user}</strong>
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                {showIcons && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                {mockArticle.time}
              </span>
            </div>
          </div>
        )}

        {/* 科技风渲染 */}
        {styleType === 'tech' && (
          <div 
            className={`w-full max-w-lg bg-slate-900/95 dark:bg-slate-900 border border-sky-500/20 dark:border-sky-500/10 transition-all duration-200 relative overflow-hidden group ${getShadowClass()}`}
            style={{
              borderRadius: `${radius}px`,
              padding: `${padding}px`
            }}
          >
            {/* 网格网片 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e906_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e906_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none"></div>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-500 to-indigo-500"></div>

            <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
              <h4 className="text-base font-bold text-slate-100 group-hover:text-sky-400 transition-colors tracking-wide pl-2">
                {mockArticle.title}
              </h4>
              <span className="flex-none px-2 py-0.5 rounded-sm bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[9px] uppercase tracking-widest font-bold">
                SYS::PENDING
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-5 relative z-10 pl-2 font-mono">
              {mockArticle.content}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3.5 border-t border-slate-800 text-[10px] text-slate-500 font-mono pl-2 relative z-10">
              <span className="flex items-center gap-1.5">
                {showIcons && <Building2 className="w-3.5 h-3.5 text-sky-500" />}
                DEP:: {mockArticle.department}
              </span>
              <span className="flex items-center gap-1.5">
                {showIcons && <User className="w-3.5 h-3.5 text-sky-500" />}
                UID:: {mockArticle.user}
              </span>
              <span className="flex items-center gap-1.5 ml-auto text-slate-650">
                {showIcons && <Clock className="w-3.5 h-3.5" />}
                {mockArticle.time}
              </span>
            </div>
          </div>
        )}

        {/* 极简风渲染 */}
        {styleType === 'minimal' && (
          <div 
            className={`w-full max-w-lg bg-white dark:bg-slate-950 border-b-2 border-slate-900 dark:border-white transition-all duration-200 group ${getShadowClass()}`}
            style={{
              borderRadius: `${radius}px`,
              padding: `${padding}px`
            }}
          >
            <div className="flex justify-between items-baseline gap-4 mb-4">
              <h4 className="text-base font-medium text-slate-900 dark:text-white group-hover:underline underline-offset-4 decoration-1 decoration-slate-400">
                {mockArticle.title}
              </h4>
              <span className="flex-none text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                / PENDING
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-6 font-serif">
              {mockArticle.content}
            </p>

            <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-900 text-[11px] text-slate-400 dark:text-slate-500">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  {showIcons && <Building2 className="w-3 h-3 text-slate-400" />}
                  {mockArticle.department}
                </span>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <span className="flex items-center gap-1">
                  {showIcons && <User className="w-3 h-3 text-slate-400" />}
                  {mockArticle.user}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                {showIcons && <Clock className="w-3.5 h-3.5" />}
                {mockArticle.time}
                <CornerDownRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
