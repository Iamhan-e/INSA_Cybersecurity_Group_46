// src/components/devices/DeviceTable.jsx
import { Eye, Shield, Ban, Trash2, User, Wifi } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, formatMacAddress, formatRelativeTime, isDeviceOnline } from '../../utils/formatters';

const DeviceTable = ({ devices, onViewDetails, onBlockDevice, onDeleteDevice, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="animate-pulse p-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No devices found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">MAC Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Connection</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Last Seen</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Registered</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {devices.map((device) => {
              const online = isDeviceOnline(device.lastSeen);
              return (
                <tr key={device._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-slate-900">
                      {formatMacAddress(device.macAddress)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-mono text-slate-600">
                        {device.ipAddress || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {device.student ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{device.student.name}</p>
                          <p className="text-xs text-slate-500">{device.student.studentId}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={device.status === 'active' ? 'success' : 'danger'}>
                      {device.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${online ? 'bg-success-500 animate-pulse' : 'bg-slate-400'}`}></div>
                      <span className={`text-sm ${online ? 'text-success-700 font-medium' : 'text-slate-500'}`}>
                        {online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-slate-900">{formatRelativeTime(device.lastSeen)}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(device.lastSeen)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDateTime(device.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(device)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onBlockDevice(device)}
                        className={`p-2 rounded-lg transition-colors ${
                          device.status === 'active'
                            ? 'text-warning-600 hover:bg-warning-50'
                            : 'text-success-600 hover:bg-success-50'
                        }`}
                        title={device.status === 'active' ? 'Block device' : 'Unblock device'}
                      >
                        {device.status === 'active' ? <Ban className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDeleteDevice(device)}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Delete device"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTable;