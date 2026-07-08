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
  Space,
  Avatar,
  Divider,
  message,
  Timeline,
  Row,
  Col,
  Alert,
  Drawer,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PartitionOutlined,
  WechatOutlined,
  QqOutlined,
  ReloadOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { generateMockPeople, PersonItem } from './PeopleDatabase';
const mapGroupPlatformToSocial = (platform: 'wechat' | 'qq' | 'other'): 'wechat' | 'qq' | 'weibo' => {
  if (platform === 'wechat') return 'wechat';
  if (platform === 'qq') return 'qq';
  return 'weibo';
};


// 成员接口
export interface GroupMember {
  id: string;
  nickname: string;
  account: string;
  name: string;
  idCard: string;
  phone: string;
  tags: string[];
}

// 涉稳群组接口
export interface StabilityGroup {
  id: string;
  name: string;
  featureId: string;
  platform: 'wechat' | 'qq' | 'other';
  tags: string[];
  memberCount: number;
  location: string;
  updateTime: string;
  members: GroupMember[];
}

// 预设长文本范例
const SAMPLE_TEXT_RIDER = `群名称：广州同城外卖骑手互助群
群特征/ID：WX-RIDER-GZ88
平台：微信
群标签：外卖群体维权, 劳资纠纷, 天河区
事关地：天河区
成员列表：
- 龙哥 (账号: rider_long88) - 真实姓名: 李龙, 身份证: 440106198808081234, 电话: 13800138001, 标签: 群主, 核心组织者, 高风险
- 跑腿小张 (账号: zhang_delivery) - 真实姓名: 张平, 身份证: 440106199512125678, 电话: 13922223333, 标签: 高频发声者, 积极响应`;

const SAMPLE_TEXT_TAXI = `群名称：白云区运输出租车司机交流群
群特征/ID：QQ-TAXI-BY99
平台：QQ
群标签：出租车司机维权, 行业诉求, 白云区
事关地：白云区
成员列表：
- 老陈头 (账号: taxi_chen99) - 真实姓名: 陈建国, 身份证: 440111197003032345, 电话: 13511112222, 标签: 群管理员, 意见领袖
- 顺风达 (账号: speedy_taxi) - 真实姓名: 王顺, 身份证: 440111198804043456, 电话: 13633334444, 标签: 普通网民, 低频响应`;

const SAMPLE_TEXT_OWNER = `群名称：XX御景名尊二期业主维权群
群特征/ID：WX-OWNER-HZ02
平台：微信
群标签：小区业主维权, 房产维权, 海珠区
事关地：海珠区
成员列表：
- 维权业委会-张姐 (账号: zj_owner) - 真实姓名: 张秀梅, 身份证: 440105197805054567, 电话: 13755556666, 标签: 群主, 核心维权代表
- 安居乐业 (账号: user_home2026) - 真实姓名: 刘安, 身份证: 440105198210105678, 电话: 13966667777, 标签: 积极响应者`;

