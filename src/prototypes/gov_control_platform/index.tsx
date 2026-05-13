/**
 * @name Gov Control Platform (智控平台)
 * @mode axure
 * @description 数说蓝鹰舆情系统针对政府端的定制化版本，侧重于舆情全流程梳理、任务下达及单位执行。
 *
 * 架构说明：
 * - index.tsx: 系统总入口，包含路由逻辑和全局布局
 * - components/: 通用组件（Sidebar 侧边栏、Header 顶部栏）
 * - pages/: 业务页面组件
 * - style.css: 合并的全局样式
 */

import './style.css';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import type {
  KeyDesc,
  DataDesc,
  ConfigItem,
  Action,
  EventItem,
  AxureProps,
  AxureHandle,
} from '../../common/axure-types';
import { safeEmitEvent } from '../../common/axure-types';

// 导入共享组件
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 导入页面组件
import SourceControl from './pages/SourceControl';
import MonitorWarning from './pages/MonitorWarning';
import EmergencyResponse from './pages/EmergencyResponse';
import ReviewSummary from './pages/ReviewSummary';
import Toolbox from './pages/Toolbox';

// ============ 类型定义 ============

type PageKey = 'source' | 'monitor' | 'emergency' | 'review' | 'toolbox';

// ============ 主组件 ============

const GovControlPlatform = forwardRef<AxureHandle, AxureProps>((props, ref) => {
  const { onEvent } = props;

  // ============ 状态管理 ============

  // 当前选中的菜单项（页面）
  const [activePage, setActivePage] = useState<PageKey>('source');

  // ============ 事件处理 ============

  const handleMenuSelect = (key: string) => {
    setActivePage(key as PageKey);
    safeEmitEvent(onEvent, 'onMenuSelect', key);
  };

  // ============ Axure Handle ============

  useImperativeHandle(
    ref,
    function () {
      return {
        getVar: function (name: string) {
          switch (name) {
            case 'selected_menu':
              return activePage;
            default:
              return undefined;
          }
        },
        fireAction: function (name: string, params?: string) {
          if (name === 'setPage' && params) {
            setActivePage(params as PageKey);
          }
        },
        eventList: [
          { name: 'onMenuSelect', desc: '点击侧边菜单项时触发', payload: '菜单 key' },
        ] as EventItem[],
        actionList: [
          { name: 'setPage', desc: '切换到指定页面', params: '页面 key (source/monitor/emergency/review/toolbox)' },
        ] as Action[],
        varList: [
          { name: 'selected_menu', desc: '当前选中的菜单项 key' },
        ] as KeyDesc[],
        configList: [] as ConfigItem[],
        dataList: [] as DataDesc[],
      };
    },
    [activePage, onEvent]
  );

  // ============ 渲染当前页面 ============

  const renderPage = () => {
    switch (activePage) {
      case 'source':
        return <SourceControl />;
      case 'monitor':
        return <MonitorWarning />;
      case 'emergency':
        return <EmergencyResponse />;
      case 'review':
        return <ReviewSummary />;
      case 'toolbox':
        return <Toolbox />;
      default:
        return <SourceControl />;
    }
  };

  // ============ 渲染 ============

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#5c7cff',
          borderRadius: 4,
        },
      }}
    >
      <div className="gov-layout">
        {/* 顶部栏 - 现在位于最顶层 */}
        <Header />

        <div className="gov-container">
          {/* 侧边栏 - 现在位于顶部栏下方 */}
          <Sidebar
            activeKey={activePage}
            onSelect={handleMenuSelect}
          />

          {/* 主内容区 */}
          <div className="gov-main">
            {/* 页面内容 */}
            <div className="gov-content">
              {renderPage()}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
});

GovControlPlatform.displayName = 'GovControlPlatform';

export default GovControlPlatform;
