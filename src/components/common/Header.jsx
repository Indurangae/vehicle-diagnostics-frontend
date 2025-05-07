import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="logo_img" />
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "bar1" : ""}`}></div>
        <div className={`bar ${menuOpen ? "bar2" : ""}`}></div>
        <div className={`bar ${menuOpen ? "bar3" : ""}`}></div>
      </div>

      <ul className={`header-nav ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/diagnostics" onClick={() => setMenuOpen(false)}>Diagnostics</Link></li>
        <li><Link to="/maintenance" onClick={() => setMenuOpen(false)}>Maintenance</Link></li>
      </ul>

      <div className='button sign'>
        <Link to="/signin">
          <button className="btn1">
            <i className="fa fa-sign-out"></i> Sign In
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
