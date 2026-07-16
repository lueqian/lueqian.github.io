/**
 * @name 警舆同处
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Button,
  Pagination,
  Checkbox,
  message,
  Tooltip,
  Modal,
  Badge,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CheckOutlined,
  CopyOutlined,
  RedoOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  EditOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  EllipsisOutlined,
  PhoneOutlined,
  PushpinOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
  RadarChartOutlined,
  SettingOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';
import AddToPublicationModal from '../components/AddToPublicationModal';

const { RangePicker } = DatePicker;

// ==================== MiniTrendChart Component ====================
interface MiniTrendChartProps {
  trend: 'up' | 'down' | 'flat';
  data: number[];
}

const MiniTrendChart: React.FC<MiniTrendChartProps> = ({ trend, data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    let lineColor = '#1677ff'; // flat
    if (trend === 'up') {
      lineColor = '#ff4d4f'; // up
    } else if (trend === 'down') {
      lineColor = '#52c41a'; // down
    }

    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 2,
        bottom: 2,
      },
      xAxis: {
        type: 'category',
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 'dataMin',
        max: 'dataMax',
      },
      series: [
        {
          data: data,
          type: 'line',
          showSymbol: false,
          smooth: true,
          lineStyle: {
            color: lineColor,
            width: 1.5,
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [trend, data]);

  return <div ref={chartRef} style={{ width: '80px', height: '20px', display: 'inline-block' }} />;
};

// ==================== Types ====================
interface EventItem {
  id: string;
  title: string;
  type: string;
  area: string;
  risk: '红色' | '橙色' | '黄色' | '蓝色';
  time: string;
  volume: string;
  volumeTrend: 'up' | 'down' | 'flat';
  originalCount: string;
  commentCount: string;
  hasAttachment: boolean;
  attachmentType?: 'video' | 'none';
  aiTrendText: string;
  aiTrendRate: string;
  aiTrendPredict: string;
  trendData: number[];
  hasAlertIcon?: boolean;
}

interface PostItem {
  id: string;
  seq: number;
  author: string;
  avatar: string;
  fans: string;
  time: string;
  platform: string;
  location: string;
  content: string;
  hasVideo: boolean;
  videoThumbnail?: string;
  hasImage: boolean;
  imageThumbnail?: string;
  frameRecognition?: string;
  simCount: number;
}

// ==================== Mock Data ====================
const mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    title: '苏HP9516车辆拉"冤"字横幅',
    type: '违背公序良俗严重冲击道德底线',
    area: '新城区',
    risk: '黄色',
    time: '2026-06-23 07:05:54',
    volume: '0.95k',
    volumeTrend: 'up',
    originalCount: '0.88k',
    commentCount: '55',
    hasAttachment: false,
    aiTrendText: '缓慢上升',
    aiTrendRate: '+2.0%/h',
    aiTrendPredict: '0.96k',
    trendData: [10, 15, 12, 18, 22, 28, 35],
  },
  {
    id: 'ev-2',
    title: '网民举报群众赌博',
    type: '涉黄赌毒线索',
    area: '开发区',
    risk: '蓝色',
    time: '2026-06-21 15:40:00',
    volume: '24.06w',
    volumeTrend: 'down',
    originalCount: '13.09w',
    commentCount: '9.78w',
    hasAttachment: false,
    aiTrendText: '下降',
    aiTrendRate: '-3.0%/h',
    aiTrendPredict: '24.06w',
    trendData: [85, 76, 68, 62, 55, 48, 40],
  },
  {
    id: 'ev-3',
    title: '网民反映空中房屋遭遇强拆',
    type: '生态环保',
    area: '淮阴区',
    risk: '橙色',
    time: '2026-06-20 12:40:54',
    volume: '3',
    volumeTrend: 'down',
    originalCount: '3',
    commentCount: '0',
    hasAttachment: false,
    aiTrendText: '下降',
    aiTrendRate: '-25.0%/h',
    aiTrendPredict: '3',
    trendData: [100, 80, 50, 30, 10, 5, 3],
  },
  {
    id: 'ev-4',
    title: '媒体报道淮安一面馆有顾客使用公共...',
    type: '食药安全',
    area: '开发区',
    risk: '蓝色',
    time: '2026-06-15 00:00:00',
    volume: '1.22k',
    volumeTrend: 'flat',
    originalCount: '89',
    commentCount: '1.12k',
    hasAttachment: false,
    aiTrendText: '平稳',
    aiTrendRate: '0.0%/h',
    aiTrendPredict: '1.22k',
    trendData: [20, 20, 21, 20, 20, 20, 20],
  },
  {
    id: 'ev-5',
    title: '十字路口摩托车交通事故',
    type: '违背公序良俗严重冲击道德底线',
    area: '清江浦区',
    risk: '红色',
    time: '2026-06-18 10:16:18',
    volume: '5',
    volumeTrend: 'down',
    originalCount: '5',
    commentCount: '0',
    hasAttachment: true,
    attachmentType: 'video',
    aiTrendText: '平稳',
    aiTrendRate: '0.0%/h',
    aiTrendPredict: '5',
    trendData: [15, 10, 8, 5, 5, 5, 5],
    hasAlertIcon: true,
  },
  {
    id: 'ev-6',
    title: '电子设备操作现场',
    type: '违背公序良俗严重冲击道德底线',
    area: '清江浦区',
    risk: '红色',
    time: '2026-06-17 11:07:37',
    volume: '1356.64w',
    volumeTrend: 'down',
    originalCount: '625.66w',
    commentCount: '430.41w',
    hasAttachment: true,
    attachmentType: 'video',
    aiTrendText: '下降',
    aiTrendRate: '-0.2%/h',
    aiTrendPredict: '1356.64w',
    trendData: [90, 88, 86, 85, 84, 83, 81],
    hasAlertIcon: true,
  },
  {
    id: 'ev-7',
    title: '三轮车车人资混装行驶',
    type: '个人极端行为',
    area: '淮安区',
    risk: '橙色',
    time: '2026-06-09 14:44:11',
    volume: '38',
    volumeTrend: 'up',
    originalCount: '38',
    commentCount: '0',
    hasAttachment: true,
    attachmentType: 'video',
    aiTrendText: '缓慢上升',
    aiTrendRate: '+2.0%/h',
    aiTrendPredict: '38',
    trendData: [12, 16, 20, 24, 28, 32, 38],
  },
];

const mockPosts: PostItem[] = [
  {
    id: 'p-1',
    seq: 1,
    author: '消炎药_',
    avatar: '👩‍⚕️',
    fans: '10',
    time: '2026-06-24 15:26:54',
    platform: '抖音app',
    location: '冤, 淮安',
    content: '#记录货车生活 #创作中心 #创作灵感 @苏J单宁...零首付38万买三轴欧曼的冤种 @...鄂A 小黑同学...鲁F海阳、小姜同学 @...豫西南车夫...',
    hasVideo: true,
    videoThumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    hasImage: false,
    frameRecognition: '我的货车生活大揭秘今日vLog 淮安到成都1700公里',
    simCount: 0,
  },
  {
    id: 'p-2',
    seq: 2,
    author: '可爱的广告君',
    avatar: '🤖',
    fans: '--',
    time: '2026-06-24 15:16:24',
    platform: '抖音app',
    location: '冤, 淮安',
    content: '在淮安装修一定要找天之源装饰! 一站式服务，每一项材料、每一笔人工费都看得清清楚楚，不花冤枉钱!',
    hasVideo: false,
    hasImage: true,
    imageThumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    simCount: 0,
  },
  {
    id: 'p-3',
    seq: 3,
    author: '周师傅家电维修',
    avatar: '👨‍🔧',
    fans: '3',
    time: '2026-06-24 15:04:18',
    platform: '抖音app',
    location: '江苏省淮安市,淮阴区(江苏省淮安市淮阴区) | 淮安, 冤',
    content: '淮安市淮阴区空调安装移机 【距离📍 <100米】 ☎️156 8004 0385，178 0818 4778，我是在淮安市淮阴区做空调维修 of 退伍老兵。脱下军装不退本色，凭着一股正直和刚毅，在本地做点诚实生意。这行水太深，今天我掏心窝子给大家分享几条硬核干货，绝对不让你花一分冤枉钱。',
    hasVideo: false,
    hasImage: true,
    imageThumbnail: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    frameRecognition: 'TCL|②GREE 加氟之前必须先抽真空不然加了也白加，管不了几天|③周亮亮家电维修空调安装、空调移机、空调清洗、空调加氟、空调维修联系电话: 1781875800... 淮安市...',
    simCount: 0,
  },
  {
    id: 'p-4',
    seq: 4,
    author: '塞车当头太辛苦',
    avatar: '🚗',
    fans: '12',
    time: '2026-06-24 14:55:10',
    platform: '微博',
    location: '冤, 淮安',
    content: '塞车当头太辛苦，为什么不可与家人说？带着十六日双重保障的公文，在淮安货运路口被拦下来，真是冤枉！谁能给个合理的说法？',
    hasVideo: false,
    hasImage: true,
    imageThumbnail: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    simCount: 0,
  },
];

const PoliceOpinionJoint: React.FC = () => {
  // ==================== Navigation States ====================
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // ==================== Event State (Mock DB) ====================
  const [events, setEvents] = useState<EventItem[]>(mockEvents);

  // ==================== Event List (Homepage) States ====================
  const [responsibilityArea, setResponsibilityArea] = useState('全部');
  const [timeRange, setTimeRange] = useState<any>(null);
  const [opinionType, setOpinionType] = useState('全部');
  const [riskLevel, setRiskLevel] = useState('全部');
  const [searchText, setSearchText] = useState('');

  // ==================== Event Details States ====================
  const [currentDetailTab, setCurrentDetailTab] = useState<'warn' | 'control' | 'person'>('warn');
  const [sentimentFilter, setSentimentFilter] = useState({ positive: true, neutral: true, negative: true });
  const [activePlatform, setActivePlatform] = useState('全部');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [batchPubOpen, setBatchPubOpen] = useState(false);
  const [expandedFramePosts, setExpandedFramePosts] = useState<string[]>([]);
  const [expandedContentPosts, setExpandedContentPosts] = useState<string[]>([]);

  // ==================== Approval Center States ====================
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(1);
  const [filesCollapsed, setFilesCollapsed] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Single pending event data structure
  const [pendingEvent, setPendingEvent] = useState({
    title: '清理荒苑路占道群聚聚集',
    reporter: '河下派出所-唐子期',
    unit: '河下派出所',
    time: '2026-07-06 19:00:11',
    location: '清淮苑入口旁道路',
    description: '现场显示示威棚处建筑入口旁道路，因流散集市的十余名群众站立，部分人员手持手机；一辆黑色轿车沿道路正常行驶，经过人数及遮蔽区域；现场人员查询车辆方向，未见肢体冲突。未见肢体冲突，整体秩序平稳。',
    aiAnalyzed: false,
    files: [
      {
        name: 'VID_20260706_190021.mp4',
        size: '11.83 MB',
        type: 'video',
      }
    ]
  });

  // Opinion Category selection and AI text result states
  const [opinionCategory, setOpinionCategory] = useState<string>('违背公序良俗严重冲击道德底线');
  const [aiTextResult, setAiTextResult] = useState('视频画面解析发现现场因流散集市的十余名群众站立，且有车辆正常经过，人车混行遮蔽视线，现场秩序存在聚集发酵风险。');

  // Checkbox states to select which descriptions to submit
  const [userDescChecked, setUserDescChecked] = useState(true);
  const [aiDescChecked, setAiDescChecked] = useState(true);

  // ==================== Approval Center Handlers ====================
  const handleApprove = () => {
    let finalDesc = pendingEvent.description;
    if (pendingEvent.aiAnalyzed) {
      const parts = [];
      if (userDescChecked) {
        parts.push(`【现场提交】：${pendingEvent.description}`);
      }
      if (aiDescChecked) {
        parts.push(`【AI分析】：${aiTextResult}`);
      }
      finalDesc = parts.join('\n');
    }

    message.success('审批已通过，已成功创建警舆同处布控任务');
    setPendingCount(0);
    setApprovalOpen(false);

    // Data linkage: insert the newly approved event into the homepage events list
    const newEvent: EventItem = {
      id: 'ev-new-approved-single',
      title: '清理荒苑路占道群聚聚集',
      type: opinionCategory, // Saved opinion category
      area: '淮安区',
      risk: '黄色',
      time: '2026-07-06 19:00:11',
      volume: '0.14k',
      volumeTrend: 'up',
      originalCount: '3',
      commentCount: '0',
      hasAttachment: true,
      attachmentType: 'video',
      aiTrendText: '急速扩散',
      aiTrendRate: '+25.0%/h',
      aiTrendPredict: '0.17k',
      trendData: [12, 24, 45, 68, 92, 115, 140],
      hasAlertIcon: true,
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleReject = () => {
    Modal.confirm({
      title: '请输入驳回原因',
      icon: <ExclamationCircleOutlined />,
      content: (
        <Input 
          id="reject-reason-input" 
          placeholder="请输入驳回意见（例如：上报材料不全，请重新上传现场照片）" 
          style={{ marginTop: 12 }} 
        />
      ),
      okText: '确认驳回',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        message.warning('已驳回该上报事件');
        setPendingCount(0);
        setApprovalOpen(false);
      }
    });
  };

  const handleAiReanalyze = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setUserDescChecked(true);
      setAiDescChecked(true);
      setPendingEvent(prev => ({
        ...prev,
        aiAnalyzed: true,
        files: [
          ...prev.files,
          {
            name: 'keyframe_883fbdf04a842dd8a4.png',
            size: '288.02 KB',
            type: 'image',
            title: '现场人员聚集',
            src: './assets/field_gathering.png'
          },
          {
            name: 'keyframe_8835a92d0ff40990b6.png',
            size: '364.83 KB',
            type: 'image',
            title: '车辆行驶经过',
            src: './assets/vehicle_passing.png'
          },
          {
            name: 'keyframe_94954fa3c458147d9ae.png',
            size: '328.02 KB',
            type: 'image',
            title: '遮蔽现场拍摄',
            src: './assets/obscured_shooting.png'
          }
        ]
      }));
      message.success('AI重新分析完成，已强制提交 3 张现场关键帧，并生成分析结果！');
    }, 1500);
  };

  // Find currently selected event data
  const currentEvent = events.find((ev) => ev.id === selectedEventId) || events[0];

  // ==================== Delete Event Handler ====================
  const handleDeleteEvent = (id: string) => {
    Modal.confirm({
      title: '确认删除该事件？',
      content: '删除后，对应的警舆同处任务及相关线上与线下布控数据将一并被移除。',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        message.success('事件已成功删除');
      },
    });
  };

  // ==================== Keyword Highlight Helper ====================
  const highlightKeywords = (text: string) => {
    if (!text) return '';
    const keywords = ['冤', '淮安'];
    let highlighted = text;
    
    // Simple regex highlight
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'g');
      highlighted = highlighted.replace(regex, `<span class="highlight-red">${keyword}</span>`);
    });

    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  // ==================== Filter Logic ====================
  const filteredEvents = events.filter((item) => {
    if (responsibilityArea !== '全部' && item.area !== responsibilityArea) return false;
    if (opinionType !== '全部' && item.type !== opinionType) return false;
    if (riskLevel !== '全部' && item.risk !== riskLevel) return false;
    if (searchText && !item.title.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  // Table columns definition
  const columns = [
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      width: '24%',
      render: (text: string, record: EventItem) => (
        <span 
          className="clickable-title" 
          onClick={() => setSelectedEventId(record.id)}
          style={{ cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
        >
          {record.hasAlertIcon && (
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '6px', fontSize: '15px' }} />
          )}
          {text}
        </span>
      ),
    },
    {
      title: '舆情类型',
      dataIndex: 'type',
      key: 'type',
      width: '18%',
      render: (text: string) => <span style={{ color: '#555' }}>{text}</span>,
    },
    {
      title: '责任属地',
      dataIndex: 'area',
      key: 'area',
      width: '8%',
    },
    {
      title: '风险等级',
      dataIndex: 'risk',
      key: 'risk',
      width: '8%',
      render: (risk: string) => {
        let colorClass = 'risk-blue';
        if (risk === '红色') colorClass = 'risk-red';
        else if (risk === '橙色') colorClass = 'risk-orange';
        else if (risk === '黄色') colorClass = 'risk-yellow';
        return <span className={`risk-pill ${colorClass}`}>{risk}</span>;
      },
    },
    {
      title: '发生时间',
      dataIndex: 'time',
      key: 'time',
      width: '12%',
      render: (time: string) => <span style={{ color: '#666', fontSize: '12px' }}>{time}</span>,
    },
    {
      title: '全网传播量',
      dataIndex: 'volume',
      key: 'volume',
      width: '8%',
      render: (text: string, record: EventItem) => (
        <div style={{ fontWeight: '600' }}>
          {text}{' '}
          {record.volumeTrend === 'up' && <ArrowUpOutlined style={{ color: '#ff4d4f', marginLeft: '2px', fontSize: '12px' }} />}
          {record.volumeTrend === 'down' && <ArrowDownOutlined style={{ color: '#52c41a', marginLeft: '2px', fontSize: '12px' }} />}
          {record.volumeTrend === 'flat' && <span className="flat-trend-line">—</span>}
        </div>
      ),
    },
    {
      title: '原创条数',
      dataIndex: 'originalCount',
      key: 'originalCount',
      width: '8%',
    },
    {
      title: '评论条数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: '8%',
    },
    {
      title: '现场情况',
      dataIndex: 'attachmentType',
      key: 'attachmentType',
      width: '8%',
      render: (type?: string) => {
        if (type === 'video') {
          return (
            <div className="table-video-thumbnail">
              <PlayCircleOutlined />
            </div>
          );
        }
        return <span style={{ color: '#999' }}>暂无附件</span>;
      },
    },
    {
      title: 'AI传播预测',
      key: 'aiPredict',
      width: '12%',
      render: (_: any, record: EventItem) => {
        let trendColor = '#1677ff'; // blue
        let trendBg = '#e6f7ff';
        if (record.volumeTrend === 'up') {
          trendColor = '#d46b08'; // orange
          trendBg = '#fff7e6';
        } else if (record.volumeTrend === 'down') {
          trendColor = '#389e0d'; // green
          trendBg = '#f6ffed';
        }
        return (
          <div className="ai-predict-cell">
            <div className="ai-predict-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span className="ai-predict-trend-badge" style={{ color: trendColor, background: trendBg, padding: '1px 4px', borderRadius: '3px', fontSize: '10px' }}>
                {record.aiTrendText}
              </span>
              <span className="ai-predict-rate" style={{ color: trendColor, fontWeight: 'bold', fontSize: '11px' }}>
                {record.aiTrendRate}
              </span>
            </div>
            <MiniTrendChart trend={record.volumeTrend} data={record.trendData} />
            <div className="ai-predict-forecast" style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
              4h预测: <span style={{ color: '#1677ff', fontWeight: 'bold' }}>{record.aiTrendPredict}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'deleteAction',
      width: '6%',
      render: (_: any, record: EventItem) => (
        <Button 
          type="link" 
          danger 
          onClick={(e) => {
            e.stopPropagation(); // Avoid opening details!
            handleDeleteEvent(record.id);
          }}
          style={{ padding: 0 }}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <div className="police-opinion-joint-container">
      {/* ================================================================ */}
      {/* 1. HOMEPAGE VIEW (EVENT LIST)                                    */}
      {/* ================================================================ */}
      {!selectedEventId ? (
        <div className="event-list-view">
          {/* Top filter section */}
          <div className="view-card filter-card">
            <div className="filter-grid">
              <div className="filter-item">
                <span className="filter-label">责任属地：</span>
                <Select
                  value={responsibilityArea}
                  onChange={setResponsibilityArea}
                  style={{ width: '100%' }}
                  options={[
                    { value: '全部', label: '全部' },
                    { value: '新城区', label: '新城区' },
                    { value: '开发区', label: '开发区' },
                    { value: '淮阴区', label: '淮阴区' },
                    { value: '清江浦区', label: '清江浦区' },
                    { value: '淮安区', label: '淮安区' },
                  ]}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">时间范围：</span>
                <RangePicker 
                  style={{ width: '100%' }} 
                  placeholder={['开始日期', '结束日期']}
                  onChange={(val) => setTimeRange(val)}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">舆情类型：</span>
                <Select
                  value={opinionType}
                  onChange={setOpinionType}
                  style={{ width: '100%' }}
                  options={[
                    { value: '全部', label: '全部' },
                    { value: '违背公序良俗严重冲击道德底线', label: '违背公序良俗严重冲击道德底线' },
                    { value: '涉黄赌毒线索', label: '涉黄赌毒线索' },
                    { value: '生态环保', label: '生态环保' },
                    { value: '食药安全', label: '食药安全' },
                    { value: '个人极端行为', label: '个人极端行为' },
                  ]}
                />
              </div>
              <div className="filter-item">
                <span className="filter-label">风险等级：</span>
                <Select
                  value={riskLevel}
                  onChange={setRiskLevel}
                  style={{ width: '100%' }}
                  options={[
                    { value: '全部', label: '全部' },
                    { value: '红色', label: '红色' },
                    { value: '橙色', label: '橙色' },
                    { value: '黄色', label: '黄色' },
                    { value: '蓝色', label: '蓝色' },
                  ]}
                />
              </div>
            </div>
            
            <div className="filter-actions-row">
              <div className="search-input-wrapper">
                <Input
                  placeholder="请输入事件标题/关键词进行模糊检索"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
              <div className="action-buttons-group">
                <Button icon={<DownloadOutlined />} className="action-outline-btn">导出 Excel</Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  className="action-outline-btn"
                  onClick={() => {
                    setResponsibilityArea('全部');
                    setTimeRange(null);
                    setOpinionType('全部');
                    setRiskLevel('全部');
                    setSearchText('');
                    message.success('筛选已重置');
                  }}
                >
                  重置
                </Button>
                <Button type="primary" icon={<SearchOutlined />} className="action-solid-btn">查询</Button>
                <Button icon={<RadarChartOutlined />} className="action-green-btn">防控指令</Button>
                <Badge count={pendingCount} offset={[-8, 8]} style={{ boxShadow: '0 0 0 1px #fff' }}>
                  <Button 
                    icon={<CheckOutlined />} 
                    className="action-purple-btn"
                    onClick={() => setApprovalOpen(true)}
                  >
                    审批中心
                  </Button>
                </Badge>
                <Button type="primary" danger icon={<EditOutlined />} className="action-red-btn">新建事件</Button>
              </div>
            </div>
          </div>

          {/* AI Intelligence Summary */}
          <div className="ai-summary-card">
            <div className="ai-summary-icon">
              <span className="ai-pill-icon">AI</span>
            </div>
            <div className="ai-summary-content">
              <h4>AI 智能摘要</h4>
              <p>
                当前共监测到 10 起舆情事件，其中红色预警 4 起、橙色预警 3 起、黄色预警 1 起、蓝色预警 2 起。需重点关注‘电子设备操作现场’事件（红色预警，传播量达1356万），因其风险等级最高且传播量极大，存在快速发酵扩散风险；另网民举报‘网民举报群众赌博’（蓝色预警，传播量24万）虽等级较低，但传播量显著高于同类事件，疑似存在线下联动可能。建议优先处置红色预警事件，尤其聚焦‘电子设备操作现场’的源头管控与权威回应。
              </p>
            </div>
          </div>

          {/* Event Table Container */}
          <div className="view-card table-card">
            <Table
              dataSource={filteredEvents}
              columns={columns}
              rowKey="id"
              pagination={false}
              className="police-opinion-table"
              onRow={(record) => ({
                onClick: () => setSelectedEventId(record.id),
              })}
            />
            <div className="table-pagination-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span className="pagination-total" style={{ color: '#666' }}>共 {filteredEvents.length} 条</span>
              <Pagination
                total={filteredEvents.length}
                pageSize={20}
                current={1}
                showSizeChanger
                locale={{
                  items_per_page: '条/页',
                }}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ================================================================ */
        /* 2. EVENT DETAILS VIEW (CONTROL - WEB POSTS)                      */
        /* ================================================================ */
        <div className="event-detail-view">
          {/* Navigation Path Header */}
          <div className="detail-breadcrumb-bar">
            <button className="breadcrumb-back-btn" onClick={() => {
              setSelectedEventId(null);
              setSelectedPosts([]);
            }}>
              <LeftOutlined /> 返回列表
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-title">{currentEvent.title}</span>
            <span className={`risk-pill risk-inline-tag ${
              currentEvent.risk === '红色' ? 'risk-red' :
              currentEvent.risk === '橙色' ? 'risk-orange' :
              currentEvent.risk === '黄色' ? 'risk-yellow' : 'risk-blue'
            }`}>
              {currentEvent.risk}
            </span>
          </div>

          {/* Workflow Stepper */}
          <div className="detail-stepper-card">
            <div className="step-item step-completed">
              <div className="step-indicator">
                <FileTextOutlined className="step-icon" />
              </div>
              <div className="step-info">
                <div className="step-title">事件详情</div>
                <div className="step-desc">上报与审批信息</div>
              </div>
              <div className="step-line" />
            </div>

            <div className="step-item step-active">
              <div className="step-indicator">
                <RadarChartOutlined className="step-icon" />
              </div>
              <div className="step-info">
                <div className="step-title">布控</div>
                <div className="step-desc">现场及网上布控</div>
              </div>
              <div className="step-line" />
            </div>

            <div className="step-item">
              <div className="step-indicator">
                <SettingOutlined className="step-icon" />
              </div>
              <div className="step-info">
                <div className="step-title">处置</div>
                <div className="step-desc">网上及网群处置</div>
              </div>
              <div className="step-line" />
            </div>

            <div className="step-item">
              <div className="step-indicator">
                <FileTextOutlined className="step-icon" />
              </div>
              <div className="step-info">
                <div className="step-title">报告</div>
                <div className="step-desc">形成阶段性报告</div>
              </div>
              <div className="step-line" />
            </div>

            <div className="step-item step-last">
              <div className="step-indicator">
                <TrophyOutlined className="step-icon" />
              </div>
              <div className="step-info">
                <div className="step-title">复盘</div>
                <div className="step-desc">复盘评价总结</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Row */}
          <div className="detail-tab-row">
            <div className="detail-tabs">
              <div 
                className={`detail-tab ${currentDetailTab === 'warn' ? 'active' : ''}`}
                onClick={() => setCurrentDetailTab('warn')}
              >
                全网预警
              </div>
              <div 
                className={`detail-tab ${currentDetailTab === 'control' ? 'active' : ''}`}
                onClick={() => setCurrentDetailTab('control')}
              >
                现场防控
              </div>
              <div 
                className={`detail-tab ${currentDetailTab === 'person' ? 'active' : ''}`}
                onClick={() => setCurrentDetailTab('person')}
              >
                人员管控
              </div>
            </div>
            <div className="detail-tab-actions">
              <Button icon={<EditOutlined />} className="action-outline-btn">编辑</Button>
              <Button type="primary" icon={<RadarChartOutlined />} className="action-purple-btn">AI 报告</Button>
            </div>
          </div>

          {/* ==================== TAB 1: 全网预警 (线上帖文 1:1 复刻) ==================== */}
          {currentDetailTab === 'warn' && (
            <div className="warn-tab-content">
              {/* Event basic info green banner */}
              <div className="event-info-banner">
                <div className="banner-left">
                  <div className="green-arrow-down-icon">⬇</div>
                  <div className="banner-title-info">
                    <h3>{currentEvent.title}</h3>
                    <div className="banner-time-range">
                      <ClockCircleOutlined /> 2026-06-23 15:46:02 至 2026-06-24 15:46:02
                    </div>
                  </div>
                </div>
                <div className="banner-right">
                  <Button type="primary" className="action-solid-btn">生成专项分析报告</Button>
                  <div className="sentiment-check-group">
                    <button 
                      className={`sentiment-btn positive-btn ${sentimentFilter.positive ? 'checked' : ''}`}
                      onClick={() => setSentimentFilter({...sentimentFilter, positive: !sentimentFilter.positive})}
                    >
                      正面 {sentimentFilter.positive && <CheckOutlined className="check-icon" />}
                    </button>
                    <button 
                      className={`sentiment-btn neutral-btn ${sentimentFilter.neutral ? 'checked' : ''}`}
                      onClick={() => setSentimentFilter({...sentimentFilter, neutral: !sentimentFilter.neutral})}
                    >
                      中性 {sentimentFilter.neutral && <CheckOutlined className="check-icon" />}
                    </button>
                    <button 
                      className={`sentiment-btn negative-btn ${sentimentFilter.negative ? 'checked' : ''}`}
                      onClick={() => setSentimentFilter({...sentimentFilter, negative: !sentimentFilter.negative})}
                    >
                      负面 {sentimentFilter.negative && <CheckOutlined className="check-icon" />}
                    </button>
                  </div>
                  <div className="banner-icons-row">
                    <Tooltip title="排重合并"><Button icon={<CopyOutlined />} className="banner-square-btn" /></Tooltip>
                    <Tooltip title="导出数据"><Button icon={<DownloadOutlined />} className="banner-square-btn" /></Tooltip>
                    <Tooltip title="刷新数据"><Button icon={<RedoOutlined />} className="banner-square-btn" /></Tooltip>
                    <Tooltip title="深度搜索"><Button icon={<SearchOutlined />} className="banner-square-btn" /></Tooltip>
                  </div>
                </div>
              </div>

              {/* Sub-level Platform Tabs & Filters */}
              <div className="platform-filter-bar">
                <div className="platform-pills">
                  {[
                    { key: '全部', label: '全部', count: 418 },
                    { key: '微博', label: '微博', count: 30 },
                    { key: '抖音', label: '抖音', count: 219 },
                    { key: '今日头条', label: '今日头条', count: 25 },
                    { key: '小红书', label: '小红书', count: 29 },
                    { key: '其他短视频', label: '其他短视频', count: 4 },
                    { key: '微信', label: '微信', count: 45 },
                    { key: '新闻', label: '新闻', count: 57 },
                  ].map((p) => (
                    <button
                      key={p.key}
                      className={`platform-pill-btn ${activePlatform === p.key ? 'active' : ''}`}
                      onClick={() => setActivePlatform(p.key)}
                    >
                      {p.label} <span className="pill-count">({p.count})</span>
                    </button>
                  ))}
                </div>

                <div className="platform-dropdown-filters">
                  <Button className="filter-dropdown-btn">
                    筛选 <span className="filter-count"></span>
                  </Button>
                  <Select defaultValue="快速筛选" className="filter-select" style={{ width: 100 }} bordered={false} disabled />
                  <Select defaultValue="desc" className="filter-select" style={{ width: 120 }} bordered={false} options={[
                    { value: 'desc', label: '按时间-倒序' },
                    { value: 'asc', label: '按时间-正序' },
                  ]} />
                  <span className="status-label">处置状态:</span>
                  <Select defaultValue="全部" className="filter-select" style={{ width: 80 }} bordered={false} options={[
                    { value: '全部', label: '全部' },
                    { value: '未处置', label: '未处置' },
                    { value: '处置中', label: '处置中' },
                    { value: '已处置', label: '已处置' },
                  ]} />
                </div>
              </div>

              {/* Web Posts List Container */}
              <div className="web-posts-list">
                {mockPosts
                  .filter(post => activePlatform === '全部' || post.platform.includes(activePlatform))
                  .map((post) => {
                    const isSelected = selectedPosts.includes(post.id);
                    const isFrameExpanded = expandedFramePosts.includes(post.id);
                    const isContentExpanded = expandedContentPosts.includes(post.id);

                    return (
                      <UnifiedOpinionCard
                        key={post.id}
                        id={post.id}
                        seq={post.seq}
                        title={post.content.slice(0, 30) + '...'}
                        author={post.author}
                        authorAvatar={<span className="post-avatar-icon">{post.avatar}</span>}
                        postId={post.id}
                        heat={post.fans !== '--' ? `粉丝:${post.fans}` : undefined}
                        platform={post.platform}
                        time={post.time}
                        content={highlightKeywords(post.content) as any}
                        hideIndex={true}
                        selected={isSelected}
                        selectionSlot={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPosts([...selectedPosts, post.id]);
                              } else {
                                setSelectedPosts(selectedPosts.filter((id) => id !== post.id));
                              }
                            }}
                            style={{ marginRight: 8 }}
                          />
                        }
                        mediaPreview={
                          post.hasVideo && post.videoThumbnail ? (
                            <div className="post-media-preview video-preview" style={{ marginTop: 0 }}>
                              <img src={post.videoThumbnail} alt="video thumbnail" />
                              <div className="media-play-overlay">
                                <PlayCircleOutlined />
                              </div>
                            </div>
                          ) : post.hasImage && post.imageThumbnail ? (
                            <div className="post-media-preview image-preview" style={{ marginTop: 0 }}>
                              <img src={post.imageThumbnail} alt="image thumbnail" />
                            </div>
                          ) : null
                        }
                        processSlot={post.frameRecognition && (
                          <div className="post-frame-recognition-box" style={{ marginTop: 0 }}>
                            <span className="frame-box-label">封面帧识别:</span>
                            <div className="frame-box-content">
                              {isFrameExpanded 
                                ? highlightKeywords(post.frameRecognition) 
                                : highlightKeywords(post.frameRecognition.slice(0, 40) + '...')}
                              <button
                                className="frame-expand-link"
                                onClick={() => {
                                  if (isFrameExpanded) {
                                    setExpandedFramePosts(expandedFramePosts.filter(id => id !== post.id));
                                  } else {
                                    setExpandedFramePosts([...expandedFramePosts, post.id]);
                                  }
                                }}
                              >
                                {isFrameExpanded ? '收起' : '[查看全部]'}
                              </button>
                            </div>
                          </div>
                        )}
                        footerBadges={<span style={{ marginRight: 16, color: '#999', fontSize: 12 }}>相似文章 {post.simCount}</span>}
                        actions={
                          <div className="post-actions-links">
                            <button className="post-action-link-btn" onClick={() => message.success('已触发一键研判')}>一键研判</button>
                            <button className="post-action-link-btn" onClick={() => message.success('已标记监测')}>标记监测</button>
                            <button className="post-action-link-btn">收藏</button>
                            <button className="post-action-link-btn" onClick={() => message.info('文章推送中')}>推送文章</button>
                            <button className="post-action-link-btn">
                              短信信息 <ArrowDownOutlined style={{ fontSize: 9 }} />
                            </button>
                            <button className="post-action-link-btn">查看原文</button>
                            <button className="post-action-link-btn"><EllipsisOutlined /></button>
                          </div>
                        }
                      />
                    );
                  })}
              </div>

              {/* Bottom Pagination & Selection Bar */}
              <div className="web-posts-footer-bar">
                <div className="footer-left-selection">
                  <Checkbox
                    checked={selectedPosts.length === mockPosts.length}
                    indeterminate={selectedPosts.length > 0 && selectedPosts.length < mockPosts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPosts(mockPosts.map((p) => p.id));
                      } else {
                        setSelectedPosts([]);
                      }
                    }}
                  >
                    全选
                  </Checkbox>
                  {selectedPosts.length > 0 && (
                    <span className="selected-badge-count">
                      已选择 <strong>{selectedPosts.length}</strong> 条帖文
                      <Button size="small" type="primary" style={{ marginLeft: '12px' }} onClick={() => message.success(`批量处置已启动 (${selectedPosts.length}条)`)}>
                        批量处置
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        style={{ marginLeft: '8px', backgroundColor: '#7c3aed', borderColor: '#7c3aed' }}
                        onClick={() => setBatchPubOpen(true)}
                      >
                        批量添加到刊物
                      </Button>
                      <AddToPublicationModal
                        open={batchPubOpen}
                        onCancel={() => setBatchPubOpen(false)}
                        onSuccess={() => setSelectedPosts([])}
                        posts={selectedPosts.map(id => {
                          const post = mockPosts.find(p => p.id === id);
                          return {
                            id: id,
                            title: post ? post.content.slice(0, 30) + '...' : '舆情帖文',
                            content: post ? post.content : '',
                            platform: post ? post.platform : '',
                            author: post ? post.author : '',
                          };
                        })}
                      />
                    </span>
                  )}
                </div>
                <div className="footer-right-pagination">
                  <Pagination
                    total={mockPosts.length}
                    pageSize={20}
                    current={1}
                    showSizeChanger
                    locale={{
                      items_per_page: '20条/页',
                    }}
                  />
                  <div className="page-jump-input-wrapper">
                    <span>前往</span>
                    <input type="text" defaultValue="1" className="pagination-jump-textbox" />
                    <span>页</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: 现场防控 ==================== */}
          {currentDetailTab === 'control' && (
            <div className="view-card premium-placeholder-view">
              <div className="placeholder-icon">🗺️</div>
              <h3>现场精准防控与警情调度</h3>
              <p>允许对线下重点区域、路段实施现场维稳，调度周围警力并绑定现场采集音视频设备。</p>
              <div className="control-map-mock">
                <div className="map-point active-point" style={{ top: '35%', left: '42%' }}>
                  <PushpinOutlined /> <span>警力1组 - 淮安南路口</span>
                </div>
                <div className="map-point active-point" style={{ top: '60%', left: '70%' }}>
                  <PushpinOutlined /> <span>警力2组 - 群众聚集点</span>
                </div>
                <div className="map-point device-point" style={{ top: '48%', left: '55%' }}>
                  <EnvironmentOutlined /> <span>应急执法车(移动天网)</span>
                </div>
              </div>
              <div className="dispatch-buttons" style={{ marginTop: '24px' }}>
                <Button type="primary" icon={<RadarChartOutlined />}>一键呼叫现场对讲</Button>
                <Button style={{ marginLeft: '12px' }} icon={<PhoneOutlined />}>联络属地派出所</Button>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: 人员管控 ==================== */}
          {currentDetailTab === 'person' && (
            <div className="view-card premium-placeholder-view">
              <div className="placeholder-icon">👥</div>
              <h3>重点涉事人员与线上传播账号布控</h3>
              <p>关联涉线下聚集活动带头人与线上高频恶意传播的网民账号，构建关联图谱实施一体化阻断与劝导工作。</p>
              <div className="person-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px', width: '100%', maxWidth: '800px' }}>
                <div className="person-profile-card">
                  <div className="profile-header">
                    <span className="profile-avatar">👤</span>
                    <div className="profile-info">
                      <h4>张某民</h4>
                      <Tag color="red">重点线下组织者</Tag>
                    </div>
                  </div>
                  <div className="profile-body">
                    <div>身份证: 3208************12</div>
                    <div>关联车辆: 苏HP9516</div>
                    <div>管控状态: 属地已接话劝导中</div>
                  </div>
                </div>

                <div className="person-profile-card">
                  <div className="profile-header">
                    <span className="profile-avatar">👤</span>
                    <div className="profile-info">
                      <h4>消炎药_ (抖音)</h4>
                      <Tag color="orange">敏感传播源</Tag>
                    </div>
                  </div>
                  <div className="profile-body">
                    <div>当前粉丝: 10</div>
                    <div>发布文章: 1 (全网传播0.95k)</div>
                    <div>管控状态: 正在实施线上私信约谈</div>
                  </div>
                </div>

                <div className="person-profile-card">
                  <div className="profile-header">
                    <span className="profile-avatar">👤</span>
                    <div className="profile-info">
                      <h4>李某林</h4>
                      <Tag color="blue">现场聚集跟随人员</Tag>
                    </div>
                  </div>
                  <div className="profile-body">
                    <div>身份证: 3208************45</div>
                    <div>关联手机: 178****5678</div>
                    <div>管控状态: 已被现场民警劝离</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* 审批中心 Modal */}
      <Modal
        open={approvalOpen}
        onCancel={() => setApprovalOpen(false)}
        width={800}
        title={
          <div className="approval-modal-title">
            <span className="approval-modal-title-text">审批中心</span>
            {pendingCount > 0 && <span className="approval-modal-title-badge">{pendingCount}件审批</span>}
          </div>
        }
        footer={
          <div style={{ textAlign: 'right' }}>
            <button className="btn-close-modal" onClick={() => setApprovalOpen(false)}>关闭</button>
          </div>
        }
        centered
        destroyOnClose
      >
        {pendingCount > 0 ? (
          aiAnalyzing ? (
            <div className="ai-loading-placeholder" style={{ marginTop: '20px', padding: '60px 0' }}>
              <div className="ai-spinner" />
              <div className="ai-loading-text">AI 现场视频内容智能理解与分析中...</div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>预计还需 1.5 秒</div>
            </div>
          ) : (
            <div className="approval-event-card" style={{ boxShadow: 'none', border: 'none', padding: '8px 0 0 0', marginBottom: 0 }}>
              <div className="approval-card-header">
                <div className="approval-card-title-group">
                  <span className="approval-card-title">{pendingEvent.title}</span>
                  <Tag className="tag-app-mobile">APP机动</Tag>
                  <Tag className="tag-pending-review">待审批</Tag>
                </div>
              </div>

              <div className="approval-card-meta">
                <div className="approval-card-meta-item">
                  <span className="approval-card-meta-label">上报人: </span>
                  <span className="approval-card-meta-value">{pendingEvent.reporter}</span>
                </div>
                <div className="approval-card-meta-item">
                  <span className="approval-card-meta-label">上报单位: </span>
                  <span className="approval-card-meta-value">{pendingEvent.unit}</span>
                </div>
                <div className="approval-card-meta-item">
                  <span className="approval-card-meta-label">上报时间: </span>
                  <span className="approval-card-meta-value">{pendingEvent.time}</span>
                </div>
              </div>

              <div className="approval-card-address" onClick={() => message.info(`已在地图定位：${pendingEvent.location}`)} style={{ marginBottom: '16px' }}>
                <EnvironmentOutlined style={{ color: '#2563eb' }} />
                <span style={{ textDecoration: 'underline' }}>{pendingEvent.location}</span>
              </div>

              {/* 舆情类型选择框 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
                <span style={{ color: '#6b7280', fontWeight: 600 }}>舆情类型: </span>
                <Select 
                  value={opinionCategory} 
                  onChange={setOpinionCategory} 
                  style={{ width: '280px' }}
                  options={[
                    { value: '违背公序良俗严重冲击道德底线', label: '违背公序良俗严重冲击道德底线' },
                    { value: '涉黄赌毒线索', label: '涉黄赌毒线索' },
                    { value: '生态环保', label: '生态环保' },
                    { value: '食药安全', label: '食药安全' },
                    { value: '个人极端行为', label: '个人极端行为' },
                  ]}
                />
              </div>

              {/* 编辑与比对区域（当AI解析完毕后展现） */}
              {pendingEvent.aiAnalyzed ? (
                <div className="ai-analysis-container">
                  <div className="ai-analysis-header">
                    <span style={{ background: '#7c3aed', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '10px' }}>AI</span>
                    <span>AI 现场解析结果编辑区</span>
                  </div>
                  
                  <div className="ai-analysis-inputs">
                    <div className="ai-input-item">
                      <span className="ai-input-label" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Checkbox 
                          checked={userDescChecked} 
                          onChange={(e) => setUserDescChecked(e.target.checked)} 
                        />
                        现场提交事件概述：
                      </span>
                      <textarea 
                        className="ai-textarea"
                        rows={2}
                        value={pendingEvent.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPendingEvent(prev => ({ ...prev, description: val }));
                        }}
                      />
                    </div>
                    
                    <div className="ai-input-item">
                      <span className="ai-input-label" style={{ color: '#7c3aed', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Checkbox 
                          checked={aiDescChecked} 
                          onChange={(e) => setAiDescChecked(e.target.checked)} 
                        />
                        AI分析事件概述：
                      </span>
                      <textarea 
                        className="ai-textarea"
                        rows={3}
                        value={aiTextResult}
                        onChange={(e) => setAiTextResult(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="approval-card-description" style={{ marginBottom: '16px' }}>
                  <strong>事件概述：</strong>{pendingEvent.description}
                </div>
              )}

              {/* 现场情况文件列表 */}
              <div className="approval-files-section">
                <div className="approval-files-header" onClick={() => setFilesCollapsed(!filesCollapsed)}>
                  <div className="approval-files-header-left">
                    <FileTextOutlined style={{ color: '#3b82f6', marginRight: '4px' }} />
                    <span>现场情况 共 {pendingEvent.files.length} 个文件</span>
                  </div>
                  <div className="approval-files-header-toggle">
                    {filesCollapsed ? '展开 ﹀' : '收起 ︿'}
                  </div>
                </div>

                {!filesCollapsed && (
                  <div className="approval-files-list">
                    {pendingEvent.files.map((file: any, fIdx: number) => {
                      if (file.type === 'video') {
                        return (
                          <div className="approval-file-card" key={fIdx}>
                            <div className="approval-file-preview video-preview">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
                                <path d="M10 8L16 12L10 16V8Z" fill="white" />
                                <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <div className="approval-file-info">
                              <div className="approval-file-name" title={file.name}>{file.name}</div>
                              <div className="approval-file-size">{file.size}</div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="approval-file-card" key={fIdx}>
                          <div className="approval-file-preview">
                            <img src={file.src} alt={file.title} />
                            <div className="approval-file-preview-label">{file.title}</div>
                          </div>
                          <div className="approval-file-info">
                            <div className="approval-file-name" title={file.name}>{file.name}</div>
                            <div className="approval-file-size">{file.size}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="approval-card-actions">
                {/* 如果未解析，显示AI重新分析按钮 */}
                {!pendingEvent.aiAnalyzed && (
                  <button className="btn-ai-analyze" onClick={handleAiReanalyze}>
                    <RadarChartOutlined />
                    <span>AI重新分析</span>
                  </button>
                )}
                <button className="btn-reject" onClick={handleReject}>
                  <CloseOutlined />
                  <span>驳回</span>
                </button>
                <button className="btn-approve" onClick={handleApprove}>
                  <CheckOutlined />
                  <span>审批通过</span>
                </button>
              </div>
            </div>
          )
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无待审批的事件" style={{ padding: '40px 0' }} />
        )}
      </Modal>
    </div>
  );
};

export default PoliceOpinionJoint;
