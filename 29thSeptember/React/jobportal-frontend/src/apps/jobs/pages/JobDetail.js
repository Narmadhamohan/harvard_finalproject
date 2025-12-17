// src/pages/JobDetail.js
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
//import axios from "axios";
import axiosClient from "../../../api/axiosClient";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
  },[]);

  const fetchJobDetails = async () => {
    try {
      const response = await axiosClient.get(
        `/jobposts/${id}/`,
      );
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await axiosClient.get(
        "/applicants/"      );
      const appliedJobs = response.data.results || response.data;
      const applied = appliedJobs.some((app) => app.job === parseInt(id));
      setAlreadyApplied(applied);
    } catch (error) {
      console.error("Error checking applied jobs:", error);
    }
  };

  // --------------------------
  // APPLY WITH FILE UPLOAD
  // --------------------------
  const handleApply = async () => {
    if (!resumeFile) {
      setMessage("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("cover_letter", coverLetter);
    formData.append("job", id);

    try {
      const response = await axiosClient.post(
        `/jobposts/${id}/apply/`,
        formData,
        {
          headers: {
        //    Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Successfully applied!");
      setAlreadyApplied(true);
    } catch (error) {
      if (error.response?.data?.detail) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Failed to apply. Try again.");
      }
    }
  };

  if (!job) return <p>Loading...</p>;

  const handleBack = () => {
    /* navigate(-1,{
  state: { scrollStateMaintain: true }
}); // Correct usage*/
sessionStorage.setItem("scrollStateMaintain",true);
//navigate("/view-jobs", { state: { scrollStateMaintain: true } });
navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job Type:</strong> {job.job_type}</p>
      <p><strong>Availability:</strong> {job.availability}</p>
      <p><strong>Salary:</strong> {job.salary_range}</p>
      <p><strong>About Job: {job.company_name && (<span> company:{job.company_name}
        </span>)}</strong></p>
      <p className="my-4">{job.description}</p>

      {(job.status !== "active") && (job.status !== "draft")&&(job.status !== "open") ? (
        <p className="text-red-600 font-semibold">This job is closed.</p>
      ) : alreadyApplied ? (
        <p className="text-green-600 font-semibold">
          You have already applied for this job.
        </p>
      ) : (
        <>
          {/* Resume Upload */}
          <div className="mt-4">
            <label className="font-semibold">Upload Resume (PDF/Doc):</label>
            <input
              type="file"
              className="block border p-2 mt-1"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </div>

          {/* Cover Letter */}
          <div className="mt-4">
            <label className="font-semibold">Cover Letter (optional):</label>
            <textarea
              rows="4"
              className="w-full border p-2 mt-1"
              placeholder="Write your cover letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>

          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          >
            Apply Now
          </button>
        </>
      )}

      {message && <p className="mt-3 text-blue-700">{message}</p>}

      <button
        onClick={handleBack}
        className="mt-6 bg-gray-200 px-4 py-2 rounded"
      >
        Back to Job openings
      </button>
    </div>
  );
}
