import React from 'react';
import { X, User, AlertTriangle, ShieldCheck, Car, Clock, Hash } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonRecordModal: React.FC = () => {
  const { selectedPerson, setSelectedPerson } = useApp();

  if (!selectedPerson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl space-y-5">
        {/* Header & Demo Badge */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-600 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>Person / Occupant Record</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedPerson.personId}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Classification: {selectedPerson.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[10px] font-mono font-bold tracking-wider">
              SIMULATED DATA
            </span>
            <button
              onClick={() => setSelectedPerson(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Person Name & Role Banner */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Simulated Subject Alias</div>
            <div className="font-bold text-base text-slate-100 mt-0.5">{selectedPerson.name}</div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-400">SAFETY STATUS</div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold mt-1 ${
                selectedPerson.status === 'Normal'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500'
                  : 'bg-rose-950 text-rose-300 border border-rose-500'
              }`}
            >
              {selectedPerson.status}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">ESTIMATED AGE BRACKET</div>
            <div className="text-slate-200 font-bold mt-0.5">{selectedPerson.estimatedAge}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">ESTIMATED GENDER</div>
            <div className="text-slate-200 font-bold mt-0.5">{selectedPerson.gender}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">FIRST REGISTERED</div>
            <div className="text-slate-300 mt-0.5 text-[11px]">{selectedPerson.firstSeen}</div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[10px]">LAST SIGHTING</div>
            <div className="text-slate-300 mt-0.5 text-[11px]">{selectedPerson.lastSeen}</div>
          </div>
        </div>

        {/* Associated Vehicles */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-sky-400" />
            Associated Vehicles
          </div>

          <div className="space-y-1.5">
            {selectedPerson.associatedVehicles.length === 0 ? (
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-400 font-mono">
                No motor vehicle linkage (Pedestrian only).
              </div>
            ) : (
              selectedPerson.associatedVehicles.map((vh, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center justify-between"
                >
                  <span>{vh}</span>
                  <span className="text-[10px] text-sky-400">Linked by Optical Tracking</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notice */}
        <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 font-mono">
          Note: This profile uses synthetic demo identifiers and simulated computer-vision attributes. No real personal data is collected or displayed.
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => setSelectedPerson(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
