import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Flame, Sparkles } from 'lucide-react';
import obsidianChai from '../assets/obsidian_chai.png';
import emperorBurger from '../assets/emperor_burger.png';
import saffronCheesecake from '../assets/saffron_cheesecake.png';
import gunpowderFries from '../assets/gunpowder_fries.png';

// Fallback mock items in case API is loading or fails
const fallbackMenu = [
  { id: 'm1', name: 'Obsidian Masala Chai', category: 'Drinks', description: 'Slow-steeped loose leaf tea from Assam, hand-ground secret spice blend, and creamy whole milk.', price: 7.00, badge: 'Legendary', image: 'obsidian_chai', spiceLevel: 1, available: true },
  { id: 'm2', name: 'The Emperor Burger', category: 'Street Eats', description: 'Double wagyu beef, aged cheddar, truffle aioli, and caramelized heirloom spices on a toasted brioche.', price: 18.50, badge: 'Signature', image: 'emperor_burger', spiceLevel: 2, available: true },
  { id: 'm3', name: 'Gold-Leaf Saffron Cheesecake', category: 'Delights', description: 'Rich cheesecake infused with premium Kashmiri saffron, cardamom pod crust, and finished with 24k gold leaf.', price: 12.50, badge: 'Chef Special', image: 'saffron_cheesecake', spiceLevel: 0, available: true },
  { id: 'm4', name: 'Kashmiri Rose Kahwa', category: 'Drinks', description: 'Traditional green tea prepared with saffron, almonds, cinnamon, cardamom, and fresh red rose petals.', price: 8.00, badge: 'Premium', image: 'rose_kahwa', spiceLevel: 0, available: true },
  { id: 'm5', name: 'Truffle Vada Pav', category: 'Street Eats', description: 'Traditional potato dumpling slider inside a soft pav, infused with black truffle oil and dry garlic chutney.', price: 14.00, badge: 'Premium', image: 'truffle_vada_pav', spiceLevel: 1, available: true },
  { id: 'm6', name: 'Gunpowder Fries', category: 'Street Eats', description: 'Crisp hand-cut potato wedges tossed in a fiery South Indian gunpowder spice mix and curry leaf dust.', price: 9.00, badge: 'Fiery', image: 'gunpowder_fries', spiceLevel: 3, available: true },
  { id: 'm7', name: 'Mango Cardamom Lassi', category: 'Drinks', description: 'Velvety yogurt beverage blended with sweet Alphonso mango pulp, green cardamom, and pistachio slivers.', price: 8.50, badge: 'Bestseller', image: 'mango_lassi', spiceLevel: 0, available: true },
  { id: 'm8', name: 'Pistachio Kulfi Dome', category: 'Delights', description: 'Classic dense Indian ice cream slow-churned with pistachios, served as a gold-dusted dome.', price: 10.50, badge: 'Signature', image: 'kulfi_dome', spiceLevel: 0, available: true }
];

const imageMap = {
  obsidian_chai: obsidianChai,
  emperor_burger: emperorBurger,
  saffron_cheesecake: saffronCheesecake,
  gunpowder_fries: gunpowderFries,
  rose_kahwa: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
  truffle_vada_pav: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=400&q=80',
  mango_lassi: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=400&q=80',
  kulfi_dome: 'https://images.unsplash.com/photo-1505394033343-e3852a656e43?auto=format&fit=crop&w=400&q=80'
};

const getMenuItemImage = (imageName) => {
  if (imageMap[imageName]) return imageMap[imageName];
  if (imageName && (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:'))) {
    return imageName;
  }
  return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80';
};

export default function FullMenu({ onBack }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/menu');
      if (!res.ok) throw new Error('Failed to fetch menu');
      const data = await res.json();
      setMenuItems(data.length > 0 ? data : fallbackMenu);
    } catch (err) {
      console.error('Error fetching menu, falling back to local list:', err);
      setMenuItems(fallbackMenu);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Drinks', 'Street Eats', 'Delights'];

  const filteredItems = menuItems.filter(item => {
    if (!item.available) return false;
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const renderSpiceLevel = (level) => {
    if (!level || level <= 0) return null;
    return (
      <div className="spice-indicator flex" title={`Spice Level: ${level}`}>
        {[...Array(level)].map((_, i) => (
          <Flame key={i} size={14} className="fill-gold stroke-gold" style={{ color: 'var(--gold-heritage)', marginRight: '1px' }} />
        ))}
      </div>
    );
  };

  return (
    <section className="full-menu-section">
      <div className="full-menu-container">
        
        {/* Header Navigation */}
        <div className="full-menu-nav">
          <motion.button 
            className="btn-modern-explore" 
            style={{ padding: '10px 20px', height: '42px', minWidth: 'auto' }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
          >
            <span className="btn-modern-explore-bg"></span>
            <span className="btn-modern-explore-icon" style={{ marginRight: '8px', marginLeft: 0 }}>
              <ArrowLeft size={16} />
            </span>
            <span className="btn-modern-explore-text">Back to Home</span>
            <span className="btn-modern-explore-glow"></span>
          </motion.button>
        </div>

        {/* Page Title */}
        <div className="full-menu-header text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-center gap-2"
            style={{ marginBottom: '8px' }}
          >
            <Sparkles size={16} className="gold-text" />
            <span className="gold-text uppercase tracking-widest text-xs font-semibold">The Complete Catalog</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="full-menu-title"
          >
            Mr. Chai <span className="gold-text-gradient">Full Menu</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="full-menu-subtitle"
          >
            Indulge in our masterfully crafted spices, premium Indian street bites, and golden treats.
          </motion.p>
        </div>

        {/* Category Selector */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="category-selector-wrapper"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
              {selectedCategory === category && (
                <motion.span 
                  layoutId="activeCategoryBorder" 
                  className="active-category-pill-glow" 
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid Content */}
        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
            <div className="menu-loader"></div>
            <p className="text-muted text-sm">Brewing menu with finest spices...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="full-menu-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item._id || item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="menu-item-small-card"
                >
                  <div className="menu-item-card-image-wrapper">
                    <img 
                      src={getMenuItemImage(item.image)} 
                      alt={item.name} 
                      className="menu-item-card-image"
                      loading="lazy" 
                    />
                    {item.badge && (
                      <span className="menu-item-card-badge">{item.badge}</span>
                    )}
                  </div>
                  <div className="menu-item-card-content">
                    <div className="flex justify-between items-start" style={{ marginBottom: '6px' }}>
                      <h3 className="menu-item-card-title" title={item.name}>{item.name}</h3>
                    </div>
                    <p className="menu-item-card-description" title={item.description}>
                      {item.description}
                    </p>
                    <div className="menu-item-card-footer">
                      <span className="menu-item-card-price">${parseFloat(item.price).toFixed(2)}</span>
                      {renderSpiceLevel(item.spiceLevel)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center text-muted" style={{ padding: '60px 0' }}>
            <p className="text-lg">No items available in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}
