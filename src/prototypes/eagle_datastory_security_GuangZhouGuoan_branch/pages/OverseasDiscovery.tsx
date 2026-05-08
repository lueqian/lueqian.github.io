/**
 * @name 海外发现 - 初始搜索页
 * @description 海外信息搜索入口页面，支持多平台、多语种、多维度筛选
 *
 * 页面结构：
 * - 顶部搜索区：大搜索框 + 搜索按钮 + 翻译助手
 * - 检索条件卡片：时间范围、海外站点、语种、国家地区、匹配方式、高级参数
 * - 搜索记录：标签云展示近期关键词
 *
 * @author 数说蓝鹰产品团队
 * @version 1.0.0
 * @date 2026-05-08
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Input, Button, DatePicker, Tag, Tooltip, Switch } from 'antd';
import {
  SearchOutlined,
  GlobalOutlined,
  TranslationOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

// ============ 类型定义 ============

type PlatformOption = {
  key: string;
  label: string;
  count?: number;
};

type LanguageOption = {
  key: string;
  label: string;
};

type CountryOption = {
  key: string;
  label: string;
};

type MatchTypeOption = {
  key: string;
  label: string;
  tooltip?: string;
};

// ============ 配置数据 ============

const PLATFORM_OPTIONS: PlatformOption[] = [
  { key: 'all', label: '全部' },
  { key: 'twitter', label: 'Twitter' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'Youtube' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'news', label: '境外新闻' },
  { key: 'telegram', label: 'Telegram' },
];

const LANGUAGE_OPTIONS: LanguageOption[] = [
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

const COUNTRY_OPTIONS: CountryOption[] = [
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

const MATCH_TYPE_OPTIONS: MatchTypeOption[] = [
  { key: 'all', label: '全部' },
  { key: 'title', label: '标题' },
  { key: 'content', label: '正文' },
  { key: 'author', label: '作者' },
  { key: 'image', label: '图片识别', tooltip: '通过AI识别图片内容' },
  { key: 'video', label: '视频封面图', tooltip: '分析视频封面内容' },
  { key: 'group', label: '群组', tooltip: 'TG群组搜索' },
];

const INFO_TYPE_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'original', label: '原创' },
  { key: 'repost', label: '转载' },
  { key: 'comment', label: '评论' },
];

// 搜索记录模拟数据
const RECENT_SEARCHES = [
  'AI', 'AI', 'Polymarket', 'Polymarket', 'Polymarket', '大清洗', 'Polymarket 李强', '李强', '高达',
];

// ============ 主组件 ============

const OverseasDiscovery: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['all']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['all']);
  const [selectedMatchType, setSelectedMatchType] = useState<string>('all');
  const [selectedInfoType, setSelectedInfoType] = useState<string>('all');
  const [smartFilter, setSmartFilter] = useState<boolean>(false);

  // 处理搜索
  const handleSearch = useCallback(() => {
    console.log('搜索关键词:', searchKeyword);
  }, [searchKeyword]);

  // 处理翻译助手
  const handleTranslate = useCallback(() => {
    console.log('翻译助手:', searchKeyword);
  }, [searchKeyword]);

  // 处理平台选择
  const handlePlatformSelect = useCallback((key: string) => {
    setSelectedPlatform(key);
  }, []);

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

  // 渲染顶部搜索区
  const renderSearchHeader = () => (
    <div className="os-search-header">
      <div className="os-search-box">
        <Input
          className="os-search-input"
          placeholder="输入关键词，支持逻辑运算"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          suffix={<span className="os-input-suffix">0/200</span>}
        />
        <Button type="primary" className="os-search-btn" onClick={handleSearch}>
          搜索
        </Button>
        <Button className="os-translate-btn" icon={<TranslationOutlined />} onClick={handleTranslate}>
          翻译助手
        </Button>
      </div>
      <div className="os-search-tips">
        <InfoCircleOutlined style={{ fontSize: 12, marginRight: 4 }} />
        了解更多检索方式，如支持特殊符号检索
      </div>
    </div>
  );

  // 渲染筛选标签组
  const renderFilterTags = (
    options: { key: string; label: string }[],
    selected: string | string[],
    onSelect: (key: string) => void,
    showMore?: boolean,
    moreCount?: number
  ) => (
    <div className="os-filter-tags">
      {options.map((opt) => {
        const isSelected = Array.isArray(selected)
          ? selected.includes(opt.key)
          : selected === opt.key;
        return (
          <Tag
            key={opt.key}
            className={`os-filter-tag ${isSelected ? 'os-filter-tag--active' : ''}`}
            onClick={() => onSelect(opt.key)}
          >
            {opt.label}
          </Tag>
        );
      })}
      {showMore && (
        <span className="os-filter-more">+{moreCount} 查看全部</span>
      )}
    </div>
  );

  // 渲染检索条件卡片
  const renderFilterCard = () => (
    <div className="os-filter-card">
      <div className="os-filter-title">检索条件</div>

      {/* 时间范围 */}
      <div className="os-filter-row">
        <span className="os-filter-label">时间范围：</span>
        <RangePicker
          className="os-range-picker"
          showTime
          defaultValue={[null, null]}
          placeholder={['2026-05-01 00:00:00', '2026-05-08 23:59:59']}
        />
      </div>

      {/* 海外站点 */}
      <div className="os-filter-row">
        <span className="os-filter-label">海外站点：</span>
        <div className="os-platform-tags">
          {PLATFORM_OPTIONS.map((platform) => (
            <Button
              key={platform.key}
              className={`os-platform-btn ${selectedPlatform === platform.key ? 'os-platform-btn--active' : ''} ${platform.key === 'telegram' ? 'os-platform-btn--telegram' : ''}`}
              onClick={() => handlePlatformSelect(platform.key)}
            >
              {platform.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 语种 */}
      <div className="os-filter-row">
        <span className="os-filter-label">语种：</span>
        {renderFilterTags(LANGUAGE_OPTIONS, selectedLanguages, handleLanguageSelect, true, 147)}
      </div>

      {/* 国家与地区 */}
      <div className="os-filter-row">
        <span className="os-filter-label">国家与地区：</span>
        {renderFilterTags(COUNTRY_OPTIONS, selectedCountries, handleCountrySelect, true, 208)}
      </div>

      {/* 匹配方式 */}
      <div className="os-filter-row">
        <span className="os-filter-label">匹配方式：</span>
        <div className="os-match-tags">
          {MATCH_TYPE_OPTIONS.map((match) => (
            <span
              key={match.key}
              className={`os-match-tag ${selectedMatchType === match.key ? 'os-match-tag--active' : ''}`}
              onClick={() => setSelectedMatchType(match.key)}
            >
              {match.label}
              {match.tooltip && (
                <Tooltip title={match.tooltip}>
                  <InfoCircleOutlined className="os-match-icon" />
                </Tooltip>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 信息类型 */}
      <div className="os-filter-row">
        <span className="os-filter-label">信息类型：</span>
        <div className="os-info-type-tags">
          {INFO_TYPE_OPTIONS.map((type) => (
            <Tag
              key={type.key}
              className={`os-info-type-tag ${selectedInfoType === type.key ? 'os-info-type-tag--active' : ''}`}
              onClick={() => setSelectedInfoType(type.key)}
            >
              {type.label}
            </Tag>
          ))}
        </div>
      </div>

      {/* 高级参数 */}
      <div className="os-advanced-section">
        <div className="os-advanced-row">
          <span className="os-advanced-label">指定作者：</span>
          <Input
            className="os-advanced-input"
            placeholder="如Barack Obama，多个用逗号隔开"
            suffix={<span className="os-input-count">0/50</span>}
          />
        </div>
        <div className="os-advanced-row">
          <span className="os-advanced-label">指定站点：</span>
          <Input
            className="os-advanced-input"
            placeholder="如谷歌，多个用逗号隔开"
            suffix={<span className="os-input-count">0/50</span>}
          />
        </div>
        <div className="os-advanced-row">
          <span className="os-advanced-label">指定域名：</span>
          <Input
            className="os-advanced-input"
            placeholder="一级域名，如google.com，多个用逗号隔开"
            suffix={<span className="os-input-count">0/50</span>}
          />
        </div>
        <div className="os-advanced-row">
          <span className="os-advanced-label">排除域名：</span>
          <Input
            className="os-advanced-input"
            placeholder="一级域名，如google.com，多个用逗号隔开"
            suffix={<span className="os-input-count">0/50</span>}
          />
        </div>
        <div className="os-advanced-row">
          <span className="os-advanced-label">定向信源：</span>
          <Input
            className="os-advanced-input"
            placeholder="请选择定向信源，可多选"
            suffix={<Button type="link" className="os-set-source-btn">设置定向信源</Button>}
          />
        </div>
        <div className="os-advanced-row">
          <span className="os-advanced-label">过滤词：</span>
          <Input
            className="os-advanced-input"
            placeholder="请输入过滤词"
            suffix={
              <>
                <span className="os-input-count">0/50</span>
                <Tooltip title="排除包含这些词的内容">
                  <InfoCircleOutlined style={{ marginLeft: 4, color: '#9ca3af' }} />
                </Tooltip>
              </>
            }
          />
        </div>
        <div className="os-advanced-row os-smart-filter-row">
          <span className="os-advanced-label">智能过滤：</span>
          <Switch checked={smartFilter} onChange={setSmartFilter} size="small" />
          <Tooltip title="智能过滤低质量内容">
            <InfoCircleOutlined style={{ marginLeft: 4, color: '#9ca3af' }} />
          </Tooltip>
        </div>
      </div>
    </div>
  );

  // 渲染搜索记录
  const renderSearchHistory = () => (
    <div className="os-search-history">
      <div className="os-history-header">
        <span className="os-history-title">搜索记录</span>
        <div className="os-history-actions">
          <span className="os-history-action">展开</span>
          <span className="os-history-divider">|</span>
          <span className="os-history-action os-history-action--danger">
            <CloseOutlined style={{ fontSize: 10 }} /> 清空
          </span>
        </div>
      </div>
      <div className="os-history-tags">
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
  );

  return (
    <div className="os-discovery-page">
      {renderSearchHeader()}
      {renderFilterCard()}
      {renderSearchHistory()}
    </div>
  );
};

export default OverseasDiscovery;
