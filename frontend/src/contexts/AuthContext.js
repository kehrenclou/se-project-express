import { createContext, useState } from "react";

export const AuthContext = createContext();

export const useInitializeAuthStore = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [isLoaded, setIsLoaded] = useState(false); //tracks if finished loading info

  return {
    isLoggedIn,
    token,
    isLoaded,
    setToken,
    setIsLoggedIn,
    setIsLoaded,
  };
};
