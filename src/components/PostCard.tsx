import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Post, User, PostCategory } from '../types';
import { uploadFile } from '../services/storageService';
import PostHeader from './post/PostHeader';
import PostContent from './post/PostContent';
import PostImage from './post/PostImage';
import PostActions from './post/PostActions';
import ReplySection from './post/ReplySection';
import ConfirmationDialog from './ConfirmationDialog';

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

  const [optimisticLiked, setOptimisticLiked] = useState(hasLiked);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likes || 0);

  React.useEffect(() => {
    setOptimisticLiked(hasLiked);
    setOptimisticLikes(post.likes || 0);
  }, [hasLiked, post.likes]);

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
      const previousLiked = optimisticLiked;
      const previousLikes = optimisticLikes;
      setOptimisticLiked(!previousLiked);
      setOptimisticLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);

      try {
        await onLike(post.id);
      } catch (error) {
        console.error("Like failed:", error);
        setOptimisticLiked(previousLiked);
        setOptimisticLikes(previousLikes);
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
        <PostHeader 
          post={post}
          isOwner={isOwner}
          isAdmin={isAdmin}
          isModerator={isModerator}
          isEditing={isEditing}
          onUserClick={onUserClick}
          onUpdate={onUpdate}
          onDelete={onDelete}
          setIsEditing={setIsEditing}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
        
        <PostContent 
          isEditing={isEditing}
          editContent={editContent}
          setEditContent={setEditContent}
          content={content}
          isLongText={isLongText}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          handleUpdate={handleUpdate}
          setIsEditing={setIsEditing}
          formatContent={formatContent}
        />
        
        <PostImage 
          image={post.image}
          isEditing={isEditing}
          setPreviewImage={setPreviewImage}
        />
        
        <PostActions 
          handleLike={handleLike}
          isLiking={isLiking}
          optimisticLiked={optimisticLiked}
          optimisticLikes={optimisticLikes}
          showReplies={showReplies}
          setShowReplies={setShowReplies}
          post={post}
          onReport={onReport}
          handleShare={handleShare}
        />
      </div>

      <ReplySection 
        showReplies={showReplies}
        currentUser={currentUser}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        handleReply={handleReply}
        isSubmittingReply={isSubmittingReply}
        isUploadingReplyImage={isUploadingReplyImage}
        replyImage={replyImage}
        setReplyImage={setReplyImage}
        replyFileInputRef={replyFileInputRef}
        handleReplyImageUpload={handleReplyImageUpload}
        replies={replies}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onLike={onLike}
        onReply={onReply}
        onReport={onReport}
        allPosts={allPosts}
        onUserClick={onUserClick}
        onHashtagClick={onHashtagClick}
      />

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
