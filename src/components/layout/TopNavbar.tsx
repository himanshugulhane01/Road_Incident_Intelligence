import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Bell,
  User,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavbar: React.FC = () => {
  const {
    unreadAlertCount,
    setIsSearchOpen,
    setCurrentRoute,
    setIsEditProfileOpen,
    user,
  } = useApp();

  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) +
          '  ' +
          now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="roadguard-top-navbar"
      className="h-20 shrink-0 px-6 md:px-8 flex items-center justify-between select-none z-30 bg-[#FFFFFF] border-b border-[#CBD5E1] shadow-xs"
    >
      {/* 1. Left: Brand Logo & Title */}
      <div
        className="flex items-center gap-3.5"
        id="brand-logo-button"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs shrink-0 bg-[#0F172A] text-[#EA580C]"
        >
          <ShieldAlert className="w-5 h-5 text-[#EA580C]" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 leading-none">
            <span className="font-display tracking-tight text-xl font-bold text-[#0F172A]">
              ROADGUARD <span className="text-white bg-[#EA580C] px-1.5 py-0.5 rounded text-base font-bold ml-0.5">AI</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#EA580C] font-mono-tech border border-[#CBD5E1] font-bold">
              v2.6 PLATFORM
            </span>
          </div>
          <p className="text-[11px] font-semibold text-[#475569] mt-0.5 hidden sm:block tracking-wide">
            URBAN TRAFFIC INTELLIGENCE
          </p>
        </div>
      </div>

      {/* 2. Center: Centered Global Search Bar */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <button
          id="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] text-xs font-semibold hover:border-[#EA580C] hover:bg-white hover:shadow-sm transition-all cursor-pointer shadow-xs group"
          title="Search forensic records (Ctrl+K)"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-[#EA580C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-[#475569]">Search forensics, license plates, vehicles, cameras...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded-lg bg-[#0F172A] text-[10px] font-mono-tech text-[#EA580C] font-bold border border-[#EA580C]/40 shadow-xs">
              Ctrl + K
            </kbd>
          </div>
        </button>
      </div>

      {/* 3. Right: Live Clock, Alerts & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Live Clock (Desktop) */}
        <div className="hidden lg:flex items-center px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono-tech font-bold text-[#0F172A] gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{currentTimeStr}</span>
        </div>

        {/* Quick Alerts Bell */}
        <button
          id="quick-alerts-button"
          onClick={() => setCurrentRoute('alerts')}
          className="relative px-3.5 py-2 rounded-xl bg-[#0F172A] text-[#FFFFFF] hover:bg-[#020617] border border-[#020617] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          title="Alerts Feed"
        >
          <Bell className="w-4 h-4 text-[#EA580C]" />
          <span className="hidden sm:inline font-bold">ALERTS</span>
          {unreadAlertCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Operator Profile Badge */}
        <div
          id="operator-profile-badge"
          onClick={() => setIsEditProfileOpen(true)}
          className="flex items-center gap-3 pl-3.5 border-l border-[#CBD5E1] cursor-pointer group"
          title="Edit Operator Profile & Credentials"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0F172A] text-white border-2 border-[#EA580C] shadow-xs group-hover:scale-105 transition-all">
              <User className="w-5 h-5 text-[#EA580C]" />
            </div>
            <span
              className="w-3 h-3 rounded-full bg-[#10B981] border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-xs"
              title="Operator Online"
            />
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors leading-tight flex items-center gap-1.5">
              <span>{user ? user.name : 'Cmdr. Alex Vance'}</span>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-[#FEF08A] text-[#0F172A] font-bold border border-[#0F172A]">
                {user ? user.badgeNumber || 'TP-8842' : 'TP-8842'}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] leading-tight mt-0.5 flex items-center gap-1">
              <span>{user ? user.role : 'Central Control Officer'}</span>
              <span className="text-[10px] font-bold text-[#EA580C] group-hover:underline flex items-center gap-0.5 ml-1">
                <Edit3 className="w-2.5 h-2.5" />
                Edit
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
