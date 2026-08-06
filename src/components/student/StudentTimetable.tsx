import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { TimetableSlot } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { User, Calendar, Filter, Plus, Pencil, Trash2, Clock, PlusCircle } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const { timetable, classrooms, subjects, teachers, addTimetableSlot, updateTimetableSlot, deleteTimetableSlot } = useSchoolData();
  const [selectedClass, setSelectedClass] = useState<string>(classrooms[0]?.name || 'Creche');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [formState, setFormState] = useState({
    gradeLevel: selectedClass,
    day: 'Monday' as TimetableSlot['day'],
    time: '08:00 AM - 09:00 AM',
    subjectName: '',
    teacherName: ''
  });

  const filteredTimetable = timetable.filter(t => t.gradeLevel === selectedClass);

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const presetTimes = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 10:30 AM (Snack & Break)',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '12:30 PM - 01:30 PM (Lunch Break)',
    '01:30 PM - 02:30 PM',
    '02:30 PM - 03:30 PM'
  ];

  const handleOpenAdd = (dayName?: TimetableSlot['day']) => {
    setEditingSlot(null);
    setFormState({
      gradeLevel: selectedClass,
      day: dayName || 'Monday',
      time: '08:00 AM - 09:00 AM',
      subjectName: subjects[0]?.name || 'Literacy & English',
      teacherName: teachers[0]?.name || 'Unassigned Teacher'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setEditingSlot(slot);
    setFormState({
      gradeLevel: slot.gradeLevel,
      day: slot.day,
      time: slot.time,
      subjectName: slot.subjectName,
      teacherName: slot.teacherName
    });
    setIsAddModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.subjectName || !formState.time) return;

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, {
        gradeLevel: formState.gradeLevel,
        day: formState.day,
        time: formState.time,
        subjectName: formState.subjectName,
        teacherName: formState.teacherName
      });
    } else {
      addTimetableSlot({
        gradeLevel: formState.gradeLevel,
        day: formState.day,
        time: formState.time,
        subjectName: formState.subjectName,
        teacherName: formState.teacherName
      });
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteSlot = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTimetableSlot(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Class Switcher and Schedule Action Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Class Schedule & Timetable Grid
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Schedule and manage weekly timetable slots for all academic classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Switcher Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Class:</span>
            {classrooms.length > 0 ? (
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none dark:text-white cursor-pointer"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-xs text-gray-400 italic">No classes</span>
            )}
          </div>

          {/* Add / Schedule Class Slot Button */}
          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Schedule New Class Slot
          </button>
        </div>
      </div>

      {/* Timetable Days Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        {days.map(day => {
          const daySlots = filteredTimetable.filter(t => t.day === day);
          return (
            <div
              key={day}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                      {day}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenAdd(day)}
                    className="rounded-md p-1 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 transition-colors"
                    title={`Add class slot to ${day}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {daySlots.length > 0 ? (
                    daySlots.map(slot => (
                      <div
                        key={slot.id}
                        className="group relative rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20 text-xs space-y-1 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-block rounded-md bg-indigo-600 px-2 py-0.5 text-[9px] font-bold text-white">
                            {slot.time}
                          </span>
                          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(slot)}
                              className="rounded-md p-1 text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 transition-colors"
                              title="Edit Slot"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot.id, `${slot.subjectName} (${slot.day})`)}
                              className="rounded-md p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/50 transition-colors"
                              title="Delete Slot"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-extrabold text-gray-900 dark:text-white text-xs pt-1">
                          {slot.subjectName}
                        </h4>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3 text-indigo-500" /> {slot.teacherName}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[11px] text-gray-400 italic">
                      No scheduled classes
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleOpenAdd(day)}
                className="w-full rounded-xl border border-dashed border-slate-200 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50/50 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-indigo-950/30 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Slot
              </button>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Timetable Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingSlot ? `Edit Class Slot (${formState.day})` : `Schedule New Class Slot for ${selectedClass}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Target Class *
              </label>
              <select
                value={formState.gradeLevel}
                onChange={e => setFormState({ ...formState, gradeLevel: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                {classrooms.map(c => (
                  <option key={c.id} value={c.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Day of Week *
              </label>
              <select
                value={formState.day}
                onChange={e => setFormState({ ...formState, day: e.target.value as TimetableSlot['day'] })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                {days.map(d => (
                  <option key={d} value={d} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Time Period / Slot *
            </label>
            <input
              type="text"
              required
              list="time-presets"
              value={formState.time}
              onChange={e => setFormState({ ...formState, time: e.target.value })}
              placeholder="e.g. 08:00 AM - 09:00 AM"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <datalist id="time-presets">
              {presetTimes.map(t => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Subject Name *
            </label>
            {subjects.length > 0 ? (
              <select
                value={formState.subjectName}
                onChange={e => setFormState({ ...formState, subjectName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={formState.subjectName}
                onChange={e => setFormState({ ...formState, subjectName: e.target.value })}
                placeholder="e.g. English Language & Literacy"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Assigned Instructor / Teacher *
            </label>
            {teachers.length > 0 ? (
              <select
                value={formState.teacherName}
                onChange={e => setFormState({ ...formState, teacherName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.name} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={formState.teacherName}
                onChange={e => setFormState({ ...formState, teacherName: e.target.value })}
                placeholder="e.g. Mrs. Elizabeth Baah"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            )}
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
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
            >
              {editingSlot ? 'Save Changes' : 'Schedule Class Slot'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType="timetable slot"
        />
      )}
    </div>
  );
};
