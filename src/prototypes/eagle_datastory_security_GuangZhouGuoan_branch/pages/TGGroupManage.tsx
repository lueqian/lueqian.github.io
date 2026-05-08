/**
 * @name TG群组管理
 * @description Telegram群组监测管理模块，针对广州国安部门业务需求定制
 * 功能包括：群组总览、群组列表管理、成员活跃详情（右侧抽屉）
 *
 * 业务背景：
 * - 面向政府客户的互联网安全敏感舆情监测
 * - 针对Telegram平台的特定群组进行定向监测
 * - 支持群组信息管理、成员活跃度分析
 *
 * 页面结构：
 * - 上方：3个总览统计卡片（已接入群组 / 总成员规模 / 今日发文总量）
 * - 下方：筛选Tab + 搜索框 + 表格列表
 * - 交互：点击"查看详情"打开右侧抽屉，展示群成员信息
 *
 * @author 数说蓝鹰产品团队
 * @version 2.0.0
 * @date 2026-05-08
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Input, Tag, Drawer, Popover, Button, Spin } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  CopyOutlined,
  CloseOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

/** TG群组数据类型 */
type TGGroupItem = {
  id: number;
  groupId: string;
  groupName: string;
  description: string;
  avatar: string;
  admin: string;
  memberCount: number;
  todayPosts: number;
  tags: string[];
};

/** 关联群组数据类型 */
type RelatedGroup = {
  id: string;
  name: string;
  groupId: string;
  isMonitored: boolean;
};

/** 群成员数据类型 */
type MemberItem = {
  id: number;
  name: string;
  memberId: string;
  avatar: string;
  interactions: number;
  crossGroupCount: number;
  relatedGroups: RelatedGroup[];
};

// ============ 模拟数据 ============

const MOCK_TG_GROUPS: TGGroupItem[] = [
  {
    id: 1,
    groupId: '-1002194108821',
    groupName: '跨境电商情报总群',
    description: '跨境电商行业情报共享与讨论',
    avatar: '跨',
    admin: 'Aileen Chen',
    memberCount: 4821,
    todayPosts: 37,
    tags: ['跨境', '高活跃', '核心群'],
  },
  {
    id: 2,
    groupId: '-1002123581290',
    groupName: 'Web3项目孵化讨论组',
    description: 'Web3项目孵化与投资讨论',
    avatar: 'W3',
    admin: 'Rex Liu',
    memberCount: 3165,
    todayPosts: 22,
    tags: ['Web3', '项目制', '公告频繁'],
  },
  {
    id: 3,
    groupId: '-1002386017736',
    groupName: 'AI产品增长实验室',
    description: 'AI产品增长策略与实验分享',
    avatar: 'AI',
    admin: 'Mika Song',
    memberCount: 5692,
    todayPosts: 49,
    tags: ['AI', '增长', '优先监控'],
  },
  {
    id: 4,
    groupId: '-1002057716934',
    groupName: '出海开发者互助群',
    description: '面向出海开发者的技术互助社区',
    avatar: '出',
    admin: 'Jason Wu',
    memberCount: 2187,
    todayPosts: 14,
    tags: ['开发者', '出海', '稳定'],
  },
  {
    id: 5,
    groupId: '-1002411196078',
    groupName: '品牌内容共创中心',
    description: '品牌内容创作与协同合作平台',
    avatar: '品',
    admin: 'Nina Zhao',
    memberCount: 3914,
    todayPosts: 28,
    tags: ['品牌', '内容协同', '标签多'],
  },
];

// 关联群组模拟数据（仅保留已监测群组）
const MOCK_RELATED_GROUPS: RelatedGroup[] = [
  { id: 'rg1', name: '跨境电商情报总群', groupId: '-1002194108821', isMonitored: true },
  { id: 'rg2', name: 'Web3项目孵化讨论组', groupId: '-1002123581290', isMonitored: true },
  { id: 'rg3', name: 'AI产品增长实验室', groupId: '-1002386017736', isMonitored: true },
];

