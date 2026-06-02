import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import Header from './components/Header';
import Navigation from './components/Navigation';
import SourceControl from './pages/SourceControl';
import MonitorWarning from './pages/MonitorWarning';
import EmergencyResponse from './pages/EmergencyResponse';
import ReviewSummary from './pages/ReviewSummary';
import PersonnelLibrary from './pages/PersonnelLibrary';
import Toolbox from './pages/Toolbox';
import './style.css';

export type PageKey = 'source-control' | 'monitor-warning' | 'emergency-response' | 'review-summary' | 'personnel-library' | 'toolbox';

export interface AxureProps {
  onEvent?: (eventName: string, data?: string) => void;
}

export interface AxureHandle {
  getVar: (name: string) => string | undefined;
  fireAction: (name: string, params?: string) => void;
  eventList: string[];
  actionList: string[];
  varList: string[];
}

const BlueEagleIntegratedSystem = forwardRef<AxureHandle, AxureProps>(function BlueEagleIntegratedSystem(
  { onEvent },
  ref
) {
  const [activePage, setActivePage] = useState<PageKey>('source-control');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleMenuSelect = useCallback((key: string) => {
    setActivePage(key as PageKey);
    if (onEvent) {
      onEvent('onMenuSelect', key);
    }
  }, [onEvent]);

  const renderPage = () => {
    switch (activePage) {
      case 'source-control':
        return <SourceControl />;
      case 'monitor-warning':
        return <MonitorWarning />;
      case 'emergency-response':
        return <EmergencyResponse />;
      case 'review-summary':
        return <ReviewSummary />;
      case 'personnel-library':
        return <PersonnelLibrary />;
      case 'toolbox':
        return <Toolbox />;
      default:
        return <SourceControl />;
    }
  };

  useImperativeHandle(
    ref,
    function () {
      return {
        getVar: function (name: string) {
          if (name === 'selected_menu') return activePage;
          if (name === 'sidebar_collapsed') return String(sidebarCollapsed);
          return undefined;
        },
        fireAction: function (name: string, params?: string) {
          if (name === 'setPage' && params) {
            setActivePage(params as PageKey);
          }
          if (name === 'setSidebarCollapsed') {
            setSidebarCollapsed(params === 'true');
          }
        },
        eventList: ['onMenuSelect'],
        actionList: ['setPage', 'setSidebarCollapsed'],
        varList: ['selected_menu', 'sidebar_collapsed'],
      };
    },
    [activePage, sidebarCollapsed, onEvent]
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <div className="blue-eagle-system">
        <Header />
        <div className="main-container">
          <Navigation
            activeKey={activePage}
            onSelect={handleMenuSelect}
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />
          <div className={`content-area ${sidebarCollapsed ? 'collapsed' : ''}`}>
            {renderPage()}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
});

export default BlueEagleIntegratedSystem;
