import { createContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAuthenticated as checkAuth, isAdmin } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      const authenticated = checkAuth();
      const currentUser = getCurrentUser();
      
      // ⭐ NEW: Verify user is admin
      const userIsAdmin = isAdmin();
      
      if (authenticated && userIsAdmin) {
        setIsAuthenticated(true);
        setUser(currentUser);
        console.log('🔒 Admin authenticated:', currentUser);
      } else if (authenticated && !userIsAdmin) {
        // User is authenticated but not admin - clear auth
        console.warn('⚠️ Non-admin user detected, clearing auth');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (studentId, password) => {
    try {
      setLoading(true);
      const result = await apiLogin(studentId, password);

      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        console.log('✅ Admin logged in:', result.data.user);
        return { success: true };
      } else {
        console.error('❌ Login failed:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ Admin logged out');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Clear state even if API fails
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};