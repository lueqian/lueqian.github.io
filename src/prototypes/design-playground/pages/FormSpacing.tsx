import React, { useState } from 'react';
import { Mail, User, AlignLeft, Send, Sparkles, Ban, HelpCircle } from 'lucide-react';

// 1. Before Component (修改前 - 拥挤混乱)
export const FormSpacingBefore: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-[#f8fafc] dark:bg-slate-950">
      <div className="w-[420px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-sm">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
          新建提取任务 (高密度混乱版)
        </div>
        
        {/* 表单项：任务名称 */}
        <div className="mb-2">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">任务名称*</label>
          <input 
            type="text" 
            defaultValue="售后诉求分析-6月第4周"
            className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none focus:outline-none"
          />
        </div>

        {/* 表单项：负责人与账号 */}
        <div className="flex gap-2 mb-2">
          <div className="w-1/2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">负责人</label>
            <input 
              type="text" 
              defaultValue="李经理"
              className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none focus:outline-none"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">联系邮箱*</label>
            <input 
              type="text" 
              defaultValue="li.q@company.com"
              className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none focus:outline-none"
            />
          </div>
        </div>

        {/* 表单项：诉求分类 */}
        <div className="mb-2">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">关联数据表</label>
          <select 
            className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none focus:outline-none"
            defaultValue="db_1"
          >
            <option value="db_1">6月第二批工单明细_2026.csv</option>
            <option value="db_2">7月用户退款申请.xlsx</option>
          </select>
        </div>

        {/* 表单项：任务描述 */}
        <div className="mb-3">
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">备注说明</label>
          <textarea 
            rows={2}
            defaultValue="用于分析售后退款痛点以改善功能设计。"
            className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none focus:outline-none resize-none"
          />
        </div>

        {/* 按钮 */}
        <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-none">
            取消
          </button>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-none">
            创建提取任务
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. After Component (优化后 - 呼吸感高品质)
export const FormSpacingAfter: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-[440px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-2xl shadow-xl space-y-6">
        <div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500 fill-sky-500/20" />
            新建提取任务
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">请填写分析任务配置，AI 引擎将自动读取并分类</p>
        </div>
        
        <div className="space-y-4">
          {/* 表单项：任务名称 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              任务名称 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <AlignLeft className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                defaultValue="售后诉求分析-6月第4周"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* 表单项：负责人与账号 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">负责人</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  defaultValue="李经理"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                联系邮箱 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  defaultValue="li.q@company.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* 表单项：诉求分类 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">关联数据表</label>
            <select 
              defaultValue="db_1"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="db_1">6月第二批工单明细_2026.csv</option>
              <option value="db_2">7月用户退款申请.xlsx</option>
            </select>
          </div>

          {/* 表单项：备注说明 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">备注说明</label>
            <textarea 
              rows={3}
              defaultValue="用于分析售后退款痛点以改善功能设计。"
              className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all duration-200 resize-none"
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="flex justify-end gap-3 pt-2">
          <button className="px-5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-colors">
            取消
          </button>
          <button className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all duration-200">
            创建提取任务
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Playground Component (可交互微调)
export const FormSpacingPlayground: React.FC = () => {
  const [spacing, setSpacing] = useState<number>(16); // 8px to 32px
  const [padding, setPadding] = useState<number>(10); // 4px to 20px
  const [radius, setRadius] = useState<number>(12); // 0px to 24px
  const [hasIcon, setHasIcon] = useState<boolean>(true);
  const [focusEffect, setFocusEffect] = useState<boolean>(true);

  return (
    <div className="w-full grid lg:grid-cols-12 gap-6 min-h-[550px]">
      {/* 调整面板 */}
      <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">表单间距与呼吸感微调</h4>
          </div>

          {/* 表单项行距 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">表单行间距 (Row Spacing)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{spacing}px</span>
            </div>
            <input 
              type="range" min="8" max="32" value={spacing} 
              onChange={(e) => setSpacing(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 输入框内边距 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">输入框内边距 (Padding)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{padding}px</span>
            </div>
            <input 
              type="range" min="4" max="20" value={padding} 
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 圆角 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">控件圆角 (Border Radius)</span>
              <span className="text-sky-600 dark:text-sky-400 font-mono">{radius}px</span>
            </div>
            <input 
              type="range" min="0" max="24" value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* 开关 */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <span>使用装饰前缀图标 (Prefix Icon)</span>
              <input 
                type="checkbox" checked={hasIcon} 
                onChange={(e) => setHasIcon(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <span>启用聚焦发光动效 (Focus Glow)</span>
              <input 
                type="checkbox" checked={focusEffect} 
                onChange={(e) => setFocusEffect(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <b>设计点拨</b>：优秀的表单设计要有适当的呼吸感。适度加大表单行间距和输入框内边距可以减轻用户的输入压力。加上圆角和柔和的聚焦过渡，能带来极大体验提升。
        </div>
      </div>

      {/* 实时预览 */}
      <div className="lg:col-span-8 flex items-center justify-center p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 min-h-[450px]">
        <div className="w-[440px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl transition-all duration-200" style={{ borderRadius: `${radius}px` }}>
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">新建提取任务</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">请填写分析任务配置，AI 引擎将自动读取并分类</p>
          </div>
          
          <div className="transition-all duration-200" style={{ display: 'flex', flexDirection: 'column', gap: `${spacing}px`, marginTop: `${spacing}px` }}>
            {/* 任务名称 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                任务名称 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                {hasIcon && (
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                    <AlignLeft className="w-4 h-4" />
                  </span>
                )}
                <input 
                  type="text" 
                  defaultValue="售后诉求分析-6月第4周"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none transition-all duration-200"
                  style={{
                    paddingTop: `${padding}px`,
                    paddingBottom: `${padding}px`,
                    paddingLeft: hasIcon ? '40px' : `${padding * 1.5}px`,
                    paddingRight: `${padding * 1.5}px`,
                    borderRadius: `${radius}px`,
                    boxShadow: focusEffect ? undefined : 'none'
                  }}
                  onFocus={(e) => {
                    if (focusEffect) {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '';
                    e.target.style.boxShadow = '';
                  }}
                />
              </div>
            </div>

            {/* 负责人与邮箱 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">负责人</label>
                <div className="relative">
                  {hasIcon && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                  )}
                  <input 
                    type="text" 
                    defaultValue="李经理"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none transition-all duration-200"
                    style={{
                      paddingTop: `${padding}px`,
                      paddingBottom: `${padding}px`,
                      paddingLeft: hasIcon ? '40px' : `${padding * 1.5}px`,
                      paddingRight: `${padding * 1.5}px`,
                      borderRadius: `${radius}px`
                    }}
                    onFocus={(e) => {
                      if (focusEffect) {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  联系邮箱 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  {hasIcon && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                  )}
                  <input 
                    type="text" 
                    defaultValue="li.q@company.com"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none transition-all duration-200"
                    style={{
                      paddingTop: `${padding}px`,
                      paddingBottom: `${padding}px`,
                      paddingLeft: hasIcon ? '40px' : `${padding * 1.5}px`,
                      paddingRight: `${padding * 1.5}px`,
                      borderRadius: `${radius}px`
                    }}
                    onFocus={(e) => {
                      if (focusEffect) {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '';
                      e.target.style.boxShadow = '';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 关联表 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">关联数据表</label>
              <select 
                defaultValue="db_1"
                className="w-full text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none transition-all duration-200 cursor-pointer"
                style={{
                  paddingTop: `${padding}px`,
                  paddingBottom: `${padding}px`,
                  paddingLeft: `${padding * 1.5}px`,
                  paddingRight: `${padding * 2.5}px`,
                  borderRadius: `${radius}px`
                }}
                onFocus={(e) => {
                  if (focusEffect) {
                    e.target.style.borderColor = '#0ea5e9';
                    e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
              >
                <option value="db_1">6月第二批工单明细_2026.csv</option>
                <option value="db_2">7月用户退款申请.xlsx</option>
              </select>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex justify-end gap-3 transition-all duration-200" style={{ marginTop: `${spacing * 1.2}px`, paddingTop: `${spacing * 0.8}px` }}>
            <button 
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors"
              style={{
                paddingTop: `${padding}px`,
                paddingBottom: `${padding}px`,
                paddingLeft: `${padding * 2}px`,
                paddingRight: `${padding * 2}px`,
                borderRadius: `${radius}px`
              }}
            >
              取消
            </button>
            <button 
              className="text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all duration-200"
              style={{
                paddingTop: `${padding}px`,
                paddingBottom: `${padding}px`,
                paddingLeft: `${padding * 2}px`,
                paddingRight: `${padding * 2}px`,
                borderRadius: `${radius}px`
              }}
            >
              创建提取任务
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
