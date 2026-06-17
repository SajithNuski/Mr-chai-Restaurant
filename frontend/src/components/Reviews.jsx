import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';


const defaultGoogleReviews = [
  {
    author_name: "Aarav Mehta",
    author_url: "https://www.google.com/maps/contrib/1122334455",
    profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    relative_time_description: "a week ago",
    text: "The contrast between the street energy and the high-end presentation is incredible. Best chai in the city, hands down. Truly a culinary revelation."
  },
  {
    author_name: "Sarah Jenkins",
    author_url: "https://www.google.com/maps/contrib/2233445566",
    profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    relative_time_description: "3 weeks ago",
    text: "Finally, a place that treats street food with the respect it deserves. The Emperor Burger is a masterpiece of textures and spices."
  },
  {
    author_name: "Kabir Singh",
    author_url: "https://www.google.com/maps/contrib/3344556677",
    profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    relative_time_description: "2 months ago",
    text: "Atmosphere 10/10. Flavor 10/10. It's like eating in a luxury heritage lounge but with the fiery, authentic soul of the bazaar."
  }
];

const AUTOPLAY_TIME = 6000;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" style={{ display: 'inline-block' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function Reviews() {
  const [reviews, setReviews] = useState(defaultGoogleReviews);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setReviews(data);
          } else if (data.reviews && Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          }
        }
      } catch (err) {
        console.warn("Could not fetch Google Reviews, using fallback reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (reviews.length <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, AUTOPLAY_TIME);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, reviews]);

  const handleNext = () => {
    if (reviews.length <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    if (reviews.length <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleDotClick = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1]
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    })
  };

  return (
    <section id="reviews" className="reviews-sec section-padding">
      <div className="container">
        <div className="reviews-split-grid">

          <div className="reviews-left-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="reviews-pre-title"
            >
              <MessageSquare size={14} style={{ marginRight: '6px' }} /> GOOGLE REVIEWS
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="reviews-split-title"
            >
              Culinary <br />
              <span className="gold-text-gradient">Endorsements</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="reviews-split-desc"
            >
              Here is what our respected guests and food critics have to say about the luxury Mr. Chai experience.
            </motion.p>
          </div>

          <div className="reviews-right-col">
            <div className="modern-typo-reviews">


              {/* Side arrow buttons */}
              {reviews.length > 1 && (
                <>
                  <button onClick={handlePrev} className="modern-quote-nav-btn prev" aria-label="Previous review">
                    <ChevronLeft size={20} />
                  </button>

                  <button onClick={handleNext} className="modern-quote-nav-btn next" aria-label="Next review">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Testimonial Quote display */}
              <div className="modern-quote-display">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {reviews.length > 0 && (
                    <motion.div
                      key={current}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="modern-quote-content"
                    >
                      <div className="modern-quote-icon">
                        <Quote size={36} style={{ strokeWidth: 1.2 }} />
                      </div>

                      <blockquote className="modern-quote-text">
                        "{reviews[current].text}"
                      </blockquote>

                      <div className="google-reviewer-profile">
                        <div className="google-avatar-wrapper">
                          <img
                            src={reviews[current].profile_photo_url || "/default-avatar.png"}
                            alt={reviews[current].author_name}
                            className="google-avatar-img"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[current].author_name)}&background=1d1505&color=d4a017`;
                            }}
                          />
                          <div className="google-mini-icon">
                            <GoogleIcon />
                          </div>
                        </div>

                        <div className="google-reviewer-info">
                          <span className="google-reviewer-name">{reviews[current].author_name}</span>
                          <div className="google-review-stars-meta">
                            <div className="google-stars-row">
                              {[...Array(reviews[current].rating || 5)].map((_, i) => (
                                <Star key={i} size={11} fill="var(--gold-heritage)" color="var(--gold-heritage)" />
                              ))}
                            </div>
                            <span className="google-relative-time">
                              {reviews[current].relative_time_description}
                            </span>
                          </div>
                        </div>
                      </div>


                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dot Indicators */}
              {reviews.length > 1 && (
                <div className="google-carousel-dots">
                  {reviews.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`google-carousel-dot ${current === idx ? 'active' : ''}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Autoplay progress line */}
              {reviews.length > 1 && (
                <div className="modern-progress-bar-container">
                  <motion.div
                    key={`bar-${current}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_TIME / 1000, ease: 'linear' }}
                    className="modern-progress-bar"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
