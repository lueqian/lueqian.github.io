/**
 * @name 搜索页面
 * @description 从 search-page 原型迁移的纯内容区组件
 *
 * 移除了：sidebar、header、ConfigProvider、Axure Handle、AvatarPopover、布局 div
 * 保留了：所有搜索相关状态/逻辑、子组件、mock 数据、搜索表单 UI、搜索结果 UI
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import {
  Input,
  Button,
  DatePicker,
  Select,
  Switch,
  Avatar,
  Checkbox,
  Pagination,
  Space,
  message,
} from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  StarOutlined,
  CloudSyncOutlined,
  AccountBookOutlined,
  DownOutlined,
  UpOutlined,
  CopyOutlined,
  LinkOutlined,
  FileSearchOutlined,
  RightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CollectTaskDrawer from '../components/CollectTaskDrawer';

const { RangePicker } = DatePicker;

// ============ 常量 ============

const PRIMARY_COLOR = '#3b82f6';

// ============ 搜索类型 ============

const SEARCH_TYPES = [
  { key: 'web', label: '全网搜索' },
  { key: 'sea', label: '海搜' },
  { key: 'source', label: '信源搜索' },
];

// ============ 信源范围 ============

const SOURCE_OPTIONS = [
  { key: 'all', label: '全选' },
  { key: 'weibo', label: '微博' },
  { key: 'douyin', label: '抖音' },
  { key: 'toutiao', label: '今日头条' },
  { key: 'xiaohongshu', label: '小红书' },
  { key: 'other_short_video', label: '其他短视频' },
  { key: 'wechat', label: '微信' },
  { key: 'news', label: '新闻' },
  { key: 'forum', label: '论坛' },
  { key: 'long_video', label: '长视频' },
  { key: 'app', label: 'APP' },
  { key: 'overseas', label: '境外' },
];

// ============ 匹配方式 ============

const MATCH_METHODS = [
  { key: 'all', label: '全选' },
  { key: 'title', label: '标题' },
  { key: 'content', label: '正文' },
  { key: 'author', label: '作者' },
  { key: 'image', label: '图片/封面图/全帧识别' },
  { key: 'audio', label: '音频识别' },
  { key: 'geo', label: '地理信息' },
];

// ============ 信息类型 ============

const INFO_TYPES = [
  { key: 'all', label: '全部' },
  { key: 'original', label: '原创' },
  { key: 'repost', label: '转发' },
  { key: 'comment', label: '评论' },
];

// ============ 字段选择选项 ============

const FIELD_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'publish_location', label: '文章发布地' },
  { value: 'ip_location', label: '文章IP属地' },
  { value: 'register_location', label: '账号注册地' },
];

// ============ 搜索历史 ============

const DEFAULT_SEARCH_HISTORY = [
  '冲塔',
  'QQ音乐',
  '抖友+狂',
  '快友+狂',
  'B友+狂',
  '网易云',
  '汽水音乐',
  '扣音',
  'Q音',
];

// ============ 平台Tab数据（搜索结果页） ============

type PlatformTab = {
  key: string;
  label: string;
  count: number;
};

const PLATFORM_TABS: PlatformTab[] = [
  { key: 'all', label: '全部', count: 3147559 },
  { key: 'weibo', label: '微博', count: 444423 },
  { key: 'douyin', label: '抖音', count: 1570064 },
  { key: 'toutiao', label: '今日头条', count: 377008 },
  { key: 'xiaohongshu', label: '小红书', count: 72026 },
  { key: 'other_short_video', label: '其他短视频', count: 205283 },
];

// ============ 模拟搜索结果数据 ============

type SearchResultItem = {
  id: number;
  rank: number;
  author: string;
  authorVerified: boolean;
  avatarColor: string;
  avatarLetter: string;
  time: string;
  platform: string;
  platformIcon: string;
  location: string;
  isRepost: boolean;
  content: string;
  url: string;
  images: string[];
  imageRecognition: { tag: string; label: string }[];
  sentimentTag: string;
  matchedKeyword: string;
};

const MOCK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: 1,
    rank: 1,
    author: '一柠檬水一',
    authorVerified: false,
    avatarColor: '#f472b6',
    avatarLetter: '柠',
    time: '2026-04-17 10:57:49',
    platform: '微博',
    platformIcon: 'weibo',
    location: '河北省',
    isRepost: false,
    content: '今天是我最好的朋友的生日🎂！给她准备了一个超级大的惊喜蛋糕，她看到的那一刻直接哭了😭 太感动了！希望她永远开心快乐！#生日惊喜 #友谊长存 #感动瞬间',
    url: 'https://weibo.com/u/1234567890/status/4abc1234',
    images: ['birthday-cake.jpg'],
    imageRecognition: [
      { tag: '①', label: 'HELLO KITTY' },
      { tag: '②', label: '祝生日快乐!' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 2,
    rank: 2,
    author: '糖糖糖语',
    authorVerified: true,
    avatarColor: '#a78bfa',
    avatarLetter: '糖',
    time: '2026-04-17 10:57:34',
    platform: '微博',
    platformIcon: 'weibo',
    location: '河南省',
    isRepost: false,
    content: '震惊！我的语文老师居然在课堂上用文言文骂人，全班同学一脸震惊根本听不懂，但就是觉得好厉害的样子😂 古人骂人真的太有文化了 #文言文 #语文课 #震惊',
    url: 'https://weibo.com/u/9876543210/status/4def5678',
    images: [],
    imageRecognition: [
      { tag: '①', label: '一脸震惊' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 3,
    rank: 3,
    author: '在线等二搭中',
    authorVerified: false,
    avatarColor: '#34d399',
    avatarLetter: '等',
    time: '2026-04-17 10:57:29',
    platform: '微博',
    platformIcon: 'weibo',
    location: '福建省',
    isRepost: true,
    content: '震惊！杨幂工作室最新动态，幂幂姐的新造型也太绝了吧！这气质真的没谁了✨ 章若楠也转发表示太美了！粉丝们都震惊了 #杨幂 #章若楠 #明星穿搭 #震惊',
    url: 'https://weibo.com/yangmi_official/status/4ghi9012',
    images: ['yang-mi.jpg', 'style.jpg'],
    imageRecognition: [
      { tag: '①', label: 'FANS 杨幂工作室...' },
      { tag: '②', label: '章若楠official' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 4,
    rank: 4,
    author: '科技前沿观察',
    authorVerified: true,
    avatarColor: '#60a5fa',
    avatarLetter: '科',
    time: '2026-04-17 10:56:12',
    platform: '今日头条',
    platformIcon: 'toutiao',
    location: '北京市',
    isRepost: false,
    content: '震惊全球！国产芯片取得重大突破，性能超越国际同类产品，多家科技巨头表示震惊和关注。业内人士分析，这将彻底改变全球芯片格局 #国产芯片 #科技突破 #震惊',
    url: 'https://www.toutiao.com/article/tech-chip-breakthrough-2026',
    images: ['chip.jpg'],
    imageRecognition: [
      { tag: '①', label: '芯片产品图' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 5,
    rank: 5,
    author: '美食探店达人',
    authorVerified: false,
    avatarColor: '#fb923c',
    avatarLetter: '美',
    time: '2026-04-17 10:55:48',
    platform: '小红书',
    platformIcon: 'xiaohongshu',
    location: '上海市',
    isRepost: false,
    content: '震惊！这家隐藏在弄堂里的面馆居然这么好吃😭 老板说每天只卖100碗，排队的人从早上排到晚上！汤底浓郁得让人震惊 #上海美食 #面馆探店 #震惊',
    url: 'https://www.xiaohongshu.com/explore/shanghai-noodle-shop',
    images: ['noodle-shop.jpg', 'noodle-food.jpg'],
    imageRecognition: [
      { tag: '①', label: '面馆门面' },
      { tag: '②', label: '招牌面' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 6,
    rank: 6,
    author: '搞笑日常bot',
    authorVerified: false,
    avatarColor: '#facc15',
    avatarLetter: '搞',
    time: '2026-04-17 10:54:33',
    platform: '抖音',
    platformIcon: 'douyin',
    location: '广东省',
    isRepost: false,
    content: '震惊！我室友居然用洗衣机洗火锅底料，整个宿舍楼都震惊了，宿管阿姨直接冲过来😂 这操作也太离谱了吧 #搞笑 #宿舍日常 #震惊',
    url: 'https://www.douyin.com/video/funny-washing-machine-2026',
    images: ['washing-machine.jpg'],
    imageRecognition: [
      { tag: '①', label: '洗衣机' },
      { tag: '②', label: '火锅底料' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 7,
    rank: 7,
    author: '体育赛事速递',
    authorVerified: true,
    avatarColor: '#f87171',
    avatarLetter: '体',
    time: '2026-04-17 10:53:21',
    platform: '微博',
    platformIcon: 'weibo',
    location: '浙江省',
    isRepost: false,
    content: '震惊体坛！中国小将在世界杯预选赛中上演帽子戏法，全场震惊！赛后采访他居然说只是正常发挥，教练表示震惊但也在意料之中 #足球 #世界杯 #震惊',
    url: 'https://weibo.com/sports_daily/status/4jkl3456',
    images: ['football.jpg'],
    imageRecognition: [
      { tag: '①', label: '足球赛场' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
  {
    id: 8,
    rank: 8,
    author: '职场生存指南',
    authorVerified: false,
    avatarColor: '#2dd4bf',
    avatarLetter: '职',
    time: '2026-04-17 10:52:15',
    platform: '今日头条',
    platformIcon: 'toutiao',
    location: '江苏省',
    isRepost: false,
    content: '震惊！95后女生辞职后靠摆摊月入10万，她的创业经历让所有人都震惊了。从公司白领到街头摊主，她用行动证明了什么叫做人生不设限 #创业 #摆摊 #震惊',
    url: 'https://www.toutiao.com/article/young-entrepreneur-2026',
    images: ['street-stall.jpg'],
    imageRecognition: [
      { tag: '①', label: '摆摊场景' },
    ],
    sentimentTag: '震惊',
    matchedKeyword: '震惊',
  },
];

// ============ 可折叠面板组件 ============

const CollapsePanel: React.FC<{
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultExpanded = true, children }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="sp-collapse-panel">
      <div
        className="sp-collapse-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="sp-collapse-title">{title}</span>
        <span className="sp-collapse-arrow">
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </span>
      </div>
      {expanded && <div className="sp-collapse-content">{children}</div>}
    </div>
  );
};

// ============ 可选标签组件 ============

const SelectableTags: React.FC<{
  options: { key: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  hasAll?: boolean;
}> = ({ options, selected, onChange, hasAll = true }) => {
  const handleTagClick = (key: string) => {
    if (hasAll && key === 'all') {
      if (selected.includes('all')) {
        onChange([]);
      } else {
        onChange(options.map((o) => o.key));
      }
    } else {
      if (selected.includes(key)) {
        const newSelected = selected.filter((k) => k !== key);
        onChange(newSelected.filter((k) => k !== 'all'));
      } else {
        const newSelected = [...selected, key];
        const allKeys = options.filter((o) => o.key !== 'all').map((o) => o.key);
        const allSelected = allKeys.every((k) => newSelected.includes(k));
        if (allSelected && hasAll && !newSelected.includes('all')) {
          newSelected.push('all');
        }
        onChange(newSelected);
      }
    }
  };

  return (
    <div className="sp-tags-container">
      {options.map((option) => (
        <div
          key={option.key}
          className={`sp-tag ${selected.includes(option.key) ? 'sp-tag--active' : ''}`}
          onClick={() => handleTagClick(option.key)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

// ============ 平台图标组件 ============

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const iconMap: Record<string, { bg: string; text: string }> = {
    weibo: { bg: '#e6162d', text: '微' },
    douyin: { bg: '#161823', text: '抖' },
    toutiao: { bg: '#ff0000', text: '头' },
    xiaohongshu: { bg: '#ff2442', text: '小' },
    other_short_video: { bg: '#ff6900', text: '视' },
    wechat: { bg: '#07c160', text: '信' },
    news: { bg: '#1890ff', text: '新' },
    forum: { bg: '#722ed1', text: '论' },
    long_video: { bg: '#fa541c', text: '长' },
    app: { bg: '#13c2c2', text: 'A' },
    overseas: { bg: '#597ef7', text: '境' },
  };
  const info = iconMap[platform] || { bg: '#999', text: '?' };
  return (
    <span className="sr-platform-icon" style={{ backgroundColor: info.bg }}>
      {info.text}
    </span>
  );
};

// ============ 搜索结果页组件 ============

const SearchResultsView: React.FC<{
  keyword: string;
  results: SearchResultItem[];
  platformTabs: PlatformTab[];
  activePlatform: string;
  onPlatformChange: (key: string) => void;
  onBackToSearch: () => void;
}> = ({ keyword, results, platformTabs, activePlatform, onPlatformChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResults, setSelectedResults] = useState<number[]>([]);
  const [collectDrawerOpen, setCollectDrawerOpen] = useState(false);
  const [collectInitialValues, setCollectInitialValues] = useState<any>(null);

  const handleCustomCollect = (item: SearchResultItem) => {
    var taskName = item.content.slice(0, 50);
    setCollectInitialValues({
      task_name: taskName,
      scope_type: 'other' as const,
      platforms: [item.platform],
      link_list: [{ link: item.url, title: '', topic: item.content || '' }],
    });
    setCollectDrawerOpen(true);
  };

  const activeTab = platformTabs.find((t) => t.key === activePlatform) || platformTabs[0];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResults(results.map((r) => r.id));
    } else {
      setSelectedResults([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedResults((prev) => [...prev, id]);
    } else {
      setSelectedResults((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <div className="sr-container">
      {/* 主体内容区：左侧结果 + 右侧筛选 */}
      <div className="sr-body">
        {/* 左侧：搜索结果 */}
        <div className="sr-results-panel">
          {/* 平台Tab */}
          <div className="sr-platform-tabs">
            {platformTabs.map((tab) => (
              <div
                key={tab.key}
                className={`sr-platform-tab ${activePlatform === tab.key ? 'sr-platform-tab--active' : ''}`}
                onClick={() => onPlatformChange(tab.key)}
              >
                <span className="sr-platform-tab-label">{tab.label}</span>
                <span className="sr-platform-tab-count">({tab.count.toLocaleString()})</span>
              </div>
            ))}
            <div className="sr-sort-option">
              按时间-倒序 <DownOutlined style={{ fontSize: 10 }} />
            </div>
          </div>

          {/* 结果列表 */}
          <div className="sr-results-list">
            {results.map((item) => (
              <div key={item.id} className="sr-result-card">
                {/* 左侧选择 + 排名 */}
                <div className="sr-result-left">
                  <Checkbox
                    checked={selectedResults.includes(item.id)}
                    onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                  />
                  <span className="sr-result-rank">{item.rank}</span>
                </div>

                {/* 中间内容 */}
                <div className="sr-result-content">
                  {/* 第一行：用户信息 + 操作按钮 */}
                  <div className="sr-result-header">
                    <div className="sr-result-user-row">
                      <Avatar
                        size={28}
                        style={{ backgroundColor: item.avatarColor, fontSize: 12, fontWeight: 600 }}
                      >
                        {item.avatarLetter}
                      </Avatar>
                      <span className="sr-result-author">{item.author}</span>
                      {item.authorVerified && (
                        <span className="sr-verified-badge">V</span>
                      )}
                      <span className={`sr-result-type-badge ${item.isRepost ? 'sr-result-type-badge--repost' : 'sr-result-type-badge--original'}`}>
                        {item.isRepost ? '转载' : '原创'}
                      </span>
                    </div>
                    <div className="sr-result-actions">
                      <span className="sr-action-btn">
                        <FileSearchOutlined style={{ fontSize: 12 }} /> 一键搜索
                      </span>
                      <span className="sr-action-btn">
                        <CopyOutlined style={{ fontSize: 12 }} /> 复制信息
                      </span>
                      <span className="sr-action-btn">
                        <LinkOutlined style={{ fontSize: 12 }} /> 查看原文
                      </span>
                      <span className="sr-action-btn sr-action-btn--collect" onClick={() => handleCustomCollect(item)}>
                        <CloudSyncOutlined style={{ fontSize: 12 }} /> 创建采集任务
                      </span>
                    </div>
                  </div>

                  {/* 第二行：元数据（两端对齐） */}
                  <div className="sr-result-meta-row">
                    <div className="sr-meta-left">
                      <span className="sr-meta-item">{item.time}</span>
                      <span className="sr-meta-sep">|</span>
                      <span className="sr-meta-item">
                        <PlatformIcon platform={item.platformIcon} />
                        <span className="sr-meta-platform-name">{item.platform}</span>
                      </span>
                      <span className="sr-meta-sep">|</span>
                      <span className="sr-meta-item">{item.location}</span>
                    </div>
                    <div className="sr-meta-right">
                      <span className="sr-meta-keyword">命中关键词：</span>
                      <span className="sr-meta-keyword-text">{item.matchedKeyword}</span>
                    </div>
                  </div>

                  {/* 正文 + 图片双栏 */}
                  <div className="sr-result-body">
                    <div className="sr-result-text">
                      {item.content.split(item.matchedKeyword).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="sr-keyword-highlight">{item.matchedKeyword}</span>
                          )}
                        </span>
                      ))}
                    </div>
                    {item.images.length > 0 && (
                      <div className="sr-result-media">
                        <div className="sr-media-placeholder">
                          <span>📷</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 图片识别标签 */}
                  {item.imageRecognition.length > 0 && (
                    <div className="sr-image-recognition">
                      <span className="sr-image-recognition-label">图片识别：</span>
                      {item.imageRecognition.map((rec, idx) => (
                        <span key={idx} className="sr-image-recognition-tag">
                          {rec.tag} {rec.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 底部分页 */}
          <div className="sr-pagination-bar">
            <div className="sr-pagination-left">
              <Checkbox
                checked={selectedResults.length === results.length && results.length > 0}
                indeterminate={selectedResults.length > 0 && selectedResults.length < results.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              >
                <span className="sr-select-all-text">全选</span>
              </Checkbox>
            </div>
            <div className="sr-pagination-right">
              <Pagination
                current={currentPage}
                pageSize={10}
                total={activeTab.count}
                size="small"
                showSizeChanger={false}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>

        {/* 创建采集任务 Drawer */}
        <CollectTaskDrawer
          open={collectDrawerOpen}
          onClose={function () { setCollectDrawerOpen(false); setCollectInitialValues(null); }}
          initialValues={collectInitialValues || undefined}
        />

        {/* 右侧：筛选面板 */}
        <div className="sr-filter-sidebar">
          {/* 搜索框（面板顶部） */}
          <div className="sr-sidebar-search">
            <Input
              className="sr-sidebar-search-input"
              value={keyword}
              readOnly
              suffix={
                <span className="sr-char-count">{keyword.length}/200</span>
              }
            />
            <div className="sr-sidebar-search-btns">
              <Button type="primary" className="sr-search-btn-sm">搜索</Button>
              <Button className="sr-topic-btn-sm">生成专题</Button>
            </div>
          </div>

          {/* 搜索记录 */}
          <div className="sr-history-section">
            <div className="sr-history-header">
              <span className="sr-history-title">搜索记录</span>
              <div className="sr-history-actions">
                <span className="sr-history-action">展开 <DownOutlined style={{ fontSize: 10 }} /></span>
                <span className="sr-history-action">清空</span>
              </div>
            </div>
            <div className="sr-history-tags">
              {['震惊', '胡耀邦', '冲塔', 'QQ音乐', '抖友+狂', '快友+狂', 'B友+狂'].map((h, i) => (
                <span key={i} className="sr-history-tag">{h}</span>
              ))}
            </div>
          </div>

          {/* 时间范围 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 时间范围</label>
            <div className="sr-filter-control">
              <div className="sr-time-display">
                <span>2026-04-10 00:00:00</span>
                <span style={{ margin: '0 8px', color: '#999' }}>至</span>
                <span>2026-04-17 23:59:59</span>
              </div>
            </div>
          </div>

          {/* 信源范围 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 信源范围</label>
            <div className="sr-filter-control">
              <div className="sr-filter-tags">
                {['全选', '微博', '抖音', '今日头条', '小红书', '微信', '其他短视频', '新闻', '论坛', '长视频', 'APP', '境外'].map((tag, i) => (
                  <span key={i} className={`sr-filter-tag ${i === 0 ? 'sr-filter-tag--active' : ''}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 匹配方式 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 匹配方式</label>
            <div className="sr-filter-control">
              <div className="sr-filter-tags">
                {['全选', '标题', '正文', '作者', '图片/封面/全帧识别', '音频识别'].map((tag, i) => (
                  <span key={i} className={`sr-filter-tag ${i === 0 ? 'sr-filter-tag--active' : ''}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 地理信息 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 地理信息</label>
            <div className="sr-filter-control">
              <div className="sr-filter-tags">
                {['全部', '账号发布地', '文章IP属地'].map((tag, i) => (
                  <span key={i} className={`sr-filter-tag ${i === 0 ? 'sr-filter-tag--active' : ''}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 信息类型 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 信息类型</label>
            <div className="sr-filter-control">
              <div className="sr-filter-tags">
                {['全部', '原创', '转发', '评论'].map((tag, i) => (
                  <span key={i} className={`sr-filter-tag ${i === 0 ? 'sr-filter-tag--active' : ''}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 地域范围 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 地域范围</label>
            <div className="sr-filter-control">
              <Input placeholder="请输入地域范围" size="small" style={{ width: '100%' }} suffix={<span style={{ color: '#999', fontSize: 12 }}>0/20</span>} />
            </div>
          </div>

          {/* 高级匹配 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 高级匹配</label>
            <div className="sr-filter-control">
              <div className="sr-match-mode">
                <span className="sr-match-mode-item sr-match-mode-item--active">最佳匹配</span>
                <span className="sr-match-mode-item">高级匹配</span>
              </div>
            </div>
          </div>

          {/* 字段选择 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 字段选择</label>
            <div className="sr-filter-control">
              <div className="sr-filter-tags">
                {['全部', '文章发布地', '文章IP属地', '账号注册地'].map((tag, i) => (
                  <span key={i} className={`sr-filter-tag ${i === 0 ? 'sr-filter-tag--active' : ''}`}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 指定作者 */}
          <div className="sr-filter-row">
            <label className="sr-filter-label"><span className="sr-required">*</span> 指定作者</label>
            <div className="sr-filter-control">
              <Input placeholder="如撒贝宁, 多个用逗号隔开" size="small" style={{ width: '100%' }} suffix={<span style={{ color: '#999', fontSize: 12 }}>0/50</span>} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ 主组件 ============

const Search: React.FC<{ onOpenBatchImport?: () => void }> = ({ onOpenBatchImport }) => {
  // 搜索相关状态
  const [searchType, setSearchType] = useState<string>('web');
  const [keyword, setKeyword] = useState<string>('');
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day').startOf('day'),
    dayjs().endOf('day'),
  ]);
  const [selectedSources, setSelectedSources] = useState<string[]>(['all']);
  const [selectedMatchMethods, setSelectedMatchMethods] = useState<string[]>(['all']);
  const [infoType, setInfoType] = useState<string>('all');
  const [region, setRegion] = useState<string>('');
  const [matchMode, setMatchMode] = useState<'best' | 'advanced'>('best');
  const [fieldSelect, setFieldSelect] = useState<string>('all');
  const [authors, setAuthors] = useState<string>('');
  const [domains, setDomains] = useState<string>('');
  const [excludeDomains, setExcludeDomains] = useState<string>('');
  const [filterWords, setFilterWords] = useState<string>('');
  const [smartFilter, setSmartFilter] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(DEFAULT_SEARCH_HISTORY);
  const [historyExpanded, setHistoryExpanded] = useState<boolean>(false);

  // 视图切换：'search' = 搜索表单页, 'results' = 搜索结果页
  const [viewMode, setViewMode] = useState<'search' | 'results'>('search');
  const [activePlatform, setActivePlatform] = useState<string>('all');

  // 搜索
  const handleSearch = useCallback(() => {
    if (!keyword.trim()) return;

    // 添加到搜索历史
    setSearchHistory((prev) => {
      const newHistory = [keyword, ...prev.filter((h) => h !== keyword)].slice(0, 20);
      return newHistory;
    });

    // 切换到搜索结果视图
    setViewMode('results');
  }, [keyword]);

  // 返回搜索页
  const handleBackToSearch = useCallback(() => {
    setViewMode('search');
  }, []);

  // 清空历史
  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // 点击历史记录
  const handleHistoryClick = useCallback((historyKeyword: string) => {
    setKeyword(historyKeyword);
  }, []);

  return (
    <div>
      {viewMode === 'search' ? (
        <>
          {/* ===== 搜索表单视图 ===== */}
          <div className="sp-search-card">
            {/* Tabs 居中 */}
            <div className="sp-tabs">
              {SEARCH_TYPES.map(function (tab) {
                return (
                  <div
                    key={tab.key}
                    className={`sp-tab ${searchType === tab.key ? 'sp-tab--active' : ''}`}
                    onClick={function () { setSearchType(tab.key); }}
                  >
                    {tab.label}
                  </div>
                );
              })}
            </div>

            {/* 搜索栏：按钮嵌入输入框内部 */}
            <div className="sp-search-area">
              <div className="sp-search-input-wrapper">
                <Input
                  className="sp-search-input"
                  placeholder="输入关键词搜索全网舆情数据"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  maxLength={200}
                  suffix={<span className="sp-char-count">{keyword.length}/200</span>}
                />
                <Button type="primary" className="sp-search-btn" onClick={handleSearch}>搜索</Button>
                {onOpenBatchImport && (
                  <Button
                    onClick={onOpenBatchImport}
                    style={{ marginLeft: 8, borderColor: '#3b82f6', color: '#3b82f6' }}
                  >
                    批量导入检索
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 筛选条件：行内布局 */}
          <div className="sp-filter-panel">
            {/* 时间范围 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">时间范围</label>
              <div className="sp-filter-control">
                <RangePicker
                  showTime
                  value={timeRange}
                  onChange={(dates) => { if (dates && dates[0] && dates[1]) { setTimeRange([dates[0], dates[1]]); } }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* 信源范围 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">信源范围</label>
              <div className="sp-filter-control">
                <SelectableTags options={SOURCE_OPTIONS} selected={selectedSources} onChange={setSelectedSources} hasAll />
              </div>
            </div>

            {/* 匹配方式 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">匹配方式</label>
              <div className="sp-filter-control">
                <SelectableTags options={MATCH_METHODS} selected={selectedMatchMethods} onChange={setSelectedMatchMethods} hasAll />
              </div>
            </div>

            {/* 信息类型 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">信息类型</label>
              <div className="sp-filter-control">
                <SelectableTags options={INFO_TYPES} selected={[infoType]} onChange={(selected) => setInfoType(selected[0] || 'all')} hasAll={false} />
              </div>
            </div>

            {/* 地域范围 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">地域范围</label>
              <div className="sp-filter-control">
                <Input placeholder="请输入地域范围" value={region} onChange={(e) => setRegion(e.target.value)} maxLength={20} suffix={<span className="sp-field-count">{region.length}/20</span>} />
              </div>
            </div>

            {/* 高级匹配 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">高级匹配</label>
              <div className="sp-filter-control">
                <div className="sp-advanced-match">
                  <div className="sp-match-mode">
                    <span className={`sp-match-mode-item ${matchMode === 'best' ? 'sp-match-mode-item--active' : ''}`} onClick={() => setMatchMode('best')}>最佳匹配</span>
                    <span className={`sp-match-mode-item ${matchMode === 'advanced' ? 'sp-match-mode-item--active' : ''}`} onClick={() => setMatchMode('advanced')}>高级匹配</span>
                  </div>
                  {matchMode === 'advanced' && (
                    <Select value={fieldSelect} onChange={setFieldSelect} options={FIELD_OPTIONS} style={{ width: 160, marginTop: 8 }} />
                  )}
                </div>
              </div>
            </div>

            {/* 指定作者 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">指定作者</label>
              <div className="sp-filter-control">
                <Input placeholder="如撒贝宁, 多个用逗号隔开" value={authors} onChange={(e) => setAuthors(e.target.value)} maxLength={50} suffix={<span className="sp-field-count">{authors.length}/50</span>} />
              </div>
            </div>

            {/* 指定域名 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">指定域名</label>
              <div className="sp-filter-control">
                <Input placeholder="请输入一级域名地址, 如baidu.com" value={domains} onChange={(e) => setDomains(e.target.value)} maxLength={50} suffix={<span className="sp-field-count">{domains.length}/50</span>} />
              </div>
            </div>

            {/* 排除域名 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">排除域名</label>
              <div className="sp-filter-control">
                <Input placeholder="请输入一级域名地址, 如baidu.com" value={excludeDomains} onChange={(e) => setExcludeDomains(e.target.value)} maxLength={50} suffix={<span className="sp-field-count">{excludeDomains.length}/50</span>} />
              </div>
            </div>

            {/* 过滤词 */}
            <div className="sp-filter-row">
              <label className="sp-filter-label">过滤词</label>
              <div className="sp-filter-control">
                <Input placeholder="请输入过滤词" value={filterWords} onChange={(e) => setFilterWords(e.target.value)} maxLength={50} suffix={<span className="sp-field-count">{filterWords.length}/50</span>} />
              </div>
            </div>

            {/* 智能过滤 */}
            <div className="sp-filter-row sp-filter-row--switch">
              <label className="sp-filter-label">智能过滤</label>
              <div className="sp-filter-control">
                <Switch checked={smartFilter} onChange={setSmartFilter} />
              </div>
            </div>
          </div>

          <div className="sp-history-section">
            <div className="sp-history-header">
              <span className="sp-history-title">搜索记录</span>
              <div className="sp-history-actions">
                <span className="sp-history-action" onClick={() => setHistoryExpanded(!historyExpanded)}>
                  {historyExpanded ? '收起' : '展开'}
                  {historyExpanded ? <UpOutlined /> : <DownOutlined />}
                </span>
                <span className="sp-history-action" onClick={handleClearHistory}>清空</span>
              </div>
            </div>
            <div className={`sp-history-tags ${historyExpanded ? 'sp-history-tags--expanded' : ''}`}>
              {searchHistory.map((history, index) => (
                <div key={index} className="sp-history-tag" onClick={() => handleHistoryClick(history)}>{history}</div>
              ))}
              {searchHistory.length === 0 && <span className="sp-history-empty">暂无搜索记录</span>}
            </div>
          </div>
        </>
      ) : (
        /* ===== 搜索结果视图 ===== */
        <SearchResultsView
          keyword={keyword}
          results={MOCK_SEARCH_RESULTS}
          platformTabs={PLATFORM_TABS}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
          onBackToSearch={handleBackToSearch}
        />
      )}
    </div>
  );
};

export default Search;
