import User from '../models/User.js';
import Device from '../models/Device.js';

// ====== DASHBOARD STATISTICS ======
export const getStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard statistics...');

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalDevices = await Device.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const blockedUsers = await User.countDocuments({ status: 'blocked' });
    const activeDevices = await Device.countDocuments({ status: 'active' });
    const blockedDevices = await Device.countDocuments({ status: 'blocked' });

    // Get recently active devices (last seen within 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentlyActiveDevices = await Device.countDocuments({
      lastSeen: { $gte: oneDayAgo },
      status: 'active'
    });

    // Get users with most devices
    const usersWithDevices = await User.aggregate([
      {
        $project: {
          studentId: 1,
          name: 1,
          email: 1,
          deviceCount: { 
            $size: { 
              $ifNull: ['$devices', []] 
              } 
            }
        }
      },
      { $sort: { deviceCount: -1 } },
      { $limit: 5 }
    ]);

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const recentDevices = await Device.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        recentlyRegistered: recentUsers
      },
      devices: {
        total: totalDevices,
        active: activeDevices,
        blocked: blockedDevices,
        recentlyActive: recentlyActiveDevices,
        recentlyRegistered: recentDevices
      },
      topUsers: usersWithDevices
    };

    console.log('✅ Statistics fetched successfully');
    return res.status(200).json({
      success: true,
      message: 'Statistics fetched successfully',
      data: stats
    });

  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// ====== GET ALL USERS (with filters) ======
export const getAllUsers = async (req, res) => {
  try {
    const { status, role, search, page = 1, limit = 10 } = req.query;

    console.log('👥 Fetching users with filters:', { status, role, search, page, limit });

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch users with populated devices
    const users = await User.find(filter)
      .populate('devices', 'macAddress ipAddress status lastSeen')
      .select('-password -refreshTokenHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    console.log(`✅ Fetched ${users.length} users (total: ${totalUsers})`);

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalUsers / Number(limit)),
          totalUsers,
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// ====== GET SINGLE USER BY ID ======
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching user:', id);

    const user = await User.findById(id)
      .populate('devices', 'macAddress ipAddress status lastSeen createdAt')
      .select('-password -refreshTokenHash');

    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ User fetched:', user.studentId);
    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    });

  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// ====== UPDATE USER STATUS (Block/Unblock) ======
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('🔄 Updating user status:', { id, status });

    // Validate status
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "blocked"'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from blocking themselves
    if (String(user._id) === String(req.user.id) && status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'You cannot block yourself'
      });
    }

    user.status = status;
    await user.save();

    console.log(`✅ User ${status === 'blocked' ? 'blocked' : 'unblocked'}:`, user.studentId);

    return res.status(200).json({
      success: true,
      message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      data: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        status: user.status
      }
    });

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// ====== DELETE USER ======
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️  Deleting user:', id);

    const user = await User.findById(id);
    if (!user) {
      console.log('❌ User not found:', id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (String(user._id) === String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    // Delete all associated devices
    await Device.deleteMany({ student: user._id });
    console.log(`🗑️  Deleted ${user.devices.length} associated devices`);

    // Delete user
    await User.findByIdAndDelete(id);
    console.log('✅ User deleted:', user.studentId);

    return res.status(200).json({
      success: true,
      message: 'User and associated devices deleted successfully',
      data: {
        deletedUserId: id,
        deletedDevicesCount: user.devices.length
      }
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// ====== GET ALL DEVICES (with filters) ======
export const getAllDevices = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    console.log('📱 Fetching devices with filters:', { status, search, page, limit });

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { macAddress: { $regex: search, $options: 'i' } },
        { ipAddress: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch devices with populated student info
    const devices = await Device.find(filter)
      .populate('student', 'studentId name email role status')
      .sort({ lastSeen: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const totalDevices = await Device.countDocuments(filter);

    console.log(`✅ Fetched ${devices.length} devices (total: ${totalDevices})`);

    return res.status(200).json({
      success: true,
      message: 'Devices fetched successfully',
      data: {
        devices,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalDevices / Number(limit)),
          totalDevices,
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching devices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch devices',
      error: error.message
    });
  }
};

// ====== GET SINGLE DEVICE BY ID ======
export const getDeviceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching device:', id);

    const device = await Device.findById(id)
      .populate('student', 'studentId name email role status devices');

    if (!device) {
      console.log('❌ Device not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    console.log('✅ Device fetched:', device.macAddress);
    return res.status(200).json({
      success: true,
      message: 'Device fetched successfully',
      data: device
    });

  } catch (error) {
    console.error('❌ Error fetching device:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch device',
      error: error.message
    });
  }
};

// ====== UPDATE DEVICE STATUS (Block/Unblock) ======
export const updateDeviceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('🔄 Updating device status:', { id, status });

    // Validate status
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "blocked"'
      });
    }

    const device = await Device.findById(id);
    if (!device) {
      console.log('❌ Device not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    device.status = status;
    await device.save();

    console.log(`✅ Device ${status === 'blocked' ? 'blocked' : 'unblocked'}:`, device.macAddress);

    return res.status(200).json({
      success: true,
      message: `Device ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
      data: {
        id: device._id,
        macAddress: device.macAddress,
        status: device.status
      }
    });

  } catch (error) {
    console.error('❌ Error updating device status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update device status',
      error: error.message
    });
  }
};

// ====== DELETE DEVICE ======
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️  Deleting device:', id);

    const device = await Device.findById(id);
    if (!device) {
      console.log('❌ Device not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Remove device reference from user's devices array
    await User.findByIdAndUpdate(device.student, {
      $pull: { devices: device._id }
    });
    console.log('🔄 Removed device reference from user');

    // Delete device
    await Device.findByIdAndDelete(id);
    console.log('✅ Device deleted:', device.macAddress);

    return res.status(200).json({
      success: true,
      message: 'Device deleted successfully',
      data: {
        deletedDeviceId: id,
        macAddress: device.macAddress
      }
    });

  } catch (error) {
    console.error('❌ Error deleting device:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete device',
      error: error.message
    });
  }
};

// ====== GET RECENT ACTIVITY (Optional) ======
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    console.log('📋 Fetching recent activity...');

    // Get recently registered users
    const recentUsers = await User.find()
      .select('studentId name createdAt')
      .sort({ createdAt: -1 })
      .limit(Number(limit) / 2);

    // Get recently registered devices
    const recentDevices = await Device.find()
      .populate('student', 'studentId name')
      .select('macAddress ipAddress student createdAt')
      .sort({ createdAt: -1 })
      .limit(Number(limit) / 2);

    // Format activity feed
    const userActivity = recentUsers.map(user => ({
      type: 'user_registered',
      message: `User ${user.studentId} (${user.name}) registered`,
      timestamp: user.createdAt,
      data: { studentId: user.studentId, name: user.name }
    }));

    const deviceActivity = recentDevices.map(device => ({
      type: 'device_registered',
      message: `Device ${device.macAddress} registered by ${device.student?.studentId || 'Unknown'}`,
      timestamp: device.createdAt,
      data: { 
        macAddress: device.macAddress, 
        studentId: device.student?.studentId,
        studentName: device.student?.name 
      }
    }));

    // Combine and sort by timestamp
    const activity = [...userActivity, ...deviceActivity]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, Number(limit));

    console.log(`✅ Fetched ${activity.length} activity items`);

    return res.status(200).json({
      success: true,
      message: 'Recent activity fetched successfully',
      data: activity
    });

  } catch (error) {
    console.error('❌ Error fetching recent activity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
};