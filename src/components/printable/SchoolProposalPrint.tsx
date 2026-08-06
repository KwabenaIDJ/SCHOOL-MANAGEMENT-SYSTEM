import React from 'react';
import { Printer, ShieldCheck, Award, CheckCircle2, Trophy, FileText, Wallet, Users, BookOpen, Clock, Lock, Sparkles, Building2, ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface SchoolProposalPrintProps {
  onClose?: () => void;
}

export const SchoolProposalPrint: React.FC<SchoolProposalPrintProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8 font-sans text-slate-900 selection:bg-blue-800 selection:text-white">
      {/* Top Action Bar - Hidden when printing */}
      <div className="no-print mx-auto max-w-5xl mb-6 flex items-center justify-between rounded-2xl bg-white p-4 shadow-md border border-slate-200">
        <div>
          <h2 className="text-base font-black text-slate-900 font-heading">IDJ TECH SOLUTIONS • Official School Proposal PDF</h2>
          <p className="text-xs text-slate-500 font-semibold">Click print to save or print this official proposal as PDF for school board review.</p>
        </div>
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-800/30 hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Printable Proposal Container */}
      <div className="print-container printable-proposal mx-auto max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        
        {/* Header / Cover Section */}
        <div className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white font-heading">IDJ TECH SOLUTIONS</h3>
                  <p className="text-[11px] font-bold text-blue-300 tracking-wider uppercase">School Software & Automation Division</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-600/30 px-3.5 py-1 text-xs font-extrabold text-blue-200 border border-blue-400/30 backdrop-blur-md">
                OFFICIAL PROPOSAL • 2026
              </span>
            </div>

            <div className="mt-10 max-w-3xl">
              <span className="rounded-lg bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                Executive Software Proposal
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white font-heading">
                Next-Generation Digital School Management & Automation System
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                A complete, end-to-end cloud portal tailored specifically for private Basic, Primary, and Junior High Schools in Ghana.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-6 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Prepared By</span>
                <span className="font-extrabold text-white">IDJ TECH SOLUTIONS</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Curriculum Support</span>
                <span className="font-extrabold text-white">Ghanaian Basic Education</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Target Institution</span>
                <span className="font-extrabold text-white">Creche to JHS 3</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Date</span>
                <span className="font-extrabold text-white font-mono">------------------------</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Body */}
        <div className="p-8 sm:p-12 space-y-10">

          {/* Section 1: Executive Summary */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Building2 className="h-5 w-5 text-blue-800" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading">1. Comprehensive Analysis: Challenges & System Value</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Managing a progressive basic education institution requires absolute accuracy in student assessment, structured fee collection, and seamless communication between teachers, administrators, and parents. Traditional paper-heavy methods create massive administrative bottlenecks, teacher burnout, and revenue loss.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 mt-4">
              
              {/* Detailed Challenges Card */}
              <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-rose-200/80 pb-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                  <h4 className="text-sm font-extrabold text-rose-950 uppercase tracking-wider font-heading">
                    Critical Challenges Solved
                  </h4>
                </div>
                
                <ul className="text-xs text-rose-900 space-y-2.5 font-medium leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>Manual Calculation & Position Errors</strong>: Teachers spend weeks computing CA1 (15%), CA2 (15%), Exam (70%), total scores, letter grades, and 1st–Nth position rankings by hand—leading to human error and heated parent disputes over wrong rank placement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>Tedious Paper Printing Setup</strong>: Even when physical report cards and receipts are printed for parents, typing and formatting individual paper report cards by hand takes days of teacher overtime and produces inconsistent, messy layout printouts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>Uncollected Fees & Ledger Chaos</strong>: Paper receipt books get misplaced, cash deposits are recorded on scattered paper sheets, and overdue tuition balances go unnoticed until late in the term.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>Misplaced Historical Academic Records</strong>: Physical registers get worn out or lost over time, leaving the school without a central, permanent digital archive of past student performance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span><strong>Communication Disconnect</strong>: Parents repeatedly call or visit the administration office for basic attendance updates, homework tasks, or fee balances.</span>
                  </li>
                </ul>
              </div>

              {/* Detailed Digital Portal Solution Card */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h4 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider font-heading">
                    The IDJ TECH Solutions Advantage
                  </h4>
                </div>

                <ul className="text-xs text-emerald-900 space-y-2.5 font-medium leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>1-Click Standardized PDF Printing</strong>: Perfect for physical printing! Generates standardized, beautifully formatted Terminal Report Cards and Digital Receipts in 1 click, ready for physical printing on standard A4 paper without any manual layout work.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Automated Ghanaian Grading & Ranking Engine</strong>: Computes exact letter grades (A to F), 50%+ total pass promotion decisions, and 1st–Nth position rankings automatically in seconds.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>1.5-Month Automated Fee Recovery</strong>: Flags owing students automatically 45 days into the term with direct <strong className="text-emerald-800">📞 Call Parent</strong> buttons to accelerate tuition collection early.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Itemized Next Term Fee Bill Preparation</strong>: Bursar can configure core tuition, workbooks, ICT lab, PTA levies, canteen, and bus transit fees, automatically printed on the student report card.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Automated User Password Generation & Security Isolation</strong>: Instant login passwords generated for new students, parents, and teachers; non-teaching staff protected from system access.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Role Isolation & Financial Privacy</strong>: Dedicated portals for Admin, Teachers, Parents, and Students, with strict financial alerts restricted to Administrators only.</span>
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 2: Core System Capabilities */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Award className="h-5 w-5 text-blue-800" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading">2. Key System Modules & Features</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              
              {/* Module 1 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-800 text-white font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Ghanaian Assessment Engine</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Continuous Assessment breakdown (CA1 15%, CA2 15%, Exam 70%). Implements official 9-tier Ghanaian grading scale (A to F) with 50%+ pass rule.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-blue-800">
                  ✓ 1st to Nth Class Position Ranking
                </div>
              </div>

              {/* Module 2 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Fee Ledger & Next Term Billing</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Track Ghanaian Cedi (GH₵) payments, issue digital receipts, and prepare itemized bills (Tuition, ICT lab, PTA levies, canteen, bus) for next term.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-emerald-800">
                  ✓ 45-Day Overdue Call Parent Alert
                </div>
              </div>

              {/* Module 3 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-700 text-white font-bold">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Password & Access Control</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Auto-generates secret passwords for new students, parents, and teachers upon enrollment. Non-teaching staff accounts protected from system access.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-purple-800">
                  ✓ Administrator Password Reset Tool
                </div>
              </div>

              {/* Module 4 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white font-bold">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Homework & Timetable Tracker</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Teachers assign homework with instructions and due dates. Students and teachers get glowing <span className="text-amber-600 font-bold">⏰ DUE TODAY</span> deadline alerts.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-indigo-800">
                  ✓ Class Timetable Scheduling Grid
                </div>
              </div>

              {/* Module 5 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Class Teacher Authority</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Class Teachers manage score entries and evaluate promotions for their assigned class. Teachers cannot view other portals or admin ledgers.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-teal-800">
                  ✓ Class Teacher Dashboard
                </div>
              </div>

              {/* Module 6 */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Strict Financial Privacy Safeguard</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Financial alerts and fee messages are strictly restricted to Administrators. Teachers, parents, and students receive zero money notifications.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-amber-800">
                  ✓ Role Privacy Enforcement
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: Visual Showcase / Mockup Highlights */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Trophy className="h-5 w-5 text-blue-800" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading">3. Visual Interface & Printable Deliverables</h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">System Deliverable Preview</span>
                <span className="text-[11px] text-slate-400 font-mono">Kidshine Montessori School Portal</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="text-xs font-extrabold text-amber-400 uppercase flex items-center gap-1">
                    📄 Official Terminal Report Card (PDF)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Clean, professional transcript with Ghanaian A–F grades, Class Position Rank (e.g. 1st out of 18), 50%+ Pass Promotion Badge, Next Term Tuition Bill, and Class Teacher Signatures.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="text-xs font-extrabold text-emerald-400 uppercase flex items-center gap-1">
                    💳 Digital Tuition Receipt (GH₵)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Instant digital receipt generation with unique receipt numbers, payment history table, remaining balance breakdown, and bursar authentication seal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Investment & Pricing Options */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-800" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading">4. Investment Packages & Pricing Options</h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              
              {/* Pricing Package A */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Package Option A</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">Select:</span>
                    <div className="h-5 w-5 rounded-md border-2 border-slate-400 bg-white"></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 font-heading">One-Time Setup + Annual Hosting</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Full portal ownership with year-round technical support.</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Initial Setup & Development Fee:</span>
                    <span className="text-lg font-black text-blue-900 font-mono">GH₵ 5,500</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Year 1 Domain & Hosting (.edu.gh):</span>
                    <span className="text-xs font-extrabold text-emerald-600 uppercase">INCLUDED FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Subsequent Annual Renewal:</span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono">GH₵ 1,000 / year</span>
                  </div>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> Complete portal setup for Creche to JHS 3</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> Staff & Teacher Onboarding Training Session</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-blue-700" /> 1-Year Free Technical Support & Cloud Backups</li>
                </ul>
              </div>

              {/* Pricing Package B */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Package Option B</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500">Select:</span>
                    <div className="h-5 w-5 rounded-md border-2 border-slate-400 bg-white"></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 font-heading">Per-Student Per-Term Tiered Model (SaaS)</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Zero setup cost. Includes 100% cloud hosting, domain (.edu.gh) & support.</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-700">Initial System Setup Cost:</span>
                    <span className="text-lg font-black text-emerald-600 font-mono">GH₵ 0 (FREE)</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Domain & Cloud Hosting (.edu.gh):</span>
                    <span className="text-xs font-extrabold text-emerald-600 uppercase">INCLUDED IN LEVY</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Tier 1 Rate (Up to 200 Students):</span>
                    <span className="text-xs font-extrabold text-blue-900 font-mono">GH₵ 10 / student / term</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-700">Tier 2 Rate (Above 200 Students):</span>
                    <span className="text-xs font-extrabold text-blue-900 font-mono">GH₵ 7 / student / term</span>
                  </div>
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-2 bg-blue-50/60 -mx-4 -mb-2 p-2 px-4 rounded-b-xl border-blue-100">
                    <span className="text-xs font-bold text-blue-950">Example (300 Students @ GH₵ 7):</span>
                    <span className="text-xs font-extrabold text-blue-950 font-mono">GH₵ 2,100 / term</span>
                  </div>
                </div>

                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Easily added to student tuition bills as ICT / Portal Levy</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Covers 100% domain registration, hosting & maintenance</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Volume discount automatically rewards larger student populations</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 5: Implementation Timeline */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Clock className="h-5 w-5 text-blue-800" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight font-heading">5. 6-Day Fast-Track Onboarding Timeline</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
                <span className="text-xs font-black text-blue-800 uppercase block">Days 1 - 2</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">Domain & Setup</span>
                <p className="text-[11px] text-slate-500 mt-1">Setup school domain (.edu.gh) & portal branding.</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
                <span className="text-xs font-black text-blue-800 uppercase block">Days 3 - 4</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">Data & Credentials</span>
                <p className="text-[11px] text-slate-500 mt-1">Import student rosters & auto-generate passwords.</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
                <span className="text-xs font-black text-blue-800 uppercase block">Day 5</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">Staff Onboarding</span>
                <p className="text-[11px] text-slate-500 mt-1">Train teachers on grade entry & attendance tracking.</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                <span className="text-xs font-black text-emerald-800 uppercase block">Day 6</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">Official Launch!</span>
                <p className="text-[11px] text-slate-500 mt-1">Distribute parent passwords & go live online.</p>
              </div>
            </div>
          </section>

          {/* Section 6: Formal Acceptance Sign-Off */}
          <section className="space-y-4 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight font-heading">Proposal Acceptance & Sign-off</h3>
            <p className="text-xs text-slate-600 font-medium">
              By signing below, both parties agree to the scope of work and selected investment package outlined in this proposal.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="border-t border-slate-400 pt-2 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">For: IDJ TECH SOLUTIONS</span>
                <span className="text-[11px] text-slate-500 block">Lead Software Consultant & Director</span>
                <div className="pt-6 font-serif italic text-xs text-slate-400">Authorized Signature & Date</div>
              </div>

              <div className="border-t border-slate-400 pt-2 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">For: School Administration</span>
                <span className="text-[11px] text-slate-500 block">School Proprietor / Headteacher</span>
                <div className="pt-6 font-serif italic text-xs text-slate-400">Authorized Signature & Stamp</div>
              </div>
            </div>
          </section>

        </div>

        {/* Proposal Footer */}
        <div className="bg-slate-100 p-6 text-center border-t border-slate-200 text-slate-500 text-[11px] font-bold">
          <p>© 2026 IDJ TECH SOLUTIONS • Confidential Proposal Prepared for School Board Review</p>
        </div>

      </div>
    </div>
  );
};
