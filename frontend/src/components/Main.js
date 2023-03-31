/* --------------------------------- imports -------------------------------- */
import React, { useEffect, useState } from "react";
import Card from "./Card";
import { api } from "../utils/api";
import { useUser, useAuth, useModal } from "../hooks";

/* -------------------------- function Main(props) -------------------------- */
function Main({
  // onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  /* ------------------------------ hooks ------------------------------ */
  const { currentUser } = useUser();
  const { setToken, setIsLoggedIn, isLoggedIn, token } = useAuth();
  const { setIsEditAvatarPopupOpen } = useModal();
  /* -------------------------------- useStates ------------------------------- */
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});

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
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    console.log({setIsEditAvatarPopupOpen})
  }

  /* --------------------------------- return --------------------------------- */
  return (
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
            onClick={onEditProfileClick}
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
              onCardClick={onCardClick}
              onLikeClick={onCardLike}
              onCardDelete={onCardDelete}
              card={card}
              key={card._id}
              link={card.link}
              title={card.name}
              alt={card.name}
              ownerId={card.owner}
              imageId={card._id}
              likes={card.likes}
              likeCount={card.likes.length}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
