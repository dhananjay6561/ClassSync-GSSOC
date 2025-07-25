import React, { useState } from 'react';
import { Mail, Lock, User, Shield, GraduationCap } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../logo.svg';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      setPasswordMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      const userRole = login(response.data.token);

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (err) {
      console.error('Signup failed:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src={logo}
              alt="App Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl shadow-lg"
            />
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-2">Create an Account</h1>
            <p className="text-gray-600 text-sm">Join ClassSync today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                  role === 'teacher'
                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs sm:text-sm font-medium text-gray-700">Teacher</p>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                  role === 'admin'
                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs sm:text-sm font-medium text-gray-700">Admin</p>
              </button>
            </div>
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full pl-10 pr-4 h-11 sm:h-12 border rounded-lg sm:rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 text-sm sm:text-base ${
                    passwordMatch ? 'border-gray-200 focus:border-indigo-600 focus:ring-indigo-100' : 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
              {!passwordMatch && <p className="text-xs text-red-500 mt-1 ml-1">Passwords do not match</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !passwordMatch}
              className="w-full h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg sm:rounded-xl font-medium mt-6 transition-all duration-200 hover:shadow-lg active:scale-98 text-sm sm:text-base"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-2 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
