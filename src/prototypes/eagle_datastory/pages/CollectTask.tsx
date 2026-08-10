/**
 * @name 采集任务管理 (CollectTask)
 * @description 纯页面组件 - 仅包含内容区域逻辑
 *
 * 从 collect-task/index.tsx 迁移而来，移除了：
 * - 侧边栏 (ly-sidebar)
 * - 顶部栏 (ly-header)
 * - 外层布局 (ly-layout, ly-main)
 * - ConfigProvider 包裹
 * - collapsed 状态
 * - forwardRef / useImperativeHandle / AxureHandle
 */

import '../style.css';
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Tag, Switch, Button, Select, Input, Space, Tooltip, Popconfirm, message, Descriptions, Card, Drawer, Empty, Badge, Popover, InputNumber, Slider, notification } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  BellOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CollectTaskDrawer from '../components/CollectTaskDrawer';

// ============ 类型定义 ============

type TaskType = 'interaction' | 'comment';
type ScopeType = 'topic' | 'source' | 'other';
type TaskStatus = 'active' | 'inactive';

type InteractionData = {
  likes: number;
  favorites: number;
  reposts: number;
  comments: number;
};

type TaskItem = {
  id: string;
  task_name: string;
  task_type: TaskType;
  scope_type: ScopeType;
  platforms: string[];
  frequency: string;
  frequency_mode: string;
  frequency_value: string;
  track_days: number;
  total_count: number;
  hourly_increment: number;
  status: TaskStatus;
  has_activated: boolean;
  last_updated: string;
  created_at: string;
  // 链接范围字段
  link?: string;
  title?: string;
  info_topic?: string;
  // 关联项
  related_topic?: string;
  related_source?: string;
  start_date?: string;
  end_date?: string;
  // 互动量更新 - 累计互动量
  interaction_total?: InteractionData;
  // 互动量更新 - 最近1次更新互动量
  interaction_last?: InteractionData;
  // 评论区采集 - 累计评论数
  comment_total?: number;
  // 评论区采集 - 最近1次采集评论数
  comment_last?: number;
};

type LinkCollectRecord = {
  id: string;
  link: string;
  platform: string;
  title: string;
  content: string; // 新增正文
  author: string;  // 新增作者
  last_collected_at: string;
  interaction_last: InteractionData;
  comment_last: number;
  total_collect_count: number; // 新增总采集次数
};

type InteractionHistoryRecord = {
  id: string;
  link: string; // 新增
  title: string; // 新增
  content: string; // 新增
  publish_time: string; // 新增发帖时间
  collected_at: string;
  likes: number;
  favorites: number;
  reposts: number;
  comments: number;
  total: number;
};

type CommentHistoryRecord = {
  id: string;
  user: string;
  platform: string;
  publish_time: string; // 新增发评时间
  collected_at: string;
  content: string;
};

// ============ 常量 ============

const PLATFORMS = ['小红书', '抖音', '小红书', '今日头条', '快手', 'B站', '知乎', '百度贴吧'];

const TOPIC_OPTIONS = [
  { value: 'liyutong', label: '李雨桐实名举报薛之谦重婚罪' },
  { value: 'topic_001', label: '汽车行业专题' },
  { value: 'topic_002', label: '消费专题调研' },
  { value: 'topic_003', label: '科技数码专题' },
  { value: 'topic_004', label: '食品安全专题' },
  { value: 'topic_005', label: '教育改革专题' },
];

const SOURCE_OPTIONS = [
  { value: 'src_001', label: '猫咪日常Bot' },
  { value: 'src_002', label: '科技前沿资讯' },
  { value: 'src_003', label: '央视新闻' },
  { value: 'src_004', label: '环球时报' },
  { value: 'src_005', label: '澎湃新闻' },
];

const TASK_NAMES = [
  '汽车行业重点源追踪', '消费专题调研', '小红书专项预警', '科技数码舆情监控',
  '食品安全热点追踪', '教育改革话题分析', '新能源行业监测', '房地产舆情预警',
  '医疗健康专题调研', '金融风险监控', '电商行业评论采集', '文旅产业追踪',
  '环保话题监测', '体育赛事舆情', '娱乐热点追踪', '政务公开信息采集',
  '军工国防舆情', '农业乡村振兴', '互联网科技追踪', '游戏行业评论采集',
  '母婴产品专题', '美妆护肤监测', '服装时尚追踪', '食品饮料行业',
  '物流快递监控', '航空出行预警', '酒店旅游监测', '教育培训评论',
  '新能源汽车追踪', '半导体芯片监测', '人工智能话题', '元宇宙舆情',
  '区块链行业追踪', '数字货币监控', '社交平台热点', '短视频内容分析',
];

