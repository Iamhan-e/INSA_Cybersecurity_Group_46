// src/components/users/UserTable.jsx (UPDATED)
import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Shield, Ban, Trash2, Smartphone } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

const UserTable = ({ users, onViewDetails, onBlockUser, onDeleteUser, loading }) => {
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

  const toggleDropdown = (userId, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  const handleAction = (action, user, event) => {
    event.stopPropagation();
    setOpenDropdown(null);
    action(user);
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

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-slate-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Devices</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Registered</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {users.map((user) => (
              <tr 
                key={user._id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onViewDetails(user)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">{user.studentId}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{user.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{user.email || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Smartphone className="w-4 h-4" />
                    <span>{user.devices?.length || 0}/5</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{formatDateTime(user.createdAt)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="relative inline-block" ref={openDropdown === user._id ? dropdownRef : null}>
                    <button
                      onClick={(e) => toggleDropdown(user._id, e)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === user._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                        {/* View Details */}
                        <button
                          onClick={(e) => handleAction(onViewDetails, user, e)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>

                        {/* Block/Unblock */}
                        <button
                          onClick={(e) => handleAction(onBlockUser, user, e)}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 flex items-center gap-3 ${
                            user.status === 'active' ? 'text-warning-600' : 'text-success-600'
                          }`}
                        >
                          {user.status === 'active' ? (
                            <>
                              <Ban className="w-4 h-4" />
                              <span>Block User</span>
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              <span>Unblock User</span>
                            </>
                          )}
                        </button>

                        {/* Divider */}
                        <div className="border-t border-slate-200 my-1"></div>

                        {/* Delete */}
                        <button
                          onClick={(e) => handleAction(onDeleteUser, user, e)}
                          className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-3"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete User</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;