import React from 'react';
import { Modal, message } from 'antd';
import {
  AppstoreFilled,
  ApartmentOutlined,
  SolutionOutlined,
  ShareAltOutlined,
  TeamOutlined,
  StarOutlined,
  SearchOutlined,
  FundOutlined,
  SyncOutlined,
  DotChartOutlined,
  IdcardOutlined,
  TrophyOutlined,
  ProfileOutlined,
  BarChartOutlined,
  SoundOutlined,
  AlertOutlined,
  DesktopOutlined,
  FileTextOutlined,
  SettingOutlined,
  LaptopOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store';

interface BusinessApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  navKey?: string;
}

export const OtherBusinessModal: React.FC = () => {
  const { toolboxModalOpen, closeToolboxModal, setActiveNav } = useAppStore();

  const businessApps: BusinessApp[] = [
    // 第 1 行 (8个)
    { id: 'dept', name: '部门管理', icon: <ApartmentOutlined className="text-2xl" />, navKey: 'dept_management' },
    { id: 'post', name: '岗位管理', icon: <SolutionOutlined className="text-2xl" /> },
    { id: 'instruction', name: '指令管理', icon: <ShareAltOutlined className="text-2xl" />, navKey: 'emergency_response' },
    { id: 'leaders', name: '领导管理', icon: <TeamOutlined className="text-2xl" /> },
    { id: 'hot_events', name: '热点事件', icon: <StarOutlined className="text-2xl" /> },
    { id: 'search', name: '搜索', icon: <SearchOutlined className="text-2xl" /> },
    { id: 'workbench', name: '工作台', icon: <FundOutlined className="text-2xl" />, navKey: 'monitor_warning' },
    { id: 'dynamic_track', name: '动态跟踪', icon: <SyncOutlined className="text-2xl" /> },

    // 第 2 行 (8个)
    { id: 'special_topic', name: '全网专题', icon: <DotChartOutlined className="text-2xl" /> },
    { id: 'key_dispatch', name: '重点派', icon: <IdcardOutlined className="text-2xl" /> },
    { id: 'hot_patrol', name: '热榜巡查', icon: <TrophyOutlined className="text-2xl" /> },
    { id: 'patrol_propaganda', name: '巡宣功能', icon: <ProfileOutlined className="text-2xl" /> },
    { id: 'rankings', name: '排行榜', icon: <BarChartOutlined className="text-2xl" /> },
    { id: 'special_analysis', name: '专项分析', icon: <SoundOutlined className="text-2xl" /> },
    { id: 'early_warning', name: '预警', icon: <AlertOutlined className="text-2xl" />, navKey: 'monitor_warning' },
    { id: 'large_screen', name: '大屏', icon: <DesktopOutlined className="text-2xl" />, navKey: 'situation_awareness' },

    // 第 3 行 (3个)
    { id: 'briefing', name: '文章简报', icon: <FileTextOutlined className="text-2xl" /> },
    { id: 'settings', name: '设置', icon: <SettingOutlined className="text-2xl" /> },
    { id: 'client_app', name: '蓝鹰客户端', icon: <LaptopOutlined className="text-2xl" /> }
  ];

  const handleAppClick = (app: BusinessApp) => {
    if (app.navKey) {
      setActiveNav(app.navKey as any);
      closeToolboxModal();
      message.success(`已切换至【${app.name}】`);
    } else {
      message.info(`已开启【${app.name}】协同模块`);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5">
          <AppstoreFilled className="text-blue-600 text-lg" />
          <span className="text-[16px] font-bold text-slate-800">其他业务</span>
        </div>
      }
      open={toolboxModalOpen}
      onCancel={closeToolboxModal}
      footer={null}
      width={780}
      centered
      className="select-none"
    >
      <div className="py-5 px-2">
        {/* 8 列网格响应式布局 */}
        <div className="grid grid-cols-8 gap-y-6 gap-x-2">
          {businessApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="group flex flex-col items-center justify-center cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              {/* 纯蓝圆角矩形图标盒子 */}
              <div className="w-13 h-13 rounded-xl bg-[#1677ff] hover:bg-[#4096ff] text-white flex items-center justify-center shadow-xs transition-colors group-hover:shadow-md">
                {app.icon}
              </div>
              <span className="text-xs text-slate-700 font-medium mt-2 text-center group-hover:text-blue-600 whitespace-nowrap">
                {app.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
