import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchJobDetail } from "../api/jobsApi";



export default function AppliedJobDetails(){

    const {jobId} = useParams();
    const [application, setApplication] = useState(null);


    useEffect( ()=>
        fetchJobDetail(jobId).then(setApplication)
                
        
    ,[]);


    return(
        <div>
            
                <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-semibold">

            {application.job.title} (Already applied)
        </h2>
        </div>
              <p><strong>Location:</strong> 
            {application.job.location}
            </p>
               <p><strong>Location:</strong>      {application.job.job_type}</p>
            <p><strong>Location:</strong> {application.job.salary_range}</p>
             <p><strong>Location:</strong>            {application.job.id}</p>
        </div>

    );
}