/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { UserContext } from "../contexts/UserContext";

/* ------------------------ function EditProfilePopup ----------------------- */

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = useContext(UserContext);
  const [name, setName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.about || "");
  const [isNameValid, setIsNameValid] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsNameValid(event.target.validity.valid);
    setErrorMessage({ name: event.target.validationMessage });
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setIsDescriptionValid(event.target.validity.valid);
    setErrorMessage({ description: event.target.validationMessage });
  };

  function handleSubmit() {
    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="edit-profile"
      title="Edit profile"
      submitText={isLoading ? "Saving" : "Save"}
    >
      <input
        name="input-name"
        placeholder="Name"
        className="modal__input"
        id="input-profile-name"
        type="text"
        minLength="2"
        maxLength="40"
        value={name}
        onChange={handleNameChange}
        required
      />
      <span
        className={`modal__error ${isNameValid ? "" : "modal__error_visible"}`}
        id="input-profile-name-error"
      >
        {errorMessage.name}
      </span>
      <input
        name="input-about"
        placeholder="About me"
        className="modal__input"
        id="input-profile-about"
        type="text"
        minLength="2"
        maxLength="200"
        value={description}
        onChange={handleDescriptionChange}
        required
      />
      <span
        className={`modal__error ${
          isDescriptionValid ? "" : "modal__error_visible"
        }`}
        id="input-profile-about-error"
      >
        {errorMessage.description}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
