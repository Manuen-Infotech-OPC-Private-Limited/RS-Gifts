import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccountSidebar } from '../components/account/AccountSidebar';
import { OrdersList } from '../components/account/OrdersList';
import { ProfileDetails } from '../components/account/ProfileDetails';
import { AddressBook } from '../components/account/AddressBook';
import { Lock } from 'lucide-react';

export const AccountPage = () => {
  const { user, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get('tab');
  const validTabs = ['orders', 'profile', 'addresses'];
  const tabParam = validTabs.includes(rawTab) ? rawTab : 'orders';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'occasions') {
      setActiveTab('orders');
      setSearchParams({ tab: 'orders' });
    } else if (currentTab && validTabs.includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="w-full bg-[#FFF9F5] py-16 px-4 font-sans select-none min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#ECE7EC] shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <h2 className="text-xl font-bold text-[#1E1217]">
            Sign In to View Your Account
          </h2>
          <p className="text-xs text-[#6F6870] leading-relaxed">
            Track your ongoing shipments, review past orders, and manage saved delivery addresses.
          </p>

          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFF9F5] py-6 sm:py-8 font-sans select-none min-h-[75vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Dashboard 2-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left Column: Navigation Sidebar */}
          <AccountSidebar
            activeTab={activeTab}
            onSelectTab={handleTabChange}
          />

          {/* Right Column: Dynamic Content Tab */}
          <main className="flex-1 w-full min-w-0">
            {activeTab === 'orders' && <OrdersList />}
            {activeTab === 'profile' && <ProfileDetails />}
            {activeTab === 'addresses' && <AddressBook />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
