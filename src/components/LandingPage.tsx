import React from 'react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 bg-[#fdfcf8]"
  >
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-3xl"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-8 tracking-widest uppercase">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        Island Status: Live
      </div>
      <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] text-[#1a2e35] tracking-tighter">
        Gili Trawangan <br />
        <span className="text-accent">In Your Pocket</span>
      </h1>
      <p className="text-[#1a2e35]/70 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
        Real-time updates, island vibes, and community news. Connect with locals and travelers on the world's most beautiful car-free island.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onStart}
          className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all hover:scale-105"
        >
          Join the Island
        </button>
        <button className="w-full sm:w-auto bg-[#1a2e35]/5 text-[#1a2e35] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#1a2e35]/10 transition-all">
          Explore Updates
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default LandingPage;
