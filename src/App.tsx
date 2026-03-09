/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User as UserIcon, 
  PlusSquare,
  Users,
  Bell,
  Shield,
  Camera,
  Calendar,
  Filter,
  Search,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, googleProvider } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  limit,
  getDocs,
  where
} from 'firebase/firestore';
import { User, Post, Notification, IslandRole, PostCategory } from './types';
import { getUserById } from './services/userService';
import { likePost } from './services/postService';
import { Language, translations } from './translations';

// Components
import MenuView from './components/MenuView';
import SettingsView from './components/SettingsView';
import LostFoundView from './components/LostFoundView';
import MarketplaceView from './components/MarketplaceView';
import TopBar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';
import CreatePostModal from './components/CreatePostModal';
import ProfileView from './components/ProfileView';
import PostSkeleton from './components/PostSkeleton';
import AdminSettings from './components/AdminSettings';
import NotificationsView from './components/NotificationsView';
import EventsView from './components/EventsView';
import TouristWidgets from './components/dashboard/TouristWidgets';
import GiliMap from './components/GiliMap';
import CommunityView from './components/CommunityView';
import { reportPost } from './services/reportService';

export default function App() {
  const [view, setView] = useState('landing');
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState<{ show: boolean; postId: string | null }>({ show: false, postId: null });
  const [reportReason, setReportReason] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('Gili Vibes');
  const [initializing, setInitializing] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'All'>('All');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState<Language>('id');
  const t = translations[language] || translations['id'];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (view !== 'profile') {
      setSelectedUser(null);
    }
    if (view !== 'feed') {
      setSelectedCategory('All');
    }
  }, [view]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let currentUserData = await getUserById(firebaseUser.uid);
        
        if (!currentUserData) {
          currentUserData = {
            id: firebaseUser.uid,
            username: firebaseUser.displayName || 'Island Explorer',
            email: firebaseUser.email || '',
            createdAt: Timestamp.now(),
            displayName: firebaseUser.displayName || 'Island Explorer',
            profilePictureUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100`,
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), currentUserData);
        }
        
        setUser(currentUserData);
        
        // Only redirect if we are on an auth/landing page
        setView(prev => {
          if (prev === 'landing' || prev === 'login' || prev === 'signup') {
            return 'feed';
          }
          return prev;
        });
      } else {
        setUser(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  // Notifications Listener
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const userNotifications = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(userNotifications);
    }, (error) => {
      console.error("Notifications listener error:", error);
    });

    return unsubscribeNotifications;
  }, [user]);

  // Posts Listener
  useEffect(() => {
    const q = sortBy === 'likes' 
      ? query(collection(db, 'posts'), orderBy('likes', 'desc'))
      : query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedPosts = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        // Convert Firestore timestamp to string for UI
        let timestamp = 'Just now';
        if (data.createdAt instanceof Timestamp) {
          const date = data.createdAt.toDate();
          const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
          if (diff < 60) timestamp = 'Just now';
          else if (diff < 3600) timestamp = `${Math.floor(diff / 60)} mins ago`;
          else if (diff < 86400) timestamp = `${Math.floor(diff / 3600)} hours ago`;
          else timestamp = date.toLocaleDateString();
        }

        let userAvatar = data.userAvatar;
        let userName = data.userName;
        let userRole = data.userRole;

        if (!userAvatar || !userName) {
             try {
                 const userData = await getUserById(data.userId);
                 if (userData) {
                     userAvatar = userData.profilePictureUrl || userData.avatar;
                     userName = userData.displayName || userData.username || userData.name;
                     userRole = userData.role;
                 }
             } catch (e) {
                 console.error("Error fetching user for post:", e);
             }
        }

        return {
          id: docSnapshot.id,
          userId: data.userId,
          content: data.content,
          createdAt: data.createdAt,
          timestamp: timestamp, // Use formatted timestamp string
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          category: data.category,
          userAvatar,
          userName,
          userRole,
          location: data.location,
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
          replyCount: data.replyCount || 0,
          parentId: data.parentId
        } as Post;
      }));
      setPosts(fetchedPosts);
      setLoadingPosts(false);
    }, (error) => {
      console.error("Posts listener error:", error);
      setLoadingPosts(false);
    });

    return () => unsubscribe();
  }, [sortBy]);

  // Fetch Suggested Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), limit(5));
        const snapshot = await getDocs(q);
        const users = snapshot.docs
          .map(doc => doc.data() as User)
          .filter(u => u.id !== user?.id);
        setSuggestedUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleHashtagClick = (tag: string) => {
    setSearchQuery(tag);
    setView('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuth = async (email: string, pass: string, name?: string, role?: IslandRole) => {
    try {
      if (name) {
        // Check if username already exists
        const usernameQuery = query(collection(db, 'users'), where('username', '==', name));
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (!usernameSnapshot.empty) {
          throw new Error('Username is already taken. Please choose another one.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const newUser: User = {
          id: userCredential.user.uid,
          username: name,
          email: email,
          createdAt: Timestamp.now(),
          displayName: name,
          profilePictureUrl: `https://picsum.photos/seed/${userCredential.user.uid}/100`,
          role: role || 'Tourist',
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        setUser(newUser);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      setView('feed');
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = 'Authentication failed. Please try again.';
      if (error.message === 'Username is already taken. Please choose another one.') {
        message = error.message;
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      }
      setNotification({ message, type: 'error' });
      // Don't re-throw if we handled it with a notification, or handle it in the UI component
      // But the original code threw an error, likely for the AuthPage to catch if it does anything.
      // Looking at AuthPage usage, it might not be catching it, but let's see.
      // The original code had `throw new Error(message);` at the end of catch block.
      throw new Error(message);
    }
  };

  const handleGoogleAuth = async () => {
    await signInWithPopup(auth, googleProvider);
    setView('feed');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('landing');
  };

  const handleCreatePost = async (content: string, mediaUrl?: string, category?: PostCategory, parentId?: string, location?: string) => {
    if (!content.trim() || !user) return;
    
    try {
      const postData = {
        userId: user.id,
        content: content,
        mediaUrl: mediaUrl?.trim() || null,
        mediaType: mediaUrl ? (mediaUrl.match(/\.(mp4|webm)$/i) ? 'video' : 'image') : null,
        createdAt: serverTimestamp(),
        category: category || 'Gili Vibes',
        userAvatar: user.profilePictureUrl || user.avatar,
        userName: user.displayName || user.username || user.name,
        userRole: user.role,
        parentId: parentId || null,
        location: location || null,
        likes: 0,
        likedBy: [],
        replyCount: 0
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);

      if (parentId) {
        // Increment reply count on parent post
        const parentRef = doc(db, 'posts', parentId);
        await updateDoc(parentRef, {
          replyCount: increment(1)
        });

        // Notify parent post owner
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          const parentData = parentSnap.data();
          if (parentData.userId !== user.id) {
            await addDoc(collection(db, 'notifications'), {
              userId: parentData.userId,
              type: 'reply',
              senderId: user.id,
              senderName: user.displayName || user.username || user.name,
              postId: parentId,
              timestamp: serverTimestamp(),
              read: false
            });
          }
        }
      }
      
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        const postData = postSnap.data();
        if (postData.parentId) {
          const parentRef = doc(db, 'posts', postData.parentId);
          await updateDoc(parentRef, {
            replyCount: increment(-1)
          });
        }
      }

      await deleteDoc(postRef);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleUpdatePost = async (postId: string, newContent: string) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        content: newContent,
      });
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  const handleUpdateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleReportPost = async (postId: string, reason: string) => {
    if (!user) return;
    try {
      await reportPost(postId, user.id, reason);
      setNotification({ message: 'Post reported successfully.', type: 'success' });
      setShowReportModal({ show: false, postId: null });
      setReportReason('');
    } catch (error) {
      console.error("Error reporting post:", error);
      setNotification({ message: 'Failed to report post.', type: 'error' });
    }
  };

  const handleUserClick = async (userId: string) => {
    if (user && userId === user.id) {
      setSelectedUser(user);
      setView('profile');
    } else {
      const fetchedUser = await getUserById(userId);
      if (fetchedUser) {
        setSelectedUser(fetchedUser);
        setView('profile');
      }
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const isLiked = post.likedBy?.includes(user.id) || false;
    try {
      await likePost(postId, user.id, isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;
    try {
      const followRef = doc(db, 'follows', `${user.id}_${userId}`);
      const followSnap = await getDoc(followRef);
      
      if (followSnap.exists()) {
        await deleteDoc(followRef);
      } else {
        await setDoc(followRef, {
          followerId: user.id,
          followingId: userId,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background text-primary">
      {user && view !== 'landing' && view !== 'login' && view !== 'signup' && (
        <TopBar 
          onToggleMenu={() => setShowMenu(true)} 
          onNavigate={setView} 
          onCreatePost={() => setShowCreateModal(true)} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          language={language}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      
      {showMenu && (
        <MenuView 
          user={user} 
          onClose={() => setShowMenu(false)} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onNavigate={setView}
        />
      )}
      
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingPage key="landing" onStart={() => setView(user ? 'feed' : 'login')} />
        )}
        
        {(view === 'login' || view === 'signup') && (
          <AuthPage key="auth" mode={view as 'login' | 'signup'} onAuth={handleAuth} onGoogleAuth={handleGoogleAuth} />
        )}
        
        {(view === 'feed' || view === 'friends' || view === 'notification' || view === 'profile' || view === 'settings' || view === 'lost-found' || view === 'marketplace' || view === 'community') && (
          <motion.main 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 pt-24 flex gap-8"
          >
            {/* Left Sidebar / Nav */}
            <div className="hidden md:flex flex-col gap-2 w-20 lg:w-64">
              {[
                { id: 'feed', icon: Home, label: t.home },
                { id: 'map', icon: Camera, label: 'Map' },
                { id: 'friends', icon: Users, label: t.friends },
                { id: 'profile', icon: UserIcon, label: t.profile },
                { id: 'lost-found', icon: Search, label: 'Lost & Found' },
                { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
                { id: 'community', icon: Users, label: 'Community' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'profile') setSelectedUser(user);
                    setView(item.id);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${view === item.id ? 'bg-accent/10 text-accent' : 'hover:bg-border/50 text-secondary'}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="hidden lg:block font-semibold">{item.label}</span>
                </button>
              ))}
              
              {user?.role === 'Admin' && (
                <button 
                  onClick={() => setView('admin')}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${view === 'admin' ? 'bg-red-500/10 text-red-500' : 'hover:bg-border/50 text-secondary'}`}
                >
                  <Users className="w-6 h-6" />
                  <span className="hidden lg:block font-semibold">{t.admin}</span>
                </button>
              )}
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 flex items-center justify-center gap-4 p-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <PlusSquare className="w-6 h-6" />
                <span className="hidden lg:block font-semibold">{t.createPost}</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-bold capitalize tracking-tight">{view === 'feed' ? t.home : view === 'profile' ? t.profile : view === 'friends' ? t.friends : view === 'notification' ? t.notifications : view === 'settings' ? t.settings : view}</h2>
                  {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <span>{t.searchingFor} <span className="text-accent font-bold">{searchQuery}</span></span>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-xs bg-surface border border-border px-2 py-0.5 rounded-full hover:bg-border/50"
                      >
                        {t.clear}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {view === 'feed' && (
                    <div className="flex items-center gap-2">
                      <div className="relative hidden sm:block">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-2 rounded-lg bg-surface border border-border text-sm w-40 focus:w-60 transition-all focus:border-accent outline-none"
                        />
                        <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      <div className="flex bg-surface rounded-lg p-1 border border-border">
                        <button 
                          onClick={() => setSortBy('latest')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${sortBy === 'latest' ? 'bg-background shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                        >
                          {t.latest}
                        </button>
                        <button 
                          onClick={() => setSortBy('likes')}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${sortBy === 'likes' ? 'bg-background shadow-sm text-primary' : 'text-secondary hover:text-primary'}`}
                        >
                          {t.top}
                        </button>
                      </div>

                      {view === 'feed' && (
                        <div className="relative">
                          <button 
                            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                            className={`p-2 rounded-lg border transition-all ${
                              selectedCategory !== 'All' || showCategoryFilter
                                ? 'bg-accent text-white border-accent' 
                                : 'bg-surface border-border text-secondary hover:border-accent/50'
                            }`}
                            title="Filter by category"
                          >
                            <Filter className="w-5 h-5" />
                          </button>

                          <AnimatePresence>
                            {showCategoryFilter && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setShowCategoryFilter(false)} 
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                                >
                                  <div className="p-2 space-y-1">
                                    {['All', 'News', 'Party', 'Fastboat', 'Safety', 'Food', 'Marketplace', 'Gili Vibes', 'Lost and Found'].map((cat) => (
                                      <button
                                        key={cat}
                                        onClick={() => {
                                          setSelectedCategory(cat as PostCategory | 'All');
                                          setShowCategoryFilter(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                          selectedCategory === cat 
                                            ? 'bg-accent/10 text-accent' 
                                            : 'text-secondary hover:bg-background hover:text-primary'
                                        }`}
                                      >
                                        {cat}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {view === 'settings' && (
                <SettingsView 
                  user={user} 
                  onLogout={handleLogout} 
                  onNavigate={setView}
                  onEditProfile={() => setShowEditModal(true)}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              )}
              {view === 'map' && (
                <div className="p-6">
                  <GiliMap />
                </div>
              )}
              {view === 'lost-found' && <LostFoundView />}
              {view === 'marketplace' && <MarketplaceView />}
              {view === 'community' && <CommunityView user={user} />}

              {view === 'feed' && (
                <div className="space-y-6">
                  <TouristWidgets language={language} />
                  {/* Post Trigger */}
                  {user && (
                    <div 
                      onClick={() => setShowCreateModal(true)}
                      className="card p-4 flex items-center gap-4 cursor-pointer hover:bg-surface/50 transition-colors group"
                    >
                      <img src={user.profilePictureUrl || user.avatar} alt={user.displayName || user.name || user.username} className="w-10 h-10 rounded-full border border-border" referrerPolicy="no-referrer" />
                      <div className="flex-1 bg-background border border-border rounded-full px-5 py-2.5 text-secondary text-sm group-hover:border-accent/50 transition-colors">
                        {t.whatHappening}
                      </div>
                      <PlusSquare className="w-5 h-5 text-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {loadingPosts ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                    </div>
                  ) : posts.filter(p => {
                    if (p.parentId) return false;
                    if (selectedCategory !== 'All') return p.category === selectedCategory;
                    if (searchQuery) {
                      const query = searchQuery.toLowerCase();
                      const contentMatch = p.content?.toLowerCase().includes(query) || false;
                      const categoryMatch = p.category?.toLowerCase().includes(query) || false;
                      const userMatch = p.userName?.toLowerCase().includes(query) || false;
                      return contentMatch || categoryMatch || userMatch;
                    }
                    return true;
                  }).length > 0 ? (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                      }}
                      className="space-y-6"
                    >
                      {posts.filter(p => {
                        if (p.parentId) return false;
                        if (selectedCategory !== 'All') return p.category === selectedCategory;
                        if (searchQuery) {
                          const query = searchQuery.toLowerCase();
                          const contentMatch = p.content?.toLowerCase().includes(query) || false;
                          const categoryMatch = p.category?.toLowerCase().includes(query) || false;
                          const userMatch = p.userName?.toLowerCase().includes(query) || false;
                          return contentMatch || categoryMatch || userMatch;
                        }
                        return true;
                      }).map(post => (
                        <motion.div 
                          key={post.id} 
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                          }}
                        >
                          <PostCard 
                            post={post} 
                            currentUser={user} 
                            onDelete={handleDeletePost} 
                            onUpdate={handleUpdatePost}
                            onLike={handleLikePost}
                            onReply={handleCreatePost}
                            onReport={(postId) => setShowReportModal({ show: true, postId })}
                            allPosts={posts}
                            onUserClick={handleUserClick}
                            setNotification={setNotification}
                            onHashtagClick={handleHashtagClick}
                            language={language}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-20 text-secondary">
                      <p className="mb-4">{t.noUpdates}</p>
                    </div>
                  )}
                </div>
              )}

              {view === 'profile' && (selectedUser || user) && (
                <ProfileView 
                  user={selectedUser || user!} 
                  currentUser={user}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                  onLike={handleLikePost}
                  onReply={handleCreatePost}
                  onUpdateProfile={handleUpdateProfile}
                  onFollow={handleFollow}
                  onReport={(postId) => setShowReportModal({ show: true, postId })}
                  isFollowing={user ? (selectedUser || user!).followers?.includes(user.id) || false : false}
                  allPosts={posts}
                  setNotification={setNotification}
                  onHashtagClick={handleHashtagClick}
                  showEditModal={showEditModal}
                  setShowEditModal={setShowEditModal}
                  language={language}
                />
              )}
              {view === 'notification' && (
                <NotificationsView notifications={notifications} language={language} />
              )}
              {view === 'friends' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold px-4">{t.friends}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                    {suggestedUsers.map(sUser => (
                      <div key={sUser.id} className="card p-4 flex items-center gap-4">
                        <img 
                          src={sUser.profilePictureUrl || sUser.avatar} 
                          alt={sUser.username} 
                          className="w-12 h-12 rounded-full object-cover cursor-pointer"
                          onClick={() => handleUserClick(sUser.id)}
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold cursor-pointer" onClick={() => handleUserClick(sUser.id)}>{sUser.displayName || sUser.username}</h4>
                          <p className="text-xs text-secondary">@{sUser.username}</p>
                        </div>
                        <button 
                          onClick={() => handleFollow(sUser.id)}
                          className="px-4 py-1.5 bg-accent text-white rounded-full text-xs font-bold hover:bg-accent/90"
                        >
                          {t.follow}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {view === 'events' && (
                <EventsView user={user} setNotification={setNotification} language={language} />
              )}
            </div>

            {/* Right Sidebar */}
            <Sidebar 
              suggestedUsers={suggestedUsers}
              onUserClick={handleUserClick}
              language={language}
            />
          </motion.main>
        )}
      </AnimatePresence>

      <CreatePostModal 
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        content={newPostContent}
        onContentChange={setNewPostContent}
        image={newPostImage}
        onImageChange={setNewPostImage}
        category={newPostCategory}
        onCategoryChange={setNewPostCategory}
        user={user}
        setNotification={setNotification}
        language={language}
        onSubmit={async (location) => {
          await handleCreatePost(newPostContent, newPostImage, newPostCategory, undefined, location);
          setNewPostContent('');
          setNewPostImage('');
          setNewPostCategory('Gili Vibes');
          setShowCreateModal(false);
          setNotification({ message: language === 'id' ? 'Postingan berhasil dibuat!' : 'Post created successfully!', type: 'success' });
        }}
      />

      <AnimatePresence>
        {showReportModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal({ show: false, postId: null })}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="card w-full max-w-sm rounded-3xl relative z-10 p-6"
            >
              <h3 className="text-lg font-bold text-primary mb-4">{t.reportPost}</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={language === 'id' ? 'Mengapa Anda melaporkan postingan ini?' : 'Why are you reporting this post?'}
                className="w-full bg-background border border-border rounded-xl p-3 mb-4 text-sm focus:outline-none focus:border-accent min-h-[100px] resize-none"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowReportModal({ show: false, postId: null })}
                  className="px-4 py-2 text-sm font-semibold text-secondary hover:text-primary"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={() => showReportModal.postId && handleReportPost(showReportModal.postId, reportReason)}
                  disabled={!reportReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  {language === 'id' ? 'Laporkan' : 'Report'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {(view === 'admin' && (user?.role === 'Admin' || user?.role === 'Moderator')) && (
          <motion.main
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto px-4 pt-24"
          >
            <AdminSettings currentUser={user} />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-[100] ${
            notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
      {user && view !== 'landing' && view !== 'login' && view !== 'signup' && (
        <BottomNav 
          activeTab={view} 
          onNavigate={(v) => {
            if (v === 'profile') setSelectedUser(user);
            setView(v);
          }} 
          notifications={notifications} 
        />
      )}
    </div>
  );
}
