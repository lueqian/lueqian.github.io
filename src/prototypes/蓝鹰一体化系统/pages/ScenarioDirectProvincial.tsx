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
  Table,
  Tag,
  Tabs,
  Badge,
  Modal,
  Drawer,
  Tooltip,
  Alert,
  Spin,
  Space,
  Pagination,
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
  BankOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  CheckCircleFilled,
  ExportOutlined,
  LockOutlined,
  UserSwitchOutlined,
  BellOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  SafetyCertificateFilled,
  AuditOutlined,
  UserAddOutlined,
  KeyOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// ==================== 跨网鉴权与演练人员接口 ====================

export interface SimulationUser {
  id: 'zhangsan' | 'lisi' | 'wangwu';
  name: string;
  phone: string;
  policeNo: string;
  role: string;
  org: string;
  hasReportPerm: boolean; // 是否拥有 eagle:gph:CrossTenant:report_to_provincial 权限
  provincialStatus: 'ACTIVATED' | 'PENDING_BOOTSTRAP' | 'REJECTED'; // 省厅内网账号状态
  endorserName?: string;
  endorserPhone?: string;
}

const DEFAULT_SIMULATION_USERS: Record<string, SimulationUser> = {
  zhangsan: {
    id: 'zhangsan',
    name: '张三',
    phone: '13800000001',
    policeNo: '045801',
    role: '支队值班长 (老民警/已在省厅建档)',
    org: '淮安市公安局网安支队',
    hasReportPerm: true,
    provincialStatus: 'ACTIVATED',
  },
  lisi: {
    id: 'lisi',
    name: '李四',
    phone: '13900000002',
    policeNo: '045892',
    role: '大队新警员 (已获直报培训授权)',
    org: '淮安市公安局清江浦分局网安大队',
    hasReportPerm: true,
    provincialStatus: 'PENDING_BOOTSTRAP', // 首次上报待背书
    endorserName: '张三 (支队值班长)',
    endorserPhone: '13800000001',
  },
  wangwu: {
    id: 'wangwu',
    name: '王五',
    phone: '13700000003',
    policeNo: '045999',
    role: '基层常规民警 (未获直报培训资质)',
    org: '淮安市公安局清江浦分局城南派出所',
    hasReportPerm: false, // 无权限
    provincialStatus: 'PENDING_BOOTSTRAP',
  },
};


// ==================== 字典数据定义 ====================

// 1. 地市 A (淮安市) 独立采购系统 - 本地辖区字典 (未勾选上报总队时仅展示本市)
const localHuaianDistricts = [
  { value: '清江浦区', label: '清江浦区 (本大队辖区)' },
  { value: '淮安区', label: '淮安区' },
  { value: '淮阴区', label: '淮阴区' },
  { value: '洪泽区', label: '洪泽区' },
  { value: '涟水县', label: '涟水县' },
  { value: '盱眙县', label: '盱眙县' },
  { value: '金湖县', label: '金湖县' },
  { value: '经济技术开发区', label: '经济技术开发区' },
  { value: '新城区', label: '新城区' },
];

