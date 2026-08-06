import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AssignmentTracker: React.FC = () => {
  const { assignments, addAssignment, updateAssignmentStatus, deleteAssignment, classrooms, subjects } = useSchoolData();
  const { role } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subjectName: subjects[0]?.name || 'Mathematics',
    gradeLevel: classrooms[0]?.name || 'Grade 10-A',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalPoints: 100,
    description: ''
  });

  const handleToggleSubmit = (id: string, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      updateAssignmentStatus(id, 'Submitted');
    } else if (currentStatus === 'Submitted') {
      updateAssignmentStatus(id, 'Pending');
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title) return;

    addAssignment({
      title: newAssignment.title,
      subjectName: newAssignment.subjectName,
      gradeLevel: newAssignment.gradeLevel,
      dueDate: newAssignment.dueDate,
      totalPoints: Number(newAssignment.totalPoints),
      description: newAssignment.description
    });

    setIsAddModalOpen(false);
    setNewAssignment({ title: '', subjectName: subjects[0]?.name || '', gradeLevel: classrooms[0]?.name || '', dueDate: new Date().toISOString().split('T')[0], totalPoints: 100, description: '' });
  };

  const handleDeleteAssignment = (id: string, title: string) => {
    if (window.confirm(`Delete assignment "${title}"?`)) {
      deleteAssignment(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Assignments & Homework Deadline Tracker
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track subject assignments, download project specifications, and submit homework online.
          </p>
        </div>

        {(role === 'admin' || role === 'teacher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Assignment
          </button>
        )}
      </div>

      {/* Assignment List Cards */}
      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map(asg => (
            <div
              key={asg.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {asg.subjectName} ({asg.gradeLevel})
                    </span>
                    {(asg.dueDate === '2026-08-06' || asg.dueDate === new Date().toISOString().split('T')[0]) ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white animate-pulse">
                        ⏰ DUE TODAY (AUG 6)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-500">
                        Due: {asg.dueDate}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white">
                    {asg.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      asg.status === 'Graded'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : asg.status === 'Submitted'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {asg.status === 'Graded' ? `Graded: ${asg.score}/${asg.totalPoints}` : asg.status}
                  </span>

                  {asg.status !== 'Graded' && (
                    <button
                      onClick={() => handleToggleSubmit(asg.id, asg.status)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white transition-all ${
                        asg.status === 'Submitted'
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {asg.status === 'Submitted' ? 'Unsubmit' : 'Mark as Submitted'}
                    </button>
                  )}

                  {(role === 'admin' || role === 'teacher') && (
                    <button
                      onClick={() => handleDeleteAssignment(asg.id, asg.title)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      title="Delete Assignment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                {asg.description}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
            No assignments posted yet.
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Homework Assignment"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={newAssignment.title}
              onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="e.g. Calculus & Derivatives Problem Set"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Subject Name
              </label>
              <input
                type="text"
                value={newAssignment.subjectName}
                onChange={e => setNewAssignment({ ...newAssignment, subjectName: e.target.value })}
                placeholder="Mathematics"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Due Date
              </label>
              <input
                type="date"
                required
                value={newAssignment.dueDate}
                onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Assignment Description / Instructions
            </label>
            <textarea
              rows={3}
              value={newAssignment.description}
              onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Provide assignment details and problem guidelines..."
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
            >
              Post Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
