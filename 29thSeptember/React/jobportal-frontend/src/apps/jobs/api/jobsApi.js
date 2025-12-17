// Destination  address formation panni , send with token .
// not a simple postman client call. but 1. exact formation of URL 2. Localstorage to give the token
//3. check the response and  throw error or return simple json
// this simple file is like what we do with postman client
// this will be called by another hook with receives these data and prepares for UI display
// also, the data for cusrsor and search to this page given by that hook

import axios from "axios";
import axiosClient from "../../../api/axiosClient";

const BASE_URL = "http://127.0.0.1:8000/api/";

export const fetchJobsApi = async (url=null, search = "") => {
  //const token = localStorage.getItem("accessToken");
  //if (!token) throw new Error("No token found");
  console.log("inside the page - 1: ",url);

  //url = `jobposts/`;
  const params = [];
  //if (cursor) params.push(`cursor=${cursor}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (params.length) url += `?${params.join("&")}`;
    console.log("inside the page - 2: ",url);

  /*const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }); */
 const response =await axiosClient.get(url);

  console.log("inside the page: ",response.status);
    if (response.status === 401) {
         //      alert("Please login to view jobs.");
                    alert("Session expired. Please log in again.");
       // localStorage.removeItem("accessToken");
        window.location.href = "/";
        return; 
    }//throw new Error("Unauthorized");
  //return await response.json();
  return {
    data: response.data,
    status: response.status
  };
};


/*export const fetchJobDetail = async (id) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jobposts/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }); 
  if (!response.ok) throw new Error("Failed to fetch job details");
  return response.json();
};
*/
export const fetchJobDetail = async (id) => {
try{
  const response = await axiosClient.get(`jobposts/${id}/`);
  return response.data;
}catch(error){
  throw error;
}
};



/*export const applyForJob = async (id, formData) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jobposts/${id}/apply/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, data };
};*/
export const applyForJob = async(id,formData) =>{
  try{
  const response = await axiosClient(`jobposts/${id}/apply/`, {formData});
  return {ok: true, data: response.data};
  }catch(error){
    return {ok:false,data: null};
  }
}

/* export const fetchMyApplication = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}applicants`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
*/
export const fetchMyApplication = async () =>{
  try{
  const response  = await axiosClient.get("applicants/");
  return {ok: true, data: response.data};
  }
catch(error){
  return {ok:false, data: null};
}
}
/*export const postJob = async (formData) => {
  const token = localStorage.getItem("accessToken");
  try{
  const response = await fetch(`${BASE_URL}jobposts/`, {
    method: "POST",
    headers: {
      // added JSON.stringify instead of palin js
      // added cotenttype with double quotes for solving queryparam -plain js in url
    "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData)
,
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}catch(error){
  return {ok: false, status: 0, data: null};
}
};
*/
export const postJob = async(formData) =>{
  try{
    const response = await axiosClient.post(`jobposts/`,formData);
    return {ok: true, status: response.status, data: response.data};
  }catch(error){
    return {ok: false, status: 0, data: null};
  }
} 

{/* below find postman url of posted jobs i.e list of the loggedin recruiter*/}
/*export const managePostedJobs = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jobposts/my-posts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  const data = await response.json();
  return { ok: response.ok, data };
};*/
export const managePostedJobs = async () => {
  try{
  const response = await axiosClient.get(`jobposts/my-posts`);
    return { ok: true, data: response.data };
  }catch(error){
    return { ok: false, data:null };
  }
}

/*export const manageApplicants =  async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jobposts/${id}applicants`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  const data = await response.json();
  return { ok: response.ok, data };
}; */
export const manageApplicants =  async (id) => {
  try{
  const response = await axiosClient.get(`jobposts/${id}applicants`);
    return { ok: true, data: response.data };
  }catch(error){
  return { ok: false, data: null };
  }
}
