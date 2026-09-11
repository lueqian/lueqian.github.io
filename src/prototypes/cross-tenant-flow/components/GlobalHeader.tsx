import React from 'react';
import { Select, Badge, Tooltip } from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  SkinOutlined,
  LogoutOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { PostType } from '../types';

export const GlobalHeader: React.FC = () => {
  const { activeNav, currentPost, switchPost } = useAppStore();

  const getBreadcrumb = () => {
    switch (activeNav) {
      case 'monitor_warning':
        return ['监测预警', '舆情列表'];
      case 'manual_report':
        return ['监测预警', '手工上报'];
      case 'emergency_response':
        return ['应急处置', '任务列表'];
      case 'source_control':
        return ['源头防控', '风险总揽'];
      case 'situation_awareness':
        return ['态势感知', '实战大盘'];
      default:
        return ['监测预警', '舆情列表'];
    }
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="w-full h-[52px] bg-white border-b border-[#e5e7eb] px-5 flex items-center justify-between select-none z-30 sticky top-0 shadow-2xs">
      {/* 左侧：当前模块面包屑路径与网络环境 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="text-slate-400 font-medium">{breadcrumbs[0]}</span>
          <RightOutlined className="text-[10px] text-slate-300" />
          <span className="text-slate-800 font-semibold">{breadcrumbs[1]}</span>
        </div>

        {/* 网络环境标识 */}
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            currentPost === 'province_post' || currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              currentPost === 'province_post' || currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post'
                ? 'bg-emerald-500'
                : 'bg-blue-500'
            }`}
          />
          {currentPost === 'province_post'
            ? '公安内网端'
            : currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post'
            ? '公安内网端 (省厅统建主系统)'
            : '互联网端'}
        </span>
      </div>

      {/* 中右侧：搜索区与政务人员控制区 */}
      <div className="flex items-center gap-6">
        {/* 原胶囊搜索框 */}
        <div className="hidden md:flex items-center bg-[#f5f7fa] border border-[#d9d9d9] hover:border-blue-400 rounded-full pl-3 pr-1 py-0.5 transition-all w-72">
          <Select
            defaultValue="all"
            variant="borderless"
            size="small"
            className="text-xs text-slate-600 w-20"
            options={[
              { value: 'all', label: '全网' },
              { value: 'douyin', label: '抖音' },
              { value: 'weibo', label: '微博' },
              { value: 'toutiao', label: '头条' }
            ]}
          />
          <div className="w-px h-3.5 bg-slate-300 mx-1" />
          <input
            type="text"
            placeholder="请输入关键词搜索"
            className="bg-transparent border-0 text-xs text-slate-700 outline-hidden flex-1 px-1"
          />
          <button className="w-6 h-6 bg-transparent hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
            <SearchOutlined className="text-xs" />
          </button>
        </div>

        {/* 用户与岗位 */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="text-slate-700 font-medium">
            欢迎 {currentPost === 'municipal_post' ? '李警官' : currentPost === 'province_post' ? '陈总指挥' : (currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post') ? '王警官' : '张警官'}！
          </span>

          <span className="text-blue-600 hover:underline cursor-pointer">修改密码</span>

          <span className="text-blue-600 hover:underline cursor-pointer">值班表</span>

          {/* 角色模拟切换下拉框 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 whitespace-nowrap">岗位切换:</span>
            <Select
              value={
                currentPost === 'district_guichi_post'
                  ? 'district_gusu_post'
                  : currentPost === 'district_susong_post'
                  ? 'district_shuyang_post'
                  : currentPost
              }
              onChange={(val) => switchPost(val as PostType)}
              size="small"
              className="w-64 text-xs"
              options={[
                { value: 'municipal_post', label: '市局网安支队 - 审核岗 (内网协同视角)' },
                { value: 'province_post', label: '省厅网安总队 - 指挥岗 (公安内网版)' },
                { value: 'district_gusu_post', label: '姑苏分局网安大队 - 经办岗 (互联网独立版)' },
                { value: 'district_shuyang_post', label: '沭阳县局网安大队 - 经办岗 (公安内网未采购版)' }
              ]}
            />
          </div>

          <div className="flex items-center gap-3 text-slate-500 pl-1 border-l border-slate-200">
            <Tooltip title="换肤">
              <SkinOutlined className="text-sm cursor-pointer hover:text-blue-600" />
            </Tooltip>

            <Tooltip title="消息通知">
              <Badge dot color="#1677ff">
                <BellOutlined className="text-sm cursor-pointer hover:text-blue-600" />
              </Badge>
            </Tooltip>

            <Tooltip title="退出系统">
              <LogoutOutlined className="text-sm cursor-pointer hover:text-rose-600" />
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};
