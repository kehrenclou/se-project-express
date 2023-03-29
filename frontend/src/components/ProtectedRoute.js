/* --------------------------------- imports -------------------------------- */
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth, useUser } from "../hooks";
import { api } from "../utils/api";

/* ------------------------- function ProtectedRoute ------------------------ */
function ProtectedRoute({ children, ...props }) {
  const { isLoggedIn, setIsLoggedIn, token, setIsLoaded, isLoaded } = useAuth();
  const { currentUser, setCurrentUser } = useUser();

  /* ------------------------------- use Effects ------------------------------ */
  //protected route should olny return getInfo and not cards
  //ok to set user here
  //fires when loading protect route

  console.log({ isLoggedIn, currentUser });
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
          console.log("protectected route setuserdata", currentUser);
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

/* --------------------------------- exports -------------------------------- */
export default ProtectedRoute;
