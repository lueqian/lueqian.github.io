/**
 * @name TG群组详情抽屉
 * @description 情报看板抽屉 - 双栏研判视图
 *
 * 布局：
 * - 左侧 65%：对话溯源区（聊天内容流）
 * - 右侧 35%：成员镜像区（成员列表）
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Drawer,
  DatePicker,
  Input,
  Select,
  Avatar,
  Tag,
  Popover,
  Button,
  message,
  Tabs,
  Tooltip,
  Modal,
  Popconfirm,
  List,
  Space,
} from 'antd';
import {
  SearchOutlined,
  CalendarOutlined,
  LinkOutlined,
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  StarOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SortDescendingOutlined,
  SortAscendingOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// ============ 常量 ============

const PRIMARY_COLOR = '#3b82f6';
const ORANGE_COLOR = '#fa8c16';

// ============ 类型定义 ============

interface AdminInfo {
  nickname: string;
  id: string;
}

interface GroupInfo {
  key: string;
  name: string;
  avatar: string;
  description: string;
  admins: AdminInfo[];
  members: string;
  groupId: string;
  todayPosts: number;
  tags: string[];
  isFollowed?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  hasLink: boolean;
  links?: string[];
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  active7Days: number;
  active30Days: number;
  crossGroupCount: number;
  crossGroups?: { name: string; isFollowed: boolean }[];
}

interface TGGroupDrawerProps {
  open: boolean;
  group: GroupInfo | null;
  onClose: () => void;
  onAddToPending?: (link: string) => void;
  onSwitchGroup?: (groupName: string, fromMemberId?: string) => void;
  onToggleFollow?: (groupId: string, isFollowed: boolean) => void;
  trackedMemberId?: string | null;
}

// ============ Mock 数据 ============

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    senderId: 'user_001',
    senderName: '暗网交易员',
    senderAvatar: 'https://picsum.photos/seed/u1/100/100',
    content: '最新交易渠道已更新，需要的朋友可以查看 t.me/newchannel123 获取详情',
    timestamp: '2025-05-09 14:32:15',
    hasLink: true,
    links: ['t.me/newchannel123'],
  },
  {
    id: '2',
    senderId: 'user_002',
    senderName: '匿名用户A',
    senderAvatar: 'https://picsum.photos/seed/u2/100/100',
    content: '有人知道最近那个新的支付通道吗？之前的已经失效了',
    timestamp: '2025-05-09 14:28:42',
    hasLink: false,
  },
  {
    id: '3',
    senderId: 'user_003',
    senderName: '资深玩家',
    senderAvatar: 'https://picsum.photos/seed/u3/100/100',
    content: '推荐一个靠谱的群组 t.me/reliable_group，里面有很多资源分享',
    timestamp: '2025-05-09 14:15:33',
    hasLink: true,
    links: ['t.me/reliable_group'],
  },
  {
    id: '4',
    senderId: 'user_001',
    senderName: '暗网交易员',
    senderAvatar: 'https://picsum.photos/seed/u1/100/100',
    content: '今日汇率更新：USDT 1:7.25，需要兑换的私信',
    timestamp: '2025-05-09 13:45:21',
    hasLink: false,
  },
  {
    id: '5',
    senderId: 'user_004',
    senderName: '新人小白',
    senderAvatar: 'https://picsum.photos/seed/u4/100/100',
    content: '请问这个群是做什么的？刚进来不太了解',
    timestamp: '2025-05-09 12:30:08',
    hasLink: false,
  },
  {
    id: '6',
    senderId: 'user_005',
    senderName: '老司机带路',
    senderAvatar: 'https://picsum.photos/seed/u5/100/100',
    content: '分享一个文章链接 https://example.com/article/123 和群组 t.me/another_group',
    timestamp: '2025-05-09 11:22:45',
    hasLink: true,
    links: ['t.me/another_group'],
  },
  {
    id: '7',
    senderId: 'user_002',
    senderName: '匿名用户A',
    senderAvatar: 'https://picsum.photos/seed/u2/100/100',
    content: '昨天有人提到的那个渠道，我试了一下确实可以用',
    timestamp: '2025-05-09 10:15:33',
    hasLink: false,
  },
  {
    id: '8',
    senderId: 'user_006',
    senderName: '情报收集者',
    senderAvatar: 'https://picsum.photos/seed/u6/100/100',
    content: '发现一个新的资源分享群 t.me/resource_hub_2024，有兴趣的可以看看',
    timestamp: '2025-05-09 09:45:12',
    hasLink: true,
    links: ['t.me/resource_hub_2024'],
  },
];

// ============ 布控状态 Mock 数据 ============

// 已布控群组列表（已关注）
const DEPLOYED_GROUPS = new Set([
  't.me/reliable_group',
  't.me/another_group',
]);

// 待布控队列
let PENDING_QUEUE: string[] = [];

// 检查群组是否已布控
function checkGroupStatus(link: string): 'deployed' | 'pending' | 'not_deployed' {
  if (DEPLOYED_GROUPS.has(link)) {
    return 'deployed';
  }
  if (PENDING_QUEUE.includes(link)) {
    return 'pending';
  }
  return 'not_deployed';
}

// 加入待布控队列
function addToPendingQueue(link: string): void {
  if (!PENDING_QUEUE.includes(link)) {
    PENDING_QUEUE.push(link);
  }
}

// ============ 动态数据生成函数 ============

const MOCK_MEMBERS: Member[] = [
  {
    id: 'user_001',
    name: '暗网交易员',
    avatar: 'https://picsum.photos/seed/u1/100/100',
    active7Days: 45,
    active30Days: 156,
    crossGroupCount: 3,
    crossGroups: [
      { name: '数字货币交流圈', isFollowed: true },
      { name: '灰色产业链曝光', isFollowed: true },
      { name: '加密通讯技术讨论', isFollowed: false },
    ],
  },
  {
    id: 'user_002',
    name: '匿名用户A',
    avatar: 'https://picsum.photos/seed/u2/100/100',
    active7Days: 38,
    active30Days: 142,
    crossGroupCount: 2,
    crossGroups: [
      { name: '敏感话题讨论组', isFollowed: true },
      { name: '海外华人互助组', isFollowed: false },
    ],
  },
  {
    id: 'user_003',
    name: '资深玩家',
    avatar: 'https://picsum.photos/seed/u3/100/100',
    active7Days: 32,
    active30Days: 128,
    crossGroupCount: 0,
  },
  {
    id: 'user_004',
    name: '新人小白',
    avatar: 'https://picsum.photos/seed/u4/100/100',
    active7Days: 28,
    active30Days: 95,
    crossGroupCount: 1,
    crossGroups: [
      { name: '跨境电商资源共享', isFollowed: true },
    ],
  },
  {
    id: 'user_005',
    name: '老司机带路',
    avatar: 'https://picsum.photos/seed/u5/100/100',
    active7Days: 25,
    active30Days: 89,
    crossGroupCount: 4,
    crossGroups: [
      { name: '数字货币交流圈', isFollowed: true },
      { name: '敏感话题讨论组', isFollowed: true },
      { name: '境外势力渗透分析', isFollowed: false },
      { name: '灰色产业链曝光', isFollowed: false },
    ],
  },
  {
    id: 'user_006',
    name: '情报收集者',
    avatar: 'https://picsum.photos/seed/u6/100/100',
    active7Days: 22,
    active30Days: 78,
    crossGroupCount: 2,
    crossGroups: [
      { name: '加密通讯技术讨论', isFollowed: true },
      { name: '境外势力渗透分析', isFollowed: true },
    ],
  },
  {
    id: 'user_007',
    name: '技术大牛',
    avatar: 'https://picsum.photos/seed/u7/100/100',
    active7Days: 18,
    active30Days: 65,
    crossGroupCount: 0,
  },
  {
    id: 'user_008',
    name: '默默观察',
    avatar: 'https://picsum.photos/seed/u8/100/100',
    active7Days: 15,
    active30Days: 52,
    crossGroupCount: 1,
    crossGroups: [
      { name: '海外华人互助组', isFollowed: false },
    ],
  },
];

// ============ 动态数据生成函数 ============

// 根据群组名称生成唯一的种子值
function getGroupSeed(groupName: string): number {
  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    const char = groupName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// 根据种子生成伪随机数
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// 生成动态成员列表
function generateGroupMembers(groupName: string, trackedMemberId?: string | null): Member[] {
  const seed = getGroupSeed(groupName);
  const memberCount = 6 + Math.floor(seededRandom(seed) * 6); // 6-12个成员
  const members: Member[] = [];

  const nicknames = ['神秘用户', '暗影行者', '数字游民', '匿名者', '观察者', '潜行者', '夜行者', '幽灵', '影子', '猎手', '哨兵', '探员'];

  for (let i = 0; i < memberCount; i++) {
    const memberSeed = seed + i * 100;
    const id = `user_${groupName}_${i}`;
    const isTracked = trackedMemberId === id;

    members.push({
      id,
      name: isTracked ? '追踪用户' : nicknames[Math.floor(seededRandom(memberSeed) * nicknames.length)] + (i + 1),
      avatar: `https://picsum.photos/seed/${groupName}_${i}/100/100`,
      active7Days: Math.floor(seededRandom(memberSeed + 1) * 50) + (isTracked ? 30 : 5),
      active30Days: Math.floor(seededRandom(memberSeed + 2) * 150) + (isTracked ? 100 : 20),
      crossGroupCount: Math.floor(seededRandom(memberSeed + 3) * 5),
      crossGroups: isTracked ? [{ name: '原群组', isFollowed: true }] : undefined,
    });
  }

  return members;
}

// 生成动态聊天消息
function generateGroupMessages(groupName: string, trackedMemberId?: string | null): ChatMessage[] {
  const seed = getGroupSeed(groupName);
  const messageCount = 8 + Math.floor(seededRandom(seed) * 8); // 8-16条消息
  const messages: ChatMessage[] = [];

  const contents = [
    '大家好，新人报道',
    '有人了解最新的行情吗？',
    '分享一个实用的工具',
    '请问这个群是做什么的？',
    '感谢分享，很有用',
    '有人在线吗？',
    '今天的消息有点多啊',
    '求推荐靠谱的渠道',
    '已私信，请查收',
    '这个不错，收藏了',
    '有懂行的吗？请教个问题',
    '晚上好各位',
  ];

  for (let i = 0; i < messageCount; i++) {
    const msgSeed = seed + i * 50;
    const senderId = `user_${groupName}_${Math.floor(seededRandom(msgSeed) * 6)}`;
    const isTracked = trackedMemberId === senderId;

    messages.push({
      id: `msg_${groupName}_${i}`,
      senderId,
      senderName: isTracked ? '追踪用户' : `用户${Math.floor(seededRandom(msgSeed + 1) * 100)}`,
      senderAvatar: `https://picsum.photos/seed/${groupName}_${senderId}/100/100`,
      content: isTracked ? '我是通过跨群活跃追踪来到这里的' : contents[Math.floor(seededRandom(msgSeed + 2) * contents.length)],
      timestamp: `2025-05-09 ${14 - Math.floor(i / 2)}:${30 + (i % 2) * 15}:00`,
      hasLink: false,
    });
  }

  return messages.reverse();
}

// ============ 链接类型选项 ============

const LINK_TYPE_OPTIONS = [
  { value: 'all', label: '全部链接' },
  { value: 'group', label: '群组链接' },
  { value: 'article', label: '文章链接' },
];

// ============ 主组件 ============

const TGGroupDrawer: React.FC<TGGroupDrawerProps> = function ({
  open,
  group,
  onClose,
  onAddToPending,
  onSwitchGroup,
  onToggleFollow,
  trackedMemberId,
}) {
  // 筛选状态
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [keyword, setKeyword] = useState('');

  // 用于触发链接状态更新的版本号
  const [linkVersion, setLinkVersion] = useState(0);
  const [linkType, setLinkType] = useState('all');

  // 成员筛选状态
  const [memberNickname, setMemberNickname] = useState('');
  const [memberId, setMemberId] = useState('');

  // 成员排序方式（7天/1个月）
  const [sortMode, setSortMode] = useState<'7days' | '30days'>('7days');
  // 排序方向（true=降序从多到少，false=升序从少到多）
  const [sortDesc, setSortDesc] = useState(true);

  // 选中的成员（用于高亮聊天）
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // 动态生成的成员列表和聊天消息（用于跨群切换）
  const [dynamicMembers, setDynamicMembers] = useState<Member[] | null>(null);
  const [dynamicMessages, setDynamicMessages] = useState<ChatMessage[] | null>(null);

  // 是否是跨群切换模式
  const isSwitchedGroup = !!trackedMemberId;

  // 当群组变化时，重新生成动态数据（仅用于跨群切换）
  useEffect(function () {
    if (group && trackedMemberId) {
      // 跨群切换：生成动态数据
      const members = generateGroupMembers(group.name, trackedMemberId);
      const messages = generateGroupMessages(group.name, trackedMemberId);
      setDynamicMembers(members);
      setDynamicMessages(messages);
      // 自动选中追踪成员
      setSelectedMemberId(trackedMemberId);
    } else {
      // 正常打开：使用原始 MOCK 数据
      setDynamicMembers(null);
      setDynamicMessages(null);
      setSelectedMemberId(null);
    }
  }, [group?.key, trackedMemberId]);

  // ============ 标签管理状态与逻辑 ============
  const [availableTags, setAvailableTags] = useState<string[]>(['高活跃', '内容型', '交易型', '品牌型', '黑产', '涉黄', '诈骗']);
  const [groupTags, setGroupTags] = useState<string[]>([]);
  const [tagManageVisible, setTagManageVisible] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{old: string, new: string} | null>(null);

  // 初始化群组标签
  useEffect(() => {
    if (group) {
      setGroupTags(group.tags || []);
    }
  }, [group]);

  const handleAddTag = useCallback(() => {
    if (!newTagName.trim()) {
      message.warning('标签名称不能为空');
      return;
    }
    if (availableTags.includes(newTagName.trim())) {
      message.warning('标签已存在');
      return;
    }
    setAvailableTags(prev => [...prev, newTagName.trim()]);
    setNewTagName('');
    message.success('标签添加成功');
  }, [newTagName, availableTags]);

  const handleSaveEditTag = useCallback(() => {
    if (!editingTag || !editingTag.new.trim()) {
      message.warning('标签名称不能为空');
      return;
    }
    if (editingTag.old !== editingTag.new && availableTags.includes(editingTag.new.trim())) {
      message.warning('标签已存在');
      return;
    }
    
    setAvailableTags(prev => prev.map(t => t === editingTag.old ? editingTag.new.trim() : t));
    
    if (groupTags.includes(editingTag.old)) {
      setGroupTags(prev => prev.map(t => t === editingTag.old ? editingTag.new.trim() : t));
    }
    
    setEditingTag(null);
    message.success('标签修改成功');
  }, [editingTag, availableTags, groupTags]);

  const handleDeleteTag = useCallback((tag: string) => {
    setAvailableTags(prev => prev.filter(t => t !== tag));
    if (groupTags.includes(tag)) {
      setGroupTags(prev => prev.filter(t => t !== tag));
    }
    message.success('标签删除成功');
  }, [groupTags]);
  // ==========================================

  // 处理链接点击 - 检查布控状态
  const handleLinkClick = useCallback(function (link: string) {
    const status = checkGroupStatus(link);

    if (status === 'deployed') {
      // 已布控
      message.warning('已布控该群组，请在已关注群组中查看详情');
    } else if (status === 'pending') {
      // 待布控中
      message.info(`该群组已在待布控队列中，请耐心等待布控完成`);
    } else {
      // 未布控，加入待布控队列
      addToPendingQueue(link);
      if (onAddToPending) {
        onAddToPending(link);
      }
      message.success(`已将 ${link} 加入待布控列表`);
      // 更新版本号以刷新链接状态显示
      setLinkVersion(function (v) { return v + 1; });
    }
  }, [onAddToPending, linkVersion]);

  // 根据排序方式排序成员（优先使用动态数据，否则使用 MOCK 数据）
  const sortedMembers = useMemo(function () {
    const sourceMembers = dynamicMembers || MOCK_MEMBERS;
    const sorted = [...sourceMembers];

    // 先筛选
    let filtered = sorted;
    if (memberNickname) {
      filtered = filtered.filter(function (m) {
        return m.name.toLowerCase().includes(memberNickname.toLowerCase());
      });
    }
    if (memberId) {
      filtered = filtered.filter(function (m) {
        return m.id.toLowerCase().includes(memberId.toLowerCase());
      });
    }

    // 再排序
    if (sortMode === '7days') {
      filtered.sort(function (a, b) {
        return sortDesc ? b.active7Days - a.active7Days : a.active7Days - b.active7Days;
      });
    } else {
      filtered.sort(function (a, b) {
        return sortDesc ? b.active30Days - a.active30Days : a.active30Days - b.active30Days;
      });
    }
    return filtered;
  }, [dynamicMembers, memberNickname, memberId, sortMode, sortDesc]);

  // 筛选消息（优先使用动态数据，否则使用 MOCK 数据）
  const filteredMessages = useMemo(function () {
    let result = [...(dynamicMessages || MOCK_MESSAGES)];

    // 关键词筛选
    if (keyword) {
      result = result.filter(function (msg) {
        return msg.content.toLowerCase().includes(keyword.toLowerCase()) ||
               msg.senderName.toLowerCase().includes(keyword.toLowerCase());
      });
    }

    // 链接类型筛选
    if (linkType === 'group') {
      result = result.filter(function (msg) { return msg.hasLink; });
    } else if (linkType === 'article') {
      result = result.filter(function (msg) {
        return msg.content.includes('http') || msg.content.includes('https');
      });
    }

    return result;
  }, [dynamicMessages, keyword, linkType]);

  // 渲染消息内容（识别链接）
  const renderMessageContent = useCallback(function (content: string, links?: string[]) {
    if (!links || links.length === 0) {
      return <span>{content}</span>;
    }
    
    // 简单的链接高亮处理
    let result = content;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    links.forEach(function (link, idx) {
      const index = content.indexOf(link);
      if (index !== -1) {
        // 添加链接前的文本
        if (index > lastIndex) {
          parts.push(<span key={`text-${idx}`}>{content.substring(lastIndex, index)}</span>);
        }
        // 根据布控状态显示不同样式
        const status = checkGroupStatus(link);
        const isDeployed = status === 'deployed';
        const isPending = status === 'pending';
        const tooltipText = isDeployed ? '已布控，点击查看详情' : isPending ? '已加入待布控队列' : '点击加入待布控';
        parts.push(
          <Tooltip key={`link-${idx}`} title={tooltipText}>
            <span
              className={'tgd-chat-link' + (isDeployed ? ' tgd-chat-link--deployed' : isPending ? ' tgd-chat-link--pending' : '')}
              onClick={function () { handleLinkClick(link); }}
            >
              {link}
              {isDeployed && <CheckCircleOutlined style={{ fontSize: 12, marginLeft: 4 }} />}
              {isPending && <ClockCircleOutlined style={{ fontSize: 12, marginLeft: 4 }} />}
              {!isDeployed && !isPending && <StarOutlined style={{ fontSize: 12, marginLeft: 4 }} />}
            </span>
          </Tooltip>
        );
        lastIndex = index + link.length;
      }
    });
    
    // 添加剩余文本
    if (lastIndex < content.length) {
      parts.push(<span key="text-end">{content.substring(lastIndex)}</span>);
    }
    
    return <>{parts}</>;
  }, [handleLinkClick]);

  // 当前正在切换的成员ID（用于追踪）
  const [switchingMemberId, setSwitchingMemberId] = useState<string | null>(null);

  // 处理切换群组
  const handleSwitchGroupClick = useCallback(function (groupName: string, memberId: string) {
    if (onSwitchGroup) {
      setSwitchingMemberId(memberId);
      onSwitchGroup(groupName, memberId);
    }
  }, [onSwitchGroup]);

  // 渲染跨群活跃 Popover 内容
  const renderCrossGroupPopover = useCallback(function (member: Member) {
    if (!member.crossGroups || member.crossGroups.length === 0) {
      return <div className="tgd-popover-empty">暂无跨群活跃记录</div>;
    }

    const followedGroups = member.crossGroups.filter(function (g) { return g.isFollowed; });
    const unfollowedGroups = member.crossGroups.filter(function (g) { return !g.isFollowed; });

    return (
      <div className="tgd-crossgroup-popover">
        <div className="tgd-popover-section">
          <div className="tgd-popover-title">
            <span className="tgd-popover-tag tgd-popover-tag--followed">已关注</span>
          </div>
          <div className="tgd-popover-groups">
            {followedGroups.map(function (g, idx) {
              return (
                <div key={idx} className="tgd-popover-group-item tgd-popover-group-item--followed">
                  <span>{g.name}</span>
                  <Button type="link" size="small" onClick={function () { handleSwitchGroupClick(g.name, member.id); }}>切换</Button>
                </div>
              );
            })}
          </div>
        </div>
        {unfollowedGroups.length > 0 && (
          <div className="tgd-popover-section">
            <div className="tgd-popover-title">
              <span className="tgd-popover-tag tgd-popover-tag--unfollowed">未关注</span>
            </div>
            <div className="tgd-popover-groups">
              {unfollowedGroups.map(function (g, idx) {
                return (
                  <div key={idx} className="tgd-popover-group-item">
                    <span>{g.name}</span>
                    <Button type="link" size="small" onClick={function () { handleSwitchGroupClick(g.name, member.id); }}>切换</Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }, [handleSwitchGroupClick]);

  // 处理关注/取消关注
  const handleFollowClick = useCallback(function () {
    if (group && onToggleFollow) {
      onToggleFollow(group.groupId, !group.isFollowed);
    }
  }, [group, onToggleFollow]);

  return (
    <Drawer
      title={
        <div className="tgd-drawer-title">
          <Avatar src={group?.avatar} size={32} icon={<TeamOutlined />} />
          <span className="tgd-drawer-title-text">{group?.name || '群组详情'}</span>
          <Tag color="blue">{group?.groupId}</Tag>
          <Button
            type={group?.isFollowed ? 'default' : 'primary'}
            size="small"
            onClick={handleFollowClick}
            style={{ marginLeft: 12 }}
          >
            {group?.isFollowed ? '移除关注' : '加入关注'}
          </Button>
        </div>
      }
      placement="right"
      width="80%"
      open={open}
      onClose={onClose}
      className="tgd-drawer"
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 55px)' },
      }}
    >
      {/* 标签管理板块 */}
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontWeight: 500, color: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center' }}>
          <TagsOutlined style={{ marginRight: 6 }} />
          群组标签：
        </span>
        <Select
          mode="multiple"
          style={{ width: 400 }}
          placeholder="请选择群组关联的标签"
          value={groupTags}
          onChange={setGroupTags}
          options={availableTags.map(t => ({ label: t, value: t }))}
          popupClassName="tg-select-dropdown"
        />
        <Button onClick={() => setTagManageVisible(true)}>
          标签管理
        </Button>
      </div>

      {/* 主体区域：左侧聊天 + 右侧成员 */}
      <div className="tgd-main-row">
        {/* 左侧：历史聊天记录 */}
        <div className="tgd-left-panel">
          {/* 标题 */}
          <div className="tgd-section-header">
            <MessageOutlined style={{ marginRight: 8 }} />
            <span>历史聊天记录</span>
          </div>

          {/* 筛选条件 */}
          <div className="tgd-chat-filter">
            <div className="tgd-filter-item">
              <CalendarOutlined style={{ marginRight: 8, color: '#999' }} />
              <RangePicker
                size="small"
                style={{ width: 220 }}
                placeholder={['开始日期', '结束日期']}
                onChange={function (dates) {
                  setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null);
                }}
              />
            </div>
            <div className="tgd-filter-item">
              <Input
                size="small"
                placeholder="搜索关键词"
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                style={{ width: 160 }}
                value={keyword}
                onChange={function (e) { setKeyword(e.target.value); }}
                allowClear
              />
            </div>
            <div className="tgd-filter-item">
              <LinkOutlined style={{ marginRight: 8, color: '#999' }} />
              <Select
                size="small"
                style={{ width: 110 }}
                value={linkType}
                onChange={setLinkType}
                options={LINK_TYPE_OPTIONS}
              />
            </div>
          </div>

          {/* 聊天内容区 */}
          <div className="tgd-chat-area">
          {filteredMessages.map(function (msg) {
            const isSelected = selectedMemberId === msg.senderId;
            return (
              <div
                key={msg.id}
                className={'tgd-chat-item' + (isSelected ? ' tgd-chat-item--selected' : '')}
              >
                <Avatar src={msg.senderAvatar} size={36} icon={<UserOutlined />} />
                <div className="tgd-chat-content">
                  <div className="tgd-chat-meta">
                    <span className="tgd-chat-sender">{msg.senderName}</span>
                    <span className="tgd-chat-time">{msg.timestamp}</span>
                  </div>
                  <div className="tgd-chat-bubble">
                    {renderMessageContent(msg.content, msg.links)}
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredMessages.length === 0 && (
            <div className="tgd-empty-state">
              <MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
              <p>暂无符合条件的聊天记录</p>
            </div>
          )}
          </div>
        </div>

        {/* 右侧：成员列表 */}
        <div className="tgd-right-panel">
          {/* 标题 */}
          <div className="tgd-section-header">
            <TeamOutlined style={{ marginRight: 8 }} />
            <span>成员列表</span>
            <span className="tgd-member-count">({sortedMembers.length}人)</span>
          </div>

          {/* 成员筛选 */}
          <div className="tgd-member-filter">
            <Input
              placeholder="成员昵称"
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              size="small"
              value={memberNickname}
              onChange={function (e) { setMemberNickname(e.target.value); }}
              allowClear
              style={{ width: 130 }}
            />
            <Input
              placeholder="ID检索"
              prefix={<span style={{ color: '#bfbfbf', fontSize: 12 }}>ID</span>}
              size="small"
              value={memberId}
              onChange={function (e) { setMemberId(e.target.value); }}
              allowClear
              style={{ width: 110 }}
            />
          </div>

          {/* 活跃度检索 */}
          <div className="tgd-sort-bar">
            <span className="tgd-sort-label">活跃度检索：</span>
            <Tabs
              activeKey={sortMode}
              onChange={function (key) { setSortMode(key as '7days' | '30days'); }}
              size="small"
              items={[
                { key: '7days', label: '7天发言次数' },
                { key: '30days', label: '1个月发言次数' },
              ]}
            />
            <Button
              type="text"
              size="small"
              icon={sortDesc ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
              onClick={function () { setSortDesc(!sortDesc); }}
              className="tgd-sort-direction-btn"
              title={sortDesc ? '从多到少，点击切换为从少到多' : '从少到多，点击切换为从多到少'}
            />
          </div>

          {/* 成员列表 */}
          <div className="tgd-member-list">
          {sortedMembers.map(function (member) {
            const isSelected = selectedMemberId === member.id;
            const isTracked = trackedMemberId === member.id;
            return (
              <div
                key={member.id}
                className={'tgd-member-card' +
                  (isSelected ? ' tgd-member-card--selected' : '') +
                  (isTracked ? ' tgd-member-card--tracked' : '')}
                onClick={function () {
                  setSelectedMemberId(isSelected ? null : member.id);
                }}
              >
                <Avatar src={member.avatar} size={40} icon={<UserOutlined />} />
                <div className="tgd-member-info">
                  <div className="tgd-member-name">{member.name}</div>
                  <div className="tgd-member-id">ID: {member.id}</div>
                </div>
                <div className="tgd-member-stats">
                  <div className="tgd-member-active">
                    {sortMode === '7days' ? member.active7Days : member.active30Days}
                    <span className="tgd-member-active-label">
                      {sortMode === '7days' ? '7天发言' : '30天发言'}
                    </span>
                  </div>
                  {member.crossGroupCount > 0 && (
                    <Popover
                      content={renderCrossGroupPopover(member)}
                      title="跨群活跃分布"
                      trigger="click"
                      placement="left"
                    >
                      <Tag
                        color="orange"
                        className="tgd-crossgroup-tag"
                        onClick={function (e) { e.stopPropagation(); }}
                      >
                        <SwapOutlined style={{ marginRight: 4 }} />
                        跨群活跃 ({member.crossGroupCount})
                      </Tag>
                    </Popover>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        </div>
      </div>

      {/* 标签管理弹窗 */}
      <Modal
        title="标签管理"
        open={tagManageVisible}
        onCancel={() => {
          setTagManageVisible(false);
          setEditingTag(null);
          setNewTagName('');
        }}
        footer={null}
        width={400}
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: '8px' }}>
          <Input 
            placeholder="输入新标签名称" 
            value={newTagName} 
            onChange={(e) => setNewTagName(e.target.value)}
            onPressEnter={handleAddTag}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>新增</Button>
        </div>
        <List
          size="small"
          bordered
          dataSource={availableTags}
          renderItem={item => (
            <List.Item
              actions={[
                editingTag?.old === item ? (
                  <Space key="edit-actions">
                    <Button type="text" size="small" icon={<SaveOutlined />} onClick={handleSaveEditTag} />
                    <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setEditingTag(null)} />
                  </Space>
                ) : (
                  <Space key="actions">
                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditingTag({ old: item, new: item })} />
                    <Popconfirm
                      title="确定要删除该标签吗？"
                      onConfirm={() => handleDeleteTag(item)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                )
              ]}
            >
              {editingTag?.old === item ? (
                <Input 
                  size="small" 
                  value={editingTag.new} 
                  onChange={(e) => setEditingTag({ ...editingTag, new: e.target.value })} 
                  onPressEnter={handleSaveEditTag}
                />
              ) : (
                <Tag style={{ background: '#f5f5f5', color: '#262626', borderColor: '#d9d9d9', fontSize: 13, padding: '2px 8px' }}>
                  {item}
                </Tag>
              )}
            </List.Item>
          )}
        />
      </Modal>
    </Drawer>
  );
};

export default TGGroupDrawer;
