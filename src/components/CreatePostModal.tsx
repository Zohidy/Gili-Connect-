import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Loader2, Trash2, MapPin, Smile, Hash, Send } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { PostCategory, User } from '../types';
import { uploadFile } from '../services/storageService';
import ImageCropper from './ImageCropper';

import { Language, translations } from '../translations';

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
  language: Language;
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
  user,
  setNotification,
  language
}) => {
  const t = translations[language] || translations['id'];
  const CATEGORIES: { id: PostCategory; label: string; icon: string }[] = [
    { id: 'News', label: language === 'id' ? 'Berita' : 'News', icon: '📢' },
    { id: 'Party', label: language === 'id' ? 'Pesta' : 'Party', icon: '🎉' },
    { id: 'Fastboat', label: 'Fastboat', icon: '🚤' },
    { id: 'Safety', label: language === 'id' ? 'Keamanan' : 'Safety', icon: '🛡️' },
    { id: 'Food', label: language === 'id' ? 'Makanan' : 'Food', icon: '🍱' },
    { id: 'Marketplace', label: language === 'id' ? 'Pasar' : 'Marketplace', icon: '🛒' },
    { id: 'Lost and Found', label: language === 'id' ? 'Hilang & Temu' : 'Lost & Found', icon: '🔍' },
  ];

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [location, setLocation] = useState('');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHARS = 280;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setNotification({ message: language === 'id' ? 'Silakan unggah file gambar.' : 'Please upload an image file.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: string) => {
    setImageToCrop(null);
    try {
      setIsUploading(true);
      // Convert base64 to blob for upload
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'post.jpg', { type: 'image/jpeg' });
      const url = await uploadFile(file);
      onImageChange(url);
      setNotification({ message: language === 'id' ? 'Gambar berhasil diunggah.' : 'Image uploaded successfully.', type: 'success' });
    } catch (error) {
      console.error("Error uploading post image:", error);
      setNotification({ message: error instanceof Error ? error.message : (language === 'id' ? 'Gagal mengunggah gambar.' : 'Failed to upload image.'), type: 'error' });
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
        <div className="fixed inset-0 z-[100] flex md:items-center justify-center md:p-4">
          {imageToCrop && (
            <ImageCropper
              image={imageToCrop}
              onCropComplete={handleCropComplete}
              onCancel={() => setImageToCrop(null)}
            />
          )}
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
            className="neo-card w-full max-w-xl relative z-10 overflow-hidden shadow-2xl h-full md:h-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-border/50 rounded-full text-secondary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold text-primary">{t.createPost}</h3>
              <button 
                onClick={handlePostSubmit}
                disabled={isUploading || isSubmitting || !content.trim()}
                className="btn-primary px-6 py-2 rounded-full font-bold disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t.send}
              </button>
            </div>
            
            <div 
              className={`flex-1 overflow-y-auto p-5 transition-colors ${isDragging ? 'bg-accent/5' : ''}`}
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
                    placeholder={t.whatHappening}
                    className="w-full h-40 bg-transparent text-lg text-primary placeholder:text-secondary/50 outline-none resize-none pt-2"
                    autoFocus
                  />
                </div>
              </div>

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
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Category Selection */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">{t.selectCategory}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all duration-200 ${
                        category === cat.id 
                          ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20' 
                          : 'bg-surface border-border text-secondary hover:border-accent/50 hover:bg-border/30'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-t border-border flex items-center justify-between bg-surface">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !!image}
                  className="p-3 text-accent hover:bg-accent/10 rounded-full transition-colors disabled:opacity-30"
                  title={language === 'id' ? 'Tambah Foto' : 'Add Photo'}
                >
                  <ImageIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setShowLocationInput(!showLocationInput)}
                  className={`p-3 rounded-full transition-colors ${showLocationInput ? 'bg-accent/10 text-accent' : 'text-accent hover:bg-accent/10'}`} 
                  title={language === 'id' ? 'Tambah Lokasi' : 'Add Location'}
                >
                  <MapPin className="w-6 h-6" />
                </button>
              </div>
              <div className="text-xs font-bold text-secondary">
                {content.length} / {MAX_CHARS}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
