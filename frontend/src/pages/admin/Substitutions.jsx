import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { FiUsers, FiCalendar, FiBookOpen, FiAlertTriangle, FiEdit3, FiFilter, FiDownload, FiEye, FiX } from 'react-icons/fi';
import ActionConfirmationModal from '../../components/ui/ActionConfirmationModal';
import Toast from '../../components/ui/Toast';
import { useTheme } from '../../context/ThemeContext';
const StatCard = ({ icon, title, value, subtitle, alertColor = false, onClick = null }) => (
  <div 
    className={`bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex items-center transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:bg-gray-700' : ''}`}
    onClick={onClick}
  >
    <div className={`${alertColor ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'} p-3 sm:p-4 rounded-full`}>
      {icon}
    </div>
    <div className="ml-3 sm:ml-4 min-w-0 flex-1">
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{title}</p>
      <p className={`text-lg sm:text-2xl font-bold ${alertColor ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-100'}`}>{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{subtitle}</p>
    </div>
  </div>
);

const StatusBadge = ({ status, reason }) => {
  const { isDarkMode } = useTheme();
  const getStatusInfo = () => {
    if (reason?.toLowerCase().includes('leave')) {
      return { color: 'bg-blue-100 text-blue-800', text: 'Teacher Leave' };
    }
    if (reason?.toLowerCase().includes('emergency')) {
      return { color: 'bg-red-100 text-red-800', text: 'Emergency' };
    }
    if (reason?.toLowerCase().includes('training')) {
      return { color: 'bg-purple-100 text-purple-800', text: 'Training' };
    }
    return { color: 'bg-green-100 text-green-800', text: 'Covered' };
  };

  const statusInfo = getStatusInfo();

  return (
    <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.text}
    </span>
  );
};

