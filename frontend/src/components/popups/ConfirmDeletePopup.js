/* --------------------------------- imports -------------------------------- */
import React from "react";
import PopupWithForm from "./PopupWithForm";

import { useModal } from "../../hooks";

/* ----------------------- function ConirmDeletePopup ----------------------- */

function ConfirmDeletePopup({ onSubmit, onClose }) {
  /* ---------------------------------- hooks --------------------------------- */
  const { isConfirmDeletePopupOpen, isLoading } = useModal();

  /* --------------------------------- return --------------------------------- */
  return (
    <PopupWithForm
      isOpen={isConfirmDeletePopupOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      name="check-delete"
      title="Are you sure?"
      submitText={isLoading ? "Deleting" : "Yes"}
    />
  );
}

export default ConfirmDeletePopup;
