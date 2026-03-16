import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SuperadminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole && userRole !== 'superadmin') {
      navigate('/');
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.keys(data).map(key => ({
          uid: key,
          ...data[key]
        })).filter(user => user.status === 'pending');
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (uid) => {
    try {
      await update(ref(db, `users/${uid}`), {
        status: 'approved'
      });
      alert('User approved successfully!');
    } catch (error) {
      alert('Error approving user: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lightSection pt-32 pb-24 px-4 flex justify-center items-center">
        <div className="font-mono text-mediumGray uppercase tracking-widest text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightSection pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-darkGray/10 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-darkSection uppercase tracking-tighter">Superadmin</h1>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-mediumGray mt-2">Manage Registration Approvals</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
          <div className="p-6 border-b border-darkGray/10 bg-gray-50/50">
            <h2 className="font-display font-bold text-xl uppercase tracking-tighter text-darkSection">Pending Approvals</h2>
          </div>
          
          {users.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs uppercase tracking-widest text-mediumGray">
              No pending registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-darkGray/10 bg-white">
                    <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-widest text-mediumGray font-semibold">Name</th>
                    <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-widest text-mediumGray font-semibold">Email</th>
                    <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-widest text-mediumGray font-semibold">Role</th>
                    <th className="py-4 px-6 font-mono text-[10px] uppercase tracking-widest text-mediumGray font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.uid} className="border-b border-darkGray/5 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-body text-sm font-semibold text-darkSection">{user.name}</td>
                      <td className="py-4 px-6 font-body text-sm text-mediumGray">{user.email}</td>
                      <td className="py-4 px-6 font-mono text-[10px] uppercase tracking-widest text-neonGreen font-bold bg-[#EAF3EA] rounded-full inline-block mt-3 mb-1 ml-6">{user.role}</td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleApprove(user.uid)}
                          className="px-4 py-2 bg-darkSection text-white font-mono text-[10px] uppercase tracking-widest rounded-[12px] hover:bg-neonGreen hover:text-black transition-colors"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
