import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, get, update, push, onValue, serverTimestamp, increment } from 'firebase/database';
import { db } from '../services/firebase';
import { Heart, MessageCircle, Send } from 'lucide-react';

export default function BlogDetails() {
  const { blogId } = useParams();
  const { currentUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (currentUser) {
      get(ref(db, `users/${currentUser.uid}`)).then(snap => {
        if (snap.exists()) setUserData(snap.val());
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // Increment readCount once per load
    const blogRef = ref(db, `blogs/${blogId}`);
    update(blogRef, { readCount: increment(1) }).catch(console.error);

    const unsubBlog = onValue(blogRef, snap => {
      if (snap.exists()) setBlog({ id: snap.key, ...snap.val() });
      setLoading(false);
    });

    const commentsRef = ref(db, `comments/${blogId}`);
    const unsubComments = onValue(commentsRef, snap => {
      if (snap.exists()) {
        const cData = snap.val();
        const cList = Object.keys(cData).map(k => ({ id: k, ...cData[k] }));
        cList.sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));
        setComments(cList);
      } else {
        setComments([]);
      }
    });

    return () => { unsubBlog(); unsubComments(); };
  }, [blogId]);

  const handleLike = async () => {
    if (!currentUser) return alert('Please login to like this blog');
    await update(ref(db, `blogs/${blogId}`), { likes: increment(1) });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Please login to comment');
    if (!newComment.trim()) return;

    await push(ref(db, `comments/${blogId}`), {
      text: newComment,
      authorId: currentUser.uid,
      authorName: userData.name || 'Anonymous',
      authorPhoto: userData.photoURL || '',
      createdAt: serverTimestamp()
    });
    setNewComment('');
  };

  if (loading) return <div className="text-center py-32 font-mono">Loading Article...</div>;
  if (!blog) return <div className="text-center py-32 font-mono">Article not found.</div>;

  return (
    <div className="bg-lightSection min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header content */}
        <div className="mb-8 md:mb-12">
          <Link to="/blogs" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0da371] hover:text-darkSection mb-6 inline-block">&larr; Back to Blogs</Link>
          <h1 className="text-4xl md:text-6xl font-display font-black text-darkSection uppercase tracking-tighter leading-none mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center gap-6 border-b border-darkGray/10 pb-6 mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center font-display uppercase">
                 {blog.authorPhoto ? <img src={blog.authorPhoto} className="w-full h-full object-cover" /> : blog.authorName?.charAt(0)}
               </div>
               <div>
                 <div className="font-bold font-mono text-[10px] uppercase tracking-widest text-darkSection">{blog.authorName}</div>
                 <div className="font-mono text-[10px] text-mediumGray uppercase">{new Date(blog.createdAt).toLocaleDateString()}</div>
               </div>
             </div>
             
             <div className="flex gap-4 ml-auto font-mono text-[10px] tracking-widest text-mediumGray">
               <span className="flex items-center gap-1"><MessageCircle size={14}/> {comments.length}</span>
               <span className="flex items-center gap-1 text-[#0da371]"><Heart size={14} fill={blog.likes > 0 ? 'currentColor' : 'none'}/> {blog.likes || 0}</span>
             </div>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-mediumGray bg-darkGray/5 p-4 rounded-[12px] inline-block mb-8">
            Views: {blog.readCount || 0}
          </div>
        </div>

        {/* Cover image */}
        {blog.coverImage && (
          <div className="w-full h-64 sm:h-96 md:h-[500px] rounded-[24px] md:rounded-[32px] overflow-hidden mb-8 md:mb-12 shadow-md">
            <img src={blog.coverImage} alt={blog.title} loading="lazy" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Markdown/Text content area */}
        <div className="prose prose-lg max-w-none font-body text-darkSection mb-20">
           {/* In a real app we'd parse markdown here, falling back to whitespace-pre-wrap text */}
           <div className="whitespace-pre-wrap leading-relaxed">
             {blog.content}
           </div>
        </div>

        {/* Interactions Row */}
        <div className="flex items-center gap-4 border-t border-b border-darkGray/10 py-6 mb-16">
          <button onClick={handleLike} className="flex items-center gap-2 px-6 py-3 rounded-full border border-darkGray/20 hover:border-neonGreen hover:text-neonGreen transition-colors font-mono text-xs font-bold uppercase tracking-widest">
            <Heart size={18} /> Like Post
          </button>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-darkGray/5">
          <h3 className="text-3xl font-display font-black text-darkSection uppercase tracking-tight mb-8">Comments ({comments.length})</h3>
          
          <div className="space-y-6 mb-12">
            {comments.map(c => (
              <div key={c.id} className="flex gap-4 p-4 rounded-[16px] bg-lightSection">
                <div className="w-10 h-10 shrink-0 rounded-full bg-darkGray flex items-center justify-center font-display text-white uppercase overflow-hidden">
                  {c.authorPhoto ? <img src={c.authorPhoto} className="w-full h-full object-cover"/> : c.authorName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-xs uppercase tracking-widest font-mono text-darkSection">{c.authorName}</span>
                    <span className="text-[10px] uppercase font-mono text-mediumGray">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-body text-sm text-darkSection">{c.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <div className="text-sm font-mono uppercase tracking-widest text-mediumGray">No comments yet.</div>}
          </div>

          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="relative">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full rounded-[24px] border border-darkGray/20 py-4 px-6 pr-16 focus:ring-neonGreen focus:border-neonGreen font-body text-sm bg-lightSection resize-none"
                rows="2"
                required
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neonGreen hover:bg-[#bceb23] flex items-center justify-center text-black shadow-sm transition-colors">
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div className="p-6 bg-[#EAF3EA] rounded-[16px] text-center font-mono text-xs uppercase tracking-widest">
              Please <Link to="/login" className="font-bold underline hover:text-neonGreen">log in</Link> to join the discussion.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
