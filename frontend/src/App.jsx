import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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
import Footer from './components/ui/Footer';
import './App.css';
import logo from './logo.svg'; 
import Chatbot from './components/Chatbot';

function ParticleBackground() {
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
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(op => {
          const dx = p.x - op.x;
          const dy = p.y - op.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(op.x, op.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
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
  }, []);
  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }} />
  );
}

function TypewriterHeader() {
  const text = 'Smart School Management System';
  const [display, setdisplay] = useState('');
  const [index, setindex] = useState(0);
  const [done, setdone] = useState(false);
  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setdisplay(prev => prev + text.charAt(index));
        setindex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setdone(true);
    }
  }, [index, text]);
  return (
    <div className="space-y-8">
  <h1
  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent transition-all duration-500 ease-in-out hover:scale-105 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500"
>
  {display}
  {!done && <span className="blinking-cursor text-indigo-600">|</span>}
</h1>


      <p className="mt-2 text-base leading-relaxed text-gray-600 transition duration-300 ease-in-out hover:text-black-800 hover:scale-[1.02] ">
        Streamline teacher schedules, manage substitutions, and track leave applications with our comprehensive school management platform.
      </p>
      <div className="pt-8">
        <Link to="/login" className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 animate-pulse">
          <span>Get Started</span>
          <LogIn className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-16 flex items-center justify-center border-b border-gray-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow hover:scale-110 hover:rotate-6 transition-transform duration-300 ease-in-out cursor-pointer" title="ClassSync">
              <img src={logo} alt="ClassSync Logo" className="w-full h-full object-contain rounded-full" />
            </div>
          </div>
          <Link to="/login" className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>
        </div>
      </nav>
      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center pt-16 sm:pt-24 lg:pt-32">
          <TypewriterHeader />
          <div className="pt-20 sm:pt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[{
                icon: Calendar,
                title: 'Schedule Management',
                desc: 'Efficiently organize and manage teacher schedules with our intuitive interface.'
              }, {
                icon: Users,
                title: 'Teacher Management',
                desc: 'Comprehensive teacher profiles and performance tracking in one place.'
              }, {
                icon: BookOpen,
                title: 'Leave & Substitutions',
                desc: 'Seamless leave application and substitution management system.'
              }].map(({ icon: Icon, title, desc }) => (
              <div
  key={title}
  className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-transparent group 
             hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
>

                  <div className="flex justify-center mb-4 relative">
                    <Icon className="h-12 w-12 text-indigo-600 group-hover:text-purple-700 transition-colors duration-200" />
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-white bg-indigo-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      {title}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Chatbot />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout><TeacherDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/teacher/my-schedule" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout><TeacherDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/teacher/apply-leave" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout><MyLeave /></DashboardLayout></ProtectedRoute>} />
        <Route path="/teacher/substitutions" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout><TeacherSubstitutions /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/teacher-schedule/:teacherId" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ScheduleEditor /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/manage-teachers" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageTeachersPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/manage-leaves" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageLeaves /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/substitutions" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminSubstitutions /></DashboardLayout></ProtectedRoute>} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
