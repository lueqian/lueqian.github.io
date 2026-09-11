import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Upload,
  Row,
  Col,
  message
} from 'antd';
import {
  PlusOutlined,
  ThunderboltOutlined,
  CloudUploadOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';

const { TextArea } = Input;
const { Option } = Select;

export const ManualReportPage: React.FC = () => {
  const [form] = Form.useForm();
  const { submitManualReport } = useAppStore();
  const [syncToProvince, setSyncToProvince] = useState(true);
  const [isRumor, setIsRumor] = useState(false);

  // 链接一键智能解析
  const handleParseUrl = () => {
    const url = form.getFieldValue('link');
    if (!url) {
      message.warning('请先输入要解析的视频或网帖链接');
      return;
    }
    form.setFieldsValue({
      theme: '抖音热传某老旧小区外墙脱落砸中车辆虚惊视频',
      occurTime: null,
      region: '姑苏区',
      author: '苏南民生速递',
      authorPlatformId: 'dy_8829103',
      sourcePlatform: '抖音app',
      commentCount: '128',
      forwardCount: '45',
      likeCount: '1205',
      initialOpinion: '视频拍摄姑苏区某小区外墙局部轻微掉灰，博主夸大宣传为“严重坍塌”，目前暂无伤亡。建议属地物业及街道核查并通报。'
    });
    message.success('已自动解析并提取链接中的主题、作者及热度数据！');
  };

  const onFinish = (values: any) => {
    submitManualReport({
      ...values,
      syncToProvince
    });
  };

  return (
    <div className="p-5 max-w-[1240px] mx-auto select-none space-y-4">
      {/* 顶部蓝色原生客户端引导提示条（完全还原图4） */}
      <div className="bg-[#eef6ff] border border-[#d4e8ff] rounded-md px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-blue-700">
          抖音平台、今日头条、微博平台支持客户端上报，客户端上报支持下载视频、自动固证截图、建议使用客户端上报
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            size="small"
            className="!bg-blue-600 hover:!bg-blue-500 !text-xs !h-7"
          >
            打开客户端
          </Button>
          <Button
            size="small"
            className="!bg-white !text-blue-600 !border-blue-300 hover:!bg-blue-50 !text-xs !h-7"
          >
            进入下载
          </Button>
        </div>
      </div>

      {/* 主表单卡片 */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 shadow-2xs">
        <div className="text-base font-bold text-slate-800 mb-6">手工上报</div>

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ style: { width: '110px' } }}
          wrapperCol={{ flex: 1 }}
          onFinish={onFinish}
          initialValues={{
            collector: '王浩',
            collectUnit: '网安 / 总公司 / 总2_...',
            taskType: '日常上报',
            region: '姑苏区',
            sourcePlatform: '抖音app'
          }}
        >
          {/* 链接与解析 */}
          <Form.Item
            label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>链接:</span>}
            required
            className="mb-4"
          >
            <div className="flex items-center gap-2">
              <Form.Item name="link" noStyle rules={[{ required: true, message: '请输入链接' }]}>
                <Input placeholder="请输入链接" className="text-xs" />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleParseUrl}
                className="!bg-blue-600 hover:!bg-blue-500 !text-xs !px-4"
              >
                解析
              </Button>
            </div>
          </Form.Item>

          {/* 信息主题 */}
          <Form.Item
            label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>信息主题:</span>}
            name="theme"
            rules={[{ required: true, message: '请输入信息主题' }]}
            className="mb-4"
          >
            <TextArea rows={3} placeholder="请输入信息主题" maxLength={2500} showCount className="text-xs" />
          </Form.Item>

          {/* 事件发生时间与涉事属地、采集人 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>事件发生时间:</span>}
                name="occurTime"
                className="mb-4"
              >
                <DatePicker showTime placeholder="选择日期" className="w-full text-xs" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700">涉事属地:</span>}
                name="region"
                className="mb-4"
              >
                <Select placeholder="请选择" className="text-xs">
                  <Option value="姑苏区">姑苏区</Option>
                  <Option value="江宁区">江宁区</Option>
                  <Option value="沭阳县">沭阳县</Option>
                  <Option value="昆山市">昆山市</Option>
                  <Option value="相城区">相城区</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>采集人:</span>}
                name="collector"
                rules={[{ required: true }]}
                className="mb-4"
              >
                <Input placeholder="王浩" className="text-xs" />
              </Form.Item>
            </Col>
          </Row>

          {/* 采集单位、信息来源、作者 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>采集单位:</span>}
                name="collectUnit"
                rules={[{ required: true }]}
                className="mb-4"
              >
                <Select placeholder="网安 / 总公司 / 总2_..." className="text-xs">
                  <Option value="网安 / 总公司 / 总2_...">网安 / 总公司 / 总2_...</Option>
                  <Option value="姑苏区分局网安大队">姑苏区分局网安大队</Option>
                  <Option value="江宁区分局网安大队">江宁区分局网安大队</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700">信息来源:</span>}
                name="sourcePlatform"
                className="mb-4"
              >
                <Input placeholder="请输入信息来源" className="text-xs" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700">作者:</span>}
                name="author"
                className="mb-4"
              >
                <Input placeholder="请输入作者" className="text-xs" />
              </Form.Item>
            </Col>
          </Row>

          {/* 作者平台ID */}
          <Form.Item
            label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>作者平台ID:</span>}
            name="authorPlatformId"
            rules={[{ required: true, message: '请输入作者平台ID' }]}
            className="mb-4"
          >
            <Input placeholder="请输入抖音号、微博id、头条id" maxLength={256} className="text-xs" />
          </Form.Item>

          {/* 评论数、转发数、点赞数 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span className="text-xs text-slate-700">评论数:</span>} name="commentCount" className="mb-4">
                <Input placeholder="请输入评论数" className="text-xs" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span className="text-xs text-slate-700">转发数:</span>} name="forwardCount" className="mb-4">
                <Input placeholder="请输入转发数" className="text-xs" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span className="text-xs text-slate-700">点赞数:</span>} name="likeCount" className="mb-4">
                <Input placeholder="请输入点赞数" className="text-xs" />
              </Form.Item>
            </Col>
          </Row>

          {/* 初研意见 */}
          <Form.Item
            label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>初研意见:</span>}
            name="initialOpinion"
            rules={[{ required: true, message: '请输入初研意见' }]}
            className="mb-4"
          >
            <TextArea rows={3} placeholder="请输入初研意见" className="text-xs" />
          </Form.Item>

          {/* 专项任务 */}
          <Form.Item label={<span className="text-xs text-slate-700">专项任务:</span>} name="specialTask" className="mb-4">
            <Input placeholder="请输入专项任务名称，无专项任务则不输入" className="text-xs" />
          </Form.Item>

          {/* 等级与舆情类型 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span className="text-xs text-slate-700">等级:</span>} name="level" className="mb-4">
                <Select placeholder="请选择" className="text-xs">
                  <Option value="一级 (特急)">一级 (特急)</Option>
                  <Option value="二级 (高)">二级 (高)</Option>
                  <Option value="三级 (中)">三级 (中)</Option>
                  <Option value="四级 (低)">四级 (低)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="text-xs text-slate-700">舆情类型:</span>} name="opinionType" className="mb-4">
                <Select placeholder="请选择" className="text-xs">
                  <Option value="公共安全事故">公共安全事故</Option>
                  <Option value="涉警维权舆情">涉警维权舆情</Option>
                  <Option value="涉校园学生安全">涉校园学生安全</Option>
                  <Option value="涉民生投诉">涉民生投诉</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 通报区县、任务类型、谣言信息与同步报送省厅开关 */}
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Form.Item label={<span className="text-xs text-slate-700">通报区县:</span>} name="notifyDistrict" className="mb-4">
                <Select placeholder="请选择" className="text-xs">
                  <Option value="姑苏区">姑苏区</Option>
                  <Option value="江宁区">江宁区</Option>
                  <Option value="沭阳县">沭阳县</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>任务类型:</span>}
                name="taskType"
                rules={[{ required: true }]}
                className="mb-4"
              >
                <Select placeholder="日常上报" className="text-xs">
                  <Option value="日常上报">日常上报</Option>
                  <Option value="专项巡查上报">专项巡查上报</Option>
                  <Option value="紧急线索直报">紧急线索直报</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700">谣言信息:</span>
                  <Switch checked={isRumor} onChange={setIsRumor} size="small" />
                </div>

                {/* 【新增跨租户功能整合点】：同等对齐样式新增“同步报送省厅” */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-700 font-medium">同步报送省厅:</span>
                  <Switch checked={syncToProvince} onChange={setSyncToProvince} size="small" />
                </div>
              </div>
            </Col>
          </Row>

          {/* 开关开启时的 12px 浅蓝小字提示 */}
          {syncToProvince && (
            <div className="text-[12px] text-blue-600 bg-blue-50/80 px-3 py-1.5 rounded mb-4 inline-block">
              💡 开启后数据将流转至市局审核工作台，把关通过后同步至省厅内网。
            </div>
          )}

          {/* 附件 */}
          <Form.Item
            label={<span className="text-xs text-slate-700"><span className="text-rose-500 mr-0.5">*</span>附件:</span>}
            required
            className="mb-6"
          >
            <div>
              <div className="w-24 h-24 border border-dashed border-slate-300 hover:border-blue-400 rounded-md flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-500 bg-slate-50/50">
                <PlusOutlined className="text-xl mb-1" />
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                ① 截图请截全屏，务必确保要素齐全
              </div>
            </div>
          </Form.Item>

          {/* 底部按钮居右 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button onClick={() => form.resetFields()} className="!text-xs text-slate-600">
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="!bg-blue-600 hover:!bg-blue-500 !text-xs !px-5"
            >
              提交
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
