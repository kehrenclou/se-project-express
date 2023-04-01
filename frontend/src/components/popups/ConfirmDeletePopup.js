/* --------------------------------- imports -------------------------------- */
import React from "react";
import PopupWithForm from "./PopupWithForm";

/* ----------------------- function ConirmDeletePopup ----------------------- */

function ConfirmDeletePopup({ onClose, isOpen, onSubmit, isLoading }) {
// hooks

  /* --------------------------------- return --------------------------------- */
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      name="check-delete"
      title="Are you sure?"
      submitText={isLoading ? "Deleting" : "Yes"}
    />
  );
}

export default ConfirmDeletePopup;
