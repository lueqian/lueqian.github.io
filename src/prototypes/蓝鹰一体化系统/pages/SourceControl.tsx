import React, { useState } from 'react';
import {
  Button,
  Select,
  Card,
  Tabs,
  Tag,
  Progress,
  Empty,
} from 'antd';
import {
  SettingOutlined,
  FileAddOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  MoreOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

// 数据概览项
const overviewItems = [
  { label: '今日任务', value: 1 },
  { label: '重大实体事件跟踪', value: 0 },
  { label: '重点账号动态跟踪', value: 0 },
  { label: '重点阵地实时盯控', value: 0 },
  { label: '舆情', value: 0 },
];

// 安保任务数据
const securityTasks = [
  {
    id: '1',
    name: '端午',
    code: '14085',
    trend: -13.3,
    trendValue: 903,
    status: '未上榜',
    tags: ['安保', '支队'],
  },
];

const SourceControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [calendarType, setCalendarType] = useState<string>();

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
            <TabPane tab="排班统计" key="schedule" />
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
          <Button type="primary" icon={<SettingOutlined />} className="action-btn-primary">
            敏感时间/事件节点设置
          </Button>
          <Button type="primary" icon={<FileAddOutlined />} className="action-btn-primary">
            任务布置
          </Button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="page-content-grid">
        {/* 左侧：数据概览 + 安保任务 */}
        <div className="content-left">
          {/* 数据概览卡片 */}
          <Card className="overview-card" bordered={false}>
            <div className="card-header">
              <span className="card-title">数据概览</span>
            </div>
            <div className="overview-content">
              <div className="overview-nav left">
                <ArrowLeftOutlined />
              </div>
              <div className="overview-items">
                {overviewItems.map((item, index) => (
                  <div key={index} className="overview-item">
                    <div className="overview-value">{item.value}</div>
                    <div className="overview-label">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="overview-nav right">
                <ArrowRightOutlined />
              </div>
            </div>
          </Card>

          {/* 安保任务卡片 */}
          <Card className="security-task-card" bordered={false}>
            <div className="card-header">
              <span className="card-title">安保任务</span>
              <a className="more-link">更多</a>
            </div>
            <div className="task-list">
              {securityTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-main">
                    <div className="task-name">{task.name}</div>
                    <div className="task-tags">
                      {task.tags.map((tag, idx) => (
                        <Tag key={idx} color={idx === 0 ? 'blue' : 'processing'}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <Button type="text" icon={<MoreOutlined />} className="task-more" />
                  </div>
                  <div className="task-stats">
                    <span className="task-code">{task.code}</span>
                    <div className="task-trend">
                      <span className="trend-value">{task.trendValue}</span>
                      <span className={`trend-percent ${task.trend < 0 ? 'down' : 'up'}`}>
                        {task.trend > 0 ? '+' : ''}{task.trend}%
                      </span>
                    </div>
                    <span className="task-status">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧：敏感时间/事件节点 */}
        <div className="content-right">
          <Card className="sensitive-events-card" bordered={false}>
            <div className="card-header">
              <span className="card-title with-indicator">
                <span className="indicator" />
                敏感时间/事件节点
              </span>
            </div>
            <div className="events-content">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无节点信息"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SourceControl;
