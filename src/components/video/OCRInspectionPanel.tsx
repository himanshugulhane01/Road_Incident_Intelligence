import React from 'react';
import { CreditCard, CheckCircle2, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OCRInspectionPanel: React.FC = () => {
  const { latestOcrDetection, setSelectedVehicle, vehicles } = useApp();

  const handleOpenVehicle = () => {
    if (!latestOcrDetection) return;
    const match = vehicles.find(
      (v) =>
        v.numberPlate === latestOcrDetection.numberPlate ||
        v.vehicleId === latestOcrDetection.vehicleId
    );
    if (match) setSelectedVehicle(match);
  };

  const plateText = latestOcrDetection?.numberPlate || 'MH27AB1234';
  const confidence = latestOcrDetection?.ocrConfidence || 97.4;
  const vehicleType = latestOcrDetection?.vehicleType || 'Motorcycle';
  const trackingId = latestOcrDetection?.trackingId || 'TRK-00821';
  const timeStr = latestOcrDetection?.timeFormatted || '00:04';

  return (
    <div
      id="ocr-inspection-panel"
      className="light-card rounded-2xl p-4 flex flex-col justify-between select-none border border-[#CBD5E1] bg-white shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#EA580C]" />
          <span className="text-xs font-bold font-mono-tech uppercase tracking-wide text-[#0F172A]">
            OCR License Plate Engine
          </span>
        </div>
        <span className="badge-warning font-bold text-[10px]">OCR ENGINE</span>
      </div>

      {/* Plate Display */}
      <div className="my-2.5 text-center">
        <div className="inline-block relative px-6 py-2.5 rounded-lg font-bold text-xl tracking-widest shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)',
            color: '#0F172A',
            border: '2px solid #0F172A',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
          }}>
          <div className="absolute top-1 left-2 text-[8px] font-black text-[#1E3A8A] tracking-wider">IND</div>
          <div className="text-[#0F172A] font-extrabold">{plateText}</div>
        </div>
        <div className="mt-1.5 text-[11px] font-medium text-[#475569]">
          Standard High-Security Registration Plate (HSRP)
        </div>
      </div>

      {/* Telemetry Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'OCR CONFIDENCE', value: `${confidence.toFixed(1)}%`, color: '#15803D' },
          { label: 'VEHICLE TYPE', value: vehicleType, color: '#0F172A' },
          { label: 'TRACKING ID', value: trackingId, color: '#0F172A' },
          { label: 'DETECTION TIME', value: timeStr, color: '#334155' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
          >
            <div className="data-label text-[10px] font-bold text-[#64748B]">{stat.label}</div>
            <div className="data-value font-bold text-xs mt-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Matched in Database</span>
        </div>
        <button
          id="ocr-view-vehicle-record-btn"
          onClick={handleOpenVehicle}
          className="flex items-center gap-1.5 btn-ghost"
          style={{ padding: '5px 12px', fontSize: 11 }}
        >
          <span>View Record</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
