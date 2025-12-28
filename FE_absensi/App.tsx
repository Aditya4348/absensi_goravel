
import React, { useState, useEffect } from 'react';
import { User, AuthView, AppView, AttendanceRecord } from './types';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import History from './components/History';
import Insights from './components/Insights';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>(AuthView.LOGIN);
  const [appView, setAppView] = useState<AppView>(AppView.DASHBOARD);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('absenflow_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadRecords(parsedUser.id);
    }
  }, []);

  const loadRecords = (userId: string) => {
    const allRecords: AttendanceRecord[] = JSON.parse(localStorage.getItem('absenflow_records') || '[]');
    const userRecords = allRecords.filter(r => r.userId === userId);
    setRecords(userRecords.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()));
  };

  const handleLogin = (u: User) => {
    localStorage.setItem('absenflow_user', JSON.stringify(u));
    setUser(u);
    loadRecords(u.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('absenflow_user');
    setUser(null);
    setAppView(AppView.DASHBOARD);
  };

  const handleAddRecord = (newRecord: AttendanceRecord) => {
    const allRecords: AttendanceRecord[] = JSON.parse(localStorage.getItem('absenflow_records') || '[]');
    const existingIndex = allRecords.findIndex(r => r.id === newRecord.id);
    
    let updatedAll;
    if (existingIndex > -1) {
      updatedAll = [...allRecords];
      updatedAll[existingIndex] = newRecord;
    } else {
      updatedAll = [...allRecords, newRecord];
    }

    localStorage.setItem('absenflow_records', JSON.stringify(updatedAll));
    loadRecords(user!.id);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                <i className="fas fa-calendar-check"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">AbsenFlow</h1>
            <p className="text-gray-500 text-center mb-8">
              {authView === AuthView.LOGIN ? 'Login ke akun Anda' : 'Daftar akun baru'}
            </p>

            {authView === AuthView.LOGIN ? (
              <LoginForm onLogin={handleLogin} onToggleView={() => setAuthView(AuthView.REGISTER)} />
            ) : (
              <RegisterForm onRegister={handleLogin} onToggleView={() => setAuthView(AuthView.LOGIN)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        userName={user.name} 
        activeView={appView} 
        onViewChange={setAppView} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {appView === AppView.DASHBOARD && (
          <Dashboard user={user} records={records} onUpdateRecord={handleAddRecord} />
        )}
        {appView === AppView.HISTORY && (
          <History records={records} />
        )}
        {appView === AppView.INSIGHTS && (
          <Insights user={user} records={records} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AbsenFlow. Created for Productivity.
        </div>
      </footer>
    </div>
  );
};

export default App;
