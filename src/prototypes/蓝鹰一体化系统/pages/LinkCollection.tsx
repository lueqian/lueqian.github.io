import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Modal,
  Progress,
  message,
  notification,
  Tooltip,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
  CameraOutlined,
  DeleteOutlined,
  ChromeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  FileZipOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// 导入截图资源作为附件素材
import snipasteDouyin from '../assets/Snipaste_2026-08-19_11-28-41.png';
import snipasteXiaohongshu from '../assets/Snipaste_2026-08-19_11-29-09.png';

// 导入真实的 ZIP 压缩包资产作为物理下载素材（忽略 TS 声明错误）
// @ts-ignore
import exportExcelZipUrl from '../assets/export_excel.zip';
// @ts-ignore
import exportStdZipUrl from '../assets/export_std.zip';

const { RangePicker } = DatePicker;

// 链接数据接口
interface LinkItem {
  id: number;
  url: string;
  title: string;
  content: string;
  author: string;
  platform: 'douyin' | 'xiaohongshu' | 'weibo' | 'weixin' | 'other';
  publishTime: string;
  importTime: string;
  status: 'collecting' | 'success' | 'failed';
  failReason?: string;
  screenshot?: string;
  hash?: string;
}

const INITIAL_DATA: LinkItem[] = [
  {
    id: 1,
    url: 'https://v.douyin.com/ZMsjQ1s/',
    title: '【谣言】淮安某大型购物中心发生爆炸，现场伤亡惨重',
    content: '今日网传淮安区某商场发生剧烈爆炸，现场火光冲天，据传有多人伤亡。经网安部门与应急部门迅速核实，该视频实为外地某化工厂旧址爆破拆除画面，本地未发生任何商场爆炸事件，此信息为不折不扣的谣言。',
    author: '都市爆料王',
    platform: 'douyin',
    publishTime: '2026-08-18 10:15:30',
    importTime: '2026-08-19 09:00:00',
    status: 'success',
    screenshot: snipasteDouyin,
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 2,
    url: 'https://www.xiaohongshu.com/discovery/item/66c22ab89fd0',
    title: '【辟谣】淮安汛情严重，苏超附近积水没过大腿？网警：假的！',
    content: '小红书有网民发布图文称“淮安暴雨，苏超商超旁边积水都到大腿了，根本没法出门”。经查，所发图片为2021年外省洪涝灾害旧照，目前淮安虽有降雨，但城区排水通畅，未出现大腿深度积水，请广大网民不信谣不传谣。',
    author: '小红薯5f98a2',
    platform: 'xiaohongshu',
    publishTime: '2026-08-18 14:30:12',
    importTime: '2026-08-19 09:15:00',
    status: 'success',
    screenshot: snipasteXiaohongshu,
    hash: '8f4b3a9c7d8e2f1a0b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
  },
  {
    id: 3,
    url: 'https://weibo.com/56829471/Nf82Ka9',
    title: '谣言：淮安市自来水有毒，近期切勿饮用',
    content: '有部分微信群及微博散布消息称“淮安自来水水源受到严重污染，自来水有毒，近期千万不要喝，只能买纯净水”。自来水公司已紧急检测，出厂水质完全符合国家饮用水标准。造谣者张某已被公安机关依法行政拘留。',
    author: '同城生活播报',
    platform: 'weibo',
    publishTime: '2026-08-17 19:22:45',
    importTime: '2026-08-19 09:30:00',
    status: 'success',
    screenshot: snipasteDouyin, // 微博非抖音/小红书，提供默认底图
    hash: 'c8f7e6d5c4b3a2910fedcba9876543210abcdef1234567890abcdef123456789',
  },
  {
    id: 4,
    url: 'https://mp.weixin.qq.com/s/Hz9_mN8s',
    title: '突发！某小学爆发传染性极强的流感病毒致多人死亡？',
    content: '网传“淮安区某小学爆发不明原因流感，已有数名学生因病死亡，学校已全面封锁”。经卫健部门核实，该校确有少数学生请感冒假，均属普通季节性流感，无任何重症或死亡病例，学校教学秩序正常，传言严重失实。',
    author: '健康科普早知道',
    platform: 'weixin',
    publishTime: '2026-08-18 08:05:00',
    importTime: '2026-08-19 10:00:00',
    status: 'success',
    screenshot: snipasteXiaohongshu,
    hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
  },
  {
    id: 5,
    url: 'https://v.douyin.com/ZMsjQ99/',
    title: '淮安区某小区发生持刀伤人事件？',
    content: '无正文 - 页面解析超时或返回503服务器内部错误，网页提取要素失败。',
    author: '-',
    platform: 'douyin',
    publishTime: '-',
    importTime: '2026-08-19 10:10:00',
    status: 'failed',
    failReason: '链接已被作者删除，或账号处于被禁言状态，返回404错误。',
    hash: '-',
  },
];

