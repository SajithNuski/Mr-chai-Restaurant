import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Leaf, Flame } from 'lucide-react';

export default function SpiceAlchemist() {
  const [cardamom, setCardamom] = useState(40);
  const [saffron, setSaffron] = useState(30);
  const [ginger, setGinger] = useState(30);
  
  const [profile, setProfile] = useState({
    title: 'The Golden Harmony',
    description: 'The classic street style. Cardamom, saffron, and ginger balanced in perfect ratios for a sweet, fiery, and aromatic profile.',
    pairing: 'The Featured Trilogy (Emperor Burger, Obsidian Chai, & Gunpowder Fries)',
    themeColor: '#D4AF37'
  });

  useEffect(() => {
    const total = cardamom + saffron + ginger;
    if (total === 0) return;

    const cPercent = cardamom / total;
    const sPercent = saffron / total;
    const gPercent = ginger / total;

    if (cPercent > 0.45) {
      setProfile({
        title: 'Aromatic & Botanical',
        description: 'A botanical-forward blend where green cardamom pods release sweet, eucalyptus-like notes. Extremely calming, elegant, and herbal.',
        pairing: 'Obsidian Masala Chai (steeped in organic Assam)',
        themeColor: '#5C7C64' // cardamom green
      });
    } else if (sPercent > 0.45) {
      setProfile({
        title: 'Imperial & Honeyed',
        description: 'A deep, golden infusion featuring genuine Kashmiri saffron threads. Delivers a warm, luxurious, honeyed aroma suited for high royalty.',
        pairing: 'The Emperor Wagyu Burger & Saffron tea pairing',
        themeColor: '#D4AF37' // saffron/brass gold
      });
    } else if (gPercent > 0.45) {
      setProfile({
        title: 'Fiery & Invigorating',
        description: 'A sharp, warming brew dominated by freshly crushed organic ginger root. Ignites the palate and cuts through rich street flavors.',
        pairing: 'Gunpowder Fries with a side of spicy bird’s eye chili',
        themeColor: '#DE6E31' // terracotta saffron orange
      });
    } else {
      setProfile({
        title: 'The Golden Harmony',
        description: 'The classic street style. Cardamom, saffron, and ginger balanced in perfect ratios for a sweet, fiery, and aromatic profile.',
        pairing: 'The Featured Trilogy (Emperor Burger, Obsidian Chai, & Gunpowder Fries)',
        themeColor: '#D4AF37'
      });
    }
  }, [cardamom, saffron, ginger]);

  // Dynamically calculate tea color based on spice levels
  // Saffron -> warmer/lighter orange; Ginger -> darker red-brown; Cardamom -> slightly muted green-brown
  const getTeaColor = () => {
    const total = cardamom + saffron + ginger || 1;
    const c = cardamom / total;
    const s = saffron / total;
    const g = ginger / total;

    // HSL base for tea: H=28 (orange-brown), S=40%, L=35%
    const h = Math.round(28 - c * 8 + s * 12); 
    const sVal = Math.round(35 + s * 25 - c * 10);
    const lVal = Math.round(32 + s * 15 - g * 12);
    
    return `hsl(${h}, ${sVal}%, ${lVal}%)`;
  };

  return (
    <section className="spice-alchemist-sec">
      <div className="container">
        
        <div className="alchemist-grid">
          
          {/* Controls Side */}
          <div className="alchemist-controls">
            <span className="alchemist-eyebrow">Interactive Ritual</span>
            <h2 className="alchemist-title">The Spice Alchemist</h2>
            <p className="alchemist-subtitle">
              Every cup of Mr. Chai is hand-blended. Adjust the sliders below to calibrate your sensory profile and find your perfect culinary pairing.
            </p>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">
                  <Leaf size={14} className="slider-icon" style={{ color: 'var(--color-cardamom)' }} />
                  Cardamom (Aroma)
                </span>
                <span className="slider-value" style={{ fontFamily: 'var(--font-utility)' }}>{cardamom}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={cardamom} 
                onChange={(e) => setCardamom(Number(e.target.value))}
                className="spice-slider slider-cardamom"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">
                  <Sparkles size={14} className="slider-icon" style={{ color: 'var(--color-brass)' }} />
                  Saffron (Sweetness & Depth)
                </span>
                <span className="slider-value" style={{ fontFamily: 'var(--font-utility)' }}>{saffron}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={saffron} 
                onChange={(e) => setSaffron(Number(e.target.value))}
                className="spice-slider slider-saffron"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">
                  <Flame size={14} className="slider-icon" style={{ color: 'var(--color-saffron)' }} />
                  Ginger (Heat & Zing)
                </span>
                <span className="slider-value" style={{ fontFamily: 'var(--font-utility)' }}>{ginger}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={ginger} 
                onChange={(e) => setGinger(Number(e.target.value))}
                className="spice-slider slider-ginger"
              />
            </div>
          </div>

          {/* Visual & Recommendation Side */}
          <div className="alchemist-display">
            
            {/* Animated Tea Cup SVG */}
            <div className="tea-cup-container">
              <svg viewBox="0 0 200 200" width="100%" height="160" style={{ overflow: 'visible' }}>
                {/* Steam Lines */}
                <g className="steam-group">
                  <motion.path 
                    d="M75,50 Q70,30 75,10" 
                    fill="none" 
                    stroke="rgba(253, 251, 247, 0.4)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  />
                  <motion.path 
                    d="M100,45 Q105,25 100,5" 
                    fill="none" 
                    stroke="rgba(253, 251, 247, 0.5)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    animate={{ y: [2, -12, 2], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
                  />
                  <motion.path 
                    d="M125,50 Q120,30 125,10" 
                    fill="none" 
                    stroke="rgba(253, 251, 247, 0.4)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 1 }}
                  />
                </g>

                {/* Cup Outer Body (Clay Kulhad style) */}
                <path 
                  d="M60,60 L70,150 Q100,165 130,150 L140,60 Z" 
                  fill="#231A17" 
                  stroke="rgba(212, 175, 55, 0.2)" 
                  strokeWidth="2" 
                />

                {/* Cup Inside Shadow / Rim */}
                <ellipse cx="100" cy="60" rx="40" ry="10" fill="#1C1412" />

                {/* Dynamic Tea Fluid Ellipse */}
                <ellipse 
                  cx="100" 
                  cy="64" 
                  rx="37" 
                  ry="8" 
                  fill={getTeaColor()} 
                  style={{ transition: 'fill 0.5s ease' }}
                />

                {/* Inner froth layer */}
                <ellipse 
                  cx="100" 
                  cy="64" 
                  rx="34" 
                  ry="6" 
                  fill="none" 
                  stroke="rgba(253, 251, 247, 0.15)" 
                  strokeWidth="2.5" 
                  strokeDasharray="6,4"
                />

                {/* Clay cup texture lines */}
                <path d="M 64,95 Q 100,105 136,95" fill="none" stroke="rgba(253, 251, 247, 0.05)" strokeWidth="2" />
                <path d="M 67,120 Q 100,130 133,120" fill="none" stroke="rgba(253, 251, 247, 0.05)" strokeWidth="2" />
              </svg>
            </div>

            {/* Profile Assessment Card */}
            <div className="alchemist-display-right">
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="alchemist-assessment"
                >
                  <span className="assessment-badge" style={{ borderColor: profile.themeColor, color: profile.themeColor }}>
                    {profile.title}
                  </span>
                  <p className="assessment-desc">{profile.description}</p>
                  
                  <div className="assessment-pairing">
                    <span className="pairing-label">Recommended Pairing</span>
                    <span className="pairing-value">{profile.pairing}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
