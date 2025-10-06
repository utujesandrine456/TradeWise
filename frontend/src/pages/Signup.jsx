import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loginimage from '../assets/Login.jpg';
import { Eye, EyeOff } from 'lucide-react';
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

    
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url("${Loginimage}")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px)',}}></div>

      <div className="relative flex w-full max-w-6xl h-[95vh] rounded-3xl shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
        {/* Form Section */}
        <div className="w-1/2 flex flex-col justify-center p-8 bg-gradient-to-b from-white to-amber-50/50 relative">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-[#BE741E]/10 rounded-full -mr-10"></div>

          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#BE741E] to-amber-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">Join us today, please enter your details</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BE741E]/50 focus:border-transparent text-sm bg-white/80"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BE741E]/50 focus:border-transparent text-sm bg-white/80"
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BE741E]/50 focus:border-transparent text-sm bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-[#BE741E]"
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BE741E]/50 focus:border-transparent text-sm bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-500 hover:text-[#BE741E]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-4 h-4 rounded border-gray-300 accent-[#BE741E] focus:ring-[#BE741E]/50"
                />
                <label htmlFor="agree" className="text-sm text-gray-600 cursor-pointer select-none">
                  I agree to the <span className="text-[#BE741E] underline">terms and conditions</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-[#BE741E] to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-[#BE741E] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#BE741E] font-semibold underline hover:text-amber-600">
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
  </>
    
  );
};

export default Signup;
