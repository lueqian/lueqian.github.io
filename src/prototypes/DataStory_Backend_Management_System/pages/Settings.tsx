import React from 'react';
import {
  SettingOutlined,
} from '@ant-design/icons';

const Settings: React.FC = () => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <SettingOutlined />
      </div>
      <div className="placeholder-title">系统设置</div>
      <div className="placeholder-desc">系统参数配置与管理模块，建设中...</div>
    </div>
  );
};

export default Settings;
