import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Plus, Trash2, Edit3, CheckCircle2, Home, Briefcase, Gift, X } from 'lucide-react';

export const AddressBook = () => {
  const { user, addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingAddrId, setDeletingAddrId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    tag: 'Home',
    isDefault: false,
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      tag: 'Home',
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr.id || addr._id);
    setFormData({
      name: addr.name || addr.recipientName || user?.name || '',
      phone: addr.phone || user?.phone || '',
      street: addr.street || addr.addressLine1 || '',
      landmark: addr.landmark || addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || addr.postalCode || '',
      tag: addr.tag || addr.addressType || 'Home',
      isDefault: Boolean(addr.isDefault),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateAddress(editingId, formData);
    } else {
      await addAddress(formData);
    }
    setModalOpen(false);
  };

  const getTagBadge = (tag) => {
    const normalizedTag = (tag || '').toLowerCase().trim();
    if (normalizedTag.includes('gift') || normalizedTag.includes('recipient')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDF2F4] text-[#821D38] border border-[#F2D1D8]">
          <Gift size={11} />
          <span>Gift Recipient</span>
        </span>
      );
    }
    if (normalizedTag.includes('work') || normalizedTag.includes('office')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Briefcase size={11} />
          <span>Work</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
        <Home size={11} />
        <span>Home</span>
      </span>
    );
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECE7EC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1217]">Saved Delivery Addresses</h2>
          <p className="text-xs text-[#6F6870] mt-0.5">
            Manage your personal addresses and surprise gift destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#ECE7EC] text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF0F3] text-[#821D38] flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#1E1217] text-base">No Saved Addresses Yet</h3>
            <p className="text-xs text-[#6F6870] mt-1 max-w-sm">
              Add your delivery addresses to enjoy faster checkouts for yourself and your loved ones.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer mt-2"
          >
            <Plus size={14} />
            <span>Add New Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const addrKey = addr.id || addr._id;
            return (
              <div
                key={addrKey}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${addr.isDefault
                  ? 'border-[#821D38] ring-1 ring-[#821D38]/10'
                  : 'border-[#ECE7EC] hover:border-[#D5CAD0]'
                  }`}
              >
                <div>
                  {/* Top Card Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E1217]">{addr.name || user?.name || addr.tag || 'Saved Address'}</span>
                      {getTagBadge(addr.tag)}
                    </div>

                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Full Address Details */}
                  <div className="text-xs text-[#6F6870] space-y-1 leading-relaxed">
                    <p className="text-neutral-800 font-medium">{addr.street}</p>
                    {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                    <p>
                      {addr.city}, {addr.state} - <strong className="text-neutral-800">{addr.pincode}</strong>
                    </p>
                    {(addr.phone || user?.phone) && (
                      <p className="pt-1 text-[#29252A] font-semibold">
                        Phone: {addr.phone || user?.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 mt-2 flex items-center justify-between text-xs">
                  <div>
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addrKey)}
                        className="text-[#821D38] hover:underline font-semibold cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(addr)}
                      className="inline-flex items-center gap-1 text-[#6F6870] hover:text-[#1E1217] font-semibold cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeletingAddrId(addrKey)}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-neutral-100 p-6 font-sans"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F0E6EC] mb-5">
              <h3 className="text-base font-bold text-[#1E1217]">
                {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#29252A] mb-1">Full Name / Recipient</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shaikabdul Rahaman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#29252A] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#29252A] mb-1">Flat, House no., Building, Street</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Lotus Heights, Road No. 12"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#29252A] mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near City Center Mall / Opposite Metro Pillar"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#29252A] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#29252A] mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#29252A] mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>
              </div>

              {/* Tag Selector */}
              <div>
                <label className="block font-bold text-[#29252A] mb-1.5">Address Type / Recipient Tag</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { tag: 'Home', icon: Home, label: 'Home' },
                    { tag: 'Work', icon: Briefcase, label: 'Work' },
                    { tag: 'Gift Recipient', icon: Gift, label: 'Gift Recipient' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = (formData.tag || 'Home').toLowerCase() === t.tag.toLowerCase();
                    return (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => setFormData({ ...formData, tag: t.tag })}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border font-semibold cursor-pointer transition-colors ${isSelected
                          ? 'bg-[#821D38] text-white border-[#821D38]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                      >
                        <Icon size={13} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Set Default Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isDefault)}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="accent-[#821D38] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="font-semibold text-neutral-700">Set as default delivery address</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E6EC]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Address Confirmation Modal */}
      {deletingAddrId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 space-y-4 font-sans">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">Delete this address?</h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Are you sure you want to remove this delivery address?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeletingAddrId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAddress(deletingAddrId);
                  setDeletingAddrId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer transition-colors shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
