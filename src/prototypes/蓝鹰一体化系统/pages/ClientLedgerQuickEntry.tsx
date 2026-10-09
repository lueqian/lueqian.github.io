import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Input,
  Button,
  Tag,
  Table,
  DatePicker,
  Select,
  Alert,
  Progress,
  Modal,
  Result,
  Tooltip,
  Popconfirm,
  Segmented,
  message,
  Steps,
} from 'antd';
import {
  DesktopOutlined,
  LockOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  WeiboOutlined,
  WechatOutlined,
  VideoCameraOutlined,
  BookOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  FileExcelOutlined,
  ArrowLeftOutlined,
  CameraOutlined,
  DownloadOutlined,
  UserOutlined,
  CodeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;

// ==================== 1. 类型定义 ====================

export interface ParsedLedgerItem {
  key: string;
  id: string;
  url: string;
  platform: 'weibo' | 'douyin' | 'xiaohongshu' | 'weixin' | 'toutiao';
  platformName: string;
  title: string;
  author: string;
  publishTime: string;
  isDuplicate: boolean; // 是否重复（将覆盖旧台账）
  disposalStatus: 'pending' | 'disposed'; // 处置状态：仅未处置 / 已处置
  likes: number;
  comments: number;
  shares: number;
  evidenceHash: string; // 固证存证 SHA-256
}

export interface ClientLedgerQuickEntryProps {
  taskId?: string;
  taskName?: string;
  isTaskLocked?: boolean;
  onClose?: () => void;
  onSyncSuccess?: (records: ParsedLedgerItem[], taskInfo?: { id: string; name: string }) => void;
  onNavigateToTask?: (taskId: string) => void;
  showBackButton?: boolean;
  onBackToWorkbench?: () => void;
  isStandalone?: boolean;
}

// 供选择的重庆源头防控专项任务库
export const CQ_SPECIAL_TASKS = [
  { id: 't1', code: 'YZ-0801', name: '渝中宝马撞人事件源头防控处置专项', dept: '渝中区分局', ledgerCount: 18 },
  { id: 't2', code: 'PS-0728', name: '盘溪市场强拆涉稳舆情化解专项', dept: '江北区分局', ledgerCount: 24 },
  { id: 't3', code: 'CQ-0715', name: '重庆燃气费用异常网络诉求处置专项', dept: '市局舆情总队', ledgerCount: 42 },
  { id: 't4', code: 'DZ-0715', name: '大渡口中考舞弊网络谣言专项整治', dept: '大渡口区分局', ledgerCount: 15 },
  { id: 't5', code: 'HA-0523', name: '高校涉稳舆情专项巡查与化解行动', dept: '沙坪坝区分局', ledgerCount: 31 },
];

// ==================== 2. Mock 预设与社媒色彩规范 ====================

const PLATFORM_CONFIG: Record<
  string,
  { name: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  weibo: {
    name: '微博',
    color: '#eb2f96',
    bg: '#fff0f6',
    border: '#ffadd2',
    icon: <WeiboOutlined />,
  },
  douyin: {
    name: '抖音',
    color: '#ffffff',
    bg: '#161823', // 经典黑底白字
    border: '#2f3242',
    icon: <VideoCameraOutlined style={{ color: '#00f2fe' }} />,
  },
  xiaohongshu: {
    name: '小红书',
    color: '#ffffff',
    bg: '#ff2442',
    border: '#e01c37',
    icon: <BookOutlined />,
  },
  weixin: {
    name: '微信',
    color: '#ffffff',
    bg: '#07c160',
    border: '#059e4f',
    icon: <WechatOutlined />,
  },
  toutiao: {
    name: '头条',
    color: '#ffffff',
    bg: '#f04142',
    border: '#d73435',
    icon: <GlobalOutlined />,
  },
};

// 预设测试链接
const SAMPLE_URLS_3 = [
  'https://weibo.com/7382910482/OeW831k9A',
  'https://v.douyin.com/iJkl981zQ/',
  'https://www.xiaohongshu.com/discovery/item/66d812abc90',
].join('\n');

const SAMPLE_URLS_OVERFLOW = Array.from({ length: 32 }, (_, i) => {
  const platforms = [
    `https://weibo.com/394819283/OeW${1000 + i}`,
    `https://v.douyin.com/ZMsjQ${200 + i}/`,
    `https://www.xiaohongshu.com/discovery/item/66c${300 + i}`,
    `https://mp.weixin.qq.com/s/sample_token_${400 + i}`,
    `https://www.toutiao.com/article/719283${500 + i}/`,
  ];
  return platforms[i % platforms.length];
}).join('\n');

const SAMPLE_URLS_28 = [
  'https://weibo.com/7382910482/OeW831k9A', // 重复链接（用于覆盖演示）
  'https://v.douyin.com/iJkl981zQ/',
  'https://www.xiaohongshu.com/discovery/item/66d812abc90',
  'https://mp.weixin.qq.com/s/article_cq_env_202609_01',
  'https://www.toutiao.com/article/72819203810291',
  'https://v.douyin.com/ZMsjQ882L/',
  'https://www.xiaohongshu.com/discovery/item/66e921bcd81',
  'https://mp.weixin.qq.com/s/article_cq_safe_202609_02',
  'https://weibo.com/5682947102/Nf82Ka991',
  'https://v.douyin.com/kNm721aB/',
  'https://www.xiaohongshu.com/discovery/item/66f034cde72',
  'https://mp.weixin.qq.com/s/article_traffic_202609_03',
  'https://weibo.com/9012384712/Qz8102La',
  'https://v.douyin.com/pLq291bC/',
  'https://www.xiaohongshu.com/discovery/item/66a125def63',
  'https://mp.weixin.qq.com/s/article_notice_202609_04',
  'https://www.toutiao.com/article/73918209182711',
  'https://v.douyin.com/qRs832cD/',
  'https://www.xiaohongshu.com/discovery/item/66b236efg54',
  'https://mp.weixin.qq.com/s/article_report_202609_05',
  'https://weibo.com/3948192031/Ty71290X',
  'https://v.douyin.com/rTu943dE/',
  'https://www.xiaohongshu.com/discovery/item/66c347fgh43',
  'https://mp.weixin.qq.com/s/article_alert_202609_06',
  'https://weibo.com/2837461928/Vx60189W',
  'https://v.douyin.com/sUv054eF/',
  'https://www.xiaohongshu.com/discovery/item/66d458ghi32',
  'https://mp.weixin.qq.com/s/article_trend_202609_07',
].join('\n');

// ==================== 3. 核心组件实现 ====================

export const ClientLedgerQuickEntry: React.FC<ClientLedgerQuickEntryProps> = ({
  taskId: initialTaskId,
  taskName: initialTaskName,
  isTaskLocked = false,
  onClose,
  onSyncSuccess,
  onNavigateToTask,
  showBackButton = false,
  onBackToWorkbench,
}) => {
  // ---------- 专项任务选择状态 ----------
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => initialTaskId || 't1');
  const [selectedTaskName, setSelectedTaskName] = useState<string>(() => {
    if (initialTaskName) return initialTaskName;
    const found = CQ_SPECIAL_TASKS.find((t) => t.id === (initialTaskId || 't1'));
    return found ? found.name : '渝中宝马撞人事件源头防控处置专项';
  });

  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId);
      if (initialTaskName) {
        setSelectedTaskName(initialTaskName);
      } else {
        const found = CQ_SPECIAL_TASKS.find((t) => t.id === initialTaskId);
        if (found) setSelectedTaskName(found.name);
      }
    }
  }, [initialTaskId, initialTaskName]);

  // ---------- 状态控制：三步向导 ----------
  const [currentStep, setCurrentStep] = useState<number>(0);

  // ---------- 步骤 1：录入与 30 条上限 ----------
  const [entryTab, setEntryTab] = useState<'text' | 'excel'>('text');
  const [inputText, setInputText] = useState<string>(SAMPLE_URLS_28);

  const parsedUrlList = useMemo(() => {
    const lines = inputText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const extracted: string[] = [];
    const urlRegex = /(https?:\/\/[^\s\u4e00-\u9fa5]+)/gi;
    lines.forEach((line) => {
      const matches = line.match(urlRegex);
      if (matches && matches.length > 0) {
        matches.forEach((m) => extracted.push(m.trim()));
      } else if (line.startsWith('http://') || line.startsWith('https://')) {
        extracted.push(line);
      }
    });
    return extracted.length > 0 ? extracted : lines;
  }, [inputText]);

  const urlCount = parsedUrlList.length;
  const isOverLimit = urlCount > 30;

  // 正则一键提取纯链接
  const handleSanitizeUrls = () => {
    if (urlCount === 0) return;
    setInputText(parsedUrlList.join('\n'));
    message.success(`已提取 ${urlCount} 条有效链接`);
  };

  // 快捷保留前 30 条
  const handleKeepFirst30 = () => {
    const trimmed = parsedUrlList.slice(0, 30);
    setInputText(trimmed.join('\n'));
    message.success('已裁剪保留前 30 条链接');
  };

  // 模拟 Excel 导入
  const handleSimulateExcelUpload = () => {
    message.loading({ content: '正在读取 Excel 链接...', key: 'excel_upload' });
    setTimeout(() => {
      setInputText(SAMPLE_URLS_28);
      setEntryTab('text');
      message.success({ content: '已成功从 Excel 导入 28 条链接', key: 'excel_upload' });
    }, 600);
  };

  // ---------- 步骤 2：仿真解析 ----------
  const [parseProgress, setParseProgress] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const startExtractionProcess = () => {
    if (urlCount === 0) {
      message.warning('请先输入帖文链接');
      return;
    }
    if (isOverLimit) {
      message.error('超出 30 条限制，请先删减');
      return;
    }

    setCurrentStep(1);
    setParseProgress(0);
    setTerminalLogs([
      `[${dayjs().format('HH:mm:ss')}] 初始化客户端取证沙箱环境...`,
      `[${dayjs().format('HH:mm:ss')}] 正在连接专线网络，目标源头防控专项：【${selectedTaskName}】`,
    ]);

    const logMilestones = [
      {
        progress: 25,
        log: `[${dayjs().format('HH:mm:ss')}] 正在抓取多平台帖文标题、正文及互动数据...`,
      },
      {
        progress: 55,
        log: `[${dayjs().format('HH:mm:ss')}] 正在截取 4K 全景固证快照...`,
      },
      {
        progress: 80,
        log: `[${dayjs().format('HH:mm:ss')}] 比对历史台账：命中 1 条已有链接，将执行覆盖入库`,
      },
      {
        progress: 100,
        log: `[${dayjs().format('HH:mm:ss')}] SHA-256 哈希存证完成，数据解析就绪！`,
      },
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logMilestones.length) {
        const item = logMilestones[currentIdx];
        setParseProgress(item.progress);
        setTerminalLogs((prev) => [...prev, item.log]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          generateParsedTableData();
          setCurrentStep(2);
        }, 250);
      }
    }, 280);
  };

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // ---------- 步骤 3：核对表与一键同步 ----------
  const [tableData, setTableData] = useState<ParsedLedgerItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [previewItem, setPreviewItem] = useState<ParsedLedgerItem | null>(null);

  const generateParsedTableData = () => {
    const items: ParsedLedgerItem[] = parsedUrlList.map((url, index) => {
      let platform: ParsedLedgerItem['platform'] = 'weibo';
      let platformName = '微博';
      let author = '@渝州观察';
      let title = '渝中区涉事宝马车通行碰撞情况通报，有关部门迅速现场处置';
      let likes = 2400 + index * 180;
      let comments = 480 + index * 35;
      let shares = 210 + index * 15;

      if (url.includes('douyin')) {
        platform = 'douyin';
        platformName = '抖音';
        author = '@山城热点';
        title = '现场交通短时滞留实拍视频，网警提醒切勿听信谣传';
        likes = 12500 + index * 620;
        comments = 2140 + index * 95;
        shares = 1820 + index * 70;
      } else if (url.includes('xiaohongshu')) {
        platform = 'xiaohongshu';
        platformName = '小红书';
        author = '@山茶花笔记';
        title = '涉事路段交通整治进展与网民讨论梳理分析';
        likes = 4300 + index * 210;
        comments = 520 + index * 28;
        shares = 390 + index * 18;
      } else if (url.includes('toutiao')) {
        platform = 'toutiao';
        platformName = '头条';
        author = '法治重庆线';
        title = '渝中区交巡与网安联合排查，当事人已依规处理';
        likes = 3100 + index * 140;
        comments = 610 + index * 42;
        shares = 450 + index * 24;
      } else if (url.includes('weixin') || url.includes('mp.weixin')) {
        platform = 'weixin';
        platformName = '微信';
        author = '警务前沿';
        title = '涉事车辆情况官方通报与辟谣澄清说明';
        likes = 1800 + index * 90;
        comments = 290 + index * 14;
        shares = 880 + index * 52;
      }

      const isDuplicate = index === 0;
      if (isDuplicate) {
        title = '【历史已有·覆盖更新】涉事车辆现场旧言论帖文（原台账 LZ-041）';
      }

      const publishTime = dayjs()
        .subtract(index * 35 + 10, 'minute')
        .format('YYYY-MM-DD HH:mm');

      const evidenceHash = `8f4b${Math.random().toString(16).substring(2, 8)}7d8e2f1a${index}b3c4d5e6f7a8b9c0d1e2f3a`;

      return {
        key: `parsed_${index}_${Date.now()}`,
        id: `item_${index + 1}`,
        url,
        platform,
        platformName,
        title,
        author,
        publishTime,
        isDuplicate,
        disposalStatus: 'pending',
        likes,
        comments,
        shares,
        evidenceHash,
      };
    });

    setTableData(items);
  };

  const handleSaveTitle = (key: string) => {
    if (!editingTitle.trim()) {
      message.warning('标题不能为空');
      return;
    }
    setTableData((prev) =>
      prev.map((item) => (item.key === key ? { ...item, title: editingTitle.trim() } : item))
    );
    setEditingKey(null);
    setEditingTitle('');
  };

  const handleDeleteRow = (key: string) => {
    setTableData((prev) => prev.filter((item) => item.key !== key));
  };

  // 最终提交  // 同步结果弹窗与加载态
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [syncSummary, setSyncSummary] = useState<{
    total: number;
    newCount: number;
    overwriteCount: number;
    taskName: string;
    taskId: string;
  }>({ total: 0, newCount: 0, overwriteCount: 0, taskName: '', taskId: '' });

  const handleConfirmSync = () => {
    if (tableData.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const total = tableData.length;
      const overwriteCount = tableData.filter((i) => i.isDuplicate).length;
      const newCount = total - overwriteCount;

      setSyncSummary({
        total,
        newCount,
        overwriteCount,
        taskName: selectedTaskName,
        taskId: selectedTaskId,
      });
      setResultModalOpen(true);

      if (onSyncSuccess) {
        onSyncSuccess(tableData, { id: selectedTaskId, name: selectedTaskName });
      }
    }, 800);
  };

  // 表格列配置
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => (
        <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 12 }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 90,
      render: (plat: ParsedLedgerItem['platform']) => {
        const conf = PLATFORM_CONFIG[plat] || PLATFORM_CONFIG.weibo;
        return (
          <Tag
            icon={conf.icon}
            style={{
              color: conf.color,
              backgroundColor: conf.bg,
              borderColor: conf.border,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              padding: '1px 6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {conf.name}
          </Tag>
        );
      },
    },
    {
      title: '帖文标题与来源',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: ParsedLedgerItem) => {
        const isEditing = editingKey === record.key;

        if (isEditing) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Input
                size="small"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onPressEnter={() => handleSaveTitle(record.key)}
                autoFocus
                style={{ fontSize: 12, borderRadius: 4 }}
              />
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleSaveTitle(record.key)}
                style={{ background: '#1677ff' }}
              />
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  setEditingKey(null);
                  setEditingTitle('');
                }}
              />
            </div>
          );
        }

        return (
          <div
            style={{ padding: '2px 0', cursor: 'pointer' }}
            onDoubleClick={() => {
              setEditingKey(record.key);
              setEditingTitle(record.title);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#1e293b',
                  lineHeight: '1.4',
                }}
              >
                {title}
              </span>
              <EditOutlined
                style={{ color: '#3b82f6', fontSize: 11, opacity: 0.6 }}
                onClick={() => {
                  setEditingKey(record.key);
                  setEditingTitle(record.title);
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 2,
                fontSize: 11,
                color: '#64748b',
              }}
            >
              <Tooltip title={record.url} placement="topLeft">
                <span
                  onClick={() => {
                    navigator.clipboard?.writeText(record.url);
                    message.success('已复制链接');
                  }}
                  style={{
                    color: '#2563eb',
                    fontFamily: 'monospace',
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <LinkOutlined style={{ fontSize: 10 }} /> {record.url}
                </span>
              </Tooltip>
              <span>·</span>
              <span>{record.author}</span>
              <span>·</span>
              <span>赞 {record.likes?.toLocaleString()}</span>
              <span>评 {record.comments?.toLocaleString()}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 140,
      render: (val: string, record: ParsedLedgerItem) => (
        <DatePicker
          size="small"
          showTime
          value={val ? dayjs(val) : null}
          format="YYYY-MM-DD HH:mm"
          onChange={(_, str) => {
            if (typeof str === 'string') {
              setTableData((prev) =>
                prev.map((i) => (i.key === record.key ? { ...i, publishTime: str } : i))
              );
            }
          }}
          style={{ fontSize: 12, width: '100%', borderRadius: 4 }}
          allowClear={false}
        />
      ),
    },
    {
      title: '快照',
      key: 'evidence',
      width: 65,
      align: 'center' as const,
      render: (_: any, record: ParsedLedgerItem) => (
        <Button
          size="small"
          type="text"
          icon={<CameraOutlined style={{ color: '#2563eb' }} />}
          onClick={() => setPreviewItem(record)}
          style={{ fontSize: 12 }}
        >
          查看
        </Button>
      ),
    },
    {
      title: '入库模式',
      dataIndex: 'isDuplicate',
      key: 'isDuplicate',
      width: 90,
      align: 'center' as const,
      render: (isDup: boolean) =>
        isDup ? (
          <Tag color="orange" style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>
            覆盖旧数据
          </Tag>
        ) : (
          <Tag color="success" style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>
            新增入库
          </Tag>
        ),
    },
    {
      title: '处置状态',
      dataIndex: 'disposalStatus',
      key: 'disposalStatus',
      width: 85,
      align: 'center' as const,
      render: (status: 'pending' | 'disposed', record: ParsedLedgerItem) => (
        <Select
          size="small"
          value={status}
          onChange={(newVal) =>
            setTableData((prev) =>
              prev.map((i) => (i.key === record.key ? { ...i, disposalStatus: newVal } : i))
            )
          }
          style={{ width: '75px', borderRadius: 4 }}
          options={[
            {
              value: 'pending',
              label: <span style={{ fontSize: 11, color: '#d97706' }}>未处置</span>,
            },
            {
              value: 'disposed',
              label: <span style={{ fontSize: 11, color: '#059669' }}>已处置</span>,
            },
          ]}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: 35,
      align: 'center' as const,
      render: (_: any, record: ParsedLedgerItem) => (
        <Popconfirm
          title="移除帖文"
          description="确认移除？"
          onConfirm={() => handleDeleteRow(record.key)}
          okText="移除"
          cancelText="取消"
          okButtonProps={{ danger: true, size: 'small' }}
          cancelButtonProps={{ size: 'small' }}
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            style={{ fontSize: 12, padding: 0 }}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 920,
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
        border: '1px solid #334155',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <style>{`
        .gov-clean-steps .ant-steps-item-title {
          font-size: 13px !important;
          font-weight: 600 !important;
        }
        .gov-clean-terminal {
          background: #0b1120;
          color: #34d399;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          border-radius: 8px;
          border: 1px solid #1e293b;
          height: 150px;
          overflow-y: auto;
          padding: 12px 14px;
        }
      `}</style>

      {/* ==================== 1. 窗口顶级 Chrome 状态栏（极简紧凑） ==================== */}
      <div
        style={{
          background: '#0f172a',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          userSelect: 'none',
        }}
      >
        {/* 左侧：返回工作台（若启用） + 微型交通灯 + 标题 + 绑定专项 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showBackButton && (
            <Button
              type="text"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={onBackToWorkbench}
              style={{ color: '#cbd5e1', fontSize: 12, padding: '0 6px', height: 24 }}
            >
              返回工作台
            </Button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
          </div>

          <div style={{ width: 1, height: 14, background: '#334155', margin: '0 2px' }} />

          <span style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>
            客户端快捷录入与固证
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(30, 58, 138, 0.5)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              padding: '1px 8px',
              borderRadius: 4,
              color: '#93c5fd',
              fontSize: 11,
              fontWeight: 500,
              maxWidth: 240,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <LockOutlined style={{ fontSize: 10 }} />
            {selectedTaskName}
          </span>
        </div>

        {/* 右侧：极简网络与账号状态 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: '#34d399',
              background: 'rgba(6, 78, 59, 0.6)',
              padding: '2px 8px',
              borderRadius: 9999,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            VPN 02:14:37
          </span>

          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            张明
          </span>

          {onClose && (
            <Button
              type="text"
              size="small"
              onClick={onClose}
              icon={<CloseOutlined />}
              style={{ color: '#94a3b8', padding: '0 4px', height: 22 }}
            />
          )}
        </div>
      </div>

      {/* ==================== 2. 纯粹向导流程（无副标题冗余） ==================== */}
      <div
        style={{
          background: '#f8fafc',
          padding: '10px 48px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Steps
          current={currentStep}
          size="small"
          className="gov-clean-steps"
          items={[
            { title: '1. 批量录入' },
            { title: '2. 智能解析' },
            { title: '3. 核对入库' },
          ]}
        />
      </div>

      {/* ==================== 3. 步骤视图主体 ==================== */}
      <div style={{ padding: '16px 20px', background: '#f1f5f9', minHeight: 400 }}>
        
        {/* ---------------- 步骤一：批量录入 ---------------- */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 目标源头防控专项任务选择器 */}
            <div
              style={{
                background: '#ffffff',
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>
                  目标源头防控专项：
                </span>
                {isTaskLocked ? (
                  <Tag color="blue" style={{ fontSize: 12, padding: '3px 10px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <LockOutlined />
                    <span>{selectedTaskName}</span>
                  </Tag>
                ) : (
                  <Select
                    value={selectedTaskId}
                    onChange={(val) => {
                      setSelectedTaskId(val);
                      const found = CQ_SPECIAL_TASKS.find((t) => t.id === val);
                      if (found) setSelectedTaskName(found.name);
                    }}
                    style={{ minWidth: 340, maxWidth: 460 }}
                    options={CQ_SPECIAL_TASKS.map((t) => ({
                      value: t.id,
                      label: (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 500 }}>{t.name}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>{t.dept} · 已有{t.ledgerCount}条</span>
                        </div>
                      ),
                    }))}
                  />
                )}
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                <span>采集提取数据将批量同步至该专项处置台账</span>
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
              }}
            >
              {/* 工具栏：通道切换 + 极简测试按钮 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Segmented
                  value={entryTab}
                  onChange={(val) => setEntryTab(val as any)}
                  options={[
                    { value: 'text', label: '文本提取', icon: <CodeOutlined /> },
                    { value: 'excel', label: 'Excel导入', icon: <FileExcelOutlined /> },
                  ]}
                  size="small"
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <Button
                    size="small"
                    onClick={() => setInputText(SAMPLE_URLS_3)}
                    style={{ fontSize: 11, borderRadius: 4 }}
                  >
                    3条
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setInputText(SAMPLE_URLS_28)}
                    type="primary"
                    ghost
                    style={{ fontSize: 11, borderRadius: 4, fontWeight: 500 }}
                  >
                    28条(含重复)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setInputText(SAMPLE_URLS_OVERFLOW)}
                    danger
                    ghost
                    style={{ fontSize: 11, borderRadius: 4 }}
                  >
                    32条(超限)
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setInputText('')}
                    style={{ fontSize: 11, borderRadius: 4, color: '#94a3b8' }}
                  >
                    清空
                  </Button>
                </div>
              </div>

              {/* 文本输入框 */}
              {entryTab === 'text' && (
                <div>
                  <div style={{ position: 'relative' }}>
                    <TextArea
                      rows={8}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="支持单行一条链接，或直接粘贴含链接的文字..."
                      style={{
                        fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, monospace',
                        fontSize: 12,
                        lineHeight: '1.6',
                        padding: '10px 12px',
                        borderRadius: 6,
                        borderColor: isOverLimit ? '#ef4444' : '#cbd5e1',
                        background: '#fafafa',
                      }}
                    />

                    {/* 仪表盘角标 */}
                    <div style={{ position: 'absolute', right: 10, bottom: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 9999,
                          border: isOverLimit ? '1px solid #fca5a5' : '1px solid #bfdbfe',
                          background: isOverLimit ? '#fef2f2' : '#eff6ff',
                          color: isOverLimit ? '#dc2626' : '#1d4ed8',
                        }}
                      >
                        已识别：{urlCount} / 30 条
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                    <Button
                      size="small"
                      type="link"
                      onClick={handleSanitizeUrls}
                      style={{ fontSize: 11, padding: 0, color: '#2563eb' }}
                    >
                      提取有效链接
                    </Button>
                  </div>
                </div>
              )}

              {/* Excel 导入 */}
              {entryTab === 'excel' && (
                <div style={{ padding: '12px 0', textAlign: 'center' }}>
                  <div
                    onClick={handleSimulateExcelUpload}
                    style={{
                      border: '1px dashed #94a3b8',
                      borderRadius: 8,
                      padding: '24px',
                      background: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    <FileExcelOutlined style={{ fontSize: 32, color: '#10b981', marginBottom: 6 }} />
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                      点击上传 Excel 表格（限首列链接）
                    </div>
                  </div>

                  <div style={{ marginTop: 8, textAlign: 'right' }}>
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => message.success('已下载模版')}
                      style={{ fontSize: 11, padding: 0, color: '#2563eb' }}
                    >
                      下载规范模版.xlsx
                    </Button>
                  </div>
                </div>
              )}

              {/* 30 条超限警告 */}
              {isOverLimit && (
                <div style={{ marginTop: 8 }}>
                  <Alert
                    type="error"
                    showIcon
                    message={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600, fontSize: 12 }}>
                          超出 30 条单次采集上限（当前已输入 {urlCount} 条）
                        </span>
                        <Button
                          size="small"
                          type="primary"
                          danger
                          onClick={handleKeepFirst30}
                          style={{ fontSize: 11, borderRadius: 4 }}
                        >
                          保留前30条
                        </Button>
                      </div>
                    }
                    style={{ borderRadius: 6, padding: '6px 12px' }}
                  />
                </div>
              )}
            </div>

            {/* 步骤一底部栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                同专项下重复链接将自动覆盖
              </span>

              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                disabled={urlCount === 0 || isOverLimit}
                onClick={startExtractionProcess}
                style={{
                  background: urlCount === 0 || isOverLimit ? undefined : '#1677ff',
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '0 24px',
                }}
              >
                提取并上报
              </Button>
            </div>
          </div>
        )}

        {/* ---------------- 步骤二：仿真解析 ---------------- */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '12px 0' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <SyncOutlined spin style={{ color: '#2563eb' }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                    正在解析帖文与固证数据...
                  </span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color: '#2563eb' }}>
                  {parseProgress}%
                </span>
              </div>

              <Progress
                percent={parseProgress}
                status="active"
                strokeColor={{ '0%': '#1677ff', '100%': '#10b981' }}
                showInfo={false}
              />

              {/* 终端日志 */}
              <div className="gov-clean-terminal">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} style={{ lineHeight: '1.6', color: '#a7f3d0' }}>
                    {log}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 步骤三：核对表 ---------------- */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: '#ffffff',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* 极简概览条 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    共 {tableData.length} 条
                  </span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ color: '#059669' }}>
                    新增 {tableData.filter((i) => !i.isDuplicate).length} 条
                  </span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ color: '#d97706' }}>
                    覆盖 1 条
                  </span>
                </div>

                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  双击标题可微调
                </span>
              </div>

              {/* 结构化 Table */}
              <Table
                columns={columns}
                dataSource={tableData}
                rowKey="key"
                size="small"
                pagination={{
                  pageSize: 5,
                  size: 'small',
                  showTotal: (total) => `共 ${total} 条`,
                }}
                rowClassName={(record) => (record.isDuplicate ? 'bg-amber-50/50' : '')}
                style={{ borderRadius: 4, overflow: 'hidden' }}
              />
            </div>

            {/* 步骤三底部操作栏 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setCurrentStep(0)}
                style={{ fontSize: 12, borderRadius: 4 }}
              >
                返回修改
              </Button>

              <Button
                type="primary"
                size="large"
                icon={<CloudUploadOutlined />}
                loading={isSubmitting}
                onClick={handleConfirmSync}
                style={{
                  backgroundColor: '#1677ff',
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '0 24px',
                }}
              >
                确认同步至台账 ({tableData.length} 条)
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* ==================== 4. 固证快照预览 Modal ==================== */}
      <Modal
        open={Boolean(previewItem)}
        onCancel={() => setPreviewItem(null)}
        footer={null}
        width={580}
        centered
        title={
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            固证快照凭证
          </span>
        }
      >
        {previewItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
            {/* 存证证书信息 */}
            <div
              style={{
                background: '#0f172a',
                color: '#cbd5e1',
                padding: '10px 14px',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>哈希存证:</span>
                <span style={{ color: '#34d399' }}>{previewItem.evidenceHash}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>授时时间:</span>
                <span>{previewItem.publishTime} CST</span>
              </div>
            </div>

            {/* 模拟快照 */}
            <div
              style={{
                position: 'relative',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: 14,
                background: '#f8fafc',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  opacity: 0.05,
                  transform: 'rotate(-25deg)',
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#0f172a',
                  userSelect: 'none',
                }}
              >
                公安舆情固证 · 防伪存证
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e2e8f0', paddingBottom: 6, marginBottom: 10 }}>
                  <Tag color="blue">{previewItem.platformName}</Tag>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                    {previewItem.title}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: '1.5' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 6,
                      background: '#ffffff',
                      padding: '6px 10px',
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                    }}
                  >
                    <div>赞: <strong style={{ color: '#2563eb' }}>{previewItem.likes?.toLocaleString()}</strong></div>
                    <div>评: <strong style={{ color: '#d97706' }}>{previewItem.comments?.toLocaleString()}</strong></div>
                    <div>转: <strong style={{ color: '#059669' }}>{previewItem.shares?.toLocaleString()}</strong></div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: 6, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {previewItem.url}
                </span>
                <span style={{ color: '#059669', fontWeight: 500 }}>✓ 验签有效</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== 5. 成功反馈 Result 弹窗 ==================== */}
      <Modal
        open={resultModalOpen}
        footer={null}
        closable={false}
        centered
        width={480}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <Result
          status="success"
          title={<span style={{ fontWeight: 700, fontSize: 17, color: '#0f172a' }}>台账同步成功</span>}
          subTitle={
            <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>
              已向【<strong style={{ color: '#1d4ed8' }}>{syncSummary.taskName}</strong>】同步{' '}
              <strong style={{ color: '#0f172a' }}>{syncSummary.total}</strong> 条记录
              （新增 <strong style={{ color: '#059669' }}>{syncSummary.newCount}</strong> 条，覆盖{' '}
              <strong style={{ color: '#d97706' }}>{syncSummary.overwriteCount}</strong> 条）
            </div>
          }
          extra={[
            <div key="actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              {onNavigateToTask && (
                <Button
                  key="view-ledger"
                  type="primary"
                  size="middle"
                  onClick={() => {
                    setResultModalOpen(false);
                    onNavigateToTask(syncSummary.taskId);
                  }}
                  style={{ background: '#1677ff', borderRadius: 4 }}
                >
                  前往查看【{syncSummary.taskName}】处置台账
                </Button>
              )}
              <Button
                key="continue"
                size="middle"
                onClick={() => {
                  setResultModalOpen(false);
                  setCurrentStep(0);
                  setInputText('');
                  setTableData([]);
                }}
                style={{ borderRadius: 4 }}
              >
                继续录入
              </Button>
              <Button
                key="close"
                size="middle"
                onClick={() => {
                  setResultModalOpen(false);
                  if (onBackToWorkbench) onBackToWorkbench();
                  else if (onClose) onClose();
                }}
                style={{ borderRadius: 4 }}
              >
                {showBackButton ? '返回工作台' : '完成并关闭'}
              </Button>
            </div>,
          ]}
        />
      </Modal>
    </div>
  );
};

export default ClientLedgerQuickEntry;
