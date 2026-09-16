import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import {
  FileText,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2
} from 'lucide-react';

export const ExamAdmitCardGenerator: React.FC = () => {
  const { students, classrooms, currentTerm, currentAcademicYear } = useSchoolData();

  const [selectedClass, setSelectedClass] = useState<string>('JHS 3');
  const filteredStudents = students.filter(s => selectedClass === 'All' || s.gradeLevel === selectedClass);

  const handlePrintAdmitCards = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-indigo-900 border border-indigo-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-indigo-200">
              <FileText className="h-3.5 w-3.5 text-indigo-300" />
              Exam Examination Hall Slips
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              Exam Hall Admit Cards & Index Slips
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100">
              Generate and print official examination entrance slips featuring student index numbers, subject schedule, and hall regulations.
            </p>
          </div>

          <button
            onClick={handlePrintAdmitCards}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print Exam Admit Slips ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Exam Class:</label>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-indigo-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
          >
            <option value="All">All Classes ({students.length})</option>
            {classrooms.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <span className="text-xs font-bold text-slate-500">
          Showing {filteredStudents.length} Candidates
        </span>
      </div>

      {/* Printable Grid of Admit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="print-area rounded-2xl border border-slate-300 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white font-black text-xs">
                  KMS
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white font-heading">Kidshine Montessori School</h4>
                  <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">Official Exam Admit Slip • {currentTerm}</p>
                </div>
              </div>
              <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-[10px] font-black text-indigo-800 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-300">
                Index: EXAM-{student.rollNo}
              </span>
            </div>

            {/* Candidate Details */}
            <div className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="h-14 w-14 rounded-xl object-cover ring-2 ring-indigo-600/30"
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">{student.name}</h5>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Class: <strong>{student.gradeLevel}</strong></p>
                <p className="text-[10px] text-slate-500 font-medium">Session: {currentAcademicYear}</p>
              </div>
            </div>

            {/* Exam Hall Rules */}
            <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200 text-[10px] text-amber-950 dark:bg-slate-800 dark:border-slate-700 dark:text-amber-300 space-y-1">
              <div className="font-extrabold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-700" />
                <span>Exam Hall Regulations:</span>
              </div>
              <p className="leading-tight">1. Candidate must display this slip on their desk at all times. 2. No calculators or phones allowed in hall.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
