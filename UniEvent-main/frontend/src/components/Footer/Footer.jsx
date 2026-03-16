import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#34423C] pt-24 pb-12 text-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10 pt-16">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-[0.9] text-white">
              SET THE STAGE FOR<br />YOUR NEXT EVENT.
            </h2>
          </div>
          
          <div className="md:w-1/2 flex gap-12 md:gap-24 md:justify-end font-mono text-[10px] md:text-xs tracking-widest font-semibold text-white/90">
            <div className="flex flex-col gap-4">
              <span className="text-white/50 mb-2 uppercase">MAIN PAGES</span>
              <Link to="/" className="hover:text-neonGreen transition-colors capitalize">Home</Link>
              <Link to="/about" className="hover:text-neonGreen transition-colors capitalize">About</Link>
              <Link to="/blog" className="hover:text-neonGreen transition-colors capitalize">Blog</Link>
              <Link to="/blog/details" className="hover:text-neonGreen transition-colors capitalize">Blog Details</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white/50 mb-2 uppercase">INNER PAGES</span>
              <Link to="/contact" className="hover:text-neonGreen transition-colors capitalize">Contact</Link>
              <Link to="/events" className="hover:text-neonGreen transition-colors capitalize">Events</Link>
              <Link to="/events" className="hover:text-neonGreen transition-colors capitalize">Event Details</Link>
              <Link to="/404" className="hover:text-neonGreen transition-colors capitalize">404 Not Found</Link>
            </div>
          </div>
        </div>

        {/* Middle Divider row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-white/10">
          <div className="py-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 font-mono text-[10px] md:text-xs  tracking-widest font-bold lowercase text-white">
            codingclubsetnu@gmail.com
          </div>
          <Link to="/login" className="py-6 flex items-center justify-center bg-[#EAF3EA] text-[#34423C] hover:bg-neonGreen transition-colors font-mono text-[10px] md:text-xs  tracking-widest font-bold capitalize">
            Book an event
          </Link>
          <Link to="/events" className="py-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/10 font-mono text-[10px] md:text-xs tracking-widest font-bold text-white capitalize">
            Discover Events
          </Link>
        </div>

        {/* Lower Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 py-16 gap-12 border-b border-white/10 items-end">
          <div className="font-mono text-xs tracking-wide leading-relaxed text-white">
            We're here to bring<br/>your event to life.
          </div>
          <div className="font-mono text-[10px] tracking-wide leading-relaxed text-white">
            Transform your event vision into a polished, professional experience with modern tools, beautiful design, and effortless attendee management.
          </div>
          <div className="flex items-end justify-between md:justify-end gap-6 text-right">
             <span className="text-8xl md:text-[140px] font-display font-medium text-neonGreen leading-[0.7] tracking-tighter">8</span>
             <span className="font-mono text-[10px] tracking-wide leading-relaxed text-right text-white">
               Take a Break. Plan<br/>Something Big.
             </span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 font-mono text-[10px] tracking-widest text-[#EAF3EA]">
          <div>©2026 Created by Uni Event</div>
          <div className="flex gap-6 mt-4 md:mt-0 lowercase">
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
