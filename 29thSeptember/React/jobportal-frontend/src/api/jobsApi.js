// Destination  address formation panni , send with token .
// not a simple postman client call. but 1. exact formation of URL 2. Localstorage to give the token
//3. check the response and  throw error or return simple json
// this simple file is like what we do with postman client
// this will be called by another hook with receives these data and prepares for UI display
// also, the data for cusrsor and search to this page given by that hook

const BASE_URL = "http://127.0.0.1:8000/api/";

export const fetchJobsApi = async (cursor = "", search = "") => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token found");

  let url = `${BASE_URL}jobposts/`;
  const params = [];
  if (cursor) params.push(`cursor=${cursor}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (params.length) url += `?${params.join("&")}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });


    if (response.status === 401) {
         //      alert("Please login to view jobs.");
                    alert("Session expired. Please log in again.");
       // localStorage.removeItem("accessToken");
        window.location.href = "/";
        return; 
    }//throw new Error("Unauthorized");
  return await response.json();
};


export const fetchJobDetail = async (id) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jbposts/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch job details");
  return response.json();
};



export const applyForJob = async (id, token, formData) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}jbposts/${id}/apply/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return { ok: response.ok, data };
};