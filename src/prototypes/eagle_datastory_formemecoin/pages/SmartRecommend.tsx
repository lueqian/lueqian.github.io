/**
 * @name 智能推荐页面
 * @description 广州国安定制版 - 智能推荐功能模块
 *
 * 包含：
 * - 一级 Tab：监测视图、高热度、含敏感词、重点源监控、事件看板
 * - 二级 Tab（监测视图下）：广州境外敏感信息、网络结社、破网穿墙等
 * - 广州境外敏感信息内容区：多行筛选器 + 文章卡片列表
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import {
  Input,
  Button,
  Select,
  Switch,
  Tag,
  Pagination,
  Space,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  CopyOutlined,
  PushpinOutlined,
  HeartOutlined,
  DislikeOutlined,
  SendOutlined,
  LinkOutlined,
  EllipsisOutlined,
  FireOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// ============ 常量 ============

const PRIMARY_COLOR = '#3b82f6';

// ============ 一级 Tab 数据 ============

const FIRST_LEVEL_TABS = [
  { key: 'monitor_view', label: '监测视图' },
  { key: 'high_heat', label: '高热度' },
  { key: 'sensitive_words', label: '含敏感词' },
  { key: 'source_monitor', label: '重点源监控', badge: 1159 },
  { key: 'event_board', label: '事件看板' },
];

// ============ 二级 Tab 数据（监测视图下） ============

const SECOND_LEVEL_TABS = [
  { key: 'gz_overseas_sensitive', label: '广州境外敏感信息' },
  { key: 'online_association', label: '网络结社' },
  { key: 'break_firewall', label: '破网穿墙' },
  { key: 'key_public_opinion', label: '重点舆情监测' },
  { key: 'offline_disturbance', label: '涉京线下滋扰类' },
  { key: 'extremism', label: '涉极端类' },
  { key: 'political_crypto', label: '涉政虚拟币' },
  { key: 'ai_disturbance', label: '涉AI滋扰类' },
  { key: 'sensitive_data_leak', label: '涉敏数据泄露' },
];

// ============ 筛选器选项 ============

const POSITION_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'dongguan', label: '东莞' },
];

const MONITOR_STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'unmonitored', label: '未监测' },
  { value: 'monitoring', label: '监测中' },
  { value: 'stopped', label: '已停止' },
];

const TAG_STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'tagged', label: '已打标' },
  { value: 'untagged', label: '未打标' },
];

const INVALID_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'valid', label: '有效' },
  { value: 'invalid', label: '已失效' },
];

const RECOMMEND_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'recommended', label: '推荐' },
  { value: 'not_recommended', label: '不推荐' },
];

const COLLECT_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'collected', label: '已收藏' },
  { value: 'not_collected', label: '未收藏' },
];

const REPORT_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'reported', label: '已报送' },
  { value: 'not_reported', label: '未报送' },
];

const ARTICLE_SOURCE_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'original', label: '原创推荐' },
  { value: 'hot', label: '热度推荐' },
];

const SORT_OPTIONS = [
  { value: 'default', label: '默认排序' },
  { value: 'time_desc', label: '时间倒序' },
  { value: 'time_asc', label: '时间正序' },
  { value: 'heat_desc', label: '热度倒序' },
  { value: 'interaction_desc', label: '互动量倒序' },
];

const INFO_TYPE_OPTIONS = [
  { key: 'original', label: '原创' },
  { key: 'forward', label: '转发' },
  { key: 'comment', label: '评论' },
];

const EMOTION_OPTIONS = [
  { key: 'positive', label: '正面' },
  { key: 'neutral', label: '中性' },
  { key: 'negative', label: '负面' },
];

const FERMENT_OPTIONS = [
  { key: 'first', label: '首次发酵' },
  { key: 'ongoing', label: '持续发酵' },
];

// ============ Mock 文章数据 ============

const MOCK_ARTICLES = [
  {
    id: 1,
    title: '牛腾宇母亲：在五一假期结束后，我将再次奔赴广东，为蒙冤入狱的儿子牛腾宇继续维权',
    infoType: '原创',
    platform: '网易网',
    publishTime: '2025-05-08 17:14:00',
    fans: '--',
    author: '维权之路',
    tags: ['广东', '维权', '茂名', '威胁', '迫害', '酷刑', '广州', '佛山', '杀人', '蒙冤'],
    content: '我为儿子聘请的第16位律师已代理一年有余，但广东当局至今拒绝安排阅卷。此前他们以"需先提交抗诉书才能阅卷"为由推脱，而阅卷与提交抗诉书本无任何关联，这种拖延明显是在耍无赖。一审开庭前，24名孩子的律师仅能看到当局挑选过的部分卷宗，其他材料均以"涉密"为由拒绝提供。大量案件漏洞、错误事实和伪造证据被刻意隐藏。我方律师因无法获取完整案卷，根本无法得知广东当局...',
    similarCount: 2,
    summary: '该文本以当事人亲属名义，描述了广东茂名案件中的法律程序问题，涉及律师阅卷权受限、案件证据不透明等敏感内容，具有一定的维权叙事特征。',
    monitorStatus: '未监测',
    tagStatus: '已打标',
    recommend: true,
    collected: false,
    reported: false,
  },
  {
    id: 2,
    title: '广州某区城管暴力执法视频在网络传播，多名执法人员被指殴打商贩',
    infoType: '原创',
    platform: '微博',
    publishTime: '2025-05-08 15:32:00',
    fans: '12.5万',
    author: '新闻现场',
    tags: ['广州', '城管', '暴力执法', '商贩', '社会事件'],
    content: '5月8日下午，一段广州某区城管与商贩发生冲突的视频在社交媒体上广泛传播。视频显示，多名身穿制服的城管执法人员与一名摆摊商贩发生肢体冲突，商贩倒地后仍被拖拽。周边群众围观并有人呼喊"不要打了"。目前该视频已被转发超过5万次，评论区情绪激烈...',
    similarCount: 5,
    summary: '广州城管暴力执法事件视频传播，涉及社会稳定敏感话题，舆情发酵风险较高。',
    monitorStatus: '监测中',
    tagStatus: '已打标',
    recommend: true,
    collected: true,
    reported: false,
  },
  {
    id: 3,
    title: '境外媒体关注广州某开发区征地补偿纠纷，称当地居民维权遭打压',
    infoType: '转发',
    platform: '推特',
    publishTime: '2025-05-08 14:08:00',
    fans: '3.2万',
    author: 'OverseasWatch',
    tags: ['广州', '征地', '补偿纠纷', '境外关注', '维权'],
    content: '据境外媒体报道，广州某开发区近期发生大规模征地补偿纠纷。当地居民反映补偿标准远低于市场价，多次协商未果后部分居民开始上访维权。报道称，有居民代表在维权过程中遭到当地有关部门的"约谈"和施压。该报道已被多家境外媒体转载，引发国际关注...',
    similarCount: 3,
    summary: '境外媒体关注广州征地纠纷，涉及境外势力借民生问题炒作，需关注舆情走向及境外传播情况。',
    monitorStatus: '未监测',
    tagStatus: '未打标',
    recommend: true,
    collected: false,
    reported: true,
  },
  {
    id: 4,
    title: '佛山一工厂发生化学品泄漏事故，周边居民紧急疏散',
    infoType: '原创',
    platform: '今日头条',
    publishTime: '2025-05-08 12:45:00',
    fans: '8.7万',
    author: '佛山快讯',
    tags: ['佛山', '化学品泄漏', '安全事故', '疏散'],
    content: '今日上午10时许，佛山市顺德区某化工园区内一工厂发生化学品泄漏事故。现场浓烟滚滚，刺鼻气味弥漫。周边3公里范围内居民已被紧急疏散。消防部门已调集12辆消防车赶赴现场处置，目前暂未收到人员伤亡报告。环保部门正在对空气质量进行实时监测...',
    similarCount: 1,
    summary: '佛山化工厂化学品泄漏事故，涉及安全生产和环境保护，需关注舆情反应及官方通报。',
    monitorStatus: '未监测',
    tagStatus: '已打标',
    recommend: false,
    collected: false,
    reported: false,
  },
  {
    id: 5,
    title: '广州南站疑似发生恐怖威胁事件，警方迅速处置排除险情',
    infoType: '原创',
    platform: '微信',
    publishTime: '2025-05-08 11:20:00',
    fans: '45.6万',
    author: '平安广州',
    tags: ['广州', '反恐', '南站', '安全'],
    content: '5月8日上午，广州南站安检口发现一件可疑行李。警方立即启动应急预案，对相关区域进行临时管控。经排爆专业人员检查，确认该行李内无危险物品。目前车站运营已恢复正常秩序。警方提醒广大旅客，切勿携带违禁物品进站乘车...',
    similarCount: 0,
    summary: '广州南站可疑行李事件，警方已排除险情，需关注是否有不实信息传播。',
    monitorStatus: '监测中',
    tagStatus: '已打标',
    recommend: false,
    collected: true,
    reported: true,
  },
];

// ============ 文章卡片操作按钮 ============

const ARTICLE_ACTIONS = [
  { key: 'report', label: '标记报送', icon: <SendOutlined />, type: 'danger-outline' as const },
  { key: 'track', label: '追踪', icon: <EyeOutlined />, type: 'default' as const },
  { key: 'monitor', label: '标记监测', icon: <ExclamationCircleOutlined />, type: 'default' as const },
  { key: 'collect', label: '收藏', icon: <HeartOutlined />, type: 'default' as const },
  { key: 'ignore', label: '不看此信息', icon: <DislikeOutlined />, type: 'default' as const },
  { key: 'push', label: '推送文章', icon: <PushpinOutlined />, type: 'default' as const },
  { key: 'copy', label: '复制信息', icon: <CopyOutlined />, type: 'default' as const },
  { key: 'original', label: '查看原文', icon: <LinkOutlined />, type: 'default' as const },
  { key: 'more', label: '更多', icon: <EllipsisOutlined />, type: 'default' as const },
];

// ============ 未开发占位组件 ============

const UnDevelopedPlaceholder: React.FC<{ tabName: string }> = function ({ tabName }) {
  return (
    <div className="sr-undeveloped">
      <div className="sr-undeveloped-icon">
        <ClockCircleOutlined style={{ fontSize: 48, color: 'rgba(59, 130, 246, 0.3)' }} />
      </div>
      <div className="sr-undeveloped-text">"{tabName}"功能未开发</div>
      <div className="sr-undeveloped-hint">该模块正在规划中，敬请期待</div>
    </div>
  );
};

// ============ 文章卡片组件 ============

const ArticleCard: React.FC<{
  article: typeof MOCK_ARTICLES[0];
  index: number;
}> = function ({ article, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  const infoTypeColor = article.infoType === '原创' ? '#52c41a' : '#1890ff';

  return (
    <div className="sr-article-card">
      {/* 序号 + 标题行 */}
      <div className="sr-article-header">
        <div className="sr-article-index">{index}</div>
        <div className="sr-article-title-row">
          <span className="sr-article-title">{article.title}</span>
          <span className="sr-article-type-tag" style={{ color: infoTypeColor, borderColor: infoTypeColor }}>
            {article.infoType}
          </span>
        </div>
      </div>

      {/* 操作按钮行 */}
      <div className="sr-article-actions">
        {ARTICLE_ACTIONS.map(function (action) {
          const isReportOutline = action.type === 'danger-outline';
          return (
            <span
              key={action.key}
              className={
                'sr-article-action-btn' +
                (isReportOutline ? ' sr-article-action-btn--danger' : '')
              }
            >
              {React.cloneElement(action.icon as React.ReactElement, { style: { fontSize: 12 } })}
              {action.label}
            </span>
          );
        })}
      </div>

      {/* 元信息行 */}
      <div className="sr-article-meta">
        <span>粉丝数: {article.fans}</span>
        <span className="sr-meta-divider">|</span>
        <span>{article.publishTime}</span>
        <span className="sr-meta-divider">|</span>
        <span>📺 {article.platform}</span>
        <span className="sr-meta-divider">|</span>
        <span>🏷️ {article.tags.join(', ')}</span>
      </div>

      {/* 内容预览 */}
      <div className="sr-article-content">
        <div className="sr-article-content-text">{article.content}</div>
        <div className="sr-article-content-thumb">
          <div className="sr-article-thumb-placeholder">
            <EyeOutlined style={{ fontSize: 20, color: '#999' }} />
          </div>
        </div>
      </div>

      {/* 摘要区 */}
      <div className="sr-article-summary">
        <span className="sr-summary-label">摘要：</span>
        {article.summary}
      </div>

      {/* 相似文章 */}
      {article.similarCount > 0 && (
        <div className="sr-article-similar">
          <span
            className="sr-similar-toggle"
            onClick={function () { setShowSimilar(!showSimilar); }}
          >
            相似文章 {article.similarCount}
            {showSimilar ? <UpOutlined style={{ fontSize: 10, marginLeft: 4 }} /> : <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />}
          </span>
          {showSimilar && (
            <div className="sr-similar-list">
              {Array.from({ length: article.similarCount }).map(function (_, i) {
                return (
                  <div key={i} className="sr-similar-item">
                    <span className="sr-similar-dot">·</span>
                    <span className="sr-similar-title">{article.title}（相似转载{i + 1}）</span>
                    <span className="sr-similar-platform">— 微博</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============ 主组件 ============

const SmartRecommend: React.FC = function SmartRecommend() {
  // 一级 Tab
  const [activeFirstTab, setActiveFirstTab] = useState('monitor_view');
  // 二级 Tab
  const [activeSecondTab, setActiveSecondTab] = useState('gz_overseas_sensitive');
  // 筛选器展开状态
  const [filterExpanded, setFilterExpanded] = useState(true);
  // 看板选择
  const [boardType, setBoardType] = useState('all');
  // 平台去重
  const [platformDedup, setPlatformDedup] = useState(true);
  // 只看高负面
  const [highNegativeOnly, setHighNegativeOnly] = useState(false);
  // 选中的信息类型
  const [selectedInfoTypes, setSelectedInfoTypes] = useState<string[]>(['original']);
  // 选中的情感
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  // 选中的发酵状态
  const [selectedFerments, setSelectedFerments] = useState<string[]>([]);

  // 处理一级 Tab 切换
  const handleFirstTabChange = useCallback(function (key: string) {
    setActiveFirstTab(key);
  }, []);

  // 处理二级 Tab 切换
  const handleSecondTabChange = useCallback(function (key: string) {
    setActiveSecondTab(key);
  }, []);

  // 信息类型切换
  const toggleInfoType = useCallback(function (key: string) {
    setSelectedInfoTypes(function (prev) {
      if (prev.includes(key)) {
        return prev.filter(function (k) { return k !== key; });
      }
      return [...prev, key];
    });
  }, []);

  // 情感切换
  const toggleEmotion = useCallback(function (key: string) {
    setSelectedEmotions(function (prev) {
      if (prev.includes(key)) {
        return prev.filter(function (k) { return k !== key; });
      }
      return [...prev, key];
    });
  }, []);

  // 发酵状态切换
  const toggleFerment = useCallback(function (key: string) {
    setSelectedFerments(function (prev) {
      if (prev.includes(key)) {
        return prev.filter(function (k) { return k !== key; });
      }
      return [...prev, key];
    });
  }, []);

  // 获取当前一级 Tab 标签名
  const currentFirstTabLabel = FIRST_LEVEL_TABS.find(function (t) { return t.key === activeFirstTab; })?.label || '';

  // 渲染内容区
  const renderContent = function () {
    // 非监测视图 -> 显示未开发占位
    if (activeFirstTab !== 'monitor_view') {
      return <UnDevelopedPlaceholder tabName={currentFirstTabLabel} />;
    }

    // 监测视图 -> 显示二级 Tab + 内容
    return (
      <div className="sr-monitor-content">
        {/* 二级 Tab 栏 */}
        <div className="sr-second-tabs">
          <div className="sr-second-tabs-scroll">
            {SECOND_LEVEL_TABS.map(function (tab) {
              const isActive = activeSecondTab === tab.key;
              return (
                <div
                  key={tab.key}
                  className={
                    'sr-second-tab' +
                    (isActive ? ' sr-second-tab--active' : '')
                  }
                  onClick={function () { handleSecondTabChange(tab.key); }}
                >
                  {tab.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* 二级 Tab 内容区 */}
        {activeSecondTab === 'gz_overseas_sensitive' ? (
          <GZOverseasSensitivePanel
            filterExpanded={filterExpanded}
            setFilterExpanded={setFilterExpanded}
            boardType={boardType}
            setBoardType={setBoardType}
            platformDedup={platformDedup}
            setPlatformDedup={setPlatformDedup}
            highNegativeOnly={highNegativeOnly}
            setHighNegativeOnly={setHighNegativeOnly}
            selectedInfoTypes={selectedInfoTypes}
            toggleInfoType={toggleInfoType}
            setSelectedInfoTypes={setSelectedInfoTypes}
            selectedEmotions={selectedEmotions}
            toggleEmotion={toggleEmotion}
            setSelectedEmotions={setSelectedEmotions}
            selectedFerments={selectedFerments}
            toggleFerment={toggleFerment}
            setSelectedFerments={setSelectedFerments}
          />
        ) : (
          <UnDevelopedPlaceholder tabName={SECOND_LEVEL_TABS.find(function (t) { return t.key === activeSecondTab; })?.label || ''} />
        )}
      </div>
    );
  };

  return (
    <div className="sr-page">
      {/* 顶部时间范围 */}
      <div className="sr-time-range">
        <ClockCircleOutlined style={{ marginRight: 6, fontSize: 13 }} />
        <span>{dayjs().subtract(7, 'day').format('YYYY-MM-DD')} 00:00:00 ~ {dayjs().format('YYYY-MM-DD')} 23:59:59</span>
      </div>

      {/* 一级 Tab 栏 */}
      <div className="sr-first-tabs">
        {FIRST_LEVEL_TABS.map(function (tab) {
          const isActive = activeFirstTab === tab.key;
          return (
            <div
              key={tab.key}
              className={
                'sr-first-tab' +
                (isActive ? ' sr-first-tab--active' : '')
              }
              onClick={function () { handleFirstTabChange(tab.key); }}
            >
              {tab.label}
              {tab.badge && (
                <span className="sr-first-tab-badge">{tab.badge}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 内容区 */}
      {renderContent()}
    </div>
  );
};

// ============ 广州境外敏感信息面板 ============

const GZOverseasSensitivePanel: React.FC<{
  filterExpanded: boolean;
  setFilterExpanded: (v: boolean) => void;
  boardType: string;
  setBoardType: (v: string) => void;
  platformDedup: boolean;
  setPlatformDedup: (v: boolean) => void;
  highNegativeOnly: boolean;
  setHighNegativeOnly: (v: boolean) => void;
  selectedInfoTypes: string[];
  toggleInfoType: (key: string) => void;
  setSelectedInfoTypes: (v: string[]) => void;
  selectedEmotions: string[];
  toggleEmotion: (key: string) => void;
  setSelectedEmotions: (v: string[]) => void;
  selectedFerments: string[];
  toggleFerment: (key: string) => void;
  setSelectedFerments: (v: string[]) => void;
}> = function ({
  filterExpanded,
  setFilterExpanded,
  boardType,
  setBoardType,
  platformDedup,
  setPlatformDedup,
  highNegativeOnly,
  setHighNegativeOnly,
  selectedInfoTypes,
  toggleInfoType,
  setSelectedInfoTypes,
  selectedEmotions,
  toggleEmotion,
  setSelectedEmotions,
  selectedFerments,
  toggleFerment,
  setSelectedFerments,
}) {
  return (
    <div className="sr-panel">
      {/* 筛选面板 */}
      <div className="sr-filter-panel">
        {/* 看板选择 */}
        <div className="sr-filter-row">
          <span className="sr-filter-label">看板选择:</span>
          <div className="sr-filter-btns">
            <button
              className={'sr-filter-btn' + (boardType === 'all' ? ' sr-filter-btn--active' : '')}
              onClick={function () { setBoardType('all'); }}
            >
              全部
            </button>
            <button
              className={'sr-filter-btn' + (boardType === 'high_interaction' ? ' sr-filter-btn--active' : '')}
              onClick={function () { setBoardType('high_interaction'); }}
            >
              高互动量
            </button>
          </div>
        </div>

        {/* 筛选器主体 */}
        <div className="sr-filter-body">
          {/* 展开/折叠按钮 */}
          <div className="sr-filter-toggle" onClick={function () { setFilterExpanded(!filterExpanded); }}>
            {filterExpanded ? <UpOutlined style={{ fontSize: 12 }} /> : <DownOutlined style={{ fontSize: 12 }} />}
            <span>{filterExpanded ? '收起' : '展开'}</span>
          </div>

          {filterExpanded && (
            <>
              {/* 第一行筛选 */}
              <div className="sr-filter-row">
                <span className="sr-filter-label">阵地选择:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={POSITION_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>监测状态:</span>
                <Select defaultValue="unmonitored" size="small" style={{ width: 100 }} options={MONITOR_STATUS_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>打标状态:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={TAG_STATUS_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>是否失效:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={INVALID_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>是否推荐:</span>
                <Select defaultValue="recommended" size="small" style={{ width: 100 }} options={RECOMMEND_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>是否收藏:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={COLLECT_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>是否报送:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={REPORT_OPTIONS} />
              </div>

              {/* 第二行筛选 */}
              <div className="sr-filter-row">
                <span className="sr-filter-label">原创文章推荐来源:</span>
                <Select defaultValue="all" size="small" style={{ width: 100 }} options={ARTICLE_SOURCE_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>排序条件:</span>
                <Select defaultValue="default" size="small" style={{ width: 120 }} options={SORT_OPTIONS} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>信息类型:</span>
                <div className="sr-filter-chips">
                  <span
                    className={'sr-filter-chip' + (selectedInfoTypes.length === 0 ? ' sr-filter-chip--active' : '')}
                    onClick={function () { setSelectedInfoTypes([]); }}
                  >
                    全选
                  </span>
                  {INFO_TYPE_OPTIONS.map(function (opt) {
                    const isActive = selectedInfoTypes.includes(opt.key);
                    return (
                      <span
                        key={opt.key}
                        className={'sr-filter-chip' + (isActive ? ' sr-filter-chip--active' : '')}
                        onClick={function () { toggleInfoType(opt.key); }}
                      >
                        {opt.label}
                      </span>
                    );
                  })}
                </div>
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>情感:</span>
                <div className="sr-filter-chips">
                  <span
                    className={'sr-filter-chip' + (selectedEmotions.length === 0 ? ' sr-filter-chip--active' : '')}
                    onClick={function () { setSelectedEmotions([]); }}
                  >
                    全选
                  </span>
                  {EMOTION_OPTIONS.map(function (opt) {
                    const isActive = selectedEmotions.includes(opt.key);
                    return (
                      <span
                        key={opt.key}
                        className={'sr-filter-chip' + (isActive ? ' sr-filter-chip--active' : '')}
                        onClick={function () { toggleEmotion(opt.key); }}
                      >
                        {opt.label}
                      </span>
                    );
                  })}
                </div>
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>发酵监测:</span>
                <div className="sr-filter-chips">
                  <span
                    className={'sr-filter-chip' + (selectedFerments.length === 0 ? ' sr-filter-chip--active' : '')}
                    onClick={function () { setSelectedFerments([]); }}
                  >
                    全选
                  </span>
                  {FERMENT_OPTIONS.map(function (opt) {
                    const isActive = selectedFerments.includes(opt.key);
                    return (
                      <span
                        key={opt.key}
                        className={'sr-filter-chip' + (isActive ? ' sr-filter-chip--active' : '')}
                        onClick={function () { toggleFerment(opt.key); }}
                      >
                        {opt.label}
                      </span>
                    );
                  })}
                </div>
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>标签筛选:</span>
                <Button size="small" type="default" icon={<TagOutlined />}>
                  选择标签
                </Button>
              </div>

              {/* 第三行筛选 */}
              <div className="sr-filter-row">
                <span className="sr-filter-label">关键词筛选:</span>
                <Select defaultValue="article" size="small" style={{ width: 100 }} options={[{ value: 'article', label: '筛选文章' }, { value: 'exclude', label: '排除文章' }]} />
                <Input
                  size="small"
                  placeholder="请输入信息关键词搜索，支持表达式"
                  style={{ width: 260, marginLeft: 8 }}
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>排除关键词:</span>
                <Select defaultValue="exclude" size="small" style={{ width: 100 }} options={[{ value: 'article', label: '筛选文章' }, { value: 'exclude', label: '排除文章' }]} />
                <Input
                  size="small"
                  placeholder="请输入信息关键词排除，支持表达式"
                  style={{ width: 260, marginLeft: 8 }}
                  prefix={<SearchOutlined style={{ color: '#999' }} />}
                />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>平台去重:</span>
                <Switch size="small" checked={platformDedup} onChange={setPlatformDedup} />
                <span className="sr-filter-label" style={{ marginLeft: 16 }}>只看高负面:</span>
                <Switch size="small" checked={highNegativeOnly} onChange={setHighNegativeOnly} />
                <Button type="primary" size="small" style={{ marginLeft: 16, backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}>
                  查询
                </Button>
                <Button size="small" style={{ marginLeft: 8 }}>
                  重置
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="sr-article-list">
        <div className="sr-article-list-header">
          共 <span style={{ color: PRIMARY_COLOR, fontWeight: 600 }}>808</span> 条信息
        </div>
        {MOCK_ARTICLES.map(function (article, index) {
          return (
            <ArticleCard key={article.id} article={article} index={index + 1} />
          );
        })}
        {/* 分页 */}
        <div className="sr-pagination">
          <Pagination
            size="small"
            total={808}
            pageSize={20}
            current={1}
            showSizeChanger={false}
            showQuickJumper
            showTotal={function (total) { return '共 ' + total + ' 条'; }}
          />
        </div>
      </div>
    </div>
  );
};

export default SmartRecommend;
