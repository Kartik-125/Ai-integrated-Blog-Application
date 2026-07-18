import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axios";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [adminToken,setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );

  const [userToken,setUserToken] = useState(
    localStorage.getItem("userToken")
  );

  const [user, setUser] = useState(null);

  const value = {
    axios: axiosInstance,

    adminToken,
    setAdminToken,
    
    userToken,
    setUserToken,
    
    user,
    setUser,
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