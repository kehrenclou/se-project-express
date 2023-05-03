import React, { useState, useEffect, useCallback } from "react";
import PopupWithForm from "./PopupWithForm";
import { useModal, useUser } from "../../hooks";
import { api } from "../../utils/api";

function EditAvatarPopup() {
  const {
    isEditAvatarPopupOpen,
    setIsEditAvatarPopupOpen,
    isLoading,
    setIsLoading,
  } = useModal();

  const { setCurrentUser } = useUser();

  const [isLinkValid, setIsLinkValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
    setErrorMessage("");
  }, [isEditAvatarPopupOpen]);

  function handleLinkChange(event) {
    setInputValue(event.target.value);

    setIsLinkValid(event.target.validity.valid);
    setErrorMessage(event.target.validationMessage);
  }

  const handleUpdateAvatar = useCallback(() => {
    setIsLoading(true);

    api
      .setProfileAvatar(inputValue)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closePopup();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputValue]);

  function closePopup() {
    setIsEditAvatarPopupOpen(false);
  }
  return (
    <PopupWithForm
      isOpen={isEditAvatarPopupOpen}
      onClose={closePopup}
      onSubmit={handleUpdateAvatar}
      name="change-avatar"
      title="Change profile picture"
      submitText={isLoading ? "Saving" : "Save"}
    >
      <input
        name="input-avatar-link"
        placeholder="Avatar link"
        className="modal__input"
        id="input-avatar-link"
        type="url"
        onChange={handleLinkChange}
        value={inputValue}
        required
      />
      <span
        className={`modal__error ${isLinkValid ? "" : "modal__error_visible"}`}
        id="input-avatar-link-error"
      >
        {errorMessage}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
