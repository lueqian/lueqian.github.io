import React from 'react';
import { Button, Tag, Space, Typography } from 'antd';
import {
  SyncOutlined,
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useDirectiveState } from '../context/DirectiveStateContext';

const { Text } = Typography;

const DirectiveProgressWidget: React.FC = () => {
  const {
    isDispatching,
    dispatchInfo,
    dismissDispatchWidget,
    openFailedModal,
  } = useDirectiveState();

  if (!isDispatching && !dispatchInfo) {
    return null;
  }

  const isPending = dispatchInfo?.status === 'dispatching';
  const isSuccess = dispatchInfo?.status === 'success';
  const isFailure = dispatchInfo?.status === 'partial_failure';

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 1050,
        width: 380,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16), 0 2px 8px rgba(15, 23, 42, 0.08)',
        border: isFailure ? '1px solid #fecaca' : '1px solid #e2e8f0',
        padding: '14px 16px',
        pointerEvents: 'auto',
        animation: 'slideInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isPending && (
            <SyncOutlined spin style={{ color: '#2563eb', fontSize: 17 }} />
          )}
          {isSuccess && (
            <CheckCircleFilled style={{ color: '#16a34a', fontSize: 17 }} />
          )}
          {isFailure && (
            <ExclamationCircleFilled style={{ color: '#ef4444', fontSize: 17 }} />
          )}

          <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
            {isPending && '跨内网协同指令下达流转中'}
            {isSuccess && '全量协同指令下达成功'}
            {isFailure && '部分指令跨内网推送失败'}
          </span>

          <Tag
            color={isPending ? 'processing' : isSuccess ? 'success' : 'error'}
            style={{ fontSize: '11px', lineHeight: '18px', padding: '0 6px', margin: 0, borderRadius: 4 }}
          >
            {isPending ? '非阻塞后台同步' : isSuccess ? '已送达' : '网闸超时'}
          </Tag>
        </div>

        <button
          type="button"
          onClick={dismissDispatchWidget}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: 4,
            fontSize: '12px',
          }}
          title="关闭浮窗"
        >
          <CloseOutlined />
        </button>
      </div>

      {dispatchInfo && (
        <div style={{ fontSize: '12px', color: '#475569', lineHeight: '20px' }}>
          <div
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: 4,
              color: '#334155',
            }}
          >
            <span style={{ color: '#64748b' }}>关联帖文：</span>
            <strong>{dispatchInfo.postTitle || '#盱眙马上真的要命，真的体会到了。'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ color: '#64748b' }}>推送目标：</span>
            {dispatchInfo.targetDepts.map((dept) => (
              <Tag
                key={dept}
                style={{
                  fontSize: '11px',
                  margin: 0,
                  padding: '0 5px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#1e293b',
                }}
              >
                {dept}
              </Tag>
            ))}
          </div>

          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            {isPending && (
              <span>
                正在通过公安专网安全网闸摆渡数据包，不影响您继续在当前页面执行其他研判操作...
              </span>
            )}
            {isSuccess && (
              <span style={{ color: '#16a34a' }}>
                全部目标单位内网待办池已成功写入并激活时效计时。
              </span>
            )}
            {isFailure && (
              <span style={{ color: '#dc2626' }}>
                目标单位专网无响应，系统已对失败单位自动挂起时效，可随时重新下达。
              </span>
            )}
          </div>
        </div>
      )}

      {/* 底部操作或进度条 */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        {isFailure && (
          <Button
            type="primary"
            danger
            size="small"
            icon={<ArrowRightOutlined />}
            onClick={() => {
              openFailedModal();
            }}
            style={{ fontSize: '12px', height: 26, borderRadius: 4 }}
          >
            查看失败记录并重新下达
          </Button>
        )}
      </div>

      {isPending && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            overflow: 'hidden',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: '#e2e8f0',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#2563eb',
              animation: 'indeterminateProgress 1.4s infinite linear',
              transformOrigin: '0% 50%',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DirectiveProgressWidget;
