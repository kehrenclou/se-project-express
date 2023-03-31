import { useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isToolTipOpen,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsToolTipOpen,
    setStatus,
  } = useContext(ModalContext);

  // console.log("from useModal file", isToolTipOpen, status);
  console.log("from useModal", isEditProfilePopupOpen);
  return {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isToolTipOpen,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsToolTipOpen,
    setStatus,
  };
};
