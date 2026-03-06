import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Loader2, Trash2, MapPin, Smile, Hash, Send } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { PostCategory, User } from '../types';
import { uploadFile } from '../services/storageService';

interface CreatePostModalProps {
  show: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (content: string) => void;
  image: string;
  onImageChange: (image: string) => void;
  category: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
  onSubmit: (location?: string) => Promise<void>;
  user: User | null;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

const CATEGORIES: { id: PostCategory; label: string; icon: string }[] = [
  { id: 'News', label: 'News', icon: '📢' },
  { id: 'Party', label: 'Party', icon: '🎉' },
  { id: 'Fastboat', label: 'Fastboat', icon: '🚤' },
  { id: 'Safety', label: 'Safety', icon: '🛡️' },
  { id: 'Food', label: 'Food', icon: '🍱' },
  { id: 'Marketplace', label: 'Market', icon: '🛒' },
  { id: 'Lost and Found', label: 'Lost & Found', icon: '🔍' },
];

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  show,
  onClose,
  content,
  onContentChange,
  image,
  onImageChange,
  category,
  onCategoryChange,
  onSubmit,
  user,
  setNotification
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState('');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 280;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ message: 'Please upload an image file.', type: 'error' });
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      onImageChange(url);
      setNotification({ message: 'Successfully uploaded image.', type: 'success' });
    } catch (error) {
      console.error("Error uploading post image:", error);
      setNotification({ message: error instanceof Error ? error.message : 'Failed to upload image.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handlePostSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(location);
      setLocation('');
      setShowLocationInput(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="card w-full max-w-xl rounded-3xl relative z-10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-border/50 rounded-full text-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-primary">Create New Post</h3>
              <div className="w-9" /> {/* Spacer */}
            </div>
            
            <div 
              className={`p-5 transition-colors ${isDragging ? 'bg-accent/5' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {/* User Info & Textarea */}
              <div className="flex gap-4 mb-4">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-12 h-12 rounded-full border border-border object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <textarea 
                    value={content}
                    onChange={(e) => onContentChange(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="What's happening on Gili T?"
                    className="w-full h-32 bg-transparent text-lg text-primary placeholder:text-secondary/50 outline-none resize-none pt-2"
                    autoFocus
                  />
                </div>
              </div>

              {/* Drag & Drop Indicator */}
              {isDragging && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="bg-accent text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 animate-bounce">
                    <ImageIcon className="w-5 h-5" />
                    Drop image to upload
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {image && (
                <div className="relative rounded-2xl overflow-hidden border border-border group mb-4 max-h-72">
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                    onClick={() => setShowFullPreview(true)}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageChange('');
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Full Screen Preview Overlay */}
              <AnimatePresence>
                {showFullPreview && image && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                    onClick={() => setShowFullPreview(false)}
                  >
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[120]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFullPreview(false);
                      }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                    <motion.img 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={image} 
                      alt="Full Preview" 
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                      referrerPolicy="no-referrer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Loading */}
              {isUploading && (
                <div className="h-32 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 mb-4 bg-surface/50">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Uploading Image...</span>
                </div>
              )}

              {/* Location Input */}
              <AnimatePresence>
                {showLocationInput && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Where are you on Gili T?"
                        className="flex-1 bg-transparent text-sm text-primary outline-none"
                        autoFocus
                      />
                      <button onClick={() => { setLocation(''); setShowLocationInput(false); }} className="text-secondary hover:text-primary">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Select Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200 ${
                        category === cat.id 
                          ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105' 
                          : 'bg-surface border-border text-secondary hover:border-accent/50 hover:bg-border/30'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toolbar & Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || !!image}
                    className="p-2.5 text-accent hover:bg-accent/10 rounded-full transition-colors disabled:opacity-30"
                    title="Add Photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowLocationInput(!showLocationInput)}
                    className={`p-2.5 rounded-full transition-colors ${showLocationInput ? 'bg-accent/10 text-accent' : 'text-accent hover:bg-accent/10'}`} 
                    title="Add Location"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2.5 rounded-full transition-colors ${showEmojiPicker ? 'bg-accent/10 text-accent' : 'text-accent hover:bg-accent/10'}`} 
                      title="Add Emoji"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-4 z-50"
                        >
                          <div className="shadow-2xl rounded-2xl overflow-hidden border border-border">
                            <EmojiPicker 
                              onEmojiClick={(emojiData) => {
                                onContentChange(content + emojiData.emoji);
                                setShowEmojiPicker(false);
                              }}
                              theme={document.documentElement.classList.contains('dark') ? Theme.DARK : Theme.LIGHT}
                              width={320}
                              height={400}
                              lazyLoadEmojis={true}
                              skinTonesDisabled={true}
                              searchDisabled={false}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={2 * Math.PI * 10}
                        strokeDashoffset={2 * Math.PI * 10 * (1 - content.length / MAX_CHARS)}
                        className={`transition-all duration-300 ${
                          content.length >= MAX_CHARS ? 'text-red-500' : 
                          content.length >= MAX_CHARS * 0.8 ? 'text-orange-500' : 'text-accent'
                        }`}
                      />
                    </svg>
                    {content.length >= MAX_CHARS * 0.8 && (
                      <span className={`absolute text-[8px] font-bold ${content.length >= MAX_CHARS ? 'text-red-500' : 'text-secondary'}`}>
                        {MAX_CHARS - content.length}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={handlePostSubmit}
                    disabled={isUploading || isSubmitting || !content.trim()}
                    className="flex items-center gap-2 btn-primary px-6 py-2.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Post</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="hidden"
                accept="image/*"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
