import React from 'react';
import { motion } from 'framer-motion';

import emperorBurger from '../assets/emperor_burger.png';
import obsidianChai from '../assets/obsidian_chai.png';
import saffronCheesecake from '../assets/saffron_cheesecake.png';

const menuItems = [
  {
    id: 1,
    name: 'Obsidian Masala Chai',
    category: 'Drinks',
    description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.',
    price: '$7.00',
    badge: 'Legendary',
    image: obsidianChai
  },
  {
    id: 2,
    name: 'The Emperor Burger',
    category: 'Street Eats',
    description: 'Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices on a toasted brioche.',
    price: '$18.50',
    badge: 'Signature',
    image: emperorBurger
  },
  {
    id: 3,
    name: 'Gold-Leaf Saffron Cheesecake',
    category: 'Delights',
    description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.',
    price: '$12.50',
    badge: 'Chef Special',
    image: saffronCheesecake
  }
];

export default function Menu() {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="menu" className="featured-sec section-padding">
      <div className="container">
        
        <div className="section-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The <span className="gold-text-gradient">Spiced Catalog</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A curated selection of artisanal beverages, rich street foods, and premium delights crafted to redefine Indian spices.
          </motion.p>
        </div>

        {/* Menu Grid */}
        <div className="featured-grid">
          {menuItems.map((item) => (
            <motion.div 
              className="product-card"
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
            >
              <div className="product-card-image">
                <img src={item.image} alt={item.name} className="product-card-img" />
                <span className="product-card-badge">{item.badge}</span>
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title">{item.name}</h3>
                <p className="product-card-desc">{item.description}</p>
                <div className="product-card-footer" style={{ justifyContent: 'center' }}>
                  <span className="product-card-price" style={{ color: 'var(--gold-heritage)' }}>{item.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <div className="flex-center" style={{ marginTop: '56px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => alert("The full menu page is currently in development and will be released soon!")}
          >
            View Full Menu
          </button>
        </div>

      </div>
    </section>
  );
}
