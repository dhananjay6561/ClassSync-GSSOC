import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import {
  FiHome, FiUser, FiSettings, FiLogOut, FiHelpCircle, FiBell,
  FiUsers, FiCalendar, FiRepeat, FiBookOpen, FiClipboard, FiInfo,
  FiMenu, FiX
} from 'react-icons/fi';
import logo from '../../logo.svg';
import DynamicNotificationDropdown from '../ui/NotificationDropdown';

const Dummy = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <FiInfo className="text-6xl mb-4" />
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-lg">Coming soon...</p>
  </div>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    // Fetch unread count when component mounts
    fetchUnreadCount();
    
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
          <NavLink to="/admin/manage-students" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
            <FiUsers /> Students
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-gray-200 flex-col justify-between">
        <div>
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
          <nav className="mt-6 flex flex-col gap-1 px-4">{renderNavLinks()}</nav>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} title="Logout" className="ml-2 text-red-500 hover:text-red-700">
            <FiLogOut size={20} />
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow-lg flex flex-col justify-between border-r border-gray-200">
            <div>
              <div className="h-16 flex items-center justify-between px-4 border-b">
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
                  <FiX size={24} className="text-gray-600" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1 px-4">{renderNavLinks()}</nav>
            </div>
            <div className="p-4 border-t border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email}</div>
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
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
            <FiMenu size={24} />
          </button>
          <div className="flex items-center gap-6 ml-auto">
            <div className="relative">
              <button 
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>
              <DynamicNotificationDropdown 
                isOpen={notificationDropdownOpen}
                onClose={() => setNotificationDropdownOpen(false)}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
