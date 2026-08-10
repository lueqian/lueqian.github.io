import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Avatar, Tooltip, Select, Badge, Popover, Slider, InputNumber, Tag, notification } from 'antd';
import {
  ArrowLeftOutlined,
  SwapOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
  UpOutlined,
  DownOutlined,
  BellOutlined,
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
    unit: '次',
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

  // 预警百分比，默认 20%
  const [alertThreshold, setAlertThreshold] = useState(function () {
    const saved = localStorage.getItem('eagle_alert_threshold');
    return saved ? parseInt(saved, 10) : 20;
  });

  const handleThresholdChange = useCallback(function (val: number) {
    setAlertThreshold(val);
    localStorage.setItem('eagle_alert_threshold', String(val));
    window.dispatchEvent(new Event('storage'));
  }, []);

  const [tasks, setTasks] = useState<any[]>([]);

  const loadTasksFromStorage = useCallback(function () {
    const local = localStorage.getItem('eagle_collect_tasks');
    if (local) {
      try {
        setTasks(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(function () {
    loadTasksFromStorage();
    const handleStorageChange = function () {
      loadTasksFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadTasksFromStorage, 4000);
    return function () {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loadTasksFromStorage]);

  const getAlertTasks = useCallback(function (taskList: any[], threshold: number) {
    return taskList.filter(function (t) {
      if (t.status !== 'active') return false;
      const limit = 5000;
      const current = t.task_type === 'comment' ? (t.comment_total || t.total_count) : t.total_count;
      const leftRatio = (limit - current) / limit;
      return leftRatio * 100 < threshold;
    });
  }, []);

  const alertTasks = useMemo(function () {
    return getAlertTasks(tasks, alertThreshold);
  }, [tasks, alertThreshold, getAlertTasks]);

  useEffect(function () {
    const timer = setTimeout(function () {
      const lowQuotaTasks = getAlertTasks(tasks, alertThreshold);
      if (lowQuotaTasks.length > 0) {
        notification.warning({
          message: '系统额度预警',
          description: '任务采集额度较低，请及时添加',
          duration: 5,
          placement: 'topRight',
        });
      }
    }, 1000);
    return function () { clearTimeout(timer); };
  }, []); // 仅在挂载时运行一次，即登录提醒

  const popoverContent = (
    <div style={{ width: 300, padding: '4px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
        <strong style={{ fontSize: 14 }}>预警参数配置</strong>
        <Tag color="orange">额度低</Tag>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.65)', marginBottom: 6 }}>低于阈值提醒用户：</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Slider
            min={5}
            max={50}
            value={alertThreshold}
            onChange={handleThresholdChange}
            style={{ flex: 1, margin: '0 8px' }}
          />
          <InputNumber
            min={5}
            max={50}
            formatter={function (v) { return v + '%'; }}
            parser={function (v) { return v ? parseInt(v.replace('%', ''), 10) : 20; }}
            value={alertThreshold}
            onChange={function (v) { handleThresholdChange(v || 20); }}
            style={{ width: 70 }}
            size="small"
          />
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#cf1322' }}>
          任务采集额度较低，请及时添加 ({alertTasks.length})
        </div>
        {alertTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>暂无低额度运行中任务</div>
         ) : (
          <div style={{ maxHeight: 180, overflowY: 'auto' }}>
            {alertTasks.map(function (t) {
              const limit = 5000;
              const current = t.task_type === 'comment' ? (t.comment_total || t.total_count) : t.total_count;
              const leftRatio = Math.max(0, Math.floor(((limit - current) / limit) * 100));
              return (
                <div key={t.id} style={{ padding: '6px 8px', background: '#fff1f0', borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 12, color: '#cf1322', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.task_name}>{t.task_name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.65)' }}>当前可用额度仅剩 {leftRatio}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

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

        {/* 额度预警铃铛（无点击弹窗） */}
        <Badge count={alertTasks.length} size="small" style={{ offset: [-2, 2], boxShadow: 'none' }}>
          <div className="ly-header-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>
            <BellOutlined style={{ fontSize: 16 }} />
          </div>
        </Badge>

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
