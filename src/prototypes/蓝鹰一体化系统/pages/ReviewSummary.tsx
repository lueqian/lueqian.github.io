import React, { useEffect, useRef, useState } from 'react';
import { Button, Select, DatePicker, Table, Tabs, Tooltip } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  FormOutlined,
  SendOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FolderOpenOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CaretDownOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import * as echarts from 'echarts';

const { RangePicker } = DatePicker;

// 41个区县名单
const DISTRICT_NAMES = [
  '清江浦区', '淮安区', '淮阴区', '洪泽区', '涟水县', '盱眙县', '金湖县', '开发区', '新城区', '生态文旅区',
  '工业园区', '高新区', '盐都区', '亭湖区', '响水县', '滨海县', '阜宁县', '射阳县', '建湖县', '东台市',
  '大丰区', '海陵区', '高港区', '姜堰区', '兴化市', '靖江市', '泰兴市', '崇川区', '通州区', '海门区',
  '启东市', '如皋市', '如东县', '海安市', '京口区', '润州区', '丹徒区', '丹阳市', '扬中市', '句容市',
  '新北区'
];

interface DistrictData {
  name: string;
  reportNum: number;
  submitNum: number;
  findDuration: number; // 分钟
  taskCount: number;
  signDuration: number; // 分钟
  feedbackDuration: number; // 分钟
  checkTaskCount: number;
  timeoutCount: number;
  unfinishedCount: number;
  // 以下为计算生成的排名与得分
  reportRank?: number;
  submitRank?: number;
  findRank?: number;
  signRank?: number;
  feedbackRank?: number;
  checkRank?: number;
  score?: number;
  [key: string]: string | number | undefined; // 增加索引签名支持动态 Key 索引
}

// 模拟表格数据
const bestUnitsData = [
  { key: '1', unit: '淮安区', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '2', unit: '涟水县', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '3', unit: '洪泽区', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '4', unit: '淮阴区', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '5', unit: '盱眙县', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '6', unit: '开发区', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '7', unit: '金湖县', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '8', unit: '新城区', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '9', unit: '清江浦区', reportNum: 0, submitNum: 0, rate: '0.00%' },
];

const bestUsersData = [
  { key: '1', name: '张明', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '2', name: '李倩', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '3', name: '王敏', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '4', name: '刘浩宇', reportNum: 0, submitNum: 0, rate: '0.00%' },
  { key: '5', name: '陈思远', reportNum: 0, submitNum: 0, rate: '0.00%' },
];

