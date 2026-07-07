import React, { useState } from 'react';
import {
  Card,
  Input,
  Tree,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Divider,
  Table,
  message,
  Select,
  Typography,
  Row,
  Col,
  Alert,
} from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  EditOutlined,
  FileWordOutlined,
  ProfileOutlined,
  SnippetsOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  UnlockOutlined,
  FolderAddOutlined,
  CopyOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

// 舆情素材排版卡片接口
export interface ArticleMaterial {
  id: string;
  type: 'article' | 'title'; // 舆情卡片 或 虚拟公文小标题
  title: string; // 修改后的公文标题/小标题内容
  platform?: string; // 原帖出处
  author?: string; // 原帖作者
  summary?: string; // 改写后的公文舆情摘要
  opinion?: string; // 手工录入的研判观点
}

// 刊物档案接口
export interface PublicationIssue {
  key: string;
  title: string;
  editor: string; // 责任编辑
  scope: string; // 报送范围
  status: 'editing' | 'archived'; // 编辑中，已归档
  date: string;
  materials: ArticleMaterial[];
}

// 目录树默认数据
const initialTreeData = [
  {
    title: '周期性简报',
    key: 'periodic',
    icon: <FolderOpenOutlined />,
    children: [
      { title: '每日要情日报', key: 'daily' },
      { title: '舆情值班周报', key: 'weekly' },
      { title: '涉稳要情月报', key: 'monthly' },
    ],
  },
  {
    title: '专项简报',
    key: 'special',
    icon: <FolderOpenOutlined />,
    children: [
      { title: '金地花园专项', key: 'special-jindi' },
      { title: '环保厂扩建专项', key: 'special-hb' },
    ],
  },
  {
    title: '呈批件',
    key: 'approval',
    icon: <FolderOpenOutlined />,
    children: [
      { title: '高危舆情呈批件', key: 'approval-high' },
    ],
  },
];

// 模拟刊物期数台账数据
const initialIssues: PublicationIssue[] = [
  {
    key: 'issue-101',
    title: '2026年第84期每日要情日报',
    editor: '网安支队-李工',
    scope: '公安局领导、网安支队内阅',
    status: 'editing',
    date: '2026-07-07',
    materials: [
      {
        id: 'M001',
        type: 'title',
        title: '一、 涉金地花园烂尾楼业主维权动向',
      },
      {
        id: 'M002',
        type: 'article',
        title: '关于金地花园业主拉横幅聚集的请愿言论捕获',
        platform: '新浪微博',
        author: '楚州老张',
        summary: '网民“楚州老张”在微博发表长文痛陈小区拖延交付两年，呼吁全体业主于本周三上午赴区住建局聚集拉横幅，评论区煽动反应激烈。',
        opinion: '建议属地派出所提前介入，与住建部门联合开展现场稳控工作，防止次生涉稳聚集。'
      },
      {
        id: 'M003',
        type: 'title',
        title: '二、 涉洪泽垃圾焚烧厂扩建尾气关注',
      },
      {
        id: 'M004',
        type: 'article',
        title: '关于洪泽区垃圾焚烧厂清晨冒黄烟排放的舆情捕获',
        platform: '抖音',
        author: '绿水青山王',
        summary: '抖音短视频曝光厂区清晨排黄烟恶臭视频，声称周边水井已被污染，已召集三个村代表在厂区静坐，要求拿评估报告。',
        opinion: '要求环保部门尽快出具排污监测指标，辟除水井污染谣言，平息群众恐慌。'
      }
    ]
  },
  {
    key: 'issue-102',
    title: '2026年第83期每日要情日报',
    editor: '网安支队-刘工',
    scope: '公安局领导、网安支队内阅',
    status: 'archived',
    date: '2026-07-06',
    materials: [
      {
        id: 'M005',
        type: 'title',
        title: '一、 自来水发黄事件大V带头扩散预警',
      },
      {
        id: 'M006',
        type: 'article',
        title: '关于抖音账号“淮安美食姐”爆料本地自来水发黄的情况专报',
        platform: '抖音',
        author: '淮安美食姐',
        summary: '大V爆料自来水发黄，跟帖声讨集中于自来水厂和监管层，视频转发已超1200次。',
        opinion: '已联动网安约谈当事人，自来水公司公开辟谣，目前舆情已平息。'
      }
    ]
  },
  {
    key: 'issue-103',
    title: '金地花园维权专项简报第01期',
    editor: '房产科-王工',
    scope: '局分管领导、专案组内阅',
    status: 'editing',
    date: '2026-07-05',
    materials: []
  }
];

