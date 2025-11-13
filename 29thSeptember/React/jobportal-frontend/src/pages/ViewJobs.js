import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar"; // 👈 Import reusable search bar
import { useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";

export default function ViewJobs() {
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000/api/";
  // no need of const [jobs, setJobs], cursor = useState([]); we receive these valuefrom hook
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Track search term
  const { jobs, loading, nextCursor, prevCursor, fetchJobs } = useJobs();

  

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
              onClick={() => navigate(`/jobs/${job.id}`)} // 👈 navigate to detail
              className="cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-700 mb-2 line-clamp-2">{job.description}</p>
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
        <button onClick={() => fetchJobs(nextCursor?.split("cursor=")[1], searchTerm)}>
  Next ➡
</button>
      </div>
    </div>
  );
}
