import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import {
  Award,
  Printer,
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  FileCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const GraduationCertificateGenerator: React.FC = () => {
  const { students, classrooms, currentAcademicYear } = useSchoolData();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [certificateType, setCertificateType] = useState<'Graduation' | 'Testimonial' | 'Honor'>('Graduation');
  const [customRemarks, setCustomRemarks] = useState<string>(
    'Demonstrated high moral character, academic dedication, and leadership during their tenure at Kidshine Montessori School.'
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-amber-900 border border-amber-800 p-6 text-white shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-amber-200">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              Official Academic Certification Engine
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              Graduation & Testimonial Certificates
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-amber-100">
              Generate and print official graduation certificates and conduct testimonials for JHS 3 graduates and outstanding scholars.
            </p>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Certificate (A4)</span>
          </button>
        </div>
      </div>

      {/* Certificate Configuration Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white font-heading">
          Certificate Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Select Student Candidate
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.gradeLevel} • Roll: {s.rollNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Certificate Category
            </label>
            <select
              value={certificateType}
              onChange={e => setCertificateType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="Graduation">Basic Completion Certificate</option>
              <option value="Testimonial">Official Conduct Testimonial</option>
              <option value="Honor">Academic Honor Roll Award</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Headmaster Assessment & Conduct Remarks
            </label>
            <input
              type="text"
              value={customRemarks}
              onChange={e => setCustomRemarks(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-amber-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Certificate Preview (A4 Printable Area) */}
      {selectedStudent && (
        <div className="print-area rounded-3xl border-8 border-double border-amber-600/60 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6 relative overflow-hidden dark:bg-slate-900 dark:border-amber-500/40">
          {/* Watermark / Crest */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-amber-400 shadow-md">
              <Award className="h-10 w-10" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
              KIDSHINE MONTESSORI SCHOOL
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mt-1">
              Accra, Ghana • Basic Education Certificate of Excellence
            </p>
          </div>

          <div className="py-4 border-y border-amber-200 dark:border-slate-800 max-w-2xl mx-auto">
            <p className="text-xs font-serif italic text-slate-500 dark:text-slate-400">
              This official document certifies that
            </p>
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-blue-900 dark:text-blue-400 mt-2 tracking-wide">
              {selectedStudent.name}
            </h3>
            <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              has successfully fulfilled the required academic curriculum and continuous assessment for <strong className="text-slate-900 dark:text-white font-bold">{selectedStudent.gradeLevel}</strong> during the <strong className="text-slate-900 dark:text-white font-bold">{currentAcademicYear} Academic Session</strong>.
            </p>

            <p className="mt-4 text-xs font-serif italic text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-slate-800 p-3 rounded-xl border border-amber-100 dark:border-slate-700">
              "{customRemarks}"
            </p>
          </div>

          {/* Signature Lines */}
          <div className="pt-6 grid grid-cols-2 gap-8 max-w-xl mx-auto text-center">
            <div>
              <div className="border-b border-slate-400 dark:border-slate-600 pb-1 font-serif italic text-xs font-bold text-slate-800 dark:text-slate-200">
                Mr. Joseph Appiah
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">Class Teacher</span>
            </div>

            <div>
              <div className="border-b border-slate-400 dark:border-slate-600 pb-1 font-serif italic text-xs font-bold font-black text-blue-900 dark:text-blue-400">
                Isaac Donkoh Junior
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">Headmaster / Proprietor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
