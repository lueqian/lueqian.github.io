/**
 * @name 蓝鹰一体化智控平台
 */
import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AppProvider, useAppStore } from './store';
import { AppSider } from './components/AppSider';
import { GlobalHeader } from './components/GlobalHeader';
import { DepartmentManagementPage } from './pages/DepartmentManagementPage';
import { MonitorWarningPage } from './pages/MonitorWarningPage';
import { EmergencyResponsePage } from './pages/EmergencyResponsePage';
import { ManualReportPage } from './pages/ManualReportPage';
import { SourceControlPage } from './pages/SourceControlPage';
import { SituationAwarenessPage } from './pages/SituationAwarenessPage';
import { AiJudgeModal } from './components/AiJudgeModal';
import { InstructionRepeatModal } from './components/InstructionRepeatModal';
import { EditDepartmentModal } from './components/EditDepartmentModal';
import './style.css';

const MainContent: React.FC = () => {
  const { activeNav } = useAppStore();

  switch (activeNav) {
    case 'dept_management':
      return <DepartmentManagementPage />;
    case 'monitor_warning':
      return <MonitorWarningPage />;
    case 'emergency_response':
      return <EmergencyResponsePage />;
    case 'manual_report':
      return <ManualReportPage />;
    case 'source_control':
      return <SourceControlPage />;
    case 'situation_awareness':
      return <SituationAwarenessPage />;
    default:
      return <DepartmentManagementPage />;
  }
};

const PlatformLayout: React.FC = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f6fa] font-sans text-slate-800 antialiased select-none">
      {/* 1. 左侧一级导航 Sider（支持展开 220px / 收起 64px，保留唯一左上角系统标识与工具箱） */}
      <AppSider
        collapsed={siderCollapsed}
        onToggleCollapse={() => setSiderCollapsed(!siderCollapsed)}
      />

      {/* 2. 右侧主体区域（顶部通栏 Header + 主工作视窗） */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* 顶部通栏 Header（56px 高度，纯白底色，面包屑路径与用户信息） */}
        <GlobalHeader />

        {/* 主视窗内容滚动容器 */}
        <main className="flex-1 overflow-hidden bg-[#ffffff]">
          <MainContent />
        </main>
      </div>

      {/* 全局研判与指令下达弹窗 */}
      <AiJudgeModal />

      {/* 指令防重提醒警告弹窗 */}
      <InstructionRepeatModal />

      {/* 480px 编辑/新增部门弹窗 */}
      <EditDepartmentModal />
    </div>
  );
};

export default function BlueEagleIntegratedPlatform() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
        }
      }}
    >
      <AppProvider>
        <PlatformLayout />
      </AppProvider>
    </ConfigProvider>
  );
}
