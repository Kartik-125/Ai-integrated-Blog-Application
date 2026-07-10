import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axios";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const value = {
    token,
    setToken,
    axios: axiosInstance,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};