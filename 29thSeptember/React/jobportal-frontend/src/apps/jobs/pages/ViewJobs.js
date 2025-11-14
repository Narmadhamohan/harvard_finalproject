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
  const scrollStateMaintain = location?.state?.scrollStateMaintain;
  // ⏱️ Load jobs on mount



useEffect(() => {
  console.log("🔥 useEffect RUNNING");

  fetchJobs("", "");

}, []);  // <--- IMPORTANT


  useEffect(() => {
  console.log("inside the page:1");

    if (scrollStateMaintain){
       const savedScrollPosition = sessionStorage.getItem("scrollpos");
        if(savedScrollPosition && listref.current){
            listref.current.scrollTo(0,parseInt(savedScrollPosition));
        }
    }
    else {
                  // init scroll position
                //  listref.current.scrollTo(0,0);
                  sessionStorage.removeItem("scrollpos")
    }
    fetchJobs("","");
   // instead of above fetchjobs from usejobs, im going to call,
   // usejobs inide jobcontext
  },[]);

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
        <div ref={listref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              // why not simple              onClick={handleDetailsClick(job.id)} // 👈 navigate to detail
                        onClick={() => handleDetailsClick(job.id)}         
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
