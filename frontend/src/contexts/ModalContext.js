import { createContext, useState } from "react";

export const ModalContext = createContext();

export const useInitializeModalStore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  // const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  // const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
  //   useState(false);

  console.log("from modalstore file", status, isToolTipOpen);

  //question- move onclose function here and put in popup.js? or individual popups
  //should all of the set popup opens be in here?
  //what about selected card?
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
