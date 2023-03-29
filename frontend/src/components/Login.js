/* --------------------------------- imports -------------------------------- */

import UserForm from "./UserForm";
import { useAuth, useUser } from "../hooks";
import { api } from "../utils/api";
import * as auth from "../utils/auth";

/* ----------------------------- function Login ---------------------------- */
function Login({ onLoginSubmit }) {
  const { currentUser, setCurrentUser } = useUser();
  const { token, setToken, setIsLoggedIn, setStatus, setIsToolTipOpen } =
    useAuth();

  // function handleSubmit(email, password) {
  //   onLoginSubmit({ email, password });

  // }
  function handleSubmit( email, password ) {
   
    //error from email and password being undefined - fixed
    //not going to next page
    //islogged in is changing to true but not calling anything to push to /
    auth

      .login(email, password)
      .then((res) => {
        if (res) {
          console.log("handleloginsubmit", res, email, password); //returns token and email
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          api.setHeaders({
            authorization: `Bearer ${res.token}`, //useAuth.token will be a response instead of useAuth
            "Content-Type": "application/json",
          });
          setIsLoggedIn(true);
          // fetchUserInfo();
          //history broke code before may not need it if other stuff set up correctly
          // history.push("/");
        } else {
          console.log("fail");
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
