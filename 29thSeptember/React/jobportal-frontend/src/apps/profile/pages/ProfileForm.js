import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "./profileApi";

export default function ProfileForm() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profile);
    alert("Profile updated!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow">
      <input
        value={profile.skills || ""}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
        className="border p-2 w-full mb-2"
        placeholder="Skills"
      />
      <input
        value={profile.education || ""}
        onChange={(e) => setProfile({ ...profile, education: e.target.value })}
        className="border p-2 w-full mb-2"
        placeholder="Education"
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
