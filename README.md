# 🏥 MediCare Plus - Hospital Appointment Booking Web Application
### Scenario 8: Academic Laboratory Assessment Project (Experiments 1 – 4 & REST API)

A full-stack, responsive Hospital Appointment Booking Web Application built with **React 19**, **React Router v7**, **Context API**, **Custom Hooks**, and a simulated **REST API with Bearer Token Authentication**.

---

## 🚀 Quick Start (Running on Localhost)

The project is currently running live on:
**[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**

To run or restart the development server at any time:
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start Vite local development server
npm run dev -- --host 127.0.0.1 --port 3000

# 3. Build production bundle with code splitting
npm run build
```

---

## 🔑 Demo Login Credentials

The application includes an **AuthContext** with **Protected Routes**. You can log in using either:
- **Patient ID**: `PID-2024-8841`
- **Email**: `rahul.verma@example.com`
- **Password**: `password123` *(any password >= 6 characters)*
*(Quick-fill buttons are provided on the `/login` page for one-click access).*

---

## 📋 PDF Experiment Checklist & Implementation Mapping

### 🧪 Experiment 1: React Hooks & Functional Components
* **Topics**: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, Props, Reusable Components
* **Reusable Functional Components**:
  * [`Header.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/layout/Header.jsx)
  * [`Home.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/Home.jsx)
  * [`DoctorList.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/DoctorList.jsx)
  * [`DoctorCard.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/doctor/DoctorCard.jsx)
  * [`DoctorProfile.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/DoctorProfile.jsx)
  * [`SearchBar.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/doctor/SearchBar.jsx)
  * [`FilterPanel.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/doctor/FilterPanel.jsx)
  * [`AppointmentBooking.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/AppointmentBooking.jsx)
  * [`AppointmentHistoryPage.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/AppointmentHistoryPage.jsx)
  * [`PatientProfileTab.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/patient/PatientProfileTab.jsx)
  * [`Footer.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/layout/Footer.jsx)
* **`useState`**: Manages search query, specialty, selected doctor, date/time, patient details, history, booking status.
* **`useEffect`**: Fetches doctor data on startup; recalculates available time slots when selected doctor or date changes.
* **`useRef`**: Auto-focuses the doctor search input field in [`SearchBar.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/doctor/SearchBar.jsx) and features an interactive DOM element referencing demo button.
* **`useMemo`**: Computes filtered doctors, available time slots, appointment duration, and appointment summary.
* **`useCallback`**: Reusable memoized handlers: `selectDoctor()`, `bookAppointment()`, `rescheduleAppointment()`, `cancelAppointment()`.

---

### 🧪 Experiment 2: Custom Hooks & Context API
* **Custom Hook `useDoctors()`** in [`src/hooks/useDoctors.js`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/hooks/useDoctors.js):
  * Manages doctor dataset, search query, specialty filtering, day availability, max fee slider, and minimum rating filtering.
* **Custom Hook `useAppointments()`** in [`src/hooks/useAppointments.js`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/hooks/useAppointments.js):
  * Manages appointment dates, time slots, booking status, rescheduling, cancellation, and reminders calculation.
* **`AppointmentContext`** in [`src/context/AppointmentContext.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/context/AppointmentContext.jsx):
  * Eliminates prop drilling across components.
* **Local Storage Sync (`useEffect`)**:
  * Syncs appointments to `localStorage` and computes pending appointment reminders for the notification bell.
* **Conditional Rendering Requirements**:
  * `"No doctors available"` (rendered in `DoctorList.jsx` when filters yield 0 results)
  * `"No appointments available"` (rendered in `PatientAppointments.jsx` and `PatientHistory.jsx`)
  * `"No time slots available"` (rendered in `AppointmentBooking.jsx` when a date has no remaining slots)
  * `"No upcoming appointments"` (rendered in `PatientUpcoming.jsx`)
  * `"Appointment cancelled"` (rendered in `AppointmentCard.jsx` on cancellation)

---

### 🧪 Experiment 3: React Router Navigation
* **Configured Routes** in [`src/App.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/App.jsx):
  * `/` (Home)
  * `/doctors` (Specialists Directory)
  * `/doctor/:id` (Dynamic Doctor Profile e.g. `/doctor/101`, `/doctor/102`)
  * `/book-appointment` (Multi-step Booking Process)
  * `/appointments` (Appointments Overview)
  * `/appointment/:id` (Dynamic Appointment Details & Printable OPD Receipt)
  * `/login` (Patient Authentication)
  * `/patient` (Patient Dashboard with Nested Routing)
* **`useParams()`**:
  * Implemented in [`DoctorProfile.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/DoctorProfile.jsx) to dynamically retrieve `id` (101, 102, 103...) and display doctor credentials.
  * Implemented in [`AppointmentDetails.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/AppointmentDetails.jsx) to display single appointment slips.
* **Nested Routing & `<Outlet />`**:
  * Dashboard at `/patient` renders nested child routes:
    * `/patient/appointments` (All Appointments)
    * `/patient/upcoming` (Upcoming Consultations)
    * `/patient/history` (Past/Cancelled Records)
    * `/patient/profile` (Medical Profile)
* **`useNavigate()` Flow**:
  * Step-by-step navigation: `Doctor Profile -> Date Selection -> Time Slot Selection -> Patient Details -> Appointment Summary -> Booking Confirmation`.

---

### 🧪 Experiment 4: Protected Routes, Auth & Error Handling
* **Controlled Login** in [`Login.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/pages/Login.jsx):
  * Validates Patient ID / Email and password (minimum 6 characters).
* **`AuthContext`** in [`AuthContext.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/context/AuthContext.jsx):
  * Stores auth status and JWT-like token in `localStorage`.
* **`ProtectedRoute`** in [`ProtectedRoute.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/common/ProtectedRoute.jsx):
  * Restricts access to `/patient`, `/appointments`, `/book-appointment`, and `/appointment/:id`. Redirects unauthenticated visitors to `/login` with `state={{ from: location }}` and returns them after login.
* **Form Validation**:
  * Required fields, Email regex, 10-digit Phone regex, Password length, Patient ID (`PID-XXXX`), Appointment date (cannot be in the past), and Time-slot validation.
* **`ErrorBoundary`** in [`ErrorBoundary.jsx`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/components/common/ErrorBoundary.jsx):
  * Catches unexpected React rendering errors with friendly fallback UI and reset button. Includes a "Trigger Test Error" button in the Lab Modal to demonstrate live error recovery.
* **Reusable Components**:
  * `Button`, `Input`, `DoctorCard`, `TimeSlot`, `AppointmentCard`, `ProtectedRoute`, `ErrorBoundary`, `Loading`.

---

### 🌐 Pages 9–12: REST API, CRUD & Optimization
* **Simulated REST API** in [`src/api/mockApi.js`](file:///c:/Users/yoges/OneDrive/Desktop/WEB/src/api/mockApi.js):
  * `GET /api/doctors`
  * `GET /api/doctors/:id`
  * `GET /api/appointments`
  * `POST /api/appointments`
  * `PUT /api/appointments/:id` (Rescheduling)
  * `DELETE /api/appointments/:id` (Cancellation)
  * `POST /api/auth/login` (Token issuance)
* **Bearer Token Authorization**:
  * All appointment CRUD requests require and verify the auth token header.
* **Route Code Splitting**:
  * Implemented using `React.lazy()` and `<Suspense>` in `App.jsx`.
* **Printable Receipt**:
  * Styled with `@media print` for printing clean OPD consultation slips.
