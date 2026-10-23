import React, { useState } from 'react';
import { ScenarioId } from '../types';
import {
  X,
  Copy,
  Check,
  Code2,
  FileText,
  Server,
  Database,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { message } from 'antd';

interface DevNotesDrawerProps {
  open: boolean;
  onClose: () => void;
  currentScenario: ScenarioId;
}

const SCENARIO_DEV_SPECS: Record<
  ScenarioId,
  {
    title: string;
    focus: string;
    frontendRule: string[];
    backendRule: string[];
  }
> = {
  scenario_1: {
    title: '场景 1：入口触发与文件上传',
    focus: '文件客户端格式预检、行数上限阻断（<=500行）、纯顶级域名拦截过滤。',
    frontendRule: [
      '文件格式仅允许 .xlsx, .xls, .csv，前端根据 MIME/扩展名校验；',
      '使用 SheetJS / PapaParse 在浏览器端快速读取第一列（用户主页链接）；',
      '若数据行数 > 500 行，直接弹出 Toast 拦截：“单次上传不可超过 500 条链接”，不发起请求；',
      '正则清洗剥离 URL 中带有 `?utm_source=...`、`&share_token=...` 等无用参数；',
      '检测纯顶级域名（如 `https://weibo.com`、`https://www.douyin.com`），拦截并打上 `invalid_domain` 标记。',
    ],
    backendRule: [
      '接口端点：`POST /api/v1/source/upload-and-parse`',
      '支持接收客户端清洗后的 URL 数组，点查 Redis/Elasticsearch 倒排索引；',
      '返回结构分为 `matched`、`conflicts`、`unhit`、`invalid` 4个桶。',
    ],
  },
  scenario_2: {
    title: '场景 2：理想链路 - 精准匹配与批量建库 (1:1)',
    focus: '批量选中账号、目录挂载（已有目录/新建目录）、配额容量实时校验与持久化。',
    frontendRule: [
      '列表展示 28 条 1:1 唯一命中账号，默认全选；',
      '表头 Checkbox 状态联动（全选/反选/部分选中）；',
      '目录选择器联动：选择“加入现有目录”展示余量（如 `涉华博主 余量: 342/500`）；',
      '若已选账号数 > 当前目录剩余配额，提交按钮置灰禁用并给出超额高亮；',
      '选择“新建目录”支持设置可见性（所有人/仅个人可见），目录名称限制 <= 20 字符。',
    ],
    backendRule: [
      '接口端点：`POST /api/v1/source/batch-import-and-bind`',
      '事务性批量写入关联表 `rel_source_directory_account`；',
      '更新目录统计计数器 `current_count = current_count + :n`。',
    ],
  },
  scenario_3: {
    title: '场景 3：异常消歧 - 多实体冲突手动裁决 (1:N)',
    focus: '多历史版本/多平台映射实体的左右并排卡片单选裁决、默认预选首位实体及计数联动增减。',
    frontendRule: [
      '2 个 URL 命中 2 个及以上实体，解析后默认选中推荐首选实体（候选 A），并计入已选总数；',
      '左右并排展示候选 A 与候选 B 详细卡片，支持 Radio Button 互斥单选（候选A / 候选B / 暂不关注此链接）；',
      '计数实时联动：选择具体账号时已选数 +1，选择“暂不关注此链接 (跳过)”时已选数 -1；',
      '底部提交按钮已选总数动态累加“精准匹配已选数 + 冲突有效实体选定数”，并实时校验配额上限。',
    ],
    backendRule: [
      'Payload 中 `resolved_conflicts` 字段传递 `[{ origin_url, chosen_uid }]`；',
      '若选跳过，后端在本次绑定中忽略该 URL，并将映射历史标记为用户主动消歧跳过。',
    ],
  },
  scenario_4: {
    title: '场景 4：兜底链路 - 未命中提取与异步补采',
    focus: '5个未命中URL只读紧凑展示、一键剪贴板复制、自动补采任务下发与异步目录挂载。',
    frontendRule: [
      '灰底只读 TextArea 紧凑展示 5 个未命中 URL，右上角【一键复制全部未命中链接】；',
      '默认勾选 `[√] 提交后台自动采集并在入库完成后自动加入选定目录`；',
      '底部提交按钮文字响应式动态联动总已选数，显示为 `【确认导入 (已选 30 个) 并提交补采 (5 个)】`（随冲突选择动态增减）。',
    ],
    backendRule: [
      '后端生成补采爬虫任务 Payload: `{ task_id, url, target_directory_id, created_by_uid }`；',
      '任务注入幂等性键，多用户提交相同 URL 时合并爬取，但保留多个目标目录挂载绑定。',
    ],
  },
  scenario_5: {
    title: '场景 5：闭环通知 - 采集完成后下次登录提醒',
    focus: '异步爬虫入库回调、用户会话消费型通知位、一键跳转穿透目标目录。',
    frontendRule: [
      '居中弹出 520px 通知弹窗，列出 4 个采集成功入库账号胶囊与 1 个注销失败提示；',
      '点击【进入该重点源目录查看】：关闭弹窗，自动切换到重点源目录并高亮定位；',
      '点击【我知道了】：关闭弹窗并向后端上报已读状态。',
    ],
    backendRule: [
      '爬虫服务通过 Webhook 回调入库服务，将爬取成功账号写入对应 `target_directory_id`；',
      '更新用户通知队列 `user_unread_notices`，登录时下发并在确认后标记已消费。',
    ],
  },
};

const DEV_API_PAYLOAD = {
  api_endpoint: 'POST /api/v1/source/batch-import-and-bind',
  payload_spec: {
    directory_mode: 'bind_existing | create_new',
    directory_id: 'dir_102938 (当 bind_existing 时有效)',
    new_directory_name: 'string (当 create_new 时有效)',
    selected_matched_uids: ['uid_1001', 'uid_1002', '...'],
    resolved_conflicts: [
      { origin_url: 'https://v.douyin.com/iJXXXXX/', chosen_uid: 'uid_200845' }
    ],
    auto_crawl_urls: [
      'https://www.douyin.com/user/MS4wLjABAAAA_newcreator991',
      'https://weibo.com/u/7892104921'
    ],
    notify_on_crawled: true
  },
  business_rules: [
    '1. 单次导入行数严格在前端限制 <= 500 行，超过直接 Toast 拦截；',
    '2. 针对纯顶级域名（如 https://weibo.com）在本地正则匹配拦截，归入无效 URL 类别；',
    '3. 提交后台自动采集需注入任务幂等性键，多用户提交同 URL 时底层仅发一次爬取任务，但多方目录绑定映射均需持久化；',
    '4. 下次登录通知采用消费型状态位，用户点击【我知道了】或【进入目录】后向接口标记 read 状态。'
  ]
};

export const DevNotesDrawer: React.FC<DevNotesDrawerProps> = ({
  open,
  onClose,
  currentScenario,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'api' | 'rules'>('current');
  const [copied, setCopied] = useState(false);

  const currentSpec = SCENARIO_DEV_SPECS[currentScenario];

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(DEV_API_PAYLOAD, null, 2));
    setCopied(true);
    message.success('已复制 API 规范与 Payload 至剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[460px] max-w-[90vw] bg-slate-900/95 backdrop-blur-md text-slate-100 border-l border-slate-700/80 shadow-2xl z-50 flex flex-col transition-all animate-in slide-in-from-right duration-200">
      {/* 抽屉头部 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-sm text-white">
            研发交互与逻辑标注 (Dev Notes)
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 顶部 Tab 切换 */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 bg-slate-900/40 text-xs">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-3 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'current'
              ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>当前场景逻辑</span>
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-3 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'api'
              ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>接口契约 (API)</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 font-medium rounded-t-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>业务与边界规则</span>
        </button>
      </div>

      {/* 抽屉主体内容 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans">
        {activeTab === 'current' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="font-semibold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                <span>{currentSpec.title}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {currentSpec.focus}
              </p>
            </div>

            {/* 前端交互要点 */}
            <div>
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                前端界面与校验逻辑 (Frontend Specs)
              </h4>
              <ul className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-slate-300">
                {currentSpec.frontendRule.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-blue-400 font-mono text-[10px] mt-0.5 shrink-0">
                      [{idx + 1}]
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 后端接口与持久化 */}
            <div>
              <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                后端契约与异步队列 (Backend & Queue Specs)
              </h4>
              <ul className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-slate-300">
                {currentSpec.backendRule.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-mono text-[10px] mt-0.5 shrink-0">
                      [{idx + 1}]
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-400">
                POST /api/v1/source/batch-import-and-bind
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
                <span>{copied ? '已复制' : '复制 JSON'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
              {JSON.stringify(DEV_API_PAYLOAD, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              全局四大业务硬性规则 (Mandatory Constraints)
            </h4>
            <div className="space-y-2">
              {DEV_API_PAYLOAD.business_rules.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-md bg-slate-950/80 border border-slate-800/80 text-slate-300 leading-relaxed text-xs"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-md bg-blue-950/30 border border-blue-900/50 text-blue-200 text-xs mt-3">
              <span className="font-semibold">💡 架构建议：</span>
              由于社交平台主页反爬对抗加剧，建议对补采队列设置 3 次自动重试及智能代理轮换机制，确保 2 小时内完成首批元数据建档。
            </div>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>当前查看：{currentSpec.title.split('：')[1]}</span>
        <span className="text-slate-500 font-mono">v1.0-RFC</span>
      </div>
    </div>
  );
};
