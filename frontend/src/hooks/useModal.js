import { useContext } from "react";
import { ModalContext } from "../contexts";

//this should include handle signout
export const useModal = () => {
  const {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  } = useContext(ModalContext);

  return {
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isToolTipOpen,
    isLoading,
    status,
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsToolTipOpen,
    setIsLoading,
    setStatus,
  };
};
