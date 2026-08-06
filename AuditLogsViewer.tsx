import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { DataTable, Column } from '../common/DataTable';
import { AuditLogEntry } from '../../types';
import {
  ShieldCheck,
  Activity,
  Search,
  Filter,
  Download,
  Trash2,
  Clock,
  User,
  AlertTriangle,
  Info,
  XCircle,
  FileSpreadsheet,
  RefreshCw,
  Lock
} from 'lucide-react';

export const AuditLogsViewer: React.FC = () => {
  const { auditLogs, clearAuditLogs } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'info' | 'warning' | 'danger'>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'admin' | 'teacher' | 'parent'>('All');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
    const matchesRole = roleFilter === 'All' || log.userRole === roleFilter;

    return matchesSearch && matchesSeverity && matchesRole;
  });

  const infoCount = auditLogs.filter(l => l.severity === 'info').length;
  const warningCount = auditLogs.filter(l => l.severity === 'warning').length;
  const dangerCount = auditLogs.filter(l => l.severity === 'danger').length;

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Details', 'Severity', 'IP Address'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      l.userRole,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.severity,
      l.ipAddress || '127.0.0.1'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `System_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmClear = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      clearAuditLogs();
      setIsConfirmClearOpen(false);
      setAdminPassword('');
      alert('Audit log activity history cleared successfully.');
    } else {
      alert('Incorrect administrator password!');
    }
  };

  const columns: Column<AuditLogEntry>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      sortable: true,
      cell: row => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
          <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>{row.timestamp}</span>
        </div>
      )
    },
    {
      header: 'User / Actor',
      accessorKey: 'userName',
      sortable: true,
      cell: row => (
        <div>
          <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>{row.userName}</span>
          </div>
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {row.userRole}
          </span>
        </div>
      )
    },
    {
      header: 'Action Performed',
      accessorKey: 'action',
      sortable: true,
      cell: row => (
        <span className="text-xs font-black text-blue-950 dark:text-blue-200">
          {row.action}
        </span>
      )
    },
    {
      header: 'Activity Details',
      accessorKey: 'details',
      cell: row => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs sm:max-w-md font-medium leading-relaxed">
          {row.details}
        </p>
      )
    },
    {
      header: 'Security Level',
      accessorKey: 'severity',
      sortable: true,
      cell: row => {
        let badgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
        let IconComponent = Info;
        if (row.severity === 'warning') {
          badgeStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
          IconComponent = AlertTriangle;
        } else if (row.severity === 'danger') {
          badgeStyle = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
          IconComponent = XCircle;
        }
        return (
          <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-black uppercase ${badgeStyle}`}>
            <IconComponent className="h-3 w-3" />
            <span>{row.severity}</span>
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold backdrop-blur-md text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
              Enterprise Security & Audit Engine
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">
              System Audit Logs & Activity Register
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Real-time audit trail monitoring user actions, grade edits, fee transactions, term locking, and administrative system updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
              title="Export Audit Log History to CSV"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export CSV Log
            </button>

            <button
              onClick={() => setIsConfirmClearOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-600/80 border border-rose-500/50 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer"
              title="Clear Audit History"
            >
              <Trash2 className="h-4 w-4" /> Clear Trail
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Audit Entries</span>
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-heading">{auditLogs.length}</p>
          <p className="text-[11px] text-slate-500">Recorded System Events</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Info Events</span>
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-950 dark:text-white font-heading">{infoCount}</p>
          <p className="text-[11px] text-blue-700 dark:text-blue-300">Normal Operations</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">Warning Events</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-900 dark:text-amber-300 font-heading">{warningCount}</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400">Term Locks & Changes</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Critical / Deletions</span>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-900 dark:text-rose-300 font-heading">{dangerCount}</p>
          <p className="text-[11px] text-rose-700 dark:text-rose-400">Deletions & Overrides</p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, details, or user name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Severity:</label>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="danger">Critical / Danger</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-slate-500">Role:</label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Data Table */}
      <DataTable
        data={filteredLogs}
        columns={columns}
      />

      {/* Confirmation Modal to Clear Logs */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-900 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-black font-heading text-slate-900 dark:text-white">Clear Audit Trail History?</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will permanently wipe all audit log history from the system database. Please enter the Administrator password to authorize.
            </p>

            <form onSubmit={handleConfirmClear} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Admin Password *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password (admin123)"
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-4 text-xs font-bold text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmClearOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                >
                  Confirm & Clear Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
