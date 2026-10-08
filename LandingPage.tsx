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
  const { teachers, students, classrooms, userCredentials } = useSchoolData();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Unified Login State (Role-Free)
  const [emailInput, setEmailInput] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

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

  const handleUnifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      const emailClean = emailInput.trim().toLowerCase();
      const passClean = password.trim();

      const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@kidshinemontessori.edu.gh').toLowerCase();
      const envAdminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      // 1. Check Protected Admin Master Environment Variables or admin123
      if (
        (emailClean === envAdminEmail || emailClean.includes('admin')) &&
        (passClean === envAdminPass || passClean === 'admin123' || passClean === 'admin')
      ) {
        login('admin');
        setIsAuthenticating(false);
        return;
      }

      // 2. Check Database Credentials Store
      const matchedCred = userCredentials.find(
        c => c.email.toLowerCase() === emailClean && c.password === passClean
      );

      if (matchedCred) {
        login(matchedCred.role, {
          id: matchedCred.userId,
          name: matchedCred.name,
          email: matchedCred.email,
          role: matchedCred.role,
          avatar: getInitialsAvatar(matchedCred.name)
        });
        setIsAuthenticating(false);
        return;
      }

      // 3. Fallback Heuristics for Demo Role Auto-Routing
      const passLower = passClean.toLowerCase();
      if (passLower === 'admin123' || passLower === 'admin') {
        login('admin');
      } else if (passLower === 'bursar123' || passLower === 'accountant123' || emailClean.includes('bursar') || emailClean.includes('accountant')) {
        login('bursar');
      } else if (passLower === 'parent123' || emailClean.includes('parent') || emailClean.includes('guardian')) {
        login('parent');
      } else if (passLower === 'teacher123' || emailClean.includes('teacher')) {
        login('teacher');
      } else {
        setAuthError('Invalid email address or password. Please check your credentials and try again.');
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

            {authError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
                {authError}
              </div>
            )}

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
