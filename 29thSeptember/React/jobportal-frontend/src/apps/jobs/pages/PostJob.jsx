  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";
  import { postJob } from "../api/jobsApi";


  export default function PostJob() {
      const navigate = useNavigate();

    const [form, setForm] = useState({
      title: "",
      description: "",
      location: "",
      salary_range: "",
      job_type: "",
      gst_number: "",
      availability: "Full Day",
    });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createJob= async (e)=>{
      e.preventDefault();
    console.log("job post form data: ", form);
    const {ok,data,status} =  await postJob(form);
      console.log("API OK: ", ok);
      console.log("API status: ", status);
      console.log("API data: ", data);
    if(!ok){
      alert("Job posting failed");
      return;
    }

    const jobId = data.id;
    // navigate(`/jobs/${jobId}`);
    //path: "/:id",         // NOT "/jobs/:id"
    navigate(`/posted-jobs/${jobId}`)
    }


const handleDetailsClick = (jobId) => {
  // why not listref.current in 2nd arg?
//sessionStorage.setItem("scrollpos", listref.current.scrollTop);
  //navigate(`/jobs/${jobId}`, {scrollStateMaintain:true});
    navigate(`/posted-jobs/${jobId}`, {scrollStateMaintain:true})

};
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Post a Job</h2>

        <form onSubmit={createJob} className="space-y-4">
        <div><b> * Job Title:</b></div>
          <input name="title" placeholder="Job Title"
            className="w-full border p-2 rounded"
            onChange={handleChange} required />

        <div><b>Description:</b></div>
          <textarea name="description" placeholder="Job Description"
            className="w-full border p-2 rounded"
            onChange={handleChange} required />

        <div><b>*Location:</b></div>
          <input name="location" placeholder="Location"
            className="w-full border p-2 rounded"
            onChange={handleChange} />
        <div><b>*Salary Range:</b></div>
          <input name="salary_range" placeholder="Salary Range"
            className="w-full border p-2 rounded"
            onChange={handleChange} />
         <div><b>*GST Number of the company:</b></div>
          <input name="gst_number" placeholder="gst_number"
            className="w-full border p-2 rounded"
            onChange={handleChange} />
        {/* <input
  type="text"
  name="gst_number"
  value={form.gst_number}
  onChange={handleChange}
  className="input"
/>
 */}

        <div><b>*Job type:</b></div>
          <select name="job_type" className="w-full border p-2 rounded"
            onChange={handleChange}>
            <option value="">Select Job Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Freelance</option>
          </select>

         {/* <select name="availability" className="w-full border p-2 rounded"
            onChange={handleChange}>
            <option>Full Day</option>
            <option>Half Day</option>
            <option>Evening Hours</option>
          </select> */}

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Submit Job
          </button>
        </form>
      </div>
    );
  }
