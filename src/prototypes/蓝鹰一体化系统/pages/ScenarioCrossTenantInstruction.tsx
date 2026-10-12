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
  Drawer,
  Alert,
  Space,
  Input,
  Select,
  Radio,
  Tabs,
  Avatar,
  Tooltip,
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
  LockOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CodeOutlined,
  UserOutlined,
  BranchesOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  GlobalOutlined,
  PlayCircleFilled,
  InfoCircleOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

const ScenarioCrossTenantInstruction: React.FC = () => {
  // 核心指令业务流转状态（省厅下发闭环）
  const [instructionIssued, setInstructionIssued] = useState<boolean>(false);
  const [targetTenant, setTargetTenant] = useState<string>('徐州市公安局网安支队');
  const [instructionTypes, setInstructionTypes] = useState<string[]>(['线下核查', '属地落实']);
  const [timeLimit, setTimeLimit] = useState<string>('今日 18:00 前');
  const [instructionContent, setInstructionContent] = useState<string>(
    '请[单位名称]立即对涉事网民线下动向进行落地核查，并在[处理周期]前完成线下核查笔录与处置反馈。'
  );
  const [issueTimestamp, setIssueTimestamp] = useState<string>('2026-10-10 10:15:20');

  // AI 辅助研判弹窗状态（截图 1 对标）
  const [aiLevel, setAiLevel] = useState<string>('二级 (紧急)');
  const [aiType, setAiType] = useState<string>('涉稳舆情 / 谣言排查');
  const [aiOpinion, setAiOpinion] = useState<string>(
    '【总队研判意见】：该线索涉及工业园区安全与排污虚假信息，跟帖转发超1200条，存在线上向线下传导聚集风险。建议由徐州市公安局网安支队会同贾汪分局网安大队开展线下落地核查，限今日18:00前反馈核查笔录与处置结果。'
  );
  const [commonUnitDirectives, setCommonUnitDirectives] = useState<string[]>(['总队落实']);
  const [commonExecDirectives, setCommonExecDirectives] = useState<string[]>(['线下核查', '属地落实']);

  // 详细指令下达弹窗状态（截图 2 对标）
  const [detailedUnitDirectives, setDetailedUnitDirectives] = useState<string[]>(['总队落实']);
  const [detailedExecDirectives, setDetailedExecDirectives] = useState<string[]>(['线下核查', '属地落实']);
  const [supplementContent, setSupplementContent] = useState<string>(
    '请[单位名称]立即对涉事网民线下动向进行落地核查，并在[处理周期]前完成线下核查笔录与处置反馈。'
  );

  // 弹窗与抽屉控制
  const [issueModalOpen, setIssueModalOpen] = useState<boolean>(false);
  const [payloadDrawerOpen, setPayloadDrawerOpen] = useState<boolean>(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  const { setCurrentStep, setActionButton, currentRoleView } = useScenarioContext();

  // 监听顶栏切换与联动
  useEffect(() => {
    if (currentRoleView) {
      if (currentRoleView === 'provincial') {
        setAiModalOpen(false);
        setIssueModalOpen(false);
      } else if (currentRoleView === 'detail') {
        setIssueModalOpen(true);
      } else if (currentRoleView === 'issued') {
        setInstructionIssued(true);
      }
    }
  }, [currentRoleView]);

  useEffect(() => {
    if (!instructionIssued) {
      setCurrentStep(1);
      setActionButton({
        label: '下达处置指令 ➔',
        onClick: () => setIssueModalOpen(true),
      });
    } else {
      setCurrentStep(3);
      setActionButton({
        label: '重置下发演示 ↺',
        onClick: handleResetDemo,
      });
    }
  }, [instructionIssued, setCurrentStep, setActionButton]);

  // 插入变量符
  const handleInsertVariable = (varCode: string) => {
    setSupplementContent((prev) => prev + varCode);
    message.info(`已插入变量模板占位符 ${varCode}`);
  };

  // 省厅端下达跨租户指令
  const handleIssueInstruction = () => {
    setInstructionIssued(true);
    setIssueTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    if (supplementContent) {
      setInstructionContent(supplementContent);
    }
    setIssueModalOpen(false);
    setAiModalOpen(false);
    message.success({
      content: '指令下达成功！',
      duration: 3.5,
    });
  };

  // 重置演示
  const handleResetDemo = () => {
    setInstructionIssued(false);
    setIssueModalOpen(false);
    setAiModalOpen(false);
    setPayloadDrawerOpen(false);
    setDetailDrawerOpen(false);
    message.info('场景三省厅指令下发演示已重置。');
  };

  return (
    <div className="provincial-view-wrapper" style={{ position: 'relative' }}>
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-intranet" style={{ marginBottom: 12 }}>
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 公安内网 · 省厅
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            省厅网安总队
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#bae0ff' }}>
            （当前账号：李警官 · 总队值班长）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => setAiModalOpen(true)}
            style={{ background: '#2563eb', border: 'none' }}
          >
            AI 辅助研判 <ThunderboltOutlined />
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

      {/* 顶栏业务说明横幅 */}
      <Alert
        message={
          instructionIssued ? (
            <span>
              <strong>【指令已定向下达入库】</strong> 省厅自描述跨租户处置指令已下发至 <strong>徐州市公安局网安支队</strong>，载荷已落库目标部门【指令接收岗】待办池。
            </span>
          ) : (
            <span>
              <strong>【监测预警与指令下发】</strong> 省厅在【监测预警】板块查验全省线索，通过 AI 辅助研判与详细指令模板完成跨租户派工；底层乐观锁机制沿用现有逻辑，无需重复开发。
            </span>
          )
        }
        type={instructionIssued ? 'success' : 'info'}
        showIcon
        style={{ marginBottom: 12 }}
      />

      <Card bordered={false} className="std-view-card">
        {/* 二级 Tab 导航 */}
        <Tabs
          defaultActiveKey="reported"
          items={[
            { key: 'all', label: '全部' },
            { key: 'ai-discover', label: 'AI主动发现' },
            { key: 'report-audit', label: '上报审核' },
            {
              key: 'reported',
              label: (
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span>区县上报</span>
                  <Badge count={1} style={{ backgroundColor: '#1677ff', marginLeft: 6 }} />
                </div>
              ),
            },
            { key: 'notice', label: '通报信息' },
          ]}
        />

        {/* 舆情事件卡片 */}
        <div className="stream-card-box" style={{ marginTop: 8 }}>
          <div className="stream-card-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="stream-card-seq-badge">1</span>
              <Tag color="geekblue" style={{ margin: 0, fontWeight: 600 }}>
                区县上报
              </Tag>
              <Tag color="orange" style={{ margin: 0 }}>
                涉稳舆情
              </Tag>
              <span className="stream-card-title-text">
                关于徐州某工业园区因环保升级改造停产网络谣言线索排查
              </span>
              <Tag color="red" style={{ margin: 0, fontSize: 11 }}>
                <ClockCircleOutlined /> 限时：今日 18:00 前
              </Tag>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              编号：202610100088
            </div>
          </div>

          <div className="stream-card-meta-line" style={{ marginTop: 8 }}>
            <span>采集人：<strong style={{ color: '#1e293b' }}>苏北观察员 (抖音app)</strong></span>
            <span className="stream-meta-divider">|</span>
            <span>线索ID：<code>7694739512768873018</code></span>
            <span className="stream-meta-divider">|</span>
            <span>涉事属地：江苏省 / 徐州市 / 贾汪区</span>
            <span className="stream-meta-divider">|</span>
            <span>流转状态：<strong style={{ color: instructionIssued ? '#059669' : '#2563eb' }}>{instructionIssued ? '已下达指令 (派发至徐州市局网安支队)' : '待下发处置指令'}</strong></span>
          </div>

          <div className="stream-card-content-body">
            “徐州某工业园区因环保升级改造停产，网传将引发千人聚集游行抗议，已有网民在微信群中煽动前往园区管委会讨说法，请迅速落实排查处置！” #工业园区 #徐州停产
          </div>

          {/* AI 研判建议与舆情指数 */}
          <div className="stream-card-ai-row" style={{ marginTop: 10 }}>
            <div className="stream-ai-left-boxes">
              <div className="stream-ai-green-summary">
                <span className="stream-ai-pill-green">AI 摘要</span>
                <span>涉事人包括本地自媒体从业者王某，涉事地点为徐州市贾汪区工业园区，网帖夸大企业停产规模并煽动线下非法聚集。</span>
              </div>
              <div className="stream-ai-orange-opinion">
                <span className="stream-ai-pill-orange">AI 研判</span>
                <span>【事件定性】系一起因涉稳民生诉求引发的网络串联炒作事件。【当前态势】网帖在本地群组发酵，存在线下聚集风险。【关注建议】属地网安落地排查重点人员，责令删除不实言论。</span>
              </div>
            </div>

            <div className="stream-ai-purple-index-card">
              <span className="stream-ai-index-val">68.50</span>
              <span className="stream-ai-index-label">舆情指数</span>
            </div>
          </div>

          {/* 标签池 */}
          <div className="stream-card-tags-pool" style={{ marginTop: 10 }}>
            <span className="stream-meta-tag">来源: 手工上报-徐州市局</span>
            <span className="stream-meta-tag">涉稳排查</span>
            <span className="stream-meta-tag">重点关注</span>
            {instructionIssued && (
              <Tag color="success" style={{ margin: 0, fontSize: 11 }}>
                <CheckCircleFilled /> 已定向下达徐州
              </Tag>
            )}
          </div>

          {/* 操作栏右下角 */}
          <div className="stream-card-actions-bar" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
            <Space size={10} align="center">
              <Button
                type="default"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制线索全文')}
              >
                一键复制
              </Button>

              <Button
                type="default"
                size="small"
                icon={<ThunderboltOutlined />}
                onClick={() => setAiModalOpen(true)}
              >
                AI辅助研判
              </Button>

              {!instructionIssued ? (
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => setIssueModalOpen(true)}
                >
                  下达处置指令
                </Button>
              ) : (
                <Tag color="success" style={{ padding: '3px 10px', fontSize: 12 }}>
                  <CheckCircleFilled style={{ marginRight: 4 }} />
                  已下发指令推入徐州市局
                </Tag>
              )}
            </Space>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          1. AI 辅助研判综合弹窗 (1:1 复刻截图 1)
          ========================================================================= */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ color: '#2563eb' }} />
            <span>AI 辅助研判分析</span>
          </div>
        }
        open={aiModalOpen}
        width={980}
        onCancel={() => setAiModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setAiModalOpen(false)}>
            取消
          </Button>,
          <Button
            key="issue"
            type="primary"
            icon={<SendOutlined />}
            onClick={() => {
              setAiModalOpen(false);
              setIssueModalOpen(true);
            }}
          >
            下达指令 ➔
          </Button>,
        ]}
        destroyOnClose
      >
        <div className="ai-analysis-modal-body">
          {/* 左侧：舆情细节与AI研判 */}
          <div className="ai-analysis-left-col">
            <div className="ai-modal-header-banner">
              <div className="ai-modal-title-row">
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                  关于徐州某工业园区因环保升级改造停产网络谣言线索排查
                </span>
                <Tag color="red" style={{ margin: 0 }}>二级 (紧急)</Tag>
              </div>
              <div className="ai-modal-meta-row">
                <span>作者：苏北观察员 (抖音app)</span>
                <span>线索ID：7694739512768873018</span>
                <span>时间：2026-10-10 10:15:20</span>
              </div>
            </div>

            <div className="ai-index-cards-row">
              <div className="ai-index-card-item">
                <div className="ai-index-card-label">🔥 舆情热度</div>
                <div className="ai-index-card-val-row">
                  <span className="ai-index-card-val" style={{ color: '#e11d48' }}>68.5</span>
                  <span className="ai-index-card-change" style={{ color: '#e11d48' }}>↑ 24%</span>
                </div>
              </div>
              <div className="ai-index-card-item">
                <div className="ai-index-card-label">⚡ 敏感度指数</div>
                <div className="ai-index-card-val-row">
                  <span className="ai-index-card-val" style={{ color: '#ea580c' }}>84.2</span>
                  <span className="ai-index-card-change" style={{ color: '#ea580c' }}>高危</span>
                </div>
              </div>
              <div className="ai-index-card-item">
                <div className="ai-index-card-label">👥 扩散人群</div>
                <div className="ai-index-card-val-row">
                  <span className="ai-index-card-val" style={{ color: '#2563eb' }}>1,240</span>
                  <span className="ai-index-card-change" style={{ color: '#2563eb' }}>群组扩散</span>
                </div>
              </div>
            </div>

            <div className="section-sub-title">AI 分析敏感点</div>
            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 13, lineHeight: 1.6, color: '#334155' }}>
              • <strong>煽动性言论</strong>：声称“千人聚集”，带有明显煽动聚集维权导向；<br />
              • <strong>属地扩散风险</strong>：本地多个微信兼职群、同城群转发，涉事地点集中在贾汪区工业园区。
            </div>

            <div className="section-sub-title">事件聚类（相似信息）</div>
            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, fontSize: 12, color: '#475569' }}>
              • 【抖音短视频】“徐州某厂停产现场实拍”（播放量 4,820）<br />
              • 【微博同城】“求证实，徐州工业园是不是要组织游行？”（转评 158）
            </div>
          </div>

          {/* 右侧：指令下达配置 */}
          <div className="ai-analysis-right-col">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>处置指令下达</span>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setAiModalOpen(false);
                  setIssueModalOpen(true);
                }}
              >
                下达详细指令 ➔
              </Button>
            </div>

            <div className="directive-blue-bar-title">常用单位指令</div>
            <div className="directive-checkbox-grid">
              <Checkbox
                checked={commonUnitDirectives.includes('总队落实')}
                onChange={(e) =>
                  setCommonUnitDirectives(
                    e.target.checked ? ['总队落实'] : []
                  )
                }
              >
                总队落实
              </Checkbox>
              <Checkbox>领导批示</Checkbox>
            </div>

            <div className="directive-blue-bar-title" style={{ marginTop: 14 }}>常用执行指令</div>
            <div className="directive-checkbox-grid">
              <Checkbox
                checked={commonExecDirectives.includes('线下核查')}
                onChange={(e) =>
                  setCommonExecDirectives((prev) =>
                    e.target.checked ? [...prev, '线下核查'] : prev.filter((x) => x !== '线下核查')
                  )
                }
              >
                线下核查
              </Checkbox>
              <Checkbox
                checked={commonExecDirectives.includes('属地落实')}
                onChange={(e) =>
                  setCommonExecDirectives((prev) =>
                    e.target.checked ? [...prev, '属地落实'] : prev.filter((x) => x !== '属地落实')
                  )
                }
              >
                属地落实
              </Checkbox>
              <Checkbox>持续监测</Checkbox>
              <Checkbox>协调删帖</Checkbox>
            </div>

            <div className="directive-blue-bar-title" style={{ marginTop: 14 }}>目标接收单位</div>
            <Select
              style={{ width: '100%', height: 38 }}
              value={targetTenant}
              onChange={setTargetTenant}
            >
              <Option value="徐州市公安局网安支队">徐州市公安局网安支队</Option>
              <Option value="南京市公安局网安支队">南京市公安局网安支队</Option>
              <Option value="苏州市公安局网安支队">苏州市公安局网安支队</Option>
            </Select>

            <div className="directive-blue-bar-title" style={{ marginTop: 14 }}>研判意见正文</div>
            <TextArea
              rows={4}
              value={aiOpinion}
              onChange={(e) => setAiOpinion(e.target.value)}
              style={{ fontSize: 13, lineHeight: 1.6 }}
            />
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          2. 详细处置指令下达弹窗 (1:1 复刻截图 2)
          ========================================================================= */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ color: '#2563eb' }} />
            <span>发起处置指令（详细配置）</span>
          </div>
        }
        open={issueModalOpen}
        width={860}
        onCancel={() => setIssueModalOpen(false)}
        onOk={handleIssueInstruction}
        okText="确认下发至目标地市"
        cancelText="取消"
        destroyOnClose
      >
        <div style={{ padding: '6px 0' }}>
          <Tabs
            defaultActiveKey="all"
            items={[
              { key: 'all', label: '全部 (31)' },
              { key: 'unit', label: '单位指令 (15)' },
              { key: 'exec', label: '执行指令 (16)' },
            ]}
          />

          <div style={{ margin: '10px 0 16px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>
              可选指令清单
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 10,
                background: '#f8fafc',
                padding: 12,
                borderRadius: 6,
              }}
            >
              <Checkbox
                checked={detailedExecDirectives.includes('线下核查')}
                onChange={(e) =>
                  setDetailedExecDirectives((prev) =>
                    e.target.checked ? [...prev, '线下核查'] : prev.filter((x) => x !== '线下核查')
                  )
                }
              >
                线下核查
              </Checkbox>
              <Checkbox
                checked={detailedExecDirectives.includes('属地落实')}
                onChange={(e) =>
                  setDetailedExecDirectives((prev) =>
                    e.target.checked ? [...prev, '属地落实'] : prev.filter((x) => x !== '属地落实')
                  )
                }
              >
                属地落实
              </Checkbox>
              <Checkbox>持续监测</Checkbox>
              <Checkbox>协调删帖</Checkbox>
              <Checkbox checked>总队落实</Checkbox>
              <Checkbox>领导研判</Checkbox>
              <Checkbox>平台举报</Checkbox>
              <Checkbox>属地稳控</Checkbox>
            </div>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                目标接收地市部门 <span style={{ color: '#ef4444' }}>*</span>
              </div>
              <Annotated
                pin={1}
                title="跨租户定向派发（目标部门）"
                note="省厅总队下达指令时指定目标地市部门（徐州市局网安支队），系统自动流转至该部门申领了【指令接收岗】的账号待办池中。"
                tag="跨域派工"
                placement="bottom-left"
              >
                <Select
                  style={{ width: '100%', height: 40 }}
                  value={targetTenant}
                  onChange={setTargetTenant}
                >
                  <Option value="徐州市公安局网安支队">徐州市公安局网安支队</Option>
                  <Option value="南京市公安局网安支队">南京市公安局网安支队</Option>
                  <Option value="苏州市公安局网安支队">苏州市公安局网安支队</Option>
                </Select>
              </Annotated>
            </Col>

            <Col span={12}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                要求办结时效 <span style={{ color: '#ef4444' }}>*</span>
              </div>
              <Input
                style={{ height: 40 }}
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </Col>

            <Col span={24}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  指令补充说明与参数化模板
                </span>

                <Annotated
                  pin={3}
                  title="参数化变量指令模板"
                  note="详细指令下发支持动态插入 [单位名称]、[处理周期] 等占位变量，下发时由系统引擎自动替换为规范业务文本。"
                  tag="变量模板"
                  placement="top-right"
                >
                  <Space size={6}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>插入变量：</span>
                    <button
                      type="button"
                      className="variable-insert-btn"
                      onClick={() => handleInsertVariable('[单位名称]')}
                    >
                      [单位名称]
                    </button>
                    <button
                      type="button"
                      className="variable-insert-btn"
                      onClick={() => handleInsertVariable('[指令名称]')}
                    >
                      [指令名称]
                    </button>
                    <button
                      type="button"
                      className="variable-insert-btn"
                      onClick={() => handleInsertVariable('[处理周期]')}
                    >
                      [处理周期]
                    </button>
                  </Space>
                </Annotated>
              </div>

              <TextArea
                rows={3}
                value={supplementContent}
                onChange={(e) => setSupplementContent(e.target.value)}
                style={{ fontSize: 13, lineHeight: 1.6 }}
              />
            </Col>

            <Col span={24}>
              <Annotated
                pin={2}
                title="自描述数据包机制 (Schema v2.4)"
                note="跨租户下发无需异构字典互通，数据包自包含契约定义、业务上下文与数字防伪签名，地市租户零依赖安全自解析。"
                tag="Schema契约"
                placement="bottom-left"
              >
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 6,
                    padding: '10px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CodeOutlined style={{ color: '#2563eb', fontSize: 16 }} />
                      <span style={{ fontSize: 13, color: '#1e40af', fontWeight: 600 }}>
                        轻量化数据契约：<code>Schema v2.4 跨租户自描述载荷</code>
                      </span>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => setPayloadDrawerOpen(true)}
                    >
                      查看传输包 JSON ➔
                    </Button>
                  </div>
                  <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 4, lineHeight: 1.5 }}>
                    ⚡ 规避网闸带宽瓶颈：仅打包传输基础元数据（链接、正文、AI研判）与指令参数，免除大附件同步延迟，下发直达目标租户【应急处置 - 总队指令】待办池。
                  </div>
                </div>
              </Annotated>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* =========================================================================
          3. Schema v2.4 契约抽屉 (轻量化传输 Payload 规范)
          ========================================================================= */}
      <Drawer
        title="跨租户轻量化指令载荷 (Schema v2.4)"
        placement="right"
        width={560}
        open={payloadDrawerOpen}
        onClose={() => setPayloadDrawerOpen(false)}
      >
        <div style={{ marginBottom: 12, fontSize: 12, color: '#64748b', background: '#f8fafc', padding: 10, borderRadius: 6 }}>
          <strong>传输策略说明：</strong>为规避不同地市网闸带宽及数据同步FTP方案差异，该载荷采用纯文本轻量化封包，排除了体积庞大的图片/视频附件，确保秒级下达与100%落库。
        </div>
        <div style={{ background: '#0f172a', padding: 14, borderRadius: 6, color: '#38bdf8', fontSize: 12, fontFamily: 'monospace', lineHeight: 1.6, overflowX: 'auto' }}>
          {JSON.stringify(
            {
              $schema: 'https://security.police.cn/schemas/directive-v2.4.json',
              transportStrategy: {
                mode: 'LIGHTWEIGHT_METADATA_ONLY',
                largeAttachmentExcluded: true,
                targetQueue: 'EMERGENCY_PROVINCIAL_DIRECTIVE',
              },
              sourceInfo: {
                url: 'https://v.douyin.com/xuzhou-rumor-0088/',
                title: '关于徐州某工业园区因环保升级改造停产网络谣言线索排查',
                content: '徐州某工业园区因环保升级改造停产，网传将引发千人聚集游行抗议，已有网民在微信群中煽动前往园区管委会讨说法，请迅速落实排查处置！',
                author: '苏北观察员 (ID: 7694739512768873018)',
                platform: '抖音app',
                publishTime: '2026-10-10 10:15:20',
              },
              aiInsight: {
                summary: '涉事人包括本地自媒体从业者王某，涉事地点为徐州市贾汪区工业园区，网帖夸大企业停产规模并煽动线下非法聚集。',
                judgment: '【事件定性】系一起因民生诉求引发的网络串联炒作事件。【关注建议】属地网安落地排查重点人员，责令删除不实言论。',
                sentimentIndex: 68.5,
              },
              directive: {
                directiveId: 'DIR-20261010-0088',
                directiveName: '网络谣言核查及涉稳风险落地化解指令',
                directiveType: '线下核查',
                timeLimit: timeLimit,
                directives: [...detailedUnitDirectives, ...detailedExecDirectives],
                templateContent: supplementContent,
                issuerTenant: 'JSGA_CYBER_COMMAND_CENTER',
                issuerUnit: '江苏省公安厅网安总队',
                targetTenant: targetTenant,
              },
              verificationSignature: 'SHA256:e8f9a0c14b2d88e99a81fbc4029b3c4d',
            },
            null,
            2
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default ScenarioCrossTenantInstruction;
