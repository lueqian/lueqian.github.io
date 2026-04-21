/**
 * @name 额度明细
 * @description 从 quota-flow 原型迁移的纯内容区组件
 *
 * 移除了：sidebar、header、ConfigProvider、Axure Handle、collapsed state、布局 div
 * 保留了：所有筛选状态、详情抽屉、mock 数据生成、类型定义、常量
 */

import '../style.css';
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Tag, Button, Select, DatePicker, Tooltip, Drawer, Divider, message } from 'antd';
import {
  SearchOutlined,
  RedoOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// ============ 类型 ============

type FlowRecord = {
  id: string;
  collect_time: string;
  task_name: string;
  scope_type: string;
  platform: string;
  collect_type: string;
  post_id: string;
  post_title: string;
  cost: number;
  // 快照
  snapshot_likes?: number;
  snapshot_collects?: number;
  snapshot_shares?: number;
  snapshot_comments?: number;
  snapshot_comments_list?: string[];
};

// ============ 常量 ============

const PLATFORMS = ['小红书', '抖音', '微博', '今日头条', '快手', 'B站'];
const PLATFORM_COLORS: Record<string, string> = {
  '小红书': '#ff2442',
  '抖音': '#161823',
  '微博': '#ff8200',
  '今日头条': '#f85959',
  '快手': '#ff4906',
  'B站': '#00a1d6',
};
const PLATFORM_TAG_COLORS: Record<string, string> = {
  '小红书': 'magenta',
  '抖音': 'default',
  '微博': 'orange',
  '今日头条': 'red',
  '快手': 'volcano',
  'B站': 'cyan',
};

const CORE_TASKS = [
  '汽车行业重点源追踪_001',
  '消费专题调研_052',
  '小红书专项预警_088',
];

const SCOPE_MAP: Record<string, { label: string; color: string }> = {
  topic: { label: '全网专题', color: 'cyan' },
  source: { label: '重点源', color: 'geekblue' },
  other: { label: '链接', color: 'default' },
};

const POST_TITLES = [
  '新能源汽车市场分析报告发布',
  '消费者权益保护新规解读',
  '小红书美妆产品测评合集',
  '科技数码行业年度盘点',
  '食品安全监管政策更新',
  '教育改革方案深度解读',
  '房地产调控政策最新动态',
  '医疗健康产业发展趋势',
  '金融风险防控措施分析',
  '电商行业双十一数据报告',
  '文旅产业复苏情况调研',
  '环保话题社会关注度分析',
  '体育赛事舆情热度追踪',
  '娱乐热点事件传播路径',
  '政务公开信息透明度评估',
  '军工国防领域动态监测',
  '乡村振兴战略实施进展',
  '互联网科技企业竞争格局',
  '游戏行业版号审批情况',
  '母婴产品安全质量通报',
  '美妆护肤成分安全科普',
  '服装时尚潮流趋势预测',
  '食品饮料行业新品评测',
  '物流快递服务质量调查',
  '航空出行旅客满意度报告',
  '酒店旅游行业复苏分析',
  '教育培训行业监管动态',
  '新能源汽车充电设施建设',
  '半导体芯片产业链分析',
  '人工智能技术应用案例',
  '元宇宙概念股市场表现',
  '区块链技术应用前景',
  '数字货币政策解读分析',
  '社交平台内容治理报告',
  '短视频行业用户行为分析',
  '直播电商带货数据报告',
  '品牌声誉管理案例研究',
  '企业危机公关应对策略',
  '政策法规影响评估报告',
  '国际关系舆情热点追踪',
  '突发事件网络传播分析',
  '公共卫生政策效果评估',
  '双碳目标实施进展报告',
  '数字经济产业发展白皮书',
  '智慧城市建设案例集',
  '5G通信技术应用场景',
  '物联网安全问题研究',
  '云计算市场竞争格局分析',
  '大数据隐私保护讨论',
  '网络安全漏洞通报分析',
  '知识产权保护案例汇总',
  '反垄断执法动态追踪',
  '职场文化话题讨论热度',
  '青年就业形势调研报告',
  '养老产业发展现状分析',
  '生育政策社会反响追踪',
  '股市行情波动因素分析',
  '基金投资收益情况统计',
  '保险行业理赔数据报告',
  '银行业务创新动态追踪',
  '消费维权典型案例汇总',
  '产品质量抽检结果通报',
  '药品监管政策更新解读',
  '医疗器械行业动态监测',
  '健康管理服务市场分析',
  '心理健康话题讨论热度',
  '体育赛事观众满意度调查',
  '电影票房市场表现分析',
  '综艺节目收视率统计',
  '网红达人商业价值评估',
  '品牌营销效果数据分析',
  '广告投放效果监测报告',
  '用户增长策略案例研究',
  '产品体验评价汇总分析',
  '售后服务满意度调查',
  '物流配送时效性统计',
  '价格波动监测周报',
  '竞品分析月度报告',
  '行业研究报告精选',
  '学术论文影响力分析',
  '专利技术申请趋势',
  '标准规范更新通知',
  '人才招聘市场动态',
  '企业文化传播效果评估',
  'ESG可持续发展报告',
  '碳中和目标实施路径',
  '新能源车销量数据分析',
  '充电桩建设进度追踪',
  '光伏产业发展报告',
  '储能技术突破动态',
  '氢能源产业投资分析',
  '风电行业装机容量统计',
  '核电安全监管动态',
  '电力市场改革进展',
  '油气管网建设规划',
  '煤炭行业去产能进展',
  '钢铁行业产能利用率',
  '化工行业环保达标情况',
  '建材市场价格走势',
  '工程机械销售数据',
  '船舶制造订单统计',
  '航空航天技术突破',
  '轨道交通运营数据',
  '智能制造试点成果',
  '工业互联网平台评测',
];

const COMMENT_SNIPPETS = [
  '这个话题确实值得关注，最近讨论热度很高。',
  '数据采集很及时，信息覆盖面广。',
  '希望能增加更多维度的分析数据。',
  '从数据来看，这个话题的讨论量在持续上升。',
  '这个功能很实用，可以帮助我们快速了解舆论动态。',
  '内容质量不错，但部分数据需要进一步核实。',
  '建议增加情感分析功能，方便判断舆论倾向。',
  '采集频率可以再提高一些，实时性有待加强。',
  '整体来看数据趋势符合预期，继续保持。',
  '这个角度的分析很有新意，值得深入研究。',
];

// ============ 生成105条数据 ============

function generateFlowData(): FlowRecord[] {
  const data: FlowRecord[] = [];
  const baseDate = dayjs('2026-04-16');

  for (let i = 0; i < 105; i++) {
    const isComment = i < 55;
    const collectType = isComment ? '评论区采集' : '互动量刷新';
    const platform = PLATFORMS[i % PLATFORMS.length];
    const taskName = CORE_TASKS[i % 3];
    const scopeType = ['topic', 'source', 'other'][i % 3];

    // 额度规则
    let cost: number;
    if (platform === '小红书') {
      cost = 2;
    } else {
      cost = 1;
    }

    // 时间：最近30天随机
    const dayOffset = Math.floor(Math.random() * 30);
    const hourOffset = Math.floor(Math.random() * 24);
    const minuteOffset = Math.floor(Math.random() * 60);
    const secondOffset = Math.floor(Math.random() * 60);
    const collectTime = baseDate
      .subtract(dayOffset, 'day')
      .subtract(hourOffset, 'hour')
      .subtract(minuteOffset, 'minute')
      .subtract(secondOffset, 'second')
      .format('YYYY-MM-DD HH:mm:ss');

    const platformPrefix: Record<string, string> = {
      '小红书': 'XHS', '抖音': 'DY', '微博': 'WB',
      '今日头条': 'TT', '快手': 'KS', 'B站': 'BLI',
    };

    const record: FlowRecord = {
      id: 'flow_' + String(i + 1).padStart(3, '0'),
      collect_time: collectTime,
      task_name: taskName,
      scope_type: scopeType,
      platform: platform,
      collect_type: collectType,
      post_id: (platformPrefix[platform] || 'P') + '_' + String(i + 1).padStart(4, '0'),
      post_title: POST_TITLES[i % POST_TITLES.length],
      cost: cost,
    };

    // 快照数据
    if (!isComment) {
      record.snapshot_likes = Math.floor(Math.random() * 5000) + 100;
      record.snapshot_collects = Math.floor(Math.random() * 500) + 10;
      record.snapshot_shares = Math.floor(Math.random() * 200) + 5;
      record.snapshot_comments = Math.floor(Math.random() * 300) + 8;
    } else {
      const count = 3 + Math.floor(Math.random() * 3);
      record.snapshot_comments_list = [];
      for (let j = 0; j < count; j++) {
        record.snapshot_comments_list.push(COMMENT_SNIPPETS[(i + j) % COMMENT_SNIPPETS.length]);
      }
    }

    data.push(record);
  }

  // 按采集时间倒序排列（最新在前）
  data.sort(function (a, b) { return b.collect_time.localeCompare(a.collect_time); });

  return data;
}

const FLOW_DATA = generateFlowData();

// ============ 详情抽屉 ============

const FlowDetailDrawer: React.FC<{
  visible: boolean;
  record: FlowRecord | null;
  onClose: () => void;
}> = function ({ visible, record, onClose }) {
  if (!record) return null;

  const isInteraction = record.collect_type === '互动量刷新';
  const scopeInfo = SCOPE_MAP[record.scope_type] || SCOPE_MAP.other;

  const handleCopyId = useCallback(function () {
    navigator.clipboard?.writeText(record.post_id).then(function () {
      message.success('帖子ID已复制');
    }).catch(function () {
      message.info('复制失败，请手动复制: ' + record.post_id);
    });
  }, [record.post_id]);

  return (
    <Drawer
      title={null}
      placement="right"
      width={420}
      onClose={onClose}
      open={visible}
      className="qf-detail-drawer"
      styles={{ body: { padding: 0 } }}
      closeIcon={null}
    >
      {/* 头部消耗额度 */}
      <div className="qf-drawer-header">
        <div className="qf-drawer-cost-label">消耗额度</div>
        <div className="qf-drawer-cost-value">{record.cost}</div>
      </div>

      <div className="qf-drawer-body">
        {/* 基本信息 */}
        <div className="qf-drawer-section">
          <div className="qf-drawer-section-title">基本信息</div>
          <div className="qf-drawer-info">
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">采集时间</span>
              <span className="qf-drawer-value">{record.collect_time}</span>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">所属任务</span>
              <span className="qf-drawer-value">{record.task_name}</span>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">采集范围</span>
              <Tag color={scopeInfo.color}>{scopeInfo.label}</Tag>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">采集来源</span>
              <Tag color={PLATFORM_TAG_COLORS[record.platform] || 'default'}>{record.platform}</Tag>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">采集类型</span>
              <Tag color={isInteraction ? 'blue' : 'purple'}>{record.collect_type}</Tag>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">帖子ID</span>
              <span className="qf-drawer-value qf-drawer-post-id">
                <span>{record.post_id}</span>
                <CopyOutlined className="qf-copy-icon" onClick={handleCopyId} />
              </span>
            </div>
            <div className="qf-drawer-row">
              <span className="qf-drawer-label">帖子标题</span>
              <span className="qf-drawer-value qf-drawer-title">{record.post_title}</span>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* 数据快照 */}
        <div className="qf-drawer-section">
          <div className="qf-drawer-section-title">数据快照</div>
          {isInteraction ? (
            <div className="qf-snapshot-metrics">
              {[
                { label: '点赞数', value: record.snapshot_likes, icon: '👍', color: '#ff4d4f', bg: '#fff1f0' },
                { label: '收藏数', value: record.snapshot_collects, icon: '⭐', color: '#faad14', bg: '#fffbe6' },
                { label: '转发数', value: record.snapshot_shares, icon: '🔄', color: '#3b82f6', bg: '#e6f4ff' },
                { label: '评论数', value: record.snapshot_comments, icon: '💬', color: '#52c41a', bg: '#f6ffed' },
              ].map(function (m, idx) {
                return (
                  <div key={idx} className="qf-snapshot-card">
                    <div className="qf-snapshot-icon" style={{ backgroundColor: m.bg, color: m.color }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                    </div>
                    <div className="qf-snapshot-info">
                      <div className="qf-snapshot-label">{m.label}</div>
                      <div className="qf-snapshot-value">{(m.value || 0).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="qf-snapshot-comments">
              {(record.snapshot_comments_list || []).map(function (comment, idx) {
                return (
                  <div key={idx} className="qf-snapshot-comment">
                    <div className="qf-snapshot-comment-index">#{idx + 1}</div>
                    <div className="qf-snapshot-comment-text">{comment}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
  const [filterPlatform, setFilterPlatform] = useState<string[]>([]);
  const [filterTask, setFilterTask] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 详情抽屉
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FlowRecord | null>(null);

  // 重置
  const handleReset = useCallback(function () {
    setFilterPlatform([]);
    setFilterTask('');
    setFilterType('');
    setFilterDateRange(null);
  }, []);

  // 筛选数据
  const filteredData = useMemo(function () {
    let result = [...FLOW_DATA];
    if (filterPlatform.length > 0) {
      result = result.filter(function (r) { return filterPlatform.includes(r.platform); });
    }
    if (filterTask) {
      result = result.filter(function (r) { return r.task_name === filterTask; });
    }
    if (filterType) {
      result = result.filter(function (r) { return r.collect_type === filterType; });
    }
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      var start = filterDateRange[0].format('YYYY-MM-DD');
      var end = filterDateRange[1].format('YYYY-MM-DD');
      result = result.filter(function (r) {
        var dateStr = r.collect_time.slice(0, 10);
        return dateStr >= start && dateStr <= end;
      });
    }
    return result;
  }, [filterPlatform, filterTask, filterType, filterDateRange]);

  // 查看详情
  var handleViewDetail = useCallback(function (record: FlowRecord) {
    setSelectedRecord(record);
    setDrawerVisible(true);
  }, []);

  // 表格列
  var columns = [
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
      title: '所属任务',
      dataIndex: 'task_name',
      key: 'task_name',
      width: 200,
      ellipsis: { showTitle: true },
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
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      render: function (val: string) {
        return <Tag color={PLATFORM_TAG_COLORS[val] || 'default'} className="qf-tag-fixed">{val}</Tag>;
      },
    },
    {
      title: '采集类型',
      dataIndex: 'collect_type',
      key: 'collect_type',
      width: 110,
      render: function (val: string) {
        return <Tag color={val === '互动量刷新' ? 'blue' : 'purple'}>{val}</Tag>;
      },
    },
    {
      title: '帖子ID',
      dataIndex: 'post_id',
      key: 'post_id',
      width: 120,
      render: function (val: string) {
        return (
          <span className="qf-post-id-cell">
            <span>{val}</span>
            <CopyOutlined
              className="qf-copy-icon"
              onClick={function (e) {
                e.stopPropagation();
                navigator.clipboard?.writeText(val);
                message.success('已复制');
              }}
            />
          </span>
        );
      },
    },
    {
      title: '帖子标题',
      dataIndex: 'post_title',
      key: 'post_title',
      width: 200,
      ellipsis: true,
      render: function (val: string) {
        return <Tooltip title={val}><span>{val}</span></Tooltip>;
      },
    },
    {
      title: '消耗额度',
      dataIndex: 'cost',
      key: 'cost',
      width: 90,
      render: function (val: number) {
        return <span className="qf-cost-value">{val}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: function (_: any, record: FlowRecord) {
        return <a className="qf-action-link" data-testid="view-detail" onClick={function () { handleViewDetail(record); }}>查看详情</a>;
      },
    },
  ];

  return (
    <div className="qf-page">
      {/* 页面标题 */}
      <div className="qf-page-title">额度明细</div>

      {/* 筛选区 */}
      <div className="qf-filter-card">
        <div className="qf-filter-row">
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
            <label className="qf-filter-label">所属任务</label>
            <Select
              allowClear
              placeholder="全部任务"
              style={{ width: 240 }}
              size="middle"
              showSearch
              value={filterTask || undefined}
              onChange={function (v) { setFilterTask(v || ''); }}
              options={CORE_TASKS.map(function (t) { return { value: t, label: t }; })}
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
                { value: '互动量刷新', label: '互动量刷新' },
              ]}
            />
          </div>
          <div className="qf-filter-item">
            <label className="qf-filter-label">时间范围</label>
            <DatePicker.RangePicker
              size="middle"
              style={{ width: 240 }}
              value={filterDateRange}
              onChange={function (dates) { setFilterDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null); }}
            />
          </div>
          <div className="qf-filter-actions">
            <Button type="primary" icon={<SearchOutlined />} size="middle">查询</Button>
            <Button icon={<RedoOutlined />} size="middle" onClick={handleReset}>重置</Button>
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
          scroll={{ x: 1270, y: 'calc(12 * 47px)' }}
          pagination={{
            pageSize: 12,
            showSizeChanger: false,
            showTotal: function (total) { return '共 ' + total + ' 条'; },
          }}
        />
      </div>

      {/* 详情抽屉 */}
      <FlowDetailDrawer
        visible={drawerVisible}
        record={selectedRecord}
        onClose={function () { setDrawerVisible(false); }}
      />
    </div>
  );
};

export default QuotaFlow;
