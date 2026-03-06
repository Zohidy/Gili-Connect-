import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Post, PostCategory } from '../types';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';
import { MapPin, Calendar, Edit2, Anchor, Heart } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import RoleBadge from './RoleBadge';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface ProfileViewProps {
  user: User;
  currentUser: User | null;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onLike: (id: string) => void;
  onReply: (content: string, image?: string, category?: PostCategory, parentId?: string) => Promise<void>;
  onReport: (postId: string) => void;
  onUpdateProfile: (data: Partial<User>) => Promise<void>;
  onFollow: (userId: string) => Promise<void>;
  isFollowing: boolean;
  allPosts: Post[];
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  currentUser, 
  onDelete, 
  onUpdate, 
  onLike, 
  onReply, 
  onReport,
  onUpdateProfile,
  onFollow,
  isFollowing,
  allPosts,
  setNotification 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const isOwnProfile = currentUser?.id === user.id;

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setUserPosts(posts);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [user.id]);

  const mediaPosts = userPosts.filter(p => p.image);
  const likedPosts = allPosts.filter(p => p.likedBy?.includes(user.id));

  const stats = [
    { label: 'Posts', value: userPosts.length },
    { label: 'Followers', value: user.followers?.length || 0 },
    { label: 'Following', value: user.following?.length || 0 },
  ];

  const handleFollowClick = async () => {
    await onFollow(user.id);
    setIsFollowingLocal(!isFollowingLocal);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="card overflow-hidden relative shadow-xl border-none bg-surface/50 backdrop-blur-sm">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-accent/20 to-primary/20 relative group">
          {user.coverImage ? (
            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <Anchor className="w-12 h-12 text-accent" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="px-6 md:px-10 pb-8 relative">
          {/* Avatar & Actions */}
          <div className="flex flex-col md:flex-row items-end justify-between -mt-16 mb-6 gap-4">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full border-4 border-surface mx-auto relative z-10 object-cover shadow-2xl" 
                referrerPolicy="no-referrer" 
              />
            </div>

            <div className="flex items-center gap-3 mb-2">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 btn-secondary rounded-2xl font-bold text-sm shadow-lg hover:shadow-accent/10 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : currentUser && (
                <button 
                  onClick={handleFollowClick}
                  className={`px-8 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                    isFollowingLocal 
                      ? 'btn-secondary' 
                      : 'btn-primary hover:shadow-accent/20 scale-105 active:scale-95'
                  }`}
                >
                  {isFollowingLocal ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-left mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-3xl font-black text-primary tracking-tight">{user.name}</h3>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-secondary font-medium mb-4">@{user.email.split('@')[0]}</p>
            
            {user.bio && (
              <p className="text-[15px] leading-relaxed text-primary/80 max-w-2xl mb-6">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-6 mb-8">
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                  <MapPin className="w-4 h-4 text-accent" />
                  {user.location}
                </div>
              )}
              {user.giliConnection && (
                <div className="flex items-center gap-2 text-sm text-accent font-bold">
                  <Anchor className="w-4 h-4" />
                  {user.giliConnection}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-secondary font-medium">
                <Calendar className="w-4 h-4" />
                Joined {user.joinedAt || '2024'}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-6 border-y border-border/50">
              {stats.map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-xl font-black text-primary tracking-tight">{stat.value}</span>
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {user.interests.map(interest => (
                <span key={interest} className="px-3 py-1 rounded-xl bg-accent/5 text-accent text-xs font-bold border border-accent/10 hover:bg-accent/10 transition-colors cursor-pointer">
                  #{interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-border mb-6 px-4">
        {[
          { id: 'posts', label: 'Posts' },
          { id: 'media', label: 'Media' },
          { id: 'likes', label: 'Likes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-accent' : 'text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <EditProfileModal 
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={onUpdateProfile}
        setNotification={setNotification}
      />

      <div className="space-y-4">
        {loadingPosts ? (
          <div className="space-y-4">
            {[1, 2].map(i => <PostSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {activeTab === 'posts' && (
              userPosts.length > 0 ? (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-4"
                >
                  {userPosts.map(post => (
                    <motion.div 
                      key={post.id} 
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <PostCard 
                        post={post} 
                        currentUser={currentUser} 
                        onDelete={onDelete} 
                        onUpdate={onUpdate}
                        onLike={onLike}
                        onReply={onReply}
                        onReport={onReport}
                        allPosts={allPosts}
                        setNotification={setNotification}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">No posts yet.</p>
                </div>
              )
            )}

            {activeTab === 'media' && (
              mediaPosts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaPosts.map(post => (
                    <div key={post.id} className="aspect-square rounded-2xl overflow-hidden border border-border group relative cursor-pointer">
                      <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="flex items-center gap-4 text-white font-bold">
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> {post.likes}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">No media posts yet.</p>
                </div>
              )
            )}

            {activeTab === 'likes' && (
              likedPosts.length > 0 ? (
                <div className="space-y-4">
                  {likedPosts.map(post => (
                    <PostCard 
                      key={post.id}
                      post={post} 
                      currentUser={currentUser} 
                      onDelete={onDelete} 
                      onUpdate={onUpdate}
                      onLike={onLike}
                      onReply={onReply}
                      onReport={onReport}
                      allPosts={allPosts}
                      setNotification={setNotification}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">No liked posts yet.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
