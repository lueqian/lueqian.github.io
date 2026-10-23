/**
 * @name CollectTaskDrawer - 共享 Drawer 组件
 * @description 从 CollectTask.tsx 抽取的新建/修改任务 Drawer，供 CollectTask 和 Search 页面复用
 */

import '../style.css';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Select, Radio, Form, InputNumber, TimePicker, DatePicker, Drawer, Divider, Checkbox, message, Space, Tooltip, Tag, Table, Badge, Modal } from 'antd';
import { DoubleRightOutlined, LoadingOutlined, CheckCircleOutlined, WarningOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// ============ 类型定义 ============

type ScopeType = 'topic' | 'source' | 'other';

export interface CollectTaskDrawerProps {
  open: boolean;
  title?: string;
  isEditMode?: boolean;
  onClose: () => void;
  onSubmit?: (values: any) => void;  // 提交成功后的回调（可选）
  // 预填充数据（可选，用于跨页面调用时自动填充）
  initialValues?: {
    task_name?: string;
    scope_type?: 'topic' | 'source' | 'other';
    platforms?: string[];
    link_list?: Array<{ link: string; title: string; topic: string }>;
    related_topic?: string;
    related_source?: string;
    platform_pages?: Record<string, string>;
    start_date?: string;
    end_date?: string;
    frequency_mode?: string;
    frequency_value?: string;
    frequency_custom_rules?: any[];
  };
}

// ============ 常量与 Mock 映射 ============

const PLATFORMS = ['小红书', '抖音', '小红书', '今日头条', '快手', 'B站', '知乎', '百度贴吧'];

export const mockDataSourceCounts: Record<string, number> = {
  '汽车行业品牌声量监控': 1420,
  '汽车行业专题': 1420,
  '科技数码舆情': 0, // 用于模拟 0 条数据的空专题
  '猫咪日常Bot': 15,
  '数码测评组': 0,   // 用于模拟 0 条数据的空重点源
  '消费专题调研': 18,
  '科技数码专题': 32,
  '食品安全专题': 12,
  '教育改革专题': 8,
  '人民日报': 45,
  '新华社': 38,
  '央视新闻': 52,
  '环球时报': 29,
  '澎湃新闻': 30,
};

const TOPIC_OPTIONS = [
  { value: 'topic_001', label: '汽车行业品牌声量监控' },
  { value: 'topic_empty', label: '科技数码舆情' },
  { value: 'topic_002', label: '消费专题调研' },
  { value: 'topic_003', label: '科技数码专题' },
  { value: 'topic_004', label: '食品安全专题' },
  { value: 'topic_005', label: '教育改革专题' },
];

const SOURCE_OPTIONS = [
  { value: 'src_cat', label: '猫咪日常Bot' },
  { value: 'src_empty', label: '数码测评组' },
  { value: 'src_001', label: '人民日报' },
  { value: 'src_002', label: '新华社' },
  { value: 'src_003', label: '央视新闻' },
  { value: 'src_004', label: '环球时报' },
  { value: 'src_005', label: '澎湃新闻' },
];

function getDataSourceCount(scopeType: ScopeType, selectedValue?: string): number | null {
  if (!selectedValue || scopeType === 'other') {
    return null;
  }
  let label = selectedValue;
  if (scopeType === 'topic') {
    const found = TOPIC_OPTIONS.find(function (opt) {
      return opt.value === selectedValue || opt.label === selectedValue;
    });
    if (found) label = found.label;
  } else if (scopeType === 'source') {
    const found = SOURCE_OPTIONS.find(function (opt) {
      return opt.value === selectedValue || opt.label === selectedValue;
    });
    if (found) label = found.label;
  }
  if (Object.prototype.hasOwnProperty.call(mockDataSourceCounts, label)) {
    return mockDataSourceCounts[label];
  }
  return 18;
}

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

const HOUR_OPTIONS = Array.from({ length: 24 }, function (_, i) {
  var hourStr = String(i).padStart(2, '0') + ':00';
  return { value: hourStr, label: hourStr };
});

function validateSingleLink(linkStr: string): { id: string; link: string; platform: string; status: 'valid' | 'invalid' } {
  var cleanLink = linkStr.trim();
  
  var testUrl = cleanLink;
  if (cleanLink && !/^https?:\/\//i.test(cleanLink)) {
    testUrl = 'http://' + cleanLink;
  }
  
  var domain = '';
  try {
    var urlObj = new URL(testUrl);
    domain = urlObj.hostname.toLowerCase();
  } catch (e) {
    var domainMatch = cleanLink.match(/^(?:https?:\/\/)?(?:[^\s\/]+\.)?([a-zA-Z0-9\-]+\.[a-z]{2,})(?:\/|$)/i);
    domain = domainMatch ? domainMatch[1].toLowerCase() : '';
  }

  var platformKeywords: Record<string, string[]> = {
    '抖音': ['douyin.com', 'iesdouyin.com'],
    '微博': ['weibo.com', 'weibo.cn'],
    '小红书': ['xiaohongshu.com', 'xhslink.com'],
    '快手': ['kuaishou.com'],
    'B站': ['bilibili.com', 'b23.tv'],
    '知乎': ['zhihu.com'],
  };

  var matchedPlatform = '其他';
  var isValid = false;

  for (var platform in platformKeywords) {
    var domains = platformKeywords[platform];
    if (domains.some(function (d) { return domain === d || domain.endsWith('.' + d); })) {
      matchedPlatform = platform;
      isValid = true;
      break;
    }
  }

  return {
    id: Math.random().toString(36).slice(2, 9),
    link: cleanLink,
    platform: matchedPlatform,
    status: isValid ? 'valid' : 'invalid'
  };
}

// ============ 频率组件 ============

const FrequencySelector: React.FC<{
  value?: any;
  onChange?: (val: any) => void;
}> = function ({ value, onChange }) {
  const mode = value?.mode || 'hour';
  const val = value?.value || '';
  const dateRange = value?.dateRange || null;
  const customRules = value?.customRules || [];

  const handleModeChange = useCallback(function (e: any) {
    const newMode = e.target.value;
    const defaults: Record<string, string> = {
      hour: '2', day: '08:00', custom: ''
    };
    onChange?.({
      mode: newMode,
      value: defaults[newMode] || '',
      dateRange: newMode === 'custom' ? null : dateRange,
      customRules: newMode === 'custom' ? (customRules.length > 0 ? customRules : [{
        id: Math.random().toString(36).slice(2, 9),
        mode: 'hour',
        value: '2',
        dateRange: null,
      }]) : customRules
    });
  }, [onChange, dateRange, customRules]);

  const handleValueChange = useCallback(function (v: any) {
    onChange?.({ ...value, value: typeof v === 'string' ? v : String(v) });
  }, [value, onChange]);

  const handleDateRangeChange = useCallback(function (range: any) {
    onChange?.({ ...value, dateRange: range });
  }, [value, onChange]);

  const handleRuleChange = useCallback(function (id: string, field: string, val: any) {
    const updated = customRules.map((r: any) => {
      if (r.id === id) {
        let newVal = val;
        if (field === 'value' && typeof val !== 'string' && val !== undefined && val !== null) {
          newVal = String(val);
        }
        return { ...r, [field]: newVal };
      }
      return r;
    });
    onChange?.({ ...value, customRules: updated });
  }, [value, customRules, onChange]);

  const handleAddRule = useCallback(function () {
    const newRule = {
      id: Math.random().toString(36).slice(2, 9),
      mode: 'hour' as const,
      value: '2',
      dateRange: null,
    };
    onChange?.({ ...value, customRules: [...customRules, newRule] });
  }, [value, customRules, onChange]);

  const handleRemoveRule = useCallback(function (id: string) {
    const updated = customRules.filter((r: any) => r.id !== id);
    onChange?.({ ...value, customRules: updated });
  }, [value, customRules, onChange]);

  return (
    <div className="ct-freq-selector" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Radio.Group value={mode} onChange={handleModeChange} buttonStyle="solid" size="small">
        <Radio.Button value="hour">每X小时</Radio.Button>
        <Radio.Button value="day">每天</Radio.Button>
        <Radio.Button value="custom">自定义</Radio.Button>
      </Radio.Group>
      
      {mode !== 'custom' && (
        <div className="ct-freq-normal" style={{ border: '1px solid #f0f0f0', padding: 12, borderRadius: 6, backgroundColor: '#fafafa' }}>
          <div className="ct-freq-value" style={{ marginBottom: 12 }}>
            {mode === 'hour' && (
              <Space size={4}>
                <span className="ct-freq-label" style={{ color: 'rgba(0,0,0,0.65)' }}>每</span>
                <InputNumber min={1} max={24} value={parseInt(val) || 2} onChange={handleValueChange} style={{ width: 70 }} size="small" />
                <span className="ct-freq-label" style={{ color: 'rgba(0,0,0,0.65)' }}>小时采集一次</span>
              </Space>
            )}
            {mode === 'day' && (
              <Space size={4}>
                <span className="ct-freq-label" style={{ color: 'rgba(0,0,0,0.65)' }}>每天</span>
                <Select value={val || '08:00'} onChange={handleValueChange} options={HOUR_OPTIONS} size="small" style={{ width: 90 }} />
                <span className="ct-freq-label" style={{ color: 'rgba(0,0,0,0.65)' }}>采集一次</span>
              </Space>
            )}
          </div>
          <div>
            <div style={{ marginBottom: 4, color: 'rgba(0,0,0,0.65)', fontSize: 13 }}>时间范围:</div>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              disabledDate={function (current) {
                return current && current < dayjs().startOf('day');
              }}
              placeholder={['开始日期', '结束日期']}
              style={{ width: '100%' }}
              size="small"
            />
          </div>
        </div>
      )}

      {mode === 'custom' && (
        <div className="ct-freq-custom-container" style={{ border: '1px solid #f0f0f0', padding: 12, borderRadius: 6, backgroundColor: '#fafafa' }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
            可按不同的时间段，配置不同的采集频率（小时级或每天级）：
          </div>
          <div className="ct-freq-custom-rules" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {customRules.map((rule: any, idx: number) => (
              <div key={rule.id} className="ct-custom-rule-row" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '8px 0', borderBottom: idx < customRules.length - 1 ? '1px dashed #e8e8e8' : 'none' }}>
                <DatePicker.RangePicker
                  value={rule.dateRange}
                  onChange={(range) => handleRuleChange(rule.id, 'dateRange', range)}
                  disabledDate={function (current) {
                    return current && current < dayjs().startOf('day');
                  }}
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: 220 }}
                  size="small"
                />
                
                <Select
                  value={rule.mode}
                  onChange={(m) => {
                    handleRuleChange(rule.id, 'mode', m);
                    handleRuleChange(rule.id, 'value', m === 'day' ? '08:00' : '2');
                  }}
                  size="small"
                  style={{ width: 95 }}
                >
                  <Select.Option value="hour">每X小时</Select.Option>
                  <Select.Option value="day">每天</Select.Option>
                </Select>

                {rule.mode === 'hour' ? (
                  <Space size={2}>
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>每</span>
                    <InputNumber min={1} max={24} value={parseInt(rule.value) || 2} onChange={(v) => handleRuleChange(rule.id, 'value', v)} style={{ width: 55 }} size="small" />
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>小时更新一次</span>
                  </Space>
                ) : (
                  <Space size={2}>
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>每天</span>
                    <Select value={rule.value || '08:00'} onChange={(v) => handleRuleChange(rule.id, 'value', v)} options={HOUR_OPTIONS} size="small" style={{ width: 85 }} />
                    <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)' }}>更新一次</span>
                  </Space>
                )}

                {customRules.length > 1 && (
                  <Button type="link" danger size="small" onClick={() => handleRemoveRule(rule.id)} style={{ padding: '0 4px', height: 'auto' }}>
                    删除
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="dashed" size="small" block onClick={handleAddRule} icon={<PlusOutlined />} style={{ marginTop: 10 }}>
            添加自定义规则
          </Button>
        </div>
      )}
    </div>
  );
}

// ============ 专题/重点源 - 目标平台选项 ============

const SCOPE_PLATFORM_OPTIONS = [
  { value: '抖音', label: '抖音' },
  { value: '微博', label: '微博' },
  { value: '小红书', label: '小红书' },
  { value: '快手', label: '快手' },
  { value: 'B站', label: 'B站' },
  { value: '知乎', label: '知乎' },
];

import QuotaEstimatePanel, { ValidationResult } from './QuotaEstimatePanel';

// ============ 额度预估与翻页选项 ============

const COLLECT_PAGE_OPTIONS = [
  { value: '1', label: '前1页' },
  { value: '3', label: '前3页' },
  { value: '5', label: '前5页' },
  { value: '10', label: '前10页' },
];

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
  frequency: { mode: string; value: string; dateRange?: any; customRules?: any[] };
  submitting: boolean;
  onScopeTypeChange: (v: ScopeType) => void;
  onFrequencyChange: (v: any) => void;
  shakeTrackDays: boolean;
  onShakeTrackDays: (v: boolean) => void;
  isEditMode: boolean;
  scopePlatforms: string[];
  setScopePlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  scopePlatformPages: Record<string, string>;
  setScopePlatformPages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  linkPlatformPages: Record<string, string>;
  setLinkPlatformPages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateResult: any;
  setValidateResult: (v: any) => void;
  linkValidation: any;
  setLinkValidation: (v: any) => void;
  linkText: string;
  setLinkText: (v: string) => void;
  linkPlatforms: string[];
  setLinkPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
  linksTableData: any[];
  setLinksTableData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedDataCount: number | null;
  setSelectedDataCount: (v: number | null) => void;
  truncationStrategy: 'all' | 'top_n';
  setTruncationStrategy: React.Dispatch<React.SetStateAction<'all' | 'top_n'>>;
  topNCount: number;
  setTopNCount: React.Dispatch<React.SetStateAction<number>>;
  customTopN: number;
  setCustomTopN: React.Dispatch<React.SetStateAction<number>>;
  isOverLimit: boolean;
  blockedPlatform?: string;
  onValidationChange: (res: ValidationResult) => void;
}> = function ({
  form,
  scopeType,
  frequency,
  submitting,
  onScopeTypeChange,
  onFrequencyChange,
  shakeTrackDays,
  onShakeTrackDays,
  isEditMode,
  scopePlatforms,
  setScopePlatforms,
  scopePlatformPages,
  setScopePlatformPages,
  linkPlatformPages,
  setLinkPlatformPages,
  validateResult,
  setValidateResult,
  linkValidation,
  setLinkValidation,
  linkText,
  setLinkText,
  linkPlatforms,
  setLinkPlatforms,
  linksTableData,
  setLinksTableData,
  selectedDataCount,
  setSelectedDataCount,
  truncationStrategy,
  setTruncationStrategy,
  topNCount,
  setTopNCount,
  customTopN,
  setCustomTopN,
  isOverLimit,
  blockedPlatform,
  onValidationChange,
}) {
  const [trackDaysError, setTrackDaysError] = useState(false);
  const [editingId, setEditingId] = useState<string>('');
  const [editingLinkValue, setEditingLinkValue] = useState<string>('');

  const syncPlatforms = useCallback((data: any[]) => {
    const validLinks = data.filter(function (r) { return r.status === 'valid'; });
    const platformsSet = Array.from(new Set(validLinks.map(function (item) { return item.platform; })));
    setLinkPlatforms(platformsSet);
    form.setFieldValue('platforms', platformsSet);
    
    setLinkPlatformPages(function (prev) {
      var nextPages = { ...prev };
      platformsSet.forEach(function (p) {
        if (!nextPages[p]) {
          nextPages[p] = '1';
        }
      });
      return nextPages;
    });
    
    setValidateResult({
      validCount: validLinks.length,
      platforms: platformsSet,
      platformCounts: data.reduce(function (acc, curr) {
        if (curr.status === 'valid') {
          acc[curr.platform] = (acc[curr.platform] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      invalidList: data.filter(function (r) { return r.status === 'invalid'; }).map(function (r) { return r.link; }),
    });
  }, [form, setLinkPlatforms, setLinkPlatformPages, setValidateResult]);

  const handleSaveEditing = useCallback((id: string) => {
    if (editingLinkValue.trim()) {
      const newValidatedItem = validateSingleLink(editingLinkValue);
      setLinksTableData(function (prev) {
        const next = prev.map(function (item) {
          if (item.id === id) {
            return {
              ...item,
              link: newValidatedItem.link,
              platform: newValidatedItem.platform,
              status: newValidatedItem.status
            };
          }
          return item;
        });
        setTimeout(function () { syncPlatforms(next); }, 0);
        return next;
      });
    }
    setEditingId('');
  }, [editingLinkValue, setLinksTableData, syncPlatforms]);

  const handleDeleteLink = useCallback((id: string) => {
    setLinksTableData(function (prev) {
      const next = prev.filter(function (item) { return item.id !== id; });
      setTimeout(function () { syncPlatforms(next); }, 0);
      return next;
    });
  }, [setLinksTableData, syncPlatforms]);

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

  // 关联专题/重点源数据量动态计算
  useEffect(function () {
    if (scopeType === 'topic') {
      setSelectedDataCount(getDataSourceCount('topic', relatedTopicValue));
    } else if (scopeType === 'source') {
      setSelectedDataCount(getDataSourceCount('source', relatedSourceValue));
    } else {
      setSelectedDataCount(null);
    }
  }, [scopeType, relatedTopicValue, relatedSourceValue, setSelectedDataCount]);

  // 当 form 里的 link_list 变化且 linkText 为空时，同步回显链接地址
  const formLinkList = Form.useWatch('link_list', form);
  useEffect(function () {
    if (formLinkList && formLinkList.length > 0 && !linkText) {
      const links = formLinkList.map(function (item: any) { return item.link; }).filter(Boolean);
      setLinkText(links.join('\n'));
    }
  }, [formLinkList, linkText]);

  // 切换采集范围时重置链接文本
  var handleScopeTypeChange = useCallback(function (v: ScopeType) {
    onScopeTypeChange(v);
    setLinkText('');
    setValidateResult(null);
    setLinkValidation('idle');
  }, [onScopeTypeChange]);

  const handleDownloadTemplate = useCallback(function () {
    const csvContent = "\ufeff" + "链接地址\n" +
      "https://weibo.com/1234567890/xyz123\n" +
      "https://www.xiaohongshu.com/explore/5e123456789\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "采集链接导入模板.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('已开始下载导入模板');
  }, []);

  const handleImportFile = useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target?.result as string;
      if (!text) {
        message.error("文件内容为空或读取失败");
        return;
      }

      let parsedLinks: Array<{ link: string; title: string; topic: string }> = [];
      let rawLines: string[] = [];

      if (file.name.endsWith('.csv')) {
        const rows = text.split(/\r?\n/).map(function (r) { return r.trim(); }).filter(Boolean);
        if (rows.length <= 1) {
          message.error("文件有效性校验失败：文件没有有效数据行");
          return;
        }

        const header = rows[0].toLowerCase();
        if (!header.includes("链接") && !header.includes("link") && !header.includes("url")) {
          message.error("文件有效性校验失败：模板格式不正确，缺少“链接地址”列");
          return;
        }

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(',').map(function (c) { return c.trim().replace(/^["']|["']$/g, ''); });
          if (cols[0]) {
            parsedLinks.push({
              link: cols[0],
              title: '',
              topic: ''
            });
            rawLines.push(cols[0]);
          }
        }
      } else {
        const lines = text.split(/\r?\n/).map(function (r) { return r.trim(); }).filter(Boolean);
        lines.forEach(function (line) {
          const cleanLine = line.replace(/^["']|["']$/g, '').trim();
          if (cleanLine) {
            parsedLinks.push({
              link: cleanLine,
              title: '',
              topic: ''
            });
            rawLines.push(cleanLine);
          }
        });
      }

      if (parsedLinks.length === 0) {
        message.error("文件有效性校验失败：未在文件中提取到链接");
        return;
      }

      var newItems = rawLines.map(validateSingleLink);
      setLinksTableData(function (prev) {
        var next = [...prev, ...newItems];
        var seen = new Set();
        var unique = next.filter(function (item) {
          var k = item.link;
          return seen.has(k) ? false : seen.add(k);
        });
        setTimeout(function () { syncPlatforms(unique); }, 0);
        return unique;
      });

      message.success(`导入成功，已在下方表格载入 ${parsedLinks.length} 条链接`);
      e.target.value = '';
    };

    reader.readAsText(file);
  }, [form, setLinksTableData, syncPlatforms]);

  const handleLinkTextChange = useCallback(function (e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLinkText(e.target.value);
  }, [setLinkText]);

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
          <Radio.Group disabled={isEditMode}>
            <Radio value="interaction">互动量更新</Radio>
            <Radio value="comment">评论区采集</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="更新频率" required>
          <FrequencySelector value={frequency} onChange={onFrequencyChange} />
        </Form.Item>


      </div>

      {/* ---- Section 2: 任务对象 ---- */}
      <div className="ct-drawer-section">
        <div className="ct-drawer-section-title">任务对象</div>

        <Form.Item label="采集范围" name="scope_type" rules={[{ required: true, message: '请选择采集范围' }]}>
          <Radio.Group disabled={isEditMode} onChange={function (e) { handleScopeTypeChange(e.target.value); }}>
            <Radio value="topic">专题</Radio>
            <Radio value="source">重点源</Radio>
            <Radio value="other">链接</Radio>
          </Radio.Group>
        </Form.Item>

        {scopeType === 'topic' && (
          <div style={{ marginBottom: 16 }}>
            <Form.Item label="关联专题" name="related_topic" rules={[{ required: true, message: '请选择关联专题' }]} style={{ marginBottom: 0 }}>
              <Select placeholder="请选择关联专题" showSearch optionFilterProp="label" options={TOPIC_OPTIONS} />
            </Form.Item>
            {selectedDataCount === 0 && (
              <div
                className="flex items-center text-xs text-red-500 mt-1.5 bg-transparent"
                style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#ff4d4f', marginTop: 6 }}
              >
                <ExclamationCircleOutlined className="text-red-500 mr-1 text-xs" style={{ color: '#ff4d4f', marginRight: 4, fontSize: 12 }} />
                <span>当前专题/重点源没有数据，请确认是否按照现有配置创建任务。</span>
              </div>
            )}
            {selectedDataCount !== null && selectedDataCount > 0 && (
              <div className="text-xs text-slate-500 mt-1" style={{ textAlign: 'right' }}>
                已匹配到 {selectedDataCount} 篇相关网帖
              </div>
            )}
          </div>
        )}

        {scopeType === 'source' && (
          <div style={{ marginBottom: 16 }}>
            <Form.Item label="关联重点源" name="related_source" rules={[{ required: true, message: '请选择关联重点源' }]} style={{ marginBottom: 0 }}>
              <Select placeholder="请选择关联重点源" showSearch optionFilterProp="label" options={SOURCE_OPTIONS} />
            </Form.Item>
            {selectedDataCount === 0 && (
              <div
                className="flex items-center text-xs text-red-500 mt-1.5 bg-transparent"
                style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#ff4d4f', marginTop: 6 }}
              >
                <ExclamationCircleOutlined className="text-red-500 mr-1 text-xs" style={{ color: '#ff4d4f', marginRight: 4, fontSize: 12 }} />
                <span>当前专题/重点源没有数据，请确认是否按照现有配置创建任务。</span>
              </div>
            )}
            {selectedDataCount !== null && selectedDataCount > 0 && (
              <div className="text-xs text-slate-500 mt-1" style={{ textAlign: 'right' }}>
                已匹配到 {selectedDataCount} 篇相关网帖
              </div>
            )}
          </div>
        )}

        {/* 专题/重点源 - 二级配置区 */}
        {hasSelectedScopeItem && (
          <div className="ct-scope-secondary">
            {/* 采集数据截取策略 (Data Truncation Strategy) */}
            <div style={{ marginBottom: 20, padding: '12px 14px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>采集数据截取策略 (Data Truncation Strategy)</span>
                <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 'normal' }}>平台日配额风控优化</span>
              </div>
              <Radio.Group
                value={truncationStrategy}
                onChange={(e) => setTruncationStrategy(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
              >
                <Radio value="top_n" style={{ alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '-2px' }}>
                    <div style={{ fontWeight: 500, color: '#1890ff', fontSize: '13px' }}>
                      按互动量优先采集 Top N 帖文 <Tag color="blue" style={{ marginLeft: 6, fontSize: 10 }}>推荐</Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '3px' }}>
                      针对所选范围内各平台的存量帖文，按总互动量（点赞+评论+转发）降序排序
                    </div>
                    {truncationStrategy === 'top_n' && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>单平台上限：</span>
                        <Select
                          size="small"
                          value={topNCount}
                          onChange={(v) => setTopNCount(v)}
                          style={{ width: '110px' }}
                          options={[
                            { value: 20, label: '前 20 条' },
                            { value: 50, label: '前 50 条' },
                            { value: 100, label: '前 100 条' },
                            { value: 200, label: '前 200 条' },
                            { value: -1, label: '自定义数值' },
                          ]}
                        />
                        {topNCount === -1 && (
                          <InputNumber
                            size="small"
                            min={1}
                            max={5000}
                            placeholder="条数"
                            value={customTopN}
                            onChange={(v) => setCustomTopN(v || 100)}
                            style={{ width: '80px' }}
                          />
                        )}
                        <span style={{ fontSize: '11px', color: '#52c41a' }}>
                          ✓ 已优化小红书/抖音等高风控平台的日并发负荷
                        </span>
                      </div>
                    )}
                  </div>
                </Radio>
                <Radio value="all" style={{ alignItems: 'flex-start' }}>
                  <div style={{ marginTop: '-2px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-main)' }}>采集全量帖文</span>
                    <span style={{ fontSize: '12px', color: '#fa8c16', marginLeft: '6px' }}>
                      (可能超出特定平台单日并发负荷)
                    </span>
                  </div>
                </Radio>
              </Radio.Group>
            </div>

            <div className="ct-scope-secondary-title">采集配置</div>

            <Form.Item label="追踪天数" required style={{ marginBottom: 20 }}>
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

            {/* 额度预估与单日风控校验看板 */}
            {scopePlatforms.length > 0 && (
              <QuotaEstimatePanel
                scopeLabel={scopeLabel}
                taskType={taskTypeValue}
                platformPageConfig={taskTypeValue === 'comment' ? scopePlatformPages : {}}
                frequency={frequency}
                platforms={scopePlatforms}
                selectedScopeId={scopeType === 'topic' ? relatedTopicValue : relatedSourceValue}
                truncationStrategy={truncationStrategy}
                topNCount={topNCount === -1 ? customTopN : topNCount}
                onValidationChange={onValidationChange}
              />
            )}
          </div>
        )}

        {scopeType === 'other' && (
          <div className="ct-scope-secondary">
            <div className="ct-scope-secondary-title">采集配置</div>

            {/* 流式批量链接录入 */}
            <Form.Item label="链接地址" required>
              <input
                type="file"
                id="collect-link-file-import"
                accept=".csv,.txt"
                style={{ display: 'none' }}
                onChange={handleImportFile}
              />
              <div className="ct-link-textarea-wrapper">
                <Input.TextArea
                  value={linkText}
                  onChange={handleLinkTextChange}
                  placeholder="支持批量粘贴链接，每行一个或以换行分隔"
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  className="ct-link-textarea"
                />
                <div className="ct-link-textarea-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <Space size={12}>
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, height: 'auto', fontSize: 12 }}
                      onClick={handleDownloadTemplate}
                    >
                      文件模板下载
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, height: 'auto', fontSize: 12 }}
                      onClick={function () { document.getElementById('collect-link-file-import')?.click(); }}
                    >
                      导入文件
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, height: 'auto', fontSize: 12, color: '#fa8c16' }}
                      onClick={function () {
                        const mock20 = Array.from({ length: 20 }, (_, i) => `https://www.xiaohongshu.com/explore/item_test_${i + 1}`).join('\n');
                        setLinkText(mock20);
                      }}
                    >
                      快速填入20条小红书链接
                    </Button>
                  </Space>
                  <Button
                    type="primary"
                    size="small"
                    disabled={!linkText.trim()}
                    onClick={function () {
                      var lines = linkText.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
                      var newItems = lines.map(validateSingleLink);
                      setLinksTableData(function (prev) {
                        var next = [...prev, ...newItems];
                        var seen = new Set();
                        var unique = next.filter(function (item) {
                          var k = item.link;
                          return seen.has(k) ? false : seen.add(k);
                        });
                        setTimeout(function () { syncPlatforms(unique); }, 0);
                        return unique;
                      });
                      setLinkText('');
                    }}
                    style={{ backgroundColor: '#1890FF', borderColor: '#1890FF' }}
                  >
                    解析并导入
                  </Button>
                </div>
              </div>
            </Form.Item>

            {linksTableData.length > 0 && (
              <div className="ct-link-table-wrapper" style={{ marginTop: 16, marginBottom: 16 }}>
                <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 'bold', color: 'rgba(0,0,0,0.65)' }}>已导入链接明细：</div>
                <Table
                  dataSource={linksTableData}
                  rowKey="id"
                  size="small"
                  pagination={{ pageSize: 5, size: 'small', showSizeChanger: false }}
                  columns={[
                    {
                      title: '链接',
                      dataIndex: 'link',
                      key: 'link',
                      ellipsis: true,
                      render: function (text: string, record: any) {
                        if (editingId === record.id) {
                          return (
                            <Input
                              value={editingLinkValue}
                              onChange={function (e) { setEditingLinkValue(e.target.value); }}
                              onBlur={function () { handleSaveEditing(record.id); }}
                              autoFocus
                              size="small"
                              style={{ width: '100%' }}
                            />
                          );
                        }
                        return <span style={{ fontSize: 12, wordBreak: 'break-all' }}>{text}</span>;
                      }
                    },
                    {
                      title: '平台',
                      dataIndex: 'platform',
                      key: 'platform',
                      width: 150,
                      render: function (platform: string) {
                        const isBlockedXhs = isOverLimit && (blockedPlatform === '小红书' || blockedPlatform === 'xhs') && (platform === '小红书' || platform === 'xhs');
                        return (
                          <Space size={4} wrap>
                            <Tag color={platform === '其他' ? 'default' : 'blue'} style={{ margin: 0 }}>{platform}</Tag>
                            {isBlockedXhs && (
                              <Tag color="warning" style={{ margin: 0, fontSize: 11, border: '1px solid #ffd591', color: '#d46b08', background: '#fff7e6' }}>
                                小红书 · 待调减
                              </Tag>
                            )}
                          </Space>
                        );
                      }
                    },
                    {
                      title: '有效性',
                      dataIndex: 'status',
                      key: 'status',
                      width: 90,
                      render: function (status: string) {
                        return status === 'valid' ? (
                          <Badge status="success" text="有效" />
                        ) : (
                          <Badge status="error" text="无效" />
                        );
                      }
                    },
                    {
                      title: '操作',
                      key: 'action',
                      width: 100,
                      render: function (_: any, record: any) {
                        return (
                          <Space size={8}>
                            <a 
                              onClick={function () { 
                                setEditingId(record.id); 
                                setEditingLinkValue(record.link); 
                              }}
                              style={{ fontSize: 13 }}
                            >
                              修改
                            </a>
                            <a 
                              onClick={function () { handleDeleteLink(record.id); }} 
                              style={{ color: '#ff4d4f', fontSize: 13 }}
                            >
                              删除
                            </a>
                          </Space>
                        );
                      }
                    }
                  ]}
                />
              </div>
            )}

            {/* 评论区采集时，按平台配置采集页数 */}
            {taskTypeValue === 'comment' && linkPlatforms && linkPlatforms.length > 0 && (
              <div className="ct-platform-page-config">
                <div className="ct-platform-page-config-title">各平台采集页数</div>
                {linkPlatforms.map(function (platform: string) {
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

            {/* 额度预估与单日风控校验看板（包含评论区采集与互动量更新） */}
            {((taskTypeValue === 'comment' && linkPlatforms && linkPlatforms.length > 0) || 
              (taskTypeValue === 'interaction' && validateResult && validateResult.validCount > 0)) && (
              <QuotaEstimatePanel
                scopeLabel="链接"
                taskType={taskTypeValue}
                platformPageConfig={taskTypeValue === 'comment' ? linkPlatformPages : {}}
                linkCount={validateResult?.validCount || 0}
                platformCounts={validateResult?.platformCounts}
                frequency={frequency}
                platforms={linkPlatforms}
                onValidationChange={onValidationChange}
              />
            )}
          </div>
        )}
      </div>

    </Form>
  );
};

// ============ 主组件：CollectTaskDrawer ============

const CollectTaskDrawer: React.FC<CollectTaskDrawerProps> = function ({ open, title = '新建采集任务', isEditMode = false, onClose, onSubmit, initialValues }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [drawerScopeType, setDrawerScopeType] = useState<ScopeType>('topic');
  const [drawerFrequency, setDrawerFrequency] = useState<{
    mode: string;
    value: string;
    dateRange?: any;
    customRules?: any[];
  }>({
    mode: 'hour',
    value: '2',
    dateRange: null,
    customRules: [],
  });
  const [shakeTrackDays, setShakeTrackDays] = useState(false);

  // 提升的状态声明
  const [scopePlatforms, setScopePlatforms] = useState<string[]>([]);
  const [scopePlatformPages, setScopePlatformPages] = useState<Record<string, string>>({});
  const [linkPlatformPages, setLinkPlatformPages] = useState<Record<string, string>>({});
  const [linkText, setLinkText] = useState('');
  const [linkValidation, setLinkValidation] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validateResult, setValidateResult] = useState<{ validCount: number; platforms: string[]; platformCounts: Record<string, number>; invalidList: string[] } | null>(null);
  const [linkPlatforms, setLinkPlatforms] = useState<string[]>([]);
  const [linksTableData, setLinksTableData] = useState<any[]>([]);
  const [selectedDataCount, setSelectedDataCount] = useState<number | null>(null);

  // 新增：单日限额风控与截取策略状态
  const [truncationStrategy, setTruncationStrategy] = useState<'all' | 'top_n'>('top_n');
  const [topNCount, setTopNCount] = useState<number>(100);
  const [customTopN, setCustomTopN] = useState<number>(100);
  const [isOverLimit, setIsOverLimit] = useState<boolean>(false);
  const [blockedPlatform, setBlockedPlatform] = useState<string | undefined>(undefined);

  const handleValidationChange = useCallback((res: ValidationResult) => {
    setIsOverLimit(!res.isValid);
    setBlockedPlatform(res.blockedPlatform);
  }, []);

  // open 变为 true 时，如果有 initialValues 则填充
  useEffect(function () {
    if (open) {
      if (initialValues) {
        // 设置 scopeType
        if (initialValues.scope_type) {
          setDrawerScopeType(initialValues.scope_type);
        }
        // 回显平台
        if (initialValues.platforms && initialValues.scope_type === 'other') {
          setLinkPlatforms(initialValues.platforms);
        }
        // 回显平台页数
        if (initialValues.platform_pages) {
          if (initialValues.scope_type === 'other') {
            setLinkPlatformPages(initialValues.platform_pages);
          } else {
            setScopePlatformPages(initialValues.platform_pages);
          }
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
          // 回显链接表格数据
          if (initialValues.link_list && initialValues.link_list.length > 0) {
            var initialLinks = initialValues.link_list.map(function (item: any) {
              return validateSingleLink(item.link);
            });
            setLinksTableData(initialLinks);
            
            var platformsSet = Array.from(new Set(initialLinks.map(function (item) { return item.platform; })));
            setValidateResult({
              validCount: initialLinks.length,
              platforms: platformsSet,
              platformCounts: initialLinks.reduce(function (acc, curr) {
                if (curr.status === 'valid') {
                  acc[curr.platform] = (acc[curr.platform] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>),
              invalidList: [],
            });
          } else {
            setLinksTableData([]);
          }

          // 回显频率与时间范围
          var freqMode = initialValues.frequency_mode || 'hour';
          var freqVal = initialValues.frequency_value || '2';
          var customRules = initialValues.frequency_custom_rules || [];
          var dateRange = null;
          if (initialValues.start_date && initialValues.end_date) {
            dateRange = [dayjs(initialValues.start_date), dayjs(initialValues.end_date)];
          }

          setDrawerFrequency({
            mode: freqMode,
            value: freqVal,
            dateRange: dateRange,
            customRules: customRules.map(function (rule: any) {
              return {
                id: rule.id || Math.random().toString(36).slice(2, 9),
                dateRange: rule.start_date && rule.end_date ? [dayjs(rule.start_date), dayjs(rule.end_date)] : null,
                mode: rule.mode || 'hour',
                value: rule.value || (rule.mode === 'day' ? '08:00' : '2'),
              };
            }),
          });
          form.setFieldsValue(valuesToSet);
        }, 100);
      } else {
        // 无 initialValues 时重置
        setDrawerScopeType('topic');
        setDrawerFrequency({ mode: 'hour', value: '2', dateRange: null, customRules: [] });
        setScopePlatforms([]);
        setScopePlatformPages({});
        setLinkPlatformPages({});
        setLinkText('');
        setValidateResult(null);
        setLinkValidation('idle');
        setLinkPlatforms([]);
        setLinksTableData([]);
        setTimeout(function () {
          form.resetFields();
        }, 0);
      }
    } else {
      // open 变为 false 时重置
      form.resetFields();
      setDrawerScopeType('topic');
      setDrawerFrequency({ mode: 'hour', value: '2', dateRange: null, customRules: [] });
      setScopePlatforms([]);
      setScopePlatformPages({});
      setLinkPlatformPages({});
      setLinkText('');
      setValidateResult(null);
      setLinkValidation('idle');
      setLinkPlatforms([]);
      setLinksTableData([]);
    }
  }, [open, initialValues, form]);

  const handleClose = useCallback(function () {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(function () {
    var scopeType = form.getFieldValue('scope_type');
    // 追踪天数校验拦截（仅在非“链接”采集时校验）
    if (scopeType !== 'other') {
      var trackDays = form.getFieldValue('track_days');
      if (trackDays === undefined || trackDays === null || trackDays > 7) {
        setShakeTrackDays(true);
        setTimeout(function () { setShakeTrackDays(false); }, 600);
        message.error('请检查追踪天数，允许范围 0-7 天');
        return;
      }
    } else {
      var validLinks = linksTableData.filter(function (item) { return item.status === 'valid'; });
      if (validLinks.length === 0) {
        message.error('请在下方表格中录入或修改至少一条有效链接');
        return;
      }
    }

    // 先检查频率与时间范围的有效性
    if (drawerFrequency.mode !== 'custom') {
      if (!drawerFrequency.dateRange || !drawerFrequency.dateRange[0] || !drawerFrequency.dateRange[1]) {
        message.error('请选择任务采集的时间范围');
        return;
      }
    } else {
      if (!drawerFrequency.customRules || drawerFrequency.customRules.length === 0) {
        message.error('请至少添加一条自定义频次规则');
        return;
      }
      for (var i = 0; i < drawerFrequency.customRules.length; i++) {
        var rule = drawerFrequency.customRules[i];
        if (!rule.dateRange || !rule.dateRange[0] || !rule.dateRange[1]) {
          message.error('请完善自定义规则第 ' + (i + 1) + ' 行的时间范围');
          return;
        }
        if (!rule.value) {
          message.error('请完善自定义规则第 ' + (i + 1) + ' 行的频次数值');
          return;
        }
      }
    }

    const executeSubmit = function () {
      form.validateFields().then(function (values) {
        setSubmitting(true);
        setTimeout(function () {
          setSubmitting(false);
          // 如果是链接类型，根据已识别的 platforms 状态写入
          let finalPlatforms = values.platforms || [];
          let finalLinkList = values.link_list || [];
          if (values.scope_type === 'other') {
            finalPlatforms = linkPlatforms.length > 0 ? linkPlatforms : ['链接'];
            finalLinkList = linksTableData.filter(function (item) { return item.status === 'valid'; }).map(function (item) {
              return { link: item.link, title: '', topic: '' };
            });
          }

          const pageConfig = values.scope_type === 'other' ? linkPlatformPages : scopePlatformPages;

          let startStr = '';
          let endStr = '';
          let finalFrequencyText = '';
          let finalCustomRules: any[] = [];

          if (drawerFrequency.mode === 'custom') {
            finalCustomRules = (drawerFrequency.customRules || []).map(function (r) {
              var sDate = r.dateRange && r.dateRange[0] ? r.dateRange[0].format('YYYY-MM-DD') : '';
              var eDate = r.dateRange && r.dateRange[1] ? r.dateRange[1].format('YYYY-MM-DD') : '';
              return {
                id: r.id,
                start_date: sDate,
                end_date: eDate,
                mode: r.mode,
                value: r.value,
              };
            });

            // 任务的时间跨度
            var startDates = finalCustomRules.map(function (r) { return r.start_date; }).filter(Boolean);
            var endDates = finalCustomRules.map(function (r) { return r.end_date; }).filter(Boolean);
            if (startDates.length > 0) {
              startDates.sort();
              startStr = startDates[0];
            }
            if (endDates.length > 0) {
              endDates.sort();
              endStr = endDates[endDates.length - 1];
            }

            finalFrequencyText = '自定义 (' + finalCustomRules.length + '条规则)';
          } else {
            if (drawerFrequency.dateRange && drawerFrequency.dateRange[0] && drawerFrequency.dateRange[1]) {
              startStr = drawerFrequency.dateRange[0].format('YYYY-MM-DD');
              endStr = drawerFrequency.dateRange[1].format('YYYY-MM-DD');
            }
            finalFrequencyText = drawerFrequency.mode === 'hour' ? '每' + drawerFrequency.value + '小时' : '每天' + drawerFrequency.value;
          }

          // 回传表单 values
          onSubmit?.({
            ...values,
            link_list: finalLinkList,
            platforms: finalPlatforms,
            platform_pages: pageConfig,
            start_date: startStr,
            end_date: endStr,
            frequency: finalFrequencyText,
            frequency_mode: drawerFrequency.mode,
            frequency_value: drawerFrequency.mode === 'custom' ? '' : drawerFrequency.value,
            frequency_custom_rules: finalCustomRules,
          });
          message.success('任务创建成功');
          onClose();
        }, 1000);
      });
    };

    // 单日限额风控拦截校验
    if (isOverLimit) {
      message.error(`该任务在【${blockedPlatform || '小红书'}】平台的预计日采集频次已超出当前系统单日并发配额，无法提交`);
      return;
    }

    if ((scopeType === 'topic' || scopeType === 'source') && selectedDataCount === 0) {
      Modal.confirm({
        title: '确认创建任务？',
        content: '当前选择的关联目录暂无舆情数据，系统将无法立即执行采集，是否仍按照现有配置创建？',
        okText: '确认创建',
        cancelText: '取消',
        onOk() {
          executeSubmit();
        },
      });
      return;
    }

    executeSubmit();
  }, [form, onSubmit, onClose, drawerFrequency, linkPlatformPages, scopePlatformPages, linkPlatforms, linksTableData, selectedDataCount, isOverLimit, blockedPlatform]);

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
          <Button
            type="primary"
            loading={submitting}
            disabled={isOverLimit}
            onClick={handleSubmit}
            style={{
              backgroundColor: isOverLimit ? '#f5f5f5' : '#1890FF',
              borderColor: isOverLimit ? '#d9d9d9' : '#1890FF',
              color: isOverLimit ? 'rgba(0, 0, 0, 0.25)' : '#fff',
              cursor: isOverLimit ? 'not-allowed' : 'pointer',
            }}
          >
            {isOverLimit
              ? `无法提交：${blockedPlatform || '小红书'}超出单日配额`
              : (isEditMode ? '保存修改' : '确定创建任务')}
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
        isEditMode={isEditMode}
        scopePlatforms={scopePlatforms}
        setScopePlatforms={setScopePlatforms}
        scopePlatformPages={scopePlatformPages}
        setScopePlatformPages={setScopePlatformPages}
        linkPlatformPages={linkPlatformPages}
        setLinkPlatformPages={setLinkPlatformPages}
        validateResult={validateResult}
        setValidateResult={setValidateResult}
        linkValidation={linkValidation}
        setLinkValidation={setLinkValidation}
        linkText={linkText}
        setLinkText={setLinkText}
        linkPlatforms={linkPlatforms}
        setLinkPlatforms={setLinkPlatforms}
        linksTableData={linksTableData}
        setLinksTableData={setLinksTableData}
        selectedDataCount={selectedDataCount}
        setSelectedDataCount={setSelectedDataCount}
        truncationStrategy={truncationStrategy}
        setTruncationStrategy={setTruncationStrategy}
        topNCount={topNCount}
        setTopNCount={setTopNCount}
        customTopN={customTopN}
        setCustomTopN={setCustomTopN}
        isOverLimit={isOverLimit}
        blockedPlatform={blockedPlatform}
        onValidationChange={handleValidationChange}
      />
    </Drawer>
  );
};

export default CollectTaskDrawer;
