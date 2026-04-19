/**
 * @name CollectTaskDrawer - 共享 Drawer 组件
 * @description 从 CollectTask.tsx 抽取的新建/修改任务 Drawer，供 CollectTask 和 Search 页面复用
 */

import '../style.css';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Select, Radio, Form, InputNumber, TimePicker, DatePicker, Drawer, Divider, Modal, Checkbox, message, Space } from 'antd';
import { PlusOutlined, LinkOutlined, DeleteOutlined, DoubleRightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// ============ 类型定义 ============

type ScopeType = 'topic' | 'source' | 'other';

export interface CollectTaskDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;  // 提交成功后的回调（可选）
  // 预填充数据（可选，用于跨页面调用时自动填充）
  initialValues?: {
    task_name?: string;
    scope_type?: 'topic' | 'source' | 'other';
    platforms?: string[];
    link_list?: Array<{ link: string; title: string; topic: string }>;
    related_topic?: string;
    related_source?: string;
  };
}

// ============ 常量 ============

const PLATFORMS = ['小红书', '抖音', '小红书', '今日头条', '快手', 'B站', '知乎', '百度贴吧'];

const TOPIC_OPTIONS = [
  { value: 'topic_001', label: '汽车行业专题' },
  { value: 'topic_002', label: '消费专题调研' },
  { value: 'topic_003', label: '科技数码专题' },
  { value: 'topic_004', label: '食品安全专题' },
  { value: 'topic_005', label: '教育改革专题' },
];

const SOURCE_OPTIONS = [
  { value: 'src_001', label: '人民日报' },
  { value: 'src_002', label: '新华社' },
  { value: 'src_003', label: '央视新闻' },
  { value: 'src_004', label: '环球时报' },
  { value: 'src_005', label: '澎湃新闻' },
];

const LINK_PLATFORM_OPTIONS = [
  { value: '抖音', label: '抖音' },
  { value: '微博', label: '微博' },
  { value: '小红书', label: '小红书' },
  { value: '今日头条', label: '今日头条' },
  { value: '快手', label: '快手' },
  { value: 'B站', label: 'B站' },
  { value: '知乎', label: '知乎' },
  { value: '百度贴吧', label: '百度贴吧' },
];

// ============ 频率组件 ============

const WEEK_DAYS = [
  { value: '1', label: '周一' },
  { value: '2', label: '周二' },
  { value: '3', label: '周三' },
  { value: '4', label: '周四' },
  { value: '5', label: '周五' },
  { value: '6', label: '周六' },
  { value: '0', label: '周日' },
];

