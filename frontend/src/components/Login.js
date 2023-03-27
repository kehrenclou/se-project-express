/* --------------------------------- imports -------------------------------- */

import UserForm from "./UserForm";
import React, { useHistory } from "react";
import { useAuth } from "../hooks";
import * as auth from "../utils/auth";
/* ----------------------------- function Login ---------------------------- */
function Login({ }) {
  const { setIsLoggedIn, setToken, setIsToolTipOpen, setStatus } = useAuth();
  const history = useHistory();

  function handleSubmit(email, password) {
    onLoginSubmit({ email, password });
    auth
      .login(email, password)
      .then((res) => {
        if (res) {
          console.log("handleloginsubmit", res, email, password);
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          setIsLoggedIn(true);

          history.push("/");
        } else {
          setStatus("fail");
          setIsToolTipOpen(true);
        }
      })
      .catch((err) => {
        // auth.handleAuthError(err);
        console.log(err);
        setStatus("fail");
        setIsToolTipOpen(true);
      });
  }
  return (
    <div className="signup">
      <UserForm
        title="Log in"
        submitText="Log in"
        text="Not a member yet?"
        linkText="Sign up here!"
        link="/signup"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/* --------------------------------- exports -------------------------------- */
export default Login;
