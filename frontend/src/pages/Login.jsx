import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOff, Eye, ArrowRight, ArrowLeft, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import images from '../utils/images';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
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
    if (!formData.identifier || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    setIsLoggingIn(true);
    try {
      const sanitizedIdentifier = DOMPurify.sanitize(formData.identifier);
      const isEmail = sanitizedIdentifier.includes('@');
      const loginDetails = isEmail
        ? { email: sanitizedIdentifier, password: formData.password }
        : { phone: sanitizedIdentifier, password: formData.password };

      await login(loginDetails);
      toast.success("Identity Verified. Welcome Back.");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Verification failed';
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#181A1E]">

      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
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
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 p-2.5 shadow-2xl backdrop-blur-md">
            <img src={images.logo} alt="Stocka Logo" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <h1 className="text-white font-nosifer font-black text-5xl tracking-tight">Stocka</h1>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-white font-black text-4xl leading-tight mb-4">
              Return to your<br /><span className="text-white">Trading Hub.</span>
            </h2>
            <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
              Resume your journey with advanced financial tracking and real-time market insights.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { icon: <TrendingUp size={20} />, label: 'Dynamic yield analysis' },
              { icon: <BarChart2 size={20} />, label: 'Consolidated trade history' },
              { icon: <DollarSign size={20} />, label: 'Quantum security protocols' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-brand-500 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-white/60 font-semibold group-hover:text-white transition-colors">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[#F9FBFF] relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#09111E]/40 hover:text-[#09111E] font-extrabold text-sm transition-all hover:-translate-x-1"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-5xl font-black text-[#09111E] mb-1 leading-tight tracking-tighter">Welcome Back</h2>
            <p className="text-[#09111E]/40 font-medium">Authenticate to continue to dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#09111E]/60 pl-1">Phone or Email</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="+250 78x..."
                required
                className="w-full px-6 py-4 bg-white border border-brand-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#09111E]/60 pl-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-6 py-4 pr-16 bg-white border border-brand-100 rounded-md focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#09111E]/30 hover:text-[#09111E] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-[#09111E] text-white rounded-md font-bold text-sm hover:shadow-[0_10px_40px_-10px_rgba(9,17,30,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Login <ArrowRight size={18} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#09111E]/30 font-medium mt-10">
            First time here?{' '}
            <Link to="/signup" className="text-[#09111E] font-bold hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
