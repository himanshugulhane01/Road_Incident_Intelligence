import React from 'react';
import { Camera, Play, Video, ShieldCheck, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CamerasPage: React.FC = () => {
  const { cameras, loadSamplePreset, setCurrentRoute } = useApp();
  const [selectedCameraId, setSelectedCameraId] = React.useState<string>(cameras[0]?.id || 'CAM-01');

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
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>CCTV Node Network & Stream Management</span>
              <span className="badge-ok font-bold">
                {cameras.filter(c => c.status === 'ONLINE').length}/{cameras.length} ONLINE
              </span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              IP video stream gateways · RTSP endpoint mapping · Edge perception status
            </p>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map((cam) => {
          const isSelected = selectedCameraId === cam.id;
          const isOnline = cam.status === 'ONLINE';
          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCameraId(cam.id)}
              className={`bg-white rounded-3xl p-6 shadow-xl border transition-all cursor-pointer space-y-4 ${
                isSelected ? 'border-[#FF5722] ring-2 ring-[#FF5722]/20' : 'border-black/5 hover:scale-[1.01]'
              }`}
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DD]">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-[#0284C7] animate-pulse' : 'bg-[#E53935]'}`} />
                  <div>
                    <h3 className="text-base font-extrabold text-[#1C1917]">{cam.name}</h3>
                    <span className="text-xs font-mono font-semibold text-[#78716C]">{cam.id} · {cam.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <span className="badge-info font-bold text-[10px]">SELECTED</span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    isOnline ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30' : 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30'
                  }`}>
                    {cam.status}
                  </span>
                </div>
              </div>

              {/* CCTV Tactical Frame Mock */}
              <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center group shadow-inner">
                {/* Background Stream Simulation */}
                <div className="absolute inset-0 bg-slate-950 opacity-90" />

                {/* Corner Bracket HUD Overlays */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FF7043]" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FF7043]" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FF7043]" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FF7043]" />

                {/* HUD Info */}
                <div className="absolute top-3 left-9 text-[10px] font-mono font-bold text-[#FF7043]">
                  RTSP:// 192.168.1.{100 + Number(cam.id.slice(-2))}
                </div>
                <div className="absolute top-3 right-9 text-[10px] font-mono font-bold text-slate-400">
                  {cam.resolution} @ {cam.fps}FPS
                </div>

                {/* Center Launch Stream Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSamplePreset(cam.id);
                    setCurrentRoute('live-monitoring');
                  }}
                  className="btn-primary relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-xl hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>LAUNCH LIVE STREAM</span>
                </button>
              </div>

              {/* Telemetry Footer Grid */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/20">
                  <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Detections Today</div>
                  <div className="text-base font-black text-[#FF5722] mt-0.5">{cam.totalDetectionsToday}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#F6F4F0] border border-[#E6E3DD]">
                  <div className="text-[10px] font-extrabold text-[#78716C] uppercase">Stream Rate</div>
                  <div className="text-base font-black text-[#1C1917] mt-0.5">{cam.fps} FPS</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#E0F2FE] border border-[#0284C7]/20">
                  <div className="text-[10px] font-extrabold text-[#0284C7] uppercase">ANPR Engine</div>
                  <div className="text-base font-black text-[#0284C7] mt-0.5">Active</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
