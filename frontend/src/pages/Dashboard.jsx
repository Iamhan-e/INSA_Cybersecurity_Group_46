import { useState, useEffect } from 'react';
import { Users, Smartphone, Activity as ActivityIcon, TrendingUp } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getStats, getRecentActivity } from '../api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and activity in parallel
      const [statsResult, activityResult] = await Promise.all([
        getStats(),
        getRecentActivity(20)
      ]);

      if (statsResult.success) {
        setStats(statsResult.data);
      } else {
        setError(statsResult.message);
      }

      if (activityResult.success) {
        setActivity(activityResult.data);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-danger-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor your network access control system</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.users?.total || 0}
          subtitle={`${stats?.users?.active || 0} active, ${stats?.users?.blocked || 0} blocked`}
          icon={Users}
          color="primary"
          trend={stats?.users?.recentlyRegistered > 0 ? 'up' : 'neutral'}
          trendValue={stats?.users?.recentlyRegistered > 0 ? `+${stats?.users?.recentlyRegistered} this week` : null}
        />

        <StatsCard
          title="Total Devices"
          value={stats?.devices?.total || 0}
          subtitle={`${stats?.devices?.active || 0} active, ${stats?.devices?.blocked || 0} blocked`}
          icon={Smartphone}
          color="accent"
          trend={stats?.devices?.recentlyRegistered > 0 ? 'up' : 'neutral'}
          trendValue={stats?.devices?.recentlyRegistered > 0 ? `+${stats?.devices?.recentlyRegistered} this week` : null}
        />

        <StatsCard
          title="Recently Active"
          value={stats?.devices?.recentlyActive || 0}
          subtitle="Devices active in last 24h"
          icon={ActivityIcon}
          color="success"
        />

        <StatsCard
          title="New This Week"
          value={(stats?.users?.recentlyRegistered || 0) + (stats?.devices?.recentlyRegistered || 0)}
          subtitle="Users and devices"
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Activity Feed and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed activities={activity} loading={loading} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Top Users Table (Optional) */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Users by Device Count</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Devices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.topUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900 font-medium">{user.studentId}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-slate-900 font-semibold text-right">{user.deviceCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

