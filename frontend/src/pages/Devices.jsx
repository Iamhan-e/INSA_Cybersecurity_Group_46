// src/pages/Devices.jsx
import { useState, useEffect, useCallback } from 'react';
import { Smartphone, RefreshCw, Wifi } from 'lucide-react';
import DeviceFilters from '../components/devices/DeviceFilters';
import DeviceTable from '../components/devices/DeviceTable';
import DeviceModal from '../components/devices/DeviceModal';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllDevices, updateDeviceStatus, deleteDevice } from '../api/admin';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDevices: 0,
    limit: 10
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    limit: 10,
    page: 1
  });

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState('');

  // Modal states
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch devices
  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.status && { status: filters.status }),
        ...(searchDebounce && { search: searchDebounce })
      };

      const result = await getAllDevices(params);

      if (result.success) {
        setDevices(result.data.devices);
        setPagination(result.data.pagination);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.status, searchDebounce]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(filters.search);
      setFilters(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to page 1 when filters change
    }));
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // View device details
  const handleViewDetails = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  // Block/Unblock device
  const handleBlockDevice = (device) => {
    const newStatus = device.status === 'active' ? 'blocked' : 'active';
    setConfirmAction({
      type: 'block',
      device,
      newStatus,
      title: newStatus === 'blocked' ? 'Block Device?' : 'Unblock Device?',
      message: `Are you sure you want to ${newStatus === 'blocked' ? 'block' : 'unblock'} device ${device.macAddress}?`,
      confirmText: newStatus === 'blocked' ? 'Block' : 'Unblock',
      variant: newStatus === 'blocked' ? 'danger' : 'warning'
    });
    setShowConfirmDialog(true);
  };

  // Delete device
  const handleDeleteDevice = (device) => {
    setConfirmAction({
      type: 'delete',
      device,
      title: 'Delete Device?',
      message: `Are you sure you want to permanently delete device ${device.macAddress}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'danger'
    });
    setShowConfirmDialog(true);
  };

  // Confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'block') {
        const result = await updateDeviceStatus(confirmAction.device._id, confirmAction.newStatus);
        if (result.success) {
          // Update local state
          setDevices(prev => 
            prev.map(d => 
              d._id === confirmAction.device._id 
                ? { ...d, status: confirmAction.newStatus }
                : d
            )
          );
          console.log(`✅ Device ${confirmAction.newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
        } else {
          setError(result.message);
        }
      } else if (confirmAction.type === 'delete') {
        const result = await deleteDevice(confirmAction.device._id);
        if (result.success) {
          // Refresh the list
          fetchDevices();
          console.log('✅ Device deleted successfully');
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

  // Calculate online devices (last seen within 5 minutes)
  const onlineDevices = devices.filter(d => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(d.lastSeen) > fiveMinutesAgo;
  }).length;

  if (loading && devices.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading devices..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Devices Management</h1>
          <p className="text-slate-600 mt-1">Monitor and manage registered devices</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDevices}
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
              <Smartphone className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{pagination.totalDevices}</p>
              <p className="text-sm text-slate-600">Total Devices</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {devices.filter(d => d.status === 'active').length}
              </p>
              <p className="text-sm text-slate-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {devices.filter(d => d.status === 'blocked').length}
              </p>
              <p className="text-sm text-slate-600">Blocked</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{onlineDevices}</p>
              <p className="text-sm text-slate-600">Online Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DeviceFilters
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

      {/* Devices Table */}
      <DeviceTable
        devices={devices}
        onViewDetails={handleViewDetails}
        onBlockDevice={handleBlockDevice}
        onDeleteDevice={handleDeleteDevice}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && devices.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalDevices)} of{' '}
            {pagination.totalDevices} devices
          </p>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Device Details Modal */}
      <DeviceModal
        device={selectedDevice}
        isOpen={showDeviceModal}
        onClose={() => {
          setShowDeviceModal(false);
          setSelectedDevice(null);
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

export default Devices;