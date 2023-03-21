/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import api from "../utils/api";
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

import { CurrentUserContext } from "../contexts/CurrentUserContext";

/* -------------------------------------------------------------------------- */
/*                                 functionApp                                */
/* -------------------------------------------------------------------------- */
function App() {
  /* ------------------------------- use states ------------------------------- */
  let history = useHistory();

  const [cards, setCards] = useState([]);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
    useState(false);

  const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [cardToDelete, setCardToDelete] = useState({});

  const [currentUser, setCurrentUser] = useState({
    name: " ",
    about: " ",
    avatar: " ",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [status, setStatus] = useState("");

  const [email, setEmail] = useState("email@email");
  /* -------------------------------- functions ------------------------------- */

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

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
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopoupOpen(false);
    setSelectedCard(null);
    setIsToolTipOpen(false);
  }

  /* --------------------------- handlers with apis --------------------------- */

  function handleUpdateUser(currentUser) {
    setIsLoading(true);
    api
      .setUserInfo(currentUser.name, currentUser.about)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);
    api
      .setProfileAvatar(newAvatar.avatar)
      .then((newAvatar) => {
        // setUserAvatar(newAvatar);
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }

  function handleConfirmDelete(event) {
    // event.preventDefault();
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

  /* ----------------------------- auth functions ----------------------------- */
  function handleRegisterSubmit({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res.data._id) {
          setStatus("success");
          setIsToolTipOpen(true);
          history.push("/signin");
        } else {
          setStatus("fail");
        }
      })
      .catch((err) => {
        auth.handleAuthError(err);
        setStatus("fail");
      })
      .finally(() => {
        setIsToolTipOpen(true);
      });
  }

  function handleLoginSubmit({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          setEmail(email);
          localStorage.setItem("jwt", res.token);
          history.push("/");
        } else {
          setStatus("fail");
          setIsToolTipOpen(true);
        }
      })
      .catch((err) => {
        auth.handleAuthError(err);
        setStatus("fail");
        setIsToolTipOpen(true);
      });
  }

  function handleSignOut() {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/signin");
  }
  /* --------------------------- useEffect api calls -------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      history.push("/signin");
    } else {
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.data.email);
            setIsLoggedIn(true);
            history.push("/");
            return res;
          }
        })
        .catch((err) => {
          auth.handleAuthError(err);
          history.push("/signin");
        });
    }
  }, [history]);

  useEffect(() => {
    api
      .getInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, []);

  useEffect(() => {
    api
      .getInitialCards()
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, []);

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

  /* --------------------------------- return --------------------------------- */
  return (
    <div className="root">
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Header email={email} onSignOut={handleSignOut} />
          <Switch>
            <ProtectedRoute exact path="/" loggedIn={isLoggedIn}>
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
            <Route path="/signup">
              <Register onRegisterSubmit={handleRegisterSubmit} />
            </Route>
            <Route path="/signin">
              <Login onLoginSubmit={handleLoginSubmit} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>
          <Footer />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
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
            onAddPlaceSubmit={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoToolTip
            isOpen={isToolTipOpen}
            onClose={closeAllPopups}
            status={status}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
