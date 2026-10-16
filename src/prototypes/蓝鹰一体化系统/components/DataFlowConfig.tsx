import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Drawer,
  Form,
  InputNumber,
  Radio,
  message,
  Badge,
  Tooltip,
  Alert,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApiOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons';

// 系统部署时初始化的地市部门与部门代码字典列表
export interface DepartmentDictItem {
  deptName: string;
  deptCode: string;
  defaultEndpoint?: string;
}

export const INITIAL_DEPARTMENT_LIST: DepartmentDictItem[] = [
  { deptName: '南京市', deptCode: 'DEPT_NJ_001', defaultEndpoint: 'https://ga.nanjing.internal:8443/api/v1/directive/receive' },
  { deptName: '无锡市', deptCode: 'DEPT_WX_003', defaultEndpoint: 'https://ga.wuxi.internal:8443/api/v1/directive/receive' },
  { deptName: '徐州市', deptCode: 'DEPT_XZ_002', defaultEndpoint: 'https://ga.xuzhou.internal:8443/api/v1/directive/receive' },
  { deptName: '常州市', deptCode: 'DEPT_CZ_004', defaultEndpoint: 'https://ga.changzhou.internal:8443/api/v1/directive/receive' },
  { deptName: '苏州市', deptCode: 'DEPT_SZ_005', defaultEndpoint: 'https://ga.suzhou.internal:8443/api/v1/directive/receive' },
  { deptName: '南通市', deptCode: 'DEPT_NT_006', defaultEndpoint: 'https://ga.nantong.internal:8443/api/v1/directive/receive' },
  { deptName: '连云港市', deptCode: 'DEPT_LYG_007', defaultEndpoint: 'https://ga.lyg.internal:8443/api/v1/directive/receive' },
  { deptName: '淮安市', deptCode: 'DEPT_HA_008', defaultEndpoint: 'https://ga.huaian.internal:8443/api/v1/directive/receive' },
  { deptName: '盐城市', deptCode: 'DEPT_YC_009', defaultEndpoint: 'https://ga.yancheng.internal:8443/api/v1/directive/receive' },
  { deptName: '扬州市', deptCode: 'DEPT_YZ_010', defaultEndpoint: 'https://ga.yangzhou.internal:8443/api/v1/directive/receive' },
  { deptName: '镇江市', deptCode: 'DEPT_ZJ_011', defaultEndpoint: 'https://ga.zhenjiang.internal:8443/api/v1/directive/receive' },
  { deptName: '泰州市', deptCode: 'DEPT_TZ_012', defaultEndpoint: 'https://ga.taizhou.internal:8443/api/v1/directive/receive' },
  { deptName: '宿迁市', deptCode: 'DEPT_SQ_013', defaultEndpoint: 'https://ga.suqian.internal:8443/api/v1/directive/receive' },
];

// 数据流转路径记录接口（总队端）
export interface DataFlowRouteItem {
  key: string;
  deptName: string; // 部门字段
  deptCode: string;
  primaryEndpoint: string;
  status: 'connected' | 'error';
  latencyMs: number;
}

interface DataFlowConfigProps {
  initialRole?: 'provincial' | 'city';
}

