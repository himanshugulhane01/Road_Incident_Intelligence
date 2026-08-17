import React from 'react';
import {
  LayoutDashboard,
  Video,
  FileVideo,
  CreditCard,
  AlertTriangle,
  Car,
  Users,
  BellRing,
  History,
  BarChart3,
  Camera,
  Settings,
  PenSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  badge?: number | string;
  badgeType?: 'critical' | 'warning' | 'info';
  group?: string;
}

export const Sidebar: React.FC = () => {
  const { currentRoute, setCurrentRoute, unreadAlertCount, incidents } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'COMMAND' },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: Video, group: 'COMMAND' },
    { id: 'video-analysis', label: 'Video Analysis', icon: FileVideo, group: 'COMMAND' },
    { id: 'number-plates', label: 'Number Plates', icon: CreditCard, group: 'INTELLIGENCE' },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      badge: incidents.filter((i) => i.status === 'NEW').length,
      badgeType: 'warning',
      group: 'INTELLIGENCE',
    },
    {
      id: 'report-incident',
      label: 'Report Incident',
      icon: PenSquare,
      group: 'INTELLIGENCE',
    },
    { id: 'vehicles', label: 'Vehicles', icon: Car, group: 'INTELLIGENCE' },
    { id: 'persons', label: 'Persons', icon: Users, group: 'INTELLIGENCE' },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: BellRing,
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
      badgeType: 'critical',
      group: 'INTELLIGENCE',
    },
    { id: 'history', label: 'Detection History', icon: History, group: 'ANALYSIS' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'ANALYSIS' },
    { id: 'cameras', label: 'Cameras', icon: Camera, group: 'SYSTEM' },
    { id: 'settings', label: 'Settings', icon: Settings, group: 'SYSTEM' },
  ];

  const groups = ['COMMAND', 'INTELLIGENCE', 'ANALYSIS', 'SYSTEM'];

  return (
    <aside
      id="roadguard-sidebar"
      className="w-64 flex flex-col justify-between shrink-0 select-none h-full overflow-y-auto bg-[#FFFFFF] border-r border-[#CBD5E1]"
    >
      {/* Nav Groups */}
      <div className="p-3.5 space-y-5 pt-5">
        {groups.map((group) => {
          const groupItems = navItems.filter((n) => n.group === group);
          return (
            <div key={group}>
              <div
                className="px-3 mb-2 text-[11px] font-mono-tech text-[#334155] tracking-widest uppercase font-bold"
              >
                // {group}
              </div>
              <div className="space-y-1">
                {groupItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => setCurrentRoute(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                        isActive ? 'nav-item-active' : 'hover:bg-[#F1F5F9] text-[#0F172A] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className="w-4 h-4 shrink-0"
                          style={{ color: isActive ? '#EA580C' : '#334155' }}
                        />
                        <span
                          className="tracking-wide font-semibold text-[#0F172A]"
                          style={{ color: isActive ? '#FFFFFF' : '#0F172A' }}
                        >
                          {item.label}
                        </span>
                      </div>

                      {item.badge !== undefined && String(item.badge) !== '0' && (
                        <span
                          className={
                            item.badgeType === 'critical'
                              ? 'badge-critical'
                              : item.badgeType === 'warning'
                              ? 'badge-warning'
                              : 'badge-info'
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
};
