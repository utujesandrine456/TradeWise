import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import images from '../utils/images';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ enterpriseName: '', email: '', phone: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById('agree')?.checked) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSigningUp(true);
    try {
      await signup(formData);
      toast.success('Account created! Welcome to Stocka.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed.';
      toast.error(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#181A1E]">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#09111E]">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="diamondSignup" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.25)" strokeWidth="1.2" />
                <path d="M36 14 L58 36 L36 58 L14 36 Z" fill="none" stroke="rgba(102,124,155,0.1)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondSignup)" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 p-2.5 shadow-2xl backdrop-blur-md">
            <img src={images.logo} alt="Stocka Logo" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <h1 className="text-white font-black text-5xl tracking-tight">Stocka</h1>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-white font-black text-4xl leading-tight mb-4">
              Step into the Future<br /><span className="text-brand-500">of Trading.</span>
            </h2>
            <p className="text-white/40 font-medium text-lg leading-relaxed max-w-sm">
              Join thousands of traders using our premium analytics and real-time tracking.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {[
              { icon: <TrendingUp size={20} />, label: 'Advanced profit tracking' },
              { icon: <BarChart2 size={20} />, label: 'Premium market analytics' },
              { icon: <DollarSign size={20} />, label: 'Instant transaction alerts' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-brand-500 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-white/60 font-semibold group-hover:text-white transition-colors">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/20 text-sm font-semibold italic">
          Premium Trading Infrastructure
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[#F9FBFF] relative overflow-y-auto">
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 flex items-center gap-2 text-[#09111E]/50 hover:text-[#09111E] font-extrabold text-sm transition-all hover:-translate-x-1"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="w-full max-w-md py-16 lg:py-0">
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-[10px] uppercase tracking-widest font-black mb-5">
              Protocol Initialization
            </div>
            <h2 className="text-5xl font-black text-[#09111E] mb-3 leading-tight tracking-tighter">Join the<br />Network</h2>
            <p className="text-[#09111E]/40 font-medium">Create your account and start trading.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#09111E]/60 uppercase tracking-tighter pl-1">Enterprise Name</label>
              <input
                type="text"
                name="enterpriseName"
                value={formData.enterpriseName}
                onChange={handleChange}
                placeholder="Business name"
                required
                className="w-full px-6 py-4 bg-white border border-brand-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-[#09111E]/60 uppercase tracking-tighter pl-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+250 78x xxx xxx"
                  required
                  className="w-full px-6 py-4 bg-white border border-brand-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#09111E]/60 uppercase tracking-tighter pl-1">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  className="w-full px-6 py-4 bg-white border border-brand-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#09111E]/70 pl-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    required
                    className="w-full px-4 py-4 pr-12 bg-brand-50 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-[#09111E] placeholder:text-[#09111E]/30"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#09111E]/30 hover:text-[#09111E] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#09111E]/70 pl-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    required
                    className="w-full px-4 py-4 pr-12 bg-brand-50 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium text-[#09111E] placeholder:text-[#09111E]/30"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#09111E]/30 hover:text-[#09111E] transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="agree"
                className="w-4 h-4 rounded border-brand-200 accent-brand-900 focus:ring-brand-500/40 cursor-pointer"
              />
              <label htmlFor="agree" className="text-sm text-[#09111E]/50 cursor-pointer font-medium select-none">
                I agree to the <span className="text-[#09111E] font-bold underline">Terms and Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-5 bg-[#09111E] text-white rounded-xl font-black text-sm hover:shadow-[0_10px_40px_-10px_rgba(9,17,30,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isSigningUp ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Create Account <ArrowRight size={18} /> </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#09111E]/30 font-medium mt-10">
            Already registered?{' '}
            <Link to="/login" className="text-[#09111E] font-black hover:underline underline-offset-4">
              Sign in to Stocka
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
