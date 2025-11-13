import axiosClient from "./axiosClient";

export const postJob = async (data) => axiosClient.post("jobposts/", data);
