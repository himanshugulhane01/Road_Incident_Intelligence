import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Camera,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { stats, incidents } = useApp();

  const hourlyTrends = [
    { time: '00:00', detections: 140, violations: 12 },
    { time: '04:00', detections: 80, violations: 5 },
    { time: '08:00', detections: 620, violations: 48 },
    { time: '12:00', detections: 890, violations: 65 },
    { time: '16:00', detections: 940, violations: 82 },
    { time: '18:00', detections: 1120, violations: 96 },
    { time: '20:00', detections: 780, violations: 54 },
    { time: '22:00', detections: 340, violations: 28 },
  ];

  const violationTypesData = [
    { name: 'No Helmet', count: 42, color: '#FF7043' },
    { name: 'Overspeed', count: 35, color: '#E53935' },
    { name: 'Triple Riding', count: 18, color: '#FF5722' },
    { name: 'Wrong Side', count: 14, color: '#E65100' },
    { name: 'Red Light', count: 22, color: '#FF9800' },
    { name: 'Suspicious', count: 9, color: '#0284C7' },
  ];

  const cameraDistributionData = [
    { camera: 'CAM-01', location: 'Highway North Gate', count: 68 },
    { camera: 'CAM-02', location: 'City Center Flyover', count: 92 },
    { camera: 'CAM-03', location: 'Industrial Sector 5', count: 34 },
    { camera: 'CAM-04', location: 'Expressway Toll Junction', count: 56 },
  ];

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
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold flex items-center gap-2.5 text-[#1C1917]">
              <span>Traffic & Road Safety Intelligence Analytics</span>
              <span className="badge-ok font-bold">
                AI METRICS ACTIVE
              </span>
            </h1>
            <p className="text-xs mt-1 font-semibold text-[#78716C]">
              Temporal distribution, camera violation density, and predictive safety telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 hover:scale-[1.01] transition-all space-y-2">
          <div className="text-[#78716C] text-xs font-extrabold uppercase flex items-center justify-between">
            <span>Peak Violation Period</span>
            <Activity className="w-4 h-4 text-[#FF5722]" />
          </div>
          <div className="text-2xl font-black text-[#FF5722]">18:00 - 19:30</div>
          <div className="text-xs text-[#78716C] font-semibold">Evening Rush Hour peak density</div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 hover:scale-[1.01] transition-all space-y-2">
          <div className="text-[#78716C] text-xs font-extrabold uppercase flex items-center justify-between">
            <span>Top Infraction Category</span>
            <AlertTriangle className="w-4 h-4 text-[#E53935]" />
          </div>
          <div className="text-2xl font-black text-[#E53935]">No Helmet (35%)</div>
          <div className="text-xs text-[#78716C] font-semibold">Primarily two-wheeler commuters</div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 hover:scale-[1.01] transition-all space-y-2">
          <div className="text-[#78716C] text-xs font-extrabold uppercase flex items-center justify-between">
            <span>Highest Risk Junction</span>
            <Camera className="w-4 h-4 text-[#FF7043]" />
          </div>
          <div className="text-2xl font-black text-[#1C1917]">CAM-02 Flyover</div>
          <div className="text-xs text-[#78716C] font-semibold">92 total incidents logged today</div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg border border-black/5 hover:scale-[1.01] transition-all space-y-2">
          <div className="text-[#78716C] text-xs font-extrabold uppercase flex items-center justify-between">
            <span>OCR Confidence Avg</span>
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-2xl font-black text-[#0284C7]">98.4%</div>
          <div className="text-xs text-[#78716C] font-semibold">Across {stats.numberPlatesDetected || 128} plate reads</div>
        </div>
      </div>

      {/* Primary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Volume & Violation Trends */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DD] pb-3">
            <h3 className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
              24-Hour Traffic Volume vs. Violations
            </h3>
            <span className="text-xs font-mono font-semibold text-[#78716C]">Hourly Aggregation</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrends}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7043" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF7043" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E53935" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E53935" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E3DD" opacity={0.6} />
                <XAxis dataKey="time" stroke="#78716C" fontSize={11} fontWeight={600} />
                <YAxis stroke="#78716C" fontSize={11} fontWeight={600} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6E3DD',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="detections"
                  stroke="#FF7043"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDetections)"
                  name="Vehicles"
                />
                <Area
                  type="monotone"
                  dataKey="violations"
                  stroke="#E53935"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViolations)"
                  name="Violations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations Breakdown Pie */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E3DD] pb-3">
            <h3 className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
              Violation Type Distribution
            </h3>
            <span className="text-xs font-mono font-semibold text-[#78716C]">Class Share</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={violationTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {violationTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6E3DD',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#57534E] pt-2 border-t border-[#E6E3DD]">
            {violationTypesData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">
                  {item.name}: <strong className="text-[#1C1917]">{item.count}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Camera Node Violation Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-black/5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E6E3DD] pb-3">
            <h3 className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider">
              Violations Density by Connected CCTV Node
            </h3>
            <span className="text-xs font-mono font-semibold text-[#78716C]">4 Active Nodes</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cameraDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E3DD" opacity={0.6} />
                <XAxis dataKey="camera" stroke="#78716C" fontSize={11} fontWeight={600} />
                <YAxis stroke="#78716C" fontSize={11} fontWeight={600} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6E3DD',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="count" fill="#FF5722" radius={[6, 6, 0, 0]} name="Incidents Logged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
