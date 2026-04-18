import React, { useState, useCallback } from 'react';
import { Sidebar, Header } from './components';
import { Dashboard, Monitoring, Analysis, Settings, PlaceholderPage } from './pages';
import { menuConfig } from './components/Sidebar';
import './style.css';

/**
 * 数源智汇舆情管理系统 - 入口文件
 *
 * 使用 React 状态管理 currentPath 模拟路由跳转
 * 通过 handleMenuClick 函数切换侧边栏菜单，加载不同子页面
 */

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
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [currentLabel, setCurrentLabel] = useState('Dashboard');

  /** 点击侧边栏菜单时更新主内容区 */
  const handleMenuClick = useCallback((key: string, label: string) => {
    setCurrentPath(key);
    setCurrentLabel(label);
  }, []);

  /** 切换侧边栏折叠 */
  const handleToggleSider = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  /** 构建面包屑 */
  const breadcrumb = [{ label: '首页' }, { label: currentLabel }];

  /** 根据 currentPath 渲染对应页面 */
  const renderContent = () => {
    switch (currentPath) {
      case 'dashboard':
        return <Dashboard />;

      case 'monitoring':
        return <Monitoring />;

      case 'analysis':
        return <Analysis />;

      case 'settings':
        return <Settings />;

      default:
        return <PlaceholderPage title={currentLabel} />;
    }
  };

  return (
    <div className="antigravity-layout">
      {/* 侧边栏 */}
      <Sidebar
        collapsed={collapsed}
        activeKey={currentPath}
        onMenuClick={handleMenuClick}
      />

      {/* 主内容区域 */}
      <div className="antigravity-main">
        {/* 顶部导航 */}
        <Header
          collapsed={collapsed}
          onToggleSider={handleToggleSider}
          breadcrumb={breadcrumb}
        />

        {/* 内容区 */}
        <div className="antigravity-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Index;
