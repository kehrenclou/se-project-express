/* --------------------------------- imports -------------------------------- */
import React, { useState, useEffect, useCallback } from "react";
import PopupWithForm from "./PopupWithForm";
import { useModal, useUser } from "../hooks";
import { api } from "../utils/api";

/* ------------------------ function EditAvatarPopup ------------------------ */
function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  /* -------------------------------- useState -------------------------------- */
  const [isLinkValid, setIsLinkValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  /* ---------------------------------- hooks --------------------------------- */
  const { isEditAvatarPopupOpen, setIsEditAvatarPopupOpen } = useModal();
  const { setCurrentUser } = useUser();
  /* ------------------------------- useEffects ------------------------------- */
  useEffect(() => {
    setInputValue("");
    setErrorMessage("");
  }, [isEditAvatarPopupOpen]);
  //may have erros dependency was isOpen
  /* -------------------------------- functions ------------------------------- */
  function handleLinkChange(event) {
    setInputValue(event.target.value);

    setIsLinkValid(event.target.validity.valid);
    setErrorMessage(event.target.validationMessage);
  }

  // function handleSubmit() {
  //   onUpdateAvatar({
  //     avatar: inputValue,
  //   });
  // }
  //not hooked up yet
  const handleUpdateAvatar = useCallback(() => {
    // setIsLoading(true);//TODO: add to modal hook

    api
      .setProfileAvatar(inputValue)
      .then((newAvatar) => {
        // setUserAvatar(newAvatar);
        setCurrentUser(newAvatar);
        // userStore.setCurrentUser(newAvatar);
        // closeAllPopups();
        closePopup();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }, [inputValue])

  function closePopup(){
    setIsEditAvatarPopupOpen(false);
  }
  /* --------------------------------- return --------------------------------- */
  return (
    <PopupWithForm
      isOpen={isEditAvatarPopupOpen}
      onClose={onClose}
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