const ReviewSummary: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<keyof DistrictData>('score');

  const reportChartRef = useRef<HTMLDivElement>(null);
  const commandChartRef = useRef<HTMLDivElement>(null);
  const qualityChartRef = useRef<HTMLDivElement>(null);

  // 1. 生成 41 个区县的初始基础数据
  const rawQualityData = React.useMemo<DistrictData[]>(() => {
    let multiplier = 1;
    if (timeRange === 'week') multiplier = 0.25;
    if (timeRange === 'year') multiplier = 12;

    return DISTRICT_NAMES.map((name, index) => {
      const seed = ((index + 1) * 17) % 100;
      return {
        name,
        reportNum: Math.floor((seed % 15 + 2) * multiplier),
        submitNum: Math.floor((seed % 25 + 5) * multiplier),
        findDuration: Math.floor((seed % 70 + 10) * (timeRange === 'year' ? 0.8 : 1)),
        taskCount: Math.floor((seed % 40 + 10) * multiplier),
        signDuration: Math.floor((seed % 20 + 2) * (timeRange === 'year' ? 0.7 : 1)),
        feedbackDuration: Math.floor((seed % 35 + 5) * (timeRange === 'year' ? 0.9 : 1)),
        checkTaskCount: Math.floor((seed % 18 + 1) * multiplier),
        timeoutCount: Math.max(0, Math.floor((seed % 6 - 3) * multiplier * 0.5)),
        unfinishedCount: Math.max(0, Math.floor((seed % 4 - 2) * multiplier * 0.5)),
      };
    });
  }, [timeRange]);

  // 2. 动态计算各维度的排名与质效评分
  const districtsQualityList = React.useMemo<DistrictData[]>(() => {
    const getRank = (key: keyof DistrictData, asc = false) => {
      const sorted = [...rawQualityData].sort((a, b) => {
        const va = (a as any)[key] as number;
        const vb = (b as any)[key] as number;
        return asc ? va - vb : vb - va;
      });
      return (item: DistrictData) => sorted.findIndex((x) => x.name === item.name) + 1;
    };

    const reportRankFn = getRank('reportNum', false); // 越大越前
    const submitRankFn = getRank('submitNum', false); // 越大越前
    const findRankFn = getRank('findDuration', true);   // 越小越前
    const signRankFn = getRank('signDuration', true);   // 越小越前
    const feedbackRankFn = getRank('feedbackDuration', true); // 越小越前
    const checkRankFn = getRank('checkTaskCount', false); // 越大越前

    return rawQualityData.map((item) => {
      const rRank = reportRankFn(item);
      const sRank = submitRankFn(item);
      const fRank = findRankFn(item);
      const sgRank = signRankFn(item);
      const fbRank = feedbackRankFn(item);
      const cRank = checkRankFn(item);

      // 质效评分计算公式
      const score = 0.7 * (50 - rRank)
                  + 0.3 * (50 - sRank)
                  + 0.4 * (50 - fRank)
                  + 0.4 * (50 - item.taskCount)
                  + 0.4 * (50 - sgRank)
                  + 0.4 * (50 - fbRank)
                  + 0.4 * (50 - cRank)
                  - item.timeoutCount * 5
                  - item.unfinishedCount * 10;

      return {
        ...item,
        reportRank: rRank,
        submitRank: sRank,
        findRank: fRank,
        signRank: sgRank,
        feedbackRank: fbRank,
        checkRank: cRank,
        score,
      };
    });
  }, [rawQualityData]);

  // 3. 根据选中的指标对区县数据进行降序排序
  const sortedQualityData = React.useMemo<DistrictData[]>(() => {
    return [...districtsQualityList].sort((a, b) => {
      const va = (a as any)[selectedMetric] as number;
      const vb = (b as any)[selectedMetric] as number;
      return vb - va; // 降序排
    });
  }, [districtsQualityList, selectedMetric]);

  // 4. 初始化和更新 ECharts 图表
  useEffect(() => {
    let reportChart: echarts.ECharts | null = null;
    let commandChart: echarts.ECharts | null = null;
    let qualityChart: echarts.ECharts | null = null;

    // A. 初始化上报/编报量 ECharts 柱状图
    if (reportChartRef.current) {
      reportChart = echarts.init(reportChartRef.current);
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['上报量', '编报量'],
          bottom: 10,
          itemWidth: 12,
          itemHeight: 12,
          icon: 'rect',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '22%',
          top: '8%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['清江浦区', '新城区', '金湖县', '开发区', '盱眙县', '淮阴区', '洪泽区', '涟水县', '淮安区'],
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#64748b', fontSize: 11 },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 1.0,
          interval: 0.2,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f1f5f9' } },
          axisLabel: { color: '#64748b' },
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100,
            height: 18,
            bottom: 45,
            borderColor: 'transparent',
            fillerColor: 'rgba(59, 130, 246, 0.12)',
            backgroundColor: '#f1f5f9',
            handleIcon: 'path://M-1.5,0.5h3v9h-3V0.5z M-0.5,1.5h1v7h-1V1.5z',
            handleSize: '100%',
            handleStyle: { color: '#3b82f6' },
            textStyle: { color: 'transparent' },
          },
        ],
        series: [
          {
            name: '上报量',
            type: 'bar',
            barWidth: '15%',
            itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: '编报量',
            type: 'bar',
            barWidth: '15%',
            itemStyle: { color: '#ec4899', borderRadius: [4, 4, 0, 0] },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      };
      reportChart.setOption(option);
    }

    // B. 初始化指令类型统计 ECharts 环形图
    if (commandChartRef.current) {
      commandChart = echarts.init(commandChartRef.current);
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: '#64748b' },
        },
        series: [
          {
            name: '指令类型比重',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '42%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: { show: true, fontSize: 16, fontWeight: 'bold' },
            },
            labelLine: { show: false },
            data: [
              { value: 120, name: '帖文处置', itemStyle: { color: '#6366f1' } },
              { value: 85, name: '谣言核查', itemStyle: { color: '#3b82f6' } },
              { value: 64, name: '劝删下达', itemStyle: { color: '#f43f5e' } },
              { value: 45, name: '本地动态监测', itemStyle: { color: '#10b981' } },
              { value: 30, name: '材料反馈', itemStyle: { color: '#f59e0b' } },
            ],
          },
        ],
      };
      commandChart.setOption(option);
    }

    // C. 初始化和更新区县质效统计图 (横向柱状图)
    if (qualityChartRef.current) {
      qualityChart = echarts.init(qualityChartRef.current);
      const metricLabelMap: Record<string, string> = {
        score: '质效评分 (分)',
        reportNum: '编报数 (个)',
        submitNum: '上报数 (个)',
        findDuration: '平均发现耗时 (分钟)',
        taskCount: '参与任务总数 (个)',
        signDuration: '平均签收耗时 (分钟)',
        feedbackDuration: '平均反馈耗时 (分钟)',
        checkTaskCount: '落查任务数 (个)',
        timeoutCount: '任务超时数 (个)',
        unfinishedCount: '点名任务未完成数 (个)',
      };

      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const dataIndex = params[0].dataIndex;
            const item = sortedQualityData[dataIndex];
            if (!item) return '';
            return `
              <div style="font-weight:bold; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom:4px;">
                ${item.name} 综合质效台账
              </div>
              <div style="font-size:12px; line-height: 1.8;">
                <span style="color:#6366f1; font-weight:bold;">🏆 综合质效评分: ${item.score ? item.score.toFixed(2) : 0} 分</span><br/>
                编报数: <strong style="color:#334155">${item.reportNum}</strong> (排名: ${item.reportRank})<br/>
                上报数: <strong style="color:#334155">${item.submitNum}</strong> (排名: ${item.submitRank})<br/>
                平均发现耗时: <strong style="color:#334155">${item.findDuration}分钟</strong> (排名: ${item.findRank})<br/>
                参与任务总数: <strong style="color:#334155">${item.taskCount}</strong><br/>
                平均签收耗时: <strong style="color:#334155">${item.signDuration}分钟</strong> (排名: ${item.signRank})<br/>
                平均反馈耗时: <strong style="color:#334155">${item.feedbackDuration}分钟</strong> (排名: ${item.feedbackRank})<br/>
                落查任务数: <strong style="color:#334155">${item.checkTaskCount}</strong> (排名: ${item.checkRank})<br/>
                <span style="color:#ef4444;">任务超时数: ${item.timeoutCount}</span><br/>
                <span style="color:#ef4444;">点名未完成数: ${item.unfinishedCount}</span>
              </div>
            `;
          },
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '5%',
          top: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f1f5f9' } },
          axisLabel: { color: '#64748b' },
          name: metricLabelMap[selectedMetric as string] || '',
          nameTextStyle: { color: '#94a3b8', fontSize: 11 },
        },
        yAxis: {
          type: 'category',
          data: sortedQualityData.map((d) => d.name),
          inverse: true, // 第 1 名在最上面
          axisLabel: { color: '#475569', fontSize: 11 },
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisTick: { show: false },
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            yAxisIndex: [0],
            right: 15,
            start: 0,
            end: 25, // 默认显示 10 个左右区县 (10/41 约等于 25%)
            width: 14,
            borderColor: 'transparent',
            fillerColor: 'rgba(99, 102, 241, 0.1)',
            backgroundColor: '#f8fafc',
            handleIcon: 'path://M-0.5,0.5h1v9h-1V0.5z',
            handleSize: '80%',
            handleStyle: { color: '#cbd5e1' },
            textStyle: { color: 'transparent' },
          },
          {
            type: 'inside',
            yAxisIndex: [0],
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],
        series: [
          {
            name: metricLabelMap[selectedMetric as string] || '',
            type: 'bar',
            data: sortedQualityData.map((d) => (d as any)[selectedMetric] as number),
            barWidth: '60%',
            itemStyle: {
              color: selectedMetric === 'score'
                ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#818cf8' },
                    { offset: 1, color: '#6366f1' },
                  ])
                : new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#60a5fa' },
                    { offset: 1, color: '#3b82f6' },
                  ]),
              borderRadius: [0, 4, 4, 0],
            },
            showBackground: true,
            backgroundStyle: {
              color: '#f8fafc',
              borderRadius: [0, 4, 4, 0],
            },
          },
        ],
      };
      qualityChart.setOption(option);
    }

    const handleResize = () => {
      reportChart?.resize();
      commandChart?.resize();
      qualityChart?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      reportChart?.dispose();
      commandChart?.dispose();
      qualityChart?.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [sortedQualityData, selectedMetric]);

  const unitColumns = [
    { title: '单位', dataIndex: 'unit', key: 'unit', width: '25%' },
    { title: '编报数', dataIndex: 'reportNum', key: 'reportNum', width: '25%' },
    { title: '上报数', dataIndex: 'submitNum', key: 'submitNum', width: '25%' },
    {
      title: (
        <span style={{ cursor: 'pointer' }}>
          编报率 <CaretDownOutlined style={{ color: '#3b82f6', marginLeft: 2 }} />
        </span>
      ),
      dataIndex: 'rate',
      key: 'rate',
      width: '25%',
      render: (text: string) => (
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>{text}</span>
      ),
    },
  ];

  const userColumns = [
    { title: '人员', dataIndex: 'name', key: 'name', width: '25%' },
    { title: '编报数', dataIndex: 'reportNum', key: 'reportNum', width: '25%' },
    { title: '上报数', dataIndex: 'submitNum', key: 'submitNum', width: '25%' },
    {
      title: (
        <span style={{ cursor: 'pointer' }}>
          编报率 <CaretDownOutlined style={{ color: '#3b82f6', marginLeft: 2 }} />
        </span>
      ),
      dataIndex: 'rate',
      key: 'rate',
      width: '25%',
      render: (text: string) => (
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>{text}</span>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: '最优编报单位',
      children: (
        <Table
          dataSource={bestUnitsData}
          columns={unitColumns}
          pagination={false}
          size="small"
          bordered={false}
          className="best-leaderboard-table"
        />
      ),
    },
    {
      key: '2',
      label: '最优编报人',
      children: (
        <Table
          dataSource={bestUsersData}
          columns={userColumns}
          pagination={false}
          size="small"
          bordered={false}
          className="best-leaderboard-table"
        />
      ),
    },
  ];

  return (
    <div className="review-summary-container">
      {/* 顶部检索区 */}
      <section className="review-filter-bar">
        <div className="filter-item">
          <span className="filter-label">统计周期</span>
          <RangePicker
            showTime
            defaultValue={[dayjs('2026-07-01 00:00:00'), dayjs('2026-07-16 23:59:59')]}
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: 340 }}
          />
        </div>
        <div className="filter-item">
          <span className="filter-label">单位</span>
          <Select placeholder="请选择" style={{ width: 140 }} options={[{ value: 'all', label: '全部单位' }]} />
        </div>
        <div className="filter-item">
          <span className="filter-label">指令</span>
          <Select defaultValue="all" style={{ width: 140 }} options={[{ value: 'all', label: '全部指令' }]} />
        </div>
        <div className="filter-item">
          <span className="filter-label">来源</span>
          <Select placeholder="请选择" style={{ width: 140 }} options={[{ value: 'all', label: '全部来源' }]} />
        </div>
        <div className="filter-item">
          <span className="filter-label">舆情类型</span>
          <Select placeholder="请选择" style={{ width: 140 }} options={[{ value: 'all', label: '全部类型' }]} />
        </div>
        <div className="filter-actions">
          <Button className="reset-btn">重置</Button>
          <Button type="primary" className="query-btn">查询</Button>
        </div>
      </section>

      {/* 第一大层：处置效率 (左) + 核心指标卡片群 (右) */}
      <section className="summary-row-top">
        {/* 左侧：总处置效率 */}
        <div className="efficiency-panel-left">
          <div className="section-title">
            <span className="title-vertical-bar" />
            <h3>总处置效率</h3>
          </div>
          <div className="efficiency-circles-row">
            <div className="efficiency-card">
              <div className="circle-icon-bg red">
                <SearchOutlined />
              </div>
              <div className="efficiency-meta">
                <div className="label">
                  发现效率
                  <Tooltip title="从发生到系统发现的时间"><QuestionCircleOutlined className="info-icon" /></Tooltip>
                </div>
                <div className="value">1时10分</div>
              </div>
            </div>

            <div className="efficiency-card">
              <div className="circle-icon-bg orange">
                <EyeOutlined />
              </div>
              <div className="efficiency-meta">
                <div className="label">
                  研判效率
                  <Tooltip title="从发现到研判完成的时间"><QuestionCircleOutlined className="info-icon" /></Tooltip>
                </div>
                <div className="value">1分14秒</div>
              </div>
            </div>

            <div className="efficiency-card">
              <div className="circle-icon-bg green">
                <EditOutlined />
              </div>
              <div className="efficiency-meta">
                <div className="label">
                  编报效率
                  <Tooltip title="从研判到生成专报的时间"><QuestionCircleOutlined className="info-icon" /></Tooltip>
                </div>
                <div className="value">0秒</div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：12个卡片群 (5列-3行 网格) */}
        <div className="indicators-grid-right">
          {/* 第一排 */}
          <div className="indicator-card purple">
            <div className="card-top">
              <div className="icon-wrapper"><MessageOutlined /></div>
              <div className="card-label">舆情总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">821</div>
          </div>
          <div className="indicator-card blue">
            <div className="card-top">
              <div className="icon-wrapper"><FileTextOutlined /></div>
              <div className="card-label">处置总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">130</div>
          </div>
          <div className="indicator-card green">
            <div className="card-top">
              <div className="icon-wrapper"><CloudUploadOutlined /></div>
              <div className="card-label">上报总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">137</div>
          </div>
          <div className="indicator-card orange">
            <div className="card-top">
              <div className="icon-wrapper"><FormOutlined /></div>
              <div className="card-label">编报总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">0</div>
          </div>
          <div className="indicator-card red">
            <div className="card-top">
              <div className="icon-wrapper"><SendOutlined /></div>
              <div className="card-label">下达指令 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">255</div>
          </div>

          {/* 第二排 */}
          <div className="indicator-card purple">
            <div className="card-top">
              <div className="icon-wrapper"><CheckCircleOutlined /></div>
              <div className="card-label">完成指令 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">15</div>
          </div>
          <div className="indicator-card cyan">
            <div className="card-top">
              <div className="icon-wrapper"><SafetyOutlined /></div>
              <div className="card-label">布控任务总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">47</div>
          </div>
          <div className="indicator-card magenta">
            <div className="card-top">
              <div className="icon-wrapper"><WarningOutlined /></div>
              <div className="card-label">重大事件总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">29</div>
          </div>
          <div className="indicator-card darkgreen">
            <div className="card-top">
              <div className="icon-wrapper"><FolderOpenOutlined /></div>
              <div className="card-label">专项专班 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">1</div>
          </div>
          <div className="indicator-card lightblue">
            <div className="card-top">
              <div className="icon-wrapper"><SafetyOutlined /></div>
              <div className="card-label">安保任务 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">3</div>
          </div>

          {/* 第三排 */}
          <div className="indicator-card large-2 span-2">
            <div className="card-top">
              <div className="icon-wrapper"><EnvironmentOutlined /></div>
              <div className="card-label">重点阵地总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">0</div>
          </div>
          <div className="indicator-card large-3 span-3">
            <div className="card-top">
              <div className="icon-wrapper"><UserOutlined /></div>
              <div className="card-label">重点账号总量 <QuestionCircleOutlined className="card-help" /></div>
            </div>
            <div className="card-value">135</div>
          </div>
        </div>
      </section>

      {/* 新增大层：区县质效统计图 (放置在总处置效率和上报量统计之间) */}
      <section className="summary-row-quality">
        <div className="district-quality-panel">
          <div className="panel-header-with-filter">
            <div className="section-title">
              <span className="title-vertical-bar" />
              <h3>区县质效统计图</h3>
            </div>
            <div className="panel-filters">
              {/* 自然周/月/年时间维度切换 */}
              <div className="time-select-group">
                <button
                  type="button"
                  className={timeRange === 'week' ? 'active' : ''}
                  onClick={() => setTimeRange('week')}
                >
                  自然周
                </button>
                <button
                  type="button"
                  className={timeRange === 'month' ? 'active' : ''}
                  onClick={() => setTimeRange('month')}
                >
                  自然月
                </button>
                <button
                  type="button"
                  className={timeRange === 'year' ? 'active' : ''}
                  onClick={() => setTimeRange('year')}
                >
                  自然年
                </button>
              </div>

              {/* 指标切换选择器 */}
              <Select
                value={selectedMetric}
                onChange={setSelectedMetric}
                style={{ width: 180 }}
                options={[
                  { value: 'score', label: '综合质效评分' },
                  { value: 'reportNum', label: '编报数' },
                  { value: 'submitNum', label: '上报数' },
                  { value: 'findDuration', label: '平均发现耗时' },
                  { value: 'taskCount', label: '参与任务总数' },
                  { value: 'signDuration', label: '平均签收耗时' },
                  { value: 'feedbackDuration', label: '平均反馈耗时' },
                  { value: 'checkTaskCount', label: '落查任务数' },
                  { value: 'timeoutCount', label: '任务超时数' },
                  { value: 'unfinishedCount', label: '点名任务未完成数' },
                ]}
              />
            </div>
          </div>
          <div ref={qualityChartRef} className="echarts-container" style={{ height: 420 }} />
        </div>
      </section>

      {/* 第二大层：上报/编报统计图表 (左) + 最优排行表格 (右) */}
      <section className="summary-row-middle">
        {/* 左下：上报/编报量统计 */}
        <div className="report-bar-panel-left">
          <div className="panel-header-with-filter">
            <div className="section-title">
              <span className="title-vertical-bar" />
              <h3>上报/编报量统计</h3>
            </div>
            <div className="panel-filters">
              <Select defaultValue="all-sources" style={{ width: 120 }} size="small" options={[{ value: 'all-sources', label: '全部来源' }]} />
              <Select defaultValue="all-units" style={{ width: 120 }} size="small" options={[{ value: 'all-units', label: '全部单位' }]} />
            </div>
          </div>
          <div ref={reportChartRef} className="echarts-container" style={{ height: 280 }} />
        </div>

        {/* 右下：最优编报排行榜 */}
        <div className="leaderboard-panel-right">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="leaderboard-tabs"
          />
        </div>
      </section>

      {/* 第三大层：指令类型统计 */}
      <section className="summary-row-bottom">
        <div className="command-pie-panel">
          <div className="panel-header-with-filter">
            <div className="section-title">
              <span className="title-vertical-bar" />
              <h3>指令类型统计</h3>
            </div>
            <div className="panel-filters">
              <Select defaultValue="all-posts" style={{ width: 120 }} size="small" options={[{ value: 'all-posts', label: '全部岗位' }]} />
              <Select defaultValue="all-units" style={{ width: 120 }} size="small" options={[{ value: 'all-units', label: '全部单位' }]} />
              <Select defaultValue="all-commands" style={{ width: 120 }} size="small" options={[{ value: 'all-commands', label: '全部指令' }]} />
            </div>
          </div>
          <div ref={commandChartRef} className="echarts-container" style={{ height: 260 }} />
        </div>
      </section>
    </div>
  );
};

export default ReviewSummary;
