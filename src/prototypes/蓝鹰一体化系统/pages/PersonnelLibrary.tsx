import React from 'react';
import { Card, Empty } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const PersonnelLibrary: React.FC = () => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card" bordered={false}>
        <Empty
          image={<TeamOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <div className="placeholder-content">
              <h3>人员库</h3>
              <p>子页面暂未开发</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default PersonnelLibrary;
