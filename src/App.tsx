import Projects from "./pages/Projects";
import { useMemo, useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectDetails from "./pages/ProjectDetails";
import ProjectBom from "./pages/ProjectBom";
import BomUpload from "./pages/BomUpload";
import ColumnMapping from "./pages/ColumnMapping";
import About from './pages/About';
import {
  
  Bell,
  Box,
  Briefcase,
  FileText,
  Layers,
  LayoutDashboard,
  Mail,
  Package,
  Plus,
  ShoppingBag,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Search,
  Settings,
  Users,
  Database,
  ClipboardCheck,
  ChartBar
} from 'lucide-react';
import logo from './assets/logo.jpeg';
import Dashboard from './app/components/Dashboard';
import ProjectManagement from './app/components/ProjectManagement';
import BOMManagement from './app/components/BOMManagement';
import InventoryManagement from './app/components/InventoryManagement';
import VendorManagement from './app/components/VendorManagement';

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      if ((location as any).state?.signup || params.get('signup')) {
        setIsSignUp(true);
      }
    } catch (e) {
      // ignore
    }
  }, [location]);

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    }).format(new Date());
  }, []);

  // Sign-in state
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signInErrors, setSignInErrors] = useState({ email: '', password: '' });
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign-up errors (we reuse formData for values)
  const [signUpErrors, setSignUpErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/;

  const validateSignIn = (setErrors = true) => {
    const errors: { email: string; password: string } = { email: '', password: '' };
    if (!signInData.email) errors.email = 'Please enter your email address';
    else if (!emailRegex.test(signInData.email)) errors.email = 'Please enter a valid email address';
    if (!signInData.password) errors.password = 'Password is required';
    else if (signInData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (setErrors) setSignInErrors(errors);
    return !errors.email && !errors.password;
  };

  const validateSignUp = (setErrorsFlag = true) => {
    const errors: any = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };
    if (!formData.firstName) errors.firstName = 'First name is required';
    else if (formData.firstName.trim().length < 2) errors.firstName = 'First name must be at least 2 characters';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    else if (formData.lastName.trim().length < 2) errors.lastName = 'Last name must be at least 2 characters';
    if (!formData.email) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.phone) errors.phone = 'Phone number is required';
    else {
      const digits = formData.phone.replace(/\D/g, '');
      if (!/^\d+$/.test(digits)) errors.phone = 'Phone number must contain only numbers';
      else if (digits.length !== 10) errors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.password) errors.password = 'Password is required';
    else if (!passwordRegex.test(formData.password)) errors.password = 'Password must be 8+ chars, include upper, lower, number, and special char';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.confirmPassword !== formData.password) errors.confirmPassword = 'Passwords do not match';
    if (setErrorsFlag) setSignUpErrors(errors);
    return Object.values(errors).every((v) => !v);
  };

