import React, { useState, useRef } from 'react';
import {
  Button,
  Select,
  Card,
  Tabs,
  Tag,
  Empty,
  Dropdown,
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
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

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

// ==================== 组件 ====================

const SourceControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [calendarType, setCalendarType] = useState<string>();
  const overviewRef = useRef<HTMLDivElement>(null);

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

  // 任务卡片渲染
  const renderTaskCard = (task: any, type: 'special' | 'security') => (
    <div key={task.id} className="task-card">
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
                { key: 'detail', label: '查看详情' },
                { key: 'edit', label: '编辑任务' },
                { key: 'delete', label: '删除任务', danger: true },
              ],
            }}
            placement="bottomRight"
          >
            <Button type="text" size="small" className="more-btn">
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

  return (
    <div className="source-control-page">
      {/* 顶部操作栏 */}
      <div className="page-header-bar">
        <div className="header-left-section">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="header-tabs"
          >
            <TabPane tab="今日" key="today" />
            <TabPane tab="当月" key="month" />
            <TabPane tab="排班" key="schedule" />
            <TabPane tab="排班统计" key="schedule-stats" />
          </Tabs>
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
        </div>
        <div className="header-right-section">
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
        </div>
      </div>

      {/* 主体内容区 - 2x2 网格布局 */}
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
    </div>
  );
};

export default SourceControl;
