import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginimage from '../assets/Login.jpg';
import { Eye, EyeOff, Sparkles, ArrowRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({ enterpriseName: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword') setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const success = await signup(formData);
      if (success) {
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error("Registration failed")
      }
    } catch (err) {
      toast.error(err.message.includes('exists') ? 'A user with this email already exists' : 'Registration failed. Try again.')
    } finally {
      setLoading(false);
    }

  };

  return (
  <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />

    
    <div className={`${dark ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `url("${Loginimage}")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(12px) brightness(0.9)'}}></div>

        <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="z-10 fixed top-5 right-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition">
          {dark ? <Sun size={18} className="text-amber-300"/> : <Moon size={18} className="text-gray-700"/>}
        </button>

        <div className="relative flex w-full max-w-6xl h-auto my-10 rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
          {/* Form Section */}
          <div className="w-1/2 flex flex-col justify-center p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] relative">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-brand-500/10 rounded-full -mr-10 animate-float"></div>

            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-white/90">
                  <Sparkles size={16}/> Let's build something brilliant
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-brand-500 to-amber-600 bg-clip-text text-transparent">
                  Create your account
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">A few details and you’re in.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm animate-pulse">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm animate-pulse">
                  {success}
                </div>
              )}

              <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-md font-medium text-gray-700">Enterprise Name</label>
                <input
                  type="text"
                  name="enterpriseName"
                  placeholder="Enterprise Name"
                  value={formData.enterpriseName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                />
              </div>

                <div className="space-y-2">
                <label className="text-md font-medium text-gray-700">Business Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                />
                </div>

                <div className="space-y-2 relative">
                <label className="text-md font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>

                <div className="space-y-2 relative">
                <label className="text-md font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-sm bg-white/80 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-brand-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                </div>

                <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-4 h-4 rounded border-gray-300 accent-brand-500 focus:ring-brand-500/40"
                />
                <label htmlFor="agree" className="text-sm text-gray-600 cursor-pointer select-none">
                  I agree to the <span className="text-brand-600 underline">terms and conditions</span>
                </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-1 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">Create account <ArrowRight size={18}/></span>
                )}
              </button>

              <div className="grid grid-cols-3 items-center gap-3 mt-1">
                <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
                <div className="text-xs text-gray-400 text-center">or</div>
                <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-soft transition">Google</button>
                <button type="button" className="py-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-soft transition">Apple</button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 font-semibold underline hover:text-amber-600">
                  Login
                </Link>
              </p>
            </form>
          </div>

        
          <div className="w-1/2 relative overflow-hidden">
            <img
              src={Loginimage}
              alt="Creative signup illustration"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </>
    
  );
};

export default Signup;
