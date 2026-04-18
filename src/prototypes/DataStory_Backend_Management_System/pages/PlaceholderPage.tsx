import React from 'react';
import {
  AppstoreOutlined,
} from '@ant-design/icons';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        <AppstoreOutlined />
      </div>
      <div className="placeholder-title">{title}</div>
      <div className="placeholder-desc">该模块正在建设中，敬请期待...</div>
    </div>
  );
};

export default PlaceholderPage;
