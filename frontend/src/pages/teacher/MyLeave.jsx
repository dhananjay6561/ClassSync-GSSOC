import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Toast from '../../components/ui/Toast';
import { FiCheckCircle, FiXCircle, FiClock, FiPlus } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker.css';
import { useTheme } from '../../context/ThemeContext';

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      icon: <FiClock className="mr-2" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
      text: 'Pending',
    },
    approved: {
      icon: <FiCheckCircle className="mr-2" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
      text: 'Approved',
    },
    rejected: {
      icon: <FiXCircle className="mr-2" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
      text: 'Rejected',
    },
  };

  const currentStatus = statusMap[status] || statusMap.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
};

const MyLeave = () => {
  const { isDarkMode } = useTheme();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  // Form state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/leaves/my-leaves');
      setMyRequests(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/leaves/apply', { fromDate, toDate, reason });
      setMyRequests(prev => [response.data.leaveRequest, ...prev]);
      setToast({ message: 'Leave request submitted successfully!', type: 'success' });
      setFromDate(null);
      setToDate(null);
      setReason('');
      setIsFormVisible(false);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to submit request.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '' })}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Leave Requests</h1>
        <button
          onClick={() => setIsFormVisible(prev => !prev)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
        >
          <FiPlus className="mr-2" />
          {isFormVisible ? 'Cancel' : 'New Leave Request'}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  selectsStart
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={new Date()}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  selectsEnd
                  startDate={fromDate}
                  endDate={toDate}
                  minDate={fromDate || new Date()}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholderText="Select end date"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                <textarea
                  id="reason"
                  rows="3"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter reason for leave"
                ></textarea>
              </div>
            </div>
            <div className="text-right mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-500 disabled:bg-green-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">History</h2>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading history...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Dates</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Reason</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Status</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-200">Admin Comment</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-500 dark:text-gray-400">No leave requests found.</td>
                  </tr>
                ) : (
                  myRequests.map(request => (
                    <tr
                      key={request._id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {new Date(request.fromDate).toLocaleDateString()} -{' '}
                        {new Date(request.toDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{request.reason}</td>
                      <td className="p-4"><StatusBadge status={request.status} /></td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 italic max-w-xs truncate">
                        {request.adminComment || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeave;
