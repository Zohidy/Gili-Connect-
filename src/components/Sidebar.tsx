import React from 'react';
import { CloudSun, Ship, TrendingUp } from 'lucide-react';

const Sidebar: React.FC = () => (
  <div className="hidden lg:block w-80 space-y-6">
    {/* Weather Widget */}
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-sunset/10 rounded-full blur-2xl" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Island Weather</h3>
        <CloudSun className="text-sunset w-5 h-5" />
      </div>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-display font-bold">29°C</span>
        <span className="text-xs text-secondary-text mb-1">Sunny / Calm Sea</span>
      </div>
      <div className="mt-4 pt-4 border-t border-sand-border flex justify-between text-[10px] font-bold text-secondary-text">
        <span>TIDE: LOW (14:00)</span>
        <span className="text-cyan-water">UV INDEX: HIGH</span>
      </div>
    </div>

    {/* Fastboat Status */}
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Fastboat Status</h3>
        <Ship className="text-cyan-water w-5 h-5" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs">Bali - Gili T</span>
          <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold">ON TIME</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Gili T - Lombok</span>
          <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold">ON TIME</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs">Inter-Island Ferry</span>
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">DELAYED</span>
        </div>
      </div>
    </div>

    {/* Trending */}
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">Trending Tags</h3>
        <TrendingUp className="text-secondary-text w-5 h-5" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['#GiliLife', '#Sunset', '#TurtlePoint', '#NoCars', '#IslandVibes'].map(tag => (
          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-sand-border text-[10px] font-medium hover:border-cyan-water transition-colors cursor-pointer">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Sidebar;
