/**
 * @name 重点源管理
 * @description 纯页面组件，包含重点源管理的列表视图和账号详情视图
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import {
  Input,
  Button,
  Avatar,
  Checkbox,
  Pagination,
  Select,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  FileTextOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
  ShareAltOutlined,
  CopyOutlined,
  ExportOutlined,
  PlayCircleOutlined,
  CloudSyncOutlined,
} from '@ant-design/icons';
import CollectTaskDrawer from '../components/CollectTaskDrawer';

// ============ 内容区子Tab ============

const CONTENT_TABS = [
  { key: 'all', label: '全部' },
  { key: 'twitter', label: '推特重点账号' },
  { key: 'government', label: '政府项目' },
];

// ============ 筛选维度选项 ============

const FILTER_DIMENSIONS = [
  { key: 'account', label: '账号维度' },
  { key: 'site', label: '所属站点' },
  { key: 'org_type', label: '组织类型' },
  { key: 'media_type', label: '媒体类型' },
  { key: 'location', label: '归属地' },
  { key: 'industry', label: '行业' },
  { key: 'profession', label: '职业' },
  { key: 'content_type', label: '创作内容类型' },
  { key: 'verify_type', label: '认证类型' },
];

// ============ 排序选项 ============

const SORT_OPTIONS = [
  { key: 'total_followers', label: '总粉丝数' },
  { key: 'media_attr', label: '媒体属性' },
];

// ============ 模拟账号数据 ============

type AccountItem = {
  id: number;
  rank: number;
  avatar: string;
  avatarColor: string;
  avatarLetter: string;
  name: string;
  verified: boolean;
  platform: string;
  platformColor: string;
  platformIcon: string;
  twitterId: string;
  description: string;
  location: string;
  followers: string;
  followersDisplay: string;
  accountType: string;
  mediaRegion: string;
  mediaAttr: string;
  profession: string;
  contentType: string;
  status: 'active' | 'inactive';
};

const MOCK_ACCOUNTS: AccountItem[] = [
  {
    id: 1,
    rank: 1,
    avatar: '',
    avatarColor: '#f472b6',
    avatarLetter: '喵',
    name: '猫咪日常Bot',
    verified: true,
    platform: 'Twitter/X',
    platformColor: '#1DA1F2',
    platformIcon: '𝕏',
    twitterId: '@cat_daily_bot',
    description: '分享全球可爱猫咪的日常，每天更新萌猫图片和视频。专注猫咪内容创作8年，累计获得超过500万次互动。内容涵盖猫咪养护知识、萌猫日常记录、流浪猫救助等。',
    location: '北京市',
    followers: '2,345,678',
    followersDisplay: '234.6 W',
    accountType: 'PGC',
    mediaRegion: '中国大陆',
    mediaAttr: '自媒体',
    profession: 'Creator',
    contentType: 'PGC',
    status: 'active',
  },
  {
    id: 2,
    rank: 2,
    avatar: '',
    avatarColor: '#60a5fa',
    avatarLetter: '科',
    name: '科技前沿资讯',
    verified: true,
    platform: 'Twitter/X',
    platformColor: '#1DA1F2',
    platformIcon: '𝕏',
    twitterId: '@tech_frontier',
    description: '科技前沿资讯，关注AI、区块链、量子计算等前沿技术领域。每日精选全球科技新闻，深度解读行业趋势。',
    location: '上海市',
    followers: '1,876,543',
    followersDisplay: '187.7 W',
    accountType: 'PGC',
    mediaRegion: '中国大陆',
    mediaAttr: '科技媒体',
    profession: 'Creator',
    contentType: 'PGC',
    status: 'active',
  },
  {
    id: 3,
    rank: 3,
    avatar: '',
    avatarColor: '#34d399',
    avatarLetter: '政',
    name: '政府公开信息',
    verified: true,
    platform: 'Twitter/X',
    platformColor: '#1DA1F2',
    platformIcon: '𝕏',
    twitterId: '@gov_public_info',
    description: '政府公开信息发布平台，发布政策解读、政务公开、民生服务等相关信息。权威发布，及时准确。',
    location: '广东省',
    followers: '987,654',
    followersDisplay: '98.8 W',
    accountType: 'OGC',
    mediaRegion: '中国大陆',
    mediaAttr: '政府机构',
    profession: 'Official',
    contentType: 'OGC',
    status: 'active',
  },
  {
    id: 4,
    rank: 4,
    avatar: '',
    avatarColor: '#fbbf24',
    avatarLetter: '财',
    name: '财经观察者',
    verified: false,
    platform: 'Twitter/X',
    platformColor: '#1DA1F2',
    platformIcon: '𝕏',
    twitterId: '@finance_watcher',
    description: '财经观察者，专注宏观经济、股市、基金等领域分析。提供专业的投资参考和市场解读。',
    location: '浙江省',
    followers: '654,321',
    followersDisplay: '65.4 W',
    accountType: 'PGC',
    mediaRegion: '中国大陆',
    mediaAttr: '财经媒体',
    profession: 'Creator',
    contentType: 'PGC',
    status: 'active',
  },
  {
    id: 5,
    rank: 5,
    avatar: '',
    avatarColor: '#a78bfa',
    avatarLetter: '文',
    name: '文化传承与艺术分享',
    verified: true,
    platform: 'Twitter/X',
    platformColor: '#1DA1F2',
    platformIcon: '𝕏',
    twitterId: '@culture_art_cn',
    description: '文化传承与艺术分享，关注传统文化、非遗保护、当代艺术等领域。用文字记录美好，用镜头捕捉感动。',
    location: '江苏省',
    followers: '432,109',
    followersDisplay: '43.2 W',
    accountType: 'UGC',
    mediaRegion: '中国大陆',
    mediaAttr: '文化博主',
    profession: 'Creator',
    contentType: 'UGC',
    status: 'inactive',
  },
];

// ============ 模拟发文数据 ============

type PostItem = {
  id: number;
  content: string;
  hasLink: boolean;
  linkText: string;
  hasMedia: boolean;
  mediaType: 'image' | 'video';
  hasImageRecognition: boolean;
  recognitionTitle: string;
  recognitionContent: string;
  recognitionRating: number;
  isOriginal: boolean;
  publishTime: string;
  source: string;
  reads: number;
  interactions: number;
  comments: number;
  shares: number;
  likes: number;
};

const MOCK_POSTS: PostItem[] = [
  {
    id: 1,
    content: '今天分享一组超可爱的布偶猫照片！🐱 这只小布偶叫"棉花糖"，今年才2岁，性格超级温顺，最喜欢趴在窗台上看外面的世界。你们家的猫咪也有这样的习惯吗？',
    hasLink: true,
    linkText: 'https://twitter.com/cat_daily_bot/status/189012345678',
    hasMedia: true,
    mediaType: 'image',
    hasImageRecognition: true,
    recognitionTitle: '布偶猫品种识别报告',
    recognitionContent: '经AI识别，该图片中包含布偶猫（Ragdoll），置信度92.3%，品种特征：蓝双色被毛...',
    recognitionRating: 4,
    isOriginal: true,
    publishTime: '2026-04-18 16:00:00',
    source: '偷乐星球',
    reads: 128456,
    interactions: 7504,
    comments: 342,
    shares: 89,
    likes: 7073,
  },
  {
    id: 2,
    content: '【猫咪养护小贴士】夏天到了，猫咪的饮水量需要特别注意！建议每天给猫咪准备新鲜干净的水，可以尝试使用流动饮水机来吸引猫咪多喝水。另外，适当增加湿粮的比例也有助于补充水分。',
    hasLink: false,
    linkText: '',
    hasMedia: true,
    mediaType: 'video',
    hasImageRecognition: false,
    recognitionTitle: '',
    recognitionContent: '',
    recognitionRating: 0,
    isOriginal: true,
    publishTime: '2026-04-17 10:30:00',
    source: '微博',
    reads: 89723,
    interactions: 4215,
    comments: 198,
    shares: 56,
    likes: 3961,
  },
  {
    id: 3,
    content: '转发：@AnimalRescueCN 救助了一只被遗弃在路边的橘猫幼崽，目前已经送到宠物医院进行检查和治疗。感谢所有参与救助的志愿者们！🙏 如果你也想帮助流浪猫，请联系当地的动物救助组织。',
    hasLink: true,
    linkText: 'https://weibo.com/animalrescue/status/1789564321',
    hasMedia: false,
    mediaType: 'image',
    hasImageRecognition: true,
    recognitionTitle: '橘猫幼崽健康评估',
    recognitionContent: '经AI识别，图片中为橘猫幼崽，约2-3月龄，健康状况需进一步医学检查...',
    recognitionRating: 3,
    isOriginal: false,
    publishTime: '2026-04-16 20:15:00',
    source: '偷乐星球',
    reads: 234567,
    interactions: 15678,
    comments: 892,
    shares: 1234,
    likes: 13552,
  },
  {
    id: 4,
    content: '周末带"棉花糖"去公园散步啦！🌸 春天的公园真的太美了，樱花盛开，到处都是粉色的花瓣。棉花糖第一次看到蝴蝶，好奇地追了好久，最后累得趴在地上喘气，太搞笑了哈哈。',
    hasLink: false,
    linkText: '',
    hasMedia: true,
    mediaType: 'image',
    hasImageRecognition: false,
    recognitionTitle: '',
    recognitionContent: '',
    recognitionRating: 0,
    isOriginal: true,
    publishTime: '2026-04-15 14:22:00',
    source: '小红书',
    reads: 67890,
    interactions: 3456,
    comments: 167,
    shares: 45,
    likes: 3244,
  },
];

// ============ 列表视图组件 ============

const ListView: React.FC<{
  onEnterDetail: (id: number) => void;
}> = ({ onEnterDetail }) => {
  const [activeContentTab, setActiveContentTab] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeFilterDimension, setActiveFilterDimension] = useState<string>('account');
  const [activeSort, setActiveSort] = useState<string>('total_followers');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);

  const handleSearch = useCallback(function () {
    console.log('搜索:', searchKeyword);
  }, [searchKeyword]);

  const handleSelectAll = useCallback(function (checked: boolean) {
    if (checked) {
      setSelectedAccounts(MOCK_ACCOUNTS.map(function (a) { return a.id; }));
    } else {
      setSelectedAccounts([]);
    }
  }, []);

  const handleSelectOne = useCallback(function (id: number, checked: boolean) {
    if (checked) {
      setSelectedAccounts(function (prev) { return [...prev, id]; });
    } else {
      setSelectedAccounts(function (prev) { return prev.filter(function (i) { return i !== id; }); });
    }
  }, []);

  return (
    <div className="ks-content">
      {/* 内容区子Tab + 操作按钮 */}
      <div className="ks-content-header">
        <div className="ks-content-tabs">
          {CONTENT_TABS.map(function (tab) {
            return (
              <div
                key={tab.key}
                className={'ks-content-tab' + (activeContentTab === tab.key ? ' ks-content-tab--active' : '')}
                onClick={function () { setActiveContentTab(tab.key); }}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
        <div className="ks-content-actions">
          <Button type="link" size="small" className="ks-action-link">批量设置目录范围</Button>
          <Button type="link" size="small" className="ks-action-link">管理目录</Button>
        </div>
      </div>

      {/* 搜索 & 筛选区 */}
      <div className="ks-filter-card">
        <div className="ks-search-row">
          <span className="ks-filter-label">搜索关键词:</span>
          <Input
            placeholder="输入账号关键词搜索"
            className="ks-search-input"
            value={searchKeyword}
            onChange={function (e) { setSearchKeyword(e.target.value); }}
            onPressEnter={handleSearch}
            maxLength={500}
            suffix={<span className="ks-char-count">{searchKeyword.length}/500</span>}
          />
          <Button type="primary" className="ks-search-btn" onClick={handleSearch}>
            <SearchOutlined /> 搜索
          </Button>
        </div>
        <div className="ks-filter-dimension-row">
          <span className="ks-filter-label">筛选:</span>
          <div className="ks-filter-dimensions">
            {FILTER_DIMENSIONS.map(function (dim) {
              return (
                <div
                  key={dim.key}
                  className={'ks-filter-dim-tag' + (activeFilterDimension === dim.key ? ' ks-filter-dim-tag--active' : '')}
                  onClick={function () { setActiveFilterDimension(dim.key); }}
                >
                  {dim.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="ks-filter-extra-row">
          <span className="ks-filter-label">粉丝数:</span>
          <div className="ks-filter-fans">
            <Input placeholder="最小值" size="small" className="ks-fans-input" />
            <span className="ks-fans-separator">-</span>
            <Input placeholder="最大值" size="small" className="ks-fans-input" />
          </div>
        </div>
        <div className="ks-sort-row">
          <span className="ks-filter-label">排序方式:</span>
          <div className="ks-sort-options">
            {SORT_OPTIONS.map(function (opt) {
              return (
                <div
                  key={opt.key}
                  className={'ks-sort-tag' + (activeSort === opt.key ? ' ks-sort-tag--active' : '')}
                  onClick={function () { setActiveSort(opt.key); }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 账号列表 */}
      <div className="ks-account-list">
        {MOCK_ACCOUNTS.map(function (account) {
          var isSelected = selectedAccounts.includes(account.id);
          return (
            <div key={account.id} className={'ks-account-card' + (isSelected ? ' ks-account-card--selected' : '')} onClick={function () { onEnterDetail(account.id); }}>
              <div className="ks-account-left">
                <Checkbox
                  checked={isSelected}
                  onChange={function (e) { e.stopPropagation(); handleSelectOne(account.id, e.target.checked); }}
                  className="ks-account-checkbox"
                />
                <span className="ks-account-rank">{account.rank}</span>
                <Avatar
                  size={56}
                  className="ks-account-avatar"
                  style={{
                    backgroundColor: account.avatarColor,
                    fontSize: 20,
                    fontWeight: 600,
                    borderRadius: 10,
                  }}
                >
                  {account.avatarLetter}
                </Avatar>
              </div>
              <div className="ks-account-info">
                <div className="ks-account-name-row">
                  <span
                    className="ks-account-name ks-account-name--link"
                    onClick={function () { onEnterDetail(account.id); }}
                  >
                    {account.name}
                  </span>
                  <span className="ks-account-type-tag">{account.accountType}</span>
                </div>
                <div className="ks-account-platform-row">
                  <span className="ks-account-platform-icon" style={{ color: account.platformColor }}>
                    {account.platformIcon}
                  </span>
                  <span className="ks-account-platform-id">
                    {account.platform} ID: {account.twitterId}
                  </span>
                </div>
                <div className="ks-account-desc">{account.description}</div>
              </div>
              <div className="ks-account-right">
                <div className="ks-account-fans-data">
                  <div className="ks-fans-number">{account.followersDisplay}</div>
                  <div className="ks-fans-label">总粉丝数</div>
                </div>
                <div className="ks-account-text-actions">
                  <span className="ks-text-action-btn">账号分析</span>
                  <span className="ks-text-action-btn" onClick={function () { onEnterDetail(account.id); }}>查看主页</span>
                  <span className="ks-text-action-btn">更多操作</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分页 */}
      <div className="ks-pagination-bar">
        <div className="ks-pagination-left">
          <span className="ks-pagination-info">共 5 条数据</span>
        </div>
        <div className="ks-pagination-right">
          <Pagination
            current={currentPage}
            pageSize={10}
            total={5}
            size="small"
            showSizeChanger={false}
            onChange={function (page) { setCurrentPage(page); }}
          />
        </div>
      </div>
    </div>
  );
};

// ============ 详情视图组件 ============

const DetailView: React.FC<{
  account: AccountItem;
  onBack: () => void;
}> = ({ account, onBack }) => {
  const [activeDetailTab, setActiveDetailTab] = useState<string>('posts');
  const [detailSort, setDetailSort] = useState<string>('time');
  const [detailKeyword, setDetailKeyword] = useState<string>('');
  const [detailPage, setDetailPage] = useState<number>(1);
  const [collectDrawerOpen, setCollectDrawerOpen] = useState(false);
  const [collectInitialValues, setCollectInitialValues] = useState<any>(null);

  const handleCreateCollectTask = useCallback(function () {
    setCollectInitialValues({
      task_name: account.name,
      scope_type: 'source' as const,
      related_source: account.name,
    });
    setCollectDrawerOpen(true);
  }, [account.name]);

  const renderStars = function (rating: number) {
    var stars = '';
    for (var i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆';
    }
    return stars;
  };

  return (
    <div className="ks-detail-view">
      {/* 返回按钮 */}
      <div className="ks-detail-back">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          className="ks-detail-back-btn"
          onClick={onBack}
        >
          返回列表
        </Button>
      </div>

      <div className="ks-detail-body">
        {/* ===== 左侧 Profile Sider ===== */}
        <div className="ks-profile-sider">
          {/* 头像 */}
          <div className="ks-profile-avatar-section">
            <Avatar
              size={100}
              className="ks-profile-avatar"
              style={{
                backgroundColor: account.avatarColor,
                fontSize: 36,
                fontWeight: 600,
              }}
            >
              {account.avatarLetter}
            </Avatar>
            <div className="ks-profile-name">{account.name}</div>
            <div className="ks-profile-platform-id">
              <span className="ks-profile-platform-icon" style={{ color: account.platformColor }}>
                {account.platformIcon}
              </span>
              <span className="ks-profile-id-text">{account.twitterId}</span>
            </div>
            <div className="ks-profile-link">
              <LinkOutlined style={{ fontSize: 12, marginRight: 4 }} />
              <a href="#" className="ks-profile-link-text" onClick={function (e) { e.preventDefault(); }}>
                {account.platform} 主页
              </a>
            </div>
          </div>

          {/* 简介 */}
          <div className="ks-profile-bio-section">
            <div className="ks-profile-bio-label">用户简介</div>
            <div className="ks-profile-bio-text">{account.description}</div>
          </div>

          {/* 属性列表 */}
          <div className="ks-profile-attrs-section">
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">媒体地域</span>
              <span className="ks-profile-attr-value">{account.mediaRegion}</span>
            </div>
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">媒体属性</span>
              <span className="ks-profile-attr-value">{account.mediaAttr}</span>
            </div>
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">职业</span>
              <span className="ks-profile-attr-value">{account.profession}</span>
            </div>
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">创作内容类型</span>
              <span className="ks-profile-attr-value">{account.contentType}</span>
            </div>
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">总粉丝数</span>
              <span className="ks-profile-attr-value">{account.followersDisplay}</span>
            </div>
            <div className="ks-profile-attr-item">
              <span className="ks-profile-attr-label">账号状态</span>
              <span className={'ks-profile-attr-value ' + (account.status === 'active' ? 'ks-status-active' : 'ks-status-inactive')}>
                {account.status === 'active' ? '活跃' : '不活跃'}
              </span>
            </div>
          </div>
        </div>

        {/* ===== 右侧主内容区 ===== */}
        <div className="ks-detail-main">
          {/* Tabs */}
          <div className="ks-detail-tabs">
            <div
              className={'ks-detail-tab' + (activeDetailTab === 'posts' ? ' ks-detail-tab--active' : '')}
              onClick={function () { setActiveDetailTab('posts'); }}
            >
              最近发文
            </div>
            <div
              className={'ks-detail-tab' + (activeDetailTab === 'report' ? ' ks-detail-tab--active' : '')}
              onClick={function () { setActiveDetailTab('report'); }}
            >
              报告分析
            </div>
          </div>

          {/* 筛选工具栏 */}
          <div className="ks-detail-toolbar">
            <div className="ks-toolbar-row">
              <span className="ks-toolbar-label">选择时间:</span>
              <DatePicker size="small" className="ks-toolbar-datepicker" placeholder="开始日期" />
              <span className="ks-toolbar-sep">至</span>
              <DatePicker size="small" className="ks-toolbar-datepicker" placeholder="结束日期" />
              <span className="ks-toolbar-label" style={{ marginLeft: 16 }}>文章类型:</span>
              <Select size="small" className="ks-toolbar-select" defaultValue="all"
                options={[
                  { value: 'all', label: '全部' },
                  { value: 'original', label: '原创' },
                  { value: 'repost', label: '转发' },
                ]}
              />
              <span className="ks-toolbar-label" style={{ marginLeft: 16 }}>排序条件:</span>
              <div className="ks-toolbar-sort-btns">
                <div
                  className={'ks-toolbar-sort-btn' + (detailSort === 'time' ? ' ks-toolbar-sort-btn--active' : '')}
                  onClick={function () { setDetailSort('time'); }}
                >
                  时间
                </div>
                <div
                  className={'ks-toolbar-sort-btn' + (detailSort === 'interaction' ? ' ks-toolbar-sort-btn--active' : '')}
                  onClick={function () { setDetailSort('interaction'); }}
                >
                  互动量
                </div>
              </div>
            </div>
            <div className="ks-toolbar-row">
              <span className="ks-toolbar-label">关键词筛选:</span>
              <Input
                size="small"
                className="ks-toolbar-search-input"
                placeholder="请输入信息关键词搜索"
                prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                value={detailKeyword}
                onChange={function (e) { setDetailKeyword(e.target.value); }}
              />
              <Button type="primary" size="small" className="ks-toolbar-query-btn">查询</Button>
              <Button size="small" className="ks-toolbar-reset-btn">重置</Button>
            </div>
          </div>

          {/* 发文列表 */}
          <div className="ks-post-list">
            {MOCK_POSTS.map(function (post, idx) {
              return (
                <div key={post.id} className="ks-post-card">
                  {/* Header */}
                  <div className="ks-post-header">
                    <div className="ks-post-header-left">
                      <span className="ks-post-index">{idx + 1}</span>
                      <Avatar
                        size={36}
                        className="ks-post-avatar"
                        style={{
                          backgroundColor: account.avatarColor,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {account.avatarLetter}
                      </Avatar>
                      <div className="ks-post-header-info">
                        <div className="ks-post-header-row1">
                          <span className="ks-post-author">{account.name}</span>
                          {post.isOriginal && <span className="ks-post-original-tag">原创</span>}
                          <span className="ks-post-fans">粉丝数: {account.followersDisplay}</span>
                        </div>
                        <div className="ks-post-header-row2">
                          <span className="ks-post-time">{post.publishTime}</span>
                          <span className="ks-post-platform-icon" style={{ color: account.platformColor }}>
                            {account.platformIcon}
                          </span>
                          <span className="ks-post-source-tag">{post.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ks-post-header-actions">
                      <div className="ks-post-stats">
                        <span className="ks-post-stat">
                          <ShareAltOutlined style={{ fontSize: 13 }} />
                          <span>{post.shares.toLocaleString()}</span>
                        </span>
                        <span className="ks-post-stat">
                          <EyeOutlined style={{ fontSize: 13 }} />
                          <span>{post.reads.toLocaleString()}</span>
                        </span>
                        <span className="ks-post-stat">
                          <MessageOutlined style={{ fontSize: 13 }} />
                          <span>{post.comments.toLocaleString()}</span>
                        </span>
                        <span className="ks-post-stat">
                          <LikeOutlined style={{ fontSize: 13 }} />
                          <span>{post.likes.toLocaleString()}</span>
                        </span>
                      </div>
                      <span className="ks-post-action-link"><CopyOutlined style={{ marginRight: 3 }} />复制信息</span>
                      <span className="ks-post-action-link"><ExportOutlined style={{ marginRight: 3 }} />查看原文</span>
                      <span className="ks-post-action-link" onClick={handleCreateCollectTask}><CloudSyncOutlined style={{ marginRight: 3 }} />创建采集任务</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="ks-post-body">
                    <div className="ks-post-text">
                      {post.content}
                      {post.hasLink && (
                        <div className="ks-post-link">
                          <LinkOutlined style={{ fontSize: 12, marginRight: 4 }} />
                          <span className="ks-post-link-text">{post.linkText}</span>
                        </div>
                      )}
                    </div>

                    {/* 媒体 + 图片识别区 */}
                    {(post.hasMedia || post.hasImageRecognition) && (
                      <div className="ks-post-media-section">
                        {post.hasImageRecognition && (
                          <div className="ks-post-recognition">
                            <div className="ks-recognition-item">
                              <FileTextOutlined style={{ fontSize: 14, color: '#3b82f6', marginRight: 6, flexShrink: 0 }} />
                              <span className="ks-recognition-rating">{renderStars(post.recognitionRating)}</span>
                              <span className="ks-recognition-title">{post.recognitionTitle}</span>
                            </div>
                            <div className="ks-recognition-item">
                              <FileTextOutlined style={{ fontSize: 14, color: '#3b82f6', marginRight: 6, flexShrink: 0 }} />
                              <span className="ks-recognition-content">{post.recognitionContent}</span>
                              <span className="ks-recognition-more">查看全部</span>
                            </div>
                          </div>
                        )}
                        {post.hasMedia && (
                          <div className="ks-post-media-thumb">
                            <div
                              className="ks-media-thumb-inner"
                              style={{ backgroundColor: account.avatarColor + '33' }}
                            >
                              {post.mediaType === 'video' && (
                                <div className="ks-media-play-icon">
                                  <PlayCircleOutlined style={{ fontSize: 28, color: '#fff' }} />
                                </div>
                              )}
                              <span className="ks-media-thumb-text">
                                {post.mediaType === 'video' ? '视频附件' : '图片附件'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* 分页器 */}
          <div className="ks-detail-pagination">
            <Pagination
              current={detailPage}
              pageSize={20}
              total={360}
              size="small"
              showSizeChanger
              showQuickJumper
              showTotal={function (total) { return '共 ' + total + ' 条'; }}
              pageSizeOptions={['10', '20', '50']}
              onChange={function (page) { setDetailPage(page); }}
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
    </div>
  );
};

// ============ 主组件 ============

const Sources: React.FC = () => {
  const [isDetailView, setIsDetailView] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const handleEnterDetail = useCallback(function (id: number) {
    setSelectedAccountId(id);
    setIsDetailView(true);
  }, []);

  const handleBackToList = useCallback(function () {
    setIsDetailView(false);
    setSelectedAccountId(null);
  }, []);

  // 查找当前选中的账号
  var currentAccount = selectedAccountId
    ? MOCK_ACCOUNTS.find(function (a) { return a.id === selectedAccountId; })
    : null;

  if (isDetailView && currentAccount) {
    return <DetailView account={currentAccount} onBack={handleBackToList} />;
  }

  return <ListView onEnterDetail={handleEnterDetail} />;
};

export default Sources;
