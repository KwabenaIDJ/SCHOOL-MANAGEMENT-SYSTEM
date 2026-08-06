import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { UserCredentialItem, UserRole } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { exportToCSV } from '../../utils/export';
import { ShieldAlert, Eye, EyeOff, KeyRound, CheckCircle2, FileSpreadsheet, Lock, Search, UserPlus, ShieldCheck, Mail, User, Shield } from 'lucide-react';

export const UserCredentialsManager: React.FC = () => {
  const { userCredentials, updateUserPassword, addAdministrator } = useSchoolData();

  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [selectedCred, setSelectedCred] = useState<UserCredentialItem | null>(null);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add Administrator Modal State
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminTitle, setAdminTitle] = useState('Assistant Administrator');
  const [adminPassword, setAdminPassword] = useState('');

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpenEditPassword = (cred: UserCredentialItem) => {
    setSelectedCred(cred);
    setNewPasswordInput(cred.password);
    setIsEditPasswordModalOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCred || !newPasswordInput.trim()) return;

    updateUserPassword(selectedCred.id, newPasswordInput.trim());
    setIsEditPasswordModalOpen(false);

    setSuccessMessage(`Successfully updated password for ${selectedCred.name} (${selectedCred.role})!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleOpenAddAdminModal = () => {
    setAdminName('');
    setAdminEmail('');
    setAdminTitle('Assistant Administrator');
    setAdminPassword(`ADM-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAddAdminModalOpen(true);
  };

  const handleCreateAdministrator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) return;

    addAdministrator(adminName.trim(), adminEmail.trim(), adminTitle.trim(), adminPassword.trim());
    setIsAddAdminModalOpen(false);

    setSuccessMessage(`Granted full Administrator access to ${adminName.trim()} (${adminTitle.trim()})! Password: ${adminPassword.trim()}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const filteredCredentials = userCredentials.filter(c => {
    return roleFilter === 'All' || c.role === roleFilter;
  });

  const totalUsers = userCredentials.length;
  const adminCount = userCredentials.filter(c => c.role === 'admin').length;
  const teacherCount = userCredentials.filter(c => c.role === 'teacher').length;
  const parentCount = userCredentials.filter(c => c.role === 'parent').length;
  const studentCount = userCredentials.filter(c => c.role === 'student').length;

  const columns: Column<UserCredentialItem>[] = [
    {
      header: 'Account Holder',
      accessorKey: 'name',
      sortable: true,
      cell: row => (
        <div>
          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            {row.role === 'admin' && <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0" />}
            <span>{row.name}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono">{row.email}</div>
        </div>
      )
    },
    {
      header: 'System Role',
      accessorKey: 'role',
      sortable: true,
      cell: row => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
            row.role === 'admin'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
              : row.role === 'teacher'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              : row.role === 'parent'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {row.role}
        </span>
      )
    },
    {
      header: 'Assigned Scope / Profile',
      accessorKey: 'associatedInfo',
      cell: row => (
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {row.associatedInfo}
        </span>
      )
    },
    {
      header: 'Account Password',
      accessorKey: 'password',
      cell: row => {
        const isVisible = showPasswordMap[row.id];
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {isVisible ? row.password : '••••••••••••'}
            </span>
            <button
              onClick={() => togglePasswordVisibility(row.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isVisible ? 'Hide Password' : 'Show Password'}
            >
              {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          </div>
        );
      }
    },
    {
      header: 'Last Modified',
      accessorKey: 'lastChanged',
      cell: row => (
        <span className="text-[11px] font-mono text-gray-500">
          {row.lastChanged}
        </span>
      )
    }
  ];

  const handleExportCredentials = () => {
    const exportData = filteredCredentials.map((c, idx) => ({
      'S/N': idx + 1,
      'Name': c.name,
      'Email / Username': c.email,
      'Role': c.role.toUpperCase(),
      'Assigned Info': c.associatedInfo,
      'Password': c.password,
      'Last Modified': c.lastChanged
    }));
    exportToCSV(exportData, `Kidshine_System_Passwords_${roleFilter}`);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 p-4 text-xs font-extrabold text-white shadow-lg animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white font-heading">
            User Accounts & Password Credentials Manager
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            View, manage, grant admin access, and reset secret account passwords for administrators, teachers, parents, and students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddAdminModal}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-800 transition-colors cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Grant Access to New Administrator
          </button>
          
          <button
            onClick={handleExportCredentials}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Password Directory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total System Users</p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{totalUsers}</h3>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Admin Accounts</p>
          <h3 className="mt-1 text-2xl font-black text-purple-700 dark:text-purple-300">{adminCount}</h3>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Teacher Accounts</p>
          <h3 className="mt-1 text-2xl font-black text-blue-700 dark:text-blue-300">{teacherCount}</h3>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Parent Accounts</p>
          <h3 className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">{parentCount}</h3>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Student Accounts</p>
          <h3 className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">{studentCount}</h3>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800 overflow-x-auto">
        {(['All', 'admin', 'teacher', 'parent', 'student'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setRoleFilter(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              roleFilter === tab
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {tab === 'All' ? 'All User Credentials' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Accounts`}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredCredentials}
        columns={columns}
        searchPlaceholder="Search account holder name, email, role..."
        searchFields={['name', 'email', 'role', 'associatedInfo']}
        exportFileName="user-passwords-credentials"
        actions={row => (
          <button
            onClick={() => handleOpenEditPassword(row)}
            className="inline-flex items-center gap-1 rounded-xl bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            <KeyRound className="h-3.5 w-3.5" /> Reset Password
          </button>
        )}
      />

      {/* Grant Access / Add Administrator Modal */}
      <Modal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        title="Grant System Access to New Administrator"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAdministrator} className="space-y-4">
          <div className="rounded-xl bg-purple-50 p-3.5 border border-purple-200 dark:bg-purple-950/40 text-xs text-purple-950 dark:text-purple-200 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-purple-700" />
              <span>Full Administrative Access Privileges</span>
            </div>
            <p className="text-[11px] text-purple-800 dark:text-purple-300">
              The new administrator will be able to log in, view student rosters, manage fee ledgers, prepare next term bills, and manage user passwords.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Administrator Full Name *
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                placeholder="e.g. Mr. Daniel Appiah"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 text-xs font-bold text-slate-900 focus:border-purple-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Email Address / System Login Username *
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                placeholder="e.g. daniel.appiah@kidshinemontessori.edu.gh"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 text-xs font-mono font-bold text-slate-900 focus:border-purple-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Administrative Title / Role *
            </label>
            <div className="relative mt-1">
              <select
                value={adminTitle}
                onChange={e => setAdminTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 text-xs font-bold text-slate-900 focus:border-purple-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Assistant Administrator">Assistant Administrator</option>
                <option value="Vice Principal / Headmaster">Vice Principal / Headmaster</option>
                <option value="Bursar Administrator">Bursar Administrator</option>
                <option value="IT Director & Administrator">IT Director & Administrator</option>
                <option value="Co-Proprietor">Co-Proprietor</option>
              </select>
              <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Generated System Access Password *
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 text-xs font-mono font-bold text-slate-900 focus:border-purple-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Auto-generated secret password. You can change this or provide it directly to the new administrator.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddAdminModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-extrabold text-white shadow-md hover:bg-purple-800 transition-colors"
            >
              Grant Admin Access
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Password Modal */}
      {selectedCred && (
        <Modal
          isOpen={isEditPasswordModalOpen}
          onClose={() => setIsEditPasswordModalOpen(false)}
          title={`Reset Password for ${selectedCred.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Account Holder:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{selectedCred.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Email / Username:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{selectedCred.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">System Role:</span>
                <span className="font-extrabold text-blue-700 uppercase">{selectedCred.role}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                New Account Password *
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={e => setNewPasswordInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 pl-9 text-xs font-mono font-bold text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Set a secret password for this user to sign into their portal.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsEditPasswordModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
              >
                Save New Password
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
