import React, { useState } from 'react'
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
      </div>
    </div>
  )
}

export default Resetpassword;
