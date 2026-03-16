import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, MessageSquare } from 'lucide-react';
import { ref, get, set, push, serverTimestamp, onValue } from 'firebase/database';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState({});
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [realtimeCount, setRealtimeCount] = useState(0);

  useEffect(() => {
    const eventRef = ref(db, `events/${eventId}`);
    const unsubEvent = onValue(eventRef, (snapshot) => {
      if (snapshot.exists()) {
        setEvent(snapshot.val());
      }
      setLoading(false);
    });

    const regRef = ref(db, `registrations/${eventId}`);
    const unsubRegs = onValue(regRef, (snapshot) => {
      if (snapshot.exists()) {
        setRealtimeCount(snapshot.size);
      } else {
        setRealtimeCount(0);
      }
    });
    
    const fetchUserData = async () => {
      if (currentUser) {
         const regSnapshot = await get(ref(db, `registrations/${eventId}/${currentUser.uid}`));
         if (regSnapshot.exists()) setIsRegistered(true);

         const userSnap = await get(ref(db, `users/${currentUser.uid}`));
         if (userSnap.exists()) setUserData(userSnap.val());
      }
    };
    fetchUserData();
    
    return () => {
      unsubEvent();
      unsubRegs();
    };
  }, [eventId, currentUser]);

  const handleRegister = async () => {
    if (!currentUser) return alert("Please login to register!");
    try {
      await set(ref(db, `registrations/${eventId}/${currentUser.uid}`), {
        registeredAt: Date.now(),
        checkedIn: false,
        qrCode: `${eventId}-${currentUser.uid}` // Mock QR code string
      });
      setIsRegistered(true);
      alert('Successfully registered!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() || !isRegistered) return;
    setFeedbackLoading(true);
    try {
      await push(ref(db, 'feedback'), {
        userId: currentUser.uid,
        name: userData.name || 'Anonymous',
        role: userData.role || 'user',
        photoURL: userData.photoURL || '',
        message: feedback,
        eventId,
        eventName: event.title,
        createdAt: serverTimestamp()
      });
      setFeedback('');
      alert('Feedback submitted successfully!');
    } catch (err) {
      alert('Failed to submit feedback: ' + err.message);
    }
    setFeedbackLoading(false);
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!event) return <div className="text-center mt-20">Event not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-0 md:px-6 lg:px-8 pt-20 md:pt-32 pb-6 md:pb-10">
      <div className="w-full h-64 bg-gray-200 md:rounded-3xl mb-8 overflow-hidden relative">
        {event.bannerUrl && <img src={event.bannerUrl} alt="Banner" loading="lazy" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-8">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium mb-3 inline-block">
            {event.status || 'Active'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">About the Event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Feedback Form for Attendees */}
          {isRegistered && (
            <div className="bg-[#EAF3EA] p-6 rounded-2xl shadow-sm border border-[#d2e8d2] mt-6">
              <h2 className="text-xl font-display font-bold mb-2 flex items-center gap-2 text-darkSection">
                <MessageSquare size={18} /> How was this event?
              </h2>
              <p className="text-xs font-mono uppercase tracking-widest text-[#34423C] mb-4">
                You are registered. Share your feedback so we can feature it!
              </p>
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience here..."
                  rows="3"
                  className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen text-sm px-4 py-3 bg-white text-darkSection border transition-colors font-body resize-none mb-3"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="py-2.5 px-6 rounded-full text-xs font-semibold uppercase tracking-widest text-white bg-darkSection hover:bg-neonGreen hover:text-black focus:outline-none transition-all font-mono shadow-md disabled:opacity-50"
                >
                  {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="h-5 w-5 text-primary-500" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-primary-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="h-5 w-5 text-primary-500" />
              <span>{realtimeCount || event.registeredCount || 0} / {event.capacity || '?'} Registered</span>
            </div>
            <hr className="my-2 border-gray-100" />
            <button 
               onClick={handleRegister}
               disabled={isRegistered}
               className={`w-full font-medium py-3 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 ${isRegistered ? 'bg-green-100 text-green-700' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}>
              <Ticket className="h-5 w-5" />
              {isRegistered ? 'Registered' : 'Register Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
