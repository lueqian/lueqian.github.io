import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Tag,
  Tooltip,
  Segmented,
  Space,
  message,
} from 'antd';
import {
  CopyOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TableOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LineChartOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  FieldTimeOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import '../scenario-style.css';

interface ScenarioSourceControlBuzzProps {
  initialScenario?: 'weighted' | 'basic';
}

const ScenarioSourceControlBuzz: React.FC<ScenarioSourceControlBuzzProps> = ({
  initialScenario = 'weighted',
}) => {
  const [activeScenario, setActiveScenario] = useState<'weighted' | 'basic'>(initialScenario);
  const [trendDimension, setTrendDimension] = useState<'volume' | 'interaction' | 'sentiment'>('volume');

  // 当外部传入 initialScenario 变更时同步
  useEffect(() => {
    setActiveScenario(initialScenario);
  }, [initialScenario]);

  // ECharts 图表容器引用
  const trendChartRef = useRef<HTMLDivElement>(null);
  const mediaPieChartRef = useRef<HTMLDivElement>(null);
  const sentimentChartRef = useRef<HTMLDivElement>(null);
  const rankChartRef = useRef<HTMLDivElement>(null);

  // 初始化下方 5 个图表（维持客观篇数统计）
  useEffect(() => {
    // 1. 传播趋势折线图
    if (trendChartRef.current) {
      const chart = echarts.init(trendChartRef.current);
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: {
          bottom: 0,
          data: ['全部', 'APP', '今日头条', '境外', '小红书', '微信', '微博', '抖音', '新闻'],
          itemWidth: 10,
          itemHeight: 6,
          textStyle: { fontSize: 11, color: '#64748b' },
        },
        grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00', '07:00', '10:00'],
          axisLine: { lineStyle: { color: '#cbd5e1' } },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#f1f5f9' } },
        },
        series: [
          {
            name: '全部',
            type: 'line',
            smooth: true,
            data: [0, 1, 2, 0, 3, 4, 1, 2, 0],
            lineStyle: { width: 2, color: '#3b82f6' },
            itemStyle: { color: '#3b82f6' },
          },
          {
            name: '今日头条',
            type: 'line',
            smooth: true,
            data: [0, 1, 1, 0, 2, 3, 0, 2, 0],
            lineStyle: { width: 1.5, color: '#ef4444' },
            itemStyle: { color: '#ef4444' },
          },
          {
            name: 'APP',
            type: 'line',
            smooth: true,
            data: [0, 0, 1, 0, 1, 1, 1, 0, 0],
            lineStyle: { width: 1.5, color: '#10b981' },
            itemStyle: { color: '#10b981' },
          },
          {
            name: '新闻',
            type: 'line',
            smooth: true,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            lineStyle: { width: 1.5, color: '#f59e0b' },
            itemStyle: { color: '#f59e0b' },
          },
        ],
      });
      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
    }

    // 2. 阵地类型分析饼图
    if (mediaPieChartRef.current) {
      const chart = echarts.init(mediaPieChartRef.current);
      chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c}篇 ({d}%)' },
        legend: {
          bottom: 0,
          data: ['今日头条', '小红书', '微信', '新闻', 'APP'],
          textStyle: { fontSize: 11, color: '#64748b' },
        },
        series: [
          {
            name: '阵地类型',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '45%'],
            data: [
              { value: 9, name: '今日头条', itemStyle: { color: '#3b82f6' } },
              { value: 8, name: 'APP', itemStyle: { color: '#f97316' } },
              { value: 3, name: '新闻', itemStyle: { color: '#10b981' } },
              { value: 2, name: '微信', itemStyle: { color: '#8b5cf6' } },
              { value: 1, name: '小红书', itemStyle: { color: '#ec4899' } },
            ],
            label: {
              formatter: '{b}: {d}%',
              fontSize: 11,
            },
          },
        ],
      });
      window.addEventListener('resize', () => chart.resize());
    }

    // 3. 情感分析环形图
    if (sentimentChartRef.current) {
      const chart = echarts.init(sentimentChartRef.current);
      chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c}篇 ({d}%)' },
        legend: {
          bottom: 0,
          data: ['中性', '负面', '正面'],
          textStyle: { fontSize: 11, color: '#64748b' },
        },
        series: [
          {
            name: '情感倾向',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            data: [
              { value: 15, name: '中性', itemStyle: { color: '#06b6d4' } },
              { value: 7, name: '负面', itemStyle: { color: '#3b82f6' } },
              { value: 1, name: '正面', itemStyle: { color: '#f43f5e' } },
            ],
            label: {
              formatter: '{d}%',
              fontSize: 11,
            },
          },
        ],
      });
      window.addEventListener('resize', () => chart.resize());
    }

    // 4. 媒体参与排名条形图
    if (rankChartRef.current) {
      const chart = echarts.init(rankChartRef.current);
      chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '8%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#f1f5f9' } } },
        yAxis: {
          type: 'category',
          data: ['夜小观', '小红书', 'UC官网_UC大鱼号', 'UC头条', '网易手机端', '网易', '微信', '今日头条'],
          axisLine: { lineStyle: { color: '#cbd5e1' } },
          axisLabel: { fontSize: 11, color: '#64748b' },
        },
        series: [
          {
            type: 'bar',
            data: [1, 1, 1, 1, 2, 2, 2, 9],
            barWidth: 10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: '#2563eb' },
                { offset: 1, color: '#60a5fa' },
              ]),
              borderRadius: [0, 4, 4, 0],
            },
            label: { show: true, position: 'right', fontSize: 10, color: '#64748b' },
          },
        ],
      });
      window.addEventListener('resize', () => chart.resize());
    }
  }, []);

  const handleCopySummary = () => {
    const summaryText =
      '10月25日10时41分43秒 - 10月26日10时41分43秒，共检测到相关数据23篇，其中今日头条9篇，APP8篇，新闻3篇，微信2篇，小红书1篇，境外0篇，长视频0篇，论坛0篇，短视频0篇，抖音0篇，微博0篇。负面占比30.43%，正面占比4.35%，中性占比65.22%。主要为今日头条，微信，网易等平台网友扩散舆情。共抓取评论0篇。';
    navigator.clipboard.writeText(summaryText);
    message.success('舆情简述内容已复制到剪贴板');
  };

  return (
    <div className="buzz-scenario-page-container">
      {/* 顶部场景快速切换卡片（专属演示控制器） */}
      <div className="buzz-scenario-switch-card">
        <div className="buzz-scenario-switch-left">
          <span className="buzz-scenario-switch-tag">
            <LineChartOutlined style={{ color: '#1677ff' }} />
            加权声量模型效果对比
          </span>
          <Segmented
            value={activeScenario}
            onChange={(val) => setActiveScenario(val as 'weighted' | 'basic')}
            options={[
              {
                label: '预期效果',
                value: 'weighted',
              },
              {
                label: '原始效果',
                value: 'basic',
              },
            ]}
          />
        </div>
        <div>
          {activeScenario === 'weighted' ? (
            <span className="buzz-scenario-criteria-badge eligible">
              ✓ 预期效果（符合加权条件）：周期 1 天 (≤14天) · 本地市局辖区 · 已获加权模型权限
            </span>
          ) : (
            <span className="buzz-scenario-criteria-badge ineligible">
              ! 原始效果（超期/跨区降级）：周期 30 天 (&gt;14天) 或跨地域 · 自动退回旧版基础篇数方案
            </span>
          )}
        </div>
      </div>

      {/* 任务头部信息横幅 */}
      <div className="buzz-task-header-banner">
        <div className="buzz-task-meta-left">
          <span className="buzz-task-shield-icon">✓</span>
          <span className="buzz-task-title-text">
            {activeScenario === 'weighted'
              ? '富晋福管招商（重点实体事件跟踪）'
              : '跨省市长周期涉稳专项排查盯控（历史归档任务）'}
          </span>
          <span className="buzz-task-time-pill">
            <FieldTimeOutlined style={{ marginRight: 4 }} />
            {activeScenario === 'weighted'
              ? '2026-10-25 10:41:43 至 2026-10-26 10:41:43（周期 1 天 ≤ 14天）'
              : '2026-09-26 10:41:43 至 2026-10-26 10:41:43（周期 30 天 > 14天）'}
          </span>
          <span className="buzz-task-region-pill">
            <GlobalOutlined style={{ marginRight: 4 }} />
            {activeScenario === 'weighted' ? '涉事属地：重庆市局辖区（本地匹配）' : '涉事属地：跨省市/外地市辖区'}
          </span>
          <Tag color={activeScenario === 'weighted' ? 'processing' : 'default'}>
            <SafetyCertificateOutlined style={{ marginRight: 4 }} />
            {activeScenario === 'weighted'
              ? '权限点 eagle:gph:PreventionAtTheSource:weighted_buzz 已生效'
              : '加权权限未开启或超期不满足'}
          </Tag>
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>下发指令状态：全部</div>
      </div>

      {/* 文字综述卡片 */}
      <div className="buzz-summary-box">
        <div>
          <span style={{ fontWeight: 600, color: '#0f172a', marginRight: 8 }}>监测综述：</span>
          10月25日10时41分43秒 - 10月26日10时41分43秒，共检测到相关数据 23 篇，其中今日头条 9 篇，APP 8 篇，新闻 3 篇，微信 2 篇，小红书 1 篇，境外 0 篇，长视频 0 篇，论坛 0 篇，短视频 0 篇，抖音 0 篇，微博 0 篇。负面占比 30.43%，正面占比 4.35%，中性占比 65.22%。主要为今日头条、微信、网易等平台网友扩散舆情。共抓取评论 0 篇。
        </div>
        <Button
          type="primary"
          ghost
          size="small"
          icon={<CopyOutlined />}
          onClick={handleCopySummary}
          style={{ flexShrink: 0, marginLeft: 16 }}
        >
          一键复制
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 核心统计卡片：场景 7【加权声量模型】 VS 场景 8【基础篇数统计】 */}
      {/* ========================================================================= */}
      {activeScenario === 'weighted' ? (
        /* 场景 7：加权声量模型（符合条件）- 上下双层结构 */
        <div className="scenario-buzz-card weighted-card">
          {/* 上层：加权声量与权威度分解矩阵（高度 86px） */}
          <div className="scenario-buzz-upper">
            {/* 1. 总声量主展示区（左侧宽 200px） */}
            <div className="scenario-buzz-main-col">
              <div className="scenario-buzz-circle-icon">
                {/* 44*44px 蓝底内置白色声波矢量图标 */}
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  <path d="M19 5a9 9 0 0 1 0 14" />
                </svg>
              </div>
              <div className="scenario-buzz-main-info">
                <div className="scenario-buzz-title-row">
                  <span className="scenario-buzz-title-text">总声量</span>
                  <Tooltip
                    placement="bottomLeft"
                    overlayClassName="weighted-buzz-pop-dark"
                    mouseEnterDelay={0.05}
                    mouseLeaveDelay={0.1}
                    title={
                      <div>
                        <div style={{ fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4, marginBottom: 6 }}>
                          【声量值计算规则说明】
                        </div>
                        <div style={{ marginBottom: 6, color: '#e5e7eb' }}>
                          本任务当前采用 <strong style={{ color: '#60a5fa' }}>政务加权声量统计模型</strong> 进行实时计算：
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6, color: '#d1d5db' }}>
                          <div>1. <strong>新闻声量</strong>：央媒(×100) + 省级(×75) + 都市级(×50) + 商业(×25) + 其他(×5)</div>
                          <div>2. <strong>自媒体声量</strong>：央媒官号(×100) + 省级官号(×75) + 都市官号(×50) + 大V认证(×25) + 普通用户(×5)</div>
                        </div>
                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: 6, fontSize: 11, color: '#9ca3af' }}>
                          * 提示：仅针对 14 天内且属于本辖区地域的任务启用加权计算，超期或跨地域自动按原始发文篇数统计。
                        </div>
                      </div>
                    }
                  >
                    <span className="scenario-buzz-info-icon" role="button" tabIndex={0} aria-label="声量计算规则说明">i</span>
                  </Tooltip>
                </div>
                <div className="scenario-buzz-main-val">12,850</div>
                <div className="scenario-buzz-main-desc">权威加权分值</div>
              </div>
            </div>

            {/* 垂直分割线（高 48px） */}
            <div className="scenario-buzz-v-divider" />

            {/* 2. 新闻声量细化区（中间占比 45%） */}
            <div className="scenario-buzz-sub-col news-col">
              <div className="scenario-buzz-sub-header">
                <span className="scenario-buzz-sub-title">新闻声量 7,200</span>
                <span className="scenario-buzz-ratio-tag news">占比 56.0%</span>
              </div>
              <div className="scenario-level-grid">
                <div className="scenario-level-item">
                  央媒：<span className="level-cnt">30</span> 篇 <span className="level-weight">(×100)</span>
                </div>
                <div className="scenario-level-item">
                  省级：<span className="level-cnt">40</span> 篇 <span className="level-weight">(×75)</span>
                </div>
                <div className="scenario-level-item">
                  都市级：<span className="level-cnt">20</span> 篇 <span className="level-weight">(×50)</span>
                </div>
                <div className="scenario-level-item">
                  商业：<span className="level-cnt">7</span> 篇 <span className="level-weight">(×25)</span>
                </div>
                <div className="scenario-level-item">
                  其他：<span className="level-cnt">5</span> 篇 <span className="level-weight">(×5)</span>
                </div>
              </div>
            </div>

            {/* 垂直分割线（高 48px） */}
            <div className="scenario-buzz-v-divider" />

            {/* 3. 自媒体声量细化区（右侧占比 45%） */}
            <div className="scenario-buzz-sub-col social-col">
              <div className="scenario-buzz-sub-header">
                <span className="scenario-buzz-sub-title">自媒体声量 5,650</span>
                <span className="scenario-buzz-ratio-tag social">占比 44.0%</span>
              </div>
              <div className="scenario-level-grid">
                <div className="scenario-level-item">
                  央媒官号：<span className="level-cnt">20</span> 篇 <span className="level-weight">(×100)</span>
                </div>
                <div className="scenario-level-item">
                  省级官号：<span className="level-cnt">30</span> 篇 <span className="level-weight">(×75)</span>
                </div>
                <div className="scenario-level-item">
                  都市官号：<span className="level-cnt">20</span> 篇 <span className="level-weight">(×50)</span>
                </div>
                <div className="scenario-level-item">
                  认证大V：<span className="level-cnt">14</span> 篇 <span className="level-weight">(×25)</span>
                </div>
                <div className="scenario-level-item">
                  普通网民：<span className="level-cnt">10</span> 篇 <span className="level-weight">(×5)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 下层：平台渠道发文分布带（高度 44px，背景色 #FAFAFA，边框顶线 1px solid #F0F0F0） */}
          <div className="scenario-buzz-lower">
            <span className="scenario-buzz-lower-label">各平台实际发文（共 23 篇）</span>
            <div className="scenario-buzz-channel-strip">
              <span className="scenario-buzz-channel-cell">今日头条<strong>(9)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">APP<strong>(8)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">新闻<strong>(3)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">微信<strong>(2)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">小红书<strong>(1)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">微博<strong>(0)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">抖音<strong>(0)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">论坛<strong>(0)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">长视频<strong>(0)</strong></span>
              <span className="scenario-buzz-channel-divider">|</span>
              <span className="scenario-buzz-channel-cell">境外<strong>(0)</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* 场景 8：基础篇数统计（不符合条件/降级）- 紧凑单层横条（高度 80px） */
        <div className="scenario-buzz-card basic-card">
          {/* 【左侧总声量区】 */}
          <div className="scenario-buzz-basic-left">
            <div className="scenario-buzz-circle-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M19 5a9 9 0 0 1 0 14" />
              </svg>
            </div>
            <div className="scenario-buzz-basic-meta">
              <div className="scenario-buzz-basic-num-row">
                <span className="scenario-buzz-basic-label">总声量</span>
                <span className="scenario-buzz-basic-val">23</span>
              </div>
              <div className="scenario-buzz-basic-subtext">
                按基础发文篇数统计（任务周期超14天或跨地域）
              </div>
            </div>
          </div>

          {/* 垂直分割线 */}
          <div className="scenario-buzz-basic-divider" />

          {/* 【右侧渠道发文平铺区】（隐藏新闻与自媒体加权矩阵） */}
          <div className="scenario-buzz-basic-channels">
            {[
              { name: '今日头条', val: 9 },
              { name: 'APP', val: 8 },
              { name: '新闻', val: 3 },
              { name: '微信', val: 2 },
              { name: '小红书', val: 1 },
              { name: '微博', val: 0 },
              { name: '抖音', val: 0 },
              { name: '论坛', val: 0 },
              { name: '长视频', val: 0 },
              { name: '境外', val: 0 },
            ].map((ch) => (
              <div key={ch.name} className="scenario-buzz-basic-item">
                <span className="item-val">{ch.val}</span>
                <span className="item-name">{ch.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 第二行：总互动量卡片（与原详情页配套） */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 4,
          border: '1px solid #ebeef5',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <BarChartOutlined style={{ fontSize: 20 }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#606266', fontWeight: 500 }}>总互动量</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#303133' }}>163</span>
              <span
                style={{
                  fontSize: 11,
                  color: '#7c3aed',
                  background: '#ede9fe',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                不含阅读数 64
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#909399', marginTop: 2 }}>
              涵盖转发、评论、点赞与阅读综合互动量
            </div>
          </div>
        </div>

        <div style={{ height: 36, width: 1, backgroundColor: '#e4e7ed', margin: '0 20px' }} />

        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-around' }}>
          {[
            { name: '总转推数', val: 12 },
            { name: '总分享数', val: 0 },
            { name: '总评论数', val: 3 },
            { name: '总阅读数', val: 99 },
            { name: '总点赞数', val: 34 },
            { name: '其他互动量之和', val: 15 },
          ].map((item) => (
            <div key={item.name} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#303133' }}>{item.val}</div>
              <div style={{ fontSize: 12, color: '#909399', marginTop: 2 }}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 下方 5 个子图表（维持客观篇数统计） */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 16 }}>
        {/* 1. 报道趋势 */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <LineChartOutlined style={{ color: '#2563eb' }} /> 传播趋势（按平台发文篇数）
            </div>
            <Space size={8}>
              <Segmented
                size="small"
                value={trendDimension}
                onChange={(val) => setTrendDimension(val as any)}
                options={[
                  { label: '声量', value: 'volume' },
                  { label: '互动量', value: 'interaction' },
                  { label: '情感', value: 'sentiment' },
                ]}
              />
              <Tag color="blue">小时粒度</Tag>
              <Button type="text" size="small" icon={<TableOutlined />} />
              <Button type="text" size="small" icon={<DownloadOutlined />} />
            </Space>
          </div>
          <div ref={trendChartRef} style={{ height: 260 }} />
        </div>

        {/* 2. 阵地类型分析 */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PieChartOutlined style={{ color: '#2563eb' }} /> 阵地类型分析
            </div>
            <Button type="text" size="small" icon={<DownloadOutlined />} />
          </div>
          <div ref={mediaPieChartRef} style={{ height: 260 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* 3. 情感分析 */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <PieChartOutlined style={{ color: '#06b6d4' }} /> 情感倾向分布
          </div>
          <div ref={sentimentChartRef} style={{ height: 220 }} />
        </div>

        {/* 4. 媒体参与排名 */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChartOutlined style={{ color: '#2563eb' }} /> 重点媒体参与排名
          </div>
          <div ref={rankChartRef} style={{ height: 220 }} />
        </div>

        {/* 5. 词云分析 */}
        <div style={{ background: '#fff', padding: 16, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <InfoCircleOutlined style={{ color: '#10b981' }} /> 高频热词云图
          </div>
          <div
            style={{
              height: 220,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px 14px',
              padding: 10,
              background: '#f8fafc',
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 'bold', color: '#dc2626' }}>富晋福管</span>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2563eb' }}>招商引资</span>
            <span style={{ fontSize: 16, color: '#059669' }}>网民关注</span>
            <span style={{ fontSize: 22, fontWeight: 'bold', color: '#d97706' }}>合同争议</span>
            <span style={{ fontSize: 14, color: '#7c3aed' }}>涉事属地</span>
            <span style={{ fontSize: 18, color: '#0284c7' }}>今日头条</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>发帖维权</span>
            <span style={{ fontSize: 15, color: '#b91c1c' }}>市局研判</span>
            <span style={{ fontSize: 17, color: '#4338ca' }}>重点监控</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>舆情扩散</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSourceControlBuzz;
