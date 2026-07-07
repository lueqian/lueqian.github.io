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
  PlusOutlined,
  SolutionOutlined,
  SendOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  LinkOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PartitionOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { generateMockPeople, PersonItem, SocialAccount, PostItem } from './PeopleDatabase';

// 涉稳情报接口
export interface StabilityIntelligence {
  id: string;
  title: string; // 情报标题
  content: string; // 详实摘要/内容描述
  event: string; // 指向事件
  groupTag: '房产维权' | '环保维权' | '医患群体' | '退役军人' | '涉法涉诉'; // 所属重点群体
  category: '串联煽动' | '拉横幅聚集' | '舆论造谣' | '阻碍执法'; // 情报类别
  location: '淮安区' | '清江浦区' | '洪泽区'; // 事关地
  adopted: 'yes' | 'no'; // 是否采用
  registerTime: string; // 登记时间
  department: string; // 责任分局/机构
  reporter: string; // 上报民警
  relatedPeopleIds: string[]; // 关联的重点人ID
}

// 模拟初始涉稳情报数据
const initialIntelligenceList: StabilityIntelligence[] = [
  {
    id: 'INTEL_001',
    title: '金地花园业主拉横幅聚集赴住建局维权动向',
    content: '重点人张建国在私域社群发帖动员，准备本周三上午组织业主代表约50人，前往区住建局聚集静坐拉横幅请愿，诉求为查明房屋预售资金流向。',
    event: '0510 金地烂尾维权',
    groupTag: '房产维权',
    category: '拉横幅聚集',
    location: '淮安区',
    adopted: 'yes',
    registerTime: '2026-07-07 14:10',
    department: '区住建局专班',
    reporter: '警员-李明',
    relatedPeopleIds: ['PERSON_1'] // 关联 Mock人员的第 1 个张建国
  },
  {
    id: 'INTEL_002',
    title: '洪泽垃圾焚烧厂扩建引发村民串联聚集线索',
    content: '监测到抖音拍客上传厂区清晨黑烟的恶臭视频，并呼吁周边三个村庄的代表于周四在厂门口进行堵路聚集，阻碍垃圾车进厂。',
    event: '洪泽垃圾厂扩建舆情',
    groupTag: '环保维权',
    category: '串联煽动',
    location: '洪泽区',
    adopted: 'yes',
    registerTime: '2026-07-07 09:10',
    department: '洪泽环保中队',
    reporter: '警员-王伟',
    relatedPeopleIds: ['PERSON_12']
  },
  {
    id: 'INTEL_003',
    title: '涉三院医闹纠纷网民串联聚集舆情线索',
    content: '患者家属在论坛发布歪曲医疗事故的贴文，煽动亲戚代表于明日到市第三人民医院挂牌静坐索要高额赔偿，存在阻碍医疗秩序的隐患。',
    event: '三院医闹纠纷',
    groupTag: '医患群体',
    category: '阻碍执法',
    location: '清江浦区',
    adopted: 'no',
    registerTime: '2026-07-06 18:22',
    department: '清江浦公安局',
    reporter: '网警大队-徐工',
    relatedPeopleIds: []
  }
];

