import React, { useState } from 'react';
import {
  Bell, XCircle, Eye, Volume2, VolumeX, ChevronLeft, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Alert, Severity } from '../../types';

const getSeverityAccent = (p: string) => {
  if (p === 'CRITICAL') return '#E53935';
  if (p === 'HIGH') return '#FF5722';
  if (p === 'MEDIUM') return '#FF9800';
  return '#78716C';
};

interface AlertSidebarProps {
  collapsible?: boolean;
}

export const AlertSidebar: React.FC<AlertSidebarProps> = ({ collapsible = false }) => {
  const {
    alerts, unreadAlertCount, acknowledgeAlert, dismissAlert,
    setSelectedVehicle, vehicles, settings, updateSettings,
    seekVideo, setCurrentRoute, activeFilters,
  } = useApp();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');

  const displayAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'ALL' && alert.priority !== severityFilter) return false;
    if (!activeFilters.includes('ALL') && activeFilters.length > 0) {
      if (!activeFilters.includes(alert.detectionType)) return false;
    }
    return true;
  });

  const handleViewAlertEntity = (alert: Alert) => {
    if (alert.videoTimestampSec !== undefined) seekVideo(alert.videoTimestampSec);
    if (alert.vehicleId || alert.numberPlate) {
      const match = vehicles.find((v) => v.vehicleId === alert.vehicleId || v.numberPlate === alert.numberPlate);
      if (match) setSelectedVehicle(match);
    }
  };

  if (collapsible && collapsed) {
    return (
      <div
        className="w-12 flex flex-col items-center py-4 select-none"
        style={{ background: '#FFFFFF', borderLeft: '1px solid rgba(0,0,0,0.05)' }}
      >
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-xl transition-all hover:bg-[#FFF0E6]"
          style={{ background: '#F6F4F0', border: '1px solid #E6E3DD', color: '#78716C' }}
          title="Expand Alerts Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="mt-8 [writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
          style={{ color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Bell className="w-3.5 h-3.5 rotate-90" style={{ color: '#FF5722' }} />
          <span>Alerts ({unreadAlertCount})</span>
        </div>
      </div>
    );
  }

  return (
    <aside
      id="roadguard-alert-sidebar"
      className="w-80 flex flex-col shrink-0 select-none h-full overflow-hidden"
      style={{ background: '#FFFFFF', borderLeft: '1px solid rgba(0,0,0,0.05)', boxShadow: '-4px 0 20px rgba(28,25,23,0.02)' }}
    >
      {/* Header */}
      <div className="p-4 section-divider" style={{ background: '#F6F4F0' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-4.5 h-4.5" style={{ color: '#FF5722' }} />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: '#E53935' }} />
              )}
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Live Alert Stream
            </span>
            <span className={unreadAlertCount > 0 ? 'badge-critical' : 'badge-info'}>
              {unreadAlertCount} UNREAD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSettings({ soundAlerts: !settings.soundAlerts })}
              className="p-1.5 rounded-xl transition-all"
              style={{
                background: settings.soundAlerts ? '#FFF0E6' : '#B3B3B3',
                color: settings.soundAlerts ? '#FF5722' : '#78716C',
              }}
              title={settings.soundAlerts ? 'Audio Tones ON' : 'Audio Tones MUTED'}
            >
              {settings.soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {collapsible && (
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-xl transition-all"
                style={{ background: '#B3B3B3', color: '#78716C' }}
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: severityFilter === sev ? '#FF5722' : '#FFFFFF',
                color: severityFilter === sev ? '#FFFFFF' : '#78716C',
                border: severityFilter === sev ? 'none' : '1px solid #E6E3DD',
                boxShadow: severityFilter === sev ? '0 4px 10px rgba(255,87,34,0.3)' : 'none',
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {displayAlerts.length === 0 ? (
          <div className="py-12 text-center" style={{ fontSize: 12, color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-40" style={{ color: '#FF5722' }} />
            No active alerts in stream.
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl transition-all relative ${
                alert.status === 'UNREAD' ? 'bg-[#FFF0E6] border-2 border-[#FF5722]' : 'bg-[#F6F4F0] border border-[#E6E3DD]'
              }`}
              style={{
                boxShadow: alert.status === 'UNREAD' ? '0 6px 18px rgba(255,87,34,0.15)' : 'none',
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-1.5 gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: getSeverityAccent(alert.priority) }}
                  />
                  <h4 className="text-xs font-bold truncate" style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {alert.title}
                  </h4>
                </div>
                <span className={alert.priority === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                  {alert.priority}
                </span>
              </div>

              {/* Message text */}
              <p className="text-xs mb-2 leading-relaxed" style={{ color: '#57534E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {alert.message}
              </p>

              {/* Info chips */}
              <div className="flex items-center justify-between text-[10px] mb-2 font-bold" style={{ color: '#78716C', fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{alert.sourceCamera}</span>
                {alert.numberPlate && (
                  <span style={{ color: '#FF5722' }}>{alert.numberPlate}</span>
                )}
                <span>{alert.timestamp}</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 section-divider gap-2">
                <button
                  onClick={() => handleViewAlertEntity(alert)}
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: '#FF5722' }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {alert.status === 'UNREAD' ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition-all shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)' }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ACK</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-[#0284C7] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ACKED
                    </span>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 rounded-lg hover:bg-[#B3B3B3]"
                    style={{ color: '#78716C' }}
                    title="Dismiss"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3.5 section-divider text-center" style={{ background: '#F6F4F0' }}>
        <button
          onClick={() => setCurrentRoute('alerts')}
          className="text-xs font-extrabold hover:underline"
          style={{ color: '#FF5722', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          View Full Alerts Hub ({alerts.length}) →
        </button>
      </div>
    </aside>
  );
};
