import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavbar: React.FC = () => {
  const {
    unreadAlertCount,
    setIsSearchOpen,
    setCurrentRoute,
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
      className="h-20 shrink-0 px-6 md:px-8 flex items-center justify-between select-none z-30 bg-[#E5E3DC]/90 backdrop-blur-md border-b border-[#CFCDC4] shadow-xs"
    >
      {/* 1. Left: Website Brand Name */}
      <div
        className="flex items-center gap-3.5"
        id="brand-logo-button"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 bg-[#161616] text-[#FF5722]"
        >
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 leading-none">
            <span
              className="font-display tracking-wider text-2xl text-[#141414]"
            >
              ROADGUARD <span className="text-[#161616] bg-[#FF5722] text-white px-1.5 py-0.5 rounded-sm">AI</span>
            </span>
            <span
              className="text-[9px] px-2 py-0.5 rounded bg-[#161616] text-[#FF5722] font-mono-tech border border-[#FF5722]/30"
            >
              v2.6
            </span>
          </div>
          <p className="text-[11px] font-mono-tech text-[#55534E] mt-0.5 hidden sm:block tracking-wider">
            URBAN TRAFFIC INTELLIGENCE
          </p>
        </div>
      </div>

      {/* 2. Center: Prominently Aligned Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          id="global-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#DFDDD5] border border-[#CFCDC4] text-[#55534E] text-xs font-mono-tech hover:border-[#161616] hover:bg-white transition-all cursor-pointer"
          title="Search forensic records (Ctrl+K)"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#161616]" />
            <span>▸ SEARCH FORENSICS, PLATES, VEHICLES...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-[#161616] text-[10px] font-mono-tech text-[#FF5722] border border-[#FF5722]/30">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Right: Operator Profile & Alerts */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2.5 rounded-xl bg-[#DFDDD5] border border-[#CFCDC4] text-[#141414]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Live Timestamp (Desktop) */}
        <div className="hidden lg:block px-3.5 py-2 rounded-xl bg-[#DFDDD5] border border-[#CFCDC4] text-xs font-mono-tech text-[#141414]">
          {currentTimeStr}
        </div>

        {/* Alert Notification Bell */}
        <button
          id="quick-alerts-button"
          onClick={() => setCurrentRoute('alerts')}
          className="relative px-3 py-2 rounded-xl bg-[#161616] text-[#FFFFFF] hover:text-[#FF5722] border border-[#000000] text-xs font-mono-tech flex items-center gap-2 transition-all cursor-pointer"
          title="Alerts Feed"
        >
          <Bell className="w-4 h-4 text-[#FF5722]" />
          <span className="hidden sm:inline">▸ ALERTS</span>
          {unreadAlertCount > 0 && (
            <span className="w-4 h-4 rounded bg-[#FF4D4D] text-white text-[9px] font-mono-tech font-bold flex items-center justify-center">
              {unreadAlertCount}
            </span>
          )}
        </button>

        {/* Operator Profile */}
        <div
          id="operator-profile-badge"
          onClick={() => setCurrentRoute('settings')}
          className="flex items-center gap-3 pl-3 border-l border-[#CFCDC4] cursor-pointer group"
          title="Operator Settings"
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold bg-[#161616] text-[#FF5722] font-mono-tech border border-[#FF5722]/40 shadow-sm group-hover:scale-105 transition-all">
            {user ? user.name.slice(0, 2).toUpperCase() : 'OP'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#141414] group-hover:text-[#FF5722] transition-colors font-mono-tech">
              {user ? user.name : 'Cmdr. Alex Vance'}
            </div>
            <div className="text-[10px] font-mono-tech text-[#55534E]">
              {user ? user.role : 'Central Control Officer'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
