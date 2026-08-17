import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentStatus, Severity } from '../types';
import { exportDataAsCSV } from '../utils/helpers';

export const IncidentsPage: React.FC = () => {
  const {
    incidents,
    setSelectedIncident,
    updateIncidentStatus,
    seekVideo,
    setCurrentRoute,
    setSelectedVehicle,
    vehicles,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.numberPlate && inc.numberPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inc.camera.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleExportCSV = () => {
    exportDataAsCSV(
      incidents.map((i) => ({
        IncidentID: i.id,
        Title: i.title,
        Type: i.type,
        Severity: i.severity,
        Status: i.status,
        Camera: i.camera,
        Location: i.location,
        NumberPlate: i.numberPlate || 'N/A',
        Confidence: `${i.confidence}%`,
        Timestamp: i.timestamp,
      })),
      'RoadGuard_Incident_Forensics'
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
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Traffic Incidents & Violations Registry</span>
              <span className="badge-critical font-bold">{incidents.length} TOTAL LOGGED</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Audit log of verified and pending road safety infractions across connected CCTV nodes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#FF5722]" />
            <input
              type="text"
              placeholder="Search incident ID, title, plate, or camera node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs font-semibold"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-xs font-extrabold text-[#78716C]">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | 'ALL')}
              className="input-field text-xs font-bold"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-[#78716C]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'ALL')}
              className="input-field text-xs font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Registry Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F6F4F0] border-b border-[#E6E3DD]">
              <tr>
                {['Incident ID', 'Violation & Title', 'Severity', 'Camera / Junction', 'Linked Plate', 'Confidence', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-[#78716C] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E3DD]">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs font-semibold text-[#78716C]">
                    No incidents match current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-[#FFF0E6] transition-colors">
                    <td className="px-5 py-4 text-xs font-mono font-bold text-[#1C1917]">{inc.id}</td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-extrabold text-[#1C1917]">{inc.title}</div>
                      <div className="text-[10px] font-mono text-[#78716C] font-semibold">{inc.timestamp}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        inc.severity === 'CRITICAL' ? 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30' :
                        inc.severity === 'HIGH' ? 'bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/30' :
                        'bg-[#FFF0E6] text-[#FF5722] border border-[#FF5722]/30'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-mono font-bold text-[#1C1917]">{inc.camera}</div>
                      <div className="text-[10px] text-[#78716C] font-semibold truncate max-w-[150px]">{inc.location}</div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono">
                      {inc.numberPlate ? (
                        <button
                          onClick={() => {
                            const v = vehicles.find((item) => item.numberPlate === inc.numberPlate);
                            if (v) setSelectedVehicle(v);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#FEF08A] border-2 border-[#1C1917] font-black text-[#1C1917] shadow-sm hover:underline"
                        >
                          {inc.numberPlate}
                        </button>
                      ) : (
                        <span className="text-[#A8A29E]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono font-bold text-[#0284C7]">{inc.confidence.toFixed(1)}%</td>
                    <td className="px-5 py-4">
                      <select
                        value={inc.status}
                        onChange={(e) =>
                          updateIncidentStatus(inc.id, e.target.value as IncidentStatus)
                        }
                        className="input-field text-[11px] font-bold py-1 px-2"
                      >
                        <option value="NEW">NEW</option>
                        <option value="REVIEWING">REVIEWING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="btn-ghost px-3 py-1.5 rounded-xl text-xs font-extrabold"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => {
                            seekVideo(inc.videoTimestampSec);
                            setCurrentRoute('live-monitoring');
                          }}
                          className="btn-primary px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm"
                        >
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          <span>Seek →</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
