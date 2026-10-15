import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag, Typography, Alert, message, Tooltip, Space } from 'antd';
import {
  ExclamationCircleFilled,
  ReloadOutlined,
  CopyOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { DirectiveItem } from '../context/DirectiveStateContext';

const { Text } = Typography;

export interface DirectiveFailureModalProps {
  open: boolean;
  results?: DirectiveItem[];
  failedDirectives?: DirectiveItem[];
  onRetrySuccess?: () => void;
  onClose: () => void;
  onRetrySingle?: (directiveId: string) => Promise<boolean>;
  onRetry?: (directiveIds: string[]) => Promise<boolean>;
}

const DirectiveFailureModal: React.FC<DirectiveFailureModalProps> = ({
  open,
  results,
  failedDirectives = [],
  onRetrySuccess,
  onClose,
  onRetrySingle,
  onRetry,
}) => {
  // 数据源：优先使用全部结果 results；若无则使用 failedDirectives
  const [dataList, setDataList] = useState<DirectiveItem[]>([]);
  const [retryingIds, setRetryingIds] = useState<string[]>([]);
  const [retryingAll, setRetryingAll] = useState(false);

  useEffect(() => {
    if (results && results.length > 0) {
      setDataList(results);
    } else if (failedDirectives && failedDirectives.length > 0) {
      setDataList(failedDirectives);
    } else {
      setDataList([]);
    }
  }, [results, failedDirectives, open]);

  const currentFailedItems = dataList.filter((item) => item.status === 'failed');
  const hasFailed = currentFailedItems.length > 0;

  // 单条行内重发指令
  const handleRetryRow = async (directiveId: string) => {
    setRetryingIds((prev) => [...prev, directiveId]);
    try {
      let ok = false;
      if (onRetrySingle) {
        ok = await onRetrySingle(directiveId);
      } else if (onRetry) {
        ok = await onRetry([directiveId]);
      } else {
        // 本地模拟重试成功
        await new Promise((r) => setTimeout(r, 1000));
        ok = true;
      }

      if (ok) {
        setDataList((prev) =>
          prev.map((item) =>
            item.id === directiveId
              ? { ...item, status: 'pending_sign', errorCode: undefined, errorMessage: undefined }
              : item
          )
        );
        message.success('指令已成功重新推送到该部门内网！时效恢复计时。');
        onRetrySuccess?.();
      } else {
        message.error('重发指令失败，请稍后重试或查看错误码');
      }
    } catch (e) {
      message.error('网络异常，重发失败');
    } finally {
      setRetryingIds((prev) => prev.filter((id) => id !== directiveId));
    }
  };

  // 重发所有失败指令
  const handleRetryAll = async () => {
    const failedIds = currentFailedItems.map((d) => d.id);
    if (failedIds.length === 0) return;

    setRetryingAll(true);
    try {
      let ok = false;
      if (onRetry) {
        ok = await onRetry(failedIds);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        ok = true;
      }

      if (ok) {
        setDataList((prev) =>
          prev.map((item) =>
            failedIds.includes(item.id)
              ? { ...item, status: 'pending_sign', errorCode: undefined, errorMessage: undefined }
              : item
          )
        );
        message.success(`已全量重新推送 ${failedIds.length} 项指令！已成功送达目标内网。`);
        onRetrySuccess?.();
      }
    } catch (e) {
      message.error('批量重发失败');
    } finally {
      setRetryingAll(false);
    }
  };

  // 复制错误码与排查日志
  const handleCopyLogs = () => {
    const logText = currentFailedItems
      .map(
        (d, idx) =>
          `[失败记录 ${idx + 1}]\n指令名称: ${d.instructionName}\n接收部门: ${d.targetDept}\n错误代码: ${
            d.errorCode || 'ERR_NET_TIMEOUT'
          }\n详细日志: ${d.errorMessage || '目标专网接口无响应'}\n下发时间: ${d.issuedTime}\n---`
      )
      .join('\n');

    navigator.clipboard.writeText(
      logText || '当前无失败指令，所有指令均已成功推送到目标单位内网。'
    );
    message.success('已复制错误码信息，可截图或直接发送系统工程师协助排查。');
  };

  // 表格列规范：｜指令名称｜接收部门｜推送状态｜操作｜
  const columns = [
    {
      title: '指令名称',
      dataIndex: 'instructionName',
      key: 'instructionName',
      width: 150,
      render: (name: string) => (
        <Tag color="blue" style={{ fontSize: '12.5px', padding: '2px 10px', borderRadius: 4 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '接收部门',
      dataIndex: 'targetDept',
      key: 'targetDept',
      width: 180,
      render: (dept: string) => (
        <strong style={{ color: '#1e293b', fontSize: '13px' }}>
          🏢 {dept}
        </strong>
      ),
    },
    {
      title: '推送状态',
      key: 'pushStatus',
      width: 320,
      render: (_: any, record: DirectiveItem) => {
        if (record.status === 'failed') {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '12.5px' }}>
                推送失败-错误码：
              </span>
              <Tooltip title={record.errorMessage || '专网网闸摆渡超时 (504 Gateway Timeout)'}>
                <Tag
                  color="error"
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    fontSize: '12px',
                    padding: '1px 8px',
                    cursor: 'pointer',
                  }}
                >
                  {record.errorCode || 'ERR_NET_TIMEOUT'}
                </Tag>
              </Tooltip>
              <Tag color="warning" style={{ fontSize: '11px', margin: 0, padding: '0 6px' }}>
                时效已挂起
              </Tag>
            </div>
          );
        }
        return (
          <Space>
            <Tag color="success" style={{ fontSize: '12px', padding: '2px 8px' }}>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              推送成功
            </Tag>
            <span style={{ fontSize: '11.5px', color: '#16a34a' }}>已写入目标待办池</span>
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      align: 'center' as const,
      render: (_: any, record: DirectiveItem) => {
        if (record.status === 'failed') {
          const isRowRetrying = retryingIds.includes(record.id);
          return (
            <Button
              type="primary"
              danger
              size="small"
              icon={<ReloadOutlined spin={isRowRetrying} />}
              loading={isRowRetrying}
              onClick={() => handleRetryRow(record.id)}
              style={{ fontWeight: 500, borderRadius: 4 }}
            >
              重发指令
            </Button>
          );
        }
        return <span style={{ color: '#94a3b8', fontSize: '13px' }}>-</span>;
      },
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {hasFailed ? (
            <ExclamationCircleFilled style={{ fontSize: 22, color: '#ef4444' }} />
          ) : (
            <CheckCircleFilled style={{ fontSize: 22, color: '#10b981' }} />
          )}
          <span style={{ fontSize: '16.5px', fontWeight: 600, color: hasFailed ? '#dc2626' : '#1e293b' }}>
            {hasFailed ? '指令推送结果提醒（部分单位推送失败）' : '指令下达推送结果（全部成功送达）'}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={920}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {hasFailed
              ? `共推送 ${dataList.length} 个目标，其中 ${currentFailedItems.length} 个失败。未送达单位处置时效已自动挂起`
              : '全部指令均已送达目标内网待办池，时效正常倒计时'}
          </div>
          <Space>
            {hasFailed && (
              <Button icon={<CopyOutlined />} onClick={handleCopyLogs}>
                复制错误码与日志
              </Button>
            )}
            {hasFailed && (
              <Button
                type="primary"
                danger
                icon={<ReloadOutlined spin={retryingAll} />}
                loading={retryingAll}
                onClick={handleRetryAll}
              >
                重发全部失败指令
              </Button>
            )}
            <Button type={hasFailed ? 'default' : 'primary'} onClick={onClose}>
              {hasFailed ? '关闭' : '完成'}
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '8px 0' }}>
        {hasFailed ? (
          <Alert
            type="error"
            showIcon
            message="跨租户专网通信链路波动：部分指令推送失败"
            description={
              <div style={{ fontSize: '12.5px', lineHeight: '20px' }}>
                本次指令共下达至 <strong>{dataList.length}</strong> 个协同单位，其中{' '}
                <strong>{dataList.length - currentFailedItems.length}</strong> 个推送成功，
                <strong style={{ color: '#dc2626' }}> {currentFailedItems.length} </strong>{' '}
                个由于专网网闸波动超时推送失败。系统已对失败单位自动<strong>挂起处置时效</strong>，避免考核误判。
              </div>
            }
            style={{ marginBottom: 14 }}
          />
        ) : (
          <Alert
            type="success"
            showIcon
            message="全链路校验通过：所有协同单位指令均已成功送达"
            description="各目标单位内网待办池已成功入库，相关经办人员账号已激活任务倒计时。"
            style={{ marginBottom: 14 }}
          />
        )}

        {/* 核心表格：｜指令名称｜接收部门｜推送状态｜操作｜ */}
        <Table
          dataSource={dataList}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered
          style={{ background: '#fff' }}
        />

        {/* 底部小字提醒 */}
        <div
          style={{
            marginTop: 14,
            fontSize: '12px',
            color: '#64748b',
            lineHeight: '20px',
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 6,
            padding: '10px 14px',
          }}
        >
          <span style={{ color: '#d97706', fontWeight: 600 }}>💡 提示：</span>
          如出现重发指令失败，建议联系相关地市登录省厅系统分配的账号进行处置，同时将错误码信息截图发送给系统工程师协助排查问题。
        </div>
      </div>
    </Modal>
  );
};

export default DirectiveFailureModal;
