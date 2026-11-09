import React, { useMemo, useState, useEffect } from 'react';
import { Input, Modal, Select, Tag, Checkbox, DatePicker, message, Spin, Switch } from 'antd';
import { TeamOutlined, LoadingOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDirectiveState, DirectiveItem } from '../context/DirectiveStateContext';
import DirectiveFailureModal from './DirectiveFailureModal';

interface InstructionOption {
  id: string;
  name: string;
  group: '本单位指令' | '执行单位指令';
  cycle: string;
}

interface InstructionCommandModalProps {
  open: boolean;
  targetSummary: React.ReactNode;
  eventId?: string;
  onCancel: () => void;
  onSubmit?: () => void;
}

const instructionOptions: InstructionOption[] = [
  { id: 'follow-up', name: '持续关注', group: '执行单位指令', cycle: '12小时' },
  { id: 'local-monitor', name: '本地动态监测', group: '本单位指令', cycle: '2小时' },
  { id: 'verify-rumor', name: '谣言核查', group: '执行单位指令', cycle: '4小时' },
  { id: 'post-disposal', name: '帖文处置', group: '执行单位指令', cycle: '6小时' },
  { id: 'delete-guidance', name: '劝删下达', group: '执行单位指令', cycle: '8小时' },
  { id: 'material-report', name: '材料反馈', group: '执行单位指令', cycle: '12小时' },
];

const areaOptions = ['淮安市', '南京市', '徐州市', '清江浦区', '淮安区', '淮阴区', '洪泽区', '金湖县'];

const userOptionsByArea: Record<string, string[]> = {
  淮安市: ['赵警官 (市局网安)', '李警官'],
  南京市: ['孙警官 (网巡支队)', '周警官'],
  徐州市: ['钱警官 (网安支队)'],
  淮安区: ['张明', '刘浩宇', '陈思远'],
  清江浦区: ['王敏', '李倩'],
  淮阴区: ['刘浩宇'],
  洪泽区: ['周宁'],
  金湖县: [],
};

