import React, { useState } from 'react';
import { useSchoolData, PromotionReport } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { GraduationCap, RefreshCw } from 'lucide-react';

interface GhanaPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GhanaPromotionModal: React.FC<GhanaPromotionModalProps> = ({ isOpen, onClose }) => {
  const { students, classrooms, currentTerm, promoteClassStudents } = useSchoolData();

  const availableClassOptions = classrooms.length > 0
    ? classrooms.map(c => ({ id: c.id, name: c.name, teacher: c.classTeacherName }))
    : GHANA_CLASS_HIERARCHY.map((c, i) => ({ id: `cls-def-${i}`, name: c, teacher: 'Assigned Homeroom Teacher' }));

  const [selectedClassName, setSelectedClassName] = useState<string>(availableClassOptions[0]?.name || 'Creche');
  const [report, setReport] = useState<PromotionReport | null>(null);
  const [minGpa, setMinGpa] = useState<number>(2.0);

  const targetClassStudents = students.filter(s => s.gradeLevel === selectedClassName);
  const selectedClassroomObj = classrooms.find(c => c.name === selectedClassName);

  const handleRunClassPromotion = () => {
    if (window.confirm(`Run End of Third Term Promotion for class "${selectedClassName}"?`)) {
      const res = promoteClassStudents(selectedClassName, minGpa);
      setReport(res);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Class Promotion Register"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Banner */}
        <div className="rounded-2xl bg-blue-900 border border-blue-800 p-4 text-white">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-amber-300" />
            <h3 className="text-base font-extrabold">
              End of Term Student Promotion
            </h3>
          </div>
          <p className="mt-1 text-xs text-blue-100">
            Active Term: <strong className="underline font-bold text-white">{currentTerm}</strong>. Promotes qualified students to the next class hierarchy.
          </p>
        </div>

        {!report ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Select Class to Promote *</label>
                <select
                  value={selectedClassName}
                  onChange={e => setSelectedClassName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  {availableClassOptions.map(c => (
                    <option key={c.id} value={c.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                      {c.name} {c.teacher ? `(${c.teacher})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">Min Passing Average Criteria (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={minGpa}
                  onChange={e => setMinGpa(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-900 dark:text-blue-200">Class Teacher:</span>
                <span className="ml-2 text-blue-700 dark:text-blue-300 font-semibold">{selectedClassroomObj?.classTeacherName || 'Assigned Class Teacher'}</span>
              </div>
              <span className="rounded-full bg-blue-200 px-2.5 py-0.5 text-[10px] font-extrabold text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                {targetClassStudents.length} Students
              </span>
            </div>

            {/* Preview of Students */}
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {targetClassStudents.length > 0 ? (
                targetClassStudents.map(st => (
                  <div key={st.id} className="flex items-center justify-between p-3">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{st.name}</span>
                      <span className="ml-2 text-slate-500">({st.gradeLevel})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300`}>
                        Eligible
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 italic">
                  No students enrolled in {selectedClassName} yet.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunClassPromotion}
                disabled={targetClassStudents.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-40 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Promote {selectedClassName} Students
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 dark:bg-emerald-950/40">
                <span className="text-emerald-700 font-bold uppercase text-[10px]">Promoted</span>
                <p className="text-xl font-black text-emerald-800 dark:text-emerald-300">{report.promotedCount}</p>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 dark:bg-blue-950/40">
                <span className="text-blue-700 font-bold uppercase text-[10px]">Graduated JHS 3</span>
                <p className="text-xl font-black text-blue-800 dark:text-blue-300">{report.graduatedCount}</p>
              </div>
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 dark:bg-rose-950/40">
                <span className="text-rose-700 font-bold uppercase text-[10px]">Retained</span>
                <p className="text-xl font-black text-rose-800 dark:text-rose-300">{report.retainedCount}</p>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {report.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{d.name}</span>
                    <p className="text-[11px] text-slate-500">{d.fromClass} ➔ <strong className="text-blue-700 dark:text-blue-400">{d.toClass}</strong></p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.status === 'Promoted' ? 'bg-emerald-100 text-emerald-800' : d.status === 'Graduated' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setReport(null);
                  onClose();
                }}
                className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
              >
                Close & View Updated Roster
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
