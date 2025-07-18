import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCalendar, FiClock, FiBookOpen } from 'react-icons/fi';

const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const weekdayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/schedules/mine');
        setSchedule(response.data.schedule);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch schedule.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const timeSlots = [...new Set(schedule.map(item => item.periodIndex))].sort((a, b) => a - b);
  const scheduledDays = [...new Set(schedule.map(item => weekdayMap[item.weekday]))];
  const scheduleMatrix = schedule.reduce((acc, item) => {
    const day = weekdayMap[item.weekday];
    if (!acc[day]) acc[day] = {};
    acc[day][item.periodIndex] = item;
    return acc;
  }, {});

  const getTodaysClasses = () => {
    const today = new Date().getDay();
    return schedule.filter(item => item.weekday === today).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8"> {/* ✅ Ensures full width with padding */}
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FiCalendar size={24} />}
          title="Today's Classes"
          value={getTodaysClasses()}
          subtitle="Classes scheduled for today"
        />
         <StatCard 
          icon={<FiClock size={24} />}
          title="Weekly Periods"
          value={schedule.length}
          subtitle="Total periods this week"
        />
         <StatCard 
          icon={<FiBookOpen size={24} />}
          title="Unique Subjects"
          value={[...new Set(schedule.map(item => item.subject))].length}
          subtitle="Subjects you are teaching"
        />
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow-md w-full">
         <h2 className="text-xl font-bold text-gray-800 p-6 border-b">Your Weekly Schedule</h2>
        {schedule.length > 0 ? (
          <div className="overflow-x-auto p-6">
            <div
              className="grid gap-px min-w-full"
              style={{ gridTemplateColumns: `100px repeat(${scheduledDays.length}, minmax(120px, 1fr))` }}
            >
              {/* Top-left empty cell */}
              <div className="bg-gray-50 p-3 rounded-tl-lg"></div>

              {/* Day headers */}
              {scheduledDays.map(day => (
                <div key={day} className="bg-gray-50 text-center font-semibold p-3">
                  {day}
                </div>
              ))}

              {/* Grid rows */}
              {timeSlots.map(periodIndex => (
                <React.Fragment key={periodIndex}>
                  {/* Period header */}
                  <div className="bg-gray-50 text-center font-semibold p-3 flex items-center justify-center">
                    Period {periodIndex}
                  </div>

                  {/* Schedule cells */}
                  {scheduledDays.map(day => {
                    const slot = scheduleMatrix[day]?.[periodIndex];
                    return (
                      <div
                        key={`${day}-${periodIndex}`}
                        className="relative p-3 border-t border-l border-gray-200 min-h-[100px] bg-white hover:bg-indigo-50 transition-colors"
                      >
                        {slot ? (
                          <div>
                            <p className="font-semibold text-sm text-indigo-800">{slot.subject}</p>
                            <p className="text-xs text-gray-600 mt-1">Class: {slot.classSection}</p>
                            <p className="text-xs text-gray-500 mt-1">Room: {slot.room || 'N/A'}</p>
                          </div>
                        ) : (
                          <div className="text-gray-300 flex items-center justify-center h-full">-</div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Your schedule is empty for this week.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
