// AuthProvider.jsx
// central auth context - login, logout, and user state

import React, { createContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { email } or null

  // restore user on app start
  useEffect(() => {
   //
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // login: gets tokens and stores user
  const login = async (email, password) => {
    const res = await axiosClient.post("token/", { email, password });
    const { access, refresh } = res.data;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    //localStorage.setItem("user", email);
    //setUser({ email, accessToken: access });

     // ⬇️ Added at the last for chat purpose - Call API to get logged-in user details
  const userRes = await axiosClient.get("users/me/", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const fullUser = {
    id: userRes.data.id,
    username: userRes.data.username,
    email: userRes.data.email,
    accessToken: access,
  };
 // ⬇️ Save
  localStorage.setItem("user", JSON.stringify(fullUser));
  setUser(fullUser);
  // Closing here**************

    navigate("/dashboard");
  };
 

  // logout: clear storage and redirect
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
