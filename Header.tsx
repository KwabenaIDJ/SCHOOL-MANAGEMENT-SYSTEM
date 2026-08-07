import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { UserRole } from '../../types';
import { GhanaTerm } from '../../constants/ghanaEducation';
import {
  Sun,
  Moon,
  Bell,
  CheckCheck,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  Users,
  BookOpen,
  Menu,
  ChevronDown,
  Calendar,
  Lock,
  Unlock,
  LogOut,
  Headphones,
  PhoneCall,
  Mail,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { Modal } from './Modal';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenTour?: () => void;
}

const roleBadgeMap: Record<UserRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Administrator', icon: ShieldAlert, color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  teacher: { label: 'Teacher', icon: BookOpen, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  parent: { label: 'Parent / Guardian', icon: Users, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenTour }) => {
  const { role, setRole, logout, currentUser, notifications, markNotificationAsRead, clearNotifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentTerm, setCurrentTerm, isTermLocked, toggleTermLock } = useSchoolData();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Financial notifications are restricted exclusively to Admin role!
  const isFinancial = (n: { title: string; message: string; category?: string }) => {
    if (n.category === 'financial') return true;
    const txt = `${n.title} ${n.message}`.toLowerCase();
    return (
      txt.includes('tuition') ||
      txt.includes('fee') ||
      txt.includes('payment') ||
      txt.includes('money') ||
      txt.includes('expense') ||
      txt.includes('budget') ||
      txt.includes('income') ||
      txt.includes('bursar')
    );
  };

  const visibleNotifications = notifications.filter(n => {
    if (role !== 'admin' && isFinancial(n)) {
      return false;
    }
    return true;
  });

  const unreadCount = visibleNotifications.filter(n => !n.read).length;
  const RoleIcon = roleBadgeMap[role].icon;

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-blue-100 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      {/* Left side: Mobile Toggle & School Title */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-500 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0 flex-1 sm:flex-initial">
          <h1 className="text-xs font-black text-blue-950 dark:text-white sm:text-base truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none">
            Kidshine Montessori School
          </h1>
          <p className="hidden text-xs text-blue-600 dark:text-blue-400 font-semibold sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right side: Term Switcher & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-4">
        {/* Global Academic Term Switcher with Lock Button */}
        <div className={`hidden sm:flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 transition-all ${
          isTermLocked
            ? 'border-amber-300 bg-amber-50 dark:border-amber-700/50 dark:bg-amber-950/40'
            : 'border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/40'
        }`}>
          <Calendar className={`h-4 w-4 ${isTermLocked ? 'text-amber-600 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'}`} />
          <span className="hidden md:inline text-[11px] font-bold text-slate-800 dark:text-slate-200">Academic Term:</span>
          <select
            value={currentTerm}
            disabled={isTermLocked}
            onChange={e => setCurrentTerm(e.target.value as GhanaTerm)}
            className={`bg-transparent text-xs font-bold focus:outline-none transition-colors ${
              isTermLocked
                ? 'text-amber-900 dark:text-amber-300 cursor-not-allowed opacity-80'
                : 'text-blue-900 dark:text-blue-300 cursor-pointer'
            }`}
            title={isTermLocked ? 'Academic Term is locked. Unlock to switch terms.' : 'Select Academic Term'}
          >
            <option value="First Term (Term 1)" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">First Term (Term 1)</option>
            <option value="Second Term (Term 2)" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Second Term (Term 2)</option>
            <option value="Third Term (Term 3)" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Third Term (Term 3)</option>
          </select>

          {/* Small Lock / Unlock Toggle Button */}
          <button
            type="button"
            onClick={toggleTermLock}
            className={`ml-1 rounded-lg p-1.5 transition-all ${
              isTermLocked
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-xs'
                : 'text-slate-400 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
            title={isTermLocked ? 'Click to Unlock Academic Term' : 'Click to Lock Academic Term'}
          >
            {isTermLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
            }}
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 z-40 w-80 sm:w-96 rounded-2xl border border-blue-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3 dark:border-slate-800">
                <h4 className="font-bold text-blue-950 dark:text-white">
                  Notifications
                </h4>
                {visibleNotifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-xs font-bold text-blue-700 hover:underline dark:text-blue-400"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5">
                {visibleNotifications.length > 0 ? (
                  visibleNotifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-colors ${
                        n.read
                          ? 'bg-transparent text-slate-500 dark:text-slate-400'
                          : 'bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-white font-medium'
                      }`}
                    >
                      <div className="mt-0.5 rounded-full p-1 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                        <CheckCheck className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">{n.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No new notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Guided System Tour Button */}
        {onOpenTour && (
          <button
            onClick={() => {
              setShowNotifications(false);
              setShowRoleDropdown(false);
              onOpenTour();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-extrabold text-indigo-900 shadow-xs hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300 transition-colors cursor-pointer"
            title="Take Interactive System Tour"
          >
            <HelpCircle className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>
        )}

        {/* IDJ TECH SOLUTIONS Technical Support Button */}
        <button
          onClick={() => {
            setShowNotifications(false);
            setShowRoleDropdown(false);
            setIsSupportModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-extrabold text-blue-900 shadow-xs hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300 transition-colors cursor-pointer"
          title="IDJ TECH SOLUTIONS Technical Support & System Health"
        >
          <Headphones className="h-4 w-4 text-blue-700 dark:text-blue-400" />
          <span className="hidden sm:inline">IT Support</span>
        </button>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-2xl border border-blue-200 bg-blue-50/60 p-1.5 pr-3 hover:bg-blue-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-600/40"
            />
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-blue-700 dark:text-blue-400 font-bold">
                <RoleIcon className="h-3 w-3" />
                {roleBadgeMap[role].label}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 z-40 w-64 rounded-2xl border border-blue-100 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in">
              <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                Switch Role View
              </div>
              <div className="mt-1 space-y-1">
                {(['admin', 'teacher', 'parent'] as UserRole[]).map(r => {
                  const info = roleBadgeMap[r];
                  const Icon = info.icon;
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-700 text-white'
                          : 'text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{info.label}</span>
                      </div>
                      {isSelected && <UserCheck className="h-4 w-4 text-white" />}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out to Homepage Portal</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IDJ TECH SOLUTIONS Integrated IT Technical Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="IDJ TECH SOLUTIONS • Integrated Technical Support & System Health"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Status Header */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-4 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">Official Software Consultant & Provider</span>
                <h3 className="text-base font-black font-heading mt-0.5">IDJ TECH SOLUTIONS</h3>
                <p className="text-[11px] text-blue-200 mt-0.5">Kidshine Montessori School Management System Division</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-emerald-300 font-extrabold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Systems 100% Operational</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-700" /> Technical Maintenance & System Privacy SLA
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              IDJ TECH SOLUTIONS maintains year-round cloud hosting, security monitoring, daily automated database backups, and technical bug fixes. All school student records and financial ledgers remain 100% confidential and owned by Kidshine Montessori School.
            </p>
          </div>

          {/* Contact Support Options */}
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="https://wa.me/233558358342"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 hover:bg-emerald-100 transition-colors text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Emergency Call / WhatsApp</span>
                <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-300 text-[11px] block truncate">+233 55 835 8342</span>
              </div>
            </a>

            <a
              href="mailto:idjtechsolutions@gmail.com"
              className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3 hover:bg-blue-100 transition-colors text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Support Email Desk</span>
                <span className="font-mono font-extrabold text-blue-800 dark:text-blue-300 text-[11px] block truncate" title="idjtechsolutions@gmail.com">idjtechsolutions@gmail.com</span>
              </div>
            </a>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
            >
              Close Technical Support
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
