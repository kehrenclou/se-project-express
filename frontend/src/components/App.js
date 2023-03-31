/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import { api } from "../utils/api";
import * as auth from "../utils/auth";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import InfoToolTip from "./InfoToolTip";

// import { useAuth } from "../hooks";
import {
  UserContext,
  AuthContext,
  ModalContext,
  useInitializeAuthStore,
  useInitializeUserStore,
  useInitializeModalStore,
} from "../contexts";

/* -------------------------------------------------------------------------- */
/*                                 functionApp                                */
/* -------------------------------------------------------------------------- */
function App() {
  /* ------------------------------- use states ------------------------------- */
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const [isLoading, setIsLoading] = useState(false);

  // const [status, setStatus] = useState(""); //used for tooltip fail/sucess

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});

  // const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
    useState(false);
  // const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  /* --------------------- set history and context stores --------------------- */
  let history = useHistory();
  const authStore = useInitializeAuthStore();
  const userStore = useInitializeUserStore();
  const modalStore = useInitializeModalStore();

  /* --------------------------- useEffect  ----------------------------------- */
  //on load
  //use effect on token change set headers
  //currently calling local storage token not auth context
  //QUESTION: which token should it reference, using authStore.token in other apis
  //should a setToken call be made if local storage changes?
  //think about what would cause a token to change
  //for instance if a new user logs in
  useEffect(() => {
    api.setHeaders({
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }, [token]);

  //1. useEffect on load -
  //set token to local storage,
  //if there is a token in auth store, (sets from jwt on load)
  // set headers
  // get info (returns user profile?)
  // set authstore logged in trueset userinfo
  //sets authstore isloggedin true
  //sets userstore with profile
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
    console.log("jwtsettoken", token);
    console.log("authstoretoken", authStore.token); //returns token
    //no token on loading page
    if (!authStore.token) {
      console.log("ue no authstore token");
      history.push("/signin");
      return;
    }
    history.push("/"); //QUESTION check if this is correct only way
    //I could figure out how to get it to redirect if a token from signin or signup page
  }, []);

  //use effect gets cards from server & sets - when isLoggedIn state changes
  //isLoggedIn changes on handleLoginSubmit before protected route is loaded
  //api.getInitialCards
  //debugging not loggedin onload
  //moved to main
  // useEffect(() => {
  //   if (!authStore.isLoggedIn) {
  //     return;
  //   } //exit if not logged in
  //   api.setHeaders({
  //     authorization: `Bearer ${authStore.token}`, //QUESTION:which token should this be from store?
  //     "Content-Type": "application/json",
  //   });
  //   api
  //     .getInitialCards() //card info from server
  //     .then((initialCards) => {
  //       setCards(initialCards);
  //     })
  //     .catch((err) => {
  //       api.handleErrorResponse(err);
  //     });
  // }, [authStore.isLoggedIn]);

  useEffect(() => {
    const handleEscClose = (event) => {
      if (event.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", handleEscClose, false);
    return () => {
      document.removeEventListener("keydown", handleEscClose, false);
    };
  }, []);

  /* --------------------------- handlers with apis --------------------------- */
  //Update User
  function handleUpdateUser(input) {
    setIsLoading(true);
    api
      .setUserInfo(input.name, input.about)
      .then((userData) => {
        userStore.setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Update Avatar
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);

    api
      .setProfileAvatar(newAvatar.avatar)
      .then((newAvatar) => {
        // setUserAvatar(newAvatar);
        userStore.setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Like Unlike Card
  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some(
      (user) => user === userStore.currentUser._id
    );
    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          //state of cards before changing them
          //map returns array with each of its elements modified
          state.map((currentCard) =>
            // console.log(currentCard)
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }

  //Confirm Delete Card
  function handleConfirmDelete(event) {
    setIsLoading(true);
    api
      .deleteCard(cardToDelete._id)
      .then(() => {
        setCards(
          cards.filter(function (item) {
            return item._id !== cardToDelete._id;
          })
        );
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //Add New Card
  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api
      .addNewCard(newCard.name, newCard.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  /* ---------------------------handlers with auth----------------------------- */
  //register--moved to register
  // function handleRegisterSubmit({ email, password }) {
  //   auth
  //     .register(email, password)
  //     .then((res) => {
  //       if (res._id) {
  //         setStatus("success");
  //         setIsToolTipOpen(true);
  //         history.push("/signin");
  //       } else {
  //         setStatus("fail");
  //       }
  //     })
  //     .catch((err) => {
  //       auth.handleAuthError(err);
  //       setStatus("fail");
  //     })
  //     .finally(() => {
  //       setIsToolTipOpen(true);
  //     });
  // }

  //login --moved to login component
  //?should this also be calling loginuser from backendcontroller
  // function handleLoginSubmit({ email, password }) {
  //   auth
  //     .login(email, password)
  //     .then((res) => {
  //       if (res) {
  //         console.log("handleloginsubmit", res, email, password); //returns token and email
  //         localStorage.setItem("jwt", res.token);
  //         setToken(res.token);
  //         api.setHeaders({
  //           authorization: `Bearer ${res.token}`, //useAuth.token will be a response instead of useAuth
  //           "Content-Type": "application/json",
  //         });
  //         authStore.setIsLoggedIn(true);
  //         // fetchUserInfo();

  //         history.push("/");
  //       } else {
  //         setStatus("fail");
  //         setIsToolTipOpen(true);
  //       }
  //     })
  //     .catch((err) => {
  //       // auth.handleAuthError(err);
  //       console.log(err);
  //       setStatus("fail");
  //       setIsToolTipOpen(true);
  //     });
  // }

  //signout- moved to header
  // function handleSignOut() {
  //   authStore.setIsLoggedIn(false);
  //   userStore.setCurrentUser({})
  //   localStorage.removeItem("jwt");
  //   history.push("/signin");
  // }
  /* --------------------------handler functions ------------------------------- */

  // function handleEditAvatarClick() {
  //   setIsEditAvatarPopupOpen(true);
  // }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  function handleCardDelete(card) {
    setIsConfirmDeletePopoupOpen(true);
    setCardToDelete(card);
  }

  function closeAllPopups() {
    modalStore.setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopoupOpen(false);
    setSelectedCard(null);
    modalStore.setIsToolTipOpen(false);
  }
  /* --------------------------------- return --------------------------------- */
  return (
    <div className="root">
      <div className="page">
        <AuthContext.Provider value={authStore}>
          <UserContext.Provider value={userStore}>
            <ModalContext.Provider value={modalStore}>
              <Header />
              <Switch>
                <ProtectedRoute exact path="/">
                  <Main
                    // onEditAvatarClick={handleEditAvatarClick}
                    onEditProfileClick={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                </ProtectedRoute>
                <Route path="/signup">
                  <Register />
                </Route>
                <Route path="/signin">
                  <Login />
                </Route>
                <Route>
                  {authStore.isLoggedIn ? (
                    <Redirect to="/" />
                  ) : (
                    <Redirect to="/signin" />
                  )}
                </Route>
              </Switch>
              <Footer />
              <EditAvatarPopup
                // isOpen={modalStore.isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                isLoading={isLoading}
              />
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                isLoading={isLoading}
              />
              <ConfirmDeletePopup
                isOpen={isConfirmDeletePopupOpen}
                onClose={closeAllPopups}
                onSubmit={handleConfirmDelete}
                isLoading={isLoading}
              />
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                // onAddPlaceSubmit={handleAddPlaceSubmit}
                isLoading={isLoading}
              />
              <ImagePopup card={selectedCard} onClose={closeAllPopups} />
              <InfoToolTip onClose={closeAllPopups} />
            </ModalContext.Provider>
          </UserContext.Provider>
        </AuthContext.Provider>
      </div>
    </div>
  );
}

export default App;
