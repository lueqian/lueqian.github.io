import React from 'react';
import { Tag } from 'antd';
import {
  BarChartOutlined,
  ClockCircleOutlined,
  FireOutlined,
  PlayCircleOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons';

export interface UnifiedOpinionCardProps {
  id: string;
  seq: number;
  title: string;
  author: string;
  authorAvatar?: React.ReactNode;
  postId: string;
  heat?: number | string;
  platform: string;
  platformIcon?: React.ReactNode;
  time: string;
  content?: string;
  summary: string;
  analysis: string;
  dataSource: string;
  tags: string[];
  rating: number;
  ratingText?: string;
  sentimentIndex: number | string;
  hot?: boolean;
  warningLabel?: React.ReactNode;
  sensitivityLabel?: React.ReactNode;
  hasVideo?: boolean;
  selected?: boolean;
  selectionSlot?: React.ReactNode;
  moreSlot?: React.ReactNode;
  processSlot?: React.ReactNode;
  actions?: React.ReactNode;
  footerBadges?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const renderStars = (rating: number) => (
  <div className="unified-opinion-stars">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= rating ? 'filled' : 'empty'}>
        {star <= rating ? <StarFilled /> : <StarOutlined />}
      </span>
    ))}
  </div>
);

const UnifiedOpinionCard: React.FC<UnifiedOpinionCardProps> = ({
  id,
  seq,
  title,
  author,
  authorAvatar,
  postId,
  heat,
  platform,
  platformIcon,
  time,
  content,
  summary,
  analysis,
  dataSource,
  tags,
  rating,
  ratingText,
  sentimentIndex,
  hot,
  warningLabel,
  sensitivityLabel,
  hasVideo,
  selected,
  selectionSlot,
  moreSlot,
  processSlot,
  actions,
  footerBadges,
  className,
  compact,
}) => {
  const classes = [
    'unified-opinion-card',
    selected ? 'selected' : '',
    compact ? 'compact' : '',
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      <div className="unified-opinion-body">
        <div className="unified-opinion-header">
          <div className="unified-opinion-title-group">
            {selectionSlot}
            <span className="unified-opinion-seq">{seq}</span>
            <h3>{title}</h3>
            {hot && (
              <Tag className="unified-opinion-hot-tag">
                <FireOutlined /> 热敏
              </Tag>
            )}
            {warningLabel && <Tag className="unified-opinion-warning-tag">{warningLabel}</Tag>}
            {sensitivityLabel && <Tag className="unified-opinion-sensitive-tag">{sensitivityLabel}</Tag>}
          </div>
          <div className="unified-opinion-rating">
            {renderStars(rating)}
            <strong>{ratingText || `${rating}星`}</strong>
            {moreSlot}
          </div>
        </div>

        <div className="unified-opinion-meta">
          <span className="unified-opinion-author">
            <span className="unified-opinion-avatar">{authorAvatar || author.charAt(0)}</span>
            <strong>{author}</strong>
          </span>
          <span>ID&nbsp; {postId}</span>
          {heat !== undefined && (
            <span className="unified-opinion-heat">
              <BarChartOutlined /> 热度 {heat}
            </span>
          )}
          <span className="unified-opinion-platform">
            {platformIcon}
            {platform}
          </span>
          <span>
            <ClockCircleOutlined /> {time}
          </span>
        </div>

        {content && <p className="unified-opinion-content">{content}</p>}

        <div className="unified-opinion-analysis-grid">
          <div className="unified-opinion-ai-stack">
            <div className="unified-opinion-ai-row summary">
              <span className="unified-opinion-ai-pill">AI</span>
              <span className="unified-opinion-ai-label">摘要</span>
              <p>{summary}</p>
            </div>

            <div className="unified-opinion-ai-row analysis">
              <span className="unified-opinion-ai-pill">AI</span>
              <span className="unified-opinion-ai-label">研判</span>
              <p>{analysis}</p>
            </div>
          </div>

          <aside className="unified-opinion-index">
            {hasVideo && (
              <div className="unified-opinion-video-preview">
                <PlayCircleOutlined />
              </div>
            )}
            <strong>{sentimentIndex}</strong>
            <span>舆情指数</span>
            <i style={{ width: `${Math.min(Number(sentimentIndex) || 0, 100)}%` }} />
          </aside>
        </div>

        {processSlot && <div className="unified-opinion-process">{processSlot}</div>}

        <div className="unified-opinion-footer">
          <div className="unified-opinion-tags">
            <span>数据来源：</span>
            <Tag className="unified-opinion-source-tag">{dataSource}</Tag>
            {tags.map((tag) => (
              <Tag key={tag} className="unified-opinion-info-tag">{tag}</Tag>
            ))}
            {hasVideo === false && <Tag className="unified-opinion-video-tag">未上传视频</Tag>}
          </div>
          <div className="unified-opinion-actions">
            {footerBadges}
            {actions}
          </div>
        </div>
      </div>
    </article>
  );
};

export default UnifiedOpinionCard;
