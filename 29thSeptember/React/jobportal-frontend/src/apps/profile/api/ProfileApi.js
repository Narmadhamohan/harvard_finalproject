//import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const BASE_URL = "http://127.0.0.1:8000/api/";  // change if needed



// 🟦 Reusable axios instance with token injection

/*export const authAxios = axios.create({
baseURL : BASE_URL,
});
*/

const fetchProfileStatus = async () => {
  const res = await axiosClient.get("profiles/status/");
  return res.data;
};


// 🟦 Automatically attach token for every request
/* authAxios.interceptors.request.use((config) => {
const token = localStorage.getItem('accessToken');
if(token){
  // below one is not a setheader. it's just a field. remodify
//config.Authorization.setHeaders(token, `Bearer ${token}`);
config.headers.Authorization = `Bearer ${token}`;
}
return config;

});
*/
// ---------------------------------------
// 🔹 GET all profiles (used in ProfileList)
// is using wait, always use module heading with async.
// No fuction exists only with await. 
// ---------------------------------------
export const fetchProfiles = async(page = 1) => {
  console.log("inside fetchapiprofiles");
const response = await axiosClient.get(`profiles/`);
  console.log("inside the fetchProfiles_ProfileApi: ",response);
return response.data;
};

// ---------------------------------------
// 🔹 GET profile by ID (ProfileDetail)
// ---------------------------------------
export const fetchProfileById = async (id) => {

  try{
    // below Base_url could be changed. why? aS axios we did one tie setup of base url
   //const res =await authAxios.get(`${BASE_URL}/${id}/`);
   const res =await axiosClient.get(`profiles/${id}/`);
   console.log(res);
   return res.data
  }
  catch(error){
      throw error;
  }
};

