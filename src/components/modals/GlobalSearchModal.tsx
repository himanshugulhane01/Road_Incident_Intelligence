import React, { useEffect, useRef } from 'react';
import { Search, X, Car, AlertTriangle, Bell, Camera, User, CreditCard, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    vehicles,
    incidents,
    alerts,
    cameras,
    setSelectedVehicle,
    setSelectedIncident,
    setCurrentRoute,
    seekVideo,
  } = useApp();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = globalSearchQuery.trim().toLowerCase();

  const matchingVehicles = q
    ? vehicles.filter(
        (v) =>
          v.numberPlate.toLowerCase().includes(q) ||
          v.vehicleId.toLowerCase().includes(q) ||
          v.trackingId.toLowerCase().includes(q) ||
          v.makeModel.toLowerCase().includes(q)
      )
    : [];

  const matchingIncidents = q
    ? incidents.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.numberPlate && i.numberPlate.toLowerCase().includes(q)) ||
          i.location.toLowerCase().includes(q)
      )
    : [];

  const matchingAlerts = q
    ? alerts.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          (a.numberPlate && a.numberPlate.toLowerCase().includes(q))
      )
    : [];

  const hasResults =
    matchingVehicles.length > 0 || matchingIncidents.length > 0 || matchingAlerts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-20 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/90">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search license plate (e.g. MH27AB1234), vehicle ID, incident ID, or tracking code..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none font-mono"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="p-1 rounded hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-xs font-mono">
                Try searching for demo plates like <span className="text-sky-400">MH27AB1234</span>,{' '}
                <span className="text-sky-400">MH31CD7788</span>, or{' '}
                <span className="text-sky-400">VH-00281</span>.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-slate-400 text-xs font-mono">
              No matching forensic records found for &quot;{globalSearchQuery}&quot;.
            </div>
          ) : (
            <>
              {/* Vehicles */}
              {matchingVehicles.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-sky-400" />
                    Vehicles ({matchingVehicles.length})
                  </div>
                  {matchingVehicles.map((v) => (
                    <div
                      key={v.vehicleId}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-amber-100 text-slate-950 font-mono font-bold text-xs">
                          {v.numberPlate}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200">
                            {v.makeModel} ({v.vehicleType})
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {v.vehicleId} | Tracking: {v.trackingId}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Incidents */}
              {matchingIncidents.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Incidents ({matchingIncidents.length})
                  </div>
                  {matchingIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{inc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {inc.id} | Camera: {inc.camera} | Plate: {inc.numberPlate || 'N/A'}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                        {inc.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts */}
              {matchingAlerts.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-red-400" />
                    Alerts ({matchingAlerts.length})
                  </div>
                  {matchingAlerts.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        seekVideo(alt.videoTimestampSec);
                        setCurrentRoute('live-monitoring');
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{alt.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {alt.id} | Camera: {alt.sourceCamera}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                        Jump to Video →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-right text-[10px] text-slate-400 font-mono">
          RoadGuard AI Central Forensic Indexing Engine (Demo)
        </div>
      </div>
    </div>
  );
};
