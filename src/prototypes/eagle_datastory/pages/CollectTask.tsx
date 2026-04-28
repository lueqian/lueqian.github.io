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
import { Table, Tag, Switch, Button, Select, Input, Space, Tooltip, Popconfirm, message, Descriptions, Card } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
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
  // 互动量更新 - 累计互动量
  interaction_total?: InteractionData;
  // 互动量更新 - 最近1次更新互动量
  interaction_last?: InteractionData;
  // 评论区采集 - 累计评论数
  comment_total?: number;
  // 评论区采集 - 最近1次采集评论数
  comment_last?: number;
};

// ============ 常量 ============

const PLATFORMS = ['小红书', '抖音', '小红书', '今日头条', '快手', 'B站', '知乎', '百度贴吧'];

const TOPIC_OPTIONS = [
  { value: 'topic_001', label: '汽车行业专题' },
  { value: 'topic_002', label: '消费专题调研' },
  { value: 'topic_003', label: '科技数码专题' },
  { value: 'topic_004', label: '食品安全专题' },
  { value: 'topic_005', label: '教育改革专题' },
];

const SOURCE_OPTIONS = [
  { value: 'src_001', label: '人民日报' },
  { value: 'src_002', label: '新华社' },
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
  '直播电商监测', '跨境电商追踪', '品牌声誉管理', '企业危机预警',
  '政策法规解读', '国际关系舆情', '突发事件监测', '公共卫生追踪',
  '双碳目标监测', '乡村振兴专题', '数字经济追踪', '智慧城市监测',
  '5G通信舆情', '物联网行业', '云计算话题', '大数据安全',
  '网络安全监测', '隐私保护话题', '知识产权追踪', '反垄断舆情',
  '职场文化分析', '青年就业话题', '养老产业监测', '生育政策舆情',
  '房地产调控追踪', '股市行情监控', '基金投资舆情', '保险行业评论',
  '银行金融监测', 'P2P网贷追踪', '消费维权话题', '产品质量预警',
  '食品安全评论', '药品监管监测', '医疗器械追踪', '健康管理话题',
  '心理健康专题', '体育赛事评论', '电影娱乐评论', '音乐综艺话题',
  '网红达人追踪', '品牌营销监测', '广告投放效果', '用户增长分析',
  '产品体验评论', '售后服务舆情', '物流配送评价', '价格波动监控',
  '竞品分析追踪', '行业报告采集', '学术论文监测', '专利技术追踪',
  '标准规范解读', '人才招聘舆情', '企业文化监测', 'ESG可持续追踪',
  '碳中和话题', '新能源车评论', '充电桩监测', '光伏产业追踪',
  '储能行业舆情', '氢能源话题', '风电行业监测', '核电安全追踪',
  '电力市场分析', '油气管网监测', '煤炭行业追踪', '矿业安全舆情',
  '钢铁行业监测', '化工行业评论', '建材市场追踪', '工程机械舆情',
  '船舶制造监测', '航空航天评论', '轨道交通追踪', '智能制造话题',
  '工业互联网舆情', '数字孪生监测', '机器人行业追踪', '自动驾驶话题',
  '车联网安全监测', '智能穿戴评论', '家电行业追踪', '消费电子舆情',
];

// ============ 生成105条模拟数据 ============

