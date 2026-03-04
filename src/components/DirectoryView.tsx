import React from 'react';
import { Stethoscope, CreditCard, ShieldCheck, Ship } from 'lucide-react';
import { IslandSpot } from '../types';

interface DirectoryViewProps {
  spots: IslandSpot[];
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ spots }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {spots.map(spot => (
      <div key={spot.id} className="glass rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            {spot.category === 'Medical' ? <Stethoscope className="text-red-400" /> :
             spot.category === 'Finance' ? <CreditCard className="text-green-400" /> :
             spot.category === 'Safety' ? <ShieldCheck className="text-blue-400" /> :
             <Ship className="text-cyan-water" />}
          </div>
          <div>
            <h4 className="font-bold text-sm">{spot.name}</h4>
            <p className="text-xs text-secondary-text">{spot.location}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${spot.status === 'Open' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {spot.status.toUpperCase()}
        </span>
      </div>
    ))}
  </div>
);

export default DirectoryView;
