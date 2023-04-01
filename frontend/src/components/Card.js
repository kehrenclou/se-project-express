/* --------------------------------- imports -------------------------------- */
import React, { useContext } from "react";
import { useUser } from "../hooks";
// import { UserContext } from "../contexts/UserContext";

/* ------------------------------ function Card ----------------------------- */
export default function Card({
  onCardClick,
  onLikeClick,
  onCardDelete,
  card,
  // link,
  // name,
  // title,
  // likeCount,
 
}) {
  /* ------------------------------ custom hooks ------------------------------ */
  const { currentUser } = useUser();

  /* ------------------------------ declarations ------------------------------ */

const likeCount=card.likes.length;

  const isOwn = card.owner === currentUser._id;
  // const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((user) => user === currentUser._id);
  // const isLiked = card.likes.some((user) => user._id === currentUser._id);

  const cardDeleteButtonClassName = ` button cards__button_type_delete ${
    isOwn ? "cards__button_type_delete-active" : ""
  }`;

  const cardLikeButtonClassName = ` button cards__button_type_like ${
    isLiked ? "cards__button_type_like-active" : " "
  }`;
  /* -------------------------------- functions ------------------------------- */
  //selects card 
  function handleCardClick() {
    onCardClick(card);
  }

  //like handler
  function handleLikeClick() {
    onLikeClick(card);
  }

  //delete handler
  function handleDeleteClick() {
    onCardDelete(card);
  }

  /* --------------------------------- return --------------------------------- */
  return (
    <li className="cards__item">
      <button
        onClick={handleDeleteClick}
        aria-label="Delete button"
        type="button"
        className={cardDeleteButtonClassName}
        id="place-delete-button"
      />
      <img
        onClick={handleCardClick}
        src={card.link}
        alt={card.name}
        className="cards__image"
        id="card-image"
      />
      <div className="cards__textbox">
        <h2 className="cards__text" id="card-text">
          {card.title}
        </h2>
        <div className="cards__like-container">
          <button
            aria-label="Like Button"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            id="place-like-button"
          />
          <p className="cards__like-count">{likeCount}</p>
        </div>
      </div>
    </li>
  );
}
