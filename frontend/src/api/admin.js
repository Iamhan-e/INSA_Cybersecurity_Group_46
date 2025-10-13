import axiosInstance from './axios';

// Get dashboard statistics
export const getStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/stats');
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to fetch stats:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch statistics'
    };
  }
};

// Get recent activity
export const getRecentActivity = async (limit = 20) => {
  try {
    const response = await axiosInstance.get(`/admin/activity?limit=${limit}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to fetch activity:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch activity'
    };
  }
};

// Get all users (with filters)
export const getAllUsers = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/admin/users?${queryString}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to fetch users:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch users'
    };
  }
};

// Get all devices (with filters)
export const getAllDevices = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/admin/devices?${queryString}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to fetch devices:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch devices'
    };
  }
};

// Update user status
export const updateUserStatus = async (userId, status) => {
  try {
    const response = await axiosInstance.put(`/admin/users/${userId}/status`, { status });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to update user status:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update user status'
    };
  }
};

// Update device status
export const updateDeviceStatus = async (deviceId, status) => {
  try {
    const response = await axiosInstance.put(`/admin/devices/${deviceId}/status`, { status });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to update device status:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update device status'
    };
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete user'
    };
  }
};

// Delete device
export const deleteDevice = async (deviceId) => {
  try {
    const response = await axiosInstance.delete(`/admin/devices/${deviceId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ Failed to delete device:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete device'
    };
  }
};