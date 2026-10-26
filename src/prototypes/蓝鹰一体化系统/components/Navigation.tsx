import React, { useState } from 'react';
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
  SettingOutlined,
  DownOutlined,
  AppstoreOutlined,
  SyncOutlined,
  LineChartOutlined,
  BarChartOutlined,
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
  {
    key: 'scenario-cross-tenant-config',
    label: '跨租户后台配置',
    icon: <SettingOutlined style={{ color: '#52c41a' }} />,
    tag: '场景 5',
  },
  {
    key: 'scenario-joint-disposal-failure',
    label: '联合处置与容灾',
    icon: <SyncOutlined style={{ color: '#ef4444' }} />,
    tag: '场景 6',
  },
  {
    key: 'scenario-weighted-buzz',
    label: '加权声量模型（符合条件）',
    icon: <LineChartOutlined style={{ color: '#1677ff' }} />,
    tag: '场景 7',
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
  const isStandardActive = standardMenuItems.some((item) => item.key === activeKey);
  // 默认折叠业务功能模块，聚焦场景闭环演示；若选中的是既有业务模块则自动展开
  const [standardCollapsed, setStandardCollapsed] = useState<boolean>(!isStandardActive);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-menu">
        {/* 1. 核心场景演示分组（顶部归集，高优先级展示） */}
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

        {/* 2. 既有业务功能模块（默认折叠收纳，点击可展开） */}
        {!collapsed && (
          <div
            className="menu-group-header collapsible-group-header"
            onClick={() => setStandardCollapsed(!standardCollapsed)}
            style={{
              marginTop: 14,
              padding: '8px 12px',
              margin: '14px 8px 6px',
              background: '#f8fafc',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              transition: 'all 0.2s ease',
            }}
            title={standardCollapsed ? '点击展开业务功能模块' : '点击收起业务功能模块'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
              <AppstoreOutlined style={{ fontSize: 13, color: isStandardActive ? '#1677ff' : '#94a3b8' }} />
              <span>业务功能模块</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 'normal' }}>
                ({standardMenuItems.length})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {isStandardActive && standardCollapsed && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff', display: 'inline-block' }} />
              )}
              <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                <DownOutlined style={{ transform: standardCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </span>
            </div>
          </div>
        )}

        {/* 展开时展示业务功能列表 */}
        {!collapsed && !standardCollapsed && (
          <div className="standard-menu-items-container">
            {standardMenuItems.map((item) => (
              <div
                key={item.key}
                className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
                onClick={() => onSelect(item.key)}
                style={{ padding: '9px 14px 9px 24px' }}
              >
                <span className="menu-icon" style={{ minWidth: 20, marginRight: 8 }}>{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* 侧边栏极窄折叠模式时的展示 */}
        {collapsed && (
          <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
            <Tooltip placement="right" title={standardCollapsed ? "展开业务功能模块" : "收起业务功能模块"}>
              <div
                className={`menu-item ${isStandardActive ? 'active' : ''}`}
                onClick={() => setStandardCollapsed(!standardCollapsed)}
                style={{ justifyContent: 'center', color: standardCollapsed ? '#94a3b8' : '#1677ff' }}
              >
                <AppstoreOutlined />
              </div>
            </Tooltip>
            {!standardCollapsed && standardMenuItems.map((item) => (
              <Tooltip key={item.key} placement="right" title={item.label}>
                <div
                  className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
                  onClick={() => onSelect(item.key)}
                  style={{ justifyContent: 'center' }}
                >
                  <span className="menu-icon">{item.icon}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
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
