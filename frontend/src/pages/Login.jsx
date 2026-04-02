import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import images from '../utils/images';
import { EyeOff, Eye, Sparkles, ArrowRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import { toast } from '../utils/toast';
import { handleError } from '../utils/handleError';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThuck';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        const fullError = resultAction.payload;
        toast.error(fullError);
      }
    } catch (err) {
      const fullError = handleError(err);
      toast.error(fullError.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10] p-4">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${images.Login}")`,
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
          <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02]">
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
                  <label htmlFor="email" className="text-sm sm:text-md font-medium text-gray-700 flex items-center gap-2">
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
                  <label htmlFor="password" className="text-sm sm:text-md font-medium text-gray-700 flex items-center gap-2">
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

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="agree"
                    className="w-4 h-4 rounded border-gray-300 accent-brand-500 focus:ring-brand-500/40"
                  />
                  <label htmlFor="agree" className="text-xs sm:text-sm text-gray-600 cursor-pointer select-none">
                    I agree to the <span className="text-brand-600 underline">terms and conditions</span>
                  </label>
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
                <div className="text-xs text-gray-400 text-center">or</div>
                <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-brand-600 text-sm sm:text-md font-semibold underline hover:text-amber-600 transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                <Link
                  to="/forgotpassword"
                  className="text-brand-600 text-sm sm:text-md font-semibold underline hover:text-amber-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </p>
              {user && (
                <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-1 flex items-center justify-center gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold underline hover:text-amber-600 transition-colors"
                  >
                    <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                    <span>Go to dashboard</span>
                  </Link>
                </p>
              )}
            </form>
          </div>

          {/* Image Section - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
            <img
              src={images.Login}
              alt="Creative login illustration"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-#FC9E4F/20 via-transparent to-transparent"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
