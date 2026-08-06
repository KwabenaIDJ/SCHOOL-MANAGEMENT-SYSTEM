import React, { createContext, useContext, useState, useEffect } from 'react';
import { getInitialsAvatar } from '../utils/avatar';
import {
  Student,
  Teacher,
  Subject,
  Classroom,
  FeeRecord,
  GradeEntry,
  AttendanceRecord,
  Notice,
  Assignment,
  TimetableSlot,
  PaymentItem,
  ExpenseRecord,
  IncomeRecord,
  DepartmentBudget,
  UserCredentialItem
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_CLASSROOMS,
  INITIAL_FEE_RECORDS,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  INITIAL_TIMETABLE,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_BUDGETS,
  INITIAL_USER_CREDENTIALS
} from '../mock/initialData';
import { getNextClass, GhanaTerm } from '../constants/ghanaEducation';

export interface PromotionReport {
  promotedCount: number;
  graduatedCount: number;
  retainedCount: number;
  details: Array<{
    studentId: string;
    name: string;
    fromClass: string;
    toClass: string;
    gpa: number;
    status: 'Promoted' | 'Graduated' | 'Retained';
  }>;
}

interface SchoolDataContextType {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  classrooms: Classroom[];
  feeRecords: FeeRecord[];
  grades: GradeEntry[];
  attendance: AttendanceRecord[];
  notices: Notice[];
  assignments: Assignment[];
  timetable: TimetableSlot[];
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  departmentBudgets: DepartmentBudget[];

  currentAcademicYear: string;
  setCurrentAcademicYear: (year: string) => void;
  availableAcademicYears: string[];
  addAcademicYear: (year: string) => void;

  currentTerm: GhanaTerm;
  setCurrentTerm: (term: GhanaTerm) => void;
  isTermLocked: boolean;
  toggleTermLock: () => void;

  termConfig: {
    startDate: string;
    termDurationMonths: number;
    alertThresholdMonths: number;
  };
  setTermConfig: (config: { startDate: string; termDurationMonths: number; alertThresholdMonths: number }) => void;
  setTermDates: (dates: { startDate: string; midCutoffDate: string; endDate: string }) => void;

  // Expenses, Income & Budget CRUD
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (income: Omit<IncomeRecord, 'id'>) => void;
  deleteIncome: (id: string) => void;
  addOrUpdateDepartmentBudget: (department: string, allocatedBudget: number) => void;
  deleteDepartmentBudget: (department: string) => void;

  // Student CRUD
  addStudent: (student: Omit<Student, 'id' | 'rollNo'>, initialPayment?: number) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, 'id' | 'empId'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Administrator CRUD
  addAdministrator: (name: string, email: string, title?: string, customPassword?: string) => void;

