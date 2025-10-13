import { X, Mail, User, Smartphone, Calendar, Shield } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, formatMacAddress } from '../../utils/formatters';

const UserModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">User Details</h3>
            <p className="text-sm text-slate-600 mt-1">{user.studentId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Student ID</p>
                <p className="text-sm font-medium text-slate-900">{user.studentId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="text-sm font-medium text-slate-900">{user.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Role</p>
                <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                  {user.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Registered</p>
                <p className="text-sm text-slate-900">{formatDateTime(user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">
              Registered Devices ({user.devices?.length || 0}/5)
            </h4>
            {user.devices && user.devices.length > 0 ? (
              <div className="space-y-3">
                {user.devices.map((device) => (
                  <div
                    key={device._id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-mono font-medium text-slate-900">
                          {formatMacAddress(device.macAddress)}
                        </span>
                      </div>
                      <Badge variant={device.status === 'active' ? 'success' : 'danger'}>
                        {device.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="font-medium">IP:</span> {device.ipAddress || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Last Seen:</span> {formatDateTime(device.lastSeen)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Smartphone className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p>No devices registered</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;