import React, { useState } from 'react';
import { Button, Checkbox, Empty, Input, Select, Switch, Tag, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';
import AddToPublicationModal from '../components/AddToPublicationModal';


interface DisposalTask {
  id: string;
  seq: number;
  title: string;
  author: string;
  rating: number;
  ratingText: string;
  area: string;
  platform: string;
  time: string;
  summary: string;
  analysis: string;
  index: string;
  dataSource: string;
  firstAction: string;
  statusRows: Array<{
    tone: 'blue' | 'green';
    label: string;
    count: string;
    type: string;
  }>;
  command: {
    name: string;
    overdue: boolean;
    remain: string;
    officer: string;
    issuedAt: string;
  };
  tags: string[];
  rightBadges: string[];
}


const taskTabs = [
  { key: 'pending', label: '待处理', count: 59, hot: 73 },
  { key: 'done', label: '已处理', count: 124 },
  { key: 'report', label: '事件核报', count: 238, hot: 31 },
  { key: 'all', label: '全部' },
];

const monitorTasks: DisposalTask[] = [
  {
    id: '4769172047',
    seq: 1,
    title: '网民“蚂蚁清货”发布视频，淮安烈士后代生活难以为继，求助相关部门援助。转评赞总数：0',
    author: '蚂蚁清货',
    rating: 2,
    ratingText: '1.5星',
    area: '淮安区',
    platform: '快手app',
    time: '2026-04-21 10:49:27',
    summary: '网民“蚂蚁清货”发布视频称淮安烈士后代生活难以为继，求助相关部门援助。',
    analysis: '舆情涉及烈士后代生活困难求助问题，可能会引发公众对烈士家属关怀政策执行情况的关注，影响政府形象和公信力。',
    index: '30.00',
    dataSource: '监测预警',
    firstAction: '通报',
    statusRows: [
      { tone: 'blue', label: '已完成任务', count: '1个任务', type: '信息通报' },
      { tone: 'green', label: '未完成任务', count: '1个任务', type: '信息通报' },
    ],
    command: {
      name: '信息通报',
      overdue: true,
      remain: '剩00天00时00分',
      officer: '刘浩宇',
      issuedAt: '2026-04-21 10:50:43',
    },
    tags: ['淮阴区', '淮安区', '实名举报维权'],
    rightBadges: ['信息详情', 'AI', '研判'],
  },
  {
    id: '95638901595',
    seq: 2,
    title: '网民“白无常[伪]”发布视频，显示玻璃被钢珠射击。转评赞总数：0',
    author: '白无常[伪]',
    rating: 1,
    ratingText: '0.5星',
    area: '--',
    platform: '小红书',
    time: '2026-04-21 07:00:21',
    summary: '网民“白无常[伪]”发布显示玻璃被钢珠射击的视频，涉事地点未明确。',
    analysis: '目前信息敏感性低，未体现受众诉求、行为，暂未发现对社会、经济、政治有明显影响。',
    index: '10.00',
    dataSource: '监测预警',
    firstAction: '通报',
    statusRows: [
      { tone: 'blue', label: '已完成任务', count: '0个任务', type: '信息通报' },
      { tone: 'green', label: '未完成任务', count: '1个任务', type: '信息通报' },
    ],
    command: {
      name: '信息通报',
      overdue: false,
      remain: '剩00天01时24分',
      officer: '刘浩宇',
      issuedAt: '2026-04-21 07:12:06',
    },
    tags: ['淮阴区', '风险排查'],
    rightBadges: ['信息详情', 'AI', '研判'],
  },
];


const assigneeOptionsByUnit: Record<string, string[]> = {
  支队处置专班: ['刘浩宇', '陈思远', '周宁'],
  支队网巡岗: ['陈思远', '王敏'],
  淮安区分局: ['张明', '李倩', '刘浩宇'],
};

const filterRows = [
  [
    { label: '报送信息全文搜', control: <Input placeholder="请输入昵称、网址、组合搜索" /> },
    { label: '指令下发时间', control: <Input placeholder="开始日期          -          结束日期" prefix={<ClockCircleOutlined />} /> },
    { label: '处置时间', control: <Input placeholder="开始日期          -          结束日期" prefix={<ClockCircleOutlined />} /> },
  ],
  [
    { label: '日期区间', control: <Input placeholder="开始日期          -          结束日期" prefix={<ClockCircleOutlined />} /> },
    { label: '刊号', control: <Input placeholder="输入刊号查询" /> },
    { label: '已下发指令', control: <Select placeholder="请选择" options={[{ value: 'all', label: '全部' }]} /> },
    { label: '未下发指令', control: <Select placeholder="请选择" options={[{ value: 'all', label: '全部' }]} /> },
  ],
  [
    { label: '指令状态', control: <Select defaultValue="全部" options={[{ value: '全部', label: '全部' }]} /> },
    { label: '编号', control: <Input placeholder="请输入编号" /> },
    {
      label: '信源范围',
      control: (
        <Select
          mode="multiple"
          placeholder="请选择平台"
          maxTagCount="responsive"
          options={[
            { value: 'weibo', label: '微博' },
            { value: 'xiaohongshu', label: '小红书' },
            { value: 'douyin', label: '抖音' },
            { value: 'kuaishou', label: '快手' },
            { value: 'wechat', label: '微信' },
            { value: 'news', label: '新闻客户端' },
          ]}
        />
      ),
    },
  ],
];


const EmergencyResponse: React.FC = () => {
  const [activeTaskTab, setActiveTaskTab] = useState('pending');
  const [assigneeMap, setAssigneeMap] = useState<Record<string, string | undefined>>({
    'source-001': '刘浩宇',
    'source-003': '陈思远',
  });
  const [assignedTaskIds, setAssignedTaskIds] = useState<string[]>([]);
  const [selectedMonitorTaskIds, setSelectedMonitorTaskIds] = useState<string[]>([]);
  const [batchPubOpen, setBatchPubOpen] = useState(false);
  const [batchAssignee, setBatchAssignee] = useState<string>();

  const visibleMonitorTasks = monitorTasks.filter((task) => !assignedTaskIds.includes(task.id));
  const batchAssigneeOptions = Array.from(new Set(Object.values(assigneeOptionsByUnit).flat()));

  const handleSingleAssign = (taskId: string) => {
    setAssignedTaskIds((prev) => Array.from(new Set([...prev, taskId])));
    setSelectedMonitorTaskIds((prev) => prev.filter((id) => id !== taskId));
    message.success('任务指派成功');
  };

  const handleBatchAssign = () => {
    if (!batchAssignee || selectedMonitorTaskIds.length === 0) {
      return;
    }

    setAssigneeMap((prev) => {
      const next = { ...prev };
      selectedMonitorTaskIds.forEach((id) => {
        next[id] = batchAssignee;
      });
      return next;
    });
    setAssignedTaskIds((prev) => Array.from(new Set([...prev, ...selectedMonitorTaskIds])));
    setSelectedMonitorTaskIds([]);
    setBatchAssignee(undefined);
    message.success('任务指派成功');
  };

  return (
    <div className="emergency-response-page">
      <section className="emergency-filter-panel">
        {filterRows.map((row, rowIndex) => (
          <div key={rowIndex} className="emergency-filter-row">
            {row.map((item) => (
              <label key={`${rowIndex}-${item.label}`} className="emergency-filter-item">
                <span>{item.label}</span>
                {item.control}
              </label>
            ))}
            {rowIndex === 2 && (
              <div className="emergency-filter-actions">
                <Button>重置</Button>
                <Button type="primary">查询</Button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="emergency-task-panel">
        <div className="emergency-task-header">
          <div className="emergency-title-group">
            <span className="emergency-title-mark" />
            <h2>任务列表</h2>
          </div>
          <div className="emergency-task-tools">
            <Button type="primary">快捷指令</Button>
            <Switch defaultChecked />
            <span>已打开自动消息提醒</span>
            <span>排序</span>
            <Select
              defaultValue="指令处理时间降序"
              options={[{ value: '指令处理时间降序', label: '指令处理时间降序' }]}
            />
            <div className="emergency-view-switch">
              <button type="button" className="active">详细视图</button>
              <button type="button">处置视图</button>
              <button type="button">简要视图</button>
            </div>
          </div>
        </div>

        <div className="emergency-task-tabs">
          {taskTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTaskTab === tab.key ? 'active' : ''}
              onClick={() => setActiveTaskTab(tab.key)}
            >
              <span>{tab.count === undefined ? tab.label : `${tab.label}(${tab.count})`}</span>
              {tab.hot !== undefined && <em>{tab.hot}</em>}
            </button>
          ))}
        </div>

        <div className="emergency-disposal-list">
          {visibleMonitorTasks.length === 0 && (
            <Empty className="monitor-tasks-empty" description="暂无待处理任务" />
          )}
          {visibleMonitorTasks.map((task, index) => {
            const checked = selectedMonitorTaskIds.includes(task.id);
            return (
              <UnifiedOpinionCard
                key={task.id}
                id={task.id}
                seq={index + 1}
                title={task.title}
                author={task.author}
                postId={task.id}
                platform={task.platform}
                time={task.time}
                summary={task.summary}
                analysis={task.analysis}
                dataSource={task.dataSource}
                tags={[task.area, ...task.tags]}
                rating={task.rating}
                ratingText={task.ratingText}
                sentimentIndex={task.index}
                sensitivityLabel="AI 非热敏"
                compact
                selected={checked}
                selectionSlot={
                  <Checkbox
                    checked={checked}
                    aria-label={`选择${task.title}`}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      setSelectedMonitorTaskIds((prev) => (
                        isChecked
                          ? Array.from(new Set([...prev, task.id]))
                          : prev.filter((id) => id !== task.id)
                      ));
                    }}
                  />
                }
                processSlot={
                  <>
                    <div className="emergency-action-strip">
                      <span>第1次研判</span>
                      <p>{task.firstAction}</p>
                    </div>
                    {task.statusRows.map((row) => (
                      <div key={`${task.id}-${row.label}`} className="emergency-task-status-row">
                        <span className={row.tone}>{row.label}</span>
                        <strong className={row.tone}>{row.count}</strong>
                        <em>{row.type}</em>
                      </div>
                    ))}
                    <div className="emergency-command-row">
                      <span className="command-name">{task.command.name}</span>
                      <span className={task.command.overdue ? 'overdue' : 'remaining'}>
                        {task.command.overdue ? '已超时' : '计时中'}
                      </span>
                      <span className={task.command.overdue ? 'time-danger' : 'time-normal'}>
                        <ClockCircleOutlined /> {task.command.remain}
                      </span>
                      <span>{task.command.officer}</span>
                      <span>{task.command.issuedAt}</span>
                      <Button size="small">下发</Button>
                      <div className="emergency-row-actions">
                        <Button size="small" type="primary">签收</Button>
                        <Button size="small">反馈</Button>
                      </div>
                    </div>
                  </>
                }
                footerBadges={
                  <>
                    {task.rightBadges.map((badge) => (
                      <Tag key={badge} className={badge === 'AI' ? 'emergency-ai-mini' : 'emergency-soft-tag'}>{badge}</Tag>
                    ))}
                  </>
                }
              />
            );
          })}
        </div>
        <div className="emergency-pagination">
          <span>共 59 条</span>
          <Select defaultValue="10条/页" options={[{ value: '10条/页', label: '10条/页' }]} />
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button key={page} type="button" className={page === 1 ? 'active' : ''}>{page}</button>
          ))}
          <span>前往</span>
          <Input value="1" readOnly />
          <span>页</span>
        </div>

        {selectedMonitorTaskIds.length > 0 && (
          <div className="source-control-batch-assign-bar">
            <div className="batch-assign-meta">
              <strong>已选择 {selectedMonitorTaskIds.length} 条</strong>
              <button type="button" onClick={() => setSelectedMonitorTaskIds([])}>取消全选</button>
            </div>
            <span className="batch-assign-target">批量指派到</span>
            <Select
              placeholder="选择指派人员"
              value={batchAssignee}
              onChange={setBatchAssignee}
              options={batchAssigneeOptions.map((name) => ({ value: name, label: name }))}
            />
            <Button type="primary" disabled={!batchAssignee} onClick={handleBatchAssign}>
              批量提交
            </Button>
            <Button
              type="primary"
              style={{ background: '#7c3aed', borderColor: '#7c3aed', marginLeft: 8 }}
              onClick={() => setBatchPubOpen(true)}
            >
              批量添加到刊物
            </Button>
            <AddToPublicationModal
              open={batchPubOpen}
              onCancel={() => setBatchPubOpen(false)}
              onSuccess={() => setSelectedMonitorTaskIds([])}
              posts={selectedMonitorTaskIds.map(id => {
                const task = visibleMonitorTasks.find(t => t.id === id);
                return {
                  id: id,
                  title: task ? task.title : '舆情帖文',
                  content: task ? task.summary : '',
                  platform: task ? task.platform : '',
                  author: task ? task.author : '',
                };
              })}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default EmergencyResponse;
