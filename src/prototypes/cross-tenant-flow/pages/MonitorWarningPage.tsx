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
  message
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  WeiboOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { OpinionItem } from '../types';

const { RangePicker } = DatePicker;

export const MonitorWarningPage: React.FC = () => {
  const { opinions, openAiJudgeModal, setActiveNav } = useAppStore();
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('district');
  const [viewMode, setViewMode] = useState<'detail' | 'judge' | 'brief'>('brief');

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
                { value: '渝北区', label: '渝北区' },
                { value: '垫江县', label: '垫江县' },
                { value: '梁平区', label: '梁平区' },
                { value: '忠县', label: '忠县' }
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
          {[
            { key: 'all', label: '全部' },
            { key: 'district', label: '区县上报' },
            { key: 'auto', label: '主动发现' },
            { key: 'focus', label: '重点账号跟踪' },
            { key: 'patrol', label: '专项巡查' },
            { key: 'linkage', label: '三情联动' },
            { key: 'police', label: '警种通报' },
            { key: 'service', label: '数据服务' },
            { key: 'local', label: '本地上报' },
            { key: 'third_party', label: '第三方数据', badge: 12 }
          ].map((tab) => {
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

      {/* 数据卡片流列表 */}
      <div className="space-y-3">
        {opinions.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-2xs hover:border-blue-300 transition-all text-xs space-y-2.5"
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
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.isHot
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                          : 'bg-[#efe8ff] text-[#7c3aed] border border-[#ddd6fe]'
                      }`}
                    >
                      AI {item.isHot ? '热敏' : '非热敏'}
                    </span>
                  </div>

                  {/* 作者与元数据信息行 */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span>{item.author}</span>
                    <span className="font-mono">ID {item.authorId}</span>
                    {item.fansCount && <span>粉丝 {item.fansCount}</span>}
                    <span className="flex items-center gap-0.5">
                      <EnvironmentOutlined className="text-slate-400" />
                      {item.region}
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

              {/* 右侧星级评分 */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Rate disabled allowHalf defaultValue={item.stars} className="text-amber-400 text-xs" />
                <span className="text-xs font-semibold text-slate-600">{item.stars}星</span>
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
                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
                  数据来源: {item.sourceType}
                </span>
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

                {/* 跨租户状态展示 */}
                {item.syncToProvince && (
                  item.auditStatus === '待审核' ? (
                    <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded">
                      [待市局审核同步]
                    </span>
                  ) : item.auditStatus === '已通过' ? (
                    <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                      {item.firstReportStatus === '全省首报' ? '[已同步省厅·全省首报]' : '[已同步省厅·重复归并]'}
                    </span>
                  ) : (
                    <span className="bg-slate-400 text-white px-2 py-0.5 rounded">
                      [地市私有留存]
                    </span>
                  )
                )}
              </div>

              {/* 右侧动作链 */}
              <div className="flex items-center gap-3 text-xs">
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
    </div>
  );
};
