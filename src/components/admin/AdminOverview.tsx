import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { MetricCard } from '../common/MetricCard';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../common/Modal';
import { Users, GraduationCap, Wallet, Building2, TrendingUp, AlertCircle, Filter, Award, Calendar, Lock, Unlock, MessageSquare, Send, CheckCircle2, PhoneCall, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export const AdminOverview: React.FC = () => {
  const {
    students,
    teachers,
    classrooms,
    feeRecords,
    incomes,
    attendance,
    currentAcademicYear,
    setCurrentAcademicYear,
    availableAcademicYears,
    addAcademicYear,
    currentTerm,
    setCurrentTerm,
    isTermLocked,
    toggleTermLock,
    termConfig,
    setTermConfig
  } = useSchoolData();

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState('');
  const [isTermConfigModalOpen, setIsTermConfigModalOpen] = useState(false);
  const [tempTermConfig, setTempTermConfig] = useState(termConfig);
  const [smsModalTarget, setSmsModalTarget] = useState<{
    studentName: string;
    guardianName: string;
    guardianPhone: string;
    balance: number;
    gradeLevel: string;
  } | null>(null);
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  const availableClassOptions = [...GHANA_CLASS_HIERARCHY];

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classrooms.length;

  const filteredStudents = selectedClass === 'All'
    ? students
    : students.filter(s => s.gradeLevel === selectedClass);

  const filteredFeeRecords = selectedClass === 'All'
    ? feeRecords
    : feeRecords.filter(f => f.gradeLevel === selectedClass);

  const totalRevenue = filteredFeeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalOutstanding = filteredFeeRecords.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);

  const owingStudents = filteredStudents.filter(s => s.feeBalance > 0);

  // Dynamic Revenue Trends calculated from real financial fee payments & income entries
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const activeMonths = monthLabels.slice(0, Math.max(7, currentMonthIdx + 1));

  const revenueTrendsData = activeMonths.map(m => {
    const feeMonthTotal = feeRecords.reduce((sum, f) => {
      const pTotal = (f.paymentHistory || [])
        .filter(p => new Date(p.date).toLocaleString('default', { month: 'short' }) === m)
        .reduce((pSum, p) => pSum + p.amount, 0);
      return sum + pTotal;
    }, 0);

    const incomeMonthTotal = (incomes || [])
      .filter(inc => new Date(inc.date).toLocaleString('default', { month: 'short' }) === m)
      .reduce((sum, inc) => sum + inc.amount, 0);

    return {
      month: m,
      revenue: feeMonthTotal + incomeMonthTotal
    };
  });

  // Dynamic Student Attendance calculated from real attendance records marked by teachers across all 13 classes
  const attendanceByGradeData = GHANA_CLASS_HIERARCHY.map(clsName => {
    const clsAttendance = (attendance || []).filter(a => a.gradeLevel === clsName || (a as any).className === clsName);
    const present = clsAttendance.filter(a => a.status === 'Present').length;
    const absent = clsAttendance.filter(a => a.status === 'Absent').length;
    const shortGrade = clsName
      .replace('Kindergarten', 'KG')
      .replace('Grade ', 'P')
      .replace('Nursery ', 'Nur ');
    return {
      grade: shortGrade,
      fullName: clsName,
      present,
      absent
    };
  });

  const startDateObj = termConfig?.startDate ? new Date(termConfig.startDate) : new Date();
  const todayObj = new Date();
  const diffDays = Math.max(1, Math.ceil(Math.abs(todayObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsedMonths = Math.round((diffDays / 30) * 10) / 10;
  const isFeeAlertTriggered = elapsedMonths >= (termConfig?.alertThresholdMonths || 2);

  const handleOpenSMSModal = (student: any) => {
    setSmsModalTarget({
      studentName: student.name,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      balance: student.feeBalance,
      gradeLevel: student.gradeLevel
    });
  };

  const handleCreateNewYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    addAcademicYear(newYearInput.trim());
    setCurrentAcademicYear(newYearInput.trim());
    setIsAddYearModalOpen(false);
    setNewYearInput('');
  };

  const handleSaveTermConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setTermConfig(tempTermConfig);
    setIsTermConfigModalOpen(false);
  };

  const handleSendSMS = () => {
    setSmsSentSuccess(true);
    setTimeout(() => {
      setSmsSentSuccess(false);
      setSmsModalTarget(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">Official School Portal</span>
              <span className="text-xs font-bold text-blue-200">{currentAcademicYear} Academic Session</span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl font-heading">Kidshine Montessori School</h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Session: <strong className="underline font-bold text-white">{currentAcademicYear}</strong> • Active Term: <strong className="underline font-bold text-white">{currentTerm}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-blue-400/30 bg-blue-950/60 p-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1"><Calendar className="h-3 w-3" /> Academic Year</label>
                <button
                  onClick={() => setIsAddYearModalOpen(true)}
                  className="text-[10px] font-black text-amber-300 hover:underline cursor-pointer"
                >
                  + Add Year
                </button>
              </div>
              <select value={currentAcademicYear} onChange={e => setCurrentAcademicYear(e.target.value)} className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
                {availableAcademicYears.map(yr => (
                  <option key={yr} value={yr}>{yr} Session</option>
                ))}
              </select>
            </div>

            <div className={`rounded-2xl border p-2.5 backdrop-blur-md transition-all ${isTermLocked ? 'border-amber-400/50 bg-amber-950/60' : 'border-blue-400/30 bg-blue-950/60'}`}>
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1"><Calendar className="h-3 w-3" /> Academic Term</label>
                <button type="button" onClick={toggleTermLock} className={`rounded-lg p-1 text-xs ${isTermLocked ? 'bg-amber-400 text-slate-950 font-bold' : 'text-blue-200'}`}>
                  {isTermLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </button>
              </div>
              <select value={currentTerm} disabled={isTermLocked} onChange={e => setCurrentTerm(e.target.value as any)} className={`mt-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none ${isTermLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}>
                <option value="First Term (Term 1)">First Term (Term 1)</option>
                <option value="Second Term (Term 2)">Second Term (Term 2)</option>
                <option value="Third Term (Term 3)">Third Term (Term 3)</option>
              </select>
            </div>

            <div className="rounded-2xl border border-blue-400/30 bg-blue-950/60 p-2.5 backdrop-blur-md">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1"><Filter className="h-3 w-3" /> Class Filter</label>
              <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
                <option value="All">All Classes ({availableClassOptions.length})</option>
                {availableClassOptions.map((cName, idx) => <option key={`cls-${idx}`} value={cName}>{cName}</option>)}
              </select>
            </div>

            <button
              onClick={() => {
                setTempTermConfig(termConfig);
                setIsTermConfigModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-400 px-3.5 py-3 text-xs font-black text-slate-950 shadow-md hover:bg-amber-300 transition-all cursor-pointer"
              title="Configure Term Months & Fee Alert Threshold"
            >
              <Calendar className="h-4 w-4" /> Term Settings
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isTermConfigModalOpen}
        onClose={() => setIsTermConfigModalOpen(false)}
        title="Configure Academic Term Duration & Fee Alert Threshold"
      >
        <form onSubmit={handleSaveTermConfig} className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-3.5 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-700" />
              <span>Simple Term Schedule Calculation</span>
            </div>
            <p className="text-[11px] text-blue-800">
              Set how many months you spend in a term (e.g. 3 months) and at which month (e.g. Month 2) the system should automatically alert you to collect unpaid tuition fees.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800">Term Start Date *</label>
            <input
              type="date"
              required
              value={tempTermConfig.startDate}
              onChange={e => setTempTermConfig({ ...tempTermConfig, startDate: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800">Total Duration of Term (Months) *</label>
            <input
              type="number"
              min="1"
              max="12"
              required
              value={tempTermConfig.termDurationMonths}
              onChange={e => setTempTermConfig({ ...tempTermConfig, termDurationMonths: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800">Trigger Overdue Fee Collection Alert At (Month #) *</label>
            <input
              type="number"
              min="1"
              max={tempTermConfig.termDurationMonths}
              required
              value={tempTermConfig.alertThresholdMonths}
              onChange={e => setTempTermConfig({ ...tempTermConfig, alertThresholdMonths: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setIsTermConfigModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
            >
              Save Schedule Settings
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddYearModalOpen}
        onClose={() => setIsAddYearModalOpen(false)}
        title="Add New Academic Year / Session"
      >
        <form onSubmit={handleCreateNewYear} className="space-y-4">
          <p className="text-xs text-slate-600">
            Enter a new academic year session format (e.g., <strong>2031/2032</strong> or <strong>2032/2033</strong>) to expand your historical database.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-800">Academic Year Session *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2031/2032"
              value={newYearInput}
              onChange={e => setNewYearInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-mono font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddYearModalOpen(false)}
              className="rounded-xl border px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
            >
              Add & Switch to Session
            </button>
          </div>
        </form>
      </Modal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Students" value={totalStudents} change="+12%" changeType="positive" icon={GraduationCap} color="blue" />
        <MetricCard title="Total Staff" value={totalTeachers} change="Staff Roster" changeType="neutral" icon={Users} color="indigo" subtitle="Teaching & support staff" />
        <MetricCard title="Tuition Collected" value={formatCurrency(totalRevenue)} change="+18.4%" changeType="positive" icon={Wallet} color="emerald" subtitle={`${formatCurrency(totalOutstanding)} outstanding`} />
        <MetricCard title="Active Classrooms" value={totalClasses} change="Creche - JHS 3" changeType="neutral" icon={Building2} color="amber" />
      </div>

      {/* 1.5-Month Cutoff Overdue Tuition & Direct Parent Call List */}
      <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-2">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
                  <AlertCircle className="h-4 w-4 text-rose-600" /> Overdue Tuition Balances (GH₵)
                </h3>
                <p className="text-[11px] font-semibold text-slate-500">
                  Term Started: <strong className="text-slate-800">{termConfig?.startDate}</strong> • Threshold: <strong className="text-rose-700">Month {termConfig?.alertThresholdMonths} of {termConfig?.termDurationMonths}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setTempTermConfig(termConfig);
                  setIsTermConfigModalOpen(true);
                }}
                className="rounded-lg bg-slate-100 border border-slate-200 p-1.5 text-xs text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Configure Term Months & Fee Alert Threshold"
              >
                <Calendar className="h-3.5 w-3.5 text-blue-700" />
              </button>
            </div>

            <div className="mb-3 rounded-xl bg-rose-50 border border-rose-200 p-2 text-[11px] text-rose-800 font-medium flex items-center justify-between">
              <span>⏱️ <strong>1.5 Months Passed:</strong> Contact parents below to collect tuition balance.</span>
              <span className="rounded-full bg-rose-200/60 px-2 py-0.5 text-[10px] font-extrabold text-rose-900">
                {owingStudents.length} Owing Students
              </span>
            </div>

            {/* Scrollable container for all owing students */}
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1.5 scrollbar-thin scrollbar-thumb-rose-300">
              {owingStudents.map(st => (
                <div key={st.id} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 p-3 hover:bg-rose-100/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="h-9 w-9 rounded-full object-cover border border-rose-200" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {st.name} <span className="text-[11px] font-semibold text-slate-500">({st.gradeLevel})</span>
                      </p>
                      <p className="text-xs font-black text-rose-700 font-currency">
                        Owing: {formatCurrency(st.feeBalance)}
                      </p>
                      <p className="text-[11px] font-bold text-slate-700">
                        Parent: {st.guardianName} • <a href={`tel:${st.guardianPhone}`} className="text-blue-700 underline font-extrabold">{st.guardianPhone}</a>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${st.guardianPhone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer text-decoration-none whitespace-nowrap"
                    title={`Call ${st.guardianName} at ${st.guardianPhone}`}
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call Parent</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll down indicator banner */}
          <div className="mt-3 pt-2 border-t border-rose-100 flex items-center justify-between text-[11px] font-bold text-rose-700 bg-rose-50/40 rounded-xl px-3 py-1.5">
            <span className="flex items-center gap-1">
              <ChevronDown className="h-3.5 w-3.5 animate-bounce text-rose-600" />
              Scroll down to view all {owingStudents.length} owing students
            </span>
            <span className="text-slate-500 font-normal">Use mouse scroll / swipe</span>
        </div>
      </div>

      {smsModalTarget && (
        <Modal isOpen={!!smsModalTarget} onClose={() => setSmsModalTarget(null)} title={`Send SMS - ${smsModalTarget.studentName}`}>
          <div className="space-y-4">
            <p className="text-xs">Balance: {formatCurrency(smsModalTarget.balance)} for {smsModalTarget.studentName}.</p>
            <button onClick={handleSendSMS} className="bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold">{smsSentSuccess ? 'Sent!' : 'Send Reminder'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
