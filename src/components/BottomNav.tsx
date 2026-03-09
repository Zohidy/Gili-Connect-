import React from 'react';
import { Home, Camera, Users, Bell, User as UserIcon } from 'lucide-react';
import Badge from './Badge';
import { Notification } from '../types';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  notifications: Notification[];
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate, notifications }) => {
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'feed', icon: Home, badge: 0 },
    { id: 'map', icon: Camera, badge: 0 },
    { id: 'community', icon: Users, badge: 0 },
    { id: 'notification', icon: Bell, badge: unreadNotifications },
    { id: 'profile', icon: UserIcon, badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 navbar-neo flex justify-around items-center py-2 px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`relative p-2 transition-all ${
            activeTab === tab.id ? 'text-accent scale-110' : 'text-secondary hover:text-accent'
          }`}
        >
          <tab.icon className="w-7 h-7" />
          <Badge count={tab.badge} />
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
