import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Tag,
  Input,
  Badge,
  Tabs,
  Dropdown,
  Space,
  Drawer,
  Checkbox,
  message,
  Modal,
} from 'antd';
import {
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  MoreOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BellOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  SendOutlined,
  LinkOutlined,
  SyncOutlined,
  EditOutlined,
  CopyOutlined,
  DownloadOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  TableOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import * as echarts from 'echarts';
import InstructionCommandModal from '../components/InstructionCommandModal';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';

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

interface IssuedInstruction {
  id: string;
  eventId: string;
  instructionNames: string[];
  receiverArea: string;
  receiverPost: string;
  receiverUser: string;
  status: '已下达' | '已签收' | '处理中' | '已完成' | '已超时';
  linkStatus: '未检测' | '仍可访问' | '链接失效' | '无法判断' | '平台异常';
  issuedBy: string;
  issuedTime: string;
  deadline: string;
  latestFeedback: string;
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

const issuedInstructions: IssuedInstruction[] = [
  {
    id: 'cmd-001',
    eventId: '1',
    instructionNames: ['谣言核查', '劝删下达'],
    receiverArea: '淮安区',
    receiverPost: '劝删处置岗',
    receiverUser: '张明',
    status: '处理中',
    linkStatus: '仍可访问',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 15:20:00',
    deadline: '2024-05-10 23:20:00',
    latestFeedback: '属地已签收，正在联系平台侧核验原帖状态。',
  },
  {
    id: 'cmd-002',
    eventId: '2',
    instructionNames: ['材料反馈'],
    receiverArea: '清江浦区',
    receiverPost: '材料反馈岗',
    receiverUser: '岗位待申领',
    status: '已签收',
    linkStatus: '未检测',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 15:35:00',
    deadline: '2024-05-11 03:35:00',
    latestFeedback: '岗位已接收，等待材料回传。',
  },
  {
    id: 'cmd-003',
    eventId: '3',
    instructionNames: ['帖文处置', '本地动态监测'],
    receiverArea: '淮阴区',
    receiverPost: '值班网巡岗',
    receiverUser: '刘浩宇',
    status: '已完成',
    linkStatus: '链接失效',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 16:05:00',
    deadline: '2024-05-10 22:05:00',
    latestFeedback: '原帖已不可访问，处置反馈已提交。',
  },
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

export interface OpinionReport {
  id: string;
  version: string;
  title: string;
  date: string;
  content: string;
}

const initialReports: OpinionReport[] = [
  {
    id: 'report-2',
    version: 'V2',
    title: '阶段性报告 V2 - 0604中农到市信访局',
    date: '2026-06-17 10:25',
    content: `# 0604 中农到市信访局网上情况
(截至 2026-06-09 15:14:36)

# 全网舆情态势
本时段，"0604 中农到市信访局"事件网上相关信息累计监测到 70 篇，评论 0 条。其中，新发现舆情信息 63 条，已协同处置 7 条。平台分布呈现碎片化特征，主要集中于网易（8 篇）、微信（5 篇）、搜狐移动版（4 篇）、懂车帝（4 篇）及今日头条（4 篇）等平台；微博、抖音 app、快手 app 等社交短视频平台均有少量涉及，分别为 1 篇、2 篇和 2 篇。目前舆情热度总体可控，未发现大规模聚集性讨论，但需警惕跨平台扩散风险。针对已发现的敏感信息，已开展举报限流及源头清理工作，累计处置 7 条。

# 重点媒体及资讯平台动态
本时段，多家主流商业门户及行业资讯网站转发发布相关事件信息，内容多聚焦于事件经过及现场情况回顾。突出情况有：
1. [2026-06-09 10:23], [网易] 网民“财经观察员”《张三，男，34 岁，北京人）发布文章《中农代表赴市信访局反映诉求，现场秩序井然》，详细梳理了 6 月 4 日以来的信访流程及相关部门回应，该贴文目前阅读量较高，已被纳入重点监测名单。
2. [2026-06-09 08:45], [今日头条] 网民“法治前线”《李四，女，29 岁，河南省人）转发凤凰网报道，配文称“关注涉农群体合法权益保障”，引发少量跟帖讨论。针对上述媒体报道，已启动舆情引导机制，协调相关平台优化评论区管理，防止不实言论滋生。`
  },
  {
    id: 'report-1',
    version: 'V1',
    title: '阶段性报告 V1 - 0604中农到市信访局',
    date: '2026-06-09 10:58',
    content: `# 0604 中农到市信访局网上情况
(截至 2026-06-09 10:57:33)

# 全网舆情态势
本时段，"0604 中农到市信访局"事件网上相关信息累计监测到 35 篇，评论 0 条。其中，新发现舆情信息 30 条，已协同处置 5 条。平台分布呈现碎片化特征，主要集中于网易（4 篇）、微信（3 篇）、搜狐移动版（2 篇）等平台；目前舆情热度总体可控，相关处置工作正稳步推进。`
  }
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
  const [workView, setWorkView] = useState<'pending' | 'issued'>('pending');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [ignoredEventIds, setIgnoredEventIds] = useState<string[]>([]);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionTargetIds, setInstructionTargetIds] = useState<string[]>([]);
  const [detailInstruction, setDetailInstruction] = useState<IssuedInstruction | null>(null);
  const [linkStatusMap, setLinkStatusMap] = useState<Record<string, IssuedInstruction['linkStatus']>>({});

  // 新增：一级 Tab 状态（articles: 文章列表, analysis: 快速分析, statistics: 工作情况统计, summary: 舆情综述）
  const [firstLevelTab, setFirstLevelTab] = useState<'articles' | 'analysis' | 'statistics' | 'summary'>('articles');
  // 报道趋势图表切换维度（volume: 声量, interaction: 互动量, sentiment: 情感）
  const [trendDimension, setTrendDimension] = useState<'volume' | 'interaction' | 'sentiment'>('volume');

  // 新增：舆情综述历史报告与弹窗状态
  const [reports, setReports] = useState<OpinionReport[]>([]);
  const [generating, setGenerating] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [currentEditingReport, setCurrentEditingReport] = useState<OpinionReport | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // ECharts refs
  const trendChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const statsTypeChartRef = useRef<HTMLDivElement>(null);

  // 一键复制综述内容
  const handleCopySummary = () => {
    const summaryText = `06月21日15时09分39秒 - 06月22日15时09分39秒，共检测相关数据27篇，其中新闻13篇，今日头条10篇，APP2篇，微信2篇，境外0篇，长视频0篇，论坛0篇，短视频0篇，小红书0篇，抖音0篇，微博0篇。正面占比3.70%，中性占比96.30%。主要为今日头条，懂车帝，网易等平台网友扩散舆情。共抓取评论0篇。`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText).then(() => {
        message.success('综述内容已成功复制到剪贴板！');
      }).catch(() => {
        message.error('复制失败，请手动选择复制。');
      });
    } else {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = summaryText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success('综述内容已成功复制到剪贴板！');
      } catch (err) {
        message.error('复制失败，请手动选择复制。');
      }
      document.body.removeChild(textArea);
    }
  };

  // Markdown 解析渲染器（高保真复刻，为平台标签提供胶囊状背景样式）
  const renderMarkdown = (md: string) => {
    if (!md) return null;
    return md.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // H1 Header
      if (trimmed.startsWith('# ')) {
        return (
          <h2
            key={idx}
            className="md-header-1"
            style={{
              marginTop: '20px',
              marginBottom: '10px',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              borderBottom: '2px solid #3366FF',
              paddingBottom: '4px',
              display: 'inline-block'
            }}
          >
            {trimmed.slice(2)}
          </h2>
        );
      }
      
      // H2 Header
      if (trimmed.startsWith('## ')) {
        return (
          <h3
            key={idx}
            className="md-header-2"
            style={{
              marginTop: '16px',
              marginBottom: '8px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              paddingLeft: '6px',
              borderLeft: '3px solid var(--primary-color)'
            }}
          >
            {trimmed.slice(3)}
          </h3>
        );
      }

      // H3 Header
      if (trimmed.startsWith('### ')) {
        return (
          <h4
            key={idx}
            className="md-header-3"
            style={{
              marginTop: '12px',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#334155'
            }}
          >
            {trimmed.slice(4)}
          </h4>
        );
      }

      // 截至时间等斜体/置灰副标题：(截至 xxx)
      if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        return (
          <div
            key={idx}
            className="md-subtitle"
            style={{
              fontSize: '12px',
              color: '#64748b',
              fontStyle: 'normal',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ClockCircleOutlined style={{ fontSize: '11px' }} /> {trimmed}
          </div>
        );
      }

      // 数字列表项，形如 "1. [2026-06-09 10:23], [网易]..."
      const numListMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numListMatch) {
        const num = numListMatch[1];
        const rest = numListMatch[2];
        return (
          <div
            key={idx}
            className="preview-list-item"
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '8px',
              paddingLeft: '10px',
              fontSize: '13px',
              lineHeight: 1.6,
              alignItems: 'flex-start'
            }}
          >
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{num}.</span>
            <span style={{ flex: 1, color: '#334155' }}>
              {rest.split(/(\[[^\]]+\])/).map((part, pIdx) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  const label = part.slice(1, -1);
                  // 针对微博、今日头条、网易等常见字眼做一些配色区分
                  let tagBg = 'rgba(51, 102, 255, 0.1)';
                  let tagColor = 'var(--primary-color)';
                  if (label === '网易') {
                    tagBg = 'rgba(239, 68, 68, 0.1)';
                    tagColor = '#ef4444';
                  } else if (label === '今日头条') {
                    tagBg = 'rgba(245, 158, 11, 0.1)';
                    tagColor = '#f59e0b';
                  } else if (label === '微博') {
                    tagBg = 'rgba(236, 72, 153, 0.1)';
                    tagColor = '#ec4899';
                  }
                  
                  return (
                    <span
                      key={pIdx}
                      style={{
                        display: 'inline-block',
                        background: tagBg,
                        color: tagColor,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        margin: '0 4px',
                        fontWeight: 600,
                        fontSize: '12px'
                      }}
                    >
                      {label}
                    </span>
                  );
                }
                return part;
              })}
            </span>
          </div>
        );
      }

      if (trimmed === '') {
        return <div key={idx} style={{ height: '8px' }} />;
      }

      return (
        <p
          key={idx}
          style={{
            fontSize: '13px',
            lineHeight: '1.65',
            color: '#334155',
            marginBottom: '12px',
            textAlign: 'justify'
          }}
        >
          {trimmed}
        </p>
      );
    });
  };

  // 生成最新报告事件触发（内容加载 2 秒延迟）
  const handleTriggerGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      
      const currentActiveTask = sideTasks.find(t => t.id === activeSideTask) || currentTask;
      const taskName = currentActiveTask.name;
      const newVersion = `V${reports.length + 1}`;
      const newTitle = `阶段性报告 ${newVersion} - ${taskName}专题`;
      
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentDay = String(now.getDate()).padStart(2, '0');
      const currentHour = String(now.getHours()).padStart(2, '0');
      const formattedTime = `${currentMonth}月${currentDay}日 ${currentHour}时`;
      const todayDate = now.toISOString().replace('T', ' ').substring(0, 16);

      const newContent = `# 关于“${taskName}专题”网上舆情综述（综述模板）
(截至 ${formattedTime})

目前，互联网公开面“${taskName}”相关信息8.6万余条，2个话题进入抖音等平台热搜热榜，网民评论1.2万余条，舆情热度呈上升趋势。

截至 ${formattedTime}，互联网公开面涉我市清明节假期相关信息8.6万余条（24小时新增8.6万余条，原发 1.8万余条、转发 4.2万余条、评论 2.6万余条）。人民网、重庆日报、华龙网等20余家媒体报道我市平安文明祭祖、文旅消费升级、交通出行向好等情况。

## 媒体报道情况
1. [重庆日报] 报道，重庆平稳迎来清明祭扫高峰，全市当日19.65万人次现场祭扫，11.74万人选择鲜花、云祭扫等绿色祭扫方式；祭扫全程秩序平稳，未发生火情、安全事故，文明低碳祭扫成主流。
2. [重庆晨报] 报道，清明春假重庆文旅市场持续火热，清明连休期间全市推出200余项文旅特色活动、119处春季踏青打卡点位；亲子游、家庭近郊游、赏花研学出游热度居高不下。
3. [华龙网] 报道，清明假期重庆铁路出行数据出炉，4.4-4.6假期重庆火车站累计发送旅客97.2万人次，同比增长28.2%；4月4日单日发送38.2万人次创历史新高，客流主要流向成都、贵阳、昆明、武汉、西安等周边重点城市。

## 热搜话题情况
1. [微博] 话题“清明期间重庆高速最忙收费站TOP3”位于微博同城榜第11位。
2. [微博] 话题“重庆火车站单日旅客发送量破纪录”位于微博同城榜第29位。

## 网民观点
1. [网民观点] 一是热议本地豁达简约、轻松生活化的祭扫民俗，认可心意重于形式的追思理念，鲜花祭扫、云祭扫等文明低碳祭祀方式获广泛支持。
2. [网民观点] 二是全市文旅市场热度高涨，近郊踏青、两江夜游等出游场景备受青睐，城市消费活力获网友点赞。
3. [网民观点] 三是集中吐槽景区客流拥挤、交通拥堵、游玩排队耗时等假期常态化民生问题。`;

      setCurrentEditingReport({
        id: `report-${reports.length + 1}`,
        version: newVersion,
        title: newTitle,
        date: todayDate,
        content: newContent
      });
      setIsEditingExisting(false);
      setReportModalOpen(true);
    }, 2000);
  };

  // 编辑已有报告
  const handleEditReport = (report: OpinionReport) => {
    setCurrentEditingReport({ ...report });
    setIsEditingExisting(true);
    setReportModalOpen(true);
  };

  // 复制报告内容
  const handleCopyReportContent = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        message.success('报告 Markdown 源码已成功复制到剪贴板！');
      }).catch(() => {
        message.error('复制失败，请手动选择复制。');
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success('报告 Markdown 源码已成功复制到剪贴板！');
      } catch (err) {
        message.error('复制失败，请手动选择复制。');
      }
      document.body.removeChild(textArea);
    }
  };

  // 模拟报告导出成功
  const handleExportReport = (title: string) => {
    message.loading({ content: '正在打包导出文件...', key: 'export' });
    setTimeout(() => {
      message.success({ content: `报告「${title}」导出 Word 与 PDF 成功！`, key: 'export', duration: 3 });
    }, 1500);
  };

  // 保存报告修改
  const handleSaveReport = () => {
    if (!currentEditingReport) return;
    
    if (isEditingExisting) {
      // 更新现有报告
      setReports((prev) =>
        prev.map((r) => (r.id === currentEditingReport.id ? currentEditingReport : r))
      );
      message.success('报告更新成功！');
    } else {
      // 插入新报告到最前端
      setReports((prev) => [currentEditingReport, ...prev]);
      message.success('新报告生成并提交成功！');
    }
    setReportModalOpen(false);
    setCurrentEditingReport(null);
  };

  // ECharts 初始化与配置更新
  useEffect(() => {
    let trendChart: echarts.ECharts | null = null;
    let pieChart: echarts.ECharts | null = null;
    let statsTypeChart: echarts.ECharts | null = null;

    if (firstLevelTab === 'analysis') {
      if (trendChartRef.current) {
        trendChart = echarts.init(trendChartRef.current);
        
        let seriesData: any[] = [];
        let legendData: string[] = [];
        
        if (trendDimension === 'volume') {
          legendData = ['全部', '今日头条', '新闻', '微信', 'APP'];
          seriesData = [
            { name: '全部', type: 'line', data: [2, 4, 2, 18, 4, 6, 2, 4], smooth: true, color: '#3366FF' },
            { name: '今日头条', type: 'line', data: [0, 2, 0, 10, 2, 2, 0, 4], smooth: true, color: '#00d4aa' },
            { name: '新闻', type: 'line', data: [2, 2, 2, 6, 2, 4, 2, 0], smooth: true, color: '#ff7a45' },
            { name: '微信', type: 'line', data: [0, 0, 0, 2, 0, 0, 0, 0], smooth: true, color: '#7c3aed' },
            { name: 'APP', type: 'line', data: [0, 0, 0, 0, 0, 0, 0, 0], smooth: true, color: '#faad14' },
          ];
        } else if (trendDimension === 'interaction') {
          legendData = ['全部', '今日头条', '新闻', '微信', 'APP'];
          seriesData = [
            { name: '全部', type: 'line', data: [20, 35, 10, 100, 15, 20, 8, 12], smooth: true, color: '#3366FF' },
            { name: '今日头条', type: 'line', data: [5, 15, 2, 50, 5, 8, 2, 5], smooth: true, color: '#00d4aa' },
            { name: '新闻', type: 'line', data: [15, 20, 8, 48, 10, 12, 6, 7], smooth: true, color: '#ff7a45' },
            { name: '微信', type: 'line', data: [0, 0, 0, 2, 0, 0, 0, 0], smooth: true, color: '#7c3aed' },
            { name: 'APP', type: 'line', data: [0, 0, 0, 0, 0, 0, 0, 0], smooth: true, color: '#faad14' },
          ];
        } else {
          legendData = ['正面占比', '中性占比'];
          seriesData = [
            { name: '正面占比', type: 'line', data: [3, 4, 3, 3.7, 4, 3, 3, 4], smooth: true, color: '#52c41a' },
            { name: '中性占比', type: 'line', data: [97, 96, 97, 96.3, 96, 97, 97, 96], smooth: true, color: '#faad14' },
          ];
        }

        trendChart.setOption({
          tooltip: { trigger: 'axis' },
          legend: {
            data: legendData,
            bottom: 0,
            icon: 'rect',
            itemWidth: 12,
            itemHeight: 4,
          },
          grid: { left: '4%', right: '4%', bottom: '15%', containLabel: true },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00', '12:00'],
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisLabel: { color: '#6b7280' }
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
            axisLabel: { color: '#6b7280' }
          },
          series: seriesData
        });
      }

      if (pieChartRef.current) {
        pieChart = echarts.init(pieChartRef.current);
        pieChart.setOption({
          tooltip: { trigger: 'item', formatter: '{b}: {c} 篇 ({d}%)' },
          legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: { color: '#1f2937', fontSize: 12 }
          },
          series: [
            {
              name: '阵地占比',
              type: 'pie',
              radius: ['45%', '70%'],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 4,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: { show: false },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 14,
                  fontWeight: 'bold',
                  formatter: '{b}\n{d}%'
                }
              },
              data: [
                { value: 13, name: '新闻', itemStyle: { color: '#00d4aa' } },
                { value: 10, name: '今日头条', itemStyle: { color: '#3366FF' } },
                { value: 2, name: '微信', itemStyle: { color: '#ff7a45' } },
                { value: 2, name: 'APP', itemStyle: { color: '#7c3aed' } },
              ]
            }
          ]
        });
      }
    }

    if (firstLevelTab === 'statistics') {
      if (statsTypeChartRef.current) {
        statsTypeChart = echarts.init(statsTypeChartRef.current);
        statsTypeChart.setOption({
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '5%', right: '8%', top: '5%', bottom: '5%', containLabel: true },
          xAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
            axisLabel: { color: '#6b7280' }
          },
          yAxis: {
            type: 'category',
            data: ['谣言核查', '劝删下达', '本地动态监测', '材料反馈'],
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisLabel: { color: '#1f2937', fontWeight: 500 }
          },
          series: [
            {
              name: '下达指令数',
              type: 'bar',
              data: [86, 124, 38, 56],
              barWidth: 16,
              itemStyle: {
                borderRadius: [0, 4, 4, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#5c85ff' },
                  { offset: 1, color: '#3366FF' }
                ])
              }
            }
          ]
        });
      }
    }

    const handleResize = () => {
      trendChart?.resize();
      pieChart?.resize();
      statsTypeChart?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      trendChart?.dispose();
      pieChart?.dispose();
      statsTypeChart?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [firstLevelTab, trendDimension]);

  const visibleEvents = eventList.filter((event) => !ignoredEventIds.includes(event.id));
  const allSelected = visibleEvents.length > 0 && selectedEventIds.length === visibleEvents.length;

  // 更多操作菜单
  const moreMenuItems: MenuProps['items'] = [
    { key: 'collect', label: '收藏' },
    { key: 'report', label: '上报' },
    { key: 'share', label: '分享' },
    { key: 'delete', label: '删除', danger: true },
  ];

  const getEventById = (eventId: string) => eventList.find((event) => event.id === eventId);

  const toggleEventSelect = (eventId: string, checked: boolean) => {
    setSelectedEventIds((prev) => (
      checked ? Array.from(new Set([...prev, eventId])) : prev.filter((id) => id !== eventId)
    ));
  };

  const ignoreEvents = (eventIds: string[]) => {
    setIgnoredEventIds((prev) => Array.from(new Set([...prev, ...eventIds])));
    setSelectedEventIds((prev) => prev.filter((id) => !eventIds.includes(id)));
  };

  const openInstructionModal = (eventIds: string[]) => {
    setInstructionTargetIds(eventIds);
    setInstructionModalOpen(true);
  };

  const handleInstructionSubmit = () => {
    setInstructionModalOpen(false);
    setSelectedEventIds([]);
    setWorkView('issued');
  };

  const handleDetectLink = (recordId: string) => {
    const current = linkStatusMap[recordId] || issuedInstructions.find((item) => item.id === recordId)?.linkStatus;
    setLinkStatusMap({
      ...linkStatusMap,
      [recordId]: current === '链接失效' ? '链接失效' : '链接失效',
    });
  };

  const getStatusClassName = (status: string) => {
    if (status === '已完成') return 'success';
    if (status === '已超时') return 'danger';
    if (status === '处理中') return 'processing';
    return 'default';
  };

  const getLinkStatusClassName = (status: string) => {
    if (status === '链接失效') return 'invalid';
    if (status === '仍可访问') return 'active';
    if (status === '无法判断' || status === '平台异常') return 'warning';
    return 'default';
  };

  // 渲染事件卡片
  const renderEventCard = (event: EventItem, displaySeq: number) => (
    <UnifiedOpinionCard
      key={event.id}
      id={event.id}
      seq={displaySeq}
      title={event.title}
      author={event.author}
      postId="123456789"
      heat={event.heatValue}
      platform={event.platform}
      platformIcon={getPlatformIcon(event.platform)}
      time={formatTime(event.publishTime)}
      content={event.content}
      summary="该内容涉及淮安暴雨汛情，反映市区积水情况，建议关注后续发展。"
      analysis="该舆情为自然灾害类，目前呈上升趋势，建议相关部门及时发布权威信息，回应社会关切。"
      dataSource={event.dataSource}
      tags={event.videoUrl ? [...event.tags, '视频'] : event.tags}
      rating={event.starRating}
      ratingText={`${event.starRating}级`}
      sentimentIndex={event.sentimentIndex}
      warningLabel={event.isWaring ? <><ExclamationCircleOutlined /> 预警</> : undefined}
      hasVideo={!!event.videoUrl}
      selected={selectedEventIds.includes(event.id)}
      selectionSlot={
        <Checkbox
          checked={selectedEventIds.includes(event.id)}
          onChange={(e) => toggleEventSelect(event.id, e.target.checked)}
          className="event-select-checkbox"
        />
      }
      moreSlot={
        <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
          <Button type="text" size="small" className="more-btn">
            <MoreOutlined />
          </Button>
        </Dropdown>
      }
      actions={
        <>
          <Button type="link" size="small" className="detail-btn">
            查看详情
          </Button>
          <Button type="primary" size="small" className="ai-btn-detail">
            AI辅助研判
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<SendOutlined />}
            className="command-btn-detail"
            onClick={() => openInstructionModal([event.id])}
          >
            下达指令
          </Button>
          <Button
            type="link"
            size="small"
            className="ignore-btn-detail"
            onClick={() => ignoreEvents([event.id])}
          >
            忽略
          </Button>
        </>
      }
    />
  );

  const renderIssuedCard = (record: IssuedInstruction) => {
    const event = getEventById(record.eventId);
    const linkStatus = linkStatusMap[record.id] || record.linkStatus;

    if (!event) return null;

    return (
      <div key={record.id} className="issued-card">
        <div className="issued-main">
          <div className="issued-title-row">
            <h3>{event.title}</h3>
          </div>
          <div className="issued-meta-row">
            <span>{getPlatformIcon(event.platform)} {event.platform}</span>
            <span>指令：{record.instructionNames.join('、')}</span>
            <span>下达时间：{record.issuedTime}</span>
          </div>
        </div>
        <div className="issued-status-strip">
          <div className="issued-mini-stat">
            <span>链接</span>
            <strong>{record.instructionNames.includes('劝删下达') || record.instructionNames.includes('帖文处置') ? 1 : 0}</strong>
          </div>
          <Tag className={`command-status-tag ${getStatusClassName(record.status)}`}>{record.status}</Tag>
          <Tag className={`link-status-tag ${getLinkStatusClassName(linkStatus)}`}>
            <LinkOutlined /> {linkStatus}
          </Tag>
        </div>
        <div className="issued-actions">
          <Button size="small" icon={<SyncOutlined />} onClick={() => handleDetectLink(record.id)}>
            检测链接
          </Button>
          <Button size="small" type="primary" onClick={() => setDetailInstruction(record)}>
            查看进度
          </Button>
        </div>
      </div>
    );
  };

  const renderDetailDrawer = () => {
    const event = detailInstruction ? getEventById(detailInstruction.eventId) : null;
    const linkStatus = detailInstruction
      ? linkStatusMap[detailInstruction.id] || detailInstruction.linkStatus
      : '未检测';

    return (
      <Drawer
        title={(
          <div className="progress-drawer-title">
            <div className="progress-tabs">
              <span>分析研判</span>
              <span>处置过程</span>
              <span className="active">处置详情</span>
            </div>
            <Button type="primary" ghost icon={<SendOutlined />}>下达处理指令</Button>
          </div>
        )}
        width={860}
        open={!!detailInstruction}
        onClose={() => setDetailInstruction(null)}
        className="command-detail-drawer"
        footer={(
          <div className="drawer-footer-actions">
            <Button>催办</Button>
            <Button icon={<SyncOutlined />} onClick={() => detailInstruction && handleDetectLink(detailInstruction.id)}>
              检测链接
            </Button>
            <Button type="primary">标记完成</Button>
          </div>
        )}
      >
        {detailInstruction && event && (
          <>
            <div className="drawer-metric-grid">
              {[
                ['发现效率', '0秒', 'red'],
                ['研判效率', '3分12秒', 'orange'],
                ['落查耗时', '28分钟', 'green'],
                ['材料耗时', detailInstruction.status === '已完成' ? '1小时06分' : '--', 'blue'],
                ['审核耗时', '--', 'purple'],
              ].map(([label, value, tone]) => (
                <div key={label} className={`drawer-metric-card ${tone}`}>
                  <i />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="progress-timeline">
              <div className="progress-node">
                <div className="progress-time">{event.publishTime}</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一信源</span>
                    <span className="link-like">添加第一信源</span>
                  </div>
                  <div className="progress-block source-card">
                    <div>
                      <h4>{event.author}</h4>
                      <p><ClockCircleOutlined /> {event.publishTime} <span>|</span> {getPlatformIcon(event.platform)} {event.platform}</p>
                    </div>
                    <div className="source-actions">
                      <Button type="link">复制信息</Button>
                      <Button type="link">查看原文</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">{detailInstruction.issuedTime}</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一发现</span>
                    <span className="solid">来源：{detailInstruction.issuedBy}</span>
                    <span className="outline">{detailInstruction.receiverArea}</span>
                    <span className="danger">发现用时 18分钟</span>
                  </div>
                  <div className="progress-block">核报</div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">2024-05-10 15:38:35</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一研判</span>
                    <span className="outline">--</span>
                  </div>
                  <div className="progress-block">核报</div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">2024-05-10 15:42:00</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">指令：{detailInstruction.instructionNames.join('、')}</span>
                    <span className="solid">{detailInstruction.receiverPost}</span>
                    <span className="outline">{detailInstruction.receiverUser}</span>
                  </div>
                  <div className="progress-block instruction-block">
                    <strong>指令要求：请反馈事件发生时间、地点、经过、结果以及相关人员。</strong>
                    <div className="feedback-card">
                      <span>{detailInstruction.receiverArea}</span>
                      <span>{detailInstruction.receiverUser}</span>
                      <span>2024-05-10 16:11:29</span>
                      <span>签收</span>
                      <em className="success">接收用时 29秒</em>
                    </div>
                    <div className="feedback-card multiline">
                      <span>{detailInstruction.receiverArea}</span>
                      <span>{detailInstruction.receiverUser}</span>
                      <span>2024-05-10 16:18:00</span>
                      <span>反馈</span>
                      <em>接收用时 36分钟</em>
                      <p>{detailInstruction.latestFeedback}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">最近检测</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className={linkStatus === '链接失效' ? 'success-pill' : 'outline'}>链接状态：{linkStatus}</span>
                    <span className="outline">文章ID {detailInstruction.eventId.padStart(8, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    );
  };

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

        {/* 新增：一级 Tab 切换栏（基于截图的1:1复刻样式设计） */}
        <div className="detail-sub-header-bar">
          <div className="sub-header-left">
            <span className="task-check-icon">✓</span>
            <span className="sub-task-name">{currentTask.name}</span>
            <span className="sub-task-time">2026-06-21 15:09:3 至 2026-06-22 15:09:3</span>
          </div>
          <div className="sub-header-tabs">
            <div
              className={`sub-tab-item ${firstLevelTab === 'articles' ? 'active' : ''}`}
              onClick={() => setFirstLevelTab('articles')}
            >
              文章列表
            </div>
            <div
              className={`sub-tab-item ${firstLevelTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setFirstLevelTab('analysis')}
            >
              快速分析
            </div>
            <div
              className={`sub-tab-item ${firstLevelTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setFirstLevelTab('statistics')}
            >
              工作情况统计
            </div>
            <div
              className={`sub-tab-item ${firstLevelTab === 'summary' ? 'active' : ''}`}
              onClick={() => setFirstLevelTab('summary')}
            >
              舆情综述
            </div>
          </div>
          <div className="sub-header-right">
            <Button type="text" icon={<SyncOutlined />} className="refresh-btn" />
          </div>
        </div>

        {/* ==================== 1. 文章列表视图 ==================== */}
        {firstLevelTab === 'articles' && (
          <>
            {/* 搜索筛选栏 */}
            <div className="detail-filter-bar">
              <div className="filter-search">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={workView === 'pending' ? '搜索事件内容' : '搜索已下达指令'}
                  className="event-search-input"
                />
              </div>
              <div className="filter-actions-detail">
                {workView === 'issued' && (
                  <Button icon={<SyncOutlined />}>批量检测链接</Button>
                )}
                <Button icon={<FilterOutlined />}>筛选</Button>
                <Button>排序 <DownOutlined /></Button>
                <Button>时间 <DownOutlined /></Button>
              </div>
            </div>

            <div className="work-view-switch">
              <button
                type="button"
                className={workView === 'pending' ? 'active' : ''}
                onClick={() => setWorkView('pending')}
              >
                待研判帖文
                <Badge count={visibleEvents.length} />
              </button>
              <button
                type="button"
                className={workView === 'issued' ? 'active' : ''}
                onClick={() => setWorkView('issued')}
              >
                已下达指令
                <Badge count={issuedInstructions.length} />
              </button>
            </div>

            {/* 分类Tab */}
            {workView === 'pending' ? (
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
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedEventIds.length > 0 && !allSelected}
                    onChange={(e) => setSelectedEventIds(e.target.checked ? visibleEvents.map((event) => event.id) : [])}
                  >
                    全选
                  </Checkbox>
                  <span className="total-count">共 {visibleEvents.length} 条</span>
                </div>
              </div>
            ) : (
              <div className="issued-summary-bar">
                <div className="issued-summary-item">
                  <span>已下达</span>
                  <strong>{issuedInstructions.length}</strong>
                </div>
                <div className="issued-summary-item">
                  <span>处理中</span>
                  <strong>1</strong>
                </div>
                <div className="issued-summary-item">
                  <span>已完成</span>
                  <strong>1</strong>
                </div>
                <div className="issued-summary-item">
                  <span>链接失效</span>
                  <strong>1</strong>
                </div>
              </div>
            )}

            {/* 事件列表 */}
            <div className="event-list-container">
              {workView === 'pending'
                ? visibleEvents.map((event, index) => renderEventCard(event, index + 1))
                : issuedInstructions.map((record) => renderIssuedCard(record))}
            </div>

            {workView === 'pending' && selectedEventIds.length > 0 && (
              <div className="batch-action-bar">
                <div className="batch-left">
                  <Badge count={selectedEventIds.length} />
                  <span>已选中 {selectedEventIds.length} 条数据</span>
                  <Button type="link" onClick={() => setSelectedEventIds([])}>取消全选</Button>
                </div>
                <div className="batch-right">
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => openInstructionModal(selectedEventIds)}
                  >
                    批量下达指令
                  </Button>
                  <Button
                    className="batch-ignore-btn"
                    onClick={() => ignoreEvents(selectedEventIds)}
                  >
                    批量忽略
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ==================== 2. 快速分析视图 ==================== */}
        {firstLevelTab === 'analysis' && (
          <div className="analysis-tab-content">
            {/* 文字综述卡片 */}
            <div className="analysis-summary-card">
              <div className="summary-left">
                <span className="time-badge">监测区间：2026-06-21 15:09:3 到 2026-06-22 15:09:3</span>
                <p className="summary-text">
                  06月21日15时09分39秒 - 06月22日15时09分39秒，共检测相关数据27篇，其中新闻13篇，今日头条10篇，APP2篇，微信2篇，境外0篇，长视频0篇，论坛0篇，短视频0篇，小红书0篇，抖音0篇，微博0篇。
                  正面占比3.70%，中性占比96.30%。主要为今日头条，懂车帝，网易等平台网友扩散舆情。共抓取评论0篇。
                </p>
              </div>
              <Button
                type="primary"
                ghost
                icon={<CopyOutlined />}
                className="copy-btn"
                onClick={handleCopySummary}
              >
                一键复制
              </Button>
            </div>

            {/* 双行核心指标面板 */}
            <div className="analysis-metrics-container">
              {/* 第一行：总声量与平台 breakdown */}
              <div className="metric-row-box">
                <div className="metric-primary-card">
                  <div className="primary-title">
                    总声量 <ExclamationCircleOutlined className="info-icon-small" />
                  </div>
                  <div className="primary-val">27</div>
                </div>
                <div className="metric-breakdown-cards">
                  {[
                    { name: '微博', value: 0 },
                    { name: '抖音', value: 0 },
                    { name: '今日头条', value: 10 },
                    { name: '小红书', value: 0 },
                    { name: '其他短视频', value: 0 },
                    { name: '微信', value: 2 },
                    { name: '新闻', value: 13 },
                    { name: '论坛', value: 0 },
                    { name: '长视频', value: 0 },
                    { name: 'APP', value: 2 },
                    { name: '境外', value: 0 }
                  ].map((plat) => (
                    <div key={plat.name} className="breakdown-card">
                      <div className="breakdown-val">{plat.value}</div>
                      <div className="breakdown-lbl">{plat.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 第二行：总互动量与详情 breakdown */}
              <div className="metric-row-box">
                <div className="metric-primary-card interactive-primary">
                  <div className="primary-title">
                    总互动量 <ExclamationCircleOutlined className="info-icon-small" />
                  </div>
                  <div className="primary-val">100</div>
                  <div className="sub-primary-val">不含阅读数 2</div>
                </div>
                <div className="metric-breakdown-cards">
                  {[
                    { name: '总发文数', value: 0 },
                    { name: '总分享数', value: 0 },
                    { name: '总评论数', value: 0 },
                    { name: '总阅读数', value: 98 },
                    { name: '总点赞数', value: 1 },
                    { name: '其他互动量之和', value: 1 }
                  ].map((detail) => (
                    <div key={detail.name} className="breakdown-card">
                      <div className="breakdown-val">{detail.value}</div>
                      <div className="breakdown-lbl">{detail.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ECharts 图表行 */}
            <div className="analysis-charts-grid">
              {/* 报道趋势 */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <BarChartOutlined className="icon" /> 报道趋势
                  </div>
                  <div className="chart-controls">
                    <div className="trend-toggles">
                      <button
                        className={trendDimension === 'volume' ? 'active' : ''}
                        onClick={() => setTrendDimension('volume')}
                      >
                        声量
                      </button>
                      <button
                        className={trendDimension === 'interaction' ? 'active' : ''}
                        onClick={() => setTrendDimension('interaction')}
                      >
                        互动量
                      </button>
                      <button
                        className={trendDimension === 'sentiment' ? 'active' : ''}
                        onClick={() => setTrendDimension('sentiment')}
                      >
                        情感
                      </button>
                    </div>
                    <Tag className="resolution-tag">小时</Tag>
                    <Space size={4} className="control-icons">
                      <Button type="text" size="small" icon={<TableOutlined />} />
                      <Button type="text" size="small" icon={<DownloadOutlined />} />
                    </Space>
                  </div>
                </div>
                <div className="chart-canvas" ref={trendChartRef} />
              </div>

              {/* 阵地类型分析 */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <PieChartOutlined className="icon" /> 阵地类型分析
                  </div>
                  <Space size={4} className="control-icons">
                    <Button type="text" size="small" icon={<DownloadOutlined />} />
                  </Space>
                </div>
                <div className="chart-canvas" ref={pieChartRef} />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. 工作情况统计视图 ==================== */}
        {firstLevelTab === 'statistics' && (
          <div className="statistics-tab-content">
            {/* 顶层效能统计卡 */}
            <div className="stats-efficiency-row">
              <div className="efficiency-card">
                <span className="lbl">指令下达总数</span>
                <strong className="val">254 <span className="unit">次</span></strong>
                <div className="trend-text">较上周 <span className="up">↑ 12%</span></div>
              </div>
              <div className="efficiency-card">
                <span className="lbl">平均签收用时</span>
                <strong className="val green">2 <span className="unit">分</span> 45 <span className="unit">秒</span></strong>
                <div className="trend-text">较上周 <span className="down">↓ 15秒</span></div>
              </div>
              <div className="efficiency-card">
                <span className="lbl">平均反馈用时</span>
                <strong className="val">42 <span className="unit">分钟</span></strong>
                <div className="trend-text">较上周 <span className="down">↓ 3分钟</span></div>
              </div>
              <div className="efficiency-card">
                <span className="lbl">超时指令占比</span>
                <strong className="val red">1.2 <span className="unit">%</span></strong>
                <div className="trend-text">低于警示阈值 (3%)</div>
              </div>
            </div>

            {/* 下方排名与分类排版 */}
            <div className="stats-dashboard-grid">
              {/* 各部门/属地执行情况表 */}
              <div className="stats-ranking-card">
                <div className="card-header-simple">
                  <h3>各属地/部门执行情况排名</h3>
                  <Tag color="blue">实时统计</Tag>
                </div>
                <div className="stats-table-container">
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>排名</th>
                        <th>部门/属地</th>
                        <th>分派指令数</th>
                        <th>已签收数</th>
                        <th>已反馈数</th>
                        <th>按时反馈率</th>
                        <th>平均反馈用时</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { rank: 1, name: '淮安区', sent: 120, signed: 120, feedback: 118, rate: '98.3%', time: '38分钟', status: '优秀', color: 'green' },
                        { rank: 2, name: '清江浦区', sent: 85, signed: 85, feedback: 84, rate: '98.8%', time: '41分钟', status: '优秀', color: 'green' },
                        { rank: 3, name: '淮阴区', sent: 45, signed: 45, feedback: 44, rate: '97.8%', time: '45分钟', status: '良好', color: 'blue' },
                        { rank: 4, name: '涟水县', sent: 4, signed: 4, feedback: 4, rate: '100%', time: '28分钟', status: '优秀', color: 'green' },
                      ].map((item) => (
                        <tr key={item.rank}>
                          <td><span className={`rank-number r-${item.rank}`}>{item.rank}</span></td>
                          <td className="dept-name">{item.name}</td>
                          <td>{item.sent}</td>
                          <td>{item.signed}</td>
                          <td>{item.feedback}</td>
                          <td className="rate-col">{item.rate}</td>
                          <td>{item.time}</td>
                          <td><Tag color={item.color}>{item.status}</Tag></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 右侧：指令类型分布图表 */}
              <div className="stats-ranking-card type-distribution-card">
                <div className="card-header-simple">
                  <h3>分类型指令统计</h3>
                </div>
                <div className="chart-canvas" ref={statsTypeChartRef} style={{ height: 260 }} />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. 舆情综述视图 ==================== */}
        {firstLevelTab === 'summary' && (
          <div className="summary-tab-content">
            {/* 顶栏控制栏 */}
            <div className="summary-control-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="control-left-title" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                舆情阶段性报告时间线
              </div>
              <Button
                type="primary"
                icon={<BellOutlined />}
                onClick={handleTriggerGenerateReport}
                loading={generating}
                style={{ background: '#3366FF', borderColor: '#3366FF' }}
              >
                {generating ? 'AI 正在提取数据并分析生成中...' : '生成最新舆情报告'}
              </Button>
            </div>

            {/* 报告时间线（始终作为背景渲染，即使在加载时也不隐藏） */}
            <div className="reports-timeline-container">
              {reports.length === 0 ? (
                <div className="summary-placeholder-card">
                  <div className="placeholder-icon">
                    <FileTextOutlined className="icon" />
                  </div>
                  <h2>暂无报告记录</h2>
                  <p className="placeholder-desc">
                    当前任务下暂无已生成的阶段性舆情总结报告，请点击右上角“生成最新舆情报告”按钮。
                  </p>
                </div>
              ) : (
                <div className="reports-timeline">
                  <div className="timeline-spine-line" />
                  {reports.map((report) => (
                    <div key={report.id} className="timeline-item">
                      {/* 左侧连线节点 */}
                      <div className="timeline-node">
                        <div className="timeline-dot" />
                        <div className="timeline-line-connector" />
                      </div>
                      {/* 右侧阶段报告卡片 */}
                      <div className="timeline-content-card">
                        <div className="report-card-header">
                          <div className="report-card-title-box">
                            <span className="report-time">{report.date}</span>
                            <h4 className="report-version-title">{report.title}</h4>
                          </div>
                          <div className="report-card-actions">
                            <Button
                              size="small"
                              type="primary"
                              ghost
                              icon={<EditOutlined />}
                              onClick={() => handleEditReport(report)}
                            >
                              编辑
                            </Button>
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => handleExportReport(report.title)}
                            >
                              导出
                            </Button>
                          </div>
                        </div>
                        <div className="report-card-body">
                          {renderMarkdown(report.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI 加载状态全局遮罩（背景内容仍然保留显示，通过透明背景与模糊遮罩层覆盖） */}
            {generating && (
              <div
                className="global-report-loading-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  borderRadius: '8px'
                }}
              >
                <div
                  className="loading-box"
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    padding: '30px 40px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    textAlign: 'center',
                    maxWidth: '450px'
                  }}
                >
                  <SyncOutlined spin style={{ fontSize: '32px', color: 'var(--primary-color)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>内容归纳与智能分析中</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    AI 正在快速检索并归纳该事件全网舆情数据（新闻、今日头条、微博、微信等），正在自动生成阶段性报告，请稍候...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
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
      <InstructionCommandModal
        open={instructionModalOpen}
        onCancel={() => setInstructionModalOpen(false)}
        onSubmit={handleInstructionSubmit}
        targetSummary={
          <>
            本次将向 <strong>{instructionTargetIds.length || selectedEventIds.length}</strong> 条帖文下达指令
          </>
        }
      />
      
      {/* 新增：AI 舆情处置报告双栏对比弹窗 */}
      <Modal
        title="AI 舆情处置报告"
        width={1050}
        centered
        open={reportModalOpen}
        onCancel={() => {
          setReportModalOpen(false);
          setCurrentEditingReport(null);
        }}
        footer={[
          <Button
            key="copy"
            icon={<CopyOutlined />}
            onClick={() => currentEditingReport && handleCopyReportContent(currentEditingReport.content)}
            style={{ float: 'left' }}
          >
            复制内容
          </Button>,
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={() => currentEditingReport && handleExportReport(currentEditingReport.title)}
            style={{ float: 'left' }}
          >
            导出
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setReportModalOpen(false);
              setCurrentEditingReport(null);
            }}
          >
            关闭
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveReport}>
            保存
          </Button>
        ]}
      >
        {currentEditingReport && (
          <div className="editor-split-container" style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {/* 左侧 Markdown 编辑器 */}
            <div className="editor-left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="panel-title-label" style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>Markdown 编辑</div>
              <Input.TextArea
                value={currentEditingReport.content}
                onChange={(e) =>
                  setCurrentEditingReport({
                    ...currentEditingReport,
                    content: e.target.value
                  })
                }
                className="markdown-textarea"
                style={{
                  height: '500px',
                  fontFamily: 'monospace, Consolas, "Courier New"',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  padding: '12px',
                  resize: 'none',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc'
                }}
              />
            </div>
            {/* 右侧 效果实时预览 */}
            <div className="editor-right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="panel-title-label" style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>报告预览</div>
              <div
                className="markdown-preview-panel"
                style={{
                  height: '500px',
                  overflowY: 'auto',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '20px',
                  background: '#ffffff'
                }}
              >
                {renderMarkdown(currentEditingReport.content)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {renderDetailDrawer()}
    </div>
  );
};

export default TaskDetail;
