import React, { useState } from 'react';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { DetectionFilterBar } from '../components/video/DetectionFilterBar';
import { DetectionTimeline } from '../components/video/DetectionTimeline';
import { OCRInspectionPanel } from '../components/video/OCRInspectionPanel';
import { VideoUploadModal } from '../components/video/VideoUploadModal';
import { AlertSidebar } from '../components/layout/AlertSidebar';
import { useApp } from '../context/AppContext';
import { Video, Activity, Zap } from 'lucide-react';

const getSeverityStyle = (sev: string): React.CSSProperties => {
  if (sev === 'CRITICAL') return { background: '#FFEBEE', color: '#E53935', border: '1px solid rgba(229,57,53,0.3)' };
  if (sev === 'HIGH') return { background: '#FFF0E6', color: '#FF5722', border: '1px solid rgba(255,87,34,0.3)' };
  if (sev === 'MEDIUM') return { background: '#FFF3E0', color: '#E65100', border: '1px solid rgba(230,81,0,0.3)' };
  return { background: '#F6F4F0', color: '#78716C', border: '1px solid #E6E3DD' };
};

export const LiveMonitoringPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const { activeDetections, isAnalysisActive, setSelectedVehicle, vehicles, activeFilters } = useApp();

  return (
    <div className="flex flex-col lg:flex-row h-full gap-5 select-none">
      {/* Main Monitoring Section */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Header Banner */}
        <div
          className="glass-panel rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
            border: '1px solid rgba(255, 87, 34, 0.15)',
            boxShadow: '0 10px 30px -4px rgba(255, 87, 34, 0.1)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)' }}>
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold flex items-center gap-2.5"
                style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <span>Live CCTV & AI Perception Feed</span>
                <span className="badge-info font-bold">REAL-TIME</span>
              </h1>
              <p className="text-xs mt-0.5 font-semibold" style={{ color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Bounding box projections · OCR extraction · Multi-class violation detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl" style={{ background: '#FFF0E6', border: '1px solid rgba(255,87,34,0.2)' }}>
            <Zap className="w-4 h-4" style={{ color: isAnalysisActive ? '#0284C7' : '#FF5722' }} />
            <span className="text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: isAnalysisActive ? '#0284C7' : '#FF5722' }}>
              {isAnalysisActive ? 'NEURAL ENGINE: ACTIVE' : 'SIMULATION MODE (YOLO-Ready)'}
            </span>
          </div>
        </div>

        {/* Video Player Stage */}
        <VideoPlayer onOpenUploadModal={() => setIsUploadModalOpen(true)} />

        {/* Filter Bar */}
        <DetectionFilterBar />

        {/* Dual Panel: OCR + Active Detections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OCRInspectionPanel />

          {/* Active Frame Detections */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 section-divider mb-3">
              <div className="flex items-center gap-2.5">
                <Activity className="w-4.5 h-4.5" style={{ color: '#0284C7' }} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Active Frame Detections
                </h3>
                <span className="badge-info font-bold" style={{ fontSize: 10 }}>{activeDetections.length}</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#78716C', fontWeight: 600 }}>
                {activeFilters.join(', ')}
              </span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-52">
              {activeDetections.length === 0 ? (
                <div className="py-8 text-center font-medium" style={{ fontSize: 12, color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Scanning active frame... No bounding boxes in current window.
                </div>
              ) : (
                activeDetections.map((det) => (
                  <div
                    key={det.id}
                    className="p-3 rounded-2xl flex items-center justify-between transition-all"
                    style={{ background: '#F6F4F0', border: '1px solid #E6E3DD' }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs" style={{ color: '#1C1917' }}>
                          {det.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                          style={{ fontFamily: "'JetBrains Mono', monospace", ...getSeverityStyle(det.severity) }}>
                          {det.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#78716C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                        TRK: {det.trackingId || 'N/A'} · CONF: <span style={{ color: '#0284C7', fontWeight: 700 }}>{det.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                    {det.numberPlate && (
                      <button
                        onClick={() => {
                          const match = vehicles.find((v) => v.numberPlate === det.numberPlate);
                          if (match) setSelectedVehicle(match);
                        }}
                        className="btn-ghost"
                        style={{ padding: '4px 10px', fontSize: 11 }}
                      >
                        View
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-3 section-divider mt-3">
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#78716C', fontWeight: 600 }}>
                Temporal Res: 30 FPS
              </span>
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#0284C7', fontWeight: 700 }}>
                Calibrated Perception Matrix
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <DetectionTimeline />
      </div>

      {/* Persistent Alert Sidebar */}
      <div className="hidden lg:block h-[calc(100vh-6rem)]">
        <AlertSidebar collapsible />
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
};
