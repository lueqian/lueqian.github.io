/**
 * @name 海外专题页面
 * @description 广州国安定制版 - 海外信息检索与专题分析，已升级为 Memecoin 多模态风险研判版
 *
 */

import '../style.css';
import React, { useState, useCallback, useMemo } from 'react';
import {
  Input,
  Button,
  Select,
  DatePicker,
  Switch,
  Tooltip,
  Collapse,
  message,
  Drawer,
  Avatar,
  Checkbox,
  Pagination,
  Slider,
  Typography,
  Tag,
} from 'antd';
import {
  SearchOutlined,
  TranslationOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
  CopyOutlined,
  LinkOutlined,
  EyeOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  DashboardOutlined,
  GlobalOutlined,
  CloudSyncOutlined,
  SlidersOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

// ============ 常量配置 ============

// 海外站点选项
const OVERSEAS_SITES = [
  { value: 'all', label: '全部' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'Youtube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'foreign_news', label: '境外新闻' },
  { value: 'crypto', label: '虚拟币' }, // 新增虚拟币站点分类
];

// 虚拟币二级平台选项
const CRYPTO_PLATFORMS = [
  { value: 'all', label: '全部' },
  { value: 'pump', label: 'Pump.fun' },
  { value: 'jupiter', label: 'Jupiter' },
  { value: 'solscan', label: 'Solscan' },
];

// 语种选项
const LANGUAGES = [
  { value: 'all', label: '全部' },
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'es', label: '西班牙语' },
  { value: 'th', label: '泰语' },
];

// 国家与地区选项
const COUNTRIES = [
  { value: 'all', label: '全部' },
  { value: 'us', label: '美国' },
  { value: 'cn', label: '中国' },
  { value: 'ru', label: '俄罗斯' },
  { value: 'uk', label: '英国' },
  { value: 'jp', label: '日本' },
];

// 匹配方式选项
const MATCH_METHODS = [
  { value: 'all', label: '全部' },
  { value: 'title', label: '标题' },
  { value: 'body', label: '正文' },
  { value: 'author', label: '作者' },
  { value: 'image', label: '图片识别' },
  { value: 'video', label: '视频封面图' },
];

// 信息类型选项
const INFO_TYPES = [
  { value: 'all', label: '全部' },
  { value: 'original', label: '原创' },
  { value: 'repost', label: '转载' },
  { value: 'comment', label: '评论' },
];

// 模拟搜索历史
const MOCK_SEARCH_HISTORY = [
  '虚拟币',
  '美国领事馆',
  '北京上访',
  '汉坦',
  'Hantavirus',
];

// ============ 数据定义 ============

interface ArticleResult {
  id: string;
  rank: number;
  author: string;
  badge: string;
  time: string;
  platform: string;
  content: string;
  hitKeyword: string;
  platformIcon: string;
  location: string;
  isRepost: boolean;
}

interface MemecoinEntity {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  description: string;
  createdTime: string;
  platform: 'Pump.fun' | 'Jupiter' | 'Solscan';
  multimodalRisk: {
    status: 'high_risk' | 'low_risk' | 'safe';
    tags: string[];
    details: string;
    ocrText?: string;
  };
  pumpData: {
    launcherAddress: string;
    commentsCount: number;
    recentComments: { author: string; content: string; time: string }[];
  };
  jupiterData: {
    priceUsd: number;
    priceChange24h: number;
    volume24hUsd: number;
    priceHistory: number[];
  };
  solscanData: {
    holderCount: number;
    topTenRatio: number;
    transferCount24h: number;
  };
  systemSearchHeat: number;
}

// 模拟普通搜索结果 (例如搜索 TG群/传统文章)
const MOCK_ARTICLES: ArticleResult[] = [
  {
    id: 'a1',
    rank: 1,
    author: '极搜🔍资源搜索@JISOU',
    badge: '原创',
    time: '2026-06-29 13:10:21',
    platform: 'Telegram',
    platformIcon: 'telegram',
    content: '🔥有虚拟币交易经验者优先 🧧 频 道：@okyi88 🧧 频 道：@okyi88，承接各类境外引流与币圈社群运营搭建，欢迎实力老板私聊。',
    hitKeyword: '虚拟币',
    location: '未知地区',
    isRepost: false,
  },
  {
    id: 'a2',
    rank: 2,
    author: '暗网情报搬运工',
    badge: '原创',
    time: '2026-06-29 13:10:12',
    platform: 'Telegram',
    platformIcon: 'telegram',
    content: '境外黑产论坛发布了最新一期洗白通道。对方明确指出仅支持BTC/USDT等虚拟币结算，逃避银行系统监管，交易热度明显上涨。',
    hitKeyword: '虚拟币',
    location: '未知地区',
    isRepost: false,
  },
  {
    id: 'a3',
    rank: 3,
    author: 'Twitter_Alpha_Hunter',
    badge: '原创',
    time: '2026-06-29 13:08:28',
    platform: 'Twitter',
    platformIcon: 'twitter',
    content: 'Several overseas groups are coordinating a political meme pump campaign. Watch out for contract addresses targeting politicians.',
    hitKeyword: '虚拟币',
    location: '美国',
    isRepost: false,
  },
  {
    id: 'a4',
    rank: 4,
    author: '反诈先锋队',
    badge: '原创',
    time: '2026-06-29 13:08:22',
    platform: 'Telegram',
    platformIcon: 'telegram',
    content: '提醒网民警惕打着“好运”、“红包”旗号的虚拟币空投陷阱，境外钓鱼团伙通过伪造钱包签名授权窃取数字资产。',
    hitKeyword: '虚拟币',
    location: '中国',
    isRepost: false,
  },
  {
    id: 'a5',
    rank: 5,
    author: '币圈八卦周刊',
    badge: '原创',
    time: '2026-06-29 13:07:32',
    platform: 'Twitter',
    platformIcon: 'twitter',
    content: '最新爆料！某涉政恶意模因币在上线几分钟内疯狂吸金超十万美金，庄家高度控盘，主要受众均为境外IP。',
    hitKeyword: '虚拟币',
    location: '日本',
    isRepost: false,
  },
];

// 模拟虚拟币检索数据库
const MOCK_MEMECOINS: MemecoinEntity[] = [
  {
    id: 'c1',
    contractAddress: '8xY6t5r4e3w2q1a0s9d8f7g6h5j4k3l2z1x0c9v8b7n',
    name: 'Solana President Token Launch',
    symbol: 'PRESIDENT',
    description: '发现海外炒作团体在 Pump.fun 平台部署了最新的 Meme 项目，内容涉及地缘政治调侃，目前网页端讨论正在发酵...',
    createdTime: '2026-06-29 14:15:22',
    platform: 'Pump.fun',
    multimodalRisk: {
      status: 'high_risk',
      tags: [],
      details: 'Pump.fun 部署异动：检测到境外社群大量提及该涉政 Meme 代币。',
    },
    pumpData: {
      launcherAddress: '8xY6t5r4e3w2q1a0s9d8f7g6h5j4k3l2z1x0c9v8b7n',
      commentsCount: 412,
      recentComments: [],
    },
    jupiterData: {
      priceUsd: 0,
      priceChange24h: 142.8,
      volume24hUsd: 142500,
      priceHistory: [],
    },
    solscanData: {
      holderCount: 1842,
      topTenRatio: 68,
      transferCount24h: 2480,
    },
    systemSearchHeat: 8920,
  },
  {
    id: 'c2',
    contractAddress: '4k3DyUj1V2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m',
    name: 'GSP/SOL Trading Pair Activated',
    symbol: 'GSP',
    description: 'Jupiter 聚合交易所监测到名为 Golden Shield Protocol 的虚拟币交易对流动性池发生异动，24h交易金额出现脉冲式上涨...',
    createdTime: '2026-06-29 13:50:10',
    platform: 'Jupiter',
    multimodalRisk: {
      status: 'high_risk',
      tags: [],
      details: 'Jupiter 交易池异动：检测到异常大额交易对建立与高频对倒洗盘行为。',
    },
    pumpData: {
      launcherAddress: '8xY6t5r4e3w2q1a0s9d8f7g6h5j4k3l2z1x0c9v8b7n',
      commentsCount: 412,
      recentComments: [],
    },
    jupiterData: {
      priceUsd: 0.0482,
      priceChange24h: 142.8,
      volume24hUsd: 142500,
      priceHistory: [],
    },
    solscanData: {
      holderCount: 1842,
      topTenRatio: 68,
      transferCount24h: 2480,
    },
    systemSearchHeat: 8920,
  },
  {
    id: 'c3',
    contractAddress: '4k3DyUj1V2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m',
    name: 'Contract Deployment: 4k3Dy...7x9WpZ',
    symbol: 'GSP-CONTRACT',
    description: 'Solscan 区块链浏览器检测到异常合约创建，该虚拟币持币地址数（Holders）在过去5分钟内突增，疑似有链上资金集中涌入...',
    createdTime: '2026-06-29 13:10:21',
    platform: 'Solscan',
    multimodalRisk: {
      status: 'high_risk',
      tags: [],
      details: 'Solscan 链上监测：发现新建合约部署者关联历史涉政违规项目。',
    },
    pumpData: {
      launcherAddress: '8xY6t5r4e3w2q1a0s9d8f7g6h5j4k3l2z1x0c9v8b7n',
      commentsCount: 412,
      recentComments: [],
    },
    jupiterData: {
      priceUsd: 0.0482,
      priceChange24h: 142.8,
      volume24hUsd: 142500,
      priceHistory: [],
    },
    solscanData: {
      holderCount: 1842,
      topTenRatio: 68,
      transferCount24h: 2480,
    },
    systemSearchHeat: 8920,
  },
];

// ============ SVG 头像渲染器 ============
const renderGSPAvatar = () => (
  <svg width="64" height="64" viewBox="0 0 100 100" style={{ background: '#111827', width: '100%', height: '100%' }}>
    <rect width="100" height="100" fill="#111827" />
    <path d="M50,15 C35,15 25,35 25,55 L75,55 C75,35 65,15 50,15 Z" fill="#374151" />
    <rect x="46" y="8" width="8" height="8" fill="#4B5563" />
    <rect x="30" y="55" width="6" height="25" fill="#4B5563" />
    <rect x="42" y="55" width="6" height="25" fill="#4B5563" />
    <rect x="54" y="55" width="6" height="25" fill="#4B5563" />
    <rect x="66" y="55" width="6" height="25" fill="#4B5563" />
    <rect x="20" y="75" width="60" height="8" fill="#1F2937" />
    <path d="M22,40 Q45,22 78,38" fill="none" stroke="#00ffff" strokeWidth="3" opacity="0.8" />
    <path d="M15,62 L85,62" fill="none" stroke="#ff00ff" strokeWidth="2.5" opacity="0.9" />
    <path d="M35,70 Q50,85 65,65" fill="none" stroke="#39ff14" strokeWidth="2" opacity="0.8" />
  </svg>
);

const renderELMAvatar = () => (
  <svg width="64" height="64" viewBox="0 0 100 100" style={{ background: '#111827', width: '100%', height: '100%' }}>
    <rect width="100" height="100" fill="#111827" />
    <path d="M50,22 C38,22 32,28 32,42 C32,54 38,60 50,60 C62,60 68,54 68,42 C68,28 62,22 50,22 Z" fill="#F59E0B" opacity="0.85" />
    <path d="M25,78 C25,65 35,62 50,62 C65,62 75,65 75,78 Z" fill="#2563EB" opacity="0.8" />
    <path d="M30,30 C30,22 38,15 50,15 C62,15 70,22 70,30 C72,25 72,18 50,18 C28,18 28,25 30,30 Z" fill="#1F2937" />
    <circle cx="50" cy="40" r="3" fill="#EF4444" />
  </svg>
);

// ============ 主组件 ============

const OverseasTopics: React.FC = function () {
  // 搜索关键词 (默认为空)
  const [keyword, setKeyword] = useState('');
  // 时间范围
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'days').startOf('day'),
    dayjs().endOf('day'),
  ]);

  // 筛选配置状态
  const [overseasSite, setOverseasSite] = useState('crypto'); // 默认选中虚拟币
  const [selectedCryptoPlatforms, setSelectedCryptoPlatforms] = useState<string[]>(['all']); // 虚拟币子平台多选
  const [language, setLanguage] = useState('all');
  const [country, setCountry] = useState('all');
  const [matchMethod, setMatchMethod] = useState('all');
  const [infoType, setInfoType] = useState('all');

  // 高级筛选状态
  const [specifiedAuthor, setSpecifiedAuthor] = useState('');
  const [specifiedSite, setSpecifiedSite] = useState('');
  const [specifiedDomain, setSpecifiedDomain] = useState('');
  const [excludeDomain, setExcludeDomain] = useState('');
  const [filterWords, setFilterWords] = useState('');
  const [smartFilter, setSmartFilter] = useState(false);

  // 搜索历史与展开状态
  const [searchHistory, setSearchHistory] = useState<string[]>(MOCK_SEARCH_HISTORY);
  const [historyExpanded, setHistoryExpanded] = useState(true);

  // 检索触发态与加载
  const [isSearched, setIsSearched] = useState(false); // 默认未搜索，优先展示搜索入口页
  const [resultsKeyword, setResultsKeyword] = useState('');
  const [activePlatformTab, setActivePlatformTab] = useState('all'); // 左侧平台 Tab 激活项
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]); // 复选框勾选的 IDs

  // 研判详情抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<MemecoinEntity | null>(null);

  // 研判详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetailToken, setActiveDetailToken] = useState<MemecoinEntity | null>(null);

  // 打开研判弹窗
  const handleOpenDetailModal = useCallback(function (token: MemecoinEntity) {
    setActiveDetailToken(token);
    setDetailModalOpen(true);
  }, []);

  // 算分加权状态 (交易面权重与关注面权重，初始各 50%)
  const [marketWeight, setMarketWeight] = useState(50);
  const [socialWeight, setSocialWeight] = useState(50);

  // ============ 辅助交互逻辑 ============

  // 执行搜索
  const handleSearch = useCallback(function () {
    if (!keyword.trim()) {
      message.warning('请输入搜索关键词');
      return;
    }
    // 添加到搜索历史
    setSearchHistory(function (prev) {
      const newHistory = [keyword, ...prev.filter(function (item) { return item !== keyword; })].slice(0, 20);
      return newHistory;
    });
    setResultsKeyword(keyword);
    setIsSearched(true);
    message.success('搜索检索完成，已刷新结果数据');
  }, [keyword]);

  // 重置搜索与筛选条件
  const handleResetFilters = useCallback(function () {
    setKeyword('');
    setOverseasSite('all');
    setSelectedCryptoPlatforms(['all']);
    setLanguage('all');
    setCountry('all');
    setMatchMethod('all');
    setInfoType('all');
    setSpecifiedAuthor('');
    setSpecifiedSite('');
    setSpecifiedDomain('');
    setExcludeDomain('');
    setFilterWords('');
    setSmartFilter(false);
    setIsSearched(false);
    message.info('筛选条件已重置');
  }, []);

  // 清空搜索历史
  const handleClearHistory = useCallback(function () {
    setSearchHistory([]);
    message.success('搜索历史已清空');
  }, []);

  // 点击历史记录
  const handleHistoryClick = useCallback(function (text: string) {
    setKeyword(text);
  }, []);

  // 复制合约地址
  const handleCopyContract = useCallback(function (e: React.MouseEvent, address: string) {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    message.success('智能合约地址已成功复制到剪贴板！');
  }, []);

  // 打开研判抽屉
  const handleOpenDrawer = useCallback(function (token: MemecoinEntity) {
    setSelectedToken(token);
    setDrawerOpen(true);
  }, []);

  // ============ 二级评分模型计算 ============
  // 计算每个代币的最终得分
  const calculateScore = useCallback(function (token: MemecoinEntity, mWeight: number, sWeight: number) {
    // 交易面原始影响分 (Solscan持币占比与24h交易金额归一化计算，此处使用合理模拟基准分)
    const baseMarketScore = token.solscanData.holderCount > 5000 
      ? 95 
      : token.solscanData.holderCount > 800 
        ? 88 
        : 65;
    
    // 关注面原始影响分 (Pump.fun评论量与系统内部搜索热度)
    const baseSocialScore = token.systemSearchHeat > 1000 
      ? 96 
      : token.systemSearchHeat > 500 
        ? 82 
        : 45;

    // 加权综合算分
    const finalScore = (baseMarketScore * (mWeight / 100)) + (baseSocialScore * (sWeight / 100));
    return Math.round(finalScore);
  }, []);

  // 拦截处置动作
  const handleInterceptToken = useCallback(function (tokenName: string) {
    message.loading(`正在下发虚拟币拦截处置指令...`);
    setTimeout(() => {
      message.success(`代币 [${tokenName}] 的多模态布控预警已升级，本地拦截策略已同步分发！`);
    }, 1000);
  }, []);

  // ============ 渲染过滤标签 ============
  const renderFilterTags = function (
    options: Array<{ value: string; label: string }>,
    value: string,
    onChange: (v: string) => void
  ) {
    return (
      <div className="ot-filter-tags">
        {options.map(function (option) {
          const isActive = value === option.value;
          return (
            <span
              key={option.value}
              className={'ot-filter-tag' + (isActive ? ' ot-filter-tag--active' : '')}
              onClick={function () { onChange(option.value); }}
            >
              {option.label}
            </span>
          );
        })}
      </div>
    );
  };

  // ============ 渲染 SVG 代币图片附件 ============
  const renderTokenSVG = function (tokenSymbol: string) {
    if (tokenSymbol === 'GOODLUCK') {
      return (
        <svg width="80" height="80" viewBox="0 0 100 100" style={{ background: '#14151a', borderRadius: '6px' }}>
          <circle cx="50" cy="50" r="40" fill="url(#goldGrad)" stroke="#ffd700" strokeWidth="2" />
          <path d="M50,25 C43,25 38,32 38,42 C38,50 43,55 50,55 C57,55 62,50 62,42 C62,32 57,25 50,25 Z" fill="#ff4d4f" opacity="0.8" />
          <path d="M32,73 C32,62 40,60 50,60 C60,60 68,62 68,73 Z" fill="#ff4d4f" opacity="0.8" />
          <rect x="52" y="44" width="30" height="15" rx="2" fill="none" stroke="#ff4d4f" strokeWidth="2" transform="rotate(-15 67 51)" />
          <text x="67" y="54" fontSize="8" fill="#ff4d4f" fontWeight="bold" textAnchor="middle" transform="rotate(-15 67 51)">涉政</text>
          <defs>
            <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff2a3" />
              <stop offset="70%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
    if (tokenSymbol === 'CDUCK') {
      return (
        <svg width="80" height="80" viewBox="0 0 100 100" style={{ background: '#14151a', borderRadius: '6px' }}>
          <circle cx="50" cy="50" r="40" fill="url(#goldGrad)" stroke="#ffd700" strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="15" ry="8" fill="#ff4d4f" />
          <path d="M30,35 L70,35 L65,22 L35,22 Z" fill="#ff4d4f" />
          <rect x="25" y="32" width="50" height="4" fill="#d4380d" />
          <polygon points="50,24 52,29 57,29 53,32 55,37 50,34 45,37 47,32 43,29 48,29" fill="#ffd700" />
          <defs>
            <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff2a3" />
              <stop offset="70%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
    return (
      <svg width="80" height="80" viewBox="0 0 100 100" style={{ background: '#14151a', borderRadius: '6px' }}>
        <circle cx="50" cy="50" r="40" fill="#13c2c2" stroke="#08979c" strokeWidth="2" />
        <path d="M50,25 L75,40 L75,70 L50,85 L25,70 L25,40 Z" fill="none" stroke="#fff" strokeWidth="3" />
        <text x="50" y="56" fontSize="16" fill="#fff" fontWeight="bold" textAnchor="middle">SAFE</text>
      </svg>
    );
  };

  // ============ 过滤和归类搜索结果数据 ============

  // 1. 如果海外站点选中“虚拟币”
  // 2. 如果海外站点选中其他
  const filteredResults = useMemo(() => {
    if (!isSearched) return [];

    if (overseasSite === 'crypto') {
      // 过滤虚拟币结果
      return MOCK_MEMECOINS.filter(function (token) {
        // 按平台 Tab 筛选
        if (activePlatformTab === 'pump') {
          if (token.platform !== 'Pump.fun') return false;
        } else if (activePlatformTab === 'jupiter') {
          if (token.platform !== 'Jupiter') return false;
        } else if (activePlatformTab === 'solscan') {
          if (token.platform !== 'Solscan') return false;
        }

        // 按搜索词模糊匹配（如果关键词是"虚拟币"、"全部"或为空，则默认展示所有虚拟币结果）
        const lowerKeyword = resultsKeyword.toLowerCase().trim();
        if (lowerKeyword === '虚拟币' || lowerKeyword === '全部' || !lowerKeyword) {
          return true;
        }
        const matchesKeyword = token.name.toLowerCase().includes(lowerKeyword) ||
                               token.symbol.toLowerCase().includes(lowerKeyword) ||
                               token.contractAddress.toLowerCase().includes(lowerKeyword) ||
                               token.multimodalRisk.tags.some(t => t.includes(lowerKeyword));
        return matchesKeyword;
      });
    } else {
      // 过滤普通文章结果
      return MOCK_ARTICLES.filter(function (article) {
        // 按平台分类Tab过滤
        if (activePlatformTab !== 'all') {
          const mapSiteTab: Record<string, string> = {
            telegram: 'Telegram',
            twitter: 'Twitter',
          };
          if (article.platform !== mapSiteTab[activePlatformTab]) {
            return false;
          }
        }
        const lowerKeyword = resultsKeyword.toLowerCase();
        return article.content.toLowerCase().includes(lowerKeyword) ||
               article.author.toLowerCase().includes(lowerKeyword);
      });
    }
  }, [isSearched, overseasSite, selectedCryptoPlatforms, resultsKeyword, activePlatformTab]);

  // 根据当前筛选模式动态渲染左侧 Tab
  const dynamicPlatformTabs = useMemo(() => {
    if (overseasSite === 'crypto') {
      return [
        { key: 'all', label: '全部', count: 2 },
        { key: 'pump', label: 'Pump.fun', count: 2 },
        { key: 'jupiter', label: 'Jupiter', count: 1 },
        { key: 'solscan', label: 'Solscan', count: 2 },
      ];
    } else {
      return [
        { key: 'all', label: '全部', count: filteredResults.length },
        { key: 'twitter', label: 'Twitter', count: filteredResults.filter(r => r.platform === 'Twitter').length },
        { key: 'telegram', label: 'Telegram', count: filteredResults.filter(r => r.platform === 'Telegram').length },
      ];
    }
  }, [overseasSite, filteredResults]);

  // 全选/反选
  const handleSelectAllResults = function (checked: boolean) {
    if (checked) {
      setSelectedResultIds(filteredResults.map(r => r.id));
    } else {
      setSelectedResultIds([]);
    }
  };

  const handleSelectOneResult = function (id: string, checked: boolean) {
    if (checked) {
      setSelectedResultIds(prev => [...prev, id]);
    } else {
      setSelectedResultIds(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="ot-container">
      {!isSearched ? (
        /* ===== 搜索入口态 ===== */
        <div className="ot-entry-container">
          {/* 标题 */}
          <div className="ot-entry-title-section">
            <h1>海外发现</h1>
            <p>集成多源海外社交阵地（Twitter/Telegram 等）与虚拟币监测指标，提供多模态涉政风险自动核查</p>
          </div>

          {/* 搜索框 */}
          <div className="ot-right-search-box" style={{ padding: '20px' }}>
            <div className="ot-entry-search-bar">
              <Input
                placeholder="请输入检索关键词，回车直接检索..."
                size="large"
                value={keyword}
                onChange={function (e) { setKeyword(e.target.value); }}
                onPressEnter={handleSearch}
                style={{ flex: 1 }}
              />
              <Button type="primary" size="large" icon={<SearchOutlined />} onClick={handleSearch}>
                检索搜索
              </Button>
              <Button size="large" icon={<TranslationOutlined />}>翻译助手</Button>
              <Button size="large" onClick={handleResetFilters}>重置条件</Button>
            </div>
            <div className="text-gray-400 text-xs flex justify-between items-center mt-1 w-full">
              <span>如输入关键词进行多维分析，支持多词、特殊逻辑运算符</span>
              <a href="#" className="text-blue-500 hover:underline">了解检索语法规范</a>
            </div>
          </div>

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="ot-history-panel">
              <div className="ot-history-header">
                <span className="ot-history-title">搜索历史</span>
                <Button type="link" size="small" icon={<DeleteOutlined />} onClick={handleClearHistory} style={{ padding: 0 }}>
                  清空
                </Button>
              </div>
              <div className="ot-history-list">
                {searchHistory.map(function (item, index) {
                  return (
                    <span
                      key={index}
                      className="ot-history-item"
                      onClick={function () { handleHistoryClick(item); }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* 过滤条件面板 */}
          <div className="ot-filter-panel">
            <div className="ot-filter-header">
              <span className="ot-filter-title">全局过滤条件配置</span>
            </div>

            {/* 时间范围 */}
            <div className="ot-filter-row flex-col gap-2">
              <div className="ot-filter-label font-semibold">
                时间范围
                <Tooltip title="选择数据发布的时间范围">
                  <InfoCircleOutlined className="ot-filter-info" />
                </Tooltip>
              </div>
              <RangePicker
                showTime
                value={dateRange}
                onChange={function (dates) { dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]); }}
                style={{ width: '100%' }}
                placeholder={['开始时间', '结束时间']}
              />
            </div>

            {/* 海外站点 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">海外站点</div>
              {renderFilterTags(OVERSEAS_SITES, overseasSite, function (siteVal) {
                setOverseasSite(siteVal);
                setActivePlatformTab('all');
              })}

              {/* 虚拟币二级平台展开行 */}
              {overseasSite === 'crypto' && (
                <div className="ot-crypto-subrow">
                  <span className="text-gray-400 text-xs w-full mb-1">布控虚拟币平台（多选）：</span>
                  {CRYPTO_PLATFORMS.map(function (p) {
                    const isSelected = selectedCryptoPlatforms.includes(p.value);
                    return (
                      <span
                        key={p.value}
                        className={'ot-crypto-tag-btn' + (isSelected ? ' ot-crypto-tag-btn--active' : '')}
                        onClick={function () {
                          if (p.value === 'all') {
                            setSelectedCryptoPlatforms(['all']);
                          } else {
                            setSelectedCryptoPlatforms(function (prev) {
                              const newArr = prev.filter(item => item !== 'all');
                              if (newArr.includes(p.value)) {
                                const res = newArr.filter(item => item !== p.value);
                                return res.length === 0 ? ['all'] : res;
                              } else {
                                return [...newArr, p.value];
                              }
                            });
                          }
                        }}
                      >
                        {p.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 语种 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">语种</div>
              {renderFilterTags(LANGUAGES, language, setLanguage)}
            </div>

            {/* 国家与地区 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">国家与地区</div>
              {renderFilterTags(COUNTRIES, country, setCountry)}
            </div>

            {/* 匹配方式 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">匹配方式</div>
              {renderFilterTags(MATCH_METHODS, matchMethod, setMatchMethod)}
            </div>

            {/* 信息类型 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">信息类型</div>
              {renderFilterTags(INFO_TYPES, infoType, setInfoType)}
            </div>

            {/* 高级过滤条件折叠 */}
            <Collapse
              bordered={false}
              className="ot-advanced-collapse"
              expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
              items={[
                {
                  key: '1',
                  label: '高级精细布控指标',
                  children: (
                    <div className="ot-advanced-filters">
                      <div className="ot-advanced-item">
                        <label>指定账户名</label>
                        <Input
                          placeholder="请输入特定博主，英文逗号隔开"
                          value={specifiedAuthor}
                          onChange={function (e) { setSpecifiedAuthor(e.target.value); }}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>指定信源ID</label>
                        <Input
                          placeholder="如TG频道ID或Twitter主页后缀"
                          value={specifiedSite}
                          onChange={function (e) { setSpecifiedSite(e.target.value); }}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>定向布控信源组</label>
                        <Select
                          placeholder="请选择自定义重点源组"
                          style={{ width: '100%' }}
                          options={[
                            { value: 'politicians', label: '涉政监测名单' },
                            { value: 'scam_channels', label: '黑产发卡渠道监测组' },
                          ]}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>全局排除词</label>
                        <Input
                          placeholder="命中的排除词不展示"
                          value={filterWords}
                          onChange={function (e) { setFilterWords(e.target.value); }}
                        />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      ) : (
        /* ===== 检索结果态（双栏） ===== */
        <div className="ot-main-layout">
        
        {/* 左侧：搜索结果卡片列表 */}
        <div className="ot-left-results">
          
          {/* 左侧顶部工具栏 */}
          <div className="ot-left-top-bar">
            <div className="ot-left-top-filters">
              <span className="ot-back-btn mr-2" onClick={function () { setIsSearched(false); }}>
                <UndoOutlined /> 返回搜索页
              </span>
              <span className="ot-left-top-filter-item">阵地</span>
              <span className="ot-left-top-filter-item">语种</span>
              <span className="ot-left-top-filter-item font-semibold text-blue-500">国家与地区</span>
            </div>
            <div className="ot-left-top-search">
              <Input
                placeholder="请输入二级结果关键词"
                size="small"
                style={{ width: 160 }}
              />
              <Button type="primary" size="small">结果中搜索</Button>
              <Button size="small" icon={<TranslationOutlined />}>一键翻译</Button>
            </div>
          </div>

          {/* 数据阵地 Tabs */}
          {isSearched && (
            <div className="ot-platform-tabs">
              {dynamicPlatformTabs.map(tab => (
                <div
                  key={tab.key}
                  className={'ot-platform-tab' + (activePlatformTab === tab.key ? ' ot-platform-tab--active' : '')}
                  onClick={function () { setActivePlatformTab(tab.key); }}
                >
                  <span>{tab.label}</span>
                  <span className="ot-platform-tab-count">({tab.count})</span>
                </div>
              ))}
            </div>
          )}

          {/* 卡片列表 */}
          <div className="ot-card-list">
            {!isSearched ? (
              <div className="bg-white rounded-lg p-12 border border-dashed border-gray-300 text-center text-gray-400">
                请在右侧输入框填写检索条件，然后点击“搜索”按钮获取布控结果。
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center text-gray-400 border border-gray-100">
                未找到与“{resultsKeyword}”相关的检索数据，请更换筛选条件或关键词。
              </div>
            ) : overseasSite === 'crypto' ? (
              /* ===== 浅色精简版研判文章列表 (Light Theme Article Cards) ===== */
              <div className="ot-clean-list">
                {filteredResults.map(function (token: any, index: number) {
                  return (
                    <div
                      key={token.id}
                      className="ot-clean-card"
                      onClick={function () { handleOpenDetailModal(token); }}
                    >
                      {/* 左侧：选择框、序号、灰色头像 */}
                      <div className="ot-clean-checkbox-col" onClick={function (e) { e.stopPropagation(); }}>
                        <Checkbox
                          checked={selectedResultIds.includes(token.id)}
                          onChange={function (e) { handleSelectOneResult(token.id, e.target.checked); }}
                        />
                        <span className="ot-clean-rank">{index + 1}</span>
                      </div>
                      <div className="ot-clean-avatar">
                        {token.platform[0]}
                      </div>

                      {/* 中间/右侧主体 */}
                      <div className="ot-clean-main">
                        {/* 第一行：标题与右侧操作按钮 */}
                        <div className="ot-clean-header">
                          <span className="ot-clean-title">{token.name}</span>
                          <div className="ot-clean-actions" onClick={function (e) { e.stopPropagation(); }}>
                            <span className="ot-clean-action-btn">一键搜索</span>
                            <span className="ot-clean-action-btn" onClick={function (e) { handleCopyContract(e, token.contractAddress); }}>
                              复制信息
                            </span>
                            <span className="ot-clean-action-btn" onClick={function () { handleOpenDetailModal(token); }}>
                              查看原文
                            </span>
                          </div>
                        </div>

                        {/* 第二行：发布时间、来源、命中词 */}
                        <div className="ot-clean-meta">
                          <span>🕒 {token.createdTime}</span>
                          <span className="ot-clean-meta-sep">|</span>
                          <span>📂 平台: {token.platform}</span>
                          <span className="ot-clean-meta-sep">|</span>
                          <span>
                            🎯 命中关键词: <span className="text-red-500 font-semibold">虚拟币</span>
                          </span>
                        </div>

                        {/* 第三行：内容简介 */}
                        <div className="ot-clean-content">
                          {token.description}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              // 渲染传统文章结果卡片列表 (Twitter/Telegram)
              filteredResults.map(function (article: any) {
                return (
                  <div key={article.id} className="ot-result-card">
                    {/* 左侧勾选与序号 */}
                    <div className="ot-card-select-col">
                      <Checkbox
                        checked={selectedResultIds.includes(article.id)}
                        onChange={function (e) { handleSelectOneResult(article.id, e.target.checked); }}
                      />
                      <span className="ot-card-rank">{article.id.replace('a', '')}</span>
                    </div>

                    {/* 卡片主体 */}
                    <div className="ot-card-main-col">
                      
                      {/* 第一行：用户名与操作 */}
                      <div className="ot-card-row1">
                        <div className="ot-card-user-info">
                          <Avatar size="small" style={{ backgroundColor: '#1890ff', color: '#fff', fontSize: 11 }}>
                            {article.author[0]}
                          </Avatar>
                          <span className="ot-card-username">{article.author}</span>
                          <span className="ot-card-badge ot-card-badge--original">{article.badge}</span>
                        </div>
                        <div className="ot-card-actions">
                          <span className="ot-card-action-btn"><FileSearchOutlined /> 一键搜索</span>
                          <span className="ot-card-action-btn"><CopyOutlined /> 复制信息</span>
                          <span className="ot-card-action-btn ot-card-action-btn--primary"><LinkOutlined /> 查看原文</span>
                        </div>
                      </div>

                      {/* 第二行：元数据 */}
                      <div className="ot-card-row2">
                        <div className="ot-card-meta-items">
                          <span>{article.time}</span>
                          <span className="ot-card-meta-sep">|</span>
                          <span>阵地：{article.platform}</span>
                          <span className="ot-card-meta-sep">|</span>
                          <span>属地：{article.location}</span>
                        </div>
                        <div>
                          <span className="ot-card-hit-tag">命中：{resultsKeyword}</span>
                        </div>
                      </div>

                      {/* 第三行：正文 */}
                      <div className="ot-card-row3">
                        <div className="ot-card-content">
                          {article.content.split(resultsKeyword).map((part: string, i: number, arr: string[]) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <span className="ot-card-keyword-highlight">{resultsKeyword}</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 分页 */}
          {isSearched && filteredResults.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-100 flex items-center justify-between mt-2">
              <Checkbox
                checked={selectedResultIds.length === filteredResults.length && filteredResults.length > 0}
                indeterminate={selectedResultIds.length > 0 && selectedResultIds.length < filteredResults.length}
                onChange={function (e) { handleSelectAllResults(e.target.checked); }}
              >
                全选
              </Checkbox>
              <Pagination
                size="small"
                total={filteredResults.length}
                pageSize={20}
                showSizeChanger
                locale={{ items_per_page: '条/页' }}
              />
            </div>
          )}

        </div>

        {/* 右侧：输入框、搜索动作、过滤器与历史记录 */}
        <div className="ot-right-panel">
          
          {/* 搜索多行文本区 */}
          <div className="ot-right-search-box" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Input
              placeholder="请输入检索关键词..."
              value={keyword}
              onChange={function (e) { setKeyword(e.target.value); }}
              onPressEnter={handleSearch}
              style={{ width: '100%' }}
            />
            <div className="ot-search-btn-group" style={{ display: 'flex', gap: '6px' }}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} style={{ flex: 1 }}>
                搜索
              </Button>
              <Button icon={<TranslationOutlined />} onClick={function () { message.info('翻译助手正在启动...'); }} title="翻译助手" />
              <Button onClick={handleResetFilters}>重置</Button>
            </div>
          </div>

          {/* 搜索记录 */}
          <div className="ot-history-panel">
            <div className="ot-history-header">
              <span className="ot-history-title" onClick={function () { setHistoryExpanded(!historyExpanded); }} style={{ cursor: 'pointer' }}>
                {historyExpanded ? <DownOutlined className="mr-1 text-xs" /> : <RightOutlined className="mr-1 text-xs" />}
                搜索历史
              </span>
              <Button type="link" size="small" icon={<DeleteOutlined />} onClick={handleClearHistory} style={{ padding: 0 }}>
                清空
              </Button>
            </div>
            {historyExpanded && searchHistory.length > 0 && (
              <div className="ot-history-list">
                {searchHistory.map(function (item, index) {
                  return (
                    <span
                      key={index}
                      className="ot-history-item"
                      onClick={function () { handleHistoryClick(item); }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* 检索过滤面板 */}
          <div className="ot-filter-panel">
            <div className="ot-filter-header">
              <span className="ot-filter-title">全局过滤条件</span>
            </div>

            {/* 时间范围 */}
            <div className="ot-filter-row flex-col gap-2">
              <div className="ot-filter-label font-semibold">
                时间范围
                <Tooltip title="选择数据发布的时间范围">
                  <InfoCircleOutlined className="ot-filter-info" />
                </Tooltip>
              </div>
              <RangePicker
                showTime
                value={dateRange}
                onChange={function (dates) { dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]); }}
                size="small"
                style={{ width: '100%' }}
                placeholder={['开始时间', '结束时间']}
              />
            </div>

            {/* 海外站点 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">海外站点</div>
              {renderFilterTags(OVERSEAS_SITES, overseasSite, function (siteVal) {
                setOverseasSite(siteVal);
                setActivePlatformTab('all');
              })}

              {/* 虚拟币二级展开项 */}
              {overseasSite === 'crypto' && (
                <div className="ot-crypto-subrow">
                  <span className="text-gray-400 text-xs w-full mb-1">布控虚拟币平台（多选）：</span>
                  {CRYPTO_PLATFORMS.map(function (p) {
                    const isSelected = selectedCryptoPlatforms.includes(p.value);
                    return (
                      <span
                        key={p.value}
                        className={'ot-crypto-tag-btn' + (isSelected ? ' ot-crypto-tag-btn--active' : '')}
                        onClick={function () {
                          if (p.value === 'all') {
                            setSelectedCryptoPlatforms(['all']);
                          } else {
                            setSelectedCryptoPlatforms(function (prev) {
                              const newArr = prev.filter(item => item !== 'all');
                              if (newArr.includes(p.value)) {
                                const res = newArr.filter(item => item !== p.value);
                                return res.length === 0 ? ['all'] : res;
                              } else {
                                return [...newArr, p.value];
                              }
                            });
                          }
                        }}
                      >
                        {p.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 语种 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">语种</div>
              {renderFilterTags(LANGUAGES, language, setLanguage)}
            </div>

            {/* 国家与地区 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">国家与地区</div>
              {renderFilterTags(COUNTRIES, country, setCountry)}
            </div>

            {/* 匹配方式 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">匹配方式</div>
              {renderFilterTags(MATCH_METHODS, matchMethod, setMatchMethod)}
            </div>

            {/* 信息类型 */}
            <div className="ot-filter-row flex-col gap-2 mt-4">
              <div className="ot-filter-label font-semibold">信息类型</div>
              {renderFilterTags(INFO_TYPES, infoType, setInfoType)}
            </div>

            {/* 高级过滤条件折叠 */}
            <Collapse
              bordered={false}
              className="ot-advanced-collapse"
              expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
              items={[
                {
                  key: '1',
                  label: '高级精细布控指标',
                  children: (
                    <div className="ot-advanced-filters">
                      <div className="ot-advanced-item">
                        <label>指定账户名</label>
                        <Input
                          placeholder="请输入特定博主，英文逗号隔开"
                          size="small"
                          value={specifiedAuthor}
                          onChange={function (e) { setSpecifiedAuthor(e.target.value); }}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>指定信源ID</label>
                        <Input
                          placeholder="如TG频道ID或Twitter主页后缀"
                          size="small"
                          value={specifiedSite}
                          onChange={function (e) { setSpecifiedSite(e.target.value); }}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>定向布控信源组</label>
                        <Select
                          placeholder="请选择自定义重点源组"
                          size="small"
                          style={{ width: '100%' }}
                          options={[
                            { value: 'politicians', label: '涉政监测名单' },
                            { value: 'scam_channels', label: '黑产发卡渠道监测组' },
                          ]}
                        />
                      </div>
                      <div className="ot-advanced-item">
                        <label>全局排除词</label>
                        <Input
                          placeholder="命中排除词不予展示"
                          size="small"
                          value={filterWords}
                          onChange={function (e) { setFilterWords(e.target.value); }}
                        />
                      </div>
                      <div className="ot-advanced-item flex-row items-center justify-between mt-2">
                        <label>多模态风险优先阻断</label>
                        <Switch checked={smartFilter} onChange={setSmartFilter} size="small" />
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

        </div>

      </div>
    )}

      {/* ============ 居中研判线索详情弹窗 (Center Modal) ============ */}
      {detailModalOpen && activeDetailToken && (
        <div className="ot-modal-overlay" onClick={function () { setDetailModalOpen(false); }}>
          <div className="ot-modal-container" onClick={function (e) { e.stopPropagation(); }}>
            
            {/* Header */}
            <div className="ot-modal-header">
              <span className="ot-modal-title">虚拟币全维数据研判线索详情</span>
              <span className="ot-modal-close" onClick={function () { setDetailModalOpen(false); }}>✕</span>
            </div>

            {/* Body */}
            <div className="ot-modal-body">
              {/* Section A: Base Information */}
              <div className="ot-modal-sec">
                <div className="ot-modal-sec-title">基础监控线索</div>
                <div className="ot-modal-sec-content">
                  <div className="ot-modal-info-item">
                    <span className="ot-modal-info-label">标题名称:</span>
                    <span className="ot-modal-info-val font-semibold">{activeDetailToken.name}</span>
                  </div>
                  <div className="ot-modal-info-item">
                    <span className="ot-modal-info-label">信源平台:</span>
                    <span className="ot-modal-info-val">{activeDetailToken.platform}</span>
                  </div>
                  <div className="ot-modal-info-item">
                    <span className="ot-modal-info-label">智能合约:</span>
                    <span className="ot-modal-info-val font-mono">{activeDetailToken.contractAddress}</span>
                  </div>
                  <div className="ot-modal-info-item">
                    <span className="ot-modal-info-label">发现时间:</span>
                    <span className="ot-modal-info-val">{activeDetailToken.createdTime}</span>
                  </div>
                  <div className="ot-modal-info-item flex-col gap-1 mt-1">
                    <span className="ot-modal-info-label">全文监控描述:</span>
                    <div className="ot-modal-info-val text-gray-700 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100 font-sans">
                      {activeDetailToken.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: All-Chain Deep Trace & Risk Assessment */}
              <div className="ot-modal-sec">
                <div className="ot-modal-sec-title">全链深度溯源与风险研判</div>
                <div className="ot-modal-grid">
                  
                  {/* Box 1: 资金池与变现风险监控 */}
                  <div className="ot-modal-grid-box">
                    <div className="ot-modal-grid-box-title">资金池与变现风险监控</div>
                    <div className="ot-modal-grid-box-stat">
                      <span>基础流动性池 (Liquidity Pool):</span>
                      <span className="ot-modal-grid-box-stat-val">$45,820 USD</span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>24h交易额 (24h Volume):</span>
                      <span className="ot-modal-grid-box-stat-val">$142,500 USD</span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>流动性安全状态:</span>
                      <span className="ot-modal-grid-box-stat-val text-red-500 font-semibold">风险（资金未锁定）</span>
                    </div>
                  </div>

                  {/* Box 2: 链上扩散与持币审计 */}
                  <div className="ot-modal-grid-box">
                    <div className="ot-modal-grid-box-title">链上扩散与持币审计</div>
                    <div className="ot-modal-grid-box-stat">
                      <span>独立持币地址数 (Holders):</span>
                      <span className="ot-modal-grid-box-stat-val">1,842 个</span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>筹码集中度:</span>
                      <span className="ot-modal-grid-box-stat-val text-red-500 font-semibold">极高 (前3钱包控盘 72%)</span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>24h转账笔数 (Transfers):</span>
                      <span className="ot-modal-grid-box-stat-val">3,217 次</span>
                    </div>
                  </div>

                  {/* Box 3: 源头溯源与出金追踪 */}
                  <div className="ot-modal-grid-box">
                    <div className="ot-modal-grid-box-title">源头溯源与出金追踪</div>
                    <div className="ot-modal-grid-box-stat">
                      <span>部署者钱包 (Creator):</span>
                      <span className="ot-modal-grid-box-stat-val font-mono" style={{ fontSize: 11, display: 'flex', alignItems: 'center' }}>
                        8xY6t5...v8b7n
                        <CopyOutlined
                          className="ml-1 text-gray-400 hover:text-blue-500 cursor-pointer"
                          onClick={function (e) { handleCopyContract(e, '8xY6t5r4e3w2q1a0s9d8f7g6h5j4k3l2z1x0c9v8b7n'); }}
                        />
                      </span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>初始手续费来源:</span>
                      <span className="ot-modal-grid-box-stat-val text-orange-500 font-semibold" style={{ fontSize: 11 }}>境外匿名混币器 (Tornado Cash)</span>
                    </div>
                    <div className="ot-modal-grid-box-stat">
                      <span>交易所关联 (CEX Link):</span>
                      <span className="ot-modal-grid-box-stat-val text-blue-500" style={{ fontSize: 11 }}>监测到有资金流向 OKX Router</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============ 研判详情抽屉 (Details Drawer) ============ */}
      <Drawer
        title={
          <span className="flex items-center gap-2">
            <DashboardOutlined className="text-blue-500" />
            <span>数字资产多模态研判详情报告</span>
          </span>
        }
        placement="right"
        width={920}
        onClose={function () { setDrawerOpen(false); }}
        open={drawerOpen}
        destroyOnClose
      >
        {selectedToken && (
          <div className="ot-drawer-split">
            
            {/* 抽屉左栏：多模态内容与大图报告 */}
            <div className="ot-drawer-left">
              
              {/* 多模态识别报告 */}
              <div className="ot-multimodal-report">
                <div className="ot-report-title">
                  <AlertOutlined />
                  <span>多模态视觉违规鉴定报告</span>
                  <Tag color="error" style={{ marginLeft: 'auto' }}>
                    {selectedToken.multimodalRisk.status === 'high_risk' ? '涉政高危' : '安全'}
                  </Tag>
                </div>
                <div className="ot-report-item"><strong>违规标记：</strong> {selectedToken.multimodalRisk.tags.join(' | ') || '无'}</div>
                <div className="ot-report-item"><strong>OCR提取文本：</strong> {selectedToken.multimodalRisk.ocrText || '未提取到敏感文字'}</div>
                <div className="ot-report-item"><strong>判定详情：</strong> {selectedToken.multimodalRisk.details}</div>
              </div>

              {/* 多模态视觉大图高亮框 */}
              <div className="ot-visual-box">
                {renderTokenSVG(selectedToken.symbol)}
                {selectedToken.multimodalRisk.status === 'high_risk' && (
                  <>
                    {/* Bounding Box 1: 头像敏感区域 */}
                    <div className="ot-visual-bounding-box" style={{ top: '24%', left: '36%', width: '28%', height: '35%' }}>
                      <span className="ot-visual-label">敏感肖像相似度 98.4%</span>
                    </div>
                    {/* Bounding Box 2: 政治印章敏感区域 */}
                    {selectedToken.symbol === 'GOODLUCK' && (
                      <div className="ot-visual-bounding-box" style={{ top: '42%', left: '60%', width: '25%', height: '16%' }}>
                        <span className="ot-visual-label">敏感政治图章</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 代币基础信息 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col gap-2">
                <span className="font-semibold text-gray-700 text-sm">代币实体元数据</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <span><strong>代币名称:</strong> {selectedToken.name}</span>
                  <span><strong>Symbol:</strong> {selectedToken.symbol}</span>
                  <span className="col-span-2 flex items-center">
                    <strong>智能合约 (Solana):</strong> 
                    <Text className="font-mono text-gray-700 ml-1" copyable={{ text: selectedToken.contractAddress }}>
                      {selectedToken.contractAddress}
                    </Text>
                  </span>
                  <span><strong>创建时间:</strong> {selectedToken.createdTime}</span>
                  <span><strong>初始发行平台:</strong> {selectedToken.platform}</span>
                </div>
              </div>

              {/* 拦截与报送快捷处置 */}
              <div className="flex gap-4 mt-auto">
                <Button
                  type="primary"
                  danger
                  icon={<AlertOutlined />}
                  onClick={function () { handleInterceptToken(selectedToken.name); }}
                  className="flex-1"
                >
                  一键拦截分发 (阻断钱包/信源)
                </Button>
                <Button
                  icon={<CloudSyncOutlined />}
                  className="flex-1"
                  onClick={function () { message.success('已自动创建采集增量任务，进行跨链溯源'); }}
                >
                  启动全链追踪 (Solscan/Raydium)
                </Button>
              </div>

            </div>

            {/* 抽屉右栏：虚拟币趋势与解耦平台卡片 + 算分 */}
            <div className="ot-drawer-right">
              
              <div className="ot-crypto-section-title">
                虚拟币多平台数据指标与研判趋势
              </div>

              {/* 解耦平台卡片组 */}
              <div className="ot-crypto-platform-cards">
                
                {/* 1. Pump.fun 卡片 (发行/关注面) */}
                <div className="ot-crypto-platform-card">
                  <div className="ot-crypto-card-head">
                    <span className="ot-crypto-platform-badge ot-crypto-platform-badge--pump">Pump.fun (发行与热度)</span>
                    <span className="text-gray-400 text-xs">发行人: {selectedToken.pumpData.launcherAddress.slice(0, 6)}...</span>
                  </div>
                  <div className="ot-crypto-card-body-grid">
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">平台实时评论数</span>
                      <span className="ot-crypto-metric-value">{selectedToken.pumpData.commentsCount} 条</span>
                    </div>
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">系统内检索热度</span>
                      <span className="ot-crypto-metric-value">{selectedToken.systemSearchHeat} 次</span>
                    </div>
                  </div>
                  {/* 近期言论滚动面板 */}
                  <div className="ot-crypto-comments-mini">
                    {selectedToken.pumpData.recentComments.map(function (c, idx) {
                      return (
                        <div key={idx} className="ot-crypto-comment-mini-item">
                          <span className="font-semibold text-blue-500 mr-1">{c.author}:</span>
                          <span>{c.content}</span>
                          <span className="text-gray-400 ml-1">({c.time.split(' ')[1]})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Jupiter 卡片 (交易面/兑换) */}
                <div className="ot-crypto-platform-card">
                  <div className="ot-crypto-card-head">
                    <span className="ot-crypto-platform-badge ot-crypto-platform-badge--jup">Jupiter (交易与汇率)</span>
                    <span className={selectedToken.jupiterData.priceChange24h > 0 ? 'text-green-500 text-xs font-semibold' : 'text-red-500 text-xs font-semibold'}>
                      {selectedToken.jupiterData.priceChange24h > 0 ? '+' : ''}{selectedToken.jupiterData.priceChange24h}% (24h)
                    </span>
                  </div>
                  <div className="ot-crypto-card-body-grid">
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">当前兑换价</span>
                      <span className="ot-crypto-metric-value">${selectedToken.jupiterData.priceUsd}</span>
                    </div>
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">24h 交易金额 (USD)</span>
                      <span className="ot-crypto-metric-value">${selectedToken.jupiterData.volume24hUsd.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* SVG Sparkline 价格走势图 */}
                  <div className="ot-sparkline-container">
                    <svg width="100%" height="100%" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#52c41a" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#52c41a" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Price path area */}
                      <path
                        d={`M 0 ${40 - selectedToken.jupiterData.priceHistory[0]/2.5} 
                            L 20 ${40 - selectedToken.jupiterData.priceHistory[1]/2.5} 
                            L 40 ${40 - selectedToken.jupiterData.priceHistory[2]/2.5} 
                            L 60 ${40 - selectedToken.jupiterData.priceHistory[3]/2.5} 
                            L 80 ${40 - selectedToken.jupiterData.priceHistory[4]/2.5} 
                            L 100 ${40 - selectedToken.jupiterData.priceHistory[5]/2.5} 
                            L 120 ${40 - selectedToken.jupiterData.priceHistory[6]/2.5} 
                            L 140 ${40 - selectedToken.jupiterData.priceHistory[7]/2.5} 
                            L 160 ${40 - selectedToken.jupiterData.priceHistory[8]/2.5} 
                            L 200 ${40 - selectedToken.jupiterData.priceHistory[9]/2.5} 
                            L 200 40 L 0 40 Z`}
                        className="ot-sparkline-area"
                        fill="url(#sparklineGrad)"
                      />
                      {/* Price path stroke */}
                      <path
                        d={`M 0 ${40 - selectedToken.jupiterData.priceHistory[0]/2.5} 
                            L 20 ${40 - selectedToken.jupiterData.priceHistory[1]/2.5} 
                            L 40 ${40 - selectedToken.jupiterData.priceHistory[2]/2.5} 
                            L 60 ${40 - selectedToken.jupiterData.priceHistory[3]/2.5} 
                            L 80 ${40 - selectedToken.jupiterData.priceHistory[4]/2.5} 
                            L 100 ${40 - selectedToken.jupiterData.priceHistory[5]/2.5} 
                            L 120 ${40 - selectedToken.jupiterData.priceHistory[6]/2.5} 
                            L 140 ${40 - selectedToken.jupiterData.priceHistory[7]/2.5} 
                            L 160 ${40 - selectedToken.jupiterData.priceHistory[8]/2.5} 
                            L 200 ${40 - selectedToken.jupiterData.priceHistory[9]/2.5}`}
                        className="ot-sparkline-path"
                        stroke={selectedToken.jupiterData.priceChange24h > 0 ? '#52c41a' : '#f5222d'}
                      />
                    </svg>
                  </div>
                </div>

                {/* 3. Solscan 卡片 (链上/持币数) */}
                <div className="ot-crypto-platform-card">
                  <div className="ot-crypto-card-head">
                    <span className="ot-crypto-platform-badge ot-crypto-platform-badge--sol">Solscan (链上记账本)</span>
                    <span className="text-gray-400 text-xs">24h交易笔数: {selectedToken.solscanData.transferCount24h} 次</span>
                  </div>
                  <div className="ot-crypto-card-body-grid">
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">独立持币地址数</span>
                      <span className="ot-crypto-metric-value">{selectedToken.solscanData.holderCount} 个</span>
                    </div>
                    <div className="ot-crypto-metric">
                      <span className="ot-crypto-metric-label">前10大户持仓占比</span>
                      <span className="ot-crypto-metric-value">{selectedToken.solscanData.topTenRatio}%</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 加权算分模型控制 */}
              <div className="ot-crypto-section-title mt-4">
                指标加权级联分析模型
              </div>
              <div className="ot-weight-controller">
                <div className="ot-weight-row">
                  <div className="ot-weight-label">
                    <span>交易面影响力 (24h交易量 + 持币数)</span>
                    <span className="ot-weight-value-pct">{marketWeight}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    value={marketWeight}
                    onChange={function (val) {
                      setMarketWeight(val);
                      setSocialWeight(100 - val);
                    }}
                    tooltip={{ formatter: val => `${val}%` }}
                  />
                </div>
                <div className="ot-weight-row">
                  <div className="ot-weight-label">
                    <span>关注面影响力 (评论量 + 系统检索)</span>
                    <span className="ot-weight-value-pct">{socialWeight}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    value={socialWeight}
                    onChange={function (val) {
                      setSocialWeight(val);
                      setMarketWeight(100 - val);
                    }}
                    tooltip={{ formatter: val => `${val}%` }}
                  />
                </div>

                {/* 综合风险分数展示 */}
                <div className="ot-score-display">
                  <div className="flex flex-col">
                    <span className="ot-score-title">综合风险影响指数 (Risk Score)</span>
                    <span className="text-gray-400 text-xs mt-1">结合多模态违规等级与链上扩散评估</span>
                  </div>
                  <span className="ot-score-value">
                    {calculateScore(selectedToken, marketWeight, socialWeight)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OverseasTopics;
