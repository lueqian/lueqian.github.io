import React from 'react';
import { 
  Input, 
  Button, 
  Badge, 
  Tooltip, 
  Space,
  Dropdown
} from 'antd';
import { 
  SearchOutlined, 
  RollbackOutlined, 
  BgColorsOutlined, 
  BellOutlined, 
  LogoutOutlined,
  FormOutlined,
  ThunderboltOutlined,
  DownOutlined
} from '@ant-design/icons';

const Header: React.FC = () => {
  return (
    <header className="gov-header">
      <div className="header-left">
        <div className="logo-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8" />
            <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" opacity="0.6" />
          </svg>
          智控平台
        </div>
        <div className="header-actions">
          <Button type="text" icon={<FormOutlined />} size="small">手工上报</Button>
          <Button type="text" icon={<ThunderboltOutlined />} size="small">快捷指令</Button>
        </div>
      </div>

      <div className="header-right">
        <div className="search-container">
          <Input 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
            placeholder="请输入关键词搜索" 
            bordered={false}
            style={{ width: 240 }}
            addonBefore={
              <span style={{ fontSize: 12, cursor: 'pointer', paddingRight: 8 }}>全网</span>
            }
          />
        </div>
        
        <Tooltip title="返回导航页">
          <Button type="text" icon={<RollbackOutlined />} />
        </Tooltip>

        <div className="user-info">
          <span>欢迎，总队测试1 回</span>
          <div className="user-links">
            <span>修改密码</span>
            <span>值班表</span>
            <Dropdown menu={{ items: [{ key: '1', label: '材料汇编岗' }, { key: '2', label: '审核研判岗' }] }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                岗位：材料汇编岗... <DownOutlined style={{ fontSize: 10 }} />
              </span>
            </Dropdown>
          </div>
        </div>

        <Space size={16}>
          <Tooltip title="系统背景切换">
            <BgColorsOutlined style={{ fontSize: 18, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }} />
          </Tooltip>
          <Badge count={8} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }} />
          </Badge>
          <Tooltip title="退出登录">
            <LogoutOutlined style={{ fontSize: 18, cursor: 'pointer', color: 'rgba(0,0,0,0.65)' }} />
          </Tooltip>
        </Space>
      </div>
    </header>
  );
};

export default Header;
