import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginimage from '../assets/Login.jpg';
import images from '../utils/images';
import { Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ enterpriseName: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
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
      toast.error("Please! Agree to the terms and conditions");
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSigningUp(true);
    try {
      await signup(formData);
      toast.success('Account created successfully! Please check your email for verification.');

      localStorage.setItem('pendingVerification', JSON.stringify({
        email: formData.email,
        enterpriseName: formData.enterpriseName,
      }));

      setTimeout(() => navigate('/verify-email'), 2000);
    } catch (err) {
      console.error('Signup error:', err);
      const message = err?.response?.data?.message || err.message || 'Registration failed. Try again.';
      toast.error(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10] p-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${images.Login || Loginimage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(12px) brightness(0.9)',
          }}
        ></div>

        <div className="z-10 fixed top-4 left-4 sm:top-5 sm:left-5 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="p-2 rounded-full bg-white/80 dark:bg-#FC9E4F/40 backdrop-blur border border-white/40 dark:border-white/10 shadow-soft hover:shadow-glow transition text-gray-700 dark:text-white"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <button
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
          className="z-10 fixed top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/70 dark:bg-#FC9E4F/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
        >
          {dark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-gray-700" />}
        </button>

        <div className="relative flex flex-col lg:flex-row w-full max-w-6xl min-h-[85vh] lg:h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] relative border-r border-white/20">
            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 sm:gap-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-white/90 text-xs sm:text-sm">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" /> Let's build something brilliant
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-500 to-amber-600 bg-clip-text text-transparent">
                  Create your account
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  A few details and you're in.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200">Enterprise Name</label>
                  <input
                    type="text"
                    name="enterpriseName"
                    placeholder="Enterprise Name"
                    required
                    value={formData.enterpriseName}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200">Confirm</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm"
                        required
                        value={confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    className="w-4 h-4 rounded border-gray-300 accent-brand-500 focus:ring-brand-500/40"
                  />
                  <label htmlFor="agree" className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none font-medium">
                    I agree to the <span className="text-black font-bold underline">terms and conditions</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-2.5 sm:py-3 mt-1 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Create account <ArrowRight size={18} />
                  </span>
                )}
              </button>

              <div className="grid grid-cols-3 items-center gap-3 mt-1">
                <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
                <div className="text-xs text-gray-400 text-center">or join with</div>
                <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-2">
                <button type="button" className="py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-soft transition text-sm">Google</button>
                <button type="button" className="py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-soft transition text-sm">Apple</button>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-black font-bold underline hover:text-amber-600 transition-colors">
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <img
              src={images.Login || Loginimage}
              alt="Signup illustration"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white space-y-2">
              <h3 className="text-2xl font-bold">TradeWise</h3>
              <p className="text-sm opacity-80 max-w-xs">Your personal trading companion for smarter, faster, and better outcomes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
