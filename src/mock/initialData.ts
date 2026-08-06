import { Student, Teacher, Subject, Classroom, FeeRecord, GradeEntry, AttendanceRecord, Notice, Assignment, TimetableSlot, ExpenseRecord, IncomeRecord, UserCredentialItem } from '../types';
import { GHANA_CLASS_HIERARCHY } from '../constants/ghanaEducation';

// Fresh Blank Production State: 0 Staff Members
export const INITIAL_TEACHERS: Teacher[] = [];

// Fresh Blank Production State: 13 Classrooms ready for student enrollment
export const INITIAL_CLASSROOMS: Classroom[] = GHANA_CLASS_HIERARCHY.map((className, idx) => ({
  id: `cls-${idx + 1}`,
  name: className,
  gradeLevel: className,
  capacity: className.startsWith('JHS') ? 40 : 35,
  enrolledCount: 0,
  classTeacherId: '',
  classTeacherName: 'Unassigned'
}));

// Fresh Blank Production State: 0 Students
export const INITIAL_STUDENTS: Student[] = [];

// Fresh Blank Production State: 0 Fee Records
export const INITIAL_FEE_RECORDS: FeeRecord[] = [];

// Fresh Blank Production State: Standard Ghanaian GES Curriculum Subjects
export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'subj-1', code: 'ENG', name: 'English Language', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 5, credits: 4 },
  { id: 'subj-2', code: 'MATH', name: 'Core Mathematics', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 5, credits: 4 },
  { id: 'subj-3', code: 'SCI', name: 'Integrated / Natural Science', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 4, credits: 3 },
  { id: 'subj-4', code: 'SOC', name: 'Social Studies / OWOP', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 4, credits: 3 },
  { id: 'subj-5', code: 'RME', name: 'Religious & Moral Education (RME)', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 3, credits: 2 },
  { id: 'subj-6', code: 'TWI', name: 'Ghanaian Language (Twi)', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 3, credits: 2 },
  { id: 'subj-7', code: 'ICT', name: 'Computing / ICT', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 3, credits: 2 },
  { id: 'subj-8', code: 'ARTS', name: 'Creative Arts & Design', gradeLevel: 'All Classes', teacherId: '', teacherName: 'Unassigned', weeklyHours: 3, credits: 2 },
  { id: 'subj-9', code: 'CAREER', name: 'Career Technology', gradeLevel: 'JHS 1 - JHS 3', teacherId: '', teacherName: 'Unassigned', weeklyHours: 3, credits: 2 }
];

// Fresh Blank Production State: 0 Grade Entries
export const INITIAL_GRADES: GradeEntry[] = [];

// Fresh Blank Production State: 0 Attendance Records
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

// Fresh Blank Production State: 0 Notices
export const INITIAL_NOTICES: Notice[] = [];

// Fresh Blank Production State: 0 Assignments
export const INITIAL_ASSIGNMENTS: Assignment[] = [];

// Fresh Blank Production State: 0 Timetable Slots
export const INITIAL_TIMETABLE: TimetableSlot[] = [];

// Fresh Blank Production State: 0 Expense Records
export const INITIAL_EXPENSES: ExpenseRecord[] = [];

// Fresh Blank Production State: 0 Income Records
export const INITIAL_INCOMES: IncomeRecord[] = [];

// Fresh Blank Production State: 0 Department Budgets
export const INITIAL_BUDGETS = [
  { department: 'Preschool Department', allocatedBudget: 0, spentAmount: 0 },
  { department: 'Lower Primary Department', allocatedBudget: 0, spentAmount: 0 },
  { department: 'Upper Primary Department', allocatedBudget: 0, spentAmount: 0 },
  { department: 'JHS Department', allocatedBudget: 0, spentAmount: 0 },
  { department: 'Administrative & Operations', allocatedBudget: 0, spentAmount: 0 }
];

// Fresh Blank Production State: Primary Administrator Login Credentials
export const INITIAL_USER_CREDENTIALS: UserCredentialItem[] = [
  {
    id: 'cred-1',
    userId: 'usr-admin-01',
    name: 'School Administrator',
    email: 'admin@kidshinemontessori.edu.gh',
    role: 'admin',
    password: 'admin123',
    associatedInfo: 'System Administrator (Bursar & Head of School)',
    lastChanged: new Date().toISOString().split('T')[0]
  }
];
