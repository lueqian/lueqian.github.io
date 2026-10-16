import React, { useState, useEffect } from 'react';
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
  Alert,
  Space,
  Input,
  Select,
  Tooltip,
  Switch,
  Radio,
  Tabs,
  Pagination,
} from 'antd';
import {
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  RobotOutlined,
  ReloadOutlined,
  SendOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  WarningFilled,
  ApartmentOutlined,
  BellOutlined,
  FileTextOutlined,
  RadarChartOutlined,
  PlayCircleFilled,
  LikeOutlined,
  StarFilled,
  SearchOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import InstructionCommandModal from '../components/InstructionCommandModal';
import DirectiveFailureModal from '../components/DirectiveFailureModal';
import AIAnalysisModal from '../components/AIAnalysisModal';
import { useDirectiveState } from '../context/DirectiveStateContext';
import '../scenario-style.css';

const ScenarioJointDisposalFailure: React.FC = () => {
  const { setCurrentStep, setActionButton, currentRoleView, activeAnchor } = useScenarioContext();
  const {
    directives,
    notifications,
    retryDirective,
    batchRetryDirectives,
    issueNewDirectives,
    openAiModal,
  } = useDirectiveState();

  // 核心业务视角：'monitor' (省厅内网·监测预警-发起端) ↔ 'emergency' (省厅内网·应急处置-卡片指令明细与重发)
  const [currentPerspective, setCurrentPerspective] = useState<'monitor' | 'emergency'>('monitor');
  const [instructionModalOpen, setInstructionModalOpen] = useState<boolean>(false);
  const [failureModalOpen, setFailureModalOpen] = useState<boolean>(false);
  const [emergencyTaskTab, setEmergencyTaskTab] = useState<string>('feedback');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // 监测预警筛选状态
  const [monitorCategory, setMonitorCategory] = useState<string>('ai-discover');
  const [monitorSearch, setMonitorSearch] = useState<string>('#盱眙马上真的要命');

  // 获取清江浦区与徐州市指令
  const qjpDirective = directives.find(
    (d) => d.eventId === '202610150002' && d.targetDept === '清江浦区' && d.instructionName === '帖文处置'
  );
  const followUpDirective = directives.find(
    (d) => d.eventId === '202610150002' && d.targetDept === '徐州市' && d.instructionName === '持续关注'
  );

  const isQjpFailed = qjpDirective?.status === 'failed';
  const isFollowUpFailed = followUpDirective?.status === 'failed';
  const hasFailedDirectives = directives.some((d) => d.status === 'failed');

  // 监听右侧规格抽屉点击锚点，平滑联动切换视角
  useEffect(() => {
    if (activeAnchor) {
      if (activeAnchor === 1) {
        setCurrentPerspective('monitor');
      } else if (activeAnchor === 2) {
        setFailureModalOpen(true);
      } else if (activeAnchor === 3 || activeAnchor === 4) {
        setCurrentPerspective('emergency');
      }
    }
  }, [activeAnchor]);

  // 监听顶栏切换与联动
  useEffect(() => {
    if (currentRoleView) {
      if (currentRoleView === 'dispatch') {
        setCurrentPerspective('monitor');
      } else if (currentRoleView === 'failure-modal') {
        setCurrentPerspective('monitor');
        setFailureModalOpen(true);
      } else if (currentRoleView === 'card-retry') {
        setCurrentPerspective('emergency');
      } else if (currentRoleView === 'msg-center') {
        setCurrentPerspective('emergency');
      }
    }
  }, [currentRoleView]);

  // 联动 ScenarioLayout 的步骤和右侧主操作按钮
  useEffect(() => {
    if (currentPerspective === 'monitor') {
      setCurrentStep(1);
      setActionButton({
        label: '呼出 AI研判下达指令 ➔',
        onClick: () => openAiModal(null, 'monitor'),
      });
    } else {
      if (isQjpFailed) {
        setCurrentStep(3);
        setActionButton({
          label: '行内重新下发补发 ➔',
          onClick: () => qjpDirective && handleInlineRetry(qjpDirective.id),
        });
      } else {
        setCurrentStep(4);
        setActionButton({
          label: '模拟专网超时重新演练 ↺',
          onClick: handleResetDemo,
        });
      }
    }
  }, [currentPerspective, isQjpFailed, setCurrentStep, setActionButton]);

  const handleInlineRetry = async (directiveId: string) => {
    setRetryingId(directiveId);
    try {
      await retryDirective(directiveId);
    } finally {
      setRetryingId(null);
    }
  };

  const handleResetDemo = async () => {
    await issueNewDirectives(
      '202610150002',
      ['帖文处置'],
      ['清江浦区', '淮安区', '淮阴区'],
      '请对帖文展开劝删处置工作',
      true
    );
    message.info('已重新模拟生成跨租户专网网闸波动异常（清江浦区推送失败）。');
  };

  return (
    <div className="provincial-view-wrapper" style={{ position: 'relative' }}>
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-intranet" style={{ marginBottom: 14 }}>
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 公安内网 · 多租户联合处置协同中心
          </span>
          <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600 }}>
            场景 6：跨租户多单位联合处置指令推送失败与全链路容灾补发
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button
            size="small"
            type="primary"
            icon={<SendOutlined />}
            onClick={() => setInstructionModalOpen(true)}
            style={{ background: '#2563eb' }}
          >
            直接下发指令测试
          </Button>
          <Button
            size="small"
            icon={<ExclamationCircleOutlined />}
            danger={hasFailedDirectives}
            onClick={() => setFailureModalOpen(true)}
          >
            查验推送结果大弹窗
          </Button>
          <Button size="small" icon={<ReloadOutlined />} onClick={handleResetDemo}>
            重置演示状态
          </Button>
        </div>
      </div>

      {/* 顶部容灾与时效机制提示卡 */}
      <Alert
        type={isQjpFailed ? 'error' : 'success'}
        showIcon
        message={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '13.5px' }}>
              {isQjpFailed
                ? '⚠️ 跨租户专网网闸异常阻断：已向 3 家单位下发指令，其中 1 家推送超时失败'
                : '✅ 跨租户专网链路已全量连通：所有协同单位指令均已成功送达目标内网待办池'}
            </strong>
            <span style={{ fontSize: '12px', fontWeight: 'normal' }}>
              {isQjpFailed
                ? '清江浦区网安大队内网未接收 · 处置时效已自动挂起'
                : '清江浦区网安大队内网已接收 · 处置时效恢复正常计时'}
            </span>
          </div>
        }
        description={
          <div style={{ fontSize: '12.5px', lineHeight: '20px', marginTop: 4 }}>
            <strong>【全链路容灾闭环】</strong>：指令在<strong>省厅监测预警</strong>通过【AI辅助研判】下达，支持<strong>全流程Loading安全校验</strong>；若专网抖动丢包，<strong>即刻呼出排查弹窗</strong>并<strong>自动挂起目标单位时效</strong>；在<strong>应急处置卡片明细</strong>支持行内重发，成功后顶栏消息中心告警<strong>自动消除</strong>。
          </div>
        }
        style={{ marginBottom: 14 }}
      />

      {/* 核心业务流程视角切换控制栏 */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            业务流程阶段切换：
          </span>
          <Radio.Group
            value={currentPerspective}
            onChange={(e) => setCurrentPerspective(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="monitor">
              <RadarChartOutlined style={{ marginRight: 6 }} />
              1. 省厅内网 · 监测预警 (从AI辅助研判下达指令)
            </Radio.Button>
            <Radio.Button value="emergency">
              <FileTextOutlined style={{ marginRight: 6 }} />
              2. 省厅内网 · 应急处置 (卡片指令明细与重发)
            </Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px', color: '#64748b' }}>
          <span>🔔 离线兜底提醒状态：</span>
          <Annotated
            pin={5}
            title="消息中心离线兜底与自动消除"
            tag="消息消除"
            note="下达失败事件记入顶栏消息中心作为离线兜底；一旦在任何位置重新下发成功，该条提醒自动消除，未读计数实时联动。"
            placement="bottom-right"
          >
            {isQjpFailed ? (
              <Tag color="error">1 条未读异常告警中</Tag>
            ) : (
              <Tag color="success">异常告警已自动消除</Tag>
            )}
          </Annotated>
        </div>
      </div>

      {/* ==================== 视图 1：省厅内网 · 监测预警 (指令发起端) ==================== */}
      {currentPerspective === 'monitor' && (
        <div className="scenario-monitor-view">
          {/* 监测预警筛选栏 */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 280 }}>
              <span style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                舆情检索：
              </span>
              <Input
                prefix={<SearchOutlined />}
                value={monitorSearch}
                onChange={(e) => setMonitorSearch(e.target.value)}
                placeholder="搜索标题、关键词..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>数据来源：</span>
              <Select
                defaultValue="主动发现"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部来源' },
                  { value: '主动发现', label: '主动发现' },
                  { value: '区县上报', label: '区县上报' },
                ]}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>涉事属地：</span>
              <Select
                defaultValue="淮安市-盱眙县"
                style={{ width: 140 }}
                options={[
                  { value: 'all', label: '全省13地市' },
                  { value: '淮安市-盱眙县', label: '淮安市-盱眙县' },
                  { value: '徐州市-贾汪区', label: '徐州市-贾汪区' },
                ]}
              />
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <Button>重置</Button>
              <Button type="primary">查询</Button>
            </div>
          </div>

          {/* 分类 Tabs */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px 8px 0 0', padding: '0 16px' }}>
            <Tabs
              activeKey={monitorCategory}
              onChange={setMonitorCategory}
              items={[
                { key: 'all', label: '全部舆情 (128)' },
                { key: 'ai-discover', label: '🤖 AI主动发现 (14)' },
                { key: 'district', label: '区县直报省厅 (8)' },
                { key: 'hot', label: '重点热点追踪 (5)' },
              ]}
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* 重点舆情文章卡片（从此处呼出 AI 辅助研判弹窗并下达指令） */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: '18px 22px',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Checkbox defaultChecked />
                <span style={{ color: '#2563eb', fontWeight: 600 }}>1</span>
                <strong style={{ fontSize: '15.5px', color: '#0f172a' }}>
                  #盱眙马上真的要命，真的体会到了。
                </strong>
                <Tag color="cyan">非热敏</Tag>
                <Tag color="processing">未处置</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#f59e0b', fontSize: '14px' }}>★★★☆☆</span>
                <span style={{ fontSize: '13px', color: '#d97706', fontWeight: 600 }}>3.5星</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '12.5px',
                color: '#64748b',
                marginBottom: 12,
                gap: 16,
              }}
            >
              <span style={{ fontWeight: 600, color: '#334155' }}>👤 盱眙恒居房产</span>
              <span>ID 70638584236</span>
              <span>👥 10883</span>
              <span>📍 淮安市-盱眙县</span>
              <span>🎵 抖音app</span>
              <span>⏱ 2026-10-15 13:00:05</span>
              <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#ea580c' }}>
                舆情指数 68.50
              </span>
            </div>

            {/* AI 摘要与研判 */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13px', color: '#334155' }}>
                <Tag color="green" style={{ margin: 0 }}>AI 摘要</Tag>
                <span>网民在盱眙县发布情绪化言论称"盱眙马上真的要命"，表达强烈负面情绪，属地为淮安市-盱眙县。</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13px', color: '#334155' }}>
                <Tag color="orange" style={{ margin: 0 }}>AI 研判</Tag>
                <span>【风险定性】非热敏舆情，存在个体极端情绪宣泄引发次生传播的风险隐患。建议联合清江浦区、淮安区对帖文展开落地劝删核处。</span>
              </div>
            </div>

            {/* 卡片核心操作区（高亮呼出 AI 辅助研判与指令下达） */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px dashed #e2e8f0',
                paddingTop: 12,
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                💡 <strong>业务标准路径</strong>：从此处点击【AI辅助研判】，在弹窗右上角点击【下达处置指令】发起多单位联合指派。
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button size="middle">信息详情</Button>
                <Button
                  size="middle"
                  icon={<SendOutlined />}
                  onClick={() => setInstructionModalOpen(true)}
                >
                  独立下达指令
                </Button>
                <Annotated
                  pin={1}
                  title="下达即时感知与Loading加载"
                  tag="Loading遮罩"
                  note="在省厅监测预警中点击【AI辅助研判】下达指令时，提交后显示全流程加载遮罩，模拟跨域专网安全校验与签名，下发结果同步即时拦截返回。"
                  placement="top-right"
                >
                  <Button
                    size="middle"
                    type="primary"
                    icon={<RobotOutlined />}
                    style={{ background: '#4f46e5', fontWeight: 500, padding: '0 18px' }}
                    onClick={() => openAiModal(null, 'monitor')}
                  >
                    AI辅助研判 (呼出弹窗并下达)
                  </Button>
                </Annotated>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 视图 2：省厅内网 · 应急处置 (卡片指令明细与重发) ==================== */}
      {currentPerspective === 'emergency' && (
        <div className="scenario-emergency-view">
          {/* 应急处置二级 Tabs 栏：左侧 Tabs（待反馈｜待处理｜已处理｜帖文处置｜动态监测｜全部），右侧业务备注组件 */}
          <div
            className="emergency-tabs-bar"
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px 8px 0 0',
              padding: '8px 16px',
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' }}>
              {[
                { key: 'feedback', label: '待反馈' },
                { key: 'pending', label: '待处理', count: 5 },
                { key: 'processed', label: '已处理' },
                { key: 'disposal', label: '帖文处置', count: 3 },
                { key: 'monitor', label: '动态监测', count: 2 },
                { key: 'all', label: '全部' },
              ].map((tab) => {
                const isFeedback = tab.key === 'feedback';
                const showExclamation = isFeedback && hasFailedDirectives;
                const active = emergencyTaskTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setEmergencyTaskTab(tab.key)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
                      color: active ? '#2563eb' : '#64748b',
                      fontWeight: active ? 600 : 500,
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      position: 'relative',
                      marginBottom: -1,
                    }}
                  >
                    <span>{tab.count !== undefined ? `${tab.label}(${tab.count})` : tab.label}</span>
                    {showExclamation && (
                      <Tooltip title="存在指令推送失败的情况，请及时排查与重新下发！">
                        <span
                          className="failure-exclamation-badge"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 17,
                            height: 17,
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            borderRadius: '50%',
                            fontSize: '11px',
                            fontWeight: 900,
                            marginLeft: 6,
                            lineHeight: 1,
                            boxShadow: '0 0 0 1.5px #fff, 0 1px 3px rgba(239, 68, 68, 0.4)',
                          }}
                        >
                          !
                        </span>
                      </Tooltip>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 右侧业务规则备注组件 */}
            <div className="emergency-tabs-note" title="Tab与数据标签业务说明">
              <InfoCircleOutlined className="emergency-note-icon" />
              <span className="emergency-note-text">
                红色感叹号标签代表当前有未成功下达的指令，括号后的数字代表当前该类型有多少条待办指令
              </span>
            </div>
          </div>

          {/* 应急处置卡片指令明细展示区（1:1复刻截图 2） */}
          <div
            className="unified-opinion-card compact"
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '0 0 8px 8px',
              padding: '18px 22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            {/* 卡片头部 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Checkbox defaultChecked />
                <span style={{ color: '#2563eb', fontWeight: 600 }}>1</span>
                <strong style={{ fontSize: '15.5px', color: '#1e293b' }}>
                  #盱眙马上真的要命，真的体会到了。
                </strong>
                <Tag color="cyan">非热敏</Tag>
                <Tag color="blue">已处置</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b', fontSize: '13px' }}>★★☆☆☆</span>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>2星</span>
              </div>
            </div>

            {/* 账号元信息行 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                color: '#64748b',
                marginBottom: 10,
                gap: 16,
              }}
            >
              <span style={{ fontWeight: 600, color: '#334155' }}>👤 盱眙恒居房产</span>
              <span>ID 70638584236</span>
              <span>👥 10883</span>
              <span>📍 淮安市-盱眙县</span>
              <span>🎵 抖音app</span>
              <span>⏱ 2026-10-15 13:00:05</span>
              <span>编号 202610150002</span>
              <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#7c3aed' }}>
                舆情指数 35.00
              </span>
            </div>

            {/* 任务状态与指令明细区（关键对标需求） */}
            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* 研判状态条 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Tag color="blue" style={{ fontWeight: 600, margin: 0 }}>第1次研判</Tag>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px' }}>
                  <Tag color="green" style={{ margin: 0 }}>未完成任务</Tag>
                  <strong style={{ color: '#16a34a' }}>6个任务</strong>
                  <Tag color="default">帖文处置 +2</Tag>
                  <Tag color="default">动态监测 +2</Tag>
                </div>
              </div>

              {/* 指令明细行 1：动态监测（正常已送达） */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="processing" style={{ margin: 0 }}>动态监测</Tag>
                  <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                    <ClockCircleOutlined /> 剩00天00时57分
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>测试 (市局网巡岗)</span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <Tag style={{ margin: 0 }}>下发</Tag>
                  <span style={{ fontSize: '12.5px', color: '#334155' }}>请对帖文进行舆情监测</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="small" type="primary">签收</Button>
                  <Button size="small">反馈</Button>
                </div>
              </div>

              {/* 指令明细行 2：帖文处置（淮安区，正常已送达） */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="processing" style={{ margin: 0 }}>帖文处置</Tag>
                  <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                    <ClockCircleOutlined /> 剩00天00时57分
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>测试 (淮安区网安大队)</span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <Tag style={{ margin: 0 }}>下发</Tag>
                  <span style={{ fontSize: '12.5px', color: '#334155' }}>请对帖文展开劝删处置工作</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="small" type="primary">签收</Button>
                  <Button size="small">反馈</Button>
                </div>
              </div>

              {/* 指令明细行：持续关注（徐州市，受专网网闸波动影响发生下达失败） */}
              <div
                style={{
                  background: isFollowUpFailed ? '#fff1f2' : '#f8fafc',
                  border: `1.5px solid ${isFollowUpFailed ? '#f87171' : '#e2e8f0'}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Tag color="cyan" style={{ margin: 0 }}>持续关注</Tag>
                  {isFollowUpFailed ? (
                    <Tooltip title="目标内网网关超时：徐州市局专网网闸摆渡超时 (ERR_NET_TIMEOUT)，指令未能写入对方内网待办池">
                      <Tag color="error" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                        ● 推送失败-错误码：ERR_NET_TIMEOUT
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tag color="success" style={{ margin: 0 }}>待签收 (已送达)</Tag>
                  )}

                  {/* 时效挂起状态与错误诊断提示 */}
                  {isFollowUpFailed ? (
                    <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                      <ClockCircleOutlined /> ⏱ 时效已挂起 (未送达目标单位，免责保护)
                    </span>
                  ) : (
                    <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                      <ClockCircleOutlined /> 剩00天01时00分
                    </span>
                  )}

                  <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600 }}>
                    🏢 徐州市局网安支队
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:45:00</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    请对涉事舆情保持持续关注与日常巡查
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isFollowUpFailed ? (
                    <Button
                      type="primary"
                      danger
                      icon={<ReloadOutlined spin={retryingId === followUpDirective?.id} />}
                      loading={retryingId === followUpDirective?.id}
                      onClick={() => followUpDirective && handleInlineRetry(followUpDirective.id)}
                      style={{ fontWeight: 500 }}
                    >
                      重发指令
                    </Button>
                  ) : (
                    <>
                      <Tag color="cyan">已自动恢复计时</Tag>
                      <Button size="small" type="primary">签收</Button>
                      <Button size="small">反馈</Button>
                    </>
                  )}
                </div>
              </div>

              {/* 指令明细行 3：关键！清江浦区帖文处置（下达失败项与行内补发） */}
              <div
                style={{
                  background: isQjpFailed ? '#fff1f2' : '#f8fafc',
                  border: `1.5px solid ${isQjpFailed ? '#f87171' : '#e2e8f0'}`,
                  borderRadius: 6,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <Tag color="processing" style={{ margin: 0 }}>帖文处置</Tag>
                  {isQjpFailed ? (
                    <Annotated
                      pin={2}
                      title="专网异常即刻拦截弹窗"
                      tag="失败排查"
                      note="若有任何协同单位专网推送超时（如清江浦区 ERR_NET_TIMEOUT），即刻呼出排查弹窗，结构化列举指令名称、目标单位与错误代码，避免下达方误以为指令已送达。"
                      placement="top-left"
                    >
                      <Tooltip title="目标内网网闸摆渡超时：清江浦区分局专网连接超时 (ERR_NET_TIMEOUT)，指令未能写入对方内网待办池">
                        <Tag color="error" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                          ● 下达失败 (ERR_NET_TIMEOUT)
                        </Tag>
                      </Tooltip>
                    </Annotated>
                  ) : (
                    <Tag color="success" style={{ margin: 0 }}>待签收 (已送达)</Tag>
                  )}

                  {/* 时效挂起状态与错误诊断提示 */}
                  <Annotated
                    pin={3}
                    title="被指派单位处置时效自动挂起"
                    tag="时效保护"
                    note="专网未送达期间，系统自动挂起未送达单位的处置倒计时，明确标明“时效已挂起”，避免考核误判，重新下发成功后自动恢复计时。"
                    placement="top-right"
                  >
                    {isQjpFailed ? (
                      <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                        <ClockCircleOutlined /> ⏱ 时效已挂起 (未送达目标单位，免责保护)
                      </span>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                        <ClockCircleOutlined /> 剩00天00时57分
                      </span>
                    )}
                  </Annotated>

                  <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600 }}>
                    🏢 清江浦区网安大队
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    请对帖文展开劝删处置工作
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isQjpFailed ? (
                    <Annotated
                      pin={4}
                      title="应急处置卡片行内轻量重发"
                      tag="行内重发"
                      note="在应急处置列表卡片明细中，支持行内点击【重新下发】转动重试，无需反复呼出复杂弹窗，体验流畅快捷。"
                      placement="top-right"
                    >
                      <Button
                        type="primary"
                        danger
                        icon={<ReloadOutlined spin={retryingId === qjpDirective?.id} />}
                        loading={retryingId === qjpDirective?.id}
                        onClick={() => qjpDirective && handleInlineRetry(qjpDirective.id)}
                        style={{ fontWeight: 500 }}
                      >
                        重新下发
                      </Button>
                    </Annotated>
                  ) : (
                    <>
                      <Tag color="cyan">已自动恢复计时</Tag>
                      <Button size="small" type="primary">签收</Button>
                      <Button size="small">反馈</Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 卡片底部操作栏 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 14,
                borderTop: '1px dashed #f1f5f9',
                paddingTop: 10,
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <span>🔔 状态联动保障：一旦指令重新下达成功，顶栏消息中心告警自动同步解除。</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="small">信息详情</Button>
                <Button
                  size="small"
                  type="primary"
                  icon={<RobotOutlined />}
                  style={{ background: '#4f46e5' }}
                  onClick={() => openAiModal(null, 'emergency')}
                >
                  AI辅助研判 (查看时效指标)
                </Button>
              </div>
            </div>
          </div>

          {/* 列表底部分页与统计：呈现舆情事件条数（“共 N 条”） */}
          <div className="emergency-pagination-wrapper" style={{ marginTop: 14 }}>
            <Pagination
              size="small"
              total={1}
              pageSize={10}
              current={1}
              showTotal={(total) => `共 ${total} 条`}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {/* 指令下达独立弹窗 */}
      <InstructionCommandModal
        open={instructionModalOpen}
        targetSummary={
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            下达目标帖文：#盱眙马上真的要命，真的体会到了。 (抖音app)
          </div>
        }
        eventId="202610150002"
        onCancel={() => setInstructionModalOpen(false)}
        onSubmit={() => setInstructionModalOpen(false)}
      />

      {/* 指令推送结果提醒大弹窗组件 */}
      <DirectiveFailureModal
        open={failureModalOpen}
        results={directives.filter((d) => d.eventId === '202610150002')}
        onClose={() => setFailureModalOpen(false)}
        onRetrySingle={retryDirective}
        onRetry={batchRetryDirectives}
        onRetrySuccess={() => {
          message.success('指令已成功重新推送到目标部门内网！时效恢复计时。');
        }}
      />
    </div>
  );
};

export default ScenarioJointDisposalFailure;
