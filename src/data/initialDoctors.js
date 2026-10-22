// Initial Doctor Dataset for Hospital Appointment Booking System
// Scenario 8: Hospital Appointment Booking Web Application
// Experiment 1, 2, 3: Doctor data with IDs 101, 102, 103, etc.

export const INITIAL_DOCTORS = [
  {
    id: "101",
    name: "Dr. Arvind Sharma",
    specialty: "Cardiology",
    qualification: "MBBS, MD (General Medicine), DM (Cardiology), FACC",
    experience: "15 Years",
    rating: 4.9,
    reviewsCount: 142,
    consultationFee: 800,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM",
      "09:30 AM",
      "10:30 AM",
      "11:15 AM",
      "02:00 PM",
      "03:00 PM",
      "04:30 PM"
    ],
    hospital: "Apex Super Specialty Hospital, Block A",
    languages: ["English", "Hindi"],
    about: "Dr. Arvind Sharma is a senior consultant cardiologist with extensive experience in interventional cardiology, echocardiography, hypertension management, and preventive heart care.",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "102",
    name: "Dr. Priya Sundaram",
    specialty: "Neurology",
    qualification: "MBBS, MD, DM (Neurology), Fellowship in Stroke Care",
    experience: "12 Years",
    rating: 4.8,
    reviewsCount: 98,
    consultationFee: 950,
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTimeSlots: [
      "10:00 AM",
      "11:00 AM",
      "11:45 AM",
      "02:30 PM",
      "04:00 PM"
    ],
    hospital: "NeuroCare Institute & Brain Center",
    languages: ["English", "Tamil", "Hindi"],
    about: "Dr. Priya specializes in stroke intervention, migraine disorders, epilepsy, and peripheral neuropathy. She is widely published in international medical journals.",
    avatar: "https://images.unsplash.com/photo-1594824813583-360d70929255?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "103",
    name: "Dr. Rajesh K. Mehta",
    specialty: "Pediatrics",
    qualification: "MBBS, DCH, DNB (Pediatrics), FIAP",
    experience: "18 Years",
    rating: 4.9,
    reviewsCount: 210,
    consultationFee: 650,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:30 AM",
      "10:15 AM",
      "11:30 AM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM"
    ],
    hospital: "Children's Health Pavilion",
    languages: ["English", "Gujarati", "Hindi"],
    about: "Dr. Rajesh is dedicated to child healthcare, neonatal care, developmental milestones monitoring, and pediatric immunization schedules.",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "104",
    name: "Dr. Ananya Roy",
    specialty: "Dermatology",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    experience: "9 Years",
    rating: 4.7,
    reviewsCount: 84,
    consultationFee: 700,
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableTimeSlots: [
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:15 PM",
      "05:00 PM"
    ],
    hospital: "Dermal Skin & Aesthetic Clinic",
    languages: ["English", "Bengali", "Hindi"],
    about: "Dr. Ananya Roy offers advanced dermatological treatments, acne scar therapies, laser treatments, allergy management, and hair loss therapies.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "105",
    name: "Dr. Vikramaditya Rathore",
    specialty: "Orthopedics",
    qualification: "MBBS, MS (Orthopedics), M.Ch (Joint Replacement)",
    experience: "16 Years",
    rating: 4.8,
    reviewsCount: 165,
    consultationFee: 900,
    availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM",
      "10:00 AM",
      "11:30 AM",
      "01:30 PM",
      "03:30 PM"
    ],
    hospital: "Joint & Spine Rehabilitation Hospital",
    languages: ["English", "Hindi"],
    about: "Expert in knee and hip joint replacements, arthroscopic sports injury treatments, fracture care, and degenerative bone disease management.",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "106",
    name: "Dr. Meenakshi Iyer",
    specialty: "Gynecology",
    qualification: "MBBS, MS (Obstetrics & Gynecology), FMAS",
    experience: "14 Years",
    rating: 4.9,
    reviewsCount: 178,
    consultationFee: 850,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    availableTimeSlots: [
      "09:30 AM",
      "10:45 AM",
      "12:00 PM",
      "03:00 PM",
      "04:15 PM"
    ],
    hospital: "Women Wellness & Maternal Care Hospital",
    languages: ["English", "Malayalam", "Tamil", "Hindi"],
    about: "Dr. Meenakshi provides compassionate care for high-risk pregnancies, PCOS/PCOD management, laparoscopic procedures, and fertility counseling.",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "107",
    name: "Dr. Sameer Siddiqui",
    specialty: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: "11 Years",
    rating: 4.6,
    reviewsCount: 92,
    consultationFee: 500,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "08:30 AM",
      "10:00 AM",
      "11:30 AM",
      "02:00 PM",
      "03:30 PM",
      "05:30 PM"
    ],
    hospital: "MediCare Comprehensive Family Clinic",
    languages: ["English", "Urdu", "Hindi"],
    about: "Dr. Sameer specializes in diabetes management, infectious diseases, geriatric health checks, lifestyle diseases, and comprehensive health screenings.",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "108",
    name: "Dr. Kavita Verma",
    specialty: "Oncology",
    qualification: "MBBS, MD (Radiation Oncology), DNB (Medical Oncology)",
    experience: "13 Years",
    rating: 4.9,
    reviewsCount: 115,
    consultationFee: 1100,
    availableDays: ["Tuesday", "Thursday", "Friday"],
    availableTimeSlots: [
      "10:30 AM",
      "11:30 AM",
      "02:00 PM",
      "03:30 PM"
    ],
    hospital: "Hope Cancer Care & Research Center",
    languages: ["English", "Hindi"],
    about: "Dr. Kavita is a compassionate oncologist focusing on precision medicine, systemic chemotherapy, cancer screening, and palliative oncological counseling.",
    avatar: "https://images.unsplash.com/photo-1594824813637-889895c102c9?auto=format&fit=crop&q=80&w=400"
  }
];

