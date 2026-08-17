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
    <div className="flex flex-col lg:flex-row h-full gap-6 select-none items-start">
      {/* Main Monitoring Section */}
      <div className="flex-1 space-y-5 overflow-y-auto w-full min-w-0">
        {/* Header Banner */}
        <div className="light-card rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 border border-[#CBD5E1] bg-white shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs bg-[#0F172A] text-[#EA580C] shrink-0">
              <Video className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2.5 text-[#0F172A] leading-tight">
                <span>Live CCTV & AI Perception Feed</span>
                <span className="badge-info font-bold text-[10px]">REAL-TIME</span>
              </h1>
              <p className="text-xs mt-0.5 font-medium text-[#475569]">
                Bounding box projections · OCR extraction · Multi-class violation detection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
            <Zap className="w-4 h-4 text-[#EA580C]" />
            <span className="text-xs font-bold font-mono-tech text-[#0F172A]">
              {isAnalysisActive ? 'NEURAL ENGINE: ONLINE' : 'SIMULATION MODE (YOLO-Ready)'}
            </span>
          </div>
        </div>

        {/* Video Player Stage */}
        <VideoPlayer onOpenUploadModal={() => setIsUploadModalOpen(true)} />

        {/* Filter Bar */}
        <DetectionFilterBar />

        {/* Dual Panel: OCR Inspection + Active Frame Detections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <OCRInspectionPanel />

          {/* Active Frame Detections */}
          <div className="light-card rounded-2xl p-4 flex flex-col justify-between select-none border border-[#CBD5E1] bg-white shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="text-xs font-bold font-mono-tech uppercase tracking-wide text-[#0F172A]">
                    Active Frame Detections
                  </h3>
                  <span className="badge-info font-bold text-[10px]">{activeDetections.length}</span>
                </div>
                <span className="text-xs font-mono-tech text-[#64748B] font-semibold">
                  {activeFilters.join(', ')}
                </span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto">
                {activeDetections.length === 0 ? (
                  <div className="py-8 text-center text-xs font-medium text-[#64748B]">
                    Scanning active frame... No bounding boxes in current window.
                  </div>
                ) : (
                  activeDetections.map((det) => (
                    <div
                      key={det.id}
                      className="p-3 rounded-xl flex items-center justify-between transition-all bg-[#F8FAFC] border border-[#E2E8F0]"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-[#0F172A]">
                            {det.label}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech badge-warning">
                            {det.severity}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-tech text-[#475569] font-medium">
                          TRK: {det.trackingId || 'N/A'} · CONF: <span className="text-[#0284C7] font-bold">{det.confidence.toFixed(1)}%</span>
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
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] mt-3 text-xs font-mono-tech font-semibold text-[#64748B]">
              <span>Temporal Res: 30 FPS</span>
              <span className="text-[#0284C7] font-bold">Calibrated Perception</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <DetectionTimeline />
      </div>

      {/* Persistent Alert Sidebar */}
      <div className="hidden lg:block h-[calc(100vh-6.5rem)] w-80 shrink-0 overflow-y-auto sticky top-0">
        <AlertSidebar collapsible />
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  );
};
