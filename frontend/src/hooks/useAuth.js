import { useCallback, useContext } from "react";
import { AuthContext } from "../contexts";

//this should include handle signout
//cant useHistory in a hook
export const useAuth = () => {
  // if decoding token needed would happen here
  // const userData = token ? jwt.decode(token, ) : {};
  const { isLoggedIn, token, setToken, setIsLoggedIn, isLoaded, setIsLoaded } =
    useContext(AuthContext);

  const onSignOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setToken(undefined);
  }, []);

  console.log("from useAuth file", isLoggedIn);
  
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
