import React, { useState } from 'react';
import { Car, Search, Download, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportDataAsCSV } from '../utils/helpers';

export const VehiclesPage: React.FC = () => {
  const { vehicles, setSelectedVehicle } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Vehicle Trajectory Tracking & Fleet Telemetry</span>
              <span className="badge-ok font-bold">MULTI-OBJECT TRACKING</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Kalman multi-object tracker · Continuous trajectory logging across CCTV camera clusters
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDataAsCSV(vehicles as unknown as Record<string, unknown>[], 'RoadGuard_Vehicles')}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md"
          >
            <Download className="w-4 h-4 text-white" /> <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 flex items-center gap-3 max-w-md">
        <Search className="w-4 h-4 text-[#FF5722]" />
        <input
          type="text"
          placeholder="Search by tracking ID, plate, or vehicle model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field text-xs font-semibold"
        />
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F6F4F0] border-b border-[#E6E3DD]">
              <tr>
                {['Tracking ID', 'License Plate', 'Model / Class', 'Color', 'Last Seen', 'Sightings', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-[11px] font-extrabold text-[#78716C] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E3DD]">
              {filteredVehicles.map((v) => (
                <tr key={v.vehicleId} className="hover:bg-[#FFF0E6] transition-colors">
                  <td className="px-5 py-4 text-xs font-mono font-bold text-[#FF5722]">{v.trackingId}</td>
                  <td className="px-5 py-4 text-xs font-mono">
                    <span className="px-3 py-1 rounded-lg bg-[#FEF08A] border-2 border-[#1C1917] font-black text-[#1C1917] shadow-sm">
                      {v.numberPlate}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-extrabold text-[#1C1917]">{v.makeModel}</div>
                    <div className="text-[10px] font-mono text-[#78716C] font-semibold">{v.vehicleType}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#57534E]">{v.color}</td>
                  <td className="px-5 py-4 text-xs font-mono text-[#78716C] font-semibold">
                    <div>{v.lastSeen.slice(11, 19)}</div>
                    <div className="text-[10px] text-[#A8A29E]">{v.firstDetected.slice(0, 10)}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono font-black text-[#0284C7]">{v.totalDetections}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      v.status === 'Clean' ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30' : 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="btn-ghost flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect →</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
