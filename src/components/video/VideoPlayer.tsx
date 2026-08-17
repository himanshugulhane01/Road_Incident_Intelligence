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

  // Time advancement loop for synthetic canvas or fallback
  useEffect(() => {
    if (!isVideoPlaying) return;

    const interval = setInterval(() => {
      setVideoCurrentTime((prev) => {
        if (prev >= videoDuration) {
          return 0; // loop
        }
        return prev + 0.1 * playbackSpeed;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVideoPlaying, playbackSpeed, videoDuration, setVideoCurrentTime]);

  // Sync HTML5 video tag if uploaded
  useEffect(() => {
    const el = videoElementRef.current;
    if (!el || videoSourceType !== 'UPLOADED') return;

    if (isVideoPlaying && el.paused) {
      el.play().catch(() => {});
    } else if (!isVideoPlaying && !el.paused) {
      el.pause();
    }
    el.playbackRate = playbackSpeed;
  }, [isVideoPlaying, playbackSpeed, videoSourceType]);

  // Synthetic CCTV Canvas Generator (Renders road, vehicles, lane markers, traffic lights)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || videoSourceType === 'UPLOADED') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const time = videoCurrentTime;

      // 1. Asphalt Road Surface
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Road Perspective
      const roadTop = h * 0.25;
      const roadBottom = h;
      const roadTopLeft = w * 0.35;
      const roadTopRight = w * 0.65;
      const roadBottomLeft = 0;
      const roadBottomRight = w;

      // Draw Main Road Polygon
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(roadTopLeft, roadTop);
      ctx.lineTo(roadTopRight, roadTop);
      ctx.lineTo(roadBottomRight, roadBottom);
      ctx.lineTo(roadBottomLeft, roadBottom);
      ctx.closePath();
      ctx.fill();

      // Road Borders & Curbs
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Center Lane Dashed Lines
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, roadTop);
      ctx.lineTo(w * 0.5, roadBottom);
      ctx.stroke();

      // Secondary Lane Dividers
      ctx.strokeStyle = '#e2e8f0';
      ctx.setLineDash([8, 14]);
      ctx.beginPath();
      ctx.moveTo(w * 0.42, roadTop);
      ctx.lineTo(w * 0.25, roadBottom);
      ctx.moveTo(w * 0.58, roadTop);
      ctx.lineTo(w * 0.75, roadBottom);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Crosswalk / Stop Bar
      ctx.fillStyle = '#cbd5e1';
      for (let i = 0; i < 9; i++) {
        const xOffset = w * 0.28 + i * (w * 0.05);
        ctx.fillRect(xOffset, h * 0.78, w * 0.035, 12);
      }

      // Background Scenery / Overpass
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, roadTop);
      ctx.fillStyle = '#334155';
      ctx.fillRect(w * 0.1, roadTop - 40, w * 0.8, 14);

      // Traffic Signal Light Simulation
      const lightX = w * 0.88;
      const lightY = roadTop - 20;
      ctx.fillStyle = '#111827';
      ctx.fillRect(lightX - 8, lightY - 24, 16, 48);
      // Red light or Green light depending on time
      const isRedPhase = Math.floor(time) >= 36 && Math.floor(time) <= 42;
      ctx.fillStyle = isRedPhase ? '#ef4444' : '#22c55e';
      ctx.beginPath();
      ctx.arc(lightX, isRedPhase ? lightY - 14 : lightY + 14, 6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Animated Simulated Vehicles (Moving down perspective)
      const tMod = time % 12;

      // Vehicle 1: Motorcycle (MH27AB1234)
      const v1Progress = (time * 0.08) % 1;
      const v1X = w * 0.48 - (w * 0.05) * v1Progress;
      const v1Y = roadTop + (roadBottom - roadTop) * v1Progress;
      const v1Scale = 0.4 + v1Progress * 0.8;

      ctx.save();
      ctx.translate(v1X, v1Y);
      ctx.scale(v1Scale, v1Scale);
      // Bike Body
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-8, -20, 16, 40);
      // Rider Head
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -6, 7, 0, Math.PI * 2);
      ctx.fill();
      // Headlight glow
      ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
      ctx.beginPath();
      ctx.moveTo(-10, 20);
      ctx.lineTo(-30, 80);
      ctx.lineTo(30, 80);
      ctx.lineTo(10, 20);
      ctx.fill();
      ctx.restore();

      // Vehicle 2: SUV / Car (Moving across)
      const v2Progress = ((time + 4) * 0.06) % 1;
      const v2X = w * 0.58 + (w * 0.15) * v2Progress;
      const v2Y = roadTop + (roadBottom - roadTop) * v2Progress;
      const v2Scale = 0.5 + v2Progress * 0.9;

      ctx.save();
      ctx.translate(v2X, v2Y);
      ctx.scale(v2Scale, v2Scale);
      // Car Body
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-22, -35, 44, 70);
      // Roof / Windshield
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -18, 32, 36);
      ctx.restore();

      // Pedestrian on Crosswalk (Campus or junction)
      const pedProgress = ((time + 2) * 0.05) % 1;
      const pedX = w * 0.2 + (w * 0.6) * pedProgress;
      const pedY = h * 0.78 + 6;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(pedX, pedY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Optical CCTV Watermark & Grid
      ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
      ctx.font = '11px monospace';
      ctx.fillText(
        `● LIVE CCTV | ${activeVideoName.slice(0, 30)} | ${formatTime(time)} / 01:00 | 30 FPS`,
        14,
        24
      );

      ctx.fillStyle = 'rgba(244, 63, 94, 0.8)';
      ctx.fillText('REC [SIMULATED FEED]', w - 150, 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoCurrentTime, videoSourceType, activeVideoName]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      id="roadguard-video-player-container"
      className="glass-panel rounded-xl overflow-hidden flex flex-col relative group select-none"
      style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(68,138,255,0.10)' }}
    >
      {/* Video Stream Stage */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {videoSourceType === 'UPLOADED' && uploadedVideoUrl ? (
          <video
            ref={videoElementRef}
            src={uploadedVideoUrl}
            className="w-full h-full object-contain"
            playsInline
            onTimeUpdate={(e) => {
              setVideoCurrentTime(e.currentTarget.currentTime);
              if (e.currentTarget.duration) {
                setVideoDuration(e.currentTarget.duration);
              }
            }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-cover"
          />
        )}

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
            onChange={(e) => setVideoCurrentTime(parseFloat(e.target.value))}
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
                onClick={() => setPlaybackSpeed(spd)}
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
