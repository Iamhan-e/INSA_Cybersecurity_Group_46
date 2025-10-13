import { useState } from 'react';
import { login, getCurrentUser, isAuthenticated } from './api/auth';

function App() {
  const [studentId, setStudentId] = useState('ADMIN001');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(getCurrentUser());

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await login(studentId, password);
    
    if (result.success) {
      setMessage('✅ Login successful!');
      setUser(result.data.user);
    } else {
      setMessage(`❌ ${result.message}`);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMessage('✅ Logged out');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            API Connection Test
          </h1>
          <p className="text-slate-600">
            Testing backend connectivity
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">
            Authentication Status
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isAuthenticated() ? 'bg-success-500' : 'bg-slate-300'}`}></div>
            <span className="text-sm text-slate-600">
              {isAuthenticated() ? 'Authenticated' : 'Not authenticated'}
            </span>
          </div>
          
          {user && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Student ID:</strong> {user.studentId}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          )}
        </div>

        {/* Login Form */}
        {!isAuthenticated() ? (
          <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                placeholder="ADMIN001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                placeholder="admin123"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-600 hover:bg-accent-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Test Login'}
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <button
              onClick={handleLogout}
              className="w-full bg-danger-600 hover:bg-danger-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('✅') 
              ? 'bg-success-50 border border-success-200 text-success-700'
              : 'bg-danger-50 border border-danger-200 text-danger-700'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-slate-100 rounded-lg p-4">
          <p className="text-xs text-slate-600">
            <strong>Make sure:</strong><br/>
            1. Backend is running on port 3000<br/>
            2. Admin user exists (ADMIN001 / admin123)<br/>
            3. CORS is enabled for localhost:5173
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;