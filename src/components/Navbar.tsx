import React from 'react';
import { Ship, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-water to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-water/20">
        <Ship className="text-white w-6 h-6" />
      </div>
      <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-cyan-water bg-clip-text text-transparent">Gili Connect</span>
    </div>

    {user ? (
      <div className="hidden md:flex items-center gap-8">
        <button onClick={() => onNavigate('feed')} className="text-sm font-medium hover:text-cyan-water transition-colors">Feed</button>
        <button onClick={() => onNavigate('directory')} className="text-sm font-medium hover:text-cyan-water transition-colors">Directory</button>
        <button onClick={() => onNavigate('market')} className="text-sm font-medium hover:text-cyan-water transition-colors">Market</button>
      </div>
    ) : null}

    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold">{user.name}</p>
            <p className="text-[10px] text-secondary-text">{user.role}</p>
          </div>
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-cyan-water/30" referrerPolicy="no-referrer" />
          <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary-text hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('login')} className="text-sm font-medium px-4 py-2 hover:text-cyan-water transition-colors">Login</button>
          <button onClick={() => onNavigate('signup')} className="text-sm font-medium bg-cyan-water text-ocean px-4 py-2 rounded-lg hover:bg-cyan-water/90 transition-colors">Sign Up</button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;
