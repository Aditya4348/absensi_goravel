
import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  userName: string;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, activeView, onViewChange, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => onViewChange(AppView.DASHBOARD)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
                <i className="fas fa-calendar-check"></i>
              </div>
              <span className="font-bold text-gray-800 tracking-tight">AbsenFlow</span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => onViewChange(AppView.DASHBOARD)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === AppView.DASHBOARD 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onViewChange(AppView.HISTORY)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === AppView.HISTORY 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Riwayat
              </button>
              <button
                onClick={() => onViewChange(AppView.INSIGHTS)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === AppView.INSIGHTS 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                AI Analisis
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Selamat Datang,</p>
              <p className="text-sm font-semibold text-gray-700">{userName}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
        <button
          onClick={() => onViewChange(AppView.DASHBOARD)}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            activeView === AppView.DASHBOARD ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
          }`}
        >
          <i className="fas fa-home text-lg"></i>
          <span className="text-[10px] mt-1 font-semibold uppercase">Home</span>
        </button>
        <button
          onClick={() => onViewChange(AppView.HISTORY)}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            activeView === AppView.HISTORY ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
          }`}
        >
          <i className="fas fa-history text-lg"></i>
          <span className="text-[10px] mt-1 font-semibold uppercase">History</span>
        </button>
        <button
          onClick={() => onViewChange(AppView.INSIGHTS)}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
            activeView === AppView.INSIGHTS ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
          }`}
        >
          <i className="fas fa-robot text-lg"></i>
          <span className="text-[10px] mt-1 font-semibold uppercase">AI</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
