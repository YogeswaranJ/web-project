// Simulated REST API Service for Hospital Appointment Booking
// Implements full REST CRUD operations: GET, POST, PUT/PATCH, DELETE
// Supports Bearer Auth Token verification, async/await latency, and error states

import { INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_PATIENT } from "../data/initialDoctors";

const STORAGE_KEYS = {
  DOCTORS: "medicare_doctors_db",
  APPOINTMENTS: "medicare_appointments_db",
  TOKEN: "medicare_auth_token",
  USER: "medicare_auth_user"
};

// Helper: Simulate network latency for async/await
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Styled console logger for API activity
const logAPI = (method, endpoint, data = null, response = null, isError = false) => {
  const color = isError ? "#ff4d4f" : method === "GET" ? "#52c41a" : method === "POST" ? "#1890ff" : method === "PUT" ? "#fa8c16" : "#f5222d";
  const icon = isError ? "❌" : method === "GET" ? "📥" : method === "POST" ? "📤" : method === "PUT" ? "🔄" : "🗑️";
  console.groupCollapsed(
    `%c ${icon} ${method} %c ${endpoint} %c ${new Date().toLocaleTimeString()}`,
    `background:${color};color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold`,
    `color:${color};font-weight:bold`,
    `color:#888;font-size:10px`
  );
  if (data) console.log("%c Request:", "color:#aaa;font-weight:bold", data);
  if (response && !isError) console.log("%c Response:", "color:#52c41a;font-weight:bold", response);
  if (isError) console.log("%c Error:", "color:#ff4d4f;font-weight:bold", response);
  console.groupEnd();
};

// Helper: Initialize localStorage DB if empty
const initDB = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
};

initDB();

/**
 * Helper to get authorization token from header / storage
 */
const verifyAuth = (authToken) => {
  const token = authToken || localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (!token) {
    throw new Error("401 Unauthorized: No authentication token provided. Please log in.");
  }
  if (token === "expired_token_test") {
    throw new Error("401 Unauthorized: Authentication token has expired. Please log in again.");
  }
  return true;
};