// 六位核心关联人员的画像数据，合并入人员库
const customMockPeople: PersonItem[] = [
  {
    id: 'PERSON_RIDER_LONG',
    name: '李龙',
    gender: '男',
    age: 38,
    nation: '汉族',
    birthday: '1988-08-08',
    idCard: '440106198808081234',
    phone: '13800138001',
    residentAddress: '广州市天河区棠下街骑手之家公寓502',
    registeredAddress: '河南省南阳市邓州市李家庄',
    type: '外卖骑手',
    riskLevel: 'high',
    tags: ['外卖群体维权', '劳资纠纷', '群主', '核心组织者', '高风险'],
    socialAccounts: [
      { platform: 'wechat', username: '龙哥', id: 'rider_long88', followers: '500', url: '#', status: 'monitored' }
    ],
    department: '天河分局',
    status: 'monitored',
    lastActive: '2026-07-08 09:12',
    incidentCount: 5,
    recordList: [
      { id: 'p_long_1', content: '关于骑手扣费罚款的问题，大家明天早上9点在天河路百脑汇门口集合，一起去找站长要说法！', publishTime: '2026-07-08 08:30', platform: 'wechat', author: '龙哥', authorId: 'rider_long88', reposts: 12, comments: 45, likes: 88 }
    ],
    note: '天河骑手互助群群主，多次组织骑手集体讨薪及维权活动，风险程度高。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '外卖群体维权'
  },
  {
    id: 'PERSON_RIDER_ZHANG',
    name: '张平',
    gender: '男',
    age: 31,
    nation: '汉族',
    birthday: '1995-12-12',
    idCard: '440106199512125678',
    phone: '13922223333',
    residentAddress: '广州市天河区车陂村北十四巷3号',
    registeredAddress: '湖南省衡阳市衡南县三塘镇',
    type: '外卖骑手',
    riskLevel: 'medium',
    tags: ['外卖群体维权', '高频发声者', '积极响应'],
    socialAccounts: [
      { platform: 'wechat', username: '跑腿小张', id: 'zhang_delivery', followers: '150', url: '#', status: 'monitored' }
    ],
    department: '天河分局',
    status: 'monitored',
    lastActive: '2026-07-08 09:10',
    incidentCount: 2,
    recordList: [
      { id: 'p_zhang_1', content: '算我一个！凭什么克扣我们的配送费，必须给个合理的解释！', publishTime: '2026-07-08 08:35', platform: 'wechat', author: '跑腿小张', authorId: 'zhang_delivery', reposts: 0, comments: 2, likes: 10 }
    ],
    note: '外卖互助群积极响应分子，经常转发龙哥发布的活动倡议。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '外卖群体维权'
  },
  {
    id: 'PERSON_TAXI_CHEN',
    name: '陈建国',
    gender: '男',
    age: 56,
    nation: '汉族',
    birthday: '1970-03-03',
    idCard: '440111197003032345',
    phone: '13511112222',
    residentAddress: '广州市白云区三元里大道128号',
    registeredAddress: '广东省广州市白云区',
    type: '出租车司机',
    riskLevel: 'medium',
    tags: ['出租车司机维权', '行业诉求', '群管理员', '意见领袖'],
    socialAccounts: [
      { platform: 'qq', username: '老陈头', id: 'taxi_chen99', followers: '200', url: '#', status: 'monitored' }
    ],
    department: '白云分局',
    status: 'monitored',
    lastActive: '2026-07-08 08:25',
    incidentCount: 4,
    recordList: [
      { id: 'p_chen_1', content: '这次运价调整必须听听我们一线司机的声音，大家在QQ群里踊跃发言，整理个书面诉求交到运管局。', publishTime: '2026-07-08 08:10', platform: 'qq', author: '老陈头', authorId: 'taxi_chen99', reposts: 5, comments: 30, likes: 25 }
    ],
    note: '白云出租车交流群管理员，具有较强号召力，代表群体利益发声。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '出租车司机维权'
  },
  {
    id: 'PERSON_TAXI_WANG',
    name: '王顺',
    gender: '男',
    age: 38,
    nation: '汉族',
    birthday: '1988-04-04',
    idCard: '440111198804043456',
    phone: '13633334444',
    residentAddress: '广州市白云区黄石东路28号',
    registeredAddress: '四川省达州市通川区',
    type: '出租车司机',
    riskLevel: 'low',
    tags: ['出租车司机维权', '普通网民', '低频响应'],
    socialAccounts: [
      { platform: 'qq', username: '顺风达', id: 'speedy_taxi', followers: '45', url: '#', status: 'active' }
    ],
    department: '白云分局',
    status: 'normal',
    lastActive: '2026-07-07 20:10',
    incidentCount: 1,
    recordList: [
      { id: 'p_wang_1', content: '老陈说得对，支持调整。希望能解决燃油附加费和平台抽成问题。', publishTime: '2026-07-07 19:40', platform: 'qq', author: '顺风达', authorId: 'speedy_taxi', reposts: 0, comments: 0, likes: 2 }
    ],
    note: '出租车群体普通成员，仅参与网上讨论。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '出租车司机维权'
  },
  {
    id: 'PERSON_OWNER_ZHANG',
    name: '张秀梅',
    gender: '女',
    age: 48,
    nation: '汉族',
    birthday: '1978-05-05',
    idCard: '440105197805054567',
    phone: '13755556666',
    residentAddress: '广州市海珠区御景名尊二期8栋1603房',
    registeredAddress: '广东省韶关市乐昌市',
    type: '企业职员',
    riskLevel: 'high',
    tags: ['小区业主维权', '房产维权', '群主', '核心维权代表'],
    socialAccounts: [
      { platform: 'wechat', username: '维权业委会-张姐', id: 'zj_owner', followers: '800', url: '#', status: 'monitored' }
    ],
    department: '海珠分局',
    status: 'monitored',
    lastActive: '2026-07-08 08:02',
    incidentCount: 7,
    recordList: [
      { id: 'p_owner_zhang_1', content: '邻居们，开发商又在拖延二期配套绿化的交房标准了，明天下午我们一起去营销中心，要求他们出示规划批文！', publishTime: '2026-07-07 17:30', platform: 'wechat', author: '维权业委会-张姐', authorId: 'zj_owner', reposts: 15, comments: 98, likes: 110 }
    ],
    note: '业主维权群群主，组织多次业主到现场抗议及集体谈判，是核心维权代表。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '小区业主维权'
  },
  {
    id: 'PERSON_OWNER_LIU',
    name: '刘安',
    gender: '男',
    age: 44,
    nation: '汉族',
    birthday: '1982-10-10',
    idCard: '440105198210105678',
    phone: '13966667777',
    residentAddress: '广州市海珠区御景名尊二期3栋402房',
    registeredAddress: '广东省广州市越秀区',
    type: '个体户',
    riskLevel: 'medium',
    tags: ['小区业主维权', '积极响应者'],
    socialAccounts: [
      { platform: 'wechat', username: '安居乐业', id: 'user_home2026', followers: '120', url: '#', status: 'monitored' }
    ],
    department: '海珠分局',
    status: 'monitored',
    lastActive: '2026-07-07 17:50',
    incidentCount: 3,
    recordList: [
      { id: 'p_liu_1', content: '收到，算我们家一个，明天一定去！不能让开发商这么糊弄我们！', publishTime: '2026-07-07 17:40', platform: 'wechat', author: '安居乐业', authorId: 'user_home2026', reposts: 0, comments: 3, likes: 15 }
    ],
    note: '业主维权积极分子，常跟进现场拉横幅和抗议活动。',
    source: 'stability',
    peopleType: 'normal',
    groupTag: '小区业主维权'
  }
];

