import axios from "axios";

const MAIL_API = "http://127.0.0.1:8000/api/mail/";

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
  return axios.post(
    MAIL_API,
    data,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};
