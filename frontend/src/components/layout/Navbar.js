import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <a onClick={logout} href="#!">
          Déconnexion
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Inscription</Link>
      </li>
      <li>
        <Link to="/login">Connexion</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1 className="brand">
        <Link to="/">TP1 App</Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;
