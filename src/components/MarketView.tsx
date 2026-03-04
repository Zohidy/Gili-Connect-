import React from 'react';
import { MarketplaceItem } from '../types';

interface MarketViewProps {
  items: MarketplaceItem[];
}

const MarketView: React.FC<MarketViewProps> = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {items.map(item => (
      <div key={item.id} className="glass rounded-2xl overflow-hidden group cursor-pointer">
        <div className="relative h-40">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
          <span className={`absolute top-2 left-2 px-2 py-1 rounded text-[8px] font-bold ${
            item.type === 'Selling' ? 'bg-green-500 text-white' :
            item.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {item.type.toUpperCase()}
          </span>
        </div>
        <div className="p-3">
          <h4 className="font-bold text-xs mb-1 truncate">{item.title}</h4>
          <p className="text-cyan-water text-xs font-bold">{item.price}</p>
        </div>
      </div>
    ))}
  </div>
);

export default MarketView;
