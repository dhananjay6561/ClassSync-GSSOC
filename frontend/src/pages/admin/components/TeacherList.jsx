import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';
import { FiEye, FiEdit, FiTrash2, FiAlertTriangle, FiPlus, FiCalendar, FiX, FiUser, FiMail, FiClock } from 'react-icons/fi';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
          <h3 className="text-lg font-bold">Confirm Deletion</h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">{message}</p>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm sm:text-base">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const EditTeacherModal = ({ isOpen, onClose, onSave, teacher }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
    }
  }, [teacher]);
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...teacher, name });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Edit Teacher</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTeacherModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, password });
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Add New Teacher</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
            <input
              type="text" id="add-name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" id="add-email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
           <div className="mb-6">
            <label htmlFor="add-password"className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
            <input
              type="password" id="add-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base">
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewTeacherModal = ({ isOpen, onClose, details, loading }) => {
  if (!isOpen) return null;

  const weekdayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const scheduleByDay = details?.schedule?.reduce((acc, slot) => {
    const day = weekdayMap[slot.weekday];
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  const totalPeriods = details?.schedule?.length || 0;
  const uniqueSubjects = [...new Set(details?.schedule?.map(slot => slot.subject) || [])];
  const joinedDate = details?.teacher?.createdAt ? new Date(details.teacher.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <FiX size={24}/>
        </button>
        {loading ? (
          <p className="text-center py-8">Loading details...</p>
        ) : details ? (
          <>
            <div className="pr-8"> {/* Add right padding to avoid overlap with close button */}
              <h3 className="text-xl font-bold mb-1">{details.teacher.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{details.teacher.email}</p>
            </div>
            
            {/* --- Additional Info Section --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 border-t pt-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Joined On</p>
                <p className="text-gray-800 text-sm sm:text-base">{joinedDate}</p>
              </div>
               <div>
                <p className="text-sm font-semibold text-gray-600">Total Periods</p>
                <p className="text-gray-800 text-sm sm:text-base">{totalPeriods} per week</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="text-sm font-semibold text-gray-600">Subjects Taught</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {uniqueSubjects.length > 0 ? uniqueSubjects.map(subject => (
                    <span key={subject} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {subject}
                    </span>
                  )) : <p className="text-gray-500 text-sm">No subjects assigned</p>}
                </div>
              </div>
            </div>
            {/* --- End Additional Info Section --- */}

            <h4 className="font-bold mb-2 border-t pt-4">Weekly Schedule</h4>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {scheduleByDay && Object.keys(scheduleByDay).length > 0 ? (
                Object.entries(scheduleByDay).map(([day, slots]) => (
                  <div key={day}>
                    <p className="font-semibold text-gray-700 text-sm sm:text-base">{day}</p>
                    <ul className="list-disc list-inside pl-2 text-sm text-gray-600 space-y-1">
                      {slots.sort((a,b) => a.periodIndex - b.periodIndex).map(slot => (
                        <li key={slot._id} className="break-words">
                          Period {slot.periodIndex}: {slot.subject} ({slot.classSection})
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No schedule assigned for this teacher.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-red-500 text-center py-8">Could not load teacher details.</p>
        )}
      </div>
    </div>
  );
};

// Mobile Teacher Card Component
const TeacherCard = ({ teacher, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{teacher.name}</h3>
          <p className="text-sm text-gray-500 truncate">{teacher.email}</p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button 
            onClick={() => onView(teacher)}
            className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          <Link 
            to={`/admin/teacher-schedule/${teacher._id}`}
            className="p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-gray-100"
            title="Manage Schedule"
          >
            <FiCalendar size={16} />
          </Link>
          <button 
            onClick={() => onEdit(teacher)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100"
            title="Edit Teacher"
          >
            <FiEdit size={16} />
          </button>
          <button 
            onClick={() => onDelete(teacher)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
            title="Delete Teacher"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-500">
        <FiClock className="mr-1" size={12} />
        Joined: {new Date(teacher.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/teachers');
        setTeachers(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch teachers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;

    try {
      await api.delete(`/api/admin/teachers/${teacherToDelete._id}`);
      setTeachers(prev => prev.filter(t => t._id !== teacherToDelete._id));
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch (err) {
      console.error('Failed to delete teacher:', err);
    }
  };

  const handleEditClick = (teacher) => {
    setTeacherToEdit(teacher);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async (updatedTeacher) => {
    if (!updatedTeacher) return;
    try {
      const response = await api.put(`/api/admin/teachers/${updatedTeacher._id}`, { name: updatedTeacher.name });
      setTeachers(prev => prev.map(t => t._id === updatedTeacher._id ? response.data : t));
      setIsEditModalOpen(false);
      setTeacherToEdit(null);
    } catch (err) {
      console.error('Failed to update teacher:', err);
      // You could show an error toast here
    }
  };

  const handleViewClick = async (teacher) => {
    setIsViewModalOpen(true);
    setIsViewLoading(true);
    try {
      const response = await api.get(`/api/admin/teachers/${teacher._id}`);
      setTeacherDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch teacher details:', err);
      setTeacherDetails(null);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleAddTeacher = async (newTeacher) => {
    try {
      const response = await api.post('/api/admin/teachers', newTeacher);
      setTeachers(prev => [response.data, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create teacher:', err);
    }
  };

  // Get all unique subjects and classes from teachers' schedules
  const allSubjects = Array.from(new Set(
    teachers.flatMap(t => (t.schedule || []).map(slot => slot.subject)).filter(Boolean)
  ));
  const allClasses = Array.from(new Set(
    teachers.flatMap(t => (t.schedule || []).map(slot => slot.classSection && slot.classSection.replace(/[^0-9]/g, ''))).filter(Boolean)
  ));

  // Filter teachers by name/email, subject, and class
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter
      ? (t.schedule || []).some(slot => slot.subject === subjectFilter)
      : true;
    const matchesClass = classFilter
      ? (t.schedule || []).some(slot => slot.classSection && slot.classSection.replace(/[^0-9]/g, '') === classFilter)
      : true;
    return matchesSearch && matchesSubject && matchesClass;
  });

  if (loading) return <p className="text-center text-gray-500 py-8">Loading teachers...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <>
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${teacherToDelete?.name}? This action cannot be undone.`}
      />
      <EditTeacherModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveChanges}
        teacher={teacherToEdit}
      />
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTeacher}
      />
      <ViewTeacherModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        details={teacherDetails}
        loading={isViewLoading}
      />
      
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Manage Teachers</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base self-start sm:self-auto"
            >
              <FiPlus className="mr-2" size={16} />
              Add Teacher
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">All Subjects</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">All Classes</option>
              {allClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="block sm:hidden">
          {filteredTeachers.length > 0 ? (
            <div className="space-y-3">
              {filteredTeachers.map(teacher => (
                <TeacherCard
                  key={teacher._id}
                  teacher={teacher}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No teachers found.</p>
          )}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">Name</th>
                  <th className="p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">Email</th>
                  <th className="p-4 font-semibold text-sm text-gray-900 dark:text-gray-100">Joined On</th>
                  <th className="p-4 font-semibold text-sm text-right text-gray-900 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map(teacher => (
                  <tr key={teacher._id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">{teacher.name}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{teacher.email}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{new Date(teacher.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewClick(teacher)}
                        className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <Link 
                        to={`/admin/teacher-schedule/${teacher._id}`}
                        className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
                        title="Manage Schedule"
                      >
                        <FiCalendar size={16} />
                      </Link>
                      <button 
                        onClick={() => handleEditClick(teacher)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                        title="Edit Teacher"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(teacher)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                        title="Delete Teacher"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTeachers.length === 0 && !loading && (
            <p className="text-center text-gray-500 pt-8">No teachers found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherList;