import React from 'react';

interface PostImageProps {
  image?: string;
  isEditing: boolean;
  setPreviewImage: (image: string | null) => void;
}

const PostImage: React.FC<PostImageProps> = ({ image, isEditing, setPreviewImage }) => {
  if (!image || isEditing) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border mb-4 group aspect-video md:aspect-auto md:max-h-[400px]">
      <img 
        src={image} 
        alt="Post" 
        className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500" 
        referrerPolicy="no-referrer" 
        loading="lazy"
        onClick={() => setPreviewImage(image)}
      />
    </div>
  );
};

export default PostImage;