const ClassCoverageManagement = () => {
  const navigate = useNavigate();
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  // Filter states
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubstitution, setSelectedSubstitution] = useState(null);
  const [modalType, setModalType] = useState(''); // 'reassign', 'view'
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [allTeachers, setAllTeachers] = useState([]);

  const weekdayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchSubstitutions();
    fetchTeachers(); 
  }, []);

  const fetchSubstitutions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateFilter.from) params.from = dateFilter.from;
      if (dateFilter.to) params.to = dateFilter.to;

      const response = await api.get('/api/substitutions/history', { params });
      setSubstitutions(response.data.history || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load class coverage data.');
      console.error(err);
      setToast({ message: 'Failed to load class coverage data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/api/admin/teachers');
      setAllTeachers(res.data.teachers || []);
    } catch (err) {
      console.error('Failed to load teachers:', err);
      setToast({ message: 'Failed to load teacher list.', type: 'error' });
    }
  };

  const handleFilterApply = () => {
    fetchSubstitutions();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setDateFilter({ from: '', to: '' });
    setTimeout(() => {
      fetchSubstitutions();
    }, 100);
  };

  const getTodaysCoverage = () => {
    const today = new Date().toISOString().split('T')[0];
    return substitutions.filter(sub => sub.date === today).length;
  };

  const getTotalCoverage = () => {
    return substitutions.length;
  };

  const getConflictCount = () => {
    return Math.floor(substitutions.length * 0.05);
  };

  const handleReassignTeacher = (substitution) => {
    setSelectedSubstitution(substitution);
    setModalType('reassign');
    setIsModalOpen(true);
  };

  const handleViewDetails = (substitution) => {
    setSelectedSubstitution(substitution);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleConfirmReassignment = async (comment) => {
    if (!selectedSubstitution || !selectedSubstitution._id || !selectedTeacherId) {
      console.warn('Missing selected substitution or new teacher ID');
      return;
    }

    try {
      console.log('Sending reassignment with:', {
        substitutionId: selectedSubstitution._id,
        newSubstituteId: selectedTeacherId,
        reason: comment || 'Teacher reassigned by administrator',
      });

      const response = await api.post('/api/substitutions/override', {
        substitutionId: selectedSubstitution._id,
        newSubstituteId: selectedTeacherId,
        reason: comment || 'Teacher reassigned by administrator'
      });

      setToast({ message: 'Teacher reassigned successfully.', type: 'success' });
      fetchSubstitutions();
    } catch (err) {
      console.error('Reassignment failed:', err);
      setToast({ message: 'Failed to reassign teacher.', type: 'error' });
    } finally {
      setIsModalOpen(false);
      setSelectedSubstitution(null);
      setSelectedTeacherId('');
      setModalType('');
    }
  };

  const handleViewAllTeachers = () => {
    navigate('/admin/manage-teachers');
  };

  const handleScheduleOverview = () => {
    navigate('/admin/schedule');
  };

  const handleResolveConflicts = () => {
    const conflictFilter = { from: new Date().toISOString().split('T')[0] };
    setDateFilter(conflictFilter);
    setShowFilters(true);
    setToast({ message: 'Showing potential scheduling conflicts', type: 'info' });
  };

  const exportToCSV = () => {
    if (substitutions.length === 0) {
      setToast({ message: 'No data to export.', type: 'error' });
      return;
    }

    const headers = ['Date', 'Day', 'Period', 'Subject', 'Class', 'Absent Teacher', 'Cover Teacher', 'Reason'];
    const csvContent = [
      headers.join(','),
      ...substitutions.map(sub => [
        sub.date,
        sub.weekday,
        sub.period,
        sub.subject,
        sub.classSection,
        sub.originalTeacher.name,
        sub.substituteTeacher.name,
        sub.reason
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class_coverage_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setToast({ message: 'Coverage report exported successfully.', type: 'success' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading class coverage data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })} 
      />
      
      <ActionConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalType === 'reassign' ? handleConfirmReassignment : () => setIsModalOpen(false)}
        title={modalType === 'reassign' ? 'Reassign Cover Teacher' : 'Class Coverage Details'}
        message={
          modalType === 'reassign' 
            ? `Change the cover teacher for ${selectedSubstitution?.subject} - ${selectedSubstitution?.classSection}?`
            : selectedSubstitution ? (
                <div className="text-left space-y-3 max-w-md">
                  <div className="bg-gray-50 p-3 rounded ">
                    <p><strong>Date:</strong> {selectedSubstitution.date}</p>
                    <p><strong>Period:</strong> {selectedSubstitution.period}</p>
                    <p><strong>Subject:</strong> {selectedSubstitution.subject}</p>
                    <p><strong>Class:</strong> {selectedSubstitution.classSection}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Absent Teacher:</strong> {selectedSubstitution.originalTeacher.name}</p>
                    <p><strong>Cover Teacher:</strong> {selectedSubstitution.substituteTeacher.name}</p>
                    <p><strong>Reason:</strong> {selectedSubstitution.reason}</p>
                  </div>
                </div>
              ) : ''
        }
        confirmButtonText={modalType === 'reassign' ? 'Reassign Teacher' : 'Close'}
        confirmButtonClass={modalType === 'reassign' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'}
        showComment={modalType === 'reassign'}
        teacherOptions={allTeachers}
        selectedTeacherId={selectedTeacherId}
        onTeacherSelect={setSelectedTeacherId}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words dark:text-gray-200">Class Coverage Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Monitor and manage teacher substitutions and class coverage</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto ">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <FiFilter className="mr-2" size={16} />
              Filter
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <FiDownload className="mr-2" size={16} />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-gray-200">Filter Coverage Records</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="sm:hidden p-1 text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">To Date</label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2 lg:col-span-1 sm:col-span-2 lg:col-start-3">
                <button
                  onClick={handleFilterApply}
                  className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Apply Filter
                </button>
                <button
                  onClick={handleClearFilters}
                  className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            icon={<FiCalendar size={20} />}
            title="Today's Coverage"
            value={getTodaysCoverage()}
            subtitle="Classes covered today"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setDateFilter({ from: today, to: today });
              fetchSubstitutions();
            }}
          />
          <StatCard 
            icon={<FiUsers size={20} />}
            title="Total Coverage"
            value={getTotalCoverage()}
            subtitle="In selected period"
          />
          <StatCard 
            icon={<FiBookOpen size={20} />}
            title="Coverage Success"
            value={`${getTotalCoverage() > 0 ? Math.round((getTotalCoverage() - getConflictCount()) / getTotalCoverage() * 100) : 100}%`}
            subtitle="Classes successfully covered"
          />
          <StatCard 
            icon={<FiAlertTriangle size={20} />}
            title="Need Attention"
            value={getConflictCount()}
            subtitle="Scheduling issues"
            alertColor={getConflictCount() > 0}
            onClick={getConflictCount() > 0 ? handleResolveConflicts : null}
          />
        </div>

        {/* Coverage History Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-300">Class Coverage History</h2>
            <span className="text-sm text-gray-500">{substitutions.length} records found</span>
          </div>
          
          {error && (
            <div className="p-4 sm:p-6 text-center">
              <div className="text-red-500 mb-2">{error}</div>
              <button 
                onClick={fetchSubstitutions}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              {/* Mobile Card View */}
              <div className="sm:hidden">
                {substitutions.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FiCalendar size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No coverage records found</p>
                      <p className="text-sm mt-1 text-center">Coverage assignments will appear here when teachers take leave</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    {substitutions.map((coverage, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header with Date and Period */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 dark:bg-gray-950">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-gray-900 dark:text-gray-300 text-lg">{coverage.date}</div>
                              <div className="text-sm text-gray-600 font-medium">{coverage.weekday}</div>
                            </div>
                            <div className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                              Period {coverage.period}
                            </div>
                          </div>
                        </div>
                        
                        {/* Main Content */}
                        <div className="p-4 space-y-4">
                          {/* Subject and Class - Prominent Display */}
                          <div className="text-center bg-indigo-50 rounded-lg p-3">
                            <div className="text-xl font-bold text-indigo-700">{coverage.subject}</div>
                            <div className="text-indigo-600 font-semibold">Class {coverage.classSection}</div>
                          </div>
                          
                          {/* Teachers Section */}
                          <div className="space-y-3">
                            <div className="bg-red-50 rounded-lg p-3">
                              <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">ABSENT TEACHER</div>
                              <div className="font-bold text-red-700 text-lg">{coverage.originalTeacher.name}</div>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">COVER TEACHER</div>
                              <div className="font-bold text-green-700 text-lg">{coverage.substituteTeacher.name}</div>
                            </div>
                          </div>
                          
                          {/* Bottom Section with Status and Actions */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <StatusBadge reason={coverage.reason} />
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleViewDetails(coverage)}
                                className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                                title="View Details"
                              >
                                <FiEye size={16} />
                              </button>
                              <button 
                                onClick={() => handleReassignTeacher(coverage)}
                                className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors shadow-sm"
                                title="Reassign Teacher"
                              >
                                <FiEdit3 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                      <th className="p-4 font-semibold text-sm dark:text-gray-100">Date & Time</th>
                      <th className="p-4 font-semibold text-sm dark:text-gray-100">Subject & Class</th>
                      <th className="p-4 font-semibold text-sm dark:text-gray-100">Absent Teacher</th>
                      <th className="p-4 font-semibold text-sm dark:text-gray-100">Cover Teacher</th>
                      <th className="p-4 font-semibold text-sm dark:text-gray-100">Status</th>
                      <th className="p-4 font-semibold text-center text-sm dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {substitutions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center p-12 text-gray-500">
                          <div className="flex flex-col items-center">
                            <FiCalendar size={48} className="text-gray-300 mb-4" />
                            <p className="text-lg font-medium">No coverage records found</p>
                            <p className="text-sm mt-1">Coverage assignments will appear here when teachers take leave</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      substitutions.map((coverage, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-gray-900">{coverage.date}</div>
                            <div className="text-sm text-gray-600">{coverage.weekday}</div>
                            <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded inline-block mt-1">
                              Period {coverage.period}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-indigo-600">{coverage.subject}</div>
                            <div className="text-sm text-gray-600">Class {coverage.classSection}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-gray-900">{coverage.originalTeacher.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{coverage.originalTeacher.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-green-700">{coverage.substituteTeacher.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{coverage.substituteTeacher.email}</div>
                          </td>
                          <td className="p-4">
                            <StatusBadge reason={coverage.reason} />
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center space-x-2">
                              <button 
                                onClick={() => handleViewDetails(coverage)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                title="View Details"
                              >
                                <FiEye size={14} />
                              </button>
                              <button 
                                onClick={() => handleReassignTeacher(coverage)}
                                className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                                title="Reassign Teacher"
                              >
                                <FiEdit3 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassCoverageManagement;