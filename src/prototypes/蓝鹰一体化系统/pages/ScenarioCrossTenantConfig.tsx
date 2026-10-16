import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Card,
  Row,
  Col,
  Tag,
  Badge,
  Modal,
  Drawer,
  Alert,
  Space,
  Input,
  Select,
  Checkbox,
  Tree,
  Table,
  Tooltip,
  Divider,
  Switch,
  InputNumber,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import {
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckCircleFilled,
  BranchesOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SwapOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  KeyOutlined,
  LinkOutlined,
  ClusterOutlined,
  SlidersOutlined,
  ToolOutlined,
  AppstoreOutlined,
  BellOutlined,
  RollbackOutlined,
  SkinOutlined,
  SecurityScanOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import DataFlowConfig from '../components/DataFlowConfig';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

// 客户列表数据接口
interface CustomerRecord {
  key: string;
  id: string;
  name: string;
  displayName: string;
  customerType: string;
  org: string;
  superiorCustomer: string;
  isCityDirect: boolean;
  relatedDept?: string;
  channelStatus: string;
}

// 岗位记录数据接口
interface PostRecord {
  key: string;
  name: string;
  availableDepts: string[];
  description: string;
  hasCrossTenant: boolean;
  hasSubUnitDispatch: boolean;
  orgRole: string;
}

const ScenarioCrossTenantConfig: React.FC = () => {
  const { setCurrentStep, setActionButton, currentRoleView } = useScenarioContext();

  // 当前主视图步骤：'admin' (管理后台·客户关联配置) | 'platform-config' (一体化·工作平台配置·上报审批) | 'transmission-config' (一体化·数据流转配置) | 'city-post' (一体化·市局岗位配置) | 'county-post' (一体化·区县岗位配置)
  const [activeStepTab, setActiveStepTab] = useState<'admin' | 'platform-config' | 'transmission-config' | 'city-post' | 'county-post'>('admin');

  // =========================================================================
  // 1. 管理后台状态与数据 (1:1 复刻截图 1 & 2)
  // =========================================================================
  const [customerModalOpen, setCustomerModalOpen] = useState<boolean>(false);
  const [editingCustomerKey, setEditingCustomerKey] = useState<string>('xuzhou');
  const [topologyDrawerOpen, setTopologyDrawerOpen] = useState<boolean>(false);

  // 编辑客户弹窗表单状态
  const [formCustName, setFormCustName] = useState<string>('徐州市公安局');
  const [formDisplayName, setFormDisplayName] = useState<string>('徐州市局');
  const [formOrg, setFormOrg] = useState<string>('江苏省厅网安');
  const [formSuperiorCust, setFormSuperiorCust] = useState<string>('JSga');
  const [formIsCityDirect, setFormIsCityDirect] = useState<boolean>(false);
  // 核心新增字段：关联部门
  const [formRelatedDept, setFormRelatedDept] = useState<string>('徐州市');

  // =========================================================================
  // 2. 一体化工作平台个性化配置状态 (1:1 复刻截图 4)
  // =========================================================================
  // 核心新增配置项：上报总队审批
  const [reportToProvincialAudit, setReportToProvincialAudit] = useState<boolean>(true);
  const [auditApprovers, setAuditApprovers] = useState<string[]>(['支队-宋洪霖', '支队-张三']);
  const [emergencyListSortOrder, setEmergencyListSortOrder] = useState<string>('指令处理时间降序');
  const [sourceHideTags, setSourceHideTags] = useState<boolean>(false);
  const [monitorHideReporter, setMonitorHideReporter] = useState<boolean>(false);
  const [monitorShowDirectiveBtn, setMonitorShowDirectiveBtn] = useState<boolean>(false);
  const [countyReportSortOrder, setCountyReportSortOrder] = useState<string>('上报时间-降序');

  // 客户列表数据
  const [customerData, setCustomerData] = useState<CustomerRecord[]>([
    {
      key: 'jsga',
      id: 'JS001',
      name: '江苏省公安厅舆情系统',
      displayName: 'JSga',
      customerType: '政务',
      org: '江苏省厅网安',
      superiorCustomer: '-',
      isCityDirect: true,
      relatedDept: '-',
      channelStatus: '省厅汇聚中心',
    },
    {
      key: 'xuzhou',
      id: 'XZ002',
      name: '徐州市局',
      displayName: '徐州市局',
      customerType: '政务',
      org: '江苏省厅网安',
      superiorCustomer: 'JSga',
      isCityDirect: false,
      relatedDept: '徐州市',
      channelStatus: '双向路由已连通',
    },
    {
      key: 'huaian',
      id: 'HA003',
      name: '淮安市局',
      displayName: '淮安市局',
      customerType: '政务',
      org: '江苏省厅网安',
      superiorCustomer: 'JSga',
      isCityDirect: false,
      relatedDept: '淮安市',
      channelStatus: '双向路由已连通',
    },
  ]);

  // 省厅部门字典（当选择上级客户为 JSga 时动态获取）
  const provincialDeptDict = [
    '南京市',
    '无锡市',
    '徐州市',
    '常州市',
    '苏州支队',
    '南通市',
    '连云港市',
    '淮安市',
    '盐城市',
    '扬州市',
    '镇江市',
    '泰州市',
    '宿迁市',
  ];

  // =========================================================================
  // 2. 一体化平台岗位管理状态与数据 (1:1 复刻截图 3)
  // =========================================================================
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [editingPostKey, setEditingPostKey] = useState<string>('city-duty');

  // 修改岗位表单状态
  const [formPostName, setFormPostName] = useState<string>('支队值班岗');
  const [formPostDepts, setFormPostDepts] = useState<string[]>(['徐州市公安局网安支队']);
  const [formPostDesc, setFormPostDesc] = useState<string>(
    '市局支队值班长认领岗位，负责接收省厅下达跨租户指令并进行自办或转派'
  );

  // 岗位权限树勾选项 (核心新增两项权限)
  const [checkedPermKeys, setCheckedPermKeys] = useState<React.Key[]>([
    'platform',
    'source-ctrl',
    'roster-mgt',
    'emergency',
    'ga-access',
    'perm-cross-tenant', // 核心新增 1：跨租户指令接收权限
    'monitor',
    'bulletin-mgt',
  ]);

  // 市局岗位数据
  const [cityPostList, setCityPostList] = useState<PostRecord[]>([
    {
      key: 'city-duty',
      name: '支队值班岗',
      availableDepts: ['徐州市公安局网安支队'],
      description: '市局支队值班长认领岗位，负责接收省厅下达跨租户指令并进行自办或转派',
      hasCrossTenant: true,
      hasSubUnitDispatch: false,
      orgRole: '市局中枢',
    },
    {
      key: 'city-info',
      name: '信息编报岗',
      availableDepts: ['徐州市公安局网安支队'],
      description: '负责综合舆情信息梳理与市域专报编发',
      hasCrossTenant: false,
      hasSubUnitDispatch: false,
      orgRole: '日常业务',
    },
  ]);

  // 区县岗位数据
  const [countyPostList, setCountyPostList] = useState<PostRecord[]>([
    {
      key: 'county-duty',
      name: '区县值班岗',
      availableDepts: ['徐州市公安局贾汪分局网安大队'],
      description: '区县基层民警认领岗位，负责接收市局转派指令并落地核查直报省厅',
      hasCrossTenant: false,
      hasSubUnitDispatch: true,
      orgRole: '基层执行',
    },
    {
      key: 'county-investigation',
      name: '落地核查岗',
      availableDepts: ['徐州市公安局贾汪分局网安大队'],
      description: '负责属地重点人员走访、谈话笔录与稳控材料回传',
      hasCrossTenant: false,
      hasSubUnitDispatch: false,
      orgRole: '一线民警',
    },
  ]);

  // 监听顶栏切换与联动
  useEffect(() => {
    if (currentRoleView) {
      if (currentRoleView === 'admin') {
        setActiveStepTab('admin');
      } else if (currentRoleView === 'platform-config') {
        setActiveStepTab('platform-config');
      } else if (currentRoleView === 'city-post') {
        setActiveStepTab('city-post');
      } else if (currentRoleView === 'county-post') {
        setActiveStepTab('county-post');
      }
    }
  }, [currentRoleView]);

  // 同步主步骤
  const handleSwitchTab = (tab: 'admin' | 'platform-config' | 'transmission-config' | 'city-post' | 'county-post') => {
    setActiveStepTab(tab);
    if (tab === 'admin') setCurrentStep(1);
    if (tab === 'platform-config') setCurrentStep(2);
    if (tab === 'transmission-config') setCurrentStep(2);
    if (tab === 'city-post') setCurrentStep(3);
    if (tab === 'county-post') setCurrentStep(4);
  };

  // 触发保存客户
  const handleSaveCustomer = () => {
    setCustomerData((prev) =>
      prev.map((item) => {
        if (item.key === editingCustomerKey) {
          return {
            ...item,
            name: formCustName,
            displayName: formDisplayName,
            org: formOrg,
            superiorCustomer: formSuperiorCust,
            isCityDirect: formIsCityDirect,
            relatedDept: formIsCityDirect ? '-' : formRelatedDept,
            channelStatus: formIsCityDirect
              ? '省厅汇聚中心'
              : formSuperiorCust && formRelatedDept
              ? '双向路由已连通'
              : '未连通',
          };
        }
        return item;
      })
    );
    setCustomerModalOpen(false);
    message.success('保存成功！');
  };

  // 触发保存岗位
  const handleSavePost = () => {
    const hasCross = checkedPermKeys.includes('perm-cross-tenant');
    const hasSub = checkedPermKeys.includes('perm-sub-dispatch');

    if (activeStepTab === 'city-post') {
      setCityPostList((prev) =>
        prev.map((item) =>
          item.key === editingPostKey
            ? {
                ...item,
                name: formPostName,
                availableDepts: formPostDepts,
                description: formPostDesc,
                hasCrossTenant: hasCross,
                hasSubUnitDispatch: hasSub,
              }
            : item
        )
      );
    } else {
      setCountyPostList((prev) =>
        prev.map((item) =>
          item.key === editingPostKey
            ? {
                ...item,
                name: formPostName,
                availableDepts: formPostDepts,
                description: formPostDesc,
                hasCrossTenant: hasCross,
                hasSubUnitDispatch: hasSub,
              }
            : item
        )
      );
    }

    setPostModalOpen(false);
    message.success('更新成功！');
  };

  // 打开编辑岗位
  const handleOpenEditPost = (record: PostRecord) => {
    setEditingPostKey(record.key);
    setFormPostName(record.name);
    setFormPostDepts(record.availableDepts);
    setFormPostDesc(record.description);

    const keys: React.Key[] = ['platform', 'emergency'];
    if (record.hasCrossTenant) keys.push('perm-cross-tenant');
    if (record.hasSubUnitDispatch) keys.push('perm-sub-dispatch');
    setCheckedPermKeys(keys);

    setPostModalOpen(true);
  };

  // 权限树结构定义（1:1 复刻截图 3，挂载新增两项权限点）
  const permissionTreeData: DataNode[] = [
    {
      title: '风险发现',
      key: 'risk-discovery',
      disabled: false,
    },
    {
      title: '政务一体化平台',
      key: 'platform',
      children: [
        {
          title: '源头防控',
          key: 'source-ctrl',
          children: [
            {
              title: '排班管理',
              key: 'roster-mgt',
              children: [{ title: '全部排班可见', key: 'roster-all-visible' }],
            },
          ],
        },
        {
          title: '复盘总结',
          key: 'review-summary',
          children: [
            { title: 'GA网访问', key: 'ga-review-access' },
            {
              title: '归档功能',
              key: 'archive-func',
              children: [{ title: '编辑归档', key: 'edit-archive' }],
            },
          ],
        },
        {
          title: (
            <span style={{ fontWeight: 600, color: '#1e40af' }}>
              应急处置板块 (核心指令流转)
            </span>
          ),
          key: 'emergency',
          children: [
            { title: '所有信息可见', key: 'emergency-all-visible' },
            { title: 'GA网访问', key: 'ga-access' },
            {
              // 核心新增权限 1 (Pin 2 挂载)
              title: (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#0958d9', fontWeight: 600 }}>
                    ★ 跨租户指令接收权限 (接收省厅下达)
                  </span>
                  <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
                    市局值班岗必备
                  </Tag>
                </div>
              ),
              key: 'perm-cross-tenant',
            },
            {
              // 核心新增权限 2 (Pin 3 挂载)
              title: (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#15803d', fontWeight: 600 }}>
                    ★ 下级单位指令接收 (同租户转派接收)
                  </span>
                  <Tag color="green" style={{ fontSize: 10, margin: 0 }}>
                    区县值班岗必备
                  </Tag>
                </div>
              ),
              key: 'perm-sub-dispatch',
            },
          ],
        },
        {
          title: '监测预警',
          key: 'monitor',
          children: [
            {
              title: '通报管理',
              key: 'bulletin-mgt',
              children: [{ title: '所有通报可见', key: 'bulletin-all-visible' }],
            },
            { title: '执行单位重点账号跟踪', key: 'account-track' },
          ],
        },
      ],
    },
  ];

  // =========================================================================
  // 视图 1：SaaS 管理后台 · 客户管理与关联部门配置 (1:1 复刻截图 1 & 2)
  // =========================================================================
  const renderAdminView = () => {
    const columns: ColumnsType<CustomerRecord> = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (_val, _record, idx) => idx + 1,
      },
      {
        title: '客户ID',
        dataIndex: 'id',
        key: 'id',
        width: 90,
      },
      {
        title: '客户名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Space>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
            {record.isCityDirect && <Tag color="gold">市直中心</Tag>}
          </Space>
        ),
      },
      {
        title: '系统显示名',
        dataIndex: 'displayName',
        key: 'displayName',
        width: 120,
      },
      {
        title: '所属组织机构',
        dataIndex: 'org',
        key: 'org',
        render: (text) => <Tag color="blue">{text}</Tag>,
      },
      {
        title: '上级客户',
        dataIndex: 'superiorCustomer',
        key: 'superiorCustomer',
        render: (text) => (text === '-' ? <span style={{ color: '#94a3b8' }}>-</span> : <strong>{text}</strong>),
      },
      {
        title: '关联省厅部门 (核心新增)',
        dataIndex: 'relatedDept',
        key: 'relatedDept',
        render: (text, record) =>
          record.isCityDirect ? (
            <span style={{ color: '#94a3b8' }}>-</span>
          ) : (
            <Tag color="cyan" style={{ fontSize: 12, padding: '2px 8px' }}>
              <ApartmentOutlined /> {text || '未关联'}
            </Tag>
          ),
      },
      {
        title: '双向通道状态',
        dataIndex: 'channelStatus',
        key: 'channelStatus',
        render: (text, record) => (
          <Badge
            status={record.isCityDirect ? 'processing' : 'success'}
            text={<span style={{ fontSize: 12, fontWeight: 500 }}>{text}</span>}
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 160,
        render: (_val, record) => (
          <Space size={8}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingCustomerKey(record.key);
                setFormCustName(record.name);
                setFormDisplayName(record.displayName);
                setFormOrg(record.org);
                setFormSuperiorCust(record.superiorCustomer === '-' ? '' : record.superiorCustomer);
                setFormIsCityDirect(record.isCityDirect);
                setFormRelatedDept(record.relatedDept === '-' ? '徐州市' : record.relatedDept || '徐州市');
                setCustomerModalOpen(true);
              }}
            >
              编辑配置
            </Button>
            {!record.isCityDirect && (
              <Button
                type="link"
                size="small"
                onClick={() => setTopologyDrawerOpen(true)}
              >
                拓扑查验
              </Button>
            )}
          </Space>
        ),
      },
    ];

    return (
      <div className="admin-console-wrapper">
        {/* 后台运营管理系统模拟顶栏 (1:1 复刻截图 1) */}
        <div className="admin-top-nav-bar">
          <div className="admin-nav-left">
            <div className="admin-logo-pill">
              <ClusterOutlined style={{ fontSize: 16, color: '#38bdf8' }} />
              <span className="admin-logo-text">后台运营管理系统</span>
            </div>
            <div className="admin-breadcrumb-line">
              <span>全局管理</span>
              <span>/</span>
              <span className="active">客户列表</span>
            </div>
          </div>
          <div className="admin-nav-right">
            <span>朱彦博</span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ cursor: 'pointer', color: '#94a3b8' }}>退出登录</span>
          </div>
        </div>

        {/* 客户列表工具条与筛选区 */}
        <div className="admin-content-card">
          <div className="admin-filter-bar">
            <div className="admin-filter-inputs">
              <Select
                placeholder="请选择所属组织机构"
                defaultValue="江苏省厅网安"
                style={{ width: 190 }}
              >
                <Option value="江苏省厅网安">江苏省厅网安</Option>
                <Option value="浙江省厅网安">浙江省厅网安</Option>
              </Select>

              <Select
                placeholder="请选择上级客户"
                defaultValue="JSga"
                style={{ width: 180 }}
              >
                <Option value="JSga">JSga (省公安厅)</Option>
              </Select>

              <Input
                placeholder="请输入客户名搜索"
                defaultValue="徐州市局"
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                style={{ width: 180 }}
              />

              <Select placeholder="请选择账户状态" defaultValue="normal" style={{ width: 140 }}>
                <Option value="normal">正常使用</Option>
                <Option value="disabled">已锁定</Option>
              </Select>
            </div>

            <Space>
              <Button type="primary" icon={<PlusOutlined />} style={{ background: '#1677ff' }}>
                新增客户
              </Button>
            </Space>
          </div>

          {/* 客户列表表格 */}
          <Table
            columns={columns}
            dataSource={customerData}
            pagination={false}
            rowKey="key"
            size="middle"
            style={{ marginTop: 12 }}
          />

          {/* 底部业务说明卡片 */}
          <div
            style={{
              marginTop: 16,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <InfoCircleOutlined style={{ color: '#2563eb', fontSize: 16 }} />
              <div style={{ fontSize: 12, color: '#334155' }}>
                <strong>跨租户关联机制：</strong>
                独立采购客户通过选择相同【所属组织机构】与【上级客户】，并配置【关联部门】，即可实现跨租户指令精准寻址。
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              onClick={() => handleSwitchTab('platform-config')}
              style={{ background: '#2563eb' }}
            >
              下一步：前往一体化平台定制配置 (审批开关) ➔
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 视图 2：一体化平台 · 工具箱平台定制配置 (保留定制化配置，审批归属源头防控)
  // =========================================================================
  const renderPlatformCustomConfigView = () => {
    return (
      <div className="custom-config-wrapper">
        {/* 子导航标签栏：仅保留【一体化工作平台配置】 */}
        <div className="custom-config-tabs-bar">
          <div className="custom-tabs-list">
            <span className="custom-tab-item active">
              <SlidersOutlined style={{ marginRight: 6 }} /> 一体化工作平台配置
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            <span>当前配置租户：<strong>徐州市公安局 (独立采购)</strong></span>
          </div>
        </div>

        {/* 主配置卡片：聚焦定制化配置 */}
        <div className="custom-config-content-card">
          <div className="customized-section-container">
            <div className="customized-section-title">
              <span className="blue-bar-indicator"></span>
              <strong>定制化配置</strong>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 'normal', marginLeft: 8 }}>
                （针对源头防控手工上报审批、处置排序及预警展示等租户个性化策略进行配置）
              </span>
            </div>

            {/* 1. 源头防控 (用户核心关注：手工上报审批归属于此) */}
            <div className="customized-sub-block highlight-emergency-block">
              <div className="sub-block-title">
                <span>源头防控</span>
                <Tag color="cyan" style={{ fontSize: 11, marginLeft: 6 }}>手工上报管控</Tag>
              </div>

              <div className="sub-block-row" style={{ marginBottom: 14 }}>
                <span className="config-item-label">排班统计列表隐藏统计标签</span>
                <Switch checked={sourceHideTags} onChange={setSourceHideTags} />
              </div>

              {/* ✨ 核心配置项：上报总队审批 (归属源头防控 · 挂载 Pin 2) */}
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 14 }}>
                <Annotated
                  pin={2}
                  title="一体化平台 · 上报总队审批与审批人指派"
                  note="在工具箱·一体化工作平台配置的【源头防控】中，新增【上报总队审批】复选框与【审批人】多选配置，针对手工上报进行前置审批控制。未开启则为免审直通（场景1），开启并指定支队审批人后，基层手工上报需市局支队审批通过后才推送总队（场景2）。"
                  tag="审批开关"
                  placement="top-left"
                >
                  <div className="new-custom-approval-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <Checkbox
                        checked={reportToProvincialAudit}
                        onChange={(e) => setReportToProvincialAudit(e.target.checked)}
                        style={{ fontWeight: 600, color: '#1e293b' }}
                      >
                        上报总队审批
                      </Checkbox>

                      {reportToProvincialAudit && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, color: '#475569' }}>
                            <span style={{ color: '#ef4444' }}>* </span>审批人:
                          </span>
                          <Select
                            mode="multiple"
                            placeholder="请选择支队审批人（支持多选）"
                            value={auditApprovers}
                            onChange={setAuditApprovers}
                            style={{ minWidth: 260 }}
                            maxTagCount={3}
                          >
                            <Option value="支队-宋洪霖">支队-宋洪霖 (值班长)</Option>
                            <Option value="支队-张三">支队-张三 (指令接收岗)</Option>
                            <Option value="支队-李警官">支队-李警官 (综合研判)</Option>
                            <Option value="支队-王队长">支队-王队长 (大队长)</Option>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* 规则说明条 */}
                    <div className="approval-rule-alert">
                      <InfoCircleOutlined style={{ color: reportToProvincialAudit ? '#2563eb' : '#64748b', marginTop: 2 }} />
                      <div style={{ fontSize: 12, color: reportToProvincialAudit ? '#1e3a8a' : '#475569', lineHeight: 1.5 }}>
                        {reportToProvincialAudit ? (
                          <>
                            <strong>【已启用支队前置审批 · 场景 2 拦截模式】</strong>：区县基层单位在【源头防控 - 手工上报】勾选【上报总队】时，系统将拦截上报流并自动推入已选审批人（{auditApprovers.join('、')}）的待办审批池，经市局支队审核通过后方可报送省厅总队。
                          </>
                        ) : (
                          <>
                            <strong>【未开启支队前置审批 · 场景 1 免审直通模式】</strong>：区县基层单位在【源头防控 - 手工上报】勾选【上报总队】时，数据直接单向安全摆渡直通省厅总队入库，无需市局支队审批。
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Annotated>
              </div>
            </div>

            {/* 2. 应急处置 (仅保留默认排序) */}
            <div className="customized-sub-block">
              <div className="sub-block-title">应急处置</div>
              <div className="sub-block-row">
                <span className="config-item-label">列表默认排序</span>
                <Select
                  value={emergencyListSortOrder}
                  onChange={setEmergencyListSortOrder}
                  style={{ width: 170 }}
                >
                  <Option value="指令处理时间降序">指令处理时间降序</Option>
                  <Option value="指令创建时间降序">指令创建时间降序</Option>
                  <Option value="紧急程度降序">紧急程度降序</Option>
                </Select>
              </div>
            </div>

            {/* 3. 监测预警 */}
            <div className="customized-sub-block">
              <div className="sub-block-title">监测预警</div>
              <div className="sub-block-row" style={{ flexWrap: 'wrap', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="config-item-label">不显示报送人</span>
                  <Switch checked={monitorHideReporter} onChange={setMonitorHideReporter} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="config-item-label">列表显示下达指令按钮</span>
                  <Switch checked={monitorShowDirectiveBtn} onChange={setMonitorShowDirectiveBtn} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="config-item-label">区县上报排序默认设置</span>
                  <Select
                    value={countyReportSortOrder}
                    onChange={setCountyReportSortOrder}
                    style={{ width: 160 }}
                  >
                    <Option value="上报时间-降序">上报时间-降序</Option>
                    <Option value="上报时间-升序">上报时间-升序</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 底部操作工具栏 */}
          <div className="custom-config-bottom-bar">
            <Button size="small" onClick={() => handleSwitchTab('admin')}>
              ← 返回管理后台配置
            </Button>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  if (reportToProvincialAudit && auditApprovers.length === 0) {
                    message.error('请至少选择一位支队审批人！');
                    return;
                  }
                  message.success('保存成功！');
                }}
                style={{ background: '#1677ff' }}
              >
                保存配置
              </Button>
              <Button
                type="primary"
                ghost
                onClick={() => handleSwitchTab('transmission-config')}
              >
                下一步：前往内网-工具箱-数据流转配置 (寻址与测通) ➔
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 视图 3：一体化平台 · 市局岗位管理 (1:1 复刻截图 3)
  // =========================================================================
  const renderCityPostView = () => {
    const postColumns: ColumnsType<PostRecord> = [
      {
        title: '岗位名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <strong>{text}</strong>,
      },
      {
        title: '岗位可用部门 (申领范围)',
        dataIndex: 'availableDepts',
        key: 'availableDepts',
        render: (depts: string[]) => (
          <Space wrap size={4}>
            {depts.map((d) => (
              <Tag color="geekblue" key={d}>
                {d}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '岗位职责说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: '指令接收权限标记',
        key: 'perm',
        render: (_val, record) => (
          <Space>
            {record.hasCrossTenant ? (
              <Tag color="blue">
                <CheckCircleFilled /> 跨租户指令接收 (省厅)
              </Tag>
            ) : (
              <Tag color="default">常规指令</Tag>
            )}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 130,
        render: (_val, record) => (
          <Space size={8}>
            <Button
              type="link"
              size="small"
              onClick={() => handleOpenEditPost(record)}
            >
              编辑
            </Button>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div className="eagle-platform-post-wrapper">
        {/* 一体化平台仿真顶栏 (1:1 复刻截图 3) */}
        <div className="eagle-subnav-bar">
          <div className="eagle-subnav-left">
            <div className="eagle-logo-title">
              <CloudOutlined style={{ color: '#38bdf8', fontSize: 18 }} />
              <span>舆情一体化智控平台</span>
            </div>
            <div className="eagle-module-tabs">
              <span className="eagle-module-tab">警舆同处</span>
              <span className="eagle-module-tab">专题研判</span>
              <span className="eagle-module-tab active">
                <SettingOutlined /> 系统设置 · 岗位管理
              </span>
            </div>
          </div>
          <div className="eagle-subnav-right">
            <span>欢迎 <strong>徐州市局-张三</strong>！</span>
            <span style={{ color: '#475569' }}>|</span>
            <Tag color="blue">当前系统：徐州市公安局网安支队</Tag>
          </div>
        </div>

        {/* 岗位管理列表卡片 */}
        <div className="eagle-content-card">
          <div className="eagle-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>岗位名称</span>
              <Input placeholder="请输入岗位名称" defaultValue="值班岗" style={{ width: 220 }} />
              <Button type="primary" icon={<SearchOutlined />} style={{ background: '#1677ff' }}>
                查询
              </Button>
            </div>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#1677ff' }}>
              新建岗位
            </Button>
          </div>

          <Table
            columns={postColumns}
            dataSource={cityPostList}
            pagination={false}
            rowKey="key"
            size="middle"
            style={{ marginTop: 14 }}
          />

          <div
            style={{
              marginTop: 16,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 6,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 12, color: '#1e40af' }}>
              <strong>市局岗位流转提示：</strong>
              当为【支队值班岗】赋予【跨租户指令接收权限】后，省厅下达到徐州市的指令将自动流转至该岗位的账号（张三）待办池中。
            </div>
            <Space>
              <Button size="small" onClick={() => handleSwitchTab('platform-config')}>
                ← 返回平台定制配置
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => handleSwitchTab('county-post')}
                style={{ background: '#2563eb' }}
              >
                下一步：配置区县端岗位权限 ➔
              </Button>
            </Space>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 视图 3：一体化平台 · 区县岗位管理 (1:1 复刻截图 3)
  // =========================================================================
  const renderCountyPostView = () => {
    const postColumns: ColumnsType<PostRecord> = [
      {
        title: '岗位名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <strong>{text}</strong>,
      },
      {
        title: '岗位可用部门 (申领范围)',
        dataIndex: 'availableDepts',
        key: 'availableDepts',
        render: (depts: string[]) => (
          <Space wrap size={4}>
            {depts.map((d) => (
              <Tag color="orange" key={d}>
                {d}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '岗位职责说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: '指令接收权限标记',
        key: 'perm',
        render: (_val, record) => (
          <Space>
            {record.hasSubUnitDispatch ? (
              <Tag color="green">
                <CheckCircleFilled /> 下级单位指令接收 (市局转派)
              </Tag>
            ) : (
              <Tag color="default">常规岗位</Tag>
            )}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 130,
        render: (_val, record) => (
          <Space size={8}>
            <Button
              type="link"
              size="small"
              onClick={() => handleOpenEditPost(record)}
            >
              编辑
            </Button>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div className="eagle-platform-post-wrapper">
        {/* 一体化平台仿真顶栏 (区县端) */}
        <div className="eagle-subnav-bar">
          <div className="eagle-subnav-left">
            <div className="eagle-logo-title">
              <CloudOutlined style={{ color: '#f97316', fontSize: 18 }} />
              <span>舆情一体化智控平台 (基层端)</span>
            </div>
            <div className="eagle-module-tabs">
              <span className="eagle-module-tab">警舆同处</span>
              <span className="eagle-module-tab active">
                <SettingOutlined /> 系统设置 · 岗位管理
              </span>
            </div>
          </div>
          <div className="eagle-subnav-right">
            <span>欢迎 <strong>贾汪分局-李四</strong>！</span>
            <span style={{ color: '#475569' }}>|</span>
            <Tag color="orange">当前系统：贾汪分局网安大队</Tag>
          </div>
        </div>

        {/* 岗位管理列表卡片 */}
        <div className="eagle-content-card">
          <div className="eagle-filter-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>岗位名称</span>
              <Input placeholder="请输入岗位名称" defaultValue="区县值班岗" style={{ width: 220 }} />
              <Button type="primary" icon={<SearchOutlined />} style={{ background: '#1677ff' }}>
                查询
              </Button>
            </div>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#1677ff' }}>
              新建岗位
            </Button>
          </div>

          <Table
            columns={postColumns}
            dataSource={countyPostList}
            pagination={false}
            rowKey="key"
            size="middle"
            style={{ marginTop: 14 }}
          />

          {/* 全链路拓扑检验卡片 (Pin 5 挂载) */}
          <Annotated
            pin={5}
            title="跨租户双向通道全链路校验"
            note="贯通管理后台租户绑定、一体化平台定制审批开关与两级岗位权限，形成上报灵活直通/审批、下达精准流转基层的完整端到端通道。"
            tag="链路校验"
            placement="top-left"
          >
            <div
              style={{
                marginTop: 20,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  <ClusterOutlined style={{ color: '#2563eb', marginRight: 6 }} />
                  全链路跨租户通道连通性验证拓扑
                </span>
                <Tag color="success" style={{ fontSize: 12 }}>
                  <CheckCircleFilled /> 全链路双向通道已连通 100%
                </Tag>
              </div>

              <Row gutter={[12, 12]}>
                <Col span={6}>
                  <Card size="small" title="1. 管理后台路由配置" style={{ height: '100%' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: '#475569' }}>
                      <div>• 组织机构：<code>江苏省厅网安</code></div>
                      <div>• 上级客户：<code>JSga (市直单位)</code></div>
                      <div>• 关联部门：<code>徐州市 ➔ 徐州市局</code></div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="2. 平台定制上报策略" style={{ height: '100%' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: '#475569' }}>
                      <div>• 上报审批：<Tag color={reportToProvincialAudit ? 'volcano' : 'green'}>{reportToProvincialAudit ? '开启 (市局审批)' : '免审直通'}</Tag></div>
                      <div>• 审批人员：<code>{auditApprovers.slice(0, 2).join('、')}</code></div>
                      <div>• 对应模式：<code>{reportToProvincialAudit ? '场景2 审核拦截' : '场景1 免审直通'}</code></div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="3. 市局支队待办认领" style={{ height: '100%' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: '#475569' }}>
                      <div>• 承接岗位：<code>支队值班岗</code></div>
                      <div>• 核心权限：<Tag color="blue">跨租户指令接收</Tag></div>
                      <div>• 经办人员：<code>张三 (认领自办/转派)</code></div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small" title="4. 区县基层落地闭环" style={{ height: '100%' }}>
                    <div style={{ fontSize: 12, lineHeight: 1.8, color: '#475569' }}>
                      <div>• 承接岗位：<code>区县值班岗</code></div>
                      <div>• 核心权限：<Tag color="green">下级单位指令接收</Tag></div>
                      <div>• 结果回传：<code>直报省厅总队闭环</code></div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          </Annotated>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 弹窗 1：编辑客户弹窗 (1:1 复刻截图 1 & 2，包含核心新增【关联部门】)
  // =========================================================================
  const renderCustomerModal = () => (
    <Modal
      title="编辑客户"
      open={customerModalOpen}
      width={980}
      onCancel={() => setCustomerModalOpen(false)}
      onOk={handleSaveCustomer}
      okText="确定"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        <Row gutter={[32, 24]}>
          {/* 左侧：基础信息 */}
          <Col span={12} style={{ borderRight: '1px solid #f1f5f9', paddingRight: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 16 }}>
              基础信息:
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>客户名称:
                </div>
                <Input
                  value={formCustName}
                  onChange={(e) => setFormCustName(e.target.value)}
                  suffix={<span style={{ color: '#94a3b8', fontSize: 11 }}>4/100</span>}
                />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>所属组织机构:</div>
                <Select
                  value={formOrg}
                  onChange={setFormOrg}
                  style={{ width: '100%' }}
                >
                  <Option value="江苏省厅网安">江苏省厅网安</Option>
                  <Option value="浙江省厅网安">浙江省厅网安</Option>
                </Select>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>系统显示名:
                </div>
                <Input
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  suffix={<span style={{ color: '#94a3b8', fontSize: 11 }}>4/100</span>}
                />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span>上级客户:</span>
                  <span>类型:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Select
                    value={formSuperiorCust}
                    onChange={setFormSuperiorCust}
                    disabled={formIsCityDirect}
                    placeholder="请选择上级客户"
                    style={{ flex: 1 }}
                  >
                    <Option value="JSga">JSga</Option>
                  </Select>
                  <Checkbox
                    checked={formIsCityDirect}
                    onChange={(e) => {
                      setFormIsCityDirect(e.target.checked);
                      if (e.target.checked) {
                        setFormSuperiorCust('');
                      }
                    }}
                  >
                    市直单位
                  </Checkbox>
                </div>
              </Col>

              {/* 核心新增字段：关联部门 (Pin 1 挂载) */}
              {!formIsCityDirect && formSuperiorCust && (
                <Col span={24}>
                  <Annotated
                    pin={1}
                    title="管理后台 · 关联部门映射"
                    note="上级客户与关联部门动态级联，将独立地市客户与省厅部门字典绑定，解决地市客户名称与省厅部门名称不一致的指令路由寻址问题。"
                    tag="关联部门"
                    placement="top-left"
                  >
                    <div
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: 6,
                        padding: '10px 12px',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1e40af', marginBottom: 6 }}>
                        <span style={{ color: '#ef4444' }}>* </span>
                        关联部门 (上级客户已维护部门列表):
                      </div>
                      <Select
                        value={formRelatedDept}
                        onChange={setFormRelatedDept}
                        style={{ width: '100%' }}
                        placeholder="请选择上级客户对应的部门 (如: 徐州市/淮安市)"
                      >
                        {provincialDeptDict.map((d) => (
                          <Option key={d} value={d}>
                            {d}
                          </Option>
                        ))}
                      </Select>
                      <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 6, lineHeight: 1.5 }}>
                        💡 <strong>指令下发寻址映射：</strong>
                        当省厅向部门【{formRelatedDept || '选定部门'}】下达指令时，系统将自动路由推入本客户【{formCustName}】的待办池中。
                      </div>
                    </div>
                  </Annotated>
                </Col>
              )}

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>所属行业:
                </div>
                <Select defaultValue="数源智汇" style={{ width: '100%' }}>
                  <Option value="数源智汇">数源智汇</Option>
                </Select>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>经纬度:</div>
                <Input placeholder="请输入经纬度" defaultValue="117.1848, 34.2617" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>所在地:</div>
                <Select defaultValue="江苏省 / 徐州市" style={{ width: '100%' }}>
                  <Option value="江苏省 / 徐州市">江苏省 / 徐州市</Option>
                </Select>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>联系人:</div>
                <Input defaultValue="张明" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>联系人邮箱:
                </div>
                <Input defaultValue="xzsj@email.com" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>手机号码/密码:</div>
                <Input defaultValue="051683745110" />
              </Col>

              <Col span={24}>
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: '#ef4444' }}>* </span>客户类型:
                </div>
                <Space size={16}>
                  <Checkbox checked>政务</Checkbox>
                  <Checkbox disabled>企业</Checkbox>
                  <Checkbox disabled>通用</Checkbox>
                </Space>
              </Col>
            </Row>
          </Col>

          {/* 右侧：系统信息 */}
          <Col span={12} style={{ paddingLeft: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 16 }}>
              系统信息:
            </div>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>客户角色:
                </div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  defaultValue={['徐州市局', 'EagleAI测试角色']}
                >
                  <Option value="徐州市局">徐州市局</Option>
                  <Option value="EagleAI测试角色">EagleAI测试角色</Option>
                </Select>
              </Col>

              <Col span={24}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>跟进人:</div>
                <Select defaultValue="王波" style={{ width: '100%' }}>
                  <Option value="王波">王波</Option>
                </Select>
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#ef4444' }}>* </span>到期时间:
                </div>
                <Input defaultValue="2027-12-31 23:59:59" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>销售:</div>
                <Input defaultValue="谢海峰" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>售前:</div>
                <Input defaultValue="刘潭" />
              </Col>

              <Col span={12}>
                <div style={{ fontSize: 12, marginBottom: 4 }}>申请人:</div>
                <Input defaultValue="谢海峰, 刘潭" />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Modal>
  );

  // =========================================================================
  // 弹窗 2：修改岗位弹窗 (1:1 复刻截图 3，挂载权限树与核心新增权限)
  // =========================================================================
  const renderPostModal = () => (
    <Modal
      title="修改岗位"
      open={postModalOpen}
      width={760}
      onCancel={() => setPostModalOpen(false)}
      onOk={handleSavePost}
      okText="修改"
      cancelText="取消"
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <div style={{ fontSize: 13, marginBottom: 6, fontWeight: 500, color: '#334155' }}>
              <span style={{ color: '#ef4444' }}>* </span>岗位名称:
            </div>
            <Input
              value={formPostName}
              onChange={(e) => setFormPostName(e.target.value)}
              suffix={<span style={{ color: '#94a3b8', fontSize: 11 }}>5/10</span>}
            />
          </Col>

          <Col span={12}>
            <div style={{ fontSize: 13, marginBottom: 6, fontWeight: 500, color: '#334155' }}>
              <span style={{ color: '#ef4444' }}>* </span>岗位可用部门:
            </div>
            <Select
              mode="multiple"
              value={formPostDepts}
              onChange={setFormPostDepts}
              style={{ width: '100%' }}
            >
              <Option value="徐州市公安局网安支队">徐州市公安局网安支队</Option>
              <Option value="徐州市公安局贾汪分局网安大队">徐州市公安局贾汪分局网安大队</Option>
            </Select>
          </Col>

          <Col span={24}>
            <div style={{ fontSize: 13, marginBottom: 6, fontWeight: 500, color: '#334155' }}>
              <span style={{ color: '#ef4444' }}>* </span>岗位说明:
            </div>
            <TextArea
              rows={3}
              value={formPostDesc}
              onChange={(e) => setFormPostDesc(e.target.value)}
              placeholder="请输入岗位职责与执行要求说明..."
            />
          </Col>

          <Col span={24}>
            <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 600, color: '#1e293b' }}>
              <span style={{ color: '#ef4444' }}>* </span>权限配置 (树形控制):
            </div>

            {/* 权限树区域 (分别挂载 Pin 2 与 Pin 3) */}
            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: '12px 16px',
                maxHeight: 280,
                overflowY: 'auto',
                background: '#fafafa',
              }}
            >
              {activeStepTab === 'city-post' ? (
                <Annotated
                  pin={3}
                  title="一体化平台 · 跨租户指令接收权限"
                  note="市局岗位权限树新增【跨租户指令接收权限】，开启后该岗位账号自动认领省厅总队下达的跨租户指令并推入待办池。"
                  tag="跨租户权限"
                  placement="top-left"
                >
                  <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedPermKeys}
                    onCheck={(keys) => setCheckedPermKeys(keys as React.Key[])}
                    treeData={permissionTreeData}
                  />
                </Annotated>
              ) : (
                <Annotated
                  pin={4}
                  title="一体化平台 · 下级单位指令接收权限"
                  note="区县基层岗位权限树新增【下级单位指令接收】（同租户转派接收），开启后可接收市局转派的指令，指令代码全量透传，免维护异构字典映射。"
                  tag="转派权限"
                  placement="top-left"
                >
                  <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedPermKeys}
                    onCheck={(keys) => setCheckedPermKeys(keys as React.Key[])}
                    treeData={permissionTreeData}
                  />
                </Annotated>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );

  // =========================================================================
  // 抽屉：跨租户双向通道拓扑查验
  // =========================================================================
  const renderTopologyDrawer = () => (
    <Drawer
      title="跨租户指令双向拓扑路由详情"
      open={topologyDrawerOpen}
      width={460}
      onClose={() => setTopologyDrawerOpen(false)}
    >
      <div style={{ lineHeight: 2, fontSize: 13, color: '#334155' }}>
        <p><strong>上级客户（汇聚中心）：</strong> 江苏省公安厅舆情系统 (JSga)</p>
        <p><strong>独立采购客户：</strong> 徐州市公安局 (徐州市局)</p>
        <p><strong>所属生态组织：</strong> 江苏省厅网安</p>
        <p><strong>省厅关联部门：</strong> 徐州市</p>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: 6, border: '1px solid #bbf7d0' }}>
          <strong style={{ color: '#15803d' }}>链路 1：地市直报省厅通道</strong>
          <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>
            徐州端民警手工上报时勾选【上报总队】，系统通过本配置自动加载 JSga 全省属地字典并单向安全摆渡入库省厅。
          </div>
        </div>
        <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: 6, border: '1px solid #bfdbfe', marginTop: 12 }}>
          <strong style={{ color: '#1e40af' }}>链路 2：省厅指令下发与市县转派通道</strong>
          <div style={{ fontSize: 12, color: '#1e3a8a', marginTop: 4 }}>
            省厅下达至【徐州市】时，路由至徐州市局【支队值班岗】；转派至贾汪时，直接透传至贾汪【区县值班岗】，直报省厅结案。
          </div>
        </div>
      </div>
    </Drawer>
  );

  return (
    <div className="scenario-backend-config-container" style={{ position: 'relative' }}>
      {/* 视图切换分段导航条 */}
      <div className="scenario-subnav-segment-bar">
        <div className="segment-left-tabs">
          <span
            className={`segment-tab-item ${activeStepTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('admin')}
          >
            <ApartmentOutlined /> 1. 管理后台 · 客户管理与关联部门
          </span>
          <span
            className={`segment-tab-item ${activeStepTab === 'platform-config' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('platform-config')}
          >
            <SlidersOutlined /> 2. 一体化平台 · 定制配置与上报审批
          </span>
          <span
            className={`segment-tab-item ${activeStepTab === 'transmission-config' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('transmission-config')}
          >
            <ApiOutlined /> 3. 内网-工具箱-数据流转配置
          </span>
          <span
            className={`segment-tab-item ${activeStepTab === 'city-post' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('city-post')}
          >
            <SettingOutlined /> 4. 一体化平台 · 市局岗位权限配置
          </span>
          <span
            className={`segment-tab-item ${activeStepTab === 'county-post' ? 'active' : ''}`}
            onClick={() => handleSwitchTab('county-post')}
          >
            <BranchesOutlined /> 5. 一体化平台 · 区县岗位与链路校验
          </span>
        </div>

        <Space size={8}>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => {
              message.success('已恢复初始演示配置状态！');
            }}
          >
            重置配置
          </Button>
        </Space>
      </div>

      {/* 核心主视图渲染 */}
      {activeStepTab === 'admin' && renderAdminView()}
      {activeStepTab === 'platform-config' && renderPlatformCustomConfigView()}
      {activeStepTab === 'transmission-config' && (
        <div style={{ marginTop: 12 }}>
          <DataFlowConfig initialRole="provincial" />
        </div>
      )}
      {activeStepTab === 'city-post' && renderCityPostView()}
      {activeStepTab === 'county-post' && renderCountyPostView()}

      {/* 弹窗与抽屉 */}
      {renderCustomerModal()}
      {renderPostModal()}
      {renderTopologyDrawer()}
    </div>
  );
};

export default ScenarioCrossTenantConfig;
