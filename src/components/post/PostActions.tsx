import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, Flag } from 'lucide-react';
import { Post } from '../../types';

interface PostActionsProps {
  handleLike: (e: React.MouseEvent) => void;
  isLiking: boolean;
  optimisticLiked: boolean;
  optimisticLikes: number;
  showReplies: boolean;
  setShowReplies: (show: boolean) => void;
  post: Post;
  onReport?: (postId: string) => void;
  handleShare: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  handleLike,
  isLiking,
  optimisticLiked,
  optimisticLikes,
  showReplies,
  setShowReplies,
  post,
  onReport,
  handleShare
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
            optimisticLiked 
              ? 'text-red-500 bg-red-500/10' 
              : 'text-secondary hover:text-red-500 hover:bg-red-500/5'
          }`}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={optimisticLiked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-[18px] h-[18px] ${optimisticLiked ? 'fill-current' : ''}`} />
          </motion.div>
          <span className={`text-xs font-bold ${optimisticLiked ? 'text-red-500' : ''}`}>{optimisticLikes}</span>
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
  );
};

export default PostActions;
