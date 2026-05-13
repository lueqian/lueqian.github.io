import React from 'react';
import { Result } from 'antd';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '4px' }}>
      <Result
        status="info"
        title={`“${title}” 功能开发中`}
        subTitle="敬请期待后续逐步完善的功能内容。"
      />
    </div>
  );
};

export default Placeholder;
