import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import Signupimage from '../assets/Login.jpg';
import { EyeOff, Eye } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const Login = () => {
  const {isAuthenticated, login} = useAuthContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      login(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.log("Error: ", error);
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
                  <label htmlFor="email" className="text-normal font-medium text-gray-700">Business Email:</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='px-4 py-2 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent'
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

                <p className='text-[16px] text-center text-gray-600'>
                  Don't have an account? 
                  <Link to="/signup" className='text-[#BE741E] text-normal font-bold underline'>
                    Signup
                  </Link>
                </p>
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