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
  CommentOutlined,
  UsergroupAddOutlined,
  PlusOutlined,
  SolutionOutlined,
  MessageOutlined,
  SendOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  LinkOutlined,
  DisconnectOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  MergeCellsOutlined,
} from '@ant-design/icons';
import { initialPeopleData, PersonItem } from './PeopleDatabase';

// 私域群聊重点人类型
export interface GroupMemberItem {
  id: string;
  nickname: string;
  roleType: 'moderator' | 'activist' | 'responder'; // 群主，高频发声者，积极响应者
  personId?: string; // 关联人员库ID
  tempNote?: string; // 未建档临时备注
}

export interface GroupItem {
  id: string;
  name: string;
  channel: 'wechat' | 'qq' | 'dingtalk' | 'other';
  memberRange: '50' | '100' | '200' | '500'; // 50人以下, 51-100人, 101-200人, 201-500人
  memberCount: number;
  riskRating: 'high' | 'medium' | 'low' | 'blue'; // 红，橙，黄，蓝
  department: string; // 责任单位
  type: string; // 群类型标签
  groupCode: string; // 特征码/群ID
  qrCodeUrl?: string; // 二维码
  lastActive: string;
  members: GroupMemberItem[];
  bulletins: { time: string; content: string; reporter: string; level: 'red' | 'orange' | 'yellow' | 'blue'; imageUrl?: string }[];
}

const initialGroupData: GroupItem[] = [
  {
    id: 'G001',
    name: '金地花园业主常委会',
    channel: 'wechat',
    memberRange: '500',
    memberCount: 450,
    riskRating: 'high',
    department: '区住建局',
    type: '房产维权',
    groupCode: 'wx_group_jindi990',
    qrCodeUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=150&auto=format&fit=crop&q=60',
    lastActive: '2026-07-07 15:40',
    members: [
      { id: 'GM001', nickname: '业主张老三', roleType: 'moderator', personId: 'P001' },
      { id: 'GM002', nickname: '维权代表-李', roleType: 'activist', tempNote: '新发现金地三期维权积极分子，正调查' },
    ],
    bulletins: [
      { time: '2026-07-07 14:10', content: '业主张老三(张建国)在群里号召大家准备下午的住建局集体上访，现场预计超50人。', reporter: '网警大队-刘工', level: 'red' },
      { time: '2026-07-05 09:30', content: '群员李某在群内转发了不实延期交付文章，涉嫌造谣。', reporter: '值班员-张工', level: 'yellow' }
    ]
  },
  {
    id: 'G002',
    name: '洪泽环保同盟二群',
    channel: 'qq',
    memberRange: '200',
    memberCount: 180,
    riskRating: 'high',
    department: '区环保局',
    type: '劳资维权',
    groupCode: 'qq_group_hzhb332',
    qrCodeUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=150&auto=format&fit=crop&q=60',
    lastActive: '2026-07-07 11:20',
    members: [
      { id: 'GM003', nickname: '绿水发言人', roleType: 'moderator', personId: 'P003' },
      { id: 'GM004', nickname: '环保小强', roleType: 'responder', tempNote: '多次参与垃圾厂聚集活动，暂无人员库档案' }
    ],
    bulletins: [
      { time: '2026-07-07 09:10', content: '核心骨干王强发帖上传了垃圾焚烧厂清晨黑烟的恶臭视频，正组织村民周四聚集。', reporter: '洪泽舆情室', level: 'red' }
    ]
  },
  {
    id: 'G003',
    name: '淮安自媒体资讯分享群',
    channel: 'wechat',
    memberRange: '500',
    memberCount: 350,
    riskRating: 'medium',
    department: '网信办',
    type: '劳资维权',
    groupCode: 'wx_group_media12',
    qrCodeUrl: '',
    lastActive: '2026-07-06 22:15',
    members: [
      { id: 'GM005', nickname: '淮安爆料中心', roleType: 'moderator', personId: 'P002' }
    ],
    bulletins: [
      { time: '2026-07-06 20:00', content: '群里讨论本地自来水发黄事件，自媒体博主意图扩大爆料，已进行线上警示。', reporter: '网警大队-刘工', level: 'orange' }
    ]
  }
];

