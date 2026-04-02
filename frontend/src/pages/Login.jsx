import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signupimage from '../assets/Login.jpg';
import images from '../utils/images';
import { EyeOff, Eye, Sparkles, ArrowRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      toast.success("Welcome back! You're logged in.");
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      console.error("Login error: ", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />
      <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10] p-4 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${images.Login || Signupimage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
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
          <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] border-r border-white/20">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-brand-500/10 rounded-full -mr-10 animate-float hidden lg:block"></div>

            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 sm:gap-6">
              <div className="text-center space-y-2 py-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-white/90 text-xs sm:text-sm">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" /> Make yourself at home
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-brand-500 to-amber-600 bg-clip-text text-transparent">
                  Welcome back
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  Trade smarter. Login and let's get you glowing.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-300 text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm sm:text-md font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all duration-300 text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brand-500 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 sm:py-3 px-4 mt-2 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Sign in <ArrowRight size={18} />
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
                Don't have an account?{' '}
                <Link to="/signup" className="text-black font-bold underline hover:text-amber-600 transition-colors">
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <img
              src={images.Login || Signupimage}
              alt="Creative login illustration"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 text-white space-y-2">
              <h3 className="text-2xl font-bold">TradeWise</h3>
              <p className="text-sm opacity-80 max-w-xs">Log in to access your trading dashboard and manage your portfolio with ease.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
