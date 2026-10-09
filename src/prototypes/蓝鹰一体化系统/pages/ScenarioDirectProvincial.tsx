import React, { useState, useEffect } from 'react';
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
  Steps,
  Tooltip,
  Alert,
  Spin,
  Space,
  Pagination,
  Rate,
} from 'antd';
import {
  SendOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
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
  EyeOutlined,
  CopyOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ExportOutlined,
  FormOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// ==================== 字典数据定义 ====================

// 1. 地市 A (常州市) 本地辖区字典 (未勾选上报总队时仅展示本市)
const localChangzhouDistricts = [
  { value: '武进区', label: '武进区 (本大队辖区)' },
  { value: '天宁区', label: '天宁区' },
  { value: '钟楼区', label: '钟楼区' },
  { value: '新北区', label: '新北区' },
  { value: '金坛区', label: '金坛区' },
  { value: '溧阳市', label: '溧阳市' },
];

// 2. 江苏省全省标准属地字典 (省厅统一下发标准，13地市级联树)
const jiangsuProvinceCascader = [
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '徐州市',
        label: '徐州市',
        children: [
          { value: '贾汪区', label: '贾汪区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '云龙区', label: '云龙区' },
          { value: '泉山区', label: '泉山区' },
          { value: '铜山区', label: '铜山区' },
          { value: '丰县', label: '丰县' },
          { value: '沛县', label: '沛县' },
          { value: '睢宁县', label: '睢宁县' },
          { value: '新沂市', label: '新沂市' },
          { value: '邳州市', label: '邳州市' },
        ],
      },
      {
        value: '常州市',
        label: '常州市',
        children: [
          { value: '武进区', label: '武进区' },
          { value: '天宁区', label: '天宁区' },
          { value: '钟楼区', label: '钟楼区' },
          { value: '新北区', label: '新北区' },
          { value: '金坛区', label: '金坛区' },
          { value: '溧阳市', label: '溧阳市' },
        ],
      },
      {
        value: '南京市',
        label: '南京市',
        children: [
          { value: '玄武区', label: '玄武区' },
          { value: '秦淮区', label: '秦淮区' },
          { value: '建邺区', label: '建邺区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '江宁区', label: '江宁区' },
          { value: '浦口区', label: '浦口区' },
        ],
      },
      {
        value: '苏州市',
        label: '苏州市',
        children: [
          { value: '姑苏区', label: '姑苏区' },
          { value: '虎丘区', label: '虎丘区' },
          { value: '吴中区', label: '吴中区' },
          { value: '昆山市', label: '昆山市' },
        ],
      },
      {
        value: '无锡市',
        label: '无锡市',
        children: [
          { value: '梁溪区', label: '梁溪区' },
          { value: '滨湖区', label: '滨湖区' },
          { value: '江阴市', label: '江阴市' },
        ],
      },
      {
        value: '南通市',
        label: '南通市',
        children: [
          { value: '崇川区', label: '崇川区' },
          { value: '海门区', label: '海门区' },
          { value: '通州区', label: '通州区' },
        ],
      },
      {
        value: '连云港市',
        label: '连云港市',
        children: [
          { value: '海州区', label: '海州区' },
          { value: '连云区', label: '连云区' },
          { value: '赣榆区', label: '赣榆区' },
        ],
      },
      {
        value: '淮安市',
        label: '淮安市',
        children: [
          { value: '清江浦区', label: '清江浦区' },
          { value: '淮安区', label: '淮安区' },
          { value: '淮阴区', label: '淮阴区' },
        ],
      },
      {
        value: '盐城市',
        label: '盐城市',
        children: [
          { value: '亭湖区', label: '亭湖区' },
          { value: '盐都区', label: '盐都区' },
          { value: '大丰区', label: '大丰区' },
        ],
      },
      {
        value: '扬州市',
        label: '扬州市',
        children: [
          { value: '广陵区', label: '广陵区' },
          { value: '邗江区', label: '邗江区' },
          { value: '江都区', label: '江都区' },
        ],
      },
      {
        value: '镇江市',
        label: '镇江市',
        children: [
          { value: '京口区', label: '京口区' },
          { value: '润州区', label: '润州区' },
          { value: '丹徒区', label: '丹徒区' },
        ],
      },
      {
        value: '泰州市',
        label: '泰州市',
        children: [
          { value: '海陵区', label: '海陵区' },
          { value: '高港区', label: '高港区' },
          { value: '泰兴市', label: '泰兴市' },
        ],
      },
      {
        value: '宿迁市',
        label: '宿迁市',
        children: [
          { value: '宿城区', label: '宿城区' },
          { value: '宿豫区', label: '宿豫区' },
          { value: '沭阳县', label: '沭阳县' },
        ],
      },
    ],
  },
];

// 江苏省 13 地市名称列表 (用于通报地市多选)
const allJiangsuCities = [
  '南京市',
  '无锡市',
  '徐州市',
  '常州市',
  '苏州市',
  '南通市',
  '连云港市',
  '淮安市',
  '盐城市',
  '扬州市',
  '镇江市',
  '泰州市',
  '宿迁市',
];

export type ViewRole = 'cityA' | 'provincial' | 'cityB';

// ==================== 主组件定义 ====================

