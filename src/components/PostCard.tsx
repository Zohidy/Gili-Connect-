import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, Trash2, Edit2, Check, X, Flag, MapPin, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Post, User, PostCategory } from '../types';
import { Send } from 'lucide-react';
import RoleBadge from './RoleBadge';
import ConfirmationDialog from './ConfirmationDialog';
import { uploadFile } from '../services/storageService';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onLike?: (id: string) => void;
  onReply?: (content: string, image?: string, category?: PostCategory, parentId?: string) => Promise<void>;
  onReport?: (postId: string) => void;
  allPosts?: Post[];
  isReply?: boolean;
  onUserClick?: (userId: string) => void;
  onHashtagClick?: (tag: string) => void;
  setNotification?: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUser, 
  onDelete, 
  onUpdate, 
  onLike, 
  onReply,
  onReport,
  allPosts = [],
  isReply = false,
  onUserClick,
  onHashtagClick,
  setNotification
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [isLiking, setIsLiking] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImage, setReplyImage] = useState('');
  const [isUploadingReplyImage, setIsUploadingReplyImage] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const replyFileInputRef = React.useRef<HTMLInputElement>(null);
  
  const isOwner = currentUser?.id === post.userId;
  const isAdmin = currentUser?.role === 'Admin';
  const isModerator = currentUser?.role === 'Moderator';
  const hasLiked = currentUser && post.likedBy?.includes(currentUser.id);

  const replies = allPosts.filter(p => p.parentId === post.id);
  const TEXT_LIMIT = 300;
  const content = post.content || '';
  const isLongText = content.length > TEXT_LIMIT;

  const formatContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/((?:#|@)\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span 
            key={i} 
            className="text-accent font-bold hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onHashtagClick?.(part);
            }}
          >
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span 
            key={i} 
            className="text-accent font-bold hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleUpdate = () => {
    if (editContent.trim() && onUpdate) {
      onUpdate(post.id, editContent);
      setIsEditing(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      if (setNotification) {
        setNotification({ message: 'Please login to like posts', type: 'error' });
      } else {
        alert('Please login to like posts');
      }
      return;
    }
    
    if (onLike && !isLiking) {
      setIsLiking(true);
      try {
        await onLike(post.id);
      } catch (error) {
        console.error("Like failed:", error);
      } finally {
        setIsLiking(false);
      }
    }
  };

  const handleReplyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingReplyImage(true);
      const url = await uploadFile(file);
      setReplyImage(url);
    } catch (error) {
      console.error("Error uploading reply image:", error);
    } finally {
      setIsUploadingReplyImage(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !onReply || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onReply(replyContent, replyImage, post.category, post.id);
      setReplyContent('');
      setReplyImage('');
      setShowReplies(true);
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    if (setNotification) {
      setNotification({ message: 'Link copied to clipboard!', type: 'success' });
    } else {
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className={`card overflow-hidden mb-4 ${isReply ? 'ml-8 border-l-2 border-accent/20' : ''}`}
    >
      {previewImage && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out" 
            onClick={() => setPreviewImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
              referrerPolicy="no-referrer" 
            />
          </motion.div>
        </AnimatePresence>
      )}

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img 
                src={post.userAvatar} 
                alt={post.userName} 
                className="w-11 h-11 rounded-full border border-border cursor-pointer object-cover ring-2 ring-transparent group-hover:ring-accent/30 transition-all" 
                referrerPolicy="no-referrer" 
                onClick={() => onUserClick?.(post.userId)}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 
                  className="text-sm font-bold text-primary cursor-pointer hover:text-accent transition-colors"
                  onClick={() => onUserClick?.(post.userId)}
                >
                  {post.userName}
                </h4>
                {post.userRole && <RoleBadge role={post.userRole} />}
                {post.userRole && post.location && <span className="text-secondary opacity-30 text-[10px]">•</span>}
                {post.location && (
                  <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-secondary font-medium">{post.timestamp}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${
              post.category === 'Party' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
              post.category === 'Fastboat' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
              post.category === 'Safety' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
              post.category === 'Food' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
              post.category === 'News' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
              'bg-slate-500/10 text-slate-500 border border-slate-500/20'
            }`}>
              {post.category}
            </span>
            {(isOwner || isAdmin || isModerator) && !isEditing && (
              <div className="flex items-center gap-1">
                {onUpdate && isOwner && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-secondary hover:text-accent transition-colors rounded-full hover:bg-accent/5"
                    title="Edit post"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (isOwner || isAdmin || isModerator) && (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/5 transition-colors rounded-full"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
              className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-accent min-h-[120px] resize-none text-primary"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-3">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(content);
                }}
                className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                className="btn-primary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-[15px] leading-relaxed text-primary/90 whitespace-pre-wrap">
              {isLongText && !isExpanded 
                ? formatContent(content.slice(0, TEXT_LIMIT)) 
                : formatContent(content)}
              {isLongText && !isExpanded && '...'}
            </p>
            {isLongText && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-accent text-xs font-bold mt-2 hover:underline"
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        )}
        
        {post.image && !isEditing && (
          <div className="relative rounded-2xl overflow-hidden border border-border mb-4 group aspect-video md:aspect-auto md:max-h-[400px]">
            <img 
              src={post.image} 
              alt="Post" 
              className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500" 
              referrerPolicy="no-referrer" 
              onClick={() => setPreviewImage(post.image)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                hasLiked 
                  ? 'text-red-500 bg-red-500/10' 
                  : 'text-secondary hover:text-red-500 hover:bg-red-500/5'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={hasLiked ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-[18px] h-[18px] ${hasLiked ? 'fill-current' : ''}`} />
              </motion.div>
              <span className={`text-xs font-bold ${hasLiked ? 'text-red-500' : ''}`}>{post.likes}</span>
            </button>
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                showReplies 
                  ? 'text-accent bg-accent/5' 
                  : 'text-secondary hover:text-accent hover:bg-accent/5'
              }`}
            >
              <MessageCircle className={`w-[18px] h-[18px] ${showReplies ? 'fill-current' : ''}`} />
              <span className="text-xs font-bold">{post.replyCount || 0}</span>
            </button>
            <button 
              onClick={() => onReport?.(post.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-secondary hover:text-red-500 hover:bg-red-500/5 transition-all"
              title="Report post"
            >
              <Flag className="w-[18px] h-[18px]" />
            </button>
          </div>
          <button 
            onClick={handleShare}
            className="p-2 text-secondary hover:text-accent hover:bg-accent/5 rounded-full transition-all"
            title="Copy link"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface/30 border-t border-border"
          >
            <div className="p-4 md:p-5 space-y-4">
              {currentUser && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-border" referrerPolicy="no-referrer" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-background border border-border rounded-2xl px-5 py-2 text-sm focus:border-accent outline-none transition-colors"
                          onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                        />
                        <button 
                          onClick={() => replyFileInputRef.current?.click()}
                          className={`p-2.5 rounded-xl border border-border hover:bg-border/50 transition-colors ${replyImage ? 'text-accent border-accent/30 bg-accent/5' : 'text-secondary'}`}
                          title="Add image to reply"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleReply}
                          disabled={!replyContent.trim() || isSubmittingReply || isUploadingReplyImage}
                          className="p-2.5 btn-primary rounded-xl disabled:opacity-50"
                        >
                          {isSubmittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {replyImage && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group">
                          <img src={replyImage} alt="Reply preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => setReplyImage('')}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {isUploadingReplyImage && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                          <Loader2 className="w-3 h-3 animate-spin text-accent" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                  <input 
                    type="file"
                    ref={replyFileInputRef}
                    onChange={handleReplyImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                {replies.length > 0 ? (
                  replies.map(reply => (
                    <PostCard 
                      key={reply.id}
                      post={reply}
                      currentUser={currentUser}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                      onLike={onLike}
                      onReply={onReply}
                      onReport={onReport}
                      allPosts={allPosts}
                      isReply={true}
                      onUserClick={onUserClick}
                      onHashtagClick={onHashtagClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-secondary font-medium italic">
                    No replies yet.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmationDialog
        show={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={() => {
          onDelete?.(post.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default PostCard;
