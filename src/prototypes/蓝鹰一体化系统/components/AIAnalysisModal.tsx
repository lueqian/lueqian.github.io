import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Button,
  Tag,
  Select,
  Rate,
  Tooltip,
  Spin,
  message,
  Empty,
  Popconfirm,
} from 'antd';
import {
  SendOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  PlayCircleFilled,
  LikeOutlined,
  StarFilled,
  WarningFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { useDirectiveState } from '../context/DirectiveStateContext';
import InstructionCommandModal from './InstructionCommandModal';

interface AIAnalysisModalProps {
  open: boolean;
  mode?: 'monitor' | 'emergency';
  eventId?: string;
  onClose: () => void;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  open,
  mode = 'monitor',
  eventId = '202610150002',
  onClose,
}) => {
  const { directives, retryDirective } = useDirectiveState();

  const [activeTab, setActiveTab] = useState<string>('处置详情');
  const [responsibilityArea, setResponsibilityArea] = useState<string>('淮安市-盱眙县');
  const [instructionModalOpen, setInstructionModalOpen] = useState<boolean>(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // 过滤当前事件的指令列表
  const eventDirectives = directives.filter((d) => d.eventId === eventId);
  // 查找失败的指令
  const failedDirectives = eventDirectives.filter((d) => d.status === 'failed');

  const handleInlineRetry = async (directiveId: string) => {
    setRetryingId(directiveId);
    try {
      await retryDirective(directiveId);
    } finally {
      setRetryingId(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const renderMetricCards = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
      {[
        { label: '发现效率', val: '0秒', color: '#ef4444', icon: '⏱' },
        { label: '研判效率', val: '0秒', color: '#f97316', icon: '⚡' },
        { label: '催查耗时', val: '0秒', color: '#10b981', icon: '📞' },
        { label: '材料耗时', val: '0秒', color: '#3b82f6', icon: '📄' },
        { label: '审核耗时', val: '0秒', color: '#8b5cf6', icon: '🛡' },
      ].map((m) => (
        <div
          key={m.label}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '8px 12px',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: `${m.color}15`,
              color: m.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {m.icon}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{m.label}</div>
            <strong style={{ fontSize: '13px', color: '#1e293b' }}>{m.val}</strong>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 32 }}>
            <span style={{ fontSize: '17px', fontWeight: 600 }}>AI辅助研判</span>
            {mode === 'emergency' && (
              <Button type="primary" size="small" style={{ background: '#2563eb' }}>
                办结
              </Button>
            )}
          </div>
        }
        open={open}
        width={1320}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose} style={{ padding: '0 18px' }}>
            取消
          </Button>,
          <Button
            key="complete"
            type="primary"
            onClick={() => {
              message.success('研判结果已保存完成！');
              onClose();
            }}
            style={{ padding: '0 20px' }}
          >
            完成研判
          </Button>,
        ]}
        bodyStyle={{ padding: '18px 28px', maxHeight: '82vh', overflowY: 'auto' }}
      >
        {/* 顶部元数据栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 14,
            borderBottom: '1px solid #f1f5f9',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
              #盱眙马上真的要命，真的体会到了。
            </span>
            <Tag color="cyan" style={{ borderRadius: 4, padding: '1px 8px' }}>
              非热敏
            </Tag>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#64748b', marginLeft: 10 }}>
              <span>涉事属地：淮安市-盱眙县</span>
              <span>责任属地：</span>
              <Select
                size="small"
                value={responsibilityArea}
                onChange={setResponsibilityArea}
                style={{ width: 140 }}
                options={[
                  { value: '淮安市-盱眙县', label: '淮安市-盱眙县' },
                  { value: '淮安市-清江浦区', label: '淮安市-清江浦区' },
                  { value: '淮安市-淮安区', label: '淮安市-淮安区' },
                ]}
              />
              <Tag color="blue" style={{ borderRadius: 4, marginLeft: 6, padding: '1px 8px' }}>
                数据来源：主动发现
              </Tag>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Rate disabled defaultValue={3.5} allowHalf style={{ fontSize: 14, color: '#f59e0b' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#d97706' }}>3.5星</span>
            <Tag color="processing" style={{ borderRadius: 4, fontWeight: 500, padding: '2px 10px', fontSize: '12px' }}>
              未处置
            </Tag>
          </div>
        </div>

        {/* 左右分栏布局（宽度充裕，呼吸感充足） */}
        <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 24 }}>
          {/* 左侧：事件概览与原发热度 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 事件概述 */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: 10, borderLeft: '3px solid #3b82f6', paddingLeft: 8 }}>
                事件概述
              </div>
              <div style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
                <div style={{ paddingRight: 90 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <Tag color="green" style={{ fontSize: '11px', margin: 0, padding: '0 6px' }}>摘要</Tag>
                    <span style={{ fontSize: '12.5px', color: '#475569', lineHeight: '20px' }}>
                      网民在盱眙县发布情绪化言论称"盱眙马上真的要命"，表达强烈负面情绪，属地为淮安市-盱眙县。
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <Tag color="orange" style={{ fontSize: '11px', margin: 0, padding: '0 6px' }}>研判</Tag>
                    <span style={{ fontSize: '12.5px', color: '#475569', lineHeight: '20px' }}>
                      【风险定性】非热敏舆情，存在个体极端情绪宣泄引发次生传播的风险隐患。【核心风险要素】：主体：普通网民；情绪偏激，宜主动做好舆情前置引导。
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#ffedd5',
                    border: '1px solid #fed7aa',
                    borderRadius: 8,
                    padding: '10px 14px',
                    textAlign: 'center',
                    minWidth: 80,
                  }}
                >
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#ea580c' }}>68.50</div>
                  <div style={{ fontSize: '11px', color: '#9a3412', marginTop: 2 }}>舆情指数</div>
                </div>
              </div>
            </div>

            {/* 附件总览 */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 6, borderLeft: '3px solid #3b82f6', paddingLeft: 6 }}>
                附件总览
              </div>
              <div
                style={{
                  height: 60,
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  fontSize: '12px',
                }}
              >
                暂无附件
              </div>
            </div>

            {/* 原发热度 */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: 6, borderLeft: '3px solid #3b82f6', paddingLeft: 6 }}>
                原发热度
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#3b82f6', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      居
                    </div>
                    <strong style={{ fontSize: '13px', color: '#1e293b' }}>盱眙恒居房产</strong>
                    <Tag color="purple" style={{ fontSize: '10px', margin: 0 }}>原创</Tag>
                    <Tag color="default" style={{ fontSize: '10px', margin: 0 }}>非热敏</Tag>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Button type="link" size="small" onClick={() => handleCopyText('盱眙恒居房产: #盱眙马上真的要命，真的体会到了。')}>
                      复制信息
                    </Button>
                    <Button type="link" size="small">
                      查看原文
                    </Button>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: 6 }}>
                  2026-10-15 13:00:05 <span>•</span> 抖音app <span>•</span> 八里岔
                </div>
                <div style={{ fontSize: '12.5px', color: '#1e293b', marginBottom: 8, fontWeight: 500 }}>
                  #盱眙马上真的要命，真的体会到了。
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '8px 10px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <span style={{ color: '#2563eb' }}>🏷 封面识别：</span>①健力名都便宜的电梯3房，纯毛坯107平
                  </div>
                  <div
                    style={{
                      width: 50,
                      height: 34,
                      background: '#1e293b',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <PlayCircleFilled style={{ fontSize: 18 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: '11px', color: '#64748b' }}>
                  <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>主动发现</Tag>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span><LikeOutlined /> 1</span>
                    <span><StarFilled style={{ color: '#e2e8f0' }} /> 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：Tabs 分析研判 / 处置详情 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={
                  mode === 'emergency'
                    ? [
                        { key: '待办事宜', label: '待办事宜' },
                        { key: '分析研判', label: '分析研判' },
                        { key: '处置过程', label: '处置过程' },
                        { key: '处置详情', label: '处置详情' },
                        { key: '处置台账', label: '处置台账' },
                        { key: '信息反馈', label: '信息反馈' },
                      ]
                    : [
                        { key: '分析研判', label: '分析研判' },
                        { key: '处置过程', label: '处置过程' },
                        { key: '处置详情', label: '处置详情' },
                      ]
                }
                style={{ marginBottom: 0 }}
              />
              <Button
                type="primary"
                size="small"
                icon={<SendOutlined />}
                onClick={() => setInstructionModalOpen(true)}
                style={{ background: '#2563eb' }}
              >
                下达处置指令
              </Button>
            </div>

            <div style={{ flex: 1, paddingTop: 12 }}>
              {mode === 'emergency' && renderMetricCards()}

              {activeTab === '处置详情' ? (
                <div>
                  {/* 如果存在下达失败项，显示醒目异常通知条 */}
                  {failedDirectives.length > 0 && (
                    <div
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        padding: '8px 12px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#b91c1c' }}>
                        <WarningFilled style={{ color: '#ef4444' }} />
                        <span>
                          检测到 <strong>{failedDirectives.length}</strong> 条指令向协同单位内网推送失败！目标单位尚未触达，时效已挂起。
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#991b1b' }}>
                        支持在下方指令明细中行内直接重新下发
                      </div>
                    </div>
                  )}

                  {/* 处置详情时间轴 */}
                  <div className="analysis-timeline" style={{ position: 'relative', paddingLeft: 18 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 6,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: '#e2e8f0',
                      }}
                    />

                    {/* 节点 1：帖文处置指令明细 */}
                    <div style={{ position: 'relative', marginBottom: 18 }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: -18,
                          top: 4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                        <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>指令：帖文处置</Tag>
                        <Tag color="cyan" style={{ fontSize: '11px', margin: 0 }}>支队值班岗</Tag>
                        <Tag color="default" style={{ fontSize: '11px', margin: 0 }}>测试</Tag>
                      </div>

                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500, marginBottom: 8 }}>
                          指令要求：请对帖文展开劝删处置工作
                        </div>

                        {/* 罗列指派单位状态（包括失败项与正常项） */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {/* 清江浦区（动态从 context 响应状态） */}
                          {(() => {
                            const qjp = eventDirectives.find((d) => d.targetDept === '清江浦区' && d.instructionName === '帖文处置');
                            const isFailed = qjp?.status === 'failed';

                            return (
                              <div
                                style={{
                                  background: isFailed ? '#fff1f2' : '#fff',
                                  border: `1px solid ${isFailed ? '#fecdd3' : '#e2e8f0'}`,
                                  borderRadius: 6,
                                  padding: '6px 10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <strong style={{ fontSize: '12.5px', color: '#1e293b' }}>清江浦区</strong>
                                  {isFailed ? (
                                    <Tooltip title={qjp?.errorMessage || '目标专网超时 (ERR_NET_TIMEOUT)'}>
                                      <Tag color="error" style={{ margin: 0, cursor: 'pointer' }}>
                                        ● 下达失败 (ERR_NET_TIMEOUT)
                                      </Tag>
                                    </Tooltip>
                                  ) : (
                                    <Tag color="warning" style={{ margin: 0 }}>
                                      未签收 (已送达)
                                    </Tag>
                                  )}
                                  {isFailed && (
                                    <span style={{ fontSize: '11px', color: '#e11d48' }}>
                                      ⏱ 处置时效已挂起 (未触达对方待办)
                                    </span>
                                  )}
                                </div>
                                <div>
                                  {isFailed && (
                                    <Button
                                      size="small"
                                      type="primary"
                                      danger
                                      icon={<ReloadOutlined spin={retryingId === qjp?.id} />}
                                      loading={retryingId === qjp?.id}
                                      onClick={() => qjp && handleInlineRetry(qjp.id)}
                                      style={{ height: 24, fontSize: '11px', padding: '0 8px' }}
                                    >
                                      重新下发
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* 淮安区 */}
                          <div
                            style={{
                              background: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: 6,
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ fontSize: '12.5px', color: '#1e293b' }}>淮安区</strong>
                              <Tag color="warning" style={{ margin: 0 }}>未签收</Tag>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>剩00天00时57分</span>
                          </div>

                          {/* 淮阴区 */}
                          <div
                            style={{
                              background: '#fff',
                              border: '1px solid #e2e8f0',
                              borderRadius: 6,
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <strong style={{ fontSize: '12.5px', color: '#1e293b' }}>淮阴区</strong>
                              <Tag color="warning" style={{ margin: 0 }}>未签收</Tag>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>剩00天00时57分</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 节点 2：第一研判 */}
                    <div style={{ position: 'relative', marginBottom: 18 }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: -18,
                          top: 4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#94a3b8',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                        <Tag color="geekblue" style={{ fontSize: '11px', margin: 0 }}>第一研判</Tag>
                        <Tag color="cyan" style={{ fontSize: '11px', margin: 0 }}>支队值班岗</Tag>
                        <Tag color="default" style={{ fontSize: '11px', margin: 0 }}>测试</Tag>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', padding: '4px 8px' }}>--</div>
                    </div>

                    {/* 节点 3：动态监测指令 */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: -18,
                          top: 4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                        <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>指令：动态监测</Tag>
                        <Tag color="cyan" style={{ fontSize: '11px', margin: 0 }}>支队值班岗</Tag>
                        <Tag color="default" style={{ fontSize: '11px', margin: 0 }}>测试</Tag>
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px' }}>
                        <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500, marginBottom: 6 }}>
                          指令要求：请对帖文进行舆情监测
                        </div>
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 6,
                            padding: '6px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong style={{ fontSize: '12.5px', color: '#1e293b' }}>清江浦区</strong>
                            <Tag color="warning" style={{ margin: 0 }}>未签收</Tag>
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>剩00天00时57分</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
                  {activeTab}内容正常展示中...
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 下达处置指令独立弹窗 */}
      <InstructionCommandModal
        open={instructionModalOpen}
        targetSummary={
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            下发目标帖文：#盱眙马上真的要命，真的体会到了。 (抖音app)
          </div>
        }
        eventId={eventId}
        onCancel={() => setInstructionModalOpen(false)}
        onSubmit={() => setInstructionModalOpen(false)}
      />
    </>
  );
};

export default AIAnalysisModal;
