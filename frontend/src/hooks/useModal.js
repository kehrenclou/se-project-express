import { useCallback, useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const { isToolTipOpen, status, setIsToolTipOpen, setStatus } =
    useContext(ModalContext);

  console.log("from useModal file", isToolTipOpen, status);

  return { isToolTipOpen, status, setIsToolTipOpen, setStatus };
};
