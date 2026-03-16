import { QrCode, CheckCircle, Search } from 'lucide-react';

export default function QRCheckIn() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-8 py-10 flex flex-col items-center justify-center text-white relative">
          {/* Scanner Viewport Placeholder */}
          <div className="h-48 w-48 border-2 border-primary-500 rounded-xl flex items-center justify-center relative mb-4">
            <QrCode className="h-16 w-16 text-primary-500/50" />
            <div className="absolute inset-0 bg-primary-500/10 animate-pulse rounded-xl"></div>
          </div>
          <p className="font-medium text-gray-300">Align QR Code within frame</p>
        </div>
        
        <div className="p-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" 
              placeholder="Or enter student ID manually..." 
            />
          </div>
          
          <button className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