const InstructionCommandModal: React.FC<InstructionCommandModalProps> = ({
  open,
  targetSummary,
  eventId = '202610150002',
  onCancel,
  onSubmit,
}) => {
  const { issueNewDirectives, retryDirective, batchRetryDirectives } = useDirectiveState();

  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>(['follow-up']);
  // assignments 结构：{ [instructionId]: { [area]: string[] } }
  const [assignments, setAssignments] = useState<Record<string, Record<string, string[]>>>({
    'follow-up': { 淮安市: [], 南京市: [], 徐州市: [] },
  });
  const [supplementContent, setSupplementContent] = useState<string>(
    '请对涉事舆情保持持续关注与日常巡查，并在处理周期内反馈落地处置情况。'
  );

  // 下达加载与失败拦截弹窗状态
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(true);
  const [failureModalOpen, setFailureModalOpen] = useState<boolean>(false);
  const [pushResults, setPushResults] = useState<DirectiveItem[]>([]);
  const [failedDirectives, setFailedDirectives] = useState<DirectiveItem[]>([]);

  // ========== 关联重大事项任务及边界控制 ==========
  const existingTasks = useMemo(
    () => [
      {
        id: 't1',
        name: '渝中宝马撞人事件',
        keywords: '渝中, 宝马撞人, 中山路, 警方通告, 事故核查',
        startDate: '2026-08-01',
        endDate: '2026-08-15',
      },
      {
        id: 't2',
        name: '彭水山体滑坡',
        keywords: '彭水, 山体滑坡, 抢险救援, 暴雨涉灾, 人员疏散',
        startDate: '2026-07-28',
        endDate: '2026-08-05',
      },
      {
        id: 't4',
        name: '重庆火灾舆情',
        keywords: '重庆火灾, 高层消防, 灭火救援, 消火栓, 原因调查',
        startDate: '2026-07-15',
        endDate: '2026-07-20',
      },
      {
        id: 't5',
        name: '大足一中',
        keywords: '大足一中, 校园安全, 家校沟通, 网传澄清, 大足教委',
        startDate: '2026-07-15',
        endDate: '2026-07-18',
      },
    ],
    []
  );

  const [linkToTask, setLinkToTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (linkToTask) {
      if (selectedTaskId) {
        const task = existingTasks.find((t) => t.id === selectedTaskId);
        if (task) {
          setKeywords(task.keywords);
          const start = dayjs(task.startDate);
          const end = dayjs(task.endDate);
          const diffDays = end.diff(start, 'day');
          if (diffDays <= 30) {
            setDateRange([start, end]);
          } else {
            const today = dayjs();
            setDateRange([today.subtract(4, 'day'), today.add(25, 'day')]);
            message.info('关联任务时间跨度超出 30 天限制，已自动应用默认周期补正！');
          }
        }
      } else {
        setKeywords('');
        setDateRange([null, null]);
      }
    } else {
      const today = dayjs();
      setDateRange([today.subtract(4, 'day'), today.add(25, 'day')]);
      setKeywords('');
    }
  }, [linkToTask, selectedTaskId, existingTasks]);

  const handleAreasChange = (instId: string, areas: string[]) => {
    setAssignments((prev) => {
      const next = { ...prev };
      const currentAreaConfig = next[instId] || {};
      const nextAreaConfig: Record<string, string[]> = {};
      areas.forEach((area) => {
        nextAreaConfig[area] = currentAreaConfig[area] || [];
      });
      next[instId] = nextAreaConfig;
      return next;
    });
  };

  const handleUsersChange = (instId: string, area: string, users: string[]) => {
    setAssignments((prev) => {
      const next = { ...prev };
      if (!next[instId]) {
        next[instId] = {};
      }
      next[instId][area] = users;
      return next;
    });
  };

  // 提交指令：立即关闭当前配置弹窗，转由右下角小浮窗异步加载，不阻断操作
  const handleSubmit = async () => {
    if (selectedInstructionIds.length === 0) {
      message.warning('请至少选择一项要下达的处置指令！');
      return;
    }

    // 收集所有被指派的部门
    const allSelectedDepts = new Set<string>();
    selectedInstructionIds.forEach((id) => {
      const depts = Object.keys(assignments[id] || {});
      depts.forEach((d) => allSelectedDepts.add(d));
    });

    if (allSelectedDepts.size === 0) {
      message.warning('请至少为选中的指令指定一个接收部门！');
      return;
    }

    const instructionNames = selectedInstructionIds.map((id) => {
      return instructionOptions.find((i) => i.id === id)?.name || id;
    });

    // 提取帖文标题信息
    let postTitleStr = '#盱眙马上真的要命，真的体会到了。';
    if (typeof targetSummary === 'string') {
      postTitleStr = targetSummary;
    }

    // 立即关闭编辑弹窗，彻底解除阻断
    onCancel();
    onSubmit?.();

    // 启动非阻塞跨内网下达流转
    issueNewDirectives(
      eventId,
      instructionNames,
      Array.from(allSelectedDepts),
      supplementContent,
      simulateFailure,
      {
        postTitle: postTitleStr,
        platform: '抖音app',
      }
    );
  };

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
            <span>发起处置指令（多单位协同派发）</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 'normal', color: '#64748b' }}>
              <span>模拟专网网闸波动异常</span>
              <Switch
                size="small"
                checked={simulateFailure}
                onChange={setSimulateFailure}
              />
            </div>
          </div>
        }
        open={open}
        width={1060}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText="确认下达"
        cancelText="取消"
        className="instruction-modal"
      >
        <div>
          <div className="instruction-modal-body">
            <div className="instruction-modal-left">
              <div className="modal-field-title">
                <span className="required-mark">*</span>
                请选择要下达的指令
              </div>
              {(['本单位指令', '执行单位指令'] as const).map((group) => (
                <div key={group} className="instruction-group">
                  <div className="instruction-group-title">{group}</div>
                  <div className="instruction-option-grid">
                    {instructionOptions
                      .filter((item) => item.group === group)
                      .map((item) => {
                        const active = selectedInstructionIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`instruction-option ${active ? 'active' : ''}`}
                            onClick={() => {
                              if (active) {
                                setSelectedInstructionIds((prev) => prev.filter((id) => id !== item.id));
                                setAssignments((prev) => {
                                  const next = { ...prev };
                                  delete next[item.id];
                                  return next;
                                });
                              } else {
                                setSelectedInstructionIds((prev) => [...prev, item.id]);
                                setAssignments((prev) => ({
                                  ...prev,
                                  [item.id]: { 清江浦区: [], 淮安区: [] },
                                }));
                              }
                            }}
                          >
                            <span>{item.name}</span>
                            <em>{item.cycle}</em>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
              <div className="modal-field-title">补充指令内容</div>
              <Input.TextArea
                rows={3}
                value={supplementContent}
                onChange={(e) => setSupplementContent(e.target.value)}
                placeholder="请输入补充指令内容，示例：请{单位名称}进行{指令名称}，并在{处理周期}前反馈处理结果。"
                className="instruction-textarea"
              />
              <div className="variable-row">
                <span>插入变量符</span>
                {['单位名称', '指令名称', '指令类型', '处理周期'].map((item) => (
                  <Tag
                    key={item}
                    className="variable-tag"
                    onClick={() => setSupplementContent((prev) => `${prev}{${item}}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>

              <div
                style={{
                  marginTop: '14px',
                  borderTop: '1px dashed #e2e8f0',
                  paddingTop: '12px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Checkbox
                    checked={linkToTask}
                    onChange={(e) => setLinkToTask(e.target.checked)}
                    style={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}
                  >
                    关联已有的重大事项任务
                  </Checkbox>
                </div>

                {linkToTask && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>
                      选择关联事项任务
                    </div>
                    <Select
                      placeholder="请选择要关联的重大事项任务"
                      value={selectedTaskId}
                      onChange={(val) => setSelectedTaskId(val)}
                      style={{ width: '100%' }}
                      options={existingTasks.map((t) => ({ value: t.id, label: t.name }))}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>
                      追踪布控关键词
                    </div>
                    <Input
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="如：中山路, 警方通告"
                      disabled={linkToTask}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: 500 }}>
                      数据时间范围
                    </div>
                    <DatePicker.RangePicker
                      value={dateRange as any}
                      onChange={(val) => setDateRange(val as any)}
                      disabled={linkToTask}
                      style={{ width: '100%', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="target-summary">{targetSummary}</div>
            </div>

            <div className="instruction-modal-right" style={{ maxHeight: '560px', overflowY: 'auto' }}>
              <div className="modal-field-title">
                <span className="required-mark">*</span>
                选择协同执行单位（支持多单位联合处置）
              </div>
              {selectedInstructionIds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                  请在左侧选择要下达的指令
                </div>
              ) : (
                selectedInstructionIds.map((instId) => {
                  const inst = instructionOptions.find((i) => i.id === instId);
                  const areaConfig = assignments[instId] || {};
                  const selectedAreas = Object.keys(areaConfig);

                  return (
                    <div
                      key={instId}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#fff',
                        padding: '12px',
                        marginBottom: '14px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          marginBottom: '8px',
                          color: '#4338ca',
                        }}
                      >
                        📌 指令项：{inst?.name}（时效：{inst?.cycle}）
                      </div>
                      <div className="receiver-field">
                        <label style={{ fontSize: '12px', color: '#64748b' }}>协同执行部门（多选，按需联合派发）</label>
                        <Select
                          mode="multiple"
                          placeholder="选择协同派发的单位/部门"
                          value={selectedAreas}
                          onChange={(areas) => handleAreasChange(instId, areas)}
                          options={areaOptions.map((area) => ({ value: area, label: area }))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      {selectedAreas.map((area) => {
                        const areaUsers = userOptionsByArea[area] || [];
                        const currentUsers = areaConfig[area] || [];
                        return (
                          <div
                            key={area}
                            className="receiver-field"
                            style={{
                              marginLeft: '6px',
                              borderLeft: '2px solid #6366f1',
                              paddingLeft: '8px',
                              marginBottom: '8px',
                            }}
                          >
                            <label style={{ fontWeight: '500', color: '#334155', fontSize: '12px' }}>
                              🏢 {area} - 指定办理人（可选）
                            </label>
                            <Select
                              mode="multiple"
                              placeholder={
                                areaUsers.length ? '不指定则默认推入该单位值班岗待办池' : '当前部门暂无可选人员'
                              }
                              value={currentUsers}
                              onChange={(users) => handleUsersChange(instId, area, users)}
                              options={areaUsers.map((user) => ({ value: user, label: user }))}
                              maxTagCount="responsive"
                              style={{ width: '100%' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}

              {selectedInstructionIds.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div className="modal-field-title" style={{ fontSize: '13px', marginBottom: '8px' }}>
                    联合下达预览清单
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedInstructionIds.map((instId) => {
                      const inst = instructionOptions.find((i) => i.id === instId);
                      const areaConfig = assignments[instId] || {};
                      const areas = Object.keys(areaConfig);
                      if (areas.length === 0) return null;

                      return (
                        <div key={instId} className="receiver-preview" style={{ padding: '8px 12px' }}>
                          <TeamOutlined style={{ marginTop: '2px', color: '#3b82f6' }} />
                          <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '12.5px', color: '#1e40af' }}>
                              指令：{inst?.name}
                            </strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                              {areas.map((area) => (
                                <Tag key={area} color="blue">
                                  {area} (自动寻址跨租户专网)
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 指令推送结果提醒大弹窗组件（展示所有目标与结果、行内重发及排查提示） */}
      <DirectiveFailureModal
        open={failureModalOpen}
        results={pushResults}
        failedDirectives={failedDirectives}
        onRetrySingle={retryDirective}
        onRetry={batchRetryDirectives}
        onClose={() => {
          setFailureModalOpen(false);
          onSubmit?.();
        }}
        onRetrySuccess={() => {
          onSubmit?.();
        }}
      />
    </>
  );
};

export default InstructionCommandModal;
