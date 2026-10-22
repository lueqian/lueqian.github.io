import React from 'react';
import { ScenarioId } from '../types';
import {
  FileUp,
  CheckCheck,
  AlertTriangle,
  Layers,
  BellRing,
  Code2,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ScenarioSwitcherProps {
  currentScenario: ScenarioId;
  onScenarioChange: (scenario: ScenarioId) => void;
  devNotesOpen: boolean;
  onToggleDevNotes: () => void;
  cleanMode: boolean;
  onToggleCleanMode: () => void;
  onResetDemo: () => void;
}

const SCENARIO_ITEMS: {
  id: ScenarioId;
  step: number;
  label: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'scenario_1',
    step: 1,
    label: '入口与文件上传',
    badge: '触发',
    desc: '点击【批量导入检索】唤出 Modal，支持 Excel/CSV 拖拽解析与通用域名拦截',
    icon: <FileUp className="w-3.5 h-3.5" />,
  },
  {
    id: 'scenario_2',
    step: 2,
    label: '理想链路 (1:1)',
    badge: '精准匹配',
    desc: '28个账号唯一命中，一键全选，挂载至现有目录【涉华博主】',
    icon: <CheckCheck className="w-3.5 h-3.5" />,
  },
  {
    id: 'scenario_3',
    step: 3,
    label: '异常消歧 (1:N)',
    badge: '冲突裁决',
    desc: '2个URL命中历史多版本快照，左右并排卡片单选裁决，防遗漏阻断校验',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  },
  {
    id: 'scenario_4',
    step: 4,
    label: '兜底与异步补采',
    badge: '未命中',
    desc: '5个未命中URL一键提取，勾选异步补采推入爬虫队列并绑定目录',
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  {
    id: 'scenario_5',
    step: 5,
    label: '闭环通知提醒',
    badge: '下次登录',
    desc: '模拟重新登录主控台，居中弹出“信源自动补采完成通知”并穿透目录',
    icon: <BellRing className="w-3.5 h-3.5 text-emerald-500" />,
  },
];

export const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({
  currentScenario,
  onScenarioChange,
  devNotesOpen,
  onToggleDevNotes,
  cleanMode,
  onToggleCleanMode,
  onResetDemo,
}) => {
  if (cleanMode) {
    return (
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={onToggleCleanMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-lg hover:bg-slate-50 hover:text-blue-600 transition-all cursor-pointer"
          title="退出纯净演示模式 (快捷键 V)"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          <span>恢复研发演示中控 (按 V)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2 flex items-center justify-between select-none z-40 sticky top-0 shadow-md">
      {/* 左侧：核心业务流区块（左右双极化规整排布，gap 10-14px） */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {/* 业务中控微标 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>信源批量导入走查中控</span>
        </div>

        {/* 5 个场景切换 Pill */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 shrink-0">
          {SCENARIO_ITEMS.map((item) => {
            const isActive = currentScenario === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScenarioChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={item.desc}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-300'
                }`}>
                  {item.step}
                </span>
                <span className="hidden sm:inline">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'scenario_3' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 右侧：研发与系统操作区块（靠右对齐，工具间距 8px） */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {/* 重置演示 */}
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
          title="重置全部操作状态与演示数据"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span className="hidden md:inline">重置演示</span>
        </button>

        {/* 纯净模式 */}
        <button
          onClick={onToggleCleanMode}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
          title="隐藏中控栏进入纯净业务体验 (按 V)"
        >
          <EyeOff className="w-3 h-3 text-slate-400" />
          <span className="hidden md:inline">纯净演示 (V)</span>
        </button>

        {/* 研发交互与逻辑标注抽屉 开关 */}
        <button
          onClick={onToggleDevNotes}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
            devNotesOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>📖 研发交互与逻辑标注 (Dev Notes)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
