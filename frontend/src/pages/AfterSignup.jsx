import React, { useState, useMemo } from 'react';
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

  const requiredKeys = ['business_name'];
  const progress = useMemo(() => {
    const total = 10; // virtual total steps
    let filled = 0;
    if (formData.business_name) filled += 3;
    if (formData.business_type) filled += 1;
    if (formData.industry) filled += 1;
    if (formData.description) filled += 1;
    if (formData.address || formData.phone || formData.website) filled += 2;
    if (formData.payment_methods.length) filled += 1;
    if (formData.business_goals) filled += 1;
    return Math.min(100, Math.round((filled / total) * 100));
  }, [formData]);

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

  const canProceed = requiredKeys.every(k => !!formData[k]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/40">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-500 to-amber-500 text-white text-center py-10 px-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Complete Your Business Profile</h1>
          <p className="mt-2 text-base sm:text-lg opacity-90">Welcome to TradeWise! Let’s set up your premium business profile.</p>
          <div className="absolute left-6 right-6 -bottom-4">
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-2 text-xs opacity-90">{progress}% complete</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Success/Error Messages */}
          {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl animate-fadeIn">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl animate-fadeIn">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Basic Info */}
            <Section title="Basic Information" subtitle="Tell us about your business.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Business Name *" name="business_name" value={formData.business_name} onChange={handleChange} required placeholder="Your business name" />
                <SelectField label="Business Type" name="business_type" value={formData.business_type} onChange={handleChange} options={['Sole Proprietorship','Partnership','Corporation','LLC','Franchise','Other']} />
                <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology, Retail, Manufacturing" />
                <InputField label="Founded Year" type="number" name="founded_year" value={formData.founded_year} onChange={handleChange} placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} />
              </div>
            </Section>

            {/* Description */}
            <Section title="Description" subtitle="What do you do?">
              <TextAreaField label="Business Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your business, products, and services..." />
            </Section>

            {/* Contact Info */}
            <Section title="Contacts" subtitle="How can customers reach you?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextAreaField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Business address" rows={2} />
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Business phone number" />
                <InputField label="Website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
                <InputField label="Business Hours" name="business_hours" value={formData.business_hours} onChange={handleChange} placeholder="Monday-Friday 9AM-6PM" />
              </div>
            </Section>

            {/* Financial Info */}
            <Section title="Scale" subtitle="A quick sense of size.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Annual Revenue" type="number" name="annual_revenue" value={formData.annual_revenue} onChange={handleChange} placeholder="Annual revenue amount" />
                <InputField label="Number of Employees" type="number" name="employee_count" value={formData.employee_count} onChange={handleChange} placeholder="Number of employees" />
              </div>
            </Section>

            {/* Payment Methods */}
            <Section title="Payments" subtitle="What do you accept?">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Cash','Credit Card','Debit Card','Bank Transfer','Mobile Money','PayPal','Check','Crypto'].map(method => (
                    <label key={method} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
                      <input type="checkbox"  className="h-4 w-4 accent-brand-500 border-gray-300 rounded focus:ring-brand-500/40" name="payment_methods" value={method} checked={formData.payment_methods.includes(method)} onChange={handleChange} />
                      <span className="ml-2 text-sm text-gray-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Section>

            {/* Business Strategy */}
            <Section title="Strategy" subtitle="Who, and how will you serve them?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextAreaField label="Target Market" name="target_market" value={formData.target_market} onChange={handleChange} placeholder="Describe your target market..." rows={2} />
                <TextAreaField label="Competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors..." rows={2} />
              </div>
              <TextAreaField label="Business Goals" name="business_goals" value={formData.business_goals} onChange={handleChange} placeholder="Short-term and long-term goals..." rows={3} />
            </Section>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all">Skip for Now</button>
              <button type="submit" disabled={loading || !canProceed} className="px-6 py-2 bg-gradient-to-r from-brand-500 to-amber-600 text-white rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, children }) => (
  <div className="bg-white/70 rounded-2xl p-5 border border-gray-200">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Input Component
const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max}
      className="mt-1 block w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select name={name} value={value} onChange={onChange} className="mt-1 block w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80">
      <option value="">Select {label.toLowerCase()}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="mt-1 block w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80" />
  </div>
);

export default AfterSignup;
