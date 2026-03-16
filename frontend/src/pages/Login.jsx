import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../services/firebase';
import { ref, set, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup, logout } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await signup(email, password);
        
        let photoURL = '';
        if (profilePic) {
          const picRef = storageRef(storage, `profiles/${userCredential.user.uid}`);
          await uploadBytes(picRef, profilePic);
          photoURL = await getDownloadURL(picRef);
        }

        await set(ref(db, `users/${userCredential.user.uid}`), {
          name,
          email,
          role,
          department,
          photoURL,
          status: role === 'student' ? 'approved' : 'pending',
          createdAt: Date.now()
        });
        if (role === 'student') {
          setMessage('Registration successful! Logging you in...');
          navigate('/student/dashboard');
        } else {
          setMessage('Registration successful! Please wait for superadmin approval.');
          await logout();
        }
        setIsRegistering(false);
      } else {
        const userCredential = await login(email, password);
        const userRef = ref(db, `users/${userCredential.user.uid}`);
        
        // Auto-fix for superadmin account to ensure it is always approved with correct role
        if (email.toLowerCase() === 'kiranpradhan4444@gmail.com') {
           await update(userRef, { role: 'superadmin', status: 'approved' });
        }

        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.status === 'pending' && userData.role !== 'superadmin') {
            await logout();
            setError('Your account is pending approval by the superadmin.');
            setLoading(false);
            return;
          }
          
          const uRole = userData.role;
          if (uRole === 'student') navigate('/student/dashboard');
          else if (uRole === 'organizer') navigate('/organizer/dashboard');
          else if (uRole === 'faculty' || uRole === 'superadmin') navigate('/faculty/dashboard');
          else navigate('/');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(`Failed to ${isRegistering ? 'register' : 'log in'}: ` + err.message);
    }
    setLoading(false);
  };

  const initSuperAdmin = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, "kiranpradhan4444@gmail.com", "password123@admin");
      await set(ref(db, `users/${cred.user.uid}`), {
        name: "Super Admin",
        email: "kiranpradhan4444@gmail.com",
        role: "superadmin",
        status: "approved",
        createdAt: Date.now()
      });
      alert('Superadmin created!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-lightSection">
      <div className="max-w-md w-full bg-white rounded-[24px] shadow-2xl p-10 border border-darkGray/10 relative">
        <h2 className="text-4xl font-display font-bold text-center text-darkSection mb-2 uppercase tracking-tight">{isRegistering ? 'Sign up' : 'Sign in'}</h2>
        <p className="text-center font-mono text-mediumGray text-sm mb-8 tracking-widest uppercase">Welcome {isRegistering ? 'to' : 'back to'} UniEvent</p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-[12px] mb-6 text-sm font-body border border-red-100">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-[12px] mb-6 text-sm font-body border border-green-100">{message}</div>}

        <form className="space-y-6" onSubmit={handleAuth}>
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
              >
                <option value="student">Student / Club Member</option>
                <option value="organizer">Club Organizer</option>
                <option value="faculty">Faculty / College Admin</option>
              </select>
            </div>
          )}
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Department / Club Name</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                placeholder="Computer Science"
                required
              />
            </div>
          )}
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target[0] || e.target.files[0])}
                className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-3.5 bg-lightSection text-darkSection border transition-colors font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neonGreen file:text-darkSection hover:file:bg-[#bceb23]"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
              placeholder="student@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-[16px] text-sm font-semibold uppercase tracking-widest text-black bg-neonGreen hover:bg-[#bceb23] focus:outline-none focus:ring-4 focus:ring-neonGreen/50 transition-all shadow-[0_4px_14px_0_rgba(211,255,55,0.39)] hover:shadow-[0_6px_20px_rgba(211,255,55,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 font-mono">
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); setMessage(''); }} 
            className="text-xs font-mono uppercase tracking-widest text-mediumGray hover:text-darkSection transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>

        <button
          onClick={initSuperAdmin}
          className="absolute bottom-4 right-4 text-[10px] font-mono text-mediumGray/50 hover:text-darkSection transition-colors"
          title="Init Superadmin Account (First time only)">
          init()
        </button>
      </div>
    </div>
  );
}
