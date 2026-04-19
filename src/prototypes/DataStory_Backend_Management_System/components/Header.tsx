import React, { useState, useRef, useEffect } from 'react';
import {
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import { BreadcrumbItem } from '../index';

interface HeaderProps {
  collapsed: boolean;
  onToggleSider: () => void;
  breadcrumb: BreadcrumbItem[];
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggleSider, breadcrumb }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="antigravity-header">
      <div className="header-left">
        <div className="header-trigger" onClick={onToggleSider}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div className="header-breadcrumb">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {index === breadcrumb.length - 1 ? (
                <span className="breadcrumb-current">{item.label}</span>
              ) : (
                <span>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="header-right">
        <div className="header-action" title="消息通知">
          <BellOutlined />
          <span className="notification-badge" />
        </div>
        <div className="header-action" title="全屏切换" onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </div>

        <div className="header-user" ref={dropdownRef} onClick={() => setShowUserDropdown(!showUserDropdown)}>
          <div className="user-avatar">
            <UserOutlined />
          </div>
          <span className="user-name">管理员</span>

          {showUserDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <UserOutlined />
                <span>个人中心</span>
              </div>
              <div className="dropdown-item">
                <SettingOutlined />
                <span>系统设置</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item danger">
                <LogoutOutlined />
                <span>退出登录</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
