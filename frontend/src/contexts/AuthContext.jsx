import React, { createContext, useState } from "react";
import axios from "axios";
import httpStatus from "http-status";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });
      console.log("Token:", response.data.token);

      if (response.status === httpStatus.OK) {
        localStorage.setItem("token", response.data.token);
        router("/home");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };
  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      if (response.status === httpStatus.OK) {
        console.log("Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        router("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
