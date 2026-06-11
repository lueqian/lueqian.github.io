import React, { useState } from 'react';
import {
  Button,
  Tag,
  Avatar,
  Input,
  Badge,
  Tabs,
  Dropdown,
  Space,
  Modal,
  Drawer,
  Checkbox,
  Select,
} from 'antd';
import {
  LeftOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  MoreOutlined,
  StarFilled,
  StarOutlined,
  EyeOutlined,
  MessageOutlined,
  LikeOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BellOutlined,
  CloseOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  SendOutlined,
  LinkOutlined,
  SyncOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { TabPane } = Tabs;

// ==================== 模拟数据 ====================

interface TaskInfo {
  id: string;
  code: string;
  name: string;
  status: string;
  department: string;
  keywords: string[];
  createTime: string;
  eventCount: number;
  trend: number;
}

interface EventItem {
  id: string;
  seq: number;
  title: string;
  author: string;
  authorAvatar?: string;
  platform: string;
  platformIcon: string;
  publishTime: string;
  content: string;
  images: string[];
  videoUrl?: string;
  views: number;
  comments: number;
  likes: number;
  shares: number;
  heatLevel: 'high' | 'medium' | 'low';
  heatValue: number;
  isWaring: boolean;
  tags: string[];
  dataSource: string;
  sentimentIndex: number;
  starRating: number;
}

interface SideTask {
  id: string;
  code: string;
  name: string;
  status: string;
  eventCount: number;
  isActive: boolean;
}

interface InstructionOption {
  id: string;
  name: string;
  group: '本单位指令' | '执行单位指令';
  cycle: string;
}

interface IssuedInstruction {
  id: string;
  eventId: string;
  instructionNames: string[];
  receiverArea: string;
  receiverPost: string;
  receiverUser: string;
  status: '已下达' | '已签收' | '处理中' | '已完成' | '已超时';
  linkStatus: '未检测' | '仍可访问' | '链接失效' | '无法判断' | '平台异常';
  issuedBy: string;
  issuedTime: string;
  deadline: string;
  latestFeedback: string;
}

// 当前任务信息
const currentTask: TaskInfo = {
  id: '1',
  code: '0510',
  name: '淮安汛情',
  status: 'normal',
  department: '支队',
  keywords: ['淮安', '汛情', '洪水', '暴雨', '防汛'],
  createTime: '2024-05-10 09:30:00',
  eventCount: 156,
  trend: 12,
};

// 侧边任务列表
const sideTasks: SideTask[] = [
  { id: '1', code: '0510', name: '淮安汛情', status: 'normal', eventCount: 156, isActive: true },
  { id: '2', code: '0118', name: '高张花园', status: 'normal', eventCount: 89, isActive: false },
  { id: '3', code: '0322', name: '交通事故', status: 'urgent', eventCount: 234, isActive: false },
  { id: '4', code: '0405', name: '校园安全', status: 'normal', eventCount: 45, isActive: false },
  { id: '5', code: '0512', name: '食品安全', status: 'normal', eventCount: 78, isActive: false },
];

const instructionOptions: InstructionOption[] = [
  { id: 'local-monitor', name: '本地动态监测', group: '本单位指令', cycle: '2小时' },
  { id: 'verify-rumor', name: '谣言核查', group: '执行单位指令', cycle: '4小时' },
  { id: 'post-disposal', name: '帖文处置', group: '执行单位指令', cycle: '6小时' },
  { id: 'delete-guidance', name: '劝删下达', group: '执行单位指令', cycle: '8小时' },
  { id: 'material-report', name: '材料反馈', group: '执行单位指令', cycle: '12小时' },
];

const areaOptions = ['淮安区', '清江浦区', '淮阴区', '洪泽区', '金湖县'];
const userOptionsByArea: Record<string, string[]> = {
  淮安区: ['张明', '刘浩宇', '陈思远'],
  清江浦区: ['王敏', '李倩'],
  淮阴区: ['刘浩宇'],
  洪泽区: ['周宁'],
  金湖县: [],
};

const issuedInstructions: IssuedInstruction[] = [
  {
    id: 'cmd-001',
    eventId: '1',
    instructionNames: ['谣言核查', '劝删下达'],
    receiverArea: '淮安区',
    receiverPost: '劝删处置岗',
    receiverUser: '张明',
    status: '处理中',
    linkStatus: '仍可访问',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 15:20:00',
    deadline: '2024-05-10 23:20:00',
    latestFeedback: '属地已签收，正在联系平台侧核验原帖状态。',
  },
  {
    id: 'cmd-002',
    eventId: '2',
    instructionNames: ['材料反馈'],
    receiverArea: '清江浦区',
    receiverPost: '材料反馈岗',
    receiverUser: '岗位待申领',
    status: '已签收',
    linkStatus: '未检测',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 15:35:00',
    deadline: '2024-05-11 03:35:00',
    latestFeedback: '岗位已接收，等待材料回传。',
  },
  {
    id: 'cmd-003',
    eventId: '3',
    instructionNames: ['帖文处置', '本地动态监测'],
    receiverArea: '淮阴区',
    receiverPost: '值班网巡岗',
    receiverUser: '刘浩宇',
    status: '已完成',
    linkStatus: '链接失效',
    issuedBy: '支队值班岗',
    issuedTime: '2024-05-10 16:05:00',
    deadline: '2024-05-10 22:05:00',
    latestFeedback: '原帖已不可访问，处置反馈已提交。',
  },
];

// 事件列表数据
const eventList: EventItem[] = [
  {
    id: '1',
    seq: 1,
    title: '淮安遭遇特大暴雨，多个路段积水严重',
    author: '淮安发布',
    platform: '微博',
    platformIcon: 'weibo',
    publishTime: '2024-05-10 14:30:00',
    content: '今日下午，淮安市遭遇特大暴雨袭击，市区多个路段出现严重积水，部分低洼地区水深超过50厘米。市防汛指挥部已启动应急响应，相关部门正在全力排水抢险。请市民注意出行安全，尽量避开积水路段。',
    images: [],
    views: 12580,
    comments: 342,
    likes: 156,
    shares: 89,
    heatLevel: 'high',
    heatValue: 98,
    isWaring: true,
    tags: ['暴雨', '积水', '防汛'],
    dataSource: '微博采集',
    sentimentIndex: 85,
    starRating: 5,
  },
  {
    id: '2',
    seq: 2,
    title: '淮安市防汛指挥部发布紧急通知',
    author: '淮安日报',
    platform: '新闻',
    platformIcon: 'news',
    publishTime: '2024-05-10 15:00:00',
    content: '针对当前严峻的防汛形势，淮安市防汛指挥部发布紧急通知，要求各级部门加强值班值守，做好应急准备。同时提醒广大市民关注天气变化，做好防范措施。',
    images: [],
    views: 8930,
    comments: 128,
    likes: 234,
    shares: 156,
    heatLevel: 'high',
    heatValue: 92,
    isWaring: false,
    tags: ['通知', '防汛'],
    dataSource: '新闻采集',
    sentimentIndex: 72,
    starRating: 4,
  },
  {
    id: '3',
    seq: 3,
    title: '网友实拍：淮安某小区地下车库进水',
    author: '市民小王',
    platform: '抖音',
    platformIcon: 'douyin',
    publishTime: '2024-05-10 15:30:00',
    content: '刚才拍的，我们小区地下车库已经开始进水了，物业正在组织业主转移车辆。希望雨快点停吧！',
    images: [],
    videoUrl: 'video1',
    views: 5670,
    comments: 456,
    likes: 89,
    shares: 234,
    heatLevel: 'medium',
    heatValue: 78,
    isWaring: true,
    tags: ['积水', '小区'],
    dataSource: '短视频采集',
    sentimentIndex: 65,
    starRating: 3,
  },
  {
    id: '4',
    seq: 4,
    title: '淮安暴雨中的暖心瞬间：交警冒雨疏导交通',
    author: '淮安交警',
    platform: '微信',
    platformIcon: 'wechat',
    publishTime: '2024-05-10 16:00:00',
    content: '暴雨中，淮安交警坚守岗位，冒雨疏导交通，帮助受困群众。向奋战在一线的交警同志致敬！',
    images: [],
    views: 3450,
    comments: 89,
    likes: 567,
    shares: 123,
    heatLevel: 'medium',
    heatValue: 65,
    isWaring: false,
    tags: ['交警', '正能量'],
    dataSource: '微信采集',
    sentimentIndex: 45,
    starRating: 2,
  },
  {
    id: '5',
    seq: 5,
    title: '淮安市气象台发布暴雨红色预警',
    author: '淮安气象',
    platform: '微博',
    platformIcon: 'weibo',
    publishTime: '2024-05-10 16:30:00',
    content: '淮安市气象台2024年5月10日16时30分发布暴雨红色预警信号：预计未来3小时我市部分地区降雨量将达100毫米以上，请注意防范。',
    images: [],
    views: 2340,
    comments: 67,
    likes: 45,
    shares: 89,
    heatLevel: 'low',
    heatValue: 45,
    isWaring: false,
    tags: ['预警', '气象'],
    dataSource: '微博采集',
    sentimentIndex: 38,
    starRating: 2,
  },
];

// ==================== 辅助函数 ====================

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

const formatTime = (timeStr: string): string => {
  const now = new Date();
  const publish = new Date(timeStr);
  const diff = now.getTime() - publish.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return timeStr.split(' ')[0];
};

const getHeatColor = (level: string): string => {
  switch (level) {
    case 'high':
      return '#ff4d4f';
    case 'medium':
      return '#faad14';
    case 'low':
      return '#52c41a';
    default:
      return '#999';
  }
};

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case '微博':
      return <span className="platform-icon-weibo">微</span>;
    case '抖音':
      return <span className="platform-icon-douyin">抖</span>;
    case '微信':
      return <span className="platform-icon-wechat">微</span>;
    case '新闻':
      return <span className="platform-icon-news">新</span>;
    default:
      return <span className="platform-icon-default">网</span>;
  }
};