const StabilityMaintenance: React.FC = () => {
  const [groupList, setGroupList] = useState<GroupItem[]>(initialGroupData);
  const [peopleDatabase, setPeopleDatabase] = useState<PersonItem[]>(initialPeopleData);
  
  // 页面状态视图: "list" (列表页) 或 "workspace" (群档案详情页)
  const [activeView, setActiveView] = useState<'list' | 'workspace'>('list');
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);

  // 筛选状态
  const [searchText, setSearchText] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // 重点人快捷关联 Dialog
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkSearchText, setLinkSearchText] = useState('');
  const [activeMemberRow, setActiveMemberRow] = useState<GroupMemberItem | null>(null);

  // 反向建档表单
  const [reverseRegisterForm] = Form.useForm();

  // 侧边穿透抽屉
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerPerson, setDrawerPerson] = useState<PersonItem | null>(null);

  // 表单与图片模拟
  const [clueForm] = Form.useForm();
  const [staticForm] = Form.useForm();
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);

  // 1. 群聊列表删除操作
  const handleDeleteGroup = (groupId: string) => {
    setGroupList(groupList.filter((g) => g.id !== groupId));
    message.warning('该私域群聊台账已被物理移除');
  };

  // 进入详情工作台页
  const handleEnterWorkspace = (group: GroupItem) => {
    setSelectedGroup(group);
    setQrCodePreview(group.qrCodeUrl || null);
    setActiveView('workspace');
    staticForm.setFieldsValue({
      name: group.name,
      groupCode: group.groupCode,
      channel: group.channel,
      memberRange: group.memberRange,
      memberCount: group.memberCount,
      department: group.department,
      type: group.type,
      riskRating: group.riskRating,
    });
  };

  // 保存群基础静态档案 (卡片A)
  const handleSaveStaticInfo = () => {
    if (!selectedGroup) return;
    staticForm.validateFields().then((values) => {
      const updatedList = groupList.map((g) => {
        if (g.id === selectedGroup.id) {
          const updatedG = {
            ...g,
            ...values,
            qrCodeUrl: qrCodePreview || '',
          };
          setSelectedGroup(updatedG);
          return updatedG;
        }
        return g;
      });
      setGroupList(updatedList);
      message.success('群基础静态档案已成功更新并归档！');
    });
  };

  // 跨库快捷关联真实身份提交 (卡片B - 直接关联已有网民)
  const handleAssociatePerson = (person: PersonItem) => {
    if (!selectedGroup || !activeMemberRow) return;

    const updatedList = groupList.map((g) => {
      if (g.id === selectedGroup.id) {
        const updatedMembers = g.members.map((m) => {
          if (m.id === activeMemberRow.id) {
            return { ...m, personId: person.id, tempNote: undefined };
          }
          return m;
        });
        const updatedG = { ...g, members: updatedMembers };
        setSelectedGroup(updatedG);
        return updatedG;
      }
      return g;
    });

    setGroupList(updatedList);
    message.success(`群重点人已成功快捷绑定「人员库」真实档案: ${person.name}`);
    setLinkModalVisible(false);
  };

  // 反向登记建档并防重合并提交 (卡片B - 反向登记)
  const handleReverseRegister = () => {
    if (!selectedGroup || !activeMemberRow) return;

    reverseRegisterForm.validateFields().then((values) => {
      const { name, idCard, riskLevel, socialId, department } = values;

      // 1. 防重检索：根据姓名或身份证判定人员库中是否已存在
      const existingPerson = peopleDatabase.find(
        (p) => (idCard && p.idCard === idCard) || p.name === name
      );

      if (existingPerson) {
        // 画像合并：如果已存在，将新社交账号追加至已有人员的 socialAccounts 中
        const currentChannel = selectedGroup.channel;
        const existsSocial = existingPerson.socialAccounts.some(
          (sa) => sa.id === socialId && sa.platform === currentChannel
        );

        let updatedAccounts = [...existingPerson.socialAccounts];
        if (!existsSocial && socialId) {
          updatedAccounts.push({
            platform: currentChannel as any,
            username: activeMemberRow.nickname,
            id: socialId,
            followers: '未知',
            url: currentChannel === 'wechat' ? '微信内网封包' : 'QQ特征群包',
            status: 'monitored',
          });
        }

        const updatedDatabase = peopleDatabase.map((p) => {
          if (p.id === existingPerson.id) {
            return {
              ...p,
              socialAccounts: updatedAccounts,
              // 如果已有标签不含当前性质，则追加
              tags: Array.from(new Set([...p.tags, selectedGroup.type])),
            };
          }
          return p;
        });

        setPeopleDatabase(updatedDatabase);

        // 绑定群重点人行
        const updatedList = groupList.map((g) => {
          if (g.id === selectedGroup.id) {
            const updatedMembers = g.members.map((m) => {
              if (m.id === activeMemberRow.id) {
                return { ...m, personId: existingPerson.id, tempNote: undefined };
              }
              return m;
            });
            const updatedG = { ...g, members: updatedMembers };
            setSelectedGroup(updatedG);
            return updatedG;
          }
          return g;
        });
        setGroupList(updatedList);

        Modal.success({
          title: '人员画像智能合并归集成功！',
          icon: <MergeCellsOutlined style={{ color: '#52c41a' }} />,
          content: (
            <div>
              <p>系统检索到「人员库」中已存在 <strong>{name}</strong> 的重点人档案（ID: {existingPerson.id}）。</p>
              <p>已自动将当前群聊账号 <strong>{socialId}</strong> 作为新账号归集进该网民的社交矩阵中，画像已成功合并，免去重复建档！</p>
            </div>
          ),
        });

      } else {
        // 全新建档：生成全新 PersonItem，推入人员库中并完成绑定
        const newPersonId = `P_REV_${Date.now().toString().slice(-4)}`;
        const birthYear = 1980 + (Math.floor(Math.random() * 20));
        const defaultIdCard = idCard || `320802${birthYear}05120${Math.floor(Math.random() * 9)}X`;
        
        const newPerson: PersonItem = {
          id: newPersonId,
          name,
          gender: '男',
          age: 2026 - birthYear,
          nation: '汉族',
          birthday: `${birthYear}-05-12`,
          idCard: defaultIdCard,
          phone: `135****${1000 + Math.floor(Math.random() * 9000)}`,
          residentAddress: `江苏省淮安市${department}重点关注网民纳管区`,
          registeredAddress: `江苏省淮安市${department}流均镇重点区`,
          type: '重点关注人员',
          riskLevel: riskLevel || 'medium',
          tags: ['反向登记', selectedGroup.type],
          socialAccounts: socialId ? [
            {
              platform: selectedGroup.channel as any,
              username: activeMemberRow.nickname,
              id: socialId,
              followers: '群发言人',
              url: '内网审计',
              status: 'monitored',
            }
          ] : [],
          department: department || selectedGroup.department,
          status: 'monitored',
          lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
          incidentCount: 1,
          recordList: [
            {
              id: `POST_REV_${Date.now()}`,
              content: `【涉群聊言论】在「${selectedGroup.name}」群内发表言论，被反向审计归档。`,
              publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
              platform: selectedGroup.channel as any,
              author: activeMemberRow.nickname,
              authorId: socialId || 'unknown',
              reposts: 0,
              comments: 0,
              likes: 0,
              ipAddress: '10.32.188.99',
              captureTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          ],
          note: `该人员因在群聊「${selectedGroup.name}」中表现活跃，且人员库中原本未收录其身份。已于群聊台账工作台快捷反向登记建档入库。`
        };

        // 更新全局人员库 state
        setPeopleDatabase([...peopleDatabase, newPerson]);

        // 绑定群重点人行
        const updatedList = groupList.map((g) => {
          if (g.id === selectedGroup.id) {
            const updatedMembers = g.members.map((m) => {
              if (m.id === activeMemberRow.id) {
                return { ...m, personId: newPersonId, tempNote: undefined };
              }
              return m;
            });
            const updatedG = { ...g, members: updatedMembers };
            setSelectedGroup(updatedG);
            return updatedG;
          }
          return g;
        });
        setGroupList(updatedList);

        Modal.success({
          title: '重点人反向建档登记成功！',
          icon: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
          content: (
            <div>
              <p>全新受控重点人 <strong>{name}</strong> 档案创建完毕。</p>
              <p>该档案已实时同步写入内网人员库中（生成档案号: {newPersonId}），并成功绑定至当前群聊成员的真实身份栏！</p>
            </div>
          ),
        });
      }

      setLinkModalVisible(false);
      reverseRegisterForm.resetFields();
    });
  };

  // 解除关联绑定
  const handleUnlinkPerson = (memberId: string) => {
    if (!selectedGroup) return;
    const updatedList = groupList.map((g) => {
      if (g.id === selectedGroup.id) {
        const updatedMembers = g.members.map((m) => {
          if (m.id === memberId) {
            return { ...m, personId: undefined, tempNote: undefined };
          }
          return m;
        });
        const updatedG = { ...g, members: updatedMembers };
        setSelectedGroup(updatedG);
        return updatedG;
      }
      return g;
    });
    setGroupList(updatedList);
    message.warning('已解除身份关联绑定');
  };

  // 手工上报动态情报线索 (卡片C)
  const handleReportClue = () => {
    if (!selectedGroup) return;
    clueForm.validateFields().then((values) => {
      const updatedList = groupList.map((g) => {
        if (g.id === selectedGroup.id) {
          const newBulletin = {
            time: values.time || new Date().toISOString().replace('T', ' ').substring(0, 16),
            content: values.content,
            reporter: values.reporter || '当前内网业务员',
            level: values.level || 'blue',
            imageUrl: values.imageUrl || '',
          };
          const updatedG = {
            ...g,
            bulletins: [newBulletin, ...g.bulletins],
            lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
          setSelectedGroup(updatedG);
          return updatedG;
        }
        return g;
      });
      setGroupList(updatedList);
      message.success('情报舆情异动线索成功手工上报！');
      clueForm.resetFields();
    });
  };

  // 开启侧边穿透 Drawer 展现详情
  const handleOpenDrawer = (personId: string) => {
    const person = peopleDatabase.find(p => p.id === personId);
    if (person) {
      setDrawerPerson(person);
      setDrawerVisible(true);
    }
  };

  // 列表筛选
  const filteredGroups = groupList.filter((g) => {
    const matchSearch = g.name.includes(searchText) || g.groupCode.includes(searchText);
    const matchChannel = selectedChannel === 'all' || g.channel === selectedChannel;
    const matchSize = selectedSize === 'all' || g.memberRange === selectedSize;
    const matchDept = selectedDept === 'all' || g.department === selectedDept;

    return matchSearch && matchChannel && matchSize && matchDept;
  });

  // 跨库关联过滤
  const filteredCrossPeople = peopleDatabase.filter((p) => {
    return p.name.includes(linkSearchText) || p.idCard.includes(linkSearchText) || p.tags.some(t => t.includes(linkSearchText));
  });

  const listColumns = [
    {
      title: '群名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: GroupItem) => (
        <Space>
          <Avatar style={{ backgroundColor: record.channel === 'wechat' ? '#52c41a' : record.channel === 'qq' ? '#1890ff' : '#eb2f96' }}>
            {record.channel === 'wechat' ? '微' : record.channel === 'qq' ? 'Q' : '钉'}
          </Avatar>
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: '群ID (QQ号/特征码)',
      dataIndex: 'groupCode',
      key: 'groupCode',
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: string) => {
        const text = channel === 'wechat' ? '微信群' : channel === 'qq' ? 'QQ群' : channel === 'dingtalk' ? '钉钉' : '其他';
        return <Tag color="geekblue">{text}</Tag>;
      },
    },
    {
      title: '群规模',
      dataIndex: 'memberCount',
      key: 'memberCount',
      render: (count: number) => <span>{count} 人</span>,
    },
    {
      title: '群类型标签',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="cyan">{type}</Tag>,
    },
    {
      title: '最新动态时间',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '风险等级',
      dataIndex: 'riskRating',
      key: 'riskRating',
      render: (rating: string) => {
        let color = 'blue';
        let text = '低风险 (蓝)';
        if (rating === 'high') {
          color = 'red';
          text = '高风险 (红)';
        } else if (rating === 'medium') {
          color = 'orange';
          text = '中风险 (橙)';
        } else if (rating === 'yellow') {
          color = 'yellow';
          text = '关注级 (黄)';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: GroupItem) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleEnterWorkspace(record)}
          >
            进群档案
          </Button>
          <Button
            danger
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteGroup(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {activeView === 'list' ? (
          /* ==================== 1. 群聊列表页 ==================== */
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <MessageOutlined />
                  <span>私域涉稳群聊手工台账</span>
                </Space>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: 'normal' }}>
                  * 全量由网安及住建部门纯手工盘点入库，确保内网封闭流转
                </div>
              </div>
            }
            bordered={false}
          >
            {/* 筛选区 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <Space>
                <Input
                  placeholder="检索群聊名称/群ID特征码..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 240 }}
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  allowClear
                />
                <Select
                  value={selectedChannel}
                  onChange={setSelectedChannel}
                  style={{ width: 120 }}
                  options={[
                    { value: 'all', label: '全部渠道' },
                    { value: 'wechat', label: '微信群' },
                    { value: 'qq', label: 'QQ群' },
                    { value: 'dingtalk', label: '钉钉' },
                    { value: 'other', label: '其他' },
                  ]}
                />
                <Select
                  value={selectedSize}
                  onChange={setSelectedSize}
                  style={{ width: 130 }}
                  options={[
                    { value: 'all', label: '全部规模段' },
                    { value: '50', label: '50人以下' },
                    { value: '100', label: '51-100人' },
                    { value: '200', label: '101-200人' },
                    { value: '500', label: '201-500人' },
                  ]}
                />
                <Select
                  value={selectedDept}
                  onChange={setSelectedDept}
                  style={{ width: 140 }}
                  options={[
                    { value: 'all', label: '全部责任单位' },
                    { value: '区住建局', label: '区住建局' },
                    { value: '区环保局', label: '区环保局' },
                    { value: '网信办', label: '网信办' },
                  ]}
                />
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  const newId = `G${String(groupList.length + 1).padStart(3, '0')}`;
                  const newG: GroupItem = {
                    id: newId,
                    name: '新登记涉稳业主群',
                    channel: 'wechat',
                    memberRange: '100',
                    memberCount: 88,
                    riskRating: 'medium',
                    department: '区住建局',
                    type: '房产维权',
                    groupCode: `wx_group_${Date.now().toString().slice(-6)}`,
                    lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    members: [],
                    bulletins: [],
                  };
                  setGroupList([...groupList, newG]);
                  message.success('已新建一条空白群聊台账，点击“进群档案”可补充静态信息与成员。');
                }}
              >
                手工登记新群
              </Button>
            </div>

            <Table
              dataSource={filteredGroups}
              columns={listColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
              bordered
            />
          </Card>
        ) : (
          /* ==================== 2. 群档案详情与编辑工作台 ==================== */
          <div>
            {/* 顶部面包屑/操作 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  setActiveView('list');
                  setSelectedGroup(null);
                }}
              >
                返回群聊台账列表
              </Button>
              <span style={{ fontSize: '12px', color: '#888' }}>
                档案序列号: <strong>{selectedGroup?.id}</strong> | 最新动态: {selectedGroup?.lastActive}
              </span>
            </div>

            {selectedGroup && (
              <Row gutter={16}>
                {/* 页面左侧：【卡片 A：群基础静态信息表单】 */}
                <Col span={10}>
                  <Card
                    title="卡片 A：群基础静态资料档案"
                    extra={<Button type="primary" size="small" onClick={handleSaveStaticInfo}>保存归档修改</Button>}
                    style={{ height: '100%' }}
                  >
                    <Form
                      form={staticForm}
                      layout="vertical"
                      size="small"
                    >
                      <Form.Item
                        name="name"
                        label="群名称"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="groupCode"
                        label="群特征码/群ID"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="输入特征ID，如: wx_group_xxx" />
                      </Form.Item>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item name="channel" label="所属渠道平台">
                            <Select
                              options={[
                                { value: 'wechat', label: '微信群' },
                                { value: 'qq', label: 'QQ群' },
                                { value: 'dingtalk', label: '钉钉' },
                                { value: 'other', label: '其他' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="memberRange" label="涵盖人数范围">
                            <Select
                              options={[
                                { value: '50', label: '50人以下' },
                                { value: '100', label: '51-100人' },
                                { value: '200', label: '101-200人' },
                                { value: '500', label: '201-500人' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item name="department" label="监管责任单位">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="type" label="主要群聊性质分类">
                            <Select
                              options={[
                                { value: '房产维权', label: '房产维权' },
                                { value: '劳资维权', label: '劳资维权' },
                                { value: '医疗纠纷', label: '医疗纠纷' },
                                { value: '环保抗议', label: '环保抗议' },
                                { value: '退役军人诉求', label: '退役诉求' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="riskRating" label="安全预警级别">
                        <Select
                          options={[
                            { value: 'high', label: '高风险 (Red)' },
                            { value: 'medium', label: '中风险 (Orange)' },
                            { value: 'yellow', label: '关注级 (Yellow)' },
                            { value: 'blue', label: '低风险 (Blue)' },
                          ]}
                        />
                      </Form.Item>

                      <Divider style={{ margin: '12px 0' }} />

                      {/* 群二维码/成员截图附件区 */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '8px' }}>
                          群二维码 / 成员列表截图附件区
                        </div>
                        {qrCodePreview ? (
                          <div style={{ position: 'relative', width: '120px', height: '120px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={qrCodePreview} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            <div
                              onClick={() => setQrCodePreview(null)}
                              style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', color: '#fff', padding: '2px 6px', fontSize: '10px', cursor: 'pointer' }}
                            >
                              移出
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setQrCodePreview('https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=150&auto=format&fit=crop&q=60')}
                            style={{ width: '120px', height: '120px', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', color: '#999' }}
                          >
                            <FileImageOutlined style={{ fontSize: '24px', marginBottom: '6px' }} />
                            <span style={{ fontSize: '10px' }}>点击模拟上传截图</span>
                          </div>
                        )}
                      </div>
                    </Form>
                  </Card>
                </Col>

                <Col span={14}>
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    {/* 右侧(上)：【卡片 B：重点人员管理】 */}
                    <Card
                    title="卡片 B：群重点人与「人员库」关联"
                      extra={
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          icon={<PlusOutlined />}
                          onClick={() => {
                            const newM: GroupMemberItem = {
                              id: `GM_${Date.now()}`,
                              nickname: '新发掘发言网民',
                              roleType: 'activist',
                            };
                            const updatedList = groupList.map((g) => {
                              if (g.id === selectedGroup.id) {
                                const updatedG = { ...g, members: [...g.members, newM] };
                                setSelectedGroup(updatedG);
                                return updatedG;
                              }
                              return g;
                            });
                            setGroupList(updatedList);
                            message.success('已新增一行空白群成员记录，请点击右侧进行身份快捷关联。');
                          }}
                        >
                          发掘新重点人
                        </Button>
                      }
                    >
                      <Table
                        dataSource={selectedGroup.members}
                        rowKey="id"
                        size="small"
                        pagination={false}
                        bordered
                        columns={[
                          {
                            title: '群内昵称',
                            dataIndex: 'nickname',
                            key: 'nickname',
                            render: (text: string, record: GroupMemberItem) => (
                              <Input
                                defaultValue={text}
                                size="small"
                                style={{ width: '120px' }}
                                onChange={(e) => {
                                  record.nickname = e.target.value;
                                }}
                              />
                            )
                          },
                          {
                            title: '成员类型',
                            dataIndex: 'roleType',
                            key: 'roleType',
                            render: (type: string, record: GroupMemberItem) => (
                              <Select
                                defaultValue={type}
                                size="small"
                                style={{ width: '130px' }}
                                onChange={(value) => {
                                  record.roleType = value as any;
                                }}
                                options={[
                                  { value: 'moderator', label: '群主/创建者' },
                                  { value: 'activist', label: '高频发言者' },
                                  { value: 'responder', label: '积极响应者' },
                                ]}
                              />
                            ),
                          },
                          {
                            title: '关联真实身份 (穿透人员库)',
                            key: 'associatedPerson',
                            render: (_: any, record: GroupMemberItem) => {
                              if (record.personId) {
                                const person = peopleDatabase.find(p => p.id === record.personId);
                                return (
                                  <Space>
                                    <strong
                                      style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}
                                      onClick={() => handleOpenDrawer(record.personId!)}
                                      title="点击弹出网民内网画像档案"
                                    >
                                      {person?.name || '未知人员'}
                                    </strong>
                                    <Tag color={person?.riskLevel === 'high' ? 'red' : 'orange'}>
                                      {person?.riskLevel === 'high' ? '高危' : '中危'}
                                    </Tag>
                                  </Space>
                                );
                              }
                              if (record.tempNote) {
                                return <Tag color="default">未建档: {record.tempNote}</Tag>;
                              }
                              return <span style={{ color: '#aaa', fontSize: '12px' }}>未绑定身份</span>;
                            },
                          },
                          {
                            title: '操作',
                            key: 'action',
                            render: (_: any, record: GroupMemberItem) => (
                              <Space>
                                <Button
                                  type="link"
                                  size="small"
                                  icon={<LinkOutlined />}
                                  onClick={() => {
                                    setActiveMemberRow(record);
                                    setLinkSearchText('');
                                    setLinkModalVisible(true);
                                    // 自动初始化反向登记表单中的社交账号和属地字段
                                    reverseRegisterForm.setFieldsValue({
                                      name: '',
                                      idCard: '',
                                      riskLevel: 'medium',
                                      socialId: `wxid_${Math.random().toString(36).substring(3, 9)}`,
                                      department: selectedGroup.department
                                    });
                                  }}
                                >
                                  关联
                                </Button>
                                {(record.personId || record.tempNote) && (
                                  <Button
                                    type="text"
                                    danger
                                    size="small"
                                    icon={<DisconnectOutlined />}
                                    onClick={() => handleUnlinkPerson(record.id)}
                                  >
                                    解绑
                                  </Button>
                                )}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Card>

                    {/* 右侧(下)：【卡片 C：动态线索手动上报】 */}
                    <Card title="卡片 C：动态舆情线索手动上报 (时间轴)">
                      {/* 上报表单 */}
                      <Form
                        form={clueForm}
                        layout="vertical"
                        size="small"
                        onFinish={handleReportClue}
                      >
                        <Row gutter={8}>
                          <Col span={12}>
                            <Form.Item name="time" label="线索发生时间">
                              <Input placeholder="不填则默认为当前时间" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item name="level" label="预警评估评级">
                              <Select
                                options={[
                                  { value: 'red', label: '红色 (高危发酵)' },
                                  { value: 'orange', label: '橙色 (需警示约谈)' },
                                  { value: 'yellow', label: '黄色 (舆情关注)' },
                                  { value: 'blue', label: '蓝色 (日常动态)' },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="content"
                          label="动态摘要情报"
                          rules={[{ required: true, message: '请输入情报线索正文' }]}
                        >
                          <Input.TextArea placeholder="录入群内发生的聚会串联、敏感爆料或违规言论的细节..." rows={2} />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Form.Item name="reporter" noStyle>
                            <Input placeholder="线索上报人" style={{ width: '160px' }} size="small" />
                          </Form.Item>
                          <Button
                            type="primary"
                            icon={<SendOutlined />}
                            htmlType="submit"
                          >
                            立即上报情报
                          </Button>
                        </div>
                      </Form>

                      <Divider style={{ margin: '16px 0 12px' }} />

                      {/* 线索历史时间轴 */}
                      <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                        <Timeline mode="left">
                          {selectedGroup.bulletins.map((b, idx) => (
                            <Timeline.Item
                              key={idx}
                              label={<span style={{ fontSize: '11px', color: '#999' }}>{b.time}</span>}
                              color={b.level === 'red' ? 'red' : b.level === 'orange' ? 'orange' : b.level === 'yellow' ? 'gold' : 'blue'}
                            >
                              <div style={{ fontSize: '12px', background: '#fafafa', border: '1px solid #eee', borderRadius: '4px', padding: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                                  <span>评估级：<strong>{b.level.toUpperCase()}</strong></span>
                                  <span>上报：{b.reporter}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#333' }}>{b.content}</div>
                              </div>
                            </Timeline.Item>
                          ))}
                          {selectedGroup.bulletins.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#ccc', padding: '16px', fontSize: '12px' }}>
                              本群暂无历史手工情报线索
                            </div>
                          )}
                        </Timeline>
                      </div>
                    </Card>
                  </Space>
                </Col>
              </Row>
            )}
          </div>
        )}

        {/* 跨库快捷检索关联身份 Dialog (Dialog 嵌套) */}
        <Modal
          title={
            <span>
              <UsergroupAddOutlined style={{ color: '#1890ff' }} /> 跨库关联网民人员身份
            </span>
          }
          open={linkModalVisible}
          onCancel={() => setLinkModalVisible(false)}
          footer={null}
          width={650}
          centered
        >
          {activeMemberRow && selectedGroup && (
            <div>
              <Alert
                message={`当前正在为群内成员「${activeMemberRow.nickname}」寻找真实受控身份档案。`}
                type="info"
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <div style={{ marginBottom: '12px' }}>
                <Input
                  placeholder="按受控网民姓名、脱敏身份证或标签模糊检索人员库..."
                  value={linkSearchText}
                  onChange={(e) => setLinkSearchText(e.target.value)}
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  allowClear
                />
              </div>

              {/* 搜索表格 */}
              <Table
                dataSource={filteredCrossPeople}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 3 }}
                bordered
                columns={[
                  {
                    title: '受控网民姓名',
                    dataIndex: 'name',
                    key: 'name',
                    render: (text: string, record: PersonItem) => (
                      <div>
                        <strong>{text}</strong>
                        <div style={{ fontSize: '10px', color: '#999' }}>身份证: {record.idCard.substring(0, 6)}...{record.idCard.substring(14)}</div>
                      </div>
                    )
                  },
                  {
                    title: '评估等级',
                    dataIndex: 'riskLevel',
                    key: 'riskLevel',
                    render: (risk: string) => (
                      <Tag color={risk === 'high' ? 'red' : risk === 'medium' ? 'orange' : 'blue'}>
                        {risk === 'high' ? '高风险' : '中风险'}
                      </Tag>
                    ),
                  },
                  {
                    title: '责任属地',
                    dataIndex: 'department',
                    key: 'department',
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_: any, record: PersonItem) => (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleAssociatePerson(record)}
                      >
                        选择关联
                      </Button>
                    ),
                  },
                ]}
              />

              <Divider style={{ margin: '16px 0' }} />

              {/* 一键反向登记建档（快捷填报区域，支持重复画像智能合并归集） */}
              <div style={{ background: '#f5f7fa', padding: '16px', border: '1px dashed #1890ff', borderRadius: '6px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0050b3', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <PlusOutlined />
                  <span>未收录？一键反向登记建档（数据自动防重与多号合并归集）</span>
                </div>
                
                <Form
                  form={reverseRegisterForm}
                  layout="vertical"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item name="name" label="真实姓名" rules={[{ required: true, message: '姓名必填' }]}>
                        <Input placeholder="姓名(重名将自动画像合并)" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="idCard" label="身份证号">
                        <Input placeholder="选填(身份证匹配最精准)" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="riskLevel" label="安全风险评级">
                        <Select
                          options={[
                            { value: 'high', label: '高风险 (红)' },
                            { value: 'medium', label: '中风险 (橙)' },
                            { value: 'yellow', label: '关注级 (黄)' },
                            { value: 'blue', label: '低风险 (蓝)' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item name="socialId" label={`当前绑定群账号ID (${selectedGroup.channel === 'wechat' ? '微信ID' : 'QQ特征码'})`} rules={[{ required: true, message: '必填' }]}>
                        <Input placeholder="输入群成员的微信号或QQID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="department" label="责任纳管属地">
                        <Select
                          options={[
                            { value: '淮安区', label: '淮安区' },
                            { value: '清江浦区', label: '清江浦区' },
                            { value: '洪泽区', label: '洪泽区' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ textAlign: 'right', marginTop: '4px' }}>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handleReverseRegister}
                    >
                      一键反向登记建档
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </Modal>

        {/* 侧边穿透抽屉 (模拟点击姓名穿透查询重点网民画像档案) */}
        <Drawer
          title="网民重点人员内网画像档案"
          placement="right"
          width={500}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          {drawerPerson && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <h3 style={{ margin: '10px 0 2px 0', fontSize: '18px' }}>{drawerPerson.name}</h3>
                <Tag color={drawerPerson.riskLevel === 'high' ? 'red' : 'orange'}>
                  {drawerPerson.riskLevel === 'high' ? '极高涉稳风险' : '中度舆情风险'}
                </Tag>
              </div>

              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="档案编号">{drawerPerson.id}</Descriptions.Item>
                <Descriptions.Item label="身份证号">{drawerPerson.idCard}</Descriptions.Item>
                <Descriptions.Item label="纳管单位">{drawerPerson.department}分局网安大队</Descriptions.Item>
                <Descriptions.Item label="关注性质标签">
                  <div>
                    {drawerPerson.tags.map((t, idx) => (
                      <Tag color="cyan" key={idx}>{t}</Tag>
                    ))}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="备注记录">{drawerPerson.note}</Descriptions.Item>
              </Descriptions>

              <Divider orientation={"left" as any} style={{ margin: '20px 0 10px' }}><span style={{ fontSize: '13px' }}>绑定社媒矩阵</span></Divider>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {drawerPerson.socialAccounts.map((sa, idx) => (
                  <Card key={idx} size="small" style={{ borderLeft: '3px solid #52c41a' }}>
                    <div style={{ fontSize: '12px' }}>
                      <div>平台: <Tag color="green">{sa.platform.toUpperCase()}</Tag></div>
                      <div>账号: <strong>{sa.username}</strong></div>
                      <div>ID特征: <code>{sa.id}</code></div>
                    </div>
                  </Card>
                ))}
              </div>

              <Divider orientation={"left" as any} style={{ margin: '20px 0 10px' }}><span style={{ fontSize: '13px' }}>涉事客观帖文脉络</span></Divider>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <Timeline>
                  {drawerPerson.recordList.map((post, idx) => (
                    <Timeline.Item key={idx}>
                      <div style={{ fontSize: '11px', color: '#999' }}>{post.publishTime}</div>
                      <div style={{ fontSize: '12px', color: '#333' }}>{post.content}</div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default StabilityMaintenance;
