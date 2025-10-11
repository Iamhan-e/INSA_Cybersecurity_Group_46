import Device from '../models/Device.js';
import User from '../models/User.js';

import jwt from 'jsonwebtoken';


// Device registration (uses JWT auth but keeps your validations)
export const registerDevice = async (req, res) => {
  try {
    // --- 1️⃣ Ensure user is authenticated ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret');
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const studentId = decoded.studentId;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID missing from token' });
    }

    // --- 2️⃣ Validate request body ---
    const { macAddress, ipAddress } = req.body;
    if (!macAddress) {
      return res.status(400).json({ success: false, message: 'macAddress is required' });
    }

    // --- 3️⃣ Check that student exists ---
    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // --- 4️⃣ Check device limit ---
    const userDevices = await Device.find({ student: student._id });
    if (userDevices.length >= 5) {
      return res.status(403).json({
        success: false,
        message: 'Device limit reached. You can register up to 5 devices.'
      });
    }

    // --- 5️⃣ Prevent duplicates ---
    const existing = await Device.findOne({ macAddress });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Device already registered' });
    }

    // --- 6️⃣ Register new device ---
    const device = await Device.create({
      macAddress,
      ipAddress,
      student: student._id,
    });

    student.devices.push(device._id);
    await student.save();

    return res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      data: {
        id: device._id,
        macAddress: device.macAddress,
        ipAddress: device.ipAddress,
        student: student._id,
      },
    });
  } catch (error) {
    console.error('Device registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Device registration failed',
      error: error.message,
    });
  }
};


export const listDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('student', 'studentId name email role status');
    return res.status(200).json({ success: true, message: 'Devices fetched', data: devices });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch devices', error: error.message });
  }
};


