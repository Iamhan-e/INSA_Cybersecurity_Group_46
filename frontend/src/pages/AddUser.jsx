import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { registerUser } from '../api/admin';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.studentId || !formData.name || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Validate student ID format (alphanumeric, 3-20 chars)
    if (!/^[A-Za-z0-9]{3,20}$/.test(formData.studentId)) {
      setError('Student ID must be 3-20 alphanumeric characters');
      return false;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      setError('Password must contain both letters and numbers');
      return false;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await registerUser({
        studentId: formData.studentId,
        name: formData.name,
        email: formData.email || undefined,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        setSuccess(`User ${formData.studentId} created successfully!`);
        
        // Reset form
        setFormData({
          studentId: '',
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        });

        // Redirect to users page after 2 seconds
        setTimeout(() => {
          navigate('/users');
        }, 2000);
      } else {
        setError(result.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add New User</h1>
          <p className="text-slate-600 mt-1">Create a new user account for network access</p>
        </div>
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Users</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success-900">{success}</p>
                <p className="text-xs text-success-700 mt-1">Redirecting to users page...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}

          {/* Student ID */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-2">
              Student ID <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., S123456"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
              required
            />
            <p className="text-xs text-slate-500 mt-1">3-20 alphanumeric characters</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
              required
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
              Role <span className="text-danger-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Admins can access the dashboard, students can only access network
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Must be at least 8 characters with letters and numbers
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password <span className="text-danger-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:bg-slate-100"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span>Creating User...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create User</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/users')}
              disabled={loading}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Help Card */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-2xl">
        <h3 className="text-sm font-semibold text-primary-900 mb-2">ℹ️ User Login Process</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Users will login through the <strong>ESP32 captive portal</strong> when connecting to WiFi</li>
          <li>• Their device MAC address will be automatically registered</li>
          <li>• Each user can register up to <strong>5 devices</strong></li>
          <li>• Students get network access, admins can also access this dashboard</li>
        </ul>
      </div>
    </div>
  );
};

export default AddUser;