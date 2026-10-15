import React, { useState } from 'react';
import { Modal, Button, Table, Tag, Typography, Alert, message, Tooltip } from 'antd';
import {
  ExclamationCircleFilled,
  ReloadOutlined,
  CopyOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { DirectiveItem } from '../context/DirectiveStateContext';

const { Text, Paragraph } = Typography;

interface DirectiveFailureModalProps {
  open: boolean;
  failedDirectives: DirectiveItem[];
  onRetrySuccess?: () => void;
  onClose: () => void;
  onRetry: (directiveIds: string[]) => Promise<boolean>;
}

const DirectiveFailureModal: React.FC<DirectiveFailureModalProps> = ({
  open,
  failedDirectives,
  onRetrySuccess,
  onClose,
  onRetry,
}) => {
  const [retrying, setRetrying] = useState(false);
  const [retryFailedAgain, setRetryFailedAgain] = useState(false);

  const handleRetryAll = async () => {
    setRetrying(true);
    setRetryFailedAgain(false);
    try {
      const ids = failedDirectives.map((d) => d.id);
      const ok = await onRetry(ids);
      if (ok) {
        onRetrySuccess?.();
        onClose();
      } else {
        setRetryFailedAgain(true);
      }
    } catch (e) {
      setRetryFailedAgain(true);
    } finally {
      setRetrying(false);
    }
  };

  const handleCopyLogs = () => {
    const logText = failedDirectives
      .map(
        (d, idx) =>
          `[失败记录 ${idx + 1}]\n指令名称: ${d.instructionName}\n目标单位: ${d.targetDept}\n错误代码: ${
            d.errorCode || 'ERR_NET_TIMEOUT'
          }\n详细日志: ${d.errorMessage || '目标专网接口无响应'}\n下发时间: ${d.issuedTime}\n---`
      )
      .join('\n');
    navigator.clipboard.writeText(logText);
    message.success('已复制错误日志排查信息到剪贴板！可直接发送给系统工程师协助排查。');
  };

  const columns = [
    {
      title: '指令名称',
      dataIndex: 'instructionName',
      key: 'instructionName',
      width: 140,
      render: (name: string) => <Tag color="blue" style={{ fontSize: '12px', padding: '1px 8px' }}>{name}</Tag>,
    },
    {
      title: '目标接收单位',
      dataIndex: 'targetDept',
      key: 'targetDept',
      width: 170,
      render: (dept: string) => <strong style={{ color: '#1e293b', fontSize: '13px' }}>🏢 {dept}</strong>,
    },
    {
      title: '失败错误代码',
      dataIndex: 'errorCode',
      key: 'errorCode',
      width: 180,
      render: (code: string) => (
        <Tag color="error" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', padding: '1px 8px' }}>
          {code || 'ERR_NET_TIMEOUT'}
        </Tag>
      ),
    },
    {
      title: '失败原因诊断',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: (msg: string) => (
        <span style={{ color: '#ef4444', fontSize: '12.5px', lineHeight: '18px' }}>
          {msg || '私有化内网网闸摆渡超时 (504 Gateway Timeout)，指令未能写入目标待办池'}
        </span>
      ),
    },
    {
      title: '时效处置建议',
      key: 'actionAdvice',
      width: 160,
      render: () => (
        <Tag color="warning" style={{ fontSize: '11.5px', margin: 0 }}>
          ⏱ 时效已挂起 (免责保护)
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626' }}>
          <ExclamationCircleFilled style={{ fontSize: 22, color: '#ef4444' }} />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>指令下达失败，请重新下达或联系系统负责人协助修复</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={920}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            ℹ️ 重试将仅补发推送失败的单位，已成功的单位无需重复下达
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<CopyOutlined />} onClick={handleCopyLogs}>
              复制错误码与日志
            </Button>
            <Button onClick={onClose}>暂不处理</Button>
            <Button
              type="primary"
              danger
              icon={<ReloadOutlined spin={retrying} />}
              loading={retrying}
              onClick={handleRetryAll}
            >
              重新下达失败指令
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ padding: '8px 0' }}>
        <Alert
          type="error"
          showIcon
          message="跨租户/内网通信链路异常"
          description={
            <div style={{ fontSize: '13px', lineHeight: '20px' }}>
              检测到当前舆情指令在向协同单位内网推送过程中发生阻断。由于目标单位部署环境或安全网闸策略影响，以下
              <strong> {failedDirectives.length} </strong>
              条指令未送达目标系统待办池。系统已对未送达单位自动<strong>挂起处置时效倒计时</strong>，避免造成考核误判。
            </div>
          }
          style={{ marginBottom: 16 }}
        />

        {retryFailedAgain && (
          <Alert
            type="warning"
            showIcon
            message="重新下达仍未连通"
            description="目标内网接口持续无响应，建议点击下方【复制错误码与日志】联系网络管理员检查跨域摆渡网闸通道。"
            style={{ marginBottom: 12 }}
          />
        )}

        <Table
          dataSource={failedDirectives}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          bordered
        />

        <div
          style={{
            marginTop: 16,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '10px 14px',
            fontSize: '12px',
            color: '#475569',
          }}
        >
          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
            💡 容灾与时效保障说明：
          </div>
          <div>1. 您可以随时在此点击“重新下达”发起单点补发，连通后指令将立即自动闭环写入目标内网。</div>
          <div>2. 即使您关闭此网页，在【AI辅助研判-处置详情】与【应急处置】列表卡片中也会持续展示红色失败标识，支持随时行内重发。</div>
          <div>3. 异常提醒已同步写入右上角消息中心，指令成功送达后该条提醒将自动消除。</div>
        </div>
      </div>
    </Modal>
  );
};

export default DirectiveFailureModal;
