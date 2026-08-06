import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { TerminalReportCardPrint } from '../printable/TerminalReportCardPrint';
import { FileText } from 'lucide-react';

export const ReportCardViewer: React.FC = () => {
  const { students, classrooms, grades, currentTerm } = useSchoolData();

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-101');

  const filteredStudents = students.filter(st => {
    if (selectedClass === 'All') return true;
    return st.gradeLevel === selectedClass;
  });

  const activeStudent = students.find(s => s.id === selectedStudentId) || filteredStudents[0] || students[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 font-heading">
            <FileText className="h-6 w-6 text-blue-700 dark:text-blue-400" />
            Terminal Academic Report Cards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select any enrolled student to view, download, or print their official terminal evaluation report card ({currentTerm}).
          </p>
        </div>

        {/* Filters & Selection */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Filter Class
            </label>
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                const firstInClass = students.find(st => e.target.value === 'All' || st.gradeLevel === e.target.value);
                if (firstInClass) setSelectedStudentId(firstInClass.id);
              }}
              className="mt-0.5 rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="All">All Classes ({classrooms.length})</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Selector Dropdown */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Select Student ({filteredStudents.length})
            </label>
            {filteredStudents.length > 0 ? (
              <select
                value={activeStudent?.id || ''}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="mt-0.5 rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer max-w-[240px] truncate"
              >
                {filteredStudents.map(st => (
                  <option key={st.id} value={st.id} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {st.name} ({st.gradeLevel})
                  </option>
                ))}
              </select>
            ) : (
              <span className="mt-0.5 inline-block text-xs font-bold text-slate-400 italic">No students in class</span>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Report Card Printable Component */}
      {activeStudent ? (
        <TerminalReportCardPrint student={activeStudent} grades={grades} academicTerm={currentTerm} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
          Please select a student above to view their terminal report card.
        </div>
      )}
    </div>
  );
};
