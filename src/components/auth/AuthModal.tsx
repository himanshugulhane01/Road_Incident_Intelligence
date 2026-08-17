import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Sparkles,
  ArrowRight,
  CreditCard,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    signup,
    setCurrentRoute,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agency, setAgency] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      login(
        email || 'alex.vance@traffic.gov.in',
        password || 'admin123',
        name || 'Cmdr. Alex Vance'
      );
    } else {
      signup(
        name || 'Officer Sarah Connor',
        email || 'sarah.c@traffic.gov.in',
        password || 'secure123',
        agency || 'Urban Traffic Police'
      );
    }
    setIsAuthModalOpen(false);
    setCurrentRoute('dashboard');
  };

  const handleQuickDemoLogin = (roleName: string, userEmail: string, _badge: string) => {
    login(userEmail, 'demo123', roleName);
    setIsAuthModalOpen(false);
    setCurrentRoute('dashboard');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
    >
      {/* Modal Card — scrollable on small screens */}
      <div
        className="w-full max-w-md bg-[#E5E3DC] rounded-2xl shadow-2xl border border-[#CFCDC4] relative flex flex-col select-none overflow-hidden"
        style={{
          maxHeight: '95vh',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-[#DFDDD5] hover:bg-[#161616] text-[#141414] hover:text-[#FF5722] border border-[#CFCDC4] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8" style={{ scrollbarWidth: 'thin' }}>
          {/* Brand Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 bg-[#161616] text-[#FF5722]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wider text-[#141414]">
                ROADGUARD <span className="text-[#161616] bg-[#FF5722] text-white px-1.5 py-0.5 rounded-sm">AI</span>
              </h2>
              <p className="text-xs font-mono-tech text-[#55534E] mt-0.5">
                {authMode === 'login' ? '// SIGN IN TO COMMAND CENTER' : '// REGISTER NEW OPERATOR ACCOUNT'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#DFDDD5] rounded-xl border border-[#CFCDC4] mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2 px-3 rounded-lg text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#161616] text-[#FF5722] shadow-sm'
                  : 'text-[#55534E] hover:text-[#141414]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 px-3 rounded-lg text-xs font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#161616] text-[#FF5722] shadow-sm'
                  : 'text-[#55534E] hover:text-[#141414]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono-tech font-bold text-[#141414] mb-1.5">
                    FULL NAME / OFFICER NAME
                  </label>
                  <div className="relative flex items-center">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55534E] pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Officer Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Department / Agency */}
                <div>
                  <label className="block text-xs font-mono-tech font-bold text-[#141414] mb-1.5">
                    DEPARTMENT / TRAFFIC AGENCY
                  </label>
                  <div className="relative flex items-center">
                    <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55534E] pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Urban Traffic Control Cell"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Badge Number (Optional) */}
                <div>
                  <label className="block text-xs font-mono-tech font-bold text-[#141414] mb-1.5">
                    OFFICER BADGE / REGISTRATION NO.
                  </label>
                  <div className="relative flex items-center">
                    <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55534E] pointer-events-none" />
                    <input
                      type="text"
                      placeholder="TP-9042 (Optional)"
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-mono-tech font-bold text-[#141414] mb-1.5">DEPARTMENT EMAIL</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55534E] pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder={authMode === 'login' ? 'operator@traffic.gov.in' : 'officer@traffic.gov.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-mono-tech font-bold text-[#141414] mb-1.5">PASSWORD</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55534E] pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full btn-koyeb-dark py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-mono-tech mt-3 cursor-pointer"
            >
              <span>
                {authMode === 'login' ? '▸ SIGN IN TO COMMAND CENTER' : '▸ CREATE OPERATOR ACCOUNT'}
              </span>
              {authMode === 'login' ? (
                <ArrowRight className="w-4 h-4 text-[#FF5722]" />
              ) : (
                <UserPlus className="w-4 h-4 text-[#FF5722]" />
              )}
            </button>
          </form>

          {/* Switch Mode Footer Text */}
          <div className="mt-4 text-center">
            {authMode === 'login' ? (
              <p className="text-xs font-mono-tech text-[#55534E]">
                Don't have an operator account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#141414] font-bold underline hover:text-[#FF5722] cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p className="text-xs font-mono-tech text-[#55534E]">
                Already registered with command center?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[#141414] font-bold underline hover:text-[#FF5722] cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins */}
          <div className="mt-5 pt-5 border-t border-[#CFCDC4]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#161616]" />
              <span className="text-[11px] font-mono-tech font-bold text-[#55534E] uppercase tracking-wider">
                // QUICK DEMO ACCESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Cmdr. Alex Vance', 'alex.vance@traffic.gov.in', 'TP-8842')}
                className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#161616] hover:text-[#FFFFFF] border border-[#CFCDC4] text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-mono-tech font-bold text-[#141414] group-hover:text-[#FF5722]">Cmdr. Alex Vance</div>
                <div className="text-[10px] text-[#55534E] group-hover:text-[#A1A1AA] font-mono-tech mt-0.5">Chief Control Officer</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Inspector Mark Ruffalo', 'mark.r@traffic.gov.in', 'TP-1049')}
                className="p-3 rounded-xl bg-[#FFFFFF] hover:bg-[#161616] hover:text-[#FFFFFF] border border-[#CFCDC4] text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-mono-tech font-bold text-[#141414] group-hover:text-[#FF5722]">Inspector Ruffalo</div>
                <div className="text-[10px] text-[#55534E] group-hover:text-[#A1A1AA] font-mono-tech mt-0.5">Traffic Analyst</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

