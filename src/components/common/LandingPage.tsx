import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { getInitialsAvatar } from '../../utils/avatar';
import { UserRole } from '../../types';
import { Modal } from './Modal';
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
  EyeOff
} from 'lucide-react';

interface PortalCardItem {
  role: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  defaultEmail: string;
  badge: string;
  features: string[];
}

const PORTAL_CARDS: PortalCardItem[] = [
  {
    role: 'admin',
    title: 'School Administrator',
    subtitle: 'Management & Financial Portal',
    description: 'Manage student enrolments, staff directories, financial ledger, term budgets, and promotion registers.',
    icon: ShieldAlert,
    defaultEmail: 'admin@kidshinemontessori.edu.gh',
    badge: 'Admin Access',
    features: ['Fee Ledger & Expenses', 'Staff & Student Directory', 'Terminal Promotion Register', 'Class & Subject Allocation']
  },
  {
    role: 'teacher',
    title: 'Teacher & Educator',
    subtitle: 'Academic Assessment Portal',
    description: 'Enter continuous assessment scores (CA1 15%, CA2 15%, Exam 70%), take daily attendance, and track timetables.',
    icon: BookOpen,
    defaultEmail: 'joseph.appiah@kidshinemontessori.edu.gh',
    badge: 'Faculty Access',
    features: ['A–F Grade Entry Engine', 'Daily Attendance Register', 'Terminal Report Cards', 'Class Timetables']
  },
  {
    role: 'parent',
    title: 'Parent & Guardian',
    subtitle: 'Parent Monitoring Portal',
    description: 'Track your child\'s academic performance, download official terminal report cards, and view tuition balances.',
    icon: Users,
    defaultEmail: 'parent@kidshinemontessori.edu.gh',
    badge: 'Guardian Access',
    features: ['Child Academic Performance', 'Printable Report Cards', 'Tuition Payment History', 'School Announcements']
  }
];

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const { teachers, students, classrooms } = useSchoolData();
  const [selectedPortal, setSelectedPortal] = useState<PortalCardItem | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [password, setPassword] = useState('password123');

  // Typewriter & Backspacing Animation State
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
        }, 75);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopIndex]);

  const [showPassword, setShowPassword] = useState(false);

  const handleOpenLogin = (card: PortalCardItem) => {
    setSelectedPortal(card);
    setSelectedTeacherId(teachers[0]?.id || '');
    setPassword('teacher123');
    setShowPassword(false);
  };

  const handleConfirmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPortal) {
      if (selectedPortal.role === 'teacher' && selectedTeacherId) {
        const foundTch = teachers.find(t => t.id === selectedTeacherId);
        if (foundTch) {
          login('teacher', {
            id: foundTch.id,
            name: foundTch.name,
            email: `${foundTch.name.toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`,
            role: 'teacher',
            avatar: foundTch.avatar || getInitialsAvatar(foundTch.name),
            phone: foundTch.phone
          });
          return;
        }
      }
      login(selectedPortal.role);
    }
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

      {/* Hero Banner Section - Clean Solid White Background */}
      <section className="relative pt-10 pb-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-800">
            <Sun className="h-4 w-4 text-blue-700" /> Kidshine Montessori Educational Portal
          </span>

          {/* Typewriter Title with Editorial Serif Typography */}
          <h2 className="mt-4 text-3xl font-serif font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl min-h-[72px] sm:min-h-[90px]">
            Welcome to{' '}
            <span className="text-blue-700 font-serif">
              {typedText}
            </span>
            <span className="ml-1 inline-block h-7 w-1 sm:h-11 bg-blue-700 animate-pulse align-middle rounded-full" />
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base font-medium text-slate-600">
            Nurturing academic excellence, character development, and holistic Montessori education. Select your user portal below to sign in.
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Info className="h-4 w-4 text-blue-400" /> View School Vision, Mission & Campus Facilities
            </button>
          </div>

          {/* Quick Statistics Strip - Dynamic Live Data */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-2xl font-black text-slate-900">{students.length}</div>
              <div className="text-xs font-bold text-slate-600">Enrolled Students</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-2xl font-black text-slate-900">{classrooms.length}</div>
              <div className="text-xs font-bold text-slate-600">Active Classes</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-2xl font-black text-slate-900">{teachers.length}</div>
              <div className="text-xs font-bold text-slate-600">Certified Class Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Cards Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-16 flex-1 w-full">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-black text-slate-900">Select Your Portal to Sign In</h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">Choose your role to access Kidshine Montessori School Management System</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
          {PORTAL_CARDS.map(card => {
            const Icon = card.icon;
            return (
              <div
                key={card.role}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-700 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <h4 className="mt-5 text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs font-extrabold text-blue-700 mt-0.5">{card.subtitle}</p>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
                    {card.description}
                  </p>

                  <ul className="mt-4 space-y-1.5">
                    {card.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenLogin(card)}
                    className="flex w-full items-center justify-between rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-all cursor-pointer"
                  >
                    <span>Sign In to {card.title}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs font-bold text-slate-500">
        <p>© 2026 Kidshine Montessori School • All Rights Reserved</p>
        <p className="mt-1 text-[11px] text-slate-400 font-semibold">Accra, Ghana • Primary & Junior High Education Portal</p>
      </footer>

      {/* Password Authentication Modal */}
      {selectedPortal && (
        <Modal
          isOpen={!!selectedPortal}
          onClose={() => setSelectedPortal(null)}
          title={`Sign In - ${selectedPortal.title}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmLogin} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3.5 border border-blue-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs">
                <selectedPortal.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">{selectedPortal.title}</h4>
                <p className="text-[11px] text-slate-600 font-semibold">{selectedPortal.subtitle}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800">
                Official Account Email Address / Select Faculty Profile
              </label>
              {selectedPortal.role === 'teacher' && teachers.length > 0 ? (
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none cursor-pointer"
                >
                  <option value="">Default Faculty (Mrs. Elizabeth Baah)</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="email"
                  required
                  readOnly
                  value={selectedPortal.defaultEmail}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-100 p-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Secret Account Password</span>
                <span className="text-[10px] text-blue-700 font-bold">Encrypted Credentials</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter secret password..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 pr-10 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedPortal(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 cursor-pointer"
              >
                <span>Enter {selectedPortal.title}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* About School Modal */}
      <AboutSchoolModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};
