import React from 'react';
import TeacherList from './components/TeacherList';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
const ManageTeachersPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  return (
    <div className="p-8 dark:bg-gray-950">
      <div className="flex items-center mb-6 dark:bg-gray-950">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Teachers</h1>
      </div>
      <TeacherList />
    </div>
  );
};

export default ManageTeachersPage; 