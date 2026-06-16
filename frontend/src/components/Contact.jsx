import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact() {
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: null, error: null });

  // Newsletter State
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState({ loading: false, success: null, error: null });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setContactStatus({ loading: false, success: 'Thank you for your message! Our team will get back to you shortly.', error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus({ loading: false, success: null, error: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setContactStatus({ loading: false, success: null, error: 'Connection error. Please check if backend server is running.' });
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setNewsStatus({ loading: true, success: null, error: null });

    try {
      const res = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail })
      });
      const data = await res.json();

      if (res.ok) {
        setNewsStatus({ loading: false, success: 'Subscribed successfully! Welcome to the inner circle.', error: null });
        setNewsEmail('');
      } else {
        setNewsStatus({ loading: false, success: null, error: data.error || 'Already subscribed or invalid.' });
      }
    } catch (err) {
      setNewsStatus({ loading: false, success: null, error: 'Connection error. Please retry.' });
    }
  };

  return (
    <>
      {/* Newsletter Block */}
      <section className="newsletter-wrapper">
        <div className="container">
          <div className="newsletter-content">
            <h3 style={{ fontSize: '28px' }}>Join the <span className="gold-text-gradient">Inner Circle</span></h3>
            <p>Subscribe for exclusive menu previews, culinary secret releases, and reservations priority.</p>
            
            <form className="newsletter-form" onSubmit={handleNewsSubmit}>
              <input 
                type="email" 
                placeholder="Enter your premium email address" 
                className="newsletter-input"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={newsStatus.loading}>
                {newsStatus.loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {newsStatus.success && (
              <div className="form-alert form-alert-success" style={{ marginTop: '15px', width: '100%' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                {newsStatus.success}
              </div>
            )}
            
            {newsStatus.error && (
              <div className="form-alert form-alert-error" style={{ marginTop: '15px', width: '100%' }}>
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                {newsStatus.error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="contact" className="contact-sec">
        <div className="container">
          <div className="contact-grid">
            
            <div className="contact-info">
              <div>
                <h2 style={{ marginBottom: '16px' }}>Get in <span className="gold-text-gradient">Touch</span></h2>
                <p style={{ fontSize: '15px' }}>Whether it's a private catering enquiry, reservations, or media request, we'd love to hear from you. Experience the elevated taste of the streets.</p>
              </div>

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <MapPin size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Oluvil Sanctuary</h4>
                  <p>Main Street, Oluvil 32360</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <Phone size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Reservations</h4>
                  <p>067 225 5566</p>
                </div>
              </div>

              <div className="contact-info-block">
                <div className="contact-info-icon">
                  <Mail size={20} />
                </div>
                <div className="contact-info-text">
                  <h4>Direct Email</h4>
                  <p>mrchai.oluvil@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h3 style={{ marginBottom: '24px' }}>Send a Message</h3>
              
              {contactStatus.success && (
                <div className="form-alert form-alert-success">
                  <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {contactStatus.success}
                </div>
              )}

              {contactStatus.error && (
                <div className="form-alert form-alert-error">
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  {contactStatus.error}
                </div>
              )}

              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    className="form-control" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">Subject</label>
                  <input 
                    type="text" 
                    id="contact-subject" 
                    className="form-control" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea 
                    id="contact-message" 
                    className="form-control" 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={contactStatus.loading}>
                  {contactStatus.loading ? 'Sending Message...' : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
