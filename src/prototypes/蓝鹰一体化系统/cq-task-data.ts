// src/prototypes/蓝鹰一体化系统/cq-task-data.ts
// 源头防控（cq）多任务素材专属原型数据集管理模块

export interface TaskInfo {
  id: string;
  code: string;
  name: string;
  category: '重大事项跟踪' | '安保任务' | '专项巡查任务';
  status: string;
  department: string;
  keywords: string[];
  createTime: string;
  eventCount: number;
  trend: number;
}

export interface EventItem {
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

export interface IssuedInstruction {
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

export interface QuickAnalysisData {
  timeSeries: { hours: string[]; volume: number[]; sentiment: number[] };
  platformDist: { name: string; value: number }[];
  sentimentDist: { name: string; value: number }[];
  hotWords: { name: string; weight: number }[];
  topEvents: { rank: number; title: string; heat: number; platform: string }[];
}

export interface WorkStatisticsData {
  totalInstructions: number;
  signedCount: number;
  completedCount: number;
  inProgressCount: number;
  timeoutCount: number;
  completionRate: string;
  deptResponse: { dept: string; count: number; completed: number }[];
  typeDistribution: { type: string; count: number }[];
}

export interface OpinionSummaryData {
  title: string;
  period: string;
  riskLevel: '高风险' | '中风险' | '低风险';
  summaryText: string;
  keyPoints: string[];
  recommendations: string[];
  historicalReports: { id: string; name: string; date: string; type: string; size: string }[];
}

export interface EventDetailData {
  bgDescription: string;
  involvedSubjects: string[];
  startTime: string;
  location: string;
  timeline: { id: string; time: string; content: string; hotCount: number; link?: string }[];
  disposalProgress: string;
}

export interface TaskDataset {
  info: TaskInfo;
  events: EventItem[];
  instructions: IssuedInstruction[];
  quickAnalysis: QuickAnalysisData;
  workStats: WorkStatisticsData;
  summary: OpinionSummaryData;
  detail: EventDetailData;
}

// 预设高保真任务数据集映射
const predefinedTaskDatasets: Record<string, TaskDataset> = {
  // 1. 渝中宝马撞人事件 (t1)
  t1: {
    info: {
      id: 't1',
      code: 'YZ-0801',
      name: '渝中宝马撞人事件',
      category: '重大事项跟踪',
      status: 'normal',
      department: '渝中大队',
      keywords: ['渝中', '宝马撞人', '中山路', '警方通告', '事故核查'],
      createTime: '2026-08-01 14:20:00',
      eventCount: 245,
      trend: 18,
    },
    events: [
      {
        id: 'yz-101',
        seq: 1,
        title: '网传渝中区中山一路一宝马车撞人后逃逸？警方：系车辆失控，驾驶员已控制',
        author: '重庆观察',
        platform: '新浪微博',
        platformIcon: 'weibo',
        publishTime: '2026-08-01 15:10:22',
        content: '今日14时许，渝中区中山一路发生一起交通事故，一辆宝马轿车连续撞击多辆电动车及行人。现场有网民质疑驾驶员酒驾逃逸。渝中警务通报称现场受重伤2人已送医，驾驶员已被控制，事故原因正在调查中。',
        images: ['https://pic.rmb.bdstatic.com/bjh/963f45f6.jpeg'],
        views: 142000,
        comments: 1890,
        likes: 12500,
        shares: 3400,
        heatLevel: 'high',
        heatValue: 92,
        isWaring: true,
        tags: ['质疑逃逸', '警方通告', '核心关注'],
        dataSource: '全网监测',
        sentimentIndex: -0.82,
        starRating: 5,
      },
      {
        id: 'yz-102',
        seq: 2,
        title: '现场视频发布：伤者均已送往重医附一院，交通已恢复正常',
        author: '第一眼新闻',
        platform: '抖音',
        platformIcon: 'douyin',
        publishTime: '2026-08-01 16:30:15',
        content: '视听现场报道，交巡警与120救援人员快速赶到现场处置，伤者目前生命体征平稳。现场道路阻断约40分钟后恢复通行。网民普遍关注事故认定与责任划分。',
        images: [],
        views: 98000,
        comments: 640,
        likes: 5800,
        shares: 1200,
        heatLevel: 'medium',
        heatValue: 74,
        isWaring: false,
        tags: ['现场处置', '正面引导'],
        dataSource: '短视频监控',
        sentimentIndex: -0.25,
        starRating: 3,
      },
      {
        id: 'yz-103',
        seq: 3,
        title: '个别自媒体炒作“车主有背景”，网安支队已介入核查辟谣',
        author: '重庆网警',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-08-01 18:45:00',
        content: '警惕网络造谣！针对部分社交群组流传的“肇事者身份特殊”等不实信息，公安机关已依法开展调查，请广大网民不信谣不传谣。',
        images: [],
        views: 45000,
        comments: 310,
        likes: 3400,
        shares: 890,
        heatLevel: 'medium',
        heatValue: 68,
        isWaring: true,
        tags: ['辟谣核查', '指令跟踪'],
        dataSource: '公众号监测',
        sentimentIndex: 0.15,
        starRating: 4,
      },
    ],
    instructions: [
      {
        id: 'cmd-yz-01',
        eventId: 'yz-101',
        instructionNames: ['谣言核查', '通告引导'],
        receiverArea: '渝中区',
        receiverPost: '网安处置岗',
        receiverUser: '张警官',
        status: '处理中',
        linkStatus: '仍可访问',
        issuedBy: '支队指挥中心',
        issuedTime: '2026-08-01 15:30:00',
        deadline: '2026-08-01 21:30:00',
        latestFeedback: '属地已联络相关发布者要求澄清，配合官方通告引导舆论。',
      },
    ],
    quickAnalysis: {
      timeSeries: {
        hours: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        volume: [12, 25, 30, 210, 185, 120, 85, 45],
        sentiment: [-0.1, -0.2, -0.1, -0.85, -0.6, -0.3, -0.2, -0.1],
      },
      platformDist: [
        { name: '新浪微博', value: 45 },
        { name: '抖音', value: 30 },
        { name: '今日头条', value: 15 },
        { name: '微信公众号', value: 10 },
      ],
      sentimentDist: [
        { name: '敏感负面', value: 68 },
        { name: '中性客观', value: 24 },
        { name: '正面理性', value: 8 },
      ],
      hotWords: [
        { name: '宝马撞人', weight: 98 },
        { name: '警方通报', weight: 85 },
        { name: '中山一路', weight: 72 },
        { name: '伤者救治', weight: 64 },
        { name: '严惩不贷', weight: 50 },
      ],
      topEvents: [
        { rank: 1, title: '渝中宝马撞人现场视频', heat: 92, platform: '微博' },
        { rank: 2, title: '警方快速通报驾驶员已被控制', heat: 88, platform: '抖音' },
        { rank: 3, title: '伤者已送医无生命危险', heat: 74, platform: '头条' },
      ],
    },
    workStats: {
      totalInstructions: 12,
      signedCount: 12,
      completedCount: 9,
      inProgressCount: 3,
      timeoutCount: 0,
      completionRate: '75%',
      deptResponse: [
        { dept: '渝中大队', count: 6, completed: 5 },
        { dept: '交巡警支队', count: 4, completed: 3 },
        { dept: '网安支队', count: 2, completed: 1 },
      ],
      typeDistribution: [
        { type: '辟谣核查', count: 5 },
        { type: '正面引导', count: 4 },
        { type: '劝删管控', count: 3 },
      ],
    },
    summary: {
      title: '“渝中宝马撞人事件”舆情分析专报',
      period: '2026-08-01 14:00 - 2026-08-02 10:00',
      riskLevel: '高风险',
      summaryText: '2026年8月1日14时许，渝中区中山一路发生宝马车撞人交通事故。引发全网高关注，微博与抖音平台传播量占比达75%。网络初期存在“富二代醉驾逃逸”等非理性猜测，经官方快速通告澄清后，敏感情绪显著回落。',
      keyPoints: [
        '事故引发网民对公共交通安全的高度关切，短视频扩散迅速。',
        '官方通告出台及时（事故发生后1小时内），有效遏制了谣言扩散。',
        '目前网民情绪趋于理性，重点关注后续法律责任认定。',
      ],
      recommendations: [
        '持续盯控个别自媒体借机博眼球立案作秀言论。',
        '及时发布伤者救治进展与伤情鉴定结果，增强透明度。',
      ],
      historicalReports: [
        { id: 'rep-yz-1', name: '渝中宝马撞人事件研判专报 (第1期).pdf', date: '2026-08-01 18:00', type: 'PDF', size: '2.4MB' },
      ],
    },
    detail: {
      bgDescription: '2026年8月1日14:15，渝中区中山一路发生宝马轿车刮撞事故，导致多名过路群众不同程度受伤，肇事车辆被民警与周边群众现场拦截。',
      involvedSubjects: ['肇事驾驶员王某（男，34岁）', '现场伤者3名', '渝中交巡警支队'],
      startTime: '2026-08-01 14:15:00',
      location: '渝中区中山一路',
      timeline: [
        { id: 'tl-yz-1', time: '08月01日 14时15分', content: '渝中区中山一路发生宝马车撞人事故，群众报警', hotCount: 85 },
        { id: 'tl-yz-2', time: '08月01日 15时00分', content: '渝中警方发布首次通告，驾驶员已被控制', hotCount: 92 },
        { id: 'tl-yz-3', time: '08月01日 17时30分', content: '交巡警公布初查结果：排除酒驾毒驾，系操作不当', hotCount: 78 },
      ],
      disposalProgress: '驾驶员已被刑事拘留，伤者生命体征平稳，交通已全面恢复。',
    },
  },

  // 2. 彭水山体滑坡 (t2)
  t2: {
    info: {
      id: 't2',
      code: 'PS-0728',
      name: '彭水山体滑坡',
      category: '重大事项跟踪',
      status: 'normal',
      department: '彭水大队',
      keywords: ['彭水', '山体滑坡', '抢险救援', '暴雨涉灾', '人员疏散'],
      createTime: '2026-07-28 08:30:00',
      eventCount: 168,
      trend: 8,
    },
    events: [
      {
        id: 'ps-201',
        seq: 1,
        title: '重庆彭水发生山体滑坡：国道部分阻断，武警救援队伍已赶赴现场',
        author: '央视新闻',
        platform: '今日头条',
        platformIcon: 'toutiao',
        publishTime: '2026-07-28 09:15:00',
        content: '受连续强降雨影响，彭水县某乡道发生山体滑坡，塌方量约1.2万立方米。地方政府已启动应急预案，组织民警与武警赶赴现场抢险救援，暂无人员伤亡报告。',
        images: [],
        views: 115000,
        comments: 420,
        likes: 6700,
        shares: 1800,
        heatLevel: 'high',
        heatValue: 86,
        isWaring: false,
        tags: ['灾情通报', '应急抢险'],
        dataSource: '主流媒体监测',
        sentimentIndex: -0.15,
        starRating: 4,
      },
      {
        id: 'ps-202',
        seq: 2,
        title: '彭水警方对G211线滑坡路段实施临时交通管制',
        author: '彭水公安',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-07-28 10:40:00',
        content: '由于持续降雨存在二次滑坡风险，交巡警已对滑坡区域上下游5公里实施临时双向交通管制，请过往车辆绕行S304省道。',
        images: [],
        views: 32000,
        comments: 110,
        likes: 1800,
        shares: 950,
        heatLevel: 'low',
        heatValue: 52,
        isWaring: false,
        tags: ['交通管制', '信息发布'],
        dataSource: '官方公众号',
        sentimentIndex: 0.35,
        starRating: 2,
      },
    ],
    instructions: [],
    quickAnalysis: {
      timeSeries: {
        hours: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        volume: [8, 95, 140, 110, 85, 60, 40, 25],
        sentiment: [-0.3, -0.2, -0.1, 0.1, 0.2, 0.3, 0.3, 0.4],
      },
      platformDist: [
        { name: '今日头条', value: 40 },
        { name: '微信公众号', value: 35 },
        { name: '新浪微博', value: 15 },
        { name: '抖音', value: 10 },
      ],
      sentimentDist: [
        { name: '正面理性', value: 55 },
        { name: '中性客观', value: 35 },
        { name: '敏感担忧', value: 10 },
      ],
      hotWords: [
        { name: '山体滑坡', weight: 95 },
        { name: '彭水救援', weight: 88 },
        { name: '交通管制', weight: 75 },
        { name: '人员转移', weight: 60 },
      ],
      topEvents: [
        { rank: 1, title: '彭水山体滑坡抢险最新进展', heat: 86, platform: '头条' },
        { rank: 2, title: '交通管制通告', heat: 52, platform: '微信' },
      ],
    },
    workStats: {
      totalInstructions: 6,
      signedCount: 6,
      completedCount: 6,
      inProgressCount: 0,
      timeoutCount: 0,
      completionRate: '100%',
      deptResponse: [
        { dept: '彭水大队', count: 4, completed: 4 },
        { dept: '交巡警支队', count: 2, completed: 2 },
      ],
      typeDistribution: [
        { type: '信息发布', count: 4 },
        { type: '正面引导', count: 2 },
      ],
    },
    summary: {
      title: '彭水山体滑坡抢险与网络舆情研判',
      period: '2026-07-28 08:00 - 2026-07-29 10:00',
      riskLevel: '低风险',
      summaryText: '受强降雨影响彭水发生山体滑坡。网络舆情整体以关切救援与交通绕行信息为主，主流媒体报道及时，无不良谣言炒作，风险可控。',
      keyPoints: ['网民关切集中在有无人员被困与道路抢通时间。', '官方交通绕行提示传播效果良好。'],
      recommendations: ['抢通完毕后第一时间发布恢复通行通告。'],
      historicalReports: [
        { id: 'rep-ps-1', name: '彭水山体滑坡舆情专报.pdf', date: '2026-07-28 17:00', type: 'PDF', size: '1.8MB' },
      ],
    },
    detail: {
      bgDescription: '连续大暴雨诱发彭水县山体滑坡，塌方堆积物覆盖国道。',
      involvedSubjects: ['彭水应急管理局', '彭水县公安局交巡警大队', '武警重庆总队'],
      startTime: '2026-07-28 08:10:00',
      location: '彭水县G211国道K102段',
      timeline: [
        { id: 'tl-ps-1', time: '07月28日 08时10分', content: '发生山体滑坡，道路中断', hotCount: 70 },
        { id: 'tl-ps-2', time: '07月28日 09时30分', content: '应急、公安救援力量赶赴现场', hotCount: 86 },
      ],
      disposalProgress: '救援施工正在进行，道路预计明日前恢复通车。',
    },
  },

  // 3. 重庆火灾舆情 (t4)
  t4: {
    info: {
      id: 't4',
      code: 'CQ-0715',
      name: '重庆火灾舆情',
      category: '重大事项跟踪',
      status: 'normal',
      department: '支队',
      keywords: ['重庆火灾', '高层消防', '灭火救援', '消火栓', '原因调查'],
      createTime: '2026-07-15 19:40:00',
      eventCount: 310,
      trend: 25,
    },
    events: [
      {
        id: 't4-301',
        seq: 1,
        title: '重庆一高层住宅发生火情，消防紧急出动18辆消防车扑救',
        author: '重庆消防',
        platform: '新浪微博',
        platformIcon: 'weibo',
        publishTime: '2026-07-15 20:15:00',
        content: '2026年7月15日19时30分，某高层住宅15楼发生火灾。消防救援支队迅速调集力量前往扑救，21时00分明火被扑灭，无人员伤亡。起火原因正在进一步调查中。',
        images: [],
        views: 230000,
        comments: 3100,
        likes: 18500,
        shares: 4200,
        heatLevel: 'high',
        heatValue: 95,
        isWaring: true,
        tags: ['高层火灾', '消防救援', '官方通报'],
        dataSource: '微博全网监测',
        sentimentIndex: -0.45,
        starRating: 5,
      },
      {
        id: 't4-302',
        seq: 2,
        title: '网传“消防通道被私家车占用阻碍救援”？警方正对违停车辆依法排查处理',
        author: '第1眼新闻',
        platform: '抖音',
        platformIcon: 'douyin',
        publishTime: '2026-07-15 21:40:00',
        content: '现场网民拍摄视频显示消防车进小区时受阻。交巡警接报后立即赶赴现场拖移占用消防通道车辆，并对涉事车主依法立案处罚。',
        images: [],
        views: 180000,
        comments: 2400,
        likes: 14000,
        shares: 3100,
        heatLevel: 'high',
        heatValue: 90,
        isWaring: true,
        tags: ['消防通道占用', '依法处罚'],
        dataSource: '短视频监测',
        sentimentIndex: -0.70,
        starRating: 4,
      },
    ],
    instructions: [
      {
        id: 'cmd-t4-01',
        eventId: 't4-302',
        instructionNames: ['执法核查', '正面回应'],
        receiverArea: '支队',
        receiverPost: '网巡岗',
        receiverUser: '李队长',
        status: '已完成',
        linkStatus: '仍可访问',
        issuedBy: '指挥中心',
        issuedTime: '2026-07-15 22:00:00',
        deadline: '2026-07-16 02:00:00',
        latestFeedback: '已联合交巡警发布通告，通报违停拖移处置结果，引导网民理性看待。',
      },
    ],
    quickAnalysis: {
      timeSeries: {
        hours: ['18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00', '08:00'],
        volume: [15, 320, 280, 150, 80, 40, 30, 20],
        sentiment: [-0.2, -0.8, -0.6, -0.4, -0.3, -0.2, -0.1, 0.0],
      },
      platformDist: [
        { name: '抖音', value: 45 },
        { name: '新浪微博', value: 40 },
        { name: '微信朋友圈', value: 10 },
        { name: '百度贴吧', value: 5 },
      ],
      sentimentDist: [
        { name: '敏感愤慨', value: 60 },
        { name: '中性关注', value: 30 },
        { name: '正面赞许救援', value: 10 },
      ],
      hotWords: [
        { name: '高层火灾', weight: 98 },
        { name: '消防通道', weight: 92 },
        { name: '占用阻碍', weight: 85 },
        { name: '明火扑灭', weight: 70 },
      ],
      topEvents: [
        { rank: 1, title: '重庆高层住宅火情现场救援', heat: 95, platform: '微博' },
        { rank: 2, title: '占用消防通道车主被处罚', heat: 90, platform: '抖音' },
      ],
    },
    workStats: {
      totalInstructions: 15,
      signedCount: 15,
      completedCount: 14,
      inProgressCount: 1,
      timeoutCount: 0,
      completionRate: '93%',
      deptResponse: [
        { dept: '消防救援支队', count: 8, completed: 8 },
        { dept: '交巡警支队', count: 5, completed: 5 },
        { dept: '网安支队', count: 2, completed: 1 },
      ],
      typeDistribution: [
        { type: '通报回应', count: 7 },
        { type: '执法处置', count: 5 },
        { type: '辟谣引导', count: 3 },
      ],
    },
    summary: {
      title: '“重庆高层住宅火情”网络舆情专报',
      period: '2026-07-15 19:00 - 2026-07-16 12:00',
      riskLevel: '中风险',
      summaryText: '高层火灾发生后短时间内引发高关注，网民愤慨点主要集中在“私家车占用消防通道”。公安机关与消防部门联动处置迅速，执法处罚及时公布，有效纾解了舆论负面情绪。',
      keyPoints: ['高层消防安全是社会痛点，易产生公众共鸣。', '对违停车主的执法处罚回应了公众关切。'],
      recommendations: ['联合物业开展高层小区消防通道专项整治宣导。'],
      historicalReports: [
        { id: 'rep-t4-1', name: '重庆火灾舆情分析报告.pdf', date: '2026-07-16 09:00', type: 'PDF', size: '3.1MB' },
      ],
    },
    detail: {
      bgDescription: '高层住宅15楼外墙及室内起火，浓烟较大，小区消防通道存在违停阻挡现象。',
      involvedSubjects: ['重庆市消防救援支队', '违停车主', '物业服务公司'],
      startTime: '2026-07-15 19:30:00',
      location: '某高层住宅小区',
      timeline: [
        { id: 'tl-t4-1', time: '07月15日 19时30分', content: '15楼突发火灾，群众报警', hotCount: 90 },
        { id: 'tl-t4-2', time: '07月15日 21时00分', content: '明火被彻底扑灭，未造成伤亡', hotCount: 95 },
        { id: 'tl-t4-3', time: '07月15日 22时30分', content: '拖移违停车辆并通报处罚结果', hotCount: 88 },
      ],
      disposalProgress: '火灾原因系电气线路故障，涉事违停车主已被行政处罚。',
    },
  },

  // 4. 大足一中 (t5)
  t5: {
    info: {
      id: 't5',
      code: 'DZ-0715',
      name: '大足一中',
      category: '重大事项跟踪',
      status: 'normal',
      department: '大足区',
      keywords: ['大足一中', '校园安全', '家校沟通', '网传澄清', '大足教委'],
      createTime: '2026-07-15 10:00:00',
      eventCount: 98,
      trend: 3,
    },
    events: [
      {
        id: 't5-401',
        seq: 1,
        title: '关于网传“大足一中学生安全事件”情况说明：系学生误会矛盾，学校已调解',
        author: '大足教育',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-07-15 11:20:00',
        content: '大足区教委联合公安机关调查通告：针对网传大足一中学生纠纷视频，经核查为同班学生日常小摩擦，双方家长已在校方与民警协调下达成谅解，网传“霸凌”说法不属实。',
        images: [],
        views: 28000,
        comments: 180,
        likes: 1200,
        shares: 340,
        heatLevel: 'medium',
        heatValue: 62,
        isWaring: false,
        tags: ['校方澄清', '情况说明'],
        dataSource: '微信监测',
        sentimentIndex: 0.40,
        starRating: 2,
      },
    ],
    instructions: [],
    quickAnalysis: {
      timeSeries: {
        hours: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        volume: [5, 45, 60, 30, 15, 8],
        sentiment: [-0.4, -0.2, 0.2, 0.4, 0.5, 0.5],
      },
      platformDist: [
        { name: '微信公众号', value: 60 },
        { name: '抖音', value: 25 },
        { name: '百度贴吧', value: 15 },
      ],
      sentimentDist: [
        { name: '正面澄清', value: 65 },
        { name: '中性关注', value: 25 },
        { name: '质疑遗留', value: 10 },
      ],
      hotWords: [
        { name: '大足一中', weight: 90 },
        { name: '情况说明', weight: 80 },
        { name: '达成谅解', weight: 70 },
      ],
      topEvents: [
        { rank: 1, title: '大足一中情况说明', heat: 62, platform: '微信' },
      ],
    },
    workStats: {
      totalInstructions: 4,
      signedCount: 4,
      completedCount: 4,
      inProgressCount: 0,
      timeoutCount: 0,
      completionRate: '100%',
      deptResponse: [{ dept: '大足区局', count: 4, completed: 4 }],
      typeDistribution: [{ type: '情况说明', count: 4 }],
    },
    summary: {
      title: '大足一中校园舆情研判',
      period: '2026-07-15 08:00 - 2026-07-16 08:00',
      riskLevel: '低风险',
      summaryText: '网传大足一中纠纷经教委与公安快速调查澄清后，舆情迅速平息，家校关系融洽。',
      keyPoints: ['涉校舆情关注度高但澄清及时。'],
      recommendations: ['加强校园心理辅导与日常沟通。'],
      historicalReports: [],
    },
    detail: {
      bgDescription: '网传两名学生在校内发生肢体摩擦，个别家长在社交群组转发引发关注。',
      involvedSubjects: ['大足一中', '大足区教委', '属地派出所'],
      startTime: '2026-07-15 09:30:00',
      location: '大足区大足一中校园内',
      timeline: [
        { id: 'tl-t5-1', time: '07月15日 09时30分', content: '网传相关小视频', hotCount: 45 },
        { id: 'tl-t5-2', time: '07月15日 11时20分', content: '发布情况说明通告', hotCount: 62 },
      ],
      disposalProgress: '双方学生已恢复正常上课，舆情平息。',
    },
  },

  // 5. 5月23日 淮安苏超 (s1 / 1)
  s1: {
    info: {
      id: 's1',
      code: 'HA-0523',
      name: '5月23日 淮安苏超',
      category: '安保任务',
      status: 'normal',
      department: '支队',
      keywords: ['淮安苏超', '足球联赛', '安保值守', '交通疏导', '球迷秩序'],
      createTime: '2026-05-20 09:00:00',
      eventCount: 132,
      trend: 12,
    },
    events: [
      {
        id: 's1-501',
        seq: 1,
        title: '5月23日淮安苏超超级联赛开踢！奥体中心周边交通管制提示请收好',
        author: '淮安发布',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-05-21 10:00:00',
        content: '江苏省足球超级联赛淮安主场比赛将于5月23日19:30在奥体中心举行。淮安公安出动800余名警力做好现场安保与观赛秩序维护。出行市民请关注临时交通管制通告。',
        images: [],
        views: 68000,
        comments: 540,
        likes: 4200,
        shares: 1600,
        heatLevel: 'medium',
        heatValue: 78,
        isWaring: false,
        tags: ['安保通告', '赛事服务'],
        dataSource: '官方微信',
        sentimentIndex: 0.65,
        starRating: 2,
      },
      {
        id: 's1-502',
        seq: 2,
        title: '球场秩序井然！现场民警贴心指引帮助丢失物品球迷寻回包囊',
        author: '淮安警方',
        platform: '抖音',
        platformIcon: 'douyin',
        publishTime: '2026-05-23 21:15:00',
        content: '比赛现场气氛热烈，现场安保警力全程巡逻，文明观赛引导到位。网民纷纷为淮安公安的温暖护航点赞。',
        images: [],
        views: 89000,
        comments: 620,
        likes: 7800,
        shares: 1100,
        heatLevel: 'low',
        heatValue: 65,
        isWaring: false,
        tags: ['正面暖新闻', '现场服务'],
        dataSource: '短视频',
        sentimentIndex: 0.85,
        starRating: 1,
      },
    ],
    instructions: [],
    quickAnalysis: {
      timeSeries: {
        hours: ['12:00', '15:00', '18:00', '21:00', '00:00'],
        volume: [20, 45, 120, 180, 50],
        sentiment: [0.3, 0.4, 0.6, 0.8, 0.7],
      },
      platformDist: [
        { name: '微信公众号', value: 50 },
        { name: '抖音', value: 35 },
        { name: '新浪微博', value: 15 },
      ],
      sentimentDist: [
        { name: '正面赞许', value: 80 },
        { name: '中性关注', value: 18 },
        { name: '极少数抱怨堵车', value: 2 },
      ],
      hotWords: [
        { name: '淮安苏超', weight: 98 },
        { name: '奥体中心', weight: 85 },
        { name: '安保护航', weight: 75 },
        { name: '交通疏导', weight: 65 },
      ],
      topEvents: [
        { rank: 1, title: '淮安苏超安保交通管制通告', heat: 78, platform: '微信' },
        { rank: 2, title: '民警现场贴心服务暖心寻物', heat: 65, platform: '抖音' },
      ],
    },
    workStats: {
      totalInstructions: 8,
      signedCount: 8,
      completedCount: 8,
      inProgressCount: 0,
      timeoutCount: 0,
      completionRate: '100%',
      deptResponse: [
        { dept: '清江浦大队', count: 5, completed: 5 },
        { dept: '交巡警支队', count: 3, completed: 3 },
      ],
      typeDistribution: [
        { type: '交通指引', count: 5 },
        { type: '现场安保', count: 3 },
      ],
    },
    summary: {
      title: '5月23日淮安苏超安保与舆情综述',
      period: '2026-05-21 00:00 - 2026-05-24 12:00',
      riskLevel: '低风险',
      summaryText: '淮安苏超赛事安保任务圆满完成。现场及网络舆情积极向好，治安与交通秩序优良，宣传引导效果显著。',
      keyPoints: ['赛事吸引近2万球迷，现场安保秩序良好。', '网络宣传突出人性化服务与文明观赛。'],
      recommendations: ['总结大型赛事安保经验并持续固化流程。'],
      historicalReports: [
        { id: 'rep-s1-1', name: '淮安苏超赛事安保总结专报.pdf', date: '2026-05-24 09:00', type: 'PDF', size: '2.1MB' },
      ],
    },
    detail: {
      bgDescription: '江苏省足球超级联赛淮安主场比赛，预售票达1.8万张。',
      involvedSubjects: ['淮安市公安局治安支队', '交巡警支队', '淮安市奥体中心'],
      startTime: '2026-05-23 16:00:00',
      location: '淮安市奥体中心体育场',
      timeline: [
        { id: 'tl-s1-1', time: '05月21日 10时00分', content: '发布交通管制与安保通告', hotCount: 78 },
        { id: 'tl-s1-2', time: '05月23日 19时30分', content: '比赛顺利开踢，现场秩序井然', hotCount: 89 },
      ],
      disposalProgress: '观众顺利离场，安保任务圆满结束。',
    },
  },

  // 6. 0510 淮安汛情 (p1 / 1 / sc-1)
  p1: {
    info: {
      id: 'p1',
      code: '0510',
      name: '淮安汛情',
      category: '专项巡查任务',
      status: 'normal',
      department: '支队',
      keywords: ['淮安', '汛情', '洪水', '暴雨', '防汛'],
      createTime: '2026-05-10 09:30:00',
      eventCount: 156,
      trend: 12,
    },
    events: [
      {
        id: '1',
        seq: 1,
        title: '淮安市防汛抗旱指挥部提升防汛应急响应至II级',
        author: '淮安发布',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-05-10 10:15:00',
        content: '受上游来水和强降雨共同影响，淮河流域淮安段水位持续上涨，超出警戒水位0.8米。市防指决定自5月10日10时起，提升防汛应急响应至II级。请广大市民密切关注天气变化。',
        images: ['https://pic.rmb.bdstatic.com/bjh/963f45f6.jpeg'],
        views: 125000,
        comments: 890,
        likes: 8500,
        shares: 2400,
        heatLevel: 'high',
        heatValue: 88,
        isWaring: true,
        tags: ['权威发布', '应急响应', '防汛救灾'],
        dataSource: '微信监测',
        sentimentIndex: 0.10,
        starRating: 4,
      },
      {
        id: '2',
        seq: 2,
        title: '网传“淮安三闸要决堤”？官方辟谣：结构完好，正在安全泄洪',
        author: '淮安网警',
        platform: '新浪微博',
        platformIcon: 'weibo',
        publishTime: '2026-05-10 11:30:00',
        content: '今日个别微信群流传“淮安三闸出现险情即将溃坝”信息。经水利专家现场核查，三闸运行正常，工程结构安全，水利部门正有序调度泄洪。公安机关已对造谣者开展调查。',
        images: [],
        views: 95000,
        comments: 640,
        likes: 5800,
        shares: 1200,
        heatLevel: 'high',
        heatValue: 92,
        isWaring: true,
        tags: ['辟谣核查', '指令跟踪', '属地关切'],
        dataSource: '微博监测',
        sentimentIndex: -0.75,
        starRating: 5,
      },
    ],
    instructions: [
      {
        id: 'cmd-001',
        eventId: '2',
        instructionNames: ['谣言核查', '劝删下达'],
        receiverArea: '淮安区',
        receiverPost: '劝删处置岗',
        receiverUser: '张明',
        status: '处理中',
        linkStatus: '仍可访问',
        issuedBy: '支队值班岗',
        issuedTime: '2026-05-10 15:20:00',
        deadline: '2026-05-10 23:20:00',
        latestFeedback: '属地已签收，正在联系平台侧核验原帖状态。',
      },
    ],
    quickAnalysis: {
      timeSeries: {
        hours: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        volume: [12, 8, 25, 110, 185, 140, 95, 60],
        sentiment: [0.1, 0.0, -0.2, -0.6, -0.4, 0.1, 0.3, 0.4],
      },
      platformDist: [
        { name: '微信公众号', value: 42 },
        { name: '新浪微博', value: 35 },
        { name: '抖音', value: 15 },
        { name: '百度贴吧', value: 8 },
      ],
      sentimentDist: [
        { name: '正面理性', value: 55 },
        { name: '中性关注', value: 30 },
        { name: '恐慌焦虑', value: 15 },
      ],
      hotWords: [
        { name: '淮安汛情', weight: 98 },
        { name: '应急响应', weight: 88 },
        { name: '有序泄洪', weight: 82 },
        { name: '严惩造谣', weight: 70 },
      ],
      topEvents: [
        { rank: 1, title: '淮安三闸溃坝辟谣通报', heat: 92, platform: '微博' },
        { rank: 2, title: '防汛II级应急响应提升通告', heat: 88, platform: '微信' },
      ],
    },
    workStats: {
      totalInstructions: 16,
      signedCount: 16,
      completedCount: 13,
      inProgressCount: 3,
      timeoutCount: 0,
      completionRate: '81.2%',
      deptResponse: [
        { dept: '淮安区', count: 6, completed: 5 },
        { dept: '清江浦区', count: 5, completed: 4 },
        { dept: '淮阴区', count: 5, completed: 4 },
      ],
      typeDistribution: [
        { type: '辟谣核查', count: 7 },
        { type: '通报引导', count: 5 },
        { type: '劝删管控', count: 4 },
      ],
    },
    summary: {
      title: '“淮安汛情”全网舆情综述研判报告',
      period: '2026-05-10 00:00 - 2026-05-11 12:00',
      riskLevel: '中风险',
      summaryText: '因持续降雨与淮河泄洪，‘淮安汛情’全网热度较高。中期网络曾出现‘三闸溃坝’等恐慌谣言，水利与公安部门快速核查辟谣后，公众情绪转为正面理性。',
      keyPoints: [
        '防汛应急响应提升通告传播覆盖面广。',
        '针对三闸溃坝谣言的打击辟谣效果立竿见影。',
      ],
      recommendations: [
        '重点盯控堤坝防守与转移人员安置相关网评。',
        '持续发布一线警民抢险救援暖心画面。',
      ],
      historicalReports: [
        { id: 'rep-p1-1', name: '淮安汛情舆情专报(第1期).pdf', date: '2026-05-10 18:00', type: 'PDF', size: '2.8MB' },
      ],
    },
    detail: {
      bgDescription: '受强降雨影响，淮河流域水位超警，水利工程开展调洪泄洪。',
      involvedSubjects: ['淮安市防汛抗旱指挥部', '淮安市水利局', '淮安市公安局网安支队'],
      startTime: '2026-05-10 08:00:00',
      location: '淮安市淮河干流段',
      timeline: [
        { id: 'tl-p1-1', time: '05月10日 10时00分', content: '提升防汛应急响应至II级', hotCount: 88 },
        { id: 'tl-p1-2', time: '05月10日 11时30分', content: '网警发布三闸安全辟谣通报', hotCount: 92 },
      ],
      disposalProgress: '水情趋于稳定，泄洪有序进行，无险情发生。',
    },
  },

  // 7. 0118 高张花园 (p2 / 2 / sc-2)
  p2: {
    info: {
      id: 'p2',
      code: '0118',
      name: '高张花园',
      category: '专项巡查任务',
      status: 'normal',
      department: '清江浦大队',
      keywords: ['高张花园', '物业纠纷', '车位规划', '业主维权', '社区协商'],
      createTime: '2026-01-18 14:00:00',
      eventCount: 86,
      trend: 4,
    },
    events: [
      {
        id: 'p2-701',
        seq: 1,
        title: '清江浦区高张花园小区车位租售方案争议：街道办已介入搭建协商平台',
        author: '淮安晚报',
        platform: '今日头条',
        platformIcon: 'toutiao',
        publishTime: '2026-01-18 15:30:00',
        content: '近日高张花园部分业主反映物业调整地下车位收费标准未充分征求意见。清江浦区属地街道办与社区派出所已组织物业公司与业主代表面对面协商，承诺一周内出台补正方案。',
        images: [],
        views: 34000,
        comments: 260,
        likes: 1800,
        shares: 420,
        heatLevel: 'medium',
        heatValue: 68,
        isWaring: false,
        tags: ['社区维权', '街道调解'],
        dataSource: '地方新闻监测',
        sentimentIndex: -0.20,
        starRating: 3,
      },
    ],
    instructions: [],
    quickAnalysis: {
      timeSeries: {
        hours: ['09:00', '12:00', '15:00', '18:00', '21:00'],
        volume: [10, 25, 70, 45, 20],
        sentiment: [-0.4, -0.3, -0.1, 0.2, 0.3],
      },
      platformDist: [
        { name: '今日头条', value: 45 },
        { name: '业主微信群', value: 40 },
        { name: '抖音', value: 15 },
      ],
      sentimentDist: [
        { name: '表达诉求', value: 50 },
        { name: '中性关注', value: 35 },
        { name: '正面调解', value: 15 },
      ],
      hotWords: [
        { name: '高张花园', weight: 92 },
        { name: '车位租售', weight: 85 },
        { name: '街道调解', weight: 75 },
      ],
      topEvents: [
        { rank: 1, title: '高张花园车位矛盾街道介入调解', heat: 68, platform: '头条' },
      ],
    },
    workStats: {
      totalInstructions: 5,
      signedCount: 5,
      completedCount: 5,
      inProgressCount: 0,
      timeoutCount: 0,
      completionRate: '100%',
      deptResponse: [{ dept: '清江浦大队', count: 5, completed: 5 }],
      typeDistribution: [{ type: '线下调解跟进', count: 5 }],
    },
    summary: {
      title: '高张花园小区涉稳舆情研判',
      period: '2026-01-18 09:00 - 2026-01-19 12:00',
      riskLevel: '低风险',
      summaryText: '高张花园业主维权舆情局限于本地社群，属地街道与公安及时介入调解，矛盾未有激化扩大趋势。',
      keyPoints: ['民生诉求类舆情，重在属地线下化解。'],
      recommendations: ['督促物业公示账目与方案。'],
      historicalReports: [],
    },
    detail: {
      bgDescription: '高张花园小区物业因车位收费调整引发部分业主不满。',
      involvedSubjects: ['高张花园业主代表', '物业公司', '清江浦区某街道办'],
      startTime: '2026-01-18 10:00:00',
      location: '清江浦区高张花园小区',
      timeline: [
        { id: 'tl-p2-1', time: '01月18日 10时00分', content: '业主在小区广场表达诉求', hotCount: 50 },
        { id: 'tl-p2-2', time: '01月18日 15时30分', content: '街道组织双方闭门协商', hotCount: 68 },
      ],
      disposalProgress: '双方达成初步沟通意向，物业暂停新收费方案。',
    },
  },

  // 8. 合川重点学校巡查 (t16)
  t16: {
    info: {
      id: 't16',
      code: 'HC-0731',
      name: '合川重点学校巡查',
      category: '重大事项跟踪',
      status: 'normal',
      department: '合川区',
      keywords: ['合川', '重点学校', '校园巡查', '治安盯控', '网络网巡'],
      createTime: '2026-07-31 08:30:00',
      eventCount: 74,
      trend: 2,
    },
    events: [
      {
        id: 't16-801',
        seq: 1,
        title: '合川公安开启暑期校园周边治安专项巡查与网巡护航行动',
        author: '合川公安',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-07-31 09:30:00',
        content: '为保障合川各重点学校周边环境治安稳定，合川网安与派出所民警全面加强校园周边巡逻与网络贴吧舆情巡查，坚决杜绝涉校治安隐患。',
        images: [],
        views: 21000,
        comments: 120,
        likes: 1500,
        shares: 310,
        heatLevel: 'low',
        heatValue: 55,
        isWaring: false,
        tags: ['专项巡查', '护航校园'],
        dataSource: '官方公众号',
        sentimentIndex: 0.75,
        starRating: 1,
      },
    ],
    instructions: [],
    quickAnalysis: {
      timeSeries: {
        hours: ['08:00', '12:00', '16:00', '20:00'],
        volume: [15, 30, 20, 10],
        sentiment: [0.5, 0.7, 0.7, 0.6],
      },
      platformDist: [{ name: '微信公众号', value: 70 }, { name: '贴吧', value: 30 }],
      sentimentDist: [{ name: '正面赞许', value: 85 }, { name: '中性关注', value: 15 }],
      hotWords: [{ name: '合川学校', weight: 90 }, { name: '校园巡查', weight: 80 }],
      topEvents: [{ rank: 1, title: '合川校园专项巡查通告', heat: 55, platform: '微信' }],
    },
    workStats: {
      totalInstructions: 3,
      signedCount: 3,
      completedCount: 3,
      inProgressCount: 0,
      timeoutCount: 0,
      completionRate: '100%',
      deptResponse: [{ dept: '合川区', count: 3, completed: 3 }],
      typeDistribution: [{ type: '巡查防护', count: 3 }],
    },
    summary: {
      title: '合川重点学校巡查研判',
      period: '2026-07-31 00:00 - 2026-08-01 24:00',
      riskLevel: '低风险',
      summaryText: '合川重点学校网络与线下治安秩序平稳，未发现敏感负面炒作。',
      keyPoints: ['暑期校园常态巡查到位。'],
      recommendations: ['持续做好网络网巡。'],
      historicalReports: [],
    },
    detail: {
      bgDescription: '合川区重点中学及高校周边网络与治安常态化巡查防护。',
      involvedSubjects: ['合川区公安局', '合川中学', '合川大学城'],
      startTime: '2026-07-31 08:30:00',
      location: '合川区各重点学校',
      timeline: [{ id: 'tl-16-1', time: '07月31日 09时30分', content: '启动专项网巡与安防行动', hotCount: 55 }],
      disposalProgress: '巡查秩序良好，无异常发生。',
    },
  },
};

// 动态生成匹配任务名称与类型的 fallback 数据集
export function generateDefaultTaskDataset(taskId: string, name: string): TaskDataset {
  const isSecurity = taskId.startsWith('s') || name.includes('安保') || name.includes('保卫');
  const isPatrol = taskId.startsWith('p') || name.includes('巡查') || name.includes('防汛') || name.includes('花园');
  const category = isSecurity ? '安保任务' : isPatrol ? '专项巡查任务' : '重大事项跟踪';

  const code = taskId.toUpperCase().startsWith('T')
    ? `SC-${taskId.toUpperCase()}`
    : `${category === '安保任务' ? 'SEC' : 'SP'}-${taskId.padStart(4, '0')}`;

  return {
    info: {
      id: taskId,
      code,
      name,
      category,
      status: 'normal',
      department: isSecurity ? '安保支队' : '网安支队',
      keywords: [name, '智控盯控', '专项管理', '舆情处置', '警舆同处'],
      createTime: '2026-07-20 09:00:00',
      eventCount: 110,
      trend: 5,
    },
    events: [
      {
        id: `evt-${taskId}-01`,
        seq: 1,
        title: `关于「${name}」相关情况的全网监测与研判分析`,
        author: '蓝鹰智控引擎',
        platform: '今日头条',
        platformIcon: 'toutiao',
        publishTime: '2026-08-02 10:15:00',
        content: `监测到关于「${name}」的多方关注信息。属地智控工作台已将其纳入重点盯控范围，实时跟踪网络情绪表达与现场动态。`,
        images: [],
        views: 45000,
        comments: 320,
        likes: 2100,
        shares: 540,
        heatLevel: 'medium',
        heatValue: 72,
        isWaring: false,
        tags: ['重点盯控', '常态监测'],
        dataSource: '全网智控',
        sentimentIndex: 0.15,
        starRating: 3,
      },
      {
        id: `evt-${taskId}-02`,
        seq: 2,
        title: `权威发布：关于「${name}」的最新处置与回应说明`,
        author: '属地警务发布',
        platform: '微信公众号',
        platformIcon: 'weixin',
        publishTime: '2026-08-02 14:30:00',
        content: `针对网民关注的「${name}」热点诉求，责任单位已第一时间跟进核实，依法依规妥善处置，确保事态平稳受控。`,
        images: [],
        views: 62000,
        comments: 410,
        likes: 3800,
        shares: 920,
        heatLevel: 'medium',
        heatValue: 68,
        isWaring: false,
        tags: ['权威回应', '正面引导'],
        dataSource: '公众号监测',
        sentimentIndex: 0.55,
        starRating: 2,
      },
    ],
    instructions: [
      {
        id: `cmd-${taskId}-01`,
        eventId: `evt-${taskId}-01`,
        instructionNames: ['本地监测', '研判引导'],
        receiverArea: '责任辖区',
        receiverPost: '网巡处置岗',
        receiverUser: '值班警员',
        status: '处理中',
        linkStatus: '仍可访问',
        issuedBy: '指挥中心',
        issuedTime: '2026-08-02 11:00:00',
        deadline: '2026-08-02 23:00:00',
        latestFeedback: '岗员已接单，正在按照源头防控规范巡视跟进。',
      },
    ],
    quickAnalysis: {
      timeSeries: {
        hours: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        volume: [15, 10, 45, 120, 95, 60],
        sentiment: [0.1, 0.0, 0.2, 0.4, 0.5, 0.5],
      },
      platformDist: [
        { name: '微信公众号', value: 40 },
        { name: '今日头条', value: 30 },
        { name: '新浪微博', value: 20 },
        { name: '抖音', value: 10 },
      ],
      sentimentDist: [
        { name: '正面理性', value: 60 },
        { name: '中性客观', value: 30 },
        { name: '敏感诉求', value: 10 },
      ],
      hotWords: [
        { name: name, weight: 95 },
        { name: '重点盯控', weight: 85 },
        { name: '处置回应', weight: 75 },
        { name: '平稳受控', weight: 65 },
      ],
      topEvents: [
        { rank: 1, title: `「${name}」全网监测分析`, heat: 72, platform: '头条' },
        { rank: 2, title: `权威回应与处置说明`, heat: 68, platform: '微信' },
      ],
    },
    workStats: {
      totalInstructions: 5,
      signedCount: 5,
      completedCount: 4,
      inProgressCount: 1,
      timeoutCount: 0,
      completionRate: '80%',
      deptResponse: [
        { dept: '责任大队', count: 3, completed: 3 },
        { dept: '属地派出所', count: 2, completed: 1 },
      ],
      typeDistribution: [
        { type: '研判引导', count: 3 },
        { type: '核查反馈', count: 2 },
      ],
    },
    summary: {
      title: `「${name}」舆情研判分析专报`,
      period: '2026-08-01 00:00 - 2026-08-03 10:00',
      riskLevel: '低风险',
      summaryText: `目前关于「${name}」的网络讨论整体平稳有序，舆论走势健康受控。警务防范与网上引导联动紧密，未产生衍生风险。`,
      keyPoints: [
        `「${name}」已纳入源头防控智控机制。`,
        '网络声量分布合理，正面与中性情绪占比较高。',
      ],
      recommendations: ['继续保持常态化网络监测与排班巡查。'],
      historicalReports: [
        { id: `rep-${taskId}-1`, name: `${name}研判专报.pdf`, date: '2026-08-02 18:00', type: 'PDF', size: '1.9MB' },
      ],
    },
    detail: {
      bgDescription: `「${name}」系源头防控工作台重点跟踪管理的常态/专项任务，旨在防范化解涉稳舆情风险。`,
      involvedSubjects: ['蓝鹰一体化智控工作台', '责任单位与联动警力'],
      startTime: '2026-07-20 09:00:00',
      location: '责任辖区范围',
      timeline: [
        { id: `tl-${taskId}-1`, time: '08月02日 10时15分', content: `发布「${name}」监测分析报告`, hotCount: 72 },
        { id: `tl-${taskId}-2`, time: '08月02日 14时30分', content: '发布权威处置与回应说明', hotCount: 68 },
      ],
      disposalProgress: '处置进展平稳，各环节闭环扣紧。',
    },
  };
}

// 通用数据获取 API：传入 taskId（如 t1, t2, s1, p1, '1', '2' 等）以及可选任务名称
export function getTaskDataById(taskId: string, fallbackName?: string): TaskDataset {
  // 兼容不同的 ID 命名转换（例如 '1' -> 'p1' 或 't1'）
  if (taskId === '1') {
    return predefinedTaskDatasets['p1'] || predefinedTaskDatasets['t1'];
  }
  if (taskId === '2') {
    return predefinedTaskDatasets['p2'] || predefinedTaskDatasets['t2'];
  }

  if (predefinedTaskDatasets[taskId]) {
    return predefinedTaskDatasets[taskId];
  }

  return generateDefaultTaskDataset(taskId, fallbackName || `任务 ${taskId}`);
}
