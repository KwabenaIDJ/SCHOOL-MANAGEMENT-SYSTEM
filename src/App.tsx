import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/common/LandingPage';

// Admin components
import { AdminOverview } from './components/admin/AdminOverview';
import { StudentDirectory } from './components/admin/StudentDirectory';
import { StaffDirectory } from './components/admin/StaffDirectory';
import { ClassManagement } from './components/admin/ClassManagement';
import { FeeManagement } from './components/admin/FeeManagement';
import { FinancialDashboard } from './components/admin/FinancialDashboard';
import { UserCredentialsManager } from './components/admin/UserCredentialsManager';
import { AuditLogsViewer } from './components/admin/AuditLogsViewer';

// Teacher components
import { TeacherOverview } from './components/teacher/TeacherOverview';
import { GradeEntryView } from './components/teacher/GradeEntry';
import { AttendanceTracker } from './components/teacher/AttendanceTracker';

// Parent components
import { ParentOverview } from './components/parent/ParentOverview';
import { ReportCardViewer } from './components/parent/ReportCardViewer';
import { NoticeBoard } from './components/parent/NoticeBoard';

// Student components
import { StudentOverview } from './components/student/StudentOverview';
import { AssignmentTracker } from './components/student/AssignmentTracker';
import { StudentTimetable } from './components/student/StudentTimetable';

const MainLayout: React.FC = () => {
  const { role, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Render content depending on active role & active tab
  const renderRoleContent = () => {
    switch (role) {
      case 'admin':
        switch (activeTab) {
          case 'overview':
            return <AdminOverview />;
          case 'students':
            return <StudentDirectory />;
          case 'staff':
            return <StaffDirectory />;
          case 'classes':
            return <ClassManagement />;
          case 'timetable':
            return <StudentTimetable />;
          case 'report-card':
            return <ReportCardViewer />;
          case 'fees':
            return <FeeManagement />;
          case 'finances':
            return <FinancialDashboard />;
          case 'credentials':
            return <UserCredentialsManager />;
          case 'audit-logs':
            return <AuditLogsViewer />;
          case 'notices':
            return <NoticeBoard />;
          default:
            return <AdminOverview />;
        }

      case 'teacher':
        switch (activeTab) {
          case 'overview':
            return <TeacherOverview onNavigateTab={setActiveTab} />;
          case 'grading':
            return <GradeEntryView />;
          case 'assignments':
            return <AssignmentTracker />;
          case 'attendance':
            return <AttendanceTracker />;
          case 'timetable':
            return <StudentTimetable />;
          case 'report-card':
            return <ReportCardViewer />;
          case 'notices':
            return <NoticeBoard />;
          default:
            return <TeacherOverview onNavigateTab={setActiveTab} />;
        }

      case 'parent':
        switch (activeTab) {
          case 'overview':
            return <ParentOverview onNavigateTab={setActiveTab} />;
          case 'report-card':
            return <ReportCardViewer />;
          case 'notices':
            return <NoticeBoard />;
          default:
            return <ParentOverview onNavigateTab={setActiveTab} />;
        }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderRoleContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SchoolDataProvider>
          <MainLayout />
        </SchoolDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
