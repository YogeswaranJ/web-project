import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../api/mockApi';
import { INITIAL_DOCTORS } from '../data/initialDoctors';

describe('Experiment 3 (Part e): Doctor Search & Appointment Verification', () => {
  const mockToken = 'mock-jwt-token-patient-8841';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Doctor Search & Filtering Verification', () => {
    it('should successfully fetch all available doctors from the API', async () => {
      const doctors = await api.getDoctors();
      expect(doctors).toBeDefined();
      expect(doctors.length).toBeGreaterThan(0);
      expect(doctors.length).toBe(INITIAL_DOCTORS.length);
    });

    it('should filter doctors by name accurately (e.g. searching "Sharma")', async () => {
      const doctors = await api.getDoctors({ search: 'Sharma' });
      expect(doctors.length).toBeGreaterThanOrEqual(1);
      expect(doctors.some(d => d.name.includes('Sharma'))).toBe(true);
    });

    it('should filter doctors by medical specialty (e.g. "Cardiology")', async () => {
      const doctors = await api.getDoctors({ specialty: 'Cardiology' });
      expect(doctors.length).toBeGreaterThan(0);
      doctors.forEach(doctor => {
        expect(doctor.specialty).toBe('Cardiology');
      });
    });

    it('should filter doctors by maximum fee threshold', async () => {
      const maxFeeLimit = 800;
      const filtered = await api.getDoctors({ maxFee: maxFeeLimit });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doctor => {
        expect(doctor.consultationFee).toBeLessThanOrEqual(maxFeeLimit);
      });
    });

    it('should filter doctors by minimum star rating', async () => {
      const minRating = 4.8;
      const filtered = await api.getDoctors({ minRating });
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(doctor => {
        expect(doctor.rating).toBeGreaterThanOrEqual(minRating);
      });
    });

    it('should return empty list when no doctor matches query (triggers "No doctors available")', async () => {
      const doctors = await api.getDoctors({ search: 'NonExistentDoctorXYZ123' });
      expect(doctors.length).toBe(0);
    });

    it('should fetch single doctor profile details by ID', async () => {
      const doctorId = 101;
      const doctor = await api.getDoctorById(doctorId);
      expect(doctor).toBeDefined();
      expect(String(doctor.id)).toBe(String(doctorId));
      expect(doctor.name).toBe('Dr. Arvind Sharma');
      expect(doctor.specialty).toBe('Cardiology');
    });
  });

  describe('2. Appointment Booking & Management Verification', () => {
    it('should create and book a new consultation appointment', async () => {
      const newAppointmentPayload = {
        doctorId: "101",
        doctorName: 'Dr. Rajesh Sharma',
        specialty: 'Cardiology',
        patientName: 'Rahul Verma',
        patientEmail: 'rahul.verma@example.com',
        patientPhone: '9876543210',
        patientId: 'PID-2024-8841',
        appointmentDate: '2026-10-25',
        timeSlot: '10:00 AM',
        symptoms: 'Mild chest heaviness and palpitations during morning walks.',
        consultationFee: 800
      };

      const createdAppointment = await api.createAppointment(newAppointmentPayload, mockToken);
      expect(createdAppointment).toBeDefined();
      expect(createdAppointment.id).toBeDefined();
      expect(createdAppointment.status).toBe('Upcoming');
      expect(createdAppointment.doctorName).toBe('Dr. Rajesh Sharma');
      expect(createdAppointment.patientName).toBe('Rahul Verma');
      expect(createdAppointment.appointmentDate).toBe('2026-10-25');
      expect(createdAppointment.timeSlot).toBe('10:00 AM');
    });

    it('should retrieve patient appointment list with Bearer token authentication', async () => {
      const appointments = await api.getAppointments(mockToken);
      expect(Array.isArray(appointments)).toBe(true);
      expect(appointments.length).toBeGreaterThan(0);
    });

    it('should reschedule an existing appointment to a new date and time slot', async () => {
      const appointments = await api.getAppointments(mockToken);
      const targetAppointment = appointments[0];
      const newDate = '2026-11-05';
      const newTimeSlot = '03:30 PM';

      const updated = await api.rescheduleAppointment(
        targetAppointment.id,
        { appointmentDate: newDate, timeSlot: newTimeSlot },
        mockToken
      );

      expect(updated.id).toBe(targetAppointment.id);
      expect(updated.appointmentDate).toBe(newDate);
      expect(updated.timeSlot).toBe(newTimeSlot);
      expect(updated.status).toBe('Rescheduled');
    });

    it('should cancel an appointment and update status to "Cancelled"', async () => {
      const appointments = await api.getAppointments(mockToken);
      const targetAppointment = appointments[0];

      const cancelled = await api.cancelAppointment(targetAppointment.id, mockToken);
      expect(cancelled.id).toBe(targetAppointment.id);
      expect(cancelled.status).toBe('Cancelled');
    });

    it('should reject unauthenticated appointment creation when token is missing', async () => {
      const payload = {
        doctorId: "102",
        appointmentDate: '2026-10-25',
        timeSlot: '11:00 AM',
        patientName: 'Anonymous'
      };

      await expect(api.createAppointment(payload, null)).rejects.toThrow('Unauthorized');
    });
  });
});
