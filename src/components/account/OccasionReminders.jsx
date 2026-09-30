import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CalendarHeart, Plus, Gift, Trash2, Bell, Sparkles, X, Heart } from 'lucide-react';

export const OccasionReminders = () => {
  const { occasions, addOccasion, deleteOccasion } = useAuth();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    relation: 'Friend',
    suggestedCategory: 'Personalized Gifts',
    giftIdea: 'Custom Photo Frame or Celebration Hamper',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    // Calculate approximate days left
    const target = new Date(formData.date);
    const now = new Date();
    const diffTime = target - now;
    const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    addOccasion({
      ...formData,
      daysLeft,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECE7EC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1217]">Occasion Reminder Calendar</h2>
          <p className="text-xs text-[#6F6870] mt-0.5">
            Add birthdays & anniversaries for loved ones to get curated gift recommendations 7 days in advance.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              date: '',
              relation: 'Friend',
              suggestedCategory: 'Personalized Gifts',
              giftIdea: '',
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus size={15} />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Occasion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {occasions.map((occ) => (
          <div
            key={occ.id}
            className="bg-white rounded-2xl p-5 border border-[#ECE7EC] shadow-xs hover:border-[#D5CAD0] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Title + Days Left Pill */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-[#1E1217] flex items-center gap-1.5">
                    <Heart size={14} className="text-[#821D38] fill-[#821D38]" />
                    <span>{occ.title}</span>
                  </h3>
                  <span className="text-[11px] text-[#6F6870]">
                    Relationship: <strong className="text-neutral-700">{occ.relation}</strong> • Date: {occ.date}
                  </span>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FDF2F4] text-[#821D38] border border-[#F2D1D8] whitespace-nowrap">
                  {occ.daysLeft ? `In ${occ.daysLeft} days` : 'Upcoming'}
                </span>
              </div>

              {/* Curated Gift Idea Recommendation */}
              <div className="mt-3 p-3 rounded-xl bg-[#FAF8FA] border border-[#ECE7EC] text-xs">
                <span className="font-bold text-[#821D38] flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                  <Gift size={12} />
                  <span>Curated Gift Suggestion</span>
                </span>
                <p className="text-[#29252A] font-medium leading-snug">
                  {occ.giftIdea || 'Luxury celebration gift hamper & handwritten card'}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-[#F2EAEF] flex items-center justify-between text-xs">
              <button
                onClick={() => navigate('/personalized-gifts')}
                className="text-xs font-semibold text-[#821D38] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Find Gifts for {occ.relation}</span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Delete reminder for ${occ.title}?`)) {
                    deleteOccasion(occ.id);
                  }
                }}
                className="text-neutral-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                title="Delete reminder"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-neutral-100 p-6 font-sans"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F0E6EC] mb-4">
              <h3 className="text-base font-bold text-[#1E1217]">
                Add Special Occasion Reminder
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#29252A] mb-1">Occasion Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mom's 50th Birthday, Wedding Anniversary"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#29252A] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#29252A] mb-1">Relationship</label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38] bg-white cursor-pointer"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Friend">Friend / Bestie</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#29252A] mb-1">Gift Ideas / Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Loves dark chocolate hampers & scented candles"
                  value={formData.giftIdea}
                  onChange={(e) => setFormData({ ...formData, giftIdea: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-neutral-900 focus:outline-none focus:border-[#821D38]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E6EC]">
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionReminders;
