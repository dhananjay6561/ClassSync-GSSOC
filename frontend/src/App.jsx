import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { BookOpen, Users, Calendar, LogIn } from 'lucide-react';
import Login from './pages/auth/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import ScheduleEditor from './pages/admin/ScheduleEditor';
import ManageTeachersPage from './pages/admin/ManageTeachers';
import ManageLeaves from './pages/admin/ManageLeaves';
import MyLeave from './pages/teacher/MyLeave';
import AdminSubstitutions from './pages/admin/Substitutions';
import TeacherSubstitutions from './pages/teacher/Substitutions';
import ThemeToggle from './components/ui/ThemeToggle';
import './App.css';
import logo from './logo.svg'; 
import Chatbot from './components/Chatbot';

function ParticleBackground({ isDarkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const backgroundGradient = isDarkMode
      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';

    const particleColor = isDarkMode
      ? 'rgba(165, 180, 252, OPACITY)' // lighter indigo
      : 'rgba(99, 102, 241, OPACITY)';

    const lineColor = (opacity) =>
      isDarkMode
        ? `rgba(165, 180, 252, ${opacity})`
        : `rgba(99, 102, 241, ${opacity})`;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace('OPACITY', particle.opacity);
        ctx.fill();
      });

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = lineColor(0.1 * (1 - dist / 100));
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]); // Re-render if theme changes

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'transparent', zIndex: 0 }}
    />
  );
}

// Landing Page Component
function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
         <div className="h-16 flex items-center justify-center">
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
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              to="/login"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center pt-16 sm:pt-24 lg:pt-32">
          {/* Hero Section */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Smart School
              <span className="block text-indigo-600 dark:text-indigo-400">Management System</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Streamline teacher schedules, manage substitutions, and track leave applications 
              with our comprehensive school management platform.
            </p>
            
            <div className="pt-8">
              <Link 
                to="/login"
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <LogIn className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {/* Features */}
          <div className="pt-20 sm:pt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Schedule Management</h3>
                <p className="text-gray-600 dark:text-gray-300">Efficiently organize and manage teacher schedules with our intuitive interface.</p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Teacher Management</h3>
                <p className="text-gray-600 dark:text-gray-300">Comprehensive teacher profiles and performance tracking in one place.</p>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Leave & Substitutions</h3>
                <p className="text-gray-600 dark:text-gray-300">Seamless leave application and substitution management system.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <Chatbot />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Landing page with professional design */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected teacher routes */}
      <Route 
        path="/teacher/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/my-schedule" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/apply-leave" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <MyLeave />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/substitutions" 
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <DashboardLayout>
              <TeacherSubstitutions />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Protected admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
             <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/admin/teacher-schedule/:teacherId" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
             <DashboardLayout>
              <ScheduleEditor />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manage-teachers" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
             <DashboardLayout>
              <ManageTeachersPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/manage-leaves" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
             <DashboardLayout>
              <ManageLeaves />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/substitutions" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminSubstitutions />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
    <Chatbot />
    </>
  );
}

export default App;
