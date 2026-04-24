import React, { useState } from 'react';
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  FlagOutlined,
  DatabaseOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
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

/** 二级 Tab 定义 */
const costSubTabs = [
  { key: 'rows', label: '数据包额度（条）' },
  { key: 'times', label: '采集任务额度（次）' },
];

/** ── 共享状态栏组件 ── */
const CostStatusBar: React.FC = () => {
  const [statsEnabled, setStatsEnabled] = useState(true);

  return (
    <div className="cost-status-bar">
      <div className="cost-status-left">
        <label className="cost-switch-label">
          统计数据
          <QuestionCircleOutlined className="cost-help-icon" />
        </label>
        <div className={`status-toggle ${statsEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={() => setStatsEnabled(!statsEnabled)}>
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
  );
};

/** ── 数据包额度（条）子 Tab 内容 ── */
const DataPackageTab: React.FC = () => {
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
    <>
      {/* ── 指标卡片 ── */}
      <div className="metric-cards metric-cards-5">
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

      {/* ── 数据包管理 ── */}
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
    </>
  );
};

/** ── 采集任务额度（次）子 Tab 内容 ── */
const CollectTaskQuotaTab: React.FC = () => {
  // ── 弹窗模式：add | reduce | extend | null ──
  const [modalMode, setModalMode] = useState<'add' | 'reduce' | 'extend' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<number | null>(null);

  // ── 弹窗表单 ──
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');

  // ── 采集平台限制 ──
  const platforms = ['小红书', '抖音', '微博', '今日头条'];
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([...platforms]);
  const [platformFactors, setPlatformFactors] = useState<Record<string, { interaction: string; comment: string }>>({
    '小红书': { interaction: '1.00', comment: '1.00' },
    '抖音': { interaction: '1.00', comment: '1.00' },
    '微博': { interaction: '1.00', comment: '1.00' },
    '今日头条': { interaction: '1.00', comment: '1.00' },
  });

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const toggleAllPlatforms = () => {
    if (selectedPlatforms.length === platforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms([...platforms]);
    }
  };

  const updateFactor = (platform: string, field: 'interaction' | 'comment', value: string) => {
    // 限制 0~100 的两位小数
    const clamped = value === '' ? '' : Math.min(100, Math.max(0, parseFloat(value) || 0)).toFixed(2);
    setPlatformFactors((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: clamped },
    }));
  };

  // ── 模拟额度包数据 ──
  const [quotaPackages, setQuotaPackages] = useState([
    { id: 1, expiry: '2027-06-30', record: '额度包', total: 500000, used: 387200, status: '已启用' },
    { id: 2, expiry: '2026-03-15', record: '额度包', total: 200000, used: 200000, status: '已停用' },
    { id: 3, expiry: '2027-12-31', record: '额度包', total: 1000000, used: 125600, status: '已启用' },
  ]);

  // ── 模拟使用日志 ──
  const usageLogs = [
    { time: '2026-04-22 14:32:18', type: '互动量更新', consumed: 320, remaining: 487400 },
    { time: '2026-04-22 13:15:07', type: '评论区采集', consumed: 156, remaining: 487720 },
    { time: '2026-04-22 11:08:45', type: '互动量更新', consumed: 89, remaining: 487876 },
    { time: '2026-04-21 17:42:33', type: '评论区采集', consumed: 245, remaining: 487965 },
    { time: '2026-04-21 15:20:11', type: '互动量更新', consumed: 178, remaining: 488210 },
    { time: '2026-04-21 10:05:29', type: '评论区采集', consumed: 412, remaining: 488388 },
  ];

  // ── 计算仪表盘指标 ──
  const totalQuota = quotaPackages.reduce((sum, p) => sum + p.total, 0);
  const availableQuota = quotaPackages
    .filter((p) => p.status === '已启用' && p.used < p.total)
    .reduce((sum, p) => sum + (p.total - p.used), 0);
  const usageRate = totalQuota > 0 ? Math.round((availableQuota / totalQuota) * 100) : 0;
  const isLowBalance = usageRate < 10;

  // ── 打开弹窗 ──
  const openModal = (mode: 'add' | 'reduce' | 'extend', pkgId?: number) => {
    setModalMode(mode);
    setEditTarget(pkgId ?? null);
    if (mode === 'add') {
      setFormAmount('');
      setFormDate('');
    } else if (mode === 'reduce' && pkgId != null) {
      const pkg = quotaPackages.find((p) => p.id === pkgId);
      setFormAmount(String(pkg?.total ?? ''));
      setFormDate(pkg?.expiry ?? '');
    } else if (mode === 'extend' && pkgId != null) {
      const pkg = quotaPackages.find((p) => p.id === pkgId);
      setFormAmount(String(pkg?.total ?? ''));
      setFormDate(pkg?.expiry ?? '');
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
    setFormAmount('');
    setFormDate('');
  };

  // ── 弹窗提交 ──
  const handleModalSubmit = () => {
    if (modalMode === 'add') {
      if (!formAmount || !formDate) return;
      const newPkg = {
        id: Date.now(),
        expiry: formDate,
        record: '额度包',
        total: parseInt(formAmount, 10),
        used: 0,
        status: '已启用',
      };
      setQuotaPackages((prev) => [newPkg, ...prev]);
    } else if (modalMode === 'reduce' && editTarget != null) {
      if (!formAmount) return;
      const newTotal = parseInt(formAmount, 10);
      const pkg = quotaPackages.find((p) => p.id === editTarget);
      if (pkg && newTotal > 0 && newTotal <= pkg.total) {
        setQuotaPackages((prev) =>
          prev.map((p) => (p.id === editTarget ? { ...p, total: newTotal } : p))
        );
      }
    } else if (modalMode === 'extend' && editTarget != null) {
      if (!formDate) return;
      setQuotaPackages((prev) =>
        prev.map((p) => (p.id === editTarget ? { ...p, expiry: formDate } : p))
      );
    }
    closeModal();
  };

  // ── 减量校验：不允许超过当前数据量 ──
  const getReduceMax = () => {
    if (editTarget == null) return Infinity;
    const pkg = quotaPackages.find((p) => p.id === editTarget);
    return pkg?.total ?? Infinity;
  };

  // ── 删除额度包 ──
  const handleDeletePackage = () => {
    if (deleteTarget === null) return;
    setQuotaPackages((prev) => prev.filter((p) => p.id !== deleteTarget));
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const formatNum = (n: number) => n.toLocaleString();

  // ── 弹窗标题映射 ──
  const modalTitleMap = { add: '新增额度包', reduce: '额度包减量', extend: '额度包延期' };
  const isAmountDisabled = modalMode === 'extend';
  const isDateDisabled = modalMode === 'reduce';

  return (
    <>
      {/* ── 仪表盘：3 张指标卡片 ── */}
      <div className="metric-cards metric-cards-3">
        {/* 总量 */}
        <div className="metric-card metric-blue">
          <div className="metric-title">总量</div>
          <div className="metric-value-row">
            <span className="metric-value">{formatNum(totalQuota)}</span>
            <span className="metric-unit">次</span>
          </div>
        </div>

        {/* 可用数据量（低于 10% 变红预警） */}
        <div className={`metric-card ${isLowBalance ? 'metric-red' : 'metric-green'}`}>
          <div className="metric-title">
            可用数据量
            {isLowBalance && <ExclamationCircleOutlined className="metric-warning-icon" />}
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{formatNum(availableQuota)}</span>
            <span className="metric-unit">次</span>
          </div>
        </div>

        {/* 占比（含进度条） */}
        <div className="metric-card metric-orange">
          <div className="metric-title">占比</div>
          <div className="metric-value-row">
            <span className="metric-value">{usageRate} %</span>
          </div>
          <div className="metric-progress">
            <div
              className={`metric-progress-bar ${isLowBalance ? 'progress-danger' : 'progress-normal'}`}
              style={{ width: `${Math.min(usageRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 采集平台限制 ── */}
      <div className="platform-limit-section">
        <div className="platform-limit-header">
          <span className="platform-limit-title">采集平台限制</span>
        </div>
        <div className="platform-limit-body">
          <div className="platform-checkbox-row">
            <label
              className={`checkbox-item ${selectedPlatforms.length === platforms.length ? 'checkbox-checked' : ''}`}
              onClick={toggleAllPlatforms}
            >
              <span className="checkbox-box">
                {selectedPlatforms.length === platforms.length && <span className="checkbox-tick">✓</span>}
              </span>
              <span>全部</span>
            </label>
            {platforms.map((p) => (
              <label
                key={p}
                className={`checkbox-item ${selectedPlatforms.includes(p) ? 'checkbox-checked' : ''}`}
                onClick={() => togglePlatform(p)}
              >
                <span className="checkbox-box">
                  {selectedPlatforms.includes(p) && <span className="checkbox-tick">✓</span>}
                </span>
                <span>{p}</span>
              </label>
            ))}
          </div>

          {/* 选中具体平台后展示关联字段 */}
          {selectedPlatforms.length > 0 && (
            <div className="platform-factor-list">
              {selectedPlatforms.map((p) => (
                <div key={p} className="platform-factor-item">
                  <div className="platform-factor-name">{p}</div>
                  <div className="platform-factor-fields">
                    <div className="platform-factor-field">
                      <label className="platform-factor-label">互动量更新计费基数</label>
                      <input
                        type="number"
                        className="platform-factor-input"
                        min="0"
                        max="100"
                        step="0.01"
                        value={platformFactors[p]?.interaction ?? '1.00'}
                        onChange={(e) => updateFactor(p, 'interaction', e.target.value)}
                      />
                    </div>
                    <div className="platform-factor-field">
                      <label className="platform-factor-label">评论区采集计费基数</label>
                      <input
                        type="number"
                        className="platform-factor-input"
                        min="0"
                        max="100"
                        step="0.01"
                        value={platformFactors[p]?.comment ?? '1.00'}
                        onChange={(e) => updateFactor(p, 'comment', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 额度包列表 ── */}
      <div className="pkg-section">
        <div className="pkg-header">
          <div className="pkg-header-left">
            <DatabaseOutlined className="pkg-icon" />
            <span className="pkg-title">额度包</span>
          </div>
          <button className="btn-add-pkg" onClick={() => openModal('add')}>
            <PlusOutlined />
            <span>添加额度包</span>
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
              {quotaPackages.map((pkg, idx) => (
                <tr key={pkg.id} className={idx % 2 === 1 ? 'row-odd' : ''}>
                  <td>{pkg.expiry}</td>
                  <td>{pkg.record}</td>
                  <td className="pkg-num">{formatNum(pkg.total)}</td>
                  <td className="pkg-num">{formatNum(pkg.used)}</td>
                  <td>
                    <span className={pkg.status === '已启用' ? 'pkg-status-enabled' : 'pkg-status-disabled'}>
                      {pkg.status}
                    </span>
                  </td>
                  <td>
                    <div className="pkg-actions">
                      <span className="pkg-action-link" onClick={() => openModal('reduce', pkg.id)}>减量</span>
                      <span className="pkg-action-link" onClick={() => openModal('extend', pkg.id)}>延期</span>
                      <span
                        className="pkg-action-link pkg-action-danger"
                        onClick={() => {
                          setDeleteTarget(pkg.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        删除
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pkg-pagination">
          <span className="pagination-total">共 {quotaPackages.length} 条</span>
          <div className="pagination-pages">
            <button className="page-btn page-prev" disabled>&lt;</button>
            <button className="page-btn page-active">1</button>
            <button className="page-btn page-next" disabled>&gt;</button>
          </div>
          <span className="pkg-page-size">20 条/页</span>
        </div>
      </div>

      {/* ── 额度使用日志 ── */}
      <div className="pkg-section log-section">
        <div className="pkg-header">
          <div className="pkg-header-left">
            <ClockCircleOutlined className="pkg-icon" />
            <span className="pkg-title">额度使用日志</span>
          </div>
        </div>

        <div className="pkg-table-wrapper">
          <table className="pkg-table">
            <thead>
              <tr>
                <th>操作时间</th>
                <th>操作类型</th>
                <th>消耗量</th>
                <th>余量</th>
              </tr>
            </thead>
            <tbody>
              {usageLogs.map((log, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'row-odd' : ''}>
                  <td className="pkg-num">{log.time}</td>
                  <td>
                    <span className={`log-type-badge log-type-${log.type === '互动量更新' ? 'interact' : 'comment'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="pkg-num log-consumed">-{formatNum(log.consumed)}</td>
                  <td className="pkg-num">{formatNum(log.remaining)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pkg-pagination">
          <span className="pagination-total">共 {usageLogs.length} 条</span>
          <div className="pagination-pages">
            <button className="page-btn page-prev" disabled>&lt;</button>
            <button className="page-btn page-active">1</button>
            <button className="page-btn page-next" disabled>&gt;</button>
          </div>
          <span className="pkg-page-size">20 条/页</span>
        </div>
      </div>

      {/* ═══════ 通用额度包弹窗（新增 / 减量 / 延期） ═══════ */}
      {modalMode && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modalTitleMap[modalMode]}</span>
              <CloseOutlined className="modal-close" onClick={closeModal} />
            </div>
            <div className="modal-body">
              {/* 数据量字段 */}
              <div className="modal-form-row">
                <label className="modal-label">
                    数据量 <span className="required-star">*</span>
                  </label>
                  <div className="modal-control modal-input-group">
                    <input
                      className="modal-input modal-input-group-inner"
                      type="number"
                      min="1"
                      max={modalMode === 'reduce' ? getReduceMax() : undefined}
                      step="1"
                      placeholder="请输入正整数"
                      value={formAmount}
                      disabled={isAmountDisabled}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (modalMode === 'reduce') {
                          const n = parseInt(val, 10);
                          if (!isNaN(n) && n > getReduceMax()) {
                            val = String(getReduceMax());
                          }
                        }
                        setFormAmount(val);
                      }}
                    />
                  <span className="modal-input-addon">次</span>
                </div>
              </div>
              {/* 有效期字段 */}
              <div className="modal-form-row">
                <label className="modal-label">
                  有效期 <span className="required-star">*</span>
                </label>
                <div className="modal-control">
                  <input
                    className="modal-input"
                    type="date"
                    value={formDate}
                    disabled={isDateDisabled}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={closeModal}>取消</button>
              <button
                className="btn-modal-confirm"
                disabled={
                  modalMode === 'add'
                    ? !formAmount || !formDate
                    : modalMode === 'reduce'
                      ? !formAmount
                      : !formDate
                }
                onClick={handleModalSubmit}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ 删除确认弹窗 ═══════ */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-container modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <ExclamationCircleOutlined className="modal-confirm-icon" />
              <span className="modal-title">确认删除</span>
            </div>
            <div className="modal-body">
              <p className="modal-confirm-text">删除后该额度包数据将不再计入仪表盘"总量"，此操作不可撤销。确定要删除吗？</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>取消</button>
              <button className="btn-modal-danger" onClick={handleDeletePackage}>删除</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/** ── 费用统计主 Tab ── */
const CostStatisticsTab: React.FC = () => {
  const [activeCostTab, setActiveCostTab] = useState('rows');

  return (
    <div className="cost-tab">
      {/* ── 二级 Tabs ── */}
      <div className="cost-sub-tabs">
        {costSubTabs.map((tab) => (
          <div
            key={tab.key}
            className={`cost-sub-tab-item ${activeCostTab === tab.key ? 'cost-sub-tab-active' : ''}`}
            onClick={() => setActiveCostTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* ── 共享状态栏 ── */}
      <CostStatusBar />

      {/* ── 二级 Tab 内容 ── */}
      <div className="cost-sub-tab-content">
        {activeCostTab === 'rows' && <DataPackageTab />}
        {activeCostTab === 'times' && <CollectTaskQuotaTab />}
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
