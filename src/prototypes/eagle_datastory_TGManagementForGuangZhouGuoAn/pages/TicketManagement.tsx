import React, { useState, useMemo } from 'react';
import { Table, Tag, Input, Button, Select, Space, Card, Typography, Modal, Form, message, ConfigProvider, theme } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BankOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { Ticket, TicketStatus } from '../components/TicketSystemDrawer';

const { Text } = Typography;

interface TicketManagementProps {
  tickets: Ticket[];
  onUpdateTicket: (id: string, status: TicketStatus, remark: string) => void;
}

const TicketManagement: React.FC<TicketManagementProps> = ({ tickets, onUpdateTicket }) => {
  // ============ 状态管理 ============
  const [searchText, setSearchText] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // 处理弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [form] = Form.useForm();

  // ============ 数据处理 ============
  
  // 提取唯一的客户公司列表 (模拟数据中没有公司，我们给每个提交者关联一个公司)
  const companyMap: Record<string, string> = {
    '张警官': '广州市公安局',
    '李警官': '深圳市公安局',
    '王警官': '广州市公安局',
    '当前管理员': '演示单位',
  };

  const filteredTickets = useMemo(() => {
    return tickets
      .map(t => ({ ...t, company: companyMap[t.submitter] || '未知单位' }))
      .filter(t => {
        const matchesSearch = t.content.toLowerCase().includes(searchText.toLowerCase()) || 
                             t.submitter.toLowerCase().includes(searchText.toLowerCase());
        const matchesCompany = companyFilter === 'all' || t.company === companyFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesCompany && matchesStatus;
      })
      .sort((a, b) => new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime());
  }, [tickets, searchText, companyFilter, statusFilter]);

  const companies = ['all', ...Array.from(new Set(Object.values(companyMap)))];

  // ============ 交互处理 ============

  const handleOpenModal = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    form.setFieldsValue({
      status: ticket.status === 'pending' ? 'resolved' : ticket.status,
      remark: ticket.remark || '',
    });
    setModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentTicket) {
        onUpdateTicket(currentTicket.id, values.status, values.remark);
        message.success('工单处理成功');
        setModalOpen(false);
      }
    });
  };

  // ============ 渲染配置 ============

  const STATUS_MAP = {
    pending: { label: '待处理', color: 'blue', icon: <ClockCircleOutlined /> },
    resolved: { label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
    rejected: { label: '已驳回', color: 'red', icon: <CloseCircleOutlined /> },
  };

  const columns = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (text: string) => <Text copyable={{ text }} style={{ fontFamily: 'monospace', color: '#8c8c8c' }}>{text}</Text>,
    },
    {
      title: '客户单位',
      dataIndex: 'company',
      key: 'company',
      width: 160,
      render: (text: string) => (
        <Space>
          <BankOutlined style={{ color: '#bfbfbf' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '客户用户',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 120,
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#bfbfbf' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '工单内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 170,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: TicketStatus) => {
        const config = STATUS_MAP[status];
        return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>;
      },
    },
    {
      title: '处理备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      render: (text: string) => <Text style={{ color: '#8c8c8c' }} ellipsis={{ tooltip: text }}>{text || '-'}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: Ticket) => (
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => handleOpenModal(record)}
          disabled={record.status === 'resolved' || record.status === 'rejected'}
        >
          处理
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <div>
            <Text style={{ marginRight: 8, color: '#333333' }}>客户公司:</Text>
            <Select 
              value={companyFilter} 
              onChange={setCompanyFilter} 
              style={{ width: 180 }}
              options={companies.map(c => ({ value: c, label: c === 'all' ? '全部公司' : c }))}
            />
          </div>
          <div>
            <Text style={{ marginRight: 8, color: '#333333' }}>工单状态:</Text>
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter} 
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending', label: '待处理' },
                { value: 'resolved', label: '已完成' },
                { value: 'rejected', label: '已驳回' },
              ]}
            />
          </div>
          <Input
            placeholder="搜索工单内容/提交人"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredTickets}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showTotal: (total) => `共 ${total} 条工单记录`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="工单处理反馈"
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText="提交反馈"
        cancelText="取消"
        destroyOnClose
      >
        <div style={{ marginBottom: 16, padding: '12px', background: '#f5f5f5', borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>工单详情:</div>
          <div style={{ fontSize: 14 }}>{currentTicket?.content}</div>
        </div>
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="处理结果" rules={[{ required: true }]}>
            <Select options={[
              { value: 'resolved', label: '已完成 (问题解决/需求落实)' },
              { value: 'rejected', label: '已驳回 (需求驳回/无法复现)' },
            ]} />
          </Form.Item>
          <Form.Item name="remark" label="反馈备注" rules={[{ required: true, message: '请填写反馈给客户的备注信息' }]}>
            <Input.TextArea rows={4} placeholder="请填写详细的处理结论，该内容将实时同步给客户..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TicketManagement;
