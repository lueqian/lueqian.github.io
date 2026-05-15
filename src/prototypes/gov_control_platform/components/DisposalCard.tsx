import React from 'react';
import { Button, Tag, Space, Rate } from 'antd';
import { ThunderboltOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

export interface DisposalCardProps {
  id: string;
  title: string;
  source: string;
  time: string;
  starRating: number;
  aiSummary: string;
  aiEvaluation: string;
  analysisTags: string[];
  taskTags: string[];
  sla: {
    nature: string;
    status: 'overdue' | 'pending' | 'completed';
    countdown: string;
    dispatcher: string;
    dispatchTime: string;
  };
  sentimentIndex: number;
}

const DisposalCard: React.FC<DisposalCardProps> = ({
  id,
  title,
  source,
  time,
  starRating,
  aiSummary,
  aiEvaluation,
  analysisTags,
  taskTags,
  sla,
  sentimentIndex
}) => {
  return (
    <div className="disposal-card">
      <div className="disposal-card-header">
        <div className="disposal-card-title">
          {title}
          <div style={{ marginTop: 8 }}>
            <Space size={8}>
              <span className="opinion-id">ID {id}</span>
              <ThunderboltOutlined style={{ color: '#faad14' }} />
              <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>{source} | {time}</span>
            </Space>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
           <Space>
             <Tag color="orange">非热敏</Tag>
             <Tag color="blue">已处置</Tag>
             <div style={{ marginLeft: 16 }}>
                <Rate disabled defaultValue={starRating} allowHalf style={{ fontSize: 12 }} />
                <span style={{ fontSize: 12, color: '#faad14', marginLeft: 4 }}>{starRating}星</span>
             </div>
           </Space>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="ai-block ai-summary-block">
            <div className="ai-tag ai-summary-tag">AI 摘要</div>
            <div className="ai-content">{aiSummary}</div>
          </div>

          <div className="ai-block ai-eval-block" style={{ marginBottom: 0 }}>
            <div className="ai-tag ai-eval-tag">AI 研判</div>
            <div className="ai-content">{aiEvaluation}</div>
          </div>
        </div>

        <div style={{ width: 100, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ background: '#f0f2ff', padding: '16px 8px', borderRadius: 4, width: '100%', textAlign: 'center', border: '1px solid #e6ebff' }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#5c7cff' }}>{sentimentIndex.toFixed(2)}</div>
              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 4 }}>舆情指数</div>
           </div>
        </div>
      </div>

      <div className="workflow-area">
        <div className="workflow-tags">
          {analysisTags.map((tag, i) => (
            <span key={i} className="analysis-tag">{tag}</span>
          ))}
          {taskTags.map((tag, i) => (
            <span key={i} className="task-tag">{tag}</span>
          ))}
        </div>

        <div className="sla-monitor">
          <div className="sla-left">
            <span className="sla-nature-tag">{sla.nature}</span>
            <span className="sla-status-tag">{sla.status === 'overdue' ? '已超时' : '进行中'}</span>
            <div className="sla-countdown">
              <ClockCircleOutlined />
              <span>剩余 {sla.countdown}</span>
            </div>
          </div>
          <div className="sla-right">
            下发人：{sla.dispatcher} | 下发时间：{sla.dispatchTime}
          </div>
        </div>
      </div>

      <div className="disposal-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           <Tag color="blue">重庆市</Tag>
        </div>
        <div className="action-buttons-group">
          <Button size="small" type="primary">签收</Button>
          <Button size="small" className="btn-feedback">反馈</Button>
          <Button size="small" className="btn-private-net">请在专网反馈！</Button>
        </div>
      </div>

    </div>
  );
};

export default DisposalCard;
