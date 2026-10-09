import React from 'react';
import {
  SafetyOutlined,
  RadarChartOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  TeamOutlined,
  ToolOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SecurityScanOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  BookOutlined,
  GlobalOutlined,
  ApartmentOutlined,
  EditOutlined,
  CameraOutlined,
  DesktopOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';

export interface NavigationProps {
  activeKey: string;
  onSelect: (key: string) => void;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  tag?: string;
}

// 顶部【核心场景演示】专用目录
const scenarioMenuItems: MenuItem[] = [
  {
    key: 'scenario-direct-provincial',
    label: '免审直通省厅',
    icon: <ThunderboltOutlined style={{ color: '#1677ff' }} />,
    tag: '场景 1',
  },
  {
    key: 'scenario-city-audit',
    label: '市局审核拦截',
    icon: <SafetyCertificateOutlined style={{ color: '#faad14' }} />,
    tag: '场景 2',
  },
  {
    key: 'scenario-cross-tenant-instruction',
    label: '跨租户指令抢占',
    icon: <ApartmentOutlined style={{ color: '#722ed1' }} />,
    tag: '场景 3',
  },
  {
    key: 'scenario-secondary-dispatch',
    label: '市局二次转派',
    icon: <BranchesOutlined style={{ color: '#13c2c2' }} />,
    tag: '场景 4',
  },
];

// 既有系统标准业务功能
const standardMenuItems: MenuItem[] = [
  { key: 'police-opinion-joint', label: '警舆同处', icon: <SecurityScanOutlined /> },
  { key: 'manual-report', label: '手工上报', icon: <EditOutlined /> },
  { key: 'source-control', label: '源头防控', icon: <SafetyOutlined /> },
  { key: 'source-control-cq', label: '源头防控（cq）', icon: <SafetyOutlined /> },
  { key: 'monitor-warning', label: '监测预警', icon: <RadarChartOutlined /> },
  { key: 'emergency-response', label: '应急处置', icon: <FileTextOutlined /> },
  { key: 'review-summary', label: '复盘总结', icon: <OrderedListOutlined /> },
  { key: 'toolbox', label: '工具箱', icon: <ToolOutlined /> },
  { key: 'people-database', label: '人员库', icon: <UsergroupAddOutlined /> },
  { key: 'stability-maintenance', label: '稳情库', icon: <MessageOutlined /> },
  { key: 'publications-management', label: '刊物管理', icon: <BookOutlined /> },
  { key: 'link-collection', label: '截图取证', icon: <CameraOutlined /> },
  { key: 'client-ledger-entry', label: '客户端工作台', icon: <DesktopOutlined /> },
  { key: 'internet-data-screen', label: '互联网大屏', icon: <GlobalOutlined /> },
  { key: 'intranet-data-screen', label: '内网大屏', icon: <ApartmentOutlined /> },
];

const Navigation: React.FC<NavigationProps> = ({
  activeKey,
  onSelect,
  collapsed,
  onCollapse,
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-menu">
        {/* 1. 核心场景演示分组（顶部归集） */}
        {!collapsed && (
          <div className="menu-group-header">
            核心场景演示
          </div>
        )}
        {scenarioMenuItems.map((item) => {
          const menuItemNode = (
            <div
              key={item.key}
              className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
              onClick={() => onSelect(item.key)}
              style={{
                ...(activeKey === item.key ? { background: '#e6f4ff', fontWeight: 600 } : {}),
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                <span className="menu-icon" style={{ minWidth: 20, marginRight: 8 }}>{item.icon}</span>
                {!collapsed && (
                  <span className="menu-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
              </div>
              {!collapsed && item.tag && (
                <span className="scenario-nav-tag" style={{ flexShrink: 0, marginLeft: 4 }}>
                  {item.tag}
                </span>
              )}
            </div>
          );

          return collapsed ? (
            <Tooltip key={item.key} placement="right" title={item.label}>
              {menuItemNode}
            </Tooltip>
          ) : (
            menuItemNode
          );
        })}

        {/* 2. 既有业务模块 */}
        {!collapsed && (
          <div className="menu-group-header" style={{ marginTop: 12 }}>
            业务功能模块
          </div>
        )}
        {standardMenuItems.map((item) => {
          const menuItemNode = (
            <div
              key={item.key}
              className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
              onClick={() => onSelect(item.key)}
              style={{ padding: '10px 14px' }}
            >
              <span className="menu-icon" style={{ minWidth: 20, marginRight: 8 }}>{item.icon}</span>
              {!collapsed && <span className="menu-label">{item.label}</span>}
            </div>
          );

          return collapsed ? (
            <Tooltip key={item.key} placement="right" title={item.label}>
              {menuItemNode}
            </Tooltip>
          ) : (
            menuItemNode
          );
        })}
      </div>
      <div className="sidebar-footer">
        <div
          className="collapse-btn"
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && <span>收起侧边栏</span>}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
