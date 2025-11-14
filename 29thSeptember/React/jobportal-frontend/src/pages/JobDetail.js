// src/pages/JobDetail.js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken"); // stored from login

  useEffect(() => {
    fetchJobDetails();
    checkIfApplied();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/jobposts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/applicants/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedJobs = response.data.results || response.data;
      const applied = appliedJobs.some((app) => app.job === parseInt(id));
      setAlreadyApplied(applied);
    } catch (error) {
      console.error("Error checking applied jobs:", error);
    }
  };

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/jobposts/${id}/apply/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job Type:</strong> {job.job_type}</p>
      <p><strong>Availability:</strong> {job.availability}</p>
      <p><strong>Salary:</strong> {job.salary_range}</p>
      <p className="my-4">{job.description}</p>

      {job.status !== "active" ? (
        <p className="text-red-600 font-semibold">This job is closed.</p>
      ) : alreadyApplied ? (
        <p className="text-green-600 font-semibold">
          You have already applied for this job.
        </p>
      ) : (
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Now
        </button>
      )}

      {message && <p className="mt-3 text-blue-700">{message}</p>}
    </div>
  );
}
