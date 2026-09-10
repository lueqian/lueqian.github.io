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
  const [activeSubTab, setActiveSubTab] = useState('processed');
  const [autoAlert, setAutoAlert] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DisposalTaskItem | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('忠县公安局');

  const handleOpenAssignModal = (task: DisposalTaskItem) => {
    setSelectedTask(task);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (selectedTask) {
      assignToDistrict(selectedTask.id, selectedDistrict);
      setAssignModalOpen(false);
    }
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
            { key: 'pending', label: '待处理' },
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
        {disposalTasks.map((task) => (
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
                    <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#eef6ff] text-blue-600 border border-[#d4e8ff]">
                      {task.status}
                    </span>
                    {task.assignedToDistrict && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-300">
                        已转派: {task.assignedToDistrict}
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

              {/* 右侧大字号紫色舆情指数色块 */}
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
                {/* 下达区县 */}
                <button
                  onClick={() => handleOpenAssignModal(task)}
                  className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1 border border-blue-300 hover:border-blue-500 bg-blue-50/50 px-2 py-0.5 rounded"
                >
                  <ShareAltOutlined /> 下达区县
                </button>

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

      {/* 下达区县弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <ShareAltOutlined className="text-blue-600" />
            <span>市局任务向下转派至区县承办</span>
          </div>
        }
        open={assignModalOpen}
        onCancel={() => setAssignModalOpen(false)}
        onOk={handleConfirmAssign}
        okText="确认下达区县"
        cancelText="取消"
        okButtonProps={{ className: '!bg-blue-600' }}
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="font-bold text-slate-800">{selectedTask?.title}</div>
            <div className="text-slate-500 mt-1">指令编号：{selectedTask?.instructionCode}</div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              选择受令承办区县公安局：
            </label>
            <Select
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              className="w-full text-xs"
              options={[
                { value: '忠县公安局', label: '忠县公安局' },
                { value: '渝北区分局', label: '渝北区分局' },
                { value: '垫江县公安局', label: '垫江县公安局' },
                { value: '梁平区分局', label: '梁平区分局' }
              ]}
            />
          </div>

          <div className="text-[11px] text-slate-500">
            下达后，该任务将直达区县工作台，区县线下核实后回传处置结论，全链路状态实时向上汇聚。
          </div>
        </div>
      </Modal>
    </div>
  );
};
