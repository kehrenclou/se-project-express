/* --------------------------------- imports -------------------------------- */
import React, {useEffect, useHistory}from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../hooks";
import * as auth from "../utils/auth";
import {api} from "../utils/api";
/* ------------------------- function ProtectedRoute ------------------------ */
function ProtectedRoute({ children, ...props }) {
  const { isLoggedIn, setIsLoggedIn, token } = useAuth();
  const history=useHistory();
//TODO:
  //useEffect...auth.getcontent etc
//dependency [] once on load
useEffect(()=>{
  api.getInfo()//token declared when setting api
  // auth
  // .getContent(token) //endpoint /users/me- same as api.getInfo
  //in auth file- on load check token frontend auth.getcontent
  //sends with token in header - endpoint /users/me=>sendUserProfile from controller
  //QUESTION: how is the token able to return the user info - its getting it
  .then((res) => {
    if (res) {
      //res has all of user data
      setIsLoggedIn(true);
      loadAppInfo(); //load appinfo in this file -
      //is it ok to have load app info as separate function
    }
  })
  .catch((err) => {
    auth.handleAuthError(err);
    history.push("/signin");
  });
},[])
  return (
    <Route {...props}>
      {isLoggedIn ? children : <Redirect to={"/signin"} />}
    </Route>
  );
}

/* --------------------------------- exports -------------------------------- */
export default ProtectedRoute;
