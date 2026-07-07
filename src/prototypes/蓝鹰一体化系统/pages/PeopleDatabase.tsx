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
} from '@ant-design/icons';

// 导出社交账号定义，供跨库使用
export interface SocialAccount {
  platform: 'weibo' | 'wechat' | 'douyin';
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
  platform: 'weibo' | 'wechat' | 'douyin';
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
}

const generateMockPeople = (): PersonItem[] => {
  const list: PersonItem[] = [];
  
  // 基础姓氏与名字
  const lastNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
  const maleNames = ['建国', '强', '刚', '伟', '勇', '军', '平', '保国', '超', '杰', '明', '辉', '波', '健', '涛', '飞', '鑫', '亮', '洋', '帅'];
  const femaleNames = ['梅', '娜', '丽', '敏', '静', '雅', '萍', '红', '玲', '芳', '倩', '婷', '娟', '燕', '莉', '霞', '丹', '洁', '慧', '欣'];
  
  // 属地列表
  const depts = ['淮安区', '清江浦区', '洪泽区'];
  
  // 7个细分类别
  const categories = [
    { key: '房产维权', parent: '维权群体', tags: ['维权群体', '房产维权', '业主骨干'] },
    { key: '环保维权', parent: '维权群体', tags: ['维权群体', '环保维权', '村民代表'] },
    { key: '医患群体', parent: '维权群体', tags: ['维权群体', '医患群体', '医疗纠纷'] },
    { key: '自媒体', parent: '网络大V', tags: ['网络大V', '自媒体', '爆料拍客', '淮安生活圈'] },
    { key: '本地生活', parent: '网络大V', tags: ['网络大V', '本地生活', '房产参谋', '买房避坑'] },
    { key: '退役军人', parent: '特殊诉求', tags: ['特殊诉求', '退役军人', '安置诉求'] },
    { key: '涉法涉诉', parent: '特殊诉求', tags: ['特殊诉求', '涉法涉诉', '申诉上访'] },
  ];

  let idCounter = 1;

  categories.forEach((cat) => {
    // 每个类别生成 10 个账号
    for (let i = 1; i <= 10; i++) {
      const isMale = Math.random() > 0.3; // 偏向男性
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const firstName = isMale 
        ? maleNames[(i * 3 + idCounter) % maleNames.length]
        : femaleNames[(i * 3 + idCounter) % femaleNames.length];
      const name = lastName + firstName;
      
      const gender = isMale ? '男' : '女';
      const age = 26 + (idCounter % 38);
      const nation = '汉族';
      const birthYear = 2026 - age;
      const birthday = `${birthYear}-${String((idCounter * 7) % 12 + 1).padStart(2, '0')}-${String((idCounter * 11) % 28 + 1).padStart(2, '0')}`;
      
      // 脱敏号码
      const idCard = `320802${birthYear}${String((idCounter * 7) % 12 + 1).padStart(2, '0')}0${idCounter % 9 + 1}X`;
      const phone = `13${(3 + idCounter % 7)}****${String(1000 + idCounter * 13)}`;
      
      const dept = depts[idCounter % depts.length];
      
      // 各种地址
      const residentAddress = `江苏省淮安市${dept}开明路${10 + i * 2}号院${i}号楼30${i % 9 + 1}室`;
      const registeredAddress = `江苏省淮安市${dept}流均镇${lastName}庄村${i * 3}号`;
      
      const riskLevel = i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low';
      
      // 社媒绑定
      const socialAccounts: SocialAccount[] = [];
      if (cat.key === '自媒体' || cat.key === '本地生活') {
        socialAccounts.push({
          platform: 'douyin',
          username: `淮安${cat.key === '自媒体' ? '现场爆料' : '吃喝买房'}_${name}`,
          id: `dy_${idCounter * 889}`,
          followers: `${i * 3 + 2}万`,
          url: `https://douyin.com/user_${idCounter}`,
          status: 'monitored'
        });
      }
      
      socialAccounts.push({
        platform: idCounter % 2 === 0 ? 'weibo' : 'wechat',
        username: idCounter % 2 === 0 ? `淮安关注_${name}` : `${name}_业主圈`,
        id: idCounter % 2 === 0 ? `weibo_${idCounter * 211}` : `wxid_sys_${idCounter * 109}`,
        followers: idCounter % 2 === 0 ? `${i * 500}` : '300+',
        url: idCounter % 2 === 0 ? `https://weibo.com/user_${idCounter}` : '微信内网封包',
        status: 'active'
      });

      // 帖文脉络生成 (贴合实际、极具逻辑性)
      const recordList: PostItem[] = [];
      const index = i;
      
      if (cat.key === '房产维权') {
        const estates = ['金地花园', '恒大悦府', '碧桂园天玺', '吾悦住宅区', '绿地学府'];
        const est = estates[index % estates.length];
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `关于${est}延期交房的联名请愿书：各位邻居，我们已经交房延迟大半年，开发商至今避而不见。我们准备于本周三上午组织业主前往区住建局集体上访，请大家踊跃报名参与。必须维权到底！`,
          publishTime: `2026-07-07 10:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 2,
          comments: i * 3,
          likes: i * 15,
          ipAddress: `10.32.100.${50 + i}`,
          captureTime: `2026-07-07 10:${String(12 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '环保维权') {
        const projects = ['垃圾厂扩建', '清江浦化工园废气', '盐河污水偷排', '高良涧化工厂'];
        const proj = projects[index % projects.length];
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `大家快来看看，这是${proj}今天早上的黑烟！异味极其难闻，周边的孩子们课都上不了了，这剧毒气体到底谁来管！水井里的水也开始发涩发苦！[视频]`,
          publishTime: `2026-07-07 08:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 4,
          comments: i * 5,
          likes: i * 25,
          ipAddress: `10.40.110.${50 + i}`,
          captureTime: `2026-07-07 08:${String(15 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '医患群体') {
        const hospitals = ['区人民医院', '中医院', '妇幼保健院', '康复医院'];
        const hosp = hospitals[index % hospitals.length];
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `无德医院，草菅人命！家人在${hosp}做常规手术，竟然因为医生推诿发生医疗事故不幸去世！院方不仅推卸责任，还推搡家属，天理何在！请大家帮我转发曝光！`,
          publishTime: `2026-07-06 14:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 3,
          comments: i * 6,
          likes: i * 18,
          ipAddress: `10.35.50.${50 + i}`,
          captureTime: `2026-07-06 14:${String(12 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '自媒体') {
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `【粉丝爆料】淮安某路段今日清晨发生多车相撞突发事件，现场拉起警戒线，传闻有严重肢体冲突，是否有人员涉稳伤亡？希望官方尽快出面澄清。[图片]`,
          publishTime: `2026-07-07 11:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 50,
          comments: i * 20,
          likes: i * 150,
          ipAddress: `10.38.10.${50 + i}`,
          captureTime: `2026-07-07 11:${String(12 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '本地生活') {
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `今天聊聊淮安目前的几个烂尾楼盘。很多买房人在后台私信我，说维权无门。其实像恒大、金地这几个小区的买房人真的很惨，一辈子的积蓄都搭进去了，希望相关部门切实解决。`,
          publishTime: `2026-07-06 19:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 10,
          comments: i * 8,
          likes: i * 80,
          ipAddress: `10.38.11.${50 + i}`,
          captureTime: `2026-07-06 19:${String(12 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '退役军人') {
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `退伍老兵维权：我们退役军人辛辛苦苦为国奉献，退伍安置待遇却被推诿克扣！我们要去退役军人事务厅递交材料，依法维权，争取我们应有的尊严和权益！`,
          publishTime: `2026-07-05 10:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 2,
          comments: i * 4,
          likes: i * 30,
          ipAddress: `10.45.20.${50 + i}`,
          captureTime: `2026-07-05 10:${String(12 + i).padStart(2, '0')}`
        });
      } else if (cat.key === '涉法涉诉') {
        recordList.push({
          id: `POST_${idCounter}_1`,
          content: `流转土地补偿款拖欠三年至今未发，村委会推卸责任，老百姓告状无门。希望上级纪委部门严查其中的克扣挪用行为！我们要联合上访！坚决要回我们的血汗钱！`,
          publishTime: `2026-07-07 13:${String(10 + i).padStart(2, '0')}`,
          platform: socialAccounts[0].platform,
          author: socialAccounts[0].username,
          authorId: socialAccounts[0].id,
          reposts: i * 3,
          comments: i * 5,
          likes: i * 40,
          ipAddress: `10.48.30.${50 + i}`,
          captureTime: `2026-07-07 13:${String(12 + i).padStart(2, '0')}`
        });
      }

      list.push({
        id: `P${String(idCounter).padStart(3, '0')}`,
        name,
        gender,
        age,
        nation,
        birthday,
        idCard,
        phone,
        residentAddress,
        registeredAddress,
        type: cat.key === '自媒体' || cat.key === '本地生活' ? '网络舆论大V' : '重点关注人员',
        riskLevel,
        tags: cat.tags,
        socialAccounts,
        department: dept,
        status: i % 4 === 0 ? 'monitored' : i % 4 === 1 ? 'convinced' : i % 4 === 2 ? 'left' : 'normal',
        lastActive: recordList[0]?.publishTime || `2026-07-07 12:00`,
        incidentCount: recordList.length,
        recordList,
        note: `该人员因「${cat.key}」问题已被纳入公安局重点人群研判台账，最后涉事属地为${dept}分局辖区，需强化对其线上传播轨迹的密切监视。`
      });

      idCounter++;
    }
  });

  return list;
};

export const initialPeopleData: PersonItem[] = generateMockPeople();

const labelTreeData = [
  {
    title: '全部分类',
    key: 'all',
    children: [
      {
        title: '维权群体',
        key: '维权群体',
        children: [
          { title: '房产维权', key: '房产维权' },
          { title: '环保维权', key: '环保维权' },
          { title: '医患群体', key: '医患群体' },
        ],
      },
      {
        title: '网络大V / 自媒体',
        key: '网络大V',
        children: [
          { title: '自媒体运营', key: '自媒体' },
          { title: '本地生活大V', key: '本地生活' },
        ],
      },
      {
        title: '特殊诉求群体',
        key: '特殊诉求',
        children: [
          { title: '退役军人', key: '退役军人' },
          { title: '涉法涉诉', key: '涉法涉诉' },
        ],
      },
    ],
  },
];

const PeopleDatabase: React.FC = () => {
  const [peopleList, setPeopleList] = useState<PersonItem[]>(initialPeopleData);
  const [searchText, setSearchText] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedTagKey, setSelectedTagKey] = useState<string>('all');

  // 视图切换状态: "table" (列表视图) 或 "card" (卡片视图)
  const [viewType, setViewType] = useState<'table' | 'card'>('card');

  // 大号居中详情 Modal 控制
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonItem | null>(null);

  // 帖文穿透模拟弹窗控制
  const [penetrateVisible, setPenetrateVisible] = useState(false);
  const [penetratePost, setPenetratePost] = useState<PostItem | null>(null);

  // 登记人员 Modal 控制
  const [registerVisible, setRegisterVisible] = useState(false);
  const [form] = Form.useForm();

  // 过滤网民列表
  const filteredData = peopleList.filter((item) => {
    const matchSearch =
      item.name.includes(searchText) ||
      item.idCard.includes(searchText) ||
      item.phone.includes(searchText) ||
      item.socialAccounts.some((acc) => acc.username.includes(searchText));

    const matchRisk = selectedRisk === 'all' || item.riskLevel === selectedRisk;
    const matchDept = selectedDept === 'all' || item.department === selectedDept;
    const matchTag =
      selectedTagKey === 'all' ||
      selectedTagKey === 'all-nodes' ||
      item.tags.some((t) => t.includes(selectedTagKey) || selectedTagKey.includes(t));

    return matchSearch && matchRisk && matchDept && matchTag;
  });

  // 处理人员手动登记
  const handleRegisterSubmit = () => {
    form.validateFields().then((values) => {
      // 动态子表单中录入的社交账号列表
      const socialList = (values.socialAccounts || []).map((acc: any) => ({
        platform: acc.platform || 'wechat',
        username: acc.username || '未命名账号',
        id: acc.id || `id_${Math.floor(Math.random() * 100000)}`,
        followers: acc.followers || '0',
        url: acc.url || '内网封闭地址',
        status: 'active',
      }));

      // 生成新登记人员记录
      const newPerson: PersonItem = {
        id: `P${String(peopleList.length + 1).padStart(3, '0')}`,
        name: values.name,
        gender: values.gender || '男',
        age: Number(values.age) || 30,
        nation: values.nation || '汉族',
        birthday: values.birthday || '1990-01-01',
        idCard: values.idCard,
        phone: values.phone,
        residentAddress: values.residentAddress || '江苏省淮安市未知地址',
        registeredAddress: values.registeredAddress || '江苏省淮安市未知户籍地',
        type: values.type || '关注人员',
        riskLevel: values.riskLevel || 'low',
        tags: values.tags ? values.tags.split(',') : ['其他群体'],
        socialAccounts: socialList.length > 0 ? socialList : [
          { platform: 'wechat', username: `${values.name}_微信`, id: `wxid_${Math.floor(Math.random() * 1000)}`, followers: '100+', url: '未知链接', status: 'active' }
        ],
        department: values.department || '淮安区',
        status: 'monitored',
        lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
        incidentCount: 1,
        note: values.note || '无备注信息',
        recordList: [
          {
            id: `POST_${Date.now()}`,
            content: values.note || '手工录入该网民时建立的初始化第一条涉事内容轨迹记录。',
            publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
            platform: 'wechat',
            author: values.name,
            authorId: 'wxid_sys',
            reposts: 0,
            comments: 0,
            likes: 0,
            ipAddress: '10.32.22.11',
            captureTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          }
        ]
      };

      setPeopleList([newPerson, ...peopleList]);
      message.success(`成功手工登记网民「${values.name}」的身份和社交账号矩阵！`);
      setRegisterVisible(false);
      form.resetFields();
    });
  };

  // 表格视图列定义
  const tableColumns = [
    {
      title: '基本信息 (脱敏)',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PersonItem) => (
        <Space>
          <Avatar style={{ backgroundColor: record.riskLevel === 'high' ? '#ff4d4f' : record.riskLevel === 'medium' ? '#faad14' : '#1890ff' }}>
            {text[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: '11px', color: '#999' }}>
              身份证: {record.idCard.substring(0, 6)}********{record.idCard.substring(14)}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '涉事总次数',
      dataIndex: 'incidentCount',
      key: 'incidentCount',
      render: (count: number) => <strong style={{ fontSize: '13px' }}>{count} 次</strong>,
    },
    {
      title: '评估等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (risk: string) => (
        <Tag color={risk === 'high' ? 'red' : risk === 'medium' ? 'orange' : 'blue'} style={{ fontWeight: 500 }}>
          {risk === 'high' ? '高风险' : risk === 'medium' ? '中风险' : '低风险'}
        </Tag>
      ),
    },
    {
      title: '主要标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div>
          {tags.slice(0, 3).map((tag, idx) => (
            <Tag key={idx} color="cyan">{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '最新涉事时间',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PersonItem) => (
        <Button
          type="link"
          icon={<FileSearchOutlined />}
          onClick={() => {
            setSelectedPerson(record);
            setDetailVisible(true);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 辅助函数：根据帖文正文获取原生态标题 (最长30字)
  const getPostDisplayTitle = (post: PostItem) => {
    if (post.title) return post.title;
    const body = post.content || '';
    if (body.length <= 40) return body;
    return body.substring(0, 38) + '...';
  };

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {/* 顶部操作与筛选栏 */}
        <Card bordered={false} size="small" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <Space style={{ flexWrap: 'wrap' }}>
              <Input
                placeholder="全局搜索姓名/脱敏信息/社交账号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 240 }}
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                allowClear
              />
              <Select
                value={selectedRisk}
                onChange={setSelectedRisk}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部评估等级' },
                  { value: 'high', label: '高风险' },
                  { value: 'medium', label: '中风险' },
                  { value: 'low', label: '低风险' },
                ]}
              />
              <Select
                value={selectedDept}
                onChange={setSelectedDept}
                style={{ width: 130 }}
                options={[
                  { value: 'all', label: '全部所属区域' },
                  { value: '淮安区', label: '淮安分局' },
                  { value: '清江浦区', label: '清江浦分局' },
                  { value: '洪泽区', label: '洪泽分局' },
                ]}
              />
            </Space>

            <Space>
              {/* 视图切换 Segmented */}
              <Segmented
                value={viewType}
                onChange={(value) => setViewType(value as 'table' | 'card')}
                options={[
                  { value: 'table', label: '列表视图', icon: <UnorderedListOutlined /> },
                  { value: 'card', label: '卡片视图', icon: <AppstoreOutlined /> },
                ]}
              />
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setRegisterVisible(true)}
              >
                手工登记人员
              </Button>
            </Space>
          </div>
        </Card>

        {/* 主体架构 (左侧树 + 右侧视图) */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px' }}>
          {/* 左侧多级标签树 */}
          <Card className="filter-sidebar-card" bordered={false}>
            <div className="sidebar-title">
              <ProfileOutlined />
              <span>多级标签分类树</span>
            </div>
            <Tree
              defaultExpandAll
              treeData={labelTreeData}
              onSelect={(selectedKeys) => {
                if (selectedKeys.length > 0) {
                  setSelectedTagKey(selectedKeys[0] as string);
                } else {
                  setSelectedTagKey('all');
                }
              }}
            />
          </Card>

          {/* 右侧数据展示区 */}
          <div style={{ minHeight: 'calc(100vh - 240px)' }}>
            {viewType === 'table' ? (
              /* 表格视图 */
              <Card bordered={false}>
                <Table
                  dataSource={filteredData}
                  columns={tableColumns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="middle"
                  bordered
                />
              </Card>
            ) : (
              /* 卡片视图 */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filteredData.map((person) => (
                  <Card
                    hoverable
                    key={person.id}
                    style={{ borderRadius: '8px', borderLeft: person.riskLevel === 'high' ? '4px solid #ff4d4f' : person.riskLevel === 'medium' ? '4px solid #faad14' : '4px solid #1890ff' }}
                    onClick={() => {
                      setSelectedPerson(person);
                      setDetailVisible(true);
                    }}
                  >
                    {/* 卡片头部 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar style={{ backgroundColor: person.riskLevel === 'high' ? '#ff4d4f' : '#1890ff' }}>
                          {person.name[0]}
                        </Avatar>
                        <strong style={{ fontSize: '15px' }}>{person.name}</strong>
                      </div>
                      <Tag color={person.riskLevel === 'high' ? 'red' : person.riskLevel === 'medium' ? 'orange' : 'blue'}>
                        {person.riskLevel === 'high' ? '高风险' : person.riskLevel === 'medium' ? '中风险' : '低风险'}
                      </Tag>
                    </div>

                    {/* 卡片中部 (展示前2个社交媒体) */}
                    <div style={{ marginBottom: '12px', minHeight: '52px' }}>
                      <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>关联账号矩阵:</div>
                      {person.socialAccounts.slice(0, 2).map((acc, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginBottom: '4px' }}>
                          {acc.platform === 'weibo' && <WeiboOutlined style={{ color: '#f5222d' }} />}
                          {acc.platform === 'wechat' && <WechatOutlined style={{ color: '#389e0d' }} />}
                          {acc.platform === 'douyin' && <YoutubeOutlined style={{ color: '#722ed1' }} />}
                          <span style={{ fontWeight: 500 }}>{acc.username}</span>
                          <span style={{ color: '#aaa', fontSize: '11px' }}>({acc.id})</span>
                        </div>
                      ))}
                    </div>

                    {/* 卡片业务标签 */}
                    <div style={{ marginBottom: '12px', height: '24px', overflow: 'hidden' }}>
                      {person.tags.slice(0, 2).map((t, idx) => (
                        <Tag color="blue" key={idx} style={{ fontSize: '11px' }}>{t}</Tag>
                      ))}
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* 卡片底部 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                      <span>关联事件数: <strong>{person.incidentCount} 起</strong></span>
                      <span>活跃: {person.lastActive.substring(5, 10)}</span>
                    </div>
                  </Card>
                ))}
                {filteredData.length === 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Card style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>暂无符合检索条件的网民人员数据</Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 人员详情大号居中弹窗 (People Details Modal - 原生态事件脉络优化版) */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar size="small" style={{ backgroundColor: selectedPerson?.riskLevel === 'high' ? '#ff4d4f' : '#1890ff' }}>
                {selectedPerson?.name[0]}
              </Avatar>
              <span>网民聚合身份与社交主页轨迹档案</span>
            </div>
          }
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>
              关闭档案
            </Button>
          ]}
          width={820}
          centered
        >
          {selectedPerson && (
            <div>
              {/* 区块一：社媒账号详情流 (横向流式滚动卡片) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>已绑定社交媒体主页矩阵 (一对多)</div>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {selectedPerson.socialAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      style={{
                        minWidth: '220px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <Avatar size="default" style={{ backgroundColor: acc.platform === 'weibo' ? '#fff1f0' : acc.platform === 'wechat' ? '#f6ffed' : '#f9f0ff' }}>
                        {acc.platform === 'weibo' && <WeiboOutlined style={{ color: '#f5222d' }} />}
                        {acc.platform === 'wechat' && <WechatOutlined style={{ color: '#389e0d' }} />}
                        {acc.platform === 'douyin' && <YoutubeOutlined style={{ color: '#722ed1' }} />}
                      </Avatar>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{acc.username}</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>ID: {acc.id}</div>
                        <a href="#link-penetrate" onClick={(e) => { e.preventDefault(); message.info(`正在内网调取并跳转博主主页: ${acc.url}`); }} style={{ fontSize: '11px', color: '#1890ff', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                          <LinkOutlined /> 主页链接
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 区块二：个人信息网格 (Descriptions) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>受控人员基础身份台账</div>
                <Descriptions bordered size="small" column={3} contentStyle={{ fontSize: '12px' }} labelStyle={{ fontSize: '12px', fontWeight: 600, background: '#f9fafb' }}>
                  <Descriptions.Item label="姓名">{selectedPerson.name}</Descriptions.Item>
                  <Descriptions.Item label="性别">{selectedPerson.gender}</Descriptions.Item>
                  <Descriptions.Item label="年龄">{selectedPerson.age} 岁</Descriptions.Item>
                  <Descriptions.Item label="人员类型"><Tag color="purple">{selectedPerson.type}</Tag></Descriptions.Item>
                  <Descriptions.Item label="责任属地">{selectedPerson.department}分局</Descriptions.Item>
                  <Descriptions.Item label="出生日期">{selectedPerson.birthday}</Descriptions.Item>
                  <Descriptions.Item label="民族">{selectedPerson.nation}</Descriptions.Item>
                  <Descriptions.Item label="手机号码">{selectedPerson.phone}</Descriptions.Item>
                  <Descriptions.Item label="户籍地" span={1}>{selectedPerson.registeredAddress}</Descriptions.Item>
                  <Descriptions.Item label="身份证号" span={1}>{selectedPerson.idCard.substring(0, 6)}********{selectedPerson.idCard.substring(14)}</Descriptions.Item>
                  <Descriptions.Item label="现居住地" span={2}>{selectedPerson.residentAddress}</Descriptions.Item>
                  <Descriptions.Item label="入库时间">{selectedPerson.lastActive.substring(0, 10)}</Descriptions.Item>
                  <Descriptions.Item label="备注说明" span={3}>{selectedPerson.note}</Descriptions.Item>
                </Descriptions>
              </div>

              {/* 区块三：人员性质 (胶囊标签) */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>人员标签分类</div>
                <div>
                  {selectedPerson.tags.map((tag, idx) => (
                    <Tag color="cyan" key={idx} style={{ borderRadius: '12px', padding: '2px 10px' }}>{tag}</Tag>
                  ))}
                </div>
              </div>

              {/* 区块四：关联事件总数 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', background: '#f0f5ff', padding: '8px 16px', borderRadius: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1890ff' }}>
                  关联事件台账数：{selectedPerson.incidentCount} 起
                </span>
                <span style={{ fontSize: '11px', color: '#999' }}>* 数据完全来自于内网监测捕获的客观发帖记录</span>
              </div>

              {/* 区块五：客观涉事帖文脉络底栏 (时间流卡片 + 超链接 + 穿透模拟) */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '12px' }}>客观涉事帖文原生态轨迹</div>
                <Timeline mode="left">
                  {selectedPerson.recordList.map((post) => (
                    <Timeline.Item
                      key={post.id}
                      label={<span style={{ fontSize: '11px', color: '#999' }}>{post.publishTime}</span>}
                      color={selectedPerson.riskLevel === 'high' ? 'red' : 'orange'}
                    >
                      <Card
                        size="small"
                        style={{ border: '1px solid #e5e7eb', background: '#fafafa', borderRadius: '4px' }}
                      >
                        {/* 穿透链接标题 */}
                        <div style={{ marginBottom: '6px' }}>
                          <a
                            href="#penetrate"
                            onClick={(e) => {
                              e.preventDefault();
                              setPenetratePost(post);
                              setPenetrateVisible(true);
                            }}
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

                        {/* 帖文正文截取 */}
                        <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5', marginBottom: '8px' }}>
                          {post.content.length > 80 ? post.content.substring(0, 80) + '...' : post.content}
                        </div>

                        {/* 客观底栏特征 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#999' }}>
                          <Space>
                            <span>博主: <strong>{post.author}</strong> ({post.authorId})</span>
                            <span>平台: <Tag color="blue" style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}>{post.platform.toUpperCase()}</Tag></span>
                          </Space>
                          <Space size="middle">
                            <span>转发: {post.reposts}</span>
                            <span>评论: {post.comments}</span>
                            <span>点赞: {post.likes}</span>
                          </Space>
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
              <div
                style={{
                  border: '1px solid #ffccc7',
                  background: '#fff2f0',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: 600, color: '#f5222d', marginBottom: '6px' }}>【内网取证日志】</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <div><strong>采集链路：</strong>内网数据网关-1号分流器</div>
                  <div><strong>采集时间：</strong>{penetratePost.captureTime || penetratePost.publishTime}</div>
                  <div><strong>源发布IP：</strong>{penetratePost.ipAddress || '10.32.*.*'}</div>
                  <div><strong>防伪哈希：</strong>MD5_SHA256_{penetratePost.id}</div>
                </div>
              </div>

              {/* 原帖排版 */}
              <div style={{ padding: '16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Avatar style={{ backgroundColor: '#1890ff' }}>{penetratePost.author[0]}</Avatar>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{penetratePost.author}</strong>
                    <div style={{ fontSize: '11px', color: '#999' }}>ID: {penetratePost.authorId} | 发布于 {penetratePost.platform.toUpperCase()}</div>
                  </div>
                </div>

                {penetratePost.title && (
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{penetratePost.title}</h4>
                )}

                <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {penetratePost.content}
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#666' }}>
                  <span>发布时间：{penetratePost.publishTime}</span>
                  <span>互动：转发({penetratePost.reposts}) | 评论({penetratePost.comments}) | 点赞({penetratePost.likes})</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* 手动登记人员弹窗 (Create/Edit Modal) */}
        <Modal
          title={
            <span>
              <UserAddOutlined /> 手动登记网民档案与社媒矩阵
            </span>
          }
          open={registerVisible}
          onOk={handleRegisterSubmit}
          onCancel={() => setRegisterVisible(false)}
          okText="登记建档"
          cancelText="取消"
          width={650}
          centered
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ gender: '男', age: 35, riskLevel: 'medium', department: '淮安区', type: '重点关注人员' }}
          >
            {/* 双列水平表单部分 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="真实姓名"
                  rules={[{ required: true, message: '请录入真实姓名' }]}
                >
                  <Input placeholder="输入真实姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="idCard"
                  label="身份证号"
                  rules={[{ required: true, message: '请录入真实身份证号' }]}
                >
                  <Input placeholder="输入18位身份证，将自动在台账脱敏" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="手机号码"
                  rules={[{ required: true, message: '请录入手机号码' }]}
                >
                  <Input placeholder="输入11位手机号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="riskLevel"
                  label="风险研判等级"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'high', label: '高风险 (Red)' },
                      { value: 'medium', label: '中风险 (Orange)' },
                      { value: 'low', label: '低风险 (Blue)' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="department"
                  label="责任属地分局"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: '淮安区', label: '淮安分局' },
                      { value: '清江浦区', label: '清江浦分局' },
                      { value: '洪泽区', label: '洪泽分局' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="人员涉稳性质"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: '重点涉稳人员', label: '重点涉稳人员' },
                      { value: '网络大V', label: '网络大V' },
                      { value: '自媒体客', label: '自媒体客' },
                      { value: '关注人员', label: '关注人员' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="tags"
                  label="多级标签 (英文逗号分隔)"
                  rules={[{ required: true, message: '请选择或输入标签' }]}
                >
                  <Input placeholder="例如: 维权群体,房产维权,金地业主" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                >
                  <Select
                    options={[
                      { value: '男', label: '男' },
                      { value: '女', label: '女' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="年龄"
                >
                  <Input placeholder="输入真实年龄" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="birthday"
                  label="出生年月日"
                >
                  <Input placeholder="格式如: 1980-05-12" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="residentAddress"
              label="居住地址"
            >
              <Input placeholder="录入现住详细居住地址" />
            </Form.Item>

            <Form.Item
              name="note"
              label="备注档案信息"
            >
              <Input.TextArea placeholder="录入受控背景及涉稳动向说明..." rows={2} />
            </Form.Item>

            <Divider style={{ margin: '12px 0' }} />

            {/* 动态社交账号子表单 */}
            <div style={{ background: '#fafafa', padding: '12px', borderRadius: '4px', border: '1px dashed #ddd' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '10px' }}>
                绑定关联社交账号矩阵 (一对多)
              </div>
              <Form.List name="socialAccounts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'platform']}
                          rules={[{ required: true, message: '平台' }]}
                          style={{ margin: 0 }}
                        >
                          <Select
                            placeholder="选择平台"
                            style={{ width: 110 }}
                            options={[
                              { value: 'weibo', label: '新浪微博' },
                              { value: 'wechat', label: '微信' },
                              { value: 'douyin', label: '抖音' },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'id']}
                          rules={[{ required: true, message: '账号ID' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="账号唯一ID" style={{ width: 110 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'username']}
                          rules={[{ required: true, message: '昵称' }]}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="昵称" style={{ width: 110 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'url']}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="主页 URL 链接" style={{ width: 150 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'followers']}
                          style={{ margin: 0 }}
                        >
                          <Input placeholder="粉丝数" style={{ width: 80 }} />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', fontSize: '16px' }} />
                      </Space>
                    ))}
                    <Form.Item style={{ margin: 0 }}>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        一键绑定新增社交账号
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PeopleDatabase;
