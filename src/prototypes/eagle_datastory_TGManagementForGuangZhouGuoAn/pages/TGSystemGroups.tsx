/**
 * @name TG系统所有群组页面
 * @description 广州国安定制版 - 系统所有群组管理
 *
 * 包含：
 * - 系统所有群组列表（群组信息、群组状态、操作按钮）
 * - 状态筛选
 * - 加入关注/移除关注功能
 */

import '../style.css';
import React, { useState, useCallback, useMemo } from 'react';
import { Table, Input, Button, Select, Avatar, Tooltip, message } from 'antd';
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  StarOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import TGGroupDrawer from '../components/TGGroupDrawer';

// ============ 类型定义 ============

interface SystemGroup {
  key: string;
  avatar: string;
  name: string;
  description: string;
  admin: string;
  members: string;
  groupId: string;
  todayPosts: number;
  isFollowed: boolean;  // 是否已关注
}

// ============ 模拟数据 ============

const MOCK_SYSTEM_GROUPS: SystemGroup[] = [
  // 已关注的群组
  { key: '1', avatar: 'https://picsum.photos/seed/tg1/100/100', name: '暗网交易平台-华人社区', description: '专注海外华人圈的加密货币交易与黑市物品交易交流群...', admin: '暗网管理员', members: '2,580', groupId: 'TG-10001', todayPosts: 156, isFollowed: true },
  { key: '2', avatar: 'https://picsum.photos/seed/tg2/100/100', name: '数字货币交流圈', description: '专注数字货币行情分析、投资策略分享的技术交流群...', admin: '币圈老王', members: '1,890', groupId: 'TG-10002', todayPosts: 234, isFollowed: true },
  { key: '3', avatar: 'https://picsum.photos/seed/tg3/100/100', name: '敏感话题讨论组', description: '涉及政治、社会敏感话题的深度讨论区域...', admin: '匿名者', members: '856', groupId: 'TG-10003', todayPosts: 89, isFollowed: true },
  { key: '4', avatar: 'https://picsum.photos/seed/tg4/100/100', name: '灰色产业链曝光', description: '专门收集和曝光各类灰色产业链内幕信息...', admin: '调查记者', members: '1,234', groupId: 'TG-10004', todayPosts: 67, isFollowed: true },
  { key: '5', avatar: 'https://picsum.photos/seed/tg5/100/100', name: '境外势力渗透分析', description: '分析境外势力在境内的渗透活动和信息传播...', admin: '安全专家', members: '678', groupId: 'TG-10005', todayPosts: 45, isFollowed: true },
  { key: '6', avatar: 'https://picsum.photos/seed/tg6/100/100', name: '加密通讯技术讨论', description: '讨论加密通讯技术、安全协议的极客社区...', admin: '技术达人', members: '945', groupId: 'TG-10006', todayPosts: 112, isFollowed: true },
  { key: '7', avatar: 'https://picsum.photos/seed/tg7/100/100', name: '跨境电商资源共享', description: '跨境电商资源对接、经验分享的交流平台...', admin: '电商达人', members: '3,456', groupId: 'TG-10007', todayPosts: 289, isFollowed: true },
  { key: '8', avatar: 'https://picsum.photos/seed/tg8/100/100', name: '海外华人互助组', description: '海外华人的生活互助、经验分享社区...', admin: '海外华人', members: '5,678', groupId: 'TG-10008', todayPosts: 345, isFollowed: true },

  // 未关注的群组（系统中的其他用户关注的群组）
  { key: '9', avatar: 'https://picsum.photos/seed/tg9/100/100', name: '金融诈骗举报平台', description: '收集整理各类金融诈骗案例，提高防范意识...', admin: '反诈志愿者', members: '8,901', groupId: 'TG-10009', todayPosts: 567, isFollowed: false },
  { key: '10', avatar: 'https://picsum.photos/seed/tg10/100/100', name: '虚拟货币维权群', description: '虚拟货币投资者维权互助平台...', admin: '维权代表', members: '1,567', groupId: 'TG-10010', todayPosts: 234, isFollowed: false },
  { key: '11', avatar: 'https://picsum.photos/seed/tg11/100/100', name: '内幕消息分享', description: '各类内幕消息、小道消息的收集与传播...', admin: '消息人士', members: '2,345', groupId: 'TG-10011', todayPosts: 456, isFollowed: false },
  { key: '12', avatar: 'https://picsum.photos/seed/tg12/100/100', name: '网络黑产曝光台', description: '曝光网络黑产、灰产产业链的专门平台...', admin: '安全研究员', members: '1,890', groupId: 'TG-10012', todayPosts: 178, isFollowed: false },
  { key: '13', avatar: 'https://picsum.photos/seed/tg13/100/100', name: '境外媒体传播网', description: '境外媒体内容传播与评论交流...', admin: '媒体观察员', members: '3,234', groupId: 'TG-10013', todayPosts: 289, isFollowed: false },
  { key: '14', avatar: 'https://picsum.photos/seed/tg14/100/100', name: '匿名社交网络', description: '提供匿名社交服务的私密群组...', admin: '匿名创建者', members: '4,567', groupId: 'TG-10014', todayPosts: 678, isFollowed: false },
  { key: '15', avatar: 'https://picsum.photos/seed/tg15/100/100', name: '数据交易黑市', description: '非法数据交易的地下交流平台...', admin: '数据贩子', members: '567', groupId: 'TG-10015', todayPosts: 89, isFollowed: false },
  { key: '16', avatar: 'https://picsum.photos/seed/tg16/100/100', name: '洗钱技术交流', description: '涉及金融犯罪的非法资金流转技术讨论...', admin: '金融犯罪者', members: '234', groupId: 'TG-10016', todayPosts: 45, isFollowed: false },
  { key: '17', avatar: 'https://picsum.photos/seed/tg17/100/100', name: '网络水军平台', description: '组织网络水军、刷单炒信的犯罪团伙...', admin: '水军头目', members: '1,234', groupId: 'TG-10017', todayPosts: 123, isFollowed: false },
  { key: '18', avatar: 'https://picsum.photos/seed/tg18/100/100', name: '钓鱼攻击工具', description: '网络钓鱼攻击工具的技术交流与使用...', admin: '黑客组织', members: '456', groupId: 'TG-10018', todayPosts: 67, isFollowed: false },
  { key: '19', avatar: 'https://picsum.photos/seed/tg19/100/100', name: '隐私泄露举报', description: '举报各类隐私泄露事件的互助平台...', admin: '隐私守护者', members: '2,890', groupId: 'TG-10019', todayPosts: 234, isFollowed: false },
  { key: '20', avatar: 'https://picsum.photos/seed/tg20/100/100', name: '黑客攻击联盟', description: '组织黑客攻击、漏洞利用的技术社群...', admin: '黑客联盟', members: '345', groupId: 'TG-10020', todayPosts: 56, isFollowed: false },
];

