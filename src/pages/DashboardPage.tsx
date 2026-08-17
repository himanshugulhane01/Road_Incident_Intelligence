import React from 'react';
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
import { DetectionFilterBar } from '../components/video/DetectionFilterBar';
import { DetectionTimeline } from '../components/video/DetectionTimeline';
import { GradientWaves } from '../components/ui/GradientWaves';

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
  <div
    onClick={() => setRoute(route)}
    className="metric-card p-4 md:p-5 rounded-xl cursor-pointer bg-[#FFFFFF] border border-[#CFCDC4] transition-all hover:-translate-y-1 hover:border-[#161616]"
    style={{
      minHeight: 110,
    }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="data-label font-mono-tech text-[10px] text-[#55534E]">{title}</span>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#161616] text-[#FF5722]"
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
    </div>
    <div className="font-display text-3xl md:text-4xl tracking-wider text-[#141414] my-1">
      {value}
    </div>
    <div className="flex items-center justify-between mt-2">
      <span className="text-[11px] font-mono-tech text-[#55534E]">{sub}</span>
      <ArrowRight className="w-3.5 h-3.5 text-[#161616]" />
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
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
      {/* Command Banner */}
      <div
        className="dark-card-orange-glow rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden bg-[#161616] text-[#F4F4F0] border border-[#2B2B2B]"
      >
        {/* Background 3D WebGL Gradient Waves Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <GradientWaves
            horizonColor="#FF7043"
            waveColor="#FF5722"
            crestColor="#FFFFFF"
            speed={0.3}
            amplitude={2.0}
            waveScale={0.5}
            waveRatio={0.8}
            swell={25}
            turbulence={15}
            tilt={1.05}
            zoom={1.1}
            height={5.0}
            fogDepth={12}
            detail="medium"
            brightness={1.0}
            opacity={0.6}
            mouseInteraction={true}
            parallaxStrength={0.3}
            grain={true}
            grainIntensity={0.03}
          />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-[#FF5722] text-white"
          >
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-display tracking-wide text-white">
                ROADGUARD AI — CENTRAL COMMAND
              </h1>
              <span className="badge-ok font-mono-tech">
                ● ONLINE
              </span>
            </div>
            <p className="text-xs font-mono-tech text-[#A1A1AA] mt-1 tracking-wider">
              LIVE VIDEO FORENSICS // OCR PLATE IDENTIFICATION // TELEMETRY PIPELINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button onClick={() => setCurrentRoute('report-incident')} className="btn-koyeb-orange">
            <PenSquare className="w-4 h-4" />
            <span>▸ REPORT INCIDENT</span>
          </button>
          <button
            onClick={() => setCurrentRoute('live-monitoring')}
            className="btn-koyeb-dark border border-[#333333]"
          >
            <span>▸ LIVE MONITOR</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricCards.map((card, idx) => (
          <KineticMetricCard key={idx} {...card} setRoute={setCurrentRoute} />
        ))}
      </div>

      {/* Main 2-column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: Live Feed + Controls */}
        <div className="xl:col-span-2 space-y-4">
          {/* Section header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] animate-pulse" />
              <h2
                className="text-2xl font-display tracking-wide text-[#141414]"
              >
                PRIMARY CCTV TACTICAL FEED
              </h2>
            </div>
            <span className="text-xs font-mono-tech text-[#55534E]">
              NEURAL ENGINE: <span className="text-[#FF5722] bg-[#161616] px-1.5 py-0.5 rounded font-bold">ONLINE</span>
            </span>
          </div>

          <VideoPlayer />
          <DetectionFilterBar />
          <DetectionTimeline />
        </div>

        {/* RIGHT: Intelligence Panels */}
        <div className="space-y-6">
          {/* Active Incidents Panel */}
          <div className="light-card rounded-2xl overflow-hidden p-2">
            <div
              className="px-4 py-3 flex items-center justify-between bg-[#161616] text-[#FFFFFF] rounded-xl mb-2"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#FF5722]" />
                <h3
                  className="text-lg font-display tracking-wider text-white"
                >
                  ACTIVE PRIORITY INCIDENTS
                </h3>
              </div>
              <button
                onClick={() => setCurrentRoute('incidents')}
                className="text-xs font-mono-tech text-[#FF5722] hover:underline"
              >
                ▸ ALL ({incidents.length})
              </button>
            </div>

            <div className="p-1 space-y-2 max-h-72 overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="py-8 text-center font-mono-tech text-xs text-[#55534E]">
                  NO ACTIVE INCIDENTS DETECTED.
                </div>
              ) : (
                incidents.slice(0, 5).map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="p-3.5 rounded-xl cursor-pointer transition-all hover:translate-x-1 bg-[#FFFFFF] border border-[#CFCDC4]"
                    style={{
                      borderLeft: `4px solid ${getSeverityColor(inc.severity)}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold font-mono-tech text-[#141414]">
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
                    <div className="flex items-center justify-between font-mono-tech text-[11px]">
                      <span className="text-[#55534E]">
                        {inc.camera}
                      </span>
                      {inc.numberPlate && (
                        <span className="font-bold text-[#141414] bg-[#DFDDD5] px-1.5 py-0.5 rounded">
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
          <div className="light-card rounded-2xl overflow-hidden p-2">
            <div
              className="px-4 py-3 flex items-center justify-between bg-[#161616] text-[#FFFFFF] rounded-xl mb-2"
            >
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-[#FF5722]" />
                <h3
                  className="text-lg font-display tracking-wider text-white"
                >
                  CAMERA NETWORK
                </h3>
              </div>
              <button
                onClick={() => setCurrentRoute('cameras')}
                className="text-xs font-mono-tech text-[#FF5722] hover:underline"
              >
                ▸ MANAGE
              </button>
            </div>

            <div className="p-1 grid grid-cols-2 gap-2">
              {cameras.map((cam) => (
                <div
                  key={cam.id}
                  className="p-3 rounded-xl bg-[#FFFFFF] border border-[#CFCDC4] transition-all hover:border-[#161616]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech font-bold text-xs text-[#141414]">
                      {cam.id}
                    </span>
                    <span
                      className={cam.status === 'ONLINE' ? 'badge-ok' : 'badge-critical'}
                      style={{ fontSize: 9, padding: '2px 5px' }}
                    >
                      {cam.status === 'ONLINE' ? '● ON' : '● OFF'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#55534E] font-medium truncate">
                    {cam.location}
                  </div>
                  <div className="font-mono-tech text-[10px] text-[#141414] font-bold mt-1">
                    {cam.totalDetectionsToday} DETECTIONS
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
