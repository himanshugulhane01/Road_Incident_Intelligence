import React from 'react';
import { Filter, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DetectionType } from '../../types';

interface FilterOption {
  type: DetectionType;
  label: string;
  category: 'ALL' | 'PLATE' | 'VIOLATION' | 'OBJECT' | 'INCIDENT';
}

const FILTER_OPTIONS: FilterOption[] = [
  { type: 'ALL', label: 'All Detections', category: 'ALL' },
  { type: 'NUMBER_PLATE', label: 'Number Plate', category: 'PLATE' },
  { type: 'HELMET', label: 'Helmet ✓', category: 'VIOLATION' },
  { type: 'NO_HELMET', label: 'No Helmet', category: 'VIOLATION' },
  { type: 'TRIPLE_RIDING', label: 'Triple Riding', category: 'VIOLATION' },
  { type: 'OVERSPEED', label: 'Overspeed', category: 'VIOLATION' },
  { type: 'WRONG_SIDE', label: 'Wrong Side', category: 'VIOLATION' },
  { type: 'RED_LIGHT_VIOLATION', label: 'Red Light', category: 'VIOLATION' },
  { type: 'ACCIDENT', label: 'Accident', category: 'INCIDENT' },
  { type: 'SUSPICIOUS_VEHICLE', label: 'Suspicious', category: 'INCIDENT' },
  { type: 'VEHICLE', label: 'Vehicle', category: 'OBJECT' },
  { type: 'PERSON', label: 'Person', category: 'OBJECT' },
];

const getPillStyle = (isSelected: boolean, category: string): React.CSSProperties => {
  if (!isSelected) {
    return {
      background: '#F6F4F0',
      border: '1px solid #E6E3DD',
      color: '#78716C',
    };
  }
  if (category === 'ALL') {
    return {
      background: '#E0F2FE',
      border: '1px solid rgba(2,132,199,0.3)',
      color: '#0284C7',
      boxShadow: '0 4px 12px rgba(2,132,199,0.15)',
    };
  }
  if (category === 'VIOLATION' || category === 'INCIDENT') {
    return {
      background: '#FFEBEE',
      border: '1px solid rgba(229,57,53,0.3)',
      color: '#E53935',
      boxShadow: '0 4px 12px rgba(229,57,53,0.15)',
    };
  }
  if (category === 'PLATE') {
    return {
      background: '#FFF3E0',
      border: '1px solid rgba(230,81,0,0.3)',
      color: '#E65100',
      boxShadow: '0 4px 12px rgba(230,81,0,0.15)',
    };
  }
  return {
    background: 'linear-gradient(135deg, #FF7043, #FF5722)',
    border: 'none',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(255,87,34,0.35)',
  };
};

export const DetectionFilterBar: React.FC = () => {
  const { activeFilters, toggleFilter, clearFilters } = useApp();
  const isAllSelected = activeFilters.includes('ALL');

  return (
    <div
      id="detection-filter-container"
      className="glass-panel rounded-3xl p-4 select-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4" style={{ color: '#FF5722' }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: '#1C1917', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Detection Filters
          </span>
          <span style={{ fontSize: 11, color: '#78716C', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            — video · timeline · alerts · forensics
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: 11, color: '#78716C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            Active:{' '}
            <strong style={{ color: isAllSelected ? '#0284C7' : '#FF5722' }}>
              {isAllSelected ? 'ALL' : activeFilters.join(' + ')}
            </strong>
          </span>
          {!isAllSelected && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 rounded-full transition-all cursor-pointer font-bold"
              style={{
                background: '#FFEBEE',
                border: '1px solid rgba(229,57,53,0.3)',
                color: '#E53935',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const isSelected = activeFilters.includes(opt.type);
          return (
            <button
              key={opt.type}
              id={`filter-btn-${opt.type.toLowerCase()}`}
              onClick={() => toggleFilter(opt.type)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs transition-all cursor-pointer font-bold"
              style={{
                ...getPillStyle(isSelected, opt.category),
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11,
              }}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
