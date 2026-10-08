import React, { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  CreditCard,
  UserCheck,
  Library,
  Bus,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavGroup {
  title: string;
  icon: any;
  items: Array<{
    id: string;
    label: string;
    icon: any;
    badge?: string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const { role, logout, currentUser } = useAuth();

  // Expanded Groups State
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    school: true,
    academics: true,
    students: true,
    staff: true,
    finance: true,
    exams: true,
    extensions: false
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Structured Module Groups for Admin Role
  const adminGroups: Record<string, NavGroup> = {
    school: {
      title: 'School Portal',
      icon: Building2,
      items: [
        { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
        { id: 'audit-logs', label: 'System Audit Logs', icon: ShieldCheck },
        { id: 'notices', label: 'Announcements', icon: Bell }
      ]
    },
    academics: {
      title: 'Academics',
      icon: BookOpen,
      items: [
        { id: 'classes', label: 'Classes & Subjects', icon: Building2 },
        { id: 'timetable', label: 'Class Timetables', icon: Clock }
      ]
    },
    students: {
      title: 'Students & Parents',
      icon: GraduationCap,
      items: [
        { id: 'students', label: 'Student Directory', icon: GraduationCap },
        { id: 'id-cards', label: 'Student ID Cards', icon: CreditCard, badge: 'NEW' },
        { id: 'certificates', label: 'Graduation Certificates', icon: Award, badge: 'NEW' }
      ]
    },
    staff: {
      title: 'Faculty & Staff',
      icon: Users,
      items: [
        { id: 'staff', label: 'Staff Directory', icon: Users },
        { id: 'staff-attendance', label: 'Staff Attendance', icon: UserCheck, badge: 'NEW' },
        { id: 'credentials', label: 'User Passwords', icon: ShieldAlert }
      ]
    },
    finance: {
      title: 'Accounts & Finance',
      icon: Wallet,
      items: [
        { id: 'fees', label: 'Fee Ledgers & Alerts', icon: Wallet },
        { id: 'finances', label: 'Expenses & Budgets', icon: PieChart }
      ]
    },
    exams: {
      title: 'Examination & Reports',
      icon: FileText,
      items: [
        { id: 'report-card', label: 'Terminal Report Cards', icon: FileText },
        { id: 'admit-cards', label: 'Exam Admit Slips', icon: CreditCard, badge: 'NEW' }
      ]
    },
    extensions: {
      title: 'Specialized Extensions',
      icon: Library,
      items: [
        { id: 'library', label: 'Library Catalog', icon: Library, badge: 'ADD-ON' },
        { id: 'transport', label: 'School Transport', icon: Bus, badge: 'ADD-ON' },
        { id: 'hostel', label: 'Hostel & Boarding', icon: Home, badge: 'ADD-ON' }
      ]
    }
  };

  // Simple Flat List for Teacher and Parent Roles
  const teacherNav = [
    { id: 'overview', label: 'Teacher Dashboard', icon: LayoutDashboard },
    { id: 'grading', label: 'Grading System (A-F)', icon: Award },
    { id: 'assignments', label: 'Homework & Tasks', icon: BookOpen },
    { id: 'attendance', label: 'Class Attendance', icon: ClipboardCheck },
    { id: 'timetable', label: 'Class Timetable', icon: Clock },
    { id: 'report-card', label: 'Terminal Report Cards', icon: FileText },
    { id: 'notices', label: 'Notice Board', icon: Bell }
  ];

  const parentNav = [
    { id: 'overview', label: 'Children Overview', icon: LayoutDashboard },
    { id: 'assignments', label: 'Homework & Assignments', icon: BookOpen },
    { id: 'report-card', label: 'Terminal Report Card', icon: FileText },
    { id: 'notices', label: 'School Announcements', icon: Bell }
  ];

  const bursarNav = [
    { id: 'fees', label: 'Tuition Fee Ledgers & Calls', icon: Wallet },
    { id: 'finances', label: 'Expenses & Budgets', icon: PieChart },
    { id: 'notices', label: 'School Announcements', icon: Bell }
  ];

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
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto pr-1 scrollbar-thin">
          {/* Brand Logo & Title */}
          <div className="mb-5 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-heading">
                  Kidshine
                </span>
                <span className="block text-[10px] font-bold tracking-wider text-blue-700 dark:text-blue-400 uppercase">
                  Montessori School
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          {role === 'admin' ? (
            <div className="space-y-3">
              {Object.entries(adminGroups).map(([groupKey, group]) => {
                const GroupIcon = group.icon;
                const isExpanded = openGroups[groupKey];
                const hasActiveChild = group.items.some(it => it.id === activeTab);

                return (
                  <div key={groupKey} className="rounded-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className={`flex w-full items-center justify-between p-2.5 text-xs font-black transition-all cursor-pointer ${
                        hasActiveChild
                          ? 'bg-blue-50 text-blue-900 dark:bg-slate-800 dark:text-white'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <GroupIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        <span>{group.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50/50 dark:bg-slate-900/50 p-1 space-y-0.5 border-t border-slate-100 dark:border-slate-800">
                        {group.items.map(item => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                onClose();
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-blue-700 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-white hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <nav className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu Navigation
              </div>
              {(role === 'teacher' ? teacherNav : role === 'parent' ? parentNav : bursarNav).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* User Account & Logout Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-xl object-cover ring-2 ring-blue-600/40" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 capitalize">{role} Account</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
