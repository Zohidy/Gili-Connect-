import React, { useState } from 'react';
import { Users, Plus, Search, X, Settings } from 'lucide-react';
import { User, PostCategory } from '../types';
import CommunityManagementView from './CommunityManagementView';
import { createPost } from '../services/postService';

const initialCommunities = [
  { id: 1, name: 'Diving Enthusiasts', members: 1240, description: 'Share your diving experiences and find buddies.', joined: false, adminId: 'admin1' },
  { id: 2, name: 'Island Cleanup', members: 850, description: 'Join us for weekly beach cleanups.', joined: false, adminId: 'admin1' },
  { id: 3, name: 'Local Events', members: 2100, description: 'Stay updated with events on the island.', joined: false, adminId: 'admin1' },
];

interface CommunityViewProps {
  user: User | null;
}

const CommunityView: React.FC<CommunityViewProps> = ({ user }) => {
  const [communities, setCommunities] = useState(initialCommunities);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [showManagement, setShowManagement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', description: '' });
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleJoin = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCommunities(communities.map(c => 
      c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c
    ));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommunity.name && newCommunity.description) {
      setCommunities([...communities, { 
        id: Date.now(), 
        name: newCommunity.name, 
        members: 1, 
        description: newCommunity.description, 
        joined: true,
        adminId: user?.id || 'admin1'
      }]);
      setNewCommunity({ name: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent && selectedCommunity && user) {
      try {
        await createPost({
          userId: user.id,
          content: newPostContent,
          category: 'Gili Vibes',
          communityId: selectedCommunity.toString(),
          userName: user.displayName || user.username || user.name || 'Anonymous',
          userAvatar: user.profilePictureUrl || user.avatar,
          userRole: user.role
        });
        setNewPostContent('');
        setShowCreatePostModal(false);
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post.');
      }
    }
  };

  if (selectedCommunity) {
    const community = communities.find(c => c.id === selectedCommunity);
    const isAdmin = user && (community?.adminId === user.id || user.role === 'Admin');

    if (showManagement && community) {
        return <CommunityManagementView community={community} user={user} onClose={() => setShowManagement(false)} />;
    }

    return (
      <div className="p-4 space-y-4">
        <button onClick={() => setSelectedCommunity(null)} className="text-accent font-semibold">&larr; Kembali ke Komunitas</button>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">{community?.name}</h2>
          {isAdmin && (
            <button onClick={() => setShowManagement(true)} className="text-secondary hover:text-primary"><Settings className="w-6 h-6" /></button>
          )}
        </div>
        <p className="text-secondary">{community?.description}</p>
        
        <button 
          onClick={() => setShowCreatePostModal(true)}
          className="w-full bg-accent text-white py-2 rounded-lg font-semibold"
        >
          Buat Postingan
        </button>

        <div className="space-y-4">
          <p className="text-secondary italic">Belum ada postingan di komunitas ini.</p>
        </div>

        {showCreatePostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleCreatePost} className="bg-surface p-6 rounded-xl w-full max-w-md space-y-4 border border-border">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Buat Postingan Baru</h3>
                <button type="button" onClick={() => setShowCreatePostModal(false)}><X className="w-6 h-6" /></button>
              </div>
              <textarea 
                placeholder="Apa yang ingin Anda bagikan?" required
                value={newPostContent} onChange={e => setNewPostContent(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background"
                rows={4}
              />
              <button type="submit" className="w-full bg-accent text-white py-2 rounded-lg font-semibold">Posting</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Komunitas</h2>
        <button onClick={() => setShowCreateModal(true)} className="bg-accent text-white p-2 rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-secondary w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari komunitas..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface text-primary"
        />
      </div>

      <div className="grid gap-4">
        {filteredCommunities.map(community => (
          <div key={community.id} onClick={() => setSelectedCommunity(community.id)} className="bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center justify-between cursor-pointer hover:bg-surface/80">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{community.name}</h3>
                <p className="text-secondary text-sm">{community.members} anggota</p>
                <p className="text-secondary text-xs mt-1">{community.description}</p>
              </div>
            </div>
            <button 
              onClick={(e) => toggleJoin(e, community.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                community.joined ? 'bg-secondary text-white' : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {community.joined ? 'Keluar' : 'Gabung'}
            </button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-surface p-6 rounded-xl w-full max-w-md space-y-4 border border-border">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Buat Komunitas Baru</h3>
              <button type="button" onClick={() => setShowCreateModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <input 
              type="text" placeholder="Nama Komunitas" required
              value={newCommunity.name} onChange={e => setNewCommunity({...newCommunity, name: e.target.value})}
              className="w-full p-2 rounded-lg border border-border bg-background"
            />
            <textarea 
              placeholder="Deskripsi" required
              value={newCommunity.description} onChange={e => setNewCommunity({...newCommunity, description: e.target.value})}
              className="w-full p-2 rounded-lg border border-border bg-background"
            />
            <button type="submit" className="w-full bg-accent text-white py-2 rounded-lg font-semibold">Buat</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
