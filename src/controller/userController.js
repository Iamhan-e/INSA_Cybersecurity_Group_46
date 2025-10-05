// controllers/userController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Device from '../models/Device.js';
import dotenv from 'dotenv';

dotenv.config();

// ============================================================
// 🔑 JWT Token Generator
// ============================================================
const signToken = (user) => {
  const payload = { id: user._id, userId: user.userId || user.studentId, role: user.role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

// ============================================================
// 🧍 Register User
// ============================================================
export const register = async (req, res) => {
  try {
    const { userId, studentId, name, email, password, role } = req.body;

    // accept either "studentId" or "userId"
    const identifier = userId || studentId;
    if (!identifier || !name || !password) {
      return res.status(400).json({ success: false, message: 'userId (or studentId), name, and password are required' });
    }

    const existing = await User.findOne({ studentId: identifier });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already registered' });
    }

    const user = await User.create({ studentId: identifier, name, email, password, role });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, studentId: user.studentId, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// ============================================================
// 🔐 Login User
// ============================================================
export const login = async (req, res) => {
  try {
    const { userId, studentId, password, macAddress, ipAddress } = req.body;
    const identifier = userId || studentId;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'userId (or studentId) and password are required' });
    }

    const user = await User.findOne({ studentId: identifier });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'User is blocked' });
    }

    const token = signToken(user);

    // =======================================================
    // 🧩 NAC Integration — Link Device to User
    // =======================================================
    if (macAddress) {
      await Device.findOneAndUpdate(
        { macAddress },
        { ipAddress, owner: user._id, status: 'active', lastSeen: new Date() },
        { upsert: true, new: true }
      );

      // optional: keep device reference in user document
      const device = await Device.findOne({ macAddress });
      if (!user.devices.includes(device._id)) {
        user.devices.push(device._id);
        await user.save();
      }
    }

    // =======================================================
    // 🍪 Send JWT as HTTP-only Cookie (optional but secure)
    // =======================================================
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, studentId: user.studentId, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// ============================================================
// 🚪 Logout (optional helper)
// ============================================================
export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ============================================================
// 🧾 Example Role Authorization Middleware
// ============================================================
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
  }
  next();
};
