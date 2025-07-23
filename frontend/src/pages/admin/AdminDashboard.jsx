import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/AdminDashboard/DashboardLayout';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalSchedules: 0,
    pendingLeaves: 0,
    charts: {
      subjectsDistribution: {},
      weeklyLoad: {},
      leaveStatusDistribution: {},
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/stats');
        setStats(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch admin statistics.');
        setStats({
          totalTeachers: 12,
          totalSchedules: 150,
          pendingLeaves: 3,
          charts: {
            subjectsDistribution: { Math: 10, Science: 8, English: 12, History: 5 },
            weeklyLoad: { Mon: 30, Tue: 25, Wed: 35, Thu: 28, Fri: 32 },
            leaveStatusDistribution: { Pending: 3, Approved: 10, Rejected: 1 }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-r from-indigo-50 to-white min-h-screen transition-all duration-300">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-10">
        Admin Dashboard
      </h1>
      <DashboardLayout stats={stats} />
    </div>
  );
};

export default AdminDashboard;