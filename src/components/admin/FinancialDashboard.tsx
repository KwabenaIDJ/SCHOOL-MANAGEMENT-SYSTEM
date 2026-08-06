import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { ExpenseRecord, IncomeRecord } from '../../types';
import { formatCurrency } from '../../utils/format';
import { exportToCSV, triggerPDFPrint } from '../../utils/export';
import { MetricCard } from '../common/MetricCard';
import { DataTable, Column } from '../common/DataTable';
import { Modal } from '../common/Modal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  PlusCircle,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  Receipt,
  Trash2,
  Pencil,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const FinancialDashboard: React.FC = () => {
  const { feeRecords, expenses, incomes, departmentBudgets, addExpense, deleteExpense, addIncome, deleteIncome, addOrUpdateDepartmentBudget, deleteDepartmentBudget, currentTerm } = useSchoolData();

  const [activeTab, setActiveTab] = useState<'expenses' | 'revenue' | 'other_income' | 'budgets'>('expenses');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: 'expense' | 'income' | 'budget' } | null>(null);

  // Budget Form State
  const [budgetForm, setBudgetForm] = useState({
    department: 'Preschool Department',
    customDepartment: '',
    allocatedBudget: 15000
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    category: 'Educational Materials',
    customCategory: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as ExpenseRecord['paymentMethod'],
    referenceNo: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    approvedBy: 'School Administrator'
  });

  // Non-Tuition Income Form State
  const [incomeForm, setIncomeForm] = useState({
    category: 'Canteen & Lunch Revenue',
    customCategory: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash' as IncomeRecord['paymentMethod'],
    referenceNo: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
    receivedBy: 'Bursar (Admin)'
  });

  // Calculate High Level Metrics
  const totalTuitionCollected = feeRecords.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalTuitionBilled = feeRecords.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalTuitionOutstanding = totalTuitionBilled - totalTuitionCollected;

  const totalNonTuitionIncome = (incomes || []).reduce((acc, i) => acc + i.amount, 0);
  const totalGrossIncome = totalTuitionCollected + totalNonTuitionIncome;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netSurplus = totalGrossIncome - totalExpenses;

  const totalAllocatedBudget = departmentBudgets.reduce((acc, b) => acc + b.allocatedBudget, 0);
  const totalSpentBudget = departmentBudgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const budgetUtilizationPercent = Math.round((totalSpentBudget / (totalAllocatedBudget || 1)) * 100);

  // Monthly Financial Trend Data for Charts
  const monthlyTrendData = [
    { month: 'Jan', revenue: 12500, expenses: 8400 },
    { month: 'Feb', revenue: 18200, expenses: 9100 },
    { month: 'Mar', revenue: 24500, expenses: 11200 },
    { month: 'Apr', revenue: 21000, expenses: 10500 },
    { month: 'May', revenue: 29800, expenses: 13400 },
    { month: 'Jun', revenue: 34200, expenses: 14800 },
    { month: 'Jul', revenue: totalGrossIncome, expenses: totalExpenses }
  ];

  // Expense Category Breakdown for Charts
  const expenseCategoryBreakdown = [
    { category: 'Staff Salaries', amount: expenses.filter(e => e.category === 'Staff Salaries').reduce((acc, e) => acc + e.amount, 0) || 18500 },
    { category: 'Facilities & Utilities', amount: expenses.filter(e => e.category === 'Facilities & Utilities').reduce((acc, e) => acc + e.amount, 0) || 2400 },
    { category: 'Educational Materials', amount: expenses.filter(e => e.category === 'Educational Materials').reduce((acc, e) => acc + e.amount, 0) || 3200 },
    { category: 'Canteen & Food Supplies', amount: expenses.filter(e => e.category === 'Canteen & Food Supplies').reduce((acc, e) => acc + e.amount, 0) || 1900 },
    { category: 'ICT & Technology', amount: expenses.filter(e => e.category === 'ICT & Technology').reduce((acc, e) => acc + e.amount, 0) || 1800 },
    { category: 'Maintenance & Repairs', amount: expenses.filter(e => e.category === 'Maintenance & Repairs').reduce((acc, e) => acc + e.amount, 0) || 2100 }
  ];

  const handleOpenAddExpense = () => {
    setExpenseForm({
      category: 'Educational Materials',
      customCategory: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      referenceNo: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      approvedBy: 'School Administrator'
    });
    setIsAddExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || expenseForm.amount <= 0) return;
    const categoryName = expenseForm.category === 'Other'
      ? (expenseForm.customCategory.trim() || 'General Operational Expense')
      : expenseForm.category;

    addExpense({
      category: categoryName,
      description: expenseForm.description,
      amount: expenseForm.amount,
      date: expenseForm.date,
      paymentMethod: expenseForm.paymentMethod,
      referenceNo: expenseForm.referenceNo,
      approvedBy: expenseForm.approvedBy
    });
    setIsAddExpenseModalOpen(false);
  };

  const handleOpenAddIncome = () => {
    setIncomeForm({
      category: 'Canteen & Lunch Revenue',
      customCategory: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      referenceNo: `INC-${Math.floor(100000 + Math.random() * 900000)}`,
      receivedBy: 'Bursar (Admin)'
    });
    setIsAddIncomeModalOpen(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.description || incomeForm.amount <= 0) return;
    const categoryName = incomeForm.category === 'Other'
      ? (incomeForm.customCategory.trim() || 'General Non-Tuition Income')
      : incomeForm.category;

    addIncome({
      category: categoryName,
      description: incomeForm.description,
      amount: incomeForm.amount,
      date: incomeForm.date,
      paymentMethod: incomeForm.paymentMethod,
      referenceNo: incomeForm.referenceNo,
      receivedBy: incomeForm.receivedBy
    });
    setIsAddIncomeModalOpen(false);
  };

  const handleOpenAddBudget = (dept?: string, amount?: number) => {
    setBudgetForm({
      department: dept || 'Preschool Department',
      customDepartment: '',
      allocatedBudget: amount || 15000
    });
    setIsAddBudgetModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDept = budgetForm.department === 'Other'
      ? (budgetForm.customDepartment.trim() || 'New Department')
      : budgetForm.department;
    if (!targetDept || budgetForm.allocatedBudget <= 0) return;

    addOrUpdateDepartmentBudget(targetDept, budgetForm.allocatedBudget);
    setIsAddBudgetModalOpen(false);
  };

  const handleDeleteExpense = (id: string, description: string) => {
    setDeleteTarget({ id, name: description, type: 'expense' });
  };

  const handleDeleteIncome = (id: string, description: string) => {
    setDeleteTarget({ id, name: description, type: 'income' });
  };

  const handleDeleteBudget = (dept: string) => {
    setDeleteTarget({ id: dept, name: dept, type: 'budget' });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (deleteTarget.type === 'expense') {
        deleteExpense(deleteTarget.id);
      } else if (deleteTarget.type === 'income') {
        deleteIncome(deleteTarget.id);
      } else if (deleteTarget.type === 'budget') {
        deleteDepartmentBudget(deleteTarget.id);
      }
      setDeleteTarget(null);
    }
  };

  const expenseColumns: Column<ExpenseRecord>[] = [
    {
      header: 'Expense Description / Ref',
      accessorKey: 'description',
      sortable: true,
      cell: row => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{row.description}</div>
          <div className="text-[11px] font-mono text-slate-500">{row.referenceNo} • {row.date}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: row => (
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          {row.category}
        </span>
      )
    },
    {
      header: 'Payment Method',
      accessorKey: 'paymentMethod',
      cell: row => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.paymentMethod}
        </span>
      )
    },
    {
      header: 'Amount (GH₵)',
      accessorKey: 'amount',
      sortable: true,
      cell: row => (
        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      header: 'Approved By',
      accessorKey: 'approvedBy',
      cell: row => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.approvedBy}
        </span>
      )
    }
  ];

  const incomeColumns: Column<IncomeRecord>[] = [
    {
      header: 'Income Description / Ref',
      accessorKey: 'description',
      sortable: true,
      cell: row => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{row.description}</div>
          <div className="text-[11px] font-mono text-slate-500">{row.referenceNo} • {row.date}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: row => (
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {row.category}
        </span>
      )
    },
    {
      header: 'Payment Method',
      accessorKey: 'paymentMethod',
      cell: row => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {row.paymentMethod}
        </span>
      )
    },
    {
      header: 'Amount (GH₵)',
      accessorKey: 'amount',
      sortable: true,
      cell: row => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    {
      header: 'Received By',
      accessorKey: 'receivedBy',
      cell: row => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.receivedBy}
        </span>
      )
    }
  ];

  const handleExportExpenses = () => {
    const exportData = expenses.map((e, index) => ({
      'S/N': index + 1,
      'Ref No': e.referenceNo,
      'Expense Category': e.category,
      'Description': e.description,
      'Amount (GH₵)': e.amount,
      'Payment Method': e.paymentMethod,
      'Date': e.date
    }));
    exportToCSV(exportData, 'Kidshine_School_Expenses');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading">
            Financial Management & Budgeting Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor school income, tuition collections, non-tuition revenue, operational expenses, and departmental budget allocations for <strong className="font-bold text-blue-700 dark:text-blue-400">{currentTerm}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportExpenses}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
          </button>

          <button
            onClick={() => triggerPDFPrint('Kidshine_Financial_Statement')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 shadow-xs hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-600" /> Download PDF Statement
          </button>

          <button
            onClick={handleOpenAddIncome}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Record Other Income
          </button>

          <button
            onClick={handleOpenAddExpense}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Record New Expense
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total School Income (GH₵)"
          value={formatCurrency(totalGrossIncome)}
          change={`Tuition: ${formatCurrency(totalTuitionCollected)} | Other: ${formatCurrency(totalNonTuitionIncome)}`}
          changeType="positive"
          icon={TrendingUp}
          color="emerald"
          subtitle="Tuition fees & non-tuition income"
        />
        <MetricCard
          title="Total School Expenses (GH₵)"
          value={formatCurrency(totalExpenses)}
          change={`${expenses.length} Logged Entries`}
          changeType="negative"
          icon={TrendingDown}
          color="rose"
          subtitle="Operational & salary expenses"
        />
        <MetricCard
          title="Net Financial Surplus (GH₵)"
          value={formatCurrency(netSurplus)}
          change={netSurplus >= 0 ? '+Surplus Cash Flow' : '-Deficit Warning'}
          changeType={netSurplus >= 0 ? 'positive' : 'negative'}
          icon={Wallet}
          color={netSurplus >= 0 ? 'blue' : 'rose'}
          subtitle="Total Income minus Expenses"
        />
        <MetricCard
          title="Budget Utilization"
          value={`${budgetUtilizationPercent}%`}
          change={`${formatCurrency(totalSpentBudget)} / ${formatCurrency(totalAllocatedBudget)}`}
          changeType={budgetUtilizationPercent <= 85 ? 'positive' : 'negative'}
          icon={PieChart}
          color="purple"
          subtitle="Departmental budget execution rate"
        />
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'expenses'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingDown className="h-4 w-4" /> School Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'revenue'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> Tuition Revenue Ledger
        </button>
        <button
          onClick={() => setActiveTab('other_income')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'other_income'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="h-4 w-4 text-emerald-400" /> Non-Tuition Other Income ({(incomes || []).length})
        </button>
        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'budgets'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" /> Department Budgets
        </button>
      </div>

      {/* Tab: School Expenses Table */}

      {/* Tab 2: School Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <DataTable
            data={expenses}
            columns={expenseColumns}
            searchPlaceholder="Search expense category, description, or ref number..."
            searchFields={['description', 'category', 'referenceNo', 'paymentMethod']}
            exportFileName="school-expenses"
            actions={row => (
              <button
                onClick={() => handleDeleteExpense(row.id, row.description)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Expense Record"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          />
        </div>
      )}

      {/* Tab 3: Non-Tuition Other Income Table */}
      {activeTab === 'other_income' && (
        <div className="space-y-4">
          <DataTable
            data={incomes || []}
            columns={incomeColumns}
            searchPlaceholder="Search non-tuition income description, category, or ref number..."
            searchFields={['description', 'category', 'referenceNo', 'paymentMethod']}
            exportFileName="school-non-tuition-income"
            actions={row => (
              <button
                onClick={() => handleDeleteIncome(row.id, row.description)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete Income Record"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          />
        </div>
      )}

      {/* Tab 4: Tuition Revenue Ledger */}
      {activeTab === 'revenue' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 font-heading">
              Tuition Payment Records ({feeRecords.length})
            </h3>
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">Receipt No / Student</th>
                  <th className="px-4 py-3">Class Level</th>
                  <th className="px-4 py-3">Term Tuition</th>
                  <th className="px-4 py-3">Paid Deposit</th>
                  <th className="px-4 py-3">Balance Due</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {feeRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{rec.studentName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{rec.receiptNumber}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{rec.gradeLevel}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(rec.totalAmount)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(rec.paidAmount)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-rose-600 dark:text-rose-400">{formatCurrency(rec.totalAmount - rec.paidAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        rec.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Department Budgets */}
      {activeTab === 'budgets' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Departmental Budget Allocations ({departmentBudgets.length})
              </h3>
              <p className="text-xs text-slate-500">
                Set, update, or remove budget limits for academic & operational departments.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddBudget()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-800 transition-colors self-start sm:self-auto"
            >
              <PlusCircle className="h-4 w-4" /> Allocate New Department Budget
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departmentBudgets.map(b => {
              const percent = Math.min(100, Math.round((b.spentAmount / (b.allocatedBudget || 1)) * 100));
              return (
                <div key={b.department} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Department
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{percent}% Spent</span>
                      <button
                        onClick={() => handleOpenAddBudget(b.department, b.allocatedBudget)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 transition-colors"
                        title="Edit Budget Allocation"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(b.department)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Department Budget"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                    {b.department}
                  </h4>

                  <div className="space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Spent:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(b.spentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Allocated Budget:</span>
                      <span className="font-mono font-bold text-purple-700 dark:text-purple-400">{formatCurrency(b.allocatedBudget)}</span>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 75 ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        title="Record New School Expense"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Expense Description *
            </label>
            <input
              type="text"
              required
              value={expenseForm.description}
              onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
              placeholder="e.g. Canteen Cooking Ingredients / Science Reagents"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Expense Category
              </label>
              <select
                value={expenseForm.category}
                onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Staff Salaries" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Staff Salaries</option>
                <option value="Facilities & Utilities" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Facilities & Utilities</option>
                <option value="Educational Materials" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Educational Materials</option>
                <option value="Canteen & Food Supplies" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Canteen & Food Supplies</option>
                <option value="ICT & Technology" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">ICT & Technology</option>
                <option value="Maintenance & Repairs" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Maintenance & Repairs</option>
                <option value="Administrative & Office" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Administrative & Office</option>
                <option value="Other" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Other (Specify Custom Category)</option>
              </select>

              {expenseForm.category === 'Other' && (
                <div className="mt-2.5">
                  <label className="block text-xs font-bold text-blue-700 dark:text-blue-400">
                    Specify Custom Expense Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.customCategory}
                    onChange={e => setExpenseForm({ ...expenseForm, customCategory: e.target.value })}
                    placeholder="e.g. Sports Day Trophies, Food Ingredients"
                    className="mt-1 w-full rounded-xl border border-blue-400 bg-blue-50/50 p-2.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:outline-none dark:border-blue-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Amount (GH₵) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={expenseForm.amount}
                onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Payment Method
              </label>
              <select
                value={expenseForm.paymentMethod}
                onChange={e => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Bank Transfer" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Bank Transfer</option>
                <option value="Mobile Money" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Mobile Money</option>
                <option value="Cash" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Cash</option>
                <option value="Cheque" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Reference Number / Transaction ID
              </label>
              <input
                type="text"
                value={expenseForm.referenceNo}
                onChange={e => setExpenseForm({ ...expenseForm, referenceNo: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddExpenseModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800"
            >
              Save Expense Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Non-Tuition Income Modal */}
      <Modal
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
        title="Record Non-Tuition School Income"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveIncome} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Income Description *
            </label>
            <input
              type="text"
              required
              value={incomeForm.description}
              onChange={e => setIncomeForm({ ...incomeForm, description: e.target.value })}
              placeholder="e.g. Weekly Canteen Revenue / Bus Transit Fees"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Income Category
              </label>
              <select
                value={incomeForm.category}
                onChange={e => setIncomeForm({ ...incomeForm, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Canteen & Lunch Revenue" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Canteen & Lunch Revenue</option>
                <option value="School Bus & Transportation" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">School Bus & Transportation</option>
                <option value="Bookshop & Uniform Sales" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Bookshop & Uniform Sales</option>
                <option value="Excursions & Field Trips" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Excursions & Field Trips</option>
                <option value="Facility Rentals & Events" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Facility Rentals & Events</option>
                <option value="Donations & Grants" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Donations & Grants</option>
                <option value="Other" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Other (Specify Custom Income Category)</option>
              </select>

              {incomeForm.category === 'Other' && (
                <div className="mt-2.5">
                  <label className="block text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Specify Custom Income Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={incomeForm.customCategory}
                    onChange={e => setIncomeForm({ ...incomeForm, customCategory: e.target.value })}
                    placeholder="e.g. Graduation Gown Rental, PTA Fundraiser"
                    className="mt-1 w-full rounded-xl border border-emerald-400 bg-emerald-50/50 p-2.5 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-emerald-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Amount (GH₵) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={incomeForm.amount}
                onChange={e => setIncomeForm({ ...incomeForm, amount: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Payment Method
              </label>
              <select
                value={incomeForm.paymentMethod}
                onChange={e => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Cash" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Cash</option>
                <option value="Mobile Money" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Mobile Money</option>
                <option value="Bank Transfer" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Bank Transfer</option>
                <option value="Cheque" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Reference Number / Transaction ID
              </label>
              <input
                type="text"
                value={incomeForm.referenceNo}
                onChange={e => setIncomeForm({ ...incomeForm, referenceNo: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddIncomeModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
            >
              Save Income Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Allocate / Edit Department Budget Modal */}
      <Modal
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        title="Allocate Departmental Budget (GH₵)"
        maxWidth="md"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Department Name *
            </label>
            <select
              value={budgetForm.department}
              onChange={e => setBudgetForm({ ...budgetForm, department: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
            >
              <option value="Preschool Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Preschool Department</option>
              <option value="Lower Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Lower Primary Department</option>
              <option value="Upper Primary Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Upper Primary Department</option>
              <option value="JHS Department" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">JHS Department</option>
              <option value="Administrative & Operations" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Administrative & Operations</option>
              <option value="Canteen & Catering Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Canteen & Catering Services</option>
              <option value="Sanitation & Cleaning Services" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Sanitation & Cleaning Services</option>
              <option value="Security & Campus Safety" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Security & Campus Safety</option>
              <option value="Transport & Logistics" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Transport & Logistics</option>
              <option value="Other" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-white">Other (Specify Custom Department)</option>
            </select>

            {budgetForm.department === 'Other' && (
              <div className="mt-2.5">
                <label className="block text-xs font-bold text-purple-700 dark:text-purple-400">
                  Specify Custom Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={budgetForm.customDepartment}
                  onChange={e => setBudgetForm({ ...budgetForm, customDepartment: e.target.value })}
                  placeholder="e.g. ICT & E-Learning Department"
                  className="mt-1 w-full rounded-xl border border-purple-400 bg-purple-50/50 p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none dark:border-purple-800 dark:bg-slate-800 dark:text-white"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Allocated Budget Limit (GH₵) *
            </label>
            <input
              type="number"
              required
              min="100"
              value={budgetForm.allocatedBudget}
              onChange={e => setBudgetForm({ ...budgetForm, allocatedBudget: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 focus:border-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddBudgetModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-800"
            >
              Save Department Budget
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Entry Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          itemName={deleteTarget.name}
          itemType={deleteTarget.type === 'expense' ? 'expense entry' : deleteTarget.type === 'income' ? 'income entry' : 'department budget'}
        />
      )}
    </div>
  );
};
