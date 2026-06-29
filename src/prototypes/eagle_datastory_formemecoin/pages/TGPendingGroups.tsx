/**
 * @name TG待布控群组页面
 * @description 广州国安定制版 - 待布控群组管理
 *
 * 包含：
 * - 待布控群组列表（群组链接、申请布控人、申请时间、申请状态）
 * - 添加群组功能
 * - 状态筛选和搜索
 */

import '../style.css';
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Input, Button, Select, Space, Modal, Form, message, Tooltip, Badge } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  LinkOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

type DeployStatus = 'pending' | 'deployed' | 'failed';

interface PendingGroup {
  key: string;
  link: string;
  applicant: string;
  applyTime: string;
  status: DeployStatus;
  remark?: string;
}

// ============ 模拟数据（20条） ============

const MOCK_PENDING_GROUPS: PendingGroup[] = [
  { key: '1', link: 't.me/darknet_market_2024', applicant: '张三', applyTime: '2025-05-09 14:30:00', status: 'pending' },
  { key: '2', link: 't.me/crypto_trade_cn', applicant: '李四', applyTime: '2025-05-09 13:45:00', status: 'pending' },
  { key: '3', link: 't.me/reliable_group', applicant: '王五', applyTime: '2025-05-09 12:20:00', status: 'deployed', remark: '已成功布控' },
  { key: '4', link: 't.me/illegal_content_123', applicant: '赵六', applyTime: '2025-05-09 11:15:00', status: 'failed', remark: '群组已解散' },
  { key: '5', link: 't.me/another_group', applicant: '钱七', applyTime: '2025-05-09 10:30:00', status: 'deployed', remark: '已成功布控' },
  { key: '6', link: 't.me/privacy_channel', applicant: '孙八', applyTime: '2025-05-08 18:45:00', status: 'pending' },
  { key: '7', link: 't.me/underground_trade', applicant: '周九', applyTime: '2025-05-08 17:20:00', status: 'pending' },
  { key: '8', link: 't.me/hacked_data_share', applicant: '吴十', applyTime: '2025-05-08 16:30:00', status: 'failed', remark: '技术原因无法访问' },
  { key: '9', link: 't.me/gray_market_2024', applicant: '郑十一', applyTime: '2025-05-08 15:45:00', status: 'pending' },
  { key: '10', link: 't.me/anonymous_chat', applicant: '王十二', applyTime: '2025-05-08 14:20:00', status: 'deployed', remark: '已成功布控' },
  { key: '11', link: 't.me/sensitive_info', applicant: '冯十三', applyTime: '2025-05-08 13:30:00', status: 'pending' },
  { key: '12', link: 't.me/black_market_cn', applicant: '陈十四', applyTime: '2025-05-08 12:15:00', status: 'failed', remark: '群组已被封禁' },
  { key: '13', link: 't.me/secret_exchange', applicant: '褚十五', applyTime: '2025-05-08 11:45:00', status: 'pending' },
  { key: '14', link: 't.me/dark_web_mirror', applicant: '卫十六', applyTime: '2025-05-08 10:30:00', status: 'deployed', remark: '已成功布控' },
  { key: '15', link: 't.me/crypto_mixing', applicant: '蒋十七', applyTime: '2025-05-07 18:20:00', status: 'pending' },
  { key: '16', link: 't.me/fraud_alert', applicant: '沈十八', applyTime: '2025-05-07 17:45:00', status: 'pending' },
  { key: '17', link: 't.me/data_leak_hub', applicant: '韩十九', applyTime: '2025-05-07 16:30:00', status: 'failed', remark: '链接无效' },
  { key: '18', link: 't.me/whistleblower', applicant: '杨二十', applyTime: '2025-05-07 15:20:00', status: 'deployed', remark: '已成功布控' },
  { key: '19', link: 't.me/anti_surveillance', applicant: '朱二一', applyTime: '2025-05-07 14:15:00', status: 'pending' },
  { key: '20', link: 't.me/encrypted_comm', applicant: '秦二二', applyTime: '2025-05-07 13:30:00', status: 'pending' },
];

// ============ 状态配置 ============

const STATUS_CONFIG = {
  pending: { label: '待布控', className: 'tgp-status--pending', icon: <ClockCircleOutlined /> },
  deployed: { label: '已布控', className: 'tgp-status--deployed', icon: <CheckCircleOutlined /> },
  failed: { label: '无法布控', className: 'tgp-status--failed', icon: <CloseCircleOutlined /> },
};

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: '全部状态' },
  { value: 'pending', label: '待布控' },
  { value: 'deployed', label: '已布控' },
  { value: 'failed', label: '无法布控' },
];

// ============ 主组件 ============

