import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Card,
  Row,
  Col,
  Checkbox,
  Cascader,
  Table,
  Tag,
  Tabs,
  Badge,
  Modal,
  Drawer,
  Tooltip,
  Alert,
  Popover,
  Space,
  Pagination,
  Rate,
} from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  RobotOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  CompassOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
  HolderOutlined,
  BankOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  ForwardOutlined,
  StarOutlined,
  InfoCircleOutlined,
  SendOutlined,
  AuditOutlined,
  FileTextOutlined,
  EditOutlined,
  RollbackOutlined,
  EyeOutlined,
  CopyOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ExportOutlined,
  FormOutlined,
  BellOutlined,
  CloseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// ==================== 省厅全省字典数据 ====================
const provincialAreaTree = [
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市',
        children: [
          { value: '玄武区', label: '玄武区' },
          { value: '秦淮区', label: '秦淮区' },
          { value: '建邺区', label: '建邺区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '江宁区', label: '江宁区' },
        ],
      },
      {
        value: '常州市',
        label: '常州市',
        children: [
          { value: '武进区', label: '武进区 (本大队辖区)' },
          { value: '天宁区', label: '天宁区' },
          { value: '钟楼区', label: '钟楼区' },
          { value: '新北区', label: '新北区' },
          { value: '金坛区', label: '金坛区' },
          { value: '溧阳市', label: '溧阳市' },
        ],
      },
      {
        value: '徐州市',
        label: '徐州市',
        children: [
          { value: '贾汪区', label: '贾汪区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '云龙区', label: '云龙区' },
          { value: '泉山区', label: '泉山区' },
        ],
      },
      {
        value: '苏州市',
        label: '苏州市',
        children: [
          { value: '姑苏区', label: '姑苏区' },
          { value: '虎丘区', label: '虎丘区' },
          { value: '吴中区', label: '吴中区' },
          { value: '相城区', label: '相城区' },
        ],
      },
      {
        value: '无锡市',
        label: '无锡市',
        children: [
          { value: '梁溪区', label: '梁溪区' },
          { value: '锡山区', label: '锡山区' },
          { value: '惠山区', label: '惠山区' },
          { value: '滨湖区', label: '滨湖区' },
        ],
      },
    ],
  },
];

export type ViewRole = 'county' | 'city' | 'provincial' | 'rejectedEcho';
export type AuditStatus = 'pending' | 'approved' | 'rejected';

