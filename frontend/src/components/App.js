/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState, useMemo } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import {api} from "../utils/api";
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

import { AuthContext, useInitializeAuthStore, UserContext } from "../contexts";
import { NotFound } from "./NotFound";

/* -------------------------------------------------------------------------- */
/*                                 functionApp                                */
/* -------------------------------------------------------------------------- */
export function App() {
  /* ------------------------------- use states ------------------------------- */
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  const [isLoading, setIsLoading] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const [status, setStatus] = useState(""); //used for tooltip fail/sucess-moved to authcontext

  const [currentUser, setCurrentUser] = useState({
    name: " ",
    about: " ",
    avatar: " ",
    //test adding email and id
    email: "email@email.com",
    id: "",
  });

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopoupOpen] =
    useState(false);
  const [isToolTipOpen, setIsToolTipOpen] = useState(false);//moved to authcontext

  let history = useHistory();
  const authStore = useInitializeAuthStore();

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
  // const api = useMemo(() => {
  //   console.log("api usememo called");
  //   return new Api({
  //     baseUrl: baseUrl,
  //     headers: {
  //       authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   });
  // }, [token]);

  useEffect(() => {
    //api is the singleton instance of the Api class
    //TODO: write setHeaders function
    api.setHeaders({
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })
  }, [token])
  /* -----------------------set up- useContext Store ---------------------------- */
  const storeValue = useMemo(() => {
    return {
      currentUser,
    };
  }, [currentUser]);

  /* --------------------------- useEffect  ----------------------------------- */

  //1. useEffect on load - check tokens
  useEffect(() => {
    //setToken(localStorage.getItem("jwt"));

    if (!authStore.token) {
      history.push("/signin");
    } 
    // else {
    //   console.log("useeffectonload");
    //   //TODO:
    //   //move this part to protectedroute as a use effect
    //   auth
    //     .getContent(authStore.token) //endpoint /users/me
    //     //in auth file- on load check token frontend auth.getcontent
    //     //sends with token in header - endpoint /users/me=>sendUserProfile from controller
    //     //QUESTION: how is the token able to return the user info - its getting it
    //     .then((res) => {
    //       if (res) {
    //         //res has all of user data
    //         setIsLoggedIn(true);
    //         loadAppInfo(); //load appinfo in this file -
    //         //is it ok to have load app info as separate function
    //       }
    //     })
    //     .catch((err) => {
    //       auth.handleAuthError(err);
    //       history.push("/signin");
    //     });
    // }
  }, []);

  //this gets user info (w/o token) and setus Current User (used in context)
  //dependency: api changes
  //what triggers a new api -
  useEffect(() => {
    if (!authStore.token) {
      return; //exit if token is null, maybe set user undefined here?
    }
    api
      .getInfo() //user info from server -in api not auth
      // should this be auth? auth.getContent - same except this one has token

      .then((userData) => {
        console.log("ue after getinfo", userData);
        setCurrentUser(userData);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, [api]);

  //this gets cards and sets cards
  //triggered on isLoggedIn
  //should this also get triggered if a card is added?
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

  //this closes all popups and removes event listeners
  //triggered on pageload
  //is this enough of a trigger?
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
  //can this be reused?
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
  //TODO: move to Register
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
  //TODO: move this to login 
  //useAuth hook to get access to isLoggein
  //moved to login
  // function handleLoginSubmit({ email, password }) {
  //   auth
  //     .login(email, password)
  //     .then((res) => {
  //       if (res) {
  //         console.log("handleloginsubmit", res, email, password);
  //         localStorage.setItem("jwt", res.token);
  //         setToken(res.token);
  //         setIsLoggedIn(true);

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

  //signout moved to useAuth
  // function handleSignOut() {
  //   setIsLoggedIn(false);
  //   localStorage.removeItem("jwt");
  //   history.push("/signin");
  // }
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
        <AuthContext.Provider value={authStore}>
        <UserContext.Provider value={currentUser}>
          <Header onSignOut={handleSignOut} />
          {/* <Header email={email} onSignOut={handleSignOut} /> */}
          <Switch>
            <ProtectedRoute exact path="/">
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
              <Login  />
              {/* <Login onLoginSubmit={handleLoginSubmit} /> */}
            </Route>
            <Route>
              <NotFound/>
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
        </AuthContext.Provider>
      </div>
    </div>
  );
}
