import { createContext, useState } from "react";

export const AuthContext = createContext();

export const useInitializeAuthStore = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("jwt"));
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const [status, setStatus] = useState(""); //used for tooltip fail/sucess

    return {
        isLoggedIn,
        token,
        isToolTipOpen,
        status,
        setToken,
        setIsLoggedIn, 
        setIsToolTipOpen,
        setStatus,
    }
}