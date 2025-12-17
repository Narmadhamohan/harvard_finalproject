// data vaikira aluvalagam - as like temp db or RAM
//data vachi postman client api ku kodukalam
// postman client api la irunthu vangalam
// interconnection between ui layer and permanent db
import { useState, useEffect } from "react";
//below one is postmanclient api
import { fetchJobsApi } from "../api/jobsApi";

// Aim is to   return { jobs, loading, nextCursor, prevCursor, fetchJobs };
export const useJobs = (initialSearch = "") => {
    
const [jobs,setJobs] =useState([]);
const [nextCursor,setNextCursor] =useState(null);
const [prevCursor,setPrevCursor] =useState(null);
const [loading,setLoading] = useState(false);
const fetchJobs = async(url, search=initialSearch) => {
    try{
  console.log("inside the page: hook");

        setLoading(true);
        

        const {data,status} =  await fetchJobsApi(url, search);
        console.log("Data: ",data);
            setJobs(data.results || []);
            setNextCursor(data.next_cursor);
            setPrevCursor(data.previous_cursor);

    }catch(error){
              console.error(error.message);

    }finally{
        setLoading(false);
    }

}




  return { jobs, loading, nextCursor, prevCursor, fetchJobs };
};
