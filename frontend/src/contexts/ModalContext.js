import { createContext, useState } from "react";

export const ModalContext = createContext();

export const useInitializeModalStore = () => {
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess

  console.log("from modalstore file", status, isToolTipOpen);

  return {
    isToolTipOpen,
    status,
    setIsToolTipOpen,
    setStatus,
  };
};