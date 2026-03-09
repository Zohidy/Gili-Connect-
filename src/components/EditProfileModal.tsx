import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, MapPin, AlignLeft, Upload, Loader2 } from 'lucide-react';
import { User } from '../types';
import { uploadFile } from '../services/storageService';
import ImageCropper from './ImageCropper';

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
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'avatar' | 'cover' | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setNotification({ message: 'Silakan unggah file gambar.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setCropType(type);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: string) => {
    setImageToCrop(null);
    const type = cropType!;
    setCropType(null);
    
    try {
      if (type === 'cover') setUploadingCover(true);
      else setUploadingAvatar(true);

      // Convert base64 to blob for upload
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], `${type}.jpg`, { type: 'image/jpeg' });
      const url = await uploadFile(file);
      
      if (type === 'cover') setCoverImage(url);
      else setAvatar(url);
      setNotification({ message: `Berhasil mengunggah ${type === 'cover' ? 'sampul' : 'avatar'}.`, type: 'success' });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setNotification({ message: error instanceof Error ? error.message : `Gagal mengunggah ${type === 'cover' ? 'sampul' : 'avatar'}.`, type: 'error' });
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
      setNotification({ message: 'Profil berhasil diperbarui!', type: 'success' });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setNotification({ message: 'Gagal memperbarui profil.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {imageToCrop && (
            <ImageCropper
              image={imageToCrop}
              onCropComplete={handleCropComplete}
              onCancel={() => { setImageToCrop(null); setCropType(null); }}
            />
          )}
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
              <h3 className="text-xl font-bold text-primary">Edit Profil</h3>
              <button onClick={onClose} className="p-2 hover:bg-border/50 rounded-lg text-secondary"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Foto Sampul</label>
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
                        <span className="text-[10px] font-semibold text-white uppercase">Unggah Sampul</span>
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
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Nama Tampilan</label>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-secondary uppercase">Bio</label>
                  <span className={`text-[10px] font-bold ${bio.length > 160 ? 'text-red-500' : 'text-secondary'}`}>
                    {bio.length}/160
                  </span>
                </div>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-secondary" />
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    placeholder="Ceritakan tentang diri Anda..."
                    className="w-full h-24 bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:border-accent outline-none transition-colors resize-none text-primary"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="misal: Gili Trawangan, Indonesia"
                    className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                  />
                </div>
              </div>

              {/* Gili Connection */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Hubungan dengan Gili Trawangan</label>
                <select 
                  value={giliConnection}
                  onChange={(e) => setGiliConnection(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-accent outline-none transition-colors text-primary"
                >
                  <option value="">Pilih hubungan Anda...</option>
                  <option value="Local Resident">Penduduk Lokal (Asli Gili)</option>
                  <option value="Expat Resident">Penduduk Ekspatriat (Tinggal di Gili)</option>
                  <option value="Frequent Visitor">Sering Berkunjung (Sering ke Gili)</option>
                  <option value="First Time Visitor">Pengunjung Pertama Kali (Pertama kali)</option>
                  <option value="Business Owner">Pemilik Bisnis (Pemilik Bisnis)</option>
                  <option value="Digital Nomad">Digital Nomad</option>
                  <option value="Diving Professional">Profesional Diving</option>
                  <option value="Boat Crew">Kru Kapal / Kapten</option>
                  <option value="Hospitality Staff">Staf Perhotelan</option>
                </select>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase mb-2">Minat (Pisahkan dengan koma)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Diving', 'Surfing', 'Yoga', 'Partying', 'Foodie', 'Sunset', 'Snorkeling', 'Digital Nomad'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const current = interests.split(',').map(i => i.trim()).filter(i => i !== '');
                        if (!current.includes(tag)) {
                          setInterests(interests ? `${interests}, ${tag}` : tag);
                        }
                      }}
                      className="px-2 py-1 bg-secondary/5 text-secondary text-[10px] font-bold rounded-lg border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.split(',').map((i, idx) => i.trim() && (
                    <span key={idx} className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-lg border border-accent/20 flex items-center gap-1">
                      #{i.trim()}
                      <button 
                        type="button"
                        onClick={() => {
                          const current = interests.split(',').map(item => item.trim()).filter(item => item !== '' && item !== i.trim());
                          setInterests(current.join(', '));
                        }}
                        className="hover:text-red-500"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                </div>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
