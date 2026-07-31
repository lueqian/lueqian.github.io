import React, { useState } from 'react';
import { Modal, Select, Input, Button, Badge, Row, Col, Tag, Tooltip, message, Segmented } from 'antd';
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
} from '@ant-design/icons';

interface DutyRosterModalProps {
  open: boolean;
  onClose: () => void;
}

// 值班领导可选项
const leaderOptions = [
  { value: '李广正', label: '李广正 (副总队长 / 警务技术二级总监)', phone: '13908312345', unit: '总2_舆情' },
  { value: '张建国', label: '张建国 (支队长 / 警务技术一级主管)', phone: '13802398877', unit: '总1_指挥' },
  { value: '王强', label: '王强 (副支队长 / 警务技术二级主管)', phone: '13702387766', unit: '总2_研判' },
  { value: '陈明', label: '陈明 (政委 / 警务高级教官)', phone: '13602376655', unit: '总3_政治' },
  { value: '郑江', label: '郑江 (网安支队二大队队长)', phone: '15310399665', unit: '网安二大队' },
];

// 本部门 (总队) 岗位在岗数据
const mainDeptPosts = [
  {
    postName: '指挥调度岗',
    staff: [
      { unit: '总2_舆情', name: '王浩', phone: '19802782787' },
      { unit: '总2_舆情', name: '王杰', phone: '19802782787' },
    ],
  },
  {
    postName: '应急处置岗',
    staff: [
      { unit: '总2_舆情', name: '潘代刚', phone: '13635304311' },
      { unit: '总2_舆情', name: '张旭', phone: '13635304312' },
    ],
  },
  {
    postName: '分析研判岗',
    staff: [
      { unit: '总2_文职', name: '胡清平', phone: '15023468824' },
      { unit: '总2_舆情', name: '秦峰', phone: '15086906023' },
    ],
  },
  {
    postName: '材料汇编岗',
    staff: [
      { unit: '总2_文职', name: '胡婧悦', phone: '15310399665' },
      { unit: '总2_文职', name: '冷欣', phone: '18223954199' },
      { unit: '总2_文职', name: '朱洁莹', phone: '15095981633' },
      { unit: '总2_文职', name: '肖春燕', phone: '13193094862' },
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

// 区县 & 其它单位在岗数据
const districtUnitsData = [
  {
    district: '渝北区',
    dutyPhone: '023-63955555',
    staff: [
      { role: '总队派驻', phone: '13896227093' },
      { role: '联络员', phone: '13906227903' },
    ],
  },
  {
    district: '渝中区',
    dutyPhone: '023-63912345',
    staff: [
      { role: '渝中王俊', phone: '17783011399' },
      { role: '联络员', phone: '13883102244' },
    ],
  },
  {
    district: '大足区',
    dutyPhone: '023-88020000',
    staff: [
      { role: '大足口区', phone: '16602886803' },
      { role: '联络员', phone: '13908802000' },
    ],
  },
  {
    district: '合川区',
    dutyPhone: '023-88030000',
    staff: [
      { role: '合川网安', phone: '13694144574' },
      { role: '联络员', phone: '13908803000' },
    ],
  },
  {
    district: '淮安区',
    dutyPhone: '0517-88040000',
    staff: [
      { role: '淮安网巡', phone: '15178996938' },
      { role: '联络员', phone: '13905174000' },
    ],
  },
  {
    district: '南岸区',
    dutyPhone: '023-88050000',
    staff: [
      { role: '南岸党锐', phone: '13708303326' },
      { role: '联络员', phone: '13908805000' },
    ],
  },
  {
    district: '九龙坡区',
    dutyPhone: '023-88060000',
    staff: [
      { role: '九龙坡陈恒', phone: '15123340637' },
      { role: '联络员', phone: '13908806000' },
    ],
  },
  {
    district: '沙坪坝区',
    dutyPhone: '023-88070000',
    staff: [
      { role: '沙坪坝网安', phone: '13368085359' },
      { role: '联络员', phone: '13908807000' },
    ],
  },
  {
    district: '江北区',
    dutyPhone: '023-88080000',
    staff: [
      { role: '江北黄智惠', phone: '18225058123' },
      { role: '联络员', phone: '13908808000' },
    ],
  },
  {
    district: '万州区',
    dutyPhone: '023-88090000',
    staff: [
      { role: '万州区邓维刚', phone: '15823712606' },
      { role: '联络员', phone: '13908809000' },
    ],
  },
  {
    district: '涪陵区',
    dutyPhone: '023-88100000',
    staff: [
      { role: '涪陵区颜星', phone: '18680932692' },
      { role: '联络员', phone: '13908810000' },
    ],
  },
  {
    district: '云阳县',
    dutyPhone: '023-88110000',
    staff: [
      { role: '云阳吴令', phone: '15178996938' },
      { role: '联络员章丁元', phone: '18996699363' },
    ],
  },
  {
    district: '秀山县',
    dutyPhone: '023-88120000',
    staff: [
      { role: '秀山李静思', phone: '18696980022' },
      { role: '联络员杨彬', phone: '17508495501' },
    ],
  },
  {
    district: '巫溪县',
    dutyPhone: '023-88130000',
    staff: [
      { role: '巫溪沈仕智', phone: '13983842865' },
      { role: '联络员', phone: '13908813000' },
    ],
  },
  {
    district: '璧山区',
    dutyPhone: '023-88140000',
    staff: [
      { role: '璧山苏畅', phone: '13368085359' },
      { role: '联络员王伟', phone: '15095900907' },
    ],
  },
];

const DutyRosterModal: React.FC<DutyRosterModalProps> = ({ open, onClose }) => {
  // 视图模式: 'dark' 深色科技看板 | 'light' 表格经典简版
  const [viewMode, setViewMode] = useState<'dark' | 'light'>('dark');
  // 当前值班领导
  const [currentLeader, setCurrentLeader] = useState<string>('李广正');
  const [isEditingLeader, setIsEditingLeader] = useState(false);
  // 区县搜索
  const [searchQuery, setSearchQuery] = useState('');

  const leaderObj = leaderOptions.find((l) => l.value === currentLeader) || leaderOptions[0];

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
      d.staff.some((s) => s.role.includes(searchQuery) || s.phone.includes(searchQuery))
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1340}
      centered
      destroyOnClose
      className={`duty-roster-modal-wrapper ${viewMode === 'dark' ? 'dark-theme' : 'light-theme'}`}
    >
      <div className={`duty-roster-container ${viewMode}`}>
        {/* 顶部 Header 控制栏 */}
        <div className="duty-roster-header">
          <div className="header-left">
            <span className="roster-title-icon">👮‍♂️</span>
            <h3 className="roster-title">今日值班表</h3>
            <Tag color={viewMode === 'dark' ? 'blue' : 'processing'} className="date-tag">
              2026年07月31日 值班大屏
            </Tag>
          </div>

          <div className="header-right">
            {/* 视图切换按钮 */}
            <Segmented
              options={[
                { value: 'dark', label: '深色看板', icon: <AppstoreOutlined /> },
                { value: 'light', label: '表格简版', icon: <TableOutlined /> },
              ]}
              value={viewMode}
              onChange={(val) => setViewMode(val as 'dark' | 'light')}
              className="view-mode-segmented"
            />
            {/* 关闭按钮提示 */}
          </div>
        </div>

        {/* ==================== 1. 深色科技看板视图 (深色主题 预期优化方向) ==================== */}
        {viewMode === 'dark' && (
          <div className="dark-dashboard-body">
            <Row gutter={16} style={{ height: '100%' }}>
              {/* 左侧栏: 本部门 (总队在岗) */}
              <Col span={8} className="dept-column left-dept-col">
                <div className="dept-card-panel">
                  <div className="dept-panel-header">
                    <div className="panel-title">
                      <TeamOutlined className="panel-icon" />
                      <span>总队</span>
                    </div>
                    <div className="panel-stat-pill">
                      今日在岗：<strong className="stat-num">21</strong> 人
                    </div>
                  </div>

                  <div className="dept-panel-body">
                    {/* 今日值班领导模块 (可编辑) */}
                    <div className="duty-leader-box">
                      <div className="leader-title-bar">
                        <div className="leader-label">
                          <CrownOutlined className="leader-crown-icon" />
                          <span>今日值班领导：</span>
                          {!isEditingLeader ? (
                            <span className="leader-name-display">{leaderObj.value}</span>
                          ) : (
                            <Select
                              value={currentLeader}
                              onChange={(val) => {
                                setCurrentLeader(val);
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
                        </div>
                        <Button
                          type="link"
                          size="small"
                          icon={<SwapOutlined />}
                          className="edit-leader-btn"
                          onClick={() => setIsEditingLeader(!isEditingLeader)}
                        >
                          {isEditingLeader ? '完成' : '更换领导'}
                        </Button>
                      </div>

                      {/* 领导详情卡片 */}
                      <div
                        className="leader-badge-card"
                        onClick={() => handleContact(leaderObj.value, leaderObj.phone)}
                      >
                        <div className="leader-badge-left">
                          <span className="unit-tag">{leaderObj.unit}</span>
                          <span className="leader-person-name">{leaderObj.value}</span>
                        </div>
                        <div className="leader-badge-right">
                          <PhoneOutlined className="phone-icon" />
                          <span className="phone-num">{leaderObj.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* 各岗位陈列列表 */}
                    <div className="post-list-scroll">
                      {mainDeptPosts.map((post) => (
                        <div key={post.postName} className="post-group-card">
                          <div className="post-header-row">
                            <span className="post-name-tag">{post.postName}</span>
                          </div>
                          <div className="post-staff-grid">
                            {post.staff.map((st, idx) => (
                              <div
                                key={idx}
                                className="staff-pill-card"
                                onClick={() => handleContact(st.name, st.phone)}
                              >
                                <span className="staff-unit">{st.unit} {st.name}</span>
                                <span className="staff-phone">{st.phone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>

              {/* 右侧栏: 其它部门 & 区县 (区县&其它单位) */}
              <Col span={16} className="dept-column right-dept-col">
                <div className="dept-card-panel">
                  <div className="dept-panel-header">
                    <div className="panel-title">
                      <TeamOutlined className="panel-icon" />
                      <span>区县 & 其它单位</span>
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
                    {/* 区县单位 3 列 Grid 网格矩阵 */}
                    <div className="district-cards-grid">
                      {filteredDistricts.map((d) => (
                        <div key={d.district} className="district-card">
                          <div className="district-header">
                            <span className="district-name">{d.district}</span>
                            <span
                              className="district-phone"
                              onClick={() => handleContact(`${d.district}值班室`, d.dutyPhone)}
                            >
                              值班电话 <span className="phone-highlight">{d.dutyPhone}</span>
                            </span>
                          </div>
                          <div className="district-staff-row">
                            {d.staff.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="district-staff-pill"
                                onClick={() => handleContact(s.role, s.phone)}
                              >
                                <span className="role-name">{s.role}</span>
                                <span className="role-phone">{s.phone}</span>
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

        {/* ==================== 2. 表格经典简版视图 (浅色主题 现有功能复刻) ==================== */}
        {viewMode === 'light' && (
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
                              onClick={() => handleContact(st.role, st.phone)}
                            >
                              <span className="unit-label">{st.role}</span>
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
    </Modal>
  );
};

export default DutyRosterModal;
