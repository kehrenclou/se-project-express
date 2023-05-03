import React from "react";

function ImagePopup({ card, onClose }) {

  function handleOutsideClick(event) {
    if (card && event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`modal modal_type_image ${card ? "modal_open" : ""}`}
      id="modal-image-popup"
      onClick={handleOutsideClick}
    >
      <div className="modal__content modal__content_type_image">
        <button
          onClick={onClose}
          aria-label="Close Image Button"
          type="button"
          className="button modal__button-close"
          id="modal-image-close-button"
        />
        <img src={card?.link} alt={card?.name} className="modal__image" />
        <p className="modal__caption">{card?.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
