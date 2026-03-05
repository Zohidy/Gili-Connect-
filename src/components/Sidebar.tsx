import React from 'react';
import { CloudSun, Ship, TrendingUp, UserPlus } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  suggestedUsers?: User[];
  onUserClick?: (userId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ suggestedUsers = [], onUserClick }) => (
  <div className="hidden lg:block w-80 space-y-6">
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

    {/* Suggested Users */}
    {suggestedUsers.length > 0 && (
      <div className="card p-5 bg-surface/50 backdrop-blur-sm border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Who to follow</h3>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between group">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => onUserClick?.(user.id)}
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-border group-hover:border-accent transition-colors" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{user.name}</span>
                  <span className="text-[10px] text-secondary font-medium">@{user.email.split('@')[0]}</span>
                </div>
              </div>
              <button className="p-2 text-accent hover:bg-accent/10 rounded-full transition-colors">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

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

    {/* Trending */}
    <div className="card p-5 bg-surface/50 backdrop-blur-sm border-none shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Trending Tags</h3>
        <TrendingUp className="text-secondary w-5 h-5" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['#GiliLife', '#Sunset', '#TurtlePoint', '#NoCars', '#IslandVibes'].map(tag => (
          <span key={tag} className="px-3 py-1 rounded-xl bg-background border border-border text-[10px] font-bold text-secondary hover:border-accent hover:text-accent transition-all cursor-pointer">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Sidebar;
