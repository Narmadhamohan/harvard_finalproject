import axiosClient from "./axiosClient";

export const getProfile = async () => axiosClient.get("profiles/");
export const updateProfile = async (data) => axiosClient.post("profiles/", data);
