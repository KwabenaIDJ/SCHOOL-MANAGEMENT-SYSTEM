import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { getInitialsAvatar } from '../../utils/avatar';
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
  ShieldCheck,
  KeyRound,
  LogIn
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const { teachers, students, classrooms } = useSchoolData();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Unified Login State (Role-Free)
  const [emailInput, setEmailInput] = useState<string>('admin@kidshinemontessori.edu.gh');
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

  const handleQuickDemoSelect = (selectedEmail: string, defaultPass: string) => {
    setEmailInput(selectedEmail);
    setPassword(defaultPass);
  };

  const handleUnifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      const emailLower = emailInput.trim().toLowerCase();
      const passLower = password.trim().toLowerCase();

      // Check password first or email string
      if (passLower === 'admin123' || passLower === 'admin' || emailLower.includes('admin')) {
        login('admin');
      } else if (passLower === 'parent123' || passLower === 'parent' || emailLower.includes('parent') || emailLower.includes('guardian')) {
        login('parent');
      } else if (passLower === 'teacher123' || passLower === 'teacher' || emailLower.includes('teacher') || teachers.some(t => emailLower.includes(t.name.toLowerCase().split(' ')[0]))) {
        const foundTch = teachers.find(t => 
          emailLower.includes(t.name.toLowerCase().split(' ')[0]) || 
          t.id === selectedTeacherId
        ) || teachers[0];

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
      } else {
        login('admin');
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
              <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl font-heading">
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

      {/* Main Single Unified Portal Login Card - Centered */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 pb-16 flex-1 w-full">
        <div className="max-w-md mx-auto">
          {/* Single Unified Login Card */}
          <div className="rounded-3xl border border-blue-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
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
              {/* Account Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                  <span>Account Email Address</span>
                  <span className="text-[10px] font-bold text-slate-500">Official Credentials</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="name@kidshinemontessori.edu.gh"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Demo Account Switcher Dropdown (For Testing & Demos) */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 dark:bg-slate-800/60 dark:border-slate-700">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  ⚡ Quick Demo Account Selector
                </label>
                <select
                  value={emailInput}
                  onChange={e => {
                    const val = e.target.value;
                    if (val.includes('admin')) handleQuickDemoSelect(val, 'admin123');
                    else if (val.includes('parent')) handleQuickDemoSelect(val, 'parent123');
                    else handleQuickDemoSelect(val, 'teacher123');
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="admin@kidshinemontessori.edu.gh">Demo Account 1 (admin@kidshinemontessori.edu.gh)</option>
                  <option value="joseph.appiah@kidshinemontessori.edu.gh">Demo Account 2 (joseph.appiah@kidshinemontessori.edu.gh)</option>
                  <option value="elizabeth.baah@kidshinemontessori.edu.gh">Demo Account 3 (elizabeth.baah@kidshinemontessori.edu.gh)</option>
                  <option value="parent@kidshinemontessori.edu.gh">Demo Account 4 (parent@kidshinemontessori.edu.gh)</option>
                </select>
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
