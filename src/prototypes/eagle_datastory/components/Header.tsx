import React, { useState, useCallback } from 'react';
import { Avatar, Tooltip, Select } from 'antd';
import {
  ArrowLeftOutlined,
  SwapOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';

// ============ 类型定义 ============

export type SubNavItem = {
  key: string;
  label: string;
};

export interface HeaderProps {
  /** 页面标题（动态显示当前页面名称） */
  pageTitle?: string;
  /** 二级菜单 Tab 项（可选，有值时显示在标题右侧） */
  subNavItems?: SubNavItem[];
  /** 当前激活的二级菜单 key */
  activeSubNav?: string;
  /** 二级菜单切换回调 */
  onSubNavChange?: (key: string) => void;
  /** 用户昵称，默认 '管理员' */
  nickname?: string;
  /** 返回导航页回调 */
  onBackToNav?: () => void;
  /** 切换账号回调 */
  onSwitchAccount?: () => void;
  /** 退出登录回调 */
  onLogout?: () => void;
}

// ============ 主题选项 ============

type ThemeOption = {
  key: string;
  label: string;
  colors: { primary: string; sidebar: string; accent: string };
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    key: 'tech-blue',
    label: '科技蓝',
    colors: { primary: '#3b82f6', sidebar: '#0f172a', accent: '#60a5fa' },
  },
  {
    key: 'deep-blue',
    label: '科技深蓝',
    colors: { primary: '#2563eb', sidebar: '#020617', accent: '#3b82f6' },
  },
  {
    key: 'purple-red',
    label: '紫红',
    colors: { primary: '#a855f7', sidebar: '#1a0a2e', accent: '#c084fc' },
  },
];

// ============ 任务消耗数据 ============

type ConsumptionData = {
  label: string;
  value: string;
  unit: string;
  theme: 'blue' | 'green' | 'yellow';
  trend?: { value: string; direction: 'up' | 'down' };
};

const CONSUMPTION_DATA: ConsumptionData[] = [
  {
    label: '账户余额',
    value: '5,000,000',
    unit: '条',
    theme: 'blue',
  },
  {
    label: '当日累计消耗',
    value: '12,450',
    unit: '次',
    theme: 'green',
    trend: { value: '较昨天增加 120 次', direction: 'up' },
  },
  {
    label: '本月累计消耗',
    value: '345,600',
    unit: '次',
    theme: 'yellow',
    trend: { value: '较上个月减少 1,200 次', direction: 'down' },
  },
];

const TREND_UP = '#ff4d4f';
const TREND_DOWN = '#52c41a';

// ============ 头像浮窗组件 ============

