import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  MapPin,
  Camera,
  FileText,
  Hash,
  Gauge,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DetectionType, Severity } from '../types';

const VIOLATION_TYPES: { value: DetectionType; label: string }[] = [
  { value: 'NO_HELMET', label: 'No Helmet Violation' },
  { value: 'OVERSPEED', label: 'Overspeeding' },
  { value: 'TRIPLE_RIDING', label: 'Triple Riding' },
  { value: 'WRONG_SIDE', label: 'Wrong Side Driving' },
  { value: 'RED_LIGHT_VIOLATION', label: 'Red Light Violation' },
  { value: 'ACCIDENT', label: 'Accident / Collision' },
  { value: 'SUSPICIOUS_VEHICLE', label: 'Suspicious Vehicle' },
  { value: 'NUMBER_PLATE', label: 'Number Plate Issue' },
];

export const ReportIncidentPage: React.FC = () => {
  const { addManualIncident, cameras, setCurrentRoute } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: 'NO_HELMET' as DetectionType,
    title: '',
    severity: 'HIGH' as Severity,
    location: '',
    camera: cameras[0]?.id || 'CAM-01',
    numberPlate: '',
    description: '',
    confidence: 90,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'confidence' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      return;
    }

    addManualIncident({
      type: formData.type,
      title: formData.title.trim(),
      severity: formData.severity,
      location: formData.location.trim(),
      camera: formData.camera,
      numberPlate: formData.numberPlate.trim() || undefined,
      description: formData.description.trim(),
      confidence: formData.confidence,
    });

    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        type: 'NO_HELMET',
        title: '',
        severity: 'HIGH',
        location: '',
        camera: cameras[0]?.id || 'CAM-01',
        numberPlate: '',
        description: '',
        confidence: 90,
      });
      setSubmitted(false);
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 max-w-md shadow-2xl border border-black/5 animate-in fade-in zoom-in">
          <div className="w-16 h-16 rounded-full bg-[#E0F2FE] border border-[#0284C7]/30 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 text-[#0284C7]" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1C1917]">
            Incident Reported Successfully
          </h2>
          <p className="text-xs text-[#78716C] font-semibold leading-relaxed">
            The manual incident and corresponding real-time alert have been dispatched to the control hub.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentRoute('incidents')}
              className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-lg"
            >
              View Incidents
            </button>
            <button
              onClick={() => setCurrentRoute('alerts')}
              className="btn-ghost px-5 py-2.5 rounded-2xl text-xs font-extrabold"
            >
              View Alerts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
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
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#1C1917]">
              Report Road Incident & Violation
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Manually log a traffic infraction to dispatch push alerts and e-challan records
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Type + Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
                <AlertTriangle className="w-4 h-4 text-[#FF5722]" />
                <span>Violation Type</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input-field text-xs font-bold"
              >
                {VIOLATION_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>
                    {vt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
                <Gauge className="w-4 h-4 text-[#FF5722]" />
                <span>Severity Level</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="input-field text-xs font-bold"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
              <FileText className="w-4 h-4 text-[#FF5722]" />
              <span>Incident Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Rider without helmet detected at Junction 4"
              required
              className="input-field text-xs font-semibold"
            />
          </div>

          {/* Row 2: Location + Camera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
                <MapPin className="w-4 h-4 text-[#FF5722]" />
                <span>Location</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sector 4 Junction, Main Flyover"
                required
                className="input-field text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
                <Camera className="w-4 h-4 text-[#FF5722]" />
                <span>Source Camera Node</span>
              </label>
              <select
                name="camera"
                value={formData.camera}
                onChange={handleChange}
                className="input-field text-xs font-bold"
              >
                {cameras.map((cam) => (
                  <option key={cam.id} value={cam.id}>
                    {cam.id} — {cam.location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Number Plate + Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
                <Hash className="w-4 h-4 text-[#FF5722]" />
                <span>License Plate (Optional)</span>
              </label>
              <input
                type="text"
                name="numberPlate"
                value={formData.numberPlate}
                onChange={handleChange}
                placeholder="e.g. MH12AB9842"
                className="input-field text-xs font-mono font-bold uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-extrabold text-[#1C1917]">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#FF5722]" />
                  <span>Perception Confidence</span>
                </div>
                <span className="font-mono text-[#FF5722] text-xs">{formData.confidence}%</span>
              </label>
              <input
                type="range"
                name="confidence"
                min="40"
                max="100"
                value={formData.confidence}
                onChange={handleChange}
                className="w-full accent-[#FF5722] cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-extrabold text-[#1C1917]">
              <FileText className="w-4 h-4 text-[#FF5722]" />
              <span>Detailed Incident Notes</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the violation, vehicle direction, or officer observations..."
              required
              className="input-field text-xs font-semibold resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E3DD]">
            <button
              type="button"
              onClick={() => setCurrentRoute('dashboard')}
              className="btn-ghost px-6 py-3 rounded-2xl text-xs font-extrabold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-extrabold shadow-lg hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT INCIDENT REPORT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
