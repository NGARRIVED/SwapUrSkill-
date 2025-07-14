import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { FaCrown, FaHandshake, FaFeatherAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { IconType } from 'react-icons';
// Use Vite's import.meta.url to get the logo path
const logo = new URL('/src/assets/logo.svg', import.meta.url).href; // <-- Replace with your real logo path

const COMPANY_NAME = 'LuxSkill Exchange'; // <-- Replace with your real company name
const TAGLINE = 'Elevate Your Expertise. Connect. Exchange. Grow.'; // <-- Replace with your real tagline
const COMPANY_DESC = 'LuxSkill Exchange is the premier platform for exclusive, high-end skill exchange among professionals. Join a curated network where expertise meets opportunity, and every connection is a step toward excellence.'; // <-- Replace with your real description

type OverviewCard = {
  title: string;
  content: string;
  icon: React.ComponentType<any>;
};

const overviewCards = [
  {
    title: 'What is SwapUrSkill?',
    content: 'A luxury platform for exclusive skill exchange among professionals. Connect, collaborate, and grow your expertise in a trusted, high-end community.',
    icon: FaHandshake,
  },
  {
    title: 'How does it work?',
    content: 'List your skills, browse others, and exchange services with verified members. Enjoy seamless communication, secure transactions, and premium support.',
    icon: FaFeatherAlt,
  },
  {
    title: 'Why choose us?',
    content: 'Curated membership, privacy, and a touch of old money elegance. Experience a platform where quality, trust, and luxury meet.',
    icon: FaCrown,
  },
  {
    title: 'Key Features',
    content: 'Exclusive access, luxury design, verified users, in-app messaging, and more. Join a network where your skills are truly valued.',
    icon: FaCrown,
  },
];

const shimmer = {
  background: 'linear-gradient(90deg, rgba(191,167,106,0.2) 0%, rgba(191,167,106,0.7) 50%, rgba(191,167,106,0.2) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2.5s infinite',
};

// Animation variants
const heroVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
};
const cardContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  // Generate sparkle positions only once
  const sparkles = useMemo(() =>
    Array.from({ length: 18 }, () => ({
      width: Math.random() * 10 + 6,
      height: Math.random() * 10 + 6,
      top: Math.random() * 90,
      left: Math.random() * 95,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })),
    []
  );

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-luxury-gradient overflow-x-hidden font-body">
      {/* Animated Sparkles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {sparkles.map((sparkle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-luxury-gold opacity-30"
            style={{
              width: `${sparkle.width}px`,
              height: `${sparkle.height}px`,
              top: `${sparkle.top}%`,
              left: `${sparkle.left}%`,
              filter: 'blur(1.5px)'
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
            }}
          />
        ))}
      </div>

      {/* Blurred Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <img
          src={logo}
          alt="Logo Background"
          className="w-[60vw] max-w-3xl opacity-20 blur-2xl select-none pointer-events-none"
          style={{ filter: 'blur(40px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f3ea33] to-[#014421cc] pointer-events-none" />
      </div>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center pt-24 pb-12 z-10">
        <motion.div
          variants={heroVariant}
          initial="hidden"
          animate="visible"
          className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-luxury px-10 py-10 flex flex-col items-center border border-luxury-gold/40 relative overflow-hidden"
        >
          {/* Gold shimmer overlay on logo */}
          <div className="relative mb-4 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-36 h-14 drop-shadow-lg" />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={shimmer}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-luxury-dark-green mb-2 tracking-tight drop-shadow-lg relative">
            <span className="relative z-10">{COMPANY_NAME}</span>
            <span className="block w-16 h-1 bg-luxury-gold rounded-full mt-2 mx-auto" />
          </h1>
          {/* Animated tagline */}
          <motion.p
            className="text-xl md:text-2xl text-luxury-gold font-medium mb-6 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {TAGLINE}
          </motion.p>
          <div className="flex gap-6 mt-2">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary flex items-center gap-2 text-lg shadow-lg relative overflow-hidden"
            >
              {React.createElement(FaCrown, { className: "text-luxury-gold" })} Login
              <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-luxury-gold/20 via-luxury-gold/40 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-secondary flex items-center gap-2 text-lg shadow-lg relative overflow-hidden"
            >
              {React.createElement(FaFeatherAlt, { className: "text-luxury-dark-green" })} Sign Up
              <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-luxury-gold/20 via-luxury-gold/40 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Overview/Details Cards */}
      <section className="flex flex-col items-center gap-12 py-12 z-10">
        <motion.section variants={cardContainerVariant} initial="hidden" animate="visible">
          {overviewCards.map((card, idx) => {
            return (
              <motion.div
                key={card.title}
                variants={cardVariant}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(191,167,106,0.25)' }}
                className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-gold border-2 border-luxury-gold/60 p-10 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:border-luxury-gold/90 group"
              >
                {React.createElement(card.icon, { className: "text-luxury-gold text-3xl mb-2" })}
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-luxury-dark-green mb-2 relative">
                  {card.title}
                  <span className="block w-10 h-1 bg-luxury-gold rounded-full mt-2 mx-auto group-hover:w-16 transition-all duration-300" />
                </h2>
                <p className="text-lg md:text-xl text-luxury-charcoal text-center font-body">{card.content}</p>
              </motion.div>
            );
          })}
        </motion.section>
      </section>

      {/* Contact Section */}
      <footer className="w-full flex flex-col items-center py-10 bg-white/60 backdrop-blur-lg border-t border-luxury-gold/30 mt-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-gold px-8 py-6 flex flex-col items-center border border-luxury-gold/40 max-w-lg w-full"
        >
          <h3 className="text-2xl font-display font-semibold text-luxury-dark-green mb-2">Contact Us</h3>
          <div className="flex flex-col gap-1 mb-2 w-full items-center">
            <p className="text-luxury-gold font-medium flex items-center gap-2"><FaEnvelope /> <a href="mailto:Nexaris@gmial.com" className="underline hover:text-luxury-dark-green">Nexaris@gmial.com</a></p>
            <p className="text-luxury-charcoal flex items-center gap-2"><FaPhone /> +1 (555) 123-4567</p>
            <p className="text-luxury-charcoal flex items-center gap-2"><FaMapMarkerAlt /> 123 Luxury Lane, Old Money City, 00000</p>
          </div>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-luxury-gold hover:text-luxury-dark-green text-2xl"><FaInstagram /></a>
            <a href="#" className="text-luxury-gold hover:text-luxury-dark-green text-2xl"><FaTwitter /></a>
            <a href="#" className="text-luxury-gold hover:text-luxury-dark-green text-2xl"><FaLinkedin /></a>
          </div>
        </motion.div>
      </footer>

      {/* Shimmer Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
} 