import React from 'react';
import { motion } from 'motion/react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="card p-5 mb-4 overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-border/50 animate-pulse" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-border/50 rounded animate-pulse" />
            <div className="w-16 h-3 bg-border/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-16 h-6 bg-border/50 rounded-lg animate-pulse" />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 bg-border/50 rounded animate-pulse" />
        <div className="w-full h-4 bg-border/50 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-border/50 rounded animate-pulse" />
      </div>
      
      <div className="w-full h-48 bg-border/50 rounded-2xl mb-4 animate-pulse" />
      
      <div className="flex items-center gap-6 pt-4 border-t border-border">
        <div className="w-12 h-6 bg-border/50 rounded-full animate-pulse" />
        <div className="w-12 h-6 bg-border/50 rounded-full animate-pulse" />
        <div className="w-12 h-6 bg-border/50 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default PostSkeleton;