const DataFlowConfig: React.FC<DataFlowConfigProps> = ({ initialRole = 'provincial' }) => {
  // 当前公司定位：'provincial' (总队单位) | 'city' (地市单位)
  const [companyType, setCompanyType] = useState<'provincial' | 'city'>(initialRole);

  // ---------------------------------------------------------------------------
  // 1. 总队端状态（仅保留地市流转列表与流转路径管理两套功能）
  // ---------------------------------------------------------------------------
  const [routes, setRoutes] = useState<DataFlowRouteItem[]>([
    {
      key: 'xuzhou',
      deptName: '徐州市',
      deptCode: 'DEPT_XZ_002',
      primaryEndpoint: 'https://ga.xuzhou.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 16,
    },
    {
      key: 'huaian',
      deptName: '淮安市',
      deptCode: 'DEPT_HA_008',
      primaryEndpoint: 'https://ga.huaian.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 14,
    },
    {
      key: 'nanjing',
      deptName: '南京市',
      deptCode: 'DEPT_NJ_001',
      primaryEndpoint: 'https://ga.nanjing.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 12,
    },
    {
      key: 'suzhou',
      deptName: '苏州市',
      deptCode: 'DEPT_SZ_005',
      primaryEndpoint: 'https://ga.suzhou.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 19,
    },
    {
      key: 'wuxi',
      deptName: '无锡市',
      deptCode: 'DEPT_WX_003',
      primaryEndpoint: 'https://ga.wuxi.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 15,
    },
    {
      key: 'changzhou',
      deptName: '常州市',
      deptCode: 'DEPT_CZ_004',
      primaryEndpoint: 'https://ga.changzhou.internal:8443/api/v1/directive/receive',
      status: 'connected',
      latencyMs: 18,
    },
  ]);

  const [searchText, setSearchText] = useState('');
  const [testingRowKey, setTestingRowKey] = useState<string | null>(null);

  // 路径管理抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataFlowRouteItem | null>(null);
  const [form] = Form.useForm();

  // ---------------------------------------------------------------------------
  // 2. 地市端状态（仅保留目标地址、重试范围与快速检测，无需备用地址）
  // ---------------------------------------------------------------------------
  const [cityTargetPrimaryUrl, setCityTargetPrimaryUrl] = useState(
    'https://jsga.provincial.internal:8443/gateway/directive/feedback'
  );
  const [cityTimeoutMs, setCityTimeoutMs] = useState<number>(5000); // 默认 5000ms
  const [cityRetries, setCityRetries] = useState<number>(3); // 默认 3次
  const [cityTesting, setCityTesting] = useState(false);
  const [cityTestResult, setCityTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    time?: string;
  } | null>({
    success: true,
    message: '专网目标地址响应正常，双向握手通畅',
    latencyMs: 14,
    time: '2026-10-16 11:00:22',
  });

  // 单点测通（总队端）
  const handleTestSingleRoute = (item: DataFlowRouteItem) => {
    setTestingRowKey(item.key);
    setTimeout(() => {
      setTestingRowKey(null);
      message.success(`【${item.deptName}】地址连通性正常 (时延: ${item.latencyMs}ms)`);
    }, 500);
  };

  // 打开抽屉
  const handleOpenDrawer = (item?: DataFlowRouteItem) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue({
        deptName: item.deptName,
        primaryEndpoint: item.primaryEndpoint,
      });
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  // 部门名称下拉联动填充默认地址
  const handleDeptNameChange = (deptName: string) => {
    const found = INITIAL_DEPARTMENT_LIST.find((item) => item.deptName === deptName);
    if (found) {
      if (!editingItem && !form.getFieldValue('primaryEndpoint')) {
        form.setFieldsValue({
          primaryEndpoint: found.defaultEndpoint,
        });
      }
    }
  };

  // 保存路径（总队端）
  const handleSaveDrawer = async () => {
    try {
      const values = await form.validateFields();
      const matchedDept = INITIAL_DEPARTMENT_LIST.find((item) => item.deptName === values.deptName);
      const resolvedDeptCode = matchedDept?.deptCode || `DEPT_${Date.now().toString().slice(-4)}`;

      if (editingItem) {
        setRoutes((prev) =>
          prev.map((r) =>
            r.key === editingItem.key
              ? {
                  ...r,
                  deptName: values.deptName,
                  deptCode: resolvedDeptCode,
                  primaryEndpoint: values.primaryEndpoint,
                }
              : r
          )
        );
        message.success(`【${values.deptName}】流转地址已保存生效`);
      } else {
        setRoutes((prev) => [
          ...prev,
          {
            key: `dept-${Date.now()}`,
            deptName: values.deptName,
            deptCode: resolvedDeptCode,
            primaryEndpoint: values.primaryEndpoint,
            status: 'connected',
            latencyMs: 18,
          },
        ]);
        message.success(`【${values.deptName}】流转地址已添加`);
      }
      setDrawerOpen(false);
    } catch {
      // Form validate failed
    }
  };

  // 地市端保存
  const handleSaveCityConfig = () => {
    message.success('上报目标地址与重试配置已保存成功！');
  };

  // 地市端快速连通性检测
  const handleRunCityFastCheck = () => {
    setCityTesting(true);
    setTimeout(() => {
      setCityTesting(false);
      const isSuccess = Boolean(cityTargetPrimaryUrl.trim());
      setCityTestResult({
        success: isSuccess,
        message: isSuccess
          ? '专网目标地址响应正常，双向通信通畅'
          : '目标地址为空或网络专线未接入，请检查配置',
        latencyMs: isSuccess ? 15 : undefined,
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      });
      if (isSuccess) {
        message.success('连通性快速检测通过！响应时延 15ms');
      } else {
        message.error('连通性检测未通过，请检查目标地址或专网线路！');
      }
    }, 600);
  };

  // 过滤后的总队列表
  const filteredRoutes = routes.filter(
    (r) =>
      r.deptName.includes(searchText) ||
      r.deptCode.toLowerCase().includes(searchText.toLowerCase()) ||
      r.primaryEndpoint.toLowerCase().includes(searchText.toLowerCase())
  );

  // 表格列定义（简洁无多余字段）
  const columns: ColumnsType<DataFlowRouteItem> = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: '接收单位 (部门字段)',
      key: 'deptName',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ApartmentOutlined style={{ color: '#2563eb' }} />
            <span>{record.deptName}</span>
          </div>
          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
            {record.deptCode}
          </span>
        </div>
      ),
    },
    {
      title: '指令下达接收地址',
      key: 'primaryEndpoint',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#334155', fontFamily: 'monospace' }}>
            {record.primaryEndpoint}
          </span>
          <Tooltip title="复制地址">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard?.writeText(record.primaryEndpoint);
                message.success('已复制');
              }}
              style={{ color: '#94a3b8' }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: '连通状态',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Badge status={record.status === 'connected' ? 'success' : 'error'} />
          <span style={{ fontSize: 12, fontWeight: 500, color: record.status === 'connected' ? '#16a34a' : '#ef4444' }}>
            {record.status === 'connected' ? '连通正常' : '连通异常'}
          </span>
          <Tag color="green" style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>
            {record.latencyMs}ms
          </Tag>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<ReloadOutlined spin={testingRowKey === record.key} />}
            loading={testingRowKey === record.key}
            onClick={() => handleTestSingleRoute(record)}
          >
            测通
          </Button>
          <Button
            size="small"
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenDrawer(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="data-flow-config-container">
      {/* 流程顶栏：规范名称与轻量公司定位开关 */}
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          marginBottom: 16,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
        bodyStyle={{ padding: '14px 20px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ApiOutlined style={{ fontSize: 20, color: '#2563eb' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  内网-工具箱-数据流转配置
                </h3>
                <Tag color="default" style={{ fontSize: 11, margin: 0, color: '#64748b' }}>
                  权限点: toolbox:transmission
                </Tag>
              </div>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                保障跨地域内网指令与反馈传输畅通，提供故障快速排查与地址调优入口
              </span>
            </div>
          </div>

          {/* 核心开关：公司定位选择（总队单位 vs 地市单位） */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f8fafc',
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>当前公司定位：</span>
            <Radio.Group
              value={companyType}
              onChange={(e) => {
                setCompanyType(e.target.value);
                message.info(
                  e.target.value === 'provincial'
                    ? '已切换为【总队单位】视角（管理全省地市流转地址）'
                    : '已切换为【地市单位】视角（配置上报总队目标地址与快速检测）'
                );
              }}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="provincial">总队单位</Radio.Button>
              <Radio.Button value="city">地市单位</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 场景 1：总队单位（仅保留地市流转列表与流转路径管理，去除多余数据标签）       */}
      {/* ========================================================================= */}
      {companyType === 'provincial' && (
        <Card
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          bodyStyle={{ padding: '16px 20px' }}
        >
          {/* 顶部检索与新增操作 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <Input
              placeholder="搜索地市部门名称 / 接口地址"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenDrawer()}
              style={{ background: '#2563eb' }}
            >
              新增地市流转路径
            </Button>
          </div>

          {/* 地市流转列表 */}
          <Table
            columns={columns}
            dataSource={filteredRoutes}
            pagination={{
              pageSize: 6,
              showTotal: (total) => `共 ${total} 条地市流转路径`,
              size: 'small',
            }}
            rowKey="key"
            size="middle"
          />
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 场景 2：地市单位（仅保留上报单位目标地址、重试范围与快速检测）             */}
      {/* ========================================================================= */}
      {companyType === 'city' && (
        <Card
          bordered={false}
          style={{ borderRadius: 8, maxWidth: 860, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Form layout="vertical">
            {/* 1. 上报单位目标地址 */}
            <Form.Item
              label={
                <span style={{ fontWeight: 600, color: '#1e293b' }}>
                  <span style={{ color: '#ef4444' }}>* </span>
                  上报单位目标地址 (总队接收地址)
                </span>
              }
              extra="指令签收回执、核查反馈材料及结案数据包推送到上级总队的专网服务接口地址（单地址直连，大多数情况下不提供备用地址）"
              required
            >
              <Input
                placeholder="请输入上级总队指令接收地址"
                value={cityTargetPrimaryUrl}
                onChange={(e) => setCityTargetPrimaryUrl(e.target.value)}
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Item>

            {/* 2. 重试范围 (默认超时阈值5000ms，重试次数3次，允许动态配置) */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#1e293b' }}>超时阈值 (ms)</span>}
                style={{ width: 220 }}
              >
                <InputNumber
                  min={1000}
                  max={30000}
                  step={500}
                  value={cityTimeoutMs}
                  onChange={(v) => setCityTimeoutMs(v || 5000)}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: '#1e293b' }}>重试次数 (次)</span>}
                style={{ width: 220 }}
              >
                <InputNumber
                  min={1}
                  max={10}
                  value={cityRetries}
                  onChange={(v) => setCityRetries(v || 3)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            {/* 3. 操作与快速连通性检测结果 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, marginBottom: 16 }}>
              <Button type="primary" onClick={handleSaveCityConfig} style={{ background: '#2563eb' }}>
                保存配置
              </Button>
              <Button
                icon={<ThunderboltOutlined />}
                loading={cityTesting}
                onClick={handleRunCityFastCheck}
              >
                快速检测连通性
              </Button>
            </div>

            {/* 快速检测结果展示区 */}
            {cityTestResult && (
              <Alert
                type={cityTestResult.success ? 'success' : 'error'}
                showIcon
                icon={cityTestResult.success ? <CheckCircleFilled /> : <CloseCircleFilled />}
                message={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      <strong>连通性结果：</strong>
                      {cityTestResult.message}
                    </span>
                    {cityTestResult.latencyMs && (
                      <Tag color="green" style={{ margin: 0 }}>
                        时延: {cityTestResult.latencyMs}ms
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    检测时间：{cityTestResult.time || '刚刚'} ｜ 超时范围：{cityTimeoutMs}ms ｜ 重试次数：{cityRetries}次
                  </span>
                }
                style={{ marginTop: 8 }}
              />
            )}
          </Form>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 抽屉：总队端新增/编辑地市流转路径                                         */}
      {/* ========================================================================= */}
      <Drawer
        title={editingItem ? `编辑【${editingItem.deptName}】流转路径` : '新增地市流转路径'}
        width={480}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveDrawer} style={{ background: '#2563eb' }}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="deptName"
            label="部门选择"
            rules={[{ required: true, message: '请选择部门' }]}
            extra="系统部署时已初始化全省地市部门列表，用于总队下达指令时按部门自动寻址"
          >
            <Select
              placeholder="请选择地市部门（系统初始化列表）"
              showSearch
              optionFilterProp="label"
              onChange={handleDeptNameChange}
              options={INITIAL_DEPARTMENT_LIST.map((item) => ({
                label: item.deptName,
                value: item.deptName,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="primaryEndpoint"
            label="指令接收地址"
            rules={[{ required: true, message: '请输入指令接收地址' }]}
            extra="地市专网前置指令接收接口地址（单地址部署，无需配置备用地址）"
          >
            <Input placeholder="https://ga.xuzhou.internal:8443/api/v1/directive/receive" />
          </Form.Item>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button
              icon={<ThunderboltOutlined />}
              onClick={() => {
                message.loading({ content: '正在检测地址连通性...', key: 'precheck' });
                setTimeout(() => {
                  message.success({ content: '检测通过！目标专网地址响应正常 (16ms)', key: 'precheck' });
                }, 500);
              }}
            >
              连通性预检
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default DataFlowConfig;
