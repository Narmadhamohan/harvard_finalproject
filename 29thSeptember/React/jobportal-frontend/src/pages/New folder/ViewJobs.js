import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar"; // 👈 Import reusable search bar

export default function ViewJobs() {
  const baseUrl = "http://127.0.0.1:8000/api/";
  const [jobs, setJobs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Track search term

  // ✅ Fetch jobs (supports pagination + search)
  const fetchJobs = async (cursor = "", search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please login to view jobs.");
        window.location.href = "/";
        return;
      }

      // Build URL dynamically for pagination + search
      let url = `${baseUrl}jobposts/`;
      const params = [];
      if (cursor) params.push(`cursor=${cursor}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return;
      }

      const data = await response.json();
      setJobs(data.results || []);
      setNextCursor(data.next_cursor);
      setPrevCursor(data.previous_cursor);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⏱️ Load jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // 🔎 Handle search (reusing SearchBar)
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchJobs("", term); // Fetch from page 1 with search term
  };

  return (
    <div className="p-6 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 text-center">
        💼 Available Jobs
      </h2>

      {/* 🔍 Reusable SearchBar */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search job title, description, or poster..."
      />

      {loading ? (
        <p className="text-center text-gray-600">Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-700 mb-2">{job.description}</p>
              <div className="text-gray-500 text-sm space-y-1">
                <p>📍 {job.location}</p>
                <p>💼 {job.job_type}</p>
                <p>💰 {job.salary_range}</p>
                <p>
                  🗓️ Posted on:{" "}
                  {new Date(job.posted_on).toLocaleDateString("en-IN")}
                </p>
                <p>
                  <strong>Status:</strong> {job.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No jobs found.</p>
      )}

      {/* 🔽 Pagination Controls */}
      <div className="flex justify-between mt-10">
        <button
          onClick={() =>
            prevCursor && fetchJobs(prevCursor.split("cursor=")[1], searchTerm)
          }
          disabled={!prevCursor}
          className={`px-5 py-2 rounded-lg font-medium ${
            prevCursor
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          ⬅ Previous
        </button>

        <button
          onClick={() =>
            nextCursor && fetchJobs(nextCursor.split("cursor=")[1], searchTerm)
          }
          disabled={!nextCursor}
          className={`px-5 py-2 rounded-lg font-medium ${
            nextCursor
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
