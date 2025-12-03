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
    const email = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (email && token) setUser({ email });
  }, []);

  // login: gets tokens and stores user
  const login = async (email, password) => {
    const res = await axiosClient.post("token/", { email, password });
    const { access, refresh } = res.data;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", email);
    setUser({ email });
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
