import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import StudentDashboard from './pages/StudentDashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import About from './pages/About';
import OrganizerDashboard from './pages/OrganizerDashboard';
import FacultyAdminPanel from './pages/FacultyAdminPanel';
import EventAnalytics from './pages/EventAnalytics';
import QRCheckIn from './pages/QRCheckIn';
import VolunteerManagement from './pages/VolunteerManagement';
import SuperadminDashboard from './pages/SuperadminDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/:blogId" element={<BlogDetails />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/faculty/dashboard" element={<FacultyAdminPanel />} />
          <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
          <Route path="/analytics" element={<EventAnalytics />} />
          <Route path="/qr-checkin" element={<QRCheckIn />} />
          <Route path="/volunteers" element={<VolunteerManagement />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
