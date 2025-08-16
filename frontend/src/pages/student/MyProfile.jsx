import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiUser, FiMail, FiLock, FiEdit, FiSave, FiXCircle, FiAward, FiBookOpen, FiHash } from 'react-icons/fi';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', password: '', confirmPassword: '' });
    const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/student/me');
            setProfile(response.data);
            setFormData({ ...formData, name: response.data.name });
        } catch (err) {
            setError(err.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus({ message: '', type: '' });

        if (formData.password && formData.password !== formData.confirmPassword) {
            setUpdateStatus({ message: 'Passwords do not match!', type: 'error' });
            return;
        }

        try {
            const payload = { name: formData.name };
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await api.put('/api/student/me', payload);
            setProfile(response.data);
            setIsEditing(false);
            setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
            setFormData({ ...formData, password: '', confirmPassword: '' });
            setTimeout(() => setUpdateStatus({ message: '', type: '' }), 3000); // Auto-hide after 3 seconds
        } catch (err) {
            setUpdateStatus({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!profile) return <div className="text-center py-8">No profile data found.</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    >
                        <FiEdit /> Edit Profile
                    </button>
                )}
            </div>

            {updateStatus.message && (
                <div className={`p-4 mb-4 rounded-lg ${updateStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {updateStatus.message}
                </div>
            )}

            <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoCard icon={<FiUser />} label="Name" value={profile.name} />
                        <InfoCard icon={<FiMail />} label="Email" value={profile.email} />
                        <InfoCard icon={<FiBookOpen />} label="Class Section" value={profile.classSection} />
                        <InfoCard icon={<FiHash />} label="Roll Number" value={profile.rollNumber} />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="relative mt-1">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex items-center justify-center w-full gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                <FiSave /> Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center justify-center w-full gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <FiXCircle /> Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4 hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-gray-800">{label}:</p>
            <p className="text-md font-medium text-gray-600">{value}</p>
        </div>
    </div>
);

export default MyProfile;
