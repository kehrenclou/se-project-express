import { useHistory, withRouter } from "react-router-dom";
import UserForm from "./UserForm";
import { useModal } from "../hooks";
import * as auth from "../utils/auth";

function Register() {
  const history = useHistory();
  const { setStatus, setIsToolTipOpen } = useModal();

  function handleSubmit(email, password) {

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
        console.log(err)
     
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

export default withRouter(Register);
