import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img
          src='http://localhost:8080/images/the-lord-of-the-rings.jpg'
          alt="Website Icon"
          className="header-icon"
        />
        <span className="header-title">Admin Web</span>
      </div>
      <div className="header-right">
        <div className="dropdown">
          <img src='http://localhost:8080/images/the-lord-of-the-rings.jpg' alt="Avatar" className="avatar" />
          <div className="dropdown-content">
            <a href="#">Profile</a>
            <a href="#">Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
