import { createContext, useState } from "react";

export const ModalContext = createContext();

export const useInitializeModalStore = () => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess

  console.log("from modalstore file", status, isToolTipOpen);

  //question- move onclose function here and put in popup.js? or individual popups
  //should all of the set popup opens be in here?
  //what about selected card?
  return {
    isToolTipOpen,
    status,
    setIsToolTipOpen,
    setStatus,
  };
};
