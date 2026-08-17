import React from 'react';
import {
  Clock,
  AlertTriangle,
  ShieldCheck,
  CreditCard,
  Gauge,
  Users,
  Crosshair,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DetectionEvent, DetectionType } from '../../types';

const getSeverityStyle = (severity: string): React.CSSProperties => {
  if (severity === 'CRITICAL') return { background: '#FFEBEE', color: '#E53935', border: '1px solid rgba(229,57,53,0.3)' };
  if (severity === 'HIGH') return { background: '#FFF0E6', color: '#FF5722', border: '1px solid rgba(255,87,34,0.3)' };
  if (severity === 'MEDIUM') return { background: '#FFF3E0', color: '#E65100', border: '1px solid rgba(230,81,0,0.3)' };
  return { background: '#F6F4F0', color: '#78716C', border: '1px solid #E6E3DD' };
};

const getTypeIconColor = (type: DetectionType): string => {
  switch (type) {
    case 'NUMBER_PLATE': return '#FF5722';
    case 'NO_HELMET':
    case 'TRIPLE_RIDING':
    case 'RED_LIGHT_VIOLATION':
    case 'WRONG_SIDE':
    case 'ACCIDENT': return '#E53935';
    case 'OVERSPEED': return '#E65100';
    case 'HELMET': return '#0284C7';
    case 'PERSON': return '#8E24AA';
    default: return '#78716C';
  }
};

export const DetectionTimeline: React.FC = () => {
  const {
    filteredTimelineEvents,
    videoCurrentTime,
    seekVideo,
    setSelectedVehicle,
    vehicles,
  } = useApp();

  const getIconForType = (type: DetectionType) => {
    const color = getTypeIconColor(type);
    switch (type) {
      case 'NUMBER_PLATE': return <CreditCard className="w-4 h-4" style={{ color }} />;
      case 'NO_HELMET':
      case 'TRIPLE_RIDING':
      case 'RED_LIGHT_VIOLATION': return <AlertTriangle className="w-4 h-4" style={{ color }} />;
      case 'OVERSPEED': return <Gauge className="w-4 h-4" style={{ color }} />;
      case 'WRONG_SIDE':
      case 'ACCIDENT': return <AlertTriangle className="w-4 h-4" style={{ color }} />;
      case 'HELMET': return <ShieldCheck className="w-4 h-4" style={{ color }} />;
      case 'PERSON': return <Users className="w-4 h-4" style={{ color }} />;
      default: return <Crosshair className="w-4 h-4" style={{ color }} />;
    }
  };

  const handleEventClick = (evt: DetectionEvent) => {
    seekVideo(evt.timestamp);
    if (evt.vehicleId || evt.numberPlate) {
      const match = vehicles.find(
        (v) => v.vehicleId === evt.vehicleId || v.numberPlate === evt.numberPlate
      );
      if (match) setSelectedVehicle(match);
    }
  };

  return (
    <div
      id="detection-event-timeline"
      className="glass-panel rounded-3xl p-4 select-none"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4" style={{ color: '#FF5722' }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Event Timeline
          </span>
          <span style={{ fontSize: 11, color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            — click to seek video
          </span>
        </div>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#78716C', fontWeight: 600 }}>
          Events: <span style={{ color: '#FF5722', fontWeight: 700 }}>{filteredTimelineEvents.length}</span>
        </div>
      </div>

      {/* Horizontal scrollable event stream */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {filteredTimelineEvents.length === 0 ? (
          <div style={{ fontSize: 12, color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '8px 0' }}>
            No events match the selected filter.
          </div>
        ) : (
          filteredTimelineEvents.map((evt) => {
            const isNearCurrent = Math.abs(videoCurrentTime - evt.timestamp) <= 1.5;
            const isPassed = videoCurrentTime > evt.timestamp + 1.5;

            return (
              <div
                key={evt.id}
                id={`timeline-event-${evt.id}`}
                onClick={() => handleEventClick(evt)}
                className="flex-shrink-0 p-3 rounded-2xl cursor-pointer transition-all"
                style={{
                  minWidth: 200,
                  background: isNearCurrent
                    ? '#FFF0E6'
                    : '#F6F4F0',
                  border: isNearCurrent
                    ? '2px solid #FF5722'
                    : '1px solid #E6E3DD',
                  boxShadow: isNearCurrent ? '0 6px 18px rgba(255,87,34,0.25)' : 'none',
                  transform: isNearCurrent ? 'scale(1.02)' : 'scale(1)',
                  opacity: isPassed && !isNearCurrent ? 0.65 : 1,
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className="flex items-center gap-1.5 font-bold"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF5722' }}
                  >
                    {getIconForType(evt.type)}
                    {evt.timeFormatted}
                  </span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.04em',
                      ...getSeverityStyle(evt.severity),
                    }}
                  >
                    {evt.severity}
                  </span>
                </div>

                {/* Label */}
                <div
                  className="truncate mb-1 font-bold text-xs"
                  style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {evt.label}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 10, color: '#78716C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                    {evt.cameraId}
                  </span>
                  <span style={{ fontSize: 10, color: '#0284C7', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {evt.confidence.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