function generateMockData(): TaskItem[] {
  const data: TaskItem[] = [];
  const types: TaskType[] = ['interaction', 'comment'];
  const scopes: ScopeType[] = ['topic', 'source', 'other'];
  const freqModes = ['hour', 'day', 'month'];
  const freqLabels: Record<string, string[]> = {
    hour: ['每1小时', '每2小时', '每3小时', '每4小时', '每6小时', '每8小时', '每12小时'],
    day: ['每天08:00', '每天10:00', '每天12:00'],
    month: ['每天09:00', '每天16:00', '每天10:00'],
  };
  const trackDaysMap: Record<string, number[]> = { hour: [1, 3, 5, 7], day: [3, 5, 7], month: [7] };

  for (let i = 0; i < 18; i++) {
    const taskType = types[i % 2];
    const scopeType = scopes[i % 3];
    const freqMode = freqModes[i % 3];
    const freqOptions = freqLabels[freqMode];
    const frequency = freqOptions[i % freqOptions.length];
    const trackDaysOptions = trackDaysMap[freqMode];
    const trackDays = trackDaysOptions[i % trackDaysOptions.length];

    const shuffled = [...PLATFORMS].sort(function () { return Math.random() - 0.5; });
    const platformCount = 1 + Math.floor(Math.random() * 3);
    const platforms = shuffled.slice(0, platformCount);

    const totalBase = Math.floor(Math.random() * 15000) + 500;
    const hourlyInc = Math.floor(Math.random() * 300) + 10;

    const baseDate = dayjs();
    const lastUpdated = baseDate.subtract(i * 30, 'minute').format('YYYY-MM-DD HH:mm');
    const nameSuffix = String(i + 1).padStart(3, '0');

    const task: TaskItem = {
      id: 'task_' + nameSuffix,
      task_name: TASK_NAMES[i % TASK_NAMES.length] + '_' + nameSuffix,
      task_type: taskType,
      scope_type: scopeType,
      platforms: platforms,
      frequency: frequency,
      frequency_mode: freqMode,
      frequency_value: frequency,
      track_days: trackDays,
      total_count: totalBase,
      hourly_increment: hourlyInc,
      status: i % 2 === 0 ? 'active' : 'inactive',
      has_activated: true, // 保持激活，使详情有数据呈现
      last_updated: lastUpdated,
      created_at: baseDate.subtract(i + 2, 'day').format('YYYY-MM-DD HH:mm'),
    };

    if (scopeType === 'topic') {
      task.related_topic = TOPIC_OPTIONS[i % TOPIC_OPTIONS.length].value;
    } else if (scopeType === 'source') {
      task.related_source = SOURCE_OPTIONS[i % SOURCE_OPTIONS.length].value;
    } else {
      task.link = 'https://example.com/post/item_' + (i + 1);
      task.title = '指定单链接分析数据_' + nameSuffix;
      task.info_topic = ['社会热点', '产品评测', '行业分析', '用户反馈', '政策解读'][i % 5];
    }

    data.push(task);
  }

  const indices = Array.from({ length: data.length }, (_, i) => i);
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
  }
  const activeIndices = new Set(indices.slice(0, 9));

  const list = data.map(function (t, i) {
    var isActive = activeIndices.has(i);
    if (t.task_type === 'interaction') {
      var totalLikes = Math.floor(Math.random() * 20000) + 1000;
      var totalFavorites = Math.floor(Math.random() * 5000) + 200;
      var totalReposts = Math.floor(Math.random() * 3000) + 100;
      var totalComments = Math.floor(Math.random() * 4000) + 100;
      var lastLikes = Math.floor(Math.random() * 200) + 10;
      var lastFavorites = Math.floor(Math.random() * 50) + 5;
      var lastReposts = Math.floor(Math.random() * 30) + 2;
      var lastComments = Math.floor(Math.random() * 40) + 2;
      return {
        ...t,
        total_count: totalLikes + totalFavorites + totalReposts + totalComments,
        hourly_increment: lastLikes + lastFavorites + lastReposts + lastComments,
        status: isActive ? 'active' as TaskStatus : 'inactive' as TaskStatus,
        has_activated: true,
        interaction_total: { likes: totalLikes, favorites: totalFavorites, reposts: totalReposts, comments: totalComments },
        interaction_last: { likes: lastLikes, favorites: lastFavorites, reposts: lastReposts, comments: lastComments },
      };
    } else {
      var cTotal = Math.floor(Math.random() * 12000) + 500;
      var cLast = Math.floor(Math.random() * 150) + 5;
      return {
        ...t,
        total_count: cTotal,
        hourly_increment: cLast,
        status: isActive ? 'active' as TaskStatus : 'inactive' as TaskStatus,
        has_activated: true,
        comment_total: cTotal,
        comment_last: cLast,
      };
    }
  });

  // 插入预置的已开启关联任务以进行闭环演示
  const demoTopicTask: TaskItem = {
    id: 'task_demo_topic',
    task_name: '李雨桐专题舆情深度监控',
    task_type: 'comment',
    scope_type: 'topic',
    platforms: ['微博', '今日头条', '抖音'],
    frequency: '每2小时',
    frequency_mode: 'hour',
    frequency_value: '2',
    track_days: 7,
    total_count: 1420,
    hourly_increment: 85,
    status: 'active',
    has_activated: true,
    last_updated: dayjs().subtract(10, 'minute').format('YYYY-MM-DD HH:mm'),
    created_at: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
    related_topic: 'liyutong',
    comment_total: 1420,
    comment_last: 85,
  };

  const demoSourceTask: TaskItem = {
    id: 'task_demo_source',
    task_name: '猫咪日常Bot重点源监测',
    task_type: 'interaction',
    scope_type: 'source',
    platforms: ['微博', '小红书'],
    frequency: '每1小时',
    frequency_mode: 'hour',
    frequency_value: '1',
    track_days: 3,
    total_count: 24500,
    hourly_increment: 1200,
    status: 'active',
    has_activated: true,
    last_updated: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm'),
    created_at: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm'),
    related_source: 'src_001',
    interaction_total: { likes: 18500, favorites: 3200, reposts: 1100, comments: 1700 },
    interaction_last: { likes: 950, favorites: 120, reposts: 50, comments: 80 },
  };

  return [demoTopicTask, demoSourceTask, ...list];
}

const MOCK_DATA = generateMockData();

// ============ 工具函数 ============

