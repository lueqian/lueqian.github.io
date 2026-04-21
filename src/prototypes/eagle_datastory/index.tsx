/**
 * @name Eagle DataStory
 * @mode axure
 * @description 统一的原型系统入口，整合搜索、专题、重点源、采集任务、额度明细等模块
 *
 * 架构说明：
 * - index.tsx: 系统总入口，包含路由逻辑和全局布局
 * - components/: 通用组件（Navigation 侧边栏、Header 顶部栏）
 * - pages/: 业务页面组件（Search, Topics, Sources, CollectTask, QuotaFlow）
 * - style.css: 合并的全局样式
 *
 * 特性：
 * - 组件化架构：修改 Navigation.tsx 即可同步全系统导航
 * - 单一入口：Axhub 通过 index.tsx 识别项目
 * - 状态管理：使用 React useState 管理当前页面和布局状态
 *
 * 参考资料：
 * - /rules/development-guide.md
 * - /rules/axure-api-guide.md
 */

import './style.css';
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';

import type {
  KeyDesc,
  DataDesc,
  ConfigItem,
  Action,
  EventItem,
  AxureProps,
  AxureHandle,
} from '../../common/axure-types';
import { safeEmitEvent, getConfigValue, getDataValue } from '../../common/axure-types';

// 导入共享组件
import Navigation from './components/Navigation';
import Header from './components/Header';
import type { SubNavItem } from './components/Header';

// 导入页面组件
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

  // ============ 状态管理 ============

  // 当前选中的菜单项（页面）
  const [activePage, setActivePage] = useState<PageKey>('search');

  // 侧边栏折叠状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 二级菜单激活项（如重点源的子 Tab）
  const [activeSubNav, setActiveSubNav] = useState<string>('');

  // ============ 事件处理 ============

  const handleMenuSelect = useCallback((key: string) => {
    setActivePage(key as PageKey);
    // 切换页面时，自动设置默认二级菜单
    const subNavs = PAGE_SUB_NAVS[key as PageKey];
    if (key === 'source') {
      // 重点源页面默认选中"重点源管理"
      setActiveSubNav('manage');
    } else {
      setActiveSubNav(subNavs && subNavs.length > 0 ? subNavs[0].key : '');
    }
    safeEmitEvent(onEvent, 'onMenuSelect', key);
  }, [onEvent]);

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
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
          { name: 'setPage', desc: '切换到指定页面', params: '页面 key (search/workbench/topic/source/collect/quota)' },
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

  // ============ 渲染当前页面 ============

  const renderPage = () => {
    switch (activePage) {
      case 'search':
        return <Search />;
      case 'workbench':
        // 工作台暂未实现，显示占位
        return (
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <h2>工作台</h2>
            <p>功能开发中...</p>
          </div>
        );
      case 'topic':
        return <Topics />;
      case 'source':
        return <Sources />;
      case 'collect':
        return <CollectTask />;
      case 'quota':
        return <QuotaFlow />;
      default:
        return <Search />;
    }
  };

  // ============ 渲染 ============

  // 内容区表单控件的亮色主题 token（覆盖 darkAlgorithm 的深色背景）
  const contentFormTheme = {
    token: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBorder: '#d9d9d9',
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',
      colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
      colorIcon: 'rgba(0, 0, 0, 0.45)',
      colorIconHover: 'rgba(0, 0, 0, 0.65)',
      controlItemBgActive: 'rgba(0, 0, 0, 0.04)',
      controlItemBgHover: 'rgba(0, 0, 0, 0.04)',
    },
    components: {
      Input: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',
        activeBorderColor: '#3b82f6',
        hoverBorderColor: '#3b82f6',
        activeShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
      },
      Select: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',
        optionSelectedBg: 'rgba(59, 130, 246, 0.1)',
        activeBorderColor: '#3b82f6',
        hoverBorderColor: '#3b82f6',
        activeShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
      },
      DatePicker: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        colorTextPlaceholder: 'rgba(0, 0, 0, 0.25)',
        activeBorderColor: '#3b82f6',
        hoverBorderColor: '#3b82f6',
        activeShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
        cellActiveWithRangeBg: 'rgba(59, 130, 246, 0.1)',
      },
      TimePicker: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        activeBorderColor: '#3b82f6',
        hoverBorderColor: '#3b82f6',
      },
      InputNumber: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
        activeBorderColor: '#3b82f6',
        hoverBorderColor: '#3b82f6',
      },
      Table: {
        colorBgContainer: '#ffffff',
        headerBg: '#fafafa',
        colorBorder: '#f0f0f0',
        colorText: 'rgba(0, 0, 0, 0.88)',
        rowHoverBg: 'rgba(59, 130, 246, 0.04)',
      },
      Cascader: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
      },
      TreeSelect: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
      },
      Mentions: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
        colorText: 'rgba(0, 0, 0, 0.88)',
      },
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
        <div className="ly-main">
          {/* 顶部栏 - 显示当前页面标题 + 二级菜单 */}
          <Header
            pageTitle={PAGE_TITLES[activePage] || activePage}
            subNavItems={PAGE_SUB_NAVS[activePage]}
            activeSubNav={activeSubNav}
            onSubNavChange={setActiveSubNav}
            nickname="管理员"
            onBackToNav={handleBackToNav}
            onSwitchAccount={handleSwitchAccount}
            onLogout={handleLogout}
          />

          {/* 页面内容 - 使用独立 ConfigProvider 覆盖表单控件为白色背景 */}
          <ConfigProvider theme={contentFormTheme}>
            <div className="ly-content">
              {renderPage()}
            </div>
          </ConfigProvider>
        </div>
      </div>
    </ConfigProvider>
  );
});

EagleDataStory.displayName = 'EagleDataStory';

export default EagleDataStory;