export const ScenarioDirectProvincial: React.FC = () => {
  const [form] = Form.useForm();

  // 当前视角：'cityA' (地市 A 填报端) | 'provincial' (省厅接收端) | 'cityB' (地市 B 接收端)
  const [currentView, setCurrentView] = useState<ViewRole>('cityA');

  // 地市 A 端子视图：'form' (手工上报表单) | 'list' (我的上报列表)
  const [cityASubTab, setCityASubTab] = useState<'form' | 'list'>('form');

  // 悬浮导引条折叠状态
  const [consoleCollapsed, setConsoleCollapsed] = useState(false);

  // 悬浮导引条/流程描述球坐标位置（支持自由拖拽移动，收纳时平滑回到右上角）
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

  // 处理拖拽起始事件（仅在展开态支持拖拽调整）
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
      const panelHeight = 420;
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

  // 报送目标勾选状态：默认仅勾选支队，上报总队未勾选
  const [reportTargets, setReportTargets] = useState<string[]>(['branch']);
  const [syncingDictionary, setSyncingDictionary] = useState(false);

  // 提交状态与结果数据
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('');

  // 省厅端数据状态
  const [provincialAdopted, setProvincialAdopted] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionSubmitting, setInstructionSubmitting] = useState(false);

  // 省厅卡片信息流专属交互状态
  const [provincialStreamView, setProvincialStreamView] = useState<'detail' | 'analysis' | 'brief'>('analysis');
  const [provincialTabKey, setProvincialTabKey] = useState<string>('district');
  const [provincialCardSelected, setProvincialCardSelected] = useState<boolean>(false);

  // 地市 B (徐州) 接收端状态
  const [cityBHandled, setCityBHandled] = useState(false);
  const [cityBDispatchModalOpen, setCityBDispatchModalOpen] = useState(false);
  const [cityBDispatchLoading, setCityBDispatchLoading] = useState(false);

  // 初始化预填表单数据 (地市 A 常州上报涉及地市 B 徐州的数据)
  useEffect(() => {
    form.setFieldsValue({
      link: 'https://v.douyin.com/kP8a2L1/ 某工业园区厂区周边人员聚集谣言视频...',
      topic: '关于徐州某工业园区网络谣言线索协查',
      eventTime: dayjs(),
      collector: '王建明 (警号: 043921)',
      collectionUnit: '常州市公安局武进分局网安大队',
      infoSource: '抖音短视频平台',
      author: '网海观察哨',
      authorPlatformId: 'DY_9984102948',
      initialOpinion:
        '近日网安巡查发现某短视频平台流传关于徐州某工业园区重点工程涉污及用工争议的不实舆情，跟帖有跨区域煽动趋势。经核查涉事属地为徐州贾汪区，按跨地市通报机制呈报总队并抄送徐州市局协查处置。',
      level: '3级 (较大)',
      sentimentType: '涉警舆情',
      taskType: '日常上报',
      jurisdictionLocal: '武进区',
      jurisdictionProvince: ['江苏省', '徐州市', '贾汪区'],
      notifyCities: ['徐州市'],
    });
  }, [form]);

  // 处理报送目标勾选变动及字典纯净替换
  const handleTargetChange = (checkedValues: string[]) => {
    if (!checkedValues.includes('branch')) {
      message.warning('系统规则约束：“上报支队”为基层必报通道，不可取消勾选');
      checkedValues = [...checkedValues, 'branch'];
    }

    const wasProvincialChecked = reportTargets.includes('provincial');
    const isProvincialChecked = checkedValues.includes('provincial');

    setReportTargets(checkedValues);

    // 勾选【上报总队】时触发 0.3s 微交互，纯净替换为全省标准字典（不合并本地市局字典）
    if (!wasProvincialChecked && isProvincialChecked) {
      setSyncingDictionary(true);
      message.loading({
        content: '已勾选上报总队，正在纯净覆盖拉取省厅全省统一标准字典...',
        key: 'dictSync',
        duration: 0.5,
      });

      setTimeout(() => {
        setSyncingDictionary(false);
        message.success({
          content: '全省标准字典纯净覆盖成功！已清空本地市级字典，激活全省属地与跨地市通报。',
          key: 'dictSync',
          duration: 2,
        });
        // 纯净切换为全省标准属地并预置通报地市为【徐州市】
        form.setFieldsValue({
          jurisdictionProvince: ['江苏省', '徐州市', '贾汪区'],
          notifyCities: ['徐州市'],
        });
      }, 300);
    }
  };

  // 提交手工上报表单
  const handleSubmitReport = async () => {
    try {
      if (reportTargets.length === 0) {
        message.error('请至少选择一个报送目标');
        return;
      }

      setSubmitting(true);
      message.loading({
        content: '正在校验免审白名单通道并调用前置机跨网摆渡落库...',
        key: 'submittingKey',
        duration: 0.6,
      });

      setTimeout(() => {
        setSubmitting(false);
        setIsSubmitted(true);
        const nowStr = dayjs().format('YYYY-MM-DD HH:mm:ss');
        setSubmitTimestamp(nowStr);
        message.success({
          content: '上报成功，已同步至省厅并镜像推送至徐州市公安局',
          key: 'submittingKey',
          duration: 3,
        });
        // 自动跳转到“我的上报列表”
        setCityASubTab('list');
      }, 500);
    } catch {
      message.error('表单校验未通过，请核对信息');
    }
  };

  // 省厅端下达指令并转为【已采纳】
  const handleDispatchInstruction = () => {
    setInstructionSubmitting(true);
    setTimeout(() => {
      setInstructionSubmitting(false);
      setInstructionModalOpen(false);
      setProvincialAdopted(true);
      message.success('处置指令下发成功！该记录状态已更新为【已采纳】，计入采纳率考核分子！');
    }, 400);
  };

  // 地市 B (徐州) 转为本地处置
  const handleCityBDispatch = () => {
    setCityBDispatchLoading(true);
    setTimeout(() => {
      setCityBDispatchLoading(false);
      setCityBDispatchModalOpen(false);
      setCityBHandled(true);
      message.success('已转为徐州本地处置工单，贾汪分局网安大队已实时认领处置！');
    }, 400);
  };

  // 重置整个演示流程
  const handleResetDemo = () => {
    setCurrentView('cityA');
    setCityASubTab('form');
    setReportTargets(['branch']);
    setIsSubmitted(false);
    setProvincialAdopted(false);
    setCityBHandled(false);
    setProvincialCardSelected(false);
    form.resetFields();
    form.setFieldsValue({
      link: 'https://v.douyin.com/kP8a2L1/ 某工业园区厂区周边人员聚集谣言视频...',
      topic: '关于徐州某工业园区网络谣言线索协查',
      eventTime: dayjs(),
      collector: '王建明 (警号: 043921)',
      collectionUnit: '常州市公安局武进分局网安大队',
      infoSource: '抖音短视频平台',
      author: '网海观察哨',
      authorPlatformId: 'DY_9984102948',
      initialOpinion:
        '近日网安巡查发现某短视频平台流传关于徐州某工业园区重点工程涉污及用工争议的不实舆情，跟帖有跨区域煽动趋势。经核查涉事属地为徐州贾汪区，按跨地市通报机制呈报总队并抄送徐州市局协查处置。',
      level: '3级 (较大)',
      sentimentType: '涉警舆情',
      taskType: '日常上报',
      jurisdictionLocal: '武进区',
      jurisdictionProvince: ['江苏省', '徐州市', '贾汪区'],
      notifyCities: ['徐州市'],
    });
    message.info('演示动线已重置，当前已回到地市 A 填报起点。');
  };

  // ==================== 视图 A：地市 A (常州) 区县填报端 ====================
  const renderCityAView = () => (
    <div className="county-view-wrapper">
      {/* 顶部环境与身份条 */}
      <div className="scenario-env-header env-internet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <GlobalOutlined /> 互联网端 · 地市 A (常州)
          </span>
          <span className="scenario-env-title">
            常州市公安局武进分局网安大队 · 手工填报台账
          </span>
          <span className="scenario-env-subtitle">
            （当前登录：王建明警官 · 具备“免审直通省厅”及“跨地市通报”权限）
          </span>
        </div>
        <Space>
          <Button
            type={cityASubTab === 'form' ? 'primary' : 'default'}
            size="small"
            onClick={() => setCityASubTab('form')}
          >
            填报表单
          </Button>
          <Button
            type={cityASubTab === 'list' ? 'primary' : 'default'}
            size="small"
            onClick={() => setCityASubTab('list')}
          >
            我的上报列表 {isSubmitted && <Badge status="processing" style={{ marginLeft: 4 }} />}
          </Button>
        </Space>
      </div>

      {cityASubTab === 'form' ? (
        <Card
          className="manual-report-card"
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>监测预警 - 手工上报（地市 A 区县端）</span>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                免审直通省厅 · 纯净省厅字典覆盖与跨地市通报演示
              </span>
            </div>
          }
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <Form form={form} layout="horizontal" labelCol={{ flex: '120px' }} wrapperCol={{ flex: 'auto' }}>
            {/* 核心改造项：报送目标复选框 */}
            <Row gutter={24} style={{ marginBottom: 16 }}>
              <Col span={24}>
                <div
                  className="incremental-container"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#f0f7ff',
                    borderRadius: 6,
                    border: '1px dashed #1677ff',
                  }}
                >
                  <Annotated
                    pin={1}
                    title="报送目标与字典动态级联"
                    note="默认勾选上报支队。勾选上报总队时触发跨租户字典拉取，将本地属地树动态替换为省厅统一下发的全省属地字典标准。"
                    tag="跨租户字典"
                    placement="top-right"
                  >
                    <div
                      className="incremental-highlight"
                      data-note="默认勾选上报支队。勾选上报总队时触发跨租户字典拉取，将本地属地树动态替换为省厅统一下发的全省属地字典标准。"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontWeight: 600, color: '#1677ff' }}>
                          <ThunderboltOutlined style={{ marginRight: 4 }} />
                          报送目标：
                        </span>
                        <Checkbox.Group
                          value={reportTargets}
                          onChange={(vals) => handleTargetChange(vals as string[])}
                        >
                          <Checkbox value="branch" disabled>
                            <Tooltip title="地市 A (常州) 基层上报默认必报本市支队（系统规则锁定）">
                              <span>上报支队（锁定）</span>
                            </Tooltip>
                          </Checkbox>
                          <Checkbox value="provincial" style={{ marginLeft: 16 }}>
                            <span style={{ fontWeight: 600, color: '#0958d9' }}>
                              上报总队
                            </span>
                          </Checkbox>
                        </Checkbox.Group>

                        {reportTargets.includes('provincial') && (
                          <Tag
                            color="processing"
                            style={{
                              borderRadius: 12,
                              padding: '2px 10px',
                              fontSize: 12,
                              fontWeight: 500,
                              background: '#e6f4ff',
                              borderColor: '#91caff',
                              color: '#0958d9',
                              marginLeft: 8,
                            }}
                          >
                            [已激活直通省厅通道]
                          </Tag>
                        )}

                        {syncingDictionary && (
                          <span className="cascade-sync-overlay">
                            <Spin size="small" /> 正在拉取省厅全省统一标准属地字典...
                          </span>
                        )}
                      </div>
                    </div>
                  </Annotated>
                </div>
              </Col>
            </Row>

            {/* 1. 舆情链接 */}
            <Form.Item label="舆情链接" name="link" rules={[{ required: true, message: '请输入舆情链接' }]}>
              <Input placeholder="请输入待排查上报的社交媒体链接或视频地址" />
            </Form.Item>

            {/* 2. 信息主题 / 标题 */}
            <Form.Item label="信息主题" name="topic" rules={[{ required: true, message: '请输入信息主题' }]}>
              <Input placeholder="关于徐州某工业园区网络谣言线索协查" />
            </Form.Item>

            {/* 3. 属地级联联动与通报地市 (纯净替换) */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="涉事属地"
                  required
                  tooltip={
                    reportTargets.includes('provincial')
                      ? '已纯净覆盖为省厅标准字典（包含江苏省 13 地市及全部区县，原常州本地字典已清空）'
                      : '当前仅勾选支队，仅展示常州本地市级字典'
                  }
                >
                  {reportTargets.includes('provincial') ? (
                    <div className="incremental-highlight" style={{ width: '100%' }}>
                      <Form.Item name="jurisdictionProvince" noStyle>
                        <Cascader
                          options={jiangsuProvinceCascader}
                          placeholder="选择全省标准属地（已纯净载入江苏省全量 13 地市字典）"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </div>
                  ) : (
                    <Form.Item name="jurisdictionLocal" noStyle>
                      <Select placeholder="选择本地常州辖区" style={{ width: '100%' }}>
                        {localChangzhouDistricts.map((d) => (
                          <Option key={d.value} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Annotated
                  pin={4}
                  title="跨地市异步推送逻辑"
                  note="字典完全替换为省厅下发标准；若通报地市包含非本市辖区，系统后台自动触发跨地市异步推送至目标地市数据库。"
                  tag="跨地市协同"
                  placement="top-right"
                >
                  <div
                    className={reportTargets.includes('provincial') ? 'incremental-highlight' : ''}
                    data-note="字典完全替换为省厅下发标准；若通报地市包含非本市辖区，系统后台自动触发跨地市异步推送至目标地市数据库。"
                  >
                    <Form.Item
                      label="通报地市"
                      tooltip={
                        reportTargets.includes('provincial')
                          ? '已纯净替换为全省 13 地市多选：选择徐州市将触发跨地市镜像推送'
                          : '置灰不可选：仅上报支队时限制为本地市（常州市）'
                      }
                    >
                      <Form.Item name="notifyCities" noStyle>
                        <Select
                          mode="multiple"
                          placeholder={
                            reportTargets.includes('provincial')
                              ? '请选择跨地市通报目标（支持多选全省 13 地市）'
                              : '仅限本地市（常州市）'
                          }
                          disabled={!reportTargets.includes('provincial')}
                          style={{ width: '100%' }}
                        >
                          {allJiangsuCities.map((city) => (
                            <Option key={city} value={city}>
                              {city}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form.Item>
                    {reportTargets.includes('provincial') && (
                      <span className="incremental-badge">改</span>
                    )}
                  </div>
                </Annotated>
              </Col>
            </Row>

            {/* 4. 事件时间、采集人、采集单位 */}
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="发生时间" name="eventTime">
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="采集人" name="collector">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="采集单位" name="collectionUnit">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            {/* 5. 信息来源、作者平台ID */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="信息来源" name="infoSource">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="作者平台ID" name="authorPlatformId">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* 6. 初研意见 */}
            <Form.Item label="初研意见" name="initialOpinion" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="请录入常州大队的初步核查与跨市协查建议" />
            </Form.Item>

            {/* 7. 等级、舆情类型、任务类型 */}
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="预警等级" name="level">
                  <Select>
                    <Option value="1级 (微弱)">1级 (微弱)</Option>
                    <Option value="2级 (一般)">2级 (一般)</Option>
                    <Option value="3级 (较大)">3级 (较大)</Option>
                    <Option value="4级 (重大)">4级 (重大)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="舆情类型" name="sentimentType">
                  <Select>
                    <Option value="涉警舆情">涉警舆情</Option>
                    <Option value="社会民生">社会民生</Option>
                    <Option value="政治安全">政治安全</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="任务类型" name="taskType">
                  <Select>
                    <Option value="日常上报">日常上报</Option>
                    <Option value="跨市协查">跨市协查</Option>
                    <Option value="紧急上报">紧急上报</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 表单底部操作栏 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                paddingTop: 16,
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <Button style={{ color: '#595959', borderColor: '#d9d9d9' }} onClick={() => form.resetFields()}>
                重置表单
              </Button>

              <Annotated
                pin={2}
                title="免审直通跨网摆渡机制"
                note="免审直通逻辑：系统检测当前租户未开启市局审核开关，数据落库本地后立即异步调用跨网前置机服务摆渡入省厅内网库。"
                tag="跨网同步"
                placement="top-left"
              >
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={submitting}
                  onClick={handleSubmitReport}
                  style={{
                    minWidth: 120,
                    height: 36,
                    background: '#1677ff',
                    borderColor: '#1677ff',
                    fontWeight: 500,
                  }}
                >
                  确认上报
                </Button>
              </Annotated>
            </div>
          </Form>
        </Card>
      ) : (
        /* 地市 A 端：我的上报列表 */
        <Card
          title="地市 A (常州) - 我的舆情上报台账列表"
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          extra={
            <Button type="primary" size="small" onClick={() => setCityASubTab('form')}>
              继续上报新线索
            </Button>
          }
        >
          <Table
            pagination={false}
            rowKey="id"
            dataSource={[
              {
                id: 'r-01',
                title: '关于徐州某工业园区网络谣言线索协查',
                time: submitTimestamp || '2026-10-08 17:28:00',
                targets: reportTargets,
                status: isSubmitted ? '已同步省厅并推送徐州' : '草稿待报',
                isCurrent: isSubmitted,
                scope: reportTargets.includes('provincial') ? '全省标准 (江苏/徐州/贾汪)' : '本地 (常州武进)',
                notifyCity: '徐州市',
              },
              {
                id: 'r-02',
                title: '某货运车辆违规上路致村民围观舆情巡查',
                time: '2026-10-07 14:20:11',
                targets: ['branch'],
                status: '常州支队已接收',
                isCurrent: false,
                scope: '本地 (常州武进)',
                notifyCity: '无',
              },
            ]}
            columns={[
              {
                title: '舆情标题',
                dataIndex: 'title',
                render: (text, record) => (
                  <Space direction="vertical" size={2}>
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{text}</span>
                    {record.isCurrent && (
                      <Tag color="cyan" style={{ fontSize: 11 }}>
                        已触发跨市推送与免审直通
                      </Tag>
                    )}
                  </Space>
                ),
              },
              {
                title: '涉事属地',
                dataIndex: 'scope',
              },
              {
                title: '报送目标',
                dataIndex: 'targets',
                render: (targets: string[]) => (
                  <Space>
                    <Tag color="blue">已报支队</Tag>
                    {targets.includes('provincial') && <Tag color="green">已报总队</Tag>}
                  </Space>
                ),
              },
              {
                title: '跨市通报地市',
                dataIndex: 'notifyCity',
                render: (city: string) => (city !== '无' ? <Tag color="orange">{city}</Tag> : '无'),
              },
              {
                title: '流转状态',
                dataIndex: 'status',
                render: (st, record) => (
                  <Space>
                    <Badge status={record.isCurrent ? 'success' : 'default'} />
                    <span>{st}</span>
                  </Space>
                ),
              },
              {
                title: '操作',
                key: 'action',
                render: () => (
                  <Space>
                    <Button type="link" size="small" onClick={() => setDetailDrawerOpen(true)}>
                      查看回执
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => setCurrentView('provincial')}
                    >
                      前往省厅端查看
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      )}
    </div>
  );

  // ==================== 视图 B：省厅总队内网端页面 (优化为系统原生舆情卡片流视图) ====================
  const renderProvincialView = () => (
    <div className="provincial-view-wrapper">
      {/* 顶部公安内网环境标识 */}
      <div className="scenario-env-header env-intranet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <SafetyCertificateOutlined /> 公安内网环境 · 省厅总队端
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            江苏省公安厅网安总队 · 智控研判处置平台
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#bae0ff' }}>
            （值班长：李警官 · 路由：/provincial/monitor/county-reports）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('cityA')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 切回地市A (常州填报)
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => setCurrentView('cityB')}
          >
            查看徐州通报端 (视图 C) →
          </Button>
        </Space>
      </div>

      {/* 状态通知横幅 */}
      <Alert
        message={
          provincialAdopted
            ? '总队处置指令已下达：该直报舆情已标记为【已采纳】，并计入总队对常州市局的采纳考核分值。'
            : isSubmitted
            ? '跨网摆渡落库成功：省厅内网已实时接收常州市局直报舆情，处于【未采纳 / 待研判】状态，请研判后下达处置指令。'
            : '提示：地市 A (常州) 尚未点击【确认上报】，当前展示省厅内网历史直报数据底册。'
        }
        type={provincialAdopted ? 'success' : isSubmitted ? 'info' : 'warning'}
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
              defaultValue="徐州某工业园区"
              allowClear
            />
          </div>

          <div className="stream-filter-field">
            <span className="stream-filter-label">发布时间</span>
            <DatePicker.RangePicker style={{ width: 240 }} />
          </div>

          <div className="stream-filter-field">
            <span className="stream-filter-label">接收时间</span>
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
              className={`stream-view-btn ${provincialStreamView === 'detail' ? 'active' : ''}`}
              onClick={() => setProvincialStreamView('detail')}
            >
              详细视图
            </button>
            <button
              type="button"
              className={`stream-view-btn ${provincialStreamView === 'analysis' ? 'active' : ''}`}
              onClick={() => setProvincialStreamView('analysis')}
            >
              研判视图
            </button>
            <button
              type="button"
              className={`stream-view-btn ${provincialStreamView === 'brief' ? 'active' : ''}`}
              onClick={() => setProvincialStreamView('brief')}
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
            <Button size="small" onClick={handleResetDemo}>重置演示数据</Button>
            {!isSubmitted && (
              <Button
                size="small"
                type="dashed"
                style={{ color: '#1677ff' }}
                onClick={() => {
                  setIsSubmitted(true);
                  setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                  message.success('已模拟触发地市 A (常州) 跨网直通省厅落库！');
                }}
              >
                模拟常州直推省厅
              </Button>
            )}
          </Space>
        </div>
      </div>

      {/* 2. 模块二级 Tab 栏 (1:1 原生导航) */}
      <div className="stream-tabs-bar">
        <div className="stream-tabs-list">
          <div
            className={`stream-tab-item ${provincialTabKey === 'all' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('all')}
          >
            <span className="stream-ai-pill">AI</span> 全部
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'suggestion' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('suggestion')}
          >
            研判建议
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'alert' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('alert')}
          >
            <span className="stream-ai-pill">AI</span> 智能预警
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'account' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('account')}
          >
            <span className="stream-ai-pill">AI</span> 重点账号
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'special' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('special')}
          >
            专项巡查
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'local' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('local')}
          >
            本地舆情
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'source' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('source')}
          >
            重点源
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'claim' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('claim')}
          >
            待认领舆情
          </div>
          {/* 区县上报：当前高亮激活，挂载待办角标 Badge */}
          <div
            className={`stream-tab-item ${provincialTabKey === 'district' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('district')}
          >
            区县上报
            <Badge
              count={provincialAdopted ? 0 : 1}
              size="small"
              style={{ backgroundColor: '#1677ff', marginLeft: 2 }}
            />
          </div>
          <div
            className={`stream-tab-item ${provincialTabKey === 'notice' ? 'active' : ''}`}
            onClick={() => setProvincialTabKey('notice')}
          >
            通报信息
          </div>
        </div>

        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          size="small"
          style={{ borderRadius: 4 }}
          onClick={() => setInstructionModalOpen(true)}
        >
          总队研判派发
        </Button>
      </div>

      {/* 3. 卡片流内容主体 (Card-Stream View) */}
      <div className="stream-cards-wrapper">
        {/* 卡片 1：本次演示重点 - 常州免审直通推送徐州工业园区协查记录 */}
        <div className="stream-card-box" style={{ borderColor: '#91caff', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.08)' }}>
          {/* 1. 卡片头部行 (Header) */}
          <div className="stream-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Checkbox
                checked={provincialCardSelected}
                onChange={(e) => setProvincialCardSelected(e.target.checked)}
              />
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: 13, marginRight: 2 }}>
                1
              </span>

              {/* 核心状态徽标（免审直通 / 采纳状态） */}
              {provincialAdopted ? (
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
                  已采纳 (已下达总队处置)
                </Tag>
              ) : (
                <Tag
                  style={{
                    background: '#e6f4ff',
                    color: '#0958d9',
                    borderColor: '#91caff',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  未采纳 / 待研判
                </Tag>
              )}

              <Tag
                style={{
                  background: '#f0fdf4',
                  color: '#15803d',
                  borderColor: '#86efac',
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                免审直通 · 总队已接报
              </Tag>

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
              上报来源：常州市公安局武进分局网安大队
            </span>
            <span>
              <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 4 }} />
              涉事属地：江苏省 / 徐州市 / 贾汪区
            </span>
            <span>
              <VideoCameraOutlined style={{ marginRight: 4, color: '#0f172a' }} />
              抖音短视频平台
            </span>
            <span>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              接收时间：{submitTimestamp ? `${submitTimestamp} (刚刚)` : '刚刚 (17:28:12)'}
            </span>
          </div>

          {/* 3. 舆情主标题与正文 (Content) */}
          <div className="stream-card-title-content">
            #关于徐州某工业园区网络谣言线索协查。监测发现网民在短视频平台发布涉及徐州某重点工业园区涉污及用工争议信息，跟帖评论已出现跨地市煽动聚集苗头。常州武进网安大队完成初研后，按跨地市通报机制免审直推省厅总队，并提请抄送徐州市局协查处置。
          </div>

          {/* 4. AI 摘要与研判分析双色块 + 右侧大尺寸舆情指数 */}
          <div className="stream-card-split-body">
            <div className="stream-card-analysis-side">
              {/* 浅绿色背景框【AI 摘要】 */}
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
                  监测发现网民通过短视频发布徐州工业园区涉污非访言论，涉及跨地市关联，常州属地初研已固定证据并提请省厅统筹处置。
                </div>
              </div>

              {/* 浅橙色背景框【初研研判 / 总队研判】 */}
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
                  <span style={{ fontWeight: 600, color: '#c2410c' }}>【常州初研】：</span>
                  该线索涉及跨地市煽动，建议由省厅总队统筹下达核查指令，由目标地徐州市公安局属地核查落地人，两地协同就地化解。
                </div>
              </div>
            </div>

            {/* 右侧大尺寸渐变卡片【舆情指数】 */}
            <div className="stream-card-index-card">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#7c3aed', lineHeight: 1.1 }}>
                72.00
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', opacity: 0.85, marginTop: 4 }}>
                舆情指数
              </div>
            </div>
          </div>

          {/* 5. 底部标签池 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <Tag color="blue" style={{ borderRadius: 3 }}>来源: 常州直通</Tag>
            <Tag color="purple" style={{ borderRadius: 3 }}>直报总队</Tag>
            <Tag color="cyan" style={{ borderRadius: 3 }}>跨地市协查</Tag>
            <Tag color="geekblue" style={{ borderRadius: 3 }}>徐州市</Tag>
            <Tag color="orange" style={{ borderRadius: 3 }}>贾汪区</Tag>
            <Tag color="volcano" style={{ borderRadius: 3 }}>涉稳线索</Tag>
          </div>

          {/* 6. 底部操作栏 (挂载 Pin 3 考核采纳批注) */}
          <div className="stream-card-actions-bar">
            {/* 次要操作 */}
            <Space>
              <Button
                type="link"
                size="small"
                icon={<FileSearchOutlined />}
                style={{ paddingLeft: 0 }}
                onClick={() => setDetailDrawerOpen(true)}
              >
                查看跨网流水详情
              </Button>
              <Button
                type="link"
                size="small"
                icon={<RobotOutlined />}
                onClick={() => setAiModalOpen(true)}
              >
                AI深度研判
              </Button>
              <Button
                type="link"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制舆情标题与正文')}
              >
                一键复制
              </Button>
            </Space>

            {/* 核心采纳与指令下达操作 (挂载 AxHub 图钉批注 3) */}
            <div>
              {!provincialAdopted ? (
                <Annotated
                  pin={3}
                  title="采纳状态与考核关联"
                  note="指标统计源点：初始为未采纳，后续若总队以此记录发起处置指令，状态将更新为已采纳，计入采纳率考核分子。"
                  tag="考核口径"
                  placement="top-right"
                >
                  <Button
                    type="primary"
                    icon={<ThunderboltOutlined />}
                    onClick={() => setInstructionModalOpen(true)}
                    style={{ minWidth: 160 }}
                  >
                    下达处置指令 (更新采纳)
                  </Button>
                </Annotated>
              ) : (
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
                    已下达处置指令 (已采纳 · 计入总队考核)
                  </Tag>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setCurrentView('cityB')}
                  >
                    前往徐州通报查验 <ArrowRightOutlined />
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>

        {/* 卡片 2：连云港历史直报记录 */}
        <div className="stream-card-box">
          <div className="stream-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Checkbox />
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: 13, marginRight: 2 }}>
                2
              </span>
              <Tag style={{ background: '#f6ffed', color: '#389e0d', borderColor: '#b7eb8f', fontWeight: 600, borderRadius: 2 }}>
                <CheckCircleOutlined style={{ marginRight: 4 }} />
                已采纳
              </Tag>
              <Tag style={{ background: '#1677ff', color: '#ffffff', border: 'none', borderRadius: 2, padding: '0 6px', fontSize: 11 }}>
                初研意见
              </Tag>
              <span style={{ fontSize: 12, color: '#595959', margin: '0 4px' }}>处置</span>
              <Tag style={{ background: '#ffffff', color: '#1677ff', borderColor: '#91caff', borderRadius: 2, fontSize: 11 }}>
                非热敏
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#faad14', fontSize: 14 }}>★ ★ ★ ☆ ☆</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>3.0星</span>
            </div>
          </div>
          <div className="stream-card-meta">
            <span style={{ color: '#1e293b', fontWeight: 600 }}>连云港海州分局·陈警官</span>
            <span>ID 3766282710492811</span>
            <span>上报来源：连云港市公安局海州分局网安大队</span>
            <span><EnvironmentOutlined style={{ color: '#1677ff' }} /> 江苏省 / 连云港市 / 海州区</span>
            <span><ClockCircleOutlined /> 2026-10-08 16:30:15</span>
          </div>
          <div className="stream-card-title-content">
            #连云港海州区某渔港设施搬迁讨论网络线索。网民在本地论坛讨论渔港改造期间泊位调整事宜，属地民警已就地做好政策宣贯，舆情平稳可控。
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            <Tag color="blue">来源: 连云港直通</Tag>
            <Tag color="cyan">连云港市</Tag>
            <Tag color="green">已办结</Tag>
          </div>
          <div className="stream-card-actions-bar">
            <Space>
              <Button type="link" size="small" style={{ paddingLeft: 0 }}>查看详情</Button>
              <Button type="link" size="small">复盘总结</Button>
            </Space>
            <Tag color="default">已归档办结</Tag>
          </div>
        </div>

        {/* 底部工具与分页 */}
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
            total={2}
            current={1}
            pageSize={10}
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </div>
    </div>
  );

  // ==================== 视图 C：地市 B (徐州) 用户接收端 ====================
  const renderCityBView = () => (
    <div className="city-b-view-wrapper">
      {/* 顶部地市 B 环境条 */}
      <div className="scenario-env-header env-city-b">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 地市 B (徐州) 接收端
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            徐州市公安局网安支队 · 舆情监测预警与指令协同平台
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （值班长：陈队长 · 路由：/city-b/monitor/notice-info · 镜像通报信道畅通）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('cityA')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回常州填报端
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentView('provincial')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            返回省厅端
          </Button>
        </Space>
      </div>

      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>监测预警 - 舆情监测台账与通报中心</span>
            <Space>
              <Tag color="orange">已接收异地跨市镜像推送</Tag>
              <Tag color="cyan">属地贾汪网安连线中</Tag>
            </Space>
          </div>
        }
      >
        <Tabs
          defaultActiveKey="notice"
          items={[
            { key: 'all', label: '全部' },
            { key: 'district', label: '区县上报' },
            { key: 'ai-discovery', label: 'AI主动发现' },
            {
              key: 'notice',
              label: (
                <Annotated
                  pin={5}
                  title="异地通报专属板块"
                  note="异地通报专属板块：展示外市推送的涉本市舆情镜像数据，独立于本地上报数据，支持本地闭环处置。"
                  tag="数据隔离与镜像"
                  placement="top-left"
                >
                  <div
                    data-note="异地通报专属板块：展示外市推送的涉本市舆情镜像数据，独立于本地上报数据，支持本地闭环处置。"
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <span>通报信息</span>
                    <Badge
                      count={cityBHandled ? 0 : 1}
                      style={{ backgroundColor: '#fa8c16', marginLeft: 6 }}
                    />
                    <span className="incremental-badge" style={{ position: 'relative', top: -1, right: 0, marginLeft: 4 }}>
                      改
                    </span>
                  </div>
                </Annotated>
              ),
            },
            { key: 'claim', label: '待认领舆情' },
          ]}
        />

        <Table
          pagination={false}
          rowKey="id"
          rowClassName={(record) => (record.id === 'cityB-01' ? 'provincial-highlight-row' : '')}
          dataSource={[
            {
              id: 'cityB-01',
              title: '关于徐州某工业园区网络谣言线索协查',
              source: '常州市公安局（武进分局网安大队）',
              jurisdiction: '徐州市 / 贾汪区',
              time: submitTimestamp ? `${submitTimestamp} (刚刚)` : '刚刚 (17:28:12)',
              status: cityBHandled ? '已处置' : '待处理',
              isCurrent: true,
            },
            {
              id: 'cityB-02',
              title: '南京市公安局通报涉徐某物流车辆在宁违章引争议信息',
              source: '南京市公安局',
              jurisdiction: '徐州市 / 鼓楼区',
              time: '2026-10-08 14:10:00',
              status: '已处置',
              isCurrent: false,
            },
            {
              id: 'cityB-03',
              title: '苏州市公安局转来涉徐网络直播间不当言论协查函',
              source: '苏州市公安局',
              jurisdiction: '徐州市 / 泉山区',
              time: '2026-10-07 18:32:00',
              status: '已处置',
              isCurrent: false,
            },
          ]}
          columns={[
            {
              title: '舆情标题',
              dataIndex: 'title',
              render: (text, record) => (
                <div>
                  <Space align="center">
                    <Tag className="tag-remote-notice">异地通报</Tag>
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{text}</span>
                  </Space>
                  {record.isCurrent && (
                    <div style={{ fontSize: 11, color: '#fa8c16', marginTop: 2 }}>
                      ⚡ 常州市公安局跨市镜像同步 · 涉及徐州贾汪属地协查
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: '通报来源',
              dataIndex: 'source',
            },
            {
              title: '涉事属地',
              dataIndex: 'jurisdiction',
            },
            {
              title: '通报时间',
              dataIndex: 'time',
            },
            {
              title: '处置状态',
              dataIndex: 'status',
              render: (st: string, record) => (
                <Space>
                  <Badge status={record.status === '已处置' ? 'success' : 'warning'} />
                  <span style={{ fontWeight: record.status === '待处理' ? 600 : 'normal', color: record.status === '待处理' ? '#fa8c16' : '#52c41a' }}>
                    {st}
                  </span>
                </Space>
              ),
            },
            {
              title: '操作',
              key: 'action',
              render: (_: unknown, record) => (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<FileSearchOutlined />}
                    onClick={() => setDetailDrawerOpen(true)}
                  >
                    查看详情
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    disabled={record.status === '已处置'}
                    icon={<ForwardOutlined />}
                    onClick={() => setCityBDispatchModalOpen(true)}
                  >
                    {record.status === '已处置' ? '已转处置' : '转处置'}
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<StarOutlined />}
                    onClick={() => message.success('已加入徐州本地关注舆情清单')}
                  >
                    加入关注
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );

  return (
    <div className="scenario-direct-provincial-container" style={{ position: 'relative' }}>
      {/* 视图主体渲染 */}
      {currentView === 'cityA' && renderCityAView()}
      {currentView === 'provincial' && renderProvincialView()}
      {currentView === 'cityB' && renderCityBView()}

      {/* ==================== 悬浮导引条（三步三视角联动 · 统一右上角平滑收纳） ==================== */}
      <div
        className={`scenario-guide-console ${consoleCollapsed ? 'collapsed' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={
          hasCustomPos && !consoleCollapsed
            ? { left: consolePos.x, top: consolePos.y, right: 'auto' }
            : { right: 24, top: 84 }
        }
      >
        {consoleCollapsed ? (
          <Tooltip title="点击展开三方联动引导面板" placement="left">
            <div
              className="scenario-guide-ball-inner"
              onClick={() => {
                setConsoleCollapsed(false);
                setHasCustomPos(false);
              }}
            >
              <CompassOutlined style={{ fontSize: 20 }} />
              <span className="guide-ball-badge">
                {currentView === 'cityA'
                  ? '1/3'
                  : currentView === 'provincial'
                  ? '2/3'
                  : cityBHandled
                  ? '3/3 ✓'
                  : '3/3'}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div className="guide-console-full-content">
            <div className="guide-console-header" onMouseDown={handleStartDrag}>
              <div className="guide-header-title">
                <HolderOutlined style={{ opacity: 0.45, cursor: 'grab', marginRight: 2 }} />
                <span className="guide-badge-pill">场景 1</span>
                <span className="guide-header-title-text" title="跨地市通报三方联动">
                  跨地市通报三方联动
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
                <div
                  className={`guide-progress-pill ${
                    currentView === 'cityA' || currentView === 'provincial' || currentView === 'cityB'
                      ? 'active'
                      : ''
                  }`}
                />
                <div
                  className={`guide-progress-pill ${
                    currentView === 'provincial' || currentView === 'cityB' ? 'active' : ''
                  }`}
                />
                <div className={`guide-progress-pill ${currentView === 'cityB' ? 'active' : ''}`} />
              </div>
              <div className="guide-step-labels">
                <span className={`guide-step-label-item ${currentView === 'cityA' ? 'active' : ''}`}>
                  1. 区县填报
                </span>
                <span className={`guide-step-label-item ${currentView === 'provincial' ? 'active' : ''}`}>
                  2. 省厅查验
                </span>
                <span className={`guide-step-label-item ${currentView === 'cityB' ? 'active' : ''}`}>
                  3. 跨市流转
                </span>
              </div>

              {/* 步骤指引卡片 (淡蓝底色, 线性图标, 精准引导) */}
              {currentView === 'cityA' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {isSubmitted ? (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        常州武进舆情已提交！数据已同步省厅并镜像推送至徐州市公安局。请点击下方按钮前往省厅视角查验。
                      </span>
                    ) : (
                      '请勾选【上报总队】观察涉事属地纯净切换为省厅全省字典，通报地市选择【徐州市】并提交上报。'
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
                    {provincialAdopted ? (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        已完成指令下发，采纳状态已更新。徐州市局已建立镜像通报，请前往徐州视角查验。
                      </span>
                    ) : (
                      '省厅【区县上报】已成功接收该记录。点击【下达处置指令】完成采纳闭环，或直接前往徐州通报查验。'
                    )}
                  </div>
                </div>
              )}

              {currentView === 'cityB' && (
                <div className="guide-step-card-light">
                  <InfoCircleOutlined
                    style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }}
                  />
                  <div className="guide-step-card-text">
                    {cityBHandled ? (
                      <span style={{ color: '#0958d9', fontWeight: 500 }}>
                        已完成徐州本地派发转处置！跨地市通报全链路闭环演示完成。
                      </span>
                    ) : (
                      '徐州市局【通报信息】已自动生成镜像记录。点击操作列【转处置】可向属地贾汪分局派发指令。'
                    )}
                  </div>
                </div>
              )}

              {/* 核心操作按钮 */}
              <div className="no-drag" style={{ marginTop: 6 }}>
                {currentView === 'cityA' && (
                  <>
                    {!reportTargets.includes('provincial') && (
                      <button
                        className="guide-btn-sub"
                        onClick={() => handleTargetChange(['branch', 'provincial'])}
                      >
                        一键勾选【上报总队】触发省厅字典
                      </button>
                    )}
                    <button
                      className="guide-btn-primary"
                      onClick={() => setCurrentView('provincial')}
                    >
                      前往省厅接收查验 (视图 B) <ArrowRightOutlined style={{ fontSize: 12 }} />
                    </button>
                  </>
                )}

                {currentView === 'provincial' && (
                  <>
                    {!provincialAdopted && (
                      <button
                        className="guide-btn-sub"
                        onClick={() => setInstructionModalOpen(true)}
                      >
                        <ThunderboltOutlined style={{ fontSize: 12 }} /> 模拟下达处置指令 (更新采纳)
                      </button>
                    )}
                    <button
                      className="guide-btn-primary"
                      onClick={() => setCurrentView('cityB')}
                    >
                      前往徐州通报信息查验 (视图 C) <ArrowRightOutlined style={{ fontSize: 12 }} />
                    </button>
                  </>
                )}

                {currentView === 'cityB' && (
                  <>
                    {!cityBHandled && (
                      <button
                        className="guide-btn-sub"
                        onClick={() => setCityBDispatchModalOpen(true)}
                      >
                        <ForwardOutlined style={{ fontSize: 12 }} /> 模拟转处置 (派发贾汪分局)
                      </button>
                    )}
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

              {/* 视角分段控制器 (Segmented Control) */}
              <div className="guide-segmented-wrapper no-drag">
                <div
                  className={`guide-segmented-item ${currentView === 'cityA' ? 'active' : ''}`}
                  onClick={() => setCurrentView('cityA')}
                >
                  地市A填报
                </div>
                <div
                  className={`guide-segmented-item ${currentView === 'provincial' ? 'active' : ''}`}
                  onClick={() => setCurrentView('provincial')}
                >
                  省厅接收
                </div>
                <div
                  className={`guide-segmented-item ${currentView === 'cityB' ? 'active' : ''}`}
                  onClick={() => setCurrentView('cityB')}
                >
                  地市B通报
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== 弹窗与抽屉 ==================== */}

      {/* 1. 详情查验抽屉 */}
      <Drawer
        title="跨地市协查与免审直通全链路详情"
        placement="right"
        width={560}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        <Alert
          message="跨地市通报与前置机摆渡认证"
          description="该记录由常州市公安局武进分局网安大队在互联网填报，指定涉事属地为徐州市贾汪区，系统自动完成省厅落库并异步向徐州市公安局数据库建立镜像通报。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div style={{ lineHeight: '28px', fontSize: 13 }}>
          <p><strong>舆情标题：</strong> 关于徐州某工业园区网络谣言线索协查</p>
          <p><strong>填报单位：</strong> 常州市公安局武进分局网安大队（民警：王建明）</p>
          <p><strong>涉事属地：</strong> 江苏省 / 徐州市 / 贾汪区</p>
          <p><strong>通报地市：</strong> <Tag color="orange">徐州市</Tag></p>
          <p><strong>报送目标：</strong> <Tag color="blue">市局支队</Tag> <Tag color="green">省厅总队</Tag></p>
          <p><strong>信息来源：</strong> 抖音平台短视频（ID: DY_9984102948）</p>
          <p><strong>预警等级：</strong> 3级 (较大)</p>
          <p><strong>初研意见：</strong> 经巡查核实，该视频反映徐州某工业园区环保与用工争议，跟帖有跨区域煽动趋势。建议省厅与徐州市局联合处置。</p>
          <p><strong>摆渡流水：</strong> [2026-10-08 17:28:01] 常州采集端 → 跨网前置机 → 省厅中心库入库 → 镜像路由同步至徐州市局通报库</p>
        </div>
      </Drawer>

      {/* 2. 省厅AI辅助研判弹窗 */}
      <Modal
        title="省厅AI大模型智能辅助研判"
        open={aiModalOpen}
        onOk={() => setAiModalOpen(false)}
        onCancel={() => setAiModalOpen(false)}
        width={500}
      >
        <div style={{ padding: '8px 0' }}>
          <Tag color="orange" style={{ marginBottom: 8 }}>风险等级：3级较大风险</Tag>
          <p style={{ color: '#4b5563', fontSize: 13 }}>
            <strong>【AI情感走势分析】：</strong>
            舆情首发于常州拍客，内容涉及徐州贾汪区工业园区。情感负面偏激占比 81.2%，有异地舆论倒灌本地的典型特征。
          </p>
          <p style={{ color: '#4b5563', fontSize: 13 }}>
            <strong>【AI处置建议】：</strong>
            由徐州贾汪分局网安大队落地核查涉事企业与现场警情，常州武进大队对发帖源头账号跟进核处，省厅总队统筹调度。
          </p>
        </div>
      </Modal>

      {/* 3. 省厅下达处置指令弹窗 */}
      <Modal
        title="省厅网安总队 - 下达处置指令"
        open={instructionModalOpen}
        confirmLoading={instructionSubmitting}
        onOk={handleDispatchInstruction}
        onCancel={() => setInstructionModalOpen(false)}
        okText="确认下发指令（确认采纳）"
      >
        <Form layout="vertical" initialValues={{ target: '常州市公安局武进大队 / 徐州市公安局贾汪大队', hours: 4 }}>
          <Form.Item label="协同指令接收单位" name="target">
            <Input disabled />
          </Form.Item>
          <Form.Item label="指令反馈时限 (小时)" name="hours">
            <Select>
              <Option value={2}>2 小时（紧急）</Option>
              <Option value={4}>4 小时（常规）</Option>
              <Option value={12}>12 小时</Option>
            </Select>
          </Form.Item>
          <Form.Item label="总队处置要求" initialValue="请常州查人、徐州查事，4小时内分别反馈源头与事发地核处专报。">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 4. 地市 B (徐州) 转本地处置弹窗 */}
      <Modal
        title="徐州市公安局网安支队 - 转本地派发处置"
        open={cityBDispatchModalOpen}
        confirmLoading={cityBDispatchLoading}
        onOk={handleCityBDispatch}
        onCancel={() => setCityBDispatchModalOpen(false)}
        okText="确认转派贾汪分局"
      >
        <Form layout="vertical" initialValues={{ dept: '徐州市公安局贾汪分局网安大队', limitHours: 2 }}>
          <Form.Item label="派发承办单位" name="dept">
            <Input disabled />
          </Form.Item>
          <Form.Item label="处置时效" name="limitHours">
            <Select>
              <Option value={2}>2 小时（紧急落地）</Option>
              <Option value={4}>4 小时</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="市局处置要求"
            initialValue="该舆情由常州市公安局跨市通报推送，请贾汪网安大队立即赶赴园区核实实情，会同属地派出所稳控并出具落地情况报告。"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScenarioDirectProvincial;
