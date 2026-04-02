import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.module.css';
import backendApi from '../utils/axiosInstance';
import { handleError } from '../utils/handleError';
import { toast } from '../utils/toast';
import { CgSpinner } from 'react-icons/cg';

const AfterSignup = () => {
  const [formData, setFormData] = useState({
    enterpriseDescription: '',
    name: '',
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
  const requiredKeys = [];
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
    try {
      // Transform form data to match backend schema
      // Convert empty strings to undefined (for optional fields)
      // Convert numeric fields to numbers or undefined
      const submitData = {};
      
      // String fields - convert empty strings to undefined
      const stringFields = [
        'email', 'enterpriseDescription', 'name', 'currency', 'businessType', 
        'industry', 'description', 'website', 'address', 'businessHours', 
        'phoneNumber', 'targetMarket', 'competitors', 'goals', 'sendMessage'
      ];
      
      stringFields.forEach(field => {
        if (formData[field] && formData[field].trim() !== '') {
          submitData[field] = formData[field].trim();
        }
      });
      
      // Numeric fields - convert to numbers or undefined
      if (formData.anualRevenue && String(formData.anualRevenue).trim() !== '') {
        const revenue = Number(formData.anualRevenue);
        if (!isNaN(revenue)) {
          submitData.anualRevenue = revenue;
        }
      }
      
      if (formData.numberOfEmployees && String(formData.numberOfEmployees).trim() !== '') {
        const employees = Number(formData.numberOfEmployees);
        if (!isNaN(employees)) {
          submitData.numberOfEmployees = Math.floor(employees); // Ensure integer
        }
      }
      
      if (formData.foundedYear && String(formData.foundedYear).trim() !== '') {
        const year = Number(formData.foundedYear);
        if (!isNaN(year)) {
          submitData.foundedYear = Math.floor(year); // Ensure integer
        }
      }
      
      // Payment method - only include if not empty
      if (formData.paymentMethod && formData.paymentMethod.trim() !== '') {
        submitData.paymentMethod = formData.paymentMethod;
      }
      
      const res = await backendApi.post('/auth/onboarding', submitData);
      setSuccess('Profile saved successfully!');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (error) {
      const errorMessage = handleError(error);
      
      console.log(errorMessage);
      
      // Handle validation errors (400) with better formatting
      if (error.response?.status === 400) {
        const validationMessage = errorMessage.message;
        // If it's a long validation message, show a shorter version
        if (validationMessage.length > 100) {
          toast.error('Please fill in all required fields correctly');
        } else {
          toast.error(validationMessage);
        }
      } else {
        toast.error(errorMessage.message || 'Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
    
    // setSuccess('Saving your profile...');
    // setTimeout(() => {
    //   setLoading(false);
    //   setSuccess('Profile saved successfully!');
    //   setTimeout(() => navigate('/dashboard'), 1500);
    // }, 800);
  };

  // Since all fields are optional, allow submission anytime (unless loading)
  const canProceed = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-brand-500 to-amber-500 text-white text-center py-4 sm:py-6 px-4 sm:px-6 shadow-lg mb-4 sm:mb-6 rounded-t-2xl sm:rounded-t-3xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Complete Your Business Profile</h1>
          <p className="mt-1 text-xs sm:text-sm lg:text-base opacity-90">Welcome to TradeWise! Let's set up your business profile.</p>
          <div className="mt-3 sm:mt-4 mx-auto max-w-xs sm:max-w-md">
            <div className="w-full h-1.5 sm:h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-1 text-xs opacity-90">{progress}% complete</div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-b-2xl sm:rounded-b-3xl overflow-hidden border border-white/40 border-t-0">

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Success Message */}
          {success && <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl animate-fadeIn">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Basic Info */}
            <Section title="Basic Information" subtitle="Tell us about your business.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Trader's name" />
                <InputField label="Enterprise Description" name="enterpriseDescription" value={formData.enterpriseDescription} onChange={handleChange} placeholder="Brief description of your enterprise" />
                <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Sole Proprietorship','Partnership','Corporation','LLC','Franchise','Other']} />
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

            {/* Payment Methods */}
            <Section title="Payments" subtitle="What do you accept?">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent transition-all bg-white/80">
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit_Card">Credit Card</option>
                  <option value="Debit_Card">Debit Card</option>
                  <option value="Bank_Transfer">Bank Transfer</option>
                  <option value="Mobile_Money">Mobile Money</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Check">Check</option>
                  <option value="Crypto">Crypto</option>
                </select>
              </div>
            </Section>

            {/* Business Strategy */}
            <Section title="Strategy" subtitle="Who, and how will you serve them?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextAreaField label="Target Market" name="targetMarket" value={formData.targetMarket} onChange={handleChange} placeholder="Describe your target market..." rows={2} />
                <TextAreaField label="Competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors..." rows={2} />
              </div>
              <TextAreaField label="Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="Short-term and long-term goals..." rows={3} />
              <TextAreaField label="Message" name="sendMessage" value={formData.sendMessage} onChange={handleChange} placeholder="Any additional message..." rows={2} />
            </Section>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm sm:text-base">Skip for Now</button>
              <button type="submit" disabled={loading || !canProceed} className="w-full sm:w-auto px-6 py-2.5 sm:py-2 bg-gradient-to-r from-brand-500 to-amber-600 text-white rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base">
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
