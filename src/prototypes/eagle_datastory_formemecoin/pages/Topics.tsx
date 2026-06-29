/**
 * @name 全网专题 (Topics)
 * @description 从 network-topic 原型迁移的纯内容区页面组件
 *
 * 迁移说明：
 * - 移除侧边栏 (nt-sidebar)、顶部导航 (nt-header)、外层布局 (nt-layout, nt-main)
 * - 移除 ConfigProvider 包裹
 * - 移除 MENU_ITEMS、SIDEBAR_BG、HEADER_BG 等布局常量
 * - 移除 selectedMenu、sidebarCollapsed 等布局相关状态
 * - 移除 forwardRef / useImperativeHandle / AxureHandle
 * - 保留所有专题相关状态、文章渲染、专题树、分页逻辑
 * - 保留所有 mock 数据 (ARTICLES, TOPIC_GROUPS, PLATFORM_TABS, SENTIMENT_OPTIONS)
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Checkbox, Tooltip, Dropdown, Input } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
  FilterOutlined,
  TagsOutlined,
  DownOutlined,
  RightOutlined,
  LeftOutlined,
  PlayCircleOutlined,
  FileSearchOutlined,
  EyeOutlined,
  StarFilled,
  SendOutlined,
  CopyOutlined,
  LinkOutlined,
  MoreOutlined,
  FileTextOutlined,
  ExportOutlined,
  BellOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  WeiboOutlined,
  VideoCameraOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
import CollectTaskDrawer from '../components/CollectTaskDrawer';

// ============ 平台筛选数据 ============

type PlatformTab = {
  key: string;
  label: string;
  count: number;
  icon?: React.ReactNode;
};

const PLATFORM_TABS: PlatformTab[] = [
  { key: 'all', label: '全部', count: 294 },
  { key: 'weibo', label: '微博', count: 69, icon: <WeiboOutlined /> },
  { key: 'douyin', label: '抖音', count: 44, icon: <VideoCameraOutlined /> },
  { key: 'toutiao', label: '今日头条', count: 82 },
  { key: 'xiaohongshu', label: '小红书', count: 3 },
  { key: 'other_video', label: '其他短视频', count: 1 },
];

// ============ 情感筛选 ============

type SentimentOption = {
  key: string | null;
  label: string;
};

const SENTIMENT_OPTIONS: SentimentOption[] = [
  { key: 'positive', label: '正面' },
  { key: 'neutral', label: '中性' },
  { key: 'negative', label: '负面' },
];

// ============ 文章数据 ============

type SentimentType = 'positive' | 'neutral' | 'negative';

type ArticleData = {
  id: string;
  rank: number;
  username: string;
  badge: string;
  fans?: string;
  time: string;
  platform: string;
  location?: string;
  tags: string[];
  title?: string;
  content?: string;
  duplicate: string;
  engagement?: string;
  hasVideo?: boolean;
  hasImage?: boolean;
  aiBanner?: string;
  sentiment?: SentimentType;
};

const ARTICLES: ArticleData[] = [
  {
    id: '1',
    rank: 1,
    username: '用心生活',
    badge: '原创',
    fans: '粉丝数: 3',
    time: '2026-04-01 18:02:11',
    platform: '今日头条',
    location: '河南省, 河南省',
    tags: ['张杰', '谢娜', '塌房'],
    title: '偷鸡不成蚀把米？张杰谢娜彻底塌房，多方曝光后，刘烨预言有人信',
    duplicate: '相同文章 45',
    hasVideo: true,
    sentiment: 'negative',
  },
  {
    id: '2',
    rank: 2,
    username: '用心生活',
    badge: '原创',
    time: '2026-04-01 18:01:30',
    platform: '懂车帝',
    location: '河南省, 河南省',
    tags: ['张杰', '谢娜', '塌房'],
    title: '偷鸡不成蚀把米？张杰谢娜彻底塌房，多方曝光后，刘烨预言有人信',
    duplicate: '相同文章 45',
    hasImage: true,
    sentiment: 'negative',
  },
  {
    id: '3',
    rank: 3,
    username: '用户8405496717',
    badge: '原创',
    fans: '粉丝数: 2',
    time: '2026-04-01 17:58:17',
    platform: '微博',
    location: '四川省, 四川省',
    tags: ['重婚', '薛之谦'],
    content: '@薛之谦 薛之谦重婚王重婚王重婚王...',
    duplicate: '相同文章 0',
    engagement: '👍 1',
    sentiment: 'neutral',
  },
  {
    id: '4',
    rank: 4,
    username: '恬情',
    badge: '原创',
    time: '2026-04-01 17:57:22',
    platform: '抖音app',
    tags: ['张杰', '出轨'],
    content: '念念不忘，必有回响。#马晓迪 #张杰未live曜北斗巡回演唱会 #张杰 #演唱会现场 #张杰成都演唱会',
    hasVideo: true,
    duplicate: '相同文章 0',
    aiBanner: '封面帧识别: 2万 17,144 34,237,184 统帅4 常规活动行军 4/4 未驻防 [KFC]联盟旗帜采集... 查看全部',
    sentiment: 'positive',
  },
];

// ============ 专题列表数据 ============

type TopicGroup = {
  key: string;
  label: string;
  children?: TopicChild[];
};

type TopicChild = {
  key: string;
  label: string;
};

const TOPIC_GROUPS: TopicGroup[] = [
  {
    key: 'trend',
    label: '舆情热度趋势图',
    children: [{ key: 'fangshan', label: '房山' }],
  },
  {
    key: 'liyutong',
    label: '李雨桐实名举报薛...',
    children: [
      { key: 'warning', label: '1 舆情预警' },
      { key: 'uncategorized', label: '未分类' },
    ],
  },
];

// ============ 辅助函数：高亮关键词 ============

function highlightKeywords(text: string, keywords: string[]): React.ReactNode[] {
  if (!keywords || keywords.length === 0) return [text];

  // 按关键词长度降序排列，避免短词先匹配导致长词被截断
  const sorted = [...keywords].sort(function (a, b) { return b.length - a.length; });
  const pattern = sorted.map(function (k) {
    return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|');

  const regex = new RegExp('(' + pattern + ')', 'g');
  const parts = text.split(regex);

  return parts.map(function (part, idx) {
    if (sorted.indexOf(part) !== -1) {
      return (
        <span key={idx} className="nt-keyword-highlight">
          {part}
        </span>
      );
    }
    return part;
  });
}

// ============ 情感图标渲染 ============

function renderSentimentIcon(sentiment?: SentimentType) {
  switch (sentiment) {
    case 'negative':
      return (
        <div className="nt-sentiment-icon nt-sentiment-icon--negative">
          <FrownOutlined />
        </div>
      );
    case 'positive':
      return (
        <div className="nt-sentiment-icon nt-sentiment-icon--positive">
          <SmileOutlined />
        </div>
      );
    case 'neutral':
      return (
        <div className="nt-sentiment-icon nt-sentiment-icon--neutral">
          <MehOutlined />
        </div>
      );
    default:
      return null;
  }
}

// ============ 主组件 ============

const Topics: React.FC = function () {
  // ============ 状态 ============
  const [activePlatform, setActivePlatform] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('list');
  const [activeSentiment, setActiveSentiment] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [topicPanelVisible, setTopicPanelVisible] = useState<boolean>(true);
  const [topicSearchValue, setTopicSearchValue] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['liyutong']));
  const [activeTopic, setActiveTopic] = useState<string>('liyutong');
  const [collectDrawerOpen, setCollectDrawerOpen] = useState(false);
  const [collectInitialValues, setCollectInitialValues] = useState<any>(null);

  // ============ 回调 ============

  // 获取当前专题名称
  var activeTopicLabel = '李雨桐实名举报薛之谦重婚罪';
  TOPIC_GROUPS.forEach(function (group) {
    if (group.key === activeTopic) { activeTopicLabel = group.label; }
    if (group.children) {
      group.children.forEach(function (child) {
        if (child.key === activeTopic) { activeTopicLabel = child.label; }
      });
    }
  });

  const handleCreateCollectTask = useCallback(function () {
    setCollectInitialValues({
      scope_type: 'topic' as const,
      related_topic: activeTopic,
    });
    setCollectDrawerOpen(true);
  }, [activeTopic]);
  const handlePlatformFilter = useCallback(function (key: string) {
    setActivePlatform(key);
  }, []);

  const handleSentimentFilter = useCallback(function (key: string | null) {
    setActiveSentiment(key);
  }, []);

  const handleViewSwitch = useCallback(function (view: string) {
    setActiveView(view);
  }, []);

  const handlePageChange = useCallback(function (page: number) {
    setCurrentPage(page);
  }, []);

  const handleArticleClick = useCallback(function (_articleId: string) {
    // 文章点击处理
  }, []);

  const handleGenerateReport = useCallback(function () {
    // 生成报告处理
  }, []);

  const handleCreateTopic = useCallback(function () {
    // 创建专题处理
  }, []);

  const handleTopicSelect = useCallback(function (topicKey: string) {
    setActiveTopic(topicKey);
  }, []);

  const toggleGroup = useCallback(function (groupKey: string) {
    setExpandedGroups(function (prev) {
      var next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }, []);

  // ============ 渲染文章卡片 ============
  function renderArticleCard(article: ArticleData) {
    return (
      <div key={article.id} className="nt-article-card">
        {/* 左侧：排名 + 情感图标 */}
        <div className="nt-article-left-col">
          <div className="nt-article-rank">{article.rank}</div>
          {renderSentimentIcon(article.sentiment)}
        </div>

        {/* 中间内容区 */}
        <div className="nt-article-body">
          {/* 第一行：头像 + 昵称 + 原创标签 */}
          <div className="nt-article-meta-row1">
            <div className="nt-article-avatar">
              <UserOutlined style={{ fontSize: 12 }} />
            </div>
            <span className="nt-article-username">{article.username}</span>
            <span className="nt-article-badge nt-article-badge--original">{article.badge}</span>
          </div>

          {/* 第二行：粉丝数 + 时间 + 平台 + 地域 + 红色关键词标签 */}
          <div className="nt-article-meta-row2">
            {article.fans && <span className="nt-article-meta-item">{article.fans}</span>}
            <span className="nt-article-meta-item">{article.time}</span>
            <span className="nt-article-platform">
              {article.platform === '微博' && <WeiboOutlined style={{ fontSize: 12 }} />}
              {(article.platform === '抖音app' || article.platform === '抖音') && <VideoCameraOutlined style={{ fontSize: 12 }} />}
              {article.platform}
            </span>
            <span className="nt-article-meta-item">{article.location}</span>
            {/* 红色关键词标签 */}
            {article.tags.map(function (tag) {
              return (
                <span key={tag} className="nt-article-kw-tag">{tag}</span>
              );
            })}
          </div>

          {/* 标题 - 关键词内联高亮 */}
          {article.title && (
            <div
              className="nt-article-title"
              onClick={function () {
                handleArticleClick(article.id);
              }}
            >
              {highlightKeywords(article.title, article.tags)}
            </div>
          )}

          {/* 内容 - 关键词内联高亮 */}
          {article.content && (
            <div className="nt-article-content">
              {highlightKeywords(article.content, article.tags)}
            </div>
          )}

          {/* 互动数据 */}
          {article.engagement && (
            <div className="nt-article-engagement">{article.engagement}</div>
          )}

          {/* AI识别横幅 - 位于正文下方、相似文章上方 */}
          {article.aiBanner && (
            <div className="nt-article-ai-banner">
              {article.aiBanner.split('查看全部')[0]}
              <span className="nt-article-ai-banner-link">查看全部</span>
            </div>
          )}

          {/* 相似文章链接 - 正文下方左对齐 */}
          <div className="nt-article-footer">
            <span className="nt-article-duplicate">{article.duplicate}</span>
          </div>
        </div>

        {/* 右侧栏：操作按钮(上) + 媒体缩略图(下) */}
        <div className="nt-article-right-col">
          {/* 操作按钮 - 右上角纯文字链接 */}
          <div className="nt-article-actions">
            <a className="nt-article-action-link" onClick={function () { handleArticleClick(article.id); }}>
              <FileSearchOutlined style={{ marginRight: 3 }} />
              一键搜索
            </a>
            <a className="nt-article-action-link">
              <EyeOutlined style={{ marginRight: 3 }} />
              标记监测
            </a>
            <a className="nt-article-action-link">
              <StarFilled style={{ marginRight: 3 }} />
              收藏
            </a>
            <a className="nt-article-action-link">
              <SendOutlined style={{ marginRight: 3 }} />
              推送文章
            </a>
            <a className="nt-article-action-link">
              <CopyOutlined style={{ marginRight: 3 }} />
              复制信息
            </a>
            <a className="nt-article-action-link">
              <LinkOutlined style={{ marginRight: 3 }} />
              查看原文
            </a>
            <a className="nt-article-action-link" onClick={function (e) { e.preventDefault(); handleCreateCollectTask(); }}>
              <CloudSyncOutlined style={{ marginRight: 3 }} />
              创建采集任务
            </a>
            <a className="nt-article-action-link">
              <MoreOutlined />
            </a>
          </div>

          {/* 媒体缩略图 - 右下角 */}
          {(article.hasVideo || article.hasImage) && (
            <div className="nt-article-media">
              {article.hasVideo && (
                <div className="nt-article-media-play">
                  <PlayCircleOutlined />
                </div>
              )}
              {!article.hasVideo && article.hasImage && (
                <FileTextOutlined className="nt-article-media-placeholder" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============ 渲染专题树 ============
  function renderTopicTree() {
    return TOPIC_GROUPS.map(function (group) {
      var isExpanded = expandedGroups.has(group.key);
      var isActive = activeTopic === group.key;
      return (
        <div key={group.key} className="nt-topic-group">
          {/* 分组头部 */}
          <div className="nt-topic-group-header" onClick={function () { toggleGroup(group.key); }}>
            <RightOutlined
              className={'nt-topic-group-arrow' + (isExpanded ? ' nt-topic-group-arrow--expanded' : '')}
            />
            <span className="nt-topic-group-label">{group.label}</span>
            {isActive && (
              <div className="nt-topic-group-actions" style={{ opacity: 1 }}>
                <div className="nt-topic-group-action">
                  <BellOutlined />
                </div>
                <div className="nt-topic-group-action">
                  <UserOutlined />
                </div>
                <div className="nt-topic-group-action">
                  <PlusOutlined />
                </div>
                <div className="nt-topic-group-action" style={{ fontSize: 11, width: 'auto', padding: '0 4px' }}>
                  更多
                </div>
              </div>
            )}
          </div>

          {/* 子项 */}
          {isExpanded && group.children && (
            <div className="nt-topic-group-children">
              {group.children.map(function (child) {
                var isChildActive = activeTopic === group.key;
                return (
                  <div
                    key={child.key}
                    className={'nt-topic-item' + (isChildActive ? ' nt-topic-item--active' : '')}
                    onClick={function () {
                      handleTopicSelect(child.key);
                    }}
                  >
                    <span className="nt-topic-item-label">{child.label}</span>
                    {/* 选中项右侧保留"更多"操作按钮 */}
                    {isChildActive && (
                      <div className="nt-topic-item-actions" style={{ opacity: 1 }}>
                        <div className="nt-topic-item-action">
                          <MoreOutlined />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  }

  // ============ 分页按钮 ============
  function renderPagination() {
    var pages = [1, 2, 3, 4, 5, 6];
    return (
      <div className="nt-pagination-right">
        {pages.map(function (p) {
          return (
            <div
              key={p}
              className={'nt-page-btn' + (currentPage === p ? ' nt-page-btn--active' : '')}
              onClick={function () {
                handlePageChange(p);
              }}
            >
              {p}
            </div>
          );
        })}
        <div className="nt-page-ellipsis">...</div>
        <div
          className={'nt-page-btn' + (currentPage === 15 ? ' nt-page-btn--active' : '')}
          onClick={function () {
            handlePageChange(15);
          }}
        >
          15
        </div>
      </div>
    );
  }

  return (
    <div className="nt-content">
      {/* 主内容区 */}
      <div className="nt-content-main">
        {/* 专题标题栏 */}
        <div className="nt-topic-header">
          <div className="nt-topic-header-left">
            <span className="nt-topic-title">李雨桐实名举报薛之谦重婚罪</span>
            <span className="nt-topic-date">2026-03-31 23:59:59 ~ 2026-04-01 23:59:59</span>
          </div>
          <button
            className="nt-topic-header-btn"
            onClick={handleGenerateReport}
          >
            <FileTextOutlined style={{ marginRight: 4 }} />
            生成专项分析报告
          </button>
        </div>

        {/* 筛选工具栏 */}
        <div className="nt-toolbar">
          {/* 第一行：视图标签 + 情感筛选 */}
          <div className="nt-toolbar-row">
            <div className="nt-view-tabs">
              <div
                className={'nt-view-tab' + (activeView === 'list' ? ' nt-view-tab--active' : '')}
                onClick={function () {
                  handleViewSwitch('list');
                }}
              >
                文章列表
              </div>
              <div
                className={'nt-view-tab' + (activeView === 'analysis' ? ' nt-view-tab--active' : '')}
                onClick={function () {
                  handleViewSwitch('analysis');
                }}
              >
                快速分析
              </div>
            </div>

            {SENTIMENT_OPTIONS.map(function (opt) {
              var isActive = activeSentiment === opt.key;
              return (
                <button
                  key={opt.key || 'all'}
                  className={'nt-sentiment-btn' + (isActive ? ' nt-sentiment-btn--active' : '')}
                  onClick={function () {
                    handleSentimentFilter(isActive ? null : opt.key);
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* 第二行：平台筛选 */}
          <div className="nt-toolbar-row">
            {PLATFORM_TABS.map(function (tab) {
              var isActive = activePlatform === tab.key;
              return (
                <div
                  key={tab.key}
                  className={'nt-platform-tab' + (isActive ? ' nt-platform-tab--active' : '')}
                  onClick={function () {
                    handlePlatformFilter(tab.key);
                  }}
                >
                  {tab.icon && <span className="nt-platform-tab-icon">{tab.icon}</span>}
                  {tab.label}
                  <span className="nt-platform-count">({tab.count})</span>
                </div>
              );
            })}
          </div>

          {/* 第三行：次要筛选 */}
          <div className="nt-toolbar-row">
            <button className="nt-filter-btn">
              <FilterOutlined />
              筛选
            </button>
            <button className="nt-filter-btn">
              <TagsOutlined />
              标签筛选
            </button>
            <Dropdown
              menu={{
                items: [
                  { key: 'hot', label: '按热度' },
                  { key: 'relevant', label: '按相关度' },
                ],
              }}
              trigger={['click']}
            >
              <button className="nt-filter-btn">
                快速筛选
                <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
              </button>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  { key: 'time_desc', label: '按时间-倒序' },
                  { key: 'time_asc', label: '按时间-正序' },
                ],
              }}
              trigger={['click']}
            >
              <button className="nt-filter-btn">
                按时间-倒序
                <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
              </button>
            </Dropdown>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="nt-article-list">
          {ARTICLES.map(renderArticleCard)}
        </div>

        {/* 分页栏 */}
        <div className="nt-pagination-bar">
          <div className="nt-pagination-left">
            <Checkbox>全选</Checkbox>
            <button className="nt-filter-btn">
              <ExportOutlined style={{ marginRight: 4 }} />
              导出
            </button>
          </div>
          {renderPagination()}
        </div>
      </div>

      {/* ============ 收起/展开触发器 ============ */}
      <div
        className="nt-panel-trigger"
        onClick={function () {
          setTopicPanelVisible(!topicPanelVisible);
        }}
      >
        {topicPanelVisible ? <RightOutlined /> : <LeftOutlined />}
      </div>

      {/* ============ 右侧专题列表面板 ============ */}
      {topicPanelVisible && (
        <div className="nt-topic-panel">
          {/* 面板头部 */}
          <div className="nt-topic-panel-header">
            <span className="nt-topic-panel-title">专题列表</span>
            <div className="nt-topic-panel-actions">
              <div className="nt-topic-panel-icon">
                <BellOutlined />
              </div>
              <div
                className="nt-topic-panel-icon"
                onClick={function () {
                  setTopicPanelVisible(false);
                }}
              >
                <CloseOutlined />
              </div>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="nt-topic-panel-search">
            <Input
              placeholder="请输入专题名或目录名"
              size="small"
              value={topicSearchValue}
              onChange={function (e) {
                setTopicSearchValue(e.target.value);
              }}
              maxLength={20}
              suffix={
                <span style={{ fontSize: 11, color: '#bfbfbf' }}>
                  {topicSearchValue.length}/20
                </span>
              }
            />
          </div>

          {/* 创建按钮 */}
          <div className="nt-topic-panel-btns">
            <button className="nt-topic-panel-btn nt-topic-panel-btn--primary" onClick={handleCreateTopic}>
              <PlusOutlined style={{ marginRight: 4, fontSize: 12 }} />
              创建专题
            </button>
            <button className="nt-topic-panel-btn nt-topic-panel-btn--default">
              <PlusOutlined style={{ marginRight: 4, fontSize: 12 }} />
              创建目录
            </button>
          </div>

          {/* 专题树 */}
          <div className="nt-topic-panel-list">
            {renderTopicTree()}
          </div>
        </div>
      )}

      {/* 创建采集任务 Drawer */}
      <CollectTaskDrawer
        open={collectDrawerOpen}
        onClose={function () { setCollectDrawerOpen(false); setCollectInitialValues(null); }}
        initialValues={collectInitialValues || undefined}
      />
    </div>
  );
};

export default Topics;
