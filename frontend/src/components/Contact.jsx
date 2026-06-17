import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false });

  // Newsletter State
  const [newsEmail, setNewsEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState({ loading: false });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Thank you for your message! Our team will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      toast.error('Connection/Server error. Please ensure backend is active.');
    } finally {
      setContactStatus({ loading: false });
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setNewsStatus({ loading: true });

    try {
      const res = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsEmail })
      });
      const data = await res.json();

      if (res.ok) {
        toast.success('Subscribed successfully! Welcome to the inner circle.');
        setNewsEmail('');
      } else {
        toast.error(data.error || 'Already subscribed or invalid.');
      }
    } catch (err) {
      toast.error('Connection error. Please retry.');
    } finally {
      setNewsStatus({ loading: false });
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
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="contact" className="contact-sec">
        <div className="container">
          <div className="contact-split-grid">
            {/* Left Column: Header and Contact Details */}
            <div className="contact-details-col">
              <div className="contact-header-left">
                <h2 style={{ marginBottom: '16px' }}>Get in <span className="gold-text-gradient">Touch</span></h2>
                <p>Whether it's a private catering enquiry, reservations, or media request, we'd love to hear from you. Experience the elevated taste of the streets.</p>
              </div>

              <div className="contact-info-list">
                <div className="info-list-item">
                  <div className="info-item-icon">
                    <MapPin size={22} />
                  </div>
                  <div className="info-item-text">
                    <h4>Oluvil Sanctuary</h4>
                    <p>Main Street, Oluvil 32360</p>
                  </div>
                </div>

                <div className="info-list-item">
                  <div className="info-item-icon">
                    <Phone size={22} />
                  </div>
                  <div className="info-item-text">
                    <h4>Reservations</h4>
                    <p>067 225 5566</p>
                  </div>
                </div>

                <div className="info-list-item">
                  <div className="info-item-icon">
                    <Mail size={22} />
                  </div>
                  <div className="info-item-text">
                    <h4>Direct Email</h4>
                    <p>mrchai.oluvil@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-col">
              <div className="contact-card-form-split">
                <h3>Send us a Message</h3>

                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="form-row-two">
                    <div className="form-group flex-1">
                      <label className="form-label" htmlFor="contact-name">Name</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        className="form-control" 
                        placeholder="e.g. Alexander Mercer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="form-group flex-1">
                      <label className="form-label" htmlFor="contact-email">Email Address</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        className="form-control" 
                        placeholder="e.g. alexander@luxury.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-subject">Subject</label>
                    <input 
                      type="text" 
                      id="contact-subject" 
                      className="form-control" 
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Message</label>
                    <textarea 
                      id="contact-message" 
                      className="form-control" 
                      placeholder="Describe your request in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="form-btn-wrapper">
                    <button type="submit" className="btn btn-primary btn-submit-message-left" disabled={contactStatus.loading}>
                      {contactStatus.loading ? 'Sending Message...' : (
                        <>
                          <span>Send Message</span>
                          <Send size={16} className="btn-send-icon" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
