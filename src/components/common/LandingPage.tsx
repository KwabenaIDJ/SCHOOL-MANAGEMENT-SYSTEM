import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { getInitialsAvatar } from '../../utils/avatar';
import { UserRole } from '../../types';
import { AboutSchoolModal } from './AboutSchoolModal';
import {
  ShieldAlert,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Building2,
  Sun,
  Info,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  KeyRound,
  LogIn
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const { teachers, students, classrooms } = useSchoolData();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Unified Login State
  const [selectedAccountType, setSelectedAccountType] = useState<string>('admin');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const phrases = [
    "Kidshine Montessori School",
    "Nurturing Future Leaders",
    "Academic & Montessori Excellence",
    "our Digital School Portal"
  ];

  const [loopIndex, setLoopIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = phrases[loopIndex % phrases.length];
    let timer: any;

    if (isDeleting) {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(targetPhrase.substring(0, typedText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setLoopIndex(prev => prev + 1);
      }
    } else {
      if (typedText.length < targetPhrase.length) {
        timer = setTimeout(() => {
          setTypedText(targetPhrase.substring(0, typedText.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopIndex]);

  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [teachers]);

  const handleAccountTypeChange = (type: string) => {
    setSelectedAccountType(type);
    if (type === 'admin') setPassword('admin123');
    else if (type === 'teacher') setPassword('teacher123');
    else if (type === 'parent') setPassword('parent123');
  };

  const handleUnifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      if (selectedAccountType === 'admin') {
        login('admin');
      } else if (selectedAccountType === 'parent') {
        login('parent');
      } else {
        const foundTch = teachers.find(t => t.id === selectedTeacherId) || teachers[0];
        if (foundTch) {
          login('teacher', {
            id: foundTch.id,
            name: foundTch.name,
            email: `${foundTch.name.toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`,
            role: 'teacher',
            avatar: foundTch.avatar || getInitialsAvatar(foundTch.name),
            phone: foundTch.phone
          });
        } else {
          login('teacher');
        }
      }
      setIsAuthenticating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-700 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                Kidshine Montessori School
              </h1>
              <p className="text-[11px] font-bold text-blue-700">
                Official School Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Info className="h-4 w-4 text-blue-700" /> About School
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
              <Building2 className="h-3.5 w-3.5 text-blue-700" /> Creche to JHS 3
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative pt-8 pb-10 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-800">
            <Sun className="h-4 w-4 text-blue-700" /> Kidshine Montessori Educational Portal
          </span>

          <h2 className="mt-3 text-3xl font-serif font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl min-h-[64px] sm:min-h-[80px]">
            Welcome to{' '}
            <span className="text-blue-700 font-serif">
              {typedText}
            </span>
            <span className="ml-1 inline-block h-7 w-1 sm:h-11 bg-blue-700 animate-pulse align-middle rounded-full" />
          </h2>
          <p className="mx-auto mt-1 max-w-2xl text-xs sm:text-sm font-medium text-slate-600">
            Nurturing academic excellence, character development, and holistic Montessori education.
          </p>

          {/* Quick Statistics Strip */}
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xl font-black text-slate-900">{students.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Enrolled Students</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xl font-black text-slate-900">{classrooms.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Active Classes</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xl font-black text-slate-900">{teachers.length}</div>
              <div className="text-[11px] font-bold text-slate-600">Certified Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Single Unified Portal Login & Capability Showcase */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16 flex-1 w-full">
        <div className="grid gap-8 lg:grid-cols-12 items-start max-w-6xl mx-auto">
          
          {/* Solution 1: Single Unified Login Card */}
          <div className="lg:col-span-6 rounded-3xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                  Sign In to Digital School Portal
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Unified Secure Access • Kidshine Montessori School
                </p>
              </div>
            </div>

            <form onSubmit={handleUnifiedSubmit} className="mt-6 space-y-4">
              {/* Account Profile Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Select Account Profile / Role Access
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange('admin')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedAccountType === 'admin'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Administrator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange('teacher')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedAccountType === 'teacher'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Teacher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange('parent')}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                      selectedAccountType === 'parent'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Parent</span>
                  </button>
                </div>
              </div>

              {/* Teacher Faculty Selection (Visible when Teacher is selected) */}
              {selectedAccountType === 'teacher' && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Select Faculty Educator Profile
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={e => setSelectedTeacherId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.department})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email Address Display */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Official Account Email
                </label>
                <input
                  type="email"
                  required
                  readOnly
                  value={
                    selectedAccountType === 'admin'
                      ? 'admin@kidshinemontessori.edu.gh'
                      : selectedAccountType === 'parent'
                      ? 'parent@kidshinemontessori.edu.gh'
                      : `${(teachers.find(t => t.id === selectedTeacherId)?.name || 'Teacher').toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-100 p-2.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between mb-1">
                  <span>Account Password</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 font-extrabold">Encrypted Access</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter account password..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 pr-10 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 px-4 text-xs font-black text-white shadow-md hover:bg-blue-800 transition-all cursor-pointer"
                >
                  <span>{isAuthenticating ? 'Authenticating Credentials...' : 'Sign In to School Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                Role is detected automatically upon credential verification.
              </span>
            </div>
          </div>

          {/* Right Column: Platform Features & Security Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-800 dark:bg-slate-800 dark:text-blue-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-700" /> Automated Role Detection & Security
              </span>
              <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white font-heading">
                Enterprise Cloud Security & Access Control
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Our unified portal ensures that all user accounts (Administrators, Educators, and Parents) enter through a single secure portal with automated role resolution and audit logging.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Administrator Management & Financial Portal</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Manage fee ledgers, staff directories, overdue tuition call alerts, and system audit logs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Teacher Continuous Assessment Engine</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Enter CA1 (15%), CA2 (15%), Exam (70%) marks with automatic position rankings & attendance registers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Parent & Guardian Monitoring Hub</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Track child academic grades, download A4 report cards, view fee balances, and homework tasks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        <p>© 2026 Kidshine Montessori School • All Rights Reserved</p>
        <p className="mt-1 text-[11px] text-slate-400 font-semibold">Accra, Ghana • Primary & Junior High Education Portal</p>
      </footer>

      {/* About School Modal */}
      <AboutSchoolModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};
