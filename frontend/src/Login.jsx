import React, { useState } from 'react';
import { Mail, Lock, GraduationCap, Shield } from 'lucide-react';
import api from './utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';


const demoUsers = [
  {
    role: "teacher",
    email: "teacher@demo.com",
    password: "piyush@123",
    label: "Teacher",
    icon: GraduationCap,
  },
  {
    role: "admin",
    email: "admin@demo.com",
    password: "Admin@123",
    label: "Admin",
    icon: Shield,
  },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const userRole = login(response.data.token);

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/teacher/dashboard');
      }
      
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const user = demoUsers.find((u) => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
    setError(''); // Clear any existing errors when selecting demo user
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* App Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white rounded-full relative">
                <div className="absolute inset-1 border border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-600 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>

          {/* Demo User Selection */}
          <div className="mb-6">
            <p className="text-gray-700 text-center mb-4 font-medium text-sm sm:text-base">Login as Demo User</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.role}
                  onClick={() => handleRoleSelect(user.role)}
                  className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                    selectedRole === user.role
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <user.icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">{user.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-shake">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Field */}
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
              <p className="text-xs text-gray-500 mt-1 ml-1">Email</p>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 sm:h-12 border border-gray-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-1">Password</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 sm:h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg sm:rounded-xl font-medium mt-6 transition-all duration-200 hover:shadow-lg active:scale-98 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Additional Info for Demo */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Select a demo user above or use your credentials
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        @media (max-width: 640px) {
          .hover\\:scale-105:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;