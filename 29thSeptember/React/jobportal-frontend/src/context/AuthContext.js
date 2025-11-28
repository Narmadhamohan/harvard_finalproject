import { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

    // ⭐ Restore user from localStorage when app starts¶
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
      setUser({ email });
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const res = await axiosClient.post("token/", {
        email,
        password,
      });
      const { access, refresh } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", email); // ⭐ Save for later reload¶

      setUser({ email });
      navigate("/dashboard"); // ✅ redirect after login success
    } catch (error) {
      alert("Invalid credentials. Please check your email and password.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
