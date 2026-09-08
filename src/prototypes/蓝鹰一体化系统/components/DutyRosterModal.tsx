import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Button, Badge, Row, Col, Tag, Tooltip, message, Segmented, Form, Cascader } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  SearchOutlined,
  CrownOutlined,
  SwapOutlined,
  TableOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { leaderStore, LeaderItem, departmentCascadeOptions } from '../leader-data';

interface DutyRosterModalProps {
  open: boolean;
  onClose: () => void;
}

// 本部门 (总队) 岗位在岗数据
const mainDeptPosts = [
  {
    postName: '指挥调度岗',
    staff: [
      { unit: '总2_舆情', name: '郑江', phone: '13594018403' },
      { unit: '总2_文职', name: '周熙', phone: '18182318948' },
    ],
  },
  {
    postName: '应急处置岗',
    staff: [
      { unit: '总2_舆情', name: '潘代刚', phone: '13635304311' },
      { unit: '总2_舆情', name: '郑江', phone: '13594018403' },
      { unit: '总2_舆情', name: '王小虎', phone: '15823743066' },
    ],
  },
  {
    postName: '分析研判岗',
    staff: [
      { unit: '总2_舆情', name: '王小虎', phone: '15823743066' },
      { unit: '总2_舆情', name: '郑江', phone: '13594018403' },
    ],
  },
  {
    postName: '材料汇编岗',
    staff: [
      { unit: '总2_文职', name: '刘依雯', phone: '13594108516' },
      { unit: '总2_文职', name: '童星', phone: '15922730171' },
      { unit: '总2_文职', name: '贾舒雯', phone: '16623536193' },
      { unit: '总2_文职', name: '李雪晶', phone: '13883940516' },
    ],
  },
  {
    postName: '值班岗【网络】',
    staff: [
      { unit: '网安12', name: '邹毅', phone: '13368089070' },
      { unit: '网安13', name: '郭科', phone: '13520202042' },
    ],
  },
];

// 区县 & 其它单位在岗数据 (采用真实区县名单与高辨识度人员配置)
const districtUnitsData = [
  {
    district: '北碚区',
    dutyPhone: '023-68862110',
    staff: [
      { name: '刘倩', role: '值班民警', phone: '15922750874' },
    ],
  },
  {
    district: '铜梁区',
    dutyPhone: '023-45698110',
    staff: [
      { name: '尹波', role: '值班民警', phone: '17784733625' },
    ],
  },
  {
    district: '秀山县',
    dutyPhone: '023-76662110',
    staff: [
      { name: '李静思', role: '总队派驻', phone: '18696980022' },
      { name: '彭俊', role: '联络员', phone: '13527397760' },
      { name: '杨稳', role: '值班民警', phone: '13452227315' },
    ],
  },
  {
    district: '丰都县',
    dutyPhone: '023-70702110',
    staff: [
      { name: '邓志华', role: '值班民警', phone: '13594564888' },
      { name: '丰都网安', role: '联络员', phone: '13658496266' },
      { name: '刘军军', role: '值班民警', phone: '17782063796' },
    ],
  },
  {
    district: '梁平区',
    dutyPhone: '023-53222110',
    staff: [
      { name: '梁平值班', role: '值班室', phone: '18290241668' },
    ],
  },
  {
    district: '长寿区',
    dutyPhone: '023-40402110',
    staff: [
      { name: '江静怡', role: '值班民警', phone: '13657683166' },
    ],
  },
  {
    district: '涪陵区',
    dutyPhone: '023-72222110',
    staff: [
      { name: '涪陵值班', role: '总队派驻', phone: '18680932692' },
      { name: '颜星', role: '联络员', phone: '13908810000' },
    ],
  },
  {
    district: '万州区',
    dutyPhone: '023-58122110',
    staff: [
      { name: '邓维刚', role: '值班长', phone: '15823712606' },
      { name: '何金', role: '联络员', phone: '13908809000' },
    ],
  },
  {
    district: '九龙坡区',
    dutyPhone: '023-68812110',
    staff: [
      { name: '九龙坡陈恒', role: '总队派驻', phone: '15123340637' },
      { name: '严丽君', role: '联络员', phone: '13908806000' },
    ],
  },
  {
    district: '南岸区',
    dutyPhone: '023-62802110',
    staff: [
      { name: '杨兰', role: '值班民警', phone: '13708303326' },
      { name: '南岸党锐', role: '联络员', phone: '13908805000' },
    ],
  },
  {
    district: '彭水县',
    dutyPhone: '023-78442110',
    staff: [
      { name: '彭水值班', role: '值班室', phone: '13983842865' },
    ],
  },
  {
    district: '綦江区',
    dutyPhone: '023-48662110',
    staff: [
      { name: '何妮', role: '值班长', phone: '13368085359' },
      { name: '王丽娜', role: '联络员', phone: '15095900907' },
    ],
  },
  {
    district: '渝北区',
    dutyPhone: '023-63955555',
    staff: [
      { name: '张志刚', role: '总队派驻', phone: '13896227093' },
      { name: '李晓敏', role: '联络员', phone: '13906227903' },
    ],
  },
  {
    district: '渝中区',
    dutyPhone: '023-63912345',
    staff: [
      { name: '渝中王俊', role: '值班长', phone: '17783011399' },
      { name: '周小波', role: '联络员', phone: '13883102244' },
    ],
  },
  {
    district: '大足区',
    dutyPhone: '023-88020000',
    staff: [
      { name: '大足网安', role: '总队派驻', phone: '16602886803' },
      { name: '唐磊', role: '联络员', phone: '13908802000' },
    ],
  },
  {
    district: '合川区',
    dutyPhone: '023-88030000',
    staff: [
      { name: '合川网安', role: '总队派驻', phone: '13694144574' },
      { name: '赵鹏', role: '联络员', phone: '13908803000' },
    ],
  },
  {
    district: '沙坪坝区',
    dutyPhone: '023-88070000',
    staff: [
      { name: '沙坪坝网安', role: '总队派驻', phone: '13368085359' },
      { name: '陈志强', role: '联络员', phone: '13908807000' },
    ],
  },
  {
    district: '江北区',
    dutyPhone: '023-88080000',
    staff: [
      { name: '江北黄智惠', role: '值班长', phone: '18225058123' },
      { name: '刘小华', role: '联络员', phone: '13908808000' },
    ],
  },
];