// 预设群组数据
const initialGroupList: StabilityGroup[] = [
  {
    id: 'GROUP_001',
    name: '广州同城外卖骑手互助群',
    featureId: 'WX-RIDER-GZ88',
    platform: 'wechat',
    tags: ['外卖群体维权', '劳资纠纷', '天河区'],
    memberCount: 158,
    location: '天河区',
    updateTime: '2026-07-08 09:12',
    members: [
      {
        id: 'PERSON_RIDER_LONG',
        nickname: '龙哥',
        account: 'rider_long88',
        name: '李龙',
        idCard: '440106198808081234',
        phone: '13800138001',
        tags: ['群主', '核心组织者', '高风险']
      },
      {
        id: 'PERSON_RIDER_ZHANG',
        nickname: '跑腿小张',
        account: 'zhang_delivery',
        name: '张平',
        idCard: '440106199512125678',
        phone: '13922223333',
        tags: ['高频发声者', '积极响应']
      }
    ]
  },
  {
    id: 'GROUP_002',
    name: '白云区运输出租车司机交流群',
    featureId: 'QQ-TAXI-BY99',
    platform: 'qq',
    tags: ['出租车司机维权', '行业诉求', '白云区'],
    memberCount: 240,
    location: '白云区',
    updateTime: '2026-07-08 08:30',
    members: [
      {
        id: 'PERSON_TAXI_CHEN',
        nickname: '老陈头',
        account: 'taxi_chen99',
        name: '陈建国',
        idCard: '440111197003032345',
        phone: '13511112222',
        tags: ['群管理员', '意见领袖']
      },
      {
        id: 'PERSON_TAXI_WANG',
        nickname: '顺风达',
        account: 'speedy_taxi',
        name: '王顺',
        idCard: '440111198804043456',
        phone: '13633334444',
        tags: ['普通网民', '低频响应']
      }
    ]
  },
  {
    id: 'GROUP_003',
    name: 'XX御景名尊二期业主维权群',
    featureId: 'WX-OWNER-HZ02',
    platform: 'wechat',
    tags: ['小区业主维权', '房产维权', '海珠区'],
    memberCount: 312,
    location: '海珠区',
    updateTime: '2026-07-07 17:45',
    members: [
      {
        id: 'PERSON_OWNER_ZHANG',
        nickname: '维权业委会-张姐',
        account: 'zj_owner',
        name: '张秀梅',
        idCard: '440105197805054567',
        phone: '13755556666',
        tags: ['群主', '核心维权代表']
      },
      {
        id: 'PERSON_OWNER_LIU',
        nickname: '安居乐业',
        account: 'user_home2026',
        name: '刘安',
        idCard: '440105198210105678',
        phone: '13966667777',
        tags: ['积极响应者']
      }
    ]
  }
];

