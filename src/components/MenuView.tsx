import React from 'react';
import { 
  MessageCircle, Users, UserPlus, Calendar, Home, Settings, HelpCircle, UserPlus2, LogOut, ChevronDown, RefreshCw, Moon, Sun, Camera, Shield
} from 'lucide-react';
import { User } from '../types';

import { Language, translations } from '../translations';

interface MenuViewProps {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (view: string) => void;
  language: Language;
}

const MenuView: React.FC<MenuViewProps> = ({ 
  user, 
  onClose, 
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  onNavigate,
  language
}) => {
  const t = translations[language] || translations['id'];
  const isAdmin = user?.role === 'Admin';
  
  const menuItems = [
    { icon: Home, label: t.home, color: 'text-blue-500', view: 'feed' },
    { icon: MessageCircle, label: t.messages, color: 'text-blue-500', view: 'friends' },
    { icon: Users, label: t.friends, color: 'text-blue-500', view: 'friends' },
    { icon: Calendar, label: t.events, color: 'text-red-500', view: 'events' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: Shield, label: t.admin, color: 'text-red-500', view: 'admin' });
  }

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto pb-20">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
        <h2 className="text-2xl font-black text-primary">Menu</h2>
        <button onClick={onClose} className="p-2 text-primary font-bold hover:bg-border/30 rounded-lg transition-colors">{t.close}</button>
      </div>

      <div className="p-4 space-y-4">
        {/* User Profile */}
        <div 
          onClick={() => handleNavigate('profile')}
          className="neo-card p-4 flex items-center justify-between hover:bg-border/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img src={user?.avatar || user?.profilePictureUrl} alt={user?.name || user?.displayName} className="w-10 h-10 rounded-full border border-border object-cover" referrerPolicy="no-referrer" />
            <div>
              <div className="font-bold text-primary">{user?.name || user?.displayName}</div>
              <div className="text-xs text-secondary">{t.viewProfile}</div>
            </div>
          </div>
          <RefreshCw className="w-5 h-5 text-secondary opacity-40" />
        </div>

        {/* Dark Mode Toggle */}
        <div 
          onClick={onToggleDarkMode}
          className="neo-card p-4 flex items-center justify-between hover:bg-border/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              {isDarkMode ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
            </div>
            <div className="font-bold text-primary">{isDarkMode ? t.lightMode : t.darkMode}</div>
          </div>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-accent' : 'bg-border'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>

        {/* Switch Account */}
        <div 
          onClick={() => alert(language === 'id' ? 'Fitur beralih akun akan segera hadir!' : 'Switch account feature is coming soon!')}
          className="neo-card p-4 flex items-center justify-between hover:bg-border/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="font-bold text-primary">{t.switchAccount}</div>
          </div>
          <ChevronDown className="w-5 h-5 text-secondary opacity-40" />
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleNavigate(item.view)}
              className="neo-card p-4 flex flex-col gap-3 hover:bg-border/30 transition-colors cursor-pointer"
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="font-bold text-sm text-primary">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer Items */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div 
            onClick={() => handleNavigate('settings')}
            className="p-4 flex items-center gap-3 hover:bg-border/30 transition-colors cursor-pointer rounded-xl"
          >
            <Settings className="w-5 h-5 text-secondary" />
            <span className="font-bold text-primary">{t.settings}</span>
          </div>
          <div 
            onClick={() => alert('Hubungi kami di support@giliconnect.com')}
            className="p-4 flex items-center gap-3 hover:bg-border/30 transition-colors cursor-pointer rounded-xl"
          >
            <HelpCircle className="w-5 h-5 text-secondary" />
            <span className="font-bold text-primary">{t.helpSupport}</span>
          </div>
          <div 
            onClick={() => alert(language === 'id' ? 'Fitur ini akan segera hadir!' : 'This feature is coming soon!')}
            className="p-4 flex items-center gap-3 hover:bg-border/30 transition-colors cursor-pointer rounded-xl"
          >
            <UserPlus2 className="w-5 h-5 text-secondary" />
            <span className="font-bold text-primary">{t.addAccount}</span>
          </div>
          <div onClick={onLogout} className="p-4 flex items-center gap-3 hover:bg-red-500/10 transition-colors cursor-pointer text-red-500 rounded-xl">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">{t.logout}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuView;
