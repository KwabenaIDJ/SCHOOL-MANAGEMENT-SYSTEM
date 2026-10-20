import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Teacher, UserRole } from '../../types';
import { getInitialsAvatar } from '../../utils/avatar';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { exportToCSV } from '../../utils/export';
import {
  UserPlus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Award,
  ShieldCheck,
  ShieldAlert,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Check,
  Building2,
  Wallet
} from 'lucide-react';

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
  const { teachers, classrooms, subjects, userCredentials, addTeacher, updateTeacher, deleteTeacher, assignStaffRole } = useSchoolData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Role Assignment Modal State
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [assignTargetTeacher, setAssignTargetTeacher] = useState<Teacher | null>(null);
  const [assignedRole, setAssignedRole] = useState<UserRole>('teacher');
  const [assignedDesignation, setAssignedDesignation] = useState<string>('Class Teacher');
  const [assignedClass, setAssignedClass] = useState<string>('Creche');
  const [assignedDepartment, setAssignedDepartment] = useState<string>('Preschool Department');
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]);
  const [roleSuccessMessage, setRoleSuccessMessage] = useState<string>('');

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

  const handleOpenAssignRole = (teacher: Teacher) => {
    setAssignTargetTeacher(teacher);
    const existingCred = userCredentials.find(
      c => c.userId === teacher.id || (teacher.email && c.email.toLowerCase() === teacher.email.toLowerCase())
    );
    const currentRole = existingCred?.role || 'teacher';
    setAssignedRole(currentRole);
    setAssignedClass(teacher.classTeacherOf || (classrooms[0]?.name || 'Creche'));
    setAssignedDepartment(teacher.department || 'Preschool Department');
    setAssignedSubjects(teacher.subjectsAssigned || []);

    if (currentRole === 'bursar' || teacher.department.toLowerCase().includes('finance')) {
      setAssignedDesignation('School Bursar / Accountant');
    } else if (currentRole === 'admin') {
      setAssignedDesignation('Assistant Administrator');
    } else if (teacher.classTeacherOf) {
      setAssignedDesignation('Class Teacher');
    } else {
      setAssignedDesignation('Subject Educator');
    }

    setIsAssignRoleModalOpen(true);
  };

  const handleSaveAssignRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTargetTeacher) return;

    assignStaffRole(assignTargetTeacher.id, assignedRole, {
      department: assignedDepartment,
      classTeacherOf: assignedRole === 'teacher' && assignedDesignation === 'Class Teacher' ? assignedClass : '',
      subjectsAssigned: assignedSubjects,
      designationTitle: assignedDesignation
    });

    setIsAssignRoleModalOpen(false);
    setRoleSuccessMessage(
      `Successfully updated ${assignTargetTeacher.name}'s role to ${assignedRole.toUpperCase()} (${assignedDesignation})!`
    );
    setTimeout(() => setRoleSuccessMessage(''), 4500);
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
      header: 'System Access Role',
      accessorKey: 'id',
      cell: row => {
        const cred = userCredentials.find(
          c => c.userId === row.id || (row.email && c.email.toLowerCase() === row.email.toLowerCase())
        );
        const role = cred?.role || 'teacher';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              role === 'admin'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                : role === 'bursar'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}
          >
            {role === 'admin' ? (
              <ShieldAlert className="h-3 w-3 text-purple-700" />
            ) : role === 'bursar' ? (
              <Wallet className="h-3 w-3 text-amber-700" />
            ) : (
              <BookOpen className="h-3 w-3 text-blue-700" />
            )}
            <span className="capitalize">{role === 'bursar' ? 'Bursar / Accountant' : role}</span>
          </span>
        );
      }
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

      {roleSuccessMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 p-4 text-xs font-extrabold text-white shadow-lg animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{roleSuccessMessage}</span>
        </div>
      )}

      <DataTable
        data={teachers}
        columns={columns}
        searchPlaceholder="Search staff member, department, qualification..."
        searchFields={['name', 'empId', 'department', 'qualification']}
        exportFileName="staff-directory"
        actions={row => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleOpenAssignRole(row)}
              className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-200 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300 transition-colors cursor-pointer"
              title="Assign Role & Position"
            >
              <Shield className="h-3.5 w-3.5 text-purple-600" />
              <span>Assign Role</span>
            </button>
            <button
              onClick={() => handleOpenEdit(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Staff Member"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id, row.name)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Delete Staff Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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

      {/* Assign Staff Role & Position Modal */}
      {assignTargetTeacher && (
        <Modal
          isOpen={isAssignRoleModalOpen}
          onClose={() => setIsAssignRoleModalOpen(false)}
          title="Assign Staff Role & Position"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveAssignRole} className="space-y-4">
            {/* Staff Info Banner */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 dark:bg-slate-800/60 dark:border-slate-700">
              <img
                src={assignTargetTeacher.avatar}
                alt={assignTargetTeacher.name}
                className="h-12 w-12 rounded-xl object-cover ring-2 ring-purple-600/30"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {assignTargetTeacher.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  ID: {assignTargetTeacher.empId} • {assignTargetTeacher.email}
                </p>
              </div>
            </div>

            {/* System Access Level Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Select System Portal Access Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAssignedRole('teacher');
                    setAssignedDesignation('Class Teacher');
                  }}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    assignedRole === 'teacher'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    {assignedRole === 'teacher' && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                  <span className="font-black text-xs mt-2">Teacher</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Grading, Attendance, Timetable & Homework
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAssignedRole('bursar');
                    setAssignedDesignation('School Bursar / Accountant');
                    setAssignedDepartment('Administration Department');
                  }}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    assignedRole === 'bursar'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-600/30'
                      : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wallet className="h-5 w-5 text-amber-600" />
                    {assignedRole === 'bursar' && <Check className="h-4 w-4 text-amber-600" />}
                  </div>
                  <span className="font-black text-xs mt-2">Bursar / Accountant</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Fee Ledgers, Receipts, Expenses & Budgets
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAssignedRole('admin');
                    setAssignedDesignation('Assistant Administrator');
                    setAssignedDepartment('Administration Department');
                  }}
                  className={`flex flex-col p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    assignedRole === 'admin'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-2 ring-purple-600/30'
                      : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShieldAlert className="h-5 w-5 text-purple-600" />
                    {assignedRole === 'admin' && <Check className="h-4 w-4 text-purple-600" />}
                  </div>
                  <span className="font-black text-xs mt-2">Administrator</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Full system access, passwords & all settings
                  </span>
                </button>
              </div>
            </div>

            {/* School Position / Designation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Institutional Position / Designation Title
              </label>
              <select
                value={assignedDesignation}
                onChange={e => setAssignedDesignation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Class Teacher">Class Teacher</option>
                <option value="Subject Educator">Subject Educator / Specialist</option>
                <option value="Head of Department (HOD)">Head of Department (HOD)</option>
                <option value="School Bursar / Accountant">School Bursar / Accountant</option>
                <option value="Assistant Headmaster">Assistant Headmaster / Headmistress</option>
                <option value="Senior Housemaster / Matron">Senior Housemaster / Matron</option>
                <option value="ICT & Computer Lab Instructor">ICT & Computer Lab Instructor</option>
                <option value="School Librarian">School Librarian</option>
                <option value="Transport & Fleet Officer">Transport & Fleet Officer</option>
              </select>
            </div>

            {/* Conditional Class Teacher & Department Allocation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Class Teacher Allocation
                </label>
                <select
                  value={assignedClass}
                  onChange={e => {
                    const selClass = e.target.value;
                    setAssignedClass(selClass);
                    if (selClass) {
                      setAssignedDepartment(getDepartmentForClass(selClass));
                    }
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="">None (Subject Educator Only)</option>
                  {GHANA_CLASS_HIERARCHY.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Department
                </label>
                <select
                  value={assignedDepartment}
                  onChange={e => setAssignedDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="Preschool Department">Preschool Department (Creche – KG2)</option>
                  <option value="Lower Primary Department">Lower Primary Department (Grade 1 – 3)</option>
                  <option value="Upper Primary Department">Upper Primary Department (Grade 4 – 6)</option>
                  <option value="JHS Department">JHS Department (JHS 1 – 3)</option>
                  <option value="Administration Department">Administration & Accounts</option>
                </select>
              </div>
            </div>

            {/* Information Notice */}
            <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3 text-[11px] font-medium text-purple-900 dark:bg-purple-950/30 dark:border-purple-800 dark:text-purple-300 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                Assigning this role updates the staff member's credentials immediately. When they log in with their credentials, the portal will route them directly into their assigned workspace.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignRoleModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-800 transition-all cursor-pointer"
              >
                Save Role Assignment
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
