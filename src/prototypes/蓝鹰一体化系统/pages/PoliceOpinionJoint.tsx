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
  Radio,
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
import crowdOnlookersImg from '../assets/crowd_onlookers.png';
import vehiclePassingImg from '../assets/vehicle_passing.png';
import obscuredShootingImg from '../assets/obscured_shooting.png';

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
  videoStatus?: 'no_video' | 'dispatched' | 'returned' | 'overtime';
  dispatchedTo?: string;
  deadlineText?: string;
  videoVersions?: {
    filename: string;
    filesize: string;
    videoThumbnail: string;
    keyframes: { name: string; thumbnail: string; seq: number; hash: string }[];
    aiReport: {
      scene: string;
      riskNature: string;
      riskScale: string;
      observations: string[];
    };
    description: string;
  }[];
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
    id: 'ev-8',
    title: '清雅苑入口道路群众聚集',
    type: '业主物业纠纷',
    area: '河下派出所',
    risk: '黄色',
    time: '2026-07-16 16:40:38',
    volume: '12.5k',
    volumeTrend: 'up',
    originalCount: '8.2k',
    commentCount: '4.3k',
    hasAttachment: true,
    attachmentType: 'video',
    aiTrendText: '平稳',
    aiTrendRate: '0.0%/h',
    aiTrendPredict: '12.5k',
    trendData: [10, 20, 15, 30, 45, 40, 50],
    videoStatus: 'returned',
    videoVersions: [
      {
        filename: 'VID_20260716_164010.mp4',
        filesize: '9.45 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '现场人员聚集', thumbnail: crowdOnlookersImg, seq: 1, hash: 'keyframe_ev8_001...' },
          { name: '劝导警力就位', thumbnail: vehiclePassingImg, seq: 2, hash: 'keyframe_ev8_002...' },
          { name: '聚集商讨对话', thumbnail: obscuredShootingImg, seq: 3, hash: 'keyframe_ev8_003...' }
        ],
        aiReport: {
          scene: '小区入口通道，约有十余名业主聚集在清雅苑门前通道。现场停有一辆黑色轿车，周边有部分群众围观，人员情绪平稳，未见肢体冲突。',
          riskNature: '物业矛盾/聚集',
          riskScale: '小规模 (15人左右)',
          observations: [
            '业主代表正在现场与物业负责人进行面对面交涉沟通。',
            '通道未被封死，非涉事车辆仍能缓慢进出。',
            '现场有民警在场开展秩序维护，防范矛盾升级。',
            '舆情声量呈上升趋势，主要讨论点集中在物业服务收费合理性。'
          ]
        },
        description: '视频显示清雅苑入口旁道路聚集了约十余名群众站立协商，部分人员持手机记录，现场秩序平稳，未见拥堵和冲突。'
      }
    ]
  },
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
    videoStatus: 'no_video',
    videoVersions: []
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
    videoStatus: 'no_video',
    videoVersions: []
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
    videoStatus: 'no_video',
    videoVersions: []
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
    videoStatus: 'no_video',
    videoVersions: []
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
    videoStatus: 'returned',
    videoVersions: [
      {
        filename: 'VID_20260618_101618.mp4',
        filesize: '4.88 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '摩托车避让不及', thumbnail: vehiclePassingImg, seq: 1, hash: 'keyframe_ev5_001...' }
        ],
        aiReport: {
          scene: '十字路口，摩托车发生碰擦倾倒，周边行人上前围观。',
          riskNature: '交通事故/围观舆情',
          riskScale: '极微规模',
          observations: [
            '事故发生瞬间被路人行车记录仪录下并上传网络。',
            '现场交警已快速到场清障，未造成大范围道路拥堵。'
          ]
        },
        description: '十字路口摩托车刮擦交通事故现场，无人员严重受伤，事故已处理完毕，现场秩序正常。'
      }
    ]
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
    videoStatus: 'returned',
    videoVersions: [
      {
        filename: 'VID_20260617_110737.mp4',
        filesize: '14.50 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '违规设备录像', thumbnail: vehiclePassingImg, seq: 1, hash: 'keyframe_ev6_001...' }
        ],
        aiReport: {
          scene: '室内某机房或电子设备操作柜台前。',
          riskNature: '违规操作曝光',
          riskScale: '线上大声量传播',
          observations: [
            '该曝光引起极高声量关注，线上情绪较为对立，急需官方发声澄清。'
          ]
        },
        description: '网民上传的某电子设备违规运行画面，传播量极大，已开启线上紧急管控。'
      }
    ]
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
    videoStatus: 'returned',
    videoVersions: [
      {
        filename: 'VID_20260609_144411.mp4',
        filesize: '3.12 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '人货混装行驶', thumbnail: vehiclePassingImg, seq: 1, hash: 'keyframe_ev7_001...' }
        ],
        aiReport: {
          scene: '淮安区马路上，一辆电动三轮车严重超载货人混装行驶。',
          riskNature: '交通违规/安全隐患',
          riskScale: '微小规模',
          observations: [
            '有网民随手拍上传至本地网络论坛，引发小规模交通安全讨论。'
          ]
        },
        description: '淮安区马路三轮车人货混装行驶画面，涉嫌违规载人载物，已通知辖区交警中队实施路面布控纠违。'
      }
    ]
  },
  {
    id: 'ev-fire',
    title: '江苏淮安城南街道塑料管道堆场突发火灾',
    type: '自然灾害',
    area: '淮安区',
    risk: '红色',
    time: '2026-05-26 14:33:40',
    volume: '244.23w',
    volumeTrend: 'down',
    originalCount: '132.56w',
    commentCount: '104.58w',
    hasAttachment: true,
    attachmentType: 'video',
    aiTrendText: '平稳',
    aiTrendRate: '-2.0%/h',
    aiTrendPredict: '244.23w',
    trendData: [85, 78, 62, 50, 42, 35, 30],
    hasAlertIcon: true,
    videoStatus: 'returned',
    videoVersions: [
      {
        filename: 'VID_20260706_190021.mp4',
        filesize: '11.8 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '围观人员聚集', thumbnail: crowdOnlookersImg, seq: 1, hash: 'keyframe_583d3bdf04a842d8a40dd85d...' },
          { name: '车辆行驶经过', thumbnail: vehiclePassingImg, seq: 2, hash: 'keyframe_vehicle_passing_0706_190021...' },
          { name: '地点标识识别', thumbnail: obscuredShootingImg, seq: 3, hash: 'keyframe_94654e3c458147e9aed214fb5...' }
        ],
        aiReport: {
          scene: '室外场景，位于标有*清雅苑*字样的建筑入口旁道路。天气晴朗，光线充足。路边聚集约十余名群众，呈站立姿态，部分人员手持手机疑似拍摄。一辆黑色轿车沿道路正常行驶，经过漆黑区域。道路通畅，未见拥堵或冲突迹象。',
          riskNature: '和平表达/围观',
          riskScale: '小规模（<20 人）',
          observations: [
            '现场聚集十余人，行为相对克制，未见横幅或扩音设备。',
            '视频中有一辆黑色轿车沿正常轨迹驶过，无阻碍交通行为。',
            '有三名关键人员手持手机进行拍摄，可能是信息传播节点。',
            '属地派出所巡逻车辆已在周边视线范围内，具备快速干预能力。'
          ]
        },
        description: '视频显示清雅苑建筑入口旁道路，路边聚集约十余名群众站立，部分人员手持手机；一辆黑色轿车沿道路正常行驶，经过人群及罩阁区域；现场人员面向车辆方向，未见肢体冲突，道路未受阻塞，整体秩序平稳。'
      }
    ]
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
  const [currentStep, setCurrentStep] = useState<'detail' | 'control' | 'handle' | 'report' | 'review'>('detail');
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

  // ==================== Control Instructions States ====================
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  
  // Default templates in the Control Instruction Library (1:1 with Screenshot 1 + 2 extra to make it 5)
  const [instructionTemplates, setInstructionTemplates] = useState<any[]>([
    {
      id: 't-1',
      name: '突发重大火灾/灾害应急抢险指令',
      type: '现场指令',
      time: '2026-05-18 18:37:30',
      request: '迅速启动应急预案，实施周边道路清障与交通管制，全力配合消防与卫健部门开展救援。',
      list: [
        '组织交警对火灾/灾害现场周边500米道路实施临时交通管制。',
        '清理打通“生命通道”，确保消防车、救护车无障碍通行。',
        '协助疏散火灾/灾害现场核心区受灾群众至安全地带。',
        '安排便衣与巡逻警力，加强周边商铺及住宅夜间值守，严防发生盗窃或哄抢。'
      ]
    },
    {
      id: 't-2',
      name: '群体性聚集/非法维稳处置指令',
      type: '现场指令',
      time: '2026-05-18 18:36:51',
      request: '立即奔赴现场，拉设警戒线控制核心区域，对聚集人群进行法制宣讲与疏散劝导，严防主干道交通中断。',
      list: [
        '部署警力封锁现场出入口',
        '开辟外围警戒线，隔离无关围观群众',
        '对现场核心诉求表达人进行身份信息登记',
        '配合属地政府有关部门开展现场劝解与疏导',
        '依法对现场挑头煽动、恶意拍摄并随意上传网络的人员进行口头警告或强制带离'
      ]
    },
    {
      id: 't-3',
      name: '现场人员疏散',
      type: '现场指令',
      time: '2026-05-17 09:53:30',
      request: '有序引导现场人员疏散，避免大规模交通堵塞出现，规避踩踏风险，确保无人员伤亡，及时反馈。',
      list: [
        '人员疏散',
        '交通恢复',
        '现场伤亡情况确认',
        '反馈现场执行情况'
      ]
    },
    {
      id: 't-4',
      name: '道路交通事故应急处置指令',
      type: '现场指令',
      time: '2026-05-16 10:12:00',
      request: '迅速派警前往事故现场，开展交通疏导、现场勘查与秩序维护，防止二次事故发生。',
      list: [
        '抢救受伤人员并联络医疗救助',
        '开展事故现场勘查与证据固定',
        '指引周边车辆绕行，疏导拥堵'
      ]
    },
    {
      id: 't-5',
      name: '涉黄赌毒线索核查指令',
      type: '现场指令',
      time: '2026-05-15 15:40:00',
      request: '对网民举报的涉黄赌毒可疑线索进行线上分析与线下摸排，核实具体场所与涉案人员情况。',
      list: [
        '调取周边天网视频查明可疑人员进出规律',
        '组织便衣警力对涉案场所实施暗访摸排',
        '依法传唤可疑人员并制作询问笔录'
      ]
    }
  ]);

  // Form states for creating/editing template
  const [formName, setFormName] = useState('');
  const [formRequest, setFormRequest] = useState('');
  const [formList, setFormList] = useState('');

  // Active instructions dispatched to events (default data 1:1 with Screenshot 3)
  const [eventInstructions, setEventInstructions] = useState<any[]>([
    {
      id: 'inst-1',
      eventId: 'ev-fire',
      name: '现场人员疏散',
      type: '现场指令',
      time: '2026-05-18 18:13:31',
      sender: 'cs02市局（支队）',
      status: '已反馈',
      request: '有序引导现场人员疏散，避免大规模交通堵塞出现，规避踩踏风险，确保无人员伤亡，及时反馈。',
      signTime: '2026-05-18 18:29:48',
      list: [
        { name: '人员疏散', dept: 'cs03区县' },
        { name: '交通恢复', dept: 'cs03区县' },
        { name: '现场伤亡情况确认', dept: 'cs03区县' },
        { name: '反馈现场执行情况', dept: 'cs03区县' }
      ],
      feedbackSender: 'cs03区县',
      feedbackTime: '2026-05-18 18:29:56',
      feedbackText: '问题不大',
      isExpanded: true
    }
  ]);

  // Dispatch fields
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchTemplateId, setDispatchTemplateId] = useState('');
  const [dispatchReceiver, setDispatchReceiver] = useState('cs03区县');
  const [dispatchRequest, setDispatchRequest] = useState('');
  const [dispatchListText, setDispatchListText] = useState('');

  // Video backfill states
  const [dispatchCaptureModalOpen, setDispatchCaptureModalOpen] = useState(false);
  const [dispatchCaptureEventId, setDispatchCaptureEventId] = useState<string | null>(null);
  const [dispatchCaptureType, setDispatchCaptureType] = useState<'DEPARTMENT' | 'POLICE'>('DEPARTMENT');
  const [dispatchCaptureDept, setDispatchCaptureDept] = useState('河下派出所');
  const [dispatchCapturePolice, setDispatchCapturePolice] = useState('张警官 [在线/网格02]');
  const [dispatchCaptureText, setDispatchCaptureText] = useState('请重点拍摄现场涉事人员聚集情况及周边交通疏导状态，时长不少于15秒。');
  const [dispatchCaptureDeadline, setDispatchCaptureDeadline] = useState('30分钟内');

  // Video version viewer control state
  const [activeVideoVersionIndex, setActiveVideoVersionIndex] = useState(0);

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

  // ==================== Control Instruction Handlers ====================
  const handleOpenCreateTemplate = () => {
    setFormName('');
    setFormRequest('');
    setFormList('');
    setEditingTemplate(null);
    setCreateTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (template: any) => {
    setFormName(template.name);
    setFormRequest(template.request);
    setFormList(template.list.join('\n'));
    setEditingTemplate(template);
    setCreateTemplateModalOpen(true);
  };

  const handleCreateOrEditTemplate = () => {
    if (!formName.trim()) {
      message.error('请输入指令名称');
      return;
    }
    if (!formRequest.trim()) {
      message.error('请输入指令要求');
      return;
    }
    if (!formList.trim()) {
      message.error('请输入指令清单');
      return;
    }

    const listArray = formList.split('\n').filter(item => item.trim() !== '');

    if (editingTemplate) {
      // Editing Mode
      setInstructionTemplates(prev => prev.map(item => 
        item.id === editingTemplate.id 
          ? { ...item, name: formName, request: formRequest, list: listArray }
          : item
      ));
      message.success('指令模板修改成功');
    } else {
      // Creation Mode
      const newTemplate = {
        id: `t-${Date.now()}`,
        name: formName,
        type: '现场指令',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        request: formRequest,
        list: listArray
      };
      setInstructionTemplates(prev => [newTemplate, ...prev]);
      message.success('新现场指令模板创建成功');
    }

    setCreateTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    Modal.confirm({
      title: '确认删除该指令模板？',
      content: `删除后，将无法从指令库中快速选择并下达「${name}」模板。`,
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk() {
        setInstructionTemplates(prev => prev.filter(item => item.id !== id));
        message.success('指令模板已成功删除');
      }
    });
  };

  // Dispatch fields setup based on template selected
  const handleSelectTemplateForDispatch = (tempId: string) => {
    setDispatchTemplateId(tempId);
    const template = instructionTemplates.find(t => t.id === tempId);
    if (template) {
      setDispatchRequest(template.request);
      setDispatchListText(template.list.join('\n'));
    }
  };

  const handleDispatchInstruction = (eventId: string) => {
    if (!dispatchRequest.trim() || !dispatchListText.trim()) {
      message.error('请确保指令内容与清单不为空');
      return;
    }

    const listArray = dispatchListText.split('\n')
      .filter(item => item.trim() !== '')
      .map(item => ({
        name: item.replace(/^\d+[\.\、\s]*/, '').trim(), // Strip numbers from list if any
        dept: dispatchReceiver
      }));

    const instName = instructionTemplates.find(t => t.id === dispatchTemplateId)?.name || '未命名指令';
    const newInstId = `inst-${Date.now()}`;
    const newInstruction = {
      id: newInstId,
      eventId: eventId,
      name: instName,
      type: '现场指令',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      sender: 'cs02市局（支队）',
      status: '待签收',
      request: dispatchRequest,
      list: listArray,
      isExpanded: true
    };

    setEventInstructions(prev => [newInstruction, ...prev]);
    message.success('现场指令下达成功，正在派发至区县指挥中心！');
    setDispatchModalOpen(false);

    // Auto-progress simulation: change status to "已反馈" after 4 seconds
    setTimeout(() => {
      setEventInstructions(prev => prev.map(inst => {
        if (inst.id === newInstId && inst.status === '待签收') {
          message.info(`区县「${dispatchReceiver}」已完成对「${inst.name}」指令的处置反馈`);
          return {
            ...inst,
            status: '已反馈',
            signTime: dayjs().add(2, 'minute').format('YYYY-MM-DD HH:mm:ss'),
            feedbackSender: dispatchReceiver,
            feedbackTime: dayjs().add(3, 'minute').format('YYYY-MM-DD HH:mm:ss'),
            feedbackText: '收到，正在处置中，目前主要聚集区域人员已疏导，秩序正常。'
          };
        }
        return inst;
      }));
    }, 4000);
  };

  const handleManualFeedbackSimulate = (instId: string) => {
    setEventInstructions(prev => prev.map(inst => {
      if (inst.id === instId) {
        return {
          ...inst,
          status: '已反馈',
          signTime: dayjs().add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
          feedbackSender: inst.list[0]?.dept || 'cs03区县',
          feedbackTime: dayjs().add(2, 'minute').format('YYYY-MM-DD HH:mm:ss'),
          feedbackText: '已签收，相关小组已赶赴现场处理，生命通道已打通，现场围观群众已全部疏散。'
        };
      }
      return inst;
    }));
    message.success('已模拟签收与反馈流程成功！');
  };

  // ==================== Video Backfill Handlers ====================
  const handleOpenDispatchCapture = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    setDispatchCaptureEventId(eventId);
    setDispatchCaptureType('DEPARTMENT');
    // Default to the event's area/responsibility
    setDispatchCaptureDept(event.area.includes('派出所') ? event.area : `${event.area}分局/派出所`);
    setDispatchCaptureText('请重点拍摄现场涉事人员聚集情况及周边交通疏导状态，时长不少于15秒。');
    setDispatchCaptureDeadline('30分钟内');
    setDispatchCaptureModalOpen(true);
  };

  const handleDispatchCaptureSubmit = () => {
    if (!dispatchCaptureEventId) return;
    const target = dispatchCaptureType === 'DEPARTMENT' ? dispatchCaptureDept : dispatchCapturePolice;
    
    setEvents(prev => prev.map(ev => {
      if (ev.id === dispatchCaptureEventId) {
        return {
          ...ev,
          videoStatus: 'dispatched',
          dispatchedTo: target,
          deadlineText: dispatchCaptureDeadline
        };
      }
      return ev;
    }));

    // Linkage: Auto-inject a "现场视频拍摄" instruction card to this event's field instructions list
    const newInstId = `inst-capture-${Date.now()}`;
    const newInstruction = {
      id: newInstId,
      eventId: dispatchCaptureEventId,
      name: '现场视频补拍上传',
      type: '现场指令',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      sender: 'cs02市局（支队）',
      status: '回传中',
      request: dispatchCaptureText,
      list: [
        { name: '使用警务通拍摄现场高清视频 (不低于15s)', dept: target },
        { name: '上传视频并回传关键帧画面进行 AI 分析', dept: target },
        { name: '反馈现场实时事件处置概述', dept: target }
      ],
      isExpanded: true
    };
    setEventInstructions(prev => [newInstruction, ...prev]);

    message.success(`视频补拍指令已成功下发至 [${target}]，正在等待回传...`);
    setDispatchCaptureModalOpen(false);
  };

  const handleSimulateReturn = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Generate simulated video versions based on different events
    let newVersion: any;
    if (eventId === 'ev-1') {
      // HP9516 Banner Event
      newVersion = {
        filename: 'VID_20260729_补拍_苏HP9516_横幅特写.mp4',
        filesize: '12.2 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '现场横幅特写', thumbnail: obscuredShootingImg, seq: 1, hash: 'keyframe_ev1_001_banner' },
          { name: '车牌号码识别', thumbnail: vehiclePassingImg, seq: 2, hash: 'keyframe_ev1_002_plate' },
          { name: '现场秩序维持', thumbnail: crowdOnlookersImg, seq: 3, hash: 'keyframe_ev1_003_police' }
        ],
        aiReport: {
          scene: '新城区街道旁，一辆银色面包车（车牌：苏HP9516）车顶张贴白色“冤”字横幅，低速慢行。马路两侧有十余名行人在驻足围观及拿手机拍照。现场警力已到场将车辆拦截靠边，未发生肢体摩擦冲突，道路整体通畅。',
          riskNature: '拉挂横幅/和平表达',
          riskScale: '小规模 (单车/约10人围观)',
          observations: [
            '现场核心起因为车主使用横幅进行利益诉求表达。',
            '路人随手拍可能在社交平台引来一定舆论声量，需注意平台传播速度。',
            '属地执勤警力已安全纠离车辆，并正在对车主开展法制宣传与情绪疏解。',
            '周边交通正在分流疏导，没有引发严重交通妨碍。'
          ]
        },
        description: '基层民警回传补拍视频：新城区路段苏HP9516车辆车顶张贴“冤”字横幅慢行，引发路人围观拍照。民警已当场将车辆劝停靠边，车主积极配合，交通秩序已完全恢复。'
      };
    } else if (eventId === 'ev-2') {
      // Gambling Event
      newVersion = {
        filename: 'VID_20260729_补拍_聚众赌博查处.mp4',
        filesize: '8.5 MB',
        videoThumbnail: obscuredShootingImg,
        keyframes: [
          { name: '涉案民居外围', thumbnail: obscuredShootingImg, seq: 1, hash: 'keyframe_ev2_001_house' },
          { name: '赌博人员控制', thumbnail: crowdOnlookersImg, seq: 2, hash: 'keyframe_ev2_002_arrest' },
          { name: '涉案赌具取证', thumbnail: vehiclePassingImg, seq: 3, hash: 'keyframe_ev2_003_evidence' }
        ],
        aiReport: {
          scene: '开发区某居民住宅一楼。民警正突击入室盘查，现场控制涉案赌博人员数名，并在现场起获并扣押赌资、扑克牌及麻将等赌具。小区外围未见异常聚集，整体安静。',
          riskNature: '聚众赌博/治安案件',
          riskScale: '涉案人员 6 名',
          observations: [
            '开发区派出所联合网安支队，根据网民举报线索实施突击核查。',
            '现场涉嫌聚众赌博事实清楚，赌资赌具已当场封存。',
            '所有涉案人员已被依法带回派出所作进一步审查处理。',
            '周边邻里反应平稳，治安管控秩序良好。'
          ]
        },
        description: '回传视频显示：开发区民宅内确有数人聚集赌博，派出所警力快速到场盘查，控制所有涉案人员并收缴赌具，现场已安全处置完毕。'
      };
    } else {
      // Generic Fallback
      newVersion = {
        filename: 'VID_20260729_补拍_现场情况回传.mp4',
        filesize: '6.4 MB',
        videoThumbnail: vehiclePassingImg,
        keyframes: [
          { name: '现场周边环境', thumbnail: crowdOnlookersImg, seq: 1, hash: 'keyframe_common_001' },
          { name: '执勤警力警戒', thumbnail: vehiclePassingImg, seq: 2, hash: 'keyframe_common_002' },
          { name: '人员劝离散去', thumbnail: obscuredShootingImg, seq: 3, hash: 'keyframe_common_003' }
        ],
        aiReport: {
          scene: '马路开阔地带，聚集人群已被全部劝退，交通基本恢复。两组警力在现场做后续的警戒与值守。',
          riskNature: '秩序恢复/平稳警戒',
          riskScale: '无明显聚集人群',
          observations: [
            '聚集群众已被属地警力合规劝离解散。',
            '路段交通已经恢复，未再产生新的声量发酵。',
            '现场商铺经营正常，治安局势整体平稳受控。'
          ]
        },
        description: '民警已现场补拍回传：聚集群众已被悉数疏导劝离，现场治安秩序恢复正常，巡逻警力正开展后续值守防范。'
      };
    }

    setEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const currentVersions = ev.videoVersions || [];
        return {
          ...ev,
          videoStatus: 'returned',
          hasAttachment: true,
          attachmentType: 'video',
          videoVersions: [newVersion, ...currentVersions] // Prepend new version (latest first)
        };
      }
      return ev;
    }));

    // Linkage: Auto-update the "现场视频拍摄" instruction status to "已反馈/已办结" in the details Tab
    setEventInstructions(prev => prev.map(inst => {
      if (inst.eventId === eventId && inst.name === '现场视频补拍上传') {
        const target = inst.list[0]?.dept || '基层民警';
        return {
          ...inst,
          status: '已反馈',
          signTime: dayjs().add(2, 'minute').format('YYYY-MM-DD HH:mm:ss'),
          feedbackSender: target,
          feedbackTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          feedbackText: `[指令已办结] 补拍视频和现场关键帧图片已成功通过警务终端上传录入。视频文件名：${newVersion.filename}。现场人群已被安全疏散，周边交通已畅通。`
        };
      }
      return inst;
    }));

    message.success(`民警端视频 [${newVersion.filename}] 已成功回传！AI 自动分析完成，数据已刷新入库。`);
  };

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
      width: '20%',
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
      width: '14%',
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
      title: '视频状态',
      dataIndex: 'videoStatus',
      key: 'videoStatus',
      width: '10%',
      render: (status: string, record: EventItem) => {
        if (!status || status === 'no_video') {
          return (
            <span 
              className="risk-pill" 
              style={{ 
                color: '#8c8c8c', 
                background: '#f5f5f5', 
                border: '1px solid #d9d9d9', 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              待补拍
            </span>
          );
        }
        if (status === 'dispatched') {
          return (
            <Tooltip title={`已指派: ${record.dispatchedTo || '未指派'} | 截止时间: ${record.deadlineText || '30分钟内'}`}>
              <span 
                className="risk-pill" 
                style={{ 
                  color: '#096dd9', 
                  background: '#e6f7ff', 
                  border: '1px solid #91d5ff', 
                  fontSize: '11px', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
              >
                回传中
              </span>
            </Tooltip>
          );
        }
        if (status === 'returned') {
          return (
            <span 
              className="risk-pill" 
              style={{ 
                color: '#52c41a', 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              视频已补充
            </span>
          );
        }
        if (status === 'overtime') {
          return (
            <span 
              className="risk-pill" 
              style={{ 
                color: '#f5222d', 
                background: '#fff1f0', 
                border: '1px solid #ffa39e', 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              回传超时
            </span>
          );
        }
        return null;
      }
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
      width: '6%',
    },
    {
      title: '评论条数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: '6%',
    },
    {
      title: '现场情况',
      dataIndex: 'attachmentType',
      key: 'attachmentType',
      width: '8%',
      render: (type?: string, record?: EventItem) => {
        // If the video has been returned, we show a micro video player thumbnail
        const hasVideo = type === 'video' || (record && record.videoStatus === 'returned');
        if (hasVideo) {
          return (
            <div className="table-video-thumbnail" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '24px',
              background: '#000',
              borderRadius: '2px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }} onClick={(e) => {
              e.stopPropagation();
              setSelectedEventId(record!.id);
              setCurrentStep('detail');
            }}>
              <PlayCircleOutlined />
            </div>
          );
        }
        return <span style={{ color: '#999', fontSize: '12px' }}>暂无视频</span>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: '18%',
      render: (_: any, record: EventItem) => {
        const status = record.videoStatus || 'no_video';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
            {status === 'no_video' && (
              <Button 
                type="link" 
                size="small" 
                style={{ padding: 0, color: '#1890ff', fontSize: '12px' }}
                onClick={() => handleOpenDispatchCapture(record.id)}
              >
                🎥 下达补拍
              </Button>
            )}
            
            {status === 'dispatched' && (
              <>
                <Button 
                  type="link" 
                  size="small" 
                  style={{ padding: 0, color: '#fa8c16', fontSize: '12px' }}
                  onClick={() => message.warning(`已向 [${record.dispatchedTo}] 移动端发送紧急催办！`)}
                >
                  ⚡ 催办
                </Button>
                <Button 
                  type="link" 
                  size="small" 
                  style={{ padding: 0, color: '#7c3aed', fontSize: '12px' }}
                  onClick={() => handleSimulateReturn(record.id)}
                >
                  ✓ 模拟回传
                </Button>
              </>
            )}

            {status === 'overtime' && (
              <>
                <Button 
                  type="link" 
                  size="small" 
                  danger
                  style={{ padding: 0, fontSize: '12px' }}
                  onClick={() => message.error(`警告催办已下发至 [${record.dispatchedTo}]，终端提示置顶加急！`)}
                >
                  🚨 一键催办
                </Button>
                <Button 
                  type="link" 
                  size="small" 
                  style={{ padding: 0, fontSize: '12px' }}
                  onClick={() => handleOpenDispatchCapture(record.id)}
                >
                  重新指派
                </Button>
              </>
            )}

            {status === 'returned' && (
              <Button 
                type="link" 
                size="small" 
                style={{ padding: 0, color: '#8c8c8c', fontSize: '12px' }}
                onClick={() => handleOpenDispatchCapture(record.id)}
              >
                重新补拍
              </Button>
            )}

            <Button 
              type="link" 
              danger 
              size="small"
              onClick={() => handleDeleteEvent(record.id)}
              style={{ padding: 0, fontSize: '12px' }}
            >
              删除
            </Button>
          </div>
        );
      },
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
                <Button 
                  icon={<RadarChartOutlined />} 
                  className="action-green-btn"
                  onClick={() => setTemplatesModalOpen(true)}
                >
                  防控指令
                </Button>
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
                onClick: () => {
                  setSelectedEventId(record.id);
                  setCurrentStep('detail');
                  setActiveVideoVersionIndex(0);
                },
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
              setActiveVideoVersionIndex(0);
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
            {[
              { id: 'detail', title: '事件详情', desc: '上报与审批信息', icon: <FileTextOutlined /> },
              { id: 'control', title: '布控', desc: '现场及网上布控', icon: <RadarChartOutlined /> },
              { id: 'handle', title: '处置', desc: '网上及两群处置', icon: <SettingOutlined /> },
              { id: 'report', title: '报告', desc: '形成阶段性报告', icon: <FileTextOutlined /> },
              { id: 'review', title: '复盘', desc: '复盘评估总结', icon: <TrophyOutlined /> },
            ].map((step, idx, arr) => {
              const activeIndex = arr.findIndex(s => s.id === currentStep);
              let statusClass = '';
              if (idx === activeIndex) {
                statusClass = 'step-active';
              } else if (idx < activeIndex) {
                statusClass = 'step-completed';
              }
              const isLast = idx === arr.length - 1;
              return (
                <div 
                  key={step.id} 
                  className={`step-item ${statusClass} ${isLast ? 'step-last' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setCurrentStep(step.id as any);
                    if (step.id === 'control') {
                      setCurrentDetailTab('warn');
                    }
                  }}
                >
                  <div className="step-indicator">
                    {React.cloneElement(step.icon, { className: 'step-icon' })}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                  {!isLast && <div className="step-line" />}
                </div>
              );
            })}
          </div>

          {/* ================================================================ */}
          {/* STEP 1: EVENT DETAILS (事件详情大步 1:1 复刻)                    */}
          {/* ================================================================ */}
          {currentStep === 'detail' && (() => {
            const versions = currentEvent.videoVersions || [];
            const hasVideoData = versions.length > 0;
            const activeVersion = hasVideoData ? (versions[activeVideoVersionIndex] || versions[0]) : null;

            return (
              <div className="step-detail-content">
                {/* 手机App上报紫色通知条 */}
                <div className="opinion-source-banner">
                  <div className="source-banner-icon">
                    <PhoneOutlined />
                  </div>
                  <div className="source-banner-content">
                    <div className="source-banner-title">
                      <strong>
                        {currentEvent.videoStatus === 'no_video' ? '直建事件 (待补拍)' : 
                         currentEvent.videoStatus === 'dispatched' ? '指令下发中 (等待回传)' : '手机App上报'}
                      </strong>
                      <span className="source-banner-reporter">
                        {currentEvent.title === '清雅苑入口道路群众聚集' ? '河下派出所-唐子阳' : '指挥中心-直建指派'}
                      </span>
                    </div>
                    <div className="source-banner-location">
                      {currentEvent.title === '清雅苑入口道路群众聚集' ? '清雅苑入口旁道路' : currentEvent.area}
                    </div>
                  </div>
                  {currentEvent.videoStatus === 'dispatched' && (
                    <Button 
                      size="small" 
                      type="primary"
                      style={{ background: '#7c3aed', borderColor: '#7c3aed', marginLeft: 'auto' }}
                      onClick={() => handleSimulateReturn(currentEvent.id)}
                    >
                      ⚡ 模拟民警视频回传
                    </Button>
                  )}
                </div>

                {/* 两栏网格布局 */}
                <div className="detail-grid-layout">
                  {/* 左边栏 */}
                  <div className="detail-layout-left">
                    {/* 卡片1：事件基本信息 */}
                    <div className="detail-info-card card-container">
                      <div className="card-header">
                        <div className="card-header-left">
                          <FileTextOutlined className="header-icon" />
                          <span className="card-header-title">事件基本信息</span>
                        </div>
                        <Button icon={<EditOutlined />} size="small" className="action-outline-btn">编辑</Button>
                      </div>
                      <div className="info-grid-container">
                        {/* Row 1 */}
                        <div className="info-grid-item span-2">
                          <div className="info-grid-label">事件标题</div>
                          <div className="info-grid-value">{currentEvent.title}</div>
                        </div>
                        <div className="info-grid-item">
                          <div className="info-grid-label">舆情类型</div>
                          <div className="info-grid-value">{currentEvent.type}</div>
                        </div>
                        <div className="info-grid-item">
                          <div className="info-grid-label">责任属地</div>
                          <div className="info-grid-value">{currentEvent.area}</div>
                        </div>

                        {/* Row 2 */}
                        <div className="info-grid-item">
                          <div className="info-grid-label">风险等级</div>
                          <div className="info-grid-value">
                            <span className={`risk-pill risk-inline-tag ${
                              currentEvent.risk === '红色' ? 'risk-red' :
                              currentEvent.risk === '橙色' ? 'risk-orange' :
                              currentEvent.risk === '黄色' ? 'risk-yellow' : 'risk-blue'
                            }`}>
                              {currentEvent.risk}
                            </span>
                          </div>
                        </div>
                        <div className="info-grid-item">
                          <div className="info-grid-label">上报人</div>
                          <div className="info-grid-value">
                            {currentEvent.title === '清雅苑入口道路群众聚集' ? '河下派出所-唐子阳' : '系统直建-指派民警'}
                          </div>
                        </div>
                        <div className="info-grid-item span-2">
                          <div className="info-grid-label">上报时间</div>
                          <div className="info-grid-value">{currentEvent.time}</div>
                        </div>

                        {/* Row 3 */}
                        <div className="info-grid-item span-2">
                          <div className="info-grid-label">发生时间</div>
                          <div className="info-grid-value">{currentEvent.time}</div>
                        </div>
                        <div className="info-grid-item span-2">
                          <div className="info-grid-label">发生地址</div>
                          <div className="info-grid-value">
                            {currentEvent.title === '清雅苑入口道路群众聚集' ? '清雅苑入口旁道路' : currentEvent.area}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 卡片2：事件概述 */}
                    <div className="detail-info-card card-container">
                      <div className="card-header">
                        <div className="card-header-left">
                          <FileTextOutlined className="header-icon" />
                          <span className="card-header-title">事件概述</span>
                        </div>
                      </div>
                      <div className="event-description-text" style={{ padding: '16px', fontSize: '13.5px', lineHeight: '1.6', color: '#262626' }}>
                        {hasVideoData && activeVersion ? (
                          activeVersion.description
                        ) : (
                          currentEvent.title === '清雅苑入口道路群众聚集' 
                            ? '视频显示清雅苑建筑入口旁道路，路边聚集约十余名群众站立，部分人员手持手机；一辆黑色轿车沿道路正常行驶，经过人群及罩阁区域；现场人员面向车辆方向，未见肢体冲突，道路未受阻塞，整体秩序平稳。'
                            : `该事件处于指挥中心布控阶段，现场尚无视频及关键帧附件录入。目前已对责任属地 $[${currentEvent.area}] 下达现场补拍与实录核查指令，正在等待一线警力进行回传。`
                        )}
                      </div>
                    </div>

                    {/* 卡片3：现场视频与现场图片 */}
                    <div className="media-resources-row" style={{ display: 'flex', gap: '16px' }}>
                      {/* 现场视频 */}
                      <div className="media-card card-container" style={{ flex: 1 }}>
                        <div className="card-header" style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="card-header-left" style={{ display: 'flex', alignItems: 'center' }}>
                            <PlayCircleOutlined className="header-icon" style={{ color: '#3366FF', marginRight: '6px' }} />
                            <span className="card-header-title">现场视频</span>
                          </div>
                          {/* Versions dropdown */}
                          {versions.length > 1 && (
                            <Select
                              size="small"
                              value={activeVideoVersionIndex}
                              onChange={setActiveVideoVersionIndex}
                              style={{ width: '130px', marginLeft: 'auto', marginRight: '8px' }}
                              options={versions.map((v, idx) => ({
                                value: idx,
                                label: idx === 0 ? `版本 ${versions.length - idx} (最新)` : `版本 ${versions.length - idx}`
                              }))}
                            />
                          )}
                          <span className={`media-filename-tag ${versions.length > 1 ? '' : 'ml-auto'}`} style={{ marginLeft: versions.length > 1 ? 0 : 'auto', fontSize: '11px', color: '#8c8c8c' }}>
                            {hasVideoData && activeVersion ? (
                              `${activeVersion.filename}  /  ${activeVersion.filesize}`
                            ) : (
                              '无视频附件'
                            )}
                          </span>
                        </div>
                        
                        <div className="video-player-wrapper" style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
                          {hasVideoData && activeVersion ? (
                            <div className="simulated-video-player" style={{ 
                              position: 'relative', 
                              width: '100%', 
                              height: '235px', 
                              borderRadius: '4px', 
                              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.35)), url(${activeVersion.videoThumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundColor: '#000',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              <PlayCircleOutlined style={{ fontSize: '48px', color: '#fff', cursor: 'pointer', opacity: 0.9, transition: 'all 0.2s' }} className="video-play-btn" />
                              <div className="video-mock-controls" style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'rgba(0, 0, 0, 0.65)',
                                padding: '6px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                borderBottomLeftRadius: '4px',
                                borderBottomRightRadius: '4px'
                              }}>
                                <PlayCircleOutlined style={{ color: '#fff', fontSize: '12px' }} />
                                <span style={{ color: '#fff', fontSize: '10px' }}>00:00 / 00:15</span>
                                <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '1.5px', position: 'relative' }}>
                                  <div style={{ width: '0%', height: '100%', background: '#3366FF', borderRadius: '1.5px' }} />
                                </div>
                                <span style={{ color: '#fff', fontSize: '10px' }}>高清 1080P</span>
                              </div>
                            </div>
                          ) : (
                            <div className="simulated-video-placeholder" style={{
                              width: '100%',
                              height: '235px',
                              borderRadius: '4px',
                              border: '1px dashed #d9d9d9',
                              background: '#fafafa',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '24px',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '32px', marginBottom: '8px' }}>📷</span>
                              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 'bold', color: '#595959' }}>
                                {currentEvent.videoStatus === 'dispatched' ? '补拍指令执行中' : '缺发现场视频'}
                              </h4>
                              <p style={{ fontSize: '12px', color: '#8c8c8c', margin: '6px 0 16px 0', maxWidth: '280px', lineHeight: 1.5 }}>
                                {currentEvent.videoStatus === 'dispatched' 
                                  ? `补拍指令已成功下达至 [${currentEvent.dispatchedTo}]，截止时间: ${currentEvent.deadlineText}，正在等待民警回传现场视频。`
                                  : '该事件由指挥中心直接检索直建启动，尚未采集录入现场真实的视频图像与关键帧附件。'}
                              </p>
                              {currentEvent.videoStatus === 'dispatched' ? (
                                <Button 
                                  type="primary" 
                                  style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                                  onClick={() => handleSimulateReturn(currentEvent.id)}
                                >
                                  模拟民警回传视频
                                </Button>
                              ) : (
                                <Button 
                                  type="primary" 
                                  icon={<PlayCircleOutlined />} 
                                  onClick={() => handleOpenDispatchCapture(currentEvent.id)}
                                >
                                  下达现场补拍指令
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 现场图片 */}
                      <div className="media-card card-container" style={{ flex: 1 }}>
                        <div className="card-header">
                          <div className="card-header-left">
                            <CopyOutlined className="header-icon" style={{ color: '#3366FF' }} />
                            <span className="card-header-title">现场图片</span>
                          </div>
                          <span className="media-filename-tag" style={{ fontSize: '11px', color: '#8c8c8c' }}>
                            {hasVideoData && activeVersion ? `共 ${activeVersion.keyframes.length} 张` : '暂无图片'}
                          </span>
                        </div>
                        
                        {hasVideoData && activeVersion ? (
                          <div className="image-grid-wrapper" style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '115px 115px', gap: '8px' }}>
                            {activeVersion.keyframes.map((kf, index) => (
                              <div key={index} className="image-item-container" style={{ 
                                position: 'relative', 
                                borderRadius: '4px', 
                                overflow: 'hidden', 
                                backgroundColor: '#f5f5f5',
                                gridColumn: activeVersion.keyframes.length === 1 ? '1 / 3' : (index === 1 && activeVersion.keyframes.length === 3 ? '1 / 2' : 'auto'),
                                gridRow: activeVersion.keyframes.length === 1 ? '1 / 3' : 'auto'
                              }}>
                                <img 
                                  src={kf.thumbnail} 
                                  alt={kf.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <span className="img-seq-badge">{kf.seq}</span>
                                <span className="img-recognition-tag">{kf.name}</span>
                                <div className="img-filename-overlay" title={kf.hash}>{kf.hash}</div>
                              </div>
                            ))}
                            {activeVersion.keyframes.length < 3 && (
                              <div className="image-item-placeholder" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: '4px' }}>
                                <span style={{ fontSize: '11px', color: '#bfbfbf' }}>分析提取完毕</span>
                                <span style={{ fontSize: '9px', color: '#d9d9d9' }}>LAN YING AI</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="image-grid-wrapper" style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '259px' }}>
                            <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '20px' }}>
                              <CopyOutlined style={{ fontSize: '28px', marginBottom: '8px', color: '#d9d9d9' }} />
                              <div style={{ fontSize: '12px' }}>暂无关键帧图像</div>
                              <div style={{ fontSize: '10px', marginTop: '4px' }}>等待现场视频回传后 AI 自动提取解析</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 右边栏 (AI解读报告) */}
                  <div className="detail-layout-right">
                    <div className="ai-report-card card-container">
                      <div className="card-header ai-report-header" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                        <div className="card-header-left">
                          <span className="ai-report-icon-tag">AI</span>
                          <span className="card-header-title" style={{ marginLeft: '8px' }}>AI 视频解读报告</span>
                        </div>
                      </div>
                      
                      <div className="ai-report-scroll-body" style={{ padding: '16px', overflowY: 'auto', maxHeight: '550px' }}>
                        {hasVideoData && activeVersion ? (
                          <>
                            {/* 1. 场景描述 */}
                            <div className="ai-report-section" style={{ marginBottom: '16px' }}>
                              <h5 className="section-subtitle">场景描述</h5>
                              <p className="section-paragraph" style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.6', color: '#595959' }}>
                                {activeVersion.aiReport.scene}
                              </p>
                            </div>

                            {/* 2. 风险评估 */}
                            <div className="ai-report-section risk-assessment-section" style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '12px 0', marginBottom: '16px' }}>
                              <h5 className="section-subtitle risk-title" style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#f5222d', fontWeight: 'bold' }}>风险评估</h5>
                              <div className="risk-content-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div className="risk-item" style={{ fontSize: '12px', color: '#f5222d' }}>
                                  <span className="risk-label" style={{ fontWeight: 'bold' }}>事件性质：</span>
                                  <span className="risk-value">{activeVersion.aiReport.riskNature}</span>
                                </div>
                                <div className="risk-item" style={{ fontSize: '12px', color: '#f5222d' }}>
                                  <span className="risk-label" style={{ fontWeight: 'bold' }}>人群规模：</span>
                                  <span className="risk-value">{activeVersion.aiReport.riskScale}</span>
                                </div>
                                <div className="risk-item" style={{ fontSize: '12px', color: '#f5222d' }}>
                                  <span className="risk-label" style={{ fontWeight: 'bold' }}>升级风险：</span>
                                  <span className="risk-value">{currentEvent.risk === '红色' ? '高' : (currentEvent.risk === '橙色' ? '中' : '低')}</span>
                                </div>
                                <div className="risk-item" style={{ fontSize: '12px', color: '#f5222d', lineHeight: '1.5' }}>
                                  <span className="risk-label" style={{ fontWeight: 'bold' }}>判断依据：</span>
                                  <span className="risk-value">现场秩序相对平稳，民警已介入引导，暂无明显警民冲突或二次发酵表现。</span>
                                </div>
                              </div>
                            </div>

                            {/* 3. 关键观察 */}
                            <div className="ai-report-section">
                              <h5 className="section-subtitle" style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#8c8c8c' }}>关键观察</h5>
                              <div className="observation-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {activeVersion.aiReport.observations.map((obs, oIdx) => (
                                  <div key={oIdx} className="observation-item" style={{ display: 'flex', gap: '8px' }}>
                                    <div className="obs-num-badge" style={{ 
                                      width: '16px', 
                                      height: '16px', 
                                      borderRadius: '50%', 
                                      background: '#f5222d', 
                                      color: '#fff', 
                                      fontSize: '10px', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      flexShrink: 0, 
                                      marginTop: '2px' 
                                    }}>
                                      {oIdx + 1}
                                    </div>
                                    <div className="obs-text" style={{ fontSize: '12px', color: '#595959', lineHeight: '1.5' }}>
                                      {obs}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div style={{ padding: '40px 0', textAlign: 'center', color: '#bfbfbf' }}>
                            <RadarChartOutlined style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '12px' }} />
                            <div style={{ fontSize: '13px', fontWeight: 600 }}>暂无智能解读报告</div>
                            <p style={{ fontSize: '12px', color: '#8c8c8c', margin: '8px 0 0 0', lineHeight: 1.5 }}>
                              正在等待现场补拍视频上传。视频回传后，AI 理解引擎将对场景、人员行为、涉警标志及风险隐患等进行深度提取研判。
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================================================================ */}
          {/* STEP 2: CONTROL & TAB CONTENT (布控大步渲染包裹)                  */}
          {/* ================================================================ */}
          {currentStep === 'control' && (
            <>
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

          {currentDetailTab === 'control' && (
            <div className="field-control-instructions-view" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {/* Header Row */}
              <div className="control-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#262626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    区县指挥中心指令
                  </h4>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
                    共 {eventInstructions.filter(inst => inst.eventId === selectedEventId).length} 条指令
                  </div>
                </div>
                <Button 
                  type="primary"
                  icon={<span>+ </span>}
                  style={{ background: '#5950ec', borderColor: '#5950ec', color: '#fff' }}
                  onClick={() => {
                    setDispatchTemplateId('');
                    setDispatchRequest('');
                    setDispatchListText('');
                    setDispatchReceiver('cs03区县');
                    setDispatchModalOpen(true);
                  }}
                >
                  新建指令
                </Button>
              </div>

              {/* Instructions List */}
              <div className="instructions-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {eventInstructions.filter(inst => inst.eventId === selectedEventId).length === 0 ? (
                  <div className="view-card premium-placeholder-view" style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="placeholder-icon">📋</div>
                    <h3>当前事件暂无下达现场指令</h3>
                    <p>您可以点击右上角的“新建指令”按钮，从指令模板库中选择并下达第一条现场处置指令。</p>
                  </div>
                ) : (
                  eventInstructions
                    .filter(inst => inst.eventId === selectedEventId)
                    .map((inst) => (
                      <div 
                        key={inst.id} 
                        className="instruction-dispatch-card" 
                        style={{
                          border: '1px solid #e8e8e8',
                          borderRadius: '8px',
                          backgroundColor: '#fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Card Header (Click to toggle collapse) */}
                        <div 
                          className="card-header-toggle"
                          style={{
                            padding: '16px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            borderBottom: inst.isExpanded ? '1px solid #f0f0f0' : 'none',
                            backgroundColor: '#fafafa'
                          }}
                          onClick={() => {
                            setEventInstructions(prev => prev.map(i => 
                              i.id === inst.id ? { ...i, isExpanded: !i.isExpanded } : i
                            ));
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Blue document icon */}
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              background: '#e6f7ff',
                              border: '1px solid #bae7ff',
                              color: '#1890ff'
                            }}>
                              <FileTextOutlined style={{ fontSize: '16px' }} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#262626' }}>{inst.name}</span>
                                <span style={{
                                  fontSize: '11px',
                                  color: inst.status === '已反馈' ? '#52c41a' : '#faad14',
                                  background: inst.status === '已反馈' ? '#f6ffed' : '#fffbe6',
                                  border: inst.status === '已反馈' ? '1px solid #b7eb8f' : '1px solid #ffe58f',
                                  padding: '1px 6px',
                                  borderRadius: '2px'
                                }}>
                                  {inst.status}
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>🕒 {inst.time}</span>
                                <span>👤 {inst.sender}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Toggle Arrow */}
                          <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                            {inst.isExpanded ? '▲' : '▼'}
                          </div>
                        </div>

                        {/* Card Body */}
                        {inst.isExpanded && (
                          <div className="card-body-content" style={{ padding: '20px' }}>
                            {/* 1. 指令要求 (Blue box) */}
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#595959', marginBottom: '8px' }}>指令要求</div>
                              <div style={{
                                background: '#f0f5ff',
                                border: '1px solid #adc6ff',
                                borderRadius: '4px',
                                padding: '12px 16px',
                                fontSize: '13px',
                                color: '#1d39c4',
                                lineHeight: '1.6'
                              }}>
                                {inst.request}
                              </div>
                            </div>

                            {/* 2. 签收时间 */}
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              fontSize: '13px', 
                              color: '#595959', 
                              marginBottom: '16px',
                              borderBottom: '1px solid #f0f0f0',
                              paddingBottom: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#faad14' }}>🕒</span>
                                <span>
                                  签收时间：{inst.signTime ? inst.signTime : '区县尚未签收'}
                                </span>
                              </div>
                              {inst.status === '待签收' && (
                                <Button 
                                  size="small" 
                                  type="link" 
                                  style={{ color: '#1890ff', padding: 0 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleManualFeedbackSimulate(inst.id);
                                  }}
                                >
                                  [ 点击模拟签收与反馈 ]
                                </Button>
                              )}
                            </div>

                            {/* 3. 指令清单 */}
                            <div style={{ marginBottom: '20px' }}>
                              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#595959', marginBottom: '10px' }}>指令清单</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {inst.list.map((item: any, idx: number) => (
                                  <div 
                                    key={idx} 
                                    style={{
                                      background: '#f5f5f5',
                                      border: '1px solid #e8e8e8',
                                      borderRadius: '4px',
                                      padding: '10px 16px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontSize: '13px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#bfbfbf' }} />
                                      <span style={{ color: '#262626' }}>{item.name}</span>
                                    </div>
                                    <div style={{ color: '#8c8c8c' }}>{item.dept}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 4. 反馈记录 (Green box) */}
                            {inst.feedbackText && (
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#595959', marginBottom: '8px' }}>反馈记录</div>
                                <div style={{
                                  background: '#f6ffed',
                                  border: '1px solid #b7eb8f',
                                  borderRadius: '4px',
                                  padding: '16px'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#52c41a', marginBottom: '8px', fontWeight: 600 }}>
                                    <span>{inst.feedbackSender}</span>
                                    <span>{inst.feedbackTime}</span>
                                  </div>
                                  <div style={{ fontSize: '13px', color: '#272727', lineHeight: 1.5 }}>
                                    {inst.feedbackText}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>

              {/* Footer text */}
              <div className="control-footer" style={{ textAlign: 'center', padding: '16px 0', color: '#bfbfbf', fontSize: '12px' }}>
                到底部了
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
          </>)}

          {/* 其他步骤的简单占位展示 */}
          {['handle', 'report', 'review'].includes(currentStep) && (
            <div className="view-card premium-placeholder-view" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
              <div className="placeholder-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>
                {currentStep === 'handle' ? '⚙️' : (currentStep === 'report' ? '📄' : '🏆')}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#262626', marginBottom: '8px' }}>
                {currentStep === 'handle' && '网上及两群处置流转中'}
                {currentStep === 'report' && '形成阶段性报告与呈批'}
                {currentStep === 'review' && '警舆同处复盘评估总结'}
              </h3>
              <p style={{ fontSize: '13px', color: '#8c8c8c', maxWidth: '500px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                {currentStep === 'handle' && '当前步骤由网警支队承接执行。正对多渠道敏感帖文执行劝删、限流与回应处置，建议您切换步骤以查看详细现场布控。'}
                {currentStep === 'report' && '正在基于处置与舆情趋势半自动生成专项报告与呈批公文。您可以在“刊物管理”模块查看更多排版底稿。'}
                {currentStep === 'review' && '该事件已进入后期复盘阶段，可查看最终质效评分统计。详情指标也已录入“复盘总结”大屏。'}
              </p>
              <div className="dispatch-buttons">
                <Button type="primary" onClick={() => setCurrentStep('detail')}>返回事件详情</Button>
                <Button style={{ marginLeft: '12px' }} onClick={() => setCurrentStep('control')}>查看现场布控</Button>
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

      {/* ================================================================ */}
      {/* MODAL 1: 防控指令库 (1:1 截图 1)                                   */}
      {/* ================================================================ */}
      <Modal
        open={templatesModalOpen}
        onCancel={() => setTemplatesModalOpen(false)}
        footer={null}
        width={760}
        centered
        className="control-templates-library-modal"
        destroyOnClose
      >
        <div className="library-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="library-check-icon" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              background: '#00b074', 
              color: '#fff', 
              fontSize: '14px' 
            }}>
              ✓
            </span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#262626' }}>防控指令库</span>
            <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '6px' }}>已配置 {instructionTemplates.length} 条指令</span>
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button 
              type="primary" 
              icon={<span style={{ fontWeight: 'bold', marginRight: '2px' }}>+</span>} 
              style={{ background: '#00b074', borderColor: '#00b074' }}
              onClick={handleOpenCreateTemplate}
            >
              创建指令
            </Button>
            <span 
              onClick={() => setTemplatesModalOpen(false)} 
              style={{ cursor: 'pointer', fontSize: '16px', color: '#bfbfbf', marginLeft: '12px' }}
              className="close-x-btn"
            >
              ✕
            </span>
          </div>
        </div>

        {/* Scrollable list content */}
        <div className="library-scroll-body" style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
          {instructionTemplates.length === 0 ? (
            <Empty description="暂无指令模板，请点击右上角创建" />
          ) : (
            instructionTemplates.map((template) => (
              <div 
                key={template.id} 
                className="template-library-card" 
                style={{
                  border: '1px solid #d9e4ff',
                  borderRadius: '4px',
                  padding: '16px',
                  marginBottom: '16px',
                  backgroundColor: '#fff',
                  position: 'relative'
                }}
              >
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#262626' }}>{template.name}</h4>
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#00b074', 
                      background: '#e6fbf4', 
                      border: '1px solid #b3f4db', 
                      padding: '1px 6px', 
                      borderRadius: '2px' 
                    }}>
                      {template.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{template.time}</span>
                    <EditOutlined 
                      style={{ color: '#00b074', cursor: 'pointer', fontSize: '13px' }} 
                      onClick={() => handleOpenEditTemplate(template)} 
                    />
                    <CloseOutlined 
                      style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '13px' }} 
                      onClick={() => handleDeleteTemplate(template.id, template.name)} 
                    />
                  </div>
                </div>

                {/* Card Request */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>指令要求</div>
                  <div style={{ fontSize: '13px', color: '#262626', lineHeight: 1.5 }}>{template.request}</div>
                </div>

                {/* Card Items */}
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '6px' }}>指令清单</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {template.list.map((item: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: '#262626' }}>
                        <span className="list-seq-dot" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: '#00b074',
                          color: '#fff',
                          fontSize: '10px',
                          marginRight: '8px',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Card Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
          <Button onClick={() => setTemplatesModalOpen(false)}>关闭</Button>
        </div>
      </Modal>

      {/* ================================================================ */}
      {/* MODAL 2: 创建/编辑防控指令 (1:1 截图 2)                             */}
      {/* ================================================================ */}
      <Modal
        open={createTemplateModalOpen}
        onCancel={() => setCreateTemplateModalOpen(false)}
        footer={null}
        width={560}
        centered
        className="create-control-template-modal"
        destroyOnClose
      >
        <div className="form-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#262626' }}>
            {editingTemplate ? '编辑防控指令' : '创建防控指令'}
          </span>
          <span 
            onClick={() => setCreateTemplateModalOpen(false)} 
            style={{ cursor: 'pointer', fontSize: '16px', color: '#bfbfbf' }}
          >
            ✕
          </span>
        </div>

        <div className="form-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. 指令名称 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>指令名称
            </div>
            <Input 
              placeholder="请输入指令名称" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          {/* 2. 指令类型 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>指令类型</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#e6fbf4',
                color: '#00b074',
                border: '1px solid #00b074',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'default'
              }}>
                ✓ 现场指令
              </div>
              <span style={{ fontSize: '12px', color: '#8c8c8c' }}>(当前仅支持现场指令类型)</span>
            </div>
          </div>

          {/* 3. 指令要求 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>指令要求
            </div>
            <div style={{ position: 'relative' }}>
              <Input.TextArea 
                placeholder="请输入指令要求内容" 
                rows={3}
                maxLength={200}
                value={formRequest}
                onChange={(e) => setFormRequest(e.target.value)}
              />
              <span style={{
                position: 'absolute',
                right: '10px',
                bottom: '5px',
                fontSize: '11px',
                color: '#bfbfbf'
              }}>
                {formRequest.length}/200
              </span>
            </div>
          </div>

          {/* 4. 指令清单 */}
          <div>
            <div style={{ marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>指令清单
            </div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px' }}>每行一条，支持多条清单内容</div>
            <Input.TextArea 
              placeholder={"1. 部署警力在各出入口把守\n2. 开设警戒线隔离主要区域\n3. 引导群众有序疏散"} 
              rows={4}
              value={formList}
              onChange={(e) => setFormList(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Button onClick={() => setCreateTemplateModalOpen(false)}>取消</Button>
          <Button type="primary" onClick={handleCreateOrEditTemplate}>
            {editingTemplate ? '确认修改' : '确认创建'}
          </Button>
        </div>
      </Modal>

      {/* ================================================================ */}
      {/* MODAL 3: 下达现场指令 (详情页现场防控新建)                        */}
      {/* ================================================================ */}
      <Modal
        open={dispatchModalOpen}
        onCancel={() => setDispatchModalOpen(false)}
        footer={null}
        width={560}
        centered
        className="dispatch-instruction-modal"
        destroyOnClose
      >
        <div className="form-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#262626' }}>下达现场处置指令</span>
          <span 
            onClick={() => setDispatchModalOpen(false)} 
            style={{ cursor: 'pointer', fontSize: '16px', color: '#bfbfbf' }}
          >
            ✕
          </span>
        </div>

        <div className="form-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 选择模板 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>选择指令库模板</div>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择已配置的指令模板"
              value={dispatchTemplateId || undefined}
              onChange={handleSelectTemplateForDispatch}
              options={instructionTemplates.map(t => ({
                value: t.id,
                label: `${t.name} (${t.type})`
              }))}
            />
          </div>

          {/* 指令要求 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>指令要求</div>
            <Input.TextArea 
              rows={3}
              value={dispatchRequest}
              onChange={(e) => setDispatchRequest(e.target.value)}
              placeholder="选择模板后自动加载，支持二次编辑"
            />
          </div>

          {/* 指令清单 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>指令清单 (每行一条)</div>
            <Input.TextArea 
              rows={4}
              value={dispatchListText}
              onChange={(e) => setDispatchListText(e.target.value)}
              placeholder="选择模板后自动加载，支持二次编辑"
            />
          </div>

          {/* 指派接收单位 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>指派接收区县</div>
            <Input 
              value={dispatchReceiver}
              onChange={(e) => setDispatchReceiver(e.target.value)}
              placeholder="请输入接收指派的区县名称"
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Button onClick={() => setDispatchModalOpen(false)}>取消</Button>
          <Button type="primary" onClick={() => handleDispatchInstruction(selectedEventId!)}>
            确认下达
          </Button>
        </div>
      </Modal>

      {/* ================================================================ */}
      {/* MODAL 4: 下达现场视频补拍指令 (外层表格触发)                         */}
      {/* ================================================================ */}
      <Modal
        open={dispatchCaptureModalOpen}
        onCancel={() => setDispatchCaptureModalOpen(false)}
        footer={null}
        width={580}
        centered
        className="dispatch-capture-instruction-modal"
        destroyOnClose
      >
        <div className="form-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#262626' }}>
            下达现场视频补拍指令 - {events.find(e => e.id === dispatchCaptureEventId)?.title || '未选定事件'}
          </span>
          <span 
            onClick={() => setDispatchCaptureModalOpen(false)} 
            style={{ cursor: 'pointer', fontSize: '16px', color: '#bfbfbf' }}
          >
            ✕
          </span>
        </div>

        <div className="form-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. 指派模式切换 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>指派模式</div>
            <Radio.Group 
              value={dispatchCaptureType} 
              onChange={(e: any) => setDispatchCaptureType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="DEPARTMENT">按部门指派</Radio.Button>
              <Radio.Button value="POLICE">按人员指派</Radio.Button>
            </Radio.Group>
          </div>

          {/* 2. 接收对象选择 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
              {dispatchCaptureType === 'DEPARTMENT' ? '指派部门' : '指派民警'}
            </div>
            {dispatchCaptureType === 'DEPARTMENT' ? (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择接收补拍指令的单位/部门"
                value={dispatchCaptureDept}
                onChange={setDispatchCaptureDept}
                options={[
                  { value: '河下派出所', label: '淮安区分局 -> 河下派出所' },
                  { value: '新城区分局治安大队', label: '新城区分局 -> 治安大队' },
                  { value: '开发区交警大队', label: '开发区分局 -> 交警大队' },
                  { value: '清江浦区文津路派出所', label: '清江浦区分局 -> 文津路派出所' }
                ]}
              />
            ) : (
              <Select
                style={{ width: '100%' }}
                placeholder="请选择接收补拍指令的执勤民警"
                value={dispatchCapturePolice}
                onChange={setDispatchCapturePolice}
                options={[
                  { value: '张警官 [在线/网格02]', label: '张警官 [在线 / 属地网格02]' },
                  { value: '李警官 [执勤中/网格01]', label: '李警官 [执勤中 / 核心网格01]' },
                  { value: '陈警官 [执勤中]', label: '陈警官 [执勤中 / 现场应急小队]' },
                  { value: '唐民警 [在线]', label: '唐警官 [在线 / 派出所机动岗]' }
                ]}
              />
            )}
          </div>

          {/* 3. 快捷 Tag 模板 */}
          <div>
            <div style={{ marginBottom: '6px', fontSize: '12px', color: '#8c8c8c' }}>快捷要求模板 (点击追加到内容框)：</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: '全景与周边环境', text: '#全景与周边环境#' },
                { label: '涉事人面部/车牌特写', text: '#涉事人面部/车牌特写#' },
                { label: '冲突发生过程', text: '#冲突发生过程#' }
              ].map(tag => (
                <span
                  key={tag.label}
                  className="quick-tag-item"
                  style={{
                    fontSize: '11px',
                    color: '#1890ff',
                    background: '#e6f7ff',
                    border: '1px solid #91d5ff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => {
                    setDispatchCaptureText(prev => `${prev.trim()} ${tag.text}`);
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* 4. 补充拍摄要求 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>拍摄指令描述</div>
            <Input.TextArea 
              rows={4}
              maxLength={200}
              value={dispatchCaptureText}
              onChange={(e: any) => setDispatchCaptureText(e.target.value)}
              placeholder="请输入补充拍摄指令内容描述"
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#bfbfbf', marginTop: '4px' }}>
              {dispatchCaptureText.length}/200
            </div>
          </div>

          {/* 5. 最晚回传时间 */}
          <div>
            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 600 }}>最晚回传时间</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Radio.Group 
                value={dispatchCaptureDeadline} 
                onChange={(e: any) => setDispatchCaptureDeadline(e.target.value)}
              >
                <Radio.Button value="15分钟内">15分钟内 (加急)</Radio.Button>
                <Radio.Button value="30分钟内">30分钟内 (默认)</Radio.Button>
                <Radio.Button value="1小时内">1小时内</Radio.Button>
              </Radio.Group>
              
              <DatePicker 
                showTime 
                placeholder="自定义截止时间"
                style={{ width: '160px' }}
                onChange={(val, dateString) => {
                  if (dateString) {
                    setDispatchCaptureDeadline(dateString as string);
                  }
                }}
              />
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Button onClick={() => setDispatchCaptureModalOpen(false)}>取消</Button>
          <Button type="primary" onClick={handleDispatchCaptureSubmit}>
            下达指令
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PoliceOpinionJoint;
