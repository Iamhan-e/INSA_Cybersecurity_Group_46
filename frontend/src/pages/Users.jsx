// src/pages/Users.jsx (FIXED)
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';  // ⭐ Import
import { Users as UsersIcon, RefreshCw, Download, UserPlus } from 'lucide-react';  // ⭐ Add UserPlus
import UserFilters from '../components/users/UserFilters';
import UserTable from '../components/users/UserTable';
import UserModal from '../components/users/UserModal';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllUsers, updateUserStatus, deleteUser } from '../api/admin';

const Users = () => {
  const navigate = useNavigate();  // ⭐ Add this INSIDE the component (after the function declaration)
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ... rest of your state variables ...
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
    limit: 10,
    page: 1
  });

  const [searchDebounce, setSearchDebounce] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // ... all your existing functions (fetchUsers, handleFilterChange, etc.) ...

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.role && { role: filters.role }),
        ...(searchDebounce && { search: searchDebounce })
      };

      const result = await getAllUsers(params);

      if (result.success) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.status, filters.role, searchDebounce]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(filters.search);
      setFilters(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleBlockUser = (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    setConfirmAction({
      type: 'block',
      user,
      newStatus,
      title: newStatus === 'blocked' ? 'Block User?' : 'Unblock User?',
      message: `Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} ${user.name} (${user.studentId})?`,
      confirmText: newStatus === 'blocked' ? 'Block' : 'Unblock',
      variant: newStatus === 'blocked' ? 'danger' : 'warning'
    });
    setShowConfirmDialog(true);
  };

  const handleDeleteUser = (user) => {
    setConfirmAction({
      type: 'delete',
      user,
      title: 'Delete User?',
      message: `Are you sure you want to permanently delete ${user.name} (${user.studentId})? This will also delete all associated devices. This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger'
    });
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'block') {
        const result = await updateUserStatus(confirmAction.user._id, confirmAction.newStatus);
        if (result.success) {
          setUsers(prev => 
            prev.map(u => 
              u._id === confirmAction.user._id 
                ? { ...u, status: confirmAction.newStatus }
                : u
            )
          );
          console.log(`✅ User ${confirmAction.newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
        } else {
          setError(result.message);
        }
      } else if (confirmAction.type === 'delete') {
        const result = await deleteUser(confirmAction.user._id);
        if (result.success) {
          fetchUsers();
          console.log('✅ User deleted successfully');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      console.error('Error performing action:', err);
      setError('Action failed');
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ⭐ UPDATED Page Header with Add User button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
          <p className="text-slate-600 mt-1">Manage student accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* ⭐ NEW: Add User Button */}
          <button
            onClick={() => navigate('/users/add')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
          
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pagination.totalUsers}</p>
              <p className="text-sm text-slate-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-sm text-slate-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.status === 'blocked').length}
              </p>
              <p className="text-sm text-slate-600">Blocked</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-sm text-slate-600">Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <UserTable
        users={users}
        onViewDetails={handleViewDetails}
        onBlockUser={handleBlockUser}
        onDeleteUser={handleDeleteUser}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of{' '}
            {pagination.totalUsers} users
          </p>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* User Details Modal */}
      <UserModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        variant={confirmAction?.variant}
      />
    </div>
  );
};

export default Users;