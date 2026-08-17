/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { NumberPlatesPage } from './pages/NumberPlatesPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { PersonsPage } from './pages/PersonsPage';
import { AlertsPage } from './pages/AlertsPage';
import { HistoryPage } from './pages/HistoryPage';
import { CamerasPage } from './pages/CamerasPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { VehicleRecordModal } from './components/modals/VehicleRecordModal';
import { PersonRecordModal } from './components/modals/PersonRecordModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { IncidentDetailModal } from './components/modals/IncidentDetailModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  if (currentRoute === 'landing') {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'live-monitoring':
        return <LiveMonitoringPage />;
      case 'video-analysis':
        return <VideoAnalysisPage />;
      case 'number-plates':
        return <NumberPlatesPage />;
      case 'incidents':
        return <IncidentsPage />;
      case 'vehicles':
        return <VehiclesPage />;
      case 'persons':
        return <PersonsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'history':
        return <HistoryPage />;
      case 'cameras':
        return <CamerasPage />;
      case 'settings':
        return <SettingsPage />;
      case 'report-incident':
        return <ReportIncidentPage />;
      default:
        return <DashboardPage />;
    }
  };
  return (
    <div className="flex h-screen w-screen overflow-hidden text-[#0F172A] font-body bg-grain-light bg-grid-lines-light antialiased">
      {/* Primary Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 bg-grain-light bg-grid-lines-light">
          <div className="max-w-[1760px] mx-auto w-full">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Global Forensic & Auth Modals */}
      <VehicleRecordModal />
      <PersonRecordModal />
      <GlobalSearchModal />
      <IncidentDetailModal />
      <EditProfileModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
