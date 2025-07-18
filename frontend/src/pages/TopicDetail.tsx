import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const topicDetails: Record<string, { title: string; description: string }> = {
  'what-is-swapurskill': {
    title: 'What is SwapUrSkill?',
    description:
      'SwapUrSkill is a luxury platform for exclusive skill exchange among professionals. It connects you with a trusted, high-end community where you can collaborate, learn, and grow your expertise in a private, curated environment.',
  },
  'how-does-it-work': {
    title: 'How does it work?',
    description:
      'List your skills, browse other members, and exchange services with verified professionals. The platform ensures seamless communication, secure transactions, and premium support for a smooth, luxury experience.',
  },
  'why-choose-us': {
    title: 'Why choose us?',
    description:
      'SkillCoterie offers curated membership, privacy, and a touch of old money elegance. Our platform is built on quality, trust, and luxury, ensuring that every connection is meaningful and valuable.',
  },
  'key-features': {
    title: 'Key Features',
    description:
      'Enjoy exclusive access, luxury design, verified users, in-app messaging, and more. SkillCoterie is where your skills are truly valued and your network is elevated.',
  },
};

function RoyalSeal() {
  // Large, elegant wax seal SVG
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" className="mx-auto mt-8 mb-4">
      <ellipse cx="55" cy="55" rx="48" ry="44" fill="#bfa76a" stroke="#8B5C2A" strokeWidth="5" />
      <ellipse cx="55" cy="55" rx="36" ry="32" fill="#fff6e0" opacity="0.7" />
      <path d="M55 30 Q60 55 55 80 Q50 55 55 30 Z" fill="#8B5C2A" opacity="0.4" />
      <text x="55" y="67" textAnchor="middle" fontFamily="serif" fontWeight="bold" fontSize="38" fill="#8B5C2A">✶</text>
    </svg>
  );
}

