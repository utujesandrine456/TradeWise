import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import Signupimage from './assets/Login.jpg'
import { userAPI } from './services1/api'

const Login = () => {
  const [formData, setFormData] = useState({
    business_email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.login(formData);
      
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirect based on user role and profile completion
        if (response.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          // Check if user has completed business profile
          try {
            const profileResponse = await userAPI.getBusinessProfile(response.user.id);
            if (profileResponse.success && profileResponse.data) {
              navigate('/dashboard');
            } else {
              navigate('/land');
            }
          } catch (profileError) {
            // If no profile exists, redirect to land page
            navigate('/land');
          }
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="flex w-full h-screen">
                    <div className='w-1/2 h-[100vh] flex items-center justify-center'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-3 w-[500px]'>
                <div className='flex flex-col gap-2'>
                <h2 className="text-4xl font-bold text-[#BE741E] text-center">Login</h2>
                <p className='text-normal text-center mb-4'>Welcome back. Enter your credentials</p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                    {error}
                  </div>
                )}
             
                <div className="flex flex-col gap-2 mb-4 ">
                <label htmlFor="business_email" className="text-normal font-medium text-gray-700">Business Email:</label>
                <input 
                    type="email" 
                    name="business_email"
                    placeholder='Email'
                    value={formData.business_email}
                    onChange={handleChange}
                    required
                    className='px-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
                />
                </div>

                <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-normal font-medium text-gray-700">Password:</label>
                <input 
                    type="password" 
                    name="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                disabled={loading}
                className='w-full py-2 px-4 mt-4 bg-[#BE741E] text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                {loading ? 'Signing in...' : 'Login'}
                </button>

                <p className='text-[16px] text-center text-gray-600'>Don't have an account? <Link to="/signup" className='text-[#BE741E] text-normal font-bold underline'>Signup</Link></p>
            </form>
            </div>

            <div className='w-1/2 h-[100vh] flex items-center justify-center bg-gray-50'>
                <img src={Signupimage} alt="login" className='w-full h-full object-cover' />
            </div>
        </div> 
    </>
  )
}

export default Login;