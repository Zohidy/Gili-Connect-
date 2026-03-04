/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User as UserIcon, 
  PlusSquare, 
  MapPin, 
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
  arrayRemove
} from 'firebase/firestore';
import { User, Post, IslandRole, PostCategory, IslandSpot, MarketplaceItem } from './types';

// Components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';
import DirectoryView from './components/DirectoryView';
import MarketView from './components/MarketView';
import CreatePostModal from './components/CreatePostModal';
import ProfileView from './components/ProfileView';

export default function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [spots, setSpots] = useState<IslandSpot[]>([]);
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('News');
  const [initializing, setInitializing] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        let currentUserData: User;
        
        if (userDoc.exists()) {
          currentUserData = userDoc.data() as User;
        } else {
          currentUserData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Island Explorer',
            email: firebaseUser.email || '',
            role: 'Tourist',
            avatar: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100`,
            badges: ['Newcomer'],
            joinedAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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

    return () => unsubscribe();
  }, []); // Empty dependency array to prevent multiple listeners

  // Posts Listener
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
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

        return {
          id: doc.id,
          ...data,
          timestamp
        } as Post;
      });
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  // Spots Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'spots'), (snapshot) => {
      const fetchedSpots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IslandSpot));
      setSpots(fetchedSpots);
    });
    return () => unsubscribe();
  }, []);

  // Market Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'market'), (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketplaceItem));
      setMarketItems(fetchedItems);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (email: string, pass: string, name?: string, role?: IslandRole) => {
    if (name) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser: User = {
        id: userCredential.user.uid,
        name: name,
        email: email,
        role: email === 'zohidi269@gmail.com' ? 'Admin' : (role || 'Tourist'),
        avatar: `https://picsum.photos/seed/${userCredential.user.uid}/100`,
        badges: ['Newcomer'],
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      setUser(newUser);
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
    }
    setView('feed');
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

  const handleCreatePost = async (content: string, image?: string, category?: PostCategory, parentId?: string) => {
    if (!content.trim() || !user) return;
    
    try {
      const postData = {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        category: category || 'News',
        content: content,
        image: image?.trim() || null,
        likes: 0,
        likedBy: [],
        replyCount: 0,
        parentId: parentId || null,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'posts'), postData);
      
      if (parentId) {
        await updateDoc(doc(db, 'posts', parentId), {
          replyCount: increment(1)
        });
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
        const postData = postSnap.data() as Post;
        if (postData.parentId) {
          await updateDoc(doc(db, 'posts', postData.parentId), {
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
        updatedAt: serverTimestamp()
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

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) return;
      
      const postData = postSnap.data() as Post;
      const likedBy = postData.likedBy || [];
      const hasLiked = likedBy.includes(user.id);

      await updateDoc(postRef, {
        likes: increment(hasLiked ? -1 : 1),
        likedBy: hasLiked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-ocean flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-water/20 border-t-cyan-water rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setView} />
      
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingPage key="landing" onStart={() => setView(user ? 'feed' : 'login')} />
        )}
        
        {(view === 'login' || view === 'signup') && (
          <AuthPage key="auth" mode={view as 'login' | 'signup'} onAuth={handleAuth} onGoogleAuth={handleGoogleAuth} />
        )}
        
        {(view === 'feed' || view === 'directory' || view === 'market' || view === 'profile') && (
          <motion.main 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 pt-24 flex gap-8"
          >
            {/* Left Sidebar / Nav */}
            <div className="hidden md:flex flex-col gap-2 w-20 lg:w-64">
              {[
                { id: 'feed', icon: Home, label: 'Feed' },
                { id: 'directory', icon: MapPin, label: 'Directory' },
                { id: 'market', icon: ShoppingBag, label: 'Market' },
                { id: 'profile', icon: UserIcon, label: 'Profile' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${view === item.id ? 'bg-cyan-water/10 text-cyan-water' : 'hover:bg-white/5 text-secondary-text'}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="hidden lg:block font-bold">{item.label}</span>
                </button>
              ))}
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 flex items-center justify-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-cyan-water to-blue-600 text-white shadow-lg shadow-cyan-water/20 hover:scale-[1.02] transition-transform"
              >
                <PlusSquare className="w-6 h-6" />
                <span className="hidden lg:block font-bold">Create Post</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold capitalize">{view}</h2>
                <div className="md:hidden flex gap-2">
                   <button onClick={() => setShowCreateModal(true)} className="p-2 bg-cyan-water text-ocean rounded-lg"><PlusSquare className="w-5 h-5" /></button>
                </div>
              </div>

              {view === 'feed' && (
                <div className="space-y-4">
                  {posts.filter(p => !p.parentId).length > 0 ? (
                    posts.filter(p => !p.parentId).map(post => (
                      <div key={post.id}>
                        <PostCard 
                          post={post} 
                          currentUser={user} 
                          onDelete={handleDeletePost} 
                          onUpdate={handleUpdatePost}
                          onLike={handleLikePost}
                          onReply={handleCreatePost}
                          allPosts={posts}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-secondary-text">
                      <p className="mb-4">No updates yet. Be the first to share!</p>
                    </div>
                  )}
                </div>
              )}

              {view === 'directory' && <DirectoryView spots={spots} />}
              {view === 'market' && <MarketView items={marketItems} />}
              {view === 'profile' && user && (
                <ProfileView 
                  user={user} 
                  posts={posts} 
                  currentUser={user}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                  onLike={handleLikePost}
                  onReply={handleCreatePost}
                  onUpdateProfile={handleUpdateProfile}
                  allPosts={posts}
                />
              )}
            </div>

            {/* Right Sidebar */}
            <Sidebar />
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
        userId={user?.id || ''}
        onSubmit={async () => {
          await handleCreatePost(newPostContent, newPostImage, newPostCategory);
          setNewPostContent('');
          setNewPostImage('');
          setShowCreateModal(false);
        }}
      />

      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-sand-border px-6 py-3 flex items-center justify-between z-50">
          {[
            { id: 'feed', icon: Home },
            { id: 'directory', icon: MapPin },
            { id: 'market', icon: ShoppingBag },
            { id: 'profile', icon: UserIcon }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`p-2 rounded-xl transition-all ${view === item.id ? 'text-cyan-water bg-cyan-water/10' : 'text-secondary-text'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
