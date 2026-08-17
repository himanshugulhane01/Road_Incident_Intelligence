import React from 'react';
import { useApp } from '../../context/AppContext';
import { DetectionEvent, Severity } from '../../types';
import { getSeverityBorderColor } from '../../utils/helpers';
import { AlertTriangle, Eye, ShieldCheck, Zap } from 'lucide-react';

export const DetectionOverlay: React.FC = () => {
  const {
    activeDetections,
    settings,
    setSelectedVehicle,
    vehicles,
    setSelectedIncident,
    incidents,
  } = useApp();

  if (!settings.showBoundingBoxes || activeDetections.length === 0) {
    return null;
  }

  const handleBoxClick = (e: React.MouseEvent, det: DetectionEvent) => {
    e.stopPropagation();
    if (det.vehicleId || det.numberPlate) {
      const match = vehicles.find(
        (v) => v.vehicleId === det.vehicleId || v.numberPlate === det.numberPlate
      );
      if (match) {
        setSelectedVehicle(match);
        return;
      }
    }

    // Try finding incident
    const incMatch = incidents.find((i) => i.videoTimestampSec === det.timestamp);
    if (incMatch) {
      setSelectedIncident(incMatch);
    }
  };

  return (
    <div
      id="ai-detection-overlay"
      className="absolute inset-0 pointer-events-none select-none z-10"
    >
      {activeDetections.map((det) => {
        const bbox = det.bbox || { x: 30, y: 30, width: 25, height: 35 };
        const borderColor = getSeverityBorderColor(det.severity);
        const isViolation = det.severity === 'HIGH' || det.severity === 'CRITICAL';

        return (
          <div
            key={det.id}
            id={`bbox-${det.id}`}
            onClick={(e) => handleBoxClick(e, det)}
            className="absolute pointer-events-auto cursor-pointer group transition-all duration-150"
            style={{
              left: `${bbox.x}%`,
              top: `${bbox.y}%`,
              width: `${bbox.width}%`,
              height: `${bbox.height}%`,
              borderColor: borderColor,
              boxShadow: `0 0 12px ${borderColor}60, inset 0 0 10px ${borderColor}20`,
            }}
          >
            {/* Corner Markers for futuristic HUD feel */}
            <div
              className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2"
              style={{ borderColor }}
            />
            <div
              className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2"
              style={{ borderColor }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2"
              style={{ borderColor }}
            />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2"
              style={{ borderColor }}
            />

            {/* Bounding Box Header Label */}
            <div
              className="absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap text-white shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: borderColor }}
            >
              {isViolation ? (
                <AlertTriangle className="w-3 h-3 text-white animate-pulse" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-white" />
              )}
              <span>{det.label}</span>
              {settings.showConfidence && (
                <span className="bg-black/40 px-1 py-0.2 rounded text-[9px]">
                  {det.confidence.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Tracking ID and Speed Badge at Bottom */}
            <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-[9px] font-mono text-slate-100 bg-slate-950/90 border border-slate-700 px-1.5 py-0.5 rounded shadow">
              {settings.showTrackingId && det.trackingId && (
                <span className="text-sky-400 font-bold">{det.trackingId}</span>
              )}
              {det.speedKmh && (
                <span className="text-amber-400 font-semibold">{det.speedKmh} km/h</span>
              )}
              <span className="text-slate-400 group-hover:text-sky-400 flex items-center gap-0.5">
                <Eye className="w-2.5 h-2.5" /> Inspect
              </span>
            </div>

            {/* Center target crosshair on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/20 backdrop-blur-[1px]">
              <span className="text-[10px] font-mono text-white bg-slate-900/90 px-2 py-0.5 rounded border border-slate-600 shadow">
                Click to Open Record
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
