import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search } from 'lucide-react';

// Fix for default Leaflet marker icons in React
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const locations = [
  { 
    id: 1, 
    name: 'Fastboat Dock', 
    position: [-8.3475, 116.0450], 
    type: 'transport',
    description: 'Main entry point for boats from Bali and Lombok.',
    image: 'https://picsum.photos/seed/dock/200/100',
    rating: 4.5
  },
  { 
    id: 2, 
    name: 'Sunset Point', 
    position: [-8.3450, 116.0350], 
    type: 'spot',
    description: 'Best place to watch the sunset on the island.',
    image: 'https://picsum.photos/seed/sunset/200/100',
    rating: 5.0
  },
  { 
    id: 3, 
    name: 'Community Center', 
    position: [-8.3460, 116.0400], 
    type: 'community',
    description: 'Hub for local events and activities.',
    image: 'https://picsum.photos/seed/community/200/100',
    rating: 4.2
  },
];

const GiliMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const userLocation: [number, number] = [-8.346, 116.04]; // Mock user location

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari tempat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-sm focus:border-accent outline-none"
        />
        <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-border">
        <MapContainer center={[-8.346, 116.04]} zoom={15} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredLocations.map(loc => (
            <Marker key={loc.id} position={loc.position as [number, number]} eventHandlers={{ click: () => setDestination(loc.position as [number, number]) }}>
              <Popup>
                <div className="space-y-2">
                  <img src={loc.image} alt={loc.name} className="w-full h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <div className="font-bold text-primary">{loc.name}</div>
                  <div className="text-secondary text-xs">{loc.description}</div>
                  <div className="text-accent text-sm font-semibold">Rating: {loc.rating} / 5.0</div>
                </div>
              </Popup>
            </Marker>
          ))}
          {destination && (
            <Polyline positions={[userLocation, destination]} color="blue" />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default GiliMap;
