import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
      toast.success('Business Profile Updated Successfully!');
      setSuccess('Profile Saved Successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage.message || 'Failed To Save Profile. Please Try Again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = requiredKeys.every(k => !!formData[k] || k === 'name' && !!trader?.name);

  return (
    <div className="min-h-screen bg-brand-50 py-12 px-6 lg:px-12 font-Urbanist animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Sticky Header */}
        <div className="sticky top-6 z-50 bg-brand-900 text-white py-10 px-12 shadow-2xl rounded-md border border-white/10 overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Business Profile</h1>
              <p className="text-xs font-semibold opacity-60">Complete your business setup to get started</p>
            </div>
            <div className="w-full md:w-80">
              <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-bold opacity-40">Setup Progress</span>
                <span className="text-2xl font-bold tracking-tight">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-md overflow-hidden shadow-inner p-0.5 border border-white/5">
                <div className="h-full bg-white rounded-md transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.5)]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-[0_50px_100px_-20px_rgba(9,17,30,0.1)] rounded-md overflow-hidden border border-brand-100 relative group">
          <div className="absolute top-0 right-0 w-1 bg-brand-900 h-full" />
          <div className="p-10 sm:p-16 space-y-12">
            {success && <div className="p-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-bold text-sm animate-in zoom-in duration-300">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Section: Basic Info */}
              <Section title="Basic Information" subtitle="Tell us about your business entity.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Business Name *" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Acme Corp" />
                  <InputField label="Short Description" name="enterpriseDescription" value={formData.enterpriseDescription} onChange={handleChange} placeholder="What do you do?" />
                  <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Franchise', 'Other']} />
                  <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., Retail" />
                  <InputField label="Year Founded" type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} />
                  <InputField label="Base Currency" name="currency" value={formData.currency} onChange={handleChange} placeholder="e.g., RWF, USD" />
                </div>
              </Section>

              {/* Description */}
              <Section title="Business Description" subtitle="Provide more details about your operations.">
                <TextAreaField label="Company Bio" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your mission and services..." />
              </Section>

              {/* Contact Info */}
              <Section title="Contact Details" subtitle="How can customers reach you?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TextAreaField label="Business Address" name="address" value={formData.address} onChange={handleChange} placeholder="Office or store location" rows={2} />
                  <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Customer support line" />
                  <InputField label="Website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" />
                  <InputField label="Operating Hours" name="businessHours" value={formData.businessHours} onChange={handleChange} placeholder="e.g., Mon-Fri 8am-6pm" />
                </div>
              </Section>

              {/* Financial Info */}
              <Section title="Business Scale" subtitle="Standard metrics of your company size.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Annual Revenue" type="number" name="anualRevenue" value={formData.anualRevenue} onChange={handleChange} placeholder="Approximate yearly revenue" />
                  <InputField label="Employee Count" type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="Number of staff" />
                </div>
              </Section>

              {/* Payments */}
              <Section title="Payments" subtitle="How do you handle transactions?">
                <SelectField label="Preferred Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={['Cash', 'Bank Transfer', 'Mobile Money', 'Credit/Debit Card', 'Cryptocurrency']} />
              </Section>

              {/* Business Strategy */}
              <Section title="Market Strategy" subtitle="Who are your customers and competitors?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TextAreaField label="Target Market" name="targetMarket" value={formData.targetMarket} onChange={handleChange} placeholder="Describe your target audience..." rows={2} />
                  <TextAreaField label="Key Competitors" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="Who are your main rivals?..." rows={2} />
                </div>
                <TextAreaField label="Business Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="What do you want to achieve?..." rows={3} />
              </Section>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end gap-6 pt-10">
                <button type="button" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-10 py-5 border-2 border-brand-100 rounded-md text-brand-900 font-bold text-xs hover:bg-brand-50 transition-all shadow-xl">Skip for Now</button>
                <button type="submit" disabled={loading || !canProceed} className="w-full sm:w-auto px-10 py-5 bg-brand-900 text-white rounded-md font-bold text-xs hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group/btn">
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                  {loading ? (
                    <>
                      <CgSpinner className="animate-spin" size={20} />
                      <span className="relative z-10">Saving Profile...</span>
                    </>
                  ) : (
                    <span className="relative z-10">Complete Setup</span>
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
  <div className="bg-brand-50/50 rounded-md p-10 border border-brand-100 shadow-inner group/sec hover:bg-white transition-all duration-500">
    <div className="mb-8">
      <h3 className="text-xl font-bold text-brand-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-brand-400 font-semibold mt-1 opacity-60 italic">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-brand-300 px-1">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max}
      className="block w-full border border-brand-100 text-brand-900 font-semibold text-sm rounded-md px-5 py-4 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-900 transition-all bg-white shadow-inner placeholder:opacity-30"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-brand-300 px-1">{label}</label>
    <div className="relative group/sel">
      <select name={name} value={value} onChange={onChange} className="block w-full border border-brand-100 text-brand-900 font-semibold text-sm rounded-md px-5 py-4 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-900 transition-all bg-white shadow-inner appearance-none cursor-pointer">
        <option value="" className="text-gray-400">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div className="space-y-3">
    <label className="block text-xs font-bold text-brand-300 px-1">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="block w-full border border-brand-100 text-brand-900 font-semibold text-sm rounded-md px-5 py-5 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-900 transition-all bg-white shadow-inner placeholder:opacity-30" />
  </div>
);

export default AfterSignup;
