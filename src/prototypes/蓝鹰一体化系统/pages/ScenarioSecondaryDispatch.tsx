import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Card,
  Row,
  Col,
  Tag,
  Badge,
  Modal,
  Drawer,
  Space,
  Input,
  Select,
  Switch,
  Rate,
  Tooltip,
  Table,
  Empty,
  notification,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  SendOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  BranchesOutlined,
  InfoCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  DownOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  BarsOutlined,
  CompassOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import { useDirectiveState } from '../context/DirectiveStateContext';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// 角色视角定义
export type UserRoleView = 'cityPolice' | 'countyPolice';

interface ProvincialInstructionRecord {
  key: string;
  status: string;
  statusCode: 'pending_dispatch' | 'city_handling' | 'dispatched_county' | 'county_handling' | 'done';
  title: string;
  subTitle: string;
  platform: string;
  instructionType: string;
  timeLimit: string;
  aiSummary: string;
  dispatchUnit: string;
  dispatchTime: string;
  handlingDept: string;
  handlingOfficer: string;
}

const ScenarioSecondaryDispatch: React.FC = () => {
  const { directives, issueNewDirectives, openFailedModal } = useDirectiveState();
  const failedDirectivesCount = directives.filter((d) => d.status === 'failed').length;

  // 当前角色视角：'cityPolice' (市局张三·指令接收岗) | 'countyPolice' (区县李四·指令接收岗)
  const [currentRole, setCurrentRole] = useState<UserRoleView>('cityPolice');

  // 一级 Tab 状态：'local' (本地舆情) | 'provincial' (总队指令)
  const [primaryTab, setPrimaryTab] = useState<'local' | 'provincial'>('local');

  // 总队指令二级 Tab 状态：'pending' (待处理) | 'done' (已处理) | 'all' (全部)
  const [provincialSubTab, setProvincialSubTab] = useState<'pending' | 'done' | 'all'>('pending');

  // 总队指令视图模式：'card' (文章卡片) | 'table' (紧凑列表)
  const [provincialViewMode, setProvincialViewMode] = useState<'card' | 'table'>('card');

  // 省厅原始下达指令（原封不动流转）
  const originalInstructionTopic = '关于徐州某工业园区因环保升级改造停产网络谣言线索排查';
  const originalInstructionContent =
    '请立即对涉事网民线下动向进行落地核查，查清煽动集聚意图，限今日 18:00 前反馈核查笔录与处置结果。';
  const originalTimeLimit = '今日 18:00 前';

  // 二次指派流转核心状态（仅保留选择接收单位部门字段，无需选择岗位）
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const [targetDept, setTargetDept] = useState<string>('徐州市公安局贾汪分局网安大队');
  const [dispatchTimestamp, setDispatchTimestamp] = useState<string>('2026-10-10 10:18:20');

  // 市局自办办理状态（市局双轨：转派 vs 签收/反馈自办）
  const [citySigned, setCitySigned] = useState<boolean>(false);
  const [cityFeedbackSubmitted, setCityFeedbackSubmitted] = useState<boolean>(false);
  const [cityFeedbackText, setCityFeedbackText] = useState<string>(
    '徐州市局网安支队已直接开展落地落地核查，联合属地分局对发帖人进行约谈，原帖已依法清理，事态平稳可控。'
  );

  // 区县端办理状态
  const [countySigned, setCountySigned] = useState<boolean>(false);
  const [countySignTime, setCountySignTime] = useState<string>('');
  const [countyFeedbackSubmitted, setCountyFeedbackSubmitted] = useState<boolean>(false);
  const [countyFeedbackText, setCountyFeedbackText] = useState<string>(
    '贾汪网安大队已会同辖区派出所民警上门走访网民王某，经核实其因生活琐事道听途说并发布夸大网帖。已对其进行普法训诫，当事人主动删除原帖并签署保证书，未引发线下聚集。'
  );

  // 本地舆情分类交互状态
  const [activeCatTab, setActiveCatTab] = useState<string>('all');
  const [autoNotify, setAutoNotify] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'detail' | 'dispatch' | 'brief'>('dispatch');

  // 弹窗与抽屉控制
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [countyDetailDrawerOpen, setCountyDetailDrawerOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [cityFeedbackModalOpen, setCityFeedbackModalOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  const { setCurrentStep, setActionButton, currentRoleView } = useScenarioContext();

  // 待处理徽标数量计算
  const provincialPendingCount = isDispatched || citySigned || cityFeedbackSubmitted ? 0 : 1;
  const countyPendingCount = isDispatched && !countySigned && !countyFeedbackSubmitted ? 1 : 0;
  const currentBadgeCount = currentRole === 'cityPolice' ? provincialPendingCount : countyPendingCount;

  // 组件首次挂载，延迟 800ms 弹出收到上级交办指令系统通知
  useEffect(() => {
    const timer = setTimeout(() => {
      notification.info({
        message: '收到上级交办指令',
        description: '江苏省公安厅网安总队下发了 1 条【线下核查】指令，请及时转派或签收办理！',
        placement: 'topRight',
        duration: 6,
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setPrimaryTab('provincial');
              notification.destroy();
            }}
          >
            立即前往查看
          </Button>
        ),
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 监听顶栏步骤与视角切换联动，适配一级 Tab 架构
  useEffect(() => {
    if (currentRoleView) {
      if (currentRoleView === 'city') {
        setCurrentRole('cityPolice');
        setPrimaryTab('provincial'); // 直接定位到总队指令
      } else if (currentRoleView === 'dispatch') {
        setCurrentRole('cityPolice');
        setPrimaryTab('provincial');
        setDispatchModalOpen(true);
      } else if (currentRoleView === 'county') {
        setCurrentRole('countyPolice');
        setPrimaryTab('provincial');
      }
    }
  }, [currentRoleView]);

  useEffect(() => {
    if (currentRole === 'cityPolice') {
      if (!isDispatched && !citySigned && !cityFeedbackSubmitted) {
        setCurrentStep(1);
        setActionButton({
          label: '转派省厅指令 ➔',
          onClick: () => {
            setPrimaryTab('provincial');
            setDispatchModalOpen(true);
          },
        });
      } else if (isDispatched) {
        setCurrentStep(2);
        setActionButton({
          label: '前往区县端查验 ➔',
          onClick: () => {
            setCurrentRole('countyPolice');
            setPrimaryTab('provincial');
          },
        });
      } else if (citySigned && !cityFeedbackSubmitted) {
        setCurrentStep(2);
        setActionButton({
          label: '市局自办反馈 ➔',
          onClick: () => {
            setPrimaryTab('provincial');
            setCityFeedbackModalOpen(true);
          },
        });
      } else {
        setActionButton({
          label: '重置全流程演示 ↺',
          onClick: handleResetDemo,
        });
      }
    } else {
      setCurrentStep(3);
      if (!countyFeedbackSubmitted) {
        setActionButton({
          label: '区县信息编报 ➔',
          onClick: () => {
            setPrimaryTab('provincial');
            setFeedbackModalOpen(true);
          },
        });
      } else {
        setActionButton({
          label: '重置全流程演示 ↺',
          onClick: handleResetDemo,
        });
      }
    }
  }, [
    currentRole,
    isDispatched,
    citySigned,
    cityFeedbackSubmitted,
    countyFeedbackSubmitted,
    setCurrentStep,
    setActionButton,
  ]);

  // 1. 市局确认二次指派（仅指定部门，无需选择接收岗位，非阻塞右下角浮窗异步流转）
  const handleConfirmDispatch = async () => {
    // 立即关闭转派弹窗，解除前台操作阻断
    setDispatchModalOpen(false);

    // 触发非阻塞右下角浮窗加载
    await issueNewDirectives(
      '202610100088',
      ['线下核查 (转派)'],
      [targetDept],
      originalInstructionContent,
      false, // 转派默认正常送达
      {
        postTitle: originalInstructionTopic,
        platform: '抖音app',
      }
    );

    setIsDispatched(true);
    setCitySigned(false);
    setDispatchTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    message.success('已成功转派至贾汪分局网安大队！');

    // 平滑引导切换至区县视角
    setTimeout(() => {
      setCurrentRole('countyPolice');
      setPrimaryTab('provincial');
    }, 800);
  };

  // 2. 市局直接签收（市局自办路径）
  const handleCitySign = () => {
    setCitySigned(true);
    message.success('签收成功！已由市局指令接收岗承接办理');
  };

  // 3. 市局提交自办反馈
  const handleCitySubmitFeedback = () => {
    setCityFeedbackSubmitted(true);
    setCityFeedbackModalOpen(false);
    message.success('提交成功！市局自办结果已闭环');
  };

  // 4. 区县李四签收（申领了指令接收岗的账号签收后归属李四）
  const handleCountySign = () => {
    setCountySigned(true);
    setCountySignTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    message.success('签收成功！');
  };

  // 5. 区县李四提交核查反馈（直接报送省厅总队闭环，市局无需审核确认）
  const handleCountySubmitFeedback = () => {
    setCountyFeedbackSubmitted(true);
    setFeedbackModalOpen(false);
    message.success('提交成功！处置结果已直接报送省厅总队闭环');
  };

  // 6. 重置全流程演示
  const handleResetDemo = () => {
    setCurrentRole('cityPolice');
    setPrimaryTab('local');
    setProvincialSubTab('pending');
    setProvincialViewMode('card');
    setIsDispatched(false);
    setCitySigned(false);
    setCityFeedbackSubmitted(false);
    setCountySigned(false);
    setCountySignTime('');
    setCountyFeedbackSubmitted(false);
    setDispatchModalOpen(false);
    setCountyDetailDrawerOpen(false);
    setFeedbackModalOpen(false);
    setCityFeedbackModalOpen(false);
    setAiModalOpen(false);
    message.info('场景四演示已重置为初始待办状态。');
  };

  // 分类 Tab 切换配置项（本地舆情）
  const localCategoryTabs = [
    { key: 'pending', label: '待处理' },
    { key: 'handled', label: '已处理 (168)' },
    { key: 'report', label: '信息编报 (47)' },
    { key: 'monitor', label: '持续监测 (178)' },
    { key: 'local-exec', label: '属地落实 (31)' },
    { key: 'offline-check', label: '线下核查 (60)' },
    { key: 'delete-post', label: '属地删帖 (5)' },
    { key: 'leader', label: '领导研判 (4)' },
    { key: 'provincial-exec', label: '总队落实 (3)' },
    { key: 'coord-del', label: '协调删帖 (1)' },
    { key: 'platform-report', label: '平台举报 (3)' },
    { key: 'all', label: '全部' },
  ];

  // =========================================================================
  // 核心导航：任务列表标题集成 Tab（｜任务列表 - 本地舆情｜总队指令｜）
  // =========================================================================
  const renderListTitleTabs = () => (
    <div
      className="emergency-list-title-box"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        userSelect: 'none',
      }}
    >
      <div className="emergency-title-blue-bar" />
      <span className="emergency-title-text" style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
        任务列表
      </span>
      <span style={{ color: '#94a3b8', margin: '0 2px', fontSize: 13 }}>-</span>

      {/* 本地舆情 Tab */}
      <span
        onClick={() => setPrimaryTab('local')}
        style={{
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: primaryTab === 'local' ? 600 : 400,
          color: primaryTab === 'local' ? '#1677ff' : '#64748b',
          padding: '2px 8px',
          borderRadius: 4,
          background: primaryTab === 'local' ? '#eff6ff' : 'transparent',
          border: primaryTab === 'local' ? '1px solid #bfdbfe' : '1px solid transparent',
          transition: 'all 0.2s ease',
        }}
      >
        本地舆情
      </span>

      <span style={{ color: '#cbd5e1', fontSize: 12 }}>|</span>

      {/* 总队指令 Tab */}
      <span
        onClick={() => setPrimaryTab('provincial')}
        style={{
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: primaryTab === 'provincial' ? 600 : 400,
          color: primaryTab === 'provincial' ? '#1677ff' : '#64748b',
          padding: '2px 8px',
          borderRadius: 4,
          background: primaryTab === 'provincial' ? '#eff6ff' : 'transparent',
          border: primaryTab === 'provincial' ? '1px solid #bfdbfe' : '1px solid transparent',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s ease',
        }}
      >
        <span>总队指令</span>
        <Badge
          count={currentBadgeCount}
          size="small"
          style={{ backgroundColor: '#ef4444' }}
        />
      </span>
    </div>
  );

  // =========================================================================
  // 「本地舆情」Tab 筛选栏（已移除省厅下达复选框）
  // =========================================================================
  const renderLocalFilterBar = () => (
    <div className="emergency-filter-container">
      <div className="emergency-filter-inputs">
        <div className="emergency-filter-item">
          <span>报送信息全文搜</span>
          <Input
            placeholder="请输入昵称、网址、组合搜索"
            style={{ width: 220, height: 32, fontSize: 12 }}
            defaultValue="两江骑警"
          />
        </div>

        <div className="emergency-filter-item">
          <span>指令下发时间</span>
          <Input
            placeholder="开始日期  -  结束日期"
            style={{ width: 190, height: 32, fontSize: 12 }}
            defaultValue="2026-10-09  -  2026-10-10"
          />
        </div>

        <div className="emergency-filter-item">
          <span>处置时间</span>
          <Input
            style={{ width: 220, height: 32, fontSize: 12 }}
            defaultValue="2026-10-09 - 2026-10-10"
          />
        </div>
      </div>

      <Space size={8}>
        <Button size="small" style={{ fontSize: 12 }}>
          重置
        </Button>
        <Button
          size="small"
          type="primary"
          style={{ fontSize: 12, background: '#1677ff' }}
          onClick={() => message.success('查询成功！共筛选出本地日常舆情事件。')}
        >
          查询
        </Button>
        <span style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer' }}>
          展开 <DownOutlined style={{ fontSize: 10 }} />
        </span>
      </Space>
    </div>
  );

  // =========================================================================
  // 「本地舆情」Tab 列表工具栏
  // =========================================================================
  const renderLocalListToolbar = () => (
    <div>
      <div className="emergency-list-toolbar">
        {renderListTitleTabs()}

        <div className="emergency-list-actions-box">
          {failedDirectivesCount > 0 ? (
            <Badge count={failedDirectivesCount} offset={[-2, 2]}>
              <Button
                danger
                type="primary"
                size="small"
                icon={<ExclamationCircleFilled />}
                onClick={openFailedModal}
                style={{
                  background: '#dc2626',
                  borderColor: '#dc2626',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
                  fontWeight: 500,
                  fontSize: 12,
                }}
              >
                下达与转派失败记录
              </Button>
            </Badge>
          ) : (
            <Button
              size="small"
              icon={<ExclamationCircleOutlined />}
              onClick={openFailedModal}
              style={{ fontSize: 12, color: '#64748b' }}
            >
              失败记录 (0)
            </Button>
          )}
          <Button
            type="primary"
            size="small"
            style={{ background: '#1677ff', fontSize: 12 }}
            onClick={() => message.info('快捷指令：支持快速下达本地处置任务模板。')}
          >
            快捷指令
          </Button>

          <Space size={4} align="center">
            <Switch
              size="small"
              checked={autoNotify}
              onChange={setAutoNotify}
              style={{ background: autoNotify ? '#1677ff' : '#cbd5e1' }}
            />
            <span style={{ fontSize: 12, color: '#475569' }}>已打开自动消息提醒</span>
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
            <span>排序</span>
            <Select defaultValue="desc" size="small" style={{ width: 140, fontSize: 12 }}>
              <Option value="desc">指令处理时间降序</Option>
              <Option value="asc">指令处理时间升序</Option>
            </Select>
          </div>

          <div style={{ display: 'inline-flex', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setViewMode('detail')}
              style={{
                border: 'none',
                background: viewMode === 'detail' ? '#1677ff' : '#fff',
                color: viewMode === 'detail' ? '#fff' : '#64748b',
                padding: '3px 8px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              详细视图
            </button>
            <button
              type="button"
              onClick={() => setViewMode('dispatch')}
              style={{
                border: 'none',
                background: viewMode === 'dispatch' ? '#1677ff' : '#fff',
                color: viewMode === 'dispatch' ? '#fff' : '#64748b',
                padding: '3px 8px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              处置视图
            </button>
            <button
              type="button"
              onClick={() => setViewMode('brief')}
              style={{
                border: 'none',
                background: viewMode === 'brief' ? '#1677ff' : '#fff',
                color: viewMode === 'brief' ? '#fff' : '#64748b',
                padding: '3px 8px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              简要视图
            </button>
          </div>
        </div>
      </div>

      {/* 分类标签横条 */}
      <div className="emergency-category-tabs-row">
        {localCategoryTabs.map((tab) => (
          <span
            key={tab.key}
            className={`emergency-cat-tab ${activeCatTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveCatTab(tab.key)}
          >
            {tab.label}
          </span>
        ))}
      </div>
    </div>
  );

  // =========================================================================
  // 「本地舆情」内容渲染：仅展示原事件卡片2（本地常规事件）
  // =========================================================================
  const renderLocalContent = () => {
    if (currentRole === 'countyPolice') {
      return (
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          {renderLocalFilterBar()}
          {renderLocalListToolbar()}
          <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
            <Empty
              description="区县本地暂无待处理舆情"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        {renderLocalFilterBar()}
        {renderLocalListToolbar()}

        <div style={{ padding: '4px 16px 20px', background: '#f8fafc' }}>
          {/* 原事件卡片 2：本地常规事件 */}
          <div className="emergency-event-card-item" style={{ opacity: 0.95 }}>
            <div className="event-card-title-row">
              <div className="event-card-title-left">
                <input type="checkbox" style={{ marginRight: 2 }} />
                <span className="event-card-index-pill">1</span>
                <Tag color="blue" style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>
                  初研意见
                </Tag>
                <span className="event-card-title-content">
                  两江骑警给警察车贴罚单...这操作牛逼👍👍👍
                </span>
                <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
                  <FireOutlined /> 非热敏
                </Tag>
                <Tag color="default" style={{ margin: 0, fontSize: 11 }}>
                  已处置
                </Tag>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
                <Rate disabled defaultValue={1.5} style={{ fontSize: 13, color: '#f59e0b' }} />
                <span>1.5星</span>
                <span><EyeOutlined /> 12</span>
                <span><MessageOutlined /> 8</span>
                <span><ShareAltOutlined /> 3</span>
              </div>
            </div>

            <div className="event-card-meta-line">
              <span>作者：巴邻</span>
              <span>ID sr5535</span>
              <Tag color="default" style={{ margin: 0, fontSize: 11 }}>抖音app</Tag>
              <span>发生时间：2026-10-10 11:56:20</span>
              <span>编号：202610100078</span>
            </div>

            <div className="event-card-narrative-content">
              “两江骑警在路口巡查时依法对违规停放的公务警车张贴罚单，引发现场群众围观拍照发网。” #两江交警 #严格执法
            </div>

            <div className="event-card-ai-row">
              <div className="ai-dual-summary-box">
                <div className="ai-summary-row">
                  <span className="ai-pill-green">AI 摘要</span>
                  <span>两江骑警在路口对违停警用车辆张贴罚单。</span>
                </div>
                <div className="ai-summary-row">
                  <span className="ai-pill-orange">AI 研判</span>
                  <span>【事件定性】系一起因执法行为反常引发的网络博噱类舆情事件。【当前态势】目前该事件传播范围限于社交平台零星转发，整体正面理性。</span>
                </div>
              </div>

              <div className="ai-sentiment-index-card">
                <span className="ai-sentiment-index-val">32.50</span>
                <span className="ai-sentiment-index-label">舆情指数</span>
              </div>
            </div>

            <div className="event-task-summary-pills">
              <span className="pill-task-status-solid">已完成任务</span>
              <span className="pill-task-count-outline">1个任务</span>
              <span className="pill-task-type-tag">信息编报</span>
            </div>

            <div className="event-directives-list-box">
              <div className="directive-item-row">
                <div className="directive-row-left">
                  <div className="directive-meta-header">
                    <span className="directive-type-capsule-green">信息编报</span>
                    <span className="directive-status-capsule-outline">已归档</span>
                    <span className="directive-countdown-capsule">
                      <ClockCircleOutlined /> 剩00天01时03分
                    </span>
                    <span className="directive-officer-pill">支队信息科</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>2026-10-10 13:07:32</span>
                    <span className="directive-officer-pill">已签收</span>
                  </div>
                  <div className="directive-text-instruction">
                    请巡查汇集网上信息，编写舆情简报并通报交警支队。
                  </div>
                </div>
                <div className="directive-row-right-action">
                  <Button className="btn-claim-post-dark" size="small" disabled>
                    已完成归档
                  </Button>
                </div>
              </div>
            </div>

            <div className="event-card-footer-row">
              <div className="event-footer-tags">
                <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>本地执法</Tag>
                <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>常规警情</Tag>
              </div>

              <div className="event-footer-actions">
                <span style={{ fontSize: 12, color: '#0284c7', cursor: 'pointer' }}>已办结</span>
                <span
                  style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}
                  onClick={() => message.info('正在查看本地舆情事件详情')}
                >
                  信息详情
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 「总队指令」精简筛选栏
  // =========================================================================
  const renderProvincialFilterBar = () => (
    <div className="emergency-filter-container">
      <div className="emergency-filter-inputs">
        <div className="emergency-filter-item">
          <span>报送信息全文搜</span>
          <Input
            placeholder="请输入指令关键词、舆情标题"
            style={{ width: 240, height: 32, fontSize: 12 }}
            defaultValue="工业园区"
          />
        </div>

        <div className="emergency-filter-item">
          <span>指令下发时间</span>
          <Input
            placeholder="开始日期  -  结束日期"
            style={{ width: 200, height: 32, fontSize: 12 }}
            defaultValue="2026-10-09  -  2026-10-10"
          />
        </div>
      </div>

      <Space size={8}>
        <Button size="small" style={{ fontSize: 12 }}>
          重置
        </Button>
        <Button
          size="small"
          type="primary"
          style={{ fontSize: 12, background: '#1677ff' }}
          onClick={() => message.success('已筛选总队下发指令')}
        >
          查询
        </Button>
      </Space>
    </div>
  );

  // =========================================================================
  // 「总队指令」工具栏与二级 Tab (3项：待处理 + 已处理 + 全部)
  // =========================================================================
  const renderProvincialToolbar = () => {
    const isCity = currentRole === 'cityPolice';
    const pendingNum = isCity ? provincialPendingCount : countyPendingCount;

    return (
      <div>
        <div className="emergency-list-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {renderListTitleTabs()}
            <Tag color="volcano" style={{ margin: 0, fontSize: 11 }}>
              省厅直派跨租户
            </Tag>
          </div>

          <div className="emergency-list-actions-box">
            {failedDirectivesCount > 0 ? (
              <Badge count={failedDirectivesCount} offset={[-2, 2]}>
                <Button
                  danger
                  type="primary"
                  size="small"
                  icon={<ExclamationCircleFilled />}
                  onClick={openFailedModal}
                  style={{
                    background: '#dc2626',
                    borderColor: '#dc2626',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  下达与转派失败记录
                </Button>
              </Badge>
            ) : (
              <Button
                size="small"
                icon={<ExclamationCircleOutlined />}
                onClick={openFailedModal}
                style={{ fontSize: 12, color: '#64748b' }}
              >
                失败记录 (0)
              </Button>
            )}
            <Button
              type="primary"
              size="small"
              style={{ background: '#1677ff', fontSize: 12 }}
              onClick={() => message.info('快捷指令：支持快速流转总队督办专班任务模板。')}
            >
              快捷指令
            </Button>

            <Space size={4} align="center">
              <Switch
                size="small"
                checked={autoNotify}
                onChange={setAutoNotify}
                style={{ background: autoNotify ? '#1677ff' : '#cbd5e1' }}
              />
              <span style={{ fontSize: 12, color: '#475569' }}>已打开自动消息提醒</span>
            </Space>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
              <span>排序</span>
              <Select defaultValue="desc" size="small" style={{ width: 140, fontSize: 12 }}>
                <Option value="desc">指令处理时间降序</Option>
                <Option value="asc">指令处理时间升序</Option>
              </Select>
            </div>

            {/* 视图切换器：[文章卡片] [紧凑列表] */}
            <div style={{ display: 'inline-flex', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setProvincialViewMode('card')}
                style={{
                  border: 'none',
                  background: provincialViewMode === 'card' ? '#1677ff' : '#fff',
                  color: provincialViewMode === 'card' ? '#fff' : '#64748b',
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <AppstoreOutlined /> 文章卡片
              </button>
              <button
                type="button"
                onClick={() => setProvincialViewMode('table')}
                style={{
                  border: 'none',
                  background: provincialViewMode === 'table' ? '#1677ff' : '#fff',
                  color: provincialViewMode === 'table' ? '#fff' : '#64748b',
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <BarsOutlined /> 紧凑列表
              </button>
            </div>
          </div>
        </div>

        {/* 二级 Tab 横条：待处理 (N) / 已处理 / 全部 */}
        <div className="emergency-category-tabs-row">
          <span
            className={`emergency-cat-tab ${provincialSubTab === 'pending' ? 'active' : ''}`}
            onClick={() => setProvincialSubTab('pending')}
          >
            待处理 {pendingNum > 0 ? `(${pendingNum})` : '(0)'}
          </span>
          <span
            className={`emergency-cat-tab ${provincialSubTab === 'done' ? 'active' : ''}`}
            onClick={() => setProvincialSubTab('done')}
          >
            已处理
          </span>
          <span
            className={`emergency-cat-tab ${provincialSubTab === 'all' ? 'active' : ''}`}
            onClick={() => setProvincialSubTab('all')}
          >
            全部
          </span>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 「总队指令」文章卡片视图（市局端）
  // =========================================================================
  const renderCityProvincialCard = () => {
    // 过滤逻辑：若当前为已处理 subTab 但未办结，或者待处理 subTab 但已办结，需提示空
    const isDone = cityFeedbackSubmitted || countyFeedbackSubmitted;
    if (provincialSubTab === 'pending' && isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无待处理指令（该指令已办结）" />
        </div>
      );
    }
    if (provincialSubTab === 'done' && !isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无已处理指令（指令尚在流转待办中）" />
        </div>
      );
    }

    return (
      <div style={{ padding: '4px 16px 20px', background: '#f8fafc' }}>
        {/* 事件卡片 1：涉及省厅下达的核心事件 */}
        <div className="emergency-event-card-item">
          {/* 卡片头部行 */}
          <div className="event-card-title-row">
            <div className="event-card-title-left">
              <input type="checkbox" style={{ marginRight: 2 }} />
              <span className="event-card-index-pill">1</span>
              <Tag color="blue" style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>
                初研意见
              </Tag>
              <span className="event-card-title-content">
                {originalInstructionTopic}
              </span>
              <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
                <FireOutlined /> 非热敏
              </Tag>
              <Tag
                color={cityFeedbackSubmitted || countyFeedbackSubmitted ? 'success' : 'processing'}
                style={{ margin: 0, fontSize: 11 }}
              >
                {cityFeedbackSubmitted || countyFeedbackSubmitted ? '已办结' : '已下发处置'}
              </Tag>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
              <Rate disabled defaultValue={2.5} style={{ fontSize: 13, color: '#f59e0b' }} />
              <span>2.5星</span>
              <span><EyeOutlined /> 88</span>
              <span><MessageOutlined /> 73</span>
              <span><ShareAltOutlined /> 15</span>
            </div>
          </div>

          {/* 卡片元数据行 */}
          <div className="event-card-meta-line">
            <span>作者：<strong style={{ color: '#1e293b' }}>苏北观察员</strong></span>
            <span>ID <a href="#id" onClick={(e) => e.preventDefault()} style={{ color: '#2563eb' }}>7694739512768873018</a></span>
            <Tag color="default" style={{ margin: 0, fontSize: 11 }}>抖音app</Tag>
            <span>发生时间：2026-10-10 10:15:20</span>
            <span>编号：202610100088</span>
          </div>

          {/* 舆情正文内容 */}
          <div className="event-card-narrative-content">
            “徐州某工业园区因环保升级改造停产，网传将引发千人聚集游行抗议，已有网民在微信群中煽动前往园区管委会讨说法，请迅速落实排查处置！” #工业园区 #徐州停产
          </div>

          {/* AI 分析结果双色条 + 右侧紫色舆情指数卡片 */}
          <div className="event-card-ai-row">
            <div className="ai-dual-summary-box">
              <div className="ai-summary-row">
                <span className="ai-pill-green">AI 摘要</span>
                <span>涉事人包括本地自媒体从业者王某，涉事地点为徐州市贾汪区工业园区，网帖夸大企业停产规模并煽动线下非法聚集。</span>
              </div>
              <div className="ai-summary-row">
                <span className="ai-pill-orange">AI 研判</span>
                <span>【事件定性】系一起因涉稳民生诉求引发的网络串联炒作事件。【当前态势】网帖在本地群组发酵，存在线下聚集风险。【关注建议】属地网安落地排查重点人员，责令删除不实言论。</span>
              </div>
            </div>

            <div className="ai-sentiment-index-card">
              <span className="ai-sentiment-index-val">68.50</span>
              <span className="ai-sentiment-index-label">舆情指数</span>
            </div>
          </div>

          {/* 任务概要胶囊条 */}
          <div className="event-task-summary-pills">
            <span className={`pill-task-status-solid ${cityFeedbackSubmitted || countyFeedbackSubmitted ? 'done' : ''}`}>
              {cityFeedbackSubmitted || countyFeedbackSubmitted ? '已完成任务' : '未完成任务'}
            </span>
            <span className="pill-task-count-outline">2个任务</span>
            <span className="pill-task-type-tag">线下核查</span>
            <span className="pill-task-type-tag">持续监测</span>
          </div>

          {/* 当前接收到的指令清单 (市局提供转派+签收+反馈) */}
          <div className="event-directives-list-box">
            {/* 指令 1：落地核查（右侧提供：转派 + 签收 + 反馈，Pin 3 挂载） */}
            <div className="directive-item-row" style={{ background: '#f8fafc' }}>
              <div className="directive-row-left">
                <div className="directive-meta-header">
                  <span className="directive-type-capsule-green">线下核查</span>
                  <span className="directive-status-capsule-outline">
                    {cityFeedbackSubmitted || countyFeedbackSubmitted
                      ? '已办结'
                      : isDispatched
                      ? '已转派基层'
                      : citySigned
                      ? '市局办理中'
                      : '待办'}
                  </span>
                  <span className="directive-countdown-capsule">
                    <ClockCircleOutlined /> 剩00天03时45分
                  </span>
                  <span className="directive-officer-pill">省厅总队值班长</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>2026-10-10 10:15:20</span>
                  <span className="directive-officer-pill">
                    {citySigned ? '已签收 (张三)' : '签收'}
                  </span>
                </div>

                <div className="directive-text-instruction">
                  {originalInstructionContent}
                </div>

                {/* 状态回显 */}
                {isDispatched && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: '#15803d',
                      background: '#f0fdf4',
                      padding: '4px 10px',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <CheckCircleFilled style={{ color: '#22c55e' }} />
                    <span>
                      已原封不动转派至：<strong>{targetDept}</strong> ｜{' '}
                      {countyFeedbackSubmitted
                        ? '贾汪分局已完成落地核查并直接报送省厅总队办结，市局无需审核确认。'
                        : '自动流转至该部门【指令接收岗】，基层反馈后直接报送省厅闭环，市局无需审核确认。'}
                    </span>
                  </div>
                )}

                {cityFeedbackSubmitted && (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: '#15803d',
                      background: '#f0fdf4',
                      padding: '4px 10px',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <CheckCircleFilled style={{ color: '#22c55e' }} />
                    <span>
                      市局网安支队民警张三已直接完成落地核查并回传处置报告（市局自办已达成闭环）
                    </span>
                  </div>
                )}
              </div>

              {/* 市局操作区：转派 + 签收 + 反馈 双轨按钮组 (Pin 3 挂载) */}
              <div className="directive-row-right-action">
                <Annotated
                  pin={3}
                  title="市局处置双轨制（转派 vs 自办）"
                  note="市局视图提供【转派】、【签收】、【反馈】按钮。市局既可直接转派至基层部门（无需选择接收岗位），亦可由市局本级直接签收办理并提交反馈。"
                  tag="转派/自办双轨"
                  placement="top-right"
                >
                  {!isDispatched && !cityFeedbackSubmitted ? (
                    <Space size={6}>
                      {/* 1. 转派按钮 */}
                      <Button
                        type="primary"
                        size="small"
                        icon={<SendOutlined />}
                        onClick={() => setDispatchModalOpen(true)}
                        style={{ background: '#2563eb' }}
                        disabled={citySigned}
                      >
                        转派
                      </Button>

                      {/* 2. 签收按钮 */}
                      {!citySigned ? (
                        <Button
                          size="small"
                          icon={<CheckCircleOutlined />}
                          onClick={handleCitySign}
                        >
                          签收
                        </Button>
                      ) : (
                        <Button size="small" disabled style={{ color: '#16a34a', borderColor: '#86efac' }}>
                          已签收
                        </Button>
                      )}

                      {/* 3. 反馈按钮 */}
                      <Button
                        type={citySigned ? 'primary' : 'default'}
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => setCityFeedbackModalOpen(true)}
                        disabled={!citySigned}
                        style={citySigned ? { background: '#10b981', border: 'none' } : {}}
                      >
                        反馈
                      </Button>
                    </Space>
                  ) : isDispatched ? (
                    <Space size={8}>
                      <Tag color={countyFeedbackSubmitted ? 'success' : 'processing'} style={{ margin: 0, fontSize: 12 }}>
                        {countyFeedbackSubmitted ? '区县已直报省厅结案' : '已转派贾汪承办'}
                      </Tag>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                          setCurrentRole('countyPolice');
                          setPrimaryTab('provincial');
                        }}
                      >
                        前往贾汪分局查验 ➔
                      </Button>
                    </Space>
                  ) : (
                    <Tag color="success" style={{ padding: '3px 10px', fontSize: 12 }}>
                      <CheckCircleFilled style={{ marginRight: 4 }} />
                      市局自办已闭环
                    </Tag>
                  )}
                </Annotated>
              </div>
            </div>

            {/* 指令 2：持续监测 */}
            <div className="directive-item-row">
              <div className="directive-row-left">
                <div className="directive-meta-header">
                  <span className="directive-type-capsule-green">持续监测</span>
                  <span className="directive-status-capsule-outline">待反馈</span>
                  <span className="directive-countdown-capsule">
                    <ClockCircleOutlined /> 剩01天12时00分
                  </span>
                  <span className="directive-officer-pill">支队指挥中心</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>2026-10-10 09:30:00</span>
                  <span className="directive-officer-pill">签收</span>
                </div>

                <div className="directive-text-instruction">
                  持续关注涉事贴文及衍生评论转发趋势，每2小时巡查一次舆情热度，重点监控本地重点人员互动。
                </div>
              </div>

              <div className="directive-row-right-action">
                <Button
                  className="btn-claim-post-dark"
                  size="small"
                  onClick={() =>
                    message.info(
                      '【常规岗位流转】该日常指令遵循本单位岗位配置，需申领对应持续监测岗位后签收办理。'
                    )
                  }
                >
                  请先申领岗位
                </Button>
              </div>
            </div>
          </div>

          {/* 卡片底栏辅助操作 */}
          <div className="event-card-footer-row">
            <div className="event-footer-tags">
              <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>涉稳民生</Tag>
              <Tag color="geekblue" style={{ margin: 0, fontSize: 11 }}>群体性诉求</Tag>
            </div>

            <div className="event-footer-actions">
              <span style={{ fontSize: 12, color: '#0284c7', cursor: 'pointer' }}>
                {cityFeedbackSubmitted ? '已办结' : '处置中'}
              </span>
              <span
                style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}
                onClick={() => setCountyDetailDrawerOpen(true)}
              >
                信息详情
              </span>
              <span className="btn-ai-assist-pill" onClick={() => setAiModalOpen(true)}>
                <ThunderboltOutlined /> AI 辅助研判
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 「总队指令」文章卡片视图（区县端）
  // =========================================================================
  const renderCountyProvincialCard = () => {
    if (!isDispatched) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty
            description="暂未收到市局转派的总队交办指令（请先在市局端进行指令转派）"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setCurrentRole('cityPolice');
                setPrimaryTab('provincial');
              }}
            >
              ← 返回市局端进行转派
            </Button>
          </Empty>
        </div>
      );
    }

    const isDone = countyFeedbackSubmitted;
    if (provincialSubTab === 'pending' && isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无待处理指令（区县已直报结案）" />
        </div>
      );
    }
    if (provincialSubTab === 'done' && !isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无已处理指令（待签收/反馈）" />
        </div>
      );
    }

    return (
      <div style={{ padding: '4px 16px 20px', background: '#f8fafc' }}>
        <div className="emergency-event-card-item">
          {/* 卡片头部行 */}
          <div className="event-card-title-row">
            <div className="event-card-title-left">
              <input type="checkbox" style={{ marginRight: 2 }} />
              <span className="event-card-index-pill">1</span>
              <Tag color="blue" style={{ borderRadius: 12, fontSize: 11, margin: 0 }}>
                初研意见
              </Tag>
              <span className="event-card-title-content">
                {originalInstructionTopic}
              </span>
              <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
                <FireOutlined /> 非热敏
              </Tag>
              <Tag color={countyFeedbackSubmitted ? 'success' : 'processing'} style={{ margin: 0, fontSize: 11 }}>
                {countyFeedbackSubmitted ? '已办结' : '处置中'}
              </Tag>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#64748b' }}>
              <Rate disabled defaultValue={2.5} style={{ fontSize: 13, color: '#f59e0b' }} />
              <span>2.5星</span>
              <span><EyeOutlined /> 88</span>
              <span><MessageOutlined /> 73</span>
              <span><ShareAltOutlined /> 15</span>
            </div>
          </div>

          {/* 卡片元数据行 */}
          <div className="event-card-meta-line">
            <span>作者：苏北观察员</span>
            <span>ID 7694739512768873018</span>
            <Tag color="default" style={{ margin: 0, fontSize: 11 }}>抖音app</Tag>
            <span>发生时间：2026-10-10 10:15:20</span>
            <span>任务编号：202610090018-SUB01</span>
          </div>

          {/* 舆情正文内容 */}
          <div className="event-card-narrative-content">
            “徐州某工业园区因环保升级改造停产，网传将引发千人聚集游行抗议，已有网民在微信群中煽动前往园区管委会讨说法，请迅速落实排查处置！” #工业园区 #徐州停产
          </div>

          {/* AI 分析结果 */}
          <div className="event-card-ai-row">
            <div className="ai-dual-summary-box">
              <div className="ai-summary-row">
                <span className="ai-pill-green">AI 摘要</span>
                <span>涉事人包括本地自媒体从业者王某，涉事地点为徐州市贾汪区工业园区，网帖夸大企业停产规模并煽动线下非法聚集。</span>
              </div>
              <div className="ai-summary-row">
                <span className="ai-pill-orange">AI 研判</span>
                <span>【事件定性】系一起因民生诉求引发的网络串联炒作事件。【关注建议】属地网安落地排查重点人员，责令删除不实言论。</span>
              </div>
            </div>

            <div className="ai-sentiment-index-card">
              <span className="ai-sentiment-index-val">68.50</span>
              <span className="ai-sentiment-index-label">舆情指数</span>
            </div>
          </div>

          {/* 任务概要胶囊条 */}
          <div className="event-task-summary-pills">
            <span className={`pill-task-status-solid ${countyFeedbackSubmitted ? 'done' : ''}`}>
              {countyFeedbackSubmitted ? '已完成任务' : '未完成任务'}
            </span>
            <span className="pill-task-count-outline">1个任务</span>
            <span className="pill-task-type-tag">线下核查</span>
          </div>

          {/* 区县接收到的指令条目 (仅有签收与反馈操作，保留 Pin 4) */}
          <div className="event-directives-list-box">
            <div className={`directive-item-row ${countySigned ? 'county-signed' : ''}`}>
              <div className="directive-row-left">
                <div className="directive-meta-header">
                  <span className="directive-type-capsule-green">线下核查</span>
                  <span className="directive-status-capsule-outline">
                    {countyFeedbackSubmitted ? '已办结' : countySigned ? '处置中' : '待签收'}
                  </span>
                  <span className="directive-countdown-capsule">
                    <ClockCircleOutlined /> 剩00天02小时15分
                  </span>
                  <span className="directive-officer-pill">徐州市公安局网安支队 (转派)</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{dispatchTimestamp}</span>
                  <span className="directive-officer-pill">
                    {countySigned ? '已签收 (李四)' : '待签收'}
                  </span>
                </div>

                <div className="directive-text-instruction">
                  {originalInstructionContent}
                </div>
              </div>

              {/* 区县端仅有签收办理与信息编报反馈 */}
              <div className="directive-row-right-action">
                {!countySigned ? (
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={handleCountySign}
                    style={{ background: '#2563eb' }}
                  >
                    签收办理
                  </Button>
                ) : !countyFeedbackSubmitted ? (
                  <Annotated
                    pin={4}
                    title="区县直报省厅闭环（市局免审）"
                    note="基层工作人员经过培训熟练掌握工作要求，核查处置结果直接报送省厅总队闭环，市局单位无需留意，无确认或审核步骤。"
                    tag="直报省厅"
                    placement="top-right"
                  >
                    <Button
                      type="primary"
                      size="small"
                      icon={<FileTextOutlined />}
                      onClick={() => setFeedbackModalOpen(true)}
                      style={{ background: '#10b981', border: 'none' }}
                    >
                      信息编报 / 反馈
                    </Button>
                  </Annotated>
                ) : (
                  <Tag color="success" style={{ padding: '3px 10px', fontSize: 12 }}>
                    <CheckCircleFilled style={{ marginRight: 4 }} />
                    处置结果已直接报送省厅办结（市局免审）
                  </Tag>
                )}
              </div>
            </div>
          </div>

          {/* 卡片底栏 */}
          <div className="event-card-footer-row">
            <div className="event-footer-tags">
              <Tag color="cyan" style={{ margin: 0, fontSize: 11 }}>涉稳民生</Tag>
              <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>贾汪属地</Tag>
            </div>

            <div className="event-footer-actions">
              <span style={{ fontSize: 12, color: '#0284c7', cursor: 'pointer' }}>
                {countyFeedbackSubmitted ? '已办结' : '处置中'}
              </span>
              <span
                style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}
                onClick={() => setCountyDetailDrawerOpen(true)}
              >
                信息详情
              </span>
              <span className="btn-ai-assist-pill" onClick={() => setAiModalOpen(true)}>
                <ThunderboltOutlined /> AI 辅助研判
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 「总队指令」紧凑表格视图（省厅指令 Table 实现）
  // =========================================================================
  const renderProvincialTableView = () => {
    const isCity = currentRole === 'cityPolice';

    if (!isCity && !isDispatched) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty
            description="暂未收到市局转派的总队交办指令（请先在市局端进行指令转派）"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setCurrentRole('cityPolice');
                setPrimaryTab('provincial');
              }}
            >
              ← 返回市局端进行转派
            </Button>
          </Empty>
        </div>
      );
    }

    // 动态判断状态
    let statusLabel = '待转派';
    let statusCode: ProvincialInstructionRecord['statusCode'] = 'pending_dispatch';
    let handlingDept = '待分配';
    let handlingOfficer = '待认领 (指令接收岗)';

    if (cityFeedbackSubmitted) {
      statusLabel = '已办结 (市局自办)';
      statusCode = 'done';
      handlingDept = '徐州市公安局网安支队';
      handlingOfficer = '张三 (市局指令接收岗)';
    } else if (countyFeedbackSubmitted) {
      statusLabel = '已办结 (直报省厅)';
      statusCode = 'done';
      handlingDept = targetDept;
      handlingOfficer = '李四 (贾汪网安大队)';
    } else if (citySigned) {
      statusLabel = '市局自办中';
      statusCode = 'city_handling';
      handlingDept = '徐州市公安局网安支队';
      handlingOfficer = '张三 (市局指令接收岗)';
    } else if (isDispatched) {
      if (countySigned) {
        statusLabel = '区县处置中';
        statusCode = 'county_handling';
        handlingDept = targetDept;
        handlingOfficer = '李四 (贾汪网安大队)';
      } else {
        statusLabel = '已转派基层 (待签收)';
        statusCode = 'dispatched_county';
        handlingDept = targetDept;
        handlingOfficer = '待认领 (贾汪接收岗)';
      }
    }

    // 根据 subTab 过滤
    const isDone = cityFeedbackSubmitted || countyFeedbackSubmitted;
    if (provincialSubTab === 'pending' && isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无待处理指令（该指令已办结）" />
        </div>
      );
    }
    if (provincialSubTab === 'done' && !isDone) {
      return (
        <div style={{ padding: '40px 16px', background: '#f8fafc', textAlign: 'center' }}>
          <Empty description="当前分类下暂无已处理指令" />
        </div>
      );
    }

    const dataSource: ProvincialInstructionRecord[] = [
      {
        key: 'prov-001',
        status: statusLabel,
        statusCode,
        title: originalInstructionTopic,
        subTitle: originalInstructionContent,
        platform: '抖音app',
        instructionType: '线下核查',
        timeLimit: originalTimeLimit,
        aiSummary:
          '涉事人包括本地自媒体从业者王某，网帖夸大工业园区停产规模并煽动线下非法聚集。建议属地网安落地排查并就地稳控。',
        dispatchUnit: '省公安厅网安总队',
        dispatchTime: '2026-10-10 10:15:20',
        handlingDept,
        handlingOfficer,
      },
    ];

    const columns: ColumnsType<ProvincialInstructionRecord> = [
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (text: string, record) => {
          let tagColor = 'processing';
          if (record.statusCode === 'done') tagColor = 'success';
          if (record.statusCode === 'pending_dispatch') tagColor = 'warning';
          if (record.statusCode === 'dispatched_county') tagColor = 'blue';
          return <Tag color={tagColor}>{text}</Tag>;
        },
      },
      {
        title: '指令名称 / 舆情标题',
        dataIndex: 'title',
        key: 'title',
        width: 300,
        render: (title: string, record) => (
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.4 }}>
              {title}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
              <Tag color="cyan" style={{ fontSize: 10, margin: 0, padding: '0 4px' }}>
                {record.platform}
              </Tag>
              <span>发生时间：2026-10-10</span>
            </div>
          </div>
        ),
      },
      {
        title: '指令类型',
        dataIndex: 'instructionType',
        key: 'instructionType',
        width: 100,
        render: (type: string) => <Tag color="geekblue">{type}</Tag>,
      },
      {
        title: '时限',
        dataIndex: 'timeLimit',
        key: 'timeLimit',
        width: 140,
        render: (limit: string) => (
          <span style={{ color: '#d97706', fontSize: 12, fontWeight: 500 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {limit}
          </span>
        ),
      },
      {
        title: 'AI研判摘要',
        dataIndex: 'aiSummary',
        key: 'aiSummary',
        ellipsis: true,
        render: (summary: string) => (
          <Tooltip title={summary} placement="topLeft">
            <span style={{ fontSize: 12, color: '#475569', cursor: 'pointer' }}>
              {summary}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '下发单位/时间',
        key: 'dispatchInfo',
        width: 170,
        render: (_, record) => (
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#1e293b', fontWeight: 500 }}>{record.dispatchUnit}</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>{record.dispatchTime}</div>
          </div>
        ),
      },
      {
        title: '承办部门/经办人',
        key: 'handlingInfo',
        width: 180,
        render: (_, record) => (
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#334155' }}>{record.handlingDept}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>{record.handlingOfficer}</div>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 190,
        fixed: 'right',
        render: () => {
          if (isCity) {
            // 市局操作列
            if (!isDispatched && !cityFeedbackSubmitted) {
              return (
                <Space size={6}>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => setDispatchModalOpen(true)}
                    disabled={citySigned}
                  >
                    转派
                  </Button>
                  {!citySigned ? (
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0 }}
                      onClick={handleCitySign}
                    >
                      签收
                    </Button>
                  ) : (
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, color: '#10b981' }}
                      onClick={() => setCityFeedbackModalOpen(true)}
                    >
                      反馈自办
                    </Button>
                  )}
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, color: '#64748b' }}
                    onClick={() => setAiModalOpen(true)}
                  >
                    AI研判
                  </Button>
                </Space>
              );
            }
            if (isDispatched) {
              return (
                <Space size={6}>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => {
                      setCurrentRole('countyPolice');
                      setPrimaryTab('provincial');
                    }}
                  >
                    前往区县查验
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, color: '#64748b' }}
                    onClick={() => setCountyDetailDrawerOpen(true)}
                  >
                    详情
                  </Button>
                </Space>
              );
            }
            return <Tag color="success">市局自办已闭环</Tag>;
          }

          // 区县操作列
          if (!countySigned) {
            return (
              <Space size={6}>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0 }}
                  onClick={handleCountySign}
                >
                  签收办理
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, color: '#64748b' }}
                  onClick={() => setCountyDetailDrawerOpen(true)}
                >
                  详情
                </Button>
              </Space>
            );
          }
          if (!countyFeedbackSubmitted) {
            return (
              <Space size={6}>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, color: '#10b981' }}
                  onClick={() => setFeedbackModalOpen(true)}
                >
                  信息编报/反馈
                </Button>
                <Button
                  type="link"
                  size="small"
                  style={{ padding: 0, color: '#64748b' }}
                  onClick={() => setAiModalOpen(true)}
                >
                  AI研判
                </Button>
              </Space>
            );
          }
          return <Tag color="success">已直报省厅闭环</Tag>;
        },
      },
    ];

    return (
      <div style={{ padding: '8px 16px 20px', background: '#f8fafc' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
          style={{ background: '#fff', borderRadius: 6, border: '1px solid #e2e8f0' }}
        />
      </div>
    );
  };

  // =========================================================================
  // 「总队指令」总体内容容器
  // =========================================================================
  const renderProvincialContent = () => {
    return (
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        {renderProvincialFilterBar()}
        {renderProvincialToolbar()}

        {provincialViewMode === 'card' ? (
          currentRole === 'cityPolice' ? (
            renderCityProvincialCard()
          ) : (
            renderCountyProvincialCard()
          )
        ) : (
          renderProvincialTableView()
        )}
      </div>
    );
  };

  // =========================================================================
  // 视图 A：市局端 (徐州市公安局网安支队)
  // =========================================================================
  const renderCityView = () => (
    <div className="city-dispatch-emergency-wrapper">
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-city-audit" style={{ marginBottom: 12 }}>
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <ApartmentOutlined /> 局域网 · 徐州
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            徐州市局网安支队
          </span>
          <Annotated
            pin={1}
            title="指令接收岗与账号归属机制"
            note="系统岗位配置了【指令接收岗】，指令下达后自动流转到指定部门申领了接收岗的账号中，任意账号签收后即归属于该账号进行反馈。"
            tag="指令接收岗"
            placement="bottom-left"
          >
            <span
              className="scenario-env-subtitle"
              style={{
                color: '#fed7aa',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '2px 8px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              当前账号：张三（岗位：指令接收岗）
            </span>
          </Annotated>
        </div>
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setCurrentRole('countyPolice');
              setPrimaryTab('provincial');
            }}
            style={{ background: '#2563eb', border: 'none' }}
          >
            前往区县端查验 (贾汪分局 · 视图 B) <ArrowRightOutlined />
          </Button>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleResetDemo}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            重置演示
          </Button>
        </Space>
      </div>

      {/* Tab 内容区 */}
      {primaryTab === 'local' ? renderLocalContent() : renderProvincialContent()}
    </div>
  );

  // =========================================================================
  // 视图 B：区县端 (贾汪分局网安大队)
  // =========================================================================
  const renderCountyView = () => (
    <div className="county-dispatch-emergency-wrapper">
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-city-b" style={{ marginBottom: 12 }}>
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 局域网 · 徐州
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            贾汪分局网安大队
          </span>
          <span
            className="scenario-env-subtitle"
            style={{
              color: '#fed7aa',
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            当前账号：李四（岗位：指令接收岗）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => {
              setCurrentRole('cityPolice');
              setPrimaryTab('provincial');
            }}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回市局支队 (视图 A)
          </Button>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleResetDemo}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            重置演示
          </Button>
        </Space>
      </div>

      {/* Tab 内容区 */}
      {primaryTab === 'local' ? renderLocalContent() : renderProvincialContent()}
    </div>
  );

  // =========================================================================
  // 1. 二次指派精简弹窗（总队指令直接转派，仅选接收部门，无需选岗位）
  // =========================================================================
  const renderDispatchModal = () => (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BranchesOutlined style={{ color: '#2563eb' }} />
          <span>徐州市公安局网安支队 - 省厅指令直接转派</span>
        </div>
      }
      open={dispatchModalOpen}
      width={560}
      onCancel={() => setDispatchModalOpen(false)}
      onOk={handleConfirmDispatch}
      okText="确认转派至目标部门"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        {/* 省厅原始指令只读卡片（原封不动转派） */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '12px 14px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
              省厅下达原始指令内容（原封不动转派）
            </span>
            <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
              时效：{originalTimeLimit}
            </Tag>
          </div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            {originalInstructionContent}
          </div>
        </div>

        {/* 核心表单交互项：仅保留接收单位（部门）字段！无需选择接收岗位！ */}
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              接收单位（部门） <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <Select
              style={{ width: '100%', height: 40, fontSize: 14 }}
              value={targetDept}
              onChange={setTargetDept}
            >
              <Option value="徐州市公安局贾汪分局网安大队">
                徐州市公安局贾汪分局网安大队
              </Option>
              <Option value="徐州市公安局泉山分局网安大队">
                徐州市公安局泉山分局网安大队
              </Option>
              <Option value="徐州市公安局铜山分局网安大队">
                徐州市公安局铜山分局网安大队
              </Option>
              <Option value="徐州市公安局鼓楼分局网安大队">
                徐州市公安局鼓楼分局网安大队
              </Option>
            </Select>
          </Col>

          {/* 规则说明：无需选择接收岗位 */}
          <Col span={24}>
            <div
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 12,
                color: '#1e40af',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                lineHeight: 1.6,
              }}
            >
              <InfoCircleOutlined style={{ color: '#2563eb', marginTop: 2, flexShrink: 0 }} />
              <div>
                <strong>业务流转规则说明（无需选择接收岗位 · 基层直达省厅闭环）：</strong>
                <div>
                  针对省厅下达指令，市局支持直接将指令转派到下级部门，<strong>无需选择接收岗位</strong>。
                </div>
                <div style={{ marginTop: 2, color: '#1d4ed8' }}>
                  指令原封不动转派至目标部门后，自动推入其<strong>【指令接收岗】</strong>待办池。基层工作人员均经过专业培训，签收与反馈后<strong>处置结果将直接报送省厅总队闭环，市局无需审核确认</strong>。
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );

  // =========================================================================
  // 2. 市局自办反馈弹窗
  // =========================================================================
  const renderCityFeedbackModal = () => (
    <Modal
      title="徐州市局网安支队 - 落地核查自办处置报告"
      open={cityFeedbackModalOpen}
      width={720}
      onCancel={() => setCityFeedbackModalOpen(false)}
      onOk={handleCitySubmitFeedback}
      okText="提交自办反馈闭环"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              处置反馈标题 <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <Input
              style={{ height: 40 }}
              defaultValue="【市局自办反馈】关于徐州某工业园区网络谣言重点人员落地处置报告"
            />
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              承办单位
            </div>
            <Input style={{ height: 40 }} value="徐州市公安局网安支队" disabled />
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              承办经办民警
            </div>
            <Input style={{ height: 40 }} value="张三 (指令接收岗 · 警号: 320308)" disabled />
          </Col>

          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              落地核查情况与处置结果 <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <TextArea
              rows={4}
              value={cityFeedbackText}
              onChange={(e) => setCityFeedbackText(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.6 }}
              placeholder="请输入现场核查详情与自办处置结果..."
            />
          </Col>

          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              佐证材料 (1份)
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Tag color="blue" style={{ padding: '6px 12px', fontSize: 13, borderRadius: 4 }}>
                📄 市局支队处置结案纪要_20261010.pdf
              </Tag>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );

  // =========================================================================
  // 3. 区县信息编报/反馈弹窗 (12 列栅格规范，限宽 720px)
  // =========================================================================
  const renderFeedbackModal = () => (
    <Modal
      title="贾汪分局网安大队 - 落地核查处置报告"
      open={feedbackModalOpen}
      width={720}
      onCancel={() => setFeedbackModalOpen(false)}
      onOk={handleCountySubmitFeedback}
      okText="提交反馈（直报省厅闭环）"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        {/* 直报省厅闭环提示 */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 16,
            fontSize: 12,
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircleFilled style={{ color: '#22c55e' }} />
          <span>基层单位工作人员熟练掌握指令工作规范，提交后核查处置结果将直接报送省厅总队闭环，市局单位无需确认或审核。</span>
        </div>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              处置反馈标题 <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <Input
              style={{ height: 40 }}
              defaultValue="【核查反馈】关于徐州某工业园区网络谣言人员落地走访处置报告"
            />
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              承办单位
            </div>
            <Input style={{ height: 40 }} value="徐州市公安局贾汪分局网安大队" disabled />
          </Col>

          <Col span={12}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              承办经办民警
            </div>
            <Input style={{ height: 40 }} value="李四 (指令接收岗 · 警号: 320306)" disabled />
          </Col>

          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              落地核查情况与处置结果 <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <TextArea
              rows={4}
              value={countyFeedbackText}
              onChange={(e) => setCountyFeedbackText(e.target.value)}
              style={{ fontSize: 14, lineHeight: 1.6 }}
              placeholder="请输入现场走访核查详情、当事人笔录与稳控结果..."
            />
          </Col>

          <Col span={24}>
            <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 500, color: '#334155' }}>
              核查佐证材料 (2份)
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Tag color="blue" style={{ padding: '6px 12px', fontSize: 13, borderRadius: 4 }}>
                📄 现场走访核查笔录_王某.pdf
              </Tag>
              <Tag color="green" style={{ padding: '6px 12px', fontSize: 13, borderRadius: 4 }}>
                📄 悔过删除承诺保证书.jpg
              </Tag>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );

  // =========================================================================
  // 4. AI 辅助研判综合弹窗
  // =========================================================================
  const renderAiModal = () => (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltOutlined style={{ color: '#f59e0b' }} />
          <span>AI 辅助研判分析报告</span>
        </div>
      }
      open={aiModalOpen}
      width={720}
      onCancel={() => setAiModalOpen(false)}
      footer={[
        <Button key="close" onClick={() => setAiModalOpen(false)}>
          关闭
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={() => {
            setAiModalOpen(false);
            if (currentRole === 'cityPolice' && !isDispatched) {
              setDispatchModalOpen(true);
            } else {
              message.success('研判结论已采纳至应急处置工单');
            }
          }}
        >
          采纳研判结论
        </Button>,
      ]}
      destroyOnClose
    >
      <div style={{ padding: '8px 0', fontSize: 13 }}>
        <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
            {originalInstructionTopic}
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            研判模型：蓝鹰多维舆情智能研判大模型 v3.2 ｜ 敏感度置信度：98.6%
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>风险敏感点挖掘</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>
              • 串联聚集风险：高（提及微信群集合）<br />
              • 扩散传播速度：中等（自媒体扩散）
            </div>
          </div>
          <div style={{ flex: 1, background: '#fffbeb', border: '1px solid #fde68a', padding: 10, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>处置策略建议</div>
            <div style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>
              • 属地部门落地核查发帖人王某<br />
              • 开展源头辟谣与就地稳控工作
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  // =========================================================================
  // 5. 任务详情抽屉
  // =========================================================================
  const renderCountyDetailDrawer = () => (
    <Drawer
      title="应急处置事件详情"
      placement="right"
      width={480}
      open={countyDetailDrawerOpen}
      onClose={() => setCountyDetailDrawerOpen(false)}
    >
      <div style={{ lineHeight: '30px', fontSize: 13 }}>
        <p><strong>事件编号：</strong> 202610100088</p>
        <p><strong>舆情主题：</strong> {originalInstructionTopic}</p>
        <p><strong>涉事属地：</strong> 江苏省 / 徐州市 / 贾汪区</p>
        <p><strong>指令要求：</strong> {originalInstructionContent}</p>
        <p><strong>时效要求：</strong> {originalTimeLimit}</p>
        <p><strong>承办部门：</strong> {isDispatched ? targetDept : citySigned ? '徐州市公安局网安支队' : '待指派'}</p>
        <p><strong>流转状态：</strong> {cityFeedbackSubmitted ? '市局自办已办结' : countyFeedbackSubmitted ? '区县直报省厅已办结' : isDispatched ? '转派执行中' : citySigned ? '市局自办中' : '待办'}</p>
      </div>
    </Drawer>
  );

  return (
    <div className="scenario-direct-provincial-container" style={{ position: 'relative' }}>
      {/* 视图主体渲染 */}
      {currentRole === 'cityPolice' && renderCityView()}
      {currentRole === 'countyPolice' && renderCountyView()}

      {/* 弹窗与抽屉 */}
      {renderDispatchModal()}
      {renderCityFeedbackModal()}
      {renderFeedbackModal()}
      {renderAiModal()}
      {renderCountyDetailDrawer()}
    </div>
  );
};

export default ScenarioSecondaryDispatch;
