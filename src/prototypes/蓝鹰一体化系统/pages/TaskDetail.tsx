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
  Select,
  DatePicker,
  Form,
  Popconfirm,
} from 'antd';
import {
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  UpOutlined,
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
  LoadingOutlined,
  SettingOutlined,
  UserOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  DeleteOutlined,
  PlusOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import InstructionCommandModal from '../components/InstructionCommandModal';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';
import AddToPublicationModal from '../components/AddToPublicationModal';

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
  isEffective: boolean; // 新增：是否布控生效中
  createTime: string;   // 新增：任务创建时间
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
  { id: '1', code: '0510', name: '淮安汛情', status: 'normal', eventCount: 156, isActive: true, isEffective: true, createTime: '2026-05-10 09:30:00' },
  { id: '2', code: '0118', name: '高张花园', status: 'normal', eventCount: 89, isActive: false, isEffective: false, createTime: '2026-01-18 10:00:00' },
  { id: '3', code: '0322', name: '交通事故', status: 'urgent', eventCount: 234, isActive: false, isEffective: true, createTime: '2026-03-22 14:20:00' },
  { id: '4', code: '0405', name: '校园安全', status: 'normal', eventCount: 45, isActive: false, isEffective: false, createTime: '2026-04-05 16:45:00' },
  { id: '5', code: '0512', name: '食品安全', status: 'normal', eventCount: 78, isActive: false, isEffective: true, createTime: '2026-05-12 11:15:00' },
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

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  modules: string[]; // List of module keys included in this template
  isCustom?: boolean;
}

export interface ReportModule {
  key: string;
  name: string;
  description: string;
  icon: string;
}

export const REPORT_MODULES: ReportModule[] = [
  {
    key: 'data_summary',
    name: '全网舆情数据汇总与概要',
    description: '自动统计当前监测区间内全网的声量峰值、增量、转发及情绪比例，生成整体舆论态势的文字概要。',
    icon: 'FileTextOutlined'
  },
  {
    key: 'official_media',
    name: '官方媒体发言汇总',
    description: '汇聚人民网、新华网、央视新闻等中央级及地方主流官媒的观点动向、权威发声与关注焦点。',
    icon: 'MessageOutlined'
  },
  {
    key: 'big_v_opinion',
    name: '境内外大V发言汇总',
    description: '提取新浪微博、微信公众号等平台上粉丝量超百万的头部自媒体（大V）的解读要点与舆情引导倾向。',
    icon: 'UserOutlined'
  },
  {
    key: 'hot_searches',
    name: '热搜话题匹配情况',
    description: '自动检索当前事件在微博、抖音、今日头条、百度等主流平台的热搜榜单、最高排名及在榜时间。',
    icon: 'LineChartOutlined'
  },
  {
    key: 'netizen_sentiment',
    name: '普通网民正负面看法汇总',
    description: '通过智能语义分析，梳理网民跟帖和评论的态度倾向，提炼支持、中性及负面担忧的核心观点。',
    icon: 'LikeOutlined'
  },
  {
    key: 'trend_chart',
    name: '发酵趋势数据折线图',
    description: '绘制事件在各大社交/新闻阵地的声量起伏、发酵与消退趋势，直观掌握传播周期与声量峰值。',
    icon: 'AreaChartOutlined'
  },
  {
    key: 'platform_pie',
    name: '各平台声量占比饼图',
    description: '呈现该舆情事件在微博、微信、抖音、头条及新闻媒体等各大阵地平台的声量比例占比。',
    icon: 'PieChartOutlined'
  }
];

export const initialTemplates: ReportTemplate[] = [
  {
    id: 'comprehensive',
    name: '全量舆情综合分析模板',
    description: '覆盖所有分析维度，包含全网汇总、媒体、大V、热搜、网民看法及发酵趋势图与声量饼图，适合深度研判。',
    modules: ['data_summary', 'official_media', 'big_v_opinion', 'hot_searches', 'netizen_sentiment', 'trend_chart', 'platform_pie'],
    isCustom: true
  }
];

