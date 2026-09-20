import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

import { SearchModal } from './components/search/SearchModal';

// Auth Views
import { LoginPage } from './views/auth/LoginPage';
import { RegisterPage } from './views/auth/RegisterPage';
import { ForgotPasswordPage } from './views/auth/ForgotPasswordPage';

// Public Views
import { LandingPage } from './views/public/LandingPage';
import { FeaturesPage } from './views/public/FeaturesPage';
import { PricingPage } from './views/public/PricingPage';
import { MarketplacePage } from './views/public/MarketplacePage';

// Teacher Views
import { TeacherDashboard } from './views/teacher/TeacherDashboard';
import { RecordingStudio } from './views/teacher/RecordingStudio';
import { LessonWorkspace } from './views/teacher/LessonWorkspace';
import { ClassManager } from './views/teacher/ClassManager';
import { StudentRoster } from './views/teacher/StudentRoster';
import { TeacherFinancials } from './views/teacher/TeacherFinancials';
import { AIProcessingScreen } from './views/teacher/AIProcessingScreen';

// Student Views
import { StudentDashboard } from './views/student/StudentDashboard';
import { StudentCoursesView } from './views/student/StudentCoursesView';
import { StudentLessonView } from './views/student/StudentLessonView';
import { StudentQuizView } from './views/student/StudentQuizView';
import { StudentHomeworkView } from './views/student/StudentHomeworkView';
import { ExamTakingView } from './views/student/ExamTakingView';
import { StudentSmartLectureView } from './views/student/StudentSmartLectureView';
import { StudentConvertedLecturesView } from './views/student/StudentConvertedLecturesView';
import { StudentRevisionView } from './views/student/StudentRevisionView';
import { StudentLeagueView } from './views/student/StudentLeagueView';
import { StudentAnalyticsView } from './views/student/StudentAnalyticsView';
import { StudentGamificationView } from './views/student/StudentGamificationView';
import { StudentCertificatesView } from './views/student/StudentCertificatesView';
import { StudentBillingView } from './views/student/StudentBillingView';
import { WeakAreasHub } from './views/student/WeakAreasHub';

// Parent Views
import { ParentDashboard } from './views/parent/ParentDashboard';

// Center Views
import { CenterDashboard } from './views/center/CenterDashboard';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 76;

// Shell layout component — proper fixed-sidebar architecture
function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRouterNavigator } = useAuth();
  const { isRtl } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (setRouterNavigator) {
      setRouterNavigator(() => navigate);
    }
  }, [navigate, setRouterNavigator]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const fullPageRoutes = [
    '/',
    '/features',
    '/pricing',
    '/marketplace',
    '/login',
    '/register',
    '/forgot-password',
    '/teacher/processing'
  ];

  const authRoutes = ['/login', '/register', '/forgot-password'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isFullPage = fullPageRoutes.includes(location.pathname);
  const hasSidebar = !isFullPage && !isAuthRoute;

  // Sidebar pixel width (used for margin offset)
  const sidebarWidth = hasSidebar ? (sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED) : 0;

  return (
    <div
      className="app-root"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* Fixed Sidebar — only in dashboard layouts */}
      {hasSidebar && (
        <Sidebar
          mobileSidebarOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      )}

      {/* Main content area — dynamically offset by sidebar width on desktop for both RTL and LTR */}
      <div
        className="app-content-wrapper"
        style={{
          marginRight: isRtl ? `${sidebarWidth}px` : 0,
          marginLeft: !isRtl ? `${sidebarWidth}px` : 0,
          transition: 'margin-right 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Navbar */}
        {!isAuthRoute && (
          <Navbar
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            isFullPage={isFullPage}
            hasSidebar={hasSidebar}
          />
        )}

        {/* Page content */}
        {isFullPage ? (
          <main style={{ flex: 1 }}>
            {children}
          </main>
        ) : (
          <main
            className="app-main-content"
            style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}
          >
            {/* Mobile menu button — only on dashboard pages */}
            {hasSidebar && (
              <button
                className="mobile-sidebar-toggle"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="فتح القائمة"
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: '20px',
                  zIndex: 997,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(21, 136, 199, 0.35)',
                  cursor: 'pointer'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}

            {/* Mobile sidebar backdrop */}
            {mobileSidebarOpen && (
              <div
                onClick={() => setMobileSidebarOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  zIndex: 998,
                  backdropFilter: 'blur(3px)'
                }}
              />
            )}

            {children}
          </main>
        )}
      </div>

      {/* Global Universal Search (Ctrl+K) */}
      <SearchModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                {/* Public & Website Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Teacher Routes */}
                <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/studio" element={<RecordingStudio />} />
                <Route path="/teacher/workspace" element={<LessonWorkspace />} />
                <Route path="/teacher/classes" element={<ClassManager />} />
                <Route path="/teacher/students" element={<StudentRoster />} />
                <Route path="/teacher/financials" element={<TeacherFinancials />} />
                <Route path="/teacher/processing" element={<AIProcessingScreen />} />

                {/* Student Routes */}
                <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<StudentCoursesView />} />
                <Route path="/student/lesson" element={<StudentLessonView />} />
                <Route path="/student/quiz" element={<StudentQuizView />} />
                <Route path="/student/homework" element={<StudentHomeworkView />} />
                <Route path="/student/exam" element={<ExamTakingView />} />
                <Route path="/student/smart-lecture" element={<StudentSmartLectureView />} />
                <Route path="/student/converted-lectures" element={<StudentConvertedLecturesView />} />
                <Route path="/student/revision" element={<StudentRevisionView />} />
                <Route path="/student/league" element={<StudentLeagueView />} />
                <Route path="/student/analytics" element={<Navigate to="/student/league" replace />} />
                <Route path="/student/gamification" element={<StudentGamificationView />} />
                <Route path="/student/certificates" element={<StudentCertificatesView />} />
                <Route path="/student/billing" element={<StudentBillingView />} />
                <Route path="/student/weak-areas" element={<WeakAreasHub />} />

                {/* Parent Portal Route */}
                <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
                <Route path="/parent/dashboard" element={<ParentDashboard />} />

                {/* Center Portal Route */}
                <Route path="/center" element={<Navigate to="/center/dashboard" replace />} />
                <Route path="/center/dashboard" element={<CenterDashboard />} />

                {/* Admin Portal Route */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
