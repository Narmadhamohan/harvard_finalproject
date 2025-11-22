import { useEffect, useState } from "react";
import { fetchProfileById } from "../api/ProfileApi";
import { useParams, useNavigate } from "react-router-dom";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const loadData = async() => {
      try{
    const res = await fetchProfileById(id);
    console.log(res); 
    setProfile(res); ;
   
    //setProfile(res.);
      }
      catch(err){
        console.log(err);
      }
    }
    loadData();
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  const openCompose = () => {
    navigate(`/mail/compose/${profile.user.email}`);
  };

  return (
    <div>
      <h2>{profile.full_name}</h2>
      <p><b>Location:</b> {profile.location}</p>
      <p><b>Skills:</b> {profile.skills}</p>
      <p><b>Experience:</b> {profile.experience}</p>

      <button onClick={openCompose}>Message</button>
    </div>
  );
}
