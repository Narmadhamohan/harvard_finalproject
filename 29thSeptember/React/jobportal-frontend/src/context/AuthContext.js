import { createContext, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const res = await axiosClient.post("token/", {
        email,
        password,
      });
      const { access, refresh } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setUser({ email });
      navigate("/"); // ✅ redirect after login success
    } catch (error) {
      alert("Invalid credentials. Please check your email and password.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
