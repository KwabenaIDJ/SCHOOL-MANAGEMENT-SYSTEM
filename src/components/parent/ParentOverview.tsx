import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { MetricCard } from '../common/MetricCard';
import { formatCurrency } from '../../utils/format';
import { Users, Award, Wallet, CheckCircle2, Bell } from 'lucide-react';

interface ParentOverviewProps {
  onNavigateTab?: (tab: string) => void;
}

export const ParentOverview: React.FC<ParentOverviewProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { students, feeRecords, grades, notices } = useSchoolData();

  const linkedStudent = students.find(s => s.id === 'std-101') || students[0];
  const linkedFee = linkedStudent ? feeRecords.find(f => f.studentId === linkedStudent.id) : null;
  const studentGrades = linkedStudent ? grades.filter(g => g.studentId === linkedStudent.id) : [];

  if (!linkedStudent) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-teal-900 border border-teal-800 p-6 text-white shadow-md">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Users className="h-3.5 w-3.5 text-emerald-300" />
              Parent & Guardian Portal
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl font-heading">
              Welcome back, {currentUser.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100">
              Kidshine Montessori School • Parent Access Portal
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">No Student Profiles Enrolled Yet</h3>
          <p className="mx-auto max-w-md text-xs text-slate-500 leading-relaxed font-medium">
            The school administrator has not registered your child's student profile in the portal yet. Once your child is enrolled in the Student Directory, their academic grades, attendance records, and tuition fee ledgers will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-teal-900 border border-teal-800 p-6 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Users className="h-3.5 w-3.5 text-emerald-300" />
            Parent & Guardian Portal
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100">
            Monitoring progress for child: <span className="font-bold underline">{linkedStudent.name}</span> ({linkedStudent.gradeLevel}).
          </p>
        </div>
      </div>

      {/* Linked Child Profile Card & KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Child's Term Average"
          value={studentGrades.length > 0 ? `${Math.round(studentGrades.reduce((sum, g) => sum + g.total, 0) / studentGrades.length)}%` : '0%'}
          subtitle="Class Academic Performance"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Attendance Rate"
          value={`${linkedStudent.attendancePercentage}%`}
          subtitle="90 Days Enrolled"
          icon={CheckCircle2}
          color="indigo"
        />
        <MetricCard
          title="Tuition Fee Standing"
          value={linkedStudent.feeBalance === 0 ? 'Fully Cleared' : formatCurrency(linkedStudent.feeBalance)}
          subtitle={linkedFee ? `Status: ${linkedFee.status}` : 'Active Tuition'}
          icon={Wallet}
          color={linkedStudent.feeBalance === 0 ? 'purple' : 'rose'}
        />
      </div>

      {/* Academic Highlights & Recent Notices */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Child Subject Grades Overview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Subject Grades Overview ({linkedStudent.name})
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('report-card')}
              className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Full Report Card &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {studentGrades.map(g => (
              <div key={g.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{g.subjectName}</h4>
                  <p className="text-[11px] text-gray-500">CA: {g.ca1 + g.ca2} • Exam: {g.exam}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {g.letterGrade === 'A+' ? 'A' : g.letterGrade}
                  </span>
                  <p className="mt-0.5 text-[11px] font-mono text-gray-500">Total: {g.total}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Announcements feed */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              School Updates for Parents
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('notices')}
              className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              All Notices &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-gray-400">{n.date}</span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
