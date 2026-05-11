/**
 * @name 海外专题页面
 * @description 广州国安定制版 - 海外信息检索与专题分析
 *
 * 包含：
 * - 搜索栏（关键词输入、翻译助手）
 * - 检索条件面板（时间范围、海外站点、语种、国家地区、匹配方式、信息类型等）
 * - 搜索历史
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Input, Button, Select, DatePicker, Switch, Tooltip, Collapse, message } from 'antd';
import {
  SearchOutlined,
  TranslationOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// ============ 常量配置 ============

// 海外站点选项
const OVERSEAS_SITES = [
  { value: 'all', label: '全部' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'Youtube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'foreign_news', label: '境外新闻' },
  { value: 'telegram', label: 'Telegram' },
];

// 语种选项
const LANGUAGES = [
  { value: 'all', label: '全部' },
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'es', label: '西班牙语' },
  { value: 'th', label: '泰语' },
  { value: 'ar', label: '阿拉伯语' },
  { value: 'tr', label: '土耳其语' },
  { value: 'pt', label: '葡萄牙语' },
  { value: 'ko', label: '韩语' },
  { value: 'id', label: '印度尼西亚语' },
];

// 国家与地区选项
const COUNTRIES = [
  { value: 'all', label: '全部' },
  { value: 'us', label: '美国' },
  { value: 'cn', label: '中国' },
  { value: 'ru', label: '俄罗斯' },
  { value: 'uk', label: '英国' },
  { value: 'fr', label: '法国' },
  { value: 'jp', label: '日本' },
  { value: 'in', label: '印度' },
  { value: 'kr', label: '韩国' },
  { value: 'vn', label: '越南' },
  { value: 'de', label: '德国' },
];

// 匹配方式选项
const MATCH_METHODS = [
  { value: 'all', label: '全部' },
  { value: 'title', label: '标题' },
  { value: 'body', label: '正文' },
  { value: 'author', label: '作者' },
  { value: 'image', label: '图片识别' },
  { value: 'video', label: '视频封面图' },
  { value: 'group', label: '群组' },
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
  '美国领事馆',
  '美国大使馆',
  '北京',
  '北京上访',
  '北京访民',
  '北京 特朗普',
  '汉坦',
  'Hantavirus',
  'Hantavirus Covid',
];

// ============ 主组件 ============

const OverseasTopics: React.FC = function () {
  // 搜索关键词
  const [keyword, setKeyword] = useState('');
  // 时间范围
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'days').startOf('day'),
    dayjs().endOf('day'),
  ]);
  // 筛选条件
  const [overseasSite, setOverseasSite] = useState('all');
  const [language, setLanguage] = useState('all');
  const [country, setCountry] = useState('all');
  const [matchMethod, setMatchMethod] = useState('all');
  const [infoType, setInfoType] = useState('all');
  // 高级筛选
  const [specifiedAuthor, setSpecifiedAuthor] = useState('');
  const [specifiedSite, setSpecifiedSite] = useState('');
  const [specifiedDomain, setSpecifiedDomain] = useState('');
  const [excludeDomain, setExcludeDomain] = useState('');
  const [filterWords, setFilterWords] = useState('');
  const [smartFilter, setSmartFilter] = useState(false);
  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>(MOCK_SEARCH_HISTORY);
  const [historyExpanded, setHistoryExpanded] = useState(true);

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
    message.success('搜索请求已提交');
  }, [keyword]);

  // 清空搜索历史
  const handleClearHistory = useCallback(function () {
    setSearchHistory([]);
    message.success('搜索历史已清空');
  }, []);

  // 点击历史记录
  const handleHistoryClick = useCallback(function (text: string) {
    setKeyword(text);
  }, []);

  // 渲染筛选标签
  const renderFilterTags = function (options: Array<{ value: string; label: string }>, value: string, onChange: (v: string) => void) {
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

  return (
    <div className="ot-container">
      {/* 顶部搜索区 */}
      <div className="ot-search-header">
        <div className="ot-search-main">
          <Input
            placeholder="输入关键词搜索，支持逻辑运算"
            value={keyword}
            onChange={function (e) { setKeyword(e.target.value); }}
            onPressEnter={handleSearch}
            className="ot-search-input"
            maxLength={200}
            allowClear
          />
          <div className="ot-search-actions">
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<TranslationOutlined />}>
              翻译助手
            </Button>
          </div>
        </div>
        <div className="ot-search-help">
          <a href="#">了解更多检索方式，如支持特殊符号检索</a>
        </div>
      </div>

      {/* 检索条件面板 */}
      <div className="ot-filter-panel">
        <div className="ot-filter-header">
          <span className="ot-filter-title">检索条件</span>
        </div>

        {/* 时间范围 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">
            时间范围
            <Tooltip title="选择信息发布的时间范围">
              <InfoCircleOutlined className="ot-filter-info" />
            </Tooltip>
          </div>
          <div className="ot-filter-content">
            <RangePicker
              showTime
              value={dateRange}
              onChange={function (dates) { dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]); }}
              style={{ width: 400 }}
              placeholder={['开始时间', '结束时间']}
            />
          </div>
        </div>

        {/* 海外站点 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">海外站点</div>
          <div className="ot-filter-content">
            {renderFilterTags(OVERSEAS_SITES, overseasSite, setOverseasSite)}
          </div>
        </div>

        {/* 语种 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">语种</div>
          <div className="ot-filter-content">
            {renderFilterTags(LANGUAGES, language, setLanguage)}
            <span className="ot-filter-more">+147</span>
          </div>
        </div>

        {/* 国家与地区 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">国家与地区</div>
          <div className="ot-filter-content">
            {renderFilterTags(COUNTRIES, country, setCountry)}
            <span className="ot-filter-more">+208</span>
          </div>
        </div>

        {/* 匹配方式 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">
            匹配方式
            <Tooltip title="选择关键词匹配的位置">
              <InfoCircleOutlined className="ot-filter-info" />
            </Tooltip>
          </div>
          <div className="ot-filter-content">
            {renderFilterTags(MATCH_METHODS, matchMethod, setMatchMethod)}
          </div>
        </div>

        {/* 信息类型 */}
        <div className="ot-filter-row">
          <div className="ot-filter-label">信息类型</div>
          <div className="ot-filter-content">
            {renderFilterTags(INFO_TYPES, infoType, setInfoType)}
          </div>
        </div>

        {/* 高级筛选 */}
        <Collapse
          bordered={false}
          className="ot-advanced-collapse"
          expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
          items={[
            {
              key: '1',
              label: '高级筛选',
              children: (
                <div className="ot-advanced-filters">
                  <div className="ot-advanced-row">
                    <div className="ot-advanced-item">
                      <label>指定作者</label>
                      <Input
                        placeholder="如：Barack Obama，多个用逗号隔开"
                        value={specifiedAuthor}
                        onChange={function (e) { setSpecifiedAuthor(e.target.value); }}
                        maxLength={50}
                        showCount
                      />
                    </div>
                    <div className="ot-advanced-item">
                      <label>指定站点</label>
                      <Input
                        placeholder="请输入站点，多个用逗号隔开"
                        value={specifiedSite}
                        onChange={function (e) { setSpecifiedSite(e.target.value); }}
                        maxLength={50}
                        showCount
                      />
                    </div>
                  </div>
                  <div className="ot-advanced-row">
                    <div className="ot-advanced-item">
                      <label>指定域名</label>
                      <Input
                        placeholder="如：google.com，多个用逗号隔开"
                        value={specifiedDomain}
                        onChange={function (e) { setSpecifiedDomain(e.target.value); }}
                        maxLength={50}
                        showCount
                      />
                    </div>
                    <div className="ot-advanced-item">
                      <label>排除域名</label>
                      <Input
                        placeholder="请输入域名，多个用逗号隔开"
                        value={excludeDomain}
                        onChange={function (e) { setExcludeDomain(e.target.value); }}
                        maxLength={50}
                        showCount
                      />
                    </div>
                  </div>
                  <div className="ot-advanced-row">
                    <div className="ot-advanced-item">
                      <label>定向信源</label>
                      <Select
                        placeholder="请选择定向信源"
                        style={{ width: '100%' }}
                        options={[{ value: 'source1', label: '信源1' }, { value: 'source2', label: '信源2' }]}
                        suffixIcon={<a href="#" className="ot-source-link">设置定向信源</a>}
                      />
                    </div>
                    <div className="ot-advanced-item">
                      <label>过滤词</label>
                      <Input
                        placeholder="请输入过滤词"
                        value={filterWords}
                        onChange={function (e) { setFilterWords(e.target.value); }}
                        maxLength={50}
                        showCount
                      />
                    </div>
                  </div>
                  <div className="ot-advanced-row ot-advanced-row--switch">
                    <div className="ot-advanced-item ot-advanced-item--switch">
                      <label>智能过滤</label>
                      <Switch checked={smartFilter} onChange={setSmartFilter} />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* 搜索历史 */}
      <div className="ot-history-panel">
        <div className="ot-history-header">
          <div className="ot-history-title">
            <span onClick={function () { setHistoryExpanded(!historyExpanded); }} style={{ cursor: 'pointer' }}>
              {historyExpanded ? <DownOutlined style={{ marginRight: 8 }} /> : <RightOutlined style={{ marginRight: 8 }} />}
              搜索记录
            </span>
          </div>
          <Button type="link" icon={<DeleteOutlined />} onClick={handleClearHistory}>
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
    </div>
  );
};

export default OverseasTopics;
