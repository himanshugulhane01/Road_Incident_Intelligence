import React, { useEffect } from 'react';
import { X, AlertTriangle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncidentStatus } from '../../types';
import { getSeverityBadgeClass } from '../../utils/helpers';

export const IncidentDetailModal: React.FC = () => {
  const {
    selectedIncident,
    setSelectedIncident,
    updateIncidentStatus,
    seekVideo,
    setCurrentRoute,
    setSelectedVehicle,
    vehicles,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIncident(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedIncident]);

  if (!selectedIncident) return null;

  const statuses: IncidentStatus[] = ['NEW', 'REVIEWING', 'CONFIRMED', 'RESOLVED'];

  const handleOpenVehicle = () => {
    if (!selectedIncident.vehicleId && !selectedIncident.numberPlate) return;
    const v = vehicles.find(
      (item) =>
        item.vehicleId === selectedIncident.vehicleId ||
        item.numberPlate === selectedIncident.numberPlate
    );
    if (v) {
      setSelectedVehicle(v);
      setSelectedIncident(null);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedIncident(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 select-none animate-fadeIn"
    >
      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-xl w-full p-6 text-[#0F172A] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedIncident(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] hover:bg-[#EA580C] hover:text-white transition-all cursor-pointer mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="p-2.5 rounded-2xl bg-[#FFF0E6] border border-[#EA580C]/30 text-[#EA580C]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0F172A] flex items-center gap-2">
                <span>Incident Case File</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-xl bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                  {selectedIncident.id}
                </span>
              </h3>
              <p className="text-xs text-[#64748B] font-mono">
                Logged: {selectedIncident.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-xl uppercase font-extrabold ${getSeverityBadgeClass(
                selectedIncident.severity
              )}`}
            >
              {selectedIncident.severity}
            </span>
            <button
              onClick={() => setSelectedIncident(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl space-y-1.5 shadow-xs">
          <div className="font-extrabold text-[#0F172A] text-base">{selectedIncident.title}</div>
          <div className="text-xs text-[#57534E] leading-relaxed font-semibold">
            {selectedIncident.description}
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">SOURCE CAMERA</div>
            <div className="text-[#0F172A] font-bold mt-0.5">
              {selectedIncident.camera} ({selectedIncident.location})
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">AI CONFIDENCE SCORE</div>
            <div className="text-[#0284C7] font-black mt-0.5">
              {selectedIncident.confidence.toFixed(1)}%
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">LINKED VEHICLE PLATE</div>
            <div className="text-[#0F172A] font-bold mt-0.5">
              {selectedIncident.numberPlate ? (
                <button
                  onClick={handleOpenVehicle}
                  className="text-[#EA580C] hover:underline flex items-center gap-1 font-bold"
                >
                  {selectedIncident.numberPlate} <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                'Unregistered / N/A'
              )}
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">TRACKING OBJECT ID</div>
            <div className="text-[#0284C7] font-bold mt-0.5">
              {selectedIncident.trackingId || 'TRK-AUTO-01'}
            </div>
          </div>
        </div>

        {/* Workflow Status Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider">
            Review Status Workflow
          </label>
          <div className="grid grid-cols-4 gap-2">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => updateIncidentStatus(selectedIncident.id, st)}
                className={`py-2 rounded-xl text-xs font-mono font-extrabold border transition-all cursor-pointer ${
                  selectedIncident.status === st
                    ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#475569] hover:border-[#0F172A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={() => {
              seekVideo(selectedIncident.videoTimestampSec);
              setSelectedIncident(null);
              setCurrentRoute('live-monitoring');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Clock className="w-4 h-4" />
            <span>Seek Video Playback</span>
          </button>

          <button
            onClick={() => setSelectedIncident(null)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
