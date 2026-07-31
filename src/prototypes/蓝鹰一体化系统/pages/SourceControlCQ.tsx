import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  Card,
  Tabs,
  Tag,
  Empty,
  Dropdown,
  DatePicker,
  Popover,
  Input,
  Checkbox,
  InputNumber,
  TimePicker,
  Tooltip,
  Form,
  message,
} from 'antd';
import {
  SettingOutlined,
  FileAddOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MoreOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  EyeOutlined,
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import TaskDetailCQ from './TaskDetailCQ';
import InstructionCommandModal from '../components/InstructionCommandModal';

const { TabPane } = Tabs;

// ==================== 模拟数据 ====================

// 数据概览项
const overviewItems = [
  { key: 'today', label: '今日任务', value: 3 },
  { key: 'special', label: '专项任务', value: 2 },
  { key: 'account', label: '重点账号动态跟踪', value: 0 },
  { key: 'position', label: '重点阵地实时盯控', value: 0 },
  { key: 'sentiment', label: '舆情专项专班', value: 0 },
  { key: 'security', label: '安保专项任务', value: 1 },
  { key: 'emergency', label: '应急处置任务', value: 0 },
  { key: 'patrol', label: '专项巡查任务', value: 2 },
];

// 敏感时间/事件节点
const sensitiveEvents: any[] = [];

// 专项任务数据
const specialTasks = [
  {
    id: '1',
    code: '0510',
    name: '淮安汛情',
    status: 'normal',
    department: '支队',
    trend: 0,
    trendLabel: '暂无新增',
    rank: '未上榜',
  },
  {
    id: '2',
    code: '0118',
    name: '高张花园',
    status: 'normal',
    department: '支队',
    trend: 0,
    trendLabel: '暂无新增',
    rank: '未上榜',
  },
];

// 安保任务数据
const securityTasks = [
  {
    id: '1',
    name: '5月23日 淮安苏超',
    status: 'normal',
    department: '支队',
    trend: 0,
    trendLabel: '暂无新增',
    rank: '未上榜',
  },
];

// ==================== 排班专属模拟数据 ====================
const scheduleTasks = [
  {
    type: '重大实体事件跟踪',
    items: [
      { id: 't1', name: '渝中宝马撞人事件' },
      { id: 't2', name: '彭水山体滑坡' },
      { id: 't3', name: 'LGBT' },
      { id: 't4', name: '重庆火灾舆情' },
      { id: 't5', name: '大足一中' },
      { id: 't6', name: '大足矫正教育' },
      { id: 't7', name: '侵犯公民个人信息' },
      { id: 't8', name: '区域合并舆情监测' },
      { id: 't9', name: '区域规划舆情监测' },
      { id: 't10', name: '李林偷越国边境' },
      { id: 't11', name: '留查辅警招聘' },
      { id: 't12', name: '渝中舆情巡查' },
      { id: 't13', name: '重庆涉灾舆情' },
      { id: 't14', name: '重庆区划' },
      { id: 't15', name: '激光投射类人员设备摸排' },
      { id: 't16', name: '合川重点学校巡查' },
      { id: 't17', name: '涉日' },
      { id: 't18', name: '重庆涉灾舆情（媒体）' },
      { id: 't19', name: '活人墓' }
    ]
  },
  {
    type: '安保任务',
    items: [
      { id: 's1', name: '5月23日 淮安苏超' },
      { id: 's2', name: '敏感节点安保值守' },
      { id: 's3', name: '涉稳群体聚集风险排查' }
    ]
  }
];

const allTasksMap: Record<string, string> = {};
scheduleTasks.forEach(g => {
  g.items.forEach(t => {
    allTasksMap[t.id] = t.name;
  });
});

// 各个任务专属的可选值班责任单位（部门）限制。未配置的任务默认支持全市所有部门选项。
const taskAllowedUnits: Record<string, string[]> = {
  t1: ['渝中区'],   // 渝中宝马撞人事件
  t5: ['大足区'],   // 大足一中
  t6: ['大足区'],   // 大足矫正教育
  t12: ['渝中区'],  // 渝中舆情巡查
  t16: ['合川区']   // 合川重点学校巡查
};

const isUnitAllowedForTask = (taskId: string, unit: string) => {
  const allowed = taskAllowedUnits[taskId];
  if (!allowed) return true; // 默认全市统筹，支持全部部门
  return allowed.includes(unit);
};


const getInitialSchedules = () => {
  const initial: Record<string, Record<string, any>> = {};
  
  // 1. 大足一中 (t5) - 全体大足区排班
  initial['t5'] = {};
  const start = dayjs('2026-07-15');
  for (let i = 0; i < 60; i++) {
    const dStr = start.add(i, 'day').format('YYYY-MM-DD');
    initial['t5'][dStr] = {
      dutyUnit: '大足区',
      requirements: '重点配合做好校园大门以及外围路段的舆情巡视和网民言论引导工作。',
      timeRanges: [
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' },
        { start: '20:00', end: '22:00' }
      ]
    };
  }
  
  // 2. 合川重点学校巡查 (t16) - 7月31日至8月2日设为“合川区”
  initial['t16'] = {
    '2026-07-31': {
      dutyUnit: '合川区',
      requirements: '加强合川中学附近的驻守值班，随时配合突发事件研判。',
      timeRanges: [
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' }
      ]
    },
    '2026-08-01': {
      dutyUnit: '合川区',
      requirements: '加强合川中学附近的驻守值班，随时配合突发事件研判。',
      timeRanges: [
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' }
      ]
    },
    '2026-08-02': {
      dutyUnit: '合川区',
      requirements: '加强合川中学附近的驻守值班，随时配合突发事件研判。',
      timeRanges: [
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' }
      ]
    }
  };
  
  // 3. 渝中舆情巡查 (t12) - 7月30日为“渝中区”（已逾期/未完成），8月3日至5日为“渝中区”（未开始）
  initial['t12'] = {
    '2026-07-30': {
      dutyUnit: '渝中区',
      requirements: '渝中重点地带社交账号实时监控，注意突发动态。',
      timeRanges: [{ start: '10:00', end: '12:00' }]
    },
    '2026-08-03': {
      dutyUnit: '渝中区',
      requirements: '渝中重点地带社交账号实时监控，注意突发动态。',
      timeRanges: [{ start: '10:00', end: '12:00' }]
    },
    '2026-08-04': {
      dutyUnit: '渝中区',
      requirements: '渝中重点地带社交账号实时监控，注意突发动态。',
      timeRanges: [{ start: '10:00', end: '12:00' }]
    },
    '2026-08-05': {
      dutyUnit: '渝中区',
      requirements: '渝中重点地带社交账号实时监控，注意突发动态。',
      timeRanges: [{ start: '10:00', end: '12:00' }]
    }
  };

  return initial;
};

// ==================== 组件 ====================

const SourceControlCQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [calendarType, setCalendarType] = useState<string>();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [commandTask, setCommandTask] = useState<any | null>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  // ==================== 排班系统状态 ====================
  const [schedules, setSchedules] = useState<Record<string, Record<string, any>>>(() => getInitialSchedules());
  const [currentDatePage, setCurrentDatePage] = useState<number>(0);
  const [filterTaskType, setFilterTaskType] = useState<string>();
  const [filterDutyUnit, setFilterDutyUnit] = useState<string>();
  const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 当前激活编辑的单元格
  const [selectedCell, setSelectedCell] = useState<{ taskId: string; dateStr: string } | null>(null);
  // 临时编辑状态
  const [tempDutyUnit, setTempDutyUnit] = useState<string>();
  const [tempRequirements, setTempRequirements] = useState('');
  const [tempTimeRanges, setTempTimeRanges] = useState<Array<{ start: string; end: string }>>([
    { start: '09:00', end: '11:00' },
    { start: '14:00', end: '16:00' },
    { start: '20:00', end: '22:00' }
  ]);
  const [tempApplySubsequentDays, setTempApplySubsequentDays] = useState(false);
  const [tempSubsequentDaysCount, setTempSubsequentDaysCount] = useState(30);

  // ECharts 统计引用
  const statsChartRef = useRef<HTMLDivElement>(null);
  const statsPieRef = useRef<HTMLDivElement>(null);

  // ==================== 批量排班状态与事件监听 ====================
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchTemplate, setBatchTemplate] = useState<{ taskId: string; dateStr: string; config: any } | null>(null);
  // 悬停单元格 Key (taskId_dateStr)
  const [hoveredCellKey, setHoveredCellKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragSelectedCells, setDragSelectedCells] = useState<Array<{ taskId: string; dateStr: string }>>([]);
  const [schedulesSnapshot, setSchedulesSnapshot] = useState<Record<string, Record<string, any>> | null>(null);

  // 鼠标在单元格上按下 (MouseDown)
  const handleCellMouseDown = (taskId: string, dateStr: string) => {
    if (!batchMode) return;
    
    const existing = schedules[taskId]?.[dateStr];
    if (!batchTemplate) {
      if (existing) {
        setBatchTemplate({ taskId, dateStr, config: existing });
        message.success(`成功选中「${allTasksMap[taskId] || taskId} (${dateStr})」的值班配置作为标准排班模板！`);
      } else {
        message.warning('该单元格尚未排班，请先点击一个已有排班的单元格作为标准模板！');
      }
    } else {
      // 已经有模板了，启动拖拽批量填充
      setIsDragging(true);
      setDragSelectedCells([{ taskId, dateStr }]);
    }
  };

  // 鼠标滑入单元格 (MouseEnter)
  const handleCellMouseEnter = (taskId: string, dateStr: string) => {
    if (!batchMode || !isDragging || !batchTemplate) return;
    
    const exists = dragSelectedCells.some(cell => cell.taskId === taskId && cell.dateStr === dateStr);
    if (!exists) {
      setDragSelectedCells([...dragSelectedCells, { taskId, dateStr }]);
    }
  };

  // 全局鼠标松开监听，用以完成批量填充
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        if (batchTemplate && dragSelectedCells.length > 0) {
          const newSchedules = { ...schedules };
          const templateUnit = batchTemplate.config.dutyUnit;
          const validFills: typeof dragSelectedCells = [];
          const skippedTaskNames: string[] = [];
          
          dragSelectedCells.forEach(cell => {
            const allowed = isUnitAllowedForTask(cell.taskId, templateUnit);
            if (allowed) {
              validFills.push(cell);
            } else {
              const taskName = allTasksMap[cell.taskId] || cell.taskId;
              if (!skippedTaskNames.includes(taskName)) {
                skippedTaskNames.push(taskName);
              }
            }
          });
          
          if (validFills.length > 0) {
            validFills.forEach(cell => {
              if (!newSchedules[cell.taskId]) newSchedules[cell.taskId] = {};
              newSchedules[cell.taskId][cell.dateStr] = JSON.parse(JSON.stringify(batchTemplate.config));
            });
            setSchedules(newSchedules);
            message.info(`已成功复制模板填充了 ${validFills.length} 个单元格`);
          }
          
          if (skippedTaskNames.length > 0) {
            message.warning(`有 ${skippedTaskNames.length} 个任务（如「${skippedTaskNames[0]}」）责任部门不包含该值班单位，已自动忽略。`);
          }
        }
        setDragSelectedCells([]);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, batchTemplate, dragSelectedCells, schedules]);

  // 获取特定排班状态
  const getCellStatus = (dateStr: string, taskId: string) => {
    if (dateStr === '2026-07-31') {
      return 'ongoing'; // 进行中
    } else if (dateStr > '2026-07-31') {
      return 'todo'; // 未开始
    } else {
      // 过去日期
      if (taskId === 't12' && dateStr === '2026-07-30') {
        return 'overdue'; // 未完成（重庆/渝中舆情巡查在7月30日）
      }
      return 'completed'; // 已完成
    }
  };

  // 点击单元格
  const handleCellClick = (taskId: string, dateStr: string) => {
    setSelectedCell({ taskId, dateStr });
    const existing = schedules[taskId]?.[dateStr];
    if (existing) {
      setTempDutyUnit(existing.dutyUnit);
      setTempRequirements(existing.requirements || '');
      setTempTimeRanges(existing.timeRanges && existing.timeRanges.length > 0 
        ? JSON.parse(JSON.stringify(existing.timeRanges))
        : [
            { start: '09:00', end: '11:00' },
            { start: '14:00', end: '16:00' },
            { start: '20:00', end: '22:00' }
          ]
      );
    } else {
      setTempDutyUnit(undefined);
      setTempRequirements('');
      setTempTimeRanges([
        { start: '09:00', end: '11:00' },
        { start: '14:00', end: '16:00' },
        { start: '20:00', end: '22:00' }
      ]);
    }
    setTempApplySubsequentDays(false);
    // 渝中宝马撞人事件（t1）默认后续 6 天，其他任务默认后续 30 天，匹配参考图
    setTempSubsequentDaysCount(taskId === 't1' ? 6 : 30);
  };

  // 修改时间范围
  const handleTimeChange = (index: number, field: 'start' | 'end', val: any) => {
    const timeStr = val ? val.format('HH:mm') : '00:00';
    const newRanges = [...tempTimeRanges];
    newRanges[index][field] = timeStr;
    setTempTimeRanges(newRanges);
  };

  // 保存排班配置
  const handleSaveSchedule = () => {
    if (!selectedCell) return;
    if (!tempDutyUnit) {
      message.error('请选择值班单位！');
      return;
    }
    
    const { taskId, dateStr } = selectedCell;
    const newSchedules = { ...schedules };
    if (!newSchedules[taskId]) newSchedules[taskId] = {};
    
    const config = {
      dutyUnit: tempDutyUnit,
      requirements: tempRequirements,
      timeRanges: tempTimeRanges
    };
    
    // 更新当前选择的单元格
    newSchedules[taskId][dateStr] = config;
    
    // 如果勾选了后续天数，采用同样排班（直接覆盖）
    if (tempApplySubsequentDays && tempSubsequentDaysCount > 0) {
      const baseDate = dayjs(dateStr);
      for (let i = 1; i <= tempSubsequentDaysCount; i++) {
        const targetDStr = baseDate.add(i, 'day').format('YYYY-MM-DD');
        newSchedules[taskId][targetDStr] = { ...config };
      }
    }
    
    setSchedules(newSchedules);
    message.success('值班单位排班设置成功！');
    setSelectedCell(null);
  };

  // 获取分页的日期列表（Page 0: 7-31~8-15, Page 1: 8-16~8-31, Page 2: 9-01~9-15）
  const getDatesForPage = (page: number) => {
    const dates = [];
    let start = dayjs('2026-07-31');
    let length = 16;
    if (page === 1) {
      start = dayjs('2026-08-16');
    } else if (page === 2) {
      start = dayjs('2026-09-01');
      length = 15;
    }
    for (let i = 0; i < length; i++) {
      dates.push(start.add(i, 'day'));
    }
    return dates;
  };

  // 获取渲染的日期数组
  const getDatesToRender = () => {
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      const dates = [];
      const start = filterDateRange[0];
      const end = filterDateRange[1];
      const diffDays = end.diff(start, 'day');
      const limit = Math.min(diffDays + 1, 40); // 限制最多展示40天，保持性能
      for (let i = 0; i < limit; i++) {
        dates.push(start.add(i, 'day'));
      }
      return dates;
    }
    return getDatesForPage(currentDatePage);
  };

  // ECharts 统计图表渲染
  useEffect(() => {
    if (activeTab === 'schedule-stats' && statsChartRef.current && statsPieRef.current) {
      const barChart = echarts.init(statsChartRef.current);
      const pieChart = echarts.init(statsPieRef.current);
      
      const unitCounts: Record<string, number> = {
        '大足区': 0,
        '总2_舆情': 0,
        '总公司': 0,
        '渝中区': 0,
        '支队': 0,
        '合川区': 0,
      };
      
      Object.keys(schedules).forEach(taskId => {
        Object.keys(schedules[taskId]).forEach(dStr => {
          const config = schedules[taskId][dStr];
          if (config && config.dutyUnit) {
            unitCounts[config.dutyUnit] = (unitCounts[config.dutyUnit] || 0) + 1;
          }
        });
      });
      
      const pieData = Object.keys(unitCounts).map(unit => ({
        name: unit,
        value: unitCounts[unit]
      })).filter(item => item.value > 0);
      
      if (pieData.length === 0) {
        pieData.push({ name: '暂无排班', value: 0 });
      }

      const pieOption: echarts.EChartsOption = {
        title: { text: '各值班单位排班天数分布', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'item', formatter: '{b}: {c}天 ({d}%)' },
        legend: { bottom: '0%', left: 'center' },
        series: [
          {
            name: '值班单位',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: 16, fontWeight: 'bold' }
            },
            labelLine: { show: false },
            data: pieData
          }
        ]
      };
      
      const datesPage0 = getDatesForPage(0);
      const dateLabels = datesPage0.map(d => d.format('MM/DD'));
      const dateCounts = datesPage0.map(d => {
        const dStr = d.format('YYYY-MM-DD');
        let count = 0;
        Object.keys(schedules).forEach(taskId => {
          if (schedules[taskId]?.[dStr]) count++;
        });
        return count;
      });
      
      const barOption: echarts.EChartsOption = {
        title: { text: '今日至下月中旬每日排班任务数', left: 'center', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: dateLabels },
        yAxis: { type: 'value', minInterval: 1 },
        series: [
          {
            name: '排班任务数',
            type: 'bar',
            data: dateCounts,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            }
          }
        ]
      };
      
      barChart.setOption(barOption);
      pieChart.setOption(pieOption);
      
      const handleResize = () => {
        barChart.resize();
        pieChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        barChart.dispose();
        pieChart.dispose();
      };
    }
  }, [activeTab, schedules]);

  // 数据概览滚动
  const scrollOverview = (direction: 'left' | 'right') => {
    if (overviewRef.current) {
      const scrollAmount = 200;
      overviewRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const openTaskCommandModal = (task: any) => {
    setCommandTask(task);
  };

  const handleTaskCommandSubmit = () => {
    setCommandTask(null);
  };

  // 任务卡片渲染
  const renderTaskCard = (task: any, type: 'special' | 'security') => (
    <div key={task.id} className="task-card" onClick={() => setSelectedTaskId(task.id)} style={{ cursor: 'pointer' }}>
      <div className="task-card-header">
        <div className="task-title-row">
          {type === 'special' && <span className="task-code">{task.code}</span>}
          <span className="task-name">{task.name}</span>
        </div>
        <div className="task-tags-row">
          <Tag className="status-tag normal">常态</Tag>
          <Tag className="dept-tag">{task.department}</Tag>
          <Dropdown
            menu={{
              items: [
                { key: 'detail', label: '查看详情', icon: <EyeOutlined />, onClick: (e: any) => { e.domEvent.stopPropagation(); setSelectedTaskId(task.id); } },
                { key: 'command', label: '批量下达处置指令', icon: <SendOutlined />, onClick: (e: any) => { e.domEvent.stopPropagation(); openTaskCommandModal(task); } },
                { key: 'edit', label: '编辑任务' },
                { key: 'delete', label: '删除任务', danger: true },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" size="small" className="more-btn" onClick={(e) => e.stopPropagation()}>
              <MoreOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="task-card-body">
        <div className="task-metric">
          <BarChartOutlined className="metric-icon" />
          <span className="metric-value">{task.trend}</span>
        </div>
        <div className="task-trend">
          <span className="trend-label">{task.trendLabel}</span>
        </div>
        <div className="task-rank">
          <span className="rank-label">{task.rank}</span>
        </div>
      </div>
    </div>
  );



  // 渲染排班设置 Popover 表单内容
  const renderPopoverForm = () => {
    if (!selectedCell) return null;
    const { taskId, dateStr } = selectedCell;
    const taskName = allTasksMap[taskId] || '';
    const allowedList = taskAllowedUnits[taskId];
    const defaultOptions = [
      { label: '大足区', value: '大足区' },
      { label: '总2_舆情', value: '总2_舆情' },
      { label: '总公司', value: '总公司' },
      { label: '渝中区', value: '渝中区' },
      { label: '支队', value: '支队' },
      { label: '合川区', value: '合川区' }
    ];
    const selectOptions = allowedList 
      ? defaultOptions.filter(opt => allowedList.includes(opt.value))
      : defaultOptions;
    
    return (
      <div className="schedule-popover-form" onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
          <div style={{ fontWeight: 'bold', fontSize: 13, color: '#1e293b' }}>
            值班排班设置
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            任务：{taskName} <br />
            日期：{dateStr}
          </div>
        </div>
        
        {/* 值班单位 */}
        <div style={{ marginBottom: 12 }}>
          <div className="form-section-title">
            <span className="required-star">*</span>值班单位
          </div>
          <Select
            placeholder="请选择值班单位"
            value={tempDutyUnit}
            onChange={setTempDutyUnit}
            style={{ width: '100%' }}
            size="small"
            options={selectOptions}
          />
        </div>
        
        {/* 任务要求 */}
        <div style={{ marginBottom: 12 }}>
          <div className="form-section-title">任务要求</div>
          <Input.TextArea
            placeholder="请输入工作要求（选填）"
            rows={2}
            value={tempRequirements}
            onChange={(e) => setTempRequirements(e.target.value)}
            style={{ fontSize: 12 }}
          />
        </div>
        
        {/* 反馈时段列表 */}
        <div style={{ marginBottom: 12 }}>
          <div className="form-section-title">
            <span className="required-star">*</span>工作情况反馈时段
          </div>
          <div style={{ maxHeight: 150, overflowY: 'auto', paddingRight: 4 }}>
            {tempTimeRanges.map((range, index) => (
              <div key={index} className="schedule-time-row">
                <span className="time-label">开始</span>
                <TimePicker
                  format="HH:mm"
                  value={dayjs(range.start, 'HH:mm')}
                  onChange={(val) => handleTimeChange(index, 'start', val)}
                  className="time-picker-custom"
                  allowClear={false}
                  size="small"
                  suffixIcon={null}
                />
                <span className="time-label">结束</span>
                <TimePicker
                  format="HH:mm"
                  value={dayjs(range.end, 'HH:mm')}
                  onChange={(val) => handleTimeChange(index, 'end', val)}
                  className="time-picker-custom"
                  allowClear={false}
                  size="small"
                  suffixIcon={null}
                />
                <div className="time-row-actions">
                  <DeleteOutlined 
                    className="action-icon-btn delete" 
                    onClick={() => {
                      if (tempTimeRanges.length <= 1) {
                        message.warning('至少需要保留一个反馈时段！');
                        return;
                      }
                      const newRanges = tempTimeRanges.filter((_, i) => i !== index);
                      setTempTimeRanges(newRanges);
                    }} 
                  />
                  {index === tempTimeRanges.length - 1 && (
                    <PlusCircleOutlined 
                      className="action-icon-btn" 
                      onClick={() => {
                        setTempTimeRanges([...tempTimeRanges, { start: '09:00', end: '11:00' }]);
                      }} 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 快捷天数复制 */}
        <div style={{ marginBottom: 12, background: '#f8fafc', padding: '6px 10px', borderRadius: 4, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Checkbox
              checked={tempApplySubsequentDays}
              onChange={(e) => setTempApplySubsequentDays(e.target.checked)}
              style={{ fontSize: 12 }}
            >
              后续
            </Checkbox>
            <InputNumber
              min={1}
              max={90}
              value={tempSubsequentDaysCount}
              onChange={(val) => setTempSubsequentDaysCount(val || 1)}
              size="small"
              disabled={!tempApplySubsequentDays}
              style={{ width: 60, fontSize: 11 }}
            />
            <span style={{ fontSize: 12, color: '#475569' }}>天，采用同样排班</span>
          </div>
        </div>
        
        {/* 操作区 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
          <Button size="small" onClick={() => setSelectedCell(null)}>关闭</Button>
          <Button size="small" type="primary" onClick={handleSaveSchedule} style={{ background: 'var(--primary-color)' }}>确认选择</Button>
        </div>
      </div>
    );
  };

  // 如果选中了任务，显示详情页
  if (selectedTaskId) {
    return (
      <TaskDetailCQ 
        taskId={selectedTaskId} 
        onBack={() => setSelectedTaskId(null)} 
        schedules={schedules}
        setSchedules={setSchedules}
      />
    );
  }

  // 计算渲染的日期列表
  const datesToRender = getDatesToRender();

  return (
    <div className="source-control-page">
      {/* 顶部操作栏 */}
      <div className="page-header-bar" style={{ height: 'auto', minHeight: 56, padding: '10px 20px', flexWrap: 'wrap', gap: 16 }}>
        <div className="header-left-section" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="header-tabs"
            style={{ marginBottom: 0 }}
          >
            <TabPane tab="今日" key="today" />
            <TabPane tab="当月" key="month" />
            <TabPane tab="排班" key="schedule" />
            <TabPane tab="排班统计" key="schedule-stats" />
          </Tabs>

          {/* 当排班标签激活时，显示大日历筛选器 */}
          {activeTab === 'schedule' && (
            <div className="schedule-filters" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginLeft: 16 }}>
              <span className="filter-label" style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>任务类型：</span>
              <Select 
                placeholder="请选择" 
                value={filterTaskType}
                onChange={setFilterTaskType}
                style={{ width: 140 }}
                options={[
                  { label: '全部', value: 'all' },
                  { label: '重大实体事件跟踪', value: '重大实体事件跟踪' },
                  { label: '安保任务', value: '安保任务' }
                ]}
                allowClear
              />
              <span className="filter-label" style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>值班单位：</span>
              <Select 
                placeholder="请选择" 
                value={filterDutyUnit}
                onChange={setFilterDutyUnit}
                style={{ width: 130 }}
                options={[
                  { label: '全部', value: 'all' },
                  { label: '大足区', value: '大足区' },
                  { label: '总2_舆情', value: '总2_舆情' },
                  { label: '总公司', value: '总公司' },
                  { label: '渝中区', value: '渝中区' },
                  { label: '支队', value: '支队' },
                  { label: '合川区', value: '合川区' }
                ]}
                allowClear
              />
              <span className="filter-label" style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>值班日期：</span>
              <DatePicker.RangePicker 
                value={filterDateRange}
                onChange={setFilterDateRange}
                style={{ width: 240 }}
                allowClear
              />
              <Button type="primary" style={{ background: 'var(--primary-color)' }} onClick={() => message.success('已筛选排班数据')}>查询</Button>
            </div>
          )}

          {activeTab !== 'schedule' && activeTab !== 'schedule-stats' && (
            <div className="calendar-filter">
              <span className="filter-label">日历归属：</span>
              <Select
                placeholder="请选择"
                value={calendarType}
                onChange={setCalendarType}
                style={{ width: 160 }}
                options={[
                  { label: '全部', value: 'all' },
                  { label: '我的', value: 'mine' },
                ]}
              />
            </div>
          )}
        </div>
        
        <div className="header-right-section" style={{ marginLeft: 'auto' }}>
          {activeTab === 'schedule' ? (
            <div className="schedule-legends" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="legend-item"><span className="legend-dot overdue" />未完成</div>
              <div className="legend-item"><span className="legend-dot ongoing" />进行中</div>
              <div className="legend-item"><span className="legend-dot todo" />未开始</div>
              <div className="legend-item"><span className="legend-dot completed" />已完成</div>
            </div>
          ) : activeTab === 'schedule-stats' ? (
            <div style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>排班负荷与值班统计看板</div>
          ) : (
            <>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                className="action-btn-primary"
              >
                敏感时间/事件节点设置
              </Button>
              <Button
                type="primary"
                icon={<FileAddOutlined />}
                className="action-btn-primary"
              >
                创建任务
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 排班主日历表格 */}
      {activeTab === 'schedule' && (
        <div className="schedule-tab-content">
          {/* 日历子表头 (翻页导航) */}
          <div className="schedule-sub-header">
            <div className="date-paginator">
              <Button 
                className="paginator-btn" 
                icon={<LeftOutlined />} 
                onClick={() => setCurrentDatePage(prev => Math.max(0, prev - 1))}
                disabled={currentDatePage === 0 || !!filterDateRange}
              />
              <span className="paginator-title">
                {filterDateRange && filterDateRange[0] && filterDateRange[1] ? (
                  `${filterDateRange[0].format('YYYY年MM月DD日')} 至 ${filterDateRange[1].format('MM月DD日')}`
                ) : currentDatePage === 0 ? (
                  '2026年07月下旬'
                ) : currentDatePage === 1 ? (
                  '2026年08月下旬'
                ) : (
                  '2026年09月上旬'
                )}
              </span>
              <Button 
                className="paginator-btn" 
                icon={<RightOutlined />} 
                onClick={() => setCurrentDatePage(prev => Math.min(2, prev + 1))}
                disabled={currentDatePage === 2 || !!filterDateRange}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#64748b', fontSize: 12 }}>
                {batchMode ? (
                  batchTemplate ? (
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                      🎯 选定模板：{allTasksMap[batchTemplate.taskId] || batchTemplate.taskId} ({batchTemplate.dateStr})，按住鼠标拖拽或单选目标单元格快速填充
                      <Button 
                        type="link" 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); setBatchTemplate(null); }}
                        style={{ padding: '0 4px', fontSize: 11, color: '#fa8c16' }}
                      >
                        (更换模板)
                      </Button>
                    </span>
                  ) : (
                    <span style={{ color: '#fa8c16', fontWeight: 600 }}>
                      👉 请先点击一个【已有值班的单元格】作为标准模板
                    </span>
                  )
                ) : (
                  '💡 点击单元格即可排班，左侧任务列在横向滚动时将自动悬浮固定'
                )}
              </div>
              {!batchMode ? (
                <Button 
                  size="small" 
                  onClick={() => {
                    setBatchMode(true);
                    setSelectedCell(null);
                    setSchedulesSnapshot(JSON.parse(JSON.stringify(schedules)));
                    message.info('已进入批量排班模式，请点选一个已有排班格作为标准模板');
                  }}
                >
                  批量排班
                </Button>
              ) : (
                <>
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: '#52c41a', borderColor: '#52c41a' }}
                    icon={<CheckOutlined />}
                    onClick={() => {
                      message.success('排班保存并生效成功！');
                      setBatchMode(false);
                      setBatchTemplate(null);
                      setSchedulesSnapshot(null);
                    }}
                  >
                    保存排班
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      if (schedulesSnapshot) {
                        setSchedules(schedulesSnapshot);
                      }
                      setBatchMode(false);
                      setBatchTemplate(null);
                      setSchedulesSnapshot(null);
                      message.info('已取消并放弃本次批量排班调整');
                    }}
                  >
                    取消
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 表格容器 */}
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th className="task-col">事件/任务名称</th>
                  {datesToRender.map(date => (
                    <th key={date.format('YYYY-MM-DD')} className="date-col">
                      <div className="date-header-cell">
                        <span className="date-num">{date.format('D')}</span>
                        <span className="date-week">周{['日', '一', '二', '三', '四', '五', '六'][date.day()]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleTasks
                  .filter(group => !filterTaskType || filterTaskType === 'all' || group.type === filterTaskType)
                  .map(group => (
                    <React.Fragment key={group.type}>
                      {/* 分组表头行 */}
                      <tr className="group-header-row">
                        <td colSpan={datesToRender.length + 1}>
                          <span className="group-header-text">{group.type}</span>
                        </td>
                      </tr>
                      
                      {/* 各类任务行 */}
                      {group.items.map(task => (
                        <tr key={task.id}>
                          <td className="task-col">{task.name}</td>
                          {datesToRender.map(date => {
                            const dateStr = date.format('YYYY-MM-DD');
                            const existing = schedules[task.id]?.[dateStr];
                            const isSelected = selectedCell?.taskId === task.id && selectedCell?.dateStr === dateStr;
                            
                            let pillClass = 'unscheduled';
                            let pillText = '未排班';
                            
                            if (existing) {
                              const status = getCellStatus(dateStr, task.id);
                              pillClass = `status-${status}`;
                              pillText = existing.dutyUnit;
                            }
                            
                            // 悬停时替换文字为 "点击排班"
                            const isHovered = hoveredCellKey === `${task.id}_${dateStr}`;
                            // 批量模式且有模板时，悬停显示 "填充此格"
                            const displayPillText = batchMode && batchTemplate
                              ? (isHovered ? '填充此格' : pillText)
                              : ((!existing && isHovered) ? '点击排班' : pillText);
                            
                            // 如果设置了值班单位筛选，非此单位或未排班的淡化显示
                            const isFaded = filterDutyUnit && filterDutyUnit !== 'all' && (!existing || existing.dutyUnit !== filterDutyUnit);
                            
                            const isTemplate = batchMode && batchTemplate?.taskId === task.id && batchTemplate?.dateStr === dateStr;
                            const isDragSelected = batchMode && dragSelectedCells.some(cell => cell.taskId === task.id && cell.dateStr === dateStr);
                            
                            let cellClassName = 'date-col';
                            if (batchMode) {
                              if (isTemplate) cellClassName += ' schedule-cell-template';
                              if (isDragSelected) cellClassName += ' schedule-cell-preview';
                            } else if (isSelected) {
                              cellClassName += ' schedule-cell-selected';
                            }

                            const cellContent = (
                              <div 
                                className={`schedule-cell-pill ${pillClass}`}
                                onMouseEnter={() => setHoveredCellKey(`${task.id}_${dateStr}`)}
                                onMouseLeave={() => setHoveredCellKey(null)}
                                style={{ 
                                  opacity: isFaded ? 0.35 : 1,
                                  boxShadow: (!isFaded && existing && filterDutyUnit && filterDutyUnit !== 'all') ? '0 0 8px var(--primary-color)' : undefined
                                }}
                              >
                                {displayPillText}
                              </div>
                            );
                            
                            return (
                              <td 
                                key={dateStr}
                                className={cellClassName}
                                onClick={() => {
                                  if (!batchMode) {
                                    handleCellClick(task.id, dateStr);
                                  }
                                }}
                                onMouseDown={(e) => {
                                  if (batchMode) {
                                    e.preventDefault();
                                    handleCellMouseDown(task.id, dateStr);
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (batchMode) {
                                    handleCellMouseEnter(task.id, dateStr);
                                  }
                                }}
                                style={{ padding: 4 }}
                              >
                                {!batchMode && isSelected ? (
                                  <Popover
                                    open={isSelected}
                                    content={renderPopoverForm()}
                                    trigger="click"
                                    placement="bottom"
                                    overlayClassName="schedule-popover-overlay"
                                    destroyTooltipOnHide
                                  >
                                    {cellContent}
                                  </Popover>
                                ) : (
                                  cellContent
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 排班统计图表 */}
      {activeTab === 'schedule-stats' && (
        <div className="schedule-stats-container">
          {/* 顶栏卡片 */}
          <div className="stats-summary-cards">
            <div className="stats-card-premium">
              <span className="stats-card-label">排班事件总数</span>
              <span className="stats-card-val">22 种</span>
            </div>
            <div className="stats-card-premium">
              <span className="stats-card-label">已完成值班</span>
              <span className="stats-card-val completed">148 天</span>
            </div>
            <div className="stats-card-premium">
              <span className="stats-card-label">今日正在进行中</span>
              <span className="stats-card-val ongoing">3 处</span>
            </div>
            <div className="stats-card-premium">
              <span className="stats-card-label">待执行值班</span>
              <span className="stats-card-val overdue">85 天</span>
            </div>
          </div>
          
          {/* 图表行 */}
          <div className="stats-charts-row">
            <Card title="排班任务量日历负荷分析 (今日起)" bordered={false} className="dashboard-card" style={{ background: '#fff', borderRadius: 8 }}>
              <div ref={statsChartRef} style={{ width: '100%', height: '320px' }} />
            </Card>
            <Card title="值班单位排班天数占比" bordered={false} className="dashboard-card" style={{ background: '#fff', borderRadius: 8 }}>
              <div ref={statsPieRef} style={{ width: '100%', height: '320px' }} />
            </Card>
          </div>
        </div>
      )}

      {/* 今日/当月 2x2 面板 */}
      {(activeTab === 'today' || activeTab === 'month') && (
        <div className="dashboard-grid">
          {/* 第一行 */}
          <div className="grid-row">
            {/* 数据概览 */}
            <Card className="dashboard-card overview-card" bordered={false}>
              <div className="card-header">
                <div className="card-title">
                  <BarChartOutlined className="title-icon" />
                  <span>数据概览</span>
                </div>
              </div>
              <div className="overview-content">
                <div
                  className="overview-nav left"
                  onClick={() => scrollOverview('left')}
                >
                  <ArrowLeftOutlined />
                </div>
                <div className="overview-scroll-container">
                  <div className="overview-items" ref={overviewRef}>
                    {overviewItems.map((item) => (
                      <div key={item.key} className="overview-item">
                        <div className="overview-value">{item.value}</div>
                        <div className="overview-label">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="overview-nav right"
                  onClick={() => scrollOverview('right')}
                >
                  <ArrowRightOutlined />
                </div>
              </div>
            </Card>

            {/* 敏感时间/事件节点 */}
            <Card className="dashboard-card events-card" bordered={false}>
              <div className="card-header">
                <div className="card-title">
                  <ExclamationCircleOutlined className="title-icon warning" />
                  <span>敏感时间/事件节点</span>
                </div>
              </div>
              <div className="events-content">
                {sensitiveEvents.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无节点信息"
                  />
                ) : (
                  <div className="events-list">
                    {sensitiveEvents.map((event) => (
                      <div key={event.id} className="event-item">
                        {event.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 第二行 */}
          <div className="grid-row">
            {/* 专项任务 */}
            <Card className="dashboard-card tasks-card" bordered={false}>
              <div className="card-header">
                <div className="card-title">
                  <TeamOutlined className="title-icon" />
                  <span>专项任务</span>
                </div>
                <a className="more-link">更多</a>
              </div>
              <div className="tasks-list">
                {specialTasks.map((task) => renderTaskCard(task, 'special'))}
              </div>
            </Card>

            {/* 安保任务 */}
            <Card className="dashboard-card tasks-card" bordered={false}>
              <div className="card-header">
                <div className="card-title">
                  <CalendarOutlined className="title-icon" />
                  <span>安保任务</span>
                </div>
                <a className="more-link">更多</a>
              </div>
              <div className="tasks-list">
                {securityTasks.map((task) => renderTaskCard(task, 'security'))}
              </div>
            </Card>
          </div>
        </div>
      )}

      <InstructionCommandModal
        open={!!commandTask}
        onCancel={() => setCommandTask(null)}
        onSubmit={handleTaskCommandSubmit}
        targetSummary={
          commandTask ? (
            <>
              本次将针对「<strong>{commandTask.name}</strong>」任务批量下达处置指令
            </>
          ) : null
        }
      />
    </div>
  );
};

export default SourceControlCQ;
