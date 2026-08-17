import React, { useState } from 'react';
import { CreditCard, Search, Download, Eye, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportDataAsCSV } from '../utils/helpers';

export const NumberPlatesPage: React.FC = () => {
  const { vehicles, setSelectedVehicle } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('ALL');

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.numberPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = vehicleTypeFilter === 'ALL' || v.vehicleType === vehicleTypeFilter;
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
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>ANPR — Automated Number Plate Recognition</span>
              <span className="badge-warning font-bold">98.4% ACCURACY</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              High-accuracy OCR plate extraction · Vehicle make & color classification pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDataAsCSV(vehicles.map(v => ({ VehicleID: v.vehicleId, NumberPlate: v.numberPlate, Type: v.vehicleType, MakeModel: v.makeModel, Color: v.color, Status: v.status, FirstDetected: v.firstDetected, TotalDetections: v.totalDetections })), 'RoadGuard_NumberPlates_Forensics')}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md"
          >
            <Download className="w-4 h-4 text-white" /> <span>Export CSV</span>
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
              placeholder="Search plate (e.g. MH12AB9842), model, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs font-semibold"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-xs font-extrabold text-[#78716C]">Vehicle Type:</span>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="input-field text-xs font-bold"
            >
              <option value="ALL">All Types</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Auto-Rickshaw">Auto-Rickshaw</option>
            </select>
          </div>
          <span className="text-xs font-mono font-bold text-[#78716C]">
            Showing <strong className="text-[#FF5722]">{filteredVehicles.length}</strong> of {vehicles.length}
          </span>
        </div>
      </div>

      {/* Plates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => (
          <div
            key={v.vehicleId}
            className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 hover:scale-[1.01] transition-all space-y-4"
          >
            {/* Plate Visual */}
            <div className="flex items-center justify-between">
              <div
                className="px-5 py-2.5 rounded-xl font-mono text-xl font-black tracking-widest text-[#1C1917] shadow-md border-2 border-[#1C1917]"
                style={{ background: 'linear-gradient(135deg, #FEF08A, #FDE047)' }}
              >
                {v.numberPlate}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                v.status === 'Clean' ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30' : 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30'
              }`}>
                {v.status}
              </span>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#1C1917]">{v.makeModel}</h3>
              <p className="text-xs text-[#78716C] font-semibold">
                Type: <strong className="text-[#1C1917]">{v.vehicleType}</strong> · Color: <strong className="text-[#1C1917]">{v.color}</strong>
              </p>
              <p className="text-[11px] font-mono text-[#78716C]">
                TRK: <span className="text-[#FF5722] font-bold">{v.trackingId}</span> · First: {v.firstDetected.slice(11, 19)}
              </p>
            </div>

            {/* Telemetry Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E6E3DD]">
              <div className="p-3 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/20">
                <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Total Sightings</div>
                <div className="text-lg font-black text-[#FF5722] mt-0.5">{v.totalDetections}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF3E0] border border-[#E65100]/20">
                <div className="text-[10px] font-extrabold text-[#E65100] uppercase">Incidents</div>
                <div className="text-lg font-black text-[#E65100] mt-0.5">{v.associatedIncidents}</div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E6E3DD]">
              <span className="text-xs font-mono font-bold text-[#0284C7]">
                OCR Confidence: 98.4%
              </span>
              <button
                onClick={() => setSelectedVehicle(v)}
                className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold"
              >
                <Eye className="w-4 h-4" />
                <span>Full Record</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
