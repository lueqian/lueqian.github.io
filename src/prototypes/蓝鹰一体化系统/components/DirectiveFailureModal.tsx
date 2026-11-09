import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Tag, Typography, Alert, message, Tooltip, Space } from 'antd';
import {
  ExclamationCircleFilled,
  ReloadOutlined,
  CopyOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { DirectiveItem, useDirectiveState } from '../context/DirectiveStateContext';

const { Text } = Typography;

export interface DirectiveFailureModalProps {
  open?: boolean;
  results?: DirectiveItem[];
  failedDirectives?: DirectiveItem[];
  onRetrySuccess?: () => void;
  onClose?: () => void;
  onRetrySingle?: (directiveId: string) => Promise<boolean>;
  onRetry?: (directiveIds: string[]) => Promise<boolean>;
}

const DirectiveFailureModal: React.FC<DirectiveFailureModalProps> = ({
  open,
  results,
  failedDirectives,
  onRetrySuccess,
  onClose,
  onRetrySingle,
  onRetry,
}) => {
  const {
    directives: globalDirectives,
    failedModalVisible,
    closeFailedModal,
    retryDirective: contextRetrySingle,
    batchRetryDirectives: contextRetryBatch,
  } = useDirectiveState();

  const isModalOpen = open !== undefined ? open : failedModalVisible;
  const handleClose = onClose || closeFailedModal;

  const [dataList, setDataList] = useState<DirectiveItem[]>([]);
  const [retryingIds, setRetryingIds] = useState<string[]>([]);
  const [retryingAll, setRetryingAll] = useState(false);

  useEffect(() => {
    if (results && results.length > 0) {
      setDataList(results);
    } else if (failedDirectives && failedDirectives.length > 0) {
      setDataList(failedDirectives);
    } else {
      // 默认读取全局所有失败的指令记录
      const globalFails = globalDirectives.filter((d) => d.status === 'failed');
      setDataList(globalFails);
    }
  }, [results, failedDirectives, globalDirectives, isModalOpen]);

  const currentFailedItems = dataList.filter((item) => item.status === 'failed');
  const hasFailed = currentFailedItems.length > 0;

  // 单条行内重新下达指令
  const handleRetryRow = async (directiveId: string) => {
    setRetryingIds((prev) => [...prev, directiveId]);
    try {
      let ok = false;
      if (onRetrySingle) {
        ok = await onRetrySingle(directiveId);
      } else if (contextRetrySingle) {
        ok = await contextRetrySingle(directiveId);
      } else if (onRetry) {
        ok = await onRetry([directiveId]);
      } else {
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
        onRetrySuccess?.();
      } else {
        message.error('重新下达失败，请稍后重试或查看错误码');
      }
    } catch (e) {
      message.error('网络异常，重新下达失败');
    } finally {
      setRetryingIds((prev) => prev.filter((id) => id !== directiveId));
    }
  };

  // 批量重发所有失败指令
  const handleRetryAll = async () => {
    const failedIds = currentFailedItems.map((d) => d.id);
    if (failedIds.length === 0) return;

    setRetryingAll(true);
    try {
      let ok = false;
      if (onRetry) {
        ok = await onRetry(failedIds);
      } else if (contextRetryBatch) {
        ok = await contextRetryBatch(failedIds);
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
        onRetrySuccess?.();
      }
    } catch (e) {
      message.error('批量重新下达失败');
    } finally {
      setRetryingAll(false);
    }
  };

  // 复制错误码与排查日志
  const handleCopyLogs = () => {
    const logText = currentFailedItems
      .map(
        (d, idx) =>
          `[失败记录 ${idx + 1}]\n相关帖文: ${d.postTitle || '无'}\n指令名称: ${d.instructionName}\n接收部门: ${
            d.targetDept
          }\n下达人: ${d.issuer}\n下达时间: ${d.issuedTime}\n状态编码: ${
            d.errorCode || 'ERR_NET_TIMEOUT'
          }\n错误诊断: ${d.errorMessage || '目标专网接口无响应，网闸摆渡超时'}\n---`
      )
      .join('\n');

    navigator.clipboard.writeText(
      logText || '当前无失败指令，所有指令均已成功推送到目标单位内网。'
    );
    message.success('已复制错误码信息与排查日志，可发送系统工程师协助排查。');
  };

  // 核心表格列规范：｜相关帖子｜指令名称｜接收部门｜下达人｜下达时间｜指令状态｜状态编码｜操作｜
  const columns = [
    {
      title: '相关帖子',
      key: 'postTitle',
      width: 220,
      render: (_: any, record: DirectiveItem) => {
        const title = record.postTitle || '#盱眙马上真的要命，真的体会到了。';
        const platform = record.platform || '抖音app';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Tooltip title={title}>
              <span
                style={{
                  fontWeight: 600,
                  color: '#1e293b',
                  fontSize: '12.5px',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {title}
              </span>
            </Tooltip>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag color="cyan" style={{ fontSize: '11px', margin: 0, padding: '0 6px', borderRadius: 3 }}>
                {platform}
              </Tag>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>ID: {record.eventId || '202610150002'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '指令名称',
      dataIndex: 'instructionName',
      key: 'instructionName',
      width: 110,
      render: (name: string) => (
        <Tag color="blue" style={{ fontSize: '12px', padding: '1px 8px', borderRadius: 4 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: '接收部门',
      dataIndex: 'targetDept',
      key: 'targetDept',
      width: 120,
      render: (dept: string) => (
        <strong style={{ color: '#1e293b', fontSize: '12.5px' }}>
          🏢 {dept}
        </strong>
      ),
    },
    {
      title: '下达人',
      dataIndex: 'issuer',
      key: 'issuer',
      width: 110,
      render: (issuer: string) => (
        <span style={{ color: '#475569', fontSize: '12px' }}>{issuer || '支队值班岗'}</span>
      ),
    },
    {
      title: '下达时间',
      dataIndex: 'issuedTime',
      key: 'issuedTime',
      width: 140,
      render: (time: string) => (
        <span style={{ color: '#64748b', fontSize: '11.5px' }}>{time || '2026-10-15 14:42:52'}</span>
      ),
    },
    {
      title: '指令状态',
      key: 'status',
      width: 170,
      render: (_: any, record: DirectiveItem) => {
        if (record.status === 'failed') {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Tag color="error" style={{ fontSize: '11.5px', margin: 0, padding: '1px 6px' }}>
                ● 下达失败
              </Tag>
              <Tag color="warning" style={{ fontSize: '11px', margin: 0, padding: '0 5px' }}>
                ⏱ 时效已挂起
              </Tag>
            </div>
          );
        }
        return (
          <Space size={4}>
            <Tag color="success" style={{ fontSize: '11.5px', padding: '1px 6px' }}>
              <CheckCircleOutlined style={{ marginRight: 3 }} />
              已送达
            </Tag>
            <span style={{ fontSize: '11px', color: '#16a34a' }}>待办池入库</span>
          </Space>
        );
      },
    },
    {
      title: '状态编码',
      key: 'errorCode',
      width: 140,
      render: (_: any, record: DirectiveItem) => {
        if (record.status === 'failed') {
          return (
            <Tooltip title={record.errorMessage || '专网网闸摆渡超时 (504 Gateway Timeout)'}>
              <Tag
                color="error"
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '11.5px',
                  padding: '1px 6px',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                {record.errorCode || 'ERR_NET_TIMEOUT'}
              </Tag>
            </Tooltip>
          );
        }
        return <span style={{ color: '#94a3b8', fontSize: '12px' }}>-</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 110,
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
              style={{ fontWeight: 500, borderRadius: 4, fontSize: '12px' }}
            >
              重新下达
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
            <ExclamationCircleFilled style={{ fontSize: 20, color: '#ef4444' }} />
          ) : (
            <CheckCircleFilled style={{ fontSize: 20, color: '#10b981' }} />
          )}
          <span style={{ fontSize: '16px', fontWeight: 600, color: hasFailed ? '#dc2626' : '#1e293b' }}>
            {hasFailed ? '跨内网指令下达失败记录管理' : '指令下达推送结果（所有协同单位已送达）'}
          </span>
          <Tag color={hasFailed ? 'error' : 'success'} style={{ borderRadius: 10, fontSize: '11px', padding: '0 8px' }}>
            {hasFailed ? `待重新下达 (${currentFailedItems.length})` : '状态正常'}
          </Tag>
        </div>
      }
      open={isModalOpen}
      onCancel={handleClose}
      width={1060}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {hasFailed
              ? `共检索到 ${currentFailedItems.length} 条下达失败记录。未送达内网的单位处置时效已自动挂起，不会计入考核超时。`
              : '全部指令均已送达目标内网待办池，时效正常倒计时。'}
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
            <Button type={hasFailed ? 'default' : 'primary'} onClick={handleClose}>
              {hasFailed ? '关闭' : '完成'}
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '4px 0' }}>
        {hasFailed ? (
          <Alert
            type="error"
            showIcon
            message="跨内网数据同步流转异常提示"
            description={
              <div style={{ fontSize: '12.5px', lineHeight: '20px' }}>
                由于部分协同单位跨专网安全网闸摆渡超时，导致指令暂未写入目标内网待办池。系统已启动容灾保护，自动<strong>挂起被指派单位的处置时效</strong>。您可以针对具体单位点击<strong>【重新下达】</strong>进行异步补发重试。
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

        {/* 核心表格：｜相关帖子｜指令名称｜接收部门｜下达人｜下达时间｜指令状态｜状态编码｜操作｜ */}
        <Table
          dataSource={dataList}
          columns={columns}
          rowKey="id"
          pagination={dataList.length > 6 ? { pageSize: 6, size: 'small' } : false}
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
