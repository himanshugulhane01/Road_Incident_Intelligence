import React, { useEffect, useRef } from 'react';
import {
  Search,
  X,
  Car,
  AlertTriangle,
  Bell,
  Camera,
  ArrowLeft,
  LayoutDashboard,
  Video,
  FileVideo,
  CreditCard,
  History,
  BarChart3,
  Settings2,
  ChevronRight,
} from 'lucide-react';
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

  // Keyboard shortcut Ctrl+K & Escape
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

  // Navigation pages list for search matching
  const pagesList = [
    { id: 'dashboard', title: 'Dashboard & Intelligence Overview', desc: 'Real-time metrics, CCTV feeds, incidents', icon: LayoutDashboard },
    { id: 'live-monitoring', title: 'Live Monitoring & Perception Feed', desc: 'Live bounding box streams, OCR license plate engine', icon: Video },
    { id: 'incidents', title: 'Incidents & Infractions Management', desc: 'Critical alerts, status updates, enforcement dispatch', icon: AlertTriangle },
    { id: 'number-plates', title: 'ANPR & License Plate Database', desc: 'Search plates, HSRP verification, vehicle registry', icon: CreditCard },
    { id: 'video-analysis', title: 'Deep Video Forensic Analyzer', desc: 'Frame stepping, velocity breakdown, keyframe inspection', icon: FileVideo },
    { id: 'cameras', title: 'Camera Network & Nodes Management', desc: 'CCTV node status, resolution telemetry, stream setup', icon: Camera },
    { id: 'history', title: 'Detection History & Event Audit Log', desc: 'Complete detection timeline and violation records', icon: History },
    { id: 'settings', title: 'System Settings & Parameters', desc: 'Neural confidence thresholds, alert preferences', icon: Settings2 },
  ];

  const matchingPages = q
    ? pagesList.filter(
        (p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      )
    : [];

  const matchingVehicles = q
    ? vehicles.filter(
        (v) =>
          v.numberPlate.toLowerCase().includes(q) ||
          v.vehicleId.toLowerCase().includes(q) ||
          v.trackingId.toLowerCase().includes(q) ||
          v.makeModel.toLowerCase().includes(q) ||
          v.vehicleType.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q) ||
          v.status.toLowerCase().includes(q)
      )
    : [];

  const matchingIncidents = q
    ? incidents.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.numberPlate && i.numberPlate.toLowerCase().includes(q)) ||
          i.location.toLowerCase().includes(q) ||
          i.camera.toLowerCase().includes(q) ||
          i.severity.toLowerCase().includes(q)
      )
    : [];

  const matchingAlerts = q
    ? alerts.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          (a.numberPlate && a.numberPlate.toLowerCase().includes(q)) ||
          a.sourceCamera.toLowerCase().includes(q)
      )
    : [];

  const matchingCameras = q
    ? cameras.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.status.toLowerCase().includes(q)
      )
    : [];

  const hasResults =
    matchingPages.length > 0 ||
    matchingVehicles.length > 0 ||
    matchingIncidents.length > 0 ||
    matchingAlerts.length > 0 ||
    matchingCameras.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-md p-4 pt-16 md:pt-20 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsSearchOpen(false);
      }}
    >
      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-3xl w-full text-[#0F172A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
        {/* Search Header Bar with Prominent Back Option */}
        <div className="p-4 border-b border-[#CBD5E1] flex items-center gap-3 bg-[#F8FAFC]">
          {/* Prominent Back Button */}
          <button
            id="search-modal-back-btn"
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#0F172A] text-white hover:bg-[#1E293B] text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            title="Go back to previous screen (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>Back</span>
          </button>

          {/* Search Icon & Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#CBD5E1] focus-within:border-[#EA580C] shadow-xs transition-all">
            <Search className="w-4 h-4 text-[#EA580C] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search license plate (e.g. MH27AB1234), incident, camera, or page..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs md:text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none font-sans font-semibold"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="px-2 py-0.5 rounded-lg bg-[#F1F5F9] text-[#64748B] text-[10px] font-mono-tech font-bold border border-[#CBD5E1] hidden md:inline shrink-0">
              ESC
            </kbd>
          </div>

          {/* Close X Button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2.5 rounded-2xl bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] hover:bg-[#E2E8F0] hover:text-[#0F172A] text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Close Search Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5 bg-white">
          {!q ? (
            <div className="py-6 text-center text-[#475569] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center mx-auto text-[#EA580C]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">RoadGuard AI Universal Search</h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Type a license plate (e.g. <strong className="text-[#EA580C]">MH27AB1234</strong>), incident title, camera, or feature page.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {['MH27AB1234', 'MH31CD7788', 'Over-Speeding', 'CAM-01', 'Live Feed'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setGlobalSearchQuery(sample)}
                    className="px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold hover:border-[#0F172A] transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="py-12 text-center text-[#64748B] text-xs font-medium">
              No matching records or pages found for &quot;<strong className="text-[#0F172A]">{globalSearchQuery}</strong>&quot;.
            </div>
          ) : (
            <>
              {/* System Pages / Navigation */}
              {matchingPages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono-tech uppercase text-[#475569] flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>System Pages ({matchingPages.length})</span>
                  </div>
                  {matchingPages.map((p) => {
                    const PageIcon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setCurrentRoute(p.id);
                          setIsSearchOpen(false);
                        }}
                        className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#0F172A] flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#0F172A] text-[#EA580C]">
                            <PageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0F172A]">{p.title}</div>
                            <div className="text-[11px] text-[#64748B] font-medium">{p.desc}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#64748B]" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Vehicles */}
              {matchingVehicles.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono-tech uppercase text-[#475569] flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Vehicles & License Plates ({matchingVehicles.length})</span>
                  </div>
                  {matchingVehicles.map((v) => (
                    <div
                      key={v.vehicleId}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#0284C7] flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 rounded-lg bg-[#FEF08A] text-[#0F172A] font-mono-tech font-extrabold text-xs border border-[#0F172A]">
                          {v.numberPlate}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">
                            {v.makeModel} ({v.vehicleType})
                          </div>
                          <div className="text-[11px] text-[#64748B] font-mono-tech">
                            ID: {v.vehicleId} | Tracking: {v.trackingId}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#64748B]" />
                    </div>
                  ))}
                </div>
              )}

              {/* Incidents */}
              {matchingIncidents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono-tech uppercase text-[#475569] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Incidents & Violations ({matchingIncidents.length})</span>
                  </div>
                  {matchingIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#EA580C] flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{inc.title}</div>
                        <div className="text-[11px] text-[#64748B] font-mono-tech">
                          ID: {inc.id} | Camera: {inc.camera} | Plate: {inc.numberPlate || 'N/A'}
                        </div>
                      </div>
                      <span className={
                        inc.severity === 'CRITICAL' ? 'badge-critical' :
                        inc.severity === 'HIGH' ? 'badge-warning' : 'badge-info'
                      }>
                        {inc.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts */}
              {matchingAlerts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono-tech uppercase text-[#475569] flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Alerts Feed ({matchingAlerts.length})</span>
                  </div>
                  {matchingAlerts.map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        seekVideo(alt.videoTimestampSec);
                        setCurrentRoute('live-monitoring');
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#DC2626] flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{alt.title}</div>
                        <div className="text-[11px] text-[#64748B] font-mono-tech">
                          ID: {alt.id} | Camera: {alt.sourceCamera}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#0284C7]">
                        Jump to Video →
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Camera Nodes */}
              {matchingCameras.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono-tech uppercase text-[#475569] flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Camera Nodes ({matchingCameras.length})</span>
                  </div>
                  {matchingCameras.map((cam) => (
                    <div
                      key={cam.id}
                      onClick={() => {
                        setCurrentRoute('cameras');
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#10B981] flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#0F172A]">{cam.id} — {cam.name}</div>
                        <div className="text-[11px] text-[#64748B] font-medium">
                          Location: {cam.location} | Resolution: {cam.resolution}
                        </div>
                      </div>
                      <span className={cam.status === 'ONLINE' ? 'badge-ok' : 'badge-critical'}>
                        {cam.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#F8FAFC] border-t border-[#CBD5E1] flex items-center justify-between text-xs text-[#64748B] font-semibold">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#0F172A] text-white text-[10px] font-mono-tech">ESC</kbd> or click <strong>Back</strong> to exit</span>
          <span className="font-mono-tech font-bold text-[#0F172A]">RoadGuard AI Indexer</span>
        </div>
      </div>
    </div>
  );
};
