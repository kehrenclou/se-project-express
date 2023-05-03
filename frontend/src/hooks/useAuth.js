import { useCallback, useContext } from "react";
import { AuthContext } from "../contexts";

export const useAuth = () => {
  // if decoding token needed would happen here
  // example: const userData = token ? jwt.decode(token, ) : {};
  const { isLoggedIn, token, setToken, setIsLoggedIn, isLoaded, setIsLoaded } =
    useContext(AuthContext);

  const onSignOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setToken(undefined);
  }, []); 

  return {
    isLoaded,
    isLoggedIn,
    token,
    setToken,
    setIsLoggedIn,
    setIsLoaded,
    onSignOut,
  };
};
