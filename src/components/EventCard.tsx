import React from 'react';
import { Event, RSVP } from '../types';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: Event;
  rsvp?: RSVP;
  onRSVP: (eventId: string, status: 'going' | 'interested') => void;
  onAddToCalendar: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, rsvp, onRSVP, onAddToCalendar }) => {
  return (
    <div className="card overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            referrerPolicy="no-referrer" 
            loading="lazy" 
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
            {event.date.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">{event.title}</h3>
        <p className="text-secondary text-sm mb-4 leading-relaxed">{event.description}</p>
        
        <div className="flex items-center gap-6 text-xs text-secondary font-medium mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            {event.date.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            {event.location}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onRSVP(event.id, 'going')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              rsvp?.status === 'going' 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'bg-surface border border-border text-secondary hover:border-accent/50 hover:bg-border/30'
            }`}
          >
            {rsvp?.status === 'going' ? '✓ Going' : 'RSVP Going'}
          </button>
          <button 
            onClick={() => onAddToCalendar(event)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-surface border border-border text-secondary hover:border-accent/50 hover:bg-border/30 transition-all"
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
