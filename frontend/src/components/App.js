/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState, useMemo } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import Api from "../utils/api";
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

import { UserContext } from "../contexts/UserContext";

/* -------------------------------------------------------------------------- */
/*                                 functionApp                                */
/* -------------------------------------------------------------------------- */
function App() {
  /* ------------------------------- use states ------------------------------- */
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess

  const [currentUser, setCurrentUser] = useState({
    name: " ",
    about: " ",
    avatar: " ",
    //test adding email and id
    email:"",
    id:"",
  });

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
    useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);

  let history = useHistory();

  /* -------------------------------- setup API ------------------------------- */
  const baseUrl = "http://localhost:3000"; //trying 3001
  // const baseUrl = "http://localhost:3000";
  // const api = new Api({
  //   baseUrl: baseUrl,
  //   headers: {
  //     authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //   },
  //   // headers: { authorization: token, "Content-Type": "application/json" },
  // });
  const api = useMemo(() => {
    console.log("api usememo called");
    return new Api({
      baseUrl: baseUrl,
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }, [token]);

  /* --------------------------- useEffect  ----------------------------------- */
  //on load
  //on loggedIn change
  //loads user info and card info here
  //not loading current data
  //?how is jwt being updated

  //1. useEffect on load - check tokens
  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
    console.log("token", token);
    //no token on loading page
    if (!token) {
      history.push("/signin");
    } else {
      auth
        .getContent(token) //in auth file- on load check token frontend auth.getcontent
        //sends with token in header - endpoint /users/me=>sendUserProfile from controller
        //QUESTION: how is the token able to return the user info - its getting it
        .then((res) => {
          if (res) {
            console.log("useeffect check token", res);
            setIsLoggedIn(true);
      
            loadAppInfo(); //load appinfo in this file
            console.log("loggedin?", isLoggedIn);
          }
        })
        .catch((err) => {
          auth.handleAuthError(err);
          history.push("/signin");
        });
    }
  }, []);

  useEffect(() => {
    console.log("history changed");
    if (!token) {
      return;
    } //exit if token is null, maybe set user undefined here
    api
      .getInfo() //user info from server
      // .getAppInfo()

      .then((userData) => {
        console.log("ue after getinfo", userData);
        setCurrentUser(userData);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, [api]);

  // const fetchUserInfo = useCallback(() => {
  //   console.log("fetchUserInfo");
  //   api
  //     .getInfo() //user info from server
  //     // .getAppInfo()

  //     .then((userData) => {
  //       console.log("ue after fetchuserinfo", userData);
  //       setCurrentUser(userData);
  //     })
  //     .catch((err) => {
  //       api.handleErrorResponse(err);
  //     });
  // }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    } //exit if not logged in
    api
      .getInitialCards() //card info from server
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, [isLoggedIn]);

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

  /* ------------------------------ api functions ----------------------------- */
  function loadAppInfo() {
    api
      .getAppInfo() //api return cards and info
      //already has user info from what is calling this?redundant
      .then(([userData, cardData]) => {
        console.log("ue after getappinfo", userData, cardData);
        setCurrentUser(userData); //setting user data -
        //but not context unless that is called in a useffect
        setCards(cardData); //set card data - but not rendering?
        //what should trigger to go to /?history
        //try history here  - this works is this correct
        history.push("/");
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }

  /* --------------------------- handlers with apis --------------------------- */
  //Update User
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

  //Update Avatar
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

  //Like Unlike Card
  function handleCardLike(card) {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((user) => user === currentUser._id);
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
  //register
  function handleRegisterSubmit({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res._id) {
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

  //login
  //?should this also be calling loginuser from backendcontroller
  function handleLoginSubmit({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        if (res) {
          console.log("handleloginsubmit", res, email, password);
          localStorage.setItem("jwt", res.token);
          setToken(res.token);
          setIsLoggedIn(true);
          // fetchUserInfo();

          history.push("/");
        } else {
          setStatus("fail");
          setIsToolTipOpen(true);
        }
      })
      .catch((err) => {
        // auth.handleAuthError(err);
        console.log(err);
        setStatus("fail");
        setIsToolTipOpen(true);
      });
  }

  //signout
  function handleSignOut() {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/signin");
  }
  /* --------------------------handler functions ------------------------------- */

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
  /* --------------------------------- return --------------------------------- */
  return (
    <div className="root">
      <div className="page">
        <UserContext.Provider value={currentUser}>
          <Header onSignOut={handleSignOut} />
          {/* <Header email={email} onSignOut={handleSignOut} /> */}
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
        </UserContext.Provider>
      </div>
    </div>
  );
}

export default App;
