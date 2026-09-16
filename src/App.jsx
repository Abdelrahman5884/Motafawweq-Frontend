import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Menu } from 'lucide-react';

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
import { StudentLessonView } from './views/student/StudentLessonView';
import { ExamTakingView } from './views/student/ExamTakingView';
import { WeakAreasHub } from './views/student/WeakAreasHub';

// Parent Views
import { ParentDashboard } from './views/parent/ParentDashboard';

// Center Views
import { CenterDashboard } from './views/center/CenterDashboard';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';

// Shell layout component
function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRouterNavigator } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  return (
    <div
      className="app-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {!isAuthRoute && <Navbar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} isFullPage={isFullPage} />}

      {isFullPage ? (
        <main style={{ flex: 1 }}>
          {children}
        </main>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - var(--topbar-height))', position: 'relative' }}>
          {/* Mobile Sidebar Backdrop Overlay */}
          {mobileSidebarOpen && (
            <div
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 998,
                backdropFilter: 'blur(2px)'
              }}
            />
          )}
          <Sidebar mobileSidebarOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          <main
            className="app-main-content"
            style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}
          >
            {/* Mobile Sidebar Toggle Button - only in dashboard pages */}
            <button
              className="mobile-sidebar-toggle"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
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
                boxShadow: '0 8px 24px rgba(108,77,255,0.5)',
                cursor: 'pointer'
              }}
            >
              <Menu size={22} />
            </button>
            {children}
          </main>
        </div>
      )}

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
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/studio" element={<RecordingStudio />} />
                <Route path="/teacher/workspace" element={<LessonWorkspace />} />
                <Route path="/teacher/classes" element={<ClassManager />} />
                <Route path="/teacher/students" element={<StudentRoster />} />
                <Route path="/teacher/financials" element={<TeacherFinancials />} />
                <Route path="/teacher/processing" element={<AIProcessingScreen />} />

                {/* Student Routes */}
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/lesson" element={<StudentLessonView />} />
                <Route path="/student/exam" element={<ExamTakingView />} />
                <Route path="/student/weak-areas" element={<WeakAreasHub />} />

                {/* Parent Portal Route */}
                <Route path="/parent/dashboard" element={<ParentDashboard />} />

                {/* Center Portal Route */}
                <Route path="/center/dashboard" element={<CenterDashboard />} />

                {/* Admin Portal Route */}
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
