import React, { useState } from 'react';
import { Plus, CheckCircle, Tag } from 'lucide-react';
import { Post } from '../types';

const MOCK_MARKETPLACE: Post[] = [
  { id: '3', userId: '3', content: 'Selling my bicycle, 500k IDR.', createdAt: new Date().toISOString(), category: 'Marketplace', userName: 'Mike' },
  { id: '4', userId: '4', content: 'Looking for a surfboard.', createdAt: new Date().toISOString(), category: 'Marketplace', userName: 'Anna' },
];

const MarketplaceView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_MARKETPLACE);
  const [soldIds, setSoldIds] = useState<Set<string>>(new Set());

  const toggleSold = (id: string) => {
    setSoldIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Island Marketplace</h2>
        <button className="bg-accent text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold hover:bg-accent/90 transition-all">
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>
      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className={`card p-5 rounded-2xl border border-border ${soldIds.has(post.id) ? 'opacity-60 bg-surface/30' : 'bg-surface'}`}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-primary font-bold text-lg">{post.userName}</p>
              {soldIds.has(post.id) && <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold"><CheckCircle className="w-4 h-4" /> Sold</span>}
            </div>
            <p className="text-secondary text-base mb-4">{post.content}</p>
            <div className="mt-2 flex justify-end">
                <button 
                  onClick={() => toggleSold(post.id)}
                  className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${soldIds.has(post.id) ? 'text-secondary bg-border' : 'text-accent bg-accent/10 hover:bg-accent/20'}`}
                >
                  {soldIds.has(post.id) ? 'Undo Sold' : 'Mark as Sold'}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceView;
