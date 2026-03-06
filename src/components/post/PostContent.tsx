import React from 'react';

interface PostContentProps {
  isEditing: boolean;
  editContent: string;
  setEditContent: (content: string) => void;
  content: string;
  isLongText: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  handleUpdate: () => void;
  setIsEditing: (isEditing: boolean) => void;
  formatContent: (text: string) => React.ReactNode;
}

const PostContent: React.FC<PostContentProps> = ({
  isEditing,
  editContent,
  setEditContent,
  content,
  isLongText,
  isExpanded,
  setIsExpanded,
  handleUpdate,
  setIsEditing,
  formatContent
}) => {
  if (isEditing) {
    return (
      <div className="mb-4">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-accent min-h-[120px] resize-none text-primary"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-3">
          <button 
            onClick={() => {
              setIsEditing(false);
              setEditContent(content);
            }}
            className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="btn-primary px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <p className="text-[15px] leading-relaxed text-primary/90 whitespace-pre-wrap">
        {isLongText && !isExpanded 
          ? formatContent(content.slice(0, 300)) 
          : formatContent(content)}
        {isLongText && !isExpanded && '...'}
      </p>
      {isLongText && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent text-xs font-bold mt-2 hover:underline"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default PostContent;
