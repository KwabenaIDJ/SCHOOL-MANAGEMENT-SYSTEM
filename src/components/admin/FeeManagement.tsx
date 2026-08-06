import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { FeeRecord, PaymentItem } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { FeeReceiptPrint } from '../printable/FeeReceiptPrint';
import { formatCurrency } from '../../utils/format';
import { exportToCSV } from '../../utils/export';
import { GHANA_CLASS_HIERARCHY } from '../../constants/ghanaEducation';
import { Receipt, PlusCircle, Filter, Trash2, FileSpreadsheet, Calculator, CheckCircle2 } from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const { feeRecords, recordPayment, deleteFeeRecord, classrooms, prepareNextTermFeeBill, currentTerm } = useSchoolData();

  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPrepareBillModalOpen, setIsPrepareBillModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Partial' | 'Overdue'>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Payment Form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'Bank Transfer' as PaymentItem['paymentMethod'],
    referenceNo: '',
    receivedBy: 'Bursar (Admin)',
    remarks: ''
  });

  // Next Term Bill Preparation Form
  const [billForm, setBillForm] = useState({
    targetClass: 'All',
    tuition: 1800,
    learningMaterials: 350,
    ictLab: 150,
    ptaLevy: 100,
    canteen: 0,
    transportation: 0
  });

  const totalCalculatedBill = Number(billForm.tuition) + Number(billForm.learningMaterials) + Number(billForm.ictLab) + Number(billForm.ptaLevy) + Number(billForm.canteen) + Number(billForm.transportation);

  const filteredRecords = feeRecords.filter(f => {
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    const matchesClass = classFilter === 'All' || f.gradeLevel === classFilter;
    return matchesStatus && matchesClass;
  });

  const totalBilled = filteredRecords.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalPaid = filteredRecords.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalOutstanding = totalBilled - totalPaid;

  const handleOpenPayment = (record: FeeRecord) => {
    setSelectedRecord(record);
    const remaining = record.totalAmount - record.paidAmount;
    setPaymentForm({
      amount: remaining,
      paymentMethod: 'Bank Transfer',
      referenceNo: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receivedBy: 'Finance Dept',
      remarks: 'Tuition installment payment in GH₵'
    });
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || paymentForm.amount <= 0) return;

    recordPayment(selectedRecord.id, {
      date: new Date().toISOString().split('T')[0],
      amount: Number(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod,
      referenceNo: paymentForm.referenceNo,
      receivedBy: paymentForm.receivedBy,
      remarks: paymentForm.remarks
    });

    setIsPaymentModalOpen(false);
  };

  const handleSaveNextTermBill = (e: React.FormEvent) => {
    e.preventDefault();
    prepareNextTermFeeBill(billForm.targetClass, {
      tuition: Number(billForm.tuition),
      learningMaterials: Number(billForm.learningMaterials),
      ictLab: Number(billForm.ictLab),
      ptaLevy: Number(billForm.ptaLevy),
      canteen: Number(billForm.canteen),
      transportation: Number(billForm.transportation)
    });
    setIsPrepareBillModalOpen(false);
  };

  const handleOpenReceipt = (record: FeeRecord) => {
    setSelectedRecord(record);
    setIsReceiptModalOpen(true);
  };

  const handleDeleteFeeRecord = (id: string, studentName: string) => {
    setDeleteTarget({ id, name: `Fee Record for ${studentName}` });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteFeeRecord(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: Column<FeeRecord>[] = [
    {
      header: 'Receipt No / Student',
      accessorKey: 'studentName',
      sortable: true,
      cell: row => (
        <div>
          <div className="font-bold text-gray-900 dark:text-white">{row.studentName}</div>
          <div className="text-[11px] font-mono text-gray-500">{row.receiptNumber} • {row.gradeLevel}</div>
        </div>
      )
    },
    {
      header: 'Academic Term',
      accessorKey: 'academicTerm',
      cell: row => (
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {row.academicTerm}
        </span>
      )
    },
    {
      header: 'Term Tuition Fee (GH₵)',
      accessorKey: 'totalAmount',
      sortable: true,
      cell: row => (
        <span className="font-mono font-bold text-gray-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      )
    },
    {
      header: 'Paid Amount (GH₵)',
      accessorKey: 'paidAmount',
      sortable: true,
      cell: row => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.paidAmount)}
        </span>
      )
    },
    {
      header: 'Outstanding (GH₵)',
      accessorKey: 'totalAmount',
      cell: row => {
        const balance = row.totalAmount - row.paidAmount;
        return (
          <span className={`font-mono font-bold ${balance === 0 ? 'text-gray-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(balance)}
          </span>
        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: row => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            row.status === 'Paid'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : row.status === 'Partial'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}
        >
          {row.status}
        </span>
      )
    }
  ];

  const handleExportFees = () => {
    const exportData = filteredRecords.map((f, index) => ({
      'S/N': index + 1,
      'Receipt No': f.receiptNumber,
      'Student Name': f.studentName,
      'Class': f.gradeLevel,
      'Tuition Fee (GH₵)': f.totalAmount,
      'Paid (GH₵)': f.paidAmount,
      'Balance (GH₵)': f.totalAmount - f.paidAmount,
      'Status': f.status,
      'Due Date': f.dueDate
    }));
    exportToCSV(exportData, `Kidshine_Fee_Ledger_${statusFilter}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white font-heading">
            Tuition & Fee Billing Management (GH₵)
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Prepare next term's student fee bills, record payments, and manage tuition ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Prepare Next Term Fee Bill Button */}
          <button
            onClick={() => setIsPrepareBillModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-700 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-700/30 hover:bg-blue-800 transition-colors"
          >
            <Calculator className="h-4 w-4" />
            Prepare Next Term Fee Bill
          </button>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
            <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Filter Class:</span>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none dark:text-white cursor-pointer"
            >
              <option value="All">All Classes</option>
              {Array.from(new Set([...GHANA_CLASS_HIERARCHY, ...classrooms.map(c => c.name)])).map(cName => (
                <option key={cName} value={cName}>{cName}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportFees}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Fee Ledger
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Billed Tuition</p>
          <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(totalBilled)}</h3>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Revenue Collected</p>
          <h3 className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">{formatCurrency(totalPaid)}</h3>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Total Outstanding Balance</p>
          <h3 className="mt-1 text-2xl font-black text-rose-700 dark:text-rose-300">{formatCurrency(totalOutstanding)}</h3>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
        {(['All', 'Paid', 'Partial', 'Overdue'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === tab
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {tab} Records
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredRecords}
        columns={columns}
        searchPlaceholder="Search student name, receipt number..."
        searchFields={['studentName', 'receiptNumber', 'gradeLevel']}
        exportFileName="tuition-fees-report"
        actions={row => (
          <>
            {row.status !== 'Paid' && (
              <button
                onClick={() => handleOpenPayment(row)}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Record Payment
              </button>
            )}
            <button
              onClick={() => handleOpenReceipt(row)}
              className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              <Receipt className="h-3.5 w-3.5 text-blue-600" /> Digital Receipt
            </button>
            <button
              onClick={() => handleDeleteFeeRecord(row.id, row.studentName)}
              className="rounded-xl p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Record"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      />

      {/* Prepare Next Academic Term Fee Bill Modal */}
      <Modal
        isOpen={isPrepareBillModalOpen}
        onClose={() => setIsPrepareBillModalOpen(false)}
        title="Prepare Next Academic Term Student Fee Bill (GH₵)"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveNextTermBill} className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40 text-xs text-blue-950 dark:text-blue-200">
            Configure itemized tuition & school fee billing breakdown for the upcoming academic term.
            This bill will apply to student records and show on Terminal Report Cards.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Select Target Class / Grade Level *
            </label>
            <select
              value={billForm.targetClass}
              onChange={e => setBillForm({ ...billForm, targetClass: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="All" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                All Enrolled Students (All Classes)
              </option>
              {Array.from(new Set([...GHANA_CLASS_HIERARCHY, ...classrooms.map(c => c.name)])).map(cName => (
                <option key={cName} value={cName} className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">
                  {cName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                1. Core Tuition Fee (GH₵) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={billForm.tuition}
                onChange={e => setBillForm({ ...billForm, tuition: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                2. Workbooks & Learning Materials (GH₵)
              </label>
              <input
                type="number"
                min={0}
                value={billForm.learningMaterials}
                onChange={e => setBillForm({ ...billForm, learningMaterials: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                3. ICT & Computer Lab Maintenance (GH₵)
              </label>
              <input
                type="number"
                min={0}
                value={billForm.ictLab}
                onChange={e => setBillForm({ ...billForm, ictLab: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                4. PTA Annual Levy (GH₵)
              </label>
              <input
                type="number"
                min={0}
                value={billForm.ptaLevy}
                onChange={e => setBillForm({ ...billForm, ptaLevy: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                5. Canteen & Lunch Subscription (GH₵, optional)
              </label>
              <input
                type="number"
                min={0}
                value={billForm.canteen}
                onChange={e => setBillForm({ ...billForm, canteen: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                6. School Bus Transit Fee (GH₵, optional)
              </label>
              <input
                type="number"
                min={0}
                value={billForm.transportation}
                onChange={e => setBillForm({ ...billForm, transportation: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Total Calculated Next Term Bill</span>
              <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                {formatCurrency(totalCalculatedBill)}
              </h3>
            </div>
            <span className="rounded-lg bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
              Per Student / Term
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsPrepareBillModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
            >
              Save & Apply Next Term Bill
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal */}
      {selectedRecord && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Payment for ${selectedRecord.studentName}`}
          maxWidth="md"
        >
          <form onSubmit={handleSavePayment} className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Student:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedRecord.studentName} ({selectedRecord.gradeLevel})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Bill:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{formatCurrency(selectedRecord.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Paid So Far:</span>
                <span className="font-mono font-bold text-emerald-600">{formatCurrency(selectedRecord.paidAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 border-gray-200 dark:border-gray-700">
                <span className="text-gray-500 font-bold">Remaining Balance:</span>
                <span className="font-mono font-black text-rose-600">{formatCurrency(selectedRecord.totalAmount - selectedRecord.paidAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Payment Amount (GH₵) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={selectedRecord.totalAmount - selectedRecord.paidAmount}
                value={paymentForm.amount}
                onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white font-mono font-bold"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Payment Method *
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as PaymentItem['paymentMethod'] })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money (MTN/Vodafone)</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Transaction / Ref No.
                </label>
                <input
                  type="text"
                  required
                  value={paymentForm.referenceNo}
                  onChange={e => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
              >
                Confirm & Generate Receipt
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Digital Receipt Modal */}
      {selectedRecord && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title="Digital Tuition Receipt (GH₵)"
          maxWidth="2xl"
        >
          <FeeReceiptPrint feeRecord={selectedRecord} onClose={() => setIsReceiptModalOpen(false)} />
        </Modal>
      )}

      {/* Custom Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType="fee record"
        />
      )}
    </div>
  );
};
