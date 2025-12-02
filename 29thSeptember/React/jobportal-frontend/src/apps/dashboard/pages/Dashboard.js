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
    phone_number: "",
    company_name: ""
  });

console.log("AuthContext user =", user);
    console.log("local loaded....",localStorage.getItem("user"));


  useEffect(() => {

    
    loadData();
  }, [user]);
const loadData = async () => {
      try {
        
        const userEmail = localStorage.getItem("user");

    console.log("Dashboard loaded....",userEmail);
        console.log("user email",userEmail);  
        const res = await fetchDashboardByEmail(userEmail);
        setProfile(res);

        const status = await fetchProfileStatus();
        setStatusData(status);
      } catch (err) {
        console.log("Cannot load dashboard: ", err);
      }
    };

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
      phone: profile.Phone || "",
      company_name: profile.company_name || ""
    });

    setEditMode(true);
  };

  const validateData = () => {
      if (!formData.description.trim()) {
    alert("Description is required");
    return;
  }      if (!formData.skills.trim()) {
    alert("Description is required");
    return;
  }      if (!formData.education.trim()) {
    alert("Description is required");
    return;
  }  if (!formData.experience.trim()) {
    alert("Description is required");
    return;
  }  if (!formData.location.trim()) {
    alert("Description is required");
    return;
  }  if (!formData.phone_number.trim()) {
    alert("Description is required");
    return;
  }
  }
  // Submit updated profile
  const handleSave = async () => {
    try {
      validateData();
      console.log("in handlesave");
      const updated = await updateProfile(formData);
      console.log("Form data: ",formData);
      console.log("updated: ",updated);

      setProfile(updated);
      await loadData();  // reload fresh data
              const status = await fetchProfileStatus();

              setStatusData(status);

      setEditMode(false);
    } catch (err) {
      console.log("Update failed: ", err);
    }
  };

 return (
  <div className="dashboard flex flex-col gap-6 w-full" key={profile.id}>

    {/* WARNING BOX + EDIT BUTTON */}
    {statusData && !statusData.is_complete && (
      <div className="bg-yellow-200 text-yellow-800 p-4 rounded shadow">
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

    {/* PROFILE SECTION (Read + Edit) */}
    <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
      <h1 className="text-xl font-bold mb-4">
        Welcome {profile.full_name},
      </h1>

      {/* READ MODE */}
      {!editMode && (
        <div className="space-y-2">
          <div><b>Skills:</b> {profile.skills}</div>
          <div><b>Education:</b> {profile.education}</div>
          <div><b>Experience:</b> {profile.experience}</div>
          <div><b>Location:</b> {profile.location}</div>
          <div><b>Description:</b> {profile.description}</div>
          <div><b>Preferred Mode:</b> {profile.preferred_mode}</div>
          <div><b>Company Name:</b> {profile.company_name}</div>
          <div><b>Phone Number:</b> {profile.phone_number}</div>

          <button
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
            onClick={enableEditing}
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* EDIT MODE */}
      {editMode && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Edit Your Profile</h2>
        <div><b>Full Name:</b></div>
          <input
            className="input"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required />
        <div><b>Skills:</b></div>

          <textarea
            className="input"
            placeholder="Skills"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          required/>
                  <div><b>Education: </b></div>

          <input
            className="input"
            placeholder="Education"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          required />
                  <div><b>Experience: </b></div>

          <textarea
            className="input"
            placeholder="Experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          required />
                  <div><b>Description: </b></div>

          <textarea
            className="input"
            placeholder="Short Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
                          <div><b>Current Company Name: </b></div>

          <input
            className="input"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />
                            <div><b>Location: </b></div>

          <input
            className="input"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
                          <div><b>Preferred Mode: </b></div>
            <input
            className="input"
            placeholder="Location"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
                          <div><b>Preferred Mode: </b></div>
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
    </div>
  </div>
);
}