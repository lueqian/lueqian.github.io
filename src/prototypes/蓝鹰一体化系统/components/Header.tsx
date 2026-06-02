import React, { useState } from 'react';
import {
  SearchOutlined,
  ReloadOutlined,
  BellOutlined,
  LogoutOutlined,
  EditOutlined,
  ScheduleOutlined,
  UserSwitchOutlined,
  SafetyCertificateOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Input, Badge, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const userMenuItems: MenuProps['items'] = [
    { key: 'password', label: '修改密码', icon: <EditOutlined /> },
    { key: 'duty', label: '值班表', icon: <ScheduleOutlined /> },
    { key: 'position', label: '岗位', icon: <UserSwitchOutlined /> },
    { key: 'duty-post', label: '值班岗', icon: <SafetyCertificateOutlined /> },
  ];

  return (
    <header className="system-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">🦅</span>
          <span className="logo-text">智控平台</span>
        </div>
        <div className="header-actions">
          <Button type="text" icon={<EditOutlined />} className="action-btn">
            手工上报
          </Button>
          <Button type="text" icon={<SafetyCertificateOutlined />} className="action-btn">
            快捷指令
          </Button>
        </div>
      </div>
      <div className="header-right">
        <div className="search-box">
          <SearchOutlined />
          <Input
            placeholder="搜索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            bordered={false}
          />
        </div>
        <div className="header-divider" />
        <span className="welcome-text">欢迎 东莞公安局超管</span>
        <Button type="link" className="header-link">修改密码</Button>
        <Button type="link" className="header-link">值班表</Button>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="link" className="header-link">
            岗位 <DownOutlined style={{ fontSize: 10 }} />
          </Button>
        </Dropdown>
        <Button type="link" className="header-link">值班岗</Button>
        <div className="header-icons">
          <Badge count={38} size="small" offset={[-2, 2]}>
            <Button type="text" icon={<BellOutlined />} className="icon-btn" />
          </Badge>
          <Button type="text" icon={<ReloadOutlined />} className="icon-btn" />
          <Button type="text" icon={<LogoutOutlined />} className="icon-btn" />
        </div>
      </div>
    </header>
  );
};

export default Header;
