import React from 'react';
import { Card, Empty } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const Toolbox: React.FC = () => {
  return (
    <div className="placeholder-page">
      <Card className="placeholder-card" bordered={false}>
        <Empty
          image={<ToolOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
          description={
            <div className="placeholder-content">
              <h3>工具箱</h3>
              <p>子页面暂未开发</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default Toolbox;
