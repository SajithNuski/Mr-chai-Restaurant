import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

import emperorBurger from '../assets/emperor_burger.png';
import obsidianChai from '../assets/obsidian_chai.png';
import gunpowderFries from '../assets/gunpowder_fries.png';
import heroChai from '../assets/hero_chai.png';
import mrChaiAmbiance from '../assets/mr_chai_ambiance.png';
import saffronCheesecake from '../assets/saffron_cheesecake.png';

const galleryItems = [
  {
    id: 1,
    title: 'The Emperor Burger',
    category: 'Dishes',
    image: emperorBurger,
    sizeClass: 'tall',
    desc: 'Double wagyu beef, caramelized heirloom spices, toasted brioche.'
  },
  {
    id: 2,
    title: 'Obsidian Masala Chai',
    category: 'Drinks',
    image: obsidianChai,
    sizeClass: 'standard',
    desc: 'Slow-steeped Assam black tea infused with our signature hand-ground spices.'
  },
  {
    id: 3,
    title: 'The Obsidian Sanctuary',
    category: 'Ambiance',
    image: mrChaiAmbiance,
    sizeClass: 'wide',
    desc: 'Our flagship dining room featuring deep obsidian tones and warm golden pendant lights.'
  },
  {
    id: 4,
    title: 'Gold-Leaf Saffron Cheesecake',
    category: 'Dishes',
    image: saffronCheesecake,
    sizeClass: 'standard',
    desc: 'Creamy cardamom and saffron cheesecake topped with genuine 24k gold leaf.'
  },
  {
    id: 5,
    title: 'Gunpowder Fries',
    category: 'Dishes',
    image: gunpowderFries,
    sizeClass: 'standard',
    desc: 'Triple-cooked fries tossed in spicy gunpowder podi blend and bird’s eye chili.'
  },
  {
    id: 6,
    title: 'Artisanal Cardamom Chai',
    category: 'Drinks',
    image: heroChai,
    sizeClass: 'wide',
    desc: 'A premium pour of freshly boiled milk tea, cardamom pods, and raw cane sugar.'
  }
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Dishes', 'Drinks', 'Ambiance'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (index) => {
    // Find index of the item within the filtered list
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="gallery-sec section-padding">
      <div className="container">
        
        <div className="section-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The <span className="gold-text-gradient">Visual Canvas</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A visual exploration of our premium street food craft, signature spice blends, and the high-fidelity atmosphere of our sanctuaries.
          </motion.p>
        </div>

        {/* Categories Tabs */}
        <div className="gallery-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`gallery-tab-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout 
          className="gallery-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className={`gallery-card ${item.sizeClass || 'standard'}`}
                onClick={() => openLightbox(index)}
              >
                <div className="gallery-card-image-wrapper">
                  <img src={item.image} alt={item.title} className="gallery-card-img" />
                  <div className="gallery-card-overlay">
                    <span className="gallery-card-category">{item.category}</span>
                    <h3 className="gallery-card-title">{item.title}</h3>
                    <p className="gallery-card-desc">{item.desc}</p>
                    <span className="gallery-card-zoom-btn">
                      <ImageIcon size={18} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="gallery-lightbox"
            >
              <button className="lightbox-close-btn" onClick={closeLightbox}>
                <X size={24} />
              </button>

              <button className="lightbox-nav-btn prev" onClick={handlePrev}>
                <ChevronLeft size={28} />
              </button>

              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="lightbox-content"
              >
                <div className="lightbox-image-container">
                  <img 
                    src={filteredItems[lightboxIndex].image} 
                    alt={filteredItems[lightboxIndex].title} 
                    className="lightbox-img" 
                  />
                </div>
                <div className="lightbox-info">
                  <span className="lightbox-category">{filteredItems[lightboxIndex].category}</span>
                  <h3 className="lightbox-title">{filteredItems[lightboxIndex].title}</h3>
                  <p className="lightbox-desc">{filteredItems[lightboxIndex].desc}</p>
                </div>
              </motion.div>

              <button className="lightbox-nav-btn next" onClick={handleNext}>
                <ChevronRight size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
