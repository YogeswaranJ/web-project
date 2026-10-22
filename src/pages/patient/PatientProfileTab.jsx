// PatientProfileTab.jsx
// Experiment 1a & 3e: PatientProfile component under nested route /patient/profile

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Heart, AlertCircle, CheckCircle2, Shield, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export const PatientProfileTab = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "Rahul Verma",
    email: user?.email || "rahul.verma@example.com",
    phone: user?.phone || "9876543210",
    id: user?.id || "PID-2024-8841",
    gender: user?.gender || "Male",
    age: user?.age || 29,
    bloodGroup: user?.bloodGroup || "O+",
    address: user?.address || "Flat 402, Green Valley Apartments, New Delhi",
    emergencyContact: user?.emergencyContact || "9876500000 (Spouse)"
  });

  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile(formData);
    setTimeout(() => {
      setIsSaving(false);
      setFeedback("Patient medical profile updated successfully!");
      setTimeout(() => setFeedback(""), 4000);
    }, 400);
  };

  return (
    <div className="patient-tab-content">
      <div className="tab-intro-bar">
        <h3>Patient Medical Profile & Registration Records</h3>
        <p>Keep your contact details, emergency information, and address up-to-date.</p>
      </div>

      {feedback && (
        <div className="profile-feedback-banner success" role="alert">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="patient-profile-form">
        <div className="profile-form-grid">
          {/* Patient ID (Read-only registration ID) */}
          <div className="form-group-item">
            <Input
              label="Patient ID"
              id="profile-pid"
              value={formData.id}
              disabled={true}
              helperText="Permanent hospital registration number"
              icon={Shield}
            />
          </div>

          {/* Full Name */}
          <div className="form-group-item">
            <Input
              label="Full Name"
              id="profile-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              icon={User}
            />
          </div>

          {/* Email */}
          <div className="form-group-item">
            <Input
              label="Email Address"
              id="profile-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              icon={Mail}
            />
          </div>

          {/* Phone */}
          <div className="form-group-item">
            <Input
              label="Contact Phone"
              id="profile-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              icon={Phone}
            />
          </div>

          {/* Blood Group */}
          <div className="form-group-item">
            <label className="input-label" htmlFor="profile-blood">
              Blood Group
            </label>
            <select
              id="profile-blood"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="filter-select"
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Age & Gender */}
          <div className="form-group-item">
            <div className="two-cols-inline">
              <div>
                <label className="input-label" htmlFor="profile-age">Age</label>
                <input
                  id="profile-age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label" htmlFor="profile-gender">Gender</label>
                <select
                  id="profile-gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="filter-select"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="form-group-item form-full-col">
            <Input
              label="Emergency Contact (Name & Phone)"
              id="profile-emergency"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. 9876500000 (Spouse / Guardian)"
              icon={Phone}
            />
          </div>

          {/* Address */}
          <div className="form-group-item form-full-col">
            <label className="input-label" htmlFor="profile-address">Residential Address</label>
            <textarea
              id="profile-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="symptoms-textarea"
            />
          </div>
        </div>

        <div className="profile-actions-bar">
          <Button type="submit" variant="primary" icon={Save} isLoading={isSaving}>
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientProfileTab;
