
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord } from '../types';

interface DashboardProps {
  user: User;
  records: AttendanceRecord[];
  onUpdateRecord: (record: AttendanceRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, records, onUpdateRecord }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.date === todayStr);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckAction = () => {
    if (!todayRecord) {
      // Check In
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        date: todayStr,
        checkIn: new Date().toISOString(),
      };
      onUpdateRecord(newRecord);
    } else if (!todayRecord.checkOut) {
      // Check Out
      const updatedRecord: AttendanceRecord = {
        ...todayRecord,
        checkOut: new Date().toISOString()
      };
      onUpdateRecord(updatedRecord);
    }
  };

  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOut;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Time Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-medium opacity-80 mb-2">Halo, {user.name}</h2>
            <p className="text-4xl md:text-5xl font-bold tracking-tight">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-lg opacity-90 mt-2">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <button
              disabled={isCheckedOut}
              onClick={handleCheckAction}
              className={`group w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${
                !isCheckedIn 
                  ? 'bg-white text-blue-600 hover:scale-105 active:scale-95' 
                  : isCheckedOut 
                    ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-orange-500 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <i className={`fas ${!isCheckedIn ? 'fa-sign-in-alt' : isCheckedOut ? 'fa-check-circle' : 'fa-sign-out-alt'} text-4xl mb-2`}></i>
              <span className="text-lg font-bold uppercase tracking-wider">
                {!isCheckedIn ? 'Check In' : isCheckedOut ? 'Selesai' : 'Check Out'}
              </span>
              <span className="text-xs mt-1 opacity-70">
                {!isCheckedIn ? 'Mulai Kerja' : isCheckedOut ? 'Sampai Besok!' : 'Selesai Kerja'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Check In</p>
            <p className="text-lg font-bold text-gray-700">
              {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-door-open"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Check Out</p>
            <p className="text-lg font-bold text-gray-700">
              {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Total Kehadiran</p>
            <p className="text-lg font-bold text-gray-700">{records.length} Hari</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Aktivitas Terakhir</h3>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer">Lihat Semua</span>
        </div>
        <div className="divide-y divide-gray-50">
          {records.slice(0, 3).map((record) => (
            <div key={record.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <i className="fas fa-user-clock"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400">
                    Kerja: {record.checkOut ? 'Selesai' : 'Sedang Berlangsung'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-600">
                  {new Date(record.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '...'}
                </p>
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400">
              <p>Belum ada aktivitas hari ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
