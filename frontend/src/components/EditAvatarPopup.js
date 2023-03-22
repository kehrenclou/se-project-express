/* --------------------------------- imports -------------------------------- */
import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

/* ------------------------ function EditAvatarPopup ------------------------ */
function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
    setErrorMessage("");
  }, [isOpen]);

  function handleLinkChange(event) {
    setInputValue(event.target.value);

    setIsLinkValid(event.target.validity.valid);
    setErrorMessage(event.target.validationMessage);
  }

  function handleSubmit() {
    onUpdateAvatar({
      avatar: inputValue,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
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
