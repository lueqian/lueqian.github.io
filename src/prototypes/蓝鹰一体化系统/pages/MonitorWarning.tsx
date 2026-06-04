import React, { useState, useEffect, useCallback } from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Tabs,
  Tag,
  Pagination,
  Avatar,
  Modal,
  message,
  Dropdown,
  Space,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  PlayCircleOutlined,
  FireOutlined,
  StarFilled,
  StarOutlined,
  SaveOutlined,
  EditTwoTone,
  DeleteOutlined,
  DownOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import AIAssistantDrawer from '../components/AIAssistantDrawer';

const { RangePicker } = DatePicker;

// ==================== 类型定义 ====================

interface FilterState {
  contentSearch: string;
  timeRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
  sortBy: string;
  infoStatus: string;
  sentimentLevel: string;
  sentimentType: string;
  specialTask: string;
  mediaSource: string[];
  responsibilityArea: string;
  code: string;
}

interface SavedCondition {
  id: string;
  name: string;
  filters: Partial<FilterState>;
  createTime: string;
}

interface OpinionItem {
  id: string;
  seq: number;
  title: string;
  author: string;
  authorAvatar?: string;
  postId: string;
  heat: number;
  platform: string;
  time: string;
  isHot: boolean;
  rating: number;
  aiSummary: string;
  aiAnalysis: string;
  tags: string[];
  dataSource: string;
  hasVideo: boolean;
  sentimentIndex: number;
  status: string;
  responsibilityArea?: string;
}

// ==================== 模拟数据 ====================

