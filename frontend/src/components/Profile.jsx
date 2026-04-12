import React, { useEffect, useMemo, useState } from 'react';
import { MdEdit, MdClose, MdCheck, MdShield, MdEmail, MdBusiness } from 'react-icons/md';
import { useSelector } from 'react-redux';
import backendApi from '../utils/axiosInstance';
import { handleError } from '../utils/handleError';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserProfile() {
      try {
        setLoading(true);
        const res = await backendApi.get('/auth/settings');
        setProfileData(res.data);
      } catch (error) {
        const refinedError = handleError(error);
        toast.error(refinedError.message);
      } finally {
        setLoading(false);
      }
    }
    getUserProfile();
  }, [user])

  const [activeTab, setActiveTab] = useState('basic');
  const [editing, setEditing] = useState(false);
  const [originalData, setOriginalData] = useState({}); // Track original values for comparison
  const [formData, setFormData] = useState({
    // All fields from backend onboardingSchema
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

  // Check if formData differs from originalData (with proper normalization for number fields)
  const hasChangesMemo = useMemo(() => {
    if (!originalData || Object.keys(originalData).length === 0) return false;

    return Object.keys(formData).some(key => {
      let currentValue = formData[key];
      let originalValue = originalData[key];

      // Normalize number fields for comparison
      if (key === 'foundedYear' || key === 'anualRevenue' || key === 'numberOfEmployees') {
        // Convert both to numbers for comparison (empty string becomes 0)
        const currentNum = currentValue === '' ? 0 : Number(currentValue);
        const originalNum = originalValue === '' ? 0 : Number(originalValue);
        return currentNum !== originalNum;
      }

      // For other fields, compare as strings
      return currentValue !== originalValue;
    });
  }, [formData, originalData]);

  // Update formData when profileData is loaded
  useEffect(() => {
    if (profileData) {
      const mappedData = {
        // Map all backend onboardingSchema fields to formData
        enterpriseDescription: profileData.enterpriseDescription || '',
        name: profileData.name || '',
        currency: profileData.currency || '',
        businessType: profileData.businessType || '',
        industry: profileData.industry || '',
        foundedYear: profileData.foundedYear || '', // API should return number, but form needs string
        description: profileData.description || '',
        website: profileData.website || '',
        address: profileData.address || '',
        businessHours: profileData.businessHours || '',
        phoneNumber: profileData.phoneNumber || '',
        anualRevenue: profileData.anualRevenue || '', // API should return number, but form needs string
        numberOfEmployees: profileData.numberOfEmployees || '', // API should return number, but form needs string
        paymentMethod: profileData.paymentMethod || '',
        targetMarket: profileData.targetMarket || '',
        competitors: profileData.competitors || '',
        goals: profileData.goals || '',
        sendMessage: profileData.sendMessage || ''
      };

      setFormData(mappedData);
      setOriginalData(mappedData); // Store original values for comparison
      // hasChangesMemo will automatically update to false since formData now matches originalData
    }
  }, [profileData]);

  const getModifiedFields = () => {
    const modified = {};

    // Compare formData with originalData and include changed fields
    Object.keys(formData).forEach(key => {
      const currentValue = formData[key];
      const originalValue = originalData[key];

      // Check if field has changed (including clearing fields)
      if (currentValue !== originalValue) {
        if (key === 'foundedYear' || key === 'anualRevenue' || key === 'numberOfEmployees') {
          // Convert number fields to numbers for API
          modified[key] = currentValue === '' ? undefined : Number(currentValue);
        } else {
          // Send empty strings for cleared optional fields
          modified[key] = currentValue;
        }
      }
    });

    return modified;
  };

  const completeness = useMemo(() => {
    if (loading || !profileData) return 0;

    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter(value =>
      value !== '' && value !== null && value !== undefined
    ).length;
    return Math.min(100, Math.round((filled / total) * 100));
  }, [formData, profileData, loading]);

  const initials = useMemo(() => {
    const name = profileData?.name || formData.name || 'User';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || 'U';
    const second = parts[1]?.[0] || '';
    return (first + second).toLowerCase();
  }, [profileData?.name, formData.name]);

  const onSave = async () => {
    try {
      // Only send modified fields to backend (including cleared fields)
      const modifiedData = getModifiedFields();

      // Always send the update, even if no fields changed (for consistency)
      const res = await backendApi.post('/auth/onboarding', modifiedData);

      // Update local profile data with only the changed fields
      if (profileData) {
        setProfileData(prev => ({
          ...prev,
          ...modifiedData
        }));
      }

      // Update originalData to reflect the new state
      setOriginalData(prev => ({
        ...prev,
        ...modifiedData
      }));

      setEditing(false);
      // hasChangesMemo will automatically update to false since formData now matches originalData
      toast.success("Profile and settings saved successfully");
    } catch (error) {
      const refinedError = handleError(error);
      console.error(refinedError, error);
      toast.error(refinedError.message);
    }
  };

  const onCancel = () => {
    // Reset form to original values (before any edits)
    setFormData(originalData);
    setEditing(false);
    // hasChangesMemo will automatically update to false since formData now matches originalData
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle number fields with proper validation
    if (type === 'number') {
      // Allow empty values or valid numbers
      if (value === '' || !isNaN(value)) {
        const numValue = value === '' ? '' : Number(value);
        if (numValue >= 0) { // Prevent negative numbers
          setFormData(prev => ({ ...prev, [name]: value })); // Keep as string for form
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Change detection is now handled by useMemo (hasChangesMemo)
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Card */}
      <div className="bg-brand-900 rounded-md border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="bg-brand-950/50 px-10 py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-400/5 rounded-md blur-[120px] -mr-[300px] -mt-[300px] pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white tracking-tight mb-2">Profile Settings</h1>
              <p className="text-brand-300 font-semibold text-lg opacity-60">Manage your business profile and account preferences</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-md bg-white/5 border border-white/10 backdrop-blur-3xl flex items-center justify-center text-accent-400 text-4xl font-bold shadow-2xl">
                {initials}
              </div>
            </div>
          </div>
        </div>
        <div className="p-10 bg-brand-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Badge icon={<MdBusiness className="text-accent-400" />} label="Corporate Identity" value={profileData?.name || formData.name || '—'} />
            <Badge icon={<MdEmail className="text-accent-400" />} label="Operational Currency" value={profileData?.currency || formData.currency || '—'} />
            <Badge icon={<MdShield className="text-accent-400" />} label="Industry Sector" value={profileData?.industry || formData.industry || '—'} />
          </div>
          <div className="mt-12 bg-white/5 p-8 rounded-md border border-white/5 shadow-inner">
            <div className="flex items-center justify-between mb-5 px-1">
              <p className="text-xs font-bold text-brand-300 opacity-60">Setup Progress</p>
              <p className="text-xs font-bold text-brand-500">
                {loading ? 'Loading...' : `${completeness}% complete`}
              </p>
            </div>
            {!loading && (
              <div className="w-full h-4 bg-brand-950 border border-white/5 rounded-md overflow-hidden p-1 shadow-inner">
                <div
                  className="h-full bg-accent-400 rounded-md transition-all duration-1000 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Protocols (Tabs) */}
      <div className="flex flex-wrap gap-3 p-3 bg-brand-900 rounded-md border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
        <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>Identity</TabButton>
        <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Manifesto</TabButton>
        <TabButton active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')}>Communication</TabButton>
        <TabButton active={activeTab === 'scale'} onClick={() => setActiveTab('scale')}>Operations</TabButton>
        <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>Settlement</TabButton>
        <TabButton active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')}>Strategy</TabButton>
        <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')}>Encryption</TabButton>
        <TabButton active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')}>Configurations</TabButton>
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Header with Edit/Save buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">General Information</h2>
              <p className="text-xs font-semibold text-brand-300 opacity-60">Manage your core business identity and presence</p>
            </div>
            {!editing ? (
              <button
                className={`group relative flex items-center gap-4 px-10 py-5 rounded-md text-sm font-bold transition-all shadow-2xl overflow-hidden active:scale-95 ${loading
                  ? 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'
                  : 'bg-brand-900 text-white hover:scale-105'
                  }`}
                onClick={loading ? undefined : () => setEditing(true)}
                disabled={loading}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <MdEdit className="text-xl relative z-10" />
                <span className="relative z-10">{loading ? 'Loading...' : 'Edit Profile'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-4 relative z-10">
                <button
                  className={`flex items-center gap-4 px-10 py-5 rounded-md text-sm font-bold transition-all shadow-2xl active:scale-95 ${hasChangesMemo
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'
                    }`}
                  onClick={hasChangesMemo ? onSave : undefined}
                  disabled={!hasChangesMemo}
                >
                  <MdCheck className="text-xl" /> Save Changes
                </button>
                <button
                  className="flex items-center gap-4 px-10 py-5 rounded-md bg-white/5 border border-white/10 text-brand-300 text-sm font-bold transition-all hover:bg-white/10 hover:text-white shadow-xl active:scale-95"
                  onClick={onCancel}
                >
                  <MdClose className="text-xl" /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Basic Information Section */}
          <Section title="Basic Information" subtitle="Tell us about your business.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Company Name *" name="name" value={formData.name} onChange={handleChange} required disabled={!editing} />
              <InputField label="Enterprise Description" name="enterpriseDescription" value={formData.enterpriseDescription} onChange={handleChange} placeholder="Brief description of your enterprise" disabled={!editing} />
              <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Franchise', 'Other']} disabled={!editing} />
              <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology, Retail, Manufacturing" disabled={!editing} />
              <InputField label="Founded Year" name="foundedYear" value={formData.foundedYear} onChange={handleChange} type="number" placeholder="e.g., 2020" min="1900" max={new Date().getFullYear()} disabled={!editing} />
              <SelectField label="Currency" name="currency" value={formData.currency} onChange={handleChange} options={['USD', 'EUR', 'GBP', 'RWF', 'KES', 'UGX', 'TZS']} disabled={!editing} />
            </div>
          </Section>
        </div>
      )}

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <TabHeader title="Business Summary" subtitle="Define your business mission and vision" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Business Manifesto" subtitle="Articulate your strategic vision and purpose.">
            <TextAreaField label="Business Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your business, products, and services..." disabled={!editing} />
          </Section>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <TabHeader title="Contact Information" subtitle="Manage your communication channels and presence" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Contact Infrastructure" subtitle="How can clients and partners reach your enterprise?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField label="Physical Address" name="address" value={formData.address} onChange={handleChange} placeholder="Business address" rows={2} disabled={!editing} />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Business phone number" disabled={!editing} />
              <InputField label="Website" name="website" value={formData.website} onChange={handleChange} type="url" placeholder="https://yourwebsite.com" disabled={!editing} />
              <InputField label="Business Hours" name="businessHours" value={formData.businessHours} onChange={handleChange} placeholder="Monday-Friday 9AM-6PM" disabled={!editing} />
            </div>
          </Section>
        </div>
      )}

      {/* Scale & Operations Tab */}
      {activeTab === 'scale' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <TabHeader title="Business Scale" subtitle="Define your operational capacity and fiscal metrics" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Scale Metrics" subtitle="Organizational size and fiscal throughput.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Annual Revenue" name="anualRevenue" value={formData.anualRevenue} onChange={handleChange} type="number" placeholder="Annual revenue amount" disabled={!editing} />
              <InputField label="Workforce Headcount" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} type="number" placeholder="Number of employees" disabled={!editing} />
            </div>
          </Section>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <TabHeader title="Payment Options" subtitle="Configure your preferred financial transaction methods" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Financial Settlement" subtitle="What instruments does your enterprise accept?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Primary Settlement Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={['Cash', 'Credit_Card', 'Debit_Card', 'Bank_Transfer', 'Mobile_Money', 'PayPal', 'Check', 'Crypto']} disabled={!editing} />
            </div>
          </Section>
        </div>
      )}

      {/* Strategy Tab */}
      {activeTab === 'strategy' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <TabHeader title="Market Strategy" subtitle="Define your market position and competitive landscape" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Market Intelligence" subtitle="Who will you serve and how will you dominate?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField label="Target Market" name="targetMarket" value={formData.targetMarket} onChange={handleChange} placeholder="Describe your target market..." rows={3} disabled={!editing} />
              <TextAreaField label="Competitive Landscape" name="competitors" value={formData.competitors} onChange={handleChange} placeholder="List your main competitors..." rows={3} disabled={!editing} />
            </div>
            <TextAreaField label="Strategic Goals" name="goals" value={formData.goals} onChange={handleChange} placeholder="Short-term and long-term goals..." rows={4} disabled={!editing} />
            <TextAreaField label="Additional Directives" name="sendMessage" value={formData.sendMessage} onChange={handleChange} placeholder="Any additional message..." rows={2} disabled={!editing} />
          </Section>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4 bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">Security Settings</h2>
              <p className="text-xs font-semibold text-brand-300 opacity-60">Manage your account authentication and security protocols</p>
            </div>
            <span className="text-xs font-bold text-brand-500 bg-brand-500/10 border border-brand-500/20 px-6 py-3 rounded-md shadow-inner relative z-10">Settings View</span>
          </div>
          <Section title="Security Protocols" subtitle="Account authentication and access control.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-8 py-6 shadow-inner">
                <span className="text-lg font-bold text-white">Two-Factor Authentication</span>
                <span className="text-xs font-bold px-4 py-2 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">Disabled</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-8 py-6 shadow-inner">
                <span className="text-lg font-bold text-white">Account Password</span>
                <span className="text-xs font-bold px-4 py-2 rounded-md bg-white/5 text-brand-300 border border-white/5">Last Updated —</span>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">System Preferences</h2>
              <p className="text-xs font-semibold text-brand-300 opacity-60">Personalize your application experience and alert settings</p>
            </div>
          </div>
          <Section title="Notification Matrix" subtitle="Configure your alert and communication preferences.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-8 py-6 cursor-pointer hover:bg-white/[0.08] transition-all group shadow-inner">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-brand-500 transition-colors">Email Notifications</span>
                <input type="checkbox" defaultChecked className="accent-accent-400 w-5 h-5 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-8 py-6 cursor-pointer hover:bg-white/[0.08] transition-all group shadow-inner">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-brand-500 transition-colors">Weekly Reports</span>
                <input type="checkbox" className="accent-accent-400 w-5 h-5 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between bg-white/5 border border-white/5 rounded-md px-8 py-6 cursor-pointer hover:bg-white/[0.08] transition-all group shadow-inner">
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-brand-500 transition-colors">System Updates</span>
                <input type="checkbox" className="accent-accent-400 w-5 h-5 cursor-pointer" />
              </label>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
};

// Reusable Tab Header with Edit/Save/Cancel Controls
const TabHeader = ({ title, subtitle, editing, loading, hasChanges, onEdit, onSave, onCancel }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4 bg-brand-900 border border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent pointer-events-none" />
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">{title}</h2>
      <p className="text-xs font-semibold text-brand-300 opacity-60">{subtitle}</p>
    </div>
    {!editing ? (
      <button
        className={`group flex items-center gap-4 px-10 py-5 rounded-md text-sm font-bold transition-all shadow-2xl overflow-hidden active:scale-95 relative z-10 ${loading
          ? 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'
          : 'bg-brand-900 text-white hover:scale-105'
          }`}
        onClick={loading ? undefined : onEdit}
        disabled={loading}
      >
        <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
        <MdEdit className="text-xl relative z-10" />
        <span className="relative z-10">{loading ? 'Loading...' : 'Edit Section'}</span>
      </button>
    ) : (
      <div className="flex items-center gap-4 relative z-10">
        <button
          className={`flex items-center gap-4 px-10 py-5 rounded-md text-sm font-bold transition-all shadow-2xl active:scale-95 ${hasChanges
            ? 'bg-emerald-600 text-white'
            : 'bg-white/5 text-brand-300 cursor-not-allowed opacity-40'
            }`}
          onClick={hasChanges ? onSave : undefined}
          disabled={!hasChanges}
        >
          <MdCheck className="text-xl" /> Save
        </button>
        <button
          className="flex items-center gap-4 px-10 py-5 rounded-md bg-white/5 border border-white/10 text-brand-300 text-sm font-bold transition-all hover:bg-white/10 hover:text-white shadow-xl active:scale-95"
          onClick={onCancel}
        >
          <MdClose className="text-xl" /> Cancel
        </button>
      </div>
    )}
  </div>
);

// Helper Components
const Section = ({ title, subtitle, children }) => (
  <div className="bg-brand-900 rounded-md p-12 border border-white/5 shadow-2xl relative overflow-hidden group/section">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-400 to-transparent group-hover/section:translate-x-full transition-transform duration-1000 opacity-50" />
    <div className="mb-12 relative z-10">
      <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-3">{title}</h3>
      {subtitle && <p className="text-xs font-semibold text-brand-300 opacity-40">{subtitle}</p>}
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-10 py-4 rounded-md text-xs font-bold tracking-wider transition-all duration-500 ${active
      ? 'bg-brand-500 text-white shadow-lg scale-105'
      : 'bg-white/5 text-brand-300 hover:text-white hover:bg-white/10'
      }`}
  >
    {children}
  </button>
);

// Input Component
const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max, disabled = false }) => (
  <div className="space-y-4">
    <label className="block text-xs font-bold text-brand-300 px-2 opacity-60">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max} disabled={disabled}
      className={`block w-full bg-white/5 border border-white/5 rounded-md px-6 py-5 text-white text-lg font-bold transition-all placeholder:text-brand-300/20 shadow-inner ${disabled
        ? 'opacity-30 cursor-not-allowed bg-transparent border-white/5'
        : 'focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50'
        }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled = false }) => (
  <div className="space-y-4">
    <label className="block text-xs font-bold text-brand-300 px-2 opacity-60">{label}</label>
    <div className="relative">
      <select
        name={name} value={value} onChange={onChange} disabled={disabled}
        className={`block w-full bg-white/5 border border-white/5 rounded-md px-6 py-5 text-white text-lg font-bold transition-all appearance-none cursor-pointer shadow-inner ${disabled
          ? 'opacity-30 cursor-not-allowed bg-transparent border-white/5'
          : 'focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50'
          }`}
      >
        <option value="" className="bg-brand-900 text-brand-300">Select {label}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-brand-900 text-white">{opt}</option>)}
      </select>
    </div>
  </div>
);

const Badge = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 bg-white/5 rounded-md border border-white/5 p-8 shadow-2xl transition-all hover:border-accent-400/30 hover:bg-white/[0.08] group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-400/5 rounded-md blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-16 h-16 rounded-md bg-white/5 flex items-center justify-center border border-white/5 transition-all group-hover:bg-brand-500 group-hover:text-white shadow-inner">
      <div className="text-3xl transition-transform group-hover:scale-110">
        {icon}
      </div>
    </div>
    <div className="min-w-0 relative z-10">
      <p className="text-xs font-bold text-brand-300 leading-none mb-3 opacity-60">{label}</p>
      <p className="text-xl font-bold text-white truncate">{value}</p>
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3, disabled = false }) => (
  <div className="space-y-4">
    <label className="block text-xs font-bold text-brand-300 px-2 opacity-60">{label}</label>
    <textarea
      name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled}
      className={`block w-full bg-white/5 border border-white/5 rounded-md px-6 py-5 text-white text-lg font-bold transition-all placeholder:text-brand-300/20 shadow-inner resize-none ${disabled
        ? 'opacity-30 cursor-not-allowed bg-transparent border-white/5'
        : 'focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50'
        }`}
    />
  </div>
);

export default Profile;
