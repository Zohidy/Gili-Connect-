import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Trash2, Edit2, Check, X } from 'lucide-react';
import { Post, User, PostCategory } from '../types';
import { Send } from 'lucide-react';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onLike?: (id: string) => void;
  onReply?: (content: string, image?: string, category?: PostCategory, parentId?: string) => Promise<void>;
  allPosts?: Post[];
  isReply?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser, 
  onDelete, 
  onUpdate, 
  onLike, 
  onReply,
  allPosts = [],
  isReply = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isLiking, setIsLiking] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const isOwner = currentUser?.id === post.userId;
  const isAdmin = currentUser?.role === 'Admin';
  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  const replies = allPosts.filter(p => p.parentId === post.id);

  const handleUpdate = () => {
    if (editContent.trim() && onUpdate) {
      onUpdate(post.id, editContent);
      setIsEditing(false);
    }
  };

  const handleLike = async () => {
    if (onLike && !isLiking) {
      setIsLiking(true);
      await onLike(post.id);
      setIsLiking(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !onReply || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onReply(replyContent, undefined, post.category, post.id);
      setReplyContent('');
      setShowReplies(true);
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-4 mb-4 ${isReply ? 'ml-4 border-l-2 border-cyan-water/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full border border-sand-border" referrerPolicy="no-referrer" />
          <div>
            <h4 className="text-sm font-bold">{post.userName}</h4>
            <p className="text-[10px] text-secondary-text">{post.timestamp}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            post.category === 'Party' ? 'bg-purple-500/10 text-purple-400' :
            post.category === 'Fastboat' ? 'bg-cyan-water/10 text-cyan-water' :
            post.category === 'Safety' ? 'bg-red-500/10 text-red-400' :
            'bg-sunset/10 text-sunset'
          }`}>
            #{post.category}
          </span>
          {(isOwner || isAdmin) && !isEditing && (
            <div className="flex items-center gap-1">
              {onUpdate && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-secondary-text hover:text-cyan-water transition-colors rounded-lg hover:bg-cyan-water/10"
                  title="Edit post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <div className="relative">
                  <button 
                    onClick={() => setIsConfirmingDelete(!isConfirmingDelete)}
                    className={`p-1.5 transition-colors rounded-lg ${isConfirmingDelete ? 'text-red-400 bg-red-400/10' : 'text-secondary-text hover:text-red-400 hover:bg-red-400/10'}`}
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {isConfirmingDelete && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 10 }}
                        className="absolute right-0 top-full mt-2 z-50 bg-ocean border border-red-400/30 rounded-xl p-2 shadow-xl flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="text-[10px] font-bold text-red-400 px-1">Delete?</span>
                        <button 
                          onClick={() => {
                            onDelete(post.id);
                            setIsConfirmingDelete(false);
                          }}
                          className="px-2 py-1 bg-red-400 text-white text-[10px] font-bold rounded-md hover:bg-red-500 transition-colors"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setIsConfirmingDelete(false)}
                          className="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded-md hover:bg-white/20 transition-colors"
                        >
                          No
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-water/50 min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-secondary-text hover:text-white transition-colors"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-water text-ocean rounded-lg text-xs font-bold hover:scale-[1.02] transition-transform"
            >
              <Check className="w-3 h-3" /> Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
      )}
      
      {post.image && !isEditing && (
        <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-xl mb-4 border border-sand-border" referrerPolicy="no-referrer" />
      )}
      
      <div className="flex items-center gap-6 pt-4 border-t border-sand-border">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 transition-colors ${hasLiked ? 'text-red-400' : 'text-secondary-text hover:text-red-400'}`}
        >
          <motion.div
            whileTap={{ scale: 1.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
          </motion.div>
          <span className="text-xs">{post.likes}</span>
        </button>
        <button 
          onClick={() => setShowReplies(!showReplies)}
          className={`flex items-center gap-2 transition-colors ${showReplies ? 'text-cyan-water' : 'text-secondary-text hover:text-cyan-water'}`}
        >
          <MessageCircle className={`w-4 h-4 ${showReplies ? 'fill-current' : ''}`} />
          <span className="text-xs">{post.replyCount || 0}</span>
        </button>
        <button className="flex items-center gap-2 text-secondary-text hover:text-sunset transition-colors ml-auto">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {currentUser && (
                <div className="flex gap-3 mb-4">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Post your reply"
                      className="flex-1 bg-ocean border border-sand-border rounded-full px-4 py-1.5 text-sm focus:border-cyan-water outline-none transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                    />
                    <button 
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isSubmittingReply}
                      className="p-2 bg-cyan-water text-ocean rounded-full disabled:opacity-50 hover:scale-105 transition-transform"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {replies.map(reply => (
                  <PostCard 
                    key={reply.id}
                    post={reply}
                    currentUser={currentUser}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onLike={onLike}
                    onReply={onReply}
                    allPosts={allPosts}
                    isReply={true}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;
