import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  macAddress: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: false
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'blocked']
  }
}, {
  timestamps: true
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
