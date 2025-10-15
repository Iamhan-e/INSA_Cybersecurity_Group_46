// src/components/devices/DeviceTable.jsx (UPDATED)
import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Shield, Ban, Trash2, User, Wifi } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, formatMacAddress, formatRelativeTime, isDeviceOnline } from '../../utils/formatters';

const DeviceTable = ({ devices, onViewDetails, onBlockDevice, onDeleteDevice, loading }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (deviceId, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === deviceId ? null : deviceId);
  };

  const handleAction = (action, device, event) => {
    event.stopPropagation();
    setOpenDropdown(null);
    action(device);
  };

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
                <tr 
                  key={device._id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetails(device)}
                >
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
                    <div className="relative inline-block" ref={openDropdown === device._id ? dropdownRef : null}>
                      <button
                        onClick={(e) => toggleDropdown(device._id, e)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === device._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                          {/* View Details */}
                          <button
                            onClick={(e) => handleAction(onViewDetails, device, e)}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>

                          {/* Block/Unblock */}
                          <button
                            onClick={(e) => handleAction(onBlockDevice, device, e)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-3 ${
                              device.status === 'active' ? 'text-warning-600' : 'text-success-600'
                            }`}
                          >
                            {device.status === 'active' ? (
                              <>
                                <Ban className="w-4 h-4" />
                                <span>Block Device</span>
                              </>
                            ) : (
                              <>
                                <Shield className="w-4 h-4" />
                                <span>Unblock Device</span>
                              </>
                            )}
                          </button>

                          {/* Divider */}
                          <div className="border-t border-slate-200 my-1"></div>

                          {/* Delete */}
                          <button
                            onClick={(e) => handleAction(onDeleteDevice, device, e)}
                            className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-3"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Device</span>
                          </button>
                        </div>
                      )}
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