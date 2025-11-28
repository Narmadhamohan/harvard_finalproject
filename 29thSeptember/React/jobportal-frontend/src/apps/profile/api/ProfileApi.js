import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/";  // change if needed



// 🟦 Reusable axios instance with token injection

export const authAxios = axios.create({
baseURL : BASE_URL,
});


const fetchProfileStatus = async () => {
  const res = await authAxios.get("profiles/status/");
  return res.data;
};


// 🟦 Automatically attach token for every request
authAxios.interceptors.request.use((config) => {
const token = localStorage.getItem('accessToken');
if(token){
  // below one is not a setheader. it's just a field. remodify
//config.Authorization.setHeaders(token, `Bearer ${token}`);
config.headers.Authorization = `Bearer ${token}`;
}
return config;

});
// ---------------------------------------
// 🔹 GET all profiles (used in ProfileList)
// is using wait, always use module heading with async.
// No fuction exists only with await. 
// ---------------------------------------
export const fetchProfiles = async(page = 1) => {
    let url = `${BASE_URL}profiles/`;

    const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");
  console.log("inside the profile page: ",token);
  console.log("inside fetchapiprofiles");
const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log("inside the page: ",response.status);
    if (response.status === 401) {
         //      alert("Please login to view jobs.");
                    alert("Session expired. Please log in again.");
       // localStorage.removeItem("accessToken");
        window.location.href = "/";
        return; 
    }//throw new Error("Unauthorized");
  return await response.json();
};

// ---------------------------------------
// 🔹 GET profile by ID (ProfileDetail)
// ---------------------------------------
export const fetchProfileById = async (id) => {

  try{
    // below Base_url could be changed. why? aS axios we did one tie setup of base url
   //const res =await authAxios.get(`${BASE_URL}/${id}/`);
   const res =await authAxios.get(`profiles/${id}/`);
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


// ---------------------------------------
// 🔹 GET logged-in user profile
// ---------------------------------------
/*export const getProfile = () => {
  return authAxios.get(`${API_BASE}/me/`);
};


// ---------------------------------------
// 🔹 UPDATE logged-in user profile
// ---------------------------------------
export const updateProfile = (data) => {
  return authAxios.put(`${API_BASE}/update/`, data);
};
*/