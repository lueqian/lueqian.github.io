import React, { useMemo, useState } from 'react';
import { Input, Modal, Select, Tag } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

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
  const [selectedArea, setSelectedArea] = useState('淮安区');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const selectedAreaUsers = useMemo(() => userOptionsByArea[selectedArea] || [], [selectedArea]);

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedUsers([]);
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
                      onClick={() => setSelectedInstructionIds((prev) => (
                        active ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                      ))}
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
          <div className="target-summary">{targetSummary}</div>
        </div>
        <div className="instruction-modal-right">
          <div className="modal-field-title">选择执行单位与接收对象</div>
          <div className="receiver-field">
            <label>属地/部门</label>
            <Select
              value={selectedArea}
              onChange={handleAreaChange}
              options={areaOptions.map((area) => ({ value: area, label: area }))}
            />
          </div>
          <div className="receiver-field">
            <label>指定人员（可选）</label>
            <Select
              mode="multiple"
              value={selectedUsers}
              onChange={setSelectedUsers}
              placeholder={selectedAreaUsers.length ? '不指定则按指令预设岗位派发' : '当前属地暂无可选人员'}
              options={selectedAreaUsers.map((user) => ({ value: user, label: user }))}
            />
            {selectedAreaUsers.length === 0 && (
              <div className="empty-user-hint">当前属地暂无可选人员，将按指令预设岗位派发。</div>
            )}
          </div>
          <div className="receiver-preview">
            <TeamOutlined />
            <div>
              <strong>{selectedArea}</strong>
              <span>{selectedUsers.length ? `指定人员：${selectedUsers.join('、')}` : '按指令预设岗位自动派发'}</span>
              <span>{selectedUsers.length ? '直达人员，不再按预设岗位重复推送' : '由指令管理绑定的岗位账号接收'}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionCommandModal;
