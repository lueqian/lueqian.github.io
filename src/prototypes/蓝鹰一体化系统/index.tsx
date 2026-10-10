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
import ClientLedgerQuickEntry from './pages/ClientLedgerQuickEntry';
import ClientWorkbench from './pages/ClientWorkbench';
import ScenarioDirectProvincial from './pages/ScenarioDirectProvincial';
import ScenarioCityAudit from './pages/ScenarioCityAudit';
import ScenarioCrossTenantInstruction from './pages/ScenarioCrossTenantInstruction';
import ScenarioSecondaryDispatch from './pages/ScenarioSecondaryDispatch';
import ScenarioCrossTenantConfig from './pages/ScenarioCrossTenantConfig';
import ScenarioLayout from './components/ScenarioLayout';
import { AnnotationProvider, AnnotationBoard } from '@/common/Annotation';

export type PageKey =
  | 'scenario-direct-provincial'
  | 'scenario-city-audit'
  | 'scenario-cross-tenant-instruction'
  | 'scenario-secondary-dispatch'
  | 'scenario-cross-tenant-config'
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
  | 'link-collection'
  | 'client-ledger-entry';

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
  const [activePage, setActivePage] = useState<PageKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      if (page) {
        return page as PageKey;
      }
      if (params.has('taskId')) {
        return 'client-ledger-entry';
      }
    }
    return 'scenario-direct-provincial';
  });
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
      case 'scenario-direct-provincial':
        return (
          <ScenarioLayout scenarioKey="scenario-direct-provincial">
            <ScenarioDirectProvincial />
          </ScenarioLayout>
        );
      case 'scenario-city-audit':
        return (
          <ScenarioLayout scenarioKey="scenario-city-audit">
            <ScenarioCityAudit />
          </ScenarioLayout>
        );
      case 'scenario-cross-tenant-instruction':
        return (
          <ScenarioLayout scenarioKey="scenario-cross-tenant-instruction">
            <ScenarioCrossTenantInstruction />
          </ScenarioLayout>
        );
      case 'scenario-secondary-dispatch':
        return (
          <ScenarioLayout scenarioKey="scenario-secondary-dispatch">
            <ScenarioSecondaryDispatch />
          </ScenarioLayout>
        );
      case 'scenario-cross-tenant-config':
        return (
          <ScenarioLayout scenarioKey="scenario-cross-tenant-config">
            <ScenarioCrossTenantConfig />
          </ScenarioLayout>
        );
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
      case 'client-ledger-entry':
        return (
          <ClientWorkbench
            onNavigateToTask={() => setActivePage('source-control-cq')}
            onOpenSystem={() => setActivePage('police-opinion-joint')}
          />
        );
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
      <AnnotationProvider>
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
            <div
              className={`content-area ${sidebarCollapsed ? 'collapsed' : ''} ${
                activePage.endsWith('data-screen') ? 'screen-content' : ''
              } ${activePage.startsWith('scenario-') ? 'scenario-content' : ''}`}
            >
              {renderPage()}
            </div>
          </div>
        </div>

        {/* 今日值班表 (Duty Roster Modal) */}
        <DutyRosterModal
          open={dutyRosterOpen}
          onClose={() => setDutyRosterOpen(false)}
        />

        {/* AxHub 全局功能与细节批注看板（场景页面已由右侧抽屉统一接管） */}
        {!activePage.startsWith('scenario-') && <AnnotationBoard />}
      </AnnotationProvider>
    </ConfigProvider>
  );
});

export default BlueEagleIntegratedSystem;
