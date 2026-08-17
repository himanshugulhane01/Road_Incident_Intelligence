import { DetectionType, Severity } from '../types';

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getSeverityBadgeClass(severity: Severity): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-950/80 border-red-500/80 text-red-300 shadow-red-950/50';
    case 'HIGH':
      return 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-amber-950/50';
    case 'MEDIUM':
      return 'bg-yellow-950/70 border-yellow-500/70 text-yellow-300 shadow-yellow-950/50';
    case 'LOW':
    default:
      return 'bg-sky-950/70 border-sky-500/70 text-sky-300 shadow-sky-950/50';
  }
}

export function getSeverityBorderColor(severity: Severity): string {
  switch (severity) {
    case 'CRITICAL':
      return '#ef4444';
    case 'HIGH':
      return '#f97316';
    case 'MEDIUM':
      return '#eab308';
    case 'LOW':
    default:
      return '#0284c7';
  }
}

export function getDetectionTypeLabel(type: DetectionType): string {
  switch (type) {
    case 'NUMBER_PLATE':
      return 'Number Plate';
    case 'HELMET':
      return 'Helmet Verified';
    case 'NO_HELMET':
      return 'No Helmet Violation';
    case 'TRIPLE_RIDING':
      return 'Triple Riding';
    case 'OVERSPEED':
      return 'Overspeeding';
    case 'WRONG_SIDE':
      return 'Wrong Side Driving';
    case 'RED_LIGHT_VIOLATION':
      return 'Red Light Violation';
    case 'ACCIDENT':
      return 'Accident / Collision';
    case 'SUSPICIOUS_VEHICLE':
      return 'Suspicious Vehicle';
    case 'VEHICLE':
      return 'Vehicle Detection';
    case 'PERSON':
      return 'Pedestrian / Person';
    case 'ALL':
    default:
      return 'All Detections';
  }
}

export function exportDataAsJSON(data: unknown, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDataAsCSV(data: Array<Record<string, unknown>>, filename: string) {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(','),
    ...data.map((row) =>
      keys
        .map((k) => {
          const val = row[k];
          if (val === null || val === undefined) return '""';
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];
  const csvStr = csvRows.join('\n');
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Audio alert generator using Web Audio API (safe, no external sound assets required)
export function playAlertTone(severity: Severity) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (severity === 'CRITICAL') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (severity === 'HIGH') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // Web audio might be blocked by browser autoplay policy before user gesture
  }
}