const FrequencySelector: React.FC<{
  value?: { mode: string; value: string };
  onChange?: (val: { mode: string; value: string }) => void;
}> = function ({ value, onChange }) {
  const mode = value?.mode || 'hour';
  const val = value?.value || '';

  const handleModeChange = useCallback(function (e: any) {
    const newMode = e.target.value;
    const defaults: Record<string, string> = {
      hour: '2', day: '08:00', week: '1',
    };
    onChange?.({ mode: newMode, value: defaults[newMode] || '' });
  }, [onChange]);

  const handleValueChange = useCallback(function (v: any) {
    onChange?.({ mode, value: typeof v === 'string' ? v : String(v) });
  }, [mode, onChange]);

  // 解析每周选中的日期（逗号分隔）
  const weekSelected = React.useMemo(function () {
    if (mode !== 'week' || !val) return [];
    var parts = val.split('|');
    return (parts[0] || '').split(',').filter(Boolean);
  }, [mode, val]);

  // 解析每周时间
  const weekTime = React.useMemo(function () {
    if (mode !== 'week') return '08:00';
    var parts = val.split('|');
    return parts[1] || '08:00';
  }, [mode, val]);

  const handleDayToggle = useCallback(function (dayValue: string) {
    var current = weekSelected.includes(dayValue)
      ? weekSelected.filter(function (d) { return d !== dayValue; })
      : [...weekSelected, dayValue];
    onChange?.({ mode: 'week', value: current.join(',') + '|' + weekTime });
  }, [weekSelected, weekTime, onChange]);

  const handleSelectAll = useCallback(function () {
    var allDays = WEEK_DAYS.map(function (d) { return d.value; });
    var isAllSelected = allDays.every(function (d) { return weekSelected.includes(d); });
    var newSelected = isAllSelected ? [] : allDays;
    onChange?.({ mode: 'week', value: newSelected.join(',') + '|' + weekTime });
  }, [weekSelected, weekTime, onChange]);

  const handleWeekTimeChange = useCallback(function (_: any, timeStr: string | null) {
    onChange?.({ mode: 'week', value: weekSelected.join(',') + '|' + (timeStr || '08:00') });
  }, [weekSelected, onChange]);

  return (
    <div className="ct-freq-selector">
      <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid" size="small">
        <Radio.Button value="hour">每X小时</Radio.Button>
        <Radio.Button value="day">每天</Radio.Button>
        <Radio.Button value="week">每周</Radio.Button>
      </Radio.Group>
      <div className="ct-freq-value">
        {mode === 'hour' && (
          <Space.Compact>
            <span className="ct-freq-label">每</span>
            <InputNumber min={1} max={24} value={parseInt(val) || 2} onChange={handleValueChange} style={{ width: 70 }} size="small" />
            <span className="ct-freq-label">小时</span>
          </Space.Compact>
        )}
        {mode === 'day' && (
          <Space.Compact>
            <span className="ct-freq-label">每天</span>
            <TimePicker value={val ? dayjs(val, 'HH:mm') : undefined} onChange={function (_, timeStr) { handleValueChange(timeStr); }} format="HH:mm" size="small" style={{ width: 110 }} />
          </Space.Compact>
        )}
        {mode === 'week' && (
          <div className="ct-freq-week">
            <div className="ct-freq-week-days">
                <div
                  className={'ct-freq-week-day ct-freq-week-day--all' + (weekSelected.length === 7 ? ' ct-freq-week-day--active' : '')}
                  onClick={handleSelectAll}
                >
                  全部
                </div>
                {WEEK_DAYS.map(function (day) {
                var isSelected = weekSelected.includes(day.value);
                return (
                  <div
                    key={day.value}
                    className={'ct-freq-week-day' + (isSelected ? ' ct-freq-week-day--active' : '')}
                    onClick={function () { handleDayToggle(day.value); }}
                  >
                    {day.label}
                  </div>
                );
              })}
            </div>
            <div className="ct-freq-week-time">
              <span className="ct-freq-label ct-freq-label--time">采集时间</span>
              <TimePicker value={dayjs(weekTime, 'HH:mm')} onChange={handleWeekTimeChange} format="HH:mm" size="small" style={{ width: 120 }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ 批量添加链接 Modal ============

const BatchAddModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onConfirm: (links: Array<{ link: string; title: string; topic: string }>) => void;
}> = function ({ open, onCancel, onConfirm }) {
  const [rows, setRows] = useState<Array<{ link: string; title: string; topic: string }>>([
    { link: '', title: '', topic: '' },
    { link: '', title: '', topic: '' },
    { link: '', title: '', topic: '' },
    { link: '', title: '', topic: '' },
    { link: '', title: '', topic: '' },
  ]);

  const handleRowChange = useCallback(function (index: number, field: string, value: string) {
    setRows(function (prev) {
      var next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const handleRemoveRow = useCallback(function (index: number) {
    setRows(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
  }, []);

  const handleAddRow = useCallback(function () {
    setRows(function (prev) { return [...prev, { link: '', title: '', topic: '' }]; });
  }, []);

  const handleConfirm = useCallback(function () {
    var validRows = rows.filter(function (r) { return r.link.trim() !== ''; });
    onConfirm(validRows);
  }, [rows, onConfirm]);

  return (
    <Modal
      title="批量添加链接"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={720}
      destroyOnClose
      className="ct-batch-modal"
    >
      <div className="ct-batch-hint">每行一个链接，链接为必填项，标题和主题选填。</div>
      <div className="ct-batch-scroll-area">
        <div className="ct-batch-table-header">
          <span className="ct-batch-col ct-batch-col--link">链接 *</span>
          <span className="ct-batch-col ct-batch-col--title">标题</span>
          <span className="ct-batch-col ct-batch-col--topic">主题</span>
          <span className="ct-batch-col ct-batch-col--action">操作</span>
        </div>
        {rows.map(function (row, idx) {
          return (
            <div key={idx} className="ct-batch-table-row">
              <Input
                className="ct-batch-col ct-batch-col--link"
                placeholder="请输入链接地址"
                value={row.link}
                onChange={function (e) { handleRowChange(idx, 'link', e.target.value); }}
                size="small"
              />
              <Input
                className="ct-batch-col ct-batch-col--title"
                placeholder="选填"
                value={row.title}
                onChange={function (e) { handleRowChange(idx, 'title', e.target.value); }}
                size="small"
              />
              <Input
                className="ct-batch-col ct-batch-col--topic"
                placeholder="选填"
                value={row.topic}
                onChange={function (e) { handleRowChange(idx, 'topic', e.target.value); }}
                size="small"
              />
              <div className="ct-batch-col ct-batch-col--action">
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={function () { handleRemoveRow(idx); }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="ct-batch-footer">
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleAddRow}
          className="ct-batch-add-btn"
        >
          添加链接
        </Button>
        <div className="ct-batch-footer-actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={handleConfirm} style={{ backgroundColor: '#1890FF', borderColor: '#1890FF' }}>
            提交
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============ 平台多选复选框（含全选） ============

const PlatformCheckboxGroup: React.FC<any> = function (props: any) {
  var value: string[] = props.value || [];
  var onChange = props.onChange || function () {};

  var allPlatformValues = LINK_PLATFORM_OPTIONS.map(function (o) { return o.value; });
  var isAllChecked = allPlatformValues.length > 0 && allPlatformValues.every(function (v) { return value.includes(v); });
  var isIndeterminate = value.length > 0 && !isAllChecked;

  var handleCheckAll = useCallback(function (e: any) {
    if (e.target.checked) {
      onChange(allPlatformValues);
    } else {
      onChange([]);
    }
  }, [onChange, allPlatformValues]);

  var handlePlatformChange = useCallback(function (checkedValue: string) {
    if (value.includes(checkedValue)) {
      onChange(value.filter(function (v) { return v !== checkedValue; }));
    } else {
      onChange([...value, checkedValue]);
    }
  }, [value, onChange]);

  return (
    <div className="ct-platform-checkbox-group">
      <Checkbox
        indeterminate={isIndeterminate}
        checked={isAllChecked}
        onChange={handleCheckAll}
        className="ct-platform-checkbox-all"
      >
        全部
      </Checkbox>
      {LINK_PLATFORM_OPTIONS.map(function (opt) {
        return (
          <Checkbox
            key={opt.value}
            checked={value.includes(opt.value)}
            onChange={function () { handlePlatformChange(opt.value); }}
          >
            {opt.label}
          </Checkbox>
        );
      })}
    </div>
  );
};

// ============ 新建/修改任务 - Drawer 表单内容 ============

const TaskFormContent: React.FC<{
  form: any;
  scopeType: ScopeType;
  frequency: { mode: string; value: string };
  submitting: boolean;
  onScopeTypeChange: (v: ScopeType) => void;
  onFrequencyChange: (v: { mode: string; value: string }) => void;
}> = function ({ form, scopeType, frequency, submitting, onScopeTypeChange, onFrequencyChange }) {
  const [endMode, setEndMode] = useState<'forever' | 'date'>('forever');
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // 动态链接列表（Form.List）
  const linkList = Form.useWatch('link_list', form) || [];

  const handleBatchConfirm = useCallback(function (newLinks: Array<{ link: string; title: string; topic: string }>) {
    setBatchModalOpen(false);
    var current = form.getFieldValue('link_list') || [];
    var merged = [...current];
    newLinks.forEach(function (nl) {
      merged.push({ link: nl.link, title: nl.title, topic: nl.topic });
    });
    form.setFieldValue('link_list', merged);
  }, [form]);

  // 切换采集范围时，若切到"链接"且当前无链接记录，自动添加1条空行
  var handleScopeTypeChange = useCallback(function (v: ScopeType) {
    onScopeTypeChange(v);
    if (v === 'other') {
      var current = form.getFieldValue('link_list') || [];
      if (current.length === 0) {
        form.setFieldValue('link_list', [{ link: '', title: '', topic: '' }]);
      }
    }
  }, [form, onScopeTypeChange]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        task_name: '',
        task_type: 'interaction',
        scope_type: 'topic',
        platforms: [],
        related_topic: undefined,
        related_source: undefined,
        link_list: [],
        track_days: 7,
        end_mode: 'forever',
        end_date: undefined,
      }}
    >
      {/* ---- Section 1: 任务要求 ---- */}
      <div className="ct-drawer-section">
        <div className="ct-drawer-section-title">任务要求</div>

        <Form.Item label="任务名称" name="task_name" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入任务名称" maxLength={50} showCount />
        </Form.Item>

        <Form.Item label="任务类型" name="task_type" rules={[{ required: true, message: '请选择任务类型' }]}>
          <Radio.Group>
            <Radio value="interaction">互动量更新</Radio>
            <Radio value="comment">评论区采集</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="更新频率" required>
          <FrequencySelector value={frequency} onChange={onFrequencyChange} />
        </Form.Item>

        <Form.Item label="追踪天数" name="track_days" rules={[{ required: true, message: '请输入追踪天数' }]}>
          <InputNumber min={1} max={365} style={{ width: 160 }} addonBefore="T+" addonAfter="天" placeholder="请输入天数" />
        </Form.Item>

        <Form.Item label="结束时间" name="end_mode" rules={[{ required: true }]}>
          <Radio.Group onChange={function (e) { setEndMode(e.target.value); }}>
            <Radio value="forever">持续采集</Radio>
            <Radio value="date">指定日期</Radio>
          </Radio.Group>
        </Form.Item>

        {endMode === 'date' && (
          <Form.Item name="end_date" rules={[{ required: true, message: '请选择结束日期' }]}>
            <DatePicker style={{ width: '100%' }} placeholder="请选择结束日期" />
          </Form.Item>
        )}
      </div>

      {/* ---- Section 2: 任务对象 ---- */}
      <div className="ct-drawer-section">
        <div className="ct-drawer-section-title">任务对象</div>

        <Form.Item label="采集范围" name="scope_type" rules={[{ required: true, message: '请选择采集范围' }]}>
          <Radio.Group onChange={function (e) { handleScopeTypeChange(e.target.value); }}>
            <Radio value="topic">专题</Radio>
            <Radio value="source">重点源</Radio>
            <Radio value="other">链接</Radio>
          </Radio.Group>
        </Form.Item>

        {scopeType === 'topic' && (
          <Form.Item label="关联专题" name="related_topic" rules={[{ required: true, message: '请选择关联专题' }]}>
            <Select placeholder="请选择关联专题" showSearch optionFilterProp="label" options={TOPIC_OPTIONS} />
          </Form.Item>
        )}

        {scopeType === 'source' && (
          <Form.Item label="关联重点源" name="related_source" rules={[{ required: true, message: '请选择关联重点源' }]}>
            <Select placeholder="请选择关联重点源" showSearch optionFilterProp="label" options={SOURCE_OPTIONS} />
          </Form.Item>
        )}

        {scopeType === 'other' && (
          <>
            <Form.Item label="目标平台" name="platforms">
              <PlatformCheckboxGroup />
            </Form.Item>

            {/* 动态链接配置模块 */}
            <div className="ct-link-module">
              <div className="ct-link-module-header">
                <span className="ct-link-module-title">链接配置</span>
                <Space size={8}>
                  <Button type="link" size="small" icon={<PlusOutlined />} onClick={function () {
                    var current = form.getFieldValue('link_list') || [];
                    form.setFieldValue('link_list', [...current, { link: '', title: '', topic: '' }]);
                  }}>
                    添加单个
                  </Button>
                  <Button type="link" size="small" icon={<PlusOutlined />} onClick={function () { setBatchModalOpen(true); }}>
                    批量添加
                  </Button>
                </Space>
              </div>

              <Form.List name="link_list">
                {(fields, { remove }) => (
                  <div className="ct-link-list">
                    {fields.length === 0 && (
                      <div className="ct-link-empty">暂无链接，请点击上方按钮添加</div>
                    )}
                    {fields.map(function (field, idx) {
                      var canRemove = fields.length > 1;
                      return (
                        <div key={field.key} className="ct-link-row">
                          <div className="ct-link-row-index">{idx + 1}</div>
                          <div className="ct-link-row-fields">
                            <Form.Item
                              {...field}
                              name={[field.name, 'link']}
                              rules={[{ required: true, message: '请输入链接' }]}
                              className="ct-link-field ct-link-field--link"
                            >
                              <Input placeholder="链接地址" prefix={<LinkOutlined />} size="small" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'title']}
                              className="ct-link-field ct-link-field--title"
                            >
                              <Input placeholder="标题（选填）" size="small" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'topic']}
                              className="ct-link-field ct-link-field--topic"
                            >
                              <Input placeholder="主题（选填）" size="small" />
                            </Form.Item>
                          </div>
                          <div className="ct-link-row-action">
                            {canRemove ? (
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={function () { remove(field.name); }}
                              />
                            ) : (
                              <Button type="text" size="small" icon={<DeleteOutlined />} disabled />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Form.List>
            </div>

            <Form.Item label="采集页数" name="collect_pages" rules={[{ required: true, message: '请输入采集页数' }]}>
              <InputNumber min={0} max={200} style={{ width: 160 }} addonBefore="前" addonAfter="页" placeholder="请输入页数" />
            </Form.Item>
          </>
        )}
      </div>

      {/* 批量添加 Modal */}
      <BatchAddModal
        open={batchModalOpen}
        onCancel={function () { setBatchModalOpen(false); }}
        onConfirm={handleBatchConfirm}
      />
    </Form>
  );
};

// ============ 主组件：CollectTaskDrawer ============

const CollectTaskDrawer: React.FC<CollectTaskDrawerProps> = function ({ open, onClose, onSubmit, initialValues }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [drawerScopeType, setDrawerScopeType] = useState<ScopeType>('topic');
  const [drawerFrequency, setDrawerFrequency] = useState<{ mode: string; value: string }>({
    mode: 'hour',
    value: '2',
  });

  // open 变为 true 时，如果有 initialValues 则填充
  useEffect(function () {
    if (open) {
      if (initialValues) {
        // 设置 scopeType
        if (initialValues.scope_type) {
          setDrawerScopeType(initialValues.scope_type);
        }
        // 延迟填充表单，确保 Drawer 已渲染
        setTimeout(function () {
          var valuesToSet: any = {};
          if (initialValues.task_name !== undefined) valuesToSet.task_name = initialValues.task_name;
          if (initialValues.scope_type !== undefined) valuesToSet.scope_type = initialValues.scope_type;
          if (initialValues.platforms !== undefined) valuesToSet.platforms = initialValues.platforms;
          if (initialValues.link_list !== undefined) valuesToSet.link_list = initialValues.link_list;
          if (initialValues.related_topic !== undefined) valuesToSet.related_topic = initialValues.related_topic;
          if (initialValues.related_source !== undefined) valuesToSet.related_source = initialValues.related_source;
          form.setFieldsValue(valuesToSet);
        }, 100);
      } else {
        // 无 initialValues 时重置
        setDrawerScopeType('topic');
        setDrawerFrequency({ mode: 'hour', value: '2' });
        setTimeout(function () {
          form.resetFields();
        }, 0);
      }
    } else {
      // open 变为 false 时重置
      form.resetFields();
      setDrawerScopeType('topic');
      setDrawerFrequency({ mode: 'hour', value: '2' });
    }
  }, [open, initialValues, form]);

  const handleClose = useCallback(function () {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(function () {
    form.validateFields().then(function () {
      setSubmitting(true);
      setTimeout(function () {
        setSubmitting(false);
        message.success('任务提交成功');
        onSubmit?.();
        onClose();
      }, 1000);
    });
  }, [form, onSubmit, onClose]);

  return (
    <Drawer
      title="新建采集任务"
      placement="right"
      width={640}
      open={open}
      onClose={handleClose}
      mask={true}
      className="ct-form-drawer"
      destroyOnClose
      closeIcon={
        <div className="ct-drawer-close-btn">
          <DoubleRightOutlined />
        </div>
      }
      footer={
        <div className="ct-drawer-footer">
          <Button onClick={handleClose}>关闭</Button>
          <Button type="primary" loading={submitting} onClick={handleSubmit} style={{ backgroundColor: '#1890FF', borderColor: '#1890FF' }}>
            提交
          </Button>
        </div>
      }
    >
      <TaskFormContent
        form={form}
        scopeType={drawerScopeType}
        frequency={drawerFrequency}
        submitting={submitting}
        onScopeTypeChange={setDrawerScopeType}
        onFrequencyChange={setDrawerFrequency}
      />
    </Drawer>
  );
};

export default CollectTaskDrawer;
