import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Teacher } from '../../types';
import { getInitialsAvatar } from '../../utils/avatar';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { exportToCSV } from '../../utils/export';
import { UserPlus, Edit3, Trash2, Mail, Phone, BookOpen, Award, ShieldCheck, FileSpreadsheet } from 'lucide-react';

const getDepartmentForClass = (className: string): string => {
  if (['Creche', 'Nursery', 'Kindergarten 1', 'Kindergarten 2'].includes(className)) {
    return 'Preschool Department';
  }
  if (['Grade 1', 'Grade 2', 'Grade 3'].includes(className)) {
    return 'Lower Primary Department';
  }
  if (['Grade 4', 'Grade 5', 'Grade 6'].includes(className)) {
    return 'Upper Primary Department';
  }
  return 'JHS Department';
};

export const StaffDirectory: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchoolData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Preschool Department',
    subjectsAssigned: ['English Language'],
    classTeacherOf: 'Creche',
    status: 'Active' as Teacher['status'],
    qualification: 'B.Ed. Early Childhood Education',
    joinedDate: '2023-08-15',
    avatar: getInitialsAvatar('New Staff Member')
  });

  const getDefaultQualification = (dept: string, enteredQual?: string) => {
    if (enteredQual && enteredQual.trim() !== '') return enteredQual.trim();
    if (dept.includes('Canteen')) return 'Canteen Catering & Food Hygiene Cert.';
    if (dept.includes('Sanitation')) return 'Environmental Hygiene & Sanitation Cert.';
    if (dept.includes('Security')) return 'Senior Security Officer Certification';
    if (dept.includes('Transport')) return 'Commercial Driver License Grade D';
    if (dept.includes('Administration')) return 'B.Sc. Accounting & School Administration';
    return 'B.Ed. Early Childhood / Basic Education';
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: 'Preschool Department',
      subjectsAssigned: ['English Language'],
      classTeacherOf: 'Creche',
      status: 'Active',
      qualification: '',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: getInitialsAvatar('New Staff Member')
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      subjectsAssigned: teacher.subjectsAssigned,
      classTeacherOf: teacher.classTeacherOf || '',
      status: teacher.status,
      qualification: teacher.qualification || '',
      joinedDate: teacher.joinedDate,
      avatar: teacher.avatar
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const email = formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@kidshinemontessori.edu.gh`;
    const avatar = getInitialsAvatar(formData.name);
    const qualification = getDefaultQualification(formData.department, formData.qualification);
    addTeacher({ ...formData, email, qualification, avatar });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    const qualification = getDefaultQualification(formData.department, formData.qualification);
    updateTeacher(selectedTeacher.id, { ...formData, qualification });
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTeacher(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Teacher>[] = [
    {
      header: 'Staff Member',
      accessorKey: 'name',
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-100 dark:ring-slate-800" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{row.name}</div>
            <div className="text-[11px] font-mono text-slate-500">{row.empId} • {row.qualification}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
      cell: row => (
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
          {row.department}
        </span>
      )
    },
    {
      header: 'Class Teacher Of',
      accessorKey: 'classTeacherOf',
      sortable: true,
      cell: row => (
        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {row.classTeacherOf || 'Subject Educator'}
        </span>
      )
    },
    {
      header: 'Contact Info',
      accessorKey: 'phone',
      cell: row => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Mail className="h-3 w-3 text-slate-400" /> {row.email}
          </div>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Phone className="h-3 w-3 text-slate-400" /> {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: row => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            row.status === 'Active'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {row.status}
        </span>
      )
    }
  ];

  const handleExportStaff = () => {
    const exportData = teachers.map((t, index) => ({
      'S/N': index + 1,
      'Emp ID': t.empId,
      'Staff Name': t.name,
      'Department': t.department,
      'Class Teacher Of': t.classTeacherOf || 'Subject Educator',
      'Qualification': t.qualification,
      'Phone': t.phone,
      'Status': t.status
    }));
    exportToCSV(exportData, 'Kidshine_Staff_Directory');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading">
            Staff Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage teaching and non-teaching school staff, department allocations, and roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportStaff}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </button>
        </div>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchPlaceholder="Search staff member, department, qualification..."
        searchFields={['name', 'empId', 'department', 'qualification']}
        exportFileName="staff-directory"
        actions={row => (
          <>
            <button
              onClick={() => handleOpenEdit(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 transition-colors"
              title="Edit Staff Member"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id, row.name)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Staff Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      />

      {/* Add Staff Member Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Staff Member"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Staff Member Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mrs. Elizabeth Baah"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="elizabeth.b@kidshinemontessori.edu.gh"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+233 24 111 0011"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Department
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <optgroup label="Academic & Teaching Departments">
                  <option value="Preschool Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Preschool Department (Creche – KG2)</option>
                  <option value="Lower Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Lower Primary Department (Grade 1 – 3)</option>
                  <option value="Upper Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Upper Primary Department (Grade 4 – 6)</option>
                  <option value="JHS Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">JHS Department (JHS 1 – 3)</option>
                </optgroup>
                <optgroup label="Non-Teaching Support Departments">
                  <option value="Canteen & Catering Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Canteen & Catering Services (Cooks / Vendors)</option>
                  <option value="Sanitation & Cleaning Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Sanitation & Cleaning Services (Cleaners / Janitors)</option>
                  <option value="Security & Campus Safety" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Security & Campus Safety (Guards / Officers)</option>
                  <option value="Transport & Logistics" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Transport & Logistics (School Bus Drivers)</option>
                  <option value="Administration & Accounts" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Administration & Accounts (Bursars / Admin)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Class Teacher Allocation
              </label>
              <select
                value={formData.classTeacherOf}
                onChange={e => {
                  const selClass = e.target.value;
                  setFormData({
                    ...formData,
                    classTeacherOf: selClass,
                    department: selClass ? getDepartmentForClass(selClass) : formData.department
                  });
                }}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">None (Non-Teaching Support Staff)</option>
                {GHANA_CLASS_HIERARCHY.map(c => (
                  <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Qualification / Degree
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="B.Ed. Early Childhood"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Employment Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Active" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Active</option>
                <option value="On Leave" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">On Leave</option>
              </select>
            </div>
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
              Save Staff Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Staff Member Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Staff Member - ${selectedTeacher.name}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Staff Member Full Name *
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
                  Phone Number / Contact *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 24 100 2000"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@kidshinemontessori.edu.gh"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <optgroup label="Academic & Teaching Departments">
                    <option value="Preschool Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Preschool Department (Creche – KG2)</option>
                    <option value="Lower Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Lower Primary Department (Grade 1 – 3)</option>
                    <option value="Upper Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Upper Primary Department (Grade 4 – 6)</option>
                    <option value="JHS Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">JHS Department (JHS 1 – 3)</option>
                  </optgroup>
                  <optgroup label="Non-Teaching Support Departments">
                    <option value="Canteen & Catering Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Canteen & Catering Services (Cooks / Vendors)</option>
                    <option value="Sanitation & Cleaning Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Sanitation & Cleaning Services (Cleaners / Janitors)</option>
                    <option value="Security & Campus Safety" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Security & Campus Safety (Guards / Officers)</option>
                    <option value="Transport & Logistics" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Transport & Logistics (School Bus Drivers)</option>
                    <option value="Administration & Accounts" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Administration & Accounts (Bursars / Admin)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Class Teacher Allocation
                </label>
                <select
                  value={formData.classTeacherOf}
                  onChange={e => {
                    const selClass = e.target.value;
                    setFormData({
                      ...formData,
                      classTeacherOf: selClass,
                      department: selClass ? getDepartmentForClass(selClass) : formData.department
                    });
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">None (Non-Teaching Support Staff)</option>
                  {GHANA_CLASS_HIERARCHY.map(c => (
                    <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Qualification / Degree
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. Sanitation Cert. / B.Ed. Early Childhood"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Employment Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Active" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Active</option>
                  <option value="On Leave" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">On Leave</option>
                </select>
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
                Update Staff Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType="staff member"
        />
      )}
    </div>
  );
};
