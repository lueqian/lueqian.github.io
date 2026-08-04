import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Input,
  Tag,
  Modal,
  Form,
  Space,
  Popconfirm,
  Card,
  Tooltip,
  Cascader,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { leaderStore, LeaderItem, departmentCascadeOptions } from '../leader-data';

const LeaderManagement: React.FC = () => {
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  const [dutyLeaderName, setDutyLeaderName] = useState<string>('');
  const [searchKey, setSearchKey] = useState('');

  // Modal 状态
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeaderItem | null>(null);
  const [form] = Form.useForm();

  // 监听 Store 变化
  useEffect(() => {
    setLeaders(leaderStore.getLeaders());
    setDutyLeaderName(leaderStore.getDutyLeader());

    const unsubLeaders = leaderStore.subscribe((newLeaders) => {
      setLeaders(newLeaders);
    });
    const unsubDuty = leaderStore.subscribeDutyLeader((name) => {
      setDutyLeaderName(name);
    });

    return () => {
      unsubLeaders();
      unsubDuty();
    };
  }, []);

  // 筛选列表
  const filteredLeaders = useMemo(() => {
    return leaders.filter((item) => {
      if (!searchKey) return true;
      const k = searchKey.toLowerCase();
      const deptStr = item.department ? item.department.join('/') : '';
      return (
        item.name.toLowerCase().includes(k) ||
        item.policeId.toLowerCase().includes(k) ||
        item.phone.includes(k) ||
        deptStr.toLowerCase().includes(k)
      );
    });
  }, [leaders, searchKey]);

  // 打开新增
  const handleOpenAdd = () => {
    setEditingLeader(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑
  const handleOpenEdit = (record: LeaderItem) => {
    setEditingLeader(record);
    form.setFieldsValue({
      name: record.name,
      policeId: record.policeId,
      phone: record.phone,
      department: record.department,
    });
    setModalVisible(true);
  };

  // 提交 Modal
  const handleSubmitModal = async () => {
    try {
      const values = await form.validateFields();
      if (editingLeader) {
        leaderStore.updateLeader(editingLeader.id, values);
        message.success(`领导【${values.name}】信息修改成功`);
      } else {
        leaderStore.addLeader(values);
        message.success(`成功新增领导【${values.name}】`);
      }
      setModalVisible(false);
    } catch (e) {
      // 校验未通过
    }
  };

  // 删除处理
  const handleDelete = (record: LeaderItem) => {
    const result = leaderStore.deleteLeader(record.id);
    if (result.success) {
      message.success(`领导【${record.name}】已被删除`);
    } else {
      Modal.warning({
        title: '无法删除领导信息',
        content: result.message || '该领导当前绑定在值班表中，无法删除。',
        okText: '知道了',
      });
    }
  };

  // 一键呼叫
  const handleContact = (name: string, phone: string) => {
    message.success({
      content: `已成功复制联系方式：${name} (${phone})，已发起警务通强连...`,
      icon: <PhoneOutlined style={{ color: '#52c41a' }} />,
    });
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 70,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '领导姓名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string) => {
        const isOnDuty = text === dutyLeaderName;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{text}</span>
            {isOnDuty && (
              <Tooltip title="当前已在值班表中被选为值班领导，无法直接删除">
                <Tag color="gold" style={{ margin: 0, padding: '0 6px', fontSize: 12, borderRadius: 4 }}>
                  <CrownOutlined /> 当前值班中
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: '警号',
      dataIndex: 'policeId',
      key: 'policeId',
      width: 150,
      render: (text: string) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, padding: '2px 8px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (phone: string, record: LeaderItem) => (
        <Button
          type="link"
          size="small"
          icon={<PhoneOutlined />}
          style={{ padding: 0, height: 'auto', fontWeight: 500, fontSize: 14 }}
          onClick={() => handleContact(record.name, phone)}
        >
          {phone}
        </Button>
      ),
    },
    {
      title: '所在部门',
      dataIndex: 'department',
      key: 'department',
      render: (dept: string[]) => {
        if (!dept || dept.length === 0) return <span style={{ color: '#94a3b8' }}>-</span>;
        return (
          <Tag color="cyan" style={{ fontSize: 13, padding: '2px 8px', borderRadius: 4 }}>
            <ApartmentOutlined /> {dept.join(' / ')}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: LeaderItem) => {
        const isOnDuty = record.name === dutyLeaderName;
        return (
          <Space size="middle">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
            >
              编辑
            </Button>

            {isOnDuty ? (
              <Tooltip title="该领导当前处于值班状态，解除值班前不可删除">
                <Button
                  type="link"
                  danger
                  disabled
                  size="small"
                  icon={<LockOutlined />}
                  style={{ opacity: 0.6 }}
                >
                  删除 (已绑定)
                </Button>
              </Tooltip>
            ) : (
              <Popconfirm
                title="确定要删除该领导信息吗？"
                onConfirm={() => handleDelete(record)}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="leader-management-container" style={{ padding: '4px 0' }}>
      {/* 顶部搜索与新增按钮区 */}
      <Card bordered={false} bodyStyle={{ padding: '16px 20px' }} style={{ marginBottom: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* 左侧搜索支持按姓名、警号、电话、所在部门模糊检索 */}
          <Input
            placeholder="搜索姓名 / 警号 / 电话 / 所在部门..."
            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            style={{ width: 320 }}
            allowClear
          />

          {/* 右侧新增领导信息按钮 */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            style={{ background: '#1677ff', borderRadius: 6, fontWeight: 500 }}
          >
            新增领导信息
          </Button>
        </div>
      </Card>

      {/* 领导列表 Table */}
      <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 8 }}>
        <Table
          dataSource={filteredLeaders}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条领导信息`,
          }}
        />
      </Card>

      {/* 新增/编辑 Modal */}
      <Modal
        title={editingLeader ? `编辑领导信息 - ${editingLeader.name}` : '新增领导信息'}
        open={modalVisible}
        onOk={handleSubmitModal}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        width={500}
        okText={editingLeader ? '保存修改' : '确认新增'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="领导姓名"
            rules={[{ required: true, message: '请输入领导姓名' }]}
          >
            <Input placeholder="请输入姓名（如：李广正）" prefix={<UserOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item
            name="policeId"
            label="警号"
            rules={[{ required: true, message: '请输入警号' }]}
          >
            <Input placeholder="请输入警号（如：POL-023001）" prefix={<SafetyCertificateOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系方式"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码' },
            ]}
          >
            <Input placeholder="请输入手机号码（如：13908312345）" prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} />
          </Form.Item>

          <Form.Item
            name="department"
            label="所在部门"
            rules={[{ required: true, message: '请选择所在部门' }]}
          >
            <Cascader
              options={departmentCascadeOptions}
              placeholder="请选择所在部门（如：淮安区 / 镇淮楼派出所）"
              showSearch={{
                filter: (inputValue, path) =>
                  path.some((option) =>
                    (option.label as string).toLowerCase().includes(inputValue.toLowerCase())
                  ),
              }}
              expandTrigger="hover"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaderManagement;