export const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "General Medicine",
  "Oncology"
];

export const INITIAL_PATIENT = {
  id: "PID-2024-8841",
  name: "Rahul Verma",
  email: "rahul.verma@example.com",
  phone: "9876543210",
  gender: "Male",
  age: 29,
  bloodGroup: "O+",
  address: "Flat 402, Green Valley Apartments, New Delhi",
  emergencyContact: "9876500000 (Spouse)"
};

export const INITIAL_APPOINTMENTS = [
  {
    id: "APT-1001",
    doctorId: "101",
    doctorName: "Dr. Arvind Sharma",
    doctorSpecialty: "Cardiology",
    doctorHospital: "Apex Super Specialty Hospital, Block A",
    doctorFee: 800,
    patientName: "Rahul Verma",
    patientEmail: "rahul.verma@example.com",
    patientPhone: "9876543210",
    patientId: "PID-2024-8841",
    appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
    timeSlot: "10:30 AM",
    duration: "30 mins",
    symptoms: "Mild chest tightness after exercise and routine ECG review",
    status: "Upcoming", // "Upcoming", "Completed", "Cancelled", "Rescheduled"
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-1002",
    doctorId: "104",
    doctorName: "Dr. Ananya Roy",
    doctorSpecialty: "Dermatology",
    doctorHospital: "Dermal Skin & Aesthetic Clinic",
    doctorFee: 700,
    patientName: "Rahul Verma",
    patientEmail: "rahul.verma@example.com",
    patientPhone: "9876543210",
    patientId: "PID-2024-8841",
    appointmentDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], // 5 days from now
    timeSlot: "02:00 PM",
    duration: "30 mins",
    symptoms: "Seasonal skin allergy and consultation for acne treatment",
    status: "Upcoming",
    createdAt: new Date().toISOString()
  },
  {
    id: "APT-0992",
    doctorId: "107",
    doctorName: "Dr. Sameer Siddiqui",
    doctorSpecialty: "General Medicine",
    doctorHospital: "MediCare Comprehensive Family Clinic",
    doctorFee: 500,
    patientName: "Rahul Verma",
    patientEmail: "rahul.verma@example.com",
    patientPhone: "9876543210",
    patientId: "PID-2024-8841",
    appointmentDate: "2026-09-10",
    timeSlot: "11:30 AM",
    duration: "30 mins",
    symptoms: "Seasonal viral fever and body ache",
    status: "Completed",
    createdAt: "2026-09-08T10:00:00Z"
  }
];
