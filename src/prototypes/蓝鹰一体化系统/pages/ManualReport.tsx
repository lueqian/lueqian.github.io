import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Upload,
  Button,
  message,
  Card,
  Row,
  Col,
  InputNumber,
  Modal,
  Cascader,
} from 'antd';
import {
  PlusOutlined,
  InfoCircleOutlined,
  CloudDownloadOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

// 统一的第一列与主字段 Label 宽度，确保所有输入框与下拉选框的起始 X 位置绝对对齐
const LABEL_WIDTH_COL1 = '115px';
const LABEL_WIDTH_OTHER = '90px';

// 源头防控已创建的专项任务级联数据
const sourceControlTaskOptions = [
  {
    value: '重大实体事件跟踪',
    label: '重大实体事件跟踪',
    children: [
      { value: 't1', label: '渝中宝马撞人事件' },
      { value: 't2', label: '彭水山体滑坡' },
      { value: 't3', label: 'LGBT' },
      { value: 't4', label: '重庆火灾舆情' },
      { value: 't5', label: '大足一中' },
      { value: 't6', label: '大足矫正教育' },
      { value: 't7', label: '侵犯公民个人信息' },
      { value: 't8', label: '区域合并舆情监测' },
      { value: 't9', label: '区域规划舆情监测' },
      { value: 't10', label: '李林偷越国边境' },
      { value: 't11', label: '留查辅警招聘' },
      { value: 't12', label: '渝中舆情巡查' },
      { value: 't13', label: '重庆涉灾舆情' },
      { value: 't14', label: '重庆区划' },
      { value: 't15', label: '激光投射类人员设备摸排' },
      { value: 't16', label: '合川重点学校巡查' },
      { value: 't17', label: '涉日' },
      { value: 't18', label: '重庆涉灾舆情（媒体）' },
      { value: 't19', label: '活人墓' },
    ],
  },
  {
    value: '安保任务',
    label: '安保任务',
    children: [
      { value: 's1', label: '5月23日 淮安苏超' },
      { value: 's2', label: '敏感节点安保值守' },
      { value: 's3', label: '涉稳群体聚集风险排查' },
    ],
  },
  {
    value: '专项巡查任务',
    label: '专项巡查任务',
    children: [
      { value: 'p1', label: '淮安汛情' },
      { value: 'p2', label: '高张花园' },
      { value: 'p3', label: '食品安全专项' },
    ],
  },
];

interface ManualReportProps {
  onBack?: () => void;
}

const ManualReport: React.FC<ManualReportProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'screenshot_proof_01.png',
      status: 'done',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    },
  ]);

  // 主题输入字数
  const [topicLength, setTopicLength] = useState(0);
  // 作者平台ID字数
  const [authorIdLength, setAuthorIdLength] = useState(0);

  // 一键自动解析功能
  const handleAutoParse = () => {
    const linkValue = form.getFieldValue('link');
    setParsing(true);
    message.loading({ content: '正在提取网络链接全要素并进行自动防伪固证解析...', key: 'parsing', duration: 1.5 });

    setTimeout(() => {
      setParsing(false);
      const mockParsedData = {
        link: linkValue || 'https://v.douyin.com/iJy82kM3/ 9.88 复制打开抖音',
        topic: '【现场实录】某涉事车辆在闹市区违规行驶引发网民围观及广泛讨论，现场民警已快速赶赴处置。',
        eventTime: dayjs('2026-07-31 14:20:00'),
        jurisdiction: '渝中区',
        collector: '郑江',
        collectionUnit: '网安 / 总公司 / 总2_...',
        infoSource: '抖音平台',
        author: '重案纪实观察员',
        authorPlatformId: 'DY_9984102948',
        commentCount: 3420,
        repostCount: 1250,
        likeCount: 18900,
        initialOpinion: '经核验，该视频源自抖音短视频平台，属地网络风险指数升高。建议渝中区分局网安大队密切跟踪舆情发酵，同步联系现场警力做好线下核查与线上权威辟谣。',
        specialTask: ['重大实体事件跟踪', 't1'],
        level: '3级',
        sentimentType: '涉警舆情',
        notifyDistrict: '渝中区',
        taskType: '日常上报',
        isRumor: true,
      };

      form.setFieldsValue(mockParsedData);
      setTopicLength(mockParsedData.topic.length);
      setAuthorIdLength(mockParsedData.authorPlatformId.length);

      message.success({ content: '自动解析完成！已成功抽取要素并自动智能匹配源头防控专项任务。', key: 'parsing', duration: 2 });
    }, 1200);
  };

  // 表单重置
  const handleReset = () => {
    form.resetFields();
    setTopicLength(0);
    setAuthorIdLength(0);
    setFileList([]);
    message.info('表单已成功重置');
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      message.loading({ content: '正在上报实时舆情数据到上级研判中心...', key: 'submitKey' });

      setTimeout(() => {
        setSubmitting(false);
        message.success({ content: '手工上报提交成功！任务已自动推送到指定的源头防控任务台账。', key: 'submitKey', duration: 3 });
        if (onBack) {
          onBack();
        }
      }, 1200);
    } catch (err) {
      message.error('请填写完整带 * 号的必填项字段！');
    }
  };

  // 客户端打开/下载按钮
  const handleOpenClient = () => {
    Modal.info({
      title: '客户端智能上报引擎',
      content: '已成功调用本地“蓝鹰防伪采编客户端”。客户端已开启后台高帧率录屏、一键视频下载及全网痕迹固证服务。',
      okText: '好的',
    });
  };

  const handleDownloadClient = () => {
    message.success('已开始下载最新版“蓝鹰客户端 (Windows/macOS v3.4.2)”，请按提示安装组件');
  };

  return (
    <div className="manual-report-container">
      {/* 页面主卡片 */}
      <div className="manual-report-card">
        {/* 顶部标题栏与客户端上报提示 */}
        <div className="manual-report-header">
          <div className="report-title-box">
            <h2 className="report-title">手工上报</h2>
          </div>
          
          {/* 右上角客户端提示条 */}
          <div className="client-banner">
            <span className="banner-text">
              抖音平台、今日头条、微博平台支持客户端上报，客户端上报支持下载视频、自动固证截图、建议使用客户端上报
            </span>
            <div className="banner-actions">
              <Button type="primary" className="client-btn-primary" icon={<DesktopOutlined />} onClick={handleOpenClient}>
                打开客户端
              </Button>
              <Button className="client-btn-outline" icon={<CloudDownloadOutlined />} onClick={handleDownloadClient}>
                进入下载
              </Button>
            </div>
          </div>
        </div>

        {/* 表单主体 */}
        <Form
          form={form}
          layout="horizontal"
          className="manual-report-form"
          initialValues={{
            collector: '郑江',
            collectionUnit: '网安 / 总公司 / 总2_...',
            taskType: '日常上报',
            isRumor: false,
          }}
        >
          {/* 1. 链接项 */}
          <div className="form-item-wrapper">
            <Row align="middle" gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col required">
                <span className="required-star">*</span>链接：
              </Col>
              <Col flex="1">
                <Form.Item
                  name="link"
                  noStyle
                  rules={[{ required: true, message: '请输入有效的舆情链接' }]}
                >
                  <Input placeholder="请输入链接" className="custom-input" />
                </Form.Item>
              </Col>
              <Col flex="80px">
                <Button
                  type="default"
                  className="parse-btn"
                  loading={parsing}
                  onClick={handleAutoParse}
                >
                  解析
                </Button>
              </Col>
            </Row>
          </div>

          {/* 2. 信息主题 */}
          <div className="form-item-wrapper">
            <Row gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col required" style={{ paddingTop: '8px' }}>
                <span className="required-star">*</span>信息主题：
              </Col>
              <Col flex="1">
                <Form.Item
                  name="topic"
                  noStyle
                  rules={[{ required: true, message: '请输入信息主题' }]}
                >
                  <div className="textarea-container">
                    <TextArea
                      placeholder="请输入信息主题"
                      rows={4}
                      maxLength={2500}
                      className="custom-textarea"
                      onChange={(e) => setTopicLength(e.target.value.length)}
                    />
                    <span className="char-counter">{topicLength}/2500</span>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 3. 三列网格：事件发生时间、涉事属地、采集人 */}
          <Row gutter={24} className="form-row">
            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_COL1} className="form-label-col required">
                  <span className="required-star">*</span>事件发生时间：
                </Col>
                <Col flex="1">
                  <Form.Item
                    name="eventTime"
                    noStyle
                    rules={[{ required: true, message: '请选择事件发生时间' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder="选择日期"
                      style={{ width: '100%' }}
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  涉事属地：
                </Col>
                <Col flex="1">
                  <Form.Item name="jurisdiction" noStyle>
                    <Select placeholder="请选择" allowClear style={{ width: '100%' }} className="custom-select">
                      <Option value="渝中区">渝中区</Option>
                      <Option value="江北区">江北区</Option>
                      <Option value="南岸区">南岸区</Option>
                      <Option value="九龙坡区">九龙坡区</Option>
                      <Option value="沙坪坝区">沙坪坝区</Option>
                      <Option value="大足区">大足区</Option>
                      <Option value="合川区">合川区</Option>
                      <Option value="淮安区">淮安区</Option>
                      <Option value="清江浦区">清江浦区</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col required">
                  <span className="required-star">*</span>采集人：
                </Col>
                <Col flex="1">
                  <Form.Item
                    name="collector"
                    noStyle
                    rules={[{ required: true, message: '请输入采集人姓名' }]}
                  >
                    <Input placeholder="请输入采集人" className="custom-input" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 4. 三列网格：采集单位、信息来源、作者 */}
          <Row gutter={24} className="form-row">
            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_COL1} className="form-label-col required">
                  <span className="required-star">*</span>采集单位：
                </Col>
                <Col flex="1">
                  <Form.Item
                    name="collectionUnit"
                    noStyle
                    rules={[{ required: true, message: '请选择采集单位' }]}
                  >
                    <Select placeholder="请选择采集单位" style={{ width: '100%' }} className="custom-select">
                      <Option value="网安 / 总公司 / 总2_...">网安 / 总公司 / 总2_...</Option>
                      <Option value="网安支队一大队">网安支队一大队</Option>
                      <Option value="网安支队值班岗">网安支队值班岗</Option>
                      <Option value="渝中区公安分局网安">渝中区公安分局网安</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  信息来源：
                </Col>
                <Col flex="1">
                  <Form.Item name="infoSource" noStyle>
                    <Input placeholder="请输入信息来源" className="custom-input" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  作者：
                </Col>
                <Col flex="1">
                  <Form.Item name="author" noStyle>
                    <Input placeholder="请输入作者" className="custom-input" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 5. 作者平台ID */}
          <div className="form-item-wrapper">
            <Row align="middle" gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col required">
                <span className="required-star">*</span>作者平台ID：
              </Col>
              <Col flex="1">
                <Form.Item
                  name="authorPlatformId"
                  noStyle
                  rules={[{ required: true, message: '请输入作者平台ID' }]}
                >
                  <div className="input-with-counter">
                    <Input
                      placeholder="请输入抖音号、微博id，头条id"
                      maxLength={256}
                      className="custom-input"
                      onChange={(e) => setAuthorIdLength(e.target.value.length)}
                    />
                    <span className="input-char-counter">{authorIdLength}/256</span>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 6. 三列网格：评论数、转发数、点赞数 */}
          <Row gutter={24} className="form-row">
            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_COL1} className="form-label-col">
                  评论数：
                </Col>
                <Col flex="1">
                  <Form.Item name="commentCount" noStyle>
                    <InputNumber
                      placeholder="请输入评论数"
                      min={0}
                      style={{ width: '100%' }}
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  转发数：
                </Col>
                <Col flex="1">
                  <Form.Item name="repostCount" noStyle>
                    <InputNumber
                      placeholder="请输入转发数"
                      min={0}
                      style={{ width: '100%' }}
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  点赞数：
                </Col>
                <Col flex="1">
                  <Form.Item name="likeCount" noStyle>
                    <InputNumber
                      placeholder="请输入点赞数"
                      min={0}
                      style={{ width: '100%' }}
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 7. 初研意见 */}
          <div className="form-item-wrapper">
            <Row gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col required" style={{ paddingTop: '8px' }}>
                <span className="required-star">*</span>初研意见：
              </Col>
              <Col flex="1">
                <Form.Item
                  name="initialOpinion"
                  noStyle
                  rules={[{ required: true, message: '请输入初研意见' }]}
                >
                  <TextArea
                    placeholder="请输入初研意见"
                    rows={4}
                    className="custom-textarea"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 8. 专项任务（改进为支持源头防控已创建任务的级联下拉选框） */}
          <div className="form-item-wrapper">
            <Row align="middle" gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col">
                专项任务：
              </Col>
              <Col flex="1">
                <Form.Item name="specialTask" noStyle>
                  <Cascader
                    options={sourceControlTaskOptions}
                    placeholder="请选择源头防控已创建的专项任务（选择后可自动推送舆情至指定任务）"
                    expandTrigger="hover"
                    allowClear
                    style={{ width: '100%' }}
                    className="custom-cascader"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 9. 两列网格：等级、舆情类型 */}
          <Row gutter={24} className="form-row">
            <Col span={12}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_COL1} className="form-label-col">
                  等级：
                </Col>
                <Col flex="1">
                  <Form.Item name="level" noStyle>
                    <Select placeholder="请选择" allowClear style={{ width: '100%' }} className="custom-select">
                      <Option value="1级">1级 (微弱)</Option>
                      <Option value="2级">2级 (一般)</Option>
                      <Option value="3级">3级 (较大)</Option>
                      <Option value="4级">4级 (重大)</Option>
                      <Option value="5级">5级 (特别重大)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  舆情类型：
                </Col>
                <Col flex="1">
                  <Form.Item name="sentimentType" noStyle>
                    <Select placeholder="请选择" allowClear style={{ width: '100%' }} className="custom-select">
                      <Option value="涉警舆情">涉警舆情</Option>
                      <Option value="社会民生">社会民生</Option>
                      <Option value="政治安全">政治安全</Option>
                      <Option value="交通事故">交通事故</Option>
                      <Option value="校园安全">校园安全</Option>
                      <Option value="其它">其它</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 10. 三列网格：通报区县、任务类型、谣言信息 */}
          <Row gutter={24} className="form-row">
            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_COL1} className="form-label-col">
                  通报区县：
                </Col>
                <Col flex="1">
                  <Form.Item name="notifyDistrict" noStyle>
                    <Select placeholder="请选择" allowClear style={{ width: '100%' }} className="custom-select">
                      <Option value="渝中区">渝中区</Option>
                      <Option value="大足区">大足区</Option>
                      <Option value="合川区">合川区</Option>
                      <Option value="淮安区">淮安区</Option>
                      <Option value="清江浦区">清江浦区</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col required">
                  <span className="required-star">*</span>任务类型：
                </Col>
                <Col flex="1">
                  <Form.Item
                    name="taskType"
                    noStyle
                    rules={[{ required: true, message: '请选择任务类型' }]}
                  >
                    <Select placeholder="请选择" style={{ width: '100%' }} className="custom-select">
                      <Option value="日常上报">日常上报</Option>
                      <Option value="紧急上报">紧急上报</Option>
                      <Option value="专项上报">专项上报</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={8}>
              <Row align="middle">
                <Col flex={LABEL_WIDTH_OTHER} className="form-label-col">
                  谣言信息：
                </Col>
                <Col flex="1">
                  <Form.Item name="isRumor" valuePropName="checked" noStyle>
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 11. 附件上传 */}
          <div className="form-item-wrapper">
            <Row gutter={16}>
              <Col flex={LABEL_WIDTH_COL1} className="form-label-col required" style={{ paddingTop: '8px' }}>
                <span className="required-star">*</span>附件：
              </Col>
              <Col flex="1">
                <div className="upload-section">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                    beforeUpload={() => false}
                    className="custom-uploader"
                  >
                    {fileList.length < 5 && (
                      <div>
                        <PlusOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
                      </div>
                    )}
                  </Upload>
                  <div className="upload-tip">
                    <InfoCircleOutlined className="tip-icon" />
                    <span>截图请截图全屏，务必确保要素齐全</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Form>

        {/* 底部按钮栏 */}
        <div className="manual-report-footer">
          <Button className="footer-btn-reset" onClick={handleReset}>
            重置
          </Button>
          <Button
            type="primary"
            className="footer-btn-submit"
            loading={submitting}
            onClick={handleSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualReport;
