import React, { useState } from 'react';
import { exportToCSV } from '../../utils/export';
import { FileSpreadsheet } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import { GHANA_CLASS_HIERARCHY, getDefaultTermFee } from '../../constants/ghanaEducation';
import { formatCurrency } from '../../utils/format';
import { getInitialsAvatar } from '../../utils/avatar';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { UserPlus, Eye, Edit3, Trash2, CheckCircle, Filter } from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const { students, classrooms, addStudent, updateStudent, deleteStudent } = useSchoolData();

  const [classFilter, setClassFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Delete Target State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Initial payment state for enrollment
  const [initialPayment, setInitialPayment] = useState<number>(0);

  // Form State
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'rollNo'>>({
    name: '',
    email: '',
    gender: 'Male',
    gradeLevel: 'Creche',
    status: 'Active',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    totalTuition: 1200,
    feeBalance: 1200,
    attendancePercentage: 95,
    gpa: 3.5,
    dob: '2018-01-01',
    address: 'Accra, Ghana',
    joinedDate: new Date().toISOString().split('T')[0],
    avatar: ''
  });

  const activeClassLevels = Array.from(
    new Set([...GHANA_CLASS_HIERARCHY, ...classrooms.map(c => c.name)])
  );

  const filteredStudents = classFilter === 'All'
    ? students
    : students.filter(s => s.gradeLevel === classFilter);

  const handleOpenAdd = () => {
    const defaultClass = activeClassLevels[0] || 'Creche';
    const defaultFee = getDefaultTermFee(defaultClass);

    setInitialPayment(0);
    setFormData({
      name: '',
      email: '',
      gender: 'Male',
      gradeLevel: defaultClass,
      status: 'Active',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      totalTuition: defaultFee,
      feeBalance: defaultFee,
      attendancePercentage: 95,
      gpa: 3.5,
      dob: '2018-01-01',
      address: 'Accra, Ghana',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: getInitialsAvatar('New Student')
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      gender: student.gender,
      gradeLevel: student.gradeLevel,
      status: student.status,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianEmail: student.guardianEmail,
      totalTuition: student.totalTuition,
      feeBalance: student.feeBalance,
      attendancePercentage: student.attendancePercentage,
      gpa: student.gpa,
      dob: student.dob,
      address: student.address,
      joinedDate: student.joinedDate,
      avatar: student.avatar
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const avatar = getInitialsAvatar(formData.name);
    const studentEmail = formData.email.trim() || `${formData.name.toLowerCase().trim().replace(/\s+/g, '.')}@kidshinemontessori.edu.gh`;
    addStudent({ ...formData, email: studentEmail, avatar }, initialPayment);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !formData.name) return;
    updateStudent(selectedStudent.id, formData);
    setIsEditModalOpen(false);
  };

  const columns: Column<Student>[] = [
    {
      header: 'Student Info',
      accessorKey: 'name',
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="h-10 w-10 rounded-full object-cover shadow-xs border border-blue-100 dark:border-slate-800" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">{row.rollNo}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Class Level',
      accessorKey: 'gradeLevel',
      sortable: true,
      cell: row => (
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {row.gradeLevel}
        </span>
      )
    },
    {
      header: 'Parent / Guardian',
      accessorKey: 'guardianName',
      cell: row => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.guardianName}</div>
          <div className="text-[11px] text-slate-500">{row.guardianPhone}</div>
        </div>
      )
    },
    {
      header: 'Term Tuition (GH₵)',
      accessorKey: 'totalTuition',
      sortable: true,
      cell: row => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {formatCurrency(row.totalTuition)}
        </span>
      )
    },
    {
      header: 'Fee Balance (GH₵)',
      accessorKey: 'feeBalance',
      sortable: true,
      cell: row => (
        <span className={`font-mono font-bold ${row.feeBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {formatCurrency(row.feeBalance)}
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: row => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            row.status === 'Active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : row.status === 'Graduated'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}
        >
          <CheckCircle className="h-3 w-3" />
          {row.status}
        </span>
      )
    }
  ];

  const handleExportStudents = () => {
    const exportData = filteredStudents.map((std, index) => ({
      'S/N': index + 1,
      'Roll ID': std.rollNo,
      'Student Name': std.name,
      'Class': std.gradeLevel,
      'Gender': std.gender,
      'Guardian Name': std.guardianName,
      'Guardian Phone': std.guardianPhone,
      'Tuition Fee (GH₵)': std.totalTuition,
      'Paid Deposit (GH₵)': std.totalTuition - std.feeBalance,
      'Balance Due (GH₵)': std.feeBalance,
      'Status': std.status
    }));
    exportToCSV(exportData, `Kidshine_Student_Roster_${classFilter}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Student Roster & Directory <span className="whitespace-nowrap">(Creche to JHS 3)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage student records, enrollment status, parent details, and term tuition fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter */}
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <Filter className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filter Class:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-800 focus:outline-none dark:text-blue-300 cursor-pointer"
            >
              <option value="All" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                All Classes (13 Classes • {students.length} Students)
              </option>
              {activeClassLevels.map(c => {
                const count = students.filter(s => s.gradeLevel === c).length;
                return (
                  <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                    {c} ({count} Students)
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={handleExportStudents}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        searchPlaceholder="Search student name, roll number, or guardian..."
        actions={row => (
          <>
            <button
              onClick={() => handleOpenView(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 transition-colors"
              title="View Full Profile"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleOpenEdit(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 transition-colors"
              title="Edit Student"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id, row.name)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Student"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aseda Arthur"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Student Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="aseda.a@school.edu (Optional)"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Class Level
              </label>
              <select
                value={formData.gradeLevel}
                onChange={e => {
                  const newClass = e.target.value;
                  const stdFee = getDefaultTermFee(newClass);
                  setFormData({
                    ...formData,
                    gradeLevel: newClass,
                    totalTuition: stdFee
                  });
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                {activeClassLevels.map(c => (
                  <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Male" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Male</option>
                <option value="Female" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Female</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                value={formData.guardianName}
                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Mr. Arthur"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Guardian Phone Number
              </label>
              <input
                type="text"
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="+233 55 835 8342"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Term Tuition Fee (GH₵)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const stdFee = getDefaultTermFee(formData.gradeLevel);
                    setFormData({ ...formData, totalTuition: stdFee });
                  }}
                  className="text-[10px] font-bold text-blue-700 hover:underline dark:text-blue-400"
                >
                  Apply Standard (GH₵ {getDefaultTermFee(formData.gradeLevel).toLocaleString()})
                </button>
              </div>
              <input
                type="number"
                value={formData.totalTuition}
                onChange={e => setFormData({ ...formData, totalTuition: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Initial Payment Deposit (GH₵)
              </label>
              <input
                type="number"
                value={initialPayment}
                onChange={e => setInitialPayment(Number(e.target.value))}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Fee Balance Summary pill */}
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40 text-xs flex items-center justify-between">
            <span className="font-bold text-blue-900 dark:text-blue-200">Remaining Fee Balance:</span>
            <span className={`font-mono font-extrabold text-sm ${
              formData.totalTuition - initialPayment > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {formatCurrency(Math.max(0, formData.totalTuition - initialPayment))}
            </span>
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
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      {selectedStudent && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Student - ${selectedStudent.name}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Class Level
                </label>
                <select
                  value={formData.gradeLevel}
                  onChange={e => {
                    const newClass = e.target.value;
                    const stdFee = getDefaultTermFee(newClass);
                    setFormData({
                      ...formData,
                      gradeLevel: newClass,
                      totalTuition: stdFee
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  {activeClassLevels.map(c => (
                    <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">{c}</option>
                  ))}
                  <option value="Graduated (Alumni)" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Graduated (Alumni)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Academic Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Active" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Active</option>
                  <option value="Graduated" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Graduated</option>
                  <option value="Suspended" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Suspended</option>
                  <option value="Inactive" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Term Tuition Fee (GH₵)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const stdFee = getDefaultTermFee(formData.gradeLevel);
                      setFormData({ ...formData, totalTuition: stdFee });
                    }}
                    className="text-[10px] font-bold text-blue-700 hover:underline dark:text-blue-400"
                  >
                    Apply Standard (GH₵ {getDefaultTermFee(formData.gradeLevel).toLocaleString()})
                  </button>
                </div>
                <input
                  type="number"
                  value={formData.totalTuition}
                  onChange={e => setFormData({ ...formData, totalTuition: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tuition Fee Balance (GH₵)
                </label>
                <input
                  type="number"
                  value={formData.feeBalance}
                  onChange={e => setFormData({ ...formData, feeBalance: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Student Profile Modal */}
      {selectedStudent && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Student Profile Overview"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-600/30" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedStudent.rollNo} • Class: {selectedStudent.gradeLevel}</p>
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {selectedStudent.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Term Tuition Fee</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(selectedStudent.totalTuition)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fee Balance</span>
                <p className={`font-mono font-bold text-sm ${selectedStudent.feeBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {formatCurrency(selectedStudent.feeBalance)}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Guardian Name</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedStudent.guardianName}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Guardian Phone</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedStudent.guardianPhone}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Custom Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType="student"
        />
      )}
    </div>
  );
};
