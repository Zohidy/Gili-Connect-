import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, MapPin, AlignLeft, Upload, Loader2 } from 'lucide-react';
import { User } from '../types';
import { uploadFile } from '../services/storageService';

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  user,
  onUpdate
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB.');
      return;
    }

    try {
      if (type === 'cover') setUploadingCover(true);
      else setUploadingAvatar(true);

      const url = await uploadFile(file);
      
      if (type === 'cover') setCoverImage(url);
      else setAvatar(url);
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      if (type === 'cover') setUploadingCover(false);
      else setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate({
        name,
        bio,
        location,
        avatar,
        coverImage
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
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
            className="absolute inset-0 bg-ocean/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass w-full max-w-lg rounded-3xl relative z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-sand-border">
              <h3 className="text-xl font-bold">Edit Profile</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Cover Image</label>
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="relative h-32 bg-white/5 rounded-2xl overflow-hidden border border-sand-border group cursor-pointer"
                >
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text">
                      <Camera className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {uploadingCover ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-white" />
                        <span className="text-[10px] font-bold text-white uppercase">Upload Cover</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file"
                    ref={coverInputRef}
                    onChange={(e) => handleFileChange(e, 'cover')}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="flex justify-center -mt-12 relative z-20">
                <div 
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative group cursor-pointer"
                >
                  <div className="relative">
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full border-4 border-ocean object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input 
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => handleFileChange(e, 'avatar')}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Display Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ocean border border-sand-border rounded-xl px-4 py-3 focus:border-cyan-water outline-none transition-colors"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Bio</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-secondary-text" />
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full h-24 bg-ocean border border-sand-border rounded-xl pl-12 pr-4 py-3 focus:border-cyan-water outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gili Trawangan, Indonesia"
                    className="w-full bg-ocean border border-sand-border rounded-xl pl-12 pr-4 py-3 focus:border-cyan-water outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-water text-ocean py-4 rounded-xl font-bold hover:bg-cyan-water/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
