import React from 'react';
import { Avatar, Rate, Button, Space, Tag } from 'antd';
import { UserOutlined, ThunderboltOutlined, InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

export interface OpinionCardProps {
  id: string;
  title: string;
  starRating: number;
  author: {
    name: string;
    avatar?: string;
  };
  stats: {
    influence: string;
    location: string;
    platform: string;
    time: string;
  };
  aiSummary: string;
  aiEvaluation: string;
  sentimentIndex: number;
  indexColor: string;
  thumbnail?: string;
  tags: string[];
  status: 'unprocessed' | 'processed';
}

const OpinionCard: React.FC<OpinionCardProps> = ({
  id,
  title,
  starRating,
  author,
  stats,
  aiSummary,
  aiEvaluation,
  sentimentIndex,
  indexColor,
  thumbnail,
  tags,
  status
}) => {
  return (
    <div className="opinion-card">
      <div className="opinion-card-main-content">
        <div className="opinion-card-main">
          {/* Title & Rating */}
          <div className="opinion-title-row">
            <div className="opinion-title">
              {title} <span className="hot-tag">热敏</span>
              <span className="opinion-id">ID {id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Rate disabled defaultValue={starRating} allowHalf style={{ fontSize: 14 }} />
              <span style={{ fontSize: 13, color: '#faad14', fontWeight: 'bold' }}>{starRating}星</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="opinion-meta">
            <Space size={12}>
              <Avatar size={20} icon={<UserOutlined />} src={author.avatar} />
              <span>{author.name}</span>
            </Space>
            <span className="meta-divider">|</span>
            <span>阅读量: {stats.influence}</span>
            <span className="meta-divider">|</span>
            <span>{stats.location}</span>
            <span className="meta-divider">|</span>
            <Space size={4}>
              <ThunderboltOutlined />
              <span>{stats.platform}</span>
            </Space>
            <span className="meta-divider">|</span>
            <span>{stats.time}</span>
          </div>

          {/* AI Summary Block */}
          <div className="ai-block ai-summary-block">
            <div className="ai-tag ai-summary-tag">AI 摘要</div>
            <div className="ai-content">{aiSummary}</div>
          </div>

          {/* AI Evaluation Block */}
          <div className="ai-block ai-eval-block">
            <div className="ai-tag ai-eval-tag">AI 研判</div>
            <div className="ai-content">{aiEvaluation}</div>
          </div>

          {/* Bottom Tags */}
          <div className="opinion-bottom-tags">
            {tags.map((tag, i) => (
              <span key={i} className="source-detail-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right Panel: Index & Media */}
        <div className="opinion-card-right">
          <div className="sentiment-index-box" style={{ background: indexColor, color: '#fff' }}>
            <div className="index-value">{sentimentIndex.toFixed(2)}</div>
            <div className="index-label">舆情指数</div>
          </div>
          {thumbnail && (
            <div className="media-thumb">
              <img src={thumbnail} alt="thumb" />
              <div className="play-icon-overlay" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 4 }}>
                 <PlayCircleOutlined style={{ color: '#fff', fontSize: 20 }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="opinion-footer">
        <span className="status-tag">{status === 'unprocessed' ? '未处置' : '已处置'}</span>
        <div className="action-buttons">
          <Button type="link" size="small" style={{ color: '#1890ff' }}>信息详情</Button>
          <Button 
            type="primary" 
            size="small" 
            icon={<ThunderboltOutlined />}
            style={{ background: '#fff7e6', borderColor: '#ffd591', color: '#fa8c16' }}
          >
            AI 辅助研判
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpinionCard;
