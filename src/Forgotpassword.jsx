import React from 'react'
import Signupimage from './assets/Login.jpg'

const Forgotpassword = () => {
  return (
    <div className='bg-black h-screen flex flex-1 justify-between'>
      <div className='flex flex-col items-center justify-center bg-white '>
        <h1 className='text-black text-5xl font-bold my-4 text-center mb-10'>Welcome Back at <span className='text-[#BE741E]'>TradeWise</span></h1>
        <p className='text-black/80 text-normal text-center px-auto mb-4'>Please provide a valid email address so we can send you <br></br>  a code or link to reset your password.</p>
        <div className='space-x-4'>
          <input type="email" placeholder="Email" className='w-100 py-2 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' />
          <button type="submit" className=" py-2 px-6 mt-4 bg-[#BE741E] text-sm text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" >Forgot Password</button>
        </div>
      </div>

      <div className='w-1/2 h-[100vh] flex items-center justify-center bg-gray-50'>
        <img src={Signupimage} alt="login" className='w-full h-full object-cover' />
      </div>
    </div>
  )
}

export default Forgotpassword;