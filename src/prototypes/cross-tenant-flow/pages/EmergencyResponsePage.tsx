import React, { useState } from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Switch,
  Checkbox,
  Pagination,
  Tag,
  Rate,
  Modal,
  message
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
  WeiboOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { DisposalTaskItem } from '../types';

const { RangePicker } = DatePicker;

export const EmergencyResponsePage: React.FC = () => {
  const { disposalTasks, openAiJudgeModal, opinions, assignToDistrict } = useAppStore();
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('pending');
  const [autoAlert, setAutoAlert] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DisposalTaskItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('姑苏分局');
  const [assignDirectives, setAssignDirectives] = useState<string[]>(['线下核实', '属地删帖']);
  const [cityRemark, setCityRemark] = useState<string>(
    '请姑苏分局网安大队迅速会同责任所队实地核查，严格落实24小时反馈机制，并强化涉事重点人动态管控。'
  );

  const handleOpenAssignModal = (task: DisposalTaskItem) => {
    setSelectedTask(task);
    setSelectedDistrict('姑苏分局');
    setAssignDirectives(['线下核实', '属地删帖']);
    setCityRemark('请姑苏分局网安大队迅速会同责任所队实地核查，严格落实24小时反馈机制，并强化涉事重点人动态管控。');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedTask) {
      assignToDistrict(selectedTask.id, selectedDistrict, assignDirectives, cityRemark);
      setAssignModalOpen(false);
    }
  };

  const handleOpenProgressModal = (task: DisposalTaskItem) => {
    setSelectedTask(task);
    setProgressModalOpen(true);
  };

  return (
    <div className="p-4 max-w-full mx-auto select-none space-y-3">
      {/* 顶部搜索过滤面板（5 列标准 CSS Grid 规范对齐，Label 固定 72px，杜绝折行） */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs text-xs space-y-3">
        {/* 第 1 行（5 列严格对齐） */}
        <div className="grid grid-cols-5 gap-3 items-center">
          {/* 第 1 列：信息搜索 */}
          <div className="flex items-center">
            <span className="search-label">信息搜索</span>
            <Input placeholder="请输入昵称、网址、组合搜索" size="middle" className="flex-1 text-xs" />
          </div>

          {/* 第 2 列：下发时间 */}
          <div className="flex items-center">
            <span className="search-label">下发时间</span>
            <RangePicker size="middle" className="flex-1 text-xs" />
          </div>

          {/* 第 3 列：处置时间 */}
          <div className="flex items-center">
            <span className="search-label">处置时间</span>
            <Input
              defaultValue="2026-09-09 00:00:00 - 2026-09-10 23:59:59"
              size="middle"
              className="flex-1 text-xs font-mono"
            />
          </div>

          {/* 第 4 列：已发指令 */}
          <div className="flex items-center">
            <span className="search-label">已发指令</span>
            <Select placeholder="请选择" size="middle" className="flex-1 text-xs" allowClear />
          </div>

          {/* 第 5 列：指令状态 */}
          <div className="flex items-center">
            <span className="search-label">指令状态</span>
            <Select
              defaultValue="all"
              size="middle"
              className="flex-1 text-xs"
              options={[
                { value: 'all', label: '全部' },
                { value: 'done', label: '已办结' },
                { value: 'pending', label: '核查中' }
              ]}
            />
          </div>
        </div>

        {/* 第 2 行（5 列严格对齐） */}
        {!filterCollapsed && (
          <div className="grid grid-cols-5 gap-3 items-center pt-1 border-t border-slate-100">
            {/* 第 1 列：日期区间 */}
            <div className="flex items-center">
              <span className="search-label">日期区间</span>
              <RangePicker size="middle" className="flex-1 text-xs" />
            </div>

            {/* 第 2 列：刊号检索 */}
            <div className="flex items-center">
              <span className="search-label">刊号检索</span>
              <Input placeholder="输入刊号查询" size="middle" className="flex-1 text-xs" />
            </div>

            {/* 第 3 列：未发指令 */}
            <div className="flex items-center">
              <span className="search-label">未发指令</span>
              <Select placeholder="请选择" size="middle" className="flex-1 text-xs" allowClear />
            </div>

            {/* 第 4 列：相关人员 */}
            <div className="flex items-center">
              <span className="search-label">相关人员</span>
              <Select placeholder="请选择" size="middle" className="flex-1 text-xs" allowClear />
            </div>

            {/* 第 5 列：任务编号（重点修复：保持整词横排，宽度在 72px 内，禁止出现“编\n号”折行） */}
            <div className="flex items-center">
              <span className="search-label">任务编号</span>
              <Input placeholder="请输入任务编号" size="middle" className="flex-1 text-xs" />
            </div>
          </div>
        )}

        {/* 第 3 行（右下角操作组严格对齐最右侧列） */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            <span>支持跨时间段按任务流向穿透检索</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="middle" icon={<ReloadOutlined />} className="!text-xs">
              重置
            </Button>
            <Button
              type="primary"
              size="middle"
              icon={<SearchOutlined />}
              className="!bg-blue-600 hover:!bg-blue-500 !text-xs !px-4 shadow-2xs"
            >
              查询
            </Button>
            <button
              onClick={() => setFilterCollapsed(!filterCollapsed)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 ml-1 cursor-pointer whitespace-nowrap"
            >
              {filterCollapsed ? '展开' : '收起'} {filterCollapsed ? <DownOutlined className="text-[10px]" /> : <UpOutlined className="text-[10px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* 任务列表控制栏与二级分类 */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左侧标题 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
              <span className="w-1 h-3.5 bg-blue-600 rounded-xs" />
              <span>任务列表</span>
            </div>
          </div>

          {/* 右侧操作群组 */}
          <div className="flex items-center gap-3 text-xs">
            <Button type="primary" size="small" className="!bg-blue-600 hover:!bg-blue-500 !text-xs">
              快捷指令
            </Button>

            <div className="flex items-center gap-1 text-slate-600">
              <Switch checked={autoAlert} onChange={setAutoAlert} size="small" className="bg-blue-600" />
              <span>已打开自动消息提醒</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500">排序</span>
              <Select
                defaultValue="time"
                size="small"
                className="w-36 text-xs"
                options={[
                  { value: 'time', label: '指令处理时间降序' },
                  { value: 'asc', label: '指令处理时间升序' }
                ]}
              />
            </div>

            <div className="flex items-center border border-slate-200 rounded overflow-hidden">
              <button className="px-2.5 py-0.5 bg-blue-600 text-white font-medium text-xs">详细视图</button>
              <button className="px-2.5 py-0.5 bg-white text-slate-600 hover:bg-slate-50 text-xs">处置视图</button>
              <button className="px-2.5 py-0.5 bg-white text-slate-600 hover:bg-slate-50 text-xs">简要视图</button>
            </div>
          </div>
        </div>

        {/* 二级状态 Tab 栏 */}
        <div className="flex items-center gap-4 text-xs overflow-x-auto border-t border-slate-100 pt-2 font-medium">
          {[
            { key: 'pending', label: '待处理(3)' },
            { key: 'assigned', label: '已转派(1)' },
            { key: 'processed', label: '已处理(186)' },
            { key: 'compile', label: '信息编报(90)' },
            { key: 'monitor', label: '持续监测(189)' },
            { key: 'district_impl', label: '属地落实(56)' },
            { key: 'offline_check', label: '线下核实(87)' },
            { key: 'delete_post', label: '属地删帖(16)' },
            { key: 'leader_judge', label: '领导研判(6)' },
            { key: 'platform_report', label: '平台举报(26)' },
            { key: 'notify_web', label: '通报网信(1)' },
            { key: 'corps_impl', label: '总队落实(4)' },
            { key: 'all', label: '全部' }
          ].map((sub) => {
            const isAct = activeSubTab === sub.key;
            return (
              <span
                key={sub.key}
                onClick={() => setActiveSubTab(sub.key)}
                className={`cursor-pointer whitespace-nowrap pb-1 ${
                  isAct ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                {sub.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* 处置任务列表大卡片 */}
      <div className="space-y-3">
        {(activeSubTab === 'pending'
          ? disposalTasks.filter((t) => t.assignedStatus !== '已转派' || t.id === 'dt-prov-1')
          : activeSubTab === 'assigned'
          ? disposalTasks.filter((t) => t.assignedStatus === '已转派')
          : disposalTasks
        ).map((task) => (
          <div
            key={task.id}
            className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs hover:border-blue-300 transition-all text-xs space-y-3 relative"
          >
            {/* 顶栏：复选框 + 序号 + 标题 + 标签 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2.5 flex-1">
                <Checkbox className="mt-1" />
                <span className="text-blue-600 font-bold text-sm font-mono mt-0.5">{task.serialNumber}</span>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-slate-800 text-sm tracking-tight hover:text-blue-600 cursor-pointer">
                      {task.title}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#efe8ff] text-[#7c3aed] border border-[#ddd6fe]">
                      AI 非热敏
                    </span>

                    {/* 省厅督办指令醒目标签 */}
                    {task.isProvinceSupervised && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded font-bold bg-purple-600 text-white shadow-2xs tracking-wide">
                        [省厅督办指令]
                      </span>
                    )}

                    {/* 待处置 / 已转派 标签动态流转 */}
                    {task.assignedStatus === '已转派' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        [已转派：{task.assignedToDistrict || '姑苏分局'}办理中]
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500 text-white shadow-2xs">
                        [待处置]
                      </span>
                    )}
                  </div>

                  {/* 作者、账号、编号、互动量 */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                    <span>{task.author}</span>
                    <span className="font-mono">ID {task.authorId}</span>
                    <span className="flex items-center gap-1">
                      <WeiboOutlined className="text-rose-500" />
                      <span>{task.platform}</span>
                    </span>
                    <span className="font-mono text-slate-400">{task.publishTime}</span>
                    <span className="font-mono text-slate-500">编号 {task.instructionCode}</span>

                    <div className="flex items-center gap-2 ml-2 text-slate-400">
                      <span>评论 {task.commentCount}</span>
                      <span>转发 {task.forwardCount}</span>
                      <span>点赞 {task.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧星级评分 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Rate disabled allowHalf defaultValue={task.stars} className="text-amber-400 text-xs" />
                <span className="text-xs font-semibold text-slate-600">{task.stars}星</span>
              </div>
            </div>

            {/* 中间主要信息区与右侧紫色巨幅指数 */}
            <div className="flex items-stretch gap-4">
              {/* 左侧 AI 摘要、AI 研判与初研 */}
              <div className="flex-1 p-3 bg-[#f5f8fc] rounded-md border border-[#e5edf8] text-xs text-slate-700 leading-relaxed space-y-2">
                <div className="flex items-start gap-1.5">
                  <span className="bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    AI 摘要
                  </span>
                  <p className="text-slate-600 text-xs">{task.aiSummary}</p>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                    AI 研判
                  </span>
                  <p className="text-slate-600 text-xs">{task.aiJudgment}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {task.initialResearchTag}
                  </span>
                </div>
              </div>

              {/* 右侧大字号紫色舆情指数色块（如 42.5） */}
              <div className="w-28 bg-[#f2ebf9] rounded-md border border-[#e8d7fa] flex flex-col items-center justify-center p-3 text-center flex-shrink-0">
                <div className="text-2xl font-bold text-[#722ed1] font-sans">{task.opinionIndex.toFixed(1)}</div>
                <div className="text-[11px] text-[#722ed1] mt-0.5 font-medium">舆情指数</div>
              </div>
            </div>

            {/* 底部标签徽章与右侧操作链 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {task.researchCountTag}
                </span>
                <span className="bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  已完成任务
                </span>
                <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] px-2 py-0.5 rounded">
                  {task.completedTasksTag}
                </span>
                <span className="border border-blue-400 text-blue-600 bg-white text-[10px] px-2 py-0.5 rounded">
                  {task.disposalSummaryTag}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {/* 核心操作：二次指派区县 或 查看进展 */}
                {task.assignedStatus === '已转派' ? (
                  <Button
                    size="small"
                    onClick={() => handleOpenProgressModal(task)}
                    className="!text-xs !text-emerald-700 !border-emerald-300 hover:!bg-emerald-50 font-medium"
                  >
                    查看进展
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    icon={<ShareAltOutlined />}
                    onClick={() => handleOpenAssignModal(task)}
                    className="!bg-blue-600 hover:!bg-blue-500 !text-xs font-semibold shadow-2xs"
                  >
                    二次指派区县
                  </Button>
                )}

                <span className="text-blue-600 hover:underline cursor-pointer">信息详情</span>

                <button
                  onClick={() => openAiJudgeModal(opinions[0])}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded font-medium shadow-2xs transition-all cursor-pointer"
                >
                  <span className="text-[10px] font-bold bg-white/20 px-1 py-0.2 rounded">AI</span>
                  <span>辅助研判</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部底栏与分页 */}
      <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-lg p-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Checkbox>全选</Checkbox>
          <Button type="primary" size="small" className="!bg-blue-600 hover:!bg-blue-500 !text-xs">
            导出数据
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>共 186 条</span>
          <Select
            defaultValue="10"
            size="small"
            className="w-20 text-xs"
            options={[
              { value: '10', label: '10条/页' },
              { value: '20', label: '20条/页' }
            ]}
          />
          <Pagination size="small" defaultCurrent={1} total={186} pageSize={10} showQuickJumper />
        </div>
      </div>

      {/* 二次指派区县 Modal 弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <ShareAltOutlined className="text-blue-600" />
            <span>市局转派省厅指令至下属区县</span>
          </div>
        }
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button onClick={() => setAssignModalOpen(false)} className="!text-xs">
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmAssign}
              className="!bg-blue-600 hover:!bg-blue-500 !text-xs font-semibold"
            >
              确认派发至区县
            </Button>
          </div>
        }
        width={560}
      >
        <div className="space-y-3.5 py-2 text-xs">
          {/* 任务简要信息 */}
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-800">{selectedTask?.title}</div>
            <div className="text-slate-500 mt-1 flex items-center gap-4">
              <span>指令编号：<strong className="text-slate-700 font-mono">{selectedTask?.instructionCode}</strong></span>
              <span>舆情指数：<strong className="text-purple-600 font-mono">{selectedTask?.opinionIndex}</strong></span>
            </div>
          </div>

          {/* 原指令来源 */}
          <div className="p-2.5 bg-blue-50/50 rounded border border-blue-100 flex items-center justify-between">
            <span className="text-slate-600 font-medium">原指令来源:</span>
            <span className="text-blue-700 font-semibold bg-white px-2 py-0.5 rounded border border-blue-200">
              {selectedTask?.provinceSourceNote || '省厅网安总队 (要求 24 小时内办结)'}
            </span>
          </div>

          {/* 指派下辖单位 */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              <span className="text-rose-500 mr-1">*</span>指派下辖单位:
            </label>
            <Select
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              size="middle"
              className="w-full text-xs"
              options={[
                { value: '姑苏分局', label: '姑苏分局 (事发责任辖区)' },
                { value: '工业园区分局', label: '工业园区分局' },
                { value: '高新区分局', label: '高新区分局' },
                { value: '吴中分局', label: '吴中分局' },
                { value: '相城分局', label: '相城分局' }
              ]}
            />
          </div>

          {/* 指令动作 */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              <span className="text-rose-500 mr-1">*</span>指令动作 (已继承省厅要求):
            </label>
            <Checkbox.Group
              value={assignDirectives}
              onChange={(vals) => setAssignDirectives(vals as string[])}
              className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-slate-200"
            >
              <Checkbox value="线下核实">
                <span className="font-medium text-slate-700">线下核实</span>
                <span className="text-slate-400 text-[11px] ml-0.5">(继承省厅)</span>
              </Checkbox>
              <Checkbox value="属地删帖">
                <span className="font-medium text-slate-700">属地删帖</span>
                <span className="text-slate-400 text-[11px] ml-0.5">(继承省厅)</span>
              </Checkbox>
              <Checkbox value="重点人管控">
                <span className="font-semibold text-blue-700">重点人管控</span>
                <span className="text-blue-500 text-[11px] ml-0.5">(市局追加)</span>
              </Checkbox>
              <Checkbox value="情况回传">
                <span className="font-medium text-slate-700">情况回传</span>
                <span className="text-slate-400 text-[11px] ml-0.5">(24h节点)</span>
              </Checkbox>
            </Checkbox.Group>
          </div>

          {/* 市局批示 */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              市局批示:
            </label>
            <Input.TextArea
              rows={3}
              value={cityRemark}
              onChange={(e) => setCityRemark(e.target.value)}
              placeholder="请输入市局追加的指导批示意见..."
              className="text-xs"
            />
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
            💡 确认派发后，该督办指令将直达姑苏分局内网工作台，区县接单核实并回传结论。
          </div>
        </div>
      </Modal>

      {/* 查看进展 Modal 弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>区县承办流转进展穿透追踪</span>
          </div>
        }
        open={progressModalOpen}
        onCancel={() => setProgressModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setProgressModalOpen(false)} className="!bg-blue-600 !text-xs">
            关闭
          </Button>
        ]}
        width={500}
      >
        <div className="space-y-3 py-2 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-md">
            <div className="font-bold text-emerald-800 mb-1">当前状态：区县办理中 (实地核查中)</div>
            <div className="text-slate-600">承办单位：苏州市公安局姑苏分局网安大队</div>
            <div className="text-slate-600">承办民警：张警官 (民警警号: 062145)</div>
          </div>

          <div className="border-l-2 border-blue-500 pl-3 ml-1 space-y-2">
            <div>
              <div className="font-bold text-slate-800">17:40 - 省厅网安总队</div>
              <div className="text-slate-500">下发实战督办指令单 (任务编号: ZL20260911001)</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">17:48 - 市局网安支队</div>
              <div className="text-slate-500">已转派至【姑苏分局】，并追加【重点人管控】指令动作</div>
            </div>
            <div>
              <div className="font-bold text-emerald-700">17:52 - 姑苏分局网安大队</div>
              <div className="text-slate-500">值班民警张警官已签收，正在联合责任经侦及观前派出所开展实地走访</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
