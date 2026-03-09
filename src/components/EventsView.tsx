import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, where } from 'firebase/firestore';
import { Event, RSVP, User } from '../types';
import EventCard from './EventCard';

interface EventsViewProps {
  user: User | null;
  setNotification: (notification: { message: string; type: 'success' | 'error' } | null) => void;
}

const EventsView: React.FC<EventsViewProps> = ({ user, setNotification }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  useEffect(() => {
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    }, (error) => {
      console.error("Error in events snapshot:", error);
    });

    let unsubscribeRsvps = () => {};
    if (user) {
      const rsvpsQuery = query(collection(db, 'rsvps'), where('userId', '==', user.id));
      unsubscribeRsvps = onSnapshot(rsvpsQuery, (snapshot) => {
        setRsvps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVP)));
      }, (error) => {
        console.error("Error in user RSVPs snapshot:", error);
      });
    }

    return () => {
      unsubscribeEvents();
      unsubscribeRsvps();
    };
  }, [user]);

  const handleRSVP = async (eventId: string, status: 'going' | 'interested') => {
    if (!user) return;
    try {
      const rsvpRef = doc(db, 'rsvps', `${user.id}_${eventId}`);
      await setDoc(rsvpRef, { eventId, userId: user.id, status });
    } catch (error) {
      console.error("RSVP error:", error);
      setNotification({ message: 'Gagal melakukan RSVP. Silakan coba lagi.', type: 'error' });
    }
  };

  const handleAddToCalendar = (event: Event) => {
    const date = event.date.toDate();
    const formattedDate = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formattedDate}/${formattedDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-3xl font-black text-primary tracking-tight px-4">Acara Mendatang</h2>
      <div className="space-y-4 px-4">
        {events.map(event => (
          <EventCard 
            key={event.id}
            event={event}
            rsvp={rsvps.find(r => r.eventId === event.id)}
            onRSVP={handleRSVP}
            onAddToCalendar={handleAddToCalendar}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsView;