export interface OpinionReport {
  id: string;
  version: string;
  title: string;
  date: string;
  content: string;
  status: 'generating' | 'success';
  template?: string;
  timeRange?: string;
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
2. [2026-06-09 08:45], [今日头条] 网民“法治前线”《李四，女，29 岁，河南省人）转发凤凰网报道，配文称“关注涉农群体合法权益保障”，引发少量跟帖讨论。针对上述媒体报道，已启动舆情引导机制，协调相关平台优化评论区管理，防止不实言论滋生。`,
    status: 'success'
  },
  {
    id: 'report-1',
    version: 'V1',
    title: '阶段性报告 V1 - 0604中农到市信访局',
    date: '2026-06-09 10:58',
    content: `# 0604 中农到市信访局网上情况
(截至 2026-06-09 10:57:33)

# 全网舆情态势
本时段，"0604 中农到市信访局"事件网上相关信息累计监测到 35 篇，评论 0 条。其中，新发现舆情信息 30 条，已协同处置 5 条。平台分布呈现碎片化特征，主要集中于网易（4 篇）、微信（3 篇）、搜狐移动版（2 篇）等平台；目前舆情热度总体可控，相关处置工作正稳步推进。`,
    status: 'success'
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
  const [sideTaskList, setSideTaskList] = useState<SideTask[]>(sideTasks);
  const [activeSideTask, setActiveSideTask] = useState(taskId || '1');
  const currentActiveTask = sideTaskList.find(t => t.id === activeSideTask) || currentTask;
  const [searchValue, setSearchValue] = useState('');

  // 任务编辑状态
  const [editingTask, setEditingTask] = useState<SideTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();

  // 根据当前编辑任务自动填表
  useEffect(() => {
    if (editingTask) {
      editForm.setFieldsValue({
        name: editingTask.name,
        status: editingTask.status,
        isEffective: editingTask.isEffective,
      });
    }
  }, [editingTask, editForm]);

  // 处理删除任务
  const handleDeleteTask = (targetTaskId: string) => {
    const newList = sideTaskList.filter(t => t.id !== targetTaskId);
    setSideTaskList(newList);
    message.success('任务删除成功');
    if (activeSideTask === targetTaskId) {
      if (newList.length > 0) {
        setActiveSideTask(newList[0].id);
      } else {
        setActiveSideTask('');
      }
    }
  };

  // 处理编辑保存
  const handleSaveTask = (values: { name: string; status: string; isEffective: boolean }) => {
    if (editingTask) {
      setSideTaskList(prev =>
        prev.map(t =>
          t.id === editingTask.id
            ? { ...t, name: values.name, status: values.status, isEffective: values.isEffective }
            : t
        )
      );
      message.success('任务修改成功');
    }
    setIsEditModalOpen(false);
    setEditingTask(null);
  };
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [batchPubOpen, setBatchPubOpen] = useState(false);
  const [ignoredEventIds, setIgnoredEventIds] = useState<string[]>([]);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionTargetIds, setInstructionTargetIds] = useState<string[]>([]);
  const [detailInstruction, setDetailInstruction] = useState<IssuedInstruction | null>(null);
  const [linkStatusMap, setLinkStatusMap] = useState<Record<string, IssuedInstruction['linkStatus']>>({});
  const [onlyShowIssued, setOnlyShowIssued] = useState(false);

  // 批量失效监测相关状态
  const [isDetectModalOpen, setIsDetectModalOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectProgress, setDetectProgress] = useState(0);
  const [detectResults, setDetectResults] = useState<{ id: string; eventId: string; title: string; platform: string; instructionNames: string[]; linkStatus: string }[]>([]);

  // 新增：一级 Tab 状态（articles: 文章列表, analysis: 快速分析, statistics: 工作情况统计, summary: 舆情综述）
  const [firstLevelTab, setFirstLevelTab] = useState<'articles' | 'analysis' | 'statistics' | 'summary'>('articles');
  // 报道趋势图表切换维度（volume: 声量, interaction: 互动量, sentiment: 情感）
  const [trendDimension, setTrendDimension] = useState<'volume' | 'interaction' | 'sentiment'>('volume');

  // 新增：舆情综述历史报告与弹窗状态
  const [reports, setReports] = useState<OpinionReport[]>(initialReports);
  const [generating, setGenerating] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [currentEditingReport, setCurrentEditingReport] = useState<OpinionReport | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // 新增优化：报告列表折叠/展开与配置弹窗状态
  const [expandedReportIds, setExpandedReportIds] = useState<string[]>([]);
  const [collapsedReportIds, setCollapsedReportIds] = useState<string[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive');
  const [selectedTimeRange, setSelectedTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs('2026-06-21 15:09:30'),
    dayjs('2026-06-22 15:09:30')
  ]);

  // 新增优化：自定义模板列表与状态
  const [templates, setTemplates] = useState<ReportTemplate[]>(initialTemplates);
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false);
  const [selectedTplId, setSelectedTplId] = useState<string>('comprehensive');
  const [currentEditingTemplate, setCurrentEditingTemplate] = useState<ReportTemplate | null>({ ...initialTemplates[0] });
  const [isCreatingNewTpl, setIsCreatingNewTpl] = useState(false);

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
      
      // 新增：拦截走势图组件占位符
      if (trimmed === '[CHART:TREND]') {
        return (
          <div key={idx} className="report-trend-chart-card" style={{ background: 'var(--card-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '14px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AreaChartOutlined style={{ color: '#3366FF', fontSize: '15px' }} /> 舆情声量时间发酵走势图 (监测周期内实时数据)
            </div>
            <div style={{ display: 'flex', height: '140px', alignItems: 'flex-end', gap: '2%', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
              <svg viewBox="0 0 500 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3366FF" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#3366FF" stopOpacity="0.01"/>
                  </linearGradient>
                </defs>
                {/* 辅助水平网格线 */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border-color)" strokeWidth="0.8" strokeDasharray="3 3" />
                
                {/* 阴影渐变区域 */}
                <path d="M0,90 Q40,95 80,75 T160,82 T240,45 T320,15 T400,68 T480,85 L500,90 L500,120 L0,120 Z" fill="url(#trendGrad)" opacity="0.9" />
                
                {/* 走势曲线 */}
                <path d="M0,90 Q40,95 80,75 T160,82 T240,45 T320,15 T400,68 T480,85 L500,90" fill="none" stroke="#3366FF" strokeWidth="2.5" />
                
                {/* 峰值标注圆点 */}
                <circle cx="320" cy="15" r="5" fill="#3366FF" stroke="#ffffff" strokeWidth="2.5" style={{ filter: 'drop-shadow(0px 2px 4px rgba(51,102,255,0.4))' }} />
                <text x="320" y="-3" textAnchor="middle" fontSize="10.5" fill="#3366FF" fontWeight="bold">峰值: 1.5w条 (舆情爆发期)</text>
              </svg>
              {/* 时间刻度轴 */}
              <div style={{ position: 'absolute', bottom: '2px', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-secondary)', opacity: 0.8 }}>
                <span>开始 (15:00)</span>
                <span>4小时</span>
                <span>8小时</span>
                <span>12小时</span>
                <span>16小时</span>
                <span>20小时</span>
                <span>截止 (15:00)</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#3366FF', borderRadius: '50%', display: 'inline-block' }} /> 全网敏感声量走势
              </span>
            </div>
          </div>
        );
      }

      // 新增：拦截饼图组件占位符
      if (trimmed === '[CHART:PIE]') {
        return (
          <div key={idx} className="report-pie-chart-card" style={{ background: 'var(--card-bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '14px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChartOutlined style={{ color: '#3366FF', fontSize: '15px' }} /> 舆情首发/热议阵地平台声量占比饼图
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px', height: '130px' }}>
              {/* SVG 环形饼图 */}
              <svg viewBox="0 0 100 100" style={{ width: '105px', height: '105px', transform: 'rotate(-90deg)', filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.05))' }}>
                {/* 微博 45%: stroke-dasharray="45 100", stroke-dashoffset="0" */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3366FF" strokeWidth="16" strokeDasharray="45 100" strokeDashoffset="0" />
                {/* 今日头条 25%: stroke-dasharray="25 100", stroke-dashoffset="-45" */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#faad14" strokeWidth="16" strokeDasharray="25 100" strokeDashoffset="-45" />
                {/* 抖音短视频 15%: stroke-dasharray="15 100", stroke-dashoffset="-70" */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#13c2c2" strokeWidth="16" strokeDasharray="15 100" strokeDashoffset="-70" />
                {/* 其他及新闻 15%: stroke-dasharray="15 100", stroke-dashoffset="-85" */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ff4d4f" strokeWidth="16" strokeDasharray="15 100" strokeDashoffset="-85" />
                
                {/* 中心孔洞遮罩实现 Donut Chart */}
                <circle cx="50" cy="50" r="28" fill="var(--card-bg)" />
              </svg>
              {/* 右侧指标说明图例 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#3366FF', borderRadius: '2px', display: 'inline-block' }} />
                  <strong>微博: 45%</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#faad14', borderRadius: '2px', display: 'inline-block' }} />
                  <strong>今日头条: 25%</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#13c2c2', borderRadius: '2px', display: 'inline-block' }} />
                  <strong>抖音: 15%</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#ff4d4f', borderRadius: '2px', display: 'inline-block' }} />
                  <strong>其他/微信: 15%</strong>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
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

  // 报告内容生成器，根据任务、模板及时间段组合高保真 Markdown 文本
  const generateReportContent = (taskName: string, templateId: string, startTime: string, endTime: string): string => {
    // 提取截至时间，例如 2026-06-22 15:09:30 格式化为 06月22日 15时
    const formatTimePart = (timeStr: string) => {
      if (!timeStr) return '';
      const parts = timeStr.split(' ');
      const dateParts = parts[0].split('-');
      const timeParts = parts[1] ? parts[1].split(':') : ['00'];
      return `${dateParts[1]}月${dateParts[2]}日 ${timeParts[0]}时`;
    };
    
    const endFormatted = formatTimePart(endTime);
 
    // 查找对应模板的模块配置
    const activeTemplate = templates.find(t => t.id === templateId) || templates[0];
    const modules = activeTemplate.modules;
 
    let contentParts = [];
    contentParts.push(`# 关于“${taskName}专题”网上舆情报告\n(截至 ${endFormatted})`);
 
