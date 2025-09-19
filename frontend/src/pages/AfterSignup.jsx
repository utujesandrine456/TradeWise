import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.module.css';

const AfterSignup = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    industry: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    tax_id: '',
    business_license: '',
    annual_revenue: '',
    employee_count: '',
    founded_year: '',
    business_hours: '',
    payment_methods: [],
    target_market: '',
    competitors: '',
    business_goals: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && name === 'payment_methods') {
      const checked = e.target.checked;
      setFormData(prev => ({
        ...prev,
        payment_methods: checked 
          ? [...prev.payment_methods, value]
          : prev.payment_methods.filter(method => method !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('Saving your profile (UI only)...');
    console.log('AfterSignup form data (UI only):', formData);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Profile saved (UI only). You can proceed to the dashboard.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Your Business Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome to TradeWise! Let's set up your business profile.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          
          {/* Basic Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                name="business_name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <select
                name="business_type"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.business_type}
                onChange={handleChange}
              >
                <option value="">Select business type</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Corporation">Corporation</option>
                <option value="LLC">LLC</option>
                <option value="Franchise">Franchise</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Retail, Manufacturing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Founded Year
              </label>
              <input
                type="number"
                name="founded_year"
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.founded_year}
                onChange={handleChange}
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your business, products, and services..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.address}
                onChange={handleChange}
                placeholder="Business address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Business phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Hours
              </label>
              <input
                type="text"
                name="business_hours"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.business_hours}
                onChange={handleChange}
                placeholder="e.g., Monday-Friday 9AM-6PM"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Revenue
              </label>
              <input
                type="number"
                name="annual_revenue"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.annual_revenue}
                onChange={handleChange}
                placeholder="Annual revenue amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Employees
              </label>
              <input
                type="number"
                name="employee_count"
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.employee_count}
                onChange={handleChange}
                placeholder="Number of employees"
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accepted Payment Methods
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Mobile Money', 'PayPal', 'Check', 'Crypto'].map((method) => (
                <label key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    name="payment_methods"
                    value={method}
                    checked={formData.payment_methods.includes(method)}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Business Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Market
              </label>
              <textarea
                name="target_market"
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.target_market}
                onChange={handleChange}
                placeholder="Describe your target market..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Competitors
              </label>
              <textarea
                name="competitors"
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.competitors}
                onChange={handleChange}
                placeholder="List your main competitors..."
              />
            </div>
          </div>

          {/* Business Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Goals
            </label>
            <textarea
              name="business_goals"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.business_goals}
              onChange={handleChange}
              placeholder="What are your short-term and long-term business goals?"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AfterSignup;


