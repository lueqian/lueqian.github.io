import { MatchedAccount, ConflictItem, UnhitLinkItem, SourceDirectory } from './types';

// 28 条精准匹配账号（1:1）
export const MOCK_MATCHED_ACCOUNTS: MatchedAccount[] = [
  {
    id: 'm1',
    uid: 'ks_100182',
    name: '张三疯',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    avatarColor: '#f43f5e',
    avatarLetter: '张',
    platform: 'kuaishou',
    platformName: '快手app',
    platformColor: '#ff5000',
    verifyType: '自媒体',
    followersDisplay: '1105 W',
    followers: 11050000,
    originUrl: 'https://v.kuaishou.com/iJ89aKx',
    location: '贵州省毕节市',
    selected: true,
  },
  {
    id: 'm2',
    uid: 'dy_998214',
    name: '张三发',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
    avatarColor: '#06b6d4',
    avatarLetter: '发',
    platform: 'douyin',
    platformName: '抖音app',
    platformColor: '#161823',
    verifyType: '自媒体',
    followersDisplay: '987 W',
    followers: 9870000,
    originUrl: 'https://v.douyin.com/iJ2918x/',
    location: '贵州省贵阳市',
    selected: true,
  },
  {
    id: 'm3',
    uid: 'ks_882910',
    name: '张三嫂·体重管理',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    avatarColor: '#ec4899',
    avatarLetter: '嫂',
    platform: 'kuaishou',
    platformName: '快手app',
    platformColor: '#ff5000',
    verifyType: 'PGC',
    followersDisplay: '506 W',
    followers: 5060000,
    originUrl: 'https://v.kuaishou.com/zss88xlm',
    location: '山东省临沂市',
    selected: true,
  },
  {
    id: 'm4',
    uid: 'wb_330192',
    name: '科技前沿资讯',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face',
    avatarColor: '#3b82f6',
    avatarLetter: '科',
    platform: 'weibo',
    platformName: '微博',
    platformColor: '#e6162d',
    verifyType: 'PGC',
    followersDisplay: '187 W',
    followers: 1870000,
    originUrl: 'https://weibo.com/u/tech_frontier',
    location: '北京市海淀区',
    selected: true,
  },
  {
    id: 'm5',
    uid: 'xhs_992182',
    name: '猫咪日常Bot',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop&crop=face',
    avatarColor: '#f59e0b',
    avatarLetter: '猫',
    platform: 'xiaohongshu',
    platformName: '小红书',
    platformColor: '#ff2442',
    verifyType: '自媒体',
    followersDisplay: '234 W',
    followers: 2340000,
    originUrl: 'https://www.xiaohongshu.com/user/profile/cat_daily',
    location: '上海市徐汇区',
    selected: true,
  },
  {
    id: 'm6',
    uid: 'bili_448192',
    name: '数码观察哨',
    avatar: '',
    avatarColor: '#8b5cf6',
    avatarLetter: '数',
    platform: 'bilibili',
    platformName: '哔哩哔哩',
    platformColor: '#00a1d6',
    verifyType: '自媒体',
    followersDisplay: '165 W',
    followers: 1650000,
    originUrl: 'https://space.bilibili.com/44819200',
    location: '广东省深圳市',
    selected: true,
  },
  {
    id: 'm7',
    uid: 'dy_662194',
    name: '财经快评老周',
    avatar: '',
    avatarColor: '#10b981',
    avatarLetter: '财',
    platform: 'douyin',
    platformName: '抖音app',
    platformColor: '#161823',
    verifyType: 'PGC',
    followersDisplay: '312 W',
    followers: 3120000,
    originUrl: 'https://v.douyin.com/finance_laozhou/',
    location: '北京市西城区',
    selected: true,
  },
  {
    id: 'm8',
    uid: 'wb_771829',
    name: '全球热点速报',
    avatar: '',
    avatarColor: '#ef4444',
    avatarLetter: '全',
    platform: 'weibo',
    platformName: '微博',
    platformColor: '#e6162d',
    verifyType: '自媒体',
    followersDisplay: '450 W',
    followers: 4500000,
    originUrl: 'https://weibo.com/u/global_hot_news',
    location: '广东省广州市',
    selected: true,
  },
  {
    id: 'm9',
    uid: 'ks_338190',
    name: '乡村纪实阿强',
    avatar: '',
    avatarColor: '#84cc16',
    avatarLetter: '强',
    platform: 'kuaishou',
    platformName: '快手app',
    platformColor: '#ff5000',
    verifyType: 'UGC',
    followersDisplay: '210 W',
    followers: 2100000,
    originUrl: 'https://v.kuaishou.com/country_a_qiang',
    location: '四川省凉山州',
    selected: true,
  },
  {
    id: 'm10',
    uid: 'xhs_558190',
    name: '法治观察家',
    avatar: '',
    avatarColor: '#6366f1',
    avatarLetter: '法',
    platform: 'xiaohongshu',
    platformName: '小红书',
    platformColor: '#ff2442',
    verifyType: 'PGC',
    followersDisplay: '128 W',
    followers: 1280000,
    originUrl: 'https://www.xiaohongshu.com/user/profile/law_observer',
    location: '湖北省武汉市',
    selected: true,
  },
  {
    id: 'm11',
    uid: 'dy_773910',
    name: '军工科技研判',
    avatar: '',
    avatarColor: '#059669',
    avatarLetter: '军',
    platform: 'douyin',
    platformName: '抖音app',
    platformColor: '#161823',
    verifyType: '自媒体',
    followersDisplay: '280 W',
    followers: 2800000,
    originUrl: 'https://v.douyin.com/mil_tech_cn/',
    location: '陕西省西安市',
    selected: true,
  },
  {
    id: 'm12',
    uid: 'wb_119283',
    name: '民生调查笔记',
    avatar: '',
    avatarColor: '#d97706',
    avatarLetter: '民',
    platform: 'weibo',
    platformName: '微博',
    platformColor: '#e6162d',
    verifyType: '自媒体',
    followersDisplay: '192 W',
    followers: 1920000,
    originUrl: 'https://weibo.com/u/minsheng_investigate',
    location: '河南省郑州市',
    selected: true,
  },
  {
    id: 'm13',
    uid: 'bili_992104',
    name: '历史长镜头',
    avatar: '',
    avatarColor: '#7c3aed',
    avatarLetter: '历',
    platform: 'bilibili',
    platformName: '哔哩哔哩',
    platformColor: '#00a1d6',
    verifyType: 'PGC',
    followersDisplay: '154 W',
    followers: 1540000,
    originUrl: 'https://space.bilibili.com/99210400',
    location: '江苏省南京市',
    selected: true,
  },
  {
    id: 'm14',
    uid: 'dy_440192',
    name: 'AI时代探秘',
    avatar: '',
    avatarColor: '#2563eb',
    avatarLetter: '智',
    platform: 'douyin',
    platformName: '抖音app',
    platformColor: '#161823',
    verifyType: '自媒体',
    followersDisplay: '360 W',
    followers: 3600000,
    originUrl: 'https://v.douyin.com/ai_future_lab/',
    location: '浙江省杭州市',
    selected: true,
  },
  {
    id: 'm15',
    uid: 'xhs_110293',
    name: '城市治理研究员',
    avatar: '',
    avatarColor: '#0891b2',
    avatarLetter: '城',
    platform: 'xiaohongshu',
    platformName: '小红书',
    platformColor: '#ff2442',
    verifyType: '官方机构',
    followersDisplay: '89 W',
    followers: 890000,
    originUrl: 'https://www.xiaohongshu.com/user/profile/city_gov_study',
    location: '北京市东城区',
    selected: true,
  },
  // 额外13条生成丰富列表
  ...Array.from({ length: 13 }).map((_, index) => {
    const i = index + 16;
    const platforms: ('douyin' | 'kuaishou' | 'weibo' | 'xiaohongshu')[] = [
      'douyin',
      'kuaishou',
      'weibo',
      'xiaohongshu',
    ];
    const plat = platforms[index % platforms.length];
    const names = [
      '政务透明线',
      '网安反诈前沿',
      '国际视野观察',
      '深度调查员老李',
      '新锐评论周刊',
      '舆情情报站',
      '基层警事快讯',
      '民法典通识课',
      '辟谣雷达站',
      '应急救灾先锋',
      '网格化治理解析',
      '网络生态治理办',
      '社会热点透视镜',
    ];
    return {
      id: `m${i}`,
      uid: `${plat}_${100000 + i * 37}`,
      name: names[index] || `舆情信源号_${i}`,
      avatar: '',
      avatarColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][index % 5],
      avatarLetter: (names[index] || '信')[0],
      platform: plat,
      platformName:
        plat === 'douyin'
          ? '抖音app'
          : plat === 'kuaishou'
          ? '快手app'
          : plat === 'weibo'
          ? '微博'
          : '小红书',
      platformColor:
        plat === 'douyin'
          ? '#161823'
          : plat === 'kuaishou'
          ? '#ff5000'
          : plat === 'weibo'
          ? '#e6162d'
          : '#ff2442',
      verifyType: index % 3 === 0 ? 'PGC' : index % 3 === 1 ? '自媒体' : '官方机构',
      followersDisplay: `${(80 + i * 23).toFixed(0)} W`,
      followers: (80 + i * 23) * 10000,
      originUrl: `https://${plat}.com/user/profile_${i}`,
      location: ['北京市', '上海市', '广东省', '浙江省', '江苏省', '山东省'][index % 6],
      selected: true,
    };
  }),
];

