import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const logo = new URL('/src/assets/logo.svg', import.meta.url).href;

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '#features' },
  { name: 'Login', path: '/login' },
  { name: 'Sign Up', path: '/signup' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-30 bg-white/40 backdrop-blur-2xl border-b-2 border-luxury-gold/70 shadow-gold flex items-center justify-between px-6 md:px-16 py-3 md:py-4"
      style={{ boxShadow: '0 4px 24px 0 rgba(191,167,106,0.10)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/') }>
        <img src={logo} alt="Logo" className="w-14 h-10 md:w-20 md:h-14 object-contain drop-shadow-lg" />
        <span className="font-display text-2xl md:text-3xl font-bold text-luxury-dark-green tracking-tight">SkillCoterie</span>
      </div>
      {/* Navigation */}
      <nav className="hidden md:flex gap-8 items-center">
        {navLinks.map(link => {
          const isActive = (location.pathname === link.path) || (link.path === '/' && location.pathname === '/');
          return (
            <button
              key={link.name}
              onClick={() => link.path.startsWith('#') ? window.scrollTo({ top: 600, behavior: 'smooth' }) : navigate(link.path)}
              className={`relative font-display text-lg px-2 py-1 transition-all duration-200 text-luxury-dark-green hover:text-luxury-gold focus:outline-none ${isActive ? 'text-luxury-gold' : ''}`}
            >
              {link.name}
              <span className={`absolute left-0 -bottom-1 w-full h-0.5 rounded-full bg-luxury-gold transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}`}></span>
            </button>
          );
        })}
      </nav>
      {/* Mobile nav (optional: hamburger) */}
    </motion.header>
  );
} 