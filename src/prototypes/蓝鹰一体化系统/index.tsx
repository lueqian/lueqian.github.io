import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import Header from './components/Header';
import Navigation from './components/Navigation';
import SourceControl from './pages/SourceControl';
import SourceControlCQ from './pages/SourceControlCQ';
import MonitorWarning from './pages/MonitorWarning';
import EmergencyResponse from './pages/EmergencyResponse';
import ReviewSummary from './pages/ReviewSummary';
import Toolbox from './pages/Toolbox';
import PoliceOpinionJoint from './pages/PoliceOpinionJoint';
import PeopleDatabase from './pages/PeopleDatabase';
import StabilityMaintenance from './pages/StabilityMaintenance';
import PublicationsManagement from './pages/PublicationsManagement';
import './style.css';
import './screen-style.css';
import InternetDataScreen from './pages/InternetDataScreen';
import IntranetDataScreen from './pages/IntranetDataScreen';
import ManualReport from './pages/ManualReport';
import DutyRosterModal from './components/DutyRosterModal';
import LinkCollection from './pages/LinkCollection';

export type PageKey =
  | 'police-opinion-joint'
  | 'manual-report'
  | 'source-control'
  | 'source-control-cq'
  | 'monitor-warning'
  | 'emergency-response'
  | 'review-summary'
  | 'toolbox'
  | 'people-database'
  | 'stability-maintenance'
  | 'publications-management'
  | 'internet-data-screen'
  | 'intranet-data-screen'
  | 'link-collection';

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
  const [activePage, setActivePage] = useState<PageKey>('police-opinion-joint');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dutyRosterOpen, setDutyRosterOpen] = useState(false);

  const handleMenuSelect = useCallback((key: string) => {
    setActivePage(key as PageKey);
    if (onEvent) {
      onEvent('onMenuSelect', key);
    }
  }, [onEvent]);

  const renderPage = () => {
    switch (activePage) {
      case 'police-opinion-joint':
        return <PoliceOpinionJoint />;
      case 'manual-report':
        return <ManualReport onBack={() => setActivePage('police-opinion-joint')} />;
      case 'source-control':
        return <SourceControl />;
      case 'source-control-cq':
        return <SourceControlCQ />;
      case 'monitor-warning':
        return <MonitorWarning />;
      case 'emergency-response':
        return <EmergencyResponse />;
      case 'review-summary':
        return <ReviewSummary />;
      case 'toolbox':
        return <Toolbox />;
      case 'people-database':
        return <PeopleDatabase />;
      case 'stability-maintenance':
        return <StabilityMaintenance />;
      case 'publications-management':
        return <PublicationsManagement />;
      case 'internet-data-screen':
        return <InternetDataScreen onNavigate={handleMenuSelect} onSwitch={handleMenuSelect} />;
      case 'intranet-data-screen':
        return <IntranetDataScreen onNavigate={handleMenuSelect} onSwitch={handleMenuSelect} />;
      case 'link-collection':
        return <LinkCollection />;
      default:
        return <PoliceOpinionJoint />;
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
      <div className={`blue-eagle-system ${activePage.endsWith('data-screen') ? 'screen-mode' : ''}`}>
        <Header
          onManualReport={() => setActivePage('manual-report')}
          onOpenDutyRoster={() => setDutyRosterOpen(true)}
        />
        <div className="main-container">
          <Navigation
            activeKey={activePage}
            onSelect={handleMenuSelect}
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />
          <div className={`content-area ${sidebarCollapsed ? 'collapsed' : ''} ${activePage.endsWith('data-screen') ? 'screen-content' : ''}`}>
            {renderPage()}
          </div>
        </div>
      </div>

      {/* 今日值班表 (Duty Roster Modal) */}
      <DutyRosterModal
        open={dutyRosterOpen}
        onClose={() => setDutyRosterOpen(false)}
      />
    </ConfigProvider>
  );
});

export default BlueEagleIntegratedSystem;
