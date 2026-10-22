// DoctorProfile.jsx
// Experiment 3c & 3d: Dynamic Routing with useParams() displaying individual doctor details

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Award,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Globe,
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import { api } from "../api/mockApi";
import { useAppointmentContext } from "../context/AppointmentContext";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

export const DoctorProfile = () => {
  // Experiment 3d: Use useParams() to retrieve doctor ID from URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectDoctor } = useAppointmentContext();

  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Experiment 1d (Part 2): Fetch individual doctor details dynamically using REST API
        const data = await api.getDoctorById(id);
        if (isMounted) {
          setDoctor(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || `Doctor with ID ${id} not found.`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBookAppointment = () => {
    if (doctor) {
      selectDoctor(doctor);
      navigate(`/book-appointment?doctorId=${doctor.id}`);
    }
  };

  if (isLoading) {
    return <Loading fullPage message={`Loading Doctor ${id} profile details...`} />;
  }

  if (error || !doctor) {
    return (
      <div className="container profile-not-found">
        <div className="error-card">
          <h2>Doctor Not Found</h2>
          <p>{error || `Doctor with ID ${id} could not be located in our hospital records.`}</p>
          <Button variant="primary" icon={ArrowLeft} onClick={() => navigate("/doctors")}>
            Back to Doctors Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="profile-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/doctors">Doctors</Link>
          <span>/</span>
          <span className="current-crumb">{doctor.name}</span>
        </nav>

        {/* Main Profile Header Card */}
        <div className="profile-main-card">
          <div className="profile-grid">
            <div className="profile-avatar-column">
              <div className="avatar-frame">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="profile-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <span className="specialty-pill">{doctor.specialty}</span>
              </div>
            </div>

            <div className="profile-content-column">
              <div className="doc-meta-top">
                <span className="id-tag">Doctor ID: #{doctor.id}</span>
                <div className="doc-rating-box">
                  <Star size={16} className="star-filled" fill="currentColor" />
                  <strong>{doctor.rating}</strong>
                  <span>({doctor.reviewsCount} patient reviews)</span>
                </div>
              </div>

              {/* Requirement 3d: Doctor Name */}
              <h1 className="doc-title-name">{doctor.name}</h1>

              {/* Requirement 3d: Qualification & Specialty */}
              <p className="doc-qualifications-full">{doctor.qualification}</p>

              <div className="doc-badges-row">
                {/* Requirement 3d: Experience */}
                <span className="badge-item">
                  <Award size={15} /> <strong>{doctor.experience}</strong> Clinical Experience
                </span>
                {/* Requirement 3d: Consultation Fee */}
                <span className="badge-item highlight-badge">
                  <DollarSign size={15} /> Consultation Fee: <strong>₹{doctor.consultationFee}</strong>
                </span>
                <span className="badge-item">
                  <MapPin size={15} /> {doctor.hospital}
                </span>
                <span className="badge-item">
                  <Globe size={15} /> Languages: {doctor.languages?.join(", ")}
                </span>
              </div>

              <div className="profile-bio-box">
                <h3>About Specialist</h3>
                <p>{doctor.about}</p>
              </div>

              {/* Action Button */}
              <div className="profile-actions-row">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Calendar}
                  onClick={handleBookAppointment}
                  className="btn-book-profile"
                >
                  Book Appointment with {doctor.name.split(" ")[1]}
                </Button>
                <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/doctors")}>
                  Back to List
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Availability Section */}
        <div className="profile-availability-grid">
          {/* Requirement 3d: Available Days */}
          <div className="avail-card">
            <div className="avail-header">
              <Calendar size={18} className="avail-icon" />
              <h3>Weekly OPD Schedule</h3>
            </div>
            <p className="avail-sub">Available Consultation Days:</p>
            <div className="days-list-row">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => {
                  const isAvailable = doctor.availableDays.includes(day);
                  return (
                    <div
                      key={day}
                      className={`day-schedule-card ${isAvailable ? "available" : "unavailable"}`}
                    >
                      <span className="day-name">{day}</span>
                      <span className="day-status">
                        {isAvailable ? "Available" : "Off Duty"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Requirement 3d: Available Time Slots */}
          <div className="avail-card">
            <div className="avail-header">
              <Clock size={18} className="avail-icon" />
              <h3>Consultation Time Slots</h3>
            </div>
            <p className="avail-sub">Standard Consultation Duration: 30 - 45 Minutes</p>
            <div className="slots-chips-grid">
              {doctor.availableTimeSlots.map((slot) => (
                <div key={slot} className="slot-chip-display">
                  <Clock size={13} />
                  <span>{slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
