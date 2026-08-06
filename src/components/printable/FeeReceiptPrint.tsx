import React from 'react';
import { FeeRecord, PaymentItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Printer, CheckCircle, ShieldCheck } from 'lucide-react';

interface FeeReceiptPrintProps {
  feeRecord: FeeRecord;
  payment?: PaymentItem;
  onClose?: () => void;
}

export const FeeReceiptPrint: React.FC<FeeReceiptPrintProps> = ({
  feeRecord,
  payment
}) => {
  const activePayment = payment || feeRecord.paymentHistory[0] || {
    id: 'pmt-default',
    date: new Date().toISOString().split('T')[0],
    amount: feeRecord.paidAmount,
    paymentMethod: 'Bank Transfer' as const,
    referenceNo: 'TXN-00001',
    receivedBy: 'Bursar Office'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Buttons (no-print) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800 no-print">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          Official Payment Receipt Ready (GH₵)
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Printable Area Container */}
      <div className="print-container rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-gray-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-black tracking-tight text-blue-950">
                Kidshine Montessori School
              </h1>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Accra, Ghana • Tel: +233 24 412 3456 • Web: www.kidshinemontessori.edu.gh
            </p>
            <p className="text-xs text-gray-500">Email: finance@apexacademy.edu.gh</p>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              OFFICIAL RECEIPT (GH₵)
            </span>
            <p className="mt-2 text-xs font-mono font-bold text-gray-700">
              Receipt No: {feeRecord.receiptNumber}
            </p>
            <p className="text-xs text-gray-500">Date: {activePayment.date}</p>
          </div>
        </div>

        {/* Student & Payment Info Grid */}
        <div className="my-6 grid grid-cols-2 gap-6 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-gray-400">Payer Information</span>
            <p className="mt-1 font-extrabold text-gray-900 text-sm">{feeRecord.studentName}</p>
            <p className="text-gray-600">Grade Level: {feeRecord.gradeLevel}</p>
            <p className="text-gray-600">Student ID: {feeRecord.studentId}</p>
          </div>

          <div className="text-right">
            <span className="font-bold uppercase tracking-wider text-gray-400">Payment Breakdown</span>
            <p className="text-gray-700">Academic Term: <span className="font-bold">{feeRecord.academicTerm}</span></p>
            <p className="text-gray-700">Payment Method: <span className="font-bold">{activePayment.paymentMethod}</span></p>
            <p className="text-gray-700">Ref / Txn No: <span className="font-mono font-bold">{activePayment.referenceNo}</span></p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="my-6">
          <table className="w-full text-left text-xs">
            <thead className="border-y border-gray-200 bg-gray-50 uppercase tracking-wider font-bold text-gray-600">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Tuition Fee</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 font-bold text-gray-900">
                  Tuition & Academic Services Fee ({feeRecord.academicTerm})
                </td>
                <td className="py-4 px-4 text-right font-mono font-bold">
                  {formatCurrency(feeRecord.totalAmount)}
                </td>
                <td className="py-4 px-4 text-right font-mono font-extrabold text-emerald-700">
                  {formatCurrency(activePayment.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary Box */}
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Total Tuition:</span>
              <span className="font-mono font-bold">{formatCurrency(feeRecord.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total Amount Paid:</span>
              <span className="font-mono font-bold text-emerald-600">{formatCurrency(feeRecord.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-extrabold text-gray-900">
              <span>Remaining Balance:</span>
              <span className={`font-mono ${feeRecord.totalAmount - feeRecord.paidAmount === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(feeRecord.totalAmount - feeRecord.paidAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-12 flex items-center justify-between border-t border-dashed border-gray-300 pt-6 text-[11px] text-gray-500">
          <div>
            <p>Issued By: <span className="font-bold text-gray-800">{activePayment.receivedBy}</span></p>
            <p className="italic">Computer Generated Official Receipt in Ghanaian Cedis (GH₵)</p>
          </div>
          <div className="text-center">
            <div className="h-8 border-b border-gray-400 w-36 mb-1"></div>
            <p className="font-bold text-gray-700">Bursar / Accounts Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
