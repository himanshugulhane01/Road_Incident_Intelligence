import React from 'react';
import {
  Settings2,
  Volume2,
  Sparkles,
  User,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DetectionType } from '../types';

export const SettingsPage: React.FC = () => {
  const {
    activeFilters,
    toggleFilter,
    settings,
    updateSettings,
    runDemoScenario,
    user,
    setIsEditProfileOpen,
  } = useApp();

  const detectionCategories: { type: DetectionType; label: string; desc: string }[] = [
    { type: 'VEHICLE', label: 'Vehicle Bounding Boxes', desc: 'Car, Motorcycle, Truck, Bus tracking' },
    { type: 'PERSON', label: 'Person / Pedestrian Detection', desc: 'Pedestrians on sidewalks and zebra crossings' },
    { type: 'NUMBER_PLATE', label: 'ANPR / Number Plate Extraction', desc: 'License plate localization and character recognition' },
    { type: 'NO_HELMET', label: 'No-Helmet Violation Detector', desc: 'Identifies two-wheeler riders without safety helmets' },
    { type: 'HELMET', label: 'Helmet Compliance Tracking', desc: 'Marks verified helmet compliance' },
    { type: 'TRIPLE_RIDING', label: 'Triple-Riding Infraction Detector', desc: 'Flags 3+ passengers mounted on a two-wheeler' },
    { type: 'OVERSPEED', label: 'Speed Limit Telemetry Detector', desc: 'Calculates vehicle pixel trajectory speed' },
    { type: 'WRONG_SIDE', label: 'Wrong-Side Lane Violation', desc: 'Flags vehicles moving counter to lane direction vector' },
    { type: 'RED_LIGHT_VIOLATION', label: 'Red-Light Signal Crossing', desc: 'Detects stop-line breaches during red phases' },
    { type: 'ACCIDENT', label: 'Collision & Accident Perception', desc: 'Sudden deceleration and impact bounding box alarms' },
  ];

  return (
    <div className="space-y-6 select-none max-w-5xl mx-auto">
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
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>System Configuration & AI Model Parameters</span>
              <span className="badge-ok font-bold">
                SETTINGS
              </span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Adjust neural perception classes, confidence thresholds, and system preferences
            </p>
          </div>
        </div>

        <button
          onClick={runDemoScenario}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-md hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Reset & Replay Demo</span>
        </button>
      </div>

      {/* Operator Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#0F172A] text-white border-2 border-[#EA580C] shadow-md">
              <User className="w-7 h-7 text-[#EA580C]" />
            </div>
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-xs" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold text-[#0F172A]">
                {user ? user.name : 'Cmdr. Alex Vance'}
              </h2>
              <span className="text-xs font-mono-tech px-2 py-0.5 rounded-xl bg-[#FEF08A] text-[#0F172A] border border-[#0F172A] font-bold">
                {user ? user.badgeNumber || 'TP-8842' : 'TP-8842'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-semibold">
              {user ? user.role : 'Central Control Officer'} — {user ? user.agency || 'Central Command' : 'Central Command'}
            </p>
            <p className="text-xs text-[#EA580C] font-mono font-bold">
              Email: {user ? user.email : 'alex.vance@traffic.gov.in'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-md hover:scale-105"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile Credentials</span>
        </button>
      </div>

      {/* Confidence Threshold & Audio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confidence Slider */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
              Global Confidence Threshold
            </span>
            <span className="text-[#FF5722] font-mono font-black text-base">{settings.confidenceThreshold}%</span>
          </div>
          <p className="text-xs text-[#57534E] font-medium leading-relaxed">
            Detections and bounding boxes below this confidence level will be filtered from HUD overlays and alert generators.
          </p>
          <input
            type="range"
            min="40"
            max="99"
            value={settings.confidenceThreshold}
            onChange={(e) => updateSettings({ confidenceThreshold: Number(e.target.value) })}
            className="w-full accent-[#FF5722] cursor-pointer mt-2"
          />
          <div className="flex justify-between text-[11px] font-mono font-bold text-[#78716C]">
            <span>40% (Permissive)</span>
            <span>70% (Balanced)</span>
            <span>99% (Strict)</span>
          </div>
        </div>

        {/* Audio Alerts Toggle */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
                Auditory Alert Chimes
              </span>
              <Volume2 className="w-5 h-5 text-[#FF5722]" />
            </div>
            <p className="text-xs text-[#57534E] font-medium mt-2 leading-relaxed">
              Synthesized audio tones for CRITICAL and HIGH severity traffic infractions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E6E3DD]">
            <span className="text-xs font-bold text-[#1C1917]">Sound Effects Enabled</span>
            <button
              onClick={() => updateSettings({ soundAlerts: !settings.soundAlerts })}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                settings.soundAlerts
                  ? 'bg-gradient-to-r from-[#FF7043] to-[#FF5722] text-white shadow-md'
                  : 'bg-[#F6F4F0] text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {settings.soundAlerts ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Detection Models Checklist */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-5">
        <div className="border-b border-[#E6E3DD] pb-3">
          <h3 className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
            Perception Classifier Toggles
          </h3>
          <p className="text-xs text-[#78716C] font-medium mt-1">
            Enable or disable specific neural vision sub-models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detectionCategories.map((cat) => {
            const isEnabled = activeFilters.includes(cat.type);
            return (
              <div
                key={cat.type}
                onClick={() => toggleFilter(cat.type)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEnabled
                    ? 'bg-[#FFF0E6] border-[#FF5722]/40 shadow-sm'
                    : 'bg-[#F6F4F0] border-[#E6E3DD] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="font-extrabold text-xs text-[#1C1917]">{cat.label}</div>
                  <div className="text-[11px] text-[#78716C] font-semibold">{cat.desc}</div>
                </div>

                <div
                  className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                    isEnabled
                      ? 'bg-[#FF5722] text-white shadow-md'
                      : 'bg-white border border-[#E6E3DD] text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
