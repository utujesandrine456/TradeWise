import React, { useState } from 'react'
import images from '../utils/images';
import backendApi from '../utils/axiosInstance'
import { toast } from '../utils/toast'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Resetpassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    if (e) e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const otp = localStorage.getItem('resetOtp') || '';
      await backendApi.post('/auth/password/reset', { email, password, otp });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='bg-[#09111E] min-h-screen flex flex-col lg:flex-row font-Urbanist'>
      <div className='hidden lg:block lg:w-1/2 h-screen'>
        <img src={images.Login} alt="login" className='w-full h-full object-cover' />
      </div>

      <div className='flex flex-col bg-white w-full lg:w-1/2 min-h-screen justify-center p-6 sm:p-10 lg:p-16'>
        <div className='max-w-md mx-auto w-full py-12'>
          <h1 className="text-brand-900 text-5xl font-bold text-center mb-8 tracking-tight">
            Reset <span className="block text-brand-400">Password</span>
          </h1>
          <p className="text-sm font-semibold text-brand-300 text-center mb-10 px-4 opacity-70">
            Enter your email and choose a new secure password for your account.
          </p>

          <form onSubmit={handleReset} className='flex flex-col space-y-5'>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900 ml-1">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@enterprise.com"
                className='w-full py-4 px-6 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-brand-900 font-bold placeholder:text-brand-300'
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900 ml-1">New Password</label>
              <div className="relative group">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className='w-full py-4 px-6 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-brand-900 font-bold placeholder:text-brand-300'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-300 hover:text-brand-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900 ml-1">Confirm Password</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="••••••••"
                className='w-full py-4 px-6 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-brand-900 font-bold placeholder:text-brand-300'
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-brand-900 text-white font-bold text-sm rounded-md hover:bg-brand-800 transition-all shadow-2xl relative overflow-hidden group/res"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/res:translate-x-0 transition-transform duration-500" />
              <span className="relative z-10">{isLoading ? 'Updating Password...' : 'Save New Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-brand-900 font-bold text-xs hover:opacity-70 transition-opacity mt-8 block w-full text-center"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Resetpassword;
