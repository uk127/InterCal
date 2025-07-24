import React, { createContext, useState, useContext, useEffect } from "react";

const User_Context = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    isLoggedIn: false,
    downloadOption: "pdf",
    enableBtnText: "Enable",
    rowsToPrint: [],
    maxSubjectCnt: Number(localStorage.getItem("maxSubjectCnt")) || 0,
  });

  useEffect(() => {
    const storedEmail = JSON.parse(localStorage.getItem("email"));
    const storedName = JSON.parse(localStorage.getItem("name"));

    if (storedEmail && storedName) {
      setUser((prev) => ({
        ...prev,
        email: storedEmail,
        name: storedName,
        isLoggedIn: true
      }));
    }
  }, []);

  const setSubjectCount = (count) => {
    setUser((prev) => ({ ...prev, maxSubjectCnt: count }));
    localStorage.setItem("maxSubjectCnt", count);
  };

  const incrementSubjectCount = () => {
    const updatedCount = user.maxSubjectCnt + 1;
    if (updatedCount > 10) return false;
    setUser((prev) => ({ ...prev, maxSubjectCnt: updatedCount }));
    localStorage.setItem("maxSubjectCnt", updatedCount);
    return true;
  };

  const decrementSubjectCount = () => {
    const updatedCount = Math.max(user.maxSubjectCnt - 1, 0);
    setUser((prev) => ({ ...prev, maxSubjectCnt: updatedCount }));
    localStorage.setItem("maxSubjectCnt", updatedCount);
  };

  return (
    <User_Context.Provider value={{ user, setUser, incrementSubjectCount, decrementSubjectCount, setSubjectCount }}>
      {children}
    </User_Context.Provider>
  );
};

export const useUser = () => {
  return useContext(User_Context);
};