const DutyRosterModal: React.FC<DutyRosterModalProps> = ({ open, onClose }) => {
  // 视图模式: 'board' 看板 | 'list' 列表
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  // 领导列表 state
  const [leaders, setLeaders] = useState<LeaderItem[]>([]);
  // 当前值班领导
  const [currentLeader, setCurrentLeader] = useState<string>('李广正');
  const [isEditingLeader, setIsEditingLeader] = useState(false);
  // 区县搜索
  const [searchQuery, setSearchQuery] = useState('');

  // 新增领导弹窗状态
  const [addLeaderVisible, setAddLeaderVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setLeaders(leaderStore.getLeaders());
    setCurrentLeader(leaderStore.getDutyLeader());

    const unsubscribe = leaderStore.subscribe((newLeaders) => {
      setLeaders(newLeaders);
    });
    const unsubDuty = leaderStore.subscribeDutyLeader((dutyName) => {
      setCurrentLeader(dutyName);
    });

    return () => {
      unsubscribe();
      unsubDuty();
    };
  }, []);

  // 映射领导选择项
  const leaderOptions = leaders.map((l) => ({
    value: l.name,
    label: `${l.name} (${l.title || l.policeId})`,
    phone: l.phone,
    unit: l.unit || '总队',
  }));

  const fallbackLeader = leaderOptions[0] || {
    value: '未指定领导',
    label: '未指定领导',
    phone: '13900000000',
    unit: '总队',
  };

  const leaderObj = leaderOptions.find((l) => l.value === currentLeader) || fallbackLeader;

  // 快捷联系处理
  const handleContact = (name: string, phone: string) => {
    message.success({
      content: `已成功复制联系方式：${name} (${phone})，已发起警务通强连，正在呼叫...`,
      icon: <PhoneOutlined style={{ color: '#52c41a' }} />,
    });
  };

  // 过滤区县
  const filteredDistricts = districtUnitsData.filter(
    (d) =>
      d.district.includes(searchQuery) ||
      d.dutyPhone.includes(searchQuery) ||
      d.staff.some((s) => s.name.includes(searchQuery) || (s.role && s.role.includes(searchQuery)) || s.phone.includes(searchQuery))
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100vw"
      style={{ top: 0, paddingBottom: 0, maxWidth: '100vw', margin: 0 }}
      centered={false}
      destroyOnClose
      className={`duty-roster-modal-wrapper fullscreen-roster ${viewMode === 'board' ? 'dark-theme' : 'light-theme'}`}
    >
      <div className={`duty-roster-container ${viewMode === 'board' ? 'dark' : 'light'}`}>
        {/* 顶部 Header 控制栏 (含值班领导板块) */}
        <div className="duty-roster-header">
          <div className="header-left">
            <span className="roster-title-icon">👮‍♂️</span>
            <h3 className="roster-title">今日值班表</h3>
            <Tag color={viewMode === 'board' ? 'blue' : 'processing'} className="date-tag">
              2026年07月31日 值班大屏
            </Tag>

            {/* 今日值班领导模块 (高辨识度分体式标签) */}
            <div className="header-leader-badge">
              <div className="header-leader-title">
                <CrownOutlined className="leader-crown-icon" />
                <span>值班领导：</span>
              </div>

              {!isEditingLeader ? (
                <div
                  className="staff-split-card leader-split-card"
                  onClick={() => handleContact(leaderObj.value, leaderObj.phone)}
                  title={`点击呼叫：${leaderObj.value} (${leaderObj.phone})`}
                >
                  <div className="split-name-box leader-name-box">
                    {leaderObj.value}
                  </div>
                  <div className="split-phone-box leader-phone-box">
                    <PhoneOutlined className="split-phone-icon" />
                    <span className="split-phone-text">{leaderObj.phone}</span>
                  </div>
                </div>
              ) : (
                <Select
                  value={currentLeader}
                  onChange={(val) => {
                    setCurrentLeader(val);
                    leaderStore.setDutyLeader(val);
                    setIsEditingLeader(false);
                    message.success(`今日值班领导已成功更新为：${val}`);
                  }}
                  style={{ width: 140 }}
                  size="small"
                  autoFocus
                >
                  {leaderOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.value}
                    </Select.Option>
                  ))}
                </Select>
              )}

              <div className="header-leader-actions">
                <Button
                  type="link"
                  size="small"
                  icon={<SwapOutlined />}
                  className="header-action-btn"
                  onClick={() => setIsEditingLeader(!isEditingLeader)}
                >
                  {isEditingLeader ? '完成' : '更换'}
                </Button>
                <Button
                  type="link"
                  size="small"
                  icon={<PlusOutlined />}
                  className="header-action-btn"
                  onClick={() => setAddLeaderVisible(true)}
                >
                  新增
                </Button>
              </div>
            </div>
          </div>

          <div className="header-right" style={{ display: 'flex', alignItems: 'center', marginRight: 36 }}>
            {/* 视图切换按钮 */}
            <Segmented
              options={[
                { value: 'board', label: '看板', icon: <AppstoreOutlined /> },
                { value: 'list', label: '列表', icon: <TableOutlined /> },
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as 'board' | 'list')}
              className="view-mode-segmented"
            />
          </div>
        </div>

        {/* ==================== 1. 看板视图 ==================== */}
        {viewMode === 'board' && (
          <div className="dark-dashboard-body">
            <Row gutter={16} style={{ height: '100%' }}>
              {/* 左侧栏: 本部门 (总队在岗) - 占 1/4 (span=6) */}
              <Col span={6} className="dept-column left-dept-col">
                <div className="dept-card-panel">
                  <div className="dept-panel-header">
                    <div className="panel-title">
                      <TeamOutlined className="panel-icon" />
                      <span>总队在岗</span>
                    </div>
                    <div className="panel-stat-pill">
                      今日在岗：<strong className="stat-num">19</strong> 人
                    </div>
                  </div>

                  <div className="dept-panel-body">
                    {/* 各岗位陈列列表 */}
                    <div className="post-list-scroll">
                      {mainDeptPosts.map((post) => (
                        <div key={post.postName} className="post-group-card">
                          <div className="post-header-row">
                            <span className="post-name-title">{post.postName}</span>
                            <span className="post-count-badge">{post.staff.length} 人</span>
                          </div>
                          <div className="post-staff-list">
                            {post.staff.map((st, idx) => (
                              <div
                                key={idx}
                                className="staff-split-card"
                                onClick={() => handleContact(st.name, st.phone)}
                                title={`点击呼叫：${st.name} (${st.phone})`}
                              >
                                <div className="split-name-box">
                                  {st.unit ? `${st.unit} ${st.name}` : st.name}
                                </div>
                                <div className="split-phone-box">
                                  <PhoneOutlined className="split-phone-icon" />
                                  <span className="split-phone-text">{st.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>

              {/* 右侧栏: 其它部门 & 区县 (区县&其它单位) - 占 3/4 (span=18) */}
              <Col span={18} className="dept-column right-dept-col">
                <div className="dept-card-panel">
                  <div className="dept-panel-header">
                    <div className="panel-title">
                      <TeamOutlined className="panel-icon" />
                      <span>区县 & 其它单位在岗</span>
                    </div>
                    <div className="panel-header-actions">
                      <Input
                        prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                        placeholder="搜索区县/姓名/电话"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        className="district-search-input"
                        allowClear
                      />
                      <div className="panel-stat-pill">
                        今日在岗：<strong className="stat-num">63</strong> 人
                      </div>
                    </div>
                  </div>

                  <div className="dept-panel-body">
                    {/* 区县单位 Grid 网格矩阵 */}
                    <div className="district-cards-grid">
                      {filteredDistricts.map((d) => (
                        <div key={d.district} className="district-card">
                          <div className="district-header">
                            <span className="district-name">{d.district}</span>
                            <span
                              className="district-phone"
                              onClick={() => handleContact(`${d.district}值班室`, d.dutyPhone)}
                              title="点击呼叫值班电话"
                            >
                              值班电话 <span className="phone-highlight">{d.dutyPhone}</span>
                            </span>
                          </div>
                          <div className="district-staff-list">
                            {d.staff.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="staff-split-card district-split-card"
                                onClick={() => handleContact(s.name, s.phone)}
                                title={`点击呼叫：${s.name}${s.role ? ` (${s.role})` : ''} (${s.phone})`}
                              >
                                <div className="split-name-box">
                                  {s.name}
                                </div>
                                <div className="split-phone-box">
                                  <PhoneOutlined className="split-phone-icon" />
                                  <span className="split-phone-text">{s.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* ==================== 2. 列表视图 ==================== */}
        {viewMode === 'list' && (
          <div className="light-table-body">
            {/* 总队在岗 */}
            <div className="light-section-card">
              <div className="light-section-title">总队在岗</div>
              <table className="light-roster-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>序号</th>
                    <th style={{ width: '220px' }}>岗位名称</th>
                    <th>在岗人员</th>
                  </tr>
                </thead>
                <tbody>
                  {mainDeptPosts.map((post, index) => (
                    <tr key={post.postName}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                      <td>
                        <span className="light-post-tag">{post.postName}</span>
                      </td>
                      <td>
                        <div className="light-staff-flex">
                          {post.staff.map((st, sIdx) => (
                            <div
                              key={sIdx}
                              className="light-staff-pill"
                              onClick={() => handleContact(st.name, st.phone)}
                            >
                              <span className="unit-label">{st.unit} {st.name}</span>
                              <span className="phone-label">{st.phone}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 值班岗 (区县及其它) */}
            <div className="light-section-card" style={{ marginTop: '16px' }}>
              <div className="light-section-title">值班岗 (区县及其它单位)</div>
              <table className="light-roster-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>序号</th>
                    <th style={{ width: '220px' }}>单位</th>
                    <th>在岗人员</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDistricts.map((d, index) => (
                    <tr key={d.district}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                      <td>
                        <span className="light-district-tag">{d.district}</span>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{d.dutyPhone}</div>
                      </td>
                      <td>
                        <div className="light-staff-flex">
                          {d.staff.map((st, sIdx) => (
                            <div
                              key={sIdx}
                              className="light-staff-pill"
                              onClick={() => handleContact(st.name, st.phone)}
                            >
                              <span className="unit-label">{st.name}{st.role ? ` (${st.role})` : ''}</span>
                              <span className="phone-label">{st.phone}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 新增领导模态框 */}
      <Modal
        title="新增领导信息"
        open={addLeaderVisible}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            const newLd = leaderStore.addLeader({
              name: values.name,
              policeId: values.policeId,
              phone: values.phone,
              department: values.department,
              unit: values.department ? values.department[values.department.length - 1] : '总队',
            });
            // 自动设为当前值班领导
            setCurrentLeader(newLd.name);
            leaderStore.setDutyLeader(newLd.name);
            setAddLeaderVisible(false);
            form.resetFields();
            message.success(`成功新增领导并设为今日值班领导：${values.name}`);
          } catch (err) {
            // 校验失败
          }
        }}
        onCancel={() => {
          setAddLeaderVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        width={460}
        okText="确认新增"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="领导姓名"
            rules={[{ required: true, message: '请输入领导姓名' }]}
          >
            <Input placeholder="请输入姓名（如：李广正）" />
          </Form.Item>

          <Form.Item
            name="policeId"
            label="警号"
            rules={[{ required: true, message: '请输入警号' }]}
          >
            <Input placeholder="请输入警号（如：POL-023001）" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系方式"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码' },
            ]}
          >
            <Input placeholder="请输入手机号码（如：13908312345）" />
          </Form.Item>

          <Form.Item
            name="department"
            label="所在部门"
            rules={[{ required: true, message: '请选择所在部门' }]}
          >
            <Cascader
              options={departmentCascadeOptions}
              placeholder="请选择所在部门"
              expandTrigger="hover"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

export default DutyRosterModal;