const mockOpinions: OpinionItem[] = [
  {
    id: '1',
    seq: 1,
    title: '反应土地征收诉求：村民集体反对征地补偿方案，要求重新评估',
    author: '东莞村民代表',
    postId: '8528778184343279',
    heat: 2586,
    platform: '抖音app',
    time: '2026-06-02 10:02:09',
    isHot: true,
    rating: 5,
    aiSummary: '东莞市某镇村民因土地征收补偿标准问题发起集体诉求，涉及约200户村民，目前处于协商阶段。',
    aiAnalysis: '【风险定性】存在村民集体维权升级为现场聚集或警民冲突的重大隐患。【核心风险要素】- 主体：被征地村民群体，人数约200户；行为：网络发声+线下串联；诉求：提高补偿标准；情绪：激动且组织化程度高。',
    tags: ['土地征收', '集体维权', '补偿纠纷'],
    dataSource: '主动发现',
    hasVideo: true,
    sentimentIndex: 82.65,
    status: '未处置',
    responsibilityArea: '东莞镇',
  },
  {
    id: '2',
    seq: 2,
    title: '今天休息来东莞人民医院做骨密度检查、真的是广东挣钱广东花',
    author: '大湾区打工人',
    postId: '1675959380050471',
    heat: 126,
    platform: '抖音app',
    time: '2026-06-02 09:58:53',
    isHot: false,
    rating: 2,
    aiSummary: '网民分享在东莞人民医院就诊体验，吐槽医疗费用较高，属个人感慨类内容。',
    aiAnalysis: '【风险定性】一般民生话题，暂无聚集性风险。【核心风险要素】- 主体：个人用户；情绪：轻微抱怨；影响范围：有限。',
    tags: ['医疗体验', '个人吐槽'],
    dataSource: '本地上报',
    hasVideo: false,
    sentimentIndex: 35.00,
    status: '已处置',
    responsibilityArea: '莞城街道',
  },
  {
    id: '3',
    seq: 3,
    title: '刚从石碣爬格时启用了，转头又进了堂亚一家小厂商试了',
    author: '石碣打工仔',
    postId: '9876543210987654',
    heat: 586,
    platform: '微信',
    time: '2026-06-02 09:45:12',
    isHot: true,
    rating: 4,
    aiSummary: '石碣镇某工厂员工反映工作环境问题，涉及劳动权益保障。',
    aiAnalysis: '【风险定性】劳动权益类舆情，存在同类问题员工跟风发声的潜在风险。【核心风险要素】- 主体：工厂员工；行为：社交媒体曝光；诉求：改善工作条件。',
    tags: ['劳动权益', '工厂环境', '热敏'],
    dataSource: '重点账号跟踪',
    hasVideo: true,
    sentimentIndex: 68.32,
    status: '处理中',
    responsibilityArea: '石碣镇',
  },
  {
    id: '4',
    seq: 4,
    title: '东莞大道与鸿福路交汇处红绿灯故障，交警执法态度恶劣',
    author: '东莞车主',
    postId: '1122334455667788',
    heat: 892,
    platform: '微博',
    time: '2026-06-02 08:30:25',
    isHot: true,
    rating: 4,
    aiSummary: '网民反映东莞大道交通信号灯故障导致拥堵，并投诉现场交警执法态度问题。',
    aiAnalysis: '【风险定性】交通执法类舆情，存在同类投诉集中爆发风险。【核心风险要素】- 主体：过往车主；行为：网络投诉+可能的现场争执；情绪：不满；涉及部门：交警部门。',
    tags: ['交通拥堵', '执法投诉', '设施故障'],
    dataSource: 'AI主动发现',
    hasVideo: true,
    sentimentIndex: 75.88,
    status: '未处置',
    responsibilityArea: '南城街道',
  },
  {
    id: '5',
    seq: 5,
    title: '长安镇某小区电梯故障频发，物业不作为业主集体维权',
    author: '长安业主联盟',
    postId: '5566778899001122',
    heat: 1523,
    platform: '抖音app',
    time: '2026-06-01 22:15:40',
    isHot: true,
    rating: 5,
    aiSummary: '长安镇某高层住宅小区电梯多次故障，业主多次反映物业未及时处理，已组织业主群维权。',
    aiAnalysis: '【风险定性】物业纠纷类聚集性舆情，存在业主集体上访或媒体曝光风险。【核心风险要素】- 主体：小区业主群体；行为：组建维权群+网络发声；诉求：更换电梯+物业整改；情绪：强烈不满。',
    tags: ['物业纠纷', '安全隐患', '集体维权'],
    dataSource: '专项巡查',
    hasVideo: true,
    sentimentIndex: 88.45,
    status: '处理中',
    responsibilityArea: '长安镇',
  },
  {
    id: '6',
    seq: 6,
    title: '松山湖景区节假日宰客严重，一碗面卖58元',
    author: '游客小王',
    postId: '3344556677889900',
    heat: 2156,
    platform: '小红书',
    time: '2026-06-01 18:45:12',
    isHot: true,
    rating: 4,
    aiSummary: '游客反映在松山湖景区遭遇高价消费，餐饮价格虚高，引发网友热议。',
    aiAnalysis: '【风险定性】旅游消费类舆情，节假日期间易引发集中投诉。【核心风险要素】- 主体：游客；行为：社交媒体曝光；影响：景区形象受损；潜在：更多游客跟帖投诉。',
    tags: ['旅游消费', '价格投诉', '景区管理'],
    dataSource: '本地舆情',
    hasVideo: true,
    sentimentIndex: 79.23,
    status: '未处置',
    responsibilityArea: '松山湖',
  },
];

// ==================== 分类Tab配置 ====================

const categoryTabs: TabsProps['items'] = [
  { key: 'all', label: '全部' },
  { key: 'district', label: '区县上报' },
  { key: 'ai-discover', label: <><span className="ai-tab-badge">AI</span>主动发现</> },
  { key: 'account-track', label: <><span className="ai-tab-badge">AI</span>重点账号跟踪</> },
  { key: 'special-patrol', label: '专项巡查' },
  { key: 'local', label: '本地舆情' },
  { key: 'key-source', label: '重点源' },
  { key: 'pending', label: '待认领舆情' },
  { key: 'local-report', label: '本地上报' },
  { key: 'notice', label: '通报信息' },
];

// ==================== 主组件 ====================

