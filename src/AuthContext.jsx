// src/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("is_logged_in")) || false
  );

  const [user, setUser] = useState({
    name: JSON.parse(localStorage.getItem("user_name")) || "",
    email: JSON.parse(localStorage.getItem("user_email")) || "",
    id: JSON.parse(localStorage.getItem("user_id")) || "",
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);

    localStorage.setItem("is_logged_in", true);
    localStorage.setItem("user_name", JSON.stringify(userData.name));
    localStorage.setItem("user_email", JSON.stringify(userData.email));
    localStorage.setItem("user_id", JSON.stringify(userData.id));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({ name: "", email: "", id: "" });
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
