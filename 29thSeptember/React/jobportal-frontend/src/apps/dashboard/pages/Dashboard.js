import React, { useEffect, useState, useContext } from "react";
import "../../../theme.css";
import { fetchDashboardByEmail, fetchProfileStatus, updateProfile } from "../api/DashboardApi";
import { AuthContext } from "../../../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    skills: "",
    education: "",
    experience: "",
    location: "",
    preferred_mode: "",
    description: "",
    company_name: ""
  });

console.log("AuthContext user =", user);
    console.log("local loaded....",localStorage.getItem("user"));


  useEffect(() => {

        const userEmail = localStorage.getItem("user");

    console.log("Dahboard loaded....",userEmail);
    const loadData = async () => {
      try {
        console.log("user email",userEmail);
        const res = await fetchDashboardByEmail(userEmail);
        setProfile(res);

        const status = await fetchProfileStatus();
        setStatusData(status);
      } catch (err) {
        console.log("Cannot load dashboard: ", err);
      }
    };

    loadData();
  }, [user]);

  // Handle loading
    if (!user) {console.log("uer not loaded"); return <div>Loading user...</div>;}

  if (!profile || !statusData) return <div>Loading...</div>;

  // Prefill form when switching to edit mode
  const enableEditing = () => {
    setFormData({
      full_name: profile.full_name || "",
      skills: profile.skills || "",
      education: profile.education || "",
      experience: profile.experience || "",
      location: profile.location || "",
      preferred_mode: profile.preferred_mode || "",
      description: profile.description || "",
      company_name: profile.company_name || ""
    });

    setEditMode(true);
  };

  // Submit updated profile
  const handleSave = async () => {
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      console.log("Update failed: ", err);
    }
  };

  return (
    <div className="dashboard" key={profile.id}>
      

      {/* If profile incomplete, show warning */}
      {statusData && !statusData.is_complete && (
        <div className="bg-yellow-200 text-yellow-800 p-4 rounded mb-4 shadow">
          <strong>Complete your profile</strong> to unlock full dashboard access.
          <div className="mt-2 text-sm">
            Missing: {statusData.missing_fields.join(", ")}
          </div>

          {!editMode && (
            <button
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={enableEditing}
            >
              Complete Profile
            </button>
          )}
        </div>
      )}

      <main className="content">
        <h1>Welcome {profile.full_name}, </h1>

        {/* ---------------------------------------------------------- */}
        {/* READONLY MODE */}
        {/* ---------------------------------------------------------- */}
        {!editMode && (
          <div className="space-y-2 mt-4">
            <div><b>Skills:</b> {profile.skills}</div>
            <div><b>Education:</b> {profile.education}</div>
            <div><b>Experience:</b> {profile.experience}</div>
            <div><b>Location:</b> {profile.location}</div>
            <div><b>Description:</b> {profile.description}</div>
            <div><b>Preferred Mode:</b> {profile.preferred_mode}</div>
            <div><b>Company Name:</b> {profile.company_name}</div>

            {/* Show edit button for complete profiles too */}
            <button
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
              onClick={enableEditing}
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/* EDIT MODE */}
        {/* ---------------------------------------------------------- */}
        {editMode && (
          <div className="bg-white p-6 rounded shadow mt-4 space-y-4 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-2">Edit Your Profile</h2>

            {/* FULL NAME */}
            <input
              className="input"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />

            {/* SKILLS */}
            <textarea
              className="input"
              placeholder="Skills (comma separated)"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />

            {/* EDUCATION */}
            <input
              className="input"
              placeholder="Education"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />

            {/* EXPERIENCE */}
            <textarea
              className="input"
              placeholder="Experience"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />

            {/* DESCRIPTION */}
            <textarea
              className="input"
              placeholder="Short Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {/* COMPANY NAME */}
            <input
              className="input"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            />

            {/* LOCATION */}
            <input
              className="input"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* PREFERRED MODE */}
            <select
              className="input"
              value={formData.preferred_mode}
              onChange={(e) => setFormData({ ...formData, preferred_mode: e.target.value })}
            >
              <option value="">Select Preferred Mode</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-Site</option>
              <option value="hybrid">Hybrid</option>
            </select>

            {/* SAVE BUTTON */}
            <div className="flex gap-3 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
