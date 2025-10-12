// routes/adminRoutes.js
import { Router } from 'express';
import { requireAuth, authorizeRoles } from '../controller/userController.js';
import {
  getStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAllDevices,
  getDeviceById,
  updateDeviceStatus,
  deleteDevice,
  getRecentActivity
} from '../controller/adminController.js';

const router = Router();

// ====== ALL ROUTES REQUIRE ADMIN AUTHENTICATION ======
// Apply middleware to all admin routes
router.use(requireAuth);
router.use(authorizeRoles('admin'));

// ====== DASHBOARD STATISTICS ======
router.get('/stats', getStats);

// ====== USER MANAGEMENT ======
router.get('/users', getAllUsers);              // Get all users (with filters, pagination)
router.get('/users/:id', getUserById);          // Get single user by ID
router.put('/users/:id/status', updateUserStatus); // Block/Unblock user
router.delete('/users/:id', deleteUser);        // Delete user

// ====== DEVICE MANAGEMENT ======
router.get('/devices', getAllDevices);          // Get all devices (with filters, pagination)
router.get('/devices/:id', getDeviceById);      // Get single device by ID
router.put('/devices/:id/status', updateDeviceStatus); // Block/Unblock device
router.delete('/devices/:id', deleteDevice);    // Delete device

// ====== ACTIVITY LOG (Optional) ======
router.get('/activity', getRecentActivity);     // Get recent activity feed

export default router;