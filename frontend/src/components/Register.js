/* --------------------------------- imports -------------------------------- */
import {withRouter} from 'react-router-dom';
import UserForm from "./UserForm";

/* ----------------------------- function Register ---------------------------- */
function Register({ onRegisterSubmit }) {
  function handleSubmit(email, password) {
    //needs to push up to App.js?//

    onRegisterSubmit({ email, password });
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
