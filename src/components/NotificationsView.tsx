import React from 'react';
import { Notification } from '../types';
import { motion } from 'motion/react';

interface NotificationsViewProps {
  notifications: Notification[];
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Notifikasi</h2>
      {notifications.length === 0 ? (
        <p className="text-secondary text-center py-10">Tidak ada notifikasi baru.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <motion.div 
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border border-border ${notification.read ? 'bg-surface' : 'bg-accent/5'}`}
            >
              <p className="text-sm">
                <span className="font-bold">{notification.senderName}</span>
                {' '}
                {notification.type === 'like' && 'menyukai postingan Anda'}
                {notification.type === 'reply' && 'membalas postingan Anda'}
                {notification.type === 'follow' && 'mulai mengikuti Anda'}
              </p>
              <p className="text-xs text-secondary mt-1">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsView;
