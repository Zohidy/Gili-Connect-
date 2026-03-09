import React, { useState, useEffect } from 'react';
import { CloudSun, Ship, RefreshCw } from 'lucide-react';

const TouristWidgets: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [weather] = useState({ temp: 29, condition: 'Cerah / Laut Tenang' });
  const [boatStatus, setBoatStatus] = useState({
    baliGili: 'TEPAT WAKTU',
    giliLombok: 'TEPAT WAKTU',
    ferry: 'TERLAMBAT'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Randomly toggle ferry status to simulate real-time changes
      setBoatStatus(prev => ({
        ...prev,
        ferry: Math.random() > 0.5 ? 'TERLAMBAT' : 'TEPAT WAKTU'
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Weather Widget */}
      <div className="card p-5 relative overflow-hidden bg-surface/50 backdrop-blur-sm border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Cuaca Pulau</h3>
          <CloudSun className="text-accent w-5 h-5" />
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-primary tracking-tighter">{weather.temp}°C</span>
          <span className="text-xs font-bold text-secondary mb-1 uppercase">{weather.condition}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-[10px] font-black text-secondary tracking-widest">
          <span>PASANG SURUT: RENDAH (14:00)</span>
          <span className="text-accent">INDEKS UV: TINGGI</span>
        </div>
      </div>

      {/* Fastboat Status */}
      <div className="card p-5 bg-surface/50 backdrop-blur-sm border-none shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs text-secondary uppercase tracking-widest">Status Fastboat</h3>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-secondary animate-spin-slow" />
            <Ship className="text-accent w-5 h-5" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Bali - Gili T</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase">{boatStatus.baliGili}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Gili T - Lombok</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase">{boatStatus.giliLombok}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary">Ferry Antar Pulau</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${boatStatus.ferry === 'TEPAT WAKTU' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {boatStatus.ferry}
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 text-[10px] font-black text-secondary tracking-widest text-right">
          TERAKHIR DIPERBARUI: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default TouristWidgets;
