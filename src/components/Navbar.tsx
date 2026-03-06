import React from 'react';
import { Plus, Search, Menu, Ship } from 'lucide-react';

interface TopBarProps {
  onToggleMenu: () => void;
  onNavigate: (view: string) => void;
  onCreatePost: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleMenu, onNavigate, onCreatePost }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('feed')}>
      <div className="w-8 h-8 flex items-center justify-center">
        <Ship className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
      </div>
      <span className="text-xl font-black text-blue-600 tracking-tighter">Gili Connect</span>
    </div>
    
    <div className="flex items-center gap-2">
      <button onClick={onCreatePost} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <Plus className="w-6 h-6" />
      </button>
      <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <Search className="w-6 h-6" />
      </button>
      <button onClick={onToggleMenu} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <Menu className="w-6 h-6" />
      </button>
    </div>
  </nav>
);

export default TopBar;
