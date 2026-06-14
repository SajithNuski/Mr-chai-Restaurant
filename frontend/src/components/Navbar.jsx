import React, { useState, useEffect } from 'react';
import { Coffee, ShieldAlert, ArrowLeft } from 'lucide-react';

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
          <span className="logo-symbol"><Coffee size={28} style={{ strokeWidth: 1.5 }} /></span>
          MR. CHAI
        </a>

        {!isAdminView ? (
          <>
            <ul className="nav-links">
              <li>
                <a href="#home" className={activeSection === 'home' ? 'active' : ''}>Home</a>
              </li>
              <li>
                <a href="#featured" className={activeSection === 'featured' ? 'active' : ''}>Featured</a>
              </li>
              <li>
                <a href="#locations" className={activeSection === 'locations' ? 'active' : ''}>Locations</a>
              </li>
              <li>
                <a href="#reviews" className={activeSection === 'reviews' ? 'active' : ''}>Reviews</a>
              </li>
              <li>
                <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a>
              </li>
            </ul>

            <div className="nav-actions">
              <button onClick={() => onToggleAdmin(true)} className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '11px' }}>
                <ShieldAlert size={14} /> Admin Portal
              </button>
            </div>
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
