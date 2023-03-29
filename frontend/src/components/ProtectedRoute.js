/* --------------------------------- imports -------------------------------- */
import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth, useUser } from "../hooks";
import { api } from "../utils/api";

/* ------------------------- function ProtectedRoute ------------------------ */
function ProtectedRoute({ children, ...props }) {
  const { isLoggedIn, setIsLoggedIn, token } = useAuth();
  const { currentUser, setCurrentUser } = useUser();

  /* ------------------------------- use Effects ------------------------------ */
  //protected route should olny reutn getInfo and not cards
  //ok to set user here
  //fires when loading protect route
  useEffect(() => {
    if (!token) {
      return;
    }
    console.log("protexctedroute ue called-token", token);
    api.setHeaders({
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    api
      .getInfo() //token declared when setting api - will it work?
      .then((res) => {
        if (res) {
          console.log("protectedroute return res", res);

          setIsLoggedIn(true);
          //res has all of user data
          // setIsLoggedIn(true);
          //set user context with user data
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
      {isLoggedIn ? children : <Redirect to={"/signin"} />}
    </Route>
  );
}

/* --------------------------------- exports -------------------------------- */
export default ProtectedRoute;
