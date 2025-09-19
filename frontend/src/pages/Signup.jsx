import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom'
import Loginimage from '../assets/Login.jpg'
import { useAuthContext } from '../contexts/AuthContext.jsx'
import { Eye, EyeOff } from 'lucide-react'

const Signup = () => {
  const { isAuthenticated, signup } = useAuthContext();

  const [confirmPassword, setConfirmPassword] = useState(''); // 'confirmPassword' is not send to the backend
  const [formData, setFormData] = useState({ enterpriseName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'confirmPassword') setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== confirmPassword) {
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
      const success = await signup({
        enterpriseName: formData.enterpriseName,
        email: formData.email,
        password: formData.password,
      });
      
      if (success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        localStorage.setItem('userEmail', formData.email);
        
        setTimeout(() => {
          localStorage.setItem('verifyAccount', JSON.stringify({ verify: true, email: formData.email }));
          navigate('/email');
        }, 2000);
      } else {
        setError('Registration failed');
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
          {/* Header */}
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
            {/* Enterprise Name */}
            <label htmlFor="enterpriseName" className="text-[15px]  font-medium text-gray-700">Enterprise Name:</label>
            <input 
              type="text" 
              name="enterpriseName"
                placeholder='Enterprise Name'
                value={formData.enterpriseName}
                onChange={handleChange}
                required
                className='px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
              />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1  mb-3">
            <label htmlFor="email" className="text-[15px] font-medium text-gray-700">Email:</label>
            <input 
              type="email" 
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
              className='px-4 py-2 border  text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="password" className="text-[15px] font-medium text-gray-700">Password:</label>
            <div className='relative'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                required
                className='px-4 py-2 pr-10 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent w-full'
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1  mb-1">
            <label htmlFor="confirmPassword" className="text-[15px] font-medium text-gray-700">Confirm Password:</label>
            <div className='relative'>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                placeholder='Confirm Password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='px-4 py-2 pr-10 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent w-full'
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 mt-2 ">
            <input 
              type="checkbox" 
              id="agree"
              className='w-4 h-4 rounded border-gray-300 accent-[#BE741E]'
            />
            <label htmlFor="agree" className="text-[15px] text-gray-600">I agree to the terms and conditions</label>
          </div>

          {/* Submit Button */}
          <button 
             type="submit"
             disabled={loading}
             className='w-full py-2 px-4 mt-3 bg-[#BE741E] text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
           >
             {loading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Already have an account? */}
          <p className='text-[16px] text-center  text-gray-600'>Already have an account? <Link to="/login" className='text-[#BE741E] text-normal font-bold underline'>Login</Link></p>
        </form>
      </div> 
    </>
  )
}

export default Signup;