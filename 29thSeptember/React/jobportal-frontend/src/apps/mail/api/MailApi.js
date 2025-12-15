//import axios from "axios";
import axiosClient from "../../../api/axiosClient";

//const MAIL_API = "http://127.0.0.1:8000/api/mails/";
const MAIL_API = "/api/mails/"
export const fetchInbox = (token) => {
  /*return axios.get(MAIL_API, {
    headers: { Authorization: `Bearer ${token}` }
  }); */
  return axiosClient.get(MAIL_API); 
};

export const fetchSent = (token) => {
 /* return axios.get(`${MAIL_API}?box=sent`, {
    headers: { Authorization: `Bearer ${token}` }
  }); */
  return axiosClient.get(`${MAIL_API}?box=sent`);
};

export const sendMail = (data, token) => {
  console.log("sendmail");
  console.log("data: ", JSON.stringify(data));
  console.log("MAIL_API: ",MAIL_API);
  console.log("token: ",token);

  /* return axios.post(
    MAIL_API,
    JSON.stringify(data),
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  ); */

  return axiosClient.post("/api/mails/", data);



};
