import React, { useMemo, useState, useEffect } from 'react';
import { Input, Modal, Select, Tag, Checkbox, DatePicker, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface InstructionOption {
  id: string;
  name: string;
  group: '本单位指令' | '执行单位指令';
  cycle: string;
}

interface InstructionCommandModalProps {
  open: boolean;
  targetSummary: React.ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
}

const instructionOptions: InstructionOption[] = [
  { id: 'local-monitor', name: '本地动态监测', group: '本单位指令', cycle: '2小时' },
  { id: 'verify-rumor', name: '谣言核查', group: '执行单位指令', cycle: '4小时' },
  { id: 'post-disposal', name: '帖文处置', group: '执行单位指令', cycle: '6小时' },
  { id: 'delete-guidance', name: '劝删下达', group: '执行单位指令', cycle: '8小时' },
  { id: 'material-report', name: '材料反馈', group: '执行单位指令', cycle: '12小时' },
];

const areaOptions = ['淮安区', '清江浦区', '淮阴区', '洪泽区', '金湖县'];

const userOptionsByArea: Record<string, string[]> = {
  淮安区: ['张明', '刘浩宇', '陈思远'],
  清江浦区: ['王敏', '李倩'],
  淮阴区: ['刘浩宇'],
  洪泽区: ['周宁'],
  金湖县: [],
};

const InstructionCommandModal: React.FC<InstructionCommandModalProps> = ({
  open,
  targetSummary,
  onCancel,
  onSubmit,
}) => {
  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>(['post-disposal']);
  // assignments 结构：{ [instructionId]: { [area]: string[] } }
  const [assignments, setAssignments] = useState<Record<string, Record<string, string[]>>>({
    'post-disposal': { '淮安区': [] }
  });

  // ========== 新增：关联重大事项任务及边界控制 ==========
  const existingTasks = useMemo(() => [
    { id: 't1', name: '渝中宝马撞人事件', keywords: '渝中, 宝马撞人, 中山路, 警方通告, 事故核查', startDate: '2026-08-01', endDate: '2026-08-15' },
    { id: 't2', name: '彭水山体滑坡', keywords: '彭水, 山体滑坡, 抢险救援, 暴雨涉灾, 人员疏散', startDate: '2026-07-28', endDate: '2026-08-05' },
    { id: 't4', name: '重庆火灾舆情', keywords: '重庆火灾, 高层消防, 灭火救援, 消火栓, 原因调查', startDate: '2026-07-15', endDate: '2026-07-20' },
    { id: 't5', name: '大足一中', keywords: '大足一中, 校园安全, 家校沟通, 网传澄清, 大足教委', startDate: '2026-07-15', endDate: '2026-07-18' },
  ], []);

  const [linkToTask, setLinkToTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (linkToTask) {
      if (selectedTaskId) {
        const task = existingTasks.find(t => t.id === selectedTaskId);
        if (task) {
          setKeywords(task.keywords);
          const start = dayjs(task.startDate);
          const end = dayjs(task.endDate);
          const diffDays = end.diff(start, 'day');
          if (diffDays <= 30) {
            setDateRange([start, end]);
          } else {
            // 超出30天限制，补正为以当天为节点的 -4 天至 +25 天
            const today = dayjs();
            setDateRange([today.subtract(4, 'day'), today.add(25, 'day')]);
            message.info("关联任务时间跨度超出 30 天限制，已自动应用默认周期补正！");
          }
        }
      } else {
        setKeywords('');
        setDateRange([null, null]);
      }
    } else {
      // 默认情况
      const today = dayjs();
      setDateRange([today.subtract(4, 'day'), today.add(25, 'day')]);
      setKeywords('');
    }
  }, [linkToTask, selectedTaskId, existingTasks]);
  // ======================================================

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

  return (
    <Modal
      title="发起处置指令"
      open={open}
      width={980}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="确认下达"
      cancelText="取消"
      className="instruction-modal"
    >
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
                {instructionOptions.filter((item) => item.group === group).map((item) => {
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
                            [item.id]: { '淮安区': [] }
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
            rows={4}
            placeholder="请输入补充指令内容，示例：请{单位名称}进行{指令名称}，并在{处理周期}前反馈处理结果。"
            className="instruction-textarea"
          />
          <div className="variable-row">
            <span>插入变量符</span>
            {['单位名称', '指令名称', '指令类型', '处理周期'].map((item) => (
              <Tag key={item} className="variable-tag">{item}</Tag>
            ))}
          </div>
          
          <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Checkbox 
                checked={linkToTask} 
                onChange={(e) => setLinkToTask(e.target.checked)}
                style={{ fontWeight: 600, fontSize: '13px', color: '#475569' }}
              >
                关联已有的重大事项任务
              </Checkbox>
            </div>
            
            {linkToTask && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 500 }}>选择关联事项任务</div>
                <Select
                  placeholder="请选择要关联的重大事项任务"
                  value={selectedTaskId}
                  onChange={(val) => setSelectedTaskId(val)}
                  style={{ width: '100%' }}
                  options={existingTasks.map(t => ({ value: t.id, label: t.name }))}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 500 }}>追踪布控关键词</div>
                <Input 
                  value={keywords} 
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="如：中山路, 警方通告"
                  disabled={linkToTask}
                  style={{ fontSize: '12.5px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 500 }}>数据时间范围（最大30天限制）</div>
                <DatePicker.RangePicker
                  value={dateRange as any}
                  onChange={(val) => setDateRange(val as any)}
                  disabled={linkToTask}
                  style={{ width: '100%', fontSize: '12px' }}
                />
              </div>
            </div>
            
            <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
              ℹ️ 勾选关联重大事项后，时间范围与核心关键词将自动继承自该事项任务。若继承的周期跨度超出系统 30 天上限，将自动应用默认布控周期补正。
            </div>
          </div>

          <div className="target-summary">{targetSummary}</div>
        </div>
        <div className="instruction-modal-right" style={{ maxHeight: '580px', overflowY: 'auto' }}>
          <div className="modal-field-title">选择执行单位与接收对象</div>
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
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', color: '#4338ca' }}>
                    指令：{inst?.name}
                  </div>
                  <div className="receiver-field">
                    <label>指派部门（可多选）</label>
                    <Select
                      mode="multiple"
                      placeholder="选择要派发的部门"
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
                          marginLeft: '8px',
                          borderLeft: '2px solid #6d5bd0',
                          paddingLeft: '8px',
                          marginBottom: '12px',
                        }}
                      >
                        <label style={{ fontWeight: '500', color: '#475569' }}>
                          🏢 {area} - 指定人员（可选）
                        </label>
                        <Select
                          mode="multiple"
                          placeholder={areaUsers.length ? '不指定则按指令预设岗位派发' : '当前部门暂无可选人员'}
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
            <div style={{ marginTop: '16px' }}>
              <div className="modal-field-title" style={{ fontSize: '13px', marginBottom: '8px' }}>
                指派预览汇总
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedInstructionIds.map((instId) => {
                  const inst = instructionOptions.find((i) => i.id === instId);
                  const areaConfig = assignments[instId] || {};
                  const areas = Object.keys(areaConfig);
                  if (areas.length === 0) return null;

                  return (
                    <div key={instId} className="receiver-preview" style={{ padding: '10px 12px' }}>
                      <TeamOutlined style={{ marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '13px', color: '#1e40af' }}>
                          指令：{inst?.name}
                        </strong>
                        {areas.map((area) => {
                          const users = areaConfig[area] || [];
                          return (
                            <div key={area} style={{ fontSize: '11px', marginTop: '4px', color: '#1e40af' }}>
                              <span>🏢 {area}</span>
                              <span style={{ marginLeft: '6px' }}>
                                {users.length ? `指定人：${users.join('、')}` : '（按预设岗位派发）'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InstructionCommandModal;
