// src/apps/jobs/context/JobsContext.js
import { createContext, useContext } from "react";
import { useJobs } from "../hooks/useJobs";

const JobsContext = createContext();
//🪄 This makes your hook’s data globally available (no re-fetch when you navigate).
export const JobsProvider = ({ children }) => {
  const jobsData = useJobs(); // your custom hook reused here
  return <JobsContext.Provider value={jobsData}>{children}</JobsContext.Provider>;
};

export const useJobsContext = () => useContext(JobsContext);