// ==================== 组件 ====================

interface TaskDetailProps {
  taskId?: string;
  onBack?: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onBack }) => {
  const [activeSideTask, setActiveSideTask] = useState(taskId || '1');
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [workView, setWorkView] = useState<'pending' | 'issued'>('pending');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [instructionTargetIds, setInstructionTargetIds] = useState<string[]>([]);
  const [selectedInstructionIds, setSelectedInstructionIds] = useState<string[]>(['post-disposal']);
  const [selectedArea, setSelectedArea] = useState('淮安区');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [detailInstruction, setDetailInstruction] = useState<IssuedInstruction | null>(null);
  const [linkStatusMap, setLinkStatusMap] = useState<Record<string, IssuedInstruction['linkStatus']>>({});

  const selectedAreaUsers = userOptionsByArea[selectedArea] || [];
  const allSelected = selectedEventIds.length === eventList.length;

  // 更多操作菜单
  const moreMenuItems: MenuProps['items'] = [
    { key: 'collect', label: '收藏' },
    { key: 'report', label: '上报' },
    { key: 'share', label: '分享' },
    { key: 'delete', label: '删除', danger: true },
  ];

  const getEventById = (eventId: string) => eventList.find((event) => event.id === eventId);

  const toggleEventSelect = (eventId: string, checked: boolean) => {
    setSelectedEventIds((prev) => (
      checked ? Array.from(new Set([...prev, eventId])) : prev.filter((id) => id !== eventId)
    ));
  };

  const openInstructionModal = (eventIds: string[]) => {
    setInstructionTargetIds(eventIds);
    setInstructionModalOpen(true);
  };

  const handleInstructionSubmit = () => {
    setInstructionModalOpen(false);
    setSelectedEventIds([]);
    setWorkView('issued');
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    setSelectedUsers([]);
  };

  const handleDetectLink = (recordId: string) => {
    const current = linkStatusMap[recordId] || issuedInstructions.find((item) => item.id === recordId)?.linkStatus;
    setLinkStatusMap({
      ...linkStatusMap,
      [recordId]: current === '链接失效' ? '链接失效' : '链接失效',
    });
  };

  const getStatusClassName = (status: string) => {
    if (status === '已完成') return 'success';
    if (status === '已超时') return 'danger';
    if (status === '处理中') return 'processing';
    return 'default';
  };

  const getLinkStatusClassName = (status: string) => {
    if (status === '链接失效') return 'invalid';
    if (status === '仍可访问') return 'active';
    if (status === '无法判断' || status === '平台异常') return 'warning';
    return 'default';
  };

  // 渲染星级
  const renderStars = (rating: number) => {
    return (
      <div className="star-rating-detail">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
            {star <= rating ? <StarFilled /> : <StarOutlined />}
          </span>
        ))}
        <span className="rating-text">{rating}级</span>
      </div>
    );
  };

  // 渲染事件卡片
  const renderEventCard = (event: EventItem) => (
    <div key={event.id} className={`event-detail-card ${selectedEventIds.includes(event.id) ? 'selected' : ''}`}>
      {/* 头部信息 */}
      <div className="event-card-header">
        <div className="event-header-left">
          <Checkbox
            checked={selectedEventIds.includes(event.id)}
            onChange={(e) => toggleEventSelect(event.id, e.target.checked)}
            className="event-select-checkbox"
          />
          <span className="event-seq">{event.seq}</span>
          <h3 className="event-title">{event.title}</h3>
          {event.isWaring && (
            <Tag color="error" className="warning-tag">
              <ExclamationCircleOutlined /> 预警
            </Tag>
          )}
        </div>
        <div className="event-header-right">
          {renderStars(event.starRating)}
          <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
            <Button type="text" size="small" className="more-btn">
              <MoreOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* 作者信息 */}
      <div className="event-author-row">
        <Avatar size="small" icon={<UserOutlined />} className="author-avatar-detail" />
        <span className="author-name-detail">{event.author}</span>
        <span className="post-id">ID: 123456789</span>
        <span className="heat-num-detail" style={{ color: getHeatColor(event.heatLevel) }}>
          <BarChartOutlined /> 热度 {event.heatValue}
        </span>
        <span className="platform-detail">
          {getPlatformIcon(event.platform)} {event.platform}
        </span>
        <span className="post-time-detail">
          <ClockCircleOutlined /> {formatTime(event.publishTime)}
        </span>
      </div>

      {/* 内容 */}
      <div className="event-content">
        <p>{event.content}</p>
      </div>

      {/* 视频/图片 */}
      {event.videoUrl && (
        <div className="event-media">
          <div className="video-preview-detail">
            <CaretRightOutlined className="play-icon-detail" />
            <span className="video-duration">00:32</span>
          </div>
        </div>
      )}

      {/* AI 摘要 */}
      <div className="ai-summary-detail">
        <div className="ai-badge-detail">AI</div>
        <span className="summary-label">摘要：</span>
        <span className="summary-text">该内容涉及淮安暴雨汛情，反映市区积水情况，建议关注后续发展。</span>
      </div>

      {/* AI 研判 */}
      <div className="ai-analysis-detail">
        <div className="analysis-content-detail">
          <div className="ai-badge-detail">AI</div>
          <span className="analysis-label">研判：</span>
          <span className="analysis-text">该舆情为自然灾害类，目前呈上升趋势，建议相关部门及时发布权威信息，回应社会关切。</span>
        </div>
        <div className="sentiment-index-detail">
          <div className="index-label">舆情指数</div>
          <div className="index-value-detail">{event.sentimentIndex}</div>
          <div className="index-meter-detail" aria-hidden="true">
            <span style={{ width: `${event.sentimentIndex}%` }} />
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="event-footer">
        <div className="footer-left-detail">
          <span className="data-source-label">数据来源：</span>
          <Tag className="source-tag-detail">{event.dataSource}</Tag>
          {event.tags.map((tag) => (
            <Tag key={tag} className="info-tag-detail">{tag}</Tag>
          ))}
          <Tag className="video-tag-detail">视频</Tag>
        </div>
        <div className="footer-right-detail">
          <Button type="link" size="small" className="detail-btn">
            查看详情
          </Button>
          <Button type="primary" size="small" className="ai-btn-detail">
            AI辅助研判
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<SendOutlined />}
            className="command-btn-detail"
            onClick={() => openInstructionModal([event.id])}
          >
            下达指令
          </Button>
        </div>
      </div>
    </div>
  );

  const renderInstructionModal = () => (
    <Modal
      title="发起处置指令"
      open={instructionModalOpen}
      width={980}
      onCancel={() => setInstructionModalOpen(false)}
      onOk={handleInstructionSubmit}
      okText="确认下达"
      cancelText="取消"
      className="instruction-modal"
    >
      <div className="instruction-modal-body">
        <div className="instruction-modal-left">
          <div className="modal-field-title">
            <span className="required-mark">*</span>
            请选择要下达的指令
          </div>
          {(['本单位指令', '执行单位指令'] as const).map((group) => (
            <div key={group} className="instruction-group">
              <div className="instruction-group-title">{group}</div>
              <div className="instruction-option-grid">
                {instructionOptions.filter((item) => item.group === group).map((item) => {
                  const active = selectedInstructionIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`instruction-option ${active ? 'active' : ''}`}
                      onClick={() => setSelectedInstructionIds((prev) => (
                        active ? prev.filter((id) => id !== item.id) : [...prev, item.id]
                      ))}
                    >
                      <span>{item.name}</span>
                      <em>{item.cycle}</em>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="modal-field-title">补充指令内容</div>
          <Input.TextArea
            rows={4}
            placeholder="请输入补充指令内容，示例：请{单位名称}进行{指令名称}，并在{处理周期}前反馈处理结果。"
            className="instruction-textarea"
          />
          <div className="variable-row">
            <span>插入变量符</span>
            {['单位名称', '指令名称', '指令类型', '处理周期'].map((item) => (
              <Tag key={item} className="variable-tag">{item}</Tag>
            ))}
          </div>
          <div className="target-summary">
            本次将向 <strong>{instructionTargetIds.length || selectedEventIds.length}</strong> 条帖文下达指令
          </div>
        </div>
        <div className="instruction-modal-right">
          <div className="modal-field-title">选择执行单位与接收对象</div>
          <div className="receiver-field">
            <label>属地/部门</label>
            <Select
              value={selectedArea}
              onChange={handleAreaChange}
              options={areaOptions.map((area) => ({ value: area, label: area }))}
            />
          </div>
          <div className="receiver-field">
            <label>指定人员（可选）</label>
            <Select
              mode="multiple"
              value={selectedUsers}
              onChange={setSelectedUsers}
              placeholder={selectedAreaUsers.length ? '不指定则按指令预设岗位派发' : '当前属地暂无可选人员'}
              options={selectedAreaUsers.map((user) => ({ value: user, label: user }))}
            />
            {selectedAreaUsers.length === 0 && (
              <div className="empty-user-hint">当前属地暂无可选人员，将按指令预设岗位派发。</div>
            )}
          </div>
          <div className="receiver-preview">
            <TeamOutlined />
            <div>
              <strong>{selectedArea}</strong>
              <span>{selectedUsers.length ? `指定人员：${selectedUsers.join('、')}` : '按指令预设岗位自动派发'}</span>
              <span>{selectedUsers.length ? '直达人员，不再按预设岗位重复推送' : '由指令管理绑定的岗位账号接收'}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  const renderIssuedCard = (record: IssuedInstruction) => {
    const event = getEventById(record.eventId);
    const linkStatus = linkStatusMap[record.id] || record.linkStatus;

    if (!event) return null;

    return (
      <div key={record.id} className="issued-card">
        <div className="issued-main">
          <div className="issued-title-row">
            <h3>{event.title}</h3>
          </div>
          <div className="issued-meta-row">
            <span>{getPlatformIcon(event.platform)} {event.platform}</span>
            <span>指令：{record.instructionNames.join('、')}</span>
            <span>下达时间：{record.issuedTime}</span>
          </div>
        </div>
        <div className="issued-status-strip">
          <div className="issued-mini-stat">
            <span>链接</span>
            <strong>{record.instructionNames.includes('劝删下达') || record.instructionNames.includes('帖文处置') ? 1 : 0}</strong>
          </div>
          <Tag className={`command-status-tag ${getStatusClassName(record.status)}`}>{record.status}</Tag>
          <Tag className={`link-status-tag ${getLinkStatusClassName(linkStatus)}`}>
            <LinkOutlined /> {linkStatus}
          </Tag>
        </div>
        <div className="issued-actions">
          <Button size="small" icon={<SyncOutlined />} onClick={() => handleDetectLink(record.id)}>
            检测链接
          </Button>
          <Button size="small" type="primary" onClick={() => setDetailInstruction(record)}>
            查看进度
          </Button>
        </div>
      </div>
    );
  };

  const renderDetailDrawer = () => {
    const event = detailInstruction ? getEventById(detailInstruction.eventId) : null;
    const linkStatus = detailInstruction
      ? linkStatusMap[detailInstruction.id] || detailInstruction.linkStatus
      : '未检测';

    return (
      <Drawer
        title={(
          <div className="progress-drawer-title">
            <div className="progress-tabs">
              <span>分析研判</span>
              <span>处置过程</span>
              <span className="active">处置详情</span>
            </div>
            <Button type="primary" ghost icon={<SendOutlined />}>下达处理指令</Button>
          </div>
        )}
        width={860}
        open={!!detailInstruction}
        onClose={() => setDetailInstruction(null)}
        className="command-detail-drawer"
        footer={(
          <div className="drawer-footer-actions">
            <Button>催办</Button>
            <Button icon={<SyncOutlined />} onClick={() => detailInstruction && handleDetectLink(detailInstruction.id)}>
              检测链接
            </Button>
            <Button type="primary">标记完成</Button>
          </div>
        )}
      >
        {detailInstruction && event && (
          <>
            <div className="drawer-metric-grid">
              {[
                ['发现效率', '0秒', 'red'],
                ['研判效率', '3分12秒', 'orange'],
                ['落查耗时', '28分钟', 'green'],
                ['材料耗时', detailInstruction.status === '已完成' ? '1小时06分' : '--', 'blue'],
                ['审核耗时', '--', 'purple'],
              ].map(([label, value, tone]) => (
                <div key={label} className={`drawer-metric-card ${tone}`}>
                  <i />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="progress-timeline">
              <div className="progress-node">
                <div className="progress-time">{event.publishTime}</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一信源</span>
                    <span className="link-like">添加第一信源</span>
                  </div>
                  <div className="progress-block source-card">
                    <div>
                      <h4>{event.author}</h4>
                      <p><ClockCircleOutlined /> {event.publishTime} <span>|</span> {getPlatformIcon(event.platform)} {event.platform}</p>
                    </div>
                    <div className="source-actions">
                      <Button type="link">复制信息</Button>
                      <Button type="link">查看原文</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">{detailInstruction.issuedTime}</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一发现</span>
                    <span className="solid">来源：{detailInstruction.issuedBy}</span>
                    <span className="outline">{detailInstruction.receiverArea}</span>
                    <span className="danger">发现用时 18分钟</span>
                  </div>
                  <div className="progress-block">核报</div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">2024-05-10 15:38:35</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">第一研判</span>
                    <span className="outline">--</span>
                  </div>
                  <div className="progress-block">核报</div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">2024-05-10 15:42:00</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className="solid">指令：{detailInstruction.instructionNames.join('、')}</span>
                    <span className="solid">{detailInstruction.receiverPost}</span>
                    <span className="outline">{detailInstruction.receiverUser}</span>
                  </div>
                  <div className="progress-block instruction-block">
                    <strong>指令要求：请反馈事件发生时间、地点、经过、结果以及相关人员。</strong>
                    <div className="feedback-card">
                      <span>{detailInstruction.receiverArea}</span>
                      <span>{detailInstruction.receiverUser}</span>
                      <span>2024-05-10 16:11:29</span>
                      <span>签收</span>
                      <em className="success">接收用时 29秒</em>
                    </div>
                    <div className="feedback-card multiline">
                      <span>{detailInstruction.receiverArea}</span>
                      <span>{detailInstruction.receiverUser}</span>
                      <span>2024-05-10 16:18:00</span>
                      <span>反馈</span>
                      <em>接收用时 36分钟</em>
                      <p>{detailInstruction.latestFeedback}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="progress-node">
                <div className="progress-time">最近检测</div>
                <div className="progress-content">
                  <div className="progress-badges">
                    <span className={linkStatus === '链接失效' ? 'success-pill' : 'outline'}>链接状态：{linkStatus}</span>
                    <span className="outline">文章ID {detailInstruction.eventId.padStart(8, '0')}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    );
  };

  return (
    <div className="task-detail-page">
      {/* 左侧内容区 */}
      <div className="task-content">
        {/* 顶部导航栏 */}
        <div className="detail-top-bar">
          <div className="top-bar-left">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={onBack}
              className="back-btn"
            >
              返回
            </Button>
            <div className="task-info-breadcrumb">
              <span className="task-code-breadcrumb">{currentTask.code}</span>
              <span className="task-name-breadcrumb">{currentTask.name}</span>
              <Tag className="status-tag-breadcrumb">常态</Tag>
            </div>
          </div>
          <div className="top-bar-right">
            <div className="task-stats">
              <span className="stat-item">
                <FileTextOutlined /> 事件 {currentTask.eventCount}
              </span>
              <span className="stat-item">
                <BarChartOutlined /> 趋势
                {currentTask.trend > 0 ? (
                  <ArrowUpOutlined className="trend-up" />
                ) : currentTask.trend < 0 ? (
                  <ArrowDownOutlined className="trend-down" />
                ) : (
                  <MinusOutlined className="trend-flat" />
                )}
              </span>
            </div>
            <div className="task-keywords">
              <span className="keywords-label">关键词：</span>
              {currentTask.keywords.map((kw) => (
                <Tag key={kw} className="keyword-tag">{kw}</Tag>
              ))}
            </div>
          </div>
        </div>

        {/* 搜索筛选栏 */}
        <div className="detail-filter-bar">
          <div className="filter-search">
            <Input
              prefix={<SearchOutlined />}
              placeholder={workView === 'pending' ? '搜索事件内容' : '搜索已下达指令'}
              className="event-search-input"
            />
          </div>
          <div className="filter-actions-detail">
            {workView === 'issued' && (
              <Button icon={<SyncOutlined />}>批量检测链接</Button>
            )}
            <Button icon={<FilterOutlined />}>筛选</Button>
            <Button>排序 <DownOutlined /></Button>
            <Button>时间 <DownOutlined /></Button>
          </div>
        </div>

        <div className="work-view-switch">
          <button
            type="button"
            className={workView === 'pending' ? 'active' : ''}
            onClick={() => setWorkView('pending')}
          >
            待研判帖文
            <Badge count={eventList.length} />
          </button>
          <button
            type="button"
            className={workView === 'issued' ? 'active' : ''}
            onClick={() => setWorkView('issued')}
          >
            已下达指令
            <Badge count={issuedInstructions.length} />
          </button>
        </div>

        {/* 分类Tab */}
        {workView === 'pending' ? (
          <div className="detail-tabs-bar">
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="detail-tabs">
              <TabPane tab="全部" key="all" />
              <TabPane tab="微博" key="weibo" />
              <TabPane tab="抖音" key="douyin" />
              <TabPane tab="微信" key="wechat" />
              <TabPane tab="新闻" key="news" />
              <TabPane tab="预警" key="warning" />
            </Tabs>
            <div className="tabs-extra">
              <Checkbox
                checked={allSelected}
                indeterminate={selectedEventIds.length > 0 && !allSelected}
                onChange={(e) => setSelectedEventIds(e.target.checked ? eventList.map((event) => event.id) : [])}
              >
                全选
              </Checkbox>
              <span className="total-count">共 {eventList.length} 条</span>
            </div>
          </div>
        ) : (
          <div className="issued-summary-bar">
            <div className="issued-summary-item">
              <span>已下达</span>
              <strong>{issuedInstructions.length}</strong>
            </div>
            <div className="issued-summary-item">
              <span>处理中</span>
              <strong>1</strong>
            </div>
            <div className="issued-summary-item">
              <span>已完成</span>
              <strong>1</strong>
            </div>
            <div className="issued-summary-item">
              <span>链接失效</span>
              <strong>1</strong>
            </div>
          </div>
        )}

        {/* 事件列表 */}
        <div className="event-list-container">
          {workView === 'pending'
            ? eventList.map((event) => renderEventCard(event))
            : issuedInstructions.map((record) => renderIssuedCard(record))}
        </div>

        {workView === 'pending' && selectedEventIds.length > 0 && (
          <div className="batch-action-bar">
            <div className="batch-left">
              <Badge count={selectedEventIds.length} />
              <span>已选中 {selectedEventIds.length} 条数据</span>
              <Button type="link" onClick={() => setSelectedEventIds([])}>取消全选</Button>
            </div>
            <div className="batch-right">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => openInstructionModal(selectedEventIds)}
              >
                批量下达指令
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 右侧任务列表 */}
      <div className="task-sidebar">
        <div className="sidebar-header">
          <h3 className="sidebar-title">任务列表</h3>
          <Badge count={sideTasks.length} className="task-count-badge" />
        </div>
        <div className="sidebar-search">
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索任务"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="sidebar-search-input"
          />
        </div>
        <div className="task-list">
          {sideTasks.map((task) => (
            <div
              key={task.id}
              className={`side-task-item ${task.isActive ? 'active' : ''}`}
              onClick={() => setActiveSideTask(task.id)}
            >
              <div className="side-task-header">
                <span className="side-task-code">{task.code}</span>
                <span className="side-task-name">{task.name}</span>
              </div>
              <div className="side-task-meta">
                <Tag className={`status-tag-small ${task.status}`}>
                  {task.status === 'normal' ? '常态' : '紧急'}
                </Tag>
                <span className="event-count">
                  <FileTextOutlined /> {task.eventCount}条
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {renderInstructionModal()}
      {renderDetailDrawer()}
    </div>
  );
};

export default TaskDetail;