// 生成随机关联群组（2-3个，仅已监测群组）
const generateRelatedGroups = (): RelatedGroup[] => {
  const count = Math.floor(Math.random() * 2) + 2; // 2-3个
  const shuffled = [...MOCK_RELATED_GROUPS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const MOCK_MEMBERS: MemberItem[] = [
  { id: 1, name: 'Mason Lin', memberId: 'u101', avatar: 'M', interactions: 92, crossGroupCount: 3, relatedGroups: generateRelatedGroups() },
  { id: 2, name: 'Zoey Chen', memberId: 'u102', avatar: 'Z', interactions: 88, crossGroupCount: 8, relatedGroups: generateRelatedGroups() },
  { id: 3, name: 'Evan Xu', memberId: 'u103', avatar: 'E', interactions: 76, crossGroupCount: 3, relatedGroups: generateRelatedGroups() },
  { id: 4, name: 'Sophie Gao', memberId: 'u104', avatar: 'S', interactions: 65, crossGroupCount: 8, relatedGroups: generateRelatedGroups() },
  { id: 5, name: 'Daniel Wu', memberId: 'u105', avatar: 'D', interactions: 58, crossGroupCount: 3, relatedGroups: generateRelatedGroups() },
  { id: 6, name: 'Nora Li', memberId: 'u106', avatar: 'N', interactions: 53, crossGroupCount: 8, relatedGroups: generateRelatedGroups() },
  { id: 7, name: 'Kevin Wang', memberId: 'u107', avatar: 'K', interactions: 47, crossGroupCount: 3, relatedGroups: generateRelatedGroups() },
  { id: 8, name: 'Luna Zhang', memberId: 'u108', avatar: 'L', interactions: 41, crossGroupCount: 8, relatedGroups: generateRelatedGroups() },
];

// ============ 筛选Tab配置 ============

const FILTER_TABS = [
  { key: 'all', label: '全部群组' },
  { key: 'high_active', label: '高活跃' },
  { key: 'pending', label: '待评估' },
  { key: 'content', label: '内容型' },
  { key: 'trade', label: '交易型' },
  { key: 'brand', label: '品牌型' },
];

// ============ 头像颜色映射 ============

const AVATAR_COLORS = [
  'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
];

const getAvatarColor = (index: number) => AVATAR_COLORS[index % AVATAR_COLORS.length];

// ============ 主组件 ============

const TGGroupManage: React.FC = () => {
  // ============ 状态管理 ============
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<TGGroupItem | null>(null);
  const [memberSearchKeyword, setMemberSearchKeyword] = useState<string>('');
  const [switchingGroup, setSwitchingGroup] = useState<boolean>(false);

  // ============ 事件处理 ============
  const handleViewDetail = useCallback((group: TGGroupItem) => {
    setSelectedGroup(group);
    setDrawerVisible(true);
    setMemberSearchKeyword('');
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerVisible(false);
    setSelectedGroup(null);
  }, []);

  // 切换到关联群组（抽屉内无缝跳转）
  const handleSwitchGroup = useCallback((targetGroupId: string) => {
    const targetGroup = MOCK_TG_GROUPS.find((g) => g.groupId === targetGroupId);
    if (!targetGroup) return;
    setSwitchingGroup(true);
    setMemberSearchKeyword('');
    // 模拟短暂Loading后切换内容
    setTimeout(() => {
      setSelectedGroup(targetGroup);
      setSwitchingGroup(false);
    }, 300);
  }, []);

  // ============ 过滤成员列表 ============
  const filteredMembers = memberSearchKeyword
    ? MOCK_MEMBERS.filter((m) =>
        m.name.toLowerCase().includes(memberSearchKeyword.toLowerCase())
      )
    : MOCK_MEMBERS;

  // ============ 渲染总览卡片 ============
  const renderStatsCards = () => (
    <div className="tg2-stats-row">
      <div className="tg2-stat-card">
        <div className="tg2-stat-card-left">
          <div className="tg2-stat-label">已接入群组</div>
          <div className="tg2-stat-value">126</div>
        </div>
        <div className="tg2-stat-icon-wrap">
          <div className="tg2-stat-icon">
            <AppstoreOutlined style={{ fontSize: 22, color: '#3b82f6' }} />
          </div>
        </div>
        <div className="tg2-stat-trend">
          <span className="tg2-trend-arrow">&#8593;</span>
          <span className="tg2-trend-value">+12.6%</span>
          <span className="tg2-trend-label">较昨日</span>
        </div>
      </div>

      <div className="tg2-stat-card">
        <div className="tg2-stat-card-left">
          <div className="tg2-stat-label">总成员规模</div>
          <div className="tg2-stat-value">52.8K</div>
        </div>
        <div className="tg2-stat-icon-wrap">
          <div className="tg2-stat-icon">
            <TeamOutlined style={{ fontSize: 22, color: '#3b82f6' }} />
          </div>
        </div>
        <div className="tg2-stat-trend">
          <span className="tg2-trend-arrow">&#8593;</span>
          <span className="tg2-trend-value">+8.4%</span>
          <span className="tg2-trend-label">较昨日</span>
        </div>
      </div>

      <div className="tg2-stat-card">
        <div className="tg2-stat-card-left">
          <div className="tg2-stat-label">今日发文总量</div>
          <div className="tg2-stat-value">1,284</div>
        </div>
        <div className="tg2-stat-icon-wrap">
          <div className="tg2-stat-icon">
            <FileTextOutlined style={{ fontSize: 22, color: '#3b82f6' }} />
          </div>
        </div>
        <div className="tg2-stat-trend">
          <span className="tg2-trend-arrow">&#8593;</span>
          <span className="tg2-trend-value">+19.2%</span>
          <span className="tg2-trend-label">较昨日</span>
        </div>
      </div>
    </div>
  );

  // ============ 渲染筛选Tab + 搜索 ============
  const renderFilterBar = () => (
    <div className="tg2-filter-bar">
      <div className="tg2-filter-tabs">
        {FILTER_TABS.map((tab) => (
          <div
            key={tab.key}
            className={`tg2-filter-tab ${activeFilterTab === tab.key ? 'tg2-filter-tab--active' : ''}`}
            onClick={() => setActiveFilterTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tg2-filter-search">
        <Input
          placeholder="搜索群名称、管理员或群ID"
          className="tg2-search-input"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
          allowClear
        />
      </div>
    </div>
  );

  // ============ 渲染表格列表 ============
  const renderTable = () => (
    <div className="tg2-table-wrapper">
      {/* 表头 */}
      <div className="tg2-table-header">
        <div className="tg2-col tg2-col-info">群组信息</div>
        <div className="tg2-col tg2-col-admin">管理员</div>
        <div className="tg2-col tg2-col-members">成员数</div>
        <div className="tg2-col tg2-col-gid">群 ID</div>
        <div className="tg2-col tg2-col-posts">今日发文</div>
        <div className="tg2-col tg2-col-tags">标签</div>
        <div className="tg2-col tg2-col-action">操作</div>
      </div>
      {/* 表体 */}
      <div className="tg2-table-body">
        {MOCK_TG_GROUPS.map((group) => (
          <div key={group.id} className="tg2-table-row">
            {/* 群组信息 */}
            <div className="tg2-col tg2-col-info">
              <div className="tg2-group-info-cell">
                <div
                  className="tg2-group-avatar"
                  style={{ background: getAvatarColor(group.id - 1) }}
                >
                  {group.avatar}
                </div>
                <div className="tg2-group-text">
                  <div className="tg2-group-name">{group.groupName}</div>
                  <div className="tg2-group-desc">{group.description}</div>
                </div>
              </div>
            </div>
            {/* 管理员 */}
            <div className="tg2-col tg2-col-admin">
              <span className="tg2-admin-name">{group.admin}</span>
            </div>
            {/* 成员数 */}
            <div className="tg2-col tg2-col-members">
              <span className="tg2-member-count">{group.memberCount.toLocaleString()}</span>
            </div>
            {/* 群ID */}
            <div className="tg2-col tg2-col-gid">
              <span className="tg2-group-id">
                <span className="tg2-id-hash">#</span>
                {group.groupId}
                <CopyOutlined className="tg2-copy-icon" />
              </span>
            </div>
            {/* 今日发文 */}
            <div className="tg2-col tg2-col-posts">
              <span className="tg2-post-count">{group.todayPosts}篇</span>
            </div>
            {/* 标签 */}
            <div className="tg2-col tg2-col-tags">
              <div className="tg2-tag-list">
                {group.tags.map((tag) => (
                  <span key={tag} className="tg2-tag-pill">{tag}</span>
                ))}
              </div>
            </div>
            {/* 操作 */}
            <div className="tg2-col tg2-col-action">
              <span
                className="tg2-action-link"
                onClick={() => handleViewDetail(group)}
              >
                查看详情
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============ 渲染关联群组Popover内容 ============
  const renderRelatedGroupsPopover = (relatedGroups: RelatedGroup[]) => (
    <div className="tg2-popover-content">
      <div className="tg2-popover-title">关联活跃群组</div>
      <div className="tg2-popover-list">
        {relatedGroups.map((group) => (
          <div
            key={group.id}
            className="tg2-popover-item"
            onClick={() => handleSwitchGroup(group.groupId)}
          >
            <div className="tg2-popover-group-icon">#</div>
            <div className="tg2-popover-group-info">
              <span className="tg2-popover-group-name tg2-popover-group-name--link">
                {group.name}
              </span>
              <span className="tg2-popover-group-id">{group.groupId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============ 渲染右侧抽屉 ============
  const renderDrawer = () => (
    <Drawer
      title={null}
      placement="right"
      width={380}
      onClose={handleDrawerClose}
      open={drawerVisible}
      className="tg2-drawer"
      closable={false}
      maskClosable={true}
    >
      {selectedGroup && (
        <div className="tg2-drawer-content">
          {/* 抽屉头部 */}
          <div className="tg2-drawer-header">
            <div className="tg2-drawer-title-row">
              <span className="tg2-drawer-title">群成员信息</span>
              <span className="tg2-drawer-close" onClick={handleDrawerClose}>
                <CloseOutlined style={{ fontSize: 14 }} />
              </span>
            </div>
            <div className="tg2-drawer-group-name">{selectedGroup.groupName}</div>
            <div className="tg2-drawer-meta">
              <span>管理员: {selectedGroup.admin}</span>
              <span className="tg2-drawer-meta-divider">&bull;</span>
              <span>群ID: {selectedGroup.groupId}</span>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="tg2-drawer-search">
            <Input
              placeholder="筛选群成员名称"
              className="tg2-member-search-input"
              value={memberSearchKeyword}
              onChange={(e) => setMemberSearchKeyword(e.target.value)}
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              allowClear
            />
          </div>

          {/* 成员列表标题 */}
          <div className="tg2-drawer-section-title">成员信息</div>

          {/* Loading / 内容切换 */}
          {switchingGroup ? (
            <div className="tg2-switching-loading">
              <Spin size="small" />
              <span className="tg2-switching-text">加载中...</span>
            </div>
          ) : (
            <div className="tg2-member-list">
              {filteredMembers.map((member) => (
                <div key={member.id} className="tg2-member-item">
                  <div className="tg2-member-left">
                    <div
                      className="tg2-member-avatar"
                      style={{ background: getAvatarColor(member.id - 1) }}
                    >
                      {member.avatar}
                    </div>
                    <div className="tg2-member-info">
                      <div className="tg2-member-name">{member.name}</div>
                      <div className="tg2-member-id">
                        <span className="tg2-member-id-text">成员ID: {member.memberId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="tg2-member-right">
                    {/* 跨群活跃标签 - 强制向左弹出 */}
                    <Popover
                      content={renderRelatedGroupsPopover(member.relatedGroups)}
                      title={null}
                      placement="left"
                      trigger="click"
                      arrow={true}
                      overlayClassName="tg2-related-groups-popover"
                      getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
                    >
                      <span className="tg2-cross-group-tag">
                        跨群活跃 {member.crossGroupCount}
                      </span>
                    </Popover>
                    <span className="tg2-member-interactions">{member.interactions}次互动</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Drawer>
  );

  return (
    <div className="tg2-page">
      {/* 总览卡片 */}
      {renderStatsCards()}

      {/* 列表区 */}
      <div className="tg2-list-section">
        {/* 筛选Tab + 搜索 */}
        {renderFilterBar()}

        {/* 表格 */}
        {renderTable()}
      </div>

      {/* 右侧抽屉 */}
      {renderDrawer()}
    </div>
  );
};

export default TGGroupManage;
