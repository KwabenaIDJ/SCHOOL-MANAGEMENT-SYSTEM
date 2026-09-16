import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import { Modal } from '../common/Modal';
import {
  CreditCard,
  Printer,
  Search,
  Filter,
  UserCheck,
  Building2,
  Sparkles,
  QrCode,
  CheckCircle2,
  Download
} from 'lucide-react';

export const StudentIDCardGenerator: React.FC = () => {
  const { students, classrooms } = useSchoolData();

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'All' || s.gradeLevel === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handlePrintSingle = (student: Student) => {
    setPreviewStudent(student);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handlePrintAllClass = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-blue-900 border border-blue-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-blue-200">
              <CreditCard className="h-3.5 w-3.5 text-blue-300" />
              Student Identification Engine
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              Official Student ID Cards Generator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Generate and print 2-sided high-security plastic/paper Student ID cards complete with barcodes, guardian contact, and school emblem.
            </p>
          </div>

          <button
            onClick={handlePrintAllClass}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print All Visible Cards ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="All">All Classes ({students.length})</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing {filteredStudents.length} Students
        </div>
      </div>

      {/* ID Cards Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-600 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Front of ID Card */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-900 to-indigo-950 p-4 text-white shadow-inner relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-blue-400/30 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
                    KMS
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black tracking-tight font-heading leading-none">Kidshine Montessori</h4>
                    <span className="text-[9px] font-bold text-blue-300">Official Student Pass</span>
                  </div>
                </div>
                <span className="rounded-md bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-950">
                  {student.gradeLevel}
                </span>
              </div>

              {/* Student Body */}
              <div className="mt-3.5 flex items-center gap-3.5">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-16 w-16 rounded-xl object-cover ring-2 ring-amber-400 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-black text-white truncate">{student.name}</h5>
                  <p className="text-[10px] font-extrabold text-blue-200 mt-0.5">ID: {student.rollNo}</p>
                  <p className="text-[10px] font-medium text-blue-300 mt-0.5">DOB: {student.dob || '2015-05-12'}</p>
                  <p className="text-[10px] font-medium text-amber-300 mt-0.5 truncate">Guardian: {student.guardianName || 'N/A'}</p>
                </div>
              </div>

              {/* Barcode Strip */}
              <div className="mt-3 flex items-center justify-between border-t border-blue-400/30 pt-2 text-[9px] text-blue-200">
                <span className="font-mono">|||| ||| ||||| ||||</span>
                <span className="font-bold">Expires: Aug 2027</span>
              </div>
            </div>

            {/* Print Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Parent: {student.guardianPhone || '055 835 8342'}
              </span>
              <button
                onClick={() => handlePrintSingle(student)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-blue-300"
              >
                <Printer className="h-3.5 w-3.5 text-blue-700" /> Print Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