// 2 个多实体冲突项（1:N）
export const MOCK_CONFLICT_ITEMS: ConflictItem[] = [
  {
    id: 'conf_1',
    originUrl: 'https://v.douyin.com/iJXXXXX/',
    reason: '该主页链接命中 2 个不同历史采集中收录的同名/改名快照实体',
    selectedOption: 'candidate_0', // 自动解析后默认选中第一个实体
    candidates: [
      {
        id: 'c1_a',
        uid: 'ks_zhangsf888',
        name: '张三疯',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        avatarColor: '#f43f5e',
        avatarLetter: '张',
        platform: 'kuaishou',
        platformName: '快手app',
        platformColor: '#ff5000',
        followersDisplay: '1105 W',
        indexedAt: '2024-11',
        description: '矩阵主号，主打短视频搞笑段子及生活带货。商:zhangsf818',
        isLatest: false,
      },
      {
        id: 'c1_b',
        uid: 'dy_zhangsf888',
        name: '张三发',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
        avatarColor: '#06b6d4',
        avatarLetter: '发',
        platform: 'douyin',
        platformName: '抖音app',
        platformColor: '#161823',
        followersDisplay: '987 W',
        indexedAt: '2026-02',
        description: '2026年改名新实体，专注个人日常与粉丝社群互动。合V:zhangsf818',
        isLatest: true,
      },
    ],
  },
  {
    id: 'conf_2',
    originUrl: 'https://weibo.com/u/1892847291',
    reason: '该链接在微博平台存在历史机构号转制为自媒体多版本元数据记录',
    selectedOption: 'candidate_0', // 自动解析后默认选中第一个实体
    candidates: [
      {
        id: 'c2_a',
        uid: 'wb_tech_frontier_old',
        name: '科技前沿资讯 (媒体机构)',
        avatar: '',
        avatarColor: '#3b82f6',
        avatarLetter: '科',
        platform: 'weibo',
        platformName: '微博',
        platformColor: '#e6162d',
        followersDisplay: '187 W',
        indexedAt: '2023-05',
        description: '早期蓝V认证媒体机构账号，2025年转入企业孵化池。',
        isLatest: false,
      },
      {
        id: 'c2_b',
        uid: 'wb_tech_frontier_lab',
        name: '科技前沿_AI实验室',
        avatar: '',
        avatarColor: '#8b5cf6',
        avatarLetter: '研',
        platform: 'weibo',
        platformName: '微博',
        platformColor: '#e6162d',
        followersDisplay: '245 W',
        indexedAt: '2026-01',
        description: '2026年最新重组AI技术垂直团队，拥有黄V独立个人创作者属性。',
        isLatest: true,
      },
    ],
  },
];

