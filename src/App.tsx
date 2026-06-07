import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { QueryProvider } from "@/providers/QueryProvider"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { I18nProvider } from "@/providers/I18nProvider"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute } from "@/components/shared/ProtectedRoute"
import { LoadingScreen } from "@/components/shared/LoadingScreen"

const HomePage = lazy(() => import("@/pages/home/HomePage"))
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"))
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"))
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"))
const ProfilePage = lazy(() => import("@/pages/auth/ProfilePage"))
const EventsListPage = lazy(() => import("@/pages/events/EventsListPage"))
const CreateEventPage = lazy(() => import("@/pages/events/CreateEventPage"))
const EventDetailPage = lazy(() => import("@/pages/events/EventDetailPage"))
const SearchPage = lazy(() => import("@/pages/search/SearchPage"))
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

export default function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <BrowserRouter>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="events" element={<EventsListPage />} />
                      <Route path="event/:code" element={<EventDetailPage />} />
                      <Route path="search" element={<SearchPage />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="events/create" element={<CreateEventPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                      </Route>
                    </Route>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryProvider>
    </HelmetProvider>
  )
}
