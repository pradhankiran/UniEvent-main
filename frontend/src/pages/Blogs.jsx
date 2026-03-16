import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then(snap => {
        if (snap.exists()) setUserData(snap.val());
      });
    }
    const blogsRef = ref(db, 'blogs');
    const unsubscribe = onValue(blogsRef, (snapshot) => {
      if (snapshot.exists()) {
        const blogsData = snapshot.val();
        const blogsList = Object.keys(blogsData).map(key => ({
          id: key,
          ...blogsData[key]
        }));
        // Sort newest first
        blogsList.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));
        setBlogs(blogsList);
      } else {
        setBlogs([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-darkGray/10 pb-4 md:pb-6">
          <h1 className="text-4xl md:text-7xl font-display font-black text-darkSection tracking-tighter uppercase leading-none">Blogs<span className="text-neonGreen">.</span></h1>
          <div className="flex gap-4 mt-6 md:mt-0">
             {currentUser && userData?.role !== 'student' && (
               <Link to="/blogs/create" className="flex items-center gap-2 rounded-full bg-neonGreen text-black hover:bg-[#bceb23] focus:ring-neonGreen text-xs font-mono uppercase font-bold tracking-widest py-3 px-6 shadow-sm transition-all focus:outline-none">
                 <Plus size={16} /> Write Blog
               </Link>
             )}
          </div>
        </div>

        {loading ? (
          <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-20 flex justify-center items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse"></div>
            Loading blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center font-mono text-mediumGray uppercase tracking-widest py-20">No articles published yet. Be the first!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-[24px] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-darkGray/5 flex flex-col h-full">
                <div className="h-56 bg-darkSection relative overflow-hidden">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-darkSection to-darkGray flex items-center justify-center">
                      <span className="text-white/20 font-display font-bold text-4xl uppercase text-center leading-none">Uni<br/>Blog</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-darkSection mb-3 uppercase tracking-tight leading-tight group-hover:text-neonGreen transition-colors line-clamp-2">{blog.title}</h3>
                  <div className="font-mono text-[10px] text-mediumGray uppercase tracking-widest leading-relaxed mb-4 flex-grow line-clamp-3 overflow-hidden">
                    {blog.summary || blog.content.substring(0, 100) + '...'}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-darkGray/10">
                    <div className="flex items-center gap-2">
                       <span className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden text-[10px] font-display uppercase flex items-center justify-center">
                         {blog.authorPhoto ? <img src={blog.authorPhoto} className="w-full h-full object-cover" /> : blog.authorName.charAt(0)}
                       </span>
                       <span className="font-mono text-[10px] font-bold text-darkSection uppercase tracking-widest">{blog.authorName}</span>
                    </div>
                    <Link to={`/blogs/${blog.id}`} className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0da371] hover:text-[#0a825a]">
                      Read &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
