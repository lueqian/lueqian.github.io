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
} from '@ant-design/icons';

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
}

const menuItems: MenuItem[] = [
  { key: 'source-control', label: '源头防控', icon: <SafetyOutlined /> },
  { key: 'monitor-warning', label: '监测预警', icon: <RadarChartOutlined /> },
  { key: 'emergency-response', label: '应急处置', icon: <FileTextOutlined /> },
  { key: 'review-summary', label: '复盘总结', icon: <OrderedListOutlined /> },
  { key: 'personnel-library', label: '人员库', icon: <TeamOutlined /> },
  { key: 'toolbox', label: '工具箱', icon: <ToolOutlined /> },
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
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
            onClick={() => onSelect(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            {!collapsed && <span className="menu-label">{item.label}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div
          className="collapse-btn"
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && <span>显示菜单</span>}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
