import React, { useState, useMemo } from 'react';
import { Drawer, Button, Table, Tag, Input, Form, message, Modal, Space, Popconfirm, Select, ConfigProvider, theme } from 'antd';
import {
  FormOutlined,
  PlusOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

export type TicketStatus = 'pending' | 'resolved' | 'rejected';

export interface Ticket {
  id: string;
  content: string;
  submitter: string;
  submitTime: string;
  status: TicketStatus;
  remark?: string;
}

export interface TicketSystemDrawerProps {
  open: boolean;
  onClose: () => void;
  currentUser?: string;
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onCancelTicket: (id: string) => void;
  onMarkAsRead: () => void;
}

// ============ 模拟数据 ============

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'T-20260511-001',
    content: '在重点源监测模块发现一个新的黑产发卡群组，链接是 t.me/black_card_sell，希望能尽快接入布控。',
    submitter: '张警官',
    submitTime: '2026-05-11 10:30:00',
    status: 'resolved',
    remark: '已完成布控接入，群组数据正在采集中。',
  },
  {
    id: 'T-20260511-002',
    content: '系统导出的数据报表中，有一部分群组成员的发言时间显示为时区错误，请排查。',
    submitter: '李警官',
    submitTime: '2026-05-11 14:15:00',
    status: 'pending',
    remark: '研发正在排查底层时区转换逻辑，预计明天修复。',
  },
  {
    id: 'T-20260511-003',
    content: '申请增加对特定海外博彩网站相关讨论组的定向关键词预警功能。',
    submitter: '王警官',
    submitTime: '2026-05-11 16:45:00',
    status: 'pending',
  },
  {
    id: 'T-20260511-004',
    content: '请求调取2024年1月份所有关于“杀猪盘”关键词的历史原始报文，用于旧案复盘。',
    submitter: '李警官',
    submitTime: '2026-05-11 18:20:00',
    status: 'rejected',
    remark: '该时间段的原始报文已超过系统存储有效期（3个月），无法调取。',
  },
];

const STATUS_CONFIG = {
  pending: { label: '待处理', color: 'blue', icon: <ClockCircleOutlined /> },
  resolved: { label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
  rejected: { label: '已驳回', color: 'red', icon: <CloseCircleOutlined /> },
};

// ============ 主组件 ============

const TicketSystemDrawer: React.FC<TicketSystemDrawerProps> = ({
  open,
  onClose,
  currentUser = '当前管理员',
  tickets,
  onAddTicket,
  onCancelTicket,
  onMarkAsRead,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  
  // 新建工单表单
  const [form] = Form.useForm();
  
  // 处理从未读到已读的转化
  React.useEffect(() => {
    if (open) {
      onMarkAsRead();
    }
  }, [open, onMarkAsRead]);

  // ============ 逻辑处理 ============

  // 提交新工单
  const handleSubmitTicket = () => {
    form.validateFields().then((values) => {
      const newTicket: Ticket = {
        id: `T-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        content: values.content,
        submitter: currentUser,
        submitTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'pending',
      };
      
      onAddTicket(newTicket);
      message.success('问题反馈已提交成功');
      form.resetFields();
      setViewMode('list');
    });
  };

  // 用户取消申请
  const handleCancelTicket = (id: string) => {
    onCancelTicket(id);
    message.success('已撤回该反馈申请');
  };

  // 抽屉关闭时的清理
  const handleDrawerClose = () => {
    onClose();
    setTimeout(() => {
      setViewMode('list');
      form.resetFields();
    }, 300);
  };

  // ============ 渲染列 ============

  const columns = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (text: string) => <span style={{ color: '#8c8c8c', fontFamily: 'monospace' }}>{text}</span>,
    },
    {
      title: '申请事项 / 问题描述',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: (text: string) => (
        <div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {text}
        </div>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 120,
      render: (text: string) => (
        <Space size="small">
          <UserOutlined style={{ color: '#8c8c8c' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
    },
    {
      title: '进度状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: TicketStatus) => {
        const config = STATUS_CONFIG[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '处理反馈备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 250,
      render: (text: string, record: Ticket) => {
        if (record.status === 'pending') {
          return <span style={{ color: '#bfbfbf' }}>等待处理中...</span>;
        }
        return <div style={{ color: '#8c8c8c' }}>{text || '-'}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: Ticket) => (
        <Space size="small" direction="vertical" style={{ width: '100%' }}>
          {/* 用户侧操作 */}
          {record.status === 'pending' && record.submitter === currentUser && (
            <Popconfirm
              title="确定要取消这个工单吗？"
              onConfirm={() => handleCancelTicket(record.id)}
              okText="确定取消"
              cancelText="暂不"
            >
              <Button type="link" danger size="small" style={{ padding: 0 }}>取消申请</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: theme.defaultAlgorithm,
        token: {
          colorBgBase: '#ffffff',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorText: 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
          colorBorder: '#d9d9d9',
        }
      }}
    >
      <Drawer
        title={
          <Space>
            <FormOutlined style={{ color: '#1890ff' }} />
            <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>{viewMode === 'list' ? '问题反馈工单系统' : '提交新问题反馈'}</span>
          </Space>
        }
        placement="right"
        width={1350}
        onClose={handleDrawerClose}
        open={open}
        extra={
          viewMode === 'list' ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setViewMode('create')}>
              新建反馈
            </Button>
          ) : (
            <Button onClick={() => setViewMode('list')}>返回列表</Button>
          )
        }
      >
        {viewMode === 'list' ? (
          /* 列表视图 */
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', background: '#e6f4ff', padding: '8px 12px', borderRadius: 4 }}>
              <ExclamationCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              <span style={{ fontSize: 13, color: '#0958d9' }}>
                提示：在此处您可以查看您提交过的所有工单记录。当后台人员处理完成后，您会收到系统通知提示。
              </span>
            </div>
            <Table
              columns={columns}
              dataSource={tickets}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              scroll={{ x: 'max-content' }}
            />
          </div>
        ) : (
          /* 新建工单视图 */
          <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 24 }}>
            <Form form={form} layout="vertical" onFinish={handleSubmitTicket}>
              <Form.Item
                name="content"
                label={<span style={{ fontWeight: 500 }}>描述您的需求、预期或发现的问题</span>}
                rules={[{ required: true, message: '请详细描述您的问题或需求' }]}
                extra="请提供尽可能详尽的信息，例如涉及的群组链接、发现的异常数据截图说明等，以便后台人员快速处理。"
              >
                <Input.TextArea 
                  rows={8} 
                  placeholder="请输入您的反馈内容...&#10;例如：&#10;发现新的可疑TG群组：t.me/example_group，请安排介入。&#10;预期的结果：能提取群内的历史消息记录。" 
                  maxLength={2000}
                  showCount
                />
              </Form.Item>
              <Form.Item style={{ marginTop: 32 }}>
                <Space size="large">
                  <Button type="primary" htmlType="submit" size="large" style={{ width: 120 }}>
                    提交反馈
                  </Button>
                  <Button onClick={() => setViewMode('list')} size="large">
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
    </ConfigProvider>
  );
};

export default TicketSystemDrawer;
