import React from 'react';
import {
  SafetyCertificateOutlined,
  RadarChartOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  CloudFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { useAppStore, MainNavType } from '../store';
import { Tooltip } from 'antd';

interface AppSiderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSider: React.FC<AppSiderProps> = ({ collapsed, onToggleCollapse }) => {
  const { activeNav, setActiveNav, currentPost } = useAppStore();

  const isShuyangPost = currentPost === 'district_shuyang_post' || currentPost === 'district_susong_post';

  interface MenuItemDef {
    key: string;
    label: string;
    icon: React.ReactNode;
  }

  const menuItems: MenuItemDef[] = [
    { key: 'source_control', label: '源头防控', icon: <SafetyCertificateOutlined className="text-base" /> },
    { key: 'monitor_warning', label: '监测预警', icon: <RadarChartOutlined className="text-base" /> },
    { key: 'emergency_response', label: '应急处置', icon: <FileDoneOutlined className="text-base" /> },
    { key: 'dept_management', label: '部门管理', icon: <ApartmentOutlined className="text-base" /> },
    ...(!isShuyangPost
      ? [{ key: 'situation_awareness', label: '态势感知', icon: <LineChartOutlined className="text-base" /> }]
      : [])
  ];


  return (
    <aside
      className={`h-screen bg-white border-r border-[#e5e7eb] flex flex-col justify-between select-none transition-all duration-300 ease-in-out z-40 sticky top-0 flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-[220px]'
      }`}
    >
      {/* 顶部唯一样式系统标识 Logo 区 */}
      <div>
        <div className="h-[56px] border-b border-[#f0f0f0] flex items-center px-4 overflow-hidden">
          {collapsed ? (
            <div
              className="w-full flex justify-center cursor-pointer"
              onClick={() => setActiveNav('dept_management')}
              title="舆情一体化智控平台"
            >
              <CloudFilled className="text-blue-600 text-2xl" />
            </div>
          ) : (
            <div
              className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap overflow-hidden"
              onClick={() => setActiveNav('dept_management')}
            >
              <CloudFilled className="text-blue-600 text-2xl flex-shrink-0" />
              <span className="text-[16px] font-bold text-blue-600 tracking-wide font-sans">
                舆情一体化智控平台
              </span>
            </div>
          )}
        </div>

        {/* 侧边菜单导航项列表 */}
        <nav className="p-2 space-y-1 mt-2">
          {menuItems.map((item) => {
            const isActive =
              activeNav === item.key || (item.key === 'monitor_warning' && activeNav === 'manual_report');

            const handleClick = () => {
              setActiveNav(item.key as MainNavType);
            };

            const content = (
              <div
                key={item.key}
                onClick={handleClick}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#eef6ff] text-blue-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <span className={`flex items-center justify-center ${isActive ? 'text-blue-600' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {/* 激活态右侧蓝色指示条 */}
                {isActive && !collapsed && (
                  <div className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-l-xs" />
                )}
              </div>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.key} title={item.label} placement="right">
                  {content}
                </Tooltip>
              );
            }
            return content;
          })}
        </nav>
      </div>

      {/* 底部收起/展开侧边栏触发器 */}
      <div className="p-2 border-t border-[#e5e7eb] bg-slate-50/60">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 px-2 text-xs text-slate-500 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="text-base" />
          ) : (
            <>
              <MenuFoldOutlined className="text-sm" />
              <span className="whitespace-nowrap font-medium">收起侧边栏</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
