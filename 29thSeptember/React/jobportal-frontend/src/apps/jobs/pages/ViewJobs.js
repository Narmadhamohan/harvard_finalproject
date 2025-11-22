import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../../../components/SearchBar"; // 👈 Import reusable search bar
import {useLocation, useNavigate } from "react-router-dom";
import { useJobs } from "../hooks/useJobs";


//1. set ref with useref in devbox/jobbox
//2. set poistion by storing in sessionstorage before navigating to job detail
//3. useeffect - key: if someone is calling not from back option, set the key in the 
// viewjobs-loadcall and fetch usig location
//4. then use that scroll state inside the useeffect - which loads whenever the dom  renders the page
//5. done with navigate,location.
// 6. how to use global jobcontext's value instead of direct usejobs

export default function ViewJobs() {
  const navigate = useNavigate();
    const location = useLocation();
  const baseUrl = "http://127.0.0.1:8000/api/";
  // no need of const [jobs, setJobs], cursor = useState([]); we receive these valuefrom hook
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Track search term
  const { jobs, loading, nextCursor, prevCursor, fetchJobs } = useJobs();

  const listref = useRef(null); 

  // ⏱️ Load jobs on mount





// 1️⃣ When component loads, fetch jobs
useEffect(() => {
  fetchJobs("", "");
}, []);

// 2️⃣ When jobs are updated, THEN restore scroll
useEffect(() => {
    const scrollStateMaintain = sessionStorage.getItem("scrollStateMaintain");
  if (!listref.current) return;

  if (scrollStateMaintain) {
    const saved = sessionStorage.getItem("scrollpos");
    if (saved) {
      listref.current.scrollTo(0, parseInt(saved));
    }
  } else {
    sessionStorage.removeItem("scrollpos");
  }
  sessionStorage.setItem("scrollStateMaintain",false);

}, [jobs]);   // ← scroll restore only after jobs loaded


  // 🔎 Handle search (reusing SearchBar)
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchJobs("", term); // Fetch from page 1 with search term
  };


const handleDetailsClick = (jobId) => {
  // why not listref.current in 2nd arg?
sessionStorage.setItem("scrollpos", listref.current.scrollTop);
  navigate(`/jobs/${jobId}`, {scrollStateMaintain:true});

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
      
      <div ref={listref} className="divide-y divide-gray-200">

        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => handleDetailsClick(job.id)}
            className="
              cursor-pointer 
              py-4 
              px-2 
              hover:bg-gray-100 
              transition 
              flex 
              flex-col
            "
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-indigo-600">
                {job.title}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(job.posted_on).toLocaleDateString("en-IN")}
              </span>
            </div>

            <p className="text-gray-700 text-sm line-clamp-1">
              {job.description}
            </p>

            <div className="flex gap-4 text-gray-500 text-xs mt-1">
              <span>📍 {job.location}</span>
              <span>💼 {job.job_type}</span>
              <span>💰 {job.salary_range}</span>
              <span>Status: {job.status}</span>
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