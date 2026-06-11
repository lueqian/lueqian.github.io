/**
 * @name CollectTaskDrawer - 共享 Drawer 组件
 * @description 从 CollectTask.tsx 抽取的新建/修改任务 Drawer，供 CollectTask 和 Search 页面复用
 */

import '../style.css';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Select, Radio, Form, InputNumber, TimePicker, DatePicker, Drawer, Divider, Checkbox, message, Space, Tooltip } from 'antd';
import { DoubleRightOutlined, LoadingOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// ============ 类型定义 ============

type ScopeType = 'topic' | 'source' | 'other';

export interface CollectTaskDrawerProps {
  open: boolean;
  title?: string;
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

const FrequencySelector: React.FC<{
  value?: { mode: string; value: string };
  onChange?: (val: { mode: string; value: string }) => void;
}> = function ({ value, onChange }) {
  const mode = value?.mode || 'hour';
  const val = value?.value || '';

  const handleModeChange = useCallback(function (e: any) {
    const newMode = e.target.value;
    const defaults: Record<string, string> = {
      hour: '2', day: '08:00',
    };
    onChange?.({ mode: newMode, value: defaults[newMode] || '' });
  }, [onChange]);

  const handleValueChange = useCallback(function (v: any) {
    onChange?.({ mode, value: typeof v === 'string' ? v : String(v) });
  }, [mode, onChange]);

  return (
    <div className="ct-freq-selector">
      <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid" size="small">
        <Radio.Button value="hour">每X小时</Radio.Button>
        <Radio.Button value="day">每天</Radio.Button>
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
      </div>
    </div>
  );
};

// ============ 专题/重点源 - 目标平台选项 ============

const SCOPE_PLATFORM_OPTIONS = [
  { value: '抖音', label: '抖音' },
  { value: '微博', label: '微博' },
  { value: '小红书', label: '小红书' },
  { value: '快手', label: '快手' },
  { value: 'B站', label: 'B站' },
  { value: '知乎', label: '知乎' },
];

// ============ 额度预估看板 ============

const COLLECT_PAGE_OPTIONS = [
  { value: '1', label: '前1页' },
  { value: '5', label: '前5页' },
  { value: '10', label: '前10页' },
  { value: 'max', label: '最大采集' },
];

const PAGE_MULTIPLIER: Record<string, number> = {
  '1': 1,
  '5': 3,
  '10': 8,
  'max': 30,
};

const QuotaEstimatePanel: React.FC<{
  scopeLabel: string;
  platformPageConfig: Record<string, string>;
}> = function ({ scopeLabel, platformPageConfig }) {
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState(0);
  const [estimatedQuota, setEstimatedQuota] = useState(0);

  // 将 platformPageConfig 对象序列化为字符串，用于触发重算
  var configKey = JSON.stringify(platformPageConfig);

  // 生成随机数
  var generateRandom = useCallback(function () {
    var posts = Math.floor(Math.random() * 4001) + 1000;
    var median = Math.floor(Math.random() * 151) + 50;
    var totalQuota = 0;
    for (var platform in platformPageConfig) {
      var pages = platformPageConfig[platform];
      var multiplier = PAGE_MULTIPLIER[pages] || 1;
      totalQuota += median * multiplier;
    }
    return { posts, quota: totalQuota };
  }, [configKey]);

  // 初始化 + 选项变更时重新计算
  useEffect(function () {
    setLoading(true);
    var timer = setTimeout(function () {
      var result = generateRandom();
      setPostData(result.posts);
      setEstimatedQuota(result.quota);
      setLoading(false);
    }, 1000);
    return function () { clearTimeout(timer); };
  }, [configKey, generateRandom]);

  // 判断是否有任一平台选择了"最大采集"
  var hasMaxCollect = Object.values(platformPageConfig).some(function (v) { return v === 'max'; });
  var quotaColor = hasMaxCollect ? '#FA8C16' : '#1890FF';

  return (
    <div className={'ct-quota-panel' + (hasMaxCollect ? ' ct-quota-panel--warning' : '')}>
      <div className="ct-quota-panel-title">
        <span>额度预估</span>
      </div>
      <div className="ct-quota-panel-body">
        {loading ? (
          <div className="ct-quota-loading">
            <div className="ct-quota-loading-bar">
              <div className="ct-quota-loading-bar-inner" />
            </div>
            <span className="ct-quota-loading-text">正在计算预估额度...</span>
          </div>
        ) : (
          <>
            <div className="ct-quota-info">
              <span className="ct-quota-info-text">
                该{scopeLabel}近7天累计收录 <strong>{postData.toLocaleString()}</strong> 条帖子，基于各平台采集页数配置，当前配置预计：
              </span>
            </div>
            <div className="ct-quota-result">
              <span className="ct-quota-result-label">预计消耗额度：</span>
              <span className="ct-quota-result-value" style={{ color: quotaColor }}>
                {estimatedQuota.toLocaleString()} 次/天
              </span>
              {hasMaxCollect && (
                <Tooltip title="最大采集将尝试抓取所有历史评论，可能导致额度快速消耗">
                  <WarningOutlined className="ct-quota-warning-icon" />
                </Tooltip>
              )}
            </div>
          </>
        )}
      </div>
    </div>
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
  shakeTrackDays: boolean;
  onShakeTrackDays: (v: boolean) => void;
}> = function ({ form, scopeType, frequency, submitting, onScopeTypeChange, onFrequencyChange, shakeTrackDays, onShakeTrackDays }) {
  const [trackDaysError, setTrackDaysError] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkValidation, setLinkValidation] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validateResult, setValidateResult] = useState<{ validCount: number; platforms: string[]; invalidList: string[] } | null>(null);

  // 专题/重点源二级配置状态
  const [scopePlatforms, setScopePlatforms] = useState<string[]>([]);
  const [scopePlatformPages, setScopePlatformPages] = useState<Record<string, string>>({});

  // 链接模式按平台采集页数状态
  const [linkPlatformPages, setLinkPlatformPages] = useState<Record<string, string>>({});

  const trackDaysValue = Form.useWatch('track_days', form);
  const taskTypeValue = Form.useWatch('task_type', form);
  const relatedTopicValue = Form.useWatch('related_topic', form);
  const relatedSourceValue = Form.useWatch('related_source', form);
  const linkPlatformsValue = Form.useWatch('platforms', form);

  // 判断是否已选定专题/重点源（用于展示二级配置区）
  var hasSelectedScopeItem = (scopeType === 'topic' && relatedTopicValue) || (scopeType === 'source' && relatedSourceValue);
  var scopeLabel = scopeType === 'topic' ? '专题' : '重点源';

  // 追踪天数动态校验
  useEffect(function () {
    if (trackDaysValue !== undefined && trackDaysValue !== null) {
      setTrackDaysError(trackDaysValue > 7);
    } else {
      setTrackDaysError(false);
    }
  }, [trackDaysValue]);

  // 切换采集范围时重置链接文本
  var handleScopeTypeChange = useCallback(function (v: ScopeType) {
    onScopeTypeChange(v);
    setLinkText('');
    setValidateResult(null);
    setLinkValidation('idle');
  }, [onScopeTypeChange]);

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

        <Form.Item label="追踪天数" required>
          <div className={'ct-track-days-wrapper' + (shakeTrackDays ? ' ct-shake' : '')}>
            <InputNumber
              min={0}
              max={7}
              value={trackDaysValue}
              onChange={function (v) { form.setFieldValue('track_days', v); }}
              style={{ width: 160, borderColor: trackDaysError ? '#FF4D4F' : undefined }}
              addonBefore="T+"
              addonAfter="天"
              placeholder="请输入0～7之间的数字"
              status={trackDaysError ? 'error' : undefined}
            />
          </div>
          {trackDaysError && (
            <div className="ct-track-days-error">允许追踪的天数不超过7天，请重新输入</div>
          )}
        </Form.Item>

        <Form.Item label="结束时间" name="end_date">
          <DatePicker style={{ width: '100%' }} placeholder="请选择结束日期" />
        </Form.Item>
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

        {/* 专题/重点源 - 二级配置区 */}
        {hasSelectedScopeItem && (
          <div className="ct-scope-secondary">
            <div className="ct-scope-secondary-title">采集配置</div>

            <Form.Item label="采集来源" required>
              <div className="ct-scope-platform-group">
                <Checkbox
                  indeterminate={scopePlatforms.length > 0 && scopePlatforms.length < SCOPE_PLATFORM_OPTIONS.length}
                  checked={scopePlatforms.length === SCOPE_PLATFORM_OPTIONS.length}
                  onChange={function (e) {
                    var newPlatforms = e.target.checked ? SCOPE_PLATFORM_OPTIONS.map(function (o) { return o.value; }) : [];
                    setScopePlatforms(newPlatforms);
                    // 重置页数配置：保留仍选中的平台，移除取消的
                    setScopePlatformPages(function (prev) {
                      var next: Record<string, string> = {};
                      newPlatforms.forEach(function (p) {
                        next[p] = prev[p] || '1';
                      });
                      return next;
                    });
                  }}
                  className="ct-scope-platform-all"
                >
                  全部
                </Checkbox>
                {SCOPE_PLATFORM_OPTIONS.map(function (opt) {
                  return (
                    <Checkbox
                      key={opt.value}
                      checked={scopePlatforms.includes(opt.value)}
                      onChange={function () {
                        setScopePlatforms(function (prev) {
                          var next = prev.includes(opt.value)
                            ? prev.filter(function (v) { return v !== opt.value; })
                            : [...prev, opt.value];
                          // 同步页数配置
                          setScopePlatformPages(function (pp) {
                            var updated: Record<string, string> = {};
                            next.forEach(function (p) {
                              updated[p] = pp[p] || '1';
                            });
                            return updated;
                          });
                          return next;
                        });
                      }}
                    >
                      {opt.label}
                    </Checkbox>
                  );
                })}
              </div>
            </Form.Item>

            {/* 评论区采集时，按平台配置采集页数 */}
            {taskTypeValue === 'comment' && scopePlatforms.length > 0 && (
              <div className="ct-platform-page-config">
                <div className="ct-platform-page-config-title">各平台采集页数</div>
                {scopePlatforms.map(function (platform) {
                  return (
                    <div key={platform} className="ct-platform-page-row">
                      <span className="ct-platform-page-label">{platform}</span>
                      <Radio.Group
                        value={scopePlatformPages[platform] || '1'}
                        onChange={function (e) {
                          setScopePlatformPages(function (prev) {
                            return { ...prev, [platform]: e.target.value };
                          });
                        }}
                        size="small"
                      >
                        {COLLECT_PAGE_OPTIONS.map(function (opt) {
                          return <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>;
                        })}
                      </Radio.Group>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 额度预估看板（仅评论区采集时显示） */}
            {taskTypeValue === 'comment' && (
              <QuotaEstimatePanel
                scopeLabel={scopeLabel}
                platformPageConfig={scopePlatformPages}
              />
            )}
          </div>
        )}

        {scopeType === 'other' && (
          <div className="ct-scope-secondary">
            <div className="ct-scope-secondary-title">采集配置</div>

            <Form.Item label="采集来源" name="platforms">
              <PlatformCheckboxGroup />
            </Form.Item>

            {/* 流式批量链接录入 */}
            <Form.Item label="链接地址" required>
              <div className="ct-link-textarea-wrapper">
                <Input.TextArea
                  value={linkText}
                  onChange={function (e) {
                    setLinkText(e.target.value);
                    // 输入时清除上次校验结果
                    if (validateResult) {
                      setValidateResult(null);
                      setLinkValidation('idle');
                    }
                  }}
                  placeholder="支持批量粘贴链接，每行一个或以换行分隔"
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  className="ct-link-textarea"
                />
                <div className="ct-link-textarea-footer">
                  <span />
                  <Button
                    type="link"
                    size="small"
                    className="ct-link-validate-btn"
                    disabled={linkValidation === 'loading' || !linkText.trim()}
                    onClick={function () {
                      setValidateResult(null);
                      setLinkValidation('loading');
                      setTimeout(function () {
                        var lines = linkText.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
                        var urlPattern = /^https?:\/\/.+/i;
                        var validLines: string[] = [];
                        var invalidList: string[] = [];
                        var platformSet = new Set<string>();
                        // 平台关键词识别
                        var platformKeywords: Record<string, string[]> = {
                          '抖音': ['douyin', 'iesdouyin'],
                          '微博': ['weibo'],
                          '小红书': ['xiaohongshu', 'xhslink'],
                          '快手': ['kuaishou', 'v.kuaishou'],
                          'B站': ['bilibili', 'b23.tv'],
                          '知乎': ['zhihu'],
                        };
                        lines.forEach(function (line) {
                          if (urlPattern.test(line)) {
                            validLines.push(line);
                            // 识别平台
                            var lowerLine = line.toLowerCase();
                            for (var platform in platformKeywords) {
                              var keywords = platformKeywords[platform];
                              if (keywords.some(function (kw) { return lowerLine.includes(kw); })) {
                                platformSet.add(platform);
                                break;
                              }
                            }
                          } else {
                            invalidList.push(line);
                          }
                        });
                        setValidateResult({
                          validCount: validLines.length,
                          platforms: Array.from(platformSet),
                          invalidList: invalidList,
                        });
                        setLinkValidation(invalidList.length === 0 ? 'success' : 'error');
                      }, 1000);
                    }}
                  >
                    {linkValidation === 'loading' && <><LoadingOutlined style={{ marginRight: 4 }} />校验中...</>}
                    {linkValidation === 'success' && <><CheckCircleOutlined style={{ marginRight: 4 }} />校验通过</>}
                    {(linkValidation === 'idle' || linkValidation === 'error') && '链接校验'}
                  </Button>
                </div>
              </div>
              {/* 校验结果区 */}
              {validateResult && linkValidation === 'success' && (
                <div className="ct-link-validate-result ct-link-validate-result--success">
                  <CheckCircleOutlined style={{ marginRight: 6 }} />
                  已识别 {validateResult.validCount} 条有效链接
                  {validateResult.platforms.length > 0 && (
                    <span>（{validateResult.platforms.join('、')}）</span>
                  )}
                </div>
              )}
              {validateResult && linkValidation === 'error' && (
                <div className="ct-link-validate-result ct-link-validate-result--error">
                  <span>
                    已识别 {validateResult.validCount} 条有效链接，无法识别以下内容：
                  </span>
                  <div className="ct-link-validate-error-list">
                    {validateResult.invalidList.map(function (item, idx) {
                      return <span key={idx} className="ct-link-validate-error-item">{item}</span>;
                    })}
                  </div>
                  <span>将在提交后自动剔除</span>
                </div>
              )}
            </Form.Item>

            {/* 评论区采集时，按平台配置采集页数 */}
            {taskTypeValue === 'comment' && linkPlatformsValue && linkPlatformsValue.length > 0 && (
              <div className="ct-platform-page-config">
                <div className="ct-platform-page-config-title">各平台采集页数</div>
                {linkPlatformsValue.map(function (platform: string) {
                  return (
                    <div key={platform} className="ct-platform-page-row">
                      <span className="ct-platform-page-label">{platform}</span>
                      <Radio.Group
                        value={linkPlatformPages[platform] || '1'}
                        onChange={function (e) {
                          setLinkPlatformPages(function (prev) {
                            return { ...prev, [platform]: e.target.value };
                          });
                        }}
                        size="small"
                      >
                        {COLLECT_PAGE_OPTIONS.map(function (opt) {
                          return <Radio key={opt.value} value={opt.value}>{opt.label}</Radio>;
                        })}
                      </Radio.Group>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 额度预估看板（仅评论区采集时显示） */}
            {taskTypeValue === 'comment' && linkPlatformsValue && linkPlatformsValue.length > 0 && (
              <QuotaEstimatePanel
                scopeLabel="链接"
                platformPageConfig={linkPlatformPages}
              />
            )}
          </div>
        )}
      </div>

    </Form>
  );
};

// ============ 主组件：CollectTaskDrawer ============

const CollectTaskDrawer: React.FC<CollectTaskDrawerProps> = function ({ open, title = '新建采集任务', onClose, onSubmit, initialValues }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [drawerScopeType, setDrawerScopeType] = useState<ScopeType>('topic');
  const [drawerFrequency, setDrawerFrequency] = useState<{ mode: string; value: string }>({
    mode: 'hour',
    value: '2',
  });
  const [shakeTrackDays, setShakeTrackDays] = useState(false);

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
    // 追踪天数校验拦截
    var trackDays = form.getFieldValue('track_days');
    if (trackDays === undefined || trackDays === null || trackDays > 7) {
      setShakeTrackDays(true);
      setTimeout(function () { setShakeTrackDays(false); }, 600);
      message.error('请检查追踪天数，允许范围 0-7 天');
      return;
    }
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
      title={title}
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
        shakeTrackDays={shakeTrackDays}
        onShakeTrackDays={setShakeTrackDays}
      />
    </Drawer>
  );
};

export default CollectTaskDrawer;
