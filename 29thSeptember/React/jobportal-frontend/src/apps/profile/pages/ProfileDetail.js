import { useEffect, useState } from "react";
import { fetchProfileById } from "../api/ProfileApi";
import { useParams, useNavigate } from "react-router-dom";
import QuickCompose from "../../mail/pages/QuickCompose";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [showCompose, setShowCompose] = useState(false);

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

 /* const openCompose = () => {
    navigate(`/mail/compose/${profile.user.email}`);
  }; */

  return (
    <div>
      <h2><b>{profile.full_name}</b></h2>
      <p><b>Location:</b> {profile.location}</p>
      <p><b>Skills:</b> {profile.skills}</p>
      <p><b>Experience:</b> {profile.experience}</p>
      <p><b>email:</b> {profile.user.email}</p>
      <div>{profile.user.description
        && <p><b>About the projects: </b>{profile.user.description}</p>}</div>

      {/* MESSAGE BUTTON */}
      <button
        onClick={() => setShowCompose(!showCompose)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {showCompose ? "Hide Message" : "Message"}
      </button>

      {/* COMPOSE MESSAGE BOX */}
      {showCompose && (
        <div className="mt-4">
          <QuickCompose
            receiverId={profile.id}
            receiverName={profile.full_name}
            receiverEmail={profile.user.email}
            onSent={() => setShowCompose(false)}
          />
        </div>
      )}
        <button
    onClick={() => navigate(-1)}
    className="bg-gray-200 px-4 py-2 rounded"
  >
    Back to All profiles
  </button>
    </div>
  );
}
