import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MySchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await api.get('/api/student/my-schedule');
                setSchedule(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch schedule');
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Weekly Schedule</h1>
            <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                {schedule.length > 0 ? (
                    <div className="space-y-4">
                        {schedule.map((slot) => (
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
                                        {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No schedule found for this week.</p>
                )}
            </div>
        </div>
    );
};

export default MySchedule;
