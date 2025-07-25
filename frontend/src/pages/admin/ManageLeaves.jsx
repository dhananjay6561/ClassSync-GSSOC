import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCheckCircle, FiXCircle, FiClock, FiUsers, FiAlertCircle, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi';
import Toast from '../../components/ui/Toast';
import { useTheme } from '../../context/ThemeContext';
const StatusBadge = ({ status, isMobile = false }) => {
  const { isDarkMode } = useTheme();
  const statusMap = {
    pending: {
      icon: <FiClock className={isMobile ? "w-3 h-3" : "mr-2"} />,
      color: 'bg-yellow-100 text-yellow-800',
      text: 'Waiting for Approval',
      mobileText: 'Pending',
    },
    approved: {
      icon: <FiCheckCircle className={isMobile ? "w-3 h-3" : "mr-2"} />,
      color: 'bg-green-100 text-green-800',
      text: 'Approved',
      mobileText: 'Approved',
    },
    rejected: {
      icon: <FiXCircle className={isMobile ? "w-3 h-3" : "mr-2"} />,
      color: 'bg-red-100 text-red-800',
      text: 'Not Approved',
      mobileText: 'Rejected',
    },
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  if (isMobile) {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus.color}`}>
        {currentStatus.icon}
        <span>{currentStatus.mobileText}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

const ManageLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isGeneratingSubstitutions, setIsGeneratingSubstitutions] = useState(false);
  const [processingRequests, setProcessingRequests] = useState(new Map()); // Map of requestId -> action type

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/leaves');
        setLeaveRequests(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch leave requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const generateSubstitutionsForApprovedLeave = async (leaveRequest) => {
    try {
      setIsGeneratingSubstitutions(true);
      
      // Call your substitution generation endpoint
      const response = await api.post('/api/substitutions/generate', {
        leaveRequestId: leaveRequest._id,
        teacherId: leaveRequest.teacherId._id || leaveRequest.teacherId,
        fromDate: leaveRequest.fromDate,
        toDate: leaveRequest.toDate,
        schoolId: leaveRequest.schoolId?._id || leaveRequest.schoolId 
      });

      const { substitutions, conflicts } = response.data;

      if (conflicts && conflicts.length > 0) {
        setToast({ 
          message: `Leave approved! ${substitutions.length} class coverage arranged. ${conflicts.length} classes need manual assignment.`, 
          type: 'warning' 
        });
      } else {
        setToast({ 
          message: `Leave approved! All ${substitutions.length} classes have been covered automatically.`, 
          type: 'success' 
        });
      }

    } catch (err) {
      console.error('Failed to generate substitutions:', err);
      setToast({ 
        message: 'Leave approved, but there was an issue arranging class coverage. Please check the coverage assignments.', 
        type: 'warning' 
      });
    } finally {
      setIsGeneratingSubstitutions(false);
    }
  };

  const handleApproveLeave = async (request) => {
    const leaveId = request._id;
    
    // Prevent multiple clicks
    if (processingRequests.has(leaveId)) return;
    
    setProcessingRequests(prev => new Map(prev).set(leaveId, 'approve'));

    try {
      const response = await api.put(`/api/leaves/${leaveId}/approve`, { adminComment: '' });
      const updatedLeaveRequest = response.data.leaveRequest;

      // Update the UI
      setLeaveRequests(prev =>
        prev.map(req =>
          req._id === leaveId ? updatedLeaveRequest : req
        )
      );

      // Generate substitutions automatically
      await generateSubstitutionsForApprovedLeave(updatedLeaveRequest);

    } catch (err) {
      console.error('Failed to approve leave request:', err);
      setToast({ message: 'Failed to approve the leave request. Please try again.', type: 'error' });
    } finally {
      setProcessingRequests(prev => {
        const newMap = new Map(prev);
        newMap.delete(leaveId);
        return newMap;
      });
    }
  };

  const handleRejectLeave = async (request) => {
    const leaveId = request._id;
    
    // Prevent multiple clicks
    if (processingRequests.has(leaveId)) return;
    
    setProcessingRequests(prev => new Map(prev).set(leaveId, 'reject'));

    try {
      const response = await api.put(`/api/leaves/${leaveId}/reject`, { adminComment: '' });
      const updatedLeaveRequest = response.data.leaveRequest;

      // Update the UI
      setLeaveRequests(prev =>
        prev.map(req =>
          req._id === leaveId ? updatedLeaveRequest : req
        )
      );

      setToast({ message: 'Leave request has been declined.', type: 'info' });

    } catch (err) {
      console.error('Failed to reject leave request:', err);
      setToast({ message: 'Failed to process the leave request. Please try again.', type: 'error' });
    } finally {
      setProcessingRequests(prev => {
        const newMap = new Map(prev);
        newMap.delete(leaveId);
        return newMap;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading leave requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error Loading Data</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const pendingCount = leaveRequests.filter(req => req.status === 'pending').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'approved').length;

  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })} 
      />

      {/* Loading overlay for substitution generation */}
      {isGeneratingSubstitutions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-4"></div>
              <p className="text-lg">Arranging class coverage...</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Leave Requests</h1>
            
            {/* Mobile Stats */}
            <div className="flex gap-3">
              {pendingCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex-1">
                  <div className="flex items-center justify-center">
                    <FiClock className="text-yellow-600 w-4 h-4 mr-2" />
                    <span className="font-semibold text-yellow-800 text-sm">{pendingCount}</span>
                    <span className="text-yellow-700 text-xs ml-1">Pending</span>
                  </div>
                </div>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex-1">
                <div className="flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 w-4 h-4 mr-2" />
                  <span className="font-semibold text-green-800 text-sm">{approvedCount}</span>
                  <span className="text-green-700 text-xs ml-1">Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block px-8 py-6 dark:bg-gray-950">
          <div className="flex justify-between items-center dark:bg-gray-950">
            <h1 className="text-3xl font-bold text-gray-300">Teacher Leave Requests</h1>
            
            <div className="flex space-x-4">
              {pendingCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                  <div className="flex items-center">
                    <FiClock className="text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">{pendingCount} Waiting</span>
                  </div>
                </div>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-600 mr-2" />
                  <span className="font-medium text-green-800">{approvedCount} Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:px-8 lg:pb-8 dark:bg-gray-950">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b dark:bg-gray-950">
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Teacher Name</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Leave Dates</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Reason for Leave</th>
                    <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                    <th className="p-4 font-semibold text-gray-700 text-right dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-200">
                        <div className="flex flex-col items-center">
                          <FiUsers size={48} className="text-gray-300  mb-4" />
                          <p className="text-base">No leave requests found.</p>
                          <p className="text-sm mt-1">Teacher leave requests will appear here when submitted.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map(request => {
                      const teacher = request.teacherId;
                      const fromDate = new Date(request.fromDate).toLocaleDateString();
                      const toDate = new Date(request.toDate).toLocaleDateString();
                      const dateRange = fromDate === toDate ? fromDate : `${fromDate} - ${toDate}`;
                      const isApproving = processingRequests.get(request._id) === 'approve';
                      const isRejecting = processingRequests.get(request._id) === 'reject';
                      const isProcessing = isApproving || isRejecting;
                      
                      return (
                        <tr key={request._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-gray-900 dark:text-gray-200">{teacher?.name || 'Unknown Teacher'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300">{teacher?.email || 'N/A'}</div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">{dateRange}</td>
                          <td className="p-4 text-gray-600 dark:text-gray-300 max-w-xs">
                            <div className="truncate" title={request.reason}>
                              {request.reason}
                            </div>
                          </td>
                          <td className="p-4"><StatusBadge status={request.status} /></td>
                          <td className="p-4 text-right">
                            {request.status === 'pending' && (
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleApproveLeave(request)} 
                                  disabled={isProcessing}
                                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                  {isApproving ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white dark:border-gray-950 mr-2"></div>
                                      Approving...
                                    </>
                                  ) : (
                                    'Approve'
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleRejectLeave(request)} 
                                  disabled={isProcessing}
                                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                  {isRejecting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                      Declining...
                                    </>
                                  ) : (
                                    'Decline'
                                  )}
                                </button>
                              </div>
                            )}
                            {request.status === 'approved' && (
                              <span className="text-sm text-gray-500">Coverage arranged</span>
                            )}
                            {request.status === 'rejected' && (
                              <span className="text-sm text-gray-500">Request declined</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {leaveRequests.length === 0 ? (
              <div className="text-center py-12 px-4">
                <FiUsers size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">No leave requests found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Teacher leave requests will appear here when submitted</p>
              </div>
            ) : (
              <div className="px-4 pb-4 space-y-4">
                {leaveRequests.map(request => {
                  const teacher = request.teacherId;
                  const fromDate = new Date(request.fromDate).toLocaleDateString();
                  const toDate = new Date(request.toDate).toLocaleDateString();
                  const dateRange = fromDate === toDate ? fromDate : `${fromDate} - ${toDate}`;
                  const isApproving = processingRequests.get(request._id) === 'approve';
                  const isRejecting = processingRequests.get(request._id) === 'reject';
                  const isProcessing = isApproving || isRejecting;
                  
                  return (
                    <div key={request._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      {/* Card Header */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <FiUser className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                {teacher?.name || 'Unknown Teacher'}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">{teacher?.email || 'N/A'}</p>
                          </div>
                          <StatusBadge status={request.status} isMobile={true} />
                        </div>
                      </div>
                      
                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        {/* Leave Dates */}
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-3" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Leave Period</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{dateRange}</p>
                          </div>
                        </div>
                        
                        {/* Reason */}
                        <div className="flex items-start">
                          <FiMessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Reason</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{request.reason}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Actions */}
                      {request.status === 'pending' && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleApproveLeave(request)} 
                              disabled={isProcessing}
                              className="flex-1 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {isApproving ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Approving...
                                </>
                              ) : (
                                'Approve'
                              )}
                            </button>
                            <button 
                              onClick={() => handleRejectLeave(request)} 
                              disabled={isProcessing}
                              className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {isRejecting ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Declining...
                                </>
                              ) : (
                                'Decline'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {request.status !== 'pending' && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {request.status === 'approved' ? 'Coverage arranged' : 'Request declined'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Help text for admins */}
        {pendingCount > 0 && (
          <div className="mx-4 lg:mx-8 mb-4 lg:mb-0 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm mb-1">How it works:</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  When you approve a leave request, we automatically find available teachers to cover the classes. 
                  If some classes can't be covered automatically, you'll be notified to assign them manually.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageLeaves;