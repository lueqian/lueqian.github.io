/**
 * @name TG群组管理页面
 * @description 广州国安定制版 - TG群组管理功能模块
 *
 * 包含：
 * - 一级 Tab：已关注群组、待布控群组、系统所有群组
 * - TG群管理总览：统计卡片
 * - 已添加群列表：筛选 + 表格
 */

import '../style.css';
import React, { useState, useCallback } from 'react';
import { Table, Tag, Input, Button, Select, Space, Avatar, Tooltip, message } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  MoreOutlined,
  TeamOutlined,
  UserOutlined,
  MessageOutlined,
  StarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import TGGroupDrawer from '../components/TGGroupDrawer';
import TGSystemGroups from './TGSystemGroups';

// ============ 常量 ============

const PRIMARY_COLOR = '#3b82f6';

// ============ Tab 数据 ============

const TABS = [
  { key: 'following', label: '已关注群组' },
  { key: 'all', label: '系统所有群组' },
];

// ============ 统计卡片数据 ============

const STAT_CARDS = [
  {
    title: '已接入群组',
    value: 128,
    unit: '个',
    icon: <TeamOutlined style={{ fontSize: 24, color: PRIMARY_COLOR }} />,
  },
  {
    title: '总成员规模',
    value: '89.6万',
    unit: '',
    icon: <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
  },
  {
    title: '今日发文总量',
    value: 2847,
    unit: '条',
    icon: <MessageOutlined style={{ fontSize: 24, color: '#faad14' }} />,
  },
];

// ============ 筛选标签 ============

const FILTER_TAGS = ['全部', '高活跃', '内容型', '交易型', '品牌型'];

// ============ Mock 表格数据 ============

const MOCK_TABLE_DATA = [
  {
    key: '1',
    avatar: 'https://picsum.photos/seed/tg1/100/100',
    name: '暗网交易平台-华人社区',
    description: '专注海外华人圈的加密货币交易与黑市物品交易交流群...',
    admin: 'admin_xyz',
    members: '12,580',
    groupId: 'TG-20240528-001',
    todayPosts: 234,
    tags: ['高活跃', '交易型'],
    status: 'normal',
  },
  {
    key: '2',
    avatar: 'https://picsum.photos/seed/tg2/100/100',
    name: '敏感话题讨论组',
    description: '涉及政治敏感话题的讨论社群，群内成员活跃度高...',
    admin: 'user_abc',
    members: '8,234',
    groupId: 'TG-20240528-002',
    todayPosts: 156,
    tags: ['高活跃', '内容型'],
    status: 'normal',
  },
  {
    key: '3',
    avatar: 'https://picsum.photos/seed/tg3/100/100',
    name: '海外华人互助组',
    description: '海外华人互助交流平台，禁止发布违规内容...',
    admin: 'helper_001',
    members: '23,567',
    groupId: 'TG-20240528-003',
    todayPosts: 89,
    tags: ['品牌型'],
    status: 'normal',
  },
  {
    key: '4',
    avatar: 'https://picsum.photos/seed/tg4/100/100',
    name: '数字货币交流圈',
    description: 'BTC/ETH等主流数字货币行情分析与投资交流...',
    admin: 'crypto_master',
    members: '15,890',
    groupId: 'TG-20240528-004',
    todayPosts: 412,
    tags: ['高活跃', '交易型'],
    status: 'normal',
  },
  {
    key: '5',
    avatar: 'https://picsum.photos/seed/tg5/100/100',
    name: '灰色产业链曝光',
    description: '收集整理各类灰色产业链相关信息，仅供研究使用...',
    admin: 'research_vip',
    members: '5,678',
    groupId: 'TG-20240528-005',
    todayPosts: 67,
    tags: ['内容型'],
    status: 'normal',
  },
  {
    key: '6',
    avatar: 'https://picsum.photos/seed/tg6/100/100',
    name: '境外势力渗透分析',
    description: '针对境外势力在华活动的信息收集与分析社群...',
    admin: 'analyst_sec',
    members: '3,456',
    groupId: 'TG-20240528-006',
    todayPosts: 45,
    tags: ['内容型'],
    status: 'normal',
  },
  {
    key: '7',
    avatar: 'https://picsum.photos/seed/tg7/100/100',
    name: '跨境电商资源共享',
    description: '跨境电商资源对接与经验分享，禁止广告推广...',
    admin: 'ecomm_seller',
    members: '18,234',
    groupId: 'TG-20240528-007',
    todayPosts: 278,
    tags: ['品牌型'],
    status: 'normal',
  },
  {
    key: '8',
    avatar: 'https://picsum.photos/seed/tg8/100/100',
    name: '加密通讯技术讨论',
    description: '讨论各类加密通讯技术的安全性与使用方法...',
    admin: 'tech_geek',
    members: '7,890',
    groupId: 'TG-20240528-008',
    todayPosts: 123,
    tags: ['内容型'],
    status: 'normal',
  },
];

