import React, { useState, useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { exportToCSV } from '../../utils/export';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Save, Filter, FileSpreadsheet, History } from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { students, classrooms, attendance, markAttendance } = useSchoolData();

  const availableClasses = classrooms.length > 0
    ? classrooms.map(c => c.name)
    : Array.from(GHANA_CLASS_HIERARCHY);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>(availableClasses[0] || 'Creche');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(selectedClass)) {
      setSelectedClass(availableClasses[0]);
    }
  }, [classrooms]);

  // Filter students by selected class
  const classStudents = students.filter(s => s.gradeLevel === selectedClass);

  // Attendance status mapping for the session
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  useEffect(() => {
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    classStudents.forEach(s => {
      initial[s.id] = 'Present';
    });
    setAttendanceMap(initial);
  }, [selectedClass, students]);

  const handleToggle = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    classStudents.forEach(s => {
      updated[s.id] = 'Present';
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const records = classStudents.map(s => ({
      studentId: s.id,
      studentName: s.name,
      gradeLevel: s.gradeLevel,
      status: attendanceMap[s.id] || 'Present'
    }));

    markAttendance(selectedDate, records);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const exportData = classStudents.map(s => ({
      'Student Name': s.name,
      'Roll No / ID': s.rollNo,
      'Class Level': s.gradeLevel,
      'Date': selectedDate,
      'Attendance Status': attendanceMap[s.id] || 'Present'
    }));
    exportToCSV(exportData, `Attendance_Register_${selectedClass.replace(/\s+/g, '_')}_${selectedDate}`);
  };

  const presentCount = Object.values(attendanceMap).filter(v => v === 'Present').length;
  const lateCount = Object.values(attendanceMap).filter(v => v === 'Late').length;
  const absentCount = Object.values(attendanceMap).filter(v => v === 'Absent').length;

  // Filter saved attendance log for the current class & date
  const savedClassLog = attendance.filter(a => a.gradeLevel === selectedClass && a.date === selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Daily Student Attendance Register
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Switch classes and toggle attendance status (Present, Absent, Late) for registered students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export Register (CSV)
          </button>

          <button
            onClick={handleSaveAttendance}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Attendance Sheet
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Attendance records for {selectedClass} on {selectedDate} saved successfully!
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
              <Filter className="h-3 w-3 text-emerald-600" /> Select Class
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="mt-0.5 rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white cursor-pointer"
            >
              {availableClasses.map(className => (
                <option key={className} value={className} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="mt-0.5 rounded-xl border border-gray-200 bg-gray-50 p-2 text-xs font-bold text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
          >
            Mark All Present
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Present</span>
          <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{presentCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
          <span className="text-[10px] font-bold text-amber-600 uppercase">Late</span>
          <p className="text-xl font-black text-amber-700 dark:text-amber-300">{lateCount}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <span className="text-[10px] font-bold text-rose-600 uppercase">Absent</span>
          <p className="text-xl font-black text-rose-700 dark:text-rose-300">{absentCount}</p>
        </div>
      </div>

      {/* Student List Sheet */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
        {classStudents.length > 0 ? (
          classStudents.map(student => {
            const currentStatus = attendanceMap[student.id] || 'Present';
            return (
              <div key={student.id} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{student.name}</h4>
                    <p className="text-[11px] text-gray-500">{student.rollNo} • {student.gradeLevel}</p>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(student.id, 'Present')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      currentStatus === 'Present'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(student.id, 'Late')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      currentStatus === 'Late'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Late
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(student.id, 'Absent')}
                    className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      currentStatus === 'Absent'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Absent
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-gray-400">
            No students enrolled in {selectedClass}.
          </div>
        )}
      </div>

      {/* Saved Attendance History Log Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <History className="h-4 w-4 text-emerald-600" /> Saved Attendance History Log
          </h3>
          <span className="font-mono text-xs font-bold text-slate-500">
            {attendance.length} Total Entries
          </span>
        </div>
        <p className="text-xs text-slate-500">
          All saved attendance registers are stored in the system local storage (`sms_attendance`) and update student statistics automatically.
        </p>

        {savedClassLog.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase dark:bg-slate-800/50 dark:border-slate-800">
                <tr>
                  <th className="px-3.5 py-2.5">Student Name</th>
                  <th className="px-3.5 py-2.5">Class</th>
                  <th className="px-3.5 py-2.5">Date Recorded</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {savedClassLog.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white">{rec.studentName}</td>
                    <td className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300">{rec.gradeLevel}</td>
                    <td className="px-3.5 py-2.5 font-mono text-slate-500">{rec.date}</td>
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        rec.status === 'Late' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4 text-center text-xs font-semibold text-slate-500 dark:bg-slate-800/40">
            No saved attendance log found for <strong>{selectedClass}</strong> on <strong>{selectedDate}</strong>. Click <strong>"Save Attendance Sheet"</strong> above to record today's register!
          </div>
        )}
      </div>
    </div>
  );
};