const TGPendingGroups: React.FC = function () {
  // 列表数据
  const [dataSource, setDataSource] = useState<PendingGroup[]>(MOCK_PENDING_GROUPS);

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 已布控群组集合（用于重复检测）
  const deployedLinks = useMemo(function () {
    return new Set(dataSource.filter(function (item) { return item.status === 'deployed'; }).map(function (item) { return item.link; }));
  }, [dataSource]);

  // 待布控群组集合
  const pendingLinks = useMemo(function () {
    return new Set(dataSource.filter(function (item) { return item.status === 'pending'; }).map(function (item) { return item.link; }));
  }, [dataSource]);

  // 无法布控群组集合
  const failedLinks = useMemo(function () {
    return new Set(dataSource.filter(function (item) { return item.status === 'failed'; }).map(function (item) { return item.link; }));
  }, [dataSource]);

  // 筛选后的数据
  const filteredData = useMemo(function () {
    let result = [...dataSource];

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(function (item) { return item.status === statusFilter; });
    }

    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(function (item) {
        return item.link.toLowerCase().includes(keyword) ||
               item.applicant.toLowerCase().includes(keyword);
      });
    }

    return result;
  }, [dataSource, statusFilter, searchKeyword]);

  // 统计数据
  const stats = useMemo(function () {
    return {
      total: dataSource.length,
      pending: dataSource.filter(function (item) { return item.status === 'pending'; }).length,
      deployed: dataSource.filter(function (item) { return item.status === 'deployed'; }).length,
      failed: dataSource.filter(function (item) { return item.status === 'failed'; }).length,
    };
  }, [dataSource]);

  // 检查链接是否已存在
  const checkLinkExists = useCallback(function (link: string): 'deployed' | 'pending' | 'failed' | null {
    if (deployedLinks.has(link)) return 'deployed';
    if (pendingLinks.has(link)) return 'pending';
    if (failedLinks.has(link)) return 'failed';
    return null;
  }, [deployedLinks, pendingLinks, failedLinks]);

  // 打开添加弹窗
  const handleOpenModal = useCallback(function () {
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  // 关闭弹窗
  const handleCloseModal = useCallback(function () {
    setModalOpen(false);
    form.resetFields();
  }, [form]);

  // 提交添加群组
  const handleSubmit = useCallback(function () {
    form.validateFields().then(function (values) {
      const link = values.link.trim();

      // 检查是否已存在
      const existStatus = checkLinkExists(link);
      if (existStatus === 'deployed') {
        message.warning('该群组已布控，请在已关注群组中查看详情');
        return;
      }
      if (existStatus === 'pending') {
        message.warning('该群组已提交待布控申请，请勿重复提交');
        return;
      }
      if (existStatus === 'failed') {
        message.warning('该群组由于技术原因无法布控，请勿重复提交');
        return;
      }

      // 添加新记录
      const newItem: PendingGroup = {
        key: `new_${Date.now()}`,
        link: link,
        applicant: '当前用户',
        applyTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'pending',
      };

      setDataSource(function (prev) { return [newItem, ...prev]; });
      message.success('已成功提交布控申请');
      handleCloseModal();
    });
  }, [form, checkLinkExists, handleCloseModal]);

  // 表格列定义
  const columns = [
    {
      title: '群组链接',
      dataIndex: 'link',
      key: 'link',
      width: 280,
      render: function (text: string) {
        return (
          <div className="tgp-link-cell">
            <LinkOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span className="tgp-link-text">{text}</span>
          </div>
        );
      },
    },
    {
      title: '申请布控人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 120,
      render: function (text: string) {
        return (
          <div className="tgp-applicant-cell">
            <UserOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 180,
      render: function (text: string) {
        return (
          <span className="tgp-time-text">{text}</span>
        );
      },
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: function (status: DeployStatus) {
        const config = STATUS_CONFIG[status];
        return (
          <span className={`tgp-status-tag ${config.className}`}>
            {config.icon}
            <span className="tgp-status-text">{config.label}</span>
          </span>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      render: function (text: string, record: PendingGroup) {
        if (record.status === 'pending') {
          return <span style={{ color: '#8c8c8c' }}>等待处理中...</span>;
        }
        return text || '-';
      },
    },
  ];

  return (
    <div className="tgp-container">
      {/* 统计卡片 */}
      <div className="tgp-stats-row">
        <div className="tgp-stat-card">
          <div className="tgp-stat-value">{stats.total}</div>
          <div className="tgp-stat-label">总申请数</div>
        </div>
        <div className="tgp-stat-card tgp-stat-card--pending">
          <div className="tgp-stat-value">{stats.pending}</div>
          <div className="tgp-stat-label">待布控</div>
        </div>
        <div className="tgp-stat-card tgp-stat-card--success">
          <div className="tgp-stat-value">{stats.deployed}</div>
          <div className="tgp-stat-label">已布控</div>
        </div>
        <div className="tgp-stat-card tgp-stat-card--error">
          <div className="tgp-stat-value">{stats.failed}</div>
          <div className="tgp-stat-label">无法布控</div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="tgp-toolbar">
        <div className="tgp-toolbar-left">
          <Input
            placeholder="搜索群组链接/申请人"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchKeyword}
            onChange={function (e) { setSearchKeyword(e.target.value); }}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            style={{ width: 140 }}
          />
        </div>
        <div className="tgp-toolbar-right">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            添加群组
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="tgp-table-wrapper">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: function (total) { return `共 ${total} 条`; },
          }}
          rowKey="key"
          size="middle"
        />
      </div>

      {/* 添加群组弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkOutlined style={{ color: '#1890ff' }} />
            <span>添加布控群组</span>
          </div>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        okText="提交申请"
        cancelText="取消"
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="link"
            label="群组链接"
            rules={[
              { required: true, message: '请输入群组链接' },
              { pattern: /^t\.me\/[a-zA-Z0-9_]+$/, message: '请输入正确的Telegram群组链接，如：t.me/example_group' },
            ]}
          >
            <Input
              placeholder="请输入群组链接，如：t.me/example_group"
              prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>
          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <ExclamationCircleOutlined style={{ color: '#faad14', marginTop: 2 }} />
              <div style={{ fontSize: 13, color: '#595959', lineHeight: 1.6 }}>
                <div>温馨提示：</div>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                  <li>提交后，后台开发人员将定期处理您的申请</li>
                  <li>处理完成后，状态将更新为"已布控"或"无法布控"</li>
                  <li>请勿重复提交相同的群组链接</li>
                </ul>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TGPendingGroups;
