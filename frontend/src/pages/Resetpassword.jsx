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
    <div className='bg-[#FC9E4F] min-h-screen flex flex-col lg:flex-row font-afacad'>
      <div className='hidden lg:block lg:w-1/2 h-screen'>
        <img src={images.Login} alt="login" className='w-full h-full object-cover' />
      </div>

      <div className='flex flex-col bg-white w-full lg:w-1/2 min-h-screen justify-center p-6 sm:p-10 lg:p-16'>
        <div className='max-w-md mx-auto w-full'>
          <h1 className='text-[#FC9E4F] text-4xl sm:text-5xl font-bold text-center mb-8'>
            Reset Your <span className='text-[#FC9E4F]'>Password</span>
          </h1>
          <p className="text-black font-medium text-center mb-10 px-4">
            Please enter your email and your new secure password.
          </p>

          <form onSubmit={handleReset} className='flex flex-col space-y-5'>
            <div className="space-y-1">
              <label className="text-sm font-bold text-black ml-1">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@enterprise.com"
                className='w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all'
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-black ml-1">New Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className='w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FC9E4F]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-black ml-1">Confirm Password</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="••••••••"
                className='w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all'
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 bg-[#FC9E4F] text-white font-bold rounded-xl hover:bg-[#cc8b3a] transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Resetting...' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#FC9E4F] font-bold mt-4 hover:underline"
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
