import React from 'react';
import { Users, Download, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportDataAsCSV } from '../utils/helpers';

export const PersonsPage: React.FC = () => {
  const { persons, setSelectedPerson } = useApp();

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
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Pedestrian & Two-Wheeler Rider Forensics</span>
              <span className="badge-ok font-bold">POSE ESTIMATION ACTIVE</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Optical pose estimation for crosswalk pedestrians, two-wheeler riders, and pillion passengers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportDataAsCSV(persons as unknown as Record<string, unknown>[], 'RoadGuard_Persons')}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md"
          >
            <Download className="w-4 h-4 text-white" /> <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid of Persons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {persons.map((p) => (
          <div
            key={p.personId}
            className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 hover:scale-[1.01] transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#78716C]">{p.personId}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                p.status === 'Normal' ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30' : 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30'
              }`}>
                {p.status}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">{p.name}</h3>
              <p className="text-xs text-[#78716C] font-semibold mt-0.5">
                Role: <strong className="text-[#FF5722]">{p.role}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/20">
                <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Est. Age</div>
                <div className="text-sm font-black text-[#FF5722] mt-0.5">{p.estimatedAge}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Gender</div>
                <div className="text-sm font-black text-[#1C1917] mt-0.5">{p.gender}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6E3DD] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#0284C7]">
                {p.totalDetections} Sightings Logged
              </span>
              <button
                onClick={() => setSelectedPerson(p)}
                className="btn-ghost flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold"
              >
                <Eye className="w-4 h-4" />
                <span>View Record</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
