import { useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isConfirmDeletePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  } = useContext(ModalContext);

  return {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isConfirmDeletePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  };
};
