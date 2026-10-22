// DoctorCard.jsx
// Experiment 1a & 4h: Reusable DoctorCard Component

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Award, DollarSign, Calendar, ChevronRight, Stethoscope } from "lucide-react";
import Button from "../common/Button";
import { useAppointmentContext } from "../../context/AppointmentContext";

export const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { selectDoctor } = useAppointmentContext();

  const handleBookNow = (e) => {
    e.stopPropagation();
    selectDoctor(doctor);
    navigate(`/book-appointment?doctorId=${doctor.id}`);
  };

  return (
    <article className="doctor-card" id={`doctor-card-${doctor.id}`}>
      <div className="doctor-card-top">
        <div className="doctor-avatar-wrapper">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="doctor-avatar-img"
            loading="lazy"
            onError={(e) => {
              // Fallback avatar if external image fails
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400";
            }}
          />
          <span className="doctor-specialty-badge">{doctor.specialty}</span>
        </div>

        <div className="doctor-header-info">
          <div className="doctor-rating-row">
            <span className="rating-tag">
              <Star size={14} className="star-icon" fill="currentColor" />
              <strong>{doctor.rating}</strong>
              <small>({doctor.reviewsCount} reviews)</small>
            </span>
            <span className="doctor-fee-tag">₹{doctor.consultationFee}</span>
          </div>

          <h3 className="doctor-name">
            <Link to={`/doctor/${doctor.id}`} className="doctor-name-link">
              {doctor.name}
            </Link>
          </h3>

          <p className="doctor-qualifications" title={doctor.qualification}>
            {doctor.qualification}
          </p>

          <div className="doctor-meta-chips">
            <span className="meta-chip">
              <Award size={13} /> {doctor.experience}
            </span>
            <span className="meta-chip">
              <Stethoscope size={13} /> {doctor.hospital.split(",")[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="doctor-card-mid">
        <div className="doctor-available-days">
          <span className="avail-label">
            <Calendar size={13} /> Available Days:
          </span>
          <div className="day-chips">
            {doctor.availableDays.map((day) => (
              <span key={day} className="day-chip">
                {day.substring(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="doctor-card-actions">
        <Link to={`/doctor/${doctor.id}`} className="btn-link-details">
          <span>View Profile</span>
          <ChevronRight size={14} />
        </Link>
        <Button
          variant="primary"
          size="sm"
          onClick={handleBookNow}
          icon={Calendar}
          className="book-btn-card"
        >
          Book Appointment
        </Button>
      </div>
    </article>
  );
};

export default DoctorCard;
