// controllers/userController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Device from '../models/Device.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES || (isProd ? '15m' : '30m');
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES || '7d';
const MAX_DEVICES_PER_USER = Number(process.env.MAX_DEVICES_PER_USER || 5);

const isStrongPassword = (pwd) => {
  if (typeof pwd !== 'string') return false;
  if (pwd.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  return hasLetter && hasNumber;
};

const createAccessToken = (user) => {
  const payload = { id: user._id, studentId: user.studentId, role: user.role };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
};

const createRefreshToken = (user) => {
  const payload = { id: user._id, tokenType: 'refresh' };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

const setRefreshCookie = (res, token) => { 
  const oneDayMs = 24 * 60 * 60 * 1000;
  const maxAge = 7 * oneDayMs;
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge
  });
};//secure HTTP-only cookie on the client's browser.

const getTokenFromHeader = (req) => {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
};

export const requireAuth = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ success: false, message: 'Missing access token' });
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = { id: decoded.id, role: decoded.role, studentId: decoded.studentId };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Not authorized to perform this action' });
  }
  next();
};

export const register = async (req, res) => {
  try {
    const { studentId, name, email, password, role } = req.body;
    if (!studentId || !name || !password) {
      return res.status(400).json({ success: false, message: 'studentId, name and password are required' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 chars and include letters and numbers' });
    }

    const existing = await User.findOne({ studentId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ studentId, name, email, password, role });
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, studentId: user.studentId, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { studentId, password, macAddress, ipAddress } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'studentId and password are required' });
    }

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'The user already exists' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'The password is incorrect' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'User is blocked' });
    }

    // Integrate device logic + enforce device cap
    if (macAddress) {
      let device = await Device.findOne({ macAddress });
      const userDevicesCount = user.devices?.length || 0;

      if (!device) {
        if (userDevicesCount >= MAX_DEVICES_PER_USER) {
          return res.status(403).json({ success: false, message: `Device limit exceeded (${MAX_DEVICES_PER_USER})` });
        }
        device = await Device.create({ macAddress, ipAddress, student: user._id });
        user.devices.push(device._id);
        await user.save();
        device.lastSeen = Date.now(); 
        await device.save();

      } else if (String(device.student) !== String(user._id)) {
        // Only attach if not already attached; still enforce cap
        if (!user.devices.some(d => String(d) === String(device._id))) {
          if (userDevicesCount >= MAX_DEVICES_PER_USER) {
            return res.status(403).json({ success: false, message: `Device limit exceeded (${MAX_DEVICES_PER_USER})` });
          }
          device.student = user._id;
          if (ipAddress) device.ipAddress = ipAddress;
          await device.save();
          user.devices.push(device._id);
          await user.save();
        }
      } else if (ipAddress) {
        device.ipAddress = ipAddress;
        await device.save();
      }
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: { id: user._id, studentId: user.studentId, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.status === 'blocked') {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

      const match = user.refreshTokenHash && await bcrypt.compare(token, user.refreshTokenHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // rotate tokens: issue new refresh, store hash, set cookie, and return new access
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
    await user.save();
    setRefreshCookie(res, newRefreshToken);
    return res.status(200).json({ success: true, message: 'Token refreshed', data: { accessToken: newAccessToken } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Refresh failed', error: error.message });
  }
};

export const logout = (req, res) => {

  // clear cookie and invalidate stored hash
  if (req.user?.id) {
    // best-effort async clear; not awaiting to keep logout snappy
    User.findByIdAndUpdate(req.user.id, { $set: { refreshTokenHash: null } }).catch(() => {});
  }
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',   
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('devices', 'macAddress ipAddress status');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({
      success: true,
      message: 'Profile fetched',
      data: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
        devices: user.devices
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};
