import React from 'react'
import {Link } from 'react-router-dom'
import Loginimage from './assets/Login.jpg'


const Signup = () => {
  return (
    <>
      <div className="flex w-full h-screen bg-[#FFF]">

        <div className='w-70 h-[100vh] flex float-right'>
          <img src={Loginimage} alt="login" className='w-[650px] object-cover '/>
        </div>

        <form className='flex flex-col gap-4 p-3 w-[500px] mx-auto my-8'>
          <div className='flex flex-col gap-2'>
            <h2 className="text-4xl font-bold text-[#BE741E]  text-center">Create Account</h2>
            <p className='text-normal text-center mb-4'>Join Us today please enter your details</p>
          </div>
          
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="companyname" className="text-[15px]  font-medium text-gray-700">Company Name:</label>
            <input 
              type="text" 
              placeholder='Company Name'
              className='px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
            />
          </div>

          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="email" className="text-[15px] font-medium text-gray-700">Business Email:</label>
            <input 
              type="email" 
              placeholder='Email'
              className='px-4 py-2 border  text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
            />
          </div>

          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="password" className="text-[15px] font-medium text-gray-700">Password:</label>
            <input 
              type="password" 
              placeholder='Password'
              className='px-4 py-2 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
            />
          </div>

          <div className="flex flex-col gap-1  mb-1">
            <label htmlFor="confirm-password" className="text-[15px] font-medium text-gray-700">Confirm Password:</label>
            <input 
              type="password" 
              placeholder='Confirm Password'
              className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
            />
          </div>

          <div className="flex items-center gap-2 mt-2 ">
            <input 
              type="checkbox" 
              id="agree"
              className='w-4 h-4 rounded border-gray-300 accent-[#BE741E]'
            />
            <label htmlFor="agree" className="text-[15px] text-gray-600">I agree to the terms and conditions</label>
          </div>
         
          <button 
            type="submit"
            className='w-full py-2 px-4 mt-3 bg-[#BE741E] text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200'
          >
            Create Account
          </button>

          <p className='text-[16px] text-center  text-gray-600'>Already have an account? <Link to="/login" className='text-[#BE741E] text-normal font-bold underline'>Login</Link></p>
        </form>
      </div> 
    </>
  )
}

export default Signup;