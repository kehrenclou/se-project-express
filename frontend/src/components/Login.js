/* --------------------------------- imports -------------------------------- */
import { useHistory } from "react-router-dom";
import UserForm from "./UserForm";
import { useAuth, useUser } from "../hooks";
import { api } from "../utils/api";
import * as auth from "../utils/auth";

/* ----------------------------- function Login ---------------------------- */
function Login({ onLoginSubmit }) {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useUser();
  const { token, setToken, setIsLoggedIn, setStatus, setIsToolTipOpen } =
    useAuth();


  /* ------------------------------ handleSumbit ------------------------------ */
  //1.auth.login
  //2.sets jwt -local and to authContext
  //3.sets api headers with new token
  //4.sets isLoggedIn true to authContext
  //5. push to / route
  //on Fail 
  //1. sets status to fail in modalContext
  //2. sets isToolTipOpen to true in modalContext
  function handleSubmit(email, password) {
    auth 
      .login(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          api.setHeaders({
            authorization: `Bearer ${res.token}`, 
            "Content-Type": "application/json",
          });
          setIsLoggedIn(true);
          history.push("/");
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
