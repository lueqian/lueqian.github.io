// src/prototypes/蓝鹰一体化系统/components/ScenarioLayout.tsx
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Popover, Tooltip, Tag } from 'antd';
import {
  FileTextOutlined,
  PushpinOutlined,
  PushpinFilled,
  CloseOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { ScenarioConfig } from '../types/scenario';
import { scenarioConfigs } from '../data/scenarioConfigs';
import '../scenario-style.css';

export interface ScenarioActionBtn {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ScenarioContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  currentRoleView?: string;
  setCurrentRoleView: (view: string) => void;
  actionButton: ScenarioActionBtn | null;
  setActionButton: (btn: ScenarioActionBtn | null) => void;
  openDrawerWithAnchor: (anchorId: number) => void;
  cleanMode: boolean;
  setCleanMode: React.Dispatch<React.SetStateAction<boolean>>;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ScenarioContext = createContext<ScenarioContextType>({
  currentStep: 1,
  setCurrentStep: () => {},
  currentRoleView: '',
  setCurrentRoleView: () => {},
  actionButton: null,
  setActionButton: () => {},
  openDrawerWithAnchor: () => {},
  cleanMode: false,
  setCleanMode: () => {},
  drawerOpen: false,
  setDrawerOpen: () => {},
});

export const useScenarioContext = () => useContext(ScenarioContext);

interface ScenarioLayoutProps {
  scenarioKey: string;
  customConfig?: ScenarioConfig;
  children: React.ReactNode;
}

export const ScenarioLayout: React.FC<ScenarioLayoutProps> = ({
  scenarioKey,
  customConfig,
  children,
}) => {
  const config = customConfig || scenarioConfigs[scenarioKey];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<number | null>(null);
  const [cleanMode, setCleanMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentRoleView, setCurrentRoleView] = useState<string>('');
  const [actionButton, setActionButton] = useState<ScenarioActionBtn | null>(null);
  const [checkedAc, setCheckedAc] = useState<Record<number, boolean>>({});

  const drawerScrollRef = useRef<HTMLDivElement>(null);

  // 1. 全局快捷键监听：D 展开/收起右侧抽屉，V 切换纯净演示模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDrawerOpen((prev) => !prev);
      }
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setCleanMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 2. 原位角标点击联动处理
  const handleBadgeClick = (anchorId: number) => {
    setActiveAnchor(anchorId);
    setDrawerOpen(true);

    setTimeout(() => {
      const cardEl = document.getElementById(`rule-anchor-${anchorId}`);
      if (cardEl && drawerScrollRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardEl.classList.add('spec-linked-glow');
        setTimeout(() => {
          cardEl.classList.remove('spec-linked-glow');
        }, 2400);
      }
    }, 150);
  };

  // 3. 切换验收项状态
  const toggleAc = (index: number) => {
    setCheckedAc((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!config) {
    return <>{children}</>;
  }

  // User Story 悬停全量浮窗内容
  const userStoryPopover = (
    <div style={{ maxWidth: 460, padding: '4px 2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
          }}
        >
          {config.scenarioBadge}
        </span>
        <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
          {config.title}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#334155' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Tag color="blue" style={{ margin: 0, flexShrink: 0, fontWeight: 500 }}>
            <UserOutlined /> 用户角色
          </Tag>
          <span style={{ fontWeight: 500 }}>{config.userStory.role}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Tag color="purple" style={{ margin: 0, flexShrink: 0, fontWeight: 500 }}>
            <ThunderboltOutlined /> 核心诉求
          </Tag>
          <span style={{ lineHeight: 1.5 }}>{config.userStory.action}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Tag color="green" style={{ margin: 0, flexShrink: 0, fontWeight: 500 }}>
            <CheckCircleOutlined /> 业务价值
          </Tag>
          <span style={{ lineHeight: 1.5 }}>{config.userStory.value}</span>
        </div>

        {config.userStory.kpi && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <Tag color="orange" style={{ margin: 0, flexShrink: 0, fontWeight: 500 }}>
              <TrophyOutlined /> 核心指标
            </Tag>
            <span style={{ fontWeight: 600, color: '#d97706' }}>{config.userStory.kpi}</span>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        <span>快捷键: <strong>D</strong> 查验规格 ｜ <strong>V</strong> 纯净演示</span>
        <button
          className="guide-btn-primary"
          style={{ padding: '3px 10px', fontSize: 12, height: 'auto', borderRadius: 4 }}
          onClick={() => setDrawerOpen(true)}
        >
          查看右侧规格 ➔
        </button>
      </div>
    </div>
  );

  return (
    <ScenarioContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        currentRoleView,
        setCurrentRoleView,
        actionButton,
        setActionButton,
        openDrawerWithAnchor: handleBadgeClick,
        cleanMode,
        setCleanMode,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      <div
        className={`scenario-page-container ${cleanMode ? 'clean-demo-mode' : ''} ${
          drawerOpen ? 'drawer-open' : ''
        } ${pinned ? 'drawer-pinned' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          position: 'relative',
        }}
      >
        {/* ==================== 1. 顶部嵌入式场景中控条 (精简四段式 · 强制单行平铺) ==================== */}
        {!cleanMode && (
          <header className="scenario-header-bar">
            {/* 左侧核心业务流区块：场景名称 + 用户场景 + 流程步骤 (从左到右紧凑居左排列，中间无多余留白) */}
            <div className="scenario-header-left">
              {/* 1. 场景名称 */}
              <div className="header-sec-name">
                <span className="scenario-id-tag">
                  {config.scenarioBadge || config.scenarioId}
                </span>
              </div>

              {/* 2. 用户场景 (紧凑胶囊标签，hover 浮窗展开完整用户故事) */}
              <Popover content={userStoryPopover} trigger="hover" placement="bottomLeft">
                <div className="user-story-badge-trigger" title="鼠标悬停查看完整用户故事与核心指标">
                  <UserOutlined style={{ color: '#1677ff', fontSize: 13 }} />
                  <span className="user-story-badge-text">用户场景</span>
                </div>
              </Popover>

              {/* 3. 视图流程 (点击直接切换视图，步骤即是动作) */}
              <div className="step-stepper-compact">
                {config.steps.map((st, idx) => {
                  const isActive = currentStep === st.step;
                  const isPassed = currentStep > st.step;
                  return (
                    <span
                      key={st.step}
                      className={`step-item ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                      onClick={() => {
                        setCurrentStep(st.step);
                        if (st.currentRoleView) {
                          setCurrentRoleView(st.currentRoleView);
                        }
                      }}
                      title={`点击切换至：${st.name}（${st.desc || ''}）`}
                    >
                      <span className="step-num">{st.step}</span>
                      <span className="step-name">{st.name}</span>
                      {idx < config.steps.length - 1 && <span className="step-divider">➔</span>}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 右侧研发辅助与系统操作区块：规格批注 + 纯净演示 (紧凑居右排列) */}
            <div className="header-sec-actions">
              <button
                className={`dev-toggle-btn ${drawerOpen ? 'active' : ''}`}
                onClick={() => setDrawerOpen(!drawerOpen)}
                title="展开全量需求规格与批注 (快捷键: D)"
              >
                <FileTextOutlined style={{ fontSize: 13 }} />
                <span>需求规格与批注</span>
                <span className="counter-badge">{config.annotations.length}</span>
              </button>

              <Tooltip title="进入纯净演示模式（隐藏中控条与界面①②④标记，快捷键: V）">
                <button
                  className="clean-mode-btn"
                  onClick={() => setCleanMode(true)}
                  aria-label="纯净演示模式"
                >
                  <EyeInvisibleOutlined style={{ fontSize: 13 }} />
                </button>
              </Tooltip>
            </div>
          </header>
        )}

        {/* 纯净模式退出悬浮胶囊 (仅在纯净演示模式下显示在右上角以供随时恢复) */}
        {cleanMode && (
          <div
            className="clean-mode-restore-pill"
            onClick={() => setCleanMode(false)}
            title="退出纯净演示模式 (快捷键: V)"
          >
            <EyeOutlined style={{ marginRight: 4 }} /> 退出演示模式 (按 V 恢复)
          </div>
        )}

        {/* ==================== 2. 原型主体区域 (纯净业务操作，点击不乱弹抽屉) ==================== */}
        <main className="scenario-prototype-body">
          {children}
        </main>

        {/* ==================== 3. 右侧统一研发规格抽屉 (自适应并排无遮挡) ==================== */}
        <aside className={`unified-dev-drawer ${drawerOpen ? 'open' : ''} ${pinned ? 'pinned' : ''}`}>
          <div className="drawer-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  全量需求规格与细节说明
                </h3>
              </div>
              <span className="sub-text">
                {config.scenarioBadge} · {config.title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tooltip title={pinned ? '已开启固定并排模式' : '固定右侧展开，主界面居中并排查验'}>
                <button
                  className={`drawer-pin-btn ${pinned ? 'active' : ''}`}
                  onClick={() => setPinned(!pinned)}
                >
                  {pinned ? <PushpinFilled style={{ color: '#1677ff' }} /> : <PushpinOutlined />}
                  <span>{pinned ? '已并排' : '并排'}</span>
                </button>
              </Tooltip>

              <button
                className="close-btn"
                onClick={() => setDrawerOpen(false)}
                title="收起规格面板 (快捷键: D / ESC)"
              >
                <CloseOutlined />
              </button>
            </div>
          </div>

          <div className="drawer-content-scroll" ref={drawerScrollRef}>
            {/* Section 1: 前置条件 */}
            <section className="drawer-section">
              <div className="section-title-row">
                <span className="section-badge">1</span>
                <h4>场景背景与前置条件</h4>
              </div>
              <ul className="precondition-list">
                {config.prd.preconditions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Section 2: 状态机时序 */}
            {config.prd.stateFlow && config.prd.stateFlow.length > 0 && (
              <section className="drawer-section">
                <div className="section-title-row">
                  <span className="section-badge">2</span>
                  <h4>核心状态机与流转时序</h4>
                </div>
                <div className="state-flow-list">
                  {config.prd.stateFlow.map((st, i) => (
                    <div key={i} className="state-flow-card">
                      <div className="state-tags">
                        <span className="tag-src">{st.from}</span>
                        <span className="tag-arrow">➔</span>
                        <span className="tag-dest">{st.to}</span>
                      </div>
                      <div className="state-trigger">触发动作：{st.trigger}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: 界面组件批注与业务规则 */}
            <section className="drawer-section">
              <div className="section-title-row" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="section-badge">3</span>
                  <h4>界面组件批注与业务规则</h4>
                </div>
                <span style={{ fontSize: 11, color: '#3b82f6' }}>点击卡片高亮界面</span>
              </div>

              <div className="rules-annotation-list">
                {config.annotations.map((item) => {
                  const isCurrentActive = activeAnchor === item.id;
                  return (
                    <div
                      key={item.id}
                      id={`rule-anchor-${item.id}`}
                      className={`annotation-rule-card ${isCurrentActive ? 'highlight' : ''}`}
                      onClick={() => {
                        setActiveAnchor(item.id);
                        // 高亮界面中的对应元素
                        const targetEl = document.querySelector(`[data-annotation-pin="${item.id}"]`) as HTMLElement;
                        if (targetEl) {
                          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                          targetEl.classList.add('spec-linked-glow');
                          setTimeout(() => {
                            targetEl.classList.remove('spec-linked-glow');
                          }, 2400);
                        }
                      }}
                      title="点击联动定位主界面对应组件"
                    >
                      <div className="card-top">
                        <span className="anchor-badge">{item.id}</span>
                        <span className="card-title">{item.title}</span>
                        <span className="card-tag">{item.tag}</span>
                      </div>
                      <p className="card-desc">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: 验收标准清单 */}
            <section className="drawer-section">
              <div className="section-title-row" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="section-badge" style={{ background: '#10b981' }}>
                    4
                  </span>
                  <h4>验收标准清单</h4>
                </div>
                <Tag color="green" style={{ margin: 0, fontSize: 11 }}>
                  自测验收
                </Tag>
              </div>

              <div className="ac-list">
                {config.prd.acceptanceCriteria.map((ac, i) => {
                  const isChecked = !!checkedAc[i];
                  return (
                    <div
                      key={i}
                      className={`ac-item ${isChecked ? 'checked' : ''}`}
                      onClick={() => toggleAc(i)}
                    >
                      <span className="ac-check-icon">{isChecked ? '☑️' : '◻️'}</span>
                      <span className="ac-text">{ac}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </ScenarioContext.Provider>
  );
};

export default ScenarioLayout;
