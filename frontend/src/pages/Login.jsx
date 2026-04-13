import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOff, Eye, ArrowRight, ArrowLeft, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(formData);
      toast.success("Welcome back!");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#181A1E]">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        {/* Diamond lattice bg */}
        <div className="absolute inset-0 bg-[#09111E]">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="diamondLogin" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.25)" strokeWidth="1.2" />
                <path d="M36 14 L58 36 L36 58 L14 36 Z" fill="none" stroke="rgba(102,124,155,0.1)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondLogin)" />
          </svg>
        </div>
        {/* Subtle warm glow for brand accent */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-white font-black text-5xl tracking-tight">Stocka</h1>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-white font-black text-4xl leading-tight mb-4">
              Master Your<br /><span className="text-orange-400">Trading Performance.</span>
            </h2>
            <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
              Track every transaction, monitor cash flow, and unlock weekly profit/loss insights with precision.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { icon: <TrendingUp size={20} />, label: 'Real-time profit tracking' },
              { icon: <BarChart2 size={20} />, label: 'Weekly performance analytics' },
              { icon: <DollarSign size={20} />, label: 'Inflow & outflow control' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-orange-400 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-white/60 font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/20 text-sm font-semibold">
          © {new Date().getFullYear()} Stocka. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-brand-600/50 hover:text-brand-600 font-semibold text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-block px-3 py-1 rounded-md bg-brand-50 border border-brand-100 text-brand-500 text-xs font-bold mb-5">
              Welcome back
            </div>
            <h2 className="text-4xl font-black text-brand-600 mb-2 leading-tight">Sign in to<br />your account</h2>
            <p className="text-brand-600/40 font-medium">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-600/70 pl-1">Business Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                className="w-full px-5 py-4 bg-brand-50 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-brand-600 placeholder:text-brand-600/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-600/70 pl-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-5 py-4 pr-14 bg-brand-50 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-brand-600 placeholder:text-brand-600/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-600/30 hover:text-brand-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-brand-600 text-white rounded-md font-bold text-sm hover:bg-brand-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Sign In <ArrowRight size={18} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-brand-600/40 font-medium mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-600 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
