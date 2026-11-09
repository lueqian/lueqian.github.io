import React, { useState } from 'react';
import { Button, Checkbox, Empty, Input, Pagination, Select, Switch, Tag, Tooltip, message } from 'antd';
import {
  ClockCircleOutlined,
  ReloadOutlined,
  PlayCircleFilled,
  ExclamationCircleOutlined,
  ExclamationCircleFilled,
  SendOutlined,
  RobotOutlined,
  FireOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import UnifiedOpinionCard from '../components/UnifiedOpinionCard';
import AddToPublicationModal from '../components/AddToPublicationModal';
import AIAnalysisModal from '../components/AIAnalysisModal';
import { useDirectiveState } from '../context/DirectiveStateContext';

// 二级 Tabs 结构：待反馈 ｜ 待处理 ｜ 已处理 ｜ 帖文处置 ｜ 动态监测 ｜ …… ｜ 全部
// 涉及指令类型的 Tab 随时间范围动态平铺；待办指令数以普通括号展示，完全剥离舆情事件数
const taskTabs = [
  { key: 'feedback', label: '待反馈' },
  { key: 'pending', label: '待处理', count: 5 },
  { key: 'processed', label: '已处理' },
  { key: 'disposal', label: '帖文处置', count: 3, isTypeTab: true },
  { key: 'monitor', label: '动态监测', count: 2, isTypeTab: true },
  { key: 'all', label: '全部' },
];

const filterRows = [
  [
    { label: '报送信息全文搜', control: <Input placeholder="请输入昵称、网址、组合搜索" /> },
    {
      label: '指令下发时间',
      control: <Input placeholder="开始日期          -          结束日期" prefix={<ClockCircleOutlined />} />,
    },
    {
      label: '处置时间',
      control: (
        <Input
          defaultValue="2026-10-14 00:00:00 - 2026-10-15 23:59:59"
          prefix={<ClockCircleOutlined />}
        />
      ),
    },
  ],
  [
    {
      label: '日期区间',
      control: <Input placeholder="开始日期          -          结束日期" prefix={<ClockCircleOutlined />} />,
    },
    { label: '刊号', control: <Input placeholder="输入刊号查询" /> },
    {
      label: '已下发指令',
      control: <Select placeholder="请选择" options={[{ value: 'all', label: '全部' }]} />,
    },
    {
      label: '未下发指令',
      control: <Select placeholder="请选择" options={[{ value: 'all', label: '全部' }]} />,
    },
  ],
  [
    {
      label: '指令状态',
      control: (
        <Select
          defaultValue="全部"
          options={[
            { value: '全部', label: '全部' },
            { value: '下达失败', label: '下达失败 (专网异常)' },
            { value: '待签收', label: '待签收' },
            { value: '已签收', label: '已签收' },
          ]}
        />
      ),
    },
    { label: '相关人员', control: <Select placeholder="请选择" options={[]} /> },
    { label: '编号', control: <Input placeholder="请输入编号" /> },
  ],
];

const EmergencyResponse: React.FC = () => {
  const { directives, retryDirective, openAiModal, openFailedModal } = useDirectiveState();

  const [activeTaskTab, setActiveTaskTab] = useState('feedback');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [retryingDirectiveId, setRetryingDirectiveId] = useState<string | null>(null);

  // 获取针对盱眙事件（202610150002）的指令
  const qjpDirective = directives.find(
    (d) => d.eventId === '202610150002' && d.targetDept === '清江浦区' && d.instructionName === '帖文处置'
  );
  const followUpDirective = directives.find(
    (d) => d.eventId === '202610150002' && d.targetDept === '徐州市' && d.instructionName === '持续关注'
  );

  const isQjpFailed = qjpDirective?.status === 'failed';
  const isFollowUpFailed = followUpDirective?.status === 'failed';

  // 关键：检测是否存在任何指令推送失败的情况，以此在“待反馈”指令右上角显示红色“！”标签与失败入口
  const failedDirectives = directives.filter((d) => d.status === 'failed');
  const hasFailedDirectives = failedDirectives.length > 0;
  const failedDirectivesCount = failedDirectives.length;

  const handleRetry = async (directiveId: string) => {
    setRetryingDirectiveId(directiveId);
    try {
      await retryDirective(directiveId);
    } finally {
      setRetryingDirectiveId(null);
    }
  };

  return (
    <div className="emergency-response-page">
      {/* 顶部筛选区（1:1复刻截图 2） */}
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
                <Button type="link" style={{ fontSize: '12px' }}>
                  收起 ^
                </Button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* 任务列表区 */}
      <section className="emergency-task-panel">
        <div className="emergency-task-header">
          <div className="emergency-title-group">
            <span className="emergency-title-mark" />
            <h2>任务列表</h2>
          </div>
          <div className="emergency-task-tools">
            {hasFailedDirectives && (
              <Button
                danger
                type="primary"
                size="small"
                icon={<ExclamationCircleFilled />}
                onClick={openFailedModal}
                style={{
                  borderRadius: 4,
                  fontSize: '12px',
                  background: '#dc2626',
                  borderColor: '#dc2626',
                  boxShadow: '0 2px 5px rgba(220, 38, 38, 0.25)',
                  fontWeight: 500,
                  marginRight: 6,
                }}
              >
                指令下达失败记录 ({failedDirectivesCount})
              </Button>
            )}
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

        {/* 顶部二级 Tabs 栏：左侧 Tabs（待反馈｜待处理｜已处理｜帖文处置｜动态监测｜全部），右侧业务备注组件 */}
        <div className="emergency-tabs-bar">
          <div className="emergency-task-tabs">
            {taskTabs.map((tab) => {
              const isFeedback = tab.key === 'feedback';
              const showExclamation = isFeedback && hasFailedDirectives;

              return (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTaskTab === tab.key ? 'active' : ''}
                  onClick={() => setActiveTaskTab(tab.key)}
                  style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                >
                  <span>{tab.count !== undefined ? `${tab.label}(${tab.count})` : tab.label}</span>
                  {showExclamation && (
                    <Tooltip title="存在指令推送失败的情况，点击查看全部失败记录并重新下发">
                      <span
                        className="failure-exclamation-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFailedModal();
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 17,
                          height: 17,
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          borderRadius: '50%',
                          fontSize: '11px',
                          fontWeight: 900,
                          marginLeft: 6,
                          lineHeight: 1,
                          boxShadow: '0 0 0 1.5px #fff, 0 1px 3px rgba(239, 68, 68, 0.4)',
                          cursor: 'pointer',
                        }}
                      >
                        !
                      </span>
                    </Tooltip>
                  )}
                </button>
              );
            })}
          </div>

          {/* 右侧业务规则备注组件（简洁低负荷，清晰指引） */}
          <div className="emergency-tabs-note" title="Tab与数据标签业务说明">
            <InfoCircleOutlined className="emergency-note-icon" />
            <span className="emergency-note-text">
              红色感叹号标签代表当前有未成功下达的指令，括号后的数字代表当前该类型有多少条待办指令
            </span>
          </div>
        </div>

        <div className="emergency-disposal-list">
          {/* 卡片 1：盱眙舆情（完美复刻截图 2，并实现指令状态与失败重新下发） */}
          <div
            className="unified-opinion-card compact"
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 16,
            }}
          >
            {/* 卡片头部 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Checkbox
                  checked={selectedTaskIds.includes('task-1')}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedTaskIds((prev) => (checked ? [...prev, 'task-1'] : prev.filter((id) => id !== 'task-1')));
                  }}
                />
                <span style={{ color: '#2563eb', fontWeight: 600 }}>1</span>
                <strong style={{ fontSize: '14.5px', color: '#1e293b' }}>
                  #盱眙马上真的要命，真的体会到了。
                </strong>
                <Tag color="cyan" style={{ fontSize: '11px', margin: 0 }}>非热敏</Tag>
                <Tag color="blue" style={{ fontSize: '11px', margin: 0 }}>已处置</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b', fontSize: '13px' }}>★★☆☆☆</span>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>2星</span>
              </div>
            </div>

            {/* 账号元信息行 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#64748b',
                marginBottom: 10,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>👤 盱眙恒居房产</span>
                <span>ID 70638584236</span>
                <span>👥 10883</span>
                <span>📍 --</span>
                <span>🎵 抖音app</span>
                <span>⏱ 2026-10-15 13:00:05</span>
                <span>编号 202610150002</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>📊 2</span>
                <span>👍 1</span>
                <span>⭐ 1</span>
              </div>
            </div>

            {/* AI 摘要与研判网格 + 舆情指数大卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '12px', color: '#475569' }}>
                  <Tag color="green" style={{ fontSize: '10.5px', margin: 0 }}>摘要</Tag>
                  <span>网民在盱眙县发布情绪化言论称"盱眙马上真的要命"，表达强烈负面情绪，属地为淮安市-盱眙县。</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '12px', color: '#475569' }}>
                  <Tag color="orange" style={{ fontSize: '10.5px', margin: 0 }}>研判</Tag>
                  <span>【风险定性】非热敏舆情，属无传播的个人牢骚类宣泄，建议：无需专项处置，可纳入日常情绪监测池。</span>
                </div>
              </div>
              <div
                style={{
                  background: '#f3e8ff',
                  border: '1px solid #e9d5ff',
                  borderRadius: 6,
                  padding: '6px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#7e22ce' }}>35.00</div>
                <div style={{ fontSize: '11px', color: '#6b21a8' }}>舆情指数</div>
              </div>
            </div>

            {/* 任务状态与指令明细区（关键对标需求） */}
            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                paddingTop: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* 研判状态条 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <Tag color="blue" style={{ fontWeight: 600, margin: 0 }}>第1次研判</Tag>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px' }}>
                  <Tag color="green" style={{ margin: 0 }}>未完成任务</Tag>
                  <strong style={{ color: '#16a34a' }}>6个任务</strong>
                  <Tag color="default">帖文处置 +2</Tag>
                  <Tag color="default">动态监测 +2</Tag>
                </div>
              </div>

              {/* 指令明细行 1：动态监测（正常已送达） */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="processing" style={{ margin: 0 }}>动态监测</Tag>
                  <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                    <ClockCircleOutlined /> 剩00天00时57分
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>测试</span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <Tag style={{ margin: 0 }}>下发</Tag>
                  <span style={{ fontSize: '12px', color: '#334155' }}>请对帖文进行舆情监测</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="small" type="primary">签收</Button>
                  <Button size="small">反馈</Button>
                </div>
              </div>

              {/* 指令明细行 2：帖文处置（淮安区，正常已送达） */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="processing" style={{ margin: 0 }}>帖文处置</Tag>
                  <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                    <ClockCircleOutlined /> 剩00天00时57分
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>测试 (淮安区)</span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <Tag style={{ margin: 0 }}>下发</Tag>
                  <span style={{ fontSize: '12px', color: '#334155' }}>请对帖文展开劝删处置工作</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="small" type="primary">签收</Button>
                  <Button size="small">反馈</Button>
                </div>
              </div>

              {/* 指令明细行：持续关注（徐州市，受专网网闸波动影响发生下达失败） */}
              <div
                style={{
                  background: isFollowUpFailed ? '#fff1f2' : '#f8fafc',
                  border: `1px solid ${isFollowUpFailed ? '#fecdd3' : '#e2e8f0'}`,
                  borderRadius: 6,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="cyan" style={{ margin: 0 }}>持续关注</Tag>
                  {isFollowUpFailed ? (
                    <Tooltip title="目标内网网关超时：徐州市局专网网闸摆渡超时 (ERR_NET_TIMEOUT)，指令未能写入对方内网待办池">
                      <Tag color="error" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                        ● 推送失败-错误码：ERR_NET_TIMEOUT
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  )}

                  {/* 时效挂起状态与错误诊断提示 */}
                  {isFollowUpFailed ? (
                    <span style={{ fontSize: '11.5px', color: '#e11d48', fontWeight: 500 }}>
                      <ClockCircleOutlined /> 时效已挂起 (未送达目标单位)
                    </span>
                  ) : (
                    <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                      <ClockCircleOutlined /> 剩00天01时00分
                    </span>
                  )}

                  <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                    🏢 徐州市局网安支队
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:45:00</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    请对涉事舆情保持持续关注与日常巡查
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isFollowUpFailed ? (
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<ReloadOutlined spin={retryingDirectiveId === followUpDirective?.id} />}
                      loading={retryingDirectiveId === followUpDirective?.id}
                      onClick={() => followUpDirective && handleRetry(followUpDirective.id)}
                    >
                      重发指令
                    </Button>
                  ) : (
                    <>
                      <Button size="small" type="primary">签收</Button>
                      <Button size="small">反馈</Button>
                    </>
                  )}
                </div>
              </div>

              {/* 指令明细行 3：关键！清江浦区帖文处置（受专网波动影响发生下达失败） */}
              <div
                style={{
                  background: isQjpFailed ? '#fff1f2' : '#f8fafc',
                  border: `1px solid ${isQjpFailed ? '#fecdd3' : '#e2e8f0'}`,
                  borderRadius: 6,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tag color="processing" style={{ margin: 0 }}>帖文处置</Tag>
                  {isQjpFailed ? (
                    <Tooltip title="目标内网网关超时：清江浦区分局专网连接超时 (ERR_NET_TIMEOUT)，指令未能写入对方内网待办池">
                      <Tag color="error" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>
                        ● 下达失败
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tag color="success" style={{ margin: 0 }}>待签收</Tag>
                  )}

                  {/* 时效挂起状态与错误诊断提示 */}
                  {isQjpFailed ? (
                    <span style={{ fontSize: '11.5px', color: '#e11d48', fontWeight: 500 }}>
                      <ClockCircleOutlined /> 时效已挂起 (未送达目标单位)
                    </span>
                  ) : (
                    <span style={{ fontSize: '11.5px', color: '#16a34a' }}>
                      <ClockCircleOutlined /> 剩00天00时57分
                    </span>
                  )}

                  <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                    🏢 清江浦区网安大队
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>2026-10-15 14:42:52</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    请对帖文展开劝删处置工作
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isQjpFailed ? (
                    <Button
                      size="small"
                      type="primary"
                      danger
                      icon={<ReloadOutlined spin={retryingDirectiveId === qjpDirective?.id} />}
                      loading={retryingDirectiveId === qjpDirective?.id}
                      onClick={() => qjpDirective && handleRetry(qjpDirective.id)}
                    >
                      重新下发
                    </Button>
                  ) : (
                    <>
                      <Button size="small" type="primary">签收</Button>
                      <Button size="small">反馈</Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 卡片底部操作栏 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 10,
                borderTop: '1px dashed #f1f5f9',
                paddingTop: 8,
              }}
            >
              <Button size="small">信息详情</Button>
              <Button
                size="small"
                type="primary"
                icon={<RobotOutlined />}
                style={{ background: '#4f46e5' }}
                onClick={() => openAiModal(null, 'emergency')}
              >
                AI辅助研判
              </Button>
            </div>
          </div>

          {/* 卡片 2：对比演示常规卡片 */}
          <div
            className="unified-opinion-card compact"
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Checkbox />
                <span style={{ color: '#2563eb', fontWeight: 600 }}>2</span>
                <strong style={{ fontSize: '14.5px', color: '#1e293b' }}>
                  现在电动车坐后座不戴头盔都要拍了吗？？？
                </strong>
                <Tag color="cyan">非热敏</Tag>
                <Tag color="blue">已处置</Tag>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#f59e0b', fontSize: '13px' }}>★★★☆☆</span>
                <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>3.5星</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: 8 }}>
              MM <span>•</span> ID 60545847510 <span>•</span> 👥 69 <span>•</span> 🎵 抖音app <span>•</span> ⏱ 2026-10-15 09:52:13
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
              <Button size="small">未处置</Button>
              <Button size="small">信息详情</Button>
              <Button
                size="small"
                type="primary"
                icon={<RobotOutlined />}
                onClick={() => openAiModal(null, 'emergency')}
              >
                AI辅助研判
              </Button>
            </div>
          </div>
        </div>

        {/* 列表底部分页与统计：呈现舆情事件条数（“共 N 条”），使用户进入Tab后直接在此获知卡片总量 */}
        <div className="emergency-pagination-wrapper">
          <Pagination
            size="small"
            total={2}
            pageSize={10}
            current={1}
            showTotal={(total) => `共 ${total} 条`}
            showSizeChanger={false}
          />
        </div>
      </section>
    </div>
  );
};

export default EmergencyResponse;
