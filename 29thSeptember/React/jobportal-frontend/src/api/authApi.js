import axiosClient from "./axiosClient";

export const login = async (email, password) => {
  const response = await axiosClient.post("token/", { email, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return response.data;
};

export const signup = async (username, email, password) => {
  return axiosClient.post("users/signup/", { username, email, password });
};
