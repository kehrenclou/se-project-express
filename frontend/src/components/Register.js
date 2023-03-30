/* --------------------------------- imports -------------------------------- */
import { useHistory, withRouter } from "react-router-dom";
import UserForm from "./UserForm";
import { useModal } from "../hooks";
import * as auth from "../utils/auth";

/* ----------------------------- function Register ---------------------------- */
function Register() {
  const history = useHistory();
  const { setStatus, setIsToolTipOpen } = useModal();

  /* ------------------------------ handleSubmit ------------------------------ */
  function handleSubmit(email, password) {
    console.log("handlesubmit");
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setStatus("success");
          setIsToolTipOpen(true);
          history.push("/signin");
        } else {
          setStatus("fail");
        }
      })
      .catch((err) => {
        auth.handleAuthError(err);
        setStatus("fail");
      })
      .finally(() => {
        setIsToolTipOpen(true);
      });
  }
  return (
    <div className="signup">
      <UserForm
        title="Sign Up"
        submitText="Sign up"
        text="Already a member?"
        linkText=" Log in here!"
        link="/signin"
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/* --------------------------------- exports -------------------------------- */
export default withRouter(Register);
