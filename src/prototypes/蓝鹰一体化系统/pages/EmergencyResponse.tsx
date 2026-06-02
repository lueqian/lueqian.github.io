import React from 'react';
import { Card, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const EmergencyResponse: React.FC = () => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card" bordered={false}>
        <Empty
          image={<FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <div className="placeholder-content">
              <h3>应急处置</h3>
              <p>子页面暂未开发</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default EmergencyResponse;
