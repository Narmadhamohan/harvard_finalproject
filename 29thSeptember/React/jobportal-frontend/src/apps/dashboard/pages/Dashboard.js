import React, { useEffect,useState } from "react";
import Sidebar from "../../../components/Sidebar--nottused";
import "../../../theme.css";
import { fetchDashboardByEmail,fetchProfileStatus } from "../api/DashboardApi";
import { useParams, useNavigate } from "react-router-dom";


import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Dashboard() {

  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [statusData,setStatusData] = useState(null);

useEffect( ()=>{
    if (!user) return;

        console.log("startig");

  const loadData = async () => {
    try{
      console.log("id",user?.email);
   const res = await fetchDashboardByEmail(user?.email);
    setProfile(res)
    const status = await fetchProfileStatus();
    setStatusData(status);
  }
catch(err){
  console.log("Cannot load profile: ", err);
}
  }
loadData();

}
,[user]);




if(!profile) {
  return <div>Loading!</div>
}

  return (




    <div className="dashboard" key={profile.id} >
  
statusData && !statusData.is_complete && (
  <div className="bg-yellow-200 text-yellow-800 p-4 rounded mb-4 shadow">
    <strong>Complete your profile</strong> to unlock full dashboard access.
    <div className="mt-2 text-sm">
      Missing: {status.missing_fields.join(", ")}
    </div>
  </div>
)

     {/* <Sidebar /> */}
      <main className="content">
        <h1>Welcome {profile.full_name}, </h1>
        <div>Your Job Portal Dashboard</div>
        <div>skills {profile.skills}</div>
    <div><b>education</b> {profile.education}</div>
    <div><b>experience</b> {profile.experience}</div>
    <div><b>location</b> {profile.location}</div>
    <div><b>full_name</b> {profile.full_name}</div>
    <div><b>preferred_mode:</b> {profile.preferred_mode}</div>
      </main>
    </div>
  );
}

