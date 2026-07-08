import React, { useState } from 'react';
import {
  Card,
  Input,
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
} from '@ant-design/icons';
import { PersonItem } from './PeopleDatabase';

// ==================== 数据结构与 Mock 数据 ====================

// 稳情标签接口
interface StabilityTagItem {
  key: string;
  name: string;
  dynamicCount: number;
  peopleCount: number;
  groupCount: number;
  updateTime: string;
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
    dynamicCount: 24,
    peopleCount: 18,
    groupCount: 4,
    updateTime: '2026-07-08 16:30',
  },
  {
    key: 'tag_002',
    name: '棠下外资骑手劳资纠纷',
    dynamicCount: 15,
    peopleCount: 12,
    groupCount: 3,
    updateTime: '2026-07-08 15:40',
  },
  {
    key: 'tag_003',
    name: '越秀越洋货运物流代理纠纷',
    dynamicCount: 9,
    peopleCount: 6,
    groupCount: 2,
    updateTime: '2026-07-07 10:20',
  },
  {
    key: 'tag_004',
    name: '白云出租车行业价格调整诉求',
    dynamicCount: 32,
    peopleCount: 25,
    groupCount: 6,
    updateTime: '2026-07-08 14:15',
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

// ==================== React 组件 ====================

const StabilityMaintenance: React.FC = () => {
  // 页面导航控制: 'list' (主列表) | 'detail' (详情控制台)
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedTag, setSelectedTag] = useState<StabilityTagItem>(mockTagsList[0]);
  
  // 筛选与检索过滤
  const [searchText, setSearchText] = useState('');
  const [filterTags, setFilterTags] = useState(mockTagsList);

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

  // 搜索处理
  const handleSearch = (val: string) => {
    setSearchText(val);
    if (!val.trim()) {
      setFilterTags(mockTagsList);
    } else {
      const filtered = mockTagsList.filter(
        (t) => t.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilterTags(filtered);
    }
  };

  // 进入详情控制台
  const handleEnterDetail = (tagRecord: StabilityTagItem) => {
    setSelectedTag(tagRecord);
    setCurrentView('detail');
  };

  // 穿透并组装重点网民特征融合画像
  const handleOpenPersonDrawer = (sPerson: StabilityPersonItem) => {
    // 将涉稳人员数据转换并丰富为 PersonItem 画像格式
    const fullPerson: PersonItem = {
      id: sPerson.id,
      name: sPerson.name,
      gender: '女',
      age: 38,
      nation: '汉族',
      birthday: '1982-05-05',
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
      incidentCount: selectedTag.dynamicCount,
      recordList: mockDynamics.map((d) => ({
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
      note: `已抽取为稳情库事件【${selectedTag.name}】的重点人员，在微信群及社交媒体上有高频维权发言，倾向突出。`,
      source: 'stability',
      peopleType: 'normal',
      groupTag: selectedTag.name,
    };

    setActivePerson(fullPerson);
    setPersonDrawerOpen(true);
  };

  // 打开群组抽屉
  const handleOpenGroupDrawer = (gRecord: CollatedGroupItem) => {
    setActiveGroup(gRecord);
    setGroupDrawerOpen(true);
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
              <Row align="middle">
                <Col span={8}>
                  <Input
                    placeholder="输入稳情标签名称过滤检索..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                    style={{ borderRadius: '6px' }}
                  />
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
                    title: '稳情标签名称',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text) => <span className="group-name-highlight" style={{ fontSize: '15px' }}>{text}</span>,
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
                        <FileTextOutlined /> 动态 ({mockDynamics.length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={mockDynamics}
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
                        <UserOutlined /> 人员 ({mockPeople.length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={mockPeople}
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
                        <UsergroupAddOutlined /> 群组 ({mockGroups.length})
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={mockGroups}
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
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: '14px', color: '#262626' }}>
                标题：
              </div>
              <h3 style={{ fontWeight: 'bold', color: '#1890ff', margin: '0 0 16px 0', fontSize: '16px' }}>
                {selectedDynamic.title}
              </h3>
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
                    <Badge status="processing" text="监控中" />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 描述项 */}
            <Descriptions title="基本信息" size="small" bordered column={2} style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="性别">{activePerson.gender}</Descriptions.Item>
              <Descriptions.Item label="年龄">{activePerson.age} 岁</Descriptions.Item>
              <Descriptions.Item label="民族">{activePerson.nation}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{activePerson.idCard}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{activePerson.phone}</Descriptions.Item>
              <Descriptions.Item label="出生日期">{activePerson.birthday}</Descriptions.Item>
              <Descriptions.Item label="居住地址" span={2}>{activePerson.residentAddress}</Descriptions.Item>
              <Descriptions.Item label="户籍地址" span={2}>{activePerson.registeredAddress}</Descriptions.Item>
              <Descriptions.Item label="情况备注说明" span={2}>{activePerson.note}</Descriptions.Item>
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
                {mockDynamics.map(dyn => (
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
                dataSource={mockPeople.filter(p => p.groups?.includes(activeGroup.name))}
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
                    title: '属性',
                    key: 'type',
                    render: () => <Tag color="purple">核心涉稳人员</Tag>
                  },
                  {
                    title: '风险等级',
                    dataIndex: 'riskLevel',
                    key: 'riskLevel',
                    render: (level: 'high' | 'medium' | 'low') => {
                      const colors = { high: 'red', medium: 'orange', low: 'green' };
                      const texts = { high: '高风险', medium: '中风险', low: '低风险' };
                      return <Tag color={colors[level]}>{texts[level]}</Tag>;
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
        title={<span><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> 蓝鹰一体化系统 - 内网取证存证证书</span>}
        open={evidenceVisible}
        onCancel={() => setEvidenceVisible(false)}
        footer={[
          <Button key="close" onClick={() => setEvidenceVisible(false)}>关闭</Button>,
          <Button key="download" type="primary" onClick={() => message.success('哈希存证证书已顺利物理保存并输出PDF，哈希签名成功生成！')}>
            导出存证报告
          </Button>
        ]}
        destroyOnClose
      >
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', border: '1px solid #d9d9d9' }}>
          {evidenceText}
        </div>
      </Modal>
    </div>
  );
};

export default StabilityMaintenance;
