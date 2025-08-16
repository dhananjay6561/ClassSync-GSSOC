import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const StudentDashboard = () => {
    const [todaysSchedule, setTodaysSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTodaysSchedule = async () => {
            try {
                const response = await api.get('/api/student/dashboard');
                setTodaysSchedule(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch today\'s schedule');
            } finally {
                setLoading(false);
            }
        };

        fetchTodaysSchedule();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">

            <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">Today's Schedule</h2>
                {todaysSchedule.length > 0 ? (
                    <div className="space-y-4">
                        {todaysSchedule.map((slot) => (
                            <div key={slot._id} className="p-5 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    {/* Left side: Subject and Teacher */}
                                    <div>
                                        <p className="text-xl font-bold text-indigo-700">{slot.subject.name}</p>
                                        <div className="flex items-baseline mt-1">
                                            <p className="text-lg font-bold text-gray-800">Teacher:</p>
                                            <p className="text-md font-medium text-gray-600 ml-2">{slot.teacher.name}</p>
                                        </div>
                                    </div>
                                    {/* Right side: Time */}
                                    <p className="mt-2 sm:mt-0 text-md font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                                        {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No classes scheduled for today.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
