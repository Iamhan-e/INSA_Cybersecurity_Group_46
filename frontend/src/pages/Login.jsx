// src/pages/Login.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;