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
    className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
  >
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-water/10 rounded-full blur-[120px] -z-10 animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sunset/5 rounded-full blur-[120px] -z-10 animate-pulse" />
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-3xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-water/10 border border-cyan-water/20 text-cyan-water text-xs font-bold mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-water opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-water"></span>
        </span>
        LIVE FROM THE ISLAND
      </div>
      <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
        Gili Trawangan <br />
        <span className="bg-gradient-to-r from-cyan-water to-sunset bg-clip-text text-transparent">In Your Pocket</span>
      </h1>
      <p className="text-secondary-text text-lg md:text-xl mb-10 max-w-xl mx-auto">
        Real-time updates, island vibes, and community news. Connect with locals and travelers on the world's most beautiful car-free island.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onStart}
          className="w-full sm:w-auto bg-cyan-water text-ocean px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-water/20 transition-all transform hover:-translate-y-1"
        >
          Join the Island
        </button>
        <button className="w-full sm:w-auto glass px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
          Explore Updates
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default LandingPage;
