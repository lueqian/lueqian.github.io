import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, X, Sparkles } from 'lucide-react';
import { MOCK_CRAWLED_SUCCESS_ACCOUNTS } from '../mock-data';

interface NextLoginNoticeModalProps {
  open: boolean;
  onClose: () => void;
  onNavigateToDirectory: (dirName: string) => void;
}

export const NextLoginNoticeModal: React.FC<NextLoginNoticeModalProps> = ({
  open,
  onClose,
  onNavigateToDirectory,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-[520px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* 顶部彩色装饰区 */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-teal-500/10 p-6 border-b border-slate-100 flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-white shadow-md flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                后台异步采集入库通知
              </span>
              <span className="text-[11px] text-slate-400">2026-10-22 10:15</span>
            </div>
            <h3 className="font-bold text-base text-slate-900">
              信源自动补采完成通知
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              您于 <span className="font-semibold text-slate-800">2026-10-20</span> 提交的 <span className="font-semibold text-blue-600">5</span> 个补采链接中，已有 <span className="font-semibold text-emerald-600">4</span> 个账号成功建档入库，并已自动挂载至重点源目录：
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 挂载目录提示 */}
        <div className="px-6 pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 mb-3">
            <span>挂载目录：【涉华博主】</span>
            <span className="text-[11px] font-normal text-blue-600">
              (当前账号总数已增至 162/500)
            </span>
          </div>

          {/* 成功账号胶囊列表 */}
          <div className="space-y-2 mb-3">
            {MOCK_CRAWLED_SUCCESS_ACCOUNTS.map((acc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: acc.avatarColor }}
                  >
                    {acc.avatarLetter}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-800">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                      {acc.originUrl}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: `${acc.platformColor}15`,
                      color: acc.platformColor,
                    }}
                  >
                    {acc.platform}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {acc.followers}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 失败/注销提示 */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              1 个链接因目标主页已注销未能抓取 (<code>https://weibo.com/u/6519204910</code>)
            </span>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="p-6 pt-3 flex items-center justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            我知道了
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigateToDirectory('涉华博主');
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>进入该重点源目录查看</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