    modules.forEach((modKey) => {
      if (modKey === 'data_summary') {
        contentParts.push(`## 全网舆情数据汇总与概要
监测时间范围自 ${startTime} 至 ${endTime}。全网涉“${taskName}”相关公开舆情信息累计达 8.6万余条（24小时内新增 8.6万条，其中原发 1.8万条、转发 4.2万条、评论 2.6万条）。目前整体舆论情绪呈现高度波动的特征，需要持续进行追踪研判。`);
      } else if (modKey === 'official_media') {
        contentParts.push(`## 官方媒体发言汇总
监测期内，主流媒体针对该专题进行积极报道与正向引导：
1. [人民网] 发表社论指出，应当健全突发信访与社会民生诉求的接诉即办机制，及时开展属地舆情研判与源头化解，确保社会稳定。
2. [新华网] 深入报道专项工作的执行细节，肯定了多部门协同推进的工作机制，相关贴文阅读量超百万。
3. [重庆日报] 报道指出相关职能单位已成立专项对接小组深入现场开展政策宣介与答疑，确保秩序平稳。`);
      } else if (modKey === 'big_v_opinion') {
        contentParts.push(`## 境内外大V发言汇总
分析网络中粉丝量超百万的头部自媒体及大V账号发现，舆论主要观点如下：
1. 微博大V“@政务视点”（粉丝380w）发文表示，基层协调机制在日常工作中需加强风险隐患的排查，政策执行衔接应提升透明度。
2. 微信公众号“江淮微澜”发文《从热点舆情看基层矛盾化解的机制创新》，深度探讨了常态化改进方案。
3. 境外部分账号转发了现场图片，主要聚焦于当事人诉求，部分言论存在引伸抹黑的意图，但整体传播范围受限。`);
      } else if (modKey === 'hot_searches') {
        contentParts.push(`## 热搜话题匹配情况
在各大主流媒体热榜上，监测到与本次事件相关的词条匹配如下：
1. [微博同城榜] 话题“#${taskName}专题工作进展#”登上榜单第 3 位，引发 5.2 万次跟帖讨论。
2. [抖音热榜] 话题“${taskName}现场答复”登上热榜第 8 位，视频点击量突破 1200 万次。
3. [今日头条] 话题“${taskName}各方会谈”位居热榜第 14 位。`);
      } else if (modKey === 'netizen_sentiment') {
        contentParts.push(`## 普通网民正负面看法汇总
通过智能语义分析，普通网民的情绪分布如下：
1. [正面认可 (占 35.5%)] 肯定职能部门愿意下沉一线倾听民意，对通过合理合法途径解决诉求表示支持。
2. [中性关注 (占 50.2%)] 占大部分，主要以跟帖转发和询问后续处理结果为主，暂无明显情绪倾向。
3. [负面担忧 (占 14.3%)] 集中在质疑事件起因是否存在人为慢作为，并对后续赔偿或处理落实进度存疑。`);
      } else if (modKey === 'trend_chart') {
        contentParts.push(`## 发酵趋势数据折线图
[CHART:TREND]
舆情趋势折线图展示了监测期内事件的发酵和起伏过程，整体声量峰值出现在事件发生后的第 3-5 小时内，随着官媒联合澄清，热度在后期趋于平稳下行。`);
      } else if (modKey === 'platform_pie') {
        contentParts.push(`## 各平台声量占比饼图
[CHART:PIE]
如阵地占比饼图所示，微博作为社交主战场声量占比最高 (45%)，今日头条作为资讯分发核心占比达 25%，抖音等短视频平台占比 15%，微信和论坛等深度平台占比 15%。`);
      }
    });
 
