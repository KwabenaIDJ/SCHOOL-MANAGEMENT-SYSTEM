import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Wallet,
  ClipboardCheck,
  Award,
  FileText,
  Bell,
  Clock,
  ChevronLeft,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { role, setRole, logout, currentUser } = useAuth();

  // Navigation Items per Role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Directory', icon: GraduationCap },
          { id: 'staff', label: 'Staff Directory', icon: Users },
          { id: 'classes', label: 'Classes & Subjects', icon: Building2 },
          { id: 'timetable', label: 'Class Timetables', icon: Clock },
          { id: 'report-card', label: 'Terminal Report Cards', icon: FileText },
          { id: 'fees', label: 'Fee Management', icon: Wallet },
          { id: 'finances', label: 'Financials & Budgeting', icon: PieChart },
          { id: 'credentials', label: 'Passwords & Accounts', icon: ShieldAlert },
          { id: 'audit-logs', label: 'System Audit Logs', icon: ShieldCheck },
          { id: 'notices', label: 'Announcements', icon: Bell }
        ];
      case 'teacher':
        return [
          { id: 'overview', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'grading', label: 'Grading System', icon: Award },
          { id: 'assignments', label: 'Homework & Assignments', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Tracker', icon: ClipboardCheck },
          { id: 'timetable', label: 'Class Timetable', icon: Clock },
          { id: 'report-card', label: 'Terminal Report Cards', icon: FileText },
          { id: 'notices', label: 'Notice Board', icon: Bell }
        ];
      case 'parent':
        return [
          { id: 'overview', label: 'Children Overview', icon: LayoutDashboard },
          { id: 'report-card', label: 'Terminal Report Card', icon: FileText },
          { id: 'notices', label: 'School Announcements', icon: Bell }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-blue-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo & Title with Blue and White Palette */}
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md shadow-blue-700/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-blue-950 dark:text-white">
                  Kidshine
                </span>
                <span className="block text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                  Montessori School
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800 lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-400">
              Menu Navigation
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-800 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile & Desktop User Account, Role Switcher & Logout Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-600/40" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize">{role} View</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Switch Role View</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['admin', 'teacher', 'parent'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    onClose();
                  }}
                  className={`rounded-lg py-1.5 px-2 text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    role === r
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
