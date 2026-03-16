import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, push, set, serverTimestamp, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';



export default function CreateEvent() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Event');
  const [capacity, setCapacity] = useState(100);
  const [banner, setBanner] = useState(null);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then((snap) => {
        if (snap.exists()) setUserData(snap.val());
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Must be logged in to create an event.');
    if (userData.role === 'student') return alert('Students are not allowed to host events.');
    
    setIsPublishing(true);
    try {
      let bannerUrl = '';
      if (banner) {
        const fileRef = storageRef(storage, `events/${Date.now()}_${currentUser.uid}`);
        await uploadBytes(fileRef, banner);
        bannerUrl = await getDownloadURL(fileRef);
      }

      const newEventRef = push(ref(db, 'events'));
      await set(newEventRef, {
        title,
        description,
        date,
        time,
        location,
        category,
        capacity: Number(capacity),
        bannerUrl,
        createdBy: currentUser.uid,
        creatorRole: userData.role || 'student',
        status: "Active",
        registeredCount: 0,
        createdAt: serverTimestamp()
      });

      alert('Event published successfully!');
      navigate('/events');
    } catch (err) {
      alert(err.message);
    }
    setIsPublishing(false);
  };

  if (!currentUser) return <div className="pt-32 text-center font-mono">Access Denied: Please log in.</div>;
  if (userData.role === 'student') return <div className="pt-32 text-center font-mono text-red-500">Access Denied: Students cannot create events.</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-black text-darkSection uppercase tracking-tight mb-8">Host an Event</h1>
        
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-darkGray/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-lg px-4 py-4 bg-lightSection text-darkSection border transition-colors font-display font-bold"
                placeholder="Annual Tech Symposium '26"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                  placeholder="Main Auditorium"
                  required
                />
              </div>
              <div>
                 <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Category</label>
                 <select
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body relative"
                 >
                   <option>Technology</option>
                   <option>Cultural</option>
                   <option>Seminars</option>
                   <option>Sports</option>
                   <option>Workshop</option>
                 </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Max Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Event Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBanner(e.target.files[0])}
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-3.5 bg-lightSection text-darkSection border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neonGreen file:text-darkSection hover:file:bg-[#bceb23]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="6"
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body resize-y"
                placeholder="What will happen at this event..."
                required
              ></textarea>
            </div>

            <div className="pt-6 border-t border-darkGray/10">
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-4 px-4 border border-transparent rounded-[16px] text-sm font-semibold uppercase tracking-widest text-[#EAF3EA] bg-darkSection hover:bg-neonGreen hover:text-black focus:outline-none transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50 font-mono"
              >
                {isPublishing ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
