import { useState, useEffect } from 'react';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../services/firebase';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then(snap => {
        if (snap.exists()) setUserData(snap.val());
      });
    }

    const eventsRef = ref(db, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const eventsList = Object.keys(eventsData).map(key => ({
          id: key,
          ...eventsData[key]
        }));
        setEvents(eventsList);
      } else {
        setEvents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-darkGray/10 pb-4 md:pb-6">
          <h1 className="text-4xl md:text-7xl font-display font-black text-darkSection tracking-tighter uppercase leading-none">Events<span className="text-neonGreen">.</span></h1>
          <div className="flex gap-4 mt-6 md:mt-0">
             {currentUser && userData?.role !== 'student' && (
               <Link to="/events/create" className="flex items-center gap-2 rounded-full bg-neonGreen text-black hover:bg-[#bceb23] focus:ring-neonGreen text-xs font-mono uppercase font-bold tracking-widest py-3 px-6 shadow-sm transition-all focus:outline-none shrink-0">
                 <Plus size={16} /> Add Event
               </Link>
             )}
            <select className="rounded-full border-darkGray/20 focus:border-neonGreen focus:ring-neonGreen text-xs font-mono uppercase tracking-widest py-3 px-6 border bg-white shadow-sm transition-all focus:outline-none">
              <option>All Categories</option>
              <option>Technology</option>
              <option>Cultural</option>
              <option>Seminars</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-20 flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></div>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-20">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-[24px] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-darkGray/5 flex flex-col h-full">
                <div className="h-64 bg-darkSection relative overflow-hidden">
                  {event.bannerUrl ? (
                    <img src={event.bannerUrl} alt={event.title} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-darkSection to-darkGray flex items-center justify-center">
                      <span className="text-white/20 font-display font-bold text-4xl uppercase text-center leading-none">Uni<br/>Event</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                    {event.category || 'Event'}
                  </div>
                </div>
                <div className="p-4 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-darkSection mb-3 uppercase tracking-tight leading-tight group-hover:text-neonGreen transition-colors">{event.title}</h3>
                  <div className="font-mono text-xs text-mediumGray uppercase tracking-widest leading-relaxed mb-8 flex-grow">
                    <div className="mb-2"><span className="text-darkSection">Loc:</span> {event.location}</div>
                    <div><span className="text-darkSection">Date:</span> {event.date}</div>
                    <div><span className="text-darkSection">Time:</span> {event.time}</div>
                  </div>
                  <Link to={`/events/${event.id}`} className="block text-center w-full py-4 bg-darkSection text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-[16px] hover:bg-neonGreen hover:text-black transition-all shadow-md mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
