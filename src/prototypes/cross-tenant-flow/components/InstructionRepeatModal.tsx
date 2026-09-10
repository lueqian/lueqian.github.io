import React from 'react';
import { Modal, Button, Tag, message } from 'antd';
import { WarningOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useAppStore } from '../store';

export const InstructionRepeatModal: React.FC = () => {
  const { repeatAlertOpen, setRepeatAlertOpen, repeatAlertData } = useAppStore();

  if (!repeatAlertData) return null;

  const handleCancel = () => {
    setRepeatAlertOpen(false);
    message.info('已取消重复指令下发');
  };

  const handleSupervise = () => {
    setRepeatAlertOpen(false);
    message.success('已转为协同跟进指令下发，自动并入原案推进！');
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
          <WarningOutlined className="text-amber-500 text-lg" />
          <span>指令重复提醒</span>
        </div>
      }
      open={repeatAlertOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} className="!text-xs">
          取消重复下达
        </Button>,
        <Button
          key="supervise"
          type="primary"
          onClick={handleSupervise}
          className="!bg-blue-600 hover:!bg-blue-500 !text-xs"
        >
          转为协同跟进
        </Button>
      ]}
      width={520}
      destroyOnClose
    >
      <div className="space-y-3 py-3 text-xs leading-relaxed text-slate-700">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
          <div className="text-slate-800 font-semibold">
            系统检测到执行单位【<strong className="text-blue-700">{repeatAlertData.targetUnit}</strong>】在 3 小时前已接收过同类处置指令。
          </div>
          <div className="text-slate-600">
            <strong>指令名称：</strong>{repeatAlertData.instructionName}
          </div>
          <div className="text-slate-600">
            <strong>下发部门：</strong>{repeatAlertData.issuerDept}
          </div>
          <div className="text-slate-600 flex items-center gap-1.5">
            <strong>当前状态：</strong>
            <Tag color="orange">{repeatAlertData.currentProgress}</Tag>
          </div>
        </div>
        <p className="text-slate-500 text-[11px]">
          建议避免对基层多头重复派发相同任务。若确需催促，可选择【转为协同跟进】追加督促说明。
        </p>
      </div>
    </Modal>
  );
};
