/**
 * @name 海外发现 - 搜索结果详情页
 * @description 海外信息搜索结果展示页面，三栏式布局
 *
 * 页面结构：
 * - 左侧：搜索结果列表流
 * - 右侧：快捷筛选栏（精简版检索条件）
 * - 顶部：平台筛选Tab
 *
 * @author 数说蓝鹰产品团队
 * @version 1.0.0
 * @date 2026-05-08
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Input, Button, Tag, Tooltip, Pagination } from 'antd';
import {
  SearchOutlined,
  GlobalOutlined,
  TwitterOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  FileTextOutlined,
  FlagOutlined,
  CopyOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

type PlatformTab = {
  key: string;
  label: string;
  count: number;
  icon?: React.ReactNode;
};

type SearchResultItem = {
  id: number;
  title: string;
  titleHighlight?: string;
  isOriginal: boolean;
  platform: string;
  platformIcon: string;
  author: string;
  country: string;
  publishTime: string;
  content: string;
  translation: string;
  hasVideo?: boolean;
};

// ============ 配置数据 ============

const PLATFORM_TABS: PlatformTab[] = [
  { key: 'all', label: '全部', count: 15576949 },
  { key: 'twitter', label: 'Twitter', count: 10157018, icon: <TwitterOutlined /> },
  { key: 'facebook', label: 'Facebook', count: 670903, icon: <FacebookOutlined /> },
  { key: 'youtube', label: 'Youtube', count: 992626, icon: <YoutubeOutlined /> },
  { key: 'tiktok', label: 'TikTok', count: 1974240 },
  { key: 'telegram', label: 'Telegram', count: 847263, icon: <SendOutlined /> },
  { key: 'news', label: '境外新闻', count: 1787349, icon: <FileTextOutlined /> },
];

const LANGUAGE_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'zh', label: '中文' },
  { key: 'en', label: '英语' },
  { key: 'ja', label: '日语' },
  { key: 'es', label: '西班牙语' },
  { key: 'th', label: '泰语' },
  { key: 'ar', label: '阿拉伯语' },
  { key: 'tr', label: '土耳其语' },
  { key: 'pt', label: '葡萄牙语' },
  { key: 'ko', label: '韩语' },
  { key: 'id', label: '印度尼西亚语' },
];

const COUNTRY_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'us', label: '美国' },
  { key: 'cn', label: '中国' },
  { key: 'ru', label: '俄罗斯' },
  { key: 'gb', label: '英国' },
  { key: 'fr', label: '法国' },
  { key: 'jp', label: '日本' },
  { key: 'in', label: '印度' },
  { key: 'kr', label: '韩国' },
  { key: 'vn', label: '越南' },
  { key: 'de', label: '德国' },
];

const MATCH_TYPE_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'title', label: '标题' },
  { key: 'content', label: '正文' },
  { key: 'author', label: '作者' },
  { key: 'image', label: '图片识别' },
  { key: 'video', label: '视频封面图' },
  { key: 'group', label: '群组' },
];

// TG专项搜索模拟数据
const MOCK_TG_RESULTS: SearchResultItem[] = [
  {
    id: 101,
    title: '加密通讯工具使用指南 - Signal/Telegram 安全配置',
    titleHighlight: '加密通讯',
    isOriginal: true,
    platform: 'telegram',
    platformIcon: 'TG',
    author: '@Insider_7',
    country: 'RU',
    publishTime: '2026-05-08 13:42:15',
    content: '使用端到端加密通讯工具时，建议开启自动删除消息功能。Telegram可在"隐私与安全"设置中配置Secret Chat默认自毁时间。Signal则支持 disappearing messages 功能。建议使用独立设备注册，避免与个人账号关联。',
    translation: '使用端到端加密通讯工具时，建议开启自动删除消息功能。Telegram可在"隐私与安全"设置中配置Secret Chat默认自毁时间。Signal则支持消失消息功能。建议使用独立设备注册，避免与个人账号关联。',
  },
  {
    id: 102,
    title: '跨平台加密通讯协议对比分析 - 安全性评估',
    titleHighlight: '加密通讯',
    isOriginal: true,
    platform: 'telegram',
    platformIcon: 'TG',
    author: '@CryptoWatch_3',
    country: 'US',
    publishTime: '2026-05-08 13:38:47',
    content: '本文对Signal Protocol、MTProto 2.0、Matrix协议进行安全性对比。MTProto 2.0在服务器端不存储消息的前提下实现了快速同步，但存在已知的前端加密实现弱点。建议在处理高度敏感信息时优先使用Signal。',
    translation: '本文对Signal协议、MTProto 2.0、Matrix协议进行安全性对比。MTProto 2.0在服务器端不存储消息的前提下实现了快速同步，但存在已知的前端加密实现弱点。建议在处理高度敏感信息时优先使用Signal。',
  },
  {
    id: 103,
    title: '匿名通讯操作指引 - 身份保护最佳实践',
    titleHighlight: '加密通讯',
    isOriginal: false,
    platform: 'telegram',
    platformIcon: 'TG',
    author: '@AnonOps_12',
    country: 'DE',
    publishTime: '2026-05-08 13:35:20',
    content: '在进行敏感通讯时，务必使用VPN + Tor双重匿名保护。Telegram账号注册时应使用临时虚拟号码，禁止绑定个人手机号。建议使用Briar或Session等去中心化通讯工具作为备用方案。定期更换设备指纹信息。',
    translation: '在进行敏感通讯时，务必使用VPN + Tor双重匿名保护。Telegram账号注册时应使用临时虚拟号码，禁止绑定个人手机号。建议使用Briar或Session等去中心化通讯工具作为备用方案。定期更换设备指纹信息。',
  },
  {
    id: 104,
    title: '加密通讯群组管理策略 - 信息隔离与权限控制',
    titleHighlight: '加密通讯',
    isOriginal: true,
    platform: 'telegram',
    platformIcon: 'TG',
    author: '@SecureGroup_9',
    country: 'CN',
    publishTime: '2026-05-08 13:29:55',
    content: '管理加密通讯群组时，建议启用"仅管理员可邀请成员"功能。设置群组消息历史可见性为"不可见"。定期审查群组成员列表，移除不活跃账号。重要决策应在Secret Chat中一对一沟通，避免在群组内讨论。',
    translation: '管理加密通讯群组时，建议启用"仅管理员可邀请成员"功能。设置群组消息历史可见性为"不可见"。定期审查群组成员列表，移除不活跃账号。重要决策应在Secret Chat中一对一沟通，避免在群组内讨论。',
  },
  {
    id: 105,
    title: '加密通讯取证技术 - 执法部门数据获取方法',
    titleHighlight: '加密通讯',
    isOriginal: true,
    platform: 'telegram',
    platformIcon: 'TG',
    author: '@ForensicTech_5',
    country: 'UK',
    publishTime: '2026-05-08 13:22:08',
    content: '针对端到端加密通讯的取证，主要方法包括：设备端数据提取、元数据分析（通信时间、频率、联系人网络）、流量分析。Telegram的MTProto协议虽加密消息内容，但元数据仍可被获取。建议结合社工手段与信号情报进行综合分析。',
    translation: '针对端到端加密通讯的取证，主要方法包括：设备端数据提取、元数据分析（通信时间、频率、联系人网络）、流量分析。Telegram的MTProto协议虽加密消息内容，但元数据仍可被获取。建议结合社工手段与信号情报进行综合分析。',
  },
];

// 通用搜索结果模拟数据
const MOCK_RESULTS: SearchResultItem[] = [
  {
    id: 1,
    title: '인투더에이',
    titleHighlight: '인투더에이',
    isOriginal: true,
    platform: 'news',
    platformIcon: '原',
    author: '仁川今日新闻',
    country: 'KR',
    publishTime: '2026-05-08 14:09:43',
    content: '교양 인투더에이[INTO-AI]-김윤정 기자 05-06 11:01',
    translation: '教养 INTO-AI - 金允贞记者 05-06 11:01',
  },
  {
    id: 2,
    title: 'Brace for the patch tsunami: AI is unearthing decades of buried code debt',
    titleHighlight: 'AI',
    isOriginal: true,
    platform: 'news',
    platformIcon: '原',
    author: 'The Register',
    country: 'US',
    publishTime: '2026-05-08 14:09:28',
    content: 'They provide a shining example of what government can achieve when it has adequate resources, and when the needs of communities and families are the main drivers of investment decisions. The pandemic recession that began so suddenly in March 2020 was the biggest economic shock the country has seen since the Great Recession that started in 2008. Comparing the distinctly different policy responses to those two crises demonstrates how important SLFRF was to speeding the economic recovery and to preventing a second Great Recession.',
    translation: '它们提供了一个光辉的范例，说明当政府拥有充足资源时，以及当社区和家庭的需求成为投资决策的主要驱动力时，政府能够取得什么成就。2020年3月突然开始的大流行衰退是该国自2008年开始的大衰退以来最大的经济冲击。比较对这两次危机截然不同的政策反应，说明了SLFRF对加快经济复苏和防止第二次大衰退有多么重要。',
  },
  {
    id: 3,
    title: '엔비디아, 4.6조 투자...구글의 대선 광공유가 뜨다 [비밋다이브]',
    titleHighlight: '구글',
    isOriginal: true,
    platform: 'news',
    platformIcon: '原',
    author: 'AI 대학원생',
    country: 'KR',
    publishTime: '2026-05-08 14:08:50',
    content: '<젤카-엔비디아의 AI 대학원생 토론에 활용되는 구글신을 전용으로 바꾸고 있으며 국내 광물산업 기업들이 불쁘고 있습니다.다만 일부 기업의 경우 수출 규제가 불확실해 신중한 접근이 필요합니다.[미션타임라인] 경쟁사 기자 나와부터 보입니다. 그 기자, 먼저 AI부터 말했습니다. 광물산업과 다른 광물산업은 어떻게 다른 겁니까?>[미션타임라인] "...',
    translation: '<Zelka-用于NVIDIA AI研究生讨论的谷歌神正在改为专用，国内矿物产业企业们正在蓬勃发展。但是部分企业由于出口限制不确定，需要谨慎接近。[任务时间线] 竞争对手记者已经出来了。那个记者，首先说了AI。矿物产业和其他矿物产业有什么不同？[任务时间线] "...',
  },
  {
    id: 4,
    title: 'AI Holding the line: State solutions to the U.S. worker rights crisis',
    titleHighlight: 'AI',
    isOriginal: false,
    platform: 'news',
    platformIcon: '原',
    author: '经济政策研究所',
    country: 'US',
    publishTime: '2026-05-08 14:07:26',
    content: 'Celine McNicholas is the director of policy and government affairs/general counsel at the Economic Policy Institute, a nonprofit, nonpartisan think tank that uses the power of its research on economic trends and the impact of economic policies to advance reforms that serve working people, deliver racial justice, and guarantee gender equity.',
    translation: 'Celine McNicholas是经济政策研究所的政策和政府事务/总法律顾问主任，该研究所是一个非营利、无党派的智库，利用其对经济趋势和经济政策影响的研究力量，推进为劳动人民服务、实现种族正义和保障性别平等的改革。',
  },
  {
    id: 5,
    title: 'KISA, 차세대 보안기술 분야 18개 과제 착수...50개 수행 업체 선정',
    titleHighlight: 'AI',
    isOriginal: true,
    platform: 'news',
    platformIcon: '原',
    author: '인공지능(AI) 기반',
    country: 'KR',
    publishTime: '2026-05-08 14:06:50',
    content: 'KISA는 8일 인공지능(AI) 기반 차세대 보안 제품·서비스 개발 및 활성화를 위한 모델 개발 및 시범서비스 도입 등 4대 분야에서 총 120억4000만원 규모로 18개 과제를 공모해 지난 4월까지 총 50개 수행기업을 선정했다고 밝혔다.',
    translation: 'KISA于8日表示，为了开发和激活基于人工智能(AI)的下一代安全产品·服务，在模型开发及示范服务引进等4大领域，以总规模120亿4000万韩元公开招募了18个课题，到4月为止共选定了50个执行企业。',
  },
];

// 搜索记录
const RECENT_SEARCHES = ['AI', 'Polymarket', '大清洗', '李强', '高达'];

// ============ 主组件 ============

const OverseasResults: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<string>('telegram');
  const [searchKeyword, setSearchKeyword] = useState<string>('加密通讯');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['all']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['all']);
  const [selectedMatchType, setSelectedMatchType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 处理平台切换
  const handlePlatformChange = useCallback((key: string) => {
    setActivePlatform(key);
  }, []);

  // 处理搜索
  const handleSearch = useCallback(() => {
    console.log('搜索:', searchKeyword);
  }, [searchKeyword]);

  // 处理语种选择
  const handleLanguageSelect = useCallback((key: string) => {
    if (key === 'all') {
      setSelectedLanguages(['all']);
      return;
    }
    setSelectedLanguages((prev) => {
      const filtered = prev.filter((k) => k !== 'all');
      if (filtered.includes(key)) {
        const result = filtered.filter((k) => k !== key);
        return result.length === 0 ? ['all'] : result;
      }
      return [...filtered, key];
    });
  }, []);

  // 处理国家选择
  const handleCountrySelect = useCallback((key: string) => {
    if (key === 'all') {
      setSelectedCountries(['all']);
      return;
    }
    setSelectedCountries((prev) => {
      const filtered = prev.filter((k) => k !== 'all');
      if (filtered.includes(key)) {
        const result = filtered.filter((k) => k !== key);
        return result.length === 0 ? ['all'] : result;
      }
      return [...filtered, key];
    });
  }, []);

  // 渲染平台筛选Tab
  const renderPlatformTabs = () => (
    <div className="os-platform-tabs">
      {PLATFORM_TABS.map((tab) => (
        <div
          key={tab.key}
          className={`os-platform-tab ${activePlatform === tab.key ? 'os-platform-tab--active' : ''}`}
          onClick={() => handlePlatformChange(tab.key)}
        >
          {tab.icon && <span className="os-platform-icon">{tab.icon}</span>}
          <span className="os-platform-label">{tab.label}</span>
          <span className="os-platform-count">({tab.count.toLocaleString()})</span>
        </div>
      ))}
    </div>
  );

  // 渲染搜索结果列表
  const renderResultsList = () => {
    const isTG = activePlatform === 'telegram';
    const displayResults = isTG ? MOCK_TG_RESULTS : MOCK_RESULTS;

    return (
      <div className="os-results-list">
        {displayResults.map((item, index) => (
          <div key={item.id} className="os-result-item">
            {/* 序号 */}
            <div className="os-result-index">{index + 1}</div>
            
            {/* 内容区 */}
            <div className="os-result-content">
              {/* 标题行 */}
              <div className="os-result-title-row">
                <span className="os-result-title">
                  {item.titleHighlight ? (
                    <>
                      {item.title.split(item.titleHighlight)[0]}
                      <span className="os-highlight">{item.titleHighlight}</span>
                      {item.title.split(item.titleHighlight)[1]}
                    </>
                  ) : (
                    item.title
                  )}
                </span>
                {item.isOriginal && (
                  <Tag className="os-original-tag" icon={<CheckCircleOutlined />}>
                    原创
                  </Tag>
                )}
              </div>

              {/* 元数据行 */}
              <div className="os-result-meta">
                <ClockCircleOutlined style={{ fontSize: 12, color: '#9ca3af' }} />
                <span className="os-meta-time">{item.publishTime}</span>
                <span className="os-meta-divider">|</span>
                {isTG ? (
                  <SendOutlined className="os-tg-icon" />
                ) : (
                  <span className="os-meta-platform">{item.platformIcon}</span>
                )}
                <span className="os-meta-source">{item.author}</span>
                <span className="os-meta-divider">|</span>
                <EnvironmentOutlined style={{ fontSize: 12, color: '#9ca3af' }} />
                <span className="os-meta-country">{item.country}</span>
              </div>

              {/* 正文区 */}
              <div className="os-result-body">
                <p className="os-result-text">{item.content}</p>
                <div className="os-translation-box">
                  <span className="os-translation-label">NLP 翻译：</span>
                  <span className="os-translation-text">{item.translation}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="os-result-actions">
                <Button type="link" className="os-action-btn" icon={<FlagOutlined />}>
                  一键提报
                </Button>
                <Button type="link" className="os-action-btn" icon={<CopyOutlined />}>
                  复制信息
                </Button>
                <Button type="link" className="os-action-btn" icon={<EyeOutlined />}>
                  查看原文
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染右侧筛选栏
  const renderRightSidebar = () => (
    <div className="os-right-sidebar">
      {/* 顶部搜索 */}
      <div className="os-sidebar-search">
        <Input
          className="os-sidebar-input"
          placeholder="输入关键词后点击搜索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          suffix={
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            />
          }
        />
      </div>

      {/* 检索条件 */}
      <div className="os-sidebar-section">
        <div className="os-sidebar-title">检索条件</div>
        
        {/* 海外站点 */}
        <div className="os-sidebar-row">
          <span className="os-sidebar-label">海外站点：</span>
          <div className="os-sidebar-tags">
            {['全部', 'Twitter', 'Facebook', 'Youtube', 'Telegram'].map((tag) => (
              <Tag
                key={tag}
                className={`os-sidebar-tag ${tag === 'Telegram' ? 'os-sidebar-tag--active' : ''}`}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {/* 语种 */}
        <div className="os-sidebar-row">
          <span className="os-sidebar-label">语种：</span>
          <div className="os-sidebar-tags">
            {LANGUAGE_OPTIONS.slice(0, 6).map((lang) => (
              <Tag
                key={lang.key}
                className={`os-sidebar-tag ${selectedLanguages.includes(lang.key) ? 'os-sidebar-tag--active' : ''}`}
                onClick={() => handleLanguageSelect(lang.key)}
              >
                {lang.label}
              </Tag>
            ))}
            <span className="os-sidebar-more">+147 查看全部</span>
          </div>
        </div>

        {/* 国家与地区 */}
        <div className="os-sidebar-row">
          <span className="os-sidebar-label">国家与地区：</span>
          <div className="os-sidebar-tags">
            {COUNTRY_OPTIONS.slice(0, 6).map((country) => (
              <Tag
                key={country.key}
                className={`os-sidebar-tag ${selectedCountries.includes(country.key) ? 'os-sidebar-tag--active' : ''}`}
                onClick={() => handleCountrySelect(country.key)}
              >
                {country.label}
              </Tag>
            ))}
            <span className="os-sidebar-more">+208 查看全部</span>
          </div>
        </div>

        {/* 匹配方式 */}
        <div className="os-sidebar-row">
          <span className="os-sidebar-label">匹配方式：</span>
          <div className="os-sidebar-tags">
            {MATCH_TYPE_OPTIONS.map((match) => (
              <Tag
                key={match.key}
                className={`os-sidebar-tag ${selectedMatchType === match.key ? 'os-sidebar-tag--active' : ''}`}
                onClick={() => setSelectedMatchType(match.key)}
              >
                {match.label}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {/* 搜索记录 */}
      <div className="os-sidebar-section">
        <div className="os-sidebar-title">搜索记录</div>
        <div className="os-sidebar-history">
          {RECENT_SEARCHES.map((keyword, index) => (
            <Tag
              key={`${keyword}-${index}`}
              className="os-history-tag"
              onClick={() => setSearchKeyword(keyword)}
            >
              {keyword}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="os-results-page">
      <div className="os-results-main">
        {/* 平台筛选Tab */}
        {renderPlatformTabs()}
        
        {/* 搜索结果列表 */}
        {renderResultsList()}
        
        {/* 分页 */}
        <div className="os-pagination-bar">
          <div className="os-pagination-left">
            <span className="os-pagination-info">
              共 {activePlatform === 'telegram' ? '847,263' : '15,576,949'} 条数据
            </span>
          </div>
          <div className="os-pagination-right">
            <Pagination
              current={currentPage}
              pageSize={20}
              total={activePlatform === 'telegram' ? 847263 : 15576949}
              showSizeChanger={false}
              showQuickJumper
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      
      {/* 右侧筛选栏 */}
      {renderRightSidebar()}
    </div>
  );
};

export default OverseasResults;
