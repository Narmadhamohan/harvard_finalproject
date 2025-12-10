import axios from "axios";

const MAIL_API = "http://127.0.0.1:8000/api/mails/";

export const fetchInbox = (token) => {
  return axios.get(MAIL_API, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchSent = (token) => {
  return axios.get(`${MAIL_API}?box=sent`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendMail = (data, token) => {
  console.log("sendmail");
  console.log("data: ", JSON.stringify(data));
  console.log("MAIL_API: ",MAIL_API);
  console.log("token: ",token);

  return axios.post(
    MAIL_API,
    JSON.stringify(data),
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};
