/* --------------------------------- imports -------------------------------- */

import { Route, Link, useRouteMatch } from "react-router-dom";
import headerlogo from "../images/headerlogo.svg";

import { useUser, useAuth } from "../hooks";
/* ----------------------------- function Header ---------------------------- */
function Header() {
  /* ---------------------------------- hooks --------------------------------- */
  const { path, url } = useRouteMatch();
  const { currentUser } = useUser();
  const { onSignOut } = useAuth();
  /* -------------------------------- handlers -------------------------------- */
  const handleSignOut = () => {
    console.log("signoutclicked");
    onSignOut();
  };

  /* --------------------------------- return --------------------------------- */
  return (
    <header className="header">
      <img
        className="header__logo"
        src={headerlogo}
        alt="Graphic Around the World in the US"
      />
      <Route path={`${path}/`}>
        <div className="header__sub-container">
          {currentUser ? (
            <span className="header__text">{currentUser.email}</span>
          ) : null}

          <Link
            to={`${url}signin`}
            className="header__link header__link_light"
            onClick={handleSignOut}
          >
            Log out
          </Link>
        </div>
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
