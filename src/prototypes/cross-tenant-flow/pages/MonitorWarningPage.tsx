import React, { useState } from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Tag,
  Rate,
  Pagination,
  Dropdown,
  message,
  Modal,
  Descriptions,
  Divider
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  WeiboOutlined,
  ExportOutlined,
  FileTextOutlined,
  LinkOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { OpinionItem } from '../types';

const { RangePicker } = DatePicker;

export const MonitorWarningPage: React.FC = () => {
  const { opinions, openAiJudgeModal, setActiveNav, currentPost, convertToLocalTask, ignoreOpinion } = useAppStore();
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const isProvincePost = currentPost === 'province_post';
  const isShuyangPost = currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post';
  const [activeTab, setActiveTab] = useState(
    isProvincePost ? 'city_report' : isShuyangPost ? 'local' : 'district'
  );
  const [viewMode, setViewMode] = useState<'detail' | 'judge' | 'brief'>('brief');

  // 原文查看弹窗与工单详情弹窗
  const [originalModalOpen, setOriginalModalOpen] = useState(false);
  const [viewingOriginalOpinion, setViewingOriginalOpinion] = useState<OpinionItem | null>(null);

  const [workOrderModalOpen, setWorkOrderModalOpen] = useState(false);
  const [viewingWorkOrderOpinion, setViewingWorkOrderOpinion] = useState<OpinionItem | null>(null);

  // 当岗位改变时联动 Tab
  React.useEffect(() => {
    if (currentPost === 'province_post') {
      setActiveTab('city_report');
    } else if (currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post') {
      setActiveTab('local');
    } else {
      setActiveTab('district');
    }
  }, [currentPost]);

  const handleCopy = (opinion: OpinionItem) => {
    navigator.clipboard?.writeText(`${opinion.title} (来源: ${opinion.platform}, 作者: ${opinion.author})`);
    message.success('已复制舆情信息至剪贴板');
  };

  return (
    <div className="p-4 max-w-full mx-auto select-none space-y-3">
      {/* 顶部高级筛选卡片（5 列标准 CSS Grid 统一排布，Label 固定 72px 右对齐，杜绝折行） */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs text-xs space-y-3">
        {/* 第 1 行（5 列严格对齐） */}
        <div className="grid grid-cols-5 gap-3 items-center">
          {/* 第 1 列：内容搜索 */}
          <div className="flex items-center">
            <span className="search-label">内容搜索</span>
            <Input placeholder="可输入标题/正文/作者/ID" size="middle" className="flex-1 text-xs" />
          </div>

          {/* 第 2 列：上报区县 */}
          <div className="flex items-center">
            <span className="search-label">上报区县</span>
            <Select
              placeholder="请选择"
              size="middle"
              className="flex-1 text-xs"
              allowClear
              options={[
                { value: '姑苏区', label: '姑苏区' },
                { value: '江宁区', label: '江宁区' },
                { value: '沭阳县', label: '沭阳县' },
                { value: '昆山市', label: '昆山市' }
              ]}
            />
          </div>

          {/* 第 3 列：发布时间 */}
          <div className="flex items-center">
            <span className="search-label">发布时间</span>
            <RangePicker size="middle" className="flex-1 text-xs" />
          </div>

          {/* 第 4 列：信息状态 */}
          <div className="flex items-center">
            <span className="search-label">信息状态</span>
            <Select
              defaultValue="未处置"
              size="middle"
              className="flex-1 text-xs"
              options={[
                { value: '未处置', label: '未处置' },
                { value: '处置中', label: '处置中' },
                { value: '已处置', label: '已处置' }
              ]}
            />
          </div>

          {/* 第 5 列：舆情等级 */}
          <div className="flex items-center">
            <span className="search-label">舆情等级</span>
            <Select
              placeholder="请选择"
              size="middle"
              className="flex-1 text-xs"
              allowClear
              options={[
                { value: '一级 (特急)', label: '一级 (特急)' },
                { value: '二级 (高)', label: '二级 (高)' },
                { value: '三级 (中)', label: '三级 (中)' },
                { value: '四级 (低)', label: '四级 (低)' }
              ]}
            />
          </div>
        </div>

        {/* 第 2 行（5 列与第 1 行上下严格对齐） */}
        {!filterCollapsed && (
          <div className="grid grid-cols-5 gap-3 items-center pt-1 border-t border-slate-100">
            {/* 第 1 列：舆情类型 */}
            <div className="flex items-center">
              <span className="search-label">舆情类型</span>
              <Select
                placeholder="请选择"
                size="middle"
                className="flex-1 text-xs"
                options={[
                  { value: '公共安全事故', label: '公共安全事故' },
                  { value: '涉警维权舆情', label: '涉警维权舆情' },
                  { value: '涉校园学生安全', label: '涉校园学生安全' }
                ]}
              />
            </div>

            {/* 第 2 列：专项任务 */}
            <div className="flex items-center">
              <span className="search-label">专项任务</span>
              <Select placeholder="请选择" size="middle" className="flex-1 text-xs" />
            </div>

            {/* 第 3 列：责任属地 */}
            <div className="flex items-center">
              <span className="search-label">责任属地</span>
              <Select placeholder="请选择" size="middle" className="flex-1 text-xs" />
            </div>

            {/* 第 4 列：上报时间 */}
            <div className="flex items-center">
              <span className="search-label">上报时间</span>
              <Input
                defaultValue="2026-09-09 00:00:00 - 2026-09-10 23:59:59"
                size="middle"
                className="flex-1 text-xs font-mono"
              />
            </div>

            {/* 第 5 列：信源渠道 */}
            <div className="flex items-center">
              <span className="search-label">信源渠道</span>
              <Select
                placeholder="请选择"
                size="middle"
                className="flex-1 text-xs"
                options={[
                  { value: '抖音', label: '抖音' },
                  { value: '微博', label: '微博' },
                  { value: '快手', label: '快手' },
                  { value: '头条', label: '今日头条' }
                ]}
              />
            </div>
          </div>
        )}

        {/* 第 3 行（底栏功能与控制对齐，彻底修复“编号”、“排序”换行问题） */}
        <div className="grid grid-cols-5 gap-3 items-center pt-1 border-t border-slate-100">
          {/* 第 1 列：排序方式 */}
          <div className="flex items-center">
            <span className="search-label">排序方式</span>
            <Select
              defaultValue="desc"
              size="middle"
              className="flex-1 text-xs"
              options={[
                { value: 'desc', label: '上报时间-降序' },
                { value: 'asc', label: '上报时间-升序' },
                { value: 'heat', label: '舆情热度-降序' }
              ]}
            />
          </div>

          {/* 第 2 列：编号检索（整词横排，宽度在 72px 内，禁止折行） */}
          <div className="flex items-center">
            <span className="search-label">编号检索</span>
            <Input placeholder="请输入编号" size="middle" className="flex-1 text-xs" />
          </div>

          {/* 第 3 列与第 4 列：视图切换按钮组 */}
          <div className="col-span-2 flex items-center gap-2 pl-4">
            <span className="text-slate-500 whitespace-nowrap">视图切换:</span>
            <div className="flex items-center border border-slate-200 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('detail')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'detail'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                详细视图
              </button>
              <button
                onClick={() => setViewMode('judge')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'judge'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                研判视图
              </button>
              <button
                onClick={() => setViewMode('brief')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'brief'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                简要视图
              </button>
            </div>
          </div>

          {/* 第 5 列：操作按钮区（右对齐） */}
          <div className="flex items-center justify-end gap-2">
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

      {/* 业务分类 Tab 标签栏 */}
      <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-lg px-4 py-2 shadow-2xs">
        <div className="flex items-center gap-5 text-xs font-medium">
          {(isProvincePost
            ? [
                { key: 'city_report', label: '地市上报', badge: 2 },
                { key: 'all', label: '全部' },
                { key: 'service', label: '数据服务', badge: 12 },
                { key: 'auto', label: '主动发现' },
                { key: 'focus', label: '重点账号跟踪' },
                { key: 'patrol', label: '专项巡查' },
                { key: 'linkage', label: '三情联动' },
                { key: 'police', label: '警种通报' }
              ]
            : isShuyangPost
            ? [
                { key: 'local', label: '本地舆情', badge: 6 }
              ]
            : [
                { key: 'district', label: '区县上报', badge: 3 },
                { key: 'all', label: '全部' },
                { key: 'local', label: '本地舆情', badge: 4 },
                { key: 'service', label: '数据服务' },
                { key: 'auto', label: '主动发现' },
                { key: 'focus', label: '重点账号跟踪' },
                { key: 'patrol', label: '专项巡查' },
                { key: 'linkage', label: '三情联动' },
                { key: 'police', label: '警种通报' }
              ]
          ).map((tab) => {
            const isAct = activeTab === tab.key;
            return (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer py-1 flex items-center gap-1 transition-colors ${
                  isAct ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-rose-500 text-white rounded-full px-1.5 py-0 text-[10px] font-mono leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 右侧蓝色手工上报按钮 */}
        <Button
          type="primary"
          size="middle"
          onClick={() => setActiveNav('manual_report')}
          className="!bg-blue-600 hover:!bg-blue-500 !text-xs !px-4 shadow-2xs"
        >
          手工上报
        </Button>
      </div>

      {/* 沭阳内网未采购版专属提示横幅 */}
      {(activeTab === 'local' || isShuyangPost) && (
        <div className="bg-blue-50/90 border border-blue-200 text-blue-900 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs shadow-2xs">
          <span className="text-blue-600 font-bold text-sm">ℹ️</span>
          <span className="font-medium leading-relaxed">
            本板块舆情由省厅统一采购第三方商业数据接入，经 AI 属地模型智能识别，已自动分流过滤出涉沭阳辖区相关线索。
          </span>
        </div>
      )}

      {/* 数据卡片流列表 */}
      <div className="space-y-3">
        {opinions
          .filter((item) => {
            if (activeTab === 'local') {
              return item.isThirdPartyRouted;
            }
            if (activeTab === 'district') {
              return !item.isThirdPartyRouted && item.sourceType !== '地市审核同步';
            }
            if (activeTab === 'city_report') {
              return item.auditStatus === '已通过' || item.sourceUnitTag?.includes('上报');
            }
            return true;
          })
          .map((item, idx) => (
          <div
            key={item.id}
            className={`bg-white border rounded-lg p-4 shadow-2xs transition-all text-xs space-y-2.5 ${
              item.isIgnored ? 'opacity-60 border-slate-200 bg-slate-50/60' : 'border-[#e5e7eb] hover:border-blue-300'
            }`}
          >
            {/* 序号与标题行 */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-blue-600 font-bold text-sm font-mono mt-0.5">{idx + 1}</span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-slate-800 text-sm tracking-tight hover:text-blue-600 cursor-pointer">
                      {item.title}
                    </h2>
                    {item.isThirdPartyRouted && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-300">
                        [第三方商采·模型自动分流]
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.isHot
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                          : 'bg-[#efe8ff] text-[#7c3aed] border border-[#ddd6fe]'
                      }`}
                    >
                      {item.isHot ? 'AI 热敏' : '[非热敏]'}
                    </span>
                  </div>

                  {/* 作者与元数据信息行 */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span>{item.author}</span>
                    <span className="font-mono">ID {item.authorId}</span>
                    {item.fansCount && <span>粉丝 {item.fansCount}</span>}
                    <span className="flex items-center gap-0.5">
                      <EnvironmentOutlined className="text-slate-400" />
                      {item.fullRegionPath || item.region}
                    </span>
                    <span className="flex items-center gap-1">
                      {item.platform === '微博' ? (
                        <WeiboOutlined className="text-rose-500" />
                      ) : (
                        <span className="w-3.5 h-3.5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                          d
                        </span>
                      )}
                      <span>{item.platform}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <CalendarOutlined />
                      {item.publishTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* 右侧星级评分与舆情指数 */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Rate disabled allowHalf value={item.stars} className="text-amber-400 text-xs" />
                  <span className="text-xs font-semibold text-slate-600">{item.stars}星</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  舆情指数: <strong className="text-blue-600 text-xs font-bold">{item.opinionScore}</strong>
                </div>
              </div>
            </div>

            {/* 初研与 AI 气泡框 */}
            <div className="p-2.5 bg-[#f5f8fc] rounded-md border border-[#e5edf8] text-xs text-slate-700 leading-relaxed space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  AI {item.initialResearch}
                </span>
                <span className="text-slate-600">{item.aiSummary}</span>
              </div>
            </div>

            {/* 卡片底栏信息与操作组 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                {/* 规范展示数据来源Tag（如 [苏州市公安局上报]） */}
                {item.sourceUnitTag ? (
                  <span className="border border-blue-500 text-blue-600 bg-blue-50/70 font-semibold px-2 py-0.5 rounded">
                    {item.sourceUnitTag}
                  </span>
                ) : (
                  <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                    数据来源: {item.sourceType}
                  </span>
                )}

                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                  {item.reportTime} {item.reporterUnit}
                </span>

                {item.provinceTag && (
                  <span className="border border-blue-400 text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded">
                    {item.provinceTag}
                  </span>
                )}
                {item.cityTag && (
                  <span className="border border-purple-400 text-purple-600 bg-purple-50/50 px-2 py-0.5 rounded">
                    {item.cityTag}
                  </span>
                )}
                {item.categoryTag && (
                  <span className="border border-cyan-400 text-cyan-600 bg-cyan-50/50 px-2 py-0.5 rounded">
                    {item.categoryTag}
                  </span>
                )}

                {item.noVideoWarning && (
                  <span className="bg-amber-50 text-amber-600 border border-amber-300 px-2 py-0.5 rounded font-medium">
                    未上传视频
                  </span>
                )}

                {/* 审核与指令流转状态展示标签 */}
                {item.localWorkOrderStatus ? (
                  <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shadow-2xs tracking-wide">
                    [已转为本地核查工单]
                  </span>
                ) : item.isIgnored ? (
                  <span className="bg-slate-400 text-white font-medium px-2 py-0.5 rounded text-[11px]">
                    [已忽略]
                  </span>
                ) : item.instructionStatus ? (
                  <span className="bg-indigo-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shadow-2xs tracking-wide">
                    {item.instructionStatus}
                  </span>
                ) : item.auditStatus === '待审核' ? (
                  <span className="bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shadow-2xs tracking-wide">
                    [待市局把关]
                  </span>
                ) : item.auditStatus === '已通过' ? (
                  <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] shadow-2xs tracking-wide">
                    [已同步省厅·市局终审版]
                  </span>
                ) : item.auditStatus === '仅保留地市自办' ? (
                  <span className="bg-slate-500 text-white font-semibold px-2.5 py-0.5 rounded text-[11px]">
                    [仅保留地市自办]
                  </span>
                ) : null}
              </div>

              {/* 右侧动作链 */}
              <div className="flex items-center gap-3 text-xs">
                {/* 沭阳/第三方商采专属动作流 */}
                {item.isThirdPartyRouted || isShuyangPost ? (
                  <>
                    <button
                      onClick={() => {
                        setViewingOriginalOpinion(item);
                        setOriginalModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <LinkOutlined className="text-[11px]" />
                      <span>查看原文</span>
                    </button>

                    {item.localWorkOrderCode || item.localWorkOrderStatus ? (
                      <button
                        onClick={() => {
                          setViewingWorkOrderOpinion(item);
                          setWorkOrderModalOpen(true);
                        }}
                        className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCircleOutlined className="text-emerald-600" />
                        <span>工单详情 ({item.localWorkOrderCode || 'SY20260911001'})</span>
                      </button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => convertToLocalTask(item.id, '城关派出所')}
                        className="!bg-blue-600 hover:!bg-blue-500 !text-xs !px-3 shadow-2xs"
                      >
                        转为本地核查
                      </Button>
                    )}

                    {item.isIgnored ? (
                      <span className="text-slate-400 text-xs">已忽略</span>
                    ) : (
                      <button
                        onClick={() => ignoreOpinion(item.id)}
                        className="text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                      >
                        忽略
                      </button>
                    )}

                    <span className="bg-[#eef6ff] text-blue-600 border border-[#d4e8ff] px-2 py-0.5 rounded font-medium">
                      {item.statusText}
                    </span>

                    {/* 辅助研判 */}
                    <button
                      onClick={() => openAiJudgeModal(item)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded font-medium shadow-2xs transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold bg-white/20 px-1 py-0.2 rounded">AI</span>
                      <span>辅助研判</span>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-blue-600 hover:underline cursor-pointer">一键搜索</span>

                    <Dropdown
                      menu={{
                        items: [
                          { key: 'copy_all', label: '复制完整研判' },
                          { key: 'copy_url', label: '复制原文链接' }
                        ],
                        onClick: () => handleCopy(item)
                      }}
                    >
                      <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
                        复制信息 <DownOutlined className="text-[10px]" />
                      </span>
                    </Dropdown>

                    <span className="bg-[#eef6ff] text-blue-600 border border-[#d4e8ff] px-2.5 py-0.5 rounded font-medium">
                      {item.statusText}
                    </span>

                    <span className="text-blue-600 hover:underline cursor-pointer">信息详情</span>

                    {/* AI 辅助研判按钮 */}
                    <button
                      onClick={() => openAiJudgeModal(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded font-medium shadow-2xs transition-all cursor-pointer"
                    >
                      <span className="text-[10px] font-bold bg-white/20 px-1 py-0.2 rounded">AI</span>
                      <span>辅助研判</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部底栏与分页 */}
      <div className="flex items-center justify-between bg-white border border-[#e5e7eb] rounded-lg p-3 shadow-2xs">
        <Button type="primary" icon={<ExportOutlined />} size="small" className="!bg-blue-600 hover:!bg-blue-500 !text-xs">
          导出数据
        </Button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>共 {opinions.length} 条</span>
          <Pagination size="small" defaultCurrent={1} total={opinions.length} pageSize={10} showQuickJumper />
        </div>
      </div>

      {/* 查看原文模态弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
            <FileTextOutlined className="text-blue-600" />
            <span>原文信息查看</span>
            {viewingOriginalOpinion?.isThirdPartyRouted && (
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                第三方商采原始贴文
              </span>
            )}
          </div>
        }
        open={originalModalOpen}
        onCancel={() => setOriginalModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setOriginalModalOpen(false)}>
            关闭
          </Button>,
          viewingOriginalOpinion && !viewingOriginalOpinion.localWorkOrderCode && (
            <Button
              key="convert"
              type="primary"
              className="!bg-blue-600"
              onClick={() => {
                convertToLocalTask(viewingOriginalOpinion.id, '城关派出所');
                setOriginalModalOpen(false);
              }}
            >
              直接转为本地核查工单
            </Button>
          )
        ]}
        width={680}
      >
        {viewingOriginalOpinion && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <h3 className="text-sm font-bold text-slate-800">{viewingOriginalOpinion.title}</h3>
              <div className="flex items-center gap-4 text-slate-500 flex-wrap">
                <span>信源平台: <strong>{viewingOriginalOpinion.platform}</strong></span>
                <span>作者账号: <strong>{viewingOriginalOpinion.author}</strong></span>
                <span>用户ID: <code className="font-mono">{viewingOriginalOpinion.authorId}</code></span>
                <span>发布时间: <strong>{viewingOriginalOpinion.publishTime}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <EnvironmentOutlined className="text-slate-400" />
                <span>涉事属地路径: <strong>{viewingOriginalOpinion.fullRegionPath || viewingOriginalOpinion.region}</strong></span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">贴文正文还原</span>
                <span className="text-slate-400 text-[11px]">商采数据源原文字段镜像</span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xs">
                {viewingOriginalOpinion.aiSummary}
              </p>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-amber-800 leading-relaxed">
                <span className="font-semibold">【现场视频/图片提取文字】：</span>
                现场画面显示降雨造成积水，周边商户正使用挡水板自救，路过非机动车推行缓慢，发帖人画外音：“下大雨了，迎宾大道路口又积水了，大家注意绕开走，希望市政赶紧修修。”
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-400 text-[10px]">阅读/播放量</div>
                <div className="text-slate-700 font-bold font-mono text-sm mt-0.5">2,840</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-400 text-[10px]">点赞互动</div>
                <div className="text-slate-700 font-bold font-mono text-sm mt-0.5">168</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-400 text-[10px]">评论条数</div>
                <div className="text-slate-700 font-bold font-mono text-sm mt-0.5">42</div>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <div className="text-slate-400 text-[10px]">转发扩散</div>
                <div className="text-slate-700 font-bold font-mono text-sm mt-0.5">19</div>
              </div>
            </div>

            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <LinkOutlined />
              <span>数据抓取源地址: </span>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">
                {`https://${viewingOriginalOpinion.platform === '微博' ? 'weibo.com' : 'v.douyin.com'}/feed/${viewingOriginalOpinion.authorId}/item-091102`}
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* 本地核查工单详情模态弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
            <CheckCircleOutlined className="text-emerald-600" />
            <span>本地核查处置工单详情</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
              办理中
            </span>
          </div>
        }
        open={workOrderModalOpen}
        onCancel={() => setWorkOrderModalOpen(false)}
        footer={[
          <Button key="close" type="primary" className="!bg-blue-600" onClick={() => setWorkOrderModalOpen(false)}>
            确定
          </Button>
        ]}
        width={640}
      >
        {viewingWorkOrderOpinion && (
          <div className="space-y-3 py-2 text-xs">
            <Descriptions size="small" bordered column={2}>
              <Descriptions.Item label="工单编号">
                <span className="font-mono font-bold text-blue-600">
                  {viewingWorkOrderOpinion.localWorkOrderCode || 'SY20260911001'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="生成方式">一键转为本地核查</Descriptions.Item>
              <Descriptions.Item label="派发责任单位">沭阳县局网安大队</Descriptions.Item>
              <Descriptions.Item label="承办基层所队">沭阳县公安局城关派出所</Descriptions.Item>
              <Descriptions.Item label="责任经办民警">李建华 (警号: 052148)</Descriptions.Item>
              <Descriptions.Item label="派发时间">2026-09-11 17:42:15</Descriptions.Item>
              <Descriptions.Item label="办结要求时限" span={2}>
                <span className="text-rose-600 font-semibold">24小时内核实并反馈处置结果 (2026-09-12 18:00 前)</span>
              </Descriptions.Item>
              <Descriptions.Item label="关联舆情主题" span={2}>
                <span className="font-semibold text-slate-800">{viewingWorkOrderOpinion.title}</span>
              </Descriptions.Item>
              <Descriptions.Item label="核查处置指令" span={2}>
                <div className="text-slate-700 leading-relaxed">
                  1. 请属地城关派出所安排巡逻民警前往迎宾大道与上海路交口现场实地踏勘，协调市政防汛排涝排障。<br />
                  2. 现场维护交通秩序，提醒过往行人与车辆绕行安全通道。<br />
                  3. 密切关注后续舆情发酵情况，处置完毕后于系统内回传现场照片与简要核查结论。
                </div>
              </Descriptions.Item>
            </Descriptions>

            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>实时流转进度：所队已签收办理中</span>
              </div>
              <div className="text-[11px] text-emerald-800">
                【17:45:00】城关派出所值班综合指挥室已系统接收该工单，责任民警李建华已携单前往现场。
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
