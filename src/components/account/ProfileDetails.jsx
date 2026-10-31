import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Calendar, CheckCircle2, Save } from 'lucide-react';

export const ProfileDetails = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || 'Male',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#ECE7EC] shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#F2EAEF] gap-2 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1E1217]">Personal Information</h2>
          <p className="text-xs text-[#6F6870] mt-0.5">
            Manage your personal profile and contact information.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Profile Updated Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* First Name */}
          <div>
            <label className="block text-xs font-bold text-[#29252A] mb-1.5">
              First Name
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-neutral-400" />
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-bold text-[#29252A] mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#29252A] mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-neutral-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-[#29252A] mb-1.5">
              Mobile Number (+91)
            </label>
            <div className="relative flex items-center">
              <Phone size={16} className="absolute left-3.5 text-neutral-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-[#29252A] mb-1.5">
              Date of Birth
            </label>
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-3.5 text-neutral-400" />
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
              />
            </div>
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-bold text-[#29252A] mb-2">Gender</label>
          <div className="flex items-center gap-4 text-xs">
            {['Male', 'Female', 'Other'].map((genderOption) => (
              <label key={genderOption} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={genderOption}
                  checked={formData.gender === genderOption}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="accent-[#821D38] w-4 h-4 cursor-pointer"
                />
                <span className="text-[#29252A] font-medium">{genderOption}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            <Save size={15} />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetails;
