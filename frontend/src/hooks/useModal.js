import { useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const {
    isEditAvatarPopupOpen,
    isToolTipOpen,
    status,
    setIsEditAvatarPopupOpen,
    setIsToolTipOpen,
    setStatus,
  } = useContext(ModalContext);

  // console.log("from useModal file", isToolTipOpen, status);
  console.log("from useModal", isEditAvatarPopupOpen);
  return {
    isEditAvatarPopupOpen,
    isToolTipOpen,
    status,
    setIsEditAvatarPopupOpen,
    setIsToolTipOpen,
    setStatus,
  };
};
