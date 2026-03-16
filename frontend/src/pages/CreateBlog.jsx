import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, push, serverTimestamp, get } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';



export default function CreateBlog() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
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
    if (!currentUser) return alert('Must be logged in to create a blog.');
    if (userData.role === 'student') return alert('Students are not allowed to write blogs.');
    
    setIsPublishing(true);
    try {
      let coverImage = '';
      if (image) {
        const fileRef = storageRef(storage, `blogs/${Date.now()}_${currentUser.uid}`);
        await uploadBytes(fileRef, image);
        coverImage = await getDownloadURL(fileRef);
      }

      await push(ref(db, 'blogs'), {
        title,
        summary,
        content,
        coverImage,
        authorId: currentUser.uid,
        authorName: userData.name || 'Anonymous',
        authorPhoto: userData.photoURL || '',
        createdAt: serverTimestamp(),
        readCount: 0,
        likes: 0
      });

      alert('Blog Published successfully!');
      navigate('/blogs');
    } catch (err) {
      alert(err.message);
    }
    setIsPublishing(false);
  };

  if (!currentUser) return <div className="pt-32 text-center font-mono">Access Denied</div>;
  if (userData.role === 'student') return <div className="pt-32 text-center font-mono text-red-500">Access Denied: Students cannot upload blogs.</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-black text-darkSection uppercase tracking-tight mb-8">Create New Blog</h1>
        
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-darkGray/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Blog Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-lg px-4 py-4 bg-lightSection text-darkSection border transition-colors font-display font-bold"
                placeholder="The Future of University Events"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Short Summary</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                maxLength={150}
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body"
                placeholder="A brief introduction (max 150 chars)..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-3.5 bg-lightSection text-darkSection border transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-neonGreen file:text-darkSection hover:file:bg-[#bceb23]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono tracking-widest uppercase font-semibold text-darkSection mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                className="w-full rounded-[12px] border-darkGray/20 shadow-sm focus:border-neonGreen focus:ring-neonGreen sm:text-sm px-4 py-4 bg-lightSection text-darkSection border transition-colors font-body resize-y"
                placeholder="Write your amazing article here..."
                required
              ></textarea>
            </div>

            <div className="pt-6 border-t border-darkGray/10">
              <button
                type="submit"
                disabled={isPublishing}
                className="w-full py-4 px-4 border border-transparent rounded-[16px] text-sm font-semibold uppercase tracking-widest text-[#EAF3EA] bg-darkSection hover:bg-neonGreen hover:text-black focus:outline-none transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-50 font-mono"
              >
                {isPublishing ? 'Publishing...' : 'Publish Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
