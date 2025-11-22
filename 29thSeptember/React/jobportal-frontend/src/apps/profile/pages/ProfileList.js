import { useEffect, useState } from "react";
import { fetchProfiles } from "../api/ProfileApi";
import { useNavigate } from "react-router-dom";

export default function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");      // NEW: search state
  const [page, setPage] = useState(1);           // NEW: pagination state
  const navigate = useNavigate();                // NEW: for full-card click

  useEffect(() => {
    fetchProfiles(page, search).then(res => setProfiles(res.results));  
  }, [page, search]);                             // UPDATED: re-fetch on search & page change

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* HEADER + SEARCH */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Profiles</h2>
        <input
          type="text"
          placeholder="Search by name or location…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64 shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* PROFILE CARDS */}
      <div className="space-y-4">
        {profiles.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/profiles/${p.id}`)}   // NEW: full-card navigation
            className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md hover:bg-gray-50 cursor-pointer transition"
          >
            <h3 className="text-lg font-medium">{p.full_name}</h3>
            <p className="text-sm text-gray-600">{p.location}</p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="font-medium">Page {page}</span>

        <button
          onClick={() => setPage(prev => prev + 1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}
