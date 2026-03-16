import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-lightSection min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-black text-darkSection tracking-tighter uppercase leading-none mb-6">
            About <span className="text-neonGreen">Uni Event</span>
          </h1>
          <p className="font-mono text-sm uppercase tracking-widest text-mediumGray leading-relaxed">
            Centralizing Every Event, Workshop, and Happening on Campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-darkSection rounded-[32px] p-12 text-white h-full flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-neonGreen/20 blur-[80px] rounded-full point-events-none"></div>
             <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-6 relative z-10">Why Uni Event?</h2>
             <p className="font-body text-lightSection/80 text-lg leading-relaxed relative z-10">
               Universities are buzzing hubs of activity, but finding out what's happening can be a chaotic mess of scattered emails, bulletin boards, and social media posts. 
               <br/><br/>
               Uni Event was built to solve this. We centralize every seminar, college fest, club workshop, and sports meet into one stunning, easy-to-use platform.
             </p>
          </div>
          <div className="space-y-8">
             <div className="bg-white p-8 rounded-[24px] shadow-sm border border-darkGray/10 border-l-4 border-l-neonGreen">
               <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-darkSection mb-2">1. Discover & RSVP</h3>
               <p className="font-body text-mediumGray text-sm">Students can easily browse upcoming events categorized by faculty or clubs, secure their tickets, and track their registrations in the student portal.</p>
             </div>
             <div className="bg-white p-8 rounded-[24px] shadow-sm border border-darkGray/10 border-l-4 border-l-darkSection">
               <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-darkSection mb-2">2. Host & Organize</h3>
               <p className="font-body text-mediumGray text-sm">Organizers and faculty can list their workshops, manage capacity, verify check-ins via QR codes, and gather real-time feedback post-event.</p>
             </div>
             <div className="bg-white p-8 rounded-[24px] shadow-sm border border-darkGray/10 border-l-4 border-l-[#0da371]">
               <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-darkSection mb-2">3. Community Blogs</h3>
               <p className="font-body text-mediumGray text-sm">Beyond just events, verified students can write blogs, attach pictures, and share their campus experiences, creating a living digital yearbook.</p>
             </div>
          </div>
        </div>

        <div className="bg-[#EAF3EA] rounded-[40px] p-12 md:p-24 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-black text-darkSection uppercase tracking-tighter mb-6">Ready to Experience Campus?</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-[#34423C] mb-8 max-w-xl mx-auto">
            Join thousands of students and faculty already centralizing their academic lives.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/events" className="px-8 py-4 bg-darkSection text-white font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neonGreen hover:text-black transition-colors shadow-md">
              Explore Events
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-darkSection font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition-colors shadow-sm border border-darkGray/10">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
