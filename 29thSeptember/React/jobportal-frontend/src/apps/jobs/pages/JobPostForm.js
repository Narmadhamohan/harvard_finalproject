//apps/jobs/pages/JobPostForm
import { useState } from "react";
//import { postJob } from "..jobs/api/jobApi";

export default function JobPostForm() {
  const [job, setJob] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
   // await postJob(job);
    alert("Job posted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow">
      <input
        placeholder="Job Title"
        className="border p-2 w-full mb-2"
        onChange={(e) => setJob({ ...job, title: e.target.value })}
      />
      <textarea
        placeholder="Job Description"
        className="border p-2 w-full mb-2"
        onChange={(e) => setJob({ ...job, description: e.target.value })}
      ></textarea>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
    </form>
  );
}
