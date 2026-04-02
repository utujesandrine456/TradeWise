import React, { useState } from 'react'
<<<<<<< HEAD
import images from '../utils/images';

const Resetpassword = () => {
  const [isloading, setIsloading] = useState(true);

  return (
    <div className='bg-#FC9E4F min-h-screen flex flex-col lg:flex-row'>
      <div className='hidden lg:block lg:w-1/2 h-64 lg:h-screen flex items-center justify-center bg-gray-50'>
        <img src={images.Login} alt="login" className='w-full h-full object-cover' />
      </div>
      
      <div className='flex flex-col bg-white w-full lg:w-1/2 min-h-screen justify-center p-4 sm:p-6 lg:p-10'>
        <div className='max-w-md mx-auto w-full'>
          <h1 className='text-#FC9E4F text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold my-4 text-center mb-6 sm:mb-8 lg:mb-10'>
            Welcome Back at <span className='text-[#FC9E4F]'>TradeWise</span>
          </h1>
          <p className='text-#FC9E4F/80 text-sm sm:text-base text-center mb-6 sm:mb-8 px-4'>
            Please provide your current password and enter a new password to reset it.
          </p>
          <div className='flex flex-col space-y-4'>
            <input 
              type="password" 
              placeholder="Current Password" 
              className='w-full py-2.5 sm:py-3 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent' 
            />
            <input 
              type="password" 
              placeholder="New Password" 
              className='w-full py-2.5 sm:py-3 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent' 
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              className='w-full py-2.5 sm:py-3 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent' 
            />
          </div>
          <button 
            type="submit" 
            disabled={isloading} 
            className="w-full sm:w-auto mx-auto flex justify-center py-2.5 sm:py-3 px-6 mt-6 bg-[#FC9E4F] text-sm text-white font-medium rounded-lg hover:bg-[#cc8b3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200" 
          >
            Reset Password
          </button>
        </div>
=======
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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
      </div>
    </div>
  )
}

<<<<<<< HEAD
export default Resetpassword;
=======
export default Resetpassword;
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
