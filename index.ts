export type UserRole = 'admin' | 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  linkedStudentIds?: string[];
  assignedSubjectIds?: string[];
  classId?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  gradeLevel: string;
  status: 'Active' | 'Graduated' | 'Suspended' | 'Inactive';
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  feeBalance: number;
  totalTuition: number;
  attendancePercentage: number;
  gpa: number;
  dob: string;
  address: string;
  joinedDate: string;
  avatar: string;
}

export interface Teacher {
  id: string;
  empId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjectsAssigned: string[];
  classTeacherOf?: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  qualification: string;
  joinedDate: string;
  avatar: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  gradeLevel: string;
  teacherId: string;
  teacherName: string;
  weeklyHours: number;
  credits: number;
}

export interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
  capacity: number;
  enrolledCount: number;
  classTeacherId: string;
  classTeacherName: string;
}

export interface PaymentItem {
  id: string;
  date: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'Cash' | 'Mobile Money';
  referenceNo: string;
  receivedBy: string;
  remarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeLevel: string;
  academicTerm: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Unpaid';
  receiptNumber: string;
  paymentHistory: PaymentItem[];
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  gradeLevel: string;
  academicTerm: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  letterGrade: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'E' | 'F' | string;
  gpaPoint: number;
  teacherRemarks: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeLevel: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Event' | 'Urgent' | 'General';
  date: string;
  content: string;
  author: string;
  targetRoles: UserRole[];
  isPinned?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subjectName: string;
  gradeLevel: string;
  dueDate: string;
  totalPoints: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  description: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  subjectName: string;
  teacherName: string;
  gradeLevel: string;
}

export interface ExpenseRecord {
  id: string;
  category: 'Staff Salaries' | 'Facilities & Utilities' | 'Educational Materials' | 'ICT & Technology' | 'Maintenance & Repairs' | 'Administrative & Office' | 'Canteen & Food Supplies' | string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Mobile Money' | 'Cheque';
  referenceNo: string;
  approvedBy: string;
}

export interface IncomeRecord {
  id: string;
  category: 'School Bus & Transportation' | 'Canteen & Lunch Revenue' | 'Bookshop & Uniform Sales' | 'Excursions & Field Trips' | 'Facility Rentals & Events' | 'Donations & Grants' | string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Mobile Money' | 'Cheque';
  referenceNo: string;
  receivedBy: string;
}

export interface DepartmentBudget {
  department: string;
  allocatedBudget: number;
  spentAmount: number;
}

export interface UserCredentialItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  associatedInfo: string;
  lastChanged: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'danger';
  ipAddress?: string;
}
