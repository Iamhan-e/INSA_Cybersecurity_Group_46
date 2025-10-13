// src/components/devices/DeviceModal.jsx
import { X, Smartphone, Wifi, Calendar, User, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, formatMacAddress, formatRelativeTime, isDeviceOnline } from '../../utils/formatters';

const DeviceModal = ({ device, isOpen, onClose }) => {
  if (!isOpen || !device) return null;

  const online = isDeviceOnline(device.lastSeen);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Device Details</h3>
            <p className="text-sm text-slate-600 mt-1 font-mono">{formatMacAddress(device.macAddress)}</p>
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
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${online ? 'bg-success-500 animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-sm font-medium text-slate-700">
                {online ? 'Online' : 'Offline'}
              </span>
            </div>
            <Badge variant={device.status === 'active' ? 'success' : 'danger'}>
              {device.status}
            </Badge>
          </div>

          {/* Device Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">Device Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  MAC Address
                </p>
                <p className="text-sm font-mono font-medium text-slate-900">
                  {formatMacAddress(device.macAddress)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  IP Address
                </p>
                <p className="text-sm font-mono font-medium text-slate-900">
                  {device.ipAddress || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last Seen
                </p>
                <p className="text-sm text-slate-900">
                  {formatRelativeTime(device.lastSeen)}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDateTime(device.lastSeen)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Registered
                </p>
                <p className="text-sm text-slate-900">
                  {formatDateTime(device.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          {device.student && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">Device Owner</h4>
              <div className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{device.student.name}</p>
                      <p className="text-xs text-slate-600">{device.student.studentId}</p>
                    </div>
                  </div>
                  <Badge variant={device.student.role === 'admin' ? 'primary' : 'default'}>
                    {device.student.role}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Email:</span>
                    <p className="text-slate-900 font-medium">{device.student.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <div className="mt-1">
                      <Badge variant={device.student.status === 'active' ? 'success' : 'danger'} size="sm">
                        {device.student.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connection History (if available) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">Connection Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">First Connected</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatDateTime(device.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Last Activity</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatRelativeTime(device.lastSeen)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Current Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${online ? 'bg-success-500' : 'bg-slate-400'}`}></div>
                  <span className="text-sm font-medium text-slate-900">
                    {online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
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

export default DeviceModal;