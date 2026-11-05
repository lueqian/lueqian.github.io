import React from 'react';
import { Select, Badge, Tooltip, message } from 'antd';
import {
  RightOutlined,
  SearchOutlined,
  BellOutlined,
  SkinOutlined,
  LogoutOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';
import { PostType } from '../types';

export const GlobalHeader: React.FC = () => {
  const {
    activeNav,
    currentPost,
    switchPost,
    selectedDeptName
  } = useAppStore();

  const handleCopyGreeting = () => {
    navigator.clipboard?.writeText('杨吉');
    message.success('已复制姓名至剪贴板');
  };

  const getBreadcrumb = () => {
    switch (activeNav) {
      case 'dept_management':
        return ['部门管理', `${selectedDeptName || '忠县'} - 用户列表`];
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
        return ['部门管理', '用户列表'];
    }
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="w-full h-[56px] bg-white border-b border-[#f0f0f0] px-5 flex items-center justify-between select-none z-30 sticky top-0 shadow-2xs">
      {/* 1. 左侧：当前模块面包屑路径与网络环境标识 */}
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

      {/* 2. 居中偏右全局搜索与右侧用户信息辅助栏 */}
      <div className="flex items-center gap-5">
        {/* 胶囊圆角搜索框 */}
        <div className="hidden lg:flex items-center bg-[#ffffff] border border-[#d9d9d9] hover:border-blue-400 rounded-full pl-3 pr-1 py-0.5 transition-all w-76 shadow-2xs">
          <Select
            defaultValue="all"
            variant="borderless"
            size="small"
            className="text-xs text-slate-600 w-18"
            options={[
              { value: 'all', label: '全网' },
              { value: 'douyin', label: '抖音' },
              { value: 'weibo', label: '微博' },
              { value: 'toutiao', label: '头条' }
            ]}
          />
          <div className="w-px h-3.5 bg-slate-200 mx-1" />
          <input
            type="text"
            placeholder="请输入关键词搜索"
            className="bg-transparent border-0 text-xs text-slate-700 outline-hidden flex-1 px-1 placeholder:text-slate-400"
          />
          <button
            onClick={() => message.info('正在全网舆情库检索...')}
            className="w-6 h-6 bg-transparent hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <SearchOutlined className="text-xs" />
          </button>
        </div>

        {/* 右侧用户信息与辅助工具 */}
        <div className="flex items-center gap-3.5 text-xs text-slate-600">
          {/* 用户问候 + 蓝色剪贴板图标 */}
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <span>欢迎 杨吉！</span>
            <CopyOutlined
              onClick={handleCopyGreeting}
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-xs ml-0.5"
              title="复制姓名"
            />
          </div>

          <span
            onClick={() => message.info('已开启密码修改面板')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            修改密码
          </span>

          <span className="text-slate-300">|</span>

          <span
            onClick={() => message.info('已调取本周值班安排表')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            值班表
          </span>

          {/* 岗位模拟切换下拉框 */}
          <div className="flex items-center gap-1 text-blue-600 font-medium">
            <span className="whitespace-nowrap">岗位:</span>
            <Select
              defaultValue="cailiao"
              variant="borderless"
              size="small"
              className="text-xs text-blue-600 font-medium !p-0 w-32"
              popupMatchSelectWidth={false}
              options={[
                { value: 'cailiao', label: '材料汇编岗' },
                { value: 'municipal_post', label: '市局网安支队-审核岗' },
                { value: 'province_post', label: '省厅网安总队-指挥岗' },
                { value: 'district_gusu_post', label: '姑苏分局-经办岗' },
                { value: 'district_shuyang_post', label: '沭阳县局-经办岗' }
              ]}
              onChange={(val) => {
                if (val !== 'cailiao') {
                  switchPost(val as PostType);
                } else {
                  message.success('已切换工作岗位：材料汇编岗');
                }
              }}
            />
          </div>

          {/* 快捷图标组 */}
          <div className="flex items-center gap-3 text-slate-500 pl-2 border-l border-slate-200">
            <Tooltip title="换肤">
              <SkinOutlined
                onClick={() => message.info('已切换实战高保真政务蓝白主题')}
                className="text-sm cursor-pointer hover:text-blue-600 transition-colors"
              />
            </Tooltip>

            <Tooltip title="消息通知 (2条新待办)">
              <Badge count={2} size="small" offset={[-2, 2]}>
                <BellOutlined
                  onClick={() => message.info('当前有 2 条重点预警待研判')}
                  className="text-sm cursor-pointer hover:text-blue-600 transition-colors"
                />
              </Badge>
            </Tooltip>

            <Tooltip title="退出系统">
              <LogoutOutlined
                onClick={() => message.warning('已安全退出蓝鹰一体化智控系统')}
                className="text-sm cursor-pointer hover:text-rose-600 transition-colors"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};
