import React from 'react';
import { Plus, Search, Menu, Ship, Moon, Sun, Map } from 'lucide-react';

import { Language, translations } from '../translations';

interface TopBarProps {
  onToggleMenu: () => void;
  onNavigate: (view: string) => void;
  onCreatePost: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onToggleMenu, 
  onNavigate, 
  onCreatePost,
  isDarkMode,
  onToggleDarkMode,
  language,
  searchQuery,
  setSearchQuery
}) => {
  const t = translations[language] || translations['id'];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-neo px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('feed')}>
        <div className="w-8 h-8 flex items-center justify-center">
          <Ship className="text-accent w-6 h-6 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xl font-black text-accent tracking-tighter">Gili Connect</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-sm w-40 focus:w-60 transition-all focus:border-accent outline-none"
          />
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button 
          onClick={onToggleDarkMode} 
          className="p-2 bg-background rounded-full hover:bg-border/50 transition-colors text-secondary"
          title={isDarkMode ? t.lightMode : t.darkMode}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button onClick={() => onNavigate('map')} className="p-2 bg-background rounded-full hover:bg-border/50 transition-colors text-secondary">
          <Map className="w-6 h-6" />
        </button>
        <button onClick={onCreatePost} className="p-2 bg-background rounded-full hover:bg-border/50 transition-colors text-secondary">
          <Plus className="w-6 h-6" />
        </button>
        <button onClick={onToggleMenu} className="p-2 bg-background rounded-full hover:bg-border/50 transition-colors text-secondary">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
