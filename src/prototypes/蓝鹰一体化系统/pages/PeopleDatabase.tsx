import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Tree,
  message,
  Space,
  Avatar,
  Divider,
  Segmented,
  Descriptions,
  Timeline,
  Row,
  Col,
  Alert,
  Dropdown,
  Menu,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  FileSearchOutlined,
  ProfileOutlined,
  WeiboOutlined,
  WechatOutlined,
  YoutubeOutlined,
  UsergroupAddOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  LinkOutlined,
  GlobalOutlined,
  FileTextOutlined,
  SwapOutlined,
  TeamOutlined,
  PartitionOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';

// 导出社交账号定义，供跨库使用
export interface SocialAccount {
  platform: 'weibo' | 'wechat' | 'douyin' | 'qq';
  username: string;
  id: string; // 账号ID
  followers: string;
  url: string; // 主页 URL
  status: 'active' | 'frozen' | 'monitored';
}

// 模拟帖文原文数据接口
export interface PostItem {
  id: string;
  title?: string;
  content: string;
  publishTime: string;
  platform: 'weibo' | 'wechat' | 'douyin' | 'qq';
  author: string;
  authorId: string;
  reposts: number;
  comments: number;
  likes: number;
  ipAddress?: string;
  captureTime?: string;
}

export interface PersonItem {
  id: string;
  name: string;
  gender: string;
  age: number;
  nation: string;
  birthday: string;
  idCard: string;
  phone: string;
  residentAddress: string; // 居住地
  registeredAddress: string; // 户籍地
  type: string; // 人员类型
  riskLevel: 'high' | 'medium' | 'low';
  tags: string[]; // 胶囊标签
  socialAccounts: SocialAccount[];
  department: string; // 责任属地
  status: 'monitored' | 'convinced' | 'left' | 'normal';
  lastActive: string;
  incidentCount: number; // 关联事件总数
  recordList: PostItem[]; // 客观帖文脉络流
  note: string; // 备注
  
  // 新增双源头相关字段
  source: 'opinion' | 'stability' | 'both'; // 舆情指令来源 / 涉稳登记来源 / 双源头融合
  peopleType: 'media' | 'kol' | 'normal'; // 网民类型: 自媒体 / 大V / 普通网民
  opinionTags?: string[]; // 舆情类型标签 (如：外卖员、出租车群体、某小区业主等)
  groupTag?: string; // 涉稳群体 (涉稳特征) (如：外卖员、出租车群体、某小区业主等)
}

// 标签数据定义
export interface ManagedTag {
  key: string;
  title: string;
  type: 'opinion' | 'stability'; // 舆情标签 / 涉稳标签
  children?: ManagedTag[];
}

export const DEFAULT_MANAGED_TAGS: ManagedTag[] = [
  {
    key: '1',
    title: '外卖员群体',
    type: 'opinion',
    children: [
      { key: '1-1', title: '美团骑手', type: 'opinion' },
      { key: '1-2', title: '饿了么骑手', type: 'opinion' },
    ]
  },
  {
    key: '2',
    title: '出租车群体',
    type: 'opinion',
    children: [
      { key: '2-1', title: '巡游出租车', type: 'opinion' },
      { key: '2-2', title: '网约车司机', type: 'opinion' },
    ]
  },
  {
    key: '3',
    title: '某小区业主',
    type: 'opinion',
    children: [
      { key: '3-1', title: '金地花园业主', type: 'opinion' },
      { key: '3-2', title: '景湖花园业主', type: 'opinion' },
    ]
  },
  {
    key: '4',
    title: '房产维权',
    type: 'stability',
    children: [
      { key: '4-1', title: '延期交房', type: 'stability' },
      { key: '4-2', title: '烂尾聚集', type: 'stability' },
    ]
  },
  {
    key: '5',
    title: '环保维权',
    type: 'stability',
    children: [
      { key: '5-1', title: '废气排放', type: 'stability' },
      { key: '5-2', title: '污水污染', type: 'stability' },
    ]
  },
  {
    key: '6',
    title: '退役军人',
    type: 'stability'
  },
  {
    key: '7',
    title: '涉法涉诉',
    type: 'stability'
  }
];

