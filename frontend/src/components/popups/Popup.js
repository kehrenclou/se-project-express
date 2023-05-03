import React, { useRef } from "react";

function Popup({ isOpen, onClose, name, children }) {
  const popupRef = useRef();

  function handleModalClick(event) {
    if (isOpen && popupRef.current === event.target) {
      onClose();
    }
  }

  return (
    <div
      className={`modal ${isOpen ? "modal_open" : ""}`}
      id={`modal-${name}`}
      ref={popupRef}
      onClick={handleModalClick}
    >
      <div className="modal__content">
        <button 
          onClick={onClose}
          aria-label="Close Form Button"
          type="button"
          className="button modal__button-close"
          id={`${name}-close-button`}
        />
        {children}
      </div>
    </div>
  );
}

export default Popup;
