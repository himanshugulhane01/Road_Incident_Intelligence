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
      className="glass-panel rounded-xl p-4 flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 section-divider mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" style={{ color: '#ffab40' }} />
          <span className="text-xs font-bold uppercase" style={{ color: '#dae2fd', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.10em' }}>
            OCR License Plate Engine
          </span>
        </div>
        <span className="badge-warning" style={{ fontSize: 9 }}>SIMULATED OCR</span>
      </div>

      {/* Plate Display */}
      <div className="my-3 text-center">
        <div className="inline-block relative px-6 py-2 rounded-md font-black text-xl tracking-widest shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #f5f0c8 0%, #e8e0a0 100%)',
            color: '#1a1a1a',
            border: '2.5px solid #333',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
          }}>
          <div className="absolute top-1 left-2" style={{ fontSize: 7, fontWeight: 900, color: '#1a3a8a', letterSpacing: 1 }}>IND</div>
          <div style={{ color: '#1a1a1a' }}>{plateText}</div>
        </div>
        <div className="mt-1.5" style={{ fontSize: 10, color: '#8c909f', fontFamily: "'JetBrains Mono', monospace" }}>
          Standard High-Security Registration Plate (HSRP)
        </div>
      </div>

      {/* Telemetry Matrix */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'OCR CONFIDENCE', value: `${confidence.toFixed(1)}%`, color: '#69f0ae' },
          { label: 'VEHICLE TYPE', value: vehicleType, color: '#dae2fd' },
          { label: 'TRACKING ID', value: trackingId, color: '#adc6ff' },
          { label: 'DETECTION TIME', value: timeStr, color: '#dae2fd' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-2.5 rounded-lg"
            style={{ background: 'rgba(6,14,32,0.70)', border: '1px solid rgba(218,226,253,0.07)' }}
          >
            <div className="data-label" style={{ fontSize: 9 }}>{stat.label}</div>
            <div className="data-value font-bold" style={{ fontSize: 13, color: stat.color, marginTop: 2 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 mt-2 section-divider flex items-center justify-between">
        <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: '#69f0ae', fontFamily: "'Inter', sans-serif" }}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Plate Matched in Mock DB</span>
        </div>
        <button
          id="ocr-view-vehicle-record-btn"
          onClick={handleOpenVehicle}
          className="flex items-center gap-1.5 btn-ghost"
          style={{ padding: '4px 10px', fontSize: 11 }}
        >
          <span>View Record</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
