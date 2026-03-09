import React, { useState } from 'react';
import { X, Users, Trash2, Settings, Shield } from 'lucide-react';
import { User } from '../types';
import { updateModerators } from '../services/communityService';

interface CommunityManagementViewProps {
  community: any;
  user: User | null;
  onClose: () => void;
}

const CommunityManagementView: React.FC<CommunityManagementViewProps> = ({ community, user, onClose }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'settings'>('users');
  const [moderators, setModerators] = useState<string[]>(community.moderators || []);

  const toggleModerator = async (userId: string) => {
    const newModerators = moderators.includes(userId)
      ? moderators.filter(id => id !== userId)
      : [...moderators, userId];
    try {
      await updateModerators(community.id, newModerators);
      setModerators(newModerators);
    } catch (error) {
      console.error('Error updating moderators:', error);
      alert('Failed to update moderators.');
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen {community.name}</h2>
        <button onClick={onClose}><X className="w-6 h-6" /></button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-border">
        {['users', 'posts', 'settings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-2 capitalize ${activeTab === tab ? 'border-b-2 border-accent font-bold' : 'text-secondary'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="font-bold">Kelola Moderator</h3>
          <div className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
            <span>Admin Utama (ID: {community.adminId})</span>
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
            <span>User 123</span>
            <button 
              onClick={() => toggleModerator('user123')}
              className={moderators.includes('user123') ? 'text-accent' : 'text-secondary'}
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          <h3 className="font-bold">Moderasi Postingan</h3>
          {/* List posts and moderation actions */}
          <div className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
            <span>Postingan tidak pantas</span>
            <button className="text-red-500"><Trash2 className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <h3 className="font-bold">Pengaturan Komunitas</h3>
          <input type="text" defaultValue={community.name} className="w-full p-2 rounded-lg border border-border bg-background" />
          <textarea defaultValue={community.description} className="w-full p-2 rounded-lg border border-border bg-background" />
          <button className="bg-accent text-white px-4 py-2 rounded-lg">Simpan Perubahan</button>
        </div>
      )}
    </div>
  );
};

export default CommunityManagementView;
