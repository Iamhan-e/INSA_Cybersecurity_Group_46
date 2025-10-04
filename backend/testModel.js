// ...existing code...
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Device from './models/Device.js';

async function testModels() {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 2️⃣ Create a sample user
    const sampleUser = new User({
      studentId: 'S12347',
      name: 'John Does',
      password: 'password123', // should be hashed automatically
    });

    await sampleUser.save();
    console.log('✅ User saved:', sampleUser);

    // Verify password is hashed
    const isMatch = await bcrypt.compare('password123', sampleUser.password);
    console.log('✅ Password hashing works:', isMatch);

    // 3️⃣ Create a sample device linked to the user
    const sampleDevice = new Device({
      macAddress: 'AA:BB:CC:DD:EE:GG',
      student: sampleUser._id,
    });

    await sampleDevice.save();
    console.log('✅ Device saved:', sampleDevice);

    // 4️⃣ Fetch user with devices
    const userWithDevices = await User.findById(sampleUser._id).populate('devices');
    console.log('✅ User with devices:', userWithDevices);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testModels();
// ...existing code...