import React, { useState } from 'react';
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  FlagOutlined,
  DatabaseOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

interface CustomerConfigProps {
  customerName: string;
  onBack: () => void;
}

/** Tab 定义 */
const tabs = [
  { key: 'service', label: '服务项配置' },
  { key: 'recommend', label: '推荐配置' },
  { key: 'cost', label: '费用统计' },
  { key: 'tracking', label: '跟踪配置' },
  { key: 'ai', label: 'AI配置' },
];

/** ═══════════════════════════════════════════════════════
 *  费用统计 Tab 页
 * ═══════════════════════════════════════════════════════ */

const CostStatisticsTab: React.FC = () => {
  const [statsEnabled, setStatsEnabled] = useState(true);
  const [smallLibEnabled, setSmallLibEnabled] = useState(false);
  const [pkgLimitEnabled, setPkgLimitEnabled] = useState(true);

  const packages = [
    { expiry: '2027-02-11 23:59:59', record: '数据包', total: 143000000, used: 143000000, status: '已启用' },
    { expiry: '2025-11-30 23:59:59', record: '数据包', total: 5000000, used: 5000000, status: '已启用' },
  ];

  const metrics = [
    { title: '总量', value: '1.62亿', unit: '条', theme: 'blue' },
    { title: '可用数据量', value: '-1353.75w', unit: '条', theme: 'green' },
    { title: '占比', value: '0 %', unit: '', theme: 'orange' },
    { title: '在运行专题', value: '14', unit: '个/31个', theme: 'red' },
    { title: '过期专题', value: '17', unit: '个', theme: 'gray' },
  ];

  return (
    <div className="cost-tab">
      {/* ── Section 1: 顶层状态栏 ── */}
      <div className="cost-status-bar">
        <div className="cost-status-left">
          <label className="cost-switch-label">
            统计数据
            <QuestionCircleOutlined className="cost-help-icon" />
          </label>
          <div className={`status-toggle ${statsEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={() => setStatsEnabled(!statsEnabled)}>
            <span className="toggle-dot" />
          </div>

          <label className="cost-switch-label" style={{ marginLeft: 24 }}>
            小库进数
          </label>
          <div className={`status-toggle ${smallLibEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={() => setSmallLibEnabled(!smallLibEnabled)}>
            <span className="toggle-dot" />
          </div>

          <span className="cost-status-text" style={{ marginLeft: 24 }}>
            启用时间: 2024-10-16 09:41:41
          </span>
        </div>
        <div className="cost-status-right">
          <span className="cost-status-text">有效期: 2027-01-01</span>
          <span className="cost-status-remain">剩余 256 日</span>
        </div>
      </div>

      {/* ── Section 2: 指标卡片 ── */}
      <div className="metric-cards">
        {metrics.map((m) => (
          <div key={m.title} className={`metric-card metric-${m.theme}`}>
            <div className="metric-title">{m.title}</div>
            <div className="metric-value-row">
              <span className="metric-value">{m.value}</span>
              {m.unit && <span className="metric-unit">{m.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: 数据包管理 ── */}
      <div className="pkg-section">
        <div className="pkg-header">
          <div className="pkg-header-left">
            <DatabaseOutlined className="pkg-icon" />
            <span className="pkg-title">数据包</span>
            <div className={`status-toggle ${pkgLimitEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={() => setPkgLimitEnabled(!pkgLimitEnabled)}>
              <span className="toggle-dot" />
            </div>
            <span className="pkg-link">
              设置数据包限制
              <QuestionCircleOutlined className="cost-help-icon" />
            </span>
          </div>
          <button className="btn-add-pkg">
            <PlusOutlined />
            <span>添加数据包</span>
          </button>
        </div>

        <div className="pkg-table-wrapper">
          <table className="pkg-table">
            <thead>
              <tr>
                <th>有效期</th>
                <th>操作记录</th>
                <th>数据量</th>
                <th>使用量</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'row-odd' : ''}>
                  <td>{pkg.expiry}</td>
                  <td>{pkg.record}</td>
                  <td className="pkg-num">{pkg.total.toLocaleString()}</td>
                  <td className="pkg-num">{pkg.used.toLocaleString()}</td>
                  <td><span className="pkg-status-enabled">{pkg.status}</span></td>
                  <td>
                    <div className="pkg-actions">
                      <span className="pkg-action-link">减量</span>
                      <span className="pkg-action-link">延期</span>
                      <span className="pkg-action-link pkg-action-danger">删除</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 分页 ── */}
        <div className="pkg-pagination">
          <span className="pagination-total">共 2 条</span>
          <div className="pagination-pages">
            <button className="page-btn page-prev" disabled>&lt;</button>
            <button className="page-btn page-active">1</button>
            <button className="page-btn page-next" disabled>&gt;</button>
          </div>
          <span className="pkg-page-size">20 条/页</span>
        </div>
      </div>
    </div>
  );
};

const CustomerConfig: React.FC<CustomerConfigProps> = ({ customerName, onBack }) => {
  const [activeTab, setActiveTab] = useState('service');

  // ── 专题配置表单状态 ──
  const [historyLimitMode, setHistoryLimitMode] = useState<'unlimited' | 'byCount'>('byCount');
  const [historyLimitCount, setHistoryLimitCount] = useState(5000000);
  const [earliestTimeMode, setEarliestTimeMode] = useState<'unlimited' | 'byTime'>('unlimited');

  const [topicDefaultHistory, setTopicDefaultHistory] = useState(7);
  const [topicDefaultFuture, setTopicDefaultFuture] = useState(30);
  const [topicLongestHistory, setTopicLongestHistory] = useState(90);
  const [topicLongestFuture, setTopicLongestFuture] = useState(30);

  const [defaultQueryTime, setDefaultQueryTime] = useState('24h');
  const [optionalTimeLength, setOptionalTimeLength] = useState(90);

  const [keywordComboLimit, setKeywordComboLimit] = useState(3000);
  const [keywordCharLimit, setKeywordCharLimit] = useState(2000);
  const [authorMaxCount, setAuthorMaxCount] = useState(10);
  const [authorMaxLength, setAuthorMaxLength] = useState(50);
  const [domainMaxCount, setDomainMaxCount] = useState(10);
  const [domainMaxLength, setDomainMaxLength] = useState(50);

  // ── 搜索配置表单状态 ──
  const [searchDefaultDays, setSearchDefaultDays] = useState(7);
  const [searchLongestDays, setSearchLongestDays] = useState(90);

  /** 步进器通用组件 */
  const Stepper = ({ value, onChange, min = 0, max = 99999999 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <span className="stepper">
      <button className="stepper-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <input
        className="stepper-input"
        type="text"
        value={value.toLocaleString()}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/,/g, ''), 10);
          if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      <button className="stepper-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </span>
  );

  return (
    <div className="sub-page">
      {/* ── 页面标题栏 ── */}
      <div className="sub-page-header">
        <div className="sub-page-title-row">
          <span className="sub-page-title">{customerName}</span>
          <button className="btn-back" onClick={onBack}>
            <ArrowLeftOutlined />
            <span>返回</span>
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sub-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`sub-tab-item ${activeTab === tab.key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ── 表单内容 ── */}
      <div className="sub-page-body">
        {activeTab === 'service' && (
          <>
        {/* ═══════ 专题数据配置 ═══════ */}
        <div className="form-section">
          <div className="section-header">
            <FlagOutlined className="section-flag-icon" />
            <span className="section-title">专题数据配置</span>
          </div>

          {/* ── 专题配置 ── */}
          <div className="form-subsection">
            <div className="subsection-bar" />
            <span className="subsection-title">专题配置</span>
          </div>

          <div className="form-body">
            {/* 历史数据查询量 */}
            <div className="form-row">
              <label className="form-label">历史数据查询量</label>
              <div className="form-control">
                <label className="radio-item">
                  <span className={`radio-circle ${historyLimitMode === 'unlimited' ? 'radio-checked' : ''}`} onClick={() => setHistoryLimitMode('unlimited')} />
                  <span>不限制</span>
                </label>
                <label className="radio-item" style={{ marginLeft: 24 }}>
                  <span className={`radio-circle ${historyLimitMode === 'byCount' ? 'radio-checked' : ''}`} onClick={() => setHistoryLimitMode('byCount')} />
                  <span>按数量</span>
                </label>
                {historyLimitMode === 'byCount' && (
                  <Stepper value={historyLimitCount} onChange={setHistoryLimitCount} />
                )}
              </div>
            </div>

            {/* 查询最早时间 */}
            <div className="form-row">
              <label className="form-label">查询最早时间</label>
              <div className="form-control">
                <label className="radio-item">
                  <span className={`radio-circle ${earliestTimeMode === 'unlimited' ? 'radio-checked' : ''}`} onClick={() => setEarliestTimeMode('unlimited')} />
                  <span>不限制</span>
                </label>
                <label className="radio-item" style={{ marginLeft: 24 }}>
                  <span className={`radio-circle ${earliestTimeMode === 'byTime' ? 'radio-checked' : ''}`} onClick={() => setEarliestTimeMode('byTime')} />
                  <span>按指定时间</span>
                </label>
              </div>
            </div>

            {/* 专题配置时间（特殊布局：标题左侧，配置右侧两行） */}
            <div className="form-row-inline">
              <label className="form-label-inline">专题配置时间</label>
              <div className="form-control-inline">
                <div className="time-range-row">
                  <span className="time-range-label">默认</span>
                  <span className="time-range-prefix">历史</span>
                  <Stepper value={topicDefaultHistory} onChange={setTopicDefaultHistory} />
                  <span className="time-range-unit">天</span>
                  <span className="time-range-sep">，</span>
                  <span className="time-range-prefix">未来</span>
                  <Stepper value={topicDefaultFuture} onChange={setTopicDefaultFuture} />
                  <span className="time-range-unit">天</span>
                </div>
                <div className="time-range-row" style={{ marginTop: 8 }}>
                  <span className="time-range-label">最长</span>
                  <span className="time-range-prefix">历史</span>
                  <Stepper value={topicLongestHistory} onChange={setTopicLongestHistory} />
                  <span className="time-range-unit">天</span>
                  <span className="time-range-sep">，</span>
                  <span className="time-range-prefix">未来</span>
                  <Stepper value={topicLongestFuture} onChange={setTopicLongestFuture} />
                  <span className="time-range-unit">天</span>
                </div>
              </div>
            </div>

            {/* 默认查询时间 */}
            <div className="form-row">
              <label className="form-label">默认查询时间</label>
              <div className="form-control">
                {['当天', '24小时', '3天', '7天'].map((opt) => (
                  <label key={opt} className="radio-item">
                    <span
                      className={`radio-circle ${defaultQueryTime === opt ? 'radio-checked' : ''}`}
                      onClick={() => setDefaultQueryTime(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 可选时间长度 */}
            <div className="form-row">
              <label className="form-label">可选时间长度</label>
              <div className="form-control">
                <Stepper value={optionalTimeLength} onChange={setOptionalTimeLength} />
                <span className="time-range-unit" style={{ marginLeft: 8 }}>天</span>
              </div>
            </div>

            {/* 关键词组合限制 */}
            <div className="form-row">
              <label className="form-label">
                关键词组合限制
                <span className="required-star">*</span>
              </label>
              <div className="form-control">
                <Stepper value={keywordComboLimit} onChange={setKeywordComboLimit} />
                <InfoCircleOutlined className="field-info-icon" />
              </div>
            </div>

            {/* 关键词字数上限 */}
            <div className="form-row">
              <label className="form-label">
                关键词字数上限
                <span className="required-star">*</span>
              </label>
              <div className="form-control">
                <Stepper value={keywordCharLimit} onChange={setKeywordCharLimit} />
                <InfoCircleOutlined className="field-info-icon" />
              </div>
            </div>

            {/* 指定作者上限 */}
            <div className="form-row">
              <label className="form-label">指定作者上限</label>
              <div className="form-control">
                <span className="combo-label">最多</span>
                <Stepper value={authorMaxCount} onChange={setAuthorMaxCount} />
                <span className="combo-unit">个</span>
                <span className="combo-label" style={{ marginLeft: 16 }}>长度</span>
                <Stepper value={authorMaxLength} onChange={setAuthorMaxLength} />
                <span className="combo-unit">字</span>
              </div>
            </div>

            {/* 指定域名上限 */}
            <div className="form-row">
              <label className="form-label">指定域名上限</label>
              <div className="form-control">
                <span className="combo-label">最多</span>
                <Stepper value={domainMaxCount} onChange={setDomainMaxCount} />
                <span className="combo-unit">个</span>
                <span className="combo-label" style={{ marginLeft: 16 }}>长度</span>
                <Stepper value={domainMaxLength} onChange={setDomainMaxLength} />
                <span className="combo-unit">字</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ 搜索配置 ═══════ */}
        <div className="form-section">
          <div className="form-subsection">
            <div className="subsection-bar" />
            <span className="subsection-title">搜索配置</span>
          </div>

          <div className="form-body">
            {/* 搜索查询时间 */}
            <div className="form-row form-row-group">
              <label className="form-label">搜索查询时间</label>
              <div className="form-control">
                <div className="time-range-row">
                  <span className="time-range-label">默认</span>
                  <Stepper value={searchDefaultDays} onChange={setSearchDefaultDays} />
                  <span className="time-range-unit">天</span>
                  <span className="time-range-sep">，</span>
                  <span className="time-range-label">最长</span>
                  <Stepper value={searchLongestDays} onChange={setSearchLongestDays} />
                  <span className="time-range-unit">天</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'cost' && (
          <CostStatisticsTab />
        )}
      </div>

      {/* ── 底部操作栏 ── */}
      <div className="sub-page-footer">
        <button className="btn-primary">保存</button>
      </div>
    </div>
  );
};

export default CustomerConfig;
