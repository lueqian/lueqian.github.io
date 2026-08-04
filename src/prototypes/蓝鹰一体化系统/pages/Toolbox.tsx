import React, { useState } from 'react';
import { Card, Segmented, Popover, Button, Space, Tag, Empty } from 'antd';
import {
  CrownOutlined,
  SettingOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  UserSwitchOutlined,
  AppstoreOutlined,
  RightOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import LeaderManagement from './LeaderManagement';

type ToolboxTabKey = 'leader' | 'settings' | 'department' | 'instruction' | 'post';

interface ModuleItem {
  key: ToolboxTabKey;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

const modules: ModuleItem[] = [
  {
    key: 'leader',
    label: '领导管理',
    desc: '维护领导人员花名册、警号及联系方式，供值班表联动选择',
    icon: <CrownOutlined style={{ color: '#d97706' }} />,
    badge: '新增',
  },
  {
    key: 'settings',
    label: '系统设置',
    desc: '基础系统参数配置、安全策略与通知对接设置',
    icon: <SettingOutlined style={{ color: '#2563eb' }} />,
  },
  {
    key: 'department',
    label: '部门管理',
    desc: '公安机关各处室、支队与区县警务部门组织架构维护',
    icon: <ApartmentOutlined style={{ color: '#059669' }} />,
  },
  {
    key: 'instruction',
    label: '指令管理',
    desc: '应急防控指令模板库、常态化处置预案模板维护',
    icon: <SafetyCertificateOutlined style={{ color: '#7c3aed' }} />,
  },
  {
    key: 'post',
    label: '岗位管理',
    desc: '指挥调度岗、研判岗、汇编岗等值班岗位设置',
    icon: <UserSwitchOutlined style={{ color: '#db2777' }} />,
  },
];

const Toolbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolboxTabKey>('leader');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const currentModule = modules.find((m) => m.key === activeTab) || modules[0];

  // 悬停浮层弹窗内容
  const popoverMenuContent = (
    <div style={{ width: 280, padding: '4px 0' }}>
      <div style={{ padding: '4px 12px 8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: 6, fontWeight: 600, color: '#475569', fontSize: 13 }}>
        🛠️ 工具箱子模块快捷导航
      </div>
      {modules.map((m) => (
        <div
          key={m.key}
          onClick={() => {
            setActiveTab(m.key);
            setPopoverOpen(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 6,
            cursor: 'pointer',
            background: activeTab === m.key ? '#eff6ff' : 'transparent',
            transition: 'background 0.2s',
          }}
          className="toolbox-popover-item"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <div>
              <div style={{ fontWeight: activeTab === m.key ? 600 : 500, color: activeTab === m.key ? '#1d4ed8' : '#1e293b', fontSize: 14 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.desc.slice(0, 16)}...</div>
            </div>
          </div>
          {m.badge && <Tag color="red" style={{ margin: 0, fontSize: 10, padding: '0 4px' }}>{m.badge}</Tag>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="toolbox-page-wrapper" style={{ padding: '16px 24px', background: '#f8fafc', minHeight: 'calc(100vh - 64px)' }}>
      {/* 顶部 Header & 模块导航栏 */}
      <Card bordered={false} bodyStyle={{ padding: '16px 24px' }} style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Popover
              content={popoverMenuContent}
              trigger="hover"
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              placement="bottomLeft"
            >
              <Button
                type="primary"
                icon={<AppstoreOutlined />}
                style={{ background: '#1677ff', height: 40, borderRadius: 6, fontWeight: 600 }}
              >
                悬停展开工具箱模块 <RightOutlined style={{ fontSize: 11 }} />
              </Button>
            </Popover>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                {currentModule.icon} {currentModule.label}
              </h2>
              <span style={{ fontSize: 12, color: '#64748b' }}>{currentModule.desc}</span>
            </div>
          </div>

          {/* 横向 Segmented 切换标签 */}
          <Segmented
            value={activeTab}
            onChange={(val) => setActiveTab(val as ToolboxTabKey)}
            options={modules.map((m) => ({
              value: m.key,
              label: (
                <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                  {m.badge && <Tag color="error" style={{ margin: 0, padding: '0 4px', fontSize: 10 }}>{m.badge}</Tag>}
                </div>
              ),
            }))}
            size="large"
            className="toolbox-segmented"
          />
        </div>
      </Card>

      {/* 主内容区 */}
      <div className="toolbox-content-body">
        {activeTab === 'leader' && <LeaderManagement />}

        {activeTab === 'settings' && (
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Empty
              image={<SettingOutlined style={{ fontSize: 56, color: '#94a3b8' }} />}
              description={
                <div>
                  <h3 style={{ margin: '8px 0 4px', color: '#1e293b' }}>系统设置</h3>
                  <p style={{ color: '#64748b' }}>包含基础参数配置、安全策略与智控报警对接通道设置</p>
                </div>
              }
            >
              <Button type="primary">进行参数配置</Button>
            </Empty>
          </Card>
        )}

        {activeTab === 'department' && (
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Empty
              image={<ApartmentOutlined style={{ fontSize: 56, color: '#94a3b8' }} />}
              description={
                <div>
                  <h3 style={{ margin: '8px 0 4px', color: '#1e293b' }}>部门管理</h3>
                  <p style={{ color: '#64748b' }}>包含各处室、支队与区县分局组织树架构管理</p>
                </div>
              }
            >
              <Button type="primary">导入部门组织树</Button>
            </Empty>
          </Card>
        )}

        {activeTab === 'instruction' && (
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Empty
              image={<SafetyCertificateOutlined style={{ fontSize: 56, color: '#94a3b8' }} />}
              description={
                <div>
                  <h3 style={{ margin: '8px 0 4px', color: '#1e293b' }}>指令管理</h3>
                  <p style={{ color: '#64748b' }}>包含预置应急处置指令模板库与常规预案库维护</p>
                </div>
              }
            >
              <Button type="primary">新建指令模板</Button>
            </Empty>
          </Card>
        )}

        {activeTab === 'post' && (
          <Card bordered={false} style={{ borderRadius: 8 }}>
            <Empty
              image={<UserSwitchOutlined style={{ fontSize: 56, color: '#94a3b8' }} />}
              description={
                <div>
                  <h3 style={{ margin: '8px 0 4px', color: '#1e293b' }}>岗位管理</h3>
                  <p style={{ color: '#64748b' }}>包含指挥调度岗、研判岗、汇编岗等值班岗位设置</p>
                </div>
              }
            >
              <Button type="primary">新增岗位设置</Button>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Toolbox;
