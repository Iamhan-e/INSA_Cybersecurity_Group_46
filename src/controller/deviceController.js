import Device from '../models/Device.js';
import User from '../models/User.js';

export const registerDevice = async (req, res) => {
  try {
    const { macAddress, ipAddress, studentId } = req.body;
    if (!macAddress || !studentId) {
      return res.status(400).json({ success: false, message: 'macAddress and studentId are required' });
    }

    const existing = await Device.findOne({ macAddress });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Device already registered' });
    }

    const student = await User.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const device = await Device.create({ macAddress, ipAddress, student: student._id });
    // Link device to user
    student.devices.push(device._id);
    await student.save();

    return res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      data: { id: device._id, macAddress: device.macAddress, ipAddress: device.ipAddress, student: student._id }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Device registration failed', error: error.message });
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


