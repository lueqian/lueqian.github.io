import React, { useState } from 'react';
import {
  SearchOutlined,
  ReloadOutlined,
  BellOutlined,
  LogoutOutlined,
  EditOutlined,
  ScheduleOutlined,
  UserSwitchOutlined,
  SafetyCertificateOutlined,
  DownOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { Input, Badge, Dropdown, Button, Modal, Switch, Tag, message } from 'antd';
import type { MenuProps } from 'antd';
import { useDirectiveState } from '../context/DirectiveStateContext';

interface HeaderProps {
  onManualReport?: () => void;
  onOpenDutyRoster?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onManualReport, onOpenDutyRoster }) => {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    markAllAsRead,
    retryDirective,
    openAiModal,
  } = useDirectiveState();

  const [searchValue, setSearchValue] = useState('');
  const [msgModalOpen, setMsgModalOpen] = useState(false);
  const [retryingMsgId, setRetryingMsgId] = useState<string | null>(null);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'duty') {
      onOpenDutyRoster?.();
    }
  };

  const userMenuItems: MenuProps['items'] = [
    { key: 'password', label: '修改密码', icon: <EditOutlined /> },
    { key: 'duty', label: '值班表', icon: <ScheduleOutlined /> },
    { key: 'position', label: '岗位', icon: <UserSwitchOutlined /> },
    { key: 'duty-post', label: '区县值班岗', icon: <SafetyCertificateOutlined /> },
  ];

  // 处理消息卡片内的立即重新下发
  const handleRetryFromMsg = async (directiveId?: string, notifId?: string) => {
    if (!directiveId) return;
    setRetryingMsgId(notifId || directiveId);
    try {
      await retryDirective(directiveId);
    } finally {
      setRetryingMsgId(null);
    }
  };

  const activeNotifications = notifications.filter((n) => !n.isResolved);

  return (
    <>
      <header className="system-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🦅</span>
            <span className="logo-text">舆情一体化智控平台</span>
          </div>
          <div className="header-actions">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="action-btn"
              onClick={onManualReport}
            >
              手工上报
            </Button>
            <Button type="text" icon={<SafetyCertificateOutlined />} className="action-btn">
              快捷指令
            </Button>
          </div>
        </div>
        <div className="header-right">
          <div className="search-box">
            <SearchOutlined />
            <Input
              placeholder="请输入关键词搜索..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              bordered={false}
            />
          </div>
          <div className="header-divider" />
          <span className="welcome-text">欢迎 王五！</span>
          <Button type="link" className="header-link">修改密码</Button>
          <Button type="link" className="header-link" onClick={onOpenDutyRoster}>值班表</Button>
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
            <Button type="link" className="header-link">
              岗位：区县值班岗 <DownOutlined style={{ fontSize: 10 }} />
            </Button>
          </Dropdown>
          <div className="header-icons">
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                className="icon-btn"
                onClick={() => setMsgModalOpen(true)}
              />
            </Badge>
            <Button type="text" icon={<ReloadOutlined />} className="icon-btn" onClick={() => message.info('系统数据已刷新')} />
            <Button type="text" icon={<LogoutOutlined />} className="icon-btn" />
          </div>
        </div>
      </header>

      {/* 未读消息弹窗（仿截图 4 设计） */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>未读消息</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12.5px', fontWeight: 'normal' }}>
              <Switch
                size="small"
                checked={soundEnabled}
                onChange={setSoundEnabled}
              />
              <span>消息提示音</span>
            </div>
          </div>
        }
        open={msgModalOpen}
        onCancel={() => setMsgModalOpen(false)}
        footer={
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <Button type="link" onClick={markAllAsRead} style={{ fontSize: '13px' }}>
              设为全部已读
            </Button>
          </div>
        }
        width={580}
        bodyStyle={{ maxHeight: '65vh', overflowY: 'auto', padding: '12px 18px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
              🎉 暂无未读消息与待办提醒
            </div>
          ) : (
            activeNotifications.map((item, index) => {
              const isDirectiveFail = item.type === 'directive_failed';

              return (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${isDirectiveFail ? '#fecaca' : '#f1f5f9'}`,
                    background: isDirectiveFail ? '#fef2f2' : '#fafafa',
                    borderRadius: 8,
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: '13.5px', color: isDirectiveFail ? '#dc2626' : '#1e293b' }}>
                        {index + 1}. {item.title}
                      </strong>
                      {isDirectiveFail && (
                        <Tag color="error" style={{ fontSize: '11px', margin: 0 }}>
                          下达失败
                        </Tag>
                      )}
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{item.time}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '18px', marginBottom: 8 }}>
                    {isDirectiveFail ? (
                      <div>
                        <div style={{ color: '#b91c1c', fontWeight: 500, marginBottom: 4 }}>
                          {item.content}
                        </div>
                        <div style={{ fontSize: '11px', color: '#7f1d1d' }}>
                          目标单位系统尚未接收，处置时效已挂起。点击下方按钮可立即重新下发补发数据。
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          风险等级：<Tag color={item.riskLevel === '红色' ? 'error' : 'blue'}>{item.riskLevel}</Tag>
                        </div>
                        <div style={{ marginTop: 2 }}>事件标题：{item.content}</div>
                        {item.account && <div style={{ marginTop: 2, color: '#64748b' }}>监控账号：{item.account}</div>}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {isDirectiveFail
                        ? '💡 重新下发成功后，本提醒将自动结束消除'
                        : `共 ${item.postCount || 1} 条新内容`}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {isDirectiveFail ? (
                        <>
                          <Button
                            size="small"
                            onClick={() => {
                              setMsgModalOpen(false);
                              openAiModal(null, 'emergency');
                            }}
                          >
                            查看研判
                          </Button>
                          <Button
                            size="small"
                            type="primary"
                            danger
                            loading={retryingMsgId === item.id}
                            onClick={() => handleRetryFromMsg(item.directiveId, item.id)}
                          >
                            立即重新下发
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => {
                            setMsgModalOpen(false);
                            openAiModal(null, 'emergency');
                          }}
                        >
                          查看详情
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </>
  );
};

export default Header;
