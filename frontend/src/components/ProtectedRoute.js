/* --------------------------------- imports -------------------------------- */
import React, {useEffect,} from "react";
import { Route, Redirect } from "react-router-dom";

/* ------------------------- function ProtectedRoute ------------------------ */
function ProtectedRoute({ children, loggedIn, ...props }) {
  return (
    <Route {...props}>
      {loggedIn ? children : <Redirect to={"/signin"} />}
    </Route>
  );
}

/* --------------------------------- exports -------------------------------- */
export default ProtectedRoute;
