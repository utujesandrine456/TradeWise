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
  const [originalData, setOriginalData] = useState({});
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


  const hasChangesMemo = useMemo(() => {
    if (!originalData || Object.keys(originalData).length === 0) return false;

    return Object.keys(formData).some(key => {
      let currentValue = formData[key];
      let originalValue = originalData[key];

      if (key === 'foundedYear' || key === 'anualRevenue' || key === 'numberOfEmployees') {
        const currentNum = currentValue === '' ? 0 : Number(currentValue);
        const originalNum = originalValue === '' ? 0 : Number(originalValue);
        return currentNum !== originalNum;
      }

      return currentValue !== originalValue;
    });
  }, [formData, originalData]);

  useEffect(() => {
    if (profileData) {
      const mappedData = {
        enterpriseDescription: profileData.enterpriseDescription || '',
        name: profileData.name || '',
        currency: profileData.currency || '',
        businessType: profileData.businessType || '',
        industry: profileData.industry || '',
        foundedYear: profileData.foundedYear || '',
        description: profileData.description || '',
        website: profileData.website || '',
        address: profileData.address || '',
        businessHours: profileData.businessHours || '',
        phoneNumber: profileData.phoneNumber || '',
        anualRevenue: profileData.anualRevenue || '',
        numberOfEmployees: profileData.numberOfEmployees || '',
        paymentMethod: profileData.paymentMethod || '',
        targetMarket: profileData.targetMarket || '',
        competitors: profileData.competitors || '',
        goals: profileData.goals || '',
        sendMessage: profileData.sendMessage || ''
      };

      setFormData(mappedData);
      setOriginalData(mappedData);
    }
  }, [profileData]);

  const getModifiedFields = () => {
    const modified = {};

    Object.keys(formData).forEach(key => {
      const currentValue = formData[key];
      const originalValue = originalData[key];

      if (currentValue !== originalValue) {
        if (key === 'foundedYear' || key === 'anualRevenue' || key === 'numberOfEmployees') {
          modified[key] = currentValue === '' ? undefined : Number(currentValue);
        } else {
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

  const onSave = async () => {
    try {
      const modifiedData = getModifiedFields();

      const res = await backendApi.post('/auth/onboarding', modifiedData);

      if (profileData) {
        setProfileData(prev => ({
          ...prev,
          ...modifiedData
        }));
      }

      setOriginalData(prev => ({
        ...prev,
        ...modifiedData
      }));

      setEditing(false);
      toast.success("Profile and settings saved successfully");
    } catch (error) {
      const refinedError = handleError(error);
      console.error(refinedError, error);
      toast.error(refinedError.message);
    }
  };

  const onCancel = () => {
    setFormData(originalData);
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      if (value === '' || !isNaN(value)) {
        const numValue = value === '' ? '' : Number(value);
        if (numValue >= 0) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-Urbanist">
      {/* Header Card */}
      <div className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm relative">
        <div className="bg-gray-50/50 px-10 py-16 relative overflow-hidden transition-all duration-700">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-md blur-[120px] -mr-[300px] -mt-[300px] pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-[#09111E] mb-2">My Profile</h1>
              <p className="text-[#09111E]/80 font-medium text-lg opacity-60">Control your business information and preferences</p>
            </div>
          </div>
        </div>
        <div className="p-10 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Badge icon={<MdBusiness className="text-[#09111E]" />} label="Business" value={profileData?.name || formData.name || 'Set Name'} />
            <Badge icon={<MdEmail className="text-[#09111E]" />} label="Currency" value={profileData?.currency || formData.currency || 'Not Set'} />
            <Badge icon={<MdShield className="text-[#09111E]" />} label="Industry" value={profileData?.industry || formData.industry || 'Not Set'} />
          </div>
          <div className="mt-12 bg-[#09111E] p-6 rounded-md border border-white/5 shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000 blur-2xl opacity-60" />
            <div className="flex items-center justify-between mb-6 px-1 font-bold relative z-10">
              <p className="text-sm font-semibold text-white/40 italic opacity-60">Setup Status</p>
              <p className="text-sm font-semibold text-white italic opacity-80">
                {loading ? 'Syncing...' : `${completeness}% COMPLETE`}
              </p>
            </div>
            {!loading && (
              <div className="w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden shadow-inner relative z-10">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            )}
            <p className="mt-6 text-[10px] font-bold text-white/20 px-1 italic relative z-10 opacity-40">
              Keep your profile updated for better business insights
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-3 bg-white rounded-md border border-gray-100 shadow-sm relative overflow-hidden font-bold">
        <div className="absolute inset-0 bg-gray-50/50 pointer-events-none" />
        <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>The Basics</TabButton>
        <TabButton active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')}>Contact Info</TabButton>
        <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')}>Safety</TabButton>
        <TabButton active={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')}>Alerts</TabButton>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <TabHeader
            title="General Info"
            subtitle="Tell us about your business"
            editing={editing}
            loading={loading}
            hasChanges={hasChangesMemo}
            onEdit={() => setEditing(true)}
            onSave={onSave}
            onCancel={onCancel}
          />

          <Section title="The Core Details" subtitle="Fundamental business attributes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Company Name" name="name" value={formData.name} onChange={handleChange} required disabled={!editing} placeholder="Enter your business name" />
              <SelectField label="Business Type" name="businessType" value={formData.businessType} onChange={handleChange} options={['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Franchise', 'Other']} disabled={!editing} />
              <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., Tech, Retail, Logistics" disabled={!editing} />
              <SelectField label="Trading Currency" name="currency" value={formData.currency} onChange={handleChange} options={['USD', 'EUR', 'GBP', 'RWF', 'KES', 'UGX', 'TZS']} disabled={!editing} />
              <div className="md:col-span-2">
                <TextAreaField label="Business Bio" name="description" value={formData.description} onChange={handleChange} placeholder="What does your company do? (briefly)" rows={3} disabled={!editing} />
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <TabHeader title="Get In Touch" subtitle="Where can people find you?" editing={editing} loading={loading} hasChanges={hasChangesMemo} onEdit={() => setEditing(true)} onSave={onSave} onCancel={onCancel} />
          <Section title="Communication Channels" subtitle="Phone, Web, and Physical presence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InputField label="Official Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+250..." disabled={!editing} />
              <InputField label="Digital Domain (Website)" name="website" value={formData.website} onChange={handleChange} type="url" placeholder="https://www.example.com" disabled={!editing} />
              <div className="md:col-span-2">
                <TextAreaField label="Physical Address" name="address" value={formData.address} onChange={handleChange} placeholder="Full business location details..." rows={2} disabled={!editing} />
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-[#09111E] mb-3">Login Security</h2>
              <p className="text-sm font-semibold text-[#09111E]/60 opacity-60">Control your passwords and account access</p>
            </div>
          </div>
          <Section title="Safety Protocols" subtitle="Enhance your workspace security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-10 py-8 shadow-sm">
                <span className="text-lg font-bold text-[#09111E]">Step-2 Verification</span>
                <span className="text-[10px] font-bold px-4 py-2 rounded-md bg-gray-200 text-[#09111E]/40 border border-gray-300 italic font-Urbanist">Protocol Disabled</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-10 py-8 shadow-sm">
                <span className="text-lg font-bold text-[#09111E]">Reset Password</span>
                <span className="text-[10px] font-bold px-4 py-2 rounded-md bg-[#09111E] text-white cursor-pointer hover:bg-black transition-all font-Urbanist">Update Key</span>
              </div>
            </div>
          </Section>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-[#09111E] mb-3">Alert Preferences</h2>
              <p className="text-sm font-semibold text-[#09111E]/60 opacity-60">Decide how you want to be notified</p>
            </div>
          </div>
          <Section title="Inbox & Push" subtitle="Choose your communication style">
            <div className="grid grid-cols-1 gap-6">
              <label className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-10 py-8 cursor-pointer hover:bg-gray-100 transition-all group shadow-sm">
                <span className="text-lg font-bold text-[#09111E]">Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-6 h-6 cursor-pointer rounded accent-[#09111E] bg-white border-gray-100" />
              </label>
              <label className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-10 py-8 cursor-pointer hover:bg-gray-100 transition-all group shadow-sm">
                <span className="text-lg font-bold text-[#09111E]">Weekly Activity Digest</span>
                <input type="checkbox" className="w-6 h-6 cursor-pointer rounded accent-[#09111E] bg-white border-gray-100" />
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
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4 bg-white border border-gray-100 p-12 rounded-md shadow-sm relative overflow-hidden group">
    <div className="absolute inset-0 bg-gray-50/30 opacity-50 pointer-events-none" />
    <div className="relative z-10">
      <h2 className="text-4xl font-bold text-[#09111E] leading-none mb-3">{title}</h2>
      <p className="text-sm font-semibold text-[#09111E]/60 opacity-60 italic">{subtitle}</p>
    </div>
    {!editing ? (
      <button
        className={`group flex items-center gap-4 px-6 py-4 rounded-md text-sm font-semibold transition-all shadow-md overflow-hidden active:scale-95 relative z-10 ${loading
          ? 'bg-gray-100 text-[#09111E]/30 cursor-not-allowed opacity-40'
          : 'bg-[#09111E] text-white hover:bg-black'
          }`}
        onClick={loading ? undefined : onEdit}
        disabled={loading}
      >
        <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
        <MdEdit className="text-xl relative z-10" />
        <span className="relative z-10">{loading ? 'Syncing...' : 'Modify Details'}</span>
      </button>
    ) : (
      <div className="flex items-center gap-6 relative z-10 font-bold italic text-[10px]">
        <button
          className={`flex items-center gap-4 px-10 py-5 rounded-md transition-all shadow-sm active:scale-95 ${hasChanges
            ? 'bg-[#09111E] text-white hover:bg-black'
            : 'bg-gray-100 text-[#09111E]/30 cursor-not-allowed opacity-50'
            }`}
          onClick={hasChanges ? onSave : undefined}
          disabled={!hasChanges}
        >
          <MdCheck className="text-xl" /> Commit Changes
        </button>
        <button
          className="flex items-center gap-4 px-10 py-5 rounded-md bg-white border border-gray-100 text-[#09111E]/60 hover:text-[#09111E] transition-all shadow-sm active:scale-95"
          onClick={onCancel}
        >
          <MdClose className="text-xl" /> Abort
        </button>
      </div>
    )}
  </div>
);

// Helper Components
const Section = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-md p-12 border border-gray-100 shadow-sm relative overflow-hidden group/section">
    <div className="absolute top-0 left-0 w-1.5 h-0 bg-[#09111E] group-hover/section:h-full transition-all duration-300 rounded-md" />
    <div className="mb-12 relative z-10">
      <h3 className="text-2xl font-bold text-[#09111E] leading-none mb-3">{title}</h3>
      {subtitle && <p className="text-sm font-semibold text-[#09111E]/60 opacity-60 italic">{subtitle}</p>}
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-10 py-4 rounded-md text-sm font-semibold transition-all duration-500 ${active
      ? 'bg-[#09111E] text-white shadow-lg scale-105'
      : 'bg-transparent text-[#09111E]/40 hover:text-[#09111E] hover:bg-gray-50'
      }`}
  >
    {children}
  </button>
);

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, min, max, disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-[#09111E]/60 px-2">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
      min={min} max={max} disabled={disabled}
      className={`block w-full bg-gray-50 border border-gray-100 rounded-md px-8 py-4 text-[#09111E] text-sm font-bold transition-all placeholder:text-[#09111E]/20 shadow-inner ${disabled
        ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-100'
        : 'focus:outline-none focus:ring-4 focus:ring-gray-50 focus:border-gray-200'
        }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-[#09111E]/60 px-2">{label}</label>
    <div className="relative">
      <select
        name={name} value={value} onChange={onChange} disabled={disabled}
        className={`block w-full bg-gray-50 border border-gray-100 rounded-md px-8 py-4 text-[#09111E] text-sm font-bold transition-all appearance-none cursor-pointer shadow-inner ${disabled
          ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-100'
          : 'focus:outline-none focus:ring-4 focus:ring-gray-50 focus:border-gray-200'
          }`}
      >
        <option value="" className="bg-white">Choose {label}</option>
        {options.map(opt => <option key={opt} value={opt} className="bg-white">{opt}</option>)}
      </select>
    </div>
  </div>
);

const Badge = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 bg-[#09111E] rounded-md border border-white/5 p-8 shadow-2xl transition-all hover:shadow-brand-500/10 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-md blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-all group-hover:bg-white group-hover:border-[#09111E]/20 shadow-inner">
      <div className="text-3xl transition-transform group-hover:scale-110 text-white">
        {icon && React.isValidElement(icon) ? React.cloneElement(icon, { className: 'text-white' }) : icon}
      </div>
    </div>
    <div className="min-w-0 relative z-10">
      <p className="text-[10px] font-bold text-white/40 leading-none mb-3 italic opacity-60">{label}</p>
      <p className="text-lg font-bold text-white truncate group-hover:tracking-tight transition-all">{value}</p>
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3, disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-[#09111E]/60 px-2">{label}</label>
    <textarea
      name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} disabled={disabled}
      className={`block w-full bg-gray-50 border border-gray-100 rounded-md px-8 py-4 text-[#09111E] text-sm font-bold transition-all placeholder:text-[#09111E]/20 shadow-inner resize-none ${disabled
        ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-100'
        : 'focus:outline-none focus:ring-4 focus:ring-gray-50 focus:border-gray-200'
        }`}
    />
  </div>
);

export default Profile;

