import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GradeEntry } from '../../types';
import { Award, Save, Edit3, Plus, Trash2, Calculator } from 'lucide-react';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const GradeEntryView: React.FC = () => {
  const { students, subjects, grades, updateGrade, addGrade, deleteGrade, classrooms, currentTerm } = useSchoolData();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>(classrooms[0]?.name || 'Grade 1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [formState, setFormState] = useState({
    studentId: '',
    subjectId: '',
    ca1: 12,
    ca2: 13,
    exam: 60,
    teacherRemarks: 'Good performance'
  });

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const subjectGrades = selectedSubjectId
    ? grades.filter(g => g.subjectId === selectedSubjectId)
    : grades;

  const handleEditClick = (grade: GradeEntry) => {
    setEditingGradeId(grade.id);
    setFormState({
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      ca1: grade.ca1,
      ca2: grade.ca2,
      exam: grade.exam,
      teacherRemarks: grade.teacherRemarks
    });
  };

  const handleSaveEdit = (gradeId: string) => {
    updateGrade(gradeId, {
      ca1: Number(formState.ca1),
      ca2: Number(formState.ca2),
      exam: Number(formState.exam),
      teacherRemarks: formState.teacherRemarks
    });
    setEditingGradeId(null);
  };

  const handleDeleteGrade = (id: string, studentName: string) => {
    setDeleteTarget({ id, name: `Grade Record for ${studentName}` });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteGrade(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleOpenAdd = () => {
    setFormState({
      studentId: students[0]?.id || '',
      subjectId: selectedSubjectId || subjects[0]?.id || '',
      ca1: 12,
      ca2: 13,
      exam: 60,
      teacherRemarks: 'Good progress made in term tests.'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === formState.studentId);
    if (!st) return;

    const selectedSub = subjects.find(s => s.id === formState.subjectId) || activeSubject;

    addGrade({
      studentId: st.id,
      studentName: st.name,
      subjectId: selectedSub ? selectedSub.id : 'sbj-custom',
      subjectName: selectedSub ? selectedSub.name : 'General Academic Subject',
      gradeLevel: st.gradeLevel,
      academicTerm: currentTerm,
      ca1: Number(formState.ca1),
      ca2: Number(formState.ca2),
      exam: Number(formState.exam),
      teacherRemarks: formState.teacherRemarks
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Academic Grading & Score Entry Sheet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter continuous assessment (CA1: 15%, CA2: 15%) and final examination (70%) scores.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Student Score Entry
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Select Subject Filter
            </label>
            {subjects.length > 0 ? (
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="mt-0.5 rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">All Subjects ({subjects.length})</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-slate-400 italic">No subjects added yet</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400">
              Class Level Filter
            </label>
            {classrooms.length > 0 ? (
              <select
                value={selectedGradeLevel}
                onChange={e => setSelectedGradeLevel(e.target.value)}
                className="mt-0.5 rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">{c.name}</option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-slate-400 italic">No classes added yet</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-semibold">
            <Calculator className="h-4 w-4 text-blue-700" />
            CA1: 15% | CA2: 15% | Exam: 70% = Total: 100%
          </span>
        </div>
      </div>

      {/* Grade Table Sheet */}
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-blue-50/50 uppercase font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">CA 1 (15)</th>
              <th className="px-4 py-3">CA 2 (15)</th>
              <th className="px-4 py-3">Exam (70)</th>
              <th className="px-4 py-3">Total (100)</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Teacher Remarks</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
            {subjectGrades.length > 0 ? (
              subjectGrades.map(grade => {
                const isEditing = editingGradeId === grade.id;
                return (
                  <tr key={grade.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {grade.studentName}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-semibold">
                      {grade.subjectName}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          max={15}
                          min={0}
                          value={formState.ca1}
                          onChange={e => setFormState({ ...formState, ca1: Number(e.target.value) })}
                          className="w-16 rounded-lg border border-slate-300 p-1 text-center font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span className="font-mono font-semibold">{grade.ca1}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          max={15}
                          min={0}
                          value={formState.ca2}
                          onChange={e => setFormState({ ...formState, ca2: Number(e.target.value) })}
                          className="w-16 rounded-lg border border-slate-300 p-1 text-center font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span className="font-mono font-semibold">{grade.ca2}</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          max={70}
                          min={0}
                          value={formState.exam}
                          onChange={e => setFormState({ ...formState, exam: Number(e.target.value) })}
                          className="w-16 rounded-lg border border-slate-300 p-1 text-center font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span className="font-mono font-semibold">{grade.exam}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 font-mono font-black text-blue-700 dark:text-blue-400 text-sm">
                      {isEditing ? formState.ca1 + formState.ca2 + formState.exam : grade.total}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 font-black text-xs ${
                        grade.letterGrade.startsWith('A') ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        grade.letterGrade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        grade.letterGrade.startsWith('C') ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                        grade.letterGrade.startsWith('D') ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        grade.letterGrade === 'E' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {grade.letterGrade === 'A+' ? 'A' : grade.letterGrade}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formState.teacherRemarks}
                          onChange={e => setFormState({ ...formState, teacherRemarks: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 p-1 text-xs text-slate-900 dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-300 italic">{grade.teacherRemarks}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(grade.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(grade)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="Edit Marks"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteGrade(grade.id, grade.studentName)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-xs text-slate-400 italic">
                  No grade entries recorded for this selection yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Grade Entry Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Student Grade Record"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Select Student *
            </label>
            <select
              value={formState.studentId}
              onChange={e => setFormState({ ...formState, studentId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  {s.name} ({s.rollNo} • {s.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Select Subject *
            </label>
            <select
              value={formState.subjectId}
              onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                CA 1 (Max 15)
              </label>
              <input
                type="number"
                max={15}
                min={0}
                value={formState.ca1}
                onChange={e => setFormState({ ...formState, ca1: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                CA 2 (Max 15)
              </label>
              <input
                type="number"
                max={15}
                min={0}
                value={formState.ca2}
                onChange={e => setFormState({ ...formState, ca2: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Exam (Max 70)
              </label>
              <input
                type="number"
                max={70}
                min={0}
                value={formState.exam}
                onChange={e => setFormState({ ...formState, exam: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Teacher Evaluation Remarks
            </label>
            <input
              type="text"
              value={formState.teacherRemarks}
              onChange={e => setFormState({ ...formState, teacherRemarks: e.target.value })}
              placeholder="e.g. Excellent problem solving skills shown."
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
            >
              Save Grade Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType="grade record"
        />
      )}
    </div>
  );
};
