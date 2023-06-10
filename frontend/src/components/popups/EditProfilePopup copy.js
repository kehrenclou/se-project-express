import React, { useEffect, useState, useCallback } from "react";
import PopupWithForm from "./PopupWithForm";

import { useUser, useModal } from "../../hooks";
import { api } from "../../utils/api";

function EditProfilePopup() {
  const { currentUser, setCurrentUser } = useUser();
  const {
    isEditProfilePopupOpen,
    setIsEditProfilePopupOpen,
    isLoading,
    setIsLoading,
  } = useModal();

  const [name, setName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.about || "");
  const [isNameValid, setIsNameValid] = useState(false);
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);

  const [errorMessage, setErrorMessage] = useState({
    name: "",
    description: "",
  });

  //input name change
  const handleNameChange = (event) => {
    setName(event.target.value);
    setIsNameValid(event.target.validity.valid);
    setErrorMessage({ name: event.target.validationMessage });
  };

  //input description change
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
   
    // setCurrentUser({ ...currentUser, about: event.target.value });
    setIsDescriptionValid(event.target.validity.valid);
    setErrorMessage({ description: event.target.validationMessage });
  };
  console.log({ name });
  console.log({ description });
  console.log({ currentUser });

  //Update User
  const handleUpdateProfile = useCallback(() => {

    setCurrentUser({...currentUser,about:description,name:name})
    setIsLoading(true);
    api
      .setUserInfo(name, description)
      .then((userData) => {
        setCurrentUser(userData);
        closePopup();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [name]);

  function closePopup() {
    setIsEditProfilePopupOpen(false);
  }

  useEffect(() => {
    if (currentUser) {

      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser, isEditProfilePopupOpen]);

  return (
    <PopupWithForm
      isOpen={isEditProfilePopupOpen}
      onClose={closePopup}
      onSubmit={handleUpdateProfile}
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
        value={name ?? ""}
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
        value={description ?? ""}
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
