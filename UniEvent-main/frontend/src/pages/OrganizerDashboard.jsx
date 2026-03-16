import { Plus, Users, BarChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { ref, push, set, onValue } from 'firebase/database';

export default function OrganizerDashboard() {
  const { currentUser } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [events, setEvents] = useState([]);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    if (!currentUser) return;
    const evRef = ref(db, 'events');
    const unsub = onValue(evRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const myEvents = Object.keys(data)
           .filter(k => data[k].createdBy === currentUser.uid)
           .map(k => ({id: k, ...data[k]}));
        setEvents(myEvents);
      } else {
        setEvents([]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const newEventRef = push(ref(db, 'events'));
      await set(newEventRef, {
        title,
        description,
        date,
        time,
        location,
        clubId: "club_demo",
        createdBy: currentUser.uid,
        status: "pending_approval",
        capacity: 100,
        registeredCount: 0
      });
      alert('Event created and pending approval!');
      setShowCreate(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
          <nav className="space-y-2">
            <button onClick={() => setShowCreate(false)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${!showCreate ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <BarChart className="h-5 w-5" /> Dashboard
            </button>
            <button onClick={() => setShowCreate(true)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${showCreate ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Plus className="h-5 w-5" /> Create Event
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
              <Users className="h-5 w-5" /> Members
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
        </div>

        {showCreate ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input type="text" placeholder="Event Title" className="w-full border p-3 rounded-xl" value={title} onChange={(e)=>setTitle(e.target.value)} required />
              <textarea placeholder="Description" className="w-full border p-3 rounded-xl" value={description} onChange={(e)=>setDescription(e.target.value)} required />
              <div className="flex gap-4">
                <input type="date" className="w-full border p-3 rounded-xl" value={date} onChange={(e)=>setDate(e.target.value)} required />
                <input type="time" className="w-full border p-3 rounded-xl" value={time} onChange={(e)=>setTime(e.target.value)} required />
              </div>
              <input type="text" placeholder="Location" className="w-full border p-3 rounded-xl" value={location} onChange={(e)=>setLocation(e.target.value)} required />
              <button type="submit" className="w-full bg-primary-600 text-white font-medium py-3 rounded-xl">Submit for Approval</button>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 font-medium mb-1">My Events</div>
                <div className="text-3xl font-bold text-gray-900">{events.length}</div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100 mt-6">
              {events.length === 0 ? (
                <div className="p-6 text-gray-500 text-center">No events created yet.</div>
              ) : (
                events.map(ev => (
                  <div key={ev.id} className="p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{ev.title}</h3>
                      <p className="text-sm text-gray-500">{ev.date} - {ev.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
