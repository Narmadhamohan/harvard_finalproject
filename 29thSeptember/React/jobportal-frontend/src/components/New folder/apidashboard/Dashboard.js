import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Dashboard Overview</h2>

      {stats ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg">
            <h3 className="text-gray-500">Total Jobs</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.total_jobs}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg">
            <h3 className="text-gray-500">Active Profiles</h3>
            <p className="text-3xl font-bold text-green-600">{stats.active_profiles}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg">
            <h3 className="text-gray-500">Pending Approvals</h3>
            <p className="text-3xl font-bold text-red-600">{stats.pending_approvals}</p>
          </div>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </Layout>
  );
}
