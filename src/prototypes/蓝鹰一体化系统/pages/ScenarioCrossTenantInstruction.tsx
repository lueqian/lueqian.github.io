import React, { useState } from 'react';
import {
  Button,
  message,
  Card,
  Row,
  Col,
  Checkbox,
  Tag,
  Badge,
  Modal,
  Drawer,
  Tooltip,
  Alert,
  Space,
  Input,
  DatePicker,
  Select,
  Pagination,
  Switch,
  Upload,
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
  UserOutlined,
  LockOutlined,
  ApartmentOutlined,
  PaperClipOutlined,
  InboxOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// 指令流转状态类型
export type InstructionFlowStatus =
  | 'draft' // 未下发草稿
  | 'issued' // 已下发推至徐州待办池，待签收 (version: 1)
  | 'claimed_userA' // 用户 A (当前民警) 签收办理成功 (version: 2)
  | 'claimed_userB' // 用户 B (同事张警官) 先行签收 (version: 2)
  | 'feedback_submitted'; // 已提交反馈待省厅确认

const ScenarioCrossTenantInstruction: React.FC = () => {
  // 当前环境主视图：'provincial' (省厅内网端) | 'cityXuzhou' (徐州市局内网端)
  const [currentView, setCurrentView] = useState<'provincial' | 'cityXuzhou'>('provincial');

  // 核心指令业务流转状态
  const [instructionStatus, setInstructionStatus] = useState<InstructionFlowStatus>('issued');
  const [optimisticVersion, setOptimisticVersion] = useState<number>(1);
  const [targetTenant, setTargetTenant] = useState<string>('xuzhou');
  const [instructionTypes, setInstructionTypes] = useState<string[]>(['落地核查', '应急处置']);
  const [instructionContent, setInstructionContent] = useState<string>(
    '请徐州市局网安支队立即对涉事网民线下动向进行落地核查，限今日 18:00 前反馈核查笔录与处置结果。'
  );
  const [issueTimestamp, setIssueTimestamp] = useState<string>('2026-10-09 09:30:15');
  const [claimTimestamp, setClaimTimestamp] = useState<string>('');
  const [claimOperator, setClaimOperator] = useState<string>('待认领');

  // 反馈内容
  const [feedbackTitle, setFeedbackTitle] = useState<string>(
    '【反馈】关于徐州某工业园区网络谣言线索排查处置报告'
  );
  const [feedbackContent, setFeedbackContent] = useState<string>(
    '已会同属地贾汪网安大队完成对发帖网民王某的落地约谈，当事人已主动删除不实视频，未引发次生舆情。核查笔录与现场照片已存证入库。'
  );

  // 弹窗状态
  const [aiModalOpen, setAiModalOpen] = useState(false); // 视图 2：AI 辅助研判与跨租户指令下发大弹窗
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false); // 视图 4：市局应急处置反馈弹窗
  const [payloadDrawerOpen, setPayloadDrawerOpen] = useState(false); // 载荷自描述包详情抽屉

  // 视图检索过滤与 Tab 状态
  const [provincialStreamView, setProvincialStreamView] = useState<'detail' | 'analysis' | 'brief'>('analysis');
  const [cityTabKey, setCityTabKey] = useState<string>('todo');

  // 悬浮演示控制台状态（继承统一右上角平滑收纳、静默半透明、防溢出展开规范）
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

  // 处理控制台拖拽起始
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

  // 1. 省厅端下达跨租户指令
  const handleIssueInstruction = () => {
    setInstructionStatus('issued');
    setOptimisticVersion(1);
    setIssueTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setAiModalOpen(false);
    message.success({
      content: '跨租户指令下达成功！跨系统跟踪标识：CMD-2026-XUZHOU-001，已激活载荷自描述推入徐州市局待办池',
      duration: 4,
    });
  };

  // 2. 分支 A：用户 A 抢占办理成功 (正常路径)
  const handleClaimByUserA = () => {
    // 乐观锁版本校验
    if (optimisticVersion !== 1 || instructionStatus === 'claimed_userB') {
      message.error({
        content: '【乐观锁并发拦截】该指令已被同事 [张警官 (支队值班岗)] 抢先签收办理，正在刷新状态！',
        duration: 3,
      });
      setInstructionStatus('claimed_userB');
      setClaimOperator('张警官 (支队值班岗)');
      return;
    }
    setInstructionStatus('claimed_userA');
    setOptimisticVersion(2);
    setClaimOperator('当前用户 (支队值班岗)');
    setClaimTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    message.success('【签收办理成功】乐观锁校验通过 (版本: v1 -> v2)，已锁定为您经办！');
  };

  // 3. 分支 B：模拟用户 B 并发抢占冲突 (拦截路径)
  const handleSimulateUserBConflict = () => {
    setInstructionStatus('claimed_userB');
    setOptimisticVersion(2);
    setClaimOperator('张警官 (支队值班岗)');
    setClaimTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    message.warning({
      content: '【模拟场景】同事 [张警官 (支队值班岗)] 已抢先在内网签收了该指令！',
      duration: 3,
    });
  };

  // 4. 提交处置反馈
  const handleSubmitFeedback = () => {
    setInstructionStatus('feedback_submitted');
    setFeedbackModalOpen(false);
    message.success('处置反馈已成功提交！数据实时同步回省厅发起端待复核确认。');
  };

  // 5. 重置全流程演示
  const handleResetDemo = () => {
    setCurrentView('provincial');
    setInstructionStatus('issued');
    setOptimisticVersion(1);
    setClaimOperator('待认领');
    setClaimTimestamp('');
    setAiModalOpen(false);
    setFeedbackModalOpen(false);
    setPayloadDrawerOpen(false);
    message.info('场景演示已重置为初始待办状态。');
  };

  // =========================================================================
  // 视图 1：省厅端 - 监测预警与研判发起 (1:1 参考图 1 真实系统)
  // =========================================================================
  const renderProvincialView = () => (
    <div className="provincial-view-wrapper">
      {/* 顶部公安内网环境标识 */}
      <div className="scenario-env-header env-intranet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 公安内网环境 · 省厅总队端
          </span>
          <span className="scenario-env-title" style={{ color: '#ffffff' }}>
            江苏省公安厅网安总队 · 智控研判处置平台
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#bae0ff' }}>
            （值班长：李警官 ｜ 路由：/provincial/monitor/warning-list）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => setCurrentView('cityXuzhou')}
            style={{ background: '#1677ff' }}
          >
            前往徐州市局待办池 (视图 3) <ArrowRightOutlined />
          </Button>
        </Space>
      </div>

      {/* 状态横幅 */}
      <Alert
        message={
          instructionStatus === 'feedback_submitted'
            ? '跨租户闭环达成：徐州市公安局网安支队已反馈处置结果，核查落地事实清楚，舆情已平息。'
            : instructionStatus === 'claimed_userA'
            ? '指令跟踪：徐州市公安局网安支队民警已签收办理，正在线下落地核查中……'
            : instructionStatus === 'claimed_userB'
            ? '指令跟踪：徐州市公安局网安支队张警官已签收办理中……'
            : '重点舆情待研判：监测发现网民发布涉及徐州某园区重点工程不实言论，请通过【AI研判】向徐州市局下达处置指令。'
        }
        type={instructionStatus === 'feedback_submitted' ? 'success' : 'info'}
        showIcon
        style={{ marginBottom: 14 }}
      />

      {/* 顶部检索与视图切换栏 (1:1 参考图 1) */}
      <div className="stream-filter-container">
        <div className="stream-filter-top-row">
          <div className="stream-filter-field">
            <span className="stream-filter-label">内容搜索</span>
            <Input
              placeholder="可输入标题/正文/作者/ID"
              style={{ width: 200 }}
              defaultValue="徐州工业园区涉污"
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
          </Space>
        </div>
      </div>

      {/* 模块二级 Tab 栏 (1:1 参考图 1) */}
      <div className="stream-tabs-bar">
        <div className="stream-tabs-list">
          <div className="stream-tab-item">
            <span className="stream-ai-pill">AI</span> 全部
          </div>
          <div className="stream-tab-item">研判建议</div>
          <div className="stream-tab-item">
            <span className="stream-ai-pill">AI</span> 智能预警
          </div>
          <div className="stream-tab-item">
            <span className="stream-ai-pill">AI</span> 重点账号
          </div>
          <div className="stream-tab-item">专项巡查</div>
          <div className="stream-tab-item">本地舆情</div>
          <div className="stream-tab-item">重点源</div>
          <div className="stream-tab-item">待认领舆情</div>
          <div className="stream-tab-item active">
            本地上报
            <Badge count={1} size="small" style={{ backgroundColor: '#1677ff', marginLeft: 2 }} />
          </div>
          <div className="stream-tab-item">通报信息</div>
        </div>

        <Button
          type="primary"
          icon={<FormOutlined />}
          size="small"
          style={{ borderRadius: 4 }}
          onClick={() => setAiModalOpen(true)}
        >
          AI研判下发
        </Button>
      </div>

      {/* 舆情卡片流 (1:1 还原图 1) */}
      <div className="stream-cards-wrapper">
        <div className="stream-card-box">
          {/* 卡片头部行 */}
          <div className="stream-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Checkbox defaultChecked={false} />
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: 13, marginRight: 2 }}>
                1
              </span>
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
              <span style={{ color: '#64748b', fontSize: 12 }}>2.5星</span>
            </div>
          </div>

          {/* 元数据行 */}
          <div className="stream-card-meta">
            <span style={{ color: '#1e293b', fontWeight: 600 }}>人间万象</span>
            <span>ID 3766282728521547</span>
            <span><EnvironmentOutlined style={{ color: '#1677ff' }} /> 淮安区，淮安市（涉事转徐州）</span>
            <span><ClockCircleOutlined /> 2026-10-08 16:07:27</span>
          </div>

          {/* 舆情主标题与正文 (参考图 1) */}
          <div className="stream-card-title-content">
            淮安区的小黄毛真是太猖狂了。#淮安 #淮安美食 #河下古镇 来淮安一趟，车停在淮安区万达对面，有监控都能撬车门，外地牌的朋友千万别停翔宇大道，河下古镇附近，撬车门的小黄毛有点多。
          </div>

          {/* 双色块 AI 摘要与研判 + 右侧大尺寸舆情指数 45.00 */}
          <div className="stream-card-split-body">
            <div className="stream-card-analysis-side">
              {/* 浅绿色 AI 摘要 */}
              <div className="stream-card-ai-badge-box">
                <span style={{ background: '#52c41a', color: '#fff', fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  AI 摘要
                </span>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  淮安区河下古镇及翔宇大道附近频发撬车门盗窃案件，引发外地游客对当地治安环境的不满与警示。
                </div>
              </div>

              {/* 浅橙色 AI 研判 */}
              <div className="stream-card-opinion-badge-box">
                <span style={{ background: '#fa8c16', color: '#fff', fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  AI 研判
                </span>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#c2410c' }}>【风险定性】：</span>
                  一般治安案件舆情，存在局部负面口碑扩散的隐患。
                  <span style={{ fontWeight: 600, color: '#c2410c', marginLeft: 8 }}>【处置建议】：</span>
                  建议总队指令下发徐州及周边地市协同关注排查。
                </div>
              </div>
            </div>

            {/* 右侧大号紫色舆情指数 45.00 (1:1 参考图 1) */}
            <div className="stream-card-index-card">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#7c3aed', lineHeight: 1.1 }}>
                45.00
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', opacity: 0.85, marginTop: 4 }}>
                舆情指数
              </div>
            </div>
          </div>

          {/* 标签池 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <Tag color="blue">数据来源: 快捷指令</Tag>
            <Tag color="cyan">淮安市</Tag>
            <Tag color="geekblue">淮安区</Tag>
            <Tag color="volcano">反映突出治安问题</Tag>
          </div>

          {/* 底部操作栏 (参考图 1：一键搜素、复制信息、未处置、信息详情、AI研判、推送) */}
          <div className="stream-card-actions-bar">
            <Space>
              <Button type="link" size="small" style={{ paddingLeft: 0 }}>一键搜索</Button>
              <Button type="link" size="small">复制信息</Button>
              <Tag color="orange">未处置</Tag>
              <Button type="link" size="small">信息详情</Button>
            </Space>

            {/* 核心操作：点击打开 AI 辅助研判弹窗 (进入视图 2) */}
            <Space>
              <Button
                type="primary"
                icon={<RobotOutlined />}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
                onClick={() => setAiModalOpen(true)}
              >
                AI研判
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => setAiModalOpen(true)}
              >
                下达处置指令
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 视图 2：省厅端 - 跨租户指令下发大弹窗 (1:1 参考图 2 改造)
  // =========================================================================
  const renderAiAnalysisModal = () => (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>AI辅助研判</span>
          <Tag color="blue">跨租户指令生成引擎</Tag>
        </div>
      }
      open={aiModalOpen}
      onCancel={() => setAiModalOpen(false)}
      width={1040}
      footer={[
        <Button key="cancel" onClick={() => setAiModalOpen(false)}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SendOutlined />}
          style={{ background: '#1677ff' }}
          onClick={handleIssueInstruction}
        >
          完成研判 / 下达指令并推至徐州市局待办池
        </Button>,
      ]}
    >
      {/* 顶部标题与标签概述行 (参考图 2) */}
      <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 6 }}>
          淮安区的小黄毛真是太猖狂了。#淮安 #淮安美食 #河下古镇 来淮安一趟，车停在淮安区万达对面，有监控都能撬车门……
        </div>
        <Space size={6} wrap>
          <span style={{ fontSize: 12, color: '#8c8c8c' }}>涉事属地：淮安市 责任属地：</span>
          <Tag color="blue" closable={false}>淮安区</Tag>
          <Tag color="blue" closable={false}>淮安市</Tag>
          <Tag color="cyan">数据来源: 快捷指令</Tag>
          <Tag color="geekblue">17 小时前 2026-10-08 16:26:18 支队 - [支队-张邵春]</Tag>
          <Tag color="purple">非热敏</Tag>
          <Tag color="warning">未处置</Tag>
          <span style={{ color: '#faad14', fontSize: 12, marginLeft: 10 }}>★ ★ ★ ☆ ☆ 2.5星</span>
        </Space>
      </div>

      {/* 左右分栏布局 (1:1 参考图 2) */}
      <div className="ai-analysis-modal-body">
        {/* 左侧：事件概述、原发热度、相似信息 */}
        <div className="ai-analysis-left-col">
          <div className="section-sub-title">事件概述</div>
          <div className="stream-card-split-body" style={{ marginTop: 6 }}>
            <div className="stream-card-analysis-side">
              <div className="stream-card-ai-badge-box">
                <span style={{ background: '#52c41a', color: '#fff', fontSize: 11, padding: '1px 6px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  AI 摘要
                </span>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  淮安区河下古镇及翔宇大道附近频发撬车门盗窃案件，引发外地游客对当地治安环境的不满与警示。
                </div>
              </div>

              <div className="stream-card-opinion-badge-box">
                <span style={{ background: '#fa8c16', color: '#fff', fontSize: 11, padding: '1px 6px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  AI 研判
                </span>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  【风险定性】：一般治安案件舆情，存在局部负面口碑扩散的隐患。涉事车辆为外地牌照，存在跨地市关联，建议由省厅协调徐州市局核查。
                </div>
              </div>
            </div>

            <div className="stream-card-index-card" style={{ width: 84 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed' }}>45.00</div>
              <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 2 }}>舆情指数</div>
            </div>
          </div>

          <div className="section-sub-title" style={{ marginTop: 16 }}>附件总览</div>
          <div style={{ background: '#fafafa', border: '1px dashed #d9d9d9', borderRadius: 6, padding: '24px 0', textAlign: 'center', color: '#bfbfbf', fontSize: 12 }}>
            <InboxOutlined style={{ fontSize: 24, marginBottom: 4 }} />
            <div>暂无数据附件</div>
          </div>

          <div className="section-sub-title" style={{ marginTop: 16 }}>原发热度</div>
          <div style={{ fontSize: 12, color: '#595959', lineHeight: 1.6 }}>
            淮安区的小黄毛真是太猖狂了。#淮安 #淮安美食 #河下古镇……
            <div style={{ color: '#8c8c8c', marginTop: 4 }}>
              2026-10-08 16:07:27 ｜ 今日头条 ｜ 人间万象
            </div>
          </div>

          <div className="section-sub-title" style={{ marginTop: 16 }}>相似信息 0</div>
          <div style={{ color: '#bfbfbf', fontSize: 12 }}>暂无相似信息</div>
        </div>

        {/* 右侧：处置详情 / 分析研判工作台 (核心增量：跨租户指令下发与载荷自描述) */}
        <div className="ai-analysis-right-col">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: 8, marginBottom: 12 }}>
            <Space size={16}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1677ff', borderBottom: '2px solid #1677ff', paddingBottom: 6 }}>
                分析研判
              </span>
              <span style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>处置过程</span>
              <span style={{ fontSize: 13, color: '#6b7280', cursor: 'pointer' }}>处置详情</span>
            </Space>
            <Tag color="processing">下达处置指令</Tag>
          </div>

          {/* 下一步指令下达 */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937' }}>● 下一步指令下达</span>
            <Tag color="orange" style={{ marginLeft: 8 }}>未上传视频</Tag>
          </div>

          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 10 }}>常用指令</div>

          {/* 本单位指令 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
              | 本单位指令
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              补充指令内容：<span style={{ color: '#1677ff', cursor: 'pointer' }}>填写</span>
            </div>
          </div>

          {/* 执行单位指令 (核心增量改造：跨租户下发至徐州市局) */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                | 执行单位指令（跨租户协同穿透）
              </div>
              <Tag color="purple">跨公司租户穿透</Tag>
            </div>

            {/* 执行单位下拉选择 (挂载 AxHub 图钉批注 1) */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                选择跨租户执行节点：
              </div>
              <Annotated
                pin={1}
                title="跨租户路由寻址规则"
                note="路由寻址规则：检测目标为独立部署地市时，绕过本地指令岗位字典，检索目标租户下 is_cross_tenant_receiver = true 的岗位集合推送待办池。"
                tag="路由寻址规则"
                placement="top-right"
              >
                <div className="incremental-container" style={{ width: '100%' }}>
                  <Select
                    value={targetTenant}
                    onChange={(val) => setTargetTenant(val)}
                    style={{ width: '100%' }}
                    className="incremental-highlight"
                  >
                    <Option value="xuzhou">徐州市公安局 (独立部署地市租户 · 跨网)</Option>
                    <Option value="changzhou">常州市公安局 (独立部署地市租户)</Option>
                    <Option value="huaian">淮安市公安局 (本级内网租户)</Option>
                  </Select>
                  <span className="incremental-badge">改</span>
                </div>
              </Annotated>
            </div>

            {/* 载荷自描述卡片 Payload Self-description (挂载 AxHub 图钉批注 2) */}
            {targetTenant === 'xuzhou' && (
              <Annotated
                pin={2}
                title="Payload Self-description 机制"
                note="Payload Self-description 机制：强制打包指令名称、分类、处置规范描述及截止时间，确保私有化地市无需配置省厅字典即可完全理解指令要求。"
                tag="载荷自描述机制"
                placement="top-right"
              >
                <div className="payload-self-describing-box incremental-highlight">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <CheckCircleFilled style={{ color: '#16a34a', fontSize: 14 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#15803d' }}>
                      已激活跨租户标准载荷 (Payload Self-description)
                    </span>
                    <span className="incremental-badge" style={{ position: 'static' }}>改</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.5 }}>
                    检测到【徐州市公安局】为独立部署私有化租户。系统已自动打包指令分类规范、处置步骤与时效要求，直接穿透至徐州市局内网【应急处置 - 待处理】待办池。
                  </div>
                </div>
              </Annotated>
            )}

            {/* 指令分类复选 */}
            <div style={{ marginTop: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                指令任务分类：
              </div>
              <Checkbox.Group
                options={['落地核查', '应急处置', '信息通报', '动态监测']}
                value={instructionTypes}
                onChange={(checked) => setInstructionTypes(checked as string[])}
              />
            </div>

            {/* 指令内容 */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>
                补充指令内容（预置规范）：
              </div>
              <TextArea
                rows={3}
                value={instructionContent}
                onChange={(e) => setInstructionContent(e.target.value)}
                placeholder="请输入具体的指令描述与规范"
              />
            </div>

            {/* 反馈时效 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
              <span>反馈时效要求：</span>
              <Tag color="red" style={{ fontWeight: 600 }}>限 4 小时内反馈 (今日 18:00 前)</Tag>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  // =========================================================================
  // 视图 3：市局端 - 应急处置待办池与并发抢占 (1:1 参考图 3 真实系统)
  // =========================================================================
  const renderCityXuzhouView = () => (
    <div className="city-xuzhou-view-wrapper">
      {/* 顶部公安内网环境标识 */}
      <div className="scenario-env-header env-city-audit">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <ApartmentOutlined /> 地市接收端 · 私有化租户
          </span>
          <span className="scenario-env-title">
            徐州市公安局网安支队 · 舆情一体化智控平台
          </span>
          <span className="scenario-env-subtitle">
            （值班岗：李四 / 岗位：支队值班岗 ｜ 路由：/city-xuzhou/emergency/task-list）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('provincial')}
          >
            ← 返回省厅总队端 (视图 1)
          </Button>
        </Space>
      </div>

      {/* 待办通知横幅 */}
      <Alert
        message={
          instructionStatus === 'feedback_submitted'
            ? '该指令已处置完成并提交反馈，正在等待省厅总队复核销号。'
            : instructionStatus === 'claimed_userA'
            ? '您已成功抢占签收该省厅指令（责任人：当前用户）！请线下核查后点击【提交反馈】录入处置结果。'
            : instructionStatus === 'claimed_userB'
            ? '该省厅指令已被同事 [张警官 (支队值班岗)] 抢先签收办理，您无须重复处置。'
            : '当前待办池有 1 条来自省厅网安总队的跨租户下发指令待签收抢占！'
        }
        type={
          instructionStatus === 'feedback_submitted'
            ? 'success'
            : instructionStatus === 'claimed_userA'
            ? 'info'
            : instructionStatus === 'claimed_userB'
            ? 'warning'
            : 'error'
        }
        showIcon
        style={{ marginBottom: 14 }}
      />

      {/* 顶部检索表单 (1:1 参考图 3) */}
      <div className="stream-filter-container">
        <Row gutter={[12, 10]}>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">报送信息全文搜</span>
              <Input placeholder="请输入昵称、网址、组合搜索" allowClear />
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">指令下发时间</span>
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">处置时间</span>
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">刊号</span>
              <Input placeholder="输入刊号查询" />
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">指令状态</span>
              <Select defaultValue="all" style={{ width: '100%' }}>
                <Option value="all">全部</Option>
                <Option value="pending">待处理</Option>
                <Option value="done">已处理</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">相关人员</span>
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="u1">李四 (支队值班岗)</Option>
                <Option value="u2">张警官 (支队值班岗)</Option>
              </Select>
            </div>
          </Col>
          <Col span={6}>
            <div className="stream-filter-field">
              <span className="stream-filter-label">编号</span>
              <Input placeholder="请输入编号" />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button size="small">重置</Button>
              <Button type="primary" size="small">查询</Button>
              <Button type="link" size="small" style={{ fontSize: 12 }}>收起 ^</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 任务列表 Tab 与开关 (1:1 参考图 3) */}
      <div className="stream-tabs-bar" style={{ borderRadius: 6, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>| 任务列表</span>
          <div className="stream-tabs-list">
            <div
              className={`stream-tab-item ${cityTabKey === 'todo' ? 'active' : ''}`}
              onClick={() => setCityTabKey('todo')}
            >
              待处理
              <Badge
                count={instructionStatus === 'issued' ? 1 : 0}
                size="small"
                style={{ backgroundColor: '#ff4d4f', marginLeft: 2 }}
              />
            </div>
            <div
              className={`stream-tab-item ${cityTabKey === 'done' ? 'active' : ''}`}
              onClick={() => setCityTabKey('done')}
            >
              已处理(6)
            </div>
            <div
              className={`stream-tab-item ${cityTabKey === 'report' ? 'active' : ''}`}
              onClick={() => setCityTabKey('report')}
            >
              信息编报(9)
            </div>
            <div
              className={`stream-tab-item ${cityTabKey === 'feedback' ? 'active' : ''}`}
              onClick={() => setCityTabKey('feedback')}
            >
              徐州反馈(1)
            </div>
            <div
              className={`stream-tab-item ${cityTabKey === 'all' ? 'active' : ''}`}
              onClick={() => setCityTabKey('all')}
            >
              全部
            </div>
          </div>
        </div>

        <Space size={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
            <Switch defaultChecked size="small" />
            <span>已打开自动消息提醒</span>
          </div>
          <Select defaultValue="desc" size="small" style={{ width: 140 }}>
            <Option value="desc">指令处理时间降序</Option>
            <Option value="asc">指令处理时间升序</Option>
          </Select>
        </Space>
      </div>

      {/* 待处理任务卡片列表 (1:1 参考图 3 风格与结构) */}
      <div className="stream-cards-wrapper" style={{ borderRadius: 6, borderTop: '1px solid #e5e7eb' }}>
        {/* 卡片 1：来自省厅下发的重点跨租户指令 */}
        <div className="stream-card-box" style={{ borderColor: '#93c5fd', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.08)' }}>
          {/* 任务状态条与胶囊 (1:1 参考图 3) */}
          <div className="emergency-task-strip">
            <Space size={8} wrap>
              {/* 醒目标识：省厅下发 */}
              <Tag
                style={{
                  background: '#1e40af',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: 4,
                  fontSize: 11,
                  padding: '1px 8px',
                  border: 'none',
                }}
              >
                [省厅下发] 跨租户指令
              </Tag>

              <Tag color="cyan" style={{ borderRadius: 999 }}>2个任务</Tag>
              <Tag color="purple" style={{ borderRadius: 999 }}>跟踪号: CMD-2026-XUZHOU-001</Tag>

              {/* 绿色任务类型胶囊 */}
              <Tag
                style={{
                  background: '#52c41a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 11,
                  padding: '1px 8px',
                }}
              >
                落地核查
              </Tag>

              {/* 倒计时胶囊：剩余 03小时58分 (参考图 3 红胶囊) */}
              <span className="countdown-pill-urgent">
                <ClockCircleOutlined /> 剩余 03小时58分
              </span>

              <span style={{ fontSize: 12, color: '#64748b' }}>
                下发人：江苏省公安厅网安总队 (李警官) ｜ 时效：4小时内
              </span>
            </Space>

            <Space>
              <Button
                size="small"
                type="link"
                icon={<PaperClipOutlined />}
                onClick={() => setPayloadDrawerOpen(true)}
              >
                查看指令规程
              </Button>
            </Space>
          </div>

          {/* 卡片头部行 */}
          <div className="stream-card-header" style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox />
              <span style={{ fontWeight: 600, color: '#1f2937', fontSize: 14 }}>
                关于徐州某工业园区网络谣言线索排查处置报告
              </span>
              <Tag color="blue">跨租户穿透</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#faad14', fontSize: 14 }}>★ ★ ★ ☆ ☆</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>3.0星</span>
            </div>
          </div>

          {/* 编号与要求正文 */}
          <div style={{ fontSize: 12, color: '#64748b', margin: '4px 0 8px' }}>
            编号：<code>CMD-2026-XUZHOU-001</code> ｜ 下发时间：{issueTimestamp}
          </div>

          {/* AI 摘要色块与初研研判色块 (参考图 3) */}
          <div className="stream-card-split-body" style={{ margin: '8px 0' }}>
            <div className="stream-card-analysis-side">
              <div className="stream-card-ai-badge-box">
                <span style={{ background: '#52c41a', color: '#fff', fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  AI 摘要
                </span>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  涉事网民在外市发布关于徐州某重点工业园区涉污及停工不实言论，煽动集聚维权。省厅指令要求徐州市局属地就地落地约谈。
                </div>
              </div>

              <div className="stream-card-opinion-badge-box">
                <span style={{ background: '#fa8c16', color: '#fff', fontSize: 11, padding: '1px 7px', borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>
                  省厅指令规范
                </span>
                <div style={{ fontSize: 12, color: '#374151' }}>
                  {instructionContent}
                </div>
              </div>
            </div>
          </div>

          {/* 任务状态、经办人与操作栏 */}
          <div className="stream-card-actions-bar">
            {/* 经办人与流转状态 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>经办人状态：</span>
              {instructionStatus === 'issued' && (
                <Tag color="default" style={{ fontWeight: 600 }}>
                  <UserOutlined /> 待认领 (全支队在岗民警可见)
                </Tag>
              )}
              {instructionStatus === 'claimed_userA' && (
                <Tag color="blue" style={{ fontWeight: 600 }}>
                  <CheckCircleFilled /> 处置中（经办人：当前民警）
                </Tag>
              )}
              {instructionStatus === 'claimed_userB' && (
                <Tag color="purple" style={{ fontWeight: 600 }}>
                  <LockOutlined /> 已被同事张警官认领
                </Tag>
              )}
              {instructionStatus === 'feedback_submitted' && (
                <Tag color="green" style={{ fontWeight: 600 }}>
                  <CheckCircleFilled /> 已提交反馈待总队销号
                </Tag>
              )}
            </div>

            {/* 核心操作列 (挂载 AxHub 图钉批注 3) */}
            <div>
              {instructionStatus === 'issued' && (
                <Annotated
                  pin={3}
                  title="并发防重签收机制"
                  note="防重机制：前端携带指令当前版本号发起签收请求；若捕获版本冲突（被同事先行签收），系统自动拦截并提示经办人姓名，杜绝重复处置。"
                  tag="并发防重"
                  placement="top-right"
                >
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    style={{ background: '#1677ff', borderColor: '#1677ff', minWidth: 110, fontWeight: 500 }}
                    onClick={handleClaimByUserA}
                  >
                    认领签收
                  </Button>
                </Annotated>
              )}

              {instructionStatus === 'claimed_userA' && (
                <Space size={10}>
                  <Button
                    style={{ borderColor: '#d9d9d9', color: '#595959' }}
                    onClick={() => setFeedbackModalOpen(true)}
                  >
                    办理反馈
                  </Button>
                  <Button
                    type="primary"
                    icon={<BranchesOutlined />}
                    style={{ background: '#1677ff', borderColor: '#1677ff', fontWeight: 500 }}
                    onClick={() => {
                      message.success('已开启二次转派，正在进入【场景 4：市局二次转派】...');
                      if (typeof window !== 'undefined') {
                        const url = new URL(window.location.href);
                        url.searchParams.set('page', 'scenario-secondary-dispatch');
                        window.location.href = url.toString();
                      }
                    }}
                  >
                    二次指派区县
                  </Button>
                </Space>
              )}

              {instructionStatus === 'claimed_userB' && (
                <Space>
                  <Button disabled icon={<CloseCircleOutlined />}>
                    已被同事张警官认领
                  </Button>
                  <Button size="small" onClick={() => setPayloadDrawerOpen(true)}>
                    调阅指令规程
                  </Button>
                </Space>
              )}

              {instructionStatus === 'feedback_submitted' && (
                <Space>
                  <Tag color="success">已反馈/待省厅确认</Tag>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => setFeedbackModalOpen(true)}
                  >
                    查看反馈内容
                  </Button>
                </Space>
              )}
            </div>
          </div>
        </div>

        {/* 卡片 2：本地普通历史处置任务 (1:1 还原图 3 丰富真实感) */}
        <div className="stream-card-box">
          <div className="stream-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox />
              <span style={{ fontWeight: 600, color: '#1f2937' }}>
                #淮安自来水 #vivo #s60
              </span>
              <Tag color="blue">已处置</Tag>
            </div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>编号: 202608110001</div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', margin: '4px 0' }}>
            AI摘要：淮安市民反映多地小区自来水出现刺鼻异味，疑似自来水管网污染，网安配合排查。
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <Tag color="default">信息编报已完成</Tag>
            <Tag color="success">已签收办结</Tag>
          </div>
        </div>

        {/* 底部翻页 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <Button icon={<ExportOutlined />} size="small">导出数据</Button>
          <Pagination size="small" total={2} current={1} pageSize={10} showTotal={(total) => `共 ${total} 条`} />
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // 视图 4：市局端 - 指令办理与反馈弹窗 (1:1 参考图 4 真实系统)
  // =========================================================================
  const renderFeedbackModal = () => (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>信息编报 / 处置反馈与成果报送</span>
          <span style={{ fontSize: 12, color: '#1677ff', cursor: 'pointer' }}>
            <CopyOutlined /> 一键复制
          </span>
        </div>
      }
      open={feedbackModalOpen}
      onCancel={() => setFeedbackModalOpen(false)}
      width={720}
      footer={[
        <Button key="close" onClick={() => setFeedbackModalOpen(false)}>
          关闭
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SendOutlined />}
          style={{ background: '#1677ff' }}
          onClick={handleSubmitFeedback}
        >
          提交工作请示 / 报送省厅
        </Button>,
      ]}
    >
      <div style={{ padding: '8px 0' }}>
        <Alert
          message="成果报送直通说明"
          description="该处置反馈将自动打包回传至省公安厅网安总队发起人待审池，核查笔录与存证材料将作为办结销号佐证。"
          type="info"
          showIcon
          style={{ marginBottom: 14 }}
        />

        {/* 标题 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
            <span style={{ color: '#ff4d4f' }}>*</span> 标题：
          </div>
          <Input
            value={feedbackTitle}
            onChange={(e) => setFeedbackTitle(e.target.value)}
            placeholder="请输入反馈标题"
          />
        </div>

        {/* 信息编报内容 (多行文本域) */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
              <span style={{ color: '#ff4d4f' }}>*</span> 信息编报内容（处置措施与成果）：
            </div>
            <Tag color="purple" style={{ fontSize: 11 }}>
              <RobotOutlined style={{ marginRight: 4 }} /> AI编报辅助
            </Tag>
          </div>
          <TextArea
            rows={5}
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            placeholder="请输入处置经过、落地约谈情况与当事人态度"
          />
        </div>

        {/* 佐证材料与附件 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
            佐证附件与核查笔录：
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <PaperClipOutlined style={{ color: '#1677ff' }} />
              <span>王某约谈询问笔录_已盖章.pdf (1.4MB)</span>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <PaperClipOutlined style={{ color: '#1677ff' }} />
              <span>现场劝导及删除视频证明.jpg (860KB)</span>
            </div>
          </div>
        </div>

        {/* 工作请示岗位 */}
        <div style={{ fontSize: 12, color: '#64748b' }}>
          工作请示岗位：<span style={{ color: '#1e293b', fontWeight: 600 }}>徐州市公安局网安支队值班岗</span>
        </div>
      </div>
    </Modal>
  );

  // =========================================================================
  // 载荷自描述包详情抽屉 (调阅跨租户底层封签)
  // =========================================================================
  const renderPayloadDrawer = () => (
    <Drawer
      title="跨租户载荷自描述包 (Payload Self-description) 架构详情"
      width={560}
      open={payloadDrawerOpen}
      onClose={() => setPayloadDrawerOpen(false)}
    >
      <Alert
        message="自描述数据包技术规格"
        description="针对私有化地市租户无省厅统一业务字典的问题，系统在网络摆渡层将指令所有元属性与结构规范完整打包为标准 JSON 载荷自描述封签。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <div style={{ background: '#1e293b', color: '#f8fafc', padding: 14, borderRadius: 6, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, overflowX: 'auto' }}>
        <pre style={{ margin: 0 }}>
{`{
  "tracking_id": "CMD-2026-XUZHOU-001",
  "issuer_tenant": "jiangsu_provincial_police",
  "issuer_unit": "江苏省公安厅网安总队指挥研判大厅",
  "target_tenant": "xuzhou_city_police",
  "target_routing_rule": "is_cross_tenant_receiver == true",
  "payload_self_description": {
    "instruction_types": ["落地核查", "应急处置"],
    "urgency": "high",
    "deadline_hours": 4,
    "deadline_time": "2026-10-09 18:00:00",
    "specification": "${instructionContent}",
    "optimistic_lock": {
      "initial_version": 1,
      "lock_type": "atomic_claim"
    }
  }
}`}
        </pre>
      </div>

      <div style={{ marginTop: 20, fontSize: 13, lineHeight: '24px', color: '#334155' }}>
        <p><strong>跟踪标识：</strong> <code>CMD-2026-XUZHOU-001</code></p>
        <p><strong>当前乐观锁版本：</strong> <Tag color="blue">v{optimisticVersion}</Tag></p>
        <p><strong>经办人认领状态：</strong> {claimOperator}</p>
        <p><strong>下发时间：</strong> {issueTimestamp}</p>
        {claimTimestamp && <p><strong>签收时间：</strong> {claimTimestamp}</p>}
      </div>
    </Drawer>
  );

  // =========================================================================
  // 悬浮导引控制台 (Glassmorphism 磨砂玻璃质感 · 统一右上角平滑收纳)
  // =========================================================================
  const renderFloatingGuideConsole = () => {
    const isStep1Active = true;
    const isStep2Active = instructionStatus !== 'draft';
    const isStep3Active = instructionStatus === 'claimed_userA' || instructionStatus === 'claimed_userB' || instructionStatus === 'feedback_submitted';
    const isStep4Active = instructionStatus === 'feedback_submitted';

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
          <Tooltip title="点击展开跨租户指令与多人待办指引面板" placement="left">
            <div
              className="scenario-guide-ball-inner"
              onClick={() => {
                setConsoleCollapsed(false);
                setHasCustomPos(false);
              }}
            >
              <CompassOutlined style={{ fontSize: 20 }} />
              <span className="guide-ball-badge">
                {currentView === 'provincial' ? '1/4' : instructionStatus === 'issued' ? '2/4' : instructionStatus === 'feedback_submitted' ? '4/4 ✓' : '3/4'}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div className="guide-console-full-content">
            {/* 头部 */}
            <div className="guide-console-header" onMouseDown={handleStartDrag}>
              <div className="guide-header-title">
                <HolderOutlined style={{ opacity: 0.45, cursor: 'grab', marginRight: 2 }} />
                <span className="guide-badge-pill">场景 3</span>
                <span className="guide-header-title-text" title="跨租户指令与多人待办">
                  跨租户指令与多人待办
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
              {/* 四等分胶囊进度条 */}
              <div className="guide-progress-bar-container">
                <div className={`guide-progress-pill ${isStep1Active ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${isStep2Active ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${isStep3Active ? 'active' : ''}`} />
                <div className={`guide-progress-pill ${isStep4Active ? 'active' : ''}`} />
              </div>

              {/* 进度步骤文本 */}
              <div className="guide-step-labels" style={{ fontSize: 11 }}>
                <span className={`guide-step-label-item ${currentView === 'provincial' ? 'active' : ''}`}>
                  1. 省厅研判
                </span>
                <span className={`guide-step-label-item ${currentView === 'cityXuzhou' && instructionStatus === 'issued' ? 'active' : ''}`}>
                  2. 市局待办
                </span>
                <span className={`guide-step-label-item ${instructionStatus === 'claimed_userA' || instructionStatus === 'claimed_userB' ? 'active' : ''}`}>
                  3. 认领签收
                </span>
                <span className={`guide-step-label-item ${instructionStatus === 'feedback_submitted' ? 'active' : ''}`}>
                  4. 反馈闭环
                </span>
              </div>

              {/* 指引卡片 */}
              <div className="guide-step-card-light" style={{ marginTop: 10 }}>
                <InfoCircleOutlined style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }} />
                <div className="guide-step-card-text">
                  {currentView === 'provincial' && (
                    <span>
                      当前处于省厅总队端。点击【AI研判下发】弹窗，向跨租户的【徐州市公安局】下达载荷自描述指令，系统将自动打包推入徐州内网待办池。
                    </span>
                  )}
                  {currentView === 'cityXuzhou' && instructionStatus === 'issued' && (
                    <span>
                      指令已推入徐州市局待办池（全支队可见）。可测试【正常签收抢占 (分支 A)】或【模拟并发冲突拦截 (分支 B)】体会乐观锁防重机制。
                    </span>
                  )}
                  {currentView === 'cityXuzhou' && instructionStatus === 'claimed_userA' && (
                    <span style={{ color: '#16a34a', fontWeight: 500 }}>
                      分支 A 成功：您已抢占该指令并锁定责任人！请点击【提交处置反馈】录入工作成果并回传省厅。
                    </span>
                  )}
                  {currentView === 'cityXuzhou' && instructionStatus === 'claimed_userB' && (
                    <span style={{ color: '#dc2626', fontWeight: 500 }}>
                      分支 B 拦截：同事张警官已抢先办理，系统乐观锁拦截了重复签收操作，状态自动刷新置灰！
                    </span>
                  )}
                  {instructionStatus === 'feedback_submitted' && (
                    <span style={{ color: '#16a34a', fontWeight: 500 }}>
                      全流程闭环达成：徐州市局已提交反馈，数据实时同步回省厅总队！
                    </span>
                  )}
                </div>
              </div>

              {/* 核心快捷操作区 */}
              <div className="no-drag" style={{ marginTop: 10 }}>
                {currentView === 'provincial' ? (
                  <>
                    <button
                      className="guide-btn-sub"
                      onClick={() => setAiModalOpen(true)}
                    >
                      <RobotOutlined style={{ fontSize: 12 }} /> 呼出【AI辅助研判与跨租户指令】弹窗
                    </button>
                    <button
                      className="guide-btn-primary"
                      onClick={() => setCurrentView('cityXuzhou')}
                    >
                      前往徐州市局待办池 (视图 3) <ArrowRightOutlined style={{ fontSize: 12 }} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* 乐观锁抢占测试双按钮 */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <button
                        className="guide-btn-sub"
                        style={{ flex: 1, color: '#16a34a', borderColor: '#86efac', marginBottom: 0 }}
                        onClick={handleClaimByUserA}
                      >
                        测试分支 A: 正常抢占
                      </button>
                      <button
                        className="guide-btn-sub"
                        style={{ flex: 1, color: '#dc2626', borderColor: '#fca5a5', marginBottom: 0 }}
                        onClick={handleSimulateUserBConflict}
                      >
                        测试分支 B: 冲突拦截
                      </button>
                    </div>

                    {instructionStatus === 'claimed_userA' && (
                      <button
                        className="guide-btn-primary"
                        onClick={() => setFeedbackModalOpen(true)}
                      >
                        呼出【信息编报与反馈弹窗】(视图 4) <ArrowRightOutlined style={{ fontSize: 12 }} />
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
                        marginTop: 4,
                      }}
                    >
                      <ReloadOutlined style={{ fontSize: 12 }} /> 重置全流程演示
                    </button>
                  </>
                )}
              </div>

              {/* 视图分段控制器 */}
              <div className="guide-segmented-wrapper no-drag">
                <div
                  className={`guide-segmented-item ${currentView === 'provincial' ? 'active' : ''}`}
                  onClick={() => setCurrentView('provincial')}
                >
                  省厅研判
                </div>
                <div
                  className={`guide-segmented-item ${currentView === 'cityXuzhou' ? 'active' : ''}`}
                  onClick={() => setCurrentView('cityXuzhou')}
                >
                  市局待办
                </div>
                <div
                  className="guide-segmented-item"
                  onClick={() => {
                    setCurrentView('cityXuzhou');
                    setFeedbackModalOpen(true);
                  }}
                >
                  办理反馈
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="scenario-cross-tenant-container" style={{ position: 'relative' }}>
      {/* 视图主体渲染 */}
      {currentView === 'provincial' && renderProvincialView()}
      {currentView === 'cityXuzhou' && renderCityXuzhouView()}

      {/* 业务弹窗群 */}
      {renderAiAnalysisModal()}
      {renderFeedbackModal()}
      {renderPayloadDrawer()}

      {/* 悬浮导引控制台 */}
      {renderFloatingGuideConsole()}
    </div>
  );
};

export default ScenarioCrossTenantInstruction;