export const api = {
  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================
  async login(credentials) {
    await delay(400);
    const { identifier, password } = credentials;
    logAPI("POST", "/auth/login", { identifier, password: "***" });

    // Check credentials (accept demo or valid format)
    if (!identifier || !password) {
      const err = "400 Bad Request: Patient ID/Email and password are required.";
      logAPI("POST", "/auth/login", null, err, true);
      throw new Error(err);
    }

    if (password.length < 6) {
      const err = "400 Bad Request: Password must be at least 6 characters.";
      logAPI("POST", "/auth/login", null, err, true);
      throw new Error(err);
    }

    // Generate mock JWT-like token
    const token = `jwt_mock_${btoa(identifier)}_${Date.now()}`;
    const user = {
      ...INITIAL_PATIENT,
      email: identifier.includes("@") ? identifier : INITIAL_PATIENT.email,
      id: identifier.startsWith("PID-") ? identifier : INITIAL_PATIENT.id
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    const result = { status: 200, token, user, message: "Login successful" };
    logAPI("POST", "/auth/login", null, result);
    return result;
  },

  async logout() {
    await delay(200);
    logAPI("DELETE", "/auth/logout");
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    const result = { status: 200, message: "Logged out successfully" };
    logAPI("DELETE", "/auth/logout", null, result);
    return result;
  },

  async getCurrentUser() {
    await delay(150);
    logAPI("GET", "/auth/me");
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      logAPI("GET", "/auth/me", null, "No token found — unauthenticated", true);
      return null;
    }
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? JSON.parse(userStr) : null;
    logAPI("GET", "/auth/me", null, user);
    return user;
  },

  // ==========================================
  // DOCTOR APIs (GET /doctors, GET /doctors/:id)
  // ==========================================
  async getDoctors(filters = {}) {
    await delay(300);
    logAPI("GET", "/doctors", filters);
    const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    let list = stored ? JSON.parse(stored) : INITIAL_DOCTORS;

    // Apply search query (name, specialty, qualification)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.qualification.toLowerCase().includes(q)
      );
    }

    // Specialty filter
    if (filters.specialty && filters.specialty !== "All Specialties") {
      list = list.filter((doc) => doc.specialty === filters.specialty);
    }

    // Min rating filter
    if (filters.minRating) {
      list = list.filter((doc) => doc.rating >= Number(filters.minRating));
    }

    // Max fee filter
    if (filters.maxFee) {
      list = list.filter((doc) => doc.consultationFee <= Number(filters.maxFee));
    }

    // Day filter
    if (filters.availableDay && filters.availableDay !== "Any") {
      list = list.filter((doc) => doc.availableDays.includes(filters.availableDay));
    }

    logAPI("GET", "/doctors", null, `${list.length} doctors returned`);
    return list;
  },

  async getDoctorById(id) {
    await delay(250);
    logAPI("GET", `/doctors/${id}`);
    const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    const list = stored ? JSON.parse(stored) : INITIAL_DOCTORS;
    const doctor = list.find((doc) => String(doc.id) === String(id));
    if (!doctor) {
      logAPI("GET", `/doctors/${id}`, null, `Doctor ${id} not found`, true);
      throw new Error(`404 Not Found: Doctor with ID ${id} not found.`);
    }
    logAPI("GET", `/doctors/${id}`, null, doctor);
    return doctor;
  },

  async getAvailableSlots(doctorId, date) {
    await delay(200);
    const doctor = await this.getDoctorById(doctorId);
    const appointments = await this.getAppointments();

    // Check which slots for this date and doctor are already booked
    const bookedSlots = appointments
      .filter(
        (apt) =>
          String(apt.doctorId) === String(doctorId) &&
          apt.appointmentDate === date &&
          apt.status !== "Cancelled"
      )
      .map((apt) => apt.timeSlot);

    // Return slots with booked flag
    return doctor.availableTimeSlots.map((slot) => ({
      slot,
      isBooked: bookedSlots.includes(slot)
    }));
  },

  // ==========================================
  // APPOINTMENT CRUD APIs (GET, POST, PUT/PATCH, DELETE)
  // ==========================================
  async getAppointments(authToken) {
    await delay(300);
    logAPI("GET", "/appointments");
    // Protected API
    verifyAuth(authToken);
    const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    const list = stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
    logAPI("GET", "/appointments", null, `${list.length} appointments returned`);
    return list;
  },

  async getAppointmentById(id, authToken) {
    await delay(200);
    verifyAuth(authToken);
    const list = await this.getAppointments(authToken);
    const item = list.find((apt) => String(apt.id) === String(id));
    if (!item) {
      throw new Error(`404 Not Found: Appointment ${id} not found.`);
    }
    return item;
  },

  async createAppointment(appointmentData, authToken) {
    await delay(450);
    logAPI("POST", "/appointments", appointmentData);
    verifyAuth(authToken);

    if (!appointmentData.doctorId) throw new Error("Doctor is required");
    if (!appointmentData.appointmentDate) throw new Error("Appointment date is required");
    if (!appointmentData.timeSlot) throw new Error("Time slot is required");
    if (!appointmentData.patientName) throw new Error("Patient name is required");

    const appointments = await this.getAppointments(authToken);

    const newAppointment = {
      ...appointmentData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Upcoming",
      duration: appointmentData.duration || "30 mins",
      createdAt: new Date().toISOString()
    };

    const updated = [newAppointment, ...appointments];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    logAPI("POST", "/appointments", null, newAppointment);
    return newAppointment;
  },

  async rescheduleAppointment(id, { appointmentDate, timeSlot }, authToken) {
    await delay(350);
    logAPI("PUT", `/appointments/${id}/reschedule`, { appointmentDate, timeSlot });
    verifyAuth(authToken);

    if (!appointmentDate || !timeSlot) {
      throw new Error("Both new appointment date and time slot are required for rescheduling.");
    }

    const appointments = await this.getAppointments(authToken);
    const index = appointments.findIndex((apt) => String(apt.id) === String(id));
    if (index === -1) {
      throw new Error(`Appointment ${id} not found.`);
    }

    const updatedAppointment = {
      ...appointments[index],
      appointmentDate,
      timeSlot,
      status: "Rescheduled",
      updatedAt: new Date().toISOString()
    };

    appointments[index] = updatedAppointment;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return updatedAppointment;
  },

  async cancelAppointment(id, authToken) {
    await delay(300);
    logAPI("DELETE", `/appointments/${id}/cancel`);
    verifyAuth(authToken);

    const appointments = await this.getAppointments(authToken);
    const index = appointments.findIndex((apt) => String(apt.id) === String(id));
    if (index === -1) {
      throw new Error(`Appointment ${id} not found.`);
    }

    const cancelledAppointment = {
      ...appointments[index],
      status: "Cancelled",
      cancelledAt: new Date().toISOString()
    };

    appointments[index] = cancelledAppointment;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return cancelledAppointment;
  },

  async deleteAppointmentPermanently(id, authToken) {
    await delay(300);
    verifyAuth(authToken);

    const appointments = await this.getAppointments(authToken);
    const filtered = appointments.filter((apt) => String(apt.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
    return { success: true, message: `Appointment ${id} deleted successfully.` };
  }
};
