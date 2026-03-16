import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, get, update } from 'firebase/database';
import { db, storage } from '../services/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LogOut, Camera } from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [newPic, setNewPic] = useState(null);

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then(snap => {
        if (snap.exists()) {
          setUserData(snap.val());
          setName(snap.val().name || '');
          setDepartment(snap.val().department || '');
        }
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photoURL = userData.photoURL || '';
      if (newPic) {
        const picRef = storageRef(storage, `profiles/${currentUser.uid}`);
        await uploadBytes(picRef, newPic);
        photoURL = await getDownloadURL(picRef);
      }
      
      await update(ref(db, `users/${currentUser.uid}`), {
        name,
        department,
        photoURL
      });
      alert('Profile updated successfully!');
      
      // Update local state
      setUserData(prev => ({ ...prev, name, department, photoURL }));
      setNewPic(null);
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  if (!currentUser) return <div className="text-center mt-32">Please sign in to view your profile.</div>;
  if (loading) return <div className="text-center mt-32">Loading profile...</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-darkGray/10 relative">
          <button 
            onClick={logout} 
            className="absolute top-8 right-8 text-red-500 hover:text-red-700 flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-semibold transition-colors">
            <LogOut size={16} /> Logout
          </button>
          
          <h1 className="text-4xl font-display font-black text-darkSection uppercase tracking-tight mb-12">My Profile</h1>

          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Left sidebar - avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group w-40 h-40 rounded-full border-4 border-neonGreen overflow-hidden mb-4">
                {userData.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-darkGray flex items-center justify-center text-4xl font-display text-white uppercase">
                    {userData.name?.charAt(0) || currentUser.email.charAt(0)}
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white cursor-pointer transition-all">
                  <Camera size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewPic(e.target.files[0])} />
                </label>
              </div>
              <span className="font-mono text-[10px] text-mediumGray uppercase tracking-widest text-center">
                Click photo to change
                {newPic && <span className="block text-neonGreen mt-1 text-xs">New image selected</span>}
              </span>
            </div>

            {/* Right side - form */}
            <div className="flex-1">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="mt-1 block w-full rounded-[12px] border-darkGray/10 bg-gray-50/50 sm:text-sm px-4 py-4 text-mediumGray border font-body cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Role</label>
                  <input
                    type="text"
                    value={userData.role || 'Unknown'}
                    disabled
                    className="mt-1 block w-full rounded-[12px] border-darkGray/10 bg-gray-50/50 sm:text-sm px-4 py-4 text-mediumGray border font-body cursor-not-allowed uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Status</label>
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest ${userData.status === 'approved' ? 'bg-[#EAF3EA] text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {userData.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Department / Club</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[16px] text-sm font-semibold uppercase tracking-widest text-black bg-neonGreen hover:bg-[#bceb23] focus:outline-none transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 font-mono"
                  >
                    {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
