import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message, Alert, Badge } from 'antd';
import { BookOutlined, TagsOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

export interface ArticleMaterial {
  id: string;
  type: 'article' | 'title';
  title: string;
  platform?: string;
  author?: string;
  summary?: string;
  opinion?: string;
  tag?: string;
  remark?: string;
}

export interface PublicationIssue {
  key: string;
  title: string;
  editor: string;
  scope: string;
  status: 'editing' | 'exported' | 'archived';
  date: string;
  materials: ArticleMaterial[];
}

const defaultIssues: PublicationIssue[] = [
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

export interface AddToPublicationModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  posts: Array<{
    id: string;
    title: string;
    content: string;
    platform?: string;
    author?: string;
  }>;
}

const AddToPublicationModal: React.FC<AddToPublicationModalProps> = ({
  open,
  onCancel,
  onSuccess,
  posts,
}) => {
  const [form] = Form.useForm();
  const isBatch = posts.length > 1;

  // Load active publications from localStorage
  const getIssues = (): PublicationIssue[] => {
    const saved = localStorage.getItem('LAN_YING_PUBLICATION_ISSUES');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse publication issues from localStorage', e);
      }
    }
    return defaultIssues;
  };

  const editingIssues = getIssues().filter(iss => iss.status !== 'archived');

  useEffect(() => {
    if (open) {
      if (posts.length === 1) {
        form.setFieldsValue({
          title: posts[0].title,
          content: posts[0].content,
          tag: '涉警负面',
          issueKey: editingIssues.length > 0 ? editingIssues[0].key : undefined,
          remark: '',
        });
      } else {
        form.setFieldsValue({
          tag: '涉警负面',
          issueKey: editingIssues.length > 0 ? editingIssues[0].key : undefined,
          remark: '',
        });
      }
    }
  }, [open, posts, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const allIssues = getIssues();
      const targetIssueIndex = allIssues.findIndex(iss => iss.key === values.issueKey);

      if (targetIssueIndex === -1) {
        message.error('未找到指定的目标刊物！');
        return;
      }

      const targetIssue = allIssues[targetIssueIndex];
      const newMaterials: ArticleMaterial[] = posts.map((post, idx) => ({
        id: `ART_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'article',
        tag: values.tag,
        title: isBatch ? post.title : values.title,
        summary: isBatch ? post.content : values.content,
        platform: post.platform,
        author: post.author,
        remark: values.remark || undefined,
      }));

      targetIssue.materials = [...targetIssue.materials, ...newMaterials];
      allIssues[targetIssueIndex] = targetIssue;

      localStorage.setItem('LAN_YING_PUBLICATION_ISSUES', JSON.stringify(allIssues));
      message.success(`成功将 ${posts.length} 条帖文添加到刊物: ${targetIssue.title}`);
      
      form.resetFields();
      if (onSuccess) onSuccess();
      onCancel();
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
          <BookOutlined style={{ color: '#1890ff' }} />
          <span>{isBatch ? '批量添加到刊物' : '添加到刊物'}</span>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确认添加"
      cancelText="取消"
      width={isBatch ? 500 : 600}
      centered
      className="add-to-publication-modal"
    >
      <Form form={form} layout="vertical" initialValues={{ tag: '涉警负面' }} style={{ marginTop: 12 }}>
        {isBatch && (
          <Alert
            message={
              <span>
                已选择 <Badge count={posts.length} style={{ backgroundColor: '#7c3aed' }} /> 条帖文，将批量导入到所选刊物目录。
              </span>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          name="issueKey"
          label={
            <span style={{ fontWeight: 500 }}>
              <BookOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
              选择要添加的刊物期数（编辑中）
            </span>
          }
          rules={[{ required: true, message: '请选择目标刊物！' }]}
        >
          <Select
            placeholder="请选择目标简报期数..."
            options={editingIssues.map(iss => ({
              value: iss.key,
              label: `${iss.title} (${iss.status === 'editing' ? '编辑中' : '已导出'})`,
            }))}
            noDataContent="暂无可编辑的刊物，请先去刊物大厅创建"
          />
        </Form.Item>

        <Form.Item
          name="tag"
          label={
            <span style={{ fontWeight: 500 }}>
              <TagsOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
              公文分类类型
            </span>
          }
          rules={[{ required: true }]}
        >
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

        {!isBatch && (
          <>
            <Form.Item
              name="title"
              label={
                <span style={{ fontWeight: 500 }}>
                  <EditOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
                  自动提取：帖文标题
                </span>
              }
              rules={[{ required: true, message: '请确认帖文标题！' }]}
            >
              <Input placeholder="可在此修改并精简帖文标题..." />
            </Form.Item>

            <Form.Item
              name="content"
              label={
                <span style={{ fontWeight: 500 }}>
                  <FileTextOutlined style={{ marginRight: 6, color: '#8c8c8c' }} />
                  自动提取：正文内容
                </span>
              }
              rules={[{ required: true, message: '请确认正文内容！' }]}
            >
              <Input.TextArea rows={4} placeholder="可在此修改事实描述..." />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="remark"
          label={
            <span style={{ fontWeight: 500 }}>
              备注说明（可在刊物中进一步调整）
            </span>
          }
        >
          <Input.TextArea
            rows={2}
            placeholder={isBatch ? "选填，输入对该批帖文的统一补充备注..." : "选填，输入对此篇帖文的补充备注..."}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddToPublicationModal;