// ============ 状态配置 ============

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: '全部群组' },
  { value: 'followed', label: '已关注' },
  { value: 'unfollowed', label: '未关注' },
];

// ============ 主组件 ============

const TGSystemGroups: React.FC = function () {
  // 列表数据
  const [dataSource, setDataSource] = useState<SystemGroup[]>(MOCK_SYSTEM_GROUPS);

  // 筛选状态
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 抽屉状态
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SystemGroup | null>(null);

  // 统计数据
  const stats = useMemo(function () {
    return {
      total: dataSource.length,
      followed: dataSource.filter(function (item) { return item.isFollowed; }).length,
      unfollowed: dataSource.filter(function (item) { return !item.isFollowed; }).length,
    };
  }, [dataSource]);

  // 筛选后的数据
  const filteredData = useMemo(function () {
    let result = [...dataSource];

    // 状态筛选
    if (statusFilter === 'followed') {
      result = result.filter(function (item) { return item.isFollowed; });
    } else if (statusFilter === 'unfollowed') {
      result = result.filter(function (item) { return !item.isFollowed; });
    }

    // 关键词搜索
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(function (item) {
        return item.name.toLowerCase().includes(keyword) ||
               item.description.toLowerCase().includes(keyword) ||
               item.admin.toLowerCase().includes(keyword);
      });
    }

    return result;
  }, [dataSource, statusFilter, searchKeyword]);

  // 打开详情抽屉
  const handleViewDetail = useCallback(function (record: SystemGroup) {
    setSelectedGroup(record);
    setDrawerOpen(true);
  }, []);

  // 关闭抽屉
  const handleDrawerClose = useCallback(function () {
    setDrawerOpen(false);
    setSelectedGroup(null);
  }, []);

  // 加入关注
  const handleAddFollow = useCallback(function (record: SystemGroup) {
    setDataSource(function (prev) {
      return prev.map(function (item) {
        if (item.key === record.key) {
          return { ...item, isFollowed: true };
        }
        return item;
      });
    });
    message.success(`已成功关注群组：${record.name}`);
  }, []);

  // 移除关注
  const handleRemoveFollow = useCallback(function (record: SystemGroup) {
    setDataSource(function (prev) {
      return prev.map(function (item) {
        if (item.key === record.key) {
          return { ...item, isFollowed: false };
        }
        return item;
      });
    });
    message.success(`已移除关注群组：${record.name}`);
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '群组信息',
      key: 'groupInfo',
      width: 320,
      render: function (_: unknown, record: SystemGroup) {
        return (
          <div className="tg-group-info">
            <Avatar src={record.avatar} size={48} icon={<TeamOutlined />} />
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
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: '成员数',
      dataIndex: 'members',
      key: 'members',
      width: 100,
    },
    {
      title: '今日发言',
      dataIndex: 'todayPosts',
      key: 'todayPosts',
      width: 100,
    },
    {
      title: '群组状态',
      key: 'followStatus',
      width: 120,
      render: function (_: unknown, record: SystemGroup) {
        return (
          <span className={record.isFollowed ? 'tgp-status-tag tgp-status--deployed' : 'tgp-status-tag tgp-status--unfollowed'}>
            {record.isFollowed ? (
              <>
                <StarOutlined style={{ fontSize: 12 }} />
                <span style={{ marginLeft: 4 }}>已关注</span>
              </>
            ) : (
              <>
                <StarOutlined style={{ fontSize: 12 }} />
                <span style={{ marginLeft: 4 }}>未关注</span>
              </>
            )}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: function (_: unknown, record: SystemGroup) {
        return (
          <div className="tg-actions">
            <Button type="link" size="small" className="tg-action-link" icon={<EyeOutlined />} onClick={function () { handleViewDetail(record); }}>
              查看详情
            </Button>
            {record.isFollowed ? (
              <Button type="link" size="small" className="tg-action-link tg-action-link--danger" icon={<DeleteOutlined />} onClick={function () { handleRemoveFollow(record); }}>
                移除关注
              </Button>
            ) : (
              <Button type="link" size="small" className="tg-action-link tg-action-link--primary" icon={<PlusOutlined />} onClick={function () { handleAddFollow(record); }}>
                加入关注
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="tgp-container">
      {/* 统计卡片 */}
      <div className="tgp-stats-row">
        <div className="tgp-stat-card">
          <div className="tgp-stat-value">{stats.total}</div>
          <div className="tgp-stat-label">系统总群组</div>
        </div>
        <div className="tgp-stat-card tgp-stat-card--success">
          <div className="tgp-stat-value">{stats.followed}</div>
          <div className="tgp-stat-label">已关注</div>
        </div>
        <div className="tgp-stat-card tgp-stat-card--pending">
          <div className="tgp-stat-value">{stats.unfollowed}</div>
          <div className="tgp-stat-label">未关注</div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="tgp-toolbar">
        <div className="tgp-toolbar-left">
          <Input
            placeholder="搜索群组名称/描述/管理员"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchKeyword}
            onChange={function (e) { setSearchKeyword(e.target.value); }}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            style={{ width: 140 }}
          />
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

      {/* 群组详情抽屉 */}
      <TGGroupDrawer
        open={drawerOpen}
        group={selectedGroup as any}
        onClose={handleDrawerClose}
        onToggleFollow={function () {}}
      />
    </div>
  );
};

export default TGSystemGroups;
