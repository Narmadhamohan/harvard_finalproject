//i understand that i use hooks to get loading, prevcursor,nextcursor,profilesfunction
// i understand i have intially load: nosearch,nocurosr. i count it as first useeffect
//i understand i have to later load: search,nocurosr. i count it as second useeffect
// i understand i have to load searchbar
// i understand i have to do prevcusror, nextcursor 
// i understand i have to check if cndtn: loaing? yes/no -> profiles? yes/no
// i undestand for profiles yes -> use map -> then onclick possiblity
// i understand onclick possibiity -> use navigate

// i understand forcursor -> disabled to make it nonclickable. classname for making it greyedout

import { useEffect, useState } from "react";
import {useProfiles} from "../hooks/useProfiles";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../../../components/SearchBar";

export default function ProfileList() {

const navigate = useNavigate();  
const [searchTerm,setSearchTerm] = useState(null);

  const {
    profiles,
    loading,
    nextCursor,
    prevCursor,
    fetchProfileList,
  } = useProfiles();




useEffect( ()=> {
    fetchProfileList(null,"")
},[]);
/*useEffect(
    fetchProfilesList("",searchTerm)
, [searchTerm]);
this runs for every searchterm value typing change. 
but to run only with click button, we use function call with searchbar
*/


 const handleSearch = (term) => {
    setSearchTerm(term);
    fetchProfileList(null, term);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-indigo-50 to-white min-h-screen">

      <h2 className="text-3xl font-bold mb-4 text-indigo-700 text-center">
        👤 Profiles
      </h2>
  <SearchBar
        onSearch={handleSearch}
        placeholder="Search by name or location..."
      />
      {
        loading?(<p>Loading Profiles</p>): profiles.length >0 ?  (
            <div>
            {
                profiles.map((p) =>(

                    <div
              key={p.id}
              onClick={() => navigate(`/profiles/${p.id}`)}
              className="cursor-pointer py-4 px-2 hover:bg-gray-100 transition"
            >
              <h3 className="text-lg font-semibold text-indigo-600">
                {p.full_name}
              </h3>
              <p className="text-sm text-gray-600">📍 {p.location}</p>
              <span>📍 {p.skills}</span>
              <span>💼 {p.education}</span>
              <span>💰 {p.experience}</span>
            </div>
                ))
            }
            </div>
        ):(<p>No Profiles Found</p>)
      }




        {/* Pagination */}
      <div className="flex justify-between mt-10">

        <button
          disabled={!prevCursor}
          onClick={() =>
            
            fetchProfileList(prevCursor, searchTerm)
          }
          className={`px-5 py-2 rounded-lg font-medium ${
            prevCursor
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          ⬅ Previous
     
       </button>
<button
          disabled={!nextCursor}
        onClick={() => fetchProfileList(nextCursor, searchTerm)}
          className={`px-5 py-2 rounded-lg font-medium ${
            nextCursor
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Next ➡
        </button>

      </div>

      </div>
      );
    }