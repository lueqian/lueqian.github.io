/**
 * @name 额度明细
 * @description 任务聚合化重构版本 —— 外层展示任务级别额度消耗总览，Drawer 展示单任务采集执行明细
 *
 * 变更记录：
 * - 移除页面标题 "额度明细"
 * - 搜索模块：所属任务 Select → Input 模糊查询
 * - 一级列表：从单次采集记录 → 任务聚合记录
 * - 详情 Drawer：从帖子快照 → 任务消耗额度详情表
 * - 彻底移除帖子快照/评论快照逻辑
 */

import '../style.css';
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Table, Tag, Button, Select, DatePicker, Tooltip, Drawer, Input, Badge, Modal, Radio, Space, Spin, message } from 'antd';
import {
  SearchOutlined,
  RedoOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

// ============ 类型定义 ============

/** 任务级别的聚合记录（一级列表） */
type TaskRecord = {
  id: string;
  task_create_time: string;
  task_name: string;
  scope_type: string;
  platforms: string[];
  collect_type: string;
  total_cost: number;
  status: '进行中' | '已关闭';
  /** 该任务下的所有采集执行记录 */
  execution_records: ExecutionRecord[];
};

/** 单次采集执行记录（Drawer 内表格） */
type ExecutionRecord = {
  id: string;
  collect_time: string;
  collect_type: string;
  platform: string;
  collect_status: '采集成功' | '采集失败';
  cost: number;
  /** 失败时的状态码/原因（Hover 展示） */
  fail_reason?: string;
};

// ============ 常量 ============

const PLATFORMS = ['小红书', '抖音', '微博', '今日头条', '快手', 'B站'];

const PLATFORM_TAG_COLORS: Record<string, string> = {
  '小红书': 'magenta',
  '抖音': 'default',
  '微博': 'orange',
  '今日头条': 'red',
  '快手': 'volcano',
  'B站': 'cyan',
};

const SCOPE_MAP: Record<string, { label: string; color: string }> = {
  topic: { label: '全网专题', color: 'cyan' },
  source: { label: '重点源', color: 'geekblue' },
  other: { label: '链接', color: 'default' },
};

// ============ Mock 数据生成 ============

/** 任务名前缀池 */
const TASK_PREFIXES = ['汽车', '房产', '快消', '教育', '大健康'];
const TASK_SUFFIXES = ['行业监控', '专题调研', '负面预警'];
const SCOPE_TYPES: string[] = ['topic', 'source', 'other'];
const COLLECT_TYPES: string[] = ['评论区采集', '互动量更新'];
const TIME_SLOTS = ['00:00:00', '06:00:00', '12:00:00', '18:00:00'];

/** 平台对应的单次采集成本（模拟） */
const PLATFORM_COST: Record<string, number> = {
  '小红书': 15,
  '抖音': 10,
  '微博': 8,
  '今日头条': 7,
  '快手': 6,
  'B站': 5,
};

/** 失败原因池 */
const FAIL_REASONS = [
  '状态码: 403 - 平台反爬拦截',
  '状态码: 500 - 目标页面服务异常',
  '状态码: 429 - 请求频率超限',
  '状态码: 502 - 网关超时',
  '状态码: 404 - 页面不存在或已删除',
];

function generateTaskData(): TaskRecord[] {
  var tasks: TaskRecord[] = [];

  // 固定随机种子风格的确定性生成（使用索引）
  function seededRandom(seed: number): number {
    var x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  for (var idx = 0; idx < 15; idx++) {
    // 任务名
    var prefix = TASK_PREFIXES[idx % TASK_PREFIXES.length];
    var suffix = TASK_SUFFIXES[Math.floor(seededRandom(idx * 7 + 1) * TASK_SUFFIXES.length)];
    var taskName = prefix + suffix + '_' + String(idx + 1).padStart(3, '0');

    // 采集范围
    var scopeType = SCOPE_TYPES[Math.floor(seededRandom(idx * 13 + 3) * SCOPE_TYPES.length)];

    // 采集类型
    var collectType = COLLECT_TYPES[Math.floor(seededRandom(idx * 17 + 5) * COLLECT_TYPES.length)];

    // 采集来源：1-3个平台
    var shuffled = [...PLATFORMS].sort(function () { return seededRandom(idx * 23 + 7) - 0.5; });
    var platformCount = 1 + Math.floor(seededRandom(idx * 29 + 11) * 3);
    var taskPlatforms = shuffled.slice(0, platformCount);

    // 状态：10条进行中，5条已关闭
    var status: '进行中' | '已关闭' = idx < 10 ? '进行中' : '已关闭';

    // 任务创建时间：4月18日-4月27日之间随机
    var createDay = 18 + Math.floor(seededRandom(idx * 31 + 13) * 10);
    var createHour = Math.floor(seededRandom(idx * 37 + 17) * 24);
    var taskCreateTime = '2026-04-' + String(createDay).padStart(2, '0') + ' ' + String(createHour).padStart(2, '0') + ':00:00';

    // 生成执行记录：4月24日-4月26日，每天4个时段 × 平台数
    var execRecords: ExecutionRecord[] = [];
    var execId = 0;
    for (var day = 24; day <= 26; day++) {
      for (var si = 0; si < TIME_SLOTS.length; si++) {
        var timeStr = '2026-04-' + String(day).padStart(2, '0') + ' ' + TIME_SLOTS[si];
        for (var pi = 0; pi < taskPlatforms.length; pi++) {
          var plat = taskPlatforms[pi];
          var baseCost = PLATFORM_COST[plat] || 10;
          // 5% 失败概率
          var failSeed = seededRandom(idx * 1000 + day * 100 + si * 10 + pi);
          var isFailed = failSeed < 0.05;
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
    // 按采集时间倒序
    execRecords.reverse();

    var totalCost = execRecords.reduce(function (s, r) { return s + r.cost; }, 0);

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

  // 按任务创建时间倒序
  tasks.sort(function (a, b) { return b.task_create_time.localeCompare(a.task_create_time); });

  return tasks;
}

const TASK_DATA = generateTaskData();

// ============ 详情抽屉：任务消耗额度详情 ============

const TaskDetailDrawer: React.FC<{
  visible: boolean;
  record: TaskRecord | null;
  onClose: () => void;
}> = function ({ visible, record, onClose }) {
  if (!record) return null;

  var scopeInfo = SCOPE_MAP[record.scope_type] || SCOPE_MAP.other;

  // Drawer 内表格列
  var execColumns = [
    {
      title: '采集时间',
      dataIndex: 'collect_time',
      key: 'collect_time',
      width: 170,
      render: function (val: string) {
        return <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: 'rgba(0,0,0,0.65)' }}>{val}</span>;
      },
    },
    {
      title: '采集类型',
      dataIndex: 'collect_type',
      key: 'collect_type',
      width: 110,
      render: function (val: string) {
        return <Tag color={val === '互动量更新' ? 'blue' : 'purple'}>{val}</Tag>;
      },
    },
    {
      title: '采集来源',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: function (val: string) {
        return <Tag color={PLATFORM_TAG_COLORS[val] || 'default'}>{val}</Tag>;
      },
    },
    {
      title: '采集状态',
      dataIndex: 'collect_status',
      key: 'collect_status',
      width: 100,
      render: function (val: string, row: ExecutionRecord) {
        if (val === '采集成功') {
          return <Tag color="success">采集成功</Tag>;
        }
        return (
          <Tooltip title={row.fail_reason || '未知原因'}>
            <Tag color="error">采集失败</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '额度消耗',
      dataIndex: 'cost',
      key: 'cost',
      width: 90,
      render: function (val: number) {
        return <span style={{ color: val > 0 ? '#FF4D4F' : 'rgba(0,0,0,0.25)', fontWeight: 500 }}>{val} 次</span>;
      },
    },
  ];

  return (
    <Drawer
      title={null}
      placement="right"
      width={720}
      onClose={onClose}
      open={visible}
      className="qf-detail-drawer"
      styles={{ body: { padding: 0 } }}
      closeIcon={null}
    >
      {/* 头部：任务名 + 基本信息 */}
      <div className="qf-drawer-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.88)', marginBottom: 12 }}>{record.task_name}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
          <span>采集范围：<Tag color={scopeInfo.color} style={{ marginLeft: 4 }}>{scopeInfo.label}</Tag></span>
          <span>采集来源：{record.platforms.map(function (p) { return <Tag key={p} color={PLATFORM_TAG_COLORS[p] || 'default'} style={{ marginLeft: 4 }}>{p}</Tag>; })}</span>
          <span>采集类型：<Tag color={record.collect_type === '互动量更新' ? 'blue' : 'purple'} style={{ marginLeft: 4 }}>{record.collect_type}</Tag></span>
          <span>已消耗额度：<strong style={{ color: '#FF4D4F', marginLeft: 4 }}>{record.total_cost} 次</strong></span>
        </div>
      </div>

      {/* 中部：任务消耗额度详情表 */}
      <div style={{ padding: '16px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.88)', marginBottom: 12 }}>任务消耗额度详情</div>
        <Table
          dataSource={record.execution_records}
          columns={execColumns}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ y: 'calc(100vh - 320px)' }}
        />
      </div>

      {/* 底部关闭按钮 */}
      <div className="qf-drawer-footer">
        <Button onClick={onClose} block>关闭</Button>
      </div>
    </Drawer>
  );
};

// ============ 主组件 ============

const QuotaFlow: React.FC = function () {
  // 筛选状态
  var [filterTaskName, setFilterTaskName] = useState<string>('');
  var [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  var [filterScope, setFilterScope] = useState<string>('');
  var [filterPlatform, setFilterPlatform] = useState<string[]>([]);
  var [filterType, setFilterType] = useState<string>('');

  // 详情抽屉
  var [drawerVisible, setDrawerVisible] = useState(false);
  var [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);

  // 重置
  var handleReset = useCallback(function () {
    setFilterTaskName('');
    setFilterDateRange(null);
    setFilterScope('');
    setFilterPlatform([]);
    setFilterType('');
  }, []);

  // 筛选数据
  var filteredData = useMemo(function () {
    var result = [...TASK_DATA];
    if (filterTaskName.trim()) {
      var keyword = filterTaskName.trim().toLowerCase();
      result = result.filter(function (r) { return r.task_name.toLowerCase().includes(keyword); });
    }
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      var start = filterDateRange[0].format('YYYY-MM-DD');
      var end = filterDateRange[1].format('YYYY-MM-DD');
      result = result.filter(function (r) {
        var dateStr = r.task_create_time.slice(0, 10);
        return dateStr >= start && dateStr <= end;
      });
    }
    if (filterScope) {
      result = result.filter(function (r) { return r.scope_type === filterScope; });
    }
    if (filterPlatform.length > 0) {
      result = result.filter(function (r) { return r.platforms.some(function (p) { return filterPlatform.includes(p); }); });
    }
    if (filterType) {
      result = result.filter(function (r) { return r.collect_type === filterType; });
    }
    return result;
  }, [filterTaskName, filterDateRange, filterScope, filterPlatform, filterType]);

  // 查看详情
  var handleViewDetail = useCallback(function (record: TaskRecord) {
    setSelectedTask(record);
    setDrawerVisible(true);
  }, []);

  // ============ 导出功能 ============

  var [exportModalOpen, setExportModalOpen] = useState(false);
  var [exportScope, setExportScope] = useState<'all' | 'filtered'>('filtered');
  var [exportDateRange, setExportDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(365, 'day'),
    dayjs(),
  ]);
  var [exportLoading, setExportLoading] = useState(false);

  // 展平数据：将任务维度 + 执行记录维度合并为一维数组
  var flattenData = useCallback(function (tasks: TaskRecord[]) {
    var rows: Record<string, string | number>[] = [];
    tasks.forEach(function (task) {
      var scopeInfo = SCOPE_MAP[task.scope_type] || SCOPE_MAP.other;
      task.execution_records.forEach(function (exec) {
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

  // 执行导出（异步模拟）
  var handleExport = useCallback(function () {
    var sourceTasks = exportScope === 'filtered' ? filteredData : TASK_DATA;

    // 按时间范围过滤展平数据
    var allRows = flattenData(sourceTasks);
    var rows = allRows.filter(function (row) {
      var execDate = row['采集时间'] as string;
      return execDate >= exportDateRange[0].format('YYYY-MM-DD HH:mm:ss')
        && execDate <= exportDateRange[1].format('YYYY-MM-DD HH:mm:ss');
    });

    if (rows.length === 0) {
      message.warning('所选时间范围内暂无可导出的数据');
      return;
    }

    // 开始加载
    setExportLoading(true);

    // 模拟3秒异步处理
    setTimeout(function () {
      var ws = XLSX.utils.json_to_sheet(rows);
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
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '额度明细');
      XLSX.writeFile(wb, '额度明细_' + dayjs().format('YYYYMMDDHHmmss') + '.xlsx');

      setExportLoading(false);
      message.success('导出成功！数据已生成，共 ' + rows.length + ' 条记录');

      // 0.5s 后自动关闭弹窗
      setTimeout(function () {
        setExportModalOpen(false);
      }, 500);
    }, 3000);
  }, [exportScope, exportDateRange, filteredData, flattenData]);

  // 表格列
  var columns = [
    {
      title: '任务名',
      dataIndex: 'task_name',
      key: 'task_name',
      width: 260,
      ellipsis: { showTitle: true },
      render: function (val: string) {
        return <span style={{ fontWeight: 600, color: 'rgba(0,0,0,0.88)' }}>{val}</span>;
      },
    },
    {
      title: '任务创建时间',
      dataIndex: 'task_create_time',
      key: 'task_create_time',
      width: 170,
      render: function (val: string) {
        return <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', color: 'rgba(0,0,0,0.65)' }}>{val}</span>;
      },
    },
    {
      title: '采集范围',
      dataIndex: 'scope_type',
      key: 'scope_type',
      width: 100,
      render: function (val: string) {
        var info = SCOPE_MAP[val] || SCOPE_MAP.other;
        return <Tag color={info.color} className="qf-tag-fixed">{info.label}</Tag>;
      },
    },
    {
      title: '采集来源',
      dataIndex: 'platforms',
      key: 'platforms',
      width: 160,
      render: function (val: string[]) {
        return (
          <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
            {val.map(function (p) {
              return <Tag key={p} color={PLATFORM_TAG_COLORS[p] || 'default'} className="qf-tag-fixed">{p}</Tag>;
            })}
          </span>
        );
      },
    },
    {
      title: '采集类型',
      dataIndex: 'collect_type',
      key: 'collect_type',
      width: 110,
      render: function (val: string) {
        return <Tag color={val === '互动量更新' ? 'blue' : 'purple'}>{val}</Tag>;
      },
    },
    {
      title: '已消耗额度',
      dataIndex: 'total_cost',
      key: 'total_cost',
      width: 120,
      render: function (val: number) {
        return <span style={{ color: '#FF4D4F', fontWeight: 600 }}>{val} 次</span>;
      },
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: function (val: string) {
        var isActive = val === '进行中';
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Badge color={isActive ? '#52c41a' : '#d9d9d9'} />
            <span style={{ color: isActive ? '#52c41a' : 'rgba(0,0,0,0.45)', fontSize: 13 }}>{val}</span>
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: function (_: any, record: TaskRecord) {
        return <a className="qf-action-link" data-testid="view-detail" onClick={function () { handleViewDetail(record); }}>查看详情</a>;
      },
    },
  ];

  return (
    <div className="qf-page">
      {/* 筛选区 */}
      <div className="qf-filter-card">
        <div className="qf-filter-row">
          <div className="qf-filter-item">
            <label className="qf-filter-label">任务名称</label>
            <Input
              placeholder="请输入任务名称模糊查询"
              style={{ width: 240 }}
              size="middle"
              allowClear
              value={filterTaskName}
              onChange={function (e) { setFilterTaskName(e.target.value); }}
            />
          </div>
          <div className="qf-filter-item">
            <label className="qf-filter-label">任务创建时间</label>
            <DatePicker.RangePicker
              size="middle"
              style={{ width: 240 }}
              value={filterDateRange}
              onChange={function (dates) { setFilterDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null); }}
            />
          </div>
          <div className="qf-filter-item">
            <label className="qf-filter-label">采集范围</label>
            <Select
              allowClear
              placeholder="全部范围"
              style={{ width: 150 }}
              size="middle"
              value={filterScope || undefined}
              onChange={function (v) { setFilterScope(v || ''); }}
              options={[
                { value: 'topic', label: '全网专题' },
                { value: 'source', label: '重点源' },
                { value: 'other', label: '链接' },
              ]}
            />
          </div>
          <div className="qf-filter-item">
            <label className="qf-filter-label">采集来源</label>
            <Select
              mode="multiple"
              allowClear
              placeholder="全部平台"
              style={{ width: 200 }}
              size="middle"
              value={filterPlatform.length > 0 ? filterPlatform : undefined}
              onChange={function (v) { setFilterPlatform(v as string[]); }}
              options={PLATFORMS.map(function (p) { return { value: p, label: p }; })}
              maxTagCount={2}
            />
          </div>
          <div className="qf-filter-item">
            <label className="qf-filter-label">采集类型</label>
            <Select
              allowClear
              placeholder="全部类型"
              style={{ width: 150 }}
              size="middle"
              value={filterType || undefined}
              onChange={function (v) { setFilterType(v || ''); }}
              options={[
                { value: '评论区采集', label: '评论区采集' },
                { value: '互动量更新', label: '互动量更新' },
              ]}
            />
          </div>
          <div className="qf-filter-actions">
            <Button type="primary" icon={<SearchOutlined />} size="middle">查询</Button>
            <Button icon={<RedoOutlined />} size="middle" onClick={handleReset}>重置</Button>
            <Button icon={<DownloadOutlined />} size="middle" onClick={function () { setExportModalOpen(true); }}>导出明细</Button>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="qf-table-card">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          size="middle"
          scroll={{ x: 1040 }}
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
            showTotal: function (total) { return '共 ' + total + ' 条'; },
          }}
        />
      </div>

      {/* 详情抽屉 */}
      <TaskDetailDrawer
        visible={drawerVisible}
        record={selectedTask}
        onClose={function () { setDrawerVisible(false); }}
      />

      {/* 导出配置弹窗 */}
      <Modal
        title="导出消耗明细"
        open={exportModalOpen}
        width={480}
        onCancel={function () { if (!exportLoading) setExportModalOpen(false); }}
        maskClosable={!exportLoading}
        closable={!exportLoading}
        footer={null}
      >
        <Spin spinning={exportLoading} tip="正在合并多平台计费表并生成文件...">
          <div style={{ padding: '8px 0' }}>
            {/* 导出范围 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 8 }}>导出范围</div>
              <Radio.Group
                value={exportScope}
                onChange={function (e) { setExportScope(e.target.value); }}
              >
                <Space direction="vertical">
                  <Radio value="all">全部数据</Radio>
                  <Radio value="filtered">筛选结果</Radio>
                </Space>
              </Radio.Group>
            </div>

            {/* 导出时间范围 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(0,0,0,0.85)', marginBottom: 8 }}>导出时间范围</div>
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                disabled={exportScope === 'all'}
                value={exportDateRange}
                onChange={function (dates) {
                  if (dates && dates[0] && dates[1]) {
                    setExportDateRange([dates[0], dates[1]]);
                  }
                }}
                presets={[
                  { label: '过去一年', value: [dayjs().subtract(365, 'day'), dayjs()] },
                  { label: '过去半年', value: [dayjs().subtract(180, 'day'), dayjs()] },
                  { label: '过去三个月', value: [dayjs().subtract(90, 'day'), dayjs()] },
                  { label: '过去一个月', value: [dayjs().subtract(30, 'day'), dayjs()] },
                ]}
                disabledDate={function (current) { return current && current > dayjs().endOf('day'); }}
              />
            </div>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={function () { setExportModalOpen(false); }} disabled={exportLoading}>取消</Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={exportLoading}
                onClick={handleExport}
              >
                {exportLoading ? '正在导出...' : '确认导出'}
              </Button>
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default QuotaFlow;
