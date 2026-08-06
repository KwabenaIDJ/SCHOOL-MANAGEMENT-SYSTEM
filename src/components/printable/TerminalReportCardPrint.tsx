import React from 'react';
import { Student, GradeEntry } from '../../types';
import { useSchoolData } from '../../context/SchoolDataContext';
import { getOrdinalSuffix, formatCurrency } from '../../utils/format';
import { Printer, ShieldCheck, Award, CheckCircle, Trophy, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TerminalReportCardPrintProps {
  student: Student;
  grades: GradeEntry[];
  academicTerm?: string;
  onClose?: () => void;
}

export const TerminalReportCardPrint: React.FC<TerminalReportCardPrintProps> = ({
  student,
  grades,
  academicTerm = 'Term 1 - Academic Session 2026'
}) => {
  const { students } = useSchoolData();

  const studentGrades = grades.filter(g => g.studentId === student.id || g.studentName === student.name);

  // Classmates ranking calculation
  const classmates = students.filter(s => s.gradeLevel === student.gradeLevel);

  const classmateRankings = classmates.map(c => {
    const cGrades = grades.filter(g => g.studentId === c.id || g.studentName === c.name);
    const cTotalAchieved = cGrades.reduce((sum, g) => sum + g.total, 0);
    const cCount = cGrades.length || 5;
    const cAttainable = cCount * 100;
    return {
      studentId: c.id,
      name: c.name,
      totalAchieved: cTotalAchieved,
      totalAttainable: cAttainable,
      percentage: cAttainable > 0 ? Math.round((cTotalAchieved / cAttainable) * 100) : 85
    };
  }).sort((a, b) => b.totalAchieved - a.totalAchieved);

  const studentRankIndex = classmateRankings.findIndex(r => r.studentId === student.id);
  const rank = studentRankIndex !== -1 ? studentRankIndex + 1 : 1;
  const totalClassmates = classmates.length || 1;
  const positionString = `${getOrdinalSuffix(rank)} out of ${totalClassmates}`;

  // Current student scores
  const totalAchieved = studentGrades.reduce((acc, g) => acc + g.total, 0);
  const subjectCount = studentGrades.length > 0 ? studentGrades.length : 5;
  const totalAttainable = subjectCount * 100;
  const averagePercentage = totalAttainable > 0 ? Math.round((totalAchieved / totalAttainable) * 100) : 85;

  // Passing Criteria: Half or more of total marks (>= 50%)
  const isPassed = totalAchieved >= (totalAttainable / 2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar for Web UI (no-print) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800 no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
          <Award className="h-4 w-4" />
          Official Terminal Academic Report Card Ready
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF Report Card
        </button>
      </div>

      {/* Printable Report Document */}
      <div className="print-container rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-gray-900">
        {/* School Header */}
        <div className="flex items-start justify-between border-b-2 border-blue-900 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-blue-800" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-blue-950 font-heading">
                  KIDSHINE MONTESSORI SCHOOL
                </h1>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Official Terminal Evaluation & Academic Transcript
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Accra, Ghana • Tel: +233 (0) 30 298 4120 • Web: www.kidshinemontessori.edu.gh
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-black text-blue-900 uppercase">
              TERMINAL REPORT CARD
            </span>
            <p className="mt-2 text-xs font-bold text-gray-700">{academicTerm}</p>
            <p className="text-xs text-gray-500">Issued Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Student Profile & Performance Overview Grid */}
        <div className="my-6 rounded-xl bg-slate-50 p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Student Name</span>
            <p className="font-extrabold text-gray-900 text-xs truncate">{student.name}</p>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Roll / ID No</span>
            <p className="font-mono font-bold text-gray-800">{student.rollNo}</p>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Class Level</span>
            <p className="font-bold text-blue-700">{student.gradeLevel}</p>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Total Marks Achieved</span>
            <p className="font-mono font-bold text-gray-900">{totalAchieved} / {totalAttainable}</p>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Term Average Score</span>
            <p className="font-mono font-black text-blue-700 text-sm">{averagePercentage}%</p>
          </div>
          <div>
            <span className="text-gray-400 font-bold uppercase text-[9px]">Class Position / Rank</span>
            <p className="font-mono font-black text-emerald-700 text-sm flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              {positionString}
            </p>
          </div>
        </div>

        {/* Subject Performance Breakdown Table */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">
              Subject Assessment & Final Exam Breakdown ({subjectCount} Subjects • {totalAttainable} Total Marks)
            </h3>
            <span className="text-[11px] font-bold text-gray-500">
              Pass Standard: ≥ 50% Total Marks
            </span>
          </div>
          <table className="w-full text-left text-xs border border-gray-200">
            <thead className="border-b-2 border-gray-300 bg-gray-100 uppercase font-extrabold text-gray-700">
              <tr>
                <th className="py-2.5 px-3 border-r border-gray-200">Subject Title</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-200">CA 1 (15)</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-200">CA 2 (15)</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-200">Exam (70)</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-200">Total (100)</th>
                <th className="py-2.5 px-3 text-center border-r border-gray-200">Grade</th>
                <th className="py-2.5 px-3">Teacher Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentGrades.length > 0 ? (
                studentGrades.map(g => (
                  <tr key={g.id}>
                    <td className="py-2.5 px-3 font-bold text-gray-900 border-r border-gray-200">{g.subjectName}</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-gray-200">{g.ca1}</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-gray-200">{g.ca2}</td>
                    <td className="py-2.5 px-3 text-center font-mono border-r border-gray-200">{g.exam}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-900 border-r border-gray-200">{g.total}</td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-700 border-r border-gray-200">{g.letterGrade}</td>
                    <td className="py-2.5 px-3 text-gray-600 italic text-[11px]">{g.teacherRemarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-400">
                    No subject grades entered for this term yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Promotion Status Banner & Next Term Bill */}
        <div className="my-5 grid gap-4 sm:grid-cols-2">
          {/* Promotion Decision */}
          <div className={`rounded-xl border p-3.5 ${isPassed ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950' : 'border-rose-200 bg-rose-50/70 text-rose-950'}`}>
            <div className="flex items-center gap-2">
              {isPassed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-rose-600" />}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Terminal Class Promotion Decision</span>
                <h4 className="font-black text-xs uppercase tracking-tight">
                  {isPassed ? `PASSED (${averagePercentage}%) - PROMOTED TO NEXT CLASS` : `RETAINED (${averagePercentage}%) - REQUIRES REMEDIAL`}
                </h4>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-gray-600">
              {isPassed
                ? `Student achieved ${totalAchieved} out of ${totalAttainable} marks (above 50% pass requirement).`
                : `Student achieved ${totalAchieved} out of ${totalAttainable} marks (below 50% pass requirement).`}
            </p>
          </div>

          {/* Next Term Tuition Bill (Entered by Administrator) */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-blue-950">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Next Academic Term Tuition Bill</span>
                <h4 className="font-extrabold text-sm text-blue-900">
                  {formatCurrency(student.totalTuition)}
                </h4>
              </div>
              <span className="rounded-lg bg-blue-200 px-2.5 py-1 text-[10px] font-bold text-blue-900">
                Configured by Admin (Bursar)
              </span>
            </div>
            <p className="mt-1 text-[10px] text-blue-700">
              Includes Tuition, Learning Materials & ICT Facilities for the upcoming term.
            </p>
          </div>
        </div>

        {/* Attendance & Grading Scale Summary */}
        <div className="my-6 grid grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-gray-200 p-3">
            <h4 className="font-bold text-gray-900 mb-1">Attendance Record</h4>
            <p className="text-gray-600">Total School Days: <span className="font-bold">90 Days</span></p>
            <p className="text-gray-600">Days Present: <span className="font-bold text-emerald-600">86 Days ({student.attendancePercentage}%)</span></p>
          </div>

          <div className="rounded-xl border border-gray-200 p-3">
            <h4 className="font-bold text-gray-900 mb-1">Ghana Basic Education Grading Scale</h4>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              <strong>A (80-100%)</strong>: Excellent • <strong>B+ (75-79%)</strong>: Very Good • <strong>B (70-74%)</strong>: Good • <strong>C+ (65-69%)</strong>: Credit • <strong>C (60-64%)</strong>: Credit • <strong>D+ (55-59%)</strong>: Pass • <strong>D (50-54%)</strong>: Pass • <strong>E (40-49%)</strong>: Weak Pass • <strong>F (0-39%)</strong>: Fail
            </p>
          </div>
        </div>

        {/* Principal Remarks & Signatures */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-xs space-y-4">
          <div>
            <span className="font-bold text-gray-800">Class Teacher Remarks:</span>
            <p className="text-gray-700 italic bg-gray-50 p-2.5 rounded-lg border border-gray-200 mt-1">
              "{student.name} ranked {positionString} in {student.gradeLevel} with an overall term average of {averagePercentage}%. {isPassed ? 'Keep up the exemplary performance!' : 'Requires steady academic support and revision.'}"
            </p>
          </div>

          <div className="pt-8 flex items-center justify-between text-center text-xs">
            <div>
              <div className="h-10 border-b border-gray-400 w-44 mb-1"></div>
              <p className="font-bold text-gray-800">Class Teacher</p>
              <p className="text-[10px] text-gray-500">Signature & Date</p>
            </div>

            <div>
              <div className="h-10 border-b border-gray-400 w-44 mb-1"></div>
              <p className="font-bold text-gray-800">Kidshine School Principal</p>
              <p className="text-[10px] text-gray-500">Official Stamp & Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
