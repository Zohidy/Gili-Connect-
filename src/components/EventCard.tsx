import React from 'react';
import { Event, RSVP } from '../types';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  rsvp?: RSVP;
  onRSVP: (eventId: string, status: 'going' | 'interested') => void;
  onAddToCalendar: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, rsvp, onRSVP, onAddToCalendar }) => {
  return (
    <div className="card overflow-hidden mb-4">
      {event.imageUrl && (
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
        <p className="text-secondary text-sm mb-4">{event.description}</p>
        <div className="flex items-center gap-4 text-xs text-secondary font-medium mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-accent" />
            {event.date.toDate().toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-accent" />
            {event.location}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onRSVP(event.id, 'going')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${rsvp?.status === 'going' ? 'btn-primary' : 'btn-secondary'}`}
          >
            {rsvp?.status === 'going' ? 'Going' : 'RSVP Going'}
          </button>
          <button 
            onClick={() => onAddToCalendar(event)}
            className="px-4 py-2 rounded-xl text-xs font-bold btn-secondary"
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
