import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiHome, FiUser, FiSettings, FiLogOut, FiHelpCircle, FiBell,
  FiUsers, FiCalendar, FiRepeat, FiBookOpen, FiClipboard, FiInfo,
  FiMenu, FiX, FiMoon, FiSun
} from 'react-icons/fi';
import logo from '../../logo.svg';

const Dummy = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <FiInfo className="text-6xl mb-4" />
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-lg">Coming soon...</p>
  </div>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderNavLinks = () => (
    <>
      {user?.role === 'admin' && (
        <>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/admin/manage-teachers" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiUsers /> Teachers
          </NavLink>
          <NavLink to="/admin/manage-leaves" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiClipboard /> Leave Requests
          </NavLink>
          <NavLink to="/admin/substitutions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiRepeat /> Substitutions
          </NavLink>
        </>
      )}
      {user?.role === 'teacher' && (
        <>
          <NavLink to="/teacher/my-schedule" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiBookOpen /> My Schedule
          </NavLink>
          <NavLink to="/teacher/apply-leave" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiClipboard /> Apply Leave
          </NavLink>
          <NavLink to="/teacher/substitutions" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiRepeat /> Substitutions
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col justify-between">
        <div>
          <div className="h-16 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
  <div
    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer"
    title="ClassSync"
  >
    <img
      src={logo}
      alt="ClassSync Logo"
      className="w-full h-full object-contain rounded-full"
    />
  </div>
</div>
          <nav className="mt-6 flex flex-col gap-1 px-4">{renderNavLinks()}</nav>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} title="Logout" className="ml-2 text-red-500 hover:text-red-700">
            <FiLogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className={`w-64 bg-white dark:bg-gray-900 shadow-lg z-50 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div>
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
  <div
    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer"
    title="ClassSync"
  >
    <img
      src={logo}
      alt="ClassSync Logo"
      className="w-full h-full object-contain rounded-full"
    />
  </div>
</div>
                <button onClick={() => setSidebarOpen(false)}>
                  <FiX size={24} className="text-gray-600 dark:text-gray-100" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1 px-4">{renderNavLinks()}</nav>
            </div>
            <div className="p-4 border-t border-gray-100 flex items-center gap-3 dark:bg-gray-900">
              <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
              </div>
              <button onClick={handleLogout} title="Logout" className="ml-2 text-red-500 hover:text-red-700">
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black opacity-40" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 dark:bg-gray-950 dark:border-b-gray-700">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-700 dark:text-gray-100">
            <FiMenu size={24} />
          </button>
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-gray-600 hover:text-gray-800 dark:text-gray-400">
              <FiBell size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
