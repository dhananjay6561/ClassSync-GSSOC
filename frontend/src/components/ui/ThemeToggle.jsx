import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full transition-colors duration-200
        ${isDarkMode 
          ? 'bg-indigo-600 hover:bg-indigo-700' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${className}
      `}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span
        className={`
          absolute left-1 top-1 w-4 h-4 rounded-full bg-white
          shadow-md transform transition-transform duration-200
          flex items-center justify-center
          ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          <FiMoon className="w-2.5 h-2.5 text-indigo-600" />
        ) : (
          <FiSun className="w-2.5 h-2.5 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
