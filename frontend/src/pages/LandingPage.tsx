import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { FaCrown, FaHandshake, FaFeatherAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { IconType } from 'react-icons';
import Header from '../components/Header';
// Use Vite's import.meta.url to get the logo path
const logo = new URL('/src/assets/logo.svg', import.meta.url).href; // <-- Replace with your real logo path

const COMPANY_NAME = 'SkillCoterie'; // <-- Updated company name
const TAGLINE = 'Elevate Your Expertise. Connect. Exchange. Grow.'; // (unchanged)
const COMPANY_DESC = 'SkillCoterie is the premier platform for exclusive, high-end skill exchange among professionals. Join a curated network where expertise meets opportunity, and every connection is a step toward excellence.'; // <-- Updated description

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
    slug: 'what-is-swapurskill',
  },
  {
    title: 'How does it work?',
    content: 'List your skills, browse others, and exchange services with verified members. Enjoy seamless communication, secure transactions, and premium support.',
    icon: FaFeatherAlt,
    slug: 'how-does-it-work',
  },
  {
    title: 'Why choose us?',
    content: 'Curated membership, privacy, and a touch of old money elegance. Experience a platform where quality, trust, and luxury meet.',
    icon: FaCrown,
    slug: 'why-choose-us',
  },
  {
    title: 'Key Features',
    content: 'Exclusive access, luxury design, verified users, in-app messaging, and more. Join a network where your skills are truly valued.',
    icon: FaCrown,
    slug: 'key-features',
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
      staggerChildren: 0.35, // more visible stagger
      delayChildren: 0.4,
    },
  },
};
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 100 }, // larger offset
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: 'easeOut' } }, // slower fade
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
    <div className="relative min-h-screen flex flex-col justify-between bg-luxury-gradient overflow-x-hidden font-body pt-20">
      <Header />
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
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-luxury-dark-green mb-2 tracking-tight drop-shadow-lg relative">
            <span className="relative z-10">{COMPANY_NAME}</span>
            <span className="block w-16 h-1 bg-luxury-gold rounded-full mt-2 mx-auto" />
          </h1>
          {/* Animated tagline */}
          <motion.p
            className="text-xl md:text-2xl font-medium mb-6 italic bg-gradient-to-r from-luxury-dark-green via-luxury-blue to-luxury-dark-green bg-clip-text text-transparent"
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
              className="btn-secondary flex items-center gap-2 text-lg shadow-lg relative overflow-hidden text-luxury-charcoal"
            >
              {React.createElement(FaFeatherAlt, { className: "text-luxury-dark-green" })} Sign Up
              <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-luxury-gold/20 via-luxury-gold/40 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Overview/Details Cards */}
      <section className="relative flex flex-col items-center py-16 z-10 w-full min-h-[60vh]">
        {/* Luxury background gradient and vignette */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-luxury-gradient opacity-80" />
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          {/* Subtle SVG pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-10" style={{mixBlendMode:'overlay'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="luxuryPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="16" stroke="#BFA76A" strokeWidth="1.5" fill="none" />
              </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#luxuryPattern)" />
          </svg>
        </div>
        <motion.section
          variants={cardContainerVariant}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full space-y-8"
        >
          {overviewCards.map((card, idx) => {
            return (
              <motion.div
                key={card.title}
                variants={cardVariant}
                whileHover={{ scale: 1.06, boxShadow: '0 12px 36px 0 rgba(191,167,106,0.30)' }}
                className="w-full max-w-2xl bg-white/40 backdrop-blur-2xl rounded-3xl shadow-gold border-2 border-luxury-gold/80 p-12 flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:border-luxury-gold group relative cursor-pointer"
                style={{ boxShadow: '0 8px 32px 0 rgba(191,167,106,0.18), 0 2px 8px 0 rgba(1,68,33,0.10)' }}
                onClick={() => navigate(`/topic/${card.slug}`)}
              >
                <div className="flex flex-col items-center mb-4">
                  {React.createElement(card.icon, { className: "text-luxury-gold text-5xl mb-3 drop-shadow-lg" })}
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-luxury-dark-green mb-1 tracking-tight text-center relative">
                    {card.title}
                    <span className="block w-16 h-1 bg-luxury-gold rounded-full mt-3 mx-auto group-hover:w-24 transition-all duration-300" />
                  </h2>
                </div>
                <p className="text-xl md:text-2xl text-luxury-charcoal text-center font-body font-medium drop-shadow-sm">{card.content}</p>
              </motion.div>
            );
          })}
        </motion.section>
      </section>

      {/* Call to Action Section */}
      <section className="relative flex flex-col items-center justify-center py-16 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1 }}
          className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-gold border border-luxury-gold/40 px-10 py-12 flex flex-col items-center max-w-2xl mx-auto relative overflow-hidden"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-luxury-dark-green mb-4 tracking-tight text-center drop-shadow-lg">
            Ready to Elevate Your Network?
          </h2>
          <p className="text-xl md:text-2xl text-luxury-charcoal mb-8 text-center font-body font-medium">
            Join SkillCoterie and unlock exclusive access to a world of high-end skill exchange, curated connections, and luxury experiences.
          </p>
          <button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-luxury-dark-green via-luxury-blue to-luxury-gold text-white font-display text-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-300 border-2 border-luxury-gold"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Join the Coterie
          </button>
          {/* Subtle animated glow */}
          <motion.div
            className="absolute -inset-2 rounded-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle at 60% 40%, #e6f5ea55 40%, #bfa76a22 100%)' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
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