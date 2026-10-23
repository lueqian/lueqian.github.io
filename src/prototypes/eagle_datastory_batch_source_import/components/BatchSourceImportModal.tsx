import React, { useState, useEffect, useMemo } from 'react';
import {
  MOCK_MATCHED_ACCOUNTS,
  MOCK_CONFLICT_ITEMS,
  MOCK_UNHIT_LINKS,
  MOCK_DIRECTORIES,
} from '../mock-data';
import { MatchedAccount, ConflictItem, SourceDirectory } from '../types';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  FolderPlus,
  FolderCheck,
  Check,
  Search,
  Users,
  Eye,
  Lock,
  Loader2,
  HelpCircle,
  FileDown,
} from 'lucide-react';
import { message, Tooltip, Radio, Checkbox, Select, Input, Progress } from 'antd';

interface BatchSourceImportModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: 'matched' | 'conflicts' | 'unhit';
  initialStage?: 'upload' | 'parsing' | 'results';
  onConfirmSuccess?: (summary: {
    matchedCount: number;
    dirName: string;
    autoCrawlCount?: number;
  }) => void;
}

export const BatchSourceImportModal: React.FC<BatchSourceImportModalProps> = ({
  open,
  onClose,
  initialTab = 'matched',
  initialStage = 'results',
  onConfirmSuccess,
}) => {
  // 阶段状态: 'upload' | 'parsing' | 'results'
  const [stage, setStage] = useState<'upload' | 'parsing' | 'results'>(initialStage);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStatusText, setParseStatusText] = useState('正在读取文件结构...');

  // 结果标签页
  const [activeTab, setActiveTab] = useState<'matched' | 'conflicts' | 'unhit'>(initialTab);

  // 精准匹配列表
  const [matchedList, setMatchedList] = useState<MatchedAccount[]>(MOCK_MATCHED_ACCOUNTS);

  // 冲突项列表与单选状态
  const [conflicts, setConflicts] = useState<ConflictItem[]>(MOCK_CONFLICT_ITEMS);
  const [conflictErrors, setConflictErrors] = useState<Record<string, boolean>>({});

  // 异步补采勾选
  const [autoCrawlChecked, setAutoCrawlChecked] = useState(true);

  // 目录选择模式: 'existing' | 'new'
  const [dirMode, setDirMode] = useState<'existing' | 'new'>('existing');
  const [selectedDirId, setSelectedDirId] = useState<string>('dir_101');
  const [newDirName, setNewDirName] = useState('');
  const [newDirVisibility, setNewDirVisibility] = useState<'public' | 'private'>('public');

  // 当外部改变场景时同步初始状态
  useEffect(() => {
    if (open) {
      setStage(initialStage);
      setActiveTab(initialTab);
      setConflictErrors({});
      if (initialStage === 'upload') {
        setParseProgress(0);
      }
    }
  }, [open, initialTab, initialStage]);

  // 全选/取消全选
  const allSelected = useMemo(
    () => matchedList.length > 0 && matchedList.every((item) => item.selected),
    [matchedList]
  );
  const someSelected = useMemo(
    () => matchedList.some((item) => item.selected) && !allSelected,
    [matchedList, allSelected]
  );
  // 精准匹配已选计数
  const matchedSelectedCount = useMemo(
    () => matchedList.filter((item) => item.selected).length,
    [matchedList]
  );

  // 冲突项中有效选中的候选实体计数（candidate_0 或 candidate_1）
  const conflictSelectedCount = useMemo(
    () =>
      conflicts.filter(
        (item) => item.selectedOption === 'candidate_0' || item.selectedOption === 'candidate_1'
      ).length,
    [conflicts]
  );

  // 跳过的冲突项数量
  const conflictSkippedCount = useMemo(
    () => conflicts.filter((item) => item.selectedOption === 'skip').length,
    [conflicts]
  );

  // 总已选导入账号数 = 精准匹配已选数 + 冲突项有效选中数
  const totalSelectedCount = useMemo(
    () => matchedSelectedCount + conflictSelectedCount,
    [matchedSelectedCount, conflictSelectedCount]
  );

  const handleToggleSelectAll = (checked: boolean) => {
    setMatchedList((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const handleToggleSelectOne = (id: string, checked: boolean) => {
    setMatchedList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: checked } : item))
    );
  };

  // 模拟上传解析推进
  const handleStartUploadMock = () => {
    setStage('parsing');
    setParseProgress(20);
    setParseStatusText('正在解析单列 URL 并剥离 UTM 追踪参数...');

    setTimeout(() => {
      setParseProgress(65);
      setParseStatusText('正在基于倒排索引库比对 35 条账号实体...');
    }, 600);

    setTimeout(() => {
      setParseProgress(100);
      setParseStatusText('解析完成！发现 28 条精准匹配，2 条冲突实体，5 条未命中。');
      setTimeout(() => {
        setStage('results');
        setActiveTab('matched');
        // 重置冲突项为默认选中第一个实体
        setConflicts(
          MOCK_CONFLICT_ITEMS.map((item) => ({ ...item, selectedOption: 'candidate_0' }))
        );
      }, 500);
    }, 1300);
  };

  // 冲突项单选处理
  const handleSelectConflict = (
    conflictId: string,
    option: 'candidate_0' | 'candidate_1' | 'skip'
  ) => {
    setConflicts((prev) =>
      prev.map((item) => (item.id === conflictId ? { ...item, selectedOption: option } : item))
    );
    setConflictErrors((prev) => ({ ...prev, [conflictId]: false }));
  };

  // 一键复制未匹配链接
  const handleCopyUnhitUrls = () => {
    const urls = MOCK_UNHIT_LINKS.map((item) => item.url).join('\n');
    navigator.clipboard?.writeText(urls);
    message.success('已复制 5 条未匹配链接至剪贴板');
  };

  // 获取当前选中的目录余量
  const currentDirectory = useMemo(
    () => MOCK_DIRECTORIES.find((d) => d.id === selectedDirId) || MOCK_DIRECTORIES[0],
    [selectedDirId]
  );
  const remainingQuota = currentDirectory.maxLimit - currentDirectory.currentCount;
  const isOverQuota = dirMode === 'existing' && totalSelectedCount > remainingQuota;

  // 提交绑定
  const handleSubmit = () => {
    // 校验冲突项是否已全部裁决
    const unresolvedConflicts = conflicts.filter((c) => !c.selectedOption);
    if (unresolvedConflicts.length > 0) {
      // 高亮报错
      const errors: Record<string, boolean> = {};
      unresolvedConflicts.forEach((c) => {
        errors[c.id] = true;
      });
      setConflictErrors(errors);
      setActiveTab('conflicts');
      message.error('检测到存在未裁决的实体冲突项，请先指定目标账号');
      return;
    }

    if (dirMode === 'new' && !newDirName.trim()) {
      message.error('请输入新建目录名称');
      return;
    }

    if (isOverQuota) {
      message.error(`已选账号数 (${totalSelectedCount}) 超过目录剩余容量 (${remainingQuota})`);
      return;
    }

    const targetDirName =
      dirMode === 'existing' ? currentDirectory.name : newDirName.trim();

    // 成功反馈
    message.success(`成功将 ${totalSelectedCount} 个账号加入目录【${targetDirName}】`);
    if (autoCrawlChecked) {
      message.info(`已下发 5 个未匹配链接的后台异步补采任务`);
    }

    onClose();
    if (onConfirmSuccess) {
      onConfirmSuccess({
        matchedCount: totalSelectedCount,
        dirName: targetDirName,
        autoCrawlCount: autoCrawlChecked ? 5 : 0,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-[1080px] max-w-[95vw] max-h-[92vh] bg-white rounded-xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-800">
                批量导入与添加信源
              </h3>
              <p className="text-xs text-slate-500">
                支持 Excel/CSV 单列主页链接批量导入，结合底层数据库秒级实体消歧与建库
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal 主体 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ============ 阶段 1：文件上传 (Upload State) ============ */}
          {stage === 'upload' && (
            <div className="space-y-5">
              <div
                onClick={handleStartUploadMock}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group text-center"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 mb-3 transition-transform group-hover:scale-105">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">
                  点击或拖拽 Excel 文件至此（.xlsx / .xls / .csv）
                </h4>
                <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-4">
                  单次上限 500 行，仅支持用户主页 URL 单列导入，系统将自动清洗参数并过滤无效顶级域名
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-blue-600 font-medium shadow-2xs group-hover:border-blue-300">
                  <span>🚀 点击直接模拟载入 Mock Data (35条链接)</span>
                </div>
              </div>

              {/* 模板与规则提示 */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">导入规范：</span>
                  <span>首行仅包含表头「用户主页链接」，支持微博、抖音、快手、小红书等主流站点</span>
                </div>
                <a
                  href="#download-template"
                  onClick={(e) => {
                    e.preventDefault();
                    message.success('已下载标准 Excel 导入模板 (source_import_template.xlsx)');
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>📄 下载标准 Excel 模板</span>
                </a>
              </div>
            </div>
          )}

          {/* ============ 阶段 2：解析加载动效 (Parsing State) ============ */}
          {stage === 'parsing' && (
            <div className="py-14 px-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 animate-spin">
                <Loader2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 text-base">
                  正在解析并匹配信源实体...
                </h4>
                <p className="text-xs text-slate-500 font-mono">{parseStatusText}</p>
              </div>
              <div className="w-80">
                <Progress percent={parseProgress} strokeColor="#2563eb" showInfo={false} />
              </div>
            </div>
          )}

          {/* ============ 阶段 3：匹配结果分流呈现 (Results State) ============ */}
          {stage === 'results' && (
            <div className="space-y-4">
              {/* 顶部三分类 Tab */}
              <div className="flex items-center border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('matched')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'matched'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>精准匹配 ({matchedList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('conflicts')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer relative ${
                    activeTab === 'conflicts'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>多实体冲突 ({conflicts.length})</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                </button>

                <button
                  onClick={() => setActiveTab('unhit')}
                  className={`px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'unhit'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>未匹配链接 ({MOCK_UNHIT_LINKS.length})</span>
                </button>
              </div>

              {/* Tab 1：精准匹配 (1:1) */}
              {activeTab === 'matched' && (
                <div className="space-y-3">
                  {/* 表头全选与统计 */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      >
                        <span className="font-medium text-slate-700">全选本页</span>
                      </Checkbox>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600">
                        已选择 <span className="text-blue-600 font-semibold">{matchedSelectedCount}</span> / {matchedList.length} 个账号
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      匹配规则：URL 唯一对应数据库已收录账号
                    </span>
                  </div>

                  {/* 账号列表容器 */}
                  <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                    {matchedList.map((account) => (
                      <div
                        key={account.id}
                        onClick={() => handleToggleSelectOne(account.id, !account.selected)}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                          account.selected
                            ? 'bg-blue-50/30 border-blue-200 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={account.selected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleSelectOne(account.id, e.target.checked);
                            }}
                          />
                          {/* 头像 */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-2xs"
                            style={{ backgroundColor: account.avatarColor }}
                          >
                            {account.avatar ? (
                              <img
                                src={account.avatar}
                                alt={account.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              account.avatarLetter
                            )}
                          </div>
                          {/* 详细信息 */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">
                                {account.name}
                              </span>
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                {account.verifyType}
                              </span>
                              <span
                                className="text-[11px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap"
                                style={{
                                  backgroundColor: `${account.platformColor}15`,
                                  color: account.platformColor,
                                }}
                              >
                                {account.platformName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                              <span className="whitespace-nowrap">UID: {account.uid}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400 truncate max-w-[480px]">
                                {account.originUrl}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 右侧粉丝数 */}
                        <div className="text-right shrink-0">
                          <div className="text-xs text-slate-400">总粉丝数</div>
                          <div className="text-sm font-bold text-blue-600">
                            {account.followersDisplay}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2：多实体冲突 (1:N) */}
              {activeTab === 'conflicts' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">冲突手动裁决：</span>
                        <span>
                          系统已为以下 {conflicts.length} 个冲突链接默认预选推荐实体（已计入底部已选）；选择实体“+1”，选择暂不关注“-1”：
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-medium">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 text-[11px]">
                        已选定加入：{conflictSelectedCount} 个
                      </span>
                      {conflictSkippedCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300 text-[11px]">
                          已跳过：{conflictSkippedCount} 条
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[370px] overflow-y-auto pr-1">
                    {conflicts.map((conflict, idx) => {
                      const hasError = conflictErrors[conflict.id];
                      return (
                        <div
                          key={conflict.id}
                          className={`p-4 rounded-xl border bg-white transition-all ${
                            hasError
                              ? 'border-red-500 bg-red-50/20 shadow-sm animate-pulse'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* 冲突头部 URL */}
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-white">
                                冲突 #{idx + 1}
                              </span>
                              <code className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 truncate max-w-[420px]">
                                {conflict.originUrl}
                              </code>
                            </div>
                            <span className="text-xs text-slate-500">{conflict.reason}</span>
                          </div>

                          {/* 左右并排候选实体卡片 (Side-by-side Layout) */}
                          <div
                            className={`grid grid-cols-2 gap-3 mb-3 transition-opacity ${
                              conflict.selectedOption === 'skip' ? 'opacity-60' : 'opacity-100'
                            }`}
                          >
                            {conflict.candidates.map((cand, cIdx) => {
                              const optionKey = cIdx === 0 ? 'candidate_0' : 'candidate_1';
                              const isChecked = conflict.selectedOption === optionKey;
                              return (
                                <div
                                  key={cand.id}
                                  onClick={() => handleSelectConflict(conflict.id, optionKey)}
                                  className={`p-3 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                    isChecked
                                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                                          style={{ backgroundColor: cand.avatarColor }}
                                        >
                                          {cand.avatar ? (
                                            <img
                                              src={cand.avatar}
                                              alt={cand.name}
                                              className="w-full h-full rounded-full object-cover"
                                            />
                                          ) : (
                                            cand.avatarLetter
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-semibold text-slate-800 text-xs">
                                            {cand.name}
                                          </div>
                                          <div className="text-[11px] text-slate-500 font-mono">
                                            {cand.platformName} · 入库 {cand.indexedAt}
                                          </div>
                                        </div>
                                      </div>
                                      <Radio checked={isChecked} />
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                      {cand.description}
                                    </p>
                                  </div>

                                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-400">总粉丝数</span>
                                    <span className="font-bold text-blue-600">
                                      {cand.followersDisplay}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* 选项 C: 放弃/跳过 */}
                          <div className="flex items-center justify-between pt-1">
                            <label
                              onClick={() => handleSelectConflict(conflict.id, 'skip')}
                              className={`inline-flex items-center gap-2 text-xs cursor-pointer transition-colors ${
                                conflict.selectedOption === 'skip'
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              <Radio checked={conflict.selectedOption === 'skip'} />
                              <span>暂不关注此链接 (跳过此条)</span>
                            </label>
                            {conflict.selectedOption === 'skip' && (
                              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                已从本次导入清单中排除 (-1)
                              </span>
                            )}
                            {hasError && (
                              <span className="text-xs text-red-600 font-medium">
                                ⚠️ 请为此冲突项指定唯一目标账号
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3：未命中链接 (5) */}
              {activeTab === 'unhit' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-600">
                      以下 5 个主页链接在系统库表中暂无采集建档记录：
                    </span>
                    <button
                      onClick={handleCopyUnhitUrls}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>一键复制全部未命中链接</span>
                    </button>
                  </div>

                  {/* 只读多行文本框 */}
                  <div className="relative">
                    <textarea
                      readOnly
                      rows={5}
                      value={MOCK_UNHIT_LINKS.map((item) => item.url).join('\n')}
                      className="w-full p-3 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none"
                    />
                  </div>

                  {/* 异步补采勾选与说明 */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <Checkbox
                        checked={autoCrawlChecked}
                        onChange={(e) => setAutoCrawlChecked(e.target.checked)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-semibold text-xs text-slate-800">
                          提交后台自动采集并在入库完成后自动加入选定目录
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          后台将为上述 5 条链接下发爬虫建档任务。采集完成后，账号将自动绑定至本次选择的目录，并在您下次登录时弹窗通知。
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal 底部 (目录挂载与提交) */}
        {stage === 'results' && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between gap-4 shrink-0">
            {/* 左侧：目录选择器 */}
            <div className="flex items-center gap-4 text-xs shrink-0 flex-nowrap">
              <span className="font-semibold text-slate-700 whitespace-nowrap shrink-0">挂载目录：</span>

              {/* 单选 A：加入现有重点源目录 */}
              <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                <Radio
                  checked={dirMode === 'existing'}
                  onChange={() => setDirMode('existing')}
                >
                  <span className="text-slate-700 font-medium whitespace-nowrap">加入现有目录</span>
                </Radio>
                {dirMode === 'existing' && (
                  <Select
                    size="small"
                    value={selectedDirId}
                    onChange={setSelectedDirId}
                    className="w-60 shrink-0"
                    options={MOCK_DIRECTORIES.map((d) => ({
                      value: d.id,
                      label: `${d.name} (余量: ${d.maxLimit - d.currentCount}/${d.maxLimit})`,
                    }))}
                  />
                )}
              </div>

              {/* 单选 B：新建目录 */}
              <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                <Radio
                  checked={dirMode === 'new'}
                  onChange={() => setDirMode('new')}
                >
                  <span className="text-slate-700 font-medium whitespace-nowrap">新建目录</span>
                </Radio>
                {dirMode === 'new' && (
                  <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                    <Input
                      size="small"
                      placeholder="输入新目录名称"
                      maxLength={20}
                      value={newDirName}
                      onChange={(e) => setNewDirName(e.target.value)}
                      className="w-40 shrink-0"
                    />
                    <Select
                      size="small"
                      value={newDirVisibility}
                      onChange={setNewDirVisibility}
                      className="w-28 shrink-0"
                      options={[
                        { value: 'public', label: '所有人可见' },
                        { value: 'private', label: '仅个人可见' },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：提交行动按钮 */}
            <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                取消
              </button>

              <button
                onClick={handleSubmit}
                disabled={isOverQuota}
                className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isOverQuota
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                <FolderCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {autoCrawlChecked
                    ? `确认导入 (已选 ${totalSelectedCount} 个) 并提交补采 (5 个)`
                    : `确认导入目录 (已选 ${totalSelectedCount} 个)`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
