import React, { useState, useMemo, useCallback } from 'react';
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
  SearchOutlined,
  RedoOutlined,
  DownloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

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
const CostStatusBar: React.FC<{ statsEnabled: boolean; onToggle: () => void; showExpiry?: boolean }> = ({ statsEnabled, onToggle, showExpiry = true }) => {
  return (
    <div className="cost-status-bar">
      <div className="cost-status-left">
        <label className="cost-switch-label">
          统计数据
          <QuestionCircleOutlined className="cost-help-icon" />
        </label>
        <div className={`status-toggle ${statsEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={onToggle}>
          <span className="toggle-dot" />
        </div>

        {statsEnabled && (
          <span className="cost-status-text" style={{ marginLeft: 24 }}>
            启用时间: 2024-10-16 09:41:41
          </span>
        )}
      </div>
      {statsEnabled && showExpiry && (
        <div className="cost-status-right">
          <span className="cost-status-text">有效期: 2027-01-01</span>
          <span className="cost-status-remain">剩余 256 日</span>
        </div>
      )}
    </div>
  );
};

/** ── 采集任务状态配置栏组件 ── */
const CollectTaskStatusBar: React.FC<{
  collectTaskEnabled: boolean;
  onToggleCollectTask: () => void;
  quotaDetailEnabled: boolean;
  onToggleQuotaDetail: () => void;
}> = ({
  collectTaskEnabled,
  onToggleCollectTask,
  quotaDetailEnabled,
  onToggleQuotaDetail,
}) => {
  return (
    <div className="cost-status-bar" style={{ display: 'flex', gap: '32px', justifyContent: 'flex-start', alignItems: 'center' }}>
      {/* 采集任务 */}
      <div className="cost-status-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label className="cost-switch-label" style={{ fontWeight: 500 }}>
          采集任务
        </label>
        <div 
          className={`status-toggle ${collectTaskEnabled ? 'toggle-on' : 'toggle-off'}`} 
          onClick={onToggleCollectTask}
        >
          <span className="toggle-dot" />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
          备注：开启后，客户系统中支持使用采集任务功能
        </span>
      </div>

      {/* 分割线 */}
      <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-light)' }} />

      {/* 额度明细 */}
      <div className="cost-status-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: collectTaskEnabled ? 1 : 0.5 }}>
        <label className="cost-switch-label" style={{ fontWeight: 500 }}>
          额度明细
        </label>
        <div 
          className={`status-toggle ${quotaDetailEnabled ? 'toggle-on' : 'toggle-off'}`} 
          style={!collectTaskEnabled ? { background: '#e8e8e8', cursor: 'not-allowed' } : undefined}
          onClick={() => collectTaskEnabled && onToggleQuotaDetail()}
        >
          <span className="toggle-dot" />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
          备注：开启后，客户系统中允许查看采集任务消耗的具体额度
        </span>
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

// ============ 采集任务明细相关类型与常量 ============

type ExecutionRecord = {
  id: string;
  collect_time: string;
  collect_type: string;
  platform: string;
  collect_status: '采集成功' | '采集失败';
  cost: number;
  fail_reason?: string;
};

type TaskRecord = {
  id: string;
  task_create_time: string;
  task_name: string;
  scope_type: string; // topic | source | other
  platforms: string[];
  collect_type: string;
  total_cost: number;
  status: '进行中' | '已关闭';
  execution_records: ExecutionRecord[];
};

const TASK_PREFIXES = ['汽车', '房产', '快消', '教育', '大健康'];
const TASK_SUFFIXES = ['行业监控', '专题调研', '负面预警'];
const SCOPE_TYPES = ['topic', 'source', 'other'];
const COLLECT_TYPES = ['评论区采集', '互动量更新'];
const TIME_SLOTS = ['00:00:00', '06:00:00', '12:00:00', '18:00:00'];
const PLATFORMS_LIST = ['小红书', '抖音', '微博', '今日头条', '快手', 'B站'];

const PLATFORM_COST: Record<string, number> = {
  '小红书': 15,
  '抖音': 10,
  '微博': 8,
  '今日头条': 7,
  '快手': 6,
  'B站': 5,
};

const SCOPE_MAP: Record<string, { label: string; class: string }> = {
  topic: { label: '全网专题', class: 'qf-tag-scope-topic' },
  source: { label: '重点源', class: 'qf-tag-scope-source' },
  other: { label: '链接', class: 'qf-tag-scope-other' },
};

const PLATFORM_CLASSES: Record<string, string> = {
  '小红书': 'qf-tag-plat-redbook',
  '微博': 'qf-tag-plat-weibo',
  '今日头条': 'qf-tag-plat-toutiao',
  '抖音': 'qf-tag-plat-dy',
  'B站': 'qf-tag-plat-bili',
  '快手': 'qf-tag-plat-kuaishou',
};

const FAIL_REASONS = [
  '状态码: 403 - 平台反爬拦截',
  '状态码: 500 - 目标页面服务异常',
  '状态码: 429 - 请求频率超限',
  '状态码: 502 - 网关超时',
  '状态码: 404 - 页面不存在或已删除',
];

function generateTaskData(): TaskRecord[] {
  const tasks: TaskRecord[] = [];

  function seededRandom(seed: number): number {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  for (let idx = 0; idx < 15; idx++) {
    const prefix = TASK_PREFIXES[idx % TASK_PREFIXES.length];
    const suffix = TASK_SUFFIXES[Math.floor(seededRandom(idx * 7 + 1) * TASK_SUFFIXES.length)];
    const taskName = prefix + suffix + '_' + String(idx + 1).padStart(3, '0');
    const scopeType = SCOPE_TYPES[Math.floor(seededRandom(idx * 13 + 3) * SCOPE_TYPES.length)];
    const collectType = COLLECT_TYPES[Math.floor(seededRandom(idx * 17 + 5) * COLLECT_TYPES.length)];

    const shuffled = [...PLATFORMS_LIST].sort(() => seededRandom(idx * 23 + 7) - 0.5);
    const platformCount = 1 + Math.floor(seededRandom(idx * 29 + 11) * 3);
    const taskPlatforms = shuffled.slice(0, platformCount);

    const status = idx < 10 ? '进行中' : '已关闭';
    const createDay = 18 + Math.floor(seededRandom(idx * 31 + 13) * 10);
    const createHour = Math.floor(seededRandom(idx * 37 + 17) * 24);
    const taskCreateTime = '2026-04-' + String(createDay).padStart(2, '0') + ' ' + String(createHour).padStart(2, '0') + ':00:00';

    const execRecords: ExecutionRecord[] = [];
    let execId = 0;
    for (let day = 24; day <= 26; day++) {
      for (let si = 0; si < TIME_SLOTS.length; si++) {
        const timeStr = '2026-04-' + String(day).padStart(2, '0') + ' ' + TIME_SLOTS[si];
        for (let pi = 0; pi < taskPlatforms.length; pi++) {
          const plat = taskPlatforms[pi];
          const baseCost = PLATFORM_COST[plat] || 10;
          const failSeed = seededRandom(idx * 1000 + day * 100 + si * 10 + pi);
          const isFailed = failSeed < 0.05;
          execRecords.push({
            id: 'exec_' + String(idx + 1).padStart(2, '0') + '_' + String(execId++).padStart(3, '0'),
            collect_time: timeStr,
            collect_type: collectType,
            platform: plat,
            collect_status: isFailed ? '采集失败' : '采集成功',
            cost: isFailed ? 0 : baseCost,
            fail_reason: isFailed ? FAIL_REASONS[Math.floor(failSeed * 100) % FAIL_REASONS.length] : undefined,
          });
        }
      }
    }
    execRecords.reverse();

    const totalCost = execRecords.reduce((s, r) => s + r.cost, 0);

    tasks.push({
      id: 'task_' + String(idx + 1).padStart(3, '0'),
      task_create_time: taskCreateTime,
      task_name: taskName,
      scope_type: scopeType,
      platforms: taskPlatforms,
      collect_type: collectType,
      total_cost: totalCost,
      status: status,
      execution_records: execRecords,
    });
  }

  tasks.sort((a, b) => b.task_create_time.localeCompare(a.task_create_time));
  return tasks;
}

const TASK_DATA = generateTaskData();

export interface PlatformPricingRule {
  platformKey: string;
  platformName: string;
  category: string;
  enabled: boolean;
  interactionPrice: number; // 元/次
  commentPrice: number; // 元/次
  quotaLimitMode: 'unlimited' | 'combined' | 'split'; // 单日配额模式
  combinedDailyLimit?: number; // 合并单日上限（次/天）
  interactionDailyLimit?: number; // 互动量独立上限
  commentDailyLimit?: number; // 评论区独立上限
}

const INITIAL_PLATFORM_RULES: PlatformPricingRule[] = [
  { platformKey: 'xhs', platformName: '小红书', category: '社交社区', enabled: true, interactionPrice: 17.00, commentPrice: 17.00, quotaLimitMode: 'combined', combinedDailyLimit: 1000 },
  { platformKey: 'douyin', platformName: '抖音', category: '视频影音', enabled: true, interactionPrice: 1.00, commentPrice: 2.00, quotaLimitMode: 'combined', combinedDailyLimit: 5000 },
  { platformKey: 'weibo', platformName: '微博', category: '社交社区', enabled: true, interactionPrice: 1.00, commentPrice: 2.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'toutiao', platformName: '今日头条', category: '资讯媒体', enabled: true, interactionPrice: 1.00, commentPrice: 2.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'bilibili', platformName: 'B站', category: '视频影音', enabled: true, interactionPrice: 1.00, commentPrice: 2.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'zhihu', platformName: '知乎', category: '社交社区', enabled: true, interactionPrice: 1.00, commentPrice: 2.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'wechat', platformName: '微信公众号', category: '私域及专业', enabled: false, interactionPrice: 2.00, commentPrice: 3.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'tieba', platformName: '百度贴吧', category: '社交社区', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'kuaishou', platformName: '快手', category: '视频影音', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'xigua', platformName: '西瓜视频', category: '视频影音', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'tencent_video', platformName: '腾讯视频', category: '视频影音', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'iqiyi', platformName: '爱奇艺', category: '视频影音', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'youku', platformName: '优酷', category: '视频影音', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'netease_news', platformName: '网易新闻', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'tencent_news', platformName: '腾讯新闻', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'sina_news', platformName: '新浪新闻', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'sohu_news', platformName: '搜狐新闻', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'ifeng', platformName: '凤凰网', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'people_daily', platformName: '人民网', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'xinhua', platformName: '新华网', category: '资讯媒体', enabled: false, interactionPrice: 1.00, commentPrice: 1.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'xhs_pro', platformName: '小红书专业版', category: '私域及专业', enabled: false, interactionPrice: 20.00, commentPrice: 20.00, quotaLimitMode: 'combined', combinedDailyLimit: 2000 },
  { platformKey: 'twitter', platformName: 'Twitter/X', category: '社交社区', enabled: false, interactionPrice: 3.00, commentPrice: 3.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'facebook', platformName: 'Facebook', category: '社交社区', enabled: false, interactionPrice: 3.00, commentPrice: 3.00, quotaLimitMode: 'unlimited' },
  { platformKey: 'instagram', platformName: 'Instagram', category: '社交社区', enabled: false, interactionPrice: 4.00, commentPrice: 4.00, quotaLimitMode: 'combined', combinedDailyLimit: 1000 },
  { platformKey: 'youtube', platformName: 'YouTube', category: '视频影音', enabled: false, interactionPrice: 2.00, commentPrice: 2.00, quotaLimitMode: 'unlimited' },
];

const PLATFORMS_BY_CATEGORY = [
  {
    category: '社交社区',
    list: ['小红书', '微博', '知乎', '百度贴吧', 'Twitter/X', 'Facebook', 'Instagram']
  },
  {
    category: '视频影音',
    list: ['抖音', '快手', '西瓜视频', 'B站', '腾讯视频', '爱奇艺', '优酷', 'YouTube']
  },
  {
    category: '资讯媒体',
    list: ['今日头条', '网易新闻', '腾讯新闻', '新浪新闻', '搜狐新闻', '凤凰网', '人民网', '新华网']
  },
  {
    category: '私域及专业',
    list: ['微信公众号', '小红书专业版']
  }
];

/** ── 采集任务额度（次）子 Tab 内容 ── */
const CollectTaskQuotaTab: React.FC<{
  collectTaskEnabled: boolean;
  quotaDetailEnabled: boolean;
  alertThreshold: number;
}> = ({ collectTaskEnabled, quotaDetailEnabled, alertThreshold }) => {

  // ── 弹窗模式：add | edit | null ──
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<number | null>(null);

  // ── 弹窗表单 ──
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');

  // ── 采集平台与风控配额管理 ──
  const [platformRules, setPlatformRules] = useState<PlatformPricingRule[]>(INITIAL_PLATFORM_RULES);
  const [platformCategoryFilter, setPlatformCategoryFilter] = useState<string>('all');
  const [platformSearchText, setPlatformSearchText] = useState<string>('');
  const [showPlatformSaveToast, setShowPlatformSaveToast] = useState(false);

  // 快捷更新某平台的字段
  const updatePlatformRule = (platformKey: string, updates: Partial<PlatformPricingRule>) => {
    setPlatformRules((prev) =>
      prev.map((r) => (r.platformKey === platformKey ? { ...r, ...updates } : r))
    );
  };

  const handleSavePlatformRules = () => {
    setShowPlatformSaveToast(true);
    setTimeout(() => setShowPlatformSaveToast(false), 2500);
  };

  // 兼容老代码的单价字典，供明细与导出计算使用
  const platformFactors = useMemo(() => {
    const factors: Record<string, { interaction: string; comment: string }> = {};
    platformRules.forEach((r) => {
      factors[r.platformName] = {
        interaction: r.interactionPrice.toFixed(2),
        comment: r.commentPrice.toFixed(2),
      };
    });
    return factors;
  }, [platformRules]);

  const selectedPlatforms = useMemo(() => {
    return platformRules.filter((r) => r.enabled).map((r) => r.platformName);
  }, [platformRules]);

  // ── 模拟额度包数据 ──
  const [quotaPackages, setQuotaPackages] = useState([
    { id: 1, expiry: '2027-06-30', record: '额度包', total: 500000, used: 387200, status: '使用中' },
    { id: 2, expiry: '2026-03-15', record: '额度包', total: 200000, used: 200000, status: '已用完' },
    { id: 3, expiry: '2027-12-31', record: '额度包', total: 1000000, used: 125600, status: '使用中' },
  ]);

  // ── 额度明细筛选状态 ──
  const [filterTaskName, setFilterTaskName] = useState('');
  const [filterScope, setFilterScope] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // ── 额度明细详情抽屉状态 ──
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // ── 导出状态 ──
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('filtered');
  const [exportDateStart, setExportDateStart] = useState('2026-04-01');
  const [exportDateEnd, setExportDateEnd] = useState('2026-04-30');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [showExportToast, setShowExportToast] = useState(false);

  // ── 过滤数据 ──
  const filteredData = useMemo(() => {
    let result = [...TASK_DATA];
    if (filterTaskName.trim()) {
      const keyword = filterTaskName.trim().toLowerCase();
      result = result.filter((r) => r.task_name.toLowerCase().includes(keyword));
    }
    if (filterDateStart) {
      result = result.filter((r) => r.task_create_time.slice(0, 10) >= filterDateStart);
    }
    if (filterDateEnd) {
      result = result.filter((r) => r.task_create_time.slice(0, 10) <= filterDateEnd);
    }
    if (filterScope) {
      result = result.filter((r) => r.scope_type === filterScope);
    }
    if (filterPlatform) {
      result = result.filter((r) => r.platforms.includes(filterPlatform));
    }
    if (filterType) {
      result = result.filter((r) => r.collect_type === filterType);
    }
    return result;
  }, [filterTaskName, filterDateStart, filterDateEnd, filterScope, filterPlatform, filterType]);

  // ── 重置 ──
  const handleReset = useCallback(() => {
    setFilterTaskName('');
    setFilterScope('');
    setFilterPlatform('');
    setFilterType('');
    setFilterDateStart('');
    setFilterDateEnd('');
  }, []);

  // ── 查看详情 ──
  const handleViewDetail = useCallback((record: TaskRecord) => {
    setSelectedTask(record);
    setDrawerVisible(true);
  }, []);

  // ── 导出逻辑 ──
  const flattenData = useCallback((tasks: TaskRecord[]) => {
    const rows: Record<string, string | number>[] = [];
    tasks.forEach((task) => {
      const scopeInfo = SCOPE_MAP[task.scope_type] || { label: '其他', class: '' };
      task.execution_records.forEach((exec) => {
        rows.push({
          '任务名': task.task_name,
          '任务创建时间': task.task_create_time,
          '采集范围': scopeInfo.label,
          '采集时间': exec.collect_time,
          '采集类型': exec.collect_type,
          '采集来源': exec.platform,
          '采集状态': exec.collect_status === '采集成功' ? '成功' : '失败',
          '额度消耗(次)': exec.cost,
        });
      });
    });
    return rows;
  }, []);

  const handleExport = useCallback(() => {
    const sourceTasks = exportScope === 'filtered' ? filteredData : TASK_DATA;
    const allRows = flattenData(sourceTasks);
    const rows = allRows.filter((row) => {
      const execDate = (row['采集时间'] as string).slice(0, 10);
      return execDate >= exportDateStart && execDate <= exportDateEnd;
    });

    if (rows.length === 0) {
      alert('所选时间范围内暂无可导出的数据');
      return;
    }

    setExportLoading(true);
    setExportMessage('正在合并多平台计费表并生成文件...');

    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [
        { wch: 32 },
        { wch: 22 },
        { wch: 10 },
        { wch: 22 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '额度明细');
      XLSX.writeFile(wb, '额度明细_' + dayjs().format('YYYYMMDDHHmmss') + '.xlsx');

      setExportLoading(false);
      setExportModalOpen(false);
      
      // 成功提示
      setExportMessage('导出成功！共 ' + rows.length + ' 条记录');
      setShowExportToast(true);
      setTimeout(() => {
        setShowExportToast(false);
      }, 3000);
    }, 2000);
  }, [exportScope, exportDateStart, exportDateEnd, filteredData, flattenData]);

  // ── 计算仪表盘指标 ──
  const totalQuota = quotaPackages.reduce((sum, p) => sum + p.total, 0);
  const availableQuota = quotaPackages
    .filter((p) => p.status === '使用中' && p.used < p.total)
    .reduce((sum, p) => sum + (p.total - p.used), 0);
  const usageRate = totalQuota > 0 ? Math.round((availableQuota / totalQuota) * 100) : 0;
  const isLowBalance = usageRate < alertThreshold;

  // ── 打开弹窗 ──
  const openModal = (mode: 'add' | 'edit', pkgId?: number) => {
    setModalMode(mode);
    setEditTarget(pkgId ?? null);
    if (mode === 'add') {
      setFormAmount('');
      setFormDate('');
    } else if (mode === 'edit' && pkgId != null) {
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
        status: '使用中',
      };
      setQuotaPackages((prev) => [newPkg, ...prev]);
    } else if (modalMode === 'edit' && editTarget != null) {
      if (!formAmount || !formDate) return;
      const newTotal = parseInt(formAmount, 10);
      const pkg = quotaPackages.find((p) => p.id === editTarget);
      if (pkg) {
        if (newTotal > pkg.total) {
          alert('数据量仅支持减量操作！请输小于等于原额度（' + pkg.total + '）的数值。');
          return;
        }
        if (formDate < pkg.expiry) {
          alert('有效期仅支持延期操作！请输入晚于等于原有效期（' + pkg.expiry + '）的日期。');
          return;
        }
        const isUsedUp = newTotal <= pkg.used;
        const newStatus = isUsedUp ? '已用完' : '使用中';
        setQuotaPackages((prev) =>
          prev.map((p) => (p.id === editTarget ? { ...p, total: newTotal, expiry: formDate, status: newStatus } : p))
        );
      }
    }
    closeModal();
  };

  // ── 减量校验：不允许超过当前数据量 ──
  const getReduceMax = () => {
    if (editTarget == null) return Infinity;
    const pkg = quotaPackages.find((p) => p.id === editTarget);
    return pkg?.total ?? Infinity;
  };

  // ── 延期校验：不允许早于原有过期日期 ──
  const getExtendMin = () => {
    if (editTarget == null) return undefined;
    const pkg = quotaPackages.find((p) => p.id === editTarget);
    return pkg?.expiry;
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
  const modalTitleMap = { add: '新增额度包', edit: '编辑额度包' };

  return (
    <>
      {/* ── 仪表盘已移除 ── */}
      {collectTaskEnabled && (<>

      {/* ── 额度包管理 ── */}
      <div className="pkg-section">
        <div className="pkg-header">
          <div className="pkg-header-left">
            <DatabaseOutlined className="pkg-icon" />
            <span className="pkg-title">额度包管理</span>
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
                    <span className={pkg.status === '使用中' ? 'pkg-status-enabled' : 'pkg-status-disabled'}>
                      {pkg.status}
                    </span>
                  </td>
                  <td>
                    <div className="pkg-actions">
                      <span className="pkg-action-link" onClick={() => openModal('edit', pkg.id)}>编辑</span>
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

      {/* ── 信源计费规则与单日风控限额 ── */}
      <div className="pkg-section" style={{ marginTop: '24px' }}>
        <div className="pkg-header" style={{ flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}>
          <div className="pkg-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SettingOutlined className="pkg-icon" />
            <span className="pkg-title">信源计费规则与单日配额风控</span>
            <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '8px' }}>
              （共 {platformRules.length} 个平台，已启用 <strong style={{ color: '#1890ff' }}>{platformRules.filter(r => r.enabled).length}</strong> 个，已设限额 <strong style={{ color: '#fa8c16' }}>{platformRules.filter(r => r.quotaLimitMode !== 'unlimited').length}</strong> 个）
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {showPlatformSaveToast && (
              <span style={{ background: '#f6ffed', border: '1px solid #b7eb8f', color: '#52c41a', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                ✓ 配置已实时同步并生效
              </span>
            )}
            <button
              className="btn-add-pkg"
              onClick={handleSavePlatformRules}
              style={{ background: '#1890ff', borderColor: '#1890ff' }}
            >
              保存信源配置
            </button>
          </div>
        </div>

        {/* 筛选与分类过滤工具栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>分类筛选:</span>
            {['all', '社交社区', '视频影音', '资讯媒体', '私域及专业'].map((cat) => {
              const count = cat === 'all' ? platformRules.length : platformRules.filter(r => r.category === cat).length;
              const isActive = platformCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setPlatformCategoryFilter(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    border: isActive ? '1px solid #1890ff' : '1px solid #d9d9d9',
                    background: isActive ? '#e6f7ff' : '#fff',
                    color: isActive ? '#1890ff' : 'var(--text-main)',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {cat === 'all' ? '全部' : cat} ({count})
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="搜索信源平台..."
              value={platformSearchText}
              onChange={(e) => setPlatformSearchText(e.target.value)}
              style={{
                width: '180px',
                height: '30px',
                padding: '0 8px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                fontSize: '12px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* 平台风控直观表格 */}
        <div className="pkg-table-wrapper" style={{ border: '1px solid #f0f0f0', borderRadius: '6px' }}>
          <table className="pkg-table" style={{ width: '100%', tableLayout: 'auto' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th style={{ width: '180px' }}>信源平台</th>
                <th style={{ width: '100px' }}>启用状态</th>
                <th style={{ width: '130px' }}>互动单价 (元/次)</th>
                <th style={{ width: '130px' }}>评论单价 (元/次)</th>
                <th style={{ width: '150px' }}>单日配额模式</th>
                <th style={{ minWidth: '220px' }}>单日采集配额上限 (次/天)</th>
                <th style={{ width: '160px' }}>风控状态说明</th>
              </tr>
            </thead>
            <tbody>
              {platformRules
                .filter((r) => {
                  const matchCat = platformCategoryFilter === 'all' || r.category === platformCategoryFilter;
                  const matchSearch = !platformSearchText.trim() || r.platformName.toLowerCase().includes(platformSearchText.trim().toLowerCase());
                  return matchCat && matchSearch;
                })
                .map((r, idx) => {
                  return (
                    <tr key={r.platformKey} className={idx % 2 === 1 ? 'row-odd' : ''} style={{ opacity: r.enabled ? 1 : 0.65 }}>
                      {/* 平台名称与分类 */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: r.platformKey === 'xhs' ? '#cf1322' : 'var(--text-main)', fontSize: '13px' }}>
                            {r.platformName}
                          </span>
                          <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '4px', background: '#f5f5f5', color: '#8c8c8c' }}>
                            {r.category}
                          </span>
                          {r.platformKey === 'xhs' && (
                            <span style={{ fontSize: '10px', background: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e', padding: '0 4px', borderRadius: '2px' }}>
                              严控
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 启用开关 */}
                      <td>
                        <div
                          className={`status-toggle ${r.enabled ? 'toggle-on' : 'toggle-off'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => updatePlatformRule(r.platformKey, { enabled: !r.enabled })}
                        >
                          <span className="toggle-dot" />
                        </div>
                      </td>

                      {/* 互动单价 */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            disabled={!r.enabled}
                            value={r.interactionPrice}
                            onChange={(e) => updatePlatformRule(r.platformKey, { interactionPrice: parseFloat(e.target.value) || 0 })}
                            style={{
                              width: '75px',
                              height: '28px',
                              padding: '0 6px',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              fontSize: '12px',
                              textAlign: 'right',
                              background: !r.enabled ? '#f5f5f5' : '#fff'
                            }}
                          />
                          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>元</span>
                        </div>
                      </td>

                      {/* 评论单价 */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            disabled={!r.enabled}
                            value={r.commentPrice}
                            onChange={(e) => updatePlatformRule(r.platformKey, { commentPrice: parseFloat(e.target.value) || 0 })}
                            style={{
                              width: '75px',
                              height: '28px',
                              padding: '0 6px',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              fontSize: '12px',
                              textAlign: 'right',
                              background: !r.enabled ? '#f5f5f5' : '#fff'
                            }}
                          />
                          <span style={{ fontSize: '12px', color: '#8c8c8c' }}>元</span>
                        </div>
                      </td>

                      {/* 单日配额模式 (Radio/Select) */}
                      <td>
                        <select
                          disabled={!r.enabled}
                          value={r.quotaLimitMode}
                          onChange={(e) => updatePlatformRule(r.platformKey, {
                            quotaLimitMode: e.target.value as any,
                            combinedDailyLimit: e.target.value === 'combined' ? (r.combinedDailyLimit || (r.platformKey === 'xhs' ? 1000 : 2000)) : r.combinedDailyLimit,
                            interactionDailyLimit: e.target.value === 'split' ? (r.interactionDailyLimit || 500) : r.interactionDailyLimit,
                            commentDailyLimit: e.target.value === 'split' ? (r.commentDailyLimit || 500) : r.commentDailyLimit,
                          })}
                          style={{
                            height: '28px',
                            padding: '0 8px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            fontSize: '12px',
                            background: !r.enabled ? '#f5f5f5' : '#fff',
                            color: 'var(--text-main)',
                            outline: 'none',
                          }}
                        >
                          <option value="unlimited">不限 (Unlimited)</option>
                          <option value="combined">合并限制 (Combined)</option>
                          <option value="split">分类型限制 (Split)</option>
                        </select>
                      </td>

                      {/* 单日采集配额上限动态输入框 */}
                      <td>
                        {r.quotaLimitMode === 'unlimited' ? (
                          <span style={{ color: '#bfbfbf', fontSize: '13px' }}>—</span>
                        ) : r.quotaLimitMode === 'combined' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              min="10"
                              max="100000"
                              step="10"
                              disabled={!r.enabled}
                              value={r.combinedDailyLimit ?? ''}
                              onChange={(e) => updatePlatformRule(r.platformKey, { combinedDailyLimit: parseInt(e.target.value, 10) || 0 })}
                              style={{
                                width: '90px',
                                height: '28px',
                                padding: '0 8px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                fontSize: '12px',
                                textAlign: 'right',
                                background: !r.enabled ? '#f5f5f5' : '#fff'
                              }}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>次/天</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: '#8c8c8c', width: '32px' }}>互动:</span>
                              <input
                                type="number"
                                min="10"
                                max="100000"
                                step="10"
                                disabled={!r.enabled}
                                value={r.interactionDailyLimit ?? ''}
                                onChange={(e) => updatePlatformRule(r.platformKey, { interactionDailyLimit: parseInt(e.target.value, 10) || 0 })}
                                style={{ width: '75px', height: '24px', padding: '0 6px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '11px', textAlign: 'right' }}
                              />
                              <span style={{ fontSize: '11px', color: '#8c8c8c' }}>次/天</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '11px', color: '#8c8c8c', width: '32px' }}>评论:</span>
                              <input
                                type="number"
                                min="10"
                                max="100000"
                                step="10"
                                disabled={!r.enabled}
                                value={r.commentDailyLimit ?? ''}
                                onChange={(e) => updatePlatformRule(r.platformKey, { commentDailyLimit: parseInt(e.target.value, 10) || 0 })}
                                style={{ width: '75px', height: '24px', padding: '0 6px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '11px', textAlign: 'right' }}
                              />
                              <span style={{ fontSize: '11px', color: '#8c8c8c' }}>次/天</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* 风控说明 */}
                      <td>
                        {r.quotaLimitMode === 'unlimited' ? (
                          <span style={{ color: '#8c8c8c', fontSize: '12px' }}>无速率限制</span>
                        ) : r.quotaLimitMode === 'combined' ? (
                          <span style={{ color: r.platformKey === 'xhs' ? '#d4380d' : '#1890ff', fontSize: '12px', fontWeight: r.platformKey === 'xhs' ? 600 : 400 }}>
                            {r.platformKey === 'xhs' ? '🔥 严控限额 ≤ ' : '合并配额 ≤ '}
                            {r.combinedDailyLimit?.toLocaleString()} 次/天
                          </span>
                        ) : (
                          <span style={{ color: '#722ed1', fontSize: '12px' }}>
                            互:{r.interactionDailyLimit} / 评:{r.commentDailyLimit} 次
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 任务额度明细 ── */}
      <div 
        className="pkg-section log-section" 
        style={{ 
          marginTop: '24px', 
          opacity: quotaDetailEnabled ? 1 : 0.75,
          transition: 'opacity 0.3s ease'
        }}
      >
        <div className="pkg-header">
          <div className="pkg-header-left">
            <ClockCircleOutlined className="pkg-icon" />
            <span className="pkg-title">任务额度明细</span>
            {!quotaDetailEnabled && (
              <span style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '12px', fontWeight: 'normal' }}>
                （已关闭：客户系统中不可查看此明细）
              </span>
            )}
          </div>
        </div>

        {/* 筛选卡片 */}
        <div className="qf-filter-card" style={{ border: 'none', borderRadius: 0, borderBottom: '1px solid var(--border-light)', margin: 0, padding: '16px' }}>
          <div className="qf-filter-row">
            <div className="qf-filter-item">
              <label className="qf-filter-label">任务名称</label>
              <input
                type="text"
                placeholder="请输入任务名称"
                className="qf-filter-input"
                style={{ width: '160px' }}
                value={filterTaskName}
                onChange={(e) => setFilterTaskName(e.target.value)}
              />
            </div>
            <div className="qf-filter-item">
              <label className="qf-filter-label">创建时间</label>
              <div className="qf-date-picker-group">
                <input
                  type="date"
                  className="qf-filter-input"
                  value={filterDateStart}
                  onChange={(e) => setFilterDateStart(e.target.value)}
                />
                <span>至</span>
                <input
                  type="date"
                  className="qf-filter-input"
                  value={filterDateEnd}
                  onChange={(e) => setFilterDateEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="qf-filter-item">
              <label className="qf-filter-label">采集范围</label>
              <select
                className="qf-filter-select"
                style={{ width: '120px' }}
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
              >
                <option value="">全部范围</option>
                <option value="topic">全网专题</option>
                <option value="source">重点源</option>
                <option value="other">链接</option>
              </select>
            </div>
            <div className="qf-filter-item">
              <label className="qf-filter-label">采集来源</label>
              <select
                className="qf-filter-select"
                style={{ width: '120px' }}
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="">全部平台</option>
                {PLATFORMS_LIST.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="qf-filter-item">
              <label className="qf-filter-label">采集类型</label>
              <select
                className="qf-filter-select"
                style={{ width: '120px' }}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">全部类型</option>
                <option value="评论区采集">评论区采集</option>
                <option value="互动量更新">互动量更新</option>
              </select>
            </div>
            <div className="qf-filter-actions">
              <button className="btn-qf-reset" onClick={handleReset}>
                <RedoOutlined />
                <span>重置</span>
              </button>
              <button className="btn-qf-export" onClick={() => setExportModalOpen(true)}>
                <DownloadOutlined />
                <span>导出明细</span>
              </button>
            </div>
          </div>
        </div>

        {/* 任务消耗明细数据表 */}
        <div className="pkg-table-wrapper">
          <table className="pkg-table">
            <thead>
              <tr>
                <th>任务名称</th>
                <th>创建时间</th>
                <th>采集范围</th>
                <th>采集来源</th>
                <th>采集类型</th>
                <th style={{ textAlign: 'right' }}>已消耗额度</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', height: '100px', color: 'var(--text-tertiary)' }}>
                    暂无符合条件的采集任务明细数据
                  </td>
                </tr>
              ) : (
                filteredData.map((task, idx) => {
                  const scopeInfo = SCOPE_MAP[task.scope_type] || { label: '其他', class: 'qf-tag-scope-other' };
                  return (
                    <tr key={task.id} className={idx % 2 === 1 ? 'row-odd' : ''}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{task.task_name}</td>
                      <td className="qf-num-tabular">{task.task_create_time}</td>
                      <td>
                        <span className={`qf-tag-fixed ${scopeInfo.class}`}>
                          {scopeInfo.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap' }}>
                          {task.platforms.map((p) => (
                            <span key={p} className={`qf-tag-fixed ${PLATFORM_CLASSES[p] || 'qf-tag-plat-default'}`}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={task.collect_type === '互动量更新' ? 'qf-tag-type-interact' : 'qf-tag-type-comment'}>
                          {task.collect_type}
                        </span>
                      </td>
                      <td className="qf-num-tabular" style={{ color: '#FF4D4F', fontWeight: 600, textAlign: 'right' }}>
                        {formatNum(task.total_cost)} 次
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <span className={`qf-status-dot ${task.status === '进行中' ? 'qf-status-dot-active' : 'qf-status-dot-inactive'}`} />
                          <span style={{ color: task.status === '进行中' ? 'var(--success-color)' : 'var(--text-tertiary)' }}>
                            {task.status}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="qf-action-detail" onClick={() => handleViewDetail(task)}>查看明细</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页器 */}
        <div className="pkg-pagination">
          <span className="pagination-total">共 {filteredData.length} 条</span>
          <div className="pagination-pages">
            <button className="page-btn page-prev" disabled>&lt;</button>
            <button className="page-btn page-active">1</button>
            <button className="page-btn page-next" disabled>&gt;</button>
          </div>
          <span className="pkg-page-size">20 条/页</span>
        </div>
      </div>
      </>)}

      {/* ═══════ 查看明细抽屉 (Drawer) ═══════ */}
      {drawerVisible && selectedTask && (
        <div className="qf-drawer-overlay" onClick={() => setDrawerVisible(false)}>
          <div className="qf-drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="qf-drawer-header">
              <span className="qf-drawer-close" onClick={() => setDrawerVisible(false)}>
                <CloseOutlined />
              </span>
              <div className="qf-drawer-title">{selectedTask.task_name}</div>
              <div className="qf-drawer-meta-list">
                <div className="qf-drawer-meta-item">
                  <span>采集范围：</span>
                  <span className={`qf-tag-fixed ${SCOPE_MAP[selectedTask.scope_type]?.class || 'qf-tag-scope-other'}`}>
                    {SCOPE_MAP[selectedTask.scope_type]?.label || '其他'}
                  </span>
                </div>
                <div className="qf-drawer-meta-item" style={{ marginLeft: '12px' }}>
                  <span>采集来源：</span>
                  <div style={{ display: 'inline-flex', gap: '4px' }}>
                    {selectedTask.platforms.map((p) => (
                      <span key={p} className={`qf-tag-fixed ${PLATFORM_CLASSES[p] || 'qf-tag-plat-default'}`}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="qf-drawer-meta-item" style={{ marginLeft: '12px' }}>
                  <span>已消耗：</span>
                  <strong style={{ color: '#FF4D4F', marginLeft: '4px' }}>{formatNum(selectedTask.total_cost)} 次</strong>
                </div>
              </div>
            </div>

            <div className="qf-drawer-body">
              <div className="qf-drawer-section-title">任务消耗额度详情</div>
              <div className="pkg-table-wrapper" style={{ border: '1px solid var(--border-light)', borderRadius: '4px' }}>
                <table className="pkg-table">
                  <thead>
                    <tr>
                      <th>采集时间</th>
                      <th>采集类型</th>
                      <th>采集来源</th>
                      <th>状态</th>
                      <th style={{ textAlign: 'right' }}>额度消耗</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTask.execution_records.map((exec, idx) => (
                      <tr key={exec.id} className={idx % 2 === 1 ? 'row-odd' : ''}>
                        <td className="qf-num-tabular">{exec.collect_time}</td>
                        <td>
                          <span className={exec.collect_type === '互动量更新' ? 'qf-tag-type-interact' : 'qf-tag-type-comment'}>
                            {exec.collect_type}
                          </span>
                        </td>
                        <td>
                          <span className={`qf-tag-fixed ${PLATFORM_CLASSES[exec.platform] || 'qf-tag-plat-default'}`}>
                            {exec.platform}
                          </span>
                        </td>
                        <td>
                          {exec.collect_status === '采集成功' ? (
                            <span className="qf-tag-status-success">采集成功</span>
                          ) : (
                            <div className="qf-tooltip qf-tag-status-failed">
                              采集失败
                              <span className="qf-tooltiptext">{exec.fail_reason || '未知错误'}</span>
                            </div>
                          )}
                        </td>
                        <td className="qf-num-tabular" style={{ color: exec.cost > 0 ? '#FF4D4F' : 'var(--text-tertiary)', fontWeight: 500, textAlign: 'right' }}>
                          {exec.cost > 0 ? `-${exec.cost} 次` : '0 次'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="qf-drawer-footer">
              <button className="btn-modal-cancel" style={{ width: '100%' }} onClick={() => setDrawerVisible(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ 导出额度明细弹窗 ═══════ */}
      {exportModalOpen && (
        <div className="modal-overlay" onClick={() => { if (!exportLoading) setExportModalOpen(false); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ width: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">导出消耗明细</span>
              {!exportLoading && <CloseOutlined className="modal-close" onClick={() => setExportModalOpen(false)} />}
            </div>
            <div className="modal-body" style={{ position: 'relative' }}>
              {exportLoading && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(255,255,255,0.8)', zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
                }}>
                  <div className="loading-spinner" style={{
                    width: '32px', height: '32px', border: '3px solid var(--border-color)',
                    borderTop: '3px solid var(--primary-color)', borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                  `}} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{exportMessage}</span>
                </div>
              )}

              {/* 导出范围 */}
              <div className="modal-form-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '20px' }}>
                <label className="modal-label" style={{ fontWeight: 600 }}>导出范围</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="radio-item">
                    <span className={`radio-circle ${exportScope === 'all' ? 'radio-checked' : ''}`} onClick={() => setExportScope('all')} />
                    <span>全部数据</span>
                  </label>
                  <label className="radio-item" style={{ marginTop: '4px' }}>
                    <span className={`radio-circle ${exportScope === 'filtered' ? 'radio-checked' : ''}`} onClick={() => setExportScope('filtered')} />
                    <span>筛选结果 ({filteredData.length} 条任务)</span>
                  </label>
                </div>
              </div>

              {/* 导出时间 */}
              <div className="modal-form-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                <label className="modal-label" style={{ fontWeight: 600 }}>导出流水时间范围</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <input
                    type="date"
                    className="modal-input"
                    value={exportDateStart}
                    disabled={exportScope === 'all'}
                    onChange={(e) => setExportDateStart(e.target.value)}
                  />
                  <span style={{ color: 'var(--text-tertiary)' }}>至</span>
                  <input
                    type="date"
                    className="modal-input"
                    value={exportDateEnd}
                    disabled={exportScope === 'all'}
                    onChange={(e) => setExportDateEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setExportModalOpen(false)} disabled={exportLoading}>
                取消
              </button>
              <button className="btn-modal-confirm" onClick={handleExport} disabled={exportLoading}>
                确认导出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导出成功全局 Toast 提示 */}
      {showExportToast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '10px 20px',
          borderRadius: '4px', zIndex: 3000, display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '14px', animation: 'qfFadeIn 0.2s'
        }}>
          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>✓</span>
          <span>{exportMessage}</span>
        </div>
      )}

      {/* ═══════ 通用额度包弹窗（新增 / 编辑） ═══════ */}
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
                      max={modalMode === 'edit' ? getReduceMax() : undefined}
                      step="1"
                      placeholder="请输入正整数"
                      value={formAmount}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (modalMode === 'edit') {
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
                    min={modalMode === 'edit' ? getExtendMin() : undefined}
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={closeModal}>取消</button>
              <button
                className="btn-modal-confirm"
                disabled={!formAmount || !formDate}
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
const CostStatisticsTab: React.FC<{ alertThreshold: number }> = ({ alertThreshold }) => {
  const [activeCostTab, setActiveCostTab] = useState('times');
  const [statsEnabled, setStatsEnabled] = useState(true);
  const [collectTaskEnabled, setCollectTaskEnabled] = useState(true);
  const [quotaDetailEnabled, setQuotaDetailEnabled] = useState(true);

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

      {/* ── 状态栏 ── */}
      {activeCostTab === 'rows' ? (
        <CostStatusBar 
          statsEnabled={statsEnabled} 
          onToggle={() => setStatsEnabled(!statsEnabled)} 
          showExpiry={true}
        />
      ) : (
        <CollectTaskStatusBar
          collectTaskEnabled={collectTaskEnabled}
          onToggleCollectTask={() => {
            const nextVal = !collectTaskEnabled;
            setCollectTaskEnabled(nextVal);
            if (!nextVal) {
              setQuotaDetailEnabled(false);
            }
          }}
          quotaDetailEnabled={quotaDetailEnabled}
          onToggleQuotaDetail={() => setQuotaDetailEnabled(!quotaDetailEnabled)}
        />
      )}

      {/* ── 二级 Tab 内容 ── */}
      <div className="cost-sub-tab-content">
        {activeCostTab === 'rows' && <DataPackageTab />}
        {activeCostTab === 'times' && (
          <CollectTaskQuotaTab 
            collectTaskEnabled={collectTaskEnabled} 
            quotaDetailEnabled={quotaDetailEnabled} 
            alertThreshold={alertThreshold} 
          />
        )}
      </div>
    </div>
  );
};

const CustomerConfig: React.FC<CustomerConfigProps> = ({ customerName, onBack }) => {
  const [activeTab, setActiveTab] = useState('cost');

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

  // ── 预警配置状态 ──
  const [alertThreshold, setAlertThreshold] = useState(30);

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

        {/* ═══════ 任务数据配置 ═══════ */}
        <div className="form-section">
          <div className="section-header">
            <DatabaseOutlined className="section-flag-icon" />
            <span className="section-title">任务数据配置</span>
          </div>

          {/* ── 搜索配置 ── */}
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

            {/* 额度预警配置 */}
            <div className="form-row">
              <label className="form-label">额度预警配置</label>
              <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>当剩余可用额度低于总额度的</span>
                <input
                  type="number"
                  className="qf-filter-input"
                  style={{ width: '80px', textAlign: 'center', height: '30px', padding: '0 8px' }}
                  min="0"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    val = Math.max(0, Math.min(100, val));
                    setAlertThreshold(val);
                  }}
                />
                <span>% 时，系统进行提醒。</span>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'cost' && (
          <CostStatisticsTab alertThreshold={alertThreshold} />
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
