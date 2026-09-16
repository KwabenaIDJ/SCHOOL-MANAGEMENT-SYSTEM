import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Teacher } from '../../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  UserCheck,
  Building2,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

interface StaffAttendanceEntry {
  teacherId: string;
  name: string;
  department: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  timeIn: string;
  notes: string;
}

export const StaffAttendanceTracker: React.FC = () => {
  const { teachers } = useSchoolData();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, StaffAttendanceEntry>>(() => {
    const initialMap: Record<string, StaffAttendanceEntry> = {};
    teachers.forEach((t, idx) => {
      initialMap[t.id] = {
        teacherId: t.id,
        name: t.name,
        department: t.department,
        status: idx % 4 === 0 ? 'Late' : idx % 5 === 0 ? 'On Leave' : 'Present',
        timeIn: idx % 4 === 0 ? '07:45 AM' : '07:15 AM',
        notes: ''
      };
    });
    return initialMap;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (tId: string, newStatus: 'Present' | 'Absent' | 'Late' | 'On Leave') => {
    setAttendanceMap(prev => ({
      ...prev,
      [tId]: {
        ...prev[tId],
        status: newStatus,
        timeIn: newStatus === 'Present' ? '07:15 AM' : newStatus === 'Late' ? '07:45 AM' : 'N/A'
      }
    }));
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStaff = teachers.length;
  const presentCount = Object.values(attendanceMap).filter(a => a.status === 'Present').length;
  const lateCount = Object.values(attendanceMap).filter(a => a.status === 'Late').length;
  const leaveCount = Object.values(attendanceMap).filter(a => a.status === 'On Leave').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-teal-900 border border-teal-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-teal-200">
              <UserCheck className="h-3.5 w-3.5 text-teal-300" />
              Faculty Attendance & Punctuality Register
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              Staff & Teacher Attendance Tracker
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-teal-100">
              Track daily arrival times, absence logs, and leave applications for teaching and non-teaching staff.
            </p>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Check className="h-4 w-4" />
            <span>Save Staff Register</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Staff attendance register for {selectedDate} saved successfully to audit logs!</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xl font-black text-slate-900 dark:text-white font-heading">{totalStaff}</div>
          <div className="text-[11px] font-bold text-slate-500">Total Staff Roster</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-heading">{presentCount}</div>
          <div className="text-[11px] font-bold text-slate-500">Present Today</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-heading">{lateCount}</div>
          <div className="text-[11px] font-bold text-slate-500">Late Arrivals</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-heading">{leaveCount}</div>
          <div className="text-[11px] font-bold text-slate-500">On Approved Leave</div>
        </div>
      </div>

      {/* Date & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-teal-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter staff name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs font-bold text-slate-900 focus:border-teal-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Staff Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Staff Educator</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5">Arrival Time</th>
              <th className="p-3.5">Status Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTeachers.map(teacher => {
              const entry = attendanceMap[teacher.id] || { status: 'Present', timeIn: '07:15 AM' };
              return (
                <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={teacher.avatar} alt={teacher.name} className="h-8 w-8 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{teacher.name}</span>
                        <span className="block text-[10px] text-slate-500 font-medium">{teacher.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700 dark:text-slate-300">
                    {teacher.department}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                    {entry.timeIn}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      {(['Present', 'Late', 'Absent', 'On Leave'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(teacher.id, st)}
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold transition-all cursor-pointer ${
                            entry.status === st
                              ? st === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : st === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : st === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
