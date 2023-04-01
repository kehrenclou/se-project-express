/* --------------------------------- imports -------------------------------- */
import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ----------------------------- function Login ---------------------------- */
function UserForm({ title, submitText, text, linkText, link, onSubmit }) {
  /* -------------------------------- useState -------------------------------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });
/* -------------------------------- handlers -------------------------------- */
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailValid(event.target.validity.valid);
    setErrorMessage({ email: event.target.validationMessage });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordValid(event.target.validity.valid);
    setErrorMessage({ email: event.target.validationMessage });
  };

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(email, password);
  }
/* --------------------------------- return --------------------------------- */
  return (
    <div className="userform">
      <h2 className="userform__title">{title}</h2>
      <form className="userform__form" onSubmit={handleSubmit}>
        <input
          className="userform__input"
          placeholder="Email"
          id="input-userform-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <input
          className="userform__input"
          placeholder="Password"
          id="input-userform-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button className="button userform__button">{submitText}</button>
      </form>
      <div className="userform__text-container">
        {text}
        <Link to={link} className="userform__text">
          {linkText}
        </Link>
      </div>
    </div>
  );
}

/* --------------------------------- exports -------------------------------- */
export default UserForm;
