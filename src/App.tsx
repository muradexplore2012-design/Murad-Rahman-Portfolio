import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Code-split admin routes so public visitors load a lean bundle
const AdminLoginPage = lazy(() =>
  import('./features/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminRouteGuard = lazy(() =>
  import('./features/admin/AdminRouteGuard').then((m) => ({ default: m.AdminRouteGuard }))
);
const AdminLayout = lazy(() =>
  import('./features/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = lazy(() =>
  import('./features/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProfile = lazy(() =>
  import('./features/admin/AdminProfile').then((m) => ({ default: m.AdminProfile }))
);
const AdminProjects = lazy(() =>
  import('./features/admin/AdminProjects').then((m) => ({ default: m.AdminProjects }))
);
const AdminServices = lazy(() =>
  import('./features/admin/AdminServices').then((m) => ({ default: m.AdminServices }))
);
const AdminSkills = lazy(() =>
  import('./features/admin/AdminSkills').then((m) => ({ default: m.AdminSkills }))
);
const AdminTestimonials = lazy(() =>
  import('./features/admin/AdminTestimonials').then((m) => ({ default: m.AdminTestimonials }))
);
const AdminInbox = lazy(() =>
  import('./features/admin/AdminInbox').then((m) => ({ default: m.AdminInbox }))
);
const AdminSettings = lazy(() =>
  import('./features/admin/AdminSettings').then((m) => ({ default: m.AdminSettings }))
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-800">
    <div className="w-10 h-10 border-4 border-sky-500/20 border-t-[#0284c7] rounded-full animate-spin mb-4" />
    <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
      লোড হচ্ছে...
    </p>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<HomePage />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />

        {/* Protected Admin CMS */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminRouteGuard />
            </Suspense>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
