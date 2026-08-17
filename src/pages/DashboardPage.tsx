import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CreditCard,
  BellRing,
  Car,
  AlertTriangle,
  Camera,
  ArrowRight,
  Cpu,
  PenSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoUploadModal } from '../components/video/VideoUploadModal';
import { DetectionFilterBar } from '../components/video/DetectionFilterBar';
import { DetectionTimeline } from '../components/video/DetectionTimeline';
import { GradientWaves } from '../components/ui/GradientWaves';
import { ThreeDTiltCard } from '../components/ui/ThreeDTiltCard';

const KineticMetricCard: React.FC<{
  title: string;
  value: string;
  sub: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  cardClass: string;
  route: string;
  setRoute: (r: string) => void;
}> = ({ title, value, sub, icon: Icon, accentColor, route, setRoute }) => (
  <ThreeDTiltCard onClick={() => setRoute(route)} maxTilt={10}>
    <div
      className="metric-card p-4 md:p-5 rounded-xl cursor-pointer bg-[#FFFFFF] border border-[#CBD5E1] transition-all hover:border-[#0F172A]"
      style={{
        minHeight: 110,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="data-label font-sans text-xs font-semibold text-[#334155]">{title}</span>
        <div
          className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-[#0F172A] text-[#EA580C]"
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] my-1">
        {value}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-medium text-[#475569]">{sub}</span>
        <ArrowRight className="w-4 h-4 text-[#EA580C]" />
      </div>
    </div>
  </ThreeDTiltCard>
);

export const DashboardPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const {
    stats,
    setCurrentRoute,
    incidents,
    cameras,
    setSelectedIncident,
  } = useApp();

  const metricCards = [
    {
      title: 'TOTAL DETECTIONS',
      value: stats.totalDetections.toString(),
      sub: 'All Recorded',
      icon: Activity,
      accentColor: '#FF5722',
      cardClass: 'metric-card-info',
      route: 'history',
    },
    {
      title: 'ACTIVE INCIDENTS',
      value: stats.activeIncidents.toString().padStart(2, '0'),
      sub: 'Requiring Action',
      icon: AlertTriangle,
      accentColor: '#FF4D4D',
      cardClass: 'metric-card-warning',
      route: 'incidents',
    },
    {
      title: 'NUMBER PLATES',
      value: stats.numberPlatesDetected.toString(),
      sub: 'Linked to Incidents',
      icon: CreditCard,
      accentColor: '#FF5722',
      cardClass: 'metric-card-primary',
      route: 'number-plates',
    },
    {
      title: 'ALERTS GENERATED',
      value: stats.alertsGenerated.toString(),
      sub: 'Real-time Feed',
      icon: BellRing,
      accentColor: '#FF4D4D',
      cardClass: 'metric-card-error',
      route: 'alerts',
    },
    {
      title: 'HIGH PRIORITY',
      value: stats.highPriorityIncidents.toString().padStart(2, '0'),
      sub: 'Critical / High',
      icon: ShieldAlert,
      accentColor: '#F59E0B',
      cardClass: 'metric-card-rose',
      route: 'incidents',
    },
  ];

  const getSeverityColor = (sev: string) => {
    if (sev === 'CRITICAL') return '#FF4D4D';
    if (sev === 'HIGH') return '#F59E0B';
    if (sev === 'MEDIUM') return '#0284C7';
    return '#55534E';
  };

  return (
    <div className="space-y-6 select-none">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => (
          <KineticMetricCard key={idx} {...card} setRoute={setCurrentRoute} />
        ))}
      </div>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* LEFT: Primary Tactical Feed, Filters & Timeline */}
        <div className="xl:col-span-2 space-y-5">
          {/* Tactical Feed Header */}
          <div className="flex items-center justify-between px-1 py-0.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
              <h2 className="text-xl font-bold font-display tracking-tight text-[#0F172A]">
                PRIMARY CCTV TACTICAL FEED
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
              <span>NEURAL ENGINE:</span>
              <span className="text-white bg-[#0F172A] px-2 py-0.5 rounded-md font-bold text-[11px]">
                ONLINE
              </span>
            </div>
          </div>

          <VideoPlayer onOpenUploadModal={() => setIsUploadModalOpen(true)} />
          <DetectionFilterBar />
          <DetectionTimeline />
        </div>

        {/* RIGHT: Active Priority Incidents & Camera Network */}
        <div className="space-y-5">
          {/* Active Priority Incidents Panel */}
          <div className="light-card rounded-2xl overflow-hidden p-2.5 border border-[#CBD5E1] bg-white shadow-xs">
            <div className="px-4 py-3 flex items-center justify-between bg-[#0F172A] text-white rounded-xl mb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4.5 h-4.5 text-[#EA580C]" />
                <h3 className="text-sm font-bold font-display tracking-wide text-white">
                  ACTIVE PRIORITY INCIDENTS
                </h3>
              </div>
              <button
                onClick={() => setCurrentRoute('incidents')}
                className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
              >
                ▸ VIEW ALL ({incidents.length})
              </button>
            </div>

            <div className="p-1 space-y-2.5 max-h-[320px] overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="py-8 text-center text-xs font-medium text-[#64748B]">
                  NO ACTIVE INCIDENTS DETECTED.
                </div>
              ) : (
                incidents.slice(0, 5).map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="p-3.5 rounded-xl cursor-pointer transition-all hover:translate-x-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#0F172A]"
                    style={{
                      borderLeft: `4px solid ${getSeverityColor(inc.severity)}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#0F172A]">
                        {inc.title}
                      </span>
                      <span
                        className={
                          inc.severity === 'CRITICAL'
                            ? 'badge-critical'
                            : inc.severity === 'HIGH'
                            ? 'badge-warning'
                            : 'badge-info'
                        }
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#475569]">
                      <span className="font-medium text-[11px]">
                        {inc.camera}
                      </span>
                      {inc.numberPlate && (
                        <span className="font-bold text-[11px] font-mono-tech text-[#0F172A] bg-[#E2E8F0] px-2 py-0.5 rounded">
                          {inc.numberPlate}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Camera Network Panel */}
          <div className="light-card rounded-2xl overflow-hidden p-2.5 border border-[#CBD5E1] bg-white shadow-xs">
            <div className="px-4 py-3 flex items-center justify-between bg-[#0F172A] text-white rounded-xl mb-3">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4.5 h-4.5 text-[#EA580C]" />
                <h3 className="text-sm font-bold font-display tracking-wide text-white">
                  CAMERA NETWORK
                </h3>
              </div>
              <button
                onClick={() => setCurrentRoute('cameras')}
                className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
              >
                ▸ MANAGE
              </button>
            </div>

            <div className="p-1 grid grid-cols-2 gap-2.5">
              {cameras.map((cam) => (
                <div
                  key={cam.id}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] transition-all hover:border-[#0F172A]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech font-bold text-xs text-[#0F172A]">
                      {cam.id}
                    </span>
                    <span
                      className={cam.status === 'ONLINE' ? 'badge-ok' : 'badge-critical'}
                      style={{ fontSize: 10, padding: '2px 6px' }}
                    >
                      {cam.status === 'ONLINE' ? '● ON' : '● OFF'}
                    </span>
                  </div>
                  <div className="text-xs text-[#475569] font-medium truncate">
                    {cam.location}
                  </div>
                  <div className="font-mono-tech text-[10px] text-[#0F172A] font-bold mt-1.5">
                    {cam.totalDetectionsToday} DETECTIONS
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};
