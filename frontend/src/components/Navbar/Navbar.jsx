import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, get } from 'firebase/database';
import { db } from '../../services/firebase';

export default function Navbar() {
  const { currentUser } = useAuth();
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then(snap => {
        if (snap.exists() && snap.val().photoURL) {
          setPhotoURL(snap.val().photoURL);
        }
      });
    }
  }, [currentUser]);
  
  // The screenshot shows: HOME* ABOUT BLOG EVENTS || Book an event
  return (
    <div className="absolute top-0 w-full z-50 pt-4 px-4 pointer-events-none">
      <nav className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg px-6 py-4 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-2">
           <Link to="/" className="font-display font-bold text-2xl tracking-tight text-black uppercase">
             Uni Event<sup className="text-[10px] font-normal tracking-normal ml-0.5">®</sup>
           </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-black">
          <Link to="/" className="hover:text-neonGreen transition-colors">Home*</Link>
          <Link to="/about" className="hover:text-neonGreen transition-colors">About</Link>
          <Link to="/blogs" className="hover:text-neonGreen transition-colors">Blog</Link>
          <Link to="/events" className="hover:text-neonGreen transition-colors">Events</Link>
        </div>

        <div className="flex items-center gap-4">
          {!currentUser && (
            <Link to="/login" className="hidden md:block font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-neonGreen transition-colors mr-2">
              Login
            </Link>
          )}
          <Link
            to={currentUser ? "/student/dashboard" : "/login"}
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white bg-[#0da371] rounded-full hover:bg-[#0a825a] transition-all font-mono shadow-md"
          >
            Book an event
          </Link>

          {currentUser && (
            <Link to="/profile" className="w-10 h-10 rounded-full border border-darkGray/20 overflow-hidden hover:ring-2 hover:ring-neonGreen transition-all">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-darkSection text-white flex items-center justify-center font-mono text-sm uppercase">
                  {currentUser.email.charAt(0)}
                </div>
              )}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
