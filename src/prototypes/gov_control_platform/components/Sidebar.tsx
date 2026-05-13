import React from 'react';
import {
  SafetyCertificateOutlined,
  RadarChartOutlined,
  AlertOutlined,
  ReconciliationOutlined,
  ToolOutlined
} from '@ant-design/icons';

interface SidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeKey, onSelect }) => {
  const menuItems = [
    { key: 'source', label: '源头防控', icon: <SafetyCertificateOutlined /> },
    { key: 'monitor', label: '监测预警', icon: <RadarChartOutlined /> },
    { key: 'emergency', label: '应急处置', icon: <AlertOutlined /> },
    { key: 'review', label: '复盘总结', icon: <ReconciliationOutlined /> },
    { key: 'toolbox', label: '工具箱', icon: <ToolOutlined /> },
  ];

  return (
    <aside className="gov-sidebar">
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <div 
            key={item.key} 
            className={`menu-item ${activeKey === item.key ? 'active' : ''}`}
            onClick={() => onSelect(item.key)}
          >
            <span className="menu-item-icon">{item.icon}</span>
            <span className="menu-item-label">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
