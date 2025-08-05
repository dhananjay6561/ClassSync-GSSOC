import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { FiEdit, FiTrash2, FiPlus, FiAlertTriangle, FiEye, FiX } from 'react-icons/fi';

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

const ViewStudentModal = ({ isOpen, onClose, student, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <FiX size={24}/>
        </button>
        {loading ? (
          <p className="text-center py-8">Loading details...</p>
        ) : student ? (
          <>
            <h3 className="text-xl font-bold mb-1">{student.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{student.email}</p>
            <div className="grid grid-cols-1 gap-2 mb-4 border-t pt-4">
              <div>
                <span className="font-semibold text-gray-600">Class Section: </span>
                <span className="text-gray-800">{student.classSection}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Roll Number: </span>
                <span className="text-gray-800">{student.rollNumber}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Joined On: </span>
                <span className="text-gray-800">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-red-500 text-center py-8">Could not load student details.</p>
        )}
      </div>
    </div>
  );
};

const EditStudentModal = ({ isOpen, onClose, onSave, student }) => {
  const [name, setName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setClassSection(student.classSection);
      setRollNumber(student.rollNumber);
    }
  }, [student]);
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...student, name, classSection, rollNumber });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Edit Student</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="classSection" className="block text-sm font-medium text-gray-700 mb-1">Class Section</label>
            <input
              type="text"
              id="classSection"
              value={classSection}
              onChange={(e) => setClassSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
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

const AddStudentModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classSection, setClassSection] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, password, classSection, rollNumber });
    setName('');
    setEmail('');
    setPassword('');
    setClassSection('');
    setRollNumber('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Add New Student</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
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
           <div className="mb-4">
            <label htmlFor="add-password"className="block text-sm font-medium text-gray-700 mb-1">Initial Password</label>
            <input
              type="password" id="add-password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="add-classSection" className="block text-sm font-medium text-gray-700 mb-1">Class Section</label>
            <input
              type="text" id="add-classSection" value={classSection} onChange={(e) => setClassSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="add-rollNumber" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
            <input
              type="text" id="add-rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm sm:text-base" required
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/students');
        setStudents(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      await api.delete(`/api/admin/students/${studentToDelete._id}`);
      setStudents(prev => prev.filter(s => s._id !== studentToDelete._id));
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error('Failed to delete student:', err);
    }
  };

  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async (updatedStudent) => {
    if (!updatedStudent) return;
    try {
      const response = await api.put(`/api/admin/students/${updatedStudent._id}`, { name: updatedStudent.name, classSection: updatedStudent.classSection, rollNumber: updatedStudent.rollNumber });
      setStudents(prev => prev.map(s => s._id === updatedStudent._id ? response.data : s));
      setIsEditModalOpen(false);
      setStudentToEdit(null);
    } catch (err) {
      console.error('Failed to update student:', err);
    }
  };

  const handleAddStudent = async (newStudent) => {
    try {
      const response = await api.post('/api/admin/students', newStudent);
      setStudents(prev => [response.data, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create student:', err);
    }
  };

  const handleViewClick = async (student) => {
    setIsViewModalOpen(true);
    setIsViewLoading(true);
    try {
      const response = await api.get(`/api/admin/students/${student._id}`);
      setStudentDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch student details:', err);
      setStudentDetails(null);
    } finally {
      setIsViewLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500 py-8">Loading students...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <>
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
      />
      <EditStudentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveChanges}
        student={studentToEdit}
      />
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
      />
      <ViewStudentModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={studentDetails}
        loading={isViewLoading}
      />
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Student List</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base self-start sm:self-auto"
            >
              <FiPlus className="mr-2" size={16} />
              Add Student
            </button>
          </div>
          
          <div className="grid grid-cols-1">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-sm">Name</th>
                <th className="p-4 font-semibold text-sm">Email</th>
                <th className="p-4 font-semibold text-sm">Class Section</th>
                <th className="p-4 font-semibold text-sm">Roll Number</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">{student.name}</td>
                  <td className="p-4 text-sm text-gray-600">{student.email}</td>
                  <td className="p-4 text-sm text-gray-600">{student.classSection}</td>
                  <td className="p-4 text-sm text-gray-600">{student.rollNumber}</td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleViewClick(student)}
                      className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                      title="View Details"
                    >
                      <FiEye size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(student)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                      title="Edit Student"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(student)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Delete Student"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && !loading && (
          <p className="text-center text-gray-500 pt-8">No students found.</p>
        )}
      </div>
    </>
  );
};

export default StudentList;
