import { useContext } from "react";
import { ModalContext } from "../contexts";

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
