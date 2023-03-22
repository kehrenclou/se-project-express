/* --------------------------------- imports -------------------------------- */

import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

/* -------------------------- function Main(props) -------------------------- */
function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const { name, about, avatar } = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div
          className="profile__avatar"
          id="profile-avatar-container"
          onClick={onEditAvatarClick}
        >
          <img
            className="profile__avatar-image"
            src={avatar}
            alt="Profile"
            id="profile-avatar-image"
          />
        </div>

        <div className="profile__details">
          <h1 className="profile__name" id="profile-name">
            {name}
          </h1>

          <button
            onClick={onEditProfileClick}
            aria-label="Edit Profile Button"
            type="button"
            className="button profile__button-edit"
            id="edit-profile-open-button"
          />

          <p className="profile__about" id="profile-about">
            {about}
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
