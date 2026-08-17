import React, { useState, useEffect } from 'react';
import { X, User, Shield, BadgeCheck, Check, Building, Mail, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditProfileModal: React.FC = () => {
  const { user, isEditProfileOpen, setIsEditProfileOpen, updateUserProfile } = useApp();

  const [name, setName] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [agency, setAgency] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name || 'Cmdr. Alex Vance');
      setBadgeNumber(user.badgeNumber || 'TP-8842');
      setRole(user.role || 'Central Control Officer');
      setAgency(user.agency || 'Central Command');
      setEmail(user.email || 'alex.vance@traffic.gov.in');
    } else {
      setName('Cmdr. Alex Vance');
      setBadgeNumber('TP-8842');
      setRole('Central Control Officer');
      setAgency('Central Command');
      setEmail('alex.vance@traffic.gov.in');
    }
  }, [user, isEditProfileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditProfileOpen) {
        setIsEditProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditProfileOpen, setIsEditProfileOpen]);

  if (!isEditProfileOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || 'Cmdr. Alex Vance',
      badgeNumber: badgeNumber.trim() || 'TP-8842',
      role: role.trim() || 'Central Control Officer',
      agency: agency.trim() || 'Central Command',
      email: email.trim() || 'alex.vance@traffic.gov.in',
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditProfileOpen(false);
    }, 900);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsEditProfileOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4 select-none animate-fadeIn"
    >
      <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-lg w-full p-6 text-[#0F172A] shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#FFF0E6] border border-[#EA580C]/30 text-[#EA580C]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#0F172A] flex items-center gap-2">
                <span>Edit Operator Profile</span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-xl bg-[#FEF08A] text-[#0F172A] border border-[#0F172A] font-bold">
                  {badgeNumber || 'TP-8842'}
                </span>
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                Update officer credentials, badge number, and department assignment
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-2 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar Badge Preview */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#0F172A] text-white border-2 border-[#EA580C] shadow-md">
              <User className="w-7 h-7 text-[#EA580C]" />
            </div>
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white absolute -bottom-0.5 -right-0.5 shadow-xs" />
          </div>

          <div className="space-y-0.5">
            <div className="text-sm font-black text-[#0F172A]">{name || 'Cmdr. Alex Vance'}</div>
            <div className="text-xs font-semibold text-[#64748B]">{role || 'Central Control Officer'}</div>
            <div className="text-[11px] font-mono-tech text-[#EA580C] font-bold flex items-center gap-1.5">
              <Building className="w-3 h-3" />
              <span>{agency || 'Central Command'}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Full Name / Rank Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cmdr. Alex Vance"
                  className="input-field text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Badge Number / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="e.g. TP-8842"
                  className="input-field text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Control Role / Position
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Central Control Officer"
                className="input-field text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Agency / Department
              </label>
              <input
                type="text"
                required
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                placeholder="e.g. Traffic Police Command"
                className="input-field text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex.vance@traffic.gov.in"
                className="input-field text-xs font-semibold"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>Profile credentials saved successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
