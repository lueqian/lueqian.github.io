import React from 'react';
import { Card, Empty } from 'antd';
import { OrderedListOutlined } from '@ant-design/icons';

const ReviewSummary: React.FC = () => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card" bordered={false}>
        <Empty
          image={<OrderedListOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <div className="placeholder-content">
              <h3>复盘总结</h3>
              <p>子页面暂未开发</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default ReviewSummary;