function GoldEffects() {
  // Subtle gold sparkles and radial glows
  return (
    <>
      {/* Radial gold glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] max-w-3xl rounded-full bg-gradient-to-br from-[#fffbe6cc] via-[#bfa76a33] to-transparent opacity-40 blur-2xl" />
        {/* Sparkles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-luxury-gold opacity-30"
            style={{
              width: `${8 + Math.random() * 10}px`,
              height: `${8 + Math.random() * 10}px`,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              filter: 'blur(1.5px)',
            }}
          />
        ))}
      </div>
    </>
  );
}

function FoldedCorner() {
  // Top-right folded corner effect
  return (
    <div className="absolute top-0 right-0 w-24 h-24 z-20" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}}>
      <div className="w-full h-full bg-gradient-to-br from-[#fffbe6] via-[#bfa76a88] to-transparent shadow-lg" />
      <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#bfa76a] rounded-br-2xl opacity-30" />
    </div>
  );
}

function VintageBackground() {
  // SVG sketches of ships, coins, compass, feather, and map lines in dark brown, low opacity
  return (
    <>
      {/* Old ship, bottom left */}
      <svg width="220" height="120" viewBox="0 0 220 120" className="absolute bottom-0 left-0 z-10" style={{opacity:0.22}} fill="none">
        <path d="M20 100 Q60 80 100 100 Q140 120 180 100" stroke="#4b2e13" strokeWidth="3" />
        <rect x="90" y="60" width="20" height="40" fill="#4b2e13" fillOpacity="0.18" stroke="#4b2e13" strokeWidth="2" />
        <polygon points="100,60 110,80 90,80" fill="#4b2e13" fillOpacity="0.18" stroke="#4b2e13" strokeWidth="2" />
        <line x1="100" y1="60" x2="100" y2="40" stroke="#4b2e13" strokeWidth="2" />
        <polygon points="100,40 105,55 95,55" fill="#4b2e13" fillOpacity="0.12" stroke="#4b2e13" strokeWidth="1.5" />
      </svg>
      {/* Coins, top right */}
      <svg width="120" height="80" viewBox="0 0 120 80" className="absolute top-0 right-0 z-10" style={{opacity:0.18}} fill="none">
        <ellipse cx="40" cy="40" rx="30" ry="14" fill="#4b2e13" fillOpacity="0.15" stroke="#4b2e13" strokeWidth="2" />
        <ellipse cx="80" cy="30" rx="18" ry="8" fill="#4b2e13" fillOpacity="0.11" stroke="#4b2e13" strokeWidth="1.5" />
        <ellipse cx="70" cy="60" rx="10" ry="4" fill="#4b2e13" fillOpacity="0.10" stroke="#4b2e13" strokeWidth="1.2" />
        <ellipse cx="100" cy="50" rx="7" ry="3" fill="#4b2e13" fillOpacity="0.09" stroke="#4b2e13" strokeWidth="1" />
      </svg>
      {/* Compass, top left */}
      <svg width="90" height="90" viewBox="0 0 90 90" className="absolute top-0 left-0 z-10" style={{opacity:0.16}} fill="none">
        <circle cx="45" cy="45" r="38" stroke="#4b2e13" strokeWidth="3" fill="#4b2e13" fillOpacity="0.04" />
        <polygon points="45,15 50,45 45,75 40,45" fill="#4b2e13" fillOpacity="0.18" />
        <polygon points="15,45 45,50 75,45 45,40" fill="#4b2e13" fillOpacity="0.12" />
        <circle cx="45" cy="45" r="6" fill="#4b2e13" fillOpacity="0.18" />
      </svg>
      {/* Feather quill, bottom right */}
      <svg width="120" height="80" viewBox="0 0 120 80" className="absolute bottom-0 right-0 z-10" style={{opacity:0.15}} fill="none">
        <path d="M30 70 Q60 30 110 10 Q90 50 50 75" stroke="#4b2e13" strokeWidth="3" fill="none" />
        <path d="M60 40 Q70 50 80 30" stroke="#4b2e13" strokeWidth="2" fill="none" />
      </svg>
      {/* Old map lines, center left */}
      <svg width="180" height="120" viewBox="0 0 180 120" className="absolute top-1/3 left-0 z-10" style={{opacity:0.10}} fill="none">
        <path d="M10 20 Q60 60 170 30" stroke="#4b2e13" strokeWidth="2" fill="none" />
        <path d="M20 80 Q90 100 160 90" stroke="#4b2e13" strokeWidth="2" fill="none" />
      </svg>
    </>
  );
}

export default function TopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug && topicDetails[slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="min-h-screen flex flex-col justify-between bg-luxury-gradient font-body"
    >
      {/* Gold effects and blur overlay */}
      <GoldEffects />
      <div className="absolute inset-0 z-10 backdrop-blur-[1.5px] opacity-40" />
      {/* Vintage elements (ships, coins, compass, feather, map lines) */}
      <VintageBackground />
      {/* Folded corner */}
      <FoldedCorner />
      <div className="relative z-20 w-full flex flex-col items-center">
        <RoyalSeal />
        <main className="flex flex-col items-center w-full max-w-3xl px-6 mt-2">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-luxury-gold mb-8 drop-shadow-lg text-center tracking-wider" style={{letterSpacing: '0.04em'}}>
            {topic ? topic.title : 'Topic Not Found'}
          </h1>
          <p className="text-2xl text-luxury-charcoal text-center mb-16 font-body italic max-w-2xl" style={{lineHeight: '2.2rem'}}>
            {topic ? topic.description : 'Sorry, we couldn\'t find details for this topic.'}
          </p>
        </main>
        <div className="flex-1" />
        <div className="w-full flex justify-center mb-12">
          <button
            className="px-10 py-4 rounded-full bg-gradient-to-b from-[#f5e7c6] to-[#bfa76a] text-luxury-dark-green font-display text-xl font-semibold shadow-xl border-2 border-luxury-gold hover:scale-105 active:scale-95 transition-all duration-300 outline outline-2 outline-offset-2 outline-luxury-gold"
            onClick={() => window.history.back()}
          >
            ← Return
          </button>
        </div>
      </div>
    </motion.div>
  );
} 