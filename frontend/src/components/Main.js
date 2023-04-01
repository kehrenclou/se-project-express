/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState } from "react";
import Card from "./Card";
import ImagePopup from "./popups/ImagePopup";
import ConfirmDeletePopup from "./popups/ConfirmDeletePopup";
import { api } from "../utils/api";
import { useUser, useAuth, useModal } from "../hooks";

/* -------------------------- function Main(props) -------------------------- */
function Main({
  // onEditAvatarClick,
  // onEditProfileClick,
  onAddPlaceClick,
  // onCardClick,
  // onCardLike,
  // onCardDelete,
}) {
  /* ------------------------------ hooks ------------------------------ */
  const { currentUser } = useUser();
  const { isLoggedIn, token } = useAuth();
  const {
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsConfirmDeletePopupOpen,
    setIsLoading,
  } = useModal();
  /* -------------------------------- useStates ------------------------------- */
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({}); // (maybe not a usestate but an api call )

  /* ------------------------------- useEffects ------------------------------- */

  //load cards on load
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    } //exit if not logged in
    api.setHeaders({
      authorization: `Bearer ${token}`, //token from useAuth
      "Content-Type": "application/json",
    });
    api
      .getInitialCards() //card info from server
      .then((initialCards) => {
        setCards(initialCards);
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }, [isLoggedIn]);

  /* -------------------------------- handlers -------------------------------- */
  //on EditAvatar Click
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  //on EditProfile Click
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
    console.log({ setIsEditProfilePopupOpen });
  }

  //on card click
  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard);
  }

  //on trash click
  function handleCardDeleteClick(card) {
    setIsConfirmDeletePopupOpen(true);
    setCardToDelete(card);
  }

  //Like or Unlike Card
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
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      });
  }

  //Confirm Delete Card - on confirm click
  function handleConfirmDelete() {
    setIsLoading(true);
    api
      .deleteCard(cardToDelete._id)
      .then(() => {
        setCards(
          cards.filter(function (item) {
            return item._id !== cardToDelete._id;
          })
        );
        handleClosePopups();
      })
      .catch((err) => {
        api.handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  //close Delete Confirm Popup
  function closeDeleteConfirmPopup() {
    setIsConfirmDeletePopupOpen(false);
    setSelectedCard(null);
  }
    //close Delete Confirm Popup & Image popup
    function handleClosePopups() {
      setIsConfirmDeletePopupOpen(false);
      setSelectedCard(null);
    }

  //onClose Image Popup

  /* --------------------------------- return --------------------------------- */
  return (
    <>
      <main>
        <section className="profile">
          <div
            className="profile__avatar"
            id="profile-avatar-container"
            onClick={handleEditAvatarClick}
          >
            <img
              className="profile__avatar-image"
              src={currentUser.avatar}
              alt="Profile"
              id="profile-avatar-image"
            />
          </div>

          <div className="profile__details">
            <h1 className="profile__name" id="profile-name">
              {currentUser.name}
            </h1>

            <button
              onClick={handleEditProfileClick}
              aria-label="Edit Profile Button"
              type="button"
              className="button profile__button-edit"
              id="edit-profile-open-button"
            />

            <p className="profile__about" id="profile-about">
              {currentUser.about}
            </p>
          </div>
          <button
            onClick={onAddPlaceClick}
            aria-label="Add Place Button"
            type="button"
            className="button profile__button-add"
            id="add-place-open-button"
          />
        </section>
        <section className="cards">
          <ul className="cards__list">
            {cards.map((card) => (
              <Card
                // look for redundancy
                onCardClick={handleCardClick}
                onLikeClick={handleCardLike} //updated
                onCardDelete={handleCardDeleteClick} //updated
                card={card}
                key={card._id}
                // link={card.link}
                // title={card.name}
                // alt={card.name}
                // ownerId={card.owner}
                // imageId={card._id}
                // likes={card.likes}
                // likeCount={card.likes.length}
              />
            ))}
          </ul>
        </section>
      </main>
      <ConfirmDeletePopup
        onClose={handleClosePopups}
        onSubmit={handleConfirmDelete}
      />
       <ImagePopup card={selectedCard} onClose={handleClosePopups} />
    </>
  );
}

export default Main;
