import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/teacher/students');
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

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500 py-8">Loading students...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Students</h2>
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
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm font-medium">{student.name}</td>
                <td className="p-4 text-sm text-gray-600">{student.email}</td>
                <td className="p-4 text-sm text-gray-600">{student.classSection}</td>
                <td className="p-4 text-sm text-gray-600">{student.rollNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredStudents.length === 0 && !loading && (
        <p className="text-center text-gray-500 pt-8">No students found.</p>
      )}
    </div>
  );
};

export default MyStudents;
