/* --------------------------------- imports -------------------------------- */
import { Route, Link, useRouteMatch } from "react-router-dom";
import headerlogo from "../images/headerlogo.svg";

/* ----------------------------- function Header ---------------------------- */
function Header({ email, onSignOut }) {
  const { path, url } = useRouteMatch();

  return (
    <header className="header">
      <img
        className="header__logo"
        src={headerlogo}
        alt="Graphic Around the World in the US"
      />
      <Route path={`${path}/`}>
        <div className="header__sub-container">
          <span className="header__text">{email}</span>
          <Link
            to={`${url}signin`}
            className="header__link header__link_light"
            onClick={onSignOut}
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
