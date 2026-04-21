import React, { useState, useCallback } from 'react';
import { Sidebar, Header } from './components';
import { Dashboard, Monitoring, Analysis, Settings, CustomerList, CustomerConfig, PlaceholderPage } from './pages';
import { menuConfig } from './components/Sidebar';
import './style.css';

/**
 * 后台运营管理系统 - 入口文件
 *
 * 路由系统支持：
 * - 侧边栏菜单点击：重置面包屑栈，进入一级页面
 * - navigateTo：追加面包屑层级，进入子页面
 * - goBack：回退一级面包屑
 */

export interface BreadcrumbItem {
  path: string;
  label: string;
  params?: Record<string, string>;
}

/** 根据 menuConfig 构建所有叶子节点的 key → label 映射 */
function buildMenuMap(items: typeof menuConfig): Record<string, string> {
  const map: Record<string, string> = {};
  items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        map[child.key] = `${item.label} / ${child.label}`;
      });
    } else {
      map[item.key] = item.label;
    }
  });
  return map;
}

const menuLabelMap = buildMenuMap(menuConfig);

const Index: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbStack, setBreadcrumbStack] = useState<BreadcrumbItem[]>([
    { path: 'dashboard', label: 'Dashboard' },
  ]);

  const currentPath = breadcrumbStack[breadcrumbStack.length - 1].path;

  /** 点击侧边栏菜单：重置面包屑栈 */
  const handleMenuClick = useCallback((key: string, label: string) => {
    setBreadcrumbStack([{ path: key, label }]);
  }, []);

  /** 进入子页面：追加面包屑层级 */
  const navigateTo = useCallback((path: string, label: string, params?: Record<string, string>) => {
    setBreadcrumbStack((prev) => [...prev, { path, label, params }]);
  }, []);

  /** 返回上一级 */
  const goBack = useCallback(() => {
    setBreadcrumbStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  /** 切换侧边栏折叠 */
  const handleToggleSider = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  /** 根据 currentPath 渲染对应页面 */
  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard':
        return <Dashboard />;
      case 'customer-list':
        return <CustomerList onNavigate={navigateTo} />;
      case 'customer-config': {
        const name = breadcrumbStack[breadcrumbStack.length - 1].params?.customerName || 'TXYY';
        return <CustomerConfig customerName={name} onBack={goBack} />;
      }
      case 'monitoring':
        return <Monitoring />;
      case 'analysis':
        return <Analysis />;
      case 'settings':
        return <Settings />;
      default:
        return <PlaceholderPage title={breadcrumbStack[breadcrumbStack.length - 1].label} />;
    }
  };

  return (
    <div className="antigravity-layout">
      <Sidebar
        collapsed={collapsed}
        activeKey={breadcrumbStack[0].path}
        onMenuClick={handleMenuClick}
      />
      <div className="antigravity-main">
        <Header
          collapsed={collapsed}
          onToggleSider={handleToggleSider}
          breadcrumb={breadcrumbStack}
        />
        <div className="antigravity-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Index;