const handleSignInSubmit = async () => {
  if (!validateSignIn()) return;

  setSignInLoading(true);

  try {
    const response = await fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signInData.email,
        password: signInData.password,
      }),
    });

    const data = await response.json();

    if (data.message === 'Login Successful') {
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Server Connection Failed');
  } finally {
    setSignInLoading(false);
  }
};

  const handleSignUpSubmit = async () => {
    if (!validateSignUp()) return;
    setSignUpLoading(true);
    try {
      // simulate API
      await new Promise((r) => setTimeout(r, 900));
      // success - navigate to dashboard
      setIsAuthenticated(true);
      navigate('/dashboard');
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-slate-900">
      {isAuthenticated && (
        <>
          <aside className="fixed inset-y-0 left-0 z-50 hidden w-80 border-r border-blue-900/30 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] p-6 pb-8 shadow-glass backdrop-blur-xl xl:block">
            <div className="mb-10 flex items-center gap-3">
              <img src={logo} alt="SPARSHIQ logo" className="h-11 w-11 rounded-2xl border border-white/20 bg-white/10 p-2" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">SPARSHIQ ERP</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Enterprise Portal</h2>
              </div>
            </div>
            <nav className="space-y-2">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/project-management', label: 'Project Management' },
                { to: '/bom', label: 'BOM Dashboard' },
                { to: '/inventory', label: 'Inventory Dashboard' },
                { to: '/vendors', label: 'Vendors' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    location.pathname === item.to
                      ? 'bg-white/15 text-white shadow-sm shadow-white/10'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              <motion.div
                key="login"
                className="relative overflow-hidden min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1e3a8a] to-primary" />
                <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-[#2563EB]/20 blur-3xl animate-[float_16s_ease-in-out_infinite]" />
                <div className="absolute right-[-80px] top-24 h-64 w-64 rounded-full bg-[#10B981]/20 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
                {/* Top-right Sign In link removed per request */}
                <div className="relative z-10 mx-auto flex min-h-screen max-w-[1480px] items-center px-6 py-10 md:px-12">
                  <div className="grid w-full gap-8 xl:grid-cols-[1.5fr_1fr]">
                    <motion.div
                      initial={{ x: -80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="space-y-8 text-white"
                    >
                      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.32em] text-slate-300">
                        <img src={logo} alt="SPARSHIQ logo" className="h-10 w-10 rounded-2xl border border-white/20 bg-white/10 object-contain p-1" />
                        SPARSHIQ ERP
                      </div>
                      <div className="max-w-xl space-y-6">
                        <div>
                          <p className="text-sm text-slate-300">Enterprise Procurement · Inventory · Manufacturing</p>
                          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                            Smart <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#A78BFA' }}>Procurement</span> & Inventory Management
                          </h1>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="flex items-center justify-center"
                    >
                      <div className="relative w-full max-w-md rounded-[32px] border border-white/18 bg-white/75 p-8 shadow-glass backdrop-blur-xl">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent rounded-t-[32px]" />
                        <div className="space-y-6">
                          <div className="flex gap-2 border-b border-slate-200/70 pb-4">
                            <button
                              type="button"
                              onClick={() => setIsSignUp(false)}
                              className={`flex-1 py-3 text-center font-semibold transition ${
                                !isSignUp
                                  ? 'border-b-2 border-primary text-primary'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Sign In
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsSignUp(true)}
                              className={`flex-1 py-3 text-center font-semibold transition ${
                                isSignUp
                                  ? 'border-b-2 border-primary text-primary'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              Sign Up
                            </button>
                          </div>

                          {!isSignUp ? (
                            <div className="space-y-6">
                              <div className="space-y-2 text-center">
                                <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Welcome Back</p>
                                <h2 className="text-3xl font-semibold text-navy">Sign in to your workspace</h2>
                              </div>
                              <div className="space-y-4">
                                <label className="block text-sm text-slate-600">
                                  Email Address
                                  <div className="relative mt-2">
                                    <input
                                      type="email"
                                      placeholder="you@company.com"
                                      value={signInData.email}
                                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                                      onBlur={() => validateSignIn()}
                                      className={`w-full rounded-3xl border px-4 py-4 pr-12 shadow-sm transition focus:ring-4 ${
                                        signInErrors.email
                                          ? 'border-red-500 bg-white/95'
                                          : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                      }`}
                                    />
                                    <Search size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                  </div>
                                  {signInErrors.email && <p className="mt-2 text-sm text-red-600">{signInErrors.email}</p>}
                                </label>
                                <label className="block text-sm text-slate-600">
                                  Password
                                  <div className="relative mt-2">
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder="Enter your password"
                                      value={signInData.password}
                                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                      onBlur={() => validateSignIn()}
                                      className={`w-full rounded-3xl border px-4 py-4 pr-12 shadow-sm transition focus:ring-4 ${
                                        signInErrors.password
                                          ? 'border-red-500 bg-white/95'
                                          : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((value) => !value)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-navy"
                                    >
                                      {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                  </div>
                                  {signInErrors.password && <p className="mt-2 text-sm text-red-600">{signInErrors.password}</p>}
                                </label>
                              </div>
                              <div className="flex items-center justify-between text-sm text-slate-600">
                                <label className="inline-flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={() => setRemember((value) => !value)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                  />
                                  Remember Me
                                </label>
                                <a href="#" className="font-medium text-primary transition hover:text-blue-700">
                                  Forgot Password?
                                </a>
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: signInLoading ? 1 : 1.02 }}
                                whileTap={{ scale: signInLoading ? 1 : 0.98 }}
                                className={`inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition ${
                                  signInLoading
                                    ? 'bg-primary/70 cursor-wait'
                                    : validateSignIn(false)
                                    ? 'bg-gradient-to-r from-primary to-[#1d4ed8]'
                                    : 'bg-gray-400/60 cursor-not-allowed'
                                }`}
                                onClick={handleSignInSubmit}
                                disabled={!validateSignIn(false) || signInLoading}
                              >
                                {signInLoading ? 'Signing In...' : 'Sign In'}
                              </motion.button>
                              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                <ShieldCheck size={16} className="text-primary" />
                                <span>Secure Enterprise Access</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="space-y-2 text-center">
                                <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Create Account</p>
                                <h2 className="text-3xl font-semibold text-navy">Get started today</h2>
                              </div>
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <label className="block text-sm text-slate-600">
                                    First Name
                                    <input
                                      type="text"
                                      placeholder="John"
                                      value={formData.firstName}
                                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                      onBlur={() => validateSignUp()}
                                      className={`w-full rounded-3xl border px-4 py-3 mt-2 text-slate-900 shadow-sm transition focus:ring-4 ${
                                        signUpErrors.firstName ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                      }`}
                                    />
                                    {signUpErrors.firstName && <p className="mt-2 text-sm text-red-600">{signUpErrors.firstName}</p>}
                                  </label>
                                  <label className="block text-sm text-slate-600">
                                    Last Name
                                    <input
                                      type="text"
                                      placeholder="Doe"
                                      value={formData.lastName}
                                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                      onBlur={() => validateSignUp()}
                                      className={`w-full rounded-3xl border px-4 py-3 mt-2 text-slate-900 shadow-sm transition focus:ring-4 ${
                                        signUpErrors.lastName ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                      }`}
                                    />
                                    {signUpErrors.lastName && <p className="mt-2 text-sm text-red-600">{signUpErrors.lastName}</p>}
                                  </label>
                                </div>
                                <label className="block text-sm text-slate-600">
                                  Email Address
                                  <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onBlur={() => validateSignUp()}
                                    className={`w-full rounded-3xl border px-4 py-3 mt-2 text-slate-900 shadow-sm transition focus:ring-4 ${
                                      signUpErrors.email ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                    }`}
                                  />
                                  {signUpErrors.email && <p className="mt-2 text-sm text-red-600">{signUpErrors.email}</p>}
                                </label>
                                <label className="block text-sm text-slate-600">
                                  Phone Number
                                  <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    onBlur={() => validateSignUp()}
                                    className={`w-full rounded-3xl border px-4 py-3 mt-2 text-slate-900 shadow-sm transition focus:ring-4 ${
                                      signUpErrors.phone ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                    }`}
                                  />
                                  {signUpErrors.phone && <p className="mt-2 text-sm text-red-600">{signUpErrors.phone}</p>}
                                </label>
                                <label className="block text-sm text-slate-600">
                                  Password
                                  <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onBlur={() => validateSignUp()}
                                    className={`w-full rounded-3xl border px-4 py-3 mt-2 text-slate-900 shadow-sm transition focus:ring-4 ${
                                      signUpErrors.password ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                    }`}
                                  />
                                  {signUpErrors.password && <p className="mt-2 text-sm text-red-600">{signUpErrors.password}</p>}
                                </label>
                                <label className="block text-sm text-slate-600">
                                  Confirm Password
                                  <div className="relative mt-2">
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder="Confirm your password"
                                      value={formData.confirmPassword}
                                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                      onBlur={() => validateSignUp()}
                                      className={`w-full rounded-3xl border px-4 py-3 text-slate-900 shadow-sm transition focus:ring-4 ${
                                        signUpErrors.confirmPassword ? 'border-red-500 bg-white/95' : 'border-slate-200/80 bg-white/90 focus:border-primary'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword((value) => !value)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-navy"
                                    >
                                      {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                  </div>
                                  {signUpErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">{signUpErrors.confirmPassword}</p>}
                                </label>
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: signUpLoading ? 1 : 1.02 }}
                                whileTap={{ scale: signUpLoading ? 1 : 0.98 }}
                                className={`inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition ${
                                  signUpLoading
                                    ? 'bg-primary/70 cursor-wait'
                                    : validateSignUp(false)
                                    ? 'bg-gradient-to-r from-primary to-[#1d4ed8]'
                                    : 'bg-gray-400/60 cursor-not-allowed'
                                }`}
                                onClick={handleSignUpSubmit}
                                disabled={!validateSignUp(false) || signUpLoading}
                              >
                                {signUpLoading ? 'Creating Account...' : 'Create Account'}
                              </motion.button>
                              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                <ShieldCheck size={16} className="text-primary" />
                                <span>Secure Enterprise Access</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            }
          />
        
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/project-bom" element={<ProjectBom />} />
          <Route path="/bom-upload" element={<BomUpload />} />
          <Route path="/column-mapping" element={<ColumnMapping />} />
          <Route path="/project-management" element={<ProjectManagement />} />
          <Route path="/bom" element={<BOMManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/vendors" element={<VendorManagement />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
