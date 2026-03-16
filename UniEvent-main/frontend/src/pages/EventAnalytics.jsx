import { BarChart, PieChart, LineChart, Activity, Users, Star } from 'lucide-react';

export default function EventAnalytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Analytics</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-primary-50 rounded-xl text-primary-600">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Total Events</div>
            <div className="text-2xl font-bold">142</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-xl text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Registrations</div>
            <div className="text-2xl font-bold">3,892</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Avg Rating</div>
            <div className="text-2xl font-bold">4.8</div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center text-gray-400">
          <BarChart className="h-12 w-12 mb-4 text-gray-300" />
          <p>Attendance Over Time (Bar Chart)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col items-center justify-center text-gray-400">
          <PieChart className="h-12 w-12 mb-4 text-gray-300" />
          <p>Top Performing Clubs (Pie Chart)</p>
        </div>
      </div>
    </div>
  );
}
