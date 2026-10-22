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

    // Check credentials (accept demo or valid format)
    if (!identifier || !password) {
      throw new Error("400 Bad Request: Patient ID/Email and password are required.");
    }

    if (password.length < 6) {
      throw new Error("400 Bad Request: Password must be at least 6 characters.");
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

    return {
      status: 200,
      token,
      user,
      message: "Login successful"
    };
  },

  async logout() {
    await delay(200);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { status: 200, message: "Logged out successfully" };
  },

  async getCurrentUser() {
    await delay(150);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return null;
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  // ==========================================
  // DOCTOR APIs (GET /doctors, GET /doctors/:id)
  // ==========================================
  async getDoctors(filters = {}) {
    await delay(300);
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

    return list;
  },

  async getDoctorById(id) {
    await delay(250);
    const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    const list = stored ? JSON.parse(stored) : INITIAL_DOCTORS;
    const doctor = list.find((doc) => String(doc.id) === String(id));
    if (!doctor) {
      throw new Error(`404 Not Found: Doctor with ID ${id} not found.`);
    }
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
    // Protected API
    verifyAuth(authToken);
    const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return stored ? JSON.parse(stored) : INITIAL_APPOINTMENTS;
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
    return newAppointment;
  },

  async rescheduleAppointment(id, { appointmentDate, timeSlot }, authToken) {
    await delay(350);
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
