import React from "react";
import Popup from "./Popup";
import success from "../../images/success.png";
import fail from "../../images/fail.png";
import { useModal } from "../../hooks";

function InfoToolTip() {

  const { isToolTipOpen, setIsToolTipOpen, status } = useModal();

  function closePopup() {
    setIsToolTipOpen(false);
  }

  return (
    <Popup isOpen={isToolTipOpen} onClose={closePopup} name="tooltip">
      {status === "success" ? (
        <div className="tooltip">
          <img className="tooltip__img" src={success} alt="Success graphic" />
          <p className="tooltip_text">Success! You have now been</p>
          <p className="tooltip_text">registered.</p>
        </div>
      ) : (
        <div className="tooltip">
          <img className="tooltip__img" src={fail} alt="Fail graphic" />
          <p className="tooltip_text">Oops, something went</p>
          <p className="tooltip_text">wrong! Please try again.</p>
        </div>
      )}
    </Popup>
  );
}

/* --------------------------------- exports -------------------------------- */
export default InfoToolTip;
