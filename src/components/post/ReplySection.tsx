import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { Post, User, PostCategory } from '../../types';
import PostCard from '../PostCard';

interface ReplySectionProps {
  showReplies: boolean;
  currentUser: User | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  handleReply: () => void;
  isSubmittingReply: boolean;
  isUploadingReplyImage: boolean;
  replyImage: string;
  setReplyImage: (image: string) => void;
  replyFileInputRef: React.RefObject<HTMLInputElement>;
  handleReplyImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  replies: Post[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  onLike?: (id: string) => void;
  onReply?: (content: string, image?: string, category?: PostCategory, parentId?: string) => Promise<void>;
  onReport?: (postId: string) => void;
  allPosts: Post[];
  onUserClick?: (userId: string) => void;
  onHashtagClick?: (tag: string) => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({
  showReplies,
  currentUser,
  replyContent,
  setReplyContent,
  handleReply,
  isSubmittingReply,
  isUploadingReplyImage,
  replyImage,
  setReplyImage,
  replyFileInputRef,
  handleReplyImageUpload,
  replies,
  onDelete,
  onUpdate,
  onLike,
  onReply,
  onReport,
  allPosts,
  onUserClick,
  onHashtagClick
}) => {
  return (
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
                        placeholder="Tulis balasan..."
                        className="flex-1 bg-background border border-border rounded-2xl px-5 py-2 text-sm focus:border-accent outline-none transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                      />
                      <button 
                        onClick={() => replyFileInputRef.current?.click()}
                        className={`p-2.5 rounded-xl border border-border hover:bg-border/50 transition-colors ${replyImage ? 'text-accent border-accent/30 bg-accent/5' : 'text-secondary'}`}
                        title="Tambah gambar ke balasan"
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
                        Mengunggah...
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
                  Belum ada balasan.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReplySection;
