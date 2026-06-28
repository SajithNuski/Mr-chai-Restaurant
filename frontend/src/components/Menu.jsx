import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';


import emperorBurger from '../assets/emperor_burger.png';
import obsidianChai from '../assets/obsidian_chai.png';
import saffronCheesecake from '../assets/saffron_cheesecake.png';
import gunpowderFries from '../assets/gunpowder_fries.png';

const fallbackMenu = [
  {
    id: 'm1',
    name: 'Obsidian Masala Chai',
    category: 'Drinks',
    description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.',
    price: 7.00,
    badge: 'Legendary',
    image: 'obsidian_chai'
  },
  {
    id: 'm2',
    name: 'The Emperor Burger',
    category: 'Street Eats',
    description: 'Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices on a toasted brioche.',
    price: 18.50,
    badge: 'Signature',
    image: 'emperor_burger'
  },
  {
    id: 'm3',
    name: 'Gold-Leaf Saffron Cheesecake',
    category: 'Delights',
    description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.',
    price: 12.50,
    badge: 'Chef Special',
    image: 'saffron_cheesecake'
  }
];

const imageMap = {
  obsidian_chai: obsidianChai,
  emperor_burger: emperorBurger,
  saffron_cheesecake: saffronCheesecake,
  gunpowder_fries: gunpowderFries,
};

const getMenuItemImage = (imageName) => {
  if (imageMap[imageName]) return imageMap[imageName];
  if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:'))) {
    return imageName;
  }
  return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80';
};

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Filter only available items and take the first 3 for featured display
        const activeItems = data.filter(item => item.available);
        setItems(activeItems.length > 0 ? activeItems.slice(0, 3) : fallbackMenu);
      } catch (err) {
        console.error('Error fetching menu items for landing page:', err);
        setItems(fallbackMenu);
      }
    };
    fetchMenu();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const formatPrice = (priceVal) => {
    if (typeof priceVal === 'number') {
      return `Rs. ${priceVal.toFixed(2)}`;
    }
    if (typeof priceVal === 'string') {
      let cleaned = priceVal.trim();
      if (cleaned.startsWith('$')) {
        cleaned = cleaned.substring(1);
      }
      if (cleaned.startsWith('Rs. ')) {
        return cleaned;
      }
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed)) return `Rs. ${parsed.toFixed(2)}`;
    }
    return priceVal;
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
          {items.map((item) => (
            <motion.div 
              className="product-card"
              key={item._id || item.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
            >
              <div className="product-card-image">
                <img src={getMenuItemImage(item.image)} alt={item.name} className="product-card-img" />
                {item.badge && <span className="product-card-badge">{item.badge}</span>}
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title">{item.name}</h3>
                <p className="product-card-desc">{item.description}</p>
                <div className="product-card-footer" style={{ justifyContent: 'center' }}>
                  <span className="product-card-price" style={{ color: 'var(--gold-heritage)' }}>{formatPrice(item.price)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <div className="flex-center" style={{ marginTop: '56px' }}>
          <motion.button 
            className="btn-modern-explore"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.hash = '#menu-full'}
          >
            <span className="btn-modern-explore-bg"></span>
            <span className="btn-modern-explore-text">View Full Menu</span>
            <span className="btn-modern-explore-icon">
              <ArrowRight size={16} />
            </span>
            <span className="btn-modern-explore-glow"></span>
          </motion.button>
        </div>

      </div>
    </section>
  );
}
