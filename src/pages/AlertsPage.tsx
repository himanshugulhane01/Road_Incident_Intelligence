import React, { useState } from 'react';
import { BellRing, XCircle, Clock, Download, AlertTriangle, CheckCircle2, Filter, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Severity } from '../types';
import { exportDataAsCSV } from '../utils/helpers';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert, seekVideo, setCurrentRoute } = useApp();
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'ACKNOWLEDGED' | 'DISMISSED'>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.priority === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSev && matchesStatus;
  });

  const handleAcknowledgeAll = () => {
    alerts.forEach((a) => { if (a.status === 'UNREAD') acknowledgeAlert(a.id); });
  };

  const handleExportCSV = () => {
    exportDataAsCSV(
      alerts.map((a) => ({
        AlertID: a.id, Priority: a.priority, Title: a.title,
        Camera: a.sourceCamera, Plate: a.numberPlate || 'N/A',
        Confidence: `${a.confidence}%`, Status: a.status, Timestamp: a.timestamp,
      })),
      'RoadGuard_Alerts_Log'
    );
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        className="glass-panel rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
          border: '1px solid rgba(255, 87, 34, 0.15)',
          boxShadow: '0 12px 36px -4px rgba(255, 87, 34, 0.12)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)' }}
          >
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Real-Time Traffic Violation Alerts</span>
              <span className="badge-critical font-bold">{alerts.length} TOTAL</span>
              <span className="badge-warning font-bold">{alerts.filter(a => a.status === 'UNREAD').length} UNREAD</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              High-priority violation alerts broadcasted from the automated AI perception pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAcknowledgeAll} className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold">
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
            <span>Acknowledge All</span>
          </button>
          <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#78716C] mr-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Priority:</span>
          </div>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                severityFilter === sev
                  ? 'bg-gradient-to-r from-[#FF7043] to-[#FF5722] text-white shadow-md'
                  : 'bg-[#F6F4F0] text-[#57534E] hover:bg-[#FFF0E6] hover:text-[#FF5722]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-[#78716C]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="input-field max-w-xs text-xs font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNREAD">Unread Only</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-lg border border-black/5 space-y-3">
          <BellRing className="w-12 h-12 mx-auto text-[#A8A29E]" />
          <div className="text-base font-extrabold text-[#1C1917]">No alerts match the selected filters.</div>
          <p className="text-xs text-[#78716C] font-semibold">Try clearing your priority or status filters to view previous alerts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`bg-white rounded-3xl p-6 shadow-xl border border-black/5 hover:scale-[1.01] transition-all space-y-4 relative ${
                alt.status === 'UNREAD' ? 'border-l-4 border-l-[#FF5722]' : 'opacity-85'
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  alt.priority === 'CRITICAL' ? 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30' :
                  alt.priority === 'HIGH' ? 'bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/30' :
                  'bg-[#FFF0E6] text-[#FF5722] border border-[#FF5722]/30'
                }`}>
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {alt.priority}
                </span>
                <span className="text-xs font-mono font-semibold text-[#78716C]">
                  {alt.timestamp}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-extrabold text-[#1C1917] mb-1">{alt.title}</h3>
                <p className="text-xs text-[#57534E] leading-relaxed font-medium">{alt.message}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#F6F4F0] border border-[#E6E3DD] text-[11px] font-mono font-bold text-[#57534E]">
                  {alt.sourceCamera}
                </span>
                {alt.numberPlate && (
                  <span className="px-3 py-1 rounded-xl bg-[#FFF0E6] border border-[#FF5722]/30 text-[11px] font-mono font-extrabold text-[#FF5722]">
                    {alt.numberPlate}
                  </span>
                )}
                <span className="text-[11px] font-mono font-bold text-[#0284C7]">
                  {alt.confidence.toFixed(1)}% CONF
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#E6E3DD] flex items-center justify-between">
                <button
                  onClick={() => { seekVideo(alt.videoTimestampSec); setCurrentRoute('live-monitoring'); }}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF5722] hover:underline"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jump to Frame</span>
                </button>
                <div className="flex items-center gap-2">
                  {alt.status === 'UNREAD' && (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="btn-ghost px-3 py-1 rounded-xl text-[11px] font-bold"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    className="p-1.5 rounded-xl bg-[#F6F4F0] hover:bg-[#FFEBEE] text-[#78716C] hover:text-[#E53935] transition-all"
                    title="Dismiss alert"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
