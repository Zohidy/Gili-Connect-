import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Post, PostCategory, Event, RSVP } from '../types';
import PostCard from './PostCard';
import EventCard from './EventCard';
import PostSkeleton from './PostSkeleton';
import { MapPin, Calendar, Edit2, Anchor, Heart, MessageCircle } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import RoleBadge from './RoleBadge';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  onHashtagClick?: (tag: string) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
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
  setNotification,
  onHashtagClick,
  showEditModal,
  setShowEditModal
}) => {
  const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes' | 'events'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [userRsvps, setUserRsvps] = useState<RSVP[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const isOwnProfile = currentUser?.id === user.id;

  useEffect(() => {
    if (activeTab === 'events') {
      setLoadingEvents(true);
      // 1. Get RSVPs for this user
      const rsvpQuery = query(
        collection(db, 'rsvps'),
        where('userId', '==', user.id)
      );

      const unsubscribeRsvps = onSnapshot(rsvpQuery, async (snapshot) => {
        const rsvps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVP));
        setUserRsvps(rsvps);

        // 2. Get the actual events
        if (rsvps.length > 0) {
          const eventPromises = rsvps.map(rsvp => getDoc(doc(db, 'events', rsvp.eventId)));
          const eventSnapshots = await Promise.all(eventPromises);
          const events = eventSnapshots
            .filter(snap => snap.exists())
            .map(snap => ({ id: snap.id, ...snap.data() } as Event));
          setUserEvents(events);
        } else {
          setUserEvents([]);
        }
        setLoadingEvents(false);
      }, (error) => {
        console.error("Error in RSVPs snapshot:", error);
        setLoadingEvents(false);
      });

      return () => unsubscribeRsvps();
    }
  }, [user.id, activeTab]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      // Sort client-side to avoid needing a composite index
      posts.sort((a, b) => {
        const timeA = a.createdAt instanceof Object && 'seconds' in a.createdAt ? a.createdAt.seconds : 0;
        const timeB = b.createdAt instanceof Object && 'seconds' in b.createdAt ? b.createdAt.seconds : 0;
        return timeB - timeA;
      });
      setUserPosts(posts);
      setLoadingPosts(false);
    }, (error) => {
      console.error("Error in user posts snapshot:", error);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [user.id]);

  const mediaPosts = userPosts.filter(p => p.mediaUrl);
  const likedPosts = allPosts.filter(p => p.likedBy?.includes(user.id));

  const stats = [
    { label: 'Postingan', value: userPosts.length },
    { label: 'Pengikut', value: user.followers?.length || 0 },
    { label: 'Mengikuti', value: user.following?.length || 0 },
  ];

  const handleFollowClick = async () => {
    await onFollow(user.id);
    setIsFollowingLocal(!isFollowingLocal);
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'interested') => {
    if (!currentUser) return;
    try {
      const rsvpRef = doc(db, 'rsvps', `${currentUser.id}_${eventId}`);
      await setDoc(rsvpRef, {
        userId: currentUser.id,
        eventId: eventId,
        status: status,
        timestamp: serverTimestamp()
      });
      setNotification({ message: `RSVP updated: ${status}`, type: 'success' });
    } catch (error) {
      console.error("Error updating RSVP:", error);
      setNotification({ message: 'Failed to update RSVP', type: 'error' });
    }
  };

  const handleAddToCalendar = (event: Event) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const startDate = event.date.toDate().toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(event.date.toDate().getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="card overflow-hidden relative shadow-xl border-none bg-surface/50 backdrop-blur-sm">
        {/* Cover Image */}
        <div className="h-48 w-full bg-gradient-to-r from-accent/20 to-emerald-500/20 relative group">
          {user.coverImage ? (
            <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30 bg-[#fdfcf8]">
              <Anchor className="w-12 h-12 text-accent" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="px-6 md:px-10 pb-8 relative">
          {/* Avatar & Actions */}
          <div className="flex flex-col md:flex-row items-end justify-between -mt-16 mb-6 gap-4">
            <div className="relative inline-block">
              <img 
                src={user.profilePictureUrl || user.avatar} 
                alt={user.displayName || user.name || user.username} 
                className="w-32 h-32 rounded-full border-4 border-white mx-auto relative z-10 object-cover shadow-xl" 
                referrerPolicy="no-referrer" 
              />
            </div>

            <div className="flex items-center gap-3 mb-2">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1a2e35]/5 text-[#1a2e35] rounded-2xl font-bold text-sm hover:bg-[#1a2e35]/10 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profil
                </button>
              ) : currentUser && (
                <button 
                  onClick={handleFollowClick}
                  className={`px-8 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                    isFollowingLocal 
                      ? 'bg-[#1a2e35]/5 text-[#1a2e35]' 
                      : 'bg-accent text-white hover:bg-accent/90 shadow-accent/20'
                  }`}
                >
                  {isFollowingLocal ? 'Batal Ikuti' : 'Ikuti'}
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-left mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-3xl font-black text-primary tracking-tighter">{user.displayName || user.name || user.username}</h3>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-secondary font-bold mb-4">@{(user.email || '').split('@')[0]}</p>
            
            {user.bio && (
              <div className="relative mb-6">
                <p className="text-[15px] leading-relaxed text-primary/80 max-w-2xl pl-4 border-l-2 border-accent/30 italic">
                  "{user.bio}"
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-6 mb-8">
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-secondary font-bold">
                  <MapPin className="w-4 h-4 text-accent" />
                  {user.location}
                </div>
              )}
              {user.giliConnection && (
                <div className="flex items-center gap-2 text-sm text-accent font-bold bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                  <Anchor className="w-4 h-4" />
                  {user.giliConnection}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-secondary font-bold">
                <Calendar className="w-4 h-4" />
                Bergabung {user.createdAt ? (user.createdAt instanceof Object && 'toDate' in user.createdAt ? user.createdAt.toDate().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '2024') : '2024'}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-6 border-y border-border">
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
      <div className="flex items-center gap-8 border-b border-border mb-6 px-4 overflow-x-auto">
        {[
          { id: 'posts', label: 'Postingan' },
          { id: 'media', label: 'Media' },
          { id: 'likes', label: 'Suka' },
          { id: 'events', label: 'Acara' }
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
                        onHashtagClick={onHashtagClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">Belum ada postingan.</p>
                </div>
              )
            )}

            {activeTab === 'media' && (
              mediaPosts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mediaPosts.map(post => (
                    <div key={post.id} className="aspect-square rounded-2xl overflow-hidden border border-border group relative cursor-pointer">
                      {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <img src={post.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="flex items-center gap-4 text-white font-bold">
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4 fill-white" /> {post.likes || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-white" /> {post.replyCount || 0}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">Belum ada postingan media.</p>
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
                      onHashtagClick={onHashtagClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">Belum ada postingan yang disukai.</p>
                </div>
              )
            )}

            {activeTab === 'events' && (
              loadingEvents ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="card h-48 animate-pulse bg-surface/50" />
                  ))}
                </div>
              ) : userEvents.length > 0 ? (
                <div className="space-y-4">
                  {userEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      rsvp={userRsvps.find(r => r.eventId === event.id)}
                      onRSVP={handleRSVP}
                      onAddToCalendar={handleAddToCalendar}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 card bg-surface/30 border-dashed">
                  <p className="text-secondary font-medium">Belum ada acara.</p>
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
