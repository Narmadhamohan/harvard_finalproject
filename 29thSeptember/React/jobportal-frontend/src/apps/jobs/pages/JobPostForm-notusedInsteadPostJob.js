import { useState } from "react";
import axios from "axios";

export default function JobPostForm() {

  const baseUrl = import.meta.env.VITE_BASE_URL; 
  const token = localStorage.getItem("accessToken");

  const [job, setJob] = useState({
    company_name: "",
    title: "",
    description: "",
    location: "",
    salary_range: "",
    job_type: "",
    availability: "",
    status: "open"
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${baseUrl}jobposts/`,
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      alert("Job posted successfully!");
      console.log("Response:", res.data);

      // Reset Form
      setJob({
        company_name: "",
        title: "",
        description: "",
        location: "",
        salary_range: "",
        job_type: "",
        availability: "",
        status: "open"
      });

    } catch (err) {
      console.log("Job Posting Failed:", err);
      alert("Posting failed. Check console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow w-full max-w-xl mx-auto space-y-4">

      <h2 className="text-xl font-bold mb-4">Post a Job</h2>
    <div><b>Company Name:</b></div>
      <input
        name="company_name"
        value={job.company_name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Company Name"
        required
      />
    <div><b>Job Title:</b></div>

      <input
        name="title"
        value={job.title}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Job Title"
        required
      />

      <textarea
        name="description"
        value={job.description}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Job Description"
        rows="3"
        required
      />

      <input
        name="location"
        value={job.location}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Location"
      />

      <input
        name="salary_range"
        value={job.salary_range}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Salary Range (e.g., 20,000 - 30,000)"
      />

      <select
        name="job_type"
        value={job.job_type}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        required
      >
        <option value="">Select Job Type</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
      </select>

      <input
        name="availability"
        value={job.availability}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Availability (e.g., Evening Hours)"
      />

      <select
        name="status"
        value={job.status}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      >
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Post Job
      </button>
    </form>
  );
}
