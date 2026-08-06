import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { getDefaultTermFee } from '../../constants/ghanaEducation';
import { formatCurrency } from '../../utils/format';
import { Classroom, Subject } from '../../types';
import { Building2, BookOpen, Plus, Trash2, Pencil, RotateCcw } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const { classrooms, subjects, teachers, addClassroom, updateClassroom, deleteClassroom, addSubject, updateSubject, deleteSubject, clearAllClassesAndSubjects } = useSchoolData();

  const [isAddClassModal, setIsAddClassModal] = useState(false);
  const [isEditClassModal, setIsEditClassModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const [isAddSubjectModal, setIsAddSubjectModal] = useState(false);
  const [isEditSubjectModal, setIsEditSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'classroom' | 'subject' } | null>(null);

  // Form states
  const [classForm, setClassForm] = useState({
    name: '',
    gradeLevel: '10th Grade',
    capacity: 35,
    classTeacherId: '',
    classTeacherName: ''
  });

  const [subjectForm, setSubjectForm] = useState({
    code: 'MATH-101',
    name: '',
    gradeLevel: classrooms[0]?.name || 'Grade 10-A',
    teacherId: '',
    teacherName: '',
    weeklyHours: 4,
    credits: 3
  });

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name) return;
    const selectedTch = teachers.find(t => t.id === classForm.classTeacherId);
    addClassroom({
      name: classForm.name,
      gradeLevel: classForm.gradeLevel,
      capacity: classForm.capacity,
      classTeacherId: classForm.classTeacherId,
      classTeacherName: selectedTch ? selectedTch.name : classForm.classTeacherName || 'Unassigned'
    });
    setIsAddClassModal(false);
    setClassForm({ name: '', gradeLevel: '10th Grade', capacity: 35, classTeacherId: '', classTeacherName: '' });
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name) return;
    const selectedTch = teachers.find(t => t.id === subjectForm.teacherId);
    addSubject({
      code: subjectForm.code,
      name: subjectForm.name,
      gradeLevel: subjectForm.gradeLevel,
      teacherId: subjectForm.teacherId,
      teacherName: selectedTch ? selectedTch.name : 'Unassigned',
      weeklyHours: subjectForm.weeklyHours,
      credits: subjectForm.credits
    });
    setIsAddSubjectModal(false);
    setSubjectForm({ code: 'MATH-101', name: '', gradeLevel: classrooms[0]?.name || 'Grade 10-A', teacherId: '', teacherName: '', weeklyHours: 4, credits: 3 });
  };

  const handleOpenEditClass = (cls: Classroom) => {
    setSelectedClassroom(cls);
    setClassForm({
      name: cls.name,
      gradeLevel: cls.gradeLevel || cls.name,
      capacity: cls.capacity,
      classTeacherId: cls.classTeacherId || '',
      classTeacherName: cls.classTeacherName || ''
    });
    setIsEditClassModal(true);
  };

  const handleSaveEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassroom || !classForm.name) return;
    const selectedTch = teachers.find(t => t.id === classForm.classTeacherId);
    updateClassroom(selectedClassroom.id, {
      name: classForm.name,
      gradeLevel: classForm.gradeLevel,
      capacity: classForm.capacity,
      classTeacherId: classForm.classTeacherId,
      classTeacherName: selectedTch ? selectedTch.name : classForm.classTeacherName || 'Unassigned'
    });
    setIsEditClassModal(false);
  };

  const handleOpenEditSubject = (sbj: Subject) => {
    setSelectedSubject(sbj);
    setSubjectForm({
      code: sbj.code,
      name: sbj.name,
      gradeLevel: sbj.gradeLevel,
      teacherId: sbj.teacherId,
      teacherName: sbj.teacherName,
      weeklyHours: sbj.weeklyHours,
      credits: sbj.credits
    });
    setIsEditSubjectModal(true);
  };

  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !subjectForm.name) return;
    const selectedTch = teachers.find(t => t.id === subjectForm.teacherId);
    updateSubject(selectedSubject.id, {
      code: subjectForm.code,
      name: subjectForm.name,
      gradeLevel: subjectForm.gradeLevel,
      teacherId: subjectForm.teacherId,
      teacherName: selectedTch ? selectedTch.name : 'Unassigned',
      weeklyHours: subjectForm.weeklyHours,
      credits: subjectForm.credits
    });
    setIsEditSubjectModal(false);
  };

  const handleDeleteClass = (id: string, name: string) => {
    setDeleteTarget({ id, name, type: 'classroom' });
  };

  const handleDeleteSubject = (id: string, name: string) => {
    setDeleteTarget({ id, name, type: 'subject' });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'classroom') {
      deleteClassroom(deleteTarget.id);
    } else {
      deleteSubject(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Classrooms & Subject Allocation
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Create, manage, or remove custom classrooms, subject offerings, and teacher allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          { (classrooms.length > 0 || subjects.length > 0) && (
            <button
              onClick={() => {
                if (window.confirm('Delete ALL classrooms and subjects? You can add your own custom ones.')) {
                  clearAllClassesAndSubjects();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Clear All Classes
            </button>
          )}
          <button
            onClick={() => setIsAddClassModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Classroom
          </button>
          <button
            onClick={() => setIsAddSubjectModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Classrooms Grid */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Active Classrooms ({classrooms.length})
        </h3>

        {classrooms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classrooms.map(cls => (
              <div
                key={cls.id}
                className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {cls.gradeLevel}
                    </span>
                    <h4 className="mt-1 text-lg font-extrabold text-gray-900 dark:text-white">
                      {cls.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditClass(cls)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Edit Class Information"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Standard Term Tuition:</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      {formatCurrency(getDefaultTermFee(cls.name))} / term
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Class Teacher:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cls.classTeacherName || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                    <span>Enrolled Capacity:</span>
                    <span className="font-semibold">{cls.enrolledCount} / {cls.capacity} Students</span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${Math.min(100, (cls.enrolledCount / cls.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/40">
            <Building2 className="mx-auto h-10 w-10 text-gray-400" />
            <h4 className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">No classrooms created yet</h4>
            <p className="mt-1 text-xs text-gray-500">Click "Add Classroom" above to create your school's classes.</p>
            <button
              onClick={() => setIsAddClassModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Add First Class
            </button>
          </div>
        )}
      </section>

      {/* Subjects Listing Table */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Curriculum Subjects ({subjects.length})
        </h3>

        {subjects.length > 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Class Level</th>
                  <th className="px-4 py-3">Assigned Faculty</th>
                  <th className="px-4 py-3">Weekly Hrs</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {subjects.map(sbj => (
                  <tr key={sbj.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {sbj.code}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                      {sbj.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {sbj.gradeLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {sbj.teacherName}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {sbj.weeklyHours} hrs/wk
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {sbj.credits}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditSubject(sbj)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/40 transition-colors"
                          title="Edit Subject"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(sbj.id, sbj.name)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/40">
            <BookOpen className="mx-auto h-10 w-10 text-gray-400" />
            <h4 className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">No subjects added yet</h4>
            <p className="mt-1 text-xs text-gray-500">Click "Add Subject" above to create custom curriculum subjects.</p>
            <button
              onClick={() => setIsAddSubjectModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" /> Add First Subject
            </button>
          </div>
        )}
      </section>

      {/* Add Classroom Modal */}
      <Modal
        isOpen={isAddClassModal}
        onClose={() => setIsAddClassModal(false)}
        title="Add New Classroom"
        maxWidth="md"
      >
        <form onSubmit={handleSaveClass} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Classroom Name *
            </label>
            <input
              type="text"
              required
              value={classForm.name}
              onChange={e => setClassForm({ ...classForm, name: e.target.value })}
              placeholder="e.g. Grade 10-A, JHS 1, Form 2 Arts"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Maximum Student Capacity
            </label>
            <input
              type="number"
              value={classForm.capacity}
              onChange={e => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Assign Class Teacher
            </label>
            <select
              value={classForm.classTeacherId}
              onChange={e => setClassForm({ ...classForm, classTeacherId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Teacher...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddClassModal(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
            >
              Save Class
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isAddSubjectModal}
        onClose={() => setIsAddSubjectModal(false)}
        title="Add Curriculum Subject"
        maxWidth="md"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={subjectForm.code}
                onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                placeholder="MATH-101"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Subject Title *
              </label>
              <input
                type="text"
                required
                value={subjectForm.name}
                onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="Advanced Mathematics"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Class Level / Target Class
            </label>
            {classrooms.length > 0 ? (
              <select
                value={subjectForm.gradeLevel}
                onChange={e => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={subjectForm.gradeLevel}
                onChange={e => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                placeholder="Grade 10-A"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Assigned Teacher
            </label>
            <select
              value={subjectForm.teacherId}
              onChange={e => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Faculty...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddSubjectModal(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Classroom Modal */}
      {selectedClassroom && (
        <Modal
          isOpen={isEditClassModal}
          onClose={() => setIsEditClassModal(false)}
          title={`Edit Classroom - ${selectedClassroom.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditClass} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Classroom Name *
              </label>
              <input
                type="text"
                required
                value={classForm.name}
                onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                placeholder="e.g. Creche, Nursery, Grade 1, JHS 3"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Maximum Student Capacity
              </label>
              <input
                type="number"
                value={classForm.capacity}
                onChange={e => setClassForm({ ...classForm, capacity: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Assign Class Teacher
              </label>
              <select
                value={classForm.classTeacherId}
                onChange={e => setClassForm({ ...classForm, classTeacherId: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold cursor-pointer"
              >
                <option value="">Select Teacher...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditClassModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Subject Modal */}
      {selectedSubject && (
        <Modal
          isOpen={isEditSubjectModal}
          onClose={() => setIsEditSubjectModal(false)}
          title={`Edit Subject - ${selectedSubject.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditSubject} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  value={subjectForm.code}
                  onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  placeholder="MATH-101"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="Advanced Mathematics"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Class Level / Target Class
              </label>
              {classrooms.length > 0 ? (
                <select
                  value={subjectForm.gradeLevel}
                  onChange={e => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold cursor-pointer"
                >
                  {classrooms.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={subjectForm.gradeLevel}
                  onChange={e => setSubjectForm({ ...subjectForm, gradeLevel: e.target.value })}
                  placeholder="Grade 10-A"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Assigned Teacher
              </label>
              <select
                value={subjectForm.teacherId}
                onChange={e => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-bold cursor-pointer"
              >
                <option value="">Select Faculty...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditSubjectModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/30 hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType={deleteTarget.type}
        />
      )}
    </div>
  );
};
