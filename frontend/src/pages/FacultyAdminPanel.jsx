import { CheckCircle, XCircle, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { ref, onValue, update } from 'firebase/database';

export default function FacultyAdminPanel() {
  const { currentUser, userRole } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!currentUser || (userRole !== 'faculty' && userRole !== 'superadmin')) return;
    const evRef = ref(db, 'events');
    const unsub = onValue(evRef, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pendingEvents = Object.keys(data)
           .filter(k => data[k].status === 'pending_approval')
           .map(k => ({id: k, ...data[k]}));
        setEvents(pendingEvents);
      } else {
        setEvents([]);
      }
    });
    return () => unsub();
  }, [currentUser, userRole]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await update(ref(db, `events/${id}`), { status });
    } catch (err) {
      alert(err.message);
    }
  };

  if (!currentUser) return <div className="p-8 text-center text-red-500">Access Denied</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-medium">
              Pending Approvals
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
              Approved Events
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
              <Bell className="h-5 w-5" /> Announcements
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Event Approvals</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
          {events.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending approvals.</div>
          ) : (
             events.map(ev => (
              <div key={ev.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{ev.title}</h3>
                  <p className="text-sm text-gray-500">{ev.date} • {ev.location}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleUpdateStatus(ev.id, 'approved')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-lg transition-colors">
                    <CheckCircle className="h-5 w-5" /> Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(ev.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-medium rounded-lg transition-colors">
                    <XCircle className="h-5 w-5" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
