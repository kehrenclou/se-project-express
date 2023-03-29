/* --------------------------------- imports -------------------------------- */

import UserForm from "./UserForm";

/* ----------------------------- function Login ---------------------------- */
function Login({ onLoginSubmit }) {
  function handleSubmit(email, password) {
    // onLoginSubmit({ email, password });
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
