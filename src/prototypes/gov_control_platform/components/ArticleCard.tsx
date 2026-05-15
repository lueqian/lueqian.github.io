import React from 'react';
import { Avatar, Checkbox, Space } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';

export interface ArticleCardProps {
  id: string;
  index: number;
  authorName: string;
  avatarUrl?: string;
  sourceTag: string;
  followers?: string;
  publishTime: string;
  platform: string;
  location?: string;
  content: React.ReactNode;
  ocrHighlight?: React.ReactNode;
  similarCount?: number;
  images?: string[];
  isVideo?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  index,
  authorName,
  avatarUrl,
  sourceTag,
  followers,
  publishTime,
  platform,
  location,
  content,
  ocrHighlight,
  similarCount,
  images,
  isVideo
}) => {
  return (
    <div className="article-card">
      <div className="article-card-left">
        <Checkbox />
        <span className="article-index">{index}</span>
      </div>
      
      <div className="article-card-main">
        {/* Header */}
        <div className="article-header">
          <Space align="center">
            <Avatar size={24} icon={<UserOutlined />} src={avatarUrl} />
            <span className="author-name">{authorName}</span>
            <span className="source-tag">{sourceTag}</span>
          </Space>
          
          <div className="article-meta">
            {followers && <span>粉丝数: {followers}</span>}
            {followers && <span className="meta-divider">|</span>}
            <span>{publishTime}</span>
            <span className="meta-divider">|</span>
            <Space>
              <span>{platform}</span>
              {location && (
                <>
                  <span>{location}</span>
                </>
              )}
            </Space>
          </div>
        </div>

        {/* Content */}
        <div className="article-content-wrapper">
          <div className="article-text">
            {content}
          </div>
          {/* Media Thumbnail */}
          {images && images.length > 0 && (
            <div className="article-media">
              <div className="media-thumbnail">
                <img src={images[0]} alt="thumbnail" />
                {isVideo && <div className="play-icon-overlay">▶</div>}
              </div>
            </div>
          )}
        </div>

        {/* OCR Highlight */}
        {ocrHighlight && (
          <div className="ocr-highlight-section">
            <span className="ocr-label">图片识别：</span>
            <span className="ocr-text">{ocrHighlight}</span>
            <a className="view-all-link">查看全部</a>
          </div>
        )}

        {/* Footer */}
        <div className="article-footer">
          {similarCount && (
            <a className="similar-link">
              相似文章 {similarCount}
            </a>
          )}
          {location && <span className="location-tag">{location}</span>}
        </div>
      </div>

      {/* Hover Actions */}
      <div className="article-hover-actions">
        <a>上报</a>
        <a>复制信息 <DownOutlined style={{ fontSize: 10 }} /></a>
        <a>查看原文</a>
      </div>
    </div>
  );
};

export default ArticleCard;
