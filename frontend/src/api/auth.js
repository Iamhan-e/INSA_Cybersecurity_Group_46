import axiosInstance from './axios';

// ========================================
// LOGIN (with admin check)
// ========================================
export const login = async (studentId, password) => {
  try {
    const response = await axiosInstance.post('/users/login', {
      studentId,
      password
      // Note: No MAC address sent from React app - only from ESP32
    });

    const { accessToken, user } = response.data.data;

    // ⭐ REMOVED: Admin check (let ProtectedRoute handle it)
    // Store token and user info in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    console.log('✅ Login successful:', user);
    return { success: true, data: { accessToken, user } };
  } catch (error) {
    console.error('❌ Login failed:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
    };
  }
};

// ========================================
// LOGOUT
// ========================================
export const logout = async () => {
  try {
    await axiosInstance.post('/users/logout');
    
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    console.log('✅ Logout successful');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    
    // Clear localStorage even if API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    return { success: true }; // Return success anyway to clear UI
  }
};

// ========================================
// REFRESH TOKEN
// ========================================
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/users/refresh');
    const { accessToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);

    console.log('✅ Token refreshed');
    return { success: true, accessToken };
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    
    // Clear auth on refresh failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    return { success: false };
  }
};

// ========================================
// GET CURRENT USER
// ========================================
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

// ========================================
// CHECK IF USER IS AUTHENTICATED
// ========================================
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const user = getCurrentUser();
  return !!(token && user);
};

// ========================================
// CHECK IF USER IS ADMIN
// ========================================
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
