import { HandHeart, Award, Users } from 'lucide-react';

export default function VolunteerManagement() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HandHeart className="h-8 w-8 text-primary-600" />
            Volunteer Management Hub
          </h1>
          <p className="text-gray-500 mt-2">Discover volunteer opportunities and earn certificates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Open Volunteer Tasks</h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Registration Desk & Check-in</h3>
              <p className="text-gray-500 text-sm mb-2">Tech Symposium 2026 • Needs 5 volunteers</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full">High Priority</span>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-lg">
            <Award className="h-12 w-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your Credentials</h2>
            <p className="text-primary-100 mb-6">You have completed 3 volunteer tasks. Claim your certificates.</p>
            <button className="w-full bg-white text-primary-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors">
              View Certificates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
