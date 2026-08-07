import React, { useState } from 'react';
import { UserRole } from '../../types';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Building2,
  Lock,
  PhoneCall,
  ShieldCheck,
  BookOpen,
  CheckCheck,
  Calendar,
  Users,
  GraduationCap,
  Bell,
  HelpCircle
} from 'lucide-react';

interface StepItem {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  highlightTag: string;
  targetTab?: string;
}

interface HelpTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onNavigateTab?: (tab: string) => void;
}

export const HelpTourModal: React.FC<HelpTourModalProps> = ({
  isOpen,
  onClose,
  role,
  onNavigateTab
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const getTourSteps = (): StepItem[] => {
    switch (role) {
      case 'admin':
        return [
          {
            title: 'Welcome to the School Administrator Portal',
            subtitle: 'Complete Cloud-Based School Management & Automation System',
            description: 'Manage student enrollments, staff directories, fee ledgers, next-term fee bills, and system security all from your central dashboard.',
            icon: Building2,
            highlightTag: 'Overview Dashboard',
            targetTab: 'overview'
          },
          {
            title: 'Academic Term Switcher & Term Locking Engine',
            subtitle: 'Protect Report Cards & Grade Integrity',
            description: 'Easily switch between First Term, Second Term, and Third Term. Use the Lock button to freeze academic terms and prevent unauthorized score edits after exams.',
            icon: Lock,
            highlightTag: 'Header Controls',
            targetTab: 'overview'
          },
          {
            title: '1.5-Month Overdue Fee Alert & Direct Call List',
            subtitle: 'Accelerated Tuition Collection Engine',
            description: 'The system automatically flags parents owing tuition 45 days into the term. Use the direct "📞 Call Parent" button to call guardians immediately from your phone or PC!',
            icon: PhoneCall,
            highlightTag: 'Fee Management',
            targetTab: 'overview'
          },
          {
            title: 'Passwords Directory & System Audit Logs',
            subtitle: 'Enterprise Security & Audit Trail Register',
            description: 'Auto-generate secure passwords for staff and parents. Track every user action, fee payment, and grade edit in real-time inside the System Audit Logs.',
            icon: ShieldCheck,
            highlightTag: 'Security & Audit Logs',
            targetTab: 'audit-logs'
          }
        ];
      case 'teacher':
        return [
          {
            title: 'Welcome to the Teacher & Educator Portal',
            subtitle: 'Ghanaian Basic Education Grading & Score Engine',
            description: 'Enter continuous assessment scores (CA1 15%, CA2 15%, Exam 70%). The system automatically calculates total marks, A–F letter grades, 50%+ pass status, and 1st–Nth class position rankings!',
            icon: BookOpen,
            highlightTag: 'Grading Engine',
            targetTab: 'grading'
          },
          {
            title: 'Daily Student Attendance Tracker',
            subtitle: '1-Click Attendance Marking Register',
            description: 'Mark student attendance (Present, Absent, Late) per class level with 1-click status toggles and track attendance percentages across the academic term.',
            icon: CheckCheck,
            highlightTag: 'Attendance Tracker',
            targetTab: 'attendance'
          },
          {
            title: 'Homework Assignments & Class Timetables',
            subtitle: 'Interactive Homework & Schedule Management',
            description: 'Assign homework tasks with due dates for students and parents, and view interactive weekly class timetables.',
            icon: Calendar,
            highlightTag: 'Homework & Schedules',
            targetTab: 'assignments'
          }
        ];
      case 'parent':
        return [
          {
            title: 'Welcome to the Parent & Guardian Portal',
            subtitle: 'Track Your Child\'s Academic Journey',
            description: 'Monitor your children\'s academic scores, class position rankings, homework assignments, and attendance records live from your smartphone or laptop.',
            icon: Users,
            highlightTag: 'Children Overview',
            targetTab: 'overview'
          },
          {
            title: '1-Click Terminal Report Card Downloads',
            subtitle: 'Standardized Printable A4 Report Cards',
            description: 'Download official terminal report cards featuring subject marks, teacher remarks, principal promotion decisions, and itemized next-term fee bills.',
            icon: GraduationCap,
            highlightTag: 'Terminal Report Card',
            targetTab: 'report-card'
          },
          {
            title: 'Tuition Payment History & School Announcements',
            subtitle: 'Stay Updated on Fee Balances & Notices',
            description: 'Check paid tuition receipts, view outstanding fee balances, and read official school announcements from the headmaster.',
            icon: Bell,
            highlightTag: 'School Notices',
            targetTab: 'notices'
          }
        ];
    }
  };

  const steps = getTourSteps();
  const currentStep = steps[currentStepIdx] || steps[0];
  const IconComponent = currentStep.icon;
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleNext = () => {
    if (currentStep.targetTab && onNavigateTab) {
      onNavigateTab(currentStep.targetTab);
    }

    if (isLastStep) {
      localStorage.setItem('sms_tour_completed', 'true');
      onClose();
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevStep = steps[currentStepIdx - 1];
      if (prevStep.targetTab && onNavigateTab) {
        onNavigateTab(prevStep.targetTab);
      }
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('sms_tour_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Header Gradient Strip */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                <HelpCircle className="h-4 w-4 text-blue-200" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                Interactive System Tour • Step {currentStepIdx + 1} of {steps.length}
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="rounded-full p-1 text-blue-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Skip Tour"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white shadow-md backdrop-blur-md">
              <IconComponent className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <span className="inline-block rounded-md bg-blue-500/30 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-100 backdrop-blur-xs">
                {currentStep.highlightTag}
              </span>
              <h3 className="text-lg font-black tracking-tight text-white font-heading mt-0.5">
                {currentStep.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h4 className="text-xs font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
            {currentStep.subtitle}
          </h4>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {currentStep.description}
          </p>

          {/* Progress Indicators */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentStepIdx(idx);
                    if (steps[idx].targetTab && onNavigateTab) {
                      onNavigateTab(steps[idx].targetTab!);
                    }
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIdx
                      ? 'w-6 bg-blue-700 dark:bg-blue-500'
                      : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                  }`}
                  title={`Go to Step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStepIdx > 0 && (
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              )}

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-all cursor-pointer"
              >
                <span>{isLastStep ? 'Finish Tour' : 'Next Step'}</span>
                {isLastStep ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
