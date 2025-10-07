import { Router } from 'express';
import { register, login, refresh, logout, getProfile, requireAuth, authorizeRoles } from '../controller/userController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected profile route
router.get('/profile', requireAuth, getProfile);

// Example admin-only route (placeholder)
router.get('/admin/check', requireAuth, authorizeRoles('admin'), (req, res) => {
  return res.json({ success: true, message: 'Admin access OK' });
});

export default router;


