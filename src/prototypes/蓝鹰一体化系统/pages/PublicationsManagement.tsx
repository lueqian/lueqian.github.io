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
  FolderAddOutlined,
  CalendarOutlined,
  SaveOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

// 舆情素材排版卡片接口
export interface ArticleMaterial {
  id: string;
  type: 'article' | 'title'; // 舆情卡片 或 虚拟公文小标题
  title: string; // 修改后的公文标题/小标题内容
  platform?: string; // 原帖出处
  author?: string; // 原帖作者
  summary?: string; // 事实简要内容
  opinion?: string; // 初步研判观点
  tag?: string; // 公文分类标签 (涉警负面、涉未成年等)
  remark?: string; // 备注说明
}

// 刊物档案接口
export interface PublicationIssue {
  key: string;
  title: string;
  editor: string; // 责任编辑
  scope: string; // 报送范围
  status: 'editing' | 'exported' | 'archived'; // 编辑中，已导出，已归档
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
    date: '2026-07-08',
    materials: [
      {
        id: 'M001',
        type: 'title',
        title: '一、 每日涉警敏感舆情动态',
      },
      {
        id: 'M002',
        type: 'article',
        tag: '涉未成年',
        title: '网民发视频显示清江浦区里运河边疑似有突发事件，警察在现场摆放围挡',
        summary: '7月2日19时许，抖音网民“刘有才”刘勇（男，40岁，安徽人）发视频显示：龙首湾驿站河边有多名警察，现场有围挡。',
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
        id: 'M003',
        type: 'title',
        title: '一、 每日舆情动态汇总',
      },
      {
        id: 'M004',
        type: 'article',
        tag: '涉警负面',
        title: '网民反映在车陂路段遭遇交警粗暴执法问题',
        summary: '7月1日15时许，微博网民“一路向前”发贴反映称：其在天河区车陂路段违停被处罚时，现场执勤人员态度恶劣、粗暴拉扯，引发现场群众围观。',
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
  const [issues, setIssues] = useState<PublicationIssue[]>(() => {
    const saved = localStorage.getItem('LAN_YING_PUBLICATION_ISSUES');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialIssues;
  });

  React.useEffect(() => {
    localStorage.setItem('LAN_YING_PUBLICATION_ISSUES', JSON.stringify(issues));
  }, [issues]);
  
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
  
  // 原地精修（inline edit）状态管理
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [editingSummaryText, setEditingSummaryText] = useState('');
  const [editingTagText, setEditingTagText] = useState('');

  // 模拟外部加入刊物（通用采集弹窗）
  const [collectModalVisible, setCollectModalVisible] = useState(false);
  const [collectForm] = Form.useForm();

  // 双轨制导出一：本期导为公文预览窗
  const [exportDocVisible, setExportDocVisible] = useState(false);

  // 双轨制导出二：全年入刊总台账预览窗
  const [exportExcelVisible, setExportExcelVisible] = useState(false);

  // 1. 目录树右键/顶部模拟新建或重命名
  const handleFolderAction = () => {
    folderForm.validateFields().then((values) => {
      if (folderActionType === 'create') {
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

  // 进入详情工作台页
  const handleEnterWorkspace = (issue: PublicationIssue) => {
    setSelectedIssue(issue);
    setActiveView('workspace');
    setEditingMaterialId(null);
  };

  // 2. 状态流转控制之：归档锁死机制
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
    setEditingMaterialId(null);
    message.warning('当前期刊物已被归档锁死！所有排版调序和卡片精修输入已被完全锁定，不可篡改。');
  };

  // 3. 插入公文小标题横条
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

  // 4. 原地精修 inline edit 保存与控制
  const [editingRemarkText, setEditingRemarkText] = useState('');

  const handleStartInlineEdit = (item: ArticleMaterial) => {
    if (!selectedIssue || selectedIssue.status === 'archived') return;
    setEditingMaterialId(item.id);
    setEditingTitleText(item.title);
    setEditingSummaryText(item.summary || '');
    setEditingTagText(item.tag || '涉警负面');
    setEditingRemarkText(item.remark || '');
  };

  const handleSaveInlineEdit = (itemId: string) => {
    if (!selectedIssue) return;
    const updatedMaterials = selectedIssue.materials.map((m) => {
      if (m.id === itemId) {
        return {
          ...m,
          title: editingTitleText,
          summary: editingSummaryText,
          tag: editingTagText,
          remark: editingRemarkText,
        };
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
    setEditingMaterialId(null);
    message.success('公文三要素及备注原地深度精修保存成功！');
  };

  // 5. 排序调序交互 (上移 / 下移 / 删除)
  const handleMoveMaterial = (index: number, direction: 'up' | 'down') => {
    if (!selectedIssue || selectedIssue.status === 'archived') return;
    const newList = [...selectedIssue.materials];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;

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

  // 6. 模拟外部收藏“加入刊物”（通用采集弹窗逻辑）
  const handleCollectArticle = () => {
    if (!selectedIssue) return;
    collectForm.validateFields().then((values) => {
      const newArticleItem: ArticleMaterial = {
        id: `ART_${Date.now()}`,
        type: 'article',
        tag: values.tag || '涉警负面',
        title: values.title,
        summary: values.summary,
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
      message.success('已将收集的素材加入初始底稿！可在排版工作台卡片中进行二次精修。');
      setCollectModalVisible(false);
      collectForm.resetFields();
    });
  };

  // 7. 双轨制导出之：导出 Word/PDF 触发并流转状态
  const handleDownloadDoc = (format: 'docx' | 'pdf') => {
    if (!selectedIssue) return;
    // 改变简报状态为已导出
    const updated = issues.map((iss) => {
      if (iss.key === selectedIssue.key) {
        const exportedIss = { ...iss, status: 'exported' as const };
        setSelectedIssue(exportedIss);
        return exportedIss;
      }
      return iss;
    });
    setIssues(updated);
    
    if (format === 'docx') {
      message.success(`已成功导出规范公文: [${selectedIssue.title}.docx] 并开始下载！`);
    } else {
      message.success(`已成功导出并输出标准 PDF 简报存档: [${selectedIssue.title}.pdf]！`);
    }
    setExportDocVisible(false);
  };

  // 8. 提取全年所有期收录的素材数据，以用于 Excel 台账结构化展现
  const getAnnualExcelData = () => {
    const list: any[] = [];
    issues.forEach((iss) => {
      iss.materials.forEach((m) => {
        if (m.type === 'article') {
          list.push({
            key: m.id,
            date: iss.date,
            issueTitle: iss.title,
            tag: m.tag || '未分类',
            materialTitle: m.title,
            materialContent: m.summary || '',
          });
        }
      });
    });
    return list;
  };

  // 纯文本导出拼接格式生成
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
        text += `【${item.tag || '未分类'}】\n`;
        text += `▲${item.title}\n`;
        text += `    ${item.summary}\n\n`;
        text += `（后续调查及处置进展留空：__________________________________________________\n`;
        text += `__________________________________________________________________________）\n`;
        text += `------------------------------------------------------\n\n`;
      }
    });

    return text;
  };

  // 目录大厅显示的期数台账过滤
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
            {/* 左侧目录树 */}
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
                    title="新建子目录"
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setFolderActionType('rename');
                      setFolderModalVisible(true);
                    }}
                    title="重命名目录"
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

            {/* 右侧刊物排期台账 */}
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <BookOutlined /> 简报目录期数排期台账
                  </span>
                  {/* 全局跨期台账导出按钮 */}
                  <Button
                    type="primary"
                    ghost
                    icon={<FileExcelOutlined style={{ color: '#52c41a' }} />}
                    onClick={() => setExportExcelVisible(true)}
                  >
                    导出全年入刊总台账 (Excel)
                  </Button>
                </div>
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
                    title: '发布日期',
                    dataIndex: 'date',
                    key: 'date',
                  },
                  {
                    title: '流转状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => {
                      let color = 'orange';
                      let label = '编辑中';
                      if (status === 'exported') {
                        color = 'blue';
                        label = '已导出公文';
                      } else if (status === 'archived') {
                        color = 'green';
                        label = '已归档锁死';
                      }
                      return <Tag color={color}>{label}</Tag>;
                    },
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
                          {record.status === 'archived' ? '查看只读稿' : '进入排版加工台'}
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        ) : (
          /* ==================== 2. 刊物工作台/素材二次加工页 ==================== */
          <div>
            {/* 顶部元数据与工具栏 */}
            {selectedIssue && (
              <div>
                <Card
                  size="small"
                  style={{
                    marginBottom: '16px',
                    borderLeft: selectedIssue.status === 'archived' ? '4px solid #52c41a' : selectedIssue.status === 'exported' ? '4px solid #1890ff' : '4px solid #faad14'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => {
                        setActiveView('hub');
                        setSelectedIssue(null);
                      }}
                    >
                      返回大厅台账
                    </Button>
                    <Space>
                      {selectedIssue.status !== 'archived' ? (
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
                      
                      {/* 双轨制导出：动作一（导出Word/PDF公文） */}
                      <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        disabled={selectedIssue.materials.length === 0}
                        onClick={() => setExportDocVisible(true)}
                      >
                        本期导为公文 (Word/PDF)
                      </Button>
                    </Space>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* 顶部元数据状态 */}
                  <Row gutter={16} style={{ fontSize: '13px', color: '#666', paddingLeft: '8px' }}>
                    <Col span={6}>刊物名称: <strong>{selectedIssue.title}</strong></Col>
                    <Col span={6}>责任编辑: <strong>{selectedIssue.editor}</strong></Col>
                    <Col span={6}>报送范围: <strong style={{ color: '#ff4d4f' }}>{selectedIssue.scope}</strong></Col>
                    <Col span={6}>
                      当前状态: 
                      <Tag color={selectedIssue.status === 'archived' ? 'green' : selectedIssue.status === 'exported' ? 'blue' : 'orange'} style={{ marginLeft: '6px' }}>
                        {selectedIssue.status === 'archived' ? '已锁死只读' : selectedIssue.status === 'exported' ? '已导出底稿' : '初稿加工中'}
                      </Tag>
                    </Col>
                  </Row>
                </Card>

                {/* 素材人工二次加工区 */}
                <Card
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>半自动公文加工台（红头公文事实三要素渲染）</span>
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
                          模拟收集入刊
                        </Button>
                      </Space>
                    </div>
                  }
                  bordered={false}
                >
                  {selectedIssue.materials.length === 0 ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', background: '#fafafa', borderRadius: '6px', border: '1px dashed #ddd', color: '#999' }}>
                      本期内尚无舆情素材。请点击右上角“模拟收集入刊”先加入初始底稿。
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedIssue.materials.map((item, idx) => {
                        const isTitle = item.type === 'title';
                        const isArchived = selectedIssue.status === 'archived';
                        const isBeingEdited = editingMaterialId === item.id;

                        if (isTitle) {
                          // 公文大纲小标题 (横条)
                          return (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#f0f5ff',
                                border: '1px dashed #adc6ff',
                                borderRadius: '4px',
                                padding: '10px 16px'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                {isBeingEdited ? (
                                  <Input
                                    size="small"
                                    value={editingTitleText}
                                    onChange={(e) => setEditingTitleText(e.target.value)}
                                    onPressEnter={() => handleSaveInlineEdit(item.id)}
                                    onBlur={() => handleSaveInlineEdit(item.id)}
                                    style={{ width: '350px' }}
                                    autoFocus
                                  />
                                ) : (
                                  <div
                                    onClick={() => handleStartInlineEdit(item)}
                                    style={{
                                      fontWeight: 'bold',
                                      color: '#1d39c4',
                                      fontSize: '14.5px',
                                      cursor: isArchived ? 'default' : 'pointer'
                                    }}
                                    title={isArchived ? '' : '点击即可在线编辑小标题'}
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

                        // 舆情素材公文卡片 (对齐红头公文样式三要素渲染)
                        return (
                          <div
                            key={item.id}
                            style={{
                              position: 'relative',
                              padding: '24px',
                              background: '#fff',
                              border: '1px solid #d9d9d9',
                              borderRadius: '4px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              borderLeft: '4px solid #ff4d4f' // 经典的公文红饰条
                            }}
                          >
                            {/* 右上角调序及删除按钮 */}
                            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
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

                            {isBeingEdited ? (
                              /* 原地精修状态的表单域 */
                              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '4px', border: '1px dashed #ff4d4f' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ff4d4f', marginBottom: '12px' }}>
                                  ✍️ 报送内容深度人工精修中 (仅限公文三要素)
                                </div>
                                <Form layout="vertical" size="small">
                                  <Row gutter={16}>
                                    <Col span={8}>
                                      <Form.Item label="公文分类标签" required>
                                        <Select
                                          value={editingTagText}
                                          onChange={setEditingTagText}
                                          options={[
                                            { value: '涉未成年', label: '【涉未成年】' },
                                            { value: '涉警负面', label: '【涉警负面】' },
                                            { value: '涉校舆情', label: '【涉校舆情】' },
                                            { value: '突发灾情', label: '【突发灾情】' },
                                            { value: '涉法涉诉', label: '【涉法涉诉】' },
                                          ]}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                      <Form.Item label="改写后公文标题 (系统自动添加 ▲ 前缀)" required>
                                        <Input
                                          value={editingTitleText}
                                          onChange={(e) => setEditingTitleText(e.target.value)}
                                          placeholder="输入正式公文标题，无需手动加▲"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <Form.Item label="事实简要内容 (公文正文，系统导出时自动处理首行缩进)" required>
                                    <Input.TextArea
                                      rows={4}
                                      value={editingSummaryText}
                                      onChange={(e) => setEditingSummaryText(e.target.value)}
                                      placeholder="请输入改写加工后的客观事实描述，写清时间、平台、网民及客观内容，去除任何AI主观推测或调查进度..."
                                    />
                                  </Form.Item>
                                  <Form.Item label="备注说明 (补充说明)">
                                    <Input.TextArea
                                      rows={2}
                                      value={editingRemarkText}
                                      onChange={(e) => setEditingRemarkText(e.target.value)}
                                      placeholder="请输入对此条帖文的补充备注或研判方向..."
                                    />
                                  </Form.Item>
                                  <div style={{ textAlign: 'right' }}>
                                    <Space>
                                      <Button size="small" onClick={() => setEditingMaterialId(null)}>取消</Button>
                                      <Button size="small" type="primary" icon={<SaveOutlined />} onClick={() => handleSaveInlineEdit(item.id)}>保存精修</Button>
                                    </Space>
                                  </div>
                                </Form>
                              </div>
                            ) : (
                              /* 政务公文格式渲染 */
                              <div style={{ fontFamily: 'SimSun, "STSong", "Songti SC", serif', color: '#000' }}>
                                {/* 1. 分类标签（顶格展示） */}
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px', color: '#000' }}>
                                  【{item.tag || '涉警负面'}】
                                </div>
                                {/* 2. 事件标题（加粗首行，实心三角开头） */}
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#000', lineHeight: '1.4' }}>
                                  ▲{item.title}
                                </div>
                                {/* 3. 事实简要内容（正文缩进） */}
                                <div style={{ textIndent: '2em', fontSize: '15px', lineHeight: '1.8', color: '#1f1f1f', whiteSpace: 'pre-wrap' }}>
                                  {item.summary}
                                </div>

                                {/* 4. 备注说明 */}
                                {item.remark && (
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      padding: '8px 12px',
                                      background: '#fffbe6',
                                      border: '1px solid #ffe58f',
                                      borderRadius: '4px',
                                      color: '#d46b08',
                                      fontSize: '13px',
                                      fontFamily: 'sans-serif'
                                    }}
                                  >
                                    💡 <strong>备注说明</strong>：{item.remark}
                                  </div>
                                )}

                                {/* 5. 留白说明边界 */}
                                <div
                                  style={{
                                    marginTop: '20px',
                                    padding: '10px 14px',
                                    background: '#fafafa',
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: '4px',
                                    color: '#8c8c8c',
                                    fontSize: '12px',
                                    fontFamily: 'sans-serif'
                                  }}
                                >
                                  📌 <strong>人工编辑边界留空区</strong>：经核查/后续处置情况等（系统在此留空，导出为 Word 后由业务人员线下手动编辑补充）
                                </div>

                                {/* 精修控制按钮 */}
                                <div style={{ textAlign: 'right', marginTop: '14px' }}>
                                  <Button
                                    type="primary"
                                    size="small"
                                    ghost
                                    disabled={isArchived}
                                    icon={<EditOutlined />}
                                    onClick={() => handleStartInlineEdit(item)}
                                  >
                                    编辑/精修此条公文
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        )}

        {/* 目录目录新建/重命名弹窗 */}
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

        {/* 插入公文小标题弹窗 */}
        <Modal
          title="插入公文分隔小标题"
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
              label="大纲小标题标题内容"
              rules={[{ required: true, message: '请填写公文大纲标题' }]}
            >
              <Input placeholder="例如: 一、 每日涉警敏感舆情动态" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 模拟跨模块收集入刊 Dialog */}
        <Modal
          title={
            <span>
              <SnippetsOutlined style={{ color: '#1890ff' }} /> 模拟跨模块收集舆情入刊 (初加工)
            </span>
          }
          open={collectModalVisible}
          onOk={handleCollectArticle}
          onCancel={() => setCollectModalVisible(false)}
          okText="抓取快照并加入"
          cancelText="取消"
          width={520}
          centered
        >
          <Form
            form={collectForm}
            layout="vertical"
            initialValues={{
              tag: '涉未成年',
              title: '网民发视频显示清江浦区里运河边疑似有突发事件，警察在现场摆放围挡',
              summary: '7月2日19时许，抖音网民“刘有才”刘勇（男，40岁，安徽人）发视频显示：龙首湾驿站河边有多名警察，现场有围挡。'
            }}
          >
            <Alert
              message="加入说明"
              description="系统将自动提取舆情分类标签、标题和事实正文快照生成公文底稿。用户收集入刊后，可到排版工作台进行人工二次精细大改写。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Form.Item name="tag" label="公文分类标签" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: '涉未成年', label: '【涉未成年】' },
                  { value: '涉警负面', label: '【涉警负面】' },
                  { value: '涉校舆情', label: '【涉校舆情】' },
                  { value: '突发灾情', label: '【突发灾情】' },
                  { value: '涉法涉诉', label: '【涉法涉诉】' },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="title"
              label="自动抓取：原帖公文标题"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="summary"
              label="自动抓取：事实简要内容快照 (非全量同步)"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 双轨制导出一：单期导出为 Word / PDF 公文底稿预览 */}
        <Modal
          title={
            <span>
              <FileTextOutlined style={{ color: '#ff4d4f' }} /> 本期导为公文 (Word/PDF 预览及下载)
            </span>
          }
          open={exportDocVisible}
          onCancel={() => setExportDocVisible(false)}
          footer={[
            <Button
              key="word"
              type="primary"
              icon={<FileWordOutlined />}
              onClick={() => handleDownloadDoc('docx')}
            >
              下载为 Word 报送稿
            </Button>,
            <Button
              key="pdf"
              danger
              icon={<FilePdfOutlined />}
              onClick={() => handleDownloadDoc('pdf')}
            >
              下载为 PDF 存稿
            </Button>,
            <Button key="cancel" onClick={() => setExportDocVisible(false)}>
              关闭
            </Button>
          ]}
          width={650}
          centered
        >
          <Alert
            message="提示：导出底稿将会同步将当前期刊物更新为「已导出公文」状态。"
            type="warning"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <div
            style={{
              background: '#fff',
              border: '2px solid #ff4d4f', // 经典红头公文边框
              borderRadius: '4px',
              padding: '24px',
              maxHeight: '380px',
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

            <Paragraph style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: '#000' }}>
              {selectedIssue && generateExportPlaintext().substring(generateExportPlaintext().indexOf('【期号】'))}
            </Paragraph>
          </div>
        </Modal>

        {/* 双轨制导出二：导出全年入刊总台账预览 (Excel 年终统计台账) */}
        <Modal
          title={
            <span>
              <FileExcelOutlined style={{ color: '#52c41a' }} /> 导出全年入刊总台账 (Excel 结构化报表)
            </span>
          }
          open={exportExcelVisible}
          onCancel={() => setExportExcelVisible(false)}
          okText="一键批量导出 Excel 台账"
          cancelText="关闭"
          onOk={() => {
            message.success('已成功拉取全年各期全部入刊收藏素材！导出生成 [2026年度蓝鹰舆情入刊总台账.xlsx] 并开始下载！');
            setExportExcelVisible(false);
          }}
          width={800}
          centered
        >
          <div style={{ marginBottom: '16px' }}>
            <Alert
              message="功能说明：年终总台账提取器"
              description="本模块跨越简报期数和目录限制，提取出今年所有被抓取入刊并经由人工二次精修后的公文级素材数据，便于业务人员直接输出 Excel 年度工作底表。"
              type="info"
              showIcon
            />
          </div>

          {/* Excel 网格预览 */}
          <Table
            dataSource={getAnnualExcelData()}
            rowKey="key"
            size="small"
            bordered
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: '入刊时间',
                dataIndex: 'date',
                key: 'date',
                width: 110,
                render: (text) => (
                  <span>
                    <CalendarOutlined style={{ marginRight: '6px', color: '#999' }} />
                    {text}
                  </span>
                ),
              },
              {
                title: '所属刊物期号名称',
                dataIndex: 'issueTitle',
                key: 'issueTitle',
                width: 200,
              },
              {
                title: '分类标签',
                dataIndex: 'tag',
                key: 'tag',
                width: 110,
                render: (text) => <Tag color="purple">{text}</Tag>,
              },
              {
                title: '最终精修公文标题',
                dataIndex: 'materialTitle',
                key: 'materialTitle',
                render: (text) => <strong>▲{text}</strong>,
              },
              {
                title: '最终修改报送正文 (已剔除快照标签)',
                dataIndex: 'materialContent',
                key: 'materialContent',
                render: (text: string) => (
                  <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 250 }}>
                    {text}
                  </Text>
                ),
              },
            ]}
          />
        </Modal>
      </div>
    </div>
  );
};

export default PublicationsManagement;
