/* --------------------------------- imports -------------------------------- */
import React from "react";
import PopupWithForm from "./PopupWithForm";

import { useModal } from "../../hooks";

/* ----------------------- function ConirmDeletePopup ----------------------- */

function ConfirmDeletePopup({ onSubmit }) {
  /* ---------------------------------- hooks --------------------------------- */
  const { isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen, isLoading } =
    useModal();

  /* -------------------------------- handlers -------------------------------- */

  function closePopup() {
    setIsConfirmDeletePopupOpen(false);
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <PopupWithForm
      isOpen={isConfirmDeletePopupOpen}
      onClose={closePopup}
      onSubmit={onSubmit}
      name="check-delete"
      title="Are you sure?"
      submitText={isLoading ? "Deleting" : "Yes"}
    />
  );
}

export default ConfirmDeletePopup;
