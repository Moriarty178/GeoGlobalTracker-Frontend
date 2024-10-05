import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/icon.png" alt="Website Icon" className="header-icon" />
        <span className="header-title">Admin Web</span>
      </div>
      <div className="header-right">
        <div className="dropdown">
          <img src="/avatar.png" alt="Avatar" className="avatar" />
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
