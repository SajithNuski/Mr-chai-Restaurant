import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import emperorBurger from '../assets/emperor_burger.png';
import obsidianChai from '../assets/obsidian_chai.png';
import gunpowderFries from '../assets/gunpowder_fries.png';

const featuredItems = [
  {
    id: 1,
    name: 'The Emperor Burger',
    description: 'Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices on a toasted brioche.',
    price: '$18.50',
    badge: 'Signature',
    image: emperorBurger
  },
  {
    id: 2,
    name: 'Obsidian Masala Chai',
    description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.',
    price: '$7.00',
    badge: 'Legendary',
    image: obsidianChai
  },
  {
    id: 3,
    name: 'Gunpowder Fries',
    description: 'Triple-cooked thick-cut fries tossed in our signature smoky gunpowder podi blend and fresh bird’s eye chili.',
    price: '$9.00',
    badge: 'Popular',
    image: gunpowderFries
  }
];

export default function Featured() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const handleOrder = async (item) => {
    // Proactively send a mock order to backend to dynamically demonstrate admin notification
    try {
      await fetch('http://localhost:5000/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: Math.floor(Math.random() * 20 + 1).toString().padStart(2, '0'),
          items: [item.name],
          total: parseFloat(item.price.replace('$', ''))
        })
      });
      alert(`Order placed successfully for ${item.name}! Go to the Admin Portal dashboard to see the live update.`);
    } catch (err) {
      alert(`Demo Order placed for ${item.name}! (Connect your backend server to see live updates in the Admin dashboard)`);
    }
  };

  return (
    <section id="featured" className="featured-sec section-padding">
      <div className="container">
        
        <div className="section-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The <span className="gold-text-gradient">Featured Trilogy</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A curated selection of our most celebrated creations, pairing high-end culinary arts with the vibrant soul of the bazaar.
          </motion.p>
        </div>

        <div className="featured-grid">
          {featuredItems.map((item, index) => (
            <motion.div 
              className="product-card"
              key={item.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="product-card-image">
                <img src={item.image} alt={item.name} className="product-card-img" />
                <span className="product-card-badge">{item.badge}</span>
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title">{item.name}</h3>
                <p className="product-card-desc">{item.description}</p>
                <div className="product-card-footer">
                  <span className="product-card-price">{item.price}</span>
                  <button onClick={() => handleOrder(item)} className="product-card-order-btn btn-tertiary" style={{ border: 'none', cursor: 'pointer', background: 'transparent' }}>
                    <ShoppingBag size={14} /> Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
