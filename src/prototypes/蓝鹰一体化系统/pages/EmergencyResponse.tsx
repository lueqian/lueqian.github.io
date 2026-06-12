import React, { useState } from 'react';
import { Button, Checkbox, Empty, Input, Select, Switch, Tag, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';

type EmergencySource = 'monitor-warning' | 'source-control';

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

interface SourceControlTask {
  id: string;
  seq: number;
  title: string;
  author: string;
  postId: string;
  heat: number;
  platform: string;
  time: string;
  content: string;
  summary: string;
  analysis: string;
  rating: number;
  index: number;
  taskName: string;
  instruction: string;
  instructionType: '任务安排' | '下级单位指令';
  issuedBy: string;
  issuedAt: string;
  receiverUnit: string;
  receiverMode: 'person' | 'unit';
  receiverUser?: string;
  status: '待指派' | '待签收' | '处理中';
  deadline: string;
  tags: string[];
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

const sourceControlTasks: SourceControlTask[] = [
  {
    id: 'source-001',
    seq: 1,
    title: '淮安遭遇特大暴雨，多个路段积水严重',
    author: '淮安发布',
    postId: '123456789',
    heat: 98,
    platform: '微博',
    time: '2026-04-21 10:49:27',
    content: '今日下午，淮安市遭遇特大暴雨袭击，市区多个路段出现严重积水，部分低洼地区水深超过50厘米。市防汛指挥部已启动应急响应，相关部门正在全力排水抢险。',
    summary: '该内容涉及淮安暴雨汛情，反映市区积水情况，建议关注后续发展。',
    analysis: '该舆情为自然灾害类，目前呈上升趋势，建议相关部门及时发布权威信息，回应社会关切。',
    rating: 5,
    index: 85,
    taskName: '0510 淮安汛情',
    instruction: '帖文处置、材料反馈',
    instructionType: '任务安排',
    issuedBy: '支队值班岗',
    issuedAt: '2026-04-21 10:50:43',
    receiverUnit: '支队处置专班',
    receiverMode: 'person',
    receiverUser: '刘浩宇',
    status: '待签收',
    deadline: '2026-04-21 16:50:43',
    tags: ['暴雨', '积水', '防汛'],
  },
  {
    id: 'source-002',
    seq: 2,
    title: '网友实拍：淮安某小区地下车库进水，物业组织转移车辆',
    author: '市民小王',
    postId: '987654321',
    heat: 78,
    platform: '抖音',
    time: '2026-04-21 11:08:36',
    content: '网民发布短视频称小区地下车库已开始进水，物业正在组织业主转移车辆，希望相关部门关注排涝情况。',
    summary: '该内容反映局部小区积水与车辆转移问题，可能形成同类小区求助扩散。',
    analysis: '舆情涉及防汛应急与物业处置，建议属地核实积水点位并补充通报处置进度。',
    rating: 4,
    index: 72,
    taskName: '0510 淮安汛情',
    instruction: '属地核查、信息通报',
    instructionType: '下级单位指令',
    issuedBy: '支队值班岗',
    issuedAt: '2026-04-21 11:12:04',
    receiverUnit: '淮安区分局',
    receiverMode: 'unit',
    status: '待指派',
    deadline: '2026-04-21 17:12:04',
    tags: ['小区积水', '车辆转移', '属地核查'],
  },
  {
    id: 'source-003',
    seq: 3,
    title: '淮安市防汛指挥部发布紧急通知，要求加强值班值守',
    author: '淮安日报',
    postId: '456780921',
    heat: 64,
    platform: '微信',
    time: '2026-04-21 11:36:12',
    content: '淮安市防汛指挥部发布紧急通知，要求各级部门加强值班值守，做好应急准备，同时提醒市民关注天气变化。',
    summary: '该内容为权威通知类信息，可作为后续回应和通报素材。',
    analysis: '舆情总体风险可控，建议持续观察评论区反馈，并将权威口径同步给属地处置人员。',
    rating: 3,
    index: 58,
    taskName: '0510 淮安汛情',
    instruction: '持续监测',
    instructionType: '任务安排',
    issuedBy: '支队值班岗',
    issuedAt: '2026-04-21 11:40:20',
    receiverUnit: '支队网巡岗',
    receiverMode: 'person',
    receiverUser: '陈思远',
    status: '处理中',
    deadline: '2026-04-21 19:40:20',
    tags: ['权威通知', '持续监测'],
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

const sourceTabs: Array<{ key: EmergencySource; label: string }> = [
  { key: 'monitor-warning', label: '监测预警' },
  { key: 'source-control', label: '源头防控' },
];

const EmergencyResponse: React.FC = () => {
  const [source, setSource] = useState<EmergencySource>('monitor-warning');
  const [activeTaskTab, setActiveTaskTab] = useState('pending');
  const [assigneeMap, setAssigneeMap] = useState<Record<string, string | undefined>>({
    'source-001': '刘浩宇',
    'source-003': '陈思远',
  });
  const [assignedTaskIds, setAssignedTaskIds] = useState<string[]>([]);
  const [selectedSourceTaskIds, setSelectedSourceTaskIds] = useState<string[]>([]);
  const [batchAssignee, setBatchAssignee] = useState<string>();

  const visibleSourceControlTasks = sourceControlTasks.filter((task) => !assignedTaskIds.includes(task.id));
  const batchAssigneeOptions = Array.from(new Set(Object.values(assigneeOptionsByUnit).flat()));

  const handleSingleAssign = (taskId: string) => {
    setAssignedTaskIds((prev) => Array.from(new Set([...prev, taskId])));
    setSelectedSourceTaskIds((prev) => prev.filter((id) => id !== taskId));
    message.success('任务指派成功');
  };

  const handleBatchAssign = () => {
    if (!batchAssignee || selectedSourceTaskIds.length === 0) {
      return;
    }

    setAssigneeMap((prev) => {
      const next = { ...prev };
      selectedSourceTaskIds.forEach((id) => {
        next[id] = batchAssignee;
      });
      return next;
    });
    setAssignedTaskIds((prev) => Array.from(new Set([...prev, ...selectedSourceTaskIds])));
    setSelectedSourceTaskIds([]);
    setBatchAssignee(undefined);
    message.success('任务指派成功');
  };

  const renderSourceControlContent = () => (
    <>
      <div className="emergency-disposal-list">
        {visibleSourceControlTasks.length === 0 && (
          <Empty className="source-control-empty" description="暂无待指派文章" />
        )}
        {visibleSourceControlTasks.map((task, index) => {
          const assignees = assigneeOptionsByUnit[task.receiverUnit] || [];
          const selectedAssignee = assigneeMap[task.id];
          const checked = selectedSourceTaskIds.includes(task.id);
          return (
            <UnifiedOpinionCard
              key={task.id}
              id={task.id}
              seq={index + 1}
              title={task.title}
              author={task.author}
              postId={task.postId}
              heat={task.heat}
              platform={task.platform}
              time={task.time}
              content={task.content}
              summary={task.summary}
              analysis={task.analysis}
              dataSource="源头防控"
              tags={[task.taskName, ...task.tags]}
              rating={task.rating}
              sentimentIndex={task.index}
              compact
              selected={checked}
              selectionSlot={
                <Checkbox
                  checked={checked}
                  aria-label={`选择${task.title}`}
                  onChange={(event) => {
                    const isChecked = event.target.checked;
                    setSelectedSourceTaskIds((prev) => (
                      isChecked
                        ? Array.from(new Set([...prev, task.id]))
                        : prev.filter((id) => id !== task.id)
                    ));
                  }}
                />
              }
              processSlot={
                <div className="source-control-command-panel">
                  <div className="source-control-command-meta">
                    <Tag className={task.instructionType === '下级单位指令' ? 'unit-command-tag' : 'local-command-tag'}>
                      {task.instructionType}
                    </Tag>
                    <span>原指令：<strong>{task.instruction}</strong></span>
                    <span>下发：{task.issuedBy}</span>
                    <span>{task.issuedAt}</span>
                    <span>截止：{task.deadline}</span>
                  </div>
                  <div className="source-control-assignment-row">
                    <span className="current-assignee-label">当前指派：</span>
                    <Select
                      placeholder="选择执行人员"
                      value={selectedAssignee}
                      onChange={(value) => setAssigneeMap((prev) => ({ ...prev, [task.id]: value }))}
                      options={assignees.map((name) => ({ value: name, label: name }))}
                    />
                    <Button
                      type="primary"
                      disabled={!selectedAssignee}
                      onClick={() => handleSingleAssign(task.id)}
                    >
                      提交
                    </Button>
                  </div>
                </div>
              }
              footerBadges={
                <>
                  <Tag className="source-control-status-tag pending">
                    {task.status}
                  </Tag>
                  <Tag className="emergency-soft-tag">处置记录</Tag>
                  <Tag className="emergency-soft-tag">指令详情</Tag>
                </>
              }
            />
          );
        })}
      </div>
      {selectedSourceTaskIds.length > 0 && (
        <div className="source-control-batch-assign-bar">
          <div className="batch-assign-meta">
            <strong>已选择 {selectedSourceTaskIds.length} 条</strong>
            <button type="button" onClick={() => setSelectedSourceTaskIds([])}>取消全选</button>
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
        </div>
      )}
    </>
  );

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
          <div className="emergency-source-tabs" role="tablist" aria-label="应急处置来源切换">
            {sourceTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={source === tab.key ? 'active' : ''}
                onClick={() => setSource(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {source === 'monitor-warning' && (
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
          )}
        </div>

        {source === 'monitor-warning' ? (
          <>
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
              {monitorTasks.map((task) => (
                <UnifiedOpinionCard
                  key={task.id}
                  id={task.id}
                  seq={task.seq}
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
              ))}
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
          </>
        ) : renderSourceControlContent()}
      </section>
    </div>
  );
};

export default EmergencyResponse;
