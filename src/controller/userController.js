import jwt from 'jsonwebtoken';
import User from './models/User.js';

const signToken = (user) => {
  const payload = { id: user._id, studentId: user.studentId, role: user.role };
  const secret = process.env.JWT_SECRET ;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

export const register = async (req, res) => {
  try {
    const { studentId, name, email, password, role } = req.body;

    if (!studentId || !name || !password) {
      return res.status(400).json({ success: false, message: 'studentId, name and password are required' });
    }

    const existing = await User.findOne({ studentId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student already registered' });
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
    const { studentId, password } = req.body;
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'studentId and password are required' });
    }

    const user = await User.findOne({ studentId });
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


