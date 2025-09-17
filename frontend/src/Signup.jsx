import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import Loginimage from './assets/Login.jpg'
import { userAPI } from './services1/api'


const Signup = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    business_email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');


    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.register({
        company_name: formData.company_name,
        business_email: formData.business_email,
        password: formData.password,
        role: 'user' 
      });
      
      if (response.success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        localStorage.setItem('userEmail', formData.business_email);
        
        setTimeout(() => {
          navigate('/email');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already exists')) {
        setError('A user with this business email already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen bg-[#FFF]">

        <div className='w-70 h-[100vh] flex float-right'>
          <img src={Loginimage} alt="login" className='w-[650px] object-cover '/>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-3 w-[500px] mx-auto my-8'>
          <div className='flex flex-col gap-2'>
            <h2 className="text-4xl font-bold text-[#BE741E]  text-center">Create Account</h2>
            <p className='text-normal text-center mb-4'>Join Us today please enter your details</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              {success}
            </div>
          )}
          
                      <div className="flex flex-col gap-1 mb-3">
              <label htmlFor="company_name" className="text-[15px]  font-medium text-gray-700">Company Name:</label>
              <input 
                type="text" 
                name="company_name"
                placeholder='Company Name'
                value={formData.company_name}
                onChange={handleChange}
                required
                className='px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
              />
            </div>

                      <div className="flex flex-col gap-1  mb-3">
              <label htmlFor="business_email" className="text-[15px] font-medium text-gray-700">Business Email:</label>
              <input 
                type="email" 
                name="business_email"
                placeholder='Email'
                value={formData.business_email}
                onChange={handleChange}
                required
                className='px-4 py-2 border  text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
              />
            </div>

                      <div className="flex flex-col gap-1  mb-3">
              <label htmlFor="password" className="text-[15px] font-medium text-gray-700">Password:</label>
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

                      <div className="flex flex-col gap-1  mb-1">
              <label htmlFor="confirmPassword" className="text-[15px] font-medium text-gray-700">Confirm Password:</label>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
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
             disabled={loading}
             className='w-full py-2 px-4 mt-3 bg-[#BE741E] text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
           >
             {loading ? 'Creating account...' : 'Create Account'}
           </button>

          <p className='text-[16px] text-center  text-gray-600'>Already have an account? <Link to="/login" className='text-[#BE741E] text-normal font-bold underline'>Login</Link></p>
        </form>
      </div> 
    </>
  )
}

export default Signup;