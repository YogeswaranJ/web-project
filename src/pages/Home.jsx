// Home.jsx
// Experiment 1a: Home Component with Hero, Specialty exploration, and quick appointment actions

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  Shield,
  Clock,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  HeartPulse,
  Sparkles,
  PhoneCall,
  Activity
} from "lucide-react";
import { useAppointmentContext } from "../context/AppointmentContext";
import DoctorCard from "../components/doctor/DoctorCard";
import Button from "../components/common/Button";
import { SPECIALTIES } from "../data/initialDoctors";

export const Home = () => {
  const navigate = useNavigate();
  const { filteredDoctors, setSelectedSpecialty, setSearchQuery } = useAppointmentContext();
  const [quickSearch, setQuickSearch] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      setSearchQuery(quickSearch.trim());
    }
    navigate("/doctors");
  };

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty);
    navigate("/doctors");
  };

  // Featured doctors (top 3)
  const featuredDoctors = filteredDoctors.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="sparkle-icon" />
              <span>NABH Accredited Multi-Specialty Hospital</span>
            </div>

            <h1 className="hero-heading">
              Your Health, Our Priority. <br />
              <span className="hero-gradient-text">Book Top Doctors Online</span>
            </h1>

            <p className="hero-subtitle">
              Connect with leading certified specialists in Cardiology, Neurology, Pediatrics, and more.
              Instant appointment confirmations, flexible rescheduling, and comprehensive patient care.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleHeroSearch} className="hero-search-box">
              <div className="hero-search-input-wrap">
                <Search className="hero-search-icon" size={20} />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Search by doctor name or specialty..."
                  className="hero-search-input"
                  aria-label="Doctor search"
                />
              </div>
              <Button type="submit" variant="primary" icon={Search} className="hero-btn">
                Find Doctors
              </Button>
            </form>

            {/* Hero Quick Stats */}
            <div className="hero-stats-row">
              <div className="stat-item">
                <strong className="stat-number">40+</strong>
                <span className="stat-desc">Senior Specialists</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong className="stat-number">25,000+</strong>
                <span className="stat-desc">Happy Patients</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong className="stat-number">4.9 / 5</strong>
                <span className="stat-desc">Patient Satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                alt="Doctor consulting patient"
                className="hero-main-img"
              />
              <div className="floating-card-appointment">
                <div className="floating-icon">
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="floating-title">Instant Scheduling</span>
                  <span className="floating-sub">Verified Available Slots Today</span>
                </div>
              </div>
              <div className="floating-card-rating">
                <HeartPulse size={20} className="pulse-card-icon" />
                <div>
                  <strong className="floating-title">24/7 Emergency Support</strong>
                  <span className="floating-sub">Immediate Medical Help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-tag">Clinical Departments</span>
            <h2 className="section-title">Explore Specialized Departments</h2>
            <p className="section-subtitle">
              Access trusted healthcare experts across specialized disciplines with convenient OPD slots.
            </p>
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.filter((s) => s !== "All Specialties").map((spec) => (
              <button
                key={spec}
                type="button"
                className="specialty-card"
                onClick={() => handleSpecialtyClick(spec)}
              >
                <div className="specialty-icon-box">
                  <Activity size={22} />
                </div>
                <h3 className="specialty-card-title">{spec}</h3>
                <span className="specialty-card-link">
                  Consult Specialists <ArrowRight size={14} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="featured-doctors-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-tag">Featured Specialists</span>
              <h2 className="section-title">Our Chief Consultants</h2>
              <p className="section-subtitle">
                Board-certified specialists available for in-hospital OPD & virtual consultations.
              </p>
            </div>
            <Link to="/doctors" className="btn-view-all">
              <span>View All Doctors</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="doctor-cards-grid">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MediCare Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header-centered">
            <span className="section-tag">Patient First Healthcare</span>
            <h2 className="section-title">Why Patients Choose MediCare Plus</h2>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-circle">
                <Clock size={24} />
              </div>
              <h3 className="feature-box-title">Zero Waiting Time</h3>
              <p className="feature-box-desc">
                Select your preferred OPD time slot and experience punctual consultations without
                prolonged hospital waiting lines.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle">
                <Award size={24} />
              </div>
              <h3 className="feature-box-title">Certified Medical Experts</h3>
              <p className="feature-box-desc">
                Consult with verified doctors holding premier DM, M.Ch, and international fellowship
                credentials with decades of clinical experience.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle">
                <Shield size={24} />
              </div>
              <h3 className="feature-box-title">Protected Patient Portal</h3>
              <p className="feature-box-desc">
                Access your appointment history, view digital summaries, reschedule dates, and manage
                consultations securely with token authentication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Call to Action */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Need Immediate Doctor Consultation?</h2>
              <p className="cta-text">
                Book your appointment now or call our 24/7 hospital reception desk for urgent medical
                care.
              </p>
              <div className="cta-btn-group">
                <Link to="/book-appointment" className="btn-cta-primary">
                  <Calendar size={18} />
                  <span>Book Appointment Now</span>
                </Link>
                <a href="tel:+911145678900" className="btn-cta-outline">
                  <PhoneCall size={18} />
                  <span>Emergency: +91 (11) 4567-8900</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
