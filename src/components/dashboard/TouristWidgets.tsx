import React from 'react';
import { CloudSun, Ship } from 'lucide-react';

const TouristWidgets: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Weather Widget */}
      <div className="card p-5 relative overflow-hidden bg-surface/50 backdrop-blur-sm border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Island Weather</h3>
          <CloudSun className="text-accent w-5 h-5" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-primary tracking-tighter">29°C</span>
          <span className="text-xs font-bold text-secondary mb-1 uppercase">Sunny / Calm Sea</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-[10px] font-black text-secondary tracking-widest">
          <span>TIDE: LOW (14:00)</span>
          <span className="text-accent">UV INDEX: HIGH</span>
        </div>
      </div>

      {/* Fastboat Status */}
      <div className="card p-5 bg-surface/50 backdrop-blur-sm border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Fastboat Status</h3>
          <Ship className="text-accent w-5 h-5" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Bali - Gili T</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase">ON TIME</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Gili T - Lombok</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase">ON TIME</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Inter-Island Ferry</span>
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black tracking-widest uppercase">DELAYED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristWidgets;
