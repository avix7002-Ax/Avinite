import { lazy, Suspense, useState, useCallback, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { useIntro } from '@/hooks/useIntro';
import { LandingNav, Footer } from '@/components/LandingNav';
import { ProtectedRoute } from '@/components/AppLayout';
import { LoadingPage } from '@/components/ui/Spinner';
import { WelcomeIntro } from '@/components/WelcomeIntro';

// Lazy-load all pages for code-splitting
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/pages/SignupPage').then(m => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const PracticePage = lazy(() => import('@/pages/PracticePage').then(m => ({ default: m.PracticePage })));
const DoubtSolverPage = lazy(() => import('@/pages/DoubtSolverPage').then(m => ({ default: m.DoubtSolverPage })));
const RevisionPage = lazy(() => import('@/pages/RevisionPage').then(m => ({ default: m.RevisionPage })));
const MockTestPage = lazy(() => import('@/pages/MockTestPage').then(m => ({ default: m.MockTestPage })));
const StudyPlannerPage = lazy(() => import('@/pages/StudyPlannerPage').then(m => ({ default: m.StudyPlannerPage })));
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const TrendsPage = lazy(() => import('@/pages/TrendsPage').then(m => ({ default: m.TrendsPage })));
const PYQSeriesPage = lazy(() => import('@/pages/PYQSeriesPage').then(m => ({ default: m.PYQSeriesPage })));
const AvixAIPage = lazy(() => import('@/pages/AvixAIPage').then(m => ({ default: m.AvixAIPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));

function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <a href="/" className="text-primary hover:underline">Go back home</a>
    </div>
  );
}

function AppContent() {
  const { hasPlayedIntro, markIntroPlayed } = useIntro();
  const [showIntro, setShowIntro] = useState(() => !hasPlayedIntro());

  const handleIntroComplete = useCallback(() => {
    markIntroPlayed();
    setShowIntro(false);
  }, [markIntroPlayed]);

  if (showIntro) {
    return <WelcomeIntro onComplete={handleIntroComplete} />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route
            path="/"
            element={
              <LandingLayout>
                <LandingPage />
              </LandingLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doubt-solver"
            element={
              <ProtectedRoute>
                <DoubtSolverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revision"
            element={
              <ProtectedRoute>
                <RevisionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mock-test"
            element={
              <ProtectedRoute>
                <MockTestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-planner"
            element={
              <ProtectedRoute>
                <StudyPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trends"
            element={
              <ProtectedRoute>
                <TrendsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pyq-series"
            element={
              <ProtectedRoute>
                <PYQSeriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/avinex-ai"
            element={
              <ProtectedRoute>
                <AvixAIPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
