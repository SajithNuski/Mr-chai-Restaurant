import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    text: "The contrast between the street energy and the high-end presentation is incredible. Best chai in the city, hands down.",
    author: "Aarav M. — Food Critic"
  },
  {
    id: 2,
    text: "Finally, a place that treats street food with the respect it deserves. The Emperor Burger is a revelation.",
    author: "Sarah K. — Gastronomist"
  },
  {
    id: 3,
    text: "Atmosphere 10/10. Flavor 10/10. It's like eating in a luxury lounge but with the soul of the bazaar.",
    author: "Kabir S. — Lifestyle Blogger"
  }
];

export default function Reviews() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: 'easeIn'
      }
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews" className="reviews-sec section-padding">
      <div className="container">
        
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The <span className="gold-text-gradient">Guest Word</span>
          </motion.h2>
        </div>

        <div className="reviews-carousel">
          <div className="review-quote-icon flex-center" style={{ marginBottom: '16px' }}>
            <Quote size={48} style={{ strokeWidth: 1 }} />
          </div>

          <div style={{ position: 'relative', minHeight: '160px', overflow: 'hidden' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="review-slide"
              >
                <blockquote className="review-text">
                  "{reviews[current].text}"
                </blockquote>
                <cite className="review-author">
                  {reviews[current].author}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="review-controls">
            <button onClick={handlePrev} className="review-btn" aria-label="Previous review">
              <ChevronLeft size={20} />
            </button>
            <button onClick={handleNext} className="review-btn" aria-label="Next review">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