function generateMockData(): TaskItem[] {
  const data: TaskItem[] = [];
  const types: TaskType[] = ['interaction', 'comment'];
  const scopes: ScopeType[] = ['topic', 'source', 'other'];
  const freqModes = ['hour', 'day', 'month'];
  const freqLabels: Record<string, string[]> = {
    hour: ['每1小时', '每2小时', '每3小时', '每4小时', '每6小时', '每8小时', '每12小时'],
    day: ['每天08:00', '每天10:00', '每天12:00', '-', '-', '-'],
    month: ['每天09:00', '每天16:00', '每天10:00', '-', '-', '-'],
  };
  const trackDaysMap: Record<string, number[]> = { hour: [1, 3, 5, 7], day: [3, 5, 7], month: [7] };

  for (let i = 0; i < 105; i++) {
    const taskType = types[i % 2];
    const scopeType = scopes[i % 3];
    const freqMode = freqModes[i % 3];
    const freqOptions = freqLabels[freqMode];
    const frequency = freqOptions[i % freqOptions.length];
    const trackDaysOptions = trackDaysMap[freqMode];
    const trackDays = trackDaysOptions[i % trackDaysOptions.length];

    // 随机选1-3个平台
    const shuffled = [...PLATFORMS].sort(function () { return Math.random() - 0.5; });
    const platformCount = 1 + Math.floor(Math.random() * 3);
    const platforms = shuffled.slice(0, platformCount);

    const isActive = Math.random() > 0.3;
    const hasActivated = Math.random() > 0.5 || isActive;
    const totalBase = Math.floor(Math.random() * 200000) + 1000;
    const hourlyInc = Math.floor(Math.random() * 5000) + 10;

    const baseDate = dayjs('2026-04-16');
    const hourOffset = Math.floor(Math.random() * 72);
    const lastUpdated = baseDate.subtract(hourOffset, 'hour').format('YYYY-MM-DD HH:mm');

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
      status: isActive ? 'active' : 'inactive',
      has_activated: hasActivated,
      last_updated: lastUpdated,
      created_at: baseDate.subtract(Math.floor(Math.random() * 90), 'day').format('YYYY-MM-DD HH:mm'),
    };

    if (scopeType === 'topic') {
      task.related_topic = TOPIC_OPTIONS[i % TOPIC_OPTIONS.length].value;
    } else if (scopeType === 'source') {
      task.related_source = SOURCE_OPTIONS[i % SOURCE_OPTIONS.length].value;
    } else {
      task.link = 'https://example.com/post/' + (i + 1);
      task.title = '示例内容标题_' + nameSuffix;
      task.info_topic = ['社会热点', '产品评测', '行业分析', '用户反馈', '政策解读'][i % 5];
    }

    data.push(task);
  }

  // 随机选取50条作为开启状态，其余55条关闭
  const indices = Array.from({ length: 105 }, function (_, i) { return i; });
  // Fisher-Yates 洗牌
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
  }
  const activeIndices = new Set(indices.slice(0, 50));

  return data.map(function (t, i) {
    var isActive = activeIndices.has(i);
    if (t.task_type === 'interaction') {
      // 互动量更新：生成点赞/收藏/转发/评论的累计和最近1次数据
      var totalLikes = Math.floor(Math.random() * 50000) + 1000;
      var totalFavorites = Math.floor(Math.random() * 10000) + 200;
      var totalReposts = Math.floor(Math.random() * 5000) + 100;
      var totalComments = Math.floor(Math.random() * 8000) + 50;
      // 最近1次数据一定小于等于累计数据
      var lastLikes = Math.floor(Math.random() * totalLikes * 0.15) + 10;
      var lastFavorites = Math.floor(Math.random() * totalFavorites * 0.15) + 5;
      var lastReposts = Math.floor(Math.random() * totalReposts * 0.15) + 2;
      var lastComments = Math.floor(Math.random() * totalComments * 0.15) + 1;
      return {
        ...t,
        total_count: isActive ? totalLikes + totalFavorites + totalReposts + totalComments : 0,
        hourly_increment: isActive ? lastLikes + lastFavorites + lastReposts + lastComments : 0,
        status: isActive ? 'active' as TaskStatus : 'inactive' as TaskStatus,
        has_activated: isActive,
        interaction_total: isActive ? { likes: totalLikes, favorites: totalFavorites, reposts: totalReposts, comments: totalComments } : undefined,
        interaction_last: isActive ? { likes: lastLikes, favorites: lastFavorites, reposts: lastReposts, comments: lastComments } : undefined,
      };
    } else {
      // 评论区采集：生成累计评论数和最近1次评论数
      var cTotal = Math.floor(Math.random() * 20000) + 500;
      var cLast = Math.floor(Math.random() * cTotal * 0.1) + 5;
      return {
        ...t,
        total_count: isActive ? cTotal : 0,
        hourly_increment: isActive ? cLast : 0,
        status: isActive ? 'active' as TaskStatus : 'inactive' as TaskStatus,
        has_activated: isActive,
        comment_total: isActive ? cTotal : undefined,
        comment_last: isActive ? cLast : undefined,
      };
    }
  });
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

// ============ 列表页 ============

