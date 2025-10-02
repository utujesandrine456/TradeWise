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
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('Saving your profile...');
    console.log('AfterSignup form data (UI only):', formData);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Profile saved. You can proceed to the dashboard.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#BE741E] text-white text-center py-8 px-6">
          <h1 className="text-4xl font-bold">Complete Your Business Profile</h1>
          <p className="mt-2 text-lg">Welcome to TradeWise! Let’s set up your premium business profile.</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Success/Error Messages */}
          {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg animate-fadeIn">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg animate-fadeIn">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Business Name *" name="business_name" value={formData.business_name} onChange={handleChange} required placeholder="Your business name" />
              <SelectField label="Business Type" name="business_type" value={formData.business_type} onChange={handleChange} options={['Sole Proprietorship','Partnership','Corporation','LLC','Franchise','Other']} />
              <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology, Retail, Manufacturing" />
              <InputField label="Founded Year" type="number" name="founded_year" value={formData.founded_year} onChange={handleChange} placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} />
            </div>

            {/* Description */}
            <TextAreaField label="Business Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your business, products, and services..." />

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Business address" rows={2} />
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Business phone number" />
              <InputField label="Website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
              <InputField label="Business Hours" name="business_hours" value={formData.business_hours} onChange={handleChange} placeholder="Monday-Friday 9AM-6PM" />
            </div>

            {/* Financial Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Annual Revenue" type="number" name="annual_revenue" value={formData.annual_revenue} onChange={handleChange} placeholder="Annual revenue amount" />
              <InputField label="Number of Employees" type="number" name="employee_count" value={formData.employee_count} onChange={handleChange} placeholder="Number of employees" />
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Cash','Credit Card','Debit Card','Bank Transfer','Mobile Money','PayPal','Check','Crypto'].map(method => (
                  <label key={method} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
                    <input type="checkbox"  className="h-4 w-4 accent-[#BE741E] border-gray-300 rounded focus:ring-[#BE741E]" name="payment_methods" value={method} checked={formData.payment_methods.includes(method)} onChange={handleChange} />
                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>


            {/* Business Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField label="Target Market" name="target_market" value={formData.target_market} onChange={handleChange} placeholder="Describe your target market..." rows={2} />
              <TextAreaField label="Competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors..." rows={2} />
            </div>
            <TextAreaField label="Business Goals" name="business_goals" value={formData.business_goals} onChange={handleChange} placeholder="Short-term and long-term goals..." rows={3} />


            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all">Skip for Now</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-[#BE741E] text-white rounded-md hover:bg-[#993f0c] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Input Component
const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max}
      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#BE741E] focus:border-[#BE741E] transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#BE741E] focus:border-[#BE741E] transition-all">
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#BE741E] focus:border-[#BE741E] transition-all" />
  </div>
);

export default AfterSignup;
