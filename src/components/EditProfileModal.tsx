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
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  user,
  onUpdate,
  setNotification
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  const [giliConnection, setGiliConnection] = useState(user.giliConnection || '');
  const [interests, setInterests] = useState(user.interests?.join(', ') || '');
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
      setNotification({ message: 'Please upload an image file.', type: 'error' });
      return;
    }

    try {
      if (type === 'cover') setUploadingCover(true);
      else setUploadingAvatar(true);

      const url = await uploadFile(file);
      
      if (type === 'cover') setCoverImage(url);
      else setAvatar(url);
      setNotification({ message: `Successfully uploaded ${type}.`, type: 'success' });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setNotification({ message: error instanceof Error ? error.message : `Failed to upload ${type}.`, type: 'error' });
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
        coverImage,
        giliConnection,
        interests: interests.split(',').map(i => i.trim()).filter(i => i !== '')
      });
      setNotification({ message: 'Profile updated successfully!', type: 'success' });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({ message: 'Failed to update profile.', type: 'error' });
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
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="card w-full max-w-lg rounded-3xl relative z-10 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-primary">Edit Profile</h3>
              <button onClick={onClose} className="p-2 hover:bg-border/50 rounded-lg text-secondary"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Cover Image</label>
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className="relative h-32 bg-background rounded-2xl overflow-hidden border border-border group cursor-pointer"
                >
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary">
                      <Camera className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {uploadingCover ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-white" />
                        <span className="text-[10px] font-semibold text-white uppercase">Upload Cover</span>
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
                      className="w-24 h-24 rounded-full border-4 border-surface object-cover"
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
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Display Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Bio</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-secondary" />
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full h-24 bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:border-accent outline-none transition-colors resize-none text-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gili Trawangan, Indonesia"
                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                  />
                </div>
              </div>

              {/* Gili Connection */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Connection to Gili Trawangan</label>
                <select 
                  value={giliConnection}
                  onChange={(e) => setGiliConnection(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                >
                  <option value="">Select your connection...</option>
                  <option value="Local Resident">Local Resident</option>
                  <option value="Expat Resident">Expat Resident</option>
                  <option value="Frequent Visitor">Frequent Visitor</option>
                  <option value="First Time Visitor">First Time Visitor</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Digital Nomad">Digital Nomad</option>
                  <option value="Diving Professional">Diving Professional</option>
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Interests (comma separated)</label>
                <input 
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Diving, Partying, Yoga, Food"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 rounded-xl font-semibold"
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
