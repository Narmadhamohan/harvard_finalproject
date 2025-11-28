  import React, { useState } from "react";
  import axios from "axios";
  import { postJob } from "../api/jobsApi";

  export default function PostJob() {
    const [form, setForm] = useState({
      title: "",
      description: "",
      location: "",
      salary_range: "",
      job_type: "",
      availability: "Full Day",
    });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };


    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

        <form onSubmit={postJob} className="space-y-4">

          <input name="title" placeholder="Job Title"
            className="w-full border p-2 rounded"
            onChange={handleChange} required />

          <textarea name="description" placeholder="Job Description"
            className="w-full border p-2 rounded"
            onChange={handleChange} />

          <input name="location" placeholder="Location"
            className="w-full border p-2 rounded"
            onChange={handleChange} />

          <input name="salary_range" placeholder="Salary Range"
            className="w-full border p-2 rounded"
            onChange={handleChange} />

          <select name="job_type" className="w-full border p-2 rounded"
            onChange={handleChange}>
            <option value="">Select Job Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Freelance</option>
          </select>

          <select name="availability" className="w-full border p-2 rounded"
            onChange={handleChange}>
            <option>Full Day</option>
            <option>Half Day</option>
            <option>Evening Hours</option>
          </select>

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Submit Job
          </button>
        </form>
      </div>
    );
  }
