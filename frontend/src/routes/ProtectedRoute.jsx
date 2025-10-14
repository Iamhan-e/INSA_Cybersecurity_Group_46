import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check if user is admin (React dashboard is admin-only)
  if (user?.role !== 'admin') {
    console.warn('⚠️ Non-admin user trying to access admin dashboard');
    // Clear auth and redirect
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // Authenticated and admin - allow access
  return children;
};

export default ProtectedRoute;