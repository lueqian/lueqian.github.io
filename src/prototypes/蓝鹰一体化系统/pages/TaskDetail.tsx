import React, { useState } from 'react';
import {
  Button,
  Tag,
  Avatar,
  Input,
  Badge,
  Tabs,
  Dropdown,
  Space,
} from 'antd';
import {
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  MoreOutlined,
  StarFilled,
  StarOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BellOutlined,
  CloseOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { TabPane } = Tabs;

// ==================== 模拟数据 ====================

interface TaskInfo {
  id: string;
  code: string;
  name: string;
  status: string;
  department: string;
  keywords: string[];
  createTime: string;
  eventCount: number;
  trend: number;
}

interface EventItem {
  id: string;
  seq: number;
  title: string;
  author: string;
  authorAvatar?: string;
  platform: string;
  platformIcon: string;
  publishTime: string;
  content: string;
  images: string[];
  videoUrl?: string;
  views: number;
  comments: number;
  likes: number;
  shares: number;
  heatLevel: 'high' | 'medium' | 'low';
  heatValue: number;
  isWaring: boolean;
  tags: string[];
  dataSource: string;
  sentimentIndex: number;
  starRating: number;
}

interface SideTask {
  id: string;
  code: string;
  name: string;
  status: string;
  eventCount: number;
  isActive: boolean;
}

// 当前任务信息
const currentTask: TaskInfo = {
  id: '1',
  code: '0510',
  name: '淮安汛情',
  status: 'normal',
  department: '支队',
  keywords: ['淮安', '汛情', '洪水', '暴雨', '防汛'],
  createTime: '2024-05-10 09:30:00',
  eventCount: 156,
  trend: 12,
};

// 侧边任务列表
const sideTasks: SideTask[] = [
  { id: '1', code: '0510', name: '淮安汛情', status: 'normal', eventCount: 156, isActive: true },
  { id: '2', code: '0118', name: '高张花园', status: 'normal', eventCount: 89, isActive: false },
  { id: '3', code: '0322', name: '交通事故', status: 'urgent', eventCount: 234, isActive: false },
  { id: '4', code: '0405', name: '校园安全', status: 'normal', eventCount: 45, isActive: false },
  { id: '5', code: '0512', name: '食品安全', status: 'normal', eventCount: 78, isActive: false },
];

// 事件列表数据
const eventList: EventItem[] = [
  {
    id: '1',
    seq: 1,
    title: '淮安遭遇特大暴雨，多个路段积水严重',
    author: '淮安发布',
    platform: '微博',
    platformIcon: 'weibo',
    publishTime: '2024-05-10 14:30:00',
    content: '今日下午，淮安市遭遇特大暴雨袭击，市区多个路段出现严重积水，部分低洼地区水深超过50厘米。市防汛指挥部已启动应急响应，相关部门正在全力排水抢险。请市民注意出行安全，尽量避开积水路段。',
    images: [],
    views: 12580,
    comments: 342,
    likes: 156,
    shares: 89,
    heatLevel: 'high',
    heatValue: 98,
    isWaring: true,
    tags: ['暴雨', '积水', '防汛'],
    dataSource: '微博采集',
    sentimentIndex: 85,
    starRating: 5,
  },
  {
    id: '2',
    seq: 2,
    title: '淮安市防汛指挥部发布紧急通知',
    author: '淮安日报',
    platform: '新闻',
    platformIcon: 'news',
    publishTime: '2024-05-10 15:00:00',
    content: '针对当前严峻的防汛形势，淮安市防汛指挥部发布紧急通知，要求各级部门加强值班值守，做好应急准备。同时提醒广大市民关注天气变化，做好防范措施。',
    images: [],
    views: 8930,
    comments: 128,
    likes: 234,
    shares: 156,
    heatLevel: 'high',
    heatValue: 92,
    isWaring: false,
    tags: ['通知', '防汛'],
    dataSource: '新闻采集',
    sentimentIndex: 72,
    starRating: 4,
  },
  {
    id: '3',
    seq: 3,
    title: '网友实拍：淮安某小区地下车库进水',
    author: '市民小王',
    platform: '抖音',
    platformIcon: 'douyin',
    publishTime: '2024-05-10 15:30:00',
    content: '刚才拍的，我们小区地下车库已经开始进水了，物业正在组织业主转移车辆。希望雨快点停吧！',
    images: [],
    videoUrl: 'video1',
    views: 5670,
    comments: 456,
    likes: 89,
    shares: 234,
    heatLevel: 'medium',
    heatValue: 78,
    isWaring: true,
    tags: ['积水', '小区'],
    dataSource: '短视频采集',
    sentimentIndex: 65,
    starRating: 3,
  },
  {
    id: '4',
    seq: 4,
    title: '淮安暴雨中的暖心瞬间：交警冒雨疏导交通',
    author: '淮安交警',
    platform: '微信',
    platformIcon: 'wechat',
    publishTime: '2024-05-10 16:00:00',
    content: '暴雨中，淮安交警坚守岗位，冒雨疏导交通，帮助受困群众。向奋战在一线的交警同志致敬！',
    images: [],
    views: 3450,
    comments: 89,
    likes: 567,
    shares: 123,
    heatLevel: 'medium',
    heatValue: 65,
    isWaring: false,
    tags: ['交警', '正能量'],
    dataSource: '微信采集',
    sentimentIndex: 45,
    starRating: 2,
  },
  {
    id: '5',
    seq: 5,
    title: '淮安市气象台发布暴雨红色预警',
    author: '淮安气象',
    platform: '微博',
    platformIcon: 'weibo',
    publishTime: '2024-05-10 16:30:00',
    content: '淮安市气象台2024年5月10日16时30分发布暴雨红色预警信号：预计未来3小时我市部分地区降雨量将达100毫米以上，请注意防范。',
    images: [],
    views: 2340,
    comments: 67,
    likes: 45,
    shares: 89,
    heatLevel: 'low',
    heatValue: 45,
    isWaring: false,
    tags: ['预警', '气象'],
    dataSource: '微博采集',
    sentimentIndex: 38,
    starRating: 2,
  },
];

// ==================== 辅助函数 ====================

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const formatTime = (timeStr: string): string => {
  const now = new Date();
  const publish = new Date(timeStr);
  const diff = now.getTime() - publish.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return timeStr.split(' ')[0];
};

const getHeatColor = (level: string): string => {
  switch (level) {
    case 'high':
      return '#ff4d4f';
    case 'medium':
      return '#faad14';
    case 'low':
      return '#52c41a';
    default:
      return '#999';
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case '微博':
      return <span className="platform-icon-weibo">微</span>;
    case '抖音':
      return <span className="platform-icon-douyin">抖</span>;
    case '微信':
      return <span className="platform-icon-wechat">微</span>;
    case '新闻':
      return <span className="platform-icon-news">新</span>;
    default:
      return <span className="platform-icon-default">网</span>;
  }
};

// ==================== 组件 ====================

interface TaskDetailProps {
  taskId?: string;
  onBack?: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onBack }) => {
  const [activeSideTask, setActiveSideTask] = useState(taskId || '1');
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 更多操作菜单
  const moreMenuItems: MenuProps['items'] = [
    { key: 'collect', label: '收藏' },
    { key: 'report', label: '上报' },
    { key: 'share', label: '分享' },
    { key: 'delete', label: '删除', danger: true },
  ];

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="star-rating-detail">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
            {star <= rating ? <StarFilled /> : <StarOutlined />}
          </span>
        ))}
        <span className="rating-text">{rating}级</span>
      </div>
    );
  };

  // 渲染事件卡片
  const renderEventCard = (event: EventItem) => (
    <div key={event.id} className="event-detail-card">
      {/* 头部信息 */}
      <div className="event-card-header">
        <div className="event-header-left">
          <span className="event-seq">{event.seq}</span>
          <h3 className="event-title">{event.title}</h3>
          {event.isWaring && (
            <Tag color="error" className="warning-tag">
              <ExclamationCircleOutlined /> 预警
            </Tag>
          )}
        </div>
        <div className="event-header-right">
          {renderStars(event.starRating)}
          <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
            <Button type="text" size="small" className="more-btn">
              <MoreOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* 作者信息 */}
      <div className="event-author-row">
        <Avatar size="small" icon={<UserOutlined />} className="author-avatar-detail" />
        <span className="author-name-detail">{event.author}</span>
        <span className="post-id">ID: 123456789</span>
        <span className="heat-num-detail" style={{ color: getHeatColor(event.heatLevel) }}>
          <BarChartOutlined /> 热度 {event.heatValue}
        </span>
        <span className="platform-detail">
          {getPlatformIcon(event.platform)} {event.platform}
        </span>
        <span className="post-time-detail">
          <ClockCircleOutlined /> {formatTime(event.publishTime)}
        </span>
      </div>

      {/* 内容 */}
      <div className="event-content">
        <p>{event.content}</p>
      </div>

      {/* 视频/图片 */}
      {event.videoUrl && (
        <div className="event-media">
          <div className="video-preview-detail">
            <CaretRightOutlined className="play-icon-detail" />
            <span className="video-duration">00:32</span>
          </div>
        </div>
      )}

      {/* AI 摘要 */}
      <div className="ai-summary-detail">
        <div className="ai-badge-detail">AI</div>
        <span className="summary-label">摘要：</span>
        <span className="summary-text">该内容涉及淮安暴雨汛情，反映市区积水情况，建议关注后续发展。</span>
      </div>

      {/* AI 研判 */}
      <div className="ai-analysis-detail">
        <div className="ai-badge-detail">AI</div>
        <span className="analysis-label">研判：</span>
        <span className="analysis-text">该舆情为自然灾害类，目前呈上升趋势，建议相关部门及时发布权威信息，回应社会关切。</span>
      </div>

      {/* 底部信息 */}
      <div className="event-footer">
        <div className="footer-left-detail">
          <span className="data-source-label">数据来源：</span>
          <Tag className="source-tag-detail">{event.dataSource}</Tag>
          {event.tags.map((tag) => (
            <Tag key={tag} className="info-tag-detail">{tag}</Tag>
          ))}
          <Tag className="video-tag-detail">视频</Tag>
        </div>
        <div className="footer-right-detail">
          <Button type="text" size="small" className="status-btn-detail">
            待处理
          </Button>
          <Button type="link" size="small" className="detail-btn">
            查看详情
          </Button>
          <Button type="primary" size="small" className="ai-btn-detail">
            AI辅助研判
          </Button>
        </div>
      </div>

      {/* 舆情指数 */}
      <div className="sentiment-index-detail">
        <div className="index-value-detail">{event.sentimentIndex}</div>
        <div className="index-label">舆情指数</div>
      </div>
    </div>
  );

  return (
    <div className="task-detail-page">
      {/* 左侧内容区 */}
      <div className="task-content">
        {/* 顶部导航栏 */}
        <div className="detail-top-bar">
          <div className="top-bar-left">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={onBack}
              className="back-btn"
            >
              返回
            </Button>
            <div className="task-info-breadcrumb">
              <span className="task-code-breadcrumb">{currentTask.code}</span>
              <span className="task-name-breadcrumb">{currentTask.name}</span>
              <Tag className="status-tag-breadcrumb">常态</Tag>
            </div>
          </div>
          <div className="top-bar-right">
            <div className="task-stats">
              <span className="stat-item">
                <FileTextOutlined /> 事件 {currentTask.eventCount}
              </span>
              <span className="stat-item">
                <BarChartOutlined /> 趋势
                {currentTask.trend > 0 ? (
                  <ArrowUpOutlined className="trend-up" />
                ) : currentTask.trend < 0 ? (
                  <ArrowDownOutlined className="trend-down" />
                ) : (
                  <MinusOutlined className="trend-flat" />
                )}
              </span>
            </div>
            <div className="task-keywords">
              <span className="keywords-label">关键词：</span>
              {currentTask.keywords.map((kw) => (
                <Tag key={kw} className="keyword-tag">{kw}</Tag>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索筛选栏 */}
        <div className="detail-filter-bar">
          <div className="filter-search">
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索事件内容"
              className="event-search-input"
            />
          </div>
          <div className="filter-actions-detail">
            <Button icon={<FilterOutlined />}>筛选</Button>
            <Button>排序 <DownOutlined /></Button>
            <Button>时间 <DownOutlined /></Button>
          </div>
        </div>

        {/* 分类Tab */}
        <div className="detail-tabs-bar">
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="detail-tabs">
            <TabPane tab="全部" key="all" />
            <TabPane tab="微博" key="weibo" />
            <TabPane tab="抖音" key="douyin" />
            <TabPane tab="微信" key="wechat" />
            <TabPane tab="新闻" key="news" />
            <TabPane tab="预警" key="warning" />
          </Tabs>
          <div className="tabs-extra">
            <span className="total-count">共 {eventList.length} 条</span>
          </div>
        </div>

        {/* 事件列表 */}
        <div className="event-list-container">
          {eventList.map((event) => renderEventCard(event))}
        </div>
      </div>

      {/* 右侧任务列表 */}
      <div className="task-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">任务列表</h3>
          <Badge count={sideTasks.length} className="task-count-badge" />
        </div>
        <div className="sidebar-search">
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索任务"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="sidebar-search-input"
          />
        </div>
        <div className="task-list">
          {sideTasks.map((task) => (
            <div
              key={task.id}
              className={`side-task-item ${task.isActive ? 'active' : ''}`}
              onClick={() => setActiveSideTask(task.id)}
            >
              <div className="side-task-header">
                <span className="side-task-code">{task.code}</span>
                <span className="side-task-name">{task.name}</span>
              </div>
              <div className="side-task-meta">
                <Tag className={`status-tag-small ${task.status}`}>
                  {task.status === 'normal' ? '常态' : '紧急'}
                </Tag>
                <span className="event-count">
                  <FileTextOutlined /> {task.eventCount}条
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
