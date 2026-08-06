import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { MetricCard } from '../common/MetricCard';
import { Award, BookOpen, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudentOverviewProps {
  onNavigateTab?: (tab: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { students, grades, assignments, timetable } = useSchoolData();

  const studentInfo = students.find(s => s.id === 'std-101') || students[0];
  const myGrades = studentInfo ? grades.filter(g => g.studentId === studentInfo.id) : [];
  const pendingAssignments = assignments.filter(a => a.status === 'Pending');

  if (!studentInfo) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-6 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              Student Academic Dashboard
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl font-heading">
              Welcome to Kidshine Montessori Student Portal
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-amber-100">
              Student Academic & Learning Dashboard
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Award className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">No Student Profiles Registered Yet</h3>
          <p className="mx-auto max-w-md text-xs text-slate-500 leading-relaxed font-medium">
            No active student records exist in the portal system. Once the school administrator registers students, personal student profiles, homework assignments, class timetables, and terminal report cards will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-indigo-700 p-6 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-amber-300" />
            Student Academic Dashboard
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            Welcome back, {studentInfo.name}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-amber-100">
            {studentInfo.rollNo} • {studentInfo.gradeLevel}. You have {pendingAssignments.length} pending homework assignment due this week.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Overall Average %"
          value={myGrades.length > 0 ? `${Math.round(myGrades.reduce((sum, g) => sum + g.total, 0) / myGrades.length)}%` : '0%'}
          subtitle="Terminal Class Performance"
          icon={Award}
          color="amber"
        />
        <MetricCard
          title="My Attendance Rate"
          value={`${studentInfo.attendancePercentage}%`}
          subtitle="96 / 100 Days"
          icon={CheckCircle2}
          color="indigo"
        />
        <MetricCard
          title="Pending Homework"
          value={pendingAssignments.length}
          subtitle="Assignments due soon"
          icon={BookOpen}
          color="rose"
        />
      </div>

      {/* Course Grades Progress & Upcoming Deadlines */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject Progress Bars */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white">
            Current Course Grades & Progress
          </h3>
          <div className="space-y-4">
            {myGrades.map(g => (
              <div key={g.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-900 dark:text-white">{g.subjectName}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{g.total}% ({g.letterGrade})</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${g.total}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Quick Peek */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Upcoming Homework Deadlines
            </h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('assignments')}
              className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map(asg => (
              <div key={asg.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{asg.title}</h4>
                  <p className="text-[11px] text-gray-500">{asg.subjectName} • Due: {asg.dueDate}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    asg.status === 'Graded'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : asg.status === 'Submitted'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {asg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