export const ScenarioCityAudit: React.FC = () => {
  const [form] = Form.useForm();

  // 当前激活视图：'county' (区县提交) | 'city' (市局审核) | 'provincial' (省厅接收 - 通过分支) | 'rejectedEcho' (区县查验 - 驳回分支)
  const [currentView, setCurrentView] = useState<ViewRole>('county');

  // 区县端子视图：'form' (手工上报表单) | 'list' (我的上报列表)
  const [countySubTab, setCountySubTab] = useState<'form' | 'list'>('form');

  // 悬浮导引控制台折叠与位置（自由拖拽，收纳时平滑回到右上角）
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);
  const [consolePos, setConsolePos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      return { x: Math.max(20, window.innerWidth - 350), y: 84 };
    }
    return { x: 960, y: 84 };
  });
  const [hasCustomPos, setHasCustomPos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = React.useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    hasMoved: false,
  });

  // 拖拽起始判定（仅在展开态支持拖拽调整）
  const handleStartDrag = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, .ant-btn, input, textarea, a, .no-drag')) {
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    const currentActualX = hasCustomPos
      ? consolePos.x
      : Math.max(20, window.innerWidth - 350);
    const currentActualY = hasCustomPos ? consolePos.y : 84;

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentActualX,
      initY: currentActualY,
      hasMoved: false,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragInfoRef.current.startX;
      const dy = moveEvent.clientY - dragInfoRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragInfoRef.current.hasMoved = true;
        setHasCustomPos(true);
      }
      const panelWidth = 326;
      const panelHeight = 440;
      const maxX = Math.max(10, window.innerWidth - panelWidth - 24);
      const maxY = Math.max(50, window.innerHeight - panelHeight - 20);

      const nextX = Math.max(10, Math.min(maxX, dragInfoRef.current.initX + dx));
      const nextY = Math.max(50, Math.min(maxY, dragInfoRef.current.initY + dy));
      setConsolePos({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 报送目标勾选状态：默认已勾选上报支队与上报总队
  const [reportTargets, setReportTargets] = useState<string[]>(['branch', 'provincial']);

  // 业务流转核心状态
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('2026-10-08 18:20:15');
  const [auditStatus, setAuditStatus] = useState<AuditStatus>('pending');
  const [auditTimestamp, setAuditTimestamp] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>(
    '该舆情属于常规诉求，未达到省厅上报标准，建议本地留存关注'
  );

  // 审核抽屉/弹窗状态
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);
  const [auditOpinionInput, setAuditOpinionInput] = useState<string>('符合上报标准，同意转报省厅');
  const [isRejectingState, setIsRejectingState] = useState(false);

  // 原生卡片信息流专属交互状态
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectDrawerVisible, setRejectDrawerVisible] = useState(false);
  const [rejectReasonViewOpen, setRejectReasonViewOpen] = useState(false);
  const [currentStreamView, setCurrentStreamView] = useState<'detail' | 'analysis' | 'brief'>('analysis');
  const [activeTabKey, setActiveTabKey] = useState<string>('audit-report');
  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const [cardSelected, setCardSelected] = useState(false);

  // 省厅端数据状态
  const [provincialAdopted, setProvincialAdopted] = useState(false);
  const [provincialDetailDrawerOpen, setProvincialDetailDrawerOpen] = useState(false);

  // 预置舆情演示数据
  const demoReportData = {
    key: 'RPT-20261008-002',
    title: '《某区重点企事业单位涉稳舆情线索排查》',
    sourceUnit: '常州市公安局武进分局网安大队',
    officer: '王建明 (警号: 041928)',
    area: '江苏省 / 常州市 / 武进区',
    targetLabels: ['上报支队', '上报总队'],
    level: '3级 (较大)',
    channel: '微信公众号 / 论坛网帖',
    url: 'https://mp.weixin.qq.com/s/sample-wujin-0928',
    initialOpinion:
      '经辖区网安巡查排查，某重点制造企业因绩效与工时争议出现聚集发帖苗头，相关讨论在本地贴吧与微信群有扩散趋势，建议提请市局关注。',
    suggestAction: '已通报属地高新派出所跟进就地化解排查，提请市局支队把关研判。',
  };

  // 区县端表单提交处理
  const handleCountySubmit = () => {
    message.loading({ content: '正在进行审核网关策略校验...', key: 'submitting' });
    setTimeout(() => {
      setIsSubmitted(true);
      setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      setNotifyModalVisible(true);
      message.success({
        content: '上报成功，当前已开启市局审核机制，请等待市局支队审核放行',
        key: 'submitting',
        duration: 4,
      });
      setCountySubTab('list');
    }, 600);
  };

  // 市局端审核通过
  const handleAuditApprove = () => {
    setAuditStatus('approved');
    setAuditTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setAuditDrawerOpen(false);
    setNotifyModalVisible(false);
    message.success('审核通过，已触发跨网同步推向省厅');
  };

  // 市局端审核驳回
  const handleAuditReject = () => {
    if (!rejectReason.trim()) {
      message.warning('请输入驳回原因');
      return;
    }
    setAuditStatus('rejected');
    setAuditTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setAuditDrawerOpen(false);
    setNotifyModalVisible(false);
    message.error('已驳回该上报，数据终止推送并就地留存闭环');
  };

  // 快捷重置演示
  const handleResetDemo = () => {
    setIsSubmitted(false);
    setAuditStatus('pending');
    setCountySubTab('form');
    setCurrentView('county');
    setProvincialAdopted(false);
    setIsRejectingState(false);
    setApproveModalVisible(false);
    setRejectDrawerVisible(false);
    setRejectReasonViewOpen(false);
    setNotifyModalVisible(false);
    setActiveTabKey('audit-report');
    setCardSelected(false);
    message.info('演示数据已重置为初始未提交状态');
  };

  // ==================== 1. 视图 A：区县端填报与列表视图 ====================
  const renderCountyView = () => {
    return (
      <div className="view-content-wrapper">
        {/* 环境与路由状态条 */}
        <div className="scenario-env-header env-internet">
          <div className="scenario-env-info">
            <span className="env-tag-badge">
              <GlobalOutlined /> 互联网端
            </span>
            <div>
              <div className="scenario-env-title">
                【填报端】互联网环境 · 区县网安大队（常州市公安局武进分局）
              </div>
              <div className="scenario-env-subtitle">
                路由：<code>/county/monitor/manual-report-audit</code> ｜ 当前操作民警：王建明
              </div>
            </div>
          </div>
          <div>
            <Tooltip title="当前租户【常州市公安局】已开启直报审核策略，直报省厅事件需人工审核放行">
              <Tag color="gold" style={{ fontWeight: 600, padding: '2px 8px', cursor: 'pointer' }}>
                市局直报审核策略：已生效 (策略ID: SEC-2026-09)
              </Tag>
            </Tooltip>
          </div>
        </div>

        {/* 审核网关提示横幅 */}
        <Alert
          message="市局直报审核机制提示"
          description="当前租户【常州市公安局】已开启区县直报审核策略（本单位无免审放行白名单），勾选【上报总队】的舆情在提交后将受控暂扣在市局待审池，需经市局网安支队人工审核通过后，才生成跨网摆渡任务推送省厅。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 顶部标签页：手工上报 / 我的上报列表 */}
        <Card bodyStyle={{ padding: '0 20px 20px' }}>
          <Tabs
            activeKey={countySubTab}
            onChange={(key) => setCountySubTab(key as 'form' | 'list')}
            items={[
              {
                key: 'form',
                label: (
                  <span>
                    <EditOutlined /> 手工上报录入
                  </span>
                ),
              },
              {
                key: 'list',
                label: (
                  <span>
                    <FileTextOutlined /> 我的上报列表
                    <Tooltip title={isSubmitted ? `当前已有 1 条已提交上报记录 (状态: ${auditStatus === 'pending' ? '待审核' : auditStatus === 'approved' ? '已通过' : '已驳回'})` : '当前暂无上报记录'}>
                      <Badge
                        count={isSubmitted ? 1 : 0}
                        showZero
                        style={{
                          marginLeft: 6,
                          backgroundColor: !isSubmitted
                            ? '#d9d9d9'
                            : auditStatus === 'pending'
                            ? '#faad14'
                            : auditStatus === 'approved'
                            ? '#52c41a'
                            : '#ff4d4f',
                        }}
                      />
                    </Tooltip>
                  </span>
                ),
              },
            ]}
          />

          {countySubTab === 'form' ? (
            /* 手工上报表单主体 */
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                title: demoReportData.title,
                report_targets: ['branch', 'provincial'],
                area: ['江苏省', '常州市', '武进区'],
                warning_level: '3',
                source: '微信公众号 / 论坛网帖',
                url: demoReportData.url,
                happen_time: dayjs(),
                initial_opinion: demoReportData.initialOpinion,
                disposal_suggestion: demoReportData.suggestAction,
              }}
            >
              <Row gutter={24}>
                {/* 报送目标（增量改造高亮） */}
                <Col span={24}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600 }}>
                        报送目标
                        <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>
                        <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>
                          （系统已开启市局审核，上报总队将触发市局前置拦截）
                        </span>
                      </span>
                    }
                    required
                  >
                    <div className="incremental-container">
                      <div className="incremental-highlight" style={{ padding: '4px 10px' }}>
                        <Checkbox.Group
                          value={reportTargets}
                          onChange={(vals) => setReportTargets(vals as string[])}
                        >
                          <Checkbox value="branch" disabled>
                            上报支队（锁定直达本地市局）
                          </Checkbox>
                          <Checkbox value="provincial">
                            上报总队（直报省厅 · 需市局审核放行）
                          </Checkbox>
                        </Checkbox.Group>
                      </div>
                      <div className="incremental-badge">【改】</div>
                    </div>
                  </Form.Item>
                </Col>

                {/* 舆情标题 */}
                <Col span={16}>
                  <Form.Item
                    label={<span style={{ fontWeight: 600 }}>舆情标题</span>}
                    name="title"
                    rules={[{ required: true, message: '请输入舆情标题' }]}
                  >
                    <Input placeholder="请输入舆情标题" />
                  </Form.Item>
                </Col>

                {/* 涉事属地（全省标准字典） */}
                <Col span={8}>
                  <Form.Item
                    label={
                      <span style={{ fontWeight: 600 }}>
                        涉事属地
                        <span style={{ fontSize: 12, color: '#1677ff', marginLeft: 6 }}>
                          （已载入省厅全省统一标准字典）
                        </span>
                      </span>
                    }
                    name="area"
                    rules={[{ required: true, message: '请选择涉事属地' }]}
                  >
                    <div className="incremental-container" style={{ width: '100%' }}>
                      <Cascader
                        options={provincialAreaTree}
                        placeholder="请选择涉事属地"
                        style={{ width: '100%' }}
                        expandTrigger="hover"
                      />
                      <div className="incremental-badge">【改】</div>
                    </div>
                  </Form.Item>
                </Col>

                {/* 预警等级 */}
                <Col span={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>预警等级</span>} name="warning_level">
                    <Select>
                      <Option value="1">1级 (特别重大)</Option>
                      <Option value="2">2级 (重大)</Option>
                      <Option value="3">3级 (较大)</Option>
                      <Option value="4">4级 (一般)</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* 信息来源 */}
                <Col span={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>信息来源</span>} name="source">
                    <Select>
                      <Option value="微信公众号 / 论坛网帖">微信公众号 / 论坛网帖</Option>
                      <Option value="微博热点">微博热点</Option>
                      <Option value="抖音快手短视频">抖音快手短视频</Option>
                      <Option value="境外社媒平台">境外社媒平台</Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* 发现时间 */}
                <Col span={8}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>发现时间</span>} name="happen_time">
                    <DatePicker showTime style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                {/* 原文链接 */}
                <Col span={24}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>首发/原文链接</span>} name="url">
                    <Input placeholder="请输入原文线索 URL" />
                  </Form.Item>
                </Col>

                {/* 初研意见 */}
                <Col span={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>大队初研意见</span>} name="initial_opinion">
                    <TextArea rows={3} placeholder="请输入初研分析结论" />
                  </Form.Item>
                </Col>

                {/* 处置建议 */}
                <Col span={12}>
                  <Form.Item label={<span style={{ fontWeight: 600 }}>就地处置措施与建议</span>} name="disposal_suggestion">
                    <TextArea rows={3} placeholder="请输入处置建议措施" />
                  </Form.Item>
                </Col>
              </Row>

              {/* 表单底部操作栏 */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ color: '#8c8c8c', fontSize: 13 }}>
                  填报单位：常州市公安局武进分局网安大队 ｜ 填报民警：王建明
                </div>
                <Space>
                  <Button onClick={() => form.resetFields()}>重置表单</Button>

                  {/* 核心上报按钮（挂载 AxHub 图钉批注 1） */}
                  <Annotated
                    pin={1}
                    title="审核网关校验与前置拦截"
                    note="审核网关校验：系统在落库前校验当前租户审核策略配置，若开启市局审核，阻断向跨网前置机投递事件，写入市局待审库。"
                    tag="审核网关校验"
                    placement="top-right"
                  >
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleCountySubmit}
                      style={{ minWidth: 160 }}
                    >
                      确认上报（受控拦截提请市局审核）
                    </Button>
                  </Annotated>
                </Space>
              </div>
            </Form>
          ) : (
            /* 我的上报列表 (提交后状态回显) */
            <div>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#595959' }}>
                  共找到 <strong>{isSubmitted ? 1 : 0}</strong> 条上报记录
                </span>
                <Button size="small" icon={<SyncOutlined />} onClick={() => message.info('列表数据已刷新')}>
                  刷新列表
                </Button>
              </div>

              <Table
                dataSource={
                  isSubmitted
                    ? [
                        {
                          key: demoReportData.key,
                          title: demoReportData.title,
                          targets: demoReportData.targetLabels,
                          submitTime: submitTimestamp,
                          area: demoReportData.area,
                          status: auditStatus,
                        },
                      ]
                    : []
                }
                pagination={false}
                locale={{ emptyText: '暂无上报记录，请先在表单中完成录入并点击【确认上报】' }}
                columns={[
                  {
                    title: '业务编号',
                    dataIndex: 'key',
                    width: 170,
                    render: (text) => <span style={{ fontFamily: 'monospace' }}>{text}</span>,
                  },
                  {
                    title: '舆情标题',
                    dataIndex: 'title',
                    render: (text) => (
                      <div>
                        <span style={{ fontWeight: 600, color: '#1677ff' }}>{text}</span>
                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                          常州市公安局武进分局网安大队 报送
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: '涉事属地',
                    dataIndex: 'area',
                    width: 170,
                  },
                  {
                    title: '报送目标',
                    dataIndex: 'targets',
                    width: 180,
                    render: (targets: string[]) => (
                      <Space size={4}>
                        <Tag color="blue">上报支队</Tag>
                        <Tag color="cyan">上报总队</Tag>
                      </Space>
                    ),
                  },
                  {
                    title: '上报时间',
                    dataIndex: 'submitTime',
                    width: 160,
                  },
                  {
                    title: '市局审核状态',
                    dataIndex: 'status',
                    width: 180,
                    render: (status: AuditStatus) => {
                      if (status === 'pending') {
                        return (
                          <Tag className="tag-audit-pending">
                            <ClockCircleOutlined /> 待市局审核
                          </Tag>
                        );
                      }
                      if (status === 'approved') {
                        return (
                          <Tag className="tag-audit-approved">
                            <CheckCircleOutlined /> 市局已审 / 已报省厅
                          </Tag>
                        );
                      }
                      return (
                        <Tag className="tag-audit-rejected">
                          <CloseCircleOutlined /> 市局驳回
                        </Tag>
                      );
                    },
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 120,
                    render: () => (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          Modal.info({
                            title: '上报详情与市局拦截状态',
                            width: 520,
                            content: (
                              <div style={{ marginTop: 12, lineHeight: '26px' }}>
                                <p><strong>舆情标题：</strong> {demoReportData.title}</p>
                                <p><strong>流转状态：</strong> {auditStatus === 'pending' ? '已落库市局待审池，待市局网安支队审核放行' : auditStatus === 'approved' ? '市局审核已通过，跨网摆渡已推向省厅' : '市局审核已驳回，就地闭环留存'}</p>
                                <p><strong>初研意见：</strong> {demoReportData.initialOpinion}</p>
                                <p><strong>处置措施：</strong> {demoReportData.suggestAction}</p>
                              </div>
                            ),
                          });
                        }}
                      >
                        查看详情
                      </Button>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </Card>
      </div>
    );
  };

  // ==================== 2. 视图 B：市局端审核工作台 ====================
  const renderCityView = () => {
    return (
      <div className="view-content-wrapper">
        {/* 3. 右上角待审通知浮窗 (Notification Modal / Glassmorphism) */}
        {notifyModalVisible && (
          <div
            className="audit-notification-popup"
            style={{
              right: consoleCollapsed ? 80 : 360,
            }}
          >
            {/* 头部标题行 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                  【直报省厅预审提醒】
                </span>
                <Tag color="red" style={{ margin: 0, fontSize: 10, padding: '0 4px', lineHeight: '16px' }}>
                  待审核
                </Tag>
              </div>
              <CloseOutlined
                style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}
                onClick={() => setNotifyModalVisible(false)}
              />
            </div>

            {/* 正文内容 */}
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, marginBottom: 10 }}>
              常州市贾汪网安大队上报了《关于某工业园区网络谣言线索协查》，请在 2 小时内完成审核放行。
            </div>

            {/* 底部按钮栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                时效：剩余 01小时58分
              </span>
              <Space size={8}>
                <Button
                  size="small"
                  onClick={() => setNotifyModalVisible(false)}
                  style={{ fontSize: 12 }}
                >
                  稍后处理
                </Button>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    background: '#1677ff',
                    borderColor: '#1677ff',
                    borderRadius: 12,
                    padding: '0 12px',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setNotifyModalVisible(false);
                    setActiveTabKey('audit-report');
                    setAuditDrawerOpen(true);
                    setIsRejectingState(false);
                    message.success('已切换至【上报审核】专属板块并打开审核判定单');
                  }}
                >
                  立即审核
                </Button>
              </Space>
            </div>
          </div>
        )}

        {/* 环境与路由状态条 */}
        <div className="scenario-env-header env-city-audit">
          <div className="scenario-env-info">
            <span className="env-tag-badge">
              <AuditOutlined /> 审核端
            </span>
            <div>
              <div className="scenario-env-title">
                【审核端】互联网环境 · 市局网安支队审核中心（常州市公安局）
              </div>
              <div className="scenario-env-subtitle">
                路由：<code>/city/monitor/report-audit</code> ｜ 审核民警：张警官 (支队综合科)
              </div>
            </div>
          </div>
          <div>
            <Tooltip title={auditStatus === 'pending' && isSubmitted ? '当前有 1 条区县直报省厅舆情待人工审核放行' : '当前待审池任务已全部处理完成'}>
              <Tag color="processing" style={{ fontWeight: 600, cursor: 'pointer' }}>
                待审核池：{auditStatus === 'pending' && isSubmitted ? '1 条待处理' : '0 条待处理'}
              </Tag>
            </Tooltip>
          </div>
        </div>

        {/* 顶部待办横幅微提示 */}
        <Alert
          message={
            auditStatus === 'pending' && isSubmitted
              ? '当前有 1 条区县直报省厅舆情待审核，请于 2 小时内完成审核放行或驳回'
              : auditStatus === 'approved'
              ? '该记录已完成审核并触发跨网同步推向省厅'
              : auditStatus === 'rejected'
              ? '该记录已驳回，数据终止推送并回写给区县填报端'
              : '当前暂无待审核数据，请先在区县填报端提交舆情'
          }
          type={
            auditStatus === 'pending' && isSubmitted
              ? 'warning'
              : auditStatus === 'approved'
              ? 'success'
              : auditStatus === 'rejected'
              ? 'error'
              : 'info'
          }
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 1. 顶部检索与视图切换栏 (1:1 复刻系统原生研判工作台) */}
        <div className="stream-filter-container">
          <div className="stream-filter-top-row">
            <div className="stream-filter-field">
              <span className="stream-filter-label">内容搜索</span>
              <Input
                placeholder="可输入标题/正文/作者/ID"
                style={{ width: 200 }}
                defaultValue="某工业园区重点工程"
                allowClear
              />
            </div>

            <div className="stream-filter-field">
              <span className="stream-filter-label">发布时间</span>
              <DatePicker.RangePicker style={{ width: 240 }} />
            </div>

            <div className="stream-filter-field">
              <span className="stream-filter-label">上报时间</span>
              <DatePicker.RangePicker
                showTime
                style={{ width: 330 }}
                defaultValue={[
                  dayjs('2026-10-08 00:00:00'),
                  dayjs('2026-10-09 23:59:59'),
                ]}
              />
            </div>

            {/* 右侧视图切换按钮组 */}
            <div className="stream-view-switcher">
              <button
                type="button"
                className={`stream-view-btn ${currentStreamView === 'detail' ? 'active' : ''}`}
                onClick={() => setCurrentStreamView('detail')}
              >
                详细视图
              </button>
              <button
                type="button"
                className={`stream-view-btn ${currentStreamView === 'analysis' ? 'active' : ''}`}
                onClick={() => setCurrentStreamView('analysis')}
              >
                研判视图
              </button>
              <button
                type="button"
                className={`stream-view-btn ${currentStreamView === 'brief' ? 'active' : ''}`}
                onClick={() => setCurrentStreamView('brief')}
              >
                简要视图
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Button size="small">重置</Button>
              <Button type="primary" size="small">查询</Button>
              <Button type="link" size="small" style={{ fontSize: 12, padding: 0 }}>
                展开 <DownOutlined style={{ fontSize: 10 }} />
              </Button>
            </Space>

            <Space>
              <Button size="small" onClick={handleResetDemo}>重置演示</Button>
              {!isSubmitted && (
                <Button
                  size="small"
                  type="dashed"
                  style={{ color: '#1677ff' }}
                  onClick={() => {
                    setIsSubmitted(true);
                    setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    message.success('已模拟载入区县民警待审舆情数据');
                  }}
                >
                  一键模拟载入待审数据
                </Button>
              )}
            </Space>
          </div>
        </div>

        {/* 2. 模块二级 Tab 栏 (1:1 原生导航) */}
        <div className="stream-tabs-bar">
          <div className="stream-tabs-list">
            <div
              className={`stream-tab-item ${activeTabKey === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('all')}
            >
              <span className="stream-ai-pill">AI</span> 全部
            </div>
            <div
              className={`stream-tab-item ${activeTabKey === 'suggestion' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('suggestion')}
            >
              研判建议
            </div>
            <div
              className={`stream-tab-item ${activeTabKey === 'alert' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('alert')}
            >
              <span className="stream-ai-pill">AI</span> 智能预警
            </div>
            <div
              className={`stream-tab-item ${activeTabKey === 'local' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('local')}
            >
              本地舆情
            </div>
            {/* 本地上报：普通本地正式情报列表 */}
            <div
              className={`stream-tab-item ${activeTabKey === 'local-report' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('local-report')}
            >
              本地上报
            </div>
            {/* 上报审核 (高亮增量专属板块，带呼吸角标) */}
            <div
              className={`stream-tab-item ${activeTabKey === 'audit-report' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('audit-report')}
              style={{
                fontWeight: activeTabKey === 'audit-report' ? 600 : 500,
                position: 'relative',
              }}
            >
              <AuditOutlined style={{ marginRight: 4, color: activeTabKey === 'audit-report' ? '#1677ff' : '#64748b' }} />
              上报审核
              {auditStatus === 'pending' && isSubmitted && (
                <span
                  className="audit-tab-badge-pulse"
                  style={{
                    background: '#ff4d4f',
                    color: '#ffffff',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '0 6px',
                    lineHeight: '16px',
                    marginLeft: 6,
                    height: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  1
                </span>
              )}
            </div>
            <div
              className={`stream-tab-item ${activeTabKey === 'notice' ? 'active' : ''}`}
              onClick={() => setActiveTabKey('notice')}
            >
              通报信息
            </div>
          </div>

          <Button
            type="primary"
            icon={<FormOutlined />}
            size="small"
            style={{ borderRadius: 4 }}
            onClick={() => message.info('此为手工上报快速通道')}
          >
            手工上报
          </Button>
        </div>

        {/* 3. 卡片流内容主体 (Card-Stream View) */}
        <div className="stream-cards-wrapper">
          {activeTabKey === 'audit-report' && (
            <>
              {/* 页面表头说明 (浅蓝底色说明栏) */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 6,
                  padding: '10px 16px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <InfoCircleOutlined style={{ color: '#1677ff', fontSize: 16, flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.5, flex: 1 }}>
                  <strong>【上报审核工作台】：</strong>
                  本区域承载区县单位拟上报省厅的预审舆情。审核通过后将跨网报送至省厅总队，驳回后留存本地闭环。
                </div>
                <Tag color="blue" style={{ margin: 0, fontWeight: 500 }}>
                  预审数据独立隔离
                </Tag>
              </div>

              {!isSubmitted ? (
                <Card style={{ textAlign: 'center', padding: '40px 0', borderRadius: 8 }}>
                  <div style={{ color: '#64748b', marginBottom: 12, fontSize: 14 }}>
                    当前【上报审核】待审池暂无数据，请先前往区县端提交舆情
                  </div>
                  <Space>
                    <Button type="primary" onClick={() => setCurrentView('county')}>
                      前往区县填报端 (视图 A)
                    </Button>
                    <Button
                      onClick={() => {
                        setIsSubmitted(true);
                        setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                        setNotifyModalVisible(true);
                        message.success('已模拟载入区县上报舆情数据，并触发待审通知');
                      }}
                    >
                      一键模拟载入待审数据
                    </Button>
                  </Space>
                </Card>
              ) : (
                <>
              {/* 单条 1:1 复刻系统原生的完整卡片 */}
              <div className="stream-card-box">
                {/* 1. 卡片头部行 (Header) */}
                <div className="stream-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Checkbox
                      checked={cardSelected}
                      onChange={(e) => setCardSelected(e.target.checked)}
                    />
                    <span style={{ fontWeight: 600, color: '#64748b', fontSize: 13, marginRight: 2 }}>
                      1
                    </span>

                    {/* 核心状态徽标（增量改造高亮） */}
                    {auditStatus === 'pending' && (
                      <Tag
                        style={{
                          background: '#fffbe6',
                          color: '#d46b08',
                          borderColor: '#ffe58f',
                          fontWeight: 600,
                          borderRadius: 2,
                          boxShadow: '0 0 0 1px rgba(250, 140, 22, 0.2)',
                        }}
                      >
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        待市局审核
                      </Tag>
                    )}
                    {auditStatus === 'approved' && (
                      <Tag
                        style={{
                          background: '#f6ffed',
                          color: '#389e0d',
                          borderColor: '#b7eb8f',
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        已通过 / 已报省厅
                      </Tag>
                    )}
                    {auditStatus === 'rejected' && (
                      <Tag
                        style={{
                          background: '#fff1f0',
                          color: '#cf1322',
                          borderColor: '#ffa39e',
                          fontWeight: 600,
                          borderRadius: 2,
                        }}
                      >
                        <CloseCircleOutlined style={{ marginRight: 4 }} />
                        市局驳回
                      </Tag>
                    )}

                    <Tag
                      style={{
                        background: '#1677ff',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 2,
                        padding: '0 6px',
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      初研意见
                    </Tag>
                    <span style={{ fontSize: 12, color: '#595959', margin: '0 4px', fontWeight: 500 }}>
                      处置
                    </span>
                    <Tag
                      style={{
                        background: '#ffffff',
                        color: '#1677ff',
                        borderColor: '#91caff',
                        borderRadius: 2,
                        fontSize: 11,
                      }}
                    >
                      非热敏
                    </Tag>
                  </div>

                  {/* 右侧星级评分 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#faad14', fontSize: 14 }}>
                      ★ ★ ★ ☆ ☆
                    </span>
                    <span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>
                      3.0星
                    </span>
                  </div>
                </div>

                {/* 2. 元数据信息行 (Meta Info) */}
                <div className="stream-card-meta">
                  <span style={{ color: '#1e293b', fontWeight: 600 }}>
                    常州武进分局·王建明
                  </span>
                  <span>ID 3766282728521547</span>
                  <span>
                    报送来源：常州市公安局武进分局网安大队
                  </span>
                  <span>
                    <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 4 }} />
                    江苏省 / 常州市 / 武进区
                  </span>
                  <span>
                    <VideoCameraOutlined style={{ marginRight: 4, color: '#0f172a' }} />
                    抖音短视频
                  </span>
                  <span>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {submitTimestamp || '2026-10-09 08:59:22'}
                  </span>
                </div>

                {/* 3. 舆情主标题与正文 (Content) */}
                <div className="stream-card-title-content">
                  #某工业园区重点工程涉污言论与非访聚集苗头排查。某短视频账号在外市发布涉及我市重点园区虚假信息，煽动跨市集聚维权，并扬言在省行政中心集聚上访，视频已有一定点赞和扩散，存在跨区域衍生发酵与涉稳风险。
                </div>

                {/* 4. AI 摘要与初研分析双色块 + 右侧大尺寸舆情指数 */}
                <div className="stream-card-split-body">
                  <div className="stream-card-analysis-side">
                    {/* 浅绿色/浅紫色背景框【AI 摘要】 */}
                    <div className="stream-card-ai-badge-box">
                      <span
                        style={{
                          background: '#52c41a',
                          color: '#ffffff',
                          fontSize: 11,
                          padding: '1px 7px',
                          borderRadius: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        AI 摘要
                      </span>
                      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                        监测发现网民通过短视频煽动重点工业园区停工排查言论，存在跨区域发酵风险。
                      </div>
                    </div>

                    {/* 浅橙色背景框【初研意见 / 研判】 */}
                    <div className="stream-card-opinion-badge-box">
                      <span
                        style={{
                          background: '#fa8c16',
                          color: '#ffffff',
                          fontSize: 11,
                          padding: '1px 7px',
                          borderRadius: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        初研研判
                      </span>
                      <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 600, color: '#c2410c' }}>【风险定性】：</span>
                        属于涉企涉稳重大线索；
                        <span style={{ fontWeight: 600, color: '#c2410c', marginLeft: 8 }}>【研判处置建议】：</span>
                        建议市局审核通过后直通上报省厅网安总队，并在内网抄送属地核查。
                      </div>
                    </div>
                  </div>

                  {/* 右侧大尺寸渐变卡片【舆情指数】 */}
                  <div className="stream-card-index-card">
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#7c3aed', lineHeight: 1.1 }}>
                      68.00
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', opacity: 0.85, marginTop: 4 }}>
                      舆情指数
                    </div>
                  </div>
                </div>

                {/* 5. 底部标签池 */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  <Tag color="blue" style={{ borderRadius: 3 }}>数据来源：区县手工上报</Tag>
                  <Tag color="purple" style={{ borderRadius: 3 }}>直报省厅</Tag>
                  <Tag color="cyan" style={{ borderRadius: 3 }}>常州市</Tag>
                  <Tag color="geekblue" style={{ borderRadius: 3 }}>武进区</Tag>
                  <Tag color="volcano" style={{ borderRadius: 3 }}>涉稳舆情</Tag>
                </div>

                {/* 6. 底部操作栏 (核心业务改造) */}
                <div className="stream-card-actions-bar">
                  {/* 次要操作：【查看上报全文】、【初研记录】 */}
                  <Space size={16}>
                    <Annotated
                      pin={4}
                      title="市局待审池人工审核入口"
                      note="展示下辖区县直报省厅的舆情待审列表，点击打开审核把关抽屉，提供完整的舆情研判信息与双分支决策操作。"
                      tag="待审池把关"
                      placement="top-left"
                    >
                      <Button
                        type="link"
                        size="small"
                        icon={<FileTextOutlined />}
                        style={{ color: '#595959', paddingLeft: 0 }}
                        onClick={() => {
                          setAuditDrawerOpen(true);
                          setIsRejectingState(false);
                        }}
                      >
                        查看上报全文
                      </Button>
                    </Annotated>

                    <Popover
                      title={
                        <span style={{ fontWeight: 600, color: '#1677ff' }}>
                          <HistoryOutlined style={{ marginRight: 6 }} /> 区县初研意见与研判记录
                        </span>
                      }
                      content={
                        <div style={{ width: 320, fontSize: 12, lineHeight: 1.6 }}>
                          <div style={{ marginBottom: 6 }}>
                            <strong>填报大队：</strong>常州市公安局武进分局网安大队
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <strong>填报民警：</strong>王建明 (警号: 041928)
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <strong>初研意见：</strong>
                            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 4, marginTop: 2, color: '#334155' }}>
                              {demoReportData.initialOpinion}
                            </div>
                          </div>
                          <div>
                            <strong>处置建议：</strong>
                            <div style={{ background: '#f8fafc', padding: '6px 8px', borderRadius: 4, marginTop: 2, color: '#334155' }}>
                              {demoReportData.suggestAction}
                            </div>
                          </div>
                        </div>
                      }
                      trigger="click"
                    >
                      <Button
                        type="link"
                        size="small"
                        icon={<HistoryOutlined />}
                        style={{ color: '#1677ff' }}
                      >
                        初研记录
                      </Button>
                    </Popover>
                  </Space>

                  {/* 核心审核操作组 (标准警务操作：审核驳回 + 审核通过) */}
                  <div>
                    {auditStatus === 'pending' ? (
                      <Space size={10}>
                        {/* 核心决策：审核驳回（深灰/浅红镂空边框按钮，挂载 Pin 3） */}
                        <Annotated
                          pin={3}
                          title="审核驳回与就地闭环终止点"
                          note="审核驳回不向省厅发出任何网络包，数据传输就地终止闭环，并将驳回原因回写至区县填报端供民警查验与重编。"
                          tag="闭环终止点"
                          placement="top-right"
                        >
                          <Button
                            style={{
                              color: '#cf1322',
                              borderColor: '#ffa39e',
                              background: '#fff1f0',
                              fontWeight: 500,
                            }}
                            icon={<CloseCircleOutlined />}
                            onClick={() => setRejectDrawerVisible(true)}
                          >
                            审核驳回
                          </Button>
                        </Annotated>

                        {/* 核心决策：审核通过（公安蓝 #1677FF 实底按钮，挂载 Pin 2） */}
                        <Annotated
                          pin={2}
                          title="市局审核放行与跨网任务触发点"
                          note="市局网安支队审核通过后，调用跨网摆渡任务生成接口，将数据推入单向网闸通道进入省厅内网，状态变更为【已通过 / 已报省厅】。"
                          tag="跨网触发点"
                          placement="top-right"
                        >
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 500 }}
                            onClick={() => setApproveModalVisible(true)}
                          >
                            审核通过
                          </Button>
                        </Annotated>
                      </Space>
                    ) : auditStatus === 'approved' ? (
                      <Space>
                        <Tag
                          color="success"
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            borderRadius: 4,
                            height: 'auto',
                          }}
                        >
                          <CheckCircleFilled style={{ marginRight: 6 }} />
                          已审核通过 (跨网摆渡推向省厅)
                        </Tag>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => setCurrentView('provincial')}
                        >
                          前往省厅查验 <ArrowRightOutlined />
                        </Button>
                      </Space>
                    ) : (
                      <Space>
                        <Tag
                          color="error"
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            borderRadius: 4,
                            height: 'auto',
                          }}
                        >
                          <CloseCircleFilled style={{ marginRight: 6 }} />
                          市局已驳回 (就地留存闭环)
                        </Tag>
                        <Button
                          size="small"
                          danger
                          onClick={() => setRejectReasonViewOpen(true)}
                        >
                          查看驳回原因
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => setCurrentView('rejectedEcho')}
                        >
                          前往区县查看回显 <ArrowRightOutlined />
                        </Button>
                      </Space>
                    )}
                  </div>
                </div>
              </div>

              {/* 底部操作与分页栏 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 12,
                }}
              >
                <Button icon={<ExportOutlined />} size="small">
                  导出数据
                </Button>
                <Pagination
                  size="small"
                  total={1}
                  current={1}
                  pageSize={10}
                  showTotal={(total) => `共 ${total} 条`}
                />
              </div>
            </>
          )}
        </>
      )}

      {activeTabKey === 'local-report' && (
        <div style={{ background: '#ffffff', borderRadius: 8, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>本地情报与常规上报列表</span>
              <span style={{ fontSize: 12, color: '#64748b', marginLeft: 12 }}>（展示市级本地管辖、无需直报省厅的正式情报）</span>
            </div>
            <Tag color="cyan">常州属地正式情报</Tag>
          </div>

          <Alert
            message="数据物理区隔说明"
            description="此处仅展示常州本地日常情报。所有区县申请【直报省厅】的受控预审舆情已物理分流至【上报审核】专属板块，防止未审数据混入正式情报库。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" type="primary" onClick={() => setActiveTabKey('audit-report')}>
                前往【上报审核】板块
              </Button>
            }
          />

          <Table
            pagination={false}
            dataSource={[
              {
                key: 'LOC-20261009-001',
                title: '某商场消防通道占用及网络投诉情况处置通报',
                unit: '常州市公安局钟楼分局',
                area: '江苏省 / 常州市 / 钟楼区',
                type: '常规民生诉求',
                status: '已就地办结',
                time: '2026-10-09 09:12:00',
              },
              {
                key: 'LOC-20261008-015',
                title: '某住宅小区物业矛盾及业主微信群舆情化解记录',
                unit: '常州市公安局新北分局',
                area: '江苏省 / 常州市 / 新北区',
                type: '矛盾化解',
                status: '已就地办结',
                time: '2026-10-08 16:45:10',
              },
            ]}
            columns={[
              { title: '情报编号', dataIndex: 'key', width: 160 },
              { title: '舆情标题', dataIndex: 'title', render: (t) => <span style={{ fontWeight: 500, color: '#1e293b' }}>{t}</span> },
              { title: '报送单位', dataIndex: 'unit', width: 180 },
              { title: '涉事属地', dataIndex: 'area', width: 170 },
              { title: '类型', dataIndex: 'type', width: 120, render: (t: string) => <Tag color="blue">{t}</Tag> },
              { title: '状态', dataIndex: 'status', width: 120, render: (t: string) => <Tag color="green">{t}</Tag> },
              { title: '入库时间', dataIndex: 'time', width: 160 },
            ]}
          />
        </div>
      )}

      {activeTabKey !== 'audit-report' && activeTabKey !== 'local-report' && (
        <div style={{ background: '#ffffff', borderRadius: 8, padding: 40, textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
            当前板块：【{
              activeTabKey === 'all' ? '全部' :
              activeTabKey === 'suggestion' ? '研判建议' :
              activeTabKey === 'alert' ? '智能预警' :
              activeTabKey === 'local' ? '本地舆情' :
              '通报信息'
            }】
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
            区县单位拟上报省厅的预审舆情已独立归整于【上报审核】专属板块。
          </div>
          <Button type="primary" onClick={() => setActiveTabKey('audit-report')}>
            前往【上报审核】工作台
          </Button>
        </div>
      )}
    </div>

        {/* ================= 业务弹窗群 ================= */}
        {/* 1. 审核通过确认标准化浮层 */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleFilled style={{ color: '#1677ff', fontSize: 18 }} />
              <span>确认放行并跨网报送至省厅总队？</span>
            </div>
          }
          open={approveModalVisible}
          onCancel={() => setApproveModalVisible(false)}
          onOk={() => {
            handleAuditApprove();
            setApproveModalVisible(false);
          }}
          okText="确认放行"
          cancelText="取消"
          okButtonProps={{ style: { background: '#1677ff', borderColor: '#1677ff' } }}
        >
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="跨网前置机任务调度确认"
              description="该舆情由常州市公安局武进分局网安大队民警王建明填报。审核通过后，系统将自动触发单向安全网闸前置机同步任务，将数据推送至省公安厅内网一体化平台【区县上报】待办池，并附加常州市公安局审核人电子签名。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              市局审核放行意见（选填）：
            </div>
            <TextArea
              rows={3}
              value={auditOpinionInput}
              onChange={(e) => setAuditOpinionInput(e.target.value)}
              placeholder="请输入市局审核放行批注意见"
            />
          </div>
        </Modal>

        {/* 2. 审核驳回录入轻量抽屉 */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CloseCircleFilled style={{ color: '#cf1322', fontSize: 18 }} />
              <span>录入审核驳回理由</span>
            </div>
          }
          width={460}
          open={rejectDrawerVisible}
          onClose={() => setRejectDrawerVisible(false)}
          extra={
            <Space>
              <Button onClick={() => setRejectDrawerVisible(false)}>取消</Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  handleAuditReject();
                  setRejectDrawerVisible(false);
                }}
              >
                确认驳回
              </Button>
            </Space>
          }
        >
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="就地闭环终止提醒"
              description="驳回后该舆情将终止跨网传输，不会向省厅发出任何网络数据，仅在常州本地留存闭环处理。驳回意见将即时回写至区县填报民警工作台。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <span style={{ color: '#cf1322' }}>*</span> 驳回理由说明（必填）：
            </div>
            <TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入退回区县的具体原因或处置指导意见"
              style={{ marginBottom: 12 }}
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
              快捷预设原因（点击直接填入）：
            </div>
            <Space wrap>
              {[
                '非重大涉警线索，建议本地关注',
                '线索要素不全，需补充核实证据',
                '非本辖区重点管辖范围，建议退回核对',
              ].map((text) => (
                <Tag
                  key={text}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setRejectReason(text)}
                >
                  {text}
                </Tag>
              ))}
            </Space>
          </div>
        </Drawer>

        {/* 3. 查看驳回原因弹窗 Modal */}
        <Modal
          title="市局网安支队审核驳回详情"
          open={rejectReasonViewOpen}
          onCancel={() => setRejectReasonViewOpen(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setRejectReasonViewOpen(false)}>
              已知晓
            </Button>,
          ]}
        >
          <div style={{ padding: '8px 0' }}>
            <Alert
              message="该上报已被市局支队驳回"
              description={`驳回时间：${auditTimestamp || '刚刚'} ｜ 审核人：张警官 (市局网安支队综合科)`}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <div style={{ background: '#f9fafb', padding: 14, borderRadius: 6, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>驳回批注意见：</div>
              <div style={{ fontSize: 14, color: '#1f2937', fontWeight: 500 }}>
                {rejectReason}
              </div>
            </div>
          </div>
        </Modal>

        {/* 市局审核核心抽屉 */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
              <span>
                <AuditOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                区县直报省厅舆情 · 市局网安支队审核单
              </span>
              <Tag color="orange">直报省厅前置拦截</Tag>
            </div>
          }
          width={680}
          open={auditDrawerOpen}
          onClose={() => setAuditDrawerOpen(false)}
        >
          {/* 舆情基本事实信息 */}
          <div className="audit-review-box">
            <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b', marginBottom: 12 }}>
              舆情基础信息摘要
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">舆情标题：</span>
              <span className="audit-review-value" style={{ fontWeight: 600 }}>{demoReportData.title}</span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">填报单位：</span>
              <span className="audit-review-value">{demoReportData.sourceUnit}（{demoReportData.officer}）</span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">报送目标：</span>
              <span className="audit-review-value">
                <Tag color="blue">市局支队</Tag>
                <Tag color="green">省厅总队 (受控拦截)</Tag>
              </span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">涉事属地：</span>
              <span className="audit-review-value">{demoReportData.area}</span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">风险等级：</span>
              <span className="audit-review-value">
                <Tag color="orange">{demoReportData.level}</Tag>
              </span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">原文链接：</span>
              <span className="audit-review-value">
                <a href={demoReportData.url} target="_blank" rel="noreferrer">
                  {demoReportData.url}
                </a>
              </span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">初研意见：</span>
              <span className="audit-review-value">{demoReportData.initialOpinion}</span>
            </div>
            <div className="audit-review-item">
              <span className="audit-review-label">处置建议：</span>
              <span className="audit-review-value">{demoReportData.suggestAction}</span>
            </div>
          </div>

          {/* 市局支队审核把关操作区 */}
          <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, padding: 16, background: '#fafafa' }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#1f2937' }}>
              市局网安支队审核决策
            </div>

            {auditStatus === 'pending' ? (
              <>
                <Form layout="vertical">
                  <Form.Item label="审核意见快捷模板">
                    <Select
                      defaultValue="pass"
                      onChange={(val) => {
                        if (val === 'pass') {
                          setIsRejectingState(false);
                          setAuditOpinionInput('经核对，该舆情涉及跨区域重点线索，符合上报标准，予以转报省厅。');
                        } else {
                          setIsRejectingState(true);
                          setRejectReason('该舆情属于常规诉求，未达到省厅上报标准，建议本地留存关注。');
                        }
                      }}
                    >
                      <Option value="pass">【通过】符合省厅直报标准，同意转报</Option>
                      <Option value="reject">【驳回】常规民生诉求，建议本地留存关注</Option>
                    </Select>
                  </Form.Item>

                  {!isRejectingState ? (
                    <Form.Item label="审核批注（通过将附带于跨网摆渡任务包中）">
                      <TextArea
                        rows={3}
                        value={auditOpinionInput}
                        onChange={(e) => setAuditOpinionInput(e.target.value)}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item label="驳回原因说明（必填，将回写至区县填报民警）" required>
                      <TextArea
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="请输入具体的驳回原因与后续处置指导意见"
                        style={{ borderColor: '#ff4d4f' }}
                      />
                    </Form.Item>
                  )}
                </Form>

                {/* 两个分支操作按钮（分别挂载 AxHub 图钉批注 2 与 3） */}
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  {/* 分支 1：审核通过按钮（挂载 AxHub 图钉批注 2） */}
                  <Annotated
                    pin={2}
                    title="市局审核放行与跨网任务触发点"
                    note="跨网触发点：市局审核通过后，调用跨网摆渡任务生成接口，将数据推入单向网闸通道进入省厅内网。"
                    tag="跨网触发点"
                    placement="top-right"
                  >
                    <Button
                      type="primary"
                      style={{ background: '#52c41a', borderColor: '#52c41a' }}
                      icon={<CheckCircleOutlined />}
                      onClick={handleAuditApprove}
                    >
                      审核通过并同步省厅
                    </Button>
                  </Annotated>

                  {/* 分支 2：驳回按钮（挂载 AxHub 图钉批注 3） */}
                  <Annotated
                    pin={3}
                    title="审核驳回与就地闭环终止点"
                    note="闭环终止点：审核驳回不向省厅发出任何网络包，状态保留在本地，并将驳回原因回写给填报人。"
                    tag="闭环终止点"
                    placement="top-right"
                  >
                    <Button
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        if (!isRejectingState) {
                          setIsRejectingState(true);
                          message.info('已切换为驳回模式，请确认驳回原因');
                        } else {
                          handleAuditReject();
                        }
                      }}
                    >
                      驳回该上报（就地闭环）
                    </Button>
                  </Annotated>
                </div>
              </>
            ) : (
              /* 已完成审核结果回显 */
              <div>
                <Alert
                  message={
                    auditStatus === 'approved'
                      ? '审核结论：审核通过（已触发跨网摆渡入省厅）'
                      : '审核结论：审核驳回（已就地闭环留存）'
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <p><strong>审核人：</strong> 张警官（常州市局网安支队审核科）</p>
                      <p><strong>审核时间：</strong> {auditTimestamp || '2026-10-08 18:22:30'}</p>
                      <p>
                        <strong>{auditStatus === 'approved' ? '审核意见：' : '驳回意见：'}</strong>{' '}
                        {auditStatus === 'approved' ? auditOpinionInput : rejectReason}
                      </p>
                    </div>
                  }
                  type={auditStatus === 'approved' ? 'success' : 'error'}
                  showIcon
                />
              </div>
            )}
          </div>
        </Drawer>
      </div>
    );
  };

  // ==================== 3. 视图 C1：审核通过 -> 省厅内网接收 ====================
  const renderProvincialView = () => {
    return (
      <div className="view-content-wrapper">
        {/* 环境与路由状态条 */}
        <div className="scenario-env-header env-intranet">
          <div className="scenario-env-info">
            <span className="env-tag-badge">
              <BankOutlined /> 公安内网环境
            </span>
            <div>
              <div className="scenario-env-title">
                【接收端】公安内网环境 · 省厅网安总队（江苏省公安厅指挥研判大厅）
              </div>
              <div className="scenario-env-subtitle">
                路由：<code>/provincial/monitor/county-reports-audit</code> ｜ 值班长：李警官
              </div>
            </div>
          </div>
          <div>
            <Tooltip title="公安内网与互联网单向安全网闸前置机通信正常，单向摆渡通道就绪">
              <Tag color="green" style={{ fontWeight: 600, cursor: 'pointer' }}>
                跨网摆渡通道：就绪 (带宽: 100Mbps)
              </Tag>
            </Tooltip>
          </div>
        </div>

        {/* 提示横幅 */}
        <Alert
          message={
            auditStatus === 'approved'
              ? '市局审核通过放行：省厅网安总队内网已实时接收该跨网直报数据'
              : '提示：市局端尚未执行审核通过放行，省厅内网暂无此直报数据'
          }
          type={auditStatus === 'approved' ? 'success' : 'warning'}
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 省厅区县上报管理面板 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <ThunderboltOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                监测预警 · 全省区县直报汇聚表
              </span>
              <Tooltip title="江苏省公安厅指挥研判大厅统筹视图">
                <Tag color="blue" style={{ cursor: 'pointer' }}>
                  当前视图：省厅网安总队统筹大屏 (已接收: {auditStatus === 'approved' ? 1 : 0} 条)
                </Tag>
              </Tooltip>
            </div>
          }
        >
          <Table
            dataSource={
              auditStatus === 'approved'
                ? [
                    {
                      key: demoReportData.key,
                      title: demoReportData.title,
                      sourceAuditText: '常州市公安局审核转报（原填报单位：武进分局网安大队）',
                      area: demoReportData.area,
                      level: demoReportData.level,
                      receiveTime: auditTimestamp || '刚刚',
                      tags: ['区县上报', '市局已审'],
                      adoption: provincialAdopted ? '已采纳' : '未采纳 / 待研判',
                    },
                  ]
                : []
            }
            pagination={false}
            locale={{ emptyText: '省厅内网库未检索到该记录（请先在市局审核端点击【审核通过并同步省厅】）' }}
            columns={[
              {
                title: '上报流水号',
                dataIndex: 'key',
                width: 170,
                render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>,
              },
              {
                title: '舆情标题',
                dataIndex: 'title',
                render: (val) => (
                  <div>
                    <span style={{ fontWeight: 600, color: '#1677ff' }}>{val}</span>
                    <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                      线索来源：微信公众号 / 论坛网帖 ｜ 首发地：常州市武进区
                    </div>
                  </div>
                ),
              },
              {
                title: '上报来源（经市局把关转报）',
                dataIndex: 'sourceAuditText',
                render: (text) => (
                  <div>
                    <Tag color="geekblue" style={{ fontWeight: 600 }}>
                      市局审核转报
                    </Tag>
                    <span style={{ fontSize: 13, color: '#1f2937' }}>{text}</span>
                  </div>
                ),
              },
              {
                title: '涉事属地',
                dataIndex: 'area',
                width: 170,
              },
              {
                title: '标签属性',
                dataIndex: 'tags',
                width: 180,
                render: (tags: string[]) => (
                  <Space size={4}>
                    <Tag color="cyan">区县上报</Tag>
                    <Tag color="green">市局已审</Tag>
                  </Space>
                ),
              },
              {
                title: '总队采纳考核',
                dataIndex: 'adoption',
                width: 150,
                render: (adoption: string) => {
                  return adoption === '已采纳' ? (
                    <Tag color="success" style={{ fontWeight: 600 }}>
                      <CheckCircleOutlined /> 已采纳 (计入考核)
                    </Tag>
                  ) : (
                    <Tag color="default">未采纳 / 待研判</Tag>
                  );
                },
              },
              {
                title: '操作',
                key: 'action',
                width: 180,
                render: () => (
                  <Space size={8}>
                    <Annotated
                      pin={5}
                      title="省厅端全链路审核数字背书"
                      note="省厅内网成功接收后，明确展示【市局审核转报】来源，并支持调阅市局审核人的电子签名、审核意见与单向网闸摆渡流水号。"
                      tag="全链路背书"
                      placement="top-right"
                    >
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setProvincialDetailDrawerOpen(true)}
                      >
                        查看审核轨迹
                      </Button>
                    </Annotated>
                    {!provincialAdopted && (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          setProvincialAdopted(true);
                          message.success('已下达总队处置指令，该直报舆情标记为【已采纳】！');
                        }}
                      >
                        下达指令
                      </Button>
                    )}
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* 省厅详情查验抽屉 */}
        <Drawer
          title="直报省厅舆情 · 全链路审核轨迹查验"
          width={560}
          open={provincialDetailDrawerOpen}
          onClose={() => setProvincialDetailDrawerOpen(false)}
        >
          <Alert
            message="跨网安全隔离与市局审核放行背书"
            description="该条记录通过市局网安支队前置把关放行，经单向安全网闸摆渡入库省厅中心库，具备完整的市局人工审核数字封签。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ lineHeight: '28px', fontSize: 13 }}>
            <p><strong>舆情标题：</strong> {demoReportData.title}</p>
            <p><strong>原填报单位：</strong> 常州市公安局武进分局网安大队（民警：王建明）</p>
            <p><strong>市局审核单位：</strong> 常州市公安局网安支队（审核员：张警官）</p>
            <p><strong>市局审核结论：</strong> <Tag color="green">准予直推总队</Tag></p>
            <p><strong>市局审核意见：</strong> {auditOpinionInput}</p>
            <p><strong>摆渡流水号：</strong> <span style={{ fontFamily: 'monospace' }}>GW-JS20261008-091</span></p>
            <p><strong>采纳状态：</strong> {provincialAdopted ? <Tag color="green">已采纳</Tag> : <Tag>待研判</Tag>}</p>
          </div>
        </Drawer>
      </div>
    );
  };

  // ==================== 4. 视图 C2：审核驳回 -> 区县端状态回显 ====================
  const renderRejectedEchoView = () => {
    return (
      <div className="view-content-wrapper">
        {/* 环境与路由状态条 */}
        <div className="scenario-env-header env-internet">
          <div className="scenario-env-info">
            <span className="env-tag-badge" style={{ background: '#ff4d4f' }}>
              <RollbackOutlined /> 驳回回显端
            </span>
            <div>
              <div className="scenario-env-title">
                【回显端】互联网环境 · 区县网安大队（常州市公安局武进分局）
              </div>
              <div className="scenario-env-subtitle">
                路由：<code>/county/monitor/report-list-rejected</code> ｜ 民警：王建明
              </div>
            </div>
          </div>
          <div>
            <Tooltip title="市局网安支队已驳回直报省厅申请，已转入本地留存关注">
              <Tag color="error" style={{ fontWeight: 600, cursor: 'pointer' }}>
                市局审核结论：已驳回 (就地留存: {auditStatus === 'rejected' ? 1 : 0} 条)
              </Tag>
            </Tooltip>
          </div>
        </div>

        {/* 提示横幅 */}
        <Alert
          message={
            auditStatus === 'rejected'
              ? '市局审核已驳回：该直报上报已终止向省厅推送，并已就地闭环留存'
              : '提示：当前市局尚未执行驳回动作，暂无驳回回显数据'
          }
          description="填报民警可根据市局支队下达的驳回意见进行补充材料后【重新编辑】提交，或就地转入本地重点关注舆情库。"
          type={auditStatus === 'rejected' ? 'error' : 'info'}
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 我的上报列表（驳回状态回显） */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <FileTextOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                我的上报列表（审核驳回状态）
              </span>
              <Tooltip title="被市局驳回且就地闭环留存的直报记录">
                <Tag color="red" style={{ cursor: 'pointer' }}>
                  {auditStatus === 'rejected' ? 1 : 0} 条直报被驳回
                </Tag>
              </Tooltip>
            </div>
          }
        >
          <Table
            dataSource={
              auditStatus === 'rejected'
                ? [
                    {
                      key: demoReportData.key,
                      title: demoReportData.title,
                      submitTime: submitTimestamp,
                      rejectTime: auditTimestamp || '2026-10-08 18:24:00',
                      rejectAuditor: '常州市局网安支队审核科 张警官',
                      rejectReason: rejectReason,
                    },
                  ]
                : []
            }
            pagination={false}
            locale={{ emptyText: '当前无驳回记录（请先在市局审核端执行【驳回该上报】操作）' }}
            columns={[
              {
                title: '上报编号',
                dataIndex: 'key',
                width: 170,
                render: (val) => <span style={{ fontFamily: 'monospace' }}>{val}</span>,
              },
              {
                title: '舆情标题',
                dataIndex: 'title',
                render: (val) => (
                  <div>
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{val}</span>
                    <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
                      报送目标：上报支队、上报总队
                    </div>
                  </div>
                ),
              },
              {
                title: '审核状态',
                width: 150,
                render: () => (
                  <Tag className="tag-audit-rejected">
                    <CloseCircleOutlined /> 市局驳回
                  </Tag>
                ),
              },
              {
                title: '驳回原因摘要',
                dataIndex: 'rejectReason',
                render: (reason) => (
                  <span style={{ color: '#cf1322', fontSize: 13 }}>
                    {reason}
                  </span>
                ),
              },
              {
                title: '驳回时间',
                dataIndex: 'rejectTime',
                width: 160,
              },
              {
                title: '操作',
                key: 'action',
                width: 200,
                render: (_, record) => (
                  <Space size={8}>
                    {/* 查看驳回原因气泡卡片（挂载 AxHub 图钉批注 6） */}
                    <Annotated
                      pin={6}
                      title="区县端驳回状态回写与指导闭环"
                      note="区县端状态更新为醒目的【市局驳回】，点击可查看市局支队下达的具体意见，并支持一键重新编辑载入草稿。"
                      tag="驳回闭环"
                      placement="top-right"
                    >
                      <Popover
                        title={<span style={{ color: '#ff4d4f', fontWeight: 600 }}>市局支队驳回意见详情</span>}
                        content={
                          <div style={{ width: 300, lineHeight: '22px', fontSize: 12 }}>
                            <p><strong>审核单位：</strong> 常州市公安局网安支队</p>
                            <p><strong>审核民警：</strong> {record.rejectAuditor}</p>
                            <p><strong>驳回时间：</strong> {record.rejectTime}</p>
                            <p><strong>意见说明：</strong> {record.rejectReason}</p>
                            <p style={{ color: '#1677ff', marginTop: 6 }}>
                              建议：请根据意见补充辖区实体涉稳线索后重新提报，或就地关注。
                            </p>
                          </div>
                        }
                        trigger="click"
                      >
                        <Button size="small" type="primary" danger ghost>
                          查看驳回原因
                        </Button>
                      </Popover>
                    </Annotated>

                    {/* 重新编辑按钮 */}
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => {
                        message.info('已重新载入表单草稿，可补充说明后重新提交');
                        setCurrentView('county');
                        setCountySubTab('form');
                      }}
                    >
                      重新编辑
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      </div>
    );
  };

  // ==================== 5. 悬浮演示控制台 (Glassmorphism 磨砂玻璃质感) ====================
  const renderFloatingGuideConsole = () => {
    // 胶囊进度条段数判断
    const isStep1Active = true;
    const isStep2Active = currentView === 'city' || currentView === 'provincial' || currentView === 'rejectedEcho';
    const isStep3Active = currentView === 'provincial' || currentView === 'rejectedEcho';

    return (
      <div
        className={`scenario-guide-console ${consoleCollapsed ? 'collapsed' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={
          hasCustomPos && !consoleCollapsed
            ? { left: consolePos.x, top: consolePos.y, right: 'auto' }
            : { right: 24, top: 84 }
        }
      >
        {consoleCollapsed ? (
          /* 折叠态：微缩毛玻璃悬浮球 */
          <Tooltip title="点击展开场景指引面板" placement="left">
            <div
              className="scenario-guide-ball-inner"
              onClick={() => {
                setConsoleCollapsed(false);
                setHasCustomPos(false);
              }}
            >
              <CompassOutlined style={{ fontSize: 20 }} />
              <span className="guide-ball-badge">
                {currentView === 'county'
                  ? '1/3'
                  : currentView === 'city'
                  ? '2/3'
                  : '3/3 ✓'}
              </span>
            </div>
          </Tooltip>
        ) : (
          /* 展开态：Glassmorphism 完整控制台 */
          <div className="guide-console-full-content">
            {/* 极简通透头部 */}
            <div className="guide-console-header" onMouseDown={handleStartDrag}>
              <div className="guide-header-title">
                <HolderOutlined style={{ opacity: 0.45, cursor: 'grab', marginRight: 2 }} />
                <span className="guide-badge-pill">场景 2</span>
                <span className="guide-header-title-text" title="市局审核拦截全流程">
                  市局审核拦截全流程
                </span>
              </div>
              <button
                className="guide-toggle-btn no-drag"
                onClick={(e) => {
                  e.stopPropagation();
                  setConsoleCollapsed(true);
                  setHasCustomPos(false);
                }}
                title="折叠为微缩悬浮球"
              >
                <UpOutlined />
              </button>
            </div>

            <div className="guide-console-body">
              {/* 横向三等分胶囊进度条 */}
              <div className="guide-progress-bar-container">
                <div className={`guide-progress-pill ${isStep1Active ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${isStep2Active ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${isStep3Active ? 'active' : ''}`} />
              </div>
              <div className="guide-step-labels">
                <span className={`guide-step-label-item ${currentView === 'county' ? 'active' : ''}`}>
                  1. 受控拦截
                </span>
                <span className={`guide-step-label-item ${currentView === 'city' ? 'active' : ''}`}>
                  2. 市局把关
                </span>
                <span
                  className={`guide-step-label-item ${
                    currentView === 'provincial' || currentView === 'rejectedEcho' ? 'active' : ''
                  }`}
                >
                  3. 结果分流
                </span>
              </div>

              {/* 步骤指引卡片（淡蓝底色, 线性图标, 精准引导） */}
              {currentView === 'county' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {!isSubmitted ? (
                      '当前租户已开启市局审核策略。请点击底部【确认上报】，系统将识别直报省厅并进行前置拦截，落库市局待审池。'
                    ) : (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        舆情已受控暂扣在常州市局待审池！状态显示为【待市局审核】。请点击下方按钮前往市局端进行人工审核把关。
                      </span>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'city' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {auditStatus === 'pending' ? (
                      '市局待审池已接收该上报。可点击【查看并审核】，或直接使用下方快捷模拟按钮体验【通过】与【驳回】两个分支。'
                    ) : auditStatus === 'approved' ? (
                      <span style={{ color: '#389e0d', fontWeight: 500 }}>
                        已审核通过！数据已触发跨网摆渡推向省厅。请前往省厅接收端查验落库效果。
                      </span>
                    ) : (
                      <span style={{ color: '#cf1322', fontWeight: 500 }}>
                        已驳回该上报！跨网传输终止，数据就地留存。请前往区县端查看驳回回显与处理意见。
                      </span>
                    )}
                  </div>
                </div>
              )}

              {currentView === 'provincial' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {auditStatus === 'approved' ? (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        省厅内网【区县上报】已成功接收，来源明确标记为【常州市局审核转报】与【市局已审】。审核通过全链路闭环达成！
                      </span>
                    ) : (
                      '提示：当前尚未在市局端审核通过，省厅暂无记录。可切回市局端审核放行。'
                    )}
                  </div>
                </div>
              )}

              {currentView === 'rejectedEcho' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {auditStatus === 'rejected' ? (
                      <span style={{ color: '#cf1322', fontWeight: 500 }}>
                        区县端列表中该条记录已更新为红色【市局驳回】，支持查看驳回原因气泡卡片与重新编辑。驳回分支全流程闭环达成！
                      </span>
                    ) : (
                      '提示：当前尚未在市局端执行驳回动作。可切回市局端执行驳回测试。'
                    )}
                  </div>
                </div>
              )}

              {/* 核心操作按钮 */}
              <div className="no-drag" style={{ marginTop: 6 }}>
                {currentView === 'county' && (
                  <>
                    {!isSubmitted && (
                      <button className="guide-btn-sub" onClick={handleCountySubmit}>
                        一键模拟区县点击【确认上报】
                      </button>
                    )}
                    <button
                      className="guide-btn-primary"
                      onClick={() => {
                        setCurrentView('city');
                        if (isSubmitted && auditStatus === 'pending') {
                          setNotifyModalVisible(true);
                        }
                      }}
                    >
                      前往市局审核端 (视图 B) <ArrowRightOutlined style={{ fontSize: 12 }} />
                    </button>
                  </>
                )}

                {currentView === 'city' && (
                  <>
                    {/* 测试操作按钮：模拟接收新上报通知 */}
                    <button
                      className="guide-btn-sub"
                      style={{
                        color: '#1677ff',
                        borderColor: '#91caff',
                        background: '#f0f7ff',
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                      onClick={() => {
                        setIsSubmitted(true);
                        setNotifyModalVisible(true);
                        message.info('已触发右上角实时待审通知浮窗');
                      }}
                    >
                      <BellOutlined style={{ fontSize: 12 }} /> 模拟接收新上报通知
                    </button>

                    {auditStatus === 'pending' ? (
                      <>
                        <button
                          className="guide-btn-sub"
                          style={{ color: '#389e0d', borderColor: '#b7eb8f' }}
                          onClick={() => {
                            handleAuditApprove();
                            setCurrentView('provincial');
                          }}
                        >
                          <CheckCircleOutlined style={{ fontSize: 12 }} /> 模拟审核通过 (推向省厅)
                        </button>
                        <button
                          className="guide-btn-sub"
                          style={{ color: '#cf1322', borderColor: '#ffa39e' }}
                          onClick={() => {
                            handleAuditReject();
                            setCurrentView('rejectedEcho');
                          }}
                        >
                          <CloseCircleOutlined style={{ fontSize: 12 }} /> 模拟审核驳回 (就地留存)
                        </button>
                        <button
                          className="guide-btn-primary"
                          onClick={() => setAuditDrawerOpen(true)}
                        >
                          打开审核抽屉人工把关 <ArrowRightOutlined style={{ fontSize: 12 }} />
                        </button>
                      </>
                    ) : auditStatus === 'approved' ? (
                      <button
                        className="guide-btn-primary"
                        onClick={() => setCurrentView('provincial')}
                      >
                        前往省厅接收端查验 (视图 C1) <ArrowRightOutlined style={{ fontSize: 12 }} />
                      </button>
                    ) : (
                      <button
                        className="guide-btn-primary"
                        onClick={() => setCurrentView('rejectedEcho')}
                      >
                        前往区县查看驳回回显 (视图 C2) <ArrowRightOutlined style={{ fontSize: 12 }} />
                      </button>
                    )}
                  </>
                )}

                {currentView === 'provincial' && (
                  <>
                    <button
                      className="guide-btn-sub"
                      onClick={() => setProvincialDetailDrawerOpen(true)}
                    >
                      查验市局审核全链路轨迹
                    </button>
                    <button
                      className="guide-btn-primary"
                      onClick={handleResetDemo}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        boxShadow: 'none',
                      }}
                    >
                      <ReloadOutlined style={{ fontSize: 12 }} /> 重置全流程演示
                    </button>
                  </>
                )}

                {currentView === 'rejectedEcho' && (
                  <>
                    <button
                      className="guide-btn-primary"
                      onClick={handleResetDemo}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        boxShadow: 'none',
                      }}
                    >
                      <ReloadOutlined style={{ fontSize: 12 }} /> 重置全流程演示
                    </button>
                  </>
                )}
              </div>

              {/* 视角分段控制器 (Segmented Control - 4视角切换) */}
              <div className="guide-segmented-wrapper no-drag">
                <div
                  className={`guide-segmented-item compact-four ${currentView === 'county' ? 'active' : ''}`}
                  onClick={() => setCurrentView('county')}
                >
                  区县提交
                </div>
                <div
                  className={`guide-segmented-item compact-four ${currentView === 'city' ? 'active' : ''}`}
                  onClick={() => setCurrentView('city')}
                >
                  市局审核
                </div>
                <div
                  className={`guide-segmented-item compact-four ${currentView === 'provincial' ? 'active' : ''}`}
                  onClick={() => setCurrentView('provincial')}
                >
                  省厅接收
                </div>
                <div
                  className={`guide-segmented-item compact-four ${currentView === 'rejectedEcho' ? 'active' : ''}`}
                  onClick={() => setCurrentView('rejectedEcho')}
                >
                  区县查验
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="scenario-city-audit-container" style={{ position: 'relative' }}>
      {/* 视图主体渲染 */}
      {currentView === 'county' && renderCountyView()}
      {currentView === 'city' && renderCityView()}
      {currentView === 'provincial' && renderProvincialView()}
      {currentView === 'rejectedEcho' && renderRejectedEchoView()}

      {/* 悬浮演示控制台 */}
      {renderFloatingGuideConsole()}
    </div>
  );
};

export default ScenarioCityAudit;
