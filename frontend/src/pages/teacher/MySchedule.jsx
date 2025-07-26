import React from 'react';
import { FiInfo } from 'react-icons/fi';

const MySchedule = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-300">
    <FiInfo className="text-6xl mb-4" />
    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">My Schedule</h2>
    <p className="text-lg text-gray-600 dark:text-gray-300">Coming soon...</p>
  </div>
);

export default MySchedule;
