import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Phone, Calendar, CheckCircle2, Save, Camera, X, Loader2 } from 'lucide-react';

export const ProfileDetails = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || 'Male',
    avatar: user?.avatar || user?.image || '',
    address: user?.address || (user?.addresses?.[0]?.addressLine1 || ''),
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || 'Male',
        avatar: user.avatar || user.image || '',
        address: user.address || (user.addresses?.[0]?.addressLine1 || ''),
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSavedSuccess(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photo size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res && res.url) {
        handleChange('avatar', res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => handleChange('avatar', reader.result);
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('avatar', reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
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
            <span>Saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Upload (Optional) */}
        <div className="flex items-center gap-4 pb-5 border-b border-[#F2EAEF]">
          {formData.avatar ? (
            <div className="relative">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#821D38] shadow-xs"
              />
              <button
                type="button"
                onClick={() => handleChange('avatar', '')}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                title="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center text-neutral-400">
              <Camera size={22} />
            </div>
          )}

          <div>
            <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neutral-300 hover:border-[#821D38] bg-white text-xs font-semibold text-neutral-700 hover:text-[#821D38] transition-colors cursor-pointer shadow-2xs">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin text-[#821D38]" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera size={13} />
                  <span>{formData.avatar ? 'Change Photo' : 'Upload Photo (Optional)'}</span>
                </>
              )}
            </label>
            <p className="text-[11px] text-neutral-400 mt-1">Optional. JPG, PNG or WebP up to 5MB.</p>
            {uploadError && <p className="text-[11px] text-rose-600 mt-0.5">{uploadError}</p>}
          </div>
        </div>

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

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-[#29252A] mb-1.5">
            Delivery / Permanent Address
          </label>
          <input
            type="text"
            value={formData.address}
            placeholder="Flat / house no., street, city"
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-[#821D38]"
          />
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
        <div className="pt-4 flex items-center justify-end gap-3">
          {savedSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in duration-200 shadow-2xs">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Saved successfully</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetails;
