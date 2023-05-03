import React from "react";
import PopupWithForm from "./PopupWithForm";

import { useModal } from "../../hooks";


function ConfirmDeletePopup({ onSubmit, onClose }) {
  const { isConfirmDeletePopupOpen, isLoading } = useModal();

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
