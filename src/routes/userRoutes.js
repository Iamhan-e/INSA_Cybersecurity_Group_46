
import { Router } from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  getProfile,
  requireAuth,
  authorizeRoles
} from '../controller/userController.js';

const router = Router();

// ====== PUBLIC ROUTES ======
router.post('/login', login);
router.post('/refresh', refresh);

// ====== ADMIN-ONLY REGISTRATION ======
// ⭐ Admins can register new users
router.post('/register', requireAuth, authorizeRoles('admin'), register);

// ====== PROTECTED ROUTES ======
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);

export default router;