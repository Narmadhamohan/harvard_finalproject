//import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const BASE_URL = "http://127.0.0.1:8000/api/"; 



// ---------------------------------------
// 🔹 GET profile completion status
// ---------------------------------------
export const fetchProfileStatus = async () => {
  const res = await axiosClient.get("profiles/status/");
  return res.data;
};

// ---------------------------------------
// 🔹 GET profile by ID (ProfileDetail)
// ---------------------------------------
export const fetchDashboardByEmail = async(email) => {
try{
const response = await axiosClient.get(`profiles/dashboard-profile/?email=${email}/`);
console.log("byemail: ",response.data);
return response.data;
}catch(error){
    return {ok:false,email: null};

}
}

/*
export const fetchDashboardByEmail = async (email) => {

  try{
    // below Base_url could be changed. why? aS axios we did one tie setup of base url
   //const res =await authAxios.get(`${BASE_URL}/${id}/`);
   const res =await authAxios.get(`profiles/dashboard-profile/?email=${email}/`);
   console.log(res);
   console.log(JSON.stringify(res.data, null, 2));
   return res.data
  }
  catch(error){
    if(error.response?.status === 401){
      alert("Session expired. Login Again.");
      window.location.href = "/";
    }
      throw error;


  }
};
*/
//Save the edit version of dashboard profile

export const updateProfile = async(data) => {
  try{
  const response = await axiosClient.post(`profiles/submit/`, data);
  return response.data;
  }catch(error){
    console.error(error.response?.data);
    return {ok: false, data: null};
  }
}
/*export async function updateProfile(data) {
  console.log("in save API: ",data);
  const accessToken = localStorage.getItem("accessToken");
  const url = BASE_URL+"profiles/submit/";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return await res.json();
}
*/

