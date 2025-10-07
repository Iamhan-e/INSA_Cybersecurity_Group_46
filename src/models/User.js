import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'admin']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'blocked']
  },

  role: {
    type: String,
    default: 'user',
    enum: ['user', 'operator', 'admin']
  },

  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
}, {
  timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds = 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
