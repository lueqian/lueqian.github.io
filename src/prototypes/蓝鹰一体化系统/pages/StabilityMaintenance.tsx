import React, { useState } from 'react';
import {
  Card,
  Input,
  InputNumber,
  Select,
  Table,
  Tag,
  Button,
  Tabs,
  Space,
  Avatar,
  Divider,
  message,
  Timeline,
  Row,
  Col,
  Drawer,
  Descriptions,
  Badge,
  Tooltip,
  Breadcrumb,
  Progress,
  Modal,
  Form,
  Checkbox,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  WechatOutlined,
  QqOutlined,
  ReloadOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  WarningOutlined,
  IdcardOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PartitionOutlined,
  CheckCircleOutlined,
  LineChartOutlined,
  BookOutlined,
  SendOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FileAddOutlined,
  CheckOutlined,
  UserAddOutlined,
  TeamOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { PersonItem } from './PeopleDatabase';

// ==================== 数据结构与 Mock 数据 ====================

// 稳情标签接口
interface StabilityTagItem {
  key: string;
  name: string;
  type: string; // 事件/标签关联群体类型
  dynamicCount: number;
  peopleCount: number;
  groupCount: number;
  updateTime: string;
  visibleDepartments?: string[];
}

// 动态流接口
interface DynamicPostItem {
  id: string;
  title: string;
  publishTime: string;
  author: string;
  content: string;
}

// 重点涉稳人员接口
interface StabilityPersonItem {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  registeredAddress: string;
  residentAddress: string;
  mentionedCount: number;
  tags: string[];
  riskLevel: 'high' | 'medium' | 'low';
  groups?: string[];
  gender?: string;
  age?: number;
  nation?: string;
  birthday?: string;
  note?: string;
  role?: '群主' | '管理员' | '群成员';
}

// 关联群组接口
interface CollatedGroupItem {
  id: string;
  name: string;
  platform: 'wechat' | 'qq' | 'other';
  memberCount: number;
  mentionedCount: number;
  latestDynamic: string;
}

// 默认稳情标签全局列表
const mockTagsList: StabilityTagItem[] = [
  {
    key: 'tag_001',
    name: '中农曼度公寓业主维权',
    type: '业主维权',
    dynamicCount: 24,
    peopleCount: 18,
    groupCount: 4,
    updateTime: '2026-07-08 16:30',
    visibleDepartments: ['网安支队', '天河分局'],
  },
  {
    key: 'tag_002',
    name: '棠下外资骑手劳资纠纷',
    type: '外卖群体',
    dynamicCount: 15,
    peopleCount: 12,
    groupCount: 3,
    updateTime: '2026-07-08 15:40',
    visibleDepartments: ['网安支队', '黄埔分局'],
  },
  {
    key: 'tag_003',
    name: '越秀越洋货运物流代理纠纷',
    type: '货运群体',
    dynamicCount: 9,
    peopleCount: 6,
    groupCount: 2,
    updateTime: '2026-07-07 10:20',
    visibleDepartments: ['越秀分局'],
  },
  {
    key: 'tag_004',
    name: '白云出租车行业价格调整诉求',
    type: '出租车群体',
    dynamicCount: 32,
    peopleCount: 25,
    groupCount: 6,
    updateTime: '2026-07-08 14:15',
    visibleDepartments: ['白云分局', '交警支队'],
  },
];

// 针对 “中农曼度公寓业主维权” 标签下的动态 Mock 数据
const mockDynamics: DynamicPostItem[] = [
  {
    id: 'dyn_001',
    title: '中农曼度公寓业主策划22日早上到曼度讨要租金',
    publishTime: '2026-05-21 19:22',
    author: '支队-张三',
    content: `中农曼度公寓业主策划22日早上到曼度讨要租金
5月21日19时22分，淮阴区袁志梅，在微信群“公寓曼度下午群”（群成员：136人）内发言称，没收到房租费的人一起去要。清江浦区徐素红回复到，约好了，我也去。赵君茂回应称，明天早上去。

人员身份：
1、袁志梅，身份证：320821********7108，户籍地：淮阴区盐河东街232号，手机号：177****2556；
2、徐素红，身份证：320821********350X，户籍地：清江浦区和平路9号越河小区8号楼甲单元304室，手机号：139****8730；
3、赵君茂，身份证：320821********2316，户籍地：淮阴区淮高镇长兴村候赵庄30号，手机号：130****8768。`,
  },
  {
    id: 'dyn_002',
    title: '中农曼度公寓业主徐素红在群内召集业主代表开会',
    publishTime: '2026-05-21 15:10',
    author: '支队-李四',
    content: `中农曼度公寓业主徐素红在群内召集业主代表开会
5月21日15时10分，网警巡查发现，中农曼度业主代表徐素红在微信群“公寓曼度下午群”中发布集结倡议，通知核心维权代表于今晚8点进行闭门线上会议，商讨后续集体讨薪细节，赵君茂已表态积极响应。

人员身份：
1、徐素红，身份证：320821********350X，户籍地：清江浦区和平路9号越河小区8号楼甲单元304室，手机号：139****8730；
2、赵君茂，身份证：320821********2316，户籍地：淮阴区淮高镇长兴村候赵庄30号，手机号：130****8768。`,
  },
  {
    id: 'dyn_003',
    title: '中农曼度业主赵君茂在社媒发文称已被开发商拖欠数月租金',
    publishTime: '2026-05-20 11:35',
    author: '支队-王五',
    content: `中农曼度业主赵君茂在社媒发文称已被开发商拖欠数月租金
5月20日11时35分，中农曼度公寓业主赵君茂在社交平台公开发帖抗议开发商恶意延期并截留租金。内容声称“中农曼度公寓多月未支付给业主收益，数百业主面临资金断供危机，将采取过激方式讨要权益”，引发大量业主评论，属于高度敏感涉稳信息。

人员身份：
1、赵君茂，身份证：320821********2316，户籍地：淮阴区淮高镇长兴村候赵庄30号，手机号：130****8768。`,
  },
  {
    id: 'dyn_004',
    title: '中农曼度群内流传关于维权横幅标语的讨论',
    publishTime: '2026-05-19 09:12',
    author: '支队-赵六',
    content: `中农曼度群内流传关于维权横幅标语的讨论
5月19日09时12分，微信群监测到业主代表袁志梅发起了一场横幅标语的线上投票，内容多涉及维权、赔偿等煽动性字句，群内讨论频繁，呼吁于周末组织现场展示。

人员身份：
1、袁志梅，身份证：320821********7108，户籍地：淮阴区盐河东街232号，手机号：177****2556。`,
  }
];

// 针对 “中农曼度公寓业主维权” 标签下的涉稳人员 Mock 数据
const mockPeople: StabilityPersonItem[] = [
  {
    id: 'PERSON_MAN_001',
    name: '袁志梅',
    idCard: '320821198205057108',
    phone: '17700222556',
    registeredAddress: '江苏省淮安市清江浦区淮海北路120号',
    residentAddress: '广州市天河区中农曼度公寓8栋1502房',
    mentionedCount: 15,
    tags: ['群主', '核心组织者', '高风险'],
    riskLevel: 'high',
    groups: ['公寓曼度下午群', '中农曼度业主维权筹备群', '业主代表决策群', '曼度周边联络群'],
  },
  {
    id: 'PERSON_MAN_002',
    name: '徐素红',
    idCard: '320821197808086502',
    phone: '13911223344',
    registeredAddress: '江苏省淮安市涟水县红日路56号',
    residentAddress: '广州市天河区中农曼度公寓3栋602房',
    mentionedCount: 9,
    tags: ['活跃发声者', '业主代表', '中风险'],
    riskLevel: 'medium',
    groups: ['公寓曼度下午群', '中农曼度业主维权筹备群'],
  },
  {
    id: 'PERSON_MAN_003',
    name: '赵君茂',
    idCard: '320821198504044309',
    phone: '15822334455',
    registeredAddress: '江苏省扬州市广陵区东关街18号',
    residentAddress: '广州市海珠区丽影广场2座803房',
    mentionedCount: 5,
    tags: ['积极响应者', '普通业主', '低风险'],
    riskLevel: 'low',
    groups: ['公寓曼度下午群'],
  },
];

// 针对 “中农曼度公寓业主维权” 标签下的关联群聊 Mock 数据
const mockGroups: CollatedGroupItem[] = [
  {
    id: 'GROUP_MAN_001',
    name: '公寓曼度下午群',
    platform: 'wechat',
    memberCount: 136,
    mentionedCount: 22,
    latestDynamic: '中农曼度公寓业主策划22日早上到曼度讨要租金',
  },
  {
    id: 'GROUP_MAN_002',
    name: '中农曼度业主维权筹备群',
    platform: 'qq',
    memberCount: 240,
    mentionedCount: 14,
    latestDynamic: '中农曼度公寓业主徐素红在群内召集业主代表开会',
  },
  {
    id: 'GROUP_MAN_003',
    name: '曼度业主同城支援总群',
    platform: 'wechat',
    memberCount: 312,
    mentionedCount: 6,
    latestDynamic: '中农曼度业主赵君茂在社媒发文称已被开发商拖欠数月租金',
  },
];

const StabilityMaintenance: React.FC = () => {
  // 页面导航控制: 'list' (主列表) | 'detail' (详情控制台)
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [tagsList, setTagsList] = useState<StabilityTagItem[]>(mockTagsList);
  
  // 统计指标计算
  const totalEvents = tagsList.length;
  const totalDynamics = tagsList.reduce((sum, tag) => sum + tag.dynamicCount, 0);
  const totalPeople = tagsList.reduce((sum, tag) => sum + tag.peopleCount, 0);
  const totalGroups = tagsList.reduce((sum, tag) => sum + tag.groupCount, 0);
  const [selectedTag, setSelectedTag] = useState<StabilityTagItem>(mockTagsList[0]);
  
  // 筛选与检索过滤
  const [searchText, setSearchText] = useState('');
  const [filterTags, setFilterTags] = useState(mockTagsList);

  // 映射关系以支持事件级数据隔离
  const [dynamicsMap, setDynamicsMap] = useState<Record<string, DynamicPostItem[]>>({
    'tag_001': mockDynamics,
    'tag_002': [],
    'tag_003': [],
    'tag_004': [],
  });
  const [peopleMap, setPeopleMap] = useState<Record<string, StabilityPersonItem[]>>({
    'tag_001': mockPeople,
    'tag_002': [],
    'tag_003': [],
    'tag_004': [],
  });
  const [groupsMap, setGroupsMap] = useState<Record<string, CollatedGroupItem[]>>({
    'tag_001': mockGroups,
    'tag_002': [],
    'tag_003': [],
    'tag_004': [],
  });

  // 抽屉控制 - 动态流正文抽屉
  const [dynamicDrawerOpen, setDynamicDrawerOpen] = useState(false);
  const [selectedDynamic, setSelectedDynamic] = useState<DynamicPostItem | null>(null);

  // 抽屉控制 - 网民融合特征画像 Drawer (双层叠开)
  const [personDrawerOpen, setPersonDrawerOpen] = useState(false);
  const [activePerson, setActivePerson] = useState<PersonItem | null>(null);

  // 抽屉控制 - 群组详情抽屉 Drawer
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<CollatedGroupItem | null>(null);

  // 物理存证存根弹窗
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const [evidenceText, setEvidenceText] = useState('');

  // 重点人员基本信息编辑状态
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [editedPersonFields, setEditedPersonFields] = useState<any>({});

  // 弹窗可见性
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [addDynamicModalOpen, setAddDynamicModalOpen] = useState(false);

  // “添加动态” 锁定当前标签的引用
  const [lockedTagKey, setLockedTagKey] = useState<string | null>(null);

  // 智能提取状态
  const [parsedInfo, setParsedInfo] = useState<{
    groups: any[];
    people: any[];
  } | null>(null);
  const [selectedParsedGroups, setSelectedParsedGroups] = useState<string[]>([]);
  const [selectedParsedPeople, setSelectedParsedPeople] = useState<string[]>([]);

  // 弹窗表单实例
  const [formAddEvent] = Form.useForm();
  const [formAddDynamic] = Form.useForm();

  // 网民人员库同步与导出状态
  const [syncedPeople, setSyncedPeople] = useState<string[]>(['PERSON_MAN_001', 'PERSON_MAN_002']);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // 详情页人员 Tab 搜索状态
  const [peopleSearchName, setPeopleSearchName] = useState('');
  const [peopleSearchAddress, setPeopleSearchAddress] = useState('');

  // 详情页人员 Tab 过滤列表获取
  const getFilteredPeopleList = () => {
    const list = peopleMap[selectedTag.key] || [];
    return list.filter(p => {
      const matchName = !peopleSearchName.trim() || p.name.toLowerCase().includes(peopleSearchName.toLowerCase().trim());
      const matchAddress = !peopleSearchAddress.trim() || (p.registeredAddress && p.registeredAddress.toLowerCase().includes(peopleSearchAddress.toLowerCase().trim()));
      return matchName && matchAddress;
    });
  };

  // 稳情库首页部门筛选状态
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | undefined>(undefined);

  // 监听数据变动，自动同步过滤
  React.useEffect(() => {
    let filtered = tagsList;

    if (searchText.trim()) {
      const searchVal = searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchVal) ||
          (t.type && t.type.toLowerCase().includes(searchVal))
      );
    }

    if (selectedDeptFilter) {
      filtered = filtered.filter(
        (t) => t.visibleDepartments && t.visibleDepartments.includes(selectedDeptFilter)
      );
    }

    setFilterTags(filtered);
  }, [tagsList, searchText, selectedDeptFilter]);

  // 搜索处理
  const handleSearch = (val: string) => {
    setSearchText(val);
  };

  // 进入详情控制台
  const handleEnterDetail = (tagRecord: StabilityTagItem) => {
    setSelectedTag(tagRecord);
    setCurrentView('detail');
  };

  // 物理数据穿透并组装重点网民特征融合画像
  const handleOpenPersonDrawer = (sPerson: StabilityPersonItem) => {
    const curDynamics = dynamicsMap[selectedTag.key] || [];
    // 将涉稳人员数据转换并丰富为 PersonItem 画像格式
    const fullPerson: PersonItem = {
      id: sPerson.id,
      name: sPerson.name,
      gender: sPerson.gender || '女',
      age: sPerson.age || 38,
      nation: sPerson.nation || '汉族',
      birthday: sPerson.birthday || '1982-05-05',
      idCard: sPerson.idCard,
      phone: sPerson.phone,
      residentAddress: sPerson.residentAddress,
      registeredAddress: sPerson.registeredAddress,
      type: '核心涉稳人员',
      riskLevel: sPerson.riskLevel,
      tags: [...sPerson.tags, selectedTag.name],
      socialAccounts: [
        { platform: 'wechat', username: sPerson.name, id: `wx_${sPerson.phone}`, followers: '280', url: '#', status: 'monitored' }
      ],
      department: '天河分局',
      status: 'monitored',
      lastActive: '2026-07-08 16:30',
      incidentCount: curDynamics.length,
      recordList: curDynamics.map((d) => ({
        id: d.id,
        content: d.content,
        publishTime: d.publishTime,
        platform: 'wechat',
        author: sPerson.name,
        authorId: `wx_${sPerson.phone}`,
        reposts: 0,
        comments: 2,
        likes: 5
      })),
      note: sPerson.note || `已抽取为稳情库事件【${selectedTag.name}】的重点人员，在微信群及社交媒体上有高频维权发言，倾向突出。`,
      source: 'stability',
      peopleType: 'normal',
      groupTag: selectedTag.name,
    };

    setActivePerson(fullPerson);
    setEditedPersonFields({
      gender: fullPerson.gender,
      age: fullPerson.age,
      nation: fullPerson.nation,
      idCard: fullPerson.idCard,
      phone: fullPerson.phone,
      birthday: fullPerson.birthday,
      residentAddress: fullPerson.residentAddress,
      registeredAddress: fullPerson.registeredAddress,
      note: fullPerson.note
    });
    setIsEditingPerson(false);
    setPersonDrawerOpen(true);
  };

  // 保存重点网民基本信息编辑
  const handleSavePersonEdit = () => {
    if (!activePerson) return;
    setPeopleMap((prev) => {
      const currentList = prev[selectedTag.key] || [];
      const updatedList = currentList.map((p) => {
        if (p.id === activePerson.id) {
          return {
            ...p,
            gender: editedPersonFields.gender,
            age: editedPersonFields.age,
            nation: editedPersonFields.nation,
            idCard: editedPersonFields.idCard,
            phone: editedPersonFields.phone,
            birthday: editedPersonFields.birthday,
            residentAddress: editedPersonFields.residentAddress,
            registeredAddress: editedPersonFields.registeredAddress,
            note: editedPersonFields.note
          };
        }
        return p;
      });
      return { ...prev, [selectedTag.key]: updatedList };
    });

    // 同时更新 activePerson 使 UI 界面立即显示最新编辑成果
    setActivePerson((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...editedPersonFields
      };
    });

    setIsEditingPerson(false);
    message.success('重点网民基本信息已成功更新！');
  };

  // 打开群组抽屉
  const handleOpenGroupDrawer = (gRecord: CollatedGroupItem) => {
    setActiveGroup(gRecord);
    setGroupDrawerOpen(true);
  };

  // 新增事件/标签提交
  const handleAddEventSubmit = () => {
    formAddEvent.validateFields().then((values) => {
      const newKey = `tag_${Date.now()}`;
      const newEvent: StabilityTagItem = {
        key: newKey,
        name: values.name,
        type: values.type,
        dynamicCount: 0,
        peopleCount: 0,
        groupCount: 0,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        visibleDepartments: values.visibleDepartments || ['网安支队'],
      };

      // 初始化隔离的关联容器映射
      setDynamicsMap((prev) => ({ ...prev, [newKey]: [] }));
      setPeopleMap((prev) => ({ ...prev, [newKey]: [] }));
      setGroupsMap((prev) => ({ ...prev, [newKey]: [] }));

      setTagsList((prev) => [newEvent, ...prev]);
      message.success(`成功创建稳情事件【${values.name}】！`);
      setAddEventModalOpen(false);
      formAddEvent.resetFields();
    });
  };

  // 更新提取出的群聊字段
  const handleUpdateParsedGroup = (index: number, field: string, value: any) => {
    setParsedInfo(prev => {
      if (!prev) return prev;
      const nextGroups = [...prev.groups];
      nextGroups[index] = { ...nextGroups[index], [field]: value };
      return { ...prev, groups: nextGroups };
    });
  };

  // 更新提取出的网民字段
  const handleUpdateParsedPerson = (index: number, field: string, value: any) => {
    setParsedInfo(prev => {
      if (!prev) return prev;
      const nextPeople = [...prev.people];
      nextPeople[index] = { ...nextPeople[index], [field]: value };
      return { ...prev, people: nextPeople };
    });
  };

  // 手动补充未提取到的涉稳人员
  const handleAddParsedPerson = () => {
    const newTempId = `p_manual_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setParsedInfo(prev => {
      const newPerson = {
        tempId: newTempId,
        name: '',
        idCard: '',
        phone: '',
        registeredAddress: '',
        role: '群成员' as const,
        note: ''
      };
      const nextPeople = prev ? [...prev.people, newPerson] : [newPerson];
      return {
        groups: prev ? prev.groups : [],
        people: nextPeople
      };
    });
    // 默认将其勾选
    setSelectedParsedPeople(prev => [...prev, newTempId]);
  };

  // 手动补充未提取到的群聊
  const handleAddParsedGroup = () => {
    const newTempId = `g_manual_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setParsedInfo(prev => {
      const newGroup = {
        tempId: newTempId,
        name: '',
        platform: 'wechat' as const,
        memberCount: 100
      };
      const nextGroups = prev ? [...prev.groups, newGroup] : [newGroup];
      return {
        groups: nextGroups,
        people: prev ? prev.people : []
      };
    });
    // 默认将其勾选
    setSelectedParsedGroups(prev => [...prev, newTempId]);
  };

  // 一键提取动态中的微信/QQ群聊以及涉案网民身份信息
  const handleExtractDynamic = () => {
    const content = formAddDynamic.getFieldValue('content');
    if (!content) {
      message.warning('请先输入动态正文内容再提取！');
      return;
    }
    
    // 自动提取首句作为动态标题（若当前标题为空）
    const lines = content.split('\n').map((l: string) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const firstLine = lines[0];
      const currentTitle = formAddDynamic.getFieldValue('title');
      if (!currentTitle) {
        formAddDynamic.setFieldsValue({ title: firstLine });
        message.info(`已自动提取内容首句为动态标题："${firstLine}"`);
      }
    }
    
    const extractedGroups: any[] = [];
    const extractedPeople: any[] = [];

    // 正则捕获：微信群“公寓曼度下午群”（群成员：136人）
    const groupRegex = /(微信群|QQ群|群聊)?[“\"']([^”\"'\n]+群[^”\"'\n]*)[”\"'](?:[^（\n]*（(?:群)?成员[:：\s]*(\d+)人）)?/g;
    let match;
    while ((match = groupRegex.exec(content)) !== null) {
      const platformStr = match[1] || '';
      const platform = platformStr.includes('QQ') ? 'qq' : 'wechat';
      const name = match[2];
      const memberCount = match[3] ? parseInt(match[3]) : 100;
      extractedGroups.push({
        tempId: `g_${Date.now()}_${Math.floor(Math.random() * 1000)}_${extractedGroups.length}`,
        name,
        platform,
        memberCount,
      });
    }

    // 逐行解析人员特征（人名、身份证、手机号、户籍地、成员角色）
    const contentLines = content.split('\n');
    contentLines.forEach((line: string) => {
      const personLineMatch = line.match(/(?:\d+[、.\s]+)?([\u4e00-\u9fa5]{2,4})[，,]\s*(?:身份证|证件号)[：:]\s*(\d{18}|\d{17}[Xx]|\d{6}\*{8}\d{4})/);
      if (personLineMatch) {
        const name = personLineMatch[1];
        const idCard = personLineMatch[2];
        
        // 匹配手机号
        const phoneMatch = line.match(/(?:手机|电话|号码)[：:]\s*(1[3-9]\d{9}|1\d{2}\*{4}\d{4})/);
        const phone = phoneMatch ? phoneMatch[1] : '-';
        
        // 匹配户籍地
        const addressMatch = line.match(/(?:户籍地)[：:]\s*([\u4e00-\u9fa5a-zA-Z0-9#-（）()—院楼室村街号]+)/);
        const registeredAddress = addressMatch ? addressMatch[1] : '未知户籍地';
        
        // 确定群成员类型（袁志梅默认是发言召集者“群主”，徐素红是积极跟帖者“管理员”，其他是“群成员”）
        let role = '群成员';
        if (name === '袁志梅' || line.includes('群主')) {
          role = '群主';
        } else if (name === '徐素红' || line.includes('管理员')) {
          role = '管理员';
        }

        extractedPeople.push({
          tempId: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}_${extractedPeople.length}`,
          name,
          idCard,
          phone,
          registeredAddress,
          role,
          note: ''
        });
      }
    });

    // 兜底正则单行匹配
    if (extractedPeople.length === 0) {
      const lines = content.split('\n');
      lines.forEach((line: string) => {
        const idM = line.match(/(?:身份证|证件号)[：:]\s*(\d{18}|\d{17}[Xx]|\d{6}\*{8}\d{4})/);
        const phoneM = line.match(/(?:手机|电话|号码)[：:]\s*(1\d{10}|1\d{2}\*{4}\d{4})/);
        if (idM || phoneM) {
          const nameM = line.match(/^[0-9一二三四五六七八九十、.\s]*([\u4e00-\u9fa5]{2,4})/);
          const name = nameM ? nameM[1] : '未知人员';
          const idCard = idM ? idM[1] : '32080219900101' + Math.floor(1000 + Math.random() * 9000);
          const phone = phoneM ? phoneM[1] : '-';
          extractedPeople.push({ 
            tempId: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}_${extractedPeople.length}`,
            name, 
            idCard, 
            phone, 
            registeredAddress: '暂未提供户籍地', 
            role: '群成员',
            note: ''
          });
        }
      });
    }

    if (extractedGroups.length === 0 && extractedPeople.length === 0) {
      message.info('未提取到特定模式的群聊和人员身份证/手机号。可直接提交动态，或按模板格式书写。');
    } else {
      message.success(`智能分析提取成功：共解析出 ${extractedGroups.length} 个关联群聊，${extractedPeople.length} 名涉稳重点人员！`);
    }

    setParsedInfo({ groups: extractedGroups, people: extractedPeople });
    setSelectedParsedGroups(extractedGroups.map((g) => g.tempId));
    setSelectedParsedPeople(extractedPeople.map((p) => p.tempId));
  };

  // 添加动态提交
  const handleAddDynamicSubmit = () => {
    formAddDynamic.validateFields().then((values) => {
      const eventKey = lockedTagKey || values.eventKey;
      if (!eventKey) {
        message.error('请选择关联的稳情事件！');
        return;
      }

      // 验证勾选的重点网民是否填写了姓名
      if (parsedInfo) {
        let hasEmptyName = false;
        parsedInfo.people.forEach((p) => {
          if (selectedParsedPeople.includes(p.tempId) && !p.name.trim()) {
            hasEmptyName = true;
          }
        });
        if (hasEmptyName) {
          message.error('已勾选的重点网民必须填写姓名！');
          return;
        }
      }

      const targetTag = tagsList.find((t) => t.key === eventKey);
      const eventName = targetTag ? targetTag.name : '';

      // 智能提取首句作为标题（兜底）
      const lines = values.content ? values.content.split('\n').map((l: string) => l.trim()).filter(Boolean) : [];
      const extractedTitle = lines.length > 0 ? lines[0] : '未命名动态';
      const dynamicTitle = values.title || extractedTitle;

      const newDynId = `dyn_${Date.now()}`;
      const newDyn: DynamicPostItem = {
        id: newDynId,
        title: dynamicTitle,
        publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: values.author || '网安支队-李工',
        content: values.content,
      };

      const currentDynamics = dynamicsMap[eventKey] || [];
      const updatedDynamics = [newDyn, ...currentDynamics];

      let addedPeopleCount = 0;
      let addedGroupsCount = 0;
      const currentPeople = peopleMap[eventKey] || [];
      const currentGroups = groupsMap[eventKey] || [];
      let updatedPeople = [...currentPeople];
      let updatedGroups = [...currentGroups];

      if (parsedInfo) {
        // 导入勾选的人员特征
        parsedInfo.people.forEach((p) => {
          if (selectedParsedPeople.includes(p.tempId)) {
            if (!updatedPeople.some((old) => old.name === p.name || old.idCard === p.idCard)) {
              updatedPeople.push({
                id: `PERSON_MAN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                name: p.name,
                idCard: p.idCard,
                phone: p.phone,
                registeredAddress: p.registeredAddress,
                residentAddress: '淮安开发区中农曼度公寓',
                mentionedCount: 1,
                tags: ['新增人员', '智能提取', p.role],
                riskLevel: 'medium',
                groups: parsedInfo.groups.map(g => g.name),
                note: p.note || '暂无具体情况备注说明。',
                role: p.role
              });
              addedPeopleCount++;
            }
          }
        });

        // 导入勾选的群组
        parsedInfo.groups.forEach((g) => {
          if (selectedParsedGroups.includes(g.tempId)) {
            if (!updatedGroups.some((old) => old.name === g.name)) {
              updatedGroups.push({
                id: `GROUP_MAN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                name: g.name,
                platform: g.platform,
                memberCount: g.memberCount,
                mentionedCount: 1,
                latestDynamic: dynamicTitle,
              });
              addedGroupsCount++;
            }
          }
        });
      }

      // 更新 Maps State
      setDynamicsMap((prev) => ({ ...prev, [eventKey]: updatedDynamics }));
      setPeopleMap((prev) => ({ ...prev, [eventKey]: updatedPeople }));
      setGroupsMap((prev) => ({ ...prev, [eventKey]: updatedGroups }));

      // 实时更新主列表统计
      const updatedTags = tagsList.map((tag) => {
        if (tag.key === eventKey) {
          return {
            ...tag,
            dynamicCount: updatedDynamics.length,
            peopleCount: updatedPeople.length,
            groupCount: updatedGroups.length,
            updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return tag;
      });
      setTagsList(updatedTags);

      if (selectedTag.key === eventKey) {
        setSelectedTag({
          ...selectedTag,
          dynamicCount: updatedDynamics.length,
          peopleCount: updatedPeople.length,
          groupCount: updatedGroups.length,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        });
      }

      message.success(`发布新动态成功！已关联事件【${eventName}】。` + 
        (addedPeopleCount > 0 || addedGroupsCount > 0 
          ? `同步提取入库：人员 ${addedPeopleCount} 人，微信/QQ群组 ${addedGroupsCount} 个！` 
          : ''));

      setAddDynamicModalOpen(false);
      formAddDynamic.resetFields();
      setParsedInfo(null);
    });
  };

  // 打开新增事件 Modal
  const handleOpenAddEventModal = () => {
    formAddEvent.resetFields();
    setAddEventModalOpen(true);
  };

  // 打开添加动态 Modal
  const handleOpenAddDynamicModal = (record: StabilityTagItem | null) => {
    formAddDynamic.resetFields();
    setParsedInfo(null);
    if (record) {
      setLockedTagKey(record.key);
      formAddDynamic.setFieldsValue({ eventKey: record.key });
    } else {
      setLockedTagKey(null);
    }
    setAddDynamicModalOpen(true);
  };

  // 模拟导出防伪存证报告的加载进度
  const handleExportEvidence = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsExporting(false);
          setEvidenceVisible(false);
          message.success('哈希存证证书已顺利物理保存并输出PDF，数字防伪哈希已存链！');
        }, 600);
      }
      setExportProgress(progress);
    }, 120);
  };

  // 平台标签渲染
  const renderPlatform = (platform: 'wechat' | 'qq' | 'other') => {
    if (platform === 'wechat') {
      return (
        <Tag color="green" icon={<WechatOutlined />}>
          微信
        </Tag>
      );
    } else if (platform === 'qq') {
      return (
        <Tag color="blue" icon={<QqOutlined />}>
          QQ
        </Tag>
      );
    } else {
      return <Tag color="default">其他</Tag>;
    }
  };

  return (
    <div className="watermarked-container" style={{ position: 'relative', minHeight: '100%' }}>
      {/* 全页面防泄密动态暗水印图层 */}
      <div className="security-watermark-overlay" style={{ pointerEvents: 'none' }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="watermark-item">LAN YING INTRANET</span>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        
        {/* ==================== 视图一：全局稳情标签主列表页 ==================== */}
        {currentView === 'list' && (
          <div>
            {/* 联合搜索 */}
            <Card className="filter-card" bordered={false} style={{ marginBottom: '16px' }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Space size="middle">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenAddEventModal}
                      style={{ borderRadius: '6px' }}
                    >
                      新增事件/标签
                    </Button>
                    <Button
                      type="default"
                      icon={<FileAddOutlined />}
                      onClick={() => handleOpenAddDynamicModal(null)}
                      style={{ borderRadius: '6px' }}
                    >
                      添加动态
                    </Button>
                  </Space>
                </Col>
                <Col span={14} style={{ textAlign: 'right' }}>
                  <Space size="middle">
                    <Select
                      placeholder="按部门可见范围筛选..."
                      allowClear
                      value={selectedDeptFilter}
                      onChange={(val) => setSelectedDeptFilter(val)}
                      style={{ width: 180, borderRadius: '6px', textAlign: 'left' }}
                      options={[
                        { value: '网安支队', label: '网安支队' },
                        { value: '治安支队', label: '治安支队' },
                        { value: '天河分局', label: '天河分局' },
                        { value: '白云分局', label: '白云分局' },
                        { value: '越秀分局', label: '越秀分局' },
                        { value: '黄埔分局', label: '黄埔分局' },
                        { value: '交警支队', label: '交警支队' },
                      ]}
                    />
                    <Input
                      placeholder="输入事件/类型关键字进行过滤..."
                      prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      allowClear
                      style={{ borderRadius: '6px', width: 260 }}
                    />
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 主台账列表表格 */}
            <Card bordered={false} className="table-card">
              <Table
                dataSource={filterTags}
                rowKey="key"
                pagination={{ pageSize: 5, showTotal: (total) => `共 ${total} 条` }}
                columns={[
                  {
                    title: '事件名称（标签名称）',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text) => <span className="group-name-highlight" style={{ fontSize: '15px' }}>{text}</span>,
                  },
                  {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    render: (text) => <Tag color="blue">{text || '其他维权'}</Tag>,
                  },
                  {
                    title: '可见部门范围',
                    dataIndex: 'visibleDepartments',
                    key: 'visibleDepartments',
                    render: (depts) => {
                      if (!depts || depts.length === 0) return <Tag color="default">仅创建人可见</Tag>;
                      return (
                        <Space size={[0, 4]} wrap>
                          {depts.map((d: string) => (
                            <Tag color="geekblue" key={d}>{d}</Tag>
                          ))}
                        </Space>
                      );
                    }
                  },
                  {
                    title: '关联动态数',
                    dataIndex: 'dynamicCount',
                    key: 'dynamicCount',
                    align: 'center',
                    render: (count) => <Badge count={count} overflowCount={999} style={{ backgroundColor: '#1890ff' }} />,
                  },
                  {
                    title: '关联总人数',
                    dataIndex: 'peopleCount',
                    key: 'peopleCount',
                    align: 'center',
                    render: (count) => <span style={{ fontWeight: 'bold' }}>{count} 人</span>,
                  },
                  {
                    title: '关联总群数',
                    dataIndex: 'groupCount',
                    key: 'groupCount',
                    align: 'center',
                    render: (count) => <span style={{ fontWeight: 'bold', color: '#722ed1' }}>{count} 个</span>,
                  },
                  {
                    title: '最新更新时间',
                    dataIndex: 'updateTime',
                    key: 'updateTime',
                  },
                  {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (_, record) => (
                      <Space size="small">
                        <Button
                          type="primary"
                          ghost
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleEnterDetail(record)}
                          style={{ borderRadius: '4px' }}
                        >
                          查看详情
                        </Button>
                        <Button
                          type="default"
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={() => handleOpenAddDynamicModal(record)}
                          style={{ borderRadius: '4px' }}
                        >
                          添加动态
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        )}

        {/* ==================== 视图二：标签详情控制台（核心三 Tab 架构） ==================== */}
        {currentView === 'detail' && (
          <div>
            {/* 标签标题卡 */}
            <Card
              bordered={false}
              style={{
                background: 'linear-gradient(90deg, #1d39c4 0%, #002329 100%)',
                color: '#fff',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(29,57,196,0.15)',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Row align="middle">
                <Col span={18}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button 
                      type="link" 
                      icon={<ArrowLeftOutlined style={{ fontSize: '20px', color: '#fff' }} />} 
                      onClick={() => setCurrentView('list')}
                      style={{ padding: 0, height: 'auto', display: 'inline-flex', alignItems: 'center' }} 
                    />
                    {selectedTag.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                    该事件标签关联的去重实体包含：动态数量 <span style={{ color: '#ffd591', fontWeight: 'bold' }}>{selectedTag.dynamicCount}</span> 条、
                    涉稳重点人员 <span style={{ color: '#ffd591', fontWeight: 'bold' }}>{selectedTag.peopleCount}</span> 人、
                    涉稳社媒群聊群组 <span style={{ color: '#ffd591', fontWeight: 'bold' }}>{selectedTag.groupCount}</span> 个。
                  </div>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>最新要素捕获时间</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>{selectedTag.updateTime}</div>
                </Col>
              </Row>
            </Card>

            {/* 核心三 Tab 视图架构 */}
            <Card bordered={false} bodyStyle={{ padding: '0px' }} className="tab-container-card">
              <Tabs
                defaultActiveKey="posts"
                type="card"
                className="custom-premium-tabs"
                items={[
                  // ==================== Tab A: 动态 ====================
                  {
                    key: 'posts',
                    label: (
                      <span>
                        <FileTextOutlined /> 动态 ({(dynamicsMap[selectedTag.key] || []).length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={dynamicsMap[selectedTag.key] || []}
                          rowKey="id"
                          pagination={false}
                          className="high-density-table"
                          onRow={(record) => ({
                            onClick: () => {
                              setSelectedDynamic(record);
                              setDynamicDrawerOpen(true);
                            },
                            style: { cursor: 'pointer' },
                          })}
                          columns={[
                            {
                              title: '动态',
                              dataIndex: 'title',
                              key: 'title',
                              render: (text) => <span style={{ fontWeight: '500', color: '#1890ff' }}>{text}</span>,
                            },
                            {
                              title: '提交人',
                              dataIndex: 'author',
                              key: 'author',
                              width: 200,
                              render: (text) => <Tag color="geekblue">{text}</Tag>,
                            },
                            {
                              title: '提交时间',
                              dataIndex: 'publishTime',
                              key: 'publishTime',
                              width: 250,
                            },
                          ]}
                        />
                      </div>
                    ),
                  },

                  // ==================== Tab B: 人员 ====================
                  {
                    key: 'people',
                    label: (
                      <span>
                        <UserOutlined /> 人员 ({(peopleMap[selectedTag.key] || []).length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        {/* 重点人员检索筛选区 */}
                        <Row gutter={16} align="middle" style={{ marginBottom: '16px' }}>
                          <Col span={6}>
                            <Input
                              placeholder="输入重点人姓名搜索..."
                              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                              value={peopleSearchName}
                              onChange={(e) => setPeopleSearchName(e.target.value)}
                              allowClear
                              style={{ borderRadius: '6px' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Input
                              placeholder="输入户籍地关键字搜索..."
                              prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                              value={peopleSearchAddress}
                              onChange={(e) => setPeopleSearchAddress(e.target.value)}
                              allowClear
                              style={{ borderRadius: '6px' }}
                            />
                          </Col>
                          <Col span={10} style={{ textAlign: 'right' }}>
                            <Button 
                              icon={<ReloadOutlined />} 
                              onClick={() => {
                                setPeopleSearchName('');
                                setPeopleSearchAddress('');
                              }}
                              style={{ borderRadius: '6px' }}
                            >
                              重置
                            </Button>
                          </Col>
                        </Row>

                        <Table
                          dataSource={getFilteredPeopleList()}
                          rowKey="id"
                          pagination={false}
                          columns={[
                            {
                              title: '排名/序号',
                              key: 'index',
                              width: 100,
                              align: 'center',
                              render: (_, __, idx) => {
                                const colors = ['#f5222d', '#fa541c', '#fa8c16'];
                                return (
                                  <Badge
                                    count={idx + 1}
                                    style={{
                                      backgroundColor: colors[idx] || '#bfbfbf',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                );
                              },
                            },
                            {
                              title: '涉稳重点人姓名',
                              dataIndex: 'name',
                              key: 'name',
                              render: (_, record) => (
                                <Button
                                  type="link"
                                  icon={<PartitionOutlined />}
                                  onClick={() => handleOpenPersonDrawer(record)}
                                  style={{ padding: 0, fontWeight: 'bold' }}
                                >
                                  {record.name}
                                </Button>
                              ),
                            },
                            {
                              title: '身份证号',
                              dataIndex: 'idCard',
                              key: 'idCard',
                              render: (text) => `${text.substr(0, 6)}********${text.substr(14, 4)}`,
                            },
                            {
                              title: '手机号码',
                              dataIndex: 'phone',
                              key: 'phone',
                              render: (text) => `${text.substr(0, 3)}****${text.substr(7, 4)}`,
                            },
                            {
                              title: '户籍地',
                              dataIndex: 'registeredAddress',
                              key: 'registeredAddress',
                              width: 180,
                              render: (text) => text || '暂无户籍地登记'
                            },
                            {
                              title: '相关群组',
                              key: 'groups',
                              render: (_, record) => {
                                const groups = record.groups || [];
                                if (groups.length === 0) return <span style={{ color: '#bfbfbf' }}>-</span>;
                                return (
                                  <span>
                                    <UsergroupAddOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                                    {groups[0]}
                                    {groups.length > 1 && (
                                      <Tag color="blue" style={{ marginLeft: 6 }}>+{groups.length - 1}</Tag>
                                    )}
                                  </span>
                                );
                              }
                            },
                            {
                              title: '提及频次 (活跃度能量)',
                              dataIndex: 'mentionedCount',
                              key: 'mentionedCount',
                              sorter: (a, b) => b.mentionedCount - a.mentionedCount,
                              render: (count) => (
                                <div style={{ width: '130px' }} className="flex-center-y">
                                  <Progress
                                    percent={(count / 15) * 100}
                                    showInfo={false}
                                    strokeColor="#f5222d"
                                    trailColor="rgba(0,0,0,0.05)"
                                    style={{ marginRight: 8, width: 80 }}
                                  />
                                  <span style={{ fontWeight: 'bold', color: '#f5222d' }}>{count} 次</span>
                                </div>
                              ),
                            },
                            {
                              title: '操作',
                              key: 'action',
                              align: 'center',
                              render: (_, record) => (
                                <Button
                                  size="small"
                                  type="link"
                                  danger
                                  onClick={() => {
                                    message.loading(`正在将涉稳人员【${record.name}】移出该标签监控...`);
                                    setTimeout(() => {
                                      // 移除操作
                                      const updatedList = (peopleMap[selectedTag.key] || []).filter(p => p.id !== record.id);
                                      setPeopleMap(prev => ({ ...prev, [selectedTag.key]: updatedList }));
                                      // 更新对应事件的 peopleCount 计数
                                      setTagsList(prev => prev.map(t => t.key === selectedTag.key ? { ...t, peopleCount: updatedList.length } : t));
                                      setSelectedTag(prev => ({ ...prev, peopleCount: updatedList.length }));
                                      message.success(`已成功将【${record.name}】从标签“${selectedTag.name}”下移出。`);
                                    }, 800);
                                  }}
                                >
                                  删除
                                </Button>
                              ),
                            },
                          ]}
                        />
                      </div>
                    ),
                  },

                  // ==================== Tab C: 群组 ====================
                  {
                    key: 'groups',
                    label: (
                      <span>
                        <UsergroupAddOutlined /> 群组 ({(groupsMap[selectedTag.key] || []).length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={groupsMap[selectedTag.key] || []}
                          rowKey="id"
                          pagination={false}
                          columns={[
                            {
                              title: '关联监测群聊名称',
                              dataIndex: 'name',
                              key: 'name',
                              render: (text) => <span style={{ fontWeight: '600' }}>{text}</span>,
                            },
                            {
                              title: '群主平台',
                              dataIndex: 'platform',
                              key: 'platform',
                              render: (plat) => renderPlatform(plat),
                            },
                            {
                              title: '群内人数',
                              dataIndex: 'memberCount',
                              key: 'memberCount',
                              align: 'center',
                              render: (count) => <span style={{ fontWeight: 'bold' }}>{count} 人</span>,
                            },
                            {
                              title: '出现动态频次',
                              dataIndex: 'mentionedCount',
                              key: 'mentionedCount',
                              render: (count) => (
                                <div style={{ width: '130px' }} className="flex-center-y">
                                  <Progress
                                    percent={(count / 22) * 100}
                                    showInfo={false}
                                    strokeColor="#722ed1"
                                    trailColor="rgba(0,0,0,0.05)"
                                    style={{ marginRight: 8, width: 80 }}
                                  />
                                  <span style={{ fontWeight: 'bold', color: '#722ed1' }}>{count} 次</span>
                                </div>
                              ),
                            },
                            {
                              title: '最新动态标题',
                              dataIndex: 'latestDynamic',
                              key: 'latestDynamic',
                              render: (text) => (
                                <span style={{ color: '#1890ff', fontSize: '13px', fontWeight: '500' }}>
                                  {text}
                                </span>
                              ),
                            },
                            {
                              title: '操作',
                              key: 'action',
                              align: 'center',
                              render: (_, record) => (
                                <Button
                                  size="small"
                                  type="link"
                                  onClick={() => handleOpenGroupDrawer(record)}
                                >
                                  查看详情
                                </Button>
                              ),
                            },
                          ]}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        )}

      </div>

      {/* ==================== 抽屉一：非结构化动态详情 Drawer ==================== */}
      <Drawer
        title="动态详情"
        width={620}
        onClose={() => {
          setDynamicDrawerOpen(false);
          setSelectedDynamic(null);
        }}
        open={dynamicDrawerOpen}
        destroyOnClose
      >
        {selectedDynamic && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ flex: 1, marginRight: 16 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '14px', color: '#262626' }}>
                  标题：
                </div>
                <h3 style={{ fontWeight: 'bold', color: '#1890ff', margin: 0, fontSize: '16px' }}>
                  {selectedDynamic.title}
                </h3>
              </div>
              <Button 
                type="primary" 
                danger 
                ghost 
                icon={<SafetyCertificateOutlined />} 
                onClick={() => {
                  const hash = 'SHA256:' + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');
                  const certText = `存证编号: E-EVID-${Date.now()}-${Math.floor(1000 + Math.random()*9000)}\n存证哈希: ${hash}`;
                  setEvidenceText(certText);
                  setEvidenceVisible(true);
                }}
                style={{ flexShrink: 0, marginTop: 16 }}
              >
                电子存证单
              </Button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '14px', color: '#262626' }}>
                <FileTextOutlined style={{ marginRight: 6 }} /> 内容：
              </div>
              <div
                style={{
                  background: '#f9f9f9',
                  border: '1px solid #d9d9d9',
                  padding: '16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#262626',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                {selectedDynamic.content}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 10, fontSize: '14px', color: '#262626' }}>
                <UsergroupAddOutlined style={{ marginRight: 6 }} /> 群组信息：
              </div>
              <Card size="small" style={{ borderRadius: '6px', background: '#fafafa', border: '1px solid #e8e8e8' }}>
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="群聊名称">公寓曼度下午群</Descriptions.Item>
                  <Descriptions.Item label="社交平台">
                    <Tag color="green" icon={<WechatOutlined />}>微信</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="群内人数">136 人</Descriptions.Item>
                  <Descriptions.Item label="平台ID">wx_group_man_001</Descriptions.Item>
                </Descriptions>
              </Card>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 10, fontSize: '14px', color: '#262626' }}>
                <UserOutlined style={{ marginRight: 6 }} /> 人员信息：
              </div>
              <Table
                dataSource={[
                  { key: 'p1', name: '袁志梅', idCard: '320821********7108', phone: '177****2556', address: '淮阴区盐河东街232号' },
                  { key: 'p2', name: '徐素红', idCard: '320821********350X', phone: '139****8730', address: '清江浦区和平路9号越河小区8号楼甲单元304室' },
                  { key: 'p3', name: '赵君茂', idCard: '320821********2316', phone: '130****8768', address: '淮阴区淮高镇长兴村候赵庄30号' },
                ].filter(p => selectedDynamic.content.includes(p.name))}
                rowKey="key"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    width: 80,
                    render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
                  },
                  {
                    title: '身份信息',
                    key: 'info',
                    render: (_, record) => (
                      <div style={{ fontSize: '12px', color: '#595959' }}>
                        <div>证件: {record.idCard}</div>
                        <div>手机: {record.phone}</div>
                      </div>
                    )
                  },
                  {
                    title: '手动选择属性',
                    key: 'role',
                    width: 140,
                    align: 'center',
                    render: (_, record, index) => (
                      <Select
                        defaultValue={index === 0 && selectedDynamic.id === 'dyn_001' ? 'owner' : 'member'}
                        style={{ width: 110 }}
                        size="small"
                        options={[
                          { value: 'owner', label: '群主' },
                          { value: 'admin', label: '管理员' },
                          { value: 'member', label: '普通成员' }
                        ]}
                        onChange={(val) => message.success(`已更新 ${record.name} 的群角色为: ${val === 'owner' ? '群主' : val === 'admin' ? '管理员' : '普通成员'}`)}
                      />
                    )
                  }
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* ==================== 抽屉二：重点涉稳重点人全量特征融合画像 Drawer (叠开) ==================== */}
      <Drawer
        title="人员详细信息"
        width={720}
        onClose={() => {
          setPersonDrawerOpen(false);
          setActivePerson(null);
        }}
        open={personDrawerOpen}
        destroyOnClose
        style={{ boxShadow: '-6px 0 16px rgba(0,0,0,0.15)' }}
      >
        {activePerson && (
          <div>
            {/* 画像头部卡片（左右结构） */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e8e8e8' }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: activePerson.riskLevel === 'high' ? '#ff4d4f' : '#1890ff', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{activePerson.name}</span>
                  <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                    累计提及次数：<strong style={{ color: '#ff4d4f', fontSize: '16px' }}>{activePerson.id === 'PERSON_MAN_001' ? 15 : activePerson.id === 'PERSON_MAN_002' ? 9 : 5}</strong> 次
                  </span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <Tag color="purple">属性: 核心涉稳人员</Tag>
                  {activePerson.tags.map(t => (
                    <Tag color={t.includes('高风险') || t.includes('群主') || t.includes('核心') ? 'red' : 'geekblue'} key={t}>{t}</Tag>
                  ))}
                  {syncedPeople.includes(activePerson.id) ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>已录入人员库</Tag>
                  ) : (
                    <Tag 
                      color="warning" 
                      icon={<SyncOutlined spin={syncingId === activePerson.id} />} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (syncingId) return;
                        setSyncingId(activePerson.id);
                        message.loading({ content: '正在同步网民信息及涉稳特征至系统人员库...', key: 'sync-db' });
                        setTimeout(() => {
                          setSyncedPeople(prev => [...prev, activePerson.id]);
                          setSyncingId(null);
                          message.success({ content: `涉稳网民【${activePerson.name}】已成功同步至全量人员库！`, key: 'sync-db', duration: 2 });
                        }, 1200);
                      }}
                    >
                      未录入人员库（点击同步）
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            {/* 社媒账号流 */}
            <Card title="绑定的社交媒体账号" size="small" style={{ marginBottom: '20px', borderRadius: '6px' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="social-acc-item flex-between" style={{ padding: '8px 12px', border: '1px solid #e8e8e8', borderRadius: '6px' }}>
                    <div className="flex-center-y" style={{ gap: 8 }}>
                      <WechatOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                      <div>
                        <div style={{ fontWeight: '500' }}>{activePerson.name}</div>
                        <div style={{ fontSize: '11px', color: '#8c8c8c' }}>ID: wx_{activePerson.phone}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 描述项 */}
            <Descriptions 
              title="基本信息" 
              size="small" 
              bordered 
              column={2} 
              style={{ marginBottom: '20px' }}
              extra={
                isEditingPerson ? (
                  <Space>
                    <Button type="primary" size="small" onClick={handleSavePersonEdit}>保存</Button>
                    <Button size="small" onClick={() => setIsEditingPerson(false)}>取消</Button>
                  </Space>
                ) : (
                  <Button type="primary" size="small" ghost onClick={() => setIsEditingPerson(true)}>编辑</Button>
                )
              }
            >
              <Descriptions.Item label="性别">
                {isEditingPerson ? (
                  <Select
                    size="small"
                    value={editedPersonFields.gender}
                    onChange={(val) => setEditedPersonFields((p: any) => ({ ...p, gender: val }))}
                    options={[{ value: '男', label: '男' }, { value: '女', label: '女' }]}
                    style={{ width: '100%' }}
                  />
                ) : activePerson.gender}
              </Descriptions.Item>
              <Descriptions.Item label="年龄">
                {isEditingPerson ? (
                  <InputNumber
                    size="small"
                    min={1}
                    max={120}
                    value={editedPersonFields.age}
                    onChange={(val) => setEditedPersonFields((p: any) => ({ ...p, age: val || 38 }))}
                    style={{ width: '100%' }}
                  />
                ) : `${activePerson.age} 岁`}
              </Descriptions.Item>
              <Descriptions.Item label="民族">
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.nation}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, nation: e.target.value }))}
                  />
                ) : activePerson.nation}
              </Descriptions.Item>
              <Descriptions.Item label="身份证号">
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.idCard}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, idCard: e.target.value }))}
                  />
                ) : activePerson.idCard}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.phone}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, phone: e.target.value }))}
                  />
                ) : activePerson.phone}
              </Descriptions.Item>
              <Descriptions.Item label="出生日期">
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.birthday}
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, birthday: e.target.value }))}
                  />
                ) : activePerson.birthday}
              </Descriptions.Item>
              <Descriptions.Item label="居住地址" span={2}>
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.residentAddress}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, residentAddress: e.target.value }))}
                    style={{ width: '100%' }}
                  />
                ) : activePerson.residentAddress}
              </Descriptions.Item>
              <Descriptions.Item label="户籍地址" span={2}>
                {isEditingPerson ? (
                  <Input
                    size="small"
                    value={editedPersonFields.registeredAddress}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, registeredAddress: e.target.value }))}
                    style={{ width: '100%' }}
                  />
                ) : activePerson.registeredAddress}
              </Descriptions.Item>
              <Descriptions.Item label="情况备注说明" span={2}>
                {isEditingPerson ? (
                  <Input.TextArea
                    rows={2}
                    value={editedPersonFields.note}
                    onChange={(e) => setEditedPersonFields((p: any) => ({ ...p, note: e.target.value }))}
                  />
                ) : activePerson.note}
              </Descriptions.Item>
            </Descriptions>

            {/* 客观帖文脉络 */}
            <h4 className="section-title-sm" style={{ marginBottom: '10px' }}>相关动态</h4>
            <Timeline>
              {activePerson.recordList.map((rec) => (
                <Timeline.Item key={rec.id} color="blue">
                  <div className="timeline-post-card" style={{ border: '1px solid #e8e8e8', padding: '10px', borderRadius: '6px', background: '#fff' }}>
                    <div className="flex-between" style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: 6 }}>
                      <span>
                        <WechatOutlined style={{ color: '#52c41a' }} />
                        <span style={{ marginLeft: 4 }}>{rec.author} ({rec.authorId})</span>
                      </span>
                      <span>发布于 {rec.publishTime}</span>
                    </div>
                    <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#262626' }}>
                      {rec.content}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>

          </div>
        )}
      </Drawer>

      {/* ==================== 抽屉三：群组详情 Drawer ==================== */}
      <Drawer
        title="群组详细信息"
        width={620}
        onClose={() => {
          setGroupDrawerOpen(false);
          setActiveGroup(null);
        }}
        open={groupDrawerOpen}
        destroyOnClose
      >
        {activeGroup && (
          <div>
            {/* 群组基本信息卡片 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fafafa', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e8e8e8' }}>
              <div className="card-icon-wrapper blue-glow" style={{ fontSize: '32px', padding: '8px 12px', background: 'rgba(24,144,255,0.08)', borderRadius: '6px', color: '#1890ff', flexShrink: 0 }}>
                <UsergroupAddOutlined />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{activeGroup.name}</span>
                  <span style={{ fontSize: '13px', color: '#8c8c8c' }}>
                    提及动态数：<strong style={{ color: '#722ed1', fontSize: '16px' }}>{activeGroup.mentionedCount}</strong> 次
                  </span>
                </div>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <Tag color="blue">平台: {activeGroup.platform === 'wechat' ? '微信' : 'QQ'}</Tag>
                  <Tag color="purple">群成员: {activeGroup.memberCount} 人</Tag>
                  <Tag color="cyan">状态: 重点监测</Tag>
                </div>
              </div>
            </div>

            {/* 相关动态时间线 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: '14px', color: '#262626' }}>
                <ClockCircleOutlined style={{ marginRight: 6 }} /> 相关动态时间线：
              </div>
              <Timeline>
                {(dynamicsMap[selectedTag.key] || []).map(dyn => (
                  <Timeline.Item key={dyn.id} color="blue">
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: 4 }}>
                      {dyn.publishTime} <span style={{ marginLeft: 6 }}>提交人: {dyn.author}</span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1890ff', cursor: 'pointer' }} onClick={() => {
                      setSelectedDynamic(dyn);
                      setDynamicDrawerOpen(true);
                    }}>
                      {dyn.title}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 群内涉稳人员列表 */}
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: 12, fontSize: '14px', color: '#262626' }}>
                <UserOutlined style={{ marginRight: 6 }} /> 群内重点人员：
              </div>
              <Table
                dataSource={(peopleMap[selectedTag.key] || []).filter(p => p.groups?.includes(activeGroup.name))}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    render: (_, record) => (
                      <Button
                        type="link"
                        onClick={() => {
                          handleOpenPersonDrawer(record);
                        }}
                        style={{ padding: 0, fontWeight: 'bold' }}
                      >
                        {record.name}
                      </Button>
                    )
                  },
                  {
                    title: '成员类型',
                    key: 'role',
                    render: (_, record) => {
                      const role = record.role || (record.tags?.includes('群主') ? '群主' : (record.tags?.includes('管理员') ? '管理员' : '群成员'));
                      let tagColor = 'blue';
                      if (role === '群主') tagColor = 'red';
                      else if (role === '管理员') tagColor = 'orange';
                      return <Tag color={tagColor}>{role}</Tag>;
                    }
                  }
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* ==================== 内网物理取证 Modal ==================== */}
      <Modal
        title={<span><SafetyCertificateOutlined style={{ color: '#ff4d4f', marginRight: 8 }} /> 蓝鹰一体化系统 - 电子证据司法存证报告</span>}
        open={evidenceVisible}
        onCancel={() => !isExporting && setEvidenceVisible(false)}
        footer={isExporting ? [
          <Button key="exporting" type="primary" loading disabled>
            正在生成导出报告...
          </Button>
        ] : [
          <Button key="close" disabled={isExporting} onClick={() => setEvidenceVisible(false)}>关闭</Button>,
          <Button key="download" type="primary" danger disabled={isExporting} onClick={handleExportEvidence}>
            导出防伪报告
          </Button>
        ]}
        width={600}
        destroyOnClose
        centered
      >
        {isExporting ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Progress type="circle" percent={exportProgress} strokeColor={{ '0%': '#ff4d4f', '100%': '#52c41a' }} />
            <div style={{ marginTop: 20, fontWeight: 'bold', color: '#ff4d4f', fontSize: '15px' }}>
              {exportProgress < 25 && '正在计算电子数据摘要哈希 (SHA-256)...'}
              {exportProgress >= 25 && exportProgress < 55 && '正在向存证链（司法区块链）提交存证凭证...'}
              {exportProgress >= 55 && exportProgress < 85 && '正在附加取证网安民警数字签名与时间戳...'}
              {exportProgress >= 85 && '正在物理生成防伪存证报告PDF文件...'}
            </div>
          </div>
        ) : (
          <div style={{ 
            background: '#fafafa', 
            border: '1.5px solid #d9d9d9', 
            borderRadius: '8px', 
            padding: '20px', 
            position: 'relative',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
          }}>
            {/* 证书顶部警徽与标题 */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f', letterSpacing: 1 }}>
                电子数据取证司法存证证书
              </div>
              <div style={{ fontSize: '10px', color: '#8c8c8c', marginTop: 2, fontFamily: 'monospace' }}>
                FEDERAL SECURITY DIGITAL EVIDENCE CERTIFICATE
              </div>
              <Divider style={{ margin: '8px 0 12px 0', borderColor: '#d9d9d9' }} />
            </div>

            {/* 证书内容 Descriptions */}
            <Descriptions size="small" column={1} bordered style={{ marginBottom: 12 }}>
              <Descriptions.Item label="存证编号">
                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {evidenceText.match(/存证编号:\s*(\S+)/)?.[1] || `E-EVID-${Date.now()}-2231`}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="所属事件">
                <span style={{ fontWeight: '500' }}>{selectedTag?.name}</span>
              </Descriptions.Item>
              <Descriptions.Item label="存证哈希 (SHA-256)">
                <Tooltip title="点击复制哈希值">
                  <span 
                    style={{ fontFamily: 'monospace', fontSize: '10px', cursor: 'pointer', color: '#1890ff', wordBreak: 'break-all' }}
                    onClick={() => {
                      const h = evidenceText.match(/存证哈希:\s*(\S+)/)?.[1];
                      if (h) {
                        navigator.clipboard.writeText(h);
                        message.success('存证哈希已复制到剪贴板！');
                      }
                    }}
                  >
                    {evidenceText.match(/存证哈希:\s*(\S+)/)?.[1] || 'SHA256:8f4c2e8a1d7f0e9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b'}
                  </span>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="区块高度">
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>#15,804,219 (已同步至内网司法链)</span>
              </Descriptions.Item>
              <Descriptions.Item label="取证时间">
                <span>{selectedDynamic?.publishTime || new Date().toISOString().replace('T', ' ').substring(0, 16)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="取证人">
                <span>网安支队 | 警号 024831 ({selectedDynamic?.author || '李工'})</span>
              </Descriptions.Item>
            </Descriptions>

            {/* 取证正文 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#262626', marginBottom: 4 }}>取证摘要正文：</div>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                fontSize: '11px', 
                color: '#595959', 
                fontFamily: 'monospace',
                maxHeight: '90px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid #e8e8e8'
              }}>
                {selectedDynamic?.content}
              </div>
            </div>

            {/* 核验底章印记 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <div style={{ 
                border: '2px solid #52c41a', 
                color: '#52c41a', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                transform: 'rotate(-5deg)',
                fontSize: '12px',
                letterSpacing: 1,
                boxShadow: '0 0 4px rgba(82,196,26,0.15)',
                background: 'rgba(82,196,26,0.02)'
              }}>
                ✓ 司法存证核验通过
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== 1. 新增事件/标签 Modal ==================== */}
      <Modal
        title={<span><PlusOutlined style={{ color: '#1890ff', marginRight: 8 }} /> 新增稳情事件 / 标签</span>}
        open={addEventModalOpen}
        onOk={handleAddEventSubmit}
        onCancel={() => setAddEventModalOpen(false)}
        okText="创建事件"
        cancelText="取消"
        destroyOnClose
        centered
      >
        <Form form={formAddEvent} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="事件名称（标签名称）"
            rules={[{ required: true, message: '请输入事件/标签名称！' }]}
          >
            <Input placeholder="输入事件或标签的单一名称，例如：金地花园业主延期交房维权" />
          </Form.Item>
          <Form.Item
            name="type"
            label="事件分类类型"
            rules={[{ required: true, message: '请选择或输入事件关联群体类型！' }]}
            initialValue="业主维权"
          >
            <Select
              showSearch
              placeholder="选择或输入事件关联群体类型"
              options={[
                { value: '业主维权', label: '业主维权' },
                { value: '外卖群体', label: '外卖群体' },
                { value: '出租车群体', label: '出租车群体' },
                { value: '货运群体', label: '货运群体' },
                { value: '退役军人', label: '退役军人' },
                { value: '涉警维权', label: '涉警维权' },
              ]}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="输入自定义类型"
                      size="small"
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                      onPressEnter={(e) => {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          formAddEvent.setFieldsValue({ type: val });
                          message.success(`已设置自定义类型：${val}`);
                        }
                      }}
                    />
                    <span style={{ fontSize: 11, color: '#999' }}>回车应用</span>
                  </Space>
                </>
              )}
            />
          </Form.Item>
          <Form.Item
            name="visibleDepartments"
            label="指定部门可见范围"
            rules={[{ required: true, message: '请选择允许查看该事件的部门！' }]}
            initialValue={['网安支队']}
          >
            <Select
              mode="multiple"
              placeholder="选择可见的部门（可多选）"
              options={[
                { value: '网安支队', label: '网安支队' },
                { value: '治安支队', label: '治安支队' },
                { value: '天河分局', label: '天河分局' },
                { value: '白云分局', label: '白云分局' },
                { value: '越秀分局', label: '越秀分局' },
                { value: '黄埔分局', label: '黄埔分局' },
                { value: '交警支队', label: '交警支队' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 2. 添加动态 Modal ==================== */}
      <Modal
        title={<span><FileAddOutlined style={{ color: '#722ed1', marginRight: 8 }} /> 添加动态</span>}
        open={addDynamicModalOpen}
        onOk={handleAddDynamicSubmit}
        onCancel={() => setAddDynamicModalOpen(false)}
        okText="发布动态"
        cancelText="取消"
        width={720}
        destroyOnClose
        centered
      >
        <Form form={formAddDynamic} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="eventKey"
                label="关联稳情事件/标签"
                rules={[{ required: true, message: '请选择关联的事件/标签！' }]}
              >
                <Select
                  placeholder="选择关联的稳情事件"
                  disabled={lockedTagKey !== null}
                  options={tagsList.map((tag) => ({
                    value: tag.key,
                    label: `${tag.name} (${tag.type})`,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="动态标题"
              >
                <Input placeholder="可留空，智能提取时自动捕获内容首句" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="提交案例人"
                initialValue="网安支队-李工"
              >
                <Input placeholder="输入提交人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: 30 }}>
                * 系统自动记录当前时间为取证时间
              </div>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>动态正文内容 (标准取证格式，包含身份证、手机号、群聊名称以支持智能提取)</span>
                <Button 
                  type="link" 
                  size="small" 
                  onClick={() => {
                    formAddDynamic.setFieldsValue({
                      content: `中农曼度公寓业主策划22日早上到曼度讨要租金
5月21日19时22分，淮阴区袁志梅，在微信群“公寓曼度下午群”（群成员：136人）内发言称，没收到房租费的人一起去要。
清江浦区徐素红回复到，约好了，我也去。
赵君茂回应称，明天早上去。

人员身份：
1、袁志梅，身份证：320821197008187108，户籍地：淮阴区盐河东街232号，手机号：17712802556；
2、徐素红，身份证：32082119750107350X，户籍地：清江浦区和平路9号越河小区8号楼甲单元304室，手机号：13901408730；
3、赵君茂，身份证：320821197309202316，户籍地：淮阴区淮高镇长兴村候赵庄30号，手机号：13023158768。`
                    });
                    message.success('已自动载入标准示例内容！');
                  }}
                >
                  载入模板示例
                </Button>
              </div>
            }
            rules={[{ required: true, message: '请输入动态内容！' }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="输入动态内容。例如包含：
微信群“公寓曼度下午群”（群成员：136人）内发言称，没收到房租费的人一起去要。
人员身份：
1、袁志梅，身份证：320821198205057108，手机号：17700222556；"
            />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Button
              type="dashed"
              onClick={handleExtractDynamic}
              style={{ width: '100%', borderColor: '#722ed1', color: '#722ed1', fontWeight: 'bold' }}
            >
              一键提取
            </Button>
          </div>

          {/* 解析提取结果区域 */}
          {parsedInfo && (
            <div style={{ 
              background: '#fafafa', 
              border: '1px solid #f0f0f0', 
              borderRadius: '6px', 
              padding: '16px',
              maxHeight: '280px',
              overflowY: 'auto',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                fontWeight: 'bold', 
                color: '#555', 
                marginBottom: 12, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                position: 'sticky',
                top: 0,
                background: '#fafafa',
                zIndex: 10,
                paddingBottom: 8,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span>🤖 提取结果</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 提取的群聊 - 堆叠一 */}
                <Card 
                  size="small" 
                  title={<span><WechatOutlined style={{ color: '#52c41a', marginRight: 6 }} /> 提取群聊 ({parsedInfo.groups.length})</span>}
                  extra={
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={handleAddParsedGroup}
                      style={{ fontSize: 12, background: '#52c41a', borderColor: '#52c41a' }}
                    >
                      手动新增群聊
                    </Button>
                  }
                >
                  {parsedInfo.groups.length === 0 ? (
                    <span style={{ color: '#bfbfbf', fontSize: 12 }}>未提取到群聊</span>
                  ) : (
                    <Checkbox.Group
                      value={selectedParsedGroups}
                      onChange={(vals) => setSelectedParsedGroups(vals as string[])}
                      style={{ width: '100%' }}
                    >
                      {parsedInfo.groups.map((g, index) => (
                        <div key={g.tempId} style={{ margin: '8px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                          <Checkbox value={g.tempId}>
                            <Space size={8} align="center" style={{ marginLeft: 4 }}>
                              <Input
                                size="small"
                                placeholder="群名称"
                                value={g.name}
                                onChange={(e) => handleUpdateParsedGroup(index, 'name', e.target.value)}
                                style={{ width: 220 }}
                              />
                              <span style={{ fontSize: 12, color: '#8c8c8c' }}>平台:</span>
                              <Select
                                size="small"
                                value={g.platform}
                                onChange={(val) => handleUpdateParsedGroup(index, 'platform', val)}
                                style={{ width: 80 }}
                                options={[
                                  { value: 'wechat', label: '微信' },
                                  { value: 'qq', label: 'QQ' }
                                ]}
                              />
                              <span style={{ fontSize: 12, color: '#8c8c8c' }}>人数:</span>
                              <InputNumber
                                size="small"
                                min={1}
                                value={g.memberCount}
                                onChange={(val) => handleUpdateParsedGroup(index, 'memberCount', val || 100)}
                                style={{ width: 80 }}
                              />
                              <span style={{ fontSize: 12, color: '#8c8c8c' }}>人</span>
                            </Space>
                          </Checkbox>
                        </div>
                      ))}
                    </Checkbox.Group>
                  )}
                </Card>

                {/* 提取的重点网民 - 堆叠二 */}
                <Card 
                  size="small" 
                  title={<span><UserAddOutlined style={{ color: '#1890ff', marginRight: 6 }} /> 提取重点网民 ({parsedInfo.people.length})</span>}
                  extra={
                    <Space size="middle">
                      <Tooltip title="系统检测到明文输入（如18位身份证、11位手机号），入库后将自动实施脱敏掩码，保障内网信息安全。">
                        <InfoCircleOutlined style={{ color: '#fa8c16', cursor: 'pointer' }} />
                      </Tooltip>
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={handleAddParsedPerson}
                        style={{ fontSize: 12, background: '#1890ff', borderColor: '#1890ff' }}
                      >
                        手动新增网民
                      </Button>
                    </Space>
                  }
                >
                  {parsedInfo.people.length === 0 ? (
                    <span style={{ color: '#bfbfbf', fontSize: 12 }}>未提取到重点人员</span>
                  ) : (
                    <Checkbox.Group
                      value={selectedParsedPeople}
                      onChange={(vals) => setSelectedParsedPeople(vals as string[])}
                      style={{ width: '100%' }}
                    >
                      {parsedInfo.people.map((p, index) => {
                        let tagColor = 'blue';
                        if (p.role === '群主') tagColor = 'red';
                        else if (p.role === '管理员') tagColor = 'orange';
                        
                        // 校验逻辑：允许脱敏格式或标准格式。若有字符且不符合格式，则标黄警示
                        const isPhoneValid = !p.phone || p.phone === '-' || p.phone === '' || /^1\d{10}$/.test(p.phone) || /^1\d{2}\*{4}\d{4}$/.test(p.phone);
                        const isIdCardValid = !p.idCard || p.idCard === '-' || p.idCard === '' || /^\d{17}[\dXx]$/.test(p.idCard) || /^\d{6}\*{8}\d{3}[\dXx]$/.test(p.idCard);

                        return (
                          <div key={p.tempId} style={{ margin: '12px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                            <Checkbox value={p.tempId}>
                              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, verticalAlign: 'top', width: '100%', marginLeft: 4 }}>
                                <Space size={8} wrap>
                                  <Input
                                    size="small"
                                    placeholder="姓名 (必填)"
                                    value={p.name}
                                    onChange={(e) => handleUpdateParsedPerson(index, 'name', e.target.value)}
                                    style={{ width: 110, borderColor: !p.name.trim() ? '#ff4d4f' : undefined }}
                                  />
                                  <Select
                                    size="small"
                                    value={p.role}
                                    onChange={(val) => handleUpdateParsedPerson(index, 'role', val)}
                                    style={{ width: 90 }}
                                    options={[
                                      { value: '群主', label: '群主' },
                                      { value: '管理员', label: '管理员' },
                                      { value: '群成员', label: '群成员' }
                                    ]}
                                  />
                                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>手机号:</span>
                                  <Tooltip title={!isPhoneValid ? "手机号格式不合规，标准格式应为11位手机号" : undefined} open={!isPhoneValid ? undefined : false}>
                                    <Input
                                      size="small"
                                      placeholder="手机号"
                                      value={p.phone}
                                      onChange={(e) => handleUpdateParsedPerson(index, 'phone', e.target.value)}
                                      style={{ width: 140, borderColor: !isPhoneValid ? '#fa8c16' : undefined }}
                                    />
                                  </Tooltip>
                                </Space>
                                <Space size={8} wrap style={{ marginTop: 4 }}>
                                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>身份证:</span>
                                  <Tooltip title={!isIdCardValid ? "身份证格式不合规，标准格式应为18位身份证号" : undefined} open={!isIdCardValid ? undefined : false}>
                                    <Input
                                      size="small"
                                      placeholder="身份证号"
                                      value={p.idCard}
                                      onChange={(e) => handleUpdateParsedPerson(index, 'idCard', e.target.value)}
                                      style={{ width: 180, borderColor: !isIdCardValid ? '#fa8c16' : undefined }}
                                    />
                                  </Tooltip>
                                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>户籍地:</span>
                                  <Input
                                    size="small"
                                    placeholder="户籍地址"
                                    value={p.registeredAddress}
                                    onChange={(e) => handleUpdateParsedPerson(index, 'registeredAddress', e.target.value)}
                                    style={{ width: 220 }}
                                  />
                                </Space>
                              </div>
                            </Checkbox>
                          </div>
                        );
                      })}
                    </Checkbox.Group>
                  )}
                </Card>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default StabilityMaintenance;
