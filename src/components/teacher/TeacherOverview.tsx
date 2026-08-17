import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData, PromotionReport } from '../../context/SchoolDataContext';
import { MetricCard } from '../common/MetricCard';
import { getNextClass } from '../../constants/ghanaEducation';
import { BookOpen, Users, Award, Clock, CheckCircle2, Calendar, RefreshCw, GraduationCap, ShieldCheck } from 'lucide-react';

interface TeacherOverviewProps {
  onNavigateTab?: (tab: string) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const { students, timetable, classrooms, promoteClassStudents, currentTerm, grades } = useSchoolData();

  // Find the classroom where this teacher is assigned as class teacher
  const assignedClassroom = classrooms.find(c => c.classTeacherId === currentUser.id) ||
                            classrooms.find(c => c.classTeacherName.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase())) ||
                            classrooms[0];

  const assignedClassName = assignedClassroom ? assignedClassroom.name : 'JHS 1';
  const myClassStudents = students.filter(s => s.gradeLevel === assignedClassName);

  // Teacher Promotion override toggles
  const [promotionsState, setPromotionsState] = useState<Record<string, boolean>>({});
  const [promotionReport, setPromotionReport] = useState<PromotionReport | null>(null);

  const getStudentPromotionStatus = (studentId: string, defaultPassing: boolean) => {
    if (studentId in promotionsState) {
      return promotionsState[studentId];
    }
    return defaultPassing;
  };

  const handleToggleStudentPromotion = (studentId: string, current: boolean) => {
    setPromotionsState(prev => ({
      ...prev,
      [studentId]: !current
    }));
  };

  const handleExecuteClassPromotion = () => {
    if (!assignedClassName) return;
    if (window.confirm(`Are you sure you want to promote eligible students of ${assignedClassName}?`)) {
      const report = promoteClassStudents(assignedClassName, 2.0, promotionsState);
      setPromotionReport(report);
    }
  };

  const activeClassesToday = timetable.filter(t => t.gradeLevel === assignedClassName).length;
  const classGrades = grades.filter(g => myClassStudents.some(s => s.id === g.studentId));
  const passRate = classGrades.length > 0 ? `${Math.round((classGrades.filter(g => g.total >= 50).length / classGrades.length) * 100)}%` : '0%';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-indigo-900 border border-indigo-800 p-6 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5 text-blue-300" />
            Class Teacher Portal
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl font-heading">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-indigo-100">
            Assigned Class: <strong className="underline font-bold text-white">{assignedClassName}</strong>. Current Term: <strong>{currentTerm}</strong>.
          </p>
        </div>
      </div>

      {/* Metric KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Assigned Class Roster"
          value={myClassStudents.length}
          subtitle={`Class: ${assignedClassName}`}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Active Classes Today"
          value={activeClassesToday}
          subtitle="Scheduled Periods"
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Class Pass Rate"
          value={passRate}
          subtitle="Term Performance"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Class Teacher Promotion Engine (Class Teacher Only Authority) */}
      <section className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-900/50 dark:bg-gray-900 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Class Teacher Authority
              </span>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Class Student Promotion Engine — {assignedClassName}
              </h3>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              As the assigned Class Teacher for <strong>{assignedClassName}</strong>, evaluate end-of-term student performance and execute promotions to the next class hierarchy.
            </p>
          </div>

          <button
            onClick={handleExecuteClassPromotion}
            disabled={myClassStudents.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Promote {assignedClassName} Students
          </button>
        </div>

        {promotionReport && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 dark:bg-emerald-950/30 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Promotion Successfully Executed for {assignedClassName}!
            </div>
            <p>
              Promoted: <strong>{promotionReport.promotedCount}</strong> | Graduated: <strong>{promotionReport.graduatedCount}</strong> | Retained: <strong>{promotionReport.retainedCount}</strong>
            </p>
          </div>
        )}

        {/* Roster Promotion Decision Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gray-100 bg-gray-50/50 uppercase font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Current Class</th>
                <th className="px-4 py-3">GPA Standing</th>
                <th className="px-4 py-3">Target Promoted Class</th>
                <th className="px-4 py-3 text-right">Class Teacher Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {myClassStudents.length > 0 ? (
                myClassStudents.map(student => {
                  const defaultPassing = student.gpa >= 2.0;
                  const isWillBePromoted = getStudentPromotionStatus(student.id, defaultPassing);
                  const { nextClass } = getNextClass(student.gradeLevel);

                  return (
                    <tr key={student.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <img src={student.avatar} alt={student.name} className="h-7 w-7 rounded-full object-cover" />
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-medium">
                        {student.gradeLevel}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">
                        {student.gpa.toFixed(2)} GPA
                      </td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {isWillBePromoted ? nextClass : `${student.gradeLevel} (Repeat)`}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleToggleStudentPromotion(student.id, isWillBePromoted)}
                          className={`rounded-xl px-3 py-1 text-xs font-extrabold transition-all ${
                            isWillBePromoted
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {isWillBePromoted ? '✓ Approve Promotion' : '✗ Retain Student'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400 italic">
                    No students currently enrolled in {assignedClassName}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timetable Today */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Today's Teaching Schedule
          </h3>
          <div className="space-y-3">
            {timetable.slice(0, 3).map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono text-xs font-bold">
                    {slot.time.split('-')[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{slot.subjectName}</h4>
                    <p className="text-[11px] text-gray-500">{slot.gradeLevel}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Scheduled
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Tasks */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-base font-bold text-gray-900 dark:text-white">
            Quick Actions & Portal Shortcuts
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => onNavigateTab && onNavigateTab('grading')}
              className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-left hover:bg-indigo-100/60 dark:border-indigo-900/40 dark:bg-indigo-950/20 transition-all"
            >
              <div className="rounded-lg bg-indigo-600 p-2 text-white">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Input Grades</div>
                <div className="text-[10px] text-gray-500">Continuous assessment & exam scores</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab && onNavigateTab('attendance')}
              className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left hover:bg-emerald-100/60 dark:border-emerald-900/40 dark:bg-emerald-950/20 transition-all"
            >
              <div className="rounded-lg bg-emerald-600 p-2 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Mark Attendance</div>
                <div className="text-[10px] text-gray-500">Quick status toggles for students</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
