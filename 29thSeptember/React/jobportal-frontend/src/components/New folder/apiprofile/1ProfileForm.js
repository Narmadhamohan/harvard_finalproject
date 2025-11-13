import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function ProfileForm() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Profile Information</h2>
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 w-1/2">
        <div>
          <label className="block text-gray-600">Name</label>
          <input
            value={profile.name || ""}
            className="border rounded-lg p-2 w-full"
            readOnly
          />
        </div>
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            value={profile.email || ""}
            className="border rounded-lg p-2 w-full"
            readOnly
          />
        </div>
        <div>
          <label className="block text-gray-600">Role</label>
          <input
            value={profile.role || ""}
            className="border rounded-lg p-2 w-full"
            readOnly
          />
        </div>
      </div>
    </Layout>
  );
}
