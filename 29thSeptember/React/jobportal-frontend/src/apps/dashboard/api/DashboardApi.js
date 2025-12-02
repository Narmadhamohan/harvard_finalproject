import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/"; 

export const authAxios = axios.create({
baseURL : BASE_URL,
});



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
// 🔹 GET profile completion status
// ---------------------------------------
export const fetchProfileStatus = async () => {
  const res = await authAxios.get("profiles/status/");
  return res.data;
};

// ---------------------------------------
// 🔹 GET profile by ID (ProfileDetail)
// ---------------------------------------

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

//Save the edit version of dashboard profile

export async function updateProfile(data) {
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


