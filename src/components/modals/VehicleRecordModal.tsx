import React, { useEffect } from 'react';
import { X, Car, AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSeverityBadgeClass } from '../../utils/helpers';

export const VehicleRecordModal: React.FC = () => {
  const { selectedVehicle, setSelectedVehicle, incidents, seekVideo, setCurrentRoute } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedVehicle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedVehicle]);

  if (!selectedVehicle) return null;

  const vehicleIncidents = incidents.filter(
    (i) =>
      i.vehicleId === selectedVehicle.vehicleId ||
      i.numberPlate === selectedVehicle.numberPlate
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedVehicle(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 select-none animate-fadeIn"
    >
      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-2xl w-full p-6 text-[#0F172A] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header & Demo Badge */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] hover:bg-[#EA580C] hover:text-white transition-all cursor-pointer mr-1"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="p-2.5 rounded-2xl bg-[#FFF0E6] border border-[#EA580C]/30 text-[#EA580C]">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#0F172A] flex items-center gap-2">
                  <span>Vehicle Forensic Profile</span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-xl bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                    {selectedVehicle.vehicleId}
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  Tracking ID: {selectedVehicle.trackingId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-[10px] font-mono font-extrabold tracking-wider">
              VERIFIED RECORD
            </span>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* License Plate Banner */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase font-bold">Registered License Plate</div>
            <div className="inline-block bg-[#FACC15] text-[#0F172A] border-2 border-[#0F172A] rounded-xl px-4 py-1.5 font-mono font-black text-xl tracking-widest mt-1 shadow-xs">
              {selectedVehicle.numberPlate}
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-[#64748B] font-bold">STATUS</div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold mt-1 ${
                selectedVehicle.status === 'Clean'
                  ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30'
                  : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
              }`}
            >
              {selectedVehicle.status}
            </span>
          </div>
        </div>

        {/* Vehicle Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">VEHICLE TYPE</div>
            <div className="text-[#0F172A] font-bold mt-0.5">{selectedVehicle.vehicleType}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">MAKE & MODEL</div>
            <div className="text-[#0F172A] font-bold mt-0.5">{selectedVehicle.makeModel}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">COLOR</div>
            <div className="text-[#0F172A] font-bold mt-0.5">{selectedVehicle.color}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">FIRST DETECTED</div>
            <div className="text-[#334155] mt-0.5 text-[11px] font-semibold">{selectedVehicle.firstDetected}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">LAST SEEN</div>
            <div className="text-[#334155] mt-0.5 text-[11px] font-semibold">{selectedVehicle.lastSeen}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">RECENT CALIBRATED SPEED</div>
            <div className="text-[#EA580C] font-black mt-0.5">{selectedVehicle.recentSpeed} km/h</div>
          </div>
        </div>

        {/* Associated Incidents Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C]" />
              Associated Violation Incidents ({vehicleIncidents.length})
            </h4>
          </div>

          {vehicleIncidents.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs text-[#64748B] font-mono">
              No recorded traffic violations for this vehicle.
            </div>
          ) : (
            <div className="space-y-2">
              {vehicleIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{inc.title}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getSeverityBadgeClass(
                          inc.severity
                        )}`}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-[#64748B] text-[11px]">
                      {inc.timestamp} | Camera: {inc.camera} ({inc.location})
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      seekVideo(inc.videoTimestampSec);
                      setSelectedVehicle(null);
                      setCurrentRoute('live-monitoring');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Jump to Video →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <div className="text-xs text-[#64748B] font-mono">
            Total Detections Logged: <strong className="text-[#0F172A]">{selectedVehicle.totalDetections}</strong>
          </div>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
