// App.jsx
// Main Application Routing & Providers
// Fulfills Experiment 1, 2, 3, 4:
// - Context Providers: AuthProvider, AppointmentProvider
// - React Router with dynamic routes (/doctor/:id, /appointment/:id)
// - Nested routes under /patient with <Outlet />
// - Protected routes: /patient, /appointments, /book-appointment, /appointment/:id
// - ErrorBoundary wrapping
// - Lazy loading & code splitting (React.lazy & Suspense) for route-level components

import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";

// Immediate components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import StudentBadge from "./components/layout/StudentBadge";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Loading from "./components/common/Loading";

// Code Splitting / Lazy Loading Route Components (Page 12 Experiment 2: Lazy Loading)
const Home = lazy(() => import("./pages/Home"));
const DoctorList = lazy(() => import("./pages/DoctorList"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const AppointmentBooking = lazy(() => import("./pages/AppointmentBooking"));
const AppointmentDetails = lazy(() => import("./pages/AppointmentDetails"));
const AppointmentHistoryPage = lazy(() => import("./pages/AppointmentHistoryPage"));
const Login = lazy(() => import("./pages/Login"));

// Nested Patient Dashboard Components
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientAppointments = lazy(() => import("./pages/patient/PatientAppointments"));
const PatientUpcoming = lazy(() => import("./pages/patient/PatientUpcoming"));
const PatientHistory = lazy(() => import("./pages/patient/PatientHistory"));
const PatientProfileTab = lazy(() => import("./pages/patient/PatientProfileTab"));

export const App = () => {
  const [labModalOpen, setLabModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppointmentProvider>
          <BrowserRouter>
            <div className="app-root-layout">
              {/* Global Header */}
              <Header onOpenLabModal={() => setLabModalOpen(true)} />

              {/* Main Routed Content wrapped in Suspense for Lazy Loading */}
              <div className="app-main-content">
                <Suspense
                  fallback={
                    <Loading fullPage message="Loading MediCare Plus hospital view..." />
                  }
                >
                  <Routes>
                    {/* Experiment 3a Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<DoctorList />} />
                    <Route path="/doctor/:id" element={<DoctorProfile />} />
                    <Route path="/login" element={<Login />} />

                    {/* Experiment 4c Protected Routes */}
                    <Route
                      path="/book-appointment"
                      element={
                        <ProtectedRoute>
                          <AppointmentBooking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointments"
                      element={
                        <ProtectedRoute>
                          <AppointmentHistoryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/appointment/:id"
                      element={
                        <ProtectedRoute>
                          <AppointmentDetails />
                        </ProtectedRoute>
                      }
                    />

                    {/* Experiment 3e & 3f: Nested Routing for Patient Dashboard with Outlet */}
                    <Route
                      path="/patient"
                      element={
                        <ProtectedRoute>
                          <PatientDashboard />
                        </ProtectedRoute>
                      }
                    >
                      {/* Default redirect to /patient/appointments */}
                      <Route index element={<Navigate to="/patient/appointments" replace />} />
                      <Route path="appointments" element={<PatientAppointments />} />
                      <Route path="upcoming" element={<PatientUpcoming />} />
                      <Route path="history" element={<PatientHistory />} />
                      <Route path="profile" element={<PatientProfileTab />} />
                    </Route>

                    {/* 404 Fallback */}
                    <Route
                      path="*"
                      element={
                        <div className="container not-found-view">
                          <h2>404 - Page Not Found</h2>
                          <p>The hospital resource you requested does not exist.</p>
                          <Navigate to="/" replace />
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>

              {/* Global Footer */}
              <Footer />

              {/* Academic Assessment & Experiment Hub Modal */}
              <StudentBadge isOpen={labModalOpen} onClose={() => setLabModalOpen(false)} />
            </div>
          </BrowserRouter>
        </AppointmentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
