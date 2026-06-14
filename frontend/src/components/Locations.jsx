import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Navigation } from 'lucide-react';

const locations = [
  {
    id: 1,
    name: 'Soho Central',
    description: 'The heart of the action. High energy, rapid service, and premium street vibes for the urban explorer.',
    hours: '11:00 - 22:00',
    icon: <Navigation size={24} />
  },
  {
    id: 2,
    name: 'Shoreditch Loft',
    description: 'Artisanal focused. More space, minimalist setups, and quiet alcoves for the chai connoisseur to breathe.',
    hours: '10:00 - 23:00',
    icon: <Sparkles size={24} />
  },
  {
    id: 3,
    name: 'Mayfair Elite',
    description: 'Our most exclusive experience. Refined, low-lit, and intimate. Fine dining meets street food culture.',
    hours: '12:00 - 00:00',
    icon: <MapPin size={24} />
  }
];

export default function Locations() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section id="locations" className="locations-sec section-padding">
      <div className="container">
        
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="gold-text-gradient">Flagship Sanctuaries</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Each location offers a unique architectural interpretation of our street luxury concept. Find your closest oasis.
          </motion.p>
        </div>

        <motion.div 
          className="locations-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {locations.map((loc) => (
            <motion.div 
              className="location-card" 
              key={loc.id}
              variants={cardVariants}
            >
              <div className="location-icon">
                {loc.icon}
              </div>
              <h3 className="location-title">{loc.name}</h3>
              <p className="location-desc">{loc.description}</p>
              <span className="gold-accent" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Hours: {loc.hours}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