export const getTagOptionsByType = (tags: ManagedTag[], type: 'opinion' | 'stability'): { value: string, label: string }[] => {
  const result: { value: string, label: string }[] = [];
  const traverse = (node: ManagedTag) => {
    if (node.type === type) {
      result.push({ value: node.title, label: node.title });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  tags.forEach(traverse);
  // 去重
  const seen = new Set<string>();
  return result.filter(item => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
};

export const generateMockPeople = (): PersonItem[] => {
  const list: PersonItem[] = [];
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
  const maleNames = ['建国', '强', '刚', '伟', '勇', '军', '平', '保国', '超', '杰', '明', '辉', '波', '健', '涛', '飞', '鑫', '亮', '洋', '帅'];
  const femaleNames = ['梅', '娜', '丽', '敏', '静', '雅', '萍', '红', '玲', '芳', '倩', '婷', '娟', '燕', '莉', '霞', '丹', '洁', '慧', '欣'];
  const depts = ['淮安区', '清江浦区', '洪泽区'];
  
  const categories = [
    { key: '房产维权', parent: '维权群体', tags: ['维权群体', '房产维权', '业主骨干'], source: 'stability' as const },
    { key: '环保维权', parent: '维权群体', tags: ['维权群体', '环保维权', '村民代表'], source: 'stability' as const },
    { key: '医患群体', parent: '维权群体', tags: ['维权群体', '医患群体', '医疗纠纷'], source: 'stability' as const },
    { key: '自媒体', parent: '网络大V', tags: ['网络大V', '自媒体', '爆料拍客', '淮安生活圈'], source: 'opinion' as const },
    { key: '本地生活', parent: '网络大V', tags: ['网络大V', '本地生活', '房产参谋', '买房避坑'], source: 'opinion' as const },
    { key: '退役军人', parent: '特殊诉求', tags: ['特殊诉求', '退役军人', '安置诉求'], source: 'stability' as const },
    { key: '涉法涉诉', parent: '特殊诉求', tags: ['特殊诉求', '涉法涉诉', '申诉上访'], source: 'stability' as const },
  ];

  let idCounter = 1;

  categories.forEach((cat) => {
    // 每个类别生成 10 个账号 (共 70 个账号)
    for (let i = 1; i <= 10; i++) {
      const isMale = Math.random() > 0.3;
      const lastName = lastNames[(i * 7 + idCounter) % lastNames.length];
      const firstName = isMale 
        ? maleNames[(i * 3 + idCounter) % maleNames.length]
        : femaleNames[(i * 5 + idCounter) % femaleNames.length];
      const name = lastName + firstName;
      
      const gender = isMale ? '男' : '女';
      const age = 26 + (idCounter % 38);
      const birthYear = 2026 - age;
      const birthday = `${birthYear}-05-12`;
      
      // 真实身份证，固定几个前缀以便于后面进行碰撞测试
      // 比如，让第 1 个人的身份证固定为 320802198506101234
      const idCard = idCounter === 1 
        ? '320802198506101234'
        : `320802${birthYear}05120${idCounter % 9 + 1}X`;
      const phone = idCounter === 1
        ? '13905178888'
        : `13${(3 + idCounter % 7)}7233${1000 + idCounter}`;
      
      const dept = depts[idCounter % depts.length];
      const residentAddress = `江苏省淮安市${dept}开明路${10 + i * 2}号院${i}号楼301室`;
      const registeredAddress = `江苏省淮安市${dept}流均镇庄村${i * 3}号`;
      const riskLevel = i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low';
      
      const socialAccounts: SocialAccount[] = [];
      socialAccounts.push({
        platform: idCounter % 2 === 0 ? 'weibo' : 'wechat',
        username: idCounter % 2 === 0 ? `淮安热议_${name}` : `${name}_社群代表`,
        id: idCounter % 2 === 0 ? `wb_${idCounter * 123}` : `wx_${idCounter * 321}`,
        followers: idCounter % 2 === 0 ? `${i * 1200}` : '500+',
        url: '内网取证映射链接',
        status: 'active'
      });

      // 帖文脉络
      const recordList: PostItem[] = [];
      recordList.push({
        id: `POST_${idCounter}_1`,
        content: `【原帖快照】针对本地当前热议维权诉求，本人号召大伙前往有关部门反应情况，合理维权，大家不要退缩！`,
        publishTime: `2026-07-07 10:20`,
        platform: socialAccounts[0].platform,
        author: socialAccounts[0].username,
        authorId: socialAccounts[0].id,
        reposts: i * 2,
        comments: i * 3,
        likes: i * 12,
        ipAddress: '10.32.122.45',
        captureTime: `2026-07-07 10:25`
      });

      // 设定是否为双源头融合（让第1, 11, 21个用户默认为 both，模拟已经过碰撞合并的情况）
      let finalSource: 'opinion' | 'stability' | 'both' = cat.source;
      if (idCounter === 1 || idCounter === 11 || idCounter === 21) {
        finalSource = 'both';
      }

      list.push({
        id: `PERSON_${idCounter}`,
        name,
        gender,
        age,
        nation: '汉族',
        birthday,
        idCard,
        phone,
        residentAddress,
        registeredAddress,
        type: cat.parent,
        riskLevel,
        tags: cat.tags,
        socialAccounts,
        department: dept,
        status: 'monitored',
        lastActive: '2026-07-07 10:20',
        incidentCount: i + 1,
        recordList,
        note: '内网涉稳与舆情重点关注对象',
        
        // 关键扩展字段
        source: finalSource,
        peopleType: cat.key === '自媒体' ? 'media' : cat.key === '本地生活' ? 'kol' : 'normal',
        opinionTags: (finalSource === 'both' || finalSource === 'opinion')
          ? [idCounter % 3 === 0 ? '外卖员' : idCounter % 3 === 1 ? '出租车群体' : '某小区业主']
          : undefined,
        groupTag: (finalSource === 'both' || finalSource === 'stability')
          ? (cat.source === 'stability' ? cat.key : (idCounter % 2 === 0 ? '出租车群体' : '某小区业主'))
          : undefined
      });
      
      idCounter++;
    }
  });

  // 随机挑选 20 个用户索引进行多事件关联、多个类型标签、多账号绑定的深度扩容
  const expandIndices = [1, 4, 7, 11, 14, 17, 21, 24, 27, 31, 34, 37, 41, 44, 47, 51, 54, 57, 61, 64];
  expandIndices.forEach((idx) => {
    if (idx < list.length) {
      const p = list[idx];
      // 1. 多事件关联：设定关联事件数为 4-8 件
      p.incidentCount = (idx * 3) % 5 + 4;
      
      // 2. 增加多条不同指向事件的客观取证发帖
      p.recordList.push(
        {
          id: `POST_${idx}_ADD_1`,
          content: `【二次取证快照】关于洪泽垃圾焚烧厂清晨偷偷排放黄色有毒气体的视频转发！环保指标弄虚作假，周边庄稼水井均受波及，请环保局给合理解释！`,
          publishTime: `2026-07-06 15:30`,
          platform: 'douyin',
          author: p.socialAccounts[0]?.username || p.name,
          authorId: p.socialAccounts[0]?.id || `dy_${idx}`,
          reposts: idx + 5,
          comments: idx + 8,
          likes: idx * 8
        },
        {
          id: `POST_${idx}_ADD_2`,
          content: `【上访动向取证】关于流均镇承包土地流转补偿款拖欠三年的维权联署发帖。农民讨生活艰难，必须讨要说法，各位本周三上午准时在翔宇大道路口集合！`,
          publishTime: `2026-07-05 11:15`,
          platform: 'weibo',
          author: p.socialAccounts[0]?.username || p.name,
          authorId: p.socialAccounts[0]?.id || `wb_${idx}`,
          reposts: idx + 10,
          comments: idx + 15,
          likes: idx * 10
        }
      );

      // 3. 多个类型标签重合：融合另一个方向的标签
      if (p.tags.includes('房产维权')) {
        p.tags = [...p.tags, '环保维权', '阻碍厂区', '多度预警'];
        p.groupTag = '房产及环保双重诉求';
      } else if (p.tags.includes('退役军人')) {
        p.tags = [...p.tags, '房产维权', '涉法涉诉', '重点上访人'];
        p.groupTag = '安置及房产诉求';
      } else {
        p.tags = [...p.tags, '舆情带头人', '自媒体炒作', '高频串联'];
        p.peopleType = 'media'; // 标记为自媒体大V特征
      }

      // 4. 追加社媒账号绑定，体现社媒矩阵监控
      p.socialAccounts.push(
        {
          platform: 'douyin',
          username: `淮安说事_${p.name}`,
          id: `dy_story_${idx * 99}`,
          followers: '2.5万',
          url: '内网取证绑定',
          status: 'monitored'
        },
        {
          platform: 'wechat',
          username: `${p.name}_正义发声`,
          id: `wx_justice_${idx * 88}`,
          followers: '450+',
          url: '内网封包映射',
          status: 'active'
        }
      );
    }
  });

  return list;
};

// 群体/多级标签折叠折缩函数：超过2个，只展示第1个，其余部分以 +n 带有 Tooltip 展现
export const renderTagsWithCollapse = (tags: string[]) => {
  if (!tags || tags.length === 0) return <span style={{ color: '#ccc', fontSize: '10px' }}>无标签</span>;
  
  if (tags.length <= 2) {
    return (
      <Space size={4} wrap>
        {tags.map((t, idx) => (
          <Tag color="blue" style={{ margin: 0, fontSize: '10px' }} key={idx}>{t}</Tag>
        ))}
      </Space>
    );
  }
  
  const visibleTag = tags[0];
  const remainingCount = tags.length - 1;
  const remainingTags = tags.slice(1).join('、');

  return (
    <Space size={4} align="center">
      <Tag color="blue" style={{ margin: 0, fontSize: '10px' }}>{visibleTag}</Tag>
      <Tooltip title={`其余标签: ${remainingTags}`} placement="top">
        <Tag color="default" style={{ margin: 0, fontSize: '10px', cursor: 'pointer', border: '1px solid #d9d9d9' }}>
          +{remainingCount}
        </Tag>
      </Tooltip>
    </Space>
  );
};

// 预制标签分类树
const initialCategoryTree = [
  {
    title: '网络大V',
    key: '大V',
    children: [
      { title: '自媒体', key: '自媒体' },
      { title: '本地生活', key: '本地生活' },
    ],
  },
  {
    title: '维权群体',
    key: '维权',
    children: [
      { title: '房产维权', key: '房产维权' },
      { title: '环保维权', key: '环保维权' },
      { title: '医患群体', key: '医患群体' },
    ],
  },
  {
    title: '特殊诉求群体',
    key: '特殊',
    children: [
      { title: '退役军人', key: '退役军人' },
      { title: '涉法涉诉', key: '涉法涉诉' },
    ],
  },
];

const PeopleDatabase: React.FC = () => {
  const [peopleList, setPeopleList] = useState<PersonItem[]>(generateMockPeople());
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card'); // 默认卡片视图
  
  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>('all');
  
  // 新增：人员来源筛选状态 (默认选中舆情指令来源板块)
  const [selectedSource, setSelectedSource] = useState<'all' | 'opinion' | 'stability'>('opinion');

  // 人员详情 Modal
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);

  // 取证穿透 Modal
  const [penetrateVisible, setPenetrateVisible] = useState(false);
  const [penetratePost, setPenetratePost] = useState<PostItem | null>(null);

  // 两套独立录入登记弹窗控制
  const [opinionModalVisible, setOpinionModalVisible] = useState(false);
  const [stabilityModalVisible, setStabilityModalVisible] = useState(false);

  // 碰撞合并警告 Modal 控制
  const [collisionVisible, setCollisionVisible] = useState(false);
  
  // 用于存储当前正在试图登记但发生冲突的人员表单快照和重合的现有档案人员
  const [pendingRegisterData, setPendingRegisterData] = useState<any>(null);
  const [collidedPerson, setCollidedPerson] = useState<PersonItem | null>(null);
  const [collisionSourceType, setCollisionSourceType] = useState<'opinion' | 'stability'>('opinion');

  const [opinionForm] = Form.useForm();
  const [stabilityForm] = Form.useForm();

  // 标签管理状态与同步
  const [tagManagerVisible, setTagManagerVisible] = useState(false);
  const [tagForm] = Form.useForm();
  const [tagFilterType, setTagFilterType] = useState<'all' | 'opinion' | 'stability'>('all');
  const [selectedTagKey, setSelectedTagKey] = useState<string | null>(null);

  const [managedTags, setManagedTags] = useState<ManagedTag[]>(() => {
    const saved = localStorage.getItem('LAN_YING_MANAGED_TAGS');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_MANAGED_TAGS;
  });

  React.useEffect(() => {
    if (tagManagerVisible) {
      const saved = localStorage.getItem('LAN_YING_MANAGED_TAGS');
      if (saved) {
        try {
          setManagedTags(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [tagManagerVisible]);

  const saveTags = (newTags: ManagedTag[]) => {
    setManagedTags(newTags);
    localStorage.setItem('LAN_YING_MANAGED_TAGS', JSON.stringify(newTags));
  };

  const updateTagNode = (tagsList: ManagedTag[], key: string, newTitle: string, newType: 'opinion' | 'stability'): ManagedTag[] => {
    return tagsList.map(node => {
      if (node.key === key) {
        return { ...node, title: newTitle, type: newType };
      }
      if (node.children) {
        return { ...node, children: updateTagNode(node.children, key, newTitle, newType) };
      }
      return node;
    });
  };

  const deleteTagNode = (tagsList: ManagedTag[], key: string): ManagedTag[] => {
    return tagsList
      .filter(node => node.key !== key)
      .map(node => {
        if (node.children) {
          return { ...node, children: deleteTagNode(node.children, key) };
        }
        return node;
      });
  };

  const addChildTagNode = (tagsList: ManagedTag[], parentKey: string, newNode: ManagedTag): ManagedTag[] => {
    return tagsList.map(node => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), newNode]
        };
      }
      if (node.children) {
        return { ...node, children: addChildTagNode(node.children, parentKey, newNode) };
      }
      return node;
    });
  };

  const handleSelectTagNode = (selectedKeys: any[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0];
      setSelectedTagKey(key);
      const findNode = (list: ManagedTag[]): ManagedTag | null => {
        for (const node of list) {
          if (node.key === key) return node;
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(managedTags);
      if (node) {
        tagForm.setFieldsValue({
          title: node.title,
          type: node.type,
        });
      }
    } else {
      setSelectedTagKey(null);
      tagForm.resetFields();
    }
  };

  const handleSaveTagForm = () => {
    tagForm.validateFields().then(values => {
      if (!selectedTagKey) return;
      const updated = updateTagNode(managedTags, selectedTagKey, values.title, values.type);
      saveTags(updated);
    });
  };

  const handleAddRootTag = () => {
    const newKey = `tag_${Date.now()}`;
    const newTag: ManagedTag = {
      key: newKey,
      title: '新建根标签',
      type: tagFilterType === 'all' ? 'opinion' : tagFilterType
    };
    const updated = [...managedTags, newTag];
    saveTags(updated);
    setSelectedTagKey(newKey);
    tagForm.setFieldsValue({
      title: newTag.title,
      type: newTag.type
    });
    message.success('已新建根标签，您可在右侧表单中修改其属性');
  };

  const handleAddChildTag = () => {
    if (!selectedTagKey) {
      message.warning('请先在左侧选择一个父级标签节点');
      return;
    }
    const newKey = `tag_${Date.now()}`;
    const newTag: ManagedTag = {
      key: newKey,
      title: '新建子标签',
      type: tagForm.getFieldValue('type') || 'opinion'
    };
    const updated = addChildTagNode(managedTags, selectedTagKey, newTag);
    saveTags(updated);
    setSelectedTagKey(newKey);
    tagForm.setFieldsValue({
      title: newTag.title,
      type: newTag.type
    });
    message.success('已在所选节点下新建子标签');
  };

  const handleDeleteSelectedTag = () => {
    if (!selectedTagKey) return;
    Modal.confirm({
      title: '确认要删除该标签吗？',
      content: '删除此标签将连同其所有下级子标签一并移除，且不可恢复！',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const updated = deleteTagNode(managedTags, selectedTagKey);
        saveTags(updated);
        setSelectedTagKey(null);
        tagForm.resetFields();
        message.success('标签已成功删除');
      }
    });
  };

  const getFilteredTagTree = (tagsList: ManagedTag[]): ManagedTag[] => {
    if (tagFilterType === 'all') return tagsList;
    const filter = (list: ManagedTag[]): ManagedTag[] => {
      return list
        .map(node => {
          const matchingChildren = node.children ? filter(node.children) : [];
          if (node.type === tagFilterType || matchingChildren.length > 0) {
            return {
              ...node,
              children: matchingChildren.length > 0 ? matchingChildren : undefined
            };
          }
          return null;
        })
        .filter(Boolean) as ManagedTag[];
    };
    return filter(tagsList);
  };

  // 动态生成的选项列表
  const opinionTagOptions = getTagOptionsByType(managedTags, 'opinion');
  const stabilityTagOptions = getTagOptionsByType(managedTags, 'stability');

  // 触发防重检测碰撞逻辑
  const checkCollision = (idCard: string, phone: string, platform?: string, accountId?: string) => {
    // 检测身份证或手机号
    const match = peopleList.find(
      p => (idCard && p.idCard === idCard) || (phone && p.phone === phone)
    );
    if (match) return match;

    // 检测社交账号 ID 碰撞
    if (platform && accountId) {
      const matchSocial = peopleList.find(p =>
        p.socialAccounts.some(sa => sa.platform === platform && sa.id === accountId)
      );
      if (matchSocial) return matchSocial;
    }
    return null;
  };

  // 舆情指令来源人员登记提交
  const handleOpinionSubmit = () => {
    opinionForm.validateFields().then((values) => {
      const collision = checkCollision(values.idCard, values.phone, values.platform, values.accountId);
      if (collision) {
        // 发生碰撞！拦截并弹出碰撞 Modal
        setCollidedPerson(collision);
        setPendingRegisterData(values);
        setCollisionSourceType('opinion');
        setCollisionVisible(true);
        return;
      }

      // 未碰撞，正常录入新网民人员
      const newPerson: PersonItem = {
        id: `PERSON_${Date.now()}`,
        name: values.name,
        gender: '男',
        age: 35,
        nation: '汉族',
        birthday: '1991-05-12',
        idCard: values.idCard,
        phone: values.phone,
        residentAddress: '江苏省淮安市清江浦区淮海路1号',
        registeredAddress: '江苏省淮安市清江浦区淮海路1号',
        type: '网络大V',
        riskLevel: 'medium',
        tags: ['舆情录入', '自媒体大V'],
        socialAccounts: [
          {
            platform: values.platform,
            username: values.nickname,
            id: values.accountId,
            followers: '10万+',
            url: '内网封包映射',
            status: 'active'
          }
        ],
        department: '清江浦区',
        status: 'monitored',
        lastActive: '2026-07-07 10:20',
        incidentCount: 1,
        recordList: [
          {
            id: `POST_${Date.now()}`,
            content: `【网民原始言论快照】：${values.nickname} 发表在 ${values.platform} 的涉舆敏感贴文快照记录。`,
            publishTime: '2026-07-07 10:20',
            platform: values.platform,
            author: values.nickname,
            authorId: values.accountId,
            reposts: 5,
            comments: 12,
            likes: 45
          }
        ],
        note: '由舆情指令来源快速建档登记',
        source: 'opinion',
        peopleType: values.peopleType || 'media',
        opinionTags: values.opinionTags || []
      };

      setPeopleList([newPerson, ...peopleList]);
      message.success(`成功在人员库中建立【舆情来源】档案: ${values.name}`);
      setOpinionModalVisible(false);
      opinionForm.resetFields();
    });
  };

  // 涉稳登记来源人员登记提交
  const handleStabilitySubmit = () => {
    stabilityForm.validateFields().then((values) => {
      const collision = checkCollision(values.idCard, values.phone, values.platform, values.accountId);
      if (collision) {
        // 发生碰撞！拦截并弹出碰撞 Modal
        setCollidedPerson(collision);
        setPendingRegisterData(values);
        setCollisionSourceType('stability');
        setCollisionVisible(true);
        return;
      }

      // 未碰撞，正常录入新网民人员
      const newPerson: PersonItem = {
        id: `PERSON_${Date.now()}`,
        name: values.name,
        gender: '男',
        age: 38,
        nation: '汉族',
        birthday: '1988-06-10',
        idCard: values.idCard,
        phone: values.phone,
        residentAddress: '江苏省淮安市淮安区翔宇大道100号',
        registeredAddress: '江苏省淮安市淮安区翔宇大道100号',
        type: '维权群体',
        riskLevel: 'high',
        tags: ['涉稳登记', values.groupTag],
        socialAccounts: [
          {
            platform: values.platform,
            username: values.nickname,
            id: values.accountId,
            followers: '100+',
            url: '内网封包映射',
            status: 'monitored'
          }
        ],
        department: '淮安区',
        status: 'monitored',
        lastActive: '2026-07-07 10:20',
        incidentCount: 1,
        recordList: [
          {
            id: `POST_${Date.now()}`,
            content: `【涉稳网民快照】：在社群中发表涉群体性聚集的相关串联快照。`,
            publishTime: '2026-07-07 10:20',
            platform: values.platform,
            author: values.nickname,
            authorId: values.accountId,
            reposts: 0,
            comments: 2,
            likes: 4
          }
        ],
        note: '由涉稳渠道来源手工建档登记',
        source: 'stability',
        peopleType: 'normal',
        groupTag: values.groupTag
      };

      setPeopleList([newPerson, ...peopleList]);
      message.success(`成功在人员库中建立【涉稳来源】档案: ${values.name}`);
      setStabilityModalVisible(false);
      stabilityForm.resetFields();
    });
  };

  // 防重碰撞合并画像逻辑
  const handleExecuteMerge = () => {
    if (!collidedPerson || !pendingRegisterData) return;

    const updated = peopleList.map((p) => {
      if (p.id === collidedPerson.id) {
        // 画像融合合并
        const mergedSource: 'both' = 'both';
        
        // 保留原有的和新录入的特质
        const updatedPeopleType = collisionSourceType === 'opinion' 
          ? pendingRegisterData.peopleType 
          : p.peopleType;

        const updatedGroupTag = collisionSourceType === 'stability'
          ? pendingRegisterData.groupTag
          : p.groupTag;

        const updatedOpinionTags = collisionSourceType === 'opinion'
          ? pendingRegisterData.opinionTags || []
          : [];
        const mergedOpinionTags = Array.from(new Set([
          ...(p.opinionTags || []),
          ...updatedOpinionTags
        ]));

        // 追加社媒账号
        const hasSocial = p.socialAccounts.some(
          sa => sa.platform === pendingRegisterData.platform && sa.id === pendingRegisterData.accountId
        );
        const newSocialList = [...p.socialAccounts];
        if (!hasSocial && pendingRegisterData.platform && pendingRegisterData.accountId) {
          newSocialList.push({
            platform: pendingRegisterData.platform,
            username: pendingRegisterData.nickname,
            id: pendingRegisterData.accountId,
            followers: '新录入绑定',
            url: '内网封包映射',
            status: 'monitored'
          });
        }

        // 追加标签
        const newTags = Array.from(new Set([
          ...p.tags, 
          '双源头融合', 
          collisionSourceType === 'opinion' ? '舆情录入' : pendingRegisterData.groupTag
        ].filter(Boolean) as string[]));

        return {
          ...p,
          source: mergedSource,
          peopleType: updatedPeopleType === 'normal' && p.peopleType !== 'normal' ? p.peopleType : updatedPeopleType,
          groupTag: updatedGroupTag,
          opinionTags: mergedOpinionTags,
          socialAccounts: newSocialList,
          tags: newTags,
          incidentCount: p.incidentCount + 1
        };
      }
      return p;
    });

    setPeopleList(updated);
    message.success(`画像已成功碰撞合并！网民 ${collidedPerson.name} 的档案已升级为双源头融合形态，社交账号已追加。`);
    
    // 关闭所有 Modal 弹窗
    setCollisionVisible(false);
    setOpinionModalVisible(false);
    setStabilityModalVisible(false);
    
    // 重置表单
    opinionForm.resetFields();
    stabilityForm.resetFields();
  };

  // 数据过滤逻辑
  const getFilteredPeople = () => {
    return peopleList.filter((p) => {
      // 1. 全局搜索
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCard = p.idCard.includes(query);
        const matchPhone = p.phone.includes(query);
        const matchSocial = p.socialAccounts.some(sa => sa.username.toLowerCase().includes(query) || sa.id.includes(query));
        if (!matchName && !matchCard && !matchPhone && !matchSocial) return false;
      }
      // 2. 风险等级
      if (selectedRisk !== 'all' && p.riskLevel !== selectedRisk) return false;
      // 3. 属地
      if (selectedDept !== 'all' && p.department !== selectedDept) return false;
      // 4. 左侧标签树
      if (selectedTreeKey !== 'all') {
        const matchTree = p.tags.some(tag => tag === selectedTreeKey);
        if (!matchTree) return false;
      }
      // 5. 新增：人员来源筛选
      if (selectedSource !== 'all') {
        if (selectedSource === 'opinion' && p.source !== 'opinion' && p.source !== 'both') return false;
        if (selectedSource === 'stability' && p.source !== 'stability' && p.source !== 'both') return false;
      }

      return true;
    });
  };

  const currentList = getFilteredPeople();

  // 获取卡片展示平台图标
  const renderPlatformIcons = (accounts: SocialAccount[]) => {
    return (
      <Space size={6} style={{ marginTop: '6px' }}>
        {accounts.some(a => a.platform === 'weibo') && <WeiboOutlined style={{ color: '#df2029', fontSize: '15px' }} />}
        {accounts.some(a => a.platform === 'wechat') && <WechatOutlined style={{ color: '#09bb07', fontSize: '15px' }} />}
        {accounts.some(a => a.platform === 'douyin') && <SwapOutlined style={{ color: '#000', fontSize: '15px' }} />}
      </Space>
    );
  };

  // 得到卡片帖文标题
  const getPostDisplayTitle = (post: PostItem) => {
    if (post.title) return post.title;
    return post.content.length > 25 ? post.content.substring(0, 25) + '...' : post.content;
  };

  const handleOpenPenetrate = (post: PostItem) => {
    setPenetratePost(post);
    setPenetrateVisible(true);
  };

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {/* 数据指标看板 */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={6}>
            <Card size="small" style={{ background: '#fff1f0', borderLeft: '4px solid #ff4d4f' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>高风险人员 (Red)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#cf1322', marginTop: '4px' }}>
                {peopleList.filter(p => p.riskLevel === 'high').length} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>人</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#f6ffed', borderLeft: '4px solid #52c41a' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>在库重点人员总数</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#389e0d', marginTop: '4px' }}>
                {peopleList.length} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>人</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#e6f7ff', borderLeft: '4px solid #1890ff' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>已绑定监控账号</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#096dd9', marginTop: '4px' }}>
                {peopleList.reduce((acc, curr) => acc + curr.socialAccounts.length, 0)} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>个</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ background: '#f9f0ff', borderLeft: '4px solid #722ed1' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>双源头融合画像人员</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#531dab', marginTop: '4px' }}>
                {peopleList.filter(p => p.source === 'both').length} <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>人</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 主体双栏布局 */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px' }}>
          {/* 左侧多级标签树 */}
          <Card size="small" className="filter-sidebar-card" style={{ height: 'calc(100vh - 270px)', overflowY: 'auto' }}>
            <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PartitionOutlined />
              <span>人员属性多级分类</span>
            </div>
            <Tree
              defaultExpandAll
              treeData={[
                { title: '展示全部人员', key: 'all' },
                ...initialCategoryTree
              ]}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedTreeKey(keys[0] as string);
                }
              }}
            />
          </Card>

          {/* 右侧主区域 */}
          <div>
            {/* 新增：人员来源大 Tab 切换（带各来源人数动态统计，以 Segmented 渲染） */}
            <div style={{ marginBottom: '12px' }}>
              <Segmented
                size="large"
                className="custom-segmented-tab"
                value={selectedSource}
                onChange={(val) => setSelectedSource(val as any)}
                options={[
                  {
                    label: (
                      <div style={{ padding: '2px 12px', fontSize: '13.5px' }}>
                        <FileTextOutlined style={{ color: '#1890ff', marginRight: '6px' }} />
                        舆情指令人员库 ({peopleList.filter(p => p.source === 'opinion' || p.source === 'both').length}人)
                      </div>
                    ),
                    value: 'opinion',
                  },
                  {
                    label: (
                      <div style={{ padding: '2px 12px', fontSize: '13.5px' }}>
                        <TeamOutlined style={{ color: '#722ed1', marginRight: '6px' }} />
                        涉稳登记人员库 ({peopleList.filter(p => p.source === 'stability' || p.source === 'both').length}人)
                      </div>
                    ),
                    value: 'stability',
                  },
                  {
                    label: (
                      <div style={{ padding: '2px 12px', fontSize: '13.5px' }}>
                        <UsergroupAddOutlined style={{ color: '#52c41a', marginRight: '6px' }} />
                        全部人员总台账 ({peopleList.length}人)
                      </div>
                    ),
                    value: 'all',
                  },
                ]}
                style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: '6px' }}
              />
            </div>

            {/* 顶部综合筛选区 */}
            <Card size="small" style={{ marginBottom: '12px' }}>
              <Row gutter={12} align="middle">
                {/* 搜索 */}
                <Col span={7}>
                  <Input
                    placeholder="姓名/身份证号/手机号/社交ID..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>

                {/* 风险等级 */}
                <Col span={5}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>风险:</span>
                    <Select
                      style={{ width: '100%' }}
                      value={selectedRisk}
                      onChange={setSelectedRisk}
                      options={[
                        { value: 'all', label: '全部' },
                        { value: 'high', label: '高风险' },
                        { value: 'medium', label: '中风险' },
                        { value: 'low', label: '低风险' },
                      ]}
                    />
                  </div>
                </Col>

                {/* 责任属地 */}
                <Col span={5}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>属地:</span>
                    <Select
                      style={{ width: '100%' }}
                      value={selectedDept}
                      onChange={setSelectedDept}
                      options={[
                        { value: 'all', label: '全部' },
                        { value: '淮安区', label: '淮安区' },
                        { value: '清江浦区', label: '清江浦区' },
                        { value: '洪泽区', label: '洪泽区' },
                      ]}
                    />
                  </div>
                </Col>

                {/* 视图切换与手工登记按钮组 */}
                <Col span={7} style={{ textAlign: 'right' }}>
                  <Space>
                    <Segmented
                      value={viewMode}
                      onChange={(val) => setViewMode(val as any)}
                      options={[
                        { value: 'card', icon: <AppstoreOutlined /> },
                        { value: 'table', icon: <UnorderedListOutlined /> },
                      ]}
                    />

                    {/* 双通道登记下拉菜单（新增） */}
                    <Button 
                      icon={<SettingOutlined />} 
                      onClick={() => setTagManagerVisible(true)}
                    >
                      标签管理
                    </Button>

                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'opinion',
                            icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
                            label: '登记舆情指令重点网民',
                            onClick: () => setOpinionModalVisible(true),
                          },
                          {
                            key: 'stability',
                            icon: <TeamOutlined style={{ color: '#722ed1' }} />,
                            label: '登记涉稳源头重点网民',
                            onClick: () => setStabilityModalVisible(true),
                          },
                        ],
                      }}
                      placement="bottomRight"
                    >
                      <Button type="primary" icon={<UserAddOutlined />}>
                        登记人员
                      </Button>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* 内容列表渲染 */}
            {viewMode === 'card' ? (
              /* ================== 卡片视图 ================== */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {currentList.map((person) => {
                  let borderTop = '3px solid #d9d9d9';
                  if (person.riskLevel === 'high') borderTop = '3px solid #ff4d4f';
                  else if (person.riskLevel === 'medium') borderTop = '3px solid #faad14';
                  else if (person.riskLevel === 'low') borderTop = '3px solid #1890ff';

                  return (
                    <Card
                      key={person.id}
                      size="small"
                      hoverable
                      onClick={() => {
                        setSelectedPerson(person);
                        setDetailVisible(true);
                      }}
                      style={{ borderTop, position: 'relative' }}
                    >
                      {/* 融合状态标识（红/蓝/紫角标） */}
                      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        {person.source === 'both' ? (
                          <Tag color="red" style={{ margin: 0, fontSize: '10px', padding: '0 4px' }}>融合</Tag>
                        ) : person.source === 'opinion' ? (
                          <Tag color="blue" style={{ margin: 0, fontSize: '10px', padding: '0 4px' }}>舆情</Tag>
                        ) : (
                          <Tag color="purple" style={{ margin: 0, fontSize: '10px', padding: '0 4px' }}>涉稳</Tag>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar style={{ backgroundColor: '#87d068' }}>{person.name[0]}</Avatar>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{person.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{person.gender} | {person.age}岁</div>
                        </div>
                      </div>

                      <Divider style={{ margin: '8px 0' }} />

                      <div style={{ fontSize: '11.5px', color: '#666', lineHeight: '1.8' }}>
                        <div>属地: <strong>{person.department}</strong></div>
                        {/* 融合属性展示 */}
                        <div>类型: <strong style={{ marginLeft: '4px' }}>
                          {person.peopleType === 'media' ? '自媒体' : person.peopleType === 'kol' ? '大V' : '普通网民'}
                        </strong></div>
                        {person.opinionTags && person.opinionTags.length > 0 && (
                          <div>舆情分类: 
                            <Space size={2} wrap style={{ marginLeft: '4px' }}>
                              {person.opinionTags.map(t => <Tag color="blue" key={t} style={{ fontSize: '9px', padding: '0 4px', margin: 0 }}>{t}</Tag>)}
                            </Space>
                          </div>
                        )}
                        {person.groupTag && (
                          <div>涉稳群体: <Tag color="purple" style={{ fontSize: '9px', padding: '0 4px', marginLeft: '4px', margin: 0 }}>{person.groupTag}</Tag></div>
                        )}
                        <div style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#888' }}>登记群标:</span>
                          {renderTagsWithCollapse(person.tags)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>社媒平台:</span>
                          {renderPlatformIcons(person.socialAccounts)}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* ================== 表格视图 ================== */
              <Card size="small">
                <Table
                  dataSource={currentList}
                  rowKey="id"
                  size="middle"
                  bordered
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedPerson(record);
                      setDetailVisible(true);
                    }
                  })}
                  columns={[
                    {
                      title: '重点人姓名',
                      dataIndex: 'name',
                      key: 'name',
                      width: 100,
                      render: (text, record) => (
                        <Space>
                          <strong>{text}</strong>
                          {record.source === 'both' && <Tag color="red">融合</Tag>}
                        </Space>
                      )
                    },
                    {
                      title: '基本特征',
                      key: 'info',
                      width: 110,
                      render: (_, r) => <span>{r.gender} | {r.age}岁</span>
                    },
                    {
                      title: '脱敏身份证号',
                      dataIndex: 'idCard',
                      key: 'idCard',
                      render: (val: string) => <code>{val.substring(0, 6)}********{val.substring(14)}</code>
                    },
                    {
                      title: '脱敏手机号',
                      dataIndex: 'phone',
                      key: 'phone',
                      render: (val: string) => <span>{val.substring(0, 3)}****{val.substring(7)}</span>
                    },
                    {
                      title: '人员来源',
                      dataIndex: 'source',
                      key: 'source',
                      render: (val) => {
                        if (val === 'both') return <Tag color="red">双源头融合</Tag>;
                        if (val === 'opinion') return <Tag color="blue">舆情指令</Tag>;
                        return <Tag color="purple">涉稳登记</Tag>;
                      }
                    },
                    {
                      title: '风险等级',
                      dataIndex: 'riskLevel',
                      key: 'riskLevel',
                      width: 100,
                      render: (val) => {
                        if (val === 'high') return <Tag color="red">高风险</Tag>;
                        if (val === 'medium') return <Tag color="orange">中风险</Tag>;
                        return <Tag color="blue">低风险</Tag>;
                      }
                    },
                    {
                      title: '群体类别/多级标签',
                      dataIndex: 'tags',
                      key: 'tags',
                      width: 160,
                      render: (tags: string[]) => renderTagsWithCollapse(tags)
                    },
                    {
                      title: '责任属地',
                      dataIndex: 'department',
                      key: 'department',
                      width: 100,
                    }
                  ]}
                />
              </Card>
            )}
          </div>
        </div>

        {/* 人员全量画像大弹窗（包含双源头融合身份展现） */}
        <Modal
          title={
            <span>
              <FileSearchOutlined /> 蓝鹰人员全量画像监视台账
            </span>
          }
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>
              关闭档案
            </Button>
          ]}
          width={850}
          centered
        >
          {selectedPerson && (
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '6px' }}>
              {/* 头部摘要栏 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f5f7fa', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                <Avatar size={54} style={{ backgroundColor: '#87d068', fontSize: '24px' }}>{selectedPerson.name[0]}</Avatar>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
                    {selectedPerson.name} 
                    <span style={{ fontSize: '13px', color: '#999', fontWeight: 'normal', marginLeft: '12px' }}>
                      {selectedPerson.gender} | {selectedPerson.age}岁 | {selectedPerson.nation}
                    </span>
                  </h3>
                  <Space style={{ marginTop: '4px' }}>
                    {selectedPerson.riskLevel === 'high' ? (
                      <Tag color="red">🔴 极高风险关注</Tag>
                    ) : selectedPerson.riskLevel === 'medium' ? (
                      <Tag color="orange">🟡 中度风险监控</Tag>
                    ) : (
                      <Tag color="blue">🔵 一般关注网民</Tag>
                    )}
                    <Tag color="cyan">属地: {selectedPerson.department}分局</Tag>
                    <Tag color="blue">关联取证事件: {selectedPerson.incidentCount}起</Tag>
                  </Space>
                </div>
              </div>

              {/* 关键：个人基本字段 Descriptions（包含双源头融合露出） */}
              <Descriptions title="内网登记基础特征" bordered size="small" column={2} style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="脱敏身份证"><code>{selectedPerson.idCard.substring(0, 6)}********{selectedPerson.idCard.substring(14)}</code></Descriptions.Item>
                <Descriptions.Item label="脱敏手机号"><span>{selectedPerson.phone.substring(0, 3)}****{selectedPerson.phone.substring(7)}</span></Descriptions.Item>
                
                {/* 来源标识双重融合表达 */}
                <Descriptions.Item label="人员建档来源" span={2}>
                  {selectedPerson.source === 'both' ? (
                    <Space>
                      <Tag color="red" style={{ fontWeight: 'bold' }}>双源头融合身份</Tag>
                      <Tag color="blue">舆情指令来源</Tag>
                      <Tag color="purple">涉稳登记来源</Tag>
                    </Space>
                  ) : selectedPerson.source === 'opinion' ? (
                    <Tag color="blue">舆情指令录入</Tag>
                  ) : (
                    <Tag color="purple">涉稳台账登记</Tag>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="网民类型 (舆情特征)">
                  {selectedPerson.peopleType === 'media' ? (
                    <Tag color="blue">自媒体</Tag>
                  ) : selectedPerson.peopleType === 'kol' ? (
                    <Tag color="purple">大V</Tag>
                  ) : (
                    <span style={{ color: '#8c8c8c' }}>普通网民</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="舆情类型标签">
                  {selectedPerson.opinionTags && selectedPerson.opinionTags.length > 0 ? (
                    <Space size={4} wrap>
                      {selectedPerson.opinionTags.map((t) => (
                        <Tag color="cyan" key={t}>{t}</Tag>
                      ))}
                    </Space>
                  ) : (
                    <span style={{ color: '#ccc' }}>无</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="涉稳群体 (涉稳特征)" span={2}>
                  {selectedPerson.groupTag ? (
                    <Tag color="red">{selectedPerson.groupTag}</Tag>
                  ) : (
                    <span style={{ color: '#ccc' }}>无</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="现详细居住地" span={2}>{selectedPerson.residentAddress}</Descriptions.Item>
                <Descriptions.Item label="备注管控说明" span={2}>{selectedPerson.note}</Descriptions.Item>
              </Descriptions>

              {/* 社交账号矩阵（一对多绑定） */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '13px' }}>绑定社交账号矩阵</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
                  {selectedPerson.socialAccounts.map((account, index) => (
                    <Card key={index} size="small" style={{ background: '#fafafa', border: '1px solid #e8e8e8' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          {account.platform === 'weibo' && <WeiboOutlined style={{ color: '#df2029' }} />}
                          {account.platform === 'wechat' && <WechatOutlined style={{ color: '#09bb07' }} />}
                          {account.platform === 'douyin' && <SwapOutlined style={{ color: '#000' }} />}
                          <strong style={{ fontSize: '12.5px' }}>{account.username}</strong>
                        </Space>
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>
                        <div>账号ID: <code>{account.id}</code></div>
                        <div>粉丝数量: {account.followers}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 取消AI或人工处理的概要/总结，完全转为以“帖文原文链接/标题”为核心的动态脉络 */}
              <div>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LinkOutlined style={{ color: '#1890ff' }} />
                  <span>客观取证帖文动态脉络流</span>
                  <span style={{ fontWeight: 'normal', color: '#999', fontSize: '11px' }}>(内网直达，不提供AI概要摘要)</span>
                </div>

                <Timeline style={{ paddingLeft: '8px', marginTop: '8px' }}>
                  {selectedPerson.recordList.map((post) => (
                    <Timeline.Item key={post.id} color={post.platform === 'weibo' ? 'red' : 'green'}>
                      <Card size="small" style={{ border: '1px solid #e8e8e8' }}>
                        {/* 帖文原文标题/链接，可穿透 */}
                        <div style={{ marginBottom: '6px' }}>
                          <a
                            onClick={() => handleOpenPenetrate(post)}
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#1890ff',
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                          >
                            {getPostDisplayTitle(post)}
                          </a>
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5', marginBottom: '8px' }}>
                          {post.content.length > 80 ? post.content.substring(0, 80) + '...' : post.content}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#999' }}>
                          <Space>
                            <span>博主: <strong>{post.author}</strong> ({post.authorId})</span>
                            <span>平台: <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px' }}>{post.platform.toUpperCase()}</Tag></span>
                          </Space>
                          <span>发布时间: {post.publishTime}</span>
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </div>
          )}
        </Modal>

        {/* 内网穿透原文源数据模拟弹窗 */}
        <Modal
          title={
            <span style={{ color: '#ff4d4f' }}>
              <GlobalOutlined /> 蓝鹰内网舆情原文数据安全封包
            </span>
          }
          open={penetrateVisible}
          onCancel={() => setPenetrateVisible(false)}
          footer={[
            <Button key="close" type="primary" danger onClick={() => setPenetrateVisible(false)}>
              关闭原文预览
            </Button>
          ]}
          width={580}
          centered
        >
          {penetratePost && (
            <div>
              <div style={{ border: '1px solid #ffccc7', background: '#fff2f0', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ fontWeight: 600, color: '#f5222d', marginBottom: '6px' }}>【内网取证日志】</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <div><strong>采集链路：</strong>内网数据网关-1号分流器</div>
                  <div><strong>采集时间：</strong>{penetratePost.publishTime}</div>
                  <div><strong>防伪哈希：</strong>MD5_SHA256_{penetratePost.id}</div>
                </div>
              </div>
              <div style={{ padding: '16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Avatar style={{ backgroundColor: '#1890ff' }}>{penetratePost.author[0]}</Avatar>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{penetratePost.author}</strong>
                    <div style={{ fontSize: '11px', color: '#999' }}>ID: {penetratePost.authorId} | 发布于 {penetratePost.platform.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {penetratePost.content}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* 1. 舆情指令来源登记弹窗 */}
        <Modal
          title={
            <span>
              <FileTextOutlined style={{ color: '#1890ff' }} /> 舆情重点网民建档登记
            </span>
          }
          open={opinionModalVisible}
          onOk={handleOpinionSubmit}
          onCancel={() => setOpinionModalVisible(false)}
          okText="确认登记建档"
          cancelText="取消"
          width={580}
          centered
        >
          <Form form={opinionForm} layout="vertical">
            <Alert
              message="说明：此表单专用于舆情指令捕获人员登记，默认绑定自媒体大V特征。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="网民真实姓名" rules={[{ required: true, message: '姓名' }]}>
                  <Input placeholder="输入真实姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="手机号码" rules={[{ required: true, message: '手机号' }]}>
                  <Input placeholder="手机号 (用于碰撞排重)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="idCard" label="身份证号" rules={[{ required: true, message: '身份证' }]}>
                  <Input placeholder="身份证号 (唯一性校验)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="peopleType" label="网民舆情属性类型" rules={[{ required: true }]} initialValue="media">
                  <Segmented
                    block
                    options={[
                      { label: '自媒体', value: 'media' },
                      { label: '大V', value: 'kol' },
                      { label: '普通网民', value: 'normal' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="opinionTags" label="舆情类型标签 (可下拉多选已维护的标签，或手动敲击回车新增)">
                  <Select
                    mode="tags"
                    placeholder="选择或输入标签"
                    style={{ width: '100%' }}
                    options={opinionTagOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '8px 0' }} />
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>关联社交账号数据捕获</div>
              <Row gutter={12}>
                <Col span={6}>
                  <Form.Item name="platform" label="平台" initialValue="douyin" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { value: 'douyin', label: '抖音' },
                        { value: 'weibo', label: '新浪微博' },
                        { value: 'wechat', label: '微信' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name="nickname" label="社交账号昵称" rules={[{ required: true, message: '昵称' }]}>
                    <Input placeholder="如: 淮安现场拍客" />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name="accountId" label="社交账号唯一ID" rules={[{ required: true, message: '账号ID' }]}>
                    <Input placeholder="如: dy_pk889" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>

        {/* 2. 涉稳登记来源登记弹窗 */}
        <Modal
          title={
            <span>
              <TeamOutlined style={{ color: '#722ed1' }} /> 涉稳重点网民建档登记
            </span>
          }
          open={stabilityModalVisible}
          onOk={handleStabilitySubmit}
          onCancel={() => setStabilityModalVisible(false)}
          okText="确认登记建档"
          cancelText="取消"
          width={580}
          centered
        >
          <Form form={stabilityForm} layout="vertical">
            <Alert
              message="说明：此表单专用于涉稳私域或网下重点群体串联人员登记，默认绑定所属群体。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="重点人真实姓名" rules={[{ required: true, message: '真实姓名' }]}>
                  <Input placeholder="输入姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="手机号码" rules={[{ required: true, message: '手机号' }]}>
                  <Input placeholder="手机号 (用于碰撞排重)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="idCard" label="身份证号" rules={[{ required: true, message: '身份证' }]}>
                  <Input placeholder="身份证号 (唯一性校验)" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="groupTag" label="所属涉稳重点群体" rules={[{ required: true, message: '所属群体' }]} initialValue="房产维权">
                  <Select
                    options={stabilityTagOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: '8px 0' }} />
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>关联涉稳社媒账号捕获</div>
              <Row gutter={12}>
                <Col span={6}>
                  <Form.Item name="platform" label="平台" initialValue="wechat" rules={[{ required: true }]}>
                    <Select
                      options={[
                        { value: 'wechat', label: '微信' },
                        { value: 'weibo', label: '新浪微博' },
                        { value: 'douyin', label: '抖音' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name="nickname" label="微信/群内昵称" rules={[{ required: true, message: '昵称' }]}>
                    <Input placeholder="如: 恒大业主代表-强哥" />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item name="accountId" label="微信号/QQ号/平台ID" rules={[{ required: true, message: '平台账号ID' }]}>
                    <Input placeholder="如: wxid_qiang99" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>

        {/* 核心防重防碰撞提示 Modal */}
        <Modal
          title={
            <span style={{ color: '#faad14' }}>
              <ExclamationCircleOutlined /> 重点网民档案冲突碰撞
            </span>
          }
          open={collisionVisible}
          onOk={handleExecuteMerge}
          onCancel={() => setCollisionVisible(false)}
          okText="一键合并画像"
          cancelText="取消放弃"
          width={500}
          centered
        >
          {collidedPerson && pendingRegisterData && (
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <Alert
                message="系统碰撞排重报警：数据有重合冲突！"
                description={`当前录入的身份证号/手机号与在库的 [${collidedPerson.name}] 重合匹配！`}
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
              />
              
              <div style={{ background: '#f5f7fa', padding: '12px', borderRadius: '4px', borderLeft: '4px solid #faad14', marginBottom: '12px' }}>
                <strong>现有档案特质：</strong>
                <div>姓名：{collidedPerson.name}</div>
                <div>身份证：<code>{collidedPerson.idCard.substring(0, 6)}********{collidedPerson.idCard.substring(14)}</code></div>
                <div>
                  人员来源：
                  <Tag color={collidedPerson.source === 'opinion' ? 'blue' : 'purple'}>
                    {collidedPerson.source === 'opinion' ? '舆情指令' : '涉稳登记'}
                  </Tag>
                </div>
              </div>

              <div style={{ color: '#ff4d4f', fontWeight: '600', marginBottom: '8px' }}>
                💡 合并后系统将自动：
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, color: '#555' }}>
                <li>升级该档案来源属性为 <strong>双源头融合身份 (both)</strong></li>
                <li>同时保留 <strong>舆情特质 ({collisionSourceType === 'opinion' ? '自媒体大V' : '在库类型'})</strong> 与 <strong>涉稳特质 ({collisionSourceType === 'stability' ? pendingRegisterData.groupTag : (collidedPerson.groupTag || '未指定')})</strong></li>
                <li>追加新录入的社媒账号 <code>{pendingRegisterData.nickname} ({pendingRegisterData.platform})</code> 到其社媒矩阵中</li>
              </ul>
            </div>
          )}
        </Modal>

        {/* 4. 全局标签管理 Modal */}
        <Modal
          title={
            <span>
              <SettingOutlined style={{ color: '#1890ff' }} /> 警舆融合全局标签库维护中心
            </span>
          }
          open={tagManagerVisible}
          onCancel={() => setTagManagerVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setTagManagerVisible(false)}>
              关闭窗口
            </Button>
          ]}
          width={700}
          centered
        >
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', minHeight: '380px' }}>
            {/* 左侧树形图 */}
            <div style={{ borderRight: '1px solid #f0f0f0', paddingRight: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ fontSize: '13px' }}>标签结构树</strong>
                <Select
                  size="small"
                  value={tagFilterType}
                  onChange={setTagFilterType}
                  style={{ width: '110px' }}
                  options={[
                    { value: 'all', label: '显示全部' },
                    { value: 'opinion', label: '仅舆情标签' },
                    { value: 'stability', label: '仅涉稳标签' },
                  ]}
                />
              </div>
              <Space style={{ marginBottom: '10px' }}>
                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={handleAddRootTag}>新建根</Button>
                <Button size="small" icon={<PlusOutlined />} disabled={!selectedTagKey} onClick={handleAddChildTag}>新建子</Button>
                <Button size="small" danger icon={<DeleteOutlined />} disabled={!selectedTagKey} onClick={handleDeleteSelectedTag}>删除</Button>
              </Space>
              
              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '4px', padding: '8px' }}>
                <Tree
                  showLine={{ showLeafIcon: false }}
                  treeData={getFilteredTagTree(managedTags) as any}
                  onSelect={handleSelectTagNode}
                  selectedKeys={selectedTagKey ? [selectedTagKey] : []}
                />
              </div>
            </div>

            {/* 右侧属性表单 */}
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '16px' }}>
                {selectedTagKey ? '静态/层级标签属性编辑' : '请在左侧选择节点进行编辑'}
              </div>
              {selectedTagKey ? (
                <Form form={tagForm} layout="vertical" onValuesChange={handleSaveTagForm}>
                  <Form.Item
                    name="title"
                    label="标签名称"
                    rules={[{ required: true, message: '请填写标签名称' }]}
                  >
                    <Input placeholder="输入标签名称" />
                  </Form.Item>
                  <Form.Item
                    name="type"
                    label="应用板块"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={[
                        { value: 'opinion', label: '舆情标签' },
                        { value: 'stability', label: '涉稳标签' },
                      ]}
                    />
                  </Form.Item>
                  <Alert
                    message="配置联动说明"
                    description="在此修改的标签库会即时同步至整个系统的登记和合并模块，支持直接多级穿透配置。"
                    type="info"
                    showIcon
                  />
                </Form>
              ) : (
                <div style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#bfbfbf', background: '#fafafa', borderRadius: '4px' }}>
                  <SettingOutlined style={{ fontSize: '32px', marginBottom: '10px' }} />
                  <div>在左侧选择节点进行编辑</div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PeopleDatabase;
