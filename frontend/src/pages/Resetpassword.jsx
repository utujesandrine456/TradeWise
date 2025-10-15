import React, { useState } from 'react'
import Signupimage from '../assets/Login.jpg'
import backendApi from '../utils/axiosInstance'
import { toast } from 'react-toastify'

const Resetpassword = () => {
  const [isloading, setIsloading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setIsloading(true);
    try {
      await backendApi.post('/auth/password/reset', { email, password, otp: localStorage.getItem('resetOtp') || '' });
      toast.success('Password reset successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Reset failed');
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div className='bg-black h-screen flex flex-1 justify-between'>
      <div className='w-1/2 h-[100vh] flex items-center justify-center bg-gray-50'>
        <img src={Signupimage} alt="login" className='w-full h-full object-cover' />
      </div>
      
      <div className='flex flex-col bg-white pt-10'>
        <h1 className='text-black text-5xl font-bold my-4 text-center mb-10'>Welcome Back at <span className='text-[#BE741E]'>TradeWise</span></h1>
        <p className='text-black/80 text-normal text-center px-auto mb-4'>Please provide a valid email address so we can send you <br></br>  a code or link to reset your password.</p>
        <div className='flex flex-col space-y-4 mx-10 my-4'>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className='w-100 py-2 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="New Password" className='w-100 py-2 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' />
          <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type="password" placeholder="Confirm Password" className='w-100 py-2 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' />
        </div>
        <button onClick={handleReset} type="button" disabled={isloading} className="flex w-40 mx-auto text-center py-2 px-6 mt-4 bg-[#BE741E] text-sm text-white font-medium rounded-lg hover:bg-[#cc8b3a] disabled:opacity-50 disabled:cursor-not-allowed" >{isloading ? 'Resetting...' : 'Reset Password'}</button>
      </div>
    </div>
  )
}

export default Resetpassword;