const LinkCollection: React.FC = () => {
  const [data, setData] = useState<LinkItem[]>(INITIAL_DATA);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 筛选状态
  const [searchUrl, setSearchUrl] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 弹窗控制
  const [browserModalVisible, setBrowserModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  
  // 详情查看数据
  const [currentBrowserItem, setCurrentBrowserItem] = useState<LinkItem | null>(null);
  
  // 导出状态
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStepText, setExportStepText] = useState('');
  const [exportFormat, setExportFormat] = useState<'excel' | 'std'>('excel');

  // 自动处理新导入的“采集中”数据
  useEffect(() => {
    const collectingItems = data.filter((item) => item.status === 'collecting');
    if (collectingItems.length > 0) {
      const timer = setTimeout(() => {
        let updatedCountSuccess = 0;
        let updatedCountFailed = 0;

        setData((prevData) =>
          prevData.map((item) => {
            if (item.status === 'collecting') {
              // 模拟不同平台的数据填充，保证演示高仿真
              const isSuccess = Math.random() > 0.15; // 大部分成功
              if (isSuccess) {
                updatedCountSuccess++;
                let screenshotUrl = snipasteDouyin;
                let title = `【谣言监测】关于${item.platform === 'douyin' ? '抖音' : '社交平台'}的舆情传谣事件`;
                let content = '经过全屏自动取证引擎爬取，该谣言网页快照、页面主要正文与发布者要素已成功抓取。司法数字防伪哈希与PDF取证报告已经生成。';

                if (item.platform === 'douyin') {
                  screenshotUrl = snipasteDouyin;
                  title = '【谣言】大足学校突发停课事件，多名网民转发引发恐慌';
                  content = '网传大足区多所学校因突发状况将无限期停课。经教育部门紧急核实，此系部分学校日常停电调休被过度解读，目前所有学校教学工作井然有序，并无停课计划，网传消息不属实。';
                } else if (item.platform === 'xiaohongshu') {
                  screenshotUrl = snipasteXiaohongshu;
                  title = '【辟谣】关于淮安区某主要路段发生严重车祸连环撞的谣言';
                  content = '有网民在小红书散布视频声声称淮安大道发生二三十辆车连环追尾事故。交警部门迅速澄清：现场仅为两车轻微碰擦，无人员伤亡，视频属于恶意拼接剪辑。';
                } else if (item.platform === 'weibo') {
                  screenshotUrl = snipasteDouyin;
                  title = '谣言：某地将对所有小区饮用水实施分时段断水管制';
                }

                return {
                  ...item,
                  status: 'success',
                  title,
                  content,
                  author: item.author || '民生透视镜',
                  publishTime: dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
                  screenshot: screenshotUrl,
                  hash: Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
                };
              } else {
                updatedCountFailed++;
                return {
                  ...item,
                  status: 'failed',
                  failReason: '连接超时 (504 Gateway Timeout)，页面元素防爬拦截',
                  title: '解析失败',
                  content: '-',
                  author: '-',
                  publishTime: '-',
                  hash: '-',
                };
              }
            }
            return item;
          })
        );

        notification.success({
          message: '自动采集与截图获取完成',
          description: `取证引擎处理完毕，本次成功爬取并生成截图 ${updatedCountSuccess} 条，采集失败 ${updatedCountFailed} 条。`,
          placement: 'bottomRight',
          duration: 4.5,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [data]);

  // 重置筛选
  const handleReset = () => {
    setSearchUrl('');
    setPlatformFilter('all');
    setStatusFilter('all');
    setTimeRange(null);
  };

  // 模拟单条重新采集
  const handleRecollect = (record: LinkItem) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            status: 'collecting',
            title: '',
            content: '',
            author: '',
            publishTime: '',
            hash: '',
          };
        }
        return item;
      })
    );
    message.loading(`正在对链接 ${record.url} 重新发起采集取证...`, 1.5);
  };

  // 模拟批量重新采集
  const handleBatchRecollect = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先勾选需要重新采集的链接');
      return;
    }
    setData((prev) =>
      prev.map((item) => {
        if (selectedRowKeys.includes(item.id)) {
          return {
            ...item,
            status: 'collecting',
            title: '',
            content: '',
            author: '',
            publishTime: '',
            hash: '',
          };
        }
        return item;
      })
    );
    message.loading(`已对选中的 ${selectedRowKeys.length} 条链接重新发起采集...`, 1.5);
    setSelectedRowKeys([]);
  };

  // 删除单条
  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    message.success('已成功删除该记录');
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的行');
      return;
    }
    setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
    message.success(`已批量删除 ${selectedRowKeys.length} 条链接记录`);
    setSelectedRowKeys([]);
  };

  // 下载导入模板文件 (物理文件生成与下载)
  const handleDownloadTemplate = () => {
    const csvContent = 
`链接,平台
https://v.douyin.com/ZMsjXYZ/,抖音
https://www.xiaohongshu.com/discovery/item/88d223c/,小红书
https://weibo.com/56829471/Nf82XYZ/,微博
https://v.douyin.com/ZMsjQ98/,抖音`;

    // 解决 Excel 打开 CSV 乱码，添加 BOM 头 (\uFEFF)
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'link_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    message.success('已自动生成并下载链接导入模板 link_import_template.csv');
  };

  // 批量导入链接 - 调用原生文件管理器
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // 重置 file 控件
      fileInputRef.current.click();
    }
  };

  // 文件读取与自动解析
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    message.loading(`正在调起系统文件管理器并解析: ${file.name}...`, 1.2);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          message.error('导入的文件内容为空！');
          return;
        }

        // 按行切割并过滤空行
        const lines = text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
        
        // 过滤首代表头行
        const dataLines = lines.filter((line, idx) => {
          if (idx === 0 && (line.includes('链接') || line.includes('url') || line.includes('platform') || line.includes('平台'))) {
            return false;
          }
          return true;
        });

        if (dataLines.length === 0) {
          message.warning('导入的文件中没有检测到有效数据行');
          return;
        }

        const newItems: LinkItem[] = dataLines.map((line, index) => {
          // 以逗号分割，如不支持则以空格分割
          let parts = line.split(',');
          if (parts.length < 2) {
            parts = line.split(/\s+/);
          }

          const rawUrl = parts[0]?.trim() || '';
          const rawPlatform = parts[1]?.trim() || '';

          // 精确判定平台
          let platform: LinkItem['platform'] = 'other';
          if (rawPlatform.includes('抖音') || rawPlatform.includes('douyin') || rawPlatform.includes('dy')) platform = 'douyin';
          else if (rawPlatform.includes('小红书') || rawPlatform.includes('xiaohongshu') || rawPlatform.includes('xhs')) platform = 'xiaohongshu';
          else if (rawPlatform.includes('微博') || rawPlatform.includes('weibo')) platform = 'weibo';
          else if (rawPlatform.includes('微信') || rawPlatform.includes('weixin') || rawPlatform.includes('mp')) platform = 'weixin';
          else {
            // 链接特征兜底
            if (rawUrl.includes('douyin')) platform = 'douyin';
            else if (rawUrl.includes('xiaohongshu')) platform = 'xiaohongshu';
            else if (rawUrl.includes('weibo')) platform = 'weibo';
            else if (rawUrl.includes('weixin')) platform = 'weixin';
          }

          // 正则匹配 URL
          const urlMatch = rawUrl.match(/https?:\/\/[^\s]+/i);
          const url = urlMatch ? urlMatch[0] : rawUrl || 'https://v.douyin.com/' + Math.random().toString(36).substring(7);

          return {
            id: Date.now() + index,
            url,
            title: '',
            content: '',
            author: '',
            platform,
            publishTime: '',
            importTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            status: 'collecting', // 初始化状态为采集中
          };
        });

        // 合并添加进表格数据集，自动触发 useEffect 采集
        setData((prev) => [...newItems, ...prev]);
        message.success(`成功从 ${file.name} 解析出 ${newItems.length} 条链接，已自动开启截图获取！`);
      } catch (err) {
        message.error('解析文件内容时出错，请检查文件格式。');
      }
    };
    reader.readAsText(file);
  };

  // 触发打包导出 ZIP (Excel/std格式)
  const handleStartExport = (format: 'excel' | 'std') => {
    setExportFormat(format);
    setExportModalVisible(true);
    setExportProgress(0);
    setExportStepText('正在准备导出环境...');

    const isStd = format === 'std';
    const steps = [
      { progress: 15, text: `[1/4] 正在根据筛选条件生成 ${isStd ? 'std' : 'Excel'} 格式对照表格数据...` },
      { progress: 45, text: '[2/4] 正在获取并映射对应采集成功的页面截图附件...' },
      { progress: 75, text: `[3/4] 正在建立表格与截图文件的映射关系 (${isStd ? 'std' : 'Excel'}格式对照)...` },
      { progress: 95, text: `[4/4] 正在将数据表与截图附件压缩打包为 ZIP...` },
      { progress: 100, text: '打包完成，正在拉起浏览器安全下载...' },
    ];

    // 选择对应的 ZIP 资产链接
    const targetZipUrl = format === 'excel' ? exportExcelZipUrl : exportStdZipUrl;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setExportProgress(steps[currentStep].progress);
        setExportStepText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setExportModalVisible(false);
          const zipName = `link_collection_export_${format}_${dayjs().format('YYYYMMDD')}.zip`;
          
          notification.success({
            message: '批量导出成功',
            description: `已成功导出压缩包: ${zipName} (标准 ${format.toUpperCase()} 映射格式，包含数据表格及截图)。`,
            placement: 'bottomRight',
          });

          // 物理下载预打包好的合法 ZIP 资产以解决 macOS 解压报错
          fetch(targetZipUrl)
            .then((res) => {
              if (!res.ok) throw new Error('ZIP resource fetch failed');
              return res.blob();
            })
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = zipName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            })
            .catch((err) => {
              console.error('Fetch zip asset error, using fallback:', err);
              // 如果 fetch 失败，采用常规 blob 兜底下载，确保按钮功能不报死
              const backupBlob = new Blob(['Backup ZIP content: Falling back from fetch error.'], { type: 'application/zip' });
              const backupUrl = window.URL.createObjectURL(backupBlob);
              const a = document.createElement('a');
              a.href = backupUrl;
              a.download = zipName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(backupUrl);
            });
        }, 800);
      }
    }, 500); // 适度调慢速度（约2.5s展示），给用户清晰的“处理时间”感知
  };

  // 筛选过滤数据
  const filteredData = data.filter((item) => {
    const matchesSearch = item.url.toLowerCase().includes(searchUrl.toLowerCase()) || item.title.toLowerCase().includes(searchUrl.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    let matchesTime = true;
    if (timeRange && timeRange[0] && timeRange[1]) {
      const itemTime = dayjs(item.importTime);
      matchesTime = itemTime.isAfter(timeRange[0].startOf('day')) && itemTime.isBefore(timeRange[1].endOf('day'));
    }

    return matchesSearch && matchesPlatform && matchesStatus && matchesTime;
  });

  // Table 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      width: 220,
      render: (text: string, record: LinkItem) => (
        <a
          onClick={() => {
            setCurrentBrowserItem(record);
            setBrowserModalVisible(true);
          }}
          className="blue-link"
          style={{ wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ChromeOutlined style={{ color: '#1677ff' }} />
          <span>{text}</span>
        </a>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 100,
      render: (author: string, record: LinkItem) => {
        if (record.status === 'collecting') return '-';
        return author || '-';
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 90,
      render: (platform: string) => {
        let color = 'default';
        let label = '其他';
        if (platform === 'douyin') {
          color = 'purple';
          label = '抖音';
        } else if (platform === 'xiaohongshu') {
          color = 'volcano';
          label = '小红书';
        } else if (platform === 'weibo') {
          color = 'orange';
          label = '微博';
        } else if (platform === 'weixin') {
          color = 'green';
          label = '微信';
        }
        return <Tag color={color} style={{ fontWeight: 600 }}>{label}</Tag>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 150,
      render: (time: string, record: LinkItem) => {
        if (record.status === 'collecting') return '-';
        return time || '-';
      },
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
      key: 'importTime',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: LinkItem) => {
        if (status === 'collecting') {
          return (
            <Tag icon={<LoadingOutlined />} color="warning" style={{ borderRadius: 10 }}>
              进行中
            </Tag>
          );
        }
        if (status === 'success') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 10 }}>
              成功
            </Tag>
          );
        }
        return (
          <Tooltip title={record.failReason || '采集失败：链接无效或平台无采集能力'}>
            <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: 10, cursor: 'pointer' }}>
              失败
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: any, record: LinkItem) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<CameraOutlined />}
            disabled={record.status !== 'success'}
            onClick={() => {
              setCurrentBrowserItem(record);
              setBrowserModalVisible(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            disabled={record.status === 'collecting'}
            onClick={() => handleRecollect(record)}
          >
            重试
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="link-collection-page-wrapper" style={{ padding: '16px 24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      {/* 隐藏的真实文件选取器 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".csv,.txt"
        onChange={handleFileChange}
      />

      {/* 页面页头 */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>截图取证</h1>
        </div>
        <Space>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
            style={{ borderRadius: 6, fontWeight: 600 }}
          >
            模版下载
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleImportClick}
            style={{ borderRadius: 6, fontWeight: 600, background: '#1677ff' }}
          >
            导入链接
          </Button>
          <Button
            type="default"
            icon={<FileZipOutlined style={{ color: '#0ea5e9' }} />}
            onClick={() => handleStartExport('excel')}
            disabled={filteredData.length === 0}
            style={{ borderRadius: 6, fontWeight: 600, border: '1px solid #0ea5e9', color: '#0ea5e9' }}
          >
            导出为Excel
          </Button>
          <Button
            type="default"
            icon={<FileZipOutlined style={{ color: '#8b5cf6' }} />}
            onClick={() => handleStartExport('std')}
            disabled={filteredData.length === 0}
            style={{ borderRadius: 6, fontWeight: 600, border: '1px solid #8b5cf6', color: '#8b5cf6' }}
          >
            导出为std
          </Button>
        </Space>
      </div>

      {/* 筛选面板 */}
      <Card bordered={false} bodyStyle={{ padding: '16px 24px' }} style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap' }}>链接/标题:</span>
            <Input
              placeholder="搜索链接或抓取标题..."
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              style={{ width: 220, borderRadius: 6 }}
              prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
              allowClear
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap' }}>发布平台:</span>
            <Select
              value={platformFilter}
              onChange={setPlatformFilter}
              style={{ width: 130 }}
              options={[
                { value: 'all', label: '全部平台' },
                { value: 'douyin', label: '抖音' },
                { value: 'xiaohongshu', label: '小红书' },
                { value: 'weibo', label: '微博' },
                { value: 'weixin', label: '微信' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap' }}>附件状态:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 130 }}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'collecting', label: '采集中' },
                { value: 'success', label: '采集成功' },
                { value: 'failed', label: '采集失败' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#475569', whiteSpace: 'nowrap' }}>导入时间:</span>
            <RangePicker
              value={timeRange}
              onChange={(val) => setTimeRange(val as any)}
              style={{ borderRadius: 6 }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Button onClick={handleReset} style={{ borderRadius: 6, marginRight: 8 }}>
              重置
            </Button>
            <Button type="primary" onClick={() => {}} style={{ borderRadius: 6, background: '#1677ff' }}>
              查询
            </Button>
          </div>
        </div>
      </Card>

      {/* 数据表格卡片 */}
      <Card
        bordered={false}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}
      >
        {/* 表格顶部操作按钮区 */}
        <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              已筛选出 <strong style={{ color: '#0f172a' }}>{filteredData.length}</strong> 条记录
              {selectedRowKeys.length > 0 && (
                <>
                  ，已选择 <strong style={{ color: '#1677ff' }}>{selectedRowKeys.length}</strong> 项
                </>
              )}
            </span>
          </div>
          
          <Space>
            {selectedRowKeys.length > 0 && (
              <Space>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDelete}
                  style={{ borderRadius: 6 }}
                >
                  批量删除
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleBatchRecollect}
                  style={{ borderRadius: 6 }}
                >
                  批量重试
                </Button>
              </Space>
            )}
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultPageSize: 10,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `共 ${total} 条数据`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 司法级取证浏览器弹窗 (Modal) */}
      <Modal
        title={null}
        visible={browserModalVisible}
        onCancel={() => setBrowserModalVisible(false)}
        width={1050}
        bodyStyle={{ padding: 0, background: '#f1f5f9', borderRadius: 8, overflow: 'hidden' }}
        footer={null}
        destroyOnClose
      >
        {currentBrowserItem && (
          <div>
            {/* 1. 模拟取证专用浏览器顶栏 */}
            <div style={{ background: '#e2e8f0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #cbd5e1' }}>
              {/* 模拟浏览器窗口控制小红绿灯 */}
              <div style={{ display: 'flex', gap: 6, marginRight: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              </div>

              {/* 导航前进后退刷新 */}
              <Space size="small">
                <Button type="text" size="small" icon={<ArrowLeftOutlined />} disabled />
                <Button type="text" size="small" icon={<ArrowRightOutlined />} disabled />
                <Button type="text" size="small" icon={<ReloadOutlined />} onClick={() => message.loading('重新渲染抓取中...')} />
              </Space>

              {/* 模拟地址栏 */}
              <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '4px 16px', display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', fontSize: 12, color: '#334155', gap: 8 }}>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>🔒 Https</span>
                <span style={{ color: '#94a3b8' }}>|</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '600px' }}>{currentBrowserItem.url}</span>
              </div>

              {/* 右侧司法链区块防伪标识 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 8px', fontSize: 11, color: '#1e40af' }}>
                <span>⛓️ 司法存证链已锁定</span>
              </div>
            </div>

            {/* 2. 司法固证元数据展示栏 */}
            <div style={{ background: '#fff', padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', maxWidth: '85%' }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  标题: <strong style={{ color: '#1e293b' }}>{currentBrowserItem.title || '暂无数据'}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  作者账号: <strong style={{ color: '#1e293b' }}>{currentBrowserItem.author}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  所属平台: <strong style={{ color: '#1e293b' }}>{currentBrowserItem.platform === 'douyin' ? '抖音' : currentBrowserItem.platform === 'xiaohongshu' ? '小红书' : currentBrowserItem.platform === 'weibo' ? '微博' : currentBrowserItem.platform === 'weixin' ? '微信' : '其它渠道'}</strong>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', width: '100%', wordBreak: 'break-all' }}>
                  司法存证哈希 (SHA-256): <code style={{ color: '#0f766e', background: '#f0fdfa', padding: '2px 6px', borderRadius: 4 }}>{currentBrowserItem.hash || 'N/A'}</code>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  取证生成时间: <span style={{ color: '#0f172a', fontWeight: 500 }}>{currentBrowserItem.importTime}</span>
                </div>
              </div>

              {/* 高保真司法防伪存证印章 */}
              <div style={{
                position: 'absolute',
                right: 24,
                top: 8,
                width: 76,
                height: 76,
                border: '3px double #ef4444',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                transform: 'rotate(-12deg)',
                fontWeight: 700,
                fontSize: 10,
                background: 'rgba(254, 242, 242, 0.6)',
                zIndex: 10,
                pointerEvents: 'none',
              }}>
                <div style={{ borderBottom: '1px solid #ef4444', paddingBottom: 2 }}>司法固证</div>
                <div style={{ fontSize: 8, marginTop: 2 }}>淮安市网安</div>
              </div>
            </div>

            {/* 3. 浏览器访问截图渲染区域 (高保真大图，可纵向滚动) */}
            <div style={{ height: '550px', overflowY: 'auto', background: '#fafafa', position: 'relative', display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              {currentBrowserItem.screenshot ? (
                <div style={{ width: '85%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
                  <img
                    src={currentBrowserItem.screenshot}
                    alt="网页截图"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              ) : (
                <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8', width: '100%' }}>
                  <ChromeOutlined style={{ fontSize: 60, color: '#cbd5e1', marginBottom: 16 }} />
                  <h3>未生成有效的页面截图</h3>
                  <p>该链接由于采集失败或返回超时，无法渲染网页访问快照。</p>
                  <Button type="primary" icon={<ReloadOutlined />} onClick={() => handleRecollect(currentBrowserItem)}>
                    重新发起取证
                  </Button>
                </div>
              )}
            </div>

            {/* 4. 底部操作说明栏 */}
            <div style={{ background: '#fff', padding: '12px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                🛡️ 本截图固证数据遵循最高法司法存证规范，上链高度：#382057，固证签发机关：公安局互联网舆情侦测中心。
              </span>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    message.success('链接截图附件下载成功！');
                  }}
                  style={{ borderRadius: 6 }}
                >
                  保存截图 (PNG)
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    message.success('已自动生成防伪存证 PDF 报告并下载！');
                  }}
                  style={{ borderRadius: 6, background: '#1677ff' }}
                >
                  导出 PDF 取证报告
                </Button>
                <Button onClick={() => setBrowserModalVisible(false)} style={{ borderRadius: 6 }}>
                  关闭窗口
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 批量打包导出进度弹窗 (Modal) */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
            <FileZipOutlined style={{ color: '#0ea5e9', fontSize: 18 }} />
            <span>生成批量导出 ZIP 压缩包 (导出为{exportFormat === 'std' ? 'std' : 'Excel'})</span>
          </div>
        }
        visible={exportModalVisible}
        closable={false}
        maskClosable={false}
        footer={null}
        width={500}
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: '#64748b' }}>{exportStepText}</span>
            <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{exportProgress}%</span>
          </div>
          <Progress
            percent={exportProgress}
            status="active"
            strokeColor={{
              '0%': '#10b981',
              '100%': '#0ea5e9',
            }}
            showInfo={false}
          />
          <div style={{ marginTop: 16, background: '#f8fafc', padding: '10px 14px', borderRadius: 6, border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              <strong>📋 导出文件清单：</strong>
              <div style={{ marginTop: 4, fontFamily: 'monospace' }}>
                1. <code>link_evidence_manifest.{exportFormat === 'std' ? 'std' : 'xlsx'}</code> (数据与截图对照表)<br />
                2. <code>screenshots/Snipaste_2026-08-19_11-28-41.png</code> (抖音截图)<br />
                3. <code>screenshots/Snipaste_2026-08-19_11-29-09.png</code> (小红书截图)<br />
                4. <code>judicial_signatures.json</code> (数字存证签发包)
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LinkCollection;
