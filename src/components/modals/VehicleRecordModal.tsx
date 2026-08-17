import React from 'react';
import { X, Car, ShieldAlert, AlertTriangle, Clock, Hash, Gauge, CheckCircle2, History } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeverityBadgeClass } from '../../utils/helpers';

export const VehicleRecordModal: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, incidents, seekVideo, setCurrentRoute } = useApp();

  if (!selectedVehicle) return null;

  const vehicleIncidents = incidents.filter(
    (i) =>
      i.vehicleId === selectedVehicle.vehicleId ||
      i.numberPlate === selectedVehicle.numberPlate
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header & Demo Badge */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-sky-950 border border-sky-600 text-sky-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  <span>Vehicle Forensic Profile</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedVehicle.vehicleId}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Tracking ID: {selectedVehicle.trackingId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-mono font-bold tracking-wider">
              DEMO DATA / SIMULATED RECORD
            </span>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* License Plate Banner */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Registered License Plate</div>
            <div className="inline-block bg-amber-100 text-slate-950 border-2 border-slate-900 rounded px-4 py-1.5 font-mono font-black text-xl tracking-widest mt-1">
              {selectedVehicle.numberPlate}
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400">STATUS</div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${
                selectedVehicle.status === 'Clean'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500'
                  : 'bg-amber-950 text-amber-300 border border-amber-500'
              }`}
            >
              {selectedVehicle.status}
            </span>
          </div>
        </div>

        {/* Vehicle Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">VEHICLE TYPE</div>
            <div className="text-slate-200 font-bold mt-0.5">{selectedVehicle.vehicleType}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">MAKE & MODEL</div>
            <div className="text-slate-200 font-bold mt-0.5">{selectedVehicle.makeModel}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">COLOR</div>
            <div className="text-slate-200 font-bold mt-0.5">{selectedVehicle.color}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">FIRST DETECTED</div>
            <div className="text-slate-300 mt-0.5 text-[11px]">{selectedVehicle.firstDetected}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">LAST SEEN</div>
            <div className="text-slate-300 mt-0.5 text-[11px]">{selectedVehicle.lastSeen}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">RECENT CALIBRATED SPEED</div>
            <div className="text-amber-400 font-bold mt-0.5">{selectedVehicle.recentSpeed} km/h</div>
          </div>
        </div>

        {/* Associated Incidents Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Associated Violation Incidents ({vehicleIncidents.length})
            </h4>
          </div>

          {vehicleIncidents.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400 font-mono">
              No recorded traffic violations for this vehicle.
            </div>
          ) : (
            <div className="space-y-2">
              {vehicleIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{inc.title}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border ${getSeverityBadgeClass(
                          inc.severity
                        )}`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {inc.timestamp} | Camera: {inc.camera} ({inc.location})
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      seekVideo(inc.videoTimestampSec);
                      setSelectedVehicle(null);
                      setCurrentRoute('live-monitoring');
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    Jump to Video →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[10px] text-slate-400 font-mono">
            Total Detections Logged: <strong>{selectedVehicle.totalDetections}</strong>
          </div>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
