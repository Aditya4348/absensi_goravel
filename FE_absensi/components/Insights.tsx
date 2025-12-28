
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AIInsight } from '../types';
import { getAttendanceInsights } from '../services/geminiService';

interface InsightsProps {
  user: User;
  records: AttendanceRecord[];
}

const Insights: React.FC<InsightsProps> = ({ user, records }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (records.length === 0) return;
    setLoading(true);
    const result = await getAttendanceInsights(records, user.name);
    if (result) {
      setInsight(result);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          <i className="fas fa-robot"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Kehadiran</h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-6">
          Dapatkan analisis cerdas tentang pola kerja Anda berdasarkan data kehadiran menggunakan kekuatan Google Gemini AI.
        </p>
        <button
          onClick={fetchInsight}
          disabled={loading || records.length === 0}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Menganalisis...</span>
            </span>
          ) : (
            'Hasilkan Laporan Analisis'
          )}
        </button>
      </div>

      {insight && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
          {/* Summary */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-clipboard-list text-purple-600 mr-2"></i>
              Ringkasan Performa
            </h3>
            <p className="text-gray-600 leading-relaxed italic">
              "{insight.summary}"
            </p>
          </div>

          {/* Productivity Score */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Productivity Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364}
                        strokeDashoffset={364 - (364 * insight.productivityScore) / 100}
                        strokeLinecap="round"
                        className="text-purple-600 transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="absolute text-3xl font-bold text-gray-800">{insight.productivityScore}%</span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Rekomendasi Strategis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insight.recommendations.map((rec, i) => (
                <div key={i} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold mb-3">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {records.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <i className="fas fa-database text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-400 font-medium">Data kehadiran minimal dibutuhkan untuk memulai analisis AI</p>
        </div>
      )}
    </div>
  );
};

export default Insights;
