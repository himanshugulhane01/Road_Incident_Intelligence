import React, { useState } from 'react';
import {
  FileVideo,
  Play,
  SkipBack,
  SkipForward,
  Crosshair,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { DEMO_SCENARIO_EVENTS } from '../detection';
import { formatTime, getSeverityBadgeClass } from '../utils/helpers';

export const VideoAnalysisPage: React.FC = () => {
  const {
    videoCurrentTime,
    setVideoCurrentTime,
    seekVideo,
    playbackSpeed,
    setPlaybackSpeed,
    setSelectedVehicle,
    vehicles,
  } = useApp();

  const [selectedMilestone, setSelectedMilestone] = useState<string>('DET-003');

  const activeEvent = DEMO_SCENARIO_EVENTS.find((e) => e.id === selectedMilestone) || DEMO_SCENARIO_EVENTS[2];

  const stepFrame = (seconds: number) => {
    setVideoCurrentTime((prev) => Math.max(0, prev + seconds));
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
            <FileVideo className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Deep Video Forensic Analyzer</span>
              <span className="badge-ok font-bold">FRAME-STEPPING FORENSICS</span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Temporal analysis, multi-frame keypoint verification, and speed trajectory breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold text-[#78716C]">
          <span>Current Frame: <strong className="text-[#FF5722]">{Math.floor(videoCurrentTime * 30)}</strong></span>
          <span className="text-[#E6E3DD]">|</span>
          <span>Time: <strong className="text-[#0284C7]">{formatTime(videoCurrentTime)}</strong></span>
        </div>
      </div>

      {/* Main Video & Forensic Inspection Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Player with Frame Controls */}
        <div className="xl:col-span-2 space-y-5">
          <VideoPlayer />

          {/* Frame Stepping Controls Bar */}
          <div className="bg-white rounded-3xl p-5 shadow-xl border border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#78716C] font-bold">Frame Step:</span>
              <button
                onClick={() => stepFrame(-1)}
                className="btn-ghost flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold"
              >
                <SkipBack className="w-3.5 h-3.5" /> -1s
              </button>
              <button
                onClick={() => stepFrame(-0.033)}
                className="btn-ghost px-3 py-2 rounded-xl text-xs font-bold"
              >
                -1 Frame (33ms)
              </button>
              <button
                onClick={() => stepFrame(0.033)}
                className="btn-ghost px-3 py-2 rounded-xl text-xs font-bold"
              >
                +1 Frame (33ms)
              </button>
              <button
                onClick={() => stepFrame(1)}
                className="btn-ghost flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold"
              >
                +1s <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#78716C] font-bold">Speed:</span>
              <div className="flex items-center gap-1 bg-[#F6F4F0] p-1 rounded-2xl border border-[#E6E3DD]">
                {[0.25, 0.5, 1].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Keyframe Milestone Inspection */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E3DD] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-[#FF5722]" />
                <h3 className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
                  Keyframe Forensic Detail
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#78716C]">
                {activeEvent.timeFormatted}
              </span>
            </div>

            {/* Event Detail Box */}
            <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#FF5722]/30 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#1C1917]">{activeEvent.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeEvent.severity === 'CRITICAL' ? 'bg-[#FFEBEE] text-[#E53935] border border-[#E53935]/30' :
                  activeEvent.severity === 'HIGH' ? 'bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/30' :
                  'bg-white text-[#FF5722] border border-[#FF5722]/30'
                }`}>
                  {activeEvent.severity}
                </span>
              </div>

              <p className="text-xs text-[#57534E] font-medium leading-relaxed">
                {activeEvent.details}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#FF5722]/20 font-mono text-[11px]">
                <div>
                  <span className="text-[#78716C] font-bold">TIMESTAMP:</span>
                  <div className="text-[#1C1917] font-extrabold">{activeEvent.timeFormatted} ({activeEvent.timestamp}s)</div>
                </div>
                <div>
                  <span className="text-[#78716C] font-bold">CONFIDENCE:</span>
                  <div className="text-[#0284C7] font-black">{activeEvent.confidence.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-[#78716C] font-bold">TRACKING ID:</span>
                  <div className="text-[#FF5722] font-black">{activeEvent.trackingId || 'TRK-AUTO'}</div>
                </div>
                <div>
                  <span className="text-[#78716C] font-bold">CAMERA NODE:</span>
                  <div className="text-[#1C1917] font-extrabold">{activeEvent.cameraId}</div>
                </div>
              </div>

              {activeEvent.numberPlate && (
                <div className="pt-2 border-t border-[#FF5722]/20 flex items-center justify-between">
                  <div className="px-3 py-1 rounded-lg bg-[#FEF08A] border-2 border-[#1C1917] font-mono font-black text-xs text-[#1C1917]">
                    {activeEvent.numberPlate}
                  </div>
                  <button
                    onClick={() => {
                      const match = vehicles.find((v) => v.numberPlate === activeEvent.numberPlate);
                      if (match) setSelectedVehicle(match);
                    }}
                    className="text-xs font-extrabold text-[#FF5722] hover:underline"
                  >
                    View Vehicle Record →
                  </button>
                </div>
              )}
            </div>

            {/* List of Keyframe Milestones */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-extrabold text-[#78716C] uppercase tracking-wider">
                Select Forensic Milestone
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {DEMO_SCENARIO_EVENTS.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      setSelectedMilestone(evt.id);
                      seekVideo(evt.timestamp);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedMilestone === evt.id
                        ? 'bg-gradient-to-r from-[#FF7043] to-[#FF5722] text-white font-extrabold shadow-md border-transparent'
                        : 'bg-[#F6F4F0] border-[#E6E3DD] text-[#57534E] hover:bg-[#FFF0E6] hover:text-[#FF5722]'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">
                      {evt.timeFormatted} — {evt.label}
                    </span>
                    <span className={`text-xs font-mono ${selectedMilestone === evt.id ? 'text-white' : 'text-[#0284C7]'}`}>
                      {evt.confidence.toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