const AvatarPopover: React.FC<{
  visible: boolean;
  nickname: string;
  currentTheme: string;
  onThemeChange: (key: string) => void;
}> = ({ visible, nickname, currentTheme, onThemeChange }) => {
  if (!visible) return null;

  const avatarText = nickname ? nickname.charAt(0).toUpperCase() : 'U';

  return (
    <div className="ly-avatar-popover">
      {/* 用户信息区 */}
      <div className="ly-popover-user">
        <Avatar
          size={48}
          style={{
            backgroundColor: '#3b82f6',
            fontSize: 18,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {avatarText}
        </Avatar>
        <div className="ly-popover-user-info">
          <div className="ly-popover-nickname">{nickname}</div>
          <div className="ly-popover-meta">
            使用系统 <span style={{ color: '#fff', fontWeight: 500 }}>566</span> 天，有效期至{' '}
            <span style={{ color: '#fff', fontWeight: 500 }}>2027-01-01</span>
          </div>
        </div>
      </div>

      {/* 分割线 */}
      <div className="ly-popover-divider" />

      {/* 语言设置 */}
      <div className="ly-popover-section">
        <div className="ly-popover-section-title">语言设置</div>
        <Select
          defaultValue="zh-CN"
          size="small"
          style={{ width: '100%' }}
          options={[
            { value: 'zh-CN', label: '简体中文' },
            { value: 'en-US', label: 'English' },
          ]}
          popupMatchSelectWidth={false}
        />
        <div className="ly-popover-hint">
          <InfoCircleOutlined style={{ fontSize: 12, marginRight: 4 }} />
          语言设置仅影响系统界面显示
        </div>
      </div>

      {/* 主题设置 */}
      <div className="ly-popover-section">
        <div className="ly-popover-section-title">主题设置</div>
        <div className="ly-popover-themes">
          {THEME_OPTIONS.map(function (t) {
            const isActive = currentTheme === t.key;
            return (
              <div
                key={t.key}
                className={
                  'ly-popover-theme-card' + (isActive ? ' ly-popover-theme-card--active' : '')
                }
                onClick={function () {
                  onThemeChange(t.key);
                }}
              >
                <div className="ly-popover-theme-preview">
                  <div
                    className="ly-popover-theme-sidebar"
                    style={{ backgroundColor: t.colors.sidebar }}
                  />
                  <div className="ly-popover-theme-body">
                    <div
                      className="ly-popover-theme-header"
                      style={{ backgroundColor: t.colors.primary }}
                    />
                    <div
                      className="ly-popover-theme-block"
                      style={{ backgroundColor: t.colors.accent, opacity: 0.3 }}
                    />
                    <div
                      className="ly-popover-theme-block"
                      style={{ backgroundColor: t.colors.accent, opacity: 0.2 }}
                    />
                  </div>
                </div>
                <div className="ly-popover-theme-label">{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 任务消耗仪表盘 */}
      <div className="ly-popover-section">
        <div className="ly-popover-section-title">任务消耗</div>
        <div className="ly-popover-consumption">
          {CONSUMPTION_DATA.map(function (item, idx) {
            return (
              <div key={idx} className={'ly-consumption-card ly-consumption-card--' + item.theme}>
                <div className="ly-consumption-label">{item.label}</div>
                <div className="ly-consumption-value">
                  <span className="ly-consumption-value-num">{item.value}</span>
                  <span className="ly-consumption-value-unit">{item.unit}</span>
                </div>
                {item.trend && (
                  <div
                    className="ly-consumption-trend"
                    style={{ color: item.trend.direction === 'up' ? TREND_UP : TREND_DOWN }}
                  >
                    {item.trend.direction === 'up' ? (
                      <UpOutlined style={{ fontSize: 10 }} />
                    ) : (
                      <DownOutlined style={{ fontSize: 10 }} />
                    )}
                    <span style={{ marginLeft: 2, fontSize: 12 }}>
                      {item.trend.value}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="ly-popover-footer">
        如有使用问题，请联系项目经理或客服处理
      </div>
    </div>
  );
};

// ============ Header 组件 ============

const Header: React.FC<HeaderProps> = function Header({
  pageTitle = '',
  subNavItems,
  activeSubNav,
  onSubNavChange,
  nickname = '管理员',
  onBackToNav,
  onSwitchAccount,
  onLogout,
}) {
  // 取昵称首字作为头像文字
  const avatarText = nickname ? nickname.charAt(0).toUpperCase() : 'U';

  // 浮窗状态
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('tech-blue');

  const handleAvatarEnter = useCallback(function () {
    setPopoverVisible(true);
  }, []);

  const handleAvatarLeave = useCallback(function () {
    setPopoverVisible(false);
  }, []);

  const handleThemeChange = useCallback(function (key: string) {
    setCurrentTheme(key);
  }, []);

  return (
    <header className="ly-header">
      <div className="ly-header-left">
        <span className="ly-header-title">{pageTitle}</span>

        {/* 二级菜单 Tabs（仅在传入 subNavItems 时渲染） */}
        {subNavItems && subNavItems.length > 0 && (
          <nav className="ly-header-sub-nav">
            {subNavItems.map(function (item) {
              const isActive = activeSubNav === item.key;
              return (
                <div
                  key={item.key}
                  className={
                    'ly-header-sub-nav-item' +
                    (isActive ? ' ly-header-sub-nav-item--active' : '')
                  }
                  onClick={function () {
                    onSubNavChange && onSubNavChange(item.key);
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </nav>
        )}
      </div>
      <div className="ly-header-right">
        {/* 用户头像区域（含浮窗） */}
        <div
          className="ly-header-avatar-area"
          onMouseEnter={handleAvatarEnter}
          onMouseLeave={handleAvatarLeave}
        >
          <Avatar
            size={32}
            style={{
              backgroundColor: '#3b82f6',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {avatarText}
          </Avatar>
          <span className="ly-header-username">{nickname}</span>

          {/* 浮窗 */}
          <div className="ly-avatar-popover-wrapper">
            <AvatarPopover
              visible={popoverVisible}
              nickname={nickname}
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
            />
          </div>
        </div>

        {/* 分割线 */}
        <div className="ly-header-divider" />

        {/* 功能图标 */}
        <Tooltip title="返回导航页" placement="bottom">
          <div className="ly-header-icon" onClick={onBackToNav}>
            <ArrowLeftOutlined />
          </div>
        </Tooltip>
        <Tooltip title="切换账号" placement="bottom">
          <div className="ly-header-icon" onClick={onSwitchAccount}>
            <SwapOutlined />
          </div>
        </Tooltip>
        <Tooltip title="退出登录" placement="bottom">
          <div className="ly-header-icon" onClick={onLogout}>
            <LogoutOutlined />
          </div>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
