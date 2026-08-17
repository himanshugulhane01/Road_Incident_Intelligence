import React, { useState } from 'react';
import { History, Search, Download, Clock, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportDataAsCSV, exportDataAsJSON } from '../utils/helpers';

export const HistoryPage: React.FC = () => {
  const { detectionHistory, seekVideo, setCurrentRoute } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredHistory = detectionHistory.filter((det) => {
    const matchesSearch =
      det.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      det.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (det.numberPlate && det.numberPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (det.trackingId && det.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || det.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Detection Events Forensics History</span>
              <span className="badge-info font-bold">{detectionHistory.length} EVENTS LOGGED</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Chronological forensic audit trail of neural vision perception events
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDataAsCSV(detectionHistory.map(d => ({ DetectionID: d.id, Time: d.timeFormatted, Type: d.type, Label: d.label, Confidence: `${d.confidence}%`, Camera: d.cameraId, Severity: d.severity, Plate: d.numberPlate || 'N/A' })), 'RoadGuard_Detection_History')}
            className="btn-ghost flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => exportDataAsJSON(detectionHistory, 'RoadGuard_Detection_History')}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#FF5722]" />
            <input
              type="text"
              placeholder="Search event ID, label, plate, or tracking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs font-semibold"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-xs font-extrabold text-[#78716C]">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field text-xs font-bold"
            >
              <option value="ALL">All Event Types</option>
              <option value="NUMBER_PLATE">Number Plate</option>
              <option value="NO_HELMET">No Helmet</option>
              <option value="HELMET">Helmet</option>
              <option value="OVERSPEED">Overspeed</option>
              <option value="TRIPLE_RIDING">Triple Riding</option>
              <option value="WRONG_SIDE">Wrong Side</option>
              <option value="RED_LIGHT_VIOLATION">Red Light</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="PERSON">Person</option>
            </select>
          </div>
          <span className="text-xs font-mono font-bold text-[#78716C]">
            <strong className="text-[#FF5722]">{filteredHistory.length}</strong> of {detectionHistory.length}
          </span>
        </div>
      </div>

      {/* Forensic Events Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F6F4F0] border-b border-[#E6E3DD]">
              <tr>
                {['Event ID', 'Timestamp', 'Perception Label', 'Tracking ID', 'License Plate', 'Camera Node', 'Confidence', 'Severity', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-[#78716C] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E3DD]">
              {filteredHistory.map((d) => (
                <tr key={d.id} className="hover:bg-[#FFF0E6] transition-colors">
                  <td className="px-5 py-4 text-xs font-mono font-bold text-[#1C1917]">{d.id}</td>
                  <td className="px-5 py-4 text-xs font-mono font-extrabold text-[#0284C7]">{d.timeFormatted}</td>
                  <td className="px-5 py-4 text-xs font-bold text-[#1C1917]">{d.label}</td>
                  <td className="px-5 py-4 text-xs font-mono font-semibold text-[#FF5722]">{d.trackingId || '—'}</td>
                  <td className="px-5 py-4 text-xs font-mono">
                    {d.numberPlate ? (
                      <span className="px-3 py-1 rounded-xl bg-[#FFF0E6] border border-[#FF5722]/30 text-[#FF5722] font-extrabold">
                        {d.numberPlate}
                      </span>
                    ) : (
                      <span className="text-[#A8A29E]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs font-mono font-semibold text-[#57534E]">{d.cameraId}</td>
                  <td className="px-5 py-4 text-xs font-mono font-bold text-[#0284C7]">{d.confidence.toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      d.severity === 'CRITICAL' ? 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30' :
                      d.severity === 'HIGH' ? 'bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/30' :
                      'bg-[#FFF0E6] text-[#FF5722] border border-[#FF5722]/30'
                    }`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => { seekVideo(d.timestamp); setCurrentRoute('live-monitoring'); }}
                      className="flex items-center gap-1.5 text-xs font-extrabold text-[#FF5722] hover:underline whitespace-nowrap"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Seek Frame →</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-xs font-semibold text-[#78716C]">
                    No detection history records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