// 5 个未命中链接
export const MOCK_UNHIT_LINKS: UnhitLinkItem[] = [
  {
    id: 'u1',
    url: 'https://www.douyin.com/user/MS4wLjABAAAA_newcreator991',
    platformGuess: '抖音',
    reason: '库内无此 UID 历史采集记录（新晋自媒体作者）',
  },
  {
    id: 'u2',
    url: 'https://weibo.com/u/7892104921',
    platformGuess: '微博',
    reason: '未曾纳入重点信源池监测范围',
  },
  {
    id: 'u3',
    url: 'https://www.xiaohongshu.com/user/profile/648192a0000000001',
    platformGuess: '小红书',
    reason: '平台反爬规则导致历史快照缺失',
  },
  {
    id: 'u4',
    url: 'https://v.kuaishou.com/user/ks_untracked_88',
    platformGuess: '快手',
    reason: '私密账号转公开，未触发自动收录',
  },
  {
    id: 'u5',
    url: 'https://weibo.com/u/6519204910',
    platformGuess: '微博',
    reason: '近期涉事热议博主，尚未建立舆情追踪档案',
  },
];

// 现有重点源目录
export const MOCK_DIRECTORIES: SourceDirectory[] = [
  {
    id: 'dir_101',
    name: '涉华博主',
    currentCount: 158,
    maxLimit: 500,
    isDefault: true,
    visibility: 'public',
  },
  {
    id: 'dir_102',
    name: '行业竞品',
    currentCount: 90,
    maxLimit: 500,
    visibility: 'public',
  },
  {
    id: 'dir_103',
    name: '政务大V',
    currentCount: 344,
    maxLimit: 500,
    visibility: 'dept',
  },
  {
    id: 'dir_104',
    name: '高危预警矩阵',
    currentCount: 20,
    maxLimit: 500,
    visibility: 'private',
  },
];

