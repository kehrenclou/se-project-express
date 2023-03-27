import { useCallback, useContext, useHistory } from "react";
import { AuthContext } from "../contexts";

//this should include handle signout
export const useAuth = () => {
  const { isLoggedIn, token, setToken, setIsLoggedIn } =
    useContext(AuthContext);
  const history = useHistory();
  // const userData = token ? jwt.decode(token, ) : {};

  const handleSignOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setToken(undefined);
    history.push("/signin");
  }, []);

  return { isLoggedIn, token, setToken, setIsLoggedIn, handleSignOut };
};