const StabilityMaintenance: React.FC = () => {
  const [intelList, setIntelList] = useState<StabilityIntelligence[]>(initialIntelligenceList);
  const [peopleDatabase, setPeopleDatabase] = useState<PersonItem[]>(generateMockPeople());

  // 筛选过滤状态
  const [searchText, setSearchText] = useState('');
  const [filterAdopted, setFilterAdopted] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // 手工登记情报 Modal 控制
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerForm] = Form.useForm();

  // 查看情报详情 Modal
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedIntel, setSelectedIntel] = useState<StabilityIntelligence | null>(null);

  // 人员双源头画像侧边抽屉穿透控制
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerPerson, setDrawerPerson] = useState<PersonItem | null>(null);

  // 删除情报操作
  const handleDeleteIntel = (id: string) => {
    setIntelList(intelList.filter(item => item.id !== id));
    message.warning('该涉稳情报台账已被安全移除！');
  };

  // 手工情报录入提交
  const handleRegisterSubmit = () => {
    registerForm.validateFields().then((values) => {
      const newIntel: StabilityIntelligence = {
        id: `INTEL_${Date.now()}`,
        title: values.title,
        content: values.content,
        event: values.event || '未指向特定事件',
        groupTag: values.groupTag,
        category: values.category,
        location: values.location,
        adopted: values.adopted,
        registerTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        department: '网安专案班',
        reporter: '值班网警',
        relatedPeopleIds: values.relatedPeopleIds || []
      };

      setIntelList([newIntel, ...intelList]);
      message.success(`成功登记涉稳情报: ${values.title}`);
      
      // 如果该情报被采用，且关联了人员，模拟自动为人员标记“涉稳登记来源”或“both”
      if (values.relatedPeopleIds && values.relatedPeopleIds.length > 0) {
        const updatedPeople = peopleDatabase.map((p) => {
          if (values.relatedPeopleIds.includes(p.id)) {
            const currentSource = p.source;
            const targetSource: 'opinion' | 'stability' | 'both' = currentSource === 'opinion' ? 'both' : 'stability';
            return {
              ...p,
              source: targetSource,
              groupTag: values.groupTag,
              tags: Array.from(new Set([...p.tags, '涉稳登记', values.groupTag]))
            };
          }
          return p;
        });
        setPeopleDatabase(updatedPeople);
      }

      setRegisterVisible(false);
      registerForm.resetFields();
    });
  };

  // 侧滑拉出升级版的“双源头合并画像”抽屉
  const handleOpenPersonDrawer = (personId: string) => {
    const person = peopleDatabase.find(p => p.id === personId);
    if (person) {
      setDrawerPerson(person);
      setDrawerVisible(true);
    } else {
      message.error('无法定位该网民的全量身份画像！');
    }
  };

  // 情报过滤算法
  const getFilteredIntel = () => {
    return intelList.filter((item) => {
      // 1. 全局搜索
      if (searchText) {
        const query = searchText.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchContent = item.content.toLowerCase().includes(query);
        const matchEvent = item.event.toLowerCase().includes(query);
        if (!matchTitle && !matchContent && !matchEvent) return false;
      }
      // 2. 采用状态
      if (filterAdopted !== 'all' && item.adopted !== filterAdopted) return false;
      // 3.群体
      if (filterGroup !== 'all' && item.groupTag !== filterGroup) return false;
      // 4. 事关地
      if (filterLocation !== 'all' && item.location !== filterLocation) return false;

      return true;
    });
  };

  const currentList = getFilteredIntel();

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {/* 顶部检索区与手工录入动作 */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={12} align="middle">
            {/* 模糊搜索 */}
            <Col span={6}>
              <Input
                placeholder="搜索情报标题、正文或指向事件..."
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>

            {/* 所属重点群体 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>群体:</span>
                <Select
                  style={{ width: '100%' }}
                  value={filterGroup}
                  onChange={setFilterGroup}
                  options={[
                    { value: 'all', label: '全部群体' },
                    { value: '房产维权', label: '房产维权' },
                    { value: '环保维权', label: '环保维权' },
                    { value: '医患群体', label: '医患群体' },
                    { value: '退役军人', label: '退役军人' },
                    { value: '涉法涉诉', label: '涉法涉诉' },
                  ]}
                />
              </div>
            </Col>

            {/* 事关地 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>事关地:</span>
                <Select
                  style={{ width: '100%' }}
                  value={filterLocation}
                  onChange={setFilterLocation}
                  options={[
                    { value: 'all', label: '全部地' },
                    { value: '淮安区', label: '淮安区' },
                    { value: '清江浦区', label: '清江浦区' },
                    { value: '洪泽区', label: '洪泽区' },
                  ]}
                />
              </div>
            </Col>

            {/* 是否采用 */}
            <Col span={4}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#555', marginRight: '6px', whiteSpace: 'nowrap' }}>采用:</span>
                <Select
                  style={{ width: '100%' }}
                  value={filterAdopted}
                  onChange={setFilterAdopted}
                  options={[
                    { value: 'all', label: '全部' },
                    { value: 'yes', label: '已采用情报' },
                    { value: 'no', label: '未采用' },
                  ]}
                />
              </div>
            </Col>

            {/* 手工登记 */}
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setRegisterVisible(true)}>
                手工登记涉稳情报
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 涉稳情报列表 Table 展现 */}
        <Card size="small">
          <Table
            dataSource={currentList}
            rowKey="id"
            bordered
            size="middle"
            columns={[
              {
                title: '情报标题',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => (
                  <span
                    style={{ fontWeight: 600, color: '#1890ff', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      setSelectedIntel(record);
                      setDetailVisible(true);
                    }}
                  >
                    {text}
                  </span>
                )
              },
              {
                title: '指向事件',
                dataIndex: 'event',
                key: 'event',
                width: 140,
                render: (text) => <Tag color="blue">{text}</Tag>
              },
              {
                title: '重点群体',
                dataIndex: 'groupTag',
                key: 'groupTag',
                width: 110,
                render: (text) => <Tag color="purple">{text}</Tag>
              },
              {
                title: '情报类别',
                dataIndex: 'category',
                key: 'category',
                width: 110,
                render: (text) => <Tag color="cyan">{text}</Tag>
              },
              {
                title: '事关地',
                dataIndex: 'location',
                key: 'location',
                width: 100,
                render: (text) => (
                  <span>
                    <EnvironmentOutlined style={{ marginRight: '4px', color: '#999' }} />
                    {text}
                  </span>
                )
              },
              {
                title: '采用状态',
                dataIndex: 'adopted',
                key: 'adopted',
                width: 100,
                render: (adopted) => (
                  adopted === 'yes' 
                    ? <Tag color="green" icon={<CheckCircleOutlined />}>已采用</Tag>
                    : <Tag color="default" icon={<CloseCircleOutlined />}>未采用</Tag>
                )
              },
              {
                title: '关联人员 (点击穿透画像)',
                dataIndex: 'relatedPeopleIds',
                key: 'relatedPeopleIds',
                render: (ids: string[]) => {
                  if (!ids || ids.length === 0) return <span style={{ color: '#ccc' }}>无关联重点人</span>;
                  return (
                    <Space size={4} wrap>
                      {ids.map((id) => {
                        const person = peopleDatabase.find(p => p.id === id);
                        if (!person) return null;
                        return (
                          <Tag
                            color="red"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOpenPersonDrawer(id)}
                            key={id}
                          >
                            👤 {person.name}
                          </Tag>
                        );
                      })}
                    </Space>
                  );
                }
              },
              {
                title: '操作',
                key: 'actions',
                width: 150,
                render: (_, record) => (
                  <Space>
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => {
                        setSelectedIntel(record);
                        setDetailVisible(true);
                      }}
                    >
                      查看
                    </Button>
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteIntel(record.id)}
                    >
                      删除
                    </Button>
                  </Space>
                )
              }
            ]}
          />
        </Card>

        {/* 1. 涉稳情报登记 Modal 弹窗 */}
        <Modal
          title={
            <span>
              <PlusOutlined style={{ color: '#722ed1' }} /> 手工录入涉稳情报台账
            </span>
          }
          open={registerVisible}
          onOk={handleRegisterSubmit}
          onCancel={() => setRegisterVisible(false)}
          okText="确认登记"
          cancelText="取消"
          width={600}
          centered
        >
          <Form form={registerForm} layout="vertical">
            <Form.Item name="title" label="情报标题" rules={[{ required: true, message: '请填写情报标题' }]}>
              <Input placeholder="输入精简的情报标题" />
            </Form.Item>

            <Form.Item name="content" label="情报正文详细摘要" rules={[{ required: true, message: '请填写情报正文' }]}>
              <Input.TextArea placeholder="输入重点网民串联聚集、拉横幅或网上煽动的详细时间、地点、人数等摘要..." rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="event" label="指向舆情事件名称">
                  <Input placeholder="例如: 金地花园烂尾维权" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="groupTag" label="所涉重点群体" rules={[{ required: true }]} initialValue="房产维权">
                  <Select
                    options={[
                      { value: '房产维权', label: '房产维权群体' },
                      { value: '环保维权', label: '环保维权群体' },
                      { value: '医患群体', label: '医患纠纷群体' },
                      { value: '退役军人', label: '退役安置诉求群体' },
                      { value: '涉法涉诉', label: '涉法涉诉申诉群体' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="category" label="情报类别" rules={[{ required: true }]} initialValue="拉横幅聚集">
                  <Select
                    options={[
                      { value: '拉横幅聚集', label: '拉横幅聚集' },
                      { value: '串联煽动', label: '串联煽动' },
                      { value: '舆论造谣', label: '舆论造谣' },
                      { value: '阻碍执法', label: '阻碍执法' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="location" label="事关地" rules={[{ required: true }]} initialValue="淮安区">
                  <Select
                    options={[
                      { value: '淮安区', label: '淮安区' },
                      { value: '清江浦区', label: '清江浦区' },
                      { value: '洪泽区', label: '洪泽区' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="adopted" label="是否采用" rules={[{ required: true }]} initialValue="yes">
                  <Select
                    options={[
                      { value: 'yes', label: '已采用' },
                      { value: 'no', label: '未采用' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 快捷关联人员库网民 */}
            <Form.Item name="relatedPeopleIds" label="关联涉稳重点人员 (下拉多选搜索人员库)">
              <Select
                mode="multiple"
                placeholder="点击选择或搜索姓名"
                optionFilterProp="label"
                options={peopleDatabase.map(p => ({
                  value: p.id,
                  label: `${p.name} (身份证: ${p.idCard.substring(0,6)}****${p.idCard.substring(14)})`
                }))}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* 2. 情报详情 Modal 弹窗 */}
        <Modal
          title={
            <span>
              <InfoCircleOutlined /> 涉稳情报台账详细摘要
            </span>
          }
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setDetailVisible(false)}>
              关闭详情
            </Button>
          ]}
          width={650}
          centered
        >
          {selectedIntel && (
            <div>
              <Alert
                message={`登记属地分局: ${selectedIntel.department}  |  上报民警: ${selectedIntel.reporter}`}
                type="info"
                style={{ marginBottom: '16px' }}
              />

              <Descriptions bordered column={2} size="small" style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="情报标题" span={2}><strong>{selectedIntel.title}</strong></Descriptions.Item>
                <Descriptions.Item label="指向事件"><Tag color="blue">{selectedIntel.event}</Tag></Descriptions.Item>
                <Descriptions.Item label="采用状态">
                  {selectedIntel.adopted === 'yes' 
                    ? <Tag color="green">已采用</Tag>
                    : <Tag color="default">未采用</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="涉稳群体"><Tag color="purple">{selectedIntel.groupTag}</Tag></Descriptions.Item>
                <Descriptions.Item label="情报类别"><Tag color="cyan">{selectedIntel.category}</Tag></Descriptions.Item>
                <Descriptions.Item label="事关地"><span>{selectedIntel.location}</span></Descriptions.Item>
                <Descriptions.Item label="登记时间"><span>{selectedIntel.registerTime}</span></Descriptions.Item>
              </Descriptions>

              <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '4px', borderLeft: '4px solid #722ed1', marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '6px' }}>情报正文详细内容：</div>
                <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
                  {selectedIntel.content}
                </div>
              </div>

              {/* 关联人员 */}
              <div>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px' }}>关联受控重点人员：</div>
                {selectedIntel.relatedPeopleIds.length === 0 ? (
                  <span style={{ color: '#ccc', fontSize: '12px' }}>暂无关联网民人员</span>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                    {selectedIntel.relatedPeopleIds.map((id) => {
                      const person = peopleDatabase.find(p => p.id === id);
                      if (!person) return null;
                      return (
                        <Card
                          key={id}
                          size="small"
                          hoverable
                          onClick={() => handleOpenPersonDrawer(id)}
                          style={{ border: '1px solid #e8e8e8' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Avatar size="small">{person.name[0]}</Avatar>
                            <div>
                              <strong style={{ fontSize: '12.5px', color: '#1890ff', textDecoration: 'underline' }}>{person.name}</strong>
                              <div style={{ fontSize: '10px', color: '#999' }}>{person.gender} | {person.age}岁</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* 3. 侧滑穿透重点人融合画像 Drawer */}
        <Drawer
          title="蓝鹰网民全量特征融合画像"
          placement="right"
          width={650}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          {drawerPerson && (
            <div>
              {/* 基本摘要 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f5f7fa', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
                <Avatar size={50} style={{ backgroundColor: '#87d068' }}>{drawerPerson.name[0]}</Avatar>
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
                    <Tag color="cyan">{drawerPerson.department}分局</Tag>
                  </Space>
                </div>
              </div>

              {/* 来源与身份双重融合特征 */}
              <Descriptions bordered size="small" column={1} style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="脱敏身份证"><code>{drawerPerson.idCard.substring(0, 6)}********{drawerPerson.idCard.substring(14)}</code></Descriptions.Item>
                <Descriptions.Item label="脱敏手机号"><span>{drawerPerson.phone.substring(0, 3)}****{drawerPerson.phone.substring(7)}</span></Descriptions.Item>
                <Descriptions.Item label="双源头来源属性">
                  {drawerPerson.source === 'both' ? (
                    <Space>
                      <Tag color="red">双源头融合身份</Tag>
                      <Tag color="blue">舆情指令</Tag>
                      <Tag color="purple">涉稳登记</Tag>
                    </Space>
                  ) : drawerPerson.source === 'opinion' ? (
                    <Tag color="blue">舆情指令录入</Tag>
                  ) : (
                    <Tag color="purple">涉稳台账登记</Tag>
                  )}
                </Descriptions.Item>
                
                {/* 融合属性 */}
                {drawerPerson.source === 'both' && (
                  <>
                    <Descriptions.Item label="网民类型 (舆情特征)"><Tag color="blue">自媒体大V</Tag></Descriptions.Item>
                    <Descriptions.Item label="涉稳群体 (涉稳特征)"><Tag color="purple">{drawerPerson.groupTag}</Tag></Descriptions.Item>
                  </>
                )}
                {drawerPerson.source === 'opinion' && (
                  <Descriptions.Item label="网民类型 (舆情特征)">
                    <strong>{drawerPerson.peopleType === 'media' ? '自媒体大V' : '普通关注网民'}</strong>
                  </Descriptions.Item>
                )}
                {drawerPerson.source === 'stability' && (
                  <Descriptions.Item label="涉稳群体 (涉稳特征)">
                    <strong>{drawerPerson.groupTag}</strong>
                  </Descriptions.Item>
                )}
                
                <Descriptions.Item label="详细现住址">{drawerPerson.residentAddress}</Descriptions.Item>
              </Descriptions>

              {/* 社交账号 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '13px' }}>监控社媒矩阵</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {drawerPerson.socialAccounts.map((account, index) => (
                    <Card key={index} size="small" style={{ background: '#fafafa' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>👤 {account.username}</span>
                        <Tag color="blue">{account.platform.toUpperCase()}</Tag>
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                        ID: <code>{account.id}</code>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 客观帖文脉络 */}
              <div>
                <div style={{ fontWeight: 600, color: '#333', marginBottom: '8px', fontSize: '13px' }}>客观取证帖文流 (不提供AI摘要)</div>
                <Timeline>
                  {drawerPerson.recordList.map((post) => (
                    <Timeline.Item key={post.id} color="red">
                      <div style={{ fontSize: '12px', color: '#333', fontWeight: 600 }}>{post.content.substring(0, 30)}...</div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                        发布时间: {post.publishTime}  |  平台: {post.platform.toUpperCase()}
                      </div>
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