    return contentParts.join('\n\n');
  };

  // 模板管理选中的切换逻辑
  const handleSelectTemplateInManager = (tplId: string) => {
    setSelectedTplId(tplId);
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setCurrentEditingTemplate({ ...tpl });
      setIsCreatingNewTpl(false);
    }
  };

  // 模板管理新建模板
  const handleCreateNewTemplate = () => {
    const newId = `tpl-${Date.now()}`;
    const newTpl: ReportTemplate = {
      id: newId,
      name: '',
      description: '用户自定义模板',
      modules: ['data_summary'],
      isCustom: true
    };
    setSelectedTplId(newId);
    setCurrentEditingTemplate(newTpl);
    setIsCreatingNewTpl(true);
  };

  // 模板管理取消/重置
  const handleCancelTemplateInManager = () => {
    if (isCreatingNewTpl) {
      setIsCreatingNewTpl(false);
      if (templates.length > 0) {
        setSelectedTplId(templates[0].id);
        setCurrentEditingTemplate({ ...templates[0] });
      } else {
        setSelectedTplId('');
        setCurrentEditingTemplate(null);
      }
    } else {
      const original = templates.find(t => t.id === selectedTplId);
      if (original) {
        setCurrentEditingTemplate({ ...original });
      }
    }
  };

  // 模板管理保存模板
  const handleSaveTemplateInManager = () => {
    if (!currentEditingTemplate) return;
    if (!currentEditingTemplate.name.trim()) {
      message.error('请输入模板名称！');
      return;
    }
    if (currentEditingTemplate.modules.length === 0) {
      message.error('请至少选择一个报告模块！');
      return;
    }

    setTemplates(prev => {
      const exists = prev.some(t => t.id === currentEditingTemplate.id);
      if (exists) {
        return prev.map(t => t.id === currentEditingTemplate.id ? currentEditingTemplate : t);
      } else {
        return [...prev, currentEditingTemplate];
      }
    });

    setIsCreatingNewTpl(false);
    message.success('模板保存成功！');
    setSelectedTplId(currentEditingTemplate.id);
  };

  // 模板管理删除模板
  const handleDeleteTemplate = (tplId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const filtered = templates.filter(t => t.id !== tplId);
    setTemplates(filtered);
    message.success('模板删除成功！');
    
    if (selectedTplId === tplId) {
      if (filtered.length > 0) {
        setSelectedTplId(filtered[0].id);
        setCurrentEditingTemplate({ ...filtered[0] });
      } else {
        setSelectedTplId('');
        setCurrentEditingTemplate(null);
      }
    }
  };

  // 获取模块对应的图标 React 组件
  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileTextOutlined': return <FileTextOutlined />;
      case 'MessageOutlined': return <MessageOutlined />;
      case 'UserOutlined': return <UserOutlined />;
      case 'LineChartOutlined': return <LineChartOutlined />;
      case 'LikeOutlined': return <LikeOutlined />;
      case 'AreaChartOutlined': return <AreaChartOutlined />;
      case 'PieChartOutlined': return <PieChartOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  // 生成最新报告事件触发（打开配置弹窗）
  const handleTriggerGenerateReport = () => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
      setSelectedTimeRange([
        dayjs('2026-06-21 15:09:30'),
        dayjs('2026-06-22 15:09:30')
      ]);
      setConfigModalOpen(true);
    } else {
      message.warning('请先在“模板管理”中创建至少一个模板！');
      setSelectedTplId('');
      setCurrentEditingTemplate(null);
      setTemplateManagerOpen(true);
    }
  };

  // 开始异步生成报告工作流（非阻塞后台大模型生成）
  const handleStartGenerateReport = () => {
    setConfigModalOpen(false);
    setGenerating(true);
    
    const currentActiveTask = sideTaskList.find(t => t.id === activeSideTask) || currentTask;
    const taskName = currentActiveTask.name;
    const newVersion = `V${reports.length + 1}`;
    const newTitle = `阶段性报告 ${newVersion} - ${taskName}专题`;
    
    const now = new Date();
    const todayDate = now.toISOString().replace('T', ' ').substring(0, 16);
    const newReportId = `report-${Date.now()}`;
    
    // 提取格式化起止时间
    let startTimeStr = '2026-06-21 15:09:30';
    let endTimeStr = '2026-06-22 15:09:30';
    let displayTimeRange = '06月21日 15时 至 06月22日 15时';
    
    if (selectedTimeRange && selectedTimeRange[0] && selectedTimeRange[1]) {
      startTimeStr = selectedTimeRange[0].format('YYYY-MM-DD HH:mm:ss');
      endTimeStr = selectedTimeRange[1].format('YYYY-MM-DD HH:mm:ss');
      displayTimeRange = `${selectedTimeRange[0].format('MM月DD日 HH时')} 至 ${selectedTimeRange[1].format('MM月DD日 HH时')}`;
    }

    // 1. 创建生成中占位报告卡片
    const placeholderReport: OpinionReport = {
      id: newReportId,
      version: newVersion,
      title: newTitle,
      date: todayDate,
      content: '', // 后台计算中暂时无内容
      status: 'generating',
      template: selectedTemplate,
      timeRange: displayTimeRange
    };

    // 2. 压入报告列表头部
    setReports(prev => [placeholderReport, ...prev]);
    // 3. 收起其他卡片，仅展开最新这条
    setExpandedReportIds([newReportId]);

    // 4. 模拟 4 秒大模型数据检索与提取分析过程
    setTimeout(() => {
      setGenerating(false);
      const finalContent = generateReportContent(taskName, selectedTemplate, startTimeStr, endTimeStr);
      
      setReports(prev => prev.map(report => {
        if (report.id === newReportId) {
          return {
            ...report,
            status: 'success',
            content: finalContent
          };
        }
        return report;
      }));
      
      message.success(`AI 智能分析完毕，${newTitle} 已成功生成！`);
    }, 4000);
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

  const visibleEvents = eventList
    .filter((event) => !ignoredEventIds.includes(event.id))
    .filter((event) => {
      if (onlyShowIssued) {
        const hasInstruction = issuedInstructions.some(item => item.eventId === event.id);
        if (!hasInstruction) return false;
      }
      if (activeTab === 'all') return true;
      if (activeTab === 'weibo') return event.platform === '微博';
      if (activeTab === 'douyin') return event.platform === '抖音';
      if (activeTab === 'wechat') return event.platform === '微信';
      if (activeTab === 'news') return event.platform === '新闻';
      if (activeTab === 'warning') return event.isWaring;
      return true;
    });
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
    setOnlyShowIssued(true);
  };

  // 批量失效监测相关方法
  const openBatchDetectModal = () => {
    setIsDetectModalOpen(true);
    setIsDetecting(true);
    setDetectProgress(0);
    
    // 获取需要监测的帖文：如果当前有选中项，则监测选中项中已下达指令的项；否则默认对列表中所有已下达指令的项进行监测
    const targetEvents = selectedEventIds.length > 0
      ? visibleEvents.filter(e => selectedEventIds.includes(e.id) && issuedInstructions.some(item => item.eventId === e.id))
      : eventList.filter(e => issuedInstructions.some(item => item.eventId === e.id));
      
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDetectProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // 随机让其中一些状态更新为链接失效，模拟真实检测
        const results = targetEvents.map(e => {
          const record = issuedInstructions.find(item => item.eventId === e.id);
          let mockStatus = record ? (linkStatusMap[record.id] || record.linkStatus) : '未检测';
          if (mockStatus === '未检测' || mockStatus === '仍可访问') {
            mockStatus = Math.random() > 0.4 ? '链接失效' : '仍可访问';
          }
          return {
            id: record?.id || `mock-${e.id}`,
            eventId: e.id,
            title: e.title,
            platform: e.platform,
            instructionNames: record?.instructionNames || ['待研判'],
            linkStatus: mockStatus
          };
        });
        
        // 优先展示已失效（链接失效）的记录
        const sortedResults = [...results].sort((a, b) => {
          if (a.linkStatus === '链接失效' && b.linkStatus !== '链接失效') return -1;
          if (a.linkStatus !== '链接失效' && b.linkStatus === '链接失效') return 1;
          return 0;
        });
        
        setDetectResults(sortedResults);
        setIsDetecting(false);
      }
    }, 150);
  };

  const handleBatchDetectConfirm = () => {
    const updatedStatusMap = { ...linkStatusMap };
    detectResults.forEach(item => {
      updatedStatusMap[item.id] = item.linkStatus as any;
    });
    setLinkStatusMap(updatedStatusMap);
    setIsDetectModalOpen(false);
    message.success('已成功同步失效监测状态至列表');
  };

  const renderInstructionProcessSlot = (eventId: string) => {
    const record = issuedInstructions.find(item => item.eventId === eventId);
    if (!record) return null;
    
    const linkStatus = linkStatusMap[record.id] || record.linkStatus;
    
    return (
      <div className="issued-instruction-process-slot" style={{
        marginTop: 12,
        padding: '12px 16px',
        background: 'rgba(24, 144, 255, 0.03)',
        borderRadius: 6,
        border: '1px solid rgba(24, 144, 255, 0.12)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '13px', color: '#555' }}>
            <span><strong>已下达指令：</strong>{record.instructionNames.join('、')}</span>
            <span><strong>接收属地/部门：</strong>{record.receiverArea} ({record.receiverPost})</span>
            <span><strong>接收人员：</strong>{record.receiverUser}</span>
            <span><strong>截止时间：</strong>{record.deadline}</span>
            <span><strong>处置状态：</strong>
              <Tag className={`command-status-tag ${getStatusClassName(record.status)}`}>{record.status}</Tag>
            </span>
            <span><strong>链接状态：</strong>
              <Tag className={`link-status-tag ${getLinkStatusClassName(linkStatus)}`}>
                <LinkOutlined /> {linkStatus}
              </Tag>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small" icon={<SyncOutlined />} onClick={() => handleDetectLink(record.id)}>
              检测链接
            </Button>
            <Button size="small" type="primary" onClick={() => setDetailInstruction(record)}>
              查看进度
            </Button>
          </div>
        </div>
        {record.latestFeedback && (
          <div style={{ marginTop: 8, fontSize: '12px', color: '#777', borderTop: '1px dashed #e8e8e8', paddingTop: 8 }}>
            <strong>最新反馈：</strong>{record.latestFeedback}
          </div>
        )}
      </div>
    );
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
      processSlot={renderInstructionProcessSlot(event.id)}
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
              <div className="filter-search" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="搜索事件内容"
                  className="event-search-input"
                />
                <Checkbox 
                  checked={onlyShowIssued} 
                  onChange={(e) => setOnlyShowIssued(e.target.checked)}
                  style={{ whiteSpace: 'nowrap', fontSize: '13px', marginLeft: 8 }}
                >
                  仅看已下达指令
                </Checkbox>
              </div>
              <div className="filter-actions-detail">
                <Button icon={<SafetyOutlined />} type="primary" onClick={openBatchDetectModal}>
                  批量失效监测
                </Button>
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
            {/* 事件列表 */}
            <div className="event-list-container">
              {visibleEvents.length > 0 ? (
                visibleEvents.map((event, index) => renderEventCard(event, index + 1))
              ) : (
                <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>暂无符合条件的卡片数据</div>
              )}
            </div>

            {selectedEventIds.length > 0 && (
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
                    type="primary"
                    style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                    onClick={() => setBatchPubOpen(true)}
                  >
                    批量添加到刊物
                  </Button>
                  <AddToPublicationModal
                    open={batchPubOpen}
                    onCancel={() => setBatchPubOpen(false)}
                    onSuccess={() => setSelectedEventIds([])}
                    posts={selectedEventIds.map(id => {
                      const event = visibleEvents.find(e => e.id === id);
                      return {
                        id: id,
                        title: event ? event.title : '舆情帖文',
                        content: event ? event.content : '',
                        platform: event ? event.platform : '',
                        author: event ? event.author : '',
                      };
                    })}
                  />
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => {
                    const firstTpl = templates[0];
                    setSelectedTplId(firstTpl ? firstTpl.id : 'comprehensive');
                    setCurrentEditingTemplate(firstTpl ? { ...firstTpl } : null);
                    setIsCreatingNewTpl(false);
                    setTemplateManagerOpen(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  模板管理
                </Button>
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
            </div>

            {/* 报告时间线（支持后台异步生成与折叠展开） */}
            <div className="reports-timeline-container" style={{ position: 'relative' }}>
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
                  {reports.map((report) => {
                    const isLatest = reports.length > 0 && report.id === reports[0].id;
                    const isExpanded = expandedReportIds.includes(report.id) || (isLatest && !collapsedReportIds.includes(report.id));
                    const isGenerating = report.status === 'generating';

                    return (
                      <div key={report.id} className="timeline-item">
                        {/* 左侧连线节点 */}
                        <div className="timeline-node">
                          <div className="timeline-dot" style={{ background: isGenerating ? '#60a5fa' : '#3366FF' }} />
                          <div className="timeline-line-connector" />
                        </div>
                        
                        {/* 右侧阶段报告卡片 */}
                        <div className="timeline-content-card" style={{ border: isGenerating ? '1px dashed #60a5fa' : '1px solid var(--border-color)' }}>
                          <div className="report-card-header">
                            <div className="report-card-title-box">
                              <span className="report-time">{report.date}</span>
                              <h4 className="report-version-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {report.title}
                                {isGenerating ? (
                                  <Tag color="processing" icon={<SyncOutlined spin />}>生成中</Tag>
                                ) : (
                                  <Tag color="success">已生成</Tag>
                                )}
                              </h4>
                            </div>
                            <div className="report-card-actions">
                              <Button
                                size="small"
                                type="primary"
                                ghost
                                icon={<EditOutlined />}
                                onClick={() => handleEditReport(report)}
                                disabled={isGenerating}
                              >
                                编辑
                              </Button>
                              <Button
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => handleExportReport(report.title)}
                                disabled={isGenerating}
                              >
                                导出
                              </Button>
                            </div>
                          </div>

                          {isGenerating ? (
                            /* 生成中占位卡片 (骨架屏与动态波浪进度条) */
                            <div className="report-card-body" style={{ padding: '20px', background: '#f8fafc', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                <LoadingOutlined style={{ fontSize: '18px', color: 'var(--primary-color)' }} spin />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                                  AI 正在深度分析归纳当前时间段舆情，请稍候...
                                </span>
                              </div>
                              {report.template && (
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                                  <strong>参考模板：</strong>
                                  {(() => {
                                    const t = templates.find(temp => temp.id === report.template);
                                    return t ? t.name.replace('xxxxx', currentActiveTask.name) : report.template;
                                  })()}
                                </div>
                              )}
                              {report.timeRange && (
                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                                  <strong>监测区间：</strong>{report.timeRange}
                                </div>
                              )}
                              {/* 模拟进度动画 */}
                              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                                <div 
                                  className="progress-bar-glow"
                                  style={{ 
                                    height: '100%', 
                                    width: '60%', 
                                    background: 'linear-gradient(90deg, #3366FF, #60a5fa)', 
                                    borderRadius: '3px',
                                    animation: 'pulse-glow 1.5s infinite ease-in-out'
                                  }} 
                                />
                              </div>
                              <style>{`
                                @keyframes pulse-glow {
                                  0% { width: 10%; opacity: 0.6; }
                                  50% { width: 75%; opacity: 1; }
                                  100% { width: 100%; opacity: 0.8; }
                                }
                              `}</style>
                            </div>
                          ) : (
                            /* 已生成卡片，支持折叠展开 */
                            <div 
                              className="report-card-body" 
                              style={{ 
                                position: 'relative',
                                maxHeight: isExpanded ? 'none' : '120px',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease-in-out'
                              }}
                            >
                              {renderMarkdown(report.content)}
                              
                              {/* 折叠下的渐变白色遮罩层 */}
                              {!isExpanded && (
                                <div 
                                  className="fold-mask-overlay" 
                                  style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60px',
                                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 75%, rgba(255, 255, 255, 1) 100%)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    paddingBottom: '2px',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => {
                                    setExpandedReportIds(prev => [...prev, report.id]);
                                    setCollapsedReportIds(prev => prev.filter(id => id !== report.id));
                                  }}
                                >
                                  <span style={{ fontSize: '12px', color: '#3366FF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    展开完整报告 <DownOutlined style={{ fontSize: '10px' }} />
                                  </span>
                                </div>
                              )}

                              {/* 展开下的折叠收起控制行 */}
                              {isExpanded && (
                                <div 
                                  style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    marginTop: '16px', 
                                    borderTop: '1px dashed #e2e8f0', 
                                    paddingTop: '8px', 
                                    cursor: 'pointer' 
                                  }}
                                  onClick={() => {
                                    setExpandedReportIds(prev => prev.filter(id => id !== report.id));
                                    if (isLatest) {
                                      setCollapsedReportIds(prev => [...prev, report.id]);
                                    }
                                  }}
                                >
                                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    收起报告内容 <UpOutlined style={{ fontSize: '10px' }} />
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 右侧任务列表 */}
      <div className="task-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">任务列表</h3>
          <Badge count={sideTaskList.length} className="task-count-badge" />
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
          {sideTaskList
            .filter(task => task.name.includes(searchValue) || task.code.includes(searchValue))
            .sort((a, b) => {
              if (a.isEffective !== b.isEffective) {
                return a.isEffective ? -1 : 1;
              }
              return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
            })
            .map((task) => (
              <div
                key={task.id}
                className={`side-task-text-item ${task.id === activeSideTask ? 'active' : ''} ${!task.isEffective ? 'expired' : ''}`}
                onClick={() => setActiveSideTask(task.id)}
              >
              <span className="side-task-text-name" title={task.name}>
                {task.name}
              </span>
              <div className="side-task-actions">
                <EditOutlined
                  className="action-icon edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTask(task);
                    setIsEditModalOpen(true);
                  }}
                />
                <Popconfirm
                  title="确定要删除该任务吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => handleDeleteTask(task.id)}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <DeleteOutlined
                    className="action-icon delete-icon"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
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

      {/* 新增：批量链接失效监测弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SafetyOutlined style={{ color: '#1890ff' }} />
            <span>批量链接失效监测</span>
          </div>
        }
        width={750}
        centered
        open={isDetectModalOpen}
        onCancel={() => !isDetecting && setIsDetectModalOpen(false)}
        footer={
          isDetecting ? null : [
            <Button key="cancel" onClick={() => setIsDetectModalOpen(false)}>
              关闭
            </Button>,
            <Button key="confirm" type="primary" onClick={handleBatchDetectConfirm}>
              确认同步状态
            </Button>
          ]
        }
      >
        {isDetecting ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <LoadingOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 16 }} />
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
              正在执行批量链接失效监测...
            </div>
            <div style={{ width: '80%', margin: '0 auto', background: '#f5f5f5', borderRadius: 4, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${detectProgress}%`, background: '#1890ff', height: '100%', transition: 'width 0.15s ease-out' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#999', marginTop: 8, display: 'inline-block' }}>
              检测进度：{detectProgress}%
            </span>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              padding: '10px 16px',
              borderRadius: 4,
              marginBottom: 16,
              fontSize: '13px',
              color: '#389e0d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                监测完成！共对 <strong>{detectResults.length}</strong> 条指令原帖链接进行了健康度筛查。
              </span>
              <span>
                已失效：<strong>{detectResults.filter(r => r.linkStatus === '链接失效').length}</strong> 篇
              </span>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 6 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>序号</th>
                    <th style={{ padding: '10px 16px', fontWeight: 600, width: '40%' }}>帖文内容/标题</th>
                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>指派平台</th>
                    <th style={{ padding: '10px 16px', fontWeight: 600 }}>指令类型</th>
                    <th style={{ padding: '10px 16px', fontWeight: 600, textAlign: 'center' }}>链接状态</th>
                  </tr>
                </thead>
                <tbody>
                  {detectResults.map((item, index) => {
                    const isInvalid = item.linkStatus === '链接失效';
                    return (
                      <tr key={item.id} style={{
                        borderBottom: '1px solid #f0f0f0',
                        background: isInvalid ? 'rgba(255, 77, 79, 0.02)' : 'transparent',
                        transition: 'background 0.3s'
                      }}>
                        <td style={{ padding: '10px 16px', color: '#888' }}>{index + 1}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 'bold' }}>
                          <div style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '240px'
                          }} title={item.title}>
                            {item.title}
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <Tag style={{ margin: 0 }}>{item.platform}</Tag>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          {item.instructionNames.join('、')}
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <Tag color={isInvalid ? 'red' : 'green'} style={{ margin: 0 }}>
                            {isInvalid ? <CloseOutlined /> : <CheckCircleOutlined />} {item.linkStatus}
                          </Tag>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

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

      {/* 新增优化：AI 舆情报告生成配置弹窗 */}
      <Modal
        title={
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            🤖 AI 舆情报告生成配置
          </div>
        }
        open={configModalOpen}
        onCancel={() => setConfigModalOpen(false)}
        okText="开始生成"
        cancelText="取消"
        onOk={handleStartGenerateReport}
        centered
        width={500}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '16px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
              请选择参考报告模板
            </div>
            <Select
              style={{ width: '100%' }}
              value={selectedTemplate}
              onChange={(value) => setSelectedTemplate(value)}
              options={templates.map(t => ({
                value: t.id,
                label: t.name.includes('xxxxx') ? t.name.replace('xxxxx', currentActiveTask.name) : t.name
              }))}
            />
            {(() => {
              const selectedTpl = templates.find(t => t.id === selectedTemplate);
              if (!selectedTpl) return null;
              
              const moduleNames = selectedTpl.modules.map(modKey => {
                const mod = REPORT_MODULES.find(m => m.key === modKey);
                return mod ? mod.name : modKey;
              });

              return (
                <div style={{ marginTop: '8px', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileTextOutlined style={{ color: '#3366FF' }} /> 该模板包含以下报告模块 ({selectedTpl.modules.length} 个)：
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {moduleNames.map((name, i) => (
                      <Tag key={i} color="blue" style={{ fontSize: '11px', margin: 0 }}>
                        {name}
                      </Tag>
                    ))}
                  </div>
                  {selectedTpl.description && (
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>
                      💡 说明：{selectedTpl.description}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
              请选择作为输入的时间范围
            </div>
            <DatePicker.RangePicker
              showTime
              style={{ width: '100%' }}
              value={selectedTimeRange}
              onChange={(values) => setSelectedTimeRange(values as any)}
              format="YYYY-MM-DD HH:mm:ss"
            />
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              💡 默认已自动同步外层任务已选中的舆情监测时间范围。
            </div>
          </div>
        </div>
      </Modal>
 
      {/* 新增：模板管理弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <SettingOutlined style={{ color: '#3366FF' }} /> 舆情综述报告模板管理
          </div>
        }
        open={templateManagerOpen}
        onCancel={() => {
          setTemplateManagerOpen(false);
          setCurrentEditingTemplate(null);
        }}
        width={950}
        centered
        footer={null}
        bodyStyle={{ padding: '0px' }}
      >
        <div style={{ display: 'flex', height: '580px', borderTop: '1px solid var(--border-color)' }}>
          {/* 左侧模板列表 */}
          <div style={{ width: '280px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
            <div style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>模板列表</span>
              <Button 
                size="small" 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateNewTemplate}
                style={{ fontSize: '11px', background: '#3366FF', borderColor: '#3366FF' }}
              >
                新建模板
              </Button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {templates.map(tpl => {
                  const isActive = selectedTplId === tpl.id && !isCreatingNewTpl;
                  
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplateInManager(tpl.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: isActive ? '#e6f7ff' : '#ffffff',
                        border: isActive ? '1px solid #1890ff' : '1px solid #e8e8e8',
                        position: 'relative',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: isActive ? '#1890ff' : 'var(--text-primary)', wordBreak: 'break-all', flex: 1 }}>
                          {tpl.name ? tpl.name.replace('xxxxx', currentActiveTask.name) : '(未命名模板)'}
                        </span>
                        <Button
                          type="text"
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                          style={{ padding: '0 4px', height: 'auto', color: '#ff4d4f' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {tpl.modules.length} 个模块
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* 右侧编辑/查看面板 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '16px 20px', overflow: 'hidden' }}>
            {(() => {
              if (!currentEditingTemplate) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    <FileTextOutlined style={{ fontSize: '48px', marginBottom: '12px', color: '#cbd5e1' }} />
                    <span>{templates.length === 0 ? '暂无可用模板，请点击左侧“新建模板”开始配置' : '请选择左侧模板或点击“新建模板”进行配置'}</span>
                  </div>
                );
              }
 
              const tplData = currentEditingTemplate;
 
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {isCreatingNewTpl ? '新建模板' : '编辑模板'}
                    </h3>
                  </div>
 
                  {/* 模板名称 */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      模板名称 <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Input
                      value={tplData.name}
                      onChange={(e) => {
                        if (currentEditingTemplate) {
                          setCurrentEditingTemplate({ ...currentEditingTemplate, name: e.target.value });
                        }
                      }}
                      placeholder="例如：安保工作专报模板"
                      style={{ fontSize: '13px' }}
                    />
                  </div>
 
                  {/* 模块选择 */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      选择包含的分析模块 <span style={{ color: 'red' }}>*</span> 
                      <span style={{ fontWeight: 'normal', color: '#94a3b8', fontSize: '11px', marginLeft: '6px' }}>
                        (已选择 {tplData.modules.length} / {REPORT_MODULES.length} 个模块)
                      </span>
                    </label>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                      {REPORT_MODULES.map(mod => {
                        const isChecked = tplData.modules.includes(mod.key);
                        
                        const handleToggleModule = () => {
                          if (!currentEditingTemplate) return;
                          const nextModules = isChecked
                            ? tplData.modules.filter(k => k !== mod.key)
                            : [...tplData.modules, mod.key];
                          setCurrentEditingTemplate({ ...currentEditingTemplate, modules: nextModules });
                        };
 
                        return (
                          <div
                            key={mod.key}
                            onClick={handleToggleModule}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '10px 14px',
                              borderRadius: '6px',
                              border: isChecked ? '1.5px solid #3366FF' : '1px solid var(--border-color)',
                              background: isChecked ? 'rgba(51, 102, 255, 0.02)' : 'var(--card-bg)',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              userSelect: 'none'
                            }}
                          >
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%', 
                              background: isChecked ? '#3366FF' : '#cbd5e1', 
                              color: '#ffffff', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              marginRight: '12px',
                              transition: 'background 0.2s'
                            }}>
                              {getModuleIcon(mod.icon)}
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 600, fontSize: '13px', color: isChecked ? '#3366FF' : 'var(--text-primary)' }}>
                                {mod.name}
                              </span>
                              <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                                {mod.description}
                              </span>
                            </div>
                            <div>
                              <Checkbox
                                checked={isChecked}
                                onChange={handleToggleModule}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 模板说明 */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      模板说明
                    </label>
                    <Input.TextArea
                      value={tplData.description || ''}
                      onChange={(e) => {
                        if (currentEditingTemplate) {
                          setCurrentEditingTemplate({ ...currentEditingTemplate, description: e.target.value });
                        }
                      }}
                      placeholder="请输入关于该模板的简要说明，以便于在生成报告选择模板时展示"
                      rows={2}
                      style={{ fontSize: '13px', resize: 'none' }}
                    />
                  </div>
 
                  {/* 保存/取消操作栏 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: 'auto' }}>
                    <Button onClick={handleCancelTemplateInManager}>
                      取消
                    </Button>
                    <Button type="primary" onClick={handleSaveTemplateInManager} style={{ background: '#3366FF', borderColor: '#3366FF' }}>
                      保存
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </Modal>
 
      {renderDetailDrawer()}

      {/* 新增：编辑任务弹窗 */}
      <Modal
        title="编辑任务"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onOk={() => {
          editForm.validateFields().then(values => {
            handleSaveTask(values as { name: string; status: string; isEffective: boolean });
          });
        }}
        destroyOnClose
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={editForm}
          layout="vertical"
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="name"
            label="任务名称"
            rules={[
              { required: true, message: '请输入任务名称' },
              { whitespace: true, message: '任务名称不能为空白' }
            ]}
          >
            <Input placeholder="请输入任务名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="status"
            label="任务状态"
            rules={[{ required: true, message: '请选择任务状态' }]}
          >
            <Select placeholder="请选择任务状态">
              <Select.Option value="normal">常态</Select.Option>
              <Select.Option value="urgent">紧急</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isEffective"
            label="布控状态"
            rules={[{ required: true, message: '请选择布控状态' }]}
          >
            <Select placeholder="请选择布控状态">
              <Select.Option value={true}>生效中</Select.Option>
              <Select.Option value={false}>已失效</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskDetail;
