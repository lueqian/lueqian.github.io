import React from 'react';
import {
  SearchOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  StarOutlined,
  CloudSyncOutlined,
  AccountBookOutlined,
  BulbOutlined,
  MessageOutlined,
  CarryOutOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

export interface NavigationProps {
  /** 当前激活的菜单项 key */
  activeKey: string;
  /** 侧边栏是否折叠 */
  collapsed: boolean;
  /** 菜单选中回调 */
  onMenuSelect: (key: string) => void;
  /** 折叠/展开切换回调 */
  onToggleCollapse: () => void;
}

// ============ 菜单数据 ============

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const MENU_ITEMS: MenuItem[] = [
  { key: 'search', label: '搜索', icon: <SearchOutlined /> },
  { key: 'workbench', label: '工作台', icon: <AppstoreOutlined /> },
  { key: 'recommend', label: '智能推荐', icon: <BulbOutlined /> },
  { key: 'topic', label: '全网专题', icon: <GlobalOutlined /> },
  { key: 'overseas', label: '海外发现', icon: <GlobalOutlined /> },
  { key: 'source', label: '重点源', icon: <StarOutlined /> },
  { key: 'tg_groups', label: 'TG群管理', icon: <MessageOutlined /> },
  { key: 'collect', label: '采集任务', icon: <CloudSyncOutlined /> },
  { key: 'quota', label: '额度明细', icon: <AccountBookOutlined /> },
  { key: 'ticket_admin', label: '工单管理', icon: <CarryOutOutlined /> },
];

// ============ 组件 ============

const Navigation: React.FC<NavigationProps> = function Navigation({
  activeKey,
  collapsed,
  onMenuSelect,
  onToggleCollapse,
}) {
  return (
    <aside className={'ly-sidebar' + (collapsed ? ' ly-sidebar--collapsed' : '')}>
      {/* Logo 区 */}
      <div className="ly-sidebar-logo">
        <div className="ly-sidebar-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && <span className="ly-sidebar-logo-text">数说蓝鹰</span>}
      </div>

      {/* 菜单 */}
      <nav className="ly-sidebar-menu">
        {MENU_ITEMS.map(function (item) {
          const isActive = activeKey === item.key;
          return (
            <div
              key={item.key}
              className={
                'ly-menu-item' +
                (isActive ? ' ly-menu-item--active' : '')
              }
              onClick={function () {
                onMenuSelect(item.key);
              }}
            >
              <span className="ly-menu-item-icon">{item.icon}</span>
              {!collapsed && <span className="ly-menu-item-label">{item.label}</span>}
            </div>
          );
        })}
      </nav>

      {/* 折叠按钮 */}
      <div className="ly-sidebar-footer">
        <div className="ly-sidebar-collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
