import { useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const {
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isConfirmDeletePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsAddPlacePopupOpen,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  } = useContext(ModalContext);

  return {
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isConfirmDeletePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsAddPlacePopupOpen,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  };
};
