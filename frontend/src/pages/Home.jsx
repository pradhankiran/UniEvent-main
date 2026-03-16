import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../services/firebase';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const usersRef = ref(db, 'users');
        get(usersRef).then(usersSnap => {
          const usersData = usersSnap.val() || {};
          const eventsList = Object.keys(eventsData).map(key => {
            const ev = eventsData[key];
            const creator = usersData[ev.creatorId] || {};
            return {
              id: key,
              ...ev,
              creatorRole: ev.creatorRole || creator.role || 'unknown'
            };
          });
          setEvents(eventsList);
          setLoading(false);
        });
      } else {
        setEvents([]);
        setLoading(false);
      }
    });

    const feedbackRef = ref(db, 'feedback');
    const unsubFeed = onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const feedData = snapshot.val();
        const feedList = Object.keys(feedData).map(key => ({
          id: key,
          ...feedData[key]
        }));
        // Sort to show recent first
        feedList.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
        setFeedbacks(feedList.slice(0, 3)); // show top 3
      } else {
        setFeedbacks([]);
      }
    });

    return () => { unsubscribe(); unsubFeed(); };
  }, []);

  const displayFeatured = events.filter(e => e.isFeatured).length > 0
    ? events.filter(e => e.isFeatured).slice(0, 4)
    : events.slice(0, 4);

  const facultyEvents = events.filter(e => e.creatorRole === 'faculty');
  const clubEvents = events.filter(e => e.creatorRole === 'organizer' || e.creatorRole === 'student');

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-[24px] overflow-hidden group shadow-sm border border-black/5 flex flex-col h-full">
      <div className="h-64 sm:h-80 overflow-hidden relative bg-darkSection">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-darkSection to-darkGray flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
            <span className="text-white/20 font-display font-bold text-4xl uppercase text-center leading-none">Uni<br />Event</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
          {event.category || 'Event'}
        </div>
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-xl md:text-2xl uppercase tracking-tight text-darkSection mb-2 group-hover:text-neonGreen transition-colors line-clamp-2">{event.title}</h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-mediumGray mb-4">
          {event.location} &mdash; {event.date}
        </p>
        <div className="mt-auto pt-4 flex gap-2">
          <Link to={`/events/${event.id}`} className="text-[10px] font-mono font-bold uppercase tracking-widest bg-darkSection text-white px-4 py-2 rounded-full hover:bg-neonGreen hover:text-black transition-colors w-full text-center">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-lightSection min-h-screen">

      {/* 1. Hero Section */}
      <div className="h-screen bg-darkSection flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neonGreen/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center mt-20 mb-8">
          <h1 className="text-[12vw] md:text-9xl lg:text-[180px] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6">
            NU UNI<br /><span className="text-neonGreen">EVENT</span>
          </h1>
        </div>

        {/* Hero Footer Bar (Ticket details row) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-auto pb-8 flex flex-col sm:flex-row justify-between items-end gap-6 border-b border-darkGray/50 pb-6">
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-mediumGray flex flex-col gap-1 text-left">
            <span className="text-white font-semibold">NAGALAND,</span>
            <span>INDIA</span>
          </div>
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-lightSection flex flex-col gap-1 text-left sm:text-right">
            <span className="text-darkGray">GENERAL TICKET: $249</span>
          </div>

          <Link to="/events" className="flex items-center gap-4 bg-neonGreen text-black font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest pl-2 pr-6 py-2 rounded-full hover:bg-white transition-all group">
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-neonGreen transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
            </span>
            <span>CONFIRM YOUR SEAT<br /><span className="font-normal opacity-70">FREE FOR NU STUDENTS & FACULTY</span></span>
          </Link>
        </div>
      </div>

      {/* 2. Brand/Logos Section */}
      <div className="bg-lightSection py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="inline-block border border-darkSection/10 rounded-full px-4 py-1.5 mb-8">
            <span className="text-darkSection font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neonGreen"></span>
              TRUSTED BY THE UNIVERSITY
            </span>
          </div>
          <p className="font-mono text-sm uppercase tracking-widest text-mediumGray text-center max-w-2xl mb-12">
            Our platform connects students from innovative campuses to create a space where ideas grow, connections form, and unforgettable moments happen.
          </p>
        </div>
      </div>

      {/* 3. Future Leaders Block */}
      <div className="max-w-7xl mx-auto px-4 mb-32">
        <div className="bg-[#1A1A1A] rounded-[32px] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          <div className="p-12 md:p-20 flex-1 flex flex-col justify-center relative">
            <span className="absolute top-6 left-6 md:top-12 md:left-12 w-3 h-3 rounded-full bg-neonGreen"></span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] mt-8 mb-8 md:mb-12">
              FUTURE<br />LEADERS<br /><span className="text-neonGreen">GLOBAL EVENT</span>
            </h2>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-neonGreen flex items-center justify-center text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mediumGray max-w-[200px]">
                A cutting-edge workshop designed for creators and innovators eager to lead the next generation.
              </p>
            </div>
          </div>
          <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}>
          </div>
        </div>
      </div>

      {/* 4. Events Sections */}
      <div className="max-w-7xl mx-auto px-4 mb-32 space-y-24">

        {/* Featured Events */}
        {displayFeatured.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-darkGray/10 pb-4 md:pb-6 gap-4 md:gap-0">
              <h2 className="text-3xl md:text-5xl font-display font-black text-darkSection uppercase tracking-tighter">FEATURED EVENTS</h2>
              <Link to="/events" className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-mediumGray hover:text-darkSection transition-colors py-2 px-6 border border-darkGray/20 rounded-full w-full md:w-auto text-center">Explore All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayFeatured.map(event => <EventCard key={`feat-${event.id}`} event={event} />)}
            </div>
          </div>
        )}

        {/* Faculty Events */}
        {facultyEvents.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-darkGray/10 pb-4 md:pb-6">
              <h2 className="text-3xl md:text-5xl font-display font-black text-darkSection uppercase tracking-tighter">BY FACULTY / COLLEGE</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {facultyEvents.map(event => <EventCard key={`fac-${event.id}`} event={event} />)}
            </div>
          </div>
        )}

        {/* Club Events */}
        {clubEvents.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-darkGray/10 pb-4 md:pb-6">
              <h2 className="text-3xl md:text-5xl font-display font-black text-darkSection uppercase tracking-tighter">BY CLUBS / STUDENTS</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {clubEvents.map(event => <EventCard key={`club-${event.id}`} event={event} />)}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-10 flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></div>
            Loading events...
          </div>
        )}

      </div>

      {/* 5. Attendee Feedback */}
      <div className="max-w-7xl mx-auto px-4 mb-32">
        <div className="flex justify-between items-end mb-12 border-b border-darkGray/10 pb-6">
          <h2 className="text-4xl font-display font-black text-darkSection uppercase tracking-tighter">ATTENDEE FEEDBACK</h2>
          {feedbacks.length > 3 && (
            <div className="flex gap-2 hidden md:flex">
              <div className="w-8 h-8 rounded-full border border-darkGray/20 flex items-center justify-center cursor-pointer hover:bg-neonGreen transition-colors">&larr;</div>
              <div className="w-8 h-8 rounded-full border border-darkGray/20 flex items-center justify-center cursor-pointer hover:bg-neonGreen transition-colors">&rarr;</div>
            </div>
          )}
        </div>

        {feedbacks.length === 0 ? (
           <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-10">No feedback submitted yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feedbacks.map((fb, idx) => (
              <div key={fb.id} className={`${idx === 1 ? 'bg-[#EAF3EA] shadow-[0_10px_30px_rgba(211,255,55,0.1)]' : 'bg-white'} p-8 rounded-[24px] border border-black/5 flex flex-col justify-between h-64`}>
                <div>
                  <div className="flex text-neonGreen mb-3 text-lg">★★★★★</div>
                  {fb.eventName && <div className="text-[10px] bg-darkGray/5 w-fit px-2 py-0.5 rounded-full font-mono mb-3 uppercase text-darkSection line-clamp-1">{fb.eventName}</div>}
                  <p className="font-mono text-xs uppercase tracking-widest leading-relaxed text-darkSection line-clamp-3">"{fb.message}"</p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-darkSection font-display uppercase">
                    {fb.photoURL ? (
                      <img src={fb.photoURL} alt="User" className="w-full h-full object-cover" />
                    ) : (fb.name ? fb.name.charAt(0) : '?')}
                  </div>
                  <div>
                    <div className="font-bold text-sm uppercase font-display tracking-tight">{fb.name}</div>
                    <div className="font-mono text-[10px] text-mediumGray uppercase">{fb.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* 8. Contact CTA Layout */}
      <div className="bg-lightSection -translate-y-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-darkGray rounded-[32px] p-12 text-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden h-[400px]">
            <div className="absolute inset-0 bg-black/40"></div>
            <h2 className="relative z-10 text-5xl font-display font-black uppercase tracking-tighter leading-none max-w-xs">
              WE'RE HERE TO HELP
            </h2>
            <p className="relative z-10 mt-6 font-mono text-xs uppercase tracking-widest text-lightSection/70">Connect with our event specialists.</p>
          </div>
          <div className="flex-1 bg-white rounded-[32px] p-12 shadow-xl border border-black/5">
            <h3 className="font-display font-bold text-2xl uppercase tracking-tighter mb-8">BOOK AN EVENT</h3>
            <form className="space-y-6 form-mono">
              <div className="border-b border-darkGray/20 pb-2">
                <input type="text" placeholder="YOUR NAME" className="w-full bg-transparent font-mono text-xs uppercase tracking-widest focus:outline-none py-2" />
              </div>
              <div className="border-b border-darkGray/20 pb-2">
                <input type="email" placeholder="YOUR EMAIL" className="w-full bg-transparent font-mono text-xs uppercase tracking-widest focus:outline-none py-2" />
              </div>
              <div className="border-b border-darkGray/20 pb-2">
                <select className="w-full bg-transparent font-mono text-xs uppercase tracking-widest text-mediumGray focus:outline-none py-2 appearance-none">
                  <option>SELECT TOPIC</option>
                  <option>Host Event</option>
                  <option>Sponsorship</option>
                  <option>Support</option>
                </select>
              </div>
              <button className="w-full mt-8 py-4 bg-neonGreen/80 hover:bg-neonGreen text-black font-mono font-bold text-xs uppercase tracking-widest rounded-full transition-colors">
                SUBMIT REQUEST
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 9. Pre-Footer / Giant Watermark */}
      <div className="bg-[#1C1C1C] rounded-t-[60px] pt-32 pb-8 px-4 mt-12 overflow-hidden flex flex-col items-center">
        <div className="max-w-7xl mx-auto w-full text-center mb-24 relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] mb-12">
            SET THE STAGE FOR<br />YOUR NEXT EVENT.
          </h2>
          <Link to="/login" className="px-10 py-5 bg-white text-darkSection text-xs font-mono font-bold uppercase tracking-widest rounded-[16px] hover:bg-neonGreen hover:text-black transition-all">
            Start Building Event
          </Link>
        </div>

        {/* Massive Background Text matching Uni Event footer */}
        <div className="w-full flex justify-center mt-auto opacity-[0.03] select-none pointer-events-none translate-y-20">
          <span className="text-[20vw] font-display font-black tracking-tighter leading-none text-white uppercase whitespace-nowrap">
            Uni Event
          </span>
        </div>
      </div>

    </div>
  );
}