const MonitorWarning: React.FC = () => {
  // 筛选状态
  const [filters, setFilters] = useState<FilterState>({
    contentSearch: '',
    timeRange: [dayjs('2026-06-01 00:00:00'), dayjs('2026-06-02 23:59:59')],
    sortBy: 'time',
    infoStatus: 'pending',
    sentimentLevel: '',
    sentimentType: '',
    specialTask: '',
    mediaSource: [],
    responsibilityArea: '',
    code: '',
  });

  // 视图和分页状态
  const [viewMode, setViewMode] = useState<'detail' | 'analysis' | 'simple'>('detail');
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 常用条件状态
  const [savedConditions, setSavedConditions] = useState<SavedCondition[]>([
    {
      id: '1',
      name: '道滘抢劫案件',
      filters: {
        contentSearch: '东莞+抢劫',
        responsibilityArea: 'daojiao',
        infoStatus: 'pending',
      },
      createTime: '2026-06-01',
    },
    {
      id: '2',
      name: '土地征收类舆情',
      filters: {
        contentSearch: '土地征收',
        sentimentType: 'complaint',
        sentimentLevel: '5',
      },
      createTime: '2026-06-01',
    },
  ]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [conditionSearchText, setConditionSearchText] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newConditionName, setNewConditionName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 筛选后的数据
  const [filteredOpinions, setFilteredOpinions] = useState(mockOpinions);

  // 执行筛选
  const executeFilter = useCallback(() => {
    let result = [...mockOpinions];

    if (filters.contentSearch) {
      const search = filters.contentSearch.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.author.toLowerCase().includes(search) ||
        item.aiSummary.toLowerCase().includes(search)
      );
    }

    if (filters.infoStatus) {
      const statusMap: Record<string, string> = {
        pending: '未处置',
        processing: '处理中',
        completed: '已处置',
      };
      result = result.filter(item => item.status === statusMap[filters.infoStatus]);
    }

    if (filters.sentimentLevel) {
      result = result.filter(item => item.rating === parseInt(filters.sentimentLevel));
    }

    if (filters.mediaSource && filters.mediaSource.length > 0) {
      result = result.filter(item => filters.mediaSource.includes(item.platform));
    }

    if (filters.responsibilityArea) {
      const areaMap: Record<string, string> = {
        dongguan: '东莞市',
        daojiao: '道滘镇',
        liaobu: '寮步镇',
        qiaotou: '桥头镇',
        changan: '长安镇',
        songshan: '松山湖',
      };
      const areaName = areaMap[filters.responsibilityArea];
      if (areaName) {
        result = result.filter(item => item.responsibilityArea?.includes(areaName.replace('市', '').replace('镇', '').replace('街道', '')));
      }
    }

    // 排序
    if (filters.sortBy === 'time') {
      result.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    } else if (filters.sortBy === 'heat') {
      result.sort((a, b) => b.heat - a.heat);
    } else if (filters.sortBy === 'sentiment') {
      result.sort((a, b) => b.sentimentIndex - a.sentimentIndex);
    }

    setFilteredOpinions(result);
    setCurrentPage(1);
  }, [filters]);

  // 初始加载执行一次筛选
  useEffect(() => {
    executeFilter();
  }, [executeFilter]);

  // 保存为常用条件
  const handleSaveCondition = () => {
    if (!newConditionName.trim()) {
      message.warning('请输入条件名称');
      return;
    }

    const newCondition: SavedCondition = {
      id: Date.now().toString(),
      name: newConditionName.trim(),
      filters: { ...filters },
      createTime: dayjs().format('YYYY-MM-DD'),
    };

    setSavedConditions(prev => [...prev, newCondition]);
    message.success('常用条件新增成功');
    setIsSaveModalOpen(false);
    setNewConditionName('');
    // 不清空当前筛选内容（按需求）
  };

  // 应用常用条件
  const handleApplyCondition = (conditionId: string) => {
    const condition = savedConditions.find(c => c.id === conditionId);
    if (!condition) return;

    // 容错处理：只应用存在的字段
    setFilters(prev => ({
      ...prev,
      ...condition.filters,
      // 确保时间范围正确转换
      timeRange: condition.filters.timeRange || prev.timeRange,
    }));

    setSelectedCondition(conditionId);
    message.success(`已应用常用条件：${condition.name}`);
    // 自动触发筛选
    setTimeout(() => executeFilter(), 0);
  };

  // 删除常用条件
  const handleDeleteCondition = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedConditions(prev => prev.filter(c => c.id !== id));
    if (selectedCondition === id) {
      setSelectedCondition('');
    }
    message.success('常用条件已删除');
  };

  // 开始编辑
  const handleStartEdit = (e: React.MouseEvent, condition: SavedCondition) => {
    e.stopPropagation();
    setEditingId(condition.id);
    setEditingName(condition.name);
  };

  // 保存编辑
  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingName.trim()) {
      message.warning('名称不能为空');
      return;
    }
    setSavedConditions(prev => prev.map(c =>
      c.id === editingId ? { ...c, name: editingName.trim() } : c
    ));
    setEditingId(null);
    setEditingName('');
    message.success('名称已修改');
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      contentSearch: '',
      timeRange: [dayjs('2026-06-01 00:00:00'), dayjs('2026-06-02 23:59:59')],
      sortBy: 'time',
      infoStatus: 'pending',
      sentimentLevel: '',
      sentimentType: '',
      specialTask: '',
      mediaSource: [],
      responsibilityArea: '',
      code: '',
    });
    setSelectedCondition('');
    setTimeout(() => executeFilter(), 0);
  };

  // AI Drawer 状态
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState<OpinionItem | null>(null);

  // 打开 AI 助手
  const handleOpenAIAssistant = (item: OpinionItem) => {
    setSelectedOpinion(item);
    setAiDrawerVisible(true);
  };

  // 关闭 AI 助手
  const handleCloseAIAssistant = () => {
    setAiDrawerVisible(false);
    setSelectedOpinion(null);
  };

  // 渲染星级
  const renderStars = (rating: number) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>
          {star <= rating ? <StarFilled /> : <StarOutlined />}
        </span>
      ))}
      <span className="rating-text">{rating}星</span>
    </div>
  );

  // 常用条件下拉选项
  const filteredConditions = savedConditions.filter(c =>
    c.name.toLowerCase().includes(conditionSearchText.toLowerCase())
  );

  // 自定义下拉菜单内容
  const conditionDropdownContent = (
    <div className="condition-dropdown-panel">
      <div className="condition-search-header">
        <Input
          placeholder="搜索常用条件"
          value={conditionSearchText}
          onChange={e => setConditionSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          size="small"
          className="condition-search-input"
        />
      </div>
      <div className="condition-list">
        {filteredConditions.length === 0 ? (
          <div className="condition-empty">暂无匹配条件</div>
        ) : (
          filteredConditions.map(condition => (
            <div
              key={condition.id}
              className={`condition-item ${selectedCondition === condition.id ? 'selected' : ''}`}
              onClick={() => handleApplyCondition(condition.id)}
            >
              {editingId === condition.id ? (
                <div className="condition-edit-row" onClick={e => e.stopPropagation()}>
                  <Input
                    size="small"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    autoFocus
                    onPressEnter={e => handleSaveEdit(e as any)}
                  />
                  <Button size="small" type="primary" onClick={handleSaveEdit}>保存</Button>
                </div>
              ) : (
                <>
                  <span className="condition-name">{condition.name}</span>
                  <div className="condition-actions">
                    <EditTwoTone
                      className="condition-action-icon"
                      onClick={e => handleStartEdit(e, condition)}
                    />
                    <DeleteOutlined
                      className="condition-action-icon delete"
                      onClick={e => handleDeleteCondition(e, condition.id)}
                    />
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 渲染舆情卡片
  const renderOpinionCard = (item: OpinionItem) => (
    <div key={item.id} className="opinion-card">
      <div className="card-header-row">
        <div className="header-left">
          <span className="seq-num">{item.seq}</span>
          <h4 className="opinion-title">
            {item.title}
            {item.isHot && (
              <Tag color="error" className="hot-tag">
                <FireOutlined /> 热敏
              </Tag>
            )}
          </h4>
        </div>
        <div className="header-right">
          {renderStars(item.rating)}
        </div>
      </div>

      <div className="author-row">
        <Avatar size="small" className="author-avatar">
          {item.author.charAt(0)}
        </Avatar>
        <span className="author-name">{item.author}</span>
        <span className="post-id">ID {item.postId}</span>
        <span className="heat-num">🔥 {item.heat}</span>
        <span className="platform">
          <span className="platform-icon">🎵</span>
          {item.platform}
        </span>
        <span className="post-time">⏱ {item.time}</span>
      </div>

      <div className="ai-summary-row">
        <span className="ai-badge">AI</span>
        <span className="summary-label">摘要</span>
        <span className="summary-text">{item.aiSummary}</span>
      </div>

      <div className="ai-analysis-row">
        <span className="ai-badge">AI</span>
        <span className="analysis-label">研判</span>
        <span className="analysis-text">{item.aiAnalysis}</span>
      </div>

      <div className="card-footer-row">
        <div className="footer-left">
          <span className="data-source-label">数据来源：</span>
          <Tag color="processing" className="source-tag">{item.dataSource}</Tag>
          {item.tags.map((tag, idx) => (
            <Tag key={idx} className="info-tag">{tag}</Tag>
          ))}
          {!item.hasVideo && <Tag className="video-tag">未上传视频</Tag>}
        </div>
        <div className="footer-right">
          <Button size="small" className="status-btn">{item.status}</Button>
          <Button size="small" type="link" className="detail-btn">信息详情</Button>
          <Button
            size="small"
            className="ai-assistant-btn"
            icon={<RobotOutlined />}
            onClick={() => handleOpenAIAssistant(item)}
          >
            AI 智能助手
          </Button>
        </div>
      </div>

      <div className="sentiment-index">
        <div className="video-preview">
          <PlayCircleOutlined className="play-icon" />
        </div>
        <div className="index-value">{item.sentimentIndex}</div>
        <div className="index-label">舆情指数</div>
      </div>
    </div>
  );

  return (
    <div className="monitor-warning-page">
      {/* 筛选区域 */}
      <div className="filter-section">
        {/* 常用条件操作区 */}
        <div className="saved-condition-bar">
          <span className="saved-condition-label">常用条件：</span>
          <Dropdown
            dropdownRender={() => conditionDropdownContent}
            trigger={['click']}
            placement="bottomLeft"
          >
            <Button className="condition-select-btn">
              {selectedCondition
                ? savedConditions.find(c => c.id === selectedCondition)?.name
                : '请选择常用条件'}
              <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            icon={<SaveOutlined />}
            className="save-condition-btn"
            onClick={() => setIsSaveModalOpen(true)}
          >
            保存为常用条件
          </Button>
        </div>

        {/* 第1行 */}
        <div className="filter-row">
          <div className="filter-item">
            <span className="filter-label">内容搜索</span>
            <Input
              placeholder="可输入标题/正文/作者"
              prefix={<SearchOutlined />}
              className="search-input"
              value={filters.contentSearch}
              onChange={e => setFilters({ ...filters, contentSearch: e.target.value })}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">发布时间</span>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={filters.timeRange as any}
              onChange={val => setFilters({ ...filters, timeRange: val as any })}
              className="date-picker"
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">排序方式</span>
            <Select
              value={filters.sortBy}
              onChange={val => setFilters({ ...filters, sortBy: val })}
              className="sort-select"
              options={[
                { label: '发布时间降序', value: 'time' },
                { label: '热度降序', value: 'heat' },
                { label: '舆情指数降序', value: 'sentiment' },
              ]}
            />
          </div>
        </div>

        {/* 第2行 */}
        <div className="filter-row">
          <div className="filter-item">
            <span className="filter-label">信息状态</span>
            <Select
              value={filters.infoStatus}
              onChange={val => setFilters({ ...filters, infoStatus: val })}
              className="status-select"
              options={[
                { label: '未处置', value: 'pending' },
                { label: '处理中', value: 'processing' },
                { label: '已处置', value: 'completed' },
              ]}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">舆情等级</span>
            <Select
              placeholder="请选择"
              value={filters.sentimentLevel || undefined}
              onChange={val => setFilters({ ...filters, sentimentLevel: val })}
              className="level-select"
              allowClear
              options={[
                { label: '1星', value: '1' },
                { label: '2星', value: '2' },
                { label: '3星', value: '3' },
                { label: '4星', value: '4' },
                { label: '5星', value: '5' },
              ]}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">舆情类型</span>
            <Select
              placeholder="请选择"
              value={filters.sentimentType || undefined}
              onChange={val => setFilters({ ...filters, sentimentType: val })}
              className="type-select"
              allowClear
              options={[
                { label: '突发事件', value: 'emergency' },
                { label: '投诉维权', value: 'complaint' },
                { label: '政策相关', value: 'policy' },
              ]}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">专项任务</span>
            <Select
              placeholder="请选择"
              value={filters.specialTask || undefined}
              onChange={val => setFilters({ ...filters, specialTask: val })}
              className="task-select"
              allowClear
              options={[
                { label: '端午安保', value: 'duanwu' },
                { label: '高考保障', value: 'gaokao' },
                { label: '防汛防台', value: 'flood' },
              ]}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">信源</span>
            <Select
              mode="multiple"
              placeholder="请选择平台"
              value={filters.mediaSource}
              onChange={val => setFilters({ ...filters, mediaSource: val })}
              className="media-source-select"
              allowClear
              maxTagCount="responsive"
              options={[
                { label: '抖音', value: '抖音app' },
                { label: '微信', value: '微信' },
                { label: '微博', value: '微博' },
                { label: '小红书', value: '小红书' },
                { label: '快手', value: '快手' },
                { label: 'B站', value: 'B站' },
                { label: '今日头条', value: '今日头条' },
                { label: '百度贴吧', value: '百度贴吧' },
                { label: '知乎', value: '知乎' },
              ]}
            />
          </div>
        </div>

        {/* 第3行 */}
        <div className="filter-row">
          <div className="filter-item">
            <span className="filter-label">责任属地</span>
            <Select
              placeholder="请选择"
              value={filters.responsibilityArea || undefined}
              onChange={val => setFilters({ ...filters, responsibilityArea: val })}
              className="area-select"
              allowClear
              options={[
                { label: '东莞市', value: 'dongguan' },
                { label: '道滘镇', value: 'daojiao' },
                { label: '寮步镇', value: 'liaobu' },
                { label: '桥头镇', value: 'qiaotou' },
                { label: '长安镇', value: 'changan' },
                { label: '松山湖', value: 'songshan' },
              ]}
            />
          </div>
          <div className="filter-item">
            <span className="filter-label">编号</span>
            <Input
              placeholder="请输入编号"
              className="code-input"
              value={filters.code}
              onChange={e => setFilters({ ...filters, code: e.target.value })}
            />
          </div>
          <div className="filter-actions">
            <div className="view-switch">
              <Button
                size="small"
                className={viewMode === 'detail' ? 'active' : ''}
                onClick={() => setViewMode('detail')}
              >
                详细视图
              </Button>
              <Button
                size="small"
                className={viewMode === 'analysis' ? 'active' : ''}
                onClick={() => setViewMode('analysis')}
              >
                研判视图
              </Button>
              <Button
                size="small"
                className={viewMode === 'simple' ? 'active' : ''}
                onClick={() => setViewMode('simple')}
              >
                简要视图
              </Button>
            </div>
            <Button icon={<ReloadOutlined />} onClick={handleReset} className="reset-btn">
              重置
            </Button>
            <Button type="primary" onClick={executeFilter} className="query-btn">
              查询
            </Button>
          </div>
        </div>
      </div>

      {/* 分类Tab栏 */}
      <div className="category-tabs-section">
        <Tabs
          activeKey={activeCategory}
          onChange={setActiveCategory}
          items={categoryTabs}
          className="category-tabs"
        />
      </div>

      {/* 列表区域 */}
      <div className="opinion-list-section">
        {filteredOpinions.map(renderOpinionCard)}
      </div>

      {/* 底部分页 */}
      <div className="pagination-section">
        <Button className="export-btn">导出数据</Button>
        <div className="pagination-info">
          <span className="total-text">共 {filteredOpinions.length} 条</span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredOpinions.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </div>

      {/* 保存条件弹窗 */}
      <Modal
        title="新增常用条件"
        open={isSaveModalOpen}
        onOk={handleSaveCondition}
        onCancel={() => {
          setIsSaveModalOpen(false);
          setNewConditionName('');
        }}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ marginBottom: 8, color: '#666' }}>条件组合名称</div>
          <Input
            placeholder="请输入常用条件名称"
            value={newConditionName}
            onChange={e => setNewConditionName(e.target.value)}
            onPressEnter={handleSaveCondition}
          />
        </div>
      </Modal>

      {/* AI 智能助手 Drawer */}
      <AIAssistantDrawer
        visible={aiDrawerVisible}
        opinion={selectedOpinion}
        onClose={handleCloseAIAssistant}
      />
    </div>
  );
};

export default MonitorWarning;
