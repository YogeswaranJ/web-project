// Footer.jsx
// Experiment 1a: Reusable Footer Component using JSX

import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, PhoneCall, Mail, MapPin, Clock, ShieldCheck, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-content-grid">
        {/* Brand & Emergency Info */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <HeartPulse size={26} className="footer-heart-icon" />
            <span className="footer-brand-name">
              MediCare<span className="brand-accent">Plus</span>
            </span>
          </div>
          <p className="footer-tagline">
            Providing compassionate, world-class multi-specialty healthcare with seamless online
            doctor appointment scheduling.
          </p>

          <div className="emergency-callout">
            <PhoneCall size={18} className="emergency-phone-icon" />
            <div>
              <span className="emergency-label">24/7 Hospital Emergency Helpline:</span>
              <strong className="emergency-number">+91 (11) 4567-8900 / 108</strong>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Navigation</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/">Home Overview</Link>
            </li>
            <li>
              <Link to="/doctors">Find Specialists</Link>
            </li>
            <li>
              <Link to="/book-appointment">Book New Appointment</Link>
            </li>
            <li>
              <Link to="/patient/appointments">My Scheduled Appointments</Link>
            </li>
            <li>
              <Link to="/patient/profile">Patient Medical Profile</Link>
            </li>
            <li>
              <Link to="/login">Patient Portal Login</Link>
            </li>
          </ul>
        </div>

        {/* Medical Specialties */}
        <div className="footer-col">
          <h4 className="footer-heading">Specialty Departments</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/doctors?specialty=Cardiology">Cardiology & Heart Care</Link>
            </li>
            <li>
              <Link to="/doctors?specialty=Neurology">Neurology & Stroke Clinic</Link>
            </li>
            <li>
              <Link to="/doctors?specialty=Pediatrics">Pediatrics & Neonatal Care</Link>
            </li>
            <li>
              <Link to="/doctors?specialty=Orthopedics">Orthopedics & Joint Clinic</Link>
            </li>
            <li>
              <Link to="/doctors?specialty=Dermatology">Dermatology & Skin Care</Link>
            </li>
            <li>
              <Link to="/doctors?specialty=Oncology">Oncology & Cancer Care</Link>
            </li>
          </ul>
        </div>

        {/* Hospital Contact Info */}
        <div className="footer-col">
          <h4 className="footer-heading">Hospital Campus</h4>
          <div className="footer-contact-items">
            <div className="contact-item">
              <MapPin size={16} />
              <span>Apex Super Specialty Campus, Institutional Area, Sector 12, New Delhi</span>
            </div>
            <div className="contact-item">
              <Mail size={16} />
              <span>appointments@medicareplus.org</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>OPD Timings: Mon - Sat: 8:00 AM - 7:00 PM</span>
            </div>
            <div className="contact-item">
              <ShieldCheck size={16} />
              <span>NABH & JCI Accredited Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Academic & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} MediCare Plus Super Specialty Hospital. All Rights Reserved.
          </p>
          <div className="academic-credit">
            <span>
              Academic Lab Submission • <strong>Scenario 8: Hospital Appointment Booking Web Application</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