const StabilityMaintenance: React.FC = () => {
  const [groupList, setGroupList] = useState<StabilityGroup[]>(initialGroupList);
  const [peopleDatabase, setPeopleDatabase] = useState<PersonItem[]>(() => [
    ...customMockPeople,
    ...generateMockPeople(),
  ]);

  // 筛选过滤状态
  const [searchText, setSearchText] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // 登记 Modal 控制
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerMode, setRegisterMode] = useState<'paste' | 'form'>('paste');
  const [pastedText, setPastedText] = useState('');

  // 临时解析出的群信息和成员信息 (用于在 Mode 'form' 时进行行编辑)
  const [parsedGroup, setParsedGroup] = useState<Omit<StabilityGroup, 'id' | 'updateTime'>>({
    name: '',
    featureId: '',
    platform: 'wechat',
    tags: [],
    memberCount: 0,
    location: '',
    members: [],
  });

  // 双通道登记表单的 Group Form
  const [groupForm] = Form.useForm();

  // 查看群成员明细 Drawer
  const [memberDrawerVisible, setMemberDrawerVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StabilityGroup | null>(null);

  // 查看重点人全量特征融合画像 Drawer (叠开在成员抽屉上面)
  const [personDrawerVisible, setPersonDrawerVisible] = useState(false);
  const [drawerPerson, setDrawerPerson] = useState<PersonItem | null>(null);

  // 标签渲染规则
  const renderMemberTag = (tag: string) => {
    let color = 'default';
    if (tag.includes('群主') || tag.includes('组织者') || tag.includes('风险') || tag.includes('核心')) {
      color = 'red';
    } else if (tag.includes('领袖') || tag.includes('管理员')) {
      color = 'orange';
    } else if (tag.includes('高频') || tag.includes('积极')) {
      color = 'purple';
    } else if (tag.includes('跟风') || tag.includes('响应')) {
      color = 'blue';
    }
    return (
      <Tag color={color} key={tag} style={{ borderRadius: '4px' }}>
        {tag}
      </Tag>
    );
  };

  // 平台图标与文字渲染
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

  // 一键填入长文本案例
  const handleLoadSample = (type: 'rider' | 'taxi' | 'owner') => {
    if (type === 'rider') {
      setPastedText(SAMPLE_TEXT_RIDER);
    } else if (type === 'taxi') {
      setPastedText(SAMPLE_TEXT_TAXI);
    } else if (type === 'owner') {
      setPastedText(SAMPLE_TEXT_OWNER);
    }
    message.success('已自动填充预置维权场景的长文本反馈模版！');
  };

  // 长文本解析算法
  const handleExtractText = () => {
    if (!pastedText.trim()) {
      message.error('请先粘贴群组长文本信息！');
      return;
    }

    const lines = pastedText.split('\n');
    let name = '';
    let featureId = '';
    let platform: 'wechat' | 'qq' | 'other' = 'wechat';
    let tags: string[] = [];
    let location = '';
    const members: GroupMember[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('群名称：') || trimmed.startsWith('群名称:')) {
        name = trimmed.replace(/^群名称[：:]/, '').trim();
      } else if (trimmed.startsWith('群特征/ID：') || trimmed.startsWith('群特征/ID:')) {
        featureId = trimmed.replace(/^群特征\/ID[：:]/, '').trim();
      } else if (trimmed.startsWith('平台：') || trimmed.startsWith('平台:')) {
        const plat = trimmed.replace(/^平台[：:]/, '').trim();
        if (plat.includes('QQ') || plat.includes('qq')) {
          platform = 'qq';
        } else if (plat.includes('微信') || plat.includes('wechat')) {
          platform = 'wechat';
        } else {
          platform = 'other';
        }
      } else if (trimmed.startsWith('群标签：') || trimmed.startsWith('群标签:')) {
        tags = trimmed
          .replace(/^群标签[：:]/, '')
          .split(/[,，]/)
          .map((t) => t.trim())
          .filter(Boolean);
      } else if (trimmed.startsWith('事关地：') || trimmed.startsWith('事关地:')) {
        location = trimmed.replace(/^事关地[：:]/, '').trim();
      } else if (trimmed.startsWith('-') || trimmed.match(/^\d+[\.\、]/)) {
        // 解析成员行，形如：
        // - 龙哥 (账号: rider_long88) - 真实姓名: 李龙, 身份证: 440106198808081234, 电话: 13800138001, 标签: 群主, 核心组织者, 高风险
        const cleanLine = trimmed.replace(/^[-*+]|^\d+[\.\、]/, '').trim();

        // 提取昵称 (例如: 龙哥)
        const nickMatch = cleanLine.match(/^([^\(（]+)/);
        const nickname = nickMatch ? nickMatch[1].trim() : '';

        // 提取账号 (例如: rider_long88)
        const accMatch = cleanLine.match(/账号\s*[：:]\s*([a-zA-Z0-9_-]+)/);
        const account = accMatch ? accMatch[1].trim() : '';

        // 提取真实姓名
        const nameMatch = cleanLine.match(/真实姓名\s*[：:]\s*([^,\s，]+)/);
        const mName = nameMatch ? nameMatch[1].trim() : '';

        // 提取身份证
        const idMatch = cleanLine.match(/身份证\s*[：:]\s*([0-9Xx]{18})/);
        const idCard = idMatch ? idMatch[1].trim() : '';

        // 提取电话
        const phoneMatch = cleanLine.match(/电话\s*[：:]\s*([0-9]{11})/);
        const phone = phoneMatch ? phoneMatch[1].trim() : '';

        // 提取标签
        const tagsMatch = cleanLine.match(/标签\s*[：:]\s*(.+)$/);
        let mTags: string[] = [];
        if (tagsMatch) {
          mTags = tagsMatch[1]
            .split(/[,，]/)
            .map((t) => t.trim())
            .filter(Boolean);
        }

        if (nickname || account) {
          members.push({
            id: `MEMBER_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            nickname,
            account,
            name: mName,
            idCard,
            phone,
            tags: mTags,
          });
        }
      }
    });

    const parsedData = {
      name: name || '未命名涉稳群组',
      featureId: featureId || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      platform,
      tags: tags.length > 0 ? tags : ['涉稳群聊'],
      memberCount: members.length || 50,
      location: location || '广州市',
      members,
    };

    setParsedGroup(parsedData);
    groupForm.setFieldsValue({
      name: parsedData.name,
      featureId: parsedData.featureId,
      platform: parsedData.platform,
      tags: parsedData.tags.join(', '),
      location: parsedData.location,
      memberCount: parsedData.memberCount,
    });

    setRegisterMode('form');
    message.success('一键结构化解析成功！已自动整理为群组元数据及成员明细。');
  };

  // 编辑表单中更新群成员信息
  const handleUpdateMemberField = (index: number, field: keyof GroupMember, value: string) => {
    const updatedMembers = [...parsedGroup.members];
    if (field === 'tags') {
      updatedMembers[index] = {
        ...updatedMembers[index],
        tags: value
          .split(/[,，]/)
          .map((t) => t.trim())
          .filter(Boolean),
      };
    } else {
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      } as GroupMember;
    }
    setParsedGroup({ ...parsedGroup, members: updatedMembers });
  };

  // 删除编辑中的成员
  const handleDeleteParsedMember = (index: number) => {
    const updatedMembers = parsedGroup.members.filter((_, i) => i !== index);
    setParsedGroup({ ...parsedGroup, members: updatedMembers });
  };

  // 添加空成员行进行录入
  const handleAddParsedMember = () => {
    const newMember: GroupMember = {
      id: `MEMBER_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      nickname: '',
      account: '',
      name: '',
      idCard: '',
      phone: '',
      tags: ['普通成员'],
    };
    setParsedGroup({
      ...parsedGroup,
      members: [...parsedGroup.members, newMember],
    });
  };

  // 双通道登记确认提交
  const handleRegisterSubmit = () => {
    groupForm
      .validateFields()
      .then((values) => {
        const parsedTags = values.tags
          ? values.tags
              .split(/[,，]/)
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [];

        const newGroup: StabilityGroup = {
          id: `GROUP_${Date.now()}`,
          name: values.name,
          featureId: values.featureId,
          platform: values.platform,
          tags: parsedTags,
          memberCount: parsedGroup.members.length || Number(values.memberCount) || 0,
          location: values.location,
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          members: parsedGroup.members,
        };

        // 1. 保存群组到 state 中
        setGroupList([newGroup, ...groupList]);

        // 2. 自动汇聚、合并排重写入本地人员库 (peopleDatabase)
        let mergedCount = 0;
        let newPeopleCount = 0;
        const updatedPeople = [...peopleDatabase];

        parsedGroup.members.forEach((member) => {
          // 查找是否在库中存在该身份证或电话
          const matchIndex = updatedPeople.findIndex(
            (p) =>
              (member.idCard && p.idCard === member.idCard) ||
              (member.phone && p.phone === member.phone) ||
              (member.account && p.socialAccounts.some((sa) => sa.id === member.account))
          );

          if (matchIndex > -1) {
            // 匹配到了，进行防重碰撞融合
            const existingPerson = updatedPeople[matchIndex];
            const updatedTags = Array.from(
              new Set([
                ...existingPerson.tags,
                '涉稳登记',
                ...newGroup.tags,
                ...member.tags,
              ])
            );

            // 追加社媒账号 (如果没有)
            const hasAccount = existingPerson.socialAccounts.some(
              (sa) => sa.id === member.account
            );
            const updatedAccounts = hasAccount
              ? existingPerson.socialAccounts
              : [
                  ...existingPerson.socialAccounts,
                  {
                    platform: mapGroupPlatformToSocial(newGroup.platform),
                    username: member.nickname || existingPerson.name,
                    id: member.account,
                    followers: '100',
                    url: '#',
                    status: 'monitored' as const,
                  },
                ];

            updatedPeople[matchIndex] = {
              ...existingPerson,
              source: 'both', // 升级为双源头融合
              groupTag: newGroup.tags[0] || existingPerson.groupTag,
              tags: updatedTags,
              socialAccounts: updatedAccounts,
              lastActive: newGroup.updateTime,
            };
            mergedCount++;
          } else {
            // 没匹配到，在人员库中为他新建全量档案
            const newPerson: PersonItem = {
              id: `PERSON_${member.account || Math.floor(100000 + Math.random() * 900000)}`,
              name: member.name || member.nickname || '未名人员',
              gender: '男', // 默认
              age: 30, // 默认
              nation: '汉族',
              birthday: '1996-01-01',
              idCard: member.idCard || `32080219960101${Math.floor(1000 + Math.random() * 9000)}`,
              phone: member.phone || `1380000${Math.floor(1000 + Math.random() * 9000)}`,
              residentAddress: `广州市${newGroup.location}辖区`,
              registeredAddress: '广东省',
              type: '关注人员',
              riskLevel: member.tags.some((t) => t.includes('高风险') || t.includes('群主'))
                ? 'high'
                : 'medium',
              tags: Array.from(new Set(['涉稳登记', ...newGroup.tags, ...member.tags])),
              socialAccounts: [
                {
                  platform: mapGroupPlatformToSocial(newGroup.platform),
                  username: member.nickname,
                  id: member.account,
                  followers: '100',
                  url: '#',
                  status: 'monitored',
                },
              ],
              department: `${newGroup.location}分局`,
              status: 'monitored',
              lastActive: newGroup.updateTime,
              incidentCount: 1,
              recordList: [
                {
                  id: `post_${Date.now()}_${Math.random()}`,
                  content: `涉稳群组【${newGroup.name}】抓取，身份标识为: [${member.tags.join('/')}]`,
                  publishTime: newGroup.updateTime,
                  platform: mapGroupPlatformToSocial(newGroup.platform),
                  author: member.nickname,
                  authorId: member.account,
                  reposts: 0,
                  comments: 0,
                  likes: 0,
                },
              ],
              note: '通过涉稳群组长文本粘贴智能解析自动建档录入。',
              source: 'stability',
              peopleType: 'normal',
              groupTag: newGroup.tags[0],
            };
            updatedPeople.unshift(newPerson);
            newPeopleCount++;
          }
        });

        setPeopleDatabase(updatedPeople);
        message.success(
          `成功登记群组【${values.name}】，共解析 ${parsedGroup.members.length} 人。其中：融合更新已有重点人画像 ${mergedCount} 名，为 ${newPeopleCount} 名新人员自动新建关联档案。`
        );

        setRegisterVisible(false);
        setPastedText('');
        setRegisterMode('paste');
        groupForm.resetFields();
      })
      .catch((info) => {
        message.error('请填写完整群组元数据信息！');
      });
  };

  // 侧滑拉出升级版的“网民全量特征融合画像”抽屉
  const handleOpenPersonDrawer = (nickname: string, account: string) => {
    // 优先通过账号或身份证在本地人员库中精准定位
    const person = peopleDatabase.find(
      (p) =>
        (account && p.socialAccounts.some((sa) => sa.id === account)) ||
        p.name === nickname ||
        p.socialAccounts.some((sa) => sa.username === nickname)
    );

    if (person) {
      setDrawerPerson(person);
      setPersonDrawerVisible(true);
    } else {
      // 若真的找不到，本地临时捏造一份满足展示
      const tempPerson: PersonItem = {
        id: `PERSON_TEMP_${account}`,
        name: nickname,
        gender: '男',
        age: 32,
        nation: '汉族',
        birthday: '1994-06-06',
        idCard: '320802199406061122',
        phone: '13788889999',
        residentAddress: '广州市辖区内网穿透地址',
        registeredAddress: '广东省',
        type: '群成员',
        riskLevel: 'medium',
        tags: ['涉稳登记', '普通成员'],
        socialAccounts: [
          { platform: 'wechat', username: nickname, id: account || 'unknown', followers: '10', url: '#', status: 'monitored' }
        ],
        department: '内网研判中心',
        status: 'monitored',
        lastActive: '刚刚',
        incidentCount: 1,
        recordList: [
          { id: 'p_temp_1', content: '暂无历史取证帖文。', publishTime: '刚刚', platform: 'wechat', author: nickname, authorId: account, reposts: 0, comments: 0, likes: 0 }
        ],
        note: '暂未在人员库发现全量融合画像，显示为涉稳群组抓取之快照特征。',
        source: 'stability',
        peopleType: 'normal',
      };
      setDrawerPerson(tempPerson);
      setPersonDrawerVisible(true);
    }
  };

  // 群组过滤算法
  const getFilteredGroups = () => {
    return groupList.filter((item) => {
      // 1. 全局搜索 (群名、特征ID、标签)
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchId = item.featureId.toLowerCase().includes(query);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchId && !matchTag) return false;
      }
      // 2. 平台类型
      if (filterPlatform !== 'all' && item.platform !== filterPlatform) return false;
      // 3. 群标签
      if (filterTag !== 'all' && !item.tags.includes(filterTag)) return false;
      // 4. 事关地
      if (filterLocation !== 'all' && item.location !== filterLocation) return false;

      return true;
    });
  };

  // 删除群组
  const handleDeleteGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止触发查看行抽屉
    setGroupList(groupList.filter((item) => item.id !== id));
    message.warning('该涉稳群组已安全下线移除！');
  };

  const filteredList = getFilteredGroups();

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {/* 顶部检索与长文本解析登记入口 */}
        <Card size="small" style={{ marginBottom: '16px', borderRadius: '8px' }}>
          <Row gutter={12} align="middle">
            {/* 模糊搜索 */}
            <Col span={6}>
              <Input
                placeholder="搜索群名称、特征ID、群标签..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>

            {/* 群平台类型 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>
                  平台:
                </span>
                <Select
                  style={{ width: '100%' }}
                  value={filterPlatform}
                  onChange={setFilterPlatform}
                  options={[
                    { value: 'all', label: '全部平台' },
                    { value: 'wechat', label: '微信' },
                    { value: 'qq', label: 'QQ' },
                  ]}
                />
              </div>
            </Col>

            {/* 群标签 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>
                  群体标签:
                </span>
                <Select
                  style={{ width: '100%' }}
                  value={filterTag}
                  onChange={setFilterTag}
                  options={[
                    { value: 'all', label: '全部标签' },
                    { value: '外卖群体维权', label: '外卖群体维权' },
                    { value: '出租车司机维权', label: '出租车司机维权' },
                    { value: '小区业主维权', label: '小区业主维权' },
                    { value: '劳资纠纷', label: '劳资纠纷' },
                    { value: '行业诉求', label: '行业诉求' },
                    { value: '房产维权', label: '房产维权' },
                  ]}
                />
              </div>
            </Col>

            {/* 事关地 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>
                  事关地:
                </span>
                <Select
                  style={{ width: '100%' }}
                  value={filterLocation}
                  onChange={setFilterLocation}
                  options={[
                    { value: 'all', label: '全部地' },
                    { value: '天河区', label: '天河区' },
                    { value: '白云区', label: '白云区' },
                    { value: '海珠区', label: '海珠区' },
                  ]}
                />
              </div>
            </Col>

            {/* 手工登记 */}
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<UsergroupAddOutlined />}
                onClick={() => {
                  setRegisterMode('paste');
                  setRegisterVisible(true);
                }}
              >
                登记涉稳群组
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 涉稳群组主列表 (外层) */}
        <Card size="small" style={{ borderRadius: '8px' }}>
          <Table
            dataSource={filteredList}
            rowKey="id"
            bordered
            size="middle"
            onRow={(record) => ({
              onClick: () => {
                setSelectedGroup(record);
                setMemberDrawerVisible(true);
              },
            })}
            rowClassName={() => 'interactive-table-row'}
            columns={[
              {
                title: '群名称',
                dataIndex: 'name',
                key: 'name',
                render: (text) => (
                  <span style={{ fontWeight: 600, color: '#1d39c4' }}>🗂️ {text}</span>
                ),
              },
              {
                title: '群特征/ID',
                dataIndex: 'featureId',
                key: 'featureId',
                width: 160,
                render: (text) => <code>{text}</code>,
              },
              {
                title: '平台类型',
                dataIndex: 'platform',
                key: 'platform',
                width: 100,
                render: (platform) => renderPlatform(platform),
              },
              {
                title: '群分类标签',
                dataIndex: 'tags',
                key: 'tags',
                render: (tags: string[]) => (
                  <Space size={4} wrap>
                    {tags.map((tag) => (
                      <Tag color="purple" key={tag}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                ),
              },
              {
                title: '群人数',
                dataIndex: 'memberCount',
                key: 'memberCount',
                width: 100,
                align: 'center',
                render: (count) => (
                  <strong style={{ color: '#fa8c16' }}>{count} 人</strong>
                ),
              },
              {
                title: '事关地',
                dataIndex: 'location',
                key: 'location',
                width: 120,
                render: (text) => (
                  <span>
                    <EnvironmentOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
                    {text}
                  </span>
                ),
              },
              {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 160,
              },
              {
                title: '操作',
                key: 'actions',
                width: 150,
                align: 'center',
                render: (_, record) => (
                  <Space onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setSelectedGroup(record);
                        setMemberDrawerVisible(true);
                      }}
                    >
                      明细
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDeleteGroup(record.id, e)}
                    >
                      移除
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        {/* 1. 群成员明细抽屉 (内层) */}
        <Drawer
          title={
            <span>
              👥 群成员监控明细 - {selectedGroup?.name} ({selectedGroup?.memberCount}人)
            </span>
          }
          placement="right"
          width={800}
          onClose={() => setMemberDrawerVisible(false)}
          open={memberDrawerVisible}
          destroyOnClose
        >
          {selectedGroup && (
            <div>
              <Alert
                message={
                  <Space split={<Divider type="vertical" />}>
                    <span>群特征: <code>{selectedGroup.featureId}</code></span>
                    <span>事关地: <strong>{selectedGroup.location}</strong></span>
                    <span>最后活动/采集: {selectedGroup.updateTime}</span>
                  </Space>
                }
                description={
                  <div style={{ marginTop: '6px' }}>
                    群属标签:{' '}
                    {selectedGroup.tags.map((t) => (
                      <Tag color="purple" key={t}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>重点监测群成员列表 (已关联人员库)</span>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>点击姓名穿透全量融合画像</span>
              </div>

              <Table
                dataSource={selectedGroup.members}
                rowKey="id"
                size="small"
                bordered
                pagination={false}
                columns={[
                  {
                    title: '群内昵称',
                    dataIndex: 'nickname',
                    key: 'nickname',
                    render: (text) => <strong>{text}</strong>,
                  },
                  {
                    title: '平台账号/ID',
                    dataIndex: 'account',
                    key: 'account',
                    render: (text) => <code>{text}</code>,
                  },
                  {
                    title: '真实姓名',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text, record) => (
                      <a
                        onClick={() => handleOpenPersonDrawer(record.nickname, record.account)}
                        style={{ fontWeight: 600, textDecoration: 'underline', color: '#1890ff' }}
                      >
                        {text || '未核实'}
                      </a>
                    ),
                  },
                  {
                    title: '身份证号',
                    dataIndex: 'idCard',
                    key: 'idCard',
                    render: (idCard) => {
                      if (!idCard) return <span style={{ color: '#ccc' }}>未登记</span>;
                      return <code>{idCard.substring(0, 6)}********{idCard.substring(14)}</code>;
                    },
                  },
                  {
                    title: '手机号',
                    dataIndex: 'phone',
                    key: 'phone',
                    render: (phone) => {
                      if (!phone) return <span style={{ color: '#ccc' }}>未登记</span>;
                      return <span>{phone.substring(0, 3)}****{phone.substring(7)}</span>;
                    },
                  },
                  {
                    title: '人员标签',
                    dataIndex: 'tags',
                    key: 'tags',
                    render: (tags: string[]) => (
                      <Space size={4} wrap>
                        {tags.map((t) => renderMemberTag(t))}
                      </Space>
                    ),
                  },
                  {
                    title: '画像穿透',
                    key: 'detail',
                    align: 'center',
                    render: (_, record) => (
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleOpenPersonDrawer(record.nickname, record.account)}
                      >
                        全量画像
                      </Button>
                    ),
                  },
                ]}
              />

              <div style={{ marginTop: '20px', background: '#fafafa', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #fa8c16' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>💡 研判联动说明</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#595959', lineHeight: '1.5' }}>
                  本模块是基于社交群聊抓取到的身份快照。点击人员昵称或“全量画像”后，系统在内网进行脱敏碰撞，在人员库中穿透匹配其名下的多平台账号、户籍信息、前科劣迹以及在其他舆情指令中的记录，实现“一屏全量掌控”。
                </p>
              </div>
            </div>
          )}
        </Drawer>

        {/* 2. 二次穿透重点人融合画像 Drawer */}
        <Drawer
          title="蓝鹰网民全量特征融合画像 (内网穿透研判)"
          placement="right"
          width={650}
          onClose={() => setPersonDrawerVisible(false)}
          open={personDrawerVisible}
          destroyOnClose
        >
          {drawerPerson && (
            <div>
              {/* 基本摘要 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#f5f7fa',
                  padding: '16px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  border: '1px solid #e8e8e8',
                }}
              >
                <Avatar size={50} style={{ backgroundColor: '#1d39c4' }}>
                  {drawerPerson.name ? drawerPerson.name[0] : <UserOutlined />}
                </Avatar>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                    {drawerPerson.name}
                    <span style={{ fontSize: '12px', color: '#999', fontWeight: 'normal', marginLeft: '10px' }}>
                      {drawerPerson.gender} | {drawerPerson.age}岁
                    </span>
                  </h3>
                  <Space>
                    {drawerPerson.riskLevel === 'high' ? (
                      <Tag color="red">🔴 极高风险</Tag>
                    ) : drawerPerson.riskLevel === 'medium' ? (
                      <Tag color="orange">🟡 中度风险</Tag>
                    ) : (
                      <Tag color="blue">🔵 一般关注</Tag>
                    )}
                    <Tag color="purple">重点属地: {drawerPerson.department}</Tag>
                  </Space>
                </div>
              </div>

              {/* 来源与身份双重融合特征 */}
              <Descriptions bordered size="small" column={1} style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="脱敏身份证">
                  <code>
                    {drawerPerson.idCard.substring(0, 6)}********{drawerPerson.idCard.substring(14)}
                  </code>
                </Descriptions.Item>
                <Descriptions.Item label="脱敏手机号">
                  <span>
                    {drawerPerson.phone.substring(0, 3)}****{drawerPerson.phone.substring(7)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="数据来源属性">
                  {drawerPerson.source === 'both' ? (
                    <Space>
                      <Tag color="red">双源头碰撞融合</Tag>
                      <Tag color="blue">舆情指令来源</Tag>
                      <Tag color="purple">涉稳台账登记</Tag>
                    </Space>
                  ) : drawerPerson.source === 'opinion' ? (
                    <Tag color="blue">舆情指令来源</Tag>
                  ) : (
                    <Tag color="purple">涉稳台账登记</Tag>
                  )}
                </Descriptions.Item>

                {/* 融合属性 */}
                <Descriptions.Item label="网民类型 (舆情特征)">
                  {drawerPerson.peopleType === 'media' ? (
                    <Tag color="blue">自媒体</Tag>
                  ) : drawerPerson.peopleType === 'kol' ? (
                    <Tag color="purple">大V</Tag>
                  ) : (
                    <span style={{ color: '#8c8c8c' }}>普通网民</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="舆情类型标签">
                  {drawerPerson.opinionTags && drawerPerson.opinionTags.length > 0 ? (
                    <Space size={4} wrap>
                      {drawerPerson.opinionTags.map((t) => (
                        <Tag color="cyan" key={t}>{t}</Tag>
                      ))}
                    </Space>
                  ) : (
                    <span style={{ color: '#ccc' }}>无</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="涉稳群体 (涉稳特征)">
                  {drawerPerson.groupTag ? (
                    <Tag color="red">{drawerPerson.groupTag}</Tag>
                  ) : (
                    <span style={{ color: '#ccc' }}>无</span>
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="现居住地址">{drawerPerson.residentAddress}</Descriptions.Item>
                <Descriptions.Item label="户籍所在地">{drawerPerson.registeredAddress}</Descriptions.Item>
              </Descriptions>

              {/* 监控社媒矩阵 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '13px' }}>
                  监控社媒账号矩阵 (多平台聚合)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {drawerPerson.socialAccounts.map((account, index) => (
                    <Card key={index} size="small" style={{ background: '#fafafa', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          {account.platform === 'wechat' ? (
                            <WechatOutlined style={{ color: '#52c41a', marginRight: '4px' }} />
                          ) : (
                            <QqOutlined style={{ color: '#1890ff', marginRight: '4px' }} />
                          )}
                          <strong>{account.username}</strong>
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
                        账号/ID: <code>{account.id}</code>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 客观帖文脉络 */}
              <div>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '13px' }}>
                  客观关联取证帖文流 (不使用AI加工)
                </div>
                {drawerPerson.recordList && drawerPerson.recordList.length > 0 ? (
                  <Timeline style={{ paddingLeft: '6px', marginTop: '12px' }}>
                    {drawerPerson.recordList.map((post) => (
                      <Timeline.Item key={post.id} color="red">
                        <div style={{ fontSize: '12.5px', color: '#262626', fontWeight: 600 }}>
                          {post.content}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>
                          发布平台: {post.platform.toUpperCase()} | 取证时间: {post.publishTime}
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                ) : (
                  <span style={{ color: '#ccc', fontSize: '12px' }}>该网民尚无客观取证帖文。</span>
                )}
              </div>
            </div>
          )}
        </Drawer>

        {/* 3. 登记涉稳群组双通道 Modal 弹窗 */}
        <Modal
          title={
            <Space>
              <PartitionOutlined style={{ color: '#1d39c4' }} />
              <span>登记涉稳群组（支持长文本粘贴智能解析）</span>
            </Space>
          }
          open={registerVisible}
          onOk={registerMode === 'form' ? handleRegisterSubmit : handleExtractText}
          onCancel={() => setRegisterVisible(false)}
          okText={registerMode === 'form' ? '确认登记入库' : '一键提取并结构化'}
          cancelText="取消"
          width={registerMode === 'form' ? 950 : 700}
          centered
          destroyOnClose
        >
          {registerMode === 'paste' ? (
            <div>
              <Alert
                message="智能长文本加工工作流说明"
                description="支持将含有群名称、群标签、成员账号、姓名、手机号等固定格式的长文本（如微信、QQ报告单）进行解析。解析后，系统将一键结构化转化为群属性及多行成员表格，并提供人工二次核对和精修编辑。"
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <div style={{ marginBottom: '12px' }}>
                <span style={{ marginRight: '12px', fontWeight: 600 }}>一键载入场景范例:</span>
                <Space>
                  <Button size="small" type="dashed" onClick={() => handleLoadSample('rider')}>
                    1. 外卖骑手维权群
                  </Button>
                  <Button size="small" type="dashed" onClick={() => handleLoadSample('taxi')}>
                    2. 出租车司机维权群
                  </Button>
                  <Button size="small" type="dashed" onClick={() => handleLoadSample('owner')}>
                    3. 小区业主维权群
                  </Button>
                </Space>
              </div>

              <Input.TextArea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="请在下方粘贴包含群组名和成员信息的长文本数据..."
                rows={10}
                style={{ fontFamily: 'monospace', fontSize: '13px', borderRadius: '6px' }}
              />
            </div>
          ) : (
            <div>
              <Alert
                message="一键智能提取完成！请在提交前进行人工核对及微调编辑。"
                type="success"
                showIcon
                action={
                  <Button
                    size="small"
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={() => setRegisterMode('paste')}
                  >
                    重新粘贴解析
                  </Button>
                }
                style={{ marginBottom: '16px' }}
              />

              <Form form={groupForm} layout="vertical">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="name" label="群名称" rules={[{ required: true, message: '群名称必填' }]}>
                      <Input placeholder="输入或核实群名称" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="platform" label="平台类型" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { value: 'wechat', label: '微信' },
                          { value: 'qq', label: 'QQ' },
                          { value: 'other', label: '其他' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="featureId" label="群特征/ID" rules={[{ required: true }]}>
                      <Input placeholder="输入群组标识ID" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="location" label="事关地 (区级)" rules={[{ required: true }]}>
                      <Select
                        options={[
                          { value: '天河区', label: '天河区' },
                          { value: '白云区', label: '白云区' },
                          { value: '海珠区', label: '海珠区' },
                          { value: '淮安区', label: '淮安区' },
                          { value: '清江浦区', label: '清江浦区' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={18}>
                    <Form.Item name="tags" label="群组分类标签 (英文或中文逗号隔开)" rules={[{ required: true }]}>
                      <Input placeholder="如：外卖群体维权, 劳资纠纷" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="memberCount" label="标称群总人数">
                      <Input placeholder="群内抓取总人数" type="number" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '13.5px' }}>提取的群成员清单 ({parsedGroup.members.length}人)</span>
                <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={handleAddParsedMember}>
                  追加成员行
                </Button>
              </div>

              {/* 原地转化为可编辑表格，极简无缝的行修改 */}
              <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                <table className="editable-member-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>群内昵称</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>账号/ID</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>真实姓名</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>身份证</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>手机号</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>人员标签(逗号隔开)</th>
                      <th style={{ padding: '8px', textAlign: 'center', width: '60px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedGroup.members.map((member, index) => (
                      <tr key={member.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.nickname}
                            onChange={(e) => handleUpdateMemberField(index, 'nickname', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.account}
                            onChange={(e) => handleUpdateMemberField(index, 'account', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.name}
                            onChange={(e) => handleUpdateMemberField(index, 'name', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.idCard}
                            onChange={(e) => handleUpdateMemberField(index, 'idCard', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.phone}
                            onChange={(e) => handleUpdateMemberField(index, 'phone', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px' }}>
                          <Input
                            size="small"
                            value={member.tags.join(', ')}
                            onChange={(e) => handleUpdateMemberField(index, 'tags', e.target.value)}
                          />
                        </td>
                        <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteParsedMember(index)}
                          />
                        </td>
                      </tr>
                    ))}
                    {parsedGroup.members.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#ccc' }}>
                          解析结果为空，请手动“追加成员行”或“重新粘贴解析”
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default StabilityMaintenance;
