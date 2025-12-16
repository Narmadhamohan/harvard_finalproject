//hooks/useprofiles.jsx
// here i focus on setprofiles, setloading, prevcursor, nextcursor
// here i understand i should get data from db for profiles and cursor. so create a fun
// here i understand i should add usestate as [] or boolean or  null
// here i understand i should return 4 attr and 1 function
import { useState } from "react"
import { fetchProfiles } from "../api/ProfileApi";

export const useProfiles = () =>{
    const [profiles,setProfiles] = useState([]);
    const [loading,setLoading] = useState(false);
    const [nextcursor,setNextCursor] = useState(null);
    const [prevcursor,setPrevCursor] = useState(null);


const fetchProfileList = async(cursor="", search="") =>{
    try{
        setLoading(true);
        const data = await fetchProfiles(cursor,search);
        setProfiles(data.results || []);
        setNextCursor(data.next_cursor);
        setPrevCursor(data.prev_cursor);
    }catch(error){

    }finally{
        setLoading(false);
    }
};

return {profiles,prevcursor,nextcursor,loading,fetchProfileList};

}