// 场景 5 补采成功模拟数据 (4个成功，1个失败注销)
export const MOCK_CRAWLED_SUCCESS_ACCOUNTS = [
  {
    name: '极客观察所',
    platform: '抖音app',
    platformColor: '#161823',
    avatarLetter: '极',
    avatarColor: '#06b6d4',
    followers: '142W',
    originUrl: 'https://www.douyin.com/user/MS4wLjABAAAA_newcreator991',
  },
  {
    name: '宏观经济视界',
    platform: '微博',
    platformColor: '#e6162d',
    avatarLetter: '宏',
    avatarColor: '#f43f5e',
    followers: '219W',
    originUrl: 'https://weibo.com/u/7892104921',
  },
  {
    name: '生活美学笔记',
    platform: '小红书',
    platformColor: '#ff2442',
    avatarLetter: '美',
    avatarColor: '#ec4899',
    followers: '88W',
    originUrl: 'https://www.xiaohongshu.com/user/profile/648192a0000000001',
  },
  {
    name: '乡村快评达人',
    platform: '快手app',
    platformColor: '#ff5000',
    avatarLetter: '乡',
    avatarColor: '#84cc16',
    followers: '176W',
    originUrl: 'https://v.kuaishou.com/user/ks_untracked_88',
  },
];

