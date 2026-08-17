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
import { VideoUploadModal } from '../components/video/VideoUploadModal';
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

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('DET-003');

  const activeEvent = DEMO_SCENARIO_EVENTS.find((e) => e.id === selectedMilestone) || DEMO_SCENARIO_EVENTS[2];

  const stepFrame = (seconds: number) => {
    setVideoCurrentTime((prev) => Math.max(0, prev + seconds));
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="light-card rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 border border-[#CBD5E1] bg-white shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs bg-[#0F172A] text-[#EA580C] shrink-0">
            <FileVideo className="w-5 h-5 text-[#EA580C]" />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2.5 text-[#0F172A] leading-tight">
              <span>Deep Video Forensic Analyzer</span>
              <span className="badge-ok font-bold text-[10px]">FRAME-STEPPING FORENSICS</span>
            </h1>
            <p className="text-xs mt-0.5 font-medium text-[#475569]">
              Temporal analysis, multi-frame keypoint verification, and speed trajectory breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-tech font-bold text-[#0F172A] bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#CBD5E1]">
          <span>Current Frame: <strong className="text-[#EA580C] font-extrabold">{Math.floor(videoCurrentTime * 30)}</strong></span>
          <span className="text-[#CBD5E1]">|</span>
          <span>Time: <strong className="text-[#0284C7] font-extrabold">{formatTime(videoCurrentTime)}</strong></span>
        </div>
      </div>

      {/* Main Video & Forensic Inspection Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Video Player with Frame Controls */}
        <div className="xl:col-span-2 space-y-5">
          <VideoPlayer onOpenUploadModal={() => setIsUploadModalOpen(true)} />

          {/* Frame Stepping Controls Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#CBD5E1] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#334155] font-bold">Frame Step:</span>
              <button
                onClick={() => stepFrame(-1)}
                className="btn-ghost flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                <SkipBack className="w-3.5 h-3.5" /> -1s
              </button>
              <button
                onClick={() => stepFrame(-0.033)}
                className="btn-ghost px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                -1 Frame (33ms)
              </button>
              <button
                onClick={() => stepFrame(0.033)}
                className="btn-ghost px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                +1 Frame (33ms)
              </button>
              <button
                onClick={() => stepFrame(1)}
                className="btn-ghost flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                +1s <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#334155] font-bold">Speed:</span>
              <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#CBD5E1]">
                {[0.25, 0.5, 1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tech font-bold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0F172A]'
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
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#CBD5E1] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4.5 h-4.5 text-[#EA580C]" />
                <h3 className="text-xs font-bold font-mono-tech text-[#0F172A] uppercase tracking-wide">
                  Keyframe Forensic Detail
                </h3>
              </div>
              <span className="text-xs font-mono-tech font-bold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#FFEDD5]">
                {activeEvent.timeFormatted}
              </span>
            </div>

            {/* Event Detail Box */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#0F172A]">{activeEvent.label}</span>
                <span className={
                  activeEvent.severity === 'CRITICAL' ? 'badge-critical' :
                  activeEvent.severity === 'HIGH' ? 'badge-warning' :
                  'badge-info'
                }>
                  {activeEvent.severity}
                </span>
              </div>

              <p className="text-xs text-[#475569] font-medium leading-relaxed">
                {activeEvent.details}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E2E8F0] font-mono-tech text-xs">
                <div>
                  <span className="text-[#64748B] font-bold text-[10px]">TIMESTAMP:</span>
                  <div className="text-[#0F172A] font-bold text-xs">{activeEvent.timeFormatted} ({activeEvent.timestamp}s)</div>
                </div>
                <div>
                  <span className="text-[#64748B] font-bold text-[10px]">CONFIDENCE:</span>
                  <div className="text-[#0284C7] font-bold text-xs">{activeEvent.confidence.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-[#64748B] font-bold text-[10px]">TRACKING ID:</span>
                  <div className="text-[#EA580C] font-bold text-xs">{activeEvent.trackingId || 'TRK-AUTO'}</div>
                </div>
                <div>
                  <span className="text-[#64748B] font-bold text-[10px]">CAMERA NODE:</span>
                  <div className="text-[#0F172A] font-bold text-xs">{activeEvent.cameraId}</div>
                </div>
              </div>

              {activeEvent.numberPlate && (
                <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="px-3 py-1 rounded-lg bg-[#FEF08A] border-2 border-[#0F172A] font-mono-tech font-bold text-xs text-[#0F172A]">
                    {activeEvent.numberPlate}
                  </div>
                  <button
                    onClick={() => {
                      const match = vehicles.find((v) => v.numberPlate === activeEvent.numberPlate);
                      if (match) setSelectedVehicle(match);
                    }}
                    className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
                  >
                    View Vehicle Record →
                  </button>
                </div>
              )}
            </div>

            {/* List of Keyframe Milestones */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold font-mono-tech text-[#475569] uppercase tracking-wide">
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
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      selectedMilestone === evt.id
                        ? 'bg-[#0F172A] text-white font-bold border-[#0F172A] shadow-xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">
                      {evt.timeFormatted} — {evt.label}
                    </span>
                    <span className={`text-xs font-mono-tech ${selectedMilestone === evt.id ? 'text-[#EA580C]' : 'text-[#0284C7]'}`}>
                      {evt.confidence.toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};
