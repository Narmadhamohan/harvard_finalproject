// src/pages/JobDetail.js
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
// import axios from "axios";
import axiosClient from "../../../api/axiosClient";


export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  //const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  //const [resumeFile, setResumeFile] = useState(null);
  //const [coverLetter, setCoverLetter] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchJobDetails();
    //checkIfClosed();
  },[]);
useEffect(() => {
  if (job) {
    console.log("JOB UPDATED:", job);
  }
  console.log("user details from context: ", user);
}, [job]);

const closeJob = async () => {
  try {
   /* const response = await axios.post(
      `http://127.0.0.1:8000/api/jobposts/${id}/close/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ); */
     const response = axiosClient.post("/api/jobposts/${id}/close/");


    setJob(prev => ({ ...prev, status: "closed" }));
    setMessage("Job closed successfully!");

  } catch (error) {
    console.error("Error closing job:", error);
    setMessage("Failed to close job.");
  }
};


  const fetchJobDetails = async () => {
    try {
     /* const response = await axios.get(
        `http://127.0.0.1:8000/api/jobposts/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      ); */

      const response = await axiosClient.get(
        `http://127.0.0.1:8000/api/jobposts/${id}/` ); 
      setJob(response.data);
      console.log("job detail: ",job);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  

  // --------------------------
  // JOB Applicants  - Removed. instead used navigate
  // --------------------------
  const fetchApplicants = async () => {

    try {

      /* const response = await axios.get(
        `http://127.0.0.1:8000/api/jobposts/${id}/applicants/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      ); */
      const response = await axiosClient.get(
        `http://127.0.0.1:8000/api/jobposts/${id}/applicants/`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
    <div>
    <div>
    <button name="View applicants" onClick={() => navigate(`/select-applicant/${id}`)}>View Applicants</button>
    </div>
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Job Type:</strong> {job.job_type}</p>
      <p><strong>Availability:</strong> {job.availability}</p>
      <p><strong>Salary:</strong> {job.salary_range}</p>
      <p className="my-4">{job.description}</p>
   
      {message && <p className="mt-3 text-blue-700">{message}</p>}

{
  job.user === user.id && job.status !=="closed" && (
    <button onClick={closeJob}     className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
>Close Job</button>
  )
}
      <button
        onClick={handleBack}
        className="mt-6 bg-gray-200 px-4 py-2 rounded"
      >
        Back to Job openings
      </button>
    </div>
    </div>
  );
}