function formatCount(n: number): string {
  if (n >= 10000) {
    return (n / 10000).toFixed(1) + 'w';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  return String(n);
}

function formatIncrement(n: number): string {
  return '+' + formatCount(n);
}

function getTaskSeed(task: TaskItem): number {
  var matched = task.id.match(/\d+/);
  return matched ? parseInt(matched[0], 10) : 1;
}

function getTaskLinkRecords(task: TaskItem): LinkCollectRecord[] {
  var seed = getTaskSeed(task);
  var sourcePlatforms = task.platforms.length > 0 ? task.platforms : ['微博', '今日头条', '小红书'];
  
  // 无论是否启用，均统一生成 20 条模拟帖文数据
  return Array.from({ length: 20 }, function (_, index) {
    const platform = sourcePlatforms[index % sourcePlatforms.length];
    const base = seed * 13 + index * 7;
    
    // 随机决定该帖文的历史采集次数 (5 ~ 10次)
    const collectCount = (base % 6) + 5; 
    
    var title = '';
    var content = '';
    var author = '';
    var link = '';

    if (task.scope_type === 'topic') {
      const topicsTitles = [
        '李雨桐爆料内容引起广泛社会反响',
        '多方曝光谢娜张杰买房风波，真相究竟如何？',
        '薛之谦巡回演唱会南京站万人大合唱，粉丝泪目',
        '舆情热点解析：明星重婚指控法律层面的界定',
        '自媒体对明星私生活报道的边界在哪里？',
        '粉丝群体在明星公关事件中的表现与引导',
        '社交平台上明星人设崩塌的传播链条分析',
        '法律专家谈明星买房“跳单”是否构成违法',
        '演唱会现场的互动体验如何转化为二次传播热度',
        '八卦爆料与严肃新闻的受众群体对比研究',
        '明星工作室深夜发声起诉，法务公关成标配',
        '关于网络吃瓜群众心理学的趣味剖析',
        '微博热搜榜在此次明星公关事件中的数据演变',
        '抖音爆款音乐视频：全场万人合唱《绅士》幕后',
        '今日头条独家报道：知情人还原薛之谦李雨桐纠葛',
        '明星口碑度下滑对代言品牌商造成的负面损失评估',
        '饭圈文化中“做数据”与“洗白”的套路解析',
        '朝阳群众立功？扒一扒娱乐圈那些实名举报的始末',
        '如何理性吃瓜：在海量营销号带节奏中保持独立思考',
        '薛之谦新歌发布，乐评人如何看待其艺术生命力？'
      ];
      title = topicsTitles[index] || ('专题监测帖文明细标题_' + (index + 1));
      author = ['用心生活', '用户8405496717', '恬情', '娱乐掌门人', '法治在线', '吃瓜群众小李', '音乐前沿', '头条娱记', '圈内老鬼', '乐评人阿强'][index % 10];
      link = 'https://' + (platform === '微博' ? 'weibo.com' : platform === '今日头条' ? 'toutiao.com' : 'douyin.com') + '/post/' + (seed + index * 99);
      content = '针对此专题下发酵的文章，这是第 ' + (index + 1) + ' 篇被纳入监控的帖文。正文围绕明星买房跳单、实名举报、公关辟谣等多个维度展开，引发了全网热烈的跟帖和讨论。';
    } else if (task.scope_type === 'source') {
      const sourceTitles = [
        '今天分享一组超可爱的布偶猫照片！🐱 这只小布偶叫"棉花糖"',
        '【猫咪养护小贴士】夏天到了，猫咪的饮水量需要特别注意！',
        '动物救助了一只被遗弃在路边的橘猫幼崽，目前已经送医',
        '猫咪发出咕噜咕噜声，其实有这几种不同的含义',
        '如何挑选适合自己家主子的猫粮？看完这篇不再纠结',
        '自制猫饭教程：鸡胸肉+蛋黄+三文鱼，营养又美味',
        '多猫家庭如何做好猫砂盆的摆放与清洁工作？',
        '新手养猫必备清单，这十样东西买错就是交学费',
        '科普：猫咪真的能听懂人说话吗？科学家这样说',
        '搞笑瞬间：我们家猫为了抓苍蝇竟然学会了“飞檐走壁”',
        '猫咪定期驱虫的重要性，不要等发现寄生虫才后悔',
        '如何纠正猫咪半夜蹦迪、挠门、抓人的坏习惯？',
        '猫草和猫薄荷有什么区别？主子更喜欢哪一个？',
        '带猫咪去宠物医院体检的流程与注意事项',
        '猫咪社交：如何让新猫与原住民和平相处？',
        '猫咪的这五个身体语言，说明它非常信任你',
        '关于猫咪肥胖的危害：关爱主子，从控制体重开始',
        '云吸猫福利：来看这只网红折耳猫的日常治愈瞬间',
        '领养代替购买，给流浪动物一个温暖的家',
        '猫咪掉毛季来袭！这几款除毛神器你绝对用得上'
      ];
      title = sourceTitles[index] || ('重点源发文监控_' + (index + 1));
      author = task.task_name.includes('猫咪') ? '猫咪日常Bot' : '重点信源账号_01';
      link = 'https://twitter.com/cat_daily_bot/status/' + (seed + index * 123);
      content = '本篇微博/小红书帖子详细论述了宠物猫的行为特征与夏日防暑常识。该账号拥有超过百万级的粉丝，其发表的内容会在短时间内触发大量的互动和转发，故将其作为重点监控对象进行追踪。';
    } else {
      title = '单链接审计：目标网帖追踪分析 #' + (index + 1);
      author = '指定博主_' + String(index + 1).padStart(2, '0');
      link = task.link ? task.link + '?index=' + (index + 1) : 'https://example.com/post/' + seed + '-' + (index + 1);
      content = '对指定 URL 进行定向增量跟踪，系统会针对此页面上的互动数值、回复评论内容等进行精准抓取，提供完整的链条审计。';
    }

    const pagesSetting = (task.platform_pages && task.platform_pages[platform]) || '1';
    let commentBase = 20;
    if (pagesSetting === '5') commentBase = 100;
    else if (pagesSetting === '10') commentBase = 200;
    else if (pagesSetting === 'max') commentBase = 800;

    const commentLast = commentBase + (base % (Math.floor(commentBase * 0.1) + 2));

    return {
      id: task.id + '_link_' + (index + 1),
      link: link,
      platform: platform,
      author: author,
      title: title,
      content: content,
      last_collected_at: dayjs(task.last_updated).subtract(index * 40, 'minute').format('YYYY-MM-DD HH:mm'),
      interaction_last: {
        likes: base * 7 + 100,
        favorites: base * 2 + 30,
        reposts: base + 10,
        comments: base * 3 + 20,
      },
      comment_last: commentLast,
      total_collect_count: collectCount,
    };
  });
}

function getInteractionHistory(record: LinkCollectRecord): InteractionHistoryRecord[] {
  var seed = parseInt(record.id.replace(/\D/g, '').slice(-4), 10) || 1;
  const count = record.total_collect_count || 6;
  
  return Array.from({ length: count }, function (_, index) {
    var ratio = count - index;
    var likes = Math.max(10, record.interaction_last.likes - ratio * (seed % 15 + 8));
    var favorites = Math.max(5, record.interaction_last.favorites - ratio * (seed % 7 + 3));
    var reposts = Math.max(2, record.interaction_last.reposts - ratio * (seed % 5 + 1));
    var comments = Math.max(5, record.interaction_last.comments - ratio * (seed % 9 + 4));

    return {
      id: record.id + '_history_' + index,
      link: record.link,
      title: record.title,
      content: record.content,
      publish_time: dayjs(record.last_collected_at).subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
      collected_at: dayjs(record.last_collected_at).subtract(index * 4, 'hour').format('YYYY-MM-DD HH:mm'),
      likes: likes,
      favorites: favorites,
      reposts: reposts,
      comments: comments,
      total: likes + favorites + reposts + comments,
    };
  });
}

function getCommentHistory(record: LinkCollectRecord): CommentHistoryRecord[] {
  const count = record.total_collect_count || 6;
  const commentsPool = [
    '写的太好了，学到了很多实用的养猫知识，已一键三连！',
    '这个说明逻辑很清晰，但买房跳单这事觉得还需要观望下后续回应。',
    '支持博主！现在的自媒体造谣成本太低了，必须重拳出击。',
    '真的吗？我总觉得有些细节有点夸大其词，持保留态度。',
    '我家主子也是这样的，原来咕噜咕噜还有这个意思，长见识了！',
    '请问有推荐的猫咪驱虫药牌子吗？国产的还是进口的好？',
    '每次看演唱会万人合唱都起一身鸡皮疙瘩，薛之谦现场真的牛。',
    '希望能多科普一些关于动物救助的知识，领养代替购买。',
    '自媒体整天带节奏太烦了，支持依法维权，净化网络空间。',
    '猫草确实好用，我们家猫定期吃，毛球症好多了，安利大家。',
    '评论区人才多，吃瓜也要理性，等一个法院最终的判决。',
    '看完默默抱紧了我们家的小橘，真的要好好爱护它们一辈子。'
  ];

  return Array.from({ length: count }, function (_, index) {
    const commentText = commentsPool[(index + record.title.length) % commentsPool.length];
    return {
      id: record.id + '_comment_' + index,
      user: '用户_' + record.platform + '_' + String(index + 1).padStart(2, '0'),
      platform: record.platform,
      publish_time: dayjs(record.last_collected_at).subtract(index * 35 + 10, 'minute').format('YYYY-MM-DD HH:mm'),
      collected_at: dayjs(record.last_collected_at).subtract(index * 30, 'minute').format('YYYY-MM-DD HH:mm'),
      content: commentText,
    };
  });
}

function formatInteractionSummary(data: InteractionData): string {
  return '赞 ' + formatCount(data.likes) + ' / 藏 ' + formatCount(data.favorites) + ' / 转 ' + formatCount(data.reposts) + ' / 评 ' + formatCount(data.comments);
}

// ============ 列表页 ============

const TaskListView: React.FC<{
  tasks: TaskItem[];
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (task: TaskItem) => void;
  onView: (task: TaskItem) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  alertThreshold: number;
  setAlertThreshold: (v: number) => void;
  alertTasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}> = function ({ tasks, onToggle, onEdit, onView, onCreate, onDelete, alertThreshold, setAlertThreshold, alertTasks, setTasks }) {
  const [searchText, setSearchText] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterScope, setFilterScope] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleReset = useCallback(function () {
    setSearchText('');
    setFilterType('');
    setFilterScope('');
    setFilterStatus('');
    setFilterPlatforms([]);
  }, []);

  const filteredData = useMemo(function () {
    let result = [...tasks];
    if (searchText) result = result.filter(function (t) { return t.task_name.includes(searchText); });
    if (filterType) result = result.filter(function (t) { return t.task_type === filterType; });
    if (filterScope) result = result.filter(function (t) { return t.scope_type === filterScope; });
    if (filterStatus) result = result.filter(function (t) { return t.status === filterStatus; });
    if (filterPlatforms.length > 0) result = result.filter(function (t) { return t.platforms.some(function (p) { return filterPlatforms.includes(p); }); });
    if (sortOrder === 'ascend') result.sort(function (a, b) { return a.last_updated.localeCompare(b.last_updated); });
    if (sortOrder === 'descend') result.sort(function (a, b) { return b.last_updated.localeCompare(a.last_updated); });
    return result;
  }, [tasks, searchText, filterType, filterScope, filterStatus, filterPlatforms, sortOrder]);

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'task_name',
      key: 'task_name',
      width: 220,
      ellipsis: true,
      render: function (name: string) {
        if (name.includes('娱乐热点追踪_015') || name.includes('农业乡村振兴_018') || (name.includes('娱乐热点追踪') && name.includes('015')) || (name.includes('农业乡村振兴') && name.includes('018'))) {
          return (
            <span style={{ backgroundColor: '#fff566', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', color: 'rgba(0,0,0,0.85)' }}>
              {name}
            </span>
          );
        }
        return name;
      },
    },
    {
      title: '类型',
      dataIndex: 'task_type',
      key: 'task_type',
      width: 110,
      render: function (val: TaskType) {
        return val === 'interaction' ? <Tag color="blue">互动量更新</Tag> : <Tag color="purple">评论区采集</Tag>;
      },
    },
    {
      title: '范围',
      dataIndex: 'scope_type',
      key: 'scope_type',
      width: 100,
      render: function (val: ScopeType) {
        const map: Record<string, { text: string; color: string }> = {
          topic: { text: '专题', color: 'cyan' },
          source: { text: '重点源', color: 'geekblue' },
          other: { text: '链接', color: 'default' },
        };
        const item = map[val] || map.other;
        return <Tag color={item.color} className="qf-tag-fixed">{item.text}</Tag>;
      },
    },
    {
      title: '采集来源',
      dataIndex: 'platforms',
      key: 'platforms',
      width: 200,
      render: function (platforms: string[]) {
        return (
          <Space size={[0, 4]} wrap>
            {platforms.slice(0, 3).map(function (p) {
              return <Tag key={p} style={{ margin: 0 }}>{p}</Tag>;
            })}
            {platforms.length > 3 && <Tag style={{ margin: 0 }}>+{platforms.length - 3}</Tag>}
          </Space>
        );
      },
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 110,
    },
    {
      title: '追踪',
      dataIndex: 'track_days',
      key: 'track_days',
      width: 80,
      render: function (val: number) {
        return 'T+' + val;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: function (val: TaskStatus, record: TaskItem) {
        return (
          <Switch
            size="small"
            checked={val === 'active'}
            onChange={function (checked) { onToggle(record.id, checked); }}
          />
        );
      },
    },
    {
      title: '最近更新',
      dataIndex: 'last_updated',
      key: 'last_updated',
      width: 150,
      sorter: true,
      sortOrder: sortOrder as any,
      render: function (val: string) {
        return <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)' }}>{val}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: function (_: any, record: TaskItem) {
        return (
          <Space size={16}>
            <a className="ct-action-link" onClick={function () { onEdit(record); }}>修改</a>
            <a className="ct-action-link" onClick={function () { onView(record); }}>详情</a>
            <Popconfirm
              title="删除提示"
              description="如需停止采集，建议关闭任务，已采集到的数据在任务删除后将无法查看，请知悉。"
              placement="bottom"
              onConfirm={function () { onDelete(record.id); }}
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              icon={null}
            >
              <a className="ct-action-delete">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="ct-list-view">
      {/* 筛选区 */}
      <div className="ct-filter-bar">
        <div className="ct-filter-left">
          <Input
            placeholder="搜索任务名称"
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
            allowClear
            style={{ width: 220 }}
            size="middle"
            value={searchText}
            onChange={function (e) { setSearchText(e.target.value); }}
          />
          <Select
            placeholder="任务类型"
            allowClear
            style={{ width: 150 }}
            size="middle"
            value={filterType || undefined}
            onChange={function (v) { setFilterType(v || ''); }}
            options={[
              { value: 'interaction', label: '互动量更新' },
              { value: 'comment', label: '评论区采集' },
            ]}
          />
          <Select
            placeholder="范围"
            allowClear
            style={{ width: 120 }}
            size="middle"
            value={filterScope || undefined}
            onChange={function (v) { setFilterScope(v || ''); }}
            options={[
              { value: 'topic', label: '专题' },
              { value: 'source', label: '重点源' },
              { value: 'other', label: '链接' },
            ]}
          />
          <Select
            mode="multiple"
            placeholder="采集来源"
            allowClear
            style={{ width: 220 }}
            size="middle"
            maxTagCount="responsive"
            value={filterPlatforms.length > 0 ? filterPlatforms : undefined}
            onChange={function (v) { setFilterPlatforms(v); }}
            options={[
              { value: '小红书', label: '小红书' },
              { value: '抖音', label: '抖音' },
              { value: '微博', label: '微博' },
              { value: '今日头条', label: '今日头条' },
              { value: '百度贴吧', label: '百度贴吧' },
              { value: '知乎', label: '知乎' },
            ]}
          />
          <Select
            placeholder="任务状态"
            allowClear
            style={{ width: 120 }}
            size="middle"
            value={filterStatus || undefined}
            onChange={function (v) { setFilterStatus(v || ''); }}
            options={[
              { value: 'active', label: '开启' },
              { value: 'inactive', label: '关闭' },
            ]}
          />
          <Button size="middle" onClick={handleReset}>重置</Button>
        </div>
        <Space size={16}>
          <Popover
            content={
              <div style={{ width: 320 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>预警配置中心</strong>
                  <Tag color="red">额度低预警</Tag>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>低于阈值提醒用户：</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Slider
                      min={5}
                      max={50}
                      value={alertThreshold}
                      onChange={setAlertThreshold}
                      style={{ flex: 1, margin: '0 8px' }}
                    />
                    <InputNumber
                      min={5}
                      max={50}
                      formatter={function (v) { return v + '%'; }}
                      parser={function (v) { return v ? parseInt(v.replace('%', ''), 10) : 20; }}
                      value={alertThreshold}
                      onChange={function (v) { setAlertThreshold(v || 20); }}
                      style={{ width: 75 }}
                      size="small"
                    />
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>异常任务 ({alertTasks.length})</span>
                    {alertTasks.length > 0 && <span style={{ color: '#ff4d4f', fontSize: 12 }}>任务采集额度较低，请及时添加</span>}
                  </div>
                  {alertTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>暂无低额度运行中任务</div>
                  ) : (
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                      {alertTasks.map(function (t) {
                        const limit = 5000;
                        const current = t.task_type === 'comment' ? (t.comment_total || t.total_count) : t.total_count;
                        const leftRatio = Math.max(0, Math.floor(((limit - current) / limit) * 100));
                        return (
                          <div key={t.id} style={{ padding: '8px', background: '#fff1f0', borderRadius: 4, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1, marginRight: 8 }}>
                              <div style={{ fontWeight: 'bold', fontSize: 12, color: '#cf1322', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }} title={t.task_name}>{t.task_name}</div>
                              <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.65)' }}>当前可用额度仅剩 {leftRatio}%</div>
                            </div>
                            <Button
                              type="primary"
                              danger
                              size="small"
                              onClick={function () {
                                setTasks(function (prev) {
                                  return prev.map(function (item) {
                                    if (item.id === t.id) {
                                      return {
                                        ...item,
                                        comment_total: 100,
                                        total_count: 100,
                                      };
                                    }
                                    return item;
                                  });
                                });
                                message.success('任务【' + t.task_name + '】已成功添加采集额度！');
                              }}
                              style={{ fontSize: 11, height: 22, padding: '0 8px' }}
                            >
                              一键扩容
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            }
            title={null}
            trigger="click"
            placement="bottomRight"
          >
            <Badge count={alertTasks.length} size="small" style={{ boxShadow: 'none' }}>
              <Button
                shape="circle"
                icon={<BellOutlined />}
                size="middle"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
              />
            </Badge>
          </Popover>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            新建任务
          </Button>
        </Space>
      </div>

      {/* 表格 */}
      <div className="table-page-table">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: false, showTotal: function (total) { return '共 ' + total + ' 条'; } }}
          size="middle"
          scroll={{ x: 1210, y: 'calc(100vh - 280px)' }}
          onChange={function (_pagination, _filters, sorter: any) {
            setSortOrder(sorter?.columnKey === 'last_updated' ? (sorter.order || '') : '');
          }}
        />
      </div>
    </div>
  );
};

// ============ 任务详情页 ============

const TaskDetailView: React.FC<{
  task: TaskItem;
  onBack: () => void;
}> = function ({ task, onBack }) {
  const isOtherScope = task.scope_type === 'other';
  const linkRecords = useMemo(function () {
    return isOtherScope ? getTaskLinkRecords(task) : [];
  }, [isOtherScope, task]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkCollectRecord | null>(null);

  const openLinkDetail = useCallback(function (record: LinkCollectRecord) {
    setSelectedLink(record);
    setDrawerOpen(true);
  }, []);

  const closeLinkDetail = useCallback(function () {
    setDrawerOpen(false);
    setSelectedLink(null);
  }, []);

  const linkColumns = [
    {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      width: 90,
      render: function (link: string) {
        return <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 500 }}>查看网帖 →</a>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 130,
      ellipsis: true,
    },
    {
      title: '正文',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      ellipsis: true,
    },
    {
      title: '信源',
      dataIndex: 'platform',
      key: 'platform',
      width: 70,
      render: function (platform: string) {
        return <Tag color="blue" style={{ margin: 0 }}>{platform}</Tag>;
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 90,
      ellipsis: true,
    },
    {
      title: '最新采集时间',
      dataIndex: 'last_collected_at',
      key: 'last_collected_at',
      width: 140,
    },
    {
      title: task.task_type === 'interaction' ? '最新互动量' : '采集评论数量',
      key: 'latest_value',
      width: 160,
      render: function (_: any, record: LinkCollectRecord) {
        return task.task_type === 'interaction'
          ? <span className="ct-link-stat" style={{ fontSize: 12 }}>{formatInteractionSummary(record.interaction_last)}</span>
          : <span className="ct-link-stat" style={{ fontSize: 12 }}>{formatCount(record.comment_last)} 条</span>;
      },
    },
    {
      title: '总采集次数',
      dataIndex: 'total_collect_count',
      key: 'total_collect_count',
      width: 90,
      render: function (v: number) {
        return <span>{v || 5} 次</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: function (_: any, record: LinkCollectRecord) {
        return <a className="ct-action-link" onClick={function () { openLinkDetail(record); }}>详情</a>;
      },
    },
  ];

  const interactionHistoryColumns = [
    {
      title: '发帖时间',
      dataIndex: 'publish_time',
      key: 'publish_time',
      width: 140,
    },
    {
      title: '采集互动量',
      key: 'interaction',
      width: 320,
      render: function (_: any, record: InteractionHistoryRecord) {
        return (
          <span style={{ fontSize: 13 }}>
            赞: <strong>{formatCount(record.likes)}</strong> | 
            藏: <strong>{formatCount(record.favorites)}</strong> | 
            转: <strong>{formatCount(record.reposts)}</strong> | 
            评: <strong>{formatCount(record.comments)}</strong>
          </span>
        );
      },
    },
    {
      title: '采集时间',
      dataIndex: 'collected_at',
      key: 'collected_at',
      width: 140,
    },
  ];

  const commentHistoryColumns = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 260,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'publish_time',
      key: 'publish_time',
      width: 140,
    },
    {
      title: '采集时间',
      dataIndex: 'collected_at',
      key: 'collected_at',
      width: 140,
    },
  ];

  return (
    <div className="ct-detail-view">
      <div className="ct-form-header">
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack}>返回列表</Button>
        <h2 className="ct-form-title">任务详情</h2>
      </div>

      {/* 任务概况 */}
      <Card className="ct-detail-card" title="任务概况" size="small">
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="任务名称">{task.task_name}</Descriptions.Item>
          <Descriptions.Item label="采集类型">
            {task.task_type === 'interaction' ? <Tag color="blue">互动量更新</Tag> : <Tag color="purple">评论区采集</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="采集范围">
            <Tag color={task.scope_type === 'topic' ? 'cyan' : task.scope_type === 'source' ? 'geekblue' : 'default'}>
              {task.scope_type === 'topic' ? '全网专题' : task.scope_type === 'source' ? '重点源' : '链接'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="采集来源">
            {task.platforms.map(function (p) { return <Tag key={p}>{p}</Tag>; })}
          </Descriptions.Item>
          <Descriptions.Item label="更新频率">{task.frequency}</Descriptions.Item>
          <Descriptions.Item label="追踪天数">T+{task.track_days}</Descriptions.Item>
          <Descriptions.Item label="累计总量" span={task.task_type === 'interaction' ? 2 : 1}>
            {task.task_type === 'interaction' ? (
              task.interaction_total
                ? '赞：' + formatCount(task.interaction_total.likes) + '、藏：' + formatCount(task.interaction_total.favorites) + '、转：' + formatCount(task.interaction_total.reposts) + '、评：' + formatCount(task.interaction_total.comments)
                : '暂无数据'
            ) : (
              formatCount(task.comment_total || 0)
            )}
          </Descriptions.Item>
          {task.task_type === 'comment' && (
            <Descriptions.Item label="最近1次增量">
              {formatCount(task.comment_last || 0)}
            </Descriptions.Item>
          )}
          {task.task_type === 'interaction' && (
            <Descriptions.Item label="最近1次增量" span={2}>
              {task.interaction_last
                ? '赞：' + formatCount(task.interaction_last.likes) + '、藏：' + formatCount(task.interaction_last.favorites) + '、转：' + formatCount(task.interaction_last.reposts) + '、评：' + formatCount(task.interaction_last.comments)
                : '暂无数据'}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="状态">
            <Tag color={task.status === 'active' ? 'success' : 'default'}>{task.status === 'active' ? '开启' : '关闭'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="最近更新">{task.last_updated}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.created_at}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 采集详情 */}
      <Card className="ct-detail-card" title="采集详情" size="small" style={{ marginTop: 16 }}>
        {linkRecords.length === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center' }}>
            <Empty
              description={
                <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                  该任务尚未开启或尚未产生任何采集流水数据。<br />
                  请返回任务列表，开启该采集任务后即可追踪帖文详情。
                </span>
              }
            />
          </div>
        ) : (
          <>
            {task.task_type === 'interaction' ? (
              <div className="ct-detail-content">
                <div className="ct-link-list-header">
                  <div>
                    <h4><BarChartOutlined style={{ marginRight: 6 }} />链接互动量采集结果</h4>
                    <p>按链接/帖文拆分展示最新一次采集结果，点击详情查看该链接的互动量变动统计。</p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={linkColumns}
                  dataSource={linkRecords}
                  pagination={false}
                  size="small"
                />
              </div>
            ) : (
              <div className="ct-detail-content">
                <div className="ct-link-list-header">
                  <div>
                    <h4><UnorderedListOutlined style={{ marginRight: 6 }} />链接评论采集结果</h4>
                    <p>按链接/帖文拆分展示最新一次有效评论数量，点击详情查看该链接从最新到最早的评论内容。</p>
                  </div>
                </div>
                <Table
                  rowKey="id"
                  columns={linkColumns}
                  dataSource={linkRecords}
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </>
        )}
      </Card>

      <Drawer
        title={task.task_type === 'interaction' ? '互动量历史采集明细' : '评论采集明细'}
        placement="right"
        width={850}
        open={drawerOpen}
        onClose={closeLinkDetail}
        className="ct-link-detail-drawer"
        destroyOnClose
      >
        {selectedLink && (
          <div className="ct-link-drawer-content">
            <div className="ct-link-drawer-summary" style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #f0f0f0' }}>
              <div className="ct-link-title" style={{ fontSize: 16, fontWeight: 'bold', color: 'rgba(0,0,0,0.85)', marginBottom: 8 }}>{selectedLink.title}</div>
              <div className="ct-link-url" style={{ fontSize: 13, color: '#1890ff', wordBreak: 'break-all', marginBottom: 8 }}>{selectedLink.link}</div>
              <Space size={8} wrap>
                <Tag color="blue">{selectedLink.platform}</Tag>
                <Tag color="orange">作者：{selectedLink.author}</Tag>
                <Tag>最新采集时间：{selectedLink.last_collected_at}</Tag>
              </Space>
            </div>

            {task.task_type === 'interaction' ? (
              <Table
                rowKey="id"
                columns={interactionHistoryColumns}
                dataSource={getInteractionHistory(selectedLink)}
                pagination={false}
                size="small"
              />
            ) : (
              <Table
                rowKey="id"
                columns={commentHistoryColumns}
                dataSource={getCommentHistory(selectedLink)}
                pagination={false}
                size="small"
              />
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

// ============ 主组件 ============

type ViewType = 'list' | 'detail';

const CollectTask: React.FC = function () {
  const DATA_VERSION = 'v2026_08_10_02';

  // 列表/详情视图切换
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const cachedVersion = localStorage.getItem('eagle_collect_tasks_version');
    const local = localStorage.getItem('eagle_collect_tasks');
    
    if (cachedVersion === DATA_VERSION && local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    // 版本不符合或无缓存，强制重刷并存入当前版本号
    localStorage.setItem('eagle_collect_tasks_version', DATA_VERSION);
    localStorage.setItem('eagle_collect_tasks', JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  });

  // 同步状态到 localStorage
  React.useEffect(() => {
    localStorage.setItem('eagle_collect_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 预警百分比，默认 20%
  const [alertThreshold, setAlertThreshold] = useState(20);

  // 预警判定助手
  const getAlertTasks = useCallback(function (taskList: TaskItem[], threshold: number) {
    return taskList.filter(function (t) {
      if (t.status !== 'active') return false;
      const limit = 5000;
      const current = t.task_type === 'comment' ? (t.comment_total || t.total_count) : t.total_count;
      const leftRatio = (limit - current) / limit;
      return leftRatio * 100 < threshold;
    });
  }, []);

  const alertTasks = useMemo(function () {
    return getAlertTasks(tasks, alertThreshold);
  }, [tasks, alertThreshold, getAlertTasks]);

  // 模拟登录时对用户进行全局预警提醒
  React.useEffect(function () {
    const lowQuotaTasks = getAlertTasks(tasks, alertThreshold);
    if (lowQuotaTasks.length > 0) {
      notification.warning({
        message: '采集额度预警',
        description: '任务采集额度较低，请及时添加',
        duration: 5,
        placement: 'topRight',
      });
    }
  }, []); // 仅在挂载时运行一次，代表登录提醒

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Drawer 状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editData, setEditData] = useState<TaskItem | null>(null);
  const [drawerInitialValues, setDrawerInitialValues] = useState<any>(null);

  // ============ 列表操作 ============

  const handleToggle = useCallback(function (id: string, checked: boolean) {
    setTasks(function (prev) {
      return prev.map(function (t) {
        if (t.id === id) {
          if (checked) {
            // 开启任务：生成模拟数据
            message.success('任务已开启');
            if (t.task_type === 'interaction') {
              var totalLikes = Math.floor(Math.random() * 50000) + 1000;
              var totalFavorites = Math.floor(Math.random() * 10000) + 200;
              var totalReposts = Math.floor(Math.random() * 5000) + 100;
              var totalComments = Math.floor(Math.random() * 8000) + 50;
              var lastLikes = Math.floor(Math.random() * totalLikes * 0.15) + 10;
              var lastFavorites = Math.floor(Math.random() * totalFavorites * 0.15) + 5;
              var lastReposts = Math.floor(Math.random() * totalReposts * 0.15) + 2;
              var lastComments = Math.floor(Math.random() * totalComments * 0.15) + 1;
              return {
                ...t,
                status: 'active' as TaskStatus,
                has_activated: true,
                total_count: totalLikes + totalFavorites + totalReposts + totalComments,
                hourly_increment: lastLikes + lastFavorites + lastReposts + lastComments,
                interaction_total: { likes: totalLikes, favorites: totalFavorites, reposts: totalReposts, comments: totalComments },
                interaction_last: { likes: lastLikes, favorites: lastFavorites, reposts: lastReposts, comments: lastComments },
              };
            } else {
              let commentBase = 20;
              if (t.platform_pages) {
                var pages = Object.values(t.platform_pages);
                if (pages.includes('max')) commentBase = 800;
                else if (pages.includes('10')) commentBase = 200;
                else if (pages.includes('5')) commentBase = 100;
              }
              var multiplier = t.scope_type === 'other' ? 20 : 15;
              var cTotal = commentBase * multiplier + (Math.floor(Math.random() * 100) + 10);
              var cLast = Math.floor(commentBase * 0.15) + 5;
              return {
                ...t,
                status: 'active' as TaskStatus,
                has_activated: true,
                total_count: cTotal,
                hourly_increment: cLast,
                comment_total: cTotal,
                comment_last: cLast,
              };
            }
          } else {
            // 关闭任务：清空数据
            message.success('任务已关闭');
            return {
              ...t,
              status: 'inactive' as TaskStatus,
              total_count: 0,
              hourly_increment: 0,
              interaction_total: undefined,
              interaction_last: undefined,
              comment_total: undefined,
              comment_last: undefined,
            };
          }
        }
        return t;
      });
    });
  }, []);

  const handleEdit = useCallback(function (task: TaskItem) {
    setEditData(task);
    setDrawerInitialValues(null);
    setDrawerVisible(true);
  }, []);

  const handleView = useCallback(function (task: TaskItem) {
    setSelectedTask(task);
    setCurrentView('detail');
  }, []);

  const handleCreate = useCallback(function () {
    setEditData(null);
    setDrawerInitialValues(null);
    setDrawerVisible(true);
  }, []);

  const handleDelete = useCallback(function (id: string) {
    setTasks(function (prev) { return prev.filter(function (t) { return t.id !== id; }); });
    message.success('任务已删除');
  }, []);

  const handleDetailBack = useCallback(function () {
    setCurrentView('list');
  }, []);

  // ============ 渲染 ============

  return (
    <div className="ct-page-container">
      {currentView === 'list' ? (
        <TaskListView
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onView={handleView}
          onCreate={handleCreate}
          onDelete={handleDelete}
          alertThreshold={alertThreshold}
          setAlertThreshold={setAlertThreshold}
          alertTasks={alertTasks}
          setTasks={setTasks}
        />
      ) : (
        selectedTask ? <TaskDetailView task={selectedTask} onBack={handleDetailBack} /> : null
      )}

      <CollectTaskDrawer
        open={drawerVisible}
        title={editData ? '修改采集任务' : '新建采集任务'}
        isEditMode={!!editData}
        onClose={function () { setDrawerVisible(false); setEditData(null); }}
        onSubmit={function (values) {
          // 刷新列表
          if (editData) {
            setTasks(function (prev) {
              return prev.map(function (t) {
                if (t.id === editData.id) {
                  return {
                    ...t,
                    ...values,
                    link: values.link_list?.[0]?.link || t.link,
                    title: values.link_list?.[0]?.title || t.title,
                    info_topic: values.link_list?.[0]?.topic || t.info_topic,
                    platform_pages: values.platform_pages || t.platform_pages,
                    has_activated: true
                  };
                }
                return t;
              });
            });
            message.success('任务修改成功');
          } else {
            const id = 'task_' + String(tasks.length + 1).padStart(3, '0');
            const newTask: TaskItem = {
              id: id,
              task_name: values.task_name,
              task_type: values.task_type,
              scope_type: values.scope_type,
              platforms: values.platforms || [],
              platform_pages: values.platform_pages,
              frequency: values.frequency || '每2小时',
              frequency_mode: values.frequency_mode || 'hour',
              frequency_value: values.frequency_value || '2',
              track_days: values.track_days || 7,
              total_count: 0,
              hourly_increment: 0,
              status: 'inactive',
              has_activated: false,
              last_updated: '-',
              created_at: dayjs().format('YYYY-MM-DD HH:mm'),
              related_topic: values.related_topic,
              related_source: values.related_source,
              link: values.link_list?.[0]?.link,
              title: values.link_list?.[0]?.title,
              info_topic: values.link_list?.[0]?.topic,
              start_date: values.start_date,
              end_date: values.end_date,
            };
            setTasks(function (prev) { return [newTask, ...prev]; });
            message.success('任务创建成功，请在列表中手动开启');
          }
          setDrawerVisible(false);
          setEditData(null);
        }}
        initialValues={editData ? {
          task_name: editData.task_name,
          scope_type: editData.scope_type,
          platforms: editData.platforms,
          link_list: editData.link ? [{ link: editData.link, title: editData.title || '', topic: editData.info_topic || '' }] : [],
          related_topic: editData.related_topic,
          related_source: editData.related_source,
          platform_pages: editData.platform_pages,
          start_date: editData.start_date,
          end_date: editData.end_date,
        } : drawerInitialValues || undefined}
      />
    </div>
  );
};

export default CollectTask;
