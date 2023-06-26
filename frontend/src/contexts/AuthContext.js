import { createContext, useState } from "react";

export const AuthContext = createContext();

export const useInitializeAuthStore = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  return {
    isLoggedIn,
    token,

    setToken,
    setIsLoggedIn,
  };
};
