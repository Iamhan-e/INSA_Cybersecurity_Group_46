// controllers/userController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Device from '../models/Device.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES;
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
};

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
    
    // Validation
    if (!studentId || !name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'studentId, name and password are required' 
      });
    }
    
    // Password strength check
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain both letters and numbers' 
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ studentId });
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this Student ID already exists' 
      });
    }

    // Create user
    const user = await User.create({ 
      studentId, 
      name, 
      email, 
      password,  // Will be hashed by pre-save hook
      role: role || 'student'  // Default to student if not specified
    });
    
    console.log('✅ User registered:', studentId, 'Role:', user.role);
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { 
        id: user._id, 
        studentId: user.studentId, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { studentId, password, macAddress, ipAddress, isRandomizedMAC } = req.body;
    
    console.log('🔐 Login attempt:', { studentId, macAddress, ipAddress, isRandomizedMAC, userAgent: req.headers['user-agent'] });
    
    // ⚠️  REJECT RANDOMIZED MACs
    if (isRandomizedMAC === true) {
      console.log('⚠️  Randomized MAC detected - rejecting login');
      return res.status(403).json({ 
        success: false, 
        message: 'Randomized MAC addresses are not allowed. Please disable MAC randomization for this network and reconnect.' 
      });
    }

    // ✅ Validate required fields
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'studentId and password are required' });
    }

    // ✅ Find user
    const user = await User.findOne({ studentId });
    if (!user) {
      console.log('❌ User not found:', studentId);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ✅ Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', studentId);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('✅ Password validated for user:', studentId);

    // ✅ Check if user is blocked
    if (user.status === 'blocked') {
      console.log('⛔ Blocked user attempted login:', studentId);
      return res.status(403).json({ success: false, message: 'User account is blocked' });
    }

    // ✅ Handle device registration (if MAC address provided)
    if (macAddress) {
      console.log('📱 Processing device registration for MAC:', macAddress);
      
      // Check if device already exists
      let device = await Device.findOne({ macAddress });
      
      if (!device) {
        // NEW DEVICE - Check if user has reached device limit
        const userDevicesCount = user.devices?.length || 0;
        if (userDevicesCount >= MAX_DEVICES_PER_USER) {
          console.log(`⛔ Device limit exceeded for user ${studentId}: ${userDevicesCount}/${MAX_DEVICES_PER_USER}`);
          return res.status(403).json({ 
            success: false, 
            message: `Device limit exceeded. Maximum ${MAX_DEVICES_PER_USER} devices allowed.` 
          });
        }

        // Create new device
        console.log('✅ Creating new device:', macAddress);
        device = await Device.create({ 
          macAddress, 
          ipAddress, 
          student: user._id,
          lastSeen: new Date()
        });
        
        // Prevent duplicates in user.devices array
        if (!user.devices.includes(device._id)) {
          user.devices.push(device._id);
          await user.save();
        }
        console.log(`✅ Device registered and linked to user ${studentId}`);
        
      } else {
        // EXISTING DEVICE
        console.log('ℹ️  Device already exists:', macAddress);
        
        // Check if device is blocked
        if (device.status === 'blocked') {
          console.log('⛔ Blocked device attempted access:', macAddress);
          return res.status(403).json({ 
            success: false, 
            message: 'This device has been blocked. Please contact administrator.' 
          });
        }
        
        // Check if device belongs to a different user
        if (String(device.student) !== String(user._id)) {
          console.log('⚠️  Device belongs to different user, attempting to reassign...');
          
          // Remove device from old user's array
          const oldUserId = device.student;
          await User.findByIdAndUpdate(oldUserId, {
            $pull: { devices: device._id }
          });
          console.log(`🔄 Removed device from old user ${oldUserId}`);
          
          // Check if current user has space for this device
          const userDevicesCount = user.devices?.length || 0;
          if (userDevicesCount >= MAX_DEVICES_PER_USER) {
            console.log(`⛔ Cannot reassign: user ${studentId} at device limit`);
            return res.status(403).json({ 
              success: false, 
              message: `Device limit exceeded. Maximum ${MAX_DEVICES_PER_USER} devices allowed.` 
            });
          }

          // Reassign device to new user
          device.student = user._id;
          if (ipAddress) device.ipAddress = ipAddress;
          device.lastSeen = new Date();
          await device.save();
          
          // Check for duplicates before adding
          if (!user.devices.includes(device._id)) {
            user.devices.push(device._id);
            await user.save();
          }
          console.log(`✅ Device reassigned to user ${studentId}`);
          
        } else {
          // Device already belongs to this user - just update lastSeen and IP
          console.log('✅ Device already linked to this user, updating lastSeen');
          device.lastSeen = new Date();
          if (ipAddress) device.ipAddress = ipAddress;
          await device.save();
        }
      }
    } else {
      console.log('ℹ️  No MAC address provided, skipping device registration');
    }

    // ✅ Generate tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // ✅ Store refresh token hash
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await user.save();
    
    // ✅ Set refresh token cookie
    setRefreshCookie(res, refreshToken);

    console.log('✅ Login successful for user:', studentId, 'Role:', user.role);

    // ✅ Return success with role information
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: { 
          id: user._id, 
          studentId: user.studentId, 
          name: user.name, 
          email: user.email, 
          role: user.role  // ⭐ ESP32 uses this to decide redirect
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
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

    // Rotate tokens: issue new refresh, store hash, set cookie, and return new access
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
  // Clear cookie and invalidate stored hash
  if (req.user?.id) {
    // Best-effort async clear; not awaiting to keep logout snappy
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
    const user = await User.findById(req.user.id).populate('devices', 'macAddress ipAddress status lastSeen');
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