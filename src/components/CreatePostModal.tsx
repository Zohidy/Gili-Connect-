import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { PostCategory } from '../types';
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
  onSubmit: () => Promise<void>;
  userId: string;
}

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
  userId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadFile(file);
      onImageChange(url);
    } catch (error) {
      console.error("Error uploading post image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
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
            className="absolute inset-0 bg-ocean/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass w-full max-w-lg p-6 rounded-3xl relative z-10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create Post</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <textarea 
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="What's happening on Gili T?"
              className="w-full h-32 bg-ocean border border-sand-border rounded-2xl p-4 outline-none focus:border-cyan-water transition-colors resize-none mb-4"
            />

            <div className="mb-4">
              <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Image</label>
              
              {image ? (
                <div className="relative rounded-2xl overflow-hidden border border-sand-border group h-48">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => onImageChange('')}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full h-32 border-2 border-dashed border-sand-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-cyan-water transition-colors text-secondary-text disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 opacity-20" />
                      <span className="text-xs font-bold uppercase">Click to upload photo</span>
                    </>
                  )}
                </button>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {(['News', 'Party', 'Fastboat', 'Safety', 'Food', 'Marketplace'] as PostCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${category === cat ? 'bg-cyan-water/10 border-cyan-water text-cyan-water' : 'border-sand-border text-secondary-text hover:border-white/20'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={onSubmit}
              disabled={isUploading || !content.trim()}
              className="w-full bg-cyan-water text-ocean py-4 rounded-xl font-bold hover:bg-cyan-water/90 transition-colors disabled:opacity-50"
            >
              Post Update
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
