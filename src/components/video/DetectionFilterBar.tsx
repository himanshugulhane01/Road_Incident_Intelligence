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

const getPillClass = (isSelected: boolean): string => {
  if (isSelected) {
    return 'bg-[#EA580C] text-white border border-[#EA580C] shadow-xs font-bold hover:bg-[#C2410C]';
  }
  return 'bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] hover:bg-[#F1F5F9] hover:border-[#0F172A] font-semibold';
};

export const DetectionFilterBar: React.FC = () => {
  const { activeFilters, toggleFilter, clearFilters } = useApp();
  const isAllSelected = activeFilters.includes('ALL');

  return (
    <div
      id="detection-filter-container"
      className="light-card rounded-2xl p-4 select-none border border-[#CBD5E1] bg-white shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <Filter className="w-4 h-4 text-[#EA580C]" />
          <span className="text-xs font-bold font-mono-tech uppercase tracking-wide text-[#0F172A]">
            Detection Filters
          </span>
          <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
            — video · timeline · alerts · forensics
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono-tech text-[#475569] font-medium">
            Active:{' '}
            <strong className="text-[#EA580C] font-bold">
              {isAllSelected ? 'ALL' : activeFilters.join(' + ')}
            </strong>
          </span>
          {!isAllSelected && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] hover:bg-[#FFE4E6] text-xs font-bold font-mono-tech cursor-pointer transition-all"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${getPillClass(
                isSelected
              )}`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
