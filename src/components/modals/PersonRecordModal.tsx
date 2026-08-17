import React, { useEffect } from 'react';
import { X, User, Car, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonRecordModal: React.FC = () => {
  const { selectedPerson, setSelectedPerson } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPerson(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedPerson]);

  if (!selectedPerson) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedPerson(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 select-none animate-fadeIn"
    >
      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-xl w-full p-6 text-[#0F172A] shadow-2xl space-y-5">
        {/* Header & Demo Badge */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSelectedPerson(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] hover:bg-[#EA580C] hover:text-white transition-all cursor-pointer mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="p-2.5 rounded-2xl bg-[#FFF0E6] border border-[#EA580C]/30 text-[#EA580C]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0F172A] flex items-center gap-2">
                <span>Person / Occupant Record</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-xl bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]">
                  {selectedPerson.personId}
                </span>
              </h3>
              <p className="text-xs text-[#64748B] font-mono">
                Classification: {selectedPerson.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-[10px] font-mono font-extrabold tracking-wider">
              VERIFIED RECORD
            </span>
            <button
              onClick={() => setSelectedPerson(null)}
              className="p-2 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Person Name & Role Banner */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase font-bold">Subject Alias / Name</div>
            <div className="font-extrabold text-base text-[#0F172A] mt-0.5">{selectedPerson.name}</div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-[#64748B] font-bold">SAFETY STATUS</div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold mt-1 ${
                selectedPerson.status === 'Normal'
                  ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30'
                  : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
              }`}
            >
              {selectedPerson.status}
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">ESTIMATED AGE BRACKET</div>
            <div className="text-[#0F172A] font-bold mt-0.5">{selectedPerson.estimatedAge}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">ESTIMATED GENDER</div>
            <div className="text-[#0F172A] font-bold mt-0.5">{selectedPerson.gender}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">FIRST REGISTERED</div>
            <div className="text-[#334155] mt-0.5 text-[11px] font-semibold">{selectedPerson.firstSeen}</div>
          </div>

          <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
            <div className="text-[#64748B] text-[10px] font-bold">LAST SIGHTING</div>
            <div className="text-[#334155] mt-0.5 text-[11px] font-semibold">{selectedPerson.lastSeen}</div>
          </div>
        </div>

        {/* Associated Vehicles */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#0284C7]" />
            Associated Vehicles
          </div>

          <div className="space-y-1.5">
            {selectedPerson.associatedVehicles.length === 0 ? (
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] font-mono">
                No motor vehicle linkage (Pedestrian only).
              </div>
            ) : (
              selectedPerson.associatedVehicles.map((vh, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center justify-between"
                >
                  <span className="font-bold">{vh}</span>
                  <span className="text-[10px] text-[#0284C7] font-bold">Linked by Optical Tracking</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={() => setSelectedPerson(null)}
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
