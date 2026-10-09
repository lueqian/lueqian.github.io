import React, { useState } from 'react';
import {
  Button,
  Tag,
  Dropdown,
  Input,
  Select,
  message,
  Modal,
  Badge,
  Tooltip,
} from 'antd';
import {
  DesktopOutlined,
  FileTextOutlined,
  GlobalOutlined,
  DisconnectOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  CodeOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  SafetyCertificateOutlined,
  CloudUploadOutlined,
  AppstoreOutlined,
  SendOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import ClientLedgerQuickEntry, { CQ_SPECIAL_TASKS } from './ClientLedgerQuickEntry';

export interface ClientWorkbenchProps {
  onNavigateToTask?: (taskId: string) => void;
  onOpenSystem?: () => void;
}

type ScenarioKey = '01-login' | '02-workbench-vpn' | '03-workbench-no-vpn' | '04-extract-offline' | '05-extract-sidebar';
type ViewMode = 'workbench' | 'ledger-entry';

export const ClientWorkbench: React.FC<ClientWorkbenchProps> = ({
  onNavigateToTask,
  onOpenSystem,
}) => {
  // 当前原型场景切换
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('02-workbench-vpn');
  
  // 工作台内视窗视图切换：工作台卡片首页 vs 台账录入全屏内嵌模块
  const [viewMode, setViewMode] = useState<ViewMode>('workbench');

  // VPN 连接状态控制（可在工作台内交互）
  const [vpnConnected, setVpnConnected] = useState<boolean>(true);
  const [vpnDuration, setVpnDuration] = useState<string>('02:14:37');

  // 当切换顶部场景 Tab 时，联动内部状态
  const handleScenarioChange = (key: ScenarioKey) => {
    setActiveScenario(key);
    setViewMode('workbench');
    if (key === '02-workbench-vpn') {
      setVpnConnected(true);
    } else if (key === '03-workbench-no-vpn') {
      setVpnConnected(false);
    } else if (key === '04-extract-offline') {
      setVpnConnected(false);
    } else if (key === '05-extract-sidebar') {
      setVpnConnected(true);
    }
  };

  return (
    <div
      style={{
        background: '#141e2b',
        minHeight: '100vh',
        padding: '24px 20px 48px',
        color: '#e2e8f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ==================== 顶部原型元信息与说明栏 (Prototype Chrome) ==================== */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: 1,
              }}
            >
              PROTOTYPE · V2 布局方案
            </span>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              蓝鹰客户端工作台原型
            </h1>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
            从「单页浏览工具」升级为「带账号体系的多模块客户端」。工作台是卡片式首页，模块进入后占满窗口，靠顶部左侧的主页按钮回到工作台。
          </div>
        </div>

        <div style={{ textAlign: 'right', fontSize: 11, color: '#64748b', lineHeight: 1.7 }}>
          <div>窗口 <strong style={{ color: '#cbd5e1' }}>1280 × 800</strong></div>
          <div>状态条 <strong style={{ color: '#cbd5e1' }}>40px</strong> · 上报侧栏 <strong style={{ color: '#cbd5e1' }}>400px</strong></div>
          <div>目标平台 <strong style={{ color: '#cbd5e1' }}>Windows 7+ / Electron</strong></div>
        </div>
      </div>

      {/* 场景切换导航 Tabs (对应截图上方 01~05) */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto 16px',
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {[
          { key: '01-login', label: '01 登录' },
          { key: '02-workbench-vpn', label: '02 工作台 · 有 VPN 权限' },
          { key: '03-workbench-no-vpn', label: '03 工作台 · 无 VPN 权限' },
          { key: '04-extract-offline', label: '04 信息提取 · VPN 断线' },
          { key: '05-extract-sidebar', label: '05 信息提取 · 上报侧栏' },
        ].map((tab) => {
          const isActive = activeScenario === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleScenarioChange(tab.key as ScenarioKey)}
              style={{
                background: isActive ? '#1e293b' : 'rgba(30, 41, 59, 0.4)',
                border: isActive ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.2)',
                color: isActive ? '#38bdf8' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================== 客户端桌面视窗 (Client Window Chrome: 1280 × 800) ==================== */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          minHeight: 760,
          display: 'flex',
          flexDirection: 'column',
          color: '#0f172a',
        }}
      >
        {/* 1. 拟真 Windows / Electron 标题栏 (Height: 32px) */}
        <div
          style={{
            height: 32,
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            userSelect: 'none',
          }}
        >
          {/* 左侧：蓝鹰客户端标识 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: '#1677ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              鹰
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
              蓝鹰
            </span>
          </div>

          {/* 右侧：Windows 经典三大控制键 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#64748b', fontSize: 11 }}>
            <span style={{ cursor: 'pointer', padding: '0 4px' }} title="最小化">─</span>
            <span style={{ cursor: 'pointer', padding: '0 4px' }} title="最大化">□</span>
            <span style={{ cursor: 'pointer', padding: '0 4px' }} title="关闭" onClick={() => message.info('模拟关闭客户端')}>✕</span>
          </div>
        </div>

        {/* 2. 40px 状态条 (对应截图中的状态条标号 1) */}
        <div
          style={{
            height: 40,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}
        >
          {/* 左侧：VPN 状态胶囊 (标注 1) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {vpnConnected ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#059669',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: 9999,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                VPN 已连接 {vpnDuration}
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: 9999,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
                VPN 未连接
              </span>
            )}

            {/* 截图中的标注圆圈 1 */}
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#0f172a',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
          </div>

          {/* 右侧：用户下拉信息 */}
          <Dropdown
            menu={{
              items: [
                { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
                { key: 'setting', icon: <SettingOutlined />, label: '系统设置' },
                { type: 'divider' },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  danger: true,
                  label: '退出登录',
                  onClick: () => {
                    setActiveScenario('01-login');
                    message.info('已退出客户端登录');
                  },
                },
              ],
            }}
            trigger={['click']}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#1677ff',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                张
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>
                张明 ▾
              </span>
            </div>
          </Dropdown>
        </div>

        {/* ==================== 3. 客户端视窗主体内容 ==================== */}
        <div style={{ flex: 1, background: '#f3f6f9', position: 'relative' }}>
          
          {/* ---------- 场景 A：登录界面 (01 登录) ---------- */}
          {activeScenario === '01-login' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 640,
                padding: '40px 20px',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  width: 380,
                  padding: '32px 28px',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: '#1677ff',
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 800,
                      marginBottom: 12,
                    }}
                  >
                    鹰
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>
                    登录蓝鹰政务客户端
                  </h2>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    公安一体化舆情处置与固证取证终端
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 4, fontWeight: 500 }}>账号 / 警号</div>
                    <Input defaultValue="zhangming@example.com" size="large" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 4, fontWeight: 500 }}>登录密码</div>
                    <Input.Password defaultValue="••••••••••••" size="large" />
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{ background: '#1677ff', fontWeight: 600, marginTop: 10 }}
                    onClick={() => {
                      setActiveScenario('02-workbench-vpn');
                      setVpnConnected(true);
                      message.success('登录成功，已自动连接专线 VPN！');
                    }}
                  >
                    登 录
                  </Button>
                </div>
              </div>
            </div>
          ) : activeScenario === '04-extract-offline' || activeScenario === '05-extract-sidebar' ? (
            /* ---------- 场景 B：信息提取与上报侧栏模拟界面 ---------- */
            <div style={{ display: 'flex', height: '100%', minHeight: 680 }}>
              {/* 模拟客户端内嵌浏览器主区域 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <div style={{ height: 44, background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
                  <Button size="small" icon={<ArrowLeftOutlined />} onClick={() => setActiveScenario('02-workbench-vpn')}>
                    返回工作台
                  </Button>
                  <Input size="small" value="https://x.com/sample_opinion/status/19827391" readOnly style={{ flex: 1, fontFamily: 'monospace' }} />
                  <Button size="small" icon={<ReloadOutlined />}>刷新</Button>
                </div>

                {/* 网页模拟正文 */}
                <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
                  {activeScenario === '04-extract-offline' && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: 8, color: '#dc2626', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>⚠️ VPN 专线已断开，无法访问境外站点，请检查网络配置或重新连接 VPN。</span>
                      <Button size="small" type="primary" danger onClick={() => setVpnConnected(true)}>重试连接</Button>
                    </div>
                  )}

                  <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <Tag color="magenta">境外社媒 X</Tag>
                      <h3 style={{ margin: 0, fontSize: 16 }}>@NewsObserver: 针对近期某涉警事件的虚假拼接视频</h3>
                    </div>
                    <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
                      该帖文涉及不实剪辑与抹黑言论，正在网络快速扩散，已引发境内外大量网民围观与恶意跟帖，互动量持续攀升。
                    </p>
                    <div style={{ height: 160, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      [ 涉事视频预览与固证画面 ]
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧 400px 上报侧栏 */}
              <div
                style={{
                  width: 400,
                  background: '#ffffff',
                  borderLeft: '1px solid #e2e8f0',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                    信息上报侧栏 (400px)
                  </span>
                  <Tag color="cyan">自动提取就绪</Tag>
                </div>

                <div style={{ fontSize: 12, color: '#64748b' }}>
                  已自动提取当前浏览页面的标题、发布人、时间与互动数据。
                </div>

                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><strong>标题：</strong>针对近期某涉警事件的虚假拼接视频</div>
                  <div><strong>作者：</strong>NewsObserver</div>
                  <div><strong>时间：</strong>2026-09-18 14:26:00</div>
                  <div><strong>点赞：</strong>12,482 · <strong>转发：</strong>3,291</div>
                </div>

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  style={{ background: '#1677ff', marginTop: 'auto' }}
                  onClick={() => {
                    message.success('信息已成功回传蓝鹰系统上报库！');
                    setActiveScenario('02-workbench-vpn');
                  }}
                >
                  确认回传上报
                </Button>
              </div>
            </div>
          ) : viewMode === 'ledger-entry' ? (
            /* ---------- 场景 C：全屏内嵌「台账录入与固证」模块 ---------- */
            <div style={{ padding: '0', minHeight: 680 }}>
              <ClientLedgerQuickEntry
                isStandalone={false}
                showBackButton={true}
                onBackToWorkbench={() => setViewMode('workbench')}
                isTaskLocked={false}
                onNavigateToTask={(taskId) => {
                  if (onNavigateToTask) {
                    onNavigateToTask(taskId);
                  } else {
                    message.success(`已切换至【${taskId}】专项处置台账页面`);
                  }
                }}
                onSyncSuccess={(records, taskInfo) => {
                  message.success(`已成功向【${taskInfo?.name || '处置台账'}】批量同步 ${records.length} 条记录！`);
                }}
              />
            </div>
          ) : (
            /* ---------- 场景 D：工作台卡片首页 (对应用户提供的原型主截图) ---------- */
            <div style={{ padding: '28px 36px', maxWidth: 1200, margin: '0 auto' }}>
              
              {/* 大标题：工作台 */}
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>
                工作台
              </h2>

              {/* 1. 用户信息卡片 (对应截图标注 2) */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: '#e0edff',
                      color: '#1677ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    张
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        张明
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '1px 8px',
                          borderRadius: 4,
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          fontWeight: 500,
                        }}
                      >
                        VPN
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: '1px 8px',
                          borderRadius: 4,
                          background: '#f0fdf4',
                          color: '#16a34a',
                          border: '1px solid #bbf7d0',
                          fontWeight: 500,
                        }}
                      >
                        信息上报
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      zhangming@example.com · 数据分析部 / 高级分析师 · 上次登录 今天 09:12
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Button
                    onClick={() => {
                      setActiveScenario('01-login');
                      message.info('已退出客户端登录');
                    }}
                    style={{ borderRadius: 6, fontSize: 12, color: '#475569' }}
                  >
                    退出登录
                  </Button>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    2
                  </span>
                </div>
              </div>

              {/* 2. VPN 连接状态卡片 (对应截图标注 3) */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: vpnConnected ? '#10b981' : '#94a3b8',
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                      {vpnConnected ? 'VPN 已连接' : 'VPN 未连接'}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
                    {vpnConnected ? `已连接 ${vpnDuration}` : '专线未建立连接'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {vpnConnected ? (
                    <Button
                      danger
                      onClick={() => {
                        setVpnConnected(false);
                        message.warning('VPN 已断开连接');
                      }}
                      style={{ borderRadius: 6, fontSize: 12 }}
                    >
                      断开连接
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => {
                        setVpnConnected(true);
                        message.success('VPN 专线连接成功！');
                      }}
                      style={{ background: '#1677ff', borderRadius: 6, fontSize: 12 }}
                    >
                      连接专线
                    </Button>
                  )}
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    3
                  </span>
                </div>
              </div>

              {/* 3. 功能卡片网格 (包含原有两大入口 + 核心新增的「台账录入」入口) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                {/* 卡片 1: 信息提取 (对应截图标注 4) */}
                <div
                  onClick={() => setActiveScenario('05-extract-sidebar')}
                  style={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1677ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileTextOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                          信息提取
                        </span>
                      </div>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: '#0f172a',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        4
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>
                      在客户端内打开境内外站点，提取正文、图片、视频与互动数据，并回传蓝鹰上报。
                    </p>
                  </div>

                  <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                    上次使用 · 今天 14:26 · x.com
                  </div>
                </div>

                {/* 卡片 2: 访问系统 (对应截图标注 5) */}
                <div
                  onClick={() => {
                    if (onOpenSystem) {
                      onOpenSystem();
                    } else {
                      message.success('正在以系统浏览器打开蓝鹰一体化系统 (eagle.example.com)...');
                    }
                  }}
                  style={{
                    background: '#ffffff',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 140,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1677ff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GlobalOutlined style={{ color: '#2563eb', fontSize: 18 }} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                          访问系统
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>系统浏览器打开</span>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#0f172a',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          5
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: '0 0 16px' }}>
                      在系统默认浏览器中打开蓝鹰，处理任务、报告与预警。
                    </p>
                  </div>

                  <div style={{ fontSize: 11, color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 10, fontFamily: 'monospace' }}>
                    eagle.example.com
                  </div>
                </div>
              </div>

              {/* ==================== 重点新增：台账录入卡片（对应用户红框要求） ==================== */}
              <div
                onClick={() => setViewMode('ledger-entry')}
                style={{
                  background: '#ffffff',
                  borderRadius: 10,
                  border: '2px solid #ef4444', // 醒目红框高亮，完美呼应用户截图需求
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.12)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.12)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* 左上角提示角标 */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 24,
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 8px',
                    borderRadius: 4,
                    letterSpacing: 0.5,
                  }}
                >
                  新增功能入口 · 源头防控联动
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      marginTop: 2,
                    }}
                  >
                    📋
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        台账录入
                      </span>
                      <Tag color="red" style={{ margin: 0, fontSize: 11, borderRadius: 4 }}>
                        自动固证 · 批量上报
                      </Tag>
                    </div>

                    <p style={{ fontSize: 13, color: '#dc2626', margin: '0 0 8px', fontWeight: 500, lineHeight: 1.5 }}>
                      在客户端内批量录入链接，提取链接标题、发布时间、平台并回传一体化处置台账。
                    </p>

                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span>✓ 选择源头防控专项</span>
                      <span>✓ 手动输入 / Excel导入</span>
                      <span>✓ 自动化采集并同步</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="primary"
                  danger
                  icon={<ArrowRightOutlined />}
                  style={{ borderRadius: 6, fontWeight: 600, padding: '0 18px', height: 36 }}
                >
                  进入录入
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientWorkbench;
