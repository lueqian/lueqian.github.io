/**
 * @name Eagle DataStory - 信源批量导入与建库
 * @mode axure
 * @description 蓝鹰系统定向采集与重点源批量导入建库原型，整合信源搜索、批量导入检索、重点源管理、采集任务与额度明细闭环
 *
 * 架构说明：
 * - index.tsx: 系统总入口，包含研发场景中控切换器 (Scenario Switcher)、Dev Notes 抽屉与全局布局
 * - components/ScenarioSwitcher: 顶部常驻 5 大业务场景切换控制器
 * - components/DevNotesDrawer: 右侧半透明悬浮折叠抽屉【📖 研发交互与逻辑标注】
 * - components/BatchSourceImportModal: 批量导入与建库核心模态弹窗 (涵盖场景 1-4 的全套交互)
 * - components/NextLoginNoticeModal: 场景 5 闭环通知模态弹窗
 * - pages/SourceSearchPage: 信源搜索首页 (高保真复刻截图 1) 与搜索结果页 (高保真复刻截图 2)
 * - pages/Sources: 重点源管理页面
 *
 * 参考资料：
 * - /rules/development-guide.md
 * - /rules/axure-api-guide.md
 * - /rules/user-ui-guidelines.md
 */

import './style.css';
import React, { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { ConfigProvider, theme, message } from 'antd';

import type {
  KeyDesc,
  DataDesc,
  ConfigItem,
  Action,
  EventItem,
  AxureProps,
  AxureHandle,
} from '../../common/axure-types';
import { safeEmitEvent } from '../../common/axure-types';

// 导入导航与布局组件
import Navigation from './components/Navigation';
import Header from './components/Header';
import type { SubNavItem } from './components/Header';

// 导入业务场景控制器与标注抽屉
import { ScenarioSwitcher } from './components/ScenarioSwitcher';
import { DevNotesDrawer } from './components/DevNotesDrawer';
import { BatchSourceImportModal } from './components/BatchSourceImportModal';
import { NextLoginNoticeModal } from './components/NextLoginNoticeModal';
import { ScenarioId } from './types';

// 导入业务页面组件
import { SourceSearchPage } from './pages/SourceSearchPage';
import Search from './pages/Search';
import Topics from './pages/Topics';
import Sources from './pages/Sources';
import CollectTask from './pages/CollectTask';
import QuotaFlow from './pages/QuotaFlow';

// ============ 类型定义 ============

type PageKey = 'search' | 'workbench' | 'topic' | 'source' | 'collect' | 'quota';

// 页面标题映射
const PAGE_TITLES: Record<PageKey, string> = {
  search: '搜索',
  workbench: '工作台',
  topic: '全网专题',
  source: '重点源',
  collect: '采集任务',
  quota: '额度明细',
};

// 二级菜单配置（按页面分组）
const PAGE_SUB_NAVS: Partial<Record<PageKey, SubNavItem[]>> = {
  source: [
    { key: 'monitor', label: '重点源监测' },
    { key: 'manage', label: '重点源管理' },
    { key: 'source_search', label: '信源搜索' },
    { key: 'alert', label: '预警管理' },
  ],
};

// ============ 主组件 ============

const EagleDataStory = forwardRef<AxureHandle, AxureProps>((props, ref) => {
  const { data, config, onEvent } = props;

  // ============ 页面状态管理 ============

  // 当前选中的一级页面
  const [activePage, setActivePage] = useState<PageKey>('source');

  // 侧边栏折叠状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 二级菜单激活项
  const [activeSubNav, setActiveSubNav] = useState<string>('source_search');

  // ============ 研发走查场景状态 ============

  const [currentScenario, setCurrentScenario] = useState<ScenarioId>('scenario_1');
  const [devNotesOpen, setDevNotesOpen] = useState(false);
  const [cleanMode, setCleanMode] = useState(false);

  // 批量导入弹窗状态
  const [importModalOpen, setImportModalOpen] = useState(true);
  const [importModalStage, setImportModalStage] = useState<'upload' | 'parsing' | 'results'>('upload');
  const [importModalTab, setImportModalTab] = useState<'matched' | 'conflicts' | 'unhit'>('matched');

  // 下次登录通知弹窗状态
  const [nextLoginModalOpen, setNextLoginModalOpen] = useState(false);

  // 挂载高亮目录（供场景 5 跳转使用）
  const [highlightDirectory, setHighlightDirectory] = useState<string | null>(null);

  // ============ 场景切换中控核心逻辑 ============

  const handleScenarioChange = useCallback((scenario: ScenarioId) => {
    setCurrentScenario(scenario);

    if (scenario === 'scenario_1') {
      setActivePage('source');
      setActiveSubNav('source_search');
      setImportModalOpen(true);
      setImportModalStage('upload');
      setNextLoginModalOpen(false);
    } else if (scenario === 'scenario_2') {
      setActivePage('source');
      setActiveSubNav('source_search');
      setImportModalOpen(true);
      setImportModalStage('results');
      setImportModalTab('matched');
      setNextLoginModalOpen(false);
    } else if (scenario === 'scenario_3') {
      setActivePage('source');
      setActiveSubNav('source_search');
      setImportModalOpen(true);
      setImportModalStage('results');
      setImportModalTab('conflicts');
      setNextLoginModalOpen(false);
    } else if (scenario === 'scenario_4') {
      setActivePage('source');
      setActiveSubNav('source_search');
      setImportModalOpen(true);
      setImportModalStage('results');
      setImportModalTab('unhit');
      setNextLoginModalOpen(false);
    } else if (scenario === 'scenario_5') {
      setImportModalOpen(false);
      setNextLoginModalOpen(true);
    }
  }, []);

  // 重置演示
  const handleResetDemo = useCallback(() => {
    handleScenarioChange('scenario_1');
    setHighlightDirectory(null);
    message.success('已重置演示流程至场景 1');
  }, [handleScenarioChange]);

  // 纯净模式快捷键 'V' 监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'v' || e.key === 'V') {
        setCleanMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 打开批量导入弹窗（常规入口调用）
  const handleOpenBatchImport = useCallback(() => {
    setImportModalOpen(true);
    setImportModalStage('upload');
  }, []);

  // 场景 5：从闭环通知跳转至重点源目录
  const handleNavigateToDirectory = useCallback((dirName: string) => {
    setNextLoginModalOpen(false);
    setActivePage('source');
    setActiveSubNav('manage');
    setHighlightDirectory(dirName);
    message.success(`已为您定位并进入重点源目录【${dirName}】`);
  }, []);

  // 批量导入成功完成回调
  const handleImportSuccess = useCallback(
    (summary: { matchedCount: number; dirName: string; autoCrawlCount?: number }) => {
      setHighlightDirectory(summary.dirName);
      if (activePage === 'source' && activeSubNav !== 'manage') {
        // 可选保留在当前搜索页或跳转
      }
    },
    [activePage, activeSubNav]
  );

  // ============ 菜单导航处理 ============

  const handleMenuSelect = useCallback(
    (key: string) => {
      setActivePage(key as PageKey);
      const subNavs = PAGE_SUB_NAVS[key as PageKey];
      if (key === 'source') {
        setActiveSubNav('source_search');
      } else {
        setActiveSubNav(subNavs && subNavs.length > 0 ? subNavs[0].key : '');
      }
      safeEmitEvent(onEvent, 'onMenuSelect', key);
    },
    [onEvent]
  );

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleBackToNav = useCallback(() => {
    safeEmitEvent(onEvent, 'onBackToNav');
  }, [onEvent]);

  const handleSwitchAccount = useCallback(() => {
    safeEmitEvent(onEvent, 'onSwitchAccount');
  }, [onEvent]);

  const handleLogout = useCallback(() => {
    safeEmitEvent(onEvent, 'onLogout');
  }, [onEvent]);

  // ============ Axure Handle ============

  useImperativeHandle(
    ref,
    function () {
      return {
        getVar: function (name: string) {
          switch (name) {
            case 'selected_menu':
              return activePage;
            case 'sidebar_collapsed':
              return sidebarCollapsed;
            default:
              return undefined;
          }
        },
        fireAction: function (name: string, params?: string) {
          if (name === 'setPage' && params) {
            setActivePage(params as PageKey);
          } else if (name === 'setSidebarCollapsed') {
            setSidebarCollapsed(params === 'true');
          }
        },
        eventList: [
          { name: 'onMenuSelect', desc: '点击侧边菜单项时触发', payload: '菜单 key' },
          { name: 'onLogout', desc: '点击退出登录时触发' },
          { name: 'onSwitchAccount', desc: '点击切换账号时触发' },
          { name: 'onBackToNav', desc: '点击返回导航页时触发' },
        ] as EventItem[],
        actionList: [
          {
            name: 'setPage',
            desc: '切换到指定页面',
            params: '页面 key (search/workbench/topic/source/collect/quota)',
          },
          { name: 'setSidebarCollapsed', desc: '设置侧边栏折叠状态', params: 'true/false' },
        ] as Action[],
        varList: [
          { name: 'selected_menu', desc: '当前选中的菜单项 key' },
          { name: 'sidebar_collapsed', desc: '侧边栏是否折叠' },
        ] as KeyDesc[],
        configList: [] as ConfigItem[],
        dataList: [] as DataDesc[],
      };
    },
    [activePage, sidebarCollapsed, onEvent]
  );

  // ============ 渲染子页面 ============

  const renderPage = () => {
    switch (activePage) {
      case 'source':
        if (activeSubNav === 'source_search') {
          return (
            <SourceSearchPage
              onOpenBatchImport={handleOpenBatchImport}
              onNavigateToManage={(dir) => {
                setActiveSubNav('manage');
                if (dir) setHighlightDirectory(dir);
              }}
              highlightDirectory={highlightDirectory}
            />
          );
        }
        return (
          <Sources
            onNavigate={handleMenuSelect}
            highlightDirectory={highlightDirectory}
            onOpenBatchImport={handleOpenBatchImport}
          />
        );
      case 'search':
        return <Search onOpenBatchImport={handleOpenBatchImport} />;
      case 'workbench':
        return (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
            <h2 style={{ fontSize: 18, color: '#1e293b', marginBottom: 8 }}>系统工作台</h2>
            <p>重点源定向采集与批量导入任务运行状态良好</p>
          </div>
        );
      case 'topic':
        return <Topics onNavigate={handleMenuSelect} />;
      case 'collect':
        return <CollectTask />;
      case 'quota':
        return <QuotaFlow />;
      default:
        return (
          <SourceSearchPage
            onOpenBatchImport={handleOpenBatchImport}
            highlightDirectory={highlightDirectory}
          />
        );
    }
  };

  // 内容区表单控件亮色主题配置
  const contentFormTheme = {
    token: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#d9d9d9',
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.35)',
      colorPrimary: '#2563eb',
      borderRadius: 6,
    },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          colorBgBase: '#1a2333',
          colorBgContainer: '#1e293b',
          colorText: 'rgba(255, 255, 255, 0.85)',
          colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
          colorBorder: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 6,
        },
      }}
    >
      <div className="ly-layout">
        {/* 侧边栏 */}
        <Navigation
          activeKey={activePage}
          collapsed={sidebarCollapsed}
          onMenuSelect={handleMenuSelect}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* 主内容区 */}
        <div className="ly-main flex flex-col flex-1 overflow-hidden">
          {/* 1. 顶层场景切换器 (Scenario Switcher) */}
          <ScenarioSwitcher
            currentScenario={currentScenario}
            onScenarioChange={handleScenarioChange}
            devNotesOpen={devNotesOpen}
            onToggleDevNotes={() => setDevNotesOpen((prev) => !prev)}
            cleanMode={cleanMode}
            onToggleCleanMode={() => setCleanMode((prev) => !prev)}
            onResetDemo={handleResetDemo}
          />

          {/* 2. 页面顶部栏 - 带有二级菜单及模拟下次登录快捷键 */}
          <Header
            pageTitle={PAGE_TITLES[activePage] || activePage}
            subNavItems={PAGE_SUB_NAVS[activePage]}
            activeSubNav={activeSubNav}
            onSubNavChange={setActiveSubNav}
            nickname="管理员 (超管)"
            onBackToNav={handleBackToNav}
            onSwitchAccount={handleSwitchAccount}
            onLogout={handleLogout}
          />

          {/* 3. 业务页面内容容器 */}
          <ConfigProvider theme={contentFormTheme}>
            <div className="ly-content flex-1 overflow-y-auto bg-slate-50 relative">
              {renderPage()}
            </div>
          </ConfigProvider>
        </div>

        {/* 4. 核心模态弹窗：批量导入与添加信源 (覆盖场景 1-4) */}
        <BatchSourceImportModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          initialStage={importModalStage}
          initialTab={importModalTab}
          onConfirmSuccess={handleImportSuccess}
        />

        {/* 5. 闭环通知弹窗：信源自动补采完成通知 (场景 5) */}
        <NextLoginNoticeModal
          open={nextLoginModalOpen}
          onClose={() => setNextLoginModalOpen(false)}
          onNavigateToDirectory={handleNavigateToDirectory}
        />

        {/* 6. 右侧半透明悬浮折叠抽屉：【📖 研发交互与逻辑标注 (Dev Notes)】 */}
        <DevNotesDrawer
          open={devNotesOpen}
          onClose={() => setDevNotesOpen(false)}
          currentScenario={currentScenario}
        />
      </div>
    </ConfigProvider>
  );
});

EagleDataStory.displayName = 'EagleDataStory';

export default EagleDataStory;
