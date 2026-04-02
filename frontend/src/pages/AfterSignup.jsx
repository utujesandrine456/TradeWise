import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.module.css';
import backendApi from '../utils/axiosInstance';
import { handleError } from '../utils/handleError';
import { toast } from '../utils/toast';
import { CgSpinner } from 'react-icons/cg';
import { useAuth } from '../hooks/useAuth';

const AfterSignup = () => {
  const { trader } = useAuth();
  const [formData, setFormData] = useState({
    name: trader?.name || '',
    enterpriseDescription: '',
    currency: '',
    businessType: '',
    industry: '',
    foundedYear: '',
    description: '',
    website: '',
    address: '',
    businessHours: '',
    phoneNumber: '',
    anualRevenue: '',
    numberOfEmployees: '',
    paymentMethod: '',
    targetMarket: '',
    competitors: '',
    goals: '',
    sendMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // All fields are optional per backend schema
  const requiredKeys = ['name'];
  const progress = useMemo(() => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter(value =>
      value !== '' && value !== null && value !== undefined
    ).length;
    return Math.min(100, Math.round((filled / total) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      // Transform form data to match backend schema
      const submitData = {};

      // String fields - convert empty strings to undefined
      const stringFields = [
        'enterpriseDescription', 'name', 'currency', 'businessType',
        'industry', 'description', 'website', 'address', 'businessHours',
        'phoneNumber', 'targetMarket', 'competitors', 'goals', 'sendMessage', 'paymentMethod'
      ];

      stringFields.forEach(field => {
        if (formData[field] && String(formData[field]).trim() !== '') {
          submitData[field] = String(formData[field]).trim();
        }
      });

      // Numeric fields
      if (formData.anualRevenue && String(formData.anualRevenue).trim() !== '') {
        const revenue = Number(formData.anualRevenue);
        if (!isNaN(revenue)) submitData.anualRevenue = revenue;
      }

      if (formData.numberOfEmployees && String(formData.numberOfEmployees).trim() !== '') {
        const employees = Number(formData.numberOfEmployees);
        if (!isNaN(employees)) submitData.numberOfEmployees = Math.floor(employees);
      }

      if (formData.foundedYear && String(formData.foundedYear).trim() !== '') {
        const year = Number(formData.foundedYear);
        if (!isNaN(year)) submitData.foundedYear = Math.floor(year);
      }

      await backendApi.post('/auth/onboarding', submitData);
      toast.success('Business profile updated successfully!');
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = requiredKeys.every(k => !!formData[k] || k === 'name' && !!trader?.name);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50 py-10 px-4 sm:px-6 lg:px-8 font-afacad">
      <div className="max-w-6xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-brand-500 to-amber-500 text-white text-center py-6 px-6 shadow-lg mb-6 rounded-t-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold">Complete Your Business Profile</h1>
          <p className="mt-1 text-sm sm:text-base opacity-90">Welcome to TradeWise! Let's set up your premium business profile.</p>
          <div className="mt-4 mx-auto max-w-md">
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-1 text-xs opacity-90">{progress}% complete</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-b-3xl overflow-hidden border border-white/40 border-t-0">
          <div className="p-6 sm:p-8 space-y-6">
            {success && <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl animate-fadeIn">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section: Basic Info */}
              <Section title="Basic Information" subtitle="Tell us about your business.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Business Name *" name="name" value={formData.name} onChange={handleChange} required placeholder="Your business name" />
                  <InputField label="Enterprise Description" name="enterpriseDescription" value={formData.enterpriseDescription} onChange={handleChange} placeholder="Brief description of your enterprise" />
                  <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Franchise', 'Other']} />
                  <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology, Retail, Manufacturing" />
                  <InputField label="Founded Year" type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} />
                  <InputField label="Currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="USD, EUR, etc." />
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
                  <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Business phone number" />
                  <InputField label="Website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
                  <InputField label="Business Hours" name="businessHours" value={formData.businessHours} onChange={handleChange} placeholder="Monday-Friday 9AM-6PM" />
                </div>
              </Section>

              {/* Financial Info */}
              <Section title="Scale" subtitle="A quick sense of size.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Annual Revenue" type="number" name="anualRevenue" value={formData.anualRevenue} onChange={handleChange} placeholder="Annual revenue amount" />
                  <InputField label="Number of Employees" type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Number of employees" />
                </div>
              </Section>

              {/* Payments */}
              <Section title="Payments" subtitle="What do you accept?">
                <SelectField label="Primary Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={['Cash', 'Bank Transfer', 'Mobile Money', 'Credit Card', 'Debit Card', 'PayPal', 'Check', 'Crypto', 'Other']} />
              </Section>

              {/* Business Strategy */}
              <Section title="Strategy" subtitle="Who, and how will you serve them?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextAreaField label="Target Market" name="targetMarket" value={formData.targetMarket} onChange={handleChange} placeholder="Describe your target market..." rows={2} />
                  <TextAreaField label="Competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors..." rows={2} />
                </div>
                <TextAreaField label="Business Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="Short-term and long-term goals..." rows={3} />
                <TextAreaField label="Message" name="sendMessage" value={formData.sendMessage} onChange={handleChange} placeholder="Any additional message..." rows={2} />
              </Section>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-xl text-black font-bold hover:bg-gray-50 transition-all text-sm sm:text-base">Skip for Now</button>
                <button type="submit" disabled={loading || !canProceed} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-brand-500 to-amber-600 text-white rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
                  {loading ? (
                    <>
                      <CgSpinner className="animate-spin" size={18} />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, subtitle, children }) => (
  <div className="bg-white/70 rounded-2xl p-5 border border-gray-200">
    <div className="mb-4">
      <h3 className="text-lg font-bold text-black">{title}</h3>
      {subtitle && <p className="text-sm text-black font-medium">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max }) => (
  <div>
    <label className="block text-sm font-bold text-black">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max}
      className="mt-1 block w-full border border-gray-300 text-black font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-bold text-black">{label}</label>
    <select name={name} value={value} onChange={onChange} className="mt-1 block w-full border border-gray-300 text-black font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80">
      <option value="" className="text-gray-400">Select {label.toLowerCase()}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-bold text-black">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="mt-1 block w-full border border-gray-300 text-black font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80" />
  </div>
);

export default AfterSignup;
