import React from 'react';
import { TrendingUp, UserPlus } from 'lucide-react';
import { User } from '../types';

import { Language, translations } from '../translations';

interface SidebarProps {
  suggestedUsers?: User[];
  onUserClick?: (userId: string) => void;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ suggestedUsers = [], onUserClick, language }) => {
  const t = translations[language] || translations['id'];
  return (
    <div className="hidden lg:block w-80 space-y-6">
      {/* Suggested Users */}
      {suggestedUsers.length > 0 && (
        <div className="neo-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">{t.whoToFollow}</h3>
          </div>
          <div className="space-y-4">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between group">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onUserClick?.(user.id)}
                >
                  <img src={user.profilePictureUrl || user.avatar} alt={user.displayName || user.name || user.username} className="w-10 h-10 rounded-none object-cover border-2 border-primary group-hover:border-accent transition-colors" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{user.displayName || user.name || user.username}</span>
                    <span className="text-[10px] text-secondary font-medium">@{(user.email || '').split('@')[0]}</span>
                  </div>
                </div>
                <button className="p-2 text-accent hover:bg-accent/10 rounded-none transition-colors">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending */}
      <div className="neo-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">{t.popularTags}</h3>
          <TrendingUp className="text-secondary w-5 h-5" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['#GiliLife', '#Sunset', '#TurtlePoint', '#NoCars', '#IslandVibes'].map(tag => (
            <span key={tag} className="px-3 py-1 border-2 border-primary text-[10px] font-bold text-secondary hover:border-accent hover:text-accent transition-all cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
