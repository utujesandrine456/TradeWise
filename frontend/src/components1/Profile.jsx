import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CgProfile } from 'react-icons/cg';
import { MdEdit, MdClose, MdCheck, MdShield, MdEmail, MdBusiness, MdCalendarToday } from 'react-icons/md';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    company_name: user?.company_name || '',
    email: user?.email || '',
    role: user?.role || 'Owner',
  });

  const completeness = useMemo(() => {
    let filled = 0;
    const fields = ['company_name', 'email', 'role'];
    fields.forEach(f => { if (draft[f] && String(draft[f]).trim() !== '') filled += 1; });
    return Math.round((filled / fields.length) * 100);
  }, [draft]);

  const initials = useMemo(() => {
    const name = draft.company_name || 'User';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || 'U';
    const second = parts[1]?.[0] || '';
    return (first + second).toUpperCase();
  }, [draft.company_name]);

  const onSave = () => {
    // UI-only demo; no persistence
    setEditing(false);
  };

  const onCancel = () => {
    setDraft({
      company_name: user?.company_name || '',
      email: user?.email || '',
      role: user?.role || 'Owner',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-500 to-amber-500 text-white px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="opacity-90">Manage your account details</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold border border-white/30">
              {initials}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Badge icon={<MdBusiness className="text-[#BE741E]"/>} label="Company" value={draft.company_name || '—'} />
            <Badge icon={<MdEmail className="text-[#BE741E]"/>} label="Email" value={draft.email || '—'} />
            <Badge icon={<MdShield className="text-[#BE741E]"/>} label="Role" value={draft.role || '—'} />
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Profile completeness</p>
              <p className="text-sm font-medium text-gray-900">{completeness}%</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#BE741E] rounded-full transition-all" style={{ width: `${completeness}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <TabButton active={activeTab==='overview'} onClick={()=>setActiveTab('overview')}>Overview</TabButton>
        <TabButton active={activeTab==='company'} onClick={()=>setActiveTab('company')}>Company</TabButton>
        <TabButton active={activeTab==='security'} onClick={()=>setActiveTab('security')}>Security</TabButton>
        <TabButton active={activeTab==='preferences'} onClick={()=>setActiveTab('preferences')}>Preferences</TabButton>
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Account Overview</h2>
            {!editing ? (
              <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm" onClick={()=>setEditing(true)}>
                <MdEdit/> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm" onClick={onSave}>
                  <MdCheck/> Save
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm" onClick={onCancel}>
                  <MdClose/> Cancel
                </button>
              </div>
            )}
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Company Name" value={draft.company_name} editing={editing} onChange={(v)=>setDraft(d=>({...d, company_name:v}))} />
            <Field label="Email" value={draft.email} type="email" editing={editing} onChange={(v)=>setDraft(d=>({...d, email:v}))} />
            <Field label="Role" value={draft.role} editing={editing} onChange={(v)=>setDraft(d=>({...d, role:v}))} />
            <StaticField label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'} />
          </div>
        </div>
      )}

      {/* Company */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Company Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaticField label="Company" value={draft.company_name || '—'} />
            <StaticField label="Industry" value={user?.industry || '—'} />
            <StaticField label="Employees" value={user?.employee_count || '—'} />
            <StaticField label="Founded" value={user?.founded_year || '—'} />
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">UI only</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RowAction label="Two-Factor Authentication" value="Disabled" actionLabel="Enable" />
            <RowAction label="Password" value="Last updated —" actionLabel="Change" />
          </div>
        </div>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Toggle label="Email notifications" defaultChecked />
            <Toggle label="Weekly summary" />
            <Toggle label="Product updates" />
          </div>
        </div>
      )}
    </div>
  );
};

const Badge = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/80 border border-gray-100 rounded-xl p-3">
    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm border transition ${active ? 'bg-[#BE741E] text-white border-[#BE741E]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
    {children}
  </button>
);

const Field = ({ label, value, onChange, editing, type = 'text' }) => (
  <div>
    <label className="block text-sm text-gray-500">{label}</label>
    {editing ? (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 bg-white/80 focus:ring-2 focus:ring-amber-500/40 focus:border-transparent" />
    ) : (
      <div className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 bg-white/80">{value || '—'}</div>
    )}
  </div>
);

const StaticField = ({ label, value }) => (
  <div>
    <label className="block text-sm text-gray-500">{label}</label>
    <div className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 bg-white/80">{value}</div>
  </div>
);

const RowAction = ({ label, value, actionLabel }) => (
  <div>
    <label className="block text-sm text-gray-500">{label}</label>
    <div className="mt-1 flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-white/80">
      <span className="text-gray-800">{value}</span>
      <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">{actionLabel}</button>
    </div>
  </div>
);

const Toggle = ({ label, defaultChecked }) => (
  <label className="flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 bg-white/80 cursor-pointer">
    <span className="text-gray-800 text-sm">{label}</span>
    <input type="checkbox" defaultChecked={defaultChecked} className="accent-[#BE741E] w-4 h-4" />
  </label>
);

export default Profile;
