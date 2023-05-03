import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth, useUser } from "../hooks";
import { api } from "../utils/api";

function ProtectedRoute({ children, ...props }) {
  const { isLoggedIn, setIsLoggedIn, token, setIsLoaded, isLoaded } = useAuth();
  const { setCurrentUser } = useUser();
console.log("isLoggedIn", isLoggedIn)
console.log("token",token)

  // on load - Protected route
  //checks for token
  //if token, update headers, getInfo, setIsLoggedIn, setIsLoaded, setCurrentUser
  useEffect(() => {
    if (!token) {
      return;
    }
    //update token in headers
    api.setHeaders({
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    api
      .getInfo()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setIsLoaded(true);
          setCurrentUser(res);
        }
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, []); 

  return (
    <Route {...props}>
      {!isLoaded ? null : isLoggedIn ? children : <Redirect to={"/signin"} />}
    </Route>
  );
}

export default ProtectedRoute;