// ============ 未开发占位组件 ============

const UnDevelopedPlaceholder: React.FC<{ tabName: string }> = function ({ tabName }) {
  return (
    <div className="tg-undeveloped">
      <div className="tg-undeveloped-icon">
        <MessageOutlined style={{ fontSize: 48, color: 'rgba(59, 130, 246, 0.3)' }} />
      </div>
      <div className="tg-undeveloped-text">"{tabName}"功能未开发</div>
      <div className="tg-undeveloped-hint">该模块正在规划中，敬请期待</div>
    </div>
  );
};

// ============ 主组件 ============

const TGGroups: React.FC = function TGGroups() {
  // 当前激活的 Tab
  const [activeTab, setActiveTab] = useState('following');
  // 当前选中的筛选标签
  const [selectedFilter, setSelectedFilter] = useState('全部');
  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState('');
  // 表格加载状态
  const [loading, setLoading] = useState(false);
  // 抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 当前选中的群组
  // 扩展群组类型，添加 isFollowed 字段
  type GroupWithFollowStatus = typeof MOCK_TABLE_DATA[0] & { isFollowed?: boolean };
  const [selectedGroup, setSelectedGroup] = useState<GroupWithFollowStatus | null>(null);

  // 处理 Tab 切换
  const handleTabChange = useCallback(function (key: string) {
    setActiveTab(key);
  }, []);

  // 处理筛选标签切换
  const handleFilterChange = useCallback(function (tag: string) {
    setSelectedFilter(tag);
  }, []);

  // 打开群组详情抽屉
  const handleViewDetail = useCallback(function (record: typeof MOCK_TABLE_DATA[0]) {
    setSelectedGroup({ ...record, isFollowed: true });
    setDrawerOpen(true);
  }, []);

  // 关闭抽屉
  const handleDrawerClose = useCallback(function () {
    setDrawerOpen(false);
    setSelectedGroup(null);
    setTrackedMemberId(null);
  }, []);

  // 加入待布控
  const handleAddToPending = useCallback(function (link: string) {
    console.log('加入待布控:', link);
  }, []);

  // 追踪成员ID（用于跨群切换后高亮显示）
  const [trackedMemberId, setTrackedMemberId] = useState<string | null>(null);

  // 切换群组
  const handleSwitchGroup = useCallback(function (groupName: string, fromMemberId?: string) {
    // 在 MOCK_TABLE_DATA 中查找目标群组
    const targetGroup = MOCK_TABLE_DATA.find(function (g) { return g.name === groupName; });
    if (targetGroup) {
      setSelectedGroup({ ...targetGroup, isFollowed: true });
      setTrackedMemberId(fromMemberId || null);
      message.success(`已切换到群组：${groupName}`);
    } else {
      // 如果找不到精确匹配，创建一个模拟的群组数据
      const mockGroup = {
        key: `mock_${Date.now()}`,
        avatar: `https://picsum.photos/seed/${groupName}/100/100`,
        name: groupName,
        description: '通过跨群活跃切换的群组',
        admin: 'unknown',
        members: '未知',
        groupId: `TG-${Date.now()}`,
        todayPosts: 0,
        tags: ['未关注'],
        status: 'unfollowed',
        isFollowed: false,
      };
      setSelectedGroup(mockGroup);
      setTrackedMemberId(fromMemberId || null);
      message.info(`已切换到未关注群组：${groupName}`);
    }
  }, []);

  // 切换关注状态
  const handleToggleFollow = useCallback(function (groupId: string, isFollowed: boolean) {
    if (selectedGroup && selectedGroup.groupId === groupId) {
      setSelectedGroup({ ...selectedGroup, isFollowed });
      message.success(isFollowed ? '已加入关注' : '已移除关注');
    }
  }, [selectedGroup]);

  // 表格列定义
  const columns = [
    {
      title: '群组信息',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      render: function (_: unknown, record: typeof MOCK_TABLE_DATA[0]) {
        return (
          <div className="tg-group-info">
            <Avatar
              src={record.avatar}
              size={48}
              icon={<TeamOutlined />}
              className="tg-group-avatar"
            />
            <div className="tg-group-detail">
              <div className="tg-group-name">{record.name}</div>
              <div className="tg-group-desc">{record.description}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '管理员',
      dataIndex: 'admin',
      key: 'admin',
      width: 120,
      render: function (text: string) {
        return <span className="tg-admin-text" style={{ color: 'rgba(255,255,255,0.45)' }}>{text}</span>;
      },
    },
    {
      title: '成员数',
      dataIndex: 'members',
      key: 'members',
      width: 100,
      align: 'right' as const,
      render: function (text: string) {
        return <span className="tg-members-text">{text}</span>;
      },
    },
    {
      title: '群ID',
      dataIndex: 'groupId',
      key: 'groupId',
      width: 160,
      render: function (text: string) {
        return <span className="tg-group-id">{text}</span>;
      },
    },
    {
      title: '今日发文',
      dataIndex: 'todayPosts',
      key: 'todayPosts',
      width: 100,
      align: 'right' as const,
      render: function (text: number) {
        return <span className="tg-posts-text">{text}</span>;
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 160,
      render: function (tags: string[]) {
        return (
          <div className="tg-tags">
            {tags.map(function (tag, index) {
              const isPending = tag === '待巡检';
              return (
                <Tag
                  key={index}
                  color={isPending ? 'orange' : 'blue'}
                  className="tg-tag"
                >
                  {tag}
                </Tag>
              );
            })}
          </div>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: function (_: unknown, record: typeof MOCK_TABLE_DATA[0]) {
        return (
          <div className="tg-actions">
            <Button type="link" size="small" className="tg-action-link" onClick={function () { handleViewDetail(record); }}>
              查看详情
            </Button>
            <Button type="link" size="small" danger className="tg-action-link tg-action-link--danger">
              移除关注
            </Button>
          </div>
        );
      },
    },
  ];

  // 渲染"已关注群组"内容
  const renderFollowingContent = function () {
    return (
      <div className="tg-following-content">
        {/* TG群管理总览标题 */}
        <div className="tg-section-title">
          <span>TG群管理总览</span>
        </div>

        {/* 统计卡片区 */}
        <div className="tg-stat-cards">
          {STAT_CARDS.map(function (card) {
            return (
              <div key={card.title} className="tg-stat-card">
                <div className="tg-stat-icon">{card.icon}</div>
                <div className="tg-stat-info">
                  <div className="tg-stat-title">{card.title}</div>
                  <div className="tg-stat-value">
                    {card.value}
                    <span className="tg-stat-unit">{card.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 已添加群列表标题和筛选 */}
        <div className="tg-section-title" style={{ marginTop: 24 }}>
          <span>已添加群列表</span>
          <div className="tg-title-filters">
            {/* 搜索和筛选行 */}
            <div className="tg-search-row" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 'normal' }}>标签</span>
                <Select
                  value={selectedFilter}
                  onChange={handleFilterChange}
                  options={FILTER_TAGS.map(function(tag) { return { label: tag, value: tag }; })}
                  style={{ width: 120 }}
                  popupClassName="tg-select-dropdown"
                />
              </div>
              <Input
                placeholder="搜索群组名称/ID/群成员昵称/成员ID"
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                value={searchKeyword}
                onChange={function (e) { setSearchKeyword(e.target.value); }}
                className="tg-search-input"
              />
            </div>
          </div>
        </div>

        {/* 表格 */}
        <div className="tg-table-wrapper">
          <Table
            columns={columns}
            dataSource={MOCK_TABLE_DATA}
            loading={loading}
            pagination={{
              total: 128,
              pageSize: 10,
              current: 1,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: function (total) { return '共 ' + total + ' 条'; },
            }}
            scroll={{ x: 1100 }}
            className="tg-table"
          />
        </div>
      </div>
    );
  };

  // 获取当前 Tab 标签名
  const currentTabLabel = TABS.find(function (t) { return t.key === activeTab; })?.label || '';

  return (
    <div className="tg-page">
      {/* 一级 Tab 栏 */}
      <div className="tg-first-tabs">
        {TABS.map(function (tab) {
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              className={
                'tg-first-tab' +
                (isActive ? ' tg-first-tab--active' : '')
              }
              onClick={function () { handleTabChange(tab.key); }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      {/* 内容区 */}
      <div className="tg-content">
        {activeTab === 'following' ? (
          renderFollowingContent()
        ) : activeTab === 'all' ? (
          <TGSystemGroups />
        ) : (
          <UnDevelopedPlaceholder tabName={currentTabLabel} />
        )}
      </div>

      {/* 群组详情抽屉 */}
      <TGGroupDrawer
        open={drawerOpen}
        group={selectedGroup}
        onClose={handleDrawerClose}
        onAddToPending={handleAddToPending}
        onSwitchGroup={handleSwitchGroup}
        onToggleFollow={handleToggleFollow}
        trackedMemberId={trackedMemberId}
      />
    </div>
  );
};

export default TGGroups;