// 2. 省厅总队统一下发标准地市字典 (勾选上报总队后彻底纯净切换为全省 13 地市)
const provincialCityList = [
  { value: '南京市', label: '南京市' },
  { value: '无锡市', label: '无锡市' },
  { value: '徐州市', label: '徐州市' },
  { value: '常州市', label: '常州市' },
  { value: '苏州市', label: '苏州市' },
  { value: '南通市', label: '南通市' },
  { value: '连云港市', label: '连云港市 (涉事目标地市)' },
  { value: '淮安市', label: '淮安市' },
  { value: '盐城市', label: '盐城市' },
  { value: '扬州市', label: '扬州市' },
  { value: '镇江市', label: '镇江市' },
  { value: '泰州市', label: '泰州市' },
  { value: '宿迁市', label: '宿迁市' },
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

  // 当前视角：'cityA' (地市 A 淮安填报端) | 'provincial' (省厅接收端) | 'cityB' (地市 B 连云港接收端)
  const [currentView, setCurrentView] = useState<ViewRole>('cityA');

  const { setCurrentStep, currentRoleView } = useScenarioContext();

  useEffect(() => {
    if (
      currentRoleView &&
      (currentRoleView === 'cityA' || currentRoleView === 'provincial' || currentRoleView === 'cityB')
    ) {
      setCurrentView(currentRoleView as ViewRole);
    }
  }, [currentRoleView]);

  useEffect(() => {
    if (currentView === 'cityA') {
      setCurrentStep(1);
    } else if (currentView === 'provincial') {
      setCurrentStep(2);
    } else if (currentView === 'cityB') {
      setCurrentStep(3);
    }
  }, [currentView, setCurrentStep]);

  // 地市 A 端子视图：'form' (手工上报表单) | 'list' (我的上报列表)
  const [cityASubTab, setCityASubTab] = useState<'form' | 'list'>('form');

  // 报送目标勾选状态：默认仅勾选支队，上报总队未勾选
  const [reportTargets, setReportTargets] = useState<string[]>(['branch']);
  const [syncingDictionary, setSyncingDictionary] = useState(false);

  // 提交状态与结果数据
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('');

  // 跨网直报人员身份与鉴权状态演练
  const [simUsers, setSimUsers] = useState<Record<string, SimulationUser>>(DEFAULT_SIMULATION_USERS);
  const [currentUserKey, setCurrentUserKey] = useState<'zhangsan' | 'lisi' | 'wangwu'>('lisi');
  const currentUser = simUsers[currentUserKey];

  // 驳回原因状态
  const [rejectReason, setRejectReason] = useState<string>('非网安在编直报专员');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // 鉴权失败排查诊断抽屉
  const [authFailureDrawerOpen, setAuthFailureDrawerOpen] = useState(false);

  // 省厅新人员开户通知状态
  const [hasNewAccountApplication, setHasNewAccountApplication] = useState(false);
  const [provincialNoticeOpen, setProvincialNoticeOpen] = useState(false);

  // GA网指令回执等待权限控制 (eagle:gph:Instruction:dispatch_receipt_wait)
  const [hasReceiptWaitPerm, setHasReceiptWaitPerm] = useState(true);
  const [instructionWaitState, setInstructionWaitState] = useState<'idle' | 'waiting' | 'success'>('idle');
  const [waitProgress, setWaitProgress] = useState(0);

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

  // 地市 B (连云港) 接收端状态
  const [cityBHandled, setCityBHandled] = useState(false);
  const [cityBDispatchModalOpen, setCityBDispatchModalOpen] = useState(false);
  const [cityBDispatchLoading, setCityBDispatchLoading] = useState(false);

  // 初始化预填表单数据 (地市 A 淮安清江浦上报涉连云港舆情)
  useEffect(() => {
    form.setFieldsValue({
      link: 'https://v.douyin.com/kP8a2L1/ 某海滨港区外运物流集聚区货车司机聚集讨要运费视频...',
      topic: '关于连云港某海滨港区物流集聚区网络舆情线索协查',
      eventTime: dayjs(),
      collector: `${currentUser.name} (警号: ${currentUser.policeNo})`,
      collectionUnit: currentUser.org,
      infoSource: '抖音短视频平台',
      author: '苏北沿海观察员',
      authorPlatformId: 'DY_8829103821',
      initialOpinion:
        '近日网安巡查发现某短视频平台流传关于连云港某海滨港区重点物流园区涉运费结算争议的不实舆情，跟帖评论有跨区域煽动聚集趋势。经核查涉事属地为连云港市，按免审直通机制提报总队并跨地市通报连云港市局协查处置。',
      level: '3级 (较大)',
      sentimentType: '涉警舆情',
      taskType: '日常上报',
      jurisdictionLocal: '清江浦区',
      jurisdictionProvince: undefined,
      notifyDistricts: ['清江浦区'],
      notifyCities: [],
    });
  }, [form, currentUser]);

  // 切换当前值班填报人员
  const handleUserChange = (userKey: 'zhangsan' | 'lisi' | 'wangwu') => {
    setCurrentUserKey(userKey);
    const u = simUsers[userKey];
    form.setFieldsValue({
      collector: `${u.name} (警号: ${u.policeNo})`,
      collectionUnit: u.org,
    });
    if (!u.hasReportPerm && reportTargets.includes('provincial')) {
      // 未获培训授权人员，自动收回总队上报
      setReportTargets(['branch']);
      message.warning(`已切换为【${u.name}】：未获直报省厅权限 (eagle:gph:CrossTenant:report_to_provincial)，已收回上报总队勾选`);
    } else {
      message.info(`已切换当前值班填报人员为：【${u.name}】(${u.role})`);
    }
  };

  // 处理报送目标勾选变动及字典切换
  const handleTargetChange = (checkedValues: string[]) => {
    if (!checkedValues.includes('branch')) {
      message.warning('系统规则约束：“上报支队”为基层必报通道，不可取消勾选');
      checkedValues = [...checkedValues, 'branch'];
    }

    const wasProvincialChecked = reportTargets.includes('provincial');
    const isProvincialChecked = checkedValues.includes('provincial');

    // 权限校验拦截：未授权人员禁止勾选
    if (isProvincialChecked && !currentUser.hasReportPerm) {
      message.error('当前用户未拥有 eagle:gph:CrossTenant:report_to_provincial 权限，仅限指定培训认证专员开放！');
      return;
    }

    setReportTargets(checkedValues);

    // 勾选【上报总队】时触发微交互，切换为全省标准字典（不默认级联选中连云港市）
    if (!wasProvincialChecked && isProvincialChecked) {
      setSyncingDictionary(true);
      message.loading({
        content: '已勾选上报总队，正在拉取省厅全省统一标准地市字典...',
        key: 'dictSync',
        duration: 0.4,
      });

      setTimeout(() => {
        setSyncingDictionary(false);
        message.success({
          content: '切换成功！',
          key: 'dictSync',
          duration: 2,
        });
        // 切换为省厅标准地市字典，由民警自主选择，无强制级联
        form.setFieldsValue({
          jurisdictionProvince: undefined,
          notifyCities: [],
        });
      }, 300);
    } else if (wasProvincialChecked && !isProvincialChecked) {
      // 取消勾选总队，回退为淮安本地字典
      form.setFieldsValue({
        jurisdictionLocal: '清江浦区',
        notifyDistricts: ['清江浦区'],
      });
    }
  };

  // 提交手工上报表单（含双手机号背书与硬丢弃拦截闭环）
  const handleSubmitReport = async () => {
    try {
      if (reportTargets.length === 0) {
        message.error('请至少选择一个报送目标');
        return;
      }

      const isReportingProvincial = reportTargets.includes('provincial');

      // 权限前置强校验
      if (isReportingProvincial && !currentUser.hasReportPerm) {
        message.error('当前人员未拥有直报权限 eagle:gph:CrossTenant:report_to_provincial！');
        return;
      }

      setSubmitting(true);

      // 分支 1：省厅账号已被超管驳回 -> 网闸硬丢弃数据！不落库省厅！
      if (isReportingProvincial && currentUser.provincialStatus === 'REJECTED') {
        message.loading({
          content: '正在跨网传输数据包... 省厅内网前置机正在进行手机号鉴权校验...',
          key: 'submittingKey',
          duration: 0.6,
        });

        setTimeout(() => {
          setSubmitting(false);
          message.error({
            content: '【省厅网关鉴权拒绝】数据包已被网闸硬丢弃！',
            key: 'submittingKey',
            duration: 4,
          });
          setAuthFailureDrawerOpen(true);
        }, 600);
        return;
      }

      // 分支 2：首次上报背书放行流程 (BOOTSTRAP 模式)
      const isBootstrap = isReportingProvincial && currentUser.provincialStatus === 'PENDING_BOOTSTRAP';

      message.loading({
        content: isBootstrap
          ? `首次直报：已自动关联同组值班长 [${currentUser.endorserName}] 提供信任背书放行...`
          : '正在校验免审直通策略并调用前置机跨网摆渡落库...',
        key: 'submittingKey',
        duration: 0.6,
      });

      setTimeout(() => {
        setSubmitting(false);
        setIsSubmitted(true);
        const nowStr = dayjs().format('YYYY-MM-DD HH:mm:ss');
        setSubmitTimestamp(nowStr);

        if (isBootstrap) {
          setHasNewAccountApplication(true);
          message.success({
            content: `上报成功！已由【${currentUser.endorserName}】信任背书放行，并已向省厅内网推送开户申请通知！`,
            key: 'submittingKey',
            duration: 4,
          });
        } else {
          message.success({
            content: '上报成功！省厅前置机独立手机号鉴权放行！',
            key: 'submittingKey',
            duration: 3,
          });
        }
        // 自动跳转到“监测预警-本地上报”
        setCityASubTab('list');
      }, 500);
    } catch {
      message.error('表单校验未通过，请核对信息');
    }
  };

  // 省厅超管一键开通李四账号
  const handleApproveLisiAccount = () => {
    setSimUsers((prev) => ({
      ...prev,
      lisi: {
        ...prev.lisi,
        provincialStatus: 'ACTIVATED',
      },
    }));
    setHasNewAccountApplication(false);
    setProvincialNoticeOpen(false);
    message.success('【省厅账号开通成功】已在省厅账号体系创建该用户并加入鉴权白名单！李四下次直报将免背书独立通行。');
  };

  // 省厅超管驳回李四账号
  const handleRejectLisiAccount = () => {
    setSimUsers((prev) => ({
      ...prev,
      lisi: {
        ...prev.lisi,
        provincialStatus: 'REJECTED',
      },
    }));
    setHasNewAccountApplication(false);
    setRejectModalOpen(false);
    setProvincialNoticeOpen(false);
    message.warning(`已驳回该人员直报开通申请（原因：${rejectReason}）。该人员后续直报将被省厅网关直接硬丢弃！`);
  };

  // 省厅端下达指令并转为【已采纳】（支持 GA网指令下达回执等待权限）
  const handleDispatchInstruction = () => {
    if (hasReceiptWaitPerm) {
      // 拥有 eagle:gph:Instruction:dispatch_receipt_wait 权限：同步阻塞等待回执
      setInstructionSubmitting(true);
      setInstructionWaitState('waiting');
      setWaitProgress(25);

      setTimeout(() => setWaitProgress(65), 500);
      setTimeout(() => setWaitProgress(95), 1100);
      setTimeout(() => {
        setWaitProgress(100);
        setInstructionWaitState('success');
        setTimeout(() => {
          setInstructionSubmitting(false);
          setInstructionWaitState('idle');
          setInstructionModalOpen(false);
          setProvincialAdopted(true);
          message.success('指令投递成功！已接收到淮安与连云港两地公安网前置机签收回执 (ACK)！');
        }, 600);
      }, 1600);
    } else {
      // 未拥有该权限：按照既往流程直接异步发送
      setInstructionSubmitting(true);
      setTimeout(() => {
        setInstructionSubmitting(false);
        setInstructionModalOpen(false);
        setProvincialAdopted(true);
        message.success('指令已异步下达成功（既往直接传送流程）！');
      }, 300);
    }
  };

  // 地市 B (连云港) 转为本地处置
  const handleCityBDispatch = () => {
    setCityBDispatchLoading(true);
    setTimeout(() => {
      setCityBDispatchLoading(false);
      setCityBDispatchModalOpen(false);
      setCityBHandled(true);
      message.success('已转为连云港本地处置工单，海滨港区分局网安大队已实时认领处置！');
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
      link: 'https://v.douyin.com/kP8a2L1/ 某海滨港区外运物流集聚区货车司机聚集讨要运费视频...',
      topic: '关于连云港某海滨港区物流集聚区网络舆情线索协查',
      eventTime: dayjs(),
      collector: '张华 (警号: 082163)',
      collectionUnit: '淮安市公安局清江浦分局网安大队',
      infoSource: '抖音短视频平台',
      author: '苏北沿海观察员',
      authorPlatformId: 'DY_8829103821',
      initialOpinion:
        '近日网安巡查发现某短视频平台流传关于连云港某海滨港区重点物流园区涉运费结算争议的不实舆情，跟帖评论有跨区域煽动聚集趋势。经核查涉事属地为连云港市，按免审直通机制提报总队并跨地市通报连云港市局协查处置。',
      level: '3级 (较大)',
      sentimentType: '涉警舆情',
      taskType: '日常上报',
      jurisdictionLocal: '清江浦区',
      jurisdictionProvince: undefined,
      notifyDistricts: ['清江浦区'],
      notifyCities: [],
    });
    message.info('演示动线已重置，当前已回到地市 A 淮安填报起点。');
  };

  // ==================== 视图 A：地市 A (淮安) 区县填报端 ====================
  const renderCityAView = () => (
    <div className={`county-view-wrapper ${cityASubTab === 'list' ? 'list-mode' : 'form-mode'}`}>
      {/* 顶部环境与身份条 */}
      <div className="scenario-env-header env-internet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <GlobalOutlined /> 互联网 · 淮安
          </span>
          <span className="scenario-env-title">
            淮安市局
          </span>
          <span className="scenario-env-subtitle">
            （当前值班填报人员：{currentUser.name} · {currentUser.role}）
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
            监测预警-本地上报 {isSubmitted && <Badge status="processing" style={{ marginLeft: 4 }} />}
          </Button>
        </Space>
      </div>

      {cityASubTab === 'form' ? (
        <div className="std-form-card">
          <div className="std-form-card-header">
            <h2 className="std-form-main-title">监测预警 - 手工上报（淮安市局）</h2>
            <p className="std-form-subtitle">免审直通省厅 · 跨安全网手机号鉴权与无感背书放行</p>
          </div>

          {/* 值班民警身份登记与跨网鉴权状态演练卡片 (符合 User UI Guidelines 规范) */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '16px 20px',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SolutionOutlined style={{ color: '#2563EB', fontSize: 16 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                  值班人员信息登记与跨网鉴权资质
                </span>
                <Tag color={currentUser.hasReportPerm ? 'blue' : 'default'} style={{ margin: 0, fontSize: 12 }}>
                  {currentUser.hasReportPerm ? '已授权直报权限' : '未授权直报权限'}
                </Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#64748B' }}>切换演练人员：</span>
                <Select
                  value={currentUserKey}
                  onChange={(val) => handleUserChange(val as 'zhangsan' | 'lisi' | 'wangwu')}
                  style={{ width: 280 }}
                  size="small"
                >
                  <Option value="lisi">
                    李四 (新警员 · 首次直报待背书)
                  </Option>
                  <Option value="zhangsan">
                    张三 (支队值班长 · 省厅已在籍)
                  </Option>
                  <Option value="wangwu">
                    王五 (基层常规民警 · 无直报权限)
                  </Option>
                </Select>
              </div>
            </div>

            <Row gutter={16} style={{ fontSize: 13, color: '#475569' }}>
              <Col span={6}>
                <div>• 当前登记民警：<strong style={{ color: '#0F172A' }}>{currentUser.name}</strong>（警号：{currentUser.policeNo}）</div>
              </Col>
              <Col span={6}>
                <div>• 鉴权手机号：<code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>{currentUser.phone}</code></div>
              </Col>
              <Col span={6}>
                <div>• 直报省厅权限：
                  <span style={{ color: currentUser.hasReportPerm ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                    {currentUser.hasReportPerm ? 'eagle:gph:CrossTenant:report_to_provincial' : '未赋权'}
                  </span>
                </div>
              </Col>
              <Col span={6}>
                <div>• 省厅账号状态：
                  {currentUser.provincialStatus === 'ACTIVATED' && (
                    <Tag color="success" style={{ margin: 0 }}>已在籍放行 (独立鉴权)</Tag>
                  )}
                  {currentUser.provincialStatus === 'PENDING_BOOTSTRAP' && (
                    <Tag color="processing" style={{ margin: 0 }}>待首报背书开通</Tag>
                  )}
                  {currentUser.provincialStatus === 'REJECTED' && (
                    <Tag color="error" style={{ margin: 0 }}>省厅已驳回 (丢弃数据)</Tag>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="std-top-label-form"
            requiredMark={(label, { required }) => (
              <span>
                {required && <span style={{ color: '#EF4444', marginRight: 4, fontWeight: 700 }}>*</span>}
                {label}
              </span>
            )}
          >
            {/* 1. 报送目标 [col-12 全宽] - 纯净呈现，杜绝虚线框与彩色底色装饰 */}
            <Annotated
              pin={1}
              title="报送目标与跨网手机号鉴权"
              note="拥有 eagle:gph:CrossTenant:report_to_provincial 权限方可勾选总队；新警员首次上报自动由值班长张三提供信任背书并推送省厅开通。"
              tag="手机号鉴权"
              placement="top-right"
            >
              <Form.Item label="报送目标" required style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
                  <Checkbox.Group
                    value={reportTargets}
                    onChange={(vals) => handleTargetChange(vals as string[])}
                  >
                    <Checkbox value="branch" disabled>
                      <Tooltip title="地市 A (淮安) 基层上报默认必报本市支队（系统规则锁定）">
                        <span>上报支队（锁定）</span>
                      </Tooltip>
                    </Checkbox>
                    <Checkbox
                      value="provincial"
                      disabled={!currentUser.hasReportPerm}
                      style={{ marginLeft: 16 }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: currentUser.hasReportPerm ? '#2563EB' : '#94A3B8',
                        }}
                      >
                        上报总队
                      </span>
                    </Checkbox>
                  </Checkbox.Group>

                  {!currentUser.hasReportPerm && (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '3px 10px',
                        fontSize: 12,
                        background: '#F1F5F9',
                        color: '#64748B',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <LockOutlined style={{ marginRight: 4 }} />
                      仅限通过实训认证并持有 eagle:gph:CrossTenant:report_to_provincial 权限人员开放
                    </span>
                  )}

                  {reportTargets.includes('provincial') && (
                    <span
                      style={{
                        borderRadius: 4,
                        padding: '3px 10px',
                        fontSize: 13,
                        fontWeight: 500,
                        background: '#EFF6FF',
                        color: '#2563EB',
                        border: '1px solid #BFDBFE',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      已激活直通省厅通道 · 免市局审批
                    </span>
                  )}

                  {syncingDictionary && (
                    <span style={{ whiteSpace: 'nowrap', fontSize: 13, color: '#64748B' }}>
                      <Spin size="small" /> 正在拉取省厅全省统一标准地市字典...
                    </span>
                  )}
                </div>
              </Form.Item>

              {/* 核心新增：跨网手机号鉴权凭证反馈栏 (仅在勾选上报总队时呈现) */}
              {reportTargets.includes('provincial') && (
                <div style={{ marginBottom: 20 }}>
                  {/* 情况 A：在籍已激活独立鉴权 (如张三) */}
                  {currentUser.provincialStatus === 'ACTIVATED' && (
                    <div
                      style={{
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: 6,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        color: '#1E40AF',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SafetyCertificateFilled style={{ color: '#2563EB', fontSize: 16 }} />
                        <span>
                          <strong>跨网鉴权通道就绪</strong>：上报人手机号 <code>{currentUser.phone}</code> 已在省厅内网账号体系备案，前置网闸将独立校验放行。
                        </span>
                      </div>
                      <Tag color="blue" style={{ margin: 0 }}>独立鉴权通行</Tag>
                    </div>
                  )}

                  {/* 情况 B：新人员首次直报，信任背书自举 (如李四首次上报) */}
                  {currentUser.provincialStatus === 'PENDING_BOOTSTRAP' && (
                    <div
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: 6,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        color: '#166534',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircleFilled style={{ color: '#16A34A', fontSize: 16 }} />
                        <span>
                          <strong>首次直报信任背书已激活</strong>：检测到您首次直报省厅，系统已自动关联同组值班长 <strong>[{currentUser.endorserName}]</strong> 手机号 <code>{currentUser.endorserPhone}</code> 协同传输放行，并自动向省厅推送开户通知。
                        </span>
                      </div>
                      <Tag color="success" style={{ margin: 0 }}>无感信任背书放行</Tag>
                    </div>
                  )}

                  {/* 情况 C：省厅超管驳回，网闸硬丢弃预警 (如李四被驳回) */}
                  {currentUser.provincialStatus === 'REJECTED' && (
                    <div
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: 6,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        color: '#991B1B',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CloseCircleOutlined style={{ color: '#DC2626', fontSize: 16 }} />
                        <span>
                          <strong>跨网鉴权受阻</strong>：上报人手机号 <code>{currentUser.phone}</code> 的省厅开户已被超管驳回（原因：{rejectReason}）。继续提交将被省厅网闸直接丢弃！
                        </span>
                      </div>
                      <Tag color="error" style={{ margin: 0 }}>鉴权拦截预警</Tag>
                    </div>
                  )}
                </div>
              )}
            </Annotated>

            {/* 2. 舆情链接 [col-12 全宽] */}
            <Form.Item label="舆情链接" name="link" rules={[{ required: true, message: '请输入舆情链接' }]}>
              <Input placeholder="请输入待排查上报的社交媒体链接或视频地址" />
            </Form.Item>

            {/* 3. 信息主题 [col-12 全宽] */}
            <Form.Item label="信息主题" name="topic" rules={[{ required: true, message: '请输入信息主题' }]}>
              <Input placeholder="关于连云港某海滨港区物流集聚区网络舆情线索协查" />
            </Form.Item>

            {/* 4. 涉事属地 (col-6) + 通报地市/区县 (col-6) - 双列等分对称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="涉事属地"
                  required
                  tooltip={
                    reportTargets.includes('provincial')
                      ? '已切换为省厅统一下发标准地市字典（全省 13 地市）'
                      : '当前仅勾选支队，展示淮安本地市级区县字典'
                  }
                >
                  {reportTargets.includes('provincial') ? (
                    <Form.Item name="jurisdictionProvince" noStyle>
                      <Select placeholder="选择全省标准属地（已载入江苏省全量 13 地市字典）" style={{ width: '100%' }}>
                        {provincialCityList.map((c) => (
                          <Option key={c.value} value={c.value}>
                            {c.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item name="jurisdictionLocal" noStyle>
                      <Select placeholder="选择本地淮安辖区" style={{ width: '100%' }}>
                        {localHuaianDistricts.map((d) => (
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
                {reportTargets.includes('provincial') ? (
                  <Annotated
                    pin={2}
                    title="通报地市与名称匹配"
                    note="依据地市名称（连云港市）自动匹配对应地市租户，实现跨租户跨地市推送。"
                    tag="名称匹配"
                    placement="top-right"
                  >
                    <Form.Item
                      label="通报地市"
                      tooltip="已切换为省厅 13 地市多选：选择目标地市将基于名称匹配引擎触发跨租户镜像推送"
                    >
                      <Form.Item name="notifyCities" noStyle>
                        <Select
                          mode="multiple"
                          placeholder="请选择跨地市通报目标（全省 13 地市）"
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
                  </Annotated>
                ) : (
                  <Form.Item
                    label="通报区县"
                    tooltip="仅上报支队时限制为本地淮安区县内部流转"
                  >
                    <Form.Item name="notifyDistricts" noStyle>
                      <Select
                        mode="multiple"
                        placeholder="请选择通报区县（淮安本地辖区）"
                        style={{ width: '100%' }}
                      >
                        {localHuaianDistricts.map((d) => (
                          <Option key={d.value} value={d.value}>
                            {d.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form.Item>
                )}
              </Col>
            </Row>

            {/* 5. 发生时间 (col-6) + 采集单位 (col-6 只读) - 双列等分对称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="发生时间" name="eventTime">
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="采集单位" name="collectionUnit">
                  <div className="std-readonly-field">
                    <LockOutlined className="readonly-lock-icon" />
                    <span className="readonly-text">{form.getFieldValue('collectionUnit') || '淮安市公安局清江浦分局网安大队'}</span>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* 6. 采集人 (col-6 只读) + 信息来源 (col-6) - 双列等分对称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="采集人" name="collector">
                  <div className="std-readonly-field">
                    <LockOutlined className="readonly-lock-icon" />
                    <span className="readonly-text">{form.getFieldValue('collector') || '张华 (警号: 082163)'}</span>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="信息来源" name="infoSource">
                  <Input placeholder="如：抖音短视频平台、微博、微信等" />
                </Form.Item>
              </Col>
            </Row>

            {/* 7. 作者平台ID (col-6) + 预警等级 (col-6) - 双列等分对称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="作者平台ID" name="authorPlatformId">
                  <Input placeholder="作者平台账号或数字ID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="预警等级" name="level">
                  <Select>
                    <Option value="1级 (微弱)">1级 (微弱)</Option>
                    <Option value="2级 (一般)">2级 (一般)</Option>
                    <Option value="3级 (较大)">3级 (较大)</Option>
                    <Option value="4级 (重大)">4级 (重大)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 8. 舆情类型 (col-6) + 任务类型 (col-6) - 双列等分对称 */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="舆情类型" name="sentimentType">
                  <Select>
                    <Option value="涉警舆情">涉警舆情</Option>
                    <Option value="社会民生">社会民生</Option>
                    <Option value="政治安全">政治安全</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="任务类型" name="taskType">
                  <Select>
                    <Option value="日常上报">日常上报</Option>
                    <Option value="跨市协查">跨市协查</Option>
                    <Option value="紧急上报">紧急上报</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* 9. 初研意见 [col-12 全宽] - 多行文本框最小高度 96px */}
            <Form.Item label="初研意见" name="initialOpinion" rules={[{ required: true, message: '请输入初研意见' }]}>
              <TextArea rows={4} placeholder="请录入清江浦大队的初步核查与跨市协查建议" />
            </Form.Item>

            {/* 10. 核心操作按钮区 - margin-top: 32px，右对齐排列，严禁居中浮动 */}
            <div className="std-form-actions-bar">
              <Button className="std-btn-reset" onClick={() => form.resetFields()}>
                重置表单
              </Button>

              <Annotated
                pin={3}
                title="免审直通提交按钮"
                note="针对独立采购系统基层单位，绕过市局审批环节，单向安全摆渡直通同步到省厅内网系统库。"
                tag="免审直通"
                placement="top-left"
              >
                <Button
                  type="primary"
                  className="std-btn-primary"
                  icon={<SendOutlined />}
                  loading={submitting}
                  onClick={handleSubmitReport}
                >
                  确认上报
                </Button>
              </Annotated>
            </div>
          </Form>
        </div>
      ) : (
        /* 地市 A 端：监测预警-本地上报 */
        <Card
          title="监测预警 - 本地上报（淮安市局）"
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
                title: '关于连云港某海滨港区物流集聚区网络舆情线索协查',
                time: submitTimestamp || '2026-10-08 17:28:00',
                targets: reportTargets,
                status: isSubmitted ? '已同步省厅并推送连云港' : '草稿待报',
                isCurrent: isSubmitted,
                scope: reportTargets.includes('provincial') ? '全省标准 (连云港市)' : '本地 (淮安市清江浦区)',
                notifyCity: '连云港市',
              },
              {
                id: 'r-02',
                title: '某货运车辆违规上路致清江浦区村民围观舆情巡查',
                time: '2026-10-07 14:20:11',
                targets: ['branch'],
                status: '淮安支队已接收',
                isCurrent: false,
                scope: '本地 (淮安市清江浦区)',
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
                width: 170,
              },
              {
                title: '报送目标',
                dataIndex: 'targets',
                width: 220,
                render: (targets: string[]) => (
                  <Space>
                    <Tag color="blue">已报支队</Tag>
                    {targets.includes('provincial') && <Tag color="green">已报总队 (免审直通)</Tag>}
                  </Space>
                ),
              },
              {
                title: '跨市通报地市',
                dataIndex: 'notifyCity',
                width: 140,
                render: (city: string) => (city !== '无' ? <Tag color="orange">{city}</Tag> : '无'),
              },
              {
                title: '流转状态',
                dataIndex: 'status',
                width: 140,
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
                width: 200,
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

  // ==================== 视图 B：省厅总队内网端页面 ====================
  const renderProvincialView = () => (
    <div className="provincial-view-wrapper">
      {/* 顶部公安内网环境标识与协同工作台 */}
      <div className="scenario-env-header env-intranet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <SafetyCertificateOutlined /> 公安内网 (GA网) · 省厅
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            江苏省公安厅网安总队
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#bae0ff' }}>
            （值班研判调度岗 · 超管权限）
          </span>
        </div>
        <Space size={12}>
          {/* GA网指令回执等待权限控制演练小工具 */}
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 4,
              padding: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#E0F2FE',
            }}
          >
            <KeyOutlined />
            <span>GA网指令下达回执等待:</span>
            <Button
              size="small"
              type={hasReceiptWaitPerm ? 'primary' : 'default'}
              style={{
                fontSize: 11,
                height: 22,
                padding: '0 6px',
                background: hasReceiptWaitPerm ? '#16A34A' : '#475569',
                borderColor: 'transparent',
              }}
              onClick={() => {
                setHasReceiptWaitPerm(!hasReceiptWaitPerm);
                message.info(
                  !hasReceiptWaitPerm
                    ? '已赋予当前账号 eagle:gph:Instruction:dispatch_receipt_wait 权限（下发指令时将同步等待网闸回执）'
                    : '已取消该权限（下发指令将按既往流程直接异步发送，不等待回执）'
                );
              }}
            >
              {hasReceiptWaitPerm ? '已拥有 (等待回执)' : '未拥有 (直接传送)'}
            </Button>
          </div>

          {/* 跨网直报新账号开通待办通知入口 */}
          <Badge count={hasNewAccountApplication ? 1 : 0} offset={[-2, 4]}>
            <Button
              size="small"
              icon={<BellOutlined />}
              style={{
                background: hasNewAccountApplication ? '#EF4444' : 'rgba(255,255,255,0.18)',
                color: '#fff',
                borderColor: 'transparent',
                fontWeight: hasNewAccountApplication ? 600 : 400,
              }}
              onClick={() => setProvincialNoticeOpen(true)}
            >
              开户待办 {hasNewAccountApplication && '(新申请)'}
            </Button>
          </Badge>

          <Button
            size="small"
            onClick={() => setCurrentView('cityA')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 切回淮安填报 (视图 A)
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => setCurrentView('cityB')}
          >
            查看连云港通报 (视图 C) →
          </Button>
        </Space>
      </div>

      {/* 状态通知横幅：联动展示新人员开户待办 */}
      {hasNewAccountApplication && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <strong>【跨网直报新账号开户待办】：</strong>
                淮安市局新民警 <strong>李四 (13900000002)</strong> 首次提报舆情，已由值班长 <strong>张三 (13800000001)</strong> 背书跨网放行入库。请研判是否开通其在省厅账号体系的同手机号账号。
              </span>
              <Space>
                <Button size="small" type="primary" onClick={() => setProvincialNoticeOpen(true)}>
                  立即审批开通
                </Button>
              </Space>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 12, border: '1px solid #FCD34D' }}
        />
      )}

      {/* 状态通知横幅 */}
      <Alert
        message={
          provincialAdopted
            ? '总队处置指令已下达：该直报舆情已标记为【已采纳】，并计入总队对淮安市局的采纳考核分值。'
            : isSubmitted
            ? '跨网摆渡落库成功：省厅内网已实时接收淮安市局直报舆情，处于【未采纳 / 待研判】状态，请研判后下达处置指令。'
            : '提示：淮安市局尚未点击【确认上报】，当前展示省厅内网历史直报数据底册。'
        }
        type={provincialAdopted ? 'success' : isSubmitted ? 'info' : 'warning'}
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 1. 顶部检索与视图切换栏 (单行平铺自适应) */}
      <div className="stream-filter-container">
        <div className="stream-filter-top-row">
          <div className="stream-filter-field">
            <span className="stream-filter-label">内容搜索</span>
            <Input
              placeholder="可输入标题/正文/作者/ID"
              style={{ width: 170 }}
              defaultValue="连云港某海滨港区"
              allowClear
            />
          </div>

          <div className="stream-filter-field">
            <span className="stream-filter-label">发布时间</span>
            <DatePicker.RangePicker style={{ width: 210 }} />
          </div>

          <div className="stream-filter-field">
            <span className="stream-filter-label">接收时间</span>
            <DatePicker.RangePicker
              showTime
              style={{ width: 250 }}
              defaultValue={[
                dayjs('2026-10-08 00:00:00'),
                dayjs('2026-10-09 23:59:59'),
              ]}
            />
          </div>

          <Space size={8} style={{ flexShrink: 0 }}>
            <Button size="small" type="primary">查询</Button>
            <Button size="small">重置</Button>
          </Space>

          <Space size={8} style={{ flexShrink: 0, marginLeft: 'auto' }}>
            <Button size="small" onClick={handleResetDemo}>重置演示数据</Button>
            {!isSubmitted && (
              <Button
                size="small"
                type="dashed"
                style={{ color: '#1677ff' }}
                onClick={() => {
                  setIsSubmitted(true);
                  setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
                  message.success('已模拟触发淮安市局跨网直通省厅落库！');
                }}
              >
                模拟淮安直推
              </Button>
            )}

            {/* 右侧视图切换按钮组 */}
            <div className="stream-view-switcher" style={{ flexShrink: 0 }}>
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
          </Space>
        </div>
      </div>

      {/* 2. 模块二级 Tab 栏 */}
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
        {/* 卡片 1：本次演示重点 - 淮安免审直通推送连云港物流集聚区协查记录 */}
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
              淮安清江浦分局·张华
            </span>
            <span>ID 3766282728521547</span>
            <span>
              上报来源：淮安市公安局清江浦分局网安大队
            </span>
            <span>
              <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 4 }} />
              涉事属地：江苏省 / 连云港市
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
            #关于连云港某海滨港区物流集聚区网络舆情线索协查。监测发现网民在短视频平台发布涉及连云港某重点物流园区涉运费结算争议信息，跟帖评论已出现跨地市煽动聚集苗头。淮安清江浦网安大队完成初研后，按免审直通机制提报省厅总队，并提请抄送连云港市局协查处置。
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
                  监测发现网民通过短视频发布连云港某物流园区涉运费结算非访言论，涉及跨地市关联，淮安属地初研已固定证据并提请省厅统筹处置。
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
                  <span style={{ fontWeight: 600, color: '#c2410c' }}>【淮安初研】：</span>
                  该线索涉及跨地市煽动，建议由省厅总队统筹下达核查指令，由目标地连云港市公安局属地核查落地人，两地协同就地化解。
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
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, alignItems: 'center' }}>
            <Annotated
              pin={4}
              title="舆情来源标签规范"
              note="来源按当前默认效果实现即可，暂不进行独立开发，即第一阶段开发完成后，跨地市上报的信息可能显示为“来源：淮安市局-张三 2026-10-10 10:41:20上报”。"
              tag="来源规范"
              placement="top-left"
            >
              <Tag color="blue" style={{ borderRadius: 3 }}>来源: 手工上报-淮安市局</Tag>
            </Annotated>
            <Tag color="purple" style={{ borderRadius: 3 }}>直报总队</Tag>
            <Tag color="geekblue" style={{ borderRadius: 3 }}>连云港市</Tag>
            <Tag color="volcano" style={{ borderRadius: 3 }}>涉稳线索</Tag>
          </div>

          {/* 6. 底部操作栏 - 右下角并排呈现一键复制、AI辅助研判、下达处置指令 */}
          <div className="stream-card-actions-bar" style={{ justifyContent: 'flex-end' }}>
            <Space size={10} align="center">
              <Button
                type="default"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制舆情标题与正文')}
              >
                一键复制
              </Button>
              <Button
                type="default"
                size="small"
                icon={<RobotOutlined />}
                onClick={() => setAiModalOpen(true)}
              >
                AI辅助研判
              </Button>

              {/* 核心采纳与指令下达操作 (挂载 Pin 5 批注) */}
              {!provincialAdopted ? (
                <Annotated
                  pin={5}
                  title="省厅区县上报与采纳"
                  note="省厅在监测预警-区县上报中接收，下发指令后状态更新为已采纳，计入考核。"
                  tag="省厅接收"
                  placement="top-right"
                >
                  <Button
                    type="primary"
                    size="small"
                    icon={<ThunderboltOutlined />}
                    onClick={() => setInstructionModalOpen(true)}
                    style={{ minWidth: 150 }}
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
                    前往连云港通报查验 <ArrowRightOutlined />
                  </Button>
                </Space>
              )}
            </Space>
          </div>
        </div>

        {/* 卡片 2：历史直报记录 */}
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
            <span style={{ color: '#1e293b', fontWeight: 600 }}>南京玄武分局·刘警官</span>
            <span>ID 3766282710492811</span>
            <span>上报来源：南京市公安局玄武分局网安大队</span>
            <span><EnvironmentOutlined style={{ color: '#1677ff' }} /> 江苏省 / 南京市 / 玄武区</span>
            <span><ClockCircleOutlined /> 2026-10-08 16:30:15</span>
          </div>
          <div className="stream-card-title-content">
            #南京玄武区某重点商圈人员聚集网络传言核查。属地民警已就地做好情况排查与政策宣贯，舆情平稳可控。
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            <Tag color="blue">来源: 手工上报-南京市局</Tag>
            <Tag color="cyan">南京市</Tag>
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

  // ==================== 视图 C：地市 B (连云港) 用户接收端 ====================
  const renderCityBView = () => (
    <div className="city-b-view-wrapper">
      {/* 顶部地市 B 环境条 */}
      <div className="scenario-env-header env-city-b">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 局域网 · 连云港
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            连云港市局
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （当前账号：陈队长）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('cityA')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回淮安填报 (视图 A)
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentView('provincial')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            返回省厅总队 (视图 B)
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
              <Tag color="cyan">属地海滨港区网安连线中</Tag>
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
                  pin={6}
                  title="地市 B 通报信息镜像"
                  note="连云港市局在通报信息板块接收异地通报工单，支持本地闭环流转。"
                  tag="异地镜像"
                  placement="top-left"
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
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
          tableLayout="fixed"
          rowKey="id"
          rowClassName={(record) => (record.id === 'cityB-01' ? 'provincial-highlight-row' : '')}
          dataSource={[
            {
              id: 'cityB-01',
              title: '关于连云港某海滨港区物流集聚区网络舆情线索协查',
              source: '淮安市局',
              jurisdiction: '连云港市',
              time: submitTimestamp ? `${submitTimestamp} (刚刚)` : '刚刚 (17:28:12)',
              status: cityBHandled ? '已处置' : '待处理',
              isCurrent: true,
            },
            {
              id: 'cityB-02',
              title: '南京市公安局通报涉连云港某货运车辆在宁违章引争议信息',
              source: '南京市局',
              jurisdiction: '连云港市 / 海州区',
              time: '2026-10-08 14:10:00',
              status: '已处置',
              isCurrent: false,
            },
            {
              id: 'cityB-03',
              title: '徐州市公安局转来涉连云港网络直播间不当言论协查函',
              source: '徐州市局',
              jurisdiction: '连云港市 / 连云区',
              time: '2026-10-07 18:32:00',
              status: '已处置',
              isCurrent: false,
            },
          ]}
          columns={[
            {
              title: '舆情标题',
              dataIndex: 'title',
              ellipsis: true,
              render: (text, record) => (
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                    <Tag className="tag-remote-notice" style={{ flexShrink: 0, marginRight: 8 }}>异地通报</Tag>
                    <span
                      style={{
                        fontWeight: 600,
                        color: '#1f2937',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        minWidth: 0,
                      }}
                      title={text}
                    >
                      {text}
                    </span>
                  </div>
                  {record.isCurrent && (
                    <div
                      style={{
                        fontSize: 11,
                        color: '#fa8c16',
                        marginTop: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title="淮安市公安局跨市镜像同步 · 涉及连云港属地协查"
                    >
                      ⚡ 淮安市公安局跨市镜像同步 · 涉及连云港属地协查
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: '通报来源',
              dataIndex: 'source',
              width: 120,
            },
            {
              title: '涉事属地',
              dataIndex: 'jurisdiction',
              width: 140,
            },
            {
              title: '通报时间',
              dataIndex: 'time',
              width: 170,
            },
            {
              title: '操作',
              key: 'action',
              width: 90,
              render: () => (
                <Button
                  type="link"
                  size="small"
                  icon={<FileSearchOutlined />}
                  onClick={() => setDetailDrawerOpen(true)}
                  style={{ padding: 0 }}
                >
                  查看详情
                </Button>
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

      {/* ==================== 弹窗与抽屉 ==================== */}

      {/* 1. 地市 B 端通报信息详情查验抽屉 */}
      <Drawer
        title="通报信息详情"
        placement="right"
        width={560}
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
      >
        <div style={{ lineHeight: '28px', fontSize: 13, padding: '8px 0' }}>
          <p><strong>舆情标题：</strong> 关于连云港某海滨港区物流集聚区网络舆情线索协查</p>
          <p><strong>通报来源：</strong> 淮安市局</p>
          <p><strong>涉事属地：</strong> 江苏省 / 连云港市</p>
          <p><strong>通报时间：</strong> {submitTimestamp ? `${submitTimestamp} (刚刚)` : '刚刚 (17:28:12)'}</p>
          <p><strong>信息来源：</strong> 抖音平台短视频（ID: DY_8829103821）</p>
          <p><strong>预警等级：</strong> <Tag color="orange">3级 (较大)</Tag></p>
          <p><strong>初研意见：</strong> 经巡查核实，该视频反映连云港某物流园区运费结算争议，跟帖有跨区域煽动趋势。建议连云港市局联合属地分局核查处置。</p>
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
            舆情首发于淮安拍客，内容涉及连云港海滨港区物流集聚区。情感负面偏激占比 81.2%，有异地舆论倒灌本地的典型特征。
          </p>
          <p style={{ color: '#4b5563', fontSize: 13 }}>
            <strong>【AI处置建议】：</strong>
            由连云港市公安局属地海滨港区分局网安大队落地核查涉事企业与现场警情，淮安清江浦大队对发帖源头账号跟进核处，省厅总队统筹调度。
          </p>
        </div>
      </Modal>

      {/* 3. 省厅下达处置指令弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>省厅网安总队 - 下达处置指令</span>
            {hasReceiptWaitPerm && (
              <Tag color="green" style={{ fontSize: 11 }}>
                已激活GA网回执等待 (eagle:gph:Instruction:dispatch_receipt_wait)
              </Tag>
            )}
          </div>
        }
        open={instructionModalOpen}
        confirmLoading={instructionSubmitting}
        onOk={handleDispatchInstruction}
        onCancel={() => {
          if (!instructionSubmitting) setInstructionModalOpen(false);
        }}
        okText={
          instructionSubmitting
            ? '正在等待回执...'
            : hasReceiptWaitPerm
            ? '确认下发指令（等待回执）'
            : '确认下发指令（直接传送）'
        }
        okButtonProps={{ disabled: instructionSubmitting }}
      >
        {instructionWaitState === 'waiting' ? (
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
              正在向淮安市局与连云港市局前置机投递指令...
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748B' }}>
              当前处于公安内网 (GA网)，正在等待接收端网闸签收回执 (ACK)...
            </div>
            <div style={{ width: '85%', margin: '20px auto 0' }}>
              <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${waitProgress}%`,
                    height: '100%',
                    background: '#2563EB',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                <span>指令打包出网闸</span>
                <span>目标前置机解包</span>
                <span>回传签收回执</span>
              </div>
            </div>
          </div>
        ) : instructionWaitState === 'success' ? (
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <CheckCircleFilled style={{ fontSize: 44, color: '#16A34A' }} />
            <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: '#166534' }}>
              指令投递成功！已接收到两地公安网签收回执 (ACK: 0x8F21)
            </div>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 6 }}>
              舆情已转为【已采纳】，淮安与连云港两地值班岗位已实时生成工单。
            </p>
          </div>
        ) : (
          <Form layout="vertical" initialValues={{ target: '淮安市公安局清江浦大队 / 连云港市公安局', hours: 4 }}>
            {!hasReceiptWaitPerm && (
              <Alert
                message="提示：当前账号未开启 GA网指令回执同步等待权限，下发后将按既往流程直接异步发送，不阻塞等待回执。"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
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
            <Form.Item label="总队处置要求" initialValue="请淮安查人、连云港查事，4小时内分别反馈源头与事发地核处专报。">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 4. 地市 B (连云港) 转本地处置弹窗 */}
      <Modal
        title="连云港市公安局网安支队 - 转本地派发处置"
        open={cityBDispatchModalOpen}
        confirmLoading={cityBDispatchLoading}
        onOk={handleCityBDispatch}
        onCancel={() => setCityBDispatchModalOpen(false)}
        okText="确认转派海滨港区分局"
      >
        <Form layout="vertical" initialValues={{ dept: '连云港市公安局海滨港区分局网安大队', limitHours: 2 }}>
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
            initialValue="该舆情由淮安市公安局跨市通报推送，请海滨港区网安大队立即赶赴现场核实实情，会同港区派出所稳控并出具落地情况报告。"
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 5. 省厅网安总队 - 跨网直报人员开户审批弹窗 (核心闭环) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserAddOutlined style={{ color: '#2563EB' }} />
            <span>省厅网安总队 - 跨网直报新账号开户审批</span>
          </div>
        }
        open={provincialNoticeOpen}
        onCancel={() => setProvincialNoticeOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setProvincialNoticeOpen(false)}>
            稍后处理
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => {
              setRejectModalOpen(true);
            }}
          >
            拒绝驳回开户
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleApproveLisiAccount}
          >
            同意开通并授权
          </Button>,
        ]}
        width={560}
      >
        <Alert
          message="首报信任背书已放行：本次舆情数据已由在籍值班长 [张三] 手机号背书成功放行并落库省厅。现申请在省厅内网账号体系中建立对应账号。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '16px 20px', border: '1px solid #E2E8F0' }}>
          <Row gutter={[16, 12]} style={{ fontSize: 13 }}>
            <Col span={12}>
              <div>• 申报民警姓名：<strong style={{ color: '#0F172A' }}>李四</strong></div>
            </Col>
            <Col span={12}>
              <div>• 民警警号：<code>045892</code></div>
            </Col>
            <Col span={12}>
              <div>• 申报认证手机号：<strong style={{ color: '#2563EB' }}>13900000002</strong></div>
            </Col>
            <Col span={12}>
              <div>• 来源单位：<span>淮安市局清江浦网安大队</span></div>
            </Col>
            <Col span={12}>
              <div>• 信任背书人：<strong style={{ color: '#16A34A' }}>张三</strong> (13800000001)</div>
            </Col>
            <Col span={12}>
              <div>• 背书人岗位：<span>淮安市公安局网安支队值班长</span></div>
            </Col>
            <Col span={24}>
              <div>• 关联直报线索：<span>关于连云港某海滨港区物流集聚区网络舆情线索协查</span></div>
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
          <strong>审批规则说明：</strong>
          <br />
          1. <strong>同意开通</strong>：系统将自动在省厅账号体系创建该手机号账号，并赋予直报白名单；李四下次上报将实现免背书独立通行。
          <br />
          2. <strong>拒绝驳回</strong>：李四下次上报将无法再享受信任背书，跨网数据将被省厅网关直接丢弃。
        </div>
      </Modal>

      {/* 6. 省厅超管驳回原因输入 Modal */}
      <Modal
        title="驳回直报人员开户申请"
        open={rejectModalOpen}
        onOk={handleRejectLisiAccount}
        onCancel={() => setRejectModalOpen(false)}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <p style={{ fontSize: 13, color: '#475569' }}>
          驳回后，该人员（李四 13900000002）后续直报省厅的数据将被省厅网闸直接丢弃！
        </p>
        <Form layout="vertical">
          <Form.Item label="驳回原因说明" required>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因，如：非网安在编直报专员"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 7. 地市端：省厅网闸鉴权失败硬丢弃排查抽屉 (核心异常闭环) */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#DC2626' }}>
            <CloseCircleOutlined />
            <span>省厅数据接收失败警告 · 跨安全网手机号鉴权拦截</span>
          </div>
        }
        open={authFailureDrawerOpen}
        onClose={() => setAuthFailureDrawerOpen(false)}
        width={520}
      >
        <Alert
          message="数据已被物理丢弃"
          description="本次跨网舆情上报数据已被省厅内网安全隔离网闸前置机直接丢弃，未进入省厅任何业务流转数据库。"
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
          <h4 style={{ color: '#9F1239', margin: '0 0 12px', fontSize: 14 }}>拦截安全审计诊断详情</h4>
          <Row gutter={[12, 10]} style={{ fontSize: 13, color: '#4C0519' }}>
            <Col span={8}>• 拦截网关：</Col>
            <Col span={16}><code>省厅内网安全隔离前置网闸 (SecGate-01)</code></Col>
            <Col span={8}>• 提交上报人：</Col>
            <Col span={16}><strong>{currentUser.name}</strong>（警号：{currentUser.policeNo}）</Col>
            <Col span={8}>• 传输鉴权手机号：</Col>
            <Col span={16}><strong style={{ color: '#E11D48' }}>{currentUser.phone}</strong></Col>
            <Col span={8}>• 鉴权错误代码：</Col>
            <Col span={16}><Tag color="error">ERR_AUTH_PHONE_REJECTED</Tag></Col>
            <Col span={8}>• 拦截原因说明：</Col>
            <Col span={16}><span style={{ color: '#BE123C' }}>省厅账号申请已被超管驳回（原因：{rejectReason}）</span></Col>
            <Col span={8}>• 拦截发生时间：</Col>
            <Col span={16}>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</Col>
          </Row>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '16px 20px', marginBottom: 20 }}>
          <h4 style={{ color: '#1E293B', margin: '0 0 10px', fontSize: 14 }}>业务排查与解决建议</h4>
          <ol style={{ fontSize: 13, color: '#475569', paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
            <li>
              <strong>核对上报人员编制资质</strong>：确认该民警是否属于本单位拥有 <code>eagle:gph:CrossTenant:report_to_provincial</code> 资质的直报人员。
            </li>
            <li>
              <strong>联系省厅超管开通账号</strong>：请地市管理员联系省厅管理员，在省厅内网统一认证账号体系中为手机号 <code>{currentUser.phone}</code> 录入并激活账号。
            </li>
            <li>
              <strong>账号生效后重试</strong>：省厅完成账号开通后，返回本页面重新点击【确认上报】，即可正常放行。
            </li>
          </ol>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setAuthFailureDrawerOpen(false)}>
            知悉并关闭诊断
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ScenarioDirectProvincial;
