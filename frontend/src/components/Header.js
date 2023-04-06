/* --------------------------------- imports -------------------------------- */

import { Route, Link, useRouteMatch } from "react-router-dom";
import { useState, useEffect } from "react";
import headerlogo from "../images/headerlogo.svg";

import { useUser, useAuth, useWindowSize } from "../hooks";

/* ----------------------------- function Header ---------------------------- */
function Header() {
  const size = useWindowSize();

  /* -------------------------------- useState -------------------------------- */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  /* -------------------------------- useEffect ------------------------------- */
  useEffect(() => {
    size.width <= 625 ? setIsMobileView(true) : setIsMobileView(false);
  }, [size]);
  /* ---------------------------------- hooks --------------------------------- */
  const { path, url } = useRouteMatch();
  const { currentUser } = useUser();
  const { onSignOut } = useAuth();

  /* -------------------------------- handlers -------------------------------- */
  const handleSignOut = () => {
    onSignOut();
    setIsMenuOpen(false);
  };

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };
  const handleCloseClick = () => {
    setIsMenuOpen(false);
  };

  /* --------------------------------- return --------------------------------- */
  return (
    <header className={`header ${isMenuOpen  ? "header__menu" : ""}`}>
      <img
        className="header__logo"
        src={headerlogo}
        alt="Graphic Around the World in the US"
      />
      <Route path={`${path}/`}>
        <div
          className={`${
            isMenuOpen ? "header__sub-container_open" : "header__sub-container"
          }`}
        >
          {currentUser ? (
            <div
              className={`header__text ${
                isMenuOpen && isMobileView
                  ? "header__menu_open"
                  : isMobileView
                  ? "header__text_hidden"
                  : ""
              }`}
            >
              {currentUser.email}
            </div>
          ) : null}
          <Link
            to={`${url}signin`}
            className={`header__link header__link_light ${
              isMenuOpen && isMobileView
                ? "header__menu_open"
                : isMobileView
                ? "header__link_hidden"
                : ""
            }`}
            onClick={handleSignOut}
          >
            Log out
          </Link>
        </div>

        {isMenuOpen ? (
          <button
            className={`header__btn header__btn_open ${
              !isMobileView ? "header__btn_hidden" : ""
            }`}
            onClick={handleCloseClick}
          ></button>
        ) : (
          <button
            className={`header__btn header__btn_closed ${
              !isMobileView ? "header__btn_hidden" : ""
            }`}
            onClick={handleMenuClick}
          ></button>
        )}
      </Route>

      <Route path={`${path}signup`}>
        <Link to={`${url}signin`} className="header__link">
          Log in
        </Link>
      </Route>

      <Route path={`${path}signin`}>
        <Link to={`${url}signup`} className="header__link">
          Sign Up
        </Link>
      </Route>
    </header>
  );
}

/* --------------------------------- exports -------------------------------- */
export default Header;
