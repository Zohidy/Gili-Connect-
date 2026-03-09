import React, { useState } from 'react';
import { Search, Plus, Tag, CheckCircle } from 'lucide-react';
import { Post } from '../types';

const MOCK_LOST_FOUND: Post[] = [
  { id: '1', userId: '1', content: 'Found a black wallet near the beach.', createdAt: new Date().toISOString(), category: 'Lost and Found', userName: 'John Doe' },
  { id: '2', userId: '2', content: 'Lost my sunglasses at the party last night.', createdAt: new Date().toISOString(), category: 'Lost and Found', userName: 'Jane Smith' },
];

const LostFoundView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_LOST_FOUND);
  const [reunitedIds, setReunitedIds] = useState<Set<string>>(new Set());

  const toggleReunited = (id: string) => {
    setReunitedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Lost & Found</h2>
        <button className="bg-accent text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold hover:bg-accent/90 transition-all">
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>
      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className={`card p-5 rounded-2xl border border-border ${reunitedIds.has(post.id) ? 'opacity-60 bg-surface/30' : 'bg-surface'}`}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-primary font-bold text-lg">{post.userName}</p>
              {reunitedIds.has(post.id) && <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold"><CheckCircle className="w-4 h-4" /> Reunited</span>}
            </div>
            <p className="text-secondary text-base mb-4">{post.content}</p>
            <div className="mt-2 flex justify-end">
                <button 
                  onClick={() => toggleReunited(post.id)}
                  className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${reunitedIds.has(post.id) ? 'text-secondary bg-border' : 'text-accent bg-accent/10 hover:bg-accent/20'}`}
                >
                  {reunitedIds.has(post.id) ? 'Undo Reunited' : 'Mark as Reunited'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostFoundView;
