import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Coffee } from 'lucide-react';
import heroChai from '../assets/hero_chai.png';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <section id="home" className="hero-sec">
      <div className="container">
        <div className="hero-grid">
          
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-badge" variants={itemVariants}>
              <Flame size={14} style={{ marginRight: '6px' }} />
              STREET FOOD REIMAGINED
            </motion.div>
            
            <motion.h1 className="hero-title" variants={itemVariants}>
              Bold Flavors.<br />
              <span className="gold-text-gradient">Fast Life.</span>
            </motion.h1>
            
            <motion.p className="hero-description" variants={itemVariants}>
              Redefining street food through the lens of luxury. Experience the cinematic contrast of absolute obsidian blacks, shimmering golds, and artisanal Indian spices.
            </motion.p>
            
            <motion.div className="hero-buttons" variants={itemVariants}>
              <a href="#featured" className="btn btn-primary">
                Explore Menu
              </a>
              <a href="#contact" className="btn btn-secondary">
                Book a Table
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <div className="hero-image-wrapper">
              <img 
                src={heroChai} 
                alt="Masala Chai Pouring" 
                className="hero-img"
              />
            </div>

            {/* Floating Card 1 */}
            <motion.div 
              className="hero-floating-card hero-fc-1"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="hero-fc-icon">
                <Coffee size={20} />
              </div>
              <div className="hero-fc-text">
                <h4>Obsidian Blend</h4>
                <p>100% Organic Assam</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              className="hero-floating-card hero-fc-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
            >
              <div className="hero-fc-icon" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', color: 'var(--gold-vibrant)' }}>
                <Star size={20} />
              </div>
              <div className="hero-fc-text">
                <h4>4.9 Rating</h4>
                <p>From 800+ Guest Reviews</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