// ============ 单日采集配额风控 Mock 与映射规范 ============

/** 平台中英文 Key 与标准名称双向映射 */
export const PLATFORM_KEY_MAP: Record<string, string> = {
  xhs: '小红书',
  xiaohongshu: '小红书',
  小红书: 'xhs',
  weibo: '微博',
  微博: 'weibo',
  douyin: '抖音',
  抖音: 'douyin',
  kuaishou: '快手',
  快手: 'kuaishou',
  bilibili: 'B站',
  B站: 'bilibili',
  toutiao: '今日头条',
  今日头条: 'toutiao',
  zhihu: '知乎',
  知乎: 'zhihu',
  tieba: '百度贴吧',
  百度贴吧: 'tieba',
};

/** 客户各平台单日限额配置（模拟后台 CustomerConfig 同步结果） */
export interface ClientPlatformLimit {
  mode: 'unlimited' | 'combined' | 'split';
  combinedLimit?: number;
  interactionLimit?: number;
  commentLimit?: number;
}

export const MOCK_CLIENT_PLATFORM_LIMITS: Record<string, ClientPlatformLimit> = {
  xhs: { mode: 'combined', combinedLimit: 1000 }, // 小红书严格合并限制 1000 次/天
  小红书: { mode: 'combined', combinedLimit: 1000 },
  weibo: { mode: 'unlimited' }, // 微博不限
  微博: { mode: 'unlimited' },
  douyin: { mode: 'combined', combinedLimit: 5000 }, // 抖音合并限制 5000 次/天
  抖音: { mode: 'combined', combinedLimit: 5000 },
  kuaishou: { mode: 'unlimited' },
  快手: { mode: 'unlimited' },
  bilibili: { mode: 'unlimited' },
  B站: { mode: 'unlimited' },
  toutiao: { mode: 'unlimited' },
  今日头条: { mode: 'unlimited' },
  zhihu: { mode: 'unlimited' },
  知乎: { mode: 'unlimited' },
};

/** 模拟当前客户已有的进行中和未开始任务，每天在各平台已经预占的日消耗 (E_p) */
export interface OccupiedDailyUsage {
  interaction: number;
  comment: number;
  total: number;
}

export const MOCK_CURRENT_OCCUPIED_DAILY_USAGE: Record<string, OccupiedDailyUsage> = {
  xhs: { interaction: 400, comment: 250, total: 650 }, // 小红书已预占 650 次/天，新任务最多只剩 350 次/天的空间
  小红书: { interaction: 400, comment: 250, total: 650 },
  weibo: { interaction: 1200, comment: 800, total: 2000 },
  微博: { interaction: 1200, comment: 800, total: 2000 },
  douyin: { interaction: 800, comment: 600, total: 1400 },
  抖音: { interaction: 800, comment: 600, total: 1400 },
  bilibili: { interaction: 300, comment: 150, total: 450 },
  B站: { interaction: 300, comment: 150, total: 450 },
  kuaishou: { interaction: 200, comment: 100, total: 300 },
  快手: { interaction: 200, comment: 100, total: 300 },
};

/** 专题/重点源在各平台的存量帖文分布 Mock（用于 Top N 截取与全量计算） */
export const MOCK_SCOPE_PLATFORM_POST_COUNTS: Record<string, Record<string, number>> = {
  topic_001: {
    // 汽车行业专题 / 汽车行业品牌声量监控（总计 1,420 条）
    小红书: 500,
    xhs: 500,
    微博: 600,
    weibo: 600,
    抖音: 320,
    douyin: 320,
  },
  liyutong: {
    // 李雨桐专题
    微博: 850,
    weibo: 850,
    抖音: 420,
    douyin: 420,
    今日头条: 150,
    toutiao: 150,
  },
  src_cat: {
    // 猫咪日常Bot
    小红书: 80,
    xhs: 80,
    微博: 120,
    weibo: 120,
  },
};