const PublicationsManagement: React.FC = () => {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [issues, setIssues] = useState<PublicationIssue[]>(initialIssues);
  
  // 单页视图状态: "hub" (目录大厅) 或 "workspace" (排版工作台)
  const [activeView, setActiveView] = useState<'hub' | 'workspace'>('hub');
  const [selectedIssue, setSelectedIssue] = useState<PublicationIssue | null>(null);

  // 目录树当前选中的文件夹节点 key
  const [selectedFolderKey, setSelectedFolderKey] = useState<string>('daily');

  // 大厅新建/重命名文件夹 Modal 控制
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderActionType, setFolderActionType] = useState<'create' | 'rename'>('create');
  const [folderForm] = Form.useForm();

  // 排版小标题编辑控制
  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [titleForm] = Form.useForm();
  
  // 双击或点击直接编辑小标题的状态定义
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  // 跨模块收藏 Dialog 控制
  const [collectModalVisible, setCollectModalVisible] = useState(false);
  const [collectForm] = Form.useForm();

  // 生成底稿预览页
  const [previewVisible, setPreviewVisible] = useState(false);

  // 1. 目录树右键/顶部模拟新建或重命名
  const handleFolderAction = () => {
    folderForm.validateFields().then((values) => {
      if (folderActionType === 'create') {
        // 新建节点
        const updated = treeData.map((node) => {
          if (node.key === 'periodic' || node.key === 'special' || node.key === 'approval') {
            if (node.key === selectedFolderKey || node.children.some(c => c.key === selectedFolderKey)) {
              return {
                ...node,
                children: [
                  ...node.children,
                  { title: values.folderName, key: `folder_${Date.now()}` }
                ]
              };
            }
          }
          return node;
        });
        setTreeData(updated);
        message.success(`成功新建简报文件夹目录: ${values.folderName}`);
      } else {
        // 重命名节点
        const updated = treeData.map((node) => {
          const children = node.children.map((child) => {
            if (child.key === selectedFolderKey) {
              return { ...child, title: values.folderName };
            }
            return child;
          });
          return { ...node, children };
        });
        setTreeData(updated);
        message.success(`简报目录已被重命名为: ${values.folderName}`);
      }
      setFolderModalVisible(false);
      folderForm.resetFields();
    });
  };

  // 2. 点击进入工作台
  const handleEnterWorkspace = (issue: PublicationIssue) => {
    setSelectedIssue(issue);
    setActiveView('workspace');
  };

  // 3. 归档锁死机制
  const handleLockPublication = () => {
    if (!selectedIssue) return;
    const updated = issues.map((iss) => {
      if (iss.key === selectedIssue.key) {
        const locked = { ...iss, status: 'archived' as const };
        setSelectedIssue(locked);
        return locked;
      }
      return iss;
    });
    setIssues(updated);
    message.warning('当前期刊物已被归档锁死！所有排版调序和标题编辑功能已被完全锁定。');
  };

  // 4. 插入公文小标题横条
  const handleAddTitle = () => {
    if (!selectedIssue) return;
    titleForm.validateFields().then((values) => {
      const newTitleItem: ArticleMaterial = {
        id: `TITLE_${Date.now()}`,
        type: 'title',
        title: values.titleText,
      };
      const updatedMaterials = [...selectedIssue.materials, newTitleItem];
      const updatedIssues = issues.map((iss) => {
        if (iss.key === selectedIssue.key) {
          const updatedG = { ...iss, materials: updatedMaterials };
          setSelectedIssue(updatedG);
          return updatedG;
        }
        return iss;
      });
      setIssues(updatedIssues);
      message.success('已插入公文分隔小标题横条！');
      setTitleModalVisible(false);
      titleForm.resetFields();
    });
  };

  // 保存双击/直接点击在线编辑小标题
  const handleSaveInlineTitle = (titleId: string) => {
    if (!selectedIssue) return;
    const updatedMaterials = selectedIssue.materials.map((m) => {
      if (m.id === titleId) {
        return { ...m, title: editingTitleText };
      }
      return m;
    });
    const updatedIssues = issues.map((iss) => {
      if (iss.key === selectedIssue.key) {
        const updatedG = { ...iss, materials: updatedMaterials };
        setSelectedIssue(updatedG);
        return updatedG;
      }
      return iss;
    });
    setIssues(updatedIssues);
    setEditingTitleId(null);
    message.success('小标题修改已保存');
  };

  // 5. 排序调序交互 (上移 / 下移 / 删除)
  const handleMoveMaterial = (index: number, direction: 'up' | 'down') => {
    if (!selectedIssue || selectedIssue.status === 'archived') return;
    const newList = [...selectedIssue.materials];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;

    // 交换
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;

    const updatedIssues = issues.map((iss) => {
      if (iss.key === selectedIssue.key) {
        const updatedG = { ...iss, materials: newList };
        setSelectedIssue(updatedG);
        return updatedG;
      }
      return iss;
    });
    setIssues(updatedIssues);
  };

  const handleDeleteMaterial = (index: number) => {
    if (!selectedIssue || selectedIssue.status === 'archived') return;
    const newList = [...selectedIssue.materials];
    newList.splice(index, 1);

    const updatedIssues = issues.map((iss) => {
      if (iss.key === selectedIssue.key) {
        const updatedG = { ...iss, materials: newList };
        setSelectedIssue(updatedG);
        return updatedG;
      }
      return iss;
    });
    setIssues(updatedIssues);
    message.warning('素材已移出当前刊物');
  };

  // 6. 跨模块收集弹窗模拟
  const handleCollectArticle = () => {
    if (!selectedIssue) return;
    collectForm.validateFields().then((values) => {
      const newArticleItem: ArticleMaterial = {
        id: `ART_${Date.now()}`,
        type: 'article',
        title: values.editTitle,
        platform: values.platform || '外部信源',
        author: values.author || '匿名网民',
        summary: values.summary,
        opinion: values.opinion || '未录入研判观点',
      };

      const updatedMaterials = [...selectedIssue.materials, newArticleItem];
      const updatedIssues = issues.map((iss) => {
        if (iss.key === selectedIssue.key) {
          const updatedG = { ...iss, materials: updatedMaterials };
          setSelectedIssue(updatedG);
          return updatedG;
        }
        return iss;
      });
      setIssues(updatedIssues);
      message.success('已成功模拟将外部浏览素材加入当前期排版列表！');
      setCollectModalVisible(false);
      collectForm.resetFields();
    });
  };

  // 7. 纯文本无杂质公文拼接导出格式生成
  const generateExportPlaintext = () => {
    if (!selectedIssue) return '';
    let text = `======================================================\n`;
    text += `       蓝 鹰 舆 情 要 情 简 报 报 送 稿 底 稿\n`;
    text += `======================================================\n`;
    text += `【期号】：${selectedIssue.title}\n`;
    text += `【责任编辑】：${selectedIssue.editor}\n`;
    text += `【报送范围】：${selectedIssue.scope}\n`;
    text += `【导出时间】：${new Date().toISOString().replace('T', ' ').substring(0, 10)}\n`;
    text += `------------------------------------------------------\n\n`;

    selectedIssue.materials.forEach((item) => {
      if (item.type === 'title') {
        text += `\n${item.title}\n`;
        text += `======================================================\n`;
      } else {
        text += `【舆情公文标题】：${item.title}\n`;
        text += `【原始舆情出处】：${item.platform} (发布网民: ${item.author})\n`;
        text += `【公文改写摘要】：${item.summary}\n`;
        text += `【手工研判观点】：${item.opinion}\n`;
        text += `------------------------------------------------------\n\n`;
      }
    });

    return text;
  };

  // 过滤大厅显示的期数台账
  const filteredIssues = issues.filter((iss) => {
    if (selectedFolderKey === 'daily') return iss.title.includes('日报');
    if (selectedFolderKey === 'weekly') return iss.title.includes('周报');
    if (selectedFolderKey === 'special-jindi' || selectedFolderKey === 'special-hb') return iss.title.includes('专项');
    return true;
  });

  return (
    <div className="dark-watermark-container">
      <div className="custom-page-container">
        {activeView === 'hub' ? (
          /* ==================== 1. 刊物目录大厅 ==================== */
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px' }}>
            {/* 左侧文件夹树 */}
            <Card className="filter-sidebar-card" style={{ height: 'calc(100vh - 210px)' }}>
              <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <ProfileOutlined />
                  <span>简报大厅目录树</span>
                </Space>
                <Space size={2}>
                  <Button
                    type="text"
                    size="small"
                    icon={<FolderAddOutlined />}
                    onClick={() => {
                      setFolderActionType('create');
                      setFolderModalVisible(true);
                    }}
                    title="新建子文件夹"
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setFolderActionType('rename');
                      setFolderModalVisible(true);
                    }}
                    title="重命名选中"
                  />
                </Space>
              </div>
              <Tree
                defaultExpandAll
                treeData={treeData}
                onSelect={(keys) => {
                  if (keys.length > 0) {
                    setSelectedFolderKey(keys[0] as string);
                  }
                }}
              />
            </Card>

            {/* 右侧刊物档案台账列表 */}
            <Card
              title={
                <span>
                  <BookOutlined /> 目录下的简报排期档册
                </span>
              }
            >
              <Table
                dataSource={filteredIssues}
                rowKey="key"
                bordered
                size="middle"
                columns={[
                  {
                    title: '简报名称及期数',
                    dataIndex: 'title',
                    key: 'title',
                    render: (text: string) => <strong>{text}</strong>,
                  },
                  {
                    title: '责任编辑',
                    dataIndex: 'editor',
                    key: 'editor',
                  },
                  {
                    title: '发布时间',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: '归档状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'archived' ? 'green' : 'orange'}>
                        {status === 'archived' ? '已归档锁死' : '编辑中'}
                      </Tag>
                    ),
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_: any, record: PublicationIssue) => (
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          ghost={record.status === 'archived'}
                          icon={<SnippetsOutlined />}
                          onClick={() => handleEnterWorkspace(record)}
                        >
                          {record.status === 'archived' ? '查看排版' : '进入排版工作台'}
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        ) : (
          /* ==================== 2. 刊物工作台/素材排版页 ==================== */
          <div>
            {/* 顶部元数据与工具栏 */}
            {selectedIssue && (
              <div>
                <Card
                  size="small"
                  style={{ marginBottom: '16px', borderLeft: selectedIssue.status === 'archived' ? '4px solid #52c41a' : '4px solid #faad14' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => {
                        setActiveView('hub');
                        setSelectedIssue(null);
                      }}
                    >
                      返回简报大厅
                    </Button>
                    <Space>
                      {selectedIssue.status === 'editing' ? (
                        <Button
                          type="primary"
                          danger
                          icon={<LockOutlined />}
                          onClick={handleLockPublication}
                        >
                          归档锁死
                        </Button>
                      ) : (
                        <Tag color="green" icon={<LockOutlined />} style={{ padding: '4px 10px', fontSize: '13px' }}>已归档锁定</Tag>
                      )}
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        disabled={selectedIssue.materials.length === 0}
                        onClick={() => setPreviewVisible(true)}
                      >
                        生成底稿/复制全文
                      </Button>
                    </Space>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* 元数据参数 */}
                  <Row gutter={16} style={{ fontSize: '13px', color: '#666', paddingLeft: '8px' }}>
                    <Col span={6}>刊物名称: <strong>{selectedIssue.title}</strong></Col>
                    <Col span={6}>责任编辑: <strong>{selectedIssue.editor}</strong></Col>
                    <Col span={6}>报送范围: <strong style={{ color: '#ff4d4f' }}>{selectedIssue.scope}</strong></Col>
                    <Col span={6}>排版状态: <Tag color={selectedIssue.status === 'archived' ? 'green' : 'orange'}>{selectedIssue.status === 'archived' ? '已锁死' : '允许编辑'}</Tag></Col>
                  </Row>
                </Card>

                {/* 列表排版编排主区 */}
                <Card
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>舆情简报素材公文编排队列</span>
                      <Space>
                        <Button
                          size="small"
                          icon={<PlusOutlined />}
                          disabled={selectedIssue.status === 'archived'}
                          onClick={() => setTitleModalVisible(true)}
                        >
                          插入公文小标题
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          disabled={selectedIssue.status === 'archived'}
                          icon={<SnippetsOutlined />}
                          onClick={() => setCollectModalVisible(true)}
                        >
                          模拟外部收藏入刊
                        </Button>
                      </Space>
                    </div>
                  }
                  bordered={false}
                >
                  {selectedIssue.materials.length === 0 ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', background: '#fafafa', borderRadius: '6px', border: '1px dashed #ddd', color: '#999' }}>
                      本期内尚无舆情简报素材。请点击上方按钮进行小标题插入，或点击“模拟外部收藏”一键拉入素材。
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedIssue.materials.map((item, idx) => {
                        const isTitle = item.type === 'title';
                        const isArchived = selectedIssue.status === 'archived';

                        if (isTitle) {
                          // 公文小标题 Section横条
                          return (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#e6f7ff',
                                border: '1px dashed #1890ff',
                                borderRadius: '4px',
                                padding: '8px 16px'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                {editingTitleId === item.id ? (
                                  <Input
                                    size="small"
                                    value={editingTitleText}
                                    onChange={(e) => setEditingTitleText(e.target.value)}
                                    onPressEnter={() => handleSaveInlineTitle(item.id)}
                                    onBlur={() => handleSaveInlineTitle(item.id)}
                                    style={{ width: '300px' }}
                                    autoFocus
                                  />
                                ) : (
                                  <div
                                    onDoubleClick={() => {
                                      if (!isArchived) {
                                        setEditingTitleId(item.id);
                                        setEditingTitleText(item.title);
                                      }
                                    }}
                                    onClick={() => {
                                      if (!isArchived) {
                                        setEditingTitleId(item.id);
                                        setEditingTitleText(item.title);
                                      }
                                    }}
                                    style={{
                                      fontWeight: 'bold',
                                      color: '#0050b3',
                                      cursor: isArchived ? 'default' : 'pointer'
                                    }}
                                    title={isArchived ? '' : '点击或双击即可在线大修标题'}
                                  >
                                    {item.title} <span style={{ fontSize: '11px', color: '#999', fontWeight: 'normal', marginLeft: '8px' }}>{!isArchived && '(点击在线修改)'}</span>
                                  </div>
                                )}
                              </div>

                              <Space>
                                <Button
                                  size="small"
                                  type="text"
                                  disabled={idx === 0 || isArchived}
                                  icon={<ArrowUpOutlined />}
                                  onClick={() => handleMoveMaterial(idx, 'up')}
                                />
                                <Button
                                  size="small"
                                  type="text"
                                  disabled={idx === selectedIssue.materials.length - 1 || isArchived}
                                  icon={<ArrowDownOutlined />}
                                  onClick={() => handleMoveMaterial(idx, 'down')}
                                />
                                <Button
                                  size="small"
                                  type="text"
                                  danger
                                  disabled={isArchived}
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteMaterial(idx)}
                                />
                              </Space>
                            </div>
                          );
                        }

                        // 舆情公文素材卡片
                        return (
                          <Card
                            key={item.id}
                            size="small"
                            bordered
                            style={{ background: '#fff', borderLeft: '4px solid #1890ff' }}
                            extra={
                              <Space>
                                <Button
                                  size="small"
                                  type="text"
                                  disabled={idx === 0 || isArchived}
                                  icon={<ArrowUpOutlined />}
                                  onClick={() => handleMoveMaterial(idx, 'up')}
                                />
                                <Button
                                  size="small"
                                  type="text"
                                  disabled={idx === selectedIssue.materials.length - 1 || isArchived}
                                  icon={<ArrowDownOutlined />}
                                  onClick={() => handleMoveMaterial(idx, 'down')}
                                />
                                <Button
                                  size="small"
                                  type="text"
                                  danger
                                  disabled={isArchived}
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteMaterial(idx)}
                                />
                              </Space>
                            }
                            title={
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag color="blue">{item.platform}</Tag>
                                <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.title}</span>
                              </div>
                            }
                          >
                            <div style={{ fontSize: '12.5px', color: '#666', lineHeight: '1.6' }}>
                              <div><strong>【信源作者】：</strong>{item.author}</div>
                              <div style={{ marginTop: '4px' }}>
                                <strong>【改写公文舆情摘要】：</strong>{item.summary}
                              </div>
                              <div style={{ marginTop: '4px', background: '#f5f7fa', padding: '6px 12px', borderRadius: '4px', borderLeft: '3px solid #722ed1', color: '#531dab' }}>
                                <strong>【手工录入研判观点】：</strong>{item.opinion}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* 目录文件夹新建/重命名弹窗 */}
        <Modal
          title={folderActionType === 'create' ? '新建简报目录文件夹' : '重命名选中的简报目录'}
          open={folderModalVisible}
          onOk={handleFolderAction}
          onCancel={() => setFolderModalVisible(false)}
          okText="确认应用"
          cancelText="取消"
          width={400}
          centered
        >
          <Form form={folderForm} layout="vertical">
            <Form.Item
              name="folderName"
              label="文件夹/简报目录名称"
              rules={[{ required: true, message: '必须填写目录名称' }]}
            >
              <Input placeholder="输入名称，如：维稳专题要报" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 插入虚拟公文小标题弹窗 */}
        <Modal
          title="插入虚拟公文小标题横条"
          open={titleModalVisible}
          onOk={handleAddTitle}
          onCancel={() => setTitleModalVisible(false)}
          okText="插入排版"
          cancelText="取消"
          width={400}
          centered
        >
          <Form form={titleForm} layout="vertical">
            <Form.Item
              name="titleText"
              label="公文小标题标题内容"
              rules={[{ required: true, message: '请填写公文大纲标题' }]}
            >
              <Input placeholder="例如: 一、涉环保领域线上涉稳动向" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 模拟跨模块收集入刊 Dialog */}
        <Modal
          title={
            <span>
              <SnippetsOutlined style={{ color: '#1890ff' }} /> 模拟跨模块收集舆情入刊 (加工大底稿)
            </span>
          }
          open={collectModalVisible}
          onOk={handleCollectArticle}
          onCancel={() => setCollectModalVisible(false)}
          okText="加工并收集入本期"
          cancelText="取消"
          width={520}
          centered
        >
          <Form
            form={collectForm}
            layout="vertical"
            initialValues={{
              platform: '微信群聊',
              author: '网民A',
              editTitle: '关于某某安置纠纷在微信群煽动非法集会的舆情报告',
              summary: '涉事网民在微信群中召集群友拟定于周五去局前聚集，有一定扩大事态倾向。',
              opinion: '建议加强线下派出所的动态稳控，约谈群主。'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Form.Item name="platform" label="原始发帖平台出处" rules={[{ required: true }]}>
                <Input placeholder="微博, 微信群, QQ等" />
              </Form.Item>
              <Form.Item name="author" label="原作者账号昵称" rules={[{ required: true }]}>
                <Input placeholder="发布人昵称" />
              </Form.Item>
            </div>

            <Form.Item
              name="editTitle"
              label="大修公文标题 (改写)"
              rules={[{ required: true, message: '请大修标题' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="summary"
              label="改写公文舆情摘要"
              rules={[{ required: true, message: '请录入改写摘要' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="opinion"
              label="手工录入研判观点"
              rules={[{ required: true, message: '请录入研判观点' }]}
            >
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 纯文本无杂质公文拼接导出预览 Modal */}
        <Modal
          title={
            <span>
              <FileTextOutlined style={{ color: '#52c41a' }} /> 简报红头公文排版纯文本拼接预览
            </span>
          }
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          okText="一键复制全文底稿"
          cancelText="关闭"
          onOk={() => {
            navigator.clipboard.writeText(generateExportPlaintext());
            message.success('要情简报纯文本底稿已成功复制到系统剪贴板！可直接粘贴进 Word 或呈批件系统中。');
            setPreviewVisible(false);
          }}
          width={650}
          centered
        >
          <div
            style={{
              background: '#fff',
              border: '2px solid #ff4d4f', // 经典红头公文框
              borderRadius: '4px',
              padding: '24px',
              maxHeight: '400px',
              overflowY: 'auto',
              fontFamily: 'SimSun, "Times New Roman", serif',
            }}
          >
            {/* 报头红头 */}
            <div style={{ textAlign: 'center', color: '#ff4d4f', marginBottom: '20px' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '4px' }}>蓝 鹰 一 体 化 值 班 要 情</div>
              <div style={{ fontSize: '13px', marginTop: '6px', letterSpacing: '2px' }}>【内 网 闭 阅 · 严 防 泄 密】</div>
              <Divider style={{ borderColor: '#ff4d4f', borderWidth: '2px', margin: '12px 0' }} />
            </div>

            <Paragraph style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '13px', color: '#333' }}>
              {generateExportPlaintext().substring(generateExportPlaintext().indexOf('【期号】'))}
            </Paragraph>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CopyOutlined />
            <span>系统已自动剔除所有表格、边框和卡片排版标签，仅导出纯文字底稿用于粘入 Word。</span>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PublicationsManagement;