  // Class & Subject CRUD
  addClassroom: (classroom: Omit<Classroom, 'id' | 'enrolledCount'>) => void;
  updateClassroom: (id: string, updated: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Fee Management & Next Term Billing
  recordPayment: (feeRecordId: string, payment: Omit<PaymentItem, 'id'>) => void;
  deleteFeeRecord: (id: string) => void;
  prepareNextTermFeeBill: (
    className: string,
    breakdown: {
      tuition: number;
      learningMaterials: number;
      ictLab: number;
      ptaLevy: number;
      canteen?: number;
      transportation?: number;
    }
  ) => void;

  // Grading & Attendance
  updateGrade: (id: string, updated: Partial<GradeEntry>) => void;
  addGrade: (grade: Omit<GradeEntry, 'id' | 'total' | 'letterGrade' | 'gpaPoint'>) => void;
  deleteGrade: (id: string) => void;
  markAttendance: (date: string, records: { studentId: string; studentName: string; gradeLevel: string; status: 'Present' | 'Absent' | 'Late' }[]) => void;

  // Notice & Assignment
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  deleteNotice: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  deleteAssignment: (id: string) => void;

  // Timetable CRUD
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, updated: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // Class-Teacher Promotion Engine
  promoteClassStudents: (className: string, minPassingGpa?: number, overriddenPromotions?: Record<string, boolean>) => PromotionReport;

  // User Passwords & Access Credentials Management
  userCredentials: UserCredentialItem[];
  updateUserPassword: (id: string, newPassword: string) => void;

  // Clear all data helper
  clearAllClassesAndSubjects: () => void;

  // Data reset helper
  resetDataToDefault: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const loadInitial = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (e) {
    console.error(`Error parsing localStorage for ${key}:`, e);
    return fallback;
  }
};

// Purge any legacy demo data to ensure 100% fresh clean production state
(() => {
  if (typeof window !== 'undefined' && !localStorage.getItem('sms_clean_production_v1')) {
    const keysToClear = [
      'sms_students', 'sms_teachers', 'sms_subjects', 'sms_classrooms',
      'sms_fee_records', 'sms_grades', 'sms_attendance', 'sms_notices',
      'sms_assignments', 'sms_timetable', 'sms_expenses', 'sms_incomes',
      'sms_budgets', 'sms_credentials'
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('sms_clean_production_v1', 'true');
  }
})();

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => loadInitial('sms_students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadInitial('sms_teachers', INITIAL_TEACHERS));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadInitial('sms_subjects', INITIAL_SUBJECTS));
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadInitial('sms_classrooms', INITIAL_CLASSROOMS));
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => loadInitial('sms_fee_records', INITIAL_FEE_RECORDS));
  const [grades, setGrades] = useState<GradeEntry[]>(() => loadInitial('sms_grades', INITIAL_GRADES));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadInitial('sms_attendance', INITIAL_ATTENDANCE));
  const [notices, setNotices] = useState<Notice[]>(() => loadInitial('sms_notices', INITIAL_NOTICES));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadInitial('sms_assignments', INITIAL_ASSIGNMENTS));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadInitial('sms_timetable', INITIAL_TIMETABLE));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadInitial('sms_expenses', INITIAL_EXPENSES));
  const [incomes, setIncomes] = useState<IncomeRecord[]>(() => loadInitial('sms_incomes', INITIAL_INCOMES));
  const [departmentBudgets, setDepartmentBudgets] = useState<DepartmentBudget[]>(() => loadInitial('sms_budgets', INITIAL_BUDGETS));
  const [userCredentials, setUserCredentials] = useState<UserCredentialItem[]>(() => loadInitial('sms_credentials', INITIAL_USER_CREDENTIALS));

  useEffect(() => {
    localStorage.setItem('sms_credentials', JSON.stringify(userCredentials));
  }, [userCredentials]);

  const updateUserPassword = (id: string, newPassword: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUserCredentials(prev =>
      prev.map(c => (c.id === id ? { ...c, password: newPassword, lastChanged: todayStr } : c))
    );
  };

  useEffect(() => {
    localStorage.setItem('sms_timetable', JSON.stringify(timetable));
  }, [timetable]);
  useEffect(() => {
    localStorage.setItem('sms_expenses', JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem('sms_incomes', JSON.stringify(incomes));
  }, [incomes]);
  useEffect(() => {
    localStorage.setItem('sms_budgets', JSON.stringify(departmentBudgets));
  }, [departmentBudgets]);

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id'>) => {
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addIncome = (incomeData: Omit<IncomeRecord, 'id'>) => {
    const newIncome: IncomeRecord = {
      ...incomeData,
      id: `inc-${Date.now()}`
    };
    setIncomes(prev => [newIncome, ...prev]);
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  const addOrUpdateDepartmentBudget = (department: string, allocatedBudget: number) => {
    setDepartmentBudgets(prev => {
      const existingIndex = prev.findIndex(b => b.department.toLowerCase() === department.toLowerCase());
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          allocatedBudget
        };
        return updated;
      }
      return [...prev, { department, allocatedBudget, spentAmount: 0 }];
    });
  };

  const deleteDepartmentBudget = (department: string) => {
    setDepartmentBudgets(prev => prev.filter(b => b.department.toLowerCase() !== department.toLowerCase()));
  };

  const [availableAcademicYears, setAvailableAcademicYears] = useState<string[]>(() => {
    const saved = localStorage.getItem('sms_custom_academic_years');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      '2024/2025', '2025/2026', '2026/2027', '2027/2028', 
      '2028/2029', '2029/2030', '2030/2031', '2031/2032', 
      '2032/2033', '2033/2034', '2034/2035', '2035/2036'
    ];
  });

  const addAcademicYear = (newYear: string) => {
    if (!availableAcademicYears.includes(newYear)) {
      const updated = [...availableAcademicYears, newYear];
      setAvailableAcademicYears(updated);
      localStorage.setItem('sms_custom_academic_years', JSON.stringify(updated));
    }
  };

  const [currentAcademicYear, setCurrentAcademicYearState] = useState<string>(() => {
    const saved = localStorage.getItem('sms_current_academic_year');
    return saved || '2025/2026';
  });

  const setCurrentAcademicYear = (year: string) => {
    setCurrentAcademicYearState(year);
    localStorage.setItem('sms_current_academic_year', year);
  };

  const [termConfig, setTermConfigState] = useState<{ startDate: string; termDurationMonths: number; alertThresholdMonths: number }>(() => {
    const saved = localStorage.getItem('sms_term_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      startDate: '2026-05-15',
      termDurationMonths: 3,
      alertThresholdMonths: 2
    };
  });

  const setTermConfig = (config: { startDate: string; termDurationMonths: number; alertThresholdMonths: number }) => {
    setTermConfigState(config);
    localStorage.setItem('sms_term_config', JSON.stringify(config));
  };

  const [currentTerm, setCurrentTerm] = useState<GhanaTerm>(() => {
    const saved = localStorage.getItem('sms_current_term') as GhanaTerm;
    return saved || 'Third Term (Term 3)';
  });

  const handleSetCurrentTerm = (newTerm: GhanaTerm) => {
    // Automatic Academic Year progression: When transitioning from Third Term to First Term, automatically advance academic year!
    if (currentTerm === 'Third Term (Term 3)' && newTerm === 'First Term (Term 1)') {
      const currentIndex = availableAcademicYears.indexOf(currentAcademicYear);
      if (currentIndex !== -1 && currentIndex < availableAcademicYears.length - 1) {
        const nextYear = availableAcademicYears[currentIndex + 1];
        setCurrentAcademicYear(nextYear);
      }
    }
    setCurrentTerm(newTerm);
  };

  const [termDates, setTermDatesState] = useState(() => {
    const saved = localStorage.getItem('sms_term_dates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      startDate: '2026-05-15',
      midCutoffDate: '2026-06-30',
      endDate: '2026-08-30'
    };
  });

  const setTermDates = (dates: { startDate: string; midCutoffDate: string; endDate: string }) => {
    setTermDatesState(dates);
    localStorage.setItem('sms_term_dates', JSON.stringify(dates));
  };

  const [isTermLocked, setIsTermLocked] = useState<boolean>(() => {
    const saved = localStorage.getItem('sms_is_term_locked');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sms_current_term', currentTerm);
  }, [currentTerm]);
  useEffect(() => {
    localStorage.setItem('sms_is_term_locked', String(isTermLocked));
  }, [isTermLocked]);

  const toggleTermLock = () => {
    setIsTermLocked(prev => !prev);
  };
  useEffect(() => {
    localStorage.setItem('sms_students', JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem('sms_teachers', JSON.stringify(teachers));
  }, [teachers]);
  useEffect(() => {
    localStorage.setItem('sms_subjects', JSON.stringify(subjects));
  }, [subjects]);
  useEffect(() => {
    localStorage.setItem('sms_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);
  useEffect(() => {
    localStorage.setItem('sms_fee_records', JSON.stringify(feeRecords));
  }, [feeRecords]);
  useEffect(() => {
    localStorage.setItem('sms_grades', JSON.stringify(grades));
  }, [grades]);
  useEffect(() => {
    localStorage.setItem('sms_attendance', JSON.stringify(attendance));
  }, [attendance]);
  useEffect(() => {
    localStorage.setItem('sms_notices', JSON.stringify(notices));
  }, [notices]);
  useEffect(() => {
    localStorage.setItem('sms_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'rollNo'>, initialPayment = 0) => {
    const id = `std-${Date.now()}`;
    const rollNo = `STU-2026/${Math.floor(100 + Math.random() * 900)}`;
    const paidAmount = Math.max(0, initialPayment);
    const feeBalance = Math.max(0, studentData.totalTuition - paidAmount);

    const newStudent: Student = {
      ...studentData,
      id,
      rollNo,
      feeBalance
    };
    setStudents(prev => [newStudent, ...prev]);

    // Create initial fee record with payment history
    const initialPaymentHistory: PaymentItem[] = paidAmount > 0 ? [
      {
        id: `pmt-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: paidAmount,
        paymentMethod: 'Cash',
        referenceNo: `INIT-${Math.floor(100000 + Math.random() * 900000)}`,
        receivedBy: 'Finance Dept',
        remarks: 'Initial Enrollment Deposit'
      }
    ] : [];

    const newFeeRecord: FeeRecord = {
      id: `fee-${Date.now()}`,
      studentId: id,
      studentName: newStudent.name,
      gradeLevel: newStudent.gradeLevel,
      academicTerm: currentTerm,
      totalAmount: newStudent.totalTuition,
      paidAmount,
      dueDate: '2026-08-30',
      status: feeBalance === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Unpaid',
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentHistory: initialPaymentHistory
    };
    setFeeRecords(prev => [newFeeRecord, ...prev]);

    // Automatically generate Student & Parent Access Passwords
    const todayStr = new Date().toISOString().split('T')[0];
    const studentPass = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const parentPass = `PAR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudentCred: UserCredentialItem = {
      id: `cred-stu-${Date.now()}`,
      userId: id,
      name: newStudent.name,
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`,
      role: 'student',
      password: studentPass,
      associatedInfo: `Student • Class: ${newStudent.gradeLevel}`,
      lastChanged: todayStr
    };

    const guardianName = newStudent.guardianName || `Guardian of ${newStudent.name}`;
    const guardianEmail = newStudent.guardianEmail || `${guardianName.toLowerCase().replace(/[^a-z]/g, '.')}@gmail.com`;

    const newParentCred: UserCredentialItem = {
      id: `cred-par-${Date.now() + 1}`,
      userId: `parent-${Date.now()}`,
      name: guardianName,
      email: guardianEmail,
      role: 'parent',
      password: parentPass,
      associatedInfo: `Parent / Guardian of ${newStudent.name}`,
      lastChanged: todayStr
    };

    setUserCredentials(prev => [newStudentCred, newParentCred, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    if (updated.name || updated.email || updated.gradeLevel) {
      setUserCredentials(prev =>
        prev.map(c =>
          c.userId === id
            ? {
                ...c,
                name: updated.name || c.name,
                email: updated.email || c.email,
                associatedInfo: updated.gradeLevel ? `Student • Class: ${updated.gradeLevel}` : c.associatedInfo
              }
            : c
        )
      );
    }
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setFeeRecords(prev => prev.filter(f => f.studentId !== id));
    setGrades(prev => prev.filter(g => g.studentId !== id));
    setUserCredentials(prev => prev.filter(c => c.userId !== id));
  };

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'empId'>) => {
    const id = `tch-${Date.now()}`;
    const empId = `TCH-${Math.floor(800 + Math.random() * 100)}`;
    const newTeacher: Teacher = { ...teacherData, id, empId };
    setTeachers(prev => [newTeacher, ...prev]);

    // Automatically generate Teacher Password Credentials
    const todayStr = new Date().toISOString().split('T')[0];
    const teacherPass = `TCH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTeacherCred: UserCredentialItem = {
      id: `cred-tch-${Date.now()}`,
      userId: id,
      name: newTeacher.name,
      email: newTeacher.email || `${newTeacher.name.toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`,
      role: 'teacher',
      password: teacherPass,
      associatedInfo: `Class Teacher: ${newTeacher.classTeacherOf || newTeacher.department}`,
      lastChanged: todayStr
    };

    setUserCredentials(prev => [newTeacherCred, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    if (updated.name || updated.email || updated.classTeacherOf || updated.department) {
      setUserCredentials(prev =>
        prev.map(c =>
          c.userId === id
            ? {
                ...c,
                name: updated.name || c.name,
                email: updated.email || c.email,
                associatedInfo: `Class Teacher: ${updated.classTeacherOf || updated.department || c.associatedInfo}`
              }
            : c
        )
      );
    }
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    setUserCredentials(prev => prev.filter(c => c.userId !== id));
  };

  const addAdministrator = (name: string, email: string, title?: string, customPassword?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const adminPass = customPassword || `ADM-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `cred-adm-${Date.now()}`;
    const newAdminCred: UserCredentialItem = {
      id,
      userId: `adm-${Date.now()}`,
      name,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '.')}@kidshinemontessori.edu.gh`,
      role: 'admin',
      password: adminPass,
      associatedInfo: `Administrator • ${title || 'School Management'}`,
      lastChanged: todayStr
    };
    setUserCredentials(prev => [newAdminCred, ...prev]);
  };

  // Class & Subject CRUD
  const addClassroom = (classroomData: Omit<Classroom, 'id' | 'enrolledCount'>) => {
    const newClassroom: Classroom = {
      ...classroomData,
      id: `cls-${Date.now()}`,
      enrolledCount: 0
    };
    setClassrooms(prev => [...prev, newClassroom]);
  };

  const updateClassroom = (id: string, updated: Partial<Classroom>) => {
    setClassrooms(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
  };

  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sbj-${Date.now()}`
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Fee Management
  const recordPayment = (feeRecordId: string, paymentData: Omit<PaymentItem, 'id'>) => {
    const paymentId = `pmt-${Date.now()}`;
    const newPayment: PaymentItem = { ...paymentData, id: paymentId };

    setFeeRecords(prev =>
      prev.map(rec => {
        if (rec.id === feeRecordId) {
          const updatedPaid = rec.paidAmount + paymentData.amount;
          const updatedBalance = Math.max(0, rec.totalAmount - updatedPaid);
          const newStatus: FeeRecord['status'] =
            updatedBalance === 0 ? 'Paid' : updatedPaid > 0 ? 'Partial' : 'Overdue';

          setStudents(stList =>
            stList.map(s => (s.id === rec.studentId ? { ...s, feeBalance: updatedBalance } : s))
          );

          return {
            ...rec,
            paidAmount: updatedPaid,
            status: newStatus,
            paymentHistory: [newPayment, ...rec.paymentHistory]
          };
        }
        return rec;
      })
    );
  };

  const deleteFeeRecord = (id: string) => {
    setFeeRecords(prev => prev.filter(f => f.id !== id));
  };

  const prepareNextTermFeeBill = (
    className: string,
    breakdown: {
      tuition: number;
      learningMaterials: number;
      ictLab: number;
      ptaLevy: number;
      canteen?: number;
      transportation?: number;
    }
  ) => {
    const totalBill = breakdown.tuition + breakdown.learningMaterials + breakdown.ictLab + breakdown.ptaLevy + (breakdown.canteen || 0) + (breakdown.transportation || 0);

    setStudents(prev =>
      prev.map(s => {
        if (className === 'All' || s.gradeLevel === className) {
          const paidSoFar = Math.max(0, s.totalTuition - s.feeBalance);
          const newFeeBalance = Math.max(0, totalBill - paidSoFar);
          return {
            ...s,
            totalTuition: totalBill,
            feeBalance: newFeeBalance
          };
        }
        return s;
      })
    );

    setFeeRecords(prev =>
      prev.map(f => {
        if (className === 'All' || f.gradeLevel === className) {
          const balance = Math.max(0, totalBill - f.paidAmount);
          return {
            ...f,
            totalAmount: totalBill,
            status: balance === 0 ? 'Paid' : f.paidAmount > 0 ? 'Partial' : 'Unpaid'
          };
        }
        return f;
      })
    );
  };

  // Official Ghanaian Basic Education Grading Scale
  const calculateGradeDetails = (ca1: number, ca2: number, exam: number) => {
    const total = Math.min(100, Math.max(0, ca1 + ca2 + exam));
    let letterGrade: GradeEntry['letterGrade'] = 'F';

    if (total >= 80) {
      letterGrade = 'A';
    } else if (total >= 75) {
      letterGrade = 'B+';
    } else if (total >= 70) {
      letterGrade = 'B';
    } else if (total >= 65) {
      letterGrade = 'C+';
    } else if (total >= 60) {
      letterGrade = 'C';
    } else if (total >= 55) {
      letterGrade = 'D+';
    } else if (total >= 50) {
      letterGrade = 'D';
    } else if (total >= 40) {
      letterGrade = 'E';
    } else {
      letterGrade = 'F';
    }

    return { total, letterGrade, gpaPoint: 0 };
  };

  const updateGrade = (id: string, updated: Partial<GradeEntry>) => {
    setGrades(prev =>
      prev.map(g => {
        if (g.id === id) {
          const ca1 = updated.ca1 !== undefined ? updated.ca1 : g.ca1;
          const ca2 = updated.ca2 !== undefined ? updated.ca2 : g.ca2;
          const exam = updated.exam !== undefined ? updated.exam : g.exam;
          const { total, letterGrade, gpaPoint } = calculateGradeDetails(ca1, ca2, exam);

          return {
            ...g,
            ...updated,
            ca1,
            ca2,
            exam,
            total,
            letterGrade,
            gpaPoint
          };
        }
        return g;
      })
    );
  };

  const addGrade = (gradeData: Omit<GradeEntry, 'id' | 'total' | 'letterGrade' | 'gpaPoint'>) => {
    const { total, letterGrade, gpaPoint } = calculateGradeDetails(
      gradeData.ca1,
      gradeData.ca2,
      gradeData.exam
    );
    const newGrade: GradeEntry = {
      ...gradeData,
      id: `grd-${Date.now()}`,
      total,
      letterGrade,
      gpaPoint
    };
    setGrades(prev => [newGrade, ...prev]);
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  // Attendance
  const markAttendance = (
    date: string,
    records: { studentId: string; studentName: string; gradeLevel: string; status: 'Present' | 'Absent' | 'Late' }[]
  ) => {
    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.date === date && records.some(r => r.studentId === a.studentId)));
      const newEntries: AttendanceRecord[] = records.map(r => ({
        id: `att-${Date.now()}-${r.studentId}`,
        studentId: r.studentId,
        studentName: r.studentName,
        gradeLevel: r.gradeLevel,
        date,
        status: r.status
      }));
      return [...newEntries, ...filtered];
    });
  };

  // Notice Board
  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  // Assignments
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'status'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `asg-${Date.now()}`,
      status: 'Pending'
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  // Timetable CRUD
  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `slot-${Date.now()}`
    };
    setTimetable(prev => [...prev, newSlot]);
  };

  const updateTimetableSlot = (id: string, updated: Partial<TimetableSlot>) => {
    setTimetable(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable(prev => prev.filter(s => s.id !== id));
  };

  // Class-Teacher Promotion Engine (50%+ Total Marks Pass Rule)
  const promoteClassStudents = (
    className: string,
    minPassingPercentage = 50,
    overriddenPromotions?: Record<string, boolean>
  ): PromotionReport => {
    const report: PromotionReport = {
      promotedCount: 0,
      graduatedCount: 0,
      retainedCount: 0,
      details: []
    };

    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.gradeLevel !== className || student.status === 'Graduated') {
          return student;
        }

        // Calculate student's total achieved marks vs attainable marks
        const studentGrades = grades.filter(g => g.studentId === student.id || g.studentName === student.name);
        const totalAchieved = studentGrades.reduce((sum, g) => sum + g.total, 0);
        const subjectCount = studentGrades.length > 0 ? studentGrades.length : 5;
        const totalAttainable = subjectCount * 100;
        const averagePercent = totalAttainable > 0 ? Math.round((totalAchieved / totalAttainable) * 100) : 85;

        const isPassingByDefault = averagePercent >= minPassingPercentage;
        const isApprovedByTeacher = overriddenPromotions && student.id in overriddenPromotions
          ? overriddenPromotions[student.id]
          : isPassingByDefault;

        if (isApprovedByTeacher) {
          const { nextClass, isGraduating } = getNextClass(student.gradeLevel);

          if (isGraduating) {
            report.graduatedCount += 1;
            report.details.push({
              studentId: student.id,
              name: student.name,
              fromClass: student.gradeLevel,
              toClass: 'Graduated (Alumni)',
              gpa: student.gpa,
              status: 'Graduated'
            });
            return {
              ...student,
              status: 'Graduated',
              gradeLevel: 'Graduated (Alumni)'
            };
          } else {
            report.promotedCount += 1;
            report.details.push({
              studentId: student.id,
              name: student.name,
              fromClass: student.gradeLevel,
              toClass: nextClass,
              gpa: student.gpa,
              status: 'Promoted'
            });
            return {
              ...student,
              gradeLevel: nextClass
            };
          }
        } else {
          report.retainedCount += 1;
          report.details.push({
            studentId: student.id,
            name: student.name,
            fromClass: student.gradeLevel,
            toClass: student.gradeLevel,
            gpa: student.gpa,
            status: 'Retained'
          });
          return student;
        }
      });
    });

    return report;
  };

  const clearAllClassesAndSubjects = () => {
    setClassrooms([]);
    setSubjects([]);
    localStorage.setItem('sms_classrooms', JSON.stringify([]));
    localStorage.setItem('sms_subjects', JSON.stringify([]));
  };

  const resetDataToDefault = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setSubjects(INITIAL_SUBJECTS);
    setClassrooms(INITIAL_CLASSROOMS);
    setFeeRecords(INITIAL_FEE_RECORDS);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setNotices(INITIAL_NOTICES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setCurrentTerm('Third Term (Term 3)');
  };

  return (
    <SchoolDataContext.Provider
      value={{
        students,
        teachers,
        subjects,
        classrooms,
        feeRecords,
        grades,
        attendance,
        notices,
        assignments,
        timetable,
        expenses,
        incomes,
        departmentBudgets,
        currentAcademicYear,
        setCurrentAcademicYear,
        availableAcademicYears,
        addAcademicYear,
        currentTerm,
        setCurrentTerm: handleSetCurrentTerm,
        termConfig,
        setTermConfig,
        isTermLocked,
        toggleTermLock,
        setTermDates: () => {},
        addExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        addOrUpdateDepartmentBudget,
        deleteDepartmentBudget,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addAdministrator,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addSubject,
        updateSubject,
        deleteSubject,
        recordPayment,
        deleteFeeRecord,
        prepareNextTermFeeBill,
        updateGrade,
        addGrade,
        deleteGrade,
        markAttendance,
        addNotice,
        deleteNotice,
        addAssignment,
        updateAssignmentStatus,
        deleteAssignment,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        promoteClassStudents,
        userCredentials,
        updateUserPassword,
        clearAllClassesAndSubjects,
        resetDataToDefault
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) throw new Error('useSchoolData must be used within SchoolDataProvider');
  return context;
};
