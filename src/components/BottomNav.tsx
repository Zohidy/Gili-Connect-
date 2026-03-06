import React from 'react';
import { Home, Calendar, MessageCircle, Users, Bell } from 'lucide-react';
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
    { id: 'events', icon: Calendar, badge: 0 },
    { id: 'messenger', icon: MessageCircle, badge: 0 },
    { id: 'friends', icon: Users, badge: 0 },
    { id: 'notification', icon: Bell, badge: unreadNotifications },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex justify-around items-center py-2 px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`relative p-2 rounded-lg transition-colors ${
            activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
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
