import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { ref, onValue, get } from 'firebase/database';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    // Get points
    get(ref(db, `users/${currentUser.uid}/points`)).then(snap => {
      if (snap.exists()) setPoints(snap.val());
    });

    // Get My registrations
    const unsub = onValue(ref(db, `registrations`), async snap => {
      if (snap.exists()) {
        const allRegs = snap.val();
        const myEvents = [];
        for (const evId in allRegs) {
          if (allRegs[evId][currentUser.uid]) {
            const evSnap = await get(ref(db, `events/${evId}`));
            if (evSnap.exists()) {
              myEvents.push({ id: evId, ...evSnap.val() });
            }
          }
        }
        setRegistrations(myEvents);
      }
    });

    return () => unsub();
  }, [currentUser]);

  if (!currentUser) return <div className="p-10 text-center">Please log in.</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-darkSection tracking-tighter uppercase">Student <span className="text-neonGreen">Portal</span></h1>
          <p className="font-mono text-xs uppercase tracking-widest text-mediumGray mt-2">Manage your registrations and points</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-darkGray/5">
              <div className="flex items-center justify-between mb-8 border-b border-darkGray/10 pb-4">
                <h2 className="text-2xl font-display font-bold text-darkSection uppercase tracking-tight">My Events <span className="text-neonGreen">{registrations.length}</span></h2>
              </div>

              {registrations.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-lightSection flex items-center justify-center mb-4">
                    <span className="text-2xl">🎟️</span>
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest text-mediumGray mb-6">No events registered yet.</p>
                  <Link to="/events" className="px-6 py-3 bg-darkSection text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-neonGreen hover:text-black transition-all">Browse Events</Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {registrations.map(ev => (
                    <li key={ev.id} className="p-6 border border-darkGray/10 hover:border-darkGray/30 transition-all rounded-[16px] flex flex-col sm:flex-row justify-between sm:items-center gap-4 group">
                      <div>
                        <div className="font-display font-bold text-xl uppercase mb-1">{ev.title}</div>
                        <div className="font-mono text-xs uppercase tracking-widest text-mediumGray">
                          {ev.date} <span className="mx-2">•</span> {ev.time}
                        </div>
                      </div>
                      <Link to={`/events/${ev.id}`} className="inline-flex items-center justify-center px-5 py-2.5 bg-lightSection hover:bg-neonGreen text-darkSection font-mono text-xs uppercase tracking-widest font-semibold rounded-full transition-all flex-shrink-0 border border-darkGray/10 group-hover:border-transparent">
                        Ticket &rarr;
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-darkSection p-8 rounded-[24px] shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-neonGreen/20 blur-[50px] rounded-full group-hover:bg-neonGreen/30 transition-all duration-500"></div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight mb-2 relative z-10">Engagement Score</h2>
              <p className="font-mono text-[10px] text-lightSection/60 uppercase tracking-widest mb-8 relative z-10">Earn more by attending events</p>

              <div className="relative z-10 flex items-baseline gap-2">
                <span className="text-6xl font-display font-black text-neonGreen tracking-tighter">{points}</span>
                <span className="font-mono text-xs text-mediumGray uppercase tracking-widest">PTS</span>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <Link to="/events" className="text-white hover:text-neonGreen font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                  Explore ways to earn <span className="text-lg leading-none">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
