
import React from 'react';
import { AttendanceRecord } from '../types';

interface HistoryProps {
  records: AttendanceRecord[];
}

const History: React.FC<HistoryProps> = ({ records }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Riwayat Kehadiran</h2>
        <div className="flex space-x-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium">
             <i className="fas fa-download mr-2"></i> Ekspor PDF
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Durasi</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record) => {
                const checkInDate = new Date(record.checkIn);
                const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;
                
                let durationStr = '--';
                if (checkOutDate) {
                  const diffMs = checkOutDate.getTime() - checkInDate.getTime();
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  durationStr = `${hours}j ${minutes}m`;
                }

                const isLate = checkInDate.getHours() >= 9;

                return (
                  <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {checkInDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {checkOutDate ? checkOutDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {durationStr}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isLate ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {isLate ? 'Terlambat' : 'Tepat Waktu'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-folder-open text-4xl mb-4 opacity-20"></i>
                      <p>Belum ada data riwayat absensi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
