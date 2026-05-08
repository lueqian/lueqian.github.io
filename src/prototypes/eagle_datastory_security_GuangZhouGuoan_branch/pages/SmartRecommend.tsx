/**
 * @name 智能推荐
 * @description 多维度舆情智能推荐页面，支持一级Tab、二级业务分类Tab、万能过滤器、情报列表流
 *
 * 页面结构：
 * - 蓝底标题栏：系统名称 + 日期选择器 + 刷新/全屏按钮
 * - 一级Tab：监测视图、高热度、含超敏词、重点源监控、事件看板
 * - 二级Tab：广州境外敏感信息、网络结党结社、破网穿墙等9个业务分类
 * - 万能过滤器：可折叠的多维筛选面板
 * - 情报列表流：含AI摘要的信息卡片列表 + 分页器
 *
 * @author 数说蓝鹰产品团队
 * @version 1.0.0
 * @date 2026-05-08
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Input, Button, Tag, Select, Switch, DatePicker, Badge, Tooltip, Pagination, Modal, Tree } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  DownOutlined,
  UpOutlined,
  UserOutlined,
  FlagOutlined,
  EyeOutlined,
  StarOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  TwitterOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  RightOutlined,
  TranslationOutlined,
  SendOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

// ============ 类型定义 ============

type PrimaryTab = {
  key: string;
  label: string;
  badge?: string | number;
  dot?: boolean;
};

type SecondaryTab = {
  key: string;
  label: string;
};

type FilterOption = {
  key: string;
  label: string;
};

type FeedItem = {
  id: number;
  username: string;
  verified: boolean;
  followers: string;
  publishTime: string;
  platform: string;
  content: string;
  highlightKeywords: string[];
  aiSummary: string;
  tags: string[];
  hasImage: boolean;
  hasVideo: boolean;
  isOriginal: boolean;
  isRecommended: boolean;
  interactionCount: string;
};

// ============ 配置数据 ============

const PRIMARY_TABS: PrimaryTab[] = [
  { key: 'monitor', label: '监测视图' },
  { key: 'hot', label: '高热度' },
  { key: 'sensitive', label: '含超敏词', dot: true },
  { key: 'key_source', label: '重点源监控', badge: 1124 },
  { key: 'event', label: '事件看板' },
];

const SECONDARY_TABS: SecondaryTab[] = [
  { key: 'gz_overseas', label: '广州境外敏感信息' },
  { key: 'online_org', label: '网络结党结社' },
  { key: 'break_wall', label: '破网穿墙' },
  { key: 'key_opinion', label: '重点舆情监测' },
  { key: 'bj_harass', label: '涉京线下滋扰类' },
  { key: 'extremism', label: '涉极端类' },
  { key: 'crypto', label: '涉政虚拟币' },
  { key: 'ai_harass', label: '涉AI滋扰类' },
  { key: 'data_leak', label: '涉敏数据泄露' },
  { key: 'tg_sensitive', label: 'TG 群组敏感' },
];

const DASHBOARD_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'high_interaction', label: '高互动量' },
];

const MONITOR_STATUS_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'unmonitored', label: '未监测' },
  { key: 'monitored', label: '已监测' },
];

const TAG_STATUS_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'tagged', label: '已打标' },
  { key: 'untagged', label: '未打标' },
];

const SORT_OPTIONS: FilterOption[] = [
  { key: 'default', label: '默认排序' },
  { key: 'time_desc', label: '时间倒序' },
  { key: 'time_asc', label: '时间正序' },
  { key: 'interaction', label: '互动量' },
];

const INFO_TYPE_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全选' },
  { key: 'original', label: '原创' },
  { key: 'repost', label: '转发' },
  { key: 'comment', label: '评论' },
];

const SENTIMENT_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全选' },
  { key: 'positive', label: '正面' },
  { key: 'neutral', label: '中性' },
  { key: 'negative', label: '负面' },
];

const FERMENT_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全选' },
  { key: 'first', label: '首次发酵' },
  { key: 'ongoing', label: '持续发酵' },
];

// 情报列表模拟数据
const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: 1,
    username: '朱韵和',
    verified: true,
    followers: '12.8万',
    publishTime: '2026-05-08 13:52:56',
    platform: 'twitter',
    content: '今天在广州天河区某商场发生了一起恶性伤人事件，现场多人受伤，嫌疑人已被警方控制。据目击者称，事发突然，周围群众纷纷逃离。目前伤者已被送往附近医院救治，具体伤亡情况尚在统计中。',
    highlightKeywords: ['恶性伤人事件', '广州天河区'],
    aiSummary: '摘要：广州天河区商场发生恶性伤人事件，多人受伤，嫌疑人已被控制。伤者已送医救治，伤亡情况统计中。',
    tags: ['受害人', '被打', '惨案', '冤假'],
    hasImage: true,
    hasVideo: false,
    isOriginal: true,
    isRecommended: true,
    interactionCount: '3,842',
  },
  {
    id: 2,
    username: 'GlobalWatch',
    verified: true,
    followers: '56.2万',
    publishTime: '2026-05-08 13:45:20',
    platform: 'twitter',
    content: 'Breaking: Major cybersecurity breach reported in Southeast Asia. Multiple government databases compromised. The attack appears to be coordinated and sophisticated, targeting sensitive diplomatic communications. Authorities are investigating the source and scope of the breach.',
    highlightKeywords: ['cybersecurity breach', 'government databases'],
    aiSummary: '摘要：东南亚地区发生重大网络安全事件，多个政府数据库被攻破，攻击具有协调性和复杂性，针对敏感外交通信。',
    tags: ['网络安全', '数据泄露', '政府'],
    hasImage: false,
    hasVideo: true,
    isOriginal: true,
    isRecommended: false,
    interactionCount: '8,215',
  },
  {
    id: 3,
    username: '时政观察者',
    verified: false,
    followers: '3.4万',
    publishTime: '2026-05-08 13:38:12',
    platform: 'facebook',
    content: '近期境外社交平台上出现大量关于我国经济政策的虚假信息，部分内容被恶意篡改后传播。这些虚假信息主要集中在贸易政策和汇率方面，试图误导国际社会对中国经济的认知。',
    highlightKeywords: ['虚假信息', '恶意篡改'],
    aiSummary: '摘要：境外社交平台出现大量关于中国经济政策的虚假信息，涉及贸易政策和汇率，意图误导国际认知。',
    tags: ['虚假信息', '贸易政策', '汇率'],
    hasImage: true,
    hasVideo: false,
    isOriginal: false,
    isRecommended: true,
    interactionCount: '1,567',
  },
  {
    id: 4,
    username: 'TechInsider_KR',
    verified: true,
    followers: '28.9万',
    publishTime: '2026-05-08 13:30:45',
    platform: 'youtube',
    content: '한국 정부가 새로운 사이버 보안 정책을 발표했습니다. 이번 정책은 주요 인프라 시설에 대한 보호를 강화하고, 국가 간 사이버 협력 체계를 구축하는 것을 목표로 합니다.',
    highlightKeywords: ['사이버 보안', '정책'],
    aiSummary: '摘要：韩国政府发布新网络安全政策，旨在加强关键基础设施保护并构建国际合作体系。',
    tags: ['韩国', '网络安全', '政策'],
    hasImage: false,
    hasVideo: true,
    isOriginal: true,
    isRecommended: false,
    interactionCount: '5,102',
  },
  {
    id: 5,
    username: 'DeepAnalysis',
    verified: true,
    followers: '41.7万',
    publishTime: '2026-05-08 13:22:08',
    platform: 'twitter',
    content: 'Intelligence report: Unusual communication patterns detected across multiple encrypted messaging platforms. Cross-referencing with known threat actor signatures suggests potential coordinated information operations targeting multiple jurisdictions simultaneously.',
    highlightKeywords: ['encrypted messaging', 'coordinated'],
    aiSummary: '摘要：检测到多个加密通讯平台出现异常通信模式，与已知威胁行为者特征交叉比对，显示可能存在针对多司法管辖区的协调信息行动。',
    tags: ['加密通讯', '信息行动', '跨平台'],
    hasImage: true,
    hasVideo: false,
    isOriginal: true,
    isRecommended: true,
    interactionCount: '6,730',
  },
];

// TG群组敏感模拟数据
const MOCK_TG_SENSITIVE_ITEMS: FeedItem[] = [
  {
    id: 201,
    username: '@DarkNet_Recruiter',
    verified: false,
    followers: '2.3万',
    publishTime: '2026-05-08 14:12:33',
    platform: 'telegram',
    content: '【招募通知】现招募熟悉VPN搭建及加密通讯工具使用的技术人员，要求能独立完成Shadowsocks/V2Ray服务端部署。待遇优厚，有意者私聊。联系方式：@RecruitMaster_88',
    highlightKeywords: ['招募', 'VPN搭建', '加密通讯'],
    aiSummary: '摘要：TG群组内发布技术人员招募通知，涉及VPN搭建及加密通讯工具部署，疑似非法网络服务招募活动。',
    tags: ['非法招募', 'VPN', '加密通讯'],
    hasImage: false,
    hasVideo: false,
    isOriginal: true,
    isRecommended: false,
    interactionCount: '892',
  },
  {
    id: 202,
    username: '@DataBroker_CN',
    verified: false,
    followers: '8.7万',
    publishTime: '2026-05-08 14:05:18',
    platform: 'telegram',
    content: '出售最新一批国内政企数据库，包含某省公安系统人员信息120万条、某市社保数据350万条、某大型银行客户信息80万条。支持验货，价格面议。仅接受XMR/USDT支付。',
    highlightKeywords: ['数据库', '公安系统', '社保数据'],
    aiSummary: '摘要：TG用户公开出售国内政企敏感数据库，涉及公安、社保、银行等领域大量个人信息，使用加密货币交易。',
    tags: ['数据贩卖', '个人隐私', '公安数据'],
    hasImage: true,
    hasVideo: false,
    isOriginal: true,
    isRecommended: true,
    interactionCount: '3,421',
  },
  {
    id: 203,
    username: '@ProxyMaster_X',
    verified: false,
    followers: '5.1万',
    publishTime: '2026-05-08 13:58:42',
    platform: 'telegram',
    content: '更新一批高质量境外代理节点，覆盖美国、日本、新加坡、德国等地区。支持SS/V2Ray/Trojan协议，已测试可正常访问Google、Twitter、YouTube。群成员专享优惠，加入VIP群获取每日更新节点。',
    highlightKeywords: ['境外代理', '翻墙'],
    aiSummary: '摘要：TG用户发布境外代理节点更新信息，提供多种翻墙协议节点，面向群成员进行传播。',
    tags: ['翻墙', '代理节点', '非法网络服务'],
    hasImage: false,
    hasVideo: false,
    isOriginal: true,
    isRecommended: false,
    interactionCount: '1,756',
  },
  {
    id: 204,
    username: '@Insider_Whistle',
    verified: false,
    followers: '15.4万',
    publishTime: '2026-05-08 13:47:09',
    platform: 'telegram',
    content: '内部消息：某市近期将开展针对境外NGO的专项排查行动，重点检查涉及政治敏感领域的合作项目。相关机构建议提前做好应对准备，清理敏感文件和通讯记录。',
    highlightKeywords: ['专项排查', '境外NGO', '敏感文件'],
    aiSummary: '摘要：TG用户泄露内部消息，称某市将开展境外NGO专项排查，提醒相关机构清理敏感资料，涉嫌泄密和妨害公务。',
    tags: ['泄密', 'NGO', '内部消息'],
    hasImage: false,
    hasVideo: false,
    isOriginal: true,
    isRecommended: true,
    interactionCount: '6,892',
  },
];

// 收藏目录树数据
const FAVORITE_TREE_DATA = [
  {
    title: '专项行动 A',
    key: 'action-a',
    children: [
      { title: '子目录 1-1', key: 'action-a-1' },
      { title: '子目录 1-2', key: 'action-a-2' },
    ],
  },
  {
    title: '重点人追踪',
    key: 'key-person',
    children: [
      { title: '目标人物 A', key: 'key-person-a' },
      { title: '目标人物 B', key: 'key-person-b' },
      { title: '目标人物 C', key: 'key-person-c' },
    ],
  },
  {
    title: '2026 数据泄露案',
    key: 'data-leak-2026',
    children: [
      { title: '公安数据泄露', key: 'data-leak-police' },
      { title: '金融数据泄露', key: 'data-leak-finance' },
    ],
  },
];

// ============ 辅助函数 ============

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'twitter':
      return <TwitterOutlined style={{ color: '#1DA1F2' }} />;
    case 'facebook':
      return <FacebookOutlined style={{ color: '#4267B2' }} />;
    case 'youtube':
      return <YoutubeOutlined style={{ color: '#FF0000' }} />;
    case 'telegram':
      return <SendOutlined style={{ color: '#0088cc' }} />;
    default:
      return <GlobalOutlined style={{ color: '#999' }} />;
  }
};

const highlightText = (text: string, keywords: string[]) => {
  if (!keywords || keywords.length === 0) return text;
  let result = text;
  keywords.forEach((kw) => {
    if (kw && result.includes(kw)) {
      result = result.replace(
        new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        `<span class="sr-highlight">${kw}</span>`
      );
    }
  });
  return result;
};

// ============ 主组件 ============

const SmartRecommend: React.FC = () => {
  // 状态管理
  const [activePrimaryTab, setActivePrimaryTab] = useState<string>('monitor');
  const [activeSecondaryTab, setActiveSecondaryTab] = useState<string>('gz_overseas');
  const [filterExpanded, setFilterExpanded] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [platformDedup, setPlatformDedup] = useState<boolean>(true);
  const [highNegativeOnly, setHighNegativeOnly] = useState<boolean>(false);
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [excludeKeyword, setExcludeKeyword] = useState<string>('');
  const [favoriteModalVisible, setFavoriteModalVisible] = useState<boolean>(false);
  const [favoriteItem, setFavoriteItem] = useState<FeedItem | null>(null);
  const [selectedTreeKeys, setSelectedTreeKeys] = useState<string[]>([]);

  const handleFavorite = useCallback((item: FeedItem) => {
    setFavoriteItem(item);
    setSelectedTreeKeys([]);
    setFavoriteModalVisible(true);
  }, []);

  // 渲染整合后的头部栏（标题 + 日期 + 一级Tab 同一行，居中）
  const renderHeaderSection = () => (
    <div className="sr-header-section">
      {/* 左侧：标题 + 日期选择器 */}
      <div className="sr-header-left">
        <span className="sr-title-icon">🧠</span>
        <span className="sr-title-text">智能推荐</span>
        <RangePicker
          className="sr-date-picker"
          defaultValue={[null, null]}
          placeholder={['2026-05-02', '2026-05-08']}
        />
      </div>
      {/* 中间：一级Tab居中 */}
      <div className="sr-header-center">
        {PRIMARY_TABS.map((tab) => (
          <div
            key={tab.key}
            className={`sr-primary-tab ${activePrimaryTab === tab.key ? 'sr-primary-tab--active' : ''}`}
            onClick={() => setActivePrimaryTab(tab.key)}
          >
            {tab.label}
            {tab.dot && <span className="sr-tab-dot" />}
            {tab.badge && (
              <Badge count={tab.badge} className="sr-tab-badge" />
            )}
          </div>
        ))}
      </div>
      {/* 右侧：功能按钮 */}
      <div className="sr-header-right">
        <Tooltip title="刷新列表">
          <Button type="text" icon={<ReloadOutlined />} className="sr-header-btn">
            <span className="sr-header-btn-text">刷新列表</span>
          </Button>
        </Tooltip>
        <Tooltip title="翻译列表中的外语为中文">
          <Button type="text" icon={<TranslationOutlined />} className="sr-header-btn">
            <span className="sr-header-btn-text">翻译为中文</span>
          </Button>
        </Tooltip>
      </div>
    </div>
  );

  // 渲染二级Tab（紧贴一级Tab，无留白）
  const renderSecondaryTabs = () => (
    <div className="sr-secondary-tabs">
      {SECONDARY_TABS.map((tab) => (
        <div
          key={tab.key}
          className={`sr-secondary-tab ${activeSecondaryTab === tab.key ? 'sr-secondary-tab--active' : ''}`}
          onClick={() => setActiveSecondaryTab(tab.key)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );

  // 渲染万能过滤器
  const renderFilterPanel = () => (
    <div className="sr-filter-panel">
      {/* 看板选择 + 折叠按钮 */}
      <div className="sr-filter-header">
        <div className="sr-filter-header-left">
          <FilterOutlined style={{ color: '#1890FF', marginRight: 8 }} />
          <span className="sr-filter-header-label">筛选条件</span>
          <Select
            className="sr-filter-select-sm"
            defaultValue="all"
            options={DASHBOARD_OPTIONS}
            size="small"
          />
        </div>
        <Button
          type="link"
          size="small"
          icon={filterExpanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="sr-filter-toggle"
        >
          {filterExpanded ? '收起' : '展开'}
        </Button>
      </div>

      {filterExpanded && (
        <div className="sr-filter-body">
          {/* 第一行：阵地选择、监测状态等 */}
          <div className="sr-filter-row">
            <span className="sr-filter-label">阵地选择：</span>
            <Select className="sr-filter-select" defaultValue="all" options={[{ key: 'all', label: '全部' }]} size="small" />
            <span className="sr-filter-label">监测状态：</span>
            <div className="sr-filter-tag-group">
              {MONITOR_STATUS_OPTIONS.map((opt) => (
                <Tag
                  key={opt.key}
                  className={`sr-filter-tag ${opt.key === 'unmonitored' ? 'sr-filter-tag--active' : ''}`}
                >
                  {opt.label}
                </Tag>
              ))}
            </div>
            <span className="sr-filter-label">打标状态：</span>
            <Select className="sr-filter-select" defaultValue="all" options={TAG_STATUS_OPTIONS} size="small" />
            <span className="sr-filter-label">是否失效：</span>
            <Select className="sr-filter-select" defaultValue="all" options={[{ key: 'all', label: '全部' }, { key: 'valid', label: '有效' }, { key: 'invalid', label: '失效' }]} size="small" />
            <span className="sr-filter-label">是否推荐：</span>
            <div className="sr-filter-tag-group">
              <Tag className="sr-filter-tag sr-filter-tag--active">推荐</Tag>
              <Tag className="sr-filter-tag">不推荐</Tag>
            </div>
            <span className="sr-filter-label">是否收藏：</span>
            <Select className="sr-filter-select" defaultValue="all" options={[{ key: 'all', label: '全部' }, { key: 'yes', label: '已收藏' }, { key: 'no', label: '未收藏' }]} size="small" />
            <span className="sr-filter-label">是否报送：</span>
            <Select className="sr-filter-select" defaultValue="all" options={[{ key: 'all', label: '全部' }, { key: 'yes', label: '已报送' }, { key: 'no', label: '未报送' }]} size="small" />
          </div>

          {/* 第二行：排序、信息类型、情感等 */}
          <div className="sr-filter-row">
            <span className="sr-filter-label">原发来源：</span>
            <Select className="sr-filter-select" defaultValue="all" options={[{ key: 'all', label: '全部' }]} size="small" />
            <span className="sr-filter-label">排序条件：</span>
            <Select className="sr-filter-select" defaultValue="default" options={SORT_OPTIONS} size="small" />
            <span className="sr-filter-label">信息类型：</span>
            <div className="sr-filter-tag-group">
              {INFO_TYPE_OPTIONS.map((opt) => (
                <Tag key={opt.key} className="sr-filter-tag">{opt.label}</Tag>
              ))}
            </div>
            <span className="sr-filter-label">情感：</span>
            <div className="sr-filter-tag-group">
              {SENTIMENT_OPTIONS.map((opt) => (
                <Tag key={opt.key} className="sr-filter-tag">{opt.label}</Tag>
              ))}
            </div>
            <span className="sr-filter-label">发酵监测：</span>
            <div className="sr-filter-tag-group">
              {FERMENT_OPTIONS.map((opt) => (
                <Tag key={opt.key} className="sr-filter-tag">{opt.label}</Tag>
              ))}
            </div>
            <span className="sr-filter-label">标签筛选：</span>
            <Button type="link" size="small" className="sr-filter-link-btn">选择标签</Button>
          </div>

          {/* 第三行：关键词、开关 */}
          <div className="sr-filter-row sr-filter-row--bottom">
            <span className="sr-filter-label">关键词筛选：</span>
            <Input
              className="sr-filter-input"
              placeholder="筛选文章"
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              size="small"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
            />
            <span className="sr-filter-label">排除关键词：</span>
            <Input
              className="sr-filter-input"
              placeholder="排除文章"
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              size="small"
              value={excludeKeyword}
              onChange={(e) => setExcludeKeyword(e.target.value)}
            />
            <span className="sr-filter-label">平台去重：</span>
            <Switch checked={platformDedup} onChange={setPlatformDedup} size="small" />
            <span className="sr-filter-label">只看高负面：</span>
            <Switch checked={highNegativeOnly} onChange={setHighNegativeOnly} size="small" />
            <Button type="primary" size="small" className="sr-filter-query-btn">查询</Button>
            <Button size="small" className="sr-filter-reset-btn">重置</Button>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染情报列表流
  const renderFeedList = () => {
    const isTgSensitive = activeSecondaryTab === 'tg_sensitive';
    const feedItems = isTgSensitive ? MOCK_TG_SENSITIVE_ITEMS : MOCK_FEED_ITEMS;

    return (
    <div className="sr-feed-list">
      {feedItems.map((item) => (
        <div key={item.id} className="sr-feed-card">
          {/* 头部：序号 + 用户信息 + 操作 */}
          <div className="sr-feed-header">
            <div className="sr-feed-header-left">
              <span className="sr-feed-index">#{item.id}</span>
              <div className="sr-feed-avatar">
                <UserOutlined style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div className="sr-feed-user-info">
                <div className="sr-feed-username">
                  {item.username}
                  {item.verified && <CheckCircleOutlined className="sr-verified-icon" />}
                  {item.isOriginal && <Tag className="sr-original-badge">原创</Tag>}
                  {item.isRecommended && <Tag className="sr-recommend-badge">多次发声</Tag>}
                </div>
                <div className="sr-feed-meta">
                  <span className="sr-feed-followers">粉丝 {item.followers}</span>
                  <span className="sr-feed-divider">|</span>
                  <ClockCircleOutlined style={{ fontSize: 11, color: '#9ca3af' }} />
                  <span className="sr-feed-time">{item.publishTime}</span>
                  <span className="sr-feed-divider">|</span>
                  <span className="sr-feed-platform">{getPlatformIcon(item.platform)}</span>
                  <span className="sr-feed-divider">|</span>
                  <span className="sr-feed-interaction">互动 {item.interactionCount}</span>
                </div>
              </div>
            </div>
            <div className="sr-feed-actions">
              <Button type="link" size="small" className="sr-action-btn sr-action-btn--report" icon={<FlagOutlined />}>
                标记报送
              </Button>
              <Button type="link" size="small" className="sr-action-btn sr-action-btn--track" icon={<RightOutlined />}>
                追踪
              </Button>
              <Button type="link" size="small" className="sr-action-btn" icon={<EyeOutlined />}>
                标记监测
              </Button>
              <Button type="link" size="small" className="sr-action-btn" icon={<StarOutlined />} onClick={() => handleFavorite(item)}>
                收藏
              </Button>
              <Button type="link" size="small" className="sr-action-btn" icon={<MoreOutlined />} />
              {isTgSensitive && <Tag className="sr-sensitive-level-tag" color="red">高度敏感</Tag>}
            </div>
          </div>

          {/* 正文 */}
          <div className="sr-feed-body">
            <div
              className="sr-feed-text"
              dangerouslySetInnerHTML={{ __html: highlightText(item.content, item.highlightKeywords) }}
            />
            {/* 配图/视频缩略图区域 */}
            {(item.hasImage || item.hasVideo) && (
              <div className="sr-feed-media">
                {item.hasImage && (
                  <div className="sr-media-thumb sr-media-thumb--image">
                    <span className="sr-media-placeholder">📷 配图</span>
                  </div>
                )}
                {item.hasVideo && (
                  <div className="sr-media-thumb sr-media-thumb--video">
                    <span className="sr-media-placeholder">▶ 视频</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI摘要 */}
          <div className="sr-feed-summary">
            <span className="sr-summary-label">摘要：</span>
            <span className="sr-summary-text">{item.aiSummary}</span>
          </div>

          {/* 标签 */}
          <div className="sr-feed-tags">
            {item.tags.map((tag) => (
              <Tag key={tag} className="sr-feed-tag">{tag}</Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
    );
  };

  // 渲染分页器
  const renderPagination = () => (
    <div className="sr-pagination-bar">
      <div className="sr-pagination-left">
        <span className="sr-pagination-info">共 15,576,949 条数据</span>
      </div>
      <div className="sr-pagination-right">
        <Pagination
          current={currentPage}
          pageSize={20}
          total={15576949}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['10', '20', '50']}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );

  // 渲染收藏弹窗
  const renderFavoriteModal = () => (
    <Modal
      title="收藏至目录"
      open={favoriteModalVisible}
      onCancel={() => setFavoriteModalVisible(false)}
      onOk={() => {
        setFavoriteModalVisible(false);
      }}
      okText="确认收藏"
      cancelText="取消"
      width={480}
      className="sr-favorite-modal"
    >
      <div className="sr-favorite-modal-content">
        <div className="sr-favorite-item-preview">
          <span className="sr-favorite-preview-label">收藏内容：</span>
          <span className="sr-favorite-preview-text">
            {favoriteItem?.username} - {favoriteItem?.content?.substring(0, 60)}...
          </span>
        </div>
        <div className="sr-favorite-tree-label">
          <FolderOutlined style={{ marginRight: 6 }} />
          选择目标目录：
        </div>
        <Tree
          className="sr-favorite-tree"
          treeData={FAVORITE_TREE_DATA}
          defaultExpandAll
          selectedKeys={selectedTreeKeys}
          onSelect={(keys) => setSelectedTreeKeys(keys as string[])}
          blockNode
        />
      </div>
    </Modal>
  );

  return (
    <div className="sr-page">
      {/* 整合头部栏（标题栏 + 一级Tab） */}
      {renderHeaderSection()}

      {activePrimaryTab === 'monitor' ? (
        <>
          {/* 二级Tab */}
          {renderSecondaryTabs()}

          {/* 万能过滤器 */}
          {renderFilterPanel()}

          {/* 情报列表流 */}
          {renderFeedList()}

          {/* 分页器 */}
          {renderPagination()}
        </>
      ) : (
        <div className="sr-placeholder">
          <div className="sr-placeholder-icon">🚧</div>
          <div className="sr-placeholder-text">
            {PRIMARY_TABS.find(t => t.key === activePrimaryTab)?.label} 功能开发中……
          </div>
        </div>
      )}

      {/* 收藏弹窗 */}
      {renderFavoriteModal()}
    </div>
  );
};

export default SmartRecommend;
