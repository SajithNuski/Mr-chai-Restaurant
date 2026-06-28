import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

import logoImg from '../assets/logo.png';

export default function Navbar({ isAdminView, onToggleAdmin, activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <a href="#home" className="logo" onClick={() => isAdminView && onToggleAdmin(false)}>
          <img src={logoImg} alt="Mr. Chai Logo" className="logo-img" />
        </a>

        {!isAdminView ? (
          <>
            <ul className="nav-links">
              <li>
                <a href="#home" className={activeSection === 'home' ? 'active' : ''}>Oome</a>
              </li>
              <li>
                <a href="#menu" className={activeSection === 'menu' ? 'active' : ''}>Menu</a>
              </li>
              <li>
                <a href="#gallery" className={activeSection === 'gallery' ? 'active' : ''}>Gallery</a>
              </li>
              <li>
                <a href="#reviews" className={activeSection === 'reviews' ? 'active' : ''}>Reviews</a>
              </li>
              <li>
                <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact Us</a>
              </li>
            </ul>

          </>
        ) : (
          <div className="nav-actions">
            <button onClick={() => onToggleAdmin(false)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '11px' }}>
              <ArrowLeft size={14} /> Back to Site
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
