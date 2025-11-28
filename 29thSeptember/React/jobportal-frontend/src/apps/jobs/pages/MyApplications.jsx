import { useEffect, useState } from "react";
import { fetchMyApplication } from "../api/jobsApi";
export default function MyApplications(){
    const [applications, setApplications] = useState([])

    useEffect(() => {

        fetchMyApplication().then(setApplications);

    },[]);

return (
<div>    
{applications.length === 0 && <p> You havenot applied to any jobs yet</p>}

    <div>
        {applications.map((item) => 
        <Link key={item.job.id}  to={`/my-applications/${item.job.id}`}>
            
                      <p className="text-lg font-bold">Title:  {item.job.title} </p>
            <p className="text-sm text-gray-500"> {item.job.location} </p>
                        <p className="text-sm text-blue-600">Applied on: 
                        {new Date(item.job.applied_on).toLocaleDateString()}</p>
        </Link>
        ) }
        {/* above link to -> route  -> new page*/}
    </div>

</div>
);

}