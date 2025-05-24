import React from 'react'
import {Link } from 'react-router-dom'
import Login from './assets/Login.jpg'

const Signup = () => {
  return (
    <>
        <div className="flex w-full h-screen">
            <div className='w-1/2 h-[100vh] flex items-center justify-center'>
            <form className='flex flex-col gap-4 p-3 w-[500px]'>
                <div className='flex flex-col gap-2'>
                <h2 className="text-4xl font-bold text-[#BE741E] text-center">Login</h2>
                <p className='text-normal text-center mb-4'>Welcome back. Enter your credentials</p>
                </div>
                
            
                <div className="flex flex-col gap-2 mb-4 ">
                <label htmlFor="email" className="text-normal font-medium text-gray-700">Business Email:</label>
                <input 
                    type="email" 
                    placeholder='Email'
                    className='px-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
                />
                </div>

                <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-normal font-medium text-gray-700">Password:</label>
                <input 
                    type="password" 
                    placeholder='Password'
                    className='px-4 py-2 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
                />
                </div>

                
                <div className="flex items-center gap-2 mt-3">
                <input 
                    type="checkbox" 
                    id="agree"
                    className='w-4 h-4 rounded border-gray-300 accent-[#BE741E]'
                />
                <label htmlFor="agree" className="text-[15px] text-gray-600">I agree to the terms and conditions</label>
                </div>
            
                <button 
                type="submit"
                className='w-full py-2 px-4 mt-4 bg-[#BE741E] text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200'
                >
                Login
                </button>

                <p className='text-[16px] text-center text-gray-600'>Don't have an account? <Link to="/signup" className='text-[#BE741E] text-normal font-bold underline'>Signup</Link></p>
            </form>
            </div>

            <div className='w-1/2 h-[100vh] flex items-center justify-center bg-gray-50'>
                <img src={Login} alt="login" className='w-full h-full object-cover' />
            </div>
        </div> 
    </>
  )
}

export default Signup;