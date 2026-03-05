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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-3xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        LIVE FROM THE ISLAND
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-primary">
        Gili Trawangan <br />
        <span className="text-accent">In Your Pocket</span>
      </h1>
      <p className="text-secondary text-lg md:text-xl mb-10 max-w-xl mx-auto">
        Real-time updates, island vibes, and community news. Connect with locals and travelers on the world's most beautiful car-free island.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onStart}
          className="w-full sm:w-auto btn-primary px-8 py-4 rounded-xl font-semibold text-lg"
        >
          Join the Island
        </button>
        <button className="w-full sm:w-auto btn-secondary px-8 py-4 rounded-xl font-semibold text-lg">
          Explore Updates
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default LandingPage;
