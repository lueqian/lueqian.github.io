import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Card,
  Row,
  Col,
  Checkbox,
  Table,
  Tag,
  Tabs,
  Badge,
  Modal,
  Drawer,
  Alert,
  Space,
  Radio,
} from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  AuditOutlined,
  SendOutlined,
  RollbackOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  FileTextOutlined,
  EditOutlined,
  BankOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Annotated } from '@/common/Annotation';
import { useScenarioContext } from '../components/ScenarioLayout';
import '../scenario-style.css';

const { TextArea } = Input;
const { Option } = Select;

export type ViewRole = 'county' | 'city' | 'provincial' | 'rejectedEcho';
export type AuditStatus = 'pending' | 'approved' | 'rejected';

export const ScenarioCityAudit: React.FC = () => {
  const [form] = Form.useForm();
  const { setCurrentStep, currentRoleView } = useScenarioContext();

  // 当前视图
  const [currentView, setCurrentView] = useState<ViewRole>('county');

  // 区县端子视图：'form' (手工上报表单) | 'list' (我的上报列表)
  const [countySubTab, setCountySubTab] = useState<'form' | 'list'>('form');

  // 报送目标勾选状态：默认勾选支队与总队
  const [reportTargets, setReportTargets] = useState<string[]>(['branch', 'provincial']);

  // 核心业务流转状态
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitTimestamp, setSubmitTimestamp] = useState<string>('2026-10-08 18:20:15');
  const [auditStatus, setAuditStatus] = useState<AuditStatus>('pending');
  const [auditTimestamp, setAuditTimestamp] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>(
    '该舆情属于企业内部常规诉求，未达到省厅直报标准，建议属地派出所留存关注就地化解。'
  );

  // 弹窗与抽屉控制
  const [notifyModalVisible, setNotifyModalVisible] = useState<boolean>(false);
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [rejectDrawerOpen, setRejectDrawerOpen] = useState<boolean>(false);
  const [countyDetailDrawerOpen, setCountyDetailDrawerOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 省厅端状态
  const [provincialAdopted, setProvincialAdopted] = useState<boolean>(false);
  const [instructionModalOpen, setInstructionModalOpen] = useState<boolean>(false);

  // 与顶部中控步骤同步
  useEffect(() => {
    if (currentView === 'county') {
      setCurrentStep(1);
    } else if (currentView === 'city') {
      setCurrentStep(2);
    } else if (currentView === 'provincial' || currentView === 'rejectedEcho') {
      setCurrentStep(3);
    }
  }, [currentView, setCurrentStep]);

  // 响应顶部中控流程切换
  useEffect(() => {
    if (currentRoleView) {
      if (currentRoleView === 'county') {
        setCurrentView('county');
      } else if (currentRoleView === 'city') {
        setCurrentView('city');
      } else if (currentRoleView === 'result') {
        setCurrentView(auditStatus === 'rejected' ? 'rejectedEcho' : 'provincial');
      } else if (currentRoleView === 'provincial' || currentRoleView === 'rejectedEcho') {
        setCurrentView(currentRoleView as ViewRole);
      }
    }
  }, [currentRoleView, auditStatus]);

  // 表单初始预填值
  useEffect(() => {
    form.setFieldsValue({
      link: 'https://mp.weixin.qq.com/s/sample-wujin-0928 某重点制造企业员工反映绩效争议网帖...',
      topic: '关于某重点制造企业劳资争议涉稳舆情线索排查',
      eventTime: dayjs(),
      collector: '王建明 (警号: 041928)',
      collectionUnit: '常州市公安局武进分局网安大队',
      infoSource: '微信公众号 / 论坛网帖',
      author: '常州本地职场观察',
      authorPlatformId: 'WX_8829103821',
      initialOpinion:
        '经辖区网安巡查排查，某重点制造企业因绩效与工时争议出现聚集发帖苗头，相关讨论在本地贴吧与微信群有扩散趋势。涉事属地为常州武进区，提请市局支队审核把关并直报省厅总队。',
      level: '3级 (较大)',
      sentimentType: '涉稳舆情',
      taskType: '日常上报',
      jurisdiction: '常州市 / 武进区',
      notifyDistricts: ['武进区'],
    });
  }, [form]);

  // 区县端表单提交处理（触发网关受控拦截）
  const handleCountySubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
      setSubmitTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      setNotifyModalVisible(true);
      message.warning('已提交！');
      setCountySubTab('list');
    }, 400);
  };

  // 市局端审核通过放行
  const handleAuditApprove = () => {
    setAuditStatus('approved');
    setAuditTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setNotifyModalVisible(false);
    message.success('审核通过！');
  };

  // 市局端审核驳回
  const handleAuditReject = () => {
    if (!rejectReason.trim()) {
      message.warning('请输入驳回原因');
      return;
    }
    setAuditStatus('rejected');
    setAuditTimestamp(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    setRejectModalVisible(false);
    setNotifyModalVisible(false);
    message.error('已驳回！');
  };

  // ==================== 1. 视图 A：区县端填报与列表视图 ====================
  const renderCountyView = () => (
    <div className="county-view-wrapper">
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-internet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <GlobalOutlined /> 互联网端 · 常州
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            武进分局
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （当前账号：王建明）
          </span>
        </div>
        <Space>
          <Tag color="gold" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}>
            市局前置审核把关策略：已生效
          </Tag>
          <Button
            size="small"
            onClick={() => setCurrentView('city')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            前往市局审核端 (视图 B) →
          </Button>
        </Space>
      </div>

      <Card bordered={false} className="std-view-card" style={{ marginTop: 12 }}>
        <Tabs
          activeKey={countySubTab}
          onChange={(k) => setCountySubTab(k as 'form' | 'list')}
          items={[
            {
              key: 'form',
              label: (
                <span>
                  <EditOutlined /> 手工上报录入
                </span>
              ),
            },
            {
              key: 'list',
              label: (
                <span>
                  <FileTextOutlined /> 我的上报列表
                  <Badge
                    count={isSubmitted ? 1 : 0}
                    style={{
                      backgroundColor:
                        auditStatus === 'approved'
                          ? '#52c41a'
                          : auditStatus === 'rejected'
                          ? '#ff4d4f'
                          : '#fa8c16',
                      marginLeft: 6,
                    }}
                  />
                </span>
              ),
            },
          ]}
        />

        {countySubTab === 'form' ? (
          <div className="std-form-wrapper">
            <Form
              form={form}
              layout="vertical"
              className="std-form-layout"
              requiredMark={(label, info) => (
                <span>
                  {info.required && <span style={{ color: '#ef4444', marginRight: 4 }}>*</span>}
                  {label}
                </span>
              )}
            >
              {/* 1. 报送目标 [col-12 全宽] */}
              <Annotated
                pin={1}
                title="区县直报与审核策略"
                note="勾选上报总队，系统检测已开启市局审核策略，提示将由市局支队前置把关。"
                tag="审核策略"
                placement="top-left"
              >
                <Form.Item label="报送目标" required>
                  <Checkbox.Group
                    value={reportTargets}
                    onChange={(vals) => setReportTargets(vals as string[])}
                    style={{ display: 'flex', gap: 24, marginTop: 4 }}
                  >
                    <Checkbox value="branch" disabled checked>
                      上报支队 <span style={{ color: '#64748b', fontSize: 13 }}>(锁定必报)</span>
                    </Checkbox>
                    <Checkbox value="provincial">
                      上报总队{' '}
                      <span style={{ color: '#fa8c16', fontSize: 13, fontWeight: 500 }}>
                        (当前租户开启前置审核 · 需市局把关)
                      </span>
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Annotated>

              {/* 2. 舆情链接 [col-12 全宽] */}
              <Form.Item
                label="舆情链接"
                name="link"
                rules={[{ required: true, message: '请输入舆情链接' }]}
              >
                <Input placeholder="请输入监测到的舆情原始 URL 链接" style={{ height: 40 }} />
              </Form.Item>

              {/* 3. 信息主题 [col-12 全宽] */}
              <Form.Item
                label="信息主题"
                name="topic"
                rules={[{ required: true, message: '请输入信息主题' }]}
              >
                <Input placeholder="请输入舆情事件的主题概括" style={{ height: 40 }} />
              </Form.Item>

              {/* 4. 双列等分控件 */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="发生时间" name="eventTime" rules={[{ required: true }]}>
                    <DatePicker showTime style={{ width: '100%', height: 40 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="采集人员" name="collector">
                    <Input disabled style={{ height: 40 }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="采集单位" name="collectionUnit">
                    <Input disabled style={{ height: 40 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="信息来源" name="infoSource" rules={[{ required: true }]}>
                    <Select style={{ height: 40 }}>
                      <Option value="微信公众号 / 论坛网帖">微信公众号 / 论坛网帖</Option>
                      <Option value="抖音短视频平台">抖音短视频平台</Option>
                      <Option value="今日头条">今日头条</Option>
                      <Option value="微博平台">微博平台</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="来源平台账号/昵称" name="author">
                    <Input placeholder="请输入发帖账号昵称" style={{ height: 40 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="平台账号ID" name="authorPlatformId">
                    <Input placeholder="请输入发帖唯一平台ID" style={{ height: 40 }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* 5. 初研意见 [col-12 全宽] */}
              <Form.Item
                label="初研意见"
                name="initialOpinion"
                rules={[{ required: true, message: '请输入大队初研研判意见' }]}
              >
                <TextArea
                  rows={3}
                  style={{ minHeight: 96, padding: '12px 14px', lineHeight: 1.6 }}
                  placeholder="请输入属地网安大队初研排查情况与处置建议"
                />
              </Form.Item>

              {/* 6. 属性与辖区 */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="预警等级" name="level" rules={[{ required: true }]}>
                    <Select style={{ height: 40 }}>
                      <Option value="1级 (特别重大)">1级 (特别重大)</Option>
                      <Option value="2级 (重大)">2级 (重大)</Option>
                      <Option value="3级 (较大)">3级 (较大)</Option>
                      <Option value="4级 (一般)">4级 (一般)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="舆情类型" name="sentimentType" rules={[{ required: true }]}>
                    <Select style={{ height: 40 }}>
                      <Option value="涉稳舆情">涉稳舆情</Option>
                      <Option value="涉警舆情">涉警舆情</Option>
                      <Option value="网络谣言">网络谣言</Option>
                      <Option value="社会民生">社会民生</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="涉事属地" name="jurisdiction">
                    <Input disabled style={{ height: 40 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="通报区县" name="notifyDistricts">
                    <Select mode="multiple" style={{ width: '100%' }} disabled>
                      <Option value="武进区">武进区</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* 7. 操作按钮区 */}
              <div className="std-form-actions-bar">
                <Button className="std-btn-reset" onClick={() => form.resetFields()}>
                  重置表单
                </Button>

                <Annotated
                  pin={2}
                  title="前置网关受控拦截"
                  note="检测到开启市局审核策略，点击后将数据暂扣在市局待审池，不可直接出市。"
                  tag="网关拦截"
                  placement="top-left"
                >
                  <Button
                    type="primary"
                    className="std-btn-primary"
                    icon={<SendOutlined />}
                    loading={submitting}
                    onClick={handleCountySubmit}
                  >
                    确认上报
                  </Button>
                </Annotated>
              </div>
            </Form>
          </div>
        ) : (
          <div style={{ marginTop: 8 }}>
            <Table
              pagination={false}
              tableLayout="fixed"
              rowKey="id"
              dataSource={[
                {
                  id: 'wujin-01',
                  title: '关于某重点制造企业劳资争议涉稳舆情线索排查',
                  target: '支队 + 总队 (待市局审核)',
                  officer: '王建明',
                  time: submitTimestamp ? `${submitTimestamp} (刚刚)` : '2026-10-08 18:20:15',
                  status: auditStatus,
                },
              ]}
              columns={[
                {
                  title: '舆情标题',
                  dataIndex: 'title',
                  ellipsis: true,
                  render: (text) => (
                    <span style={{ fontWeight: 600, color: '#1f2937' }} title={text}>
                      {text}
                    </span>
                  ),
                },
                {
                  title: '报送目标',
                  dataIndex: 'target',
                  width: 220,
                  render: (target) => (
                    <Space size={4}>
                      <Tag color="blue">市局支队</Tag>
                      <Tag color="orange">{target.includes('总队') ? '省厅总队 (受控)' : '总队'}</Tag>
                    </Space>
                  ),
                },
                {
                  title: '采集人',
                  dataIndex: 'officer',
                  width: 110,
                },
                {
                  title: '上报时间',
                  dataIndex: 'time',
                  width: 170,
                },
                {
                  title: '流转状态',
                  dataIndex: 'status',
                  width: 140,
                  render: (st: AuditStatus) => {
                    if (st === 'approved') {
                      return <Tag color="success"><CheckCircleFilled /> 市局已通过</Tag>;
                    }
                    if (st === 'rejected') {
                      return <Tag color="error"><CloseCircleFilled /> 市局已驳回</Tag>;
                    }
                    return <Tag color="warning"><ClockCircleOutlined /> 待市局审核</Tag>;
                  },
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 160,
                  render: (_: unknown, record) => (
                    <Space size={8}>
                      {record.status === 'rejected' ? (
                        <>
                          <Button
                            type="link"
                            size="small"
                            danger
                            onClick={() => setRejectDrawerOpen(true)}
                            style={{ padding: 0 }}
                          >
                            驳回原因
                          </Button>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setCountySubTab('form')}
                            style={{ padding: 0 }}
                          >
                            重新编辑
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="link"
                          size="small"
                          onClick={() => setCountyDetailDrawerOpen(true)}
                          style={{ padding: 0 }}
                        >
                          查看详情
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Card>
    </div>
  );

  // ==================== 2. 视图 B：市局端审核工作台 ====================
  const renderCityView = () => (
    <div className="city-b-view-wrapper" style={{ position: 'relative' }}>
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-city-audit">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <AuditOutlined /> 局域网 · 常州
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            常州市局
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （当前账号：张警官 · 网安支队）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('county')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回武进填报 (视图 A)
          </Button>
          {auditStatus === 'approved' && (
            <Button
              size="small"
              onClick={() => setCurrentView('provincial')}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
            >
              前往省厅查验 (视图 C) →
            </Button>
          )}
          {auditStatus === 'rejected' && (
            <Button
              size="small"
              onClick={() => setCurrentView('rejectedEcho')}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
            >
              前往区县端查看驳回回显 →
            </Button>
          )}
        </Space>
      </div>

      {/* 审核核心要素 1：新上报消息提醒浮窗 (Notification Modal) */}
      {notifyModalVisible && (
        <Annotated
          pin={3}
          title="新上报消息提醒与独立Tab"
          note="右上角通知浮窗即时提醒限时2小时内审核，待审数据统一隔离至【上报审核】Tab。"
          tag="即时提醒"
          placement="top-right"
        >
          <div
            className="audit-notification-popup"
            style={{
              position: 'absolute',
              top: 54,
              right: 24,
              zIndex: 900,
              width: 320,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #91caff',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(22, 119, 255, 0.16)',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SafetyCertificateOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>
                  【直报省厅预审提醒】
                </span>
                <Tag color="orange" style={{ margin: 0, fontSize: 10, padding: '0 4px', lineHeight: '16px' }}>
                  待审核
                </Tag>
              </div>
              <CloseOutlined
                style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 12 }}
                onClick={() => setNotifyModalVisible(false)}
              />
            </div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, marginBottom: 12 }}>
              武进分局网安大队上报了《关于某重点制造企业劳资争议涉稳舆情线索排查》，请于 2 小时内完成审核放行或驳回。
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>时效：剩余 01小时58分</span>
              <Space size={8}>
                <Button size="small" onClick={() => setNotifyModalVisible(false)}>
                  稍后处理
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setNotifyModalVisible(false);
                    message.success('已就绪，请在下方待审卡片执行放行或驳回判定');
                  }}
                >
                  立即审核
                </Button>
              </Space>
            </div>
          </div>
        </Annotated>
      )}

      {/* 审核核心要素 2：监测预警 -【上报审核】独立模块 */}
      <Card bordered={false} className="std-view-card" style={{ marginTop: 12 }}>
        <Tabs
          defaultActiveKey="audit-report"
          items={[
            { key: 'all', label: '全部' },
            { key: 'ai-discovery', label: 'AI主动发现' },
            {
              key: 'audit-report',
              label: (
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span>上报审核</span>
                  <Badge
                    count={auditStatus === 'pending' ? 1 : 0}
                    style={{ backgroundColor: '#fa8c16', marginLeft: 6 }}
                  />
                </div>
              ),
            },
            { key: 'district', label: '区县上报' },
            { key: 'notice', label: '通报信息' },
          ]}
        />

        {/* 待审卡片 (1:1 复刻场景 1 高质感研判卡片流) */}
        <div className="stream-card-box" style={{ marginTop: 16 }}>
          <div className="stream-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, color: '#1677ff', fontSize: 14 }}>1</span>
              {auditStatus === 'approved' ? (
                <Tag color="success">
                  <CheckCircleOutlined style={{ marginRight: 4 }} />
                  市局已审核通过 · 跨网已摆渡
                </Tag>
              ) : auditStatus === 'rejected' ? (
                <Tag color="error">
                  <CloseCircleFilled style={{ marginRight: 4 }} />
                  市局已审核驳回 · 就地留存
                </Tag>
              ) : (
                <Tag color="warning">
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  待市局审核把关
                </Tag>
              )}
              <Tag style={{ background: '#1677ff', color: '#fff', border: 'none', borderRadius: 2, padding: '0 6px', fontSize: 11 }}>
                初研把关
              </Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#faad14', fontSize: 13 }}>★ ★ ★ ☆ ☆</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>3.0星</span>
            </div>
          </div>

          <div className="stream-card-meta">
            <span style={{ color: '#1e293b', fontWeight: 600 }}>武进分局·王建明</span>
            <span>ID 3766282710492811</span>
            <span>填报单位：常州市公安局武进分局网安大队</span>
            <span>
              <EnvironmentOutlined style={{ color: '#1677ff', marginRight: 2 }} />
              江苏省 / 常州市 / 武进区
            </span>
            <span>
              <ClockCircleOutlined style={{ marginRight: 2 }} />
              {submitTimestamp}
            </span>
          </div>

          <div className="stream-card-title-content">
            #关于某重点制造企业劳资争议涉稳舆情线索排查。经辖区网安巡查排查，某重点制造企业因绩效与工时争议出现聚集发帖苗头，相关讨论在本地贴吧与微信群有扩散趋势。常州武进网安大队已固定线索并出具初研意见，申请直报省厅并提请市局把关。
          </div>

          <div className="stream-card-split-body">
            <div className="stream-card-analysis-side">
              <div className="stream-card-ai-badge-box">
                <span
                  style={{
                    background: '#52c41a',
                    color: '#ffffff',
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 10,
                    fontWeight: 600,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  AI 摘要
                </span>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  监测发现网民通过公众号与本地论坛发帖反映某企业绩效争议，情感偏激度 74.2%，属地已固定证据并提请市局支队把关直报。
                </div>
              </div>

              <div className="stream-card-opinion-badge-box">
                <span
                  style={{
                    background: '#fa8c16',
                    color: '#ffffff',
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 10,
                    fontWeight: 600,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  武进初研
                </span>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#c2410c' }}>【属地大队意见】：</span>
                  该舆情有本地发酵隐患，建议由属地派出所就地化解排查，直报省厅由总队知悉统筹。
                </div>
              </div>
            </div>

            <div className="stream-card-index-card">
              <div style={{ fontSize: 26, fontWeight: 700, color: '#7c3aed', lineHeight: 1.1 }}>
                72.00
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7c3aed', opacity: 0.85, marginTop: 4 }}>
                舆情指数
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            <Tag color="blue">来源: 手工上报-武进分局</Tag>
            <Tag color="orange">待市局审核</Tag>
            <Tag color="purple">直报总队</Tag>
            <Tag color="volcano">涉稳线索</Tag>
          </div>

          {/* 审核核心要素 3：审核驳回与通过流程 (操作栏右下角规整排布) */}
          <div className="stream-card-actions-bar" style={{ justifyContent: 'flex-end' }}>
            <Space size={10} align="center">
              <Button
                type="default"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => message.success('已复制舆情标题与正文')}
              >
                一键复制
              </Button>

              <Annotated
                pin={4}
                title="审核双向判定: 通过/驳回"
                note="支持放行或驳回。放行触发省厅落库，驳回附带原因终止推送并就地留存。"
                tag="状态裁决"
                placement="top-right"
              >
                {auditStatus === 'pending' ? (
                  <Space size={8}>
                    <Button
                      danger
                      size="small"
                      icon={<RollbackOutlined />}
                      onClick={() => setRejectModalVisible(true)}
                    >
                      驳回
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={handleAuditApprove}
                    >
                      提交
                    </Button>
                  </Space>
                ) : auditStatus === 'approved' ? (
                  <Space size={8}>
                    <Tag
                      color="success"
                      style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, height: 'auto' }}
                    >
                      <CheckCircleFilled style={{ marginRight: 6 }} />
                      已审核放行 (已同步至省厅内网中心库)
                    </Tag>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => setCurrentView('provincial')}
                    >
                      前往省厅查验 <ArrowRightOutlined />
                    </Button>
                  </Space>
                ) : (
                  <Space size={8}>
                    <Tag
                      color="error"
                      style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, height: 'auto' }}
                    >
                      <CloseCircleFilled style={{ marginRight: 6 }} />
                      已驳回 (终止外发并回显武进分局)
                    </Tag>
                    <Button
                      size="small"
                      onClick={() => setCurrentView('rejectedEcho')}
                    >
                      前往区县端查看驳回回显 <ArrowRightOutlined />
                    </Button>
                  </Space>
                )}
              </Annotated>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );

  // ==================== 3. 视图 C：审核结果分流查验 (省厅查验 / 区县回显) ====================
  const renderProvincialView = () => (
    <div className="provincial-view-wrapper">
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-intranet">
        <div className="scenario-env-info">
          <span className="env-tag-badge">
            <BankOutlined /> 公安内网 · 省厅
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            省厅总队
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （当前账号：李警官）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('city')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回市局审核 (视图 B)
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentView('rejectedEcho')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            查看区县驳回分支 →
          </Button>
        </Space>
      </div>

      <Card bordered={false} className="std-view-card" style={{ marginTop: 12 }}>
        <Tabs
          defaultActiveKey="district"
          items={[
            { key: 'all', label: '全部 (AI)' },
            {
              key: 'district',
              label: (
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span>区县上报</span>
                  <Badge count={auditStatus === 'approved' ? 1 : 0} style={{ backgroundColor: '#52c41a', marginLeft: 6 }} />
                </div>
              ),
            },
            { key: 'notice', label: '通报信息' },
          ]}
        />

        {auditStatus === 'approved' ? (
          <Annotated
            pin={5}
            title="省厅接收与区县驳回回显"
            note="通过分支省厅实时查验，驳回分支区县端高亮红标回显原因并支持重新编辑。"
            tag="结果闭环"
            placement="top-left"
          >
            <div className="stream-card-box" style={{ marginTop: 16 }}>
              <div className="stream-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: '#1677ff', fontSize: 14 }}>1</span>
                  <Tag color="success">
                    <CheckCircleFilled style={{ marginRight: 4 }} />
                    已通过市局审核放行 · 省厅已落库
                  </Tag>
                  <Tag style={{ background: '#1677ff', color: '#fff', border: 'none', borderRadius: 2, padding: '0 6px', fontSize: 11 }}>
                    区县直报
                  </Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#faad14', fontSize: 13 }}>★ ★ ★ ☆ ☆</span>
                  <span style={{ color: '#64748b', fontSize: 12 }}>3.0星</span>
                </div>
              </div>

              <div className="stream-card-meta">
                <span style={{ color: '#1e293b', fontWeight: 600 }}>常州市公安局武进分局·王建明</span>
                <span>ID 3766282710492811</span>
                <span>上报来源：常州市公安局（经市局网安支队审核放行）</span>
                <span>接收时间：{auditTimestamp || '刚刚'}</span>
              </div>

              <div className="stream-card-title-content">
                #关于某重点制造企业劳资争议涉稳舆情线索排查。经常州市公安局网安支队审核放行，武进分局排查反映某制造企业工时争议聚集苗头，属地初研已固定证据，提请省厅总队关注。
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                <Tag color="blue">来源: 手工上报-常州市局</Tag>
                <Tag color="green">市局已审放行</Tag>
                <Tag color="purple">直报总队</Tag>
                <Tag color="volcano">涉稳线索</Tag>
              </div>

              <div className="stream-card-actions-bar" style={{ justifyContent: 'flex-end' }}>
                <Space size={10}>
                  <Button
                    type="default"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => message.success('已复制舆情标题与正文')}
                  >
                    一键复制
                  </Button>
                  {!provincialAdopted ? (
                    <Button
                      type="primary"
                      size="small"
                      icon={<ThunderboltOutlined />}
                      onClick={() => setInstructionModalOpen(true)}
                    >
                      下达处置指令 (更新采纳)
                    </Button>
                  ) : (
                    <Tag color="success" style={{ padding: '3px 10px', fontSize: 12, borderRadius: 4, height: 'auto' }}>
                      <CheckCircleFilled style={{ marginRight: 6 }} />
                      已采纳 · 计入总队考核
                    </Tag>
                  )}
                </Space>
              </div>
            </div>
          </Annotated>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <WarningOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 12 }} />
            <div style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>
              省厅内网库暂无该记录
            </div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              当前舆情尚未经市局网安支队审核放行，请先在市局审核端执行【提交】操作。
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderRejectedEchoView = () => (
    <div className="county-view-wrapper">
      {/* 极简环境标题栏 */}
      <div className="scenario-env-header env-internet">
        <div className="scenario-env-info">
          <span className="env-tag-badge" style={{ background: '#ef4444' }}>
            <RollbackOutlined /> 驳回回显端
          </span>
          <span className="scenario-env-title" style={{ color: '#fff' }}>
            武进分局
          </span>
          <span className="scenario-env-subtitle" style={{ color: '#fed7aa' }}>
            （当前账号：王建明）
          </span>
        </div>
        <Space>
          <Button
            size="small"
            onClick={() => setCurrentView('city')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            ← 返回市局审核 (视图 B)
          </Button>
          <Button
            size="small"
            onClick={() => setCurrentView('provincial')}
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
          >
            查看省厅通过分支 →
          </Button>
        </Space>
      </div>

      <Card bordered={false} className="std-view-card" style={{ marginTop: 12 }}>
        <Alert
          message="市局网安支队已驳回直报省厅申请"
          description="该条直报记录因初研深度不足被市局审核驳回，已终止向省厅推送，并转入武进本地留存。填报民警可查看驳回原因并重新编辑重报。"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Annotated
          pin={5}
          title="省厅接收与区县驳回回显"
          note="通过分支省厅实时查验，驳回分支区县端高亮红标回显原因并支持重新编辑。"
          tag="结果闭环"
          placement="top-left"
        >
          <Table
            pagination={false}
            tableLayout="fixed"
            rowKey="id"
            dataSource={[
              {
                id: 'wujin-01',
                title: '关于某重点制造企业劳资争议涉稳舆情线索排查',
                submitTime: submitTimestamp,
                rejectTime: auditTimestamp || '刚刚',
                auditor: '常州市局网安支队 · 张警官',
                reason: rejectReason,
              },
            ]}
            columns={[
              {
                title: '舆情标题',
                dataIndex: 'title',
                ellipsis: true,
                render: (text) => (
                  <span style={{ fontWeight: 600, color: '#1f2937' }} title={text}>
                    {text}
                  </span>
                ),
              },
              {
                title: '审核民警',
                dataIndex: 'auditor',
                width: 170,
              },
              {
                title: '审核结论',
                key: 'status',
                width: 120,
                render: () => <Tag color="error"><CloseCircleFilled /> 已驳回</Tag>,
              },
              {
                title: '驳回原因',
                dataIndex: 'reason',
                ellipsis: true,
                render: (val) => (
                  <span style={{ color: '#ef4444', fontWeight: 500 }} title={val}>
                    {val}
                  </span>
                ),
              },
              {
                title: '操作',
                key: 'action',
                width: 140,
                render: () => (
                  <Space size={8}>
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => setRejectDrawerOpen(true)}
                      style={{ padding: 0 }}
                    >
                      查看原因
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setCurrentView('county');
                        setCountySubTab('form');
                      }}
                      style={{ padding: 0 }}
                    >
                      重新编辑
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Annotated>
      </Card>
    </div>
  );

  return (
    <div className="scenario-direct-provincial-container" style={{ position: 'relative' }}>
      {/* 视图主体渲染 */}
      {currentView === 'county' && renderCountyView()}
      {currentView === 'city' && renderCityView()}
      {currentView === 'provincial' && renderProvincialView()}
      {currentView === 'rejectedEcho' && renderRejectedEchoView()}

      {/* ==================== 弹窗与抽屉 ==================== */}

      {/* 1. 市局端审核驳回弹窗 */}
      <Modal
        title="常州市公安局网安支队 - 审核驳回判定"
        open={rejectModalVisible}
        onOk={handleAuditReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ marginBottom: 12, fontSize: 13, color: '#475569' }}>
            请选择常见驳回原因或自定义输入，驳回后数据将终止推向省厅并就地留存回写：
          </div>
          <Radio.Group
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}
          >
            <Radio value="该舆情属于企业内部常规诉求，未达到省厅直报标准，建议属地派出所留存关注就地化解。">
              该舆情属于企业内部常规诉求，未达到省厅直报标准，建议本地留存关注就地化解
            </Radio>
            <Radio value="初研证据链条不完整，缺少涉事网帖关键截图与发布账号精确平台ID，请属地核实后补充。">
              初研证据链条不完整，缺少涉事网帖关键截图与精确平台ID，请核实补充
            </Radio>
            <Radio value="涉及劳动用工争议，建议转交人社部门会同调解，暂不列入涉稳直报省厅范畴。">
              涉及劳动用工争议，建议转交属地人社部门会同调解，暂不直报省厅
            </Radio>
          </Radio.Group>
          <TextArea
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="自定义驳回意见..."
          />
        </div>
      </Modal>

      {/* 2. 驳回原因详情抽屉 */}
      <Drawer
        title="市局审核驳回详情意见书"
        placement="right"
        width={480}
        open={rejectDrawerOpen}
        onClose={() => setRejectDrawerOpen(false)}
      >
        <Alert
          message="常州市公安局网安支队审核结论：驳回"
          description={rejectReason}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <div style={{ lineHeight: '30px', fontSize: 13 }}>
          <p><strong>审核单位：</strong> 常州市公安局网安支队综合科</p>
          <p><strong>审核民警：</strong> 张警官 (警号: 040182)</p>
          <p><strong>审核时间：</strong> {auditTimestamp || '2026-10-08 18:24:00'}</p>
          <p><strong>处置建议：</strong> 终止外发省厅，由武进高新派出所开展落地就地稳控化解。</p>
        </div>
      </Drawer>

      {/* 3. 区县端上报详情抽屉 */}
      <Drawer
        title="区县手工上报详情"
        placement="right"
        width={480}
        open={countyDetailDrawerOpen}
        onClose={() => setCountyDetailDrawerOpen(false)}
      >
        <div style={{ lineHeight: '28px', fontSize: 13 }}>
          <p><strong>舆情主题：</strong> 关于某重点制造企业劳资争议涉稳舆情线索排查</p>
          <p><strong>填报单位：</strong> 常州市公安局武进分局网安大队</p>
          <p><strong>采集民警：</strong> 王建明</p>
          <p><strong>预警等级：</strong> 3级 (较大)</p>
          <p><strong>报送目标：</strong> 市局支队 + 省厅总队</p>
          <p><strong>审核状态：</strong> {auditStatus === 'approved' ? '市局已审核通过' : auditStatus === 'rejected' ? '市局已驳回' : '待市局审核'}</p>
          <p><strong>初研意见：</strong> 经辖区巡查排查，某制造企业因绩效与工时争议出现聚集发帖苗头，建议提请市局关注。</p>
        </div>
      </Drawer>

      {/* 4. 省厅下达处置指令弹窗 */}
      <Modal
        title="省厅网安总队 - 下达处置指令"
        open={instructionModalOpen}
        onOk={() => {
          setProvincialAdopted(true);
          setInstructionModalOpen(false);
          message.success('指令下达成功！');
        }}
        onCancel={() => setInstructionModalOpen(false)}
        okText="确认下发指令（确认采纳）"
      >
        <Form layout="vertical" initialValues={{ target: '常州市公安局武进分局网安大队', hours: 4 }}>
          <Form.Item label="协同指令接收单位" name="target">
            <Input disabled />
          </Form.Item>
          <Form.Item label="反馈时限" name="hours">
            <Select>
              <Option value={2}>2 小时（紧急）</Option>
              <Option value={4}>4 小时（常规）</Option>
            </Select>
          </Form.Item>
          <Form.Item label="处置要求" initialValue="请常州武进大队落地核查企业涉稳诉求，4小时内反馈稳控进展报告。">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScenarioCityAudit;
