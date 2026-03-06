import React from 'react';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import { Post, User } from '../../types';
import RoleBadge from '../RoleBadge';

interface PostHeaderProps {
  post: Post;
  isOwner: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isEditing: boolean;
  onUserClick?: (userId: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  isOwner,
  isAdmin,
  isModerator,
  isEditing,
  onUserClick,
  onUpdate,
  onDelete,
  setIsEditing,
  setShowDeleteConfirm
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="relative group">
          <img 
            src={post.userAvatar} 
            alt={post.userName} 
            className="w-11 h-11 rounded-full border border-border cursor-pointer object-cover ring-2 ring-transparent group-hover:ring-accent/30 transition-all" 
            referrerPolicy="no-referrer" 
            loading="lazy"
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
          post.category === 'Party' ? 'bg-accent/10 text-accent border border-accent/20' :
          post.category === 'Fastboat' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
          post.category === 'Safety' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
          post.category === 'Food' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
          post.category === 'News' ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' :
          'bg-secondary/10 text-secondary border border-secondary/20'
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
  );
};

export default PostHeader;
