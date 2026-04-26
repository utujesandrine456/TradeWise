import React, { useState } from 'react'
import backendApi from '../utils/axiosInstance'
import { toast } from '../utils/toast'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const Resetpassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
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
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, password, otp }
        : { phone: identifier, password, otp };

      await backendApi.post('/auth/password/reset', payload);
      toast.success('Identity Synchronized. Access Restored.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Synchronization failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen flex overflow-hidden bg-[#181A1E] font-Urbanist'>
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#09111E]">
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="diamondReset" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.4)" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondReset)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-white font-nosifer font-black text-5xl">Stocka</h1>
        </div>

        <div className="relative z-10">
          <h2 className="text-white font-black text-6xl leading-tight mb-6">
            Secure<br /><span className="text-brand-500">Override.</span>
          </h2>
          <p className="text-white/30 font-bold text-xl leading-relaxed max-w-sm">
            Updating your security credentials across the global <span className="font-nosifer">Stocka</span> nodes.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white/40 font-black text-[10px]">
          <ShieldCheck size={16} className="text-brand-500" /> Multi-Layer Encryption Active
        </div>
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[#F9FBFF] relative overflow-y-auto'>
        <button
          onClick={() => navigate('/login')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#09111E]/40 hover:text-[#09111E] font-black text-xs transition-all"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div className='w-full max-w-md'>
          <div className='mb-12 text-center lg:text-left'>
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-[10px] font-black mb-5 text-center">
              Credential Synchronization
            </div>
            <h2 className="text-5xl font-black text-[#09111E] mb-3 leading-tight">Reset<br />Key</h2>
            <p className="text-[#09111E]/40 font-bold">Establish your new security parameters.</p>
          </div>

          <form onSubmit={handleReset} className='space-y-6 bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-brand-100'>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#09111E]/60 pl-1">Identified Network ID</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                placeholder="+250 78x... or email"
                className='w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20'
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#09111E]/60 pl-1">New Secure Key</label>
              <div className="relative group">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className='w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20'
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#09111E]/20 hover:text-[#09111E] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#09111E]/60 pl-1">Confirm Update</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type="password"
                placeholder="Repeat security key"
                className='w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20'
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#09111E] text-white font-black text-sm rounded-2xl hover:shadow-[0_20px_50px_-10px_rgba(9,17,30,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> Synchronize Key <ArrowRight size={18} /> </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Resetpassword;
