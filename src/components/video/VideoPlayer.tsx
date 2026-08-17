import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Upload,
  Camera,
  Maximize2,
  Cpu,
  Layers,
  Settings2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DetectionOverlay } from './DetectionOverlay';
import { formatTime } from '../../utils/helpers';

interface VideoPlayerProps {
  onOpenUploadModal?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ onOpenUploadModal }) => {
  const {
    videoCurrentTime,
    setVideoCurrentTime,
    isVideoPlaying,
    setIsVideoPlaying,
    videoDuration,
    setVideoDuration,
    playbackSpeed,
    setPlaybackSpeed,
    videoSourceType,
    uploadedVideoUrl,
    activeVideoName,
    isAnalysisActive,
    startAnalysis,
    pauseAnalysis,
    stopAnalysis,
    restartAnalysis,
    cameras,
    loadSamplePreset,
    settings,
    updateSettings,
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync HTML5 video playback state & rate
  useEffect(() => {
    const el = videoElementRef.current;
    if (!el) return;

    if (isVideoPlaying && el.paused) {
      el.play().catch(() => {});
    } else if (!isVideoPlaying && !el.paused) {
      el.pause();
    }
    el.playbackRate = playbackSpeed;
  }, [isVideoPlaying, playbackSpeed]);

  const handleSeek = (newTime: number) => {
    setVideoCurrentTime(newTime);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const videoSourceUrl = uploadedVideoUrl || '/VP/Video Project rii.mp4';

  return (
    <div
      ref={containerRef}
      id="roadguard-video-player-container"
      className="glass-panel rounded-xl overflow-hidden flex flex-col relative group select-none"
      style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(68,138,255,0.10)' }}
    >
      {/* Video Stream Stage */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={videoElementRef}
          src={videoSourceUrl}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          loop
          muted={false}
          onTimeUpdate={(e) => {
            setVideoCurrentTime(e.currentTarget.currentTime);
            if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
              setVideoDuration(e.currentTarget.duration);
            }
          }}
          onLoadedMetadata={(e) => {
            if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
              setVideoDuration(e.currentTarget.duration);
            }
          }}
        />

        {/* AI Bounding Box Overlay */}
        <DetectionOverlay />

        {/* Top Status Banner on Video */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-md" style={{ background: 'rgba(28, 25, 23, 0.75)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#FFFFFF', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7', display: 'inline-block', animation: 'pulse-warning 2s ease-in-out infinite' }}></span>
              {activeVideoName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAnalysisActive && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-md" style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)', border: 'none', fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FFFFFF', fontWeight: 800 }}>
                <Cpu className="w-3.5 h-3.5 text-white" />
                AI INFERENCE ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scrub Bar */}
      <div className="px-5 pt-3 pb-2.5" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-3">
          <span className="data-value" style={{ fontSize: 12, color: '#FF5722', minWidth: 45, fontWeight: 700 }}>
            {formatTime(videoCurrentTime)}
          </span>
          <input
            id="video-scrubber-slider"
            type="range"
            min={0}
            max={videoDuration}
            step={0.1}
            value={videoCurrentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: '#FF5722', background: '#FFF0E6' }}
          />
          <span className="data-value" style={{ fontSize: 12, color: '#78716C', minWidth: 45, textAlign: 'right', fontWeight: 600 }}>
            {formatTime(videoDuration)}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ background: '#FFFFFF', borderTop: '1px solid #E6E3DD' }}>
        {/* Left Playback & AI Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            id="video-play-pause-btn"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF7043, #FF5722)', color: '#FFFFFF' }}
            title={isVideoPlaying ? 'Pause' : 'Play'}
          >
            {isVideoPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
          </button>

          <button
            id="video-restart-btn"
            onClick={restartAnalysis}
            className="p-2 rounded-xl transition-all cursor-pointer hover:bg-[#FFF0E6]"
            style={{ background: '#F6F4F0', border: '1px solid #E6E3DD', color: '#78716C' }}
            title="Restart from 00:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* AI Analysis Master Start / Stop */}
          {isAnalysisActive ? (
            <button
              id="stop-ai-analysis-btn"
              onClick={stopAnalysis}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer"
              style={{ background: '#FFF3E0', border: '1px solid rgba(230,81,0,0.3)', color: '#E65100', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11 }}
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE AI</span>
            </button>
          ) : (
            <button
              id="start-ai-analysis-btn"
              onClick={startAnalysis}
              className="btn-primary flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>START AI ANALYSIS</span>
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-1 p-1 rounded-xl" style={{ background: '#F6F4F0', border: '1px solid #E6E3DD' }}>
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  setPlaybackSpeed(spd);
                  if (videoElementRef.current) {
                    videoElementRef.current.playbackRate = spd;
                  }
                }}
                className="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  background: playbackSpeed === spd ? 'linear-gradient(135deg, #FF7043, #FF5722)' : 'transparent',
                  color: playbackSpeed === spd ? '#FFFFFF' : '#78716C',
                  boxShadow: playbackSpeed === spd ? '0 4px 10px rgba(255,87,34,0.3)' : 'none',
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Right Source Selectors & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Camera Preset Switcher */}
          <select
            id="camera-preset-selector"
            onChange={(e) => loadSamplePreset(e.target.value)}
            className="input-field cursor-pointer font-bold"
            defaultValue="CAM-02"
            style={{ width: 'auto', padding: '6px 12px', fontSize: 11 }}
          >
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.name.slice(0, 20)}
              </option>
            ))}
          </select>

          {/* Upload Video Trigger */}
          <button
            id="upload-video-trigger-btn"
            onClick={onOpenUploadModal}
            className="btn-ghost flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Video</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl transition-all hover:bg-[#FFF0E6]"
            style={{ background: '#F6F4F0', border: '1px solid #E6E3DD', color: '#78716C' }}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
