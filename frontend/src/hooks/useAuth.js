import { useCallback, useContext, useHistory } from "react";
import { AuthContext } from "../contexts";

//this should include handle signout
export const useAuth = () => {
  const { isLoggedIn, token, setToken, setIsLoggedIn,isLoaded,setIsLoaded } =
    useContext(AuthContext);
  // const history = useHistory();
  // const userData = token ? jwt.decode(token, ) : {};
  console.log("from useAuth file", isLoggedIn);
  const handleSignOut = useCallback(() => {
    // setIsLoggedIn(false);
    // localStorage.removeItem("jwt");
    // setToken(undefined);
    // history.push("/signin");
  }, []);

  return {isLoaded,isLoggedIn, token, setToken, setIsLoggedIn, setIsLoaded,handleSignOut };
};
