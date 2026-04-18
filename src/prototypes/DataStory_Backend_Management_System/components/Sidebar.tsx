import React, { useState } from 'react';
import {
  AppstoreOutlined,
  SafetyOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  CloudOutlined,
  UserOutlined,
  BankOutlined,
  AlertOutlined,
  FileTextOutlined,
  SettingOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    key: 'product-management',
    label: '产品管理',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'permission-settings',
    label: '权限设置',
    icon: <SafetyOutlined />,
    children: [
      { key: 'role-permission', label: '角色权限管理', icon: <TeamOutlined /> },
    ],
  },
  {
    key: 'blue-eagle-customer',
    label: '蓝鹰客户管理',
    icon: <CustomerServiceOutlined />,
    children: [
      { key: 'customer-list', label: '客户列表', icon: <UserOutlined /> },
      { key: 'external-user', label: '外部用户', icon: <UserOutlined /> },
      { key: 'industry-settings', label: '行业设置', icon: <SettingOutlined /> },
      { key: 'warning-platform-config', label: '预警平台配置', icon: <AlertOutlined /> },
      { key: 'external-wechat', label: '外部微信管理', icon: <CloudOutlined /> },
    ],
  },
  {
    key: 'smart-outbound',
    label: '智能外呼客户管理',
    icon: <CustomerServiceOutlined />,
  },
  {
    key: 'dayu-customer',
    label: '大禹客户管理',
    icon: <CloudOutlined />,
  },
  {
    key: 'internal-user',
    label: '内部用户管理',
    icon: <TeamOutlined />,
  },
  {
    key: 'cultural-tourism',
    label: '文旅后台管理',
    icon: <BankOutlined />,
    children: [
      { key: 'tourism-customer-list', label: '客户列表', icon: <UserOutlined /> },
      { key: 'organization-management', label: '组织机构管理', icon: <BankOutlined /> },
      { key: 'risk-model', label: '风险模型', icon: <ExperimentOutlined /> },
      { key: 'media-list', label: '媒体清单', icon: <FileTextOutlined /> },
      { key: 'operation-log', label: '操作日志', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'warning-center',
    label: '预警中心',
    icon: <AlertOutlined />,
  },
];

interface SidebarProps {
  collapsed: boolean;
  activeKey: string;
  onMenuClick: (key: string, label: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, activeKey, onMenuClick }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['blue-eagle-customer']);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeKey === item.key;
    const isExpanded = expandedKeys.includes(item.key);

    if (hasChildren) {
      return (
        <div key={item.key}>
          <div
            className={`menu-item ${isActive ? 'active' : ''}`}
            onClick={() => toggleExpand(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className={`menu-arrow ${isExpanded ? 'expanded' : ''}`}>▶</span>
          </div>
          <div
            className="sub-menu"
            style={{
              maxHeight: isExpanded ? `${item.children!.length * 40}px` : '0px',
            }}
          >
            {item.children!.map((child) => renderMenuItem(child))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.key}
        className={`menu-item ${isActive ? 'active' : ''}`}
        onClick={() => onMenuClick(item.key, item.label)}
      >
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-label">{item.label}</span>
      </div>
    );
  };

  return (
    <div className={`antigravity-sider ${collapsed ? 'collapsed' : ''}`}>
      <div className="sider-logo">
        <div className="logo-icon">数</div>
        <span className="logo-text">数源智汇舆情管理系统</span>
      </div>
      <div className="sider-menu">{menuConfig.map(renderMenuItem)}</div>
    </div>
  );
};

export default Sidebar;