const TaskListView: React.FC<{
  tasks: TaskItem[];
  onToggle: (id: string, checked: boolean) => void;
  onEdit: (task: TaskItem) => void;
  onView: (task: TaskItem) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}> = function ({ tasks, onToggle, onEdit, onView, onCreate, onDelete }) {
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
        // 总量和增量都为0时允许修改，否则禁用
        var canEdit = record.total_count === 0 && record.hourly_increment === 0;
        return (
          <Space size={16}>
            {canEdit ? (
              <a className="ct-action-link" onClick={function () { onEdit(record); }}>修改</a>
            ) : (
              <Tooltip title="任务已启用过，不可修改">
                <span className="ct-action-disabled">修改</span>
              </Tooltip>
            )}
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
              animation={false}
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
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          新建任务
        </Button>
      </div>

      {/* 表格 */}
      <div className="table-page-table">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20, showSizeChanger: false, showTotal: function (total) { return '共 ' + total + ' 条'; } }}
          size="middle"
          scroll={{ x: 1210 }}
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
        {!isOtherScope ? (
          <div className="ct-detail-redirect">
            <InfoCircleOutlined style={{ fontSize: 18, color: '#faad14', marginRight: 8 }} />
            <span>
              请跳转至对应{task.scope_type === 'topic' ? '专题' : '重点源'}板块查看明细
            </span>
            <a className="ct-redirect-link" style={{ marginLeft: 8 }}>
              前往查看 →
            </a>
          </div>
        ) : task.task_type === 'interaction' ? (
          /* 场景A：互动量更新 → 指标卡片 + 趋势折线图 */
          <div className="ct-detail-content">
            {/* 指标卡片组 */}
            <div className="ct-metric-cards">
              {[
                { label: '点赞数', value: '2,350', icon: '👍', color: '#ff4d4f', bg: '#fff1f0' },
                { label: '收藏数', value: '512', icon: '⭐', color: '#faad14', bg: '#fffbe6' },
                { label: '转发数', value: '110', icon: '🔄', color: '#3b82f6', bg: '#e6f4ff' },
                { label: '评论数', value: '192', icon: '💬', color: '#52c41a', bg: '#f6ffed' },
              ].map(function (metric, idx) {
                return (
                  <div key={idx} className="ct-metric-card">
                    <div className="ct-metric-icon" style={{ backgroundColor: metric.bg, color: metric.color }}>
                      <span style={{ fontSize: 20 }}>{metric.icon}</span>
                    </div>
                    <div className="ct-metric-info">
                      <div className="ct-metric-label">{metric.label}</div>
                      <div className="ct-metric-value">{metric.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 趋势折线图 */}
            <div className="ct-detail-section" style={{ marginTop: 20 }}>
              <h4 style={{ marginBottom: 12 }}><BarChartOutlined style={{ marginRight: 6 }} />互动量趋势统计</h4>
              <div className="ct-chart-container">
                <div className="ct-chart-area">
                  {/* Y轴标签 */}
                  <div className="ct-chart-yaxis">
                    <span>2,500</span>
                    <span>2,000</span>
                    <span>1,500</span>
                    <span>1,000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>
                  {/* 图表主体 */}
                  <div className="ct-chart-body">
                    {/* 网格线 */}
                    <div className="ct-chart-grid">
                      {[0, 1, 2, 3, 4, 5].map(function (i) {
                        return <div key={i} className="ct-chart-grid-line" />;
                      })}
                    </div>
                    {/* SVG折线 */}
                    <svg className="ct-chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                      {/* 点赞量线 - 红 */}
                      <polyline
                        fill="none"
                        stroke="#ff4d4f"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points="0,152 120,142 240,124 360,105 480,82 600,60"
                      />
                      {/* 收藏量线 - 黄 */}
                      <polyline
                        fill="none"
                        stroke="#faad14"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points="0,188 120,187 240,185 360,183 480,182 600,180"
                      />
                      {/* 转发量线 - 蓝 */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points="0,198 120,197 240,195 360,193 480,190 600,188"
                      />
                      {/* 评论量线 - 绿 */}
                      <polyline
                        fill="none"
                        stroke="#52c41a"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points="0,196 120,194 240,191 360,185 480,178 600,172"
                      />
                      {/* 数据点 - 点赞 */}
                      {[[0,152],[120,142],[240,124],[360,105],[480,82],[600,60]].map(function (p, i) {
                        return <circle key={'like-'+i} cx={p[0]} cy={p[1]} r="3" fill="#ff4d4f" />;
                      })}
                      {/* 数据点 - 评论 */}
                      {[[0,196],[120,194],[240,191],[360,185],[480,178],[600,172]].map(function (p, i) {
                        return <circle key={'comment-'+i} cx={p[0]} cy={p[1]} r="3" fill="#52c41a" />;
                      })}
                    </svg>
                  </div>
                </div>
                {/* X轴标签 */}
                <div className="ct-chart-xaxis">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                  <span>18:00</span>
                </div>
                {/* 图例 */}
                <div className="ct-chart-legend">
                  <span className="ct-legend-item"><span className="ct-legend-dot" style={{ backgroundColor: '#ff4d4f' }} />点赞量</span>
                  <span className="ct-legend-item"><span className="ct-legend-dot" style={{ backgroundColor: '#faad14' }} />收藏量</span>
                  <span className="ct-legend-item"><span className="ct-legend-dot" style={{ backgroundColor: '#3b82f6' }} />转发量</span>
                  <span className="ct-legend-item"><span className="ct-legend-dot" style={{ backgroundColor: '#52c41a' }} />评论量</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 场景B：评论区采集 → 评论流水列表 + 分页 */
          <div className="ct-detail-content">
            <div className="ct-detail-section">
              <h4 style={{ marginBottom: 12 }}><UnorderedListOutlined style={{ marginRight: 6 }} />评论记录</h4>
              <div className="ct-comment-list">
                {[
                  { user: '用户A_' + task.id.slice(-3), content: '这个话题确实值得关注，最近讨论热度很高，各方观点都有涉及。', time: '2026-04-16 17:32', platform: task.platforms[0] },
                  { user: '用户B_' + task.id.slice(-3), content: '数据采集很及时，信息覆盖面广，希望能持续保持这个更新频率。', time: '2026-04-16 15:18', platform: task.platforms[1] || task.platforms[0] },
                  { user: '用户C_' + task.id.slice(-3), content: '希望能增加更多维度的分析数据，比如情感倾向和传播路径。', time: '2026-04-16 12:45', platform: task.platforms[0] },
                  { user: '用户D_' + task.id.slice(-3), content: '从数据来看，这个话题的讨论量在持续上升，建议关注后续走势。', time: '2026-04-16 10:22', platform: task.platforms[2] || task.platforms[0] },
                  { user: '用户E_' + task.id.slice(-3), content: '这个功能很实用，可以帮助我们快速了解舆论动态。', time: '2026-04-16 08:55', platform: task.platforms[1] || task.platforms[0] },
                ].map(function (comment, idx) {
                  return (
                    <div key={idx} className="ct-comment-item">
                      <div className="ct-comment-header">
                        <span className="ct-comment-user">{comment.user}</span>
                        <Tag style={{ marginLeft: 8 }}>{comment.platform}</Tag>
                        <span className="ct-comment-time">{comment.time}</span>
                      </div>
                      <div className="ct-comment-body">{comment.content}</div>
                    </div>
                  );
                })}
              </div>
              {/* 分页 */}
              <div className="ct-pagination">
                <span className="ct-pagination-info">共 128 条</span>
                <div className="ct-pagination-pages">
                  <span className="ct-pagination-btn ct-pagination-btn--active">1</span>
                  <span className="ct-pagination-btn">2</span>
                  <span className="ct-pagination-btn">3</span>
                  <span className="ct-pagination-btn">...</span>
                  <span className="ct-pagination-btn">13</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

// ============ 主组件 ============

type ViewType = 'list' | 'detail';

const CollectTask: React.FC = function () {
  // 列表/详情视图切换
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_DATA);
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
              var cTotal = Math.floor(Math.random() * 20000) + 500;
              var cLast = Math.floor(Math.random() * cTotal * 0.1) + 5;
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
        />
      ) : (
        selectedTask ? <TaskDetailView task={selectedTask} onBack={handleDetailBack} /> : null
      )}

      <CollectTaskDrawer
        open={drawerVisible}
        onClose={function () { setDrawerVisible(false); setEditData(null); }}
        onSubmit={function () {
          // 刷新列表
          if (editData) {
            setTasks(function (prev) {
              return prev.map(function (t) {
                if (t.id === editData.id) return { ...t, has_activated: true };
                return t;
              });
            });
            message.success('任务修改成功');
          } else {
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
        } : drawerInitialValues || undefined}
      />
    </div>
  );
};

export default CollectTask;
