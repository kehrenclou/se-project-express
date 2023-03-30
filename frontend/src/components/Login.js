/* --------------------------------- imports -------------------------------- */
import { useHistory } from "react-router-dom";
import UserForm from "./UserForm";
import { useAuth, useModal } from "../hooks";
import { api } from "../utils/api";
import * as auth from "../utils/auth";

/* ----------------------------- function Login ---------------------------- */
function Login({ onLoginSubmit }) {
  const history = useHistory();
  // const { currentUser, setCurrentUser } = useUser();
  const { setToken, setIsLoggedIn } = useAuth();
  const { setStatus, setIsToolTipOpen } = useModal();

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
    console.log("handlesubmit");
    auth
      .login(email, password) //QUESTION:what should happen if login fails (wrong pword)
      //how to get tooltip to trigger or should it? currently isnt
      //goes to catch block and no popups
      //not immediatly triggering usehook either
      //maybe because modal is already rendered
      //will try to use context somehow
      .then((res) => {
        if (res) {
          console.log({ res });
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
        console.log("catch");
        setStatus("fail");  //QUESTION: consolelog firing here but tootl tips are not opening modals
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
