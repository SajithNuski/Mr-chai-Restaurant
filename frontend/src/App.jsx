import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import logoImg from './assets/logo.png';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
    }

    // Hash routing check on load (e.g. #admin)
    if (window.location.hash === '#admin') {
      setIsAdminView(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track active section for navigation highlight
  useEffect(() => {
    if (isAdminView) return;

    const sections = ['home', 'menu', 'gallery', 'reviews', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminView]);

  const toggleAdminView = (val) => {
    setIsAdminView(val);
    if (val) {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Navbar 
        isAdminView={isAdminView} 
        onToggleAdmin={toggleAdminView} 
        activeSection={activeSection}
      />

      <AnimatePresence mode="wait">
        {!isAdminView ? (
          /* Public Website View */
          <motion.div
            key="website"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero />
            <Menu />
            <Gallery />
            <Reviews />
            <Contact />

            {/* Footer */}
            <footer className="footer">
              <div className="container">
                <div className="footer-grid">
                  
                  <div className="footer-col">
                    <a href="#home" className="logo" style={{ alignSelf: 'flex-start' }}>
                      <img src={logoImg} alt="Mr. Chai Logo" className="logo-img" />
                    </a>
                    <p style={{ fontSize: '14px' }}>Redefining street food through the lens of luxury. Experience the cinematic contrast of absolute obsidian blacks, shimmering golds, and artisanal Indian spices.</p>
                  </div>

                  <div className="footer-col">
                    <h4>Navigate</h4>
                    <ul className="footer-links">
                      <li><a href="#home">Home</a></li>
                      <li><a href="#menu">Menu</a></li>
                      <li><a href="#gallery">Gallery</a></li>
                      <li><a href="#reviews">Reviews</a></li>
                      <li><a href="#contact">Contact Us</a></li>
                    </ul>
                  </div>

                  <div className="footer-col">
                    <h4>Hours</h4>
                    <ul className="footer-links" style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li>Wednesday: 12:00 PM - 12:00 AM</li>
                      <li>Thursday: 12:00 PM - 12:00 AM</li>
                      <li>Friday: 12:00 PM - 12:00 AM</li>
                      <li>Saturday: 12:00 PM - 12:00 AM</li>
                      <li>Sunday: 12:00 PM - 12:00 AM</li>
                      <li>Monday: 12:00 PM - 12:00 AM</li>
                      <li>Tuesday: 12:00 PM - 12:00 AM</li>
                    </ul>
                  </div>

                  <div className="footer-col">
                    <h4>Connect</h4>
                    <p style={{ fontSize: '13px', marginBottom: '12px' }}>Follow us on socials for daily spice and culinary art updates.</p>
                    <div className="social-icons">
                      <a href="#" className="social-btn" aria-label="Instagram">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a href="#" className="social-btn" aria-label="Twitter">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                      </a>
                      <a href="#" className="social-btn" aria-label="WhatsApp">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </a>
                    </div>
                  </div>

                </div>

                <div className="footer-bottom">
                  <p>&copy; {new Date().getFullYear()} MR. CHAI. Crafted in street gold.</p>
                  <div className="footer-bottom-links">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleAdminView(true); }}>Admin Portal</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          /* Admin View Router */
          <motion.div
            key="admin-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ paddingTop: '80px' }} // Navbar height spacing
          >
            {isLoggedIn ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </div>
  );
}

export default App;
