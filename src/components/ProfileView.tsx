import React, { useState } from 'react';
import { User, Post, PostCategory } from '../types';
import PostCard from './PostCard';
import { MapPin, Calendar, Edit2 } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  currentUser: User | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onLike: (id: string) => void;
  onReply: (content: string, image?: string, category?: PostCategory, parentId?: string) => Promise<void>;
  onUpdateProfile: (data: Partial<User>) => Promise<void>;
  allPosts: Post[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  posts, 
  currentUser, 
  onDelete, 
  onUpdate, 
  onLike, 
  onReply, 
  onUpdateProfile,
  allPosts 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl overflow-hidden relative">
        {/* Cover Image */}
        <div className="h-32 w-full bg-gradient-to-r from-cyan-water/20 to-sunset/20 relative">
          {user.coverImage && (
            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
        </div>
        
        <div className="px-8 pb-8 text-center relative">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 inline-block">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-full border-4 border-ocean mx-auto relative z-10" 
              referrerPolicy="no-referrer" 
            />
          </div>

          {isOwnProfile && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-secondary-text hover:text-white"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          <h3 className="text-2xl font-bold">{user.name}</h3>
          <p className="text-secondary-text text-sm mb-2">{user.role} • {user.email}</p>
          
          {user.bio && (
            <p className="text-sm text-secondary-text max-w-md mx-auto mb-4 italic">
              "{user.bio}"
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {user.location && (
              <div className="flex items-center gap-1.5 text-xs text-secondary-text">
                <MapPin className="w-3.5 h-3.5" />
                {user.location}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-secondary-text">
              <Calendar className="w-3.5 h-3.5" />
              Joined {user.joinedAt || '2024'}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {user.badges.map(b => (
              <span key={b} className="px-3 py-1 rounded-full bg-cyan-water/10 border border-cyan-water/20 text-cyan-water text-[10px] font-bold uppercase">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <EditProfileModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={onUpdateProfile}
      />

      <div className="space-y-4">
        <h4 className="font-bold text-sm text-secondary-text uppercase tracking-widest">
          {isOwnProfile ? 'Your Posts' : `${user.name}'s Posts`}
        </h4>
        {posts.filter(p => p.userId === user.id).length > 0 ? (
          posts.filter(p => p.userId === user.id).map(post => (
            <div key={post.id}>
              <PostCard 
                post={post} 
                currentUser={currentUser} 
                onDelete={onDelete} 
                onUpdate={onUpdate}
                onLike={onLike}
                onReply={onReply}
                allPosts={allPosts}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-secondary-text">
            {isOwnProfile ? "You haven't posted anything yet." : "No posts from this user yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
