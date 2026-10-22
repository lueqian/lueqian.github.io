import React, { useState } from 'react';
import {
  Search,
  Upload,
  ExternalLink,
  ChevronDown,
  Info,
  MapPin,
  Check,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { Checkbox, Radio, Select, message, Tooltip, Pagination } from 'antd';

interface SourceSearchPageProps {
  onOpenBatchImport: () => void;
  onNavigateToManage?: (dirName?: string) => void;
  highlightDirectory?: string | null;
}

// 模拟信源搜索结果数据（完全精准复刻截图2）
const SEARCH_RESULT_ACCOUNTS = [
  {
    id: 1,
    rank: 1,
    name: '张三疯',
    hasMatrixBadge: true,
    tag: '无',
    platform: '快手app',
    platformId: 'Zhangsf888',
    platformColor: '#ff5000',
    platformIconText: '快',
    location: '贵州省毕节市',
    bio: '商:zhangsf818',
    followers: '1105 W',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
  },
  {
    id: 2,
    rank: 2,
    name: '张三发',
    hasMatrixBadge: false,
    tag: '',
    platform: '抖音app',
    platformId: 'zhangsf888',
    platformColor: '#161823',
    platformIconText: '抖',
    location: '',
    bio: '每天都要开心奥😊 欢迎投稿合V: zhangsf818 (备注品牌)',
    followers: '987 W',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop&crop=face',
  },
  {
    id: 3,
    rank: 3,
    name: '张三嫂·体重管理',
    hasMatrixBadge: false,
    tag: '',
    platform: '快手app',
    platformId: 'ZSS88XLM',
    platformColor: '#ff5000',
    platformIconText: '快',
    location: '',
    bio: '减肥冲剂收到货 把使用手册从头到尾仔细看一下 哪里不懂发私信 喝汤产品方法 听话照做就可以啦',
    followers: '506 W',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
  },
  {
    id: 4,
    rank: 4,
    name: '张三嫂·体重管理',
    hasMatrixBadge: false,
    tag: '',
    platform: '抖音app',
    platformId: 'zhangsange8008',
    platformColor: '#161823',
    platformIconText: '抖',
    location: '',
    bio: '减肥收到货 把使用手册从头到尾仔细看一下 哪里不懂发私信 喝汤产品方法 商务对接：Zhangsansaoshangwu 或 zhangsange8008',
    followers: '370 W',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face',
  },
];

export const SourceSearchPage: React.FC<SourceSearchPageProps> = ({
  onOpenBatchImport,
  onNavigateToManage,
  highlightDirectory,
}) => {
  // 视图模式: 'initial' (截图1初始页) | 'results' (截图2结果页)
  const [viewMode, setViewMode] = useState<'initial' | 'results'>('initial');
  const [keyword, setKeyword] = useState<string>('张三');

  // 截图1中的多维筛选选中状态
  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedVerify, setSelectedVerify] = useState<string>('all');
  const [selectedFans, setSelectedFans] = useState<string>('all');

  // 截图2中的状态
  const [searchMode, setSearchMode] = useState<string>('username');
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([1]); // 默认勾选张三疯演示
  const [selectedSort, setSelectedSort] = useState<'fans' | 'media'>('fans');

  // 右侧已添加信源抽屉状态
  const [rightDirMode, setRightDirMode] = useState<'existing' | 'new'>('new');
  const [rightNewDirName, setRightNewDirName] = useState<string>('涉华核心监控');
  const [rightVisibility, setRightVisibility] = useState<'public' | 'dept' | 'private'>('public');

  const handleSearchTrigger = () => {
    setViewMode('results');
  };

  const handleToggleSelectAccount = (id: number) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllResults = () => {
    if (selectedAccountIds.length === SEARCH_RESULT_ACCOUNTS.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(SEARCH_RESULT_ACCOUNTS.map((a) => a.id));
    }
  };

  const handleSubmitRightPanel = () => {
    if (selectedAccountIds.length === 0) {
      message.warning('请在左侧勾选需要添加的账号');
      return;
    }
    const dirTitle = rightDirMode === 'existing' ? '涉华博主' : rightNewDirName || '新目录';
    message.success(`已将 ${selectedAccountIds.length} 个账号提交至重点源目录【${dirTitle}】`);
  };

  return (
    <div className="w-full min-h-full bg-slate-50 flex flex-col">
      {/* 视图模式切换快捷栏 (帮助走查) */}
      <div className="px-6 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">界面状态走查切换：</span>
          <button
            onClick={() => setViewMode('initial')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'initial'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            截图 1：信源搜索初始页 (Hero大搜索 + 多维筛选卡片)
          </button>
          <button
            onClick={() => setViewMode('results')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'results'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            截图 2：搜索结果展示页 (卡片流 + 右侧已添加信源建库栏)
          </button>
        </div>

        {highlightDirectory && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-semibold animate-pulse">
            <span>已成功挂载目录：【{highlightDirectory}】</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 视图 1：信源搜索初始页 (完全精准复刻截图 1) */}
      {/* ============================================================== */}
      {viewMode === 'initial' && (
        <div className="flex-1 flex flex-col items-center justify-start pt-10 pb-16 px-4 bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-100 relative overflow-hidden">
          {/* 背景科技水纹浅波（复刻截图 1 底纹） */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/40 via-transparent to-transparent" />

          {/* 居中大标题 */}
          <div className="text-center mb-6 relative z-10">
            <h1 className="text-3xl font-bold text-blue-600 tracking-wide">
              信源搜索
            </h1>
          </div>

          {/* 居中主搜索条 + 【批量导入检索】线框按钮 */}
          <div className="w-full max-w-2xl flex items-center gap-3 mb-8 relative z-10">
            <div className="flex-1 flex items-center bg-white rounded-lg border border-blue-400 hover:border-blue-500 shadow-sm px-3 py-2 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="输入账号关键词搜索全网信源"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
                className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder-slate-400"
              />
              <span className="text-xs text-slate-400 font-mono ml-2 shrink-0">
                {keyword.length}/500
              </span>
            </div>

            {/* 蓝色搜索按钮 */}
            <button
              onClick={handleSearchTrigger}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
            >
              搜索
            </button>

            {/* PRD 核心入口：【批量导入检索】幽灵线框按钮 */}
            <button
              onClick={onOpenBatchImport}
              className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-500 rounded-lg text-sm font-medium shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              title="基于 Excel/CSV 批量导入主页链接并快速建库"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>批量导入检索</span>
            </button>
          </div>

          {/* 悬浮多维筛选大卡片 (纯白圆角轻投影) */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 relative z-10 space-y-4">
            {/* 子分类 Tab */}
            <div className="flex justify-center border-b border-slate-100 pb-3 mb-2">
              <div className="inline-flex gap-8 text-sm font-medium">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-2 cursor-pointer font-semibold">
                  社交账号及网站作者
                </span>
                <span className="text-slate-500 hover:text-slate-800 pb-2 cursor-pointer">
                  站点
                </span>
              </div>
            </div>

            {/* 所属站点 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">所属站点：</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['全选', '微博', '抖音', '头条号', '小红书', '快手', '微信视频号', '微信公众号', 'Twitter', 'Youtube', 'Facebook'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedSite(tag)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      (selectedSite === 'all' && i === 0) || selectedSite === tag
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 组织类型 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">组织类型：</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['全选', '企业', '机构', '政府', '军事', '媒体', '校园', '医院', '公益', '个人'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedOrg(tag)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      (selectedOrg === 'all' && i === 0) || selectedOrg === tag
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 媒体类型 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">媒体类型：</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['全选', '党媒', '中央媒体', '军事媒体', '政府媒体', '地方媒体', '普通媒体', '自媒体'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedMedia(tag)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      (selectedMedia === 'all' && i === 0) || selectedMedia === tag
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 归属地 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">归属地：</span>
              <div className="flex-1 space-y-2">
                {/* 境内 */}
                <div className="flex items-start gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0 mt-0.5">
                    境内
                  </span>
                  <div className="flex flex-wrap gap-1 flex-1">
                    {['全部', '北京市', '上海市', '天津市', '重庆市', '云南省', '内蒙古自治区', '吉林省', '四川省', '宁夏回族自治区', '安徽省', '山东省', '山西省', '广东省', '广西壮族自治区', '新疆维吾尔自治区', '江苏省', '江西省', '河北省', '河南省', '浙江省', '海南省', '湖北省', '湖南省', '甘肃省', '福建省', '西藏自治区', '贵州省', '辽宁省', '陕西省', '青海省', '黑龙江省', '其他', '重新选择'].slice(0, 15).map((prov, i) => (
                      <span
                        key={prov}
                        onClick={() => setSelectedProvince(prov)}
                        className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                          i === 0 ? 'bg-blue-50 text-blue-600 border border-blue-200 font-medium' : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {prov}
                      </span>
                    ))}
                    <span className="text-blue-600 cursor-pointer text-xs font-medium">更多...</span>
                  </div>
                </div>

                {/* 境外 */}
                <div className="flex items-start gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0 mt-0.5">
                    境外
                  </span>
                  <div className="flex flex-wrap gap-1 flex-1">
                    {['全部', '美国', '中国', '俄罗斯', '英国', '法国', '日本', '印度', '韩国', '越南', '德国', '+208 查看全部'].map((country, i) => (
                      <span
                        key={country}
                        className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                          i === 0 ? 'bg-blue-50 text-blue-600 border border-blue-200 font-medium' : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 认证类型 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">认证类型：</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['全选', '认证用户', '普通用户', '其他'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedVerify(tag)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      (selectedVerify === 'all' && i === 0) || selectedVerify === tag
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 粉丝数 */}
            <div className="flex items-start text-xs">
              <span className="w-20 text-slate-500 shrink-0 mt-1">粉丝数：</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {['全选', '>100W', '10W-100W', '1k-10W', '100-1k', '<100', '其他'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedFans(tag)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      (selectedFans === 'all' && i === 0) || selectedFans === tag
                        ? 'bg-blue-50 text-blue-600 border border-blue-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 视图 2：信源搜索 - 搜索结果展示页 (完全精准复刻截图 2) */}
      {/* ============================================================== */}
      {viewMode === 'results' && (
        <div className="flex-1 flex flex-col p-5 bg-white">
          {/* 顶部搜索框 + 5 种搜索方式单选 + 8 项筛选下拉框 */}
          <div className="border-b border-slate-200 pb-4 mb-4 space-y-3">
            {/* 搜索行 */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 shrink-0 font-medium">
                搜索关键词:
              </span>
              <div className="flex-1 max-w-xl flex items-center bg-white border border-slate-300 rounded px-3 py-1.5 focus-within:border-blue-500">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-xs text-slate-800 focus:outline-none"
                />
                <span className="text-xs text-slate-400 font-mono">
                  {keyword.length}/500
                </span>
              </div>
              <button
                onClick={handleSearchTrigger}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs cursor-pointer"
              >
                搜索
              </button>

              {/* 结果页常驻【批量导入检索】按钮 */}
              <button
                onClick={onOpenBatchImport}
                className="px-4 py-1.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-500 rounded text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                title="基于 Excel/CSV 批量导入检索"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>批量导入检索</span>
              </button>
            </div>

            {/* 搜索方式单选 */}
            <div className="flex items-center gap-5 text-xs text-slate-600">
              <span className="text-slate-500">搜索方式:</span>
              <Radio.Group
                value={searchMode}
                onChange={(e) => setSearchMode(e.target.value)}
                className="text-xs space-x-4"
              >
                <Radio value="username">
                  <span className="text-xs">用户名及用户ID</span>
                </Radio>
                <Radio value="url">
                  <span className="text-xs">用户主页URL</span>
                </Radio>
                <Radio value="bio">
                  <span className="text-xs inline-flex items-center gap-1">
                    用户简介 <Info className="w-3 h-3 text-slate-400" />
                  </span>
                </Radio>
                <Radio value="verify_reason">
                  <span className="text-xs inline-flex items-center gap-1">
                    认证原因 <Info className="w-3 h-3 text-slate-400" />
                  </span>
                </Radio>
                <Radio value="group">
                  <span className="text-xs inline-flex items-center gap-1">
                    群组 <Info className="w-3 h-3 text-slate-400" />
                  </span>
                </Radio>
              </Radio.Group>
            </div>

            {/* 8 个下拉筛选触发器 */}
            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
              <span className="text-slate-500">筛选:</span>
              {['所属站点', '组织类型', '媒体类型', '归属地', '行业', '职业', '认证类型', '粉丝数'].map((item) => (
                <div
                  key={item}
                  className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{item}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              ))}
            </div>

            {/* 排序方式 */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-slate-500">排序方式:</span>
              <button
                onClick={() => setSelectedSort('fans')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  selectedSort === 'fans'
                    ? 'bg-blue-50 text-blue-600 border border-blue-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                总粉丝数 ▼
              </button>
              <button
                onClick={() => setSelectedSort('media')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  selectedSort === 'media'
                    ? 'bg-blue-50 text-blue-600 border border-blue-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                媒体属性
              </button>
            </div>
          </div>

          {/* 左右分栏布局：左侧账号卡片列表 (75%) + 右侧已添加信源建库栏 (25%) */}
          <div className="flex-1 flex gap-5 items-start">
            {/* 左侧卡片流 (75%) */}
            <div className="flex-1 space-y-3">
              {SEARCH_RESULT_ACCOUNTS.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleToggleSelectAccount(acc.id)}
                    className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                    }`}
                  >
                    {/* 左侧信息 */}
                    <div className="flex items-start gap-3.5">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleSelectAccount(acc.id)}
                        className="mt-1"
                      />

                      {/* 排名 Badge */}
                      <span className="w-5 h-5 rounded-full bg-slate-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {acc.rank}
                      </span>

                      {/* 头像及矩阵号角标 */}
                      <div className="relative shrink-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        {acc.hasMatrixBadge && (
                          <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-semibold rounded-full shadow-xs">
                            矩阵号
                          </span>
                        )}
                      </div>

                      {/* 账号详情 */}
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">
                            {acc.name}
                          </span>
                          {acc.tag && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {acc.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                              style={{ backgroundColor: acc.platformColor }}
                            >
                              {acc.platformIconText}
                            </span>
                            <span>{acc.platform}</span>
                            <span className="font-mono text-blue-600">
                              ID {acc.platformId}
                            </span>
                          </span>

                          {acc.location && (
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{acc.location}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          简介：{acc.bio}
                        </p>
                      </div>
                    </div>

                    {/* 右侧粉丝数与主页链接 */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <a
                        href="#view-profile"
                        onClick={(e) => {
                          e.preventDefault();
                          message.info(`已调起 ${acc.name} 真实社交媒体主页外链`);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        查看主页
                      </a>

                      <div className="text-right mt-1">
                        <div className="flex items-center gap-1 text-slate-400 text-xs justify-end">
                          <Users className="w-3.5 h-3.5" />
                          <span>总粉丝数</span>
                        </div>
                        <div className="text-lg font-bold text-blue-600 leading-tight">
                          {acc.followers}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 底部全选与分页器 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={handleSelectAllResults}
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  一键全选
                </button>

                <div className="flex items-center gap-4 text-slate-500">
                  <span>共 10,000 条</span>
                  <Select
                    size="small"
                    defaultValue="50"
                    options={[
                      { value: '20', label: '20条/页' },
                      { value: '50', label: '50条/页' },
                      { value: '100', label: '100条/页' },
                    ]}
                    className="w-24"
                  />
                  <Pagination size="small" total={10000} pageSize={50} showQuickJumper />
                </div>
              </div>
            </div>

            {/* 右侧常驻栏：“已添加信源”面板 (25%) */}
            <div className="w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between shrink-0 min-h-[460px]">
              <div>
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5 mb-3">
                  已添加信源
                </h4>

                {/* 已选信源展示区 */}
                {selectedAccountIds.length === 0 ? (
                  <div className="py-14 text-center text-xs text-slate-400">
                    请在左侧选中需要添加的 账号/网站
                  </div>
                ) : (
                  <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                    {SEARCH_RESULT_ACCOUNTS.filter((a) =>
                      selectedAccountIds.includes(a.id)
                    ).map((acc) => (
                      <div
                        key={acc.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center shrink-0 font-bold"
                            style={{ backgroundColor: acc.platformColor }}
                          >
                            {acc.platformIconText}
                          </span>
                          <span className="font-medium text-slate-700 truncate">
                            {acc.name}
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px] shrink-0">
                          {acc.followers}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 底部目录挂载控件 */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="text-xs font-semibold text-slate-700">
                  请选择目录：
                </div>

                <div className="space-y-2 text-xs">
                  <Radio
                    checked={rightDirMode === 'existing'}
                    onChange={() => setRightDirMode('existing')}
                  >
                    <span className="text-xs text-slate-700">加入现有重点源目录</span>
                  </Radio>
                  {rightDirMode === 'existing' && (
                    <Select
                      size="small"
                      defaultValue="dir_101"
                      className="w-full text-xs"
                      options={[
                        { value: 'dir_101', label: '涉华博主 (余量: 342/500)' },
                        { value: 'dir_102', label: '行业竞品 (余量: 410/500)' },
                      ]}
                    />
                  )}

                  <Radio
                    checked={rightDirMode === 'new'}
                    onChange={() => setRightDirMode('new')}
                  >
                    <span className="text-xs text-slate-700">新建</span>
                  </Radio>
                  {rightDirMode === 'new' && (
                    <div className="space-y-2 pl-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="请输入目录名称"
                          maxLength={10}
                          value={rightNewDirName}
                          onChange={(e) => setRightNewDirName(e.target.value)}
                          className="w-full text-xs p-1.5 border border-slate-300 rounded focus:outline-none focus:border-blue-500 pr-10"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-mono">
                          {rightNewDirName.length}/10
                        </span>
                      </div>

                      {/* 可见性选项 */}
                      <Radio.Group
                        value={rightVisibility}
                        onChange={(e) => setRightVisibility(e.target.value)}
                        className="text-xs space-y-1 block"
                      >
                        <Radio value="public" className="text-xs block">
                          <span className="text-xs">所有人可见</span>
                        </Radio>
                        <Radio value="dept" className="text-xs block">
                          <span className="text-xs">部门及上级可见</span>
                        </Radio>
                        <Radio value="private" className="text-xs block">
                          <span className="text-xs">个人可见</span>
                        </Radio>
                      </Radio.Group>
                    </div>
                  )}
                </div>

                {/* 提交按钮 */}
                <button
                  onClick={handleSubmitRightPanel}
                  disabled={selectedAccountIds.length === 0}
                  className={`w-full py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedAccountIds.length === 0
                      ? 'bg-blue-200 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  提交 ({selectedAccountIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
