import React from 'react';
import { Ship, LogOut, Bell } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('feed')}>
        <div className="w-8 h-8 flex items-center justify-center">
          <Ship className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-lg font-bold tracking-tight text-primary">Gili</span>
      </div>
      
      {user && (
        <div className="hidden md:flex items-center gap-1">
          <button 
            onClick={() => onNavigate('feed')}
            className="px-4 py-2 text-sm font-bold text-secondary hover:text-accent transition-colors uppercase tracking-wider"
          >
            Feed
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 text-sm font-bold text-secondary hover:text-accent transition-colors uppercase tracking-wider"
          >
            Profile
          </button>
          {user.role === 'Admin' && (
            <button 
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
            >
              Admin
            </button>
          )}
        </div>
      )}
    </div>

    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('notification')} className="p-2 text-secondary hover:text-accent transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('profile')}
          >
            <img 
              src={user.profilePictureUrl || user.avatar} 
              alt={user.displayName || user.name || user.username} 
              className="w-9 h-9 rounded-full border border-border group-hover:border-accent transition-colors object-cover" 
              referrerPolicy="no-referrer" 
            />
            <span className="hidden sm:block text-sm font-bold text-primary group-hover:text-accent transition-colors">
              {(user.displayName || user.name || user.username || '').split(' ')[0]}
            </span>
          </div>
          <div className="w-px h-4 bg-border mx-1" />
          <button onClick={onLogout} className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-secondary hover:text-red-500" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('login')} className="text-sm font-medium px-3 py-1.5 text-secondary hover:text-primary transition-colors">Login</button>
          <button onClick={() => onNavigate('signup')} className="text-sm font-medium btn-primary px-3 py-1.5 rounded-full">Sign Up</button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;
