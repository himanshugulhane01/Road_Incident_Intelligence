import React from 'react';
import { X, AlertTriangle, CheckCircle2, Clock, Camera, Car, ShieldAlert, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950 border border-amber-600 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>Incident Case File</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedIncident.id}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Logged: {selectedIncident.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded border uppercase font-bold ${getSeverityBadgeClass(
                selectedIncident.severity
              )}`}
            >
              {selectedIncident.severity}
            </span>
            <button
              onClick={() => setSelectedIncident(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
          <div className="font-bold text-slate-100 text-base">{selectedIncident.title}</div>
          <div className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedIncident.description}
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">SOURCE CAMERA</div>
            <div className="text-slate-200 font-bold mt-0.5">
              {selectedIncident.camera} ({selectedIncident.location})
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">AI CONFIDENCE SCORE</div>
            <div className="text-sky-400 font-bold mt-0.5">
              {selectedIncident.confidence.toFixed(1)}%
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">LINKED VEHICLE</div>
            <div className="text-slate-200 font-bold mt-0.5">
              {selectedIncident.numberPlate ? (
                <button
                  onClick={handleOpenVehicle}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  {selectedIncident.numberPlate} <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                'Unregistered / N/A'
              )}
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">TRACKING OBJECT ID</div>
            <div className="text-sky-400 font-bold mt-0.5">
              {selectedIncident.trackingId || 'TRK-AUTO-01'}
            </div>
          </div>
        </div>

        {/* Workflow Status Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Review Status Workflow
          </label>
          <div className="grid grid-cols-4 gap-2">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => updateIncidentStatus(selectedIncident.id, st)}
                className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                  selectedIncident.status === st
                    ? 'bg-sky-600 border-sky-400 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              seekVideo(selectedIncident.videoTimestampSec);
              setSelectedIncident(null);
              setCurrentRoute('live-monitoring');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-mono transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Seek Video Playback</span>
          </button>

          <button
            onClick={() => setSelectedIncident(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
