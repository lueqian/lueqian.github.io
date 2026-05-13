import React from 'react';
import { Radio, Select, Button, Space } from 'antd';
import { FileProtectOutlined, CarryOutOutlined } from '@ant-design/icons';

const SourceControl: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* 顶部筛选区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 20px', borderRadius: '4px' }}>
        <Space size={16}>
          <Radio.Group defaultValue="today" buttonStyle="solid" size="small">
            <Radio.Button value="today">今日</Radio.Button>
            <Radio.Button value="month">当月</Radio.Button>
            <Radio.Button value="stats">增减统计</Radio.Button>
          </Radio.Group>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>日历归集：</span>
            <Select placeholder="请选择" style={{ width: 160 }} size="small" />
          </div>
        </Space>
        <Space>
          <Button icon={<FileProtectOutlined />} type="primary" size="small" style={{ background: '#5c7cff' }}>敏感时间/事件节点设置</Button>
          <Button icon={<CarryOutOutlined />} type="primary" size="small" style={{ background: '#3b5998' }}>任务布控</Button>
        </Space>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* 数据概览 */}
        <div className="stat-card-container" style={{ flex: 3 }}>
          <div className="section-title">数据概览</div>
          <div className="stat-card-group">
            {[
              { label: '今日任务', value: 0 },
              { label: '重大实体事件跟踪', value: 0 },
              { label: '重点账号动态跟踪', value: 0 },
              { label: '重点阵地实时盯控', value: 0 },
              { label: '舆情专项专班', value: 0 },
              { label: '工作要求', value: 0 },
              { label: '安保任务', value: 0 },
            ].map(item => (
              <div key={item.label} className="stat-item">
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 敏感时间/事件节点 */}
        <div className="event-nodes-container" style={{ flex: 1.5 }}>
          <div className="section-title warning">敏感时间/事件节点</div>
          <div className="event-nodes-list">
            <div className="event-node">
              <div className="node-label">节点1</div>
              <div className="node-value">JW</div>
            </div>
            <div className="event-node" style={{ background: '#fff7e6', borderColor: '#ffd591' }}>
              <div className="node-label">节点2</div>
              <div className="node-value" style={{ color: '#d46b08' }}>5.13 (FL...</div>
            </div>
            <div className="event-node" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <div className="node-label">节点3</div>
              <div className="node-value" style={{ color: '#389e0d' }}>川普访华</div>
            </div>
          </div>
        </div>
      </div>

      {/* 工作区 - 暂未开发占位 */}
      <div className="empty-state">
        <div style={{ textAlign: 'center' }}>
          <img src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" alt="empty" style={{ width: 120, marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.25)' }}>请创建管控任务!</p>
        </div>
      </div>
    </div>
  );
};

export default SourceControl;
