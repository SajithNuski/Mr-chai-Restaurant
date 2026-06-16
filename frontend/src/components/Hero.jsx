import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Coffee } from 'lucide-react';
import hero_burger from '../assets/hero_burger.png';

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
      <div className="hero-video-bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-element"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
      </div>
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
              CAFFE and<br />
              <span className="gold-text-gradient">RESTAURANT.</span>
            </motion.h1>

            <motion.p className="hero-description" variants={itemVariants}>
              Redefining street food through the lens of luxury. Experience the cinematic contrast of absolute obsidian blacks, shimmering golds, and artisanal Indian spices.
            </motion.p>

            <motion.div className="hero-buttons" variants={itemVariants}>
              <a href="#featured" className="btn btn-primary">
                Explore Menu
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
                src={hero_burger}
                alt="hero_burger"
                className="hero-img"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
